define(["jquery", "hammer", "jqueryhammer", 'panzoom'], function (jquery, hammer, jqueryhammer, panzoom) {

    var serviceChoose = urlFunction();

    // 站点ID获取
    function getZdId() {
        var zdid = window.location.href.split("=")[1];
        if (zdid == '' || zdid == undefined) zdid = null;
        //showHide(zdid);
        return zdid;
    }

    // 观片地址获取、输出
    var gpData;
    function gpGetUrl(responseTxt) {
        gpData = responseTxt;
    }
    //总库存量的获取
    var totalDoesinfo;
    function getTotalDose() {
        return totalDoesinfo;
    }
    function setTotalDose(totalDoes) {
        totalDoesinfo = totalDoes;
    }
    function aesEncrypt(message, key) {
        var encryptResult = CryptoJS.AES.encrypt(message, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return CryptoJS.enc.Base64.stringify(encryptResult.ciphertext);// Base64加密再 encode;。
    }
    function gpPostUrl(thisYziD) {
        var responseTxt = gpData;//OUTPUT
        if (responseTxt.Result.Output !== null) {
            // 接口地址
            var gpUrl = responseTxt.Result.Output.CONFIG.JK["#cdata-section"];
            // 参数内容
            var csText = '?';
            // 获取参数与参数之间的分隔符
            var SSD = responseTxt.Result.Output.CONFIG.SSD["#cdata-section"];
            // 参数名和参数值之间的分隔符
            var ZYD = responseTxt.Result.Output.CONFIG.ZYD["#cdata-section"];
            // 判断是否加密
            var JM = false;
            //if (responseTxt.Result.Output.CONFIG.JMGZ["#cdata-section"] == "1") {
             //   JM = true;
            //}
            // 对那些值加密 1：参数名和参数值都加密，2：参数名加密，3：参数值加密
            var JMNR = responseTxt.Result.Output.CONFIG.JMNR["#cdata-section"];

            //准备数据 关联属性，1：医嘱id，2：写死zldoc://，3：当前用户名，4：当前病人住院号，5：住院次数（就是主页id），6：病人id	
            //case 3,4,5 占时不撤销注释 以后需要的时候再改变 
            var data2 = 'zldoc://';
            var data3 = $("#username").val().toLowerCase();
            var data4 = $("#slzyID").text();
            var data5 = $("#slzyID").attr("data-pageid");
            var data6 = $("#slzyID").attr("data-patiid");

            // 如果有入参
            if (responseTxt.Result.Output.CONFIG.LIST.ITEM) {
				var JMGZ=responseTxt.Result.Output.CONFIG.JMGZ["#cdata-section"];
                var item = responseTxt.Result.Output.CONFIG.LIST.ITEM;
                item = makeArry(item);
                for (var i in item) {
                    var MC = item[i].MC["#cdata-section"];
                    if (item[i].JM["#cdata-section"] == "0"&&JMGZ=="1") {
                        JM = true;
                    } else if(item[i].JM["#cdata-section"] == "0"){
                        JM = true;
                    }else {
						JM=false;
					}
                        if(item[i].GL){
                            if (item[i].GL["#cdata-section"] == '0') {
                                var NR = item[i].NR["#cdata-section"];
                            }
                        }
                        if (!(item[i].GL)) {
                            var NR = item[i].NR["#cdata-section"];
                        }
                        else {
                            var gl,tempGL;
                            if(item[i].GL["#cdata-section"]){
                                tempGL = item[i].GL["#cdata-section"]
                            }else{
                                tempGL = item[i].GL;
                            }
                            switch (tempGL) {
								case "0":
								gl=item[i].NR["#cdata-section"];
								break;
                                case "1":
                                    gl = thisYziD;
                                    break;
                                case "2":
                                    gl = data2;
                                    break;
                                case "3":
                                    gl = data3;
                                    break;
                                case "4":
                                    gl = data4;
                                    break;
                                case "5":
                                    gl = data5;
                                    break;
                                case "6":
                                    gl = data6;
                                    break;
                            }
                            var NR = gl;
                        }

                    //var iv='0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0';
                    var key = '3c837d501a8f49b1';
                    var cryptkey = CryptoJS.enc.Utf8.parse(key);
                    if (JM == true && JMNR == "1") {
                       MC = aesEncrypt(item[i].MC["#cdata-section"], cryptkey);
                        NR = aesEncrypt(NR, cryptkey);
                        //MC = CryptoJS.AES.encrypt(item[i].MC["#cdata-section"],pwd);
                        //NR = CryptoJS.AES.encrypt(NR,pwd);
                        //MC = item[i].MC["#cdata-section"]+'加密';
                        //NR = NR+'加密';
                    } else if (JM == true && JMNR == "2") {
                        MC = aesEncrypt(item[i].MC["#cdata-section"], cryptkey);
                        //MC = CryptoJS.AES.encrypt(item[i].MC["#cdata-section"],pwd);
                        //MC = item[i].MC["#cdata-section"]+'加密';
                    } else if (JM == true && JMNR == "3") {
                        NR = aesEncrypt(NR, cryptkey);
                        //NR = CryptoJS.AES.encrypt(NR,pwd);
                        //NR = NR+'加密';
                    }
                    if (i == item.length - 1) {
                        csText = csText + MC + ZYD + NR;
                    } else {
                        csText = csText + MC + ZYD + NR + SSD;
                    }
                }
                gpUrl = gpUrl + csText;
            }
            return gpUrl;
            //return 'http://192.168.2.45:8080/launch?action=view&DicomRepository=SMIT&AccessionNumber=1158267&username=user&password=user';
            //return 'http://www.baidu.com';
        } else {
            showHide("观片未配置。");
        }
    }

    // 获取接口地址
    function urlFunction() {
        var url = "";
        $.ajax({
            url: "./url.json",
            async: false,
            timeout: 5000,
            type: "get",
            dataType: "json",
            success: function (responseTxt) {
                url = responseTxt.url;
            },
            error: function () {
                errorAjax(urlFunction, []);
            }
        });
        return url;
    }
    var external;
    function externalUrl(reponse) {
        external = reponse;
    }
    function externalAss(thisYziD) {
        localStorage.setItem("zlsoft-externalAss", "");
        localStorage.configArryUrl = '';
        var responseTxt = external;
        var typeArry = [];
        if(responseTxt.result){
            responseTxt.Result = responseTxt.result;
        }
        if (responseTxt.Result.ERROR) {
            console.log(responseTxt.Result.ERROR.MSG)
            // utils.showHide(responseTxt.Result.ERROE.MSG);
        } else if (!$.isEmptyObject(responseTxt.Result.OUTPUT) && responseTxt.Result.OUTPUT.CONFIGLIST != null&&responseTxt.Result.OUTPUT.CONFIGLIST !="") {
            var CONFIG = makeArry(responseTxt.Result.OUTPUT.CONFIGLIST.CONFIG)
            for (var j = 0; j < CONFIG.length; j++) {
                   //存储预交款配置地址
                   if(CONFIG[j].TITLE == '预交款'){
                       localStorage.configArryUrl = CONFIG[j].JK["#cdata-section"];
                   }
                    if(CONFIG[j].TITLE == 'web病案查阅'){
                       localStorage.configDiagUrl = CONFIG[j].JK["#cdata-section"];
                   }
                // }
                // $(CONFIG).each(function(index, el) {
                var parameter = {};
                // 接口地址
                var AssUrl = CONFIG[j].JK["#cdata-section"];
                if (AssUrl === "" || AssUrl === null || AssUrl === undefined || AssUrl === " ") {
                    continue;
                }
                // 参数内容
                var csText = '?';
                // 判断是否加密
                parameter.JMGZ = false;
                if (CONFIG[j].JMGZ["#cdata-section"] == "0") {
                    parameter.JMGZ = true;
                }
                // 对那些值加密 1：参数名和参数值都加密，2：参数名加密，3：参数值加密
                parameter.JMNR = CONFIG[j].JMNR["#cdata-section"];

                //拼接地址的先后顺序
                parameter.PX = CONFIG[j].PX;
                // 获取参数与参数之间的分隔符
                parameter.SSD = CONFIG[j].SSD["#cdata-section"];
                // 参数名和参数值之间的分隔符
                parameter.ZYD = CONFIG[j].ZYD["#cdata-section"];


				/*准备数据 关联属性，1：医嘱id，2：写死zldoc://，3：当前用户名，4：当前病人住院号，5：住院次数（就是主页id），6：病人id
				data7 当前科室id data8 当前操作员吗 */
                var data2 = 'zldoc://';
                var data3 = $("#username").val();
                var data4 = $("#slzyID").text();
                var data5 = $("#slzyID").attr("data-pageid");
                var data6 = $("#slzyID").attr("data-patiid");
                var data7 = localStorage.getItem("zlsoft-userKSPubID");
                var data8 = $("#userInfobox > font").attr("data-userid");

                // 如果有入参
                if(CONFIG[j].LIST){
                    if (CONFIG[j].LIST.ITEM) {
                        var item = CONFIG[j].LIST.ITEM;
                        var paramArry = [];
                        item = makeArry(item);
                        for (var i in item) {
                            var MC = item[i].MC["#cdata-section"];
                            var NR;
                            if (item[i].GL === undefined || item[i].GL === "" || item[i].GL === null || item[i].GL["#cdata-section"] == '0') {
                                NR = item[i].NR["#cdata-section"];
                            } else {
                                var tempGL = '';
                                if(item[i].GL["#cdata-section"]){
                                    tempGL = item[i].GL["#cdata-section"];
                                }else{
                                    tempGL = item[i].GL;
                                }
                                switch (tempGL) {
                                    case "1":
                                        if(!thisYziD || thisYziD == ''){
                                            NR =  item[i].NR["#cdata-section"]
                                        }else{
                                            NR = thisYziD;
                                        }
                                        break;
                                    case "2":
                                        //如果是配置的地址直接读取配置的值
                                        NR =  item[i].NR["#cdata-section"];
                                        // if(!data2 || data2 == ''){
                                        //     NR =  item[i].NR["#cdata-section"]
                                        // }else{
                                        //     NR = data2;
                                        // }
                                        break;
                                    case "3":
                                        if(!data3 || data3 == ''){
                                            NR =  item[i].NR["#cdata-section"]
                                        }else{
                                            NR = data3;
                                        }
                                        break;
                                    case "4":
                                        if(!data4 || data4 == ''){
                                            NR =  item[i].NR["#cdata-section"]
                                        }else{
                                            NR = data4;
                                        }
                                        break;
                                    case "5":
                                        if(!data5 || data5 == ''){
                                            NR =  item[i].NR["#cdata-section"]
                                        }else{
                                            NR = data5;
                                        }
                                        break;
                                    case "6":
                                        if(!data6 || data6 == ''){
                                            NR =  item[i].NR["#cdata-section"]
                                        }else{
                                            NR = data6;
                                        }
                                        break;
                                    case "7":
                                        if(!data7 || data7 == ''){
                                            NR =  item[i].NR["#cdata-section"]
                                        }else{
                                            NR = data7;
                                        }
                                        break;
                                    case "8":
                                        if(!data8 || data8 == ''){
                                            NR =  item[i].NR["#cdata-section"]
                                        }else{
                                            NR = data8;
                                        }
                                        break;
                                }
                                if(item[i].JM){
                                    if (item[i].JM["#cdata-section"] == '0') {
                                        NR = CryptoJS.AES.encrypt(NR, "加密").toString();
                                    }
                                }
                            }
                            var pwd = "加密";
                            /*if (parameter.JMGZ == true && parameter.JMNR == "1") {
                                MC = CryptoJS.AES.encrypt(item[i].MC["#cdata-section"], pwd).toString();
                                NR = CryptoJS.AES.encrypt(NR, pwd).toString();
                            } else if (parameter.JMGZ == true && parameter.JMNR == "2") {
                                MC = CryptoJS.AES.encrypt(item[i].MC["#cdata-section"], pwd).toString();
                            } else if (parameter.JMGZ == true && parameter.JMNR == "3") {
                                NR = CryptoJS.AES.encrypt(NR, pwd).toString();
                            }*/
                            var onePara = {};
                            onePara.MC = MC;
                            onePara.NR = parameter.ZYD + NR;
                            paramArry.push(onePara);
                        }
                        //参数拼接顺序
                        var px = parameter.PX.split(",");
                        $(px).each(function (index, el) {
                            for (var i = 0; i < paramArry.length; i++) {
                                if (el === paramArry[i].MC) {
                                    csText = csText + paramArry[i].MC + paramArry[i].NR;
                                    break;
                                }
                            }
                            if (index !== px.length - 1) {
                                csText = csText + parameter.SSD
                            }
                        })
						if(CONFIG[j].OptionType!="6")
                        {
                        if(AssUrl==localStorage.ruleHistoryStatusLocation&&CONFIG[j].OptionType=="3"){
							//病历三方路径
                        	localStorage.ruleHistoryStatusLocation1=AssUrl + csText;
                        }else if(AssUrl==localStorage.ruleRecordSheetStatusLocation&&CONFIG[j].OptionType=="7"){
							//护理三方路径
							localStorage.ruleRecordSheetStatusLocation1=AssUrl + csText;
						}else if(AssUrl==localStorage.rulePacsStatusLocation&&CONFIG[j].OptionType=="5"){
							//pacs三方路径
							localStorage.rulePacsStatusLocation1=AssUrl + csText;
						}
						//else if(AssUrl==localStorage.rulePacsStatusLocation){
							//localStorage.rulePacsStatusLocation=AssUrl + csText;
						//}
                        }else  if(CONFIG[j].OptionType=="6"){
                        	AssUrl = AssUrl + csText;
                        }
						
                    }
                }
				if(CONFIG[j].OptionType=="6"){
                var type1 = {};
                type1.URL = AssUrl;
                type1.TITLE = CONFIG[j].TITLE;
                type1.TYPE = CONFIG[j].TYPE;
                typeArry.push(type1);
                        }
				
				
            }
			//CONFIG.forEach(function(vale1,arry){
        	//if(vale1.JK["#cdata-section"]=localStorage.ruleHistoryStatusLocation){
        		//localStorage.ruleHistoryStatusLocation=typeArry[arry].URL;
        	//}
        	//if(vale1.JK["#cdata-section"]=localStorage.ruleRecordSheetStatus){
        		//localStorage.ruleRecordSheetStatus=typeArry[arry].URL;
        	//}
        	//if(vale1.JK["#cdata-section"]=localStorage.rulePacsStatus){
        		//localStorage.rulePacsStatus=typeArry[arry].URL;
        	//}
        	//if(vale1.JK["#cdata-section"]=localStorage.rulePacsStatusLocation){
        		//localStorage.rulePacsStatusLocation=typeArry[arry].URL;
        	//}});
			
        } else {
            // utils.showHide(responseTxt.Result.ERROE.MSG);
            console.log("没有外部系统")
        }
		
        return typeArry;
    }

    // 超时秒数
    function timeoutSec() {
        return 30000;
    }

    // 公共提示 点击确定
    hammertiShiQueDing = $("#tiShiQueDing").hammer();
    hammertiShiQueDing.on('tap', function (ev) {
        $("#promptQDQX").hide();
    });

    // 公共提示函数
    function alertPrompt(massage, icon, button) {
        $("#promptQDQX").show();
        $("#promptChild span").hide();
        $("#tiShiQueDing").hide();
        $("#tiShiYes").hide();
        $("#tiShiNo").hide();
        switch (icon) {
            case "yes":
                $("#promptChild .color-lv").show();
                break;
            case "no":
                $("#promptChild .color-hong").show();
                break;
            case "gantan":
                $("#promptChild .color-cheng").show();
                break;
        }
        switch (button) {
            case "qdqx":
                $("#yesNoBox").show();
                $("#tiShiYes").text("是").show();
                $("#tiShiNo").text("否").show();
                break;
            case "qdBig":
                $("#yesNoBox").hide();
                $("#tiShiQueDing").show();
                break;
            case "csfh":
                $("#yesNoBox").show();
                $("#tiShiYes").text("重试").show();
                $("#tiShiNo").text("取消").show();
                break;
        }
        $("#promptChild p").text(massage);
    }

    // 弹出层返回函数
    hammertiShiYes = $("#tiShiYes").hammer();
    hammertiShiNo = $("#tiShiNo").hammer();

    function myconfirm(func, cancel_callback) {

        hammertiShiYes.unbind();
        hammertiShiNo.unbind();

        //if (typeof(func) == 'function'){ 
        hammertiShiYes.on("tap", func);
        //}
        //if (typeof(cancel_callback) == 'function'){
        hammertiShiNo.on("tap", cancel_callback);
        //}
    }

    // 分解时间方案函数
    function timePlanFJ(str) {
        var SiMi = str.split(",");
        var fjjg = { srday: [], srtime: [], mrday: [], mrtime: [] };
        var srDayTime = [];
        var mrDayTime = [];

        // 如果有首日
        if (SiMi.length > 1) {

            // 提取首日的day和time
            srDayTime = fenJieFunction(SiMi[0]);
            for (var srdt = 0; srdt < srDayTime.time.length; srdt++) {
                fjjg.srtime.push(srDayTime.time[srdt]);
            }
            for (var srdt = 0; srdt < srDayTime.day.length; srdt++) {
                fjjg.srday.push(srDayTime.day[srdt]);
            }

            // 提取每日的day和time
            mrDayTime = fenJieFunction(SiMi[1]);
            for (var mrdt = 0; mrdt < mrDayTime.time.length; mrdt++) {
                fjjg.mrtime.push(mrDayTime.time[mrdt]);
            }
            for (var mrdt = 0; mrdt < mrDayTime.day.length; mrdt++) {
                fjjg.mrday.push(mrDayTime.day[mrdt]);
            }

        } else {

            // 提取每日的day和time
            mrDayTime = fenJieFunction(SiMi[0]);
            for (var mrdt = 0; mrdt < mrDayTime.time.length; mrdt++) {
                fjjg.mrtime.push(mrDayTime.time[mrdt]);
            }
            for (var mrdt = 0; mrdt < mrDayTime.day.length; mrdt++) {
                fjjg.mrday.push(mrDayTime.day[mrdt]);
            }

        }

        // 分解函数 按 - 分解
        function fenJieFunction(strr) {
            var pinCi = strr.split("-");
            var fjjgg = { day: [], time: [] };
            for (var pci = 0; pci < pinCi.length; pci++) {
                if (pinCi[pci].indexOf("/") != -1) {
                    var pc = pinCi[pci].split("/");
                    fjjgg.day.push(pc[0]);
                    fjjgg.time.push(pc[1]);
                } else {
                    fjjgg.time.push(pinCi[pci]);
                }
            }
            return fjjgg;
        }

        return fjjg;
    }

    // 清空时间方案控件 输入结果
    function emptyTimePlanJG() {
        if ($("#timePlan .timeJG").text().indexOf("/") != -1) {
            $("#timePlan .timeJG").text("_/__:__");
        } else {
            $("#timePlan .timeJG").text("__:__");
        }
    }


    // 遍历检查每日首日是否录入完毕 之前使用的检查
	/*function eachMRSR(){
		var labelLength = 0;
		$("#timePlan ul li").each(function(){
			if( ($(this).find(".day").length>0 && $(this).find(".day").text()!="_") || ( $(this).find(".time").length>0 && $(this).find(".time").text()!="__:__") ){
				labelLength=labelLength+1;
			}
		});
		return labelLength;
	}*/
    function eachMRSR() { //改变后的 首日必填 每日不是必填
        var labelLength = 0;
        $("#timePlan_MRUL li").each(function () {    //每日录入完毕 首日没有录入  或者每日 首日 都录如完毕
            if (($(this).find(".day").length > 0 && $(this).find(".day").text() != "_") || ($(this).find(".time").length > 0 && $(this).find(".time").text() != "__:__")) {
                labelLength = labelLength + 1;
            }
        });
        if ($("#timePlan_SRUL li label").length === 0) {
            labelLength = labelLength + $("#timePlan_SRUL li").length;
        } else {
            $("#timePlan_SRUL li").each(function () {
                if (($(this).find(".day").length > 0 && $(this).find(".day").text() != "_") || ($(this).find(".time").length > 0 && $(this).find(".time").text() != "__:__")) {
                    labelLength = labelLength + 1;
                }
            });
        }

        return labelLength;
    }

    // 查找必填医嘱是否录入完毕
    function eachDoctorActive() {
        var lrsl = 0;  // 录入数量
        var yssl = 0;  // 原始数量 必填的数量
        var sl = [];
        $("#yzxdYaoNR li").each(function () {
            if ($(this).is(":visible") && $(this).find(".text-xh").length > 0 && !$(this).find("span").hasClass("text-red")) {
                lrsl = lrsl + 1;
            }
            if ($(this).is(":visible") && $(this).find(".text-xh").length > 0) {
                yssl = yssl + 1;
            }
        });
        sl.push(lrsl);
        sl.push(yssl);
        return sl;
    }

	/* 录入医嘱，自动弹出下一个录入项
	function nextLr(thisLiEq){
		for(var i=thisLiEq+1;i<$("#yzxdYaoNR li").length;i++){
			if((!$("#yzxdYaoNR li").eq(i).is(":hidden")) && $("#yzxdYaoNR li").eq(i).find(".text-xh").length>0){
				$("#yzxdYaoNR li").css("background","#fff");
				$("#yzxdYaoNR li").eq(i).css("background","rgb(223, 251, 251)");
				$("#yzxdKongJian").hide();
				
				if($("#yzxdYaoNR li").eq(i).hasClass("sqfx")){
					
				}else{
					var nextText = $("#yzxdYaoNR li").eq(i).find(".UlBt").text();
					switch(nextText){
						case"给药途径":
							break;
						case"采集方法":
							break;
						case"执行频率":
							break;
						case"时间方案":
							break;
						case"单量":
							break;
						case"天数":
							break;
						case"总量":
							break;
						case"给药执行":
							break;
					}
				}
				break;
			}
		}
	}*/

    //透明小弹出层
    function hideBack() {
        $("#successBack").fadeOut();
    }
    function showHide(text) {
        // 更新文字
        $(".successText").text(text);
        $("#successBack").show();
        $(".successContain").addClass("animated fadeIn");

        // 计算居中的距离
        var bodyWidth = $(window).width();
        var bodyHeight = $(window).height();
        var divWidth = $("#successBack>.successContain").outerWidth();
        var divHeight = $("#successBack>.successContain").outerHeight();
        var leftWidth = (bodyWidth - divWidth) / 2;
        var topWidth = (bodyHeight - divHeight) / 2;
        $("#successBack>.successContain").css("margin-left", leftWidth).css("margin-top", topWidth);

        // 隐藏
        setTimeout(hideBack, 2000);
    }

    //PDF初始化 ----------------------------------------------
    function showPage(num, pdf, pdfID, pdfWidth) {
        //var bodyDiv = document.getElementById(pdfID);
        var bodyDiv = $("#" + pdfID);
        return pdf.getPage(num).then(function (page) {
            var bodyWidth = $(window).width();
            if (pdfWidth !== undefined && pdfWidth > 11904) {
                var desiredWidth = pdfWidth * 0.075;
                $("#" + pdfID).append('<div style="width:100%;height:100%;overflow:auto;"></div>');
                bodyDiv = $("#" + pdfID + ">div");
            } else {
                var desiredWidth = bodyWidth - 195;
            }
            var viewport = page.getViewport(1);
            var scale = desiredWidth / viewport.width;
            var scaledViewport = page.getViewport(scale);

            var canvas = document.createElement('canvas');
            var id = pdfID + '-' + num + '-page';
            canvas.id = id;
            bodyDiv.append(canvas);
            //canvas = document.getElementById(id);
            var context = canvas.getContext('2d');
            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;

            var renderContext = {
                canvasContext: context,
                viewport: scaledViewport
            };
            page.render(renderContext);
        });
    }

    function showAllPage(num, total, pdf, pdfID, pdfWidth) {
        if (num < total + 1) {
            showPage(num, pdf, pdfID, pdfWidth).then(function () {
                showAllPage(num + 1, total, pdf, pdfID, pdfWidth)
            });
        }
    }
    //PDF初始化 ----------------------------------------------/

    // 医嘱状态 文字颜色变更公共函数
    function colorCompute(color) {
        var a = [];
        a[0] = parseInt(color % 256);
        a[1] = parseInt((color % 65536) / 256);
        a[2] = parseInt(color / 65536);
        var b;
        b = 'rgb(' + a[0] + ',' + a[1] + ',' + a[2] + ')';
        return b;
    }

    // 分割检查方法
    function jianChaFFArry(tr) {
        dataAll = []; radiotype = []; checkbox = []; data = {};
        //先替换空格
        tr = tr.replace(/\s/g, '&T');
        //替换分号
        tr = tr.replace(/;/g, '&;');
        attr = tr.split("&");
        for (var i in attr) {
            //普通的以空格分离
            if (attr[i].substring(0, 1) == 'T') {
                attr[i] = attr[i].substr(1);
                if (attr[i] != '') {
                    checkbox.push(attr[i]);
                }
            } else {
                //互斥项
                if (attr[i] != '') {
                    radiotype.push(attr[i]);
                }
            }
        }
        //attr=tr.split("	");
        //if(attr[0]){
        //	radiotype.push(attr[0]);
        //}
        //if(attr[1]){
        //	checkbox.push(attr[1]);
        //}
        for (var i = 0; i < radiotype.length; i++) {
            var radioData = radiotype[i].split(";");
            for (var j = 0; j < radioData.length; j++) {
                var radioChiren = radioData[j].split(",");
                data['name'] = radioChiren[0].substr(1);
                data["option"] = "radio";
                data["children"] = [];
                for (k = 1; k < radioChiren.length; k++) {
                    data["children"].push(radioChiren[k].substr(1));
                }
                if (data.name != '') {
                    dataAll.push(data);
                }
                data = {};
            }
        }
        if (checkbox) {
            for (var i = 0; i < checkbox.length; i++) {
                var checkboxData = checkbox[i].split(";");
                for (var j = 0; j < checkboxData.length; j++) {
                    var checkboxChiren = checkboxData[j].split(",");
                    data['name'] = checkboxChiren[0].substr(1);
                    data["option"] = "Mutil";
                    data["children"] = [];
                    for (k = 1; k < checkboxChiren.length; k++) {
                        data["children"].push(checkboxChiren[k].substr(1));
                    }
                    if (data.name != '') {
                        dataAll.push(data);
                    }
                    data = {};
                }
            }
        }
        return dataAll;
    }

    // 删除检查项目  	
    function yzxdDellJCXM(thisID) {
        if ($("#nrJCXM li").length > 1) {
            thisID.remove();
            if ($("#nrJCXM").find("li").length <= 0) {
                $("#yzxdTwoJi p").text("未选择检查部位").addClass("text-red").show();
            }
            $("#yzxdJCFF").hide();
        } else {
            showHide("不能没有检查部位");
        }
    }

    // 选择检查方法
    function yzxdSelFF(thisID) {
        $("#yzxdYaoNR li").css("background", "#fff");
        $("#nrJCXM li").removeClass("active");
        thisID.addClass("active");
        $(".yzxdKongJian").hide();

        $("#yzxdJCFF").show();

        // 分解检查方法
        var str = thisID.attr("name");
        debugger;
        var JCFFarry = jianChaFFArry(str);

        $("#yzxdJCFF ul").empty("li");
        // 追加检查方法
        var eqi = 0;  // 循环选中未选中字符串的索引
        for (var i = 0; i < JCFFarry.length; i++) {

            var xzjg = activeStr();
            // 单选
            if (JCFFarry[i].option == "radio") {
                if (xzjg == "中") {
                    $("#yzxdJCFF>ul").append('<li><div class="Oneline"><span class="fs1 yes danx" aria-hidden="true" data-icon=""></span> <span>' + JCFFarry[i].name + '</span></div></li>');
                } else {
                    $("#yzxdJCFF>ul").append('<li><div class="Oneline"><span class="fs1 no danx" aria-hidden="true" data-icon=""></span> <span>' + JCFFarry[i].name + '</span></div></li>');
                }
                // 多选
            } else {
                if (xzjg == "中") {
                    $("#yzxdJCFF>ul").append('<li><div class="Oneline"><span class="fs1 yes duox" aria-hidden="true" data-icon=""></span> <span>' + JCFFarry[i].name + '</span></div></li>');
                } else {
                    $("#yzxdJCFF>ul").append('<li><div class="Oneline"><span class="fs1 no duox" aria-hidden="true" data-icon=""></span> <span>' + JCFFarry[i].name + '</span></div></li>');
                }
            }
            eqi++;
            // 追加子级
            if (JCFFarry[i].children.length > 0) {
                $("#yzxdJCFF>ul>li").eq(i).append("<ul></ul>");
                for (var ii = 0; ii < JCFFarry[i].children.length; ii++) {
                    var xzjgg = activeStr();
                    if (xzjgg == "中") {
                        $("#yzxdJCFF>ul>li").eq(i).find("ul").append('<li><span class="fs1 yes" aria-hidden="true" data-icon=""></span> <span>' + JCFFarry[i].children[ii] + '</span></li>');
                    } else {
                        $("#yzxdJCFF>ul>li").eq(i).find("ul").append('<li><span class="fs1 no" aria-hidden="true" data-icon=""></span> <span>' + JCFFarry[i].children[ii] + '</span></li>');
                    }
                    eqi++;
                }
            }

        }

        function activeStr() {
            var activeString = "";
            activeString = $("#nrJCXM .active .min").attr("name");
            if (activeString !== "" && activeString !== undefined) {
                return activeString[eqi];
            }
        }



        // 注册事件
        hammerJCFFone = $("#yzxdJCFF .jcffBox li .Oneline").hammer();
        hammerJCFFone.on("tap", function () {
            JCFFone($(this));
        });
        hammerJCFFtwo = $("#yzxdJCFF .jcffBox>li ul li").hammer();
        hammerJCFFtwo.on("tap", function () {
            JCFFtwo($(this));
        });


    }

    // 更新检查方法 一级
    function JCFFone(thisID) {

        // 如果是单选未选中 则选中
        if (thisID.find(".fs1").hasClass("danx") && thisID.find(".fs1").hasClass("no")) {

            // 如果同级有单选，则同级单选未选中
            thisID.parent().parent().find(".danx").attr("data-icon", "").removeClass("yes").addClass("no");
            // 同级单选子集未选中
            releaseChildren(thisID.parent().parent().find(".danx").parent());

            thisID.find(".fs1").attr("data-icon", "").removeClass("no").addClass("yes");



            // 如果是单选选中 则未选中
        } else if (thisID.find(".fs1").hasClass("danx") && thisID.find(".fs1").hasClass("yes")) {

            thisID.find(".fs1").attr("data-icon", "").removeClass("yes").addClass("no");
            releaseChildren(thisID);



            // 如果是复选未选中 则选中
        } else if (thisID.find(".fs1").hasClass("duox") && thisID.find(".fs1").hasClass("no")) {
            thisID.find(".fs1").attr("data-icon", "").removeClass("no").addClass("yes");

            // 如果是复选选中 则未选中
        } else if (thisID.find(".fs1").hasClass("duox") && thisID.find(".fs1").hasClass("yes")) {
            thisID.find(".fs1").attr("data-icon", "").removeClass("yes").addClass("no");
            releaseChildren(thisID);
        }

        // 释放子集
        function releaseChildren(thisIDd) {
            thisIDd.next().find(".fs1").attr("data-icon", "").removeClass("yes").addClass("no");
        }

        JCFFdata();

    }

    // 更新检查方法 二级
    function JCFFtwo(thisIDD) {
        // 如果上一级已选中
        if (thisIDD.parent().prev().find(".fs1").hasClass("yes")) {
            // 如果选中 则未选中
            if (thisIDD.find(".fs1").hasClass("yes")) {
                thisIDD.find(".fs1").attr("data-icon", "").removeClass("yes").addClass("no");
                // 如果未选中 则选中
            } else if (thisIDD.find(".fs1").hasClass("no")) {
                thisIDD.find(".fs1").attr("data-icon", "").removeClass("no").addClass("yes");
            }
        }
        JCFFdata();
    }

    // 更新检查方法显示数据
    function JCFFdata() {
        var JCFFstr = "";
        var JCFFdanduo = "";

        // 循环记录选中顺序
        for (var xx = 0; xx < $("#yzxdJCFF .jcffBox>li .fs1").length; xx++) {
            if ($("#yzxdJCFF .jcffBox>li .fs1").eq(xx).hasClass("yes")) {
                JCFFdanduo = JCFFdanduo + "中";
            } else {
                JCFFdanduo = JCFFdanduo + "未";
            }
        }

        for (var i = 0; i < $("#yzxdJCFF .jcffBox>li>.Oneline>.yes").length; i++) {

            JCFFstr = JCFFstr + $("#yzxdJCFF .jcffBox>li>.Oneline>.yes").eq(i).next().text();

            for (var ii = 0; ii < $("#yzxdJCFF .jcffBox>li>.Oneline>.yes").eq(i).parent().next().find(".yes").length; ii++) {

                // 如果是第一个也是最后一个 要追加 ()
                if (ii == 0 && ii == $("#yzxdJCFF .jcffBox>li>.Oneline>.yes").eq(i).parent().next().find(".yes").length - 1) {
                    JCFFstr = JCFFstr + ',' + $("#yzxdJCFF .jcffBox>li>.Oneline>.yes").eq(i).parent().next().find(".yes").eq(ii).next().text() + '';

                    //如果是二级第一个 要追加个(
                } else if (ii == 0) {
                    JCFFstr = JCFFstr + ',' + $("#yzxdJCFF .jcffBox>li>.Oneline>.yes").eq(i).parent().next().find(".yes").eq(ii).next().text() + ',';

                    // 如果是二级最后一个 要追加个)
                } else if (ii == $("#yzxdJCFF .jcffBox>li>.Oneline>.yes").eq(i).parent().next().find(".yes").length - 1) {
                    JCFFstr = JCFFstr + $("#yzxdJCFF .jcffBox>li>.Oneline>.yes").eq(i).parent().next().find(".yes").eq(ii).next().text();
                } else {
                    JCFFstr = JCFFstr + $("#yzxdJCFF .jcffBox>li>.Oneline>.yes").eq(i).parent().next().find(".yes").eq(ii).next().text() + ',';
                }

            }

            // 如果不是最后一个 则加,
            if (i !== $("#yzxdJCFF .jcffBox>li>.Oneline>.yes").length - 1) {
                JCFFstr = JCFFstr + ',';
            }
        }
        if (JCFFstr == "") {
            $("#nrJCXM .active .min").removeClass("text-lv").addClass("text-red").attr("name", "").text("请选择方法");
        } else {
            $("#nrJCXM .active .min").removeClass("text-red").addClass("text-lv").attr("name", JCFFdanduo).text(JCFFstr);
        }
    }

    // 获取当前时间
    function todayNow() {
        var day = new Date();
        var y = day.getFullYear();
        var m = day.getMonth() + 1;
        var d = day.getDate()
        var h = day.getHours();
        var s = day.getMinutes();
        var nowTime = y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + (h < 10 ? "0" + h : h) + ":" + (s < 10 ? "0" + s : s);
        return nowTime;
    }

    // 医嘱 计算总量
    function calculateTotal() {
        // 如果总量和单量都显示的情况下才执行
        if (!$("#Milligram").is(":hidden") && !$("#total").is(":hidden")) {
            var zl_Count = 0;
            var gyzcs = 0;
            var mczl = 0;
            var zybz = 1;
            var ts = 1;
            var jlxs = 1;
            var dl = $("#Milligram span").text();
            var jgdw = $("#executeHz span").attr("data-jgdw");
            var pljg = $("#executeHz span").attr("data-pljg");
            var syfw = $("#executeHz span").attr("data-syfw");
            var plcs = $("#executeHz span").attr("data-plcs");
            var flsx = $("#yzxdTwoJiHeight").attr("data-flsx");

            if ($("#Milligram span").attr("id").replace("zybzjlxs", "") !== "" && $("#Milligram span").attr("id").replace("zybzjlxs", "") !== "NaN" && $("#Milligram span").attr("id").replace("zybzjlxs", "") !== "undefined") {
                jlxs = $("#Milligram span").attr("id").replace("zybzjlxs", "");
            }
            if ($("#NumberOfDays span").text() !== "") {
                var ts = $("#NumberOfDays span").text();
            }
            if ($("#yzxdTwoJiHeight").attr("data-zybz") !== "") {
                zybz = $("#yzxdTwoJiHeight").attr("data-zybz");
            }

            if (flsx == "" || flsx == "0" || flsx == "1" || flsx == "2") {

                // 不可设置天数的情况下
                if ($("#NumberOfDays").is(":hidden") && (syfw !== 1 && syfw !== "1")) {
                    zl_Count = dl / jlxs / zybz;
                } else {
                    calculate_jgdw();
                }

                if (flsx == "" || flsx == "1" || flsx == "2") {
                    zl_Count = Math.ceil(zl_Count);
                } else {
                    if (zl_Count.toString().length > 7) {
                        zl_Count = zl_Count.toFixed(5);
                    }
                }

                // 更新总量
                if (zl_Count > 0) {
                    $("#total span").text(zl_Count).removeClass("text-red");
                }

            } else {
                $("#total span").text(0).addClass("text-red");
            }

            // 根据间隔单位 统一计算
            function calculate_jgdw() {
                if (jgdw == "天") {
                    //给药总次数=频率次数/频率间隔*天数 （向上取整）
                    //每次总量=单量/剂量系数
                    //总量=每次总量*给药总次数
                    gyzcs = plcs / pljg * ts;
                    mczl = dl / jlxs;
                    zl_Count = mczl * Math.ceil(gyzcs) / zybz;
                } else if (jgdw == "小时") {
                    //给药总次数=24/频率间隔*天数
                    //每次总量=单量/剂量系数
                    //总量=每次总量*给药总次数
                    gyzcs = 24 / pljg * ts;
                    mczl = dl / jlxs;
                    zl_Count = mczl * Math.ceil(gyzcs) / zybz;
                }
            }
        }
    }

    // 判断医嘱编辑功能是否显示
    function yiZhuEditFunction() {
        if ($("#slzyID").attr("data-pageid") < $("#dengjiUlStyle ul li").length) {
            $("#yzButtonBox").hide();
        } else {
            $("#yzButtonBox").show();
            $("#yzButtonBox>div").hide();
            $("#yzButtonEditOne").text("编辑").show();  // 医嘱编辑按钮 
        }
    }

    // 检查部位 匹配 已选项 生出中未字符串 // tr:所有选项  shortTr:选中选项
    function charpipei(tr, shortTr) {
        //长字符分割
        var yiji = [], resoult = "", newArry = [];
        var attr = tr.split("	");
        for (var i = 0; i < attr.length; i++) {
            var yiData = attr[i].split(";");
            for (var j = 0; j < yiData.length; j++) {
                var erChiren = yiData[j].split(",")
                yiji.push(erChiren[0]);
                for (k = 1; k < erChiren.length; k++) {
                    yiji.push(erChiren[k]);
                }
            }
        }
        for (var i = 0; i < yiji.length; i++) {
            if (yiji[i].indexOf(0) != -1) {
                var jian = yiji[i].replace(0, "");
                newArry.push(jian);
            } else if (yiji[i].indexOf(1) != -1) {
                var jian = yiji[i].replace(1, "")
                newArry.push(jian);
            } else {
                newArry.push(yiji[i]);
            }
        }
        //短字符分割
        var yi = [];
        var art = shortTr.split("；");
        for (var i = 0; i < art.length; i++) {
            if (art[i].indexOf("（") != -1 && art[i].indexOf("）") != -1) {
                var qkh = art[i].replace("）", "")
                var has = qkh.split("（");
                yi.push(has[0]);
                var dhf = has[1].split("，");
                for (var j = 0; j < dhf.length; j++) {
                    yi.push(dhf[j]);
                }
            } else {
                yi.push(art[i])
            }
        }
        //匹配
        var n = 0;
        for (var i = 0; i < newArry.length; i++) {
            for (var j = 0; j < yi.length; j++) {
                if (newArry[i] == yi[j]) {
                    n++;
                }
            }
            if (n == 1) {
                resoult = resoult + "中";
                n = 0;
            } else {
                resoult = resoult + "未";
            }
        }
        return resoult;

    }

    // ajax错误提示
    function errorAjax(status, functionName, data) {
        if (status == "timeout") {
            $("#LoadedTip").hide();
            alertPrompt("加载超时", "gantan", "csfh");
            myconfirm(csFunction, exitOut);
        } else if (status == "error") {
            $("#LoadedTip").hide();
            alertPrompt("加载出错", "gantan", "csfh");
            myconfirm(csFunction, exitOut);
        } else if (status == "notmodified" || status == "parsererror") {
            $("#LoadedTip").hide();
            alertPrompt(status, "gantan", "csfh");
            myconfirm(csFunction, exitOut);
        }
        // 重试
        function csFunction() {
            $("#promptQDQX").hide();
            if (data.length == 0)
                functionName();
            else if (data.length == 1)
                functionName(data[0]);
            else if (data.length == 2)
                functionName(data[0], data[1]);
            else if (data.length == 3)
                functionName(data[0], data[1], data[2]);
            else if (data.length == 4)
                functionName(data[0], data[1], data[2], data[3]);
            else if (data.length == 5)
                functionName(data[0], data[1], data[2], data[3], data[4]);
            else if (data.length == 6)
                functionName(data[0], data[1], data[2], data[3], data[4], data[5]);
            else if (data.length == 7)
                functionName(data[0], data[1], data[2], data[3], data[4], data[5], data[6]);
        }
        // 退出 
        function exitOut() {
            $("#promptQDQX").hide();
            // $("#loginBox").show();
            // $("#mainNavMin ul li").removeClass("jinyong active");
            $("#LoadedTip").hide();
        }
    }

    // 放大缩小 初始化
    function CSHpanzoom(pdfBox) {  // pdfBox 要放大缩小的DOM的ID名字 如 "abc"
        // start 添加的放大缩小 目前仅支持两个手指
        // var pdfWrapper = document.getElementById(pdfBox);
        // var len;
        // pdfWrapper.addEventListener('touchstart', function(e){
        //     if(e.touches.length >= 2){
        //         var x = e.touches[0].pageX - e.touches[1].pageX;
        //         var y = e.touches[0].pageY - e.touches[1].pageY;
        //         len = parseInt(Math.sqrt(x*x + y*y));
        //     }else{
        //         return false;
        //     }
        // }, false)

        // pdfWrapper.addEventListener('touchmove', function(e){
        //     if(e.touches.length >= 2){
        //         e.preventDefault(); //阻止滚动
        //         var x = e.touches[0].pageX - e.touches[1].pageX;
        //         var y = e.touches[0].pageY - e.touches[1].pageY;
        //         var newLen = parseInt(Math.sqrt(x*x + y*y));
        //         var scale = (newLen - len)/len;
        //         len = newLen;
        //         $('#' + pdfBox).children().width($('#' + pdfBox).children().width()*(1+scale))
        //     }else{
        //         return false;
        //     }
        // }, false)
        // return false;	
        // end 添加的放大缩小
        var test = document.getElementById(pdfBox);
        var hammerxml = new Hammer(test);

        // 加的代码
        test.addEventListener('touchstart', function (e) {
            var fingersDown = e.touches.length;
            if (fingersDown > 1) {
                toggleHammerScrolling(true);
            }
        });
        test.addEventListener('touchend', function (e) {
            toggleHammerScrolling(false);
        });
        function toggleHammerScrolling(shouldScroll) {
            hammerxml.get('pinch').set({
                enable: shouldScroll
            });
        }
        hammerxml.on('pinchin', inScale);
        hammerxml.on('pinchout', outScale);

        var $panzoom = $("#" + pdfBox).panzoom();
        function inScale() {
            //console.log("in");
            $panzoom.panzoom('zoom', true, {   // true:缩小 false：放大
                startTransform: 'scale(1.1)',
                increment: 0.1,
                minScale: 1
                //contain:'invert'
            });
        }

        function outScale() {
            //console.log("out");
            test.panzoom('zoom', false, {
                startTransform: 'scale(1.1)',
                increment: 0.1,
                maxScale: 5
                //contain:'invert'
            });
        }
    }

    // 动画示意
    function CpStart(idName) {
        $(idName).css("background", "#dcedec");
    }
    function CpEnd(idName) {
        $(idName).removeAttr("style");
    }
    //背景为黑色是动画示意
    function CpStartback(idName) {
        $(idName).css("background", "#51525d");
    }
    //医嘱下达 触碰示意
    function docActLiTouch() {
        $("#yzxdYaoNR li").removeClass("touchYes");
        $("#yzxdYaoNR li").each(function () {
            if ((!$(this).is(":hidden")) && $(this).hasClass("eventQY")) {
                $(this).addClass("touchYes");
            }
        });
        $("#yzxdYaoNR li").on("touchstart touchmove", function () {
            if ($(this).hasClass("touchYes")) {
                $(this).css("background", "#dcedec");
            }
        })
        $("#yzxdYaoNR li").on("touchend", function () {
            if ($(this).hasClass("touchYes")) {
                $(this).removeAttr("style");
            }
        })

    }
    //计算当前星期几  getMyDay(new Date(2016-09-18))
    function getMyDay(date) {
        var week;
        if (date.getDay() == 0) week = "星期天";
        if (date.getDay() == 1) week = "星期一";
        if (date.getDay() == 2) week = "星期二";
        if (date.getDay() == 3) week = "星期三";
        if (date.getDay() == 4) week = "星期四";
        if (date.getDay() == 5) week = "星期五";
        if (date.getDay() == 6) week = "星期六";
        return week;
    }


    // 获取前一天的日期
    function getPrevDay(date, days) {
        var now = new Date(date);
        if (days >= 1) { now = new Date(now.getTime() - 86400000 * days); }
        var yyyy = now.getFullYear(), mm = (now.getMonth() + 1).toString(), dd = now.getDate().toString();
        if (mm.length == 1) { mm = '0' + mm; } if (dd.length == 1) { dd = '0' + dd; }
        return (yyyy + '-' + mm + '-' + dd);
    }

    // 获取后一天的日期
    function getNextDay(date) {
        d = new Date(date);
        d = +d + 1000 * 60 * 60 * 24;
        d = new Date(d);
        //return d;
        //格式化
        return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    }

    // 日期相减返回天数
    function dateJian(min, max) {
        var sArr = min.split("-");
        var eArr = max.split("-");
        var sRDate = new Date(sArr[0], sArr[1], sArr[2]);
        var eRDate = new Date(eArr[0], eArr[1], eArr[2]);
        var result = (eRDate - sRDate) / (24 * 60 * 60 * 1000);
        return result;
    }

    // 计算两根线的交叉点
    function segmentsIntr(a, b, c, d) {
        /** 1 解线性方程组, 求线段交点. **/
        // 如果分母为0 则平行或共线, 不相交
        var denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
        if (denominator == 0) {
            return "no";
        }

        // 线段所在直线的交点坐标 (x , y)
        var x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y)
            + (b.y - a.y) * (d.x - c.x) * a.x
            - (d.y - c.y) * (b.x - a.x) * c.x) / denominator;
        var y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x)
            + (b.x - a.x) * (d.y - c.y) * a.y
            - (d.x - c.x) * (b.y - a.y) * c.y) / denominator;

        /** 2 判断交点是否在两条线段上 **/
        if (
            // 交点在线段1上
            (x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0
            // 且交点也在线段2上
            && (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0
        ) {

            // 返回交点p
            return {
                x: x,
                y: y
            }
        }
        //否则不相交
        return "no";
    }

    // 判断两个日期是否在一个月之内 入参必须为“2011-05-06”此类格式字符串
    function mouthDays(date1, date2) {
        //debugger;
        if (Date(date1) > Date(date2)) {
            var dateMax = date1;
            var dateMin = date2;
        } else {
            var dateMax = date2;
            var dateMin = date1;
        }

        var jg;
        var nianMax = dateMax.split("-")[0], nianMin = dateMin.split("-")[0];
        var yueMax = dateMax.split("-")[1], yueMin = dateMin.split("-")[1];
        var riMax = dateMax.split("-")[2], riMin = dateMin.split("-")[2];
        // 如果完全一致
        if (dateMax == dateMin) {
            jg = true;
            // 如果年月一致
        } else if (nianMax == nianMin && yueMax == yueMin) {
            jg = true;
            // 如果年不一致
        } else if (nianMax !== nianMin) {
            jg = false;
            // 如果年一致，但月相差大于1
        } else if (nianMax == nianMin && yueMax - yueMin > 1) {
            jg = false;
            // 如果年一致，月相差1个月
        } else if (nianMax == nianMin && yueMax - yueMin == 1) {
            if (riMin <= riMax) {
                jg = true;
            } else {
                jg = false;
            }
        }
        return jg;
    }

    // 点击声音播放
    function audioPlay() {

        var el = $("#audio1").get(0);
        if (!el.ended) {
            el.currentTime = 0;
        }
        el.play();
        // setTimeout(function(){
        // 	$("#audio"+domId).remove();
        // }, 1000);   //三秒

        // var body = $('#audioBody');
        // if($(body).find("audio").length==0){
        // 	var domId = 0;
        // }else{
        // 	var domId = parseInt($(body).find("audio:last").attr("id").replace("audio",""));
        // 	domId = domId+1;
        // }
        // var addAudio = '<audio id="audio'+domId+'" controls="controls" preload="auto"><source  id="ma3name" src="mp3/click.mp3"></audio>';		
        // body.append(addAudio);
        // $("#audio"+domId).get(0).play();
        // setTimeout(function(){
        // 	$("#audio"+domId).remove();
        // }, 5000);   //三秒
    }

    // 给iframe追加一个框 针对IOS
    var iframeAddBox = function (iFrame) {
        debugger;
        if (!navigator.userAgent.match(/iPad|iPhone/i)) {
            $("#LoadedTip").hide();
            return false;
        }
        $(iFrame).load(function () {
            if (!jQuery(iFrame).contents()[0].body) {
                $("#LoadedTip").hide();
                return false;
            }
            var iframeNr = jQuery(iFrame).contents()[0].body.children;
            var rq = '<div class="ifrZlHisBox" style="width:100%; height:100%; overflow:auto;"></div>';
            //jQuery(iFrame).contents()[0].body.innerHTML='';
            $(rq).appendTo(jQuery(iFrame).contents()[0].body);
            $(iframeNr).each(function () {
                if (this.nodeName == 'SCRIPT' || this.className.indexOf('ifrZlHisBox') !== -1)
                    return true;
                jQuery(iFrame).contents()[0].body.children[jQuery(iFrame).contents()[0].body.children.length - 1].append($(this)[0]);
                //$(this).remove();
            });
            $(iframeNr).each(function () {
                if (this.nodeName == 'SCRIPT' || this.className.indexOf('ifrZlHisBox') !== -1)
                    return true;
                $(this).remove();
            });
            $("#LoadedTip").hide();
        });
    }

    // 滑动弹出层的时候阻止底层滑动 针对IOS 
    function stopScroll(popUp, popDown) {
        if (!navigator.userAgent.match(/iPad|iPhone/i)) {
            return false;
        }
        // $(popUp).unbind("touchstart touchend");
        // $(popUp).on("touchstart",function(){
        // 	$(popDown).css("overflow","hidden");
        // });
        // $(popUp).on("touchend",function(){
        // 	$(popDown).css("overflow-y","auto");
        // });
    }
    //能向下滑动的标志
    function wipeMore(fastenDom, rela, bottomH) {//fastenDom:传入的Dom  rela:父级是否需要添加relative传值1,0  bottomH:距离底部的高 可以不传默认为0
        $(fastenDom).find('.loadMOre').remove();//防止重复追加
        if (bottomH == undefined) {
            bottomH = 0;
        }
        var fastenH = $(fastenDom).height();
        var realH = $(fastenDom).children().height();
        if (parseInt(fastenH) < parseInt(realH)) {
            if (rela == 1) {
                $(fastenDom).css('position', 'relative');
            };
            $(fastenDom).append('<div class="loadMOre"><img src="img/more3.gif"></div>');
            $(fastenDom).find('.loadMOre').css('bottom', bottomH);
            if (parseInt($(fastenDom).scrollTop()) >= parseInt(realH)) { //判断滚动条位置 末尾
                $(fastenDom).find('.loadMOre').hide();
            } else {
                $(fastenDom).find('.loadMOre').show();
            };
        };

        var timeout = false;
        $(fastenDom).scroll(function () {
            if (timeout) {
                clearTimeout(timeout);
            }
            timeout = setTimeout(function () {
                if (parseInt($(fastenDom).scrollTop()) + parseInt(fastenH) >= parseInt(realH)) { //滚动到底部
                    $(fastenDom).find('.loadMOre').hide();
                } else {
                    $(fastenDom).find('.loadMOre').show();
                }
            }, 10);
        });
    }
    //将对象转换成数组
    function makeArry(data) {
        if (data instanceof Array) {
            return data;
        } else {
            var newData = [];
            newData.push(data);
            return newData;
        }
    }
    var cookieHeader = "";
    //整体护理相当于调用后续接口或者返回503时重新调用

    function nurseCookie(noShow) {
        var dtd = $.Deferred();
        var UID = $("#userInfobox>font").attr("data-userid");
        //传递整体护理专用用户
        //var UID = '320';
        var datahl = { "Params": { "UserID": UID } };
        if (noShow != 1) {
            $("#LoadedTip").show();
        }
        var nurseData = JSON.parse(localStorage.getItem("zlsoft-wholeNurse"));
        if (nurseData.IP != null && nurseData.PORT != null) {//端口和地址存在
            $.ajax({
                //url:'http://61.128.195.29:7021/Services/sys/login/OAuth',
                url: 'http://' + nurseData.IP + ':' + nurseData.PORT + '/Services/sys/login/OAuth',
                data: JSON.stringify(datahl),
                type: "post",
                timeout: timeoutSec(),//timeout:10,
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (responseTxt, status, xhr) {
                    cookieHeader = xhr.getResponseHeader('HIP_COOKIE');
                    usecookie();
                    console.log("oauth");
                    if (responseTxt.Flag == 1) {
                        $("#LoadedTip").hide();
                        dtd.resolve(responseTxt);
                    } else {
                        console.log(responseTxt);
                        if (noShow != 1) {
                            $("#LoadedTip").hide();
                        }
                        dtd.reject(responseTxt);
                    }

                }
            });
            return dtd.promise();
        }
    }
    function usecookie() {
        return cookieHeader;
    }
    //整体护理病人转换病人ID和病区ID
    function changePateID(patiID, bqid, pageID, zyBaby) {
        var dtd = $.Deferred();
        //var datahl={"Params":{"RelatID":patiID,"DeptID":bqid,"InTimes":pageID,"Baby":zyBaby}};
        var datahl = { "Params": { "RelatID": patiID, "DeptID": bqid, "InTimes": pageID, "Baby": zyBaby } };
        //var datahl = { "Params": { "RelatID": 55745, "DeptID": bqid, "InTimes": 1, "Baby": 0 } };
        var UID=$("#userInfobox>font").attr("data-userid");
        //var UID = '320';
        var datahcookie = { "Params": { "UserID": UID} };
        var nurseData = JSON.parse(localStorage.getItem("zlsoft-wholeNurse"));
        if (nurseData.IP != null && nurseData.PORT != null) {//端口和地址存在
            $.ajax({
                //url:'http://61.128.195.29:7021/Services/pub/customer/GetCustomerGUID',
                url: 'http://' + nurseData.IP + ':' + nurseData.PORT + '/Services/pub/customer/GetCustomerGUID',
                data: JSON.stringify(datahl),
                type: "post",
                // headers: {
                // 	'HIP_COOKIE': cookieHeader
                // },
                beforeSend: function (request) {
                    request.setRequestHeader("hip_cookie", cookieHeader);
                },
                timeout: timeoutSec(),
                dataType: "JSON",
                contentType: "application/json",
            }).always(function (responseTxt, status, xhr) {
                console.log(111111)
                if (status == "success") {
                    if (responseTxt.Flag == 1) {
                        dtd.resolve(responseTxt);
                    } else {
                        dtd.resolve("no");
                    }
                } else if (status == "error" || status == "parseerror") {//调取失败 重新调cookie
                    $.ajax({
                        //url:'http://61.128.195.29:7021/Services/sys/login/OAuth',
                        url: 'http://' + nurseData.IP + ':' + nurseData.PORT + '/Services/sys/login/OAuth',
                        data: JSON.stringify(datahcookie),
                        type: "post",
                        timeout: timeoutSec(),//timeout:10,
                        dataType: "json",
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).always(function (res, status, xhr) {
                        if (status == "success") {
                            cookieHeader = xhr.getResponseHeader('HIP_COOKIE');
                            usecookie();
                            console.log("oauth");
                            $.ajax({
                                //url:'http://61.128.195.29:7021/Services/pub/customer/GetCustomerGUID',
                                url: 'http://' + nurseData.IP + ':' + nurseData.PORT + '/Services/pub/customer/GetCustomerGUID',
                                data: JSON.stringify(datahl),
                                type: "post",
                                beforeSend: function (request) {
                                    request.setRequestHeader("hip_cookie", cookieHeader);
                                },
                                timeout: timeoutSec(),
                                dataType: "JSON",
                                contentType: "application/json",
                            }).always(function (response, status, xhr) {
                                if (status == "success") {
                                    if (response.Flag == 1) {
                                        dtd.resolve(response);
                                    } else {
                                        dtd.resolve("no");
                                    }
                                } else {
                                    dtd.reject("no");
                                };
                            })
                        } else {
                            dtd.reject("no");
                        }
                    });
                } else {//不是503错误不管
                    dtd.resolve("no");
                };
            });
            return dtd.promise();
        }
    }
    return {
        alertPrompt: alertPrompt,
        myconfirm: myconfirm,
        timePlanFJ: timePlanFJ,
        emptyTimePlanJG: emptyTimePlanJG,
        eachMRSR: eachMRSR,
        eachDoctorActive: eachDoctorActive,
        showHide: showHide,               //透明小弹出层
        showPage: showPage,
        showAllPage: showAllPage,
        colorCompute: colorCompute,
        yzxdDellJCXM: yzxdDellJCXM,
        yzxdSelFF: yzxdSelFF,
        todayNow: todayNow,
        calculateTotal: calculateTotal,
        yiZhuEditFunction: yiZhuEditFunction,
        charpipei: charpipei,
        urlFunction: urlFunction,
        errorAjax: errorAjax,
        CSHpanzoom: CSHpanzoom,
        CpStart: CpStart,
        CpEnd: CpEnd,
        CpStartback: CpStartback,
        docActLiTouch: docActLiTouch,
        getPrevDay: getPrevDay,
        getNextDay: getNextDay,
        dateJian: dateJian,
        getMyDay: getMyDay,
        segmentsIntr: segmentsIntr,
        audioPlay: audioPlay,
        timeoutSec: timeoutSec,
        mouthDays: mouthDays,
        iframeAddBox: iframeAddBox,
        stopScroll: stopScroll,
        wipeMore: wipeMore,
        gpGetUrl: gpGetUrl,
        getTotalDose: getTotalDose,
        setTotalDose: setTotalDose,
        gpPostUrl: gpPostUrl,
        getZdId: getZdId,
        makeArry: makeArry,
        nurseCookie: nurseCookie,
        changePateID: changePateID,
        usecookie: usecookie,
        externalUrl: externalUrl,
        externalAss: externalAss
    }



});