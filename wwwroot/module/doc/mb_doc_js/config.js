require.config({
    // baseUrl:'/',
    waitSeconds: 200,
    paths: {
        "jquery": "plugins/jquery/jquery-2.2.0.min",
        "hammer": "plugins/hammer/hammer.min",
        "jqueryhammer": "plugins/hammer/jquery.hammer",
        "panzoom": "plugins/panzoom/jquery.panzoom",
        "echarts": "plugins/echarts/echarts.min",
        //"cryptoJS":"plugins/cryptoJS/core-min",
        //"cryptoJSaes":"plugins/cryptoJS/aes",
        "userlogin": "lib/userLogin",
        "patientSwitch": "lib/patientSwitch",
        "patientHomePage": "lib/patientHomePage",
        "exitOut": "lib/exitOut",
        "utils": "lib/utils",
        "dataLoad": "lib/dataLoad",
        "medicalRecords": "lib/medicalRecords",
        "ordActCopy": "lib/ordActCopy",
        "inspection": "lib/inspection",
        "examine": "lib/examine",
        "nurseRecords": "lib/nurseRecords",
        "doctorAdvice": "lib/doctorAdvice",
        "dateTime": "lib/dateTime",
        "dateScroll": "lib/dateScroll",
        "consulting": "lib/consulting",
        "clinic": "lib/clinic",
        "IScroll": "plugins/iscroll/iscroll",
        "photo": "lib/newphoto",
        "video": "lib/newvideo",
        "layer": "plugins/layer/layer",
        "PDFJS":"plugins/pdfJS/pdf"
    },
    shim: {
        'hammer': ['jquery'],
        'jqueryhammer': ['jquery', 'hammer'],
        'panzoom': ['jquery']
        //'cryptoJS':['jquery'],
        //'cryptoJSaes':['jquery','cryptoJS'],
    },
});

require([
    "jquery",
    "hammer",
    "jqueryhammer",
    "panzoom",
    "echarts",
    //"cryptoJS",
    //"cryptoJSaes",
    "userlogin",
    "patientSwitch",
    "patientHomePage",
    "exitOut",
    "utils",
    "dataLoad",
    "medicalRecords",
    "ordActCopy",
    "inspection",
    "examine",
    "nurseRecords",
    "doctorAdvice",
    "dateTime",
    "dateScroll",
    "consulting",
    "clinic",
    "IScroll",
    "layer",
    "video",
    "photo",
    "PDFJS"
], function (
    jquery,
    hammer,
    jqueryhammer,
    panzoom,
    echarts,
    //cryptoJS,
    //cryptoJSaes,
    userlogin,
    patientSwitch,
    patientHomePage,
    exitOut,
    utils,
    dataLoad,
    medicalRecords,
    ordActCopy,
    inspection,
    examine,
    nurseRecords,
    doctorAdvice,
    dateTime,
    dateScroll,
    consulting,
    clinic,
    IScroll,
    layer,
    video,
    photo,
    PDFJS
) {
        // window.onerror = function(msg,url,l){
        //     txt="There was an error on this page.\n\n";
        //     txt+="Error: " + msg + "\n";
        //     txt+="URL: " + url + "\n";
        //     txt+="Line: " + l + "\n\n";
        //     txt+="Click OK to continue.\n\n";
        //     layer.alert(txt);
        //    	return true
        // }

        /*var pwd="我的密码";
      
        var mi=CryptoJS.AES.encrypt("你好，欢迎来到开源中国在线工具，这是一个AES加密测试",pwd);
        console.log("你好，欢迎来到开源中国在线工具，这是一个AES加密测试----密文:"+mi);
          
        var result=CryptoJS.AES.decrypt(mi,pwd).toString(CryptoJS.enc.Utf8);
          
        console.log("解密结果："+result);*/

        // 屏蔽遮罩滑动底层
        $("body").on("touchmove", ".pop-up", function (e) {
            e.preventDefault();
        });

        window.resize = function () {
            $('#PDFdivWrapBG').width(document.querySelector('#mainNavMin').offsetLeft - 125 - 20);
        }

            (function () {
                var mainNavLeft = document.querySelector('#mainNavMin').offsetLeft;
                var yzxdBoxLeft = document.querySelector('#yzxdBox').offsetLeft;

                // $('#PDFdivWrapBG').width(document.querySelector('#mainNavMin').offsetLeft-125-20);
                // var left = document.querySelector('#yzxdBox').offsetLeft+420;
                // $('.yzxdKongJian').css('left',left);

                setInterval(function () {
                    if (document.querySelector('#mainNavMin').offsetLeft == mainNavLeft) {
                        return;
                    } else {
                        mainNavLeft = document.querySelector('#mainNavMin').offsetLeft;
                        $('#PDFdivWrapBG').width(document.querySelector('#mainNavMin').offsetLeft - 125 - 20);
                    }
                }, 400);

                setInterval(function () {
                    if (document.querySelector('#yzxdBox').offsetLeft == yzxdBoxLeft) {
                        return;
                    } else {
                        yzxdBoxLeft = document.querySelector('#yzxdBox').offsetLeft;
                        var left = document.querySelector('#yzxdBox').offsetLeft + 410;
                        $('.yzxdKongJian').css('left', left);
                        $("#sskeyboardbox").css('left', left);
                    }
                }, 400)
            }());




        userlogin.userLoginRerder();
        // 隐藏病人信息和二级菜单
        $("#mainNavUserBox").hide();
        $("#mainNavUserBoxzd").hide();
        $("#mainNavMinTwo").hide();
        $("#qhbr").hide();

        //初始化页面元素宽度和高度
        var a = $(window).height();
        var b = $(window).width();
        // var aa = window.screen.availHeight;
        // var bb = window.screen.availWidth ;
        // var a = document.body.clientHeight;
        // var b = document.body.clientWidth;
        // alert("hei"+a+"wei"+b)
        // 登录内容展开
        $("#loginBox img").show();
        $("#loginBox form").show();
        //$("#loginBox img").css("margin-top",($(window).outerHeight()-($("#loginBox .loginBox>form").outerHeight()+$("#loginBox .loginBox>img").outerHeight()))/3);   //计算登陆居中的高度

        //$("#boxCenterTwo").height(a-10);//10
        //$("#mainNavMin").height(a);                                                     // 右边导航的高度
        //$("#qhbr").css("max-height",a).css("min-height",a).css("width",b-60);           // 切换病人浮动层的高度和宽度
        //$("#qhbrLeft").css("width",100).css("height",a-20);
        //$("#qhbrRight").css("width",b-160).css("height",a-20);
        //$("#qhbrFather").height(a-130);
        //$(".bingLiKaBox").css("width",(b-200)/3);                                       // 病历卡的宽度
        //$(".scrollHDDiv").css("max-height",a-64);                                       // 滑动块的高度 基本信息
        // $(".mainNavMinTwo").height(a-203);                                              // 左边导航的高度203
        //$(".tableBodyScroll").css("max-height",a-94);                                  // 滑动表格身体的高度 医嘱查阅
        //$("#yzfzBox").css("width",b-205);                                               // 医嘱复制浮动层的高度宽度
        //$("#yzfzBox > .left").css("width",(b-215)*0.17);                                 // 医嘱复制 左边 宽度
        //$("#yzfzBox > .right").css("width",(b-215)*0.83);                                // 医嘱复制 右边 宽度
        //$("#yzfzBingRen").css("height",a-140);                                      // 医嘱复制 左边病人筛选列表高度
        //$("#yzfzInfo").css("height",a-137);                                                   // 医嘱复制 医嘱表格高度
        //$("#feiYongTable").css("max-height",a-190);                                               // 费用明细 表格高度
        //$("#yzDBCButtonNR").height(a-205);                                              // 待保存块 内容高度
        //$(".yzxdChengTaoBox").height(a-160+35);                                            // 医嘱成套详情高度
        //$("#yzxdTwoJiHeight").height(a-160+35);                                            // 医嘱二级详情高度
        //$("#qhbrFather").height(a-90);                                                  // 切换病人 负窗口高度 以控制不得点击层下按钮
        //$("#yzParticulars").css("min-height",a-20).css("max-height",a-20);              // 医嘱详情 高度
        //$("#yzxdBox").height(a);  // 医嘱下达块
        // $("#yzxdYaoPin").css("max-height",a-287);                                       // 药品列表高度
        $(".yzxdKongJian").css("left", b / 2 + 209).css("width", (b - 500) / 2); //计算控件的浮动距离左边的位置
        //$("#yzfzFather").css("height",a);                                               // 医嘱复制弹出层
        $("#yzxdJCXM").css("left", b / 2 + 210);                                             // 检查项目控件
        $("#yzxdJCXM ul").css("max-height", a - 125);
        $("#yzxdJCFF").css("left", b / 2 + 210);                                             // 检查方法控件
        $("#yzxdJYXM").css("left", b / 2 + 210);                                             // 检验项目控件

        //导航二级菜单 加载二级菜单
        hammerNav = $("#mainNavMin ul li").hammer();
        hammerNav.on('tap', function (ev) {
            if (!$(this).hasClass('jinyong')) {
                if (!$(this).hasClass('active')) {
                    $("#inHis li").remove();        //清空住院病历列表
                    $("#InformPaper li").remove();  //清空知情文件列表  
                    $("#disProve li").remove();     //清空知情文件列表
                    $("#newBingLiList li").remove();  //病历新接口	
                    $("#PDFdivWrapBL > .pdf").remove();        //病历pdf清空
                    $("#PDFdivWrapBL > div > iframe").remove(); //病历xml清空
                    $("#inspection li").remove();     // 清空检验列表
                    $("#PDFdivWrapBG>div").remove();  // 清空检验iframe容器	
                    $("#examine li").remove();           // 清空检查列表
                    $("#PDFdivWrapBG .PDFdiv").remove();  //清空检查pdf容器
                    $(".threeIframe").remove();            // 清空第三方iframe

                    $("#mainNavUserBox").show();   // 缩略卡
                    $("#mainNavUserBoxzd").show(); // 诊断结果 缩略
                    $("#mainNavMinTwo").show();    // 左边二级导航
                    $("#huaDong").show();          // 滑动块 中间

                    $("#zhenLiao").hide();         // 诊疗
                    $("#linChuang").hide();         // 临床
					if($("#mainNavMin ul .active img").attr("src")!=null)
					{
					var pevImgSrc = $("#mainNavMin ul .active img").attr("src").replace("B", "W");
                    $("#mainNavMin ul .active img").attr("src", pevImgSrc);
					}
                    var thisImgSrc = $(this).find("img").attr("src").replace("W", "B");
                    $(this).find("img").attr("src", thisImgSrc);
                    $("#mainNavMin ul li").removeClass("active");
                    $(this).addClass("active");

                    $("#bingLi-List").hide();
                    var zhi = $(this).index();
                    switch (zhi) {
                        //主页
                        case 0:
                            $("#nurseIframe").hide();
                            patientHomePage.index();
                            break;
                        //诊疗
                        case 1:
                            $("#nurseIframe").hide();
                            consulting.consulting();
                            break;
                        //临床
                        case 2:
                            // if($("#mainNavMin ul li").eq(2).hasClass('jinyong')){
                            // 	$("#mainNavMin ul li").eq(2).removeClass('active');
                            // }else{
                            $("#nurseIframe").hide();
                            clinic.clinic();
                            // }

                            break;
                        //医嘱
                        case 3:
                            $("#nurseIframe").hide();
                            $("#mainNavMinTwo > div").hide();
                            $("#mainNavMinTwo2").show();
                            $("#yzParticulars").hide(); //医嘱执行情况关闭    
                            // 第一次选中长嘱 当前   以后不更改
                            if (!$("#qxSelect li").hasClass('XuanZhong')) {
                                $("#qxSelect li:last").addClass("XuanZhong");
                                $("#flSelect li:first").addClass("XuanZhong");
                            }
                            doctorAdvice.docActListLoad("yes", 0);  // 加载医嘱列表数据   yes:要清空已追加的tr  0:从第一页开始加载
                            utils.yiZhuEditFunction();
                            break;
                        //病历
                        case 4:
                            $("#nurseIframe").hide();
                            $("#mainNavMinTwo > div").hide();
                            $("#bingLiXML").show().css("height", a - 65);
                            $("#huaDong > div").hide();
                            $("#yzButtonBox").hide();   // 医嘱新开、复制按钮
                            $("#huaDongBingLi").show();
                            medicalRecords.medicalRecords();// 给二级导航添加数据与点击事件
                            $("#yzParticulars").hide(); //医嘱执行情况关闭
                            break;
                        //检验
                        case 5:
                            $("#nurseIframe").hide();
                            $("#mainNavMinTwo > div").hide();
                            inspection.inspection();
                            $("#huaDong > div").hide();
                            $("#yzButtonBox").hide();   // 医嘱新开、复制按钮
                            $("#bingLi-List").hide();
                            $("#huaDongBaoGao").show();
                            $("#PDFdivWrapBG > div").hide();
                            $("#yzParticulars").hide(); //医嘱执行情况关闭

                            $('#PDFdivWrapBG').width(document.querySelector('#mainNavMin').offsetLeft - 125 - 20);
                            break;
                        //检查
                        case 6:
                            $("#nurseIframe").hide();
                            $("#mainNavMinTwo > div").hide();
                            examine.examine();
                            $("#huaDong > div").hide();
                            $("#yzButtonBox").hide();   // 医嘱新开、复制按钮
                            $("#bingLi-List").hide();
                            $("#huaDongBaoGao").show();
                            $("#PDFdivWrapBG > div").hide();
                            $("#yzParticulars").hide(); //医嘱执行情况关闭
                            break;
                        //护理
                        case 7:
                            // $("#mainNavMinTwo > div").hide();
                            // $("#huaDong > div").hide();
                            // $("#yzButtonBox").hide();   // 医嘱新开、复制按钮
                            // $("#bingLi-List").hide();
                            // $("#huaDongHuLi").show();
                            // $("#PDFdivWrapHL>div").hide();
                            // $("#yzParticulars").hide(); //医嘱执行情况关闭
                            // nurseRecords.nurseHis();
                            $("#mainNavMinTwo > div").hide();
                            $("#huaDong > div").hide();
                            $("#yzButtonBox").hide();   // 医嘱新开、复制按钮
                            $("#bingLi-List").hide();
                            $("#PDFdivWrapHL>div").hide();
                            $("#yzParticulars").hide(); //医嘱执行情况关闭
                            if (localStorage.nurseIframe == '1') {
                                $("#mainNavUserBox").hide();   // 缩略卡
                                $("#mainNavUserBoxzd").hide(); // 诊断结果 缩略
                                $("#mainNavMinTwo").hide();    // 左边二级导航
                                // $("#huaDong").hide();          // 滑动块 中间
                                $("#huaDongHuLi").hide();
                                $("#nurseIframe").show();
                            } else {
                                nurseRecords.nurseHis();
                                $("#nurseIframe").hide();
                                $("#huaDongHuLi").show();
                            }
                            break;
                    }
                    // 关闭相册
                    photo.closePhoto();
                    // 判断录音状态
                    video.closeAudio();
                }
            }
        });

        // 病人病历pageID切换 出现
        var hammerdengJi = $("#mainNavUserBox .leftcontBOx").hammer();
        hammerdengJi.on('tap', function () {
            try {
                 // 如果来自ipad
            if(!recordStart){
                return false;
            }
            } catch (error) {
                try {
                    if(!RecordInterface.recordStart)
                        return false;
                } catch (error) {
                    return false;
                }

            }
            
            $("#BlockClick").show();
            $("#dengjiUlStyle").removeClass('animated fadeOut');
            $("#voiceAndphoto").removeClass('animated fadeOut');
            if ($("#dengjiUlStyle ul li").length > 1) {
                for (var i = 0; i < $("#dengjiUlStyle li").length; i++) {
                    if ($("#dengjiUlStyle li").eq(i).text() == $("#dengJi").text()) {
                        $("#dengjiUlStyle li").eq(i).addClass('changClass');
                    }
                }
                if ($("#dengjiUlStyle").css("display") == "none") {
                    $("#dengjiUlStyle").css("display", "block");
                    $("#voiceAndphoto").css("display", "block");
                } else {
                    $("#dengjiUlStyle").css("display", "none");
                    $("#voiceAndphoto").css("display", "none");
                    $("#BlockClick").hide();
                }
            } else {
                $("#dengjiUlStyle").css("display", "none");
                $("#voiceAndphoto").toggle();
            }
            //照相和录音出现 隐藏
            $("#voiceAndphoto li").removeClass('xuanZhong');

        });
        $("#BlockClick").unbind();
        var BlockClickhammer = $("#BlockClick").hammer();
        BlockClickhammer.on('tap', function (event) {
            //主页的照相和pageid
            $("#dengjiUlStyle").hide();
            $("#voiceAndphoto").hide();
            $("#BlockClick").hide();

        });

    });