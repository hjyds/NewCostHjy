using System;
using System.Collections.Generic;

namespace NewCostHjy.Models {
    public class ExecuteCpdmCheckDataItem {
        /// <summary>
        /// 药品名称
        /// </summary>
        public string DrugName { get; set; }
        /// <summary>
        /// 规格
        /// </summary>
        public string Specification { get; set; }
        /// <summary>
        /// 剂型
        /// </summary>
        public string DosageForm { get; set; }
        /// <summary>
        /// 开药总量
        /// </summary>
        public string DrugTotal { get; set; }
        /// <summary>
        /// 单位
        /// </summary>
        public string Unit { get; set; }
        /// <summary>
        /// 本位码
        /// </summary>
        public string BaseCode { get; set; }
        /// <summary>
        /// 药品ID
        /// </summary>
        public string DrugId { get; set; }
        /// <summary>
        /// 紧急标志1-紧急 0-非紧急
        /// </summary>
        public string EmergencySign { get; set; }
        /// <summary>
        /// 开嘱医生
        /// </summary>
        public string Doctor { get; set; }
        /// <summary>
        /// 开嘱医生工号
        /// </summary>
        public string DoctorCode { get; set; }
        /// <summary>
        /// 开嘱医生ID
        /// </summary>
        public string DoctorId { get; set; }
        /// <summary>
        /// 开嘱科室
        /// </summary>
        public string OrderDeptName { get; set; }
        /// <summary>
        /// 开嘱科室ID
        /// </summary>
        public string OrderDeptId { get; set; }
        /// <summary>
        /// 开嘱时间
        /// </summary>
        public string OrderTime { get; set; }
        /// <summary>
        /// 医嘱ID/唯一id
        /// </summary>
        public string AdviceId { get; set; }
    }

    public class ExecuteCpdmCheckData {
        /// <summary>
        /// 管理员
        /// </summary>
        public string OperatorName { get; set; }
        /// <summary>
        /// 登陆帐号
        /// </summary>
        public string OperatorCode { get; set; }
        /// <summary>
        /// 操作时间 
        /// </summary>
        public string OperDateTime { get; set; }
        /// <summary>
        /// 病人科室id
        /// </summary>
        public string PatientDeptId { get; set; }
        /// <summary>
        /// 心内二科
        /// </summary>
        public string PatientDeptName { get; set; }
        /// <summary>
        /// 病人id
        /// </summary>
        public string PId { get; set; }
        /// <summary>
        /// 15岁
        /// </summary>
        public string PatiAge { get; set; }
        /// <summary>
        /// 就诊id
        /// </summary>
        public string PvId { get; set; }
        /// <summary>
        /// 张三
        /// </summary>
        public string PatientName { get; set; }
        /// <summary>
        /// 上呼吸道感染,感冒
        /// </summary>
        public string DiagName { get; set; }
        /// <summary>
        /// 疾病编码串
        /// </summary>
        public string DiagCode { get; set; }
        /// <summary>
        /// 药品列表
        /// </summary>
        public List<ExecuteCpdmCheckDataItem> DrugInfos { get; set; }

        /// <summary>
        /// 删除时的入参结点
        /// </summary>
        public string AdviceID { get; set; }
    }

    public class DeleteCpdmParIn {
        /// <summary>
        /// 系统编号
        /// </summary>
        public string SourceSysCode { get; set; }
        /// <summary>
        /// 一张纸门诊医生站
        /// </summary>
        public string SourceSysName { get; set; } 
        /// <summary>
        /// 数据对象
        /// </summary>
        public List<ExecuteCpdmCheckData> Data { get; set; }
    }

    public class ExecuteCpdmCheckIn {
        /// <summary>
        /// 系统编号
        /// </summary>
        public string SourceSysCode { get; set; }
        /// <summary>
        /// 一张纸门诊医生站
        /// </summary>
        public string SourceSysName { get; set; }
        /// <summary>
        /// 医嘱保存
        /// </summary>
        public string CallOpportunity { get; set; }
        /// <summary>
        /// 数据对象
        /// </summary>
        public ExecuteCpdmCheckData Data { get; set; }
    }


    public class COMPONENTNAME_LISTItem {
        /// <summary>
        /// 重组人Ⅱ型肿瘤坏死因子受体-抗体融合蛋白
        /// </summary>
        public string COMPONENTNAME { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DRUGBASECODE { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PathItemId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BigClassName { get; set; }

        public string DrugID { get; set; }
        public string DrugBaseCode { get; set; }
    }

    /// <summary>
    /// 新医保管控入参
    /// </summary>
    public class MircInPatientInfo {
        /// <summary>
        /// 源系统编码
        /// </summary>
        public string SourceSysCode { get; set; }

        /// <summary>
        /// 源系统名称
        /// </summary>
        public string SourceSysName { get; set; }

        /// <summary>
        /// 操作员ID
        /// </summary>
        public int? OperatorId { get; set; }

        /// <summary>
        /// 操作员姓名
        /// </summary>
        public string OperatorName { get; set; }

        /// <summary>
        /// 患者ID
        /// </summary>
        public int? PId { get; set; }

        /// <summary>
        /// 就诊ID
        /// </summary>
        public int? PvId { get; set; }

        /// <summary>
        /// 性别
        /// </summary>
        public string Sex { get; set; }

        /// <summary>
        /// 年龄
        /// </summary>
        public string Age { get; set; }

        /// <summary>
        /// 年龄数字
        /// </summary>
        public decimal? AgeDigit { get; set; }

        /// <summary>
        /// 患者身高(cm)
        /// </summary>
        public string PatiHeight { get; set; }

        /// <summary>
        /// 患者体重(kg)
        /// </summary>
        public string PatiWeight { get; set; }

        /// <summary>
        /// 出生日期
        /// </summary>
        public DateTime? BirthdayTime { get; set; }

        /// <summary>
        /// 患者姓名
        /// </summary>
        public string PatientName { get; set; }

        /// <summary>
        /// 患者来源
        /// </summary>
        public int? PatientSource { get; set; }

        /// <summary>
        /// 患者保险类型
        /// </summary>
        public int? PatiInsurance { get; set; }

        /// <summary>
        /// 医院等级
        /// </summary>
        public string HospitalLevel { get; set; }

        /// <summary>
        /// 呼叫机会
        /// </summary>
        public string CallOpportunity { get; set; }

        /// <summary>
        /// 呼叫科室ID
        /// </summary>
        public int? CallDeptId { get; set; }

        public List<MircInDiagnosis> DiagsList { get; set; }

        public List<MircInSurgery> SurgeryList { get; set; }

        public List<MircInFeeList> FeeList { get; set; }
    }

    /// <summary>
    /// 医管诊断信息实体
    /// </summary>
    public class MircInDiagnosis {
        /// <summary>
        /// 诊断ID
        /// </summary>
        public int? DiagId { get; set; }

        /// <summary>
        /// 诊断编码
        /// </summary>
        public string DiagCode { get; set; }

        /// <summary>
        /// 诊断名称
        /// </summary>
        public string DiagName { get; set; }
    }

    /// <summary>
    /// 医管手术信息实体
    /// </summary>
    public class MircInSurgery {
        /// <summary>
        /// 手术编码
        /// </summary>
        public string SurgeryCode { get; set; }

        /// <summary>
        /// 手术名称
        /// </summary>
        public string SurgeryName { get; set; }

        /// <summary>
        /// 手术等级
        /// </summary>
        public string SurgeryLevel { get; set; }
    }

    /// <summary>
    /// 医管接口入参数据结构
    /// </summary>    
    public class MircInFeeList {
        /// <summary>
        /// 国家医保编码
        /// </summary>
        public string CountryMedicalInsuranceCode { get; set; }

        /// <summary>
        /// 地区医保编码
        /// </summary>
        public string AreaMedicalInsuranceCode { get; set; }

        /// <summary>
        /// 费用ID
        /// </summary>
        public int? FeeId { get; set; }

        /// <summary>
        /// 费用名称
        /// </summary>
        public string FeeName { get; set; }

        /// <summary>
        /// 医嘱ID
        /// </summary>
        public decimal? AdviceId { get; set; }

        /// <summary>
        /// 费用发生时间
        /// </summary>
        public DateTime? FeeOccurTime { get; set; }

        /// <summary>
        /// 医嘱开始执行时间
        /// </summary>
        public DateTime? OrderStartExecutionTime { get; set; }

        /// <summary>
        /// 婴儿序号
        /// </summary>
        public int? BabyNumber { get; set; }

        /// <summary>
        /// 诊疗项目ID
        /// </summary>
        public int? DiacrisistItemId { get; set; }

        /// <summary>
        /// 开单科室ID
        /// </summary>
        public int? BillDeptId { get; set; }

        /// <summary>
        /// 开单科室名称
        /// </summary>
        public string BillDeptName { get; set; }

        /// <summary>
        /// 执行科室ID
        /// </summary>
        public int? ExecDeptId { get; set; }

        /// <summary>
        /// 执行科室名称
        /// </summary>
        public string ExecDeptName { get; set; }

        /// <summary>
        /// 单次用量
        /// </summary>
        public decimal? OnceDosage { get; set; }

        /// <summary>
        /// 日用量
        /// </summary>
        public decimal? DayDosage { get; set; }

        /// <summary>
        /// 总金额
        /// </summary>
        public decimal? Total { get; set; }

        /// <summary>
        /// 执行次数
        /// </summary>
        public decimal? ExecNumber { get; set; }

        /// <summary>
        /// 费用单价
        /// </summary>
        public decimal? FeeUnitPrice { get; set; }

        /// <summary>
        /// 医嘱数量
        /// </summary>
        public decimal? OrderQuantity { get; set; }

        /// <summary>
        /// 医嘱金额
        /// </summary>
        public decimal? OrderAmount { get; set; }
    }

    /// <summary>
    /// 医管接口返回数据结构
    /// </summary>
    public class MircOutDataOp {
     
        public List<MircOutData> FeeListResults { get; set; }
        public string CheckinResultInfo { get; set; }
    }

    /// <summary>
    /// 医管接口返回数据中费用清单
    /// </summary>
    public class MircOutData {
        public string UniqueId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string MedicalInsuranceCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PvId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PatientSource { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string FeeId { get; set; }
        /// <summary>
        /// 1小儿止咳糖浆
        /// </summary>
        public string FeeName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AdviceId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DiacrisistItemId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string RuleId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string MircRecId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string FeeOccurTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int RuleType { get; set; }
        /// <summary>
        /// 限儿童2 报销3
        /// </summary>
        public string RuleReason { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PromptContent { get; set; }

        public int? UseResult { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? RuleResult { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<string> PromptOptions { get; set; }
    }


    /// <summary>
    /// 合理用药药品同成份返回值
    /// </summary>
    public class DRUGTCFOUT {
        /// <summary>
        /// 
        /// </summary>
        public string DRUGBASECODE_MAIN { get; set; }

        ////////{"DrugID":"10139","DrugBaseCode":"86900835000018"}

        /// <summary>
        /// 
        /// </summary>
        public List<COMPONENTNAME_LISTItem> COMPONENTNAME_LIST { get; set; }
    }


    public class CheckResultItem {
        /// <summary>
        /// 医嘱id
        /// </summary>
        public string AdviceId { get; set; }
        /// <summary>
        /// 提示信息
        /// </summary>
        public string TipMsg { get; set; }
    }

    public class CPDMCheckOUT {
        /// <summary>
        /// 
        /// </summary>
        public string Url { get; set; }
        /// <summary>
        /// 医嘱选择,医嘱保存
        /// </summary>
        public string CallOpportunity { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<CheckResultItem> CheckResult { get; set; }
    }



}
