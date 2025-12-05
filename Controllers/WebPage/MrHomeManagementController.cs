using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;

namespace NewCostHjy.Controllers.WebPage {

    /// <summary>
    /// WEB病案首页管理系统
    /// </summary>
     
    
    public class MrHomeManagementController : Controller {

        [HttpGet]
        public IActionResult Index() {
            return View();
        }

        [HttpGet]
        public IActionResult PageModifyApplication() { 
            return View(); 
        }


        
    }
}
