import { Page, Locator, expect } from '@playwright/test';

export class OrderHistoryPage {
  readonly page: Page;
  readonly loginPrompt: Locator;
  readonly sectionHeading: Locator;
  readonly emptyMessage: Locator;
  readonly ordersTable: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginPrompt = page.getByText('Vui lòng đăng nhập');
    this.sectionHeading = page.getByRole('heading', { name: 'Lịch sử đơn hàng' });
    this.emptyMessage = page.getByText('Bạn chưa có đơn hàng nào.');
    this.ordersTable = page.locator('main table');
    this.tableHeaders = this.ordersTable.locator('thead th');
    this.tableRows = this.ordersTable.locator('tbody tr');
  }

  async goto(): Promise<void> {
    await this.page.goto('/profile');
  }

  async authenticateViaApi(
    apiBaseUrl: string,
    email: string,
    password: string
  ): Promise<string> {
    const res = await this.page.request.post(`${apiBaseUrl}/api/login`, {
      data: { email, password },
    });
    expect(res.ok()).toBeTruthy();
    const body = (await res.json()) as { token: string };
    await this.page.addInitScript((tokenValue: string) => {
      window.localStorage.setItem('token', tokenValue);
    }, body.token);
    return body.token;
  }

  rowByOrderId(orderId: number): Locator {
    return this.tableRows.filter({ hasText: `#${orderId}` }).first();
  }

  statusBadgeInRow(row: Locator): Locator {
    return row.locator('td').nth(3).locator('span');
  }

  cancelButtonInRow(row: Locator): Locator {
    return row.getByRole('button', { name: 'Hủy đơn' });
  }
}
