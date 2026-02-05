using Microsoft.AspNetCore.Mvc;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace NewCostHjy.Controllers
{
    [Route("api/[controller]/[action]")]
    [Route("[controller]")]
    [ApiController]
    public class InsuranceRegulationController : BaseController
    {
        /// <summary>
        /// 医保管控接口，按理说这里边应该直接调用数据平台的接口进行处理，暂时用模拟数据返回
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost]
        public IActionResult BillInsuranceRegulate([FromBody] MircBaseFeeChkInPar parIn)
        {
            #region 把入参记录下来 测试日志
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            string strTestval = "";
            //strTestval = zlhisInterfaceDAL.GetPatiVisitRecordsDALAsync("<IN><BRID>336</BRID></IN>");
            string id = Guid.NewGuid().ToString();
            string strInfo = Newtonsoft.Json.JsonConvert.SerializeObject(parIn);
            zlhisInterfaceDAL.ZLhisLogInsert(1, id, "", strInfo, 1, "BillInsuranceRegulate", "BillInsuranceRegulate", "BillInsuranceRegulate");
            #endregion

            string strOne = @"{""MedicalInsuranceCode"":""86905014000711"",""PId"":""121076"",""PvId"":""1"",""PatientSource"":""2"",""FeeId"":""951"",""FeeName"":""1小儿止咳糖浆"",""AdviceId"":null,""DiacrisistItemId"":""654"",""RuleId"":""e9bbe109-55b0-4890-9ea9-a82fbd501e27"",""MircRecId"":""0e4bc070-32db-48e8-88d0-6f38e8c0c700"",""FeeOccurTime"":"""",""RuleType"":1,""RuleReason"":""限儿童2 报销3"",""PromptContent"":null,""RuleResult"":2,""PromptOptions"":[""限儿童""]}";
            MircOutDataOp dataOut = new MircOutDataOp();
            dataOut.FeeListResults = new List<MircOutData>();
            MircOutData item = null;
            int count = 0;
            //禁止使用
            if (0 == 1)
            {
                for (int i = 0; i < 3; i++)
                {
                    count++;
                    item = Newtonsoft.Json.JsonConvert.DeserializeObject<MircOutData>(strOne);
                    id = Guid.NewGuid().ToString();
                    item.MircRecId = id;
                    item.UniqueId = id;
                    item.FeeName = "F_" + count + item.FeeName;
                    item.RuleReason = "R_" + count + item.RuleReason;
                    item.RuleType = 1;
                    item.UseResult = 1;////使用限制 - UseResult为1的项目   //使用提示 - UseResult为0且RuleType为1的项目 //报销提示 - UseResult为0且RuleType为3或4的项目
                    item.PromptOptions = new List<string>();
                    item.PromptOptions.Add("P_1复选");
                    item.PromptOptions.Add("P_2复选");
                    item.PromptOptions.Add("P_3复选");
                    dataOut.FeeListResults.Add(item);
                }
            }
            //提示使用
            for (int i = 0; i < 3; i++)
            {
                count++;
                item = Newtonsoft.Json.JsonConvert.DeserializeObject<MircOutData>(strOne);
                id = Guid.NewGuid().ToString();
                item.MircRecId = id;
                item.UniqueId = id;
                item.FeeName = "F_" + count + item.FeeName;
                item.RuleReason = "R_" + count + item.RuleReason;
                item.RuleType = 1;
                item.UseResult = 0;////使用限制 - UseResult为1的项目   //使用提示 - UseResult为0且RuleType为1的项目 //报销提示 - UseResult为0且RuleType为3或4的项目
                item.PromptOptions = new List<string>();
                item.PromptOptions.Add("P_1复选");
                item.PromptOptions.Add("P_2复选");
                item.PromptOptions.Add("P_3复选");
                dataOut.FeeListResults.Add(item);
            }

            for (int i = 0; i < 3; i++)
            {
                count++;
                item = Newtonsoft.Json.JsonConvert.DeserializeObject<MircOutData>(strOne);
                id = Guid.NewGuid().ToString();
                item.MircRecId = id;
                item.UniqueId = id;
                item.FeeName = "F_" + count + item.FeeName;
                item.RuleReason = "R_" + count + item.RuleReason;
                item.RuleType = 3;
                item.UseResult = 0;////使用限制 - UseResult为1的项目   //使用提示 - UseResult为0且RuleType为1的项目 //报销提示 - UseResult为0且RuleType为3或4的项目
                item.PromptOptions = new List<string>();
                item.PromptOptions.Add("P_1复选");
                item.PromptOptions.Add("P_2复选");
                item.PromptOptions.Add("P_3复选");
                dataOut.FeeListResults.Add(item);
            }

            for (int i = 0; i < 3; i++)
            {
                count++;
                item = Newtonsoft.Json.JsonConvert.DeserializeObject<MircOutData>(strOne);
                id = Guid.NewGuid().ToString();
                item.MircRecId = id;
                item.UniqueId = id;
                item.FeeName = "F_" + count + item.FeeName;
                item.RuleReason = "R_" + count + item.RuleReason;
                item.RuleType = 4;
                item.UseResult = 0;////使用限制 - UseResult为1的项目   //使用提示 - UseResult为0且RuleType为1的项目 //报销提示 - UseResult为0且RuleType为3或4的项目
                item.PromptOptions = new List<string>();
                item.PromptOptions.Add("P_1复选");
                item.PromptOptions.Add("P_2复选");
                item.PromptOptions.Add("P_3复选");
                dataOut.FeeListResults.Add(item);
            }
            dataOut.CheckinResultInfo = "胡俊勇测试数据";
            dynamic temp = new { Code = 200, Success = true, Msg = "", Data = dataOut };
            strInfo = JsonConvert.SerializeObject(temp);

            zlhisInterfaceDAL.ZLhisLogInsert(1, id, "", strInfo, 1, "BillInsuranceRegulate_Out", "BillInsuranceRegulate_Out", "BillInsuranceRegulate_Out");

            foreach (MircOutData itemOne in dataOut.FeeListResults)
            {
                itemOne.PatBed = parIn.PatientList[0].PatBed;
                itemOne.ChargesName = "胡俊勇测试项目名称";
                itemOne.InsureCategoryCode = parIn.PatientList[0].InsureCategoryCode;
            }

            return Json(dataOut.FeeListResults);
        }
    }
}
