using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewCostHjy.DAL;
using NewCostHjy.Models;

namespace NewCostHjy.Controllers
{
    [Route("[controller]/[action]")]
    [ApiController]
    public class MedOperatoinController : BaseController
    {
        /// <summary>
        /// 是否启用新病案流程-("WEB病案首页管理系统", "是否启用新的病案流程")
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public IActionResult GetMedNewMode()
        {
            //OracleExeDAL.InsertMedicalRecordSubmit(1,1);
            //"WEB病案首页管理系统", "是否启用新的病案流程"
            //{"result":"1-启用新的病案流程；0-不启用新的病案流程","msg":""}
            dynamic varOut = new { result = 1, msg = "" };
            return Json(varOut);
        }

        /// <summary>
        /// 病案操作数据处理-("WEB病案首页管理系统", "病案操作数据处理")
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        public IActionResult MedPageOperation([FromBody] MedPageModPar parIn)
        {
            //   parIn.OperateType;// "OperateType": "操作类型:1-病案提交；2-病案取消提交；3-申请病案返修",
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            if (parIn.OperateType == "1")
            {
                zlhisInterfaceDAL.ZLHISPageSubmit(int.Parse(parIn.PatientId), int.Parse(parIn.EnconterId));
            } else if (parIn.OperateType == "2")
            {
                zlhisInterfaceDAL.ZLHISPageSubmitCancel(int.Parse(parIn.PatientId), int.Parse(parIn.EnconterId));
            }
            dynamic varOut = new { result = 1, msg = "" };
            return Json(varOut);
        }

        /// <summary>
        /// 首页是否可编辑 可能用不上
        /// </summary>
        /// <returns></returns>  
        [HttpPost]
        public IActionResult PageIsEdit([FromBody] MedPageModPar parIn)
        {
            dynamic varOut = new { result = 1, msg = "" };
            return Json(varOut);
        }
    }
}
