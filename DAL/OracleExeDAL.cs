using Oracle.ManagedDataAccess.Client;

namespace NewCostHjy.DAL
{
    public class OracleExeDAL
    {
        // 数据库连接字符串（请替换为你的实际配置）
        private static readonly string _connectionString =
            "Data Source=(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.56.1)(PORT=1521))(CONNECT_DATA=(SERVICE_NAME=orcl)));" +
            "User Id=ZLHIS;Password=his;";

        /// <summary>
        /// 调用 Oracle 存储过程 Zl_病案提交记录_Insert
        /// </summary>
        /// <param name="patientId">病人ID</param>
        /// <param name="homePageId">主页ID</param>
        public static void InsertMedicalRecordSubmit(int patientId, int homePageId)
        {
            // 使用 using 语句自动释放数据库连接（最佳实践）
            using (OracleConnection conn = new OracleConnection(_connectionString))
            {
                conn.Open(); // 打开数据库连接

                // 创建命令对象，指定调用存储过程
                using (OracleCommand cmd = new OracleCommand())
                {
                    cmd.Connection = conn;
                    cmd.CommandType = System.Data.CommandType.StoredProcedure; // 类型为存储过程
                    cmd.CommandText = "Zl_病案提交记录_Insert"; // 存储过程名称

                    // 添加存储过程参数（参数名要和存储过程定义一致）
                    // 病人ID参数
                    cmd.Parameters.Add("病人id_In", OracleDbType.Int32).Value = patientId;
                    // 主页ID参数
                    cmd.Parameters.Add("主页id_In", OracleDbType.Int32).Value = homePageId;

                    // 执行存储过程
                    cmd.ExecuteNonQuery();
                }
            }
        }
    }
}
