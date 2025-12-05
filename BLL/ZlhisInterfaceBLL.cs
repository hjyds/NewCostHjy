using NewCostHjy.Common;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using ZLSoft.Base.Tracing;
using static NewCostHjy.Common.Const;

namespace testWeb.BLL {
    /// <summary>
    /// ZLHIS
    /// </summary>
    public class ZlhisInterfaceBLL {

        ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();

        /// <summary>
        /// 组装输出
        /// </summary>
        /// <param name="T"></param>
        /// <param name="guid"></param>
        /// <param name="output"></param>
        /// <returns></returns>
        public int GetOutPut(Dictionary<string, object> T, out List<JToken> output) {
            JObject jObject = JObject.Parse(T["Json_Out"] as string);
            output = new List<JToken>();

            if (jObject["output"]["code"].ToString() == "0") {
                throw new Exception(jObject["output"]["message"].ToString());
            }
            int count = Convert.ToInt32(jObject["output"]["code"]);
            if (count > 0) {
                var array = jObject["output"].Last().First as JArray;

                if (array == null) {
                    JToken jToken = jObject["output"].Last;
                    output.Add(jToken);
                } else {
                    output = array.ToList();
                }
            }
            return count;
        }

        /// <summary>
        /// 记录专业费用接口日志
        /// </summary>
        /// <param name="funName">api名称</param>
        /// <param name="parIn">入参信息</param>
        public void NewCostApiLog(string funName, string parIn)
        {
            zlhisInterfaceDAL.NewCostApiLog(funName, parIn);
        }

        /// <summary>
        /// 获取下一个ID或NO
        /// </summary>
        /// <param name="hisNoOrIdType"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        public string GetNextIdOrNo(string hisNoOrIdType, int quantity) {
            using (var trace = new ZLTrace("GetNextIdOrNo", "ZlhisInterfaceBLL")) {
                string input = "";
                Dictionary<string, object> T = null;
                if (Const.HisNoOrIdType.Register == hisNoOrIdType) {
                    //12-挂号
                    input = "{\"input\":{\"item_num\":12,\"quantity\":" + quantity + "}}";
                    T = zlhisInterfaceDAL.GetFeeNo(input);
                } else if (Const.HisNoOrIdType.FeeNo == hisNoOrIdType) {
                    //14-记帐单据号
                    input = "{\"input\":{\"item_num\":14,\"quantity\":" + quantity + "}}";
                    T = zlhisInterfaceDAL.GetFeeNo(input);
                } else if (Const.HisNoOrIdType.FeeId == hisNoOrIdType) {
                    //费用ID
                    input = "{\"input\":{\"table_name\":\"病人费用记录\",\"quantity\":" + quantity + "}}";
                    T = zlhisInterfaceDAL.GetFeeId(input);
                    //} else if (Const.HisNoOrIdType.Pid == hisNoOrIdType) {
                    //    input = "{\"input\":{\"item_num\":1,\"quantity\":" + quantity + "}}";
                    //    T = zlhisInterfaceDAL.GetPatientId(input);
                    //} else if (Const.HisNoOrIdType.OutPatNo == hisNoOrIdType) {
                    //    input = "{\"input\":{\"item_num\":3,\"quantity\":" + quantity + "}}";
                    //    T = zlhisInterfaceDAL.GetPatientId(input);
                    //} else if (Const.HisNoOrIdType.InPatNo == hisNoOrIdType) {
                    //    input = "{\"input\":{\"item_num\":2,\"quantity\":" + quantity + "}}";
                    //    T = zlhisInterfaceDAL.GetPatientId(input);
                }
                List<JToken> jTokens;
                GetOutPut(T, out jTokens);

                string NextIdOrNo = jTokens[0].First.ToString();

                return NextIdOrNo;

            }
        }

        /// <summary>
        /// 获取表数据
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="con">条件名</param>
        /// <param name="val">条件值</param>
        /// <param name="field">字段名</param>
        /// <returns></returns>
        public DataTable GetTable(string tableName, string con, string val, string field)
        {
            return zlhisInterfaceDAL.GetTable(tableName, con, val, field);
        }

        /// <summary>
        /// SPD项目列表获取(SPD项目列表)
        /// </summary>
        /// <returns></returns>
        public List<Eisai_item_listItem> SPDItems()
        {
            DataTable dtTmp = zlhisInterfaceDAL.SPDItems();
            string strTemp = Newtonsoft.Json.JsonConvert.SerializeObject(dtTmp);
            List<Eisai_item_listItem> lstPar = Newtonsoft.Json.JsonConvert.DeserializeObject<List<Eisai_item_listItem>>(strTemp);
            return lstPar;
        }

        public List<OrderNewFeeInfo> GetOrderFeeInfo(List<OrderBillNoIn> orderBillNoIns) {
            List<OrderNewFeeInfo> orderNewFeeInfos = new List<OrderNewFeeInfo>();

            string strNos = "";
            foreach (OrderBillNoIn item in orderBillNoIns) {
                if ("" == strNos) {
                    strNos = item.BillNo;
                } else {
                    strNos += "," + item.BillNo;
                }
            }
            DataTable dtTmp = zlhisInterfaceDAL.GetOrderFeeInfo(strNos);

            foreach (DataRow drRow in dtTmp.Rows) {

                OrderNewFeeInfo orderNewFeeInfo = new OrderNewFeeInfo();

                orderNewFeeInfo.order_id = Convert.ToInt32(drRow["医嘱id"]);
                orderNewFeeInfo.advice_send_number = Convert.ToInt32(drRow["发送号"]);
                orderNewFeeInfo.fee_no = drRow["NO"].ToString();
                orderNewFeeInfo.bill_prop = 2; 
                orderNewFeeInfo.rec_state = 1;
                orderNewFeeInfo.fee_state = 0;
                orderNewFeeInfo.exe_dept_id = drRow["执行部门id"].ToString();
                orderNewFeeInfo.exe_dept_name = "";
                orderNewFeeInfo.fee_id = Convert.ToInt32(drRow["费用id"]);
                orderNewFeeInfo.fee_item_id = Convert.ToInt32(drRow["收费细目id"]);
                orderNewFeeInfo.nums = Convert.ToDecimal(drRow["数量"]);
                orderNewFeeInfo.quantity = orderNewFeeInfo.nums;
                orderNewFeeInfo.receivable = Convert.ToDecimal(drRow["标准单价"]) * orderNewFeeInfo.quantity;
                orderNewFeeInfo.received = orderNewFeeInfo.receivable;
                orderNewFeeInfo.billStatus = "俊勇测试";
                orderNewFeeInfo.billStatusCode = "0";
                orderNewFeeInfo.price = Convert.ToDecimal(drRow["标准单价"]);
                orderNewFeeInfo.fee_name = drRow["项目名称"].ToString();
                orderNewFeeInfo.exe_state = drRow["执行状态"].ToString();
                orderNewFeeInfo.fee_type = drRow["收费项目类别"].ToString();
                orderNewFeeInfo.unit= drRow["收费项目单位"].ToString();

                orderNewFeeInfos.Add(orderNewFeeInfo);
            }

            return orderNewFeeInfos;
        }


        /// <summary>
        /// 通用数据检查规则的返回提示信息
        /// </summary>
        /// <param name="msg"></param>
        /// <returns></returns>
        public RootChkApi ZLHISChkApiOutMsg(string msg) {
             
            RootChkApi outData = new RootChkApi();
            OutputChk output = new OutputChk();
            output.data = new List<DataItem> { new DataItem() };
            outData.output = output;
            output.message = "";//这个结点只有当 code 为零时才有效，即服务失败的时候才填值
            output.data[0].state = "1";


            output.data[0].message_ban = "1_message_ban";//禁止信息
            output.data[0].message_tips = msg;//提示信息

            outData.output.code = 1;//必须的
            output.data[0].state = "1";//必须的


            return outData;
        }

        /// <summary>
        /// 通用数据检查规则的返回提示信息
        /// </summary>
        /// <param name="msg"></param>
        /// <returns></returns>
        public RootChkApi ZLHISChkApiOutMsgEx(string mode,string msgBan,string msgTips) {

            RootChkApi outData = new RootChkApi();
            OutputChk output = new OutputChk();
            output.data = new List<DataItem> { new DataItem() };
            outData.output = output;
            output.message = "";//这个结点只有当 code 为零时才有效，即服务失败的时候才填值
            output.data[0].state = "1";

            output.data[0].tip_mode = mode;
            output.data[0].message_ban = msgBan;//禁止信息
            output.data[0].message_tips = msgTips;//提示信息

            outData.output.code = 1;//必须的
            output.data[0].state = "1";//必须的

            string strTmp = output.ToJsonString();


            return outData;

        }

        public dynamic orders;
        public dynamic lstTmp;
        public dynamic checkList;
        //void TestFuns() {
        //    string strAll频率 = "";
        //    bool find = false;
        //    for (int i = 0; i < orders.Count; i++) {
        //        if (orders[i]["执行频率"].ToText() != "") {
        //            if (("<SP>" + strAll频率 + "<SP>").IndexOf("<SP>" + orders[i]["执行频率"].ToText() + "<SP>") == -1) {
        //                strAll频率 += "<SP>" + orders[i]["执行频率"].ToText();
        //                find = false;
        //                for (j = 0; j < lstTmp.Count; j++) {
        //                    if (orders[i]["执行频率"].ToText() == lstTmp[j]["名称"].ToText()) {
        //                        find = true;
        //                    }
        //                }
        //                if (!find) {
        //                    JsonDataItem checkItem = new JsonDataItem();
        //                    checkItem["检查结果"].SetValue("1");
        //                    checkItem["提示信息"].SetValue("\"" + orders[i]["执行频率"].ToText() + "\"执行频率已失效，请重新选择执行频率。");
        //                    checkItem["医嘱ID"].SetValue(orders[i]["医嘱ID"].ToText());
        //                    checkList.AddArrayItem(checkItem);
        //                }
        //            }
        //        }
        //    }
        //}

        public bool CheckCharScope(string text, string chars) {
            for (int i = 0; i < text.Length; i++) {
                if (chars.IndexOf(text[i]) == -1) return false;
            }
            return true;
        }
        
        public void TestFunc() {
            //new HttpAccessToken().TestFunc();
            //return;
            string strFilePath = @"C:\Users\Administrator\Documents\Tencent Files\469843828\FileRecv\win7SQL_U0032_20240306.log";


            FunTestCom funTestCom = new FunTestCom();
            funTestCom.ReadFileFold();
            //funTestCom.GetSQLMODList(strFilePath);

            //bool blnTmp=  ExeTimeValid("2",2,1,"天",true);
            //    blnTmp = ExeTimeValid_HJY("2", 2, 1, "天", true);
        }

        //检查指定的执行时间是否合法
        public bool ExeTimeValid(string strTime, int int频率次数, int int频率间隔, string str间隔单位, bool bln首日 = false) {
            string strPreTime = "";
            int intPreDay = 0;

            if (strTime == "") {
                if (str间隔单位 == "分钟") return true;
                return false;
            }

            if (str间隔单位 == "周") {
                //格式：1/8:00-3/15:00-5/9:00；1/8:00-3/15-5/9:00
                if (!CheckCharScope(strTime, "0123456789:-/")) return false;

                string[] arrTime = strTime.Split("-");
                if (bln首日) {
                    if (!(int频率次数 >= 1 && int频率次数 <= arrTime.Length)) return false;
                } else {
                    if (int频率次数 != arrTime.Length) return false;
                }

                for (int i = 0; i < arrTime.Length; i++) {
                    string[] arrTmp = arrTime[i].Split("/");
                    if (arrTmp.Length != 2) return false;

                    //星期部份
                    string strTmp = arrTmp[0];
                    if (strTmp.Contains(":") || strTmp == "") return false;
                    if (!int.TryParse(strTmp, out int intCurDay)) return false;
                    if (intCurDay < 1 || intCurDay > 7) return false;
                    if (intPreDay != 0 && intCurDay < intPreDay) return false;

                    //绝对时间部分
                    strTmp = arrTmp[1];
                    if (!strTmp.Contains(":")) strTmp += ":00";

                    arrTmp = strTmp.Split(":");
                    if (arrTmp.Length != 2) return false;
                    if ((int.TryParse(arrTmp[0], out int _) && int.Parse(arrTmp[0]) >= 24) || arrTmp[0] == "" || arrTmp[0].Length > 2) return false;
                    if ((int.TryParse(arrTmp[1], out int _) && int.Parse(arrTmp[1]) >= 60) || arrTmp[1] == "" || arrTmp[1].Length > 2) return false;
                    if (intPreDay != 0 && intPreDay == intCurDay && strPreTime != ""
                        && string.Compare(DateTime.Parse(strTmp).ToString("HH:mm"), strPreTime) <= 0) return false;

                    strPreTime = DateTime.Parse(strTmp).ToString("HH:mm");
                    intPreDay = intCurDay;
                }
            } else if (str间隔单位 == "天") {
                if (int频率间隔 == 1) {
                    //格式：8:00-12:00-14:00；8:00-12-14:00
                    if (!CheckCharScope(strTime, "0123456789:-")) return false;

                    string[] arrTime = strTime.Split("-");
                    if (bln首日) {
                        if (!(int频率次数 >= 1 && int频率次数 <= arrTime.Length)) return false;
                    } else {
                        if (int频率次数 != arrTime.Length) return false;
                    }

                    for (int i = 0; i < arrTime.Length; i++) {
                        string strTmp = arrTime[i];
                        if (!strTmp.Contains(":")) strTmp += ":00";

                        string[] arrTmp = strTmp.Split(":");
                        if (arrTmp.Length != 2) return false;
                        if ((int.TryParse(arrTmp[0], out int _) && int.Parse(arrTmp[0]) >= 24) || arrTmp[0] == "" || arrTmp[0].Length > 2) return false;
                        if ((int.TryParse(arrTmp[1], out int _) && int.Parse(arrTmp[1]) >= 60) || arrTmp[1] == "" || arrTmp[1].Length > 2) return false;
                        if (strPreTime != "" && string.Compare(DateTime.Parse(strTmp).ToString("HH:mm"), strPreTime) <= 0) return false;
                        strPreTime = DateTime.Parse(strTmp).ToString("HH:mm");
                    }
                } else {
                    //格式：1/8:00-1/15:00-2/9:00；1/8:00-1/15-2/9:00
                    if (!CheckCharScope(strTime, "0123456789:-/")) return false;

                    string[] arrTime = strTime.Split("-");
                    if (bln首日) {
                        if (!(int频率次数 >= 1 && int频率次数 <= arrTime.Length)) return false;
                    } else {
                        if (int频率次数 != arrTime.Length) return false;
                    }

                    for (int i = 0; i < arrTime.Length; i++) {
                        string[] arrTmp = arrTime[i].Split("/");
                        if (arrTmp.Length != 2) return false;

                        //相对天数部份
                        string strTmp = arrTmp[0];
                        if (strTmp.Contains(":") || strTmp == "") return false;
                        if (!int.TryParse(strTmp, out int intCurDay)) return false;
                        if (intCurDay < 1 || intCurDay > int频率间隔) return false;
                        if (intPreDay != 0 && intCurDay < intPreDay) return false;

                        //绝对时间部分
                        strTmp = arrTmp[1];
                        if (!strTmp.Contains(":")) strTmp += ":00";

                        arrTmp = strTmp.Split(":");
                        if (arrTmp.Length != 2) return false;
                        if ((int.TryParse(arrTmp[0], out int _) && int.Parse(arrTmp[0]) >= 24) || arrTmp[0] == "" || arrTmp[0].Length > 2) return false;
                        if ((int.TryParse(arrTmp[1], out int _) && int.Parse(arrTmp[1]) >= 60) || arrTmp[1] == "" || arrTmp[1].Length > 2) return false;
                        if (intPreDay != 0 && intPreDay == intCurDay && strPreTime != ""
                            && string.Compare(DateTime.Parse(strTmp).ToString("HH:mm"), strPreTime) <= 0) return false;

                        strPreTime = DateTime.Parse(strTmp).ToString("HH:mm");
                        intPreDay = intCurDay;
                    }
                }
            } else if (str间隔单位 == "小时") {
                //格式：1:30-2-3:30
                if (!CheckCharScope(strTime, "0123456789:-")) return false;
                string[] arrTime = strTime.Split("-");
                if (int频率次数 != arrTime.Length) return false;

                for (int i = 0; i < arrTime.Length; i++) {
                    string strTmp = arrTime[i];
                    if (!strTmp.Contains(":")) strTmp += ":00";

                    string[] arrTmp = strTmp.Split(":");
                    if (arrTmp.Length != 2) return false;
                    if ((int.TryParse(arrTmp[0], out int _) && (int.Parse(arrTmp[0]) < 1 || int.Parse(arrTmp[0]) > int频率间隔)) || arrTmp[0] == "") return false;
                    if ((int.TryParse(arrTmp[1], out int _) && int.Parse(arrTmp[1]) >= 60) || arrTmp[1] == "" || arrTmp[1].Length > 2) return false;
                    if (strPreTime != "" && string.Compare(DateTime.Parse(strTmp).ToString("HH:mm"), strPreTime) <= 0) return false;
                    strPreTime = DateTime.Parse(strTmp).ToString("HH:mm");
                }
            }

            return true;
        }

        public bool ExeTimeValid_HJY(string strTime, int int频率次数, int int频率间隔, string str间隔单位, bool bln首日) {
            if (string.IsNullOrEmpty(strTime)) {
                if (str间隔单位 == "分钟") return true;
            }
            //string AdviceExePlanTimeA = @"^[0-9\-:\/]*$";
            //string AdviceExePlanTimeB = @"^[0-9\-:]*$";
            //   Regex pattern = new Regex(AdviceExePlanTimeA);
            //   Regex patternex = new Regex(AdviceExePlanTimeB);

            string[] arrTime = strTime.Split('-');
            string[] arrTmp, arrMi;
            string strTmp = "", strPreTime = "";

            int intCurDay = 0, intPreDay = 0;
            if (str间隔单位 == "周") {
                //  1/8:00-3/15:00-5/9:00；1/8:00-3/15-5/9:00
                //if (!pattern.IsMatch(strTime)) return false;
                if (!CheckCharScope(strTime, "0123456789:-/")) return false;
                if (bln首日) {
                    if (arrTime.Length > int频率次数) return false;
                } else {
                    if (arrTime.Length != int频率次数) return false;
                }
                for (var i = 0; i < arrTime.Length; i++) {
                    arrTmp = arrTime[i].Split('/');
                    if (arrTmp.Length != 2) return false;
                    //星期部份
                    strTmp = arrTmp[0];
                    if (strTmp.IndexOf(':') > -1 || strTmp == "") return false;
                    intCurDay = int.Parse(strTmp);
                    if (intCurDay < 1 || intCurDay > 7) return false;
                    if (intPreDay != 0) {
                        if (intCurDay < intPreDay) return false;
                    }
                    //绝对时间部份
                    strTmp = arrTmp[1];
                    if (strTmp.IndexOf(':') == -1) strTmp += ":00";
                    arrMi = strTmp.Split(':');
                    if (arrMi.Length != 2) return false;

                    if (int.Parse(arrMi[0]) >= 24) return false;
                    if (int.Parse(arrMi[1]) >= 60) return false;

                    if (intPreDay != 0 && intPreDay == intCurDay && strPreTime != "") {
                        if (CompareTimeHHmm(strTmp, strPreTime)) return false;
                    }
                    strPreTime = strTmp;
                    intPreDay = intCurDay;
                }
            } else if (str间隔单位 == "天") {
                if (bln首日) {
                    if (arrTime.Length > int频率次数) return false;
                } else {
                    if (arrTime.Length != int频率次数) return false;
                }
                if (int频率间隔 == 1) {
                    //   8:00-12:00-14:00；8:00-12-14:00
                    // if (!patternex.IsMatch(strTime)) return false;
                    if (!CheckCharScope(strTime, "0123456789:-")) return false;
                    for (var i = 0; i < arrTime.Length; i++) {

                        strTmp = arrTime[i];
                        if (strTmp.IndexOf(':') == -1) strTmp += ":00";
                        arrMi = strTmp.Split(':');
                        if (arrMi.Length != 2) return false;

                        if (int.Parse(arrMi[0]) >= 24) return false;
                        if (int.Parse(arrMi[1]) >= 60) return false;

                        if (strPreTime != "") {
                            if (CompareTimeHHmm(strTmp, strPreTime)) return false;
                        }
                        strPreTime = strTmp;
                    }
                } else {
                    //  1/8:00-1/15:00-2/9:00；1/8:00-1/15-2/9:00
                    //if (!pattern.IsMatch(strTime)) return false;
                    if (!CheckCharScope(strTime, "0123456789:-/")) return false;

                    for (var i = 0; i < arrTime.Length; i++) {
                        arrTmp = arrTime[i].Split('/');
                        if (arrTmp.Length != 2) return false;
                        //相对天数部份
                        strTmp = arrTmp[0];
                        if (strTmp.IndexOf(':') > -1 || strTmp == "") return false;
                        intCurDay = int.Parse(strTmp);
                        if (intCurDay < 1 || intCurDay > int频率间隔) return false;
                        if (intPreDay != 0) {
                            if (intCurDay < intPreDay) return false;
                        }
                        //绝对时间部分
                        strTmp = arrTmp[1];
                        if (strTmp.IndexOf(':') == -1) strTmp += ":00";
                        arrMi = strTmp.Split(':');
                        if (arrMi.Length != 2) return false;

                        if (int.Parse(arrMi[0]) >= 24) return false;
                        if (int.Parse(arrMi[1]) >= 60) return false;

                        if (intPreDay != 0 && intPreDay == intCurDay && strPreTime != "") {
                            if (CompareTimeHHmm(strTmp, strPreTime)) return false;
                        }
                        strPreTime = strTmp;
                        intPreDay = intCurDay;
                    }
                }
            } else if (str间隔单位 == "小时") {
                // 1:30-2-3:30
                //if (!pattern.IsMatch(strTime)) return false;
                if (!CheckCharScope(strTime, "0123456789:-/")) return false;

                if (arrTime.Length != int频率次数) return false;

                for (var i = 0; i < arrTime.Length; i++) {
                    strTmp = arrTime[i];
                    if (strTmp.IndexOf(':') == -1) strTmp += ":00";
                    arrMi = strTmp.Split(':');
                    if (arrMi.Length != 2) return false;

                    if (int.Parse(arrMi[0]) < 1 || int.Parse(arrMi[0]) > int频率间隔) return false;
                    if (int.Parse(arrMi[1]) >= 60) return false;

                    if (strPreTime != "") {
                        if (CompareTimeHHmm(strTmp, strPreTime)) return false;
                    }
                    strPreTime = strTmp;
                }
            }
            return true;
        }

        public bool CompareTimeHHmm(string strL, string strR) {
            var arrL = strL.Split(':');
            var arrR = strR.Split(':');
            if (int.Parse(arrL[0]) < int.Parse(arrR[0])) return true;
            if (int.Parse(arrL[0]) <= int.Parse(arrR[0])) {
                if (int.Parse(arrL[1]) <= int.Parse(arrR[1])) return true;
            }
            return false;
        }

        public List<FollowUpd> GetErrUpFollowList() {
            DataTable data = zlhisInterfaceDAL.GetErrUpFollowList();
            //List<FollowUpd> lstT = Const.ConvertDataTableToIList<FollowUpd>(data).ToList();
            List<FollowUpdStr> lst = Const.ConvertDataTableToIList<FollowUpdStr>(data).ToList();
            if (lst.Count == 0)
            {
                lst.Add(new FollowUpdStr() { });
            }
            string strTmp = Newtonsoft.Json.JsonConvert.SerializeObject(lst);

            List<FollowUpd> outlist = Newtonsoft.Json.JsonConvert.DeserializeObject<List<FollowUpd>>(strTmp);

            return outlist;
        }

        /// <summary>
        /// VTE系统测试相关
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public dynamic TestVteEval(VteEvalPar input)
        {

            if (string.IsNullOrWhiteSpace(input.vteSystem))
            {
                input.vteSystem = "http://192.168.56.1:8400"; 
            }


            if (input.Cancel == "1")
            {
                return VteCencel(input);
            }

            string sysType = "0";
            if (input.buttonType == "nurse")
            {
                sysType = "2";
            }
            DataTable dtOrder = zlhisInterfaceDAL.GetVteEvalOrder(input.orderId, "");
            dynamic urlPar = new
            {
                PatientId = dtOrder.Rows[0]["病人ID"].ToString(), //    "PatientId": "774",
                VisitId = dtOrder.Rows[0]["主页ID"].ToString(),          //"VisitId": "1",
                DeptId = dtOrder.Rows[0]["科室ID"].ToString(),        //"DeptId": "170",
                DeptName = dtOrder.Rows[0]["科室名称"].ToString(),      //"DeptName": "消化内科病房",
                OprtrName = dtOrder.Rows[0]["人员"].ToString(),    //"OprtrName": "管理员",
                OprtrId = dtOrder.Rows[0]["人员ID"].ToString(),  //"OprtrId": "142",
                SourceItemId = dtOrder.Rows[0]["医嘱ID"].ToString(),//"NewOrder": 1,
                OperPosition = dtOrder.Rows[0]["专业技术职务"].ToString(),//"OperPosition": "药师",
                ItemId = dtOrder.Rows[0]["诊疗项目ID"].ToString(),//"ItemId": "177271",
                ItemOperateType = dtOrder.Rows[0]["操作类型"].ToString(),//"ItemOperateType": "10",
                SourceSystem = sysType//"SourceSystem": "0"
            };
            string url = input.vteSystem;           
            url += "/ZlVteInterface/GetVteItemExeUrl";
            string dataJson = Newtonsoft.Json.JsonConvert.SerializeObject(urlPar);
            string result = "";
            try
            {
                result = NewCostHjy.Common.HttpRequest.RequestDataSync(url, dataJson, AuthType.None);
            } catch (Exception ex)
            {
                return new { Result = 0, Msg = ex.Message };
            }
            JObject jObResult = JsonConvert.DeserializeObject<JObject>(result);
            return new { Result = 1, Url = jObResult.Value<string>("Data") };
        }

        /// <summary>
        /// VTE系统撤消接口
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        private dynamic VteCencel(VteEvalPar input)
        {
            string sysType = "0";
            if (input.buttonType == "nurse")
            {
                sysType = "2";
            }
            DataTable dtOrder = zlhisInterfaceDAL.GetVteEvalOrder(input.orderId, "");
            dynamic dyOper = new
            {
                DeptId = dtOrder.Rows[0]["科室ID"].ToString(),       
                DeptName = dtOrder.Rows[0]["科室名称"].ToString(),   
                OprtrName = dtOrder.Rows[0]["人员"].ToString(),    
                OprtrId = dtOrder.Rows[0]["人员ID"].ToString()
            };
            dynamic dataIn = new
            {
                SourceSystem = sysType,
                SourceItemId = dtOrder.Rows[0]["医嘱ID"].ToString(),
                SourceVteItemType = "1",
                OperateInfo = dyOper
            };
            string url = input.vteSystem;
          
            url += "/ZlVteInterface/RvkExePatientVteItem";
            string dataJson = Newtonsoft.Json.JsonConvert.SerializeObject(dataIn);
            string result = "";
            try
            {
                result = NewCostHjy.Common.HttpRequest.RequestDataSync(url, dataJson, AuthType.None);
            } catch (Exception ex)
            {
                return new { Result = 0, Msg = ex.Message };
            }
            JObject jObResult = JsonConvert.DeserializeObject<JObject>(result);
            return new { Result = 1, VteData = jObResult["Data"] };
        }
    }
}
