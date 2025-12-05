using NewCostHjy.Common;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using System;
using System.Collections.Generic;
using System.Data; 
using ZLSoft.UDS.AgentInterface;

namespace NewCostHjy.DAL {
    /// <summary>
    /// 数据访问基础类(基于Oracle)
    /// </summary>
    public class OracleDataAccess {
        public string dataSourceId = null;

        #region 数据库连接
        /// <summary>
        /// 使用默认连接
        /// </summary>
        public OracleDataAccess() {
        }

        /// <summary>
        /// 数据库连接
        /// </summary>
        /// <param name="configString"></param>
        public OracleDataAccess(string configString) {
            dataSourceId = configString;
        }

        /// <summary>
        /// 获取数据库连接
        /// </summary>
        /// <returns></returns> 
        public OracleConnection GetConnection()
        {
            OracleConnection conn;
            if (!string.IsNullOrEmpty(dataSourceId))
            {
                conn = new OracleConnection(dataSourceId);
            } else if (string.IsNullOrWhiteSpace(SiteConfigMain.TestConnStr))
            {
                conn = (OracleConnection)SiteConfigMain.UdsFactory.GetDbConnection(SiteConfigMain.UdsString.udsCodeZLHIS, DsIdentity.Code);
            } else
            {
                conn = new OracleConnection(SiteConfigMain.TestConnStr);
            }
            if (conn.State != ConnectionState.Open)
            {
                conn.Open();
            }
            return conn;
        }
        #endregion

        #region 执行数据库操作
        /// <summary>
        /// Reader方式获取数据，使用完后务必关闭Reader
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sqlParams"></param>
        /// <returns></returns>
        public OracleDataReader ExcuteDataReader(string sql, CommandType commandType, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                OracleCommand cmd = new OracleCommand(sql, connection);
                cmd.CommandType = commandType;
                OracleParameter[] cmdParms = ConvertParameter(sqlParams);
                if (cmdParms != null) {
                    foreach (OracleParameter parm in cmdParms) {
                        cmd.Parameters.Add(parm);
                    }
                }

                if (connection.State != ConnectionState.Open)
                    connection.Open();

                DateTime beginTime = DateTime.Now;
                OracleDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                return dataReader;
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        /// Reader方式获取数据，使用完后务必关闭Reader
        /// 按OracleParameter参数名称执行
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sqlParams"></param>
        /// <returns></returns>
        public OracleDataReader ExcuteDataReader(string sql, CommandType commandType, bool isParameterByName, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                OracleCommand cmd = new OracleCommand(sql, connection);
                cmd.CommandType = commandType;
                cmd.BindByName = isParameterByName;
                OracleParameter[] cmdParms = ConvertParameter(sqlParams);
                if (cmdParms != null) {
                    foreach (OracleParameter parm in cmdParms) {
                        cmd.Parameters.Add(parm);
                    }
                }

                if (connection.State != ConnectionState.Open)
                    connection.Open();

                DateTime beginTime = DateTime.Now;
                OracleDataReader dataReader = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                return dataReader;
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }


        /// <summary>
        /// DataTable方式获取数据
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="commandType"></param>
        /// <param name="sqlParams"></param>
        /// <returns></returns>
        public DataTable ExecuteDataTable(string sql, CommandType commandType, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                OracleCommand cmd = new OracleCommand(sql, connection);
                cmd.CommandType = commandType;//cmdType;

                OracleParameter[] cmdParms = (OracleParameter[])sqlParams;
                if (cmdParms != null) {
                    foreach (OracleParameter parm in cmdParms) {
                        cmd.Parameters.Add(parm);
                    }
                }

                if (connection.State != ConnectionState.Open)
                    connection.Open();

                using (OracleDataAdapter da = new OracleDataAdapter(cmd)) {
                    DataTable dt = new DataTable();

                    DateTime beginTime = DateTime.Now;
                    da.Fill(dt);
                    //da.Fill(ds, "ds");
                    SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                    cmd.Parameters.Clear();

                    return dt;
                }
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        /// DataTable方式获取数据
        /// 按OracleParameter参数名称执行
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="commandType"></param>
        /// <param name="sqlParams"></param>
        /// <returns></returns>
        public DataTable ExecuteDataTable(string sql, CommandType commandType, bool isParameterByName, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                OracleCommand cmd = new OracleCommand(sql, connection);
                cmd.CommandType = commandType;//cmdType;
                cmd.BindByName = isParameterByName;
                OracleParameter[] cmdParms = (OracleParameter[])sqlParams;
                if (cmdParms != null) {
                    foreach (OracleParameter parm in cmdParms) {
                        cmd.Parameters.Add(parm);
                    }
                }

                if (connection.State != ConnectionState.Open)
                    connection.Open();

                using (OracleDataAdapter da = new OracleDataAdapter(cmd)) {
                    DataTable dt = new DataTable();

                    DateTime beginTime = DateTime.Now;
                    da.Fill(dt);
                    //da.Fill(ds, "ds");
                    SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                    cmd.Parameters.Clear();

                    return dt;
                }
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        ///执行数据库操作，返回影响行数
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="commandType"></param>
        /// <param name="sqlParams"></param>
        public int ExecuteNonQuery(string sql, CommandType commandType, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                using (OracleCommand cmd = new OracleCommand()) {
                    cmd.CommandType = commandType;
                    PrepareCommand(cmd, connection, sql, commandType, sqlParams);

                    DateTime beginTime = DateTime.Now;
                    int count = cmd.ExecuteNonQuery();
                    SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                    return count;
                }
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        /// 执行数据库操作，返回影响行数
        /// 按OracleParameter参数名称执行
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="commandType"></param>
        /// <param name="sqlParams"></param>
        public int ExecuteNonQuery(string sql, CommandType commandType, bool isParameterByName, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                using (OracleCommand cmd = new OracleCommand()) {
                    cmd.BindByName = isParameterByName;
                    cmd.CommandType = commandType;
                    PrepareCommand(cmd, connection, sql, commandType, sqlParams);

                    DateTime beginTime = DateTime.Now;
                    int count = cmd.ExecuteNonQuery();
                    SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                    return count;
                }
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        /// 执行存储过程或者函数
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sqlParams"></param>
        /// <returns></returns>
        public Dictionary<string, object> ExecuteProcdure(string sql, params OracleParameter[] sqlParams) {
            OracleConnection conn = GetConnection();
            IList<OracleParameter> oracleParameters;
            Dictionary<string, object> keyValuePairs = new Dictionary<string, object>();
            try {
                using (OracleCommand cmd = new OracleCommand(sql, conn)) {
                    cmd.CommandType = CommandType.StoredProcedure;
                    oracleParameters = PrepareCommand(cmd, conn, sql, CommandType.StoredProcedure, sqlParams);

                    DateTime beginTime = DateTime.Now;
                    cmd.ExecuteNonQuery();
                    SQLRunLog(conn, sql, sqlParams, beginTime);//记录SQL执行日志
                }
                if (oracleParameters != null && oracleParameters.Count >= 0) {
                    foreach (var item in oracleParameters) {
                        keyValuePairs.Add(item.ParameterName, GetOraParamVal(item));

                    }
                }
            } catch (Exception e) {
                SQLErrorLog(conn, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (conn != null) {
                    conn.Close();
                    conn.Dispose();
                }
            }

            return keyValuePairs;
        }



        /// <summary>
        /// 执行存储过程或者函数
        /// 按OracleParameter参数名称执行
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sqlParams"></param>
        /// <returns></returns>
        public Dictionary<string, object> ExecuteProcdure(string sql, bool isParameterByName, params OracleParameter[] sqlParams) {

            OracleConnection conn = GetConnection();
            IList<OracleParameter> oracleParameters;
            Dictionary<string, object> keyValuePairs = new Dictionary<string, object>();
            try {
                using (OracleCommand cmd = new OracleCommand(sql, conn)) {
                    cmd.BindByName = isParameterByName;
                    cmd.CommandType = CommandType.StoredProcedure;
                    oracleParameters = PrepareCommand(cmd, conn, sql, CommandType.StoredProcedure, sqlParams);

                    DateTime beginTime = DateTime.Now;
                    cmd.ExecuteNonQuery();
                    SQLRunLog(conn, sql, sqlParams, beginTime);//记录SQL执行日志
                }
                if (oracleParameters != null && oracleParameters.Count >= 0) {
                    foreach (var item in oracleParameters) {
                        keyValuePairs.Add(item.ParameterName, GetOraParamVal(item));

                    }
                }
            } catch (Exception e) {
                SQLErrorLog(conn, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (conn != null) {
                    conn.Close();
                    conn.Dispose();
                }
            }

            return keyValuePairs;
        }

        /// <summary>
        /// 获取Oracle参数的值
        /// </summary>
        /// <param name="oraParam"></param>
        /// <returns></returns>
        protected virtual object GetOraParamVal(OracleParameter oraParam) {
            if (oraParam.Value == null || (oraParam.Value is INullable && (oraParam.Value as INullable).IsNull))
                return DBNull.Value;

            object val = DBNull.Value;
            if (oraParam.Value is OracleXmlType) {
                OracleXmlType xmltype = (OracleXmlType)oraParam.Value;
                if (!xmltype.IsEmpty) val = xmltype.Value;
            } else if (oraParam.Value is OracleBlob) {
                OracleBlob blobVal = (OracleBlob)oraParam.Value;
                if (!blobVal.IsNull) val = (oraParam.Value as OracleBlob).Value;
            } else if (oraParam.Value is OracleClob) {
                OracleClob clobVal = (OracleClob)oraParam.Value;
                if (!clobVal.IsNull) val = clobVal.Value;
            } else if (oraParam.Value is OracleDecimal) {
                OracleDecimal decimalVal = (OracleDecimal)oraParam.Value;
                if (!decimalVal.IsNull) val = decimalVal.Value;
            } else if (oraParam.Value is OracleDate) {
                OracleDate dateVal = (OracleDate)oraParam.Value;
                if (!dateVal.IsNull) val = dateVal.Value;
            } else if (oraParam.Value is OracleString) {
                OracleString stringVal = (OracleString)oraParam.Value;
                if (!stringVal.IsNull) val = stringVal.Value;
            } else if (oraParam.Value is OracleBFile) {
                OracleBFile fileVal = oraParam.Value as OracleBFile;
                if (!fileVal.IsNull) val = fileVal.Value;
            } else if (oraParam.Value is OracleBinary) {
                OracleBinary binaryVal = (OracleBinary)oraParam.Value;
                if (!binaryVal.IsNull) val = binaryVal.Value;
            } else if (oraParam.Value is OracleTimeStamp) {
                OracleTimeStamp timeStampVal = (OracleTimeStamp)oraParam.Value;
                if (!timeStampVal.IsNull) val = timeStampVal.Value;
            } else if (oraParam.Value is OracleRefCursor) {
                using (OracleRefCursor timeStampVal = (OracleRefCursor)oraParam.Value) {
                    if (timeStampVal.IsNull)
                        return null;
                    OracleDataReader dataReader = timeStampVal.GetDataReader();
                    DataTable datatable = new DataTable();
                    datatable.Load(dataReader);
                    return datatable;
                }
            } else {
                val = oraParam.Value;
            }
            return val;
        }


        /// <summary>
        /// 执行数据库操作，返回影响行数
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sqlParams"></param>
        public int ExecuteNonQuery(string sql, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                using (OracleCommand cmd = new OracleCommand()) {
                    cmd.CommandType = CommandType.Text;
                    PrepareCommand(cmd, connection, sql, CommandType.Text, sqlParams);

                    DateTime beginTime = DateTime.Now;
                    int count = cmd.ExecuteNonQuery();
                    SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                    return count;
                }
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        /// 执行数据库操作，返回影响行数
        /// 按OracleParameter参数名称执行
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sqlParams"></param>
        public int ExecuteNonQuery(string sql, bool isParameterByName, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                using (OracleCommand cmd = new OracleCommand()) {
                    cmd.BindByName = isParameterByName;
                    cmd.CommandType = CommandType.Text;
                    PrepareCommand(cmd, connection, sql, CommandType.Text, sqlParams);

                    DateTime beginTime = DateTime.Now;
                    int count = cmd.ExecuteNonQuery();
                    SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                    return count;
                }
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        /// 执行数据库操作，返回对象
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="commandType"></param>
        /// <param name="sqlParams"></param>
        /// <returns></returns>
        public object ExecuteScalar(string sql, CommandType commandType, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                using (OracleCommand cmd = new OracleCommand()) {
                    cmd.CommandType = commandType;
                    PrepareCommand(cmd, connection, sql, commandType, sqlParams);

                    DateTime beginTime = DateTime.Now;
                    object obj = cmd.ExecuteScalar();
                    SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                    cmd.Parameters.Clear();
                    if ((Object.Equals(obj, null)) || (Object.Equals(obj, System.DBNull.Value)))
                        return null;
                    else
                        return obj;

                }
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        /// 执行数据库操作，返回对象
        /// 按OracleParameter参数名称执行
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="commandType"></param>
        /// <param name="sqlParams"></param>
        /// <returns></returns>
        public object ExecuteScalar(string sql, CommandType commandType, bool isParameterByName, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                using (OracleCommand cmd = new OracleCommand()) {
                    cmd.BindByName = isParameterByName;
                    cmd.CommandType = commandType;
                    PrepareCommand(cmd, connection, sql, commandType, sqlParams);

                    DateTime beginTime = DateTime.Now;
                    object obj = cmd.ExecuteScalar();
                    SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                    cmd.Parameters.Clear();
                    if ((Object.Equals(obj, null)) || (Object.Equals(obj, System.DBNull.Value)))
                        return null;
                    else
                        return obj;
                }
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        /// 执行数据库操作，返回对象(执行sql语句)
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sqlParams"></param>
        /// <returns></returns>
        public object ExecuteScalar(string sql, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                using (OracleCommand cmd = new OracleCommand()) {
                    cmd.CommandType = CommandType.Text;
                    PrepareCommand(cmd, connection, sql, CommandType.Text, sqlParams);

                    DateTime beginTime = DateTime.Now;
                    object obj = cmd.ExecuteScalar();
                    SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                    cmd.Parameters.Clear();
                    if ((Object.Equals(obj, null)) || (Object.Equals(obj, System.DBNull.Value)))
                        return null;
                    else
                        return obj;
                }
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }

        /// <summary>
        /// 执行数据库操作，返回对象(执行sql语句)
        /// 按OracleParameter参数名称执行
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sqlParams"></param>
        /// <returns></returns>
        public object ExecuteScalar(string sql, bool isParameterByName, params OracleParameter[] sqlParams) {
            OracleConnection connection = GetConnection();
            try {
                using (OracleCommand cmd = new OracleCommand()) {
                    cmd.BindByName = isParameterByName;
                    cmd.CommandType = CommandType.Text;
                    PrepareCommand(cmd, connection, sql, CommandType.Text, sqlParams);

                    DateTime beginTime = DateTime.Now;
                    object obj = cmd.ExecuteScalar();
                    SQLRunLog(connection, sql, sqlParams, beginTime);//记录SQL执行日志

                    cmd.Parameters.Clear();
                    if ((Object.Equals(obj, null)) || (Object.Equals(obj, System.DBNull.Value)))
                        return null;
                    else
                        return obj;
                }
            } catch (Exception e) {
                SQLErrorLog(connection, sql, sqlParams, e.Message);//记录SQL错误日志
                throw new Exception(e.Message, e);
            } finally {
                if (connection != null) {
                    connection.Close();
                    connection.Dispose();
                }
            }
        }
        #endregion

        #region OracleParameter配置
        private IList<OracleParameter> PrepareCommand(OracleCommand cmd, OracleConnection conn, string cmdText, CommandType commandType, object[] sqlParams) {
            OracleParameter[] cmdParms = ConvertParameter(sqlParams);
            if (conn.State != ConnectionState.Open)
                conn.Open();
            cmd.Connection = conn;
            cmd.CommandText = cmdText;
            cmd.CommandType = commandType;
            IList<OracleParameter> parameters = new List<OracleParameter>();
            if (cmdParms != null) {
                foreach (OracleParameter parm in cmdParms) {
                    cmd.Parameters.Add(parm);
                    if (parm.Direction != ParameterDirection.Input) {
                        parameters.Add(parm);
                    }
                }
            }
            return parameters;
        }



        OracleParameter[] ConvertParameter(object[] cmdParms) {
            if (cmdParms == null)
                return null;
            return cmdParms as OracleParameter[];
            //OracleParameter[] ps = CreateOracleParameter(cmdParms.Length);
            //for (int i = 0; i < cmdParms.Length; i++)
            //{
            //    ps[i].Value = cmdParms[i];
            //}
            //return ps;
        }


        OracleParameter[] CreateOracleParameter(int parameterCount) {
            OracleParameter[] ps = new OracleParameter[parameterCount];
            for (int i = 0; i < parameterCount; i++) {
                ps[i] = new OracleParameter();
            }
            return ps;
        }

        public bool ValidateConnection() {
            try {
                OracleConnection connection = GetConnection();
                if (connection.State != ConnectionState.Open)
                    connection.Open();
                if (connection.State == ConnectionState.Open) {
                    connection.Close();
                    return true;
                }
                return false;
            } catch (Exception) {
                return false;
            }
        }
        #endregion

        #region SQL日志函数
        /// <summary>
        /// 记录SQL执行日志
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sqlParams"></param>
        /// <param name="beginTime"></param>
        private void SQLRunLog(OracleConnection conn, string sql, OracleParameter[] sqlParams, DateTime beginTime) {
            double expendTime = (DateTime.Now - beginTime).TotalMilliseconds;
            string logInfo = GetSQLDebugInfo(conn, sql, sqlParams, expendTime: expendTime);
            //LoggerHelper.Debug(logInfo);
        }

        /// <summary>
        /// 记录SQL错误日志
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="sqlParams"></param>
        /// <param name="errMsg"></param>
        private void SQLErrorLog(OracleConnection conn, string sql, OracleParameter[] sqlParams, string errMsg) {
            string logInfo = GetSQLDebugInfo(conn, sql, sqlParams, errMsg: errMsg);
            //LoggerHelper.Error(logInfo, null);
        }

        /// <summary>
        /// 生成SQL执行调试日志信息
        /// </summary>
        /// <param name="sql">SQL语句</param>
        /// <param name="cmdParms">SQL参数</param>
        /// <returns></returns>
        private string GetSQLDebugInfo(OracleConnection conn, string sql, OracleParameter[] sqlParams, double expendTime = -1, string errMsg = "") {
            string sqlExec = sql;
            string paraStr = "";

            if (sqlParams != null) {
                foreach (OracleParameter para in sqlParams) {
                    if (para.Direction == ParameterDirection.Input) {
                        paraStr += "</br>\r\n\t参数名：\"" + para.ParameterName + "\"，参数值：" + GetParameterValue(para, false);
                        //sqlExec = CommonHelper.FullWordToReplace(sqlExec, para.ParameterName.Trim(), GetParameterValue(para, true));
                    }
                }
            }

            string expendTimeInfo = expendTime + " ms";
            if (expendTime >= 50)//高于50ms的红色显示
                expendTimeInfo = "<span style='color:red;'>" + expendTime + " ms</span>";

            string info =
                (errMsg != "" ? "</br>\r\n【SQL执行错误】" + errMsg + "</br>\r\n" : "</br>\r\n") +
                "【执行SQL" + (expendTime != -1 ? "，耗时：" + expendTimeInfo : "") + "】</br>\r\n\t" + sqlExec + "</br>\r\n</br>\r\n" +
                "【原始SQL】</br>\r\n\t" + sql + (paraStr != "" ? "</br>\r\n" + paraStr : "") + "</br>\r\n</br>\r\n" +
                "【数据库】</br>\r\n\t" + conn.ConnectionString + "</br>\r\n";

            return info;
        }

        /// <summary>
        /// 获取指定参数在SQL中使用的字符串书写值
        /// </summary>
        /// <param name="para"></param>
        /// <param name="forOracle">是否按Oracle SQL可使用转换</param>
        /// <returns></returns>
        private string GetParameterValue(OracleParameter para, bool forOracle) {
            if (para.Value == null || para.Value == DBNull.Value) return "null";

            string value = "";
            switch (para.OracleDbType) {
                case OracleDbType.Byte:
                case OracleDbType.Long:
                case OracleDbType.Int16:
                case OracleDbType.Int32:
                case OracleDbType.Int64:
                case OracleDbType.Single:
                case OracleDbType.Double:
                case OracleDbType.Decimal:
                    value = para.Value.ToString();
                    break;
                case OracleDbType.Char:
                case OracleDbType.Varchar2:
                case OracleDbType.Clob:
                case OracleDbType.NChar:
                case OracleDbType.NVarchar2:
                case OracleDbType.NClob:
                    if (forOracle)
                        value = "'" + para.Value.ToString().Replace("'", "''") + "'";
                    else
                        value = "\"" + para.Value.ToString() + "\"";
                    break;
                case OracleDbType.Date:
                case OracleDbType.TimeStamp:
                    DateTime valueDate;
                    if (DateTime.TryParse(para.Value.ToString(), out valueDate)) {
                        if (forOracle)
                            value = "To_Date('" + valueDate.ToString("yyyy-MM-dd HH:mm:ss") + "','YYYY-MM-DD HH24:MI:SS')";
                        else
                            value = valueDate.ToString("yyyy-MM-dd HH:mm:ss");
                    } else
                        value = para.Value.ToString();
                    break;
                default:
                    value = para.Value.ToString();
                    break;
            }
            return value;
        }
        #endregion
    }
}
