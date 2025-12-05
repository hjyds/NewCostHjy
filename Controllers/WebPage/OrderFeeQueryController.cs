using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers.WebPage {
    public class OrderFeeQueryController : Controller {
        public IActionResult Index(string data)
        {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }
    }
}
