using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace NewCostHjy.Controllers.WebPage
{
    public class Application_setController : Controller
    {
        /// <summary>
        /// 检验申请单测试页面
        /// </summary>
        /// <returns></returns>
        public IActionResult Application()
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
    }
}
