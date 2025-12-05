using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers.WebPage
{
    /// <summary>
    /// WEB挂号相关
    /// </summary>
    public class OutpatientWorkLimitQuantityAdjustController : Controller
    {
        public IActionResult LimitQuantityAddRegister()
        {
            return View();
        }
    }
}
