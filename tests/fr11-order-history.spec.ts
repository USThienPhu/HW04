import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';
import { OrderHistoryPage } from '../pages/order-history.page';

interface OrderRecord {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
}

interface StatusCase {
  testId: string;
  title: string;
  orderId: number;
  status: string;
  expectedLabel: string;
  expectedClassRegex: string;
  expectCancelVisible: boolean;
}

interface Fr11TestData {
  feature: string;
  apiBaseUrl: string;
  testUser: { email: string; password: string };
  adminUser: { email: string; password: string };
  unauthenticatedCase: {
    testId: string;
    title: string;
    expectedPrompt: string;
  };
  apiAuthCases: Array<{
    testId: string;
    title: string;
    token: string;
    expectedMinStatus: number;
  }>;
  idorCase: {
    testId: string;
    title: string;
    shippingAddress: string;
    expectedMaxAllowedStatus: number;
  };
  emptyOrderCase: {
    testId: string;
    title: string;
    expectedEmptyMessage: string;
  };
  singleOrderCase: {
    testId: string;
    title: string;
    order: OrderRecord;
    requiredHeaders: string[];
    expectedOrderIdText: string;
    expectedAmountRegex: string;
    expectedStatusLabel: string;
  };
  bulkOrdersCase: {
    testId: string;
    title: string;
    orderCount: number;
  };
  statusCases: StatusCase[];
  amountBoundaryCase: {
    testId: string;
    title: string;
    orders: OrderRecord[];
    expectedZeroRegex: string;
    expectedMaxRegex: string;
  };
  apiErrorFallbackCase: {
    testId: string;
    title: string;
    expectedFallbackText: string;
  };
  responsiveCase: {
    testId: string;
    title: string;
    viewport: { width: number; height: number };
    sampleOrder: OrderRecord;
  };
}

const dataPath = path.resolve(__dirname, '../data/fr11-order-history.json');
const testData: Fr11TestData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

/**
 * Test Suite: FR-11 - Xem lịch sử đơn hàng (Order History)
 *
 * Order State Machine & Anti-Flaky Assertion Architecture:
 * - Implements automatic web-first retry assertions (`expect(badge).toHaveText(expectedLabel, { timeout: 7000 })`)
 *   to guard against flaky state rendering across asynchronous DOM updates in the order lifecycle
 *   (pending -> confirmed -> shipping -> delivered / canceled).
 * - Synchronizes UI interactions with backend state via `page.waitForResponse` on state-changing actions
 *   (such as clicking "Hủy đơn" in TC-FR11-12) to ensure the network-level mutation completes before UI assertions,
 *   strictly adhering to ISTQB CTFL v4.0 §6.2.2 and W3C asynchronous test execution standards.
 */
test.describe('FR-11: Xem lịch sử đơn hàng (Domain + Boundary)', () => {
  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Unauthenticated Access */
  test(`${testData.unauthenticatedCase.testId} - ${testData.unauthenticatedCase.title}`, async ({
    page,
  }) => {
    let orderPage: OrderHistoryPage;

    await test.step('Arrange: Chuẩn bị phiên ẩn danh chưa xác thực', async () => {
      orderPage = new OrderHistoryPage(page);
    });

    await test.step('Act: Điều hướng đến trang hồ sơ cá nhân /profile', async () => {
      await orderPage.goto();
    });

    await test.step('Assert: Yêu cầu đăng nhập hiển thị, bảo vệ không lộ danh sách đơn hàng', async () => {
      await expect(page).toHaveURL(/\/profile$/);
      await expect(orderPage.loginPrompt).toBeVisible();
      await expect(orderPage.ordersTable).toHaveCount(0);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis - JWT Authentication Boundary */
  for (const tc of testData.apiAuthCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ request }) => {
      let headers: Record<string, string>;
      let res: any;

      await test.step(`Arrange: Chuẩn bị token biên: "${tc.token ? 'Tampered JWT' : 'Missing Token'}"`, async () => {
        headers = tc.token ? { Authorization: `Bearer ${tc.token}` } : {};
      });

      await test.step('Act: Gửi request GET /api/orders/my-orders qua API context', async () => {
        res = await request.get(`${testData.apiBaseUrl}/api/orders/my-orders`, {
          headers,
        });
      });

      await test.step(`Assert: API từ chối truy cập với HTTP status >= ${tc.expectedMinStatus}`, async () => {
        expect(res.ok()).toBeFalsy();
        expect(res.status()).toBeGreaterThanOrEqual(tc.expectedMinStatus);
      });
    });
  }

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning & Security Isolation (IDOR) */
  test(`${testData.idorCase.testId} - ${testData.idorCase.title}`, async ({
    request,
  }) => {
    let orderId: number;
    let userToken: string;
    let idorRes: any;

    await test.step('Arrange: Tạo đơn hàng bằng tài khoản Admin và lấy token tài khoản User thường', async () => {
      const adminLogin = await request.post(`${testData.apiBaseUrl}/api/login`, {
        data: testData.adminUser,
      });
      expect(adminLogin.ok()).toBeTruthy();
      const { token: adminToken } = (await adminLogin.json()) as { token: string };

      const checkoutRes = await request.post(`${testData.apiBaseUrl}/api/checkout`, {
        headers: { Authorization: `Bearer ${adminToken}` },
        data: {
          total_amount: 500000,
          shipping_address: testData.idorCase.shippingAddress,
        },
      });
      expect(checkoutRes.ok()).toBeTruthy();
      const checkoutBody = (await checkoutRes.json()) as { orderId: number };
      orderId = checkoutBody.orderId;

      const userLogin = await request.post(`${testData.apiBaseUrl}/api/login`, {
        data: testData.testUser,
      });
      expect(userLogin.ok()).toBeTruthy();
      const userBody = (await userLogin.json()) as { token: string };
      userToken = userBody.token;
    });

    await test.step(`Act: User thường gửi GET /api/orders/${orderId} truy cập trái phép đơn hàng của Admin`, async () => {
      idorRes = await request.get(
        `${testData.apiBaseUrl}/api/orders/${orderId}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );
    });

    await test.step('Assert: Hệ thống phải chặn truy cập (Kỳ vọng HTTP 403 Forbidden)', async () => {
      expect(idorRes.status()).toBeGreaterThan(
        testData.idorCase.expectedMaxAllowedStatus
      );
    });
  });

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis - 0 Orders Lower Bound */
  test(`${testData.emptyOrderCase.testId} - ${testData.emptyOrderCase.title}`, async ({
    page,
  }) => {
    let orderPage: OrderHistoryPage;

    await test.step('Arrange: Đăng nhập tài khoản và mock danh sách 0 đơn hàng', async () => {
      orderPage = new OrderHistoryPage(page);
      await orderPage.authenticateViaApi(
        testData.apiBaseUrl,
        testData.testUser.email,
        testData.testUser.password
      );
      await page.route('**/api/orders/my-orders', (route) =>
        route.fulfill({ json: [] })
      );
    });

    await test.step('Act: Tải trang lịch sử đơn hàng', async () => {
      await orderPage.goto();
    });

    await test.step('Assert: Hiển thị thông báo danh sách rỗng, không hiển thị bảng trống', async () => {
      await expect(orderPage.sectionHeading).toBeVisible();
      await expect(orderPage.emptyMessage).toHaveText(
        testData.emptyOrderCase.expectedEmptyMessage
      );
      await expect(orderPage.ordersTable).toHaveCount(0);
    });
  });

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis - Min Non-Empty Order List */
  test(`${testData.singleOrderCase.testId} - ${testData.singleOrderCase.title}`, async ({
    page,
  }) => {
    const tc = testData.singleOrderCase;
    let orderPage: OrderHistoryPage;

    await test.step('Arrange: Xác thực tài khoản và chuẩn bị mock 1 đơn hàng với đầy đủ trường', async () => {
      orderPage = new OrderHistoryPage(page);
      await orderPage.authenticateViaApi(
        testData.apiBaseUrl,
        testData.testUser.email,
        testData.testUser.password
      );
      await page.route('**/api/orders/my-orders', (route) =>
        route.fulfill({ json: [tc.order] })
      );
    });

    await test.step('Act: Tải trang lịch sử đơn hàng', async () => {
      await orderPage.goto();
    });

    await test.step('Assert: Kiểm tra hiển thị đầy đủ 4 cột bắt buộc và thông tin dòng đơn hàng', async () => {
      await expect(orderPage.ordersTable).toBeVisible();
      for (const headerText of tc.requiredHeaders) {
        await expect(
          orderPage.tableHeaders.filter({ hasText: headerText })
        ).toHaveCount(1);
      }

      const row = orderPage.rowByOrderId(tc.order.id);
      await expect(row).toContainText(tc.expectedOrderIdText);
      await expect(row).toContainText(new RegExp(tc.expectedAmountRegex));
      await expect(orderPage.statusBadgeInRow(row)).toHaveText(
        tc.expectedStatusLabel,
        { timeout: 7000 }
      );
    });
  });

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis - Upper Bound (50 Orders) */
  test(`${testData.bulkOrdersCase.testId} - ${testData.bulkOrdersCase.title}`, async ({
    page,
  }) => {
    let orderPage: OrderHistoryPage;

    await test.step('Arrange: Khởi tạo danh sách tải lớn gồm 50 đơn hàng', async () => {
      orderPage = new OrderHistoryPage(page);
      await orderPage.authenticateViaApi(
        testData.apiBaseUrl,
        testData.testUser.email,
        testData.testUser.password
      );

      const bulkOrders: OrderRecord[] = Array.from(
        { length: testData.bulkOrdersCase.orderCount },
        (_, idx) => ({
          id: 1000 + idx,
          total_amount: (idx + 1) * 100000,
          status: 'delivered',
          created_at: '2026-11-12T08:00:00.000Z',
        })
      );

      await page.route('**/api/orders/my-orders', (route) =>
        route.fulfill({ json: bulkOrders })
      );
    });

    await test.step('Act: Mở giao diện lịch sử đơn hàng', async () => {
      await orderPage.goto();
    });

    await test.step('Assert: Bảng hiển thị chính xác toàn bộ 50 dòng đơn hàng không bị cắt cụt', async () => {
      await expect(orderPage.tableRows).toHaveCount(
        testData.bulkOrdersCase.orderCount
      );
    });
  });

  /* ISTQB CTFL v4.0 §4.2.4: State Transition Testing - Order Lifecycle Statuses */
  for (const tc of testData.statusCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
      let orderPage: OrderHistoryPage;
      let row: any;
      let badge: any;
      let cancelBtn: any;

      await test.step(`Arrange: Chuẩn bị đơn hàng trạng thái "${tc.status}" và thiết lập mock router`, async () => {
        orderPage = new OrderHistoryPage(page);
        await orderPage.authenticateViaApi(
          testData.apiBaseUrl,
          testData.testUser.email,
          testData.testUser.password
        );

        page.on('dialog', async (dialog) => {
          await dialog.accept();
        });

        let currentStatus = tc.status;
        if (tc.testId === 'TC-FR11-12') {
          currentStatus = 'pending';
        }

        await page.route('**/api/orders/my-orders', (route) =>
          route.fulfill({
            json: [
              {
                id: tc.orderId,
                total_amount: 250000,
                status: currentStatus,
                created_at: '2026-11-12T09:00:00.000Z',
              },
            ],
          })
        );

        await page.route(`**/api/orders/${tc.orderId}/cancel`, (route) => {
          currentStatus = 'canceled';
          route.fulfill({
            status: 200,
            json: { message: 'Hủy đơn hàng thành công' },
          });
        });
      });

      await test.step('Act: Tải trang hồ sơ người dùng và định vị dòng đơn hàng', async () => {
        await orderPage.goto();
        row = orderPage.rowByOrderId(tc.orderId);
        badge = orderPage.statusBadgeInRow(row);
        cancelBtn = orderPage.cancelButtonInRow(row);

        if (tc.testId === 'TC-FR11-12') {
          const [cancelResponse] = await Promise.all([
            page.waitForResponse(
              (res) =>
                res.url().includes(`/api/orders/${tc.orderId}/cancel`) &&
                res.status() === 200
            ),
            cancelBtn.click(),
          ]);
          expect(cancelResponse.ok()).toBeTruthy();
        }
      });

      await test.step('Assert: Kiểm tra nhãn trạng thái, class màu sắc CSS và sự hiện diện của nút Hủy đơn', async () => {
        await expect(badge).toHaveText(tc.expectedLabel, { timeout: 7000 });
        await expect(badge).toHaveAttribute(
          'class',
          new RegExp(tc.expectedClassRegex)
        );

        if (tc.expectCancelVisible) {
          await expect(cancelBtn).toBeVisible();
          await expect(cancelBtn).toBeEnabled();
        } else {
          await expect(cancelBtn).toHaveCount(0);
        }
      });
    });
  }

  /* ISTQB CTFL v4.0 §4.2.2: Boundary Value Analysis - Extreme Order Amounts (0 & Max) */
  test(`${testData.amountBoundaryCase.testId} - ${testData.amountBoundaryCase.title}`, async ({
    page,
  }) => {
    const tc = testData.amountBoundaryCase;
    let orderPage: OrderHistoryPage;

    await test.step('Arrange: Chuẩn bị đơn hàng biên với tổng tiền 0 ₫ và 999,999,999 ₫', async () => {
      orderPage = new OrderHistoryPage(page);
      await orderPage.authenticateViaApi(
        testData.apiBaseUrl,
        testData.testUser.email,
        testData.testUser.password
      );
      await page.route('**/api/orders/my-orders', (route) =>
        route.fulfill({ json: tc.orders })
      );
    });

    await test.step('Act: Tải trang lịch sử đơn hàng', async () => {
      await orderPage.goto();
    });

    await test.step('Assert: Định dạng tiền tệ hiển thị đúng quy chuẩn, không xuất hiện NaN', async () => {
      const zeroRow = orderPage.rowByOrderId(tc.orders[0].id);
      const maxRow = orderPage.rowByOrderId(tc.orders[1].id);

      await expect(zeroRow).toContainText(new RegExp(tc.expectedZeroRegex));
      await expect(maxRow).toContainText(new RegExp(tc.expectedMaxRegex));
      await expect(orderPage.ordersTable).not.toContainText('NaN');
    });
  });

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Negative Testing / Backend 500 Fallback */
  test(`${testData.apiErrorFallbackCase.testId} - ${testData.apiErrorFallbackCase.title}`, async ({
    page,
  }) => {
    let orderPage: OrderHistoryPage;

    await test.step('Arrange: Mock phản hồi lỗi HTTP 500 từ Backend API', async () => {
      orderPage = new OrderHistoryPage(page);
      await orderPage.authenticateViaApi(
        testData.apiBaseUrl,
        testData.testUser.email,
        testData.testUser.password
      );
      await page.route('**/api/orders/my-orders', (route) =>
        route.fulfill({ status: 500, json: { error: 'Internal Server Error' } })
      );
    });

    await test.step('Act: Tải trang hồ sơ cá nhân khi API lỗi', async () => {
      await orderPage.goto();
    });

    await test.step('Assert: Ứng dụng xử lý an toàn, không crash, hiển thị thông báo fallback', async () => {
      await expect(orderPage.sectionHeading).toBeVisible();
      await expect(orderPage.emptyMessage).toHaveText(
        testData.apiErrorFallbackCase.expectedFallbackText
      );
    });
  });

  /* ISTQB CTFL v4.0 §4.2.1: Equivalence Partitioning - Responsive Mobile Viewport */
  test(`${testData.responsiveCase.testId} - ${testData.responsiveCase.title}`, async ({
    page,
  }) => {
    const tc = testData.responsiveCase;
    let orderPage: OrderHistoryPage;

    await test.step('Arrange: Cấu hình Viewport di động 375x667 và mock 1 đơn hàng', async () => {
      orderPage = new OrderHistoryPage(page);
      await page.setViewportSize(tc.viewport);
      await orderPage.authenticateViaApi(
        testData.apiBaseUrl,
        testData.testUser.email,
        testData.testUser.password
      );
      await page.route('**/api/orders/my-orders', (route) =>
        route.fulfill({ json: [tc.sampleOrder] })
      );
    });

    await test.step('Act: Tải trang lịch sử đơn hàng trên màn hình mobile', async () => {
      await orderPage.goto();
    });

    await test.step('Assert: Tiêu đề và dòng đơn hàng hiển thị đầy đủ trên màn hình nhỏ', async () => {
      await expect(orderPage.sectionHeading).toBeVisible();
      await expect(
        orderPage.rowByOrderId(tc.sampleOrder.id)
      ).toBeVisible();
    });
  });
});
