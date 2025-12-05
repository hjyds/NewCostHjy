using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers.WebPage {
    public class GroupInformationController : Controller {
        public IActionResult GroupInformationDisplay(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }
         
    }
}
