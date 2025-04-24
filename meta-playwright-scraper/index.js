const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1️⃣ Remplace cette URL par celle de ta pub Facebook (Ads Library)
  const pubURL = 'https://www.facebook.com/ads/library/?id=552094061158122';
  await page.goto(pubURL, { waitUntil: 'networkidle' });

  // 2️⃣ Récupération des données dans le DOM
  const title = await page.title();
  console.log('Titre de la page :', title);

  const copywriting = await page.locator('div:has-text("Pourquoi je vois ça ?") >> xpath=../..').first().textContent();
  console.log('\n📝 Copywriting de la pub :\n', copywriting);

  const statusElement = await page.locator('text=/Cette publicité (est|n’est plus) active/').first();
  const statusText = await statusElement.textContent();
  console.log('\n📌 Statut :', statusText);

  const dateElement = await page.locator('text=/a commencé à être diffusée le/').first();
  const dateText = await dateElement.textContent();
  console.log('\n📅 Date de diffusion :', dateText);

  // 3️⃣ Récupération de l’URL .mp4 (interception du trafic réseau)
  let videoURL = null;

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('.mp4') && url.includes('fbcdn.net')) {
      videoURL = url;
      console.log('\n🎥 URL .mp4 :', videoURL);
    }
  });

  // 4️⃣ Attendre quelques secondes pour laisser le temps à la vidéo de charger
  await page.waitForTimeout(5000);

  await browser.close();
})();