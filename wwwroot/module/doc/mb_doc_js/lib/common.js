define(["jquery", "hammer","jqueryhammer"], function(jquery, hammer, jqueryhammer) {

	

	//导航二级菜单 报告
	hammerMinTwo4 = $("#mainNavMinTwo4 > ul > li").hammer();
	hammerMinTwo4.on('tap',function(ev){
		$("#mainNavMinTwo4 > ul > li").css("background","#50a3a2");
		$(this).css("background","#000");
	});

	//导航二级菜单 护理
	hammerMinTwo5 = $("#mainNavMinTwo5 > ul > li").hammer();
	hammerMinTwo5.on('tap',function(ev){
		$("#mainNavMinTwo5 > ul > li").css("background","#50a3a2");
		$(this).css("background","#000");
	});
	/*医嘱编辑
	hammerYZEditt = $("#CQATable tr").hammer();
	hammerYZEditt.on('press',function(ev){
		$("#yzButtonDell").addClass('animated').addClass('flash').show();
		$("#yzButtonEdit").addClass('animated').addClass('flash').show();
		$("#yzButtonZFei").addClass('animated').addClass('flash').show();
		$("#yzButtonTZhi").addClass('animated').addClass('flash').show();
	});*/
	

	/*医嘱编辑按钮隐藏
	hammerdocument = $(document).hammer();
	hammerdocument.on('tap',function(ev){
		var target = $(ev.target);
		if(target.closest("#CQATable").length > 0) return false;   //阻止事件冒泡
        $("#yzButtonDell").removeClass('animated').removeClass('flash').hide();
		$("#yzButtonEdit").removeClass('animated').removeClass('flash').hide();
		$("#yzButtonZFei").removeClass('animated').removeClass('flash').hide();
		$("#yzButtonTZhi").removeClass('animated').removeClass('flash').hide();
    });*/

	/* 医嘱停用 时间控件显示
	hammeryyzButtonTZhi = $("#yzButtonTZhi").hammer();
	hammeryyzButtonTZhi.on('tap',function(ev){
		$(".Sense").remove(); 
		$("#yzButtonTimeBox").show();
		$("#yzButtonTime").empty(); //删除时间控件容器里的所有DIV，以备重新追加
		$('#yzButtonTimeText').scroller({
			display: "inline",
			lang: "zh",
			mode: "Scroller",
			preset: "datetime",
			stepMinute: 5,
			theme: "Sense UI"
		});
		$("#yzButtonTime").append($(".Sense")).show();
	});*/
	
	/* 医嘱停用 时间控件隐藏
	hammeryyzButtonRight = $("#yzButtonTimeBox").find(".buttonRight").hammer();
	hammeryyzButtonRight.on('tap',function(ev){
		$("#yzButtonTimeBox").hide();
	});
	
	hammeryyzButtonLeft = $("#yzButtonTimeBox").find(".buttonLeft").hammer();
	hammeryyzButtonLeft.on('tap',function(ev){
		$("#yzButtonTimeBox").hide();
	});*/
	

	

	//病人信息显示隐藏
	//hammermainNavUserBox = $("#mainNavUserBox").hammer();
	//hammermainNavUserBox.on('tap',function(ev){
	//	if($("#mainNavUserInfo").is(":hidden")){
	//		$("#mainNavUserInfo").addClass('animated').addClass('fadeIn').show();
	//	}else{
	//		$("#mainNavUserInfo").removeClass('animated').removeClass('fadeIn').hide();
	//	}
	//});
	//hammermainNavUserInfo = $("#mainNavUserInfo").hammer();
	//hammermainNavUserInfo.on('tap',function(ev){
	//	if(!$("#mainNavUserInfo").is(":hidden")){
	//		$("#mainNavUserInfo").removeClass('animated').removeClass('fadeIn').hide();
	//	}
	//});
	
	

	
	

	


	

	// 成套项目编辑
	hammeryzxdCT = $("#yzxdTwoJiChengTao ul li span").hammer();
	hammeryzxdCT.on('tap',function(ev){
		$("#yzxdTwoJiChengTao ul li").css("background","#fff");
		$(this).parent().css("background","#e1fbfb");
		$("#yzxdTwoJiChengTao").hide();
		$("#yzxdTwoJi").show();
		$("#yzxdBiaoTi font").text("编辑临时药品医嘱");

	});

	// 左边导航 宽
	$("#mainnav ul li").on("click","a",function(){
		var zhi = $.trim($(this).text());
		switch(zhi){
			case "病案主页":
				$(this).parent().addClass("active");
				$(this).parent().siblings("li").removeClass("active");
				$("#huaDong > .display-none").hide();
				$("#huaDongJiBen").show();
				navLeft();
				break;
			case "医嘱查阅":
				$(this).parent().addClass("active");
				$(this).parent().siblings("li").removeClass("active");
				$("#huaDong > .display-none").hide();
				$("#huaDongYiZhu").show();
				navLeft();
				break;
			case "病历查看":
				$(this).parent().addClass("active");
				$(this).parent().siblings("li").removeClass("active");
				$("#huaDong > .display-none").hide();
				$("#huaDongBingLi").show();
				navLeft();
				break;
			case "辅检报告":box3ListNo
				$(this).parent().addClass("active");
				$(this).parent().siblings("li").removeClass("active");
				$("#box3ListYes").show();
				$("#box3Top").show();
				$("#box3ListYes").addClass('animated').removeClass("bounceOutRight").addClass('bounceInLeft');
				$("#box3Top").addClass('animated').removeClass("fadeOut").addClass('fadeIn');
				var a = $(document.body).height();
				$("#box3ListYes").height(a);
				$("#box3Left").height(a);
				$("#box3Right").height(a);
				if(!$("#box3ListNo").is(":hidden")){
					$("#box3ListNo").addClass('animated').removeClass("bounceInLeft").addClass('bounceOutRight');
					$("#box3ListNo").hide();
				}
				break;
			case "护理记录":
				$(this).parent().addClass("active");
				$(this).parent().siblings("li").removeClass("active");
				$("#box3ListNo").show();
				$("#box3ListNo").addClass('animated').removeClass("bounceOutRight").addClass('bounceInLeft');
				var a = $(document.body).height();
				$("#box3ListNo").height(a);
				if(!$("#box3ListYes").is(":hidden")){
					$("#box3ListYes").addClass('animated').removeClass("bounceInLeft").addClass('bounceOutRight');
					$("#box3ListYes").hide();
				}
				if(!$("#box3Top").is(":hidden")){
					$("#box3Top").addClass('animated').removeClass("fadeIn").addClass('fadeOut');
					$("#box3Top").hide();
				}
				break;
			default:
				$("#huaDong > .display-none").hide();
		}
	});

	function navLeft(){
		if(!$("#box3ListYes").is(":hidden")){
			$("#box3ListYes").addClass('animated').removeClass("bounceInLeft").addClass('bounceOutRight');
			$("#box3ListYes").hide();
		}
		if(!$("#box3ListNo").is(":hidden")){
			$("#box3ListNo").addClass('animated').removeClass("bounceInLeft").addClass('bounceOutRight');
			$("#box3ListNo").hide();
		}
		if(!$("#box3Top").is(":hidden")){
			$("#box3Top").addClass('animated').removeClass("fadeIn").addClass('fadeOut');
			$("#box3Top").hide();
		}
	}
				
	//窄屏导航
	$("#navZhaiPin li").on("click","a",function(){
		var zhi = $.trim($(this).text());
		switch(zhi){
			case "病案主页":
				$(this).parent().addClass("active");
				$(this).parent().siblings("li").removeClass("active");
				$("#huaDong > .display-none").hide();
				$("#huaDongJiBen").show();
				$('#huaDongJiBen').addClass('animated').addClass('fadeIn');
				break;
			case "医嘱查阅":
				$(this).parent().addClass("active");
				$(this).parent().siblings("li").removeClass("active");
				$("#huaDong > .display-none").hide();
				$("#huaDongYiZhu").show();
				$('#huaDongYiZhu').addClass('animated').addClass('fadeIn');
				break;
			default:
				$("#huaDong > .display-none").hide();
		}
	});

	//病历PDF展示
	var hammerPdfShow = $('#boxZhuYuanBingLi > div').hammer();
	hammerPdfShow.on('tap', function(ev) {
		$("#pdfDivBackground").show();
		$("#boxIframe").show().addClass('animated').addClass('zoomInUp').removeClass('zoomOutDown');
		

	});

	// iframe PDF自适应高度
	function iFrameHeight() {

        var ifm= document.getElementById("boxIframe");
        var subWeb = document.frames ? document.frames["boxIframe"].document : ifm.contentDocument;
            if(ifm != null && subWeb != null) {
				ifm.height = subWeb.body.scrollHeight;
            }
    }

	// 第三方有菜单 自适应高度
	//function loginHeight() {

    //    var ifm= document.getElementById("loginFrame");
    //    var subWeb = document.frames ? document.frames["loginFrame"].document : ifm.contentDocument;
    //        if(ifm != null && subWeb != null) {
	//			ifm.height = subWeb.body.scrollHeight;
    //       }
    //}

	//病历PDF关闭
	var hammerPdfClose = $('#pdfDivBackground').hammer();
	hammerPdfClose.on('tap', function(ev) {
		$("#boxIframe").hide().addClass('animated').addClass('zoomOutDown').removeClass('zoomInUp');
		$("#pdfDivBackground").hide();
	});

				

	//医嘱删除、修改、销毁弹出选项
	//$("#CQATable tbody").on("click", "tr", function(){
	//	$(this).css("background-color", "#ff000");
	//	var offset = $(this).offset();
	//	$("#boxHuoDong").removeClass("animated").removeClass('fadeInLeft');
	//	$("#boxHuoDong").css({
	//		top: offset.top,
	//		left: offset.left
	//	}).show();
	//	$('#boxHuoDong').addClass('animated').addClass('fadeInLeft');
	//});

	//点击表格外的地方关闭：医嘱删除、修改、销毁弹出选项
	//$(document.body).on("click", function(e){
	//	var target = e.target;
	//	if($(target).closest("tbody").length > 0) return;
	//	$("#boxHuoDong").hide();
	//});

	//医嘱下达 一级转二级
	$("#yiZhu2Ji").hide();
	$("#yiZhuChengTao2Ji").hide();
	$("#xiangMuMingXi").on("click","li",function(){
		$("#yiZhu1Ji").hide();
		$("#yiZhu2Ji").show();
		$("#yiZhu2Ji").addClass("animated").addClass("flipInX");
		var myDate = new Date();
		$("#boxTime")[0].placeholder = myDate.toLocaleString();
	});

	// 医嘱下达 二级内容输入
	$("#boxkaiYao > .text-nr").on("click", function(){
		//var nr = $(this).find("b").text();
		var nr = $("> span", this).text();
		switch(nr){

			case "紧急":
				if($(".fs1", this).css("color") == "rgb(21, 41, 92)"){
					$(".fs1", this).css("color", "rgb(255, 0, 0)");
				}else{
					$(".fs1", this).css("color", "rgb(21, 41, 92)");
				}
				break;

			case "开始时间":
				$("#yiZhu2JiSpan").removeClass("span12").addClass("span7");
				$("#yiZhu3JiSpan > div").hide();
				$("#yiZhu3JiSpan").show();
				
				// 时间控件初始化
				$('#boxTime').scroller({
					display: "inline",
					lang: "zh",
					mode: "Scroller",
					preset: "datetime",
					stepMinute: 5,
					theme: "Sense UI"
				});
				if($("#boxStartDate").find(".Sense").length <= 0){
					$("#boxStartDate").append($(".Sense")).show();  //将控件追加到页面右边
					$(".Sense").attr("id", "timeKongJian");
					console.log($(".Sense").id);
				}else{
					
					//$("#timeKongJian").show();
					//$(".text-info .Sense").hide();
				}
				$(".dwcc table:first tr:first td:last").hide(); //将控件的年隐藏掉
				break;
						
			case "给药途径":
				$("#yiZhu2JiSpan").removeClass("span12").addClass("span7");
				$("#yiZhu3JiSpan > div").hide();
				$("#yiZhu3JiSpan").show();
				$("#boxGeiYaoTuJing").show();
				$("#buttonGeiYaoTuJing").css("color","rgb(255, 0, 0)");
				break;
						
			case "执行频率":
				$("#yiZhu2JiSpan").removeClass("span12").addClass("span7");
				$("#yiZhu3JiSpan > div").hide();
				$("#yiZhu3JiSpan").show();
				$("#boxZhiXingPinLv").show();
				$("#buttonZhiXingPinLv").css("color","rgb(255, 0, 0)");
				break;
						
			case "单量":
				$("#yiZhu2JiSpan").removeClass("span12").addClass("span7");
				$("#yiZhu3JiSpan > div").hide();
				$("#yiZhu3JiSpan").show();
				$("#boxCount").show();
				break;
						
			case "执行性质":
				$("#yiZhu2JiSpan").removeClass("span12").addClass("span7");
				$("#yiZhu3JiSpan > div").hide();
				$("#yiZhu3JiSpan").show();
				$("#boxZhiXingXingZhi").show();
				$("#buttonZhiXingXingZhi").css("color","rgb(255, 0, 0)");
				break;
			
			case "发药药房":
				$("#yiZhu2JiSpan").removeClass("span12").addClass("span7");
				$("#yiZhu3JiSpan > div").hide();
				$("#yiZhu3JiSpan").show();
				$("#boxFaYaoYaoFang").show();
				$("#buttonFaYaoYaoFang").css("color","rgb(255, 0, 0)");
				break;
						
			case "执行科室":
				$("#yiZhu2JiSpan").removeClass("span12").addClass("span7");
				$("#yiZhu3JiSpan > div").hide();
				$("#yiZhu3JiSpan").show();
				$("#boxZhiXingKeShi").show();
				$("#buttonZhiXingKeShi").css("color","rgb(255, 0, 0)");
				break;

			case "医生嘱托":
				$("#yiZhu2JiSpan").removeClass("span12").addClass("span7");
				$("#yiZhu3JiSpan > div").hide();
				$("#yiZhu3JiSpan").show();
				$("#boxYiShengZhuTuo").show();
				$("#buttonYiShengZhuTuo").css("color","rgb(255, 0, 0)");
				break;

			default:
				console.log("111");

		}
	});

	
	//单量计算器
	var hammertime = $('#countButton > div').hammer();
　　hammertime.on('tap', function(ev) {
		var zhi;
		var dl=15;

		// 当点击.时，数字+.
		if($(this).text()==="."){
			if($("#countResult").text().toString().indexOf(".") === -1){
				zhi = $("#countResult").text()+".";	
			}

		// 当点击 x1，单量+单量
		}else if($(this).text()==="x1"){
			zhi = parseInt( dl+dl );
		
		// 当点击 x2，单量*2
		}else if($(this).text()==="x2"){
			zhi = dl * 2;
		
		// 当点击 x3，单量*3
		}else if($(this).text()==="x3"){
			zhi = dl * 3;
		
		// 当点击x时，一位一位的减少直到为0
		}else if($(this).children("span").length > 0){
			//var abc;
			//abc = $("#countResult").html().toString();
			//zhi = abc.substring(0,abc.length -1);
			//if(zhi === null || zhi === 0 || $("#countResult").html()==="" ){
			//	zhi = 0;
			//}
			zhi=0;

		// 按其它数字
		}else{
			
			//当最后一位是.时
			zhi = $("#countResult").html().toString();
			var a = zhi.substr(zhi.length-1,1);
			if(a==="."){
				zhi = $("#countResult").text() + $(this).text();

			//当数字大于0时
			}else if( $("#countResult").html() > 0){
				zhi = $("#countResult").html() + $(this).text();

			//否则直接变成该数字
			}else{
				zhi = $(this).text();
			}
		}
		$("#countResult").html(zhi); // 更新至计算器顶部的结果

		//更新至单量一栏 若小于或者等于0则是红色
		if(zhi>0){
			$("#Milligram span").text(zhi+"ml").removeClass("text-red");
		}else{
			$("#Milligram span").text(0+"ml").addClass("text-red");
		}
	});



	// 滑动效果
	var hammerhd = $('#huaDong > div').hammer();
	hammerhd.on('swipeleft', function(ev) {
		if($(this)[0].id != "huaDongBingLi"){
			$(this).hide();
			$(this).next().addClass('animated').addClass('bounceInRight').removeClass('bounceInLeft').show();
		}
		NavigationSwitchleft(this.id);
    });

	hammerhd.on('swiperight', function(ev) {
		if($(this)[0].id != "huaDongJiBen"){
			$(this).hide();
			$(this).prev().addClass('animated').addClass('bounceInLeft').removeClass('bounceInRight').show();
		}
		NavigationSwitchright(this.id);
    });

	function NavigationSwitchleft(name){
		switch(name){					
			case "huaDongJiBen":
				$("#mainnav ul li").removeClass("active");
				$("#activeYiZhuChaYue").addClass("active");
				break;
			case "huaDongYiZhu":
				$("#mainnav ul li").removeClass("active");
				$("#activeBingLiChaKan").addClass("active");
				break;
			case "huaDongBingLi":
				$("#mainnav ul li").removeClass("active");
				$("#activeBingLiChaKan").addClass("active");
				break;
			default:
				break;
		}
	}

	function NavigationSwitchright(name){
		switch(name){					
			case "huaDongJiBen":
				$("#mainnav ul li").removeClass("active");
				$("#activeBingAnZhuYe").addClass("active");
				break;
			case "huaDongYiZhu":
				$("#mainnav ul li").removeClass("active");
				$("#activeBingAnZhuYe").addClass("active");
				break;
			case "huaDongBingLi":
				$("#mainnav ul li").removeClass("active");
				$("#activeYiZhuChaYue").addClass("active");
				break;
			default:
				break;
		}
	}

	//$("#countButton > div").bind(touchEvents.touchstart, function() {
	//	$(this).addClass("bg-bs");     
    //});

	//$("#countButton > div").bind(touchEvents.touchend, function() {
	//	$(this).removeClass("bg-bs");      
    //});

});






