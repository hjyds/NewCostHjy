/*
	* 临床路径
*/
define(["jquery", "hammer","jqueryhammer","utils","IScroll","photo","video"], function(jquery, hammer, jqueryhammer,utils,IScroll,photo,video) {
	//初始化页面元素宽度和高度
	var a = document.body.clientWidth;
	var b = document.body.clientHeight;
	function clinic(){

        var serviceChoose = utils.urlFunction();
        var patiId=$("#slzyID").attr("data-patiid");
        var pageId=$("#slzyID").attr("data-pageid");

		$("#mainNavUserBox").hide();   // 缩略卡
		$("#mainNavUserBoxzd").hide(); // 诊断结果 缩略
		$("#mainNavMinTwo").hide();    // 左边二级导航
		$("#huaDong").hide();          // 滑动块 中间
		$("#yzButtonBox").hide();   // 医嘱新开、复制按钮
		$("#linChuang").show();
		$("#linChuang").empty();
		// $("#lcljNrBox").remove();  //追加前清空 病人div
		// $("#lcljNrBox-bz").remove();  //追加前清空 标准div
		// $("#linChuang .zhe-zhao").remove();
		// $("#dayChose-list").remove();//住院天数列表
		// $("#dayChose-bz").remove();//住院天数列表
		// $("#lcljCard").remove();
		$("#linChuang").append('<div class="lcljCard" id="lcljCard"><ul id="basicInfor" class="basicInfor"></ul><div class="zheZhaobeiJ" style="background:rgba(0,0,0,0)"></div></div>');
		$("#linChuang").append('<div class="zhe-zhao"></div><div id="dayChose-list" class="dayChose-list"><div class="zhankai"><span class="fs1 zhank" aria-hidden="true" data-icon=""></span></div><ul class="choseUL"></ul></div><div id="dayChose-bz" class="dayChose-list" style="display:none"><div class="zhankai"><span class="fs1 zhank" aria-hidden="true" data-icon=""></span></div><ul class="choseUL"></ul></div>');
		//照相遮罩
		var ljzheZhaobeiJ=$("#lcljCard .zheZhaobeiJ").hammer();
		ljzheZhaobeiJ.on('tap', function(event) {
			$("#dengjiUlStyle-lj").hide();
			$("#lcljCard > .voiceAndphoto-ll").hide();
			$("#lcljCard .zheZhaobeiJ").hide();
		});

		//遮罩层点击事件注册
		$("#linChuang .zhe-zhao").on('touchend', function(event) { //防止透点
			event.preventDefault();
			$("#linChuang .zhe-zhao").hide();
			$("#lcljNrBox .lcljNr").find('.details').remove();
			$("#lcljNrBox-bz .lcljNr").find('.details').remove();
		});
		//是否婴儿
		var isBaby=$("#slzyID").attr("data-baby");
		if(isBaby=="no"){
            var baby=0
        }else {
            baby=1
        }
		//病人基本信息
		$("#basicInfor li").remove(); //防止重复
		$("#ljzt").remove(); // 执行信息
		//性别 判断男女
		var Lcljsex=($("#slXB").hasClass('color-woman')?'<img src="./img/woman.png" class="color-woman"/>':'<img src="./img/man.png" class="color-man"/>');
		//年龄 婴儿
		var LcljyearYes=$("#baby-yes").text();
		//年龄 成年
		var LcljyearNo=$("#slAGE").text()+'岁';
		//临床路径
		if($("#slLCLJ").hasClass("lclj1")){
			var lcljpath ='<li>| <span class="fs1 lclj1" aria-hidden="true" data-icon=""></span></li>'
		}else if($("#slLCLJ").hasClass("lclj2")){
			var lcljpath ='<li>| <span class="fs1 lclj2" aria-hidden="true" data-icon=""></span></li>'
		}else if($("#slLCLJ").hasClass("lclj3")){
			var lcljpath ='<li>| <span class="fs1 lclj3" aria-hidden="true" data-icon=""></span></li>'
		}else{var lcljpath=''};
		if(baby){  //是婴儿
			$("#basicInfor").append('<li>'+$("#slNAME").text()+'</li><li>| '+Lcljsex+'</li><li>| '+LcljyearYes+'</li><li>| <span class="badge" id="persHLDJ"></span></li><li>| '+$("#slCH").text()+'</li><li>| '+$("#slzyID").text()+'</li><li>| '+$("#slRYSJ").text()+'</li><li>| '+$("#slBQZT").text()+'</li>'+lcljpath+'<li>| <span class="dengJiCheck" id="lj-dengji">'+$("#dengJi").text()+'</span></li><li><b></b></li>');
		}else{
			$("#basicInfor").append('<li>'+$("#slNAME").text()+'</li><li>| '+Lcljsex+'</li><li>| '+LcljyearNo+'</li><li>| <span class="badge" id="persHLDJ"></span></li><li>| '+$("#slCH").text()+'</li><li>| '+$("#slzyID").text()+'</li><li>| '+$("#slRYSJ").text()+'</li><li>| '+$("#slBQZT").text()+'</li>'+lcljpath+'<li>| <span class="dengJiCheck" id="lj-dengji">'+$("#dengJi").text()+'</span></li><li><b></b></li>');
		}

		//护理等级 用不同的calss
		if(($("#slHLDJ").css("display")=="block")){
			if($("#slHLDJ").text()=="一"){
				$("#persHLDJ").text("一");
				$("#persHLDJ").addClass('badge1');
			}else if($("#slHLDJ").text()=="二"){
				$("#persHLDJ").text("二");
				$("#persHLDJ").addClass('badge2');
			}else if($("#slHLDJ").text()=="三"){
				$("#persHLDJ").text("三");
				$("#persHLDJ").addClass('badge3');
			}else if($("#slHLDJ").text()=="特"){
				$("#persHLDJ").text("特");
				$("#persHLDJ").addClass('badgete');
			}
		}else{ 
			$("#basicInfor li:nth-child(4)").hide();
		}
		//追加拍照录音按钮 容器 再追加图标
		var ljpictures= '<div class="voiceAndphoto-ll" style="left:60px"><div class="tuchu"></div><ul><li class="voice"><span class="fs1" aria-hidden="true" data-icon=""></span></li><li class="voice" style="border-top:1px solid rgba(204, 204, 204, 0.61);"><span class="fs1" aria-hidden="true" data-icon=""></span></li></ul></div>';
		var ljpageid='<div class="pageIdchange" id="dengjiUlStyle-lj" style="left: 25px"><div class="outertop"></div><ul></ul></div>';
		$("#lcljCard").append(ljpictures);
		var pageIdlength=$("#dengjiUlStyle >ul >li").length;
		if(pageIdlength>1){    //住院次数大于1 才追加li
			$("#lcljCard").append(ljpageid);
			$("#dengjiUlStyle-lj >ul > li").remove();
			for (var i = 1; i <= pageIdlength; i++) {
				$("#dengjiUlStyle-lj >ul").append('<li>'+i+'</li>');
				if($("#basicInfor > li > .dengJiCheck").text()==i){
					$("#dengjiUlStyle-lj >ul > li").eq(i-1).addClass('changClass')
				}
			}
		}
		//基本信息点击事件
		var basicInforhammer=$("#basicInfor").hammer();
		basicInforhammer.on('tap', function(event) {
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
			$("#lcljCard .zheZhaobeiJ").show();
			$("#lcljCard > .voiceAndphoto-ll").removeClass('animated fadeIn').removeClass('animated fadeOut').toggle();
			if(pageIdlength>1){
				$("#dengjiUlStyle-lj").removeClass('animated fadeIn').removeClass('animated fadeOut').toggle();
			}
		});

        //给照相注册事件
		var zlvoicelihammer= $("#lcljCard > .voiceAndphoto-ll >ul li").hammer();
        zlvoicelihammer.on('tap', function(event) {
			$("#lcljCard .zheZhaobeiJ").hide();
			$(this).addClass('xuanZhong');
			$("#lcljCard > .voiceAndphoto-ll").removeClass('animated fadeIn').addClass('animated fadeOut');
			$("#dengjiUlStyle-lj").removeClass('animated fadeIn').addClass('animated fadeOut');
			setTimeout(function(){ 
				$("#lcljCard > .voiceAndphoto-ll").css("display","none");
	    		$("#dengjiUlStyle-lj").css("display","none");
	    		$("#lcljCard > .voiceAndphoto-ll > ul li").removeClass('xuanZhong')
			}, 1000);
			if($(this).index()==0){
				video.video();   //录音
			}else{
				photo.photo();   //拍照
			}
        });

		var ljdengjiUlStyleha=$("#dengjiUlStyle-lj li").hammer();
		ljdengjiUlStyleha.on('tap', function(event) {
			$("#lcljCard .zheZhaobeiJ").hide();
			lcpageid($(this));
		});

		huqushuju();//方便做ajax超时
        //获取基本数据 
        function huqushuju(){
	        $("#LoadedTip").show();
            $.ajax({
                url: serviceChoose + '/DC_PathWay',
                type: 'post',
                timeout: utils.timeoutSec(),
                data: JSON.stringify({
                    "IN":
                        {
                            "PATIID": patiId,
                            "PAGEID": pageId
                        }
                }),
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                },
		        success:function(response) {
		        	if(response.Result.ERROR){
                        utils.showHide(response.Result.ERROR);
                        $("#LoadedTip").hide();  
					}else{
			        	if(response.Result.PHASELIST){
			        		$("#lcljCard").append('<div class="ljzt" id="ljzt" ><span data-ljid="'+response.Result.PHASELIST.LJID+'"  data-bbh="'+response.Result.PHASELIST.BBH+'" id="criterion">标准</span><span id="change-cont">变异</span><b>（<font>执行：'+response.Result.PHASELIST.ZXJD+' | </font>标准：'+response.Result.PHASELIST.BZZYR+'天）</b></div>');
							divcreat(response.Result.PHASELIST.PHASES.PHASE,response.Result.PHASELIST);
							//标准与变异事件注册
							var criterionhammer=$("#criterion").hammer();  //标准路径
							criterionhammer.on('tap', function(event) {
								if($(this).text()=="标准"){		//出现标准路径类容							
									var ljid=$(this).attr("data-ljid"); //路径ID
									var bbh=$(this).attr("data-bbh");   //版本号
									$("#ljzt font").hide();
									if($("#lcljNrBox-bz").css("display")=="none"){
										$("#lcljNrBox-bz").show();
									}else{
										StandardPath(ljid,bbh);
									}
									$(this).text("返回");
									$("#change-cont").addClass('jingYong');
									$("#lcljNrBox").hide(); //病人路径	
									$("#dayChose-bz .choseUL").removeClass('animated fadeInLeft').removeClass('animated fadeOutLeft');
									// if($("#dayChose-bz .zhankai"))
									$("#dayChose-bz").show();
									$("#dayChose-list .choseUL").removeClass('animated fadeInLeft').removeClass('animated fadeOutLeft');
									$("#dayChose-list").hide();
									
								}else{
									$("#lcljNrBox").show();
									$("#lcljNrBox-bz").hide();								
									$(this).text("标准"); 
									$("#ljzt font").show(); 
									$("#change-cont").removeClass('jingYong');
									$("#dayChose-list .choseUL").removeClass('animated fadeInLeft').removeClass('animated fadeOutLeft');
									$("#dayChose-list").show();
									$("#dayChose-bz .choseUL").removeClass('animated fadeInLeft').removeClass('animated fadeOutLeft');
									$("#dayChose-bz").hide();
								}
							});
							var  changeDIVConthammer=$("#change-cont").hammer(); //查看变异项目
							changeDIVConthammer.on('tap', function(event) {
								if(!$("#change-cont").hasClass('jingYong')){
									if($(this).text()=="变异"){
										$("#lcljNrBox .nr").find('.zc-yes').hide();
										$(this).text("所有项目");
									}else{
										$("#lcljNrBox .nr").find('.zc-yes').show();
										$(this).text("变异");
									};
								}
							});
			        	}else{
			        		utils.showHide("没有临床路径");
			        		$("#dayChose-list").remove();//住院天数按钮 移除
			        	}
			        	console.log(response);
			        	$("#LoadedTip").hide();	
			        }
		        },
				complete: function (XMLHttpRequest, textStatus) {  
				    utils.errorAjax(textStatus,huqushuju,[]);
				}
	    	})
    	}
    	//病人路径 创建div 容器
    	function divcreat(PHASE,PHASELIST){
    		//追加内容div
			$("#lcljNrBox").remove();  //追加前清空 病人div
			$("#lcljNrBox-bz").remove();  //追加前清空 标准
			$("#linChuang").append('<div class="lcljNrBox" id="lcljNrBox"><div style="width: 100%; height:100%; 67position: relative;left: 0px;top: 0px;box-sizing: border-box;"></div></div>');
			
    		//是数组
			if(PHASE instanceof Array){
				for (var i = 0; i < PHASE.length; i++) {
					var ZYR=PHASE[i].JD.split("(")[0];//住院名称
					if(PHASE[i].DAYS.DAY.length){  //当前住院名字下有多个个列表
						for(var j=0;j<PHASE[i].DAYS.DAY.length;j++){
							$("#lcljNrBox>div").append('<div class="lcljNr" id="Nr-'+PHASE[i].JDID+'-'+j+'" data-dqjd="'+PHASE[i].DQJD+'"><div class="title">'+ZYR+'</div><ul class="bt"><li><span>第'+PHASE[i].DAYS.DAY[j].TS+'天</span></li></ul><div class="nrRap"><ul class="nr"></ul></div><ul class="pgYes"></ul><ul class="pgNo"></ul></div>');	
							thedata(PHASE[i].DAYS.DAY[j],'Nr-'+PHASE[i].JDID+'-'+j);
						}
					}else{
						//$("#lcljNrBox>div").append('<div class="lcljNr" id="Nr-'+PHASE[i].JDID+'" data-dqjd="'+PHASE[i].DQJD+'"><div class="title">'+ZYR+'</div><ul class="bt"><li><span>第'+PHASE[i].DAYS.DAY.TS+'天</span></li></ul><ul class="nr"></ul><ul class="pgYes"></ul><ul class="pgNo"></ul></div>');
						$("#lcljNrBox>div").append('<div class="lcljNr" id="Nr-'+PHASE[i].JDID+'" data-dqjd="'+PHASE[i].DQJD+'"><div class="title">'+ZYR+'</div><ul class="bt"><li><span>第'+PHASE[i].DAYS.DAY.TS+'天</span></li></ul><div class="nrRap"><ul class="nr"></ul></div><ul class="pgYes"></ul><ul class="pgNo"></ul></div>');

						thedata(PHASE[i].DAYS.DAY,"Nr-"+PHASE[i].JDID);
					}						
				};
				$("#lcljNrBox-bz>div .lcljNr:first").css("margin-left","0");	//第一个div左边距为0
				$("#lcljNrBox>div").css("width",314*parseInt($("#lcljNrBox>div>div").length));//计算宽度												
			}else{  //对象
				var ZYR=PHASE.JD.split("(")[0];//住院日
				if(PHASE.DAYS.DAY.length){    //当前住院名字下有多个个列表
					for(var j=0;j<PHASE.DAYS.DAY.length;j++){
						$("#lcljNrBox>div").append('<div class="lcljNr"  id="Nr-'+PHASE.JDID+'" data-dqjd="'+PHASE.DQJD+'"><div class="title">'+ZYR+'</div><ul class="bt"><li><span>第'+PHASE.DAYS.DAY[j].TS+'天</span></li></ul><div class="nrRap"><ul class="nr"></ul></div><ul class="pgYes"></ul><ul class="pgNo"></ul></div>');	
						thedata(PHASE.DAYS.DAY,"Nr-"+PHASE.JDID);
					}
				}else{
					$("#lcljNrBox>div").append('<div class="lcljNr"  id="Nr-'+PHASE.JDID+'" data-dqjd="'+PHASE.DQJD+'"><div class="title">'+ZYR+'</div><ul class="bt"><li><span>第'+PHASE.DAYS.DAY.TS+'天</span></li></ul><div class="nrRap"><ul class="nr"></ul></div><ul class="pgYes"></ul><ul class="pgNo"></ul></div>');
					thedata(PHASE.DAYS.DAY,"Nr-"+PHASE.JDID);
				}
				$("#lcljNrBox-bz>div .lcljNr:first").css("margin-left","0");	//第一个div左边距为0
			};

			// $("#lcljNrBox>div .lcljNr").css("height",$("#lcljNrBox").height()-30);//div内容高度
			// $("#lcljNrBox>div .nrRap").css("height",$("#lcljNrBox .lcljNr").height()-159)
			$("#lcljNrBox>div .lcljNr:first").css("margin-left","0");	//第一个div左边距为0
			$("#lcljNrBox>div").css("width",314*parseInt($("#lcljNrBox>div>div").length));//计算宽度 
			for (var i = 0; i < $("#lcljNrBox>div .nrRap").length; i++) { //添加加载更多的图标
			 	utils.wipeMore($("#lcljNrBox>div .nrRap").eq(i),0,'159px');
			} 
			//utils.wipeMore($("#lcljNrBox>div .nrRap").eq(0),0,'157px');
			//iscroll 设置 useTransform: false
			var myscroll = new IScroll("#lcljNrBox",{scrollX: true,scrollY: true,click:true,eventPassthrough: true,useTransition: false,useTransform: false});
    	}

    	//病人 每个div 数据填写
    	function thedata(thisdata,divid){
    		//追加日期
    		var RQ=thisdata.RQ.split(" ")[0];
    		var xq=utils.getMyDay(new Date(RQ));
    		$("#"+divid).find(".bt").append('<li>'+RQ+'</li><li>'+xq+'</li>');
    		var item=utils.makeArry(thisdata.ITEMLIST.ITEM);
			$.each(item, function(index, element) {
    			switch (element.FL) {
                    case "主要诊疗工作":
                    	if(!$("#"+divid).find(".nr").find(".zy_title").length){
                    		$("#"+divid).find(".nr").append('<li class="nr_title zy_title">主要诊疗工作</li>');
                    	} 
                    	if(element.ZXBYYY==null){
                    		$("#"+divid).find(".nr").append('<li id="'+element.ZXID+'" class="cilck zc-yes"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'</span></li>');
                    	}else{
                    		$("#"+divid).find(".nr").append('<li id="'+element.ZXID+'" class="cilck zc-no"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'<br/><span class="change-red">变异原因：'+element.ZXBYYY+'</span></span></li>');
                    	};
                    	judge(element.ZXJG,element.ZXID,element.ZXBYYY);
                    	break;
                    case "重点医嘱": 
	                    if(!$("#"+divid).find(".nr").find(".zd_title").length){
	                    	$("#"+divid).find(".nr").append('<li class="nr_title zd_title">重点医嘱</li>');
                    	}
                    	if(element.ZXBYYY==null){
                    		$("#"+divid).find(".nr").append('<li id="'+element.ZXID+'" class="cilck zc-yes"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'</span></li>');
                    	}else{
                    		$("#"+divid).find(".nr").append('<li id="'+element.ZXID+'" class="cilck zc-no"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'<br/><span class="change-red">变异原因：'+element.ZXBYYY+'</span></span></li>');
                    	}; 
                    	judge(element.ZXJG,element.ZXID,element.ZXBYYY);
                    	break;
                    case "重要医嘱": 
	                    if(!$("#"+divid).find(".nr").find(".zd_title").length){
	                    	$("#"+divid).find(".nr").append('<li class="nr_title zd_title">重要医嘱</li>');
                    	}
                    	if(element.ZXBYYY==null){
                    		$("#"+divid).find(".nr").append('<li id="'+element.ZXID+'" class="cilck zc-yes"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'</span></li>');
                    	}else{
                    		$("#"+divid).find(".nr").append('<li id="'+element.ZXID+'" class="cilck zc-no"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'<br/><span class="change-red">变异原因：'+element.ZXBYYY+'</span></span></li>');
                    	}; 
                    	judge(element.ZXJG,element.ZXID,element.ZXBYYY);
                    	break;
                    case "主要护理工作":
                    	if(!$("#"+divid).find(".nr").find(".hul_titel").length){
	                    	$("#"+divid).find(".nr").append('<li class="nr_title hul_titel">主要护理工作</li>'); 
                    	}
                    	if(element.ZXBYYY==null){
                    		$("#"+divid).find(".nr").append('<li id="'+element.ZXID+'" class="cilck zc-yes"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'</span></li>');
                    	}else{
                    		$("#"+divid).find(".nr").append('<li id="'+element.ZXID+'" class="cilck zc-no"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'<br/><span class="change-red">变异原因：'+element.ZXBYYY+'</span></span></li>');
                    	};                    	
                    	judge(element.ZXJG,element.ZXID,element.ZXBYYY);
                    	break;
                     case "护理工作":
                    	if(!$("#"+divid).find(".nr").find(".hul_titel").length){
	                    	$("#"+divid).find(".nr").append('<li class="nr_title hul_titel">护理工作</li>'); 
                    	}
                    	if(element.ZXBYYY==null){
                    		$("#"+divid).find(".nr").append('<li id="'+element.ZXID+'" class="cilck zc-yes"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'</span></li>');
                    	}else{
                    		$("#"+divid).find(".nr").append('<li id="'+element.ZXID+'" class="cilck zc-no"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'<br/><span class="change-red">变异原因：'+element.ZXBYYY+'</span></span></li>');
                    	};                    	
                    	judge(element.ZXJG,element.ZXID,element.ZXBYYY);
                    	break;	
                }
    			
			});
    		//评估结果是否正常
			if(thisdata.PGJG=="正常"){
				$("#"+divid).find(".pgYes").show();
    			$("#"+divid).find(".pgYes").append('<li class="pg_title">评估情况</li><ul><li><font>评估结果：</font><span class="float-right">'+(thisdata.PGJG==null?"无":thisdata.PGJG)+'</span></li><li><font>评估人：</font><span class="float-right">'+(thisdata.PGR==null?"无":thisdata.PGR)+'</span></li><li><font>评估说明：</font><span class="float-right">'+(thisdata.PGSM==null?"无":thisdata.PGSM)+'</span></li></ul>')
				$("#"+divid).find(".pgNo").hide();
				// //正常
				//var pgYeslihammer=$("#"+divid).find(".pgYes").find("ul").hammer();
				//pgYeslihammer.on('tap', function(event) {
				$("#"+divid).find(".pgYes").find("ul").on("click",function(){
					assess($(this),1,thisdata);
				});
			}else{
				$("#"+divid).find(".pgYes").hide();
				$("#"+divid).find(".pgNo").show();
				$("#"+divid).find(".pgNo").append('<li class="pg_title" style="line-height:35px;">评估情况</li><ul><li><font>评估结果：</font><span class="float-right">'+(thisdata.PGJG==null?"无":thisdata.PGJG)+'</span></li><li><font>变异原因：</font><span class="float-right">'+(thisdata.BYYY==null?"无":thisdata.BYYY)+'</span></li><li><font>评估人：</font><span class="float-right">'+(thisdata.PGR==null?"无":thisdata.PGR)+'</span></li><li><font>评估说明：</font><span class="float-right">'+(thisdata.PGSM==null?"无":thisdata.PGSM)+'</span></li></ul>')
				// //变异
				//var pgNolihammer=$("#"+divid).find(".pgNo").find("ul").hammer();
				//pgNolihammer.on('tap', function(event) {
				$("#"+divid).find(".pgNo").find("ul").on("click",function(){	
					assess($(this),0,thisdata);
				});

			}
			// 项目 li点击事件注册
			//var licilckhammer=$("#"+divid).find(".nr").find(".lujin-li").hammer();  //将事件注册到span上防止冒泡
			//licilckhammer.on('tap', function() {
			$("#"+divid).find(".nr").find(".lujin-li").on("click",function(){
				projectmessge($(this).parent(), divid);
			});
    	}
    	// 病人 执行结果判断
    	function judge(meg,liid,byyy){
    		switch(meg) {
    			case "已经执行":
    				$("#"+liid).append('<span class="fs1 float-right text-yes" aria-hidden="true" data-icon=""></span>')
    			break;
    			case "尚未执行":
    				$("#"+liid).append('<span class="fs1 float-right text-yellow" aria-hidden="true" data-icon=""></span>');
    			break;
    			case "取消执行":
    				$("#"+liid).append('<span class="fs1 float-right change-red" aria-hidden="true" data-icon=""></span>');
    			break;
    			case "部分执行":
    				$("#"+liid).append('<span class="fs1 float-right text-bufen" aria-hidden="true" data-icon=""></span>');
    			break;
    			case "提前执行":
    				$("#"+liid).append('<span class="fs1 float-right text-yes" aria-hidden="true" data-icon=""></span>');
    			break;
    			case "延后执行":
    				$("#"+liid).append('<span class="fs1 float-right change-red" aria-hidden="true" data-icon=""></span>');
    			break;
    		}
    		if(byyy==null){  //有变异原因 li高度加倍
    			$("#"+liid).css("height","35px");
    		}else{
    			$("#"+liid).css("height","70px");
    		}	    			
    	}
    	//病人  评估内容
    	function assess(thisdiv,intnum,thisdata){
    		thisdiv.find('.details').find("ul").remove();
    		if(thisdiv.offset().left>400){
    			thisdiv.append('<div class="pinggu-left  details"><div class="tuchu"></div><div class="pg-cont"></div></div>');
    		}else{
    			thisdiv.append('<div class="pinggu-right details"><div class="tuchu"></div><div class="pg-cont"></div></div>');
    		} 
    		$("#linChuang .zhe-zhao").show();//遮罩div
    		if(intnum==1){
    			thisdiv.find('.pg-cont').append('<ul><li>评估结果：'+(thisdata.PGJG==null?"无":thisdata.PGJG)+'</li><li>评估人：'+(thisdata.PGR==null?"无":thisdata.PGR)+'</li><li>评估说明：'+(thisdata.PGSM==null?"无":thisdata.PGSM)+'</li></ul>');
    		}else{
    			thisdiv.find('.pg-cont').append('<ul><li>评估结果：'+(thisdata.PGJG==null?"无":thisdata.PGJG)+'</li><li>变异原因：'+(thisdata.BYYY==null?"无":thisdata.BYYY)+'</li><li>评估人：'+(thisdata.PGR==null?"无":thisdata.PGR)+'</li><li>评估说明：'+(thisdata.PGSM==null?"无":thisdata.PGSM)+'</li></ul>');
    		}; 
    		// //测试
    		// var xxxxx='<li>评估结果：'+(thisdata.PGJG==null?"无":thisdata.PGJG)+'</li><li>变异原因：'+(thisdata.BYYY==null?"无":thisdata.BYYY)+'</li><li>评估人：'+(thisdata.PGR==null?"无":thisdata.PGR)+'</li><li>评估说明：'+(thisdata.PGSM==null?"无":thisdata.PGSM)+'</li>';
    		// thisdiv.find('.pg-cont').append('<ul>'+xxxxx+xxxxx+xxxxx+xxxxx+'</ul>'); 
    		// //测试 		
			thisdiv.find('.details').show();//执行信息div
			var libottom=b-thisdiv.offset().top-40;
			var divhei=thisdiv.find('.pg-cont').height();
			if(parseInt(libottom)<parseInt(divhei)){
				thisdiv.find('.pg-cont').css("margin-top",parseInt(libottom)-parseInt(divhei));
			}
    	}
    	// 病人 项目执行详细信息
    	function projectmessge(thisli,divid){
    		$(".nr .cilck").removeClass('active');
    		thisli.addClass('active');
    		var taph=$("#"+divid).find('.nrRap').scrollTop();//获取滚动条滚动的高度
    		thisli.find('.details').find("ul").remove();
    		var zxid=thisli.attr("id");
    		$("#LoadedTip").show();
            $.ajax({
                url: serviceChoose + '/DC_PathWayDetail',
                type: 'post',
                data: JSON.stringify({
                    "IN":
                        {
                            "ZXID": zxid                             //执行ID
                        }
                }),
    			timeout:utils.timeoutSec(),
                dataType: 'json',    	
                headers: {
                    'Content-Type': 'application/json'
                },
	    		success:function(response) {
	    			if(response.Result.ERROR){
	    				utils.showHide(response.Result.ERROR.MSG);
	    			}else{	  				
			    		if(thisli.offset().left>400){
			    			thisli.append('<div class="xiang-qing-left details"><div class="tuchu"></div><div class="xq-cont"></div></div>');

			    		}else{
			    			thisli.append('<div class="xiang-qing details"><div class="tuchu"></div><div class="xq-cont"></div></div>');
			    		}   	
			    		$("#linChuang .zhe-zhao").show();
			    		var xmlr=thisli.text().replace(thisli.find(".change-red").text(),"");//项目内容  有变异原因时隐藏变异原因
			    		var xmdetail=response.Result.LJEXEC.ZXQK;  //项目执行详细信息	
			    		//除医嘱摘要的详细内容
			    		var xmxx='<li><font>项目内容：</font>'+xmlr+'</li><li><font>执行结果：</font>'+(xmdetail.ZXJG==null?"无":xmdetail.ZXJG)+'</li><li><font>执行人：</font>'+(xmdetail.ZXR==null?"无":xmdetail.ZXR)+'</li><li><font>执行时间：</font>'+(xmdetail.ZXSJ==null?"无":xmdetail.ZXSJ)+'</li><li><font>执行说明：</font>'+(xmdetail.ZXSM==null?"无":xmdetail.ZXSM)+'</li>';
		    			if(response.Result.LJEXEC.YZLIST==null){ 
		    				 //没有医嘱摘要
		    				thisli.find('.xq-cont').append('<ul>'+xmxx+'<li class="text-lv">医嘱摘要：</li><li class="xian"></li><li >无内容</li></ul>');

		    			}else{
		    			//有医嘱摘要		    				
		    				thisli.find('.xq-cont').append('<ul>'+xmxx+'<li class="text-lv">医嘱摘要：</li></ul>');
		    				var YZLIST=response.Result.LJEXEC.YZLIST;	//医嘱摘要li
		    				if(YZLIST.YZXX instanceof Array){  //医嘱摘要
		    					for (var i = 0; i < YZLIST.YZXX.length; i++) {
		    						var YZQX=YZLIST.YZXX[i].YZQX==0?"长嘱":"临嘱",//医嘱期效
				    					ZXSJ=YZLIST.YZXX[i].ZXSJ==null?"无":YZLIST.YZXX[i].ZXSJ,//执行时间
				    					YZNR=YZLIST.YZXX[i].YZNR==null?"无":YZLIST.YZXX[i].YZNR,//医嘱内容
				    					DL=YZLIST.YZXX[i].DL==null?"无":YZLIST.YZXX[i].DL,//单量
				    					GYTJ=YZLIST.YZXX[i].GYTJ==null?"无":YZLIST.YZXX[i].GYTJ,//给药途径
				    					ZXPL=YZLIST.YZXX[i].ZXPL==null?"无":YZLIST.YZXX[i].ZXPL,//执行频次
				    					YSZT=YZLIST.YZXX[i].YSZT==null?"无":YZLIST.YZXX[i].YSZT;//医生嘱托
				    					var pagenum=parseInt(i)+1;
		    						thisli.find('.xq-cont').append('<li class="xian"></li><span class="page">'+pagenum+'/'+YZLIST.YZXX.length+'</span><li><font>医嘱期效：</font>'+YZQX+'</li><li><font>执行时间：</font>'+ZXSJ+'</li><li><font>医嘱内容：</font>'+YZNR+'</li><li><font>单量：</font>'+DL+'</li><li><font>给药途径：</font>'+GYTJ+'</li><li><font>执行频次：</font>'+ZXPL+'</li><li><font>医生嘱托：</font>'+YSZT+'</li>');
		    					}
		    				}else{
		    					var YZQX=YZLIST.YZXX.YZQX==0?"长嘱":"临嘱",//医嘱期效
			    					ZXSJ=YZLIST.YZXX.ZXSJ==null?"无":YZLIST.YZXX.ZXSJ,//执行时间
			    					YZNR=YZLIST.YZXX.YZNR==null?"无":YZLIST.YZXX.YZNR,//医嘱内容
			    					DL=YZLIST.YZXX.DL==null?"无":YZLIST.YZXX.DL,//单量
			    					GYTJ=YZLIST.YZXX.GYTJ==null?"无":YZLIST.YZXX.GYTJ,//给药途径
			    					ZXPL=YZLIST.YZXX.ZXPL==null?"无":YZLIST.YZXX.ZXPL,//执行频次
			    					YSZT=YZLIST.YZXX.YSZT==null?"无":YZLIST.YZXX.YSZT;//医生嘱托
		    					thisli.find('.xq-cont').append('<li class="xian"></li><span class="page">1/1</span><li><font>医嘱期效：</font>'+YZQX+'</li><li><font>执行时间：</font>'+ZXSJ+'</li><li><font>医嘱内容：</font>'+YZNR+'</li><li><font>单量：</font>'+DL+'</li><li><font>给药途径：</font>'+GYTJ+'</li><li><font>执行频次：</font>'+ZXPL+'</li><li><font>医生嘱托：</font>'+YSZT+'</li>');

		    				}
		    			}

		    			//  	//测试
			    		// var xmxx='<li><font>项目内容：</font>'+xmlr+'</li><li><font>执行结果：</font>'+(xmdetail.ZXJG==null?"无":xmdetail.ZXJG)+'</li><li><font>执行人：</font>'+(xmdetail.ZXR==null?"无":xmdetail.ZXR)+'</li><li><font>执行时间：</font>'+(xmdetail.ZXSJ==null?"无":xmdetail.ZXSJ)+'</li><li><font>执行说明：</font>'+(xmdetail.ZXSM==null?"无":xmdetail.ZXSM)+'</li>';
		    			// thisli.find('.xq-cont').append('<ul>'+xmxx+xmxx+xmxx+'</ul>')
		    			// 	//测试

		    			//div 的距离
		    			
		    			thisli.find('.details').show();//执行信息div
		    			thisli.find('.details').css("margin-top",-(parseInt(taph)+55));
		    			var libottom=b-thisli.offset().top-30;
						var divhei=thisli.find('.xq-cont').height();
						if(parseInt(libottom)<parseInt(divhei)){
							thisli.find('.xq-cont').css("margin-top",parseInt(libottom)-parseInt(divhei)-35);
						}
						if(b-70<thisli.find('.xq-cont').height()){  //如果屏幕小于信息显示div
							thisli.find('.xq-cont').css("height",b-70);
							thisli.find('.xq-cont').css("margin-top",parseInt(libottom)-parseInt(divhei)+35)
		    			}
		    		}


	    			console.log(response);
	    			$("#LoadedTip").hide();
	    		},
	    		complete: function (XMLHttpRequest, textStatus) {  
				    utils.errorAjax(textStatus,projectmessge,[thisli,divid]);
				}
    		});
    	}
    	//标准路径定义 div
    	function StandardPath(ljid,bbh){
    		$("#LoadedTip").show();
    		$.ajax({
    			url: serviceChoose+'/DC_PathWay_Gen',
    			type: 'post',
                timeout: utils.timeoutSec(),
                data: JSON.stringify({
                    "IN":
                        {
                            "LJID": ljid,        //DC_PathWay获取的路径ID
                            "BBH": bbh            //DC_PathWay获取的路径版本号
                        }
                }),
                dataType: 'json',
                headers: {
                    'Content-Type': 'application/json'
                },
	    		success:function(response) {
	    			$("#lcljNrBox-bz").remove();  //追加前清空
					$("#linChuang").append('<div class="lcljNrBox" id="lcljNrBox-bz"><div style="width: 100%; height:100%;"></div></div>');
					if(response.Result.ERROR){
	    				utils.showHide(response.Result.ERROR.MSG);
	    			}else{
		    			var PHASE=response.Result.PHASELIST.PHASES.PHASE;
		    			if(PHASE instanceof Array){
							for (var i = 0; i < PHASE.length; i++) {
								var ZYR=PHASE[i].JD.split("(")[0];//住院名称
								$("#lcljNrBox-bz>div").append('<div class="lcljNr" id="Nrbz-'+PHASE[i].JDID+'"><div class="title" style="position: absolute;top: 0;width: 282px;">'+ZYR+'</div><div class="nrRap" style="padding-bottom: 10px;"><ul class="nr"></ul></div></div>');	
								pathconut(PHASE[i].ITEMLIST.ITEM,"Nrbz-"+PHASE[i].JDID); //div里的内容
							}	
							$("#lcljNrBox-bz>div .lcljNr:first").css("margin-left","0");	//第一个div左边距为0
							$("#lcljNrBox-bz>div").css("width",314*parseInt($("#lcljNrBox-bz>div>div").length)-9);//计算宽度
						}else{  //对象
							$("#lcljNrBox-bz>div").append('<div class="lcljNr" id="Nrbz-'+PHASE.JDID+'" data-dqjd="'+PHASE.DQJD+'"><div class="title" style="position: absolute;top: 0;width: 282px;">'+ZYR+'</div><div class="nrRap" style="padding-bottom: 10px;"><ul class="nr"></ul></div></div>');
							pathconut(PHASE.ITEMLIST.ITEM,"Nrbz-"+PHASE.JDID); //div里的内容
							$("#lcljNrBox-bz>div .lcljNr:first").css("margin-left","0");	//第一个div左边距为0

						};
						//$("#lcljNrBox-bz>div .lcljNr").css("height",$("#lcljNrBox-bz").height()-30);//div内容高度
						$("#lcljNrBox-bz>div .lcljNr .nrRap").css("height","100%");//将类容列表高变成100%
						$("#lcljNrBox-bz>div").css("width",314*parseInt($("#lcljNrBox-bz>div>div").length));//计算宽度
						for (var i = 0; i < $("#lcljNrBox-bz>div .nrRap").length; i++) { //添加加载更多的图标
						 	utils.wipeMore($("#lcljNrBox-bz>div .nrRap").eq(i),0);
						}
						//useTransform: false,
						var myscrollbz = new IScroll("#lcljNrBox-bz",{scrollX: true,scrollY: true,click:true,eventPassthrough: true,useTransition: false, useTransform: false});

						$("#LoadedTip").hide();
		    			console.log(response);
		    		}
	    		},
	    		complete: function (XMLHttpRequest, textStatus) {  
				    utils.errorAjax(textStatus,StandardPath,[ljid,bbh]);
				}
    		});
    	}
    	//标准的div内容
    	function pathconut(thisdata,divid){
    		var item=utils.makeArry(thisdata);
			$.each(item, function(index, element) {
    			switch (element.FL) {
                    case "主要诊疗工作":
                    	if(!$("#"+divid).find(".nr").find(".zy_title").length){
                    		$("#"+divid).find(".nr").append('<li class="nr_title zy_title">主要诊疗工作</li>');
                    	} 
                    	$("#"+divid).find(".nr").append('<li id="'+element.XMID+'" class="cilck" data-lei="1"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'</span></li>');
                    	break;
                    case "重点医嘱": 
	                    if(!$("#"+divid).find(".nr").find(".zd_title").length){
	                    	$("#"+divid).find(".nr").append('<li class="nr_title zd_title">重点医嘱</li>');
                    	}
                    	$("#"+divid).find(".nr").append('<li id="'+element.XMID+'" class="cilck" data-lei="2"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'</span></li>');
						break;
					case "重要医嘱": 
	                    if(!$("#"+divid).find(".nr").find(".zd_title").length){
	                    	$("#"+divid).find(".nr").append('<li class="nr_title zd_title">重要医嘱</li>');
                    	}
                    	$("#"+divid).find(".nr").append('<li id="'+element.XMID+'" class="cilck" data-lei="2"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'</span></li>');
						break;
                    case "主要护理工作":
                    	if(!$("#"+divid).find(".nr").find(".hul_titel").length){
	                    	$("#"+divid).find(".nr").append('<li class="nr_title hul_titel">主要护理工作</li>'); 
                    	}
                    	$("#"+divid).find(".nr").append('<li id="'+element.XMID+'" class="cilck" data-lei="3"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'</span></li>');
                    	break;
                    case "护理工作":
                    	if(!$("#"+divid).find(".nr").find(".hul_titel").length){
	                    	$("#"+divid).find(".nr").append('<li class="nr_title hul_titel">护理工作</li>'); 
                    	}
                    	$("#"+divid).find(".nr").append('<li id="'+element.XMID+'" class="cilck" data-lei="3"><span class="fs1 float-left" aria-hidden="true" data-icon=""></span><span class="lujin-li">'+element.XMNR+'</span></li>');
                    	break;
            	};
			});
    		
    		// li点击事件注册
			//var pathlicilckhammer=$("#"+divid).find(".nr").find(".lujin-li").hammer();//将事件注册到
			//pathlicilckhammer.on('tap', function(event) {
			$("#"+divid).find(".nr").find(".lujin-li").on('click', function() {
				pathProject($(this).parent(),divid);
			}) 
		}
		//标准路径下的项目详情
		function pathProject(thisli,divid){
			$(".nr .cilck").removeClass('active');
    		thisli.addClass('active');
			var taph=$("#"+divid).find('.nrRap').scrollTop();//获取滚动条滚动的高度
    		thisli.find('.details').find("ul").remove();
    		var lei=thisli.attr("data-lei");//项目类别
    		var zxid=thisli.attr("id");
    		$("#LoadedTip").show();
    		$.ajax({
    			url: serviceChoose+'/DC_PathWay_GenDetail',
    			type: 'post',
                timeout: utils.timeoutSec(),
                data: JSON.stringify({
                    "IN":
                        {
                            "ZXID": zxid                             //执行ID
                        }
                }),
                dataType: 'json',   
                headers: {
                    'Content-Type': 'application/json'
                },
	    		success:function(response) {
	    			if(response.Result.ERROR){
	    				utils.showHide(response.Result.ERROR.MSG);
	    			}else{	    				
			    		if(thisli.offset().left>400){
			    			thisli.append('<div class="xiang-qing-left details"><div class="tuchu"></div><div class="xq-cont"></div></div>');

			    		}else{
			    			thisli.append('<div class="xiang-qing details"><div class="tuchu"></div><div class="xq-cont"></div></div>');
			    		}    		
			    		$("#linChuang .zhe-zhao").show();
			    		var ZXQK=response.Result.LJYZ.ZXQK;//执行情况
	    			   	thisli.find('.xq-cont').append('<ul><li><font>项目内容：</font>'+ZXQK.XMNR+'</li><li><font>项目类别：</font></li><li><font>执行方式：</font></li><li><font>执行者：</font>'+(ZXQK.ZXZ==1?"医生":"护士")+'</li><li><font>执行说明：</font>'+(ZXQK.NRYQ==null?"无":ZXQK.NRYQ)+'</li><li class="text-lv">医嘱摘要：</li></ul>');
	    			   	if(response.Result.LJYZ.YZLIST==null){   // 有医嘱摘要
	    			   		thisli.find('.xq-cont').append('<li class="xian"></li><li>无内容</li>');
		    			}else{
		    				//有医嘱
		    				var YZXX=response.Result.LJYZ.YZLIST.YZXX;
		    				if (YZXX instanceof Array) {
		    					for (var i = 0; i < YZXX.length; i++) {
		    						var YZQX=YZXX[i].YZQX,//医嘱期效
				    					SJFA=YZXX[i].SJFA==null?"无":YZXX[i].SJFA,//执行时间
				    					YZNR=YZXX[i].YZNR==null?"无":YZXX[i].YZNR,//医嘱内容
				    					DL=YZXX[i].DL==null?"无":YZXX[i].DL,//单量
				    					GYTJ=YZXX[i].GYTJ==null?"无":YZXX[i].GYTJ,//给药途径
				    					ZXPL=YZXX[i].ZXPL==null?"无":YZXX[i].ZXPL,//执行频次
				    					YSZT=YZXX[i].YSZT==null?"无":YZXX[i].YSZT;//医生嘱托
				    					var pagenum=parseInt(i)+1;
		    						thisli.find('.xq-cont').append('<li class="xian"></li><span class="page">'+pagenum+'/'+YZXX.length+'</span><li><font>医嘱期效：</font>'+YZQX+'</li><li><font>执行时间：</font>'+SJFA+'</li><li><font>医嘱内容：</font>'+YZNR+'</li><li><font>单量：</font>'+DL+'</li><li><font>给药途径：</font>'+GYTJ+'</li><li><font>执行频次：</font>'+ZXPL+'</li><li><font>医生嘱托：</font>'+YSZT+'</li>');
		    					}
		    				}else{
		    					var YZQX=YZXX.YZQX,//医嘱期效
			    					SJFA=YZXX.SJFA==null?"无":YZXX.SJFA,//执行时间
			    					YZNR=YZXX.YZNR==null?"无":YZXX.YZNR,//医嘱内容
			    					DL=YZXX.DL==null?"无":YZXX.DL,//单量
			    					GYTJ=YZXX.GYTJ==null?"无":YZXX.GYTJ,//给药途径
			    					ZXPL=YZXX.ZXPL==null?"无":YZXX.ZXPL,//执行频次
			    					YSZT=YZXX.YSZT==null?"无":YZXX.YSZT;//医生嘱托
	    						thisli.find('.xq-cont').append('<li class="xian"></li><span class="page">1/1</span><li><font>医嘱期效：</font>'+YZQX+'</li><li><font>执行时间：</font>'+SJFA+'</li><li><font>医嘱内容：</font>'+YZNR+'</li><li><font>单量：</font>'+DL+'</li><li><font>给药途径：</font>'+GYTJ+'</li><li><font>执行频次：</font>'+ZXPL+'</li><li><font>医生嘱托：</font>'+YSZT+'</li>');
		    				}
		    			}
		    			//项目类别
	    			    switch(lei){
	    			    	case "1":
		    			    	thisli.find('.xq-cont').find('li').eq(1).append('主要诊疗工作');
		    			    	break;
	    			    	case "2":
		    			    	thisli.find('.xq-cont').find('li').eq(1).append('重点医嘱');
		    			    	break;
	    			    	case "3":
		    			    	thisli.find('.xq-cont').find('li').eq(1).append('主要护理工作');
		    			    	break;
	    			    }
	    			   //执行方式
	    			   	switch(ZXQK.ZXFS){
	    			    	case "0":
		    			    	thisli.find('.xq-cont').find('li').eq(2).append('无须执行');
		    			    	break;
	    			    	case "1":
		    			    	thisli.find('.xq-cont').find('li').eq(2).append('每天执行');
		    			    	break;
	    			    	case "2":
		    			    	thisli.find('.xq-cont').find('li').eq(2).append('至少执行一次');
		    			    	break;
	    			    	case "3":
		    			    	thisli.find('.xq-cont').find('li').eq(2).append('必要时执行');
		    			    	break;
	    			    	case "4":
		    			    	thisli.find('.xq-cont').find('li').eq(2).append('必须执行一次');
		    			    	break;
	    			    }
	    			    //项目详情

		    			thisli.find('.details').show();//执行信息div
		    			thisli.find('.details').css("margin-top",-(parseInt(taph)+55));
		    			var libottom=b-thisli.offset().top-30;
						var divhei=thisli.find('.xq-cont').height();
						if(parseInt(libottom)<parseInt(divhei)){
							thisli.find('.xq-cont').css("margin-top",parseInt(libottom)-parseInt(divhei));
						}
						if(b-70<thisli.find('.xq-cont').height()){  //如果屏幕小于信息显示div
							thisli.find('.xq-cont').css("height",b-70);
							thisli.find('.xq-cont').css("margin-top",parseInt(libottom)-parseInt(divhei)+35);
		    			}
		    		}
	    			console.log(response);
	    			$("#LoadedTip").hide();
	    		},
	    		complete: function (XMLHttpRequest, textStatus) {  
				    utils.errorAjax(textStatus,pathProject,[thisli,divid]);
				}
    		});
		}
		//住院天数选择
		var dayChoseListhammer=$("#dayChose-list .zhankai").hammer();
		dayChoseListhammer.on('tap', function(event) {
			huoquname($(this),$("#lcljNrBox .lcljNr"),1);
		});
		//住院天数选择 标准
		var dayChosbzhammer=$("#dayChose-bz .zhankai").hammer();
		dayChosbzhammer.on('tap', function(event) {
			huoquname($(this),$("#lcljNrBox-bz .lcljNr"),2);
		});
		//获取住院div的名字和id
		function huoquname(thisdiv,idName,a){
			if(thisdiv.find('span').hasClass('zhank')){
				thisdiv.find('span').remove();
				thisdiv.append('<span class="fs1 shous" aria-hidden="true" data-icon=""></span>')
				var listarry=[];
				var idarry=[];
				for( var i=0;i<idName.length;i++){
					listarry.push(idName.eq(i).find('.title').text());
					idarry.push(idName.eq(i).attr("id"));
				}
				thisdiv.parent().find(".choseUL li").remove();
				for (var j = 0; j < idarry.length; j++) {  //列表追加
					thisdiv.parent().find(".choseUL").append('<li><a href="#'+idarry[j]+'">'+listarry[j]+'</a></li>')
				}
				// thisdiv.parent().find(".choseUL").removeClass('animated fadeOutLeft').addClass('animated fadeInLeft');
				 donghua(thisdiv.parent().find(".choseUL"),1)
			}else{
				thisdiv.find('span').remove();
				thisdiv.append('<span class="fs1 zhank" aria-hidden="true" data-icon=""></span>');
				// thisdiv.parent().find(".choseUL").removeClass('animated fadeInLeft').addClass('animated fadeOutLeft');
				donghua(thisdiv.parent().find(".choseUL"),0)
			}
			var dayChosbzlistlihammer=$("#dayChose-list .choseUL li").hammer();  //住院天数导航
			dayChosbzlistlihammer.on('tap', function(event) {
				var theind=$(this).index();
				$("#lcljNrBox .lcljNr").eq(theind).addClass('lj-daychose');
				setTimeout(function(){ 
					$("#lcljNrBox .lcljNr").eq(theind).removeClass('lj-daychose');//选中样式移除
    			},500);
			});
			var dayChosbzlihammer=$("#dayChose-bz .choseUL li").hammer();   // 标准 住院天数导航
			dayChosbzlihammer.on('tap', function(event) {
				var theindex=$(this).index();
				$("#lcljNrBox-bz .lcljNr").eq($(this).index()).addClass('lj-daychose');
				setTimeout(function(){
					$("#lcljNrBox-bz .lcljNr").eq(theindex).removeClass('lj-daychose');//选中样式移除
    			},500);
			});
		}
		
		//控制动画
		function donghua(thisId,nooryes){
			if(nooryes==1){
				thisId.removeClass('animated fadeOutLeft');
				thisId.addClass('animated fadeInLeft');
				thisId.css("display","block");
			}else{
				thisId.removeClass('animated fadeInLeft');
				thisId.addClass('animated fadeOutLeft');
				setTimeout(function(){ 
    				thisId.css("display","none");			
    			}, 550);
			}
		}
	}

	//临床路径的pageID切换
	function lcpageid(thisli){
		if(thisli.text()!=$("#lj-dengji").text()){
			$("#dengjiUlStyle-lj ul li").removeClass('changClass');
			thisli.addClass('changClass');
	    	$("#dengJi").text(thisli.text()); //信息小卡 的pageid
			$("#lj-dengji").text(thisli.text());  //临床路径 的pageid
			$("#slzyID").attr("data-pageid",thisli.text()); //b绑定的pageid
			$("#lcljCard > .voiceAndphoto-ll").removeClass('animated fadeIn').addClass('animated fadeOut');
			$("#dengjiUlStyle-lj").removeClass('animated fadeIn').addClass('animated fadeOut');
			setTimeout(function(){ 
				$("#lcljCard > .voiceAndphoto-ll").css("display","none");
	    		$("#dengjiUlStyle-lj").css("display","none");
			}, 1000);
			
		};
		clinic();
	};
	//位置判定
    //var leftjstur = new Hammer(document.getElementById("lcljNrBox"));
    //leftjstur.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL});
	return{
		clinic:clinic
	};

});
