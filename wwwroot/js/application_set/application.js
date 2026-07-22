
var gTestData = null;

(function () {
    var mPatientInfo = { savetype: 1 };    
    function bindSaveApplication() {
        var saveButton = document.getElementById("btnSaveApplication");
        var resultBox = document.getElementById("saveApplicationResult");

        if (!saveButton) {
            return;
        }

        saveButton.addEventListener("click", function () {
            var message = "保存申请按钮点击事件已触发。";

            var allData = null;

            if (String(mPatientInfo.savetype) === '2') {
                saveapplytoHIS(allData);
            } else {
                //AIO集成
                //临床提供，不要动
                let dataObj = {}
                dataObj.DataTxt = saveapplytoHIS(allData);
                dataObj.SysTag = "专业版临生免系统";
                dataObj.Opportunity = "ZLhisCallSave_ByAio";
                AioSendDataToVb(dataObj);

                //CEF集成
                //临床提供，不要动
                if (typeof CEFAPI != "undefined") {
                    dataObj.Opportunity = "ZLhisCallSave_ByCef";
                    CEFAPI.trigger(JSON.stringify(dataObj), "");
                }
            }

            if (resultBox) {
                resultBox.textContent = message;
            }

            if (window.layer && typeof window.layer.msg === "function") {
                window.layer.msg(message);
                return;
            }
            alert(message);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bindSaveApplication);
        return;
    }

    bindSaveApplication();

    function saveapplytoHIS(_tabledata) {
        var testData = { "connstr": "", "sitesn": "0", "savetype": "1", "oper_id": "145", "pc_ip": "", "dev_name": "", "calltype": "3", "pid": 204618, "name": "罗浮生老", "gender": "女", "age": "34岁", "source": "2", "card_no": null, "dept_id": "145", "apply_deptid": "145", "visitId": "1", "baby": "0", "RegNo": "", "diagnosis": "", "doctor_id": "142", "apply_doc": "管理员", "apply_no": null, "save_apply_api": null, "load_apply_api": null, "api_token": null, "receive_id": null, "conter_id": null, "memo": null, "list_item": [{ "collection_dept_id": "290", "collection_dept": null, "dept_name": "检验科", "application_time": "2026-07-21 20:53:00", "specimendefinition_name": "静脉血", "specimendefinition_id": "", "DoctorNote": "", "apply_item_group": "测试1", "emergency": 0, "collection_method_code": "010109039", "collection_method_id": null, "collection_method_name": "静脉采血", "itemname": "凝血功能检查", "itemid": "", "itemcode": "0000498", "exe_dept_id": "290", "exe_dept_name": null, "apply_items": [] }], "diag_ids": "559037", "prid": null, "coid": null }
        gTestData = JSON.stringify(testData);
        return JSON.stringify(testData);
    }



})();

(function () {
    $(function () {

    });
})(window, $);

// 获取url中的参数
function getUrlParam(paramName) {
    const urlSearch = new URLSearchParams(location.search);
    return urlSearch.get(paramName);
}

window.funLoadPatDiag = function (msg_data) {
    //如果是CEF则是调用JS方法
    debugger
}

function MsgFuncForZLHIS(data) {
    var msgDom = document.getElementById("post_data_info");
    msgDom.textContent = "CEF=" + data;
}

/**声明接收vb程序发来的消息
 * 临床提供，不要动
 * */
function RegAioFun() {
    if (window.aioExtend) {
        window.aioExtend.onPostMessage = (data) => {
            var resultBox = document.getElementById("post_data_info");
            msgDom.textContent = "AIO=" + data;
            //接收来至VB程序发来的消息
            //document.getElementById("res").innerText = data
            //...代码实现
            //alert(typeof data);
            //let strDataIn = data;
            //objData = JSON.parse(strDataIn);
            //alert(objData);
            //alert(JSON.stringify(data));
        }
    }
}

/**注册方法 */
RegAioFun();

/**
 * * 临床提供，不要动
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
    try {
        window.aioExtend(command);
    } catch (err) {
        return;
    }
}    