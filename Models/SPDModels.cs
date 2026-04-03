using System;
using System.Collections.Generic;

namespace NewCostHjy.Models
{

    /// <summary>
    /// 集成平对接SPD相关的模型
    /// </summary>
    public class SPDModels
    {
    }

    public class Ack_info
    {
        /// <summary>
        /// 
        /// </summary>
        public string exe_status { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string err_msg { get; set; }
    }

    public class Eisai_item_listItem
    {
        /// <summary>
        /// 材料id
        /// </summary>
        public string eisai_item_id { get; set; }
        /// <summary>
        /// 材料名称
        /// </summary>
        public string eisai_item_name { get; set; }
        /// <summary>
        /// 材料规格
        /// </summary>
        public string eisai_item_spec { get; set; }
        /// <summary>
        /// 产地
        /// </summary>
        public string eisai_item_dprentp_name { get; set; }
        /// <summary>
        /// 成本价
        /// </summary>
        public string eisai_item_cost_price { get; set; }
        /// <summary>
        /// 零售价
        /// </summary>
        public string eisai_item_sales_price { get; set; }
        /// <summary>
        /// 库房id
        /// </summary>
        public string eisai_item_store_id { get; set; }
        /// <summary>
        /// 库存量
        /// </summary>
        public string eisai_item_store_qunt { get; set; }
        /// <summary>
        /// 条码
        /// </summary>
        public string eisai_barcode { get; set; }

        /// <summary>
        /// 批次信息
        /// </summary>
        List<SPDBatchSplit> eisai_batch_list { get; set; }

    }

    /// <summary>
    /// 批次明细对象，返回的
    /// </summary>
    public class SPDBatchSplit {

        /// <summary>
        /// 批次
        /// </summary>
        public string eisai_batch { get; set; }

        /// <summary>
        /// 批次数量
        /// </summary>
        public decimal? eisai_item_store_qunt { get; set; }

        /// <summary>
        /// 成本价
        /// </summary>
        public decimal? eisai_item_cost_price { get; set; }
        /// <summary>
        /// 零售价
        /// </summary>
        public decimal? eisai_item_sales_price { get; set; }
    }

    public class InputJCPT
    {
        /// <summary>
        /// 
        /// </summary>
        public Head head { get; set; }        

        /// <summary>
        /// 
        /// </summary>
        public Ack_info ack_info { get; set; }

        public dynamic data { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<Eisai_item_listItem> eisai_item_list { get; set; }

        public string exe_status { get; set; }

        public List<SpdRollCheckPar> check_result { get; set; }

        public dynamic result { get; set; }
    }

    public class AppAttachmentDataOut
    {
        public string element_name { get; set; } //": "要素名称",
        public string element_value { get; set; } //": "要素值"
    }



    public class SpdRollCheckPar
    {
        /// <summary>
        /// 
        /// </summary>
        public string check_stat { get; set; }
    }

    /// <summary>
    /// 标准服务平台接口
    /// </summary>
    public class RootJCPT
    {
        /// <summary>
        /// 
        /// </summary>
        public InputJCPT input { get; set; }
    }

    public class Req_infoItem
    {
        /// <summary>
        /// 
        /// </summary>
        public string eisai_barcode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string eisai_item_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string eisai_item_store_id { get; set; }

        /// <summary>
        /// 使用的数量，用于分批次
        /// </summary>
        public decimal? eisai_item_store_qunt { get; set; }

        /// <summary>
        /// 费用单据号，分批次的时候需要
        /// </summary>
        public string receipt_no { get; set; }
    }

    public class InputSPD
    {
        /// <summary>
        /// 
        /// </summary>
        public Head head { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<Req_infoItem> req_info { get; set; }

        public LabInputPar para { get; set; }
    }

    public class LabInputPar
    {
        /// <summary>
        /// 
        /// </summary>
        public string sysCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pvid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string rpt_time_begin { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string rpt_time_end { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string labitem_id_his { get; set; }
        /// <summary>
        /// 临床
        /// </summary>
        public string call_source { get; set; }
    }

    /// <summary>
    /// 一般标准服务的入参通过模型
    /// </summary>
    public class SPDCallPar
    {
        /// <summary>
        /// 
        /// </summary>
        public InputSPD input { get; set; }
    }

    public class fee_info_6120
    {
        /// <summary>
        /// 
        /// </summary>
        public int fee_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int pid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string receipt_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int order_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int fee_item_id { get; set; }
        /// <summary>
        /// SPD高值条码卫材
        /// </summary>
        public string fee_item_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal fee_count { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal fee_price { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string eisai_barcode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? exe_dept_id { get; set; }
    }

    public class fee_info_6121
    {
        /// <summary>
        /// 
        /// </summary>
        public string pid { get; set; }
        /// <summary>
        /// 张三门诊
        /// </summary>
        public string pat_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pat_visit_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pvid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string rgst_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string inpno { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string receipt_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string apply_dept_id { get; set; }
        /// <summary>
        /// 产科门诊
        /// </summary>
        public string apply_dept_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string doctor_id { get; set; }
        /// <summary>
        /// 管理员
        /// </summary>
        public string doctor { get; set; }
        /// <summary>
        /// 普通
        /// </summary>
        public string fees_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string oprtr_id { get; set; }
        /// <summary>
        /// 管理员
        /// </summary>
        public string oprtr_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string oprtr_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string fee_id { get; set; }
        /// <summary>
        /// 西药费
        /// </summary>
        public string fees_item { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string fee_item_id { get; set; }
        /// <summary>
        /// SPD高值条码卫材
        /// </summary>
        public string fee_item_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string fee_item_type { get; set; }
        /// <summary>
        /// 个
        /// </summary>
        public string fee_item_unit { get; set; }
        /// <summary>
        /// SPD+条码
        /// </summary>
        public string fee_item_strength { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal fee_price { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal fee_count { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal should_money { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal actual_money { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string exe_dept_id { get; set; }
        /// <summary>
        /// 心内一科病房
        /// </summary>
        public string exe_dept_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string receipt_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string order_id { get; set; }
        /// <summary>
        /// SPD高值条码卫材 SPD+条码
        /// </summary>
        public string order_content { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string citem_id { get; set; }
        /// <summary>
        /// SPD高值条码卫材
        /// </summary>
        public string citem_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string eisai_barcode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int is_reserve { get; set; }
    }

    public class ParClass
    {
        public string Name { get; set; }
        public int Age { get; set; }
        public int Birth { get; set; }
    }

    /// <summary>
    /// 医保事前事中相关模型
    /// </summary>
    public class MIRC_S3139_Data
    {
        /// <summary>
        /// 
        /// </summary>
        public string pid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pvid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string inp_dept_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string trig_scen { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pat_visit_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string oper_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string node_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string dev_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string oprt_code { get; set; }
        /// <summary>
        /// 张永康
        /// </summary>
        public string oprt_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<MIRC_S3139_OderDetail> order_info { get; set; }
    }

    /// <summary>
    /// 医保事前事中相关模型医嘱
    /// </summary>
    public class MIRC_S3139_OderDetail
    {
        /// <summary>
        /// 医疗类别
        /// </summary>
        public string health_category { get; set; }

        /// <summary>
        /// 病种ID
        /// </summary>
        public string disease_id { get; set; }

        /// <summary>
        /// 医嘱ID
        /// </summary>
        public string order_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pres_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string apply_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public long? fee_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string order_expidate_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string feeitem_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int sdisdtl_qunt { get; set; }
        /// <summary>
        /// 次
        /// </summary>
        public string sdisdtl_unit { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? unit_price { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? total_money { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? order_start_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public DateTime? order_end_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string apply_dept_id { get; set; }
        /// <summary>
        /// 内科
        /// </summary>
        public string apply_dept_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string placer_id { get; set; }
        /// <summary>
        /// 张永康
        /// </summary>
        public string placer_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string day_amout { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string is_order_falg { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string order_once_qunt { get; set; }
        /// <summary>
        /// 一次性
        /// </summary>
        public string frequency { get; set; }
    }

    /// <summary>
    /// 医保事前事中反回值对象
    /// </summary>
    public class Vola_detail_infoItem
    {
        /// <summary>
        /// 
        /// </summary>
        public string vola_item_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string patn_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pat_visit_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string order_id { get; set; }
        /// <summary>
        /// 违规项
        /// </summary>
        public string vola_item_type { get; set; }
        /// <summary>
        /// 违规金额
        /// </summary>
        public double? vola_amt { get; set; }
        /// <summary>
        /// 药品费用
        /// </summary>
        public string transaction_type { get; set; }
    }

    /// <summary>
    /// 医保事前事中返回值对象
    /// </summary>
    public class MIRC_OUTPUT_Item
    {
        /// <summary>
        /// 
        /// </summary>
        public string vola_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string rule_id { get; set; }
        /// <summary>
        /// 重复开药检测规则
        /// </summary>
        public string rule_name { get; set; }
        /// <summary>
        /// 同一患者在短时间内重复开具相同药品
        /// </summary>
        public string vola_content { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pat_visit_no { get; set; }
        /// <summary>
        /// 违规金额
        /// </summary>
        public double? vola_amt { get; set; }
        /// <summary>
        /// 正常
        /// </summary>
        public string vola_amt_stas { get; set; }
        /// <summary>
        /// 明确违规
        /// </summary>
        public string sev_deg { get; set; }
        /// <summary>
        /// 患者于2024-01-10和2024-01-12重复开具相同药品阿托伐他汀
        /// </summary>
        public string vola_evid { get; set; }
        /// <summary>
        /// 行为类
        /// </summary>
        public string vola_bhvr_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string task_id { get; set; }
        /// <summary>
        /// 此结点值是否存在 =1 限制了界面录入框的可见性和必填性，1-可见且必填，0-不可见且非必填,0/1 是否需要调用3103进行反馈，1-是，0-否
        /// </summary>
        public int is_feedback { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<Vola_detail_infoItem> vola_detail_info { get; set; }
    }
}
