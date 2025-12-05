using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers.WebPage {
    /// <summary>
    /// web费用系统相关
    /// </summary>
    public class ExpenceApproveManagementController : Controller {

        /// <summary>
        /// 费用系统费用审批测试页面
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public IActionResult BeforehandApproval(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }
    }
}
