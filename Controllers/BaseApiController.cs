using Microsoft.AspNetCore.Mvc;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Data;
using testWeb.BLL;

namespace NewCostHjy.Controllers {
    /// <summary>
    /// 合理用药相关
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class BaseApiController : BaseController {

        /// <summary>
        /// 根据药品本位码给药途径校验
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("DrugRouteVerify")]
        public IActionResult DrugRouteVerify([FromBody] List<DrugUseWChk> parIn) {
            foreach (var item in parIn) {
                item.PROMPTMARK = 1;
                item.PROMPTCONTENT = "测试换行\n" +
                                "第二行";
                //item.PROMPTCONTENT = "\u836F\u54C1\u3010\u963F\u83AB\u897F\u6797\u80F6\u56CA\u3011\u5F53\u524D\u5F00\u7ACB\u7684\u7ED9\u836F\u9014\u5F84\u3010\u9759\u8109\u6EF4\u6CE8\u3011\u4E0D\u5408\u7406\uFF01\n\u5242\u578B\u3010\u80F6\u56CA\u5242\u3011\u7684\u53C2\u8003\u53EF\u7528\u7ED9\u836F\u9014\u5F84\uFF1A\n\u53E3\u670D";

            }
            return Json(parIn);
        }

        /// <summary>
        /// ZLHIS通用数据规则检查API服务接口
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("HISRuleCheckApi")]
        public IActionResult HISRuleCheckApi([FromBody] dynamic par) {

            string strTmp = Newtonsoft.Json.JsonConvert.SerializeObject(par);
            ZlhisInterfaceBLL zlhisInterfaceBLL = new ZlhisInterfaceBLL();
            var outInfo = zlhisInterfaceBLL.ZLHISChkApiOutMsg("HISRuleCheckApi");           

            return Json(outInfo);
        }

        /// <summary>
        /// ZLHIS通用数据规则检查API服务接口
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("GetCheckData")]
        public IActionResult GetCheckData([FromBody] dynamic par) {

            string strTmp = Newtonsoft.Json.JsonConvert.SerializeObject(par);

            ZlhisInterfaceBLL zlhisInterfaceBLL = new ZlhisInterfaceBLL();
            var outInfo=zlhisInterfaceBLL.ZLHISChkApiOutMsg("GetCheckData");                        
            return Json(outInfo);
        }


        /// <summary>
        /// ZLHIS通用数据规则检查API服务接口按数据源的返回值来决定
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("GetCheckDataByOut")]
        public IActionResult GetCheckDataByOut(dynamic par = null) {

            string strTmp = Newtonsoft.Json.JsonConvert.SerializeObject(par);

            ZlhisInterfaceBLL zlhisInterfaceBLL = new ZlhisInterfaceBLL();
            var outInfo = zlhisInterfaceBLL.ZLHISChkApiOutMsgEx("2", "GetCheckDataByOutB", "GetCheckDataByOutT");
            string strTmpOut = @"{""result"":1,""errmsg"":"""",""open_type"":""1,1-IE,2-Chr,3-AIO,4-EXE"",""page_url"":""网页地址"",""exe_cmd"":""exe程序的命令行当为4时需传入""}";

            dynamic outInfody = JsonConvert.DeserializeObject(strTmpOut);

            outInfody = new {
                result = 1,
                errmsg = "",
                open_type = 1,
                page_url = "https://www.baidu.com",
                exe_cmd = "C:\\Appsoft\\ZLHIS+.exe"
            };
             
            return Json(outInfody);
        }

        /// <summary>
        /// 页签初始化
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("GetThirdP0001")]
        public IActionResult GetThirdP0001(dynamic par = null)
        {

            string strTmp = Newtonsoft.Json.JsonConvert.SerializeObject(par);


            JObject jObject = new JObject();
            jObject["page_url"] = "https://www.baidu.com";
            jObject["card_name"] = "医惠护理信息";
            jObject["page_id"] = "1123123123uiqqq";

            List<JObject> jArray = new List<JObject>();
            jArray.Add(jObject);

            JObject objTwo = new JObject();
            objTwo["page_url"] = "https://www.json.cn";
            objTwo["card_name"] = "其它护理信息";
            objTwo["page_id"] = "11kk3123uiqqq";
            jArray.Add(objTwo);

            for (int i = 0; i < 10; i++)
            {
                jArray.Add(new JObject() 
                {
                    ["page_url"] = "https://www.baidu.com?" + i,
                    ["card_name"] = "其它护理信息" + i,
                    ["page_id"] = "11kk3123uiqqq" + i
                }
                );
            }

            dynamic outInfody = new {
                result = 1,
                errmsg = "",
                item_list = jArray
            };

            return Json(outInfody);
        }

        /// <summary>
        /// 页签刷新
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("GetThirdP0002")]
        public IActionResult GetThirdP0002(dynamic par = null) {

            string strTmp = Newtonsoft.Json.JsonConvert.SerializeObject(par);

             
            dynamic outInfody = new {
                result = 1,
                errmsg = "",
                page_url = "https://www.baidu.com"
            };

            return Json(outInfody);
        }

        /// <summary>
        /// 首页诊断录入后调用接口
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("GetThirdP0003")]
        public IActionResult GetThirdP0003(dynamic par = null) {

            string strTmp = Newtonsoft.Json.JsonConvert.SerializeObject(par);


            dynamic  outInfody = new {
                result = 1,
                errmsg = "",
                open_type = 1,
                page_url = "https://www.baidu.com",
                exe_cmd = "C:\\Appsoft\\ZLHIS+.exe"
            };
            
            return Json(outInfody);
        }

        /// <summary>
        /// 医嘱保存后锚点
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("GetThirdP0004")]
        public IActionResult GetThirdP0004(dynamic par = null) {

            string strTmp = Newtonsoft.Json.JsonConvert.SerializeObject(par);


            dynamic outInfody = new {
                result = 1,
                errmsg = "",
                open_type = 1,
                page_url = "https://www.baidu.com",
                exe_cmd = "C:\\Appsoft\\ZLHIS+.exe"
            };

            return Json(outInfody);
        }

        /// <summary>
        /// 来苏镇卫生院随访相关
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>

        [HttpPost("HjyLsFollow")]
        public IActionResult HjyLsFollow([FromBody] dynamic par = null) {
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            string strTmp = Newtonsoft.Json.JsonConvert.SerializeObject(par);
            object outdata = zlhisInterfaceDAL.GetClobByProcdure("Hjy_Lsfollow", strTmp, true);
            return Json(outdata);
        }

        /// <summary>
        /// 重置一个VTE病人的相关状态信息数据，33.6数据库
        /// </summary>
        /// <param name="pid">病人ID</param>
        /// <param name="orderid">医嘱ID</param>
        /// <returns></returns>
        [HttpGet("VtePatientReSet336")]
        public IActionResult VtePatientReSet336(string pid, string orderid)
        {
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            zlhisInterfaceDAL.VtePatientReSet336(pid,orderid);
            return Json(1);
        }

        [HttpGet("VtePatientReSet561")]
        public IActionResult VtePatientReSet561(string pid, string orderid)
        {
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            zlhisInterfaceDAL.VtePatientReSet561(pid, orderid);
            return Json(1);
        }

        /// <summary>
        /// 获取所有的随访单
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetFollowList")]
        public IActionResult GetFollowList() {

            DataTable dt = new DataTable();
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            dt = zlhisInterfaceDAL.GetFollowList("122");
            string strOut = dt.Rows[0]["数据"].ToString();
            GetFollowOneEx objOne =  JsonConvert.DeserializeObject<GetFollowOneEx>(strOut);
            List<FollowSelect> lstData = objOne.data.list;
            int key = 0;
            if (key == 1) {
                foreach (FollowSelect item in lstData) {
                    string[] arrTemp = JsonConvert.DeserializeObject<string[]>(item.doctorName);
                    item.doctorName = arrTemp[0];
                    zlhisInterfaceDAL.Insert_follow_list(item);
                }
            }
            FollowSelect modOn = new FollowSelect();
            return Json(lstData[0]);

        }


        /// <summary>
        /// 根据前端查询结果来产生随访清单
        /// </summary>
        /// <returns></returns>
        [HttpPost("InsertFollowListByInPar")]
        public IActionResult InsertFollowListByInPar([FromBody] dynamic par = null)
        { 
            string strOut=JsonConvert.SerializeObject(par);
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            GetFollowOneEx objOne = Newtonsoft.Json.JsonConvert.DeserializeObject<GetFollowOneEx>(strOut);
            List<FollowSelect> lstData = objOne.data.list;
            int key = 0;
            if (key == 0)
            {
                foreach (FollowSelect item in lstData)
                {
                    string[] arrTemp = Newtonsoft.Json.JsonConvert.DeserializeObject<string[]>(item.doctorName);
                    item.doctorName = arrTemp[0];
                    zlhisInterfaceDAL.Insert_follow_list(item);
                }
            }
            FollowSelect modOn = new FollowSelect();
            return Json(lstData[0]);
        }


        /// <summary>
        /// 根据前端查询结果来产生病人清单
        /// </summary>
        /// <returns></returns>
        [HttpPost("InsertPatiLsByInPar")]
        public IActionResult InsertPatiLsByInPar([FromBody] dynamic par = null)
        {
            string strOut = JsonConvert.SerializeObject(par["data"]["list"]);
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            List<PatiOject> lstData = Newtonsoft.Json.JsonConvert.DeserializeObject<List<PatiOject>>(strOut);
            int key = 0;
            if (key == 1)
            {
                foreach (PatiOject item in lstData)
                {
                    zlhisInterfaceDAL.Insert_pati_list_ls(item);
                }
            }
            FollowSelect modOn = new FollowSelect();
            return Json(lstData[0]);

        }

        /// <summary>
        /// 插入病人列表
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("InSertFollowPati")]
        public IActionResult InSertFollowPati([FromBody] List<FollowPati> par) {
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            foreach (FollowPati item in par) {
                zlhisInterfaceDAL.Insert_pati_list(item);
            }
            return Json(1);

        }

        /// <summary>
        /// 获取需要更新随访数据列表
        /// </summary>
        /// <returns></returns>

        [HttpGet("GetErrUpFollowList")]
        public IActionResult GetErrUpFollowList() {
            ZlhisInterfaceBLL zlhisInterfaceBLL = new ZlhisInterfaceBLL();
            var outData= zlhisInterfaceBLL.GetErrUpFollowList();
            return Json(outData);
        }

        /// <summary>
        /// 获取病人清单
        /// </summary>
        /// <param name="para"></param>
        /// <returns></returns>
        [HttpGet("PDFGetPrintList")]
        public IActionResult PDFGetPrintList(string para)
        {

            string url = "http://192.168.56.1:8059/api/cis/GetPrintList?para=" + para;
            string outdata = Common.HttpRequest.HttpGetSync(url, 0);
 
            return Json(outdata);
        }

        /// <summary>
        /// 调输出PDF文档
        /// </summary>
        /// <param name="para"></param>
        /// <returns></returns>
        [HttpGet("PDFPrintDocument")]
        public IActionResult PDFPrintDocument(string para)
        {

            string url = "http://192.168.56.1:8059/api/cis/PrintDocument?para=" + para;
            string outdata = Common.HttpRequest.HttpGetSync(url, 0);
            return Json(outdata);            
        }

        /// <summary>
        /// 通用调用外部api接口，通过post方法调用外部api接口
        /// </summary>
        /// <param name=""></param>
        /// <returns></returns>
        [HttpPost("PublicWebApiByPost")]
        public IActionResult PublicWebApiByPost([FromBody] PostApiPar parIn)
        {
            string result = "";
            if ("1" == parIn.Type)
            {
                result = Common.HttpRequest.HttpGetSync(parIn.Url, 0);
            } else
            {
                result = Common.HttpRequest.RequestDataSync(parIn.Url, parIn.Para, 0);
            }
            return Json(result);
        }
    }
}
