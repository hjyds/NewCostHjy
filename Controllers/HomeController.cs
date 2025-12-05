using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NewCostHjy.Models;
using System.Diagnostics;

namespace NewCostHjy.Controllers {
    public class HomeController : Controller {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger) {
            _logger = logger;
        }

        public IActionResult Index() {
            return View();
        }

        public IActionResult Privacy() {
            return View();
        }

        /// <summary>
        /// 来苏卫生院相关资上传
        /// </summary>
        /// <returns></returns>
        public IActionResult LsFollow() {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
