using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace NewCostHjy.BLL
{
    public class ImageDownloader
    {
        private readonly HttpClient _httpClient;

        public ImageDownloader()
        {
            _httpClient = new HttpClient();
            // 设置超时时间
            _httpClient.Timeout = TimeSpan.FromSeconds(30);
        }

        /// <summary>
        /// 异步下载图片并保存到本地
        /// </summary>
        /// <param name="imageUrl">图片URL地址</param>
        /// <param name="savePath">保存路径（包含文件名）</param>
        public async Task<bool> DownloadImageAsync(string imageUrl, string savePath)
        {
            try
            {
                // 发送GET请求
                HttpResponseMessage response = await _httpClient.GetAsync(imageUrl, HttpCompletionOption.ResponseHeadersRead);
                response.EnsureSuccessStatusCode(); // 确保响应成功

                // 确保目录存在
                string directory = Path.GetDirectoryName(savePath);
                if (!Directory.Exists(directory))
                {
                    Directory.CreateDirectory(directory);
                }

                // 创建文件流并保存图片
                using (FileStream fileStream = new FileStream(savePath, FileMode.Create, FileAccess.Write, FileShare.None))
                {
                    await response.Content.CopyToAsync(fileStream);
                }

                Console.WriteLine($"图片下载成功: {savePath}");
                return true;
            } catch (Exception ex)
            {
                Console.WriteLine($"下载失败: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// 同步下载图片（不推荐，可能阻塞线程）
        /// </summary>
        public bool DownloadImage(string imageUrl, string savePath)
        {
            try
            {
                using (WebClient client = new WebClient())
                {
                    // 确保目录存在
                    string directory = Path.GetDirectoryName(savePath);
                    if (!Directory.Exists(directory))
                    {
                        Directory.CreateDirectory(directory);
                    }

                    client.DownloadFile(new Uri(imageUrl), savePath);
                    Console.WriteLine($"图片下载成功: {savePath}");
                    return true;
                }
            } catch (Exception ex)
            {
                Console.WriteLine($"下载失败: {ex.Message}");
                return false;
            }
        }

        public void Dispose()
        {
            _httpClient?.Dispose();
        }
    }
}
