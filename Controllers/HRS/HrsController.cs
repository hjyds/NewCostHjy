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
                    source = request.ContainsKey("save_content") ? "保存内容" : "编辑内容",
                    resource_view_id = Guid.NewGuid().ToString(),
                    resource_type_id = Guid.NewGuid().ToString(),
                    creator_id = Guid.NewGuid().ToString(),
                    creator_name = "管理员",
                    resource_detail_id = Guid.NewGuid().ToString(),
                    prop_files = new List<PropFile>()
                };

                return new JsonResult(data);
            }
            catch (Exception ex) {
                return new JsonResult(null);
            }
        }

        [HttpPost("SaveFile")]
        public IActionResult SaveFile() {
            try {
                var file = Request.Form.Files.Count > 0 ? Request.Form.Files[0] : null;
                
                if (file == null) {
                    return new JsonResult(new SaveFileResponse {
                        Success = false,
                        Msg = "未找到上传文件",
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

                return new JsonResult(data);
            }
            catch (Exception ex) {
                return new JsonResult(null);
            }
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

        private string GenerateToken(dynamic user) {
            return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJOYW1lIjoi5Lqn5ZOB6LCD55SoSFJT55Sf5oiQVE9LRU4iLCJVc2VyTmFtZSI6InpsdG9rZW4iLCJJUCI6IiIsInNzb191aWQiOiI1Y2I0Njk1YS03MjVjLTRhZmMtYmVmZS1kNDcxZWUxMzM4MDUiLCJCU0NvZGUiOiIiLCJBY2NvdW50SUQiOiI2NmQ0ZTRiNS1kMTJhLTQ1YWMtODQ0Yy1hMTk5ODQxMzBmNDAiLCJBdXRoSUQiOiIxIiwiU0MiOiIiLCJDQVNUIjoiIiwiZXhwIjoxNzc0NzA2MTUzLCJpc3MiOiJ6bHNvZnQiLCJhdWQiOiJzc28ifQ.VpotLJQPanRUZeMjS7UTaGqnkIuYNoeSVeDo1bnSQXs";
        }
    }
}
