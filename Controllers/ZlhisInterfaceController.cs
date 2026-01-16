using Microsoft.AspNetCore.Mvc; 
using NewCostHjy.Common;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using testWeb.BLL;
using static MongoDB.Driver.WriteConcern;

namespace NewCostHjy.Controllers {
    /// <summary>
    /// web费用相关
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ZlhisInterfaceController : BaseController {

        private ZlhisInterfaceBLL zlhisInterfaceBLL = new ZlhisInterfaceBLL();

        #region WEB费用系统的接口相关API提供给外部系统的服务
        /// <summary>
        /// 返回账单号，如果多个英文逗号分隔
        /// </summary>
        /// <param name="quantity"></param>
        /// <returns></returns>
        [HttpPost("GetBillNO")]
        public IActionResult GetBillNO([FromBody] int quantity)
        {
            var result = zlhisInterfaceBLL.GetNextIdOrNo(Const.HisNoOrIdType.FeeNo, quantity);
            zlhisInterfaceBLL.NewCostApiLog("GetBillNO", Newtonsoft.Json.JsonConvert.SerializeObject(quantity));
            return Json(result);
        }

        /// <summary>
        /// 返回账单明细ID，如果多个英文逗号分隔"
        /// </summary>
        /// <param name="quantity"></param>
        /// <returns></returns>
        [HttpPost("GetBillDetailId")]
        public IActionResult GetBillDetailId([FromBody] int quantity)
        {
            var result = zlhisInterfaceBLL.GetNextIdOrNo(Const.HisNoOrIdType.FeeId, quantity);
            zlhisInterfaceBLL.NewCostApiLog("GetBillDetailId", Newtonsoft.Json.JsonConvert.SerializeObject(quantity));
            return Json(result);
        }

        /// <summary>
        /// 新增账单时预警
        /// </summary>
        /// <param name="pendingBillIn"></param>
        /// <returns></returns>
        [HttpPost("NewBillEarlyWarning")]
        public IActionResult NewBillEarlyWarning([FromBody] PendingBillIn parIn)
        {
            //CostControlBLL costControlBLL = new CostControlBLL();
            //var result = costControlBLL.NewBillEarlyWarning(pendingBillIn);
            zlhisInterfaceBLL.NewCostApiLog("NewBillEarlyWarning", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            WarningRuleResultOut resultOut = new WarningRuleResultOut();
            return Json(resultOut);
        }

        /// <summary>
        /// 退费申请的时候能用到
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetChargeOffApplyByPati")]
        public IActionResult GetChargeOffApplyByPati([FromBody] dynamic parIn)
        {
            return Json(new List<string>());
        }
        /// <summary>
        /// 新增账单
        /// </summary>
        /// <param name="pendingBillIn"></param>
        /// <returns></returns>
        [HttpPost("NewBill")]
        public IActionResult NewBill([FromBody] PendingBillIn parIn)
        {
            //var billBLL = new BillBLL();
            //var result = billBLL.NewBill(pendingBillIn);
            zlhisInterfaceBLL.NewCostApiLog("NewBill", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            List<NewBillOut> newBills = new List<NewBillOut>();
            newBills.Add(new NewBillOut());
            return Json(newBills);
        }

        /// <summary>
        /// 新增账单前的检查服务
        /// </summary>
        /// <param name="pendingBillIn"></param>
        /// <returns></returns>
        [HttpPost("CheckNewBill")]
        public IActionResult CheckNewBill([FromBody] PendingBillIn parIn)
        {
            //throw new Exception("111");
            //var billBLL = new BillBLL();
            //var result = billBLL.NewBill(pendingBillIn);
            zlhisInterfaceBLL.NewCostApiLog("CheckNewBill", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            List<NewBillOut> newBills = new List<NewBillOut>();

            dynamic dataOut = new { Code = 500, Success = false, Msg = "胡俊勇测试随便拋个错！" };
            //这个服务有特殊处理，以当前dynamic类型原样返回
            dataOut = new { Code = 200, Success = true, Msg = "", Data = "OK" };

            return Json(dataOut);
        }

        /// <summary>
        /// 药品系统会调用的服务
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetBillDetailInfo")]
        public IActionResult GetBillDetailInfo([FromBody] BillTotalInfoIn parIn)
        {
            zlhisInterfaceBLL.NewCostApiLog("GetBillDetailInfo", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            List<GetBillDetailInfoParOut> varOut = new List<GetBillDetailInfoParOut>(); 
            return Json(varOut);
        }

        /// <summary>
        /// 药品系统会调用的服务
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetBillChargeStatus")]
        public IActionResult GetBillChargeStatus([FromBody] BillTotalInfoIn parIn)
        {
            zlhisInterfaceBLL.NewCostApiLog("GetBillChargeStatus", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            int varOut = 0;
            return Json(varOut);
        }
        /// <summary>
        /// 药品系统会调用的服务
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetChargeOffApplyByAuditDept")]
        public IActionResult GetChargeOffApplyByAuditDept([FromBody] GetChargeOffApplyByAuditDept_In parIn)
        {
            zlhisInterfaceBLL.NewCostApiLog("GetChargeOffApplyByAuditDept", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            List<GetChargeOffApplyByAuditDept_Out> varOut = new List<GetChargeOffApplyByAuditDept_Out>();
            return Json(varOut);
        }

        /// <summary>
        /// 获取医嘱账单明细信息
        /// </summary>
        /// <param name="orderBillNoIns"></param>
        /// <returns></returns>
        [HttpPost("GetOrderFeeInfo")]
        public IActionResult GetOrderFeeInfo([FromBody] List<OrderBillNoIn> parIn)
        {
            zlhisInterfaceBLL.NewCostApiLog("GetOrderFeeInfo", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            var result = zlhisInterfaceBLL.GetOrderFeeInfo(parIn);
            return Json(result);
        }

        /// <summary>
        /// 获取病人账户剩余金额
        /// </summary>
        /// <param name="patientVisit"></param>
        /// <returns></returns>
        [HttpPost("GetRemainMoney")]
        public IActionResult GetRemainMoney([FromBody] PatientVisitIn parIn)
        {
            //var result = zlhisInterfaceBLL.GetRemainMoney(patientVisit);
            //return Json(new {
            //    guarantee_money = result.GuaranteeMoney,
            //    expected_money = result.InsurePreBalanceMoney,
            //    prepay_money = result.PrepayMoney,
            //    nobalance_money = result.NobalanceMoney
            //});
            zlhisInterfaceBLL.NewCostApiLog("GetRemainMoney", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            return Json(new {
                guarantee_money = 0,
                expected_money = 0,
                prepay_money = 0,
                nobalance_money = 0
            });
        }

        /// <summary>
        /// 获取病人账户剩余金额（门诊留观用）
        /// </summary>
        /// <param name="patientVisit"></param>
        /// <returns></returns>
        [HttpPost("GetUsableGuaranteeOutByPatVisit")]
        public IActionResult GetUsableGuaranteeOutByPatVisit([FromBody] PatientVisitIn parIn)
        {
            //var result = zlhisInterfaceBLL.GetRemainMoney(patientVisit);
            //return Json(new {
            //    guarantee_money = result.GuaranteeMoney,
            //    expected_money = result.InsurePreBalanceMoney,
            //    prepay_money = result.PrepayMoney,
            //    nobalance_money = result.NobalanceMoney
            //});
            zlhisInterfaceBLL.NewCostApiLog("GetUsableGuaranteeOutByPatVisit", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            List<BatchPatiRemainMoneyOut> lst = new List<BatchPatiRemainMoneyOut>();

            return Json(lst);

        }

        /// <summary>
        /// 批量获取病人账户剩余金额
        /// </summary>
        /// <param name="patientVisits"></param>
        /// <returns></returns>
        [HttpPost("GetRemainMoneyBatch")]
        public IActionResult GetRemainMoneyBatch([FromBody] List<PatientVisitIn> parIn)
        {

            List<BatchPatiRemainMoneyOut> lst = new List<BatchPatiRemainMoneyOut>();

            zlhisInterfaceBLL.NewCostApiLog("GetRemainMoneyBatch", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            //var result = from a in zlhisInterfaceBLL.GetRemainMoneyBatch(patientVisits)
            var result = from a in lst
                         select new {
                             patId = a.PatId,
                             patOrigin = a.PatOrigin,
                             patOriginId = a.PatOriginId,
                             guarantee_money = a.GuaranteeMoney,
                             expected_money = a.InsurePreBalanceMoney,
                             prepay_money = a.PrepayMoney,
                             nobalance_money = a.NobalanceMoney
                         };
            return Json(result);
        }

        /// <summary>
        /// 删除账单
        /// </summary>
        /// <param name="delBillIn"></param>
        /// <returns></returns>
        [HttpPost("DelBill")]
        public IActionResult DelBill([FromBody] DelBillIn parIn)
        {
            //var billBLL = new BillBLL();
            //billBLL.DelBill(delBillIn);
            zlhisInterfaceBLL.NewCostApiLog("DelBill", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            return Json(1);
        }

        /// <summary>
        /// 通过账单计算结算账单(结算)实收金额"
        /// </summary>
        /// <param name="pendingBill"></param>
        /// <returns></returns>
        [HttpPost("CalcBalanceBillContentByBill")]
        public IActionResult CalcBalanceBillContentByBill([FromBody] PendingBillIn parIn)
        {
            //BillBLL billBLL = new BillBLL();
            //var result = billBLL.CalcBalanceBillContentByBill(pendingBill);
            List<CalcBillContentReceivedOut> result = new List<CalcBillContentReceivedOut>();
            zlhisInterfaceBLL.NewCostApiLog("CalcBalanceBillContentByBill", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            return Json(result);
        }

        /// <summary>
        /// 计算应收实收
        /// </summary>
        /// <param name="pendingBill"></param>
        /// <returns></returns>
        [HttpPost("CalcBillChargesItemReceived")]
        public IActionResult CalcBillChargesItemReceived([FromBody] PendingBillIn parIn)
        {
            List<CalcBillContentReceivedSubOut> result = new List<CalcBillContentReceivedSubOut>();
            zlhisInterfaceBLL.NewCostApiLog("CalcBillChargesItemReceived", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            return Json(result);
        }


        /// <summary>
        /// 获取账单汇总信息/算药占比
        /// </summary>
        /// <param name="patientVisitIn"></param>
        /// <returns></returns>
        [HttpPost("GetBillAmountByPatient")]
        public IActionResult GetBillAmountByPatient([FromBody] PatientVisitIn parIn)
        {
            //var result = zlhisInterfaceBLL.GetBillAmountByPatient(patientVisitIn);
            zlhisInterfaceBLL.NewCostApiLog("GetBillAmountByPatient", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            //组织出参
            var result = new {
                fee_amrcvb = 0,
                fee_ampaib = 0,
                drug_amrcvb = 0,
                drug_ampaib = 0
            };
            return Json(result);
        }
        /// <summary>
        /// 获取账单汇总信息
        /// </summary>
        /// <param name="patientVisitIn"></param>
        /// <returns></returns>
        [HttpPost("GetBillTotalInfo")]
        public IActionResult GetBillTotalInfo([FromBody] BillTotalInfoIn parIn)
        {
            BillTotalInfoOut result = new BillTotalInfoOut();
            result.chargecategoryinfo = new List<ChargecategoryinfoItem>();
            zlhisInterfaceBLL.NewCostApiLog("GetBillTotalInfo", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            return Json(result);
        }

        /// <summary>
        /// 批量获取医嘱账单状态
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetOrderBillStatus")]
        public IActionResult GetOrderBillStatus([FromBody] List<OrderBillNoIn> parIn)
        {
            List<OrderBillStatusOut> result = new List<OrderBillStatusOut>();
            zlhisInterfaceBLL.NewCostApiLog("GetOrderBillStatus", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            result.Add(new OrderBillStatusOut() { GreenChannel = "1" });
            return Json(result);
        }

        /// <summary>
        /// 检查账单是否允许执行，并对未生效账单明细自动审核
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("CheckBillAllowExecute")]
        public IActionResult CheckBillAllowExecute([FromBody] CheckBillAllowExecuteIn parIn)
        {
            zlhisInterfaceBLL.NewCostApiLog("CheckBillAllowExecute", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            return Json(1);
        }

        /// <summary>
        /// 删除账单前的检查校验
        /// </summary>
        /// <param name="delBillIn"></param>
        /// <returns></returns>
        [HttpPost("CheckDelBill")]
        public IActionResult CheckDelBill([FromBody] DelBillIn parIn)
        {
            zlhisInterfaceBLL.NewCostApiLog("CheckDelBill", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            List<CheckOutTip> list = new List<CheckOutTip>();
            list.Add(new CheckOutTip { PromptCode = "0", PromptContent = "CheckDelBill新费用胡俊勇测试提示内容" });
            return Json(list);
        }

        /// <summary>
        /// 修改账单开单时间
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("ModifyBillContent")]
        public IActionResult ModifyBillContent([FromBody] DelBillIn parIn)
        {
            zlhisInterfaceBLL.NewCostApiLog("ModifyBillContent", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            string parinfo = Newtonsoft.Json.JsonConvert.SerializeObject(parIn);
            return Json(1);
        }

        /// <summary>
        /// 费用审核前的校验
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("CheckApprovalItem")]
        public IActionResult CheckApprovalItem(dynamic parIn)
        {
            zlhisInterfaceBLL.NewCostApiLog("CheckApprovalItem", Newtonsoft.Json.JsonConvert.SerializeObject(parIn));
            string parinfo = Newtonsoft.Json.JsonConvert.SerializeObject(parIn);
            //是否弹出费用审批界面，0不弹出，1弹出
            return Json(0);
        }

        #endregion

        //以上为新费用系统相关的服务API///////////////////////////////////////////////////////////////////////////////////////////////

        /// <summary>
        /// 测试接口
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="pvid"></param>
        /// <param name="user"></param>
        /// <param name="ip"></param>
        /// <param name="pwd"></param>
        /// <returns></returns>
        [HttpGet("HjyTestFun")]
        public IActionResult HjyTestFun(int pid, int pvid, string user, string ip, string pwd)
        {
            return Json(1);
        }


        /// <summary>
        /// 锚点测试的POST方法服务
        /// </summary>
        /// <param name="patientVisitIn"></param>
        /// <returns></returns>
        [HttpPost("AnchorPostFun")]
        public IActionResult AnchorPostFun(dynamic jsonIn)
        {
            string parinfo = Newtonsoft.Json.JsonConvert.SerializeObject(jsonIn);
            var result = new { result = 1, errmsg = "wertwert", nodet = "hjytest", successmsg = "胡俊勇测试消息锚点提供" };
            return Json(result);
        }

        /// <summary>
        /// 锚点测试的GET方法服务
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="pvid"></param>
        /// <param name="user"></param>
        /// <param name="ip"></param>
        /// <param name="pwd"></param>
        /// <returns></returns>
        [HttpGet("AnchorGetFun")]
        public IActionResult AnchorGetFun(int pid, int pvid, string user, string ip, string pwd)
        {
            //string parinfo = Newtonsoft.Json.JsonConvert.SerializeObject(jsonIn);
            var result = new { result = 1, errmsg = "3333", nodet = "hjytest", successmsg = "胡俊勇测试消息锚点提供" };
            return Json(result);
        }

        /// <summary>
        /// 新增账单时帐单入参格式化，主要是用于服务参数格式化
        /// </summary>
        /// <param name="pendingBillIn"></param>
        /// <returns></returns>
        [HttpPost("NewBillParFormat")]
        public IActionResult NewBillParFormat([FromBody] PendingBillIn pendingBillIn)
        {
            return Json(pendingBillIn);
        }


        /// <summary>
        /// 获取住院医生站参数信息
        /// </summary>
        /// <param name="parData"></param>
        /// <returns></returns>
        [HttpPost("GetIndsSavePlgPar")]
        public IActionResult GetIndsSavePlgPar([FromBody] IndsSavePlg parData)
        {
            /////http://192.168.56.1:5888/api/ZlhisInterface/GetIndsSavePlgPar
            return Json(parData);
        }

        /// <summary>
        /// 采集药替换
        /// </summary>
        /// <returns></returns>
        [HttpPost("ExecuteCpdmCheck")]
        public IActionResult ExecuteCpdmCheck([FromBody] ExecuteCpdmCheckIn parIn)
        {
            #region 把入参记录下来 测试日志
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            string id = Guid.NewGuid().ToString();
            //DataTable dtTemp = zlhisInterfaceDAL.GetTable("","","", "select * from zlhis_log where id='" + id + "'");
            string strInfo = Newtonsoft.Json.JsonConvert.SerializeObject(parIn);
            zlhisInterfaceDAL.ZLhisLogInsert(1, id, strInfo, strInfo, 1, "ExecuteCpdmCheck", "ExecuteCpdmCheck", "ExecuteCpdmCheck");
            #endregion

            CPDMCheckOUT outObj = new CPDMCheckOUT();
            //搞一个测试用的页面随便加的
            string strUrl = "http://192.168.56.1:5888/PatientVte/CPDMREP?id=" + id;
            outObj.Url = strUrl;
            if (parIn.CallOpportunity == "医嘱保存")
            {
                string drugId = parIn.Data.DrugInfos[0].DrugId;
                string strWhereOk = zlhisInterfaceDAL.GetTableFieldVal("药品规格", "药品id", drugId, "扩展属性说明");
                if (strWhereOk.Contains("集采不让通过"))
                {
                    outObj.CheckResult = new List<CheckResultItem>();
                    outObj.CheckResult.Add(new CheckResultItem {
                        AdviceId = "1",
                        TipMsg = "测试集采，药品规格.扩展属性说明=集采不让通过 药品id=" + drugId
                    });
                }
            }
            return Json(outObj);
        }

        /// <summary>
        /// 医嘱删除、作废时，需要调用新接口进行申请用量修正。
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("DeleteApplyUseDetail")]
        public IActionResult DeleteApplyUseDetail([FromBody] DeleteCpdmParIn parIn)
        {
            return Json(1);
        }

        /// <summary>
        /// 获取药品成相关也是和集采相关的接口
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("DrugComponentByCode")]
        public IActionResult DrugComponentByCode([FromBody] List<COMPONENTNAME_LISTItem> parIn)
        {
            string strObjs = @"{""DRUGBASECODE_MAIN"":""86900835000018"",""COMPONENTNAME_LIST"":[{""COMPONENTNAME"":""重组人Ⅱ型肿瘤坏死因子受体-抗体融合蛋白"",""DRUGBASECODE"":""86900835000018"",""PathItemId"":null,""BigClassName"":null},{""COMPONENTNAME"":""重组人Ⅱ型肿瘤坏死因子受体-抗体融合蛋白"",""DRUGBASECODE"":""86900835000025"",""PathItemId"":null,""BigClassName"":null},{""COMPONENTNAME"":""重组人Ⅱ型肿瘤坏死因子受体-抗体融合蛋白"",""DRUGBASECODE"":""86904641003171"",""PathItemId"":null,""BigClassName"":null},{""COMPONENTNAME"":""重组人Ⅱ型肿瘤坏死因子受体-抗体融合蛋白"",""DRUGBASECODE"":""86904641003188"",""PathItemId"":null,""BigClassName"":null},{""COMPONENTNAME"":""重组人Ⅱ型肿瘤坏死因子受体-抗体融合蛋白"",""DRUGBASECODE"":""86981272000021"",""PathItemId"":null,""BigClassName"":null},{""COMPONENTNAME"":""重组人Ⅱ型肿瘤坏死因子受体-抗体融合蛋白"",""DRUGBASECODE"":""86909543000013"",""PathItemId"":null,""BigClassName"":null}]}";
            DRUGTCFOUT outObj = Newtonsoft.Json.JsonConvert.DeserializeObject<DRUGTCFOUT>(strObjs);
            List<DRUGTCFOUT> list = new List<DRUGTCFOUT>();
            list.Add(outObj);
            return Json(list);
        }

        /// <summary>
        /// 新医保管控接口
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>

        [HttpPost("ExecuteGeneralCheckNew")]
        public IActionResult ExecuteGeneralCheckNew([FromBody] MircInPatientInfo parIn)
        {
            #region 把入参记录下来 测试日志
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            string strTestval = "";
            strTestval = zlhisInterfaceDAL.GetPatiVisitRecordsDALAsync("");
            string id = Guid.NewGuid().ToString();
            string strInfo = Newtonsoft.Json.JsonConvert.SerializeObject(parIn);
            zlhisInterfaceDAL.ZLhisLogInsert(1, id, "", strInfo, 1, "ExecuteGeneralCheckNew", "ExecuteGeneralCheckNew", "ExecuteGeneralCheckNew");
            #endregion

            string strOne = @"{""MedicalInsuranceCode"":""86905014000711"",""PId"":""121076"",""PvId"":""1"",""PatientSource"":""2"",""FeeId"":""951"",""FeeName"":""1小儿止咳糖浆"",""AdviceId"":null,""DiacrisistItemId"":""654"",""RuleId"":""e9bbe109-55b0-4890-9ea9-a82fbd501e27"",""MircRecId"":""0e4bc070-32db-48e8-88d0-6f38e8c0c700"",""FeeOccurTime"":"""",""RuleType"":1,""RuleReason"":""限儿童2 报销3"",""PromptContent"":null,""RuleResult"":2,""PromptOptions"":[""限儿童""]}";            
            MircOutDataOp dataOut = new MircOutDataOp();
            dataOut.FeeListResults = new List<MircOutData>();
            MircOutData item = null;
            int count = 0;
            //禁止使用
            if (0 == 1)
            {
                for (int i = 0; i < 3; i++)
                {
                    count++;
                    item = Newtonsoft.Json.JsonConvert.DeserializeObject<MircOutData>(strOne);
                    id = Guid.NewGuid().ToString();
                    item.MircRecId = id;
                    item.UniqueId = id;
                    item.FeeName = "F_" + count + item.FeeName;
                    item.RuleReason = "R_" + count + item.RuleReason;
                    item.RuleType = 1;
                    item.UseResult = 1;////使用限制 - UseResult为1的项目   //使用提示 - UseResult为0且RuleType为1的项目 //报销提示 - UseResult为0且RuleType为3或4的项目
                    item.PromptOptions = new List<string>();
                    item.PromptOptions.Add("P_1复选");
                    item.PromptOptions.Add("P_2复选");
                    item.PromptOptions.Add("P_3复选");
                    dataOut.FeeListResults.Add(item);
                }
            }
            //提示使用
            for (int i = 0; i < 3; i++)
            {
                count++;
                item = Newtonsoft.Json.JsonConvert.DeserializeObject<MircOutData>(strOne);
                id = Guid.NewGuid().ToString();
                item.MircRecId = id;
                item.UniqueId = id;
                item.FeeName = "F_" + count + item.FeeName;
                item.RuleReason = "R_" + count + item.RuleReason;
                item.RuleType = 1;
                item.UseResult = 0;////使用限制 - UseResult为1的项目   //使用提示 - UseResult为0且RuleType为1的项目 //报销提示 - UseResult为0且RuleType为3或4的项目
                item.PromptOptions = new List<string>();
                item.PromptOptions.Add("P_1复选");
                item.PromptOptions.Add("P_2复选");
                item.PromptOptions.Add("P_3复选");
                dataOut.FeeListResults.Add(item);
            }

            for (int i = 0; i < 3; i++)
            {
                count++;
                item = Newtonsoft.Json.JsonConvert.DeserializeObject<MircOutData>(strOne);
                id = Guid.NewGuid().ToString();
                item.MircRecId = id;
                item.UniqueId = id;
                item.FeeName = "F_" + count + item.FeeName;
                item.RuleReason = "R_" + count + item.RuleReason;
                item.RuleType = 3;
                item.UseResult = 0;////使用限制 - UseResult为1的项目   //使用提示 - UseResult为0且RuleType为1的项目 //报销提示 - UseResult为0且RuleType为3或4的项目
                item.PromptOptions = new List<string>();
                item.PromptOptions.Add("P_1复选");
                item.PromptOptions.Add("P_2复选");
                item.PromptOptions.Add("P_3复选");
                dataOut.FeeListResults.Add(item);
            }

            for (int i = 0; i < 3; i++)
            {
                count++;
                item = Newtonsoft.Json.JsonConvert.DeserializeObject<MircOutData>(strOne);
                id = Guid.NewGuid().ToString();
                item.MircRecId = id;
                item.UniqueId = id;
                item.FeeName = "F_" + count + item.FeeName;
                item.RuleReason = "R_" + count + item.RuleReason;
                item.RuleType = 4;
                item.UseResult = 0;////使用限制 - UseResult为1的项目   //使用提示 - UseResult为0且RuleType为1的项目 //报销提示 - UseResult为0且RuleType为3或4的项目
                item.PromptOptions = new List<string>();
                item.PromptOptions.Add("P_1复选");
                item.PromptOptions.Add("P_2复选");
                item.PromptOptions.Add("P_3复选");
                dataOut.FeeListResults.Add(item);
            }
            dataOut.CheckinResultInfo = "胡俊勇测试数据";
            dynamic temp = new { Code = 200, Success = true, Msg = "", Data = dataOut };
            strInfo = JsonConvert.SerializeObject(temp);

            zlhisInterfaceDAL.ZLhisLogInsert(1, id, "", strInfo, 1, "ExecuteGeneralCheckNew_Out", "ExecuteGeneralCheckNew_Out", "ExecuteGeneralCheckNew_Out");

            return Json(dataOut);
        }        
    }
}
