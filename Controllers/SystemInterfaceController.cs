using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;

namespace NewCostHjy.Controllers
{

    [ApiController]
    public class SystemInterfaceController : ControllerBase
    {
        /// <summary>
        /// (新版医保管控管理系统-执行医保管控规则检查) 新接口：和旧接口 ExecuteGeneralCheckNew 功能完全一致
        /// </summary>
        [HttpPost("api/SystemInterface/ExecuteGeneralCheck")]
        public IActionResult ExecuteGeneralCheck([FromBody] MircInPatientInfo parIn)
        {
            // 直接调用旧接口的方法，逻辑完全复用，不用写重复代码
            return new ZlhisInterfaceController().ExecuteGeneralCheckNew(parIn);
        }
    }

}
