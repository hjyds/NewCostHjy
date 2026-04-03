using NewCostHjy.DAL;
using NewCostHjy.Models;
using Oracle.ManagedDataAccess.Client;
using System;
using System.Collections.Generic;
using System.Data;

namespace NewCostHjy.DAL
{
    public class ToDoDAL
    {
        private OracleDataAccess _oracleDataAccess;

        public ToDoDAL()
        {
            _oracleDataAccess = new OracleDataAccess();
        }

        /// <summary>
        /// 初始化待办事项表
        /// </summary>
        public void InitToDoTable()
        {
            string createTableSql = @"CREATE TABLE TODO_ITEMS (
                                        ID NUMBER(10) PRIMARY KEY,
                                        TITLE VARCHAR2(200) NOT NULL,
                                        DESCRIPTION CLOB,
                                        IS_COMPLETED NUMBER(1) DEFAULT 0,
                                        CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                        COMPLETED_AT TIMESTAMP
                                    )";

            string createSequenceSql = @"CREATE SEQUENCE TODO_ITEMS_SEQ
                                        START WITH 1
                                        INCREMENT BY 1
                                        NOMAXVALUE";

            try
            {
                // 尝试创建表
                _oracleDataAccess.ExecuteNonQuery(createTableSql);
                // 尝试创建序列
                _oracleDataAccess.ExecuteNonQuery(createSequenceSql);
            }
            catch (Exception ex)
            {
                // 表或序列可能已存在，忽略错误
                Console.WriteLine("初始化待办事项表时出错: " + ex.Message);
            }
        }

        /// <summary>
        /// 获取所有待办事项
        /// </summary>
        /// <returns></returns>
        public List<ToDoItem> GetAllToDoItems()
        {
            List<ToDoItem> toDoItems = new List<ToDoItem>();
            string sql = "SELECT ID, TITLE, DESCRIPTION, IS_COMPLETED, CREATED_AT, COMPLETED_AT FROM TODO_ITEMS ORDER BY CREATED_AT DESC";

            DataTable dt = _oracleDataAccess.ExecuteDataTable(sql, System.Data.CommandType.Text);

            foreach (DataRow row in dt.Rows)
            {
                ToDoItem item = new ToDoItem
                {
                    Id = Convert.ToInt32(row["ID"]),
                    Title = row["TITLE"].ToString(),
                    Description = row["DESCRIPTION"]?.ToString(),
                    IsCompleted = Convert.ToInt32(row["IS_COMPLETED"]) == 1,
                    CreatedAt = Convert.ToDateTime(row["CREATED_AT"]),
                    CompletedAt = row["COMPLETED_AT"] != DBNull.Value ? Convert.ToDateTime(row["COMPLETED_AT"]) : (DateTime?)null
                };
                toDoItems.Add(item);
            }

            return toDoItems;
        }

        /// <summary>
        /// 根据ID获取待办事项
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public ToDoItem GetToDoItemById(int id)
        {
            string sql = "SELECT ID, TITLE, DESCRIPTION, IS_COMPLETED, CREATED_AT, COMPLETED_AT FROM TODO_ITEMS WHERE ID = :ID";
            OracleParameter[] parameters = {
                new OracleParameter(":ID", OracleDbType.Int32, id, System.Data.ParameterDirection.Input)
            };

            DataTable dt = _oracleDataAccess.ExecuteDataTable(sql, System.Data.CommandType.Text, true, parameters);

            if (dt.Rows.Count > 0)
            {
                DataRow row = dt.Rows[0];
                return new ToDoItem
                {
                    Id = Convert.ToInt32(row["ID"]),
                    Title = row["TITLE"].ToString(),
                    Description = row["DESCRIPTION"]?.ToString(),
                    IsCompleted = Convert.ToInt32(row["IS_COMPLETED"]) == 1,
                    CreatedAt = Convert.ToDateTime(row["CREATED_AT"]),
                    CompletedAt = row["COMPLETED_AT"] != DBNull.Value ? Convert.ToDateTime(row["COMPLETED_AT"]) : (DateTime?)null
                };
            }

            return null;
        }

        /// <summary>
        /// 添加待办事项
        /// </summary>
        /// <param name="toDoItem"></param>
        /// <returns></returns>
        public int AddToDoItem(ToDoItem toDoItem)
        {
            string sql = @"INSERT INTO TODO_ITEMS (ID, TITLE, DESCRIPTION, IS_COMPLETED, CREATED_AT, COMPLETED_AT)
                          VALUES (TODO_ITEMS_SEQ.NEXTVAL, :TITLE, :DESCRIPTION, :IS_COMPLETED, :CREATED_AT, :COMPLETED_AT)";

            OracleParameter[] parameters = {
                new OracleParameter(":TITLE", OracleDbType.Varchar2, toDoItem.Title, System.Data.ParameterDirection.Input),
                new OracleParameter(":DESCRIPTION", OracleDbType.Clob, toDoItem.Description, System.Data.ParameterDirection.Input),
                new OracleParameter(":IS_COMPLETED", OracleDbType.Int32, toDoItem.IsCompleted ? 1 : 0, System.Data.ParameterDirection.Input),
                new OracleParameter(":CREATED_AT", OracleDbType.TimeStamp, toDoItem.CreatedAt, System.Data.ParameterDirection.Input),
                new OracleParameter(":COMPLETED_AT", OracleDbType.TimeStamp, toDoItem.CompletedAt.HasValue ? (object)toDoItem.CompletedAt.Value : DBNull.Value, System.Data.ParameterDirection.Input)
            };

            _oracleDataAccess.ExecuteNonQuery(sql, System.Data.CommandType.Text, true, parameters);
            
            // 获取刚刚插入的记录的 ID
            string getLastIdSql = "SELECT TODO_ITEMS_SEQ.CURRVAL FROM DUAL";
            object lastId = _oracleDataAccess.ExecuteScalar(getLastIdSql, System.Data.CommandType.Text);
            if (lastId != null)
            {
                return Convert.ToInt32(lastId);
            }

            return 0;
        }

        /// <summary>
        /// 更新待办事项
        /// </summary>
        /// <param name="toDoItem"></param>
        /// <returns></returns>
        public bool UpdateToDoItem(ToDoItem toDoItem)
        {
            string sql = @"UPDATE TODO_ITEMS
                          SET TITLE = :TITLE,
                              DESCRIPTION = :DESCRIPTION,
                              IS_COMPLETED = :IS_COMPLETED,
                              COMPLETED_AT = :COMPLETED_AT
                          WHERE ID = :ID";

            OracleParameter[] parameters = {
                new OracleParameter(":TITLE", OracleDbType.Varchar2, toDoItem.Title, System.Data.ParameterDirection.Input),
                new OracleParameter(":DESCRIPTION", OracleDbType.Clob, toDoItem.Description, System.Data.ParameterDirection.Input),
                new OracleParameter(":IS_COMPLETED", OracleDbType.Int32, toDoItem.IsCompleted ? 1 : 0, System.Data.ParameterDirection.Input),
                new OracleParameter(":COMPLETED_AT", OracleDbType.TimeStamp, toDoItem.CompletedAt.HasValue ? (object)toDoItem.CompletedAt.Value : DBNull.Value, System.Data.ParameterDirection.Input),
                new OracleParameter(":ID", OracleDbType.Int32, toDoItem.Id, System.Data.ParameterDirection.Input)
            };

            int rowsAffected = _oracleDataAccess.ExecuteNonQuery(sql, System.Data.CommandType.Text, true, parameters);
            return rowsAffected > 0;
        }

        /// <summary>
        /// 删除待办事项
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public bool DeleteToDoItem(int id)
        {
            string sql = "DELETE FROM TODO_ITEMS WHERE ID = :ID";
            OracleParameter[] parameters = {
                new OracleParameter(":ID", OracleDbType.Int32, id, System.Data.ParameterDirection.Input)
            };

            int rowsAffected = _oracleDataAccess.ExecuteNonQuery(sql, System.Data.CommandType.Text, true, parameters);
            return rowsAffected > 0;
        }
    }
}