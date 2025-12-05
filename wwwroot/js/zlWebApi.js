
///处理数字对象出现undefined
function zlval(txt) {
    if (txt == undefined) {
        return 0;
    } else if (txt == null) {
        return 0;
    } else if (txt == "") {
        return 0;
    } else if ((typeof txt) === 'number' && isNaN(txt)) {
        return 0;
    }

    var newVal;
    if (txt.toString().indexOf(".") > 0)
        newVal = parseFloat(txt);
    else
        newVal = parseInt(txt);

    if ((typeof newVal) === 'number' && isNaN(newVal)) {
        return 0;
    } else {
        return newVal;
    }
}

//处理文本对象出现undefined
function zlnvl(txt, defaultVal) {
    if (defaultVal == undefined) defaultVal = "";

    if (txt == undefined) {
        return defaultVal;
    } else if (txt == null) {
        return defaultVal;
    } else if (txt === "") {
        return defaultVal;
    } else {
        return txt.toString();
    }
}

/// <summary>
/// ajax调用--post方法
///<param name="url">调用地址，不包含ip及端口，如"/api/controller/service"</param>
///<param name="postData">请求参数，Json字符串</param>
///<param name="rooturl">可选参数，服务器地址，如"http://127.0.0.1:7777"</param>
///<return>返回对象：{Success:true,Code:500,Data:"",Msg:""}</return>
///Success:true||false
///Code:状态码
///Data:服务器返回的数据
///Msg：错误消息
/// </summary>
function zlPost(url, postData, rooturl = "", timeout = 0, token = "", successCallBack, errorCallBack) {
    if (typeof successCallBack === "function") showLoading();//异步时可以显示出来

    var result = { Success: false, Code: "", Data: undefined, Msg: "" };

    $.ajax({
        url: rooturl + url,
        type: "post",
        async: (typeof successCallBack === "function") ? true : false,//有回调时使用异步，否则同步
        timeout: zlval(timeout),//超时
        contentType: "application/json",
        data: postData,
        beforeSend: (xhr) => {
            //设置认证
            if (token == "") token = zlnvl(sessionStorage.AudKey);
            if (token != "") xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (res, status, xhr) {
            result = res;//服务端转换为了{Success,Code,Data,Msg}格式
            if (res.Success) {
                if (typeof successCallBack == "function") {
                    closeLoading();
                    successCallBack(result);
                }
            } else {//返回失败也当成错误
                if (typeof errorCallBack == "function") {
                    closeLoading();
                    errorCallBack(result);
                }
            }
        },
        error: function (xhr, status, error) {
            result = GetWebApiErrorResult(xhr, status);
            if (typeof errorCallBack == "function") {
                closeLoading();
                errorCallBack(result);
            }
        },
    });

    if (successCallBack == undefined) return result;
}

/// <summary>
/// ajax调用--GET方法
///<param name="url">调用地址，不包含ip及端口，如"/api/controller/service"</param>
///<param name="rooturl">可选参数，服务器地址，如"http://127.0.0.1:7777"</param>
///<return>返回对象：{Success:true,Code:500,Data:"",Msg:""}</return>
///Success:true||false
///Code:状态码
///Data:服务器返回的数据
///Msg：错误消息
/// </summary>
function zlGet(url, rooturl = "", timeout = 0, successCallBack, errorCallBack) {
    if (typeof successCallBack === "function") showLoading();//异步时可以显示出来

    var result = { Success: false, Code: "", Data: undefined, Msg: "" };

    $.ajax({
        url: rooturl + url,
        type: "get",
        async: (typeof successCallBack === "function") ? true : false,//有回调时使用异步，否则同步
        timeout: zlval(timeout),//超时,
        contentType: "application/json",
        beforeSend: (xhr) => {
            //设置认证
            var token = zlnvl(sessionStorage.AudKey);
            if (token != "") xhr.setRequestHeader("Authorization", "Bearer " + token);
        },
        success: function (res, status, xhr) {
            result = res;//服务端转换为了{Success,Code,Data,Msg}格式
            if (res.Success) {
                if (typeof successCallBack == "function") {
                    closeLoading();
                    successCallBack(result);
                }
            } else {//返回失败也当成错误
                if (typeof errorCallBack == "function") {
                    closeLoading();
                    errorCallBack(result);
                }
            }
        },
        error: function (xhr, status, error) {
            result = GetWebApiErrorResult(xhr, status);
            if (typeof errorCallBack == "function") {
                closeLoading();
                errorCallBack(result);
            }
        },
    });

    if (successCallBack == undefined) return result;
}

//功能：ajax调用出错时获取和转换错误返回对象
function GetWebApiErrorResult(xhr, status) {

    //附加错误信息
    var exInfo = null;
    var appException = false;

    //标准返回格式
    var result = { Success: false, Code: status, Data: undefined, Msg: "" };

    var responseObj = null;
    //通过responseJSON返回错误对象(此时responseText是对应json文本)
    if (!(typeof xhr.responseJSON != "object" || xhr.responseJSON == null)) {
        responseObj = JSON.parse(JSON.stringify(xhr.responseJSON));//不引用赋值
    }
    //通过responseText返回错误对象(此时无responseJSON)
    if (responseObj == null && zlnvl(xhr.responseText) != "") {
        //responseText：'{"status":401,"message":"IDX10223: Lifetime validation failed. The token is expired..."}'
        //responseText:"{\"Code\":500,\"Success\":false,\"Msg\":\"'int' does not contain a definition for 'Filed'\",\"Data\":{},...
        try {
            responseObj = JSON.parse(xhr.responseText);
        } catch (err) { }
    }

    //返回错误对象的应用错误
    if (responseObj != null) {
        //服务端转换为了{Success,Code,Data,Msg}格式
        if ("Success" in responseObj && "Msg" in responseObj) {
            result = responseObj;

            if (zlnvl(responseObj["AppException"]) == "1") {
                appException = true;
            }
        } else if ("message" in responseObj) {
            result.Msg = responseObj.message;
        } else {
            result.Msg = JSON.stringify(responseObj);
        }
    } else {//没有返回错误对象的底层错误
        //系统错误
        if (zlnvl(xhr.statusText) != "") {
            result.Msg = xhr.statusText;
            if (xhr.statusText == "Internal Server Error" && zlnvl(xhr.responseText) != "") {
                result.Msg = xhr.responseText.split(" at ")[0];
            }
        }
        //非ajax错误或者ajax调用不起
        else if (zlnvl(xhr.responseText) != "") {
            result.Msg = xhr.responseText;
        }
        else {
            result.Msg = "服务调用失败：未知异常。";
        }
    }

    //特殊错误提示自动转换
    //ZLHIS过程主动提示的抛错
    if (result.Msg.indexOf("[ZLSOFT]") >= 0) {
        result.Msg = result.Msg.split("[ZLSOFT]")[1];
    }
    //ORA-20999: ORA-12899: 列 "ZLHIS"."常用嘱托"."名称" 的值太大 (实际值: 504, 最大值: 200) 
    //ORA-06512: 在 "...", line 97 
    else if (result.Msg.indexOf("ORA-12899") >= 0) {
        result.Msg = result.Msg.split("ORA-12899:")[1].split("ORA-06512:")[0].trim().replace(/"/g, "").replace(/ZLHIS./g, "");
    }

    //超长截断
    if (result.Msg.length > 1000) {
        result.Msg = result.Msg.substr(0, 1000) + "...";
    }

    //换行显示
    result.Msg = result.Msg.replace(/\r\n/g, "<br>").replace(/\r/g, "<br>").replace(/\n/g, "<br>");

    //增加应用程序提示标记
    if (appException) {
        result.Msg += "<AppException></AppException>";
    }

    return result;
}

(function () {
    var indexLoading;
    window.showLoading = function () {
        indexLoading = layer.load(2, { shade: false });
    }

    window.closeLoading = function () {
        layer.close(indexLoading);
    }
})(window, $);