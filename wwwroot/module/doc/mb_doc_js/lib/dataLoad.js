define(["jquery", "hammer","jqueryhammer","utils"], function(jquery, hammer, jqueryhammer,utils) {

	//var doctorAdvice = require("doctorAdvice");
    var serviceChoose = utils.urlFunction();
	var temYPID = '';
    //请求库存量
    function totalDoseInfo(YPID, YFID) {        
        $.ajax({
            url: serviceChoose + "/DC_DrugInventory",
            type: 'POST',
            data: JSON.stringify({
                "YPID": YPID,//药品ID
                "YFID": YFID//药房ID
            }),            
            timeout: utils.timeoutSec(),
            dataType: "JSON",
             headers: {
                'Content-Type': 'application/json'
            }
        }).always(function (responseTxt, status, xhr) {
            if (status == "success") {
                utils.setTotalDose(responseTxt.Result.OUTPUT.KYSL);
                if (responseTxt.Result.OUTPUT.KYSL == 0) {
                    $("#buttonConfirm").hide();
                } else {
                    $("#buttonConfirm").show();
                }
                $("#totalDose span").text(responseTxt.Result.OUTPUT.KYSL + " " + ($.isEmptyObject(responseTxt.Result.OUTPUT.ZYDW) ? '' : responseTxt.Result.OUTPUT.ZYDW));
            } else {
                utils.showHide(responseTxt.Result.ERROR.MSG);
            }
        })
    }	
	//responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi]
	// 抗生素用药
	function antibiotics(yao_KSS,mr_Data){		
		if(yao_KSS>0){
			if(mr_Data!==undefined && mr_Data.yymd!==undefined && mr_Data.yyly!==undefined){	
				// 用药理由
				if(mr_Data.yyly==null){
					$("#reason span").text("请填写").addClass("text-red");
				}else{
					$("#reason span").text(mr_Data.yyly).removeClass("text-red");
				}
				// 用药目的
				$("#yzxdYYMD ul li").css("background","rgb(40, 42, 57)");
				if(mr_Data.yymd==null){
					$("#Purpose span").text("请选择").addClass("text-red");
				}else{					
					if(mr_Data.yymd==1 || mr_Data.yymd=='预防'){
						$("#Purpose span").text("预防").removeClass("text-red");
						$("#yzxdYYMD ul li:first").css("background","rgb(81, 82, 93)");
					}else{
						$("#Purpose span").text("治疗").removeClass("text-red");
						$("#yzxdYYMD ul li:last").css("background","rgb(81, 82, 93)");
					}
				}
			}else{
				$("#Purpose span").text("请选择").addClass("text-red");
				$("#reason span").text("请填写").addClass("text-red");
				$("#yzxdYYMD ul li").css("background","rgb(40, 42, 57)");
			}
			$("#Purpose").show();			
			$("#reason").show();
			$("#yzxdYYMD ul li").unbind();
			var hammerYymdLi = $("#yzxdYYMD ul li").hammer();			
			hammerYymdLi.on("tap",function(){
				$("#yzxdYYMD ul li").css("background","rgb(40, 42, 57)");
				$(this).css("background","rgb(81, 82, 93)");
				$("#Purpose span").text($(this).text()).removeClass("text-red");
			});
		}
	}

	// 加载 开医嘱时需要录入的药品信息
	function loadYaoPin(ypID,zjID,editValue,responseTxt){
		// JSON 对象 开头对象名 成套和非成套不一样 
		var JsonObject="";
		temYPID =ypID;
		// 如果是成套
		if($("#yzxd-name").attr("name").indexOf("ct") != -1){
			JsonObject="CTDETAIL";
		// 如果不是成套
		}else{
			JsonObject="OUTPUT";
		}

		$("#yzxdYaoNR li").hide();
		$("#yzxdYaoNR li span").text("");
		$("#yzxdYaoNR").show();

		//清空所有缓存的数据和ID值
		$("#yzxdYaoNR li span").text("");
		$("#Milligram small").text("");
		$("#total small").text("");
		$("#yzxdYaoNR li").removeClass("xuanThis");
		$("#appDateTime").removeClass("text-hui");
		$("#yzxdYaoNR li span").attr("data-gytjid","").attr("data-yfid","").attr("data-cjksid","").attr("data-gyzxid","").attr("data-zxksid","").attr("data-cjffid","").
		attr("data-plcs","").attr("data-syfw","").attr("data-pljg","").attr("data-jgdw","");
		$("#yzxd-bb").text("");
		$("#total span").text("");
		$("#totalFunction p").text("");

		$("#nrJYXM").empty("li").hide();
		$("#nrJCXM").empty("li").hide();
		
		//console.log(responseTxt);

		for(var ypi = 0 ; ypi < responseTxt.Result[JsonObject].ITEMLIST.ITEM.length; ypi++){
			if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].YPID == ypID || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZLXMID == ypID ||(editValue!==undefined && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].XH == editValue.xh && editValue.xh!==undefined)){

				var kjShowHide = {
					gytj:"",
					zl:"",
					ts:"",
					dl:"",
					gyzx:"",
					cjks:"",
					fyyf:"",
					zxks:"",
					zxxz:"",
					cjff:"",
					syfw:[]                       
				}
						
				$("#buttonaddJYXM").hide();
				$("#buttonaddJCXM").hide();
				$("#yzxdTwoJi p").hide();

				// 判断抗生素用药等级
				var yaoLB = responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB;
				if((yaoLB==5 || yaoLB==6) && editValue==undefined){
					var yao_KSS = responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].KSS;
					antibiotics(yao_KSS);
				}else if((yaoLB==5 || yaoLB==6) && editValue!==undefined){
					var yao_KSS = responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].KSS;
					var yao_YYMD = editValue.yymd;
					var yao_YYLY = editValue.yyly;
					var mr_Data = {yymd:yao_YYMD,yyly:yao_YYLY};
					antibiotics(yao_KSS,mr_Data);
				}
						
				// 如果是一并追加的药
				if(zjID.ID!="" && ( responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 5 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 6 ) ){
                   //赋值本位码
					$("#yzxdTwoJiHeight").attr("data-bwm",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].BWM);
					// 根据执行频率获取执行频率的参数
					var mr_jgdw,mr_pljg,mr_syfw,mr_plcs;
					$.each(responseTxt.Result[JsonObject].ZXPC.ITEM,function(n,thisZxpc){
						if(thisZxpc.MC==zjID.zxpl){
							mr_jgdw=thisZxpc.JGDW;
							mr_pljg=thisZxpc.PLJG;
							mr_syfw=thisZxpc.SYFW;
							mr_plcs=thisZxpc.PLCS;
							return false;
						}
					});
					// 更新默认参数 用于后续计算总量使用
					$("#executeHz span").attr("data-jgdw",mr_jgdw).attr("data-pljg",mr_pljg).attr("data-syfw",mr_syfw).attr("data-plcs",mr_plcs);
					//console.log("是一并追加");
					temYPID =ypID;
					$("#totalDose").show();
					if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0]){
							totalDoseInfo(ypID,responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM[0].ID);    
					}else{
							totalDoseInfo(ypID,responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM[0].ID);
					}
				
					// 是否紧急
					$("#emergency").show();
					$("#emergency").removeClass("eventQY");
					zjID.sfjj=="yes" ? $("#icnYes").show().addClass("text-hui") : $("#icnYes").hide().removeClass("text-hui");

					// 开始时间
					$("#startTimeLi").show().removeClass("eventQY");
					$("#appDateTime").text(zjID.kssj).addClass("text-hui");

					// 执行频率
					$("#executeHz").show().removeClass("eventQY");
					$("#executeHz span").text(zjID.zxpl).removeClass("text-red").addClass("text-hui");
					$("#yzxdZXPL ul").empty("li"); 

					// 医生嘱托
					$("#doctorTell").show();
					$("#doctorTell span").text("请填写").addClass("text-red");
					// 时间方案
					if(zjID.sjfa!="" && zjID.sjfa!==null){
						$("#TimeToPlan").removeClass("eventQY");
						$("#TimeToPlan").show();
						$("#TimeToPlan span").text(zjID.sjfa).removeClass("text-red").addClass("text-hui");
					}else{
						$("#TimeToPlan").hide();
					}

					// 总量
					if(zjID.zl !== "" && zjID.zl !== undefined && zjID.zl !== "undefined"){
						$("#total").show();
						$("#total span").text(0).addClass("text-red");
						$("#total small").text(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].ZYDW);
						$("#totalFunction p").text(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].ZYDW);
						$("#countResult-zl").text(0);
					}else{
						$("#total").hide();
					}

					// 天数
					if(zjID.ts !== "" && zjID.ts !== undefined && zjID.ts !== "undefined"){
						$("#NumberOfDays").show().removeClass("eventQY");
						$("#NumberOfDays span").text(zjID.ts).addClass("text-hui").removeClass("text-red");
					}else{
						$("#NumberOfDays").hide();
					}
	
					// 给药途径
					if(zjID.gytj!=""){
						$("#drugWay").removeClass("eventQY");
						$("#drugWay").show();
						$("#drugWay span").text(zjID.gytj).attr("data-gytjid",zjID.gytjID).removeClass("text-red").addClass("text-hui");
					}else{
						$("#drugWay").hide();
					}

					// 给药执行
					if(zjID.gyzx!=""){
						$("#ToPerform").removeClass("eventQY");
						$("#ToPerform").show();
						$("#ToPerform span").text(zjID.gyzx).attr("data-gyzxid",zjID.gyzxID).removeClass("text-red").addClass("text-hui");
					}else{
						$("#ToPerform").hide();
					}

					// 执行性质
					if(zjID.zxxz!=""){
						$("#PerformTheNature").removeClass("eventQY");
						$("#PerformTheNature").show();
						$("#PerformTheNature span").text(zjID.zxxz).removeClass("text-red").addClass("text-hui");
					}else{
						$("#PerformTheNature").hide();
					}
	
					// 单量
					$("#Milligram").show();
					$("#boxCount p").text(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].JSDW);
					$("#countResult").text("0");
					//$(".countbox-botton").css("background","rgb(40, 42, 57)");
					//$("#Milligram span").text("0").addClass("text-red").attr("id","zybzjlxs"+ (responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].JLXS * responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].ZYBZ));
					$("#Milligram span").text("0").addClass("text-red").attr("id","zybzjlxs"+ responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].JLXS);
					$("#Milligram small").text(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].JSDW);

					// 滴速
					if(zjID.ds!=""){
						$("#diSu").removeClass("eventQY");
						$("#diSu").show();
						$("#diSu input").val(zjID.ds).removeClass("text-red").addClass("text-hui");
					}else{
						$("#diSu").hide();
					}

					// 发药药房
					$("#pharmacy").show();
					$("#pharmacy span").attr("data-yfid",responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].FYYF.ITEM[0].ID).text(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].FYYF.ITEM[0].MC);
					$("#yzxdFYYF ul").empty("li"); 

					//医嘱下达li
					$("#yzxdYaoNR .eventQY").on("touchstart touchmove",function(){
						utils.CpStart($(this));
					});
					$("#yzxdYaoNR .eventQY").on("touchend",function(){
						utils.CpEnd($(this));
					});
					// 更新发药药房的值 
					for(var yfii = 0; yfii < responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].FYYF.ITEM.length; yfii++){
						$("#yzxdFYYF ul").append('<li data-yfid="'+responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].FYYF.ITEM[yfii].ID+'">'+ responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].FYYF.ITEM[yfii].MC +'</li>');
					}
					// 发药药房点击事件
					hammeryzxdFYYFybzjC = $("#yzxdFYYF ul li").hammer();
					hammeryzxdFYYFybzjC.on("tap",function(ev){
						yzxdFYYFFunction($(this));
						//根据药房更换库存量
						totalDoseInfo(temYPID,$(this).attr("data-yfid"));
					});

				// 如果是药品 长嘱	
				}else if( zjID.ID=="" && ( responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 5 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 6 ) && $("#yzxdCL").find(".active").text()=="长期医嘱" ){
					
					//console.log("是药品 长嘱");
					kjShowHide = {
						gytj:"show",
						zl:"hide",
						ts:"hide",
						dl:"show",
						gyzx:"show",
						cjks:"hide",
						fyyf:"show",
						zxks:"hide",
						zxxz:"show",
						cjff:"hide",
						syfw:[1,-3]                       // 执行频率适用范围
					}
					yzxdKongJianShowHide(kjShowHide);

				// 如果是药品 临嘱
				}else if( zjID.ID=="" && ( responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 5 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 6 ) && $("#yzxdCL").find(".active").text()=="临时医嘱" ){
					
					//console.log("是药品 临嘱");

					kjShowHide = {
						gytj:"show",
						zl:"show",
						ts:"show",
						dl:"show",
						gyzx:"show",
						cjks:"hide",
						fyyf:"show",
						zxks:"hide",
						zxxz:"show",
						cjff:"hide",
						syfw:[1,-1,-5]                       // 执行频率适用范围
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是检查
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "D" ){
					if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JCBW !== null){
						$("#nrJCXM").show();
						$("#buttonaddJCXM").show();
						$("#yzxdTwoJi p").text("未选择检查部位").addClass("text-red").show();
						// 如果是编辑状态
						if(editValue !== undefined){
							// 加载检查部位的数据
							if(editValue.jcxm.length>0){
								for(var jcbwi=0; jcbwi<editValue.jcxm.length; jcbwi++){
									$("#nrJCXM").append('<li name="'+editValue.jcxm[jcbwi].jcxmffStr+'"><div style="width:80%; float:left;"><div class="max">'+editValue.jcxm[jcbwi].jcxmmc+'</div><div class="min text-lv" name="'+editValue.jcxm[jcbwi].jcxmDanDuo+'">'+editValue.jcxm[jcbwi].jcxmff+'</div></div><span class="fs1 text-26 color-hong" aria-hidden="true" data-icon=""></span></li>');
								}

								// 注册事件 删除检查项目
								$("#nrJCXM li span").unbind();
								hammeryzxdDellJCXM2 = $("#nrJCXM li span").hammer();
								hammeryzxdDellJCXM2.on("tap",function(){
									utils.yzxdDellJCXM($(this).parent());
								});

								// 注册事件 选择检查方法
								hammeryzxdSelFF = $("#nrJCXM li>div").hammer();
								hammeryzxdSelFF.on("tap",function(){
									utils.yzxdSelFF($(this).parent());
								});
								$("#yzxdTwoJi p").text("已选择检查部位").removeClass("text-red");
							}
							/* 不是成套 则显示添加项目按钮
							if($("#yzxd-name").attr("name").indexOf("ct")==-1){
								$("#buttonaddJCXM").show();
								$("#yzxdTwoJi p").text("已选择检查部位").removeClass("text-red").show();
							}*/
						}
					}else{
						$("#buttonaddJCXM").hide();
						$("#yzxdTwoJi p").text("").removeClass("text-red").hide();
					}

					

					kjShowHide = {
						gytj:"hide",
						zl:"show",
						zl_mr:1,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5],                       // 执行频率适用范围
						syfw_mr:-1
					}
					yzxdKongJianShowHide(kjShowHide);
					yzxdSQFX();
				// 如果是检验
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "C" ){
					$("#nrJYXM").show();
					$("#buttonaddJYXM").show();
					$("#yzxdTwoJi p").text("未选择检验项目").addClass("text-red").show();
					// 如果是编辑状态
					if(editValue !== undefined){
						if(editValue.jyxm.length>0){
							// 加载已选择的检验项目
							for(var jyxmi=0; jyxmi < editValue.jyxm.length; jyxmi++){
								$("#nrJYXM").append('<li name="'+editValue.jyxm[jyxmi].jyxmID+'" data-bbbw="'+editValue.jyxm[jyxmi].bbbw+'" data-czlx="'+editValue.jyxm[jyxmi].czlx+'" data-sgbh="'+editValue.jyxm[jyxmi].sgbh+'"><div style="width:80%; float:left;">'+editValue.jyxm[jyxmi].jyxmmc+'</div><span class="fs1 text-26 color-hong" aria-hidden="true" data-icon=""></span></li>');
							}
							$("#yzxd-name").text("标本："+editValue.jyxm[0].bbbw);
						}
					// 不是编辑状态
					}else{
						var jyxmData = responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi];
						$("#nrJYXM").append('<li name="'+jyxmData.ZLXMID+'" data-bbbw="'+jyxmData.BBBW+'" data-czlx="'+jyxmData.CZLX+'" data-sgbh="'+jyxmData.SGBM+'"><div style="width:80%; float:left;">'+jyxmData.XMMC+'</div><span class="fs1 text-26 color-hong" aria-hidden="true" data-icon=""></span></li>');
						$("#yzxd-name").text("标本："+jyxmData.BBBW);
					}

					$("#yzxdTwoJi p").text("已选择检验项目").removeClass("text-red").show();
					//已选择是项目动画
					$("#nrJYXM li").on("touchstart touchmove",function(){
						utils.CpStart($(this));
					});
					$("#nrJYXM li").on("touchend",function(){
						utils.CpEnd($(this));
					});
					// 注册事件
					hammerjyxmNR = $("#nrJYXM li span").hammer();
					hammerjyxmNR.on("tap",function(){
						yzxdJCXMdell($(this));
					});
					kjShowHide = {
						gytj:"hide",
						zl:"show",
						zl_mr:1,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"show",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"show",
						syfw:[-1,-5],
						syfw_mr:-1    
					}
					yzxdKongJianShowHide(kjShowHide);
					yzxdSQFX();
				// 如果是治疗 1
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3 ){
					kjShowHide = {
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-3]                 
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 2
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 1 ){
					kjShowHide = {
						zl:"hide",
						dl:"show",
						gytj:"hide",						
						ts:"hide",								
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-3]             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 3
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2 ){
					kjShowHide = {
						zl:"hide",
						dl:"show",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-3]           
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 4
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3 ){
					kjShowHide = {
						zl:"show",
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-1,-5]          
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 5
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 1 ){
					kjShowHide = {
						zl:"show",
						dl:"show",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-1,-5]          
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 6
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2 ){
					kjShowHide = {
						zl:"show",
						dl:"show",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-1,-5]           
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 7
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0 ){
					kjShowHide = {
						zl:"show",
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-1,-5]              
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 8
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0 ){
					kjShowHide = {
						zl:"hide",
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-3]              
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 9
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3 ){
					kjShowHide = {
						zl:"hide",
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-2,-3,-4],
						syfw_mr:-2,             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 10
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 1 ){
					kjShowHide = {
						zl:"hide",
						dl:"show",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-2,-3,-4],
						syfw_mr:-2,             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 11
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2 ){
					kjShowHide = {
						zl:"hide",
						dl:"show",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-2,-3,-4],
						syfw_mr:-2,             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 12
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0 ){
					kjShowHide = {
						zl:"hide",
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-2,-3,-4],
						syfw_mr:-2,             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 13
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 1 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3 ){
					kjShowHide = {
						zl:"show",
						zl_mr:1,//总量为1   
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5],
						syfw_mr:-1,             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 14
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 1 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 1 ){
					kjShowHide = {
						zl:"show",  
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5],
						syfw_mr:-1,             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 15
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 1 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2 ){
					kjShowHide = {
						zl:"show",  
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5],
						syfw_mr:-1,             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 16
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 1 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0 ){
					kjShowHide = {
						zl:"show",  
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5],
						syfw_mr:-1,             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 17
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 1 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 1 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3 ){
					kjShowHide = {
						zl:"show",
						zl_mr:1,  
						dl:"hide",
						gytj:"hide",															
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5],
						syfw_mr:-1,             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   1
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-3]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   2,3
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 1||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2)){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-3]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   4
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-3]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   8
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-1,-5]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   5
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-1,-5]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   6,7
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 &&( responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 1||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2)){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-1,-5]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   9
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2,-3,-4],
						syfw_mr:-2
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   10,11
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 1||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2)){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2,-3,-4],
						syfw_mr:-2
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   12
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2,-3,-4],
						syfw_mr:-2
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它 14
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 1 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						zl_mr:1,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1,-5],
						syfw_mr:-1
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   15,16,17
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 1 && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 1||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0)){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1,-5],
						syfw_mr:-1
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是护理1
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "H" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 1 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是护理2
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "H" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2,-3,-4],
						syfw_mr:-2
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是护理3
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "H" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-3]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是护理4
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "H" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 0 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-1,-5]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是膳食1、2
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "I" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == null && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 &&( responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3 )){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是膳食3、4
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "I" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == null && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 &&( responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 1 ||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 2 )){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱1、6、7、10、11
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 4||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX==10||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX==9||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX==12||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX==14) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 2 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱2/3/4/5/8/9
				}else if( zjID.ID=="" && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 6||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 3||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 7||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 5||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 8||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX == 11) && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL == 1 && responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						zl_mr:1,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1]
					};
					yzxdKongJianShowHide(kjShowHide);
				}else{
					utils.showHide("参数有误，无法提供数据");
					if($("#yzxdBiaoTi font").text()=="成套医嘱编辑"){
						$("#buttonConfirm").hide();
					}
				}


				// 用于判断显示哪些下达控件的 函数
				function yzxdKongJianShowHide(plan){
					
					$("#yzxdYaoNR li").addClass("eventQY");
					// 如果是编辑状态
					if(editValue !== undefined){
						// 如果是一并追加的药  
						if(editValue.ybID!=="" && $("#yzxdBiaoTi font").text()=="医嘱编辑"){
							
							// 判断当前编辑的药品是否是同组追加医嘱的第一条，第一条全部可编辑，后面的部分可编辑
							$("#yzDBCButtonNR li").each(function(){
								if($(this).attr("id") == editValue.ID){
									// 如果追加ID跟上一条的追加ID一样，只有部分可编辑
									if($(this).attr("name")==$(this).prev().attr("name")){
										editDocActYesNo("no","no");
									// 如果追加ID跟上一条的追加ID不一样，全部可编辑
									}else if($(this).attr("name")!==$(this).prev().attr("name")){
										editDocActYesNo("yes","no");
									}
									return false;
								}
							});
						// 如果是成套明细检查
						}else if(editValue.ybID!=="" && $("#yzxdBiaoTi font").text()=="成套医嘱编辑"){
							// 如果不是一并追加的药
							if($("#yzxdTwoJiChengTao").find(".activeJC").parent().find("span").eq(0).hasClass("selt")){
								editDocActYesNo("yes","yes");
							}else{
								editDocActYesNo("no","yes");
							}
						// 如果不是一并追加的药 全部可编辑
						}else{
							editDocActYesNo("yes","no");
						}

						
						function editDocActYesNo(YorN,mxJC){ //是否可编辑，是否是明细检查

						// 滴速  
						if(mxJC=="no" || (editValue.ds!=="" && editValue.ds!==undefined && editValue.ds!=="undefined")){
							if(editValue.ds!=="" && editValue.ds!==undefined && editValue.ds!=="undefined"){
								$("#diSu").show();
								$("#diSu input").val(editValue.ds);
								if(YorN=="yes"){
									$("#diSu").addClass("eventQY");
									if(editValue.ds==0||editValue.ds=="0")
										$("#diSu input").removeClass("text-hui").addClass("text-red");
									else
										$("#diSu input").removeClass("text-hui text-red");
								}else{
									$("#diSu").removeClass("eventQY");
									$("#diSu input").removeClass("text-red").addClass("text-hui");
								}
							}else{
								$("#diSu").hide();
							}
						// 如果是成套明细检查 因为没有默认滴速，所以要根据给药途径的值来取执行分类，判断zxfl==1才显示滴速
						}else{
							var zxfl="";
							var gytjName=responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].GYTJ;
							$.each(responseTxt.Result[JsonObject].GYTJ.ITEM,function(n,value){
								if(value.MC==gytjName){
									zxfl=value.ZXFL;
									return false;
								}
							});
							if(zxfl==1){
								$("#diSu").show();
								$("#diSu input").val("0").addClass("text-red");
								if(YorN=="yes"){
									$("#diSu").addClass("eventQY");
									$("#diSu input").removeClass("text-hui");
								}else{
									$("#diSu").removeClass("eventQY");
									$("#diSu input").addClass("text-hui").removeClass("text-red");
								}
							}else{
								$("#diSu").hide();
							}
						}

						// 是否紧急
						$("#emergency").show();  
						editValue.sfjj == "yes" ? $("#icnYes").show() : $("#icnYes").hide();
						if(YorN=="yes"){
							$("#emergency").addClass("eventQY");
							$("#icnYes").removeClass("text-hui");
						}else{
							$("#emergency").removeClass("eventQY");
							$("#icnYes").addClass("text-hui");
						}
						
						// 开始时间
						$("#startTimeLi").show();
						$("#appDateTime").text(editValue.kssj);
						if(YorN=="yes"){
							$("#startTimeLi").addClass("eventQY");
							$("#appDateTime").removeClass("text-hui");
						}else{
							$("#startTimeLi").removeClass("eventQY");
							$("#appDateTime").addClass("text-hui");
						}

						// 医生嘱托
						$("#doctorTell").show(); 
						$("#doctorTell span").text(editValue.yszt).removeClass("text-red");

						// 执行频率
						$("#executeHz").show(); 
						$("#executeHz span").text(editValue.zxpl);
						$("#yzxdZXPL ul").empty("li"); 
						if(YorN=="yes"){
							$("#executeHz").addClass("eventQY");
							$("#executeHz span").removeClass("text-red text-hui");
						}else{
							$("#executeHz").removeClass("eventQY");
							$("#executeHz span").addClass("text-hui");
						}

						// 时间方案  这里差：分离时间方案的数据，有首日则更新时间方案控件里的首日数据和每日数据
						if(editValue.sjfa != ""){
							$("#TimeToPlan").show();
							$("#TimeToPlan span").text(editValue.sjfa);
							$("#timePlan_SRUL").empty("li");
							$("#timePlan_MRUL").empty("li");

							if(YorN=="yes"){
								$("#TimeToPlan").addClass("eventQY");
								$("#TimeToPlan span").removeClass("text-red text-hui");
								// 更新时间方案默认值
								if(editValue.sjfa == null){
									$("#TimeToPlan span").text("请录入").addClass("text-red").removeClass("text-hui");
									//用默认执行频次的中文值去查找时间方案的间隔频次
									for(var ctSjfa=0; ctSjfa < responseTxt.Result[JsonObject].ZXPC.ITEM.length; ctSjfa++ ){
										if(editValue.zxpl == responseTxt.Result[JsonObject].ZXPC.ITEM[ctSjfa].MC){
											//判断是否显示首日
											if(responseTxt.Result[JsonObject].ZXPC.ITEM[ctSjfa].JGDW=="天" && responseTxt.Result[JsonObject].ZXPC.ITEM[ctSjfa].PLJG==1){
												$("#timePlan_SR").removeClass("display-none");
												$("#timePlan_SRUL").removeClass("display-none");
												$("#timePlan_MR").removeClass("display-none");
											}else{
												$("#timePlan_SR").addClass("display-none");
												$("#timePlan_SRUL").addClass("display-none");
												$("#timePlan_MR").addClass("display-none");
											}

											if(responseTxt.Result[JsonObject].ZXPC.ITEM[ctSjfa].PLJG > 1 && responseTxt.Result[JsonObject].ZXPC.ITEM[ctSjfa].JGDW == "天"){
												$("#timePlan .timeJG").text("_/__:__");
											}else{
												$("#timePlan .timeJG").text("__:__");
											}
											break;
										}
									}
									
									if(responseTxt.Result[JsonObject].ZXPC.ITEM[ctSjfa].PLCS>0){
									// 根据频率次数追加 时间方案 天数按钮
									for(var ctPlcsi=0; ctPlcsi<responseTxt.Result[JsonObject].ZXPC.ITEM[ctSjfa].PLCS; ctPlcsi++){
										// 更新首日 默认值
										if(!($("#timePlan_SRUL").hasClass("display-none"))){
											$("#timePlan_SRUL").append('<li><span>'+ (ctPlcsi+1) +'</span></li>');
										}

										// 更新每日 默认值
										if(!($("#timePlan_MRUL").hasClass("display-none"))){
											$("#timePlan_MRUL").append('<li><span>'+ (ctPlcsi+1) +'</span></li>');
										}

									}/*for*/
									}else{
										$("#TimeToPlan").hide();
										$("#TimeToPlan span").text("");
									}
								}else{
									fjjg = utils.timePlanFJ(editValue.sjfa);
									$("#timePlan_SRUL").empty("li");
									$("#timePlan_MRUL").empty("li");
									for(var timei=0; timei<fjjg.mrtime.length; timei++){
										// 更新首日 默认值
										if(!($("#timePlan_SRUL").hasClass("display-none"))){
											if(fjjg.srtime.length > 0){
												$("#timePlan_SRUL").append('<li><span>'+ (timei+1) +'</span><label class="day">'+ (fjjg.srday[timei] == undefined ? "":fjjg.srday[timei]) +'</label><label class="time">'+ (fjjg.srtime[timei].indexOf(":")!=-1 ? fjjg.srtime[timei] : (fjjg.srtime[timei] + ':00') ) +'<label></li>');
											}else{
												$("#timePlan_SRUL").append('<li><span>'+ (timei+1) +'</span></li>');
											}
										}

										// 更新每日 默认值
										if(fjjg.mrtime.length > 0){
											$("#timePlan_MRUL").append('<li><span>'+ (timei+1) +'</span><label class="day">'+ (fjjg.mrday[timei] == undefined ? "":fjjg.mrday[timei]) +'</label><label class="time">'+ (fjjg.mrtime[timei].indexOf(":")!=-1 ? fjjg.mrtime[timei] : (fjjg.mrtime[timei] + ':00') ) +'<label></li>');
										}else{
											$("#timePlan_MRUL").append('<li><span>'+ (timei+1) +'</span></li>');
										}
									}
								}
							}else if(YorN=="no" && editValue.sjfa==null){
								$("#TimeToPlan").hide();
								$("#TimeToPlan span").text("").removeClass("text-red text-hui");
							}else{
								$("#TimeToPlan").removeClass("eventQY");
								$("#TimeToPlan span").removeClass("text-red").addClass("text-hui");
							}
						}else{
							$("#TimeToPlan").hide();
							$("#TimeToPlan span").text("").removeClass("text-red text-hui");
						}

						// 给药途径
						if(plan.gytj == "show"){
							$("#drugWay").show();                   
							$("#drugWay span").text(editValue.gytj).attr("data-gytjid",editValue.gytjID);
							if(YorN=="yes"){
								$("#drugWay").addClass("eventQY");
								$("#drugWay span").removeClass("text-red text-hui");
								updateGytj();
							}else{
								$("#drugWay").removeClass("eventQY");
								$("#drugWay span").addClass("text-hui");
							}

						}else{
							$("#drugWay").hide(); 
						}

						// 采集方法  
						if(plan.cjff == "show"){
							$("#samplingMethod").show();
							$("#samplingMethod span").text(editValue.cjff).attr("data-cjffid",editValue.cjffID);

							if(YorN=="yes"){
								$("#samplingMethod").addClass("eventQY");
								$("#samplingMethod span").removeClass("text-red text-hui");
								// 更新采集方法的值
								$("#yzxdCJFF ul").empty("li");
								for(var cjffi=0; cjffi < responseTxt.Result[JsonObject].CJFF.ITEM.length; cjffi++){
									$("#yzxdCJFF ul").append('<li data-cjffid="'+responseTxt.Result[JsonObject].CJFF.ITEM[cjffi].ID+'">'+responseTxt.Result[JsonObject].CJFF.ITEM[cjffi].MC+'</li>');
								}

								// 采集方法点击事件
								hammeryzxdCJFF = $("#yzxdCJFF ul li").hammer();
								hammeryzxdCJFF.on("tap",function(ev){
									var cjffID = $(this).attr("data-cjffid");
									yzxdCJFFFunction(this,cjffID);	
								});

							}else{
								$("#samplingMethod").removeClass("eventQY");
								$("#samplingMethod span").addClass("text-hui");
							}

						}else{
							$("#samplingMethod").hide();
						}

						// 采集科室
						if(plan.cjks == "show"){

							$("#AcquisitionDepartment").show();
							// 加载可选采集科室 根据采集方法进行筛选
							$("#yzxdCJKS ul").empty("li");
							$.each(responseTxt.Result[JsonObject].CJFF.ITEM,function(cji,cjValue){
								if(cjValue.ID==editValue.cjffID){
									$.each(cjValue.CJKS.ITEM,function(cki,ckValue){
										$("#yzxdCJKS ul").append('<li data-cjksid="'+ckValue.ID+'">'+ckValue.MC+'</li>');
									});
									// 给采集科室注册点击事件
									hammeryzxdCJKS = $("#yzxdCJKS ul li").hammer();
									hammeryzxdCJKS.on("tap",function(ev){
										yzxdCJKSFunction(this);	
									});
									return false;
								}
							});
							
							if(YorN=="yes"){
								$("#AcquisitionDepartment").addClass("eventQY");
								$("#AcquisitionDepartment span").removeClass("text-red text-hui");
							}else{
								$("#AcquisitionDepartment").removeClass("eventQY");
								$("#AcquisitionDepartment span").removeClass("text-red").addClass("text-hui");
							}

							// 如果是成套明细检查 更新默认值
							if(mxJC=="yes"){
								if($("#yzxdCJKS ul li").length>1)
									$("#AcquisitionDepartment span").text("请选择").addClass("text-red");
								else
									$("#AcquisitionDepartment span").attr("data-cjksid",$("#yzxdCJKS ul li").eq(0).attr("data-cjksid")).text($("#yzxdCJKS ul li").eq(0).text());
							}else{
								$("#AcquisitionDepartment span").attr("data-cjksid",editValue.cjksID).text(editValue.cjks);
							}

						}else{
							$("#AcquisitionDepartment").hide();
							$("#AcquisitionDepartment span").attr("data-cjksid","").text("");
						}
						// 执行科室
						if(plan.zxks == "show"){
							$("#ExecutiveDepartments").show();
							// 更新执行科室的值
							$("#yzxdZXKS ul").empty("li");
							if(responseTxt.Result[JsonObject].ZXKS !== null){
								for(var zxksii=0; zxksii < responseTxt.Result[JsonObject].ZXKS.ITEM.length; zxksii++){
									if(responseTxt.Result[JsonObject].ZXKS.ITEM[zxksii].ZLXMID == ypID){
										// 去重
										if($("#yzxdZXKS ul li").length>0){
										$("#yzxdZXKS ul li").each(function(qci){
											if($(this).attr("data-zxksid")==responseTxt.Result[JsonObject].ZXKS.ITEM[zxksii].ID)
												return false;
											if(qci==$("#yzxdZXKS ul li").length-1)
												$("#yzxdZXKS ul").append('<li data-zxksid="'+responseTxt.Result[JsonObject].ZXKS.ITEM[zxksii].ID+'">'+responseTxt.Result[JsonObject].ZXKS.ITEM[zxksii].MC+'</li>');
										});
										}else{
											$("#yzxdZXKS ul").append('<li data-zxksid="'+responseTxt.Result[JsonObject].ZXKS.ITEM[zxksii].ID+'">'+responseTxt.Result[JsonObject].ZXKS.ITEM[zxksii].MC+'</li>');
										}
									}
								}
							}
							// 执行科室点击事件
							hammeryzxdZXKS = $("#yzxdZXKS ul li").hammer();
							hammeryzxdZXKS.on("tap",function(ev){
								yzxdZXKSFunction($(this));	
							});
							// 如果可编辑
							if(YorN=="yes"){
								$("#ExecutiveDepartments").addClass("eventQY");
								$("#ExecutiveDepartments span").removeClass("text-red text-hui");
							}else{
								$("#ExecutiveDepartments").removeClass("eventQY");
								$("#ExecutiveDepartments span").removeClass("text-red").addClass("text-hui");
							}
							// 默认执行科室 如果是成套明细检查
							if(mxJC=="yes"){
								if($("#yzxdZXKS ul li").length>1)
									$("#ExecutiveDepartments span").text("请选择").addClass("text-red");
								else
									$("#ExecutiveDepartments span").attr("data-zxksid",$("#yzxdZXKS ul li").eq(0).attr("data-zxksid")).text($("#yzxdZXKS ul li").eq(0).text());
							}else{
								$("#ExecutiveDepartments span").attr("data-zxksid",editValue.zxksID).text(editValue.zxks);
							}
							
						}else{
							$("#ExecutiveDepartments").hide();
							$("#ExecutiveDepartments span").attr("data-zxksid","").text("");
						}
						// 根据执行频率获取执行频率的参数
						var mr_jgdw,mr_pljg,mr_syfw,mr_plcs;
						$.each(responseTxt.Result[JsonObject].ZXPC.ITEM,function(n,thisZxpc){
							if(thisZxpc.MC==editValue.zxpl){
								mr_jgdw=thisZxpc.JGDW;
								mr_pljg=thisZxpc.PLJG;
								mr_syfw=thisZxpc.SYFW;
								mr_plcs=thisZxpc.PLCS;
								return false;
							}
						});
						// 更新默认参数 用于后续计算总量使用
						$("#executeHz span").attr("data-jgdw",mr_jgdw).attr("data-pljg",mr_pljg).attr("data-syfw",mr_syfw).attr("data-plcs",mr_plcs);
						$("#yzxdTwoJiHeight").attr("data-flsx",editValue.flsx).attr("data-zybz",editValue.zybz);
						// 更新默认参数 用于后续判断
						//$("#yzxdTwoJiHeight").attr("data-qx",editValue.yzfl);
						//$("#yzxdTwoJiHeight").attr("data-lb",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB);
						//$("#yzxdTwoJiHeight").attr("data-czlx",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX);
						//$("#yzxdTwoJiHeight").attr("data-zxpl",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL);
						//$("#yzxdTwoJiHeight").attr("data-jsfs",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS);
						// 天数
						if(plan.ts == "show"&& mr_syfw==1){
							$("#NumberOfDays").show();
							$("#NumberOfDays span").text(editValue.ts);
							$("#countResult-ts").text(editValue.ts);
							// 如果不可编辑
							if(YorN=="no"){
								$("#NumberOfDays").removeClass("eventQY");
								$("#NumberOfDays span").removeClass("text-red").addClass("text-hui");
							}else{
								$("#NumberOfDays").addClass("eventQY");
								$("#NumberOfDays span").removeClass("text-red text-hui");	
							}
						}else{
							$("#NumberOfDays").hide();
						}
						// 总量
						if(plan.zl == "show"){
							$("#total").show();
							if(editValue.zl==null||editValue.zl==""){
								$("#total span").text(0).removeClass("text-hui").addClass("text-red");
								$("#countResult-zl").text(0);
							}else{
								$("#total span").text(editValue.zl).removeClass("text-red text-hui");
								$("#countResult-zl").text(editValue.zl);
							}
							// 判断总量单位
							if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB=="5"||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB=="6"){
								$("#total small").text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYDW==undefined?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYDW); 
								$("#totalFunction p").text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYDW==undefined?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYDW);
							}else{
								$("#total small").text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW==undefined?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW); 
								$("#totalFunction p").text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW==undefined?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW);
							}
							// 判断总量是否可编辑
							if(plan.zl_mr==1 || (mr_syfw!=="1"&&(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB=="E"||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB=="Z")&&editValue.yzfl=="临时医嘱"&&(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX=="0"||responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX=="5")&&responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL=="0"&&responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS=="3")){
								$("#total").removeClass("eventQY");
								$("#total span").addClass("text-hui");
							}
						}else{
							$("#total").hide();
						}								

						// 单量
						if(plan.dl == "show"){
							var DlJsdw="";
							if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW == null){
								DlJsdw="";
							}else{
								DlJsdw=responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW;
							}
							$("#Milligram").show();                 
							$("#boxCount p").text(DlJsdw);
							if(editValue.dl==null){
								// 更新单量的默认值、单位 和 住院包装*计量系数的值
								$("#Milligram span").text(0).addClass("text-red").removeClass("text-hui").attr("id","zybzjlxs"+responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JLXS);
								$("#countResult").text(0);
							}else{
								// 更新单量的默认值、单位 和 住院包装*计量系数的值
								$("#Milligram span").text(editValue.dl).removeClass("text-red text-hui").attr("id","zybzjlxs"+responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JLXS);
								$("#countResult").text(editValue.dl);
							}
							$("#Milligram small").text(DlJsdw);
						}else{
							$("#Milligram").hide();     
						}
					
						// 给药执行
						if(plan.gyzx == "show"){
							$("#ToPerform").show();    
							$("#yzxdGYZX-UL").empty("li");
							
							if(YorN=="yes"){
								$("#ToPerform").addClass("eventQY");                
								$("#ToPerform span").removeClass("text-red text-hui");
							}else{
								$("#ToPerform").removeClass("eventQY");                
								$("#ToPerform span").addClass("text-hui");
							}
							// 如果是成套明细检查，给药执行的值根据editValue.gytjID计算得出
							if(mxJC=="yes" && YorN=="yes"){
								$.each(responseTxt.Result[JsonObject].GYTJ.ITEM,function(gyi,gyValue){
									if(gyValue.ID==editValue.gytjID){
										var geiYaoZX = '',geiYaoZxId = '';
										$.each(gyValue.GYZX.ITEM,function(zxi,zxValue){
											if(editValue.gyzxID == zxValue.ID){
												geiYaoZX = editValue.gyzx;
												geiYaoZxId = editValue.gyzxID;
											}
											$("#yzxdGYZX-UL").append('<li data-gyzxid="'+zxValue.ID+'">'+zxValue.MC+'</li>');
										});
										// 更新给药执行默认值
										if(geiYaoZX!==''){
											$("#ToPerform span").attr("data-gyzxid",geiYaoZxId).text(geiYaoZX).removeClass("text-red");
										}else if(gyValue.GYZX.ITEM.length>1){
											$("#ToPerform span").text("请选择").addClass("text-red");
										}else{
											$("#ToPerform span").attr("data-gyzxid",gyValue.GYZX.ITEM[0].ID).text(gyValue.GYZX.ITEM[0].MC).removeClass("text-red");
										}
										return false;
									}
								});
							}else{
								$("#ToPerform span").attr("data-gyzxid",editValue.gyzxID).text(editValue.gyzx);
								$.each(responseTxt.Result[JsonObject].GYTJ.ITEM,function(gyi,gyValue){
									if(gyValue.ID==editValue.gytjID && gyValue.GYZX!==null){
										$.each(gyValue.GYZX.ITEM,function(zxi,zxValue){
											$("#yzxdGYZX-UL").append('<li data-gyzxid="'+zxValue.ID+'">'+zxValue.MC+'</li>');
										});
									}
								});
							}
							// 追加成功后给每个LI绑定Hammer事件
							hammeryzxdGYZX = $("#yzxdGYZX ul li").hammer();
							hammeryzxdGYZX.on("tap",function(ev){
								yzxdGYZXFunction($(this));
							});
						}else{
							$("#ToPerform").hide();   
							$("#ToPerform span").attr("data-gyzxid","").text("");
						}
						
					
						// 发药药房
						if(plan.fyyf == "show"){
							$("#pharmacy").show();                  
							$("#pharmacy span").attr("data-yfid",editValue.yfID).text(editValue.fyyf);
							$("#yzxdFYYF ul").empty("li"); 

							// 更新发药药房的值 
							if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0]){
								for(var yfi = 0; yfi < responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM.length; yfi++){
								$("#yzxdFYYF ul").append('<li data-yfid="'+responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM[yfi].ID+'">'+ responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM[yfi].MC +'</li>');
							}
							}else{
								for(var yfi = 0; yfi < responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM.length; yfi++){
								$("#yzxdFYYF ul").append('<li data-yfid="'+responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM[yfi].ID+'">'+ responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM[yfi].MC +'</li>');
							}
							}
							

							// 发药药房点击事件
							hammeryzxdFYYFedit = $("#yzxdFYYF ul li").hammer();
							hammeryzxdFYYFedit.on("tap",function(ev){
								yzxdFYYFFunction($(this));	
							});
						}else{
							$("#pharmacy").hide();  
							$("#pharmacy span").attr("yfid","").text("");
						}
					
						// 执行性质
						if(plan.zxxz == "show"){
							$("#PerformTheNature").show();          
							$("#PerformTheNature span").text(editValue.zxxz);

							if(YorN=="yes"){
								$("#PerformTheNature").addClass("eventQY");                
								$("#PerformTheNature span").removeClass("text-red text-hui");
								$("#yzxdZXXZ ul li").css("background","rgb(40, 42, 57)");
							}else{
								$("#PerformTheNature").removeClass("eventQY");                
								$("#PerformTheNature span").addClass("text-hui");
							}
						}else{
							$("#PerformTheNature").hide();     
						}
						//库存量
							if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 5 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 6){
								$("#totalDose").show();
								//处理海南医院节点不同
								var tempItem = '';
								if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0]){
									tempItem = responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM[0].ID
								}else{
									tempItem = responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM[0].ID;
								}
								totalDoseInfo(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].SFXMID,tempItem);
								//$("#totalDose span").text(utils.getTotalDose()).addClass("text-red");
							}

						}//editDocActYesNo

						// 更新当前医嘱项目的判断规则数据
						$("#yzxdTwoJiHeight").attr("data-qx",editValue.yzfl);
					
					// 如果不是编辑状态
					}else{

						// 更新当前医嘱项目的判断规则数据
						$("#yzxdTwoJiHeight").attr("data-qx",$("#yzxdCL .active").text());

						$("#emergency").show();   // 是否紧急
						$("#icnNo").hide();
						$("#icnYes").hide().removeClass("text-hui");

						$("#startTimeLi").show(); // 开始时间
						$("#appDateTime").text(utils.todayNow());

						$("#doctorTell").show();  // 医生嘱托
						$("#doctorTell span").text("请填写").addClass("text-red");
						//总的计量--只有药品才有
						if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 5 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 6){
							$("#totalDose").show();
							//处理海南医院节点不同
							var tempItem = '';
							if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0]){
								tempItem = responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM[0].ID
							}else{
								tempItem = responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM[0].ID;
							}
							totalDoseInfo(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].YPID,tempItem);
							//$("#totalDose span").text(utils.getTotalDose()).addClass("text-red");
						}
						$("#executeHz").show();  // 执行频率
						$("#executeHz span").text("请选择").addClass("text-red").removeClass("text-hui");
						$("#yzxdZXPL ul").empty("li"); 

						// 给药途径
						if(plan.gytj == "show"){
							$("#drugWay").show();                   
							$("#drugWay span").text("请选择").addClass("text-red").removeClass("text-hui");
							updateGytj();
						}else{
							$("#drugWay").hide(); 
						}

						// 采集方法  
						if(plan.cjff == "show"){
							$("#samplingMethod").show();
							$("#samplingMethod span").text("请选择").addClass("text-red").removeClass("text-hui");

							// 更新采集方法的值
							$("#yzxdCJFF ul").empty("li");
							for(var cjffii=0; cjffii < responseTxt.Result[JsonObject].CJFF.ITEM.length; cjffii++){
								$("#yzxdCJFF ul").append('<li data-cjffid="'+responseTxt.Result[JsonObject].CJFF.ITEM[cjffii].ID+'">'+responseTxt.Result[JsonObject].CJFF.ITEM[cjffii].MC+'</li>');
							}
							// 采集方法点击事件
							hammeryzxdCJFFF = $("#yzxdCJFF ul li").hammer();
							hammeryzxdCJFFF.on("tap",function(ev){
								var cjffID = $(this).attr("data-cjffid");
								yzxdCJFFFunction(this,cjffID);	
							});

						}else{
							$("#samplingMethod").hide();
						}

						// 采集科室
						if(plan.cjks == "show"){
							$("#AcquisitionDepartment").show();
							$("#AcquisitionDepartment span").text("请选择").addClass("text-red").removeClass("text-hui");

						}else{
							$("#AcquisitionDepartment").hide();
						}

						// 执行科室
						if(plan.zxks == "show"){
							$("#ExecutiveDepartments").show();
							// 更新执行科室的值
							$("#yzxdZXKS ul").empty("li");
							for(var zxksii=0; zxksii < responseTxt.Result[JsonObject].ZXKS.ITEM.length; zxksii++){
								if(responseTxt.Result[JsonObject].ZXKS.ITEM[zxksii].ZLXMID == ypID ){
									$("#yzxdZXKS ul").append('<li data-zxksid="'+responseTxt.Result[JsonObject].ZXKS.ITEM[zxksii].ID+'">'+responseTxt.Result[JsonObject].ZXKS.ITEM[zxksii].MC+'</li>');
								}
							}
							// 如果执行科室只有一个，则更新默认为当前这一个执行科室
							if($("#yzxdZXKS ul").find("li").length==1){
								$("#ExecutiveDepartments span").attr("data-zxksid",$("#yzxdZXKS ul li").attr("data-zxksid"));
								$("#ExecutiveDepartments span").text($("#yzxdZXKS ul li").text()).removeClass("text-red text-hui");
							}else{
								$("#ExecutiveDepartments span").text("请选择").addClass("text-red").removeClass("text-hui");
							}
							// 执行科室点击事件
							hammeryzxdZXKSS = $("#yzxdZXKS ul li").hammer();
							hammeryzxdZXKSS.on("tap",function(ev){
								yzxdZXKSFunction($(this));	
							});

						}else{
							$("#ExecutiveDepartments").hide();
						}
					
						// 总量
						if(plan.zl == "show"){
							$("#total").show();
							if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 5 || responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB == 6){
								$("#total span").text(0).addClass("text-red").removeClass("text-hui");
								$("#total small").text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYDW==null?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYDW);
								$("#totalFunction p").text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYDW==null?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYDW);
								$("#countResult-zl").text(0);
							}else if(plan.zl_mr==1){ // 默认为1 不可修改
								$("#total span").text(1).removeClass("text-red").addClass("text-hui");
								$("#total").removeClass("eventQY");
								$("#total small").text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW==null?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW);
							}else{
								$("#total span").text(1).removeClass("text-hui text-red");
								$("#total small").text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW==null?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW);
								$("#totalFunction p").text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW==null?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW);
								$("#countResult-zl").text(1);
							}
						}else{
							$("#total").hide();
						}

						// 天数
						if(plan.ts == "show"){
							$("#NumberOfDays").show();
							$("#NumberOfDays span").text("1").removeClass("text-hui text-red");
							$("#countResult-ts").text("1");
						}else{
							$("#NumberOfDays").hide();
						}

						// 单量
						if(plan.dl == "show"){

							var DlJsdw;
							if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW == null){
								DlJsdw="";
							}else{
								DlJsdw=responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSDW;
							}

							$("#Milligram").show();                 
							$("#boxCount p").text(DlJsdw);
							$("#countResult").text("0");
							//$(".countbox-botton").css("background","rgb(40, 42, 57)");

							// 更新单量的默认值、单位 和 住院包装*计量系数的值
							//$("#Milligram span").text("0").addClass("text-red").attr("id","zybzjlxs"+ (responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JLXS * responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYBZ));
							$("#Milligram span").text("0").addClass("text-red").attr("id","zybzjlxs"+responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JLXS);
							$("#Milligram small").text(DlJsdw);
						}else{
							$("#Milligram").hide();     
						}
					
						// 给药执行
						if(plan.gyzx == "show"){
							$("#ToPerform").show();                
							$("#ToPerform span").text("请选择").addClass("text-red").removeClass("text-hui");
							$("#yzxdGYZX-UL").empty("li");
						}else{
							$("#ToPerform").hide();    
						}
					
						// 发药药房
						if(plan.fyyf == "show"){
							$("#pharmacy").show();
							//海南数据结构的变化处理
                              if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0]){
								  $("#pharmacy span").attr("data-yfid",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM[0].ID).text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM[0].MC);
							$("#yzxdFYYF ul").empty("li");
							// 更新发药药房的值 
							for(var yfi = 0; yfi < responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM.length; yfi++){
								$("#yzxdFYYF ul").append('<li data-yfid="'+responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM[yfi].ID+'">'+ responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF[0].ITEM[yfi].MC +'</li>');
							}
							  }else{
								  $("#pharmacy span").attr("data-yfid",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM[0].ID).text(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM[0].MC);
							$("#yzxdFYYF ul").empty("li");
							// 更新发药药房的值 
							for(var yfi = 0; yfi < responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM.length; yfi++){
								$("#yzxdFYYF ul").append('<li data-yfid="'+responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM[yfi].ID+'">'+ responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FYYF.ITEM[yfi].MC +'</li>');
							}
							  }							
							
							
							// 发药药房点击事件
							hammeryzxdFYYF = $("#yzxdFYYF ul li").hammer();
							hammeryzxdFYYF.on("tap",function(ev){
								yzxdFYYFFunction($(this));
								//根据药房更换库存量
								totalDoseInfo(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].YPID,$(this).attr("data-yfid"));
							});
						}else{
							$("#pharmacy").hide();   
							$("#pharmacy span").attr("data-yfid","").text("");
						}
					
						// 执行性质
						if(plan.zxxz == "show"){
							$("#PerformTheNature").show();          
							$("#PerformTheNature span").text("正常").removeClass("text-hui");
							$("#yzxdZXXZ ul li").css("background","rgb(40, 42, 57)");
						}else{
							$("#PerformTheNature").hide();     
						}

					}/*if(editValue == true){ }else*/
					// 更新执行频率的值 如果传过来的适用范围只有-2，则判断编码BM完全等于"-02"，加载出来
					if(plan.syfw.length==1 && plan.syfw[0]=="-2"){
						for(var zxpci=0; zxpci<responseTxt.Result[JsonObject].ZXPC.ITEM.length; zxpci++){
							if(responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].SYFW=="-2" && responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].BM=="-02"){
								$("#yzxdZXPL ul").append('<li class="syfw'+ responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].SYFW +'" id="'+ responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].BM +'" data-jgdw="'+responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].JGDW+'" data-pljg="'+responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].PLJG+'" data-plcs="'+responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].PLCS+'">'+ responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].MC +'</li>');
								// 默认执行频率
								$("#executeHz span").text(responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].MC).removeClass("text-hui text-red").attr("data-jgdw",responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].JGDW).attr("data-pljg",responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].PLJG).attr("data-syfw",responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].SYFW).attr("data-plcs",responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].PLCS);
								break;
							}
						}
					}else{
						for(var zxpci=0; zxpci<responseTxt.Result[JsonObject].ZXPC.ITEM.length; zxpci++){
							for(var plani=0; plani<plan.syfw.length; plani++){
								if(responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].SYFW == plan.syfw[plani] ){
									$("#yzxdZXPL ul").append('<li class="syfw'+ responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].SYFW +'" id="'+ responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].BM +'" data-jgdw="'+responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].JGDW+'" data-pljg="'+responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].PLJG+'" data-plcs="'+responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].PLCS+'">'+ responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].MC +'</li>');
									break;
								}
							}
							// 根据适用范围默认值更新默认的执行频率
							if(plan.syfw_mr==responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].SYFW){
								if((plan.syfw_mr==-2 && responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].BM=="-02")||plan.syfw_mr!==-2){
									$("#executeHz span").text(responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].MC).removeClass("text-hui text-red").attr("data-jgdw",responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].JGDW).attr("data-pljg",responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].PLJG).attr("data-syfw",responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].SYFW).attr("data-plcs",responseTxt.Result[JsonObject].ZXPC.ITEM[zxpci].PLCS);
								}
							}
						}
					}
					//执行频率动画示意
					$("#yzxdZXPL li").on("touchstart touchmove",function(){
						utils.CpStartback($(this));
					});
					$("#yzxdZXPL li").on("touchend",function(){
						utils.CpEnd($(this));
					});
					// 更新当前医嘱项目的判断规则数据
					$("#yzxdTwoJiHeight").attr("data-lb",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].LB);
					$("#yzxdTwoJiHeight").attr("data-czlx",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX==undefined?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].CZLX);
					$("#yzxdTwoJiHeight").attr("data-zxpl",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL==undefined?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZXPL);
					$("#yzxdTwoJiHeight").attr("data-jsfs",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS==undefined?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].JSFS);							
					
					// 更新住院包装的值
					$("#yzxdTwoJiHeight").attr("data-zybz",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYBZ==undefined?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].ZYBZ);	
					
					// 更新药品分零标志的值 flsx
					$("#yzxdTwoJiHeight").attr("data-flsx",responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FLSX==undefined?"":responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].FLSX);
					$.each(responseTxt.Result[JsonObject].ITEMLIST.ITEM,function(n,thisZxpc1){
						if(thisZxpc1.YPID==responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].YPID){
							$("#yzxdTwoJiHeight").attr("data-bwm",thisZxpc1.BWM);
							return false;
						}
					});
					// 注册执行频率事件
					var hammerZxplLi = $("#yzxdZXPL ul li").hammer();
					hammerZxplLi.on("tap",function(){
						selectZxplLi(responseTxt,$(this));
					});

					// 加载给药途径
					function updateGytj(){
						$("#yzxdGYTJ ul").empty("li");
						// 更新给药途径的值
						for(var gytji=0; gytji < responseTxt.Result[JsonObject].GYTJ.ITEM.length; gytji++){
							if(responseTxt.Result[JsonObject].GYTJ.ITEM[gytji].MC == $("#drugWay span").text()){
								$("#yzxdGYTJ ul").append('<li data-pyjm="'+responseTxt.Result[JsonObject].GYTJ.ITEM[gytji].PYJM+'" class="active_gytj" id="'+ responseTxt.Result[JsonObject].GYTJ.ITEM[gytji].ID +'" data-zxfl="'+responseTxt.Result[JsonObject].GYTJ.ITEM[gytji].ZXFL+'">'+ responseTxt.Result[JsonObject].GYTJ.ITEM[gytji].MC +'</li>');
							}else{
								$("#yzxdGYTJ ul").append('<li data-pyjm="'+responseTxt.Result[JsonObject].GYTJ.ITEM[gytji].PYJM+'" id="'+ responseTxt.Result[JsonObject].GYTJ.ITEM[gytji].ID +'" data-zxfl="'+responseTxt.Result[JsonObject].GYTJ.ITEM[gytji].ZXFL+'">'+ responseTxt.Result[JsonObject].GYTJ.ITEM[gytji].MC +'</li>');
							}
						}
						// 注册事件
						var hammerGytjLi = $("#yzxdGYTJ ul li").hammer();
						hammerGytjLi.on("tap",function(){
							selectGytjLi(responseTxt,$(this));
						});
					}
					$("#yzxdGYTJ li").on("touchstart touchmove",function(){
						utils.CpStartback($(this));
					});
					$("#yzxdGYTJ li").on("touchend",function(){
						utils.CpEnd($(this));
					});

				} //yzxdKongJianShowHide
				
				// 用于追加申请副项的 函数
				function yzxdSQFX(){
					$(".sqfx").remove();

					// 如果是编辑状态
					if(editValue !== undefined){
						if( editValue.sqfx!== null ){
							$.each(editValue.sqfx,function(n,value){
								if(value.bt=="1"){
									if(value.nr==null || value.nr==""){
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.bt+'" data-xh="'+n+'" data-yxid="'+value.yxID+'"><font class="text-xh">※</font><font class="UlBt">'+value.xm+'</font><span class="text-red">请填写</span></li>');
									}else{
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.bt+'" data-xh="'+n+'" data-yxid="'+value.yxID+'"><font class="text-xh">※</font><font class="UlBt">'+value.xm+'</font><span>'+ value.nr +'</span></li>');
									}
								}else{
									if(value.nr==null || value.nr==""){
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.bt+'" data-xh="'+n+'" data-yxid="'+value.yxID+'"><font class="UlBt">'+value.xm+'</font><span class="text-red">请填写</span></li>');
									}else{
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.bt+'" data-xh="'+n+'" data-yxid="'+value.yxID+'"><font class="UlBt">'+value.xm+'</font><span>'+value.nr+'</span></li>');
									}
								}
								if(n==0){
									$("#yzxdYaoNR").find(".sqfx:first").addClass("margin-top-10");
								}
							});
							// 注册事件
							var hammersqfx = $("#yzxdYaoNR .sqfx").hammer();
							hammersqfx.on("tap",function(){
								$("#nrJCXM li").removeClass("active");
								$("#yzxdYaoNR > li").removeClass("xuanThis");
								//$("#timeStart").css("background","rgb(255,255,255)").css("color","rgb(0,0,0)");
								$(this).addClass("xuanThis");
								$(".yzxdKongJian").hide();
								$("#yzxdYSZT").show();
								$("#yzxdYSZT .textareaDiv").text($(this).children("span").text());
								$("#doctorTell").removeClass("textLR");  // 取消医生嘱托的录入状态
								$("#yzxdYaoNR .sqfx").removeClass("textLR");
								$(this).addClass("textLR"); 
							});
						}

					// 不是编辑状态
					}else{
						if(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].SQFX !== null){
							$.each(responseTxt.Result[JsonObject].ITEMLIST.ITEM[ypi].SQFX.ITEM,function(n,value){
								if(value.BT=="1"){
									if(value.NR==null||value.NR==""){
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.BT+'" data-xh="'+n+'" data-yxid="'+value.YSID+'"><font class="text-xh">※</font><font class="UlBt">'+value.XM+'</font><span class="text-red">请填写</span></li>');
									}else{
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.BT+'" data-xh="'+n+'" data-yxid="'+value.YSID+'"><font class="text-xh">※</font><font class="UlBt">'+value.XM+'</font><span>'+ value.NR +'</span></li>');
									}
								}else{
									if(value.NR==null||value.NR==""){
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.BT+'" data-xh="'+n+'" data-yxid="'+value.YSID+'"><font class="UlBt">'+value.XM+'</font><span class="text-red">请填写</span></li>');
									}else{
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.BT+'" data-xh="'+n+'" data-yxid="'+value.YSID+'"><font class="UlBt">'+value.XM+'</font><span>'+value.NR+'</span></li>');
									}
								}
								if(n==0){
									$("#yzxdYaoNR").find(".sqfx:first").addClass("margin-top-10");
								}
							});
							// 注册事件
							var hammersqfx = $("#yzxdYaoNR .sqfx").hammer();
							hammersqfx.on("tap",function(){
								$("#nrJCXM li").removeClass("active");
								$("#yzxdYaoNR > li").removeClass("xuanThis");
								//$("#timeStart").removeClass("text-hui");
								$(this).addClass("xuanThis");
								$(".yzxdKongJian").hide();
								$("#yzxdYSZT").show();
								$("#yzxdYSZT .textareaDiv").text($(this).children("span").text());
								$("#doctorTell").removeClass("textLR");  // 取消医生嘱托的录入状态
								$("#yzxdYaoNR .sqfx").removeClass("textLR");
								$(this).addClass("textLR"); 
							});
						}
					}
				}//yzxdSQFX

				// 给编辑默认值初始为空 以免编辑后重新赋值
				editValue = undefined;

				break;
						
			}/*if(==ypID)*/
		}/*for*/

		// 采集方法
		function yzxdCJFFFunction(thisID,cjffID){

			$("#yzxdCJFF ul li").css("background","rgb(40, 42, 57)");
			$(thisID).css("background","rgb(81, 82, 93)");
			$("#samplingMethod > span").text($(thisID).text()).removeClass("text-red").removeClass("text-hui");
			$("#samplingMethod > span").attr("data-cjffid",cjffID);

			// 更新采集科室的值
			for(var i=0; i<responseTxt.Result[JsonObject].CJFF.ITEM.length; i++ ){
				if(responseTxt.Result[JsonObject].CJFF.ITEM[i].ID == cjffID){
					$("#yzxdCJKS ul").empty("li");
					for(var ii=0; ii<responseTxt.Result[JsonObject].CJFF.ITEM[i].CJKS.ITEM.length; ii++){
						$("#yzxdCJKS ul").append('<li data-cjksid="'+responseTxt.Result[JsonObject].CJFF.ITEM[i].CJKS.ITEM[ii].ID+'">'+responseTxt.Result[JsonObject].CJFF.ITEM[i].CJKS.ITEM[ii].MC+'</li>');
					}
					// 默认第一个采集科室
					$("#AcquisitionDepartment span").attr("data-cjksid",responseTxt.Result[JsonObject].CJFF.ITEM[i].CJKS.ITEM[0].ID).text(responseTxt.Result[JsonObject].CJFF.ITEM[i].CJKS.ITEM[0].MC).removeClass("text-red text-hui");

					// 给采集科室注册点击事件
					hammeryzxdCJKS = $("#yzxdCJKS ul li").hammer();
					hammeryzxdCJKS.on("tap",function(ev){
						yzxdCJKSFunction(this);	
					});

					break;
				}
			}

		}
		//医嘱复制触碰示意
		utils.docActLiTouch();
	
	}

	// 选择 给药途径
	function selectGytjLi(responseTxt,thisLi){

		// JSON 对象 开头对象名 成套和非成套不一样 
		var JsonObject="";	

		// 如果是成套
		if($("#yzxd-name").attr("name").indexOf("ct") != -1){
			JsonObject="CTDETAIL";
		// 如果不是成套
		}else{
			JsonObject="OUTPUT";
		}

		// 如果ZXFL==1，则显示滴速
		if(thisLi.attr("data-zxfl")==1){
			if($("#diSu").is(":hidden")){
				$("#diSu").show();
				$("#diSu input").val("0").addClass("text-red");
			}
		}else{
			$("#diSu").hide();
			$("#diSu input").val("").removeClass("text-red");
		}

		$("#yzxdGYTJ ul li").removeClass("active_gytj");
		thisLi.addClass("active_gytj");
		$("#drugWay > span").text(thisLi.text()).attr("data-gytjid",thisLi.attr("id")).removeClass("text-red");

		// 更新给药执行的值
		var gytjDomID = thisLi.attr("id");
		$("#yzxdGYZX ul").empty("li");

		for(var i=0; i< responseTxt.Result[JsonObject].GYTJ.ITEM.length; i++){
			if( responseTxt.Result[JsonObject].GYTJ.ITEM[i].ID == gytjDomID && responseTxt.Result[JsonObject].GYTJ.ITEM[i].GYZX !== null){
				for(var ii=0; ii<responseTxt.Result[JsonObject].GYTJ.ITEM[i].GYZX.ITEM.length; ii++){
					$("#yzxdGYZX ul").append('<li data-gyzxid="'+responseTxt.Result[JsonObject].GYTJ.ITEM[i].GYZX.ITEM[ii].ID+'">'+ responseTxt.Result[JsonObject].GYTJ.ITEM[i].GYZX.ITEM[ii].MC +'</li>');
				}
				// 更新给药执行默认值
				$("#ToPerform span").attr("data-gyzxid",responseTxt.Result[JsonObject].GYTJ.ITEM[i].GYZX.ITEM[0].ID).text(responseTxt.Result[JsonObject].GYTJ.ITEM[i].GYZX.ITEM[0].MC).removeClass("text-red");

				// 追加成功后给每个LI绑定Hammer事件
				hammeryzxdGYZX = $("#yzxdGYZX ul li").hammer();
				hammeryzxdGYZX.on("tap",function(ev){
					yzxdGYZXFunction($(this));
				});
				break;
			}else if(responseTxt.Result[JsonObject].GYTJ.ITEM[i].ID == gytjDomID && responseTxt.Result[JsonObject].GYTJ.ITEM[i].GYZX == null){
				$("#yzxdGYZX ul").empty("li");
				// 更新给药执行默认值
				$("#ToPerform span").text("请选择").addClass("text-red");
				break;
			}
					
		}//for

	}

	// 给药执行
	function yzxdGYZXFunction(thisID){
		$("#yzxdGYZX ul li").css("background","rgb(40, 42, 57)");
		$(thisID).css("background","rgb(81, 82, 93)");
		$("#ToPerform span").attr("data-gyzxid",thisID.attr("data-gyzxid")).text(thisID.text()).removeClass("text-red");
	}

	// 点击执行频率 是否显示时间方案
	function selectZxplLi(responseTxt,thisLi){
		$("#yzxdZXPL ul li").css("background","#282a39").removeClass("active");
		thisLi.css("background","#51525d").addClass("active");
		$("#executeHz > span").text(thisLi.text()).removeClass("text-red").attr("data-jgdw",thisLi.attr("data-jgdw")).attr("data-pljg",thisLi.attr("data-pljg")).attr("data-syfw",thisLi.attr("class").replace("syfw","").replace(" active","")).attr("data-plcs",thisLi.attr("data-plcs"));
		// 适用范围 == 1，则显示时间方案
		if(thisLi.hasClass("syfw1")){
			$("#TimeToPlan").show();
			$("#timePlan_SRUL").empty("li");
			$("#timePlan_MRUL").empty("li");

			// 更新默认值  -------------------------------------------------------------------
			
			// 如果是成套
			var JsonObject="";
			if($("#yzxd-name").attr("name").indexOf("ct") != -1){
				JsonObject="CTDETAIL";
			// 如果不是成套
			}else{
				JsonObject="OUTPUT";
			}

			$("#timePlan .srmr").empty("li");			
			var bm = thisLi.attr("id");
			
					var yj = "";  // 判断依据 为true，则表示通过ID找到了；为false,则表示通过编号找到了；否则就都没找到。
					var plcs;     // 根据编号查找的频率次数 方便追加要录入时间方案的个数
					for(var sjfai=1; sjfai <= responseTxt.Result[JsonObject].ZXPC.ITEM.length; sjfai++){
						if(responseTxt.Result[JsonObject].ZXPC.ITEM[sjfai].BM == bm){
							plcs = responseTxt.Result[JsonObject].ZXPC.ITEM[sjfai].PLCS;
							// 判断是否显示首日
							var qx_nowYz="";  // 新开就取选中的期效，编辑则取数据返回的期效
							if(responseTxt.Result[JsonObject].YZLIST){
								qx_nowYz=responseTxt.Result[JsonObject].YZLIST.YZ[0].YZQX=="0"?"长期医嘱":"临时医嘱";
							}else{
								qx_nowYz=$("#yzxdCL .active").text();
							}
							if(responseTxt.Result[JsonObject].ZXPC.ITEM[sjfai].JGDW == "天" && responseTxt.Result[JsonObject].ZXPC.ITEM[sjfai].PLJG == 1 &&　qx_nowYz　== "长期医嘱"){
								$("#timePlan_SR").removeClass("display-none");
								$("#timePlan_SRUL").removeClass("display-none");
								$("#timePlan_MR").removeClass("display-none");
							}else{
								$("#timePlan_SR").addClass("display-none");
								$("#timePlan_SRUL").addClass("display-none");
								$("#timePlan_MR").addClass("display-none");
							}
							
							if(responseTxt.Result[JsonObject].ZXPC.ITEM[sjfai].PLJG > 1 && responseTxt.Result[JsonObject].ZXPC.ITEM[sjfai].JGDW == "天"){
								$("#timePlan .timeJG").text("_/__:__");
							}else{
								$("#timePlan .timeJG").text("__:__");
							}

							break;
						}
						
					}
					var fjjg = {srday:[],srtime:[],mrday:[],mrtime:[]};
					if(responseTxt.Result[JsonObject].ZXPC.MRPCFA){ //没默认时间节点
						for(var sjfaii=0; sjfaii < responseTxt.Result[JsonObject].ZXPC.MRPCFA.ITEM.length; sjfaii++){
							if($("#yzxdGYTJ ul").find(".active_gytj").attr('id') != undefined && responseTxt.Result[JsonObject].ZXPC.MRPCFA.ITEM[sjfaii].GYTJID == $("#yzxdGYTJ ul").find(".active_gytj").attr('id') && responseTxt.Result[JsonObject].ZXPC.MRPCFA.ITEM[sjfaii].BM == bm){
								//console.log("通过ID找到了："+responseTxt.OUTPUT.ZXPC.MRPCFA.ITEM[sjfaii].SJFA);
								$("#TimeToPlan span").text(responseTxt.Result[JsonObject].ZXPC.MRPCFA.ITEM[sjfaii].SJFA).removeClass("text-red").removeClass("text-hui");
								fjjg = utils.timePlanFJ(responseTxt.Result[JsonObject].ZXPC.MRPCFA.ITEM[sjfaii].SJFA);
								yj=true;
								break;
							}
							yj=false;
						}
						if(yj == false){
							for(var sjfaiii=0; sjfaiii < responseTxt.Result[JsonObject].ZXPC.MRPCFA.ITEM.length; sjfaiii++){
								if(responseTxt.Result[JsonObject].ZXPC.MRPCFA.ITEM[sjfaiii].BM == bm){
									//console.log("通过编号找到了："+responseTxt.OUTPUT.ZXPC.MRPCFA.ITEM[sjfaiii].SJFA);
									$("#TimeToPlan span").text(responseTxt.Result[JsonObject].ZXPC.MRPCFA.ITEM[sjfaiii].SJFA).removeClass("text-red").removeClass("text-hui");
									fjjg = utils.timePlanFJ(responseTxt.Result[JsonObject].ZXPC.MRPCFA.ITEM[sjfaiii].SJFA);
									yj=true;
									break;
								}
							}
						}
					}
					if(yj == ""){
						$("#TimeToPlan span").text("请录入").addClass("text-red").removeClass("text-hui");
					}

									
					for(var sjfai=0; sjfai < plcs; sjfai++){
						
						// 更新首日 默认值
						if(!($("#timePlan_SRUL").hasClass("display-none"))){
							if(fjjg.srtime.length > 0){
								$("#timePlan_SRUL").append('<li><span>'+ (sjfai+1) +'</span><label class="day">'+ (fjjg.srday[sjfai] == undefined ? "":fjjg.srday[sjfai]) +'</label><label class="time">'+ (fjjg.srtime[sjfai].indexOf(":")!=-1 ? fjjg.srtime[sjfai] : (fjjg.srtime[sjfai] + ':00') ) +'<label></li>');
							}else{
								$("#timePlan_SRUL").append('<li><span>'+ (sjfai+1) +'</span></li>');
							}
						}

						// 更新每日 默认值
						if(fjjg.mrtime.length > 0){
							$("#timePlan_MRUL").append('<li><span>'+ (sjfai+1) +'</span><label class="day">'+ (fjjg.mrday[sjfai] == undefined ? "":fjjg.mrday[sjfai]) +'</label><label class="time">'+ (fjjg.mrtime[sjfai].indexOf(":")!=-1 ? fjjg.mrtime[sjfai] : (fjjg.mrtime[sjfai] + ':00') ) +'<label></li>');
						}else{
							$("#timePlan_MRUL").append('<li><span>'+ (sjfai+1) +'</span></li>');
						}
						
					}

			/*-----------------------------------------------------------------------------------*/
		}else{
			$("#TimeToPlan").hide();
			$("#TimeToPlan span").text("");
		}
		
		// 根据计算条件判断总量是否可修改
		var jsfs=$("#yzxdTwoJiHeight").attr("data-jsfs");
		var czlx=$("#yzxdTwoJiHeight").attr("data-czlx");
		var qx=$("#yzxdTwoJiHeight").attr("data-qx");
		var lb=$("#yzxdTwoJiHeight").attr("data-lb");
		var zxpl=$("#yzxdTwoJiHeight").attr("data-zxpl");
		if((lb=="E"||lb=="Z") && qx=="临时医嘱" && (czlx=="0"||czlx=="5") && zxpl=="0" && jsfs=="3"){

			// 适用范围 == -1，则总量为1，不可修改
			if(thisLi.hasClass("syfw-1")){
				$("#total span").text(1).removeClass("text-red").addClass("text-hui");
				$("#total").removeClass("eventQY");
			}else{
				if($("#total span").text()==""||$("#total span").text()==0){
					$("#total span").text(0).removeClass("text-hui").addClass("text-red");
				}else{
					$("#total span").removeClass("text-hui text-red");
				}
				$("#total").addClass("eventQY");
			}
		}

		// 如果是药品临嘱，适用范围等于1，则显示天数，否则隐藏
		if(qx=="临时医嘱"&&(lb=="5"||lb=="6")){
			if(thisLi.hasClass("syfw1")){
				$("#NumberOfDays").show();
				$("#NumberOfDays span").text(1).removeClass("text-red text-hui");
			}else{
				$("#NumberOfDays").hide();
				$("#NumberOfDays span").text("");
			}
		}
	}

	// 医嘱复制和医嘱编辑 加载开医嘱时需要录入的药品信息
	function loadFuZhi(ypID,zjID,editValue,responseTxt){
		$("#yzxdYaoNR li").hide();
		$("#yzxdYaoNR li span").text("");
		$("#yzxdYaoNR").show();

		$("#nrJYXM").empty("li").hide();
		$("#nrJCXM").empty("li").hide();

		//清空所有缓存的数据和ID值
		$("#yzxdYaoNR li span").text("");
		$("#Milligram small").text("");
		$("#total small").text("");
		$("#yzxdYaoNR li").removeClass("xuanThis");
		$("#appDateTime").removeClass("text-hui");
		$("#yzxdYaoNR li span").attr("data-gytjid","").attr("data-yfid","").attr("data-cjksid","").attr("data-gyzxid","").attr("data-zxksid","").attr("data-cjffid","");
		
		//console.log(responseTxt);
		for(var ypi = 0 ; ypi < responseTxt.Result.OUTPUT.YZLIST.YZ.length; ypi++){
			if(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ID == ypID){

				var kjShowHide = {
					gytj:"",
					zl:"",
					ts:"",
					dl:"",
					gyzx:"",
					cjks:"",
					fyyf:"",
					zxks:"",
					zxxz:"",
					cjff:"",
					syfw:[]                       // 执行频率适用范围
				}
						
				$("#buttonaddJYXM").hide();
				$("#buttonaddJCXM").hide();
				$("#yzxdTwoJi p").hide();
                //请求库存量,编辑医嘱，editValue.ybID
				$("#totalDose").show();
				// 判断抗生素用药等级
				var yaoLB = responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB;
				if(yaoLB==5 || yaoLB==6){
					//解决平板编辑后又来PC修改
					if($("#yzxdYaoPin li.active label").attr("id")){
						totalDoseInfo($("#yzxdYaoPin li.active label").attr("id"),editValue.yfID);
					}else{
						totalDoseInfo(editValue.YPID,editValue.yfID);
					}

				}else{
					$("#totalDose").hide();
				}
				if((yaoLB==5 || yaoLB==6) && editValue==undefined){

					// 寻找抗生素值
					var editDataList = responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ITEMLIST.ITEM;
					for(var edi in editDataList){
						if(editDataList[edi].ZLXMID==editValue.xmID){
							var yao_KSS = editDataList[edi].KSS;
							var yao_YYMD = editDataList[edi].YYMD;
							var yao_YYLY = editDataList[edi].YYLY;
							var mr_Data = {yymd:yao_YYMD,yyly:yao_YYLY};
							antibiotics(yao_KSS,mr_Data);
							break;
						}
					}
				}else if((yaoLB==5 || yaoLB==6) && editValue!==undefined){
					// 寻找抗生素值
					var editDataList = responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ITEMLIST.ITEM;
					for(var edi in editDataList){
						if(editDataList[edi].ZLXMID==editValue.xmID){
							var yao_KSS = editDataList[edi].KSS;
							var yao_YYMD = editValue.yymd;
							var yao_YYLY = editValue.yyly;
							var mr_Data = {yymd:yao_YYMD,yyly:yao_YYLY};
							antibiotics(yao_KSS,mr_Data);
							break;
						}
					}
				}

				// 如果是一并追加的药
				if(zjID.ID!="" && ( responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == 5 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == 6 ) ){

					// 是否紧急
					$("#emergency").show();
					$("#emergency").removeClass("eventQY");
					zjID.sfjj=="yes" ? $("#icnYes").show().addClass("text-hui") : $("#icnYes").hide().removeClass("text-hui");

					// 开始时间
					$("#startTimeLi").show().removeClass("eventQY");
					$("#appDateTime").text(zjID.kssj).addClass("text-hui");

					// 执行频率
					$("#executeHz").show().removeClass("eventQY");
					$("#executeHz span").text(zjID.zxpl).removeClass("text-red").addClass("text-hui");
					$("#yzxdZXPL ul").empty("li"); 

					// 医生嘱托
					$("#doctorTell").show();
					$("#doctorTell span").text("请填写").addClass("text-red");

					// 时间方案
					if(zjID.sjfa!="" && zjID.sjfa!==null){
						$("#TimeToPlan").removeClass("eventQY");
						$("#TimeToPlan").show();
						$("#TimeToPlan span").text(zjID.sjfa).removeClass("text-red").addClass("text-hui");
					}else{
						$("#TimeToPlan").hide();
					}

					// 总量
					if(zjID.zl !== "" && zjID.zl !== undefined && zjID.zl !== "undefined"){
						$("#total").show();
						$("#total span").text(0).addClass("text-red");
						$("#total small").text(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZYDW);
						$("#totalFunction p").text(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZYDW);
						$("#countResult-zl").text(0);
					}else{
						$("#total").hide();
					}

					// 天数
					if(zjID.ts !== "" && zjID.ts !== undefined && zjID.ts !== "undefined"){
						$("#NumberOfDays").show().removeClass("eventQY");
						$("#NumberOfDays span").text(zjID.ts).addClass("text-hui").removeClass("text-red");
					}else{
						$("#NumberOfDays").hide();
					}
	
					// 给药途径
					if(zjID.gytj!=""){
						$("#drugWay").removeClass("eventQY");
						$("#drugWay").show();
						$("#drugWay span").text(zjID.gytj).attr("data-gytjid",zjID.gytjID).removeClass("text-red").addClass("text-hui");
					}else{
						$("#drugWay").hide();
					}

					// 给药执行
					if(zjID.gyzx!=""){
						$("#ToPerform").removeClass("eventQY");
						$("#ToPerform").show();
						$("#ToPerform span").text(zjID.gyzx).attr("data-gyzxid",zjID.gyzxID).removeClass("text-red").addClass("text-hui");
					}else{
						$("#ToPerform").hide();
					}

					// 执行性质
					if(zjID.zxxz!=""){
						$("#PerformTheNature").removeClass("eventQY");
						$("#PerformTheNature").show();
						$("#PerformTheNature span").text(zjID.zxxz).removeClass("text-red").addClass("text-hui");
					}else{
						$("#PerformTheNature").hide();
					}
	
					// 单量
					$("#Milligram").show();
					$("#boxCount p").text(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].JSDW);
					$("#countResult").text("0");
					//$(".countbox-botton").css("background","rgb(40, 42, 57)");
					//$("#Milligram span").text("0").addClass("text-red").attr("id","zybzjlxs"+ (responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].JLXS * responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].ZYBZ));
					$("#Milligram span").text("0").addClass("text-red").attr("id","zybzjlxs"+ responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].JLXS);
					$("#Milligram small").text(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].JSDW);

					// 滴速
					if(zjID.ds!=""){
						$("#diSu").removeClass("eventQY");
						$("#diSu").show();
						$("#diSu input").val(zjID.ds).removeClass("text-red").addClass("text-hui");
					}else{
						$("#diSu").hide();
					}

					// 发药药房
					$("#pharmacy").show();
					$("#pharmacy span").attr("data-yfid",responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].FYYF.ITEM[0].ID).text(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].FYYF.ITEM[0].MC);
					$("#yzxdFYYF ul").empty("li"); 

					// 更新发药药房的值 
					for(var yfii = 0; yfii < responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].FYYF.ITEM.length; yfii++){
						$("#yzxdFYYF ul").append('<li data-yfid="'+responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].FYYF.ITEM[yfii].ID+'">'+ responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ypi].FYYF.ITEM[yfii].MC +'</li>');
					}
					// 发药药房点击事件
					hammeryzxdFYYFybzjC = $("#yzxdFYYF ul li").hammer();
					hammeryzxdFYYFybzjC.on("tap",function(ev){
						yzxdFYYFFunction($(this));	
					});

				// 如果是药品 长嘱
				}else if( zjID.ID=="" && ( responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == 5 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == 6 ) && editValue.yzfl=="长期医嘱" ){
					
					//console.log("是药品 长嘱");
					kjShowHide = {
						gytj:"show",
						zl:"hide",
						ts:"hide",
						dl:"show",
						gyzx:"show",
						cjks:"hide",
						fyyf:"show",
						zxks:"hide",
						zxxz:"show",
						cjff:"hide",
						syfw:[1,-3]                       // 执行频率适用范围
					}
					yzxdKongJianShowHide(kjShowHide);

				// 如果是药品 临嘱
				}else if( zjID.ID=="" && ( responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == 5 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == 6 ) && editValue.yzfl=="临时医嘱" ){
					
					//console.log("是药品 临嘱");
					kjShowHide = {
						gytj:"show",
						zl:"show",
						ts:"show",
						dl:"show",
						gyzx:"show",
						cjks:"hide",
						fyyf:"show",
						zxks:"hide",
						zxxz:"show",
						cjff:"hide",
						syfw:[1,-1,-5]                       // 执行频率适用范围
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是检查
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "D" ){
					if(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JCBW !== null){
						// 如果是编辑状态
						if(editValue !== undefined){
							// 加载检查部位的数据
							if(editValue.jcxm.length>0){
								for(var jcbwi=0; jcbwi<editValue.jcxm.length; jcbwi++){
									$("#nrJCXM").append('<li name="'+editValue.jcxm[jcbwi].jcxmffStr+'"><div style="width:80%; float:left;"><div class="max">'+editValue.jcxm[jcbwi].jcxmmc+'</div><div class="min text-lv" name="'+editValue.jcxm[jcbwi].jcxmDanDuo+'">'+editValue.jcxm[jcbwi].jcxmff+'</div></div><span class="fs1 text-26 color-hong" aria-hidden="true" data-icon=""></span></li>');
								}
								$("#nrJCXM").show();
								$("#buttonaddJCXM").show();
								$("#yzxdTwoJi p").text("已选择检查部位").removeClass("text-red").show();

								// 注册事件 删除检查项目
								$("#nrJCXM li span").unbind();
								hammeryzxdDellJCXM3 = $("#nrJCXM li span").hammer();
								hammeryzxdDellJCXM3.on("tap",function(){
									utils.yzxdDellJCXM($(this).parent());
								});

								// 注册时间 选择检查方法
								hammeryzxdSelFF = $("#nrJCXM li>div").hammer();
								hammeryzxdSelFF.on("tap",function(){
									utils.yzxdSelFF($(this).parent());
								});
							}
						}
					}else{
						$("#buttonaddJCXM").hide();
						$("#yzxdTwoJi p").text("").removeClass("text-red").hide();
					}

					

					kjShowHide = {
						gytj:"hide",
						zl:"show",
						zl_edit:false,   // 总量不可编辑
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5]                       // 执行频率适用范围
					}
					yzxdKongJianShowHide(kjShowHide);
					yzxdSQFX();
				// 如果是检验
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "C" ){
					
					// 如果是编辑状态
					if(editValue !== undefined){
						// 加载已选择的检验项目
						for(var jyxmi=0; jyxmi < editValue.jyxm.length; jyxmi++){
							$("#nrJYXM").append('<li name="'+editValue.jyxm[jyxmi].jyxmID+'" data-ybbl="'+editValue.jyxm[jyxmi].ybbl+'" data-ybmc="'+editValue.jyxm[jyxmi].ybmc+'" data-bbbw="'+editValue.jyxm[jyxmi].bbbw+'" data-czlx="'+editValue.jyxm[jyxmi].czlx+'" data-sgbh="'+editValue.jyxm[jyxmi].sgbh+'"><div style="width:80%; float:left;">'+editValue.jyxm[jyxmi].jyxmmc+'</div><span class="fs1 text-26 color-hong" aria-hidden="true" data-icon=""></span></li>');
						}
						$("#nrJYXM").show();
						$("#buttonaddJYXM").show();
						$("#yzxdTwoJi p").text("已选择检验项目").removeClass("text-red").show();
						$("#yzxd-name").text("标本："+editValue.jyxm[0].bbbw);
						// 注册事件
						hammerjyxmNR = $("#nrJYXM li span").hammer();
						hammerjyxmNR.on("tap",function(){
							yzxdJCXMdell($(this));
						});
					}

					kjShowHide = {
						gytj:"hide",
						zl:"show",
						zl_edit:false,       // 总量不可编辑
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"show",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"show",
						syfw:[-1,-5]                       // 执行频率适用范围
					}
					yzxdKongJianShowHide(kjShowHide);
					yzxdSQFX();

				
				// 如果是治疗 1	
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3 ){
					kjShowHide = {
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-3]                 
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 2
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 1 ){
					kjShowHide = {
						zl:"hide",
						dl:"show",
						gytj:"hide",						
						ts:"hide",								
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-3]             
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 3
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2 ){
					kjShowHide = {
						zl:"hide",
						dl:"show",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-3]           
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 4
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3 ){
					kjShowHide = {
						zl:"show",
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-1,-5]          
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 5
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 1 ){
					kjShowHide = {
						zl:"show",
						dl:"show",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-1,-5]          
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 6
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2 ){
					kjShowHide = {
						zl:"show",
						dl:"show",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-1,-5]           
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 7
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0 ){
					kjShowHide = {
						zl:"show",
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-1,-5]              
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 8
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0 ){
					kjShowHide = {
						zl:"hide",
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[1,-3]              
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 9
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3 ){
					kjShowHide = {
						zl:"hide",
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-2,-3,-4]          
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 10
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 1 ){
					kjShowHide = {
						zl:"hide",
						dl:"show",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-2,-3,-4]           
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 11
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2 ){
					kjShowHide = {
						zl:"hide",
						dl:"show",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-2,-3,-4]         
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 12
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="长期医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0 ){
					kjShowHide = {
						zl:"hide",
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-2,-3,-4]          
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 13
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3 ){
					kjShowHide = {
						zl:"show",
						zl_edit:false, 
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5]          
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 14
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 1 ){
					kjShowHide = {
						zl:"show",  
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5]          
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 15
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2 ){
					kjShowHide = {
						zl:"show",  
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5]            
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 16
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5) && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0 ){
					kjShowHide = {
						zl:"show",  
						dl:"hide",
						gytj:"hide",							
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5]          
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是治疗 17
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "E" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3 ){
					kjShowHide = {
						zl:"show",
						zl_edit:false, 
						dl:"hide",
						gytj:"hide",															
						ts:"hide",							
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						cjff:"hide",
						syfw:[-1,-5]           
					}
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   1
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-3]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   2,3
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 1||responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2)){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-3]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   4
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-3]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   8
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-1,-5]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   5
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-1,-5]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   6,7
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 &&( responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 1||responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2)){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-1,-5]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   9
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2,-3,-4]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   10,11
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 1||responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2)){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2,-3,-4]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   12
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2,-3,-4]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它 13
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						zl_edit:false,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1,-5]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是其它   14,15,16
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && (responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2||responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 1||responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0)){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1,-5]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是护理1 
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "H" && editValue.yzfl=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是护理2
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "H" && editValue.yzfl=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2,-3,-4]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是护理3
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "H" && editValue.yzfl=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-3]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是护理4
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "H" && editValue.yzfl=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 0 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[1,-1,-5]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是膳食1、2
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "I" && editValue.yzfl=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == null && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 &&( responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3 )){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是膳食3、4
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "I" && editValue.yzfl=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == null && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 &&( responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 1 ||responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 2 )){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"show",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱1
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 4 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱2
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 6 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						zl_edit:false,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱3
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 3 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						zl_edit:false,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱4
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 7 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						zl_edit:false,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱5
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 5 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						zl_edit:false,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱6
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 10 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱7
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 9 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱8
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 8 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						zl_edit:false,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱9
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="临时医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 11 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 1 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 3){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"show",
						zl_edit:false,
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-1]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱10
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 12 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				// 如果是特殊医嘱11
				}else if( zjID.ID=="" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB == "Z" && $("#yzxdCL").find(".active").text()=="长期医嘱" && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX == 14 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL == 2 && responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS == 0){
					kjShowHide = {
						cjff:"hide",
						gytj:"hide",
						zl:"hide",
						ts:"hide",
						dl:"hide",
						gyzx:"hide",
						cjks:"hide",
						fyyf:"hide",
						zxks:"show",
						zxxz:"hide",
						syfw:[-2]
					};
					yzxdKongJianShowHide(kjShowHide);
				}else{
					utils.showHide("参数有误，无法提供数据");
					if($("#yzxdBiaoTi font").text()=="医嘱编辑"){
						$("#buttonConfirm").hide();
					}
				}																																		
				// 用于判断显示哪些下达控件的 函数
				function yzxdKongJianShowHide(plan){
					
					$("#yzxdYaoNR li").addClass("eventQY");
					
					// 如果是编辑状态
					if(editValue !== undefined){
						
						// 如果是一并追加的药  
						if(editValue.ybID!=="" && $("#yzxdBiaoTi font").text()=="医嘱编辑"){
							
							// 判断当前编辑的药品是否是同组追加医嘱的第一条，第一条全部可编辑，后面的部分可编辑
							$("#yzDBCButtonNR li").each(function(){
								if($(this).attr("id") == editValue.ID){
									// 如果追加ID跟上一条的追加ID一样，只有部分可编辑
									if($(this).attr("name")==$(this).prev().attr("name")){
										editDocActYesNo("no","no");
									// 如果追加ID跟上一条的追加ID不一样，全部可编辑
									}else if($(this).attr("name")!==$(this).prev().attr("name")){
										editDocActYesNo("yes","no");
									}
									return false;
								}
							});
						// 如果是成套明细检查
						}else if(editValue.ybID!=="" && $("#yzxdBiaoTi font").text()=="成套医嘱编辑"){
							// 如果不是一并追加的药
							if($("#yzxdTwoJiChengTao").find(".activeJC").parent().find("span").eq(0).hasClass("selt")){
								editDocActYesNo("yes","yes");
							}else{
								editDocActYesNo("no","yes");
							}
						// 如果不是一并追加的药 全部可编辑
						}else{
							editDocActYesNo("yes","no");
						}

						
						function editDocActYesNo(YorN,mxJC){ //是否可编辑，是否是明细检查
						 
						// 滴速  
						if(mxJC=="no" || (editValue.ds!=="" && editValue.ds!==undefined && editValue.ds!=="undefined")){
							if(editValue.ds!=="" && editValue.ds!==undefined && editValue.ds!=="undefined"){
								$("#diSu").show();
								$("#diSu input").val(editValue.ds);
								if(YorN=="yes"){
									$("#diSu").addClass("eventQY");
									if(editValue.ds==0||editValue.ds=="0")
										$("#diSu input").removeClass("text-hui").addClass("text-red");
									else
										$("#diSu input").removeClass("text-hui text-red");
								}else{
									$("#diSu").removeClass("eventQY");
									$("#diSu input").removeClass("text-red").addClass("text-hui");
								}
								// 更新滴速选项背景色
								$("#yzxdDS ul li").css("background","rgb(40, 42, 57)");
								$("#yzxdDS ul li").each(function(){
									if($(this).text()==editValue.ds){
										$(this).css("background","rgb(81, 82, 93)");
										return false;
									}
								});
							}else{
								$("#diSu").hide();
							}
						}

						// 是否紧急
						$("#emergency").show();  
						editValue.sfjj == "yes" ? $("#icnYes").show() : $("#icnYes").hide();
						if(YorN=="yes"){
							$("#emergency").addClass("eventQY");
							$("#icnYes").removeClass("text-hui");
						}else{
							$("#emergency").removeClass("eventQY");
							$("#icnYes").addClass("text-hui");
						}
						
						// 开始时间
						$("#startTimeLi").show(); 
						$("#appDateTime").text(editValue.kssj);
						if(YorN=="yes"){
							$("#startTimeLi").addClass("eventQY");
							$("#appDateTime").removeClass("text-hui");
						}else{
							$("#startTimeLi").removeClass("eventQY");
							$("#appDateTime").addClass("text-hui");
						}

						// 医生嘱托
						$("#doctorTell").show(); 
						$("#doctorTell span").text(editValue.yszt).removeClass("text-red");

						// 执行频率
						$("#executeHz").show(); 
						$("#executeHz span").text(editValue.zxpl);
						$("#yzxdZXPL ul").empty("li"); 
						if(YorN=="yes"){
							$("#executeHz").addClass("eventQY");
							$("#executeHz span").removeClass("text-red text-hui");
						}else{
							$("#executeHz").removeClass("eventQY");
							$("#executeHz span").addClass("text-hui");
						}

						// 时间方案  这里差：分离时间方案的数据，有首日则更新时间方案控件里的首日数据和每日数据
						if(editValue.sjfa != ""){
							$("#TimeToPlan").show();
							$("#TimeToPlan span").text(editValue.sjfa);
							$("#timePlan_SRUL").empty("li");
							$("#timePlan_MRUL").empty("li");
							if(YorN=="yes"){
								$("#TimeToPlan").addClass("eventQY");
								$("#TimeToPlan span").removeClass("text-red text-hui");

								// 更新时间方案默认值
								if(editValue.sjfa == null){
									$("#TimeToPlan span").text("请录入").addClass("text-red").removeClass("text-hui");
									//用默认执行频次的中文值去查找时间方案的间隔频次
									for(var ctSjfa=0; ctSjfa < responseTxt.Result.OUTPUT.ZXPC.ITEM.length; ctSjfa++ ){
										if(editValue.zxpl == responseTxt.Result.OUTPUT.ZXPC.ITEM[ctSjfa].MC){
											//判断是否显示首日
											if(responseTxt.Result.OUTPUT.ZXPC.ITEM[ctSjfa].JGDW=="天" && responseTxt.Result.OUTPUT.ZXPC.ITEM[ctSjfa].PLJG==1){
												$("#timePlan_SR").removeClass("display-none");
												$("#timePlan_SRUL").removeClass("display-none");
												$("#timePlan_MR").removeClass("display-none");
											}else{
												$("#timePlan_SR").addClass("display-none");
												$("#timePlan_SRUL").addClass("display-none");
												$("#timePlan_MR").addClass("display-none");
											}

											if(responseTxt.Result.OUTPUT.ZXPC.ITEM[ctSjfa].PLJG > 1 && responseTxt.Result.OUTPUT.ZXPC.ITEM[ctSjfa].JGDW == "天"){
												$("#timePlan .timeJG").text("_/__:__");
											}else{
												$("#timePlan .timeJG").text("__:__");
											}
											break;
										}
									}
									
									if(responseTxt.Result.OUTPUT.ZXPC.ITEM[ctSjfa].PLCS>0){									
										// 根据频率次数追加 时间方案 天数按钮
										for(var ctPlcsi=0; ctPlcsi<responseTxt.Result.OUTPUT.ZXPC.ITEM[ctSjfa].PLCS; ctPlcsi++){
											// 更新首日 默认值
											if(!($("#timePlan_SRUL").hasClass("display-none"))){
												$("#timePlan_SRUL").append('<li><span>'+ (ctPlcsi+1) +'</span></li>');												
											}

											// 更新每日 默认值
											if(!($("#timePlan_MRUL").hasClass("display-none"))){
												$("#timePlan_MRUL").append('<li><span>'+ (ctPlcsi+1) +'</span></li>');
											}
										}
									}else{
										$("#TimeToPlan").hide();
										$("#TimeToPlan span").text("");
									}								
								}else{
									fjjg = utils.timePlanFJ(editValue.sjfa);
									$("#timePlan_SRUL").empty("li");
									$("#timePlan_MRUL").empty("li");
									for(var timei=0; timei<fjjg.mrtime.length; timei++){
										// 更新首日 默认值
										if(!($("#timePlan_SRUL").hasClass("display-none"))){
											if(fjjg.srtime.length > 0){
												$("#timePlan_SRUL").append('<li><span>'+ (timei+1) +'</span><label class="day">'+ (fjjg.srday[timei] == undefined ? "":fjjg.srday[timei]) +'</label><label class="time">'+ (fjjg.srtime[timei].indexOf(":")!=-1 ? fjjg.srtime[timei] : (fjjg.srtime[timei] + ':00') ) +'<label></li>');
											}else{
												$("#timePlan_SRUL").append('<li><span>'+ (timei+1) +'</span></li>');
											}
										}

										// 更新每日 默认值
										if(fjjg.mrtime.length > 0){
											$("#timePlan_MRUL").append('<li><span>'+ (timei+1) +'</span><label class="day">'+ (fjjg.mrday[timei] == undefined ? "":fjjg.mrday[timei]) +'</label><label class="time">'+ (fjjg.mrtime[timei].indexOf(":")!=-1 ? fjjg.mrtime[timei] : (fjjg.mrtime[timei] + ':00') ) +'<label></li>');
										}else{
											$("#timePlan_MRUL").append('<li><span>'+ (timei+1) +'</span></li>');
										}
									}					
								}
							}else if(YorN=="no" && editValue.sjfa==null){
								$("#TimeToPlan").hide();
								$("#TimeToPlan span").text("").removeClass("text-red text-hui");
							}else{
								$("#TimeToPlan").removeClass("eventQY");
								$("#TimeToPlan span").removeClass("text-red").addClass("text-hui");
							}
						}else{
							$("#TimeToPlan").hide();
							$("#TimeToPlan span").text("").removeClass("text-red text-hui");
						}

						// 给药途径
						if(plan.gytj == "show"){
							$("#drugWay").show();   
							if(editValue.gytjID==""){
								$("#drugWay span").text("请选择").attr("data-gytjid","").addClass("text-red");
							}else{
								$("#drugWay span").text(editValue.gytj).attr("data-gytjid",editValue.gytjID).removeClass("text-red");
							}
							if(YorN=="yes"){
								$("#drugWay").addClass("eventQY");
								$("#drugWay span").removeClass("text-hui"); 
								updateGytj();
							}else{
								$("#drugWay").removeClass("eventQY");
								$("#drugWay span").removeClass("text-red").addClass("text-hui");
							}

						}else{
							$("#drugWay").hide(); 
						}

						// 采集方法  
						if(plan.cjff == "show"){
							$("#samplingMethod").show();
							if(editValue.cjffID==""){
								$("#samplingMethod span").text("请选择").attr("data-cjffid","").addClass("text-red");
							}else{
								$("#samplingMethod span").text(editValue.cjff).attr("data-cjffid",editValue.cjffID).removeClass("text-red");
							}

							if(YorN=="yes"){
								$("#samplingMethod").addClass("eventQY");
								$("#samplingMethod span").removeClass("text-hui");
								// 更新采集方法的值
								$("#yzxdCJFF ul").empty("li");
								for(var cjffi=0; cjffi < responseTxt.Result.OUTPUT.CJFF.ITEM.length; cjffi++){
									$("#yzxdCJFF ul").append('<li data-cjffid="'+responseTxt.Result.OUTPUT.CJFF.ITEM[cjffi].ID+'">'+responseTxt.Result.OUTPUT.CJFF.ITEM[cjffi].MC+'</li>');
								}
								// 采集方法点击事件
								hammeryzxdCJFF = $("#yzxdCJFF ul li").hammer();
								hammeryzxdCJFF.on("tap",function(ev){
									var cjffID = $(this).attr("data-cjffid");
									yzxdCJFFFunction(this,cjffID);	
								});

							}else{
								$("#samplingMethod").removeClass("eventQY");
								$("#samplingMethod span").addClass("text-hui").removeClass("text-red");
							}

						}else{
							$("#samplingMethod").hide();
						}

						// 采集科室
						if(plan.cjks == "show"){
							$("#AcquisitionDepartment").show();
							$("#AcquisitionDepartment span").attr("data-cjksid",editValue.cjksID).text(editValue.cjks);
							
							if(YorN=="yes"){
								$("#AcquisitionDepartment").addClass("eventQY");
								$("#AcquisitionDepartment span").removeClass("text-red text-hui");
							}else{
								$("#AcquisitionDepartment").removeClass("eventQY");
								$("#AcquisitionDepartment span").addClass("text-hui");
							}
						}else{
							$("#AcquisitionDepartment").hide();
							$("#AcquisitionDepartment span").attr("data-cjksid","").text("");
						}

						// 执行科室
						if(plan.zxks == "show"){
							$("#ExecutiveDepartments").show();
							$("#ExecutiveDepartments span").attr("data-zxksid",editValue.zxksID).text(editValue.zxks);

							if(YorN=="yes"){
								$("#ExecutiveDepartments").addClass("eventQY");
								$("#ExecutiveDepartments span").removeClass("text-red text-hui");
								// 更新执行科室的值
								$("#yzxdZXKS ul").empty("li");
								if(responseTxt.Result.OUTPUT.ZXKS !== null){
									for(var zxksii=0; zxksii < responseTxt.Result.OUTPUT.ZXKS.ITEM.length; zxksii++){
										if(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB=="C"){
											if(responseTxt.Result.OUTPUT.ZXKS.ITEM[zxksii].ZLXMID == editValue.jyxm[0].jyxmID){
												$("#yzxdZXKS ul").append('<li data-zxksid="'+responseTxt.Result.OUTPUT.ZXKS.ITEM[zxksii].ID+'">'+responseTxt.Result.OUTPUT.ZXKS.ITEM[zxksii].MC+'</li>');
											}
										}else{
											if(responseTxt.Result.OUTPUT.ZXKS.ITEM[zxksii].ZLXMID == editValue.xmID){
												$("#yzxdZXKS ul").append('<li data-zxksid="'+responseTxt.Result.OUTPUT.ZXKS.ITEM[zxksii].ID+'">'+responseTxt.Result.OUTPUT.ZXKS.ITEM[zxksii].MC+'</li>');
											}
										}
									}
								}
								// 执行科室点击事件
								hammeryzxdZXKS = $("#yzxdZXKS ul li").hammer();
								hammeryzxdZXKS.on("tap",function(ev){
									yzxdZXKSFunction($(this));	
								});
							}else{
								$("#ExecutiveDepartments").removeClass("eventQY");
								$("#ExecutiveDepartments span").addClass("text-hui");
							}
						}else{
							$("#ExecutiveDepartments").hide();
							$("#ExecutiveDepartments span").attr("data-zxksid","").text("");
						}

						// 根据执行频率获取执行频率的参数
						var mr_jgdw,mr_pljg,mr_syfw,mr_plcs;
						$.each(responseTxt.Result.OUTPUT.ZXPC.ITEM,function(n,thisZxpc){
							if(thisZxpc.MC==editValue.zxpl){
								mr_jgdw=thisZxpc.JGDW;
								mr_pljg=thisZxpc.PLJG;
								mr_syfw=thisZxpc.SYFW;
								mr_plcs=thisZxpc.PLCS;
								return false;
							}
						});
						// 更新默认参数 用于后续计算总量使用
						$("#executeHz span").attr("data-jgdw",mr_jgdw).attr("data-pljg",mr_pljg).attr("data-syfw",mr_syfw).attr("data-plcs",mr_plcs);
						$("#yzxdTwoJiHeight").attr("data-flsx",editValue.flsx).attr("data-zybz",editValue.zybz);
						// 更新默认参数 用于后续判断
						$("#yzxdTwoJiHeight").attr("data-qx",editValue.yzfl);
						$("#yzxdTwoJiHeight").attr("data-lb",responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB);
						$("#yzxdTwoJiHeight").attr("data-czlx",responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX);
						$("#yzxdTwoJiHeight").attr("data-zxpl",responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL);
						$("#yzxdTwoJiHeight").attr("data-jsfs",responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS);

						// 天数
						if(plan.ts == "show" && mr_syfw==1){
							$("#NumberOfDays").show();
							$("#NumberOfDays span").text(editValue.ts).removeClass("text-red text-hui");
						}else{
							$("#NumberOfDays").hide();
						}

						// 总量
						if(plan.zl == "show"){
							$("#total").show();
							if(editValue.zl==null||editValue.zl==""){
								$("#total span").text(0).removeClass("text-hui").addClass("text-red");
								$("#countResult-zl").text(0);
							}else{
								$("#total span").text(editValue.zl).removeClass("text-red text-hui");
								$("#countResult-zl").text(editValue.zl);
							}
							// 判断总量是否可编辑
							if(plan.zl_edit==false || (mr_syfw!=="1"&&(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB=="E"||responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB=="Z")&&editValue.yzfl=="临时医嘱"&&(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX=="0"||responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].CZLX=="5")&&responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZXPL=="0"&&responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].JSFS=="3")){
								$("#total").removeClass("eventQY");
								$("#total span").addClass("text-hui");
							}
							// 获取总量单位 如果是药品在LIST里面读取，否则读取外层
							if(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB==5 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB==6){
								$.each(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ITEMLIST.ITEM,function(i,thisYZ){
									if(thisYZ.ID==editValue.editListID){
										$("#total small").text(thisYZ.ZGDW);
										$("#totalFunction p").text(thisYZ.ZGDW);
										return false;
									}
								});
							}else{
								$("#total small").text(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZGDW);
								$("#totalFunction p").text(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZGDW);
							}
						}else{
							$("#total").hide();
						}

						// 单量
						if(plan.dl == "show"){
							$("#Milligram").show();    
							$("#countResult").text(editValue.dl);
							//$(".countbox-botton").css("background","rgb(40, 42, 57)");
							$("#Milligram span").text(editValue.dl).removeClass("text-red").attr("id","zybzjlxs"+editValue.jlxs);
							// 获取单量单位 如果是药品、检验、检查多部位，都在LIST里面读取，否则读取外层
							if(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB==5 || responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ZLLB==6){
								$.each(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ITEMLIST.ITEM,function(i,thisYZ){
									if(thisYZ.ID==editValue.editListID){
										$("#boxCount p").text(thisYZ.DCDW);
										$("#Milligram small").text(thisYZ.DCDW);
										return false;
									}
								});
							}else{
								$("#boxCount p").text(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].DCDW);
								$("#Milligram small").text(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].DCDW);
							}
						}else{
							$("#Milligram").hide();     
						}
					
						// 给药执行
						if(plan.gyzx == "show"){
							$("#ToPerform").show();                
							$("#ToPerform span").attr("data-gyzxid",editValue.gyzxID).text(editValue.gyzx);
							$("#yzxdGYZX-UL").empty("li");

							// 更新给药执行选项
							$.each(responseTxt.Result.OUTPUT.GYTJ.ITEM,function(i,item){
								if(item.ID==editValue.gytjID){
									$.each(item.GYZX.ITEM,function(ii,gyzxItem){
										// 更新选中项
										if(gyzxItem.ID==editValue.gyzxID){
											$("#yzxdGYZX ul").append('<li data-gyzxid="'+gyzxItem.ID+'" style="background: rgb(81, 82, 93);">'+ gyzxItem.MC +'</li>');
										}else{
											$("#yzxdGYZX ul").append('<li data-gyzxid="'+gyzxItem.ID+'">'+ gyzxItem.MC +'</li>');
										}
									});
									return false;
								}
							});
							
							if(YorN=="yes"){
								$("#ToPerform").addClass("eventQY");                
								$("#ToPerform span").removeClass("text-red text-hui");
							}else{
								$("#ToPerform").removeClass("eventQY");                
								$("#ToPerform span").addClass("text-hui");
							}
						}else{
							$("#ToPerform").hide();   
							$("#ToPerform span").attr("data-gyzxid","").text("");
						}
						
					
						// 发药药房
						if(plan.fyyf == "show"){
							$("#pharmacy").show();    
							if(editValue.yfID!==""){
								$("#pharmacy span").attr("data-yfid",editValue.yfID).text(editValue.fyyf).removeClass("text-red");
							}else{
								$("#pharmacy span").attr("data-yfid","").text("请选择").addClass("text-red");
							}
							
							// 更新发药药房的值 
							$("#yzxdFYYF ul").empty("li"); 
							$.each(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].ITEMLIST.ITEM,function(yzn,zyitem){
								if(zyitem.ID==editValue.editListID && zyitem.FYYF!==null){
									$.each(zyitem.FYYF.ITEM,function(n,thisFYYF){
										if(thisFYYF.ID==editValue.yfID){
											$("#yzxdFYYF ul").append('<li data-yfid="'+thisFYYF.ID+'" style="background: rgb(81, 82, 93);">'+ thisFYYF.MC +'</li>');
										}else{
											$("#yzxdFYYF ul").append('<li data-yfid="'+thisFYYF.ID+'">'+ thisFYYF.MC +'</li>');
										}
									});
									// 发药药房点击事件
									hammeryzxdFYYFedit = $("#yzxdFYYF ul li").hammer();
									hammeryzxdFYYFedit.on("tap",function(ev){
										yzxdFYYFFunction($(this));
										//根据药房更换库存量
										totalDoseInfo(temYPID,$(this).attr("data-yfid"));
									});
									return false;
								}
							});									
						}else{
							$("#pharmacy").hide();  
							$("#pharmacy span").attr("yfid","").text("");
						}
					
						// 执行性质
						if(plan.zxxz == "show"){
							$("#PerformTheNature").show();          
							$("#PerformTheNature span").text(editValue.zxxz);
							
							// 更新选中默认颜色  
							$("#yzxdZXXZ ul li").css("background","rgb(40, 42, 57)");
							$("#yzxdZXXZ ul li").each(function(){
								if($(this).text()==editValue.zxxz){
									$(this).css("background","rgb(81, 82, 93)");
									return false;
								}
							});

							if(YorN=="yes"){
								$("#PerformTheNature").addClass("eventQY");                
								$("#PerformTheNature span").removeClass("text-red text-hui");
							}else{
								$("#PerformTheNature").removeClass("eventQY");                
								$("#PerformTheNature span").addClass("text-hui");
							}
						}else{
							$("#PerformTheNature").hide();     
						}

						}//editDocActYesNo
					
					}
					
					// 更新执行频率的值
					for(var zxpci=0; zxpci<responseTxt.Result.OUTPUT.ZXPC.ITEM.length; zxpci++){
						for(var plani=0; plani<plan.syfw.length; plani++){
							if(responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].SYFW == plan.syfw[plani] ){
								if(responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].MC==editValue.zxpl){
									$("#yzxdZXPL ul").append('<li style="background: rgb(81, 82, 93);" class="syfw'+ responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].SYFW +'" id="'+ responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].BM +'" data-jgdw="'+responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].JGDW+'" data-pljg="'+responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].PLJG+'" data-plcs="'+responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].PLCS+'">'+ responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].MC +'</li>');
								}else{
									$("#yzxdZXPL ul").append('<li class="syfw'+ responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].SYFW +'" id="'+ responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].BM +'" data-jgdw="'+responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].JGDW+'" data-pljg="'+responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].PLJG+'" data-plcs="'+responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].PLCS+'">'+ responseTxt.Result.OUTPUT.ZXPC.ITEM[zxpci].MC +'</li>');
								}
								break;
							}
						}
					}

					// 注册执行频率事件
					var hammerZxplLi = $("#yzxdZXPL ul li").hammer();
					hammerZxplLi.on("tap",function(){
						selectZxplLi(responseTxt,$(this));
					});

					// 加载给药途径
					function updateGytj(){
						$("#yzxdGYTJ ul").empty("li");
						// 更新给药途径的值
						for(var gytji=0; gytji < responseTxt.Result.OUTPUT.GYTJ.ITEM.length; gytji++){
							if(responseTxt.Result.OUTPUT.GYTJ.ITEM[gytji].MC == $("#drugWay span").text()){
								$("#yzxdGYTJ ul").append('<li data-pyjm="'+responseTxt.Result.OUTPUT.GYTJ.ITEM[gytji].PYJM+'" class="active_gytj" id="'+ responseTxt.Result.OUTPUT.GYTJ.ITEM[gytji].ID +'" data-zxfl="'+responseTxt.Result.OUTPUT.GYTJ.ITEM[gytji].ZXFL+'">'+ responseTxt.Result.OUTPUT.GYTJ.ITEM[gytji].MC +'</li>');
							}else{
								$("#yzxdGYTJ ul").append('<li data-pyjm="'+responseTxt.Result.OUTPUT.GYTJ.ITEM[gytji].PYJM+'" id="'+ responseTxt.Result.OUTPUT.GYTJ.ITEM[gytji].ID +'" data-zxfl="'+responseTxt.Result.OUTPUT.GYTJ.ITEM[gytji].ZXFL+'">'+ responseTxt.Result.OUTPUT.GYTJ.ITEM[gytji].MC +'</li>');
							}
						}
						// 注册事件
						var hammerGytjLi = $("#yzxdGYTJ ul li").hammer();
						hammerGytjLi.on("tap",function(){
							selectGytjLi(responseTxt,$(this));
						});
					}

				} //yzxdKongJianShowHide
				
				// 用于追加申请副项的 函数
				function yzxdSQFX(){
					$(".sqfx").remove();

					// 如果是编辑状态
					if(editValue !== undefined){
						if( editValue.sqfx!== null ){
							$.each(editValue.sqfx,function(n,value){
								if(value.bt=="1"){
									if(value.nr==null||value.nr==""){
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.bt+'" data-xh="'+n+'" data-yxid="'+value.yxID+'"><font class="text-xh">※</font><font class="UlBt">'+value.xm+'</font><span class="text-red">请填写</span></li>');
									}else{
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.bt+'" data-xh="'+n+'" data-yxid="'+value.yxID+'"><font class="text-xh">※</font><font class="UlBt">'+value.xm+'</font><span>'+ value.nr +'</span></li>');
									}
								}else{
									if(value.nr==null||value.nr==""){
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.bt+'" data-xh="'+n+'" data-yxid="'+value.yxID+'"><font class="UlBt">'+value.xm+'</font><span class="text-red">请填写</span></li>');
									}else{
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.bt+'" data-xh="'+n+'" data-yxid="'+value.yxID+'"><font class="UlBt">'+value.xm+'</font><span>'+value.nr+'</span></li>');
									}
								}
								if(n==0){
									$("#yzxdYaoNR").find(".sqfx:first").addClass("margin-top-10");
								}
							});
							// 注册事件
							var hammersqfx = $("#yzxdYaoNR .sqfx").hammer();
							hammersqfx.on("tap",function(){
								$("#nrJCXM li").removeClass("active");
								$("#yzxdYaoNR > li").removeClass("xuanThis");
								//$("#appDateTime").removeClass("text-hui");
								$(this).addClass("xuanThis");
								$(".yzxdKongJian").hide();
								$("#yzxdYSZT").show();
								$("#yzxdYSZT .textareaDiv").text($(this).children("span").text());
								$("#doctorTell").removeClass("textLR");  // 取消医生嘱托的录入状态
								$("#yzxdYaoNR .sqfx").removeClass("textLR");
								$(this).addClass("textLR"); 
							});
						}

					// 不是编辑状态
					}else{
						if(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].SQFX !== null){
							$.each(responseTxt.Result.OUTPUT.YZLIST.YZ[ypi].SQFX.ITEM,function(n,value){
								if(value.BT=="1"){
									if(value.NR==null||value.NR==""){
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.BT+'" data-xh="'+n+'" data-yxid="'+value.YSID+'"><font class="text-xh">※</font><font class="UlBt">'+value.XM+'</font><span class="text-red">请填写</span></li>');
									}else{
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.BT+'" data-xh="'+n+'" data-yxid="'+value.YSID+'"><font class="text-xh">※</font><font class="UlBt">'+value.XM+'</font><span>'+ value.NR +'</span></li>');
									}
								}else{
									if(value.NR==null||value.NR==""){
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.BT+'" data-xh="'+n+'" data-yxid="'+value.YSID+'"><font class="UlBt">'+value.XM+'</font><span class="text-red">请填写</span></li>');
									}else{
										$("#yzxdYaoNR").append('<li class="sqfx" data-bt="'+value.BT+'" data-xh="'+n+'" data-yxid="'+value.YSID+'"><font class="UlBt">'+value.XM+'</font><span>'+value.NR+'</span></li>');
									}
								}
								if(n==0){
									$("#yzxdYaoNR").find(".sqfx:first").addClass("margin-top-10");
								}
							});
							// 注册事件
							var hammersqfx = $("#yzxdYaoNR .sqfx").hammer();
							hammersqfx.on("tap",function(){
								$("#nrJCXM li").removeClass("active");
								$("#yzxdYaoNR > li").removeClass("xuanThis");
								//$("#appDateTime").removeClass("text-hui");
								$(this).addClass("xuanThis");
								$(".yzxdKongJian").hide();
								$("#yzxdYSZT").show();
								$("#yzxdYSZT .textareaDiv").text($(this).children("span").text());
								$("#doctorTell").removeClass("textLR");  // 取消医生嘱托的录入状态
								$("#yzxdYaoNR .sqfx").removeClass("textLR");
								$(this).addClass("textLR"); 
							});
						}
					}
				}//yzxdSQFX

				// 给编辑默认值初始为空 以免编辑后重新赋值
				editValue = undefined;

				break;
						
			}/*if(==ypID)*/
		}/*for*/

		// 采集方法
		function yzxdCJFFFunction(thisID,cjffID){

			$("#yzxdCJFF ul li").css("background","rgb(40, 42, 57)");
			$(thisID).css("background","rgb(81, 82, 93)");
			$("#samplingMethod > span").text($(thisID).text()).removeClass("text-red").removeClass("text-hui");
			$("#samplingMethod > span").attr("data-cjffid",cjffID);

			// 更新采集科室的值
			for(var i=0; i<responseTxt.Result.OUTPUT.CJFF.ITEM.length; i++ ){
				if(responseTxt.Result.OUTPUT.CJFF.ITEM[i].ID == cjffID){
					$("#yzxdCJKS ul").empty("li");
					for(var ii=0; ii<responseTxt.Result.OUTPUT.CJFF.ITEM[i].CJKS.ITEM.length; ii++){
						$("#yzxdCJKS ul").append('<li data-cjksid="'+responseTxt.Result.OUTPUT.CJFF.ITEM[i].CJKS.ITEM[ii].ID+'">'+responseTxt.Result.OUTPUT.CJFF.ITEM[i].CJKS.ITEM[ii].MC+'</li>');
					}
					// 默认第一个采集科室
					$("#AcquisitionDepartment span").attr("data-cjksid",responseTxt.Result.OUTPUT.CJFF.ITEM[i].CJKS.ITEM[0].ID).text(responseTxt.Result.OUTPUT.CJFF.ITEM[i].CJKS.ITEM[0].MC).removeClass("text-red text-hui");

					// 给采集科室注册点击事件
					hammeryzxdCJKS = $("#yzxdCJKS ul li").hammer();
					hammeryzxdCJKS.on("tap",function(ev){
						yzxdCJKSFunction(this);	
					});

					break;
				}
			}

		}
		//医嘱复制触碰示意
		utils.docActLiTouch();
	
	}

	// 加载 非成套项目列表
	function loadXiangMuList(startPage,jm){
		$("#LoadedTip").show();
		var fyCount = 0 ;   // 本页总条数

		// 如果未传入开始页，则默认为0
		if(startPage=="" || startPage==undefined ){
			startPage=0;
		}
		// 准备传入值 
		var qx = $("#yzxdCL").find(".active").text() == "长期医嘱" ? "长嘱":"临嘱";
		var xx = $("#yzxdButton").find(".item").text();
		var patiID = $("#slzyID").attr("data-patiid");
		var pageID = $("#slzyID").attr("data-pageid");
		var ksID = $("#slzyID").attr("data-ksid");
		var ysID = $("#userInfobox font").attr("data-userid");

		/*console.log("传入值------------------------------------------------------");
		console.log("期效："+qx);
		console.log("分类："+xx);
		console.log("病人ID："+patiID);
		console.log("第几次住院："+pageID);
		console.log("科室ID："+ksID);
		console.log("医生ID："+ysID);*/

		return $.ajax({
            url: serviceChoose +"/DC_Advice_GetItemLists",
			type: "post",
			timeout:utils.timeoutSec(),
            dataType: "json",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                    "QX": qx,
                    "XX": xx,
                    "PATIID": patiID,
                    "PAGEID": pageID,
                    "KSID": ksID,
                    "YSID": ysID,
                    "JM": jm == undefined ? null : jm,          //简码，用于关键字查询
                    "STARTPAGE": startPage,
                    "PAGECOUNT": "1",
                    "ITEMCOUNT": "50",
                    "ZD": utils.getZdId()                
            }),
			success: function(responseTxt){
				
				//console.log("非成套列表输出：-----------------------------");
				//console.log(responseTxt);
				if(responseTxt.Result.ERROR){
					$("#LoadedTip").hide();
					utils.showHide(responseTxt.Result.ERROR.MSG);
				}else{
					$("#yzxdYaoPin").empty("li").scrollTop(0);

					if(responseTxt.Result.OUTPUT.ITEMLIST!==null){

						for(var yaoi=0; yaoi < responseTxt.Result.OUTPUT.ITEMLIST.ITEM.length; yaoi++){

							if(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].LB == 5 || responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].LB == 6){
								var YPID = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].YPID;
								var YMID = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].YMID;
								var LB = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].LB;
								var YPMC = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].YPMC;
								var KSS = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].KSS;
								var CFZW = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].CFZW;
								var JSDW =responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].JSDW;
								if(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].ZD == 1){
									$("#yzxdYaoPin").append('<li><label id="'+ YPID +'" data-ymid="'+YMID+'" data-jsdw="'+JSDW+'" data-lb="'+LB+'" data-kss="'+KSS+'" data-cfzw="'+CFZW+'">'+YPMC+'</label><span class="fs1 font-24 color-jt" aria-hidden="true" data-icon=""></span></li>');
								}else{
									$("#yzxdYaoPin").append('<li><label id="'+ YPID +'" data-ymid="'+YMID+'" data-jsdw="'+JSDW+'" data-lb="'+LB+'" data-kss="'+KSS+'" data-cfzw="'+CFZW+'">'+YPMC+'</label><span class="fs1 font-24 " aria-hidden="true" data-icon=""></span></li>');
								}
							}else{
								var ZLXMID = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].ZLXMID;
								var LB = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].LB;
								var BBBW = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].BBBW;
								var CZLX = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].CZLX;
								var SGBM = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].SGBM;
								var XMMC = responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].XMMC;
								var JSDW =responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].JSDW;
								if(responseTxt.Result.OUTPUT.ITEMLIST.ITEM[yaoi].ZD == 1){
									$("#yzxdYaoPin").append('<li><label id="'+ ZLXMID +'" data-ymid="'+ZLXMID+'" data-jsdw="'+JSDW+'" data-lb="'+LB+'" data-bbbw="'+BBBW+'" data-czlx="'+CZLX+'" data-sgbh="'+SGBM+'">'+XMMC+'</label><span class="fs1 font-24 color-jt" aria-hidden="true" data-icon=""></span></li>');
								}else{
									$("#yzxdYaoPin").append('<li><label id="'+ ZLXMID +'" data-ymid="'+ZLXMID+'" data-jsdw="'+JSDW+'" data-lb="'+LB+'" data-bbbw="'+BBBW+'" data-czlx="'+CZLX+'" data-sgbh="'+SGBM+'">'+XMMC+'</label><span class="fs1 font-24" aria-hidden="true" data-icon=""></span></li>');
								}
							}
						}

						fyCount = responseTxt.Result.OUTPUT.ITEMLIST.ITEM.length;

					}else{
						fyCount = 0;
					}

					// 本页总条数
					responseTxt.count={};
					responseTxt.count = fyCount;

					$("#yzxdFanYe").text('第'+(parseInt(startPage)+1)+'页：'+ fyCount +'个');

					$("#LoadedTip").hide();

					return responseTxt;
				}
				
			},
			complete: function (XMLHttpRequest,status) {
				utils.errorAjax(status,loadXiangMuList,[startPage,jm]);
			}
		});
	}

	// 发药药房
	function yzxdFYYFFunction(thisID){
		$("#yzxdFYYF ul li").css("background","rgb(40, 42, 57)");
		$(thisID).css("background","rgb(81, 82, 93)");
		$("#pharmacy > span").attr("data-yfid",thisID.attr("data-yfid")).text($(thisID).text()).removeClass("text-red").removeClass("text-hui");
	}

	// 执行科室
	function yzxdZXKSFunction(thisID){
		$("#yzxdZXKS ul li").css("background","rgb(40, 42, 57)");
		thisID.css("background","rgb(81, 82, 93)");
		$("#ExecutiveDepartments > span").attr("data-zxksid",thisID.attr("data-zxksid")).text(thisID.text()).removeClass("text-red").removeClass("text-hui");
	}

	// 删除检验项目  
	function yzxdJCXMdell(thisID){
		if($("#nrJYXM").find("li").length>1){
			thisID.parent().remove();
		}else{
			utils.showHide("不能没有检验项目");
		}
	}

	// 采集科室
	function yzxdCJKSFunction(thisID){
		$("#yzxdCJKS ul li").css("background","rgb(40, 42, 57)");
		$(thisID).css("background","rgb(81, 82, 93)");
		$("#AcquisitionDepartment > span").attr("data-cjksid",$(thisID).attr("data-cjksid")).text($(thisID).text()).removeClass("text-red").removeClass("text-hui");
	}

	// 医嘱复制 加载医嘱
	var loadSwitch = true;        // 是否可加载 因为：苹果系统滚动条滑动的时候，会加很多像素，导致重复执行。
	function yzfzOrdActList(emptyTr,startPage){  // 是否清空TR 从哪一页开始加载 
		
		if(emptyTr=="yes"){
			// 清空 以免重新追加
			$("#yzfzInfo table").empty("tr");
		}
		
		// 准备传入值
		var patiID = $("#yzfzBingRen").find(".active").attr("data-patiid");  //病人ID
		var pageID = $("#yzfzBingRen").find(".active").attr("data-pageid");    //第几次住院
		var baby=$("#yzfzBingRen").find(".active").attr("data-baby");      // 是否婴儿
		var ksID=$("#yzfzBingRen").find(".active").attr("data-ksid");           // 科室ID
		var yzqx;                                                    // 期效
		if($("#yzfzCL").find(".active").text()=="长期医嘱"){
			yzqx = "长嘱";
		}else{
			yzqx = "临嘱";
		}
		$("#LoadedTip").show();
		// 加载医嘱内容
		$.ajax({
			url: serviceChoose+'/DC_Advice_NewLists',
			//async: false,
            type: "post",
            data: JSON.stringify({
                "IN":
                    {
                        "QX": yzqx,                              // 查询条件
                        "XX": "全部",                              // 查询条件
                        "ID": null,                            // 编辑时传递 医嘱ID
                        "PATIID": patiID,                      // 病人ID
                        "PAGEID": pageID,					   // 第几次住院
                        "BABY": baby,                          // 是否为婴儿
                        "STARTPAGE": startPage,                // 第几页开始
                        "PAGECOUNT": "1",                      // 返回几页
                        "ITEMCOUNT": "50",                     // 没页返回的条数
                        "KSID": ksID,                          // 科室ID
                        "ZD": utils.getZdId()                  // 站点ID，今后多个站点会用
                    }
            }),
			timeout:utils.timeoutSec(),
            dataType: "json",
            headers: {
                'Content-Type': 'application/json'
            },
			success: function(responseTxt){
				$("#LoadedTip").hide();
				if(responseTxt.Result.ERROR){
					$("#LoadedTip").hide();
					utils.showHide(responseTxt.Result.ERROR.MSG);
				}else{
					allPageCount = responseTxt.Result.OUTPUT.YZLIST.ZYS;  // 更新总页数的值
					nowPage = responseTxt.Result.OUTPUT.YZLIST.DQY;       // 更新当前页的值
					$("#yzfzInfo").attr("data-nowpage",nowPage);          // 更新当前页到DOM元素，以供 在其它JS调用医嘱接口时使用
					
					// 如果有医嘱
					if(responseTxt.Result.OUTPUT.YZLIST.YZ){
						for(var yzi = 0; yzi < responseTxt.Result.OUTPUT.YZLIST.YZ.length; yzi++){
							// 分离本条 开始执行时间 字段，获取本条医嘱的日期和时间
								var KSZXSJ=responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KSZXSJ.split(" ");
								var yzdate = KSZXSJ[0];
								var yztimee = KSZXSJ[1].split(":");
								var yztime = yztimee[0]+":"+yztimee[1];

							// 分离上一条 开始执行时间 字段，获取上一条医嘱的日期
							var yzdatePrev = "";
							if(yzi>0 && responseTxt.Result.OUTPUT.YZLIST.YZ[yzi-1].YZQX == yzqx){
								for(var striPrev = 0; striPrev < responseTxt.Result.OUTPUT.YZLIST.YZ[yzi-1].KSZXSJ.length; striPrev++){
									if(striPrev<10){
										yzdatePrev =  yzdatePrev + responseTxt.Result.OUTPUT.YZLIST.YZ[yzi-1].KSZXSJ[striPrev];
									}
								}
							}
							// 如果当前这条医嘱的时间和上一条的时间一样 不追加日期
							var ITEMLIST = responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST;
							var trId = "yzfz"+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID;
							var tdYzId = responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID+"yz";
							var tdDlId = responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID+"dl";
							var KSS='',CFZW='';
							
							if(yzdatePrev == yzdate){
								// 如果医嘱内没有药品，则读取医嘱内容
								if(ITEMLIST == null){
									$("#yzfzInfo table").append('<tr id="'+trId+'"><td style="width:5%"><span class="fs1 font-18 selectNo" aria-hidden="true" data-icon=""></span></td><td style="width:15%"></td><td style="width:10%">' + yztime + '</td><td style="width:20%;" class="text-left" id="'+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID + 'yz' +'">'+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YZNR +'</td><td style="width:15%;" class="text-left" id="'+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID + 'dl' +'">'+(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].DL==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].DL)+'</td><td style="width:15%">' + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YF==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YF) + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXPC==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXPC) + '</td><td style="width:10%">' + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXSJFA==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXSJFA) + '</td><td style="width:10%">'+ (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KZYS==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KZYS) + '</td></tr>' );	
								}else{
									$("#yzfzInfo table").append('<tr id="'+trId+'"><td style="width:5%"><span class="fs1 font-18 selectNo" aria-hidden="true" data-icon=""></span></td><td style="width:15%"></td><td style="width:10%">' + yztime + '</td><td style="width:20%; class="text-left" id="'+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID + 'yz' +'"></td><td style="width:15%;" class="text-left" id="'+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID + 'dl' +'"></td><td style="width:15%">' + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YF==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YF) + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXPC==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXPC) + '</td><td style="width:10%">' + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXSJFA==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXSJFA) + '</td><td style="width:10%">'+ (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KZYS==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KZYS) + '</td></tr>' );
									for(var yaoi=0; yaoi < ITEMLIST.ITEM.length; yaoi++){
										if(ITEMLIST.ITEM[yaoi].ZLLB=="D"){
											var BBBW = ITEMLIST.ITEM[yaoi].BBBW==null?'':ITEMLIST.ITEM[yaoi].BBBW;
											var JCFF = ITEMLIST.ITEM[yaoi].JCFF==null?'':ITEMLIST.ITEM[yaoi].JCFF;
											var YZNR = ITEMLIST.ITEM[yaoi].YZNR +':'+BBBW+'（'+JCFF+'）';
										}else{
											var YZNR = ITEMLIST.ITEM[yaoi].YZNR;
											// 追加KSS和CFZW 
											KSS = ITEMLIST.ITEM[yaoi].KSS;
											CFZW = ITEMLIST.ITEM[yaoi].CFZW;
										}
										$("#yzfzInfo table").find("#"+trId).find("#"+tdYzId).append('<p data-kss="'+KSS+'" data-cfzw="'+CFZW+'">'+ YZNR +'</p>');
										$("#yzfzInfo table").find("#"+trId).find("#"+tdDlId).append('<p>'+ (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].DL==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].DL) +'</p>');
									}
								}
								
							// 不一样 追加日期
							}else{
								// 如果医嘱内没有药品，则读取医嘱内容
								if(ITEMLIST == null){
									$("#yzfzInfo table").append('<tr id="'+trId+'"><td style="width:5%"><span class="fs1 font-18 selectNo" aria-hidden="true" data-icon=""></span></td><td style="width:15%">'+yzdate+'</td><td style="width:10%">' + yztime + '</td><td style="width:20%;" class="text-left" id="'+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID + 'yz' +'">'+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YZNR +'</td><td style="width:15%;" class="text-left" id="'+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID + 'dl' +'">'+(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].DL==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].DL)+'</td><td style="width:15%">' + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YF==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YF) + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXPC==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXPC) + '</td><td style="width:10%">' + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXSJFA==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXSJFA) + '</td><td style="width:10%">'+ (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KZYS==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KZYS) + '</td></tr>' );	
								}else{
									$("#yzfzInfo table").append('<tr id="'+trId+'"><td style="width:5%"><span class="fs1 font-18 selectNo" aria-hidden="true" data-icon=""></span></td><td style="width:15%">'+ yzdate + '</td><td style="width:10%">' + yztime + '</td><td style="width:20%;" class="text-left" id="'+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID + 'yz' +'"></td><td style="width:15%;" class="text-left" id="'+ responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID + 'dl' +'"></td><td style="width:15%">' + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YF==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YF) + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXPC==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXPC) + '</td><td style="width:10%">' + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXSJFA==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXSJFA) + '</td><td style="width:10%">'+ (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KZYS==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KZYS) + '</td></tr>' );
									for(var yaoi=0; yaoi < ITEMLIST.ITEM.length; yaoi++){
										if(ITEMLIST.ITEM[yaoi].ZLLB=="D"){
											var BBBW = ITEMLIST.ITEM[yaoi].BBBW==null?'':ITEMLIST.ITEM[yaoi].BBBW;
											var JCFF = ITEMLIST.ITEM[yaoi].JCFF==null?'':ITEMLIST.ITEM[yaoi].JCFF;
											var YZNR = ITEMLIST.ITEM[yaoi].YZNR +':'+BBBW+'（'+JCFF+'）';
										}else{
											var YZNR = ITEMLIST.ITEM[yaoi].YZNR;
											// 追加KSS和CFZW 
											KSS = ITEMLIST.ITEM[yaoi].KSS;
											CFZW = ITEMLIST.ITEM[yaoi].CFZW;
										}
										$("#yzfzInfo table").find("#"+trId).find("#"+tdYzId).append('<p data-kss="'+KSS+'" data-cfzw="'+CFZW+'">'+ YZNR +'</p>');
										$("#yzfzInfo table").find("#"+trId).find("#"+tdDlId).append('<p>'+ (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].DL==null?"":responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].DL) +'</p>');
									}
								}
							}					

							// 是否紧急
							if(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].JJBZ == 1){
								$("#yzfzInfo table").find("#"+trId).find("td").first().next().append(' '+'<span class="fs1" aria-hidden="true" data-icon="" style="color:#ff0000;"></span>');
							}
							// 医嘱状态 文字颜色变更
							$("#yzfzInfo table").find("#"+trId).find("td").css("color",utils.colorCompute(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YZYS));
							//$("#yzfzInfo table").find("#yzfz"+responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID).find("td").first().attr("style","");
								
							// 如果是作废的，判断医嘱状态为4的
							if(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YZZT == 4){
								$("#yzfzInfo table").find("#"+trId).find("td").css("text-decoration","line-through");
								//$("#yzfzInfo table").find("#yzfz"+responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID).find("td").first().attr("style","");
							}	
						}//for
					}else{
						utils.showHide("没有医嘱");
					}
					
					$("#yzfzInfo table tr").unbind();
					hammeryzfzInfo = $("#yzfzInfo table tr").hammer();
					hammeryzfzInfo.on("tap",function(ev){
						var ren_KSS = $("#userInfobox > font").attr("data-jb");
						var ren_CFZW = $("#userInfobox > font").attr("data-pr");
						// 如果有多个药
						if($(this).children("td").eq(3).find("p").length>1){
							var permissions = 'yes';
							$(this).children("td").eq(3).find("p").each(function(i,v){
								var yao_KSS = $(v).attr("data-kss");
								var yao_CFZW = $(v).attr("data-cfzw");
								// 判断是否够权限			
								if(ren_CFZW < yao_CFZW || ren_CFZW == yao_CFZW || yao_CFZW==0){
									// 抗生素是否需审核
									if(ren_KSS==0 && (yao_KSS==1 || yao_KSS==2 || yao_KSS==3)){
										utils.showHide("抗生素用药等级不够。");
										permissions = 'no';
										return false;
									}/*else if((yao_KSS==2 && ren_KSS==1) || (yao_KSS==3 && (ren_KSS==1 || ren_KSS==2))){
										//需要审核	这个放在其它地方处理了							
									}else{
										//不需要审核
									}*/				
								}else{
									utils.showHide("处方职务用药等级不够。");
									permissions = 'no';
									return false;
								}
							});
							if(permissions=='yes'){
								ordActCopyTr($(this));
							}
						// 只有一个药
						}else if($(this).children("td").eq(3).find("p").length==1){
							var yao_KSS = $(this).children("td").eq(3).children("p").attr("data-kss");
							var yao_CFZW = $(this).children("td").eq(3).children("p").attr("data-cfzw");
							// 判断是否够权限			
							if(ren_CFZW < yao_CFZW || ren_CFZW == yao_CFZW || yao_CFZW==0){
								// 抗生素是否需审核
								if(ren_KSS==0 && (yao_KSS==1 || yao_KSS==2 || yao_KSS==3)){
									utils.showHide("抗生素用药等级不够。");
								}else{
									ordActCopyTr($(this));
								}				
							}else{
								utils.showHide("处方职务用药等级不够。");
							}
						// 不是药，只有一个项目
						}else{
							ordActCopyTr($(this));
						}					
					});
					
					loadSwitch = true;
				}
			},
			complete: function (XMLHttpRequest,status) {
				utils.errorAjax(status,yzfzOrdActList,[emptyTr,startPage]);
			}
		});

	}
	
	// 下拉加载医嘱数据
	var allPageCount;  // 病人医嘱列表总页数
	var nowPage;       // 当前页	
	$("#yzfzInfo").scroll(function() {
		if($("#yzfzInfo").scrollTop()!==0 && $("#yzfzInfo").scrollTop()+$("#yzfzInfo").height() >= $("#yzfzInfo > table").height() && nowPage<allPageCount && loadSwitch == true){
			loadSwitch = false;
			yzfzOrdActList("no",parseInt(nowPage));  // 不清空TR，从下一页开始加载
		}
	});

	// 选择临时/长期医嘱
	hammeryzfzCL = $("#yzfzCL li").hammer();
	hammeryzfzCL.on('tap',function(ev){
		$("#yzfzCL li").removeClass("active");
		$(this).addClass("active");

		qxDellCount();// 清空已选择的数据
		yzfzOrdActList("yes","0");
	});

	// 计算全选的值 -------------------------------------------------------------------------------------------------------------------------
	var selectValue = 0;
	// 清空选择的数据
	function qxDellCount(){
		selectValue=0;
		$("#allSelect").html('<span class="fs1 font-18" aria-hidden="true" data-icon=""></span>');
		$("#selectValue").text("0");
	}

	// 选择要复制的医嘱 
	function ordActCopyTr(thisID){
		// 如果已选中
		if($(thisID).children("td:first").find($(".selectYes")).length >0){
			$(thisID).children("td").css("background","rgb(255,255,255)");
			$(thisID).children("td:first").html('<span class="fs1 font-18 selectNo" aria-hidden="true" data-icon=""></span>');
			$("#selectValue").text(--selectValue);
			if(selectValue<$("#yzfzInfo table tr").length){
				$("#allSelect").html('<span class="fs1 font-18" aria-hidden="true" data-icon=""></span>');
			}
		}
		// 如果没选中
		else{
			$(thisID).children("td").css("background","rgb(220,237,236)");
			$(thisID).children("td:first").html('<span class="fs1 font-18 selectYes" aria-hidden="true" data-icon=""></span>');
			$("#selectValue").text(++selectValue);
			if(selectValue == $("#yzfzInfo table tr").length){
				$("#allSelect").html('<span class="fs1 font-18" aria-hidden="true" data-icon=""></span>');
			}
		}
	}

	//全选 
	hammeryallSelect = $("#allSelect").hammer();
	hammeryallSelect.on("tap",function(ev){
		// 计算选中的数量
		var i=0;
		$("#yzfzInfo table tr").each(function(){
			if($(this).children("td:first").find($(".selectYes")).length >0){
				i++;
			}
		});
		// 如果全部选中 就取消选中 
		if(i == $("#yzfzInfo table tr").length){
			$("#yzfzInfo table tr").each(function(){
				$(this).children("td:first").html('<span class="fs1 font-18 selectNo" aria-hidden="true" data-icon=""></span>');
				$(this).children("td").css("background","rgb(255,255,255)");
			});
			$("#allSelect").html('<span class="fs1 font-18" aria-hidden="true" data-icon=""></span>');
			selectValue=0;
			$("#selectValue").text(0);
		}
		// 非就全选
		else{
			$("#yzfzInfo table tr").each(function(){
				$(this).children("td:first").html('<span class="fs1 font-18 selectYes" aria-hidden="true" data-icon=""></span>');
				$(this).children("td").css("background","rgb(220,237,236)");
			});
			$("#allSelect").html('<span class="fs1 font-18" aria-hidden="true" data-icon=""></span>');
			selectValue=$("#yzfzInfo table tr").length;
			$("#selectValue").text($("#yzfzInfo table tr").length);
		}

	});

	// 计算全选 -------------------------------------------------------------------------------------------------------------------------/
	

	return{
		loadYaoPin:loadYaoPin,
		loadFuZhi:loadFuZhi,
		//loadGeiYaoTuJing:loadGeiYaoTuJing,
		loadXiangMuList:loadXiangMuList,
		yzfzOrdActList:yzfzOrdActList,
		qxDellCount:qxDellCount
	}

});