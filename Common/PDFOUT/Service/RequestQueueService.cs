using NewCostHjy.Models;
using System.Collections.Generic; 

namespace NewCostHjy.Common {
    /// <summary>
    /// 请求队列服务
    /// </summary>
    public class RequestQueueService : IRequestQueueService
    {
        /// <summary>
        /// 定义EMR队列
        /// </summary>
        private readonly Queue<RequestQueue> _queue = new Queue<RequestQueue>();

        /// <summary>
        /// 创建字典存储患者文件清单列表
        /// </summary>
        private readonly Dictionary<string, string> _listDic = new Dictionary<string, string>();

        /// <summary>
        /// CIS调用服务
        /// </summary>
        private readonly ICISComponentService _cISComponentService;

        /// <summary>
        /// 队列是否正在运行
        /// </summary>
        private static bool _disposed = false;

        public RequestQueueService(ICISComponentService cISComponentService)
        {
            _cISComponentService = cISComponentService;
        }

        /// <summary>
        /// 添加EMR到队列
        /// </summary>
        /// <param name="emrPara"></param>
        public void AddRequestQueueToQueue(RequestQueue requestQueue)
        {
            _queue.Enqueue(requestQueue);
        }

        /// <summary>
        /// 执行EMR队列
        /// </summary>
        public void ExecuteQueue()
        {
            if(CISComponentService._IsInit && _queue.Count > 0 && !_disposed)
            {
                _disposed = true;
                RequestQueue requestQueue = _queue.Dequeue();
                // 如果EMRPara.StrDocId不为空，则执行EMR打印
                if (requestQueue.EMRPara != null && !string.IsNullOrEmpty(requestQueue.EMRPara.StrDocId))
                {
                    if (!_cISComponentService.PrintDocEMR(requestQueue.EMRPara.StrDocId,
                    requestQueue.EMRPara.StrFilePath, requestQueue.EMRPara.StrFileName, requestQueue.EMRPara.StrExtPara))
                    {
                        _queue.Clear();
                    }
                }
                // 如果DocumentPara.LngPatiID不为空，则执行Document打印
                else if (requestQueue.DocumentPara != null && requestQueue.DocumentPara.LngPatiID > 0)
                {
                    if (!_cISComponentService.PrintDocument(requestQueue.DocumentPara.LngPatiID,
                    requestQueue.DocumentPara.LngVisitID, requestQueue.DocumentPara.StrFilePath, requestQueue.DocumentPara.StrXML, requestQueue.DocumentPara.BlnMerge,
                    requestQueue.DocumentPara.StrRegNO, requestQueue.DocumentPara.BlnPrintTag, requestQueue.DocumentPara.StrPrinter, requestQueue.DocumentPara.StrExtPara))
                    {
                        _queue.Clear();
                    }
                }
                // 如果ReportPara.strReportName不为空，则执行Report打印
                else if (requestQueue.ReportPara != null && !string.IsNullOrEmpty(requestQueue.ReportPara.strReportName))
                {
                    if (!_cISComponentService.PrintReport(requestQueue.ReportPara.lngSysNo,
                    requestQueue.ReportPara.strReportName, requestQueue.ReportPara.strInfo))
                    {
                        _queue.Clear();
                    }
                }
                // 都没有，则执行获取列表
                else if(requestQueue.ListPara != null)
                {
                    string strXml = _cISComponentService.GetPrintList(requestQueue.ListPara.LngPatiID, requestQueue.ListPara.LngVisitID, requestQueue.ListPara.StrRegNO, requestQueue.ListPara.BlnHomepageMerge, requestQueue.ListPara.StrExtPara);
                    string strKey = requestQueue.ListPara.LngPatiID + "_" + requestQueue.ListPara.LngVisitID + "_" + requestQueue.ListPara.StrRegNO;
                    if (IsListDicExist(strKey))
                    {
                        // 更新字典
                        _listDic[strKey] = strXml;
                    }
                    else
                    {
                        // 插入字典
                        _listDic.Add(strKey, strXml);
                    }
                }
                _cISComponentService.CheckPrintTimes();
                _disposed = false;
            }
            
        }

        /// <summary>
        /// 判断字典是否存在
        /// </summary>
        /// <param name="strKey"></param>
        /// <returns></returns>
        public bool IsListDicExist(string strKey)
        {
            return _listDic.TryGetValue(strKey,out string strValue);
        }

        /// <summary>
        /// 通过key值获取字典的值，并删除字典
        /// </summary>
        /// <param name="strKey"></param>
        /// <returns></returns>
        public string GetListDicValue(string strKey)
        {
            string strValue = "";
            if (_listDic.TryGetValue(strKey, out strValue))
            {
                _listDic.Remove(strKey);
            }
            return strValue;
        }
    }
}
