// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
$(function () {

    $("body").on("click", "#btnAppReg", function () {
        //AIO集成
        let dataObj = {}
        dataObj.DataTxt = GetDataZLHISCall();
        dataObj.SysTag = "_zlrgs_";
        dataObj.Opportunity = "ZLhisCallSave_ByAio";
        AioSendDataToVb(dataObj);

        //CEF集成
        if (typeof CEFAPI != "undefined") {
            dataObj.Opportunity = "ZLhisCallSave_ByCef";
            CEFAPI.trigger(JSON.stringify(dataObj), "");
        }
    });

    $("body").on("click", "#btnLQAReg", function () {
        //AIO集成
        let dataObj = {}
        dataObj.DataTxt = GetDataZLHISCall();
        dataObj.SysTag = "_zlrgs_";
        dataObj.Opportunity = "ZLhisCallSave_ByAio";
        AioSendDataToVb(dataObj);

        //CEF集成
        if (typeof CEFAPI != "undefined") {
            dataObj.Opportunity = "ZLhisCallSave_ByCef";
            CEFAPI.trigger(JSON.stringify(dataObj), "");
        }
    });

    /**供外部调用ZLHIS填申请的时候调 */
    window.GetDataZLHISCall = function () {
        return JSON.stringify({
            "RegNo": "N123456789"
        });
    }

});

function FunWebReg(parIn) {
    //AIO集成
    let dataObj = {}
    dataObj.DataTxt = GetDataZLHISCall();
    dataObj.SysTag = "_zlrgs_";
    dataObj.Opportunity = "ZLhisCallSave_ByAio";
    AioSendDataToVb(dataObj);

    //CEF集成
    if (typeof CEFAPI != "undefined") {
        dataObj.Opportunity = "ZLhisCallSave_ByCef";
        CEFAPI.trigger(JSON.stringify(dataObj), "");
    }
}
function GetNowTime() {
    const now = new Date();

    const year = now.getFullYear();
    const month = ('0' + (now.getMonth() + 1)).slice(-2);
    const day = ('0' + now.getDate()).slice(-2);
    const hours = ('0' + now.getHours()).slice(-2);
    const minutes = ('0' + now.getMinutes()).slice(-2);
    const seconds = ('0' + now.getSeconds()).slice(-2);

    const formattedTime = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
    return formattedTime;
}

function ReLoadRemainMoney() { 
    let strHtml = `<div class="col-12">
             调用方法 ReLoadRemainMoney  ${GetNowTime()}
    </div>`;
    $("#parin").before(strHtml);
}

function InitData(data) { 
    let strHtml = `<div class="col-12">
             调用方法 InitData ${GetNowTime()}
    </div>`;
    strHtml += `<div class="col-12">
             ${JSON.stringify(data) }
  
    </div>`;
    $("#parin").before(strHtml);
}

function ReLoadTable(data) { 
    let strHtml = `<div  class="col-12">
             调用方法 ReLoadTable ${GetNowTime()}
 
    </div>`;

    strHtml += `<div  class="col-12">
             ${JSON.stringify(data)}
      
    </div>`;

    $("#parin").before(strHtml);
}

function DBlKK() {
    alert(0);
    GetNewPatientPara(3);
}
function GetNewPatientPara(data) {
    JudgeCEFIfLoadOver();
    alert("GetNewPatientPara")
    if (data) {
        alert(JSON.stringify(data))
    }
}

function JudgeCEFIfLoadOver() {
    try {
        CEFAPI.Trigger('ZLMDTSYSCLOSEMSG', '');
    } catch (err) {

    }
    
}

function LoadWritenRecordData(data) {
    alert("LoadWritenRecordData")
    if (data) {
        alert(JSON.stringify(data))
    }
}

function LoadWaitTaskData(data) {
    alert("LoadWaitTaskData")
    if (data) {
        alert(JSON.stringify(data))
    }
}

function LoadTemplateList(data) {
    alert("LoadTemplateList")
    if (data) {
        alert(JSON.stringify(data))
    }
}

function FocusWrittenList(data) {
    alert("FocusWrittenList")
    if (data) {
        alert(JSON.stringify(data))
    }
}

function ReceiveText(data) {
    alert("ReceiveText")
    if (data) {
        alert(JSON.stringify(data))
    }
} 

function GetNewPatientPara(data) {
    $("#parin_name").html("刷新");
    $("#parin").html(data);
}

//let tmp =
//{
//    "OperType":"2",
//    "ConnStr":"Data Source=xxxx",
//    "OrderIds":"14431,14433,14435,14437,13389",
//    "OperId":"2017",
//    "OperName":"李双双"
//}


/**声明接收vb程序发来的消息 */
function RegAioFun() {
    if (window.aioExtend) {
        window.aioExtend.onPostMessage = (data) => {

            //接收来至VB程序发来的消息
            //document.getElementById("res").innerText = data
            //...代码实现
            //alert(typeof data);
            //let strDataIn = data;

            //objData = JSON.parse(strDataIn);

            //alert(objData);

            //alert(JSON.stringify(data));

            //document.getElementById('demo').value = data;
            //$("#chang_pat").text(data);

            
        }
    }
}
/**注册方法 */
RegAioFun();
 

/**
 * Aio网页向Vb程序发送消息
 * VB程序收到后是JSON对象的字符串，传递的内容在  JSON("content") 中
 * @param {any} dataIn 可以是json对象，也可以是字符串
 */
function AioSendDataToVb(dataIn) {
    let command = {
        MsgType: "aio",
        Action: "postmessage",
        Pars: dataIn
    }
    window.aioExtend(command);
}

if (document.getElementById("btn")) {
    document.getElementById("btn").addEventListener('click', () => {
        var value = document.getElementById('demo').value;

        value = JSON.stringify(value);
        command = {
            MsgType: "aio",
            Action: "postmessage",
            Pars: value
        }
        window.aioExtend(command);
        document.getElementById('demo').value = "";
    });
}

if (document.getElementById("btnEx")) {
    document.getElementById("btnEx").addEventListener('click', () => {
        var value = {
            "mrID": "5a3b4c5a-e370-4f19-bfae-c519bee634d0",
            "func": "CloseLayer",
            "SourceSystem": "WEB病历",
            "Program": "书写病历",
            "ThirdSystemKey": "2207884"
        };
         
        command = {
            MsgType: "aio",
            Action: "postmessage",
            Pars: value
        }
        window.aioExtend(command); 
    });
}


/**
 * 医嘱编辑和申请单保存医嘱后或提交暂存医嘱后调用医保接口
 * @param {any} objFun 网页组件通用执行方法函数对象 zlindsws.Exec
 * @param {any} parin  json对象，结构见注释
 */
function CallExaminedFeeItemsByEdit(objFun, parin) {

    //if (zlval(parin.insuretype) < 1) return; 不区分险类只要是新费用病人都要调用

    //入参格式 parin = {
    //    "pid": _patiInfor.病人id,
    //    "pvid": _patiInfor.主页id,
    //    "insuretype": _patiInfor.险类,
    //    "orderids": ids,
    //    "sitesn": window.userinfor.sitesn,
    //    "machinename": window.computerinfor.machinename,
    //    "userid": window.userinfor.userid,
    //}

    let newpati = IsNewCostPati(parin.pid, parin.pvid);//是否是新费用病人

    if (!newpati && zlval(parin.insuretype) < 1) {
        //如果是老费用只有险类大于0才调用，新费用病人不管险类
        return;
    }


    let ret = zlPost(`/Advice/GetExaminedFeeItemsParByEdit`, JSON.stringify(parin));
    if (!ret.isOk) {
        ErrorCenter(ret.msg, "检查费用项目", false);
        return false;
    }
    let list = [];
    let lstOld = [];
    if (ret.data) {
        ret.data.forEach(function (item) {
            //新费用
            list.push(
                {
                    "OrderId": item.医嘱id,
                    "ClinicItemName": item.诊疗项目名称,
                    "ChargesId": item.收费细目id,
                    "ClinicItemId": item.诊疗项目id,
                    "OrderText": item.医嘱内容
                }
            );

            //老费用
            lstOld.push(
                {
                    "advice_id": item.医嘱id,
                    "fee_id": null,
                    "fitem_id": item.收费细目id,
                    "zitem_id": item.诊疗项目id,
                    "advice_content": item.医嘱内容
                }
            );

        });
    }
    if (list.length == 0) return;

    if (!newpati && zlval(parin.insuretype) > 0) {
        let data = { "detail_list": lstOld };
        let msg = {
            "insure_type": parin.insuretype,
            "occasion": 2,
            "pati_id": parin.pid,
            "visit_id": parin.pvid,
            "fee_list": JSON.stringify(data)
        };
        msg = JSON.stringify(msg);
        ExaminedFeeItems(objFun, msg);
        return;
    }

    let jdata = {
        "Caller": "ZLINDS",
        "PersonId": parin.userid,
        "PersonName": zlnvl(window.userinfor.userchinesename),
        "PatId": parin.pid,
        "PatOrigin": "02",
        "PatOriginId": parin.pvid,
        "Occasion": "2",
        "InsuranceCategoryCode": parin.insuretype,
        "ApprovalItems": list
    };
    ret = zlPost(`/Common/ExaminedFeeItems`, JSON.stringify(jdata));
    if (!ret.isOk) {
        ErrorCenter(ret.msg, "获取新费用费用审批信息", false);
        return false;
    }
    if (1 == ret.data.result) {
        let webUrl = ret.data.pageurl + "?data=" + encodeURIComponent(JSON.stringify(jdata));
        OpenUrl(webUrl, "费用审批", true, true, false, "auto", null, false, ["1100px", "98%"]);    
    }
}
//数据平台服务参数说明
//let jsonVar = {
//    "病人性质": "",//病案主页.病人性质
//    "路径状态": "1",//病案主页.路径状态
//    "路径已评估": "1",//0/1 是否
//    "路径外项目_权限": "1",//0/1 是否有权限
//    "是否存在补录医嘱": "1",//0/1 是存存在补录的长期医嘱
//    "只允许补录临嘱": "1",//0/1 系统参数:191，是否只能录入
//    "处方开单人": "张三,李四",//下达处方的开单人姓名逗号拼串，用于职务检查
//    "医生职务列表": [],//人员处方职务列表
//    "性别检查项目IDS": ",123,123,",//需求进行性别检查的诊疗项目id拼串
//    "药品零差价项目": "213,3124;1211,3333...",//进行药品零差价校验的信息，格式：库房ID,药品ID;....
//    "零差价项目列表": [],//过程序服务返回的列表
//    "手术项目IDS": "3234,234134",//手术诊疗项目id拼串
//    "人员手术权限": [],//SQL查询列表
//    "是否出院医嘱": "0",//0/1是否存出院性质的医嘱
//    "性别检查部位": "1234,1324,22",//用判断检查部位是否合法的检查项目id逗号拼串
//    "医嘱执行天数": "0",//0/1 系统参数 '医嘱执行天数', 1253
//    "毒麻精药品医嘱必需输入诊断": "",//0/1 系统参数 '毒麻精药品医嘱必需输入诊断', 1253
//    "普通药品医嘱必需输入诊断": "",//0/1 系统参数 '普通药品医嘱必需输入诊断', 1253)
//    "抗菌分级": "",//0/1 系统参数 187 抗菌药物分级管理
//    "手术授权管理": "",//0/1 系统参数 217
//    "主刀医生执行权": "",//0/1 系统参数 365
//    "只允许补录临嘱": "",//0/1 系统参数 191
//    "要求输入出院诊断": "",//0/1 系统参数 '要求输入出院诊断', 1253
//    "要求输入出院诊断检查结果": "",//0/1 是否要提示不通过
//    "中药药品项目": "23,1234,..",//中药配方中的明细行收费细目id逗号拼串
//    "中药品适用科室列表": [],// 收费执行科室 查询列表
//    "医生嘱托文本长度": "",//医生嘱托字段定义的长度
//    "执行频率列表": [],//查询列表
//    "输液配置中心": "12,343",// 输液配置中心部门id逗号拼串一般来只有一个
//    "处方药品数限制": "6",//参数：56 一并给药中允许有多少个药
//    "特殊级抗菌药物需审核两次": "0",//参数：296 特殊级抗菌药物需审核两次

//    "库存检查方式": [],//库存检查方式 [{"部门ID":299,"检查方式":2}]
//    "卫材库存入参": "",//Zl_Stuffsvr_Getstockbatch，高耗材的库存情况怎么判断，其实可以暂时不考虑，将虚拟库房一起传进去就能取出来了
//    "药品库存入参": "",//Zl_Drugsvr_Getstockbatch
//    "药品卫材库存列表": [],//库存列表 [{"部门ID":310,"项目ID":772,"库存":24}]
//    "库房部门IDS":"12,3243,43",//部门id逗号拼串
//    "部门名称列表": [],//库房部门名称列表主要是用于提示库存用 [{{"部门ID":310,"名称":772}]
//}

//Zl_To_Number(zl_GetSysParameter('毒麻精药品医嘱必需输入诊断', 1253)) as 毒麻精药品医嘱必需输入诊断,
//Zl_To_Number(zl_GetSysParameter('普通药品医嘱必需输入诊断', 1253)) as 普通药品医嘱必需输入诊断,
//Zl_To_Number(zl_GetSysParameter(187)) as 抗菌分级,
//Zl_To_Number(zl_GetSysParameter(217)) as 手术授权管理,
//Zl_To_Number(zl_GetSysParameter(365)) as 主刀医生执行权,
//Zl_To_Number(zl_GetSysParameter(191)) as 只允许补录临嘱,
//Zl_To_Number(zl_GetSysParameter('要求输入出院诊断', 1253)) as 要求输入出院诊断


//'执行时间判断:可选频率的必须输入(对临嘱将来可能允许不录入,要注意发送等地方的处理)
//If.TextMatrix(lngRow, COL_执行时间) = "" And.TextMatrix(lngRow, COL_间隔单位) <> "分钟" And.TextMatrix(lngRow, COL_频率) <> "必要时" And.TextMatrix(lngRow, COL_频率) <> "需要时" Then
//    If Not bln检验行 Then '检验组合显示行的采集方法为可选频率,但检验项目为一次性
//        If Val(.TextMatrix(lngRow, COL_频率性质)) <> 1 Then
//            strMsg = "没有录入执行时间方案。"
//             .Col = COL_执行时间: Exit For
//        End If
//    End If
//End If
//'只录入了首日时间的情况
//If InStr(.TextMatrix(lngRow, COL_执行时间), ",") > 0 Then
//    If Split(.TextMatrix(lngRow, COL_执行时间), ",")(1) = "" Then
//    strMsg = "没有录入执行时间方案。"
//        .Col = COL_执行时间: Exit For
//    End If
//End If

//Zl_Stuffsvr_GetStock



var a = '2020-01-01 08:08:08';
var b = '2023-02-01 08:08:08';

/**
 * 获取一个指定范围时间的随机时间 a<b
 * @param {any} a
 * @param {any} b
 */
function GetTimeAToB(a, b) {
    var c = new Date(a).getTime();
    var d = new Date(b).getTime();
    var e = d - c;
    var f = Math.random() * e;
    var outData = formatDate(c + f);
    console.log(outData);
    return outData;
    function formatDate(time) {
        if (time != null) {
            var datetime = new Date();
            datetime.setTime(time);
            var year = datetime.getFullYear();
            var month = (datetime.getMonth() + 1) < 10 ? "0" + (datetime.getMonth() + 1) : (datetime.getMonth() + 1);
            var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime.getDate();
            var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime.getHours();
            var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() : datetime.getMinutes();
            var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() : datetime.getSeconds();
            // return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
            return year + "-" + month + "-" + date + ' ' + hour + ':' + minute + ':' + second;
        } else {
            return "---";
        }
    }
}