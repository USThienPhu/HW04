import fs from 'fs';
import path from 'path';
import type { FullConfig, FullResult, Reporter } from '@playwright/test/reporter';

/**
 * Custom Playwright Reporter to inject Student ID ("Run by: 23120327")
 * and an ISO 8601 timestamp into the generated Playwright HTML report.
 */
class StudentAuditReporter implements Reporter {
  private studentId = '23120327';
  private startedAt = '';
  private reportDir = path.resolve(process.cwd(), 'playwright-report');

  onBegin(config: FullConfig): void {
    this.startedAt = new Date().toISOString();
    const meta = config.metadata as Record<string, string> | undefined;
    if (meta?.studentId) {
      this.studentId = meta.studentId;
    }
  }

  onEnd(result: FullResult): void {
    const finishedAt = new Date().toISOString();
    const indexPath = path.join(this.reportDir, 'index.html');
    const marker = `Run by: ${this.studentId} | ISO Timestamp: ${finishedAt} | Status: ${result.status}`;

    console.log(`\n[StudentAuditReporter] ${marker}`);

    if (!fs.existsSync(indexPath)) {
      return;
    }

    let html = fs.readFileSync(indexPath, 'utf-8');
    if (html.includes('id="student-audit-banner"')) {
      return;
    }

    const banner = `<div id="student-audit-banner" style="background:#0f172a;color:#f8fafc;padding:10px 16px;font-family:monospace;font-size:13px;border-bottom:2px solid #38bdf8;">Run by: ${this.studentId} | Started: ${this.startedAt} | Finished: ${finishedAt} | Status: ${result.status}</div>`;

    if (html.includes('<body>')) {
      html = html.replace('<body>', `<body>${banner}`);
    } else {
      html = `${banner}\n${html}`;
    }

    fs.writeFileSync(indexPath, html, 'utf-8');
  }
}

export default StudentAuditReporter;
