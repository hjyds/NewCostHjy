using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers {

    /// <summary>
    /// 会诊系统
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    public class ConsultationController : BaseController {
        
        /// <summary>
        /// 会诊系统执行完成或者撤消
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("CompleteOrFallback")]
        public IActionResult CompleteOrFallback([FromBody] dynamic parIn) {
     
            return Json(parIn);
        } 
    }
}
