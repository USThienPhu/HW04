# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr06-product-detail.spec.ts >> FR-06: Xem chi tiết sản phẩm (Domain + Boundary) >> TC-FR06-07 - BVA Large Valid Integer (quantity = 99): accepts positive integer 99
- Location: tests\fr06-product-detail.spec.ts:118:5

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /Thêm vào giỏ hàng|Đã thêm/i })
    - locator resolved to <button class="bg-green-600 text-white py-3 px-6 rounded hover:bg-green-700 self-start bug-mobile-hidden">Thêm vào giỏ hàng</button>
  - attempting click action
    - waiting for element to be visible, enabled and stable
    - element is visible, enabled and stable
    - scrolling into view if needed
    - done scrolling
    - performing click action

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "EShop" [ref=e5]:
      - /url: /
    - navigation [ref=e6]:
      - link "Giỏ hàng" [ref=e7]:
        - /url: /cart
      - link "Đăng nhập" [ref=e8]:
        - /url: /login
      - link "Đăng ký" [ref=e9]:
        - /url: /register
  - main [ref=e10]:
    - generic [ref=e11]:
      - img "Tai nghe AirPods Pro 2" [ref=e13]
      - generic [ref=e14]:
        - heading "Tai nghe AirPods Pro 2" [level=1] [ref=e15]
        - paragraph [ref=e16]: 6,000,000 ₫
        - paragraph [ref=e17]: Chống ồn chủ động xuất sắc
        - generic [ref=e18]:
          - generic [ref=e19]: "Số lượng:"
          - spinbutton [ref=e20]: "99"
        - button "Thêm vào giỏ hàng" [ref=e21] [cursor=pointer]
  - contentinfo [ref=e22]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | 
  3  | export class ProductDetailPage {
  4  |   readonly page: Page;
  5  |   readonly heading: Locator;
  6  |   readonly productImage: Locator;
  7  |   readonly priceText: Locator;
  8  |   readonly descriptionText: Locator;
  9  |   readonly quantityInput: Locator;
  10 |   readonly addToCartButton: Locator;
  11 |   readonly cartNavLink: Locator;
  12 |   readonly loadingIndicator: Locator;
  13 | 
  14 |   constructor(page: Page) {
  15 |     this.page = page;
  16 |     this.heading = page.getByRole('heading', { level: 1 });
  17 |     this.productImage = page.locator('main img').first();
  18 |     this.priceText = page.locator('main p').filter({ hasText: /₫/ }).first();
  19 |     this.descriptionText = page.locator('main p').nth(1);
  20 |     this.quantityInput = page.locator('main input[type="number"]');
  21 |     this.addToCartButton = page.getByRole('button', {
  22 |       name: /Thêm vào giỏ hàng|Đã thêm/i,
  23 |     });
  24 |     this.cartNavLink = page.getByRole('link', { name: /Giỏ hàng/i });
  25 |     this.loadingIndicator = page.getByText('Đang tải...');
  26 |   }
  27 | 
  28 |   async goto(productId: number | string): Promise<void> {
  29 |     await this.page.goto(`/product/${productId}`);
  30 |   }
  31 | 
  32 |   async gotoFromHomeByName(productName: string): Promise<void> {
  33 |     await this.page.goto('/');
  34 |     await this.page.getByText(productName, { exact: false }).first().click();
  35 |   }
  36 | 
  37 |   async setQuantity(value: string): Promise<void> {
  38 |     await this.quantityInput.fill(value);
  39 |   }
  40 | 
  41 |   async typeQuantity(value: string): Promise<void> {
  42 |     await this.quantityInput.fill('');
  43 |     await this.quantityInput.pressSequentially(value);
  44 |   }
  45 | 
  46 |   async clickAddToCart(): Promise<void> {
> 47 |     await this.addToCartButton.click();
     |                                ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  48 |   }
  49 | 
  50 |   async expectLoaded(): Promise<void> {
  51 |     await expect(this.loadingIndicator).toBeHidden();
  52 |     await expect(this.heading).toBeVisible();
  53 |   }
  54 | }
  55 | 
```