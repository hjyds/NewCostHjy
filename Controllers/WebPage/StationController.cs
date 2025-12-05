using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers.WebPage {
    /// <summary>
    /// 传染病人相关
    /// </summary>
    public class StationController : Controller {
        public IActionResult ReportCardExplainEdit(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }
        public IActionResult ReportCardAudit(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }

        public IActionResult ReportCardTransmit(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }

    }
}
