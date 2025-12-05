using Newtonsoft.Json.Linq;
using System.Runtime.CompilerServices;
using System.Xml;

namespace NewCostHjy.Common
{
    /// <summary>
    /// Json对象帮助类
    /// </summary>
    public static class JObjectHelper
    {
        /// <summary>
        /// 获取Json对象中指定key的值
        /// </summary>
        /// <param name="jObject">Json对象</param>
        /// <param name="key"></param>
        /// <returns></returns>
        public static string GetKeyValue(this JObject jObject, string key)
        {
            return jObject.ContainsKey(key) ? jObject[key].ToString() : string.Empty;
        }

        /// <summary>
        /// 将xml字符串转为json对象
        /// </summary>
        /// <param name="xml">xml字符串</param>
        /// <returns>json对象</returns>
        [MethodImpl(MethodImplOptions.Synchronized)]
        public static JObject XmlToJObject(string xml)
        {
            if (string.IsNullOrEmpty(xml)) return null;
            XmlDocument doc = new XmlDocument();
            doc.LoadXml(xml);
            return Newtonsoft.Json.JsonConvert.DeserializeObject(Newtonsoft.Json.JsonConvert.SerializeXmlNode(doc)) as JObject;
        }
    }
}
