using System;
using System.Text;
using System.Web;
using System.Reflection;
using NewCostHjy.Models;

namespace NewCostHjy.Common {
    public static class UrlBuilder {

        /// <summary>
        /// 解析URL中的查询字符串参数，并填充到EduUrlWteOneMod对象中。
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        public static EduUrlWteOneMod HjyParseQueryString(string url)
        {
            //string url = "http://192.168.56.1:5888/DocumentWrite/HealthEduEdit?PId=160471&EncId=1957020&EncType=1&...（省略其余参数）...HealthType=0";
            Uri uri = new Uri(url);
            var queryString = HttpUtility.ParseQueryString(uri.Query);
            EduUrlWteOneMod model = new EduUrlWteOneMod();

            int PId = int.Parse(queryString["PId"]);
            int EncId = int.Parse(queryString["EncId"]);
            int EncType = int.Parse(queryString["EncType"]);
            int DeptId = int.Parse(queryString["DeptId"]);
            string TempId = queryString["TempId"];
            string Operator = HttpUtility.UrlDecode(queryString["Operator"]); // 陈兴隆
            int OperId = int.Parse(queryString["OperId"]);
            string OperPosition = HttpUtility.UrlDecode(queryString["OperPosition"]); // 主任药师
            string age = HttpUtility.UrlDecode(queryString["age"]); // 17岁
            string computerIp = queryString["computerIp"];
            int sourceType = int.Parse(queryString["sourceType"]);
            string userName = queryString["userName"];
            string password = queryString["password"]; // 注意：实际URL中可能不包含密码或已加密
            int babyNum = int.Parse(queryString["babyNum"]);
            int ModifyType = int.Parse(queryString["ModifyType"]);
            string DeptName = HttpUtility.UrlDecode(queryString["DeptName"]); // 产科门诊
            int docType = int.Parse(queryString["docType"]);
            string localUrl = HttpUtility.UrlDecode(queryString["localUrl"]); // http://192.168.32.135:8120
            int HealthType = 1;// int.Parse(queryString["HealthType"]);
            model.PId = PId;
            model.EncId = EncId;
            model.EncType = EncType;
            model.DeptId = DeptId;
            model.TempId = TempId;
            model.Operator = Operator;
            model.OperId = OperId;  
            model.OperPosition = OperPosition;
            model.age = age;
            model.computerIp = computerIp;
            model.sourceType = sourceType;
            model.userName = userName;
            model.password = password;
            model.babyNum = babyNum;
            model.ModifyType = ModifyType;
            model.DeptName = DeptName;
            model.docType = docType;
            model.localUrl = localUrl;
            model.HealthType = HealthType;
            model.localUrl = localUrl; 
            return model;
        }

        public static string BuildUrl<T>(string baseUrl, T entity) where T : class
        {
            if (string.IsNullOrWhiteSpace(baseUrl))
                throw new ArgumentNullException(nameof(baseUrl));

            var queryString = new StringBuilder();
            var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

            foreach (var prop in properties)
            {
                var value = prop.GetValue(entity);
                if (value == null) continue;

                string propName = prop.Name;
                if (propName.StartsWith("@"))
                    propName = propName.Substring(1);

                // 注意：此处直接使用propName，不再进行UrlEncode处理。
                //queryString.Append(queryString.Length == 0 ? "?" : "&")
                //          .Append(HttpUtility.UrlEncode(propName))
                //          .Append("=")
                //          .Append(HttpUtility.UrlEncode(value.ToString()));

                queryString.Append(queryString.Length == 0 ? "?" : "&")
                          .Append(propName)
                          .Append("=")
                          .Append(value.ToString());
            }

            return baseUrl.TrimEnd('?', '&', '/') + queryString.ToString();
        }
    }
}
