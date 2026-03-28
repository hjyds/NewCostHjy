using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models.Hrs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace NewCostHjy.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class HrsController : ControllerBase {

        private static readonly Dictionary<string, List<SaveResDetailData>> _resourceDetails = new Dictionary<string, List<SaveResDetailData>>();
        private static readonly Dictionary<string, SaveFileData> _fileStorage = new Dictionary<string, SaveFileData>();

        [HttpPost("SaveResDetail")]
        public IActionResult SaveResDetail([FromBody] dynamic par) {
            try {
                string strTmp = JsonConvert.SerializeObject(par);
                var request = JsonConvert.DeserializeObject<Dictionary<string, object>>(strTmp);
                
                var data = new SaveResDetailData {
                    save_sign = 0,
                    source = request.ContainsKey("save_content") ? "????" : "????",
                    resource_view_id = Guid.NewGuid().ToString(),
                    resource_type_id = Guid.NewGuid().ToString(),
                    creator_id = Guid.NewGuid().ToString(),
                    creator_name = "????",
                    resource_detail_id = Guid.NewGuid().ToString(),
                    prop_files = new List<PropFile>()
                };

                var response = new SaveResDetailResponse {
                    Success = true,
                    Msg = "",
                    Data = data,
                    Code = 200
                };

                return new JsonResult(response);
            }
            catch (Exception ex) {
                return new JsonResult(new SaveResDetailResponse {
                    Success = false,
                    Msg = ex.Message,
                    Data = null,
                    Code = 500
                });
            }
        }

        [HttpPost("SaveFile")]
        public IActionResult SaveFile() {
            try {
                var file = Request.Form.Files.Count > 0 ? Request.Form.Files[0] : null;
                
                if (file == null) {
                    return new JsonResult(new SaveFileResponse {
                        Success = false,
                        Msg = "???????",
                        Data = null,
                        Code = 400
                    });
                }

                var fileId = Guid.NewGuid().ToString();
                var storageTag = DateTime.Now.ToString("yyyyMMdd");
                var storageId = Guid.NewGuid().ToString();
                var fileName = file.FileName;

                var data = new SaveFileData {
                    fileId = fileId,
                    storageTag = storageTag,
                    storageId = storageId,
                    fullPath = $"/ServerFile/{storageTag}/{fileId}",
                    state = "create ok",
                    remoteServer = "http://localhost:8890",
                    accessMapDir = "/files",
                    url = null
                };

                _fileStorage[fileId] = data;

                var response = new SaveFileResponse {
                    Success = true,
                    Msg = "",
                    Data = data,
                    Code = 200
                };

                return new JsonResult(response);
            }
            catch (Exception ex) {
                return new JsonResult(new SaveFileResponse {
                    Success = false,
                    Msg = ex.Message,
                    Data = null,
                    Code = 500
                });
            }
        }

        [HttpPost("CallSaveBugCommit")]
        public IActionResult CallSaveBugCommit([FromBody] dynamic par) {
            try {
                string strTmp = JsonConvert.SerializeObject(par);
                
                var data = new SaveResDetailData {
                    save_sign = 0,
                    source = "????",
                    resource_view_id = Guid.NewGuid().ToString(),
                    resource_type_id = Guid.NewGuid().ToString(),
                    creator_id = Guid.NewGuid().ToString(),
                    creator_name = "???HRS??TOKEN",
                    resource_detail_id = Guid.NewGuid().ToString(),
                    prop_files = new List<PropFile>()
                };

                var response = new SaveResDetailResponse {
                    Success = true,
                    Msg = "",
                    Data = data,
                    Code = 200
                };

                return new JsonResult(response);
            }
            catch (Exception ex) {
                return new JsonResult(new SaveResDetailResponse {
                    Success = false,
                    Msg = ex.Message,
                    Data = null,
                    Code = 500
                });
            }
        }

        [HttpPost("CallUploadFile")]
        public IActionResult CallUploadFile() {
            try {
                var file = Request.Form.Files.Count > 0 ? Request.Form.Files[0] : null;
                
                if (file == null) {
                    return new JsonResult(new SaveFileResponse {
                        Success = false,
                        Msg = "???????",
                        Data = null,
                        Code = 400
                    });
                }

                var fileId = Guid.NewGuid().ToString();
                var storageTag = DateTime.Now.ToString("yyyyMMdd");
                var storageId = Guid.NewGuid().ToString();
                var fileName = file.FileName;

                var data = new SaveFileData {
                    fileId = fileId,
                    storageTag = storageTag,
                    storageId = storageId,
                    fullPath = $"/ServerFile/{storageTag}/{fileId}",
                    state = "create ok",
                    remoteServer = "http://localhost:8890",
                    accessMapDir = "/files",
                    url = null
                };

                _fileStorage[fileId] = data;

                var response = new SaveFileResponse {
                    Success = true,
                    Msg = "",
                    Data = data,
                    Code = 200
                };

                return new JsonResult(response);
            }
            catch (Exception ex) {
                return new JsonResult(new SaveFileResponse {
                    Success = false,
                    Msg = ex.Message,
                    Data = null,
                    Code = 500
                });
            }
        }

        [HttpGet("GetFile/{fileId}")]
        public IActionResult GetFile(string fileId) {
            if (_fileStorage.TryGetValue(fileId, out var fileData)) {
                return new JsonResult(new SaveFileResponse {
                    Success = true,
                    Msg = "",
                    Data = fileData,
                    Code = 200
                });
            }

            return new JsonResult(new SaveFileResponse {
                Success = false,
                Msg = "?????",
                Data = null,
                Code = 404
            });
        }

        [HttpGet("GetResourceDetail/{resourceId}")]
        public IActionResult GetResourceDetail(string resourceId) {
            return new JsonResult(new {
                Success = true,
                Msg = "",
                Data = new {
                    resource_id = resourceId,
                    resource_view_id = Guid.NewGuid().ToString(),
                    resource_type_id = Guid.NewGuid().ToString()
                },
                Code = 200
            });
        }

        [HttpGet("ListFiles")]
        public IActionResult ListFiles() {
            return new JsonResult(new {
                Success = true,
                Msg = "",
                Data = _fileStorage.Values,
                Code = 200
            });
        }

        [HttpPost("CallGetHrsToken")]
        public IActionResult CallGetHrsToken([FromBody] dynamic par) {
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

        private string GenerateToken(string user) {
            var header = new {
                alg = "HS256",
                typ = "JWT"
            };

            var payload = new {
                Name = "????HRS??TOKEN",
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

        private string Base64UrlEncode(string input) {
            var bytes = System.Text.Encoding.UTF8.GetBytes(input);
            return Convert.ToBase64String(bytes)
                .Replace('+', '-')
                .Replace('/', '_')
                .TrimEnd('=');
        }

        private string ComputeSignature(string input, string key) {
            using (var hmac = new System.Security.Cryptography.HMACSHA256(System.Text.Encoding.UTF8.GetBytes(key))) {
                var hash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(input));
                return Base64UrlEncode(Convert.ToBase64String(hash));
            }
        }
    }
}
