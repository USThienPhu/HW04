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
  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Valid Product Detail Display */
  for (const tc of testData.displayCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
      let detailPage: ProductDetailPage;

      await test.step('Arrange: Khởi tạo Page Object Model và chuẩn bị fixture', async () => {
        detailPage = new ProductDetailPage(page);
      });

      await test.step('Act: Điều hướng đến trang chi tiết sản phẩm', async () => {
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
      });

      await test.step('Assert: Kiểm tra hiển thị chính xác các trường thông tin theo SRS FR-06', async () => {
        await expect(page).toHaveURL(new RegExp(`/product/${tc.productId}$`));
        await expect(detailPage.heading).toHaveCount(1);
        await expect(detailPage.heading).toHaveText(tc.expectedName);
        await expect(detailPage.priceText).toHaveText(new RegExp(tc.expectedPriceRegex));
        await expect(detailPage.descriptionText).toContainText(tc.expectedDescription);
        await expect(detailPage.productImage).toBeVisible();
        await expect(detailPage.productImage).toHaveAttribute('alt', tc.expectedImageAlt);
        await expect(detailPage.productImage).toHaveAttribute('src', /^https?:\/\//);
      });
    });
  }

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Category Specification Compliance */
  test(`${testData.categoryComplianceCase.testId} - ${testData.categoryComplianceCase.title}`, async ({
    page,
  }) => {
    const tc = testData.categoryComplianceCase;
    let detailPage: ProductDetailPage;

    await test.step('Arrange: Khởi tạo Page Object Model trang chi tiết sản phẩm', async () => {
      detailPage = new ProductDetailPage(page);
    });

    await test.step('Act: Điều hướng trực tiếp đến trang chi tiết sản phẩm', async () => {
      await detailPage.goto(tc.productId);
      await detailPage.expectLoaded();
    });

    await test.step('Assert: Kiểm tra danh mục sản phẩm hiển thị trên giao diện theo SRS FR-06', async () => {
      await expect(page.locator('main')).toContainText(tc.expectedCategory);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Default UI Form State */
  test(`${testData.defaultStateCase.testId} - ${testData.defaultStateCase.title}`, async ({
    page,
  }) => {
    const tc = testData.defaultStateCase;
    let detailPage: ProductDetailPage;

    await test.step('Arrange: Chuẩn bị trang chi tiết sản phẩm', async () => {
      detailPage = new ProductDetailPage(page);
    });

    await test.step('Act: Tải trang chi tiết sản phẩm', async () => {
      await detailPage.goto(tc.productId);
      await detailPage.expectLoaded();
    });

    await test.step('Assert: Kiểm tra trạng thái mặc định của số lượng và nút Thêm vào giỏ', async () => {
      await expect(detailPage.quantityInput).toBeVisible();
      await expect(detailPage.quantityInput).toHaveValue(tc.expectedDefaultQuantity);
      await expect(detailPage.addToCartButton).toBeVisible();
      await expect(detailPage.addToCartButton).toBeEnabled();
      await expect(detailPage.addToCartButton).toHaveText(tc.addButtonLabel);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis (BVA) & Domain Testing - Quantity Input */
  for (const tc of testData.quantityBoundaryCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
      let detailPage: ProductDetailPage;

      await test.step('Arrange: Tải trang chi tiết sản phẩm với ID hợp lệ', async () => {
        detailPage = new ProductDetailPage(page);
        await detailPage.goto(tc.productId);
        await detailPage.expectLoaded();
      });

      await test.step(`Act: Thao tác nhập số lượng biên "${tc.quantityInput}" và nhấn Thêm vào giỏ`, async () => {
        if (tc.quantityInput === 'abc') {
          await detailPage.typeQuantity(tc.quantityInput);
          return;
        }
        await detailPage.setQuantity(tc.quantityInput);
        await detailPage.clickAddToCart();
      });

      await test.step('Assert: Kiểm chứng phản hồi của hệ thống tương ứng với miền dữ liệu', async () => {
        if (tc.quantityInput === 'abc') {
          await expect(detailPage.quantityInput).toHaveValue('');
          return;
        }

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
    });
  }

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis (BVA) - Product ID Boundary & 404 Handling */
  for (const tc of testData.routeBoundaryCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
      let detailPage: ProductDetailPage;

      await test.step('Arrange: Kiểm tra HTTP status qua API context trước khi kiểm thử UI', async () => {
        detailPage = new ProductDetailPage(page);
        const apiRes = await page.request.get(
          `${testData.apiBaseUrl}/api/products/${tc.productId}`
        );
        expect(apiRes.status()).toBe(404);
      });

      await test.step(`Act: Điều hướng đến URL sản phẩm biên không tồn tại: /product/${tc.productId}`, async () => {
        await detailPage.goto(tc.productId);
      });

      await test.step('Assert: Giao diện hiển thị thông báo lỗi, không rơi vào trạng thái tải vô hạn', async () => {
        await expect(detailPage.loadingIndicator).toBeHidden();
        await expect(
          page.locator('main').getByText(new RegExp(tc.expectedNotFoundPattern, 'i'))
        ).toBeVisible();
      });
    });
  }

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Responsive Mobile Viewport */
  test(`${testData.responsiveCase.testId} - ${testData.responsiveCase.title}`, async ({
    page,
  }) => {
    const tc = testData.responsiveCase;
    let detailPage: ProductDetailPage;

    await test.step('Arrange: Cấu hình kích thước Viewport giả lập thiết bị di động (375x667)', async () => {
      detailPage = new ProductDetailPage(page);
      await page.setViewportSize(tc.viewport);
    });

    await test.step('Act: Tải trang chi tiết sản phẩm trên màn hình mobile', async () => {
      await detailPage.goto(tc.productId);
      await detailPage.expectLoaded();
    });

    await test.step('Assert: Nút Thêm vào giỏ hàng hiển thị đầy đủ và có thể tương tác', async () => {
      await expect(detailPage.addToCartButton).toBeVisible();
      await expect(detailPage.addToCartButton).toBeEnabled();
    });
  });
});
