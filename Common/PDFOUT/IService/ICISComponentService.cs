using System.Threading.Tasks;
using System.Threading;

namespace NewCostHjy.Common {
    public interface ICISComponentService
    {
        /// <summary>
        /// 初始化CIS组件
        /// </summary>
        /// <returns></returns>
        bool InitPrint();

        /// <summary>
        /// 获取病人本次住院/就诊可输出的文件清单
        /// </summary>
        /// <param name="lngPatiID">病人ID</param>
        /// <param name="lngVisitID">主页ID|就诊ID（挂号ID）</param>
        /// <param name="strRegNO">挂号单</param>
        /// <param name="blnHomepageMerge">True- R11-首页信息合并为一个“病案首页”，不再分首页正面，首页反面。</param>
        /// <param name="strExtPara">扩展参数,按键值对方式传值,每个键值对用特殊字符“&”分隔。示例:"RecStatus=1&参数名2=参数值&..." RecStatus=1,返回XML格式1包含<RecStatus>节点</param>
        /// <returns>成功返回XML格式字符串;失败返回空串 见XML格式1</returns>
        string GetPrintList(long lngPatiID, long lngVisitID, string strRegNO = "", bool blnHomepageMerge = false, string strExtPara = "RecStatus=1");

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
        bool PrintDocument(long lngPatiID, long lngVisitID, string strFilePath, string strXML, bool blnMerge, string strRegNO, bool blnPrintTag, string strPrinter, string strExtPara = "SilentMode=1");

        /// <summary>
        /// 通过病历文档ID打印新版病历文档
        /// </summary>
        /// <param name="strDocId">EMR文件主文档ID</param>
        /// <param name="strFilePath">文件路径: "D:\TEST\Doc"</param>
        /// <param name="strFileName">文件名: "XXX.PDF"</param>
        /// <returns>成功返回True;失败返回False</returns>
        bool PrintDocEMR(string strDocId, string strFilePath, string strFileName, string strExtPara);

        /// <summary>
        /// 输出指定报表
        /// </summary>
        /// <param name="lngSysNo">报表的所属系统号</param>
        /// <param name="strReportName">报表名称或报表编号</param>
        /// <param name="strInfo">扩展信息（xml格式字串）</param>
        /// <returns>True-成功，False-失败</returns>
        bool PrintReport(long lngSysNo, string strReportName, string strInfo);

        /// <summary>
        /// 释放CIS组件
        /// </summary>
        /// <returns></returns>
        void ReleaseObject();

        /// <summary>
        /// 检查打印次数
        /// </summary>
        void CheckPrintTimes();
    }
}
