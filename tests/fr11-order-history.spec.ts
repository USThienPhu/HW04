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

test.describe('FR-11: Xem lịch sử đơn hàng (Domain + Boundary)', () => {
  test(`${testData.unauthenticatedCase.testId} - ${testData.unauthenticatedCase.title}`, async ({
    page,
  }) => {
    const orderPage = new OrderHistoryPage(page);
    await orderPage.goto();

    await expect(page).toHaveURL(/\/profile$/);
    await expect(orderPage.loginPrompt).toBeVisible();
    await expect(orderPage.ordersTable).toHaveCount(0);
  });

  for (const tc of testData.apiAuthCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ request }) => {
      const headers: Record<string, string> = tc.token
        ? { Authorization: `Bearer ${tc.token}` }
        : {};
      const res = await request.get(`${testData.apiBaseUrl}/api/orders/my-orders`, {
        headers,
      });

      expect(res.ok()).toBeFalsy();
      expect(res.status()).toBeGreaterThanOrEqual(tc.expectedMinStatus);
    });
  }

  test(`${testData.idorCase.testId} - ${testData.idorCase.title}`, async ({
    request,
  }) => {
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
    const { orderId } = (await checkoutRes.json()) as { orderId: number };

    const userLogin = await request.post(`${testData.apiBaseUrl}/api/login`, {
      data: testData.testUser,
    });
    expect(userLogin.ok()).toBeTruthy();
    const { token: userToken } = (await userLogin.json()) as { token: string };

    const idorRes = await request.get(
      `${testData.apiBaseUrl}/api/orders/${orderId}`,
      { headers: { Authorization: `Bearer ${userToken}` } }
    );
    expect(idorRes.status()).toBeGreaterThan(
      testData.idorCase.expectedMaxAllowedStatus
    );
  });

  test(`${testData.emptyOrderCase.testId} - ${testData.emptyOrderCase.title}`, async ({
    page,
  }) => {
    const orderPage = new OrderHistoryPage(page);
    await orderPage.authenticateViaApi(
      testData.apiBaseUrl,
      testData.testUser.email,
      testData.testUser.password
    );
    await page.route('**/api/orders/my-orders', (route) =>
      route.fulfill({ json: [] })
    );

    await orderPage.goto();
    await expect(orderPage.sectionHeading).toBeVisible();
    await expect(orderPage.emptyMessage).toHaveText(
      testData.emptyOrderCase.expectedEmptyMessage
    );
    await expect(orderPage.ordersTable).toHaveCount(0);
  });

  test(`${testData.singleOrderCase.testId} - ${testData.singleOrderCase.title}`, async ({
    page,
  }) => {
    const tc = testData.singleOrderCase;
    const orderPage = new OrderHistoryPage(page);
    await orderPage.authenticateViaApi(
      testData.apiBaseUrl,
      testData.testUser.email,
      testData.testUser.password
    );
    await page.route('**/api/orders/my-orders', (route) =>
      route.fulfill({ json: [tc.order] })
    );

    await orderPage.goto();
    await expect(orderPage.ordersTable).toBeVisible();
    for (const headerText of tc.requiredHeaders) {
      await expect(
        orderPage.tableHeaders.filter({ hasText: headerText })
      ).toHaveCount(1);
    }

    const row = orderPage.rowByOrderId(tc.order.id);
    await expect(row).toContainText(tc.expectedOrderIdText);
    await expect(row).toContainText(new RegExp(tc.expectedAmountRegex));
    await expect(orderPage.statusBadgeInRow(row)).toHaveText(tc.expectedStatusLabel);
  });

  test(`${testData.bulkOrdersCase.testId} - ${testData.bulkOrdersCase.title}`, async ({
    page,
  }) => {
    const orderPage = new OrderHistoryPage(page);
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

    await orderPage.goto();
    await expect(orderPage.tableRows).toHaveCount(
      testData.bulkOrdersCase.orderCount
    );
  });

  for (const tc of testData.statusCases) {
    test(`${tc.testId} - ${tc.title}`, async ({ page }) => {
      const orderPage = new OrderHistoryPage(page);
      await orderPage.authenticateViaApi(
        testData.apiBaseUrl,
        testData.testUser.email,
        testData.testUser.password
      );
      await page.route('**/api/orders/my-orders', (route) =>
        route.fulfill({
          json: [
            {
              id: tc.orderId,
              total_amount: 250000,
              status: tc.status,
              created_at: '2026-11-12T09:00:00.000Z',
            },
          ],
        })
      );

      await orderPage.goto();
      const row = orderPage.rowByOrderId(tc.orderId);
      const badge = orderPage.statusBadgeInRow(row);
      const cancelBtn = orderPage.cancelButtonInRow(row);

      await expect(badge).toHaveText(tc.expectedLabel);
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
  }

  test(`${testData.amountBoundaryCase.testId} - ${testData.amountBoundaryCase.title}`, async ({
    page,
  }) => {
    const tc = testData.amountBoundaryCase;
    const orderPage = new OrderHistoryPage(page);
    await orderPage.authenticateViaApi(
      testData.apiBaseUrl,
      testData.testUser.email,
      testData.testUser.password
    );
    await page.route('**/api/orders/my-orders', (route) =>
      route.fulfill({ json: tc.orders })
    );

    await orderPage.goto();
    const zeroRow = orderPage.rowByOrderId(tc.orders[0].id);
    const maxRow = orderPage.rowByOrderId(tc.orders[1].id);

    await expect(zeroRow).toContainText(new RegExp(tc.expectedZeroRegex));
    await expect(maxRow).toContainText(new RegExp(tc.expectedMaxRegex));
    await expect(orderPage.ordersTable).not.toContainText('NaN');
  });

  test(`${testData.apiErrorFallbackCase.testId} - ${testData.apiErrorFallbackCase.title}`, async ({
    page,
  }) => {
    const orderPage = new OrderHistoryPage(page);
    await orderPage.authenticateViaApi(
      testData.apiBaseUrl,
      testData.testUser.email,
      testData.testUser.password
    );
    await page.route('**/api/orders/my-orders', (route) =>
      route.fulfill({ status: 500, json: { error: 'Internal Server Error' } })
    );

    await orderPage.goto();
    await expect(orderPage.sectionHeading).toBeVisible();
    await expect(orderPage.emptyMessage).toHaveText(
      testData.apiErrorFallbackCase.expectedFallbackText
    );
  });

  test(`${testData.responsiveCase.testId} - ${testData.responsiveCase.title}`, async ({
    page,
  }) => {
    const tc = testData.responsiveCase;
    const orderPage = new OrderHistoryPage(page);
    await page.setViewportSize(tc.viewport);
    await orderPage.authenticateViaApi(
      testData.apiBaseUrl,
      testData.testUser.email,
      testData.testUser.password
    );
    await page.route('**/api/orders/my-orders', (route) =>
      route.fulfill({ json: [tc.sampleOrder] })
    );

    await orderPage.goto();
    await expect(orderPage.sectionHeading).toBeVisible();
    await expect(
      orderPage.rowByOrderId(tc.sampleOrder.id)
    ).toBeVisible();
  });
});
