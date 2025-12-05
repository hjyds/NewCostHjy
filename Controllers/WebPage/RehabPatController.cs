using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NewCostHjy.Controllers.WebPage {
    public class RehabPatController : Controller {
        /// <summary>
        /// 康复系统嵌入zlhis的网页
        /// </summary>
        /// <param name="patId"></param>
        /// <param name="visitId"></param>
        /// <param name="patDepartmentId"></param>
        /// <param name="operatorName"></param>
        /// <param name="operatorId"></param>
        /// <param name="departmentId"></param>
        /// <param name="departmentName"></param>
        /// <param name="operatorPosition"></param>
        /// <param name="operateIp"></param>
        /// <param name="isReader"></param>
        /// <param name="devName"></param>
        /// <param name="nodeNo"></param>
        /// <param name="deptId"></param>
        /// <param name="deptView"></param>
        /// <param name="patListType"></param>
        /// <param name="meetOrderId"></param>
        /// <param name="callType"></param>
        /// <returns></returns>
        public IActionResult RehabPatIndex(
            string patId = "",
            string visitId = "",
            string patDepartmentId = "",
            string operatorName = "",
            string operatorId = "",
            string departmentId = "",
            string departmentName = "",
            string operatorPosition = "",
            string operateIp = "",
            string isReader = "",
            string devName = "",
            string nodeNo = "",
            string deptId = "",
            string deptView = "",
            string patListType = "",
            string meetOrderId = "",
            string callType = "") {

            dynamic objTmp = new {
                patId,
                visitId,
                patDepartmentId,
                operatorName,
                operatorId,
                departmentId,
                departmentName,
                operatorPosition,
                operateIp,
                isReader,
                devName,
                nodeNo,
                deptId,
                deptView,
                patListType,
                meetOrderId,
                callType
            };

            ViewBag.BaseData = objTmp;
            return View();
        }
    }
}
