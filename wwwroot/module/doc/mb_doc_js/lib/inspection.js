/*
	检验报告
	1、列表加载，默认加载第一个检验报告；
	2、点击列表，加载对应检验报告。
	3、如果有相同的检验报告单，则可以对比。
*/
define(["jquery", "hammer","jqueryhammer","utils","echarts"], function(jquery, hammer, jqueryhammer,utils,echarts) {
	
	var serviceChoose = utils.urlFunction();

	function inspection() {
        //计算时间2
        // var theSJC=0;
        // function shiJianJiSuan(d,dd){  //d是Date()对象
        //     var time1=d.getTime();
        //     var time2=dd.getTime();
        //     theSJC=time2-time1;
        // }
        // var d = new Date(); //获取时间
        //参数获取
        var pageID=$("#slzyID").attr("data-pageID");
        var patiID=$("#slzyID").attr("data-patiID");
        var isBaby=$("#slzyID").attr("data-baby");
        if(isBaby=="no"){
            var baby=0
        }else {
            baby=1
        }
        $("#changeJianChaJianyan").text("检验报告 | "); //改变导航条
        $("#fuJian2").text("");                          // 清空导航条显示
		$("#mainNavMinTwojy").show();
        $("#mainNavMinTwojy>.btBox>span").text();        // 清空检验列表条数	
		$("#inspection li").remove();                    // 清空检验列表
        $("#PDFdivWrapBG>div").remove();                 // 清空检验iframe容器		
		//检验报告 列表    
        jyreport();  
        function jyreport(){
        	$("#LoadedTip").show();
			var TempserviceChoose ='../api/services/doc/Lis';
            $.ajax({
                url: TempserviceChoose + '/DC_Prove_List',
                type: "post",
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
	            timeout:utils.timeoutSec(),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
	            success: function (responseTxt) {
	                // var dd = new Date(); //获取时间
	                // shiJianJiSuan(d,dd);
	                // console.log("列表加载时间"+theSJC);  
					// debugger;
					if(responseTxt.Result.ERROR){
	                    $("#LoadedTip").hide();
						utils.showHide(responseTxt.Result.ERROR.MSG);   
						//utils.errorAjax("error",jyreport,[])
					}else{
						var check_BL,check_WSW,bgNum=0,fetech=0;
						//为病理
						if(responseTxt.Result.BL !='{}'){
							check_BL = responseTxt.Result.BL;
						}
						if(responseTxt.Result.WSW){
							check_WSW = responseTxt.Result.WSW;
						}
                        if (responseTxt.Result.ITEMLIST) {
                            fetch = 1;
							// 计算iframe容器高度
							var iframeBoxHeight = $(window).height()-65;
							//多条数据 数组
                            if (responseTxt.Result.ITEMLIST.ITEM instanceof Array) {
                                bgNum++;
								$("#mainNavMinTwojy>.btBox>span").text("（"+ responseTxt.Result.ITEMLIST.ITEM.length +"）");
								var textCont=responseTxt.Result.ITEMLIST.ITEM;
								for (var i=0; i<textCont.length;i++) {
									var SHSJ = textCont[i].SHSJ,
									SHSJsplit = SHSJ.split(" "),
									SHSJTime = SHSJsplit[0];

									// 根据名称判断是否有相同的数据，有的话，则绑定可对比的标记
									var dataDB="no";
									
									$(textCont).each(function(jyi,jyvalue){  //需测试
										jyvalue.Type = 1;
										var outDate = textCont[i].SHSJ.split(" ")[0];
										var intDate = jyvalue.SHSJ.split(" ")[0];
										var mouthCount = utils.mouthDays(outDate,intDate);         // 相距时间是否在一个月之内 后续要改 艾华
                                        if (mouthCount) {
                                            if (!$.isEmptyObject(textCont[i].JYXM)&& textCont[i].JYXM.indexOf(",") != -1){  //当前值是否有逗号
												var arry=textCont[i].JYXM.split(",");
												for (var j = 0; j < arry.length; j++) {
													var nameArry=[];
													if(jyvalue.JYXM.indexOf(",")!=-1){    //当前比对值是否有逗号
														nameArry=jyvalue.JYXM.split(",");
														for (var m = 0; m < nameArry.length; m++) {
															if(nameArry[m]==arry[j] && jyi!==i){ 
																dataDB="yes";
																return false;
															}
														}
													}else{

														if(jyvalue.JYXM==arry[j] && jyi!==i){ 
															dataDB="yes";
															return false;
														}
													}
													
												}
											}else{
                                                if (!$.isEmptyObject(jyvalue.JYXM) &&jyvalue.JYXM.indexOf(",")!=-1){ //比对值是否有逗号
													nameArry=jyvalue.JYXM.split(",");
													for (var h = 0; h < nameArry.length; h++) {
														if(nameArry[h]==textCont[i].JYXM && jyi!==i){ 
															dataDB="yes";
															return false;
														}
													}
												}else{
													if(textCont[i].JYXM==jyvalue.JYXM && jyi!==i){ 
														dataDB="yes";
														return false;
													}
												}
												
											}
										}
										
									});
                                     if(!textCont[i].Type){
										 textCont[i].Type = 1;
									 }
									//绑定数据方便调用 
									var examineLi ="<li class='inspectionLi' data-db='"+dataDB+"' data-IsNew='"+textCont[i].IsNew+"' data-tag='"+textCont[i].Type+"' data-id='"+textCont[i].ID+"' data-YZID='"+textCont[i].YZID+"' data-BBID='"+textCont[i].ID+"' data-LX='"+textCont[i].LX+"' id='inspectionLi-" + textCont[i].ID + "_"+i+"'><span>" + textCont[i].JYXM + "</span><p>" + textCont[i].JYR + " "+SHSJTime+ "</p></li>";
									$("#inspection").append(examineLi); 
	                                var iframeDIV= "<div style='height:auto' class='iframeRongQi' id='iframe-" + textCont[i].ID + "_"+i+"'><div id='dom-"+textCont[i].ID+"_"+i+"' class='zheZhao' style='display:none'></div></div>"; //添加相应的Iframe容器
	                                $("#PDFdivWrapBG").append(iframeDIV);

								}
								//var hammerJYBG = $("#inspection li").hammer();
								//hammerJYBG.on("tap",function(){
								//	addData($(this));
								//});
							//一条数据 不是数组
							}else{
								$("#mainNavMinTwojy>.btBox>span").text("（1）");
								var textCont=responseTxt.Result.ITEMLIST.ITEM;
								var SHSJ = textCont.SHSJ,
								SHSJsplit = SHSJ.split(" "),
								SHSJTime = SHSJsplit[0];
								var examineLi ="<li class='inspectionLi' data-id='"+textCont.ID+"' data-YZID='"+textCont.YZID+"' data-BBID='"+textCont.ID+"' data-LX='"+textCont.LX+"' id='inspectionLi-" + textCont.ID + "'><span>" + textCont.JYXM + "</span><p>" + textCont.JYR + " "+SHSJTime+ "</p></li>";
								$("#inspection").append(examineLi);
                                var iframeDIV= "<div style='height:auto' class='iframeRongQi' id='iframe-" + textCont.ID + "'><div id='dom-"+textCont.ID+"' class='zheZhao' style='display:none'></div></div>"; //添加相应的Iframe容器
                                $("#PDFdivWrapBG").append(iframeDIV);
								
							}
							//默认选中第一条
							//addData($("#inspection li:first"));
							//$("#inspection li:first").addClass('XuanZhong');
						}
                        if (responseTxt.Result.WSW && responseTxt.Result.WSW != '') {
                            bgNum++;
							if(JSON.parse(responseTxt.Result.WSW).length > 0){
								JSON.parse(responseTxt.Result.WSW).forEach(function(wvalue,wn){
									wvalue.Type = 3;
									var SHSJTime = wvalue.occur_time.split(" ")[0];
									//绑定数据方便调用
                                    var examineLi = "<li class='inspectionLi' data-tag='" + wvalue.Type + "' data-url='" + wvalue.url + "'  id='wsw_"+wn+"'><span>" + wvalue.name + "</span><p>" + wvalue.occur_staff + " "+SHSJTime+ "</p></li>";
                                    $("#inspection").append(examineLi);
                                    var iframeDIV = "<div style='height:auto' class='iframeRongQi' id='iframe-wsw_" + wn + "'><div id='dom-" + wvalue.occur_time + "_" + wn + "' class='zheZhao' style='display:none'></div></div>"; //添加相应的Iframe容器
									$("#PDFdivWrapBG").append(iframeDIV);
								})
                                //添加成功注册点击事件
                                //if (fetch == 0) {
                                //    fetch =1;
                                //    var hammerOnly = $("#inspection li").hammer();
                                //    hammerOnly.on("tap", function () {
                                //        addData($(this));
                                //    });
                                //}
								
							}
							//默认选中第一条
							//addData($("#inspection li:first"));
							//$("#inspection li:first").addClass('XuanZhong');
						}
						if(responseTxt.Result.BL && responseTxt.Result.BL!=''){
                            if (JSON.parse(responseTxt.Result.BL).length) {
                                bgNum++;
								JSON.parse(responseTxt.Result.BL).forEach(function(blalue,wb){
									blalue.Type = 2;
									var SHSJTime = blalue.occur_time.split(" ")[0];
									//绑定数据方便调用
                                    var examineLi = "<li class='inspectionLi' data-tag='" + blalue.Type + "' data-url='" + blalue.url + "' id='bl_" + wb + "_"+wb+"'><span>" + blalue.name + "</span><p>" + blalue.occur_staff + " "+SHSJTime+ "</p></li>";
									$("#inspection").append(examineLi);
                                    var iframeDIV = "<div style='height:auto' class='iframeRongQi' id='iframe-bl_"+wb+"'><div id='dom-"+blalue.name+"_"+wb+"' class='zheZhao' style='display:none'></div></div>"; //添加相应的Iframe容器
									$("#PDFdivWrapBG").append(iframeDIV);
								})
								//添加成功注册点击事件
								//var hammerOnly = $("#inspection li").hammer();
								//hammerOnly.on("tap",function(){
								//	addData($(this));
								//});
							}
							//默认选中第一条
							//addData($("#inspection li:first"));
							//$("#inspection li:first").addClass('XuanZhong');
						}
                        if (bgNum == 0) {
                            $("#mainNavMinTwojy>.btBox>span").text("（0）");
                            utils.showHide("没有检验报告");
                            $("#LoadedTip").hide();
                        } else {
                            //添加成功注册点击事件
                            var hammerOnly = $("#inspection li").hammer();
                            hammerOnly.on("tap", function () {
                                addData($(this));
                            });
                        }
						addData($("#inspection li:first"));
						$("#inspection li:first").addClass('XuanZhong');
					} 
	            }, 
	            complete: function (XMLHttpRequest, textStatus) {  
				    utils.errorAjax(textStatus,jyreport,[]);
				}
	        });
        }
        //加载检验报告 内容
        function addData(thisdata) {
            $('.row-fluid img').remove();
			// 如果可对比
			var dbLabel = thisdata.attr("data-db");
			$("#huaDongBaoGao .jybg_dbButton").remove();
			if(dbLabel=="yes"){
				$("#huaDongBaoGao>.row-fluid:first").append('<div class="jybg_dbButton">对比</div>');
				// 注册事件
				var hammerjybg_db = $("#huaDongBaoGao .jybg_dbButton").hammer();
				hammerjybg_db.on("tap",function(){
					IndexComparison();
				});
			}
            //添加选中
            $("#examine li").removeClass('XuanZhong');
            $("#inspection li").removeClass('XuanZhong');
            thisdata.addClass('XuanZhong');
            $("#fuJian2").html(thisdata.children('span').text());  //导航条显示
			if(thisdata.attr("data-tag") == 1){
				var fileId=thisdata.attr("id").split('-')[1];
				var iframeId="iframe-"+fileId;   //iframe 容器的ID
                var tempIsNew = thisdata.attr("data-IsNew");//是否是新数据
				// 获取数据
				var yzID=thisdata.attr("data-YZID");
				var lx=thisdata.attr("data-LX");
				var bbID=thisdata.attr("data-BBID");
			}else{
				var fileId=thisdata.attr("id");
				var iframeId="iframe-"+fileId;   //iframe 容器的ID
			}
            if($("#"+iframeId).find('iframe').length>0){ //是否为第一次加载
                $("#PDFdivWrapBG>div").hide();
                $("#"+iframeId).show();
                $("#LoadedTip").hide(); 
            }else{
                $("#LoadedTip").show();
				var tempIN = {};
				if(thisdata.attr("data-tag") == 1){
					tempIN =
					{
						"LX": lx,              //类型
						"YZID": yzID,         //医嘱ID
						"BBID": bbID,         //标本ID
						"JGCS": "0",
						"WSW": "0",
                        "IsNew":tempIsNew,
						"Type":thisdata.attr("data-tag")
					}
				}else{
				     tempIN =
					 {
						 "Type": thisdata.attr("data-tag"),
						 "PatientID": JSON.parse(localStorage.currentPatient).PATIID,
						 "Url": thisdata.attr("data-url")
					 }
				}
				var tempserviceChoose='../api/services/doc/Lis';
                $.ajax({
                    url: tempserviceChoose +"/DC_Prove_Data",
                    type: "post",
                    timeout: utils.timeoutSec(),
                    data: JSON.stringify({
                            "IN":tempIN
                    }),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function(responseTxt){
                        // var ddd = new Date();
                        // shiJianJiSuan(d,ddd);
                        // console.log("内容加载时间"+theSJC);
                        console.log(responseTxt);
                        if(responseTxt.Result.ERROR){
                            $("#LoadedTip").hide();
                            utils.showHide(responseTxt.Result.ERROR.MSG);                            
                        }else{
							if(thisdata.attr("data-tag") == 1){
								// 将内容在显示在相应的容器中
								$("#"+iframeId).append('<iframe id="jcbgIfID'+fileId+'" class="row-fluid" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>');
								$("#"+iframeId).find('iframe').attr("src",responseTxt.Result.FILE);//返回html存储路径
								//$("#"+iframeId).find('iframe').attr("height",$(window).height()-64);

								document.getElementById("jcbgIfID"+fileId).onload=function(){
									// 加载完成后获取高度
									// var gaoDu = $(window.frames["jcbgIfID"+fileId].contentWindow.document.body).find("div").height();
									var gaoDu = document.getElementById("jcbgIfID"+fileId).contentWindow.document.body.offsetHeight;
									// 设置遮罩层和iframe的高度
									$("#dom-"+fileId).css("height",gaoDu);
									console.log($("#dom-"+fileId));
									$("#jcbgIfID"+fileId).css("height",gaoDu);
									// 放大缩小初始化
									utils.CSHpanzoom(iframeId);
								}
                            } else {
								var pdfBox = 'PDFdivWrapBG';   // pdf 容器的id
								//utils.stopScroll("#"+pdfBox,".tableBodyDiv");
								var imgUrl = responseTxt.Result.FILE;
								var imgCount = responseTxt.Result.PageCount;
								for (var i = 1; i <= parseInt(imgCount); i++) {
									$("#" + pdfBox).append('<img style="z-index:10000;" src="' + imgUrl + '_' + i + '.Jpeg"/>');
								}
								utils.CSHpanzoom(pdfBox);
							}
                            $("#PDFdivWrapBG>div").hide(); //所有iframe容器隐藏
                            $("#"+iframeId).show();    //显示选中的iframe

    						$("#LoadedTip").hide();
                        }
                    },
                    complete: function (XMLHttpRequest, textStatus) {  
					    utils.errorAjax(textStatus,addData,[thisdata]);
					}
                });
            }
        }
	}

	// 指标对比
	function IndexComparison(){
		var thisLi = $("#inspection .XuanZhong");
		var thisLiLx = thisLi.attr("data-lx");
		var thisLiYzid = thisLi.attr("data-yzid");
		var thisLiBbid = thisLi.attr("data-id");
		var tempIsNew = thisLi.attr("data-IsNew");//是否是新数据
		$("#LoadedTip").show();
		var tempserviceChoose='../api/services/doc/Lis';
		$.ajax({
            url: tempserviceChoose + "/DC_GetProveConstrastData",
            type: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: utils.timeoutSec(),
            data: JSON.stringify({
                    "IN": {
                        "LX": thisLiLx,                        //0是新版,1是老板
                        "YZID": thisLiYzid,                    //医嘱ID
                        "BBID": thisLiBbid,                    //标本ID
						"IsNew":tempIsNew,
                        "FW": "30"                             //取历史指标的范围，默认传30，表示30天以内的数据
                    }                
            }),
            dataType: 'json',    
            success:function(responseTxt) {	
            	if(responseTxt.Result.OUTPUT){//未返回数据
            		var headTh = '';  //表头时间
					var tableTh = '';   //表头全部内容
					var tableTd = '';    //表内容
					var touchImg = ''; //手势
					var R = responseTxt.Result.OUTPUT.DATA.R;
					//var VALUE = R[0].VALUES.VALUE;//有几个对比项
                    var TAB = responseTxt.Result.OUTPUT.DATA.TAB ; //表头时间
					var VALUE=TAB=== undefined?"":TAB.split(",");
					for (var t = 0; t < VALUE.length; t++) {
						headTh = headTh + '<td>'+VALUE[t]+'</td>';
					}
					tableTh = '<tr><td>项目名称</td><td>单位</td><td>参考值</td>'+headTh+'</tr>';
					if(VALUE.length >4){ // 超过4个值 则追加横向手势按钮
						touchImg='<img src="img/touchLeft.png" class="imgLeft" /><img src="img/touchRight.png" class="imgRight" />';
					}
					//头部table
					var headTa='<table class="tb"><tbody>'+tableTh+'</tbody></table>';
					//内容table
					//var conTa='<table class="tb"><tbody></tbody></table>';
					$(".jybj-wrap").remove();
					$(".jybg_dbBox").remove();
					$("body").append('<div class="jybj-wrap"></div><div class="jybg_dbBox" id="jybg_dbBox"><p>检验指标对比</p><div class="headdiv">'+headTa+'</div><div class="countdiv"><table class="tb"><tbody></tbody></table></div>'+touchImg+'</div>');
					$(R).each(function(index,el){
						var dataBt='<td class="oneline">'+el.MC+'</td><td>'+(el.DW!==null?el.DW:"")+'</td><td>'+(el.CK!==null?el.CK:"")+'</td>';
						var dataStr='';
						if(el.VALUES!==null){
							//for(var i=el.VALUES.VALUE.length-1; i>=0; i--){
							if(VALUE.length==el.VALUES.VALUE.length){ //对比数据和表头是否一样长
								for(var i=0; i<el.VALUES.VALUE.length; i++){
									var v = el.VALUES.VALUE[i];   //检验值
									// // 如果是第一条 提取表头时间
									// if(index==0){
									// 	headTh = headTh + '<td>'+v.JYSJ+'</td>';
									// }
									if(v.JYZ!==null){ //检验值
										//参考值是否存在
										if(el.CK!==null){  
											var ckMax = parseFloat(el.CK.split("～")[1]);
											var ckMin = parseFloat(el.CK.split("～")[0]);
										}
										// 判断是否超过参考范围
										var JYZ = parseFloat(v.JYZ);
										if(JYZ>ckMax){
											dataStr = dataStr + '<td style="background:rgba(255, 0, 0, 0.5);"><label data-byl="'+(v.BYL==null?0:v.BYL)+'">'+v.JYZ+'</label><span class="fs1" aria-hidden="true" data-icon=""></span></td>';
										}else if(JYZ<ckMin){
											dataStr = dataStr + '<td style="background:rgba(255, 177, 0, 0.47);"><label data-byl="'+(v.BYL==null?0:v.BYL)+'">'+v.JYZ+'</label><span class="fs1" aria-hidden="true" data-icon=""></span></td>';
										}else{
											dataStr = dataStr + '<td><label data-byl="'+(v.BYL==null?0:v.BYL)+'">'+v.JYZ+'</label></td>';
										}
									}else{dataStr = dataStr + '<td></td>';} 
								}
								$("#jybg_dbBox .countdiv .tb tbody").append('<tr data-jgz="'+el.JGZ.YMAX+'|'+el.JGZ.YMIM+'" data-byl="'+el.BYL.YMAX+'|'+el.BYL.YMIM+'">'+dataBt+dataStr+'</tr>');
							}else{
								var tdstring="",currentTD;
								for (var m = 0; m < VALUE.length; m++) {
									tdstring=tdstring+'<td></td>'
								}
								$("#jybg_dbBox .countdiv .tb tbody").append('<tr data-jgz="'+el.JGZ.YMAX+'|'+el.JGZ.YMIM+'" data-byl="'+el.BYL.YMAX+'|'+el.BYL.YMIM+'">'+dataBt+tdstring+'</tr>');
								for(var n=0; n<el.VALUES.VALUE.length; n++){
									var v = el.VALUES.VALUE[n];   //检验值
									for (var f = 0; f < VALUE.length; f++) {
										if(v.JYSJ==VALUE[f]){
											currentTD=f;
											currentTD=parseInt(currentTD)+3;
											break;
										}
									}
									if(el.CK!==null){  
											var ckMax = parseFloat(el.CK.split("～")[1]);
											var ckMin = parseFloat(el.CK.split("～")[0]);
										}
									// 判断是否超过参考范围
									var JYZ = parseFloat(v.JYZ);
									if(JYZ>ckMax){  //添加 .td-red
										dataStr = '<label data-byl="'+(v.BYL==null?0:v.BYL)+'">'+v.JYZ+'</label><span class="fs1" aria-hidden="true" data-icon=""></span>'; 
										$("#jybg_dbBox .countdiv .tb tbody tr").eq(index).find("td").eq(parseInt(currentTD)).append(dataStr).addClass('td-red');
									}else if(JYZ<ckMin){  //添加.td-yellow
										dataStr =  '<label data-byl="'+(v.BYL==null?0:v.BYL)+'">'+v.JYZ+'</label><span class="fs1" aria-hidden="true" data-icon=""></span>';
										$("#jybg_dbBox .countdiv .tb tbody tr").eq(index).find("td").eq(parseInt(currentTD)).append(dataStr).addClass('td-yellow');
									}else{
										dataStr = '<label data-byl="'+(v.BYL==null?0:v.BYL)+'">'+v.JYZ+'</label>';
										$("#jybg_dbBox .countdiv .tb tbody tr").eq(index).find("td").eq(parseInt(currentTD)).append(dataStr);
									}
									
								}
							}
						}
					});
					$(".jybj-wrap").show();  //遮罩层
					//$(".jybg_dbBox").addClass("animated bounceInRight").show();
					 $(".jybg_dbBox").show();
					$(".jybj-wrap").on("touchend",function(event){
						$(".jybg_dbBox").removeClass("animated bounceInRight").addClass("animated bounceOutRight");
						setTimeout(function(){
							$(".jybj-wrap").hide();
							$(".jybg_dbBox").hide();
						},500)
					});

					//计算td的宽度
					if(VALUE.length<4||VALUE.length==4){  //比对值小于等于4个
						var tdCount = $("#jybg_dbBox .headdiv .tb td").length-1;
						var tdWidth = ($("#jybg_dbBox").width()-460)/tdCount;	
						$("#jybg_dbBox .headdiv .tb td").css("width",tdWidth+"px");
						$("#jybg_dbBox .countdiv table tr td").css("width",tdWidth+"px");
						$("#jybg_dbBox .headdiv .tb td:first").css("width","200px");
						$("#jybg_dbBox .countdiv table tr td:first").css("width","200px");	

						$("#jybg_dbBox .headdiv .tb td").eq(1).css("width","130px");
						$("#jybg_dbBox .countdiv table tr td").eq(1).css("width","130px");

						$("#jybg_dbBox .headdiv .tb td").eq(2).css("width","130px");
						$("#jybg_dbBox .countdiv table tr td").eq(2).css("width","130px");				
					}else if(VALUE.length>4){  //大于四个比较
						var tdCount = $("#jybg_dbBox .headdiv .tb td").length-3;
						var tdWidth = ($("#jybg_dbBox").width()-450)/4;	
						$("#jybg_dbBox .headdiv .tb td").css("width",tdWidth+"px");
						$("#jybg_dbBox .countdiv table tr td").css("width",tdWidth+"px");

						$("#jybg_dbBox .headdiv .tb td:first").css("width",tdWidth+"px");//200
						$("#jybg_dbBox .countdiv table tr td:first").css("width",tdWidth+"px");

						$("#jybg_dbBox .headdiv .tb td").eq(1).css("width",tdWidth+"px");//120
						$("#jybg_dbBox .countdiv table tr td").eq(1).css("width",tdWidth+"px");
						$("#jybg_dbBox .headdiv .tb td").eq(1).css("padding","0 40px");
						$("#jybg_dbBox .headdiv .tb td").eq(2).css("width",tdWidth+"px");//130
						$("#jybg_dbBox .countdiv table tr td").eq(2).css("width",tdWidth+"px");
						// $("#jybg_dbBox .headdiv  table").css("width",(460+4*tdWidth)+"px");//控制只显示4个
						// $("#jybg_dbBox .countdiv table").css("width",(460+4*tdWidth)+"px");	
						//给当前显示的td加标志
						for (var i = 3; i < $("#jybg_dbBox .headdiv .tb td").length; i++) {
							if(i<7){
								$("#jybg_dbBox .headdiv .tb td").eq(i).addClass('thisW').show();
								for (var n = 0; n <$("#jybg_dbBox .countdiv .tb tr").length; n++) {
									$("#jybg_dbBox .countdiv .tb tr").eq(n).find('td').eq(i).addClass('thisW').show();
								} 
							}else{
								$("#jybg_dbBox .headdiv .tb td").eq(i).addClass('thisHide').hide();
								for (var j = 0; j <$("#jybg_dbBox .countdiv .tb tr").length; j++) {
									$("#jybg_dbBox .countdiv .tb tr").eq(j).find('td').eq(i).addClass('thisHide').hide();
								} 
							}
						};
						$("#jybg_dbBox .imgRight").on("touchstart",function(event){
							event.stopPropagation();    //  阻止事件冒泡
							event.preventDefault();     //  阻止默认行为 ( 表单提交 )
							$(this).css("opacity","0.5");
						});

						$("#jybg_dbBox .imgRight").on("touchend",function(event){
							event.stopPropagation();    //  阻止事件冒泡
							event.preventDefault();     //  阻止默认行为 ( 表单提交 )
							$(this).css("opacity","1");	
							RightMove($(this));
						});

						$("#jybg_dbBox .imgLeft").on("touchstart",function(event){
							event.stopPropagation();    //  阻止事件冒泡
							event.preventDefault();     //  阻止默认行为 ( 表单提交 )	
							$(this).css("opacity","0.5");
						});
						$("#jybg_dbBox .imgLeft").on("touchend",function(event){
							event.stopPropagation();    //  阻止事件冒泡
							event.preventDefault();     //  阻止默认行为 ( 表单提交 )	
							$(this).css("opacity","1");
							leftMove($(this));
						});			
					}
					//计算内容table的高度
					//var countheight=$("#jybg_dbBox").height()-$("#jybg_dbBox>p").height()-$("#jybg_dbBox>.headdiv").height()-15;
					//$("#jybg_dbBox .countdiv").css("height",countheight);

					// //内容table距顶部的高
					var contTop=parseInt($("#jybg_dbBox .headdiv").height()) + 55
					$("#jybg_dbBox .countdiv").css('top', contTop);
					$("#jybg_dbBox .countdiv").css('width',$("#jybg_dbBox .headdiv").width());
					// 注册关闭事件
					var hammerjybg_dbBox = $(".jybg_dbBox").hammer();
					hammerjybg_dbBox.on("swiperight",function(){
						$(".jybg_dbBox").removeClass("animated bounceInRight").addClass("animated bounceOutRight");
						setTimeout(function(){
							$(".jybj-wrap").hide();
							$(".jybg_dbBox").hide();
						},500)
					});
					// 注册图表点击事件
					var hammerchart = $(".jybg_dbBox table tr").hammer();
					hammerchart.on("tap",function(){
						addChart($(this));
					});
            	}else{
            		//utils.showHide(responseTxt.Result);
                    utils.showHide('返回对比数据出错或为空');
            	}	
				
				$("#LoadedTip").hide();
			},
			complete: function (XMLHttpRequest, textStatus) {  
			    utils.errorAjax(textStatus,IndexComparison,[]);
			}
		});
	}
    //指标右移动
    function RightMove(thisimg) {
    	var tdNum= $("#jybg_dbBox .headdiv .tb td"),currentShow;
    	for (var i = 3; i < tdNum.length; i++) {
    		if(tdNum.eq(i).hasClass('thisW')){
    			currentShow = tdNum.eq(i).index();
    			break;
    		}
    	}
    	var beyond=parseInt(currentShow)+4;
    	if(parseInt(beyond)< parseInt(tdNum.length)){
    		tdNum.eq(beyond).removeClass('thisHide').addClass('thisW').show();
    		tdNum.eq(parseInt(currentShow)).removeClass('thisW').addClass('thisHide').hide();
    		for (var j = 0; j <$("#jybg_dbBox .countdiv .tb tr").length; j++) {
				$("#jybg_dbBox .countdiv .tb tr").eq(j).find('td').eq(beyond).removeClass('thisHide').addClass('thisW').show();
    			$("#jybg_dbBox .countdiv .tb tr").eq(j).find('td').eq(parseInt(currentShow)).removeClass('thisW').addClass('thisHide').hide();
			}
    	}
    	if(tdNum.eq(parseInt(tdNum.length)-1).hasClass('thisHide')){
	    	$("#jybg_dbBox .imgRight").show();
	    }else{
	    	$("#jybg_dbBox .imgRight").hide();
	    }
	    if(tdNum.eq(3).hasClass('thisHide')){
	    	$("#jybg_dbBox .imgLeft").show();
	    }else{
	    	$("#jybg_dbBox .imgLeft").hide();
	    }
    }
    //指标z左移动
    function  leftMove(thisimg) {
    	var tdNum= $("#jybg_dbBox .headdiv .tb td"),currentShow=-1;
    	for (var i = 3; i < tdNum.length; i++) {
    		if(tdNum.eq(i).hasClass('thisW')){
    			if(tdNum.eq(i).prev().hasClass('thisHide')){
    				currentShow = tdNum.eq(i).index()-1;
    				break;
    			}
    		}
    	}
    	if(currentShow!=-1){
    		var beyond=parseInt(currentShow)+4;
	    	if(parseInt(beyond)< parseInt(tdNum.length)){
	    		tdNum.eq(parseInt(currentShow)).removeClass('thisHide').addClass('thisW').show();
	    		tdNum.eq(beyond).removeClass('thisW').addClass('thisHide').hide();
	    		for (var j = 0; j <$("#jybg_dbBox .countdiv .tb tr").length; j++) {
					$("#jybg_dbBox .countdiv .tb tr").eq(j).find('td').eq(parseInt(currentShow)).removeClass('thisHide').addClass('thisW').show();
	    			$("#jybg_dbBox .countdiv .tb tr").eq(j).find('td').eq(beyond).removeClass('thisW').addClass('thisHide').hide();
				}
				// $("#jybg_dbBox .imgLeft").show();
				if(parseInt(beyond) == parseInt(tdNum.length)){
					$("#jybg_dbBox .imgRight").hide();
				}
	    	}
	    }
	    if(tdNum.eq(3).hasClass('thisHide')){
	    	$("#jybg_dbBox .imgLeft").show();
	    }else{
	    	$("#jybg_dbBox .imgLeft").hide();
	    }
	    if(tdNum.eq(parseInt(tdNum.length)-1).hasClass('thisHide')){
	    	$("#jybg_dbBox .imgRight").show();
	    }else{
	    	$("#jybg_dbBox .imgRight").hide();
	    }
    }

	// 追加图表
	function addChart(thisTr){
		$(".jybg_dbBox table tr").removeClass("activeTr");
		thisTr.addClass("activeTr");
		// 每个日期都有数据才对比
		if(thisTr.find("label").length >= 2){
			$(".jybgChartBox").remove();
			$("body").append('<div class="jybgChartBox"><div class="chartBox"><ul><li class="active firLi">结果值</li><li class="lasLi">变异率</li></ul><div class="chart" id="jydbChart"></div></div></div>');
			// 准备X轴和曲线数据
			var xData = [],            // X轴 
				chartData = [],        // 曲线数据 结果值
				chartBylData = [];     // 曲线数据 变异率
			for(var i=3;i<thisTr.find("td").length;i++){
				
				if(thisTr.find("td").eq(i).children("label").text()!=""&&thisTr.find("td").eq(i).children("label").text()!=null){
					var timesplit=$("#jybg_dbBox .headdiv  table tr:first>td").eq(i).text();
					var x1=timesplit.split(" ")[0],x2=timesplit.split(" ")[1];
					var xx=x1.substr(5,x1.length)+" "+x2.substr(0,x2.length-3);
					xData.push(xx);
					chartData.push(parseFloat(thisTr.find("td").eq(i).children("label").text()));
					chartBylData.push(parseFloat(thisTr.find("td").eq(i).children("label").attr("data-byl")));
				}
			}		
			// Y轴数据 结果值
			var jgzmax = parseFloat(thisTr.attr("data-jgz").split("|")[0]);   // 最大刻度
			var jgzmin = parseFloat(thisTr.attr("data-jgz").split("|")[1]);   // 最小刻度
			var jgzJj = (jgzmax - jgzmin)/10;                                 // 间隔值
			var yData = {"max":jgzmax,"min":jgzmin,"interval":jgzJj};
			// Y轴数据 变异率
			var bylmax = parseFloat(thisTr.attr("data-byl").split("|")[0]);   // 最大刻度
			var bylmin = parseFloat(thisTr.attr("data-byl").split("|")[1]);   // 最小刻度
			var bylJj = (bylmax - bylmin)/10;                                 // 间隔值
			var yBylData = {"max":bylmax,"min":bylmin,"interval":bylJj};
			
			// 平均值 结果值
			var ck = thisTr.find("td").eq(2).text();
			var meanVal = (parseFloat(ck.split("～")[0])+parseFloat(ck.split("～")[1]))/2;
			// 绘制图表
			chartInitialize(xData,yData,"jydbChart",meanVal,chartData);// X轴数据 Y轴数据 图表容器 平均值 图表数据
			// 注册点击隐藏事件
			var removeChartHammer = $(".jybgChartBox").hammer();
			removeChartHammer.on("tap",function(){
				$(".jybgChartBox").remove();
			});
			// 注册变异率切换事件
			var ulSwitchHammer = $(".jybgChartBox ul li").hammer();
			ulSwitchHammer.on("tap",function(event){
				event.stopPropagation();    //  阻止事件冒泡
				event.preventDefault();     //  阻止默认行为 ( 表单提交 )
				$(".jybgChartBox ul li").removeClass("active");
				$(this).addClass("active");
				if($(this).text()=="变异率"){
					chartInitialize(xData,yBylData,"jydbChart",0,chartBylData);// X轴数据 Y轴数据 图表容器 平均值 图表数据
				}else{
					chartInitialize(xData,yData,"jydbChart",meanVal,chartData);// X轴数据 Y轴数据 图表容器 平均值 图表数据
				}
			});
		}
	}

	// 初始化图表
	function chartInitialize(xData,yData,chartBox,meanVal,chartData){ // X轴数据 Y轴数据 图表容器 平均值 图表数据
		$("#"+chartBox).empty();
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
			xAxis:  {
				type: 'category',
				boundaryGap: false,
				data: xData,//['周一','周二','周三','周四','周五','周六','周日']
			},
			yAxis: {
				type: 'value',
				splitNumber:10,           // 一共10行
				interval:yData.interval,  // 间隔值
				min:yData.min,            // 最小刻度
				max:yData.max             // 最大刻度
				/*axisLabel: {
					formatter: '{value} '
				},*/
				
			},
			series: [
				{
					name:'检验结果',
					type:'line',
					data:chartData,//[11, 11, 15, 13, 12, 13, 10],
					markPoint: {
						data: [
							{type: 'max', name: '最大值'},
							{type: 'min', name: '最小值'}
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
			backgroundColor:"#fff"
		}
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	}

	return{
		inspection:inspection
	}

});