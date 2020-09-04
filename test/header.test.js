const puppeteer = require('puppeteer');

let browser, page;

beforeEach( async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto('localhost:3000');
});

test('The header has the correct test', async () => {
  const text = await page.$eval('a.brand-logo', el => el.innerHTML);
  expect(text).toEqual('Blogster');
});

test('Clicking login starts oauth flow', async () => {
  await page.click('.right a');
  const url = await page.url();
  expect(url).toMatch('/accounts\.google\.com/')
});

test('When signed in, shows logout button', async () => {
  const id = '5f2b5c9e68a31d04fd9a800f';
  const Buffer = require('safe-buffer').Buffer;
  const session = { passport: { user: id } };
  const sessionString = Buffer.from(
    JSON.stringify(session)
  ).toString('base64');
  const Keygrip = require('keygrip');
  const keys = require('../config/keys');
  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign('session=' + sessionString);

  await page.setCookie({ name: 'session', value: sessionString });
  await page.setCookie({ name: 'session.sig', value: sig });
  await page.goto('localhost:3000');
  await page.waitFor('a[href="/auth/logout"]');
  const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHTML);
  expect(text).toEqual('Logout');
});

afterEach( async () => {
  await browser.close();
});