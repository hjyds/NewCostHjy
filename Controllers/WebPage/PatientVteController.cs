using Elastic.Apm.Api;
using Microsoft.AspNetCore.Mvc;
using NewCostHjy.DAL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NewCostHjy.Controllers.WebPage {
    public class PatientVteController : Controller {
        /// <summary>
        /// Vte系统嵌入网页
        /// </summary>
        /// <param name="patientId"></param>
        /// <param name="visitid"></param>
        /// <param name="username"></param>
        /// <param name="userId"></param>
        /// <param name="deptId"></param>
        /// <param name="deptName"></param>
        /// <returns></returns>
        public IActionResult Index(
            string patientId = "",
            string visitid = "",
            string username = "",
            string userId = "",
            string deptId = "",
            string deptName = "")
        {

            dynamic objTmp = new {
                patientId,
                visitid,
                username,
                userId,
                deptId,
                deptName
            };

            ViewBag.BaseData = objTmp;
            return View();

        }

        /// <summary>
        /// 模拟WEB医技站界面
        /// </summary>
        /// <returns></returns>
        public IActionResult Tech()
        {
            return View();
        }

        /// <summary>
        /// PDF工具输入测试页面
        /// </summary>
        /// <returns></returns>
        public IActionResult PDFOUT()
        {
            return View();
        }

        /// <summary>
        /// 集采药品替换页面
        /// </summary>
        /// <returns></returns>
        public IActionResult CPDMREP(string id)
        {
            //参数：ip=id,就可以取出来当前入参信息
            //select a.log_info,a.log_info_ex from zlloginfo a where a.ip='74bf61a4-c7fa-4ff4-9531-936c7f393565'
            //ViewBag.BaseData = objTmp;
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            string data = zlhisInterfaceDAL.GetCPDMLogData(id);
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }
    }
}
