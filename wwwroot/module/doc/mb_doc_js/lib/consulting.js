/*
	* 诊疗一览 
*/
define([
    "jquery",
    "hammer",
    "jqueryhammer",
    "echarts",
    "utils",
    "dateScroll",
    "photo",
    "video"
], function (
    jquery,
    hammer,
    jqueryhammer,
    echarts,
    utils,
    dateScroll,
    photo,
    video
) {

        //初始化页面元素宽度和高度
        var a = $(window).height();
        var b = $(window).width();
        var serviceChoose = utils.urlFunction();
        var changZhuL = (b - 70) * 0.875;

        function consulting() {
            $("#mainNavUserBox").hide();   // 缩略卡
            $("#mainNavUserBoxzd").hide(); // 诊断结果 缩略
            $("#mainNavMinTwo").hide();    // 左边二级导航
            $("#huaDong").hide();          // 滑动块 中间
            $("#yzButtonBox").hide();      // 医嘱新开、复制按钮
            $("#yzParticulars").hide();    // 医嘱执行情况
            $("#zhenLiao").show();
            // $("#zhenLiao .tableBodyDiv").css("height",a-130);
            $("#zhenLiao .zlylChart").css("width", (b - 70) * 0.875);
            // 清空
            $("#lclj_bgDiv").empty();
            $("#zhenLiao").empty();

            patInfor();    // 追加小卡片和导航

            $("#zhenLiao .zlylCard .dh").attr("data-nowtime", utils.todayNow().split(" ")[0]);
            var hasCysj = $("#slzyID").attr("data-cysj");
            if (hasCysj == '0' || hasCysj == 0) {
                zlDataLoad(utils.todayNow().split(" ")[0]);  // 加载诊疗数据
            } else {
                if (hasCysj) {
                    zlDataLoad(hasCysj);  // 加载诊疗数据
                } else {
                    zlDataLoad(utils.todayNow().split(" ")[0]);  // 加载诊疗数据
                }

            }

        }

        // 病人小卡片和导航
        function patInfor() {
            var zlylCard = '<div class="zlylCard"><ul class="cardUl"></ul></div>';
            $("#zhenLiao").append(zlylCard);
            // 姓名
            $("#zhenLiao>.zlylCard>ul").append('<li>' + $("#slNAME").text() + '</li>');
            // 性别
            if ($("#slXB").hasClass("color-man")) $("#zhenLiao>.zlylCard>ul").append('<li>| <img src="./img/man.png" class="color-man"/></li>');
            else $("#zhenLiao>.zlylCard>ul").append('<li>| <img src="./img/woman.png" class="color-woman"/></li>');
            // 年龄
            if ($("#slzyID").attr("data-baby") == "no") $("#zhenLiao>.zlylCard>ul").append('<li>| ' + $("#slAGE").text() + '岁</li>');
            else $("#zhenLiao>.zlylCard>ul").append('<li>| ' + $("#baby-yes").text() + '</li>');
            // 护理等级
            if ($("#slHLDJ").hasClass("badge1")) $("#zhenLiao>.zlylCard>ul").append('<li>| <span class="badge badge-success badge1">一</span></li>');
            else if ($("#slHLDJ").hasClass("badge2")) $("#zhenLiao>.zlylCard>ul").append('<li>| <span class="badge badge-success badge2">二</span></li>');
            else if ($("#slHLDJ").hasClass("badge3")) $("#zhenLiao>.zlylCard>ul").append('<li>| <span class="badge badge-success badge3">三</span></li>');
            else if ($("#slHLDJ").hasClass("badgete")) $("#zhenLiao>.zlylCard>ul").append('<li>| <span class="badge badge-success badgete">特</span></li>');
            // 床号
            $("#zhenLiao>.zlylCard>ul").append('<li>| ' + $("#slCH").text() + '床</li>');
            // 住院ID
            $("#zhenLiao>.zlylCard>ul").append('<li>| ' + $("#slzyID").text() + '</li>');
            // 住院天数
            $("#zhenLiao>.zlylCard>ul").append('<li>| ' + $("#slRYSJ").text() + '</li>');
            // 病情
            $("#zhenLiao>.zlylCard>ul").append('<li>| ' + $("#slBQZT").text() + '</li>');
            // 临床路径
            if ($("#slLCLJ").hasClass("lclj1")) $("#zhenLiao>.zlylCard>ul").append('<li>| <span class="fs1 lclj1" aria-hidden="true" data-icon=""></span></li>');
            else if ($("#slLCLJ").hasClass("lclj2")) $("#zhenLiao>.zlylCard>ul").append('<li>| <span class="fs1 lclj2" aria-hidden="true" data-icon=""></span></li>');
            else if ($("#slLCLJ").hasClass("lclj3")) $("#zhenLiao>.zlylCard>ul").append('<li>| <span class="fs1 lclj3" aria-hidden="true" data-icon=""></span></li>');
            // PageID
            $("#zhenLiao>.zlylCard>ul").append('<li>| <span class="dengJiCheck" id="zldengJiCheck">' + $("#dengJi").text() + '</span></li>');
            // 结尾符
            $("#zhenLiao>.zlylCard>ul").append('<li><b></b></li>');

            var timeBox = '<div class="timeBox"><div class="jt"><span></span></div><div class="nrBox" id="zlyl_startTime"></div></div>';
            var dh = '<div class="dh">' + timeBox + '<div class="butt">1周</div><div class="butt">2周</div><div class="butt">3周</div><div class="butt">4周</div><div class="butt"><span class="fs1 prevDay" aria-hidden="true" data-icon=""></span></div><div class="butt">日期</div><div class="butt"><span class="fs1 nextDay" aria-hidden="true" data-icon=""></span></div></div>';
            $("#zhenLiao > .zlylCard").append(dh);

            // 给导航注册事件
            var zlylHammerDh = $("#zhenLiao > .zlylCard > .dh > .butt").hammer();
            zlylHammerDh.on("tap", function () {
                if (!$(this).hasClass("jy")) {
                    $(this).siblings(".timeBox").hide(); // 隐藏日期控件
                    $("#zhenLiao > .zlylCard > .dh > .butt").removeClass("activeBut");
                    $(this).addClass("activeBut");
                    if ($(this).find(".prevDay").length > 0) {
                        var prevDate = utils.getPrevDay($("#zhenLiao .zlylCard .dh").attr("data-nowtime"), 1);
                        zlDataLoad(prevDate);
                    } else if ($(this).find(".nextDay").length > 0) {
                        var nextDate = utils.getNextDay($("#zhenLiao .zlylCard .dh").attr("data-nowtime"));
                        zlDataLoad(nextDate);
                    } else if ($(this).text() == "日期") {
                        if ($(this).siblings(".timeBox").is(":hidden")) {
                            $(this).siblings(".timeBox").show();
                            dateScroll.dateScroll(utils.todayNow().split(" ")[0], "zlyl_startTime");
                            // 点击确定
                            var hammerDateQd = $("#dateScroll .qd").hammer();
                            hammerDateQd.on("tap", function () {
                                zlDataLoad($("#dateScroll > p").text());
                                $("#zhenLiao .timeBox").hide();
                            });
                        } else {
                            $(this).siblings(".timeBox").hide();
                        }
                    } else {
                        switch ($(this).text()) {
                            case "1周":
                                zlDataLoadZhou(1);
                                break;
                            case "2周":
                                zlDataLoadZhou(2);
                                break;
                            case "3周":
                                zlDataLoadZhou(3);
                                break;
                            case "4周":
                                zlDataLoadZhou(4);
                                break;
                        }
                    }
                }
            });

            //追加拍照和住院次数
            var pictures = '<div class="voiceAndphoto-ll"><div class="tuchu"></div><ul><li class="voice"><span class="fs1" aria-hidden="true" data-icon=""></span></li><li class="voice" style="border-top:1px solid rgba(204, 204, 204, 0.61);"><span class="fs1" aria-hidden="true" data-icon=""></span></li></ul></div>';
            var zyTime = '<div class="pageIdchange"><div class="outertop"></div><ul></ul></div>';
            $("#zhenLiao > .zlylCard").append(pictures);//追加拍照
            var pageIdlength = $("#dengjiUlStyle >ul >li").length;
            if (pageIdlength > 1) {    //住院次数大于1 才追加
                $("#zhenLiao > .zlylCard").append(zyTime);
                for (var i = 1; i <= pageIdlength; i++) {
                    $("#zhenLiao > .zlylCard > .pageIdchange >ul").append('<li>' + i + '</li>');
                    if ($("#zhenLiao > .zlylCard > .cardUl > li > .dengJiCheck").text() == i) {
                        $("#zhenLiao > .zlylCard > .pageIdchange >ul > li").eq(i - 1).addClass('changClass')
                    }
                }
            }
            //给基本信息注册事件
            var cardUlhammer = $("#zhenLiao > .zlylCard > .cardUl").hammer();
            cardUlhammer.on('tap', function (event) {
                // 如果来自ipad
                try {
                    // 如果来自ipad
                    if (!recordStart) {
                        return false;
                    }
                } catch (error) {
                    try {
                        if (!RecordInterface.recordStart)
                            return false;
                    } catch (error) {
                        return false;
                    }

                }
                $("#zhenLiao > .zlylCard > .voiceAndphoto-ll").removeClass('animated fadeIn').removeClass('animated fadeOut').toggle();
                if (pageIdlength > 1) {
                    $("#zhenLiao > .zlylCard > .pageIdchange").removeClass('animated fadeIn').removeClass('animated fadeOut').toggle();
                }
            });
            //给照相注册事件


            // var zlvoicelihammer= $("#zhenLiao > .zlylCard > .voiceAndphoto-ll > ul > li").hammer();
            // zlvoicelihammer.on('tap', function(event) {
            // 	$(this).addClass('xuanZhong');
            // 	$("#zhenLiao > .zlylCard > .voiceAndphoto-ll").removeClass('animated fadeIn').addClass('animated fadeOut');
            // 	$("#zhenLiao > .zlylCard > .pageIdchange").removeClass('animated fadeIn').addClass('animated fadeOut');
            // 	setTimeout(function(){ 
            // 		$("#zhenLiao > .zlylCard > .voiceAndphoto-ll").css("display","none");
            // 		$("#zhenLiao > .zlylCard > .pageIdchange").css("display","none");
            // 		$("#zhenLiao > .zlylCard > .voiceAndphoto-ll > ul li").removeClass('xuanZhong');
            // 	}, 1000);
            // 	if($(this).index()==0){
            // 		video.video();   //录音
            // 	}else{
            // 		photo.photo();   //拍照
            // 	}
            // });


            //给pageId切换注册事件
            var zlpageIdchangeh = $("#zhenLiao > .zlylCard > .pageIdchange > ul > li").hammer();
            zlpageIdchangeh.on('tap', function (event) {
                pageIdChange($(this));
            });


        }

        // 根据日期判断 
        function buttonSwitch() {
            var cysj = $("#zhenLiao > .zlylCard > .dh").attr("data-cysj") == "null" ? utils.todayNow().split(" ")[0] : $("#zhenLiao > .zlylCard > .dh").attr("data-cysj");
            var rysj = $("#zhenLiao > .zlylCard > .dh").attr("data-rysj");
            var jssj = $("#zhenLiao .zlylCard .dh").attr("data-nowtime");
            var kssj = $("#zhenLiao .zlylCard .dh").attr("data-kssj");

            if (kssj <= rysj) {
                $("#zhenLiao > .zlylCard > .dh").find(".prevDay").parent().addClass("jy");
            } else {
                $("#zhenLiao > .zlylCard > .dh").find(".prevDay").parent().removeClass("jy");
            }
            if (jssj >= cysj) {
                $("#zhenLiao > .zlylCard > .dh").find(".nextDay").parent().addClass("jy");
            } else {
                $("#zhenLiao > .zlylCard > .dh").find(".nextDay").parent().removeClass("jy");
            }
            var cjDays = utils.dateJian(rysj, cysj) + 1; //计算总共住院时间

            /*if(cjDays<7){
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(0).addClass("jy");
            }else{
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(0).removeClass("jy");
            }*/
            /*if(cjDays<14){
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(1).addClass("jy");
            }else{
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(1).removeClass("jy");
            }
            if(cjDays<21){
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(2).addClass("jy");
            }else{
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(2).removeClass("jy");
            }
            if(cjDays<28){
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(3).addClass("jy");
            }else{
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(3).removeClass("jy");
            }*/
            if (cjDays <= 7) {
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(1).addClass("jy");
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(2).addClass("jy");
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(3).addClass("jy");
            } else if (cjDays > 7 && cjDays <= 14) {
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(1).removeClass("jy");
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(2).addClass("jy");
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(3).addClass("jy");
            } else if (cjDays > 14 && cjDays <= 21) {
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(1).removeClass("jy");
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(2).removeClass("jy");
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(3).addClass("jy");
            } else {
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(1).removeClass("jy");
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(2).removeClass("jy");
                $("#zhenLiao > .zlylCard > .dh").find(".butt").eq(3).removeClass("jy");
            }

        }

        // 加载诊疗数据 按日期调
        function zlDataLoad(date, pageID) {
            // 清空
            $("#lclj_bgDiv").empty();
            $("#zhenLiao table").remove();
            $("#zhenLiao .tableBodyDiv").remove();
            $("#LoadedTip").show();
            $.ajax({
                //初始化病人卡
                url: serviceChoose + '/DC_DiagnosisPlatform_Temp',
                data: JSON.stringify({
                    "IN":
                        {
                            "PATIID": $("#slzyID").attr("data-patiid"),
                            "PAGEID": pageID == undefined ? $("#slzyID").attr("data-pageid") : pageID,
                            "BABY": $("#slzyID").attr("data-baby") == "yes" ? 1 : 0,
                            "RQ": date,      //   "2014-06-26",                   //日期为选择的日期
                            "YH": null                                              //页号传空
                        }
                }),
                async: true,
                type: "post",
                timeout: utils.timeoutSec(),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                //成功
                success: function (responseTxt) {
                    if (responseTxt.Result.ERROR) {
                        $("#LoadedTip").hide();
                        utils.showHide(responseTxt.Result.ERROR.MSG);
                    } else {
                        zlylTableLoad(responseTxt);
                    }
                },
                complete: function (XMLHttpRequest, status) {
                    utils.errorAjax(status, zlDataLoad, [date]);
                }
            });
        }

        // 加载诊疗数据 按周调
        function zlDataLoadZhou(weekNo) {
            // 清空
            $("#lclj_bgDiv").empty();
            $("#zhenLiao table").remove();
            $("#zhenLiao .tableBodyDiv").remove();
            $("#LoadedTip").show();
            $.ajax({
                //初始化病人卡
                url: serviceChoose + '/DC_DiagnosisPlatform_Temp',
                async: true,
                type: "post",
                data: JSON.stringify({
                    "IN":
                        {
                            "PATIID": $("#slzyID").attr("data-patiid"),
                            "PAGEID": $("#slzyID").attr("data-pageid"),
                            "BABY": $("#slzyID").attr("data-baby") == "yes" ? 1 : 0,
                            "RQ": null,								//日期传空
                            "YH": weekNo                            //第几页(第几周)
                        }
                }),
                timeout: utils.timeoutSec(),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                //成功
                success: function (responseTxt) {
                    console.log(responseTxt);
                    if (responseTxt.Result.ERROR) {
                        $("#LoadedTip").hide();
                        utils.showHide(responseTxt.Result.ERROR.MSG);
                    } else {
                        zlylTableLoad(responseTxt);
                    }
                },
                complete: function (XMLHttpRequest, status) {
                    utils.errorAjax(status, zlDataLoadZhou, [weekNo]);
                }
            });
        }

        // 标准表格追加函数
        function zlylTableLoad(responseTxt) {

            // 更新日期
            var jssj = responseTxt.Result.OUTPUT.JSSJ.split(" ")[0];
            var kssj = responseTxt.Result.OUTPUT.KSSJ.split(" ")[0];
            var rysj = responseTxt.Result.OUTPUT.RYSJ == null ? "null" : responseTxt.Result.OUTPUT.RYSJ.split(" ")[0];
            var cysj = responseTxt.Result.OUTPUT.CYSJ == null ? "null" : responseTxt.Result.OUTPUT.CYSJ.split(" ")[0];
            $("#zhenLiao .zlylCard .dh").attr("data-nowtime", jssj).attr("data-cysj", cysj).attr("data-rysj", rysj).attr("data-kssj", kssj);
            buttonSwitch();

            // 标准数据 
            var tableDate, tableTime;;
            var tableZy = ["", "", "", "", "", "", ""];
            var tableSs = ["", "", "", "", "", "", ""];
            //如果 日期 住院天数  UPTABLE节点不存在
            if (responseTxt.Result.OUTPUT.UPTABLE) {
                var upTable = responseTxt.Result.OUTPUT.UPTABLE.ROWS.ROW;
                $(upTable).each(function () {
                    if ($(this)[0].MC == "住院天数" && $(this)[0].NR !== null) {
                        tableZy = $(this)[0].NR.split("|");
                    } else if ($(this)[0].MC == "手术天数" && $(this)[0].NR !== null) {
                        tableSs = $(this)[0].NR.split("|");
                    } else if ($(this)[0].MC == "日期") tableDate = $(this)[0].NR.split("|");
                    else if ($(this)[0].MC == "时间") tableTime = $(this)[0].NR.split("|");
                });
            } else {
                var jsMonth = jssj.split("-")[1];
                var ksMonth = kssj.split("-")[1];
                var one, two, three, four, five;//获取后5天的时间
                one = utils.getNextDay(kssj); two = utils.getNextDay(one);
                three = utils.getNextDay(two); four = utils.getNextDay(three);
                five = utils.getNextDay(four);
                one = one.split("-")[2]; two = two.split("-")[2]; three = three.split("-")[2]; four = four.split("-")[2]; five = five.split("-")[2];
                var jsDay = jssj.split("-")[2];
                tableDate = [kssj, one, two, three, four, five, jsDay];
                if (jsMonth != ksMonth) {
                    for (var xzOne = 1; xzOne < tableDate.length; xzOne++) {
                        if (tableDate[xzOne] == "1" || tableDate[xzOne] == "01") {
                            var newDay = jsMonth + '-01';
                            tableDate.splice(xzOne, 1, newDay)
                            break;
                        }
                    }
                }
                tableTime = ["4", "8", "12", "16", "20", "24"];
            }

            // 追加表头------------------start
            $("#zhenLiao").append('<table class="zlylTable_head"><tr style="font-weight: bold;"><td style="width:12.5%; border-top-left-radius:10px;">日期</td></tr><tr style="font-weight: bold;"><td style="width:12.5%;">时间</td></tr></table>');
            // 日期 
            $(tableDate).each(function (i, value) {
                if (i == 6) $("#zhenLiao>.zlylTable_head>tbody>tr:first").append('<td style="width:12.5%; color:#50A3A2; border-top-right-radius:10px;">' + value + '</td>');
                else $("#zhenLiao>.zlylTable_head>tbody>tr:first").append('<td style="width:12.5%; color:#50A3A2;">' + value + '</td>');
            });
            // 时间
            for (var timei = 0; timei < 7; timei++) {
                $("#zhenLiao>.zlylTable_head>tbody>tr:last").append('<td style="width:12.5%"><table class="smallTable"><tr><td style="color:#ff0000;">' + tableTime[0] + '</td><td>' + tableTime[1] + '</td><td>' + tableTime[2] + '</td><td>' + tableTime[3] + '</td><td style="color:#ff0000;">' + tableTime[4] + '</td><td style="color:#ff0000;">' + tableTime[5] + '</td></tr></table></td>');
            }
            //- 追加表头-------------------end

            // 追加表身------------------start
            var tableBodyHeight = a - 130;
            $("#zhenLiao").append('<div class="tableBodyDiv"><table class="zlylTable_body"><tr><td style="width:12.5%; font-weight: bold;" rowspan="3"></td></tr><tr></tr><tr></tr></table></div>');

            // 脉搏血压 表格底纹
            for (var trEq = 0; trEq < 3; trEq++) {
                for (var xyi = 0; xyi < 7; xyi++) {
                    $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr").eq(trEq).append('<td style="width:12.5%"><table class="smallTable"><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td></tr></table></td>');
                }
            }
            // 脉搏血压 Y轴 BOARD
            if (responseTxt.Result.OUTPUT.BOARD) {
                var BOARD = responseTxt.Result.OUTPUT.BOARD.ITEMS;
                for (var mbi = BOARD.length - 1; mbi >= 0; mbi--) {
                    if (BOARD[mbi]["@MC"] == "脉搏") {
                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:first>td:first").append('<div class="mbBt" style="color:#ff0000;">' + BOARD[mbi]["@MC"] + '</div>');
                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:first>td:first").append('<ul class="mbUl" style="color:#ff0000;"><li>180</li><li>160</li><li>140</li><li>120</li><li>100</li><li>80</li><li>60</li><li>40</li></ul>');
                    } else if (BOARD[mbi]["@MC"] == "体温") {
                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:first>td:first").append('<div class="mbBt" style="color:blue;">' + BOARD[mbi]["@MC"] + '</div>');
                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:first>td:first").append('<ul class="mbUl" style="color:blue;"><li>42</li><li>41</li><li>40</li><li>39</li><li>38</li><li>37</li><li>36</li><li>35</li></ul>');
                    }
                }

                // 体温脉搏 容器 
                var picture = '<defs><pattern id="grid" patternUnits="userSpaceOnUse" x="100" y="100" width="10" height="10"><line x1="100" y1="100" x2="0" y2="0" style="stroke:red;stroke-width:1"/></pattern></defs>';
                //var picture = '<defs><pattern id="grid" patternUnits="userSpaceOnUse" x="0" y="0" width="10" height="100"><line x1="10" y1="0" x2="0" y2="100" style="stroke:red;stroke-width:1"/></pattern></defs>';
                $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:first>td").eq(1).css("position", "relative").prepend('<div class="zlylChart"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" version="1.1">' + picture + '</svg></div>');
                $("#zhenLiao").find(".zlylChart").css("width", $("#zhenLiao .tableBodyDiv").width() * 0.125 * 7);

                // 体温脉搏
                var boaroTW = responseTxt.Result.OUTPUT.BOARD.ITEMS[0].ITEM;
                var boaroMB = responseTxt.Result.OUTPUT.BOARD.ITEMS[1].ITEM;
                var tip = responseTxt.Result.OUTPUT.BOARD.TIPS.TIP;
                var chartBoxWidth = $("#zhenLiao").find(".zlylChart").width();
                var startEq = 0, endEq = 0, switchStart = "no";
                findFCoord(0, boaroTW, drawChartTW);
                startEq = 0, endEq = 0, switchStart = "no";
                findFCoord(0, boaroMB, drawChartMB);

                // 找出两点
                function findFCoord(srart, dataArry, callBack) {  // 开始索引，数据数组，回调绘制的函数
                    for (var xhi = srart; xhi < 42; xhi++) {
                        // 提取未记标志，兼容两种格式，一种在DOWN里，一种在UP里。
                        var thiswjbz = "";
                        if (tip[xhi].DOWN.WJBZ) {
                            thiswjbz = tip[xhi].DOWN.WJBZ;
                        } else if (tip[xhi].UP.WJBZ) {
                            thiswjbz = tip[xhi].UP.WJBZ;
                        }
                        if ((switchStart == "no" && dataArry[xhi].TOPREV == "1") || (switchStart == "no" && dataArry[xhi].TOPREV == "0" && dataArry[xhi].NR !== null && thiswjbz.split("")[0] == "0")) {
                            startEq = xhi;
                            switchStart = "yes";                 // 已经找到startEq
                        } else if ((dataArry[xhi].TOPREV == "1" && dataArry[xhi].NR !== "拒测") || (dataArry[xhi].TOPREV == "0" && dataArry[xhi].NR !== null && dataArry[xhi].NR !== "拒测" && thiswjbz.split("")[0] == "0")) {
                            endEq = xhi;
                            break;
                        }
                    }
                    if (endEq !== 0) callBack();  //startEq!==endEq 以前有这个条件
                }
                // 绘制两点 体温
                function drawChartTW() {
                    for (var ldi = startEq; ldi <= endEq; ldi++) {
                        // 提取未记标志，兼容两种格式，一种在DOWN里，一种在UP里。
                        var thiswjbz = "";
                        if (tip[ldi].DOWN.WJBZ) {
                            thiswjbz = tip[ldi].DOWN.WJBZ;
                        } else if (tip[ldi].UP.WJBZ) {
                            thiswjbz = tip[ldi].UP.WJBZ;
                        }
                        if (thiswjbz.split("")[0] == "1" || boaroTW[ldi].NR == "不升") {
                            break;
                        }
                        if (ldi == endEq) {
                            var twStartX = (startEq + 1) * (chartBoxWidth / 42) - (chartBoxWidth / 42 / 2);
                            twStartX = parseFloat(parseFloat(twStartX).toFixed(2));
                            var twStartY = (43 - boaroTW[startEq].NR) * 18;
                            twStartY = parseFloat(parseFloat(twStartY).toFixed(2));
                            var twEndX = (endEq + 1) * (chartBoxWidth / 42) - (chartBoxWidth / 42 / 2);
                            twEndX = parseFloat(parseFloat(twEndX).toFixed(2));
                            var twEndY = (43 - boaroTW[endEq].NR) * 18;
                            twEndY = parseFloat(parseFloat(twEndY).toFixed(2));

                            // 超过一天 不连线 只瞄点
                            if (Math.floor((endEq + 1) / 6) - Math.floor((startEq + 1) / 6) > 1) { // endEq-startEq>6
                                // 画点点 
                                hddTW();
                            } else {
                                var TiWenChart = twStartX + ',' + twStartY + ' ' + twEndX + ',' + twEndY;
                                // 画曲线
                                $(document.createElementNS('http://www.w3.org/2000/svg', 'polyline')).attr({
                                    points: TiWenChart,
                                    style: "fill:none;stroke:blue;stroke-width:1",
                                    class: boaroTW[startEq].NR + '-' + boaroTW[endEq].NR,
                                }).appendTo(".zlylChart svg");
                                // 画点点 
                                hddTW();
                            }
                            // 画点点 函数 
                            function hddTW() {
                                // 画点点 start
                                if ($("#zhenLiao .zlylChart").find('.tw' + startEq).length <= 0) {
                                    if (boaroTW[startEq].BW == "口温") {           // 口温 实心圆点点
                                        $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr({
                                            cx: twStartX,
                                            cy: twStartY,
                                            r: "2",
                                            style: "fill:blue",
                                            class: 'tw' + startEq,
                                        }).appendTo(".zlylChart svg");
                                    } else if (boaroTW[startEq].BW == "腋温") {     // 腋温 叉叉
                                        $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr({
                                            x1: twStartX - 4,
                                            y1: twStartY - 4,
                                            x2: twStartX + 4,
                                            y2: twStartY + 4,
                                            style: "fill:none;stroke:blue;stroke-width:2",
                                            class: 'tw' + startEq,
                                        }).appendTo(".zlylChart svg");
                                        $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr({
                                            x1: twStartX + 4,
                                            y1: twStartY - 4,
                                            x2: twStartX - 4,
                                            y2: twStartY + 4,
                                            style: "fill:none;stroke:blue;stroke-width:2",
                                            class: 'tw' + startEq,
                                        }).appendTo(".zlylChart svg");
                                    } else if (boaroTW[startEq].BW == "肛温") {     // 肛温 空心圆
                                        $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr({
                                            cx: twStartX,
                                            cy: twStartY,
                                            r: "4",
                                            style: "fill:none;stroke:blue;stroke-width:1",
                                            class: 'tw' + startEq,
                                        }).appendTo(".zlylChart svg");
                                    } else if (boaroTW[startEq].BW == "耳温") {     // 耳温 三角形
                                        var startXYZ = twStartX + ',' + (twStartY - 4) + ' ' + (twStartX + 4) + ',' + (twStartY + 4) + ' ' + (twStartX - 4) + ',' + (twStartY + 4);
                                        $(document.createElementNS('http://www.w3.org/2000/svg', 'polygon')).attr({
                                            points: startXYZ,
                                            style: "fill:blue;",
                                            class: 'tw' + startEq,
                                        }).appendTo(".zlylChart svg");
                                    }
                                }
                                // 画点点 end
                                if ($("#zhenLiao .zlylChart").find('.tw' + endEq).length <= 0) {
                                    if (boaroTW[endEq].BW == "口温") {           // 口温 实心圆点点
                                        $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr({
                                            cx: twEndX,
                                            cy: twEndY,
                                            r: "2",
                                            style: "fill:blue",
                                            class: 'tw' + endEq,
                                        }).appendTo(".zlylChart svg");
                                    } else if (boaroTW[endEq].BW == "腋温") {     // 腋温 叉叉
                                        $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr({
                                            x1: twEndX - 4,
                                            y1: twEndY - 4,
                                            x2: twEndX + 4,
                                            y2: twEndY + 4,
                                            style: "fill:none;stroke:blue;stroke-width:2",
                                            class: 'tw' + endEq,
                                        }).appendTo(".zlylChart svg");
                                        $(document.createElementNS('http://www.w3.org/2000/svg', 'line')).attr({
                                            x1: twEndX + 4,
                                            y1: twEndY - 4,
                                            x2: twEndX - 4,
                                            y2: twEndY + 4,
                                            style: "fill:none;stroke:blue;stroke-width:2",
                                            class: 'tw' + endEq,
                                        }).appendTo(".zlylChart svg");
                                    } else if (boaroTW[endEq].BW == "肛温") {     // 肛温 空心圆
                                        $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr({
                                            cx: twEndX,
                                            cy: twEndY,
                                            r: "4",
                                            style: "fill:none;stroke:blue;stroke-width:1",
                                            class: 'tw' + endEq,
                                        }).appendTo(".zlylChart svg");
                                    } else if (boaroTW[endEq].BW == "耳温") {     // 耳温 三角形
                                        var endXYZ = twEndX + ',' + (twEndY - 4) + ' ' + (twEndX + 4) + ',' + (twEndY + 4) + ' ' + (twEndX - 4) + ',' + (twEndY + 4);
                                        $(document.createElementNS('http://www.w3.org/2000/svg', 'polygon')).attr({
                                            points: endXYZ,
                                            style: "fill:blue;",
                                            class: 'tw' + endEq,
                                        }).appendTo(".zlylChart svg");
                                    }
                                }
                            }
                        }
                    }
                    if (endEq < 41 && startEq !== endEq) {
                        startEq = endEq;
                        findFCoord(endEq + 1, boaroTW, drawChartTW);
                    }
                }
                // 绘制两点 脉搏
                function drawChartMB() {
                    for (var ldi = startEq; ldi <= endEq; ldi++) {
                        // 提取未记标志，兼容两种格式，一种在DOWN里，一种在UP里。
                        var thiswjbz = "";
                        if (tip[ldi].DOWN.WJBZ) {
                            var thiswjbz = tip[ldi].DOWN.WJBZ;
                        } else if (tip[ldi].UP.WJBZ) {
                            var thiswjbz = tip[ldi].UP.WJBZ;
                        }
                        if (thiswjbz.split("")[1] == "1" || boaroMB[ldi].NR == "不升") {
                            break;
                        }
                        if (ldi == endEq) {
                            // 脉搏坐标
                            var mbStartX = (startEq + 1) * (chartBoxWidth / 42) - (chartBoxWidth / 42 / 2);
                            mbStartX = parseFloat(mbStartX).toFixed(2);
                            var mbStartY = (200 - boaroMB[startEq].NR) / 20 * 18;
                            mbStartY = parseFloat(mbStartY).toFixed(2);
                            var mbEndX = (endEq + 1) * (chartBoxWidth / 42) - (chartBoxWidth / 42 / 2);
                            mbEndX = parseFloat(mbEndX).toFixed(2);
                            var mbEndY = (200 - boaroMB[endEq].NR) / 20 * 18;
                            mbEndY = parseFloat(mbEndY).toFixed(2);
                            // 心率坐标
                            var xlStartY, xlEndY;
                            if (boaroMB[startEq].BJNR == null) {
                                xlStartY = mbStartY;
                            } else {
                                xlStartY = (200 - boaroMB[startEq].BJNR) / 20 * 18;
                                xlStartY = parseFloat(xlStartY).toFixed(2);
                            }
                            if (boaroMB[endEq].BJNR == null) {
                                xlEndY = mbEndY;
                            } else {
                                xlEndY = (200 - boaroMB[endEq].BJNR) / 20 * 18;
                                xlEndY = parseFloat(xlEndY).toFixed(2);
                            }
                            // 超过一天不连线，只瞄点
                            if (Math.floor((endEq + 1) / 6) - Math.floor((startEq + 1) / 6) > 1) { // endEq-startEq>6
                                hddMB();  // 瞄点
                            } else {
                                hddMB();  // 瞄点
                                var MaiBoChart = mbStartX + ',' + mbStartY + ' ' + mbEndX + ',' + mbEndY;
                                // 画曲线 脉搏
                                $(document.createElementNS('http://www.w3.org/2000/svg', 'polyline')).attr({
                                    //id:"line2",
                                    points: MaiBoChart,
                                    style: "fill:none;stroke:red;stroke-width:1",
                                    class: boaroMB[startEq].NR + '-' + boaroMB[endEq].NR,
                                }).appendTo(".zlylChart svg");
                                // 画曲线 心率
                                if (boaroMB[startEq].BJNR !== null || boaroMB[endEq].BJNR !== null) {
                                    var XinLvChart = mbStartX + ',' + xlStartY + ' ' + mbEndX + ',' + xlEndY;
                                    $(document.createElementNS('http://www.w3.org/2000/svg', 'polyline')).attr({
                                        points: XinLvChart,
                                        style: "fill:none;stroke:red;stroke-width:1",
                                        class: boaroMB[startEq].BJNR + '-' + boaroMB[endEq].BJNR,
                                    }).appendTo(".zlylChart svg");
                                }
                            }
                            // 画点点 函数 
                            function hddMB() {
                                // 画圆点 脉搏
                                if ($("#zhenLiao .zlylChart").find('.mb' + startEq).length <= 0) {
                                    $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr({
                                        cx: mbStartX,
                                        cy: mbStartY,
                                        r: "2",
                                        style: "fill:red",
                                        class: "mb" + startEq + ' mb',
                                    }).appendTo(".zlylChart svg");
                                }
                                if ($("#zhenLiao .zlylChart").find('.mb' + endEq).length <= 0) {
                                    $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr({
                                        cx: mbEndX,
                                        cy: mbEndY,
                                        r: "2",
                                        style: "fill:red",
                                        class: "mb" + endEq + ' mb',
                                    }).appendTo(".zlylChart svg");
                                }
                                // 画空心圆 心率
                                if (boaroMB[startEq].BJNR !== null && $("#zhenLiao .zlylChart").find('.xl' + startEq).length <= 0) {
                                    $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr({
                                        cx: mbStartX,
                                        cy: xlStartY,
                                        r: "4",
                                        style: "fill:none;stroke:red;stroke-width:1",
                                        class: "xl" + startEq + ' xl',
                                    }).appendTo(".zlylChart svg");
                                }
                                if (boaroMB[endEq].BJNR !== null && $("#zhenLiao .zlylChart").find('.xl' + endEq).length <= 0) {
                                    $(document.createElementNS('http://www.w3.org/2000/svg', 'circle')).attr({
                                        cx: mbEndX,
                                        cy: xlEndY,
                                        r: "4",
                                        style: "fill:none;stroke:red;stroke-width:1",
                                        class: "xl" + endEq + ' xl',
                                    }).appendTo(".zlylChart svg");
                                }
                            }
                        }
                    }
                    if (endEq < 41 && startEq !== endEq) {
                        startEq = endEq;
                        findFCoord(endEq + 1, boaroMB, drawChartMB);
                    }
                }

                // 循环找画阴影的坐标，用数组放起来，一个形状一个数组 
                var shaowArry = [];
                var xzEqStr = ''; // 形状的轴
                var mbArray = [];
                $("#zhenLiao .zlylChart").find('.mb').each(function () {
                    mbArray.push($(this).attr("class").split(" ")[0]);
                });
                $(".xl").each(function () {
                    var thisXlEq = $(this).attr("class").split(" ")[0].replace("xl", "");
                    // 寻找当前心率对应的Mb的index
                    $(mbArray).each(function (i, v) {
                        if (v == $(".mb" + thisXlEq).attr("class").split(" ")[0]) {
                            thisMbIndex = i;
                            return false;
                        }
                    });
                    var pevMbEq, pevMbClass, nextMbEq, nextMbClass;
                    // 找到前一个脉搏点
                    if ($(".mb").eq(thisMbIndex - 1).length == 1) {
                        pevMbClass = $(".mb").eq(thisMbIndex - 1).attr("class").split(" ")[0];
                        pevMbEq = pevMbClass.replace("mb", '');
                        // 如果当前Mb点的前一个点没有对应的Xl点（有对应的Mb点） 并且在一天以内
                        if ($(".xl" + pevMbEq).length == 0 && (0 <= thisXlEq - pevMbEq && thisXlEq - pevMbEq <= 6)) {
                            xzEqStr = xzEqStr + pevMbClass + 'first,';
                        }
                    }
                    // 追加当前Eq 心率大则追加心率 脉搏大则追加脉搏 Y轴是逆向 所以反着判断
                    if (parseFloat($(this).attr("cy")) <= parseFloat($(".mb" + thisXlEq).attr("cy"))) {
                        xzEqStr = xzEqStr + 'xl' + thisXlEq + ',';
                    } else {
                        xzEqStr = xzEqStr + $(".mb" + thisXlEq).attr("class").split(" ")[0] + ',';
                    }
                    // 找到下一个脉搏点
                    if ($(".mb").eq(thisMbIndex + 1).length == 1) {
                        nextMbClass = $(".mb").eq(thisMbIndex + 1).attr("class").split(" ")[0];
                        nextMbEq = nextMbClass.replace("mb", '');
                        // 如果下一个Mb点没有对应的Xl点（有对应的Mb点） 并且 在一天以内
                        if ($(".xl" + nextMbEq).length == 0 && nextMbEq - thisXlEq <= 6) {
                            xzEqStr = xzEqStr + nextMbClass + 'last,';
                            shaowArry.push(xzEqStr);
                            xzEqStr = '';
                            // 如果下一个Mb点超过了一天
                        } else if (nextMbEq - thisXlEq > 6) {
                            shaowArry.push(xzEqStr);
                            xzEqStr = '';
                        }
                    } else if ($(".mb").eq(thisMbIndex + 1).length == 0) {
                        shaowArry.push(xzEqStr);
                        xzEqStr = '';
                    }
                });
                //console.log(shaowArry);

                // 开始循环画图形
                var pointsChart = '';
                for (var si = 0; si < shaowArry.length; si++) {
                    var shaowA = shaowArry[si].substring(0, shaowArry[si].length - 1); // 清楚字符串的最后一个逗号（,）
                    var shaow = shaowA.split(",");
                    for (var ssi = 0; ssi < shaow.length; ssi++) {
                        var thisClass = shaow[ssi];
                        var thisEq = thisClass.replace(/[a-z]/g, '');
                        if (thisClass.indexOf("first") !== -1) {
                            var thisEqX = $("." + thisClass.replace("first", "")).attr("cx");
                            var thisEqY = $("." + thisClass.replace("first", "")).attr("cy");
                            pointsChart = pointsChart + thisEqX + ',' + thisEqY + ' ';
                        } else if (thisClass.indexOf("last") !== -1) {
                            var thisEqX = $("." + thisClass.replace("last", "")).attr("cx");
                            var thisEqY = $("." + thisClass.replace("last", "")).attr("cy");
                            pointsChart = pointsChart + thisEqX + ',' + thisEqY + ' ';
                            reverseArray();
                        } else {
                            var thisEqX = parseFloat($("." + thisClass).attr("cx"));
                            var thisEqY = parseFloat($("." + thisClass).attr("cy"));
                            var thisDyEqX, thisDyEqY;
                            // 如果不是最后一个
                            if (ssi < shaow.length - 1) {
                                // 判断是否交叉
                                var nextClass = shaow[ssi + 1];
                                var nextEq = nextClass.replace(/[a-z]/g, '');
                                var nextEqX, nextEqY, nextDyEqX, nextDyEqY;
                                if (thisClass.indexOf("xl") !== -1) {
                                    nextEqX = parseFloat($(".xl" + nextEq).attr("cx"));
                                    nextEqY = parseFloat($(".xl" + nextEq).attr("cy"));
                                    nextDyEqX = parseFloat($(".mb" + nextEq).attr("cx"));
                                    nextDyEqY = parseFloat($(".mb" + nextEq).attr("cy"));
                                    thisDyEqX = parseFloat($(".mb" + thisEq).attr("cx"));
                                    thisDyEqY = parseFloat($(".mb" + thisEq).attr("cy"));
                                } else if (thisClass.indexOf("mb") !== -1) {
                                    nextEqX = parseFloat($(".mb" + nextEq).attr("cx"));
                                    nextEqY = parseFloat($(".mb" + nextEq).attr("cy"));
                                    nextDyEqX = parseFloat($(".xl" + nextEq).attr("cx"));
                                    nextDyEqY = parseFloat($(".xl" + nextEq).attr("cy"));
                                    thisDyEqX = parseFloat($(".xl" + thisEq).attr("cx"));
                                    thisDyEqY = parseFloat($(".xl" + thisEq).attr("cy"));
                                }
                                var line1Start = { x: thisEqX, y: thisEqY }, line1End = { x: nextEqX, y: nextEqY };
                                var line2Start = { x: thisDyEqX, y: thisDyEqY }, line2End = { x: nextDyEqX, y: nextDyEqY };
                                var intersection = utils.segmentsIntr(line1Start, line1End, line2Start, line2End);
                                if (intersection == "no") {  // 不相交
                                    pointsChart = pointsChart + String(thisEqX) + ',' + String(thisEqY) + ' ';
                                } else {                   // 相交
                                    var interX = String(intersection.x.toFixed(2));
                                    var interY = String(intersection.y.toFixed(2));
                                    pointsChart = pointsChart + String(thisEqX) + ',' + String(thisEqY) + ' ' + interX + ',' + interY + ' ';
                                }
                            } else {
                                pointsChart = pointsChart + String(thisEqX) + ',' + String(thisEqY) + ' ';
                                reverseArray();
                            }
                        }
                    }
                    // 倒着循环的函数
                    function reverseArray() {
                        for (var rei = shaow.length - 1; rei >= 0; rei--) {
                            var thisZhou = shaow[rei];
                            var thisZhouEq = thisZhou.replace(/[a-z]/g, '');
                            var thisZhouX = parseFloat($("." + thisZhou).attr("cx"));
                            var thisZhouY = parseFloat($("." + thisZhou).attr("cy"));
                            if (thisZhou.indexOf("first") !== -1 || thisZhou.indexOf("last") !== -1) {
                                continue;
                            } else {
                                if (thisZhou.indexOf("mb") !== -1) {
                                    var duiYingX = parseFloat($(".xl" + thisZhouEq).attr("cx"));
                                    var duiYingY = parseFloat($(".xl" + thisZhouEq).attr("cy"));
                                    //var duiYingZhou=thisZhou.replace("mb","xl");
                                } else if (thisZhou.indexOf("xl") !== -1) {
                                    var duiYingX = parseFloat($(".mb" + thisZhouEq).attr("cx"));
                                    var duiYingY = parseFloat($(".mb" + thisZhouEq).attr("cy"));
                                    //var duiYingZhou=thisZhou.replace("xl","mb");
                                }
                                // 如果不是第一个
                                if (rei - 1 >= 0) {
                                    // 判断交叉
                                    var pevClass = shaow[rei - 1];
                                    var pevEq = pevClass.replace(/[a-z]/g, '');
                                    var pevEqX, pevEqY, pevDyEqX, pevDyEqY;
                                    if (thisZhou.indexOf("xl") !== -1) {
                                        pevEqX = parseFloat($(".xl" + pevEq).attr("cx"));
                                        pevEqY = parseFloat($(".xl" + pevEq).attr("cy"));
                                        pevDyEqX = parseFloat($(".mb" + pevEq).attr("cx"));
                                        pevDyEqY = parseFloat($(".mb" + pevEq).attr("cy"));
                                    } else if (thisZhou.indexOf("mb") !== -1) {
                                        pevEqX = parseFloat($(".mb" + pevEq).attr("cx"));
                                        pevEqY = parseFloat($(".mb" + pevEq).attr("cy"));
                                        pevDyEqX = parseFloat($(".xl" + pevEq).attr("cx"));
                                        pevDyEqY = parseFloat($(".xl" + pevEq).attr("cy"));
                                    }
                                    var line1Start = { x: duiYingX, y: duiYingY }, line1End = { x: pevDyEqX, y: pevDyEqY };
                                    var line2Start = { x: thisZhouX, y: thisZhouY }, line2End = { x: pevEqX, y: pevEqY };
                                    var intersection = utils.segmentsIntr(line1Start, line1End, line2Start, line2End);
                                    if (intersection == "no") {  // 不相交
                                        pointsChart = pointsChart + String(duiYingX) + ',' + String(duiYingY) + ' ';
                                    } else {                   // 相交
                                        var interXX = String(intersection.x.toFixed(2));
                                        var interYY = String(intersection.y.toFixed(2));
                                        pointsChart = pointsChart + String(duiYingX) + ',' + String(duiYingY) + ' ' + interXX + ',' + interYY + ' ';
                                    }
                                } else {
                                    pointsChart = pointsChart + String(duiYingX) + ',' + String(duiYingY) + ' ';
                                }
                            }
                        }
                    }

                    // 循环结束 绘制图形
                    $(document.createElementNS('http://www.w3.org/2000/svg', 'polygon')).attr({
                        points: pointsChart,
                        //style:"fill:rgba(240, 0, 0, 0.3);",
                        style: "fill:url(#grid);",
                        class: 'shadowChart',
                    }).appendTo(".zlylChart svg");
                    pointsChart = '';
                }

                // 体温脉搏文字标记
                for (var tipi = 0; tipi < tip.length; tipi++) {
                    var upCrz = tip[tipi].UP.RCZ;       // 出入转
                    var upSs = tip[tipi].UP.SS;         // 手术
                    var upWjsm = tip[tipi].UP.WJSM;     // 未记说明
                    var upSb = tip[tipi].UP.SB;        // 上标
                    var downXb = tip[tipi].DOWN.XB;     // 下标
                    var downWjsm = tip[tipi].DOWN.WJSM;     // 未记说明
                    var upText = '', downText = '', color;

                    if (upCrz !== null && upCrz !== undefined) {
                        color = utils.colorCompute(tip[tipi].UP.RCZYS);
                        upText = upText + '<span style="color:' + color + '">' + upCrz + '</span>';
                    }
                    if (upSs !== null && upSs !== undefined) {
                        color = utils.colorCompute(tip[tipi].UP.SSYS);
                        upText = upText + '<span style="color:' + color + '">' + upSs + '</span>';
                    }
                    if (upWjsm !== null && upWjsm !== undefined) {
                        color = utils.colorCompute(tip[tipi].UP.WJSMYS);
                        upText = upText + '<span style="color:' + color + '">' + upWjsm + '</span>';
                    }
                    if (upSb !== null && upSb !== undefined) {
                        color = utils.colorCompute(tip[tipi].UP.SBYS);
                        upText = upText + '<span style="color:' + color + '">' + upSb + '</span>';
                    }
                    if (downXb !== null && downXb !== undefined) {
                        color = utils.colorCompute(tip[tipi].DOWN.XBYS);
                        downText = downText + '<span style="color:' + color + '">' + downXb + '</span>';
                    }
                    if (downWjsm !== null && downWjsm !== undefined) {
                        color = utils.colorCompute(tip[tipi].DOWN.WJSMYS);
                        downText = downText + '<span style="color:' + color + '">' + downWjsm + '</span>';
                    }
                    // 追加
                    if (upText !== '') {
                        var smallUpTd = $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr").eq(0).find(".smallTable").find("tr:first").children("td");
                        smallUpTd.eq(tipi).css("position", "relative").append('<div class="upText">' + upText + '</div>');
                    }
                    if (downText !== '') {
                        var smallEndTd = $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr").eq(2).find(".smallTable").find("tr:last").children("td");
                        smallEndTd.eq(tipi).css("position", "relative").append('<div class="downText">' + downText + '</div>');
                    }
                }
            }

            // 其它护理数据 DOWNTABLE 节点不存在
            if (responseTxt.Result.OUTPUT.DOWNTABLE) {
                var row = responseTxt.Result.OUTPUT.DOWNTABLE.ROWS.ROW;
                $(row).each(function (rowi, rowv) {
                    if (rowv.MC == "呼吸")
                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody").append('<tr><td style="font-weight: bold; height:33px;">' + rowv.MC + '</td></tr>');
                    else
                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody").append('<tr><td style="font-weight: bold;">' + rowv.MC + '</td></tr>');
                    // 追加容器
                    for (var pci = 0; pci < 7; pci++) {
                        switch (rowv.PC) {
                            case "6":
                                $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last").append('<td style="width:12.5%"><table class="smallTable"><tr><td style="vertical-align:top;"></td><td style="vertical-align:bottom;"></td><td style="vertical-align:top;"></td><td style="vertical-align:bottom;"></td><td style="vertical-align:top;"></td><td style="vertical-align:bottom;"></td></tr></table></td>');
                                break;
                            case "2":
                                $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last").append('<td style="width:12.5%"><table class="smallTable"><tr><td style="width:50%"></td><td style="width:50%"></td></tr></table></td>');
                                break;
                            case "1":
                                $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last").append('<td style="width:12.5%"></td>');
                                break;
                        }
                    }
                    // 追加数据
                    /*var rowNr=rowv.NR.split("|");*/
                    switch (rowv.PC) {
                        case "6":
                            if (rowv.MC == "呼吸") {
                                $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last td").css("color", "rgb(0, 137, 255)").css("height", "33px");
                                $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last td:first").css("color", "#000");
                            }
                            if (rowv.NR) {
                                var rowNr = rowv.NR.split("|");
                                for (var rowNri = 0; rowNri < rowNr.length; rowNri++) {
                                    //var textValign='top';
                                    // if(rowNri!==0 && (rowNr[rowNri-1].split(",")[1]=="呼吸机" || rowNr[rowNri-1].split(",")[0]!=="")){
                                    // 	if(rowNri>1 && (rowNr[rowNri-2].split(",")[1]=="呼吸机" || rowNr[rowNri-2].split(",")[0]!==""))
                                    // 		textValign='top';
                                    // 	else
                                    // 		textValign='bottom';
                                    // }
                                    // if(rowNr[rowNri].split(",")[1]=="呼吸机"){
                                    // 	$("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last .smallTable td").eq(rowNri).text("®").css("font-size","20px").css("vertical-align",textValign);
                                    // }else{
                                    // 	var thisNr=rowNr[rowNri].split(",")[0];
                                    // 	$("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last .smallTable td").eq(rowNri).text(thisNr).css("vertical-align",textValign);
                                    // }

                                    if (rowNr[rowNri].split(",")[1] == "呼吸机") {
                                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last .smallTable td").eq(rowNri).text("®").css("font-size", "20px");
                                    } else {
                                        var thisNr = rowNr[rowNri].split(",")[0];
                                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last .smallTable td").eq(rowNri).text(thisNr);
                                    }
                                }
                            }

                            break;
                        case "2":
                            // 判断值容器的显示宽度
                            var smallTdW = $("#zhenLiao").width() * 0.125 / 2 - 2;

                            if (rowv.MC == "血压(mmHg)") {
                                if (rowv.NR) {
                                    var rowNr = rowv.NR.split("|");
                                    for (var rowNri = 0; rowNri < rowNr.length; rowNri++) {
                                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last .smallTable td").eq(rowNri).append('<div class="sanD" style="width:' + smallTdW + 'px;">' + rowNr[rowNri].replace(",", "/") + '</div>');
                                    }
                                }
                            } else {
                                if (rowv.NR) {
                                    var rowNr = rowv.NR.split("|");
                                    for (var rowNri = 0; rowNri < rowNr.length; rowNri++) {
                                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last .smallTable td").eq(rowNri).css('max-width', smallTdW).text(rowNr[rowNri]).addClass('Behidden');
                                    }
                                }
                            }
                            break;
                        case "1":
                            var MAXTdW = $("#zhenLiao").width() * 0.125;
                            if (rowv.NR) {
                                var rowNr = rowv.NR.split("|");
                                for (var rowNri = 0; rowNri < rowNr.length; rowNri++) {
                                    $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last td").eq(rowNri + 1).css('max-width', MAXTdW).text(rowNr[rowNri]).addClass('Behidden');//设置最大宽度
                                }
                            }
                            break;
                    }
                });
            }

            //- 追加表身------------------end

            // 追加表底------------------start
            $("#zhenLiao").append('<div style="position: fixed;bottom: 0;padding-bottom: 10px;width: 100%;padding-right: 70px;box-sizing: border-box;background-color: #fff;z-index: 999;"><table class="zlylTable_foot"><tr><td style="width:12.5%; font-weight: bold;">住院天数</td></tr><tr><td style="width:12.5%; font-weight: bold;">手术天数</td></tr></table></div>');
            $(tableZy).each(function (dai, daValue) {
                $("#zhenLiao .zlylTable_foot>tbody>tr:first").append('<td style="width:12.5%">' + daValue + '</td>');
            });
            $(tableSs).each(function (dai, daValue) {
                $("#zhenLiao .zlylTable_foot>tbody>tr:last").append('<td style="width:12.5%">' + daValue + '</td>');
            });
            // -追加表底-----------------end

            // 调取病历文书等数据--------start
            var kssj = responseTxt.Result.OUTPUT.KSSJ;
            var jssj = responseTxt.Result.OUTPUT.JSSJ;
            blWs(kssj, jssj);
            function blWs(kssj, jssj) {
                var loadAjaxCount = 0;
                $("#LoadedTip").show();
                $.ajax({
                    //初始化病人卡
                    url: serviceChoose + '/Dc_Diagnosisplatform_Doc',
                    async: true,
                    data: JSON.stringify({
                        "IN":
                            {
                                "PATIID": $("#slzyID").attr("data-patiid"),
                                "PAGEID": $("#slzyID").attr("data-pageid"),
                                "BABY": $("#slzyID").attr("data-baby") == "yes" ? 1 : 0,
                                "YH": null,                              //页号传空
                                "KSSJ": kssj,                            //先调用DC_DiagnosisPlatform_Temp返回的KSSJ的值
                                "JSSJ": jssj                             //先调用DC_DiagnosisPlatform_Temp返回的JSSJ的值
                            }
                    }),
                    type: "post",
                    timeout: utils.timeoutSec(),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    //成功
                    success: function (data) {

                        if (data.Result.ERROR) {
                            utils.showHide(data.Result.ERROR.MSG);
                            $("#LoadedTip").hide();
                        } else {
                            // 公共函数 寻找日期td.eq
                            function findDay(day) {
                                var eq;
                                $("#zhenLiao .zlylTable_head>tbody>tr:first>td").each(function () {
                                    if ($(this).text() == day) {
                                        eq = $(this).index();
                                        return false;
                                    } else if ($(this).text() == day.split("-")[2]) {
                                        eq = $(this).index();
                                        return false;
                                    }
                                });
                                return eq;
                            }

                            // 公共函数 寻找时间td.eq
                            function findTime(time) {
                                var eq = "";
                                $("#zhenLiao .zlylTable_head>tbody>tr").eq(1).children("td").eq(1).find("td").each(function (ti, tv) {
                                    if (parseInt(time) < parseInt($(tv).text()) + 4) {
                                        eq = $(tv).index();
                                        return false;
                                    }
                                });
                                return eq;
                            }

                            // 药品跟踪
                            $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody").append('<tr id="ypgzTr"><td style="font-weight: bold; height:180px; vertical-align:middle;">药品跟踪</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                            $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last>td").append('<ul class="ypgzFd"><div class="zheZhaoDiv"></div></ul>');
                            $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last>td:first>ul").remove();
                            //if(data.Result.OUTPUT.YP!==null && data.Result.OUTPUT.YP.R.length>0){
                            if (data.Result.OUTPUT.YP !== null && data.Result.OUTPUT.YP.R !== null) {
                                var yp = data.Result.OUTPUT.YP.R;
                                yp = utils.makeArry(yp);//转换数组
                                $(yp).each(function (ypi, ypv) {
                                    // 获取本条药品的开始执行日期
                                    if(!ypv){return false;}
                                    var ypKssjDate = new Date(ypv.KSZXSJ.split(" ")[0]);
                                    // 获取显示该周的开始日期
                                    var kssjDate = new Date($("#zhenLiao .dh").attr("data-kssj"));
                                    // 判断开嘱时间是否早于当前时间范围
                                    var maxJt = '';
                                    if (ypKssjDate < kssjDate) {
                                        var tdEq = 1;
                                        var tTdEq = 0;
                                        maxJt = '<span class="fs1" aria-hidden="true" data-icon="" style="font-size: 12px;"></span>';
                                    } else { //寻找日期td的eq 时间td的eq
                                        var tdEq = findDay(ypv.KSZXSJ.split(" ")[0]);
                                        var tTdEq = findTime(ypv.KSZXSJ.split(" ")[1].split(":")[0]);
                                    }
                                    // 计算距离顶部的距离
                                    var nowLiCount = $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last>td").eq(tdEq).find("li").length;
                                    var allLiCount = $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last").find("li").length;
                                    if (allLiCount !== 0 && allLiCount > nowLiCount) {
                                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last>td").eq(tdEq).children("ul").css("margin-top", (allLiCount - nowLiCount) * 18);
                                    }
                                    // 计算距离左边的距离
                                    var timeLeft = 0;
                                    var colorLeft = 'auto';
                                    var typeAlign = '';
                                    if (tdEq < 6) {
                                        switch (tTdEq) {
                                            case 1:
                                                timeLeft = "margin-left:20px;";
                                                break;
                                            case 2:
                                                timeLeft = "margin-left:40px;";
                                                break;
                                            case 3:
                                                timeLeft = "margin-left:60px;";
                                                break;
                                            case 4:
                                                timeLeft = "margin-left:80px;";
                                                break;
                                            case 5:
                                                timeLeft = "margin-left:100px;";
                                                break;
                                        }
                                    } else {
                                        $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last>td").eq(tdEq).children("ul").css("right", "0px");
                                        typeAlign = 'style="float:right; margin-left:10px;"';
                                        var zlWidth = $("#zhenLiao").width();
                                        var tdSmallW = zlWidth / 8 / 6;
                                        colorLeft = 400 - tdSmallW * (6 - tTdEq);
                                        switch (tTdEq) {
                                            case 0:
                                                timeLeft = "margin-right:105px; text-align:right;";
                                            case 1:
                                                timeLeft = "margin-right:85px; text-align:right;";
                                                break;
                                            case 2:
                                                timeLeft = "margin-right:65px; text-align:right;";
                                                break;
                                            case 3:
                                                timeLeft = "margin-right:45px; text-align:right;";
                                                break;
                                            case 4:
                                                timeLeft = "margin-right:25px; text-align:right;";
                                                break;
                                            case 5:
                                                timeLeft = "text-align:right;";
                                                break;
                                        }
                                    }

                                    // 追加内容	
                                    /*var typeClass;
                                    switch(ypv.TYPE){
                                        case "临":
                                            typeClass="type-l";
                                            break;
                                        case "长":
                                            typeClass="type-c";
                                            break;
                                        case "滴":
                                            typeClass="type-d";
                                            break;
                                        case "口":
                                            typeClass="type-k";
                                            break;
                                    }*/
                                    var ybClass;
                                    if (ypi !== 0 && ypv.YZID == yp[ypi - 1].YZID) {
                                        ybClass = colorQH("一并");
                                    } else {
                                        ybClass = colorQH("不是一并");
                                    }
                                    function colorQH(qh) {
                                        if ($("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last").find("li").length > 0) {
                                            var lastLiClass = $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last").find("li").last().children(".bgColorLength").attr("class").split(" ")[1];
                                        } else {
                                            var lastLiClass = "zjColorOne";
                                        }
                                        if (qh == "一并") {
                                            return lastLiClass;
                                        } else {
                                            if (lastLiClass == "zjColorTwo") return "zjColorOne";
                                            else return "zjColorTwo";
                                        }
                                    }
                                    // 判断停止时间
                                    var colorL;
                                    if (ypv.JSZXSJ == null) {
                                        colorL = changZhuL;
                                    } else {
                                        var jssj = new Date($("#zhenLiao .dh").attr("data-nowtime"));
                                        var tzsj = new Date(ypv.JSZXSJ.split(" ")[0]);
                                        // 如果停止时间大于结束时间
                                        if (tzsj > jssj) {
                                            colorL = changZhuL;
                                        } else {
                                            // 寻找停止时间的tdEq
                                            var tzTdEq = findDay(ypv.JSZXSJ.split(" ")[0]);
                                            if (new Date($("#zhenLiao .zlylTable_head>tbody>tr:first>td").eq(1).text()) > new Date(ypv.KSZXSJ.split(" ")[0])) {
                                                var ksTdEq = 1;
                                            } else {
                                                var ksTdEq = findDay(ypv.KSZXSJ.split(" ")[0]);
                                            }
                                            var tzTimeEq = findTime(ypv.JSZXSJ.split(" ")[1]);
                                            //var ksTimeEq = findTime(ypv.KSZXSJ.split(" ")[1]);
                                            var allWidth = $("#zhenLiao").width();
                                            //colorL = allWidth/8*(tzTdEq-ksTdEq) + allWidth/8/6*(tzTimeEq-ksTimeEq+1); 
                                            colorL = allWidth / 8 * (tzTdEq - ksTdEq) + allWidth / 8 / 6 * (tzTimeEq + 1);
                                        }
                                    }
                                    var bgColorLength = '<div class="bgColorLength ' + ybClass + '" style="width:' + colorL + 'px; left:' + colorLeft + 'px;"></div>';
                                    var detail = '<dl><dd><b>药品期效：</b><label>' + ypv.QX + '</label></dd><dd><b>药品名称：</b><label>' + ypv.MC + '</label></dd><dd><b>给药途径：</b><label>' + ypv.GYTJ + '</label></dd><dd><b>执行频次：</b><label>' + ypv.ZXPC + '</label></dd><dd><b>单次用量：</b><label>' + ypv.DL + ypv.DW + '</label></dd><dd><b>开始时间：</b><label>' + ypv.KSZXSJ + '</label></dd><dd><b>停止时间：</b><label>' + (ypv.JSZXSJ == null ? '' : ypv.JSZXSJ) + '</label></dd></dl>';
                                    $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last>td").eq(tdEq).children("ul").append('<li style="' + timeLeft + '">' + bgColorLength + maxJt + '<span ' + typeAlign + '>' + ypv.TYPE + '</span><span class="margin-left-10">' + ypv.MC + ' ' + ypv.ZXPC + ' ' + ypv.DL + ypv.DW + '</span>' + detail + '</li>');
                                });
                                // 注册点击事件
                                var ypDetailHammer = $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr>td ul li").hammer();
                                ypDetailHammer.on("tap", function () {
                                    $(this).children("dl").show();
                                    $(this).parent().children(".zheZhaoDiv").show();
                                });
                                // 注册消失事件
                                var xiaoShiHammer = $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr>td ul .zheZhaoDiv").hammer();
                                xiaoShiHammer.on("tap", function () {
                                    $(this).siblings("li").children("dl").hide();
                                    $(this).hide();
                                });
                                // 设置TD的高
                                if (yp.length > 10) {
                                    $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last>td:first").html('<div>药品跟踪</div><span id="ypgzButton" class="fs1" aria-hidden="true" data-icon=""></span>');
                                    $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last>td").css("height", 180).css("vertical-align", "top").css("position", "relative");
                                    // 最多显示10行
                                    $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last li").each(function (i, value) {
                                        if (i > 9) $(this).hide();
                                    });
                                    // 注册展开收缩点击事件
                                    var ypgzButtonHammer = $("#ypgzButton").hammer();
                                    ypgzButtonHammer.on("tap", function () {
                                        if ($(this).attr("data-icon") == "") {
                                            $(this).attr("data-icon", "");
                                            $("#ypgzTr li").show();
                                            $("#ypgzTr>td").css("height", yp.length * 18);
                                        } else {
                                            $(this).attr("data-icon", "");
                                            $("#ypgzTr li").each(function (i, value) {
                                                if (i > 9) $(this).hide();
                                            });
                                            $("#ypgzTr>td").css("height", 180);
                                        }
                                    });
                                } else {
                                    $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last>td").css("height", yp.length * 18).css("vertical-align", "top").css("position", "relative");
                                }
                                $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody>tr:last>td:first").removeAttr("style").css("font-weight", "bold").css("vertical-align", "middle");

                            }
                            // 医嘱
                            $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody").append('<tr id="yzTr"><td style="font-weight: bold; height:90px; vertical-align:middle;">医嘱</td><td><div class="zzDiv"></div></td><td><div class="zzDiv"></div></td><td><div class="zzDiv"></div></td><td><div class="zzDiv"></div></td><td><div class="zzDiv"></div></td><td><div class="zzDiv"></div></td><td><div class="zzDiv"></div></td></tr>');
                            if (data.Result.OUTPUT.YZ !== null && data.Result.OUTPUT.YZ.R !== null) {
                                var yzList = data.Result.OUTPUT.YZ.R;
                                yzList = utils.makeArry(yzList);//转换数组
                                $(yzList).each(function (i, value) {
                                    if(!value){return false;};
                                    var yzDayEq = findDay(value.SJ.split(" ")[0]);
                                    // 判断类别
                                    var yzColor = "#000";
                                    if (value.ZLLB == "D" || value.ZLLB == "C") yzColor = "#001BFF";
                                    /*// 医嘱明细 单独掉接口 DC_Advice_Exec
                                    var yzDetal = '<ul class="yzDetail"><li><b>医嘱名称：</b><span>'+value.MC+'</span></li><li><b>开始时间：</b><span>'+value.SJ+'</span></li><li class="x"></li><li><b>执行时间：</b><span>'+value.SJ+'</span></li><li><b>执行科室：</b><span>'+value.SJ+'</span></li><li><b>执行状态：</b><span>'+value.SJ+'</span></li><li><b>执行说明：</b><span>'+value.SJ+'</span></li><li><b>执行情况：</b><span>'+value.SJ+'</span></li><li class="x"></li></ul>';
                                    */// 追加医嘱
                                    $("#yzTr td").eq(yzDayEq).append('<div class="yzList" data-yzid="' + value.YZID + '" data-kssj="' + value.SJ + '"><p style="color:' + yzColor + ';">' + value.MC + '</p></div>');
                                });
                                // 注册点击事件
                                var yzListHammer = $("#yzTr td .yzList").hammer();
                                yzListHammer.on("tap", function () {
                                    $(this).children(".yzDetail").remove();
                                    zhiXingData($(this));
                                });

                                // 点击调用函数
                                function zhiXingData(thisDom) {
                                    $("#LoadedTip").show();
                                    $.ajax({
                                        url: serviceChoose + "/DC_Advice_Exec",
                                        type: "post",
                                        timeout: utils.timeoutSec(),
                                        dataType: "json",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        data: JSON.stringify({
                                            "PATIID": $("#slzyID").attr("data-patiid"),             // 病人ID
                                            "PAGEID": $("#slzyID").attr("data-pageid"),             // 第几次住院 
                                            "BABY": $("#slzyID").attr("data-baby") == "yes" ? 1 : 0,      // 是否BABY
                                            "YZID": thisDom.attr("data-yzid")                       // 医嘱ID
                                        }),
                                        success: function (responseTxt) {
                                            if (responseTxt.Result.ERROR) {
                                                $("#LoadedTip").hide();
                                                utils.showHide(responseTxt.Result.ERROR.MSG);
                                            } else {
                                                // 准备数据
                                                var yzName = '<li><b>医嘱名称：</b><span>' + thisDom.children("p").text() + '</span></li>';
                                                var kssj = '<li><b>开始时间：</b><span>' + thisDom.attr("data-kssj") + '</span></li><li class="x"></li>';
                                                var zxks = '<li><b>执行科室：</b><span>' + (responseTxt.Result.YZEXEC.YZZX.ZXKS == null ? "" : responseTxt.Result.YZEXEC.YZZX.ZXKS) + '</span></li>';
                                                var zxzt = '<li><b>执行状态：</b><span>' + (responseTxt.Result.YZEXEC.YZZX.ZXZT == null ? "" : responseTxt.Result.YZEXEC.YZZX.ZXZT) + '</span></li>';
                                                var zxsm = '<li><b>执行说明：</b><span>' + (responseTxt.Result.YZEXEC.YZZX.ZXSM == null ? "" : responseTxt.Result.YZEXEC.YZZX.ZXSM) + '</span></li><li class="x"></li>';
                                                // 执行情况循环
                                                var zxqkItem = responseTxt.Result.YZEXEC.YZZX.ZXQK;
                                                var zxqkLi = '';
                                                if (zxqkItem != null && zxqkItem != undefined) {
                                                    if (zxqkItem.ITEM) {
                                                        var YZZXQKITEM = utils.makeArry(zxqkItem.ITEM);//转换数组
                                                        for (var zxqki = 0; zxqki < YZZXQKITEM.length; zxqki++) {
                                                            zxqkLi = zxqkLi + '<li>' + (YZZXQKITEM[zxqki].ZXZY == null ? "" : YZZXQKITEM[zxqki].ZXZY) + '</li><li><div class="zxr">' + (YZZXQKITEM[zxqki].ZXR == null ? "" : YZZXQKITEM[zxqki].ZXR) + '</div><div class="zxsj">' + (YZZXQKITEM[zxqki].ZXSJ == null ? "" : YZZXQKITEM[zxqki].ZXSJ) + '</div></li>';
                                                        }
                                                    }
                                                }
                                                var zxqk = '<li><b>执行情况：</b></li>';

                                                var yzDetal = '<ul class="yzDetail">' + yzName + kssj + zxzt + zxks + zxsm + zxqk + zxqkLi + '</ul>';
                                                thisDom.append(yzDetal);
                                                if (thisDom.parent().index() > 5) thisDom.find(".yzDetail").css("right", "0px");
                                                else thisDom.find(".yzDetail").css("left", "0px");
                                                thisDom.find(".yzDetail").css("margin-top", "-" + (thisDom.find(".yzDetail").height() + 39 + "px")).show();
                                                thisDom.siblings(".zzDiv").show();
                                                $("#LoadedTip").hide();
                                            }
                                        },
                                        complete: function (XMLHttpRequest, status) {
                                            utils.errorAjax(status, zhiXingData, [thisDom]);
                                        }
                                    });
                                }

                                // 消失事件
                                var zzDivHammer = $("#yzTr td .zzDiv").hammer();
                                zzDivHammer.on("tap", function () {
                                    $(this).parent().find(".yzDetail").hide();
                                    $(this).hide();
                                });
                                // 最多显示5行
                                if (yzList.length > 5) {
                                    $("#yzTr td:first").html('<div>医嘱</div><span id="yzButton" class="fs1" aria-hidden="true" data-icon=""></span>');
                                    $("#yzTr td .yzList").each(function (i, value) {
                                        if (i > 4) $(this).hide();
                                    });
                                    // 注册下拉收缩事件
                                    var yzButtomHammer = $("#yzButton").hammer();
                                    yzButtomHammer.on("tap", function () {
                                        if ($(this).attr("data-icon") == "") {
                                            $(this).attr("data-icon", "");
                                            $("#yzTr td .yzList").show();
                                        } else {
                                            $(this).attr("data-icon", "");
                                            $("#yzTr td .yzList").each(function (i, value) {
                                                if (i > 4) $(this).hide();
                                            });
                                        }
                                    });
                                }
                            }

                            // 病历文书，报告
                            $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody").append('<tr id="blwsTr"><td style="font-weight: bold; height:90px; vertical-align:middle;">病历文书</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                            $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody").append('<tr id="fjbgTr"><td style="font-weight: bold; height:90px; vertical-align:middle;">辅检报告</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
							     //在住院一览中加入WEB病历的相关查询
							if(localStorage.configWEBUrl){
								BLWEBList();
							}
							 function BLWEBList() {
								 		  var tempwebksId=JSON.parse(localStorage.currentPatient).KSID;
								  var tempwebksList=JSON.parse(localStorage.userInfo).Result.KS.split(',');
								  var tempwebksName="";
								  tempwebksList.forEach(function(v,i) {
									   if(v.indexOf(tempwebksId) != -1 ){
										    tempwebksName=v.split(";")[1];
									   }
								  })
                                $.ajax({
                                    url: localStorage.configWEBUrl +'/ThirdInterface/QueryPatVisitDocInfo',
                                    type: "post",
                                    data: JSON.stringify({
                                              "PatId": $("#slzyID").attr("data-patiID"),//"患者ID"
                                         "VisitId": $("#slzyID").attr("data-pageID"),//"就诊ID，住院为主页ID，门诊为挂号ID",
                                         "VisitType": "2",//就诊类型，住院为 2 ，门诊为 1
										"UserName": JSON.parse(localStorage.userInfo).Result.XM,
										"UserId": JSON.parse(localStorage.userInfo).Result.UID,
										"UserDeptId": tempwebksId,
										"UserDeptName": tempwebksName
                                           
                                    }),
                                    timeout: utils.timeoutSec(),
                                    dataType: "json",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    success: function (responseTxt) {
										if(responseTxt.length > 0){
												 responseTxt.forEach(function(value,i) {
                                            var tdEq = findDay(value.CREATE_TIME.split(" ")[0]);
											 $("#blwsTr").children("td").eq(tdEq).append('<p data-webMRID="' + value.DOC_ID + '"  data-webMRURL="'+value.PREVIEW_URL+'" data-zl="2" data-ym="' + value.DOC_NAME + '" data-yzid="' + value.DOC_ID + '">' + value.DOC_NAME + '</p>');
											//$("#blwsTr").children("td").eq(tdEq).append('<a  style="display:block" data-webURL="' + value.PREVIEW_URL + '" href="'+value.PREVIEW_URL+'" target="_blank">' + value.DOC_NAME + '</a>');
										});
										}
									
									},
										complete: function (XMLHttpRequest, textStatus) {
									utils.errorAjax(textStatus,BLWEBList,[]);
									//$("#LoadedTip").hide();
								}
								});
                            }
                            // 追加病历 检查 列表
                            if (data.Result.OUTPUT.BL !== null) {
                                var bl = data.Result.OUTPUT.BL.R;
                                bl = utils.makeArry(bl);//转换数组
                                $(bl).each(function (i, value) {
                                    if(!value){return false}
                                    var tdEq = findDay(value.SJ.split(" ")[0]);
                                    switch (value.LB) {
                                        // 病程记录 病历
                                        case "1":
                                            $("#blwsTr").children("td").eq(tdEq).append('<p data-zl="' + value.ZL + '" data-ym="' + value.YM + '" data-yzid="' + value.YZID + '">' + value.MC + '</p>');
                                            break;
                                        // 检查
                                        //case "2":
                                        //	debugger;
                                        //	$("#fjbgTr").children("td").eq(tdEq).append('<p data-gp="'+value.GP+'" data-zl="'+value.ZL+'" data-lb="'+value.LB+'" data-ym="'+value.YM+'" data-id="'+value.ID+'" data-yzid="'+value.YZID+'">'+value.MC+'</p>');
                                        //	if($("#lclj_bgDiv").find(".gpButton").length<1){
                                        //		$("#lclj_bgDiv").append('<div class="gpButton">观片</div>');
                                        //	}
                                        //	break;
                                        // 检验
                                        //case "3":
                                        // 判断是否有名字重复的报告名称 有则标记data-db=yes 诊疗一览开始要对比检验指标，现在不对比了，后台接口给不到，所以先注释掉
										/*var dataDB="no";
										$(bl).each(function(jyi,jyvalue){
											if(jyvalue.MC==value.MC && jyi!==i){ 
												dataDB="yes";
												return false;
											}
										});
										debugger; data-db="'+dataDB+'"*/
                                        //	$("#fjbgTr").children("td").eq(tdEq).append('<p data-yzid="'+value.YZID+'" data-bbid="'+value.JYBW.split("_")[0]+'" data-id="'+value.ID+'">'+value.MC+'</p>');
                                        //	break;
                                    }
                                });
                            }
                            // 追加检验 列表 为了有指标对比，所以单独用检验的接口获取检验列表						
                            jydlList();
                            function jydlList() {
                                $("#LoadedTip").show();
                                var TempserviceChoose ='../api/services/doc/Lis';
                                $.ajax({
                                    url: TempserviceChoose + '/DC_Prove_List',
                                    type: "post",
                                    data: JSON.stringify({
                                        "IN":
                                            {
                                                "PATIID": $("#slzyID").attr("data-patiID"),
                                                "PAGEID": $("#slzyID").attr("data-pageID"),
                                                "Type":1,
                                                "OrderID":null, //医嘱ID
                                                "ReportID":null //报告ID
                                            }
                                    }),
                                    timeout: utils.timeoutSec(),
                                    dataType: "json",
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    success: function (responseTxt) {
                                        if (responseTxt.Result["#text"]) {
                                            utils.showHide("检验报告列表加载失败：" + responseTxt.Result["#text"]);
                                        } else if (responseTxt.Result.ERROR) {
                                            utils.showHide("检验报告列表加载失败：" + responseTxt.Result.ERROR.MSG);
                                        } else if (responseTxt.Result.ITEMLIST !== null &&responseTxt.Result.ITEMLIST!="") {
                                            $("#lclj_bgDiv").append('<div class="dbButton">对比</div>');
                                            // 给对比注册点击事件
                                            var hammerjyzbdb = $("#lclj_bgDiv .dbButton").hammer();
                                            hammerjyzbdb.on("tap", function () {
                                                JYduiBi();
                                            });
                                            var textCont = "";
                                            if (responseTxt.Result.ITEMLIST != "" && responseTxt.Result.ITEMLIST != null) {
                                                textCont = responseTxt.Result.ITEMLIST.ITEM
                                                textCont = utils.makeArry(textCont);//转换数组
                                            }                                                                                       
                                            for (var i = 0; i < textCont.length; i++) {
                                                // 根据名称判断是否有相同的数据，有的话，则绑定可对比的标记
                                                var dataDB = "no";
                                                if (textCont[i].JYXM.indexOf(",") !== -1) {
                                                    var textArr = textCont[i].JYXM.split(",");
                                                    var breakBJ = false;
                                                    $(textArr).each(function (ai, av) {
                                                        $(textCont).each(function (jyi, jyvalue) {
                                                            var outDate = textCont[i].SHSJ.split(" ")[0];
                                                            var intDate = jyvalue.SHSJ.split(" ")[0];
                                                            var mouthCount = utils.mouthDays(outDate, intDate);         // 相距时间是否在一个月之内 后续要改 艾华
                                                            if (av == jyvalue.JYXM && jyi !== i && mouthCount) {
                                                                dataDB = "yes";
                                                                breakBJ = true;
                                                                return false;
                                                            } else if (jyvalue.JYXM.indexOf(",") !== -1 && jyi !== i && mouthCount) {
                                                                var arr = jyvalue.JYXM.split(",");
                                                                $(arr).each(function (ri, rv) {
                                                                    if (rv == av) {
                                                                        dataDB = "yes";
                                                                        breakBJ = true;
                                                                        return false;
                                                                    }
                                                                });
                                                            }
                                                        });
                                                        if (breakBJ == true) {
                                                            return false;
                                                        }
                                                    });
                                                } else {
                                                    $(textCont).each(function (jyi, jyvalue) {
                                                        var outDate = textCont[i].SHSJ.split(" ")[0];
                                                        var intDate = jyvalue.SHSJ.split(" ")[0];
                                                        var mouthCount = utils.mouthDays(outDate, intDate);             // 相距时间是否在一个月之内 后续要改 艾华
                                                        if (textCont[i].JYXM == jyvalue.JYXM && jyi !== i && mouthCount) {
                                                            dataDB = "yes";
                                                            return false;
                                                        } else if (jyvalue.JYXM.indexOf(",") !== -1 && jyi !== i && mouthCount) {
                                                            var arr = jyvalue.JYXM.split(",");
                                                            $(arr).each(function (ri, rv) {
                                                                if (rv == textCont[i].JYXM) {
                                                                    dataDB = "yes";
                                                                    return false;
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                                // 判断日期是否在当前 诊疗数据 的日期区间
                                                var kssj = new Date($("#zhenLiao .dh").attr("data-kssj"));
                                                var jssj = new Date($("#zhenLiao .dh").attr("data-nowtime"));
                                                var bgsj = new Date(textCont[i].SHSJ.split(" ")[0]);
                                                if (kssj <= bgsj && bgsj <= jssj) {
                                                    var tdEq = findDay(textCont[i].SHSJ.split(" ")[0]);
                                                    $("#fjbgTr").children("td").eq(tdEq).append('<p data-db="' + dataDB + '" data-yzid="' + textCont[i].YZID + '" data-bbid="' + textCont[i].ID + '" data-lx="' + textCont[i].LX + '">' + textCont[i].JYXM + '</p>');
                                                }
                                            }
                                        }

                                    },
                                    complete: function (XMLHttpRequest, status) {
                                        eventRegister();  // 不论成功与否，都要执行 事件注册 函数
                                        loadAjaxCount++;
                                        if (loadAjaxCount == 3) $("#LoadedTip").hide();
                                    }
                                });
                            }
                            // 追加检查 列表 为了有报告类型，所以单独用检查的接口获取检查列表
                            jcList();
                            function jcList() {
                                if (localStorage.getItem("zlsofMdocs-install-jcUrl")) {
                                    loadAjaxCount++;
                                    if (loadAjaxCount == 3) $("#LoadedTip").hide();
                                } else {
                                    $("#LoadedTip").show();
                                    $.ajax({
                                        url: serviceChoose + '/DC_Examine_List',
                                        type: "post",
                                        timeout: utils.timeoutSec(),
                                        data: JSON.stringify({
                                            "IN":
                                                {
                                                    "PATIID": $("#slzyID").attr("data-patiID"),
                                                    "PAGEID": $("#slzyID").attr("data-pageID")
                                                }
                                        }),
                                        dataType: "json",
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        success: function (responseTxt) {
                                            if (responseTxt.Result === null) {
                                                responseTxt.Result = {};
                                            }
                                            if (responseTxt.Result.ERROR) {
                                                utils.showHide(responseTxt.Result.ERROR.MSG);
                                                $("#LoadedTip").hide();
                                            } else {
                                                if (responseTxt.Result.FILELIST) {
                                                    if ($("#lclj_bgDiv").find(".gpButton").length < 1) {
                                                        $("#lclj_bgDiv").append('<div class="gpButton">观片</div>');
                                                    }
                                                    var FILE = responseTxt.Result.FILELIST.FILE;
                                                    FILE = utils.makeArry(FILE);//转换数组
                                                    for (var i in FILE) {
                                                        // 判断日期是否在当前 诊疗数据 的日期区间
                                                        var tempValue = FILE[i].BGSJ;
                                                        if(tempValue.indexOf('月') != -1){
                                                            var tempY = '20'+tempValue.substring(7,tempValue.length);
                                                            var tempM =tempValue.substring(tempValue.indexOf('月'),tempValue.indexOf('月')-1);
                                                            if(tempM.length == 1){
                                                                tempM = '0'+tempM;
                                                            }
                                                            var tempD = tempValue.substring(0,2);
                                                            FILE[i].BGSJ = tempY +'-' +tempM+'-' + tempD;
                                                        }
                                                        var kssj = new Date($("#zhenLiao .dh").attr("data-kssj"));
                                                        var jssj = new Date($("#zhenLiao .dh").attr("data-nowtime"));
                                                        var bgsj = new Date(FILE[i].BGSJ.split(" ")[0]);
                                                        if (kssj <= bgsj && bgsj <= jssj) {
                                                            var tdEq = findDay(FILE[i].BGSJ.split(" ")[0]);
                                                            $("#fjbgTr").children("td").eq(tdEq).append('<p data-bglx="' + FILE[i].BGLX + '" data-gp="' + FILE[i].GP + '" data-lb="检查" data-id="' + FILE[i].ID + '" data-yzid="' + FILE[i].YZID + '">' + FILE[i].MC + '</p>');
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        complete: function (XMLHttpRequest, status) {
                                            eventRegister();  // 不论成功与否，都要执行 事件注册 函数
                                            loadAjaxCount++;
                                            if (loadAjaxCount == 3) $("#LoadedTip").hide();
                                        }
                                    });
                                }
                            }
                            // 统一注册事件控制 报告
                            function eventRegister() {
                                // 病历
                                $("#blwsTr p").unbind();
                                var hammerBlws = $("#blwsTr p").hammer();
                                hammerBlws.on("tap", function () {
                                    lookBL($(this));
                                });
                                // 检验检查 
                                $("#fjbgTr p").unbind();
                                var hammerFjbg = $("#fjbgTr p").hammer();
                                hammerFjbg.on("tap", function () {
                                    if ($(this).attr("data-lb") == "检查") lookJC($(this));
                                    else lookJY($(this));
                                });
                                // 设置病历的TD高
                                var maxBl = 0;
                                $("#blwsTr").children("td").each(function (i, v) {
                                    if (i > 0) {
                                        if ($(this).find("p").length > maxBl) maxBl = $(this).find("p").length;
                                    } else {
                                        maxBl = $(this).find("p").length;
                                    }
                                });
                                if (maxBl > 8) {
                                    $("#blwsTr td:first").html('<div>病历</div><span id="blButton" class="fs1" aria-hidden="true" data-icon=""></span>');
                                    $("#blwsTr td").each(function (tdi, tdv) {
                                        $(tdv).children("p").each(function (i, v) {
                                            if (i > 7) $(this).hide();
                                        });
                                    });
                                }
                                var hammerblButton = $("#blButton").hammer();
                                hammerblButton.on("tap", function () {
                                    if ($(this).attr("data-icon") == "") {
                                        $(this).attr("data-icon", "");
                                        $("#blwsTr td p").show();
                                    } else {
                                        $(this).attr("data-icon", "");
                                        $("#blwsTr td").each(function (tdi, tdv) {
                                            $(tdv).children("p").each(function (i, v) {
                                                if (i > 7) $(this).hide();
                                            });
                                        });
                                    }
                                });
                                // 设置辅检的TD高
                                var maxBg = 0;
                                $("#fjbgTr").children("td").each(function (i, v) {
                                    if (i > 0) {
                                        if ($(this).find("p").length > maxBg) maxBg = $(this).find("p").length;
                                    } else {
                                        maxBg = $(this).find("p").length;
                                    }
                                });
                                if (maxBg > 8) {
                                    $("#fjbgTr td:first").html('<div>辅检报告</div><span id="fjbgButton" class="fs1" aria-hidden="true" data-icon=""></span>');
                                    $("#fjbgTr td").each(function (tdi, tdv) {
                                        $(tdv).children("p").each(function (i, v) {
                                            if (i > 7) $(this).hide();
                                        });
                                    });
                                }
                                var hammerfjbgButton = $("#fjbgButton").hammer();
                                hammerfjbgButton.on("tap", function () {
                                    if ($(this).attr("data-icon") == "") {
                                        $(this).attr("data-icon", "");
                                        $("#fjbgTr td p").show();
                                    } else {
                                        $(this).attr("data-icon", "");
                                        $("#fjbgTr td").each(function (tdi, tdv) {
                                            $(tdv).children("p").each(function (i, v) {
                                                if (i > 7) $(this).hide();
                                            });
                                        });
                                    }
                                });
                            }

                            // 手术
                            $("#zhenLiao>.tableBodyDiv>.zlylTable_body>tbody").append('<tr id="ssTr"><td style="font-weight: bold; vertical-align:middle;">手术</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>');
                            $("#ssTr td").append('<div class="zzDiv"></div>');
                            if (data.Result.OUTPUT.SS !== null) {
                                var ss = data.Result.OUTPUT.SS.R;
                                $(ss).each(function (i, value) {
                                    var tdEq = findDay(value.SJ.split(" ")[0]);
                                    var ssMxUl = '<ul class="yzDetail" style="height:150px; margin-top:-170px;"><li style="height:auto;"><div class="bt">手术内容：</div><div class="nr">' + value.NR + '</div><div style="clear:both;"></div></li><li class="x"></li><li style="height:auto;"><div class="bt">手术时间：</div><div class="nr">' + value.SJ + '</div></li></ul>';
                                    $("#ssTr").children("td").eq(tdEq).append('<div class="yzList"><p>' + value.MC + '</p>' + ssMxUl + '</div>');
                                });
                                var sspHammer = $("#ssTr p").hammer();
                                sspHammer.on("tap", function () {
                                    if ($(this).siblings("ul").is(":hidden")) {
                                        $(this).parent().siblings(".zzDiv").show();
                                        if ($(this).parent().parent().index() > 5) {
                                            $(this).siblings("ul").show().css("right", "0px");
                                        } else {
                                            $(this).siblings("ul").show().css("left", "0px");
                                        }
                                    }
                                });
                                var ssZzDivHammer = $("#ssTr .zzDiv").hammer();
                                ssZzDivHammer.on("tap", function () {
                                    $(this).hide();
                                    $(this).siblings(".yzList").children("ul").hide();
                                });
                            }


                        }
                    },
                    complete: function (XMLHttpRequest, status) {
                        loadAjaxCount++;
                        if (loadAjaxCount == 3) $("#LoadedTip").hide();
                    }
                });
            }
            //- 调取病历文书等数据-------end
        }

        // 病历内容
        function lookBL(thisP) {
            $("#LoadedTip").show();
            var zl = thisP.attr("data-zl");
            var yzid = thisP.attr("data-yzid");
            var ym = thisP.attr("data-ym");
			var webMRID =thisP.attr("data-webMRID");
			var webMRURL =thisP.attr("data-webMRURL");
			var pdfBox_nurse='pdf-'+thisP.attr("data-yzid");
		    if(webMRID && webMRID != 'undefined'){
				if ( $(".webBox").length  == '0' ) {
					 $("#lclj_bgDiv").append('<div class="webBox" style="height:100%;overflow:auto;" id="' + pdfBox_nurse + '"></div>');
				}else{
					$('.webBox').remove();
					 $("#lclj_bgDiv").append('<div class="webBox" style="height:100%;overflow:auto;" id="' + pdfBox_nurse + '"></div>');
				}
				
	      //$.ajax({
				//url: localStorage.configWEBUrl +'/ThirdInterface/GetContentTextByEmrId?mrId='+webMRID,
				//async: false,
				//timeout: 5000,
				//type: "get",
				//dataType: "json",
				//success: function (responseTxt) {
					 $("#"+pdfBox).html("");
				    //$("#"+pdfBox_nurse).append("<div>"+responseTxt.content+"</div>");
						$("#"+pdfBox_nurse).append('<iframe id="previewpdf3" src="'+webMRURL+'" width="100%" height="100%" frameborder="0"></iframe>');
					  utils.CSHpanzoom(pdfBox_nurse);
					  divHC(pdfBox_nurse);
					 $("#LoadedTip").hide();
				//},
				//error: function () {
					//errorAjax(urlFunction, []);
				//}
              //});
				return false;
				//$("#lclj_bgDiv").append('<div id="zlyl_webBox" class="zlyl_webBox"><div class="zzc"></div><iframe id="zlyl_web" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" width="100%" src="' + weburl + '"></iframe></div>');
			}
			//处理WEB病历单独数据
            // 病程记录 老接口 返回XML
            if (zl !== null && ym == "病程记录") {
                if ($("#lclj_bgDiv").find("#zlyl_xmlBox").length > 0) {
                    // 缓存切换
                    divHC("zlyl_xmlBox");
                    // 控制滚动条定位
                    var yzidScrollTop = document.getElementById("zlyl_xml").contentWindow.document.getElementById(yzid).offsetTop;
                    $("#zlyl_xmlBox").scrollTop(yzidScrollTop);
                } else {
                    var xmlID = "";
                    $("#blwsTr p").each(function () {
                        if ($(this).attr("data-ym") == "病程记录") {
                            xmlID = xmlID + "|" + $(this).attr("data-yzid");
                        }
                    });
                    xmlID = xmlID.substring(1, xmlID.length);  // 清除第一个|
                    $.ajax({
                        url: serviceChoose + "/DC_CaseHistory_Data",
                        type: "post",
                        timeout: utils.timeoutSec(),
                        data: JSON.stringify({
                            "IN": {
                                "FILE": xmlID,                          //病程记录ID，多个病程记录用竖线分隔
                                "DATA": "0",                            //固定传0
                                "TYPE": "0"
                            }
                        }),
                        dataType: "json",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        success: function (responseTxt) {
                            if (responseTxt.Result.ERROR) {
                                $("#LoadedTip").hide();
                                utils.showHide(responseTxt.Result.ERROR.MSG);
                            } else {
                                var bcjlXmlUrl = ".." + responseTxt.Result.FILE;
                                $("#lclj_bgDiv").append('<div id="zlyl_xmlBox" class="zlyl_xmlBox"><div class="zzc"></div><iframe id="zlyl_xml" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" width="100%" src="' + bcjlXmlUrl + '"></iframe></div>');
                                //utils.stopScroll("#zlyl_xmlBox",".tableBodyDiv");
                                divHC("zlyl_xmlBox");
                                document.getElementById("zlyl_xml").onload = function () {
                                    // 加载完成后获取高度
                                    var iframeBody = document.getElementById("zlyl_xml").contentWindow.document.body;
                                    // var gaoDu = iframeBody.children[0].offsetHeight*0.16;
                                    var gaoDu = iframeBody.children[0].offsetHeight;
                                    // 设置遮罩层和iframe的高度
                                    $("#zlyl_xml").css("height", gaoDu);
                                    $("#zlyl_xmlBox .zzc").css("height", gaoDu);
                                    // 放大缩小初始化
                                    utils.CSHpanzoom("zlyl_xmlBox");
                                    // 缓存切换
                                    divHC("zlyl_xmlBox");
                                    // 控制滚动条定位
                                    var yzidScrollTop = document.getElementById("zlyl_xml").contentWindow.document.getElementById(yzid).offsetTop;
                                    $("#zlyl_xmlBox").scrollTop(yzidScrollTop);
                                }

                            }
                        },
                        complete: function (XMLHttpRequest, status) {
                            utils.errorAjax(status, lookBL, [thisP]);
                        }
                    });
                }
                // 病历 病程记录 返回IMG
            } else {
                var pdfBox = "zlylPDF-" + yzid;   // pdf 容器的id	
                if ($("#lclj_bgDiv").find("#" + pdfBox).length > 0) {
                    divHC(pdfBox);
                } else {
                    var pageID = $("#slzyID").attr("data-pageID");
                    var patiID = $("#slzyID").attr("data-patiID");
                    $.ajax({
                        url: serviceChoose + "/DC_CaseHistory_Data",
                        type: 'post',
                        timeout: utils.timeoutSec(),
                        data: JSON.stringify({
                            "IN": {
                                "FILE": yzid,                //文件ID
                                "TYPE": "1",                 //固定传1
                                "PATIID": patiID,            //病人ID
                                "PAGEID": pageID             //主页ID
                            }
                        }),
                        dataType: "json",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        success: function (data) {
                            if (data.Result.ERROR) {
                                $("#LoadedTip").hide();
                                utils.showHide(data.Result.ERROR.MSG);                                
                            } else {
                                $("#lclj_bgDiv").append('<div class="imgBox" id="' + pdfBox + '"></div>');
                                //utils.stopScroll("#"+pdfBox,".tableBodyDiv");
                                var imgUrl = ".." + data.Result.FILE;
                                var imgNo = data.Result.FILE.split("/")[4];
                                var imgCount = data.Result.PageCount;
                                for (var i = 1; i <= parseInt(imgCount); i++) {
                                    $("#" + pdfBox).append('<img style="z-index:10000;" src="' + imgUrl + '/' + imgNo + '_' + i + '.Jpeg"/>');
                                }
                                utils.CSHpanzoom(pdfBox);
                                divHC(pdfBox);
                            };
                        },
                        complete: function (XMLHttpRequest, status) {
                            utils.errorAjax(status, lookBL, [thisP]);
                        }
                    });
                }
            }
        }

        // 检查报告 IMG
        function lookJC(thisID) {
            var fileId = thisID.attr("data-id");
            var gp = thisID.attr("data-gp");
            var yzid = thisID.attr("data-yzid");
            var bglx = thisID.attr("data-bglx");
            var imgBox = "zlylPDF-" + fileId;   // img 容器的id
            if (bglx == "2") {   // 用可跨域接口
                // if($("#"+imgBox).find('iframe').length>0){
                // 	divHC(imgBox,'no','yes');  //控制报告的显示
                // }else{
                $("#LoadedTip").show();
                $.ajax({
                    url: serviceChoose + "/DC_Ris_Examine_Data",
                    type: 'post',
                    timeout: utils.timeoutSec(),
                    dataType: 'json',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        "IN": {
                            "AppointNO": yzid,                    //医嘱ID
                            "ReportID": fileId,                   //报告ID
                            "SpareParam": ""                      //预留字段，传空即可
                        }
                    }),
                    success: function (data) {
                        if (data.Result.ERROR) {
                            utils.showHide(data.Result.ERROR.MSG);
                            $("#LoadedTip").hide();
                        } else if (data.Result.string["#text"] == "0") {
                            utils.showHide("未启用专业版PACS配置，请检查");
                            $("#LoadedTip").hide();
                        } else {
                            var imgUrl = data.Result.string["#text"];
							/*$("#lclj_bgDiv .imgBox").remove();
							$("#lclj_bgDiv").append('<div class="imgBox" id="'+imgBox+'"><div id="thisMask"><span class="fs1" aria-hidden="true" data-icon=""></span></div></div>');
							var iframe = document.createElement("iframe");
							iframe.src = imgUrl;
							iframe.height = 500;
							document.getElementById(imgBox).appendChild(iframe);*/

                            $("#lclj_bgDiv .imgBox").remove();
                            var iframeID = "threedHTML-" + fileId;   //iframe的ID
                            var CoverID = "thisMask-" + fileId;   //遮罩层的ID
                            $("#lclj_bgDiv").append('<div class="imgBox" id="' + imgBox + '"><div id="' + CoverID + '" class="thisMask"></div></div>');

                            var iframe = document.createElement("iframe");
                            iframe.id = iframeID;
                            iframe.src = imgUrl;
                            document.getElementById(imgBox).appendChild(iframe);
                            //加载完成通信获取 iframe高度
                            $(document).ready(function () {
                                document.getElementById(iframeID).onload = function () {
                                    window.addEventListener("message", receiveMessage, false);
                                }
                            });
                            function receiveMessage(e) {
                                if (e.origin != "http://61.128.195.29:7031") {
                                    return;
                                };
                                var winInfoJSON = JSON.parse(e.data);
                                var title = winInfoJSON.height;
                                //utils.showHide(title+"11111");
                                document.getElementById(iframeID).height = title;
                                document.getElementById(CoverID).style.height = title + "px";//设置遮罩层高度
                                window.removeEventListener("message", receiveMessage, false);//移除事件监听
                            };
                            /*//注册关闭事件 父级 #lclj_bgDiv有关闭事件
                        var hammerMask = $("#thisCloseBut").hammer();
                        hammerMask.on("tap",function(){
                            $("#lclj_bgDiv").removeClass("animated bounceInRight bounceOutRight").addClass("animated bounceOutRight");							
                            setTimeout(function(){
                                $("#lclj_bgDiv").hide();
                            }, 1000);  
                            $("#lclj_bgDiv").hide();
                        });*/

                            // 判断是否显示观片  报告的显示
                            if (data.Result.int["#text"] == "1") {
                                divHC(imgBox, 'no', 'yes');
                                JC_guanP(yzid);
                            } else {
                                divHC(imgBox, 'no', 'no');
                            };
                            utils.CSHpanzoom(imgBox);//放大 缩小
                            $("#LoadedTip").hide();
                        };
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        utils.errorAjax(textStatus, lookJC, [thisID]);
                    }
                });
            } else {
                var pageID = $("#slzyID").attr("data-pageID");
                var patiID = $("#slzyID").attr("data-patiID");
                $("#LoadedTip").show();
                $.ajax({
                    url: serviceChoose + "/DC_Examine_Data",
                    type: 'post',
                    timeout: utils.timeoutSec(),
                    dataType: 'json',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        "IN": {
                            "FILE": fileId,              //文件ID                            
                            "PAGEID": pageID,
                            "PATIID": patiID
                        }
                    }),
                    success: function (data) {
                        if (data.Result.ERROR) {
                            utils.showHide(data.Result.ERROR.MSG); // 把MSG改成了ERROR
                            $("#LoadedTip").hide();
                        } else {
                            $("#lclj_bgDiv .imgBox").remove();
                            $("#lclj_bgDiv").append('<div class="imgBox" id="' + imgBox + '"></div>');
                            //utils.stopScroll("#"+imgBox,".tableBodyDiv");
                            var imgUrl = ".." + data.Result.FILE;
                            var imgNo = data.Result.FILE.split("/")[4];
                            var imgCount = data.Result.PageCount;
                            for (var i = 1; i <= parseInt(imgCount); i++) {
                                $("#" + imgBox).append('<img style="z-index:10000;" src="' + imgUrl + '/' + imgNo + '_' + i + '.Jpeg"/>');
                            }
                            utils.CSHpanzoom(imgBox);
                            if (gp == "1") {
                                divHC(imgBox, 'no', 'yes');
                                JC_guanP(yzid);
                            } else {
                                divHC(imgBox, 'no', 'no');
                            }
                        }
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        utils.errorAjax(textStatus, lookJC, [thisID]);
                    }
                });
            }
        }

        // 检验报告 XML
        function lookJY(thisID) {
            $("#fjbgTr p").removeClass("active");
            thisID.addClass("active");
            var jyXmlId = "jyXmlId" + thisID.attr("data-bbid");   // xml 容器的id	
            var jyXmlIframeId = "jyXmlIf" + thisID.attr("data-bbid");   // xml iframe的id	
            var duiBi = thisID.attr("data-db");
            if ($("#lclj_bgDiv").find("#" + jyXmlId).length > 0) {
                divHC(jyXmlId, duiBi);
            } else {
                $("#LoadedTip").show();
                var tempserviceChoose='../api/services/doc/Lis';
                $.ajax({
                    url: tempserviceChoose + "/DC_Prove_Data",
                    type: "post",
                    timeout: utils.timeoutSec(),
                    data: JSON.stringify({
                        "IN": {
                            "LX": "",                                 //类型
                            "YZID": thisID.attr("data-yzid"),         //医嘱ID
                            "BBID": thisID.attr("data-bbid"),         //标本ID
                            "JGCS": "0",
                            "WSW": "0",
                            //添加的三个参数，后期给具体的参数值
                            //"Type": "2",
                            "Type":thisID.attr("data-lx"),
                            //"PatientID": "6077858",
                            "PatientID":JSON.parse(localStorage.currentPatient).PATIID,
                            "Url": "//192.168.32.212:80/271.pdf" 
                        }
                    }),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function (responseTxt) {
                        if (responseTxt.Result.ERROR) {
                            $("#LoadedTip").hide();
                            utils.showHide(responseTxt.Result.ERROR.MSG);
                        } else {
                            var jyXmlUrl = responseTxt.Result.FILE;//检验报告单返回html存储路径
                            $("#lclj_bgDiv").append('<div id="' + jyXmlId + '" class="zlyl_xmlBox"><div class="zzc"></div><iframe id="' + jyXmlIframeId + '" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" width="100%" height="100%" src="' + jyXmlUrl + '"></iframe></div>');
                            //utils.stopScroll("#"+jyXmlId,".tableBodyDiv");
                            document.getElementById(jyXmlIframeId).onload = function () {
                                // 加载完成后获取高度
                                var iframeBody = document.getElementById(jyXmlIframeId).contentWindow.document.body;
                                var gaoDu = iframeBody.children[0].offsetHeight * 0.35;
                                // 设置遮罩层和iframe的高度
                                if(gaoDu == '0'){
                                    gaoDu = 1000;
                                }
                                $("#" + jyXmlIframeId).css("height", gaoDu);
                                $("#" + jyXmlId + " .zzc").css("height", gaoDu);
                                // 放大缩小初始化
                                utils.CSHpanzoom(jyXmlId);
                                // 缓存切换
                                divHC(jyXmlId, duiBi);
                            }
                        }
                    },
                    complete: function (XMLHttpRequest, status) {
                        utils.errorAjax(status, lookJY, [thisID]);
                    }
                });
            }
        }

        // 点击对比按钮
        function JYduiBi() {
            $("#LoadedTip").show();
            var tempserviceChoose='../api/services/doc/Lis';
            $.ajax({
                url: tempserviceChoose + "/DC_GetProveConstrastData",
                async: true,
                type: "post",
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: utils.timeoutSec(),
                data: JSON.stringify({
                    "IN": {
                        "LX": $("#fjbgTr .active").attr("data-lx"),                        //0是新版,1是老板
                        "YZID": $("#fjbgTr .active").attr("data-yzid"),                    //医嘱ID
                        "BBID": $("#fjbgTr .active").attr("data-bbid"),                    //标本ID
                        "FW": "30"                                                         //取历史指标的范围，默认传30，表示30天以内的数据
                    }
                }),
                dataType: "json",
                success: function (responseTxt) {
                    if (responseTxt.Result["#text"]) {
                        $("#LoadedTip").hide();
                        utils.showHide("对比数据加载失败：" + responseTxt.Result["#text"]);
                    } else if (responseTxt.Result.ERROR) {
                        $("#LoadedTip").hide();
                        utils.showHide(responseTxt.Result.ERROR.MSG);
                    } else {
                        if (responseTxt.Result.OUTPUT.DATA.R) {
                            var DEF = responseTxt.Result.OUTPUT.DATA.R;
                            // 获取表头
                            var thText = '<td>项目名称</td><td>单位</td><td>参考值</td>';
                            var VALUE = responseTxt.Result.OUTPUT.DATA.TAB.split(",");
                            for (var i in VALUE) {
                                if (i > 3)
                                    thText = thText + '<td class="hidee" style="display:none;">' + VALUE[i] + '</td>';
                                else
                                    thText = thText + '<td class="showw">' + VALUE[i] + '</td>';
                            }
                            // 超过3个值 则追加横向手势按钮
                            var touchImg = '';
                            if (VALUE.length > 4) {
                                touchImg = '<img src="img/touchLeft.png" class="imgLeft" /><img src="img/touchRight.png" class="imgRight" />';
                            }
                            // 追加返回按钮、标题和容器
                            $("#zlyl_db_Box").empty();
                            var backButton = '<div class="chartDiv"><div><ul><li>结果值</li><li style="margin-left:-7px;">变异率</li></ul></div><div id="chartID" class="chartNr"></div></div><div class="tmc"></div><div class="fhButton"><span class="fs1" aria-hidden="true" data-icon=""></span> 返回</div><p>检验指标对比</p>';
                            var tableBox = '<div class="btTableBox"><table class="bt"><tbody><tr>' + thText + '</tr></tbody></table></div><div class="dbNr"><table></table></div>';
                            $("#zlyl_db_Box").append(touchImg + backButton + tableBox);
                            //utils.stopScroll("#zlyl_db_Box",".tableBodyDiv");				
                            // 追加标准
                            $(DEF).each(function (i, v) {
                                var ck = '';
                                // 判断是否超出参考范围
                                if (v.CK !== null) {
                                    var ckMax = parseFloat(v.CK.split("～")[1]);
                                    var ckMin = parseFloat(v.CK.split("～")[0]);
                                    ck = v.CK;
                                }
                                // 检查值
                                var tdText = '';
                                var jyVal = v.VALUES.VALUE;
                                if (jyVal.length == VALUE.length) {
                                    for (var va in jyVal) {
                                        var icon = '';
                                        var tdColor = '';
                                        if (parseFloat(jyVal[va].JYZ) < ckMin) {
                                            icon = '<span class="fs1" aria-hidden="true" data-icon=""></span>';
                                            tdColor = 'color:#fff; background:rgba(255, 177, 0, 0.47);';
                                        } else if (parseFloat(jyVal[va].JYZ) > ckMax) {
                                            icon = '<span class="fs1" aria-hidden="true" data-icon=""></span>';
                                            tdColor = 'color:#fff; background:rgba(255, 0, 0, 0.5);';
                                        }
                                        if (va > 3) {
                                            tdText = tdText + '<td class="hidee" style="' + tdColor + ' display:none;">' + (jyVal[va].JYZ == null ? "" : ('<label data-byl=' + jyVal[va].BYL + '>' + jyVal[va].JYZ + '</label>')) + icon + '</td>';
                                        } else {
                                            tdText = tdText + '<td class="showw" style="' + tdColor + '">' + (jyVal[va].JYZ == null ? "" : ('<label data-byl=' + jyVal[va].BYL + '>' + jyVal[va].JYZ + '</label>')) + icon + '</td>';
                                        }
                                    }
                                    $("#zlyl_db_Box .dbNr table").append('<tr data-jgz="' + v.JGZ.YMAX + '|' + v.JGZ.YMIM + '" data-byl="' + v.BYL.YMAX + '|' + v.BYL.YMIM + '"><td style="text-align:left; background:rgba(82,187,197,0.1);">' + v.MC + '</td><td style="background:rgba(82,187,197,0.1);">' + (v.DW == null ? "" : v.DW) + '</td><td style="background:rgba(82,187,197,0.1);">' + ck + '</td>' + tdText + '</tr>');
                                } else {
                                    var tdNull = '';
                                    for (var tdC = 0; tdC < VALUE.length; tdC++) {
                                        if (tdC > 3)
                                            tdNull = tdNull + '<td class="hidee" style="display:none;"></td>';
                                        else
                                            tdNull = tdNull + '<td class="showw"></td>';
                                    }
                                    $("#zlyl_db_Box .dbNr table").append('<tr data-jgz="' + v.JGZ.YMAX + '|' + v.JGZ.YMIM + '" data-byl="' + v.BYL.YMAX + '|' + v.BYL.YMIM + '"><td style="text-align:left; background:rgba(82,187,197,0.1);">' + v.MC + '</td><td style="background:rgba(82,187,197,0.1);">' + (v.DW == null ? "" : v.DW) + '</td><td style="background:rgba(82,187,197,0.1);">' + ck + '</td>' + tdNull + '</tr>');
                                    for (var va in jyVal) {
                                        // 根据时间寻找表头的eq
                                        var tdeq = '';
                                        $("#zlyl_db_Box .bt td").each(function (timei, timev) {
                                            if ($(timev).text() == jyVal[va].JYSJ) {
                                                tdeq = $(timev).index();
                                                return false;
                                            }
                                        });
                                        var icon = '';
                                        var tdColor = '', tdBackColor = '';
                                        if (parseFloat(jyVal[va].JYZ) < ckMin) {
                                            icon = '<span class="fs1" aria-hidden="true" data-icon=""></span>';
                                            tdColor = '#fff';
                                            tdBackColor = 'rgba(255, 177, 0, 0.47)';
                                        } else if (parseFloat(jyVal[va].JYZ) > ckMax) {
                                            icon = '<span class="fs1" aria-hidden="true" data-icon=""></span>';
                                            tdColor = '#fff';
                                            tdBackColor = 'rgba(255, 0, 0, 0.5)';
                                        }
                                        var zhiText = (jyVal[va].JYZ == null ? "" : ('<label data-byl=' + jyVal[va].BYL + '>' + jyVal[va].JYZ + '</label>')) + icon;
                                        $("#zlyl_db_Box .dbNr table tr:last td").eq(tdeq).html(zhiText).css("color", tdColor).css("background", tdBackColor);
                                    }
                                }
                            });
                            // 平均分配TD的宽度 
                            if (VALUE.length < 4 || VALUE.length == 4) {
                                var tdCount = $("#zlyl_db_Box .bt td").length - 1;
                                var tdWidth = ($("#zlyl_db_Box").width() - 460) / tdCount;

                                $("#zlyl_db_Box .bt td").css("width", tdWidth + "px");
                                $("#zlyl_db_Box .dbNr table tr td").css("width", tdWidth + "px");

                                $("#zlyl_db_Box .bt td").eq(1).css("width", "130px");
                                $("#zlyl_db_Box .dbNr table tr td").eq(1).css("width", "130px");

                                $("#zlyl_db_Box .bt td").eq(2).css("width", "130px");
                                $("#zlyl_db_Box .dbNr table tr td").eq(2).css("width", "130px");

                                $("#zlyl_db_Box .bt td:first").css("width", "200px");
                                $("#zlyl_db_Box .dbNr table tr td:first").css("width", "200px");

                                // $("#zlyl_db_Box .dbNr table").css("width",(460+tdCount*tdWidth)+"px");
                                // $("#zlyl_db_Box .bt").css("width",(460+tdCount*tdWidth)+"px");
                            } else if (VALUE.length > 4) {
                                //var tdCount = $("#zlyl_db_Box .bt td").length-3;
                                var tdWidth = ($("#zlyl_db_Box").width() - 460) / 4;

                                $("#zlyl_db_Box .bt td").css("width", tdWidth + "px");
                                $("#zlyl_db_Box .dbNr table tr td").css("width", tdWidth + "px");

                                $("#zlyl_db_Box .bt td").eq(1).css("width", "130px");
                                $("#zlyl_db_Box .dbNr table tr td").eq(1).css("width", "130px");

                                $("#zlyl_db_Box .bt td").eq(2).css("width", "130px");
                                $("#zlyl_db_Box .dbNr table tr td").eq(2).css("width", "130px");

                                $("#zlyl_db_Box .bt td:first").css("width", "200px");
                                $("#zlyl_db_Box .dbNr table tr td:first").css("width", "200px");

                                // $("#zlyl_db_Box .dbNr table").css("width",(460+4*tdWidth)+"px");
                                // $("#zlyl_db_Box .bt").css("width",(460+4*tdWidth)+"px");

                                // 给手势按钮注册事件
                                if(localStorage.platform == '3'){
                                    var hammerimgLeft = $("#zlyl_db_Box .imgLeft").hammer();
                                    hammerimgLeft.on('tap', function (ev) {
                                        $(this).css("opacity", "0.5");
                                        $($("#zlyl_db_Box .bt td").toArray().reverse()).each(function (i, v) {
                                            if ($(v).hasClass("hidee") && $(v).next().hasClass("showw")) {
                                                $("#zlyl_db_Box .dbNr table tr").each(function (ii, vv) {
                                                    $($(vv).find("td").toArray().reverse()[i]).removeClass("hidee").addClass("showw").show();
                                                    $($(vv).find("td").toArray().reverse()[i - 4]).removeClass("showw").addClass("hidee").hide();
                                                    return true;
                                                });
                                                $(v).removeClass("hidee").addClass("showw").show();
                                                $(v).next().next().next().next().removeClass("showw").addClass("hidee").hide();
                                                return false;
                                            }
                                        });
                                        if ($("#zlyl_db_Box .bt td").eq(3).hasClass("showw")) {
                                            $("#zlyl_db_Box .imgLeft").hide();
                                            $("#zlyl_db_Box .imgRight").show();
                                        } else {
                                            $("#zlyl_db_Box .imgRight").show();
                                        }
                                    });
                                }
                                $("#zlyl_db_Box .imgLeft").on("touchstart", function (event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    $(this).css("opacity", "0.5");
                                    $($("#zlyl_db_Box .bt td").toArray().reverse()).each(function (i, v) {
                                        if ($(v).hasClass("hidee") && $(v).next().hasClass("showw")) {
                                            $("#zlyl_db_Box .dbNr table tr").each(function (ii, vv) {
                                                $($(vv).find("td").toArray().reverse()[i]).removeClass("hidee").addClass("showw").show();
                                                $($(vv).find("td").toArray().reverse()[i - 4]).removeClass("showw").addClass("hidee").hide();
                                                return true;
                                            });
                                            $(v).removeClass("hidee").addClass("showw").show();
                                            $(v).next().next().next().next().removeClass("showw").addClass("hidee").hide();
                                            return false;
                                        }
                                    });
                                    if ($("#zlyl_db_Box .bt td").eq(3).hasClass("showw")) {
                                        $("#zlyl_db_Box .imgLeft").hide();
                                        $("#zlyl_db_Box .imgRight").show();
                                    } else {
                                        $("#zlyl_db_Box .imgRight").show();
                                    }
                                });
                                $("#zlyl_db_Box .imgLeft").on("touchend", function (event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    $(this).css("opacity", "1");
                                });
                                if(localStorage.platform == '3'){
                                    var hammerimgRight = $("#zlyl_db_Box .imgRight").hammer();
                                    hammerimgRight.on('tap', function (ev) {
                                        $(this).css("opacity", "0.5");
                                        $("#zlyl_db_Box .bt td").each(function (i, v) {
                                            if (i > 2 && $(v).hasClass("showw") && $("#zlyl_db_Box .bt td:last").hasClass("hidee")) {
                                                $("#zlyl_db_Box .dbNr table tr").each(function (ii, vv) {
                                                    $(vv).find("td").eq(i).removeClass("showw").addClass("hidee").hide();
                                                    $(vv).find("td").eq(i + 4).removeClass("hidee").addClass("showw").show();
                                                    return true;
                                                });
                                                $(v).removeClass("showw").addClass("hidee").hide();
                                                $(v).next().next().next().next().removeClass("hidee").addClass("showw").show();
                                                return false;
                                            }
                                        });
                                        if ($("#zlyl_db_Box .bt td:last").hasClass("showw")) {
                                            $("#zlyl_db_Box .imgRight").hide();
                                            $("#zlyl_db_Box .imgLeft").show();
                                        } else {
                                            $("#zlyl_db_Box .imgLeft").show();
                                        }
                                    });
                                }
                                $("#zlyl_db_Box .imgRight").on("touchstart", function (event) {
                                    event.stopPropagation();
                                    event.preventDefault();
                                    $(this).css("opacity", "0.5");
                                    $("#zlyl_db_Box .bt td").each(function (i, v) {
                                        if (i > 2 && $(v).hasClass("showw") && $("#zlyl_db_Box .bt td:last").hasClass("hidee")) {
                                            $("#zlyl_db_Box .dbNr table tr").each(function (ii, vv) {
                                                $(vv).find("td").eq(i).removeClass("showw").addClass("hidee").hide();
                                                $(vv).find("td").eq(i + 4).removeClass("hidee").addClass("showw").show();
                                                return true;
                                            });
                                            $(v).removeClass("showw").addClass("hidee").hide();
                                            $(v).next().next().next().next().removeClass("hidee").addClass("showw").show();
                                            return false;
                                        }
                                    });
                                    if ($("#zlyl_db_Box .bt td:last").hasClass("showw")) {
                                        $("#zlyl_db_Box .imgRight").hide();
                                        $("#zlyl_db_Box .imgLeft").show();
                                    } else {
                                        $("#zlyl_db_Box .imgLeft").show();
                                    }
                                });
                                $("#zlyl_db_Box .imgRight").on("touchend", function (event) {
                                    event.stopPropagation();    //  阻止事件冒泡
                                    event.preventDefault();     //  阻止默认行为 ( 表单提交 )	
                                    $(this).css("opacity", "1");
                                });
                            }
                            // 设置滚动条高度
                            // $("#zlyl_db_Box .dbNr").css("height",a-120);
                            // 注册返回按钮
                            $("#zlyl_db_Box .fhButton").on("touchstart", function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                $("#zlyl_db_Box").hide();
                            });
                            var fhbHammer = $("#zlyl_db_Box .fhButton").hammer();
                            fhbHammer.on("tap", function (e) {
                                $("#zlyl_db_Box").hide();
                            });
                            //判断是否来自PC添加特别样式
                            if(localStorage.platform == '3'){
                                $(".zlyl_db_Box .dbNr").css("left","215px");
                            }
                            // 注册图表点击事件
                            var chartHammer = $("#zlyl_db_Box .dbNr table tr").hammer();
                            chartHammer.on("tap", function (e) {
                                $("#zlyl_db_Box .dbNr table tr").removeClass("active");
                                $(this).addClass("active");
                                // 至少要有两条数据才能生成图表
                                if ($(this).find("label").length > 1) {
                                    // 显示隐藏控制
                                    addChart($(this));
                                }
                            });
                            if(localStorage.platform == '3'){
                                var zlTMCHammer = $("#zlyl_db_Box .tmc").hammer();
                                zlTMCHammer.on("tap", function (e) {
                                    $("#zlyl_db_Box .chartDiv").hide();
                                    $("#zlyl_db_Box .tmc").hide();
                                });
                            }
                            // 点击透明层 隐藏
                            $("#zlyl_db_Box .tmc").on("touchstart", function (e) {
                                e.stopPropagation();
                                e.preventDefault();
                                $("#zlyl_db_Box .chartDiv").hide();
                                $("#zlyl_db_Box .tmc").hide();
                            });

                            $("#zlyl_db_Box").show();
                            var contTop = parseInt($("#zlyl_db_Box .btTableBox").height()) + 60;
                            $("#zlyl_db_Box .dbNr").css('top', contTop);
                        }
                        $("#LoadedTip").hide();
                    }
                },
                complete: function (XMLHttpRequest, textStatus) {
                    utils.errorAjax(textStatus, JYduiBi, []);
                }
            });
        }

        // 观片
        function JC_guanP(thisYziD) {
            $(".zlyl_gp_Box").remove();
            $("#lclj_bgDiv .gpButton").unbind("touchstart");
            $("#lclj_bgDiv .gpButton").on("touchstart", function (e) {
                e.stopPropagation();
                e.preventDefault();
                $("#LoadedTip").show();
                var gpUrl = utils.gpPostUrl(thisYziD);
                // 写入cookies 			
                $.ajax({
                    url: serviceChoose + "/DC_GP_GetCookie",
                    type: 'post',
                    timeout: utils.timeoutSec(),
                    dataType: 'json',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                            "Url": encodeURIComponent(gpUrl)                        
                    }),
                    success: function (res) {
                        if (res.result.ERROR) {
                            $("#LoadedTip").hide();
                            utils.showHide(res.result.ERROR.MSG);
                        } else {
                            if (res.result["#text"]) {
                                var cok = res.result["#text"];
                                document.cookie = "JSESSIONID=" + cok;
                                //alert(cok);

                                // 计算iframe的宽高
                                var frameW = $(window).width() - 30;
                                var frameH = $(window).height() - 30;
                                $("body").append('<div class="zlyl_gp_Box"><div class="closeBut"><span class="fs1" aria-hidden="true" data-icon=""></span></div><iframe width="' + frameW + '" height="' + frameH + '" src="' + gpUrl + '"></iframe></div>');
                                $(".zlyl_gp_Box .closeBut").on("touchstart", function (e) {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    $(".zlyl_gp_Box").remove();
                                });
                            } else {
                                utils.showHide("未返回有效观片地址");
                            }
                            $("#LoadedTip").hide();
                        }
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        utils.errorAjax(textStatus, JC_guanP, [thisYziD]);
                    }
                });
            });
        }

        // 控制缓存哪个显示
        function divHC(thisID, duiBi, gp) {
            $("#lclj_bgDiv").removeClass("animated bounceInRight bounceOutRight").addClass("animated bounceInRight").show();
            //$("#lclj_bgDiv").removeClass("animated bounceInRight bounceOutRight").show();
            $(".zlyl_xmlBox").hide();
            $(".imgBox").hide();
            $("#" + thisID).show();
            $(".imgBox").scroll(function (event) {
                event.stopPropagation();    //  阻止事件冒泡
                event.preventDefault();     //  阻止默认行为 ( 表单提交 )
            });
            $(".zlyl_xmlBox").scroll(function (event) {
                event.stopPropagation();    //  阻止事件冒泡
                event.preventDefault();     //  阻止默认行为 ( 表单提交 )
            });
            if (duiBi == "yes") {
                $("#lclj_bgDiv .dbButton").show();
            } else {
                $("#lclj_bgDiv .dbButton").hide();
            }
            if (gp == "yes") {
                $("#lclj_bgDiv .gpButton").show();
            } else {
                $("#lclj_bgDiv .gpButton").hide();
            }
            $("#LoadedTip").hide();
            if(localStorage.platform == '3'){
                var hammerDivFD = $("#lclj_bgDiv").hammer();
                hammerDivFD.on("tap", function () {
                    setTimeout(function () {
                        $("#lclj_bgDiv").hide();
                    }, 800);
                });
            }
        }

        // 关闭浮动层
        var hammerDivFD = $("#lclj_bgDiv").hammer();
        hammerDivFD.on("swiperight", function () {
            $("#lclj_bgDiv").removeClass("animated bounceInRight bounceOutRight").addClass("animated bounceOutRight");
            setTimeout(function () {
                $("#lclj_bgDiv").hide();
            }, 1000);
        });
        // 追加图表
        function addChart(thisTr) {
            $("#zlyl_db_Box .tmc").show();
            $("#zlyl_db_Box .chartDiv").show();
            $("#chartID").css("height", $("#zlyl_db_Box .chartDiv").height() - 60);

            // 准备图表数据
            var xData = [], yJGZ = [], yBYL = [], chartJGZ = [], chartBYL = [], meanVal;
            // X轴 曲线数据
            for (var i = 3; i < thisTr.find("td").length; i++) {
                if (thisTr.find("td").eq(i).children("label").length > 0) {
                    var thisTrTime = $("#zlyl_db_Box .bt").find("td").eq(i).text().split(" ");
                    var thisTrY = thisTrTime[0].split("-")[1] + '-' + thisTrTime[0].split("-")[2];
                    var thisTrT = thisTrTime[1].split(":")[0] + ':' + thisTrTime[1].split(":")[1];
                    thisTrTime = thisTrY + ' ' + thisTrT;
                    xData.push(thisTrTime);
                    chartJGZ.push(thisTr.find("td").eq(i).children("label").text());
                    var thisByl = thisTr.find("td").eq(i).children("label").attr("data-byl");
                    chartBYL.push(thisByl == "null" || thisByl == null ? 0 : thisByl);
                }
            }
            // y轴 结果值
            var jgzmax = parseFloat(thisTr.attr("data-jgz").split("|")[0]);   // 最大刻度
            var jgzmin = parseFloat(thisTr.attr("data-jgz").split("|")[1]);   // 最小刻度
            var jgzJj = (jgzmax - jgzmin) / 10;                                  // 间隔值
            var yJGZ = { "max": jgzmax, "min": jgzmin, "interval": jgzJj };
            // y轴 变异率
            var bylmax = parseFloat(thisTr.attr("data-byl").split("|")[0]);   // 最大刻度
            var bylmin = parseFloat(thisTr.attr("data-byl").split("|")[1]);   // 最小刻度
            var bylJj = (bylmax - bylmin) / 10;                                  // 间隔值
            var yBYL = { "max": bylmax, "min": bylmin, "interval": bylJj };
            // 平均值 结果值
            var ck = thisTr.find("td").eq(2).text();
            meanVal = (parseFloat(ck.split("～")[0]) + parseFloat(ck.split("～")[1])) / 2;

            // 默认结果值图表
            $("#zlyl_db_Box .chartDiv ul li").removeClass("item");
            $("#zlyl_db_Box .chartDiv ul li:first").addClass("item");
            chartInitialize(xData, yJGZ, "chartID", meanVal, chartJGZ);

            // 变异率/结果值切换
            //var chartUlHammer = $("#zlyl_db_Box .chartDiv ul li").hammer();
            //chartUlHammer.on("tap",function(){
            if(localStorage.platform == '3'){
                var chartUlHammer = $("#zlyl_db_Box .chartDiv ul li").hammer();
                chartUlHammer.on("tap",function(){
                    $("#zlyl_db_Box .chartDiv ul li").removeClass("item");
                    $(this).addClass("item");
                    if ($(this).text() == "结果值") {
                        chartInitialize(xData, yJGZ, "chartID", meanVal, chartJGZ);
                    } else {
                        chartInitialize(xData, yBYL, "chartID", 0, chartBYL);
                    }
                })
            }
            $("#zlyl_db_Box .chartDiv ul li").on("touchstart", function (e) {
                e.stopPropagation();
                e.preventDefault();
                $("#zlyl_db_Box .chartDiv ul li").removeClass("item");
                $(this).addClass("item");
                if ($(this).text() == "结果值") {
                    chartInitialize(xData, yJGZ, "chartID", meanVal, chartJGZ);
                } else {
                    chartInitialize(xData, yBYL, "chartID", 0, chartBYL);
                }
            });
        }

        // 初始化图表
        function chartInitialize(xData, yData, chartBox, meanVal, chartData) { // X轴数据 Y轴数据 图表容器 平均值 图表数据
            $("#" + chartBox).empty();
            var myChart = echarts.init(document.getElementById(chartBox));
            // 指定图表的配置项和数据
            var option = {
                grid: {
                    show: false,
                    left: 50,
                    top: 50,
                    right: 50,
                    bottom: 20
                },
                tooltip: {
                    trigger: 'axis'
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: xData,//['周一','周二','周三','周四','周五','周六','周日']
                },
                yAxis: {
                    type: 'value',
                    splitNumber: 10,           // 一共10行
                    interval: yData.interval,  // 间隔值
                    min: yData.min,            // 最小刻度
                    max: yData.max             // 最大刻度
                    /*axisLabel: {
                        formatter: '{value} '
                    },*/

                },
                series: [
                    {
                        name: '检验结果',
                        type: 'line',
                        data: chartData,//[11, 11, 15, 13, 12, 13, 10],
                        markPoint: {
                            data: [
                                { type: 'max', name: '最大值' },
                                { type: 'min', name: '最小值' }
                            ]
                        },
                        markLine: {
                            data: [
                                {
                                    name: '标准水平线',
                                    yAxis: parseFloat(meanVal)
                                },
                            ]
                        }
                    }
                ],
                backgroundColor: "#fff"
            }
            // 使用刚指定的配置项和数据显示图表。
            myChart.setOption(option);
        }

        //切换pagid 
        function pageIdChange(thisli) {
            if (thisli.text() != $("#zldengJiCheck").text()) {
                $("#dengJi").text(thisli.text()); //信息小卡 的pageid
                $("#zldengJiCheck").text(thisli.text());//诊疗 的pageid
                $("#slzyID").attr("data-pageid", thisli.text()); //b绑定的pageid
                $("#zhenLiao > .zlylCard > .voiceAndphoto-ll").removeClass('animated fadeIn').addClass('animated fadeOut');
                $("#zhenLiao > .zlylCard > .pageIdchange").removeClass('animated fadeIn').addClass('animated fadeOut');
                setTimeout(function () {
                    $("#zhenLiao > .zlylCard > .voiceAndphoto-ll").css("display", "none");
                    $("#zhenLiao > .zlylCard > .pageIdchange").css("display", "none");
                }, 1000);
                $("#zhenLiao > .zlylCard > .pageIdchange > ul > li").removeClass('changClass');
                thisli.addClass('changClass');
                $("#zhenLiao > .zlylCard > .dh > .butt").removeClass("activeBut");
                zlDataLoad(utils.todayNow().split(" ")[0], thisli.text());
            }

        }

        return {
            consulting: consulting
        }

    });
