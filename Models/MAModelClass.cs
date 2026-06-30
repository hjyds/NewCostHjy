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


}
