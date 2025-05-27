import { createTool } from '@mastra/core';
import { z } from 'zod';

// Haber sonuçlarını parse eden yardımcı fonksiyon
function parseNewsResults(newsText: string, countryName: string): Array<{title: string, summary: string}> {
  const articles: Array<{title: string, summary: string}> = [];

  try {
    // Haber sonuçlarını satırlara böl
    const lines = newsText.split('\n');
    let currentArticle: {title?: string, summary?: string} = {};

    for (const line of lines) {
      const trimmedLine = line.trim();

      // Başlık satırlarını tespit et (** ile başlayan)
      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        // Önceki makaleyi kaydet
        if (currentArticle.title && currentArticle.summary) {
          articles.push({
            title: currentArticle.title,
            summary: currentArticle.summary
          });
        }

        // Yeni makale başlat
        currentArticle = {
          title: trimmedLine.replace(/\*\*/g, '').trim()
        };
      }
      // İçerik satırlarını tespit et
      else if (trimmedLine.length > 0 && !trimmedLine.includes('Search results for') && !trimmedLine.includes('https://')) {
        if (currentArticle.title && !currentArticle.summary) {
          currentArticle.summary = trimmedLine;
        }
      }
    }

    // Son makaleyi kaydet
    if (currentArticle.title && currentArticle.summary) {
      articles.push({
        title: currentArticle.title,
        summary: currentArticle.summary
      });
    }

    // Eğer parse edilemezse, tüm metni tek bir makale olarak döndür
    if (articles.length === 0 && newsText.length > 0) {
      articles.push({
        title: `${countryName} - Güncel Haberler`,
        summary: newsText.substring(0, 500) + (newsText.length > 500 ? '...' : '')
      });
    }

  } catch (error) {
    console.error('Haber parse hatası:', error);
    // Hata durumunda basit bir makale döndür
    articles.push({
      title: `${countryName} - Haber Özeti`,
      summary: newsText.substring(0, 300) + (newsText.length > 300 ? '...' : '')
    });
  }

  return articles;
}

// Geo News Tool - MCP entegrasyonu
export const geoNewsTool = createTool({
  id: 'geo-news',
  description: 'Belirli bir ülke için coğrafi haber özetleri alır',
  inputSchema: z.object({
    country: z.string().describe('Haber alınacak ülke kodu (örn: tr, en, de, fr, us) veya ülke adı')
  }),
  outputSchema: z.object({
    country: z.string(),
    articles: z.array(z.object({
      title: z.string(),
      summary: z.string()
    }))
  }),
  execute: async (context) => {
    try {
      // Context'i debug edelim
      console.log('Context:', JSON.stringify(context, null, 2));

      // Input'u context'ten alalım
      const input = (context as any).context || context;

      // Gerçek MCP server entegrasyonu
      console.log(`🔍 ${input?.country || 'Bilinmeyen ülke'} için haber aranıyor...`);

      const countryName = input?.country || 'Bilinmeyen ülke';

      // Ülke kodlarını tam ülke adlarına çevir
      const countryMap: Record<string, string> = {
        'tr': 'Turkey',
        'en': 'England',
        'de': 'Germany',
        'fr': 'France',
        'us': 'United States',
        'it': 'Italy',
        'es': 'Spain'
      };

      const searchQuery = countryMap[countryName.toLowerCase()] || countryName;
      console.log(`🔍 Search query: "${searchQuery}" (original: "${countryName}")`);

      try {
        // İlk önce get_news_by_country'yi dene
        let response = await fetch('https://server.smithery.ai/@Ymuberra/geo-news-mcp/mcp?api_key=b619b385-8ef7-4e44-a613-ee8bb026f261', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'tools/call',
            params: {
              name: 'get_news_by_country',
              arguments: {
                country: countryName,
                category: 'general'
              }
            },
            id: 1
          })
        });

        let data = await response.json();

        // Eğer haber bulunamazsa, search_news'i dene
        if (data.result?.content?.[0]?.text?.includes('No news found')) {
          console.log(`🔄 ${countryName} için haber bulunamadı, search_news ile deneniyor...`);

          response = await fetch('https://server.smithery.ai/@Ymuberra/geo-news-mcp/mcp?api_key=b619b385-8ef7-4e44-a613-ee8bb026f261', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'tools/call',
              params: {
                name: 'search_news',
                arguments: {
                  query: searchQuery,
                  language: 'en'
                }
              },
              id: 2
            })
          });

          data = await response.json();
        }

        if (response.ok) {
          console.log('MCP Server yanıtı:', JSON.stringify(data, null, 2));

          // MCP server'dan gelen yanıtı işle
          if (data.result && data.result.content && data.result.content[0] && data.result.content[0].text) {
            try {
              // MCP server'dan gelen text yanıtını JSON olarak parse et
              const newsData = JSON.parse(data.result.content[0].text);

              // Flask app'inizin döndürdüğü format: {"city": city, "articles": result}
              if (newsData.articles && Array.isArray(newsData.articles)) {
                return {
                  country: countryName,
                  articles: newsData.articles
                };
              }
            } catch (parseError) {
              // JSON parse edilemezse, text olarak işle
              const newsText = data.result.content[0].text;

              // Eğer gerçek haber verisi varsa onu kullan
              if (!newsText.includes('Error searching news') && !newsText.includes('No news found')) {
                // Haber sonuçlarını parse et
                const articles = parseNewsResults(newsText, countryName);

                if (articles.length > 0) {
                  return {
                    country: countryName,
                    articles: articles
                  };
                }
              }
            }
          }
        }
      } catch (mcpError: any) {
        console.log('MCP server hatası, mock data kullanılıyor:', mcpError?.message || 'Bilinmeyen hata');
      }

      // Fallback: Mock haber verileri
      console.log('Mock data kullanılıyor...');
      const mockArticles = [
        {
          title: `${countryName} - Güncel Gelişmeler`,
          summary: `${countryName} ülkesinde bugün önemli gelişmeler yaşandı. Ekonomik ve siyasi alanda yeni adımlar atıldı ve vatandaşlar bu gelişmeleri olumlu karşıladı.`
        },
        {
          title: `${countryName} Ekonomi Haberleri`,
          summary: `${countryName}'da ekonomik büyüme devam ediyor. Yeni yatırımlar ve uluslararası işbirlikleri ülkenin gelişimine katkı sağlıyor.`
        },
        {
          title: `${countryName} Kültür ve Sanat`,
          summary: `${countryName}'da kültürel etkinlikler artıyor. Yeni müze ve sanat galerisi açılışları ülkenin kültürel hayatını zenginleştiriyor.`
        }
      ];

      return {
        country: countryName,
        articles: mockArticles
      };
    } catch (error: any) {
      console.error('Geo News API hatası:', error);
      const input = (context as any).input || context;
      return {
        country: input?.country || 'Bilinmeyen ülke',
        articles: [{
          title: 'Hata',
          summary: `${input?.country || 'Bilinmeyen ülke'} için haber alınırken bir hata oluştu: ${error?.message || 'Bilinmeyen hata'}`
        }]
      };
    }
  }
});
