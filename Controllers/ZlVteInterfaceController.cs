using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Common;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using Newtonsoft.Json.Linq;
using OnePaperModel;
using System.Collections.Generic;
using System.Reflection.Emit;
using testWeb.BLL;

namespace NewCostHjy.Controllers {

    /// <summary>
    /// Vte系统中的一模块接口
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    public class ZlVteInterfaceController : BaseController {
        /// <summary>
        /// 批量获取病人vte标记显示到病人列表中
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetPatientVteState")]
        public IActionResult GetPatientVteState([FromBody] List<VtePatiTag> parIn) {
            List<VtePatiTag> lstOut = new List<VtePatiTag>();

            List<VtePatiTag> lstclr = new List<VtePatiTag>();
            string strData = "DVT中危,#ffc0e6;DVT低危,#000000;DVT高危,#ff0000;VTE中危,#e9078e;VTE低危,#1931e6;VTE极低危,#14fa23;VTE高危,#f1f505;出血低危,#080808;出血高危,#ec0936";
            string[] arrClr = strData.Split(";");
            foreach (string item in arrClr) {
                lstclr.Add(new VtePatiTag { VteStateName = item.Split(',')[0],VteStateColor= item.Split(',')[1] });
            }             
            int i = 0;
            foreach (VtePatiTag item in parIn) {
                i++;
                item.VteStateName = "高";
                item.VteStateColor = "#70e2bc";
                item.VteStateShortName = "高";
                if (-1 == i) {
                    item.BleedStateColor = "#fa0000";
                    item.BleedStateName = "出血";
                    item.BleedStateShortName = "血";
                }
                if (i - 1 < arrClr.Length) {
                    item.VteStateName = lstclr[i - 1].VteStateName;
                    item.VteStateColor = lstclr[i - 1].VteStateColor;
                    item.VteStateShortName = item.VteStateName;
                }

                item.BleedStateColor = "#fa0000";
                item.BleedStateName = "出血";
                item.BleedStateShortName = "血";
            }
            if (0 == 1) {
                string test = @"[{
                        ""PatientId"":""482"",
                        ""VisitId"":""1"",
                        ""VteStateName"":""VTE高危"",
                        ""VteStateShortName"":""高"",
                        ""VteStateId"":""972556d7-8d3c-426d-9977-00a990e8e4ba"",
                        ""VteStateColor"":""#d7f207"",
                        ""BleedStateName"":""出血高危"",
                        ""BleedStateShortName"":""高"",
                        ""BleedStateId"":""374a2e85-947c-440c-bcbd-a94e6a38bdf9"",
                        ""BleedStateColor"":""#f10909"",
                        ""VteUnExeItemQuantity"":9
                    }]";
                lstclr = Newtonsoft.Json.JsonConvert.DeserializeObject<List<VtePatiTag>>(test);
                lstclr[0].PatientId = parIn[0].PatientId;
                lstclr[0].VisitId = parIn[0].VisitId;
                parIn = lstclr;
            }
            return Json(parIn);
        }
        /// <summary>
        /// 是否显示vte页卡
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetPatientVteManageState")]
        public IActionResult GetPatientVteManageState([FromBody] VtePatiTag parIn) {            
            return Json(1);
        }

        /// <summary>
        /// 科室启用情况
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("CheckDepartmentVte")]
        public IActionResult CheckDepartmentVte([FromBody] List<VtePatiTag> parIn) {
            foreach (var item in parIn) {
                item.Status = "1";
            }
            return Json(parIn);
        }

        /// <summary>
        /// 所有部门启用情况
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>

        [HttpPost("GetVteDepartment")]
        public IActionResult GetVteDepartment(string parIn) {
            List<VteDepartment> lst = new List<VteDepartment>();
            return Json(lst);
        }

        /// <summary>
        /// Vte医嘱执行
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>

        [HttpPost("GetVteItemExeUrl")]
        public IActionResult GetVteItemExeUrl([FromBody] VteModPar parIn) {
            //List<VteDepartment> lst = new List<VteDepartment>();            
            string strTmp = "https://www.json.cn";
            return Json(strTmp);
        }

        /// <summary>
        /// VTE系统测试API通用功能评做接口
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [HttpPost("TestVteEval")]
        public IActionResult TestVteEval([FromBody] VteEvalPar input)
        {
            ZlhisInterfaceBLL zlhisInterfaceBLL = new ZlhisInterfaceBLL();
            var outData = zlhisInterfaceBLL.TestVteEval(input);
            return Json(outData);
        }


        /// <summary>
        /// 下载图片（家庭医生签约相关）123
        /// </summary>
        /// <param name="lstIn"></param>
        /// <returns></returns>
        [HttpPost("DLUrlBatMainOut")]
        public IActionResult DLUrlBatMainOut([FromBody]  List<JTYSQYJPG> lstIn)
        {
            ParallelService tempBll = new ParallelService();
            tempBll.DLUrlBatMainOut(lstIn);
            return Json(1);
        }

        /// <summary>
        /// 插入数据（家庭医生签约相关）
        /// </summary>
        /// <param name="lstIn"></param>
        /// <returns></returns>
        [HttpPost("InsertDocContractSign")]
        public IActionResult InsertDocContractSign([FromBody] List<DocContractSign> lstIn)
        {
            ZlhisInterfaceDAL tempDAL = new ZlhisInterfaceDAL();
            foreach (var item in lstIn)
            {
                tempDAL.InsertDocContractSign(item);
            }
            return Json(1);
        }

    }
}
