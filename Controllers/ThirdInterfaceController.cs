using Microsoft.AspNetCore.Mvc;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using OnePaperModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.Dynamic;
using System.Text.Json.Nodes;
using testWeb.BLL;

namespace NewCostHjy.Controllers {
    /// <summary>
    /// 通用的三方测试服务方法控制器其中返回值都是原样返回不经过ActionFilter处理，不用会去包装CODE SUCCESS 等结点
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ThirdInterfaceController : BaseController {
        /// <summary>
        /// 临生免接口同步检查申请接口  /api/ThirdInterface/IntfcSaveRequestOthers
        /// </summary>
        /// <returns></returns>
        [HttpPost("IntfcSaveRequestOthers")]
        public IActionResult IntfcSaveRequestOthers([FromBody] WebLisAppData parIn)
        {

            List<WebLisAppDataOut> lst = new List<WebLisAppDataOut>();
            WebLisAppDataOut one = new WebLisAppDataOut() {
                input = new Input() { head = new Head() }
            };
            one.input.head.sysno = "hjy";
            one.input.exe_status = "AE";
            lst.Add(one);
            return Json(lst);
        }

        /// <summary>
        /// web住院医生站诊疗参考锚点服务测试
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("WebDocRefAncrText")]
        public IActionResult WebDocRefAncrText(dynamic parIn)
        {

            return Json(parIn);
        }

        /// <summary>
        /// 标准服务平台接口入参通用模弄API，模拟临生免的接口
        /// </summary>
        /// <returns></returns>
        [HttpPost("LabBusinessData")]
        public IActionResult LabBusinessData([FromBody] SPDCallPar parIn)
        { 
            RootJCPT rootJCPT = new RootJCPT();
            rootJCPT.input = new InputJCPT();
            rootJCPT.input.exe_status= "AE";
            return Json(rootJCPT);
        }

        /// <summary>
        /// 标准服务平台接口入参通用模弄API，模拟临生免的接口
        /// </summary>
        /// <returns></returns>
        [HttpPost("StddService_HRS")]
        public IActionResult StddService_HRS([FromBody] dynamic paraIn)
        {
            dynamic dy = new { code = 1, message = "校验不通过请检查" };
            return Json(new { output = dy });
        }

        /// <summary>
        /// SPD卫材测试接口。Sy™
        /// </summary>
        /// <returns></returns>
        [HttpPost("StddService_Sync")]
        public IActionResult StddService_Sync([FromBody] dynamic paraIn)
        {
            #region 把入参记录下来 测试日志
            string id = Guid.NewGuid().ToString();
            string strInfo = Newtonsoft.Json.JsonConvert.SerializeObject(paraIn);
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            zlhisInterfaceDAL.ZLhisLogInsert(1, id, strInfo, strInfo, 1, "StddService_Sync", "StddService_Sync", "StddService_Sync");
            #endregion

            SPDCallPar parIn = Newtonsoft.Json.JsonConvert.DeserializeObject<SPDCallPar>(strInfo);

            string strBizno = "";
            if (parIn != null)
            {
                if (parIn.input != null)
                {
                    if (parIn.input.head != null)
                    {
                        strBizno = parIn.input.head.bizno;
                    }
                }
            }

            //List<Req_infoItem> lstPar = parIn.input.req_info;
            ZlhisInterfaceBLL zlhisInterfaceBLL = new ZlhisInterfaceBLL();
            List<Eisai_item_listItem> eisai_Item_ListItems = zlhisInterfaceBLL.SPDItems();
            if (1 == 0)
            {
                Eisai_item_listItem eisai_Item_ListItem = eisai_Item_ListItems[0];
                eisai_Item_ListItems = new List<Eisai_item_listItem>();
                eisai_Item_ListItems.Add(eisai_Item_ListItem);
            }

            //eisai_Item_ListItems[0].eisai_item_spec= "Sy™Sy™Sy™Sy™Sy™Sy™";
            //eisai_Item_ListItems[0].eisai_item_spec = "Q-Syte™分隔膜无针密闭式输液接头";

            List<Eisai_item_listItem> outData = new List<Eisai_item_listItem>();
            outData = eisai_Item_ListItems;

            RootJCPT rootJCPT = new RootJCPT();
            rootJCPT.input = new InputJCPT();
            rootJCPT.input.ack_info = new Ack_info() { exe_status = "A" };
            rootJCPT.input.eisai_item_list = outData; 
            rootJCPT.input.check_result = new List<SpdRollCheckPar>();
            rootJCPT.input.check_result.Add(new SpdRollCheckPar() { check_stat = "1" });
            if ("S6119" == strBizno)
            {
                List<Req_infoItem> req_info = parIn.input.req_info;
            }
            if (strBizno == "S6129")
            {
                throw new Exception("测试异常");
            }            
            return Json(rootJCPT);
        }

        //公司环境
        //数据处理平台 电子处方目录  http://192.168.2.70:8090/GetDrugInfo	1
        //数据处理平台 电子处方上传  http://192.168.2.70:8090/UploadPrescription	1
        //数据处理平台 电子处方预检  http://192.168.2.70:8090/CheckPrescription	1
        //数据处理平台 电子处方作废  http://192.168.2.70:8090/InvalidPrescription	1

        //数据处理平台 电子处方诊断  http://192.168.56.1:5888/api/ThirdInterface/GetDiagPrescription
        //数据处理平台 电子处方目录  http://192.168.56.1:5888/api/ThirdInterface/GetDrugPrescription 1
        //数据处理平台 电子处方上传  http://192.168.56.1:5888/api/ThirdInterface/UploadPrescription	1
        //数据处理平台 电子处方预检  http://192.168.56.1:5888/api/ThirdInterface/CheckPrescription	1
        //数据处理平台 电子处方作废  http://192.168.56.1:5888/api/ThirdInterface/InvalidPrescription	1
        //数据处理平台 医嘱标记      http://192.168.56.1:5888/api/ThirdInterface/GetAdviceTagInfo

        /// <summary>
        /// 院外电子处方流转，电子处方诊断
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetDiagPrescription")]
        public IActionResult GetDiagPrescription([FromBody] EPrescriptionInfo parIn)
        { 
            string dataTmp = @"[{""ID"":226,""CODE"":""A18.206"",""NAME"":""淋巴结结核[胡俊勇测试]"",""SCODE"":""LBJJH"",""NOTE"":null},{""ID"":227,""CODE"":""A18.207"",""NAME"":""腮腺淋巴结结核"",""SCODE"":""SXLBJJH"",""NOTE"":null},{""ID"":228,""CODE"":""A18.208"",""NAME"":""锁骨上淋巴结结核"",""SCODE"":""SGSLBJJH"",""NOTE"":null},{""ID"":229,""CODE"":""A18.209"",""NAME"":""腋下淋巴结结核"",""SCODE"":""YXLBJJH"",""NOTE"":null},{""ID"":230,""CODE"":""A18.210"",""NAME"":""周围淋巴结结核"",""SCODE"":""ZWLBJJH"",""NOTE"":null},{""ID"":231,""CODE"":""A18.301+"",""NAME"":""肠结核"",""SCODE"":""CJH"",""NOTE"":null},{""ID"":232,""CODE"":""A18.302+"",""NAME"":""肠系膜结核"",""SCODE"":""CXMJH"",""NOTE"":null},{""ID"":233,""CODE"":""A18.303+"",""NAME"":""肠系膜淋巴结结核"",""SCODE"":""CXMLBJJH"",""NOTE"":null},{""ID"":234,""CODE"":""A18.304+"",""NAME"":""腹膜结核"",""SCODE"":""FMJH"",""NOTE"":null},{""ID"":235,""CODE"":""A18.305+"",""NAME"":""结核性肛瘘"",""SCODE"":""JHXGZ"",""NOTE"":null},{""ID"":236,""CODE"":""A18.306+"",""NAME"":""髂窝结核"",""SCODE"":""QWJH"",""NOTE"":""查不到此部位，髂窝放到腹腔""},{""ID"":237,""CODE"":""A18.307+"",""NAME"":""结核性腹膜炎"",""SCODE"":""JHXFMY"",""NOTE"":null},{""ID"":238,""CODE"":""A18.308"",""NAME"":""腹膜后淋巴结结核"",""SCODE"":""FMHLBJJH"",""NOTE"":null},{""ID"":239,""CODE"":""A18.309"",""NAME"":""腹腔结核"",""SCODE"":""FQJH"",""NOTE"":null},{""ID"":240,""CODE"":""A18.310"",""NAME"":""腹腔淋巴结结核"",""SCODE"":""FQLBJJH"",""NOTE"":null},{""ID"":241,""CODE"":""A18.311"",""NAME"":""肝门淋巴结结核"",""SCODE"":""GMLBJJH"",""NOTE"":null},{""ID"":242,""CODE"":""A18.312"",""NAME"":""结核性腹水"",""SCODE"":""JHXFS"",""NOTE"":null},{""ID"":243,""CODE"":""A18.401"",""NAME"":""播散性粟粒性狼疮"",""SCODE"":""BSXSLXLC"",""NOTE"":""狼疮原指由各种皮肤病引起的局限性皮肤破坏或变性。从前特指寻常狼疮，现在指红斑狼疮，如不加定语则无特定含义。播散性粟粒性狼疮通常发生于面部，一般认为是一种结核疹，像肉芽肿酒渣鼻的一种变型和不明病因的丘疹""},{""ID"":244,""CODE"":""A18.402"",""NAME"":""腹壁结核"",""SCODE"":""FBJH"",""NOTE"":null},{""ID"":245,""CODE"":""A18.403"",""NAME"":""腹部结核性窦道"",""SCODE"":""FBJHXZD"",""NOTE"":""应该看是发生于皮肤还是通往腹腔，其编码前者是A18．4，后者是A18．3+，K93．0*。这里按皮肤和皮下组织处理""},{""ID"":246,""CODE"":""A18.404"",""NAME"":""结核性结节性红斑"",""SCODE"":""JHXJJXHB"",""NOTE"":null},{""ID"":247,""CODE"":""A18.405"",""NAME"":""结核性皮肤脓肿"",""SCODE"":""JHXPFNZ"",""NOTE"":null},{""ID"":248,""CODE"":""A18.406"",""NAME"":""酒渣样结核疹"",""SCODE"":""JZYJHZ"",""NOTE"":null},{""ID"":249,""CODE"":""A18.407"",""NAME"":""皮肤和皮下组织结核"",""SCODE"":""PFHPXZZJH"",""NOTE"":null},{""ID"":250,""CODE"":""A18.408"",""NAME"":""皮肤结核"",""SCODE"":""PFJH"",""NOTE"":null},{""ID"":251,""CODE"":""A18.409"",""NAME"":""皮下组织结核性窦道"",""SCODE"":""PXZZJHXZD"",""NOTE"":null},{""ID"":252,""CODE"":""A18.410"",""NAME"":""臀部结核"",""SCODE"":""TBJH"",""NOTE"":""按皮肤和皮下组织编码""},{""ID"":253,""CODE"":""A18.411"",""NAME"":""寻常性狼疮"",""SCODE"":""XCXLC"",""NOTE"":null},{""ID"":254,""CODE"":""A18.501"",""NAME"":""眼结核"",""SCODE"":""YJH"",""NOTE"":null}]";
            List<EPrescriptionDiagItem> lstObj = new List<EPrescriptionDiagItem>();
            lstObj = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EPrescriptionDiagItem>>(dataTmp);
            return Json(lstObj);
        }

        /// <summary>
        /// 院外电子处方流转，电子处方目录
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetDrugPrescription")]
        public IActionResult GetDrugPrescription([FromBody] EPrescriptionQueryPar parIn)
        {
            string dataTmp = @"[{""DRUGCODE"":""505010201"",""DRUGNAME"":""注射用重组人Ⅱ型肿瘤坏死因子受体-抗体融合蛋白"",""DRUGSPEC"":""25mg"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":643.33,""DRUGORIGIN"":""三生国健药业(上海)股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86900835000018"",""NATIONINSURENAME"":""注射用重组人Ⅱ型肿瘤坏死因子受体-抗体融合蛋白""},{""DRUGCODE"":""505012701"",""DRUGNAME"":""(塞宁)阿司匹林缓释片"",""DRUGSPEC"":""50mg*24片"",""DRUGPROP"":0,""DRUGUNIT"":""片"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":24.0,""DRUGFORM"":""片剂"",""DRUGPRICE"":0.7458333,""DRUGORIGIN"":""哈尔滨格拉雷药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86903630000047"",""NATIONINSURENAME"":""阿司匹林缓释片""},{""DRUGCODE"":""5173001"",""DRUGNAME"":""酪酸梭菌二联活菌胶囊"",""DRUGSPEC"":""420mg*12粒"",""DRUGPROP"":0,""DRUGUNIT"":""粒"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""省增补基本药物"",""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":12.0,""DRUGFORM"":""胶囊(胶丸、滴丸)"",""DRUGPRICE"":1.3166667,""DRUGORIGIN"":""山东科兴生物制品有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86904115000019"",""NATIONINSURENAME"":""酪酸梭菌二联活菌胶囊""},{""DRUGCODE"":""5260201"",""DRUGNAME"":""锶(Sr-89)二氯化锶注射液"",""DRUGSPEC"":""4mci"",""DRUGPROP"":0,""DRUGUNIT"":""1"",""DRUGOUTPUNIT"":""1"",""ANTITYPE"":0,""DRUGPOIS"":""放射性类"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":6000.0,""DRUGORIGIN"":""上海原子科兴药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86900613000018"",""NATIONINSURENAME"":""氯化锶[89Sr]注射液""},{""DRUGCODE"":""501110102"",""DRUGNAME"":""乳酸环丙沙星氯化钠注射液"",""DRUGSPEC"":""0.2g:100ml"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":1,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":7.3,""DRUGORIGIN"":""山东齐都药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86904145000362"",""NATIONINSURENAME"":""乳酸环丙沙星氯化钠注射液""},{""DRUGCODE"":""501110101"",""DRUGNAME"":""乳酸环丙沙星氯化钠注射液"",""DRUGSPEC"":""0.2g:100ml"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":1,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":51.03,""DRUGORIGIN"":""拜耳（广州）医药保健有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86978271002620"",""NATIONINSURENAME"":""乳酸环丙沙星氯化钠注射液""},{""DRUGCODE"":""501110501"",""DRUGNAME"":""盐酸左氧氟沙星氯化钠注射液(软袋）"",""DRUGSPEC"":""100ml：0.2g：0.9g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":1,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":9.8,""DRUGORIGIN"":""四川科伦药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902180000750"",""NATIONINSURENAME"":""盐酸左氧氟沙星氯化钠注射液""},{""DRUGCODE"":""501110601"",""DRUGNAME"":""盐酸莫西沙星氯化钠注射液"",""DRUGSPEC"":""250ml:0.4g:2g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":2,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":219.17,""DRUGORIGIN"":""拜耳医药保健有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86978271002828"",""NATIONINSURENAME"":""盐酸莫西沙星氯化钠注射液""},{""DRUGCODE"":""5162101"",""DRUGNAME"":""喷托维林氯化铵片"",""DRUGSPEC"":""12片"",""DRUGPROP"":0,""DRUGUNIT"":""片"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":12.0,""DRUGFORM"":""片剂"",""DRUGPRICE"":1.7833333,""DRUGORIGIN"":""西南药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86900978002047"",""NATIONINSURENAME"":""喷托维林氯化铵片""},{""DRUGCODE"":""518040502"",""DRUGNAME"":""苯磺酸氨氯地平片"",""DRUGSPEC"":""5mg*7片"",""DRUGPROP"":0,""DRUGUNIT"":""片"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":7.0,""DRUGFORM"":""片剂"",""DRUGPRICE"":4.2685714,""DRUGORIGIN"":""辉瑞制药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86901187000084"",""NATIONINSURENAME"":""苯磺酸氨氯地平片""},{""DRUGCODE"":""5162902"",""DRUGNAME"":""噻托溴铵粉吸入剂A"",""DRUGSPEC"":""18ug*30粒+1个药粉吸入器"",""DRUGPROP"":0,""DRUGUNIT"":""粒"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":30.0,""DRUGFORM"":""吸入剂"",""DRUGPRICE"":13.84,""DRUGORIGIN"":""Boehringer Ingelheim International GmbH"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86980023000037"",""NATIONINSURENAME"":""噻托溴铵粉吸入剂""},{""DRUGCODE"":""5162901"",""DRUGNAME"":""噻托溴铵粉吸入剂A"",""DRUGSPEC"":""18ug*10粒"",""DRUGPROP"":0,""DRUGUNIT"":""粒"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":10.0,""DRUGFORM"":""吸入剂"",""DRUGPRICE"":15.565,""DRUGORIGIN"":""Boehringer Ingelheim International GmbH"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86980023000037"",""NATIONINSURENAME"":""噻托溴铵粉吸入剂""},{""DRUGCODE"":""5163001"",""DRUGNAME"":""噻托溴铵粉吸入剂B"",""DRUGSPEC"":""18ug*10粒"",""DRUGPROP"":0,""DRUGUNIT"":""粒"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":10.0,""DRUGFORM"":""吸入剂"",""DRUGPRICE"":12.443,""DRUGORIGIN"":""Boehringer Ingelheim International GmbH"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86980023000044"",""NATIONINSURENAME"":""噻托溴铵粉吸入剂""},{""DRUGCODE"":""5177401"",""DRUGNAME"":""酪酸梭菌二联活菌散"",""DRUGSPEC"":""0.5g*10袋"",""DRUGPROP"":0,""DRUGUNIT"":""袋"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""省增补基本药物"",""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":10.0,""DRUGFORM"":""散剂"",""DRUGPRICE"":1.523,""DRUGORIGIN"":""山东科兴生物制品有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86904115000026"",""NATIONINSURENAME"":""酪酸梭菌二联活菌散""},{""DRUGCODE"":""501080201"",""DRUGNAME"":""罗红霉素胶囊"",""DRUGSPEC"":""0.15g*12粒"",""DRUGPROP"":0,""DRUGUNIT"":""粒"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":1,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""省增补基本药物"",""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":12.0,""DRUGFORM"":""胶囊(胶丸、滴丸)"",""DRUGPRICE"":1.425,""DRUGORIGIN"":""扬子江药业集团有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86901749000866"",""NATIONINSURENAME"":""罗红霉素胶囊""},{""DRUGCODE"":""501021401"",""DRUGNAME"":""头孢克洛缓释胶囊"",""DRUGSPEC"":""125mg*12粒"",""DRUGPROP"":0,""DRUGUNIT"":""粒"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":1,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":12.0,""DRUGFORM"":""缓（控）释剂型"",""DRUGPRICE"":1.6416667,""DRUGORIGIN"":""扬子江药业集团有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86901749000750"",""NATIONINSURENAME"":""头孢克洛缓释胶囊""},{""DRUGCODE"":""501130201"",""DRUGNAME"":""甲硝唑氯化钠注射液(塑瓶）"",""DRUGSPEC"":""250ml：0.5g：2.25g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":1,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":3.8,""DRUGORIGIN"":""四川科伦药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902180001290"",""NATIONINSURENAME"":""甲硝唑氯化钠注射液""},{""DRUGCODE"":""501130301"",""DRUGNAME"":""奥硝唑氯化钠注射液（双阀软袋）"",""DRUGSPEC"":""250ml:0.5g：2.25g"",""DRUGPROP"":0,""DRUGUNIT"":""袋"",""DRUGOUTPUNIT"":""袋"",""ANTITYPE"":1,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":33.0,""DRUGORIGIN"":""四川科伦药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902180000071"",""NATIONINSURENAME"":""奥硝唑氯化钠注射液""},{""DRUGCODE"":""6015801"",""DRUGNAME"":""连花清瘟胶囊"",""DRUGSPEC"":""0.35g*24粒"",""DRUGPROP"":0,""DRUGUNIT"":""粒"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":24.0,""DRUGFORM"":""胶囊(胶丸、滴丸)"",""DRUGPRICE"":0.4770833,""DRUGORIGIN"":""石家庄以岭药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902767000395"",""NATIONINSURENAME"":""连花清瘟胶囊""},{""DRUGCODE"":""6016001"",""DRUGNAME"":""复方芦荟胶囊"",""DRUGSPEC"":""0.43g*20粒"",""DRUGPROP"":0,""DRUGUNIT"":""粒"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":20.0,""DRUGFORM"":""胶囊(胶丸、滴丸)"",""DRUGPRICE"":0.725,""DRUGORIGIN"":""河北万邦复临药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902651000203"",""NATIONINSURENAME"":""新复方芦荟胶囊""},{""DRUGCODE"":""5200801"",""DRUGNAME"":""盐酸替罗非班氯化钠注射液"",""DRUGSPEC"":""100ml:5mg:0.9g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":280.17,""DRUGORIGIN"":""远大医药(中国)有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86901984001284"",""NATIONINSURENAME"":""盐酸替罗非班氯化钠注射液""},{""DRUGCODE"":""5151101"",""DRUGNAME"":""盐酸丁螺环酮片"",""DRUGSPEC"":""5mg*60片"",""DRUGPROP"":0,""DRUGUNIT"":""片"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":60.0,""DRUGFORM"":""片剂"",""DRUGPRICE"":0.8521667,""DRUGORIGIN"":""江苏恩华药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86901436000896"",""NATIONINSURENAME"":""盐酸丁螺环酮片""},{""DRUGCODE"":""510023301"",""DRUGNAME"":""注射用甲泼尼龙琥珀酸钠"",""DRUGSPEC"":""500mg"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""省增补基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""粉针剂"",""DRUGPRICE"":125.83,""DRUGORIGIN"":""PFIZER SA"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86978729000314"",""NATIONINSURENAME"":""注射用甲泼尼龙琥珀酸钠""},{""DRUGCODE"":""510023302"",""DRUGNAME"":""注射用甲泼尼龙琥珀酸钠"",""DRUGSPEC"":""40mg"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""省增补基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""粉针剂"",""DRUGPRICE"":23.62,""DRUGORIGIN"":""PFIZER SA"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86978729000291"",""NATIONINSURENAME"":""注射用甲泼尼龙琥珀酸钠""},{""DRUGCODE"":""5178201"",""DRUGNAME"":""甘草酸二铵氯化钠注射液"",""DRUGSPEC"":""250ml：0.15g：2.25g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""省增补基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":14.07,""DRUGORIGIN"":""正大天晴药业集团股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86901523001218"",""NATIONINSURENAME"":""甘草酸二铵氯化钠注射液""},{""DRUGCODE"":""5141101"",""DRUGNAME"":""丁苯酞氯化钠注射液"",""DRUGSPEC"":""25mg:100ml"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":311.8,""DRUGORIGIN"":""石药集团恩必普药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902774000159"",""NATIONINSURENAME"":""丁苯酞氯化钠注射液""},{""DRUGCODE"":""5143901"",""DRUGNAME"":""甘油果糖氯化钠注射液(玻璃）"",""DRUGSPEC"":""250ml"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""省增补基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":6.6,""DRUGORIGIN"":""石家庄四药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902763000849"",""NATIONINSURENAME"":""甘油果糖氯化钠注射液""},{""DRUGCODE"":""5144301"",""DRUGNAME"":""甘油果糖氯化钠注射液"",""DRUGSPEC"":""250ml：25g：12.5g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""省增补基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":9.7,""DRUGORIGIN"":""辰欣药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86904127003527"",""NATIONINSURENAME"":""甘油果糖氯化钠注射液""},{""DRUGCODE"":""5125101"",""DRUGNAME"":""醋酸戈舍瑞林缓释植入剂"",""DRUGSPEC"":""3.6mg"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""植入剂"",""DRUGPRICE"":1722.68,""DRUGORIGIN"":""阿斯利康制药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86901359000409"",""NATIONINSURENAME"":""醋酸戈舍瑞林缓释植入剂""},{""DRUGCODE"":""5210104"",""DRUGNAME"":""生理氯化钠溶液(塑瓶)"",""DRUGSPEC"":""3000ml:27g"",""DRUGPROP"":0,""DRUGUNIT"":""袋"",""DRUGOUTPUNIT"":""袋"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""溶液剂"",""DRUGPRICE"":20.23,""DRUGORIGIN"":""石家庄四药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902763001761"",""NATIONINSURENAME"":""生理氯化钠溶液""},{""DRUGCODE"":""5210103"",""DRUGNAME"":""生理氯化钠溶液(塑瓶)"",""DRUGSPEC"":""500ml:4.5g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""溶液剂"",""DRUGPRICE"":2.1,""DRUGORIGIN"":""安徽丰原药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86904286001068"",""NATIONINSURENAME"":""生理氯化钠溶液""},{""DRUGCODE"":""5210102"",""DRUGNAME"":""生理氯化钠溶液(塑瓶)"",""DRUGSPEC"":""3000ml"",""DRUGPROP"":0,""DRUGUNIT"":""袋"",""DRUGOUTPUNIT"":""袋"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""溶液剂"",""DRUGPRICE"":20.46,""DRUGORIGIN"":""浙江济民制药"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86904653000472"",""NATIONINSURENAME"":""生理氯化钠溶液""},{""DRUGCODE"":""5210101"",""DRUGNAME"":""生理氯化钠溶液(塑瓶)"",""DRUGSPEC"":""500ml:4.5g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""溶液剂"",""DRUGPRICE"":3.72,""DRUGORIGIN"":""四川科伦药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902180001641"",""NATIONINSURENAME"":""生理氯化钠溶液""},{""DRUGCODE"":""5212702"",""DRUGNAME"":""氯化钠注射液(玻璃)"",""DRUGSPEC"":""500ml:4.5g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":1.5,""DRUGORIGIN"":""石药银湖制药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902964000471"",""NATIONINSURENAME"":""氯化钠注射液""},{""DRUGCODE"":""5212701"",""DRUGNAME"":""氯化钠注射液(玻璃)"",""DRUGSPEC"":""500ml:4.5g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":1.43,""DRUGORIGIN"":""石家庄四药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902763001327"",""NATIONINSURENAME"":""氯化钠注射液""},{""DRUGCODE"":""5212603"",""DRUGNAME"":""浓氯化钠注射液"",""DRUGSPEC"":""10ml:1g×5支"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":0.3,""DRUGORIGIN"":""扬州中宝药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86901744000663"",""NATIONINSURENAME"":""浓氯化钠注射液""},{""DRUGCODE"":""5212601"",""DRUGNAME"":""浓氯化钠注射液"",""DRUGSPEC"":""10ml:1g*5支"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":1.5,""DRUGORIGIN"":""扬州中宝药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86901744000663"",""NATIONINSURENAME"":""浓氯化钠注射液""},{""DRUGCODE"":""5212602"",""DRUGNAME"":""浓氯化钠注射液"",""DRUGSPEC"":""10ml:1g*5支"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":1.5,""DRUGORIGIN"":""国药集团容生制药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86903205000694"",""NATIONINSURENAME"":""浓氯化钠注射液""},{""DRUGCODE"":""86901871000864"",""DRUGNAME"":""氯化钾注射液（塑料）"",""DRUGSPEC"":""10ml:1g"",""DRUGPROP"":1,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":1.22,""DRUGORIGIN"":""湖北科伦药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86901871000864"",""NATIONINSURENAME"":""氯化钾注射液""},{""DRUGCODE"":""5211902"",""DRUGNAME"":""氯化钠注射液(可立袋)"",""DRUGSPEC"":""150ml"",""DRUGPROP"":1,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":4.1,""DRUGORIGIN"":""四川科伦药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902180000712"",""NATIONINSURENAME"":""氯化钠注射液""},{""DRUGCODE"":""5211901"",""DRUGNAME"":""氯化钠注射液(可立袋)"",""DRUGSPEC"":""100ml:0.9g"",""DRUGPROP"":1,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":4.0,""DRUGORIGIN"":""四川科伦药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902180000613"",""NATIONINSURENAME"":""氯化钠注射液""},{""DRUGCODE"":""518050701"",""DRUGNAME"":""盐酸倍他司汀氯化钠注射液(玻璃）"",""DRUGSPEC"":""500ml"",""DRUGPROP"":1,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":2.95,""DRUGORIGIN"":""石家庄四药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902763001112"",""NATIONINSURENAME"":""盐酸倍他司汀氯化钠注射液""},{""DRUGCODE"":""5211202"",""DRUGNAME"":""氯化钠注射液0.9％"",""DRUGSPEC"":""27g:3000ml"",""DRUGPROP"":0,""DRUGUNIT"":""袋"",""DRUGOUTPUNIT"":""袋"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":27.5,""DRUGORIGIN"":""成都青山利康药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902053000092"",""NATIONINSURENAME"":""氯化钠注射液""},{""DRUGCODE"":""5211201"",""DRUGNAME"":""氯化钠注射液0.9％"",""DRUGSPEC"":""10ml:90mg"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":1.54,""DRUGORIGIN"":""中国大冢制药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86900967000399"",""NATIONINSURENAME"":""氯化钠注射液""},{""DRUGCODE"":""5210802"",""DRUGNAME"":""氯化钠注射液(双管双阀)"",""DRUGSPEC"":""500ml:4.5g"",""DRUGPROP"":1,""DRUGUNIT"":""袋"",""DRUGOUTPUNIT"":""袋"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":5.3,""DRUGORIGIN"":""石家庄四药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902763001327"",""NATIONINSURENAME"":""氯化钠注射液""},{""DRUGCODE"":""5210801"",""DRUGNAME"":""氯化钠注射液(双管双阀)"",""DRUGSPEC"":""250ml:2.25g"",""DRUGPROP"":1,""DRUGUNIT"":""袋"",""DRUGOUTPUNIT"":""袋"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":5.0,""DRUGORIGIN"":""石家庄四药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902763001303"",""NATIONINSURENAME"":""氯化钠注射液""},{""DRUGCODE"":""5210601"",""DRUGNAME"":""羟乙基淀粉40氯化钠注射液"",""DRUGSPEC"":""500ml:30g:4.5g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":5.13,""DRUGORIGIN"":""山东齐都药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902763000801"",""NATIONINSURENAME"":""羟乙基淀粉40氯化钠注射液""},{""DRUGCODE"":""5210501"",""DRUGNAME"":""羟乙基淀粉130/0.4氯化钠注射液"",""DRUGSPEC"":""500ml"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":56.28,""DRUGORIGIN"":""华仁药业（日照）"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86904075000296"",""NATIONINSURENAME"":""羟乙基淀粉130/0.4氯化钠注射液""},{""DRUGCODE"":""522021001"",""DRUGNAME"":""卵磷脂络合碘片"",""DRUGSPEC"":""1.5mg*60片"",""DRUGPROP"":0,""DRUGUNIT"":""片"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":60.0,""DRUGFORM"":""片剂"",""DRUGPRICE"":1.927,""DRUGORIGIN"":""第一药品产业株式会社"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86979009000024"",""NATIONINSURENAME"":""卵磷脂络合碘片""},{""DRUGCODE"":""86981084000011"",""DRUGNAME"":""氯化钾缓释片"",""DRUGSPEC"":""0.5g*24片"",""DRUGPROP"":0,""DRUGUNIT"":""片"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":24.0,""DRUGFORM"":""缓（控）释剂型"",""DRUGPRICE"":0.2733333,""DRUGORIGIN"":""广州誉东健康制药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86900405001063"",""NATIONINSURENAME"":""氯化钾缓释片""},{""DRUGCODE"":""86900405001063"",""DRUGNAME"":""氯化钾缓释片"",""DRUGSPEC"":""0.5g*24片"",""DRUGPROP"":0,""DRUGUNIT"":""片"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":24.0,""DRUGFORM"":""缓（控）释剂型"",""DRUGPRICE"":0.2733333,""DRUGORIGIN"":""广州迈特兴华制药厂有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86900405001063"",""NATIONINSURENAME"":""氯化钾缓释片""},{""DRUGCODE"":""5270301"",""DRUGNAME"":""氯化钠粉"",""DRUGSPEC"":""1kg"",""DRUGPROP"":0,""DRUGUNIT"":""袋"",""DRUGOUTPUNIT"":""袋"",""ANTITYPE"":0,""DRUGPOIS"":""消毒用药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""粉剂"",""DRUGPRICE"":8.0,""DRUGORIGIN"":""河北华晨"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""0000000000"",""NATIONINSURENAME"":""虚拟医保项目""},{""DRUGCODE"":""6080101"",""DRUGNAME"":""新复方芦荟胶囊"",""DRUGSPEC"":""0.43g*24粒"",""DRUGPROP"":0,""DRUGUNIT"":""粒"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":0,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":24.0,""DRUGFORM"":""胶囊(胶丸、滴丸)"",""DRUGPRICE"":0.8270833,""DRUGORIGIN"":""河北万邦复临药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902651000203"",""NATIONINSURENAME"":""新复方芦荟胶囊""},{""DRUGCODE"":""5213201"",""DRUGNAME"":""复方氯化钠注射液（可立袋)"",""DRUGSPEC"":""500ml"",""DRUGPROP"":1,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":5.0,""DRUGORIGIN"":""四川科伦药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902180001108"",""NATIONINSURENAME"":""复方氯化钠注射液""},{""DRUGCODE"":""5213401"",""DRUGNAME"":""氯化钙注射液"",""DRUGSPEC"":""10ml:0.5g*5支"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":1.114,""DRUGORIGIN"":""上海信谊金朱药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86900801000226"",""NATIONINSURENAME"":""氯化钙注射液""},{""DRUGCODE"":""86902180000576"",""DRUGNAME"":""葡萄糖氯化钠注射液(可立袋)"",""DRUGSPEC"":""500ml"",""DRUGPROP"":1,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":4.8,""DRUGORIGIN"":""四川科伦药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902180000576"",""NATIONINSURENAME"":""葡萄糖氯化钠注射液""},{""DRUGCODE"":""86902180000521"",""DRUGNAME"":""葡萄糖氯化钠注射液(可立袋)"",""DRUGSPEC"":""250ml"",""DRUGPROP"":1,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":4.6,""DRUGORIGIN"":""四川科伦药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902180000521"",""NATIONINSURENAME"":""葡萄糖氯化钠注射液""},{""DRUGCODE"":""5275901"",""DRUGNAME"":""陆恒生物过氧乙酸试纸"",""DRUGSPEC"":""0-3000mg"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""消毒用药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""其他剂型"",""DRUGPRICE"":360.0,""DRUGORIGIN"":""杭州"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""0000000000"",""NATIONINSURENAME"":""虚拟医保项目""},{""DRUGCODE"":""5146701"",""DRUGNAME"":""吡拉西坦氯化钠注射液"",""DRUGSPEC"":""100ml:20g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":42.47,""DRUGORIGIN"":""山东威高药业"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86904177000057"",""NATIONINSURENAME"":""吡拉西坦氯化钠注射液""},{""DRUGCODE"":""501171002"",""DRUGNAME"":""氟康唑氯化钠注射液"",""DRUGSPEC"":""0.2g:100ml"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":2,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":207.82,""DRUGORIGIN"":""法国辉瑞"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86978712000154"",""NATIONINSURENAME"":""氟康唑氯化钠注射液""},{""DRUGCODE"":""501171001"",""DRUGNAME"":""氟康唑氯化钠注射液"",""DRUGSPEC"":""0.2g:100ml"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":2,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":""国家基本药物"",""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":12.95,""DRUGORIGIN"":""石家庄四药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902763000436"",""NATIONINSURENAME"":""氟康唑氯化钠注射液""},{""DRUGCODE"":""601004302"",""DRUGNAME"":""连花清瘟颗粒"",""DRUGSPEC"":""6g*10袋"",""DRUGPROP"":0,""DRUGUNIT"":""袋"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":10.0,""DRUGFORM"":""颗粒剂"",""DRUGPRICE"":2.439,""DRUGORIGIN"":""北京以岭药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86979263000020"",""NATIONINSURENAME"":""连花清瘟颗粒""},{""DRUGCODE"":""601004301"",""DRUGNAME"":""连花清瘟颗粒"",""DRUGSPEC"":""6*10袋"",""DRUGPROP"":0,""DRUGUNIT"":""袋"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":1,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":10.0,""DRUGFORM"":""颗粒剂"",""DRUGPRICE"":2.439,""DRUGORIGIN"":""北京以岭药业有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86979263000020"",""NATIONINSURENAME"":""连花清瘟颗粒""},{""DRUGCODE"":""5031401"",""DRUGNAME"":""阿昔洛韦氯化钠注射液(Ⅱ)"",""DRUGSPEC"":""250ml:0.25g:2.25g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":94.0,""DRUGORIGIN"":""四川科伦药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86902180000040"",""NATIONINSURENAME"":""阿昔洛韦氯化钠注射液(Ⅱ)""},{""DRUGCODE"":""5179701"",""DRUGNAME"":""盐酸昂丹司琼氯化钠注射液"",""DRUGSPEC"":""100ml:8mg:0.9g"",""DRUGPROP"":0,""DRUGUNIT"":""瓶"",""DRUGOUTPUNIT"":""瓶"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":25.0,""DRUGORIGIN"":""安徽环球药业股份有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86904303000173"",""NATIONINSURENAME"":""盐酸昂丹司琼氯化钠注射液""},{""DRUGCODE"":""5126801"",""DRUGNAME"":""注射用醋酸亮丙瑞林缓释微球"",""DRUGSPEC"":""3.75mg"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":1305.0,""DRUGORIGIN"":""北京博恩特药业"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86907716000013"",""NATIONINSURENAME"":""注射用醋酸亮丙瑞林缓释微球""},{""DRUGCODE"":""5126802"",""DRUGNAME"":""注射用醋酸亮丙瑞林缓释微球"",""DRUGSPEC"":""3.75mg(附助悬剂2ml）"",""DRUGPROP"":0,""DRUGUNIT"":""支"",""DRUGOUTPUNIT"":""支"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":2,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":1.0,""DRUGFORM"":""注射剂"",""DRUGPRICE"":1311.0,""DRUGORIGIN"":""上海丽珠制药有限公司"",""DRUGSTOCK"":null,""NATIONINSURECODE"":""86900717000426"",""NATIONINSURENAME"":""注射用醋酸亮丙瑞林微球""},{""DRUGCODE"":""5313101"",""DRUGNAME"":""DL换算系数"",""DRUGSPEC"":""时价分批"",""DRUGPROP"":0,""DRUGUNIT"":""片"",""DRUGOUTPUNIT"":""盒"",""ANTITYPE"":0,""DRUGPOIS"":""普通药"",""SSSEDRUGSSIGN"":null,""CANSPLIT"":0,""DRUGDANGER"":0,""DRUGOUTPACKAGE"":28.0,""DRUGFORM"":""方剂"",""DRUGPRICE"":0.2,""DRUGORIGIN"":null,""DRUGSTOCK"":null,""NATIONINSURECODE"":null,""NATIONINSURENAME"":null}]";
            //System.Threading.Thread.Sleep(3000);
            List<EPrescriptionDrugItem> lstObj = new List<EPrescriptionDrugItem>();
            lstObj.Add(new EPrescriptionDrugItem());
            int i = 0;
            lstObj = Newtonsoft.Json.JsonConvert.DeserializeObject<List<EPrescriptionDrugItem>>(dataTmp);
            foreach (EPrescriptionDrugItem item in lstObj)
            {
                i++;
                item.DRUGINPUNIT = item.DRUGOUTPUNIT;
                item.DRUGINPACKAGE = item.DRUGOUTPACKAGE;
                item.DrugThirdId = "A" + i + "_" + item.DRUGCODE;
                item.COSTTYPE = "费用类型_" + i;
                item.INSURECATEGORY = "医保类别_" + i;
                item.DRUGTRADENAME = "药品商品名_" + i;
                item.DRUGORIGIN = "生产企业名称_" + i;
                item.APPROVALNUMBER = "批准文号_" + i;
                item.DRUGNOTES = "备注信息_" + i;
            }
            return Json(lstObj);
        }

        /// <summary>
        /// 院外电子处方流转，电子处方预检
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("CheckPrescription")]
        public IActionResult CheckPrescription([FromBody] EPrescriptionInfo parIn)
        {
            dynamic tmpObj = new { Result = 1, ErrMsg = "" };
            return Json(tmpObj);
        }

        /// <summary>
        /// 院外电子处方流转，电子处方上传
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("UploadPrescription")]
        public IActionResult UploadPrescription([FromBody] EPrescriptionInfo parIn)
        {
            dynamic tmpObj = new { result = 1, errmsg = "" };
            return Json(tmpObj);
        }

        /// <summary>
        /// 院外电子处方流转，电子处方作废
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("InvalidPrescription")]
        public IActionResult InvalidPrescription([FromBody] EPrescriptionDelPar parIn)
        { 
            dynamic tmpObj = new { Result = 1, ErrMsg = "" };
            return Json(tmpObj);
        }

        /// <summary>
        /// 医嘱标记项目接口数据加工
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetAdviceTagInfo")]
        public IActionResult GetAdviceTagInfo([FromBody] dynamic parIn)
        {
            //返回值格式
            //{
            //  "result":1,
            //  "msg":"",
            //  "data":[
            //      {
            //      "advice_tag_id":"字符|医嘱标记ID",
            //      "clinic_item_id":"数字|诊疗项目ID",
            //      "fee_item_id":"数字|收费细目ID",
            //      "clinic_type":"字符|诊疗类别",
            //      "required":"数字|是否必填 1-必填,0-非必填",
            //      "default_value":"字符|缺省值",
            //      "tip_info":"字符|提示信息",
            //      "edit_mode":"数字|编辑方式:1-禁止编辑"}
            // ]}

            dynamic tmpObj = new { Result = 1, ErrMsg = "" };
            return Json(tmpObj);
        }

        /// <summary>
        /// 药师处方审查，审查结果查询，住院医生发送医嘱时调用
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="pvid"></param>
        /// <returns></returns>
        [HttpGet("GetRecipeResult")]
        public IActionResult GetRecipeResult(string pid,string pvid)
        {
            string strTemp = @"{""recipes"":[{""ORDER_ID"":320907,""ORDER_GROUP_ID"":320908,""PHARMACIST_ID"":""CZ"",""ORDERSTATUS"":""正在审核"",""NO_PASS_REASON"":"""",""REMAININGTIME"":-29}],""url"":""""}";
            GetRecipeResult_OutM tmpObj = new GetRecipeResult_OutM();
            tmpObj = Newtonsoft.Json.JsonConvert.DeserializeObject<GetRecipeResult_OutM>(strTemp);
            tmpObj.url = "http://192.168.56.1:5888/PatientMrHome/ReviewResultZLPASS";

            return Json(tmpObj);
        }

        /// <summary>
        /// 合理用药，提交审方地址，门诊发送医嘱时调用
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>

        [HttpPost("Recipe")]
        [Consumes("text/plain")] // 指定该方法接受text/plain类型的请求
        [Produces("text/plain")] // 指定该方法返回text/plain类型的响应
        public IActionResult Recipe(string parIn)
        {
            //有个问题未解决，就是接收不到传进来的入参信息

            //dynamic tmpObj = new { Result = 1, ErrMsg = "", parIn };

            ////var text =Request.Body;
            //string strTmp = "";
            //using (var reader = new StreamReader(Request.Body))
            //{
            //    var text = reader.ReadToEndAsync();

            //    // 在这里处理接收到的文本 
            //    strTmp = "";

            //}

            string strOut = @"<root>
                    <recipes>
                        <order_id>383697</order_id>
                        <order_group_id>383698</order_group_id>
                        <pharmacist_id>WKB</pharmacist_id>
                        <orderstatus>正在审核</orderstatus>
                        <remainingtime>-1528</remainingtime>
                    </recipes>
                    <url>http://192.168.56.1:5888/PatientMrHome/ReviewResultZLPASS</url>
                </root>";
            //strOut = "<root />";
            return Json(strOut);
        }

        /// <summary>
        /// 新增账单时帐单入参格式化
        /// </summary>
        /// <param name="pendingBillIn"></param>
        /// <returns></returns>
        [HttpPost("NewBillParFormat")]
        public IActionResult NewBillParFormat([FromBody] PendingBillIn pendingBillIn)
        {
            string strTmp = Newtonsoft.Json.JsonConvert.SerializeObject(pendingBillIn,
                new Newtonsoft.Json.Converters.IsoDateTimeConverter { DateTimeFormat = "yyyy-MM-dd HH:mm:ss" });
            return Json(strTmp);
        }

        /// <summary>
        /// 医嘱保事前事中通用测试服务
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("SvrInsureProcess")]
        public IActionResult SvrInsureProcess([FromBody] dynamic parIn)
        {
            #region 把入参记录下来 测试日志
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();       
            string id = Guid.NewGuid().ToString();
            string strInfo = Newtonsoft.Json.JsonConvert.SerializeObject(parIn);
            zlhisInterfaceDAL.ZLhisLogInsert(1, id, "", strInfo, 1, "SvrInsureProcess", "SvrInsureProcess", "SvrInsureProcess");
            #endregion
             
            string strResult = @"[{""vola_id"":""VOLA20240115001"",""rule_id"":""RULE001"",""rule_name"":""重复开药检测规则"",""vola_content"":""同一患者在短时间内重复开具相同药品"",""pid"":""P20240115001"",""pat_visit_no"":""V20240115001"",""vola_amt"":356.5,""vola_amt_stas"":""正常"",""sev_deg"":""明确违规"",""vola_evid"":""患者于2024-01-10和2024-01-12重复开具相同药品阿托伐他汀"",""vola_bhvr_type"":""行为类"",""task_id"":""TASK20240115001"",""is_feedback"":""1"",""vola_detail_info"":[{""vola_item_id"":""ITEM001"",""patn_id"":""P20240115001"",""pat_visit_no"":""V20240115001"",""order_id"":""ORD001"",""vola_item_type"":""违规项"",""vola_amt"":178.25,""transaction_type"":""药品费用""},{""vola_item_id"":""ITEM002"",""patn_id"":""P20240115001"",""pat_visit_no"":""V20240115001"",""order_id"":""ORD002"",""vola_item_type"":""涉及项"",""vola_amt"":178.25,""transaction_type"":""药品费用""}]},{""vola_id"":""VOLA20240115002"",""rule_id"":""RULE002"",""rule_name"":""超量检查检测规则"",""vola_content"":""单次就诊检查项目超过规定数量"",""pid"":""P20240115002"",""pat_visit_no"":""V20240115002"",""vola_amt"":420,""vola_amt_stas"":""正常"",""sev_deg"":""高度可疑"",""vola_evid"":""单次就诊CT检查超过3次，违反医保规定"",""vola_bhvr_type"":""项目类"",""task_id"":""TASK20240115002"",""is_feedback"":""0"",""vola_detail_info"":[{""vola_item_id"":""ITEM003"",""patn_id"":""P20240115002"",""pat_visit_no"":""V20240115002"",""order_id"":""ORD003"",""vola_item_type"":""违规项"",""vola_amt"":280,""transaction_type"":""检查费用""},{""vola_item_id"":""ITEM004"",""patn_id"":""P20240115002"",""pat_visit_no"":""V20240115002"",""order_id"":""ORD004"",""vola_item_type"":""违规项"",""vola_amt"":140,""transaction_type"":""检查费用""}]}]";
            dynamic jlist = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(strResult);
            RootJCPT rootJCPT = new RootJCPT();
            rootJCPT.input = new InputJCPT();
            rootJCPT.input.ack_info = new Ack_info() { exe_status = "A" };            
            rootJCPT.input.result = jlist; 
            return Json(rootJCPT);
        }

        /// <summary>
        /// 知识库规则服务测试服务 a.服务名称 in ('提交主体信息','提交问诊信息')
        /// </summary>
        /// <param name="par"></param>
        /// <returns></returns>
        [HttpPost("SvrCISRuleAsk")]
        public IActionResult SvrCISRuleAsk([FromBody] dynamic parIn)
        {
            #region 把入参记录下来 测试日志
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL(); 
            string id = Guid.NewGuid().ToString();
            string strInfo = Newtonsoft.Json.JsonConvert.SerializeObject(parIn);
            zlhisInterfaceDAL.ZLhisLogInsert(1, id, "", strInfo, 1, "SvrCISRuleAsk", "SvrCISRuleAsk", "SvrCISRuleAsk");
            #endregion


            string strResult = @"[{""vola_id"":""VOLA20240115001"",""rule_id"":""RULE001"",""rule_name"":""重复开药检测规则"",""vola_content"":""同一患者在短时间内重复开具相同药品"",""pid"":""P20240115001"",""pat_visit_no"":""V20240115001"",""vola_amt"":356.5,""vola_amt_stas"":""正常"",""sev_deg"":""明确违规"",""vola_evid"":""患者于2024-01-10和2024-01-12重复开具相同药品阿托伐他汀"",""vola_bhvr_type"":""行为类"",""task_id"":""TASK20240115001"",""is_feedback"":""1"",""vola_detail_info"":[{""vola_item_id"":""ITEM001"",""patn_id"":""P20240115001"",""pat_visit_no"":""V20240115001"",""order_id"":""ORD001"",""vola_item_type"":""违规项"",""vola_amt"":178.25,""transaction_type"":""药品费用""},{""vola_item_id"":""ITEM002"",""patn_id"":""P20240115001"",""pat_visit_no"":""V20240115001"",""order_id"":""ORD002"",""vola_item_type"":""涉及项"",""vola_amt"":178.25,""transaction_type"":""药品费用""}]},{""vola_id"":""VOLA20240115002"",""rule_id"":""RULE002"",""rule_name"":""超量检查检测规则"",""vola_content"":""单次就诊检查项目超过规定数量"",""pid"":""P20240115002"",""pat_visit_no"":""V20240115002"",""vola_amt"":420,""vola_amt_stas"":""正常"",""sev_deg"":""高度可疑"",""vola_evid"":""单次就诊CT检查超过3次，违反医保规定"",""vola_bhvr_type"":""项目类"",""task_id"":""TASK20240115002"",""is_feedback"":""0"",""vola_detail_info"":[{""vola_item_id"":""ITEM003"",""patn_id"":""P20240115002"",""pat_visit_no"":""V20240115002"",""order_id"":""ORD003"",""vola_item_type"":""违规项"",""vola_amt"":280,""transaction_type"":""检查费用""},{""vola_item_id"":""ITEM004"",""patn_id"":""P20240115002"",""pat_visit_no"":""V20240115002"",""order_id"":""ORD004"",""vola_item_type"":""违规项"",""vola_amt"":140,""transaction_type"":""检查费用""}]}]";
            dynamic jlist = Newtonsoft.Json.JsonConvert.DeserializeObject<dynamic>(strResult);
            RootJCPT rootJCPT = new RootJCPT();
            rootJCPT.input = new InputJCPT();
            rootJCPT.input.ack_info = new Ack_info() { exe_status = "A" };
            rootJCPT.input.result = jlist;
            return Json(rootJCPT);
        }
    }



}
