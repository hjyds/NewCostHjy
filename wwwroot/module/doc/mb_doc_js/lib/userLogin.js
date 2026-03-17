define(["jquery", "hammer", "jqueryhammer", "utils", "patientSwitch"], function (jquery, hammer, jqueryhammer, utils, patientSwitch) {
    window.loged = false;
    window.enterFlagd = null;
    userNamePub = "";
    var userdeZW = "";
    userKSPub = "";
    userKSPubID = '';
    userKSPubKSID = '';
    user = "";
    userID = '';
    isiosOr = "";
    //判断设备
    isiosOr = isIOS();
    userLoginWay = ''//判断右下角登录人操作方式
    //判断设备
    function isIOS() {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            return 1;
        } else if (/(Android)/i.test(navigator.userAgent)) {
            return 2;
        } else {
            return 3;
        };
    }
    // 获取接口地址
    var serviceChoose = utils.urlFunction();

    function equiment() {
        var equiment = RecordInterface.getDeviceId();
        $("#equiment").text(equiment);
    }
    //安卓获取设备码
    if (isiosOr == 2) {
        try {
            equiment();
        } catch (e) {
            console.log(e);
        }
    }
    function userLoginRerder() {
        $("#loginBox .sorllhide").css("opacity", "0");
        $("#loginBox .allCont").css("margin-top", parseInt($(window).height() - $("#loginBox .allCont").height()) / 2 - 43);
        $("#loginBox .allCont").show();
        //保存公共头像
        var CommetNameStorage = localStorage.getItem("zlsofMdocs-COOMEIMG");
        if (!CommetNameStorage) {
            var xhrCOMMEIMG = new XMLHttpRequest(),
                fileReader = new FileReader();
            xhrCOMMEIMG.open("GET", "img/docimg.png", true);
            xhrCOMMEIMG.responseType = "blob";
            xhrCOMMEIMG.addEventListener("load", function () {
                fileReader.onload = function (evt) {
                    var result = evt.target.result;
                    try {
                        localStorage.setItem("zlsofMdocs-COOMEIMG", result); //保存公共头像
                    } catch (e) {
                        console.log("Storage failed: " + e);
                    }
                };
                fileReader.readAsDataURL(xhrCOMMEIMG.response);
            }, false);
            xhrCOMMEIMG.send();
        }

        var getKeyAll, getvalue, chosecrrent, pipei;
        if (localStorage.length > 0) {
            for (var i = 0; i < localStorage.length; i++) { //先找到上次登录的选中
                getKeyAll = localStorage.key(i);
                //通过键名获取值  
                getvalue = localStorage.getItem(getKeyAll);
                if (getKeyAll.indexOf("zlsofMdocs-IMG-choose") != -1) {  //上一次登录的 用户名
                    chosecrrent = getvalue;
                    pipei = 0; //选中存在
                }
            }
            for (var i = 0; i < localStorage.length; i++) {   //读取所有的图片和用户名
                getKeyAll = localStorage.key(i);
                //通过键名获取值  
                getvalue = localStorage.getItem(getKeyAll);
                //var n=0;
                if (getKeyAll.indexOf("zlsofMdocsIMG-") != -1) {   //找上次登录的图片
                    var getKey = getKeyAll.replace('zlsofMdocsIMG-', "");
                    if (chosecrrent == getKey) {                //上次登录用户名
                        pipei = 1;   //选中有默认图片
                        $("#loginIMG > .widthCont").append('<img class="inerdiv thisImgchoose" data-name="' + getKey + '" src="' + getvalue + '"/>');
                        $("#username").val(getKey);
                    } else {
                        $("#loginIMG > .widthCont").append('<img class="inerdiv" data-name="' + getKey + '"/ src="' + getvalue + '" style="opacity:0"/>');  //不是选中 隐藏
                    }
                }
            }
            if (pipei == 0) {  //上次登录用户名存在 并且无默认图片
                var getCOOMEvalue = localStorage.getItem("zlsofMdocs-COOMEIMG");
                $("#loginIMG > .widthCont").append('<img class="inerdiv thisImgchoose morenIMG" data-name="' + chosecrrent + '" src="' + getCOOMEvalue + '"/>');
            }
        }
        $("#loginIMG > .widthCont").append('<img class="inerdiv" style="opacity:0"/>');
        $("#loginIMG > .widthCont").css("width", $("#loginIMG").find('img').length * 80 + "px");

        if ($("#loginIMG > .widthCont").find('img').length <= 2) {  //上次没有登录
            $("#loginIMG").prev().hide();  //本地没有图片 选中消失
        } else {
            if ($("#loginIMG > .widthCont").find('.thisImgchoose').index() == -1) {
                $("#loginIMG").scrollLeft(0);
                $("#loginIMG").find('img').css("opacity", "0");
                $("#loginIMG").find('img').eq(1).css("opacity", "1");
                $("#username").val($("#loginIMG").find('img').eq(1).attr('data-name'));
                $("#loginIMG > .widthCont").find('img').eq(1).addClass('choosethis');
                $("#loginBox .sorllhide").css("opacity", "1");
            } else {
                var leftindex = $("#loginIMG > .widthCont").find('.thisImgchoose').index();
                var thenum = parseInt(leftindex) - 1;
                $("#loginIMG").scrollLeft(parseInt(thenum) * 80);
            }

        }
    }
    //滑动控制
    var timeout = false;
    $("#loginIMG").scroll(function () {
        var imgLenth = $("#loginIMG").find('img').length;
        $("#loginIMG").find('img').css("opacity", "1");
        $("#loginIMG").find('img').eq(0).css("opacity", "0");
        $("#loginIMG").find('img').eq(imgLenth - 1).css("opacity", "0");
        var distance = $("#loginIMG").scrollLeft();
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(function () {
            var stp;
            if (distance % 80 == 0) {
                stp = distance;
            } else if (distance % 80 < 40) {
                var num = parseInt(distance / 80);
                stp = num * 80;
            } else {
                var num = parseInt(distance / 80) + 1;
                stp = num * 80;
            }
            $("#loginIMG").scrollLeft(stp);
            var thenum = parseInt(stp / 80) + 1;
            $("#username").val($("#loginIMG").find('img').eq(thenum).attr('data-name'));
            $("#loginIMG").find('img').css("opacity", "0");
            $("#loginIMG").find('img').eq(thenum).css("opacity", "1");
            $("#loginIMG").find('img').removeClass('choosethis');
            $("#loginIMG").find('img').eq(thenum).addClass('choosethis');
            $("#loginBox .sorllhide").css("opacity", "1");
        }, 100);
    });
    $("#username").blur(function () {  //用户名输入完成 输入密码在匹配头像
        var cont = 0, leftcc = 0;
        if ($("#username").val() == "") {  //没有用户名输入  选中已有图片的第一个
            leftcc = 0;
            $("#loginIMG").scrollLeft(leftcc);
            $("#loginIMG > .widthCont").find('img').eq(1).addClass('choosethis');
        } else {   //有输入 匹配
            for (var i = 1; i < $("#loginIMG > .widthCont").find('img').length - 1; i++) {
                if ($("#loginIMG > .widthCont").find('img').eq(i).attr("data-name") == $("#username").val()) {  //匹配成功
                    //inputtaxt=$("#username").val();
                    cont = 1;
                    var needscroll = 80 * (i - 1);
                    $("#loginIMG").scrollLeft(needscroll);
                }
            }
            if (cont == 0) {  //没有匹配的用户名
                leftcc = 0;
                $("#loginIMG").prev().show();
                if ($("#loginIMG > .widthCont").find('.morenIMG').length == 0) {  //默认图片不存在

                    $("#loginIMG > .widthCont").find('img').eq(1).css("opacity", "0");
                    var getCOOMEvalue = localStorage.getItem("zlsofMdocs-COOMEIMG");
                    $("#loginIMG > .widthCont").find('img').eq(0).after('<img src="' + getCOOMEvalue + '" class="inerdiv choosethis morenIMG" data-name="' + $("#username").val() + '"/>');
                    $("#loginIMG").scrollLeft(leftcc);
                } else {         //默认图片存在直接改值
                    $("#loginIMG > .widthCont").find('.morenIMG').attr("data-name", $("#username").val());
                    var leftLength = parseInt($("#loginIMG > .widthCont").find('.morenIMG').index()) * 80;
                    $("#loginIMG").scrollLeft(leftLength);
                };
                $("#loginIMG > .widthCont").css("width", $("#loginIMG").find('img').length * 80 + "px");
            }
        }

    });
    //点击回车键登录
    $("body").keydown(function () {
        if (event.which == 13) {
            if ($("#loginBox").css("display") == "block") { //当前为登录页面才登陆
                $("#loginButton").trigger("click");
            }
            //搜索病人医嘱简码
            if($("#searchText").val() !=""){
                $("#clickOk").trigger("tap");
            }
        }
    });
    function saveLoginWay(userID) {
        $.ajax({
            url: serviceChoose + "/SaveLogin",
            timeout: utils.timeoutSec(),
            type: "post",
            dataType: "json",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + JSON.parse(localStorage.userInfo).access_token
            },
            data: JSON.stringify({
                "IN": {
                       "UserName":userID
                }
            }),
        }).always(function (responseTxt, status, xhr) {
            console.log(responseTxt);
        })
    }
    //登录 
    //hammerloginButton = $("#loginButton").hammer();
    //hammerloginButton.on('tap', function(ev) {
    //$("#loginButton").on('touchstart',function(ev) {	
    $("#loginButton").on('click', function (ev) {
        // 登录判断
        var userID = $("#username").val();
        var passWord = $("#password").val();

        // 用户名是否为空
        if (userID == "") {
            $("#LoadedTip").hide();
            utils.showHide("用户名不能为空噢^_^");
        }

        // 密码是否为空
        else if (passWord == "") {
            $("#LoadedTip").hide();
            utils.showHide("密码不能为空噢^_^");
        }
        // 都不为空
        else {
            //登陆成功 输入框失去焦点
            $("#password").blur();
            $("#username").blur();
            //loginmessge();
            //function loginmessge() {
            $("#LoadedTip").show();
            //console.log('登录开始：' + (new Date()).getTime())
            $.ajax({
                url: "../oauth/token",
                timeout: utils.timeoutSec(),
                type: "post",
                data: {
                    "grant_type": "password",
                    "username": userID,
                    "password": passWord,
                    "in": JSON.stringify({
                        "ID": "e39249848267c31fcd6e847a78c8b69f",
                        "YID": "dda86674b7b077b68505d948a843d7d4",
                        "BBH": "1.4.0.1",
                        "SBXH": "iPad",
                        "XTBBH": "iPhone OS 8.1.1"
                    })
                },
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ZG9jOmNweng='
                },
                success: function (data) {
                    //console.log('登录结束：' + (new Date()).getTime());
                    if (data.Result && typeof (data.Result) === "string") {
                        data.Result = JSON.parse(data.Result);
                    }
                    var privs = data.Result.PRIVS.trim();
                    if (privs.indexOf("1956;") !== -1 && privs.length > 5) {
                        window.loged = true;
                        window.enterFlagd = null;
                        localStorage.userInfo = JSON.stringify(data);
                        localStorage.user = userID;
                        localStorage.setItem("zlsoft-wholeNurse", "");//登录成功清除上次存储数据
                        //IPAD请求
                        getFTP_info();
                        // 设置主导航状态
                        $("#mainNavMin ul li").addClass('jinyong');
                        for (var i = 0; i < $("#mainNavMin ul li img").length; i++) { //将图片全部变成禁用
                            var imgSrc = $("#mainNavMin ul li img").eq(i).attr('src').replace("W", "G");
                            imgSrc = imgSrc.replace("B", "G");
                            $("#mainNavMin ul li img").eq(i).attr('src', imgSrc);
                        }
                        // 将MP3存入缓存
                        var rhinoStorage = localStorage.getItem("zlsof-trhino"),
                            rhino = document.getElementById("audio1");
                        if (rhinoStorage) {
                            rhino.setAttribute("src", rhinoStorage);
                        } else {
                            var xhr = new XMLHttpRequest(),
                                fileReader = new FileReader();
                            xhr.open("GET", "mp3/click.mp3", true);
                            xhr.responseType = "blob";
                            xhr.addEventListener("load", function () {
                                fileReader.onload = function (evt) {
                                    var result = evt.target.result;
                                    rhino.setAttribute("src", result);
                                    try {
                                        localStorage.setItem("zlsof-trhino", result);
                                    } catch (e) {
                                        console.log("Storage failed: " + e);
                                    }
                                };
                                fileReader.readAsDataURL(xhr.response);
                            }, false);
                            xhr.send();
                        }
                        // 获取登录信息
                        userNamePub = data.Result.XM;
                        userdeZW = data.Result.ZW;
                        userID = data.Result.UID;
                        user = data.Result.USER;
                        userLoginWay = data.Result.PARA;
                        //提取科室信息
                        var ksInfo = data.Result.KS.split(","),
                            ksID = [];
                        $.each(ksInfo, function (index) {
                            ksID.push(ksInfo[index].split(";")[0]);
                            //获取默认科室
                            if (ksInfo[index].split(";")[2] == 1) {
                                userKSPub = ksInfo[index].split(";")[1];
                                userKSPubID = ksInfo[index].split(";")[0];
                                localStorage.setItem("zlsoft-userKSPubID", userKSPubID);
                            }
                        });
                        var ksIDstring = ksID.toString(",");
                        //获取科室列表信息
                        hQkslist();
                        //保存登录记录
                        saveLoginWay($("#username").val());
                        function hQkslist() {
                            $("#loginBox").show();
                            //console.log('获取科室列表开始：' + (new Date()).getTime())
                            $.ajax({
                                url: serviceChoose + "/DC_Depart_List",
                                timeout: utils.timeoutSec(),
                                type: "post",
                                dataType: "json",
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + JSON.parse(localStorage.userInfo).access_token
                                },
                                data: JSON.stringify({
                                    "IN": {
                                        "KS": ksIDstring,
                                        "ZD": utils.getZdId()                  // 站点ID，今后多个站点会用
                                    }
                                }),
                                success: function (data) {
                                    //console.log('获取科室列表结束：' + (new Date()).getTime())
                                    if (data.Result.ERROR) {
                                        $("#LoadedTip").hide();
                                        utils.showHide(data.Result.ERROR.MSG);
                                    } else {
                                        var KS = data.Result.OUTPUT.KSLIST.KS;
                                        // 隐藏登录层
                                        $("#loginBox").hide();
                                        console.log('获取病人列表开始：' + (new Date()).getTime())
                                        patientSwitch.patSwitch(KS, userKSPubID, userNamePub, 1, 1, 0); // 科室列表，默认科室ID，用户姓名，isWD,isZY,isHZ
                                        //$("#LoadedTip").hide();
                                    }
                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                    utils.errorAjax(textStatus, hQkslist, []);
                                }
                            });
                        };
                        //将用户名和头像存入缓存
                        if (($("#loginIMG > .widthCont").find('.morenIMG').index() == $("#loginIMG > .widthCont").find('.choosethis').index())) {  //没有头像
                            var oneNowuserName = $("#username").val();
                            localStorage.setItem("zlsofMdocs-IMG-choose", oneNowuserName);  //存用户名
                        } else {  //等后台返回
                            var NowuserName = $("#username").val();
                            var NameStorage = localStorage.getItem("zlsofMdocsIMG-" + NowuserName);
                            if (!NameStorage) {   //后台有图片返回
                                var imgURL = "img/docimg.png";   //台返回图片的地址  url必须是 地址 不能是转码过后饿字符
                                var xhrIMG = new XMLHttpRequest(),
                                    fileReader = new FileReader();
                                xhrIMG.open("GET", imgURL, true);
                                xhrIMG.responseType = "blob";
                                xhrIMG.addEventListener("load", function () {
                                    fileReader.onload = function (evt) {
                                        var result = evt.target.result;
                                        try {
                                            localStorage.setItem("zlsofMdocsIMG-" + NowuserName, result);
                                            localStorage.setItem("zlsofMdocs-IMG-choose", NowuserName);
                                        } catch (e) {
                                            console.log("Storage failed: " + e);
                                        }
                                    };
                                    fileReader.readAsDataURL(xhrIMG.response);
                                }, false);
                                xhrIMG.send();
                            } else {   //图片已经保存过  
                                localStorage.setItem("zlsofMdocs-IMG-choose", NowuserName);
                            }
                        };
                        $("#userInfobox").find("span").hide(); //图片和小图标的切换
                        //$("#userInfobox").find(".installThree").show(); //设置三方
                        var changeimgURL = $("#loginIMG > .widthCont").find('.choosethis').attr("src");
                        $("#userInfobox .userImgbox").attr("src", changeimgURL);
                        $("#userInfobox").find("img").show();

                        //-----获取科室列表信息
                        $("#userInfobox font").text(userNamePub + '（' + userdeZW + '）').attr("data-userID", userID).attr("data-ksID", userKSPubID);            // 科室 姓名
                        var dataPr = data.Result.PR;     // 聘任技术职务
                        var dataJb = data.Result.JB;     // 人员抗菌药物权限的级别
                        $("#userInfobox font").attr("data-pr", dataPr).attr("data-jb", dataJb);
                        $("#userInfobox").find("font").show();
                        if (userLoginWay == 0 || userLoginWay == '') {
                            setTimeout(function () {     //自动隐藏用户名
                                $("#userInfobox").addClass('animated fadeOutRight');
                                setTimeout(function () {
                                    $("#userInfobox").removeClass('animated fadeOutRight');
                                    $("#userInfobox").find("img").hide();
                                    $("#userInfobox").find("font").hide();
                                    $("#userInfobox").find("span").show();
                                }, 550)
                            }, 3000);
                        }
                        $("#qhbr").show();
                        $("#qhbrFather").show();
                        $("#mainNavUserBox").show();              // 病人基本缩略内容
                        $("#mainNavUserBoxzd").show();            // 病人诊断内容
                        $("#mainNavMinTwo").show();               // 左边导航
                        $("#boxCenterTwo").show();                // 中间内容区域
                        $("#huaDongJiBen").show();                // 默认基本信息块显示
                        $("#mainNavMinTwo1").show();
                        // 隐藏一切该隐藏的
                        $("#dateTime").hide();
                        $("#successBack").hide();
                        $("#bingLi-List").hide();
                        $("#bingLi-Choose").hide();
                        $("#promptQDQX").hide();
                        $("#yzParticulars").hide();
                        $("#yzxdFather").hide();
                        $("#timePlan").hide();
                        $("#totalFunction").hide();
                        $("#NumberOfDaysFunction").hide();
                        $("#boxCount").hide();
                        $("#startTime").hide();
                        $("#yzxdGYTJ").hide();
                        $("#yzxdDS").hide();
                        $("#yzxdJCXM").hide();
                        $("#yzxdJCFF").hide();
                        $("#yzxdJYXM").hide();
                        $("#yzxdZXPL").hide();
                        $("#yzxdCJFF").hide();
                        $("#yzxdZXXZ").hide();
                        $("#yzxdZXKS").hide();
                        $("#yzxdCJKS").hide();
                        $("#yzxdGYZX").hide();
                        $("#yzxdFYYF").hide();
                        $("#yzxdYSZT").hide();
                        $("#yzfzFather").hide();
                        $("#yzfzBox").hide();
                        $("#zyfzkeyboard").hide();
                        $("#yzButtonBox").hide();
                        $("#timeControlWrapF").hide();
                        $("#zlyl_db_Box").hide();
                        $("#linChuang").hide();
                        $("#pageContral").hide();
                        $("#RecordPAge").hide(); //护理的护理记录 导航
                        $("#pageListhoose").hide();//体温单list
                        $("#huiLpages").hide();//护理记录
                        // 观片配置地址获取
                        guanP_JC(1);
                        //整体护理 配置数据 免密码cookie
                        allNursing(1);
                        //是否接入外部系统,注释此代码是为了解决登录异步问题，所以提到登录前调用
                        //external_access();
                    } else {
                        $("#LoadedTip").hide();
                        utils.showHide("没有授权，不能使用本系统");
                    }
                },
                error: function (xmr) {
                    var data = xmr.responseJSON;
                    if (xmr.status===400 && data.error) {
                        data.error = JSON.parse(data.error);
                        utils.showHide(data.error.ERROR.MSG);
                        $("#LoadedTip").hide();
                    }
                    else {
                        utils.showHide(data);
                        $("#LoadedTip").hide();
                    }
                }
                //,
                //complete: function (XMLHttpRequest, textStatus) {
                //    utils.errorAjax(textStatus, loginmessge, []);
                //}
            });

            //}  //loginmessge结束
        }
    });
    //用户信息显示隐藏
    hammeruserInfobox = $("#userInfobox").hammer();
    hammeruserInfobox.on('tap', function (ev) {
        if (userLoginWay == 0 || userLoginWay == '') {
            if ($(this).find("font").css("display") == "none") {
                $(this).find("font").show();
                $(this).find(".fs1").hide();
                $(this).find("img").show();
                $(this).find(".installThree").show();//设置
            } else {
                $(this).find("font").hide();
                $(this).find("img").hide();
                $(this).find(".fs1").show();
                $(this).find(".installThree").hide();//设置
            }
        } else {
            $(this).find("font").show();
            $(this).find(".fs1").hide();
            $(this).find("img").show();
            $(this).find(".installThree").show();//设置
        }

    });


    //头像设置
    $("#userInfobox .userImgbox").on('touchstart', function (event) {
        event.stopPropagation();    //  阻止事件冒泡
        event.preventDefault();     //  阻止默认行为 ( 表单提交 )
        userImgchange()
    });
    function userImgchange() {
        var userIMGsrc = $("#userInfobox > img").attr("src");
        $("#userImgZuzhi").show();
        var TitelDIV = '<div class="title"><span class="name">头像修改</span><span class="fs1" aria-hidden="true" data-icon=""></span></div>';
        var cIMGdiv = '<div class="img-cont"><img src="' + userIMGsrc + '" class="imgwidth" /></div>';
        var inputDIV = '<form action="" method="post" accept-charset="utf-8"><div class="addphoto" id=""  style="line-height: 38px;font-size: 22px;"><span style="color:#51b9c5;">修改</span><input type="file" name="pic" id="doc" accept="image/gif,image.jpg,image/png" class="choseImg"/></div></form>';
        $("#userImgChange").show();
        $("#userImgChange").empty();
        $("#userImgChange").append('<div class="photoDiv" style="width: 45%">' + TitelDIV + cIMGdiv + inputDIV + '</div>');
        $("#userImgChange .photoDiv").css("margin-top", ($(window).height() - $("#userImgChange .photoDiv").outerHeight()) / 2);  //居中
        $("#userImgChange .photoDiv").css("margin-left", ($(window).width() - $("#userImgChange .photoDiv").outerWidth()) / 2);
        $("#userImgChange > .photoDiv").show();
        var userIMGcolose = $("#userImgChange > .photoDiv > .title > .fs1").hammer();
        userIMGcolose.on('tap', function (event) {
            event.preventDefault();
            $("#userImgChange").hide();
            $("#userImgChange > .photoDiv").hide();
        });
    }

    // 检查观片
    function guanP_JC(noShow) {
        if (noShow != 1) {
            $("#LoadedTip").show();
        }
        //localStorage.removeItem("zlsofMdocs-install-JcGpUrl");
        $.ajax({
            url: serviceChoose + "/DC_GetInterfaceConfig",
            type: "post",
            timeout: utils.timeoutSec(),//timeout:10,
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({
                    "LB": "1"            //获取PACS观片配置时，固定传1                
            }),
            success: function (responseTxt) {
				/*if(responseTxt.Result.OUTPUT!==null){					
					// 接口地址
					var blUrl = responseTxt.Result.OUTPUT.CONFIG.JK["#cdata-section"];
					// 参数内容
					var csText = '?'; 
					// 获取参数与参数之间的分隔符
					var SSD = responseTxt.Result.OUTPUT.CONFIG.SSD["#cdata-section"];
					// 参数名和参数值之间的分隔符
					var ZYD = responseTxt.Result.OUTPUT.CONFIG.ZYD["#cdata-section"];
					// 判断是否加密
					var JM = false;
					if(responseTxt.Result.OUTPUT.CONFIG.JMGZ["#cdata-section"]=="1"){
						JM = true;
					}
					// 对那些值加密 1：参数名和参数值都加密，2：参数名加密，3：参数值加密
					var JMNR = responseTxt.Result.OUTPUT.CONFIG.JMNR["#cdata-section"];

					//准备数据 关联属性，1：医嘱id，2：写死zldoc://，3：当前用户名，4：当前病人住院号，5：住院次数（就是主页id），6：病人id					
					var data2 = 'zldoc://';
					//var data3 = $("#username").val();
					//var data4 = $("#slzyID").text();
					//var data5 = $("#slzyID").attr("data-pageid");
					//var data6 = $("#slzyID").attr("data-patiid");
					
					// 如果有入参
					if(responseTxt.Result.OUTPUT.CONFIG.LIST.ITEM){
						var item = responseTxt.Result.OUTPUT.CONFIG.LIST.ITEM;
						for(var i in item){
							var MC = item[i].MC["#cdata-section"];
							if(item[i].GL==undefined){								
								var NR = item[i].NR["#cdata-section"];
							}else{
								var gl;
								switch(item[i].GL){
									case "1":
										gl = "医嘱ID";
										break;
									case "2":
										gl = data2;
										break;
									//case "3":
									//	gl = data3;
									//	break;
									//case "4":
									//	gl = data4;
									//	break;
									//case "5":
									//	gl = data5;
									//	break;
									//case "6":
									//	gl = data6;
									//	break;
								}
								var NR = gl;
							}
							//var pwd="加密"; 
							if(JM==true && JMNR=="1"){
								//MC = CryptoJS.AES.encrypt(item[i].MC["#cdata-section"],pwd);
								//NR = CryptoJS.AES.encrypt(NR,pwd);
								MC = item[i].MC["#cdata-section"]+'加密';
								NR = NR+'加密';
							}else if(JM==true && JMNR=="2"){
								//MC = CryptoJS.AES.encrypt(item[i].MC["#cdata-section"],pwd);
								MC = item[i].MC["#cdata-section"]+'加密';
							}else if(JM==true && JMNR=="3"){
								//NR = CryptoJS.AES.encrypt(NR,pwd);
								NR = NR+'加密';
							}
							if(i==item.length-1){
								csText = csText+MC+ZYD+NR;
							}else{
								csText = csText+MC+ZYD+NR+SSD;
							}
						}
						blUrl = blUrl + csText;
						localStorage.setItem("zlsofMdocs-install-JcGpUrl",blUrl);
					}
				}*/
                if (responseTxt.Result.ERROR) {
                    $("#LoadedTip").hide();
                } else {
                    utils.gpGetUrl(responseTxt);
                    if (noShow != 1) {
                        $("#LoadedTip").hide();
                    }
                }

            },
            complete: function (XMLHttpRequest, textStatus) {
                utils.errorAjax(textStatus, guanP_JC, []);
            }
        });
    }
    //是否接入外部系统
    function external_access() {
        $.ajax({
            url: serviceChoose + "/DC_Extra_Interface",
            type: 'post',
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify({"LB": "6"}),
            timeout: utils.timeoutSec(),//timeout:10,
        }).always(function (responseTxt, status, xhr) {
            if (status == "success") {
                utils.externalUrl(responseTxt);
            } else {
                return false;
            }
        })
    }
    // function external_access(){
    //     var postObj = {
    //         strXML: JSON.stringify({
    //             "IN": {
    //                 "SYS": "001",
    //                 "FUNC": "DC_Extra_Interface",
    //                 "LB": "6"
    //             }
    //         })
    //     }
    //     $.ajax({
    //         url: serviceChoose + "/Regin",
    //         type: 'POST',
    //         data:postObj,
    //         timeout:utils.timeoutSec(),//timeout:10,
    //         dataType: "JSON",
    //     }).always(function(responseTxt,status, xhr){
    //         if(status=="success"){
    //             utils.externalUrl(responseTxt);
    //         }else{
    //             return false;
    //         }
    //     })
    // }
    external_access();
    //获取整体护理数据
    function allNursing(noShow) {//noShow控制加载层
        if (noShow != 1) {
            $("#LoadedTip").show();
        }
        $.ajax({
            url: serviceChoose + "/DC_GetZthlConfig",
            type: "post",
            timeout: utils.timeoutSec(),//timeout:10,
            dataType: "json",
            success: function (responseTxt) {
                if (responseTxt.Result.ERROR) {
                    $("#LoadedTip").hide();
                } else {
                    if (noShow != 1) {
                        $("#LoadedTip").hide();
                    }
                    //将整体护理数据存入本地缓存
                    var wholeNurse = responseTxt.Result.OUTPUT;
                    localStorage.setItem("zlsoft-wholeNurse", JSON.stringify(wholeNurse));
                    utils.nurseCookie();
                }

            },
            complete: function (XMLHttpRequest, textStatus) {
                utils.errorAjax(textStatus, allNursing, []);
            }
        });
    }
    // 判断使用平台并存储起来
    function judgePlatform() {
        // 1.IOS、2.Android、3.PC
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            localStorage.platform = 1;
        } else if (/(Android)/i.test(navigator.userAgent)) {
            localStorage.platform = 2;
        } else {
            localStorage.platform = 3;
        };
        if(localStorage.platform =='1'){
            $("#tabSys").show();
            var hammertab = $("#tabSys").hammer();
            hammertab.on('tap', function (ev) {
                try {

                    showNativeSeverChoose();
                } catch (error) {
                    console.log(error);
                }
            })
        }else{
            $("#tabSys").hide();
        }
    }
    judgePlatform();
    getFTP_info();
    if(localStorage.platform == 3){
        if(location.href.indexOf('zd') == '-1'){
            $("body").append('<div class="jygp-wrap" id="jcgp-Box" style="z-index: 1000;width:600px;height:300px;left:50%;top:50%;margin-left: -300px;margin-top: -150px;"><div class="gpclose" style="top:10px;"><span class="fs1" aria-hidden="true" data-icon=""></span></div><div class="jygp_dbBox" style="overflow: scroll;padding:20px 0 0 0;height:670px;position: relative;background: #fff">' +
                '<p style="font-size:23px;padding-left: 20px;font-weight:bold;color: #5cb9d0;border-bottom: 2px solid #5cb9d0;padding-bottom: 20px;">选择站点</p><ul id="zd_box"></ul></div></div>');
            getZD();
        }
    }

    //PC上面获取站点
    function getZD() {
        var TempserviceChoose ='../api/services/doc/Lis';
        var url = TempserviceChoose + '/DC_GetSite';

        $.post(url, function (res) {
            if (res) {
                //已经是一个对象无效转换
                if (res.Result.ERROR) {
                    console.log(res.Result.ERROR);
                } else {
                    if(res.Result.length > 0){
                        for(var i=0; i<res.Result.length; i++){
                             $('#zd_box').append('<li style="font-size: 16px;font-weight: bold;padding-bottom: 10px;padding-left:20px;margin-bottom: 10px;border-bottom: 1px solid #ddd;" data-zd="'+res.Result[i]['站点']+'">'+res.Result[i]['名称']+'</li>');
                   }

                        var zd=$("#zd_box li").hammer();
                        zd.on('tap', function(event) {
                    if(location.href.indexOf('?') ==-1){
                                location.href=location.href+"?zd="+$(this).attr("data-zd");
                                $("#jcgp-Box").remove();
                            }
                        });
                    }else{
                             $("#jcgp-Box").remove(); 
                        }
                    var gpClosehammer1=$("#jcgp-Box .gpclose").hammer();
                    gpClosehammer1.on('tap', function(event) {
                        setTimeout(function(){
                            $("#jcgp-Box").remove();
                        },100)
                    });
                }
            }
        });
    }
    // 获取ftp服务器信息
    function getFTP_info() {
        var url = serviceChoose + '/DocServer_Get';
        $.post(url, function (res) {
            if (res) {
                //已经是一个对象无效转换				
                if (res.Result.ERROR) {
                    console.log(res.Result.ERROR);
                } else {
                    //赋值是否配置了合理用药
                    var ftpInfo = res.Result.SERVER;
                    localStorage.checkDrug=res.Result.DrugServer;
                    if(res.Result.DrugServer){
                        localStorage.DrugHospitalName=res.Result.DrugServer.CONFIG.HospitalName;
                    }
                    //电子病历是否启用PDF工具
                    localStorage.PDFStatus=res.Result.PDFStatus;
                    //存储药品列表
                    localStorage.descList =res.Result.DrugInstructions;
					//病历规则第三方是否开启
                    localStorage.ruleHistoryStatus = res.Result.CaseHistory;
					//病历三方路径
					localStorage.ruleHistoryStatusLocation=res.Result.CaseHistoryLocation;
					//护理记录第三方规则是否开启
					//localStorage.ruleStatus=res.Result.NursingRecordSheet;
					localStorage.ruleRecordSheetStatus=res.Result.NursingRecordSheet;
					//护理记录三方路径
					localStorage.ruleRecordSheetStatusLocation=res.Result.NursingRecordSheetLocation;
					//检验、检查三方规则是否开启
					localStorage.rulePacsStatus=res.Result.Pacs;
					//Pacs三方路径
					localStorage.rulePacsStatusLocation=res.Result.PacsLocation;
					
					

                    localStorage.ftpInfo = JSON.stringify(ftpInfo);
                }
            }
        });
    }
    window.isLoged = function () {
        return window.loged;
    }

    return {
        userLoginRerder: userLoginRerder
    };

}); 