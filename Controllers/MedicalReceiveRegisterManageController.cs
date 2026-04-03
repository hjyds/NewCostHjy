using Microsoft.AspNetCore.Mvc;
using System;

namespace NewCostHjy.Controllers
{
    public class MedicalReceiveRegisterManageController : BaseController
    {
        /// <summary>
        /// 病案返修记录页面
        /// </summary>
        /// <param name="PatientId">病人ID</param>
        /// <param name="EnconterId">就诊ID</param>
        /// <returns>病案返修记录页面</returns>
        public IActionResult MedFellBackRecord(long PatientId, long EnconterId)
        {
            ViewBag.PatientId = PatientId;
            ViewBag.EnconterId = EnconterId;
            return View();
        }
    }
}