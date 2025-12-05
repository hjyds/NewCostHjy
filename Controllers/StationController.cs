using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers {
    /// <summary>
    /// 传染病相关
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    public class StationController : BaseController {

        /// <summary>
        /// 传染病相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("OperationDiseaseReport")]
        public IActionResult OperationDiseaseReport([FromBody] dynamic parIn) {
            // 0时不显示，值为1或2时显示，其中2代表只读
            return Json(1);
        }


        /// <summary>
        /// 传染病相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetReportList")]
        public IActionResult GetReportList([FromBody] dynamic parIn) {
            // 0时不显示，值为1或2时显示，其中2代表只读
            return Json(1);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="DiseaseID"></param>
        /// <returns></returns>
        [HttpGet("GetDiseaseListByDiseaseID")]
        public IActionResult GetDiseaseListByDiseaseID(string DiseaseID) {
            return Json(1);
        }
 
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DiseaseID"></param>
        /// <returns></returns>
        [HttpGet("GetDiseaseFeedBackInfo")]
        public IActionResult GetDiseaseFeedBackInfo(string diseasereportid) {
            return Json(1);
        }
    }
}
