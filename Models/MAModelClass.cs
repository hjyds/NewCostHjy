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
