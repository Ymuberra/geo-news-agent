import 'dotenv/config';

// MCP Server Test Dosyası
async function testMCPServer() {
  console.log('🧪 MCP Server Test Başlıyor...\n');

  const testCases = [
    { name: 'search_news', args: { q: 'Turkey' } },
    { name: 'search_news', args: { q: 'technology' } },
    { name: 'get_news_by_country', args: { message: 'tr' } },
    { name: 'get_news_by_country', args: { country: 'tr' } }
  ];

  for (const testCase of testCases) {
    console.log(`📡 Test: ${testCase.name} with args:`, testCase.args);
    
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
            name: testCase.name,
            arguments: testCase.args
          },
          id: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Yanıt alındı:');
        console.log(JSON.stringify(data, null, 2));
      } else {
        console.log('❌ HTTP Hatası:', response.status, response.statusText);
      }
    } catch (error) {
      console.log('❌ Bağlantı Hatası:', error.message);
    }
    
    console.log('─'.repeat(50));
  }

  console.log('🏁 Test tamamlandı!');
}

// Test'i çalıştır
testMCPServer();
