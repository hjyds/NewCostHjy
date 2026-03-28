using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models.Hrs;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace NewCostHjy.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class FormalResourceDetailController : BaseController {

        private static readonly Dictionary<string, SaveResDetailData> _resourceDetails = new Dictionary<string, SaveResDetailData>();

        [HttpPost("SaveResDetail")]
        public IActionResult SaveResDetail([FromBody] dynamic par) {
            try {
                string strTmp = JsonConvert.SerializeObject(par);
                var request = JsonConvert.DeserializeObject<Dictionary<string, object>>(strTmp);
                
                var resourceDetailId = Guid.NewGuid().ToString();
                var data = new SaveResDetailData {
                    save_sign = 0,
                    source = "资源录入",
                    resource_view_id = Guid.NewGuid().ToString(),
                    resource_type_id = Guid.NewGuid().ToString(),
                    creator_id = Guid.NewGuid().ToString(),
                    creator_name = "产品部HRS测试TOKEN",
                    resource_detail_id = resourceDetailId,
                    prop_files = new List<PropFile>()
                };

                _resourceDetails[resourceDetailId] = data;

                return Json(data);
            }
            catch (Exception ex) {
                return Json(null);
            }
        }

        [HttpGet("GetResDetail/{resourceDetailId}")]
        public IActionResult GetResDetail(string resourceDetailId) {
            if (_resourceDetails.TryGetValue(resourceDetailId, out var data)) {
                return Json(new SaveResDetailResponse {
                    Success = true,
                    Msg = "",
                    Data = data,
                    Code = 200
                });
            }

            return Json(new SaveResDetailResponse {
                Success = false,
                Msg = "资源详情不存在",
                Data = null,
                Code = 404
            });
        }

        [HttpGet("ListResDetails")]
        public IActionResult ListResDetails() {
            return Json(new {
                Success = true,
                Msg = "",
                Data = _resourceDetails.Values,
                Code = 200
            });
        }

        [HttpDelete("DeleteResDetail/{resourceDetailId}")]
        public IActionResult DeleteResDetail(string resourceDetailId) {
            if (_resourceDetails.Remove(resourceDetailId)) {
                return Json(new {
                    Success = true,
                    Msg = "删除成功",
                    Code = 200
                });
            }

            return Json(new {
                Success = false,
                Msg = "资源详情不存在",
                Code = 404
            });
        }
    }
}
