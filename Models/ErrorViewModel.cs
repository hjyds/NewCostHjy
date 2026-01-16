using System;
using System.Collections.Generic;

namespace NewCostHjy.Models {

    public class EduUrlWteOneMod {
        /// <summary>
        /// 
        /// </summary>
        public int PId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int EncId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int EncType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int DeptId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TempId { get; set; }
        /// <summary>
        /// 陈兴隆
        /// </summary>
        public string @Operator { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int OperId { get; set; }
        /// <summary>
        /// 主任药师
        /// </summary>
        public string OperPosition { get; set; }
        /// <summary>
        /// 17岁
        /// </summary>
        public string age { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string computerIp { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int sourceType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string userName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string password { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int babyNum { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int ModifyType { get; set; }
        /// <summary>
        /// 产科门诊
        /// </summary>
        public string DeptName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int docType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string localUrl { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int HealthType { get; set; }
    }


    /// <summary>
    /// 
    /// </summary>
    public class EduRuleItem {
        /// <summary>
        /// 诊断
        /// </summary>
        public string RuleType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string RuleId { get; set; }
        /// <summary>
        /// (L02.103)颈部痈
        /// </summary>
        public string RuleName { get; set; }
    }
    /// <summary>
    /// GetHealthEducationRuleTempList  API入参
    /// </summary>
    public class EduRuleTempListPar {
        /// <summary>
        /// 
        /// </summary>
        public int PId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int EncId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int EncType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int DeptId { get; set; }
        /// <summary>
        /// 门诊内科
        /// </summary>
        public string DeptName { get; set; }
        /// <summary>
        /// 张永康
        /// </summary>
        public string @Operator { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int OperId { get; set; }
        /// <summary>
        /// 主任医师
        /// </summary>
        public string OperPosition { get; set; }
        /// <summary>
        /// 26岁
        /// </summary>
        public string Age { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ComputerIp { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int SourceType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Password { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int BabyNum { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int SystemCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<EduRuleItem> Rule { get; set; }
    }


    /// <summary>
    /// GetHealthEducationCsformRecordList  AIP 的入参模型
    /// </summary>
    public class EduWtedPar {
        /// <summary>
        /// 
        /// </summary>
        public int PId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int EncId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int EncType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int BabyNum { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int DeptId { get; set; }
        /// <summary>
        /// 门诊内科
        /// </summary>
        public string DeptName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string StartDate { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string EndDate { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string FilterName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DocStatus { get; set; }
        /// <summary>
        /// 张永康
        /// </summary>
        public string @Operator { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int OperId { get; set; }
        /// <summary>
        /// 主任医师
        /// </summary>
        public string OperPosition { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int IsPrint { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ThirdSystemKey { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int SystemCode { get; set; }
    }


    /// <summary>
    /// 健康教育处方-P1-输出参数对象
    /// </summary>
    [Serializable]
    public class HEduOutA {
        /// <summary>
        /// 
        /// </summary>
        public string TempId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string SupTempId { get; set; }
        /// <summary>
        /// 健康教育处方-P1
        /// </summary>
        public string TempName { get; set; }
        /// <summary>
        /// http://192.168.32.135:8120/meddoc/edit?PId=160471&EncId=1957020&EncType=1&DeptId=148&TempId=ada76853-54e4-abe1-5b48-ed6b11346f23&Operator=陈兴隆&OperId=1274276&OperPosition=主任药师&age=17岁&computerIp=127.0.0.1&sourceType=3&userName=777777&password=&babyNum=0&ModifyType=1&DeptName=产科门诊&docType=1&localUrl=http://192.168.32.135:8120
        /// </summary>
        public string AddUrl { get; set; }
        /// <summary>
        /// 知情同意书
        /// </summary>
        public string TempType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TempCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IsRequiredField { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TempTypeDisplayName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IsDisable { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IsHealthEducation { get; set; }
    }

    /// <summary>
    /// 健康教育处方-P2-输出参数对象
    /// </summary>
    [Serializable]
    public class HEduOutB {
        /// <summary>
        /// 王庞测试是否健康教育处方_复制
        /// </summary>
        public string MedDocName { get; set; }
        /// <summary>
        /// 知情同意书
        /// </summary>
        public string MedDocType { get; set; }
        /// <summary>
        /// 陈兴隆
        /// </summary>
        public string Creator { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CreateTime { get; set; }
        /// <summary>
        /// 已作废
        /// </summary>
        public string DocStatus { get; set; }
        /// <summary>
        /// 陈兴隆
        /// </summary>
        public string LastModifier { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string LastModifyTime { get; set; }
        /// <summary>
        /// 产科门诊
        /// </summary>
        public string DeptName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DeptId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string MedDocId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string SupMedDocId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IsSign { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IsAllDocSign { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PatIsSign { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DocIsSign { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string EvaResult { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TemplateId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TemplateCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TemplateNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TempTypeId { get; set; }
        /// <summary>
        /// http://192.168.32.135:8120/MedDoc/index?PId=160471&EncType=1&EncId=1957020&MedDocId=6b90f1c0-c834-4640-bf32-7a1eab0d8cdb&Operator=陈兴隆&OperId=1274276&UserName=CXL&OperDeptId=148&DeptName=产科门诊&ModifyType=0&IsPrint=1&docType=1&localUrl=http://192.168.32.135:8120
        /// </summary>
        public string PreviewUrl { get; set; }
        /// <summary>
        /// http://192.168.32.135:8120/MedDoc/edit?PId=160471&EncId=1957020&babyNum=0&EncType=1&DeptId=148&DeptName=产科门诊&MedDocId=6b90f1c0-c834-4640-bf32-7a1eab0d8cdb&Operator=陈兴隆&OperPosition=主任药师&ModifyType=2&isSign=1&TempId=51ad61cf-2467-f96e-08ab-bd5174bf7a40&OperId=1274276&UserName=CXL&PatIsSign=0&docType=1&operation=1&localUrl=http://192.168.32.135:8120
        /// </summary>
        public string EditUrl { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PrintSign { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string NeddArrangement { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string TypeId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BusinessGroupId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Rno { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string MedicalTypeSign { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PrintControl { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IfHasReview { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Auditors { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AuditTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string LastAuditors { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string LastAuditTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Completor { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CompleteTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AppointAuditor { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string LastPrintor { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string LastPrintTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DocNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PatSignStatu { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DocSignStatu { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string WriteCmpltr { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string MustSignStatu { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ManualCompleteOper { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CompleteAllSign { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string cda_doc_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string system_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ReportType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PatId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string VisitId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PatType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BabySign { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IsCanAutoPrint { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IsHealthEducation { get; set; }
    }

    /// <summary>
    /// 通用API服务参数对象
    /// </summary>
    [Serializable]
    public class PostApiPar {
        public string Para { get; set; }
        public string Url { get; set; }
        public string TimeOut { get; set; }

        /// <summary>
        /// 请求类型，例如：Get,Post,=1表示Get,其它表示Post
        /// </summary>
        public string Type { get; set; }
    }

    /// <summary>
    /// 溯源码药品发药明细对象
    /// </summary>
    [Serializable]
    public class TraceDrugItem {
        public decimal 溯源码分零系数 { get; set; }
        public string 计算单位 { get; set; }
        public string 溯源码包装 { get; set; }
        public string 住院包装 { get; set; }
        public string 住院单位 { get; set; }
        public string 门诊包装 { get; set; }
        public string 门诊单位 { get; set; }
        public string 药库包装 { get; set; }
        public string 药库单位 { get; set; }
        public string 溯源码包装单位 { get; set; }
    }

    public class ErrorViewModel {
        public string RequestId { get; set; }

        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }

    /// <summary>
    /// 检验项目适用的标本和采集方式
    /// </summary>
    public class SpecTestLisColl {
        /// <summary>
        /// 标本id
        /// </summary>
        public string specimendefinition_id { get; set; }
        /// <summary>
        /// 标本hisid
        /// </summary>
        public string specimendefinition_His_id { get; set; }
        /// <summary>
        /// 标本名称，鼻咽部分泌物
        /// </summary>
        public string specimendefinition_name { get; set; }
        /// <summary>
        /// 标本编码
        /// </summary>
        public string specimendefinition_code { get; set; }
        /// <summary>
        /// 标本his编码
        /// </summary>
        public string specimendefinition_His_code { get; set; }
        /// <summary>
        /// 采集方式编码
        /// </summary>
        public string collect_method_code { get; set; }
        /// <summary>
        /// 采集方式HIS诊疗项目编码
        /// </summary>
        public string collect_method_His_code { get; set; }
        /// <summary>
        /// 采集方式名称，免疫传染
        /// </summary>
        public string collection_method_name { get; set; }
        /// <summary>
        /// 采集方式his诊疗项目id
        /// </summary>
        public string collection_method_His_id { get; set; }
        /// <summary>
        /// 服务对象，1-门诊，2-住院，3-门诊住院
        /// </summary>
        public string serviceobject { get; set; }
    }



    /// <summary>
    /// 导航台SQLLOG日志记录模型
    /// </summary>
    public class SQLLOGMOD {
        /// <summary>
        /// 日志记录的标题
        /// </summary>
        public string 标题信息 { get; set; }

        /// <summary>
        /// 查询语句
        /// </summary>
        public string 查询语句 { get; set; }

        /// <summary>
        /// 耗时时间
        /// </summary>
        public string 耗时信息 { get; set; }

        /// <summary>
        /// 耗秒
        /// </summary>
        public decimal? 耗时数值 { get; set; }

        /// <summary>
        /// 模块名称
        /// </summary>
        public string Module_Name { get; set; }

        public string Function_Name { get; set; }
    }

    public class DataItem {
        /// <summary>
        /// 
        /// </summary>
        public string state { get; set; }

        /// <summary>
        /// 按数据源的返回控制：0-忽略，1-禁止，2-提示
        /// </summary>
        public string tip_mode { get; set; }
        /// <summary>
        /// 禁止信息
        /// </summary>
        public string message_ban { get; set; }
        /// <summary>
        /// 提示信息
        /// </summary>
        public string message_tips { get; set; }
    }

    public class OutputChk {
        /// <summary>
        /// 
        /// </summary>
        public int code { get; set; }
        /// <summary>
        /// 成功
        /// </summary>
        public string message { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<DataItem> data { get; set; }
    }

    public class RootChkApi {
        /// <summary>
        /// 
        /// </summary>
        public OutputChk output { get; set; }
    }




    public class Head {
        /// <summary>
        /// 
        /// </summary>
        public string bizno { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string sysno { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string tarno { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string action_no { get; set; }
    }

    public class Input {
        /// <summary>
        /// 
        /// </summary>
        public Head head { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string exe_status { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string msg_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string err_msg { get; set; }
    }

    /// <summary>
    /// 临生免同步检查申请时的出参
    /// </summary>
    public class WebLisAppDataOut {
        /// <summary>
        /// 
        /// </summary>
        public Input input { get; set; }
    }

    public class DRGDataAttributes {
        public string feeVersionID { get; set; }
        public string drgGroupID { get; set; }
        public string noGroupNote { get; set; }
        public string drgCode { get; set; }
        public string drgName { get; set; }
        public string diagName { get; set; }
        public string diagCode { get; set; }
        public string operationName { get; set; }
        public DrgOtherGroupInfo otherGroupInfo { get; set; }
    }
    public class DrgOtherGroupInfo {
        public string id { get; set; }
    }

    public class DIPRsOut {
        /// <summary>
        /// 
        /// </summary>
        public string DipId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DipCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DipName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DiagCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DiagName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string OperationCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string OperationName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string UserDiagName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string UserOperationName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DiseaseGroup { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ClearingFee { get; set; }
        /// <summary>
        /// 未获取到DIP分组版本！
        /// </summary>
        public string Describe { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ScoreValue { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PointValue { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Coefficient { get; set; }
    }


    public class DRGDiagInfo {
        public string DiagCode { get; set; }
        public string DiagName { get; set; }
        public string SNO { get; set; }
    }

    public class DRGOperationInfo {
        public string OperationCode { get; set; }
        public string OperationName { get; set; }
        public string SNO { get; set; }
        public DateTime? OperationTime { get; set; }
    }
    public class DIPDiagInfosByTCM {
        public string DiagCode { get; set; }
    }
    public class DRGPARIN {
        public string ExecType { get; set; }
        public string PatiId { get; set; }
        public string PageId { get; set; }
        public string Scene { get; set; }
        public string PatiAge { get; set; }
        public string PatiWeight { get; set; }
        public string IsNewborn { get; set; }
        public string PatiDischargeDate { get; set; }
        public string SaveSign { get; set; }
        public string AppScen { get; set; }
        public List<DRGDiagInfo> DiagInfos { get; set; }
        public List<DRGOperationInfo> OperationInfos { get; set; }

        public List<DIPDiagInfosByTCM> DiagInfosByTCM  { get; set; }
    }



    /// <summary>
    /// 临生免同步检查申请时的入参
    /// </summary>
    public class WebLisAppData {
        /// <summary>
        /// 
        /// </summary>
        public int CallType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int OperType { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string OrderIds { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string OperId { get; set; }
        /// <summary>
        /// 管理员
        /// </summary>
        public string OperName { get; set; }
    }


    /// <summary>
    /// 药品本位码给药途径校验模型
    /// </summary>
    public class DrugUseWChk {
        /// <summary>
        /// 标识号
        /// </summary>
        public string DRUGSERNUM { get; set; }
        /// <summary>
        /// 本位码
        /// </summary>
        public string DRUGBASECODE { get; set; }
        /// <summary>
        /// 口服，给药途径名称
        /// </summary>
        public string DRUGROUTENAME { get; set; }
        /// <summary>
        /// 口服，给药途径大类名称
        /// </summary>
        public string DRUGROUTECLASSNAME { get; set; }
        /// <summary>
        /// 药品id
        /// </summary>
        public string DRUGID { get; set; }
        /// <summary>
        /// 阿莫西林胶囊，收费项目目录名称
        /// </summary>
        public string DRUGNAME { get; set; }

        /// <summary>
        /// 提示标识
        /// </summary>
        public int? PROMPTMARK { get; set; }

        /// <summary>
        /// 提示内容
        /// </summary>
        public string PROMPTCONTENT { get; set; }
    }

    public class VteModPar { 
        /// <summary>
        /// 
        /// </summary>
        public int PatientId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int VisitId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int DeptId { get; set; }
        /// <summary>
        /// 内科
        /// </summary>
        public string DeptName { get; set; }
        /// <summary>
        /// 张永康
        /// </summary>
        public string OprtrName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int OprtrId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int SourceItemId { get; set; }
        /// <summary>
        /// 主任医师
        /// </summary>
        public string OperPosition { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int ItemId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ItemOperateType { get; set; }
    }

    public class DisPatMod {
        /// <summary>
        /// 
        /// </summary>
        public int report_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int report_status { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int pati_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int pati_visit_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int pati_visit_id { get; set; }
        /// <summary>
        /// 赵顺利
        /// </summary>
        public string pati_name { get; set; }
        /// <summary>
        /// 男
        /// </summary>
        public string pati_sex { get; set; }
        /// <summary>
        /// 36岁
        /// </summary>
        public string pati_age { get; set; }
        /// <summary>
        /// 不便分类的其他从业人员
        /// </summary>
        public string pati_job { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pati_adrss { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pati_phone { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pati_outno { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pati_inno { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pati_no { get; set; }
        /// <summary>
        /// 李超
        /// </summary>
        public string doctor { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int dept_id { get; set; }
        /// <summary>
        /// 心内一科
        /// </summary>
        public string dept_name { get; set; }
        /// <summary>
        /// 李超
        /// </summary>
        public string creator { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string create_time { get; set; }
        /// <summary>
        /// 李超
        /// </summary>
        public string mofidy_operator { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string mofidy_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int disease_id { get; set; }
        /// <summary>
        /// 霍乱
        /// </summary>
        public string disease_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int disease_type { get; set; }
        /// <summary>
        /// 中华人民共和国传染病报告卡
        /// </summary>
        public string template_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int disease_category_id { get; set; }
        /// <summary>
        /// 传染病
        /// </summary>
        public string disease_category_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string up_memo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string sign_id { get; set; }
    }

    public class MedPageModPar { 
        public int? PatientId { get; set; }
        public int? EnconterId { get; set;}
        public int? EncounterType { get; set; }
    }
    public class MedPageMod {

         
        /// <summary>
        /// 
        /// </summary>
        public string PAGE_RECORD_ID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PATIENT_ID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PATIENT_NAME { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PATIENT_GENDER { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PATIENT_AGE { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ENCOUNTER_TYPE { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ENCOUNTER_ID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ENCOUNTER_NO { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PAGE_TEMPLATE_ID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int PAGE_STATUS { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int AUDIT_STATUS { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PATIENT_TYPE { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string FEE_TYPE { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DEPT_NAME { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DEPT_ID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string WARD_ID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string MED_INSURANCE { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IS_SIGN { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IS_AUDIT_SUBMIT { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ADDTIME { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string OUTTIME { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AUDIT_SUBMIT_OPER { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AUDIT_SUBMIT_TIME { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AUDIT_OPER { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AUDIT_TIME { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BED_NO { get; set; }
    }


    public class VtePatiTag {
        /// <summary>
        /// 
        /// </summary>
        public string PatientId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string VisitId { get; set; }
        /// <summary>
        /// VTE高危风险
        /// </summary>
        public string VteStateName { get; set; }
        /// <summary>
        /// 高
        /// </summary>
        public string VteStateShortName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string VteStateId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string VteStateColor { get; set; }
        /// <summary>
        /// 高出血风险
        /// </summary>
        public string BleedStateName { get; set; }
        /// <summary>
        /// 高
        /// </summary>
        public string BleedStateShortName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BleedStateId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BleedStateColor { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int VteUnExeItemQuantity { get; set; }

        public string DeptId { get; set; }

        public string Status { get; set; }
    }

    public class VteDepartment {
        /// <summary>
        /// 呼吸内科
        /// </summary>
        public string DepartmentName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DepartmentCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int DepartmentId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int KeyDepartment { get; set; }
    }

    public class RehabPatPar {
        /// <summary>
        /// 病人科室id
        /// </summary>
        public int PatientDepartmentId { get; set; }
        /// <summary>
        /// 病人id
        /// </summary>
        public int PatientId { get; set; }
        /// <summary>
        /// 就诊id
        /// </summary>
        public int VisitId { get; set; }
        /// <summary>
        /// 机器名
        /// </summary>
        public string DevName { get; set; }
        /// <summary>
        /// 站点编号
        /// </summary>
        public string NodeNo { get; set; }
        /// <summary>
        /// 界面科室id,左上角下拉列表的部门id
        /// </summary>
        public int DeptId { get; set; }
        /// <summary>
        /// 界面科室显示方式, 0-按科室显示，1-按病区显示
        /// </summary>
        public int DeptView { get; set; }
        /// <summary>
        /// 病人在列表类型，0-待入住；1-在院；2-出院；3-转出；4-会诊
        /// </summary>
        public int PatListType { get; set; }
        /// <summary>
        /// 会诊医嘱id
        /// </summary>
        public int MeetOrderId { get; set; }
        /// <summary>
        /// 操作员id
        /// </summary>
        public int OperatorId { get; set; }
        /// <summary>
        /// 调用场景，1-ZLHIS住院医生站调用
        /// </summary>
        public int CallType { get; set; }
    }


    ////////////////新静配规则模型Start/////////////////////////

    public class Replace_Pharmacy_ListItem {

        /// <summary>
        /// 药房ID
        /// </summary>
        public string Repalce_Pharamacy_Id { get; set; }

        /// <summary>
        /// 缺省药房，取值0/1
        /// </summary>
        public string Default_Pharmay { get; set; }

        /// <summary>
        /// 可用药房，取值0/0
        /// </summary>
        public string Available_Pharamy { get; set; }
    }

    /// <summary>
    /// 给药途径
    /// </summary>
    public class Drug_Method_ListItem {
        /// <summary>
        /// 给药途径名称
        /// </summary>
        public string Drug_Method_Name { get; set; }

        /// <summary>
        /// 接收时间方案|0-按时间段控制，1-全天
        /// </summary>
        public int Recive_Sign { get; set; }

        /// <summary>
        /// 忽略其它条件字符，逗号分隔【1,2,3/2,3,....】，含义：1-医嘱效期;2-医嘱执行性质;3-是否接收当日执行医嘱
        /// </summary>
        public string Notconditionaffect { get; set; }
    }

    /// <summary>
    /// 药品信息
    /// </summary>
    public class Drug_Type_ListItem {
        /// <summary>
        /// 药品类型，中文来源于新静配的表 ZLPIVAS.DispensingProperties.DRUGTYPE
        /// </summary>
        public string Drug_Type_Name { get; set; }

        /// <summary>
        /// 是否按执行方案处理
        /// </summary>
        public int Recive_Sign { get; set; }

        public string Drug_Ids { get; set; }

        /// <summary>
        /// 忽略其它条件字符，逗号分隔【1,2,3/2,3,....】，含义：1-医嘱效期;2-医嘱执行性质;3-是否接收当日执行医嘱
        /// </summary>

        public string Notconditionaffect { get; set; }

    }

    public class PivasNewRuleMod {

        /// <summary>
        /// 病区id
        /// </summary>
        public string WardId { get; set; }

        /// <summary>
        /// 静配中心部门id
        /// </summary>
        public int Static_Center_Id { get; set; }

        /// <summary>
        /// 单组药不接收，1-是；0-否
        /// </summary>
        public int Single_Vial_Not_Static { get; set; }

        /// <summary>
        /// 病区是否配液 1-是；0-否
        /// </summary>
        public int Static_Match_Sign { get; set; }

        /// <summary>
        /// 医嘱期效|0-仅临嘱；1-仅长嘱；2-长嘱和临嘱都要
        /// </summary>
        public int Effictive_Time { get; set; }

        /// <summary>
        /// 医嘱药品执行性质|1-自备药；2-不取药；3-离院带药
        /// </summary>
        public string Execute_Nature { get; set; }

        /// <summary>
        /// 需要置换药房的药品id串,不进入静配中心的药品id串
        /// </summary>
        public string Change_Drug_ids { get; set; }

        /// <summary>
        /// 给药途径列表，有值只接收这种给药途径的药品
        /// </summary>
        public List<Drug_Method_ListItem> Drug_Method_List { get; set; }

        /// <summary>
        /// 药品列表
        /// </summary>
        public List<Drug_Type_ListItem> Drug_Type_List { get; set; }

        /// <summary>
        /// 是否接收当日执行医嘱，固定取值 0/1
        /// </summary>
        public string Recive_Current_Day_Sign { get; set; }

        /// <summary>
        /// 小时差
        /// </summary>
        public string Hours_Difference { get; set; }

        /// <summary>
        /// 时间起点 23:59:59
        /// </summary>
        public string First_Day_Begin_Time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string First_Day_End_Time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Second_Day_Begin_Time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Second_Day_End_Time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Third_Day_Begin_Time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Third_Day_End_Time { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string Other_Day_Begin_Time { get; set; }

        /// <summary>
        /// 
        /// </summary>
        public string Other_Day_End_Time { get; set; }

        /// <summary>
        /// 置换药房列表
        /// </summary>
        public List<Replace_Pharmacy_ListItem> Replace_Pharmacy_List { get; set; }

    }
    ////////////////新静配规则模型End/////////////////////////


    /// <summary>
    /// 中联合理用药相关模型
    /// </summary>
    [Serializable]
    public class RecipesItemZLPASS {
        /// <summary>
        /// 
        /// </summary>
        public string ORDER_ID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ORDER_GROUP_ID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PHARMACIST_ID { get; set; }
        /// <summary>
        /// 正在审核
        /// </summary>
        public string ORDERSTATUS { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string NO_PASS_REASON { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string REMAININGTIME { get; set; }
    }

    /// <summary>
    /// 中联合理用药返回结果模型
    /// </summary>
    [Serializable]
    public class GetRecipeResult_OutM {
        /// <summary>
        /// 
        /// </summary>
        public List<RecipesItemZLPASS> recipes { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string url { get; set; }
    }

    /// <summary>
    /// 外挂插件保存模型中的明细行模型
    /// </summary>
    public class IndsSavePlgItem {
        /// <summary>
        /// 医嘱id
        /// </summary>
        public int advice_id { get; set; }
        /// <summary>
        /// 相关id
        /// </summary>
        public int advice_related_id { get; set; }
        /// <summary>
        /// 序号
        /// </summary>
        public int serial_num { get; set; }
        /// <summary>
        /// 医嘱状态
        /// </summary>
        public int advice_statu { get; set; }
        /// <summary>
        /// 医嘱期效
        /// </summary>
        public int effective_time { get; set; }
        /// <summary>
        /// 诊疗类别
        /// </summary>
        public string clinic_type { get; set; }
        /// <summary>
        /// 诊疗项目id
        /// </summary>
        public int advice_cisitem_id { get; set; }
        /// <summary>
        /// 标本部位
        /// </summary>
        public string citem_spcm_parts { get; set; }
        /// <summary>
        /// 检查方法
        /// </summary>
        public string citem_exam_method { get; set; }
        /// <summary>
        /// 收费细目id
        /// </summary>
        public int fee_item_id { get; set; }
        /// <summary>
        /// 天数
        /// </summary>
        public int? advice_day { get; set; }
        /// <summary>
        /// 单量
        /// </summary>
        public decimal? single { get; set; }
        /// <summary>
        /// 总量
        /// </summary>
        public decimal? total_qunt { get; set; }
        /// <summary>
        /// 医嘱内容
        /// </summary>
        public string advice_note { get; set; }
        /// <summary>
        /// 医生嘱托备注
        /// </summary>
        public string advice_doctor_note { get; set; }
        /// <summary>
        /// 医嘱执行科室id
        /// </summary>
        public int advice_exedept_id { get; set; }
        /// <summary>
        /// 频率
        /// </summary>
        public string frequency_name { get; set; }
        /// <summary>
        /// 频率次数
        /// </summary>
        public int? frequency_times { get; set; }
        /// <summary>
        /// 间隔
        /// </summary>
        public int? frequency_interval { get; set; }
        /// <summary>
        /// 单位
        /// </summary>
        public string interval_unit { get; set; }
        /// <summary>
        /// 执行时间方案
        /// </summary>
        public string exetime_plan { get; set; }
        /// <summary>
        /// 计价特性
        /// </summary>
        public int? valuation_nature { get; set; }
        /// <summary>
        /// 执行性质
        /// </summary>
        public int? advice_exe_pro_code { get; set; }
        /// <summary>
        /// 执行标记
        /// </summary>
        public int advice_exe_sign { get; set; }
        /// <summary>
        /// 可否分零
        /// </summary>
        public int? can_split { get; set; }
        /// <summary>
        /// 紧急标志
        /// </summary>
        public int emergency_tag { get; set; }
        /// <summary>
        /// 开始执行时间
        /// </summary>
        public DateTime? advice_begintime { get; set; }
        /// <summary>
        /// 执行终止时间
        /// </summary>
        public DateTime? advice_endtime { get; set; }
        /// <summary>
        /// 开嘱科室id
        /// </summary>
        public int advice_dept_id { get; set; }
        /// <summary>
        /// 开嘱医生
        /// </summary>
        public string advice_doctor { get; set; }
        /// <summary>
        /// 开嘱时间
        /// </summary>
        public DateTime? advice_record_time { get; set; }
        /// <summary>
        /// 摘要信息
        /// </summary>
        public string abstract_txt { get; set; }
        /// <summary>
        /// 编辑标志
        /// </summary>
        public int edit_flag { get; set; }
        /// <summary>
        /// 用药目的
        /// </summary>
        public int? advice_purpose { get; set; }
        /// <summary>
        /// 用药理由
        /// </summary>
        public string advice_reason { get; set; }
        /// <summary>
        /// 附项信息
        /// </summary>
        public string appendix { get; set; }
        /// <summary>
        /// 手术情况
        /// </summary>
        public int? surgical_situ { get; set; }
        /// <summary>
        /// 申请序号
        /// </summary>
        public int? apply_num { get; set; }
        /// <summary>
        /// 插件接口信息
        /// </summary>
        public string plugin_ex { get; set; }
        /// <summary>
        /// 诊断信息
        /// </summary>
        public string diagnosis { get; set; }
        /// <summary>
        /// 保存类型
        /// </summary>
        public int save_type { get; set; }
    }
    /// <summary>
    /// WEB住院医生站保存医嘱插件外接口的入参模型
    /// </summary>
    public class IndsSavePlg {
        /// <summary>
        /// 系统标识
        /// </summary>
        public string sys_tag { get; set; }
        /// <summary>
        /// 病人id
        /// </summary>
        public int pati_id { get; set; }
        /// <summary>
        /// 主页id
        /// </summary>
        public int pati_pageid { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>
        public string pati_name { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public string pati_sex { get; set; }
        /// <summary>
        /// 年龄
        /// </summary>
        public string pati_age { get; set; }
        /// <summary>
        /// 科室id
        /// </summary>
        public int pati_dept_id { get; set; }
        /// <summary>
        /// 前提id
        /// </summary>
        public string prerequisite_id { get; set; }
        /// <summary>
        /// 病人来源
        /// </summary>
        public int pati_source { get; set; }
        /// <summary>
        /// 婴儿
        /// </summary>
        public int baby_num { get; set; }
        /// <summary>
        /// 明细列表
        /// </summary>
        public List<IndsSavePlgItem> data_list { get; set; }
    }


    /// <summary>
    /// 请求队列
    /// </summary>
    public class RequestQueue {
        /// <summary>
        /// 获取列表参数
        /// </summary>
        public ListPara ListPara { get; set; }

        /// <summary>
        /// 输出EMR参数
        /// </summary>
        public EMRPara EMRPara { get; set; }

        /// <summary>
        /// 输出指定文件参数
        /// </summary>
        public DocumentPara DocumentPara { get; set; }

        /// <summary>
        /// 输出报表参数
        /// </summary>
        public ReportPara ReportPara { get; set; }
    }

    /// <summary>
    /// 获取列表参数
    /// </summary>
    public class ListPara {
        /// <summary>
        /// 病人ID
        /// </summary>
        public long LngPatiID { get; set; }

        /// <summary>
        /// 主页ID|就诊ID（挂号ID）
        /// </summary>
        public long LngVisitID { get; set; }

        /// <summary>
        /// 挂号单
        /// </summary>
        public string StrRegNO { get; set; }

        /// <summary>
        /// True- R11-首页信息合并为一个“病案首页”，不再分首页正面，首页反面。
        /// </summary>
        public bool BlnHomepageMerge { get; set; }

        /// <summary>
        /// 扩展参数,按键值对方式传值,每个键值对用特殊字符“&”分隔。示例:"RecStatus=1&ReportType=1" RecStatus=1,返回XML格式1包含<rec_status> 节点；ReportType=1,返回XML格式1包含上报类型<report_type> 节点
        /// </summary>
        public string StrExtPara { get; set; } = "RecStatus=1";
    }

    /// <summary>
    /// 输出EMR参数
    /// </summary>
    public class EMRPara {
        /// <summary>
        /// EMR文件主文档ID
        /// </summary>
        public string StrDocId { get; set; }

        /// <summary>
        /// 文件路径: "D:\TEST\Doc"
        /// </summary>
        public string StrFilePath { get; set; }

        /// <summary>
        /// 文件名: "XXX.PDF"
        /// </summary>
        public string StrFileName { get; set; }

        /// <summary>
        /// 打印入参<root><do_canprint>1=需要调用CanPrint方法；反之，不调用。</do_canprint><printed_update_status>1=需要更新病历的打印状态等信息；反之，不更新。</printed_update_status></root></param>
        /// </summary>
        public string StrExtPara { get; set; }
    }

    /// <summary>
    /// 输出指定文件参数
    /// </summary>
    public class DocumentPara {
        /// <summary>
        /// 病人ID
        /// </summary>
        public long LngPatiID { get; set; }

        /// <summary>
        /// 主页ID|就诊ID（挂号ID）
        /// </summary>
        public long LngVisitID { get; set; }

        /// <summary>
        /// PDF文件输出路径（不带文件名）
        /// </summary>
        public string StrFilePath { get; set; }

        /// <summary>
        /// 指定输出的文件清单,其形式为XML类型的字符串。见XML定义
        /// </summary>
        public string StrXML { get; set; }

        /// <summary>
        /// TRUE-将输出文档合并为一个文档(合并文件名：姓名_病人ID_主页ID_病案合并.PDF); False-不合并文档，直接通过报表打印所有格式到一个文件中
        /// </summary>
        public bool BlnMerge { get; set; }

        /// <summary>
        /// 挂号单
        /// </summary>
        public string StrRegNO { get; set; }

        /// <summary>
        /// 打印标志；True需要更新老版病历的打印标志；False不需要
        /// </summary>
        public bool BlnPrintTag { get; set; }

        /// <summary>
        /// 打印机名称；打印的时候传入对应的打印机名称。
        /// </summary>
        public string StrPrinter { get; set; }

        /// <summary>
        /// 扩展参数,按键值对方式传值,每个键值对用特殊字符“&”分隔。示例:"参数名1=参数值&参数名2=参数值&..." 如："SilentMode=1" SilentMode=1 静默打印
        /// </summary>
        public string StrExtPara { get; set; } = "SilentMode=1";
    }

    /// <summary>
    /// 输出报表参数
    /// </summary>
    public class ReportPara {
        /// <summary>
        /// 报表的所属系统号
        /// </summary>
        public long lngSysNo { get; set; }

        /// <summary>
        /// 报表名称或报表编号
        /// </summary>
        public string strReportName { get; set; }

        /// <summary>
        /// 扩展信息（xml格式字串）
        /// </summary>
        public string strInfo { get; set; }
    }

    /// <summary>
    /// 配置信息
    /// </summary>
    public class ConfigInfo {
        /// <summary>
        /// 用户名
        /// </summary>
        public string UserName { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string PasWord { get; set; }

        /// <summary>
        /// 服务名或者可以直接指定IP:Port/SID
        /// </summary>
        public string Server { get; set; }

        /// <summary>
        /// 是否记录CIS日志
        /// </summary>
        public bool IsRecordCISLog { get; set; } = false;

        /// <summary>
        /// 输出模式
        /// </summary>
        public int PrintMode { get; set; } = 5;

        /// <summary>
        /// 打印次数
        /// </summary>
        public int PrintTimes { get; set; }

        /// <summary>
        /// 打印超时时间
        /// </summary>
        public double PrintTimeout { get; set; }

        /// <summary>
        /// 日志保存天数
        /// </summary>
        public int LogDays { get; set; } = 7;

        /// <summary>
        /// 日志保存天数
        /// </summary>
        public int PdfDays { get; set; } = 7;

        /// <summary>
        /// 体温单PDF文件名称
        /// </summary>
        public string TemperatureChartPath { get; set; }

        /// <summary>
        /// 打印程序重启时间
        /// </summary>
        public string RestartTime { get; set; }
    }

    public class QueryPDFPar
    {
        //{     "lngPatiID": 6423,     "lngVisitID": 1,     "strRegNO": "" }

        public long lngPatiID { get; set; }

        public long lngVisitID { get; set; }

        public string strRegNO { get; set; }

        /// <summary>
        /// 输出时的文件标识id
        /// </summary>
        public string id { get; set; }
    }

    public class HisComInitM {
        /// <summary>
        /// 
        /// </summary>
        public string ip { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string port { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string sid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string user { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pwd { get; set; }
    }

    public class VteEvalPar
    {
        /// <summary>
        /// 
        /// </summary>
        public string database { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string orderId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string vteSystem { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string medicalRecord { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string timestamp { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string buttonType { get; set; }

        /// <summary>
        /// 是否是撤消，1-表示为撤消
        /// </summary>
        public string Cancel { get; set; }
    }

    public class SysMessageRecord
    {
        /// <summary>
        /// 主键
        /// </summary>
        public long Id { get; set; }
        /// <summary>
        /// 人员ID
        /// </summary>
        public long? PersonId { get; set; }
        /// <summary>
        /// 用户名
        /// </summary>
        public string Username { get; set; }
        /// <summary>
        /// 窗体句柄
        /// </summary>
        public long? WindowHandle { get; set; }

        /// <summary>
        /// 消息编码
        ///--              S001--切换病人
        ///--              S002--关闭列表
        ///--              S003--打开列表
        /// </summary>
        public string MessageCode { get; set; }

        /// <summary>
        /// 消息内容
        /// </summary>
        public string MessageContent { get; set; }
        /// <summary>
        /// 病人ID
        /// </summary>
        public long? PatientId { get; set; }
        /// <summary>
        /// 就诊ID
        /// </summary>
        public long? VisitId { get; set; }
        /// <summary>
        /// 机器名称
        /// </summary>
        public string MachineName { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime? CreateTime { get; set; }
    }
}
