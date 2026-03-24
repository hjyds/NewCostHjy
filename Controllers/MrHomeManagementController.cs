using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;

namespace NewCostHjy.Controllers {
    /// <summary>
    /// web病案首页相关
    /// </summary>
    [Route("[controller]/[action]")]
    [ApiController]
    public class MrHomeManagementController : BaseController {



        /// <summary>
        /// 首页提交-("WEB病案首页管理系统", "提交")
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult MedicalPageCommit([FromBody] MedPageModPar parIn)
        {
            dynamic varOut = new { result = 1, msg = "" };
            return Json(varOut);
        }

        /// <summary>
        /// WEB病案首页管理系统-获取病人首页信息
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult GetPageRecodeInfo([FromBody] MedPageModPar parIn) {
            MedPageMod varOut = new MedPageMod();
            return Json(varOut);
        }

        /// <summary>
        /// 取消提交检查-("WEB病案首页管理系统", "取消提交检查")
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult CancelMedicalPageCommitCheck([FromBody] MedPageModPar parIn) {
            dynamic varOut = new { result = 1, msg = "" };
            return Json(varOut);
        }

        /// <summary>
        /// 首页取消提交-("WEB病案首页管理系统", "首页取消提交")
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult CancelMedicalPageCommit([FromBody] MedPageModPar parIn)
        {
            dynamic varOut = new { result = 1, msg = "" };
            return Json(varOut);
        }

    }
}
