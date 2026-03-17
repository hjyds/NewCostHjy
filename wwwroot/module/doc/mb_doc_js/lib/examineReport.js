define(["jquery", "hammer","jqueryhammer","utils","PDFexchange"], function(jquery, hammer, jqueryhammer,utils,PDFexchange) {

    function examine() {
        //参数获取
        var serviceChoose = utils.urlFunction();
        var pageID=$("#slzyID").attr("data-pageID");
        var patiID=$("#slzyID").attr("data-patiID");
        var isBaby=$("#slzyID").attr("data-baby");
        if(isBaby=="no"){
            var baby=0
        }else {
            baby=1
        }
		$("#mainNavMinTwo4").show();
		//加载前要先清空内容
		$("#examine li").remove();
		//加载前要先清空内容
		$("#inspection li").remove();
        //加载前先清空iframe
        $("#iframecont").remove();
		//pdf清空
		//$("#PDFdivWrapBG > div").remove();
		//检验报告部分 读取网页 用iframe放       
        $("#LoadedTip").show();
        var loadNumber=0; //ajax调用次数
        //检查报告 列表
        $.ajax({
            url: serviceChoose +'/DC_Examine_List',
            type: 'post',
            timeout: 5000,
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
                loadNumber=loadNumber+1;
                if(responseTxt.Result.FILELIST){
                    for( var i=0;i<responseTxt.Result.FILELIST.FILE.length;i++){
                            var JCdata=responseTxt.Result.FILELIST.FILE[i];
                            var time=JCdata.BGSJ;
                            var Qudiao=time.split(" ")[0].split("/");
                            var theReoust=Qudiao[0]+"-"+Qudiao[1]+"-"+Qudiao[2];
                        $("#examine").append("<li class='examineLi' data-id="+JCdata.ID+'><span>'+JCdata.MC+'</span><p>|'+JCdata.BGR+' '+ theReoust+ '</p></li>');
                    }
                    var hammerexamine=$("#examine li").hammer();
                    hammerexamine.on('tap',  function(event) {
                       jiancha($(this),1); // 1 表示点击调用
                    });            
                }
                shifouwei($(this));
              
            },
            error:function() {
                utils.showHide("加载超时，请重试。");
                $("#LoadedTip").hide();
                shifouwei($(this));
            }
            

        
        });
        //检验报告 列表
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
            timeout:5000,
            dataType: "json",
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (responseTxt) {
                loadNumber=loadNumber+1;        
                if(responseTxt.Result.ITEMLIST){
                    //多条条数据 数组
                    if(responseTxt.Result.ITEMLIST.ITEM instanceof Array){
                        for (var i=0; i<responseTxt.Result.ITEMLIST.ITEM.length;i++) {
                            var textCont=responseTxt.Result.ITEMLIST.ITEM;
                            var SHSJ = textCont[i].SHSJ,
                            SHSJsplit = SHSJ.split(" "),
                            SHSJTime = SHSJsplit[0]; 
                            //绑定数据方便调用  
                            var examineLi ="<li class='inspectionLi' data-YZID='"+textCont[i].YZID+"' data-BBID='"+textCont[i].BBXH+"' data-LX='"+textCont[i].LX+"' id='inspectionLi-" + textCont[i].ID + "'><span>" + textCont[i].JYXM + "</span><p>| " + textCont[i].JYR + " "+SHSJTime+ "</p></li>";
                            $("#inspection").append(examineLi);     
                        }
                        var hammerJYBG = $("#inspection li").hammer();
                        hammerJYBG.on("tap",function(){
                            $("#iframecont").remove();
                            addData($(this),1); //1 表示是点击 不是第一调用
                        });
                    }else{
                        //一条数据 不是数组
                        var textCont=responseTxt.Result.ITEMLIST.ITEM;
                        var SHSJ = textCont.SHSJ,
                        SHSJsplit = SHSJ.split(" "),
                        SHSJTime = SHSJsplit[0];   
                        var examineLi ="<li class='inspectionLi' data-YZID='"+textCont.YZID+"' data-BBID='"+textCont.BBXH+"' data-LX='"+textCont.LX+"' id='inspectionLi-" + textCont.ID + "'><span>" + textCont.JYXM + "</span><p>| " + textCont.JYR + " "+SHSJTime+ "</p></li>";
                        $("#inspection").append(examineLi); 
                        //添加成功注册点击事件
                        var hammerOnly = $("#inspection li").hammer();
                        hammerOnly.on("tap",function(){
                            $("#iframecont").remove();
                            addData($(this),1); // 1表示是点击 不是第一调用
                        }); 
                    }
                }
                shifouwei($(this));
                
            }, 
            error:function(){
                loadNumber=loadNumber+1;
                // utils.showHide("加载失败");
                shifouwei($(this));
                // console.log(loadNumber);  
            } 
        });

        //加载检查报告 内容
        function jiancha(thisli){
            loadNumber=loadNumber+1;
            $("#examine li").removeClass('XuanZhong').css("background","rgb(80, 163, 162)");
            $("#inspection li").removeClass('XuanZhong').css("background","rgb(80, 163, 162)");
            thisli.addClass('XuanZhong').css("background","#000");
            utils.showHide(thisli.index());
        }
        
        //加载检验报告 内容
        function addData(thisdata,isdianji){
            //添加选中
            $("#examine li").removeClass('XuanZhong').css("background","rgb(80, 163, 162)");
            $("#inspection li").removeClass('XuanZhong').css("background","rgb(80, 163, 162)");
            thisdata.addClass('XuanZhong').css("background","#000");
            // 获取数据
            var yzID=thisdata.attr("data-YZID");
            var lx=thisdata.attr("data-LX");
            var bbID=thisdata.attr("data-BBID");
            if(isdianji==1){
                 $("#LoadedTip").show();
            }else if(isdianji==2){
                $("#LoadedTip").hide();
            }
            $("#LoadedTip").show();
            var tempserviceChoose='../api/services/doc/Lis';
            $.ajax({
                url: tempserviceChoose +"/DC_Prove_Data",
                type: "post",
                timeout: 5000,
                data: JSON.stringify({
                        "IN": {
                            "LX": lx,              //类型
                            "YZID": yzID,         //医嘱ID
                            "BBID": bbID,         //标本ID
                            "JGCS": "0",
                            "WSW": "0",
                            //添加的三个参数，后期给具体的参数值
                            "Type": "2",
                            "PatientID": "6077858",
                            "Url": "//192.168.32.212:80/271.pdf" 
                        }                    
                }),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function(responseTxt){
                    loadNumber=loadNumber+1;
                    $("#LoadedTip").hide();
                    // 将内容在显示页面
                    $("#PDFdivWrapBG").append('<iframe class="row-fluid" id="iframecont" frameborder="0" scrolling="yes" marginheight="0" marginwidth="0"></iframe>');
                    $("#iframecont").attr("src",responseTxt.Result.FILE);//检验报告单返回的html存储路径
                    $("#iframecont").attr("height",$(window).height()-64);
                },
                error:function(){
                    utils.showHide("加载超时，请重试。");
                    $("#LoadedTip").hide();
                }
            });
        }

        //判断什么时候遮罩层隐藏 自动加载检查还是检验的第一条
        function shifouwei(thisli){
            //检查检验列表都加载完了执行
            if(loadNumber==2){
                if($("#examine li").length>0){
                    jiancha(thisli);
                    $("#LoadedTip").hide(); 
                }else if($("#examine li").length==0&&$("#inspection li").length>0){
                    addData($("#inspection li:first-child"),2); //2 表示第一次调用
                    $("#LoadedTip").hide(); 
                }else if($("#examine li").length==0&&$("#inspection li").length==0){ 
                    $("#LoadedTip").hide(); 
                    utils.showHide("无数据");  
                }
            }else{
                $("#LoadedTip").show(); 
            }
        }

        //返回时清除iframe
        //var clearIframe=$("#qieHuanBox").hammer();
        //clearIframe.on("tap",function(){
        //    $("#iframecont").remove();
        //});

		/*//检查报告部分 等海哥
        $("#LoadedTip").show();
		$.ajax({
			url: serviceChoose+"/Regin"+"?strXML="+ JSON.stringify(
				{"IN": 
					{
					"SYS": "001",
					"FUNC": "DC_Prove_List",
					"PATIID": patiID,
					"PAGEID": pageID
					}
				}
			),
			type: "get",
			dataType: "json",
			success: function(responseTxt){
				//debugger;
				//$("#mainNavMinTwo4").show();
				var FILE = responseTxt.FILELIST.FILE;

				//加载前要先清空内容
				//$("#examine li").remove();
				//加载前要先清空内容
				//$("#inspection li").remove();
				//pdf清空
				//$("#PDFdivWrapBG > div").remove();
				//创建左边导航和PDF容器
				$.each(FILE, function (index, element) {

					var BGSJ = element.BGSJ,
                    BGSJsplit = BGSJ.split(" "),
                    BGSJTime = BGSJsplit[0];         //只获取年月日

					var examineLi = "<li class='examineLi' id='examineLi-" + element.ID + "'><span>" + element.MC + "</span><p>| " + element.BGR + " " + BGSJTime + " </p></li>";
					$("#examine").append(examineLi);
					//同步增加对应PDF
					if ($('#examinePDF-' + element.ID).length == 0) {           //防止重复创建
						PDFdiv = "<div class='PDFdiv' id='examinePDF-" + element.ID + "'></div>";
						$("#PDFdivWrapBG").append(PDFdiv);
					}
				});
			
			}
        });
	
		//检验报告部分
		/*$("#LoadedTip").show();
		$.ajax({
			url: serviceChoose + "/Regin" + "?strXML=" + JSON.stringify({
				"IN": {
				"SYS": "001",
				"FUNC": "DC_Prove_List",
				"PATIID": patiID,
				"PAGEID": pageID
				}
			}),
			type: "get",
			dataType: "json",
			success: function (responseTxt) {
				debugger;
				$("#LoadedTip").hide();
				if(responseTxt.Result.ITEMLIST!=null) {
					var ITEM = responseTxt.Result.ITEMLIST.ITEM;
					$.each(ITEM, function (index, element) {
						var SHSJ = element.SHSJ,
						SHSJsplit = SHSJ.split(" "),
						SHSJTime = SHSJsplit[0];                                             //只获取年月日

						var examineLi = "<li class='inspectionLi' data-YZID='"+element.YZID+"' data-ID='"+element.ID+"' data-LX='"+element.LX+"' id='inspectionLi-" + element.ID + "'><span>" + element.JYXM + "</span><p>| " + element.JYR + " " + SHSJTime + " </p></li>";
						$("#inspection").append(examineLi);
						//同步增加对应PDF
						if ($('#inspectionPDF-' + element.ID).length == 0) {                     //防止重复创建
							HTMLdiv = "<div class='PDFdiv  HTML' id='inspectionHTML-" + element.ID + "'></div>";
							$("#PDFdivWrapBG").append(HTMLdiv);
						}
					});
				}
				
				$("#mainNavMinTwo4 ul li:first").css("color", "#fff").css("background", "#000");
				var wrap = $("#PDFdivWrapBG > div"),
				li = $("#mainNavMinTwo4 ul li");

				//PDF初始化
				var a = $(window).height();
				var b = $(window).width();
				if (wrap.length > 0) {         //若pdf不为空时 添加点击事件
					$(wrap).hide();
					PDFexchange.PDFexchange(wrap, li, "fuJian");

					//初始化头部显示值
					var item2 = $("#mainNavMinTwo4 ul li:first").parent().prev().text() + " | ",
					item3 = $("#mainNavMinTwo4 ul li:first span").text();
					$("#fuJian2").html(item2);
					$("#fuJian3").html(item3);
					//初始化PDF显示
					$(wrap[0]).show();
					if ($(wrap[0]).find("canvas").length < 1) {   //若无canvas则说明是第一次加载pdf，则进行pdf添加
						var wrapID = $(wrap)[0].id;
						$(wrap[0]).css("height", a - 65);

						PDFJS.getDocument('pdf/22.pdf').then(function (pdf) {
							var totalPages = pdf.numPages;
							utils.showAllPage(1, totalPages, pdf, wrapID);
							$("#LoadedTip").hide();
						});
					}
				}else {
					utils.showHide("无数据")
				}
			},

			error:function(){
				utils.showHide("加载失败");
			}

		});*/

	}

    //$.getJSON("json/inspection.json", function (responseTxt, statusTxt, xhr) {
    //    if (statusTxt == "success") {
    //
    //        var ITEM = responseTxt.ITEMLIST.ITEM;
    //
    //        //加载前要先清空内容
    //        $("#inspection li").remove();
    //        //pdf清空
    //        $("#PDFdivWrapBL > div").remove();
    //
    //        $.each(ITEM, function (index, element) {
    //
    //            var SHSJ = element.SHSJ,
    //                SHSJsplit = SHSJ.split(" "),
    //                SHSJTime = SHSJsplit[0];         //只获取年月日
    //
    //            var examineLi = "<li class='inspectionLi' id='inspectionLi-" + element.ID + "'><span>" + element.JYXM + "</span><p>| " + element.JYR + " " + SHSJTime + " </p></li>";
    //            $("#inspection").append(examineLi);
    //            //同步增加对应PDF
    //            if ($('#inspectionPDF-' + element.ID).length == 0) {                     //防止重复创建
    //                PDFdiv = "<div class='PDFdiv' id='inspectionPDF-" + element.ID + "'></div>";
    //                $("#PDFdivWrapBG").append(PDFdiv);
    //            }
    //        });
    //
    //
    //        $("#mainNavMinTwo4 ul li:first").css("color", "#fff").css("background", "#000");
    //
    //        var wrap = $("#PDFdivWrapBG > div"),
    //        li = $("#mainNavMinTwo4 ul li");
    //        $(wrap).hide();
    //        PDFexchange.PDFexchange(wrap, li,"fuJian");
    //
    //        //初始化头部显示值
    //        var item2=$("#mainNavMinTwo4 ul li:first").parent().prev().text()+" | ",
    //            item3=$("#mainNavMinTwo4 ul li:first span").text();
    //        $("#fuJian2").html(item2);
    //        $("#fuJian3").html(item3);
    //
    //        //PDF初始化
    //        var a = $(window).height();
    //        var b = $(window).width();
    //        $(wrap[0]).show();
    //        if ($(wrap[0]).find("canvas").length < 1) {
    //            var wrapID = $(wrap)[0].id;
    //            $(wrap[0]).css("height", a - 65);
    //
    //            PDFJS.getDocument('pdf/22.pdf').then(function (pdf) {
    //                var totalPages = pdf.numPages;
    //                utils.showAllPage(1, totalPages, pdf, wrapID);
    //                $("#LoadedTip").hide();
    //            });
    //        }
    //
    //        $("#LoadedTip").hide();
    //
    //
    //    }
    //});

    return {
        examine:examine
    };
});

