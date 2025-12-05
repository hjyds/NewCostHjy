using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace NewCostHjy.Controllers {
    public class BaseController : Controller {
        public override JsonResult Json(object data) {
            JsonSerializerSettings jsonSerializerSettings = new JsonSerializerSettings();
            jsonSerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
            return base.Json(data, jsonSerializerSettings);
        }

        public override JsonResult Json(object data, object serializerSettings) {
            JsonSerializerSettings jsonSerializerSettings = new JsonSerializerSettings();
            jsonSerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
            return base.Json(data, jsonSerializerSettings);
        }
    }
}
