import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class OptimizelyLoginPage extends BasePage {
    constructor(page: Page) {
        super(page);
    }

    private assertStatus200(response: Awaited<ReturnType<Page['goto']>>, action: string) {
        if (!response) {
            throw new Error(`${action} failed: no HTTP response was returned.`);
        }

        if (response.status() !== 200) {
            throw new Error(
                `${action} failed: expected HTTP 200, got ${response.status()} ${response.statusText()} (${response.url()})`
            );
        }
    }

    async loginAuto(roleToken: string) {    
        // go to impersonation URL to trigger login
        const response = await this.page.goto(`/user/impersonate?roletoken=${roleToken}`, {
            waitUntil: 'domcontentloaded',
        });
        this.assertStatus200(response, 'Impersonation login');
    }

    async goToStartPage() {
        const response = await this.page.goto('/', { waitUntil: 'domcontentloaded' });
        this.assertStatus200(response, 'Start page navigation');
    }
}
