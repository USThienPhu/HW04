# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: fr06-product-detail.spec.ts >> FR-06: Xem chi tiết sản phẩm (Domain + Boundary) >> TC-FR06-13 - BVA Non-existent Product ID (99999): shows not-found message instead of infinite loading
- Location: tests\fr06-product-detail.spec.ts:149:5

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 404
Received: 200
```

# Test source

```ts
  54  |   routeBoundaryCases: RouteBoundaryCase[];
  55  |   responsiveCase: {
  56  |     testId: string;
  57  |     title: string;
  58  |     productId: number;
  59  |     viewport: { width: number; height: number };
  60  |   };
  61  | }
  62  | 
  63  | const dataPath = path.resolve(__dirname, '../data/fr06-product-detail.json');
  64  | const testData: TestDataSchema = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  65  | 
  66  | test.describe('FR-06: Xem chi tiết sản phẩm (Domain + Boundary)', () => {
  67  |   for (const tc of testData.displayCases) {
  68  |     test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
  69  |       const detailPage = new ProductDetailPage(page);
  70  | 
  71  |       if (tc.navigateFromHome) {
  72  |         await detailPage.gotoFromHomeByName(tc.expectedName);
  73  |       } else {
  74  |         await detailPage.goto(tc.productId);
  75  |       }
  76  | 
  77  |       await detailPage.expectLoaded();
  78  |       await expect(page).toHaveURL(new RegExp(`/product/${tc.productId}$`));
  79  |       await expect(detailPage.heading).toHaveCount(1);
  80  |       await expect(detailPage.heading).toHaveText(tc.expectedName);
  81  |       await expect(detailPage.priceText).toHaveText(new RegExp(tc.expectedPriceRegex));
  82  |       await expect(detailPage.descriptionText).toContainText(tc.expectedDescription);
  83  |       await expect(detailPage.productImage).toBeVisible();
  84  |       await expect(detailPage.productImage).toHaveAttribute('alt', tc.expectedImageAlt);
  85  |       await expect(detailPage.productImage).toHaveAttribute('src', /^https?:\/\//);
  86  |     });
  87  |   }
  88  | 
  89  |   test(`${testData.categoryComplianceCase.testId} - ${testData.categoryComplianceCase.title}`, async ({
  90  |     page,
  91  |   }) => {
  92  |     const tc = testData.categoryComplianceCase;
  93  |     const detailPage = new ProductDetailPage(page);
  94  | 
  95  |     await detailPage.goto(tc.productId);
  96  |     await detailPage.expectLoaded();
  97  | 
  98  |     await expect(page.locator('main')).toContainText(tc.expectedCategory);
  99  |   });
  100 | 
  101 |   test(`${testData.defaultStateCase.testId} - ${testData.defaultStateCase.title}`, async ({
  102 |     page,
  103 |   }) => {
  104 |     const tc = testData.defaultStateCase;
  105 |     const detailPage = new ProductDetailPage(page);
  106 | 
  107 |     await detailPage.goto(tc.productId);
  108 |     await detailPage.expectLoaded();
  109 | 
  110 |     await expect(detailPage.quantityInput).toBeVisible();
  111 |     await expect(detailPage.quantityInput).toHaveValue(tc.expectedDefaultQuantity);
  112 |     await expect(detailPage.addToCartButton).toBeVisible();
  113 |     await expect(detailPage.addToCartButton).toBeEnabled();
  114 |     await expect(detailPage.addToCartButton).toHaveText(tc.addButtonLabel);
  115 |   });
  116 | 
  117 |   for (const tc of testData.quantityBoundaryCases) {
  118 |     test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
  119 |       const detailPage = new ProductDetailPage(page);
  120 | 
  121 |       await detailPage.goto(tc.productId);
  122 |       await detailPage.expectLoaded();
  123 | 
  124 |       if (tc.quantityInput === 'abc') {
  125 |         await detailPage.typeQuantity(tc.quantityInput);
  126 |         await expect(detailPage.quantityInput).toHaveValue('');
  127 |         return;
  128 |       }
  129 | 
  130 |       await detailPage.setQuantity(tc.quantityInput);
  131 |       await detailPage.clickAddToCart();
  132 | 
  133 |       if (tc.isValid) {
  134 |         await expect(detailPage.addToCartButton).toHaveText(
  135 |           tc.expectedFeedback ?? 'Đã thêm'
  136 |         );
  137 |         await detailPage.cartNavLink.click();
  138 |         await expect(page).toHaveURL(/\/cart$/);
  139 |         await expect(page.locator('main')).toContainText(tc.quantityInput);
  140 |       } else {
  141 |         await expect(detailPage.addToCartButton).not.toHaveText(
  142 |           tc.expectedFeedback ?? 'Đã thêm'
  143 |         );
  144 |       }
  145 |     });
  146 |   }
  147 | 
  148 |   for (const tc of testData.routeBoundaryCases) {
  149 |     test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
  150 |       const detailPage = new ProductDetailPage(page);
  151 |       const apiRes = await page.request.get(
  152 |         `${testData.apiBaseUrl}/api/products/${tc.productId}`
  153 |       );
> 154 |       expect(apiRes.status()).toBe(404);
      |                               ^ Error: expect(received).toBe(expected) // Object.is equality
  155 | 
  156 |       await detailPage.goto(tc.productId);
  157 |       await expect(detailPage.loadingIndicator).toBeHidden();
  158 |       await expect(
  159 |         page.locator('main').getByText(new RegExp(tc.expectedNotFoundPattern, 'i'))
  160 |       ).toBeVisible();
  161 |     });
  162 |   }
  163 | 
  164 |   test(`${testData.responsiveCase.testId} - ${testData.responsiveCase.title}`, async ({
  165 |     page,
  166 |   }) => {
  167 |     const tc = testData.responsiveCase;
  168 |     const detailPage = new ProductDetailPage(page);
  169 | 
  170 |     await page.setViewportSize(tc.viewport);
  171 |     await detailPage.goto(tc.productId);
  172 |     await detailPage.expectLoaded();
  173 | 
  174 |     await expect(detailPage.addToCartButton).toBeVisible();
  175 |     await expect(detailPage.addToCartButton).toBeEnabled();
  176 |   });
  177 | });
  178 | 
```