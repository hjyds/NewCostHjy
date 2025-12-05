using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;

namespace NewCostHjy.Controllers {
    /// <summary>
    /// web病案首页相关
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    public class MrHomeManagementController : BaseController {         

        /// <summary>
        /// WEB病案首页管理系统-获取病人首页信息
        /// </summary>
        /// <returns></returns>
        [HttpPost("GetPageRecodeInfo")]
        public IActionResult GetPageRecodeInfo([FromBody] MedPageModPar parIn) {
            MedPageMod varOut = new MedPageMod();
            return Json(varOut);
        }
    }
}
