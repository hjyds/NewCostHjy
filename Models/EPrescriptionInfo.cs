using System;
using System.Collections.Generic;

namespace OnePaperModel
{
    /// <summary>
    /// 电子处方处方审核接口信息
    /// </summary>
    public class EPrescriptionInfo
    {
        
        /// <summary>
        /// 电子处方接口_病人信息
        /// </summary>
        public EPrescriptionInfo_Patient Patient;
        /// <summary>
        /// 电子处方接口_过敏信息
        /// </summary>
        public List<EPrescriptionInfo_Allergen> Allergen;
        /// <summary>
        /// 电子处方接口_诊断信息
        /// </summary>
        public List<EPrescriptionInfo_Diag> Diag;
        /// <summary>
        /// 电子处方接口_处方信息
        /// </summary>
        public List<EPrescriptionInfo_Recipe> Recipe;
        /// <summary>
        /// 电子处方接口_病历信息
        /// </summary>
        public List<EPrescriptionInfo_EMRContent> EMRContent;
    }
    /// <summary>
    /// 电子处方接口_病人信息
    /// </summary>
    public class EPrescriptionInfo_Patient
    {
        /// <summary>
        /// 病人id
        /// </summary>
        public string PatiId { get; set; }
        /// <summary>
        /// 门诊号
        /// </summary>
        public string OutpNo { get; set; }
        /// <summary>
        /// 就诊id
        /// </summary>
        public string VisitId { get; set; }
        /// <summary>
        /// 病人姓名
        /// </summary>
        public string PatiName { get; set; }
        /// <summary>
        /// 病人性别，取值范围(‘男’、‘女’、‘不详’）。
        /// </summary>
        public string PatiSex { get; set; }
        /// <summary>
        /// 病人出生日期。字符型，不能为空。格式为：“YYYY-MM-DD”。
        /// </summary>
        public string PatiBirthday { get; set; }
        /// <summary>
        /// 身高（单位为厘米的身高）。字符型，
        /// </summary>
        public string HeightCM { get; set; }
        /// <summary>
        /// 体重（单位为公斤的体重）。字符型，
        /// </summary>
        public string WeighKG { get; set; }
        /// <summary>
        /// 就诊科室Id。
        /// </summary>
        public string DeptId { get; set; }
        /// <summary>
        /// 就诊科室名称。
        /// </summary>
        public string DeptName { get; set; }
        /// <summary>
        /// 就诊/主管医生Id
        /// </summary>
        public string DoctorId { get; set; }
        /// <summary>
        /// 就诊/主管医生编号
        /// </summary>
        public string DoctorCode { get; set; }
        /// <summary>
        /// 就诊/主管医生姓名。
        /// </summary>
        public string DoctorName { get; set; }
        /// <summary>
        /// 患者生理指征
        /// </summary>
        public string PatiPhsign { set; get; } = string.Empty;
        /// <summary>
        /// 病人年龄
        /// </summary>
        public string PatiAge { get; set; }
        /// <summary>
        /// 费别
        /// </summary>
        public string PayClass { get; set; }
        /// <summary>
        /// 身份证号码
        /// </summary>
        public string IDCard { get; set; }
        /// <summary>
        /// 病人联系电话
        /// </summary>
        public string Telephone { get; set; }
        /// <summary>
        /// 险类
        /// </summary>
        public string SiCategoryId { get; set; }
        /// <summary>
        /// 医疗付款方式
        /// </summary>
        public string SiPayModeName { get; set; } = string.Empty;
        /// <summary>
        /// 体温。数字后不带单位，单位固定为摄氏度。
        /// </summary>
        public string Temperature { get; set; }
        /// <summary>
        /// 医生职称。
        /// </summary>
        public string Position { get; set; }
        /// <summary>
        /// 接诊ID
        /// </summary>
        public string ReceiveId { set; get; } = string.Empty;
        /// <summary>
        /// 急诊标志。0-门诊，1-急诊
        /// </summary>
        public string EmgSign { get; set; }
        /// <summary>
        /// 病人身份。字符型。用于自由自定义患者信息。
        /// </summary>
        public string PatLevel { get; set; }
        /// <summary>
        /// 就诊日期。格式为“YYYY-MM-DD”。
        /// </summary>
        public string RecvTime { get; set; }
    }

    /// <summary>
    /// 电子处方接口_过敏信息
    /// </summary>
    public class EPrescriptionInfo_Allergen
    {
        /// <summary>
        /// 过敏记录ID
        /// </summary>
        public string ID { get; set; }
        /// <summary>
        /// 过敏源编码。
        /// </summary>
        public string AllerCode { get; set; }
        /// <summary>
        /// 过敏源名称。
        /// </summary>
        public string AllerName { get; set; }
        /// <summary>
        /// 过敏症状。
        /// </summary>
        public string AllerSymptom { get; set; }
    }
    /// <summary>
    /// 电子处方接口_诊断信息
    /// </summary>
    public class EPrescriptionInfo_Diag
    {
        /// <summary>
        /// 诊断id
        /// </summary>
        public string DiagId { get; set; }
        /// <summary>
        /// 诊断编码。
        /// </summary>
        public string DiagCode { get; set; }
        /// <summary>
        /// 诊断名称
        /// </summary>
        public string DiagName { get; set; }
        /// <summary>
        /// 诊断类型。同表“病人诊断记录”中“诊断类型”
        /// </summary>
        public string DiagType { get; set; }
        /// <summary>
        /// 诊断次序
        /// </summary>
        public string DiagSno { get; set; }
    }

    /// <summary>
    /// 电子处方接口_西药药物信息
    /// </summary>
    public class EPrescriptionInfo_Drug
    {
        /// <summary>
        /// 医嘱ID
        /// </summary>
        public string AdviceId { get; set; }
        /// <summary>
        /// 医嘱序号
        /// </summary>
        public string SNO { get; set; }
        /// <summary>
        /// 分组序号：一并给药标记【非一并给药为空】
        /// </summary>
        public string GroupNO { get; set; }
        /// <summary>
        /// 药品ID
        /// </summary>
        public string DrugId { get; set; }
        /// <summary>
        /// 药品编码（规格编码）
        /// </summary>
        public string DrugCode { get; set; }

        /// <summary>
        /// 三方药品id
        /// </summary>
        public string DrugThirdId { get; set; } = string.Empty;

        /// <summary>
        /// 药名ID
        /// </summary>
        public string DrugClinicId { get; set; }
        /// <summary>
        /// 药品名称
        /// </summary>
        public string DrugName { get; set; }
        /// <summary>
        /// 规格
        /// </summary>
        public string DrugInfo { get; set; }
        /// <summary>
        /// 是否溶媒
        /// </summary>
        public string DrugProp { get; set; }
        /// <summary>
        /// 给药途径ID
        /// </summary>
        public string UseItemId { get; set; }
        /// <summary>
        /// 给药途径名称。
        /// </summary>
        public string UseName { get; set; }
        /// <summary>
        /// 频率名称
        /// </summary>
        public string FreqName { get; set; }
        /// <summary>
        /// 频率次数
        /// </summary>
        public string FreqTimes { get; set; }
        /// <summary>
        /// 频率间隔
        /// </summary>
        public string FreqInterval { get; set; }
        /// <summary>
        /// 间隔单位
        /// </summary>
        public string IntervalUnit { get; set; }
        /// <summary>
        /// 单量
        /// </summary>
        public string SingleQunt { get; set; }
        /// <summary>
        /// 单量单位
        /// </summary>
        public string SingleUnit { get; set; }
        /// <summary>
        /// 用药天数
        /// </summary>
        public string UseDays { get; set; }
        /// <summary>
        /// 总量
        /// </summary>
        public string TotalQunt { get; set; }
        /// <summary>
        /// 总量单位
        /// </summary>
        public string TotalUnit { get; set; }
        /// <summary>
        /// 医生嘱托
        /// </summary>
        public string DoctorNote { get; set; }
        /// <summary>
        /// 超量说明
        /// </summary>
        public string ExcessNote { get; set; }
        /// <summary>
        /// 抗菌药物的级别
        /// </summary>
        public string IsAnti { get; set; }
        /// <summary>
        /// 抗菌药物用药目的:1-预防，2-治疗
        /// </summary>
        public string AntiUsepurpose { get; set; }
        /// <summary>
        /// 抗菌药物用药理由
        /// </summary>
        public string AntiUsereason { get; set; }
        /// <summary>
        /// 药品特性.毒理分类:麻醉药;毒性药;精神I类;精神II类;普通药
        /// </summary>
        public string DrugPois { get; set; }
        /// <summary>
        /// 药品规格.高危药品:0-普通，1-A级，2-B级，3-C级
        /// </summary>
        public string DrugDanger { get; set; }
        /// <summary>
        /// 滴速
        /// </summary>
        public string DropSpeed { get; set; }
        /// <summary>
        /// 皮试结果 0-阴性 1-阳性
        /// </summary>
        public string SkinTest { get; set; }
    }
 
    /// <summary>
    /// 电子处方接口_处方信息
    /// </summary>
    public class EPrescriptionInfo_Recipe
    {
        /// <summary>
        /// 关联诊断IDs。
        /// </summary>
        public string DiagIds { get; set; }
        /// <summary>
        /// 处方号。字符型。不能为空。
        /// </summary>
        public string RecipeNo { get; set; }
        /// <summary>
        /// 处方类型编码。
        /// </summary>
        public string RecipeTypeCode { get; set; }
        /// <summary>
        /// 处方类型名称。
        /// </summary>
        public string RecipeTypeName { get; set; }
        /// <summary>
        /// 开单科室编码
        /// </summary>
        public string DeptId { get; set; }
        /// <summary>
        /// 开单科室名称
        /// </summary>
        public string DeptName { get; set; }
        /// <summary>
        /// 开单医生ID
        /// </summary>
        public string DoctorId { get; set; }
        /// <summary>
        /// 开单医生编码
        /// </summary>
        public string DoctorCode { get; set; }
        /// <summary>
        /// 开单医生姓名
        /// </summary>
        public string DoctorName { get; set; }
        /// <summary>
        /// 开单时间
        /// </summary>
        public string AdviceTime { get; set; }
        /// <summary>
        /// 药房ID
        /// </summary>
        public string DrugDeptId { get; set; }
        /// <summary>
        /// 药房名称
        /// </summary>
        public string DrugDeptName { get; set; }
        /// <summary>
        /// 取药方式 0-药房取药，1-自备药，2-离院带药(一并给药相同)
        /// </summary>
        public string DrugExecType { get; set; }
        /// <summary>
        /// 特殊信息:特殊医嘱的一些附加信息，如医保电子处方的医保编码信息等
        /// </summary>
        public string SpecialInfo { get; set; }
        /// <summary>
        /// 处方明细
        /// </summary>
        public List<EPrescriptionInfo_Drug> EPrescriptionInfo_Drug;
    }
    

    /// <summary>
    /// 电子处方接口_病历信息
    /// </summary>
    public class EPrescriptionInfo_EMRContent
    {
        /// <summary>
        /// 病历段
        /// </summary>
        public string Title { get; set; }
        /// <summary>
        /// 病历显示内容
        /// </summary>
        public string Text { get; set; }
    }
    public class EPrescriptionDiagItem {
        /// <summary>
        /// 
        /// </summary>
        public int ID { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string CODE { get; set; }
        /// <summary>
        /// 淋巴结结核[胡俊勇测试]
        /// </summary>
        public string NAME { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string SCODE { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string NOTE { get; set; }
    }

    /// <summary>
    /// 院外电子处方药品目录信息药品明细行信息
    /// </summary>
    public class EPrescriptionDrugItem {
        /// <summary>
        /// 编码
        /// </summary>
        public string DRUGCODE { get; set; }
        /// <summary>
        /// 名称乳酸环丙沙星氯化钠注射液
        /// </summary>
        public string DRUGNAME { get; set; }
        /// <summary>
        /// 规格
        /// </summary>
        public string DRUGSPEC { get; set; }
        /// <summary>
        /// 药品特性
        /// </summary>
        public int DRUGPROP { get; set; }
        /// <summary>
        /// 计算单位，瓶
        /// </summary>
        public string DRUGUNIT { get; set; }
        /// <summary>
        /// 门诊单位瓶
        /// </summary>
        public string DRUGOUTPUNIT { get; set; }

        /// <summary>
        /// 住院单位瓶
        /// </summary>
        public string DRUGINPUNIT { get; set; }
        /// <summary>
        /// 抗菌等级
        /// </summary>
        public int ANTITYPE { get; set; }
        /// <summary>
        /// 毒理分类普通药
        /// </summary>
        public string DRUGPOIS { get; set; }
        /// <summary>
        /// 基本药物标识 国家基本药物
        /// </summary>
        public string SSSEDRUGSSIGN { get; set; }
        /// <summary>
        /// 可否分零
        /// </summary>
        public int CANSPLIT { get; set; }
        /// <summary>
        /// 高危药品
        /// </summary>
        public int DRUGDANGER { get; set; }
        /// <summary>
        /// 门诊包装
        /// </summary>
        public decimal DRUGOUTPACKAGE { get; set; }

        /// <summary>
        /// 住院包装
        /// </summary>
        public decimal DRUGINPACKAGE { get; set; }

        /// <summary>
        /// 药品剂型注射剂
        /// </summary>
        public string DRUGFORM { get; set; }
        /// <summary>
        /// 价格
        /// </summary>
        public decimal DRUGPRICE { get; set; }
        /// <summary>
        /// 产地山东齐都药业有限公司，生产企业名称
        /// </summary>
        public string DRUGORIGIN { get; set; }
        /// <summary>
        /// 库存
        /// </summary>
        public decimal? DRUGSTOCK { get; set; }
        /// <summary>
        /// 国家医保代码
        /// </summary>
        public string NATIONINSURECODE { get; set; }
        /// <summary>
        /// 国家医保名称乳酸环丙沙星氯化钠注射液
        /// </summary>
        public string NATIONINSURENAME { get; set; }

        public string FeeType { get; set; }

        public string DrugStock1 { get; set; }

        public string DrugThirdId { get; set; }

        /// <summary>
        /// 费用类型，选择器列表中进行显示
        /// </summary>
        public string COSTTYPE { get; set; }

        /// <summary>
        /// 保险大类，选择器列表中进行显示
        /// </summary>
        public string INSURECATEGORY { get; set; }

        /// <summary>
        /// 备注，说明信息
        /// </summary>
        public string DRUGNOTES { get; set; }

        /// <summary>
        /// 药品商品名
        /// </summary>
        public string DRUGTRADENAME { get; set; }

        /// <summary>
        /// 批准文号
        /// </summary>
        public string APPROVALNUMBER { get; set; }
    }
    /// <summary>
    /// 电子处方作废接口
    /// </summary>
    public class EPrescriptionDelPar {
        /// <summary>
        /// 特殊信息
        /// </summary>
        public string SpecialInfo { get; set; }
        /// <summary>
        /// 医生id
        /// </summary>
        public string DoctorId { get; set; }
        /// <summary>
        /// 时间
        /// </summary>
        public string Time { get; set; }
        /// <summary>
        /// 医嘱id
        /// </summary>
        public string AdviceId { get; set; }
    }

    /// <summary>
    /// 电子处理目录获取的入参
    /// </summary>
    public class EPrescriptionQueryPar {
        /// <summary>
        /// 简码
        /// </summary>
        public string SearchCode { get; set; }
        /// <summary>
        /// 站点
        /// </summary>
        public string StationCode { get; set; }

        /// <summary>
        /// 患者范围 1-门诊,2-住院,3-门诊和住院
        /// </summary>
        public string PatScope { get; set; }

        ///// <summary>
        ///// 病人性别 
        ///// </summary>
        //public string PatSex { get; set; }

        ///// <summary>
        ///// 病人科室id
        ///// </summary>
        //public string PatDeptId { get; set; }

        ///// <summary>
        ///// 险类
        ///// </summary>
        //public string InsureType { get; set; }

        ///// <summary>
        ///// 用户信息id当前操作员人员id
        ///// </summary>
        //public string UserInfoId { get; set; }

        ///// <summary>
        ///// 当前机器名
        ///// </summary>
        //public string DevName { get; set;}
    }

    /// <summary>
    /// 家庭医生签约,签约图片信息
    /// </summary>
    public class JTYSQYJPG
    {
        public string name { get; set; }
        public string uid { get; set; }

        public string url { get; set; }
    }

    /// <summary>
    /// 家庭医生签表模型：表名Contract_sign
    /// </summary>
    public class DocContractSign
    {
        /// <summary>
        /// 重点人群管理 重点人群管理
        /// </summary>
        public string summary { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pic_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pic_uid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pic_url { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? addTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? meetingDate { get; set; }
        /// <summary>
        /// 重庆市永川区来苏镇尘肺病康复站
        /// </summary>
        public string siteName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? updateTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int id { get; set; }
        /// <summary>
        /// 尘肺家医签约
        /// </summary>
        public string title { get; set; }
        /// <summary>
        /// 李天炳
        /// </summary>
        public string userName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string userCode { get; set; }
    }


}
