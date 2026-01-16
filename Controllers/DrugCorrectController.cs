using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NewCostHjy.DAL;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace NewCostHjy.Controllers {

    [Route("[controller]")]
    [ApiController]
    public class DrugCorrectController : BaseController {
        /// <summary>
        /// 合理用药，用药审查
        /// </summary>
        /// <param name="context"></param>
        /// <returns></returns>
        [HttpPost("CheckContent")]
        public async Task<string> CheckContent()
        {
            #region 把入参记录下来 测试日志
            string id = Guid.NewGuid().ToString();
            string strInfo = "";
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            #endregion
            string xmlString = "";
            try
            {
                // 1. 启用请求体缓冲（关键步骤）
                Request.EnableBuffering();
                // 2. 异步读取请求体内容
                string bodyContent;
                using (StreamReader reader = new StreamReader(Request.Body, Encoding.UTF8))
                {
                    bodyContent = await reader.ReadToEndAsync();
                    strInfo = bodyContent;
                    zlhisInterfaceDAL.ZLhisLogInsert(1, id, "2", strInfo, 1, "CheckContent", "CheckContent", "CheckContent");
                }
            } catch (Exception ex)
            {
                // 记录错误日志（实际项目需注入ILogger）
                //Console.WriteLine($"错误: {ex.Message}");  
                //return StatusCode(500, "服务器内部错误");
            }


            string strOut = "<details_xml><msgid>fd83ecb0-ae29-431d-b38f-f94bab39fc42</msgid></details_xml>";
            strOut = "<details_xml><msgid>c8f762e2-c4dd-482a-945b-7464224433a2</msgid><order><order_id>2856748</order_id><order_state>0</order_state><drugcode>86902777000057</drugcode><type>过敏信息提示</type><level>慎用</level><describ>病人对【阿莫西林胶囊】有过敏史，过敏症状为，请慎用</describ><remaks /><c_ruleid /></order></details_xml>";
            return strOut;
        }
    }
}
