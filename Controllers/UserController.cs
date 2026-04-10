using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Text;

namespace NewCostHjy.Controllers
{
    /// <summary>
    /// 用户控制器
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        /// <summary>
        /// 获取用户Token
        /// </summary>
        /// <param name="request">认证请求参数</param>
        /// <returns>Token响应</returns>
        [HttpPost("Token")]
        public IActionResult Token([FromBody] TokenRequest request)
        {
            string token = GenerateToken();
            // 直接返回token字符串
            return Content(token);

            try
            {
                // 验证参数
                if (request == null)
                {
                    return BadRequest(new { code = 400, message = "参数不能为空" });
                }

                // 当cipher为sm4时，解密account和password
                string account = request.account;
                string password = request.password;

                if (request.cipher == "sm4")
                {
                    // 这里使用SM4解密，实际项目中需要提供正确的密钥
                    string key = "5CEC5EC4-13A0-4B0C-B07C-7B6700189054"; // 实际项目中应该从配置文件或其他安全方式获取密钥
                    account = Sm4Decrypt(account, key);
                    password = Sm4Decrypt(password, key);
                }

                // 模拟验证逻辑
                if (request.authid == 1 &&
                    account == "28DD3B719082C16FE5D4331220BDB70D" &&
                    password == "EECD27D4B8F327E2244727025F1D9A6F" &&
                    request.cipher == "sm4")
                {
                    // 生成模拟Token
                    //string token = GenerateToken();

                    // 直接返回token字符串
                    //return Json(token);
                } else
                {
                    // 验证失败
                    return Unauthorized(new { code = 401, message = "认证失败" });
                }
            } catch (Exception ex)
            {
                // 异常处理
                return StatusCode(500, new { code = 500, message = "服务器内部错误" });
            }
        }

        /// <summary>
        /// 生成模拟Token
        /// </summary>
        /// <returns>Token字符串</returns>
        private string GenerateToken()
        {
            // 模拟生成Token
            return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ3ZWIiLCJleHAiOjE3NDQyMDc5OTgsImlhdCI6MTc0NDEyMTU5OCwiaXNzIjoiZXhhbXBsZSIsInN1YiI6IjI4RkQzQjcxOTA4MkMxNmZFNUQ0MzMxMjIwQkRCNzBEOiBFRUNEMjc0YjhmMzI3ZTIyNDQ3MjcwMjVmMWQ5YTZmIn0.Tj3K5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5f5";
        }

        /// <summary>
        /// SM4解密（ECB模式）
        /// </summary>
        /// <param name="ciphertext">密文</param>
        /// <param name="key">密钥</param>
        /// <returns>明文</returns>
        private string Sm4Decrypt(string ciphertext, string key)
        {
            try
            {
                // 这里是SM4 ECB模式解密的实现
                // 实际项目中建议使用成熟的SM4库
                
                // 这里假设密文是Base64编码的
                byte[] cipherBytes = Convert.FromBase64String(ciphertext);
                byte[] keyBytes = Encoding.UTF8.GetBytes(key);
                
                // 检查密钥长度
                if (keyBytes.Length != 16)
                {
                    throw new ArgumentException("SM4密钥长度必须为16字节");
                }
                
                // 生成轮密钥
                uint[] roundKeys = GenerateRoundKeys(keyBytes);
                
                // ECB模式解密
                byte[] plainBytes = new byte[cipherBytes.Length];
                for (int i = 0; i < cipherBytes.Length; i += 16)
                {
                    byte[] block = new byte[16];
                    Array.Copy(cipherBytes, i, block, 0, 16);
                    byte[] decryptedBlock = DecryptBlock(block, roundKeys);
                    Array.Copy(decryptedBlock, 0, plainBytes, i, 16);
                }
                
                // 移除填充（假设使用PKCS#7填充）
                int paddingLength = plainBytes[plainBytes.Length - 1];
                if (paddingLength > 0 && paddingLength <= 16)
                {
                    byte[] unpaddedBytes = new byte[plainBytes.Length - paddingLength];
                    Array.Copy(plainBytes, 0, unpaddedBytes, 0, unpaddedBytes.Length);
                    return Encoding.UTF8.GetString(unpaddedBytes);
                }
                
                return Encoding.UTF8.GetString(plainBytes);
            }
            catch (Exception ex)
            {
                // 解密失败时返回原始密文
                return ciphertext;
            }
        }

        /// <summary>
        /// 生成轮密钥
        /// </summary>
        /// <param name="key">密钥</param>
        /// <returns>轮密钥</returns>
        private uint[] GenerateRoundKeys(byte[] key)
        {
            uint[] roundKeys = new uint[32];
            uint[] FK = { 0xA3B1BAC6, 0x56AA3350, 0x677D9197, 0xB27022DC };
            uint[] CK = {
                0x00070e15, 0x1c232a31, 0x383f464d, 0x545b6269,
                0x70777e85, 0x8c939aa1, 0xa8afb6bd, 0xc4cbd2d9,
                0xe0e7eef5, 0xfc030a11, 0x181f262d, 0x343b4249,
                0x50575e65, 0x6c737a81, 0x888f969d, 0xa4abb2b9,
                0xc0c7ced5, 0xdce3eaf1, 0xf8ff060d, 0x141b2229,
                0x30373e45, 0x4c535a61, 0x686f767d, 0x848b9299,
                0xa0a7aeb5, 0xbcc3cad1, 0xd8dfe6ed, 0xf4fb0209,
                0x10171e25, 0x2c333a41, 0x484f565d, 0x646b7279
            };
            
            uint[] MK = new uint[4];
            for (int i = 0; i < 4; i++)
            {
                MK[i] = (uint)(key[i * 4] << 24 | key[i * 4 + 1] << 16 | key[i * 4 + 2] << 8 | key[i * 4 + 3]);
            }
            
            uint[] K = new uint[36];
            for (int i = 0; i < 4; i++)
            {
                K[i] = MK[i] ^ FK[i];
            }
            
            for (int i = 0; i < 32; i++)
            {
                K[i + 4] = K[i] ^ LFSR(K[i + 1] ^ K[i + 2] ^ K[i + 3] ^ CK[i]);
                roundKeys[i] = K[i + 4];
            }
            
            return roundKeys;
        }

        /// <summary>
        /// LFSR变换
        /// </summary>
        /// <param name="x">输入</param>
        /// <returns>输出</returns>
        private uint LFSR(uint x)
        {
            return x ^ ((x << 13) | (x >> 19)) ^ ((x << 23) | (x >> 9));
        }

        /// <summary>
        /// S盒变换
        /// </summary>
        /// <param name="x">输入</param>
        /// <returns>输出</returns>
        private uint SBox(uint x)
        {
            byte[] sbox = {
                0xd6, 0x90, 0xe9, 0xfe, 0xcc, 0xe1, 0x3d, 0xb7, 0x16, 0xb6, 0x14, 0xc2, 0x28, 0xfb, 0x2c, 0x05,
                0x2b, 0x67, 0x9a, 0x76, 0x2a, 0xbe, 0x04, 0xc3, 0xaa, 0x44, 0x13, 0x26, 0x49, 0x86, 0x06, 0x99,
                0x9c, 0x42, 0x50, 0xf4, 0x91, 0xef, 0x98, 0x7a, 0x33, 0x54, 0x0b, 0x43, 0xed, 0xcf, 0xac, 0x62,
                0xe4, 0xb3, 0x1c, 0xa9, 0xc9, 0x08, 0xe8, 0x95, 0x80, 0xdf, 0x94, 0xfa, 0x75, 0x8f, 0x3f, 0xa6,
                0x47, 0x07, 0xa7, 0xfc, 0xf3, 0x73, 0x17, 0xba, 0x83, 0x27, 0xb2, 0x0d, 0x59, 0xc4, 0x19, 0x0a,
                0xdb, 0xc6, 0xe7, 0x4c, 0xa4, 0x1a, 0x6d, 0x8b, 0xd1, 0x25, 0x72, 0xf8, 0xf6, 0x64, 0x87, 0x68,
                0x96, 0x81, 0x6d, 0xd4, 0xa2, 0x97, 0x82, 0x60, 0x5b, 0x9b, 0x89, 0x69, 0xb5, 0x3c, 0x1e, 0x11,
                0x58, 0xd3, 0xae, 0xc8, 0x66, 0x29, 0x01, 0x41, 0x7f, 0xa8, 0x3e, 0x1d, 0x71, 0x3a, 0xbd, 0x1b,
                0x00, 0x5f, 0x36, 0xd5, 0xc0, 0x5c, 0xb8, 0x74, 0x22, 0x4a, 0xd0, 0x12, 0xb9, 0x0e, 0x5e, 0x63,
                0x51, 0x21, 0x0c, 0x79, 0x6b, 0x88, 0xa1, 0x61, 0xd9, 0x6e, 0x15, 0x70, 0x84, 0x6f, 0x93, 0xe6,
                0x09, 0x78, 0x65, 0x8f, 0x1b, 0xa3, 0x03, 0x40, 0x02, 0x2d, 0xc1, 0x31, 0x10, 0x0f, 0x3e, 0xe2,
                0x98, 0x7c, 0x3b, 0x0a, 0x9e, 0x48, 0x24, 0x06, 0x55, 0x9d, 0x85, 0x72, 0xf6, 0xf4, 0x5a, 0x97,
                0x8d, 0x64, 0x90, 0xe9, 0x81, 0x5d, 0xd8, 0x82, 0x18, 0x07, 0xb0, 0x46, 0xc7, 0x23, 0xc3, 0x1d,
                0x00, 0x2a, 0x93, 0xaa, 0x08, 0x16, 0x4d, 0x2e, 0x0d, 0xd5, 0x74, 0x1f, 0x4b, 0xb9, 0xe8, 0x2f,
                0x8c, 0xa4, 0x71, 0x66, 0x61, 0x30, 0x01, 0x63, 0x40, 0x0b, 0x29, 0x67, 0x75, 0x92, 0x34, 0x41,
                0x95, 0x22, 0x0c, 0x7e, 0x6e, 0xf0, 0x89, 0x03, 0xf5, 0x85, 0x28, 0x96, 0xda, 0x0e, 0xe6, 0x68
            };
            
            uint result = 0;
            for (int i = 0; i < 4; i++)
            {
                byte b = (byte)((x >> (24 - i * 8)) & 0xff);
                result |= (uint)(sbox[b] << (24 - i * 8));
            }
            
            return result;
        }

        /// <summary>
        /// 解密单个块
        /// </summary>
        /// <param name="block">密文块</param>
        /// <param name="roundKeys">轮密钥</param>
        /// <returns>明文块</returns>
        private byte[] DecryptBlock(byte[] block, uint[] roundKeys)
        {
            uint[] x = new uint[4];
            for (int i = 0; i < 4; i++)
            {
                x[i] = (uint)(block[i * 4] << 24 | block[i * 4 + 1] << 16 | block[i * 4 + 2] << 8 | block[i * 4 + 3]);
            }
            
            for (int i = 31; i >= 0; i--)
            {
                uint temp = x[3];
                x[3] = x[2];
                x[2] = x[1];
                x[1] = x[0];
                x[0] = temp ^ F(x[0], x[1], x[2], roundKeys[i]);
            }
            
            byte[] result = new byte[16];
            for (int i = 0; i < 4; i++)
            {
                result[i * 4] = (byte)((x[i] >> 24) & 0xff);
                result[i * 4 + 1] = (byte)((x[i] >> 16) & 0xff);
                result[i * 4 + 2] = (byte)((x[i] >> 8) & 0xff);
                result[i * 4 + 3] = (byte)(x[i] & 0xff);
            }
            
            return result;
        }

        /// <summary>
        /// F函数
        /// </summary>
        /// <param name="x0">输入0</param>
        /// <param name="x1">输入1</param>
        /// <param name="x2">输入2</param>
        /// <param name="rk">轮密钥</param>
        /// <returns>输出</returns>
        private uint F(uint x0, uint x1, uint x2, uint rk)
        {
            return x0 ^ T(x1 ^ x2 ^ rk);
        }

        /// <summary>
        /// T函数
        /// </summary>
        /// <param name="x">输入</param>
        /// <returns>输出</returns>
        private uint T(uint x)
        {
            return L(SBox(x));
        }

        /// <summary>
        /// L变换
        /// </summary>
        /// <param name="x">输入</param>
        /// <returns>输出</returns>
        private uint L(uint x)
        {
            return x ^ ((x << 2) | (x >> 30)) ^ ((x << 10) | (x >> 22)) ^ ((x << 18) | (x >> 14)) ^ ((x << 24) | (x >> 8));
        }
    }

    /// <summary>
    /// Token请求参数
    /// </summary>
    public class TokenRequest
    {
        /// <summary>
        /// 认证ID
        /// </summary>
        public int authid { get; set; }

        /// <summary>
        /// 账号
        /// </summary>
        public string account { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string password { get; set; }

        /// <summary>
        /// 加密方式
        /// </summary>
        public string cipher { get; set; }
    }
}