using System;
using System.Collections.Generic;

namespace NewCostHjy.Models {
    /// <summary>
    /// 尘肺康复平台相关模型
    /// </summary> 
    public class GetFollowOneEx {
        public GetFollowOne data { get; set;}
    }
    public class GetFollowOne {
        public List<FollowSelect> list { get; set; }
    }

    /// <summary>
    /// 更新时的模型
    /// </summary>
    public class FollowUpd {
        /// <summary>
        /// 
        /// </summary> 
        public int? id { get; set; }
        /// <summary>
        /// 
        /// </summary>
         
        public int? userId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string rehabilitationNum { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string mobility { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasHospitalized { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? followType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasMobility { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string hospitalizedString { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasVaccinate { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string vaccinateString { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasSmoking { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string smokingString { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasOccupation { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasPsychology { get; set; }
        /// <summary>
        /// 保持心情舒畅
        /// </summary>
        public string psychologyString { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasHomeRehabilitation { get; set; }
        /// <summary>
        /// 慢走
        /// </summary>
        public string homeRehabilitationString { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string occupationString { get; set; }
        /// <summary>
        /// 无
        /// </summary>
        public string demand { get; set; }
        /// <summary>
        /// 抗纤维化药物
        /// </summary>
        public string suggest { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasWeight { get; set; }
        /// <summary>
        /// 关门山村金竹湾村民小组17号
        /// </summary>
        public string address { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasAppetite { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasSleeping { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasRehabilitation { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasSelfEvaluation { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? hasSatisfaction { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string rehabilitationString { get; set; }
          
        //public string[] storageList { get; set; }

        public string doctorName { get; set; }

        ////////////////////////////////////////////////     

    }

    public class FollowSelect: FollowUpd { 

        public DateTime? createTime { get; set; }
        public DateTime? updateTime { get; set; }

        public string diagnoseResult { get; set; }

        public string followTime { get; set; }

        public string idCardNum { get; set; }

        public string mobile { get; set; }

        public string realname { get; set; }

        public string siteName { get; set; }

        public string tenantId { get; set; }

        public string userCode { get; set; }
    }

    public class FollowPati {
        /// <summary>
        /// 
        /// </summary>
        public int id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string userCode { get; set; }
        /// <summary>
        /// 黄顺清
        /// </summary>
        public string realname { get; set; }
        /// <summary>
        /// 男
        /// </summary>
        public string gender { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int age { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string mobile { get; set; }
        /// <summary>
        /// 何先佳
        /// </summary>
        public string doctorName { get; set; }
        /// <summary>
        /// 来苏镇五根松村
        /// </summary>
        public string address { get; set; }
    }

    /// <summary>
    /// 病人对象
    /// </summary>
    public class PatiOject {
        /// <summary>
        /// 
        /// </summary>
        public int? accomplishStatus { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string complication { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? followCount { get; set; }
        /// <summary>
        /// 男
        /// </summary>
        public string gender { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? addTime { get; set; }
        /// <summary>
        /// 重庆市永川区来苏镇尘肺病康复站
        /// </summary>
        public string siteName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string userCode { get; set; }
        /// <summary>
        /// 煤工尘肺一期
        /// </summary>
        public string diagnosisResult { get; set; }
        /// <summary>
        /// 何先佳
        /// </summary>
        public string doctorName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? xStages { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string evaluateCount { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string otherDisease { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? rehabilitationLastTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string relationeShip { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string mobile { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? updateTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string avatar { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? userId { get; set; }
        /// <summary>
        /// 孔凡超
        /// </summary>
        public string realname { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string relativePhone { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string rehabilitationNum { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string idCardNum { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? tenantId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? siteId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string diseaseOriginal { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? age { get; set; }
    }



}
