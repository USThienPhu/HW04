import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { ProductDetailPage } from '../pages/product-detail.page';

interface DisplayCase {
  testId: string;
  title: string;
  productId: number;
  expectedName: string;
  expectedPriceRegex: string;
  expectedDescription: string;
  expectedImageAlt: string;
  expectedCategory: string;
  navigateFromHome: boolean;
}

interface QuantityBoundaryCase {
  testId: string;
  title: string;
  productId: number;
  quantityInput: string;
  isValid: boolean;
  expectedFeedback?: string;
  expectedCartItemCount?: number;
}

interface RouteBoundaryCase {
  testId: string;
  title: string;
  productId: string;
  expectedNotFoundPattern: string;
  loadingText: string;
}

interface TestDataSchema {
  feature: string;
  apiBaseUrl: string;
  displayCases: DisplayCase[];
  categoryComplianceCase: {
    testId: string;
    title: string;
    productId: number;
    expectedCategory: string;
  };
  defaultStateCase: {
    testId: string;
    title: string;
    productId: number;
    expectedDefaultQuantity: string;
    addButtonLabel: string;
  };
  quantityBoundaryCases: QuantityBoundaryCase[];
  routeBoundaryCases: RouteBoundaryCase[];
  responsiveCase: {
    testId: string;
    title: string;
    productId: number;
    viewport: { width: number; height: number };
  };
}

const dataPath = path.resolve(__dirname, '../data/fr06-product-detail.json');
const testData: TestDataSchema = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

test.describe('FR-06: Xem chi tiết sản phẩm (Domain + Boundary)', () => {
  for (const tc of testData.displayCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
      const detailPage = new ProductDetailPage(page);

      if (tc.navigateFromHome) {
        // Refinement: Hardened navigation wait to eliminate flaky element attachment on slower browser engines (WebKit/Firefox) per ISTQB Test Execution guidelines.
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        const productCard = page.getByText(tc.expectedName, { exact: false }).first();
        await expect(productCard).toBeVisible();
        await productCard.click();
        await page.waitForURL(new RegExp(`/product/${tc.productId}$`));
      } else {
        await detailPage.goto(tc.productId);
      }

      await detailPage.expectLoaded();
      await expect(page).toHaveURL(new RegExp(`/product/${tc.productId}$`));
      await expect(detailPage.heading).toHaveCount(1);
      await expect(detailPage.heading).toHaveText(tc.expectedName);
      await expect(detailPage.priceText).toHaveText(new RegExp(tc.expectedPriceRegex));
      await expect(detailPage.descriptionText).toContainText(tc.expectedDescription);
      await expect(detailPage.productImage).toBeVisible();
      await expect(detailPage.productImage).toHaveAttribute('alt', tc.expectedImageAlt);
      await expect(detailPage.productImage).toHaveAttribute('src', /^https?:\/\//);
    });
  }

  test(`${testData.categoryComplianceCase.testId} - ${testData.categoryComplianceCase.title}`, async ({
    page,
  }) => {
    const tc = testData.categoryComplianceCase;
    const detailPage = new ProductDetailPage(page);

    await detailPage.goto(tc.productId);
    await detailPage.expectLoaded();

    await expect(page.locator('main')).toContainText(tc.expectedCategory);
  });

  test(`${testData.defaultStateCase.testId} - ${testData.defaultStateCase.title}`, async ({
    page,
  }) => {
    const tc = testData.defaultStateCase;
    const detailPage = new ProductDetailPage(page);

    await detailPage.goto(tc.productId);
    await detailPage.expectLoaded();

    await expect(detailPage.quantityInput).toBeVisible();
    await expect(detailPage.quantityInput).toHaveValue(tc.expectedDefaultQuantity);
    await expect(detailPage.addToCartButton).toBeVisible();
    await expect(detailPage.addToCartButton).toBeEnabled();
    await expect(detailPage.addToCartButton).toHaveText(tc.addButtonLabel);
  });

  for (const tc of testData.quantityBoundaryCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
      const detailPage = new ProductDetailPage(page);

      await detailPage.goto(tc.productId);
      await detailPage.expectLoaded();

      if (tc.quantityInput === 'abc') {
        await detailPage.typeQuantity(tc.quantityInput);
        await expect(detailPage.quantityInput).toHaveValue('');
        return;
      }

      await detailPage.setQuantity(tc.quantityInput);
      await detailPage.clickAddToCart();

      if (tc.isValid) {
        await expect(detailPage.addToCartButton).toHaveText(
          tc.expectedFeedback ?? 'Đã thêm'
        );
        await detailPage.cartNavLink.click();
        await expect(page).toHaveURL(/\/cart$/);
        await expect(page.locator('main')).toContainText(tc.quantityInput);
      } else {
        await expect(detailPage.addToCartButton).not.toHaveText(
          tc.expectedFeedback ?? 'Đã thêm'
        );
      }
    });
  }

  for (const tc of testData.routeBoundaryCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
      const detailPage = new ProductDetailPage(page);
      const apiRes = await page.request.get(
        `${testData.apiBaseUrl}/api/products/${tc.productId}`
      );
      expect(apiRes.status()).toBe(404);

      await detailPage.goto(tc.productId);
      await expect(detailPage.loadingIndicator).toBeHidden();
      await expect(
        page.locator('main').getByText(new RegExp(tc.expectedNotFoundPattern, 'i'))
      ).toBeVisible();
    });
  }

  test(`${testData.responsiveCase.testId} - ${testData.responsiveCase.title}`, async ({
    page,
  }) => {
    const tc = testData.responsiveCase;
    const detailPage = new ProductDetailPage(page);

    await page.setViewportSize(tc.viewport);
    await detailPage.goto(tc.productId);
    await detailPage.expectLoaded();

    await expect(detailPage.addToCartButton).toBeVisible();
    await expect(detailPage.addToCartButton).toBeEnabled();
  });
});
