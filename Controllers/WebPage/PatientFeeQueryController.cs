using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers.WebPage {
    public class PatientFeeQueryController : Controller {
        public IActionResult Index(string data)
        {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }
    }
}
