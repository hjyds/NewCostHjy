using Microsoft.AspNetCore.Mvc.ApiExplorer;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Transactions;

namespace NewCostHjy.BLL
{
    /// <summary>
    /// 门诊医嘱转住院医嘱     
    /// </summary>
    public class ConvertPatOrderBLL
    {

        public void ConvertFun(CPatOrderIn parIn)
        {
            //try
            //{
            // 事务范围，确保ConvertFunCore方法中的所有数据库操作在同一个事务中执行，如果发生异常则回滚事务
            using (TransactionScope transaction = new TransactionScope(TransactionScopeOption.RequiresNew,
                    new TransactionOptions { IsolationLevel = System.Transactions.IsolationLevel.ReadCommitted }))
            {

                ConvertFunCore(parIn);
                transaction.Complete();
            }
            //} catch (Exception ex)
            //{

            //    //throw;
            //}
        }

        public void ConvertFunCore(CPatOrderIn parIn)
        {
            long sourceId; long newId; int serNum;
            int result;
            int pageId = parIn.pvid;
            int pid = parIn.pid;
            string ordertagid = "";
            long sendnum = 0; long oldsendnum = 0, appnum = 0; ;
            string billNo = "";
            DataTable sendData, orderData;
            Dictionary<long, long> SendNoMapping = new Dictionary<long, long>();
            Dictionary<long, long> MainOrderMapping = new Dictionary<long, long>();
            Dictionary<long, long> AppNumMapping = new Dictionary<long, long>();

            ConvertPatOrderDAL convertPatOrderDAL = new ConvertPatOrderDAL();

            orderData = convertPatOrderDAL.GetCvtOrderData(pid, parIn.regno);
            serNum = convertPatOrderDAL.GetMaxSerial(pid, pageId);
            DateTime curTime = convertPatOrderDAL.GetOraSysDate();
            int operatorId = parIn.operatorid;
            string operatorName = parIn.operatorname;

            for (int i = 0; i < orderData.Rows.Count; i++)
            {
                sourceId = Convert.ToInt64(orderData.Rows[i]["医嘱ID"]);
                if (convertPatOrderDAL.CheckTraned(sourceId))
                {
                    throw new Exception("已经被转成了住院医嘱，不能重复转换。医嘱ID=" + sourceId);
                }

                sendData = convertPatOrderDAL.GetOrderSendData(sourceId);
                newId = convertPatOrderDAL.GetSequenceNextValue("病人医嘱记录_ID");

                if (orderData.Rows[i].IsNull("相关ID"))
                {
                    MainOrderMapping.Add(sourceId, newId);
                }

                if (!orderData.Rows[i].IsNull("申请序号"))
                {
                    appnum = Convert.ToInt64(orderData.Rows[i]["申请序号"]);
                    //病人医嘱记录_申请序号
                    if (!AppNumMapping.ContainsKey(appnum))
                    {
                        AppNumMapping.Add(appnum, convertPatOrderDAL.GetSequenceNextValue("病人医嘱记录_申请序号"));
                    }
                }

                ordertagid = Guid.NewGuid().ToString();
                serNum = serNum + 1;
                result = convertPatOrderDAL.CopyMedicalOrder(sourceId, newId, serNum, pageId);
                result = convertPatOrderDAL.InsertMedicalOrderStatus(sourceId, newId);
                result = convertPatOrderDAL.InsertOrderAddItem(sourceId, newId);
                result = convertPatOrderDAL.InsertOrderExtraFee(sourceId, newId);
                result = convertPatOrderDAL.InsertOrderTagItem(sourceId, newId, ordertagid);
                result = convertPatOrderDAL.InsertOrderPrice(sourceId, newId);
                foreach (DataRow dr in sendData.Rows)
                {
                    oldsendnum = Convert.ToInt64(dr["发送号"]);
                    if (SendNoMapping.ContainsKey(oldsendnum))
                    {
                        sendnum = SendNoMapping[oldsendnum];
                    } else
                    {
                        sendnum = convertPatOrderDAL.GetSendNum(); // 生成新的老发送号 
                        SendNoMapping.Add(oldsendnum, sendnum);
                    }
                    bool blnIsTurn = true;
                    billNo = convertPatOrderDAL.GetFeeTurnInNo(sourceId);//如果不为空说明是转出了的
                    if (string.IsNullOrWhiteSpace(billNo))
                    {
                        billNo = convertPatOrderDAL.GetBillNo();
                        blnIsTurn = false;
                    }
                    result = convertPatOrderDAL.InsertOrderSend(sourceId, newId, sendnum, billNo, oldsendnum);
                    result = convertPatOrderDAL.InsertOrderExecTime(sourceId, newId, sendnum, oldsendnum);
                    result = convertPatOrderDAL.InsertOrderExecPrice(sourceId, newId, sendnum, oldsendnum);

                    if (blnIsTurn)
                    {
                        result = convertPatOrderDAL.UpdateRecDrugStuff(sourceId, newId, billNo);
                    }

                }

                foreach (var item in MainOrderMapping)
                {
                    result = convertPatOrderDAL.UpdOrderMainId(item.Key, item.Value, pid, pageId);
                }

                foreach (var item in AppNumMapping)
                {
                    result = convertPatOrderDAL.UpdOrderAppNum(item.Key, item.Value, pid, pageId);
                }

                result = convertPatOrderDAL.InsertTransRecord(newId, sourceId, pid, pageId, operatorId, operatorName, curTime);
            }
            //End
        }

    }
}
