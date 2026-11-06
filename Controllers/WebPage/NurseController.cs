using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace NewCostHjy.Controllers.WebPage
{
    /// <summary>
    /// 护理（输血）测试页
    /// 访问地址形如：/Nurse/Blood/IndexBlood/user=zlhis/model=5
    /// </summary>
    public class NurseController : Controller
    {
        /// <summary>
        /// 输血测试页（内容随意，仅用于连通/嵌入测试）
        /// </summary>
        /// <param name="rest">路径中以 user=zlhis/model=5 形式追加的参数段</param>
        [HttpGet]
        [Route("Nurse/Blood/IndexBlood")]
        [Route("Nurse/Blood/IndexBlood/{**rest}")]
        public IActionResult IndexBlood(string rest)
        {
            Dictionary<string, string> parDic = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

            // 解析路径中的 key=value 段，例如 user=zlhis/model=5
            if (!string.IsNullOrEmpty(rest))
            {
                foreach (var seg in rest.Split('/', StringSplitOptions.RemoveEmptyEntries))
                {
                    int idx = seg.IndexOf('=');
                    if (idx > 0)
                    {
                        parDic[seg.Substring(0, idx)] = seg.Substring(idx + 1);
                    }
                    else
                    {
                        parDic[seg] = "";
                    }
                }
            }

            // 兼容查询串/表单参数
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

            ViewBag.PathParams = parDic;
            ViewBag.RawPath = Request.Path.Value;
            return View();
        }
    }
}
