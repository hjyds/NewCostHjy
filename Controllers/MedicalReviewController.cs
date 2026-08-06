using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;
using System;

namespace NewCostHjy.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalReviewController : ControllerBase
    {
        /// <summary>
        /// 在完成费用出院审核后，标记患者完成审核时，在启用费用管控的时候，调用费用管控的过程发起申请
        /// </summary>
        /// <param name="parIn">申请入参</param>
        /// <returns>申请记录ID</returns>
        [HttpPost("Apply")]
        public IActionResult Apply([FromBody] MedicalReviewApplyRequest parIn)
        {
            var result = new MedicalReviewApplyResponse
            {
                RecordId = Guid.NewGuid().ToString("D").ToUpperInvariant()
            };

            return Ok(result);
        }
    }
}
