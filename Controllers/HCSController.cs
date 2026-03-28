using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models.Hrs;
using Newtonsoft.Json;
using System;
using System.Security.Cryptography;
using System.Text;

namespace NewCostHjy.Controllers {
    /// <summary>
    /// HCS服务控制器 - 对应 https://sso.zlsoft.cn/res/HCS/Execute
    /// </summary>
    [Route("res/HCS")]
    [ApiController]
    public class HCSController : ControllerBase {

        /// <summary>
        /// HCS Execute服务
        /// 服务地址: https://sso.zlsoft.cn/res/HCS/Execute
        /// </summary>
        /// <param name="par">请求参数</param>
        /// <returns>Token响应</returns>
        [HttpPost("Execute")]
        public IActionResult Execute([FromBody] dynamic par) {
            try {
                string strTmp = JsonConvert.SerializeObject(par);
                var request = JsonConvert.DeserializeObject<GetHrsTokenRequest>(strTmp);
                
                if (request == null || request.inargs == null) {
                    return new JsonResult(new GetHrsTokenResponse {
                        Success = false,
                        Data = null
                    });
                }

                var token = GenerateToken(request.inargs.user);

                var response = new GetHrsTokenResponse {
                    Success = true,
                    Data = new TokenData {
                        token = token
                    }
                };

                return new JsonResult(response);
            }
            catch (Exception) {
                return new JsonResult(new GetHrsTokenResponse {
                    Success = false,
                    Data = null
                });
            }
        }

        /// <summary>
        /// 生成JWT Token
        /// </summary>
        private string GenerateToken(string user) {
            var header = new {
                alg = "HS256",
                typ = "JWT"
            };

            var payload = new {
                Name = "测试用户HRS测试TOKEN",
                UserName = "zltoken",
                IP = "",
                sso_uid = Guid.NewGuid().ToString(),
                BSCode = "",
                AccountID = Guid.NewGuid().ToString(),
                AuthID = "1",
                SC = "",
                CAST = "",
                exp = DateTimeOffset.UtcNow.AddHours(24).ToUnixTimeSeconds(),
                iss = "zlsoft",
                aud = "sso"
            };

            var headerBase64 = Base64UrlEncode(JsonConvert.SerializeObject(header));
            var payloadBase64 = Base64UrlEncode(JsonConvert.SerializeObject(payload));
            var signature = ComputeSignature(headerBase64 + "." + payloadBase64, "your-secret-key");

            return $"{headerBase64}.{payloadBase64}.{signature}";
        }

        /// <summary>
        /// Base64 URL编码
        /// </summary>
        private string Base64UrlEncode(string input) {
            var bytes = Encoding.UTF8.GetBytes(input);
            return Convert.ToBase64String(bytes)
                .Replace('+', '-')
                .Replace('/', '_')
                .TrimEnd('=');
        }

        /// <summary>
        /// 计算HMACSHA256签名
        /// </summary>
        private string ComputeSignature(string input, string key) {
            using (var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(key))) {
                var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(input));
                return Base64UrlEncode(Convert.ToBase64String(hash));
            }
        }
    }
}
