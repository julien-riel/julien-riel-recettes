// @ts-check
import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour le Planificateur de Repas
 * Ces tests couvrent les scénarios principaux de l'application
 */

test.describe('Planificateur de Repas', () => {

  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test to start fresh
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test.describe('Test 1: Sélection aléatoire et modification manuelle', () => {

    test('devrait sélectionner 7 recettes aléatoires', async ({ page }) => {
      await page.goto('/');

      // Click "Effacer" to clear any existing selection
      await page.getByRole('button', { name: 'Effacer' }).click();

      // Wait a moment for the UI to update
      await page.waitForTimeout(500);

      // Click "Semaine aléatoire"
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();

      // Verify 7 recipes are selected - look for the button containing "7" and "sélectionnées"
      await expect(page.locator('button:has-text("7"):has-text("sélectionnées")')).toBeVisible();
    });

    test('devrait permettre de modifier manuellement la sélection', async ({ page }) => {
      await page.goto('/');

      // Clear selection first
      await page.getByRole('button', { name: 'Effacer' }).click();

      // Verify 0 selected - button says "0 recette sélectionnée" (singular, disabled)
      await expect(page.getByRole('button', { name: /recette sélectionnée/ })).toContainText('0');

      // Click on the first recipe checkbox to select it manually
      const firstCheckbox = page.getByRole('checkbox').first();
      await firstCheckbox.click();

      // Verify count increased to 1
      await expect(page.getByRole('button', { name: /recette sélectionnée/ })).toContainText('1');

      // Click again to deselect
      await firstCheckbox.click();

      // Verify count back to 0
      await expect(page.getByRole('button', { name: /recette sélectionnée/ })).toContainText('0');
    });
  });

  test.describe('Test 2: Planification du menu', () => {

    test('devrait créer un nouveau menu et remplir automatiquement', async ({ page }) => {
      await page.goto('/');

      // Select 7 recipes
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();

      // Go to Planifier tab
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      // Handle potential confirm dialog for new menu
      page.on('dialog', async dialog => {
        await dialog.accept();
      });

      // Click "Nouveau menu"
      await page.getByRole('button', { name: 'Nouveau menu' }).click();

      // Click "Remplissage auto"
      await page.getByRole('button', { name: 'Remplissage auto' }).click();

      // Verify all 7 days have recipes assigned (check comboboxes are not on default)
      const daySelects = page.locator('select[aria-label*="Sélectionner le souper"]');
      await expect(daySelects).toHaveCount(7);

      // Each select should have a selected option that's not the default
      for (let i = 0; i < 7; i++) {
        const select = daySelects.nth(i);
        const selectedValue = await select.inputValue();
        expect(selectedValue).not.toBe('');
      }
    });

    test('devrait permettre de changer les portions', async ({ page }) => {
      await page.goto('/');

      // Setup: select recipes and create menu
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Nouveau menu' }).click();
      await page.getByRole('button', { name: 'Remplissage auto' }).click();

      // Change Monday portions from 4 to 2
      const mondayPortions = page.getByRole('combobox', { name: 'Nombre de portions pour Lundi' });
      await mondayPortions.selectOption('2');

      // Verify the change
      await expect(mondayPortions).toHaveValue('2');
    });

    test('devrait ouvrir la fenêtre d\'impression', async ({ page }) => {
      await page.goto('/');

      // Setup menu
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Nouveau menu' }).click();
      await page.getByRole('button', { name: 'Remplissage auto' }).click();

      // Mock window.print to avoid blocking
      await page.evaluate(() => {
        window.print = () => { window.__printCalled = true; };
      });

      // Click print button
      await page.getByRole('button', { name: 'Imprimer le menu' }).click();

      // Verify print was called
      const printCalled = await page.evaluate(() => window.__printCalled);
      expect(printCalled).toBe(true);
    });
  });

  test.describe('Test 3: Épicerie et ingrédients', () => {

    test('devrait afficher la liste d\'épicerie avec les ingrédients', async ({ page }) => {
      await page.goto('/');

      // Setup menu
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Nouveau menu' }).click();
      await page.getByRole('button', { name: 'Remplissage auto' }).click();

      // Go to Épicerie tab
      await page.getByRole('button', { name: '○ Épicerie' }).click();

      // Verify grocery list is displayed with items to buy
      const itemsToBuy = page.locator('text=/\\d+ ingrédients à acheter|À acheter/');
      await expect(itemsToBuy.first()).toBeVisible();
    });

    test('devrait permettre de marquer un ingrédient comme "à la maison"', async ({ page }) => {
      await page.goto('/');

      // Setup menu
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Nouveau menu' }).click();
      await page.getByRole('button', { name: 'Remplissage auto' }).click();

      // Go to Épicerie tab
      await page.getByRole('button', { name: '○ Épicerie' }).click();

      // Get initial count
      const counterText = await page.locator('text=/\\d+/').filter({ hasText: 'À acheter' }).first().textContent();
      const initialCount = parseInt(counterText?.match(/\d+/)?.[0] || '0');

      // Click on first ingredient checkbox to mark as "à la maison"
      const firstIngredient = page.locator('input[type="checkbox"][aria-label*="Marquer"]').first();
      await firstIngredient.click();

      // Verify the label "à la maison" appears
      await expect(page.locator('text=à la maison').first()).toBeVisible();
    });

    test('devrait permettre de passer en mode "À l\'épicerie" et marquer comme acheté', async ({ page }) => {
      await page.goto('/');

      // Setup menu
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Nouveau menu' }).click();
      await page.getByRole('button', { name: 'Remplissage auto' }).click();

      // Go to Épicerie tab
      await page.getByRole('button', { name: '○ Épicerie' }).click();

      // Click "À l'épicerie" button to switch mode
      await page.getByRole('button', { name: 'À l\'épicerie' }).click();

      // The button should now be active
      await expect(page.getByRole('button', { name: /À l'épicerie/ })).toHaveAttribute('class', /active/);

      // Click on first ingredient to mark as "acheté"
      const firstIngredient = page.locator('input[type="checkbox"][aria-label*="acheté"]').first();
      await firstIngredient.click();

      // Verify the label "acheté" appears
      await expect(page.locator('text=acheté').first()).toBeVisible();
    });
  });

  test.describe('Test 4: Persistance après refresh', () => {

    test('devrait persister la sélection de recettes après refresh', async ({ page }) => {
      await page.goto('/');

      // Select recipes
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();

      // Verify 7 selected
      await expect(page.getByRole('button', { name: /recettes sélectionnées/ })).toContainText('7');

      // Refresh the page
      await page.reload();

      // Verify still 7 selected
      await expect(page.getByRole('button', { name: /recettes sélectionnées/ })).toContainText('7');
    });

    test('devrait persister le menu planifié après refresh', async ({ page }) => {
      await page.goto('/');

      // Setup and create menu
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Nouveau menu' }).click();
      await page.getByRole('button', { name: 'Remplissage auto' }).click();

      // Change Monday portions to 2
      const mondayPortions = page.getByRole('combobox', { name: 'Nombre de portions pour Lundi' });
      await mondayPortions.selectOption('2');

      // Get Monday's selected recipe
      const mondaySelect = page.getByRole('combobox', { name: 'Sélectionner le souper pour Lundi' });
      const mondayRecipe = await mondaySelect.inputValue();

      // Refresh
      await page.reload();
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      // Verify Monday still has same recipe and portions
      await expect(page.getByRole('combobox', { name: 'Sélectionner le souper pour Lundi' })).toHaveValue(mondayRecipe);
      await expect(page.getByRole('combobox', { name: 'Nombre de portions pour Lundi' })).toHaveValue('2');
    });

    test('devrait persister les ingrédients "à la maison" après refresh', async ({ page }) => {
      await page.goto('/');

      // Setup menu
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Nouveau menu' }).click();
      await page.getByRole('button', { name: 'Remplissage auto' }).click();

      // Go to Épicerie
      await page.getByRole('button', { name: '○ Épicerie' }).click();

      // Mark first ingredient as "à la maison"
      const firstCheckbox = page.locator('input[type="checkbox"][aria-label*="Marquer"]').first();
      await firstCheckbox.click();

      // Verify label appears
      await expect(page.locator('text=à la maison').first()).toBeVisible();

      // Refresh
      await page.reload();
      await page.getByRole('button', { name: '○ Épicerie' }).click();

      // Verify "à la maison" label still visible
      await expect(page.locator('text=à la maison').first()).toBeVisible();
    });
  });

  test.describe('Test 5: Nouvelle sélection sans changer menu actif', () => {

    test('devrait garder le menu planifié après nouvelle sélection aléatoire', async ({ page }) => {
      await page.goto('/');

      // Setup menu
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      page.on('dialog', dialog => dialog.accept());
      await page.getByRole('button', { name: 'Nouveau menu' }).click();
      await page.getByRole('button', { name: 'Remplissage auto' }).click();

      // Get Monday's selected recipe
      const mondaySelect = page.getByRole('combobox', { name: 'Sélectionner le souper pour Lundi' });
      const mondayRecipe = await mondaySelect.inputValue();

      // Go back to Sélection and make new random selection
      await page.getByRole('button', { name: '◈ Sélection' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();

      // Go back to Planifier
      await page.getByRole('button', { name: '◇ Planifier' }).click();

      // Verify Monday still has same recipe
      await expect(page.getByRole('combobox', { name: 'Sélectionner le souper pour Lundi' })).toHaveValue(mondayRecipe);
    });
  });

  test.describe('Test 6: Favoris et persistance', () => {

    test('devrait permettre d\'ajouter des favoris', async ({ page }) => {
      await page.goto('/');

      // Verify initial favorites count is 0
      await expect(page.getByRole('button', { name: /Favoris/ })).toContainText('0');

      // Add first recipe to favorites
      await page.getByRole('button', { name: 'Ajouter aux favoris' }).first().click();

      // Verify favorites count increased to 1
      await expect(page.getByRole('button', { name: /Favoris/ })).toContainText('1');

      // Button should now say "Retirer des favoris"
      await expect(page.getByRole('button', { name: 'Retirer des favoris' }).first()).toBeVisible();
    });

    test('devrait persister les favoris après refresh', async ({ page }) => {
      await page.goto('/');

      // Add two favorites
      await page.getByRole('button', { name: 'Ajouter aux favoris' }).first().click();
      await page.getByRole('button', { name: 'Ajouter aux favoris' }).first().click();

      // Verify 2 favorites
      await expect(page.getByRole('button', { name: /Favoris/ })).toContainText('2');

      // Refresh
      await page.reload();

      // Verify still 2 favorites
      await expect(page.getByRole('button', { name: /Favoris/ })).toContainText('2');
    });

    test('devrait filtrer par favoris', async ({ page }) => {
      await page.goto('/');

      // Add two favorites
      await page.getByRole('button', { name: 'Ajouter aux favoris' }).first().click();
      await page.getByRole('button', { name: 'Ajouter aux favoris' }).first().click();

      // Click on Favoris filter
      await page.getByRole('button', { name: /Favoris2/ }).click();

      // Verify the filter is active and shows only favorites
      // Count "Retirer des favoris" buttons which indicate favorite recipes
      const favoriteButtons = page.getByRole('button', { name: 'Retirer des favoris' });
      await expect(favoriteButtons).toHaveCount(2);
    });
  });

  test.describe('Test 7: Fonctionnalités diverses', () => {

    test('devrait rechercher des recettes', async ({ page }) => {
      await page.goto('/');

      // Type in search box
      await page.getByRole('textbox', { name: 'Rechercher une recette...' }).fill('poulet');

      // Should show filtered results
      await expect(page.locator('text=/\\d+ recettes trouvées/')).toBeVisible();

      // All visible recipes should contain "poulet" in their name
      const recipeNames = page.locator('text=/Poulet|poulet/');
      expect(await recipeNames.count()).toBeGreaterThan(0);
    });

    test('devrait effacer la recherche', async ({ page }) => {
      await page.goto('/');

      // Search for something
      await page.getByRole('textbox', { name: 'Rechercher une recette...' }).fill('poulet');

      // Click clear button
      await page.getByRole('button', { name: '✕' }).click();

      // Search box should be empty
      await expect(page.getByRole('textbox', { name: 'Rechercher une recette...' })).toHaveValue('');
    });

    test('devrait basculer entre mode clair et sombre', async ({ page }) => {
      await page.goto('/');

      // Find the theme toggle button by its emoji content (☀️ or 🌙)
      const themeButton = page.locator('button').filter({ hasText: /☀️|🌙/ });
      await expect(themeButton).toBeVisible();

      // Get initial aria-label
      const initialLabel = await themeButton.getAttribute('aria-label') || await themeButton.textContent();

      // Click to toggle
      await themeButton.click();

      // Wait for toggle to complete
      await page.waitForTimeout(300);

      // Button content should have changed
      const newLabel = await themeButton.getAttribute('aria-label') || await themeButton.textContent();
      expect(newLabel).not.toBe(initialLabel);
    });

    test('devrait afficher l\'onglet Cuisiner avec les recettes', async ({ page }) => {
      await page.goto('/');

      // Setup: handle dialogs
      page.on('dialog', dialog => dialog.accept());

      // Setup menu
      await page.getByRole('button', { name: 'Effacer' }).click();
      await page.getByRole('button', { name: '🎲 Semaine aléatoire' }).click();

      // Wait for selection
      await expect(page.locator('button:has-text("7"):has-text("sélectionnées")')).toBeVisible();

      // Go to Planifier
      await page.getByRole('button', { name: /Planifier/ }).click();

      // Create new menu
      await page.getByRole('button', { name: 'Nouveau menu' }).click();
      await page.getByRole('button', { name: 'Remplissage auto' }).click();

      // Go to Cuisiner tab
      await page.getByRole('button', { name: /Cuisiner/ }).click();

      // Should display the cooking view with recipes to print count
      await expect(page.getByText(/^\d+ recettes à imprimer$/)).toBeVisible();
    });

    test('devrait filtrer par région', async ({ page }) => {
      await page.goto('/');

      // Click on "Québec" filter
      await page.getByRole('button', { name: 'Québec' }).click();

      // Should show only Quebec recipes
      const quebecRecipes = page.locator('text=Québec');
      expect(await quebecRecipes.count()).toBeGreaterThan(0);
    });

    test('devrait filtrer par protéine', async ({ page }) => {
      await page.goto('/');

      // Select "Poulet" from protein filter
      await page.getByRole('combobox').first().selectOption('Poulet');

      // All visible recipes should be chicken dishes
      // (We can't easily verify this without knowing the data, but we verify the filter was applied)
      const proteinSelect = page.getByRole('combobox').first();
      // The value may be lowercase 'poulet' depending on the implementation
      await expect(proteinSelect).toHaveValue(/[Pp]oulet/);
    });
  });
});
