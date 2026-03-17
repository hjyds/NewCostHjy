define(["jquery", "hammer", "jqueryhammer", "utils", "layer"], function (jquery, hammer, jqueryhammer, utils, layer) {
    var serviceChoose = utils.urlFunction();

    function index() {
        $("#mainNavUserBox").show();   // 缩略卡
        $("#mainNavUserBoxzd").show(); // 诊断结果 缩略
        $("#mainNavMinTwo").show();    // 左边二级导航
        $("#huaDong").show();          // 滑动块 中间
        $('#huaDong > div').hide();
        $("#huaDongJiBen").show();
        $("#mainNavMinTwo > div").hide();
        $("#mainNavMinTwo1").show();
        $("#yzButtonBox").hide();   // 医嘱新开、复制按钮
        $("#yzParticulars").hide(); //医嘱执行情况关闭
        $("#linChuang").hide();   //临床路径
        $("#zhenLiao").hide();
        if (!$("#yzButtonBox").is(":hidden")) {
            $("#yzButtonBox").hide();
        }
        if(!localStorage.configArryUrl || localStorage.configArryUrl == ''){
            $('#adviceBox').hide();
        }else{
            $('#adviceBox').show();
        }
        // $("#mainNavMinTwo1 > ul li").removeClass("XuanZhong");
        // $("#mainNavMinTwo1 > ul li:first").addClass("XuanZhong"); // 默认选中基本信息
        // patientHomePage.getBingLiKaJB($("#slzyID").attr("data-patiID"), $("#slzyID").attr("data-pageID"));
        if ($("#mainNavMinTwo1 ul li").hasClass("XuanZhong")) {  //选择上一次选择的
            var scxz = $("#mainNavMinTwo1 ul").find(".XuanZhong").index();  //上次选中的li
            switch (scxz) {      //判断选中的li
                case 0:
                    $("#huaDong > div").hide();
                    //获取当前病历卡的住院ID 备留传给后台
                    getBingLiKaJB($("#slzyID").attr("data-patiID"), $("#slzyID").attr("data-pageID"));
                    $("#huaDongJiBen").show();
                    break;
                case 1:
                    $("#huaDong > div").hide();
                    getBingLiKaFY($("#slzyID").attr("data-patiID"), $("#slzyID").attr("data-pageID"));
                    $("#huaDongFeiYong").show();
                    break;
            }
        } else {
            $("#mainNavMinTwo1 ul li:first").addClass("XuanZhong");     // 第一次默认选中基本信息
            getBingLiKaJB($("#slzyID").attr("data-patiID"), $("#slzyID").attr("data-pageID"));
        }
    }
    hammerPayAdvance = $("#payAdvance").hammer();
    hammerPayAdvance.on('tap', function (ev) {
        var zyID = $("#slzyID").attr("data-patiid"), zyPageID = $("#slzyID").attr("data-pageid"),curName = $("#patientName").text();
        var gpUrl=localStorage.configArryUrl+'?BRID='+zyID+'&ZYID='+zyPageID+'&NAME='+encodeURI(curName);
        $("body").append('<div class="jygp-wrap" id="jcgp-Box" ><div class="gpclose"><span class="fs1" aria-hidden="true" data-icon=""></span></div><div class="jygp_dbBox" style="overflow: hidden;height:670px;position: relative"><iframe src="'+gpUrl+'"  type="text/html" width="100%" height="670"></iframe></div></div>');
        gpClosehammer1=$("#jcgp-Box .gpclose").hammer();
        gpClosehammer1.on('tap', function(event) {
            setTimeout(function(){
                $("#jcgp-Box").remove();
                getBingLiKaJB(zyID, zyPageID);
            },100)
        });
    })


 hammerinsertDiagno= $("#insertDiagno").hammer();
    hammerinsertDiagno.on('tap', function (ev) {
      $("#LoadedTip").show();
        var zyID1 = $("#slzyID").attr("data-patiid"), zyPageID1 = $("#slzyID").attr("data-pageid"),userName1 = JSON.parse(localStorage.userInfo).Result.USER;
        var gpUrl1=localStorage.configDiagUrl+'EmrViewWeb/DiagnosisPlugIn?patiId='+zyID1+'&visitId='+zyPageID1+'&userName='+encodeURI(userName1);
        $("body").append('<div class="jygp-wrap1" id="jcgp-Box1" style="position: absolute;z-index:99999;top:50%;left:50%;margin-left:-600px;margin-top:-350px;border:1px solid #d1d1d1;"><div class="gpclose1"><span class="fs1" aria-hidden="true" data-icon=""></span></div><div class="jygp_dbBox1" style="overflow: hidden;width:1200px;height:700px;position: relative"><iframe src="'+gpUrl1+'"  type="text/html" width="100%" height="670"></iframe></div></div>');
        gpClosehammer11=$("#jcgp-Box1 .gpclose1").hammer();
        gpClosehammer11.on('tap', function(event) {
            setTimeout(function(){
                $("#jcgp-Box1").remove();
                $("#LoadedTip").hide();
            },100)
        });
    })


    //导航二级菜单 主页
    hammerMinTwo1 = $("#mainNavMinTwo1 > ul > li").hammer();
    hammerMinTwo1.on('tap', function (ev) {
        if (!$(this).hasClass('XuanZhong')) {
            var zhi = $(this).index();
            $("#mainNavMinTwo1 > ul > li").removeClass("XuanZhong");
            $(this).addClass("XuanZhong");
            //var zyID = $(this).find(".bingLiKaDengJi").find("span").text();
            var zyID = $("#slzyID").attr("data-patiid"), zyPageID = $("#slzyID").attr("data-pageid");
            switch (zhi) {
                case 0:
                    $("#huaDong > div").hide();
                    //获取当前病历卡的住院ID 备留传给后台

                    getBingLiKaJB(zyID, zyPageID);
                    $("#huaDongJiBen").show();
                    break;
                case 1:
                    $("#huaDong > div").hide();
                    getBingLiKaFY(zyID, zyPageID);
                    $("#huaDongFeiYong").show();
                    break;
            }
        }
    });

    function getBingLiKaJB(patiID, pageID) {
        $("#LoadedTip").show();
        $.ajax({
            url: serviceChoose + '/DC_Dossier',
            type: "post",
            data: JSON.stringify({
                "IN":
                    {
                        "PATIID": patiID,
                        "PAGEID": pageID
                    }
            }),
            timeout: utils.timeoutSec(),
            dataType: "json",
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (responseTxt) {
                if (responseTxt.Result.ERROR) {
                    $('#LoadedTip').hide();
                    //layer.alert(responseTxt.Result.ERROR.MSG);
                    utils.showHide(responseTxt.Result.ERROR.MSG);
                    return;
                }

                $("#qhbrFather").hide();
                // 隐藏医嘱编辑按钮
                $("#yzButtonBox>div").hide();
                $("#yzButtonEditOne").text("编辑");
                // 隐藏pageID切换浮出层
                $("#dengjiUlStyle").css("display", "none");
                $("#huaDong > div").hide();
                $("#huaDongJiBen").show();
                // 床号
                $("#patientInfo").find($("#bedNo").text(responseTxt.Result.DOSSIER.JBXX.CH));
                // 住院次数
                $("#patientInfo").find($("#ZYCS").text(responseTxt.Result.DOSSIER.JBXX.ZYCS));
                // 住院号
                $("#patientInfo").find($("#hospitalID").text(responseTxt.Result.DOSSIER.JBXX.ZYH));
                // 付款方式
                $("#patientInfo").find($("#paymentWay").text(responseTxt.Result.DOSSIER.JBXX.FKFS));
                // 姓名
                $("#patientInfo").find($("#patientName").text(responseTxt.Result.DOSSIER.JBXX.XM));
                // 性别
                $("#patientInfo").find($("#patientSex").text(responseTxt.Result.DOSSIER.JBXX.XB));
                // 年龄
                $("#patientInfo").find($("#patientAge").text(responseTxt.Result.DOSSIER.JBXX.NL));
                // 出生日期
                var csnyBirth = responseTxt.Result.DOSSIER.JBXX.CSRQ.split(" ");
                $("#patientInfo").find($("#birthDate").text(csnyBirth[0]));
                // 婚姻
                $("#patientInfo").find($("#maritalStatus").text(responseTxt.Result.DOSSIER.JBXX.HY));
                // 职业
                $("#patientInfo").find($("#professional").text(responseTxt.Result.DOSSIER.JBXX.ZY));
                // 国籍
                $("#patientInfo").find($("#nationality").text(responseTxt.Result.DOSSIER.JBXX.GJ));
                // 民族
                $("#patientInfo").find($("#national").text(responseTxt.Result.DOSSIER.JBXX.MZ));
                // 身份证号
                $("#patientInfo").find($("#numberID").text(responseTxt.Result.DOSSIER.JBXX.SFZH));


                // 出生地点
                $("#patientContact").find($("#birthPlace").text(responseTxt.Result.DOSSIER.JBXX.QY));
                // 家庭电话
                $("#patientContact").find($("#homePhoneNo").text(responseTxt.Result.DOSSIER.JBXX.JTDH));
                // 家庭地址
                $("#patientContact").find($("#homeAddress").text(responseTxt.Result.DOSSIER.JBXX.JTDZ));
                // 联系人姓名
                $("#patientContact").find($("#contactName").text(responseTxt.Result.DOSSIER.JBXX.LXRXM));
                // 联系人电话
                $("#patientContact").find($("#contactPhoneNo").text(responseTxt.Result.DOSSIER.JBXX.LXRDH));
                // 联系人地址
                $("#patientContact").find($("#contactAddress").text(responseTxt.Result.DOSSIER.JBXX.LXRDZ));

                // 诊断信息（先清空 防止再次追加）
                $("#diagnosticInfo").find($("#A table tbody")).empty("tr");
                if (responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST == null) {
                    $("#diagnosticInfo").find($("#A table tbody")).append('<tr><td>' + '无诊断信息' + '</td></tr>');
                    $("#westernDiagnosis").text(0);
                }
                else if (responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST.ZDMX.length == undefined) {
                    $("#diagnosticInfo").find($("#A table tbody")).append('<tr><td style="width:35%" class="text-info text-right text-bold">' + responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST.ZDMX.ZDLX + '</td><td>' + (responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST.ZDMX.ZDBM == null ? "" : responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST.ZDMX.ZDBM) + responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST.ZDMX.ZDMS + '</td></tr>');
                    $("#westernDiagnosis").text(1);
                } else {
                    for (var DinsicInfo = 0; DinsicInfo < responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST.ZDMX.length; DinsicInfo++) {
                        $("#westernDiagnosis").text(DinsicInfo + 1);
                        $("#diagnosticInfo").find($("#A table tbody")).append('<tr><td style="width:35%" class="text-info text-right text-bold">' + responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST.ZDMX[DinsicInfo].ZDLX + '</td><td>' + (responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST.ZDMX[DinsicInfo].ZDBM == null ? "" : responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST.ZDMX[DinsicInfo].ZDBM) + responseTxt.Result.DOSSIER.ZDJL.ZDMXLIST.ZDMX[DinsicInfo].ZDMS + '</td></tr>');
                    }
                    $("#westernDiagnosis").text(DinsicInfo);
                }
                //中医诊断信息
                $("#diagnosticInfo").find('#B table tbody').empty("tr");
                if (responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST == null) {
                    $("#diagnosticInfo").find('#B table tbody').append('<tr><td>' + '无诊断信息' + '</td></tr>')
                    $("#zhongYiZhengDuan").text(0);

                } else if (responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST.ZDMX.length == undefined) {
                    $("#diagnosticInfo").find('#B table tbody').append('<tr><td style="width:40%" class="text-info text-right text-bold">' + responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST.ZDMX.ZDLX + '</td><td>' + (responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST.ZDMX.ZDBM == null ? "" : responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST.ZDMX.ZDBM) + responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST.ZDMX.ZDMS + '</td></tr>');
                    $("#zhongYiZhengDuan").text(1);
                } else {
                    for (var zyxg = 0; zyxg < responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST.ZDMX.length; zyxg++) {
                        $("#diagnosticInfo").find('#B table tbody').append('<tr><td style="width:40%" class="text-info text-right text-bold">' + responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST.ZDMX[zyxg].ZDLX + '</td><td>' + (responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST.ZDMX[zyxg].ZDBM == null ? "" : responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST.ZDMX[zyxg].ZDBM) + responseTxt.Result.DOSSIER.ZYZDJL.ZDMXLIST.ZDMX[zyxg].ZDMS + '</td></tr>');
                        $("#zhongYiZhengDuan").text(zyxg + 1);
                    }
                }
                //on-tach事件
                $("#diagnosticInfo #A table tbody tr").on("touchstart touchmove", function () {
                    utils.CpStart($(this));
                });
                $("#diagnosticInfo #A table tbody tr").on("touchend", function () {
                    utils.CpEnd($(this));
                });
                //on-tach事件
                $("#diagnosticInfo #B table tbody tr").on("touchstart touchmove", function () {
                    utils.CpStart($(this));
                });
                $("#diagnosticInfo #B table tbody tr").on("touchend", function () {
                    utils.CpEnd($(this));
                });
                $("#diagnosticInfo").find('#B').removeClass('active');
                $("#diagnosticInfo").find('#A').show();
                $("#diagnosticInfo").find('#B').hide();
                $("#diagnosticInfo .widget-body").find(".nav-tabs>li").removeClass('active');
                $("#diagnosticInfo .widget-body").find(".nav-tabs>li").eq(0).addClass('active');
                $("#diagnosticInfo").find('#A').addClass('active');
                //诊断信息选项卡 西医
                var hammerzhenDuanMessageX = $("#zhenDuanMessageX").hammer();
                hammerzhenDuanMessageX.on('tap', function (event) {
                    $("#diagnosticInfo").find('#A').show();
                    $("#diagnosticInfo").find('#B').hide();
                    $("#diagnosticInfo").find('#B').removeClass('active');
                    $("#diagnosticInfo .widget-body").find(".nav-tabs>li").removeClass('active');
                    $("#diagnosticInfo .widget-body").find(".nav-tabs>li").eq(0).addClass('active');
                    $("#diagnosticInfo").find('#A').addClass('active');
                });
                //诊断信息选项卡 中医
                var hammerzhenDuanMessageZ = $("#zhenDuanMessageZ").hammer();
                hammerzhenDuanMessageZ.on('tap', function (event) {
                    $("#diagnosticInfo").find('#B').show();
                    $("#diagnosticInfo").find('#A').hide();
                    $("#diagnosticInfo").find('#A').removeClass('active');
                    $("#diagnosticInfo").find('#B').addClass('active');
                    $("#diagnosticInfo .widget-body").find(".nav-tabs>li").removeClass('active');
                    $("#diagnosticInfo .widget-body").find(".nav-tabs>li").eq(1).addClass('active');
                });
                // 过敏信息（先清空 防止再次追加）
                $("#allergyInfo").empty("blockquote");
                if (responseTxt.Result.DOSSIER.GMJSS.GMYWLIST == null) {
                    $("#allergyInfo").text("无过敏信息");
                }
                else if (responseTxt.Result.DOSSIER.GMJSS.GMYWLIST.GMYW.length == undefined) {
                    $("#allergyInfo").append('<blockquote>' + responseTxt.Result.DOSSIER.GMJSS.GMYWLIST.GMYW.YWM + '（' + responseTxt.Result.DOSSIER.GMJSS.GMYWLIST.GMYW.JLSJ + '）' + '</blockquote>');
                }
                else {
                    for (var allergyInforID = 0; allergyInforID < responseTxt.Result.DOSSIER.GMJSS.GMYWLIST.GMYW.length; allergyInforID++) {
                        $("#allergyInfo").append('<blockquote>' + responseTxt.Result.DOSSIER.GMJSS.GMYWLIST.GMYW[allergyInforID].YWM + '（' + responseTxt.Result.DOSSIER.GMJSS.GMYWLIST.GMYW[allergyInforID].JLSJ + '）' + '</blockquote>');
                    }
                }
                //on-tach事件
                // $("#allergyInfo").on("touchstart touchmove",function(){
                // 	utils.CpStart($(this));
                // });
                // $("#allergyInfo").on("touchend",function(){
                // 	utils.CpEnd($(this));
                // });

                // 入院时间
                $("#admissionTime").text(responseTxt.Result.DOSSIER.JBXX.RYSJ);
                // 住院天数
                $("#hospitalizationDays").text(responseTxt.Result.DOSSIER.JBXX.ZYTS);
                // 科室
                $("#department").text(responseTxt.Result.DOSSIER.JBXX.RYKS);
                // 病情
                if (responseTxt.Result.DOSSIER.JBXX.RYBQ == "一般") {
                    $("#illnessState").text(responseTxt.Result.DOSSIER.JBXX.RYBQ).removeClass("label-important").addClass("label-success");
                } else {
                    $("#illnessState").text(responseTxt.Result.DOSSIER.JBXX.RYBQ).removeClass("label-success").addClass("label-important");
                }
                // 主治医生
                $("#attendingPhysician").text(responseTxt.Result.DOSSIER.ZYQK.ZZYS);
                // 主任医师
                $("#chiefPhysician").text(responseTxt.Result.DOSSIER.ZYQK.ZRYS);
                // 住院医师
                $("#resident").text(responseTxt.Result.DOSSIER.ZYQK.ZYYS);
                // 责任护士
                $("#nurse").text(responseTxt.Result.DOSSIER.ZYQK.ZRHS);
                // 预交总额
                $("#expectedPayAmount").text(responseTxt.Result.DOSSIER.FYQK.YJZE);
                // 总金额
                $("#aggregateAmount").text(responseTxt.Result.DOSSIER.FYQK.ZJE);
                // 预结费用
                $("#expectedSettlement").text(responseTxt.Result.DOSSIER.FYQK.YJJE);
                // 预交余额
                $("#expectedPayBalance").text(responseTxt.Result.DOSSIER.FYQK.YJYE);
                // 未结费用
                $("#outStanding").text(responseTxt.Result.DOSSIER.FYQK.WJJE);
                // 费用余额
                $("#balance").text(responseTxt.Result.DOSSIER.FYQK.FYYE);
                // 担保金额
                $("#guaranteeAmount").text(responseTxt.Result.DOSSIER.JBXX.DB);
                $("#LoadedTip").hide();

                $(".widget-body tbody tr").on("touchstart touchmove", function () {
                    utils.CpStart($(this));
                });
                $(".widget-body tbody tr").on("touchend", function () {
                    utils.CpEnd($(this));
                });
                // 计算过敏信息的高度  内容填充完成再计算比较准确
                // var GMmessge=$("#boxCenterTwo").height()-parseInt($("#patientInfo").height())-parseInt($("#patientContact").height())-parseInt($("#patientInfo").siblings().eq(2).height())-parseInt($("#patientInfo").siblings().eq(3).height())-94;
                // if(GMmessge<136){
                // 	$("#patientInfo").siblings().eq(1).css("height","136px");
                // 	GMmessge=136;
                // }else{
                // 	$("#patientInfo").siblings().eq(1).css("height",GMmessge);
                // };
                // $("#diagnosticInfo .tab-content").css("height",GMmessge-62);
                // $("#allergyInfo").css("height",GMmessge-62);
                // $("#diagnosticInfo .tabs-left .shuXian").css("height",GMmessge-118);
            },
            complete: function (XMLHttpRequest, textStatus) {
                utils.errorAjax(textStatus, getBingLiKaJB, [patiID, pageID]);
            }
        });
    }
    function getBingLiKaFY(patiID, pageID) {
        $("#LoadedTip").show();

        $.ajax({
            url: serviceChoose + '/DC_Dossier',
            async: true,
            type: "post",
            data: JSON.stringify({
                "IN":
                    {
                        "PATIID": patiID,
                        "PAGEID": pageID
                    }
            }),
            timeout: utils.timeoutSec(),
            dataType: "json",
            headers: {
                'Content-Type': 'application/json'
            },
            //成功
            success: function (responseTxt) {
                $("#LoadedTip").hide();

                $("#huaDong > div").hide();
                $("#huaDongFeiYong").show();
                if (responseTxt.Result.DOSSIER.FYMX.ITEM instanceof Array) {
                    var mxCDnew = responseTxt.Result.DOSSIER.FYMX.ITEM.length - 1;
                    var yjzeNew = responseTxt.Result.DOSSIER.FYMX.ITEM[mxCDnew].FYJE;
                } else {
                    var yjzeNew = responseTxt.Result.DOSSIER.FYMX.ITEM.FYJE
                }
                // 预交总额  改后为合计数
                if (parseInt(yjzeNew) > 0) {
                    $("#mxYJZE").text(yjzeNew);
                } else {
                    $("#mxYJZE").addClass("text-error").text(yjzeNew);
                }
                // if (parseInt(responseTxt.Result.DOSSIER.FYQK.YJZE) > 0) {
                // 	$("#mxYJZE").text(responseTxt.Result.DOSSIER.FYQK.YJZE);
                // } else {
                // 	$("#mxYJZE").addClass("text-error").text(responseTxt.Result.DOSSIER.FYQK.YJZE);
                // }
                // 预交余额
                if (parseInt(responseTxt.Result.DOSSIER.FYQK.YJYE) > 0) {
                    $("#mxYJYE").text(responseTxt.Result.DOSSIER.FYQK.YJYE);
                } else {
                    $("#mxYJYE").addClass("text-error").text(responseTxt.Result.DOSSIER.FYQK.YJYE);
                }
                // 预结费用
                if (parseInt(responseTxt.Result.DOSSIER.FYQK.YJJE) > 0) {
                    $("#mxYJFY").text(responseTxt.Result.DOSSIER.FYQK.YJJE);
                } else {
                    $("#mxYJFY").addClass("text-error").text(responseTxt.Result.DOSSIER.FYQK.YJJE);
                }
                // 费用余额
                if (parseInt(responseTxt.Result.DOSSIER.FYQK.FYYE) > 0) {
                    $("#mxFYYE").text(responseTxt.Result.DOSSIER.FYQK.FYYE);
                } else {
                    $("#mxFYYE").addClass("text-error").text(responseTxt.Result.DOSSIER.FYQK.FYYE);
                }
                // 担保余额
                if (parseInt(responseTxt.Result.DOSSIER.JBXX.DB) > 0) {
                    $("#mxDBYE").text(responseTxt.Result.DOSSIER.JBXX.DB);
                } else {
                    $("#mxDBYE").addClass("text-error").text(responseTxt.Result.DOSSIER.JBXX.DB);
                }

                // 费用明细
                $("#costDetail").empty("tr");
                var mxXH = 0;
                for (var mxID = 0; mxID < responseTxt.Result.DOSSIER.FYMX.ITEM.length - 1; mxID++) {
                    var FJ = responseTxt.Result.DOSSIER.FYMX.ITEM[mxID].FJ;
                    var FYMC = responseTxt.Result.DOSSIER.FYMX.ITEM[mxID].FYMC.trim();
                    if (FJ == 1)
                        $("#costDetail").append('<tr class="sfmx_One"><td style="width:50%"><span class="fs1" aria-hidden="true" data-icon=""></span> ' + FYMC + '</td><td style="width:30%" class="text-right">' + responseTxt.Result.DOSSIER.FYMX.ITEM[mxID].FYBL + '%' + '</td><td style="width:20%" class="text-right">' + responseTxt.Result.DOSSIER.FYMX.ITEM[mxID].FYJE + '</td></tr>');
                    else if (FJ == 2)
                        $("#costDetail").append('<tr class="sfmx_Two"><td style="width:50%; padding-left:20px;"><span class="fs1" aria-hidden="true" data-icon=""></span>' + FYMC + '</td><td style="width:30%" class="text-right">' + responseTxt.Result.DOSSIER.FYMX.ITEM[mxID].FYBL + '%' + '</td><td style="width:20%" class="text-right">' + responseTxt.Result.DOSSIER.FYMX.ITEM[mxID].FYJE + '</td></tr>');
                    else
                        $("#costDetail").append('<tr><td style="width:50%; padding-left:36px;">' + FYMC + '</td><td style="width:30%" class="text-right">' + responseTxt.Result.DOSSIER.FYMX.ITEM[mxID].FYBL + '%' + '</td><td style="width:20%" class="text-right">' + responseTxt.Result.DOSSIER.FYMX.ITEM[mxID].FYJE + '</td></tr>');
                }

                $("#costDetail tr").on("touchstart touchmove", function () {
                    utils.CpStart($(this));
                });
                $("#costDetail tr").on("touchend", function () {
                    utils.CpEnd($(this));
                });
                //费用折叠
                var costDetailOnehammer = $("#costDetail .sfmx_One").hammer();
                costDetailOnehammer.on('tap', function (event) {
                    costone($(this));
                });
                //费用折叠
                var costDetailTwohammer = $("#costDetail .sfmx_Two").hammer();
                costDetailTwohammer.on('tap', function (event) {
                    costTwo($(this))
                });

                // 合计
                if (responseTxt.Result.DOSSIER.FYMX.ITEM instanceof Array) {
                    var mxCD = responseTxt.Result.DOSSIER.FYMX.ITEM.length - 1;
                    $("#mxHJ").text(responseTxt.Result.DOSSIER.FYMX.ITEM[mxCD].FYJE);
                } else {
                    $("#mxHJ").text(responseTxt.Result.DOSSIER.FYMX.ITEM.FYJE);
                }

                $("#mxHJ").on("touchstart touchmove", function () {
                    utils.CpStart($(this));
                });
                $("#mxHJ").on("touchend", function () {
                    utils.CpEnd($(this));
                });
            },
            complete: function (XMLHttpRequest, textStatus) {
                utils.errorAjax(textStatus, getBingLiKaFY, [patiID, pageID]);
            }
        });
    }
    //费用点击一级隐藏
    function costone(thistr) {
        var theNum = thistr.index();
        if (thistr.hasClass('hideONe')) {
            for (var i = parseInt(theNum) + 1; i < $("#costDetail tr").length; i++) {
                if ($("#costDetail tr").eq(i).hasClass('sfmx_One')) {
                    break;
                } else {
                    $("#costDetail tr").eq(i).removeClass('display-none');
                    if ($("#costDetail tr").eq(i).hasClass('sfmx_Two')) {
                        $("#costDetail tr").eq(i).find('span').remove();
                        $("#costDetail tr").eq(i).find('td').eq(0).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
                        $("#costDetail tr").eq(i).removeClass('hideONe');
                    }
                }
            }
            thistr.removeClass('hideONe');
            thistr.find('span').remove();
            thistr.find('td').eq(0).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
        } else {
            for (var i = parseInt(theNum) + 1; i < $("#costDetail tr").length; i++) {
                if ($("#costDetail tr").eq(i).hasClass('sfmx_One')) {
                    break;
                } else {
                    $("#costDetail tr").eq(i).addClass('display-none');
                }
            }
            thistr.addClass('hideONe');
            thistr.find('span').remove();
            thistr.find('td').eq(0).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
        }
    }
    //费用点击二级隐藏
    function costTwo(thistr) {
        var theNum = thistr.index();
        if (thistr.hasClass('hideONe')) {
            for (var i = parseInt(theNum) + 1; i < $("#costDetail tr").length; i++) {
                if ($("#costDetail tr").eq(i).hasClass('sfmx_One') || $("#costDetail tr").eq(i).hasClass('sfmx_Two')) {
                    break;
                } else {
                    $("#costDetail tr").eq(i).removeClass('display-none');
                }
            }
            thistr.removeClass('hideONe');
            thistr.find('span').remove();
            thistr.find('td').eq(0).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
        } else {
            for (var i = parseInt(theNum) + 1; i < $("#costDetail tr").length; i++) {
                if ($("#costDetail tr").eq(i).hasClass('sfmx_One') || $("#costDetail tr").eq(i).hasClass('sfmx_Two')) {
                    break;

                } else {
                    $("#costDetail tr").eq(i).addClass('display-none');
                }
            }
            thistr.addClass('hideONe');
            thistr.find('span').remove();
            thistr.find('td').eq(0).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
        }
    }

    //费用和主页table
    $("#huaDongJiBen table tr").on("touchstart touchmove", function () {
        utils.CpStart($(this));
    });
    $("#huaDongJiBen table tr").on("touchend", function () {
        utils.CpEnd($(this));
    });

    return {
        index: index,
        getBingLiKaJB: getBingLiKaJB,
        getBingLiKaFY: getBingLiKaFY
    }

});