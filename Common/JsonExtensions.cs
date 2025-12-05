using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace NewCostHjy.Common {
    public static class JsonExtensions {
        /// <summary>
        /// 将对象转换为JSON字符串
        /// </summary> 
        /// <param name="obj">要转换的对象</param>
        /// <param name="camelCase">是否小写名称</param>
        /// <param name="indented"></param>
        /// <returns></returns>
        public static string ToJsonString(this object obj, bool camelCase = false, bool indented = false) {
            JsonSerializerSettings settings = new JsonSerializerSettings() {
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore,
                DateFormatString = "yyyy-MM-dd HH:mm:ss"
            };
            if (camelCase) {
                settings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            }
            if (indented) {
                settings.Formatting = Formatting.Indented;
            }
            return JsonConvert.SerializeObject(obj, settings);
        }

        /// <summary>
        /// Object取Decimal  失败返回
        /// </summary>
        /// <returns></returns>
        public static decimal ToDecimal(this object obj, decimal DlbDefault = 0) {
            try {
                if (obj is null) return DlbDefault;
                decimal parseDlb;
                if (decimal.TryParse(obj.ToString(), out parseDlb))
                    return parseDlb;
                return DlbDefault;
            } catch {
                return DlbDefault; //忽略错误
            }
        }

        /// <summary>
        /// 转换为Text()
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="DlbDefault"></param>
        /// <returns></returns>
        public static string ToText(this object obj, string DlbDefault = "") {          
            try {
                if (obj is null) return DlbDefault;
                return obj.ToString();                 
            } catch {
                return DlbDefault; //忽略错误
            }

            

        }
    }
}