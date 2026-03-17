define([
    "jquery",
    "hammer",
    "jqueryhammer",
    "utils",
    "patientHomePage",
    "doctorAdvice",
    "medicalRecords",
    "examine",
    "inspection",
    "nurseRecords",
    "consulting",
    "clinic",
    "photo",
    "video",
    window.enterFlagd = true
    //"cryptoJS",
    //"cryptoJSaes"
], function (
    jquery,
    hammer,
    jqueryhammer,
    utils,
    patientHomePage,
    doctorAdvice,
    medicalRecords,
    examine,
    inspection,
    nurseRecords,
    consulting,
    clinic,
    photo,
    video
    //cryptoJS,
    //cryptoJSaes
) {

        var serviceChoose = utils.urlFunction();
        var enterData='';//是否是扫描有效数据
        var clickTotal = 0;

        // 病人切换功能 初始化
        function patSwitch(ksItem, userKsId, userName, isWD, isZY, isHZ, isSH,isBQ) {
            var KSID = userKsId,                      //默认科室   从login出获取
                BQID = '',                            //默认病区   为空
                YS = userName,                        //默认医生   从login出获取
                YLZ = '',                             //默认医疗组 为空
                isWD = isWD,
                isZY = isZY,
                isHZ = isHZ;
            isBQ = isBQ;
            isSH = isSH;
            // 追加容器
            $("#qhbr").remove();
            var patSitchBox = '<div class="bingRenQieHuanBox" id="qhbr"><div id="qhbrLeft" class="qhbrLeft"></div><div id="qhbrRight" class="qhbrRight"><div id="qhbrRight1"></div></div>';
            $("body").append(patSitchBox);

            // 控制容器高宽
            var qhbrDivWidth = $("#qhbr").width();
            var qhbrDivHeight = $("#qhbr").height();
            // $("#qhbrRight").css("height",qhbrDivHeight-20);

            // 追加常用筛选和是否在院
            $("#qhbrLeft").append('<ul class="cysx"><li class="bt btTop">常用筛选</li><li>所有病人</li><li class="liLast">我的病人</li><li>手术病人</li><li class="bt">病情</li><li>病危</li><li>病重</li><li>一般</li><li class="bt">是否在院</li><li>在院病人</li><li>出院病人</li><li class="liBottom">会诊病人</li></ul>');

            // 给常用筛选注册事件
            var allPat = $("#qhbrLeft .cysx li").eq(1);
            var myPat = $("#qhbrLeft .cysx li").eq(2);
            var shPat = $("#qhbrLeft .cysx li").eq(3);
            var zyPat = $("#qhbrLeft .cysx li").eq(9);
            var cyPat = $("#qhbrLeft .cysx li").eq(10);
            var hzPat = $("#qhbrLeft .cysx li").eq(11);
            var bwPat =$("#qhbrLeft .cysx li").eq(5);
            var bzPat =$("#qhbrLeft .cysx li").eq(6);
            var ybPat =$("#qhbrLeft .cysx li").eq(7);
            var hammerCysx = $("#qhbrLeft .cysx li").hammer();
            hammerCysx.on("tap", function () {
                if ((!$(this).hasClass("bt")) && (!$(this).hasClass("active"))) {
                    moRenCysx($(this).text());
                    loadParCard(KSID, BQID, YS, YLZ, isZY, isWD, isHZ, isSH,isBQ);
                }
            });

            // 默认常用筛选
            isZY == 1 ? moRenCysx("在院病人") : '';
            isWD == 1 ? moRenCysx("我的病人") : '';
            isHZ == 1 ? moRenCysx("会诊病人") : '';

            function moRenCysx(thisText) {
                switch (thisText) {
                    case "所有病人":
                        myPat.removeClass("active");
                        allPat.addClass("active");
                        shPat.removeClass("active");
                        isWD = 0;
                        isSH = 0;
                        if (isHZ == 1) {
                            isZY = '';
                            isWD = '';
                        }
                        break;
                    case "我的病人":
                        allPat.removeClass("active");
                        myPat.addClass("active");
                        shPat.removeClass("active");
                        isWD = 1;
                        isSH = 0;
                        break;
                    case "手术病人":
                        allPat.removeClass("active");
                        myPat.removeClass("active");
                        shPat.addClass("active");
                        isSH = 1;
                        isWD = 0;
                        break;
                    case "在院病人":
                        cyPat.removeClass("active");
                        hzPat.removeClass("active");
                        zyPat.addClass("active");
                        isZY = 1;
                        isHZ = 0;
                        isWD = allPat.hasClass("active") ? 0 : 1;
                        break;
                    case "出院病人":
                        zyPat.removeClass("active");
                        hzPat.removeClass("active");
                        cyPat.addClass("active");
                        isZY = 0;
                        isHZ = 0;
                        isWD = allPat.hasClass("active") ? 0 : 1;
                        break;
                    case "会诊病人":
                        zyPat.removeClass("active");
                        cyPat.removeClass("active");
                        hzPat.addClass("active");
                        isHZ = 1;
                        isZY = '';
                        isWD = '';
                        break;
                    case "病危":
                        bzPat.removeClass("active");
                        ybPat.removeClass("active");
                        bwPat.addClass("active");
                        isBQ = 0;
                        break;
                    case "病重":
                        bwPat.removeClass("active");
                        ybPat.removeClass("active");
                        bzPat.addClass("active");
                        isBQ = 1;
                        break;
                    case "一般":
                        bwPat.removeClass("active");
                        bzPat.removeClass("active");
                        ybPat.addClass("active");
                        isBQ = 2;
                        break;
                }
            }

         // 追加科室
		$("#qhbrLeft").append('<ul class="ksUlOne" ></ul>');//style="height:'+(qhbrDivHeight-250)+'px;"
		$(ksItem).each(function(i,value){
			// 判断是否有病区或者医疗小组
			if(value.BQLIST!==null || value.YLZ!==null){
			    //判断没有关联病区的情况有医疗组
			    if(value.BQLIST){
                    var bq=utils.makeArry(value.BQLIST.BQ);
                    $("#qhbrLeft .ksUlOne").append('<li class="main_level" data-ksid="'+value.KSID+'"><div class="ksName" data-bqid="'+bq[0].BQID+'">'+value.KSMC+'<span>+</span></div></li>');
                    $(".ksUlOne>li:last").append('<ul></ul>');
                }

			}else{
				$("#qhbrLeft .ksUlOne").append('<li data-ksid="'+value.KSID+'"><div class="ksName">'+value.KSMC+'</div></li>');
			}
			// 如果有病区
			if(value.BQLIST!==null){
				$(".ksUlOne>li:last>ul").append('<li class="liLabel secd_level"><label>病区</label></li>');
				$(value.BQLIST.BQ).each(function(bqi,bqv){
					$(".ksUlOne>li:last>ul").append('<li class="bq secd_level" data-bqid="'+bqv.BQID+'">'+bqv.BQMC+'</li>');
				});
				$(".ksUlOne>li:last>ul").append('<li class="secd_level" style="clear:both;height:0px; padding:0;"></li>');
			}
			// 如果有医疗小组
			if(value.YLZ!==null){
				$(".ksUlOne>li:last>ul").append('<li class="liLabel secd_level"><label>医疗小组</label></li>');
				var ylzArry = value.YLZ.split(",");
				$(ylzArry).each(function(ylzi,ylzv){
					var ylzId = ylzv.split("-")[0];
					var ylzName = ylzv.split("-")[1];
					$(".ksUlOne>li:last>ul").append('<li class="ylz secd_level" data-ylzid="'+ylzId+'">'+ylzName+'</li>');
				});
				$(".ksUlOne>li:last>ul").append('<li class="secd_level" style="clear:both;height:0px;border-top:0px;padding:0;"></li>');
			}
			// 判断是否是默认科室
			if(value.KSID==userKsId){				
				$(".ksUlOne>li:last>.ksName").addClass("ksNameSel");
				$(".ksUlOne>li:last>.ksName>span").html("-");
				$(".ksUlOne>li:last>.ksName").css("border-bottom-right-radius","0px");
				$(".ksUlOne>li:last>ul").show();
				//病区和医疗小组标题控制
				$(".ksUlOne>li:last>ul").find(".liLabel").next().css("border-top","none");
				if($(".ksUlOne>li:last>ul").find(".liLabel").length==1){
					$(".ksUlOne>li:last>ul").find(".liLabel").hide();
					$(".ksUlOne>li:last>ul").find("li:last").css("border-top","none");
				}
			}
			
		});

		// 给科室注册点击事件 一级
		$(".main_level").on("click",function(event){
			if(!$(this).children(".ksName").hasClass("ksNameSel")){
				$(".ksUlOne>li>ul").hide();              // 所有二级关闭
				$(".ksUlOne .ksName span").html("+");
				$(".ksUlOne li .ksName").removeClass("ksNameSel").css("border-bottom-right-radius","25px");
				$(this).children(".ksName").addClass("ksNameSel");
				$(".ksUlOne>li>ul>li").removeClass("active");
				if($(this).children("ul") && $(this).children("ul").is(":hidden")){
					$(this).children(".ksName").children("span").text("-");
					$(this).children(".ksName").css("border-bottom-right-radius","0px");
					$(this).children("ul").show();
				}else if($(this).children("ul") && (!$(this).children("ul").is(":hidden"))){
					$(this).children(".ksName").children("span").text("+");
					$(this).children("ul").hide();
					$(this).find("li").removeClass("active");
				}
				//病区和医疗小组标题控制
				$(this).children("ul").find(".liLabel").next().css("border-top","none");
				if($(this).children("ul").find(".liLabel").length==1){
					$(this).children("ul").find(".liLabel").hide();
					$(this).children("ul").find("li:last").css("border-top","none");
				}
				KSID = $(this).attr("data-ksid");
				BQID = '';
				YLZ = '';
				localStorage.setItem("zlsoft-userKSPubID", KSID);
				loadParCard(KSID,BQID,YS,YLZ,isZY,isWD,isHZ,isSH,isBQ);
			}
		})
	

		// 给科室注册点击事件 二级
		$(".secd_level").on("click",function(event){
			event.stopPropagation();    //  阻止事件冒泡
			event.preventDefault();     //  阻止默认行为 ( 表单提交 )
			if((!$(this).hasClass("liLabel")) && (!$(this).hasClass("active"))){
				$(".ksUlOne li .ksName").removeClass("ksNameSel").css("border-bottom-right-radius","25px");
				$(this).parent().siblings(".ksName").css("border-bottom-right-radius","0px");
				$(".ksUlOne>li>ul>li").removeClass("active").css("border-bottom-right-radius","0px");
				$(this).addClass("active");
				// 如果是最后一个li，要增加圆弧效果
				if($(this).index()==$(this).parent().find("li").length-2){
					$(this).css("border-bottom-right-radius","20px");
				}
				if($(this).hasClass("bq")){
					BQID = $(this).attr("data-bqid");
				}else if($(this).hasClass("ylz")){
					YLZ = $(this).attr("data-ylzid");
				}
				loadParCard(KSID,BQID,YS,YLZ,isZY,isWD,isHZ,isSH,isBQ);
			}
		});

		// 加载病人卡片
		loadParCard(KSID,BQID,YS,YLZ,isZY,isWD,isHZ,isSH,isBQ);

	}

        // 点击右下角切换病人按钮时
        // hammerMainNavMin = $("#qieHuanBox").hammer();
        // hammerMainNavMin.on('tap', function(ev) {
        // 	// 关闭相册
        // 	photo.closePhoto();
        // 	$("#pageContral").hide();              // 体温单导航按钮
        // 	$("#RecordPAge").hide(); //体温单的护理记录 导航
        // 	$(".threeIframe").remove();            // 清空第三方iframe
        // 	$("#mainNavMin ul li").addClass("jinyong");
        // 	$("#mainNavMin ul li img").each(function(){
        // 		var oldImg = $(this).attr("src");
        // 		var newImg = oldImg.indexOf("W")!==-1 ? oldImg.replace("W","G") : oldImg.replace("B","G");
        // 		$(this).attr("src",newImg);
        // 	});
        // 	$("#qhbr").show();
        // 	$("#pageContral").hide();//护理page切换
        // 	$("#bingLi-List").hide();//病历目录
        // 	$("#yzParticulars").hide();//医嘱执行情况
        // });

        // 加载对应筛选项的病人卡片
        function loadParCard(KSID, BQID, YS, YLZ, isZY, isWD, isHZ, isSH,isBQ) {
            $("#LoadedTip").show();
            window.enterFlagd = true;
            clickTotal+=1;
            $.ajax({
                //初始化病人卡
                url: serviceChoose + '/DC_Patient_List',
                async: true,
                type: "post",
                data: JSON.stringify({
                    "IN":
                        {
                            "KS": KSID,               // 从login时获取默认病区
                            "BQ": BQID,              // 初始化为科室第一个病区
                            "YS": YS,                // 医生姓名
                            "YLZ": YLZ,              // 医疗组ID
                            "ZT": isZY,              // 在院：1，出院：0
                            "WD": isWD,              // 我的病人：1，所有病人：0
                            "HZ": isHZ,               // 会诊病人：1，ZT和WD不传
                            "SS": isSH,                  //手术病人：1-手术，0-非手术
                            "BK":isBQ                   //病情：0-病危，1-病重，2-一般
                        }
                }),
                timeout: utils.timeoutSec(),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json',
                },
                //成功
                success: function (responseTxt) {
                    //debugger;
                    $("#qhbrRight1").empty(".bingLiKaBox");
                    if (responseTxt.Result.OUTPUT.PATILIST == null) {
                        utils.showHide("没有对应病人");
                        $("#LoadedTip").hide();
                    } else if (responseTxt.Result.ERROR) {
                        $("#LoadedTip").hide();
                        utils.showHide(responseTxt.Result.ERROR.MSG);
                    } else {
                        var patData = responseTxt.Result.OUTPUT.PATILIST.PATIENT;
                        //var b = $(window).width();
                        var b = $("#qhbrRight").width()
                        $(patData).each(function (index, el) {
                            // 准备绑定数据
                            var id = 'blk-' + el.ZYH + '-' + el.BABY,
                                LJZT = el.LJZT,     // data-LJZT
                                LCLJZT = el.LCLJZT, // data-LCLJZT
                                PATIID = el.PATIID, // data-patiID
                                PAGEID = el.PAGEID, // data-pageID
                                SG = el.SG,
                                TZ = el.TZ,
                                CYSJ = el.CYSJ; //data-cysj
                            if (CYSJ) {
                                CYSJ = CYSJ.split(" ")[0]
                            } else {
                                CYSJ = 0;
                            }
                            // 准备宽度
                            //var patCardW = (b - 200 + 10) / 3;
                            // var patCardW = (b - 30) / 3;

                            // 头部显示数据
                            var Chuang = el.CH ? el.CH : " ", zhuyuan = el.ZYH ? el.ZYH : " ";//床号和住院ID为null时显示空格
                            var ch = '<div>' + Chuang + '</div>';      // 床号
                            var ZYID = '<span>' + zhuyuan + '</span>'; // 住院ID
                            var sexImg = el.XB == "男" ? '<img src="./img/man.png" class="color-man">' : '<img src="./img/woman.png" class=" color-woman">'; // 性别图标

                            // 护理等级
                            var hldjSpan = '';
                            if (el.HLDJ !== null) {
                                if (el.DJBZ == 1) { // 如果为一级
                                    hldjSpan = '<span class="badge input-bottom-margin float-right badge1">一</span>';
                                } else if (el.DJBZ == 2) { // 如果为二级
                                    hldjSpan = '<span class="badge input-bottom-margin float-right badge2">二</span>';
                                } else if (el.DJBZ == 3) { // 如果为三级
                                    hldjSpan = '<span class="badge input-bottom-margin float-right badge3">三</span>';
                                } else if (el.DJBZ == 0) { // 如果为特级
                                    hldjSpan = '<span class="badge input-bottom-margin float-right badgete">特</span>';
                                }
                            }

                            var nameAgeSex = '<p><font class="theLong">' + el.XM + ' ' + el.NL + '</font>' + sexImg + hldjSpan + '</p>';  // 姓名性别年龄 
                            // 临床路径
                            var lcljSpan = '<span></span>';
                            if (el.LCLJZT == 1) {       // 执行中
                                lcljSpan = '<span class="fs1 float-right lclj1 margin-left-5" aria-hidden="true" data-icon=""></span>';
                            } else if (el.LCLJZT == 2) { // 正常结束
                                lcljSpan = '<span class="fs1 float-right lclj2 margin-left-5" aria-hidden="true" data-icon=""></span>';
                            } else if (el.LCLJZT == 3) { // 变异结束
                                lcljSpan = '<span class="fs1 float-right lclj3 margin-left-5" aria-hidden="true" data-icon=""></span>';
                            }
                            // 病况
                            var bqSpan = '';
                            if (el.BK == "一般") {
                                bqSpan = '<span class="label label-success float-right">一般</span>';
                            } else if (el.BK == "危") {
                                bqSpan = '<span class="label label-important float-right">危</span>';
                            } else if (el.BK == "重") {
                                bqSpan = '<span class="label label-important float-right">重</span>';
                            }

                            // 付款方式
                            var zfylSpan = '<span class="label input-bottom-margin float-right margin-right-5 bxSpan">' + el.FKLX + '</span>';
                            // 头部容器+数据
                            var patCardHead = '<table class="btBoy"><tbody><tr><td style="width:30%"><div class="bingLiKaDengJi">' + ch + ZYID + '</div></td><td>' + nameAgeSex + lcljSpan + bqSpan + zfylSpan + '</td></tr></tbody></table>';
                            if (el.XB == "女") {
                                patCardHead = '<table class="btGirl"><tbody><tr><td style="width:30%"><div class="bingLiKaDengJi">' + ch + ZYID + '</div></td><td>' + nameAgeSex + lcljSpan + bqSpan + zfylSpan + '</td></tr></tbody></table>';
                            }
                            // 诊断结果
                            if (el.ZD == null) {
                                var zdjgDiv = '<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><span>诊断：无</span></div>';
                            } else {
                                var zdjgDiv = '<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"><span>诊断：' + el.ZD + '</span></div>';
                            }
                            // 住院情况
                            var zyDays = '<span class="float-right">' + el.ZYTS + '天</span>'; // 住院天数

                            var ryDate = '<span>入院：' + el.RYSJ.split(" ")[0] + '</span>';         // 入院日期
                            var zyCs = '<span class="zycsSpan">' + el.PAGEID + '</span>';      // 住院次数
                            var zyqk = '<div>' + ryDate + zyCs + zyDays + '</div>'
                            // 膳食建议
                            var ssjyDiv = '<div>膳食：无</div>';
                            if (el.SS !== null) {
                                ssjyDiv = '<div>膳食：' + el.SS + '</div>';
                            }
                            // 过敏信息
                            var gmDiv = '<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">过敏：无</div>';
                            if (el.GMLIST !== null) {
                                var gmStr = '';
                                for (var ii = 0; ii < el.GMLIST.ITEM.length; ii++) {
                                    gmStr = gmStr + el.GMLIST.ITEM[ii].MC + "/";
                                }
                                gmDiv = '<div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">过敏：' + gmStr.substring(0, gmStr.length - 1) + '</div>';
                            }
                            // 底部容器+数据
                            var patCardBottom = '<div class="nr">' + zdjgDiv + zyqk + ssjyDiv + gmDiv + '</div>';//<div style="clear:both;"></div>
                            // 大容器
                            var patCard = '<div style="width:31%;margin-left:2%;" id="' + id + '" class="bingLiKaBox" data-tz="' + TZ + '" data-sg="' + SG + '" data-KSID="' + KSID + '" data-LJZT="' + LJZT + '"  data-LCLJZT="' + LCLJZT + '" data-PATIID="' + PATIID + '" data-PAGEID="' + PAGEID + '" data-cysj="' + CYSJ + '">' + patCardHead + patCardBottom + '</div>';
                            $("#qhbrRight1").append(patCard);
                        });
                        //前三个去掉margin-top
                        if ($("#qhbrRight1 > div").length == 1) {
                            $("#qhbrRight1 > div").eq(0).css("margin-top", "0");

                        } else if ($("#qhbrRight1 > div").length == 2) {
                            $("#qhbrRight1 > div").eq(0).css("margin-top", "0");
                            $("#qhbrRight1 > div").eq(1).css("margin-top", "0");

                        } else if ($("#qhbrRight1 > div").length >= 3) {
                            for (var i = 0; i < 3; i++) {
                                $("#qhbrRight1 > div").eq(i).css("margin-top", "0");
                            }
                        }
                        //$("#qhbrRight").append('<div style="clear:both;"></div>');

                        // 注册病历卡点击事件
                        var blkdjhammer = $("#qhbrRight1 .bingLiKaBox").hammer();
                        blkdjhammer.on('tap', function () {
                            // 更新缩略病历卡
                            window.enterFlagd = false;
                            if(enterData){
                                brxxShort(enterData);
                            }else{
                                brxxShort($(this));
                            }

                            // 主菜单变成可点击状态
                            $("#mainNavMin ul li").removeClass('jinyong');
                            // 所有菜单都可以点击
                            for (var i = 0; i < 8; i++) {      //前4个菜单的active
                                if ($("#mainNavMin ul li").eq(i).hasClass('active')) {
                                    menuState("active", $("#mainNavMin ul li").eq(i));
                                } else {
                                    menuState("qy", $("#mainNavMin ul li").eq(i));
                                }
                            }
                            // 如果没有临床路径
                            // if(!$(this).find('td>span').eq(0).hasClass("fs1")){
                            // 	menuState("jy",$("#mainNavMin ul li").eq(2));
                            // }
                            // 判断主菜单（病历、检验、检查、护理）
                            // hasDATAlist($(this));
                            //调用接口是否启用外用系统
                            var externalAss2 = utils.externalAss();
                            if (externalAss2.length > 0) {
                                $("#url_box > ul > .AssUrltype").remove();
                                if($("#mainNavMin ul li:last-child").text() != '三方'){
                                    $("#mainNavMin > ul").append('<li class="icn-three jinyong"><img src="img/outlineW.png" class="fsls" style="width: 27px"/><p class="twoline">三方</p></li>');
                                }
                                $(externalAss2).each(function (index, el) {
                                    if(typeof el.TYPE =='object'){
                                        el.TYPE = el.TYPE[0];
                                    }
                                    if (el.TYPE === "1" && el.TITLE != '预交款') {
                                        //$("#mainNavMin > ul").append('<li data-url="' + el.URL + '" class="AssUrl"><img src="img/outlineW.png" class="fsls" style="width: 27px"/><p class="twoline">' + el.TITLE + '</p></li>')
                                        $("#url_box > ul").append('<li style="margin-bottom: 10px;float: left;" data-url="' + el.URL + '" class="AssUrltype"><img src="img/outlineW.png" class="fsls" style="width: 27px"/><p class="twoline">' + el.TITLE + '</p></li>')
                                    }
                                });
                                var icnthree=$("#mainNavMin ul  .icn-three").hammer();
                                icnthree.on('tap', function(event) {
                                    setTimeout(function(){
                                        if($("#url_box").css('display') =='block'){
                                            $("#url_box").hide();
                                        }else{
                                            $("#url_box").show();
                                        }
                                    },100)
                                });
                                $("#url_box ul .AssUrltype").unbind();
                                hammerAssUrltype = $("#url_box ul .AssUrltype").hammer();

                                // $(externalAss2).each(function (index, el) {
                                //     if(typeof el.TYPE =='object'){
                                //         el.TYPE = el.TYPE[0];
                                //     }
                                //     if (el.TYPE === "1" && el.TITLE != '预交款') {
                                //         $("#mainNavMin > ul").append('<li data-url="' + el.URL + '" class="AssUrltype"><img src="img/outlineW.png" class="fsls" style="width: 27px"/><p class="twoline">' + el.TITLE + '</p></li>')
                                //     }
                                // });
                                //$("#mainNavMin ul .AssUrltype").unbind();
                                //hammerAssUrltype = $("#mainNavMin ul .AssUrltype").hammer();
                                hammerAssUrltype.on('tap', function (ev) {
                                    $("#url_box").hide();
                                    try {
                                        // 如果来自ipad
                                        if (!recordStart) {
                                            return false;
                                        } else {
                                            openInNewWindow($(this).attr('data-url'));
                                        }
                                    } catch (error) {
                                        outlineSys($(this))
                                    }
                                })

                                $("#url_box > ul > .AssUrl").remove();
                                // $(externalAss2).each(function (index, el) {
                                //     if(typeof el.TYPE =='object'){
                                //         el.TYPE = el.TYPE[0];
                                //     }
                                //     if (el.TYPE === "2" && el.TITLE != '预交款') {
                                //         $("#mainNavMin > ul").append('<li data-url="' + el.URL + '" class="AssUrl"><img src="img/outlineW.png" class="fsls" style="width: 23px"/><p class="twoline">' + el.TITLE + '</p></li>')
                                //     }
                                // });
                                $(externalAss2).each(function (index, el) {
                                    if(typeof el.TYPE =='object'){
                                        el.TYPE = el.TYPE[0];
                                    }
                                    if (el.TYPE === "2" && el.TITLE != '预交款') {
                                        //$("#mainNavMin > ul").append('<li data-url="' + el.URL + '" class="AssUrl"><img src="img/outlineW.png" class="fsls" style="width: 27px"/><p class="twoline">' + el.TITLE + '</p></li>')
                                        $("#url_box > ul").append('<li style="margin-bottom: 10px;float: left;" data-url="' + el.URL + '" class="AssUrl"><img src="img/outlineW.png" class="fsls" style="width: 27px"/><p class="twoline">' + el.TITLE + '</p></li>')
                                    }
                                });
                                var icnthree=$("#mainNavMin ul  .icn-three").hammer();
                                icnthree.on('tap', function(event) {
                                    setTimeout(function(){
                                        if($("#url_box").css('display') =='block'){
                                            $("#url_box").hide();
                                        }else{
                                            $("#url_box").show();
                                        }
                                    },100)
                                });
                                $("#url_box ul .AssUrl").unbind();
                                hammerAssUrl = $("#url_box ul .AssUrl").hammer();
                                hammerAssUrl.on('tap', function (ev) {
                                    $("#url_box").hide();
                                    try {
                                        // 如果来自ipad
                                        if (!recordStart) {
                                            return false;
                                        } else {
                                            openInNewWindow($(this).attr('data-url'));
                                        }
                                    } catch (error) {
                                        outlineSys($(this))
                                    }
                                })
                            }
                            // 离开是哪个页面 就刷新哪个页面 默认pageID最大的那个
                            nowF5($("#dengjiUlStyle ul li:last").text());
                            for (var i = 4; i < 8; i++) {      //前4个菜单的active
                                if ($("#mainNavMin ul li").eq(i).hasClass('active')) {
                                    menuState("active", $("#mainNavMin ul li").eq(i));
                                }
                            }
                            $("#qhbr").hide();
                        });

                        // $("#qhbrRight .bingLiKaBox .nr").on("touchstart",function(){
                        // 	var thisdiv=$(this);
                        // 	setTimeout(function(){ 
                        // 		illness(thisdiv);
                        // 	}, 150);

                        // });
                        var hammerpressdiv = $("#qhbrRight .bingLiKaBox .nr").hammer();
                        hammerpressdiv.on('press', function () {
                            illness($(this));
                        })
                        $("#qhbrRight .bingLiKaBox .nr").on("touchend", function () {
                            $(this).parent().parent().find('.illness').remove();
                        });

                    }
                    $("#LoadedTip").hide();
                },
                complete: function (XMLHttpRequest, textStatus) {
                    utils.errorAjax(textStatus, loadParCard, [KSID, BQID, YS, YLZ, isZY, isWD, isHZ, isSH,isBQ]);
                }
            });
            function asyDataSolve() {
                $.ajax({
                    url: serviceChoose + "/DC_Extra_Interface",
                    type: 'POST',
                    data: {
                        "IN": {
                            "LB": "6"
                        }
                    },
                    timeout: utils.timeoutSec(),//timeout:10,     
                    contentType: "application/json",
                    dataType: "JSON",
                }).always(function (responseTxt, status, xhr) {
                    if (status == "success") {
                        utils.externalUrl(responseTxt);
                    } else {
                        return false;
                    }
                })
            }

            //调用接口是否启用外用系统
            var externalAss;
            externalAss = utils.externalAss();
            if (externalAss.length > 0) {
                $("#url_box > ul > .AssUrl").remove();
                if($("#mainNavMin ul li:last-child").text() != '三方'){
                    $("#mainNavMin > ul").append('<li class="icn-three"><img src="img/outlineW.png" class="fsls" style="width: 27px"/><p class="twoline">三方</p></li>');
                }
                $(externalAss).each(function (index, el) {
                    if(typeof el.TYPE =='object'){
                        el.TYPE = el.TYPE[0];
                    }
                    if (el.TYPE === "2" && el.TITLE != '预交款') {
                        //$("#mainNavMin > ul").append('<li data-url="' + el.URL + '" class="AssUrl"><img src="img/outlineW.png" class="fsls" style="width: 27px"/><p class="twoline">' + el.TITLE + '</p></li>')
                        $("#url_box > ul").append('<li style="width:100%;float: left;" data-url="' + el.URL + '" class="AssUrl"><img src="img/outlineW.png" class="fsls" style="width: 27px"/><p class="twoline">' + el.TITLE + '</p></li>')
                    }
                });
                $("#url_box ul .AssUrl").unbind();
                hammerAssUrl = $("#url_box ul .AssUrl").hammer();
                hammerAssUrl.on('tap', function (ev) {
                    try {
                        $("#url_box").hide();
                        // 如果来自ipad
                        if (!recordStart) {
                            return false;
                        } else {
                            openInNewWindow($(this).attr('data-url'));
                        }
                    } catch (error) {
                        outlineSys($(this))
                    }
                })
                // var icnthree=$("#mainNavMin ul  .icn-three").hammer();
                // icnthree.on('tap', function(event) {
                //     if($("#url_box").is(":hidden")){
                //         $("#url_box").show();    //如果元素为隐藏,则将它显现
                //     }else{
                //         $("#url_box").hide();     //如果元素为显现,则将其隐藏
                //     }
                // });
                if(clickTotal == '1'){
                    $("#mainNavMin ul  .icn-three").on('click',function(e){
                        e.stopPropagation();
                        e.preventDefault();
                        if (!$(this).hasClass('jinyong')) {
                            if($("#url_box").is(":hidden")){
                                $("#url_box").show();    //如果元素为隐藏,则将它显现
                            }else{
                                $("#url_box").hide();     //如果元素为显现,则将其隐藏
                            }
                        }

                    })
                }

            }
        }
        function outlineSys(thisdata) {
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

                    $("#mainNavMinTwo > div").hide();
                    $("#huaDong > div").hide();
                    $("#yzButtonBox").hide();   // 医嘱新开、复制按钮
                    //$("#yzButtonEditOne").hide();
                    $("#bingLi-List").hide();
                    $("#huaDongBaoGao").show();
                    $("#PDFdivWrapBG > div").hide();
                    $("#yzParticulars").hide(); //医嘱执行情况关闭
                    if ($("#mainNavMin ul .active img").attr("src")) {
                        var pevImgSrc = $("#mainNavMin ul .active img").attr("src").replace("B", "W");
                        $("#mainNavMin ul .active img").attr("src", pevImgSrc);
                    }
                    var thisImgSrc = $(thisdata).find("img").attr("src").replace("W", "B");
                    $(thisdata).find("img").attr("src", thisImgSrc);
                    $("#mainNavMin ul li").removeClass("active");
                    $(thisdata).addClass("active");
                    var useurl = $(thisdata).attr('data-url')
                    var threeW = $(window).width() - 80;
                    var threeH = $(window).height() - 40;
                    $("#qhbr").hide();
                    if ($("#threesys").length > 0) {
                        $("#threesys iframe").src = useurl;
                    } else {
                        $("body").append('<div class="threeIframe" id="threesys"><iframe class="threeSys" style="width:' + threeW + 'px; height:' + threeH + 'px;" src="' + useurl + '"></iframe></div>');
                    }
                    $("#LoadedTip").show();
                    setTimeout(function () {
                        $("#LoadedTip").hide();
                    }, 1000);

                }
            }
        }
        //获取病人是否有病历 检验 检查 护理等报告
        function hasDATAlist(thisdiv) {
            $("#LoadedTip").show();
            var pageID = thisdiv.attr("data-pageID");
            var patiID = thisdiv.attr("data-patiID");
            var zyBaby = thisdiv.attr("id").split("-")[2];//是否为baby
            var loadAjaxCount = 0;
            var menu = $("#mainNavMin ul li");

            // 清空缓存
            localStorage.removeItem("zlsofMdocs-install-blUrl");

            //病历
            interfaceThree(3).then(function (res) {
                //第三方接口开启
                if (res !== null) {
                    localStorage.setItem("zlsofMdocs-install-blUrl", res);
                    loadAjaxCount++;
                    menuState("qy", $(menu).eq(4));
                    if (loadAjaxCount == 4) {
                        $("#LoadedTip").hide();
                        f5Fun();
                    }
                    //三方接口未开
                } else {
                    $.ajax({
                        url: serviceChoose + "/DC_CaseHistory_List",
                        type: "POST",
                        timeout: 10000,
                        data: JSON.stringify({
                            "IN": {
                                "PATIID": patiID,
                                "PAGEID": pageID,
                                "BABY": zyBaby,
                                "FL": null,
                                "QX": null
                            }
                        }),
                        dataType: "json",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        success: function (responseTxt) {
                            loadAjaxCount++;
                            if (responseTxt.Result.ERROR) {
                                menuState("qy", $(menu).eq(4));
                            } else if (responseTxt.Result.ZLEPRLIST != null) {
                                menuState("qy", $(menu).eq(4));
                            } else {
                                menuState("jy", $(menu).eq(4));
                            }
                            if (loadAjaxCount == 4) {
                                $("#LoadedTip").hide();
                                f5Fun();
                            }

                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            if (textStatus != "success") {
                                menuState("jy", $(menu).eq(4));
                                loadAjaxCount++;
                                if (loadAjaxCount == 4) {
                                    $("#LoadedTip").hide();
                                    f5Fun();
                                }
                            }

                        }
                    });
                }
            });
            //检验
            if (localStorage.getItem("zlsofMdocs-install-jyUrl")) { //三方接口开启
                loadAjaxCount++;
                menuState("qy", $(menu).eq(5));
                if (loadAjaxCount == 4) {
                    $("#LoadedTip").hide();
                    f5Fun();
                }
            } else {  //三方接口未开
                var TempserviceChoose ='../api/services/doc/Lis';
                $.ajax({
                    url: TempserviceChoose + '/DC_Prove_List',
                    type: "post",
                    timeout: 10000,
                    data: JSON.stringify({
                        "IN":
                            {
                                "PATIID": patiID,
                                "PAGEID": pageID,
                                "Type":1,
                                "OrderID":null, //医嘱ID
                                "ReportID":null //报告ID
                            }
                    }),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function (responseTxt) {
                        loadAjaxCount++;
                        if (responseTxt.Result.ERROR) {
                            menuState("qy", $(menu).eq(5));
                        } else if (responseTxt.Result.ITEMLIST) {
                            menuState("qy", $(menu).eq(5));
                        } else {
                            menuState("jy", $(menu).eq(5));
                        }
                        if (loadAjaxCount == 4) {
                            $("#LoadedTip").hide();
                            f5Fun();
                        }
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        if (textStatus != "success") {
                            menuState("jy", $(menu).eq(5));
                            loadAjaxCount++;
                            if (loadAjaxCount == 4) {
                                $("#LoadedTip").hide();
                                f5Fun();
                            }
                        }
                    }
                });
            }
            //检查
            interfaceThree(5).then(function (res) {
                //第三方接口开启
                if (res !== null) {
                    localStorage.setItem("zlsofMdocs-install-jcUrl", res);
                    loadAjaxCount++;
                    menuState("qy", $(menu).eq(6));
                    if (loadAjaxCount == 4) {
                        $("#LoadedTip").hide();
                        f5Fun();
                    }
                    //三方接口未开
                } else {
                    localStorage.removeItem("zlsofMdocs-install-jcUrl");
                    $.ajax({
                        url: serviceChoose + '/DC_Examine_List',
                        type: 'post',
                        timeout: 10000,
                        data: JSON.stringify({
                            "IN":
                                {
                                    "PATIID": patiID,
                                    "PAGEID": pageID
                                }
                        }),
                        dataType: 'json',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        success: function (responseTxt) {
                            if (responseTxt.Result === null) {
                                responseTxt.Result = {};
                            }
                            loadAjaxCount++;
                            if (responseTxt.Result.ERROR) {
                                menuState("qy", $(menu).eq(6));
                            } else if (responseTxt.Result.FILELIST) {
                                menuState("qy", $(menu).eq(6));
                            } else {
                                menuState("jy", $(menu).eq(6));
                            }
                            if (loadAjaxCount == 4) {
                                $("#LoadedTip").hide();
                                f5Fun();
                            }
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            if (textStatus != "success") {
                                menuState("jy", $(menu).eq(6));
                                loadAjaxCount++;
                                if (loadAjaxCount == 4) {
                                    $("#LoadedTip").hide();
                                    f5Fun();
                                }
                            }
                        }
                    });
                }
            });
            //护理

            interfaceThree(7).then(function (res) {
                if (res !== null) {
                    $('#nurseIframe').attr('src', res);
                    localStorage.setItem("nurseIframe", '1');
                    menuState("qy", $(menu).eq(7));
                    $("#LoadedTip").hide();
                    f5Fun();
                } else {
                    localStorage.setItem("nurseIframe", null);
                    huliList(patiID, pageID, zyBaby).then(function (res) {
                        if (res == 1) {//列表判断启用
                            loadAjaxCount++;
                            menuState("qy", $(menu).eq(7));
                            if (loadAjaxCount == 4) {
                                $("#LoadedTip").hide();
                                f5Fun();
                            }
                        } else {
                            //判断整体护理接口是否有列表
                            var nurseData = JSON.parse(localStorage.getItem("zlsoft-wholeNurse"));
                            if (nurseData.IP != null && nurseData.PORT != null) {//端口和地址存在
                                var bqID = $("#qhbrLeft .ksUlOne>li>ul>.active").attr("data-bqid");//滨区ID
                                if (!bqID) { //没有病区id 就用kis上绑定的bqid
                                    bqID = $("#qhbrLeft .ksUlOne > li >.ksNameSel").attr("data-bqid");
                                }
                                //对应接口是否启用  没有启用$("#LoadedTip")
                                if (nurseData.HLPG == "1" || nurseData.HLPF == "1" || nurseData.HLJH == "1" || nurseData.JKXJ == "1") {
                                    utils.changePateID(patiID, bqID, pageID, zyBaby).then(function (res) {
                                        if (res == "no") {
                                            menuState("jy", $(menu).eq(7));//病人id没有转换
                                            loadAjaxCount++;
                                            if (loadAjaxCount == 4) {
                                                $("#LoadedTip").hide();
                                                f5Fun();
                                            }
                                        } else {
                                            var hlpg = 0, hlpf = 0, hljh = 0, jkxj = 0, ajaxnum = 0;
                                            if (res.Flag == 1 && res.Output.Data.length > 0) {
                                                var cookieHeader = utils.usecookie();
                                                PatientID = res.Output.Data[0].PatientID;
                                                DeptID = res.Output.Data[0].DeptID;
                                                //护理评估
                                                if (nurseData.HLPG == "1") {
                                                    var tempData = {
                                                        "Params": {
                                                            "IsSys": 1, "PatientID": PatientID, "DepartmentID": DeptID
                                                        },
                                                        "Page": { "PageNum": 1, "PageSize": 25 }
                                                    }
                                                    $.ajax({
                                                        //url:"http://61.128.195.29:7021/Services/nurse/Evaluation/Pages",
                                                        url: "http://" + nurseData.IP + ":" + nurseData.PORT + "/Services/nurse/Evaluation/Pages",
                                                        data: JSON.stringify(tempData),
                                                        type: "post",
                                                        beforeSend: function (request) {
                                                            request.setRequestHeader("hip_cookie", cookieHeader);
                                                        },
                                                        timeout: utils.timeoutSec(),//timeout:10,
                                                        dataType: "json",
                                                        contentType: "application/json",
                                                    }).always(function (responseTxt, status, xhr) {
                                                        if (status == "success") {
                                                            if (responseTxt.Flag == 1) {
                                                                hlpg = responseTxt.Output.Data.DataList.length;
                                                                console.log("护理评估1");
                                                            }

                                                        }
                                                        ajaxnum = ajaxnum + 1;
                                                        if (ajaxnum == 4) {
                                                            if (hlpg == 0 && hlpf == 0 && hljh == 0 && jkxj == 0) {
                                                                menuState("jy", $(menu).eq(7));
                                                            } else {
                                                                menuState("qy", $(menu).eq(7));
                                                            }
                                                            loadAjaxCount++;
                                                            if (loadAjaxCount == 4) {
                                                                $("#LoadedTip").hide();
                                                                f5Fun();
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    ajaxnum = ajaxnum + 1;
                                                    if (ajaxnum == 4) {
                                                        if (hlpg == 0 && hlpf == 0 && hljh == 0 && jkxj == 0) {
                                                            menuState("jy", $(menu).eq(7));
                                                        } else {
                                                            menuState("qy", $(menu).eq(7));
                                                        }
                                                        loadAjaxCount++;
                                                        if (loadAjaxCount == 4) {
                                                            $("#LoadedTip").hide();
                                                            f5Fun();
                                                        }

                                                    }
                                                }
                                                //护理评分
                                                if (nurseData.HLPF == "1") {
                                                    var hlpf = {
                                                        "Params": { "PatientID": PatientID }
                                                    };
                                                    $.ajax({
                                                        //url:"http://61.128.195.29:7021/Services/nurse/PatientCareMark/List",
                                                        url: "http://" + nurseData.IP + ":" + nurseData.PORT + "/Services/nurse/PatientCareMark/List",
                                                        data: JSON.stringify(hlpf),
                                                        type: "post",
                                                        beforeSend: function (request) {
                                                            request.setRequestHeader("hip_cookie", cookieHeader);
                                                        },
                                                        timeout: utils.timeoutSec(),//timeout:10,
                                                        dataType: "json",
                                                        contentType: "application/json",
                                                    }).always(function (responseTxt, status, xhr) {
                                                        if (status == "success") {
                                                            if (responseTxt.Flag == 1) {
                                                                hlpf = responseTxt.Output.Data.length
                                                                console.log("护理评分");
                                                            }
                                                        }
                                                        ajaxnum = ajaxnum + 1;
                                                        if (ajaxnum == 4) {
                                                            if (hlpg == 0 && hlpf == 0 && hljh == 0 && jkxj == 0) {
                                                                menuState("jy", $(menu).eq(7));
                                                            } else {
                                                                menuState("qy", $(menu).eq(7));
                                                            }
                                                            loadAjaxCount++;
                                                            if (loadAjaxCount == 4) {
                                                                $("#LoadedTip").hide();
                                                                f5Fun();
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    ajaxnum = ajaxnum + 1;
                                                    if (ajaxnum == 4) {
                                                        if (hlpg == 0 && hlpf == 0 && hljh == 0 && jkxj == 0) {
                                                            menuState("jy", $(menu).eq(7));
                                                        } else {
                                                            menuState("qy", $(menu).eq(7));
                                                        }
                                                        loadAjaxCount++;
                                                        if (loadAjaxCount == 4) {
                                                            $("#LoadedTip").hide();
                                                            f5Fun();
                                                        }

                                                    }
                                                }
                                                //护理计划
                                                if (nurseData.HLJH == "1") {
                                                    var hljh = {
                                                        "Params": { "PatientID": PatientID },
                                                    };
                                                    $("#LoadedTip").show();
                                                    $.ajax({
                                                        //url:"http://61.128.195.29:7021/Services/nurse/PatientNursingPlan/GetPlans",
                                                        url: "http://" + nurseData.IP + ":" + nurseData.PORT + "/Services/nurse/PatientNursingPlan/GetPlans",
                                                        data: JSON.stringify(hljh),
                                                        type: "post",
                                                        timeout: utils.timeoutSec(),//timeout:10,
                                                        dataType: "json",
                                                        beforeSend: function (request) {
                                                            request.setRequestHeader("hip_cookie", cookieHeader);
                                                        },
                                                        contentType: "application/json",
                                                    }).always(function (responseTxt, status, xhr) {
                                                        if (status == "success") {
                                                            if (responseTxt.Flag == 1) {
                                                                hljh = responseTxt.Output.Data.length;
                                                                console.log("护理计划");
                                                            }
                                                        }
                                                        ajaxnum = ajaxnum + 1;
                                                        if (ajaxnum == 4) {
                                                            if (hlpg == 0 && hlpf == 0 && hljh == 0 && jkxj == 0) {
                                                                menuState("jy", $(menu).eq(7));
                                                            } else {
                                                                menuState("qy", $(menu).eq(7));
                                                            }
                                                            loadAjaxCount++;
                                                            if (loadAjaxCount == 4) {
                                                                $("#LoadedTip").hide();
                                                                f5Fun();
                                                            }

                                                        }
                                                    })
                                                } else {
                                                    ajaxnum = ajaxnum + 1;
                                                    if (ajaxnum == 4) {
                                                        if (hlpg == 0 && hlpf == 0 && hljh == 0 && jkxj == 0) {
                                                            menuState("jy", $(menu).eq(7));
                                                        } else {
                                                            menuState("qy", $(menu).eq(7));
                                                        }
                                                        loadAjaxCount++;
                                                        if (loadAjaxCount == 4) {
                                                            $("#LoadedTip").hide();
                                                            f5Fun();
                                                        }

                                                    }
                                                }
                                                //健康宣教    
                                                if (nurseData.JKXJ == "1") {
                                                    $("#LoadedTip").show();
                                                    var jcxj = {
                                                        "Params": {
                                                            "IsSys": 1, "PatientID": PatientID, "DepartmentID": DeptID
                                                        },
                                                        "Page": { "PageNum": 1, "PageSize": 25 }
                                                    }
                                                    $.ajax({
                                                        //url:"http://61.128.195.29:7021/Services/nurse/Education/Pages",
                                                        url: "http://" + nurseData.IP + ":" + nurseData.PORT + "/Services/nurse/Education/Pages",
                                                        data: JSON.stringify(jcxj),
                                                        type: "post",
                                                        beforeSend: function (request) {
                                                            request.setRequestHeader("hip_cookie", cookieHeader);
                                                        },
                                                        timeout: utils.timeoutSec(),//timeout:10,
                                                        dataType: "json",
                                                        contentType: "application/json",
                                                    }).always(function (responseTxt, status, xhr) {
                                                        if (status == "success") {
                                                            if (responseTxt.Flag == 1) {
                                                                jkxj = responseTxt.Output.Data.DataList.length;
                                                                console.log("健康宣教12");
                                                            }
                                                        }
                                                        ajaxnum = ajaxnum + 1;
                                                        if (ajaxnum == 4) {
                                                            if (hlpg == 0 && hlpf == 0 && hljh == 0 && jkxj == 0) {
                                                                menuState("jy", $(menu).eq(7));
                                                            } else {
                                                                menuState("qy", $(menu).eq(7));
                                                            }
                                                            loadAjaxCount++;
                                                            if (loadAjaxCount == 4) {
                                                                $("#LoadedTip").hide();
                                                                f5Fun();
                                                            }

                                                        }
                                                    })

                                                } else {
                                                    ajaxnum = ajaxnum + 1;
                                                    if (ajaxnum == 4) {
                                                        if (hlpg == 0 && hlpf == 0 && hljh == 0 && jkxj == 0) {
                                                            menuState("jy", $(menu).eq(7));
                                                        } else {
                                                            menuState("qy", $(menu).eq(7));
                                                        }
                                                        loadAjaxCount++;
                                                        if (loadAjaxCount == 4) {
                                                            $("#LoadedTip").hide();
                                                            f5Fun();
                                                        }

                                                    }
                                                }
                                            } else {
                                                menuState("jy", $(menu).eq(7));//病人id没有转换
                                                loadAjaxCount++;
                                                if (loadAjaxCount == 4) {
                                                    $("#LoadedTip").hide();
                                                    f5Fun();
                                                }
                                            }
                                        }
                                    });
                                } else {
                                    menuState("jy", $(menu).eq(7));
                                    loadAjaxCount++;
                                    if (loadAjaxCount == 4) {
                                        $("#LoadedTip").hide();
                                        f5Fun();
                                    }
                                }
                            } else {
                                menuState("jy", $(menu).eq(7));
                                loadAjaxCount++;
                                if (loadAjaxCount == 4) {
                                    $("#LoadedTip").hide();
                                    f5Fun();
                                }
                            }
                        }

                    });
                }
            })

            function f5Fun() {
                // 离开是哪个页面 就刷新哪个页面 默认pageID最大的那个
                nowF5($("#dengjiUlStyle ul li:last").text());
                for (var i = 4; i < 8; i++) {      //前4个菜单的active
                    if ($("#mainNavMin ul li").eq(i).hasClass('active')) {
                        menuState("active", $("#mainNavMin ul li").eq(i));
                    }
                }
                $("#qhbr").hide();
            }
        }
        //护理的护理数据
        function huliList(patiID, pageID, zyBaby) {
            var dtd = $.Deferred();
            $.ajax({
                url: serviceChoose + "/DC_TendFile_List",
                type: 'post',
                data: JSON.stringify({
                    "IN": {
                        "PATIID": patiID,
                        "PAGEID": pageID,
                        "BABY": zyBaby,    //是否baby
                        "FL": "全部",
                        "QX": "全部"
                    }
                }),
                timeout: 10000,
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).always(function (responseTxt, status, xhr) {
                var qy = 0;
                if (status == "success") {
                    if (responseTxt.Result.ERROR) {
                        qy = 0;
                        dtd.resolve(qy);
                    } else if (responseTxt.Result.OUTPUT.ITEMLIST) {
                        qy = 1;
                        dtd.resolve(qy);
                    } else {
                        qy = 0;
                        dtd.resolve(qy);
                    }
                } else {
                    dtd.resolve(qy);
                }
            })
            return dtd.promise();
        }


        // 第三方接口 病历 检查
        function interfaceThree(lb) {
            return $.ajax({
                url: serviceChoose + "/DC_GetInterfaceConfig",
                type: "post",
                timeout: utils.timeoutSec(),//timeout:10,
                dataType: "json",
                headers: {
                    'Content-Type': "application/json"
                },
                data: JSON.stringify({
                    "LB": lb            //  3：病历  5：检查 7: 护理                
                }),               
                complete: function (XMLHttpRequest, textStatus) {
                    //utils.errorAjax(textStatus,interfaceThree,[]);
                }
            }).then(function (responseTxt) {
                var returnData = null;
				responseTxt.Result.OUTPUT = {};
				responseTxt.Result.OUTPUT = responseTxt.Result.Output;
				
                if (responseTxt.Result.OUTPUT !== null) {
                    // 接口地址
					if(!responseTxt.Result.OUTPUT.CONFIG){return false};
                    var blUrl = responseTxt.Result.OUTPUT.CONFIG.JK["#cdata-section"];
                    // 参数内容
                    var csText = '?';
                    // 获取参数与参数之间的分隔符
                    var SSD = responseTxt.Result.OUTPUT.CONFIG.SSD["#cdata-section"];
                    // 参数名和参数值之间的分隔符
                    var ZYD = responseTxt.Result.OUTPUT.CONFIG.ZYD["#cdata-section"];
                    // 判断是否加密
                    var JM = false;
                    if (responseTxt.Result.OUTPUT.CONFIG.JMGZ["#cdata-section"] == "1") {
                        JM = true;
                    }
                    // 对那些值加密 1：参数名和参数值都加密，2：参数名加密，3：参数值加密
                    var JMNR = responseTxt.Result.OUTPUT.CONFIG.JMNR["#cdata-section"];

                    //准备数据 关联属性，1：医嘱id，2：写死zldoc://，3：当前用户名，4：当前病人住院号，5：住院次数（就是主页id），6：病人id
                    var data2 = 'zldoc://';
                    var data3 = $("#username").val();
                    var data4 = $("#slzyID").text();
                    var data5 = $("#slzyID").attr("data-pageid");
                    var data6 = $("#slzyID").attr("data-patiid");

                    // 如果有入参
                    if (responseTxt.Result.OUTPUT.CONFIG.LIST.ITEM) {
                        var item = responseTxt.Result.OUTPUT.CONFIG.LIST.ITEM;
                        item = utils.makeArry(item);//转换数组
                        for (var i in item) {
                            var MC = item[i].MC["#cdata-section"];
                            if (item[i].GL == undefined) {
                                var NR = item[i].NR["#cdata-section"];
                            } else {
                                var gl;
                                switch (item[i].GL) {
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
                            var pwd = "加密";
                            if (JM == true && JMNR == "1") {
                                MC = CryptoJS.AES.encrypt(item[i].MC["#cdata-section"], pwd);
                                NR = CryptoJS.AES.encrypt(NR, pwd);
                            } else if (JM == true && JMNR == "2") {
                                MC = CryptoJS.AES.encrypt(item[i].MC["#cdata-section"], pwd);
                            } else if (JM == true && JMNR == "3") {
                                NR = CryptoJS.AES.encrypt(NR, pwd);
                            }
                            if (i == item.length - 1) {
                                csText = csText + MC + ZYD + NR;
                            } else {
                                csText = csText + MC + ZYD + NR + SSD;
                            }
                        }
                        blUrl = blUrl + csText;
                    }
                    returnData = blUrl;
                }
                return returnData;
            });
        }

        // 菜单按钮状态控制
        function menuState(status, thisDom) {
            var thisDomImg = thisDom.children('img').attr("src");
            var newImgSrc = '';
            if (status == "active") {
                // 改变所有 非禁用状态的 按钮图片
                $(thisDom).siblings().each(function (i, v) {
                    if (!$(v).hasClass("jinyong")) {
                        var thisSrc = thisDom.siblings().eq(i).children('img').attr("src");
                        thisDom.siblings().eq(i).children('img').attr("src", thisSrc.replace("B", "W"));
                    }
                });
                // 改变当前图片
                if (thisDomImg.indexOf("W") !== -1) {
                    newImgSrc = thisDomImg.replace("W", "B");
                } else if (thisDomImg.indexOf("G") !== -1) {
                    newImgSrc = thisDomImg.replace("G", "B");
                } else {
                    newImgSrc = thisDomImg;
                }
                thisDom.children('img').attr("src", newImgSrc);
                // 改变所有文字
                thisDom.siblings().removeClass("active");
                // 改变当前文字
                thisDom.addClass("active");
            } else if (status == "jy") {
                // 改变图片
                if (thisDomImg.indexOf("B") !== -1) {
                    newImgSrc = thisDomImg.replace("B", "G");
                } else if (thisDomImg.indexOf("W") !== -1) {
                    newImgSrc = thisDomImg.replace("W", "G");
                } else {
                    newImgSrc = thisDomImg;
                }
                thisDom.children('img').attr("src", newImgSrc);
                // 改变文字
                thisDom.removeClass('active').addClass("jinyong");
            } else if (status == "qy") {
                // 改变图片
                if (thisDomImg.indexOf("G") !== -1) {
                    newImgSrc = thisDomImg.replace("G", "W");
                } else if (thisDomImg.indexOf("B") !== -1) {
                    newImgSrc = thisDomImg.replace("B", "W");
                } else {
                    newImgSrc = thisDomImg;
                }
                thisDom.children('img').attr("src", newImgSrc);
                // 改变文字
                thisDom.removeClass('jinyong');
            }
        }


        // 点击病历卡时  显示详细信息左边小块
        function brxxShort(thisBR) {
            var zyID = thisBR.attr("data-patiID");
            var zyKSID = thisBR.attr("data-KSID");
            var pageid = thisBR.attr("data-pageID");
            var ljzt = thisBR.attr("data-LJZT");
            var lcljzt = thisBR.attr("data-LCLJZT");
            var lctz = thisBR.attr("data-tz");
            var lcsg = thisBR.attr("data-sg");
            var zyBaby = thisBR.attr("id").split("-")[2];//是否为baby
            var cysj = thisBR.attr("data-CYSJ");
            if (zyBaby == "0") {
                var baby = "no";
            } else {
                baby = "yes";
            }

            var currentPatient = {
                NAME: thisBR.find('.theLong').text().split(' ')[0],
                HospitalNum: thisBR.find('.bingLiKaDengJi span').text(),
                HospitalCount: thisBR.find('.zycsSpan').text(),
                PATIID: zyID,
                KSID: zyKSID,
                PAGEID: pageid,
                LJZT: ljzt,
                LCLJZT: lcljzt,
                BABY: zyBaby,
                TZ:lctz,
                SG:lcsg
            }
            try {
                localStorage.currentPatient = JSON.stringify(currentPatient);
            } catch (e) {
                console.log(e);
            }

            //数据绑定
            $("#slzyID").attr({ "data-patiID": zyID, "data-baby": baby, "data-KSID": zyKSID, "data-pageID": pageid, "data-cysj": cysj });
            $("#slLCLJ").attr({ "data-LCLJZT": lcljzt, "data-LJZT": ljzt });
            $("#qhbrFather").hide();
            var ch, zyh, fldj, xmnl, zyts, zdxx, bk, zycs, fldj;
            var nlarry = [], ljarry = [];
            //床号
            ch = thisBR.find('.bingLiKaDengJi div').text();
            //护理等级
            fldj = thisBR.find('tr .badge').text();
            //住院号
            zyh = thisBR.find('.bingLiKaDengJi span').text();
            //姓名年龄
            xmnl = thisBR.find('tr td').eq(1).find('p').find('font').text();
            nlarry = xmnl.split(" ");

            //住院天数
            zyts = thisBR.find('.nr div .float-right').text();
            //诊断信息
            zdxx = thisBR.find('.nr div').eq(0).find("span").text();
            //病况
            bk = thisBR.find('table .label').eq(0).text();
            //住院次数
            zycs = thisBR.find('.nr .zycsSpan').text();
            //护理等级
            fldj = thisBR.find('tr td').eq(1).find('p').find('.badge').text();

            //性别
            if (thisBR.find("tbody p img").hasClass("color-woman")) {
                $("#slXB").removeClass('color-man').addClass("color-woman").find('img').attr('src', './img/woman.png');
            } else {
                $("#slXB").removeClass('color-woman').addClass("color-man").find('img').attr('src', './img/man.png');
            }
            $("#slCH").text(ch);
            $("#slNAME").text(nlarry[0]);


            //年龄处理
            if (thisBR.attr("id").split("-")[2] == 0) {
                //只显示数字
                $("#baby-yes").css("display", "none");
                $("#slAGE").show();
                var newnl = nlarry[1].replace('岁', " ");
                $("#slAGE").text(newnl);
            } else {
                $("#slAGE").hide();
                $("#baby-yes").css("display", "inline-block").text(nlarry[1]);
            }

            $("#slzyID").text(zyh);
            $("#slRYSJ").text(zyts);
            $("#slZDXX").text(zdxx);
            $("#dengJi").text(zycs);
            $("#slBQZT").text(bk);
            //获取临床路径
            var lclj = thisBR.find('td>span').eq(0).attr('class');
            if (lclj !== undefined) {
                ljarry = lclj.split(" ");
                $("#slLCLJ").removeClass("lclj1 lclj2 lclj3");
                if (ljarry.length == 4) {
                    $("#slLCLJ").attr("data-icon", thisBR.find('td>span').eq(0).attr("data-icon")).addClass(ljarry[2]);
                    $("#slLCLJ").css("display", "block");
                } else if (ljarry.length == 3) {
                    $("#slLCLJ").hide();
                }
            } else {
                $("#slLCLJ").hide();
                $("#slLCLJ").removeClass("lclj1 lclj2 lclj3");
            }
            //护理等级
            if (fldj == "一") {
                $("#slHLDJ").show();
                $("#slHLDJ").removeClass("badge2 badge3 badgete");
                $("#slHLDJ").text(fldj).addClass('badge1');
            } else if (fldj == "二") {
                $("#slHLDJ").show();
                $("#slHLDJ").removeClass("badge1 badge3 badgete");
                $("#slHLDJ").text(fldj).addClass('badge2');
            } else if (fldj == "三") {
                $("#slHLDJ").show();
                $("#slHLDJ").removeClass("badge1 badge2 badgete");
                $("#slHLDJ").text(fldj).addClass('badge3');
            } else if (fldj == "特") {
                $("#slHLDJ").show();
                $("#slHLDJ").removeClass("badge1 badge2 badge3");
                $("#slHLDJ").text(fldj).addClass('badgete');
            } else if (fldj == "") {
                $("#slHLDJ").hide();
                $("#slHLDJ").removeClass("badge1 badge2 badge3");
            }
            // 缩略病历卡 pageID 列表
            $("#dengjiUlStyle ul").empty("li");
            for (var pagei = 1; pagei <= zycs; pagei++) {
                $("#dengjiUlStyle ul").append('<li>' + pagei + '</li>');
                if (pagei == zycs) {
                    $("#dengjiUlStyle ul li:last-child").css("border-bottom-style", "none")
                }
            }
            // 注册点击事件
            var pageIDhammer = $("#dengjiUlStyle ul li").hammer();
            pageIDhammer.on("tap", function (event) {
                event.stopPropagation();    //  阻止事件冒泡
                event.preventDefault();     //  阻止默认行为 ( 表单提交 )
                switchPageID($(this));
            });

            //拍照录音按钮
            $("#voiceAndphoto ul li").unbind();
            var voiceAndphotohammer = $("#voiceAndphoto ul li").hammer();
            voiceAndphotohammer.on('tap', function (event) {
                event.stopPropagation();    //  阻止事件冒泡
                event.preventDefault();     //  阻止默认行为 ( 表单提交 )
                photoOrVoice($(this));
            });
        }

        //刷新当前页
        function nowF5(thisPage) {
            var gongNeng = "", three = "";
            if ($("#mainNavMin ul").find(".active").length == 1) {
                gongNeng = $("#mainNavMin ul").find(".active").find("p").text();
                three = $("#mainNavMin ul").find(".active").attr('data-url');
            } else {
                gongNeng = "主页";
            }
            $("#mainNavMin ul li").removeClass("active");
            $("#inHis li").remove();        //清空住院病历列表
            $("#InformPaper li").remove();  //清空知情文件列表  
            $("#disProve li").remove();     //清空知情文件列表  
            $("#PDFdivWrapBL > .pdf").remove();        //病历pdf清空
            $("#PDFdivWrapBL > div > iframe").remove(); //病历xml清空
            $("#inspection li").remove();     // 清空检验列表
            $("#PDFdivWrapBG>div").remove();  // 清空检验iframe容器	
            $("#examine li").remove();           // 清空检查列表
            $("#PDFdivWrapBG .PDFdiv").remove();  //清空检查pdf容器
            $("#newBingLiList li").remove();  //病历新接口	
            $("#linChuang").hide();           //临床路径
            $("#bingLi-List").hide();         // 病程记录 目录
            $("#pageContral").hide();         //护理体温单导航条

            switch (gongNeng) {
                case "主页":
                    // 选中主页
                    $("#mainNavMin ul li:first").addClass("active");
                    $("#mainNavMin ul li:first img").attr("src", "img/homeB.png");
                    patientHomePage.index();
                    break;
                case "一览":
                    // 选中诊疗
                    $("#mainNavMin ul li").eq(1).addClass("active");
                    consulting.consulting();
                    break;
                case "路径":
                    // 选中临床
                    if (!($("#mainNavMin ul li").eq(2).hasClass('jinyong'))) {
                        $("#mainNavMin ul li").eq(2).addClass("active");
                        clinic.clinic();
                    }
                    break;
                case "医嘱":
                    // 选中医嘱
                    $("#mainNavMin ul li").eq(3).addClass("active");
                    // 第一次选中长嘱 当前   以后不更改
                    if (!$("#qxSelect li").hasClass('XuanZhong')) {
                        $("#qxSelect li:last").addClass("XuanZhong");
                        $("#flSelect li:first").addClass("XuanZhong");
                    }
                    doctorAdvice.docActListLoad("yes", 0);  // 加载医嘱列表数据   yes:要清空已追加的tr  0:从第一页开始加载
                    utils.yiZhuEditFunction();
                    break;
                case "病历":
                    // 默认选中病历
                    if (!($("#mainNavMin ul li").eq(4).hasClass('jinyong'))) {
                        $("#mainNavMin ul li").eq(4).addClass("active");
                        medicalRecords.medicalRecords();
                    }
                    // utils.yiZhuEditFunction();   //在病历中会出现编辑 所以注释
                    break;
                case "检验":
                    // 默认选中检验
                    if (!($("#mainNavMin ul li").eq(5).hasClass('jinyong'))) {
                        $("#mainNavMin ul li").eq(5).addClass("active");
                        inspection.inspection();
                    }
                    break;
                case "检查":
                    // 默认选中检验
                    if (!($("#mainNavMin ul li").eq(6).hasClass('jinyong'))) {
                        $("#mainNavMin ul li").eq(6).addClass("active");
                        examine.examine();
                    }
                    break;
                case "护理":
                    // 默认选中护理
                    if (!($("#mainNavMin ul li").eq(7).hasClass('jinyong'))) {
                        $("#mainNavMin ul li").eq(7).addClass("active");
                        $("#nurseRecords").empty("li"); //清空护理记录单
                        if (localStorage.nurseIframe == '1') {
                            $("#nurseIframe").show();
                        } else {
                            nurseRecords.nurseHis();
                        }
                        // nurseRecords.nurseHis();
                    }
                    break;
            }
        }
        // 切换pageID病历
        function switchPageID(thisPage) {
            if (thisPage.text() !== $("#dengJi").text()) {
                $("#dengjiUlStyle li").removeClass('changClass');
                thisPage.addClass('changClass');
                $("#dengJi").text(thisPage.text());
                // 更新pageID
                $("#slzyID").attr("data-pageid", thisPage.text());
                // 消失\			
                $("#voiceAndphoto").addClass('animated fadeOut');
                $("#dengjiUlStyle").addClass('animated fadeOut');
                $("#BlockClick").hide();  //遮挡隐藏
                setTimeout(function () {
                    $("#dengjiUlStyle").css("display", "none");
                    $("#voiceAndphoto").css("display", "none");
                }, 1000);
                nowF5(thisPage.text());
            }
        }

        //显示详细病情
        function illness(thisdiv) {
            thisdiv.parent().parent().find('.illness').remove();
            var illtext = thisdiv.find("div").eq(0).text();
            var divindex = thisdiv.parent().index();
            if (parseInt(divindex) % 3 == 2) {
                thisdiv.append('<div class="illnessdiv-left illness"><div class="tuchu"></div><div class="cont">' + illtext + '</div></div>')
            } else {
                thisdiv.append('<div class="illnessdiv illness"><div class="tuchu"></div><div class="cont">' + illtext + '</div></div>')
            }
            var libottom = $(window).height() - thisdiv.offset().top;
            var divhei = thisdiv.find('.cont').height();
            if (parseInt(libottom) < parseInt(divhei)) {
                thisdiv.find('.cont').css("margin-top", parseInt(libottom) - parseInt(divhei));
            }
        }
        $("#slZDXX").on("touchstart", function () {// click
            pateillness($(this));
        });
        $("#slZDXX").on("touchend", function () {
            $("#smallillness").hide();
        });
		
		  $("#mainNavUserBox").on("touchstart", function () {// click
            $("#voiceAndphoto").show();
        });
        // 病情小块显示全部病情
        function pateillness(thisdiv) {
            $("#smallillness").remove();
            var illtext = thisdiv.text();
            $("#boxCenterOne").append('<div class="smallillness" id="smallillness"><div class="tuchu"></div><div class="cont">' + illtext + '</div></div>');
            var libottom = $(window).height() - $("#smallillness").offset().top;
            var divhei = $("#smallillness").find('.cont').height();
            if (parseInt(libottom) < parseInt(divhei)) {
                $("#smallillness").find('.cont').css("margin-top", parseInt(libottom) - parseInt(divhei));
            }
        }
        //选中录音或者照相
        function photoOrVoice(thisli) {
            //点击出现的选中 后消失
            $("#voiceAndphoto li").removeClass('xuanZhong');
            thisli.addClass('xuanZhong');
            $("#voiceAndphoto").addClass('animated fadeOut');
            $("#dengjiUlStyle").addClass('animated fadeOut');
            $("#BlockClick").hide();//遮挡隐藏		
            setTimeout(function () {
                $("#dengjiUlStyle").css("display", "none");
                $("#voiceAndphoto").css("display", "none");
            }, 1000);
            //点击的是录音
            if (thisli.index() == 0) {
                video.video()   //录音
            } else {
                photo.photo();   //拍照
            }
        }
    window.sendScanMsg = function (pid) {
        //1)进入首页没选择病人；2）看右边模块选中状态
        try {
            $.ajax({
                url: serviceChoose.replace('/Patient', '') + "/DocSys/GetWristbandParams",
                type: 'get',
                timeout: utils.timeoutSec(),
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (res) {
                    if (res.Result.ERROR) {
                        utils.showHide(res.Result.ERROR.MSG);
                    }
                    else if (!$.isEmptyObject(res.Result.Output)) {
                        var wristbandPrefix = res.Result.Output.WristbandPrefix;//前缀
                        var wristbandLen = res.Result.Output.WristbandLen;//长度
                        var reg = /^(0*)(\d*)(\d)/;
                        pid = pid.toString().substr(wristbandPrefix.length);
                        var patientID = pid.match(reg)[2];//病人ID
                        var baby = pid.match(reg)[3];//婴儿
                        //通过病人ID进行病人列表查询
                        var listDiv = document.getElementById("qhbrRight1").getElementsByTagName("div");
                        for (var i = 0; i < listDiv.length; i++) {
                            if(listDiv[i].getAttribute('data-patiid') == patientID){
                                var currentPatient = {
                                    NAME: $(listDiv[i]).find('.theLong').text().split(' ')[0],
                                    HospitalNum: $(listDiv[i]).find('.bingLiKaDengJi span').text(),
                                    HospitalCount: $(listDiv[i]).find('.zycsSpan').text(),
                                    PATIID: patientID,
                                    KSID: $(listDiv[i]).attr("data-KSID"),
                                    PAGEID: $(listDiv[i]).attr("data-pageID"),
                                    LJZT: $(listDiv[i]).attr("data-LJZT"),
                                    LCLJZT: $(listDiv[i]).attr("data-LCLJZT"),
                                    BABY: baby,
                                    TZ:$(listDiv[i]).attr("data-tz"),
                                    SG:$(listDiv[i]).attr("data-sg")
                                }
                                try {
                                    localStorage.setItem('currentPatient',currentPatient);
                                    localStorage.currentPatient = JSON.stringify(currentPatient);
                                    enterData = $(listDiv[i]);
                                } catch (e) {
                                    console.log(e);
                                }
                                break;
                            }
                        }
                        if(enterData == ''){
                            utils.showHide('病人腕带信息未设置。');
                            return false;
                        }
                        $('#qhbrRight1 .bingLiKaBox').trigger("tap");
                        var item = JSON.parse(localStorage.currentPatient);
                        $.ajax({
                            url: serviceChoose + "/DC_SaveRecord_Room",
                            type: 'post',
                            timeout: utils.timeoutSec(),
                            dataType: 'json',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Bearer ' + JSON.parse(localStorage.userInfo).access_token
                            },
                            data: JSON.stringify({
                                "PATIID": patientID,
                                "PAGEID": item.PAGEID,
                                "BABY": baby
                            }),
                            success: function (dataCont) {
                              if(dataCont.Result.Output == 1){
                                  utils.showHide('病人巡房登记成功。');
                              }else{
                                  utils.showHide('病人巡房登记失败！');
                              }
                            }
                        });
                    }
                    else {
                        utils.showHide('病人腕带信息未设置。');
                    }
                }
            });
        }
        catch (error) {
            utils.showHide('病人腕带信息未设置。');
        }
    }
    window.enterFlag = function () {
        return window.enterFlagd;
    }
        return {
            patSwitch: patSwitch
        }


    });