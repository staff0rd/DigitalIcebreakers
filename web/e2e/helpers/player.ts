import { Browser, Page } from '@playwright/test';
import { AbstractBrowser } from './abstractBrowser';

export class Player extends AbstractBrowser {
  constructor(browser: Browser, page: Page) {
    super(browser, page);
  }
}