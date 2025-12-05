using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using System.Threading;
using System;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NewCostHjy.Common;
using NewCostHjy.Models;
using Newtonsoft.Json;
using System.IO;
using NewCostHjy.BLL.zlHisCom;

namespace NewCostHjy.Controllers
{ 
    /// <summary>
    /// PDF输入相关的API
    /// </summary>
    [ApiController]
    public class CISController : ControllerBase {

        private readonly ILogger _logger;
        private readonly ICISComponentService _cISComponentService;
        private readonly IRequestQueueService _requestQueueService;
        /// <summary>
        /// 配置信息
        /// </summary>
        private readonly ConfigInfo _configInfo;
        public CISController(ILogger<CISController> logger, ICISComponentService cISComponentService, IOptions<ConfigInfo> configInfo, IRequestQueueService requestQueueService)
        {
            _logger = logger;
            _cISComponentService = cISComponentService;
            _configInfo = configInfo.Value;
            _requestQueueService = requestQueueService;
        }
        
        /// <summary>
        /// 初始化HIS通讯组件Helper组件
        /// </summary>
        /// <param name="objPar"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/cis/HisComInit")]
        public IActionResult HisComInit([FromBody] HisComInitM objPar)
        {
            ////入参格式：{ip:"",port:"",sid:"",user:"",pwd:""}
            HisCom hisCom = new HisCom();
            string jsonString = hisCom.InitCOM(JsonConvert.SerializeObject(objPar));
            return Content(jsonString, "application/json");
        }

        /// <summary>
        /// 获取病人本次住院可输出的文件清单
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [Route("api/cis/GetPrintList")]
        public IActionResult GetPrintList([FromBody] QueryPDFPar objPara)
        {
            JObject outJson = new JObject();
            try
            {
                string para = JsonConvert.SerializeObject(objPara);
                _logger.LogInformation("CISController.GetPrintList接收到入参：" + para);
                JObject inputJson = JObject.Parse(para);
                string strPatiID = JObjectHelper.GetKeyValue(inputJson, "lngPatiID");
                string strVisitID = JObjectHelper.GetKeyValue(inputJson, "lngVisitID");
                string strRegNO = JObjectHelper.GetKeyValue(inputJson, "strRegNO");
                if (string.IsNullOrEmpty(strPatiID) || (string.IsNullOrEmpty(strVisitID) && string.IsNullOrEmpty(strRegNO)))
                {
                    outJson["code"] = 1;
                    outJson["msg"] = "病人ID和就诊ID不能为空。";
                    outJson["data"] = null;
                } else
                {
                    long lngPatiID = long.Parse(strPatiID);
                    long lngVisitID = long.Parse(strVisitID);
                    bool blnHomepageMerge = !string.IsNullOrEmpty(JObjectHelper.GetKeyValue(inputJson, "blnHomepageMerge")) && Convert.ToBoolean(JObjectHelper.GetKeyValue(inputJson, "blnHomepageMerge"));
                    string strExtPara = !string.IsNullOrEmpty(JObjectHelper.GetKeyValue(inputJson, "strExtPara")) ? JObjectHelper.GetKeyValue(inputJson, "strExtPara") : "RecStatus=1";
      
                    // 将入参写入队列
                    RequestQueue requestQueue = new RequestQueue();
                    ListPara listPara = new ListPara() {
                        LngPatiID = lngPatiID,
                        LngVisitID = lngVisitID,
                        StrRegNO = strRegNO,
                        BlnHomepageMerge = blnHomepageMerge,
                        StrExtPara = strExtPara
                    };
                    requestQueue.ListPara = listPara;
                    _requestQueueService.AddRequestQueueToQueue(requestQueue);

                    string strKey = lngPatiID + "_" + lngVisitID + "_" + strRegNO;

                    DateTime nowDate = DateTime.Now;
                    while (!_requestQueueService.IsListDicExist(strKey) && (DateTime.Now - nowDate).TotalSeconds < _configInfo.PrintTimeout / 1000) Thread.Sleep(100);

                    outJson["code"] = 0;
                    JObject jresult = JObjectHelper.XmlToJObject(_requestQueueService.GetListDicValue(strKey));
                    if (jresult != null)
                    {
                        _logger.LogInformation("CISController.GetPrintList获取文件清单成功。");
                        outJson["msg"] = "";
                        outJson["data"] = jresult["items"]["item"];
                    } else
                    {
                        outJson["msg"] = "获取不到文件清单，请检查参数后重试。";
                        outJson["data"] = null;
                    }
                }
            } catch (System.Exception ex)
            {
                _logger.LogError("CISController.GetPrintList异常：" + ex.Message);
                outJson["code"] = 1;
                outJson["msg"] = "CISController.GetPrintList异常：" + ex.Message;
                outJson["data"] = null;
            }
            string jsonString = JsonConvert.SerializeObject(outJson);
            return Content(jsonString, "application/json");
        }


        /// <summary>
        /// 输出EMR文件
        /// </summary>
        /// <param name="para"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/cis/PrintDocEMR")]
        public IActionResult PrintDocEMR(string para)
        {
            JObject outJson = new JObject();
            try
            {
                _logger.LogInformation("CISController.PrintDocEMR接收到入参：" + para);
                // 将body转为json对象
                JObject inputJson = JObject.Parse(para);
                string strDocId = JObjectHelper.GetKeyValue(inputJson, "strDocId");
                if (string.IsNullOrEmpty(strDocId))
                {
                    outJson["code"] = 1;
                    outJson["msg"] = "EMR文件主文档ID不能为空。";
                    outJson["data"] = "";
                } else
                {
                    string strExtPara = JObjectHelper.GetKeyValue(inputJson, "strExtPara");
                    // 获取当前文件路径
                    string strFilePath = System.AppDomain.CurrentDomain.BaseDirectory + "PDF\\EMR";
                    string strFileName = strDocId + ".PDF"; //"CentPrint.PDF";

                    // 检查文件是否存在，如果存在，则删除
                    if (System.IO.File.Exists(strFilePath + "\\" + strFileName))
                    {
                        try
                        {
                            System.IO.File.Delete(strFilePath + "\\" + strFileName);
                        } catch (Exception ex) { _logger.LogError("删除文件【" + strFilePath + strFileName + "】异常：" + ex.Message); }
                    }

                    // 生成PDF文件
                    //_cISComponentService.PrintDocEMR(strDocId, strFilePath, strFileName, strExtPara);

                    // 将入参写入队列
                    RequestQueue requestQueue = new RequestQueue();
                    EMRPara eMRPara = new EMRPara {
                        StrDocId = strDocId,
                        StrFilePath = strFilePath,
                        StrFileName = strFileName,
                        StrExtPara = strExtPara
                    };
                    requestQueue.EMRPara = eMRPara;
                    _requestQueueService.AddRequestQueueToQueue(requestQueue);

                    DateTime nowDate = DateTime.Now;
                    while (!System.IO.File.Exists(strFilePath + "\\" + strFileName) && (DateTime.Now - nowDate).TotalSeconds < _configInfo.PrintTimeout / 1000) Thread.Sleep(100);

                    // 检查文件是否存在并返回文件base64字符串
                    if (System.IO.File.Exists(strFilePath + "\\" + strFileName))
                    {
                        _logger.LogInformation("CISController.PrintDocEMR生成PDF文件成功。");
                        outJson["code"] = 0;
                        outJson["msg"] = "";
                        outJson["data"] = ConvertToBase64(strFilePath + "\\", strFileName);
                    } else
                    {
                        outJson["code"] = 1;
                        outJson["msg"] = "生成PDF失败。";
                        outJson["data"] = "";
                    }
                }
            } catch (System.Exception ex)
            {
                _logger.LogError("CISController.PrintDocEMR异常：" + ex.Message);
                outJson["code"] = 1;
                outJson["msg"] = "CISController.PrintDocEMR异常：" + ex.Message;
                outJson["data"] = "";
            }
            string jsonString = JsonConvert.SerializeObject(outJson);
            return Content(jsonString, "application/json");
        }

        /// <summary>
        /// 输出病人指定文件
        /// </summary>
        /// <param name="para"></param>
        /// <returns></returns>
        [HttpPost]
        [Route("api/cis/PrintDocument")]
        public IActionResult PrintDocument([FromBody] QueryPDFPar objPara)
        {
            JObject outJson = new JObject();
            string jsonString;
            try
            {
                string para = JsonConvert.SerializeObject(objPara);
                Console.WriteLine(para);
                _logger.LogInformation("CISController.PrintDocument接收到入参：" + para);
                // 将body转为json对象
                JObject inputJson = JObject.Parse(para);
                string strPatiID = JObjectHelper.GetKeyValue(inputJson, "lngPatiID");
                string strVisitID = JObjectHelper.GetKeyValue(inputJson, "lngVisitID");
                string id = JObjectHelper.GetKeyValue(inputJson, "id");
                string strRegNO = JObjectHelper.GetKeyValue(inputJson, "strRegNO");
                if (string.IsNullOrEmpty(strPatiID) || (string.IsNullOrEmpty(strVisitID) && string.IsNullOrEmpty(strRegNO)) || string.IsNullOrEmpty(id))
                {
                    outJson["code"] = 1;
                    outJson["msg"] = "id、病人ID、（就诊ID或挂号单）不能为空。";
                    outJson["data"] = "";
                } else
                {
                    bool blnMerge = !string.IsNullOrEmpty(JObjectHelper.GetKeyValue(inputJson, "blnMerge")) && Convert.ToBoolean(JObjectHelper.GetKeyValue(inputJson, "blnMerge"));
                    bool blnPrintTag = !string.IsNullOrEmpty(JObjectHelper.GetKeyValue(inputJson, "blnPrintTag")) && Convert.ToBoolean(JObjectHelper.GetKeyValue(inputJson, "blnPrintTag"));
                    string strExtPara = JObjectHelper.GetKeyValue(inputJson, "strExtPara");

                    // 获取当前文件路径
                    string strFilePath = System.AppDomain.CurrentDomain.BaseDirectory + "PDF\\R3K\\";
                    //string strFileName = id.Contains("R7K1") ? "CentPrint.PDF" : id + ".PDF";
                    string strFileName = strPatiID + "_" + id + ".PDF";

                    // 组装xml字符串
                    string strXml = string.Format("<root><do_canprint>0</do_canprint><printed_update_status>{0}</printed_update_status><items><item><id>{1}</id><file_path>{2}</file_path></item></items></root>", (blnPrintTag ? "1" : "0"), id, strFilePath + strFileName);

                    // 检查文件是否存在，如果存在，先删除
                    if (System.IO.File.Exists(strFilePath + strFileName))
                    {
                        try
                        {
                            System.IO.File.Delete(strFilePath + strFileName);
                        } catch (Exception ex) { _logger.LogError("删除文件【" + strFilePath + strFileName + "】异常：" + ex.Message); }
                    }

                    // 检查体温单PDF是否存在，如果存在，先删除
                    if (!string.IsNullOrEmpty(_configInfo.TemperatureChartPath))
                    {
                        string path = _configInfo.TemperatureChartPath.Split("|")[0];
                        // 取文件路径下最新的文件夹
                        string dir = System.IO.Directory.GetDirectories(path)?[0];
                        if (!string.IsNullOrEmpty(dir))
                        {
                            // 取文件路径下的文件
                            string file = dir + "\\" + _configInfo.TemperatureChartPath.Split("|")[1];
                            if (System.IO.File.Exists(file))
                            {
                                System.IO.File.Delete(strFilePath + strFileName);
                            }
                        }
                    }

                    //_cISComponentService.PrintDocument(long.Parse(strPatiID), (string.IsNullOrEmpty(strVisitID) ? 0 : long.Parse(strVisitID)), strFilePath, strXml, blnMerge, strRegNO, blnPrintTag, "", (string.IsNullOrEmpty(strExtPara) ? "SilentMode=1" : strExtPara));

                    // 将入参写入队列
                    RequestQueue requestQueue = new RequestQueue();
                    DocumentPara documentPara = new DocumentPara {
                        LngPatiID = long.Parse(strPatiID),
                        LngVisitID = (string.IsNullOrEmpty(strVisitID) ? 0 : long.Parse(strVisitID)),
                        StrFilePath = strFilePath,
                        StrXML = strXml,
                        BlnMerge = blnMerge,
                        StrRegNO = strRegNO,
                        BlnPrintTag = blnPrintTag,
                        StrExtPara = (string.IsNullOrEmpty(strExtPara) ? "SilentMode=1" : strExtPara)
                    };
                    requestQueue.DocumentPara = documentPara;
                    _requestQueueService.AddRequestQueueToQueue(requestQueue);

                    DateTime nowDate = DateTime.Now;
                    while (!System.IO.File.Exists(strFilePath + strFileName) && (DateTime.Now - nowDate).TotalSeconds < _configInfo.PrintTimeout / 1000) Thread.Sleep(100);

                    // 检查文件是否存在并返回文件base64字符串
                    if (System.IO.File.Exists(strFilePath + strFileName))
                    {
                        _logger.LogInformation("CISController.PrintDocument生成PDF文件成功。");
                        outJson["code"] = 0;
                        outJson["msg"] = "";
                        outJson["data"] = ConvertToBase64(strFilePath, strFileName);
                    } else
                    {
                        // 检查体温单PDF是否存在
                        if (!string.IsNullOrEmpty(_configInfo.TemperatureChartPath))
                        {
                            string path = _configInfo.TemperatureChartPath.Split("|")[0];
                            // 取文件路径下最新的文件夹
                            string dir = System.IO.Directory.GetDirectories(path)[0];
                            if (!string.IsNullOrEmpty(dir))
                            {
                                // 取文件路径下的文件
                                string file = dir + "\\" + _configInfo.TemperatureChartPath.Split("|")[1];
                                if (System.IO.File.Exists(file))
                                {
                                    _logger.LogInformation("CISController.PrintDocument生成PDF文件成功。");
                                    outJson["code"] = 0;
                                    outJson["msg"] = "";
                                    outJson["data"] = System.Convert.ToBase64String(System.IO.File.ReadAllBytes(file));
                                    jsonString = JsonConvert.SerializeObject(outJson);
                                    return Content(jsonString, "application/json");
                                }
                            }
                        }

                        outJson["code"] = 1;
                        outJson["msg"] = "生成PDF失败。";
                        outJson["data"] = "";

                    }
                }
            } catch (System.Exception ex)
            {
                _logger.LogError("CISController.PrintDocument异常：" + ex.Message);
                outJson["code"] = 1;
                outJson["msg"] = "CISController.PrintDocument异常：" + ex.Message;
                outJson["data"] = "";
            }
            jsonString = JsonConvert.SerializeObject(outJson);
            return Content(jsonString, "application/json");
        }

        /// <summary>
        /// 输出指定报表
        /// </summary>
        /// <param name="para"></param>
        /// <returns></returns>
        [HttpGet]
        [Route("api/cis/PrintReport")]
        public IActionResult PrintReport(string para)
        {
            JObject outJson = new JObject();
            try
            {
                _logger.LogInformation("CISController.PrintReport接收到入参：" + para);
                // 将body转为json对象
                JObject inputJson = JObject.Parse(para);
                string lngSysNo = JObjectHelper.GetKeyValue(inputJson, "lngSysNo");
                string strReportName = JObjectHelper.GetKeyValue(inputJson, "strReportName");
                if (string.IsNullOrEmpty(lngSysNo) || string.IsNullOrEmpty(strReportName))
                {
                    outJson["code"] = 1;
                    outJson["msg"] = "报表所属的系统和报表编号不能为空。";
                    outJson["data"] = "";
                } else
                {
                    // 获取当前文件路径
                    string strFilePath = System.AppDomain.CurrentDomain.BaseDirectory + "PDF\\Report\\";
                    string strFileName = Guid.NewGuid().ToString() + ".PDF";

                    string strInfo = JObjectHelper.GetKeyValue(inputJson, "strInfo");
                    string strXml = "<root><pars>";
                    // strInfo不为空，则遍历json对象，将键值对转为xml字符串
                    if (!string.IsNullOrEmpty(strInfo))
                    {
                        // 将strInfo转为json对象
                        JObject inputInfo = JObject.Parse(strInfo);
                        foreach (var item in inputInfo)
                        {
                            strXml += string.Format("<par>{0}={1}</par>", item.Key, item.Value);// 遍历json对象，将键值对转为xml字符串
                        }
                    }
                    // 拼接PDF路径
                    strXml += string.Format("<par>PDF={0}</par></pars></root>", strFilePath + strFileName);

                    // 检查文件是否存在，如果存在，则删除
                    if (System.IO.File.Exists(strFilePath + strFileName))
                    {
                        try
                        {
                            System.IO.File.Delete(strFilePath + strFileName);
                        } catch (Exception ex) { _logger.LogError("删除文件【" + strFilePath + strFileName + "】异常：" + ex.Message); }
                    }

                    //_cISComponentService.PrintReport(long.Parse(lngSysNo), strReportName, strXml);

                    // 将入参写入队列
                    RequestQueue requestQueue = new RequestQueue();
                    ReportPara reportPara = new ReportPara {
                        lngSysNo = long.Parse(lngSysNo),
                        strReportName = strReportName,
                        strInfo = strXml
                    };
                    requestQueue.ReportPara = reportPara;
                    _requestQueueService.AddRequestQueueToQueue(requestQueue);

                    DateTime nowDate = DateTime.Now;
                    while (!System.IO.File.Exists(strFilePath + strFileName) && (DateTime.Now - nowDate).TotalSeconds < _configInfo.PrintTimeout / 1000) Thread.Sleep(100);

                    // 检查文件是否存在并返回文件base64字符串
                    if (System.IO.File.Exists(strFilePath + strFileName))
                    {
                        _logger.LogInformation("CISController.PrintReport生成PDF文件成功。");
                        outJson["code"] = 0;
                        outJson["msg"] = "";
                        outJson["data"] = ConvertToBase64(strFilePath, strFileName);
                    } else
                    {
                        outJson["code"] = 1;
                        outJson["msg"] = "生成PDF失败。";
                        outJson["data"] = "";
                    }
                }

            } catch (System.Exception ex)
            {
                _logger.LogError("CISController.PrintReport异常：" + ex.Message);
                outJson["code"] = 1;
                outJson["msg"] = "CISController.PrintReport异常：" + ex.Message;
                outJson["data"] = "";
            }
            string jsonString = JsonConvert.SerializeObject(outJson);
            return Content(jsonString, "application/json");
        }

        /// <summary>
        /// 读取文件并转为base64字符串
        /// </summary>
        /// <param name="strFilePath"></param>
        /// <param name="strFileName"></param>
        /// <returns></returns>
        private string ConvertToBase64(string strFilePath, string strFileName)
        {
            string fullPath = Path.Combine(strFilePath, strFileName);
            byte[] fileBytes = new byte[0];
            int attempt = 0;
            while (attempt < 3)
            {
                try
                {
                    using (FileStream fileStream = new FileStream(fullPath, FileMode.Open, FileAccess.Read, FileShare.Read))
                    {
                        using MemoryStream memoryStream = new MemoryStream();
                        fileStream.CopyTo(memoryStream);
                        fileBytes = memoryStream.ToArray();
                    }

                    return Convert.ToBase64String(fileBytes);
                } catch (IOException ex)
                {
                    attempt++;
                    if (attempt >= 3)
                    {
                        // 处理文件无法访问的异常，例如文件被另一个进程占用
                        _logger.LogError("第" + attempt + "访问文件:【" + strFilePath + strFileName + "】发生异常：" + ex.Message);
                        return "";
                    }
                    // 处理文件无法访问的异常，例如文件被另一个进程占用
                    _logger.LogInformation("第" + attempt + "访问文件:【" + strFilePath + strFileName + "】被占用");
                    Thread.Sleep(500);
                } catch (Exception ex)
                {
                    // 处理其他可能的异常
                    _logger.LogError("文件【" + strFilePath + strFileName + "】转换Base64发生异常：" + ex.Message);
                    return "";
                }
            }
            return "";
        }
    }
}
