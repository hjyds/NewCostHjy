using NewCostHjy.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;


namespace NewCostHjy.Common {
    /// <summary>
    /// 基础字典定义
    /// </summary>
    public static class Const {

        /// <summary>
        /// 记录集转对象列表
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dt"></param>
        /// <returns></returns>
        public static IList<T> ConvertDataTableToIList<T>(DataTable dt) {
            IList<T> ts = new List<T>();// 定义集合
            string tempName, proType, fullName;
            foreach (DataRow dr in dt.Rows) {
                T t = (T)Activator.CreateInstance(typeof(T));
                PropertyInfo[] propertys = t.GetType().GetProperties();
                foreach (PropertyInfo pi in propertys) {
                    tempName = pi.Name;
                    try {
                        if (dt.Columns.Contains(tempName.ToUpper()) || dt.Columns.Contains(tempName.ToLower())) {
                            if (!pi.CanWrite) continue;
                            if (!dr.IsNull(tempName)) {

                                object value = dr[tempName];

                                proType = pi.PropertyType.Name;
                                if (proType == "Nullable`1") {
                                    fullName = pi.PropertyType.FullName;
                                    if (fullName.IndexOf("Decimal") > -1) {
                                        proType = "Decimal";
                                    } else if (fullName.IndexOf("Int32") > -1) {
                                        proType = "Int32";
                                    }
                                }

                                if (proType == "Decimal") {
                                    if (!dr.IsNull(tempName)) {
                                        pi.SetValue(t, Convert.ToDecimal(value), null);
                                    }
                                } else if (proType == "Int32") {
                                    if (!dr.IsNull(tempName)) {
                                        pi.SetValue(t, Convert.ToInt32(value), null);
                                    }
                                } else if (dr[tempName].GetType().ToString() == "System.DateTime") {
                                    pi.SetValue(t, Convert.ToDateTime(value).ToString("yyyy-MM-dd HH:mm:ss"), null);
                                } else {
                                    pi.SetValue(t, Convert.ToString(value), null);
                                }
                            }
                        }
                    } catch (Exception ex) {
                        throw ex;
                    }
                }
                ts.Add(t);
            } 
            return ts;
        }

        /// <summary>
        /// 获取所有基础字典定义
        /// </summary>
        /// <returns></returns>
        public static List<ValueSetValueOut> GetConst(string constName) {
            Type type = Type.GetType("ZlCostCommon.Const+" + constName + ", ZlCostCommon");
            if (type == null) { throw new Exception($"未找到基础字典【{constName}】"); }

            List<ValueSetValueOut> valueSetValueOuts = new List<ValueSetValueOut>();
            var fields = type.GetFields();
            int i = 0;
            foreach (var field in fields) {
                ValueSetValueOut valueSetValueOut = new ValueSetValueOut();
                valueSetValueOut.ValueSetValueId = field.Name;
                valueSetValueOut.ValueSetValueCode = field.GetValue(null).ToString();
                valueSetValueOut.ValueSetValueName = field.CustomAttributes.First().ConstructorArguments.First().Value.ToString();
                valueSetValueOut.ValueSetValueSno = i++;
                valueSetValueOuts.Add(valueSetValueOut);
            }
            return valueSetValueOuts;
        }

        /// <summary>
        /// 根据常量类型和常量值获取常量名称
        /// </summary>
        /// <param name="constName"></param>
        /// <param name="valueCode"></param>
        /// <returns></returns>
        public static string GetNameByConstNameValueCode(string constName, string valueCode) {
            var valueSet = GetConst(constName).SingleOrDefault(m => m.ValueSetValueCode == valueCode);
            if (valueSet == null) { throw new Exception($"在基础字典【{constName}】中未找到值【{valueCode}】"); }
            return valueSet.ValueSetValueName;
        }

        /// <summary>
        /// 名称属性定义
        /// </summary>
        public class NameAttribute : Attribute {
            public NameAttribute(string name) {
                Name = name;
            }

            public string Name { get; set; }
        }

        /// <summary>
        /// 返回结果
        /// </summary>
        public static class Result {
            /// <summary>
            /// 成功
            /// </summary>
            [Name("成功")]
            public const int Success = 1;

            /// <summary>
            /// 失败
            /// </summary>
            [Name("失败")]
            public const int Fail = 0;
        }

        /// <summary>
        /// 保存标志
        /// </summary>
        public static class SaveSign {
            /// <summary>
            /// 新增
            /// </summary>
            public const string Add = "1";

            /// <summary>
            /// 修改
            /// </summary>
            public const string Update = "2";

            /// <summary>
            /// 删除
            /// </summary>
            public const string Delete = "3";

            /// <summary>
            /// 停用
            /// </summary>
            public const string Stop = "4";

            /// <summary>
            /// 启用
            /// </summary>
            public const string Start = "5";
        }

        /// <summary>
        /// 位置类型
        /// </summary>
        public static class LocationTypeCode {
            /// <summary>
            /// 院区
            /// </summary>
            public const string HospitalDistrict = "1";

            /// <summary>
            /// 楼区
            /// </summary>
            public const string BuildingArea = "2";

            /// <summary>
            /// 楼层
            /// </summary>
            public const string Floor = "3";

            /// <summary>
            /// 房区
            /// </summary>
            public const string HousingArea = "4";

            /// <summary>
            /// 服务点
            /// </summary>
            public const string ServicePoint = "5";
        }

        /// <summary>
        /// 账户变动来源
        /// </summary>
        public static class AccountChangeOriginCode {
            /// <summary>
            /// 支付
            /// </summary>
            [Name("支付")]
            public const string Pay = "1";

            /// <summary>
            /// 预交
            /// </summary>
            [Name("预交")]
            public const string AdvancePay = "2";

            /// <summary>
            /// 记账
            /// </summary>
            [Name("记账")]
            public const string Accounting = "3";

            /// <summary>
            /// 押金收取
            /// </summary>
            [Name("押金收取")]
            public const string DepositCollect = "4";

            /// <summary>
            /// 押金退回
            /// </summary>
            [Name("押金退回")]
            public const string DepositReturn = "5";

            /// <summary>
            /// 存取
            /// </summary>
            [Name("存取")]
            public const string DepositWithdrawal = "6";

            /// <summary>
            /// 分配
            /// </summary>
            [Name("分配")]
            public const string Distribute = "7";

            /// <summary>
            /// 转住院
            /// </summary>
            [Name("转住院")]
            public const string Convertinp = "8";
        }

        /// <summary>
        /// 付款主体
        /// </summary>
        public static class AccountPayBody {
            /// <summary>
            /// 个人账户
            /// </summary>
            [Name("个人账户")]
            public const string SelfAccount = "2";

            /// <summary>
            /// 团队账户
            /// </summary>
            [Name("团队账户")]
            public const string TeamAccount = "1";

        }

        /// <summary>
        /// 住院结算状态
        /// </summary>
        public static class InpatientBalanceStatus {
            /// <summary>
            /// 部分结算
            /// </summary>
            [Name("部分结算")]
            public const string WholeBalance = "1";

            /// <summary>
            /// 全部结算
            /// </summary>
            [Name("全部结算")]
            public const string PartBalance = "2";

        }

        /// <summary>
        /// 分配方式
        /// </summary>
        public static class SurplusDistributeMode {
            /// <summary>
            /// 平均分配
            /// </summary>
            [Name("平均分配")]
            public const string AverageDistribute = "1";

            /// <summary>
            /// 定额分配
            /// </summary>
            [Name("定额分配")]
            public const string QuotaDistribute = "2";

            /// <summary>
            /// 指定分配
            /// </summary>
            [Name("指定分配")]
            public const string AppointDistribute = "3";
        }

        /// <summary>
        /// 余额类型
        /// </summary>
        public static class SurplusType {
            /// <summary>
            /// 存款
            /// </summary>
            [Name("存款")]
            public const string DepositWithdrawal = "1";

            /// <summary>
            /// 押金
            /// </summary>
            [Name("押金")]
            public const string Deposit = "2";

            /// <summary>
            /// 预交
            /// </summary>
            [Name("预交")]
            public const string AdvancePay = "3";

            /// <summary>
            /// 记账
            /// </summary>
            [Name("记账")]
            public const string Accounting = "4";

            /// <summary>
            /// 分配
            /// </summary>
            [Name("分配")]
            public const string Distribute = "5";
        }

        /// <summary>
        /// 使用状态
        /// </summary>
        public static class UseState {
            /// <summary>
            /// 未生效
            /// </summary>
            [Name("未生效")]
            public const string Ineffective = "-1";
            /// <summary>
            /// 启用
            /// </summary>
            [Name("启用")]
            public const string Enable = "1";

            /// <summary>
            /// 停用
            /// </summary>
            [Name("停用")]
            public const string Disable = "0";
        }

        /// <summary>
        /// 值集查询类型
        /// </summary>
        public static class ValueSetQueryType {
            /// <summary>
            /// Id
            /// </summary>
            [Name("Id")]
            public const string Id = "1";

            /// <summary>
            /// Code
            /// </summary>
            [Name("编码")]
            public const string Code = "2";
        }

        /// <summary>
        /// 服务点类型
        /// </summary>
        public static class ServicePointType {
            /// <summary>
            /// 收费窗口
            /// </summary>
            [Name("收费窗口")]
            public const string WorkDesk = "01";

            /// <summary>
            /// 结算窗口
            /// </summary>
            [Name("结算窗口")]
            public const string RegisterWindow = "02";

            /// <summary>
            /// 预交窗口
            /// </summary>
            [Name("账户管理")]
            public const string Account = "03";

            /// <summary>
            /// 门诊转住院
            /// </summary>
            [Name("门诊转住院")]
            public const string OutpatientToInpatient = "04";

            /// <summary>
            /// 担保
            /// </summary>
            [Name("担保管理")]
            public const string Guarantee = "05";

            /// <summary>
            /// 记账
            /// </summary>
            [Name("消费卡管理")]
            public const string ConsumerCard = "06";

            /// <summary>
            /// 电子票据
            /// </summary>
            [Name("电子票据")]
            public const string Ebill = "07";

            /// <summary>
            /// 挂号窗口
            /// </summary>
            [Name("挂号窗口")]
            public const string Register = "08";
        }

        /// <summary>
        /// 结算类型
        /// </summary>
        public static class BalanceType {
            /// <summary>
            /// 收费
            /// </summary>
            [Name("收")]
            public const int Charge = 1;
            /// <summary>
            /// 退费
            /// </summary>
            [Name("支")]
            public const int DelCharge = -1;
        }

        /// <summary>
        /// 取消结算类型
        /// </summary>
        public static class CancelBalanceType {
            /// <summary>
            /// 退费结算
            /// </summary>
            [Name("退费结算")]
            public const int DelCharge = 0;
            /// <summary>
            /// 取消结算
            /// </summary>
            [Name("取消结算")]
            public const int Cancel = 1;
            /// <summary>
            /// 作废结算
            /// </summary>
            [Name("作废结算")]
            public const int Revoke = 2;
        }

        /// <summary>
        /// 序号占用标记
        /// </summary>
        public static class OccupySign {
            /// <summary>
            /// 占用
            /// </summary>
            [Name("占用")]
            public const bool Occupy = true;

            /// <summary>
            /// 未占用
            /// </summary>
            [Name("未占用")]
            public const bool UnOccupy = false;
        }

        /// <summary>
        /// 票据使用类型
        /// </summary>
        public static class UseType {
            /// <summary>
            /// 自用
            /// </summary>
            [Name("自用")]
            public const string SelfUse = "1";

            /// <summary>
            /// 共用
            /// </summary>
            [Name("共用")]
            public const string AllUse = "2";
        }

        /// <summary>
        /// 单据号类型
        /// </summary>
        public static class NoType {
            /// <summary>
            /// 顺序号
            /// </summary>
            [Name("顺序号")]
            public const string Sno = "1";

            /// <summary>
            /// 年+序号
            /// </summary>
            [Name("年+序号")]
            public const string YearSno = "2";

            /// <summary>
            /// 年月+序号
            /// </summary>
            [Name("年月+序号")]
            public const string YearMonthSno = "3";

            /// <summary>
            /// 年月日+序号
            /// </summary>
            [Name("年月日+序号")]
            public const string YearMonthDaySno = "4";

            /// <summary>
            /// 两位年+序号
            /// </summary>
            [Name("两位年+序号")]
            public const string TwoYearSno = "5";
        }

        /// <summary>
        /// 值集ID
        /// </summary>
        public static class ValueSetID {
            /// <summary>
            /// 性别
            /// </summary>
            [Name("性别")]
            public const string Sex = "bee6b6a1-6ca2-4bce-a81e-cbd74c41fdbb";
        }

        ///<summary>
        ///患者身份识别类型
        ///</summary>
        public static class PatientDiscernType {
            /// <summary>
            /// 病人ID
            /// </summary>
            [Name("病人ID")]
            public const string PatientId = "病人ID";

            /// <summary>
            /// 聚合模式
            /// </summary>
            [Name("聚合模式")]
            public const string JoinMode = "聚合模式";
        }

        ///<summary>
        ///患者身份识别类型-住院
        ///</summary>
        public static class InPatientDiscernType {
            /// <summary>
            /// 病人ID
            /// </summary>
            [Name("病人ID")]
            public const string PatientId = "病人ID";
            /// <summary>
            /// 姓名
            /// </summary>
            [Name("姓名")]
            public const string PatientName = "姓名";
            /// <summary>
            /// 身份证号
            /// </summary>
            [Name("身份证号")]
            public const string PatientIdNumber = "身份证号";
            /// <summary>
            /// 就诊卡号
            /// </summary>
            [Name("就诊卡号")]
            public const string PatientCardNumber = "就诊卡号";
            /// <summary>
            /// 电子健康卡号
            /// </summary>
            [Name("电子健康卡号")]
            public const string ElectronicHealthCard = "电子健康卡号";
            /// <summary>
            /// 住院号
            /// </summary>
            [Name("住院号")]
            public const string InPatientNo = "住院号";
        }

        ///<summary>
        ///患者身份识别类型
        ///</summary>
        public static class AllPatientDiscernType {
            /// <summary>
            /// 病人ID
            /// </summary>
            [Name("病人ID")]
            public const string PatientId = "病人ID";
            /// <summary>
            /// 门诊号
            /// </summary>
            [Name("门诊号")]
            public const string OutPatientNo = "门诊号";
            /// <summary>
            /// 住院号
            /// </summary>
            [Name("住院号")]
            public const string InPatientNo = "住院号";
            /// <summary>
            /// 姓名
            /// </summary>
            [Name("姓名")]
            public const string PatientName = "姓名";
            /// <summary>
            /// 身份证号
            /// </summary>
            [Name("身份证号")]
            public const string PatientIdNumber = "身份证号";
            /// <summary>
            /// 就诊卡号
            /// </summary>
            [Name("就诊卡号")]
            public const string PatientCardNumber = "就诊卡号";
            /// <summary>
            /// 电子健康卡号
            /// </summary>
            [Name("电子健康卡号")]
            public const string ElectronicHealthCard = "电子健康卡号";
        }

        /// <summary>
        /// 数据操作
        /// </summary>
        public static class DataOperate {
            /// <summary>
            /// 主数据修改日志
            /// </summary>
            [Name("主数据修改日志")]
            public const string MdataModifyLog = "MdataModifyLog";
            /// <summary>
            /// 值集值
            /// </summary>
            [Name("值集值")]
            public const string ValueSetValue = "ValueSetValue";
            /// <summary>
            /// 值集
            /// </summary>
            [Name("值集")]
            public const string ValueSet = "ValueSet";

            /// <summary>
            /// 工作组
            /// </summary>
            [Name("工作组")]
            public const string WorkGroup = "WorkGroup";

            /// <summary>
            /// 工作组人员
            /// </summary>
            [Name("工作组人员")]
            public const string WorkGroupStaff = "WorkGroupStaff";

            /// <summary>
            /// 服务点
            /// </summary>
            [Name("服务点")]
            public const string ServicePoint = "ServicePoint";

            /// <summary>
            /// 服务点人员
            /// </summary>
            [Name("服务点人员")]
            public const string ServicePointStaff = "ServicePointStaff";

            /// <summary>
            /// 支付方式
            /// </summary>
            [Name("支付方式")]
            public const string PayWay = "PayWay";

            /// <summary>
            /// 规则
            /// </summary>
            [Name("规则")]
            public const string Rule = "Rule";

            /// <summary>
            ///折扣
            /// </summary>
            [Name("折扣")]
            public const string Disct = "Disct";

            /// <summary>
            ///账单规则
            /// </summary>
            [Name("账单规则")]
            public const string BillRule = "BillRule";

            /// <summary>
            ///担保人规则
            /// </summary>
            [Name("担保人规则")]
            public const string GuarantorRule = "GuarantorRule";

            /// <summary>
            ///账单内容
            /// </summary>
            [Name("账单内容")]
            public const string BillContent = "BillContent";
            /// <summary>
            ///账单内容
            /// </summary>
            [Name("费用历史数据")]
            public const string CostHistory = "CostHistory";
            /// <summary>
            ///账单内容
            /// </summary>
            [Name("费用接口日志")]
            public const string CostIntfcLog = "CostIntfcLog";
            /// <summary>
            ///费用操作日志
            /// </summary>
            [Name("费用操作日志")]
            public const string CostOperateLog = "CostOperateLog";

            /// <summary>
            ///担保记录
            /// </summary>
            [Name("担保记录")]
            public const string Guarantee = "Guarantee";

            /// <summary>
            ///担保人
            /// </summary>
            [Name("担保人")]
            public const string Guarantor = "Guarantor";

            /// <summary>
            ///担保账单
            /// </summary>
            [Name("担保账单")]
            public const string GuaranteeBill = "GuaranteeBill";


            /// <summary>
            ///账户
            /// </summary>
            [Name("账户")]
            public const string Account = "Account";

            /// <summary>
            ///单据号
            /// </summary>
            [Name("单据号")]
            public const string No = "No";

            //催款金额
            /// </summary>
            [Name("催款金额")]
            public const string ReminderAmount = "ReminderAmount";


        }

        /// <summary>
        /// 区域
        /// </summary>
        public static class AreaSign {
            /// <summary>
            /// 市
            /// </summary>
            [Name("市")]
            public const string City = "0";

            /// <summary>
            /// 区县
            /// </summary>
            [Name("区县")]
            public const string Area = "1";

            /// <summary>
            /// 街道
            /// </summary>
            [Name("街道")]
            public const string street = "2";
        }

        /// <summary>
        /// his单据类型及ID类型
        /// </summary>
        public static class HisNoOrIdType {
            /// <summary>
            /// 收费单号
            /// </summary>
            public const string FeeNo = "FeeNo";

            /// <summary>
            /// 费用ID
            /// </summary>
            public const string FeeId = "FeeId";

            /// <summary>
            /// 病人ID
            /// </summary>
            public const string Pid = "Pid";

            /// <summary>
            /// 门诊号
            /// </summary>
            public const string OutPatNo = "OutPatientNo";

            /// <summary>
            /// 住院号
            /// </summary>
            public const string InPatNo = "InPatientNo";

            /// <summary>
            /// 挂号
            /// </summary>
            public const string Register = "Register";

        }

        /// <summary>
        /// 区域等级
        /// </summary>
        public static class AreaLevel {
            /// <summary>
            /// 市
            /// </summary>
            [Name("市")]
            public const string City = "0";

            /// <summary>
            /// 区县
            /// </summary>
            [Name("区县")]
            public const string Area = "1";

            /// <summary>
            /// 街道
            /// </summary>
            [Name("街道")]
            public const string street = "2";
        }

        /// <summary>
        /// 数据库类型
        /// </summary>
        public static class DatabaseType {
            /// <summary>
            /// PG
            /// </summary>
            [Name("PG")]
            public const string PG = "PG";

            /// <summary>
            /// Oracle
            /// </summary>
            [Name("Oracle")]
            public const string Oracle = "Oracle";
        }

        /// <summary>
        /// 存取状态
        /// </summary>
        public static class DepositWithdrawalStatus {

            /// <summary>
            /// 已完成
            /// </summary>
            [Name("已完成")]
            public const string Completed = "1";

            /// <summary>
            /// 已全退
            /// </summary>
            [Name("已全退")]
            public const string Returned = "2";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";
        }

        /// <summary>
        /// 担保人状态
        /// </summary>
        public static class GuarantorStatus {
            /// <summary>
            /// 已启用
            /// </summary>
            [Name("停用")]
            public const string Paused = "0";

            /// <summary>
            /// 已启用
            /// </summary>
            [Name("启用")]
            public const string Enabled = "1";

            ///// <summary>
            ///// 已暂停
            ///// </summary>
            //[Name("暂停")]
            //public const string Paused = "2";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("作废")]
            public const string Invalid = "9";
        }

        /// <summary>
        /// 担保状态
        /// </summary>
        public static class GuaranteeStatusCode {
            /// <summary>
            /// 启用
            /// </summary>
            [Name("启用")]
            public const string Enabled = "1";

            /// <summary>
            /// 停用
            /// </summary>
            [Name("停用")]
            public const string Paused = "0";

            /// <summary>
            /// 作废
            /// </summary>
            [Name("作废")]
            public const string Invalid = "9";
        }

        /// <summary>
        /// 病人类别
        /// </summary>
        public static class Category {
            /// <summary>
            /// 门诊
            /// </summary>
            [Name("门诊")]
            public const string OutPatient = "01";

            /// <summary>
            /// 住院
            /// </summary>
            [Name("住院")]
            public const string InPatient = "02";
        }

        /// <summary>
        /// 病人来源
        /// </summary>
        public static class PatOrigin {
            /// <summary>
            /// 门诊
            /// </summary>
            [Name("门诊")]
            public const string OutPatient = "01";

            /// <summary>
            /// 住院
            /// </summary>
            [Name("住院")]
            public const string InPatient = "02";

            /// <summary>
            /// 体检
            /// </summary>
            [Name("体检")]
            public const string Medical = "03";

            /// <summary>
            /// 留观
            /// </summary>
            [Name("留观")]
            public const string UnderObservation = "04";

            /// <summary>
            /// 预入院
            /// </summary>
            [Name("预入院")]
            public const string PreInPatient = "05";
        }

        /// <summary>
        /// 电子票据业务标识
        /// </summary>
        public static class EBillType {
            /// <summary>
            /// 门诊
            /// </summary>
            [Name("门诊")]
            public const string OutPatient = "01";

            /// <summary>
            /// 住院
            /// </summary>
            [Name("住院")]
            public const string InPatient = "02";

            /// <summary>
            /// 体检
            /// </summary>
            [Name("体检")]
            public const string Medical = "03";

            /// <summary>
            /// 留观
            /// </summary>
            [Name("留观")]
            public const string UnderObservation = "04";

            /// <summary>
            /// 预入院
            /// </summary>
            [Name("预入院")]
            public const string PreInPatient = "05";

            /// <summary>
            /// 挂号
            /// </summary>
            [Name("挂号")]
            public const string Register = "06";

            /// <summary>
            /// 门诊预交金
            /// </summary>
            [Name("门诊预交金")]
            public const string OutPatientAdvance = "07";

            /// <summary>
            /// 住院预交金
            /// </summary>
            [Name("住院预交金")]
            public const string InPatientAdvance = "08";

            /// <summary>
            /// 体检预交金
            /// </summary>
            [Name("体检预交金")]
            public const string MedicalAdvance = "09";
        }

        /// <summary>
        /// 消费卡状态
        /// </summary>
        public static class ConsumerCardStatus {
            /// <summary>
            /// 停用
            /// </summary>
            [Name("停用")]
            public const string Disable = "0";

            /// <summary>
            /// 在用
            /// </summary>
            [Name("在用")]
            public const string Enable = "1";

            /// <summary>
            /// 回收
            /// </summary>
            [Name("已回收")]
            public const string Recoverd = "2";

            /// <summary>
            /// 作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";
        }

        /// <summary>
        /// 消费卡充值状态
        /// </summary>
        public static class ConsumerCardRechargeStatus {
            /// <summary>
            /// 已完成
            /// </summary>
            [Name("已完成")]
            public const string Completed = "1";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";



        }

        /// <summary>
        /// 结算主体
        /// </summary>
        public static class BalanceBody {
            /// <summary>
            /// 团队
            /// </summary>
            [Name("团队")]
            public const string Team = "1";
            /// <summary>
            /// 个人
            /// </summary>
            [Name("个人")]
            public const string Person = "2";
        }

        /// <summary>
        /// 账单类型
        /// </summary>
        public static class BillType {
            /// <summary>
            /// 收费
            /// </summary>
            [Name("收")]
            public const string Charge = "1";
            /// <summary>
            /// 退费
            /// </summary>
            [Name("支")]
            public const string DelCharge = "-1";
        }

        /// <summary>
        /// 电子票据类型
        /// </summary>
        public static class ElectronicBillType {
            /// <summary>
            /// 新开
            /// </summary>
            [Name("新开")]
            public const string Charge = "01";
            /// <summary>
            /// 红票
            /// </summary>
            [Name("红票")]
            public const string DelCharge = "02";
        }

        /// <summary>
        /// 担保账单状态
        /// </summary>
        public static class GuaranteeBillType {
            /// <summary>
            /// 收费
            /// </summary>
            [Name("收")]
            public const int Charge = 1;
            /// <summary>
            /// 退费
            /// </summary>
            [Name("支")]
            public const int DelCharge = -1;
        }

        /// <summary>
        /// 账单状态
        /// </summary>
        public static class BillStatus {
            /// <summary>
            /// 已生成
            /// </summary>
            [Name("已生成")]
            public const string Created = "0";

            /// <summary>
            /// 已结算
            /// </summary>
            [Name("已结算")]
            public const string Balanced = "1";

            /// <summary>
            /// 部分退费
            /// </summary>
            [Name("部分退费")]
            public const string PartRefund = "2";

            /// <summary>
            /// 全部退费
            /// </summary>
            [Name("全部退费")]
            public const string AllRefund = "3";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Canceled = "9";
        }

        /// <summary>
        /// 账单支付状态
        /// </summary>
        public static class BillPayStatus {
            /// <summary>
            /// 未支付
            /// </summary>
            [Name("未支付")]
            public const string NoBalance = "0";
            /// <summary>
            /// 已记账
            /// </summary>
            [Name("已记账")]
            public const string Accounted = "1";
            /// <summary>
            /// 已担保
            /// </summary>
            [Name("已担保")]
            public const string Guaranteed = "2";
            /// <summary>
            /// 已支付
            /// </summary>
            [Name("已支付")]
            public const string Balanced = "3";
            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";
            /// <summary>
            /// 部分作废
            /// </summary>
            [Name("部分作废")]
            public const string PartInvalid = "10";
        }

        /// <summary>
        /// 账户变动类别
        /// </summary>
        public static class AccountChangeCategory {
            /// <summary>
            /// 收
            /// </summary>
            [Name("收")]
            public const int Collect = 1;
            /// <summary>
            /// 支
            /// </summary>
            [Name("支")]
            public const int Return = -1;
        }

        /// <summary>
        /// 折扣时机
        /// </summary>
        public static class DiscountOpportunity {
            /// <summary>
            /// 计费时
            /// </summary>
            [Name("计费时")]
            public const string Charging = "1";

            /// <summary>
            /// 结算时
            /// </summary>
            [Name("结算时")]
            public const string Settlement = "2";
        }

        /// <summary>
        /// 押金状态
        /// </summary>
        public static class DepositCollectStatus {

            /// <summary>
            /// 已收取
            /// </summary>
            [Name("已收取")]
            public const string Collected = "1";

            /// <summary>
            /// 部分退回
            /// </summary>
            [Name("部分退回")]
            public const string PartReturn = "2";

            /// <summary>
            /// 已退回
            /// </summary>
            [Name("已退回")]
            public const string Returned = "3";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";
        }

        /// <summary>
        /// 消费卡充值类别
        /// </summary>
        public static class ConsumerCardRechargeCategoryCod {
            /// <summary>
            /// 收费
            /// </summary>
            [Name("收")]
            public const int Income = 1;

            /// <summary>
            /// 退费
            /// </summary>
            [Name("支")]
            public const int Back = -1;

        }

        /// <summary>
        /// 消费卡充值类别
        /// </summary>
        public static class ConsumerCardPayTypeCode {
            /// <summary>
            /// 收费
            /// </summary>
            [Name("收")]
            public const int Income = 1;

            /// <summary>
            /// 退费
            /// </summary>
            [Name("支")]
            public const int Back = -1;

        }

        /// <summary>
        /// 消费卡充值类型
        /// </summary>
        public static class ConsumerCardRechargeType {
            /// <summary>
            /// 面额
            /// </summary>
            [Name("面额")]
            public const string ParValue = "1";

            /// <summary>
            /// 余额
            /// </summary>
            [Name("余额")]
            public const string Surplus = "2";
        }

        /// <summary>
        /// 折扣类型
        /// </summary>
        public static class DiscountType {
            /// <summary>
            /// 汇总
            /// </summary>
            [Name("汇总")]
            public const string Summary = "1";

            /// <summary>
            /// 分项
            /// </summary>
            [Name("分项")]
            public const string SubItem = "2";
        }

        /// <summary>
        /// 折扣方式
        /// </summary>
        public static class DiscountMode {
            /// <summary>
            /// 减固定
            /// </summary>
            [Name("减固定")]
            public const string FixedSubtraction = "1";

            /// <summary>
            /// 按比例
            /// </summary>
            [Name("按比例")]
            public const string ByComparison = "2";
            /// <summary>
            /// 满减
            /// </summary>
            [Name("满减")]
            public const string FullRduction = "3";
        }

        /// 转住院状态
        /// </summary>
        public static class ConvertinpStatus {
            /// <summary>
            /// 未转入
            /// </summary>
            [Name("未转入")]
            public const string Review = "1";

            /// <summary>
            /// 已转入
            /// </summary>
            [Name("已转入")]
            public const string TransferIn = "2";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";
        }

        /// <summary>
        /// 消费卡充值记录支付状态
        /// </summary>
        public static class ConsumerCardRechargePayStatus {
            /// <summary>
            /// 已开始
            /// </summary>
            [Name("已开始")]
            public const string Started = "0";


            /// <summary>
            /// 已成功
            /// </summary>
            [Name("已成功")]
            public const string Succeed = "1";

            /// <summary>
            /// 已失败
            /// </summary>
            [Name("已失败")]
            public const string Fail = "2";
        }

        /// <summary>
        /// 规则类型编码
        /// </summary>
        public static class RuleTypeCode {
            /// <summary>
            /// 担保人
            /// </summary>
            [Name("担保人")]
            public const string Guarantor = "Guarantor";


            /// <summary>
            /// 担保
            /// </summary>
            [Name("担保")]
            public const string Guarantee = "Guarantee";

            /// <summary>
            /// 折扣
            /// </summary>
            [Name("折扣")]
            public const string Discount = "Discount";

            /// <summary>
            /// 消费卡
            /// </summary>
            [Name("消费卡")]
            public const string ConsumerCard = "ConsumerCard";

            /// <summary>
            /// 转住院
            /// </summary>
            [Name("转住院")]
            public const string ConvertInpatient = "ConvertInpatient";

            /// <summary>
            /// 账户
            /// </summary>
            [Name("账户")]
            public const string Account = "Account";

            /// <summary>
            /// 预警
            /// </summary>
            [Name("预警")]
            public const string CostWarning = "CostWarning";

            /// <summary>
            /// 催款
            /// </summary>
            [Name("催款")]
            public const string CostReminder = "CostReminder";

            /// <summary>
            /// 催款金额
            /// </summary>
            [Name("催款金额")]
            public const string ReminderAmount = "ReminderAmount";
        }

        /// <summary>
        /// 比较符
        /// </summary>
        public static class Symbol {
            /// <summary>
            /// 大于
            /// </summary>
            [Name("大于")]
            public const string GreaterThan = ">";

            /// <summary>
            /// 大于等于
            /// </summary>
            [Name("大于等于")]
            public const string GreaterThanEqual = ">=";


            /// <summary>
            /// 小于
            /// </summary>
            [Name("小于")]
            public const string LessThan = "<";

            /// <summary>
            /// 小于等于
            /// </summary>
            [Name("小于等于")]
            public const string LessThanEqual = "<=";

            /// <summary>
            /// 等于
            /// </summary>
            [Name("等于")]
            public const string Equal = "=";

            /// <summary>
            /// 不等于
            /// </summary>
            [Name("不等于")]
            public const string NotEqual = "!=";

            /// <summary>
            /// 包含
            /// </summary>
            //[Name("包含")]
            //public const string Contain = "In";

            ///// <summary>
            ///// 不包含
            ///// </summary>
            //[Name("不包含")]
            //public const string NotContain = "Not In";

            /// <summary>
            /// 模糊匹配
            /// </summary>
            //[Name("模糊匹配")]
            //public const string FuzzyMatche = "Like";
        }

        /// <summary>
        /// 关系符
        /// </summary>
        public static class RelationshipSymbol {
            /// <summary>
            /// 或者
            /// </summary>
            [Name("或者")]
            public const string Or = "Or";


            /// <summary>
            /// 并且
            /// </summary>
            [Name("并且")]
            public const string And = "And";


        }

        /// <summary>
        /// 左括号
        /// </summary>
        public static class LeftBrackets {
            /// <summary>
            /// 左括号
            /// </summary>
            [Name("左括号1")]
            public const string LeftBracket1 = "(";


            /// <summary>
            /// 左括号
            /// </summary>
            [Name("左括号2")]
            public const string LeftBracket2 = "((";

            /// <summary>
            /// 左括号
            /// </summary>
            [Name("左括号3")]
            public const string LeftBracket3 = "(((";
        }

        /// <summary>
        /// 右括号
        /// </summary>
        public static class RightBracket {
            /// <summary>
            /// )
            /// </summary>
            [Name("右括号1")]
            public const string RightBracket1 = ")";


            /// <summary>
            /// ))
            /// </summary>
            [Name("右括号2")]
            public const string RightBracket2 = "))";

            /// <summary>
            /// )))
            /// </summary>
            [Name("右括号3")]
            public const string RightBracket3 = ")))";

        }

        /// <summary>
        /// 患者基础信息
        /// </summary>
        public static class PatientBasicInfo {
            /// <summary>
            /// 婚姻
            /// </summary>
            [Name("婚姻")]
            public const string Marital = "Marital";


            /// <summary>
            /// 性别
            /// </summary>
            [Name("性别")]
            public const string Sex = "Sex";

            /// <summary>
            /// 职业
            /// </summary>
            [Name("职业")]
            public const string Occupation = "Occupation";


            /// <summary>
            /// 国籍
            /// </summary>
            [Name("国籍")]
            public const string Nationality = "Nationality";


            /// <summary>
            /// 开单科室
            /// </summary>
            [Name("开单科室")]
            public const string BillingDepartmentId = "BillingDepartmentId";

        }

        /// <summary>
        /// 患者基础信息
        /// </summary>
        public static class BasicFeeInfo {
            /// <summary>
            /// 开单科室
            /// </summary>
            [Name("开单科室")]
            public const string BillingDepartmentId = "BillingDepartmentId";

            /// <summary>
            /// 收费项目
            /// </summary>
            [Name("收费项目")]
            public const string ChargesName = "ChargesName";


            /// <summary>
            /// 收费项目类别
            /// </summary>
            [Name("收费项目类别")]
            public const string ChargeCategory = "ChargeCategory";



        }

        /// <summary>
        /// 结算状态
        /// </summary>
        public static class BalanceStatus {
            /// <summary>
            /// 开始结算
            /// </summary>
            [Name("开始结算")]
            public const string StartBalance = "0";

            /// <summary>
            /// 结算完成
            /// </summary>
            [Name("结算完成")]
            public const string BalanceEnd = "1";

            /// <summary>
            /// 欠费结算
            /// </summary>
            [Name("欠费结算")]
            public const string ArrearsBalance = "2";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";

        }

        /// <summary>
        /// 结算欠费状态
        /// </summary>
        public static class BalanceArrearsStatus {
            /// <summary>
            /// 已生成
            /// </summary>
            [Name("已生成")]
            public const string Generated = "0";

            /// <summary>
            /// 已缴清
            /// </summary>
            [Name("已缴清")]
            public const string Paid = "1";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";

        }

        /// <summary>
        /// 结算支付状态
        /// </summary>
        public static class BalancePayStatus {
            /// <summary>
            /// 未支付
            /// </summary>
            [Name("未支付")]
            public const string NotPay = "0";

            /// <summary>
            /// 部份支付
            /// </summary>
            [Name("部份支付")]
            public const string PartPay = "1";

            /// <summary>
            /// 完成支付
            /// </summary>
            [Name("完成支付")]
            public const string FinishPay = "2";


        }

        /// <summary>
        /// 支付方式类别
        /// </summary>
        public static class PayWayCategory {
            /// <summary>
            /// 现金
            /// </summary>
            [Name("现金")]
            public const string Cash = "0";

            /// <summary>
            /// 账户
            /// </summary>
            [Name("账户")]
            public const string Account = "1";

            /// <summary>
            /// 医保
            /// </summary>
            [Name("医保")]
            public const string Insurance = "2";

            /// <summary>
            /// 三方
            /// </summary>
            [Name("三方")]
            public const string Tripartite = "3";

            /// <summary>
            /// 支票
            /// </summary>
            [Name("支票")]
            public const string Check = "4";

            /// <summary>
            /// 消费卡
            /// </summary>
            [Name("消费卡")]
            public const string ConsumerCard = "5";

            /// <summary>
            /// 其他非医保结算
            /// </summary>
            [Name("其他非医保结算")]
            public const string NotTripartite = "6";

            /// <summary>
            /// 医院充值
            /// </summary>
            [Name("医院充值")]
            public const string HospitalRecharge = "7";

            /// <summary>
            /// 银行卡
            /// </summary>
            [Name("银行卡")]
            public const string BankCard = "8";

        }

        /// <summary>
        /// 支付请求类型
        /// </summary>
        public static class PayTripartiteRequestType {
            /// <summary>
            /// 结算
            /// </summary>
            [Name("结算")]
            public const string Balance = "0";

            /// <summary>
            /// 预交
            /// </summary>
            [Name("预交")]
            public const string Expect = "1";

            /// <summary>
            /// 押金
            /// </summary>
            [Name("押金")]
            public const string DepositCollect = "2";

            /// <summary>
            /// 存取
            /// </summary>
            [Name("存取")]
            public const string Withdrawal = "3";

            /// <summary>
            /// 消费卡
            /// </summary>
            [Name("消费卡")]
            public const string ConsumerCard = "4";

        }

        /// <summary>
        /// 存取类型
        /// </summary>
        public static class DepositWithdrawalType {
            /// <summary>
            /// 账户存款
            /// </summary>
            [Name("账户存款")]
            public const string DepositWithdrawalCollect = "1";

            /// <summary>
            /// 账户取款
            /// </summary>
            [Name("账户取款")]
            public const string DepositWithdrawalReturn = "2";
        }

        /// <summary>
        /// 三方支付类别
        /// </summary>
        public static class PayTripartiteCategory {
            /// <summary>
            /// 支付宝
            /// </summary>
            [Name("支付宝")]
            public const string Alipay = "Alipay";

            /// <summary>
            /// 微信
            /// </summary>
            [Name("微信")]
            public const string WeChat = "WeChat";

            /// <summary>
            /// POS机
            /// </summary>
            [Name("POS机")]
            public const string Pos = "Pos";

        }

        /// <summary>
        /// 三方支付状态
        /// </summary>
        public static class PayTripartiteStatus {
            /// <summary>
            /// 未支付
            /// </summary>
            [Name("未支付")]
            public const string Unpaid = "0";

            /// <summary>
            /// 支付失败
            /// </summary>
            [Name("支付失败")]
            public const string Fail = "1";
            /// <summary>
            /// 支付超时
            /// </summary>
            [Name("支付超时")]
            public const string Overtime = "2";

        }

        /// <summary>
        /// 担保账单状态
        /// </summary>
        public static class GuaranteeBillStsutsCode {
            /// <summary>
            /// 有效
            /// </summary>
            [Name("有效")]
            public const string Effective = "1";

            /// <summary>
            /// 转记账
            /// </summary>
            [Name("转记账")]
            public const string TransAccounting = "2";

            /// <summary>
            /// 已结算
            /// </summary>
            [Name("已结算")]
            public const string Balanced = "3";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";
        }

        /// <summary>
        /// 支付状态
        /// </summary>
        public static class PayStatus {
            /// <summary>
            /// 已开始
            /// </summary>
            [Name("已开始")]
            public const string Start = "0";

            /// <summary>
            /// 已成功
            /// </summary>
            [Name("已成功")]
            public const string Success = "1";
            /// <summary>
            /// 已失败
            /// </summary>
            [Name("已失败")]
            public const string Fail = "2";

        }

        /// <summary>
        /// 消费卡类型
        /// </summary>
        public static class ConsumerCardType {
            /// <summary>
            /// 充值卡
            /// </summary>
            [Name("充值卡")]
            public const string RechargeCard = "1";

            /// <summary>
            /// 非充值卡
            /// </summary>
            [Name("非充值卡")]
            public const string NotRechargeCard = "0";
        }

        /// <summary>
        /// 账户充值类型
        /// </summary>
        public static class AccountChargeType {
            /// <summary>
            /// 账户存款
            /// </summary>
            [Name("账户存款")]
            public const string AccountCharge = "1";

            /// <summary>
            /// 账户押金
            /// </summary>
            [Name("账户押金")]
            public const string AccountDepositClct = "2";
        }

        /// <summary>
        /// 账户查找信息
        /// </summary>
        public static class AccountSearchType {
            /// <summary>
            /// 病人ID
            /// </summary>
            [Name("病人ID")]
            public const string AccountPayBodyId = "1";

            /// <summary>
            /// 病人姓名
            /// </summary>
            [Name("病人姓名")]
            public const string AccountPayBodyName = "2";
        }

        /// <summary>
        /// 金额类型
        /// </summary>
        public static class AmountType {
            /// <summary>
            /// 面额
            /// </summary>
            [Name("面额")]
            public const string CardParValue = "1";

            /// <summary>
            /// 充值
            /// </summary>
            [Name("充值")]
            public const string CardSuply = "2";
        }

        /// <summary>
        /// 日结上缴状态
        /// </summary>
        public static class DailySettlementStatus {

            /// <summary>
            /// 已上缴
            /// </summary>
            [Name("已上缴")]
            public const string Submitted = "1";

            /// <summary>
            /// 已审核
            /// </summary>
            [Name("已审核")]
            public const string Received = "2";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";


        }

        /// <summary>
        /// 日结状态
        /// </summary>
        public static class DailyBalanceStatus {
            /// <summary>
            /// 未上缴
            /// </summary>
            [Name("未上缴")]
            public const string NotHandedIn = "0";

            /// <summary>
            /// 部分上缴
            /// </summary>
            [Name("部分上缴")]
            public const string PartSubmitted = "1";

            /// <summary>
            /// 已上缴
            /// </summary>
            [Name("已上缴")]
            public const string Submitted = "2";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";

        }

        /// <summary>
        /// 结算场景
        /// </summary>
        public static class BalanceScene {
            /// <summary>
            /// 挂号结算
            /// </summary>
            [Name("挂号结算")]
            public const string RegisterBalance = "0";

            /// <summary>
            /// 门诊结算
            /// </summary>
            [Name("门诊结算")]
            public const string OutPatientBalance = "1";

            /// <summary>
            /// 出院结算
            /// </summary>
            [Name("出院结算")]
            public const string DischargedBalance = "2";

            /// <summary>
            /// 中途结算
            /// </summary>
            [Name("中途结算")]
            public const string MidwayBalance = "3";

            /// <summary>
            /// 医疗卡发放
            /// </summary>
            [Name("医疗卡发放")]
            public const string CardBalance = "4";
        }

        /// <summary>
        /// 支付类型
        /// </summary>
        public static class PayType {
            /// <summary>
            /// 收费
            /// </summary>
            [Name("收")]
            public const int Income = 1;

            /// <summary>
            /// 退费
            /// </summary>
            [Name("支")]
            public const int Back = -1;

        }

        /// <summary>
        /// 门诊结算场景
        /// </summary>
        public static class OutPatientBalanceScene {
            /// <summary>
            /// 挂号结算
            /// </summary>
            [Name("挂号结算")]
            public const string RegisterBalance = "0";

            /// <summary>
            /// 门诊结算
            /// </summary>
            [Name("门诊结算")]
            public const string OutPatientBalance = "1";

            /// <summary>
            /// 医疗卡发放
            /// </summary>
            [Name("医疗卡发放")]
            public const string CardBalance = "4";
        }

        /// <summary>
        /// 住院结算场景
        /// </summary>
        public static class InPatientBalanceScene {
            /// <summary>
            /// 出院结算
            /// </summary>
            [Name("出院结算")]
            public const string DischargedBalance = "2";

            /// <summary>
            /// 中途结算
            /// </summary>
            [Name("中途结算")]
            public const string MidwayBalance = "3";
        }

        /// <summary>
        /// 销账状态
        /// </summary>
        public static class BillVoidStatus {
            /// <summary>
            /// 已申请
            /// </summary>
            [Name("已申请")]
            public const string Supply = "0";

            /// <summary>
            /// 审核已通过
            /// </summary>
            [Name("审核已通过")]
            public const string ReviewY = "1";

            /// <summary>
            /// 审核未通过
            /// </summary>
            [Name("审核未通过")]
            public const string ReviewN = "2";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";
        }

        /// <summary>
        /// 交易方式
        /// </summary>
        public static class PayOrigin {
            /// <summary>
            /// 结算
            /// </summary>
            [Name("结算")]
            public const string Settlement = "1";

            /// <summary>
            /// 存取
            /// </summary>
            [Name("存款")]
            public const string Access = "2";
            /// <summary>
            /// 预交
            /// </summary>
            [Name("预交")]
            public const string PayInAdvance = "3";

            /// <summary>
            /// 押金
            /// </summary>
            [Name("押金")]
            public const string Deposit = "4";
            /// <summary>
            /// 充值
            /// </summary>
            [Name("消费卡")]
            public const string Recharge = "5";

        }

        /// <summary>
        /// 日志状态
        /// </summary>
        public class LogStatusCode {
            /// <summary>
            /// 输入 
            /// </summary>
            [Name("输入")]
            public const string In = "1";

            /// <summary>
            /// 转码输入
            /// </summary>
            [Name("转码输入")]
            public const string TranscodeIn = "2";

            /// <summary>
            /// 输出 
            /// </summary>
            [Name("输出")]
            public const string Out = "3";

            /// <summary>
            /// 转码输出
            /// </summary>
            [Name("转码输出")]
            public const string TranscodeOut = "4";
        }

        /// <summary>
        /// 接口方向
        /// </summary>
        public class InterfaceDirectionCode {
            /// <summary>
            /// 调用 
            /// </summary>
            [Name("调用")]
            public const string Call = "Call";

            /// <summary>
            /// 被调用
            /// </summary>
            [Name("被调用")]
            public const string Called = "Called";
        }

        /// <summary>
        /// 收费预交处理场景
        /// </summary>
        public class AdvancePayScene {
            /// <summary>
            /// 收费
            /// </summary>
            [Name("收费")]
            public const string Charge = "1";

            /// <summary>
            /// 退费
            /// </summary>
            [Name("退费")]
            public const string DelCharge = "2";

            /// <summary>
            /// 返还
            /// </summary>
            [Name("返还")]
            public const string Return = "3";

            /// <summary>
            /// 预交分配到收费账单
            /// </summary>
            [Name("预交分配到收费账单")]
            public const string AdvancePayCharge = "4";
        }

        /// <summary>
        /// 担保类型
        /// </summary>
        public static class GuarantorType {
            /// <summary>
            /// 内部担保
            /// </summary>
            [Name("内部担保")]
            public const string InsideGuarantee = "1";

            /// <summary>
            /// 团队担保
            /// </summary>
            [Name("团队担保")]
            public const string TeamGuarantee = "2";

            /// <summary>
            /// 私人担保
            /// </summary>
            [Name("私人担保")]
            public const string PrivateGuarantee = "3";
        }

        /// <summary>
        /// 担保分配方式
        /// </summary>
        public static class GuaranteeDistributeMode {
            /// <summary>
            /// 平均分配
            /// </summary>
            [Name("平均分配")]
            public const string AverageDistribute = "1";

            /// <summary>
            /// 定额分配
            /// </summary>
            [Name("定额分配")]
            public const string QuotaDistribute = "2";

            /// <summary>
            /// 指定分配
            /// </summary>
            [Name("指定分配")]
            public const string AppointDistribute = "3";
        }

        /// <summary>
        /// 担保记录分配状态
        /// </summary>
        public class GuaranteeDistributeStatus {
            /// <summary>
            /// 收费
            /// </summary>
            [Name("收费")]
            public const string Complete = "1";

            /// <summary>
            /// 作废
            /// </summary>
            [Name("作废")]
            public const string Invalid = "9";

        }

        /// <summary>
        /// 电子票据状态
        /// </summary>
        public class ElectronicStatus {
            /// <summary>
            /// 待开票
            /// </summary>
            [Name("待开票")]
            public const string Started = "0";

            /// <summary>
            /// 已完成
            /// </summary>
            [Name("已完成")]
            public const string Complete = "1";

            /// <summary>
            /// 已冲红
            /// </summary>
            [Name("已冲红")]
            public const string Invalid = "3";

            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Canceled = "9";
        }

        /// <summary>
        /// 开票场景
        /// </summary>
        public static class ElectronicScene {
            /// <summary>
            /// 挂号
            /// </summary>
            [Name("挂号")]
            public const string Register = "0";
            /// <summary>
            /// 门诊
            /// </summary>
            [Name("门诊收费")]
            public const string OutPatient = "1";
            /// <summary>
            /// 住院
            /// </summary>
            [Name("出院结算")]
            public const string InPatient = "2";
            /// <summary>
            /// 中途结算
            /// </summary>
            [Name("中途结算")]
            public const string MidwaySettlement = "3";
            /// <summary>
            /// 消费卡
            /// </summary>
            //[Name("消费卡")]
            //public const string ConsumerCard = "4";
            /// <summary>
            /// 预交
            /// </summary>
            [Name("住院预交")]
            public const string Prepay = "5";
        }

        /// <summary>
        /// 支付方式场合
        /// </summary>
        public static class PayWayOcas {
            /// <summary>
            /// 挂号
            /// </summary>
            [Name("挂号")]
            public const string Register = "0";

            /// <summary>
            /// 门诊
            /// </summary>
            [Name("门诊")]
            public const string OutPatient = "1";

            /// <summary>
            /// 住院
            /// </summary>
            [Name("住院")]
            public const string InPatient = "2";

            /// <summary>
            /// 就诊卡
            /// </summary>
            [Name("就诊卡")]
            public const string VisitCard = "3";

            /// <summary>
            /// 消费卡
            /// </summary>
            [Name("消费卡")]
            public const string ConsumerCard = "4";

            /// <summary>
            /// 账户
            /// </summary>
            [Name("账户")]
            public const string Account = "5";
        }

        /// <summary>
        /// 折扣方案
        /// </summary>
        public static class DiscountChoiceMode {
            /// <summary>
            /// 最优折扣
            /// </summary>
            [Name("最优折扣")]
            public const string BestDiscount = "1";

            /// <summary>
            /// 顺序折上折
            /// </summary>
            [Name("顺序折上折")]
            public const string OrderFoldUp = "2";
        }

        /// <summary>
        /// 医院充值类型
        /// </summary>
        public static class HospitalChrgType {
            /// <summary>
            /// 转住院
            /// </summary>
            [Name("转住院")]
            public const string TransferToHospital = "01";

            /// <summary>
            /// 退账户
            /// </summary>
            [Name("退账户")]
            public const string RefundAccount = "02";
        }

        /// <summary>
        /// 三方支付交易结果编码
        /// </summary>
        public static class TripartitePayResponse {
            /// <summary>
            /// 成功
            /// </summary>
            [Name("成功")]
            public const string Success = "10000";

            /// <summary>
            /// 失败
            /// </summary>
            [Name("失败")]
            public const string Fail = "40004";

            /// <summary>
            /// 超时
            /// </summary>
            [Name("超时")]
            public const string OverTime = "20000";
        }

        /// <summary>
        /// 特殊账单来源
        /// </summary>
        public static class SpecialBillOrigin {
            /// <summary>
            /// 自动计费
            /// </summary>
            [Name("自动计费")]
            public const string AutoBill = "AutoBill";

            /// <summary>
            /// 挂号
            /// </summary>
            [Name("挂号")]
            public const string Register = "Register";

            /// <summary>
            /// 卡费
            /// </summary>
            [Name("卡费")]
            public const string Card = "Card";
        }

        /// <summary>
        /// 电子票据核对类型
        /// </summary>
        public static class ElectronicChkType {
            /// <summary>
            /// 总数核对
            /// </summary>
            [Name("总数核对")]
            public const string All = "0";
            /// <summary>
            /// 退费核对
            /// </summary>
            [Name("退费核对")]
            public const string WriteOff = "1";

        }

        /// <summary>
        /// 电子票据开具结果
        /// </summary>
        public static class ElectronicResult {
            /// <summary>
            /// 开票失败
            /// </summary>
            [Name("开票失败")]
            public const string Fail = "1";
        }

        /// <summary>
        /// 电子票据核对结果
        /// </summary>
        public static class ElectronicChkResult {
            /// <summary>
            /// 核对成功
            /// </summary>
            [Name("核对成功")]
            public const string Success = "1";
            /// <summary>
            /// 核对失败
            /// </summary>
            [Name("核对失败")]
            public const string Fail = "0";
        }

        /// <summary>
        /// 电子票据修正结果
        /// </summary>
        public static class ElectronicCorrectResult {
            /// <summary>
            /// 修正成功
            /// </summary>
            [Name("修正成功")]
            public const string Success = "1";
            /// <summary>
            /// 修正失败
            /// </summary>
            [Name("修正失败")]
            public const string Fail = "0";
        }

        /// <summary>
        /// 电子票据修正结果
        /// </summary>
        public static class ElectronicCorrectCategory {
            /// <summary>
            /// 无需修正
            /// </summary>
            [Name("无需修正")]
            public const string Noops = "0";

            /// <summary>
            /// 修正HIS数据
            /// </summary>
            [Name("平帐修正")]
            public const string Correct = "01";

            /// <summary>
            /// 冲红HIS
            /// </summary>
            [Name("冲红HIS")]
            public const string WriteOffHIS = "02";
            /// <summary>
            /// 冲红重开
            /// </summary>
            [Name("冲红重开")]
            public const string ReversalOpen = "03";
            /// <summary>
            /// 重开
            /// </summary>
            [Name("重开")]
            public const string Reopen = "04";
        }

        /// <summary>
        /// 值集系统标记
        /// </summary>
        public static class ValueSetSystemSign {
            /// <summary>
            /// 用户定义值集
            /// </summary>
            [Name("用户定义值集")]
            public const string UserDefined = "0";

            /// <summary>
            /// 系统固定值集
            /// </summary>
            [Name("系统固定值集")]
            public const string SystemFixed = "1";
            /// <summary>
            /// 冲红重开
            /// </summary>
            [Name("系统可修改值集")]
            public const string SystemModifiable = "2";
        }

        /// <summary>
        /// 催款状态编码
        /// </summary>已作废
        public static class ReminderStatus {
            /// <summary>
            /// 待催款
            /// </summary>
            [Name("待催款")]
            public const string StayDunned = "0";

            /// <summary>
            /// 已催款
            /// </summary>
            [Name("已催款")]
            public const string Dunned = "1";
            /// <summary>
            /// 已作废
            /// </summary>
            [Name("已作废")]
            public const string Invalid = "9";
        }

        /// <summary>
        /// 规则结果值
        /// </summary>
        public static class ResultValue {

            /// <summary>
            /// 禁止
            /// </summary>
            [Name("禁止")]
            public const string Prohibit = "1";

            /// <summary>
            /// 允许
            /// </summary>
            [Name("提醒")]
            public const string Remind = "2";


        }

        /// <summary>
        /// 结算性质
        /// </summary>
        public static class BalanceProp {

            /// <summary>
            /// 门诊
            /// </summary>
            [Name("门诊")]
            public const string OutPatient = "01";

            /// <summary>
            /// 住院
            /// </summary>
            [Name("住院")]
            public const string InPatient = "02";
        }

        /// <summary>
        /// 系统固有支付方式编码
        /// </summary>
        public static class SysPayWayCode {
            /// <summary>
            /// 医保个人帐户
            /// </summary>
            [Name("医保个人帐户")]
            public const string InsuranceAccountPay = "004";

            /// <summary>
            /// 医保统筹支付
            /// </summary>
            [Name("医保统筹支付")]
            public const string InsuranceOverallPay = "003";

            /// <summary>
            /// 转住院充值
            /// </summary>
            [Name("转住院充值")]
            public const string TurnInpRecharge = "900";

            /// <summary>
            /// 转住院结算
            /// </summary>
            [Name("转住院结算")]
            public const string TurnInpBalance = "901";
        }

        public static class HjyDataBaseConnStr {
            /// <summary>
            /// 33.6对应的WEB病历库
            /// </summary>
            public const string WEBEMR336 = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.32.136)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=WEBEMR)));User ID=zlemr;Password=zlkbc.2024;Statement Cache Size=100;Max Pool Size=300;Min Pool Size=1";

            /// <summary>
            /// 33.6对应的ZLHIS数据库
            /// </summary>
            public const string ZLHIS336 = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.33.6)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=ORC2COST2)));User Id=ZLHIS;Password=.155F9E2612;Pooling =true;Connection Lifetime=0;Max Pool Size=10;Min Pool Size=1;Incr Pool Size=1";

            /// <summary>
            /// 本机数据库HJY测试用
            /// </summary>
            public const string ZLHISMY = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.56.1)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=orcl)));User Id=ZLHIS;Password=his;Pooling =true;Connection Lifetime=0;Max Pool Size=10;Min Pool Size=1;Incr Pool Size=1";

            /// <summary>
            /// 移动医生站数据库连接串
            /// </summary>
            public const string DOCZLHIP = "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.33.57)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=DOC)));User Id=ZLHIP;Password=zlsoft.2024;Pooling =true;Connection Lifetime=0;Max Pool Size=10;Min Pool Size=1;Incr Pool Size=1";

        }
    }
}
