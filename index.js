const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('chromedriver').path;

async function checkElementsText(elementsText, search, message) {
  let result = false
  for (const elementText of elementsText) {
    const title = await elementText.getText()
    if (title === search) {
      result = true
    }
  }
  if (result) {
    console.log(`ВЕРНО: ${message}`)
  } else {
    console.log(`НЕВЕРНО: ${message}`)
  }
}

const service = new chrome.ServiceBuilder(path).build();
chrome.setDefaultService(service);

const driver = new webdriver.Builder()
  .withCapabilities(webdriver.Capabilities.chrome())
  .build();

driver.get('https://habr.com/ru/');
driver.findElement({id: 'search-form-btn'}).click()
  .then(() => driver.findElement({id: 'search-form-field'}).sendKeys('Dins', webdriver.Key.ENTER))
  .then(() => driver.findElement(webdriver.By.css('a[href="https://habr.com/ru/search/?target_type=hubs&order_by=relevance&q=Dins"]')).click())
  .then(() => driver.findElement(webdriver.By.css('a[href="https://habr.com/ru/company/dins/"]')).click())
  .then(() => driver.findElement(webdriver.By.css('a[href="https://habr.com/ru/company/dins/profile/"]')).click())
  .then(() => driver.findElements(webdriver.By.css('h2[class="profile-section__title"]')))
  .then((titleElements) => checkElementsText(titleElements, 'О компании', 'Заголовок "О компании" существует'))
  .then(() => driver.findElements(webdriver.By.css('p[class="profile-section__about-text"]>b')))
  .then((textAboutTitles) => checkElementsText(textAboutTitles, 'Ключевые технологии:', 'Заголовок "Ключевые технологии" существует'))
  .then(() => driver.findElements(webdriver.By.css('li[class="defination-list__item defination-list__item_profile-summary"]')))
  .then((textInfoElements) => checkElementsText(textInfoElements, 'Дата основания 1998 год', 'Дата основания "1998 год"'))
  .then(() => driver.findElement(webdriver.By.css('a[class="footer__link js-show_lang_settings"]')).click())
  .then(() => driver.findElement(webdriver.By.css('label[for="hl_langs_en"]')).click())
  .then(() => driver.findElement(webdriver.By.css('button[class="btn btn_blue btn_huge btn_full-width js-popup_save_btn"]')).click())
  //.then(() => driver.findElements(webdriver.By.css('h2[class="profile-section__title"]')))
  //.then((titleElements) => checkElementsText(titleElements, 'About the company', 'Заголовок "About the company" существует'))
  //.then(() => driver.findElements(webdriver.By.css('p[class="profile-section__about-text"]>b')))
  //.then((textAboutTitles) => checkElementsText(textAboutTitles, 'Key technologies:', 'Заголовок "Key technologies" существует'))
  //.then(() => driver.findElements(webdriver.By.css('li[class="defination-list__item defination-list__item_profile-summary"]')))
  //.then((textInfoElements) => checkElementsText(textInfoElements, 'Foundation date Since 1998', 'Дата основания "Since 1998"'))
  .catch((err) => console.error(err.message))
  .finally(() => driver.close())
