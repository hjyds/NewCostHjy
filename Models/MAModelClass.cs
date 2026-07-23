using System;
using System.Collections.Generic;

namespace NewCostHjy.Models
{
    /// <summary>
    /// 医共体相关模型类
    /// </summary>
    public class MAModelClass
    {
    }

    /// <summary>
    /// 医共体服务调用后出参的头信息
    /// </summary>
    public class MA_API_Return_hd
    {
        /// <summary>
        /// 
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string target_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string timestamp { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int count { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string msg { get; set; }
    }

    public class M_PACS_2002_Part_listItem
    {
        /// <summary>
        /// 
        /// </summary>
        public int sort { get; set; }
        /// <summary>
        /// 蝶鞍
        /// </summary>
        public string study_part_code { get; set; }
        /// <summary>
        /// 蝶鞍
        /// </summary>
        public string study_part_name { get; set; }
        /// <summary>
        /// 侧位
        /// </summary>
        public string study_method_code { get; set; }
        /// <summary>
        /// 侧位
        /// </summary>
        public string study_method_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string superior_method_code { get; set; }
    }


    public class M_PACS_2002_Body_item
    {
        /// <summary>
        /// 
        /// </summary>
        public int area_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string order_apply_org_code { get; set; }
        /// <summary>
        /// 中联医院信息系统（测试）
        /// </summary>
        public string order_apply_org_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string order_apply_dept_code { get; set; }
        /// <summary>
        /// 内科
        /// </summary>
        public string order_apply_dept_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string order_apply_doctor_code { get; set; }
        /// <summary>
        /// 张永康
        /// </summary>
        public string order_apply_doctor_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string order_apply_doctor_phone { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? order_apply_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pt_id { get; set; }
        /// <summary>
        /// 测试人
        /// </summary>
        public string pt_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pt_sex { get; set; }
        /// <summary>
        /// 27岁
        /// </summary>
        public string pt_age { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pt_birthday { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int pt_heights { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int pt_weight { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pt_bed_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pt_idcard { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pt_phone { get; set; }
        /// <summary>
        /// 中国
        /// </summary>
        public string pt_country { get; set; }
        /// <summary>
        /// 辽宁省丹东市凤城市沙里寨镇
        /// </summary>
        public string pt_address { get; set; }
        /// <summary>
        /// 辽宁省丹东市凤城市沙里寨镇
        /// </summary>
        public string pt_address_extras { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int pt_source_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pt_visit_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? visit_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string clinical_purpose { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string clinical_diagnosis { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string clinical_show { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string study_order_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string study_instance_uid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string study_item_code { get; set; }
        /// <summary>
        /// 胸部体层摄影
        /// </summary>
        public string study_item_name { get; set; }
        /// <summary>
        /// X线
        /// </summary>
        public string study_type_code { get; set; }
        /// <summary>
        /// X线
        /// </summary>
        public string study_type_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string area_apply_org_code { get; set; }
        /// <summary>
        /// 中联医院信息系统（测试）
        /// </summary>
        public string area_apply_org_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string area_apply_doctor_code { get; set; }
        /// <summary>
        /// 张永康
        /// </summary>
        public string area_apply_doctor_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string area_apply_dept_code { get; set; }
        /// <summary>
        /// 内科
        /// </summary>
        public string area_apply_dept_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string area_diagnosis_org_code { get; set; }
        /// <summary>
        /// 医区体机构A
        /// </summary>
        public string area_diagnosis_org_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? area_apply_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int is_emergency { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string exec_dept_code { get; set; }
        /// <summary>
        /// 一病区
        /// </summary>
        public string exec_dept_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string register_doctor_code { get; set; }
        /// <summary>
        /// 张永康
        /// </summary>
        public string register_doctor_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string register_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string study_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string study_eqpt_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string diagnosis_doctor_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string diagnosis_doctor_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string diagnosis_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int positive_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int critical_value_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<M_PACS_2002_Part_listItem> part_list { get; set; }
    }

    /// <summary>
    /// 影像检查项目申请
    /// </summary>
    public class M_PACS_2002_In {
        public MA_head_in head { get; set; }
        public M_PACS_2002_Body_item body { get;set ; }

    }

    /// <summary>
    /// 服务M_DRUG_4002入参
    /// </summary>
    public class M_DRUG_4002_In
    {

        public MA_head_in head { get; set; }

        public List<M_DRUG_4002_Item> body { get; set; }
    }

    /// <summary>
    /// 服务M_DRUG_5002入参,慢病处方申请
    /// </summary>
    public class M_DRUG_5002_In
    {

        public MA_head_in head { get; set; }

        public List<MedicalRegionChronicRecipeUploadBody> body { get; set; }
    }

    /// <summary>
    /// 区域平台慢病处方上传入参。
    /// 对应服务 M_DRUG_5002 的 body 数组项，字段名按平台契约原样保留。
    /// </summary>
    public class MedicalRegionChronicRecipeUploadBody
    {
        /// <summary>必填：就诊机构编码，使用平台下发的机构编码。</summary>
        public string org_code { get; set; } = string.Empty;

        /// <summary>必填：就诊机构名称。</summary>
        public string org_name { get; set; } = string.Empty;

        /// <summary>必填：就诊科室编码，使用平台下发的科室编码。</summary>
        public string dept_code { get; set; } = string.Empty;

        /// <summary>必填：就诊科室名称。</summary>
        public string dept_name { get; set; } = string.Empty;

        /// <summary>必填：本次接口操作人员编码。</summary>
        public string user_code { get; set; } = string.Empty;

        /// <summary>必填：本次接口操作人员名称。</summary>
        public string user_name { get; set; } = string.Empty;

        /// <summary>必填：开方医生编码。</summary>
        public string doctor_code { get; set; } = string.Empty;

        /// <summary>必填：开方医生名称。</summary>
        public string doctor_name { get; set; } = string.Empty;

        /// <summary>必填：就诊标识号，门诊使用挂号 ID，住院使用“住院号_主页 ID”。</summary>
        public string visit_no { get; set; } = string.Empty;

        /// <summary>选填：病区，门诊处方固定传空。</summary>
        public string ward { get; set; } = string.Empty;

        /// <summary>选填：床位号，门诊处方固定传空。</summary>
        public string bed_no { get; set; } = string.Empty;

        /// <summary>必填：就诊来源，1-门诊，2-住院。</summary>
        public int pt_source_code { get; set; }

        /// <summary>必填：院内患者编号。</summary>
        public string pt_id { get; set; } = string.Empty;

        /// <summary>必填：患者姓名。</summary>
        public string pt_name { get; set; } = string.Empty;

        /// <summary>必填：患者性别编码，1-男，2-女，9-未知。</summary>
        public string pt_sex { get; set; } = string.Empty;

        /// <summary>必填：患者出生日期。</summary>
        public string pt_birthday { get; set; } = string.Empty;

        /// <summary>选填：患者年龄。</summary>
        public string pt_age { get; set; } = string.Empty;

        /// <summary>必填：患者联系电话。</summary>
        public string pt_phone { get; set; } = string.Empty;

        /// <summary>必填：患者现住址。</summary>
        public string pt_address { get; set; } = string.Empty;

        /// <summary>选填：患者身高，当前无可靠来源时传 0。</summary>
        public decimal pt_height { get; set; }

        /// <summary>选填：患者体重，当前无可靠来源时传 0。</summary>
        public decimal pt_weight { get; set; }

        /// <summary>选填：证件类型，当前身份证使用 01。</summary>
        public string id_card_type { get; set; } = string.Empty;

        /// <summary>必填：患者证件号码。</summary>
        public string id_card_no { get; set; } = string.Empty;

        /// <summary>必填：就诊时间。</summary>
        public string visit_time { get; set; } = string.Empty;

        /// <summary>必填：是否急诊，0-否，1-是。</summary>
        public int is_emergency { get; set; }

        /// <summary>
        /// 必填：院内处方号。
        /// 平台契约字段固定拼写为 repice_no，不能更名为 recipe_no。
        /// </summary>
        public string repice_no { get; set; } = string.Empty;

        /// <summary>选填：处方种类编码，平台未提供明确值域时传空。</summary>
        public string recipe_type_code { get; set; } = string.Empty;

        /// <summary>必填：处方种类名称，慢特病处方固定传“慢病处方”。</summary>
        public string recipe_type_name { get; set; } = string.Empty;

        /// <summary>选填：开方医生联系电话。</summary>
        public string placer_tel { get; set; } = string.Empty;

        /// <summary>必填：处方开立时间。</summary>
        public string recipe_time { get; set; } = string.Empty;

        /// <summary>必填：是否拆分发药，0-否，1-是。</summary>
        public int is_split { get; set; }

        /// <summary>必填：审方状态，0-不通过，1-通过。</summary>
        public int audit_recipe_status { get; set; }

        /// <summary>选填：审方备注。</summary>
        public string audit_recipe_remark { get; set; } = string.Empty;

        /// <summary>选填：诊断记录性质，门诊诊断传 2。</summary>
        public int record_prop { get; set; }

        /// <summary>选填：诊断次序。</summary>
        public string sno { get; set; } = string.Empty;

        /// <summary>选填：诊断编码，多个诊断使用顿号分隔。</summary>
        public string disease_code { get; set; } = string.Empty;

        /// <summary>必填：诊断名称，多个诊断使用顿号分隔。</summary>
        public string disease_name { get; set; } = string.Empty;

        /// <summary>必填：诊断开始时间。</summary>
        public string start_time { get; set; } = string.Empty;

        /// <summary>选填：诊断结束时间，门诊处方传空。</summary>
        public string end_time { get; set; } = string.Empty;

        /// <summary>必填：取药方式，0-配送，1-自提；当前按药房自提传 1。</summary>
        public int give_delivery_mode { get; set; }

        /// <summary>是否流转 0-是 1-否  </summary>
        public int is_circulate { get; set; }

        /// <summary>必填：处方药品明细。</summary>
        public List<MedicalRegionChronicRecipeUploadDetail> details { get; set; } = new List<MedicalRegionChronicRecipeUploadDetail>();
    }

    /// <summary>
    /// 区域平台慢病处方上传药品明细。
    /// 对应 M_DRUG_5002 的 details 数组项。
    /// </summary>
    public class MedicalRegionChronicRecipeUploadDetail
    {
        /// <summary>选填：业务系统医嘱标识，优先使用 ZLHIS 医嘱 ID。</summary>
        public string order_id { get; set; } = string.Empty;

        /// <summary>必填：处方内分组序号。</summary>
        public int group_sno { get; set; }

        /// <summary>必填：同一分组内的药品明细序号。</summary>
        public int sub_sno { get; set; }

        /// <summary>选填：组内标识，成组医嘱使用院内组号。</summary>
        public string group_symbol { get; set; } = string.Empty;

        /// <summary>必填：药品编码，按院内药品 ID 对照收费项目编码。</summary>
        public string drug_code { get; set; } = string.Empty;

        /// <summary>选填：医嘱内容，当前使用药品名称及规格。</summary>
        public string order_content { get; set; } = string.Empty;

        /// <summary>选填：给药途径编码，使用院内用法项目编码。</summary>
        public string give_route_code { get; set; } = string.Empty;

        /// <summary>选填：给药途径名称。</summary>
        public string give_route_name { get; set; } = string.Empty;

        /// <summary>必填：用药天数。</summary>
        public int use_days { get; set; }

        /// <summary>必填：用药频次。</summary>
        public string frequency { get; set; } = string.Empty;

        /// <summary>选填：单次服用容量，无容量数据时传 0。</summary>
        public decimal single_volume { get; set; }

        /// <summary>必填：总金额。本次仅同步处方，不处理费用，固定传 0。</summary>
        public decimal total_amount { get; set; }

        /// <summary>选填：剂量单位编码，当前无平台单位对照时传空。</summary>
        public string dose_unit_code { get; set; } = string.Empty;

        /// <summary>选填：剂量单位名称。</summary>
        public string dose_unit_name { get; set; } = string.Empty;

        /// <summary>选填：剂量单位换算系数。</summary>
        public decimal dose_unit_coefficient { get; set; }

        /// <summary>必填：单次用量。</summary>
        public decimal dose_single { get; set; }

        /// <summary>必填：整个用药周期的总剂量。</summary>
        public decimal dose_total { get; set; }

        /// <summary>选填：门诊单位编码，当前无平台单位对照时传空。</summary>
        public string outp_unit_code { get; set; } = string.Empty;

        /// <summary>选填：门诊单位名称。</summary>
        public string outp_unit_name { get; set; } = string.Empty;

        /// <summary>选填：门诊单位换算系数。</summary>
        public decimal outp_unit_coefficient { get; set; }

        /// <summary>选填：门诊单位基数。</summary>
        public int outp_unit_base { get; set; }

        /// <summary>选填：服药单位编码，当前无平台单位对照时传空。</summary>
        public string take_unit_code { get; set; } = string.Empty;

        /// <summary>选填：服药单位名称。</summary>
        public string take_unit_name { get; set; } = string.Empty;

        /// <summary>选填：服药单位换算系数。</summary>
        public decimal take_unit_coefficient { get; set; }

        /// <summary>选填：售价单位编码，当前无平台单位对照时传空。</summary>
        public string selling_price_unit_code { get; set; } = string.Empty;

        /// <summary>选填：售价单位名称。</summary>
        public string selling_price_unit_name { get; set; } = string.Empty;

        /// <summary>选填：售价单位数量。</summary>
        public decimal selling_price_unit_qty { get; set; }

        /// <summary>选填：给药顺序，使用院内医嘱序号。</summary>
        public string give_order { get; set; } = string.Empty;

        /// <summary>必填：发药方式，1-药房取药，2-自备药，3-外购。</summary>
        public int give_mode { get; set; }

        /// <summary>选填：滴速，无法转换为数字时传 0。</summary>
        public int drip_speed { get; set; }

        /// <summary>选填：超量说明。</summary>
        public string pass_dose_note { get; set; } = string.Empty;

        /// <summary>选填：用药原因。</summary>
        public string use_drug_reason { get; set; } = string.Empty;

        /// <summary>选填：使用嘱托。</summary>
        public string use_instruction { get; set; } = string.Empty;

        /// <summary>选填：用药目的。</summary>
        public string use_drug_purpose { get; set; } = string.Empty;

        /// <summary>选填：医嘱脚注。</summary>
        public string footnote { get; set; } = string.Empty;

        /// <summary>必填：开嘱时间。</summary>
        public string start_time { get; set; } = string.Empty;

        /// <summary>选填：停嘱时间，门诊处方传空。</summary>
        public string end_time { get; set; } = string.Empty;

        /// <summary>选填：皮试结果，1-阳性，0-阴性，-1-免试或未知。</summary>
        public int skin_test { get; set; }
    }

    /// <summary>
    /// 服务M_DRUG_4002出参
    /// </summary>
    public class M_DRUG_4002_Out
    {
        public MA_head_out head { get; set; }

        public List<M_DRUG_4002_Out_Item> data { get; set; }
    }

    /// <summary>
    /// 出参返回的价格明细
    /// </summary>
    public class M_DRUG_4002_Out_dts
    {
        /// <summary>
        /// 
        /// </summary>
        public string batch_lot { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string batch_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string manufacture_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string expiring_time { get; set; }
        /// <summary>
        /// 成本价
        /// </summary>
        public double? in_store_price { get; set; }
        /// <summary>
        /// 布洛芬缓释胶囊
        /// </summary>
        public string drug_name { get; set; }
        /// <summary>
        /// 药品规格id对应的收费项目编码
        /// </summary>
        public string drug_code { get; set; }
        /// <summary>
        /// 售价，单价，药品单价
        /// </summary>
        public double? price { get; set; }
    }

    public class M_DRUG_4002_Out_Item
    {
        /// <summary>
        /// 
        /// </summary>
        public string org_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string give_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string internal_give_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<M_DRUG_4002_Out_dts> detailModels { get; set; }
    }


    public class M_DRUG_4002_dts
    {
        /// <summary>
        /// 
        /// </summary>
        public string drug_code { get; set; }
        /// <summary>
        /// 葡萄糖注射液
        /// </summary>
        public string drug_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string strength { get; set; }
        /// <summary>
        /// 瓶
        /// </summary>
        public string unit { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string price { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? single { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? total_qty { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string decoction_method { get; set; }
        /// <summary>
        /// 无
        /// </summary>
        public string footnote { get; set; }
    }

    public class M_DRUG_4002_Item
    {
        /// <summary>
        /// 
        /// </summary>
        public string pre_check_no { get; set; }
        /// <summary>
        /// 中鑫区域分院
        /// </summary>
        public string give_org_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string give_org_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string internal_give_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? rec_prop { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string business_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pt_card_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pt_card_no { get; set; }
        /// <summary>
        /// 张三
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string id_card_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string id_card_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string bed_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string sex { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string age { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string birthday { get; set; }
        /// <summary>
        /// 内科
        /// </summary>
        public string placer_dept { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string storehouse_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string placer_dept_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string diagnosis_code_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string diagnosis_code { get; set; }
        /// <summary>
        /// 上呼吸道感染
        /// </summary>
        public string diagnosis_content { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string symptom_code { get; set; }
        /// <summary>
        /// 咳嗽、发热
        /// </summary>
        public string symptom_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string is_pregnant { get; set; }
        /// <summary>
        /// 口服
        /// </summary>
        public string usage_method { get; set; }
        /// <summary>
        /// 李医生
        /// </summary>
        public string placer { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string placer_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string placer_tel { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string create_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? package { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string freq { get; set; }
        /// <summary>
        /// 常规配方
        /// </summary>
        public string formula_name { get; set; }
        /// <summary>
        /// 饭后服用
        /// </summary>
        public string entrust { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? give_count { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string org_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string dept_code { get; set; }
        /// <summary>
        /// 内科门诊
        /// </summary>
        public string place_dept { get; set; }
        /// <summary>
        /// 中鑫区域分院
        /// </summary>
        public string org_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string dispensing_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string contact_tel { get; set; }
        /// <summary>
        /// XX路XX号
        /// </summary>
        public string address { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string delivery_time_slot { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string fee_time { get; set; }
        /// <summary>
        /// 收费员小王
        /// </summary>
        public string operator_name_fee { get; set; }
        /// <summary>
        /// 发药员小张
        /// </summary>
        public string operator_name_send { get; set; }
        /// <summary>
        /// 门诊处方配送
        /// </summary>
        public string stream_remark { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? drug_status { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<M_DRUG_4002_dts> details { get; set; }
    }


    public class MA_head_in
    {
        /// <summary>
        /// 
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string request_timestamp { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string app_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string target_app_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string service_code { get; set; }

        public string timestamp { get; set; }
    }

    public class MA_head_out
    {
        /// <summary>
        /// 
        /// </summary>
        public string id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string target_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string timestamp { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int count { get; set; }
        /// <summary>
        /// 没有找到对应的账号
        /// </summary>
        public string msg { get; set; }
    }

    public class M_DRUG_8003_In
    {
        public M_DRUG_8003_In_Body body { get; set; }
    }

    public class M_DRUG_8003_In_Body    
    {
        /// <summary>
        /// 
        /// </summary>
        public string org_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string dept_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string user_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string drug_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<string> drug_code_list { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string room_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string keyword { get; set; }
    }


    /// <summary>
    /// 服务M_DRUG_8003出参
    /// </summary>
    public class M_DRUG_8003_Out
    {
        public MA_head_out head { get; set; }

        public List<M_DRUG_8003_Out_dataItem> data { get; set; }
    }

    public class M_DRUG_8003_Out_dataItem
    {
        /// <summary>
        /// 
        /// </summary>
        public string org_code { get; set; }
        /// <summary>
        /// 中鑫卫生院
        /// </summary>
        public string org_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string dept_code { get; set; }
        /// <summary>
        /// 中药房
        /// </summary>
        public string dept_name { get; set; }
        /// <summary>
        /// 药品编码
        /// </summary>
        public string drug_code { get; set; }
        /// <summary>
        /// 白花蛇舌草(*)
        /// </summary>
        public string drug_name { get; set; }
        /// <summary>
        /// 库存数量
        /// </summary>
        public decimal? store_number { get; set; }
        /// <summary>
        /// 占用数量
        /// </summary>
        public decimal? lock_store_number { get; set; }
        /// <summary>
        /// 价格 平均售价
        /// </summary>
        public double price { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string spec { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string unit { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string manufacturer { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string national_insurance_code { get; set; }
    }

}
