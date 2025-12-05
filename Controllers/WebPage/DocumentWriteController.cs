using Microsoft.AspNetCore.JsonPatch.Operations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Security.AccessControl;

namespace NewCostHjy.Controllers.WebPage {
    public class DocumentWriteController : Controller {

        /// <summary>
        /// 电子病历web版嵌入临床工作站的网页
        /// </summary>
        /// <param name="patId"></param>
        /// <param name="patType"></param>
        /// <param name="visitId"></param>
        /// <param name="deptId"></param>
        /// <param name="deptName"></param>
        /// <param name="editorId"></param>
        /// <param name="editor"></param>
        /// <param name="editorPosition"></param>
        /// <param name="gender"></param>
        /// <param name="internId"></param>
        /// <param name="internName"></param>
        /// <param name="internUserName"></param>
        /// <param name="patiState"></param>
        /// <param name="age"></param>
        /// <param name="computerIp"></param>
        /// <param name="url"></param>
        /// <param name="sourceType"></param>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="babyNum"></param>
        /// <returns></returns>
        public IActionResult DocumentWrite(string patId = "", string patType = "", string visitId = "", string deptId = "", string deptName = "", string editorId = "", string editor = "", string editorPosition = "", string gender = "", string internId = "", string internName = "", string internUserName = "", string patiState = "", string age = "", string computerIp = "", string url = "", string sourceType = "", string userName = "", string password = "", string babyNum = "")
        {
            dynamic objTmp = new { patId, patType, visitId, deptId, deptName, editorId, editor, editorPosition, gender, internId, internName, internUserName, patiState, age, computerIp, url, sourceType, userName, password, babyNum };
            ViewBag.BaseData = objTmp;
            return View();
        }

        /// <summary>
        /// 健康宣教管理页面嵌入临床工作站的网页
        /// </summary>
        /// <param name="PatId"></param>
        /// <param name="VisitId"></param>
        /// <param name="VisitType"></param>
        /// <param name="BabyNum"></param>
        /// <param name="Operator"></param>
        /// <param name="OperId"></param>
        /// <param name="OperPosition"></param>
        /// <param name="DeptId"></param>
        /// <param name="DeptName"></param>
        /// <param name="UserName"></param>
        /// <param name="ComputerIp"></param>
        /// <param name="Age"></param>
        /// <returns></returns>
        public IActionResult HealthEducaotionManager(string PatId = "", string VisitId = "", string VisitType = "", string BabyNum = "", string Operator = "", string OperId = "", string OperPosition = "", string DeptId = "", string DeptName = "", string UserName = "", string ComputerIp = "", string Age = "")
        {
            dynamic objTmp = new { PatId, VisitId, VisitType, BabyNum, Operator, OperId, OperPosition, DeptId, DeptName, UserName, ComputerIp, Age };
            ViewBag.BaseData = objTmp;
            return View();
        }

        /// <summary>
        /// 单独编辑某一份健康教育处方写书
        /// </summary>
        /// <param name="PId"></param>
        /// <param name="EncId"></param>
        /// <param name="EncType"></param>
        /// <param name="DeptId"></param>
        /// <param name="TempId"></param>
        /// <param name="Operator"></param>
        /// <param name="OperId"></param>
        /// <param name="OperPosition"></param>
        /// <param name="age"></param>
        /// <param name="computerIp"></param>
        /// <param name="sourceType"></param>
        /// <param name="userName"></param>
        /// <param name="password"></param>
        /// <param name="babyNum"></param>
        /// <param name="ModifyType"></param>
        /// <param name="DeptName"></param>
        /// <param name="docType"></param>
        /// <param name="localUrl"></param>
        /// <param name="HealthType"></param>
        /// <returns></returns>
        public IActionResult HealthEduEdit(int PId, int EncId, int EncType, int DeptId, string TempId,
            string Operator, int OperId, string OperPosition, string age, string computerIp, int sourceType, string userName,
            string password, int babyNum, int ModifyType, string DeptName, int docType, string localUrl, int HealthType)
        {
            dynamic objTmp = new {
                PId,
                EncId,
                EncType,
                DeptId,
                TempId,
                Operator,
                OperId,
                OperPosition,
                age,
                computerIp,
                sourceType,
                userName,
                password,
                babyNum,
                ModifyType,
                DeptName,
                docType,
                localUrl,
                HealthType
            };
            ViewBag.BaseData = objTmp;
            return View();
        }
    }
}
