using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers {

    /// <summary>
    /// 会诊系统
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    public class LogInController : BaseController {
        
        /// <summary>
        /// 会诊系统获取toke字符串
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetTokenToZlhis")]
        public IActionResult GetTokenToZlhis([FromBody] dynamic parIn) { 
            return Json("hjytesttokestring");
        } 
    }
}
