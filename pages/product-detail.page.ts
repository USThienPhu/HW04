import { Page, Locator, expect } from '@playwright/test';

export class ProductDetailPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly productImage: Locator;
  readonly priceText: Locator;
  readonly descriptionText: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly cartNavLink: Locator;
  readonly loadingIndicator: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.productImage = page.locator('main img').first();
    this.priceText = page.locator('main p').filter({ hasText: /₫/ }).first();
    this.descriptionText = page.locator('main p').nth(1);
    this.quantityInput = page.locator('main input[type="number"]');
    this.addToCartButton = page.getByRole('button', {
      name: /Thêm vào giỏ hàng|Đã thêm/i,
    });
    this.cartNavLink = page.getByRole('link', { name: /Giỏ hàng/i });
    this.loadingIndicator = page.getByText('Đang tải...');
  }

  async goto(productId: number | string): Promise<void> {
    await this.page.goto(`/product/${productId}`);
  }

  async gotoFromHomeByName(productName: string): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.getByText(productName, { exact: false }).first().click();
  }

  async setQuantity(value: string): Promise<void> {
    await this.quantityInput.fill(value);
  }

  async typeQuantity(value: string): Promise<void> {
    await this.quantityInput.fill('');
    await this.quantityInput.pressSequentially(value);
  }

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.loadingIndicator).toBeHidden();
    await expect(this.heading).toBeVisible();
  }
}
