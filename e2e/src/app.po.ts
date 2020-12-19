import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.id('free')).getText() as Promise<string>;
  }
  getHeadingText(): Promise<string> {
    return element(by.id('stay')).getText() as Promise<string>;
  }
}
