import 'dotenv/config';

// MCP Server Tool Listesi Debug
async function debugMCPTools() {
  console.log('🔍 MCP Server Tool Listesi Debug...\n');

  try {
    // MCP server'dan mevcut tool'ları listele
    const response = await fetch('https://server.smithery.ai/@Ymuberra/geo-news-mcp/mcp?api_key=b619b385-8ef7-4e44-a613-ee8bb026f261', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'tools/list',
        id: 1
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('📋 Mevcut Tool Listesi:');
      console.log(JSON.stringify(data, null, 2));
      
      if (data.result && data.result.tools) {
        console.log('\n🛠️ Tool Adları:');
        data.result.tools.forEach((tool: any, index: number) => {
          console.log(`${index + 1}. ${tool.name} - ${tool.description || 'Açıklama yok'}`);
        });
      }
    } else {
      console.log('❌ HTTP Hatası:', response.status, response.statusText);
    }
  } catch (error) {
    console.log('❌ Bağlantı Hatası:', error.message);
  }

  console.log('\n🧪 Farklı Tool Adlarını Test Edelim...\n');

  const toolsToTest = [
    'search_news',
    'get_news_by_country', 
    'searchNews',
    'getNewsByCountry',
    'news_search',
    'country_news'
  ];

  for (const toolName of toolsToTest) {
    console.log(`📡 Test: ${toolName}`);
    
    try {
      const response = await fetch('https://server.smithery.ai/@Ymuberra/geo-news-mcp/mcp?api_key=b619b385-8ef7-4e44-a613-ee8bb026f261', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: toolName,
            arguments: {
              message: 'test'
            }
          },
          id: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.error) {
          console.log(`❌ ${toolName}: ${data.error.message}`);
        } else {
          console.log(`✅ ${toolName}: Çalışıyor!`);
        }
      }
    } catch (error) {
      console.log(`❌ ${toolName}: Bağlantı hatası`);
    }
  }

  console.log('\n🏁 Debug tamamlandı!');
}

// Debug'ı çalıştır
debugMCPTools();
