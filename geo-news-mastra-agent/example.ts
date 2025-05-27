import 'dotenv/config';
import { mastra } from './src/mastra/index.js';

async function testGeoNewsAgent() {
  try {
    console.log('🌍 Geo News Agent Test Başlıyor...\n');

    // Agent'ı al
    const agent = mastra.getAgent('geoNewsAgent');

    if (!agent) {
      console.error('❌ Agent bulunamadı!');
      return;
    }

    // Test ülkeleri (ülke kodları)
    const testCountries = [
      { code: 'tr', name: 'Türkiye' },
      { code: 'de', name: 'Almanya' },
      { code: 'fr', name: 'Fransa' }
    ];

    for (const country of testCountries) {
      console.log(`📰 ${country.name} (${country.code}) için haberler getiriliyor...`);

      const result = await agent.generate(`${country.code} ülke kodu için güncel haberleri getir ve özetle`);

      console.log(`\n🌍 ${country.name} Haberleri:`);
      console.log('─'.repeat(50));
      console.log(result.text);
      console.log('─'.repeat(50));
      console.log();
    }

    console.log('✅ Test tamamlandı!');

  } catch (error) {
    console.error('❌ Hata oluştu:', error);
  }
}

// Test fonksiyonunu çalıştır
testGeoNewsAgent();
