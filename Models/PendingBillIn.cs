using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Globalization;
using System.Security.Permissions;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace NewCostHjy.Models {
    /// <summary>
    /// 待处理账单输入
    /// </summary>
    public class PendingBillIn {
        /// <summary>
        /// 病人ID
        /// </summary>
        [DisplayName("病人ID")]
        public string PatId { get; set; }

        /// <summary>
        /// 病人姓名
        /// </summary>
        [DisplayName("病人姓名")]
        public string PatName { get; set; }

        /// <summary>
        /// 病人性别
        /// </summary>
        [DisplayName("病人性别")]
        public string PatSex { get; set; }

        /// <summary>
        /// 病人性别编码
        /// </summary>
        [DisplayName("病人性别编码")]
        public string PatSexCode { get; set; }

        /// <summary>
        /// 出生日期
        /// </summary>
        [DisplayName("出生日期")]
        public DateTime? PatBirthdate { get; set; }

        /// <summary>
        /// 病人年龄
        /// </summary>
        [DisplayName("病人年龄")]
        public string PatAge { get; set; }

        /// <summary>
        /// 病人身份
        /// </summary>
        [DisplayName("病人身份")]
        public string PatIdentity { get; set; }

        /// <summary>
        /// 病人机构ID
        /// </summary>
        [DisplayName("病人机构ID")]
        public string PatOrgId { get; set; }

        /// <summary>
        /// 病人机构
        /// </summary>
        [DisplayName("病人机构")]
        public string PatOrg { get; set; }

        /// <summary>
        /// 病人院区ID
        /// </summary>
        [DisplayName("病人院区ID")]
        public string PatDistrictId { get; set; }

        /// <summary>
        /// 病人院区
        /// </summary>
        [DisplayName("病人院区")]
        public string PatDistrict { get; set; }

        /// <summary>
        /// 病人部门ID
        /// </summary>
        [DisplayName("病人部门ID")]
        public string PatDeptId { get; set; }

        /// <summary>
        /// 病人部门
        /// </summary>
        [DisplayName("病人部门")]
        public string PatDept { get; set; }

        /// <summary>
        /// 病人病区ID
        /// </summary>
        [DisplayName("病人病区ID")]
        public string PatWardId { get; set; }

        /// <summary>
        /// 病人病区
        /// </summary>
        [DisplayName("病人病区")]
        public string PatWard { get; set; }

        /// <summary>
        /// 病人来源系统
        /// </summary>
        [DisplayName("病人来源系统")]
        public string PatOriginSys { get; set; }

        /// <summary>
        /// 病人来源编码
        /// </summary>
        [DisplayName("病人来源编码")]
        public string PatOriginCode { get; set; }

        /// <summary>
        /// 病人来源ID
        /// </summary>
        [DisplayName("病人来源ID")]
        public string PatOriginId { get; set; }

        /// <summary>
        /// 结算主体编码
        /// </summary>
        [DisplayName("结算主体编码")]
        public string BalanceBodyCode { get; set; }

        /// <summary>
        /// 结算主体ID
        /// </summary>
        [DisplayName("结算主体ID")]
        public string BalanceBodyId { get; set; }

        /// <summary>
        /// 绿色通道
        /// </summary>
        [DisplayName("绿色通道")]
        public string GreenChannel { get; set; }

        /// <summary>
        /// 医保类别编码
        /// </summary>
        [DisplayName("医保类别编码")]
        public string InsureCategoryCode { get; set; }

        /// <summary>
        /// 医保类别
        /// </summary>
        [DisplayName("医保类别")]
        public string InsureCategory { get; set; }

        /// <summary>
        /// 险种类别编码
        /// </summary>
        [DisplayName("险种类别编码")]
        public string InsureTypeCategoryCode { get; set; }

        /// <summary>
        /// 险种类别
        /// </summary>
        [DisplayName("险种类别")]
        public string InsureTypeCategory { get; set; }

        /// <summary>
        /// 婴儿姓名
        /// </summary>
        [DisplayName("婴儿姓名")]
        public string InfantName { get; set; }

        /// <summary>
        /// 婴儿性别
        /// </summary>
        [DisplayName("婴儿性别")]
        public string InfantSex { get; set; }

        /// <summary>
        /// 婴儿性别编码
        /// </summary>
        [DisplayName("婴儿性别编码")]
        public string InfantSexCode { get; set; }

        /// <summary>
        /// 婴儿出生日期
        /// </summary>
        [DisplayName("婴儿出生日期")]
        public DateTime? InfantBirthdate { get; set; }

        /// <summary>
        /// 婴儿序号
        /// </summary>
        [DisplayName("婴儿序号")]
        public int? InfantSerialNumber { get; set; }

        /// <summary>
        /// 账单列表
        /// </summary>
        [DisplayName("账单列表")]
        public List<PendingSubBillIn> BillList { get; set; }
    }

    /// <summary>
    /// 待处理账单
    /// </summary>
    public class PendingSubBillIn {
        /// <summary>
        /// 账单号
        /// </summary>
        [DisplayName("账单号")]
        public string BillNo { get; set; }

        /// <summary>
        /// 发生机构ID
        /// </summary>
        [DisplayName("发生机构ID")]
        public string OccurOrgId { get; set; }

        /// <summary>
        /// 发生机构
        /// </summary>
        [DisplayName("发生机构")]
        public string OccurOrg { get; set; }

        /// <summary>
        /// 发生院区ID
        /// </summary>
        [DisplayName("发生院区ID")]
        public string OccurDistrictId { get; set; }

        /// <summary>
        /// 发生院区
        /// </summary>
        [DisplayName("发生院区")]
        public string OccurDistrict { get; set; }

        /// <summary>
        /// 发生部门Id
        /// </summary>
        [DisplayName("发生部门Id")]
        public string OccurDeptId { get; set; }

        /// <summary>
        /// 发生部门
        /// </summary>
        [DisplayName("发生部门")]
        public string OccurDept { get; set; }

        /// <summary>
        /// 发生人员ID
        /// </summary>
        [DisplayName("发生人员ID")]
        public string OccurPersonId { get; set; }

        /// <summary>
        /// 发生人员
        /// </summary>
        [DisplayName("发生人员")]
        public string OccurPerson { get; set; }

        /// <summary>
        /// 发生时间
        /// </summary>
        [DisplayName("发生时间")]
        public DateTime? OccurTime { get; set; }

        /// <summary>
        /// 开单时间
        /// </summary>
        [DisplayName("开单时间")]
        [JsonConverter(typeof(CustomDateTimeConverter))]
        public DateTime BillingTime { get; set; }

        /// <summary>
        /// 开单机构ID
        /// </summary>
        [DisplayName("开单机构ID")]
        public string BillingOrgId { get; set; }

        /// <summary>
        /// 开单机构
        /// </summary>
        [DisplayName("开单机构")]
        public string BillingOrg { get; set; }

        /// <summary>
        /// 开单院区ID
        /// </summary>
        [DisplayName("开单院区ID")]
        public string BillingDistrictId { get; set; }

        /// <summary>
        /// 开单院区
        /// </summary>
        [DisplayName("开单院区")]
        public string BillingDistrict { get; set; }

        /// <summary>
        /// 开单部门ID
        /// </summary>
        [DisplayName("开单部门ID")]
        public string BillingDeptId { get; set; }

        /// <summary>
        /// 开单部门
        /// </summary>
        [DisplayName("开单部门")]
        public string BillingDept { get; set; }

        /// <summary>
        /// 开单人员ID
        /// </summary>
        [DisplayName("开单人员ID")]
        public string BillingPersonId { get; set; }

        /// <summary>
        /// 开单人员
        /// </summary>
        [DisplayName("开单人员")]
        public string BillingPerson { get; set; }

        /// <summary>
        /// 账单来源编码
        /// </summary>
        [DisplayName("账单来源编码")]
        public string BillOriginCode { get; set; }

        /// <summary>
        /// 账单来源
        /// </summary>
        [DisplayName("账单来源")]
        public string BillOrigin { get; set; }

        /// <summary>
        /// 账单来源ID
        /// </summary>
        [DisplayName("账单来源ID")]
        public string BillOriginId { get; set; }

        /// <summary>
        /// 帐单状态 空或0-生效账单；1-未生效账单
        /// </summary>
        [DisplayName("账单状态")]
        public string BillStatusCode { get; set; }

        /// <summary>
        /// 保险病种编码
        /// </summary>
        [DisplayName("保险病种编码")]
        public string InsureDzTypeCode { get; set; }

        /// <summary>
        /// 保险病种
        /// </summary>
        [DisplayName("保险病种")]
        public string InsureDzType { get; set; }
         
        public string ExecuteDept { get; set; } //executeDept C	0	执行科室
        public string PatBedNo { get; set; } //patBedNo    C	0	病人当前入住的床位号 
        /// <summary>
        /// 卫材账单，发料部门ID
        /// </summary>
        [DisplayName("执行科室ID")]
        public string ExecuteDeptId { get; set; }

        /// <summary>
        /// 婴儿姓名
        /// </summary>
        [DisplayName("婴儿姓名")]
        public string InfantName { get; set; }

        /// <summary>
        /// 婴儿性别
        /// </summary>
        [DisplayName("婴儿性别")]
        public string InfantSex { get; set; }

        /// <summary>
        /// 婴儿性别编码
        /// </summary>
        [DisplayName("婴儿性别编码")]
        public string InfantSexCode { get; set; }

        /// <summary>
        /// 婴儿出生日期
        /// </summary>
        [DisplayName("婴儿出生日期")]
        public DateTime? InfantBirthdate { get; set; }

        /// <summary>
        /// 婴儿序号
        /// </summary>
        [DisplayName("婴儿序号")]
        public int? InfantSerialNumber { get; set; }

        /// <summary>
        /// 结算性质
        /// </summary>
        [DisplayName("结算性质")]
        public string BalanceProp { get; set; }

        /// <summary>
        /// 结算性质编码
        /// </summary>
        [DisplayName("结算性质编码")]
        public string BalancePropCode { get; set; }

        /// <summary>
        /// 账单诊断
        /// </summary>
        [DisplayName("账单诊断")]
        public List<BillDiagnoseIn> BillDiagnose { get; set; }

        /// <summary>
        /// 账单内容
        /// </summary>
        [DisplayName("账单内容")]
        public List<BillContentIn> BillContent { get; set; }
    }

    /// <summary>
    /// 待处理账单内容输入
    /// </summary>
    public class BillContentIn {
        ///<summary>
        ///账单明细ID
        ///</summary>
        [DisplayName("账单明细ID")]
        public string BillDetailsId { get; set; }

        ///<summary>
        ///医嘱ID
        ///</summary>
        [DisplayName("医嘱ID")]
        public string OrderId { get; set; }

        ///<summary>
        ///收费项目类别编码
        ///</summary>
        [DisplayName("收费项目类别编码")]
        public string ChargesCategoryCode { get; set; }

        ///<summary>
        ///收费项目类别
        ///</summary>
        [DisplayName("收费项目类别")]
        public string ChargesCategory { get; set; }

        ///<summary>
        ///收费项目ID
        ///</summary>
        [DisplayName("收费项目ID")]
        public string ChargesId { get; set; }

        ///<summary>
        ///收费项目名称
        ///</summary>
        [DisplayName("收费项目名称")]
        public string ChargesName { get; set; }

        ///<summary>
        ///规格
        ///</summary>
        [DisplayName("规格")]
        public string Spec { get; set; }

        ///<summary>
        ///收入项目ID
        ///</summary>
        [DisplayName("收入项目ID")]
        public string IncomeCode { get; set; }

        ///<summary>
        ///收入项目
        ///</summary>
        [DisplayName("收入项目")]
        public string Income { get; set; }

        ///<summary>
        ///收据费目编码
        ///</summary>
        [DisplayName("收据费目编码")]
        public string ReceiptfeeCode { get; set; }

        ///<summary>
        ///收据费目
        ///</summary>
        [DisplayName("收据费目")]
        public string Receiptfee { get; set; }

        ///<summary>
        ///数量
        ///</summary>
        [DisplayName("数量")]
        public decimal Quantity { get; set; }

        ///<summary>
        ///单位
        ///</summary>
        [DisplayName("单位")]
        public string Unit { get; set; }

        ///<summary>
        ///单价
        ///</summary>
        [DisplayName("单价")]
        public decimal Price { get; set; }

        ///<summary>
        ///序号
        ///</summary>
        [DisplayName("序号")]
        public int SerialNumber { get; set; }

        /// <summary>
        /// 医保审批信息
        /// </summary>
        [DisplayName("医保审批信息")]
        public string InsuranceApprovalMsg { get; set; }

        public string OrderText { get; set; } //orderText C	0	医嘱内容
        public string AdditiveItem { get; set; } //additiveItem    C	0	附加项目                                                           
        public string InsideBarCode { get; set; }  //InsideBarCode   C 条码
        public List<BillCFeeMarks> FeeMarks { get; set; }//FeeMarks[]  Json数组	0	费用标记项目列表
    }

    public class BillCFeeMarks {
        /// <summary>
        /// 标记项ID
        /// </summary>
        [DisplayName("标记项ID")]
        public string ItemId { get; set; }

        /// <summary>
        /// 标记项名称
        /// </summary>
        [DisplayName("标记项名称")]
        public string ItemName { get; set; }

        /// <summary>
        /// 标记值
        /// </summary>
        [DisplayName("标记值")]
        public string ItemValue { get; set; }
    }

    /// <summary>
    /// 待处理账单诊断输入
    /// </summary>
    public class BillDiagnoseIn {
        /// <summary>
        /// 诊断ID
        /// </summary>
        [DisplayName("诊断ID")]
        public string DiagnoseId { get; set; }

        /// <summary>
        /// 诊断名称
        /// </summary>
        [DisplayName("诊断名称")]
        public string DiagnoseName { get; set; }
    }

    /// <summary>
    /// 删除账单输入
    /// </summary>
    public class DelBillIn {
        /// <summary>
        /// 发生机构ID
        /// </summary>
        [DisplayName("发生机构ID")]
        public string OccurOrgId { get; set; }

        /// <summary>
        /// 发生机构
        /// </summary>
        [DisplayName("发生机构")]
        public string OccurOrg { get; set; }

        /// <summary>
        /// 发生院区ID
        /// </summary>
        [DisplayName("发生院区ID")]
        public string OccurDistrictId { get; set; }

        /// <summary>
        /// 发生院区
        /// </summary>
        [DisplayName("发生院区")]
        public string OccurDistrict { get; set; }

        /// <summary>
        /// 发生部门Id
        /// </summary>
        [DisplayName("发生部门Id")]
        public string OccurDeptId { get; set; }

        /// <summary>
        /// 发生部门
        /// </summary>
        [DisplayName("发生部门")]
        public string OccurDept { get; set; }

        /// <summary>
        /// 发生人员ID
        /// </summary>
        [DisplayName("发生人员ID")]
        public string OccurPersonId { get; set; }

        /// <summary>
        /// 发生人员
        /// </summary>
        [DisplayName("发生人员")]
        public string OccurPerson { get; set; }

        /// <summary>
        /// 账单列表
        /// </summary>
        [DisplayName("账单列表")]
        public List<DelBillListIn> BillList { get; set; }
    }

    /// <summary>
    /// 删除账单列表
    /// </summary>
    public class DelBillListIn {
        /// <summary>
        /// 账单号
        /// </summary>
        [DisplayName("账单号")]
        public string BillNo { get; set; }
        /// <summary>
        /// 账单内容
        /// </summary>
        [DisplayName("账单内容")]
        public List<DelBillContentIn> BillContent { get; set; }

        /// <summary>
        /// 账单来源编码
        /// </summary>
        [DisplayName("账单来源编码")]
        public string BillOriginCode { get; set; }

        /// <summary>
        /// 账单来源ID
        /// </summary>
        [DisplayName("账单来源ID")]
        public string BillOriginId { get; set; }


        /// <summary>
        /// 开单时间，日期格式 2023-03-31 17:39:00
        /// </summary>
        [DisplayName("开单时间")]
        [JsonConverter(typeof(CustomDateTimeConverter))]
        public string BillingTime { get; set; }

    }

    /// <summary>
    /// 删除账单内容
    /// </summary>
    public class DelBillContentIn {
        ///<summary>
        ///账单明细ID
        ///</summary>
        [DisplayName("账单明细ID")]
        public string BillDetailsId { get; set; }
        ///<summary>
        ///数量
        ///</summary>
        [DisplayName("数量")]
        public decimal? Quantity { get; set; }
    }

    /// <summary>
    /// 修改账单输入参数
    /// </summary>
    public class ModifyBillIn {
        ///<summary>
        ///作废账单
        ///</summary>
        [DisplayName("作废账单")]
        public DelBillIn DelBill { get; set; }

        ///<summary>
        ///新增账单
        ///</summary>
        [DisplayName("新增账单")]
        public PendingBillIn NewBill { get; set; }
    }

    /// <summary>
    /// 批量记账账单
    /// </summary>
    public class MultiPendingBillIn {
        /// <summary>
        /// 批量记账病人列表
        /// </summary>
        public List<PendingBillIn> PendingBillInList { get; set; }

        /// <summary>
        /// 账单列表
        /// </summary>
        [DisplayName("账单列表")]
        public List<PendingSubBillIn> BillList { get; set; }
    }


    /// <summary>
    /// 值集值输出
    /// </summary>
    public class ValueSetValueOut {
        ///<summary>
        ///值集值说明
        ///<summary>
        public string ValueSetValueNote { get; set; }

        ///<summary>
        ///值集值编码
        ///<summary>
        public string ValueSetValueCode { get; set; }

        ///<summary>
        ///值集值状态编码
        ///<summary>
        public string ValueSetValueStatusCode { get; set; }

        ///<summary>
        ///值集值名称
        ///<summary>
        public string ValueSetValueName { get; set; }

        ///<summary>
        ///值集值ID
        ///<summary>
        public string ValueSetValueId { get; set; }

        ///<summary>
        ///值集值序号
        ///<summary>
        public int ValueSetValueSno { get; set; }

        ///<summary>
        ///值集ID
        ///<summary>
        public string ValueSetId { get; set; }

        ///<summary>
        ///值集值状态名称
        ///<summary>
        public string ValueSetValueStatus { get; set; }
    }

    /// <summary>
    /// 新增账单出参
    /// </summary>
    public class NewBillOut {
        /// <summary>
        /// 账单号
        /// </summary>
        [DisplayName("账单号")]
        public string BillNo { get; set; }

        /// <summary>
        /// 账单支付状态编码
        /// </summary>
        [DisplayName("账单支付状态编码")]
        public string BillPayStatusCode { get; set; }
    }

    /// <summary>
    ///预警规则执行结果-匹配时
    /// </summary>
    public class WarningRuleResultOut {
        /// <summary>
        /// 病人ID
        /// </summary>
        [DisplayName("病人ID")]
        public string PatId { get; set; }

        /// <summary>
        /// 规则内容描述
        /// </summary>
        [DisplayName("规则内容描述")]
        public string RuleContentText { get; set; }

        /// <summary>
        /// 规则结果
        /// </summary>
        [DisplayName("规则结果")]
        public string RuleResultValue { get; set; }

        /// <summary>
        /// 规则结果编码
        /// </summary>
        [DisplayName("规则结果编码")]
        public int RuleResultValueCode { get; set; }

        /// <summary>
        /// 累计费用
        /// </summary>
        [DisplayName("累计费用")]
        public decimal CumulativeCost { get; set; }

        /// <summary>
        /// 当日费用
        /// </summary>
        [DisplayName("当日费用")]
        public decimal DayCost { get; set; }

        /// <summary>
        /// 可用余额
        /// </summary>
        [DisplayName("可用余额")]
        public decimal UsableSurplus { get; set; }


    }

    /// <summary>
    /// 医嘱账单号
    /// </summary>
    public class OrderBillNoIn {
        /// <summary>
        /// 账单号
        /// </summary>
        [DisplayName("账单号")]
        public string BillNo { get; set; }

        /// <summary>
        /// 医嘱ID，可多个
        /// </summary>
        [DisplayName("医嘱ID")]
        public string OrderIds { get; set; }

        /// <summary>
        /// 医嘱ID
        /// </summary>
        [DisplayName("医嘱ID")]
        public string OrderId { get; set; }
    }

    /// <summary>
    /// 医嘱对应的新费用明细
    /// </summary>
    public class OrderNewFeeInfo {
        /// <summary>
        /// 医嘱
        /// </summary>
        public int order_id { get; set; }
        /// <summary>
        /// 发送号
        /// </summary>
        public int advice_send_number { get; set; }
        /// <summary>
        /// 单据号
        /// </summary>
        public string fee_no { get; set; }
        /// <summary>
        /// 记录性质,2
        /// </summary>
        public int bill_prop { get; set; }
        /// <summary>
        /// 执行状态 0
        /// </summary>
        public int rec_state { get; set; }
        /// <summary>
        /// 费用状态 1
        /// </summary>
        public int fee_state { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string exe_state { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string exe_dept_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string exe_dept_name { get; set; }
        /// <summary>
        /// 费用id
        /// </summary>
        public int fee_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string fee_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int fee_item_id { get; set; }
        /// <summary>
        /// X线计算机体层（CT）扫描10层以上，螺旋加收
        /// </summary>
        public string fee_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int serial { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal price { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string spec { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal nums { get; set; }
        /// <summary>
        /// 剩余数量
        /// </summary>
        public decimal quantity { get; set; }
        /// <summary>
        /// 层
        /// </summary>
        public string unit { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string exe_people { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string exe_time { get; set; }
        /// <summary>
        /// 应收金额
        /// </summary>
        public decimal receivable { get; set; }
        /// <summary>
        /// 实收金额
        /// </summary>
        public decimal received { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string billStatusCode { get; set; }
        /// <summary>
        /// 已记账
        /// </summary>
        public string billStatus { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string green_channel { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string registration_time { get; set; }
        /// <summary>
        /// 普通
        /// </summary>
        public string patIdentity { get; set; }
        /// <summary>
        /// CT室
        /// </summary>
        public string billingDept { get; set; }
        /// <summary>
        /// 管理员
        /// </summary>
        public string billingPerson { get; set; }
        /// <summary>
        /// 消化内科病房
        /// </summary>
        public string patWard { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string trade_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string producer { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string billOriginCode { get; set; }
        /// <summary>
        /// CT检查
        /// </summary>
        public string order_content { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string patOriginCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string balanceTime { get; set; }
    }

    /// <summary>
    /// 病人就诊信息
    /// </summary>
    public class PatientVisit {
        /// <summary>
        /// 病人ID
        /// </summary>
        [DisplayName("病人ID")]
        public string PatId { get; set; }

        /// <summary>
        /// 病人来源(01-门诊,02-住院,03-体检)
        /// </summary>
        [DisplayName("病人来源")]
        public string PatOrigin { get; set; }

        /// <summary>
        /// 病人来源ID
        /// </summary>
        [DisplayName("病人来源ID")]
        public string PatOriginId { get; set; }
    }

    /// <summary>
    /// 病人就诊信息输入
    /// </summary>
    public class PatientVisitIn : PatientVisit {
        /// <summary>
        /// 险类
        /// </summary>
        [DisplayName("险类")]
        public string InsuranceCategory { get; set; }


        /// <summary>
        /// 费用开始时间
        /// </summary>
        [DisplayName("费用开始时间")]
        public DateTime? StartTime { get; set; }

        /// <summary>
        /// 费用结束时间
        /// </summary>
        [DisplayName("费用结束时间")]
        public DateTime? EndTime { get; set; }

        /// <summary>
        /// 查询天数
        /// </summary>
        [DisplayName("查询天数")]
        public int? QueryDays { get; set; }

        /// <summary>
        /// 查询医保预结明细
        /// </summary>
        [DisplayName("查询医保预结明细")]
        public bool QueryInsure { get; set; }
    }

    /// <summary>
    /// 病人剩余款概况
    /// </summary>
    public class PatiRemainMoneyOut {
        /// <summary>
        /// 可用余额：预交余额+担保余额+存款金额+分配金额+医保预结金额
        /// </summary>
        [DisplayName("可用余额")]
        public decimal UsableMoney { get; set; }

        /// <summary>
        /// 担保额：给病人的担保金额
        /// </summary>
        [DisplayName("担保额")]
        public decimal GuaranteeMoney { get; set; }

        /// <summary>
        /// 担保余额
        /// </summary>
        [DisplayName("担保余额")]
        public decimal SurplusGuarantee { get; set; }

        /// <summary>
        /// 预交金额：预交款余额+未结费用中已记帐金额
        /// </summary>
        [DisplayName("预交金额")]
        public decimal PrepayMoney { get; set; }

        /// <summary>
        /// 存款金额
        /// </summary>
        [DisplayName("存款金额")]
        public decimal DepositMoney { get; set; }

        /// <summary>
        /// 分配金额
        /// </summary>
        [DisplayName("分配金额")]
        public decimal AllotMoney { get; set; }

        /// <summary>
        /// 未结金额
        /// </summary>
        [DisplayName("未结金额")]
        public decimal NobalanceMoney { get; set; }

        /// <summary>
        /// 医保预结金额
        /// </summary>
        [DisplayName("医保预结金额")]
        public decimal InsurePreBalanceMoney { get; set; }

        /// <summary>
        /// 医保预结
        /// </summary>
        [DisplayName("医保预结")]
        public List<InsuranceBudgetDetailOut> InsuranceBudgetDetails { get; set; }

        /// <summary>
        /// 预交款余额
        /// </summary>
        [DisplayName("预交款余额")]
        public decimal Prepay { get; set; }

        /// <summary>
        /// 未结费用中已记帐金额
        /// </summary>
        [DisplayName("未结费用中已记帐金额")]
        public decimal Accounted { get; set; }

        /// <summary>
        /// 未结费用中已担保金额
        /// </summary>
        [DisplayName("未结费用中已担保金额")]
        public decimal Guaranteed { get; set; }

        /// <summary>
        /// 未结费用中未支付金额
        /// </summary>
        [DisplayName("未结费用中未支付金额")]
        public decimal Nopay { get; set; }
    }


    /// <summary>
    /// 批量病人剩余款概况
    /// </summary>
    public class BatchPatiRemainMoneyOut : PatiRemainMoneyOut {
        /// <summary>
        /// 病人ID
        /// </summary>
        [DisplayName("病人ID")]
        public string PatId { get; set; }

        /// <summary>
        /// 病人来源(01-门诊,02-住院,03-体检)
        /// </summary>
        [DisplayName("病人来源")]
        public string PatOrigin { get; set; }

        /// <summary>
        /// 病人来源ID
        /// </summary>
        [DisplayName("病人来源ID")]
        public string PatOriginId { get; set; }
    }

    /// <summary>
    /// 计算账单内容实收金额输出
    /// </summary>
    public class CalcBillContentReceivedOut {
        /// <summary>
        /// 账单号
        /// </summary>
        [DisplayName("账单号")]
        public string BillNo { get; set; }

        ///<summary>
        ///账单应收金额
        ///</summary>
        [DisplayName("账单应收金额")]
        public decimal BillReceivable { get; set; }

        ///<summary>
        ///账单实收金额
        ///</summary>
        [DisplayName("账单实收金额")]
        public decimal BillReceived { get; set; }

        ///<summary>
        ///结算实收金额
        ///</summary>
        [DisplayName("结算实收金额")]
        public decimal BalanceReceived { get; set; }

        /// <summary>
        /// 账单列表
        /// </summary>
        [DisplayName("账单列表")]
        public List<CalcBillContentReceivedSubOut> BillList { get; set; }
    }

    /// <summary>
    /// 计算账单内容实收金额内容输出
    /// </summary>
    public class CalcBillContentReceivedSubOut {
        ///<summary>
        ///账单明细ID
        ///</summary>
        [DisplayName("账单明细ID")]
        public string BillDetailsId { get; set; }

        ///<summary>
        ///序号
        ///</summary>
        [DisplayName("序号")]
        public int SerialNumber { get; set; }

        ///<summary>
        ///收费项目ID
        ///</summary>
        [DisplayName("收费项目ID")]
        public string ChargesId { get; set; }

        ///<summary>
        ///应收金额
        ///</summary>
        [DisplayName("应收金额")]
        public decimal Receivable { get; set; }

        ///<summary>
        ///实收金额
        ///</summary>
        [DisplayName("实收金额")]
        public decimal Received { get; set; }

        ///<summary>
        ///结算实收金额
        ///</summary>
        [DisplayName("结算实收金额")]
        public decimal BalanceReceived { get; set; }
    }

    /// <summary>
    /// 医保预结算明细
    /// </summary>
    public class InsuranceBudgetDetailOut : InsuranceBudgetDetail {
        /// <summary>
        /// 预结算时间
        /// </summary>
        [DisplayName("预结算时间")]
        public DateTime InsuranceBudgetDate { get; set; }
    }


    /// <summary>
    /// 医保预结算明细
    /// </summary>
    public class InsuranceBudgetDetail {
        /// <summary>
        /// 类别
        /// </summary>
        [DisplayName("类别")]
        public string Category { get; set; }

        /// <summary>
        /// 金额
        /// </summary>
        [DisplayName("金额")]
        public decimal Amount { get; set; }

        /// <summary>
        /// 支付类型|1-收，-1-支
        /// </summary>
        [DisplayName("支付类型")]
        public string PayType { get; set; }

        /// <summary>
        /// 支付类型编码|1-收，-1-支
        /// </summary>
        [DisplayName("支付类型编码")]
        public int PayTypeCode { get; set; }
    }

    /// <summary>
    /// 校验后的提示信息
    /// </summary>
    public class CheckOutTip {

        /// <summary>
        /// 1-提醒，2-询问，3-禁止
        /// </summary>
        public string PromptCode { get; set; }

        /// <summary>
        /// 提示内容
        /// </summary>
        public string PromptContent { get; set; }
    }

 

    public class ChargecategoryinfoItem {
        /// <summary>
        /// 
        /// </summary>
        public string chargecategory_code { get; set; }
        /// <summary>
        /// 西成药
        /// </summary>
        public string chargecategory_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public double chargecategory_amrcvb { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public double chargecategory_ampaib { get; set; }
    }

    /// <summary>
    /// 获取账单汇总信息出参模型
    /// </summary>
    public class BillTotalInfoOut {
        /// <summary>
        /// 
        /// </summary>
        public double fee_amrcvb { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public double fee_ampaib { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public double drug_amrcvb { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public double drug_ampaib { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<ChargecategoryinfoItem> chargecategoryinfo { get; set; }
    }
    /// <summary>
    /// 获取账单汇总信息出参模型
    /// </summary>
    public class BillTotalInfoIn {
        public string billNos { get; set; }
    }

    /// <summary>
    /// GetOrderBillStatus 出参
    /// </summary>
    public class OrderBillStatusOut {
        /// <summary>
        /// 
        /// </summary>
        public string OrderId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillPayStatusCode { get; set; }
        /// <summary>
        /// 未支付
        /// </summary>
        public string BillPayStatus { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillStatusCode { get; set; }
        /// <summary>
        /// 不存在
        /// </summary>
        public string BillStatus { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string GreenChannel { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BalancePropCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BalanceProp { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal Receivable { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal Received { get; set; }
    }

    public class OrderBillNosItem {
        /// <summary>
        /// 
        /// </summary>
        public string orderId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string billNo { get; set; }
    }

    public class OperateInfo {
        /// <summary>
        /// 中联医院信息系统（测试）
        /// </summary>
        public string OrganizationId { get; set; }
        /// <summary>
        /// 中联医院信息系统（测试）
        /// </summary>
        public string Organization { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DistrictId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string District { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string DeptId { get; set; }
        /// <summary>
        /// 中心检验室
        /// </summary>
        public string Dept { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string OperatorId { get; set; }
        /// <summary>
        /// 张永康
        /// </summary>
        public string @Operator { get; set; }
    }
    public class GetChargeOffApplyByAuditDept_In {
        public string auditDeptId { get; set; }
        public string applyStatus { get; set; }
    }

    public class GetChargeOffApplyByAuditDept_Out {
        /// <summary>
        /// 
        /// </summary>
        public string BillVoidId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ApplyTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ApplyDeptId { get; set; }
        /// <summary>
        /// 消化内科病房
        /// </summary>
        public string ApplyDept { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ApplyPersonId { get; set; }
        /// <summary>
        /// 管理员
        /// </summary>
        public string ApplyPerson { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AuditTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AuditDeptId { get; set; }
        /// <summary>
        /// 消化内科
        /// </summary>
        public string AuditDept { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AuditPersonId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AuditPerson { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PatId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PatOriginCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PatOriginId { get; set; }
        /// <summary>
        /// 刁敏
        /// </summary>
        public string PatName { get; set; }
        /// <summary>
        /// 女
        /// </summary>
        public string PatSex { get; set; }
        /// <summary>
        /// 30岁
        /// </summary>
        public string PatAge { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillNo { get; set; }
        /// <summary>
        /// 消化内科
        /// </summary>
        public string BillingDept { get; set; }
        /// <summary>
        /// 管理员
        /// </summary>
        public string BillingPerson { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillingTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string OccurTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillDetailsId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ChargesCategoryCode { get; set; }
        /// <summary>
        /// 治疗
        /// </summary>
        public string ChargesCategory { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ChargesId { get; set; }
        /// <summary>
        /// 静脉输液
        /// </summary>
        public string ChargesName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string Spec { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? Quantity { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? BillVoidAuditQunt { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? OldQuantity { get; set; }
        /// <summary>
        /// 组
        /// </summary>
        public string Unit { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? Price { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? Receivable { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? Received { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillVoidExplain { get; set; }
        /// <summary>
        /// 已申请
        /// </summary>
        public string BillVoidStatus { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillVoidStatusCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string IdentityNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PatBedNo { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string OrderId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillStatusCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillStatus { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillVoidExecuteStatusCode { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? ActualQuantity { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? ActualReceived { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string RefundBillId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillVoidAuditPersonId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillVoidAuditPerson { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillVoidAuditTime { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string BillVoidAuditRsn { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string ExecDeptId { get; set; }
        /// <summary>
        /// 消化内科病房
        /// </summary>
        public string ExecDept { get; set; }
    }


    /// <summary>
    /// API服务的出参模型
    /// </summary>
    public class GetBillDetailInfoParOut {
        /// <summary>
        /// 
        /// </summary>
        public int bill_prop { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string bill_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string fee_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int fee_num { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int pat_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int page_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string iden_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pati_bed { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? price { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? fee_ampaid { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? packages_num { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public decimal? quantity { get; set; }
        /// <summary>
        /// 开单人管理员
        /// </summary>
        public string placer { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string operator_code { get; set; }
        /// <summary>
        /// 管理员
        /// </summary>
        public string operator_name { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string create_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string happen_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int rcp_type { get; set; }
        /// <summary>
        /// 普通
        /// </summary>
        public string fee_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int rec_status { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string register_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string register_no { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string register_time { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int income_item_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int fee_origin { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int bill_deptid { get; set; }
        /// <summary>
        /// 消化内科
        /// </summary>
        public string bill_dept { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int? order_id { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int fee_item_id { get; set; }
        /// <summary>
        /// 立体动态干扰电治疗
        /// </summary>
        public string fee_item { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string fee_item_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string fee_item_type { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string fee_item_insure_code { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string fee_status { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string billStatusCode { get; set; }
        /// <summary>
        /// 未支付
        /// </summary>
        public string billStatus { get; set; }
        /// <summary>
        /// 执行科室id
        /// </summary>
        public int? exe_deptid { get; set; }
        /// <summary>
        /// 执行科室名称，消化内科病房
        /// </summary>
        public string exe_dept { get; set; }
        /// <summary>
        /// 诊疗类别
        /// </summary>
        public string billOriginCode { get; set; }
        /// <summary>
        /// 医嘱内容立体动态干扰电治疗
        /// </summary>
        public string order_content { get; set; }
    }


    /// <summary>
    /// 入参
    /// </summary>
    public class CheckBillAllowExecuteIn {
        /// <summary>
        /// 
        /// </summary>
        public List<OrderBillNosItem> OrderBillNos { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public OperateInfo OperateInfo { get; set; }
    }

    public class CustomDateTimeConverter : JsonConverter<DateTime> {
        private static readonly string[] dateFormats = { "yyyy-MM-dd'T'HH:mm:ss'Z'", "yyyy-MM-dd HH:mm:ss" };

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateTime.ParseExact(reader.GetString(), dateFormats, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind);
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture));
        }
    }

}