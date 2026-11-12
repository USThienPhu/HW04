# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr06-product-detail.spec.ts >> FR-06: Xem chi tiết sản phẩm (Domain + Boundary) >> TC-FR06-01 - Navigate from Home and verify full product detail fields for iPhone 15 Pro Max
- Location: tests\fr06-product-detail.spec.ts:68:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { level: 1 })
Expected: visible
Error: strict mode violation: getByRole('heading', { level: 1 }) resolved to 2 elements:
    1) <h1 class="text-3xl font-bold">Danh sách sản phẩm</h1> aka getByRole('heading', { name: 'Danh sách sản phẩm' })
    2) <h1 class="text-center text-gray-400 mt-8 text-sm">Hiển thị 5 sản phẩm</h1> aka getByRole('heading', { name: 'Hiển thị 5 sản phẩm' })

Call log:
  - Expect "toBeVisible" getByRole('heading', { level: 1 }) with timeout 5000ms
  - waiting for getByRole('heading', { level: 1 })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - banner [ref=e4]:
    - link "EShop" [ref=e5] [cursor=pointer]:
      - /url: /
    - navigation [ref=e6]:
      - link "Giỏ hàng" [ref=e7] [cursor=pointer]:
        - /url: /cart
      - link "Đăng nhập" [ref=e8] [cursor=pointer]:
        - /url: /login
      - link "Đăng ký" [ref=e9] [cursor=pointer]:
        - /url: /register
  - main [ref=e10]:
    - generic [ref=e11]:
      - generic [ref=e12]:
        - heading "Danh sách sản phẩm" [level=1] [ref=e13]
        - generic [ref=e14]:
          - textbox "Tìm kiếm..." [ref=e15]
          - button "Tìm" [ref=e16] [cursor=pointer]
      - generic [ref=e17]:
        - generic [ref=e18]:
          - heading "iPhone 15 Pro Max" [level=2] [ref=e19]
          - paragraph [ref=e20]: 30,000,000 VND
          - generic [ref=e21]:
            - link "Xem chi tiết" [ref=e22] [cursor=pointer]:
              - /url: /product/1
            - button "Thêm vào giỏ" [ref=e23] [cursor=pointer]
        - generic [ref=e24]:
          - heading "Samsung Galaxy S24 Ultra" [level=2] [ref=e25]
          - paragraph [ref=e26]: 28,000,000 VND
          - generic [ref=e27]:
            - link "Xem chi tiết" [ref=e28] [cursor=pointer]:
              - /url: /product/2
            - button "Thêm vào giỏ" [ref=e29] [cursor=pointer]
        - generic [ref=e30]:
          - heading "MacBook Pro M3" [level=2] [ref=e31]
          - paragraph [ref=e32]: 45,000,000 VND
          - generic [ref=e33]:
            - link "Xem chi tiết" [ref=e34] [cursor=pointer]:
              - /url: /product/3
            - button "Thêm vào giỏ" [ref=e35] [cursor=pointer]
        - generic [ref=e36]:
          - heading "Tai nghe AirPods Pro 2" [level=2] [ref=e37]
          - paragraph [ref=e38]: 6,000,000 VND
          - generic [ref=e39]:
            - link "Xem chi tiết" [ref=e40] [cursor=pointer]:
              - /url: /product/4
            - button "Thêm vào giỏ" [ref=e41] [cursor=pointer]
        - generic [ref=e42]:
          - heading "Bàn phím cơ Keychron Q1" [level=2] [ref=e43]
          - paragraph [ref=e44]: 4,000,000 VND
          - generic [ref=e45]:
            - link "Xem chi tiết" [ref=e46] [cursor=pointer]:
              - /url: /product/5
            - button "Thêm vào giỏ" [ref=e47] [cursor=pointer]
      - heading "Hiển thị 5 sản phẩm" [level=1] [ref=e48]
  - contentinfo [ref=e49]: © 2026 EShop SUT. Dành cho mục đích kiểm thử.
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
  47 |     await this.addToCartButton.click();
  48 |   }
  49 | 
  50 |   async expectLoaded(): Promise<void> {
  51 |     await expect(this.loadingIndicator).toBeHidden();
> 52 |     await expect(this.heading).toBeVisible();
     |                                ^ Error: expect(locator).toBeVisible() failed
  53 |   }
  54 | }
  55 | 
```