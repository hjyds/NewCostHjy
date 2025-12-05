using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;
using System.Collections.Generic;

namespace NewCostHjy.Controllers {
    /// <summary>
    /// 传染病相关
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    public class ReportController : BaseController {
        /// <summary>
        /// 传染病相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetPatientReportList")]
        public IActionResult GetPatientReportList([FromBody] dynamic parIn) {

            //[{"report_id":122,"report_status":2,"pati_id":140328,"pati_visit_type":2,"pati_visit_id":1,"pati_name":"赵顺利","pati_sex":"男","pati_age":"36岁","pati_job":"不便分类的其他从业人员","pati_adrss":null,"pati_phone":null,"pati_outno":null,"pati_inno":"607319","pati_no":"607319","doctor":"李超","dept_id":161,"dept_name":"心内一科","creator":"李超","create_time":"2022-05-27 15:48:30","mofidy_operator":"李超","mofidy_time":"2022-05-27 15:48:30","disease_id":2,"disease_name":"霍乱","disease_type":1,"template_name":"中华人民共和国传染病报告卡","disease_category_id":1,"disease_category_name":"传染病","up_memo":null,"sign_id":null}]

            //[]
            string strObj = @"[{""report_id"":122,""report_status"":2,""pati_id"":140328,""pati_visit_type"":2,""pati_visit_id"":1,""pati_name"":""赵顺利"",""pati_sex"":""男"",""pati_age"":""36岁"",""pati_job"":""不便分类的其他从业人员"",""pati_adrss"":null,""pati_phone"":null,""pati_outno"":null,""pati_inno"":""607319"",""pati_no"":""607319"",""doctor"":""李超"",""dept_id"":161,""dept_name"":""心内一科"",""creator"":""李超"",""create_time"":""2022-05-27 15:48:30"",""mofidy_operator"":""李超"",""mofidy_time"":""2022-05-27 15:48:30"",""disease_id"":2,""disease_name"":""霍乱"",""disease_type"":1,""template_name"":""中华人民共和国传染病报告卡"",""disease_category_id"":1,""disease_category_name"":""传染病"",""up_memo"":null,""sign_id"":null}]";
            List<DisPatMod> varlist=new List<DisPatMod>();
            varlist = Newtonsoft.Json.JsonConvert.DeserializeObject<List<DisPatMod>>(strObj);

            return Json(varlist);
        }

        /// <summary>
        /// 传染病相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("DeleteReport")]
        public IActionResult DeleteReport([FromBody] dynamic parIn) {
            // 0时不显示，值为1或2时显示，其中2代表只读
            return Json(1);
        }

    
        /// <summary>
        /// 传染病相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("WriteIdentify")]
        public IActionResult WriteIdentify([FromBody] dynamic parIn) {
            // 0时不显示，值为1或2时显示，其中2代表只读
            string strTmp= parIn.ToString();
            dynamic tmp = new { infect_disease_ids = "", write_mode = "" };
            return Json(tmp);
        }


        /// <summary>
        /// 传染病相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("RelateFeedback")]
        public IActionResult RelateFeedback([FromBody] dynamic parIn) {
            // 0时不显示，值为1或2时显示，其中2代表只读
            return Json(1);
        }

        /// <summary>
        /// 传染病相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("IsCanWrite")]
        public IActionResult IsCanWrite([FromBody] dynamic parIn) {
            //1
            return Json(1);
        }

    }
}
