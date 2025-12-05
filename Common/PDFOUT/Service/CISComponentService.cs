using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NewCostHjy.Models;
using System;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks; 

namespace NewCostHjy.Common {
    public class CISComponentService : ICISComponentService
    {
        /// <summary>
        /// 配置信息
        /// </summary>
        private readonly ConfigInfo _configInfo;

        /// <summary>
        /// 日志
        /// </summary>
        private readonly ILogger _logger;

        /// <summary>
        /// 当前打印次数
        /// </summary>
        private int _printTimes = 0;

        /// <summary>
        /// CIS组件对象
        /// </summary>
        private dynamic _ZLCLSPrint = null;

        private Type _Type = null;

        /// <summary>
        /// 是否已经初始化
        /// </summary>
        public static bool _IsInit = false;

        /// <summary>
        /// 是否正在初始化
        /// </summary>
        private bool _IsIniting = false;

        public CISComponentService(IOptions<ConfigInfo> configInfo, ILogger<CISComponentService> logger)
        {
            _configInfo = configInfo.Value;
            _logger = logger;
        }

        /// <summary>
        /// 初始化CIS组件
        /// </summary>
        /// <returns></returns>
        public bool InitPrint()
        {
            try
            {
                if (_IsIniting) return true;
                _ZLCLSPrint = null;
                _IsInit = false;
                _IsIniting = true;
                string strErrInfo = ""; // 初始化报错信息
                try
                {
                    // 初始化前 进程存在就杀掉
                    Process.GetProcessesByName("ZLPublicCISPrint").ToList().ForEach(x => x.Kill());
                    Thread.Sleep(1000);
                }
                catch (Exception ex) { _logger.LogError("进程结束异常：" + ex.Message); }

                // 初始化对象
                _Type = Type.GetTypeFromProgID("ZLPublicCISPrint.clsPrint");
                _ZLCLSPrint = Activator.CreateInstance(_Type);

                #region 超时处理

                CancellationTokenSource tokenSource = new CancellationTokenSource();
                CancellationToken cancellationToken = tokenSource.Token;

                // 设置超时时间
                TimeSpan timeout = TimeSpan.FromSeconds((_configInfo.PrintTimeout / 1000));
                _logger.LogInformation(string.Format("开始初始化ZLPublicCISPrint组件，strServer={0}，strUser={1}，strDBPwd={2}，blnLog={3}", _configInfo.Server, _configInfo.UserName, _configInfo.PasWord, _configInfo.IsRecordCISLog.ToString()));
                // 创建一个Task用于执行方法调用操作
                Task<object> task = Task.Factory.StartNew<object>(() =>
                {
                    //为InvokeMethod 的调用构建参数数组，并初始化每个参数元素
                    object[] ParamArray = new object[7];
                    ParamArray[0] = _configInfo.Server;
                    ParamArray[1] = _configInfo.UserName;
                    ParamArray[2] = "";
                    ParamArray[3] = _configInfo.PasWord;
                    ParamArray[4] = strErrInfo;
                    ParamArray[5] = _configInfo.IsRecordCISLog;
                    ParamArray[6] = _configInfo.PrintMode;

                    //用参数的索引属性来指出哪些参数是一个返回的参数
                    //对于那些是[in]或ByRef的参数可以不用指定
                    ParameterModifier[] ParamMods = new ParameterModifier[1];
                    ParamMods[0] = new ParameterModifier(7);  // 初始化为接口参数的个数
                    ParamMods[0][4] = true;   // 设置第四个参数为返回参数
                    object result = _Type.InvokeMember("InitPrint", BindingFlags.Default | BindingFlags.InvokeMethod, null, _ZLCLSPrint, ParamArray, ParamMods, null, null);
                    strErrInfo = ParamArray[4].ToString();
                    return result;
                }, cancellationToken);

                // 等待Task完成或超时
                if (!task.Wait(timeout))
                {
                    // 超时，取消任务
                    tokenSource.Cancel();
                    _logger.LogInformation("初始化ZLPublicCISPrint组件超时！");
                    _ZLCLSPrint = null;
                    // 重启程序
                    Restart();
                    return false;
                }
                else
                {
                    string result = task.Result.ToString();
                    _logger.LogInformation("初始化ZLPublicCISPrint组件InitPrint返回：" + result);
                    if (result.ToLower() == "false")
                    {
                        _logger.LogInformation("初始化CISPrint组件失败！" + strErrInfo);
                        _ZLCLSPrint = null;
                        // 重启程序
                        Restart();
                        return false;
                    }
                    _printTimes = 0;
                    _IsInit = true;
                    _IsIniting = false;
                    return true;
                }
                #endregion
            }
            catch (Exception ex)
            {
                _logger.LogError("初始化ZLPublicCISPrint组件异常：" + ex.Message);
                _ZLCLSPrint = null;
                // 重启程序
                Restart();
                return false;
            }
        }

        /// <summary>
        /// 获取病人本次住院/就诊可输出的文件清单
        /// </summary>
        /// <param name="lngPatiID">病人ID</param>
        /// <param name="lngVisitID">主页ID|就诊ID（挂号ID）</param>
        /// <param name="strRegNO">挂号单</param>
        /// <param name="blnHomepageMerge">True- R11-首页信息合并为一个“病案首页”，不再分首页正面，首页反面。</param>
        /// <param name="strExtPara">扩展参数,按键值对方式传值,每个键值对用特殊字符“&”分隔。示例:"RecStatus=1&参数名2=参数值&..." RecStatus=1,返回XML格式1包含<RecStatus>节点</param>
        /// <returns>成功返回XML格式字符串;失败返回空串 见XML格式1</returns>
        public string GetPrintList(long lngPatiID, long lngVisitID, string strRegNO = "", bool blnHomepageMerge = false, string strExtPara = "RecStatus=1")
        {
            if (_ZLCLSPrint == null)
            {
                if (!InitPrint()) return "";
            }
            try
            {
                #region 超时处理

                CancellationTokenSource tokenSource = new CancellationTokenSource();
                CancellationToken cancellationToken = tokenSource.Token;

                // 设置超时时间
                TimeSpan timeout = TimeSpan.FromSeconds((_configInfo.PrintTimeout / 1000));

                // 创建一个Task用于执行方法调用操作
                Task<object> task = Task.Factory.StartNew<object>(() =>
                {
                    return _Type.InvokeMember("GetPrintList", BindingFlags.Default | BindingFlags.InvokeMethod, null, _ZLCLSPrint, new object[] { lngPatiID, lngVisitID, strRegNO, blnHomepageMerge, strExtPara });
                }, cancellationToken);
                // 等待Task完成或超时
                if (!task.Wait(timeout))
                {
                    // 超时，取消任务
                    tokenSource.Cancel();
                    _logger.LogInformation("获取列表超时！");
                    // 超时时重新初始化
                    InitPrint();
                }
                else
                {
                    return task.Result?.ToString();
                }
                #endregion

            }
            catch (Exception ex)
            {
                _logger.LogError("调用CIS组件GetPrintList异常：" + ex.Message);
                // InitPrint();
            }
            return "";
        }

        /// <summary>
        /// 通过病历文档ID打印新版病历文档
        /// </summary>
        /// <param name="strDocId">EMR文件主文档ID</param>
        /// <param name="strFilePath">文件路径: "D:\TEST\Doc"</param>
        /// <param name="strFileName">文件名: "XXX.PDF"</param>
        /// <param name="strExtPara">打印入参<root><do_canprint>1=需要调用CanPrint方法；反之，不调用。</do_canprint><printed_update_status>1=需要更新病历的打印状态等信息；反之，不更新。</printed_update_status></root></param>
        /// <returns>成功返回True;失败返回False</returns>
        public bool PrintDocEMR(string strDocId, string strFilePath, string strFileName, string strExtPara)
        {
            if (_ZLCLSPrint == null)
            {
                if (!InitPrint()) return false;
            }
            try
            {
                // 异常信息
                string strErrInfo = string.Empty;

                #region 超时处理

                CancellationTokenSource tokenSource = new CancellationTokenSource();
                CancellationToken cancellationToken = tokenSource.Token;

                // 设置超时时间
                TimeSpan timeout = TimeSpan.FromSeconds((_configInfo.PrintTimeout / 1000));

                // 创建一个Task用于执行方法调用操作
                Task<object> task = Task.Factory.StartNew<object>(() =>
                {
                    //为InvokeMethod 的调用构建参数数组，并初始化每个参数元素
                    object[] ParamArray = new object[6];
                    ParamArray[0] = strDocId;
                    ParamArray[1] = strFilePath;
                    ParamArray[2] = strFileName;
                    ParamArray[3] = _configInfo.PrintMode;
                    ParamArray[4] = strErrInfo;
                    ParamArray[5] = strExtPara;

                    //用参数的索引属性来指出哪些参数是一个返回的参数
                    //对于那些是[in]或ByRef的参数可以不用指定
                    ParameterModifier[] ParamMods = new ParameterModifier[1];
                    ParamMods[0] = new ParameterModifier(6);  // 初始化为接口参数的个数
                    ParamMods[0][4] = true;   // 设置第四个参数为返回参数
                    object result = _Type.InvokeMember("PrintDocEMR", BindingFlags.Default | BindingFlags.InvokeMethod, null, _ZLCLSPrint, ParamArray, ParamMods, null, null);
                    strErrInfo = ParamArray[4].ToString();
                    return result;

                }, cancellationToken);
                _printTimes++;
                // 等待Task完成或超时
                if (!task.Wait(timeout))
                {
                    // 超时，取消任务
                    tokenSource.Cancel();
                    _logger.LogInformation("输出文档超时！");
                    // 超时时重新初始化
                    InitPrint();
                }
                else
                {
                    _logger.LogInformation("ZLPublicCISPrint.PrintDocEMR返回：" + task.Result.ToString());
                    if (task.Result.ToString().ToLower() == "true")
                    {
                        return true;
                    }
                    else
                    {
                        _logger.LogInformation("输出文档失败！" + strErrInfo + "！");
                    }
                }
                #endregion

            }
            catch (Exception ex)
            {
                _logger.LogError("新版病历生成PDF文档发生异常：" + ex.Message);
                _ZLCLSPrint = null;
                // InitPrint();
            }
            return false;
        }

        /// <summary>
        /// 输出指定病人全部或指定文件
        /// </summary>
        /// <param name="lngPatiID">病人ID</param>
        /// <param name="lngVisitID">主页ID|就诊ID（挂号ID）</param>
        /// <param name="strFilePath">PDF文件输出路径（不带文件名）</param>
        /// <param name="strXML">指定输出的文件清单,其形式为XML类型的字符串。见XML定义</param>
        /// <param name="blnMerge">TRUE-将输出文档合并为一个文档(合并文件名：姓名_病人ID_主页ID_病案合并.PDF); False-不合并文档，直接通过报表打印所有格式到一个文件中</param>
        /// <param name="strRegNO">挂号单</param>
        /// <param name="blnPrintTag">打印标志；True需要更新老版病历的打印标志；False不需要</param>
        /// <param name="strPrinter">打印机名称；打印的时候传入对应的打印机名称。</param>
        /// <param name="strExtPara">扩展参数,按键值对方式传值,每个键值对用特殊字符“&”分隔。示例:"参数名1=参数值&参数名2=参数值&..." 如："SilentMode=1" SilentMode=1 静默打印</param>
        /// <returns>成功返回True;失败返回False</returns>
        public bool PrintDocument(long lngPatiID, long lngVisitID, string strFilePath, string strXML, bool blnMerge, string strRegNO, bool blnPrintTag, string strPrinter = "", string strExtPara = "SilentMode=1")
        {
            if (_ZLCLSPrint == null)
            {
                if (!InitPrint()) return false;
            }
            try
            {
                // 未输出文档名称
                string strNoPDF = string.Empty;
                // 医嘱单打印时返回的错误提示
                string strError = string.Empty;

                #region 超时处理

                CancellationTokenSource tokenSource = new CancellationTokenSource();
                CancellationToken cancellationToken = tokenSource.Token;

                // 设置超时时间
                TimeSpan timeout = TimeSpan.FromSeconds((_configInfo.PrintTimeout / 1000));

                // 创建一个Task用于执行方法调用操作
                Task<object> task = Task.Factory.StartNew<object>(() =>
                {
                    //为InvokeMethod 的调用构建参数数组，并初始化每个参数元素
                    object[] ParamArray = new object[12];
                    ParamArray[0] = lngPatiID;
                    ParamArray[1] = lngVisitID;
                    ParamArray[2] = strFilePath;
                    ParamArray[3] = strXML;
                    ParamArray[4] = blnMerge;
                    ParamArray[5] = strNoPDF;
                    ParamArray[6] = strRegNO;
                    ParamArray[7] = _configInfo.PrintMode;
                    ParamArray[8] = strError;
                    ParamArray[9] = blnPrintTag;
                    ParamArray[10] = strPrinter;
                    ParamArray[11] = strExtPara;


                    //用参数的索引属性来指出哪些参数是一个返回的参数
                    //对于那些是[in]或ByRef的参数可以不用指定
                    ParameterModifier[] ParamMods = new ParameterModifier[1];
                    ParamMods[0] = new ParameterModifier(12);  // 初始化为接口参数的个数
                    ParamMods[0][5] = true;   // 设置第六个参数为返回参数
                    ParamMods[0][8] = true;   // 设置第九个参数为返回参数
                    object result = _Type.InvokeMember("PrintDocument", BindingFlags.Default | BindingFlags.InvokeMethod, null, _ZLCLSPrint, ParamArray, ParamMods, null, null);
                    strNoPDF = ParamArray[5].ToString();
                    strError = ParamArray[8].ToString();
                    return result;

                }, cancellationToken);
                _printTimes++;
                // 等待Task完成或超时
                if (!task.Wait(timeout))
                {
                    // 超时，取消任务
                    tokenSource.Cancel();
                    _logger.LogInformation("输出文档超时！");
                    // 超时时重新初始化
                    InitPrint();
                }
                else
                {
                    _logger.LogInformation("ZLPublicCISPrint.PrintDocument返回：" + task.Result.ToString());
                    if (task.Result.ToString().ToLower() == "true")
                    {
                        return true;
                    }
                    else
                    {
                        _logger.LogInformation("输出文档失败！未输出文档名称：" + strNoPDF + strError + "！");
                    }
                }
                #endregion
            }
            catch (Exception ex)
            {
                _logger.LogError("PrintDocument输出文档发生异常：" + ex.Message);
                _ZLCLSPrint = null;
                // InitPrint();
            }
            return false;
        }

        /// <summary>
        /// 输出指定报表
        /// </summary>
        /// <param name="lngSysNo">报表的所属系统号</param>
        /// <param name="strReportName">报表名称或报表编号</param>
        /// <param name="strInfo">扩展信息（xml格式字串）</param>
        /// <returns>True-成功，False-失败</returns>
        public bool PrintReport(long lngSysNo, string strReportName, string strInfo)
        {
            if (_ZLCLSPrint == null)
            {
                if (!InitPrint()) return false;
            }
            try
            {
                #region 超时处理

                CancellationTokenSource tokenSource = new CancellationTokenSource();
                CancellationToken cancellationToken = tokenSource.Token;

                // 设置超时时间
                TimeSpan timeout = TimeSpan.FromSeconds((_configInfo.PrintTimeout / 1000));

                // 创建一个Task用于执行方法调用操作
                Task<object> task = Task.Factory.StartNew<object>(() =>
                {
                    //为InvokeMethod 的调用构建参数数组，并初始化每个参数元素
                    object[] ParamArray = new object[4];
                    ParamArray[0] = lngSysNo;
                    ParamArray[1] = strReportName;
                    ParamArray[2] = _configInfo.PrintMode;
                    ParamArray[3] = strInfo;

                    return _Type.InvokeMember("PrintReport", BindingFlags.Default | BindingFlags.InvokeMethod, null, _ZLCLSPrint, ParamArray);
                }, cancellationToken);
                _printTimes++;
                // 等待Task完成或超时
                if (!task.Wait(timeout))
                {
                    // 超时，取消任务
                    tokenSource.Cancel();
                    _logger.LogInformation("输出文档超时！");
                    // 超时时重新初始化
                    InitPrint();
                }
                else
                {
                    _logger.LogInformation("ZLPublicCISPrint.PrintReport返回：" + task.Result.ToString());
                    if (task.Result.ToString().ToLower() == "true")
                    {
                        return true;
                    }
                    else
                    {
                        _logger.LogInformation("输出文档失败！");
                    }
                }
                #endregion
            }
            catch (Exception ex)
            {
                _logger.LogError("PrintReport输出文档发生异常：" + ex.Message);
                _ZLCLSPrint = null;
                // InitPrint();
            }
            return false;
        }

        /// <summary>
        /// 释放打印组件资源
        /// </summary>
        /// <returns></returns>
        public void ReleaseObject()
        {
            if (_ZLCLSPrint == null) return;
            try
            {
                #region 超时处理

                CancellationTokenSource tokenSource = new CancellationTokenSource();
                CancellationToken cancellationToken = tokenSource.Token;

                // 设置超时时间
                TimeSpan timeout = TimeSpan.FromSeconds((_configInfo.PrintTimeout / 1000));

                // 创建一个Task用于执行方法调用操作
                Task<object> task = Task.Factory.StartNew<object>(() =>
                {
                    return _Type.InvokeMember("ReleaseObject", BindingFlags.Default | BindingFlags.InvokeMethod, null, _ZLCLSPrint, null);
                }, cancellationToken);

                // 等待Task完成或超时
                if (!task.Wait(timeout))
                {
                    // 超时，取消任务
                    tokenSource.Cancel();
                    _logger.LogInformation("释放打印组件资源超时！");
                }
                else
                {
                    if (task.Result.ToString().ToLower() == "true")
                    {
                        _logger.LogInformation("释放打印组件资源成功！");
                    }
                    else
                    {
                        _logger.LogInformation("释放打印组件资源失败！");
                    }
                }
                #endregion

                try
                {
                    // 进程存在就杀掉
                    Process.GetProcessesByName("ZLPublicCISPrint").ToList().ForEach(x => x.Kill());
                }
                catch (Exception ex) { _logger.LogError("进程结束异常：" + ex.Message); }
            }
            catch (Exception ex)
            {
                _logger.LogError("ReleaseObject释放打印组件资源发生异常：" + ex.Message);
            }

        }

        /// <summary>
        /// 当前打印次数达到配置的次数，则释放打印组件资源并重新初始化
        /// </summary>
        public void CheckPrintTimes()
        {
            if (_printTimes >= _configInfo.PrintTimes)
            {
                ReleaseObject();
                InitPrint();
            }
        }

        /// <summary>
        /// 重启程序
        /// </summary>
        /// <param name="dir"></param>
        /// <param name="days"></param>
        private void Restart()
        {
            try
            {
                // 通过命令行重启程序
                Process.Start("restart.bat");
                // 退出进程
                Environment.Exit(0);
            }
            catch (Exception ex)
            {
                _logger.LogError("重启程序发生异常：" + ex.Message);
            }
        }
    }
}
