using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;

namespace NewCostHjy.Controllers {
    /// <summary>
    /// 康复相关
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    public class RehabPatientController : BaseController {

        /// <summary>
        /// 判断当前病人是否显示康复页卡
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetIsRehabPatByPost")]
        public IActionResult GetIsRehabPatByPost([FromBody] RehabPatPar parIn) {            
            // 0时不显示，值为1或2时显示，其中2代表只读
            return Json(1);
        }


        /// <summary>
        /// 判断当前病人是否显示康复页卡(WEB住院医生站就是调用的这个怪)
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpGet("GetIsRehabPatByPost")]
        public IActionResult GetIsRehabPatByPost(string patientId, string visitId, string patDepartmentId) {
            // 0时不显示，值为1或2时显示，其中2代表只读
            return Json(1);
        }
    }
}
