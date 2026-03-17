define(["jquery", "hammer","jqueryhammer","utils",'PDFJS'], function(jquery, hammer, jqueryhammer,utils,PDFJS) {

	var serviceChoose = utils.urlFunction();

	//病历部分
	function medicalRecords() {
		// 判断是否开了第三方接口localStorage.getItem("zlsofMdocs-install-blUrl")
		if(localStorage.ruleHistoryStatus!="0"||localStorage.ruleHistoryStatusLocation!=""){
			//$("#LoadedTip").show();	            嘉禾的检查ifame不用动态加容器支持滚动条
			var url = localStorage.ruleHistoryStatusLocation1;
			//var url = "https://segmentfault.com/q/1010000004463038";
			var bodyWidth = $(window).width();
			var bodyHeight = $(window).height();
			var threeW = bodyWidth-80;
			var threeH = bodyHeight-40;
			$("body").append('<div class="threeIframe" id="threeBl"><iframe class="threefre" style="width:'+threeW+'px; height:'+threeH+'px;" src="'+url+'"></iframe></div>');
			//utils.iframeAddBox('.threefre');		嘉禾的检查ifame不用动态加容器支持滚动条
			// $("body").append('<div class="threeIframe" id="threeBl"><iframe class="threefre" style="width:'+threeW+'px; height:'+threeH+'px;" src="bingli/home.html"></iframe></div>');

		}else{
			var pageID=$("#slzyID").attr("data-pageID");
			var patiID=$("#slzyID").attr("data-patiID");
			var isBaby=$("#slzyID").attr("data-baby");
			if(isBaby=="no"){
			   var baby=0
			}else {
			   baby=1
			}
			$("#LoadedTip").show();
			var xmlUrl="";  //xml的url集合
			var gaoDu=0; //iframe遮罩层高度
			var bingChengLenth=0;//病程记录的个数
			//请求病历列表
			bingliLIst();
			function bingliLIst(){

				$("#LoadedTip").show();
				$.ajax({
                    url: serviceChoose + "/DC_CaseHistory_List",
					type: "post",
                    timeout: utils.timeoutSec(),
                    data: JSON.stringify({
                            "IN": {
                                "PATIID": patiID,
                                "PAGEID": pageID,
                                "BABY": baby,
                                "FL": null,
                                "QX": null
                            }
                    }),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
					success: function (responseTxt) {
						//加载前要先清空内容，列表
						$("#inHis li").remove();
						$("#disProve li").remove();
						$("#InformPaper li").remove();
						$("#newBingLiList li").remove();
						$("#PDFdivWrapBL > .pdf").remove();//pdf清空
						$("#PDFdivWrapBL > div > iframe").remove();//xml清空
						$("#mainNavMinTwo3").show();
						if(responseTxt.Result.ERROR){
							utils.showHide(responseTxt.Result.ERROR.MSG);
							$("#LoadedTip").hide();
						}else{
							var ZLEPRLIST = responseTxt.Result.ZLEPRLIST;
                            if (ZLEPRLIST != null && ZLEPRLIST != "") {
								var zl=1;   //1老接口  0新接口
								var EPR = ZLEPRLIST.EPR;
								if (EPR  instanceof Array){
									if(EPR[0].ZL==undefined){
										zl=0;
									}
								}else{
									if(EPR.ZL==undefined){
										zl=0;
									}
								}
								if(zl){     //老接口
									if(EPR  instanceof Array){
										$.each(EPR, function (index, element) {	//遍历加载pdf列表，并创建pdf对应容器
											oldLsit(element,index);
										});
									}else{
										oldLsit(EPR,1);
									}
									$("#documentCount").html("（"+bingChengLenth+"）"); //病程记录的个数
									if($("#inHis li").length==0){
										$("#inHis").prev().html('住院病历（0）');
									}else{
										$("#inHis").prev().html('<span class="fs1" aria-hidden="true" data-icon=""></span>住院病历（'+$("#inHis li").length+'）');
									}
									if($("#InformPaper li").length==0){
										$("#InformPaper").prev().html('知情文件（0）');
									}else{
										$("#InformPaper").prev().html('<span class="fs1" aria-hidden="true" data-icon=""></span>知情文件（'+$("#InformPaper li").length+'）');
									}
									if($("#disProve li").length==0){
										$("#disProve").prev().html('疾病证明（0）');
									}else{
										$("#disProve").prev().html('<span class="fs1" aria-hidden="true" data-icon=""></span>疾病证明（'+$("#disProve li").length+'）');
									}
									$("#inHis").addClass('hideLI');
									$("#inHis li").hide();
									$("#InformPaper").addClass('hideLI');
									$("#InformPaper li").hide();
									$("#disProve").addClass('hideLI');
									$("#disProve li").hide();
									// 列表注册点击事件
									hammerMinTwo = $("#mainNavMinTwo3 > ul > li").hammer();
									hammerMinTwo.on('tap', function (ev) {
										if($(this).find("span").eq(0).text()=="病程记录"){
											jiazaiXML($(this));
										}else{
											pdfQieHuan($(this),1);//老接口
										}
									});
									//判断默认数据显示
									if($("#inHis li").length>0){
										if($("#inHis li").eq(0).children("span").eq(0).text()=="病程记录"){ //第一条为病程记录
											jiazaiXML($("#inHis li").eq(0));
										}else{
											pdfQieHuan($("#inHis li").eq(0),1); //1老接口
										}
										$("#inHis li").show();   //当前选中 li
										$("#inHis").removeClass('hideLI');//移除当前的隐藏标志
										$("#mainNavMinTwo3 .btBox").eq(0).find("span").remove()	;
										$("#mainNavMinTwo3 .btBox").eq(0).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
									}else if($("#InformPaper li").length>0){
										pdfQieHuan($("#InformPaper li:first"),1);
										$("#InformPaper li").show();
										$("#InformPaper").removeClass('hideLI');//移除当前的隐藏标志
										$("#mainNavMinTwo3 .btBox").eq(1).find("span").remove()	;
										$("#mainNavMinTwo3 .btBox").eq(1).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
									}else if($("#disProve li").length>0){
										pdfQieHuan($("#disProve li:first"),1);
										$("#disProve li").show();
										$("#disProve").removeClass('hideLI');//移除当前的隐藏标志
										$("#mainNavMinTwo3 .btBox").eq(2).find("span").remove()	;
										$("#mainNavMinTwo3 .btBox").eq(2).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
									}

								}else{     //新接口
									if(EPR  instanceof Array){
										$.each(EPR, function (index, element) {
											debugger;
											newList(element,index);
										});
									}else{
										newList(EPR,0);
									}
									//默认显示第一条
									pdfQieHuan($("#newBingLiList li:first"),0); //0新接口
									//显示病历记录 个数
									$("#newBingLiList").prev().text("病历记录（"+$("#newBingLiList li").length+"）");

									//点击事件记录
									hammerMinTwo = $("#mainNavMinTwo3 > ul > li").hammer();
									hammerMinTwo.on('tap', function (ev) {
										pdfQieHuan($(this),0); //1新接口
									});

								}
								// 计算容器的高度
								$("#PDFdivWrapBL>.pdf").height($(window).height()-67);

								hammerList = $("#bingLi-List").hammer(); //注册目录点击事件
								hammerList.on('tap', function (ev) {
									$("#bingLi-Choose").show();
									$(".tmc").show();  //遮罩
								});
								//住院病历等展开
								$("#mainNavMinTwo3 .btBox").unbind();
								var binglibtBox=$("#mainNavMinTwo3 .btBox").hammer();
								binglibtBox.on('tap', function(event) {
									var xx=$(this).index();
									openlist($(this),xx);
								});
							}else {
								$("#inHis").prev().text("住院病历（0）");
								$("#InformPaper").prev().text("知情文件（0）");
								$("#disProve").prev().text("疾病证明（0）");
								$("#newBingLiList").prev().text("病历记录（0）");
								utils.showHide("没有病历");
								$("#LoadedTip").hide();
							}
						}

					},
					complete: function (XMLHttpRequest, textStatus) {
						utils.errorAjax(textStatus,bingliLIst,[]);
						//$("#LoadedTip").hide();
					}
				});
			}
			//病历列表数据 新接口
			function newList(element,index){
				$("#mainNavMinTwo3 .btBox").hide();//老接口分类隐藏
				$("#inHis").hide();
				$("#disProve").hide();
				$("#InformPaper").hide();
				$("#mainNavMinTwo3 .newbtBox").show();//新接口分类显示
				$("#newBingLiList").show();
				var CJSJ = element.CJSJ,    //只获取年月日
				CJSJTime=CJSJ.split(" ")[0].split("/")[0]+"-"+CJSJ.split(" ")[0].split("/")[1]+"-"+CJSJ.split(" ")[0].split("/")[2];

				$("#newBingLiList").append("<li class='newBingLiList' id='newBingLiPDF-" + element.ID + "'><span>" + element.BLMC + "</span><p>" + element.BCR + " " + CJSJTime + " </p></li>");
				//同步增加对应PDF容器
				PDFdiv = "<div class='PDFdiv pdf' id='BingLiPDF-" + element.ID + "'></div>";
				$("#PDFdivWrapBL").append(PDFdiv);
			}

			//遍历列表数据  老接口
			function oldLsit(element,index){
				$("#mainNavMinTwo3 .btBox").show();//老接口分类显示
				$("#inHis").show();
				$("#disProve").show();
				$("#InformPaper").show();
				$("#mainNavMinTwo3 .newbtBox").hide();//新接口分类隐藏
				$("#newBingLiList").hide();
				var ZL = element.ZL;
				var CJSJ = element.CJSJ,
				CJSJTime = CJSJ.split(" ")[0];        //只获取年月日
				switch (ZL) {
					case "2":
						//住院病历
						if (element.YM != "病程记录") {
							// bingLiLength=bingLiLength+1;
							var inHisLi = "<li class='inHisBL' id='inHisLi-" + element.ID + "'><span>" + element.BLMC + "</span><p>" + element.BCR + " " + CJSJTime + " </p></li>";
							$("#inHis").append(inHisLi);
							//同步增加对应PDF容器
							if ($('#BingLiPDF-' + element.ID).length == 0) {             //防止重复创建
								PDFdiv = "<div class='PDFdiv pdf' id='BingLiPDF-" + element.ID + "'></div>";
								$("#PDFdivWrapBL").append(PDFdiv);
							}
						//病程记录列表----只加载一个
						}else{
							bingChengLenth=bingChengLenth+1;  //有一条病程记录就加一
							xmlUrl=xmlUrl+"|"+element.ID;
							if($("#inHis").find(".inHisBCJL").length==0){
								$("#bingLi-List").show();     //病历目录按钮
								inHisLi='<li class="inHisBCJL"><span>病程记录</span><span id="documentCount"></span></li>';
								$("#inHis").append(inHisLi);
							}
						}
					break;
					//疾病证明
					case "5":
						// jiBingLength=jiBingLength+1;
						var disProveLi = "<li id='disProveLi-" + element.ID + "'><span>" + element.BLMC + "</span><p>" + element.BCR + " " + CJSJTime + " </p></li>";
						$("#disProve").append(disProveLi);
						//同步增加对应PDF容器
						if ($('#BingLiPDF-' + element.ID).length == 0) {                  //防止重复创建
							PDFdiv = "<div class='PDFdiv pdf' id='BingLiPDF-" + element.ID + "'></div>";
							$("#PDFdivWrapBL").append(PDFdiv);
						}
					break;
					//知情文件
					case "6":
						// zhiQingLength=zhiQingLength+1;
						var InformPaperLi = "<li id='InformPaperLi-" + element.ID + "'><span>" + element.BLMC + "</span><p>" + element.BCR + " " + CJSJTime + " </p></li>";
						$("#InformPaper").append(InformPaperLi);
						//同步增加对应PDF容器
						if ($('#BingLiPDF-' + element.ID).length == 0) {
							PDFdiv = "<div class='PDFdiv pdf' id='BingLiPDF-" + element.ID + "'></div>";
							$("#PDFdivWrapBL").append(PDFdiv);
						}
					break;
				}
			}
			//加载  XML 病程记录
			function jiazaiXML(thisData){
				$("#bingLi-List").show();           //目录
				$("#mainNavMinTwo3 li").removeClass('XuanZhong');
				$("#bingLiXML").show();  //xml容器
				thisData.addClass("XuanZhong"); // 默认选中病程记录
				$("#PDFdivWrapBL > .pdf").hide();                        // 所有PDF文件容器隐藏 后期观察，如果页面过大，考虑直接删除，而不是隐藏
				var item2 =thisData.parent().prev().text().split("（")[0] + " | ", // 顶部导航条
				item3 = thisData.children('span:first').text();
				$("#bingLi2").html(item2);
				$("#bingLi3").html(item3);
				//加载XML
				if(!$("#bingLiXML iframe").length>0){
					var bcjlXml = xmlUrl.substring(1,xmlUrl.length);  // 清除第一个| XML
					var bcjlXmlUrl="";
					$("#LoadedTip").show();
					$.ajax({
                        url: serviceChoose +"/DC_CaseHistory_Data",
						type: "post",
						//timeout:10,
                        timeout: utils.timeoutSec(),
                        data: JSON.stringify({
                                "IN": {
                                    "FILE": bcjlXml,                        //病程记录ID，多个病程记录用竖线分隔
                                    "DATA": "2",                            //固定传0
                                    "TYPE": "0"
                                }
                        }),
                        dataType: "json",
                        headers: {
                            'Content-Type': 'application/json'
                        },
						success: function(responseTxt){
                            console.log(responseTxt);
                            if (responseTxt.Result.ERROR) {
                                $("#LoadedTip").hide();
                                utils.showHide(responseTxt.Result.ERROR.MSG);
                            }else{
								bcjlXmlUrl=".."+responseTxt.Result.FILE;
								//bcjlXmlUrl=serviceChoose.replace("/ClinicalService.asmx","")+responseTxt.Result.FILE;
								var XML='<iframe  id="iframeXML" src="'+bcjlXmlUrl+'" marginheight="0" marginwidth="0" frameborder="0" scrolling="no" width="100%" name="iframeXML"></iframe>';
								$("#bingLiXML").append(XML);
								document.getElementById("iframeXML").onload=function(){
									// 加载完成后获取高度
									//var a=document.getElementById("iframeXML").contentWindow.document.body;innerHeight
                                    //gaoDu = a.children[0].offsetHeight;
                                    //gaoDu = document.getElementById("iframeXML").contentWindow.innerHeight;
                                    gaoDu = document.getElementById("iframeXML").contentWindow.document.documentElement.scrollHeight;
									// 设置遮罩层和iframe的高度
									$("#bingLiXMLdom").css("height",gaoDu);
									$("#iframeXML").css("height",gaoDu);
									// 放大缩小初始化
									utils.CSHpanzoom("bingLiXML");
								}

								//ajax 读取XML,创建XML列表
								readXML();
								function readXML(){
									$("#LoadedTip").show();
									$.ajax({
										url:bcjlXmlUrl,
										type: 'GET',
										//timeout:10,
										timeout:utils.timeoutSec(),
										dataType: 'xml',//这里可以不写，但千万别写text或者html!!!
										//timeout: 1000,
										//error: function(xml){
										//	alert('Error loading XML document'+xml);
										//},
										success: function(xml){
											//var document=$(xml).find("Document");
											var docement=$(xml).find(".PDFdiv");
											// $("#documentCount").html("（"+document.length+"）");         //病程记录左边导航个数显示
											$("#bingLi-Choose").html("");
											$.each(document,function(index){
												var textName=document[index].attributes[3].value,
												textID=document[index].attributes[4].value,
												textTime=$(this).find("Element[Name='当前时间']").html(),
												//创建列表的同时，通过href属性、target属性添加锚点。
												divString="<a href='"+bcjlXmlUrl+"#"+textID+"' target='iframeXML' id='bingChengjiLu-"+textID+"' class='choose-Style'><span class='choose-Circle'>"+(index+1)+"</span><span class='choose-Text'>"+textName+"</span><p>"+(textTime==undefined?"未记录时间":textTime)+"</p></a>";
												$("#bingLi-Choose").append(divString);
											});
											var hammerJiLu = $(".tmc").hammer();
											// console.log(hammerJiLu);
											hammerJiLu.on('tap', function (ev) {
												$("#bingLi-Choose").hide();
												$(".tmc").hide();
											});
											$("#LoadedTip").hide();
										},
										complete: function (XMLHttpRequest, textStatus) {
											utils.errorAjax(textStatus,readXML,[]);
											$("#LoadedTip").hide();
										}
									});
								}
							}
						},
						complete: function (XMLHttpRequest, textStatus) {
							utils.errorAjax(textStatus,jiazaiXML,[thisData]);
							$("#LoadedTip").hide();
						}
					});
				}
			}

			//获取PDF内容
			function pdfQieHuan(thisData,newOld){
				var fileId=thisData.attr("id").split("-")[1];
				var pdfBox = "BingLiPDF-"+fileId; //pdf 容器的id
				$("#bingLiXML").hide();             // XML
				$("#PDFdivWrapBL .PDFdiv").hide();  // PDF容器
				$("#bingLi-List").hide();			//目录
				$("#mainNavMinTwo3 li").removeClass('XuanZhong')
				thisData.addClass('XuanZhong');
				$("#"+pdfBox).show();     //当前pdf容器
				$("#bingLi2").html(thisData.parent().prev().text().split("（")[0]+ " | ");
				$("#bingLi3").html(thisData.children('span').text());
				if(!$("#"+pdfBox).find('img').length>0){
					$("#LoadedTip").show();
					if(localStorage.PDFStatus == '1'){
						$.ajax({
							url: serviceChoose +"/DC_CaseHistory_Data_From_Ftp",
							type: 'post',
							timeout:utils.timeoutSec(),
							//timeout:20000,
							data: JSON.stringify({
								"IN": {
									"FILE": fileId,            //文件ID
									"PATIID": patiID,           //病人ID
									"PAGEID": pageID            //主页ID
								}

							}),
							dataType: "json",
							headers: {
								'Content-Type': 'application/json'
							},
							success:function(data) {
								if (data.Result.ERROR) {
									$("#LoadedTip").hide();
									utils.showHide(data.Result.ERROR.MSG);
								}else{
									var url_pdf=data.Result.FILE;
									//var pdfURL=data.Result.FILE;
									//window.localStorage.pdf=data.Result.FILE;
									// window.location.href=basePath+"jsTool/openPDF/web/viewer.html";
									$("#"+pdfBox).html('');
									$("#"+pdfBox).append('<iframe id="previewpdf" src="/PDF.js/web/viewer.html" width="100%" height="100%" frameborder="0"></iframe>');
									// PDFJS.getDocument(url_pdf).then(pdf=>{
									// 	var numPages = pdf.numPages;
									// 	var start = 1;
									// 	renderPageAsync(pdf, numPages, start);
									// });

									//$("#"+pdfBox).append('<iframe id="previewpdf" src="../pdfjs/web/viewer.html?file='+data.Result.FILE+'" width="100%" frameborder="0"></iframe>');
									//utils.CSHpanzoom(pdfBox);
									$("#LoadedTip").hide();
								}
							},
							complete: function (XMLHttpRequest, textStatus) {
								utils.errorAjax(textStatus,pdfQieHuan,[thisData,newOld]);
								$("#LoadedTip").hide();
							}
						});
					}else{
						$.ajax({
							url: serviceChoose +"/DC_CaseHistory_Data",
							type: 'post',
							timeout:utils.timeoutSec(),
							//timeout:20000,
							data: JSON.stringify({
								"IN": {
									"FILE": fileId,            //文件ID
									"TYPE": "1",                  //固定传1
									"PATIID": patiID,           //病人ID
									"PAGEID": pageID            //主页ID
								}

							}),
							dataType: "json",
							headers: {
								'Content-Type': 'application/json'
							},
							success:function(data) {
								if (data.Result.ERROR) {
									$("#LoadedTip").hide();
									utils.showHide(data.Result.ERROR.MSG);
								}else{
									var imgUrl=".."+data.Result.FILE;
									var imgNo=data.Result.FILE.split("/")[4];
									var imgCount=data.Result.PageCount;
									for(var i=1; i<=parseInt(imgCount); i++){
										$("#"+pdfBox).append('<img src="'+imgUrl+'/'+imgNo+'_'+i+'.Jpeg"/>');
									}
									utils.CSHpanzoom(pdfBox);
									/*console.log(data);
                                    $("#bingLi2").html(thisData.parent().prev().text().split("（")[0]+ " | ");
                                    $("#bingLi3").html(thisData.children('span').text());
                                    if(data.Result.ERROR){
                                        utils.showHide(data.Result.ERROR);
                                        $("#LoadedTip").hide();
                                    }else{
                                        var pdfUrl = serviceChoose.replace("/ClinicalService.asmx","")+data.Result.FILE;
                                        console.log(pdfUrl);
                                        // 解析PDF
                                        PDFJS.getDocument(pdfUrl).then(function (pdf) {           //PDF路径
                                            var totalPages = pdf.numPages;
                                            utils.showAllPage(1, totalPages, pdf, pdfBox);

                                        });
                                        // 放大缩小初始化
                                        utils.CSHpanzoom(pdfBox);
                                    };*/

									$("#LoadedTip").hide();
								}
							},
							complete: function (XMLHttpRequest, textStatus) {
								utils.errorAjax(textStatus,pdfQieHuan,[thisData,newOld]);
								$("#LoadedTip").hide();
							}
						});
					}
				}
			}
			//列表展开搜索
			function openlist(thisbt ,who){
				if(thisbt.next().find('li').length>0){
					if(thisbt.next().hasClass('hideLI')){
						thisbt.find('span').remove();
						thisbt.next().find('li').show();
						thisbt.prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
						thisbt.next().removeClass('hideLI');
					}else{
						thisbt.find('span').remove();
						thisbt.next().find('li').hide()
						thisbt.prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
						thisbt.next().addClass('hideLI');
					}
				}
			}
		}
    }

	return{
		medicalRecords:medicalRecords
	};

});