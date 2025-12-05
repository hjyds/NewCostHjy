using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers.WebPage
{
    public class RegisterAppointController : Controller
    {
        /// <summary>
        /// WEB端预约挂号页面
        /// </summary>
        /// <returns></returns>
        public IActionResult RoomAppointRegister()
        {
            return View();
        }
    }
}
