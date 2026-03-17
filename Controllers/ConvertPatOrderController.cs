using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewCostHjy.BLL;
using NewCostHjy.Models;

namespace NewCostHjy.Controllers
{

    [Route("api/[controller]/[action]")]
    [Route("[controller]")]
    [ApiController]
    public class ConvertPatOrderController : BaseController
    {

        /// <summary>
        /// 门诊医嘱转住院医嘱
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult ConvertPatOrder([FromBody] CPatOrderIn parIn)
        {
            ConvertPatOrderBLL convertPatOrderBLL = new ConvertPatOrderBLL();
            convertPatOrderBLL.ConvertFun(parIn);
            return Json(1);
        }

    }

}
