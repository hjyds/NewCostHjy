define(["jquery", "hammer","jqueryhammer","utils"], function(jquery, hammer, jqueryhammer,utils) {
    
   
    function PDFexchange(wrap,li,topID) {       //wrap为当前目录下的所有pdf容器;li为当前目录下的所有li;topID为顶部导航条ID
       
        var serviceChoose = utils.urlFunction();
        var a = $(window).height();
        var b = $(window).width();

        hammerMinTwo = $(li).hammer();
        hammerMinTwo.on('tap', function (ev) {
            //更改头部显示值
            var item2=$(this).parent().prev().text()+" | ",
                item3=$($(this)[0].firstChild).text();
                $("#"+topID+"2").html(item2);
                $("#"+topID+"3").html(item3);
            debugger;
            var patiId=$("#slzyID").attr("data-patiID");
            var pageID=$("#slzyID").attr("data-pageID");
            var huoquID=$(this).attr("id");
            // $("#disProve li").attr("id");
            
            // var fileID=huoquID.split("-")[1];
            // $.ajax({
            //     url: serviceChoose + "/Regin" + "?strXML=" + JSON.stringify({
            //         "IN": {
            //             "SYS": "001",
            //             "FUNC": "DC_CaseHistory_Data",
            //             "FILE": fileID,            //文件ID
            //             "TYPE": "1",                  //固定传1
            //             "PATIID": patiId,            //病人ID
            //             "PAGEID": pageID                 //主页ID
            //         }
            //     }),
            //     type: 'GET',
            //     // timeout:5000,
            //     success: function(contpdf){
            //         console.log(contpdf);

                    // $("#LoadedTip").show();
                    $(wrap).hide();              //所有PDF隐藏
                    $(li).removeClass("XuanZhong");
                    $(this).addClass("XuanZhong");          //样式改变

                    //病程记录部分，要做相应判断
                    if($(this).text().indexOf("病程记录")==0){   //字符串匹配
                        $("#bingLi-List").show();          //目录按钮
                        $("#bingLiXML").show();            //XML文件
                        $("#LoadedTip").hide();

                    }else {
                        $("#bingLi-List").hide();
                        $("#bingLiXML").hide();
                        //点击时 加载相应pdf

                        var mainNavMinTwoLiID = $(this)[0].id.split("-");  //分解 LI  ID
                        var thisLX=$(this).attr("data-LX");
                        var thisYZID=$(this).attr("data-YZID");
                        var thisBBID=$(this).attr("data-ID");
                        $.each(wrap, function (index, element) {    //遍历所有PDF进行匹配显示
                            var elementID = element.id.split("-");  //分解   IDP DF
                            if(mainNavMinTwoLiID[0]!="inspectionLi") {                      //判断是否为检验报告------不为检验报告则加载pdf
                                if (elementID[1] == mainNavMinTwoLiID[1]) {
                                    //当前匹配的PDF显示
                                    $(this).show();
                                    $("#LoadedTip").hide();
                                    if ($(this).find("canvas").length < 1) {
                                        $(this).css("height", a - 65);
                                        PDFJS.getDocument('pdf/11.pdf').then(function (pdf) {           //PDF路径
                                            var totalPages = pdf.numPages;
                                            utils.showAllPage(1, totalPages, pdf, element.id);
                                        });
                                    }
                                }
                            }
                        });
                        //点击时 加载相应pdf--------------------------------------------------------------------------------------
                    }
                    //病程记录部分，要做相应判断----------------------------------------------------------------------------
            //    },
            //     error: function () {
            //         utils.showHide("请求超时，请重试。");
            //         $("#LoadedTip").hide();
            //     }
            // })

        });
    }

    return {
        PDFexchange:PDFexchange
    }

});