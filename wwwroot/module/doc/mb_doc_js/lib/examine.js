/*
	检查报告 PDF
	1、列表加载，默认加载第一个检查报告；
	2、点击列表，加载对应检查报告。
*/
define(["jquery", "hammer", "jqueryhammer", "utils","patientSwitch"], function (jquery, hammer, jqueryhammer, utils,patientSwitch) {

    function examine() {
        // 判断是否开了第三方接口localStorage.getItem("zlsofMdocs-install-jcUrl"
        if (localStorage.rulePacsStatus!="0"||localStorage.rulePacsStatusLocation!="") {
            var url = localStorage.rulePacsStatusLocation1;
			var bodyWidth = $(window).width();
			var bodyHeight = $(window).height();
			var threeW = bodyWidth-80;
			var threeH = bodyHeight-40;
			$("body").append('<div class="threeIframe" id="threeBl"><iframe class="threefre" style="width:'+threeW+'px; height:'+threeH+'px;" src="'+url+'"></iframe></div>');
			//utils.iframeAddBox('.threefre');		嘉禾的检查ifame不用动态加容器支持滚动条
			//$("body").append('<div class="threeIframe" id="threeBl"><iframe class="threefre" style="width:'+threeW+'px; height:'+threeH+'px;" src="bingli/home.html"></iframe></div>');
            //try{
            //     RecordInterface.playThrid(url)
            //} catch (e) {
              //  console.log(e)
                //window.open(url)
        } else {
            $("#huaDongBaoGao .jybg_dbButton").remove();  //观片按钮 防止重复
            $("#huaDongBaoGao>.row-fluid:first").append('<div class="jybg_dbButton" style="display:none;">观片</div>');
            // 注册事件
            var hammerjcbg_gp = $("#huaDongBaoGao .jybg_dbButton").hammer();
            hammerjcbg_gp.on("tap", function () {
                $("#jcgp-Box").remove();
                gpbtnCLick();
            });
            //参数获取
            var serviceChoose = utils.urlFunction();
            var pageID = $("#slzyID").attr("data-pageID");
            var patiID = $("#slzyID").attr("data-patiID");
            var isBaby = $("#slzyID").attr("data-baby");
            if (isBaby == "no") {
                var baby = 0
            } else {
                baby = 1
            }
            $("#changeJianChaJianyan").text("检查报告 | "); //改变导航条
            $("#fuJian2").text("");  //清空导航条显示
            $("#mainNavMinTwojc").show();
            $("#mainNavMinTwojc .btBox span").text();// 清空检查列表条数
            $("#examine li").remove();        // 清空检查列表
            $("#PDFdivWrapBG .PDFdiv").remove();//清空删除pdf容器

            // 检查报告 列表
            jcReport();
            function jcReport() {
                $("#LoadedTip").show();
                $.ajax({
                    url: serviceChoose + '/DC_Examine_List',
                    type: 'post',
                    data: JSON.stringify({
                        "IN":
                            {
                                "PATIID": patiID,
                                "PAGEID": pageID
                            }
                    }),
                    timeout: utils.timeoutSec(),
                    dataType: 'json',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function (responseTxt) {
                        if (responseTxt.Result === null) {
                            responseTxt.Result = {};
                        }
                        if (responseTxt.Result.ERROR) {
                            if (responseTxt.Result.ERROR.MSG) {
                                utils.showHide(responseTxt.Result.ERROR.MSG);
                            } else {
                                utils.showHide(responseTxt.Result.ERROR);
                            }
                            $("#LoadedTip").hide();
                        } else {
                            if (responseTxt.Result.FILELIST) {
                                if (responseTxt.Result.FILELIST.FILE instanceof Array) {//是数组
                                    $("#mainNavMinTwojc .btBox span").text("（" + responseTxt.Result.FILELIST.FILE.length + "）");
                                    for (var i = 0; i < responseTxt.Result.FILELIST.FILE.length; i++) {
                                        var JCdata = responseTxt.Result.FILELIST.FILE[i];
                                        try {
                                            var theReoust = JCdata.BGSJ.split(" ")[0];
                                        } catch (e) {
                                            var theReoust = "";
                                        }
                                        $("#examine").append('<li class="examineLi" data-yzid="' + JCdata.YZID + '" data-bglx="' + JCdata.BGLX + '" data-id="' + JCdata.ID + '" data-gp="' + JCdata.GP + '"><span>' + JCdata.MC + '</span><p>' + JCdata.BGR + ' ' + theReoust + '</p></li>');
                                        if (JCdata.BGLX == "2") {//三方接口 加新的样式
                                            pdfBox = "<div class='PDFdiv newhtml' style='height:" + ($(window).height() - 67) + "px' id='pdfBox-" + JCdata.ID + "'></div>";
                                        } else {
                                            pdfBox = "<div class='PDFdiv' style='height:" + ($(window).height() - 67) + "px'  id='pdfBox-" + JCdata.ID + "'></div>";
                                        }

                                        $("#PDFdivWrapBG").append(pdfBox);
                                    }
                                } else { //一条数据是对象
                                    $("#mainNavMinTwojc .btBox span").text("（1）");
                                    var FILEdata = responseTxt.Result.FILELIST.FILE;
                                    try {
                                        var theReoust = JCdata.BGSJ.split(" ")[0];
                                    } catch (e) {
                                        var theReoust = "";
                                    }
                                    $("#examine").append('<li class="examineLi" data-yzid="' + FILEdata.YZID + '" data-bglx="' + FILEdata.BGLX + '" data-id="' + FILEdata.ID + '" data-gp="' + FILEdata.GP + '"><span>' + FILEdata.MC + '</span><p>' + FILEdata.BGR + ' ' + theReoust + '</p></li>');
                                    if (FILEdata.BGLX == "2") {
                                        pdfBox = "<div class='PDFdiv' style='height:" + ($(window).height() - 67) + "px' id='pdfBox-" + FILEdata.ID + "'></div>";
                                    } else {
                                        pdfBox = "<div class='PDFdiv newhtml' style='height:" + ($(window).height() - 67) + "px' id='pdfBox-" + FILEdata.ID + "'></div>";
                                    }

                                    $("#PDFdivWrapBG").append(pdfBox);
                                }
                                //容器计算高度
                                // $("#PDFdivWrapBG>div").height($(window).height()-67);
                                //给列表注册点击事件
                                var hammerexamine = $("#examine li").hammer();
                                hammerexamine.on('tap', function (event) {
                                    jiancha($(this));
                                });
                                //默认加载第一条
                                jiancha($("#examine .examineLi:first"));
                                $("#examine .examineLi:first").addClass('XuanZhong');

                            } else {
                                $("#mainNavMinTwojc .btBox span").text("（0）");
                                $('.row-fluid img').remove();
                                utils.showHide("没有检查报告");
                                $("#LoadedTip").hide();
                            }
                        }
                        // $("#LoadedTip").hide();   
                    },
                    complete: function (XMLHttpRequest, textStatus) {
                        utils.errorAjax(textStatus, jcReport, []);
                    }
                });
            }
            //加载检查报告 内容
            function jiancha(thisli) {
                var gp = thisli.attr("data-gp");
                // if(gp=="1"){
                // 	$("#huaDongBaoGao .jybg_dbButton").css("display","block");  //观片按钮 防止重复
                // }else if(gp=="2"){
                // 	$("#huaDongBaoGao .jybg_dbButton").css("display","block");  //观片按钮 防止重复
                // }else{
                // 	$("#huaDongBaoGao .jybg_dbButton").css("display","none");
                // }

                $("#fuJian2").html(thisli.children('span').text());  //导航条显示
                $("#examine li").removeClass('XuanZhong');
                thisli.addClass('XuanZhong');
                var fileId = thisli.attr("data-id"); //文件ID				
                var pdfBox = "pdfBox-" + fileId; //pdf 容器的id     
                var BGLX = thisli.attr("data-bglx");
                $("#PDFdivWrapBG .PDFdiv").hide();
                if ($("#" + pdfBox).find('img').length > 0) {
                    $("#PDFdivWrapBG .PDFdiv").hide();
                    $("#" + pdfBox).show();
                } else if (BGLX == "2") {
                    if ($("#" + pdfBox).find('iframe').length > 0) {
                        $("#PDFdivWrapBG .PDFdiv").hide();
                        $("#" + pdfBox).show();
                    } else {
                        $("#LoadedTip").show();
                        var fileYzid = thisli.attr("data-yzid"); // 医嘱ID	
                        $.ajax({
                            url: serviceChoose + "/DC_Ris_Examine_Data",
                            timeout: utils.timeoutSec(),
                            type: "post",
                            dataType: "json",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            data: JSON.stringify({
                                "IN": {
                                    "AppointNO": fileYzid,                //医嘱ID
                                    "ReportID": fileId,                   //报告ID
                                    "SpareParam": "",                      //预留字段，传空即可
                                    "PAGEID": pageID,
                                    "PATIID": patiID
                                }
                            }),
                            success: function (data) {
                                if (data.Result.ERROR) {
                                    $("#LoadedTip").hide();
                                    utils.showHide(data.Result.ERROR.MSG);
                                }
                                if (data.Result.FILE) {
                                    if (data.Result.FILE.indexOf('/Html') != -1) {
                                        var imgUrl = ".." + data.Result.FILE;
                                        var imgNo = data.Result.FILE.split("/")[4];
                                        var imgCount = data.Result.PageCount;
                                        for (var i = 1; i <= parseInt(imgCount); i++) {
                                            $("#" + pdfBox).append('<img src="' + imgUrl + '/' + imgNo + '_' + i + '.Jpeg"/>');
                                        }
                                        // 放大缩小初始化
                                        utils.CSHpanzoom(pdfBox);
                                        $("#PDFdivWrapBG .PDFdiv").hide();
                                        $("#" + pdfBox).show();
                                        $("#LoadedTip").hide();
                                        if (data.Result.gp == "1") {
                                            $("#huaDongBaoGao .jybg_dbButton").css("display", "block");  //观片按钮 显示
                                        } else {
                                            $("#huaDongBaoGao .jybg_dbButton").css("display", "none");  //观片按钮
                                        }
                                        return false;
                                    }
                                }
                                else if (data.Result.url == "0") {
                                    utils.showHide("未启用专业版PACS配置，请检查");
                                    $("#LoadedTip").hide();
                                }
                                else {
                                    if (data.Result.gp == "1") {
                                        $("#huaDongBaoGao .jybg_dbButton").css("display", "block");  //观片按钮 显示
                                    } else {
                                        $("#huaDongBaoGao .jybg_dbButton").css("display", "none");  //观片按钮
                                    }
                                    var JCiframeID = "JCthreed-" + fileId;   //iframe的ID
                                    var JCCoverID = "JCcover-" + fileId;   //遮罩层的ID
                                    var imgUrl = data.Result.url;
                                    //$("#"+pdfBox).append('<iframe src="'+imgUrl+'"  id="'+JCiframeID+'" style="height:100%;width: 100%;border: 0;"></iframe><div id="'+JCCoverID+'" class="thisMask"></div>');
                                    $("#" + pdfBox).append('<div style="position:relative;height:auto;margin:0 auto;" id="' + JCCoverID + '" class="thisMask"></div>');
                                    // PDFJS.getDocument(imgUrl).then(function (pdf) {
                                    // 	var totalPages = pdf.numPages;
                                    // 	utils.showAllPage(1, totalPages, pdf, pdfBox);
                                    // });

                                    //添加遮罩层放大缩小
                                    var iframe = document.createElement("iframe");
                                    iframe.id = JCiframeID;
                                    iframe.src = imgUrl;
                                    iframe.style = "position:fixed;top:0;left:0;";
                                    document.getElementById(pdfBox).appendChild(iframe);
                                    //获取 iframe高度  新网的可以传高度 如果没有高度是不能滚动 和滑动关闭
                                    $(document).ready(function () {
                                        document.getElementById(JCiframeID).onload = function () {// iframe加载完成通信获取高度
                                            window.addEventListener("message", receiveMessage, false);

                                        }
                                    });
                                    function receiveMessage(e) {
                                        if (e.origin != "http://61.128.195.29:7031") {
                                            return;
                                        }
                                        var winInfoJSON = JSON.parse(e.data);
                                        var title = winInfoJSON.height;
                                        //utils.showHide(title);
                                        document.getElementById(JCiframeID).height = title;
                                        document.getElementById(JCCoverID).style.height = title + "px";//设置遮罩层高度
                                        window.removeEventListener("message", receiveMessage, false);//移除事件监听
                                    };

                                    utils.CSHpanzoom(pdfBox);//放大 缩小

                                    $("#LoadedTip").hide();
                                    // 放大缩小初始化
                                    utils.CSHpanzoom(pdfBox);
                                    $("#PDFdivWrapBG .PDFdiv").hide();
                                    $("#" + pdfBox).show();
                                }
                            },
                            complete: function (XMLHttpRequest, textStatus) {
                                utils.errorAjax(textStatus, jiancha, [thisli]);
                            }
							/*error:function(XMLHttpRequest,status,error){
								$("#LoadedTip").hide();
								$("#fuJian2").text(status+'---'+error+'---'+XMLHttpRequest.status+'---'+XMLHttpRequest.readyState);
							}*/
                        });
                    }
                } else {
                    //类型为1
                    if (gp == "1") {
                        $("#huaDongBaoGao .jybg_dbButton").css("display", "block");  //观片按钮 防止重复
                    } else {
                        $("#huaDongBaoGao .jybg_dbButton").css("display", "none");
                    }
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
                        success: function (dataCont) {
                            console.log(dataCont);
                            responseTxt = dataCont;
                            if (dataCont.Result.ERROR) {
                                if (responseTxt.Result.ERROR.MSG) {
                                    utils.showHide(dataCont.Result.ERROR.MSG);
                                } else {
                                    utils.showHide(dataCont.Result.ERROR);
                                }
                                $("#LoadedTip").hide();
                            } else {
                                var imgUrl = ".." + dataCont.Result.FILE;
                                var imgNo = dataCont.Result.FILE.split("/")[4];
                                var imgCount = dataCont.Result.PageCount;
                                for (var i = 1; i <= parseInt(imgCount); i++) {
                                    $("#" + pdfBox).append('<img src="' + imgUrl + '/' + imgNo + '_' + i + '.Jpeg"/>');
                                }
                                // 放大缩小初始化
                                utils.CSHpanzoom(pdfBox);
                                $("#PDFdivWrapBG .PDFdiv").hide();
                                $("#" + pdfBox).show();
                                $("#LoadedTip").hide();
                            }
                        },
                        complete: function (XMLHttpRequest, textStatus) {
                            utils.errorAjax(textStatus, jiancha, [thisli]);
                        }
                    });
                }
            }
        }
        //观片
        function gpbtnCLick() {
            $("#jcgp-Box").remove();
            var yizhuID = $("#examine .XuanZhong").attr("data-yzid"); //获取医嘱ID
            var gpUrl = utils.gpPostUrl(yizhuID);//获取通用的观片地址
            if (!gpUrl) {
                utils.showHide("未配置专业的观片地址");
                return;
            }
            if (gpUrl.indexOf("itapview://") != -1) { //响应头是itapview 也许以后会涉及到其他判断
                if (isiosOr == 1) {
                    //gpUrl="https://www.baidu.com/"
                    // window.top.location = gpUrl;
                    // window.open(gpUrl);
                    // window.location = "urischeme://open";
                    // setTimeout(function() {
                    //   window.location = gpUrl;
                    // }, 250);
                    // utils.showHide("ios设备"+gpUrl);
                    // self.location.href= gpUrl;
                    // window.location.href= gpUrl;
                    // this.location.href= gpUrl;
                    // location.href= gpUrl;
                    // parent.location.href= gpUrl;
                    // top.location.href= gpUrl;
                    // window.navigate=gpUrl;

                //    var a = document.createElement('a');
                //    a.setAttribute('href', gpUrl);
                //    a.setAttribute('target', '_blank');
                //    a.setAttribute('id', 'gpid');
                //    // 防止反复添加
                //    if (!document.getElementById('gpid')) {
                //        document.body.appendChild(a);
                //    }
                //    a.click();
                //} else {
                //    utils.showHide("未配置专业的观片地址");
                //}
                    var  createIframe=(function(){
                        var iframe;
                        return function(){
                            if(iframe){
                                return iframe;
                            }else{
                                iframe = document.createElement('iframe');
                                iframe.style.display = 'none';
                                document.body.appendChild(iframe);
                                return iframe;
                            }
                        }
                    })
                    var openIframe=createIframe();
                    window.location.href = gpUrl;
                    var loadDateTime = Date.now();
                    setTimeout(function () {
                        var timeOutDateTime = Date.now();
                        if (timeOutDateTime - loadDateTime < 1000) {
                            window.location.href = gpUrl;
                        }
                    }, 25);

                }else{
                    utils.showHide("未配置专业的观片地址");
                }

            } else {
				/*$("#LoadedTip").show();
				// 写入cookies 
				$.ajax({
					url: serviceChoose +"/Regin",
					data:"strXML="+ JSON.stringify({
						"IN": {
							"SYS": "001",
							"FUNC": "DC_GP_GetCookie",
							"Url": encodeURIComponent(gpUrl)         
						}
					}),
		        	type: 'post',
		        	timeout:utils.timeoutSec(),
		        	dataType: 'json',
			        success:function(res) {
			        	if(res.result.ERROR){
							$("#LoadedTip").hide();
							utils.showHide(res.result.ERROR.MSG);
						}else{
							if(res.result["#text"]){
								var cok = res.result["#text"];
								document.cookie = "JSESSIONID="+cok;

								// 计算iframe的宽高
								var wightbox = $(window).width()-30;
								var heightbox = $(window).height()-30;
								//alert(gpUrl);
								//window.open(gpUrl);  
								$("body").append('<div class="jygp-wrap" id="jcgp-Box"><div class="gpclose"><span class="fs1" aria-hidden="true" data-icon=""></span></div><div class="jygp_dbBox"><iframe src="'+gpUrl+'" height="'+heightbox+'px" width="'+wightbox+'px" style="margin-top:5px;margin-left:5px;"></iframe></div></div>');
								var gpClosehammer=$("#jcgp-Box .gpclose").hammer();
								gpClosehammer.on('tap', function(event) {
								//$("#jcgp-Box .gpclose").on('touchstart', function(event) {
									setTimeout(function(){
										$("#jcgp-Box").remove();
									},100)
								});
							}else{
								utils.showHide("未返回有效观片地址");	
							}
							$("#LoadedTip").hide();
						}
					},
					complete: function (XMLHttpRequest, textStatus) {  
					    utils.errorAjax(textStatus,gpbtnCLick,[yizhuID]);
					}
				});*/
                var wightbox = $(window).width() - 30;
                if (isiosOr == 1) {  //针对新网的观片 高度计算不正确的问题 如不需要 可删除
                    var heightbox = $(window).height() - 90;
                } else {
                    var heightbox = $(window).height() - 30;
                }
                if (gpUrl.indexOf("http://") != -1 || gpUrl.indexOf("https://") != -1 || gpUrl.indexOf("ftp://") != -1 || gpUrl.indexOf("ws://") != -1) {
                    $("body").append('<div class="jygp-wrap" id="jcgp-Box"><div class="gpclose"><span class="fs1" aria-hidden="true" data-icon=""></span></div><div class="jygp_dbBox"><iframe src="' + gpUrl + '" height="' + heightbox + 'px" width="' + wightbox + 'px" style="margin-top:5px;margin-left:5px;"></iframe></div></div>');
                } else {
                    location.href = gpUrl;
                }
                var gpClosehammer = $("#jcgp-Box .gpclose").hammer();
                gpClosehammer.on('tap', function (event) {
                    setTimeout(function () {
                        $("#jcgp-Box").remove();
                    }, 100)
                });
            }

        }
    }


    return {
        examine: examine
    };

});