import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { AdminCategoryPage } from '../pages/admin-category.page';

interface Fr14TestData {
  feature: string;
  adminBaseUrl: string;
  apiBaseUrl: string;
  adminUser: { email: string; password: string };
  regularUser: { email: string; password: string };
  seededCategories: string[];
  requiredHeaders: string[];
  authCases: {
    unauthUiTestId: string;
    regularUserUiTestId: string;
    unauthApiTestId: string;
    regularUserApiTestId: string;
    expectedNonAdminAlert: string;
  };
  readCases: {
    seededTestId: string;
    emptyTestId: string;
  };
  validCreateCases: Array<{
    testId: string;
    title: string;
    namePrefix?: string;
    length?: number;
  }>;
  invalidCreateCases: {
    emptyUiTestId: string;
    whitespaceApiTestId: string;
    whitespaceValue: string;
  };
  xssCase: {
    testId: string;
    payload: string;
  };
  updateCase: {
    testId: string;
    initialName: string;
    updatedName: string;
  };
  deleteCase: {
    testId: string;
    tempName: string;
  };
  boundaryAndResponsiveCase: {
    testId: string;
    nonExistentId: number;
    viewport: { width: number; height: number };
  };
}

const dataPath = path.resolve(__dirname, '../data/fr14-category-crud.json');
const testData: Fr14TestData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

test.describe('FR-14: Quản lý Danh mục CRUD (Admin) (Domain + Boundary)', () => {
  test(`${testData.authCases.unauthUiTestId} - Unauthenticated user sees Admin login form and no category tab`, async ({
    page,
  }) => {
    const adminPage = new AdminCategoryPage(page);
    await adminPage.gotoAdmin(testData.adminBaseUrl);

    await expect(adminPage.loginButton).toBeVisible();
    await expect(adminPage.categoryTabItem).toHaveCount(0);
    await expect(adminPage.heading).toHaveCount(0);
  });

  test(`${testData.authCases.regularUserUiTestId} - Regular user cannot log into Admin Portal`, async ({
    page,
  }) => {
    const adminPage = new AdminCategoryPage(page);
    await adminPage.gotoAdmin(testData.adminBaseUrl);

    let dialogMessage = '';
    page.on('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await adminPage.emailInput.fill(testData.regularUser.email);
    await adminPage.passwordInput.fill(testData.regularUser.password);
    await adminPage.loginButton.click();

    await expect.poll(() => dialogMessage).toBe(
      testData.authCases.expectedNonAdminAlert
    );
    await expect(adminPage.categoryTabItem).toHaveCount(0);
  });

  test(`${testData.authCases.unauthApiTestId} - API Auth Boundary: POST /api/categories without token returns 401/403`, async ({
    request,
  }) => {
    const res = await request.post(`${testData.apiBaseUrl}/api/categories`, {
      data: { name: 'Unauthorized Cat' },
    });
    expect(res.ok()).toBeFalsy();
    expect(res.status()).toBeGreaterThanOrEqual(401);
  });

  test(`${testData.authCases.regularUserApiTestId} - API RBAC (FR-12): regular user cannot create category`, async ({
    request,
  }) => {
    const loginRes = await request.post(`${testData.apiBaseUrl}/api/login`, {
      data: testData.regularUser,
    });
    expect(loginRes.ok()).toBeTruthy();
    const { token } = (await loginRes.json()) as { token: string };

    const res = await request.post(`${testData.apiBaseUrl}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: `NonAdminCat-${Date.now()}` },
    });

    if (res.ok()) {
      const body = (await res.json()) as { id?: number };
      if (body.id) {
        await request.delete(`${testData.apiBaseUrl}/api/categories/${body.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    // Theo SRS FR-12: Mọi thao tác CRUD danh mục yêu cầu role = 'admin'.
    // Test case này kỳ vọng HTTP 403 Forbidden để phát hiện lỗi thực tế (bug RBAC) nếu backend cho phép.
    expect(res.status()).toBe(403);
  });

  test(`${testData.readCases.seededTestId} - Admin views seeded categories table with required columns`, async ({
    page,
  }) => {
    const adminPage = new AdminCategoryPage(page);
    await adminPage.authenticateAsAdmin(
      testData.apiBaseUrl,
      testData.adminUser.email,
      testData.adminUser.password
    );
    await adminPage.gotoAdmin(testData.adminBaseUrl);
    await adminPage.openCategoryTab();

    for (const header of testData.requiredHeaders) {
      await expect(adminPage.tableHeaders.filter({ hasText: header })).toHaveCount(1);
    }
    for (const catName of testData.seededCategories) {
      await expect(adminPage.table).toContainText(catName);
    }
  });

  test(`${testData.readCases.emptyTestId} - BVA Lower Bound (0 categories): renders empty table without crash`, async ({
    page,
  }) => {
    const adminPage = new AdminCategoryPage(page);
    await adminPage.authenticateAsAdmin(
      testData.apiBaseUrl,
      testData.adminUser.email,
      testData.adminUser.password
    );
    await page.route('**/api/categories', (route) => route.fulfill({ json: [] }));

    await adminPage.gotoAdmin(testData.adminBaseUrl);
    await adminPage.openCategoryTab();

    await expect(adminPage.table).toBeVisible();
    await expect(adminPage.tableRows).toHaveCount(0);
  });

  for (const tc of testData.validCreateCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
      const adminPage = new AdminCategoryPage(page);
      await adminPage.authenticateAsAdmin(
        testData.apiBaseUrl,
        testData.adminUser.email,
        testData.adminUser.password
      );
      await adminPage.gotoAdmin(testData.adminBaseUrl);
      await adminPage.openCategoryTab();

      const categoryName = tc.length
        ? `C${Date.now()}_`.padEnd(tc.length, 'x')
        : tc.namePrefix === 'A'
          ? 'A'
          : `${tc.namePrefix} ${Date.now()}`;

      await adminPage.createCategoryViaUi(categoryName);
      const createdRow = adminPage.rowByName(categoryName);
      await expect(createdRow).toBeVisible();
      await expect(adminPage.nameInput).toHaveValue('');

      await adminPage.deleteCategoryByName(categoryName);
      await expect(adminPage.rowByName(categoryName)).toHaveCount(0);
    });
  }

  test(`${testData.invalidCreateCases.emptyUiTestId} - BVA Empty Name ('') UI: rejects creating blank category per SRS FR-14`, async ({
    page,
  }) => {
    const adminPage = new AdminCategoryPage(page);
    await adminPage.authenticateAsAdmin(
      testData.apiBaseUrl,
      testData.adminUser.email,
      testData.adminUser.password
    );
    await adminPage.gotoAdmin(testData.adminBaseUrl);
    await adminPage.openCategoryTab();

    const initialCount = await adminPage.tableRows.count();
    await adminPage.createCategoryViaUi('');

    await expect(adminPage.tableRows).toHaveCount(initialCount);
  });

  test(`${testData.invalidCreateCases.whitespaceApiTestId} - Domain Whitespace Name ('   ') API: rejects blank category`, async ({
    request,
  }) => {
    const loginRes = await request.post(`${testData.apiBaseUrl}/api/login`, {
      data: testData.adminUser,
    });
    expect(loginRes.ok()).toBeTruthy();
    const { token } = (await loginRes.json()) as { token: string };

    const res = await request.post(`${testData.apiBaseUrl}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: testData.invalidCreateCases.whitespaceValue },
    });

    if (res.ok()) {
      const body = (await res.json()) as { id?: number };
      if (body.id) {
        await request.delete(`${testData.apiBaseUrl}/api/categories/${body.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    }

    // Theo SRS FR-14: Tên danh mục là bắt buộc, không được để trống hoặc chỉ chứa khoảng trắng.
    // Kỳ vọng HTTP 400 Bad Request (hoặc 4xx) để phát hiện bug backend chấp nhận chuỗi khoảng trắng.
    expect(res.ok()).toBeFalsy();
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test(`${testData.xssCase.testId} - Security XSS Payload: renders script tag as safe plain text`, async ({
    page,
  }) => {
    const adminPage = new AdminCategoryPage(page);
    await adminPage.authenticateAsAdmin(
      testData.apiBaseUrl,
      testData.adminUser.email,
      testData.adminUser.password
    );
    await adminPage.gotoAdmin(testData.adminBaseUrl);
    await adminPage.openCategoryTab();

    const payload = `${testData.xssCase.payload}-${Date.now()}`;
    await adminPage.createCategoryViaUi(payload);

    const row = adminPage.rowByName(payload);
    await expect(row).toBeVisible();
    const xssFlag = await page.evaluate(
      () => (window as unknown as Record<string, unknown>).__xssTriggered
    );
    expect(xssFlag).toBeUndefined();

    await adminPage.deleteCategoryByName(payload);
  });

  test(`${testData.updateCase.testId} - Update Category via PUT /api/categories/:id reflects in Admin UI`, async ({
    page,
    request,
  }) => {
    const adminPage = new AdminCategoryPage(page);
    const token = await adminPage.authenticateAsAdmin(
      testData.apiBaseUrl,
      testData.adminUser.email,
      testData.adminUser.password
    );

    const uniqueSuffix = Date.now();
    const initialName = `${testData.updateCase.initialName} ${uniqueSuffix}`;
    const updatedName = `${testData.updateCase.updatedName} ${uniqueSuffix}`;

    const createRes = await request.post(`${testData.apiBaseUrl}/api/categories`, {
      headers: { Authorization: `Bearer ${token}` },
      data: { name: initialName },
    });
    expect(createRes.ok()).toBeTruthy();
    const { id } = (await createRes.json()) as { id: number };

    const updateRes = await request.put(
      `${testData.apiBaseUrl}/api/categories/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        data: { name: updatedName },
      }
    );
    expect(updateRes.ok()).toBeTruthy();

    await adminPage.gotoAdmin(testData.adminBaseUrl);
    await adminPage.openCategoryTab();
    await expect(adminPage.rowByName(updatedName)).toBeVisible();

    await request.delete(`${testData.apiBaseUrl}/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  });

  test(`${testData.deleteCase.testId} - Delete Category via UI removes row permanently`, async ({
    page,
  }) => {
    const adminPage = new AdminCategoryPage(page);
    await adminPage.authenticateAsAdmin(
      testData.apiBaseUrl,
      testData.adminUser.email,
      testData.adminUser.password
    );
    await adminPage.gotoAdmin(testData.adminBaseUrl);
    await adminPage.openCategoryTab();

    const tempName = `${testData.deleteCase.tempName} ${Date.now()}`;
    await adminPage.createCategoryViaUi(tempName);
    await expect(adminPage.rowByName(tempName)).toBeVisible();

    await adminPage.deleteCategoryByName(tempName);
    await expect(adminPage.rowByName(tempName)).toHaveCount(0);

    await page.reload();
    await adminPage.openCategoryTab();
    await expect(adminPage.rowByName(tempName)).toHaveCount(0);
  });

  test(`${testData.boundaryAndResponsiveCase.testId} - BVA Non-existent Delete ID & Mobile Viewport (375x667)`, async ({
    page,
    request,
  }) => {
    const tc = testData.boundaryAndResponsiveCase;
    const adminPage = new AdminCategoryPage(page);
    const token = await adminPage.authenticateAsAdmin(
      testData.apiBaseUrl,
      testData.adminUser.email,
      testData.adminUser.password
    );

    const delRes = await request.delete(
      `${testData.apiBaseUrl}/api/categories/${tc.nonExistentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    expect(delRes.status()).toBeLessThan(500);

    await page.setViewportSize(tc.viewport);
    await adminPage.gotoAdmin(testData.adminBaseUrl);
    await adminPage.openCategoryTab();

    await expect(adminPage.nameInput).toBeVisible();
    await expect(adminPage.addButton).toBeVisible();
    await expect(adminPage.table).toBeVisible();
  });
});
