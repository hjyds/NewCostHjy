using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers.WebPage {
    public class ReportController : Controller {
        public IActionResult Write(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }

        public IActionResult Preview(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }
    }
}
