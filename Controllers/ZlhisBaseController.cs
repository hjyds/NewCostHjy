using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
        public IActionResult GetUserInfo([FromBody] dynamic parIn)
        {
            string url = "http://192.168.33.44:8146/api/ZlhisBase/GetUserInfo";
            string dataJson = @"{""UserName"":""zlhis"",""PassWord"":""ZLSV2:EEDFEB7DE7A8D43F4C25BC316A22F8B6""}";//Newtonsoft.Json.JsonConvert.SerializeObject();
            string result = NewCostHjy.Common.HttpRequest.RequestDataSync(url, dataJson, AuthType.None);
            JObject jObResult = JsonConvert.DeserializeObject<JObject>(result);
            string AudKey = (string)jObResult["Data"]["AudKey"];
            dynamic outData = new { AudKey };
            return Json(jObResult["Data"]);
        }
    }
}
