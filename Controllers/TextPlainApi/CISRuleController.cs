using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Common;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using System;
using System.IO;
using System.Threading.Tasks;

namespace NewCostHjy.Controllers.TextPlainApi
{
    /// <summary>
    /// 模拟以前老的BH格式那个API服务接口
    /// </summary>
    [Route("bh/api/[controller]")]
    [ApiController]
    public class CISRuleController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Post()
        {
            using (var reader = new StreamReader(Request.Body))
            {
                string requestBody = await reader.ReadToEndAsync();

                #region 把入参记录下来 测试日志
                ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
                string id = Guid.NewGuid().ToString();
                string strInfo = requestBody;
                zlhisInterfaceDAL.ZLhisLogInsert(1, id, "", strInfo, 1, "CISRuleController", "CISRuleController", "CISRuleController");
                #endregion

                if (requestBody.Contains("cdss_in"))
                {
                    //知识库
                    string strJsonTmp = requestBody;
                    dynamic temp = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(strJsonTmp);
                    strJsonTmp = temp["接口json_in"];

                    FunTestCom conFunc = new FunTestCom();

                    string outStr = conFunc.TestJsonCISRule(5);
                    //outStr= conFunc.ConvertUnicodeToChinese(outStr);
                    return Content(outStr);
                }

                ParClass hjyData = new ParClass
                {
                    Name = "HJY_CISRuleController",
                    Age = 30,
                    Birth = 1993
                };
                requestBody = Newtonsoft.Json.JsonConvert.SerializeObject(hjyData);
                return Content(requestBody);
                //return Content(requestBody, "text/plain");
            }
        }



    }
}
