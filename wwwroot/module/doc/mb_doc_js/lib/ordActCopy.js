define(["jquery", "hammer", "jqueryhammer", "dataLoad", "utils"], function (jquery, hammer, jqueryhammer, dataLoad, utils) {

    var serviceChoose = utils.urlFunction();

    //医嘱复制 打开复制层
    hammeryzButtonCopy = $("#yzButtonCopy").hammer();
    hammeryzButtonCopy.on("tap", function (ev) {

        if (!$(this).hasClass("noEdit")) {

            $("#newOd-newOdButton").removeClass("buttonNoEdit");                                      //待保存新开按钮
            $("#yzxdDaiBaoCun .yzDBCButtonBox .buttonText:first").removeClass("textNoEdit");          //待保存新开按钮
            $("#newOd-ButtonDell").addClass("buttonNoEdit");                                          //待保存删除按钮
            $("#yzxdDaiBaoCun .yzDBCButtonBox .buttonText").eq(2).addClass("textNoEdit");             //待保存删除按钮
            $("#newOd-ButtonYBZJ").addClass("buttonNoEdit");                                          //待保存追加按钮
            $("#newOd-TextYBZJ").addClass("textNoEdit");                                              //待保存追加按钮

            $("#yzfzBingRen").empty("li");

            // 传入参数
            var ksID = $("#slzyID").attr("data-ksid");       // 科室ID
            var brID = $("#slzyID").attr("data-patiid");   // 病人ID
            var ysName = $("#userInfobox font").text();    // 医生姓名

            dataLoad.qxDellCount();

            // 默认调取 长期 全部
            $("#LoadedTip").show();
            $.ajax({
                url: serviceChoose + '/DC_Patient_List',
                type: "post",
                timeout: utils.timeoutSec(),
                data: JSON.stringify({
                    "IN":
                        {
                            "KS": ksID,
                            "BQ": "",
                            "YS": ysName,
                            "YLZ": "",            //医疗组
                            "ZT": "1",            //在院：1，出院：0
                            "WD": "0",            //我的病人：1，所有病人：0
                            "HZ": "0"             //会诊病人：1，ZT和WD不传
                        }
                }),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json',                   
                },
                success: function (responseTxt) {
                    $("#LoadedTip").hide();
                    //console.log("传入值--------------------------");
                    //console.log("科室ID:"+ksID);
                    //console.log("医生姓名:"+ysName);				
                    //console.log("输出值--------------------------");
                    //console.log(responseTxt);
                    // 循环输出所有本科室的病人
                    for (var ii = 0; ii < responseTxt.Result.OUTPUT.PATILIST.PATIENT.length; ii++) {
                        var thisKsid = responseTxt.Result.OUTPUT.PATILIST.PATIENT[ii].KSID;
                        var thisPatiid = responseTxt.Result.OUTPUT.PATILIST.PATIENT[ii].PATIID;
                        var thisBaby = responseTxt.Result.OUTPUT.PATILIST.PATIENT[ii].BABY;
                        var thisPageid = responseTxt.Result.OUTPUT.PATILIST.PATIENT[ii].PAGEID;
                        var thisXm = responseTxt.Result.OUTPUT.PATILIST.PATIENT[ii].XM;
                        var thisZyh = responseTxt.Result.OUTPUT.PATILIST.PATIENT[ii].ZYH;
                        var thisCh = responseTxt.Result.OUTPUT.PATILIST.PATIENT[ii].CH + '床';
                        if (thisKsid == ksID) {
                            $("#yzfzBingRen").append('<li data-ksid="' + thisKsid + '" data-patiid="' + thisPatiid + '" data-baby="' + thisBaby + '" data-pageid="' + thisPageid + '"><p>' + thisXm + '<span class="float-right">' + thisCh + '</span></p><span>住院号：' + thisZyh + '</span></li>');
                        }
                    }

                    // 默认选中第一个病人
                    $("#yzfzBingRen li").removeClass("active");
                    $("#yzfzBingRen li:first").addClass("active");

                    // 注册事件
                    var hammeryzfzBingRen = $("#yzfzBingRen li").hammer();
                    hammeryzfzBingRen.on("tap", function () {
                        $("#yzfzBingRen li").removeClass("active");
                        $(this).addClass("active");
                        dataLoad.qxDellCount();  // 清空已经选择的数据
                        dataLoad.yzfzOrdActList("yes", "0");
                    });

                    // 加载医嘱内容
                    dataLoad.yzfzOrdActList("yes", "0");

                    $("#yzfzFather").show();
                    $("#yzfzBox").addClass('animated').addClass('bounceInRight').show();
                    $(".tmc").show();
                    $("#buttonyzfzCancel").show();
                    $("#buttonyzfzConfirm").show();

                },
                error: function () {
                    utils.showHide("加载超时，请重试。");   //点击调用ajax
                    $("#LoadedTip").hide();
                }
            });




            //清空搜索文字
            $("#yzfzSearchBox").text("请输入查询关键字");
            $("#zyfzkeyboard").hide();//键盘隐藏
        }//if
    });



    //医嘱复制 关闭
	/*hammeryzfzBox = $("#yzfzBox").hammer();
	hammeryzfzBox.on('swiperight',function(ev){
		$("#yzfzBox").removeClass('animated').removeClass('bounceInRight').hide();
		$("#yzfzFather").hide();
		$(".tmc").hide();
	});*/

    hammerbuttonyzfzCancel = $("#buttonyzfzCancel").hammer();
    hammerbuttonyzfzCancel.on('tap', function (ev) {
        $("#yzfzBox").removeClass('animated').removeClass('bounceInRight').hide();
        $("#yzfzFather").hide();
        $(".tmc").hide();
    });
    //搜索
    $("#zyfzkeyboard").unbind();
    var zyfzkeyboardwrap = $("#zyfzkeyboard").hammer();
    zyfzkeyboardwrap.on('tap', function (event) {
        $("#zyfzkeyboard").hide();
    });

    //医嘱复制 搜索
    var yzfzSearchBoxhammer = $("#yzfzSearchBox").hammer();
    yzfzSearchBoxhammer.on('tap', function (event) {
        var divLeftjl = $("#yzfzBox").offset().left;
        $("#zyfzkeyboard>.zyfzkeyboard").css("left", parseInt(divLeftjl) + 162)
        $("#zyfzkeyboard").show();
    });
    //按钮注册点击事件
    $("#zyfzkeyboard > .zyfzkeyboard >.countbox-botton").on('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation(); //事件阻止
        var inputcont = $("#yzfzSearchBox").text();
        if (inputcont == "请输入查询关键字") {
            $("#yzfzSearchBox").html($(this).text());
        } else {
            $("#yzfzSearchBox").append($(this).text());
        }
        searchPati();
    });
    //按钮回退
    $("#zyfzkeyboard > .zyfzkeyboard >.countbox-back").on('touchstart', function (event) {
        event.preventDefault();
        event.stopPropagation();//事件阻止
        fallback();
        searchPati();
    });
    //搜索函数
    function searchPati() {
        var hospitalID = [], bedNum = [], aarry = [], barry = [];;
        var newinput = $("#yzfzSearchBox").text(); //输入框中文字
        if (newinput == "请输入查询关键字") {
            $("#yzfzBingRen > li").show();
        } else {
            //获取列表的住院id 和床号
            var hospitalID = [], bedNum = [];
            for (var i = 0; i < $("#yzfzBingRen > li").length; i++) {
                var patienId = $("#yzfzBingRen > li").eq(i).children('span').text(); //住院id 
                var patienIdtext = patienId.replace(/[^0-9]/ig, "")
                hospitalID.push(patienIdtext);
                var Num = $("#yzfzBingRen > li").eq(i).children('p').children('span').text(); //床号
                var textNum = Num.replace(/[^0-9]/ig, "");  //只保留数组
                bedNum.push(textNum);
            };
            //console.log(hospitalID);
            //console.log(bedNum);
            var aarry = [], barry = [];
            for (var a in hospitalID) {  //住院id 匹配
                if (hospitalID[a].indexOf(newinput) != -1) {
                    $("#yzfzBingRen > li").eq(a).show();
                    aarry.push(a)
                } else {
                    $("#yzfzBingRen > li").eq(a).hide();
                };
            };
            for (var b in bedNum) {  //床号匹配
                if ($("#yzfzBingRen > li").eq(b).css("display") == "none") {  //之前没有匹配上的li  匹配
                    if (bedNum[b].indexOf(newinput) != -1) {
                        $("#yzfzBingRen > li").eq(b).show();
                        barry.push(b)
                    } else {
                        $("#yzfzBingRen > li").eq(b).hide();
                    };
                };
            }

            //console.log(aarry);
            //console.log(barry);
        }

        // for (var j = 0; j < $("#yzfzBingRen > li").length; j++) {

        // }

    }
    //回退
    function fallback() {
        if ($("#yzfzSearchBox").html() != "请输入查询关键字") {
            var schar = $("#yzfzSearchBox").text();
            arr = schar.substring(0, schar.length - 1);
            $("#yzfzSearchBox").text(arr);
        }
        if ($("#yzfzSearchBox").text() == "") {
            $("#yzfzSearchBox").html("请输入查询关键字");
        }
    }

});