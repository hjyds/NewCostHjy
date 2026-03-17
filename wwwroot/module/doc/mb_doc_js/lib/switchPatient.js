define(["jquery", "hammer","jqueryhammer","utils","patientHomePage","doctorAdvice","medicalRecords","examineReport","examine","inspection","nurseRecords","consulting","clinic"], function(jquery, hammer, jqueryhammer,utils,patientHomePage,doctorAdvice,medicalRecords,examineReport,examine,inspection,nurseRecords,consulting,clinic) {
	var serviceChoose = utils.urlFunction();
	/*切换病人 手势关闭
	hammerqhbr = $("#qhbr").hammer();
	hammerqhbr.on('swiperight',function(ev){
		$("#qhbr").hide().removeClass('animated').removeClass('bounceInRight');
		$("#qhbrFather").hide();

	});*/

	//点击左侧导航   病人切换
	function chooseBQ(BQ) {                     //BQ为默认科室名称
		//初始化
		//  1、点击左侧导航栏时信息存储
		$("#changYongPatienChose li").removeClass("XuanZhong"); //常用筛选 移除之前的选择
		$("#zybrList li").removeClass("XuanZhong");   //是否在原 移除之前的选择
		var choosePat = $(".btBox-myPat"),      //常用筛选   默认我的病人
			InHospital=$(".btBox-in"),          //是否在原   默认在院病人
			chooseKS='',                        //科室
			chooseKSBQ='',                      //病区
			chooseKSXZ='';                      //小组
		//  2、获取病人卡信息参数
		var KSID=userKSPubID,                   //默认科室   从login出获取
			BQID='',                            //默认病区   为空
			YS=userNamePub,                     //默认医生   从login出获取
			YLZ='',                             //默认医疗组
			isZY=1,                             //是否在院
			isWD=1,                             //我的
			isHZ=0;                             //会诊

		$("#userInfobox font").attr("data-ksID",userKSPubKSID);  //初始化创建data-ksID
		//选中默认科室，并打开
		var allKS=$(".btBox-ks");               // 选中所有KS 列表
		$.each(allKS,function(){
			if ($(this).text()==BQ){
				chooseKS=$(this);
				$(this).addClass("ksActive");
				$(this).next().css("display","block");
				$(this).find(".btBox-arrows").html("&ndash;");
				// 存储默认科室ID
				$("#userInfobox font").attr("data-ksid",$(this).attr("id").split("-")[1]);
				return false;
			}
		});
		$("#mainNavMin > ul > li").removeClass("active");
		$(choosePat).addClass("XuanZhong");
		$(InHospital).addClass("XuanZhong");
		$(chooseKS).addClass("ksActive");
		$(chooseKSBQ).addClass("XuanZhong");
		$(chooseKSXZ).addClass("XuanZhong");
		//选中默认科室，并打开 -------------------------------------------------------------------------------------//

        //初始化----------------------------------------------------------------------------------------------------------//

		// 点击右下角切换病人按钮时
		hammerMainNavMin = $("#qieHuanBox").hammer();
		hammerMainNavMin.on('tap', function(ev) {
			$("#bingLi-List").hide();
			if($("#qhbr").is(":hidden")){
				$(".btBox-ks").removeClass("ksActive");
				getPatInfo(KSID,BQID,YS,YLZ,isZY,isWD,isHZ);
				$(choosePat).addClass("XuanZhong");
				$(InHospital).addClass("XuanZhong");
				$(chooseKS).addClass("ksActive");
				$(chooseKSBQ).addClass("XuanZhong");
				$(chooseKSXZ).addClass("XuanZhong");
				$("#mainNavMin ul li").addClass('jinyong');
				for (var i = 0; i < $("#mainNavMin ul li img").length; i++) {
					if($("#mainNavMin ul li").eq(i).hasClass('active')){
						var pevImgSrc = $("#mainNavMin ul li img").eq(i).attr("src").replace("B","G");
				    	$("#mainNavMin ul li img").eq(i).attr("src",pevImgSrc);
					}else{
						var pevImgSrcno = $("#mainNavMin ul li img").eq(i).attr("src").replace("W","G");
				    	$("#mainNavMin ul li img").eq(i).attr("src",pevImgSrcno);
					}
					
				}
				$("#pageContral").hide();   //体温单 导航
				$("#RecordPAge").hide(); //护理的护理记录 导航
				$("#pageListhoose").hide();//体温单list
				$("#huiLpages").hide();//护理记录
			}else{
				$("#qhbr").hide().removeClass('animated').removeClass('bounceInRight');
				$("#qhbrFather").hide();
			}
			$("#yzParticulars").hide(); //医嘱执行情况关闭
			
		});
		// 点击右下角切换病人按钮时 -----------------------------------------------------------------------------------//

	//点击科室列表选择
		hammerqhbrLeft = $("#qhbrLeft .mainNavMinTwoUl li").hammer();
		hammerqhbrLeft.on('tap', function (ev) {
			debugger;
			if($(this).hasClass('XuanZhong')){
			}else{
				$("#qhbrLeft .mainNavMinTwoUl li").removeClass("XuanZhong");
				$(".btBox-ks").removeClass("ksActive");
				//常用筛选部分
				if($(this).parent().prev().html()=="常用筛选"){
					choosePat=$(this);
					$(choosePat).addClass("XuanZhong");
					$(InHospital).addClass("XuanZhong");
					$(chooseKS).addClass("ksActive");
					$(chooseKSBQ).addClass("XuanZhong");
					$(chooseKSXZ).addClass("XuanZhong");
					if($(this).html()=="所有病人"){
						isWD=0;    //所有病人为0
					}else{
						isWD=1;     //我的病人为1
					}
					getPatInfo(KSID,BQID,YS,YLZ,isZY,isWD,isHZ);

					//常用筛选部分 -----------------------------------------------------------------------------------------------//
	            //是否在院部分
				}else if($(this).parent().prev().html()=="是否在院"){
					InHospital=$(this);
					$(choosePat).addClass("XuanZhong");
					$(InHospital).addClass("XuanZhong");
					$(chooseKS).addClass("ksActive");
					$(chooseKSBQ).addClass("XuanZhong");
					$(chooseKSXZ).addClass("XuanZhong");
					if($(this).html()=="在院病人"){
						isZY=1;
						isHZ=0
					}else if($(this).html()=="出院病人"){
						isZY=0;
						isHZ=0
					}else {
						isZY="";
						isHZ=1;
					}
					getPatInfo(KSID,BQID,YS,YLZ,isZY,isWD,isHZ);

					//是否在院部分------------------------------------------------------------------------------------------------//
	            //病区部分
				}else if($(this).parent().prev().children().html()=="病区"){
					if($(this)[0]==chooseKSBQ[0]) {
						chooseKSBQ='';
						BQID='';
						getPatInfo(KSID,BQID,YS,YLZ,isZY,isWD,isHZ);
					}else {
						chooseKSBQ = $(this);
						BQID = $(this).attr("id").split("-")[1];
						getPatInfo(KSID, BQID, YS, YLZ, isZY, isWD, isHZ);
					}				
					$(choosePat).addClass("XuanZhong");
					$(InHospital).addClass("XuanZhong");
					$(chooseKS).addClass("ksActive");
					$(chooseKSBQ).addClass("XuanZhong");
					$(chooseKSXZ).addClass("XuanZhong");
					//病区部分	-------------------------------------------------------------------------------------------------//
				// 小组部分
				}else if($(this).parent().prev().children().html()=="医疗组"){
					if($(this)[0]==chooseKSXZ[0]){
						chooseKSXZ='';
						YLZ='';
						getPatInfo(KSID,BQID,YS,YLZ,isZY,isWD,isHZ);
					}else {
					    chooseKSXZ=$(this);
						YLZ=$(this).attr("id").split("-")[1];
						getPatInfo(KSID,BQID,YS,YLZ,isZY,isWD,isHZ);
					}
					$(choosePat).addClass("XuanZhong");
					$(InHospital).addClass("XuanZhong");
					$(chooseKS).addClass("ksActive");
					$(chooseKSBQ).addClass("XuanZhong");
					$(chooseKSXZ).addClass("XuanZhong");
				}
			}
			// 小组部分----------------------------------------------------------------------------------------------------//
		});
	//点击科室列表选择 ---------------------------------------------------------------------------//

		//科室不能同时展开，只能展开一个
		hammerbtBoxKS = $(".btBox-ks").hammer();
		hammerbtBoxKS.on("tap", function () {
			chooseKS=$(this);
			var ksContentAll = chooseKS.next();
			if ($(ksContentAll).css("display") == "none") {
				//debugger;
				//当前选中项为关闭时，则展开
				chooseKS.find(".btBox-arrows").html("-");
				$(ksContentAll).show();
				//选择当前项
				KSID=chooseKS.attr('id').split("-")[1];
				//将科室ID绑到用户上
				   $("#userInfobox font").attr("data-ksID",KSID);
					chooseKSBQ="";
					chooseKSXZ="";
					BQID="";
					YLZ="";                                               //医疗组为空
					
					getPatInfo(KSID,BQID,YS,YLZ,isZY,isWD,isHZ);
					//getLittlePatInfo(KSID,BQID,YS,YLZ,isZY,isWD,isHZ);

				//所有的都不选择
				$(".btBox-ks").removeClass("ksActive");
				$("#qhbrLeft .mainNavMinTwoUl li").removeClass("XuanZhong");
				$(choosePat).addClass("XuanZhong");
				$(InHospital).addClass("XuanZhong");
				$(chooseKS).addClass("ksActive");
				$(chooseKSBQ).addClass("XuanZhong");
				$(chooseKSXZ).addClass("XuanZhong");
				
			}else{
				if(ksContentAll.hasClass('ksContent')){
					chooseKS.find(".btBox-arrows").html("+");
					ksContentAll.hide();	
				}
				KSID=chooseKS.attr('id').split("-")[1];
				//所有的都不选择
				$(".btBox-ks").removeClass("ksActive");
				$("#qhbrLeft .mainNavMinTwoUl li").removeClass("XuanZhong");
				$(choosePat).addClass("XuanZhong");
				$(InHospital).addClass("XuanZhong");
				$(chooseKS).addClass("ksActive");
				$(chooseKSBQ).addClass("XuanZhong");
				$(chooseKSXZ).addClass("XuanZhong");

				$("#userInfobox font").attr("data-ksid",KSID);
				chooseKSBQ="";
				chooseKSXZ="";
				BQID="";
				YLZ="";                                               //医疗组为空
				
				getPatInfo(KSID,BQID,YS,YLZ,isZY,isWD,isHZ);
			}
		});
		
	}
	
	//点击左侧导航   病人切换------------------------------------------------------------------------------------------------//

	// 切换pageID病历
	function switchPageID(thisPage){
		if(thisPage.text()!==$("#dengJi").text()){
    		$("#dengjiUlStyle li").removeClass('changClass');
    		thisPage.addClass('changClass');
    		$("#dengJi").text(thisPage.text());
			// 更新pageID
			$("#slzyID").attr("data-pageid",thisPage.text());
			// 消失\			
			$("#voiceAndphoto").addClass('animated fadeOut');
    		$("#dengjiUlStyle").addClass('animated fadeOut');
			setTimeout(function(){ 
    			$("#dengjiUlStyle").css("display","none");
	    		$("#voiceAndphoto").css("display","none");
    		},1000);
			nowF5(thisPage.text());
		}
	}

	//刷新当前页
	function nowF5(thisPage){
		var gongNeng="";
		if($("#mainNavMin ul").find(".active").length==1){
			gongNeng = $("#mainNavMin ul").find(".active").find("p").text();
			var pevImgSrc = $("#mainNavMin ul .active img").attr("src").replace("W","B");
			$("#mainNavMin ul .active img").attr("src",pevImgSrc);
		}else{
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
        $("#linChuang").hide();    //临床路径
		switch(gongNeng){
			case "主页":
				// 选中主页
				$("#mainNavMin ul li:first").addClass("active");
				$("#mainNavMin ul li:first img").attr("src","img/homeB.png");
				patientHomePage.index();
				break;
			case "一览":
				// 选中诊疗
				$("#mainNavMin ul li").eq(1).addClass("active");
				consulting.consulting();
				break;
			case "路径":
				// 选中临床
				if(!($("#mainNavMin ul li").eq(2).hasClass('jinyong'))){
					$("#mainNavMin ul li").eq(2).addClass("active");
					clinic.clinic();
				}
				break;
			case "医嘱":
				// 选中医嘱
				$("#mainNavMin ul li").eq(3).addClass("active");
				// 第一次选中长嘱 当前   以后不更改
				if(!$("#qxSelect li").hasClass('XuanZhong')){
					$("#qxSelect li:last").addClass("XuanZhong");
					$("#flSelect li:first").addClass("XuanZhong");
				}
				doctorAdvice.docActListLoad("yes",0);  // 加载医嘱列表数据   yes:要清空已追加的tr  0:从第一页开始加载
				utils.yiZhuEditFunction();
				break;
			case "病历":
				// 默认选中病历
				$("#mainNavMin ul li").eq(4).addClass("active");
				medicalRecords.medicalRecords();
				// utils.yiZhuEditFunction();   //在病历中会出现编辑 所以注释
				break;
			case "检验":
				// 默认选中检验
				$("#mainNavMin ul li").eq(5).addClass("active");
				inspection.inspection();
				break;
			case "检查":
				// 默认选中检验
				$("#mainNavMin ul li").eq(6).addClass("active");
				examine.examine();
				break;
			case "护理":
				// 默认选中护理
				$("#mainNavMin ul li").eq(7).addClass("active");
				$("#nurseRecords").empty("li"); //清空护理记录单
				nurseRecords.nurseHis();
				break;
		}
	}

	//获取病历卡函数定义
	function getPatInfo(KSID,BQID,YS,YLZ,isZY,isWD,isHZ){
		$("#LoadedTip").show();
        $.ajax({
            //初始化病人卡
            url: serviceChoose + '/DC_Patient_List',
            async: true,
            type: "post",
            timeout: utils.timeoutSec(),
            data: JSON.stringify({
                "IN":
                    {
                        "KS": KSID,         //从login时获取默认病区
                        "BQ": BQID,             //初始化为科室第一个病区
                        "YS": YS,
                        "YLZ": YLZ,            //医疗组ID
                        "ZT": isZY,            //在院：1，出院：0
                        "WD": isWD,            //我的病人：1，所有病人：0
                        "HZ": isHZ             //会诊病人：1，ZT和WD不传
                    }
            }),
            dataType: "json",
            headers: {
                'Content-Type': 'application/json',
            },
			//成功
			success: function (responseTxt) {
				//debugger;
				$("#qhbrRight").empty(".bingLiKaBox");
				if(responseTxt.Result.OUTPUT.PATILIST!=null) {
					var b = $(window).width();
					for (var i = 0; i < responseTxt.Result.OUTPUT.PATILIST.PATIENT.length; i++) {
						//  追加病历卡和病历卡ID
						if(responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].LJZT){
							var LJZT=responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].LJZT
						}else {
							LJZT=""
						}
						
						if(responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BK=="一般"){
							$("#qhbrRight").append('<div class="bingLiKaBox" data-KSID="' + KSID + '" data-LJZT="'+ LJZT +'" data-LCLJZT="'+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].LCLJZT +'" data-patiID="'+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].PATIID+'" data-pageID="'+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].PAGEID+'" id="blk-' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + '"><table class="btGirl"><tr><td width="30%"><div class="bingLiKaDengJi"><div>' + (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].CH==null?"":responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].CH) + '</div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + '</span></div></td><td><p><font class="theLong">' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].XM + '  ' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].NL + '</font><img src="./img/woman.png" class=" color-woman"/></p><span class="fs1 float-right" aria-hidden="true" data-icon=""></span><span class="label label-success float-right margin-right-5">' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BK + '</span><span class="badge input-bottom-margin float-right margin-right-5"></span><span class="label input-bottom-margin float-right margin-right-5 bxSpan">' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].FKLX + '</span></td></tr></table><div class="nr"><div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZD + '</span></div><div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].RYSJ +'</span><span class="zycsSpan">'+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].PAGEID+'</span><span class="float-right">'+ responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYTS + '天</span></div><div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].SS + '</span></div><div></div></div></div>');
						}else{
							$("#qhbrRight").append('<div class="bingLiKaBox" data-KSID="' + KSID + '" data-LJZT="'+ LJZT +'" data-LCLJZT="'+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].LCLJZT +'" data-patiID="'+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].PATIID+'" data-pageID="'+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].PAGEID+'" id="blk-' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + '"><table class="btGirl"><tr><td width="30%"><div class="bingLiKaDengJi"><div>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].CH + '</div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + '</span></div></td><td><p><font class="theLong">' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].XM + '  ' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].NL + '</font><img src="./img/woman.png" class="color-woman"/></p><span class="fs1 float-right" aria-hidden="true" data-icon=""></span><span class="label label-important float-right margin-right-5">' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BK + '</span><span class="badge input-bottom-margin float-right margin-right-5"></span><span class="label input-bottom-margin float-right margin-right-5 bxSpan">' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].FKLX + '</span></td></tr></table><div class="nr"><div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZD + '</span></div><div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].RYSJ + '</span><span class="zycsSpan">'+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].PAGEID+'</span><span class="float-right">'+ responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYTS +'天</span></div><div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].SS + '</span></div><div></div></div></div>');
						}
						if(i<3){
							$("#qhbrRight .bingLiKaBox").eq(i).css("margin-top",0);
						}
						//$("#qhbrRight").append('<div class="bingLiKaBox" data-patiID="'+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].PATIID+'" data-pageID="'+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].PAGEID+'" id="blk-' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + '"><table class="btGirl"><tr><td width="30%"><div class="bingLiKaDengJi"><div>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].CH + '</div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + '</span></div></td><td><div class="bingLiKaName"><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].XM + '</span>   <span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].NL + '</span><span class="fs1 color-girl" aria-hidden="true" data-icon=""></span></div><span class="fs1 float-right" aria-hidden="true" data-icon=""></span><span id="patiZhuangTai" class="label label-important float-right margin-right-5">' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BK + '</span><span id="patiDengJi" class="badge input-bottom-margin float-right margin-right-5">' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].HLDJ + '</span><span class="label input-bottom-margin float-right margin-right-5">' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].FKLX + '</span></td></tr></table><div class="nr"><div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZD + '</span></div><div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].RYSJ + '</span></div><div><span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].SS + '</span></div><div></div></div></div>');

						//判断 过敏史------------------------------------------------------------------------------------------------------------//
						var gmStr="";
						// 如果过敏列表为空
						if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].GMLIST == null) {
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> .nr div:last").text("无过敏信息");

						}
						// 如果没有数组 只有一个对象
						/*else if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].GMLIST.ITEM.length == undefined) {
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> .nr div:last").append('<span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].GMLIST.ITEM.MC + '/</span>');
						}*/

						// 否则循环数组
						else {
							for (var ii = 0; ii < responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].GMLIST.ITEM.length; ii++) {
								gmStr=gmStr+responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].GMLIST.ITEM[ii].MC+"/";
								//$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> .nr div:last").append('<span>' + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].GMLIST.ITEM[ii].MC + '/</span>');
							}
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> .nr div:last").append(gmStr.substring(0,gmStr.length-1));
						}

						///判断 过敏史-----------------------------------------------------------------------------------------------------------//


						//判断 性别------------------------------------------------------------------------------------------------------------//

						// 如果性别为男
						if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].XB == "男") {
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> table").removeClass("btGirl").addClass("btBoy");
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> table > tbody tr td p img").removeClass("color-woman").addClass("color-man").attr('src', './img/man.png');
						}

						///判断 性别------------------------------------------------------------------------------------------------------------//
						
						//判断 护理等级------------------------------------------------------------------------------------------------------------//
						if(responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].HLDJ!==null){
							// 如果为一级
							if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].DJBZ == 1) {
								$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> table > tbody tr td .badge").addClass("badge1").text("一");
							}

							// 如果为二级
							if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].DJBZ == 2) {
								$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> table > tbody tr td .badge").addClass("badge2").text("二");
							}

							// 如果为三级
							if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].DJBZ == 3) {
								$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> table > tbody tr td .badge").addClass("badge3").text("三");
							}

							// 如果为特级
							if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].DJBZ == 0) {
								$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> table > tbody tr td .badge").addClass("badgete").text("特");
							}
						}
						///判断 护理等级------------------------------------------------------------------------------------------------------------//


						//判断 膳食信息------------------------------------------------------------------------------------------------------------//

						// 如果没有膳食信息
						if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].SS == null) {
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> .nr div:last").prev().text("无膳食建议");
						}

						///判断 膳食信息------------------------------------------------------------------------------------------------------------//

						//判断 诊断信息
						//如果没有诊断信息
						if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZD == null) {
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> .nr div:first span").text("无诊断信息");
						}
						//判断 诊断信息-------------------------------------------------------------------------------------------------------------//


						//判断 临床路径-------------------------------------------------------------------------------------------------------------//

						// 如果为空
						if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].LCLJZT == undefined||responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].LCLJZT==0) {
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> table > tbody tr td > span:first").hide();
						}
						// 执行中
						else if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].LCLJZT == 1) {
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> table > tbody tr td > span:first").attr("aria-hidden", "true").attr("data-icon", "").addClass("lclj1");
						}
						// 正常结束
						else if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].LCLJZT == 2) {
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> table > tbody tr td > span:first").attr("aria-hidden", "true").attr("data-icon", "").addClass("lclj2");
						}
						// 变异结束
						else if (responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].LCLJZT == 3) {
							$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> table > tbody tr td > span:first").attr("aria-hidden", "true").attr("data-icon", "").addClass("lclj3");
						}

						///判断 临床路径-------------------------------------------------------------------------------------------------------------//

						// 给病历卡控制宽度
						$(".bingLiKaBox").css("width", (b - 200) / 3);

						// 给 诊断信息 和 过敏史 控制文字溢出自动显示省略
						$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> .nr div:last").css("overflow", "hidden").css("text-overflow", "ellipsis").css("white-space", "nowrap");
						$("#" + "blk-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].ZYH + "-" + responseTxt.Result.OUTPUT.PATILIST.PATIENT[i].BABY + "> .nr div:first").css("overflow", "hidden").css("text-overflow", "ellipsis").css("white-space", "nowrap");

					}

					// 注册病历卡点击事件
					var blkdjhammer=$("#qhbrRight .bingLiKaBox").hammer();
					blkdjhammer.on('tap', function() {
						$("#mainNavMin ul li").removeClass('jinyong');
						for (var i = 0; i < $("#mainNavMin ul li img").length; i++) {
							var ImgSrc = $("#mainNavMin ul li img").eq(i).attr("src").replace("G","W");
					    	$("#mainNavMin ul li img").eq(i).attr("src",ImgSrc);
						}
						if($(this).find('td>span').eq(0).css("display")=="none"){
							$("#mainNavMin ul li").eq(2).addClass('jinyong');
							var ImgSrcNone = $("#mainNavMin ul li img").eq(2).attr("src").replace("W","G");
					    	$("#mainNavMin ul li img").eq(2).attr("src",ImgSrcNone);
						}
						// 更新缩略病历卡
						brxxShort($(this)); 
						//没有临床路径显示主页
						if($("#mainNavMin ul li").eq(2).hasClass('active')&&$("#mainNavMin ul li").eq(2).hasClass('jinyong')){
							$("#mainNavMin ul li").eq(2).removeClass('active');
							$("#mainNavMin ul li").eq(0).addClass('active');
							var ImgSrcHome = $("#mainNavMin ul li img").eq(0).attr("src").replace("G","W");
					    	$("#mainNavMin ul li img").eq(0).attr("src",ImgSrcHome);
						}
						// 离开是哪个页面 就刷新哪个页面 默认pageID最大的那个
						nowF5($("#dengjiUlStyle ul li:last").text());
						
					});
					//病历卡显示详细医嘱
					// var nrblkdjnrhammer=$("#qhbrRight .bingLiKaBox .nr").hammer();
					// nrblkdjnrhammer.on('press', function() {
					// 	illness($(this));
					// });
					// $("#qhbrRight .bingLiKaBox .nr").on("touchstart",function(){
					// 	var thisdiv=$(this);
					// 	setTimeout(function(){ 
					// 		illness(thisdiv);
					// 	}, 150);
						
					// });
					// $("#qhbrRight .bingLiKaBox .nr").on("touchend",function(){
					// 	$(this).parent().parent().find('.illness').remove();
					// });

				}/*else {
					//无病人时
					$("#qhbrRight").empty(".bingLiKaBox");
					utils.showHide("无病人");
				}*/
				//.addClass('animated').addClass('bounceInRight');
				// 隐藏登录层 和加载层
				$("#LoadedTip").hide();
				$("#loginBox").hide();
				$("#qhbrFather").show();
				$("#qhbr").show();
				
			},
			error: function () {
				utils.errorAjax(getPatInfo,[KSID,BQID,YS,YLZ,isZY,isWD,isHZ]);
			}
		});
	}
	//显示详细病情
	function illness(thisdiv){
		thisdiv.parent().parent().find('.illness').remove();
		var illtext=thisdiv.find("div").eq(0).text();
		var divindex=thisdiv.parent().index();
		if(parseInt(divindex)+1%3==0){
			thisdiv.append('<div class="illnessdiv-left illness"><div class="tuchu"></div><div class="cont">'+illtext+'</div></div>')
		}else{
			thisdiv.append('<div class="illnessdiv illness"><div class="tuchu"></div><div class="cont">'+illtext+'</div></div>')
		}
		var libottom=$(window).height()-thisdiv.offset().top;
			var divhei=thisdiv.find('.cont').height();
		if(parseInt(libottom)<parseInt(divhei)){
				thisdiv.find('.cont').css("margin-top",parseInt(libottom)-parseInt(divhei));
			}
	}
	$("#slZDXX").on("touchstart",function(){// click
		pateillness($(this));
	});
	$("#slZDXX").on("touchend",function(){
		$("#smallillness").hide();
	});
	// 病情小块显示全部病情
	function pateillness(thisdiv){
		$("#smallillness").remove();
		var illtext=thisdiv.text();
		$("#boxCenterOne").append('<div class="smallillness" id="smallillness"><div class="tuchu"></div><div class="cont">'+illtext+'</div></div>');
		var libottom=$(window).height()-$("#smallillness").offset().top;
			var divhei=$("#smallillness").find('.cont').height();
		if(parseInt(libottom)<parseInt(divhei)){
				$("#smallillness").find('.cont').css("margin-top",parseInt(libottom)-parseInt(divhei));
			}
	}

	//获取病历卡函数定义--------------------------------------------------------------------------------------------------//
	// 点击病历卡时  显示详细信息左边小块
	function brxxShort(thisBR){

		zyID = thisBR.attr("data-patiID");
		zyKSID=thisBR.attr("data-KSID");
		pageid=thisBR.attr("data-pageID");
		ljzt=thisBR.attr("data-LJZT");
		lcljzt=thisBR.attr("data-LCLJZT");
		zyBaby = thisBR.attr("id").split("-")[2];//是否为baby
		if (zyBaby == "0") {
			var baby = "no";
		} else {
			baby = "yes";
		}
		//数据绑定
		$("#slzyID").attr({"data-patiID": zyID, "data-baby": baby,"data-KSID":zyKSID,"data-pageID":pageid});
		$("#slLCLJ").attr({"data-LCLJZT":lcljzt,"data-LJZT":ljzt});
		$("#qhbrFather").hide();
		var ch,zyh,fldj,xmnl,zyts,zdxx,bk,zycs,fldj;
		var nlarry=[],ljarry=[];
		//床号
		ch=thisBR.find('.bingLiKaDengJi div').text();
		//护理等级
		fldj=thisBR.find('tr .badge').text();
		//住院号
		zyh=thisBR.find('.bingLiKaDengJi span').text();
		//姓名年龄
		xmnl=thisBR.find('tr td').eq(1).find('p').text();
		nlarry=xmnl.split("  ");

		//住院天数
 		zyts=thisBR.find('.nr div .float-right').text();
 		//诊断信息
 		zdxx=thisBR.find('.nr div').eq(0).find("span").text();
 		//病况
 		bk=thisBR.find('table .label').eq(0).text();
 		//住院次数
 		zycs=thisBR.find('.nr .zycsSpan').text();
 		//护理等级
 		fldj=thisBR.find('td .badge').text();
 		 
 		//性别
 		if(thisBR.find("tbody p img").hasClass("color-woman")){
 			$("#slXB").removeClass('color-man').addClass("color-woman").find('img').attr('src', './img/woman.png');
 		}else{
 			$("#slXB").removeClass('color-woman').addClass("color-man").find('img').attr('src', './img/man.png');
 		}
 		$("#slCH").text(ch);
 		$("#slNAME").text(nlarry[0]);


		//年龄处理
		if (thisBR.attr("id").split("-")[2] == 0) {
			//只显示数字
			$("#baby-yes").css("display", "none");
			$("#slAGE").show();
			newnl=nlarry[1].replace('岁'," ");
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
 		var lclj=thisBR.find('td>span').eq(0).attr('class');
 		ljarry=lclj.split(" ");
 		$("#slLCLJ").removeClass("lclj1 lclj2 lclj3");
 		if(ljarry.length==3){
 			$("#slLCLJ").attr( "data-icon",thisBR.find('td>span').eq(0).attr("data-icon")).addClass(ljarry[2]);
 			$("#slLCLJ").css("display","block"); 			
 		}else if(ljarry.length==2){
 			$("#slLCLJ").hide();
 		};
     	//护理等级
     	if(fldj=="一"){
     		$("#slHLDJ").show();
     		$("#slHLDJ").removeClass("badge2 badge3 badgete");
     		$("#slHLDJ").text(fldj).addClass('badge1');
     	}else if(fldj=="二"){
 			$("#slHLDJ").show();
 			$("#slHLDJ").removeClass("badge1 badge3 badgete");
     		$("#slHLDJ").text(fldj).addClass('badge2');
     	}else if(fldj=="三"){
     		$("#slHLDJ").show();
     		$("#slHLDJ").removeClass("badge1 badge2 badgete");
     		$("#slHLDJ").text(fldj).addClass('badge3');
     	}else if(fldj=="特"){
 			$("#slHLDJ").show();
 			$("#slHLDJ").removeClass("badge1 badge2 badge3");
     		$("#slHLDJ").text(fldj).addClass('badgete');
     	}else if(fldj==""){
     		$("#slHLDJ").hide();
     	}
     	// 缩略病历卡 pageID 列表
		$("#dengjiUlStyle ul").empty("li");
		for(var pagei=1; pagei<=zycs; pagei++){
			$("#dengjiUlStyle ul").append('<li>'+pagei+'</li>');
			if(pagei==zycs){
				debugger;
				$("#dengjiUlStyle ul li").css("border-bottom-style","none")
			}
		}
     	// 注册点击事件
		var pageIDhammer = $("#dengjiUlStyle ul li").hammer();
		pageIDhammer.on("tap",function(event){
			event.stopPropagation();    //  阻止事件冒泡
			event.preventDefault();     //  阻止默认行为 ( 表单提交 )
			switchPageID($(this));
		});
		// //录音图标追加
		// $("#voiceAndphoto ul").empty("li");
		// $("#voiceAndphoto ul").append('<li class="voice"><span class="fs1" aria-hidden="true" data-icon=""></span></li><li class="voice" style="border-top:1px solid rgba(204, 204, 204, 0.61);"><span class="fs1" aria-hidden="true" data-icon=""></span></li>');

		//拍照录音按钮
		$("#voiceAndphoto ul li").unbind();
		var voiceAndphotohammer=$("#voiceAndphoto ul li").hammer();
		voiceAndphotohammer.on('tap', function(event) {
			event.stopPropagation();    //  阻止事件冒泡
			event.preventDefault();     //  阻止默认行为 ( 表单提交 )
			photoOrVoice($(this));		
		});		
	}
	//选中录音或者照相
	function photoOrVoice(thisli){
		//点击出现的选中 后消失
		$("#voiceAndphoto li").removeClass('xuanZhong');
		thisli.addClass('xuanZhong');
		$("#voiceAndphoto").addClass('animated fadeOut');
		$("#dengjiUlStyle").addClass('animated fadeOut');		
		setTimeout(function(){ 
			$("#dengjiUlStyle").css("display","none");
    		$("#voiceAndphoto").css("display","none");
		}, 1000);		
		//点击的是录音
		if(thisli.index()==0){
			video();   //录音
		}else{
			photo();   //拍照
		}
	}

	// //注册临床路径pageID 是事件
	// $("#dengjiUlStyle-lj").on("touchstart","li",function(event){
	// 	lcpageid($(this));
	// })
	// //临床路径的pageID切换
	// function lcpageid(thisli){
	// 	if(thisli.text()!=$("#lj-dengji").text()){
	// 		$("#dengjiUlStyle-lj ul li").removeClass('changClass');
	// 		thisli.addClass('changClass');
	//     	$("#dengJi").text(thisli.text()); //信息小卡 的pageid
	// 		$("#lj-dengji").text(thisli.text());  //临床路径 的pageid
	// 		$("#slzyID").attr("data-pageid",thisli.text()); //b绑定的pageid
	// 		$("#lcljCard > .voiceAndphoto-ll").removeClass('animated fadeIn').addClass('animated fadeOut');
	// 		$("#dengjiUlStyle-lj").removeClass('animated fadeIn').addClass('animated fadeOut');
	// 		setTimeout(function(){ 
	// 			$("#lcljCard > .voiceAndphoto-ll").css("display","none");
	//     		$("#dengjiUlStyle-lj").css("display","none");
	// 		}, 1000);
			
	// 	}
	// 	clinic.clinic();
	// };

    return{
		chooseBQ:chooseBQ,
		getPatInfo:getPatInfo
	}
});