using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models.Hrs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;

namespace NewCostHjy.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class HrsController : BaseController {

        private static readonly Dictionary<string, List<SaveResDetailData>> _resourceDetails = new Dictionary<string, List<SaveResDetailData>>();
        private static readonly Dictionary<string, SaveFileData> _fileStorage = new Dictionary<string, SaveFileData>();

        [HttpPost("SaveResDetail")]
        public IActionResult SaveResDetail([FromBody] dynamic par) {
            try {
                string strTmp = JsonConvert.SerializeObject(par);
                var request = JsonConvert.DeserializeObject<Dictionary<string, object>>(strTmp);
                
                var data = new SaveResDetailData {
                    save_sign = 0,
                    source = request.ContainsKey("save_content") ? "资源录入" : "未知来源",
                    resource_view_id = Guid.NewGuid().ToString(),
                    resource_type_id = Guid.NewGuid().ToString(),
                    creator_id = Guid.NewGuid().ToString(),
                    creator_name = "系统用户",
                    resource_detail_id = Guid.NewGuid().ToString(),
                    prop_files = new List<PropFile>()
                };

                var response = new SaveResDetailResponse {
                    Success = true,
                    Msg = "",
                    Data = data,
                    Code = 200
                };

                return Json(response);
            }
            catch (Exception ex) {
                return Json(new SaveResDetailResponse {
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
                    return Json(new SaveFileResponse {
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

                var response = new SaveFileResponse {
                    Success = true,
                    Msg = "",
                    Data = data,
                    Code = 200
                };

                return Json(response);
            }
            catch (Exception ex) {
                return Json(new SaveFileResponse {
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
                    source = "资源录入",
                    resource_view_id = Guid.NewGuid().ToString(),
                    resource_type_id = Guid.NewGuid().ToString(),
                    creator_id = Guid.NewGuid().ToString(),
                    creator_name = "产品部HRS测试TOKEN",
                    resource_detail_id = Guid.NewGuid().ToString(),
                    prop_files = new List<PropFile>()
                };

                var response = new SaveResDetailResponse {
                    Success = true,
                    Msg = "",
                    Data = data,
                    Code = 200
                };

                return Json(response);
            }
            catch (Exception ex) {
                return Json(new SaveResDetailResponse {
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
                    return Json(new SaveFileResponse {
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

                var response = new SaveFileResponse {
                    Success = true,
                    Msg = "",
                    Data = data,
                    Code = 200
                };

                return Json(response);
            }
            catch (Exception ex) {
                return Json(new SaveFileResponse {
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
                return Json(new SaveFileResponse {
                    Success = true,
                    Msg = "",
                    Data = fileData,
                    Code = 200
                });
            }

            return Json(new SaveFileResponse {
                Success = false,
                Msg = "文件不存在",
                Data = null,
                Code = 404
            });
        }

        [HttpGet("GetResourceDetail/{resourceId}")]
        public IActionResult GetResourceDetail(string resourceId) {
            return Json(new {
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
            return Json(new {
                Success = true,
                Msg = "",
                Data = _fileStorage.Values,
                Code = 200
            });
        }
    }
}
