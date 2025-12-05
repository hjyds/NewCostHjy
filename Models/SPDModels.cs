using System.Collections.Generic;

namespace NewCostHjy.Models {

    /// <summary>
    /// 集成平对接SPD相关的模型
    /// </summary>
    public class SPDModels {
    }

    public class Ack_info {
        /// <summary>
        /// 
        /// </summary>
        public string exe_status { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string err_msg { get; set; }
    }

    public class Eisai_item_listItem {
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
    }

    public class InputJCPT {
        /// <summary>
        /// 
        /// </summary>
        public Ack_info ack_info { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<Eisai_item_listItem> eisai_item_list { get; set; }

        public string exe_status { get; set; }

        public List<SpdRollCheckPar> check_result { get; set; }

        public dynamic result { get; set; }
    }

    public class SpdRollCheckPar {
        /// <summary>
        /// 
        /// </summary>
        public string check_stat { get; set; } 
    }

    public class RootJCPT {
        /// <summary>
        /// 
        /// </summary>
        public InputJCPT input { get; set; }
    }
     
    public class Req_infoItem {
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
    }

    public class InputSPD {
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

    public class LabInputPar {
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
    public class SPDCallPar {
        /// <summary>
        /// 
        /// </summary>
        public InputSPD input { get; set; }
    }

    public class fee_info_6120 {
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

    public class fee_info_6121 {
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


}
