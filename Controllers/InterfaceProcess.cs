using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;
using System.Collections.Generic;

namespace NewCostHjy.Controllers {
    /// <summary>
    /// web静配相关接口
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class InterfaceProcess : BaseController {
        

        /// <summary>
        /// web静配中获取激活的药房id集合（测试用）
        /// </summary>
        /// <returns></returns>
        [HttpGet("StaticActivateWard")]
        public IActionResult StaticActivateWard()
        {
            return Json(new { Used_Ward_Ids = "32" });
        }

        /// <summary>
        /// web静配中静通用测试服务
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetStaticRule")]
        public IActionResult GetStaticRule([FromBody] PivasNewRuleMod parIn) {
            string strWardId = parIn.WardId;
            string sqlStr = "{\"Static_Center_Id\":305,\"Static_Match_Sign\":1,\n" +
            "\"Effictive_Time\":1,\"Execute_Nature\":null,\"Change_Drug_ids\":null,\n" +
            "\"Drug_Method_List\":[{\"Drug_Method_Name\":\"使用输液泵（肿瘤）\",\"Recive_Sign\":0,\"Notconditionaffect\":\"1,2,3\"},\n" +
            "{\"Drug_Method_Name\":\"静脉输液\",\"Recive_Sign\":0,\"Notconditionaffect\":null},\n" +
            "{\"Drug_Method_Name\":\"续静脉输液\",\"Recive_Sign\":0,\"Notconditionaffect\":null},\n" +
            "{\"Drug_Method_Name\":\"静脉输液(肿瘤)\",\"Recive_Sign\":0,\"Notconditionaffect\":\"1,2,3\"},\n" +
            "{\"Drug_Method_Name\":\"续静脉输液(肿瘤)\",\"Recive_Sign\":0,\"Notconditionaffect\":\"1,2,3\"},\n" +
            "{\"Drug_Method_Name\":\"静脉高营养治疗\",\"Recive_Sign\":0,\"Notconditionaffect\":null}],\n" +
            "\"Drug_Type_List\":[],\"Recive_Current_Day_Sign\":1,\n" +
            "\"Hours_Difference\":0,\n" +
            "\"First_Day_Begin_Time\":\"00:00\",\n" +
            "\"First_Day_End_Time\":\"19:00\",\n" +
            "\"Second_Day_Begin_Time\":\"00:00\",\n" +
            "\"Second_Day_End_Time\":\"16:30\",\n" +
            "\"Third_Day_Begin_Time\":\"00:00\",\n" +
            "\"Third_Day_End_Time\":\"16:30\",\n" +
            "\"Other_Day_Begin_Time\":\"00:00:00\",\n" +
            "\"Other_Day_End_Time\":\"23:59:59\",\n" +
            "\"Replace_Pharmacy_List\":[{\"Repalce_Pharamacy_Id\":\"310\",\"Default_Pharmay\":1,\"Available_Pharamy\":1}]}";

            //parIn = Newtonsoft.Json.JsonConvert.DeserializeObject<PivasNewRuleMod>(sqlStr);
            //parIn.WardId = strWardId;

            ////hjy测试库 
            parIn.Static_Center_Id = 204;
            parIn.Static_Match_Sign = 1;
            parIn.Effictive_Time = 2;
            parIn.Execute_Nature = "1,2,3";
            parIn.Other_Day_Begin_Time = "00:00:00";
            parIn.Other_Day_End_Time = "23:59:59";
            parIn.Drug_Method_List = new List<Drug_Method_ListItem>();
            parIn.Replace_Pharmacy_List = new List<Replace_Pharmacy_ListItem>();
            parIn.Drug_Type_List = new List<Drug_Type_ListItem>();
            parIn.Single_Vial_Not_Static = 0;
            return Json(parIn);
        }
    }
}
