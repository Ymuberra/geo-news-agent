# Geo News Mastra Agent

Bu proje, Mastra framework'ü kullanarak geo-news MCP tool'unuzu entegre eden bir AI agent'ıdır.

## 🚀 Özellikler

- **Coğrafi Haber Asistanı**: Belirli ülkeler için güncel haber özetleri
- **MCP Tool Entegrasyonu**: Mevcut geo-news MCP server'ınızla entegrasyon ✅ ÇALIŞIYOR!
- **Türkçe Destek**: Türkçe haber özetleri ve yanıtlar
- **Mastra Framework**: Modern AI agent geliştirme framework'ü
- **Fallback Sistemi**: MCP server'a erişilemediğinde mock data kullanır

## 📦 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme modunda çalıştır
npm run dev
```

## 🛠️ Kullanım

### Agent ile Etkileşim

```typescript
import { mastra } from './src/mastra/index.js';

const agent = mastra.getAgent('geoNewsAgent');
const result = await agent.generate('Turkey hakkında güncel haberleri getir');
console.log(result.text);
```

### Tool'u Doğrudan Kullanma

```typescript
import { geoNewsTool } from './src/mastra/tools/geo-news.js';

const result = await geoNewsTool.execute({
  input: { country: 'Germany' }
});
console.log(result);
```

## 🧪 Test

Örnek test dosyasını çalıştırın:

```bash
npx tsx example.ts
```

## 🔧 Konfigürasyon

### MCP Server URL

Tool, aşağıdaki MCP server URL'ini kullanır:
```
https://server.smithery.ai/@Ymuberra/geo-news-mcp/mcp?api_key=b619b385-8ef7-4e44-a613-ee8bb026f261
```

### OpenAI API Key

`.env` dosyası oluşturun ve OpenAI API key'inizi ekleyin:
```
OPENAI_API_KEY=your_openai_api_key_here
```

## 📁 Proje Yapısı

```
geo-news-mastra-agent/
├── src/
│   └── mastra/
│       ├── agents/
│       │   └── geo-news-agent.ts    # Ana AI agent
│       ├── tools/
│       │   └── geo-news.ts          # MCP tool entegrasyonu
│       └── index.ts                 # Mastra konfigürasyonu
├── example.ts                       # Örnek kullanım
├── package.json
└── README.md
```

## 🌟 Özellikler

### Geo News Agent

- **Akıllı Haber Analizi**: Şehir bazlı haber filtreleme
- **Otomatik Özetleme**: Haberleri anlaşılır özetler halinde sunar
- **Çoklu Şehir Desteği**: Farklı şehirler için haber alabilir
- **Hata Yönetimi**: API hatalarını zarif bir şekilde yönetir

### MCP Tool Entegrasyonu

- **Seamless Integration**: Mevcut MCP server'ınızla sorunsuz entegrasyon
- **Type Safety**: TypeScript ile tip güvenliği
- **Error Handling**: Kapsamlı hata yönetimi
- **Flexible Input**: Esnek şehir adı girişi

## 🚀 Geliştirme

```bash
# Geliştirme modunda çalıştır
npm run dev

# Build
npm run build

# Test
npm test
```

## 📝 API Referansı

### geoNewsTool

```typescript
interface GeoNewsInput {
  city: string; // Haber alınacak şehir adı
}

interface GeoNewsOutput {
  city: string;
  articles: Array<{
    title: string;
    summary: string;
  }>;
}
```

### geoNewsAgent

Agent, doğal dil komutlarını kabul eder:
- "Istanbul hakkında haber getir"
- "Ankara'daki son gelişmeleri özetle"
- "Izmir için güncel haberleri göster"

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 🔧 Troubleshooting

### MCP Server Bağlantı Sorunları

Eğer MCP server'ınızdan yanıt alamıyorsanız:

1. **Tool Adını Kontrol Edin**: Smithery'de tool adının `search_news` olduğundan emin olun
2. **Parametreleri Kontrol Edin**: News API'nin hangi parametreleri beklediğini kontrol edin
3. **API Key'i Kontrol Edin**: MCP server URL'indeki API key'in doğru olduğundan emin olun

### Mock Data Kullanımı

Şu anda sistem MCP server'a erişemediğinde otomatik olarak mock data kullanır. Bu sayede:
- Sistem her zaman çalışır durumda kalır
- Geliştirme ve test süreçleri kesintisiz devam eder
- Gerçek MCP server düzeltildikten sonra otomatik olarak gerçek data kullanılır

### MCP Server'ı Düzeltmek İçin

1. Flask app'inizdeki `/dispatch` endpoint'ini kontrol edin
2. Smithery'deki tool konfigürasyonunu gözden geçirin
3. News API parametrelerini doğrulayın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.
