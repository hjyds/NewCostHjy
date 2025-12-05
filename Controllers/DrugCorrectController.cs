using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;
using OnePaperModel;
using System.Collections.Generic;
using System.Linq.Expressions;

namespace NewCostHjy.Controllers {

    [Route("[controller]")]
    [ApiController]
    public class DrugCorrectController : BaseController {
        /// <summary>
        /// 合理用药，用药审查
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        [HttpPost("CheckContent")]
        public IActionResult CheckContent(string parin)
        {
            string strOut = "<details_xml><msgid>fd83ecb0-ae29-431d-b38f-f94bab39fc42</msgid></details_xml>";
            return Json(strOut);
        }
    }
}
