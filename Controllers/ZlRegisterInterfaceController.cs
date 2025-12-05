using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;

namespace NewCostHjy.Controllers
{
    /// <summary>
    /// WEB挂号相关
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    public class ZlRegisterInterfaceController : BaseController {
        /// <summary>
        /// WEB挂号同步状态服务
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("SaveRegisterVisitStatus")]
        public IActionResult SaveRegisterVisitStatus([FromBody] VtePatiTag parIn)
        {
            return Json(1);
        }
    }
}
