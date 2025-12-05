using Elastic.Apm.Api;
using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers.WebPage {

    /// <summary>
    /// WEB病案首页管理系统
    /// </summary>
    public class PatientMrHomeController : Controller {

        /// <summary>
        /// 中联合理用药结果展示页面入口
        /// </summary>
        /// <returns></returns>
        public IActionResult ReviewResultZLPASS() {
            return View();
        }

        /// <summary>
        /// WEB首面相关的测试页面入口
        /// </summary>
        /// <param name="PatId"></param>
        /// <param name="EncounterId"></param>
        /// <param name="EncounterType"></param>
        /// <param name="InvokStatus"></param>
        /// <param name="Operator"></param>
        /// <param name="InHospital"></param>
        /// <param name="IsExternal"></param>
        /// <param name="deptid"></param>
        /// <param name="OperatorName"></param>
        /// <param name="WardId"></param>
        /// <param name="FontSize"></param>
        /// <param name="PatName"></param>
        /// <param name="Scene"></param>
        /// <param name="UserPassword"></param>
        /// <param name="EncounterNo"></param>
        /// <param name="BedNo"></param>
        /// <returns></returns>
        public IActionResult Index(string PatId, string EncounterId, string EncounterType, string InvokStatus, string Operator, string InHospital, string IsExternal, string deptid, string OperatorName, string WardId, string FontSize, string PatName, string Scene, string UserPassword, string EncounterNo, string BedNo)
        {
            dynamic objTmp = new { PatId, EncounterId, EncounterType, InvokStatus, Operator, InHospital, IsExternal, deptid, OperatorName, WardId, FontSize, PatName, Scene, UserPassword, EncounterNo, BedNo };

            ViewBag.BaseData = objTmp;

            return View();
        }
    }
}
