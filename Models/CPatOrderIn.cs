namespace NewCostHjy.Models
{
    public class CPatOrderIn
    {
        /// <summary>
        /// 病人id
        /// </summary>
        public int pid { get; set; }
        /// <summary>
        /// 主页id
        /// </summary>
        public int pvid { get; set; }

        /// <summary>
        /// 挂号ID
        /// </summary>
        public long regid { get; set; }

        /// <summary>
        /// 挂号单号
        /// </summary>
        public string regno { get; set; }

        /// <summary>
        /// 操作员id
        /// </summary>
        public int operatorid { get; set; }

        /// <summary>
        /// 操作员姓名   
        /// </summary>
        public string operatorname { get; set; }
    }
}
