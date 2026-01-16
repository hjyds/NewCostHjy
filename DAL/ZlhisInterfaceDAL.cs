using NewCostHjy.Models;
using OnePaperModel;
using Oracle.ManagedDataAccess.Client; 
using System;
using System.Collections.Generic;
using System.Data; 
using ZLSoft.Base.Tracing;
using static NewCostHjy.Common.Const;

namespace NewCostHjy.DAL
{
    public class ZlhisInterfaceDAL
    {

        public string configString = "";

        /// <summary>
        /// VTE测试相关
        /// </summary>
        /// <param name="orderid"></param>
        /// <param name="constr"></param>
        /// <returns></returns>
        public DataTable GetVteEvalOrder(string orderid, string constr)
        {
            string sql = @"Select a.病人id,a.主页id,c.id 科室id,c.名称 科室名称,
                a.开嘱医生 人员,b.id 人员id,a.id 医嘱id,b.专业技术职务,a.诊疗项目id,d.操作类型
                From 病人医嘱记录 A,人员表 b,部门表 c,诊疗项目目录 d
                Where a.开嘱医生=b.姓名
                and a.病人科室id=c.id
                and a.诊疗项目id=d.id
                and a.Id = :orderid";

            constr = HjyDataBaseConnStr.ZLHIS336;

            OracleDataAccess oracleData = new OracleDataAccess(constr);

            OracleParameter[] parameters = { new OracleParameter(":orderid", OracleDbType.Varchar2, orderid, ParameterDirection.Input) };

            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);
            return data;
        }

        /// <summary>
        /// 重置一个VTE病人的相关状态信息数据，33.6数据库
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="orderid"></param>
        public void VtePatientReSet336(string pid, string orderid)
        {
            string sql = "";
            int updCount;
            OracleDataAccess oracleData = new OracleDataAccess(HjyDataBaseConnStr.ZLHIS336);
            OracleParameter[] parsPat = { new OracleParameter(":pid", OracleDbType.Varchar2, pid, ParameterDirection.Input) };
            sql = "delete zlvte.patientvteitem a where a.patientid=:pid";
            updCount = oracleData.ExecuteNonQuery(sql, true, parsPat);
            sql = "delete zlvte.patientvtestate a where a.patientid=:pid";
            OracleParameter[] parsPat1 = { new OracleParameter(":pid", OracleDbType.Varchar2, pid, ParameterDirection.Input) };
            updCount = oracleData.ExecuteNonQuery(sql, true, parsPat1);

            List<string> sqlListA = GetOrderDelVte();
            foreach (var itemSQL in sqlListA)
            {
                OracleParameter[] parsOder = { new OracleParameter(":orderid", OracleDbType.Varchar2, orderid, ParameterDirection.Input) };
                updCount = oracleData.ExecuteNonQuery(itemSQL, true, parsOder);
            }
            //病历相关数据
            List<string> sqlList = GetEmrDelVte();
            oracleData = new OracleDataAccess(HjyDataBaseConnStr.WEBEMR336);
            foreach (string itemSQL in sqlList)
            {
                OracleParameter[] parsOderTemp = { new OracleParameter(":pid", OracleDbType.Varchar2, pid, ParameterDirection.Input) };
                updCount = oracleData.ExecuteNonQuery(itemSQL, true, parsOderTemp);
            }
        }

        /// <summary>
        /// 重置一个VTE病人的相关状态信息数据，本地数据库
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="orderid"></param>
        public void VtePatientReSet561(string pid, string orderid)
        {
            string sql = "";
            int updCount;
            OracleDataAccess oracleData = new OracleDataAccess(HjyDataBaseConnStr.ZLHISMY);
            //医嘱数据
            List<string> sqlListA = GetOrderDelVte();

            foreach (var itemSQL in sqlListA)
            {
                OracleParameter[] parsOder = { new OracleParameter(":orderid", OracleDbType.Varchar2, orderid, ParameterDirection.Input) };
                updCount = oracleData.ExecuteNonQuery(itemSQL, true, parsOder);
            }

            //VTE和病历相关数据
            List<string> sqlList = GetEmrDelVte();
            sql = "delete zlvte.patientvteitem a where a.patientid=:pid"; sqlList.Add(sql);
            sql = "delete zlvte.patientvtestate a where a.patientid=:pid"; sqlList.Add(sql);

            foreach (string itemSQL in sqlList)
            {
                OracleParameter[] parsOderTemp = { new OracleParameter(":pid", OracleDbType.Varchar2, pid, ParameterDirection.Input) };
                updCount = oracleData.ExecuteNonQuery(itemSQL, true, parsOderTemp);
            }
        }

        /// <summary>
        /// 医嘱相关的更新的数据
        /// </summary>
        /// <returns></returns>
        private List<string> GetOrderDelVte()
        {
            string sql = "";
            //医嘱数据
            List<string> sqlListA = new List<string>();
            sql = "Delete 病人医嘱状态 A Where a.操作类型 In (3, 8) And a.医嘱id = :orderid"; sqlListA.Add(sql);
            sql = "Delete 病人医嘱计价 Where 医嘱id = :orderid"; sqlListA.Add(sql);
            sql = "Delete 医嘱执行计价 Where 医嘱id = :orderid"; sqlListA.Add(sql);
            sql = "Delete 病人医嘱附费 Where 医嘱id = :orderid"; sqlListA.Add(sql);
            sql = "Delete 病人医嘱执行 Where 医嘱id = :orderid"; sqlListA.Add(sql);
            sql = "Delete 医嘱执行时间 Where 医嘱id = :orderid"; sqlListA.Add(sql);
            sql = "Delete 病人医嘱发送 Where 医嘱id = :orderid"; sqlListA.Add(sql);
            sql = @"Update 病人医嘱记录 Set 医嘱状态 = 1, 紧急标志 = 0, 执行终止时间 = Null, 停嘱时间 = Null, 停嘱医生 = Null, 
                    校对护士 = Null, 校对时间 = Null, 上次执行时间 = Null, 确认停嘱时间 = Null,确认停嘱护士 = Null, 屏蔽打印 = Null, 审核状态 = Null, 新开签名id = Null
                   Where ID = :orderid"; sqlListA.Add(sql);
            return sqlListA;
        }

        /// <summary>
        /// WEB病历相关更新的数据
        /// </summary>
        /// <returns></returns>
        private List<string> GetEmrDelVte()
        {
            string sql = "";
            //病历相关数据
            List<string> sqlList = new List<string>();
            //评份表
            sql = "delete scores.score_rec_content a where a.record_id in (select a.record_id from scores.score_record a where a.patient_id = :pid)"; sqlList.Add(sql);
            sql = "delete scores.score_result a where a.record_id in (select a.record_id from scores.score_record a where a.patient_id = :pid)"; sqlList.Add(sql);
            sql = "delete scores.score_variable_list a where a.record_id in (select a.record_id from scores.score_record a where a.patient_id = :pid)"; sqlList.Add(sql);
            sql = "delete scores.scores_status_change_log a where a.record_id in (select a.record_id from scores.score_record a where a.patient_id = :pid)"; sqlList.Add(sql);
            sql = "delete scores.score_sig_info a where a.record_id in (select a.record_id from scores.score_record a where a.patient_id = :pid)"; sqlList.Add(sql);
            sql = "delete scores.score_record a where a.patient_id = :pid"; sqlList.Add(sql);

            //知情同意书
            sql = "delete csform.consent_form_record_content a where a.record_id in (select a.record_id from csform.consent_form_record a where a.patient_id = :pid)"; sqlList.Add(sql);
            sql = "delete csform.consent_form_variable_list a where a.record_id in (select a.record_id from csform.consent_form_record a where a.patient_id = :pid)"; sqlList.Add(sql);
            sql = "delete csform.consent_form_status_change_log a where a.record_id in (select a.record_id from csform.consent_form_record a where a.patient_id = :pid)"; sqlList.Add(sql);
            sql = "delete csform.consent_form_sig_info a where a.record_id in (select a.record_id from csform.consent_form_record a where a.patient_id = :pid)"; sqlList.Add(sql);
            sql = "delete csform.consent_form_record a where a.patient_id = :pid"; sqlList.Add(sql);
            return sqlList;
        }

        /// <summary>
        /// 记录专业费用接口日志
        /// </summary>
        /// <param name="funName">api名称</param>
        /// <param name="parIn">入参信息</param>
        public void NewCostApiLog(string funName, string parIn)
        {
            string id = Guid.NewGuid().ToString();
            string sql = @"insert into 专业费用记录 (id,方法,入参,记录日期,序列) values (:id,:funName,:parIn,sysdate,日志记录_ID.NEXTVAL)";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":id", OracleDbType.Varchar2, id, ParameterDirection.Input),
                new OracleParameter(":funName", OracleDbType.Varchar2, funName, ParameterDirection.Input),
                new OracleParameter(":parIn", OracleDbType.Clob, parIn, ParameterDirection.Input)
            };
            oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 写入一条系统交互消息记录
        /// </summary>
        /// <param name="messageRecord"></param>
        /// <returns></returns>
        public int AddSysMessageRecord(SysMessageRecord messageRecord)
        {
            string sql = @"INSERT INTO 系统交互消息记录 
                           (id, 人员ID, 用户名, 窗体句柄, 消息编码, 消息内容, 病人ID, 就诊ID, 机器名, 创建时间) 
                           VALUES 
                           (系统交互消息记录_ID.nextval, 
                    :personId, :username, :windowHandle, :messageCode, :messageContent, :patientId, :visitId, :machineName, sysdate)";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":personId", OracleDbType.Int64, messageRecord.PersonId, ParameterDirection.Input),
                new OracleParameter(":username", OracleDbType.Varchar2, messageRecord.Username, ParameterDirection.Input),
                new OracleParameter(":windowHandle", OracleDbType.Int64, messageRecord.WindowHandle, ParameterDirection.Input),
                new OracleParameter(":messageCode", OracleDbType.Varchar2, messageRecord.MessageCode, ParameterDirection.Input),
                new OracleParameter(":messageContent", OracleDbType.Varchar2, messageRecord.MessageContent, ParameterDirection.Input),
                new OracleParameter(":patientId", OracleDbType.Int64, messageRecord.PatientId, ParameterDirection.Input),
                new OracleParameter(":visitId", OracleDbType.Int64, messageRecord.VisitId, ParameterDirection.Input),
                new OracleParameter(":machineName", OracleDbType.Varchar2, messageRecord.MachineName, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }
        /// <summary>
        /// 获取收费单号
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public Dictionary<string, object> GetFeeNo(string input)
        {
            string sqlText = "zl_ExseSvr_GetNextNo";
            OracleParameter[] oracleParameters = GetOracleParameter(input);

            Dictionary<string, object> T = GetList(sqlText, oracleParameters, configString);

            return T;
        }

        /// <summary>
        /// 获取费用ID
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        public Dictionary<string, object> GetFeeId(string input)
        {
            string sqlText = "zl_ExseSvr_GetNextId";
            OracleParameter[] oracleParameters = GetOracleParameter(input);

            Dictionary<string, object> T = GetList(sqlText, oracleParameters, configString);

            return T;
        }


        private static OracleParameter[] GetOracleParameter(string input)
        {

            OracleParameter[] oracleParameters =
            {
                //有多个重载
                new OracleParameter("Json_In",OracleDbType.Clob),
                new OracleParameter("Json_Out",OracleDbType.Clob),
            };
            oracleParameters[0].Value = input;
            oracleParameters[1].Direction = ParameterDirection.Output;
            return oracleParameters;
        }


        /// <summary>
        /// 执行存储过查询数据列表(oracle)
        /// </summary>
        /// <param name="sqlText"></param>
        /// <param name="oracleParameters"></param>
        /// <returns></returns>
        public Dictionary<string, object> GetList(string sqlText, OracleParameter[] oracleParameters, string configString)
        {
            using (var trace = new ZLTrace("GetListOracle", "ZlCostData"))
            {
                trace.SetSql(sqlText);
                OracleDataAccess oracleDataAccess = null;

                if (configString == null)
                {
                    oracleDataAccess = new OracleDataAccess();
                } else
                {
                    oracleDataAccess = new OracleDataAccess(configString);
                }
                foreach (var npgsqlParameter in oracleParameters)
                {
                    if (npgsqlParameter.Value == null)
                    {
                        npgsqlParameter.Value = DBNull.Value;
                    }
                }

                Dictionary<string, object> T = oracleDataAccess.ExecuteProcdure(sqlText, true, oracleParameters);
                return T;
            }
        }

        /// <summary>
        /// 执行一个带Json入参的存储过程，返回CLOB参数的值
        /// </summary>
        /// <param name="procedureName">存储过程名称</param>
        /// <param name="jsonIn">入参Json字符串</param>
        /// <returns>CLOB类型的参数对象</returns>
        public object GetClobByProcdure(string procedureName, string jsonIn, bool jsonInIsClob = false)
        {
            OracleParameter[] pars ={
                new OracleParameter("Json_In",jsonInIsClob?OracleDbType.Clob:OracleDbType.Varchar2,jsonIn,System.Data.ParameterDirection.Input),
                new OracleParameter("Json_Out",OracleDbType.Clob,System.Data.ParameterDirection.Output)
            };
            OracleDataAccess oracleData = new OracleDataAccess();
            Dictionary<string, object> dic = oracleData.ExecuteProcdure(procedureName, pars);

            return dic["Json_Out"];
        }

        /// <summary>
        /// 获取某个表的记录集
        /// </summary>
        /// <param name="tableName">表名</param>
        /// <param name="con">条件字段</param>
        /// <param name="val">条件值</param>
        /// <param name="field">获取字段名</param>
        /// <returns></returns>
        public DataTable GetTable(string tableName, string con, string val, string field)
        {
            string sql;
            if (string.IsNullOrEmpty(con))
            {
                //SQL性能检查忽略
                sql = "Select " + field + " from " + tableName;
            } else
            {
                //SQL性能检查忽略
                sql = "Select " + field + " from " + tableName + " Where " + con + "=:par";
            }
            OracleDataAccess oracleDataAccess = new OracleDataAccess();
            OracleParameter[] oracleParameters = {
                        new OracleParameter(":par", OracleDbType.Varchar2)
                    };
            oracleParameters[0].Value = val;
            DataTable data = oracleDataAccess.ExecuteDataTable(sql, CommandType.Text, true, oracleParameters);
            return data;
        }
        /// <summary>
        /// 获了指定人员表的单个操作人员信息（SPD项目）
        /// </summary>
        /// <returns></returns>
        public DataTable GetOneOperInfo(int id)
        {
            string sql = @"Select 'hjy_barcode_' || a.Id As Eisai_Barcode, 9876 As Eisai_Item_Store_Qunt, 51 As Eisai_Item_Store_Id,
                        6.77 As Eisai_Item_Sales_Price, 6.77 Eisai_Item_Cost_Price, a.Id Eisai_Item_Id, a.名称 As Eisai_Item_Name,
                   a.规格 As Eisai_Item_Spec, a.产地 As Eisai_Item_Dprentp_Name
            From 收费项目目录 A,材料特性 b
            Where a.id=b.材料id and nvl(b.备货卫材流程,0)=0 and a.类别 = '4' And a.产地 Is Not Null And a.规格 Is Not Null And Rownum < 20
            order by a.id ";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] parameters = {
                new OracleParameter("id",OracleDbType.Int32,id,ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);
            return data;
        }

        public DataTable GetDataTableComm()
        {
            string sql = "Select 'select * from ' || a.Owner || '.' || a.Table_Name  As 语句, a.Owner, a.Table_Name  From All_Tables A  Where a.Owner = 'ZLEMR'";

            OracleDataAccess oracleData = new OracleDataAccess(HjyDataBaseConnStr.WEBEMR336);
            OracleParameter[] parameters = {
                new OracleParameter("id",OracleDbType.Int32,0,ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);
            return data;
        }


        /// <summary>
        /// 中联移动医生相关的数据库连接测试，获取ZLHIP下的所有表数据
        /// </summary>
        /// <returns></returns>
        public DataTable GetZLHIPTables()
        {
            string sql = "Select 'select * from ' || a.Owner || '.' || a.Table_Name  As 语句, a.Owner, a.Table_Name  From All_Tables A  Where a.Owner = 'ZLHIP'";

            OracleDataAccess oracleData = new OracleDataAccess(HjyDataBaseConnStr.DOCZLHIP);
            OracleParameter[] parameters = {
                new OracleParameter("id",OracleDbType.Int32,0,ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);

            foreach (DataRow drItem in data.Rows)
            {
                sql = drItem["语句"].ToString();
                DataTable tempDt = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);
                if (tempDt.Rows.Count > 0)
                {
                    drItem["语句"] = sql + ";";
                } else
                {
                    drItem["语句"] = null;
                }
            }
            //过滤掉没有数据的表
            DataRow[] drArr = data.Select("语句 is not null");
            //构造新的DataTable
            DataTable dtNew = data.Clone();
            //导入数据
            for (int i = 0; i < drArr.Length; i++)
            {
                dtNew.ImportRow(drArr[i]);
            }
            return data;
        }

        /// <summary>
        /// SPD卫材项目信息表数据查询（SPD项目）
        /// </summary>
        /// <returns></returns>
        public DataTable SPDItems()
        {
            string sql = @"Select 'hjy_barcode_' || a.Id As Eisai_Barcode, 9876 As Eisai_Item_Store_Qunt, 51 As Eisai_Item_Store_Id,
                        6.77 As Eisai_Item_Sales_Price, 6.77 Eisai_Item_Cost_Price, a.Id Eisai_Item_Id, a.名称 As Eisai_Item_Name,
                   a.规格 As Eisai_Item_Spec, a.产地 As Eisai_Item_Dprentp_Name
            From 收费项目目录 A,材料特性 b
            Where a.id=b.材料id and nvl(b.备货卫材流程,0)=0 and a.类别 = '4' And a.产地 Is Not Null And a.规格 Is Not Null And Rownum < 20
            order by a.id ";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] parameters = {
                new OracleParameter("nos",OracleDbType.Varchar2,"",ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);
            return data;
        }
        public DataTable GetOrderFeeInfo(string nos)
        {


            string sql = @"
select a.医嘱id,a.发送号,a.no,a.费用id,a.标准单价,a.收费细目id,a.数量,a.执行部门id,b.名称 项目名称,a.执行状态,b.类别 收费项目类别,b.计算单位 收费项目单位
from  (select distinct a.医嘱id,a.发送号,a.no,nvl(b.费用id,a.费用id) as 费用id ,nvl(b.标准单价,a.标准单价) as 标准单价,
        nvl(b.收费细目id,a.收费细目id) 收费细目id,nvl(b.数量,a.发送数次) 数量
        ,nvl(b.执行部门id,a.执行部门id) 执行部门id,nvl(b.执行状态,a.执行状态) as 执行状态                    
        from 病人医嘱发送 a,医嘱执行计价 b
        where a.no IN (Select /*+cardinality(x,10)*/ x.Column_Value From Table(Cast(f_Str2List(:nos) As zlTools.t_StrList)) X)
        and a.医嘱id=b.医嘱id(+) and a.发送号=b.发送号(+)) a, 
   收费项目目录 b                                      
where a.收费细目id=b.id and a.数量>0 and nvl(a.费用id,0)>0 order by a.医嘱id,a.发送号,a.收费细目id";



            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] parameters = {
                new OracleParameter("nos",OracleDbType.Varchar2,nos,ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);
            return data;
        }

        public DataTable GetFollowList(string id)
        {

            string sql = @"select id,Log_Info_Ex 数据 from Zlloginfo Where ID = :nos";

            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] parameters = {
                new OracleParameter("nos",OracleDbType.Varchar2,id,ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);
            return data;
        }


        /// <summary>
        /// 插入Follow_list表中的数据
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public int Insert_follow_list(FollowSelect data)
        {
            string sql = @"insert into follow_list
                            (id,userId,rehabilitationNum,mobility,hasHospitalized,followType,hasMobility,hospitalizedString,hasVaccinate,vaccinateString,hasSmoking,smokingString,hasOccupation,hasPsychology,psychologyString,hasHomeRehabilitation,homeRehabilitationString,occupationString,demand,suggest,hasWeight,address,hasAppetite,hasSleeping,hasRehabilitation,hasSelfEvaluation,hasSatisfaction,rehabilitationString,createTime,updateTime,doctorName) values 
                            (:id,:userId,:rehabilitationNum,:mobility,:hasHospitalized,:followType,:hasMobility,:hospitalizedString,:hasVaccinate,:vaccinateString,:hasSmoking,:smokingString,:hasOccupation,:hasPsychology,:psychologyString,:hasHomeRehabilitation,:homeRehabilitationString,:occupationString,:demand,:suggest,:hasWeight,:address,:hasAppetite,:hasSleeping,:hasRehabilitation,:hasSelfEvaluation,:hasSatisfaction,:rehabilitationString,:createTime,:updateTime,:doctorName)";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":id", OracleDbType.Int32, data.id, ParameterDirection.Input), new OracleParameter(":userId", OracleDbType.Int32, data.userId, ParameterDirection.Input), new OracleParameter(":rehabilitationNum", OracleDbType.Varchar2, data.rehabilitationNum, ParameterDirection.Input), new OracleParameter(":mobility", OracleDbType.Varchar2, data.mobility, ParameterDirection.Input), new OracleParameter(":hasHospitalized", OracleDbType.Int32, data.hasHospitalized, ParameterDirection.Input), new OracleParameter(":followType", OracleDbType.Int32, data.followType, ParameterDirection.Input), new OracleParameter(":hasMobility", OracleDbType.Int32, data.hasMobility, ParameterDirection.Input), new OracleParameter(":hospitalizedString", OracleDbType.Varchar2, data.hospitalizedString, ParameterDirection.Input), new OracleParameter(":hasVaccinate", OracleDbType.Int32, data.hasVaccinate, ParameterDirection.Input), new OracleParameter(":vaccinateString", OracleDbType.Varchar2, data.vaccinateString, ParameterDirection.Input), new OracleParameter(":hasSmoking", OracleDbType.Int32, data.hasSmoking, ParameterDirection.Input), new OracleParameter(":smokingString", OracleDbType.Varchar2, data.smokingString, ParameterDirection.Input), new OracleParameter(":hasOccupation", OracleDbType.Int32, data.hasOccupation, ParameterDirection.Input), new OracleParameter(":hasPsychology", OracleDbType.Int32, data.hasPsychology, ParameterDirection.Input), new OracleParameter(":psychologyString", OracleDbType.Varchar2, data.psychologyString, ParameterDirection.Input), new OracleParameter(":hasHomeRehabilitation", OracleDbType.Int32, data.hasHomeRehabilitation, ParameterDirection.Input), new OracleParameter(":homeRehabilitationString", OracleDbType.Varchar2, data.homeRehabilitationString, ParameterDirection.Input), new OracleParameter(":occupationString", OracleDbType.Varchar2, data.occupationString, ParameterDirection.Input), new OracleParameter(":demand", OracleDbType.Varchar2, data.demand, ParameterDirection.Input), new OracleParameter(":suggest", OracleDbType.Varchar2, data.suggest, ParameterDirection.Input), new OracleParameter(":hasWeight", OracleDbType.Int32, data.hasWeight, ParameterDirection.Input), new OracleParameter(":address", OracleDbType.Varchar2, data.address, ParameterDirection.Input), new OracleParameter(":hasAppetite", OracleDbType.Int32, data.hasAppetite, ParameterDirection.Input), new OracleParameter(":hasSleeping", OracleDbType.Int32, data.hasSleeping, ParameterDirection.Input), new OracleParameter(":hasRehabilitation", OracleDbType.Int32, data.hasRehabilitation, ParameterDirection.Input), new OracleParameter(":hasSelfEvaluation", OracleDbType.Int32, data.hasSelfEvaluation, ParameterDirection.Input), new OracleParameter(":hasSatisfaction", OracleDbType.Int32, data.hasSatisfaction, ParameterDirection.Input),
                new OracleParameter(":rehabilitationString", OracleDbType.Varchar2, data.rehabilitationString, ParameterDirection.Input),
                new OracleParameter(":createTime", OracleDbType.Date, data.createTime, ParameterDirection.Input),
                new OracleParameter(":updateTime", OracleDbType.Date, data.updateTime, ParameterDirection.Input),
                new OracleParameter(":doctorName", OracleDbType.Varchar2, data.doctorName, ParameterDirection.Input)

            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }
        /// <summary>
        /// 插入病人信息
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public int Insert_pati_list(FollowPati data)
        {
            string sql = @"insert into pati_list
                                (id,no,userCode,realname,gender,age,mobile,doctorName,address) values 
                                (:id,:no,:userCode,:realname,:gender,:age,:mobile,:doctorName,:address)";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":id", OracleDbType.Int32, data.id, ParameterDirection.Input),
                new OracleParameter(":no", OracleDbType.Varchar2, data.no, ParameterDirection.Input),
                new OracleParameter(":userCode", OracleDbType.Varchar2, data.userCode, ParameterDirection.Input),
                new OracleParameter(":realname", OracleDbType.Varchar2, data.realname, ParameterDirection.Input),
                new OracleParameter(":gender", OracleDbType.Varchar2, data.gender, ParameterDirection.Input),
                new OracleParameter(":age", OracleDbType.Int32, data.age, ParameterDirection.Input),
                new OracleParameter(":mobile", OracleDbType.Varchar2, data.mobile, ParameterDirection.Input),
                new OracleParameter(":doctorName", OracleDbType.Varchar2, data.doctorName, ParameterDirection.Input),
                new OracleParameter(":address", OracleDbType.Varchar2, data.address, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }


        /// <summary>
        /// 插入病人信息
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public int Insert_pati_list_ls(PatiOject data)
        {
            string sql = @"insert into Pati_ls
                                (   
accomplishStatus
        ,complication
        ,followCount
        ,gender
        ,addTime
        ,siteName
        ,userCode
        ,diagnosisResult
        ,doctorName
        ,xStages
        ,evaluateCount
        ,otherDisease
        ,rehabilitationLastTime
        ,id
        ,relationeShip
        ,mobile
        ,updateTime
        ,avatar
        ,userId
        ,realname
        ,relativePhone
        ,rehabilitationNum
        ,idCardNum
        ,tenantId
        ,siteId
        ,diseaseOriginal
        ,age
) values  (
 :accomplishStatus
,:complication
,:followCount
,:gender
,:addTime
,:siteName
,:userCode
,:diagnosisResult
,:doctorName
,:xStages
,:evaluateCount
,:otherDisease
,:rehabilitationLastTime
,:id
,:relationeShip
,:mobile
,:updateTime
,:avatar
,:userId
,:realname
,:relativePhone
,:rehabilitationNum
,:idCardNum
,:tenantId
,:siteId
,:diseaseOriginal
,:age 
)";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                        new OracleParameter(":accomplishStatus", OracleDbType.Varchar2, data.accomplishStatus, ParameterDirection.Input),
                        new OracleParameter(":complication", OracleDbType.Varchar2, data.complication, ParameterDirection.Input),
                        new OracleParameter(":followCount", OracleDbType.Varchar2, data.followCount, ParameterDirection.Input),
                        new OracleParameter(":gender", OracleDbType.Varchar2, data.gender, ParameterDirection.Input),
                        new OracleParameter(":addTime", OracleDbType.Date,  data.addTime, ParameterDirection.Input),
                        new OracleParameter(":siteName", OracleDbType.Varchar2, data.siteName, ParameterDirection.Input),
                        new OracleParameter(":userCode", OracleDbType.Varchar2, data.userCode, ParameterDirection.Input),
                        new OracleParameter(":diagnosisResult", OracleDbType.Varchar2, data.diagnosisResult, ParameterDirection.Input),
                        new OracleParameter(":doctorName", OracleDbType.Varchar2, data.doctorName, ParameterDirection.Input),
                        new OracleParameter(":xStages", OracleDbType.Varchar2, data.xStages, ParameterDirection.Input),
                        new OracleParameter(":evaluateCount", OracleDbType.Varchar2, data.evaluateCount, ParameterDirection.Input),
                        new OracleParameter(":otherDisease", OracleDbType.Varchar2, data.otherDisease, ParameterDirection.Input),
                        new OracleParameter(":rehabilitationLastTime", OracleDbType.Date, data.rehabilitationLastTime, ParameterDirection.Input),
                        new OracleParameter(":id", OracleDbType.Varchar2, data.id, ParameterDirection.Input),
                        new OracleParameter(":relationeShip", OracleDbType.Varchar2, data.relationeShip, ParameterDirection.Input),
                        new OracleParameter(":mobile", OracleDbType.Varchar2, data.mobile, ParameterDirection.Input),
                        new OracleParameter(":updateTime", OracleDbType.Date, data.updateTime, ParameterDirection.Input),
                        new OracleParameter(":avatar", OracleDbType.Varchar2, data.avatar, ParameterDirection.Input),
                        new OracleParameter(":userId", OracleDbType.Varchar2, data.userId, ParameterDirection.Input),
                        new OracleParameter(":realname", OracleDbType.Varchar2, data.realname, ParameterDirection.Input),
                        new OracleParameter(":relativePhone", OracleDbType.Varchar2, data.relativePhone, ParameterDirection.Input),
                        new OracleParameter(":rehabilitationNum", OracleDbType.Varchar2, data.rehabilitationNum, ParameterDirection.Input),
                        new OracleParameter(":idCardNum", OracleDbType.Varchar2, data.idCardNum, ParameterDirection.Input),
                        new OracleParameter(":tenantId", OracleDbType.Varchar2, data.tenantId, ParameterDirection.Input),
                        new OracleParameter(":siteId", OracleDbType.Varchar2, data.siteId, ParameterDirection.Input),
                        new OracleParameter(":diseaseOriginal", OracleDbType.Varchar2, data.diseaseOriginal, ParameterDirection.Input),
                        new OracleParameter(":age", OracleDbType.Varchar2, data.age, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }


        // 数据行转换为实体对象
        private DocContractSign DataRowToEntity(DataRow row)
        {
            return new DocContractSign
            {
                id = Convert.ToInt32(row["id"]),
                summary = row["summary"] == DBNull.Value ? null : row["summary"].ToString(),
                pic_name = row["pic_name"] == DBNull.Value ? null : row["pic_name"].ToString(),
                pic_uid = row["pic_uid"] == DBNull.Value ? null : row["pic_uid"].ToString(),
                pic_url = row["pic_url"] == DBNull.Value ? null : row["pic_url"].ToString(),
                addTime = row["addTime"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(row["addTime"]),
                meetingDate = row["meetingDate"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(row["meetingDate"]),
                siteName = row["siteName"] == DBNull.Value ? null : row["siteName"].ToString(),
                updateTime = row["updateTime"] == DBNull.Value ? (DateTime?)null : Convert.ToDateTime(row["updateTime"]),
                title = row["title"] == DBNull.Value ? null : row["title"].ToString(),
                userName = row["userName"] == DBNull.Value ? null : row["userName"].ToString(),
                userCode = row["userCode"] == DBNull.Value ? null : row["userCode"].ToString()
            };
        }

        // 根据ID查询单个记录
        public DocContractSign GetById(int id)
        {
            var sql = "SELECT * FROM JTYSQYJQYPG WHERE id = :id"; 
            OracleDataAccess oracleDataAccess = new OracleDataAccess();
            OracleParameter[] oracleParameters = { new OracleParameter(":id", OracleDbType.Int32) };
            oracleParameters[0].Value = id;
            DataTable dataTable = oracleDataAccess.ExecuteDataTable(sql, CommandType.Text, true, oracleParameters);
            if (dataTable.Rows.Count == 0)
                return null;
            return DataRowToEntity(dataTable.Rows[0]);
        }

        // 查询所有记录
        public List<DocContractSign> GetAll()
        {
            string sql = "SELECT * FROM Contract_Sign ORDER BY id";
            OracleDataAccess oracleDataAccess = new OracleDataAccess();
            OracleParameter[] oracleParameters = { new OracleParameter(":par", OracleDbType.Varchar2) };
            oracleParameters[0].Value = 1;
            DataTable dataTable = oracleDataAccess.ExecuteDataTable(sql, CommandType.Text, true, oracleParameters);
            List<DocContractSign> result = new List<DocContractSign>();
            foreach (DataRow row in dataTable.Rows)
            {
                result.Add(DataRowToEntity(row));
            }
            return result;
        }

        // 新增记录
        public int InsertDocContractSign(DocContractSign entity)
        {
            var sql = @"INSERT INTO Contract_sign (
                        id, summary, pic_name, pic_uid, pic_url, 
                        addTime, meetingDate, siteName, updateTime, 
                        title, userName, userCode
                    ) VALUES (
                        :id, :summary, :pic_name, :pic_uid, :pic_url,
                        :addTime, :meetingDate, :siteName, :updateTime,
                        :title, :userName, :userCode
                    )";

            OracleParameter[] pars = new[]
            {
                new OracleParameter(":id", OracleDbType.Int32, entity.id, ParameterDirection.Input),
                new OracleParameter(":summary", entity.summary ?? (object)DBNull.Value),
                new OracleParameter(":pic_name", entity.pic_name ?? (object)DBNull.Value),
                new OracleParameter(":pic_uid", entity.pic_uid ?? (object)DBNull.Value),
                new OracleParameter(":pic_url", entity.pic_url ?? (object)DBNull.Value),
                new OracleParameter(":addTime", entity.addTime ?? (object)DBNull.Value),
                new OracleParameter(":meetingDate", entity.meetingDate ?? (object)DBNull.Value),
                new OracleParameter(":siteName", entity.siteName ?? (object)DBNull.Value),
                new OracleParameter(":updateTime", entity.updateTime ?? (object)DBNull.Value),
                new OracleParameter(":title", entity.title ?? (object)DBNull.Value),
                new OracleParameter(":userName", entity.userName ?? (object)DBNull.Value),
                new OracleParameter(":userCode", entity.userCode ?? (object)DBNull.Value)                
            };
            OracleDataAccess oracleData = new OracleDataAccess();
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }


        //,accomplishStatus
        //,complication
        //,followCount
        //,gender
        //,addTime
        //,siteName
        //,userCode
        //,diagnosisResult
        //,doctorName
        //,xStages
        //,evaluateCount
        //,otherDisease
        //,rehabilitationLastTime
        //,id
        //,relationeShip
        //,mobile
        //,updateTime
        //,avatar
        //,userId
        //,realname
        //,relativePhone
        //,rehabilitationNum
        //,idCardNum
        //,tenantId
        //,siteId
        //,diseaseOriginal
        //,age


        public DataTable GetErrUpFollowList()
        {
            string sql = @"Select a.Id, a.Userid, a.Rehabilitationnum, a.Mobility, a.Hashospitalized, a.Followtype, a.Hasmobility,
                       a.Hospitalizedstring, a.Hasvaccinate, a.Vaccinatestring, a.Hassmoking, a.Smokingstring, a.Hasoccupation,
                       a.Haspsychology, a.Psychologystring, a.Hashomerehabilitation, a.Homerehabilitationstring, a.Occupationstring,
                       a.Demand, a.Suggest, a.Hasweight, b.Address, a.Hasappetite, a.Hassleeping, a.Hasrehabilitation,
                       a.Hasselfevaluation, a.Hassatisfaction, a.Rehabilitationstring, a.Createtime, a.Updatetime, a.Doctorname
            From Follow_List A, Pati_List B
            Where a.Userid = b.Id And (a.Hassleeping Is Null Or a.Hasappetite Is Null Or a.Hasappetite = 1 Or a.Hassleeping = 1 Or
                  a.Address != b.Address)";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] parameters = {
                new OracleParameter("nos",OracleDbType.Varchar2,"",ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);

            return data;
        }
        public string GetCPDMLogData(string id)
        {
            string sql = "select a.log_info 信息,a.log_info_ex from zlloginfo a where a.ip=:id";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] parameters = {
                new OracleParameter("id",OracleDbType.Varchar2,id,ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);
            if (data.Rows.Count > 0)
            {
                return data.Rows[0]["信息"].ToString();
            }
            return "";
        }

        /// <summary>
        /// 获取某个字段的值
        /// </summary>
        /// <param name="tabName">表名</param>
        /// <param name="con">过条件字段名</param>
        /// <param name="val">条件值</param>
        /// <param name="strfield">查询的字段名</param>
        /// <returns></returns>
        public string GetTableFieldVal(string tabName, string con, string val, string strfield)
        {
            string sql;
            if (string.IsNullOrEmpty(con))
            {
                //SQL性能检查忽略
                sql = "Select " + strfield + " from " + tabName;
            } else
            {
                //SQL性能检查忽略
                sql = "Select " + strfield + " from " + tabName + " Where " + con + "=:par";
            }
            OracleDataAccess oracleDataAccess = new OracleDataAccess();
            OracleParameter[] oracleParameters = {
                        new OracleParameter(":par", OracleDbType.Varchar2)
                    };
            oracleParameters[0].Value = val;
            DataTable data = oracleDataAccess.ExecuteDataTable(sql, CommandType.Text, true, oracleParameters);
            if (data != null && data.Rows.Count > 0)
            {
                return data.Rows[0][strfield].ToString();
            }
            return "";
        }

        /// <summary>
        /// 生成后台日志信息
        /// </summary>
        /// <param name="sernum">序号</param>
        /// <param name="key">关键信息</param>
        /// <param name="loginfo">短文本</param>
        /// <param name="loginfo_ex">长文本</param>
        /// <param name="numPar">记录一些数字的日志</param>
        /// <returns></returns>
        public void ZLhisLogInsert(int sernum, string key, string loginfo, string loginfo_ex, int numPar, string funName, string Module_Name, string Function_Name)
        {

            //select a.create_time,a.ip,a.process_id,a.Log_Info,a.log_info_ex
            //from zlloginfo a where a.call_name = 'HJYTESTPRO'
            //and a.process_id > 0 order by a.create_time,a.ip,a.process_id
            if (loginfo.Length > 4000)
            {
                loginfo = loginfo.Substring(0, 4000);
            }
            OracleDataAccess oda = new OracleDataAccess();
            string temppar = "";
            OracleParameter[] oracleParameters = {
                    new OracleParameter("Log_Level_In",OracleDbType.Varchar2,temppar,ParameterDirection.Input),
                    new OracleParameter("Server_In",OracleDbType.Varchar2,temppar,ParameterDirection.Input),
                    new OracleParameter("User_Name_In",OracleDbType.Varchar2,temppar,ParameterDirection.Input),
                    new OracleParameter("Session_Id_In",OracleDbType.Int32,numPar,ParameterDirection.Input),
                    new OracleParameter("Ip_In",OracleDbType.Varchar2,key,ParameterDirection.Input),
                    new OracleParameter("Station_In",OracleDbType.Varchar2,temppar,ParameterDirection.Input),
                    new OracleParameter("Process_Id_In",OracleDbType.Int32,sernum,ParameterDirection.Input),
                    new OracleParameter("Process_Name_In",OracleDbType.Varchar2,temppar,ParameterDirection.Input),
                    new OracleParameter("Category_Name_In",OracleDbType.Varchar2,temppar,ParameterDirection.Input),
                    new OracleParameter("Component_Name_In",OracleDbType.Varchar2,funName,ParameterDirection.Input),
                    new OracleParameter("Module_Name_In",OracleDbType.Varchar2,Module_Name,ParameterDirection.Input),
                    new OracleParameter("Function_Name_In",OracleDbType.Varchar2,Function_Name,ParameterDirection.Input),
                    new OracleParameter("Call_Name_In",OracleDbType.Varchar2,"HJYTESTPRO",ParameterDirection.Input),
                    new OracleParameter("Stage_In",OracleDbType.Varchar2,temppar,ParameterDirection.Input),
                    new OracleParameter("Log_Info_In",OracleDbType.Varchar2,loginfo,ParameterDirection.Input),
                    new OracleParameter("Log_Info_Ex_In",OracleDbType.Clob,loginfo_ex,ParameterDirection.Input)
            };
            //忽略错误信息
            try
            {
                oda.ExecuteProcdure("ZLTOOLS.Zlloginfo_Insert", true, oracleParameters);
            } catch
            {

            }
        }
        /// <summary>
        /// 在院病人列表
        /// </summary>
        /// <param name="deptid"></param>
        /// <returns></returns>
        public DataTable GetPatListByDeptId(long deptid)
        {
            string sql = @"Select Distinct Decode(B.状态,1,0,3,3,Decode(B.住院医师,'张永康',1,2)) as 排序,Decode(Nvl(B.病案状态,0),0,999,B.病案状态) as 排序2,Null as 组ID, Decode(B.状态,1,'待入住病人',3,'预出院病人',Decode(B.住院医师,'张永康','张永康'||'的在院病人','在院病人')) as 类型, B.病人ID,B.主页ID,B.留观号,B.住院号,B.姓名,decode(sign(trunc(sysdate)-trunc(DECODE(b.入科时间,NULL,b.入院日期,b.入科时间))),0,1,0) 新入院,B.性别,B.年龄,NULL as 科室,D.名称 as 病区,B.住院医师, LPAD(B.出院病床,10,' ') as 床号,B.费别,Decode(B.入科时间,NULL,B.入院日期,B.入科时间) As 入院日期,B.出院日期,B.病人类型,B.状态,B.险类,B.病案状态, -Null as 医嘱ID,-Null as 发送号,-Null as 执行状态,-Null as 执行科室ID,Null as 会诊内容,Nvl(b.路径状态,-1) 路径状态,trunc(sysdate)-trunc(Decode(B.入科时间,NULL,B.入院日期,B.入科时间)) as 住院天数,nvl(q.序号,0) As 新生儿序号,b.单病种,b.出院科室ID,b.当前病区ID,b.婴儿科室ID,B.婴儿病区ID,first_value(Decode(Sign(h.诊断类型-10),-1,h.诊断描述,''))  Over(partition By h.病人id,H.主页ID Order By sign(h.诊断类型-10),decode(h.记录来源
                            ,4,0,5,0,h.记录来源) desc,Decode(h.诊断类型,1,1,2,2,3,3,0) DESC,h.诊断次序,h.录入次序) As 西医诊断,null as 中医诊断 From 病案主页 B,部门表 D,病人新生儿记录 Q,在院病人 R,病人诊断记录 H Where B.主页ID=R.主页id And B.当前病区ID=D.ID(+) And b.病人id=q.病人ID(+) And b.主页ID=q.主页ID(+) And H.病人id(+)=b.病人id And h.主页id(+)=b.主页id And (q.序号=1 Or q.序号 is Null) And (R.科室ID=36 Or b.婴儿科室ID=36) And B.病人ID=R.病人ID And B.出院科室ID=R.科室ID  And B.封存时间 is NULL And B.状态<>1 Order by 排序,排序2,床号,主页ID Desc
                        ";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] parameters = {
                new OracleParameter(":deptid",OracleDbType.Int64,deptid,ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, parameters);
            return data;
        }

        /// <summary>
        /// 通过病人ID，提取病人历史就诊记录，Xmltype 入出参的示例
        /// </summary>
        /// <param name="xmlin">xmli字符串入参</param>
        /// <returns></returns>
        public string GetPatiVisitRecordsDALAsync(string xmlin)
        {
            //本行必须写在函数内部，用一次写一次，防止sql注入
            OracleDataAccess oracleDataAccess = new OracleDataAccess(); //(SiteConfig.DataConnectList, "ZLHIS");
            string pname = "Zl_Third_Getpativisits_Test";
            OracleParameter[] oracleParameter =
            {
                //调用函数（非存储过程，第一个参数必须用来接收返回值（ParameterDirection.ReturnValue））
                new OracleParameter(":Xml_In", OracleDbType.XmlType, xmlin, ParameterDirection.Input),
                new OracleParameter(":Xml_Out", OracleDbType.XmlType, ParameterDirection.Output)
    };
            Dictionary<string, object> result = null;
            try
            {
                result = oracleDataAccess.ExecuteProcdure(pname, oracleParameter);
                return result[":Xml_Out"] as string;
            } catch (Exception e)
            {
                throw e;
            }
        }
    }
}
