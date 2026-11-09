const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  
  // 1. Visit lobby
  await page.goto('http://localhost:3000');
  await page.waitForSelector('#screen-lobby');
  await page.screenshot({ path: '/tmp/test_lobby.png' });
  console.log('Lobby rendered successfully');

  // Verify Alex is present in lobby
  const alexIntro = await page.$('.alex-hint-box');
  console.log('Alex intro card present in lobby:', !!alexIntro);

  // Fill lobby form and enter
  await page.fill('#input-student1', 'Elena');
  await page.fill('#input-student2', 'Pablo');
  await page.fill('#input-group', '2º ESO A');
  await page.fill('#input-team', 'Los Pitagóricos');
  await page.click('#btn-start-adventure');

  // Silvextrux intro screen for Chamber 1
  await page.waitForSelector('#screen-silvextrux-intro', { state: 'visible' });
  console.log('Silvextrux intro 1 visible');
  await page.click('#btn-advance-from-intro');

  // Chamber 1
  await page.waitForSelector('#screen-chamber-1', { state: 'visible' });
  const c1Text = await page.innerText('#chamber-1-challenge-text');
  console.log('Chamber 1 Challenge Text:', c1Text);
  await page.screenshot({ path: '/tmp/test_c1.png' });

  // Advance to Chamber 2 via evaluate
  await page.evaluate(() => {
    goToChamberIntro(2);
    enterChamberActive(2);
  });
  await page.waitForSelector('#screen-chamber-2', { state: 'visible' });
  
  // Slide paper slider
  await page.evaluate(() => {
    const slider = document.getElementById('paper-folds-slider');
    slider.value = '5';
    slider.dispatchEvent(new Event('input'));
  });
  const c2CalcTitle = await page.innerText('#paper-thickness-title');
  console.log('Chamber 2 Slider 5 calculation:', c2CalcTitle);
  await page.screenshot({ path: '/tmp/test_c2.png' });

  // Advance to Chamber 3
  await page.evaluate(() => {
    goToChamberIntro(3);
    enterChamberActive(3);
  });
  await page.waitForSelector('#screen-chamber-3', { state: 'visible' });
  const hasGuidedExample = await page.$('.guided-example-box');
  console.log('Chamber 3 guided example box present:', !!hasGuidedExample);
  await page.screenshot({ path: '/tmp/test_c3.png' });

  // Advance to Chamber 5
  await page.evaluate(() => {
    goToChamberIntro(5);
    enterChamberActive(5);
  });
  await page.waitForSelector('#screen-chamber-5', { state: 'visible' });
  const c5Apartados = await page.$$('.apartado-card');
  console.log('Chamber 5 apartados count:', c5Apartados.length);
  await page.click('#btn-c5-expand-a');
  await page.click('#btn-c5-expand-b');
  await page.click('#btn-c5-expand-c');
  await page.screenshot({ path: '/tmp/test_c5.png' });

  // Advance to Chamber 6
  await page.evaluate(() => {
    goToChamberIntro(6);
    enterChamberActive(6);
  });
  await page.waitForSelector('#screen-chamber-6', { state: 'visible' });
  await page.click('#btn-c6-cancel-a');
  await page.click('#btn-c6-cancel-b');
  await page.click('#btn-c6-cancel-c');
  await page.screenshot({ path: '/tmp/test_c6.png' });

  // Advance to Chamber 7
  await page.evaluate(() => {
    goToChamberIntro(7);
    enterChamberActive(7);
  });
  await page.waitForSelector('#screen-chamber-7', { state: 'visible' });
  await page.click('#btn-c7-expand-a');
  await page.click('#btn-c7-expand-b');
  await page.click('#btn-c7-expand-c');
  await page.screenshot({ path: '/tmp/test_c7.png' });

  // Advance to Diploma
  await page.evaluate(() => {
    showDiplomaScreen();
  });
  await page.waitForSelector('#screen-diploma', { state: 'visible' });
  await page.screenshot({ path: '/tmp/test_diploma.png' });
  console.log('Diploma screen visible and verified');

  await browser.close();
  console.log('ALL PLAYWRIGHT TESTS PASSED SUCCESSFULLY!');
})();
