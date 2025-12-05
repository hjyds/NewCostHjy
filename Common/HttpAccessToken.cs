using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace NewCostHjy.Common {
    public class HttpAccessToken {

        public void TestFunc()
        {
            string url = "https://cqapi.cfkfz.com:28009/admin/follow/list?page=4&limit=500&startTime=2023-04-01+00:00:00&endTime=2023-05-04+23:59:59&followType=";
            string token = "b4f5e25f-077d-4ded-a7db-da14418c5702";
            _ = HttpGetFunAsync(url, token);
        }

        public async Task HttpGetFunAsync(string url,string token)
        {
            var httpClient = new HttpClient();
            // 创建请求实例
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("Access-Token", token);
            // 发送请求
            try
            {
                var response = await httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();
                var content = await response.Content.ReadAsStringAsync();
                Console.WriteLine(content);
            } catch (HttpRequestException ex)
            {
                Console.WriteLine($"请求失败: {ex.Message}");
            }
        }
    }
}
