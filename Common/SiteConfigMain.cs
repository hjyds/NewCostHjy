using ZLSoft.UDS.Agent;

namespace NewCostHjy.Common {
    public class UnifiedDataSource {
        public string udsApi { get; set; }
        public string udsAppId { get; set; }
        public string udsAppSecret { get; set; }

        public string udsCodeZLHIS { get; set; }
        public string udsCodeZLLIS { get; set; }
    }

    public static class SiteConfigMain {
        public static DsAgentFactory UdsFactory { get; set; }
        public static UnifiedDataSource UdsString { get; set; } 
        /// <summary>
        /// 测试连接串为了方便测试
        /// </summary>
        public static string TestConnStr { get; set; }

        public static int HttpTimeOut { get; set; }=60*1000;    

    }
}
