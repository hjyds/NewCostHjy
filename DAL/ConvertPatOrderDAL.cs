using Dm;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using System;
using System.Data;

namespace NewCostHjy.DAL
{
    public class ConvertPatOrderDAL
    {

        /// <summary>
        /// 获取Oracle序列的下一个值
        /// </summary>
        /// <param name="sequenceName">序列名称</param>
        /// <returns>序列的下一个整数值</returns>
        public long GetSequenceNextValue(string sequenceName)
        {
            // 调用序列的Nextval获取下一个值
            string sql = $"SELECT {sequenceName}.NEXTVAL 序列值 FROM DUAL";
            OracleDataAccess oracleData = new OracleDataAccess();
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, null);
            return Convert.ToInt64(data.Rows[0]["序列值"]);
        }

        /// <summary>
        /// 获取当前ZLHIS数据库时间 
        /// </summary>
        /// <returns></returns>
        public DateTime GetOraSysDate()
        {
            string sql = $"SELECT Sysdate 当前时间 FROM DUAL";
            OracleDataAccess oracleData = new OracleDataAccess();
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, null);
            return Convert.ToDateTime(data.Rows[0]["当前时间"]);
        }

        /// <summary>
        /// 获取 病案主页.入院日期
        /// </summary>
        /// <returns></returns>
        public DataTable GetPatBaseInfo(int pid, int pvid)
        {
            string sql = "select a.入院日期 from 病案主页 a where a.病人id=:pid and a.主页id=:pvid";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":pid", OracleDbType.Int64, pid, ParameterDirection.Input),
                new OracleParameter(":pvid", OracleDbType.Int64, pvid, ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, pars);
            return data;
        }

        /// <summary>
        /// 复制指定ID的病人医嘱记录到同一张表
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <param name="serNum"></param>
        /// <param name="pageId"></param>
        /// <returns></returns>
        public int CopyMedicalOrder(long sourceId, long newId, int serNum, int pageId, DateTime defTime)
        {
            string sql = @"
                INSERT INTO 病人医嘱记录 (id,
                    相关id, 序号, 病人来源, 病人id, 主页id, 姓名, 性别, 年龄, 婴儿, 
                    医嘱状态, 医嘱期效, 诊疗类别, 诊疗项目id, 收费细目id, 天数, 单次用量, 
                    总给予量, 医嘱内容, 医生嘱托, 标本部位, 检查方法, 执行标记, 执行频次, 
                    频率次数, 频率间隔, 间隔单位, 执行时间方案, 计价特性, 执行科室id, 
                    执行性质, 紧急标志, 可否分零, 开始执行时间, 执行终止时间, 病人科室id, 
                    开嘱科室id, 开嘱医生, 开嘱时间, 挂号单, 前提id, 摘要, 零费记帐, 手术时间, 
                    用药目的, 用药理由, 审核状态, 申请序号, 超量说明, 首次用量, 配方id, 
                    手术情况, 组合项目id, 皮试结果, 处方序号, 会诊医嘱id, 皮试阳性说明, 
                    医嘱来源, 账单类型, 首日数次, 医保审批, 组合项目名称, 条码,
停嘱医生,停嘱时间,校对护士,校对时间
                ) 
                SELECT :NewId as id,
                    相关id, :序号, 2 病人来源, 病人id, :主页id, 姓名, 性别, 年龄, 婴儿, 
                    医嘱状态, 医嘱期效, 诊疗类别, 诊疗项目id, 收费细目id, 天数, 单次用量, 
                    总给予量, 医嘱内容, 医生嘱托, 标本部位, 检查方法, 执行标记, 执行频次, 
                    频率次数, 频率间隔, 间隔单位, 执行时间方案, 计价特性, 执行科室id, 
                    执行性质, 紧急标志, 可否分零, 
:defTime as 开始执行时间, 
:defTime as 执行终止时间, 病人科室id, 
                    开嘱科室id, 开嘱医生,  
:defTime as 开嘱时间, null 挂号单, 前提id, 摘要, 零费记帐, 手术时间, 
                    用药目的, 用药理由, 审核状态, 申请序号, 超量说明, 首次用量, 配方id, 
                    手术情况, 组合项目id, 皮试结果, 处方序号, 会诊医嘱id, 皮试阳性说明, 
                    医嘱来源, 账单类型, 首日数次, 医保审批, 组合项目名称, 条码,
停嘱医生, :defTime as 停嘱时间,null as 校对护士,null as 校对时间
                FROM 病人医嘱记录 
                WHERE id = :SourceId";

            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input),
                new OracleParameter(":序号", OracleDbType.Int32, serNum, ParameterDirection.Input),
                new OracleParameter(":主页id", OracleDbType.Int64, pageId, ParameterDirection.Input),
                new OracleParameter(":defTime", OracleDbType.Date, defTime, ParameterDirection.Input)

            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 医嘱状态的处理
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <returns></returns>
        public int InsertMedicalOrderStatus(long sourceId, long newId, DateTime defTime)
        {
            string sql = "Insert Into 病人医嘱状态 (医嘱id, 操作类型, 操作人员, 操作时间) select :NewId as 医嘱id, 操作类型, 操作人员, :defTime+操作类型/24/24 as 操作时间 from 病人医嘱状态 where 医嘱ID=:SourceId";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input),
                new OracleParameter(":defTime", OracleDbType.Date, defTime, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 申请附项
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <returns></returns>
        public int InsertOrderAddItem(long sourceId, long newId)
        {
            string sql = "Insert Into 病人医嘱附件 (医嘱id, 项目, 必填, 排列, 要素id, 内容)  select :NewId as 医嘱id, 项目, 必填, 排列, 要素id, 内容 from 病人医嘱附件 where 医嘱ID=:SourceId";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 医嘱加收
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <returns></returns>
        public int InsertOrderExtraFee(long sourceId, long newId)
        {
            string sql = @"Insert Into 病人医嘱加收
                  (收费细目id, 费用性质, 分组名称, 医嘱id, 总量, 检查方法, 标本部位) 
                    select 收费细目id, 费用性质, 分组名称, :NewId as 医嘱id, 总量, 检查方法, 标本部位 from 病人医嘱加收 where 医嘱ID=:SourceId";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 医嘱标记录
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <returns></returns>
        public int InsertOrderTagItem(long sourceId, long newId, string id)
        {
            string sql = @"Insert Into 病人医嘱标记记录
                  (ID, 医嘱id, 医嘱标记id, 标记名称, 标记值, 是否结算, 是否固定, 是否必选)
               select :id, :NewId as 医嘱id, 医嘱标记id, 标记名称, 标记值, 是否结算, 是否固定, 是否必选 from 病人医嘱标记记录 where 医嘱ID=:SourceId";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input),
                new OracleParameter(":id", OracleDbType.Varchar2, id, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }


        ////------------------------------------------

        /// <summary>
        /// 病人医嘱计价记录
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <returns></returns>
        public int InsertOrderPrice(long sourceId, long newId)
        {
            string sql = @"Insert Into 病人医嘱计价
                (医嘱id, 收费细目id, 数量, 单价, 从项, 执行科室id, 费用性质, 收费方式, 方案id)
              select :NewId, 收费细目id, 数量, 单价, 从项, 执行科室id, 费用性质, 收费方式, 方案id from 病人医嘱计价 where 医嘱ID=:SourceId";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 医嘱报告
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <returns></returns>
        public int InsertOrderRpt(long sourceId, long newId)
        {
            string sql = @"Insert Into 病人医嘱报告
                        (医嘱id, 病历id, 检查报告id,Risid,报告id)
                        Select :NewId 医嘱id, 病历id, 检查报告id,Risid,报告id From 病人医嘱报告 Where 医嘱id = :SourceId";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 医嘱发送记录
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <param name="sendnum"></param>
        /// <returns></returns>
        public int InsertOrderSend(long sourceId, long newId, long sendnum, string billNo, long oldsendnum,DateTime defTime)
        {
            string sql = @"Insert Into 病人医嘱发送
                (医嘱id, 发送号, 记录性质, NO, 记录序号, 发送数次, 发送人, 发送时间, 执行状态, 执行部门id, 计费状态, 首次时间, 末次时间, 样本条码, 门诊记帐, 标本发送批号, 分组id)
                select :NewId, :sendnum, 2 as 记录性质,:billNo as NO, 记录序号, 发送数次, 发送人, :defTime as 发送时间, 执行状态, 执行部门id, 计费状态, :defTime as 首次时间, :defTime as 末次时间, 样本条码, 门诊记帐, 标本发送批号, 分组id from 病人医嘱发送 where 医嘱ID=:SourceId and 发送号=:oldsendnum";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input),
                new OracleParameter(":sendnum", OracleDbType.Int64, sendnum, ParameterDirection.Input),
                new OracleParameter(":oldsendnum", OracleDbType.Int64, oldsendnum, ParameterDirection.Input),
                new OracleParameter(":billNo", OracleDbType.Varchar2, billNo, ParameterDirection.Input),
                new OracleParameter(":defTime", OracleDbType.Date, defTime, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 医嘱执行时间记录
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <param name="sendnum"></param>
        /// <param name="oldsendnum"></param>
        /// <returns></returns>
        public int InsertOrderExecTime(long sourceId, long newId, long sendnum,long oldsendnum, DateTime defTime)
        {
            string sql = @"Insert Into 医嘱执行时间
                     (要求时间, 医嘱id, 发送号)
              select :defTime as 要求时间, :NewId as 医嘱id,:sendnum as 发送号 from 医嘱执行时间 where 医嘱ID=:SourceId and 发送号=:oldsendnum";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input),
                new OracleParameter(":sendnum", OracleDbType.Int64, sendnum, ParameterDirection.Input),
                new OracleParameter(":oldsendnum", OracleDbType.Int64, oldsendnum, ParameterDirection.Input),
                new OracleParameter(":defTime", OracleDbType.Date, defTime, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        public int InsertOrderExecPrice(long sourceId, long newId, long sendnum, long oldsendnum)
        {
            string sql = @"Insert Into 医嘱执行计价
                (医嘱id, 发送号, 要求时间, 收费细目id, 数量, 费用性质, 执行状态, 执行部门id, 费用id, 标准单价)              
                select :NewId as 医嘱id, :sendnum as 发送号, 要求时间, 收费细目id, 数量, 费用性质, 执行状态, 执行部门id, 费用id, 标准单价 from 医嘱执行计价 where 医嘱ID=:SourceId and 发送号=:oldsendnum";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input),
                new OracleParameter(":sendnum", OracleDbType.Int64, sendnum, ParameterDirection.Input),
                new OracleParameter(":oldsendnum", OracleDbType.Int64, oldsendnum, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 获取医嘱发送数据
        /// </summary>
        /// <param name="sourceId"></param>
        /// <returns></returns>
        public DataTable GetOrderSendData(long sourceId)
        { 
            string sql = "select a.医嘱id,a.发送号,a.NO from 病人医嘱发送 a where a.医嘱ID=:SourceId";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, pars);
            return data;
        }

        /// <summary>
        /// 获取医嘱最大序号
        /// </summary>
        /// <param name="pid">病人id</param>
        /// <param name="pvid">主页id</param>
        /// <param name="baby">婴儿序号</param>
        /// <param name="currSN">当前医嘱行的序号</param>
        /// <returns></returns>
        public int GetMaxSerial(int pid, int pvid)
        {
            string sql = @"Select Nvl(Max(序号),0) as 序号 From 病人医嘱记录 Where 病人ID=:pid And 主页ID=:pvid";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":pid", OracleDbType.Int32, pid, ParameterDirection.Input),
                new OracleParameter(":pvid", OracleDbType.Int32, pvid, ParameterDirection.Input)
            };
            DataTable dt = oracleData.ExecuteDataTable(sql, CommandType.Text, pars);
            return Convert.ToInt32(dt.Rows[0]["序号"]);
        }

        /// <summary>
        /// 获取一个有效的发送号
        /// </summary>
        /// <returns></returns>
        public long GetSendNum()
        {
            string sql = "Select NextNO(:序号,:科室,null,1) as NO From Dual";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":序号", OracleDbType.Int32, 10, ParameterDirection.Input),
                new OracleParameter(":科室", OracleDbType.Int32, 0, ParameterDirection.Input)
            };
            DataTable dt = oracleData.ExecuteDataTable(sql, CommandType.Text, pars);
            return Convert.ToInt64(dt.Rows[0]["NO"]);
        }

        /// <summary>
        /// 获取一个记账单号
        /// </summary>
        /// <returns></returns>
        public string GetBillNo()
        {
            string sql = "Select Nextno(14, Null, Null, 1) as NO From Dual";
            OracleDataAccess oracleData = new OracleDataAccess();
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, null);
            return Convert.ToString(data.Rows[0]["NO"]);
        }

        public string GetFeeTurnInNo(long sourceId)
        {
            string sql = @"select a.no,a.医嘱序号 as 医嘱ID
                from 住院费用记录 a,费用审核记录 b
                where a.id=b.转出id and a.病人id=b.病人id and a.主页id=b.主页id 
                and a.医嘱序号=:SourceId";

            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, pars);

            if (data.Rows.Count > 0)
                return Convert.ToString(data.Rows[0]["NO"]);

            return "";
        }

        /// <summary>
        /// 更新药品收发记录的医嘱ID为新的医嘱ID
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <param name="billNo"></param>
        /// <returns></returns>
        public int UpdateRecDrugStuff(long sourceId, long newId, string billNo)
        {
            string sql = "update 药品收发记录 set 医嘱ID=:newId where no=:billNo and 医嘱ID=:sourceId";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input),
                new OracleParameter(":billNo", OracleDbType.Varchar2, billNo, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }
        /// <summary>
        /// 病人医嘱转录记录
        /// </summary>
        /// <returns></returns>
        public int InsertTransRecord(long newOrderId, long oldOrderId, int patientId, int homePageId, int operatorId, string operatorName, DateTime operatorTime)
        {
            string sql = @"INSERT INTO 病人医嘱转录记录 (
                        病人ID, 主页ID, 原医嘱ID, 新医嘱ID, 操作员ID, 操作员, 操作时间
                    ) 
                    VALUES (
                        :PatientId, :HomePageId, :OldOrderId, :NewOrderId, :OperatorId, :OperatorName, :operatorTime
                    )";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":PatientId", OracleDbType.Int32, patientId, ParameterDirection.Input),
                new OracleParameter(":HomePageId", OracleDbType.Int32, homePageId, ParameterDirection.Input),
                new OracleParameter(":OldOrderId", OracleDbType.Int64, oldOrderId, ParameterDirection.Input),
                new OracleParameter(":NewOrderId", OracleDbType.Int64, newOrderId, ParameterDirection.Input),
                new OracleParameter(":OperatorId", OracleDbType.Int32, operatorId, ParameterDirection.Input),
                new OracleParameter(":OperatorName", OracleDbType.Varchar2, operatorName, ParameterDirection.Input),
                new OracleParameter(":operatorTime", OracleDbType.Date, operatorTime, ParameterDirection.Input)

            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 判断指定医嘱是否已经被转过了
        /// </summary>
        /// <returns></returns>
        public bool CheckTraned(long sourceId)
        {
            string sql = "select 1 from 病人医嘱转录记录 a where a.原医嘱id=:SourceId";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input)
            };            
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, pars);
            return data.Rows.Count > 0;
        }

        public DataTable GetCvtOrderData(int pid, string regno)
        {
            string sql = @"Select a.id as 医嘱ID,a.相关ID,a.诊疗类别,a.诊疗项目id,b.操作类型,a.医嘱内容,a.标本部位,a.申请序号
                From 病人医嘱记录 A, 诊疗项目目录 B
                Where a.诊疗项目id = b.Id And a.病人来源 = 1 And a.医嘱状态=8   
                And (a.诊疗类别 In ('C', 'D') Or a.诊疗类别 = 'E' And b.操作类型 = '6' and a.相关id is null) 
                And a.病人id + 0 = :pid
                And a.挂号单 = :regno
                Order by a.序号";

            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":pid", OracleDbType.Int64, pid, ParameterDirection.Input),
                new OracleParameter(":regno", OracleDbType.Varchar2, regno, ParameterDirection.Input)
            };
            DataTable data = oracleData.ExecuteDataTable(sql, CommandType.Text, pars);
            return data;
        }

        /// <summary>
        /// 更新主医嘱ID到相关ID字段
        /// </summary>
        /// <param name="sourceId"></param>
        /// <param name="newId"></param>
        /// <param name="pid"></param>
        /// <param name="pvid"></param>
        /// <returns></returns>
        public int UpdOrderMainId(long sourceId, long newId, int pid, int pvid)
        {
            string sql = "update 病人医嘱记录 set 相关ID=:newId where 相关ID=:sourceId and 病人id=:pid and 主页id=:pvid";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":SourceId", OracleDbType.Int64, sourceId, ParameterDirection.Input),
                new OracleParameter(":NewId", OracleDbType.Int64, newId, ParameterDirection.Input),
                new OracleParameter(":pid", OracleDbType.Int32, pid, ParameterDirection.Input),
                new OracleParameter(":pvid", OracleDbType.Int32, pvid, ParameterDirection.Input) 
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }

        /// <summary>
        /// 更新申请序号
        /// </summary>
        /// <param name="oldnum"></param>
        /// <param name="newnum"></param>
        /// <param name="pid"></param>
        /// <param name="pvid"></param>
        /// <returns></returns>
        public int UpdOrderAppNum(long oldnum, long newnum, int pid, int pvid)
        {
            string sql = "update 病人医嘱记录 set 相关ID=:newnum where 相关ID=:oldnum and 病人id=:pid and 主页id=:pvid";
            OracleDataAccess oracleData = new OracleDataAccess();
            OracleParameter[] pars = {
                new OracleParameter(":newnum", OracleDbType.Int64, newnum, ParameterDirection.Input),
                new OracleParameter(":oldnum", OracleDbType.Int64, oldnum, ParameterDirection.Input),
                new OracleParameter(":pid", OracleDbType.Int32, pid, ParameterDirection.Input),
                new OracleParameter(":pvid", OracleDbType.Int32, pvid, ParameterDirection.Input)
            };
            return oracleData.ExecuteNonQuery(sql, true, pars);
        }
    }
}
