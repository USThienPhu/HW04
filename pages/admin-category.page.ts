import { Page, Locator, expect } from '@playwright/test';

export class AdminCategoryPage {
  readonly page: Page;
  readonly categoryTabItem: Locator;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly addButton: Locator;
  readonly table: Locator;
  readonly tableHeaders: Locator;
  readonly tableRows: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.categoryTabItem = page.locator('aside li', { hasText: 'Danh mục' });
    this.heading = page.getByRole('heading', { name: 'Quản lý Danh mục' });
    this.nameInput = page.getByPlaceholder('Tên danh mục mới');
    this.addButton = page.getByRole('button', { name: 'Thêm mới' });
    this.table = page.locator('main table');
    this.tableHeaders = this.table.locator('thead th');
    this.tableRows = this.table.locator('tbody tr');
    this.loginButton = page.getByRole('button', { name: /Đăng nhập/i });
  }

  async gotoAdmin(adminBaseUrl: string): Promise<void> {
    await this.page.goto(adminBaseUrl);
  }

  async authenticateAsAdmin(
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
      window.localStorage.setItem('adminToken', tokenValue);
    }, body.token);
    return body.token;
  }

  async openCategoryTab(): Promise<void> {
    await this.categoryTabItem.click();
    await expect(this.heading).toBeVisible();
  }

  async createCategoryViaUi(name: string): Promise<void> {
    await this.nameInput.fill(name);
    await this.addButton.click();
  }

  rowByName(name: string): Locator {
    return this.tableRows.filter({ hasText: name }).first();
  }

  async deleteCategoryByName(name: string): Promise<void> {
    const row = this.rowByName(name);
    await row.getByRole('button', { name: 'Xóa' }).click();
  }
}
