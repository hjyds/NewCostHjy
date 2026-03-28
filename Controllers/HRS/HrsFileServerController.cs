using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models.Hrs;
using System;
using System.Collections.Generic;
using System.IO;

namespace NewCostHjy.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class HrsFileServerController : BaseController {

        private static readonly Dictionary<string, SaveFileData> _fileStorage = new Dictionary<string, SaveFileData>();
        private static readonly string _baseStoragePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "ServerFile");

        static HrsFileServerController() {
            if (!Directory.Exists(_baseStoragePath)) {
                Directory.CreateDirectory(_baseStoragePath);
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

                var storageDir = Path.Combine(_baseStoragePath, storageTag);
                if (!Directory.Exists(storageDir)) {
                    Directory.CreateDirectory(storageDir);
                }

                var filePath = Path.Combine(storageDir, fileId);
                using (var stream = new FileStream(filePath, FileMode.Create)) {
                    file.CopyTo(stream);
                }

                var data = new SaveFileData {
                    fileId = fileId,
                    storageTag = storageTag,
                    storageId = storageId,
                    fullPath = $"/ServerFile/{storageTag}/{fileId}",
                    state = "create ok",
                    remoteServer = $"{Request.Scheme}://{Request.Host}",
                    accessMapDir = "/files",
                    url = $"{Request.Scheme}://{Request.Host}/files/{storageTag}/{fileId}"
                };

                _fileStorage[fileId] = data;

                return Json(data);
            }
            catch (Exception ex) {
                return Json(null);
            }
        }

        [HttpGet("GetFile/{fileId}")]
        public IActionResult GetFile(string fileId) {
            if (_fileStorage.TryGetValue(fileId, out var fileData)) {
                var filePath = Path.Combine(_baseStoragePath, fileData.storageTag, fileId);
                if (System.IO.File.Exists(filePath)) {
                    var fileBytes = System.IO.File.ReadAllBytes(filePath);
                    return File(fileBytes, "application/octet-stream", fileData.fileId);
                }
            }

            return Json(new SaveFileResponse {
                Success = false,
                Msg = "文件不存在",
                Data = null,
                Code = 404
            });
        }

        [HttpGet("GetFileInfo/{fileId}")]
        public IActionResult GetFileInfo(string fileId) {
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

        [HttpGet("ListFiles")]
        public IActionResult ListFiles() {
            return Json(new {
                Success = true,
                Msg = "",
                Data = _fileStorage.Values,
                Code = 200
            });
        }

        [HttpDelete("DeleteFile/{fileId}")]
        public IActionResult DeleteFile(string fileId) {
            if (_fileStorage.TryGetValue(fileId, out var fileData)) {
                var filePath = Path.Combine(_baseStoragePath, fileData.storageTag, fileId);
                if (System.IO.File.Exists(filePath)) {
                    System.IO.File.Delete(filePath);
                }
                _fileStorage.Remove(fileId);
                
                return Json(new {
                    Success = true,
                    Msg = "删除成功",
                    Code = 200
                });
            }

            return Json(new {
                Success = false,
                Msg = "文件不存在",
                Code = 404
            });
        }
    }
}
