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
  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Unauthenticated Admin Access */
  test(`${testData.authCases.unauthUiTestId} - Unauthenticated user sees Admin login form and no category tab`, async ({
    page,
  }) => {
    let adminPage: AdminCategoryPage;

    await test.step('Arrange: Chuẩn bị phiên ẩn danh chưa đăng nhập Admin', async () => {
      adminPage = new AdminCategoryPage(page);
    });

    await test.step('Act: Mở giao diện Web Admin', async () => {
      await adminPage.gotoAdmin(testData.adminBaseUrl);
    });

    await test.step('Assert: Form đăng nhập hiển thị, ẩn hoàn toàn các tính năng quản lý danh mục', async () => {
      await expect(adminPage.loginButton).toBeVisible();
      await expect(adminPage.categoryTabItem).toHaveCount(0);
      await expect(adminPage.heading).toHaveCount(0);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Non-Admin Role Login UI */
  test(`${testData.authCases.regularUserUiTestId} - Regular user cannot log into Admin Portal`, async ({
    page,
  }) => {
    let adminPage: AdminCategoryPage;
    let dialogMessage = '';

    await test.step('Arrange: Mở Web Admin và chuẩn bị tài khoản người dùng thường (Non-Admin)', async () => {
      adminPage = new AdminCategoryPage(page);
      await adminPage.gotoAdmin(testData.adminBaseUrl);
      page.on('dialog', async (dialog) => {
        dialogMessage = dialog.message();
        await dialog.accept();
      });
    });

    await test.step('Act: Điền thông tin user thường và nhấn nút Login', async () => {
      await adminPage.emailInput.fill(testData.regularUser.email);
      await adminPage.passwordInput.fill(testData.regularUser.password);
      await adminPage.loginButton.click();
    });

    await test.step('Assert: Cảnh báo từ chối quyền hiển thị, không cấp quyền truy cập danh mục', async () => {
      await expect.poll(() => dialogMessage).toBe(
        testData.authCases.expectedNonAdminAlert
      );
      await expect(adminPage.categoryTabItem).toHaveCount(0);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis - Missing API Authorization Token */
  test(`${testData.authCases.unauthApiTestId} - API Auth Boundary: POST /api/categories without token returns 401/403`, async ({
    request,
  }) => {
    let res: any;

    await test.step('Arrange: Chuẩn bị payload tạo danh mục không kèm Authorization Token', async () => {
      // No token provided in headers
    });

    await test.step('Act: Gửi request POST /api/categories ẩn danh qua API context', async () => {
      res = await request.post(`${testData.apiBaseUrl}/api/categories`, {
        data: { name: 'Unauthorized Cat' },
      });
    });

    await test.step('Assert: API từ chối với mã lỗi xác thực 401 hoặc 403', async () => {
      expect(res.ok()).toBeFalsy();
      expect(res.status()).toBeGreaterThanOrEqual(401);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning & Security RBAC (FR-12) */
  test(`${testData.authCases.regularUserApiTestId} - API RBAC (FR-12): regular user cannot create category`, async ({
    request,
  }) => {
    let token: string;
    let res: any;

    await test.step('Arrange: Đăng nhập lấy Bearer token của tài khoản người dùng thường', async () => {
      const loginRes = await request.post(`${testData.apiBaseUrl}/api/login`, {
        data: testData.regularUser,
      });
      expect(loginRes.ok()).toBeTruthy();
      const loginBody = (await loginRes.json()) as { token: string };
      token = loginBody.token;
    });

    await test.step('Act: User thường gửi POST /api/categories tạo danh mục', async () => {
      res = await request.post(`${testData.apiBaseUrl}/api/categories`, {
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
    });

    await test.step('Assert: Hệ thống phải thực thi RBAC nghiêm ngặt (Kỳ vọng HTTP 403 Forbidden theo SRS FR-12)', async () => {
      // Theo SRS FR-12: Mọi thao tác CRUD danh mục yêu cầu role = 'admin'.
      // Test case này kỳ vọng HTTP 403 Forbidden để phát hiện lỗi thực tế (bug RBAC) nếu backend cho phép.
      expect(res.status()).toBe(403);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Seeded Category Table Read */
  test(`${testData.readCases.seededTestId} - Admin views seeded categories table with required columns`, async ({
    page,
  }) => {
    let adminPage: AdminCategoryPage;

    await test.step('Arrange: Đăng nhập với quyền Admin và mở Web Admin Portal', async () => {
      adminPage = new AdminCategoryPage(page);
      await adminPage.authenticateAsAdmin(
        testData.apiBaseUrl,
        testData.adminUser.email,
        testData.adminUser.password
      );
      await adminPage.gotoAdmin(testData.adminBaseUrl);
    });

    await test.step('Act: Điều hướng đến tab Quản lý Danh mục', async () => {
      await adminPage.openCategoryTab();
    });

    await test.step('Assert: Bảng hiển thị đầy đủ các cột và các danh mục mẫu ban đầu', async () => {
      for (const header of testData.requiredHeaders) {
        await expect(adminPage.tableHeaders.filter({ hasText: header })).toHaveCount(1);
      }
      for (const catName of testData.seededCategories) {
        await expect(adminPage.table).toContainText(catName);
      }
    });
  });

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis - 0 Categories Lower Bound */
  test(`${testData.readCases.emptyTestId} - BVA Lower Bound (0 categories): renders empty table without crash`, async ({
    page,
  }) => {
    let adminPage: AdminCategoryPage;

    await test.step('Arrange: Mock danh sách danh mục trả về rỗng []', async () => {
      adminPage = new AdminCategoryPage(page);
      await adminPage.authenticateAsAdmin(
        testData.apiBaseUrl,
        testData.adminUser.email,
        testData.adminUser.password
      );
      await page.route('**/api/categories', (route) => route.fulfill({ json: [] }));
    });

    await test.step('Act: Mở tab Danh mục trên giao diện Admin', async () => {
      await adminPage.gotoAdmin(testData.adminBaseUrl);
      await adminPage.openCategoryTab();
    });

    await test.step('Assert: Bảng dữ liệu hiển thị an toàn với 0 dòng, không bị crash ứng dụng', async () => {
      await expect(adminPage.table).toBeVisible();
      await expect(adminPage.tableRows).toHaveCount(0);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis & Domain Testing - Valid Category Names */
  for (const tc of testData.validCreateCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ page, request }) => {
      let adminPage: AdminCategoryPage;
      let token: string;
      let categoryName: string;

      await test.step('Arrange: Xác thực Admin và sinh tên danh mục kiểm thử biên', async () => {
        adminPage = new AdminCategoryPage(page);
        token = await adminPage.authenticateAsAdmin(
          testData.apiBaseUrl,
          testData.adminUser.email,
          testData.adminUser.password
        );
        await adminPage.gotoAdmin(testData.adminBaseUrl);
        await adminPage.openCategoryTab();

        categoryName = tc.length
          ? `C${Date.now()}_`.padEnd(tc.length, 'x')
          : tc.namePrefix === 'A'
            ? 'A'
            : `${tc.namePrefix} ${Date.now()}`;
      });

      try {
        await test.step(`Act: Nhập tên danh mục "${categoryName}" qua UI và nhấn Thêm`, async () => {
          await adminPage.createCategoryViaUi(categoryName);
        });

        await test.step('Assert: Danh mục mới xuất hiện trong bảng và ô nhập liệu được reset', async () => {
          const createdRow = adminPage.rowByName(categoryName);
          await expect(createdRow).toBeVisible();
          await expect(adminPage.nameInput).toHaveValue('');
        });
      } finally {
        // Ensured idempotent test execution by implementing rigorous cleanup to prevent SQLite database pollution across test runs.
        await test.step('Teardown: Xóa danh mục tạm bảo vệ cơ sở dữ liệu SQLite', async () => {
          try {
            await adminPage.deleteCategoryByName(categoryName);
            await expect(adminPage.rowByName(categoryName)).toHaveCount(0);
          } catch {
            const listRes = await request.get(`${testData.apiBaseUrl}/api/categories`);
            if (listRes.ok()) {
              const categories = (await listRes.json()) as Array<{ id: number; name: string }>;
              const match = categories.find((c) => c.name === categoryName);
              if (match) {
                await request.delete(`${testData.apiBaseUrl}/api/categories/${match.id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
              }
            }
          }
        });
      }
    });
  }

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis - Empty String UI Validation */
  test(`${testData.invalidCreateCases.emptyUiTestId} - BVA Empty Name ('') UI: rejects creating blank category per SRS FR-14`, async ({
    page,
  }) => {
    let adminPage: AdminCategoryPage;
    let initialCount: number;

    await test.step('Arrange: Đăng nhập Admin và xác định số lượng danh mục hiện có', async () => {
      adminPage = new AdminCategoryPage(page);
      await adminPage.authenticateAsAdmin(
        testData.apiBaseUrl,
        testData.adminUser.email,
        testData.adminUser.password
      );
      await adminPage.gotoAdmin(testData.adminBaseUrl);
      await adminPage.openCategoryTab();
      initialCount = await adminPage.tableRows.count();
    });

    await test.step('Act: Để trống ô tên danh mục và nhấn Thêm', async () => {
      await adminPage.createCategoryViaUi('');
    });

    await test.step('Assert: Hệ thống từ chối, tổng số dòng danh mục không đổi', async () => {
      await expect(adminPage.tableRows).toHaveCount(initialCount);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Whitespace String API Validation */
  test(`${testData.invalidCreateCases.whitespaceApiTestId} - Domain Whitespace Name ('   ') API: rejects blank category`, async ({
    request,
  }) => {
    let token: string;
    let res: any;

    await test.step('Arrange: Đăng nhập Admin lấy token và chuẩn bị payload toàn khoảng trắng', async () => {
      const loginRes = await request.post(`${testData.apiBaseUrl}/api/login`, {
        data: testData.adminUser,
      });
      expect(loginRes.ok()).toBeTruthy();
      const loginBody = (await loginRes.json()) as { token: string };
      token = loginBody.token;
    });

    await test.step('Act: Gửi POST /api/categories với chuỗi khoảng trắng "   "', async () => {
      res = await request.post(`${testData.apiBaseUrl}/api/categories`, {
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
    });

    await test.step('Assert: API phải trả về HTTP 400 Bad Request theo quy tắc SRS FR-14', async () => {
      // Theo SRS FR-14: Tên danh mục là bắt buộc, không được để trống hoặc chỉ chứa khoảng trắng.
      // Kỳ vọng HTTP 400 Bad Request (hoặc 4xx) để phát hiện bug backend chấp nhận chuỗi khoảng trắng.
      expect(res.ok()).toBeFalsy();
      expect(res.status()).toBeGreaterThanOrEqual(400);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning & Security XSS Sanitization */
  test(`${testData.xssCase.testId} - Security XSS Payload: renders script tag as safe plain text`, async ({
    page,
    request,
  }) => {
    let adminPage: AdminCategoryPage;
    let token: string;
    let payload: string;

    await test.step('Arrange: Đăng nhập Admin và chuẩn bị payload XSS', async () => {
      adminPage = new AdminCategoryPage(page);
      token = await adminPage.authenticateAsAdmin(
        testData.apiBaseUrl,
        testData.adminUser.email,
        testData.adminUser.password
      );
      await adminPage.gotoAdmin(testData.adminBaseUrl);
      await adminPage.openCategoryTab();
      payload = `${testData.xssCase.payload}-${Date.now()}`;
    });

    try {
      await test.step('Act: Tạo danh mục chứa thẻ script độc hại qua giao diện', async () => {
        await adminPage.createCategoryViaUi(payload);
      });

      await test.step('Assert: Thẻ script hiển thị dạng văn bản an toàn, không bị thực thi mã', async () => {
        const row = adminPage.rowByName(payload);
        await expect(row).toBeVisible();
        const xssFlag = await page.evaluate(
          () => (window as unknown as Record<string, unknown>).__xssTriggered
        );
        expect(xssFlag).toBeUndefined();
      });
    } finally {
      // Ensured idempotent test execution by implementing rigorous cleanup to prevent SQLite database pollution across test runs.
      await test.step('Teardown: Xóa payload XSS khỏi CSDL SQLite', async () => {
        try {
          await adminPage.deleteCategoryByName(payload);
          await expect(adminPage.rowByName(payload)).toHaveCount(0);
        } catch {
          const listRes = await request.get(`${testData.apiBaseUrl}/api/categories`);
          if (listRes.ok()) {
            const categories = (await listRes.json()) as Array<{ id: number; name: string }>;
            const match = categories.find((c) => c.name === payload);
            if (match) {
              await request.delete(`${testData.apiBaseUrl}/api/categories/${match.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
            }
          }
        }
      });
    }
  });

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Category Update (PUT) Sync */
  test(`${testData.updateCase.testId} - Update Category via PUT /api/categories/:id reflects in Admin UI`, async ({
    page,
    request,
  }) => {
    let adminPage: AdminCategoryPage;
    let token: string;
    let id: number;
    let updatedName: string;

    await test.step('Arrange: Tạo danh mục ban đầu qua API để chuẩn bị cập nhật', async () => {
      adminPage = new AdminCategoryPage(page);
      token = await adminPage.authenticateAsAdmin(
        testData.apiBaseUrl,
        testData.adminUser.email,
        testData.adminUser.password
      );

      const uniqueSuffix = Date.now();
      const initialName = `${testData.updateCase.initialName} ${uniqueSuffix}`;
      updatedName = `${testData.updateCase.updatedName} ${uniqueSuffix}`;

      const createRes = await request.post(`${testData.apiBaseUrl}/api/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { name: initialName },
      });
      expect(createRes.ok()).toBeTruthy();
      const body = (await createRes.json()) as { id: number };
      id = body.id;
    });

    await test.step('Act: Gửi request PUT cập nhật tên danh mục và mở Web Admin', async () => {
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
    });

    await test.step('Assert & Cleanup: Tên danh mục mới hiển thị trên UI và dọn dẹp sau khi kiểm thử', async () => {
      await expect(adminPage.rowByName(updatedName)).toBeVisible();

      await request.delete(`${testData.apiBaseUrl}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    });
  });

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Category Permanent Deletion (DELETE) */
  test(`${testData.deleteCase.testId} - Delete Category via UI removes row permanently`, async ({
    page,
  }) => {
    let adminPage: AdminCategoryPage;
    let tempName: string;

    await test.step('Arrange: Đăng nhập Admin và tạo danh mục tạm để xóa', async () => {
      adminPage = new AdminCategoryPage(page);
      await adminPage.authenticateAsAdmin(
        testData.apiBaseUrl,
        testData.adminUser.email,
        testData.adminUser.password
      );
      await adminPage.gotoAdmin(testData.adminBaseUrl);
      await adminPage.openCategoryTab();

      tempName = `${testData.deleteCase.tempName} ${Date.now()}`;
      await adminPage.createCategoryViaUi(tempName);
      await expect(adminPage.rowByName(tempName)).toBeVisible();
    });

    await test.step('Act: Nhấn nút Xóa tại dòng danh mục tương ứng', async () => {
      await adminPage.deleteCategoryByName(tempName);
    });

    await test.step('Assert: Dòng biến mất khỏi bảng và không tái xuất hiện khi reload trang', async () => {
      await expect(adminPage.rowByName(tempName)).toHaveCount(0);
      await page.reload();
      await adminPage.openCategoryTab();
      await expect(adminPage.rowByName(tempName)).toHaveCount(0);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis & Responsive - Non-Existent ID & Viewport */
  test(`${testData.boundaryAndResponsiveCase.testId} - BVA Non-existent Delete ID & Mobile Viewport (375x667)`, async ({
    page,
    request,
  }) => {
    const tc = testData.boundaryAndResponsiveCase;
    let adminPage: AdminCategoryPage;
    let token: string;
    let delRes: any;

    await test.step('Arrange: Đăng nhập Admin lấy token và cấu hình kích thước màn hình di động', async () => {
      adminPage = new AdminCategoryPage(page);
      token = await adminPage.authenticateAsAdmin(
        testData.apiBaseUrl,
        testData.adminUser.email,
        testData.adminUser.password
      );
    });

    await test.step(`Act: Gửi lệnh DELETE với ID không tồn tại (${tc.nonExistentId}) và tải trang trên mobile`, async () => {
      delRes = await request.delete(
        `${testData.apiBaseUrl}/api/categories/${tc.nonExistentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await page.setViewportSize(tc.viewport);
      await adminPage.gotoAdmin(testData.adminBaseUrl);
      await adminPage.openCategoryTab();
    });

    await test.step('Assert: API phản hồi an toàn (không lỗi 500) và giao diện Admin hiển thị đầy đủ trên mobile', async () => {
      expect(delRes.status()).toBeLessThan(500);
      await expect(adminPage.nameInput).toBeVisible();
      await expect(adminPage.addButton).toBeVisible();
      await expect(adminPage.table).toBeVisible();
    });
  });
});
