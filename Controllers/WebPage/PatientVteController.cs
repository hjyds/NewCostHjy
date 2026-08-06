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
            string deptName = "",
            string audkey = "")
        {

            dynamic objTmp = new {
                patientId,
                visitid,
                username,
                userId,
                deptId,
                deptName,
                audkey
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

        /// <summary>
        /// 医保管控弹窗测试页面
        /// </summary>
        /// <returns></returns>
        public IActionResult Prompt()
        {
            return View();
        }

        /// <summary>
        /// MEDASSO 参数展示页面
        /// </summary>
        /// <returns></returns>
        public IActionResult medasso()
        {
            Dictionary<string, string> parDic = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            foreach (var item in Request.Query)
            {
                parDic[item.Key] = item.Value.ToString();
            }

            if (Request.HasFormContentType)
            {
                foreach (var item in Request.Form)
                {
                    parDic[item.Key] = item.Value.ToString();
                }
            }

            ViewBag.BaseData = parDic;
            return View();
        }

        /// <summary>
        /// MICPK 参数展示页面（通用页面有点模拟HRS页面的样子）
        /// </summary>
        /// <returns></returns>
        public IActionResult micpk()
        {
            Dictionary<string, string> parDic = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            foreach (var item in Request.Query)
            {
                parDic[item.Key] = item.Value.ToString();
            }

            if (Request.HasFormContentType)
            {
                foreach (var item in Request.Form)
                {
                    parDic[item.Key] = item.Value.ToString();
                }
            }
            string pageid = parDic.ContainsKey("pageid") ? parDic["pageid"] : "";

            if (pageid == "a19ed4d2-7fef-4744-88bd-4e0cbb08ce50")
            {
                //查看本人医保审核申请弹出页面
                parDic["page_note"] = "查看本人医保审核申请弹出页面";
            } else if (pageid == "efb744e4-9032-43b6-8990-f95d8b9f6e58")
            {
                //订阅医保审核结果通知消息弹出页面
                parDic["page_note"] = "订阅医保审核结果通知消息弹出页面";
            }

            ViewBag.BaseData = parDic;
            return View();
        }
    }
}
