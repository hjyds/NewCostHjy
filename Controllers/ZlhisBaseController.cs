using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using NewCostHjy.Models;

namespace NewCostHjy.Controllers
{
    /// <summary>
    /// 费用基础服务接口
    /// </summary>

    [Route("api/[controller]/[action]")]
    [Route("[controller]")]
    [ApiController]
    public class ZlhisBaseController : BaseController
    {

        [HttpPost]
        public IActionResult GetUserInfo([FromBody] BaseCostAudKeyIn parIn)
        {
            if (0 == 1)
            {
                string url = "http://192.168.19.71:8141/api/ZlhisBase/GetUserInfo";
                string dataJson = @"{""UserName"":""zlhis"",""PassWord"":""ZLSV2:EEDFEB7DE7A8D43F4C25BC316A22F8B6""}";//Newtonsoft.Json.JsonConvert.SerializeObject();
                string result = NewCostHjy.Common.HttpRequest.RequestDataSync(url, dataJson, AuthType.None);
                JObject jObResult = JsonConvert.DeserializeObject<JObject>(result);
                string AudKey = (string)jObResult["Data"]["AudKey"];
                dynamic outData = new { AudKey };
            }
            BaseCostAudKey audKey = new BaseCostAudKey();
            audKey.AudKey = "hjyAudKey";
            return Json(audKey);
        }
    }
}
