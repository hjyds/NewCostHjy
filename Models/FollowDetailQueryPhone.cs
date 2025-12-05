namespace NewCostHjy.Models {

    ////电话随访查询列表后，点详情调用的服务后的返回模型 
    /////https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=10&followType=1     
    public class FollowDetailQueryPhone {
        /// <summary>
        /// 食欲，2.患者近期食欲情况--好,差
        /// </summary>
        public string hasAppetite { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string mobility { get; set; }
        /// <summary>
        /// 重庆市永川区来苏镇尘肺病康复站
        /// </summary>
        public string siteName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string userCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string storageList { get; set; }
        /// <summary>
        /// ["龙注伊"]
        /// </summary>
        public string doctorName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string smokingString { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int hasMobility { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int id { get; set; }
        /// <summary>
        /// 睡眠，3.患者近期睡眠情况----好,差
        /// </summary>
        public int hasSleeping { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int hasSelfEvaluation { get; set; }
        /// <summary>
        /// 大双庆村双河坝村民小组
        /// </summary>
        public string address { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int hasOccupation { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int followType { get; set; }
        /// <summary>
        /// 诊断信息，诊断结论：矽肺 一期
        /// </summary>
        public string diagnoseResult { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string mobile { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int hasRehabilitation { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int hasHospitalized { get; set; }
        /// <summary>
        /// 数据更新时间
        /// </summary>
        public string updateTime { get; set; }
        /// <summary>
        /// 11. 对于患者营养及药物使用方面的建议:选择健脾开胃、清肺补肺、有营养易吸收的饮食物。
        /// </summary>
        public string suggest { get; set; }
        /// <summary>
        /// 避免粉尘暴露，预防感冒，冬春季节及时接种流感疫苗。
        /// </summary>
        public string homeRehabilitationString { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int userId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int hasSmoking { get; set; }
        /// <summary>
        /// 无
        /// </summary>
        public string demand { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int hasHomeRehabilitation { get; set; }
        /// <summary>
        /// 姓名，向德友,,,编号：5002010071，身份证号：510229196512276651
        /// </summary>
        public string realname { get; set; }
        /// <summary>
        /// 体重项，1.患者体重有无变化---无,下降,增长
        /// </summary>
        public int hasWeight { get; set; }
        /// <summary>
        /// 随访时间 文本格式：2025年02月24日
        /// </summary>
        public string followTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string rehabilitationNum { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string hospitalizedString { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int hasSatisfaction { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string createTime { get; set; }
        /// <summary>
        /// 心理 12.对于患者心理康复方面的建议指导:
        /// </summary>
        public int hasPsychology { get; set; }
        /// <summary>
        /// 心理项目描述文本，建立良好的生活习惯，保持规律的作息时间,健康的饮食习惯和适当的运动。
        /// </summary>
        public string psychologyString { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int tenantId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string idCardNum { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string rehabilitationString { get; set; }
        /// <summary>
        /// 疫苗，6.近期有无吸氧及疫苗注射?:
        /// </summary>
        public int hasVaccinate { get; set; }
        /// <summary>
        /// 疫苗--描述文本
        /// </summary>
        public string vaccinateString { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string occupationString { get; set; }
    }
}
