/***
 **************************************************************
 *                                                            *
 *   .=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-.       *
 *    |                     ______                     |      *
 *    |                  .-"      "-.                  |      *
 *    |                 /            \                 |      *
 *    |     _          |              |          _     |      *
 *    |    ( \         |,  .-.  .-.  ,|         / )    |      *
 *    |     > "=._     | )(__/  \__)( |     _.=" <     |      *
 *    |    (_/"=._"=._ |/     /\     \| _.="_.="\_)    |      *
 *    |           "=._"(_     ^^     _)"_.="           |      *
 *    |               "=\__|IIIIII|__/="               |      *
 *    |              _.="| \IIIIII/ |"=._              |      *
 *    |    _     _.="_.="\          /"=._"=._     _    |      *
 *    |   ( \_.="_.="     `--------`     "=._"=._/ )   |      *
 *    |    > _.="                            "=._ <    |      *
 *    |   (_/                                    \_)   |      *
 *    |                                                |      *
 *    '-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-='      *
 *                                                            *
 *           LASCIATE OGNI SPERANZA, VOI CH'ENTRATE           *
 **************************************************************
 如果你看到了这里，我不知道是该祝贺你还是应该提醒你。你加入了一个很不错的公司
 当然除了福利好之外也就那样了。
 没有钱了 肯定要做啊 不做没有钱用 。
 涨工资这方面 涨工资是不可能涨的 这辈子不可能涨工资的 。
 项目奖年终奖也不会有 就是维护代码 才能维持的了生活这样子。
 兄dei，我只能帮你到这了 
 */

define(["jquery", "hammer", "jqueryhammer", "utils", "dataLoad", "dateTime"], function (jquery, hammer, jqueryhammer, utils, dataLoad, dateTime) {
    var serviceChoose = utils.urlFunction();
    var yiZhuList = [];
    var yiZhuJianYanObject = "";
    var dlClickNo;             // 单量点击次数计算
    var zlClickNo;             // 总量点击次数计算
    var tsClickNo;             // 天数点击次数计算
    var doctorActiveMX = [];   // 保存医嘱字段的变量
    var syzh = 0, saveNum = 1,//判断是否第一次验证
        orderXML = null,//禁用药节点
        stopFlag = false, //有无禁用药
        reasonFlag = false,//历史药品原因记录
        yzstatus = false,//药品修改状态
        saveFlag = false,//参数接口是否允许禁用下达和备注后继续开药
        jjyy = null,//禁忌药品要求填写原因
        jjyz = null,//允许下达禁忌药嘱
        ywjj = null,//允许下达院外执行的禁忌药品医嘱
        descArry = [];//医嘱备注存储数组
    var ybzjYaoPin = {           // 保存一并追加字段的变量
        sfjj: "",
        kssj: "",
        gytj: "",
        gytjID: "",
        zxpl: "",
        sjfa: "",
        gyzx: "",
        gyzxID: "",
        zxxz: "",
        ID: "",
        ts: "",
        ds: "",
        ybID: ""
    };
    var jcxm = [];             // 追加检验项目 检查部位 申请副项 的存储变量
    var jyxm = [];
    var sqfx = [];
    var ctObjectData = [];     // 追加成套项目的 存储变量
    // 天数计算器
    var totalsDay = '0';
	
    var a = $(window).height();//获取屏幕高度
    //导航二级菜单 医嘱期效
    hammerMinTwo2 = $("#qxSelect li").hammer();
    hammerMinTwo2.on('tap', function (ev) {
        if (!$(this).hasClass('XuanZhong')) {
            $(this).addClass("XuanZhong").siblings().removeClass("XuanZhong");
            $("#dhTextChangQiYZ").text($(this).text());
            if ($(this).text() == "长期医嘱") {
                $("#flSelect li").removeClass('XuanZhong');
                $("#flSelect li").eq(0).addClass('XuanZhong');
            } else {
                $("#flSelect li").removeClass('XuanZhong');
                $("#flSelect li").eq(1).addClass('XuanZhong');
            }
            docActListLoad("yes", 0);
            // 默认浏览模式
            $("#yzButtonEditOne").text("编辑");
            $("#yzButtonDell").removeClass('noEdit').hide();
            $("#yzButtonEdit").removeClass('noEdit').hide();
            $("#yzButtonZFei").removeClass('noEdit').hide();
            $("#yzButtonTZhi").removeClass('noEdit').hide();
            $("#yzButtonNew").removeClass('noEdit').hide();
        }
    });
    //导航二级菜单 医嘱分类
    hammerMinTwoFL = $("#flSelect li").hammer();
    hammerMinTwoFL.on('tap', function (ev) {
        if (!$(this).hasClass('XuanZhong')) {
            $("#flSelect li").removeClass("XuanZhong");
            $(this).addClass("XuanZhong");
            $("#dhTextDangQianYZ").text($(this).text());
            docActListLoad("yes", 0);
            // 默认浏览模式
            $("#yzButtonEditOne").text("编辑");
            $("#yzButtonDell").removeClass('noEdit').hide();
            $("#yzButtonEdit").removeClass('noEdit').hide();
            $("#yzButtonZFei").removeClass('noEdit').hide();
            $("#yzButtonTZhi").removeClass('noEdit').hide();
            $("#yzButtonNew").removeClass('noEdit').hide();
        }
    });

    // 下拉加载医嘱数据
    var allPageCount;             // 病人医嘱列表总页数
    var nowPage;                  // 当前页
    var loadSwitch = true;        // 是否可加载 因为：苹果系统滚动条滑动的时候，会加很多像素，导致重复执行。
    $("#tableBodyScroll").scroll(function (e) {
        if (($("#tableBodyScroll").scrollTop() + $("#tableBodyScroll").height()) > $("#CQATable").height() && nowPage < allPageCount && loadSwitch == true) {
            loadSwitch = false;
            docActListLoad("no", parseInt(nowPage));  // 不清空TR，从下一页开始加载
            //$("#dhTextDangQianYZ").text("滑动高度="+($("#tableBodyScroll").scrollTop()+$("#tableBodyScroll").height()));
            //$("#dhTextDangQianYZ").text($("#dhTextDangQianYZ").text()+"    表格高度="+$("#CQATable").height());
        }
    });

    // 加载医嘱列表函数
    function docActListLoad(dellTr, startPage) {

        if (dellTr == "yes") {
            // 清除table的内容 以免重新追加
            $("#CQATable").empty("tr").scrollTop(0);
        }

        // 准备传入值
        var patiID = $("#slzyID").attr("data-patiid");        // 病人ID
        var ksID = $("#userInfobox font").attr("data-ksid");  // 科室ID
        var baby = $("#slzyID").attr("data-baby");            // 是否为婴儿
        var pageID = $("#slzyID").attr("data-pageid");        // 病人第几次住院
        var qx = $("#mainNavMinTwo2 #qxSelect").find(".XuanZhong").attr("data-text");  // 期效
        var fl = $("#mainNavMinTwo2 #flSelect").find(".XuanZhong").attr("data-text");  // 分类

        $("#LoadedTip").show();
        var getData = new Date();
        // 加载医嘱内容
        $.ajax({
            url: serviceChoose + '/DC_Advice_NewLists',
            //async: false,
            type: "post",
            data: JSON.stringify({
                "IN":
                {
                    "QX": qx,                              // 查询条件
                    "XX": fl,                              // 查询条件
                    "ID": null,                            // 编辑时传递 医嘱ID
                    "PATIID": patiID,                      // 病人ID
                    "PAGEID": pageID,					   // 第几次住院
                    "BABY": baby == "yes" ? 1 : 0,           // 是否为婴儿
                    "STARTPAGE": startPage,                // 第几页开始
                    "PAGECOUNT": "1",                      // 返回几页
                    "ITEMCOUNT": "50",                     // 没页返回的条数
                    "KSID": ksID,                          // 科室ID
                    "ZD": utils.getZdId(),                  // 站点ID，今后多个站点会用
                    "timestamp": getData.getTime()
                }
            }),
            timeout: utils.timeoutSec(),
            dataType: "json",
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (responseTxt) {
                if (responseTxt.Result.ERROR) {
                    $("#LoadedTip").hide();
                    utils.showHide(responseTxt.Result.ERROR.MSG);
                } else {
                    allPageCount = responseTxt.Result.OUTPUT.YZLIST.ZYS;  // 更新总页数的值
                    nowPage = responseTxt.Result.OUTPUT.YZLIST.DQY;       // 更新当前页的值

                    var CQATableLastTrDate = ""; // 获取表格内最后那条医嘱的日期
                    if ($("#CQATable").find("tr").length > 0) {
                        for (var tbi = $("#CQATable").find("tr").length - 1; tbi >= 0; tbi--) {
                            if ($("#CQATable").find("tr").eq(tbi).find("td").eq(0).text() !== "") {
                                CQATableLastTrDate = $("#CQATable").find("tr").eq(tbi).find("td").eq(0).text();
                                break;
                            }
                        }
                    }

                    // 如果有医嘱节点
                    if (responseTxt.Result.OUTPUT.YZLIST.YZ) {
                        var YZ = responseTxt.Result.OUTPUT.YZLIST.YZ;
                        for (var yzii = 0; yzii < YZ.length; yzii++) {
                            // 分离本条 开始执行时间 字段，获取本条医嘱的日期和时间
                            var KSZXSJ = YZ[yzii].KSZXSJ.split(" ");
                            var yzdate = KSZXSJ[0];
                            var yztimee = KSZXSJ[1].split(":");
                            var yztime = yztimee[0] + ":" + yztimee[1];

                            // 分离上一条 开始执行时间 字段，获取上一条医嘱的日期
                            if (yzii > 0) {
                                var yzdatePrev = "";
                                for (var striPrev = 0; striPrev < YZ[yzii - 1].KSZXSJ.length; striPrev++) {
                                    if (striPrev < 10) {
                                        yzdatePrev = yzdatePrev + YZ[yzii - 1].KSZXSJ[striPrev];
                                    }
                                }
                            }

                            // 医嘱颜色
                            var Textcolor = 'color:' + utils.colorCompute(YZ[yzii].YZYS) + ';';
                            // 如果是作废的，判断医嘱状态为4的
                            var zfState = '';
                            if (YZ[yzii].YZZT == 4) zfState = 'text-decoration:line-through';
                            // 绑定数据
                            var trData = 'id="' + YZ[yzii].ID + '" data-yzzt="' + YZ[yzii].YZZT + '" data-sczxsj="' + YZ[yzii].SCZXSJ + '"';
                            // 日期
                            var textDate = '<td style="width:10%" class="text-center"></td>';
                            if (!(yzdatePrev == yzdate || yzdate == CQATableLastTrDate)) {
                                textDate = '<td style="width:10%" class="text-center">' + yzdate + '</td>';
                            }
                            var icon = '';                    // 图标
                            if (YZ[yzii].JJBZ == 1) {           // 是否紧急
                                icon = ' <span class="fs1" aria-hidden="true" data-icon="" style="color:#ff0000;"></span>';
                            } else if (YZ[yzii].JJBZ == 2) {     // 补录医嘱
                                icon = ' <span class="fs1" aria-hidden="true" data-icon="" style="color:#00A7FF;"></span>';
                            }
                            // 时间
                            var textTime = '<td style="width:10%" class="text-center">' + yztime + icon + '</td>';
                            // 医嘱 单量
                            var yzNr = '';
                            var yzDl = '';
                            if (YZ[yzii].ZLLB == "D") {
                                //if (YZ[yzii].ITEMLIST !== null) {
                                //    for (var OI = 0; OI < YZ[yzii].ITEMLIST.ITEM.length; OI++) {
                                //        var BBBW = YZ[yzii].ITEMLIST.ITEM[OI].BBBW == null ? '' : YZ[yzii].ITEMLIST.ITEM[OI].BBBW;
                                //        var JCFF = YZ[yzii].ITEMLIST.ITEM[OI].JCFF == null ? '' : YZ[yzii].ITEMLIST.ITEM[OI].JCFF;
                                //        yzNr = yzNr + '<p>' + YZ[yzii].ITEMLIST.ITEM[OI].YZNR + ':' + BBBW + '（' + JCFF + '）</p>';
                                //        yzDl = yzDl + '<p>' + (YZ[yzii].ITEMLIST.ITEM[OI].DL == null ? "" : YZ[yzii].ITEMLIST.ITEM[OI].DL) + '</p>';
                                //    }
                                //} else {
                                //    yzNr = yzNr + '<p>' + YZ[yzii].YZNR + '</p>';
                                //    yzDl = yzDl + '<p>' + (YZ[yzii].YL == null ? "" : YZ[yzii].YL) + '</p>';
                                //}
                                yzNr = yzNr + '<p>' + YZ[yzii].YZNR + '</p>';
                                yzDl = yzDl + '<p>' + (YZ[yzii].YL == null ? "" : YZ[yzii].YL) + '</p>';

                            } else {
                                if (YZ[yzii].ITEMLIST !== null) {
                                    for (var YI = 0; YI < YZ[yzii].ITEMLIST.ITEM.length; YI++) {
                                        var KSS = YZ[yzii].ITEMLIST.ITEM[YI].KSS;
                                        var CFZW = YZ[yzii].ITEMLIST.ITEM[YI].CFZW;
                                        yzNr = yzNr + '<p data-kss="' + KSS + '" data-cfzw="' + CFZW + '">' + YZ[yzii].ITEMLIST.ITEM[YI].YZNR + '</p>';
                                        yzDl = yzDl + '<p>' + (YZ[yzii].ITEMLIST.ITEM[YI].DL == null ? "" : YZ[yzii].ITEMLIST.ITEM[YI].DL) + '</p>';
                                    }
                                } else {
                                    yzNr = yzNr + '<p>' + YZ[yzii].YZNR + '</p>';
                                    yzDl = yzDl + '<p>' + (YZ[yzii].YL == null ? "" : YZ[yzii].YL) + '</p>';
                                }
                            }
                            var textYz = '<td style="width:30%; text-align:left;" id="' + YZ[yzii].ID + 'yz' + '">' + yzNr + '</td>';
                            var textDl = '<td style="width:10%;" class="text-center" id="' + YZ[yzii].ID + 'dl' + '">' + yzDl + '</td>';
                            // 用法
                            if(YZ[yzii].ITEMLIST){
                                 if(YZ[yzii].ITEMLIST.ITEM[0].ZLLB == '7'){
                                     var textYf = '<td style="width:10%"><p>' + (YZ[yzii].YF == null ? "" : YZ[yzii].YF) + '</p><p>' + (YZ[yzii].ZXPC == null ? "" : YZ[yzii].ZXPC) + '</p><p>' + (YZ[yzii].ITEMLIST.ITEM[0].YL == null ? "" : YZ[yzii].ITEMLIST.ITEM[0].YL) + '</p></td>';
                                 }else{
                                     var textYf = '<td style="width:10%"><p>' + (YZ[yzii].YF == null ? "" : YZ[yzii].YF) + '</p><p>' + (YZ[yzii].ZXPC == null ? "" : YZ[yzii].ZXPC) + '</p></td>';
                                 }
                            }else{
                                var textYf = '<td style="width:10%"><p>' + (YZ[yzii].YF == null ? "" : YZ[yzii].YF) + '</p><p>' + (YZ[yzii].ZXPC == null ? "" : YZ[yzii].ZXPC) + '</p></td>';
                            }

                            // 时间方案
                            var textsjfa = '<td style="width:10%">' + (YZ[yzii].ZXSJFA == null ? "" : YZ[yzii].ZXSJFA) + '</td>';
                            // 开嘱人
                            var textKzr = '<td style="width:10%">' + (YZ[yzii].KZYS == null ? "" : YZ[yzii].KZYS) + '</td>';
                            // 执行科室
                            var textZxks = '<td style="width:10%">' + (YZ[yzii].ZXKS == null ? "" : YZ[yzii].ZXKS) + '</td>';

                            // 追加
                            $("#CQATable").append('<tr ' + trData + ' style="' + Textcolor + zfState + '">' + textDate + textTime + textYz + textDl + textYf + textsjfa + textKzr + textZxks + '</tr>');
                        }//for
                    }//if

                    $("#CQATable tr").unbind();
                    //医嘱table
                    $("#CQATable tr").on("touchstart touchmove", function () {
                        utils.CpStart($(this));
                    });
                    $("#CQATable tr").on("touchend", function () {
                        $(this).css("background", "#fff");
                    });
                    // 注册tr点击事件
                    var hammerCQATableTr = $("#CQATable tr").hammer();
                    hammerCQATableTr.on("tap", function () {
                        docAdvZhiXinState($(this));
                    });
                    // 注册tr长按事件
                    var hammerCQATableTrPress = $("#CQATable tr").hammer();
                    hammerCQATableTrPress.on("press", function () {
                        docAdvPress($(this));
                    });
                    loadSwitch = true;
                }
                $("#LoadedTip").hide();

                //utils.wipeMore($("#tableBodyScroll"),0);		
            },
            complete: function (XMLHttpRequest, status) {
                utils.errorAjax(status, docActListLoad, [dellTr, startPage]);
            }
        });

        $("#yzButtonBox").show();   // 医嘱新开、复制按钮
        $("#yzButtonBox>div").hide();
        $("#yzButtonEditOne").show().text("编辑");
        $("#bingLi-List").hide();
        $("#huaDong > div").hide();
        $("#huaDongYiZhu").show();
    }

    // 点击行
    function docAdvZhiXinState(thisTr) {
        $("#CQATable tr").removeClass("active");
        thisTr.addClass("active");

        // 医嘱编辑
        if ($("#yzButtonEditOne").text() == "完成") {
            var sczxsj = thisTr.attr("data-sczxsj");  // 上次执行时间
            var yzzt = thisTr.attr("data-yzzt");      // 医嘱状态
            var lcljState = $("#slLCLJ").attr("data-lcljzt");   // 临床路径状态
            var ljState = $("#slLCLJ").attr("data-ljzt");       // 路径状态

            if (lcljState == "null" || lcljState == "0" || lcljState == "3") {

                // 判断是否能编辑
                if (yzzt == "-1" || yzzt == "1" || yzzt == "2") {
                    $("#yzButtonEdit").removeClass("noEdit").show();          // 可以编辑
                } else {
                    $("#yzButtonEdit").addClass('noEdit').show();   // 不能编辑
                }

                // 判断是否能作废
                if (yzzt !== "-1" && yzzt !== "1" && yzzt !== "2" && yzzt !== "4" && yzzt !== "8" && yzzt !== "9" && sczxsj == "null") {
                    $("#yzButtonZFei").removeClass("noEdit").show();          // 可以作废
                } else {
                    $("#yzButtonZFei").addClass('noEdit').show();   // 不能作废
                }

            } else if (lcljState == "1" || lcljState == "2") {
                // 不能修改、作废
                $("#yzButtonEdit").addClass('noEdit').show();   // 不能编辑
                $("#yzButtonZFei").addClass('noEdit').show();   // 不能作废
            }

            // 判断是否能停止
            if (yzzt == "3" || yzzt == "5" || yzzt == "6" || yzzt == "7") {
                $("#yzButtonTZhi").removeClass("noEdit").show();          // 可以停止
                $("#timeControlWrapInput").val(utils.todayNow());
            } else {
                $("#yzButtonTZhi").addClass('noEdit').show();   // 不能停止
            }

            // 判断是否能删除
            if (yzzt == "1") {
                $("#yzButtonDell").removeClass("noEdit").show();          // 可以删除
            } else {
                $("#yzButtonDell").addClass('noEdit').show();   // 不能删除
            }
        } else if ($("#yzButtonEditOne").text() == "编辑" && !$("#yzParticulars").is(":hidden") && thisTr.attr("id") !== $("#yzParticulars").attr("data-yzid")) {
            $("#yzParticulars").removeClass('animated bounceInRight bounceOutRight').addClass('animated bounceOutRight');
        }
    }

    // 长按行
    function docAdvPress(thisTr) {
        $("#CQATable tr").removeClass("active");
        thisTr.addClass("active");
        // 医嘱执行情况 显示
        if ($("#yzButtonEditOne").text() == "编辑") {
            $("#LoadedTip").show();

            // 准备传入值
            var patiID = $("#slzyID").attr("data-patiid");        // 病人ID
            var baby = $("#slzyID").attr("data-baby");            // 是否为婴儿
            var pageID = $("#slzyID").attr("data-pageid");        // 病人第几次住院
            var thisID = thisTr.attr("id");                     // 医嘱ID
            var ksID = $("#userInfobox font").attr("data-ksid");  // 科室ID
            var qx = $("#mainNavMinTwo2 #qxSelect").find(".XuanZhong").attr("data-text");  // 期效
            var fl = $("#mainNavMinTwo2 #flSelect").find(".XuanZhong").attr("data-text");  // 分类

            var showYJ = 0;  // 加载层隐藏依据 待两个JSON都加载完才隐藏

            $.ajax({
                url: serviceChoose + '/DC_Advice_NewLists',
                //async: true,
                type: "post",
                data: JSON.stringify({
                    "IN":
                    {
                        "QX": qx,                              // 查询条件
                        "XX": fl,                              // 查询条件
                        "ID": null,                            // 编辑时传递 医嘱ID
                        "PATIID": patiID,                      // 病人ID
                        "PAGEID": pageID,					   // 第几次住院
                        "BABY": baby == "yes" ? 1 : 0,           // 是否为婴儿
                        "STARTPAGE": 0,                        // 第几页开始
                        "PAGECOUNT": allPageCount,             // 返回几页
                        "ITEMCOUNT": "50",                     // 每页返回的条数
                        "KSID": ksID,                          // 科室ID
                        "ZD": utils.getZdId()                  // 站点ID，今后多个站点会用
                    }
                }),
                timeout: utils.timeoutSec(),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (responseTxt) {
                    if (responseTxt.Result.ERROR) {
                        $("#LoadedTip").hide();
                        utils.showHide(responseTxt.Result.ERROR.MSG);
                    } else {
                        showYJ = showYJ + 1; // 更新加载层隐藏依据

                        $("#QKyznrdl").empty("ul");
                        $("#QKyznr").text("").parent().hide();
                        if (responseTxt.Result.OUTPUT.YZLIST.YZ) { //数据存在
                            for (var yzi = 0; yzi < responseTxt.Result.OUTPUT.YZLIST.YZ.length; yzi++) {
                                if (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ID == thisID) {

                                    // 0 长期医嘱 1 临时医嘱
                                    $("#QKyzqx").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YZQX == 0 ? "长期医嘱" : "临时医嘱");
                                    // 开始执行时间
                                    $("#QKkssj").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KSZXSJ);
                                    // 时间方案
                                    $("#QKsjfa").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXSJFA);
                                    // 给药途径
                                    $("#QKjmdz").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YF);
                                    //中药总量
                                    if(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST){
                                        if(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[0].ZLLB =='7'){
                                            $("#PTPZL").show();
                                            $("#TPZL").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[0].YL);
                                        }else{
                                            $("#PTPZL").hide();
                                            $("#TPZL").text('');
                                        }
                                    }
                                    // 频率
                                    $("#QKpl").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXPC);
                                    // 医生嘱托
                                    if(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST){
                                          if(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[0].ZLLB =='5'){
                                              $("#QKyszt").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[0].YSZT);
                                          }else{
                                              $("#QKyszt").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YSZT);
                                          }
                                    }else{
                                        $("#QKyszt").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YSZT);
                                    }

                                    // 执行科室
                                    $("#QKzxks").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ZXKS);

                                    // 医嘱内容
                                    if (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST == null) {
                                        $("#QKyznr").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].YZNR).parent().show();
                                    } else {
                                        for (var yaoi = 0; yaoi < responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM.length; yaoi++) {
                                            if (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].ZLLB == "D") {
                                                $("#QKyznrdl").append('<ul><li>医嘱内容：' + responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].YZNR + ':' + responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].BBBW + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].JCFF == null ? "" : '（' + responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].JCFF + '）') + '</li><li>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量：' + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].DL == null ? "" : responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].DL) + '</li></ul>');

                                            } else {
                                                $("#QKyznrdl").append('<ul><li>医嘱内容：' + responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].YZNR + '</li><li>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;量：' + (responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].DL == null ? "" : responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].ITEMLIST.ITEM[yaoi].DL) + '</li></ul>');
                                            }
                                        }
                                    }

                                    // 停止时间
                                    $("#QKtzsj").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].TZSJ);
                                    // 开嘱医生
                                    $("#QKkzys").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].KZYS);
                                    // 校对护士
                                    $("#QKxdhs").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].JDHS);
                                    // 停嘱医生
                                    $("#QKtzys").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].TZYS);
                                    // 确认停止
                                    $("#QKqrtz").text(responseTxt.Result.OUTPUT.YZLIST.YZ[yzi].QRTZ);

                                }
                            }
                        }
                        // 隐藏加载层
                        if (showYJ == 2) {
                            $("#LoadedTip").hide();
                        }
                    }

                },
                complete: function (XMLHttpRequest, status) {
                    utils.errorAjax(status, docAdvPress, [thisTr]);
                }

            });

            $.ajax({
                url: serviceChoose + "/DC_Advice_Exec",
                //async: true,
                type: "post",
                timeout: utils.timeoutSec(),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "PATIID": patiID,             // 病人ID
                    "PAGEID": pageID,             // 第几次住院 
                    "BABY": baby == "yes" ? 1 : 0,  // 是否BABY
                    "YZID": thisID                // 医嘱ID
                }),
                success: function (responseTxt) {
                    if (responseTxt.Result.ERROR) {
                        $("#LoadedTip").hide();
                        utils.showHide(responseTxt.Result.ERROR.MSG);
                    } else {
                        showYJ = showYJ + 1;  // 更新加载层隐藏依据
                        $("#QKzxnr").empty("ul");
                        if (!$.isEmptyObject(responseTxt.Result.YZEXEC) && responseTxt.Result.hasOwnProperty("ZXQK") && !$.isEmptyObject(responseTxt.Result.YZEXEC.YZZX.ZXQK)) {
                            if (!$.isEmptyObject(responseTxt.Result.YZEXEC.YZZX.ZXKS) || !$.isEmptyObject(responseTxt.Result.YZEXEC.YZZX.ZXZT) || !$.isEmptyObject(responseTxt.Result.YZEXEC.YZZX.ZXQK)) {
                                $("#QKzxnr").append('<ul><li>执行状态：' + responseTxt.Result.YZEXEC.YZZX.ZXZT + '</li><li>执行情况：</li></ul>');
                                for (var zxi = 0; zxi < responseTxt.Result.YZEXEC.YZZX.ZXQK.ITEM.length; zxi++) {
                                    $("#QKzxnr ul").append('<li>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' + responseTxt.Result.YZEXEC.YZZX.ZXQK.ITEM[zxi].ZXSJ + ' ' + (responseTxt.Result.YZEXEC.YZZX.ZXQK.ITEM[zxi].ZXZY == null ? "" : responseTxt.Result.YZEXEC.YZZX.ZXQK.ITEM[zxi].ZXZY) + ' ' + responseTxt.Result.YZEXEC.YZZX.ZXQK.ITEM[zxi].ZXR + '</li>');
                                }
                            }
                        }

                        // 隐藏加载层
                        if (showYJ == 2) {
                            $("#LoadedTip").hide();
                        }
                    }

                },
                complete: function (XMLHttpRequest, status) {
                    utils.errorAjax(status, docAdvPress, [thisTr]);
                }
            });

            $("#yzParticulars").removeClass('animated bounceOutRight bounceInRight').addClass('animated bounceInRight').show();
            utils.stopScroll("#yzParticulars", "#tableBodyScroll");
            $("#yzParticulars").attr("data-yzid", thisID);
        }
    }
    //医嘱执行情况 动画
    $("#yzParticulars").on("touchstart touchmove", function () {
        $(this).css("background", "-webkit-linear-gradient(top, #e7e9e9, #ffffff)")
    });
    $("#yzParticulars").on("touchend", function () {
        $(this).css("background", "-webkit-linear-gradient(top, #ffffff, #e7e9e9)")
    });

    //医嘱执行情况 隐藏
    hammeryzParticulars = $("#yzParticulars").hammer();
    hammeryzParticulars.on('swiperight', function (ev) {
        $("#yzParticulars").removeClass('animated bounceInRight bounceOutRight').addClass('animated bounceOutRight');
    });

    //医嘱编辑
    hammeryyzButtonEditOne = $("#yzButtonEditOne").hammer();
    hammeryyzButtonEditOne.on('tap', function (ev) {
        if ($(this).text() == "编辑") {
            $("#yzButtonEditOne").text("完成");
            // 判断病人的临床路径 是否可以新开、复制医嘱
            var lcljState = $("#slLCLJ").attr("data-lcljzt");   // 临床路径状态
            var ljState = $("#slLCLJ").attr("data-ljzt");       // 路径状态
            if ((lcljState == "null" || lcljState == 0 || lcljState == 3) || ((lcljState == 1 || lcljState == 2) && ljState == 0)) {
                $("#yzButtonNew").removeClass('noEdit').show();
                $("#yzButtonCopy").removeClass('noEdit').show();
            } else if ((lcljState == 1 || lcljState == 2) && ljState >= 1) {
                $("#yzButtonNew").addClass('noEdit').show();
                $("#yzButtonCopy").addClass('noEdit').show();
            }
            // 判断是否已选中某一行 如果选中 则要根据选中的医嘱判断显示哪些可操作的按钮
            if ($("#CQATable").find(".active").length > 0) {
                docAdvZhiXinState($("#CQATable").find(".active"));
            }
        } else {
            $("#yzButtonEditOne").text("编辑");
            $("#yzButtonDell").removeClass('noEdit').hide();
            $("#yzButtonEdit").removeClass('noEdit').hide();
            $("#yzButtonZFei").removeClass('noEdit').hide();
            $("#yzButtonTZhi").removeClass('noEdit').hide();
            $("#yzButtonNew").removeClass('noEdit').hide();
            $("#yzButtonCopy").removeClass('noEdit').hide();
        }
    });

    //医嘱新开
    hammeryzButtonNew = $("#yzButtonNew").hammer();
    hammeryzButtonNew.on("tap", function (ev) {
        saveNum = 1;
        if (!$(this).hasClass("noEdit")) {
            // $("#searchText").html("按拼音简码检索");  // 向收索框中写入汉字
            $("#searchText").val("");  // 向收索框中写入汉字
            $("#sskeyboardbox").hide();               // 搜索键盘隐藏
            $(".tmc").show();  //透明底层
            $("#yzxdFather").show();  //居中宽度透明底层
            utils.stopScroll("#yzxdFather", "#tableBodyScroll");
            $("#yzxdBox").addClass('animated').addClass('bounceInRight').show(); //下达块
            $("#buttonCancel").show(); //取消按钮
            $("#yzxdBiaoTi").show();
            $("#yzxdCL").show();
            $("#yzxdCL li").addClass("QY");  // 启用长期医嘱和临时医嘱的选项
            $("#yzxdOneJi").show();
            $("#yzxdBiaoTi font").text("医嘱下达");
            $("#buttonBackDBC").hide(); // 返回待保存按钮隐藏
            $("#yzxdDaiBaoCun").hide(); // 待保存块隐藏
            $("#yzdbcBiaoTi").hide();   // 待保存块顶部隐藏
            $("#yzxdTwoJi").hide();     // 二级隐藏
            $("#buttonConfirm").hide(); // 确定按钮隐藏
            $("#buttonBack").hide();    // 返回按钮隐藏
            $("#newOd-newOdButton").removeClass("buttonNoEdit");                                      //待保存新开按钮
            $("#yzxdDaiBaoCun .yzDBCButtonBox .buttonText:first").removeClass("textNoEdit");          //待保存新开按钮
            $("#newOd-ButtonDell").addClass("buttonNoEdit");                                          //待保存删除按钮
            $("#yzxdDaiBaoCun .yzDBCButtonBox .buttonText").eq(2).addClass("textNoEdit");             //待保存删除按钮

            fyText = 0;  //当前页

            // 默认打开长期
            $("#yzxdCL > li").removeClass("active");
            $("#yzxdCL > li:first").addClass("active");
            $("#yzxdButton li").removeClass("item JY");
            $("#yzOptionJC").addClass("JY");
            $("#yzOptionJY").addClass("JY");

            // 默认选择所有
            $("#yzOptionAll").addClass("item");
            dataLoad.loadXiangMuList().then(function (res) {
                fyCount = res.count;
                yiZhuList.push(res);
            });


            // 清空待保存数据 和所有li的数据
            $("#yzDaiBaoCun-Lin").empty("li");
            $("#yzDaiBaoCun-Chang").empty("li");
            ybzjYaoPin = {
                sfjj: "",
                kssj: "",
                gytj: "",
                gytjID: "",
                zxpl: "",
                sjfa: "",
                gyzx: "",
                gyzxID: "",
                zxxz: "",
                ID: "",
                ts: "",
                ds: "",
                ybID: ""
            };
            doctorActiveMX = [];

            $("#yzxdYaoNR li").addClass("eventQY");


        }//if
    });

    // 选择长期或者临时医嘱
    hammeryzxdCL = $("#yzxdCL > li").hammer();
    hammeryzxdCL.on('tap', function (ev) {
        if (!$(this).hasClass('active')) {
            var searchText = $("#searchText").val();
            if ($(this).hasClass("QY")) {
                $("#yzxdCL > li").removeClass("active");
                $(this).addClass("active");
                var textPD = $(this).text();
                $("#yzxdButton li").removeClass("JY");
                if (textPD == "长期医嘱") {
                    if ($("#yzOptionJC").hasClass("item") || $("#yzOptionJY").hasClass("item")) {
                        $("#yzOptionJC").addClass("JY").removeClass("item");
                        $("#yzOptionJY").addClass("JY").removeClass("item");
                        $("#yzOptionAll").addClass("item");
                    } else {
                        $("#yzOptionJC").addClass("JY").removeClass("item");
                        $("#yzOptionJY").addClass("JY").removeClass("item");
                    }
                } else {
                    if ($("#yzOptionSS").hasClass("item")) {
                        $("#yzOptionSS").addClass("JY").removeClass("item");
                        $("#yzOptionAll").addClass("item");
                    } else {
                        $("#yzOptionSS").addClass("JY").removeClass("item");
                    }
                }
                fyText = 0;  //当前页
                //dataLoad.loadXiangMuList();
                if ($("#yzxdButton").find(".item").text() !== "成套") {
                    if (searchText !== "按拼音简码检索" && searchText !== "") {
                        // 刷新非成套 从第一页开始
                        dataLoad.loadXiangMuList(0, searchText).then(function (res) {
                            fyCount = res.count;
                            yiZhuList.push(res);
                        });
                    } else {
                        dataLoad.loadXiangMuList().then(function (res) {
                            fyCount = res.count;
                            yiZhuList.push(res);
                        });
                    }
                } else {
                    if (searchText !== "按拼音简码检索" && searchText !== "") {
                        // 刷新成套 从第一页开始
                        loadChengTaoList(0, searchText);
                    } else {
                        loadChengTaoList(fyText);
                    }
                }
            }
        }

    });

    // 选择医嘱分类
    hammeryzxdButton = $("#yzxdButton > li").hammer();
    hammeryzxdButton.on('tap', function (ev) {
        if (!$(this).hasClass('item')) {
            var searchText = $("#searchText").val();
            if (!$(this).hasClass("JY")) {
                $("#yzxdButton > li").removeClass("item");
                $(this).addClass("item");
                fyText = 0;  //当前页
                // 如果是成套
                if ($(this).text() == "成套") {
                    if (searchText !== "按拼音简码检索" && searchText !== "") {
                        loadChengTaoList(0, searchText);
                    } else {
                        loadChengTaoList(fyText);
                    }
                } else {
                    if (searchText !== "按拼音简码检索" && searchText !== "") {
                        dataLoad.loadXiangMuList(0, searchText).then(function (res) {
                            fyCount = res.count;
                            yiZhuList.push(res);
                        });
                    } else {
                        dataLoad.loadXiangMuList().then(function (res) {
                            fyCount = res.count;
                            yiZhuList.push(res);
                        });
                    }
                }
            }
        }
    });


    // 翻页控件------------------------------------

    // 翻页
    var fyText = 0;  //当前页
    var fyCount = 0;   // 本页总条数

    var hammerfanYePev = $("#fanYePev").hammer();
    hammerfanYePev.on("tap", function () {
        if (fyText > 0) {
            if ($("#yzxdButton").find(".item").text() == "成套") {
                loadChengTaoList(fyText - 1);
            } else {
                dataLoad.loadXiangMuList(fyText - 1).then(function (res) {   //传入开始页
                    fyCount = res.count;
                    yiZhuList.push(res);
                });
            }
            fyText = fyText - 1;
        } else {
            utils.showHide("当前是第一页");
        }
    });
    var hammerfanYeNext = $("#fanYeNext").hammer();
    hammerfanYeNext.on("tap", function () {
        if (fyCount == 50) {
            if ($("#yzxdButton").find(".item").text() == "成套") {
                loadChengTaoList(fyText + 1);
            } else {
                dataLoad.loadXiangMuList(fyText + 1).then(function (res) {   //传入开始页
                    fyCount = res.count;
                    yiZhuList.push(res);
                });
            }
            fyText = fyText + 1;
        } else {
            utils.showHide("已是最后一页");
        }
    });
    var hammerfanYeF5 = $("#fanYeF5").hammer();
    hammerfanYeF5.on("tap", function () {
        var searchText = $("#searchText").val();
        if ($("#yzxdButton").find(".item").text() == "成套") {
            if (searchText !== "按拼音简码检索" && searchText !== "") {
                loadChengTaoList(0, searchText);
            } else {
                loadChengTaoList(fyText);
            }
        } else {
            if (searchText !== "按拼音简码检索" && searchText !== "") {
                dataLoad.loadXiangMuList(0, searchText).then(function (res) {
                    fyCount = res.count;
                    yiZhuList.push(res);
                });
            } else {
                dataLoad.loadXiangMuList(fyText).then(function (res) {
                    fyCount = res.count;
                    yiZhuList.push(res);
                });
            }
        }
    });

    // ----------------------------------------------

    // 医嘱新开 按取消按钮 关闭
    hammerbuttonCancel = $("#buttonCancel").hammer();
    hammerbuttonCancel.on('tap', function (ev) {
        $("#yzxdBox").removeClass('animated').removeClass('bounceInRight').hide();
        //新加
        $("#yzxdFather").hide();
        $(".yzxdKongJian").hide();
        $(".tmc").hide();
        doctorActiveMX = [];
        $("#yzDaiBaoCun-Chang").empty("li");
        $("#yzDaiBaoCun-Lin").empty("li");
        $("#yzxd-name").removeClass("editState");  // 清空编辑状态
        yiZhuList = [];   // 医嘱列表缓存数据清空
        ctObjectData = [];  // 医嘱成套列表缓存数据清空
        fyText = 0;  //当前页
        $("#sskeyboardbox").hide();
        $("#searchText").val("");
        $("#yzxdFather .medicareBox").remove();
    });
    // 医嘱新开 医嘱待保存 取消按钮 关闭
    hammerdbcButtonQX = $("#dbcButtonQX").hammer();
    hammerdbcButtonQX.on('tap', function (event) {
        if (doctorActiveMX.length > 0) {
            utils.alertPrompt("所有待保存医嘱将清除，是否确定？", "gantan", "qdqx");
            utils.myconfirm(okClearText, cancelClearText);
        } else {
            okClearText();
        }
    });
    //确定清除待保存
    function okClearText() {
        saveNum = 1;
        $('#dbcButtonBC').text('保存');
        if ($('#stopBox').length > 0) {
            $('#stopBox').remove();
        }

        $("#yzxdBox").removeClass('animated').removeClass('bounceInRight').hide();
        $(".yzxdKongJian").hide();
        $(".tmc").hide();
        doctorActiveMX = [];
        $("#yzDaiBaoCun-Chang").empty("li");
        $("#yzDaiBaoCun-Lin").empty("li");
        $("#yzxd-name").removeClass("editState");  // 清空编辑状态
        yiZhuList = [];   // 医嘱列表缓存数据清空
        ctObjectData = [];  // 医嘱成套列表缓存数据清空
        fyText = 0;  //当前页
        $("#yzxdFather .medicareBox").remove();
        $("#promptQDQX").hide();
        $("#yzxdFather").hide();//医嘱下达界面
    }
    //取消清除待保存医嘱
    function cancelClearText() {
        $("#promptQDQX").hide();
    }



    // 医嘱新开 医嘱待保存 保存按钮 关闭
    hammerdbcButtonBC = $("#dbcButtonBC").hammer();
    hammerdbcButtonBC.on('tap', function (event) {
        if ($(this).hasClass("noEdit"))
            return false;
        if (doctorActiveMX.length > 0) {
            $(".yzxdKongJian").hide();
            $(".tmc").hide();
            //console.log(doctorActiveMX);		
            // 提取上传格式的数据
            var ROW = [];
            // 标准传入值
            var patiID = $("#slzyID").attr("data-patiid");                          //病人ID
            var pageID = $("#slzyID").attr("data-pageid");                          //主页ID
            var baby = $("#slzyID").attr("data-baby") == "yes" ? 1 : 0;                   //婴儿标识
            var brksID = $("#slzyID").attr("data-ksid");                            //病人科室ID
            var kzksID = $("#userInfobox font").attr("data-ksid");                  //开嘱科室ID
            var kzYS = $("#userInfobox font").text().split("（")[0];                //开嘱医生
            //var jsdw = $("#yzxdYaoPin").attr("data-jsdw"); //计量单位
            var jsdw = $("#Milligram small").text();//计量单位
            $.each(doctorActiveMX, function (i, yzValue) {
                // 判断一并追加，组号等于：1000+xh
                var zh = "";
                if ((yzValue.yzlb == "C" || yzValue.yzlb == "D" || yzValue.yzlb == "5" || yzValue.yzlb == "6") && yzValue.editID !== "" && yzValue.editID !== undefined && yzValue.editID !== "undefined") {
                    zh = yzValue.editID;
                } else if (yzValue.ybID !== "" && yzValue.ybID !== undefined && yzValue.ybID !== "undefined") {
                    if (i == 0) {
                        zh = 1000;
                    } else if (i > 0) {
                        for (var zhI in doctorActiveMX) {
                            if (doctorActiveMX[zhI].ybID == doctorActiveMX[i].ybID && zhI == 0) {
                                zh = 1000;
                                break;
                            } else if (doctorActiveMX[zhI].ybID == doctorActiveMX[i].ybID && zhI !== 0) {
                                zh = 1000 + parseInt(zhI) - 1;
                                break;
                            }
                        }
                        if (zh == "") {
                            zh = 1000 + i;
                        }
                    }
                } else {
                    zh = null;
                }

                // 审核标记	
                var shbj = '0';
                if (yzValue.yzlb == "5" || yzValue.yzlb == "6") {
                    shbj = yzValue.shbj;
                    if (shbj == '0' && yzValue.ybID !== '') {
                        for (var shi in doctorActiveMX) {
                            if (doctorActiveMX[shi].shbj == '1' && doctorActiveMX[shi].ybID == yzValue.ybID) {
                                shbj = '1';
                                break;
                            }
                        }
                    }
                }

                // 医保比例 检验要按项目来给医保比例
                var ybbl = '', ybmc = '';
                if (yzValue.yzlb == "C") {
                    for (var jyx in yzValue.jyxm) {
                        var yiBao = yzValue.jyxm[jyx].ybbl == undefined || yzValue.jyxm[jyx].ybbl == 'undefined' || yzValue.jyxm[jyx].ybbl == 'null' ? null : yzValue.jyxm[jyx].ybbl;
                        var ybName = yzValue.jyxm[jyx].ybmc == undefined || yzValue.jyxm[jyx].ybmc == 'undefined' || yzValue.jyxm[jyx].ybmc == 'null' ? null : yzValue.jyxm[jyx].ybmc;
                        ybbl = ybbl + yiBao + ',';
                        ybmc = ybmc + ybName + ',';
                    }
                    ybbl = ybbl.substring(0, ybbl.length - 1);
                    ybmc = ybmc.substring(0, ybmc.length - 1);
                } else {
                    ybbl = yzValue.ybbl == undefined || yzValue.ybbl == "null" ? null : yzValue.ybbl;
                    ybmc = yzValue.ybmc == undefined || yzValue.ybmc == "null" ? null : yzValue.ybmc;
                }

                // 检查部位和检验项目
                var bw = "";
                var jyxmID = "";
                if (yzValue.jcxm.length > 0) {
                    $.each(yzValue.jcxm, function (n, value) {
                        bw = bw + value.jcxmmc + '(' + value.jcxmff + ')' + ',';
                    });
                } else if (yzValue.jyxm.length > 0) {
                    bw = yzValue.jyxm[0].bbbw + ",";
                    $.each(yzValue.jyxm, function (n, value) {
                        jyxmID = jyxmID + value.jyxmID + ",";
                    });
                } else {
                    bw = null;
                }
                // 清除最后一个分号
                if (bw !== null && bw != "") {
                    bw = bw.substring(0, bw.length - 1);
                }
                if (jyxmID !== null && jyxmID != "") {
                    jyxmID = jyxmID.substring(0, jyxmID.length - 1);
                }

                // 发药药房ID和执行科室ID
                var yfksID = "";
                if (yzValue.yfID == "" && yzValue.zxksID !== "") {
                    yfksID = yzValue.zxksID;
                } else if (yzValue.yfID !== "" && yzValue.zxksID == "") {
                    yfksID = yzValue.yfID;
                } else {
                    yfksID = "";
                }

                // 给药执行ID和采集科室ID
                var cjzxID = "";
                if (yzValue.gyzxID == "" && yzValue.cjksID !== "") {
                    cjzxID = yzValue.cjksID;
                } else if (yzValue.gyzxID !== "" && yzValue.cjksID == "") {
                    cjzxID = yzValue.gyzxID;
                } else {
                    cjzxID = "";
                }

                // 申请副项
                var sqfxItem = [];
                $.each(yzValue.sqfx, function (n, value) {
                    sqfxItem.push({
                        "XH": value.xh,
                        "XM": value.xm,
                        "BT": value.bt,
                        "YXID": value.yxID == "undefined" || value.yxID == undefined || value.yxID == "null" || value.yxID == null ? "" : value.yxID,
                        "NR": value.nr
                    });
                });


                // 给药途径，采集方法
                var gytjCjff = "";
                if (yzValue.yzlb == 5 || yzValue.yzlb == 6) {
                    gytjCjff = yzValue.gytjID;
                } else if (yzValue.yzlb == "C") {
                    gytjCjff = yzValue.cjffID;
                } else {
                    gytjCjff = null;
                }

                //只有药品才有自定义序列号
                var YZ = '';
                if (yzValue.yzlb == 5 || yzValue.yzlb == 6) {
                    YZ = 'a' + parseInt(i + 1);
                }
                if(!yzValue.bwm){
                    yzValue.bwm=$("#executeHz span").attr("data-bwm");
                }
                if(!yzValue.syfw){
                    yzValue.syfw=$("#executeHz span").attr("data-syfw")
                }
                if(!yzValue.pljg){
                    yzValue.pljg=$("#executeHz span").attr("data-pljg")
                }
                if(!yzValue.plcs){
                    yzValue.plcs=$("#executeHz span").attr("data-plcs")
                }
                if(!yzValue.jgdw){
                    yzValue.jgdw=$("#executeHz span").attr("data-jgdw")
                }
                // 用药目的
                var yymd = null;
                if (yzValue.yymd == "治疗" || yzValue.yymd == "2") yymd = "2";
                else if (yzValue.yymd == "预防" || yzValue.yymd == "1") yymd = "1";
                // 将调整好的格式数据追加到变量里
                ROW.push({
                    "yzlb": yzValue.yzlb,
                    "YZ": YZ,
                    "sfly": 1,//用于标识三方的来源 1-中联
                    "YZID": yzValue.MS == 0 ? yzValue.editID : null,  // 如果是修改则上传 项目ID
                    "DATAID": yzValue.ID,  //页面使用的唯一ID
                    "ZH": zh,
                    "MS": yzValue.MS == 0 ? 0 : null,
                    "XH": i,
                    "YZZT": yzValue.MS == 0 ? yzValue.YZZT : null,  // 如果是修改则上传 医嘱状态
                    "YZNR": yzValue.MS == 0 ? yzValue.YZNR : null,  // 如果是修改则上传 医嘱内容
                    "PATIID": patiID,
                    "PAGEID": pageID,
                    "BABY": baby,
                    "QX": yzValue.yzfl == "长期医嘱" ? 0 : 1,
                    "ZLLB": yzValue.yzlb,
                    "ZLXMID": yzValue.yzlb == "C" ? jyxmID : yzValue.xmID,
                    "SFXMID": yzValue.sfxmID,   // 差收费细目ID
                    "BW": bw,
                    "TS": yzValue.ts == "" || yzValue.ts == "undefined" || yzValue.ts == undefined || yzValue.ts == "null" || yzValue.ts == null ? 0 : yzValue.ts,
                    "DL": yzValue.dl == "" || yzValue.dl == "undefined" || yzValue.dl == undefined || yzValue.dl == "null" || yzValue.dl == null ? 0 : yzValue.dl,
                    "ZXXZ": yzValue.zxxz,
                    "ZL": yzValue.zl,
                    "YSZT": yzValue.yszt,
                    "GYTJ": gytjCjff,
                    "ZXPC": yzValue.zxpl,
                    //"DS": yzValue.ds == "" || yzValue.ds == 0 || yzValue.ds == "0" || yzValue.ds == undefined ? "" : yzValue.ds + "滴/分钟",
                    "DS": yzValue.ds==""||yzValue.ds==0||yzValue.ds=="0"||yzValue.ds==undefined?"":yzValue.ds+$('#diSu option:selected').text(),
                    "ZXSJFA": yzValue.sjfa,
                    "FYYF": yfksID,
                    "GYZX": cjzxID,
                    "JJBZ": yzValue.sfjj == "yes" ? 1 : 0,
                    "KSSJ": yzValue.kssj,
                    "BRKSID": brksID,
                    "KZKSID": kzksID,
                    "KZYS": kzYS,
                    "LJBR": "0",
                    "LXSR": "0",
                    "BYYY": null,
                    "BYSM": null,
                    "ZXR": "0",
                    "ZXJG": null,
                    "SCJG": null,
                    "SHBJ": shbj,
                    "YYMD": yymd,
                    "YYLY": yzValue.yyly == undefined ? null : yzValue.yyly,
                    "YBBL": ybbl,
                    "YBMC": ybmc,
                    "SQFX": {
                        "ITEMLIST": {
                            "ITEM": sqfxItem
                        }
                    },
                    gytjID: yzValue.gytjID,
                    bm: yzValue.bm,
                    bwm: yzValue.bwm,
                    "syfw": yzValue.syfw,//适用范围
                    "pljg": yzValue.pljg,//频率间隔
                    "plcs": yzValue.plcs,//频率次数
                    "jgdw": yzValue.jgdw,//间隔单位
                    "ybID": yzValue.ybID//一并追加ID，区别分组
                });

            });
            //检查传入备注
            function checkComon() {
                var tempArry = [];
                for (var i = 0; i < descArry.length; i++) {
                    if (descArry[i].level == '禁用') {
                        tempArry.push(descArry[i]);
                    }
                }

                //遍历循环取返回等级里面的最高级
                ROW.forEach(function (item) {
                    for (var i = 0; i < descArry.length; i++) {
                        if (item.YZ == descArry[i].order_id) {
                            if (item.level) {
                                if (descArry[i].t_level > item.t_level) {
                                    item.level = descArry[i];
                                    item.t_level = descArry[i].t_level;
                                }
                            } else {
                                item.level = descArry[i];
                                item.t_level = descArry[i].t_level;
                            }
                        }
                    }
                })

                return tempArry;
            }
            //是否检查合理用药，配置参数
            if (localStorage.checkDrug && localStorage.checkDrug != '') {
                //if (JSON.parse(localStorage.checkDrug) != '') {
                    //检验是否合理用药
                    $("#dbcButtonBC").addClass("noEdit");
                    checkDrug();
                //}
            }
            else {
                if ($("#yzDBCButtonNR li").length == $("#yzDBCButtonNR li").find('label').length && $("#yzDBCButtonNR").find(".check-yellowS").length == 0) {  // 全部数据已经校验过
                    updateYz();
                } else {                                                                                                                                    // 部分或者全部都需要验证
                    checkYz();
                }
            }
            function checkDrug() {
                var drugData = [], temLocal = null;
                temLocal = JSON.parse(localStorage.currentPatient);
                var flag = 0;//用于判断是否存在药品类型医嘱，控制是否判断身高体重
                //var checkName = JSON.parse(localStorage.userInfo).Result.UNIT;//医院名称
                //二次验证
                if (saveNum > 1 && yzstatus == false) {
                    $("#dbcButtonBC").removeClass("noEdit");
                    if (stopFlag == true) {
                        if (orderXML != null) {
                            if (orderXML.order.length > 0) {
                                for (var dex in orderXML.order) {
                                    if (orderXML.order[dex].level == '禁用') {
                                        stopFlag = true;
                                    }
                                }
                            }
                        }
                        if (jjyz == 0 && ywjj == 0) {
                            saveFlag = true;
                        }
                        if (jjyz == 1 && jjyy == 1) {
                            var liList = document.getElementById("stopBox").getElementsByTagName("li");
                            for (var i = 0; i < liList.length; i++) {
                                if (liList[i].getAttribute('data-liTag') == '禁用') {
                                    if ($(liList[i]).find('input')[0].value == '') {
                                        saveFlag = true;
                                    } else {
                                        saveFlag = false;
                                    }
                                    break;
                                }
                            }
                        }
                        //如果有禁用药，且备注没填不允许保存
                        if (stopFlag == true && saveFlag == true) {
                            // $("#dbcButtonBC").addClass("noEdit");
                            utils.showHide('不允许下达禁用药或者禁用药备注未填写！');
                            return false;
                        }
                        else {
                            var putList = $('#stopBox input');
                            for (var i = 0; i < putList.length; i++) {
                                if (typeof orderXML.order == 'object') {
                                    if ($(putList[i]).attr('data-orderid') == orderXML.order.order_id) {
                                        orderXML.order.desc = $(putList[i]).val();
                                    }
                                } else {
                                    for (var dex in orderXML.order) {
                                        if ($(putList[i]).attr('data-orderid') == orderXML.order[dex].order_id) {
                                            orderXML.order[dex].desc = $(putList[i]).val();
                                        }
                                    }
                                }

                            }
                            descArry = orderXML.order;
                            // 判断是否校验医嘱
                            if ($("#yzDBCButtonNR li").length == $("#yzDBCButtonNR li").find('label').length && $("#yzDBCButtonNR").find(".check-yellowS").length == 0) {  // 全部数据已经校验过
                                updateYz();
                            } else {                                                                                                                                    // 部分或者全部都需要验证
                                checkYz();
                            }
                            if ($('#stopBox').length > 0) {
                                $('#stopBox').remove();
                            }
                        }
                    } else {
                        $('#dbcButtonBC').text('保存');
                        // 判断是否校验医嘱
                        if ($("#yzDBCButtonNR li").length == $("#yzDBCButtonNR li").find('label').length && $("#yzDBCButtonNR").find(".check-yellowS").length == 0) {  // 全部数据已经校验过
                            updateYz();
                        } else {                                                                                                                                    // 部分或者全部都需要验证
                            checkYz();
                        }
                    }
                    return;
                }
                $.each(ROW, function (n, item) {
                    var syzh = '';
                    if (item.ybID && item.ybID != '') {
                        syzh = '0' + item.ybID.substring(6, item.ybID.length);
                    } else {
                        syzh = n;
                    }
                    if (item.yzlb == '5' || item.yzlb == '6') {
                        flag = 1;
                    }
                    drugData.push(
                        {
                            "Type": item.yzlb, //医嘱类别
                            "YZ": item.YZ,
                            "YZID": item.YZID,  // 如果是修改则上传 项目ID
                            "DL": item.DL,
                            "ZLXMID": item.ZLXMID,
                            "PATIID": patiID,
                            "PAGEID": pageID,
                            "BWM": item.bwm,//本位码
                            "SYZH": syzh,//输液组号
                            "JSDW": jsdw,//计量单位
                            "SG": temLocal.SG,
                            "TZ": temLocal.TZ,
                            "GYTJID": item.gytjID,//给药途径
                            "GYPCID": item.bm,//给药频次
                            "SYFW": item.syfw || '',//适用范围
                            "PLJG": item.pljg || '',//频率间隔
                            "PLCS": item.plcs || '',//频率次数
                            "JGDW": item.jgdw || ''//间隔单位
                        }
                    );
                });
                //判断身高体重是否为空
                // if (flag == 1) {
                //     if (temLocal.SG == 'null' || temLocal.TZ == 'null') {
                //         utils.showHide('身高或体重不能为空！');
                //         return false;
                //     }
                // }
                $.ajax({
                    url: serviceChoose + "/DrugCorrect",
                    type: "post",
                    timeout: utils.timeoutSec(),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({ "ROW": drugData, "HospitalName": localStorage.DrugHospitalName, "SceneID": "" }),
                    success: function (responseTxt) {
                        if (responseTxt.Result.Output) {
                            if (responseTxt.Result.Output.errormsg) {
                                utils.showHide(responseTxt.Result.Output.errormsg);
                            } else {
                                //合理用药返回空节点继续修改或者保存
                                orderXML = responseTxt.Result.Output.details_xml;
                                if (orderXML == null) {
                                    // 判断是否校验医嘱
                                    if ($("#yzDBCButtonNR li").length == $("#yzDBCButtonNR li").find('label').length && $("#yzDBCButtonNR").find(".check-yellowS").length == 0) {  // 全部数据已经校验过
                                        updateYz();
                                    } else {                                                                                                                                    // 部分或者全部都需要验证
                                        checkYz();
                                    }
                                }
                                else {
                                    if (responseTxt.Result.Output.details_xml) {
                                        saveNum++;
                                        $("#dbcButtonBC").removeClass("noEdit");
                                        //看有无禁用药，有，判断条件，没有，继续保存
                                        $('#dbcButtonBC').text('继续');
                                        if ($('#stopBox').length > 0) {
                                            $('#stopBox').remove();
                                        }
                                        if (saveNum > 2) {
                                            yzstatus = false;
                                        }
                                        $("#yzDBCButtonNR").append('<ul id="stopBox" style="width:100%;float: left;margin-top:2em;"></ul>');
                                        var tempData = responseTxt.Result.Output.details_xml.order;
                                        if (responseTxt.Result.Output.reasons && responseTxt.Result.Output.reasons != null) {
                                            for (var i = 0; i < tempData.length; i++) {
                                                for (var dex in responseTxt.Result.Output.reasons.reason) {
                                                    responseTxt.Result.Output.reasons.reason[dex].level = '禁用';
                                                    if (responseTxt.Result.Output.reasons.reason[dex].order_id.indexOf(',') != -1) {
                                                        var temp_order = responseTxt.Result.Output.reasons.reason[dex].order_id.split(',');
                                                        for (var der in temp_order) {
                                                            if (tempData[i].order_id == temp_order[der].order_id && tempData[i].type == temp_order[der].type) {
                                                                reasonFlag = true;
                                                                tempData[i].desc = temp_order[der].describ;
                                                            }
                                                        }
                                                    } else {
                                                        if (tempData[i].order_id == responseTxt.Result.Output.reasons.reason[dex].order_id && tempData[i].type == responseTxt.Result.Output.reasons.reason[dex].type) {
                                                            reasonFlag = true;
                                                            tempData[i].desc = responseTxt.Result.Output.reasons.reason[dex].describ;
                                                        }
                                                    }

                                                }
                                            }
                                            orderXML = tempData;
                                        }
                                        if (typeof tempData == 'object' && !tempData.length) {
                                            tempData.describ = tempData.describ.replace(/\\r\\n/g, "");
                                            tempData.describ = tempData.describ.replace("\\n","");
                                            if (!tempData.desc) {
                                                tempData.desc = '';
                                            }
                                            if (tempData.level == '禁用') {
                                                tempData.t_level = 2;//等级重要性比较
                                                stopFlag = true;
                                                $("#stopBox").prepend('<li style="width:100%;float:left;margin-bottom:1em;" data-liTag="' + tempData.level + '"    data-code="' + tempData.drugcode + '"><p style="color:red;font-weight: bold">' + tempData.level + '</p><div><p>' + tempData.type + '</p><p>' + tempData.describ + '<span style="font-size:10px;color: #52BBC6">【查看说明书】</span></p></div><div><input type="text" value="' + tempData.desc + '" data-orderid ="' + tempData.order_id + '"></div></li>');
                                            } else {
                                                yzstatus = false;//无禁用药
                                                if (tempData.level == null) {
                                                    tempData.level = '慎用';
                                                    tempData.t_level = 1;
                                                } else {
                                                    tempData.t_level = 0;
                                                }
                                                $("#stopBox").append('<li style="width:100%;float:left;margin-bottom:1em;" data-liTag="' + tempData.level + '" data-code="' + tempData.drugcode + '"><p>' + tempData.level + '</p><div><p>' + tempData.type + '</p><p>' + tempData.describ + '<span style="font-size:10px;color: #52BBC6">【查看说明书】</span></p></div></li>');
                                            }
                                        } else {
                                            for (var i = 0; i < tempData.length; i++) {
                                                if (!tempData[i].desc) {
                                                    tempData[i].desc = '';
                                                }
                                                //去掉特殊字符
                                                tempData[i].describ = tempData[i].describ.replace(/\\r\\n/g, "");
                                                tempData[i].describ = tempData[i].describ.replace("\\n","");
                                                //tempData[i].order_id = 'a'+parseInt(i+1);
                                                if (tempData[i].level == '禁用') {
                                                    tempData[i].t_level = 2;//等级重要性比较
                                                    stopFlag = true;
                                                    $("#stopBox").prepend('<li style="width:100%;float:left;margin-bottom:1em;" data-liTag="' + tempData[i].level + '"    data-code="' + tempData[i].drugcode + '"><p style="color:red;font-weight: bold">' + tempData[i].level + '</p><div><p>' + tempData[i].type + '</p><p>' + tempData[i].describ + '<span style="font-size:10px;color: #52BBC6">【查看说明书】</span></p></div><div><input type="text" value="' + tempData[i].desc + '" data-orderid ="' + tempData[i].order_id + '"></div></li>');
                                                } else {
                                                    yzstatus = false;//无禁用药
                                                    if (tempData[i].level == null) {
                                                        tempData[i].level = '慎用';
                                                        tempData[i].t_level = 1;
                                                    } else {
                                                        tempData[i].t_level = 0;
                                                    }
                                                    $("#stopBox").append('<li style="width:100%;float:left;margin-bottom:1em;" data-liTag="' + tempData[i].level + '" data-code="' + tempData[i].drugcode + '"><p>' + tempData[i].level + '</p><div><p>' + tempData[i].type + '</p><p>' + tempData[i].describ + '<span style="font-size:10px;color: #52BBC6">【查看说明书】</span></p></div></li>');
                                                }
                                            }
                                        }
                                        descList();
                                        //有禁用药
                                        if (stopFlag == true) {
                                            //$("#dbcButtonBC").addClass("noEdit");
                                            //ZLHIS参数读取
                                            $.ajax({
                                                url: serviceChoose + "/GetDrugCorrectConfig",
                                                type: "get",
                                                timeout: utils.timeoutSec(),
                                                dataType: "json",
                                                headers: {
                                                    'Content-Type': 'application/json'
                                                },
                                                success: function (responseTxt) {
                                                    if (responseTxt.Result.Output.ERROR) {
                                                        utils.showHide(responseTxt.Result.Output.ERROR.MSG);
                                                    } else {
                                                        if (responseTxt.Result.Output.length > 0) {
                                                            jjyy = responseTxt.Result.Output[0].P_Value; //禁忌药品要求填写原因,1必填，0不填继续
                                                            jjyz = responseTxt.Result.Output[1].P_Value; //允许下达禁忌药嘱,1允许,0不允许
                                                            ywjj = responseTxt.Result.Output[2].P_Value;  //允许下达院外执行的禁忌药品医嘱,1继续,0不允许
                                                            if (jjyz == 0 && ywjj == 0) {
                                                                saveFlag = true;
                                                            }
                                                            if (jjyz == 1 && jjyy == 1) {
                                                                var liList = document.getElementById("stopBox").getElementsByTagName("li");
                                                                for (var i = 0; i < liList.length; i++) {
                                                                    if (liList[i].getAttribute('data-liTag') == '禁用') {
                                                                        if ($(liList[i]).find('input')[0].value == '' || !$(liList[i]).find('input')[0].value) {
                                                                            saveFlag = true;
                                                                        }
                                                                        break;
                                                                    }
                                                                }
                                                            }

                                                        }
                                                    }
                                                    //如果有禁用药，且备注没填不允许保存
                                                    if ((stopFlag == true && saveFlag == true) || reasonFlag == true) {
                                                        // $("#dbcButtonBC").addClass("noEdit");
                                                        utils.showHide('不允许下达禁用药或者禁用药备注未填写！');
                                                        return false;
                                                    }
                                                    else {
                                                        //存在禁用药备注
                                                        var putList = $('#stopBox input');
                                                        for (var i = 0; i < putList.length; i++) {
                                                            for (var dex in tempData) {
                                                                if ($(putList[i]).attr('data-orderid') == tempData[dex].order_id) {
                                                                    tempData[dex].desc = $(putList[i]).val();
                                                                }
                                                            }
                                                        }
                                                        descArry = tempData;
                                                        // 判断是否校验医嘱
                                                        if ($("#yzDBCButtonNR li").length == $("#yzDBCButtonNR li").find('label').length && $("#yzDBCButtonNR").find(".check-yellowS").length == 0) {  // 全部数据已经校验过
                                                            updateYz();
                                                        } else {                                                                                                                                    // 部分或者全部都需要验证
                                                            checkYz();
                                                        }
                                                        if ($('#stopBox').length > 0) {
                                                            $('#stopBox').remove();
                                                        }
                                                    }
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                        } else {
                            if (responseTxt.Result.ERROR) {
                                $("#dbcButtonBC").removeClass("noEdit");
                                utils.showHide(responseTxt.Result.ERROR.MSG);
                            }
                        }
                    }
                })
            }
            //请求说明书
            function descList() {
                $('#stopBox span').bind('click', function () {
                    var _this = $(this);
                    //获取说明书
                    $.ajax({
                        url: serviceChoose + "/DrugInstructions",
                        type: "post",
                        timeout: utils.timeoutSec(),
                        dataType: "json",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        data: JSON.stringify({ "BWM": _this.parent().parent().parent().attr('data-code') }),
                        success: function (responseTxt) {
                            if (responseTxt.Result.ERROR) {
                                utils.showHide(responseTxt.Result.ERROR.MSG);
                            } else {
                                $("#yzxdBox").removeClass('animated').removeClass('bounceInRight').hide();
                                $('#descBox').show();
                                $('#desc_title ul').html('');
                                $('#desc_title ul').html('');
                                var descData = JSON.parse(responseTxt.Result.Output)[0];
                                if (localStorage.descList && localStorage.descList != '') {
                                    var temp_descarry = localStorage.descList.split(',');
                                    for (var i = 0; i < temp_descarry.length; i++) {
                                        for (var j in descData) {
                                            if (temp_descarry[i] == j) {
                                                //去空格
                                                $('#desc_title ul').append('<li><p  style="width:100%;text-decoration:none;font-weight:bold;font-size:15px;">' + j + '</p></li>');
                                                $('#desc_list ul').append('<li><p id="' + j + '"  style="width:100%;font-weight:bold;font-size:16px;color:#52BBC6">【' + j + '】</p><p style="text-indent: 30px;">' + descData[j] + '</p></li>');
                                            }
                                        }
                                    }
                                }

                                //说明书取消功能
                                $('#descTop').bind('click', function () {
                                    $('#descBox').hide();
                                    $("#yzxdBox").show();
                                })
                                //锚点事件
                                $('#desc_title ul li p').bind('click', function () {
                                    var _this = $(this);
                                    document.getElementById(_this.context.innerText).scrollIntoView();
                                    _this.css('color', 'red').parent().siblings().find('p').css('color', '#4d4d4d');
                                })
                            }
                        }
                    })
                })
            }
            // 校验医嘱
            function checkYz() {
                $("#LoadedTip").show();
                if (ROW.length > 0) {
                    for (var dex in ROW) {
                        if (ROW[dex].BW != null) {
                            ROW[dex].BW = ROW[dex].BW.replace(/[+]/g, '%2B');
                        }
                    }
                }

                $.ajax({
                    url: serviceChoose + "/DC_Advice_SaveCheck",
                    type: "post",
                    timeout: utils.timeoutSec(),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({ "ROW": ROW }),
                    success: function (responseTxt) {
                        if (responseTxt.Result.ERROR) {
                            $("#LoadedTip").hide();
                            utils.showHide(responseTxt.Result.ERROR.MSG);
                        } else {
                            if (responseTxt.Result.OUTPUT.LIST.ITEM) {
                                var resTXT = responseTxt.Result.OUTPUT.LIST.ITEM;
                                var allOK = 1; // 校验是否全通过 通过1 没通过0
                                var ybOK = 0;  // 是否有医保 有1 没有0
                                for (var i = 0; i < resTXT.length; i++) {
                                    if (resTXT[i].ZT == 1 || resTXT[i].ZT == 2) {
                                        allOK = 0;
                                    }
                                    if (resTXT[i].YBLIST !== null) {
                                        if (resTXT[i].YBLIST.ITEM !== null) {
                                            for (iti in resTXT[i].YBLIST.ITEM) {
                                                if (resTXT[i].YBLIST.ITEM[iti] !== null) {
                                                    ybOK = 1;
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                    if (allOK == 0 && ybOK == 1) break;
                                };
                                // 如果通过，没有医保
                                if (allOK == 1 && ybOK == 0) {
                                    updateYz();
                                    // 如果没通过，没有医保
                                } else if (allOK == 0 && ybOK == 0) {
                                    jiaoYan();
                                    // 如果通过，有医保
                                } else if (allOK == 1 && ybOK == 1) {
                                    jiaoYan();
                                    yiBao();
                                    // 如果没通过，有医保
                                } else if (allOK == 0 && ybOK == 1) {
                                    jiaoYan();
                                    yiBao();
                                }
                                dbcButEdit();
                            }
                        }
                        $("#LoadedTip").hide();
                        // 处理校验
                        function jiaoYan() {
                            // 存储校验结果
                            for (var d in resTXT) {
                                var re = resTXT[d];
                                for (var i in doctorActiveMX) {
                                    var mx = doctorActiveMX[i];
                                    if (re.XH == mx.ID) {
                                        mx.jyjg = re.ZT;
                                        mx.jyText = re.TEXT;
                                    }
                                }
                            }
                            //医嘱复制的时候 页面YZID0 与输出数组的顺序是倒的
                            $("#yzDBCButtonNR li label").remove();//移除上次检验的图标
                            //$("#dbcButtonBC").removeClass('noEdit');//移除上次的不可保存
                            for (var j = 0; j < resTXT.length; j++) { //循环所有校验 prepend append
                                if (resTXT[j].ZT == 0 || resTXT[j].ZT == null) {
                                    $("#yzDBCButtonNR").find('#' + resTXT[j].XH).prepend('<label class="check-green" aria-hidden="true" data-icon=""></label>');
                                } else if (resTXT[j].ZT == 1) {
                                    $("#yzDBCButtonNR").find('#' + resTXT[j].XH).prepend('<label class="check-yellow" aria-hidden="true" data-icon="" data-text="' + resTXT[j].TEXT + '"></label>');
                                } else if (resTXT[j].ZT == 2) {
                                    $("#yzDBCButtonNR").find('#' + resTXT[j].XH).prepend('<label class="check-red" aria-hidden="true" data-icon="" data-text="' + resTXT[j].TEXT + '"></label>');
                                }
                            }
                            //给需要提示的li注册事件
                            var linewPresshammer = $("#yzDBCButtonNR li").hammer();//给提示注册长按事件
                            linewPresshammer.on('press', function () {
                                if ($("#yzDBCButtonNR").find('.check-green').length > 0 || $(this).find("label").length == 0) return false;
                                mesPrompt($(this));
                            });
                            $("#yzDBCButtonNR li").on("touchend", function () {
                                $(this).find('.yizhuDIv').remove();
                            });
                        }
                        // 处理医保
                        function yiBao() {
                            var ddDom = '';
                            for (var a in resTXT) {
                                if (resTXT[a].YBLIST == null || resTXT[a].YBLIST.ITEM == null) continue;
                                // 如果是检验
                                var xhData = yiZhLb(resTXT[a].XH);
                                if (xhData.yzlb == "C") {
                                    // 医保选项DIV层
                                    var optionDiv = '';
                                    var activeLabel = '';
                                    var actCount = 0; // 用来判断鸡毛颜色的，比如：同时有三个检验项目，只有1个要医保，那么当医保为空的也要累计数量。
                                    var actCout = 0;  // 用来判断是否显示省略号的，需要医保的项目超过4个则显示省略号。
                                    for (var yb in xhData.jyxm) {
                                        if ((resTXT[a].YBLIST.ITEM[yb].WYB == null && resTXT[a].YBLIST.ITEM[yb].WYB !== undefined) || resTXT[a].YBLIST.ITEM[yb].YBBL) {
                                            // 更新ROW里面的ybbl，因为万恶的后台，删除A检验项目又新开A检验项目并未识别成新开
                                            if (resTXT[a].YBLIST.ITEM[yb].YBBL !== null && resTXT[a].YBLIST.ITEM[yb].YBBL !== undefined) {
                                                console.log(ROW[a].YBBL);
                                                var oldYbbl = ROW[a].YBBL.split(",");
                                                var nowYbbl = resTXT[a].YBLIST.ITEM[yb].YBBL;
                                                oldYbbl[yb] = nowYbbl;
                                                var newYbbl = '';
                                                for (var bl in oldYbbl) {
                                                    newYbbl = newYbbl + oldYbbl[bl] + ',';
                                                }
                                                newYbbl = newYbbl.substring(0, newYbbl.length - 1);
                                                ROW[a].YBBL = newYbbl;
                                            }
                                            actCount = actCount + 1;
                                            continue;
                                        }
                                        var jyxmName = '<p>' + xhData.jyxm[yb].jyxmmc + '</p>';
                                        var tsText = resTXT[a].YBLIST.ITEM[yb].TEXT;
                                        var butDom = '';
                                        var tsTbColor = '';
                                        for (var but in resTXT[a].YBLIST.ITEM[yb].BUTTON.ITEM) {
                                            // 判断颜色
                                            var butType = resTXT[a].YBLIST.ITEM[yb].BUTTON.ITEM[but].TYPE;
                                            var colorC = 'redLab';
                                            if (butType == "1") colorC = 'greenLab';
                                            // 判断是否选中,并计算选中的数量
                                            var actCla = '';
                                            if (resTXT[a].YBLIST.ITEM[yb].BUTTON.ITEM[but].RES == 1) {
                                                actCount = actCount + 1;
                                                actCout = actCout + 1;
                                                actCla = ' actGreen';
                                                tsTbColor = 'yes';
                                                // 向外层鸡毛图标前面也追加按钮
                                                if (actCout <= 4)
                                                    activeLabel = activeLabel + '<label class="' + actCla + '"><div class="jyxmName">' + xhData.jyxm[yb].jyxmmc + '</div>' + resTXT[a].YBLIST.ITEM[yb].BUTTON.ITEM[but].CONT + '</label>';
                                                if (actCout == 4)
                                                    activeLabel = activeLabel + '<div class="slh">…</div>';
                                            }
                                            var zhi = resTXT[a].YBLIST.ITEM[yb].BUTTON.ITEM[but].DATA;
                                            butDom = butDom + '<label class="' + colorC + actCla + '" data-yb="' + zhi + '">' + resTXT[a].YBLIST.ITEM[yb].BUTTON.ITEM[but].CONT + '</label>';
                                        }
                                        var tsDom = '<span class="fs1 pressIcon ' + tsTbColor + '" aria-hidden="true" data-icon="" data-ts="' + tsText + '"></span>';
                                        optionDiv = optionDiv + jyxmName + '<div data-eq="' + yb + '" class="nrDiv">' + butDom + tsDom + '</div>';
                                    }
                                    if (optionDiv !== '') {
                                        var selectDiv = '<div class="tsJyDiv">' + optionDiv + '<div class="qdBut">返回</div></div>';
                                        // 如果全部选中 鸡毛图标是绿色
                                        var actTbColor = '';
                                        if (actCount == resTXT[a].YBLIST.ITEM.length) {
                                            actTbColor = "yes";
                                        }
                                        var imgDom = '<span class="fs1 tapIcon ' + actTbColor + '" aria-hidden="true" data-icon=""></span>';
                                        // 存储的dt层
                                        ddDom = ddDom + '<dt id="dt' + resTXT[a].XH + '" data-xh="' + resTXT[a].XH + '">' + imgDom + selectDiv + activeLabel + '</dt>';
                                    }
                                } else {
                                    for (var b in resTXT[a].YBLIST.ITEM) {
                                        var butDom = '';
                                        var actTbColor = '';
                                        for (var c in resTXT[a].YBLIST.ITEM[b].BUTTON.ITEM) {
                                            // 判断颜色											
                                            var butType = resTXT[a].YBLIST.ITEM[b].BUTTON.ITEM[c].TYPE;
                                            var colorC = 'redLab';
                                            if (butType == "1") colorC = 'greenLab';
                                            var zhi = resTXT[a].YBLIST.ITEM[b].BUTTON.ITEM[c].DATA;
                                            // 判断是否选中
                                            var actCla = '';
                                            if (resTXT[a].YBLIST.ITEM[b].BUTTON.ITEM[c].RES == 1) {
                                                actCla = ' actGreen';
                                                actTbColor = 'yes';
                                            }
                                            butDom = butDom + '<label class="' + colorC + actCla + '" data-yb="' + zhi + '">' + resTXT[a].YBLIST.ITEM[b].BUTTON.ITEM[c].CONT + '</label>';
                                        }
                                        var imgDom = '<span class="fs1 pressIcon ' + actTbColor + '" aria-hidden="true" data-icon="" data-ts="' + resTXT[a].YBLIST.ITEM[b].TEXT + '"></span>';
                                        ddDom = ddDom + '<dt id="dt' + resTXT[a].XH + '" data-xh="' + resTXT[a].XH + '">' + butDom + imgDom + '</dt>';
                                    }
                                }
                            }
                            $(".medicareBox").remove();
                            if (ddDom == '') {
                                updateYz();
                            } else {
                                // 计算滚动高度
                                var medHeight = $("#yzDBCButtonNR").height() + 20;
                                $("#yzxdFather").append('<dl class="medicareBox" style="height:' + medHeight + 'px;">' + ddDom + '</dl>');
                                // 滚动同步
                                $("#yzDBCButtonNR").scroll(function () {
                                    var thisTop = $(this).scrollTop();
                                    $(".medicareBox").scrollTop(thisTop);
                                });
                                $(".medicareBox").scroll(function () {
                                    var thisTop = $(this).scrollTop();
                                    $("#yzDBCButtonNR").scrollTop(thisTop);
                                });
                                // 追加完之后调整顺序和位置 保持对齐
                                dtOfLiSort();
                                // 给问号注册事件
                                $("#yzxdFather .medicareBox .pressIcon").on("touchstart", function () {
                                    $("#yzxdFather").append('<div class="conLog">' + $(this).attr("data-ts") + '</div>');
                                });
                                $("#yzxdFather .medicareBox .pressIcon").on("touchend", function () {
                                    $("#yzxdFather .conLog").remove();
                                });
                                // 给鸡毛注册事件
                                var hammerJiMao = $("#yzxdFather .medicareBox .tapIcon").hammer();
                                hammerJiMao.on("tap", function () {
                                    var thisDiv = $(this).siblings(".tsJyDiv");
                                    thisDiv.show();
                                });
                                // 给返回注册事件
                                var hammerFH = $("#yzxdFather .medicareBox .qdBut").hammer();
                                hammerFH.on("tap", function () {
                                    var thisParent = $(this).parent();
                                    thisParent.parent().children("label").remove();
                                    thisParent.parent().children(".slh").remove();
                                    thisParent.children("p").each(function (pi, pv) {
                                        var xmmc = $(pv).text();
                                        var butAct = $(pv).next();
                                        if (pi > 3) {
                                            thisParent.parent().append('<div class="slh">…</div>');
                                            return false;
                                        }
                                        butAct.children("label").each(function (i, v) {
                                            if ($(this).hasClass("actGreen")) {
                                                var butTx = $(this).text();
                                                thisParent.parent().append('<label class="actGreen"><div class="jyxmName">' + xmmc + '</div>' + butTx + '</label>');
                                                return false;
                                            } else if (i == butAct.children("label").length - 1) {
                                                thisParent.parent().append('<label class="huiLab"><div class="jyxmName">' + xmmc + '</div>未选择</label>');
                                            }
                                        });
                                    });
                                    // 判断是否录入完毕
                                    if (thisParent.find(".yes").length == thisParent.find("p").length) {
                                        thisParent.siblings(".fs1").addClass("yes");
                                    } else {
                                        thisParent.siblings(".fs1").removeClass("yes");
                                    }
                                    dbcButEdit();
                                    $(this).parent().hide();
                                });
                                // 给所有button注册事件
                                var hammerbutyb = $("#yzxdFather .medicareBox label").hammer();
                                hammerbutyb.on("tap", function () {
                                    var thisLab = $(this);
                                    if (thisLab.hasClass("actRed") || thisLab.hasClass("actGreen")) return false;
                                    thisLab.siblings("label").removeClass("actRed actGreen");
                                    if (thisLab.hasClass("redLab")) {
                                        thisLab.addClass("actRed");
                                        // 准备数据
                                        if (thisLab.parent()[0].tagName == "DT") {
                                            var yzxh = thisLab.parent().attr("data-xh");
                                        } else {
                                            var yzxh = thisLab.parent().parent().parent().attr("data-xh");
                                        }
                                        var alertText = thisLab.parent().children(".fs1").attr("data-ts") + '，是否继续？';
                                        utils.alertPrompt(alertText, "gantan", "qdqx");
                                        utils.myconfirm(okExitOut, cancelExitOut);
                                        function okExitOut() {
                                            // 如果是临嘱最后一个 并且长嘱的数量大于0
                                            if (yzxh == $("#yzDaiBaoCun-Lin li:last").attr("id") && $("#yzDaiBaoCun-Lin li").length == 1 && $("#yzDaiBaoCun-Chang li").length > 0) {
                                                $(".medicareBox").prepend('<div style="height:39px; width:100%; float:left;"></div>');
                                                // 如果是长嘱最后一个 并且临嘱的数量大于0
                                            } else if (yzxh == $("#yzDaiBaoCun-Chang li:last").attr("id") && $("#yzDaiBaoCun-Chang li").length == 1 && $("#yzDaiBaoCun-Lin li").length > 0) {
                                                $(".medicareBox").append('<div style="height:39px; width:100%; float:left;"></div>');
                                            }
                                            $("#" + yzxh).remove();
                                            $("#dt" + yzxh).remove();
                                            $("#promptQDQX").hide();
                                            for (var i in doctorActiveMX) {
                                                if (doctorActiveMX[i].ID == yzxh) {
                                                    doctorActiveMX.splice(i, 1);
                                                    break;
                                                }
                                            }
                                            dbcButEdit();
                                            // 如果都删完了 则删除医保层
                                            if ($(".medicareBox dt").children().length == 0) {
                                                $(".medicareBox").remove();
                                            }
                                        }
                                        function cancelExitOut() {
                                            $("#promptQDQX").hide();
                                            thisLab.removeClass("actRed");
                                            thisLab.siblings(".fs1").removeClass("yes");
                                            dbcButEdit();
                                        }
                                    } else {
                                        thisLab.siblings(".fs1").addClass("yes");
                                        thisLab.addClass("actGreen");
                                        if (thisLab.parent()[0].tagName == "DT") {
                                            var xh = thisLab.parent().attr("data-xh");
                                            for (var i in doctorActiveMX) {
                                                if (xh == doctorActiveMX[i].ID) {
                                                    doctorActiveMX[i].ybbl = thisLab.attr("data-yb");
                                                    doctorActiveMX[i].ybmc = thisLab.text();
                                                    break;
                                                }
                                            }
                                        } else {
                                            var xh = thisLab.parent().parent().parent().attr("data-xh");
                                            var eq = thisLab.parent().attr("data-eq");
                                            for (var i in doctorActiveMX) {
                                                if (xh == doctorActiveMX[i].ID) {
                                                    doctorActiveMX[i].jyxm[eq].ybbl = thisLab.attr("data-yb");
                                                    doctorActiveMX[i].jyxm[eq].ybmc = thisLab.text();
                                                    break;
                                                }
                                            }
                                        }
                                        dbcButEdit();
                                    }
                                });
                            }
                        }
                        // 判断医嘱类别
                        function yiZhLb(id) {
                            var ruData;
                            for (var i in doctorActiveMX) {
                                if (doctorActiveMX[i].ID == id) {
                                    ruData = doctorActiveMX[i];
                                    break;
                                }
                            }
                            return ruData;
                        }
                        // 保存按钮 是否 可编辑
                        function dbcButEdit() {
                            if (doctorActiveMX.length > 0) {
                                if ($("#yzDBCButtonNR").find('.check-red').length == 0 && $(".medicareBox dt").children(".yes").length == $(".medicareBox dt").children(".fs1").length) {
                                    $("#dbcButtonBC").removeClass("noEdit");
                                } else {
                                    $("#dbcButtonBC").addClass("noEdit");
                                }
                            } else {
                                $("#dbcButtonBC").addClass("noEdit");
                            }
                        }
                    },
                    complete: function (XMLHttpRequest, status) {
                        utils.errorAjax(status, checkYz, []);
                    }
                });
            };
            // 提交数据
            function updateYz() {
                $("#yzxdBox").removeClass('animated').removeClass('bounceInRight').hide();
                $("#LoadedTip").show();
                $('#dbcButtonBC').text('保存');
                descArry = checkComon();
                saveNum = 1;//置为第一次操作
                if ($('#stopBox').length > 0) {
                    $('#stopBox').remove();
                }
                if(ROW.length > 0){
					for(var dex in ROW){
						if(ROW[dex].BW!=null){
							ROW[dex].BW = ROW[dex].BW.replace(/[+]/g, '%2B');
						}
					}
				}
                $.ajax({
                    url: serviceChoose + "/DC_Advice_BatchSave",
                    data: JSON.stringify({ "ROW": ROW, "ORDERS": descArry }),
                    type: "post",
                    timeout: utils.timeoutSec(),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + JSON.parse(localStorage.userInfo).access_token
                    },
                    success: function (responseTxt) {
                        $("#LoadedTip").hide();
                        //console.log(responseTxt);
                        if (responseTxt.Result.ERROR) {
                            utils.showHide(responseTxt.Result.ERROR.MSG);
                        } else {
                            utils.showHide("下达成功");
                        }
                        $("#yzxdFather").hide();
                        doctorActiveMX = [];
                        $("#yzDaiBaoCun-Chang").empty("li");
                        $("#yzDaiBaoCun-Lin").empty("li");
                        $("#yzxd-name").removeClass("editState");  // 清空编辑状态
                        yiZhuList = [];   // 医嘱列表缓存数据清空
                        ctObjectData = [];  // 医嘱成套列表缓存数据清空
                        fyText = 0;  //当前页
                        docActListLoad("yes", 0); // 刷新当前病人的医嘱列表
                        $("#yzxdFather .medicareBox").remove();
                    },
                    complete: function (XMLHttpRequest, status) {
                        utils.errorAjax(status, updateYz, []);
                    }
                });
            }
        } else {
            utils.showHide("没有可保存的医嘱");
        }
    });

    // 医保DT顺序按照待保存LI顺序排列
    function dtOfLiSort() {
        if ($("#yzxdFather .medicareBox").length == 0) return false;
        $("#yzxdFather .medicareBox").show();
        $("#yzxdFather .medicareBox").children("div").remove();
        var ysSort = [];   // 原始顺序
        $("#yzDBCButtonNR li").each(function () {
            var thisLiId = $(this).attr("id");
            if ($("#dt" + thisLiId).length == 1) {
                // 如果是长嘱的第一个 并且 临嘱的数量等于0 距离顶部36像素
                if ($(this).parent().attr("id") == "yzDaiBaoCun-Chang" && $(this).prev().length == 0 && $("#yzDaiBaoCun-Lin li").length == 0) {
                    var marTop = 39;
                    ysSort.push({ id: $(this).attr("id"), top: marTop, bottom: 0 });
                    // 如果是临嘱的最后一个，并且长嘱的数量为0
                } else if (thisLiId == $("#yzDaiBaoCun-Lin li:last").attr("id") && $("#yzDaiBaoCun-Chang li").length == 0) {
                    var marBottom = 39;
                    ysSort.push({ id: $(this).attr("id"), top: 0, bottom: marBottom });
                } else {
                    ysSort.push({ id: $(this).attr("id"), top: 0, bottom: 0 });
                }
            } else {
                // 如果是长嘱的第一个 并且 临嘱的数量等于0 距离顶部36像素
                var marTop = 0;
                if ($(this).parent().attr("id") == "yzDaiBaoCun-Chang" && $(this).prev().length == 0 && $("#yzDaiBaoCun-Lin li").length == 0) {
                    marTop = 39;
                }
                var heightPx = 40;
                ysSort.push({ id: $(this).attr("id"), height: heightPx, top: marTop });
            }
        });
        var arr = [];
        $("#yzxdFather .medicareBox dt").each(function () {
            arr.push({ target: this, value: this.dataset.xh });
        });
        for (var r = 0; r < ysSort.length; r++) {
            if (ysSort[r].height) {
                $("#yzxdFather .medicareBox").append('<dt data-xh="' + ysSort[r].id + '" id="dt' + ysSort[r].id + '" style="height:' + ysSort[r].height + 'px; margin-top:' + ysSort[r].top + 'px;"></dt>');
            } else {
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].value == ysSort[r].id) {
                        arr[i].target.style.marginTop = ysSort[r].top + "px";
                        arr[i].target.style.marginBottom = ysSort[r].bottom + "px";
                        $("#yzxdFather .medicareBox").append(arr[i].target);
                        break;
                    }
                }
            }
        }
    }

    // 医嘱校验数据提示
    function mesPrompt(thisli) {
        var litext = $(thisli).find('label').attr("data-text");
        thisli.append('<div class="yizcheck" style="display:none"><div class="tuchu"></div><div class="cont">' + litext + '</div></div>');
        var contHeight = $(thisli).find('.yizcheck').outerHeight();//内容div的高度 
        $(thisli).find('.yizcheck').remove();
        var liDistance = $(thisli).offset().top - $("#yzDBCButtonNR").offset().top - 7; //当前li距离显示框顶部的距离

        if (parseInt(contHeight) > liDistance) {//li顶部没有充足的空间显示			
            thisli.append('<div class="yizcheck-bottom yizhuDIv"><div class="tuchu"></div><div class="cont">' + litext + '</div></div>');
            var divMargin = parseInt(contHeight) + 76;
            $(thisli).find('.yizcheck-bottom').find('.cont').css('margin-bottom', -divMargin);
        } else {
            thisli.append('<div class="yizcheck yizhuDIv"><div class="tuchu"></div><div class="cont">' + litext + '</div></div>');
            var divMtop = parseInt(contHeight) + 5;
            $(thisli).find('.yizcheck').css('margin-top', -divMtop);
        }
    }

    // -------------------------------------------------------------
    // 一级转二级 控件控制
    function oneToTwo(thisID) {
        $("#yzxdOneJi").hide();
        $("#yzxdCL").hide();         // 长嘱临嘱按钮
        $("#buttonBack").attr("data-state", "").show();     // 返回按钮 
        $("#buttonConfirm").show();  // 确定按钮
        $("#yzxdTwoJi").show();
        $("#yzxdYaoPin li").removeClass("active");
        thisID.parent("li").addClass("active");
        $("#sskeyboardbox").hide();
        $("#buttonBackDBC").hide();
        $("#yzxdYaoNR li").removeClass('xuanThis');

        // 清空缓存数据
        $("#nrJYXM").empty("li").hide();
        $("#nrJCXM").empty("li").hide();
    }

    //医嘱下达 一级转二级
    $("#yzxdYaoPin").on('click', 'li label', function () {
        event.stopPropagation();    //  阻止事件冒泡
        event.preventDefault();     //  阻止默认行为 ( 表单提交 )	
        document.getElementById("tableBodyScroll").style.pointerEvents = 'none';
        setTimeout(function () {
            document.getElementById("tableBodyScroll").style.pointerEvents = 'auto';
        }, 400);
        // 如果是成套
        if ($(this).attr("id").indexOf("ct") != -1) {
            oneToTwo($(this));
            $("#yzxdTwoJiHeight").hide();     // 非成套隐藏
            $("#yzxdTwoJiChengTao").show();   // 成套显示
            $("#yzxdTwoJiChengTao .biaoTi").hide();
            $("#yzxdBiaoTi font").text("成套医嘱下达");
            $("#yzxdTwoJi .yzxdYaoBT > span").text($("#yzxdYaoPin .active label").text());
            $("#yzxdTwoJi .yzxdYaoBT > span").attr("name", $(this).attr("id"));

            // 准备传入值
            var xmID = $(this).attr("id").replace("ct", "");
            var patiID = $("#slzyID").attr("data-patiid");
            var pageID = $("#slzyID").attr("data-pageid");
            var userID = $("#userInfobox font").attr("data-userid");
            var ksID = $("#slzyID").attr("data-ksID");

            loadCT();
            function loadCT() {
                $("#LoadedTip").show();
                $.ajax({
                    url: serviceChoose + "/DC_GET_CTItemLists",
                    type: "post",
                    timeout: utils.timeoutSec(),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        "ZLXMID": xmID,												// --诊疗项目ID，获取列表时返回
                        "PATIID": patiID,
                        "PAGEID": pageID,
                        "RYID": userID,
                        "KSID": ksID,
                        "ZD": utils.getZdId()
                    }),
                    success: function (responseTxt) {
                        if (responseTxt.Result.ERROR) {
                            $("#LoadedTip").hide();
                            utils.showHide(responseTxt.Result.ERROR.MSG);
                        } else {
                            //console.log(responseTxt);
                            yiZhuList.push(responseTxt);

                            function qxhs(tr) {
                                var value = tr.replace(/[^0-9]/ig, "");
                                var n = parseInt(value) + 1;
                                var str = tr.replace(value, n);
                                return str;
                            }
                            $("#quanXuan").text('取消全选');

                            $("#yzxdTwoJiChengTao ul").empty("li").scrollTop(0);
                            for (var i = 0; i < responseTxt.Result.CTDETAIL.ITEMLIST.ITEM.length; i++) {
                                // 如果是药品
                                if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6) {
                                    var KSS = responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].KSS;
                                    var CFZW = responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].CFZW;
                                    //如果是一并追加的药
                                    if ($("#chengTaozyyy>li").length > 0) {
                                        $("#chengTaozyyy>li").each(function (n) {
                                            if ($(this).attr("data-xgxh") == responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH) {
                                                // 如果是一并追加的第一个
                                                if ($(this).find("ul").length == 0)
                                                    $(this).append('<ul><li data-kss="' + KSS + '" data-cfzw="' + CFZW + '" data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xgxh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li></ul>');
                                                else
                                                    $(this).children("ul").append('<li data-kss="' + KSS + '" data-cfzw="' + CFZW + '" data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xgxh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                                return false;
                                            }
                                            if (n == $("#chengTaozyyy>li").length - 1) {
                                                if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 1) {
                                                    $("#chengTaozyyy").append('<li data-kss="' + KSS + '" data-cfzw="' + CFZW + '" data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xgxh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">临</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                                } else {
                                                    $("#chengTaozyyy").append('<li data-kss="' + KSS + '" data-cfzw="' + CFZW + '" data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xgxh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="changZhu">长</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                                }
                                            }
                                        });
                                    } else {
                                        if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 1) {
                                            $("#chengTaozyyy").append('<li data-kss="' + KSS + '" data-cfzw="' + CFZW + '" data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xgxh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">临</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                        } else {
                                            $("#chengTaozyyy").append('<li data-kss="' + KSS + '" data-cfzw="' + CFZW + '" data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xgxh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="changZhu">长</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');

                                        }
                                    }

                                    $("#chengTaozyyy").prev().show();
                                    // 如果是检查
                                } else if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "D") {
                                    $("#chengTaojc").prev().show();
                                    // 判断检查项目ID是否重复 如果重复则不追加，不重复才追加
                                    if ($("#chengTaojc li").length > 0) {
                                        $("#chengTaojc li").each(function (ctjcI) {
                                            if ($(this).attr("data-xmid") == responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID) {
                                                $(this).find("font").text(qxhs($(this).find("font").text()));
                                                return false;
                                            }
                                            // 如果循环完都没找到重复的，则追加
                                            if (ctjcI == $("#chengTaojc li").length - 1) {
                                                if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 1) {
                                                    $("#chengTaojc").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">临</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span>' + '<font>[x1]</font>' + '<span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                                } else {
                                                    $("#chengTaojc").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">长</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span>' + '<font>[x1]</font>' + '<span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                                }
                                            }
                                        });
                                    } else {
                                        if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 1) {
                                            $("#chengTaojc").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">临</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span>' + '<font>[x1]</font>' + '<span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                        } else {
                                            $("#chengTaojc").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">长</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span>' + '<font>[x1]</font>' + '<span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');

                                        }
                                    }
                                    // 如果是检验
                                } else if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C") {
                                    $("#chengTaojy").prev().show();
                                    // 判断检验项目SGBM是否重复 如果重复则不追加，不重复才追加
                                    if ($("#chengTaojy li").length > 0) {
                                        $("#chengTaojy li").each(function (ctjcI) {
                                            if ($(this).attr("data-sgbm") == responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SGBM) {
                                                $(this).find("font").text(qxhs($(this).find("font").text()));
                                                return false;
                                            }
                                            // 如果循环完都没找到重复的，则追加
                                            if (ctjcI == $("#chengTaojy li").length - 1) {
                                                if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 1) {
                                                    $("#chengTaojy").append('<li data-sgbm="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SGBM + '" data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">临</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span>' + '<font>[x1]</font>' + '<span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                                } else {
                                                    $("#chengTaojy").append('<li data-sgbm="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SGBM + '" data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="changZhu">长</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span>' + '<font>[x1]</font>' + '<span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');

                                                }
                                            }
                                        });
                                    } else {
                                        if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 1) {
                                            $("#chengTaojy").append('<li data-sgbm="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SGBM + '" data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">临</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span>' + '<font>[x1]</font>' + '<span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                        } else {
                                            $("#chengTaojy").append('<li data-sgbm="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SGBM + '" data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="changZhu">长</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span>' + '<font>[x1]</font>' + '<span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                        }
                                    }
                                    // 如果是护理
                                } else if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "H") {
                                    if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 1) {
                                        $("#chengTaohl").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">临</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                    } else {
                                        $("#chengTaohl").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="changZhu">长</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                    }
                                    $("#chengTaohl").prev().show();
                                    // 如果是膳食
                                } else if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "I") {
                                    if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 1) {
                                        $("#chengTaoss").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">临</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                    } else {
                                        $("#chengTaoss").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="changZhu">长</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                    }
                                    $("#chengTaoss").prev().show();
                                    // 如果是治疗
                                } else if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "E") {
                                    if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 1) {
                                        $("#chengTaozl").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">临</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                    } else {
                                        $("#chengTaozl").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="changZhu">长</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');

                                    }
                                    $("#chengTaozl").prev().show();
                                    // 如果是其它
                                } else if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "Z") {
                                    if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 1) {
                                        $("#chengTaoqt").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="linZhu">临</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                    } else {
                                        $("#chengTaoqt").append('<li data-xmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID + '" data-sfxmid="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SFXMID + '" data-lb="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB + '" data-xh="' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH + '"><span class="fs1 selt yes" aria-hidden="true" data-icon=""></span><span class="changZhu">长</span><span class="textsmall">' + responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC + '</span><span class="fs1 tbspan noJC" aria-hidden="true" data-icon=""></span></li>');
                                    }
                                    $("#chengTaoqt").prev().show();
                                }
                            }
                            //触碰示意动画$("#yzxdTwoJi .yzxdChengTaoBox li")
                            // $("#yzxdTwoJiChengTao>ul>li").on("touchstart touchmove",function(){
                            // 	utils.CpStart($(this));
                            // 	$(this).find("ul").css("background","#fff")
                            // });
                            // $("#yzxdTwoJiChengTao>ul>li").on("touchend",function(){
                            // 	utils.CpEnd($(this));
                            // });
                            // $("#yzxdTwoJiChengTao>ul>li>ul").on("touchstart touchmove",function(){
                            // 	utils.CpStart($(this));
                            // });
                            // $("#yzxdTwoJiChengTao>ul>li>ul").on("touchend",function(){
                            // 	utils.CpEnd($(this));
                            // });

                            var hammerCmplteSetYaoPinSelt1 = $("#yzxdTwoJiChengTao ul li .tbspan").hammer();
                            // 注册事件 查看图标
                            hammerCmplteSetYaoPinSelt1.on("tap", function (event) {
                                //event.stopPropagation();    //  阻止事件冒泡
                               // event.preventDefault();     //  阻止默认行为 ( 表单提交 )
                                // 判断是否有权限
                                var yao_KSS = $(this).parent().attr("data-kss");
                                var yao_CFZW = $(this).parent().attr("data-cfzw");
                                var ren_KSS = $("#userInfobox > font").attr("data-jb");
                                var ren_CFZW = $("#userInfobox > font").attr("data-pr");
                                if (yao_KSS == undefined || yao_CFZW == undefined) {
                                    if ($(this).parent().parent().prev().hasClass("noJC")) {
                                        utils.showHide("请先录入父级医嘱");
                                    } else {
                                        $("#yzxdTwoJiChengTao ul li .tbspan").removeClass("activeJC");
                                        $(this).addClass("activeJC");
                                        confirmOrdAct($(this));
                                    }
                                } else if (ren_CFZW < yao_CFZW || ren_CFZW == yao_CFZW || yao_CFZW == 0) {
                                    if ($(this).parent().parent().prev().hasClass("noJC")) {
                                        utils.showHide("请先录入父级医嘱");
                                    } else {
                                        // 抗生素是否需审核
                                        if (ren_KSS == 0 && (yao_KSS == 1 || yao_KSS == 2 || yao_KSS == 3)) {
                                            utils.showHide("抗生素用药等级不够。");
                                        } else if ((yao_KSS == 2 && ren_KSS == 1) || (yao_KSS == 3 && (ren_KSS == 1 || ren_KSS == 2))) {
                                            $("#yzxd-name").attr("data-shbj", 1);
                                            $("#yzxdTwoJiChengTao ul li .tbspan").removeClass("activeJC");
                                            $(this).addClass("activeJC");
                                            confirmOrdAct($(this));
                                        } else {
                                            $("#yzxd-name").attr("data-shbj", 0);
                                            $("#yzxdTwoJiChengTao ul li .tbspan").removeClass("activeJC");
                                            $(this).addClass("activeJC");
                                            confirmOrdAct($(this));
                                        }
                                    }
                                } else {
                                    utils.showHide("处方职务用药等级不够。");
                                }
                                //return false;
                            });


                            // 注册事件 选中图标
                            var hammerCmplteSetYaoPinSelt = $("#yzxdTwoJiChengTao>ul>li").hammer();
                            hammerCmplteSetYaoPinSelt.on("tap", function (event) {
                                //event.stopPropagation();    //  阻止事件冒泡
                                //event.preventDefault();     //  阻止默认行为 ( 表单提交 )
                                // 如果选中 则不选中
                                if ($(this).children(".selt").attr("data-icon") == ("")) {
                                    $(this).children(".selt").attr("data-icon", "").removeClass("yes").addClass("no");
                                    $(this).find(".tbspan").hide();
                                } else {
                                    $(this).children(".selt").attr("data-icon", "").removeClass("no").addClass("yes");
                                    $(this).find(".tbspan").show();
                                }
                            });
                        }
                        $("#LoadedTip").hide();

                    },
                    complete: function (XMLHttpRequest, status) {
                        utils.errorAjax(status, loadCT, []);
                    }
                });
            }
            // 不是成套 检验
        } else if ($(this).attr("data-lb") == "C") {
            oneToTwo($(this));
            $("#yzxdTwoJi .yzxdYaoBT > span").text("标本：" + $(this).attr("data-bbbw")).attr("name", "xmID" + $(this).attr("id"));
            // 默认添加一个检验项目
            var mr_jyxmid = $(this).attr("id");
            var mr_jyxmmc = $(this).text();
            var mr_jyxmbbbw = $(this).attr("data-bbbw");
            var mr_jyxmczlx = $(this).attr("data-czlx");
            var mr_jyxmsgbh = $(this).attr("data-sgbh");
            $("#nrJYXM").append('<li name="' + mr_jyxmid + '" data-bbbw="' + mr_jyxmbbbw + '" data-czlx="' + mr_jyxmczlx + '" data-sgbh="' + mr_jyxmsgbh + '"><div style="width:80%; float:left;">' + mr_jyxmmc + '</div><span class="fs1 text-26 color-hong" aria-hidden="true" data-icon=""></span></li>');
            // 注册事件 删除检验项目
            $("#nrJYXM li span").unbind();
            hammeryzxdDelljyxm_mr = $("#nrJYXM li span").hammer();
            hammeryzxdDelljyxm_mr.on("tap", function () {
                yzxdJCXMdell($(this));
            });

            $("#yzxdBiaoTi font").text("医嘱下达");
            $("#yzxdTwoJiChengTao").hide();   // 成套隐藏
            $("#yzxdTwoJiHeight").show();     // 非成套显示
            dataLoad.loadYaoPin($(this).attr("id"), ybzjYaoPin, undefined, yiZhuList[yiZhuList.length - 1]);
            // 不是成套 药品
        } else if ($(this).attr("data-lb") == "5" || $(this).attr("data-lb") == "6") {
            var yao_KSS = $(this).attr("data-kss");
            var yao_CFZW = $(this).attr("data-cfzw");
            var ren_KSS = $("#userInfobox > font").attr("data-jb");
            var ren_CFZW = $("#userInfobox > font").attr("data-pr");
            // 判断是否够权限			
            if (ren_CFZW < yao_CFZW || ren_CFZW == yao_CFZW || yao_CFZW == 0) {
                // 抗生素是否需审核
                if (ren_KSS == 0 && (yao_KSS == 1 || yao_KSS == 2 || yao_KSS == 3)) {
                    utils.showHide("抗生素用药等级不够。");
                } else if ((yao_KSS == 2 && ren_KSS == 1) || (yao_KSS == 3 && (ren_KSS == 1 || ren_KSS == 2))) {
                    $("#yzxd-name").attr("data-shbj", 1);
                    oneToTwo($(this));
                    $("#yzxdTwoJi .yzxdYaoBT > span").text($(this).text()).attr("name", "xmID" + $(this).attr("id"));
                    $("#yzxdBiaoTi font").text("医嘱下达");
                    $("#yzxdTwoJiChengTao").hide();   // 成套隐藏
                    $("#yzxdTwoJiHeight").show();     // 非成套显示
                    dataLoad.loadYaoPin($(this).attr("id"), ybzjYaoPin, undefined, yiZhuList[yiZhuList.length - 1]);
                } else {
                    $("#yzxd-name").attr("data-shbj", 0);
                    oneToTwo($(this));
                    $("#yzxdTwoJi .yzxdYaoBT > span").text($(this).text()).attr("name", "xmID" + $(this).attr("id"));
                    $("#yzxdBiaoTi font").text("医嘱下达");
                    $("#yzxdTwoJiChengTao").hide();   // 成套隐藏
                    $("#yzxdTwoJiHeight").show();     // 非成套显示
                    //请求接口获取总剂量的数据
                    //totalDoseInfo($(this).attr("id"),yiZhuList[0].result.OUTPUT.ITEMLIST.ITEM[0].FYYF.ITEM[0].ID);
                    //判断如果库存量为0不可操作保存
                    //if (utils.getTotalDose() == 0) {
                    //    $("#buttonConfirm").hide();
                    //}
                    //$.ajax({
                    //    url: serviceChoose + "/DC_DrugInventory",
                    //    type: 'POST',
                    //    headers: {
                    //        'Content-Type': 'application/json'
                    //    },
                    //    data: JSON.stringify({
                    //        "YPID": $(this).attr("id"),//药品ID
                    //        "YFID": yiZhuList[0].Result.OUTPUT.ITEMLIST.ITEM[0].FYYF.ITEM[0].ID//药房ID
                    //    }),
                    //    timeout: utils.timeoutSec(),
                    //    dataType: "JSON"
                    //}).always(function (responseTxt, status, xhr) {
                    //    if (status == "success") {
                    //        utils.setTotalDose(responseTxt.Result.OUTPUT.KYSL);
                    //        if (responseTxt.Result.OUTPUT.KYSL == 0) {
                    //            $("#buttonConfirm").hide();
                    //        } else {
                    //            $("#buttonConfirm").show();
                    //        }
                    //    }
                    //});
                    dataLoad.loadYaoPin($(this).attr("id"), ybzjYaoPin, undefined, yiZhuList[yiZhuList.length - 1]);
                }
            } else {
                utils.showHide("处方职务用药等级不够。");
            }
            // 不是成套 其它
        } else {
            oneToTwo($(this));
            $("#yzxdTwoJi .yzxdYaoBT > span").text($(this).text()).attr("name", "xmID" + $(this).attr("id"));
            $("#yzxdBiaoTi font").text("医嘱下达");
            $("#yzxdTwoJiChengTao").hide();   // 成套隐藏
            $("#yzxdTwoJiHeight").show();     // 非成套显示
            dataLoad.loadYaoPin($(this).attr("id"), ybzjYaoPin, undefined, yiZhuList[yiZhuList.length - 1]);
        }
    });

    // 点击置顶
    $("#yzxdYaoPin").on('click', 'li span', function (event) {
        yzxdYaoPinLiSpan($(this));
    });

    // 置顶操作 ----------------------------------------------------
    var zdSpan, zdBj;  // 点击置顶的图标，置顶的标记 0 取消置顶 1 置顶。
    function yzxdYaoPinLiSpan(thisID) {

        zdSpan = thisID;
        fyText = 0;  //当前页

        // 如果是已置顶
        if (thisID.attr('data-icon') == "") {
            utils.alertPrompt('是否将“' + thisID.siblings('label').text() + '”取消置顶？', 'gantan', 'qdqx');
            utils.myconfirm(zdOk, zdCancel);
            zdBj = 0;
            // 如果是未置顶
        } else {
            utils.alertPrompt('是否将“' + thisID.siblings('label').text() + '”置顶？', 'gantan', 'qdqx');
            utils.myconfirm(zdOk, zdCancel);
            zdBj = 1;
        }

    }

    function zdOk() {
        $("#promptQDQX").hide();
        submitZhiDing();
    }

    function zdCancel() {
        setTimeout(function () {
            $("#promptQDQX").hide();
        }, 300);
    }

    function submitZhiDing() {
        $("#LoadedTip").show();
        var userID = $("#userInfobox font").attr("data-userid");
        var ksID = $("#slzyID").attr("data-ksid");
        var lb, xmID, sfxmID, thisID, YorN;
        YorN = zdBj;
        thisID = zdSpan;
        xmID = thisID.prev().attr("id");
        if (xmID.indexOf("ct") !== -1) {
            lb = 9;
        } else {
            lb = thisID.prev().attr("data-lb");
        }

        if (lb == 5 || lb == 6) {
            xmID = thisID.prev().attr("data-ymid");
            sfxmID = thisID.prev().attr("id").replace("ct", "");
        } else {
            xmID = thisID.prev().attr("id").replace("ct", "");
            sfxmID = "";
        }

        $.ajax({
            url: serviceChoose + "/DC_SaveCYXM",
            type: "post",
            timeout: utils.timeoutSec(),
            dataType: "json",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "IN": {
                    "RYID": userID,                                                     //--当前操作员ID
                    "KSID": ksID,
                    "LB": lb,                                                           //--项目类别   在获取项目列表时会返回
                    "XMID": xmID,                                                       //--项目ID
                    "SFXMID": sfxmID,                                                   //--收费细目ID   在获取项目列表时会返回
                    "GD": YorN,                                                         //--是否置顶  0-取消置顶,1-置顶
                    "CXTJ": "0"                                                         //--重新统计 0-否，1-是。是否按使用概率重新统计常用项目。默认传0，如果传1，则XMID、GD两个参数可以不传。
                }
            }),
            success: function (responseTxt) {
                if (responseTxt.Result.ERROR) {
                    $("#LoadedTip").hide();
                    utils.showHide(responseTxt.Result.ERROR.MSG);
                } else {
                    //var searchText = $("#searchText").text();
                    var searchText = $("#searchText").val();
                    if (YorN == 0) {
                        if (responseTxt.Result.RESULT == "1") {
                            if ($("#yzxdButton").find(".item").text() !== "成套") {
                                // 刷新非成套 从第一页开始
                                if (searchText !== "按拼音简码检索" && searchText !== "") {
                                    dataLoad.loadXiangMuList(0, searchText).then(function (res) {
                                        fyCount = res.count;
                                        yiZhuList.push(res);
                                    });
                                } else {
                                    dataLoad.loadXiangMuList().then(function (res) {
                                        fyCount = res.count;
                                        yiZhuList.push(res);
                                    });
                                }
                            } else {
                                // 刷新成套 从第一页开始
                                if (searchText !== "按拼音简码检索" && searchText !== "") {
                                    loadChengTaoList(0, searchText);
                                } else {
                                    loadChengTaoList(fyText);
                                }
                            }
                            utils.showHide("取消置顶成功");
                        }
                        if (responseTxt.Result.ERROR) {
                            utils.showHide("操作失败");
                        }
                    } else {
                        if (responseTxt.Result.RESULT == "1") {
                            if ($("#yzxdButton").find(".item").text() !== "成套") {
                                // 刷新非成套 从第一页开始
                                if (searchText !== "按拼音简码检索" && searchText !== "") {
                                    dataLoad.loadXiangMuList(0, searchText).then(function (res) {
                                        fyCount = res.count;
                                        yiZhuList.push(res);
                                    });
                                } else {
                                    dataLoad.loadXiangMuList().then(function (res) {
                                        fyCount = res.count;
                                        yiZhuList.push(res);
                                    });
                                }
                            } else {
                                // 刷新成套 从第一页开始
                                if (searchText !== "按拼音简码检索" && searchText !== "") {
                                    loadChengTaoList(0, searchText);
                                } else {
                                    loadChengTaoList(fyText);
                                }
                            }
                            utils.showHide("置顶成功");
                        }
                        if (responseTxt.Result.ERROR) {
                            utils.showHide("操作失败");
                        }
                    }
                }
                $("#LoadedTip").hide();
            },
            complete: function (XMLHttpRequest, status) {
                utils.errorAjax(status, submitZhiDing, []);
            }
        });
    }
    //-------------------------------------------------------------

    // 增加检查项目 出现选项块
    hammerbuttonaddJCXM = $("#buttonaddJCXM").hammer();
    hammerbuttonaddJCXM.on('tap', function (ev) {
        $("#nrJCXM li").removeClass("active");
        $("#yzxdYaoNR li").css("background", "#fff");
        $(".yzxdKongJian").hide();
        $("#yzxdJCXM ul").empty("li");

        // 加载检查项目内容
        var responseTxt;
        if ($("#yzxd-name").hasClass("editState")) {
            responseTxt = yiZhuList[$("#yzxd-name").attr("data-index")];
        } else {
            responseTxt = yiZhuList[yiZhuList.length - 1];
        }

        // JSON 对象 开头对象名 成套和非成套不一样 
        var JsonObject = "";
        var xmID = "";

        // 如果是成套
        if ($("#yzxd-name").attr("name").indexOf("ct") != -1) {
            JsonObject = "CTDETAIL";
            xmID = $("#yzxd-name").attr("name").replace('xmIDct', "");
            // 如果不是成套
        } else {
            JsonObject = "OUTPUT";
            xmID = $("#yzxd-name").attr("name").replace('xmID', "");
        }

        // 如果是项目列表结构
        if (responseTxt.Result[JsonObject].ITEMLIST) {
            for (var i = 0; i < responseTxt.Result[JsonObject].ITEMLIST.ITEM.length; i++) {
                if (responseTxt.Result[JsonObject].ITEMLIST.ITEM[i].ZLXMID == xmID) {
                    for (var ii = 0; ii < responseTxt.Result[JsonObject].ITEMLIST.ITEM[i].JCBW.ITEM.length; ii++) {
                        $("#yzxdJCXM ul").append('<li name="' + responseTxt.Result[JsonObject].ITEMLIST.ITEM[i].JCBW.ITEM[ii].FF + '">' + responseTxt.Result[JsonObject].ITEMLIST.ITEM[i].JCBW.ITEM[ii].BW + '</li>');
                    }
                    break;
                }
            }
            // YZLIST结构，只有一个检查部位列表
        } else if (responseTxt.Result[JsonObject].JCBW.ITEM) {
            $.each(responseTxt.Result[JsonObject].JCBW.ITEM, function (n, value) {
                $("#yzxdJCXM ul").append('<li name="' + value.FF + '">' + value.BW + '</li>');
				/*//动画yzxdJCXM
				$("#yzxdJCXM li").on("touchstart touchmove",function(){
					utils.CpStartback($(this));
				});
				$("#yzxdJCXM li").on("touchend",function(){
					utils.CpEnd($(this));
				});
				// 注册事件
				hammeryzxdJCXM_edit = $("#yzxdJCXM ul li").hammer();
				hammeryzxdJCXM_edit.on('tap',function(ev){
					jianChaXM($(this),$(this).text(),$(this).attr("name"));
				});*/
            });
            // YZLIST结构，多个检查部位列表
        } else if (responseTxt.Result[JsonObject].JCBW instanceof Array) {
            var jcbwXmId = $("#yzxd-name").attr("name").replace("xmID", "");
            for (var m in responseTxt.Result[JsonObject].JCBW) {
                if (responseTxt.Result[JsonObject].JCBW[m].ZLXMID == jcbwXmId) {
                    var jcbwItem = responseTxt.Result[JsonObject].JCBW[m].ITEM;
                    for (var mm in jcbwItem) {
                        $("#yzxdJCXM ul").append('<li name="' + jcbwItem[mm].FF + '">' + jcbwItem[mm].BW + '</li>');
                    }
                    break;
                }
            }
        }
        //动画
        $("#yzxdJCXM li").on("touchstart touchmove", function () {
            utils.CpStartback($(this));
        });
        $("#yzxdJCXM li").on("touchend", function () {
            utils.CpEnd($(this));
        });
        // 注册事件
        hammeryzxdJCXM = $("#yzxdJCXM ul li").hammer();
        hammeryzxdJCXM.on('tap', function (ev) {
            jianChaXM($(this), $(this).text(), $(this).attr("name"));
        });
        // 计算高度
        $("#yzxdJCXM").show();
        $("#yzxdJCXM ul li:first").css("border-top", "1px solid #51525d");

    });

    // 增加检查项目
    function jianChaXM(thisID, thisText, thisName) {
        $("#yzxdJCXM ul li").removeClass("active");
        thisID.addClass("active");
        var b = $("#nrJCXM").html();
        if (b.indexOf(thisText) <= 0) {
            $("#nrJCXM").append('<li name="' + thisName + '"><div style="width:80%; float:left;"><div class="max">' + thisText + '</div><div class="min text-red">请选择方法</div></div><span class="fs1 text-26 color-hong" aria-hidden="true" data-icon=""></span></li>');
            $("#yzxdTwoJi p").text("已选择检查部位").removeClass("text-red");

            // 注册事件 删除检查项目
            $("#nrJCXM li span").unbind(); //移除所有事件 防止注册多次 
            hammeryzxdDellJCXM1 = $("#nrJCXM li span").hammer();
            hammeryzxdDellJCXM1.on("tap", function () {
                utils.yzxdDellJCXM($(this).parent());
            });

            //检查项目动画示意
            $("#nrJCXM li").on("touchstart touchmove", function () {
                utils.CpStart($(this));
            });
            $("#nrJCXM li").on("touchend", function () {
                utils.CpEnd($(this));
            });

            // 注册时间 选择检查方法
            $("#nrJCXM li>div").unbind(); //移除所有事件 防止注册多次 
            hammeryzxdSelFF = $("#nrJCXM li>div").hammer();
            hammeryzxdSelFF.on("tap", function () {
                debugger;
                utils.yzxdSelFF($(this).parent());
            });
        }
    }

    // 增加检验项目 出现选项块
    hammerbuttonaddJYXM = $("#buttonaddJYXM").hammer();
    hammerbuttonaddJYXM.on('tap', function (ev) {
        $(".yzxdKongJian").hide();
        // 加载检验项目内容
        var responseTxt;
        if (yiZhuJianYanObject !== "") {
            responseTxt = yiZhuJianYanObject;
            loadJyxm();
        } else {
            // 准备传入值
            var patiID = $("#slzyID").attr("data-patiid");
            var pageID = $("#slzyID").attr("data-pageid");
            var ksID = $("#slzyID").attr("data-ksid");
            var ysID = $("#userInfobox font").attr("data-userid");
            //  加载检验项目列表
            loadlistJYXM();
            function loadlistJYXM() {
                $("#LoadedTip").show();
                $.ajax({
                    url: serviceChoose + "/DC_Advice_GetItemLists",
                    type: "post",
                    timeout: utils.timeoutSec(),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        "QX": "临嘱",
                        "XX": "检验追加",
                        "PATIID": patiID,
                        "PAGEID": pageID,
                        "KSID": ksID,
                        "YSID": ysID,
                        "JM": null,
                        "STARTPAGE": 0,
                        "PAGECOUNT": "1",
                        "ITEMCOUNT": "",
                        "ZD": utils.getZdId()
                    }),
                    success: function (jyxmList) {
                        if (jyxmList.Result.ERROR) {
                            $("#LoadedTip").hide();
                            utils.showHide(jyxmList.Result.ERROR.MSG);
                        } else {
                            responseTxt = jyxmList;
                            yiZhuJianYanObject = jyxmList;
                            //console.log(responseTxt);
                            loadJyxm();
                        }
                        $("#LoadedTip").hide();
                    },
                    complete: function (XMLHttpRequest, status) {
                        utils.errorAjax(status, loadlistJYXM, []);
                    }
                });
            }
        }

        function loadJyxm() {
            // 获取当前检验项目的操作类型和试管编号
            var now_czlx = "";
            var now_sgbh = "";
            now_czlx = $("#nrJYXM li:first").attr("data-czlx");
            now_sgbh = $("#nrJYXM li:first").attr("data-sgbh");
            // 循环加载和当前检验项目 操作类型、试管编号一致的项目
            $("#yzxdJYXM ul").empty("li");
            if (now_czlx !== undefined && now_sgbh !== undefined && now_czlx !== null && now_sgbh !== null && now_czlx !== "null" && now_sgbh !== "null") {
                for (var ii = 0; ii < responseTxt.Result.OUTPUT.ITEMLIST.ITEM.length; ii++) {
                    if (responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].CZLX == now_czlx && responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].SGBM == now_sgbh)
                        $("#yzxdJYXM ul").append('<li data-pyjm="' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].PYJM + '" data-bbbw="' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].BBBW + '" data-czlx="' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].CZLX + '" data-sgbh="' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].SGBM + '" name="' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].ZLXMID + '">' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].XMMC + '</li>');
                }
            } else {
                for (var ii = 0; ii < responseTxt.Result.OUTPUT.ITEMLIST.ITEM.length; ii++) {
                    $("#yzxdJYXM ul").append('<li data-pyjm="' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].PYJM + '" data-bbbw="' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].BBBW + '" data-czlx="' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].CZLX + '" data-sgbh="' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].SGBM + '" name="' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].ZLXMID + '">' + responseTxt.Result.OUTPUT.ITEMLIST.ITEM[ii].XMMC + '</li>');
                }
            }

            //检验项目动画
            $("#yzxdJYXM li").on("touchstart touchmove", function () {
                utils.CpStartback($(this));
            });
            $("#yzxdJYXM li").on("touchend", function () {
                utils.CpEnd($(this));
            });

            // 注册事件 增加检验项目
            hammeryzxdJYXM = $("#yzxdJYXM ul li").hammer();
            hammeryzxdJYXM.on('tap', function (ev) {
                yzxdJYXMadd($(this), $(this).attr("name"), $(this).text());
            });
            $("#yzxdJYXM").show();
            //$("#yzxdJYXM .yzxdKJ").css("bottom","190px");
            $("#yzxdJYXM ul li:first").css("border-top", "1px solid #51525d");
            $("#jyxmEglish").text('按拼音简码检索');
            //键盘显示前的控制
            keyboardshowOrhiade();
        }
    });

    // 增加检验项目
    function yzxdJYXMadd(thisID, thisXMID, thisText) {
        $("#yzxdJYXM ul li").removeClass("active");
        thisID.addClass("active");
        var thisCZLX = thisID.attr("data-czlx");
        var thisSGBH = thisID.attr("data-sgbh");
        var thisBBBW = thisID.attr("data-bbbw");
        var b = $("#nrJYXM").html();
        if (b.indexOf(thisText) <= 0) {
            $("#nrJYXM").append('<li data-bbbw="' + thisBBBW + '" data-czlx="' + thisCZLX + '" data-sgbh="' + thisSGBH + '" name="' + thisXMID + '"><div style="width:80%; float:left;">' + thisText + '</div><span class="fs1 text-26 color-hong" aria-hidden="true" data-icon=""></span></li>');
            $("#yzxdTwoJi p").text("已选择检验项目").removeClass("text-red");
            $("#yzxdJYXM").hide();
            // 判断标本是否跟原始标本一致
            var ys_bbbw = $("#yzxd-name").text().replace("标本：", "");
            if ($("#nrJYXM li:first").attr("data-bbbw") !== ys_bbbw) {
                $("#yzxd-name").text("标本：" + $("#nrJYXM li:first").attr("data-bbbw"));
            }
        }
        //已添加检验项目动画
        $("#nrJYXM li").on("touchstart touchmove", function () {
            utils.CpStart($(this));
        });
        $("#nrJYXM li").on("touchend", function () {
            utils.CpEnd($(this));
        });

        // 注册事件 删除检验项目
        $("#nrJYXM li span").unbind();
        hammeryzxdDelljyxm = $("#nrJYXM li span").hammer();
        hammeryzxdDelljyxm.on("tap", function () {
            yzxdJCXMdell($(this));
        });
    }

    // 删除检验项目  
    function yzxdJCXMdell(thisID) {
        if ($("#nrJYXM").find("li").length > 1) {
            thisID.parent().remove();
        } else {
            utils.showHide("不能没有检验项目");
        }
    }

    //医嘱下达 二级转一级
    hammerbuttonBack = $("#buttonBack").hammer();
    hammerbuttonBack.on('tap', function (ev) {
        // 返回待保存
        if ($("#yzDBCButtonNR").find("li").length > 0 && ($("#yzxdBiaoTi font").text() == "成套医嘱下达" || $("#yzxdBiaoTi font").text() == "医嘱下达")) {
            $("#buttonBackDBC").show();
        } else {
            $("#buttonBackDBC").hide();
        }
        if ($("#yzxdBiaoTi font").text() == "成套医嘱编辑") {
            $(".yzxdKongJian").hide();
            $("#yzxdYaoNR").hide();
            $("#yzxdTwoJiChengTao").show();   // 成套
            $("#yzxdBiaoTi font").text("成套医嘱下达");
            $("#buttonConfirm").show();
            $("#yzxdTwoJiHeight").hide();
            $("#yzxd-name").attr("name", $("#buttonBack").attr("data-ctxmID")).text($("#buttonBack").attr("data-ctName"));
            $("#buttonBack").attr("data-state", ""); // 清空成套返回状态
        } else if ($("#yzxdBiaoTi font").text() == "医嘱编辑") {
            $(".yzxdKongJian").hide();  // 所有控件隐藏
            $("#yzxdTwoJi").hide();     // 医嘱下达二级隐藏
            $("#yzxdBiaoTi").hide();    // 医嘱下达顶部标题隐藏
            $("#yzxdDaiBaoCun").show(); // 待保存块显示
            $("#yzdbcBiaoTi").show();   // 待保存块顶部显示
            $("#yzdbcBiaoTi").find(".buttonTop").show();  // 待保存块里面的标题按钮显示
            $(".medicareBox").show();                     // 医保选项块显示

            $("#newOd-ButtonYBZJ").addClass("buttonNoEdit");  // 一并追加按钮默认不可操作
            $("#newOd-TextYBZJ").addClass("textNoEdit");      // 一并追加按钮默认不可操作
        } else {
            $("#yzxdTwoJi").hide();
            $("#buttonBack").hide();
            $("#buttonConfirm").hide();
            $(".yzxdKongJian").hide();
            $("#yzxdOneJi").show();
            $("#yzxdCL").show();
            $("#yzxdBiaoTi font").text("医嘱下达");
            // 根据检查按钮判断之前加载的是长期还是临时医嘱
            $("#yzxdCL li").removeClass("active");
            if ($("#yzOptionJC").hasClass("JY"))
                $("#yzxdCL li:first").addClass("active");
            else
                $("#yzxdCL li:last").addClass("active");
        }
    });

    //医嘱下达 二级转三级
    hammeryzxdTwoToShree = $("#yzxdYaoNR > li").hammer();
    hammeryzxdTwoToShree.on('tap', function (ev) {
        if ($(this).hasClass("eventQY")) {
            var zhi = $(this).find(".UlBt").text();
            var a = $(window).height();
            //$(".yzxdKJ").css("height",a-130);
            $("#nrJCXM li").removeClass("active");
            $("#yzxdYaoNR > li").removeClass('xuanThis textLR');
            switch (zhi) {
                case "紧急":
                    if ($(this).children("#icnYes").is(":hidden")) {
                        $("#icnYes").show();
                    } else {
                        $("#icnYes").hide();
                    }
                    break;
                case "开始时间":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#startTime").show();
                    dateTime.dateTimeScroll($("#appDateTime").text(), "startTime");
                    break;

                case "给药途径":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    //dataLoad.loadGeiYaoTuJing();
                    $("#yzxdGYTJ").show();
                    //$(".yzxdKJ").css("height",a-310);
                    $("#inputEglish").text('按拼音简码检索');
                    gytjkeyboardshow();
                    $("#yzxdGYTJ ul li:first").css("border-top", "1px solid #51525d");
                    break;
                case "滴速":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#yzxdDS").show();
                    //滴速动画
                    $("#yzxdDS li").on("touchstart touchmove", function () {
                        utils.CpStartback($(this));
                    });
                    $("#yzxdDS li").on("touchend", function () {
                        utils.CpEnd($(this));
                    });

                    break;
                case "执行频率":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#yzxdZXPL").show();
                    $("#yzxdZXPL ul li:first").css("border-top", "1px solid #51525d");
                    break;
                case "采集方法":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#yzxdCJFF").show();
                    $("#yzxdCJFF ul li:first").css("border-top", "1px solid #51525d");
                    //动画
                    $("#yzxdCJFF li").on("touchstart touchmove", function () {
                        utils.CpStartback($(this));
                    });
                    $("#yzxdCJFF li").on("touchend", function () {
                        utils.CpEnd($(this));
                    });
                    break;
                case "时间方案":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#timePlan").show();
                    $("#timePlan .countbox-botton").removeClass("countboxActive countboxJY").addClass("yes");
                    // 如果输入格式有/，则禁用0按钮
                    if ($("#timePlan .timeJG").text().indexOf("/") != -1) {
                        $("#countbox-botton0").removeClass("yes").addClass("countboxJY");
                    }
                    // 默认选中 每日第一个Li
                    $("#timePlan ul li").removeClass("item");
                    $("#timePlan ul li label").removeClass("active");
                    $("#timePlan_MRUL li:first").addClass("item");
                    $("#timePlan_MRUL li:first label").addClass("active");
                    utils.emptyTimePlanJG();
                    //时间方案执行判断函数
                    sjfaPandun();
                    if ($("#timePlan li").length == 1) {
                        $("#countbox-Next").text("完成");
                    } else {
                        $("#countbox-Next").text("下一步");
                    }
                    break;
                case "单量":
                    dlClickNo = 0; // 单量点击次数
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#boxCount").show();
                    if ($(this).children("span").attr("id") == "zybzjlxsundefined" || $(this).children("span").attr("id") == "zybzjlxsnull") {
                        $("#countbox-x1").hide();
                        $("#countbox-x2").hide();
                        $("#countbox-x3").hide();
                    } else {
                        $("#countbox-x1").show();
                        $("#countbox-x2").show();
                        $("#countbox-x3").show();
                    }
                    break;
                case "总量":
                    zlClickNo = 0;
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#totalFunction").show();
                    break;
                case "天数":
                    tsClickNo = 0;
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#NumberOfDaysFunction").show();
                    break;
                case "执行性质":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#yzxdZXXZ").show();
                    $("#yzxdZXXZ ul li:first").css("border-top", "1px solid #51525d");
                    if($("#yzxdCL .active").text() == '长期医嘱'){
                        if($("#yzxdZXXZ ul li:eq(2)").text() == '自取药'){
                            $("#yzxdZXXZ ul li:eq(2)").remove();
                            $("#yzxdZXXZ ul li:eq(2)").remove();
                        }
                    }else{
                        if($("#yzxdZXXZ ul li:eq(2)").text() != '自取药'){
                            $("#yzxdZXXZ ul").append('<li>自取药</li><li>离院带药</li>');

                        }
                    }
                    break;
                case "执行科室":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    if ($("#yzxdZXKS ul").find("li").length > 0) {
                        $("#yzxdZXKS").show();
                        $("#yzxdZXKS ul li:first").css("border-top", "1px solid #51525d");
                    }
                    // 执行科室动画
                    $("#yzxdZXKS li").on("touchstart touchmove", function () {
                        utils.CpStartback($(this));
                    });
                    $("#yzxdZXKS li").on("touchend", function () {
                        utils.CpEnd($(this));
                    });

                    break;
                case "给药执行":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#yzxdGYZX").show();
                    $("#yzxdGYZX ul li:first").css("border-top", "1px solid #51525d");
                    if ($(this).find("span").text() == "请选择") {
                        $(this).find("span").addClass("text-red");
                    } else {
                        $(this).find("span").removeClass("text-red");
                    }

                    //动画示意
                    $("#yzxdGYZX li").on("touchstart touchmove", function () {
                        utils.CpStartback($(this));
                    });
                    $("#yzxdGYZX li").on("touchend", function () {
                        utils.CpEnd($(this));
                    });
                    break;
                case "采集科室":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#yzxdCJKS").show();
                    $("#yzxdCJKS ul li:first").css("border-top", "1px solid #51525d");
                    //动画yzxdCJKS
                    $("#yzxdCJKS li").on("touchstart touchmove", function () {
                        utils.CpStartback($(this));
                    });
                    $("#yzxdCJKS li").on("touchend", function () {
                        utils.CpEnd($(this));
                    });
                    break;
                case "发药药房":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#yzxdFYYF").show();
                    $("#yzxdFYYF ul li:first").css("border-top", "1px solid #51525d");

                    //发药药房动画示意
                    $("#yzxdFYYF li").on("touchstart touchmove", function () {
                        utils.CpStartback($(this));
                    });
                    $("#yzxdFYYF li").on("touchend", function () {
                        utils.CpEnd($(this));
                    });
                    break;
                case "医生嘱托":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    //$(".yzxdKJ").css("height","auto");
                    $("#yzxdYSZT").show();
                    $("#yzxdYSZT .textareaDiv").text($("#doctorTell span").text());
                    $("#yzxdYaoNR .sqfx").removeClass("textLR");   // 取消申请副项的录入状态
                    $(this).addClass("textLR");
                    $("#yzxdYSZT .textareaDiv").on("touchstart touchmove", function () {
                        utils.CpStartback($(this));
                    });
                    $("#yzxdYSZT .textareaDiv").on("touchend", function () {
                        utils.CpEnd($(this));
                    });
                    break;
                case "用药目的":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#yzxdYYMD").show();
                    break;
                case "用药理由":
                    $(this).addClass('xuanThis');
                    $(".yzxdKongJian").hide();
                    $("#yzxdYSZT").show();
                    $("#yzxdYSZT .textareaDiv").text($("#reason span").text());
                    $("#yzxdYaoNR .sqfx").removeClass("textLR");   // 取消申请副项的录入状态
                    $(this).addClass("textLR");
					$("#yzxdYSZT .textareaDiv").on("touchstart touchmove", function () {
                        utils.CpStartback($(this));
                    });
                    $("#yzxdYSZT .textareaDiv").on("touchend", function () {
                        utils.CpEnd($(this));
                    });
                    break;
					
				
            }
        }
    });

    // 单量计算器
    var hammertime = $('#countButton > div').hammer();
    hammertime.on("tap", function (ev) {
        //$('#countButton > div').on("touchstart",function(){

        utils.audioPlay();

        dlClickNo = dlClickNo + 1;
        var zhi;

        // 当点击.时，数字+.
        if ($(this).text() === ".") {
            if ($("#countResult").text().toString().indexOf(".") === -1) {
                if ($("#countResult").text() >= 9999) {
                    utils.showHide("数字太大噢！");
                } else {
                    zhi = $("#countResult").text() + ".";
                }
            } else {
                zhi = $("#countResult").text();
            }
            // 当点击 x1，单量+单量
        } else if ($(this).text() === "x1") {
            zhi = $("#Milligram span").attr("id").replace('zybzjlxs', "") * 1;
            if (zhi.toString().indexOf(".") != -1) {
                zhi = parseFloat(zhi).toFixed(2);
            }
            dlClickNo = 0;
            // 当点击 x2，单量*2
        } else if ($(this).text() === "x2") {
            zhi = $("#Milligram span").attr("id").replace('zybzjlxs', "") * 2;
            if (zhi.toString().indexOf(".") != -1) {
                zhi = parseFloat(zhi).toFixed(2);
            }
            dlClickNo = 0;

            // 当点击 x3，单量*3
        } else if ($(this).text() === "x3") {
            zhi = $("#Milligram span").attr("id").replace('zybzjlxs', "") * 3;
            if (zhi.toString().indexOf(".") != -1) {
                zhi = parseFloat(zhi).toFixed(2);
            }
            dlClickNo = 0;
            // 当点击x时，一位一位的减少直到为0
        } else if ($(this).children("span").length > 0) {
            zhi = 0;
            // 按其它数字
        } else {
            zhi = $("#countResult").html().toString();
            var a = zhi.substr(zhi.length - 1, 1);
            //当最后一位是.时
            if (a === ".") {
                zhi = $("#countResult").text() + $(this).text();
                //当数字大于0时
            } else if ($("#countResult").html() > 0) {
                //当大于9999时，不执行
                if (dlClickNo > 1) {  // 如果点击了超过1次
                    if ($("#countResult").html() + $(this).text() > 9999) {
                        utils.showHide("数字太大噢！");
                    } else {
                        zhi = $("#countResult").html() + $(this).text();
                    }
                } else {
                    zhi = $(this).text();
                }
                //否则直接变成该数字
            } else {
                zhi = $(this).text();
            }
        }
        $("#countResult").text(zhi); // 更新至计算器顶部的结果

        //更新至单量一栏 若小于或者等于0则是红色
        if (zhi > 0) {
            $("#Milligram span").text(zhi).removeClass("text-red");
            utils.calculateTotal();
        } else {
            $("#Milligram span").text(0).addClass("text-red");
        }
    });

    // 执行性质
    hammeryzxdZXXZ = $("#yzxdZXXZ ul li").hammer();
    hammeryzxdZXXZ.on("tap", function (ev) {
        $("#yzxdZXXZ ul li").css("background", "rgb(40, 42, 57)");
        $(this).css("background", "rgb(81, 82, 93)");
        $("#PerformTheNature > span").text($(this).text()).removeClass("text-red");
        if($(this).text() == '离院带药'){
            $("#ToPerform span").attr("data-gyzxid","").text("-");
        }else{
            $("#ToPerform span").attr("data-gyzxid",$("#yzxdGYZX-UL li:first").attr("data-gyzxid")).text($("#yzxdGYZX-UL li:first").text());
        }
    });

    //执行性质 动画
    $("#yzxdZXXZ li").on("touchstart touchmove", function () {
        utils.CpStartback($(this));
    });
    $("#yzxdZXXZ li").on("touchend", function () {
        utils.CpEnd($(this));
    });
    // 滴速
    var hammerDiSu = $("#yzxdDS ul li").hammer();
    hammerDiSu.on("tap", function () {
        $("#yzxdDS ul li").css("background", "rgb(40, 42, 57)");
        $(this).css("background", "rgb(81, 82, 93)");
        $("#diSu > input").val($(this).text()).removeClass("text-red");
    });

    // 医生嘱托
    var hammertextareaDiv = $("#yzxdYSZT .textareaDiv").hammer();
    hammertextareaDiv.on("tap", function () {
		$("#yzxdYSZT .textareaDiv").on("touchstart touchmove", function () {
                        utils.CpStartback($(this));
                    });
                    $("#yzxdYSZT .textareaDiv").on("touchend", function () {
                        utils.CpEnd($(this));
                    });
        if ($(this).text() == "请填写") {
            $(this).text("");
			
        }
    });

    hammeryzxdYSZTButton = $("#yzxdYSZTButton").hammer();
    hammeryzxdYSZTButton.on("tap", function (ev) {
        if ($("#yzxdYSZT .textareaDiv").text() != "" && $("#yzxdYSZT .textareaDiv").text() != "请填写") {
            $(".textLR span").text($("#yzxdYSZT .textareaDiv").text()).removeClass("text-red");
            $("#yzxdYSZT").hide();
            $(".textLR").css("background", "#fff");
        } else {
            $(".textLR span").text("请填写").addClass("text-red");
        }
    });

    // 时间方案
    hammerytimePlan = $("#timePlan .countbox-botton").hammer();
    hammerytimePlan.on("tap", function (ev) {
        //$("#timePlan .countbox-botton").on('touchstart', function(event) {
        //debugger;
        if ($(this).hasClass("yes")) {
            utils.audioPlay();
            $("#timePlan .countbox-botton").removeClass("countboxActive countboxJY").addClass("yes");
            $(this).addClass("countboxActive");

            var thisText = $(this).text();
            var timeText = $("#timePlan .timeJG").text();
            var fenZhong1 = timeText.split(":")[1];
            var fenZhong2 = timeText.split(":")[1].split("")[1];
            if (thisText == 1 || thisText == 2 || thisText == 3 || thisText == 4 || thisText == 5 || thisText == 6 || thisText == 7 || thisText == 8 || thisText == 9 || thisText == 0 && thisText != "") {

                // 如果包含/，并且day已经输入，并且小时未输入，并且输入值大于2
                if (timeText.indexOf("/") != -1 && timeText[0] != "_" && timeText[2] == "_" && thisText > 2) {
                    $("#timePlan .timeJG").text(timeText.replace('_', 0));
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', thisText));
                    // 更新后面两位为0
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', 0));
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', 0));

                    // 如果包含/，并且day已经输入，并且小时未输入，并且输入值完全等于2
                } else if (timeText[0] != "_" && timeText.indexOf("/") != -1 && timeText[2] == "_" && thisText == 2) {
                    $("#timePlan .timeJG").text(timeText.replace('_', thisText));
                    $("#countbox-botton4").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton5").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton6").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton7").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton8").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton9").addClass("countboxJY").removeClass("yes");

                    // 如果包含/，并且小时第一位已经输入,并且小时第二位未输入，并且分钟未输入
                } else if (timeText.indexOf("/") != -1 && timeText[2] != "_" && timeText[3] == "_" && timeText[5] == "_" && timeText[6] == "_") {
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', thisText));
                    // 更新后面两位为0
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', 0));
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', 0));
                    if ($("#timePlan .timeJG").text() == "2_:__") {
                        $("#timePlan .countbox-botton:gt(3)").addClass("countboxJY").removeClass("yes");
                        $("#timePlan .countbox-botton:gt(8)").addClass("yes").removeClass("countboxJY");
                    } else {
                        $("#timePlan .countbox-botton:gt(3)").addClass("yes").removeClass("countboxJY");
                    }


                    // 如果包含/，并且分钟数未输入，并且小时数已输入，并且输入值大于5，则直接更新为0+N
                } else if (timeText.indexOf("/") != -1 && timeText[5] == "_" && timeText[6] == "_" && timeText[2] != "_" && timeText[3] != "_" && thisText > 5) {
                    $("#timePlan .timeJG").text(timeText.replace('_', 0));
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', thisText));
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().split(":")[0] + ":0" + thisText);

                    // 如果不包含/，并且小时未输入，并且输入值大于2
                } else if (timeText.indexOf("/") == -1 && timeText[0] == "_" && thisText > 2) {
                    $("#timePlan .timeJG").text(timeText.replace('_', 0));
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', thisText));
                    // 更新后面两位为0
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', 0));
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', 0));

                    // 如果不包含/，并且小时未输入，并且输入值完全等于2
                } else if (timeText.indexOf("/") == -1 && timeText[0] == "_" && thisText == 2) {
                    $("#timePlan .timeJG").text(timeText.replace('_', thisText));
                    $("#countbox-botton4").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton5").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton6").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton7").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton8").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton9").addClass("countboxJY").removeClass("yes");

                    // 如果不包含/，并且小时第一位已经输入，并且小时第二位未输入，并且分钟未输入
                } else if (timeText.indexOf("/") == -1 && timeText[0] != "_" && timeText[1] == "_" && timeText[3] == "_" && timeText[4] == "_") {
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', thisText));
                    // 更新后面两位为0
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', 0));
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', 0));
                    if ($("#timePlan .timeJG").text() == "2_:__") {
                        $("#timePlan .countbox-botton:gt(3)").addClass("countboxJY").removeClass("yes");
                        $("#timePlan .countbox-botton:gt(8)").addClass("yes").removeClass("countboxJY");
                    } else {
                        $("#timePlan .countbox-botton:gt(2)").addClass("yes").removeClass("countboxJY");
                    }

                    // 如果不包含/，并且分钟数未输入，并且小时数已经输入，并且输入值大于5，则直接更新为0+N
                } else if (timeText.indexOf("/") == -1 && timeText[3] == "_" && timeText[4] == "_" && timeText[0] != "_" && timeText[1] != "_" && thisText > 5) {
                    $("#timePlan .timeJG").text(timeText.replace('_', 0));
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().replace('_', thisText));
                    $("#timePlan .timeJG").text($("#timePlan .timeJG").text().split(":")[0] + ":0" + thisText);


                    // 如果分钟数为00
                } else if (fenZhong1 == "00" || fenZhong2 == "0") {
                    if (thisText > 5 && fenZhong1 == "00")
                        $("#timePlan .timeJG").text(timeText.split(":")[0] + ":0" + timeText.split(":")[1].split("")[1].replace('0', thisText));
                    else
                        $("#timePlan .timeJG").text(timeText.split(":")[0] + ":" + timeText.split(":")[1].replace('0', thisText));
                } else {
                    $("#timePlan .timeJG").text(timeText.replace('_', thisText));
                }

                // 检查是否输入完毕，如果输入完毕，则将下一步变成完成按钮
                var labelEachLength = utils.eachMRSR(); // 计算录入完毕的li数量
                if (labelEachLength == $("#timePlan ul li").length - 1 || labelEachLength == $("#timePlan ul li").length) {
                    $("#countbox-Next").text("完成");
                } else {
                    $("#countbox-Next").text("下一步");
                }

                // 点下一步
            } else if (thisText == "下一步" || thisText == "完成") {

                // 更新输入结果到选中的li中
                if ($("#timePlan .timeJG").text().indexOf("_") == -1) {
                    $("#timePlan .countbox-botton").addClass("yes").removeClass("countboxJY");
                    // 将录入的数据更新到选中的首日或每日的LI的label中
                    var jgText = '', dayT = '', timeT = '';
                    if ($("#timePlan .timeJG").text().indexOf("/") != -1) {
                        jgText = $("#timePlan .timeJG").text().split("/");
                        dayT = jgText[0];
                        timeT = jgText[1];
                    } else {
                        timeT = $("#timePlan .timeJG").text();
                    }

                    $("#timePlan ul .item .day").text(dayT);
                    $("#timePlan ul .item .time").text(timeT);
                }

                /*// 如果选中每日最后一个，并且有首日，可以选择完成 
                if( $("#timePlan_MRUL li:last").hasClass("item") && !$("#timePlan_SRUL").hasClass("display-none") ){
                    // 给首日追加label
                    if($("#timePlan_SRUL li:first").find("label").length < 1){
                        if($("#timePlan .timeJG").text().indexOf("/")!=-1){
                            $("#timePlan_SRUL li:first").append('<label class="day">_</label><label class="time">__:__</label>');
                        }else{
                            $("#timePlan_SRUL li:first").append('<label class="time">__:__</label>');	
                        }
                    }
    
                    $("#timePlan_MRUL li:last").removeClass("item");
                    $("#timePlan_MRUL li:last label").removeClass("active");
                    $("#timePlan_SRUL li:first").addClass("item");
                    $("#timePlan_SRUL li:first label").addClass("active");
                	
                    // 清空时间方案输入结果
                    utils.emptyTimePlanJG();
    
                    if($("#timePlan_MRUL li:last .day").text()!="_" && $("#timePlan_MRUL li:last .time").text()!="__:__" ){
                        $("#yzxdYaoNR li").removeClass('xuanThis');					
                        $("#timePlan").hide();
                        //$("#Milligram").addClass('xuanThis');//选择有问题
                        //$("#boxCount").show();
                    }else{
                        $("#timePlan_MRUL li").each(function(){
                            $("#timePlan .countbox-botton").addClass("yes").removeClass("countboxJY");
                            if($(this).children(".day").text()=="_" || $(this).children(".time").text()=="__:__"){
                                $("#timePlan_MRUL li").removeClass("item");
                                $("#timePlan_MRUL li label").removeClass("active");
                                $(this).addClass("item");
                                $(this).children("label").addClass("active");
                                return false;
                            }
                        });
                    }
                	
                // 如果选中每日最后一个，没首日，则判断是否录入完毕，完毕则跳到下一个医嘱内容录入，未完毕则选中未完成的第一个li
                }elseif( $("#timePlan_MRUL li:last").hasClass("item") && $("#timePlan_SRUL").hasClass("display-none") ){ */
                //无论有没有没首日，只要光标在每日最后一个录入完成即可完成
                if ($("#timePlan_MRUL li:last").hasClass("item")) {

                    if ($("#timePlan_MRUL li:last .day").text() != "_" && $("#timePlan_MRUL li:last .time").text() != "__:__") {
                        $("#yzxdYaoNR li").removeClass('xuanThis');
                        $("#timePlan").hide();
                        /*$("#Milligram").addClass('xuanThis');//选择有问题
                        $("#boxCount").show();*/
                    } else {
                        $("#timePlan_MRUL li").each(function () {
                            $("#timePlan .countbox-botton").addClass("yes").removeClass("countboxJY");
                            if ($(this).children(".day").text() == "_" || $(this).children(".time").text() == "__:__") {
                                $("#timePlan_MRUL li").removeClass("item");
                                $("#timePlan_MRUL li label").removeClass("active");
                                $(this).addClass("item");
                                $(this).children("label").addClass("active");
                                return false;
                            }
                        });
                    }

                    // 如果选中首日最后一个，则判断每日首日是否录入完毕，完毕则跳到下一个医嘱内容录入，未完毕则选中未完成的第一个每日li或第一个首日li
                } else if ($("#timePlan_SRUL li:last").hasClass("item")) {
                    var labelLength = utils.eachMRSR(); // 计算录入完毕的li数量
                    if (labelLength == $("#timePlan ul li").length) {
                        $("#yzxdYaoNR li").removeClass('xuanThis');
                        $("#timePlan").hide();
                        /*$("#Milligram").addClass('xuanThis'); //选择有问题
                        $("#boxCount").show();*/
                    } else {
                        $("#timePlan ul li").each(function () {
                            // 如果没有label，类似于首日没有默认值的情况
                            if ($(this).find("label").length < 1) {
                                //console.log("没有Label");
                                if ($("#timePlan .timeJG").text().indexOf("/") != -1) {
                                    $(this).append('<label class="day">_</label><label class="time">__:__</label>');
                                } else {
                                    $(this).append('<label class="time">__:__</label>');
                                }
                                $("#timePlan ul li").removeClass("item");
                                $("#timePlan ul li label").removeClass("active");
                                $(this).addClass("item");
                                $(this).find("label").addClass("active");
                                return false;
                            }
                            // 如果day或者time未输入完毕
                            if ($(this).children(".day").text() == "_" || $(this).children(".time").text() == "__:__") {
                                //console.log("空label");
                                $("#timePlan ul li").removeClass("item");
                                $("#timePlan ul li label").removeClass("active");
                                $(this).addClass("item");
                                $(this).find("label").addClass("active");
                                return false;
                            }
                        });
                    }

                    // 否则，则将选中的li去掉item，下一个li增加item
                } else {
                    // 如果当前选中已录入完毕 
                    if (($("#timePlan ul .item").find(".day").length > 0 && $("#timePlan ul .item").find(".day").text() != "_") || ($("#timePlan ul .item").find(".time").length > 0 && $("#timePlan ul .item").find(".time").text() != "__:__")) {
                        // 如果下一个没有Label
                        if ($("#timePlan ul .item").next().find("label").length < 1) {
                            //console.log("下一个不正常");
                            $("#timePlan ul li label").removeClass("active");
                            if ($("#timePlan .timeJG").text().indexOf("/") != -1) {
                                $("#timePlan ul .item").next().append('<label class="day active">' + '_' + '</label><label class="time active">' + '__:__' + '</label>');
                            } else {
                                $("#timePlan ul .item").next().append('<label class="time active">' + '__:__' + '</label>');
                            }
                            $("#timePlan ul .item").next().addClass("item");
                            $("#timePlan ul .item:first").removeClass("item");

                            // 否则直接选中下一个
                        } else {
                            //console.log("下一个正常");
                            $("#timePlan ul li label").removeClass("active");
                            $("#timePlan ul .item").next().addClass("item");
                            $("#timePlan ul .item:first").removeClass("item");
                            $("#timePlan ul .item").find("label").addClass("active");
                        }
                    }
                    utils.emptyTimePlanJG();
                }

                // 检查是否输入完毕，如果输入完毕，则将下一步变成完成按钮
                var labelLengthEach = utils.eachMRSR(); // 计算录入完毕的li数量
                if (labelLengthEach == $("#timePlan ul li").length - 1 || (labelLengthEach == $("#timePlan ul li").length && !$("#timePlan_SRUL").hasClass("display-none") && ($("#timePlan_SRUL li:last").prev().hasClass("item") || $("#timePlan_SRUL li:last").hasClass("item"))) || (labelLengthEach == $("#timePlan ul li").length && $("#timePlan_SRUL").hasClass("display-none") && ($("#timePlan_MRUL li:last").prev().hasClass("item") || $("#timePlan_MRUL li:last").hasClass("item")))) {
                    $("#countbox-Next").text("完成");
                } else {
                    $("#countbox-Next").text("下一步");
                }

                if (labelLengthEach == $("#timePlan ul li").length) {
                    // 将输入结果整理成标准字符串放在时间方案内
                    var strDaySR = [];
                    var strTimeSR = [];
                    var strSR = "";
                    var strDayMR = [];
                    var strTimeMR = [];
                    var strMR = "";
                    var strJG = "";
                    if (!$("#timePlan_SRUL").hasClass("display-none")) {
                        $("#timePlan_SRUL li").each(function () {
                            // day
                            if ($(this).find(".day").length > 0) {
                                strDaySR.push($(this).find(".day").text());
                            } else {
                                strDaySR.push("");
                            }
                            // time
                            if ($(this).find(".time").length > 0) {
                                var timeDelSR = $(this).find(".time").text().split(":");
                                if (timeDelSR[1] == "00") {
                                    timeDelSR.pop();
                                    if (timeDelSR[0] < 10 && timeDelSR[0].toString().length > 1)
                                        strTimeSR.push(timeDelSR[0].split("")[1]);
                                    else
                                        strTimeSR.push(timeDelSR[0]);
                                } else {
                                    if ($(this).find(".time").text().split(":")[0] < 10 && $(this).find(".time").text().split(":")[0].toString().length > 1)
                                        strTimeSR.push($(this).find(".time").text().split(":")[0].split("")[1] + ":" + $(this).find(".time").text().split(":")[1]);
                                    else
                                        strTimeSR.push($(this).find(".time").text());
                                }
                            } else {
                                strTimeSR.push("");
                            }
                        });
                    }

                    $("#timePlan_MRUL li").each(function () {
                        // day
                        if ($(this).find(".day").length > 0) {
                            strDayMR.push($(this).find(".day").text());
                        } else {
                            strDayMR.push("");
                        }
                        // time
                        if ($(this).find(".time").length > 0) {
                            var timeDelMR = $(this).find(".time").text().split(":");
                            if (timeDelMR[1] == "00") {
                                timeDelMR.pop();
                                if (timeDelMR[0] < 10 && timeDelMR[0].toString().length > 1)
                                    strTimeMR.push(timeDelMR[0].split("")[1]);
                                else
                                    strTimeMR.push(timeDelMR[0]);
                            } else {
                                if ($(this).find(".time").text().split(":")[0] < 10 && $(this).find(".time").text().split(":")[0].toString().length > 1)
                                    strTimeMR.push($(this).find(".time").text().split(":")[0].split("")[1] + ":" + $(this).find(".time").text().split(":")[1]);
                                else
                                    strTimeMR.push($(this).find(".time").text());
                            }
                        } else {
                            strTimeMR.push("");
                        }
                    });

                    for (var srmri = 0; srmri < $("#timePlan_MRUL li").length; srmri++) {
                        if (strDaySR[srmri] !== "") {
                            strSR = (strSR + (strDaySR[srmri] == "_" ? "" : strDaySR[srmri] + "/"));
                        }
                        if (strTimeSR[srmri] !== "") {
                            if (srmri == $("#timePlan_MRUL li").length - 1 || $("#timePlan_MRUL li").length == 1) {
                                strSR = (strSR + (strTimeSR[srmri] == "__:__" ? "" : strTimeSR[srmri]));
                            } else {
                                strSR = (strSR + (strTimeSR[srmri] == "__:__" ? "" : strTimeSR[srmri] + "-"));
                            }
                        }
                        if (strDayMR[srmri] !== "") {
                            strMR = (strMR + (strDayMR[srmri] == "_" ? "" : strDayMR[srmri] + "/"));
                        }
                        if (strTimeMR[srmri] !== "") {
                            if (srmri == $("#timePlan_MRUL li").length - 1 || $("#timePlan_MRUL li").length == 1) {
                                strMR = (strMR + (strTimeMR[srmri] == "__:__" ? "" : strTimeMR[srmri]));
                            } else {
                                strMR = (strMR + (strTimeMR[srmri] == "__:__" ? "" : strTimeMR[srmri] + "-"));
                            }
                        }
                    }

                    if ($("#timePlan_SRUL").hasClass("display-none")) {
                        strJG = strMR;
                    } else {
                        if (strSR === "") {
                            strJG = strMR;
                        } else {
                            strJG = strSR + "," + strMR;
                        }

                    }

                    if (strJG != "") {
                        $("#TimeToPlan span").text(strJG).removeClass("text-red");
                    } else {
                        $("#TimeToPlan span").text("请录入").addClass("text-red");
                    }
                } // labelLengthEach == $("#timePlan ul li").length
                //执行频率为天 有天数输入
                var xiaoshi = $("#executeHz span").attr("data-JGDW");
                var geshu = $("#executeHz span").attr("data-PLJG");
                if ($("#timePlan .timeJG").text().indexOf("/") != -1) {
                    if (xiaoshi == "天" && geshu > 1) {
                        var tskz = geshu - 1;
                        if ($("#timePlan .timeJG").text() == "_/__:__") {
                            $("#timePlan .countbox-botton:gt(" + tskz + ")").addClass("countboxJY").removeClass("yes");
                            $("#timePlan .countbox-botton:gt(9)").addClass("yes").removeClass("countboxJY");
                        } else {
                            $("#timePlan .countbox-botton").addClass("yes").removeClass("countboxJY");
                        }
                    }
                }

                // 点叉叉
            } else {
                var arr = [];
                for (var cci = 0; cci < timeText.length; cci++) {
                    arr.push(timeText[cci]);
                }
                for (var ccii = arr.length - 1; ccii >= 0; ccii--) {
                    if (arr[ccii] != ":" && arr[ccii] != "_" && arr[ccii] != "/") {
                        arr[ccii] = "_";
                        break;
                    }
                }
                $("#timePlan .timeJG").text(arr.join(""));

                // 如果有/，并且day未输入，则禁用0
                if (arr.indexOf("/") != -1 && arr[0] == "_") {
                    $("#countbox-botton0").addClass("countboxJY").removeClass("yes");
                }
                if ($("#timePlan .timeJG").text() == "2_:__") {
                    $("#timePlan .countbox-botton:gt(2)").addClass("countboxJY").removeClass("yes");

                    $("#timePlan .countbox-botton:gt(8)").addClass("yes").removeClass("countboxJY");
                } else {
                    $("#timePlan .countbox-botton").addClass("yes").removeClass("countboxJY");
                }
                //有天数输入
                if ($("#timePlan .timeJG").text().indexOf("/") != -1) {
                    if ($("#timePlan .timeJG").text().split("/")[1] == "2_:__") {
                        $("#timePlan .countbox-botton:gt(2)").addClass("countboxJY").removeClass("yes");

                        $("#timePlan .countbox-botton:gt(8)").addClass("yes").removeClass("countboxJY");
                    } else {
                        $("#timePlan .countbox-botton").addClass("yes").removeClass("countboxJY");
                    }
                    //执行频率天 有天数输入
                    var xiaoshi = $("#executeHz span").attr("data-JGDW");
                    var geshu = $("#executeHz span").attr("data-PLJG");
                    if (xiaoshi == "天" && geshu > 1) {
                        var tskz = geshu - 1
                        if ($("#timePlan .timeJG").text() == "_/__:__") {
                            $("#timePlan .countbox-botton:gt(" + tskz + ")").addClass("countboxJY").removeClass("yes");
                            $("#timePlan .countbox-botton:gt(9)").addClass("yes").removeClass("countboxJY");
                        } else {
                            $("#timePlan .countbox-botton").addClass("yes").removeClass("countboxJY");
                        }
                    }

                }

                // 如果小时为24，并且分钟未输入，则禁用123456789
                if ((arr.indexOf("/") == -1 && arr[0] + arr[1] == 24) || (arr.indexOf("/") != -1 && arr[2] + arr[3] == 24)) {
                    $("#countbox-botton1").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton2").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton3").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton4").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton5").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton6").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton7").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton8").addClass("countboxJY").removeClass("yes");
                    $("#countbox-botton9").addClass("countboxJY").removeClass("yes");
                }
            }



        }
        if ($("#executeHz span").attr("data-JGDW") == "小时")
            sjfaPandun();
    });
    //时间方案输入判断
    function sjfaPandun() {
        var xiaoshi = $("#executeHz span").attr("data-JGDW");
        var geshu = $("#executeHz span").attr("data-PLJG");
        $("#timePlan .countbox-botton").removeClass("countboxActive countboxJY").addClass("yes");
        if (xiaoshi == "小时") {

            if (geshu < 10) {
                if ($("#timePlan .timeJG").text() == "__:__") {
                    $("#timePlan .timeJG").text('0_:__');
                }
                var theInput = $("#timePlan .timeJG").text();
                var caifen = theInput.split(":");
                var houer = caifen[0].replace("0", "");
                var n = geshu - 1;
                if (caifen[0] == "0_") {
                    $("#timePlan .countbox-botton:gt(" + n + ")").addClass("countboxActive countboxJY").removeClass("yes");
                    $("#timePlan .countbox-botton:gt(8)").removeClass("countboxActive countboxJY").addClass("yes");
                } else {
                    $("#timePlan .countbox-botton").removeClass("countboxActive countboxJY").addClass("yes");
                }
                if (geshu == houer) {
                    // $("#timePlan .countbox-botton:lt(9)").addClass("countboxActive countboxJY").removeClass("yes");
                    $("#timePlan .countbox-botton").removeClass("countboxActive countboxJY").addClass("yes");
                }
            } else {
                var fenjie = geshu.split("");
                var xianshi = $("#timePlan .timeJG").text();
                var caikai = xianshi.split(":");
                var m = fenjie[1] - 1;
                if (geshu < 20 && geshu >= 10) {
                    if (xianshi == "__:__") {
                        $("#timePlan .countbox-botton").eq(1).addClass("countboxActive countboxJY").removeClass("yes");
                    } else if (xianshi == "1_:__") {
                        $("#timePlan .countbox-botton:gt(" + m + ")").addClass("countboxActive countboxJY").removeClass("yes");
                        $("#timePlan .countbox-botton:gt(8)").removeClass("countboxActive countboxJY").addClass("yes");
                    } else {
                        $("#timePlan .countbox-botton").removeClass("countboxActive countboxJY").addClass("yes");
                    }
                } else if (geshu < 24 && geshu >= 20) {
                    if (xianshi == "2_:__") {
                        $("#timePlan .countbox-botton:gt(" + m + ")").addClass("countboxActive countboxJY").removeClass("yes");
                        $("#timePlan .countbox-botton:gt(8)").removeClass("countboxActive countboxJY").addClass("yes");
                    } else {
                        $("#timePlan .countbox-botton").removeClass("countboxActive countboxJY").addClass("yes");
                    }
                } else if (geshu >= 24) {
                    if (xianshi == "2_:__") {
                        $("#timePlan .countbox-botton:gt(2)").addClass("countboxActive countboxJY").removeClass("yes");
                        $("#timePlan .countbox-botton:gt(8)").removeClass("countboxActive countboxJY").addClass("yes");
                    } else {
                        $("#timePlan .countbox-botton").removeClass("countboxActive countboxJY").addClass("yes");
                    }

                }
                if (caikai[0] == geshu) {
                    // $("#timePlan .countbox-botton:lt(9)").addClass("countboxActive countboxJY").removeClass("yes");
                    $("#timePlan .countbox-botton").removeClass("countboxActive countboxJY").addClass("yes");
                }
            }
        } else if (xiaoshi == "天" && geshu > 1) {
            var tskz = geshu - 1;
            if ($("#timePlan .timeJG").text() == "_/__:__") {
                $("#timePlan .countbox-botton:gt(" + tskz + ")").addClass("countboxJY").removeClass("yes");
                $("#timePlan .countbox-botton:gt(9)").addClass("yes").removeClass("countboxJY");
            } else {
                $("#timePlan .countbox-botton").addClass("yes").removeClass("countboxJY");
            }
        }


    }

    // 点击首日 每日
    $("#timePlan ul").on("click", "li span", function () {
        //debugger;
        // 更新输入结果到选中的li中
        if ($("#timePlan .timeJG").text().indexOf("_") == -1) {
            // 将录入的数据更新到选中的首日或每日的LI的label中
            var jgText = '', dayT = '', timeT = '';
            if ($("#timePlan .timeJG").text().indexOf("/") != -1) {
                jgText = $("#timePlan .timeJG").text().split("/");
                dayT = jgText[0];
                timeT = jgText[1];
            } else {
                timeT = $("#timePlan .timeJG").text();
            }
            $("#timePlan ul .item .day").text(dayT);
            $("#timePlan ul .item .time").text(timeT);
        }

        // 根据选择的LI 对默认时间增加背景颜色 或 追加输入时间的块
        $("#timePlan ul li label").removeClass("active");
        $("#timePlan ul li").removeClass("item");
        $(this).parent().addClass("item");
        if ($(this).parent().find("label").length > 0) {
            $(this).siblings("label").addClass("active");
        } else {
            if ($("#timePlan .timeJG").text().indexOf("/") != -1) {
                $(this).parent().append('<label class="day">' + '_' + '</label><label class="time">' + '__:__' + '</label>');
                $(this).siblings("label").addClass("active");
            } else {
                $(this).parent().append('<label class="time">' + '__:__' + '</label>');
                $(this).siblings("label").addClass("active");
            }
        }
        $("#timePlan .countbox-botton").removeClass("countboxActive countboxJY").addClass("yes");

        // 将输入结果的值改为空
        utils.emptyTimePlanJG();

    });

    // 医嘱下达 点击确定
    hammerbuttonConfirm = $("#buttonConfirm").hammer();
    hammerbuttonConfirm.on('tap', function (ev) {
        var jyxmsl = true;
        var jcxmsl = true;
        if (!$("#nrJYXM").is(":hidden")) {
            if ($("#nrJYXM li").length == 0) {
                jyxmsl = false;
            }
        }

        if (!$("#nrJCXM").is(":hidden")) {
            if ($("#nrJCXM li").length == 0 || $("#nrJCXM li").find(".text-red").length > 0) {
                jcxmsl = false;
            }
        }

        var sl = utils.eachDoctorActive();  // 检查必填是否录入完毕
        if (sl[0] == sl[1] && jyxmsl && jcxmsl) {
           // if (parseInt($('#total').children("span").text()) > parseInt(utils.getTotalDose())) {
             //   utils.showHide("本次总量大于库存数量，请切换药房！");
             //   return false;
          //  }
			if (parseInt($('#total').children("span").text()) > parseInt(utils.getTotalDose())&&jcxmsl==false&&jyxmsl==false) {
                utils.showHide("本次总量大于库存数量，请切换药房！");
                return false;
            }

            jcxm = [];
            jyxm = [];
            sqfx = [];

            // 删除对应的医保项目 只有编辑状态和检验项目才执行		
            if ($("#yzxd-name").hasClass("editState") && $("#yzxd-name").text().indexOf("标本：") !== -1) {
                var nowEditID = "dt" + $("#yzDBCButtonNR .active").attr("id");
                $("#" + nowEditID).find(".jyxmName").each(function () {
                    var dt = $(this);
                    var dtName = dt.text();
                    $("#nrJYXM li").each(function (i, v) {
                        var liName = $(this).children("div").text();
                        if (dtName == liName) return false;
                        if (i == $("#nrJYXM li").length - 1 && dtName !== liName) {
                            dt.parent().remove();
                        }
                    });
                });
                $("#" + nowEditID).children(".tsJyDiv").children("p").each(function () {
                    var p = $(this);
                    var pName = $(this).text();
                    $("#nrJYXM li").each(function (i, v) {
                        var liName = $(this).children("div").text();
                        if (pName == liName) return false;
                        if (i == $("#nrJYXM li").length - 1 && pName !== liName) {
                            var nrDivNowEq = p.next().attr("data-eq");
                            p.next().next(".nrDiv").attr("data-eq", nrDivNowEq);
                            p.next().remove();
                            p.remove();
                        }
                    });
                });
                if ($("#" + nowEditID).children(".tsJyDiv").children("p").length == 0) {
                    $("#" + nowEditID).remove();
                }
                // 判断鸡毛是否变成绿色
                var lookP = $("#" + nowEditID).children(".tsJyDiv").children("p").length;
                var actLabel = $("#" + nowEditID).children(".actGreen").length;
                if (lookP == actLabel) {
                    $("#" + nowEditID).children(".tapIcon").addClass("yes");
                } else {
                    $("#" + nowEditID).children(".tapIcon").removeClass("yes");
                }
                // 判断是否还有数据
                if ($("#yzDBCButtonNR li").length > 0) {
                    // 判断列表是否全部校验
                    if ($("#yzDBCButtonNR").find('.check-red').length == 0 && $(".medicareBox dt").children(".yes").length == $(".medicareBox dt").children(".fs1").length) {
                        $("#dbcButtonBC").removeClass("noEdit");
                    } else {
                        $("#dbcButtonBC").addClass("noEdit");
                    }
                } else {
                    $("#dbcButtonBC").addClass('noEdit');
                }
                // 如果都删完了 则删除医保层
                if ($(".medicareBox dt").children().length == 0) {
                    $(".medicareBox").remove();
                }
            }

            for (var jyxmi = 0; jyxmi < $("#nrJYXM li").length; jyxmi++) {
                jyxm.push({
                    jyxmmc: $("#nrJYXM li").eq(jyxmi).children("div").text(),
                    jyxmID: $("#nrJYXM li").eq(jyxmi).attr("name"),
                    bbbw: $("#nrJYXM li").eq(jyxmi).attr("data-bbbw"),
                    czlx: $("#nrJYXM li").eq(jyxmi).attr("data-czlx"),
                    sgbh: $("#nrJYXM li").eq(jyxmi).attr("data-sgbh"),
                    ybbl: $("#nrJYXM li").eq(jyxmi).attr("data-ybbl"),
                    ybmc: $("#nrJYXM li").eq(jyxmi).attr("data-ybmc")
                });
            }

            for (var jcxmi = 0; jcxmi < $("#nrJCXM li").length; jcxmi++) {
                jcxm.push({
                    jcxmmc: $("#nrJCXM li").eq(jcxmi).find(".max").text(),
                    jcxmff: $("#nrJCXM li").eq(jcxmi).find(".min").text(),
                    jcxmffStr: $("#nrJCXM li").eq(jcxmi).attr("name"),
                    jcxmDanDuo: $("#nrJCXM li").eq(jcxmi).find(".min").attr("name")
                });
            }
            $("#yzxdYaoNR .sqfx").each(function () {
                sqfx.push({
                    xh: $(this).attr("data-xh"),
                    xm: $(this).children("font:last").text(),
                    bt: $(this).attr("data-bt"),
                    yxID: $(this).attr("data-yxid"),
                    nr: $(this).children("span").text() == "请填写" ? "" : $(this).children("span").text()
                });
            });


            // 获取缓存数据索引
            var dataIndex = yiZhuList.length - 1;

            // 如果是成套项目检查
            if ($("#yzxdBiaoTi font").text() == "成套医嘱编辑") {
                var ctDataCount = 0;// 判断是否已存该医嘱至变量内
                if (ctObjectData.length > 0) {
                    $.each(ctObjectData, function (n, value) {
                        if (value.xh == $("#yzxd-name").attr("data-xh")) {
                            // 更新已保存的医嘱
                            value.sfjj = $("#icnYes").is(":hidden") ? "no" : "yes";
                            value.kssj = $("#appDateTime").text();
                            value.gytj = $("#drugWay span").text();
                            value.gytjID = $("#drugWay span").attr("data-gytjid");
                            value.cjff = $("#samplingMethod span").text();
                            value.cjffID = $("#samplingMethod span").attr("data-cjffid");
                            value.cjks = $("#AcquisitionDepartment span").text();
                            value.cjksID = $("#AcquisitionDepartment span").attr("data-cjksid");
                            value.zxks = $("#ExecutiveDepartments span").text();
                            value.zxksID = $("#ExecutiveDepartments span").attr("data-zxksid");
                            value.zxpl = $("#executeHz span").text();
                            value.sjfa = $("#TimeToPlan span").text();
                            value.dl = $("#Milligram span").text();
                            value.gyzx = $("#ToPerform span").text();
                            value.gyzxID = $("#ToPerform span").attr("data-gyzxid");
                            value.fyyf = $("#pharmacy span").text();
                            value.yfID = $("#pharmacy span").attr("data-yfid");
                            value.zxxz = $("#PerformTheNature span").text();
                            value.yszt = $("#doctorTell span").text() == "请填写" ? "" : $("#doctorTell span").text();
                            value.ts = $("#NumberOfDays span").text();
                            value.zl = $("#total span").text();
                            value.ds = $("#diSu input").val();
                            value.jyxm = jyxm;
                            value.jcxm = jcxm;
                            value.sqfx = sqfx;
                            value.yymd = $("#Purpose span").text();
                            value.yyly = $("#reason span").text() == "请填写" ? "" : $("#reason span").text();

                            ctDataCount = ctDataCount + 1;
                            return false;
                        }
                    });
                }

                if (ctDataCount == 0) {

                    // 追加之前 判断xgxh是否重复，防止同时开多个成套项目，xgxh重复的情况
                    var ybgyIDD = $("#yzxd-name").attr("data-xgxh");
                    $.each(doctorActiveMX, function (n, value) {
                        if (value.ybID !== "" && value.ybID == $("#yzxd-name").attr("data-xgxh")) {
                            ybgyIDD = $("#yzxd-name").attr("data-xgxh") + "100";
                        }
                    });

                    ctObjectData.push({
                        yzfl: $("#yzxdCL .active").text(),
                        ds: $("#diSu input").val(),
                        name: $("#yzxdTwoJiChengTao .activeJC").parent().attr("data-lb") == "C" ? $("#yzxd-name").text() + " | " + $("#nrJYXM li:first").children("div").text() + "等" + $("#nrJYXM li").length + "个项目" : $("#yzxd-name").text(),
                        shbj: $("#yzxd-name").attr("data-shbj"),
                        yymd: $("#Purpose span").text(),
                        yyly: $("#reason span").text() == "请填写" ? "" : $("#reason span").text(),
                        sfjj: $("#icnYes").is(":hidden") ? "no" : "yes",
                        kssj: $("#appDateTime").text(),
                        gytj: $("#drugWay span").text(),
                        cjff: $("#samplingMethod span").text(),
                        cjks: $("#AcquisitionDepartment span").text(),
                        zxks: $("#ExecutiveDepartments span").text(),
                        zxpl: $("#executeHz span").text(),
                        sjfa: $("#TimeToPlan span").text(),
                        dl: $("#Milligram span").text(),
                        gyzx: $("#ToPerform span").text(),
                        fyyf: $("#pharmacy span").text(),
                        zxxz: $("#PerformTheNature span").text(),
                        yszt: $("#doctorTell span").text() == "请填写" ? "" : $("#doctorTell span").text(),
                        xh: $("#yzxd-name").attr("data-xh"),   // 在成套中的序号
                        ID: "", //药自身ID
                        ybID: ybgyIDD, //一并给药ID
                        xmID: $("#yzxdTwoJiChengTao .activeJC").parent().attr("data-xmid"),// 医嘱JSON本身的ID
                        ts: $("#NumberOfDays span").text(),
                        zl: $("#total span").text(),
                        jyxm: jyxm,
                        jcxm: jcxm,
                        sqfx: sqfx,
                        ct: "yes",
                        yzlb: $("#yzxdTwoJiChengTao .activeJC").parent().attr("data-lb"),
                        sfxmID: $("#yzxdTwoJiChengTao .activeJC").parent().attr("data-sfxmid"),
                        gytjID: $("#drugWay span").attr("data-gytjid"),
                        yfID: $("#pharmacy span").attr("data-yfid"),
                        zxksID: $("#ExecutiveDepartments span").attr("data-zxksid"),
                        gyzxID: $("#ToPerform span").attr("data-gyzxid"),
                        cjksID: $("#AcquisitionDepartment > span").attr("data-cjksid"),
                        cjffID: $("#samplingMethod span").attr("data-cjffid")

                    });
                }

                // 更新已保存的一并追加的药
                $.each(ctObjectData, function (nn, vv) {
                    if (vv.ybID == $("#yzxd-name").attr("data-xgxh")) {
                        vv.sfjj = $("#icnYes").is(":hidden") ? "no" : "yes";
                        vv.kssj = $("#appDateTime").text();
                        vv.gytj = $("#drugWay span").text();
                        vv.zxpl = $("#executeHz span").text();
                        vv.sjfa = $("#TimeToPlan span").text();
                        vv.gyzx = $("#ToPerform span").text();
                        vv.zxxz = $("#PerformTheNature span").text();
                        vv.gytjID = $("#drugWay span").attr("data-gytjid");
                        vv.yfID = $("#pharmacy span").attr("data-yfid");
                        vv.gyzxID = $("#ToPerform span").attr("data-gyzxid");
                        vv.ds = $("#diSu input").val();
                        vv.ts = $("#NumberOfDays span").text();
                    }
                });

                $("#yzxdTwoJiHeight").hide(); //2017.10.20添加
                $(".yzxdKongJian").hide();
                $("#yzxdYaoNR").hide();
                $("#yzxdTwoJiChengTao").show();
                $("#yzxdBiaoTi font").text("成套医嘱下达");
                $("#yzxd-name").attr("name", $("#buttonBack").attr("data-ctxmid")).text($("#buttonBack").attr("data-ctname"));
                $("#yzxdTwoJiChengTao ul li").find(".activeJC").removeClass("noJC").addClass("yesJC").attr("data-icon", "");

                // 如果是成套
            } else if ($("#yzxdBiaoTi font").text() == "成套医嘱下达" && $("#yzxd-name").attr("name").indexOf("ct") != -1) {
                if ($("#yzxdTwoJiChengTao").find(".yes").length > 0) {
                    // 如果是编辑状态
                    if ($("#yzxd-name").hasClass("editState")) {

                        $("#yzxdTwoJi").hide();     // 医嘱下达二级隐藏
                        $("#yzxdBiaoTi").hide();    // 医嘱下达顶部标题隐藏
                        $("#yzxdDaiBaoCun").show(); // 待保存块显示
                        $("#yzdbcBiaoTi").show();   // 待保存块顶部显示
                        $("#yzdbcBiaoTi").find(".buttonTop").show();  // 待保存块里面的标题按钮显示

                        for (var edYPI = 0; edYPI < doctorActiveMX.length; edYPI++) {
                            if (doctorActiveMX[edYPI].ID == $("#yzxd-name").attr("value")) {
                                doctorActiveMX[edYPI].sfjj = $("#icnYes").is(":hidden") ? "no" : "yes",
                                    doctorActiveMX[edYPI].kssj = $("#appDateTime").text(),
                                    doctorActiveMX[edYPI].gytj = $("#drugWay span").text(),
                                    doctorActiveMX[edYPI].cjff = $("#samplingMethod span").text(),
                                    doctorActiveMX[edYPI].cjffID = $("#samplingMethod span").attr("cjffid"),
                                    doctorActiveMX[edYPI].cjks = $("#AcquisitionDepartment span").text(),
                                    doctorActiveMX[edYPI].zxks = $("#ExecutiveDepartments span").text(),
                                    doctorActiveMX[edYPI].zxpl = $("#executeHz span").text(),
                                    doctorActiveMX[edYPI].sjfa = $("#TimeToPlan span").text(),
                                    doctorActiveMX[edYPI].dl = $("#Milligram span").text(),
                                    doctorActiveMX[edYPI].gyzx = $("#ToPerform span").text(),
                                    doctorActiveMX[edYPI].fyyf = $("#pharmacy span").text(),
                                    doctorActiveMX[edYPI].zxxz = $("#PerformTheNature span").text(),
                                    doctorActiveMX[edYPI].yszt = $("#doctorTell span").text() == "请填写" ? "" : $("#doctorTell span").text(),
                                    doctorActiveMX[edYPI].ts = $("#NumberOfDays span").text(),
                                    doctorActiveMX[edYPI].zl = $("#total span").text(),
                                    doctorActiveMX[edYPI].jyxm = jyxm,
                                    doctorActiveMX[edYPI].jcxm = jcxm,
                                    doctorActiveMX[edYPI].sqfx = sqfx,
                                    doctorActiveMX[edYPI].gytjID = $("#drugWay span").attr("data-gytjid"),
                                    doctorActiveMX[edYPI].yfID = $("#pharmacy span").attr("data-yfid"),
                                    doctorActiveMX[edYPI].zxksID = $("#ExecutiveDepartments span").attr("data-zxksid"),
                                    doctorActiveMX[edYPI].gyzxID = $("#ToPerform span").attr("data-gyzxid"),
                                    doctorActiveMX[edYPI].cjksID = $("#AcquisitionDepartment > span").attr("data-cjksid"),
                                    doctorActiveMX[edYPI].ds = $("#diSu input").val(),
                                    doctorActiveMX[edYPI].yymd = $("#Purpose span").text(),
                                    doctorActiveMX[edYPI].yyly = $("#reason span").text() == "请填写" ? "" : $("#reason span").text()
                                break;
                            }
                        }


                        // 非编辑状态
                    } else {

                        var linShiData = [];  // 临时存放的数据
                        //var eachi=0;        // 用于判断是否循环完的值

                        // 循环已经勾选的成套项目 判断是否已检查
                        for (var ctxmi = 0; ctxmi < $("#yzxdTwoJiChengTao").find(".yes").length; ctxmi++) {
                            // 如果没检查则跳出循环
                            if ($("#yzxdTwoJiChengTao").find(".yes").eq(ctxmi).siblings(".tbspan").hasClass("noJC")) {
                                utils.showHide("有无效医嘱");
                                linShiData = [];
                                return false; // 跳出循环 跳出整个函数
                                // 如果已检查，再判断有没有一并追加的药
                            } else {
                                // 先把数据追加到临时存放变量
                                var xhJson = $("#yzxdTwoJiChengTao").find(".yes").eq(ctxmi).parent().attr("data-xh");
                                for (var xhi = 0; xhi < ctObjectData.length; xhi++) {
                                    if (ctObjectData[xhi].xh == xhJson) {
                                        linShiData.push({
                                            yzfl: ctObjectData[xhi].yzfl,
                                            yzlb: ctObjectData[xhi].yzlb,
                                            sfjj: ctObjectData[xhi].sfjj,
                                            name: ctObjectData[xhi].name,
                                            kssj: ctObjectData[xhi].kssj,
                                            gytj: ctObjectData[xhi].gytj,
                                            cjff: ctObjectData[xhi].cjff,
                                            cjffID: ctObjectData[xhi].cjffID,
                                            cjks: ctObjectData[xhi].cjks,
                                            zxks: ctObjectData[xhi].zxks,
                                            zxpl: ctObjectData[xhi].zxpl,
                                            sjfa: ctObjectData[xhi].sjfa,
                                            dl: ctObjectData[xhi].dl,
                                            gyzx: ctObjectData[xhi].gyzx,
                                            fyyf: ctObjectData[xhi].fyyf,
                                            zxxz: ctObjectData[xhi].zxxz,
                                            yszt: ctObjectData[xhi].yszt,
                                            ID: ctObjectData[xhi].ID,
                                            ybID: ctObjectData[xhi].ybID,   //一并给药ID
                                            ts: ctObjectData[xhi].ts,
                                            zl: ctObjectData[xhi].zl,
                                            xmID: ctObjectData[xhi].xmID,
                                            jyxm: ctObjectData[xhi].jyxm,
                                            jcxm: ctObjectData[xhi].jcxm,
                                            ct: ctObjectData[xhi].ct,   // 是成套中的数据
                                            sqfx: ctObjectData[xhi].sqfx,
                                            gytjID: ctObjectData[xhi].gytjID,
                                            yfID: ctObjectData[xhi].yfID,
                                            zxksID: ctObjectData[xhi].zxksID,
                                            gyzxID: ctObjectData[xhi].gyzxID,
                                            cjksID: ctObjectData[xhi].cjksID,
                                            sfxmID: ctObjectData[xhi].sfxmID,
                                            ds: ctObjectData[xhi].ds,
                                            yymd: ctObjectData[xhi].yymd,
                                            yyly: ctObjectData[xhi].yyly,
                                            shbj: ctObjectData[xhi].shbj,
                                        });
                                        break;
                                    }
                                }//for

                                //  如果有一并追加的药 则循环判断一并追加的 药是否检查
                                if ($("#yzxdTwoJiChengTao").find(".yes").eq(ctxmi).parent().find("ul").length > 0) {
                                    for (var ctxmzji = 0; ctxmzji < $("#yzxdTwoJiChengTao").find(".yes").eq(ctxmi).parent().find("li").length; ctxmzji++) {
                                        if ($("#yzxdTwoJiChengTao").find(".yes").eq(ctxmi).parent().find("li").eq(ctxmzji).find(".tbspan").hasClass("noJC")) {
                                            utils.showHide("有无效医嘱");
                                            linShiData = [];
                                            break;
                                        } else {
                                            //eachi++;
                                            // 先把数据追加到临时存放变量
                                            var xhJsonz = $("#yzxdTwoJiChengTao").find(".yes").eq(ctxmi).parent().find("li").eq(ctxmzji).attr("data-xh");
                                            for (var xhi = 0; xhi < ctObjectData.length; xhi++) {
                                                if (ctObjectData[xhi].xh == xhJsonz) {
                                                    linShiData.push({
                                                        yzfl: ctObjectData[xhi].yzfl,
                                                        yzlb: ctObjectData[xhi].yzlb,
                                                        sfjj: ctObjectData[xhi].sfjj,
                                                        name: ctObjectData[xhi].name,
                                                        kssj: ctObjectData[xhi].kssj,
                                                        gytj: ctObjectData[xhi].gytj,
                                                        cjff: ctObjectData[xhi].cjff,
                                                        cjffID: ctObjectData[xhi].cjffID,
                                                        cjks: ctObjectData[xhi].cjks,
                                                        zxks: ctObjectData[xhi].zxks,
                                                        zxpl: ctObjectData[xhi].zxpl,
                                                        sjfa: ctObjectData[xhi].sjfa,
                                                        dl: ctObjectData[xhi].dl,
                                                        gyzx: ctObjectData[xhi].gyzx,
                                                        fyyf: ctObjectData[xhi].fyyf,
                                                        zxxz: ctObjectData[xhi].zxxz,
                                                        yszt: ctObjectData[xhi].yszt,
                                                        ID: ctObjectData[xhi].ID,
                                                        ybID: ctObjectData[xhi].ybID,   //一并给药ID
                                                        ts: ctObjectData[xhi].ts,
                                                        zl: ctObjectData[xhi].zl,
                                                        xmID: ctObjectData[xhi].xmID,
                                                        jyxm: ctObjectData[xhi].jyxm,
                                                        jcxm: ctObjectData[xhi].jcxm,
                                                        ct: ctObjectData[xhi].ct,   // 是成套中的数据
                                                        sqfx: ctObjectData[xhi].sqfx,
                                                        gytjID: ctObjectData[xhi].gytjID,
                                                        yfID: ctObjectData[xhi].yfID,
                                                        zxksID: ctObjectData[xhi].zxksID,
                                                        gyzxID: ctObjectData[xhi].gyzxID,
                                                        cjksID: ctObjectData[xhi].cjksID,
                                                        sfxmID: ctObjectData[xhi].sfxmID,
                                                        ds: ctObjectData[xhi].ds,
                                                        yymd: ctObjectData[xhi].yymd,
                                                        yyly: ctObjectData[xhi].yyly,
                                                        shbj: ctObjectData[xhi].shbj,
                                                    });
                                                    break;
                                                }
                                            }//for
                                        }
                                    }
                                }/*else{
									eachi++;
								}*/// else
                            }//else
                        }//for

                        // 当循环完 将临时数据循环追加到医嘱数组
                        if (linShiData.length == $("#yzxdTwoJiChengTao").find(".yesJC").length && linShiData.length > 0) {
                            for (var lsi = 0; lsi < linShiData.length; lsi++) {
                                doctorActiveMX.push({
                                    yzfl: linShiData[lsi].yzfl,
                                    yzlb: linShiData[lsi].yzlb,
                                    sfjj: linShiData[lsi].sfjj,
                                    name: linShiData[lsi].name,
                                    kssj: linShiData[lsi].kssj,
                                    gytj: linShiData[lsi].gytj,
                                    cjff: linShiData[lsi].cjff,
                                    cjffID: linShiData[lsi].cjffID,
                                    cjks: linShiData[lsi].cjks,
                                    zxks: linShiData[lsi].zxks,
                                    zxpl: linShiData[lsi].zxpl,
                                    sjfa: linShiData[lsi].sjfa,
                                    dl: linShiData[lsi].dl,
                                    gyzx: linShiData[lsi].gyzx,
                                    fyyf: linShiData[lsi].fyyf,
                                    zxxz: linShiData[lsi].zxxz,
                                    yszt: linShiData[lsi].yszt,
                                    ID: linShiData[lsi].ID,
                                    ybID: linShiData[lsi].ybID,   // 一并给药ID
                                    ts: linShiData[lsi].ts,
                                    zl: linShiData[lsi].zl,
                                    xmID: linShiData[lsi].xmID,
                                    jyxm: linShiData[lsi].jyxm,
                                    jcxm: linShiData[lsi].jcxm,
                                    ct: linShiData[lsi].ct,        // 是成套中的数据
                                    dataIndex: dataIndex,
                                    sqfx: linShiData[lsi].sqfx,
                                    gytjID: linShiData[lsi].gytjID,
                                    yfID: linShiData[lsi].yfID,
                                    zxksID: linShiData[lsi].zxksID,
                                    gyzxID: linShiData[lsi].gyzxID,
                                    cjksID: linShiData[lsi].cjksID,
                                    sfxmID: linShiData[lsi].sfxmID,
                                    ds: linShiData[lsi].ds,
                                    yymd: linShiData[lsi].yymd,
                                    yyly: linShiData[lsi].yyly,
                                    shbj: linShiData[lsi].shbj,
                                });
                            }

                            $("#yzxdTwoJi").hide();     // 医嘱下达二级隐藏
                            $("#yzxdBiaoTi").hide();    // 医嘱下达顶部标题隐藏
                            $("#yzxdDaiBaoCun").show(); // 待保存块显示
                            $("#yzdbcBiaoTi").show();   // 待保存块顶部显示
                            $("#yzdbcBiaoTi").find(".buttonTop").show();  // 待保存块里面的标题按钮显示
                        }

                        // 追加一个药品ID
                        appendYpid();
                    }
                    daiBaoCunUpdate();
                } else {
                    utils.showHide("请选择项目");
                }
                // 不是成套
            } else {

                // 如果是编辑状态
                if ($("#yzxd-name").hasClass("editState")) {

                    for (var edYPI = 0; edYPI < doctorActiveMX.length; edYPI++) {
                        // 更新校验结果为3，好让校验图标变成屎黄色的叉叉
                        var jyjgZhi;
                        if (doctorActiveMX[edYPI].jyjg == "2") jyjgZhi = "3";
                        // 更新编辑后的数据
                        if (doctorActiveMX[edYPI].ID == $("#yzxd-name").attr("value")) {

                            var editYbID = doctorActiveMX[edYPI].ybID;
                            doctorActiveMX[edYPI].bm = $("#executeHz span").attr("data-bm"),
                                doctorActiveMX[edYPI].jyjg = jyjgZhi,
                                doctorActiveMX[edYPI].name = doctorActiveMX[edYPI].yzlb == "C" ? $("#yzxd-name").text() + " | (" + $("#nrJYXM li").eq(0).children("div").text() + "等" + $("#nrJYXM li").length + "个项目)" : doctorActiveMX[edYPI].name,
                                doctorActiveMX[edYPI].sfjj = $("#icnYes").is(":hidden") ? "no" : "yes",
                                doctorActiveMX[edYPI].kssj = $("#appDateTime").text(),
                                doctorActiveMX[edYPI].gytj = $("#drugWay span").text(),
                                doctorActiveMX[edYPI].cjff = $("#samplingMethod span").text(),
                                doctorActiveMX[edYPI].cjffID = $("#samplingMethod span").attr("data-cjffid"),
                                doctorActiveMX[edYPI].cjks = $("#AcquisitionDepartment span").text(),
                                doctorActiveMX[edYPI].zxks = $("#ExecutiveDepartments span").text(),
                                doctorActiveMX[edYPI].zxpl = $("#executeHz span").text(),
                                doctorActiveMX[edYPI].sjfa = $("#TimeToPlan span").text(),
                                doctorActiveMX[edYPI].dl = $("#Milligram span").text(),
                                doctorActiveMX[edYPI].gyzx = $("#ToPerform span").text(),
                                doctorActiveMX[edYPI].fyyf = $("#pharmacy span").text(),
                                doctorActiveMX[edYPI].zxxz = $("#PerformTheNature span").text(),
                                doctorActiveMX[edYPI].yszt = $("#doctorTell span").text() == "请填写" ? "" : $("#doctorTell span").text(),
                                doctorActiveMX[edYPI].ts = $("#NumberOfDays span").text(),
                                doctorActiveMX[edYPI].zl = $("#total span").text(),
                                doctorActiveMX[edYPI].jyxm = jyxm,
                                doctorActiveMX[edYPI].jcxm = jcxm,
                                doctorActiveMX[edYPI].sqfx = sqfx,
                                doctorActiveMX[edYPI].cjksID = $("#AcquisitionDepartment span").attr("data-cjksid"),
                                doctorActiveMX[edYPI].gyzxID = $("#ToPerform span").attr("data-gyzxid"),
                                doctorActiveMX[edYPI].zxksID = $("#ExecutiveDepartments span").attr("data-zxksid"),
                                doctorActiveMX[edYPI].yfID = $("#pharmacy span").attr("data-yfid"),
                                doctorActiveMX[edYPI].gytjID = $("#drugWay span").attr("data-gytjid"),
                                doctorActiveMX[edYPI].ds = $("#diSu input").val(),
                                doctorActiveMX[edYPI].yymd = $("#Purpose span").text(),
                                doctorActiveMX[edYPI].yyly = $("#reason span").text() == "请填写" ? "" : $("#reason span").text()


                            // 更新一并追加药品的相同字段数据
                            for (var edYPIi = 0; edYPIi < doctorActiveMX.length; edYPIi++) {
                                if (doctorActiveMX[edYPIi].ybID == editYbID && editYbID !== "") {
                                    doctorActiveMX[edYPIi].sfjj = $("#icnYes").is(":hidden") ? "no" : "yes",
                                        doctorActiveMX[edYPIi].bm = $("#executeHz span").attr("data-bm"),
                                        doctorActiveMX[edYPIi].kssj = $("#appDateTime").text(),
                                        doctorActiveMX[edYPIi].gytj = $("#drugWay span").text(),
                                        doctorActiveMX[edYPIi].zxpl = $("#executeHz span").text(),
                                        doctorActiveMX[edYPIi].sjfa = $("#TimeToPlan span").text(),
                                        doctorActiveMX[edYPIi].gyzx = $("#ToPerform span").text(),
                                        doctorActiveMX[edYPIi].zxxz = $("#PerformTheNature span").text(),
                                        doctorActiveMX[edYPIi].gytjID = $("#drugWay span").attr("data-gytjid"),
                                        doctorActiveMX[edYPIi].gyzxID = $("#ToPerform span").attr("data-gyzxid"),
                                        doctorActiveMX[edYPIi].ds = $("#diSu input").val()
                                }
                            }

                            break;
                        }



                    }

                    // 非编辑状态
                } else {

                    // 医嘱数据
                    var yzlb = $("#yzxdYaoPin .active").children("label").attr("data-lb");

                    doctorActiveMX.push({
                        yzfl: $("#yzxdCL .active").text(), //所属分类 长嘱/临嘱
                        yzlb: yzlb,
                        name: yzlb == "C" ? $("#yzxd-name").text() + " | (" + $("#nrJYXM li").eq(0).children("div").text() + "等" + $("#nrJYXM li").length + "个项目)" : $("#yzxd-name").text(),
                        shbj: $("#yzxd-name").attr("data-shbj"),
                        yymd: $("#Purpose span").text(),
                        yyly: $("#reason span").text() == "请填写" ? "" : $("#reason span").text(),
                        sfjj: $("#icnYes").is(":hidden") ? "no" : "yes",
                        kssj: $("#appDateTime").text(),
                        gytj: $("#drugWay span").text(),
                        cjff: $("#samplingMethod span").text(),
                        cjffID: $("#samplingMethod span").attr("data-cjffid"),
                        cjks: $("#AcquisitionDepartment span").text(),
                        zxks: $("#ExecutiveDepartments span").text(),
                        zxpl: $("#executeHz span").text(),
                        sjfa: $("#TimeToPlan span").text(),
                        dl: $("#Milligram span").text(),
                        gyzx: $("#ToPerform span").text(),
                        fyyf: $("#pharmacy span").text(),
                        zxxz: $("#PerformTheNature span").text(),
                        yszt: $("#doctorTell span").text() == "请填写" ? "" : $("#doctorTell span").text(),
                        ID: "", //药自身ID
                        ybID: ybzjYaoPin.ybID, //一并给药ID
                        MS: ybzjYaoPin.MS,
                        YZNR: ybzjYaoPin.YZNR,
                        YZZT: ybzjYaoPin.YZZT,
                        editID: ybzjYaoPin.editID,
                        editListID: ybzjYaoPin.editListID,
                        xmID: yzlb == 5 || yzlb == 6 ? $("#yzxdYaoPin .active").children("label").attr("data-ymid") : $("#yzxdYaoPin .active").children("label").attr("id"),        // 医嘱JSON本身的ymID
                        ts: $("#NumberOfDays span").text(),
                        zl: $("#total span").text(),
                        jyxm: jyxm,
                        jcxm: jcxm,
                        sqfx: sqfx,
                        ct: "no",
                        dataIndex: dataIndex,
                        cjksID: $("#AcquisitionDepartment span").attr("data-cjksid"),
                        gyzxID: $("#ToPerform span").attr("data-gyzxid"),
                        zxksID: $("#ExecutiveDepartments span").attr("data-zxksid"),
                        yfID: $("#pharmacy span").attr("data-yfid"),
                        gytjID: $("#drugWay span").attr("data-gytjid"),
                        ds: $("#diSu input").val(),
                        // bwm: ybzjYaoPin.bwm,
                        bwm: $("#yzxdTwoJiHeight").attr("data-bwm"),
                        bm: $("#executeHz span").attr("data-bm"),
                        syfw: $("#executeHz span").attr("data-syfw"),//适用范围
                        pljg: $("#executeHz span").attr("data-pljg"),//频率间隔
                        plcs: $("#executeHz span").attr("data-plcs"),//频率次数
                        jgdw: $("#executeHz span").attr("data-jgdw"),//间隔单位
                        sfxmID: yzlb == 5 || yzlb == 6 ? $("#yzxd-name").attr("name").replace("xmID", "") : ""      // 医嘱JSON本身的项目ID
                    });

                    // 追加一个药品ID
                    appendYpid();

                } //else 非编辑状态


                $(".yzxdKongJian").hide();  // 所有控件隐藏
                $("#yzxdTwoJi").hide();     // 医嘱下达二级隐藏
                $("#yzxdBiaoTi").hide();    // 医嘱下达顶部标题隐藏
                $("#yzxdDaiBaoCun").show(); // 待保存块显示
                $("#yzdbcBiaoTi").show();   // 待保存块顶部显示
                $("#yzdbcBiaoTi").find(".buttonTop").show();  // 待保存块里面的标题按钮显示

                $("#newOd-ButtonYBZJ").addClass("buttonNoEdit");  // 一并追加按钮默认不可操作
                $("#newOd-TextYBZJ").addClass("textNoEdit");      // 一并追加按钮默认不可操作

                daiBaoCunUpdate();


            }//不是成套
        } else {
            if (jyxmsl == false) {
                utils.showHide("检验项目（未填）");
            } else if (jcxmsl == false) {
                if ($("#nrJCXM li").find(".text-red").length > 0)
                    utils.showHide("检查方法（未填）");
                else
                    utils.showHide("检查项目（未填）");
            } else {
                $("#yzxdYaoNR li").each(function () {
                    if ($(this).is(":visible") && $(this).find(".text-xh").length > 0 && $(this).find("span").hasClass("text-red")) {
                        utils.showHide($(this).children(".UlBt").text() + "（未填）");
                        return false;
                    }
                });
            }
        }
    });

    // 追加药品ID
    function appendYpid() {
        for (var i = 0; i < doctorActiveMX.length; i++) {
            var maxID = 0;
            for (var yp = doctorActiveMX.length - 1; yp >= 0; yp--) {
                if (doctorActiveMX[yp].ID !== undefined && doctorActiveMX[yp].ID !== "" && doctorActiveMX[yp].ID !== null) {
                    if (doctorActiveMX[yp].ID.indexOf("ypID") !== -1) {
                        var thisID = parseInt(doctorActiveMX[yp].ID.replace("ypID", ""));
                        if (thisID > maxID) maxID = thisID;
                    }
                }
            }
            if (doctorActiveMX[i].ID == undefined || doctorActiveMX[i].ID == "" || doctorActiveMX[i].ID == null) {
                doctorActiveMX[i].ID = "ypID" + (maxID + 1);
            }
        }
    }

    // 更新待保存显示数据
    function daiBaoCunUpdate() {
        // 隐藏该隐藏的
        $("#yzxdTwoJi").hide();

        // 重新排序 把相同一并追加ID的放在一起
        doctorActiveMX.sort(function (first, second) {
            return first.ybID.localeCompare(second.ybID);
        });

        // 更新待保存显示数据
        $("#yzDaiBaoCun-Lin").empty("li");  // 清除待保存的列表数据 以免重复追加
        $("#yzDaiBaoCun-Chang").empty("li");
        for (var iii = 0; iii < doctorActiveMX.length; iii++) {
            // 判断是否需要标记 修改 警示 (采集方法、发药药房、给药途径、执行科室、采集科室、给药执行其中一个为空就不能提交)
			/*var biaoJ = '';
			debugger;
			if((doctorActiveMX[iii].yzlb==5 || doctorActiveMX[iii].yzlb==6) && (doctorActiveMX[iii].gytjID==""||doctorActiveMX[iii].yfID==""||doctorActiveMX[iii].gyzxID=="")){   // 给药途径ID为空则标记
				biaoJ = 'class="needEdit"';
			}else if((doctorActiveMX[iii].yzlb=='C') && (doctorActiveMX[iii].cjffID==""||doctorActiveMX[iii].cjksID==""||doctorActiveMX[iii].zxksID=="")){       // 检查 采集方法ID为空则标记
				biaoJ = 'class="needEdit"';
			}else if(doctorActiveMX[iii].zxksID==""){
				biaoJ = 'class="needEdit"';
			}*/
            var id = doctorActiveMX[iii].ID;
            var gytj = doctorActiveMX[iii].gytj;
            var dataIndex = doctorActiveMX[iii].dataIndex;
            var ct = doctorActiveMX[iii].ct;
            var ybID = doctorActiveMX[iii].ybID;
            var editID = doctorActiveMX[iii].editID;
            var name = doctorActiveMX[iii].name;
            var tuBiao = '<span class="fs1" aria-hidden="true" data-icon=""></span>';
            // 判断校验结果
            var jy_tb = '';
            if (doctorActiveMX[iii].jyjg == "1") {                                       // 警示
                jy_tb = '<label class="check-yellow" aria-hidden="true" data-icon="" data-text="' + doctorActiveMX[iii].jyText + '"></label>';
            } else if ((doctorActiveMX[iii].jyjg == "0" || doctorActiveMX[iii].jyjg == null) && doctorActiveMX[iii].jyjg !== undefined) { // 通过
                jy_tb = '<label class="check-green" aria-hidden="true" data-icon=""></label>';
            } else if (doctorActiveMX[iii].jyjg == "2") {                                 // 不能保存
                jy_tb = '<label class="check-red" aria-hidden="true" data-icon="" data-text="' + doctorActiveMX[iii].jyText + '"></label>';
            } else if (doctorActiveMX[iii].jyjg == "3") {                                 // 已经修改待校验
                jy_tb = '<label class="check-yellowS" aria-hidden="true" data-icon="" data-text="' + doctorActiveMX[iii].jyText + '"></label>';
            }

            if (doctorActiveMX[iii].yzfl == "临时医嘱" || doctorActiveMX[iii].yzfl == "临嘱") {
                var domId = 'yzDaiBaoCun-Lin';
            } else {
                var domId = 'yzDaiBaoCun-Chang';
            }
            if (doctorActiveMX[iii].yzlb == 5 || doctorActiveMX[iii].yzlb == 6) {
                var xmid = (doctorActiveMX[iii].ct == "yes" ? doctorActiveMX[iii].xmID : doctorActiveMX[iii].sfxmID);
                $("#" + domId).append('<li id="' + id + '" data-gytj="' + gytj + '" data-index="' + dataIndex + '" data-ct="' + ct + '" name="' + ybID + '" data-editid="' + editID + '" value="' + xmid + '">' + jy_tb + '<font class="name">' + name + '</font>' + tuBiao + '</li>');
            } else {
                var xmid = doctorActiveMX[iii].xmID;
                $("#" + domId).append('<li id="' + id + '" data-index="' + dataIndex + '" data-ct="' + ct + '" name="' + ybID + '" data-editid="' + editID + '" value="' + xmid + '">' + jy_tb + '<font class="name">' + name + '</font>' + tuBiao + '</li>');
            }
        }

        // 更新医保顺序
        dtOfLiSort();

        // 保存按钮 启用
        if ($("#yzDBCButtonNR").find('.check-red').length == 0 && $(".medicareBox dt").children(".yes").length == $(".medicareBox dt").children(".fs1").length) {
            $("#dbcButtonBC").removeClass("noEdit");
        } else {
            $("#dbcButtonBC").addClass("noEdit");
        }

        // 注册长按事件
        var liPresshammer = $("#yzDBCButtonNR li").hammer();//给提示注册长按事件
        liPresshammer.on('press', function (event) {
            if ($(this).find(".check-green").length > 0 || $(this).find("label").length == 0) return false;
            mesPrompt($(this));
        });
        $("#yzDBCButtonNR li").on("touchend", function () {
            $(this).find('.yizhuDIv').remove();
        });

        //待保存医嘱动画
        $("#yzDaiBaoCun-Chang li").on("touchstart touchmove", function () {
            utils.CpStart($(this));
        });
        $("#yzDaiBaoCun-Chang li").on("touchend", function () {
            utils.CpEnd($(this));
        });
        $("#yzDaiBaoCun-Lin li").on("touchstart touchmove", function () {
            utils.CpStart($(this));
        });
        $("#yzDaiBaoCun-Lin li").on("touchend", function () {
            utils.CpEnd($(this));
        });

        hammeryzDBCButtonNR = $("#yzDBCButtonNR li").hammer();
        hammeryzDBCButtonNR.on("tap", function (event) {
            //$("#yzDBCButtonNR li").on("touchstart",function(e){
            //event.stopPropagation();    //  阻止事件冒泡
            //event.preventDefault();     //  阻止默认行为
            yzxdDaiBaoCunLi($(this));
        });

        hammerDBCEditOrdAct = $("#yzDBCButtonNR li span").hammer();
        hammerDBCEditOrdAct.on("tap", function (event) {
            //$("#yzDBCButtonNR li span").on("touchstart",function(e){
            //event.stopPropagation();    //  阻止事件冒泡
            //event.preventDefault();     //  阻止默认行为
            yzstatus = true;//编辑药品，重新改变状态验证是否合理用药
            editOrdAct($(this));  // 获取医嘱项目ID（数据库里的ID） 和 当前页面追加的药品ID 和 是否为成套数据 和 缓存数据源索引
        });
        //var hammeryzxdDaiBaoCun = $("#yzxdDaiBaoCun").hammer();
        //hammeryzxdDaiBaoCun.on("tap",function(ev){
        $("#yzxdDaiBaoCun").on("touchstart", function (e) {
            if (e.target.nodeName == "DIV") {
                $("#yzDBCButtonNR li").removeClass("active");
                $("#newOd-ButtonYBZJ").addClass("buttonNoEdit");
                $("#newOd-TextYBZJ").addClass("textNoEdit");
                $("#newOd-ButtonDell").addClass("buttonNoEdit");
                $("#yzxdDaiBaoCun .yzDBCButtonBox .buttonText").eq(2).addClass("textNoEdit");
            }
        });

        $("#yzDaiBaoCun-Chang li").each(function () {
            if ($(this).attr("name") == "") {
                if (!$(this).prev().hasClass("bgcolor")) {
                    $(this).addClass("bgcolor");
                } else {
                    $(this).addClass("bgcolor1");
                }
            } else {
                if ($(this).attr("name") == $(this).prev().attr("name")) {
                    if ($(this).prev().hasClass("bgcolor")) {
                        $(this).addClass("bgcolor");
                    } else {
                        $(this).addClass("bgcolor1");
                    }
                } else {
                    if (!$(this).prev().hasClass("bgcolor")) {
                        $(this).addClass("bgcolor");
                    } else {
                        $(this).addClass("bgcolor1");
                    }
                }
            }
            heBing($(this));
        });

        $("#yzDaiBaoCun-Lin li").each(function () {
            if ($(this).attr("name") == "") {
                if (!$(this).prev().hasClass("bgcolor1")) {
                    $(this).addClass("bgcolor1");
                } else {
                    $(this).addClass("bgcolor");
                }
            } else {
                if ($(this).attr("name") == $(this).prev().attr("name")) {
                    if ($(this).prev().hasClass("bgcolor1")) {
                        $(this).addClass("bgcolor1");
                    } else {
                        $(this).addClass("bgcolor");
                    }
                } else {
                    if (!$(this).prev().hasClass("bgcolor1")) {
                        $(this).addClass("bgcolor1");
                    } else {
                        $(this).addClass("bgcolor");
                    }
                }
            }
            heBing($(this));
        });

        // 判断是否是第一条或者最后一条
        function heBing(thisLi) {

            if (thisLi.attr("name") != "") {     //有一并追加才需要判断
                if (!thisLi.prev().attr("name") || thisLi.prev().attr("name") != thisLi.attr("name")) {
                    if (thisLi.next().attr("name") == thisLi.attr("name")) {
                        thisLi.addClass('firstLi');      //是第一条
                    } else {
                        thisLi;
                    }
                } else if (thisLi.next().attr("name") == thisLi.attr("name") && thisLi.prev().attr("name") == thisLi.attr("name")) {
                    thisLi.addClass('centerLi');     //中间一条

                } else if (!thisLi.next().attr("name") || thisLi.next().attr("name") != thisLi.attr("name")) {
                    thisLi.addClass('lastLi');     //最后一条
                }
            } else {
                thisLi;
            }
        }
    }

    // 点击 返回待保存  
    var hammerbuttonBackDBC = $("#buttonBackDBC").hammer();
    hammerbuttonBackDBC.on("tap", function () {
        $("#yzxdBiaoTi").hide();
        $("#sskeyboardbox").hide();
        $("#yzxdCL").hide();
        $("#yzxdOneJi").hide();
        $("#yzxdTwoJi").hide();

        $("#yzdbcBiaoTi").show();
        $("#yzxdDaiBaoCun").show();
        $(".medicareBox").show();
    });

    // 医嘱下达 待保存 点新开
    hammernewOdButton = $("#newOd-newOdButton").hammer();
    hammernewOdButton.on('tap', function (event) {
        saveNum = 1;
        if (!$(this).hasClass("buttonNoEdit")) {
            $('#searchText').val('');//清空搜索框内容
            $("#yzxdDaiBaoCun").hide();
            $("#yzdbcBiaoTi").hide();
            $("#buttonBack").hide();   // 返回图标
            $("#buttonConfirm").hide();  // 确定按钮
            $("#buttonCancel").hide();  // 取消按钮
            $("#yzxdOneJi").show();
            $("#yzxdYaoNR li").addClass("eventQY");    // 医嘱下达控件启用
            $("#yzxdCL").show();
            $("#yzxdCL li").addClass("QY").removeClass("active");
            $("#yzxdCL li:first").addClass("active");  // 默认打开长期医嘱
            $("#yzxd-name").removeClass("editState");  // 移除编辑状态
            $("#yzxdButton li").removeClass("item JY"); // 启用所有
            $("#yzOptionAll").addClass("item");         // 默认打开所有
            $("#yzxdFather .medicareBox").hide();

            dataLoad.loadXiangMuList().then(function (res) {
                fyCount = res.count;
                yiZhuList.push(res);
            });

            $("#yzOptionJC").addClass("JY");
            $("#yzOptionJY").addClass("JY");
            $("#yzxdBiaoTi").show();
            $("#yzxdBiaoTi font").text("医嘱下达");
            $("#buttonBackDBC").show();
            ybzjYaoPin = {
                sfjj: "",
                kssj: "",
                gytj: "",
                gytjID: "",
                zxpl: "",
                sjfa: "",
                gyzx: "",
                gyzxID: "",
                zxxz: "",
                ID: "",
                ts: "",
                ds: "",
                ybID: "",
                MS: "",
                YZNR: "",
                YZZT: "",
                editID: "",
                editListID: ""
            };
            ctObjectData = [];
        }
    });

    // 医嘱下达 待保存 点一并追加
    hammerButtonYBZJ = $("#newOd-ButtonYBZJ").hammer();
    hammerButtonYBZJ.on('tap', function (event) {
        saveNum = 1;
        $('#searchText').val('');//清空搜索框内容
        if (!$("#newOd-ButtonYBZJ").hasClass("buttonNoEdit")) {
            for (var i = 0; i < doctorActiveMX.length; i++) {
                if (doctorActiveMX[i].ID == $("#yzDBCButtonNR .active").attr("id")) {
                    ybzjYaoPin.ID = doctorActiveMX[i].ID;
                    ybzjYaoPin.yzfl = doctorActiveMX[i].yzfl;
                    ybzjYaoPin.sfjj = doctorActiveMX[i].sfjj;
                    ybzjYaoPin.kssj = doctorActiveMX[i].kssj;
                    ybzjYaoPin.gytj = doctorActiveMX[i].gytj;
                    ybzjYaoPin.zxpl = doctorActiveMX[i].zxpl;
                    ybzjYaoPin.sjfa = doctorActiveMX[i].sjfa;
                    ybzjYaoPin.gyzx = doctorActiveMX[i].gyzx;
                    ybzjYaoPin.zxxz = doctorActiveMX[i].zxxz;
                    ybzjYaoPin.ts = doctorActiveMX[i].ts;
                    ybzjYaoPin.gyzxID = doctorActiveMX[i].gyzxID;
                    ybzjYaoPin.gytjID = doctorActiveMX[i].gytjID;
                    ybzjYaoPin.ds = doctorActiveMX[i].ds;
                    ybzjYaoPin.editID = doctorActiveMX[i].editID;
                    ybzjYaoPin.editListID = doctorActiveMX[i].editListID;
                    ybzjYaoPin.MS = doctorActiveMX[i].MS;
                    ybzjYaoPin.YZNR = doctorActiveMX[i].YZNR;
                    ybzjYaoPin.YZZT = doctorActiveMX[i].YZZT;
                    ybzjYaoPin.zl = doctorActiveMX[i].zl !== "" ? 0 : "";
                    ybzjYaoPin.zjflag = true;

                    // 如果是第一次追加 给当前选中医嘱追加一个一并给药ID 选取当前最大的一并ID+1作为一并给药ID
                    if ($("#yzDBCButtonNR .active").attr("name") == "" || $("#yzDBCButtonNR .active").attr("name") == "undefined" || $("#yzDBCButtonNR .active").attr("name") == undefined) {
                        var ybarry = [];
                        for (var ybi = 0; ybi < doctorActiveMX.length; ybi++) {
                            ybarry.push(doctorActiveMX[ybi].ybID == "" || doctorActiveMX[ybi].ybID == "undefined" || doctorActiveMX[ybi].ybID == undefined ? 0 : doctorActiveMX[ybi].ybID.replace('ybgyID', ""));
                        }
                        ybzjYaoPin.ybID = "ybgyID" + (Math.max.apply(null, ybarry) + 1);
                        doctorActiveMX[i].ybID = ybzjYaoPin.ybID;
                    } else {
                        ybzjYaoPin.ybID = $("#yzDBCButtonNR .active").attr("name");
                    }

                    break;
                }
            }
            $("#yzxdDaiBaoCun").hide();
            $("#yzdbcBiaoTi").hide();
            $("#buttonBack").hide();   // 返回图标
            $("#buttonConfirm").hide();  // 确定按钮
            $("#buttonCancel").hide();

            $("#yzxdOneJi").show();
            $("#yzxdBiaoTi font").text("医嘱追加");
            $("#buttonBackDBC").show();

            $("#yzxdCL").show();  //医嘱分类
            $("#yzxdCL li").removeClass("QY");   // 禁用医嘱分类选项

            // 只能默认药品类
            $("#yzxdButton li").removeClass("item").addClass("JY");
            $("#yzOptionYP").removeClass("JY").addClass("item");

            if (ybzjYaoPin.yzfl == "长期医嘱") {
                $("#yzxdCL li").removeClass("active");
                $("#yzxdCL li:first").addClass("active");
            } else {
                $("#yzxdCL li").removeClass("active");
                $("#yzxdCL li:last").addClass("active");
            }

            $("#yzxdBiaoTi").show();

            //$("#yzDaiBaoCun-Lin").empty("li");
            //$("#yzDaiBaoCun-Chang").empty("li");

            //dataLoad.loadXiangMuList();
            dataLoad.loadXiangMuList().then(function (res) {
                fyCount = res.count;
                yiZhuList.push(res);
            });


            $("#yzxd-name").removeClass("editState");  // 移除编辑状态
            $("#yzxdFather .medicareBox").hide();
        }

    });

    // 医嘱下达 待保存 点删除
    hammernewOdButtonDell = $("#newOd-ButtonDell").hammer();
    hammernewOdButtonDell.on('tap', function (event) {
        if (!$(this).hasClass("buttonNoEdit")) {
            yzstatus = true;
            //判断追加的医嘱删除的哪一条
            var deletItem = $("#yzDBCButtonNR").find(".active");
            if (deletItem.prev().attr("name") != deletItem.attr("name")) {   //删除第一条
                deletItem.next().addClass('deletfirst');
            } else if (deletItem.next().attr("name") != deletItem.attr("name")) {   //删除最后一条
                deletItem.prev().addClass('deletlast');
            } else {
                deletItem;  //删除中间没有改变
            }
            // 根据索引删除数组元素 函数
            function RemoveValByIndex(arr, index) {
                arr.splice(index, 1);
            }
            var actId = $("#yzDBCButtonNR").find(".active").attr("id");
            for (var i = 0; i < doctorActiveMX.length; i++) {
                if (actId == doctorActiveMX[i].ID) {
                    // 删除医保数据	// 如果是临嘱最后一条，则追加一个高度为36px的框					
                    if ($("#yzDaiBaoCun-Lin li").length == 1 && $("#yzDaiBaoCun-Lin li:last").attr("id") == actId && $("#yzDaiBaoCun-Chang li").length > 0) {
                        $(".medicareBox").prepend('<div style="height:39px; width:100%; float:left;"></div>');
                        // 如果是长嘱最后一条，则追加一个高度为36px的框
                    } else if ($("#yzDaiBaoCun-Chang li").length == 1 && $("#yzDaiBaoCun-Chang li:last").attr("id") == actId && $("#yzDaiBaoCun-Lin li").length > 0) {
                        $(".medicareBox").append('<div style="height:39px; width:100%; float:left;"></div>');
                        // 如果是长嘱的第一条，并且临嘱的数量为0，则设置一个顶部距离
                    } else if ($("#yzDaiBaoCun-Chang li:first").attr("id") == actId && $("#yzDaiBaoCun-Lin li").length == 0) {
                        var topH = '39px';
                        $("#dt" + actId).next().css("margin-top", topH);
                    }
                    $("#dt" + actId).remove();
                    RemoveValByIndex(doctorActiveMX, i);
                    $("#yzDBCButtonNR").find(".active").remove();
                    break;
                }
            }
            // 判断是否还有数据
            if ($("#yzDBCButtonNR li").length > 0) {
                // 判断列表是否全部校验
                if ($("#yzDBCButtonNR").find('.check-red').length == 0 && $(".medicareBox dt").children(".yes").length == $(".medicareBox dt").children(".fs1").length) {
                    $("#dbcButtonBC").removeClass("noEdit");
                } else {
                    $("#dbcButtonBC").addClass("noEdit");
                }
            } else {
                $("#dbcButtonBC").addClass('noEdit');
            }
            // 如果都删完了 则删除医保层
            if ($(".medicareBox dt").children().length == 0) {
                $(".medicareBox").remove();
            }
        }
    });

    // 医嘱下达 待保存 点击药品
    function yzxdDaiBaoCunLi(thisID) {
        $("#yzDBCButtonNR li").removeClass("active");
        $(thisID).addClass("active");

        // 根据给药途径判断是否显示一并追加
        if (thisID.attr("data-gytj") !== "" && thisID.attr("data-gytj") !== undefined) {
            $("#newOd-ButtonYBZJ").removeClass("buttonNoEdit");
            $("#newOd-TextYBZJ").removeClass("textNoEdit");
        } else {
            $("#newOd-ButtonYBZJ").addClass("buttonNoEdit");
            $("#newOd-TextYBZJ").addClass("textNoEdit");
        }

        $("#newOd-ButtonDell").removeClass("buttonNoEdit");
        $("#yzxdDaiBaoCun .yzDBCButtonBox .buttonText").eq(2).removeClass("textNoEdit");

    }

    // 待保存 编辑药品 
    function editOrdAct(thisIDD) {  // thisID：项目ID；ypID：当前页面追加的ID sfct：是否成套 datain：缓存数据源索引
        $(".medicareBox").hide();

        var thisName = thisIDD.parent().text();
        var thisNameArry = "";
        if (thisName.indexOf("标本：") != -1) {
            thisNameArry = thisName.split("|");
            thisName = thisNameArry[0];
        }

        var thisID = thisIDD.parent().attr("value");
        var ypID = thisIDD.parent().attr("id")
        var sfct = thisIDD.parent().attr("data-ct");
        var datain = thisIDD.parent().attr("data-index");
        var editID = thisIDD.parent().attr("data-editid");

        $("#yzxdDaiBaoCun").hide(); // 待保存块隐藏
        $("#yzdbcBiaoTi").hide();   // 待保存块顶部隐藏

        $("#yzxdTwoJi").show();     // 医嘱下达二级显示
        $("#yzxdTwoJiHeight").show();     // 非成套显示
        $("#yzxdTwoJiChengTao").hide();   // 成套隐藏
        $("#yzxdBiaoTi").show();    // 医嘱下达顶部标题显示

        $("#yzxdBiaoTi font").text("医嘱编辑");
        $("#buttonBack").show();    // 返回按钮隐藏
        $("#buttonConfirm").show(); // 确定按钮显示
        $("#buttonBackDBC").hide();
        $("#buttonCancel").hide();

        // 清空缓存数据
        $("#nrJYXM").empty("li").hide();
        $("#nrJCXM").empty("li").hide();

        // 如果是从成套读取数据 则标记ct
        if (sfct == "yes") {
            $("#yzxd-name").text(thisName).addClass("editState").attr("value", ypID).attr("name", "xmIDct" + thisID).attr("data-index", datain);  // 更新标题药品名字 并标记为编辑状态
        } else {
            $("#yzxd-name").text(thisName).addClass("editState").attr("value", ypID).attr("name", "xmID" + thisID).attr("data-index", datain);  // 更新标题药品名字 并标记为编辑状态
        }
        // 取消成套状态 方便返回的时候返回待保存
        $("#buttonBack").attr("data-state", "");

        // 提取要编辑的药品的数据
        for (var i = 0; i < doctorActiveMX.length; i++) {
            if (doctorActiveMX[i].ID == ypID) {
                var a = {
                    yzfl: doctorActiveMX[i].yzfl,
                    name: doctorActiveMX[i].name,
                    shbj: doctorActiveMX[i].shbj,
                    yymd: doctorActiveMX[i].yymd,
                    yyly: doctorActiveMX[i].yyly,
                    sfjj: doctorActiveMX[i].sfjj,
                    kssj: doctorActiveMX[i].kssj,
                    gytj: doctorActiveMX[i].gytj,
                    cjff: doctorActiveMX[i].cjff,
                    cjffID: doctorActiveMX[i].cjffID,
                    cjks: doctorActiveMX[i].cjks,
                    zxks: doctorActiveMX[i].zxks,
                    zxpl: doctorActiveMX[i].zxpl,
                    sjfa: doctorActiveMX[i].sjfa,
                    dl: doctorActiveMX[i].dl,
                    gyzx: doctorActiveMX[i].gyzx,
                    fyyf: doctorActiveMX[i].fyyf,
                    zxxz: doctorActiveMX[i].zxxz,
                    yszt: doctorActiveMX[i].yszt,
                    ID: doctorActiveMX[i].ID,
                    ybID: doctorActiveMX[i].ybID,
                    xmID: doctorActiveMX[i].xmID,
                    ts: doctorActiveMX[i].ts,
                    zl: doctorActiveMX[i].zl,
                    jyxm: doctorActiveMX[i].jyxm,
                    jcxm: doctorActiveMX[i].jcxm,
                    sqfx: doctorActiveMX[i].sqfx,
                    cjksID: doctorActiveMX[i].cjksID,
                    gyzxID: doctorActiveMX[i].gyzxID,
                    zxksID: doctorActiveMX[i].zxksID,
                    yfID: doctorActiveMX[i].yfID,
                    gytjID: doctorActiveMX[i].gytjID,
                    ds: doctorActiveMX[i].ds,
                    editID: doctorActiveMX[i].editID,
                    editListID: doctorActiveMX[i].editListID,
                    jlxs: doctorActiveMX[i].jlxs,
                    flsx: doctorActiveMX[i].flsx,
                    zybz: doctorActiveMX[i].zybz,
                    YPID: thisID//用于库存量的药品ID
                };
                break;
            }
        }

        // 给回传的追加数据初始会空
        ybzjYaoPin = {
            sfjj: "",
            kssj: "",
            gytj: "",
            gytjID: "",
            zxpl: "",
            sjfa: "",
            gyzx: "",
            gyzxID: "",
            zxxz: "",
            ID: "",
            ts: "",
            ds: "",
            ybID: ""
        }

        // 药品分类
        $("#yzxdCL li").removeClass("active");
        if (a.yzfl == "长期医嘱" || a.yzfl == "长嘱") {
            $("#yzxdCL li:first").addClass("active");
        } else {
            $("#yzxdCL li:last").addClass("active");
        }
        // 判断数据结构 如果是项目列表结构 则调取dataLoad 否则调取loadFuZhi
        if (yiZhuList[datain].Result.OUTPUT) {
            if (yiZhuList[datain].Result.OUTPUT.ITEMLIST)
                dataLoad.loadYaoPin(thisID, ybzjYaoPin, a, yiZhuList[datain]);
            else
                dataLoad.loadFuZhi(editID, ybzjYaoPin, a, yiZhuList[datain]);
        } else {
            dataLoad.loadYaoPin(thisID, ybzjYaoPin, a, yiZhuList[datain]);
        }

        $("#appDateTime").text(a.kssj);

    }

    // 成套 检查项目是否录入正确
    function confirmOrdAct(thisID) {
        $("#yzxdTwoJi").show();     // 医嘱下达二级显示
        $("#yzxdTwoJiHeight").show();     // 非成套显示
        $("#yzxdYaoNR").show();
        $("#yzxdTwoJiChengTao").hide();   // 成套隐藏
        $("#yzxdBiaoTi").show();    // 医嘱下达顶部标题显示

        var thisName = thisID.parent().find(".textsmall").eq(0).text();
        var xmID = thisID.parent().attr("data-xmid");
        var ctName = $("#yzxd-name").text();
        var ctxmID = $("#yzxd-name").attr("name");
        var xh = thisID.parent().attr("data-xh");
        var xgxh = thisID.parent().attr("data-xgxh");

        var sfjc;  // 是否检查
        if (thisID.hasClass("yesJC")) sfjc = true;
        else sfjc = false;

        $("#buttonBack").attr("data-state", "ct").attr("data-ctName", ctName).attr("data-ctxmID", ctxmID);  // 给返回按钮标注一个成套标记状态，方便返回的时候 回到成套列表 | 成套名称 | 成套ID

        $("#yzxdBiaoTi font").text("成套医嘱编辑");

        // 如果是药品才更新data-xgxh
        if ($("#chengTaozyyy").find(".activeJC").length > 0) {
            $("#yzxd-name").attr("name", "xmIDct" + xmID).attr("data-xh", xh).attr("data-xgxh", xgxh).text(thisName);
        } else {
            $("#yzxd-name").attr("name", "xmIDct" + xmID).attr("data-xh", xh).attr("data-xgxh", "").text(thisName);
        }

        var responseTxt = yiZhuList[yiZhuList.length - 1];
        var a = {};
        // 提取要编辑的数据 如果没检查 读取原Json数据，如果已检查，读取保存的数据
        if (sfjc == false) {
            for (var i = 0; i < responseTxt.Result.CTDETAIL.ITEMLIST.ITEM.length; i++) {
                if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH == xh) {
                    var cjffdd = "";
                    var gytjdd = "";
                    var fyyfdd = "";
                    var jcxmct = [];
                    var jyxmct = [];
                    var sqfxct = [];
                    // 提取申请附项
                    if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SQFX !== undefined && responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SQFX) {
                        $.each(responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SQFX.ITEM, function (sqfxi, sqfxItem) {
                            sqfxct.push({
                                xh: sqfxItem.XH,
                                xm: sqfxItem.XM,
                                bt: sqfxItem.BT,
                                yxID: sqfxItem.YSID,
                                nr: sqfxItem.NR == null ? "" : sqfxItem.NR
                            });
                        });
                    }
                    // 如果是药品
                    if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "5" || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "6") {
                        // 提取给药途径ID
                        if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6) {
                            $.each(responseTxt.Result.CTDETAIL.GYTJ.ITEM, function (n, value) {
                                if (value.MC == responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYTJ) {
                                    gytjdd = value.ID;
                                    return false;
                                }
                            });
                        } else {
                            gytjdd = "";
                        }
                        // 提取发药药房ID
                        $.each(responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].FYYF.ITEM, function (n, value) {
                            if (value.MC == responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSMC) {
                                fyyfdd = value.ID;
                                return false;
                            }
                        });
                        a = {
                            yzfl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 0 ? "长期医嘱" : "临时医嘱",
                            name: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC,
                            sfjj: "no",
                            kssj: utils.todayNow(),
                            gytj: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYTJ : "",
                            gytjID: gytjdd,
                            cjff: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C" ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYTJ : "",
                            cjffID: cjffdd,
                            cjks: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C" ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYKSMC : "",
                            cjksID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C" ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYKSID : "",
                            zxks: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? "" : responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSMC,
                            zxksID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? "" : responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSID,
                            zxpl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXPC,
                            sjfa: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SJFA,
                            dl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].DL,
                            gyzx: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYKSMC : "",
                            gyzxID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYKSID,
                            fyyf: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSMC : "",
                            yfID: fyyfdd,
                            zxxz: "正常",
                            yszt: "",
                            ID: "",
                            ybID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH,
                            xmID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID,
                            ts: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].TS,
                            zl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZL,
                            jyxm: "",
                            jcxm: "",
                            sqfx: sqfxct,
                            xh: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH
                        };

                        // 再判断是否是一并追加的药 并且 一并头目药品已经检查
                        if (xgxh == $("#yzxdTwoJiChengTao").find(".activeJC").parent().parent().parent().attr("data-xgxh") && $("#yzxdTwoJiChengTao").find(".activeJC").parent().parent().prev().hasClass("yesJC")) {
                            var xhFather = $("#yzxdTwoJiChengTao").find(".activeJC").parent().parent().parent().attr("data-xh");
                            $.each(ctObjectData, function (n, value) {
                                if (value.xh == xhFather) {
                                    a.sfjj = value.sfjj;
                                    a.kssj = value.kssj;
                                    a.gytj = value.gytj;
                                    a.gytjID = value.gytjID;
                                    a.zxpl = value.zxpl;
                                    a.sjfa = value.sjfa;
                                    a.gyzx = value.gyzx;
                                    a.gyzxID = value.gyzxID;
                                    a.zxxz = value.zxxz;
                                    a.ds = value.ds;
                                    a.ts = value.ts;
                                    return false;
                                }
                            });
                        }
                        break;
                        // 如果是检查
                    } else if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "D") {
                        // 提取检查项目 （通过当前项目的XMID去找相同的检查项目，这是因为后台分开返回的）
                        $.each(responseTxt.Result.CTDETAIL.ITEMLIST.ITEM, function (n, value) {
                            if (value.ZLXMID == responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID) {
                                // 匹配检查项目的检查方法字符串
                                var jcxmffStrCt = "";
                                $.each(value.JCBW.ITEM, function (strFFi, strFF) {
                                    if (strFF.BW == value.BBBW) {
                                        jcxmffStrCt = strFF.FF;
                                        return false;
                                    }
                                });
                                debugger;
                                // 追加检查部位
                                jcxmct.push({
                                    jcxmmc: value.BBBW,
                                    jcxmff: value.JCFF,
                                    jcxmffStr: jcxmffStrCt,
                                    jcxmDanDuo: utils.charpipei(jcxmffStrCt, value.JCFF)
                                });
                            }
                        });
                        a = {
                            yzfl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 0 ? "长期医嘱" : "临时医嘱",
                            name: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC,
                            sfjj: "no",
                            kssj: utils.todayNow(),
                            gytj: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYTJ : "",
                            gytjID: gytjdd,
                            cjff: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C" ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYTJ : "",
                            cjffID: cjffdd,
                            cjks: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C" ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYKSMC : "",
                            cjksID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C" ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYKSID : "",
                            zxks: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? "" : responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSMC,
                            zxksID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? "" : responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSID,
                            zxpl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXPC,
                            sjfa: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SJFA,
                            dl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].DL,
                            gyzx: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYKSMC : "",
                            gyzxID: "",
                            fyyf: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSMC : "",
                            zxxz: "正常",
                            yszt: "",
                            ID: "",
                            ybID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH,
                            xmID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID,
                            ts: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].TS,
                            zl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZL,
                            jyxm: "",
                            jcxm: jcxmct,
                            sqfx: sqfxct,
                            xh: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH
                        };
                        break;
                        // 如果是检验
                    } else if (responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C") {
                        // 提取采集方法ID
                        $.each(responseTxt.Result.CTDETAIL.CJFF.ITEM, function (n, value) {
                            if (value.MC == responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYTJ) {
                                cjffdd = value.ID;
                                return false;
                            }
                        });
                        debugger;
                        // 提取检验项目 （通过当前项目的SGBM去找相同的检验项目，这是因为后台分开返回的）
                        $.each(responseTxt.Result.CTDETAIL.ITEMLIST.ITEM, function (ctJyxmI, ctJyxmValue) {
                            if (ctJyxmValue.SGBM == responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SGBM) {
                                // 追加检验项目
                                jyxmct.push({
                                    jyxmmc: ctJyxmValue.MC,
                                    jyxmID: ctJyxmValue.ZLXMID,
                                    bbbw: ctJyxmValue.BBBW,
                                    czlx: ctJyxmValue.CZLX,
                                    sgbh: ctJyxmValue.SGBM
                                });
                            }
                        });

                        a = {
                            yzfl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 0 ? "长期医嘱" : "临时医嘱",
                            name: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC,
                            sfjj: "no",
                            kssj: utils.todayNow(),
                            gytj: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYTJ : "",
                            gytjID: gytjdd,
                            cjff: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C" ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYTJ : "",
                            cjffID: cjffdd,
                            cjks: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C" ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYKSMC : "",
                            cjksID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == "C" ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYKSID : "",
                            zxks: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? "" : responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSMC,
                            zxksID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? "" : responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSID,
                            zxpl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXPC,
                            sjfa: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SJFA,
                            dl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].DL,
                            gyzx: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].GYKSMC : "",
                            gyzxID: "",
                            fyyf: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 5 || responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].LB == 6 ? responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSMC : "",
                            zxxz: "正常",
                            yszt: "",
                            ID: "",
                            ybID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH,
                            xmID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID,
                            ts: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].TS,
                            zl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZL,
                            jyxm: jyxmct,
                            jcxm: "",
                            sqfx: sqfxct,
                            xh: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH
                        };
                        break;
                        // 其它类
                    } else {
                        a = {
                            yzfl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].QX == 0 ? "长期医嘱" : "临时医嘱",
                            name: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].MC,
                            sfjj: "no",
                            kssj: utils.todayNow(),
                            gytj: "",
                            gytjID: "",
                            cjff: "",
                            cjffID: "",
                            cjks: "",
                            cjksID: "",
                            zxks: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSMC,
                            zxksID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXKSID,
                            zxpl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZXPC,
                            sjfa: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].SJFA,
                            dl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].DL,
                            gyzx: "",
                            gyzxID: "",
                            fyyf: "",
                            zxxz: "正常",
                            yszt: "",
                            ID: "",
                            ybID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XGXH,
                            xmID: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZLXMID,
                            ts: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].TS,
                            zl: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].ZL,
                            jyxm: "",
                            jcxm: "",
                            sqfx: sqfxct,
                            xh: responseTxt.Result.CTDETAIL.ITEMLIST.ITEM[i].XH
                        };
                        break;
                    }
                }
            }//for//			
        } else {
            $.each(ctObjectData, function (n, value) {
                if (value.xh == xh) {
                    a = {
                        yzfl: value.yzfl,
                        name: value.name,
                        shbj: value.shbj,
                        yymd: value.yymd,
                        yyly: value.yyly,
                        sfjj: value.sfjj,
                        kssj: value.kssj,
                        gytj: value.gytj,
                        gytjID: value.gytjID,
                        cjff: value.cjff,
                        cjffID: value.cjffID,
                        cjks: value.cjks,
                        cjksID: value.cjksID,
                        zxks: value.zxks,
                        zxksID: value.zxksID,
                        zxpl: value.zxpl,
                        sjfa: value.sjfa,
                        dl: value.dl,
                        gyzx: value.gyzx,
                        gyzxID: value.gyzxID,
                        fyyf: value.fyyf,
                        yfID: value.yfID,
                        zxxz: value.zxxz,
                        yszt: value.yszt,
                        ID: value.ID,
                        ybID: value.ybID,
                        xmID: value.xmID,
                        ts: value.ts,
                        zl: value.zl,
                        ds: value.ds,
                        jyxm: value.jyxm,
                        jcxm: value.jcxm,
                        sqfx: sqfx,
                        xh: xh
                    };
                    return false;
                }
            });
        }

        // 药品分类
        $("#yzxdCL li").removeClass("active");
        if (a.yzfl == "长期医嘱") {
            $("#yzxdCL li:first").addClass("active");
        } else {
            $("#yzxdCL li:last").addClass("active");
        }

        // 给回传的追加数据初始会空
        ybzjYaoPin = {
            sfjj: "",
            kssj: "",
            gytj: "",
            gytjID: "",
            zxpl: "",
            sjfa: "",
            gyzx: "",
            gyzxID: "",
            zxxz: "",
            ID: "",
            ts: "",
            ds: "",
            ybID: "",
            bm: "",
            bwm: "",
            syfw: "",//适用范围
            pljg: "",//频率间隔
            plcs: "",//频率次数
            jgdw: ""//间隔单位
        }

        dataLoad.loadYaoPin(xmID, ybzjYaoPin, a, yiZhuList[yiZhuList.length - 1]);
    }

    var hammerNumberOfDaysFunction = $("#NumberOfDaysFunction .countbox-botton").hammer();
    hammerNumberOfDaysFunction.on("tap", function () {
        // $("#NumberOfDaysFunction .countbox-botton").on("touchstart",function(){  //天数
        utils.audioPlay();
        tsClickNo = tsClickNo + 1;
        // $("#NumberOfDaysFunction .countbox-botton").css("background","rgb(40, 42, 57)");
        // $(this).css("background","rgb(78, 164, 163)");
        var zhi = $(this).text();
        switch (zhi.trim()) {
            case "":                         //输入为空时
                totalsDay = "" + 0;
                $("#NumberOfDays span").addClass("text-red");            //totals为0时，显示为红色
                break;
            case "0":
                if (tsClickNo > 1) {                        //输入为0时
                    if (totalsDay == "0") {
                        totalsDay = 0;
                        $("#NumberOfDays span").addClass("text-red");            //totals为0时，显示为红色
                    } else {
                        if (totalsDay + zhi > 999) {                        //最大值小于999
                            utils.showHide("数字太大噢！");
                        } else {
                            totalsDay = totalsDay + zhi;
                            $("#NumberOfDays span").removeClass("text-red");
                        }
                    }
                } else {
                    totalsDay = 0;
                    $("#NumberOfDays span").addClass("text-red");
                }
                break;
            case ".":                         //输入为“.”时
                if (tsClickNo > 1) {
                    for (i = 0; i <= totalsDay.length; i++) { //判断是否已经有一个点号
                        if (totalsDay[i] == ".") {
                            return false;              //如果有则不再插入
                        }
                    }
                    if (totalsDay + zhi >= 999) {
                        utils.showHide("数字太大噢！");
                    } else {
                        totalsDay = totalsDay + zhi;
                    }
                } else {
                    totalsDay = 0 + zhi;
                }
                break;
            default:                  //其他情况
                if (tsClickNo > 1) {
                    if (totalsDay == "0") {
                        totalsDay = zhi;
                    } else {
                        if (totalsDay + zhi > 999) {
                            utils.showHide("数字太大噢！");
                        } else {
                            totalsDay = totalsDay + zhi;
                        }
                    }
                } else {
                    totalsDay = zhi;
                }

                $("#NumberOfDays span").removeClass("text-red");
        }

        $("#countResult-ts").text(totalsDay);

        if (totalsDay[totalsDay.length - 1] == ".") {                   //若最后一位为“.”
            var totalsDayChange = totalsDay.substr(0, totalsDay.length - 1);
            $("#NumberOfDays span").text(totalsDayChange);   //计算器左侧显示
        } else {
            $("#NumberOfDays span").text(totalsDay);   //计算器左侧显示
        }
        utils.calculateTotal();
    });

    // 总量计算器
    var totals = '0';
    var hammertotalFunction = $("#totalFunction .countbox-botton").hammer();
    hammertotalFunction.on("tap", function () {
        // $("#totalFunction .countbox-botton").on('touchstart', function(event) {
        utils.audioPlay();
        zlClickNo = zlClickNo + 1;
        // $("#totalFunction .countbox-botton").css("background","rgb(40, 42, 57)");
        // $(this).css("background","rgb(78, 164, 163)");                //改变选中数字颜色
        var zhi = $(this).text();
        switch (zhi) {
            case "":                         //输入为空时
                totals = "" + 0;
                $("#total span").addClass("text-red");            //totals为0时，显示为红色
                break;
            case "0":
                if (zlClickNo > 1) {
                    if (totals == "0") {
                        totals = 0;
                        $("#total span").addClass("text-red");            //totals为0时，显示为红色
                    } else {                      //输入为0时
                        if (totals + zhi > 99) {
                            utils.showHide("数字太大噢！");               //最大值小于99
                        } else {
                            totals = totals + zhi;
                            $("#total span").removeClass("text-red");
                        }
                    }
                } else {
                    totals = 0;
                    $("#total span").addClass("text-red");            //totals为0时，显示为红色
                }
                break;
            case ".":
                if (zlClickNo > 1) {                        //输入为“.”时
                    for (i = 0; i <= totals.length; i++) { //判断是否已经有一个点号
                        if (totals[i] == ".") {
                            return false;              //如果有则不再插入
                        }
                    }
                    if (totals >= 99) {
                        utils.showHide("数字太大噢！");
                    } else {
                        totals = totals + zhi;
                    }

                } else {
                    totals = 0 + zhi;
                }
                break;
            default:
                if (zlClickNo > 1) {                 //其他情况
                    if (totals == "0") {
                        totals = zhi;
                    } else {
                        if (totals + zhi > 99) {
                            utils.showHide("数字太大噢！");
                        } else {
                            totals = totals + zhi;
                        }
                    }
                } else {
                    totals = zhi;
                }

                $("#total span").removeClass("text-red");
        }

        $("#countResult-zl").text(totals);                       //计算器顶部显示

        if (totals[totals.length - 1] == ".") {                   //若最后一位为“.”
            var totalsChange = totals.substr(0, totals.length - 1);
            $("#total span").text(totalsChange);   //计算器左侧显示
        } else {
            $("#total span").text(totals);   //计算器左侧显示
        }

    });


    // 加载 成套项目列表
    function loadChengTaoList(startPage, jm) {
        // 加载层
        $("#LoadedTip").show();
        // 准备传入值
        var ksID = $("#slzyID").attr("data-ksid");
        var userID = $("#userInfobox font").attr("data-userid");

        $.ajax({
            url: serviceChoose + "/DC_Get_CTLists",
            type: "post",
            timeout: utils.timeoutSec(),
            dataType: "json",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "IN": {
                    "KEY": jm == undefined ? null : jm,                     //--查询关键字
                    "STARTPAGE": startPage,
                    "PAGECOUNT": "1",
                    "ITEMCOUNT": "50",
                    "RYID": userID,                  //--当前操作员ID
                    "KSID": ksID,                    //--科室ID
                    "ZD": utils.getZdId()
                }
            }),
            success: function (responseTxt) {
                if (responseTxt.Result.ERROR) {
                    $("#LoadedTip").hide();
                    utils.showHide(responseTxt.Result.ERROR.MSG);
                } else {
                    //console.log(responseTxt);
                    $("#yzxdYaoPin").empty("li").scrollTop(0);

                    if (responseTxt.Result.CTLIST.ITEMLIST !== null) {

                        $("#yzxdFanYe").text('第' + (fyText + 1) + '页：' + responseTxt.Result.CTLIST.ITEMLIST.ITEM.length + '个');
                        fyCount = responseTxt.Result.CTLIST.ITEMLIST.ITEM.length;


                        for (var yaoi = 0; yaoi < responseTxt.Result.CTLIST.ITEMLIST.ITEM.length; yaoi++) {

                            if (responseTxt.Result.CTLIST.ITEMLIST.ITEM[yaoi].ZD == 1) {
                                $("#yzxdYaoPin").append('<li><label id="ct' + responseTxt.Result.CTLIST.ITEMLIST.ITEM[yaoi].ZLXMID + '" data-bbbw="' + responseTxt.Result.CTLIST.ITEMLIST.ITEM[yaoi].BBBW + '">' + responseTxt.Result.CTLIST.ITEMLIST.ITEM[yaoi].XMMC + '</label><span class="fs1 font-24 color-jt" aria-hidden="true" data-icon=""></span></li>');
                            } else {
                                $("#yzxdYaoPin").append('<li><label id="ct' + responseTxt.Result.CTLIST.ITEMLIST.ITEM[yaoi].ZLXMID + '" data-bbbw="' + responseTxt.Result.CTLIST.ITEMLIST.ITEM[yaoi].BBBW + '">' + responseTxt.Result.CTLIST.ITEMLIST.ITEM[yaoi].XMMC + '</label><span class="fs1 font-24" aria-hidden="true" data-icon=""></span></li>');
                            }
                        }

                    } else {
                        $("#yzxdFanYe").text('第1页：0个');
                    }
                }
                $("#LoadedTip").hide();

            },
            complete: function (XMLHttpRequest, status) {
                utils.errorAjax(status, loadChengTaoList, [startPage, jm]);
            }
        });
    }

    // 医嘱复制 点击确定
    var hammerbuttonyzfzConfirm = $("#buttonyzfzConfirm").hammer();
    hammerbuttonyzfzConfirm.on("tap", function () {
        if ($("#selectValue").text() > 0) {
            // 准备传入值
            var yzid = "";
            var yzidArry = [];
            $("#yzfzInfo table tr").each(function () {
                if ($(this).find(".selectYes").length > 0) {
                    yzid = yzid + $(this).attr("id").replace('yzfz', "") + ",";
                    yzidArry.push($(this).attr("id").replace('yzfz', ""));
                }
            });
            if (yzid !== "") yzid = yzid.substring(0, yzid.length - 1);
            var qx = $("#yzfzCL .active").text() == "长期医嘱" ? "长嘱" : "临嘱";
            var patiID = $("#yzfzBingRen").find(".active").attr("data-patiid");  //病人ID
            var pageID = $("#yzfzBingRen").find(".active").attr("data-pageid");    //第几次住院
            var baby = $("#yzfzBingRen").find(".active").attr("data-baby");      // 是否婴儿
            var ksID = $("#yzfzBingRen").find(".active").attr("data-ksid");           // 科室ID
            var nnowPage = $("#yzfzInfo").attr("data-nowpage"); //医嘱复制某个病人的医嘱 当前查看的页

            copyYzList();
            function copyYzList() {
                $("#LoadedTip").show();
                $.ajax({
                    url: serviceChoose + '/DC_Advice_NewLists',
                    type: "post",
                    timeout: utils.timeoutSec(),
                    data: JSON.stringify({
                        "IN":
                        {
                            "QX": qx,
                            "XX": "所有",
                            "ID": yzid,            //勾选的多个医嘱的ID，用英文逗号分隔
                            "PATIID": patiID,
                            "PAGEID": pageID,
                            "BABY": baby,
                            "STARTPAGE": nnowPage - 1,  // 从当前页的前一页开始
                            "PAGECOUNT": "1",
                            "ITEMCOUNT": "50",
                            "KSID": ksID,
                            "ZD": utils.getZdId()
                        }
                    }),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function (responseTxt) {
                        if (responseTxt.Result.ERROR) {
                            $("#LoadedTip").hide();
                            utils.showHide(responseTxt.Result.ERROR.MSG);
                        } else {
                            yiZhuList.push(responseTxt);
                            // 准备复制的医嘱数据 存入待保存
                            var tsText = []; // 记录不能复制的提示条数
                            $.each(yzidArry, function (n, value) {
                                $.each(responseTxt.Result.OUTPUT.YZLIST.YZ, function (i, yz) {
                                    if (yz.ID == value) {
                                        var returnJG = MXtiQu(responseTxt, yz, "copy");
                                        if (returnJG == "cantEdit") tsText.push("1");
                                        return false;
                                    }
                                });
                            });
                            if (tsText.length == 0 || tsText.length < yzidArry.length) {
                                if (tsText.length !== 0 && tsText.length < yzidArry.length) {
                                    utils.showHide("有" + tsText.length + "条医嘱欠缺必填项，不能复制");
                                }
                                // 隐藏该隐藏的
                                $("#yzfzBox").removeClass('animated').removeClass('bounceInRight').hide();
                                $("#yzfzFather").hide();
                                $(".tmc").hide();
                                // 显示该显示的
                                $("#yzxdFather").show();  //居中宽度透明底层
                                //$("#yzxdBox").addClass('animated').addClass('bounceInRight').show(); //下达块
                                $("#yzxdBox").show();
                                $("#yzxdBiaoTi").hide();
                                $("#yzdbcBiaoTi").show();
                                $("#yzxdDaiBaoCun").show();
                                $("#yzxdCL").hide();
                                $("#yzxdOneJi").hide();
                                $("#dbcButtonQX").show();
                                $("#dbcButtonBC").show();
                                // 追加一个药品ID
                                appendYpid();
                                daiBaoCunUpdate();
                            } else {
                                utils.showHide("已选医嘱欠缺必填项，不能复制");
                            }
                        }
                        $("#LoadedTip").hide();
                    },
                    complete: function (XMLHttpRequest, status) {
                        utils.errorAjax(status, copyYzList, []);
                    }
                });
            }
        } else {
            utils.showHide("请选择医嘱");
        }
    });

    // 提取返回过来的医嘱数据 编辑/复制 会用
    function MXtiQu(responseTxt, yz, editOrCopy) {         // 数据集，当前医嘱，编辑/复制的标记，默认修改
        var Ms = editOrCopy == undefined ? 0 : null;   // （新开：传null；修改：传0）
        var cjksid = "";
        var cjffid = "";
        var zxksid = "";
        var gytjid = "";
        var yfid = "";
        var editJyxm = [];
        var yzfzJcxm = [];
        var gqYz = "canEdit"; // 判断过期医嘱，默认可以复制
        // 判断开始时间是否有秒，如果有就抹掉
        var yz_kssj = yz.KSZXSJ;
        var miaoLength = yz.KSZXSJ.split(":");
        if (miaoLength.length > 2) {
            yz_kssj = miaoLength[0] + ":" + miaoLength[1];
        }
        // 提取申请副项 只有检查检验才有
        function yzfzSQFX() {
            var yzfzSqfx = [];
            if (yz.SQFX == null) {
                yzfzSqfx = "";
            } else {
                $.each(yz.SQFX.ITEM, function (sqfxi, sqfxItem) {
                    yzfzSqfx.push({
                        xh: sqfxItem.XH,
                        xm: sqfxItem.XM,
                        bt: sqfxItem.BT,
                        yxID: sqfxItem.YSID,
                        nr: sqfxItem.NR == null ? "" : sqfxItem.NR
                    });
                });
            }
            return yzfzSqfx;
        }
        // 如果是药品 读取LIST
        if (yz.ZLLB == 5 || yz.ZLLB == 6) {
            $.each(yz.ITEMLIST.ITEM, function (nn, item) {
                // 判断抗生素是否需要审核
                var shbj = '0';
                var ren_KSS = $("#userInfobox > font").attr("data-jb");
                var yao_KSS = item.KSS;
                if ((yao_KSS == 2 && ren_KSS == 1) || (yao_KSS == 3 && (ren_KSS == 1 || ren_KSS == 2))) {
                    shbj = '1';
                }

                // 提取给药途径ID
                if (responseTxt.Result.OUTPUT.GYTJ !== null) {
                    $.each(responseTxt.Result.OUTPUT.GYTJ.ITEM, function (xhi, gytjitem) {
                        if (gytjitem.MC == yz.YF) {
                            gytjid = gytjitem.ID;
                            return false;
                        }
                    });
                }

                // 提取药房ID
                if (item.FYYF !== null) {
                    $.each(item.FYYF.ITEM, function (yfi, yfitem) {
                        if (item.ZXKS == yfitem.MC) {
                            yfid = yfitem.ID;
                            return false;
                        }
                    });
                }

                // 提取给药执行ID
                var gyzxid = "";
                if (responseTxt.Result.OUTPUT.ZXKS !== null) {
                    $.each(responseTxt.Result.OUTPUT.ZXKS.ITEM, function (gyzxi, gyzxitem) {
                        if (gyzxitem.MC == yz.ZXKS) {
                            gyzxid = gyzxitem.ID;
                            return false;
                        }
                    });
                }
                //编辑时候存储给药频次，间隔单位，后面备用
                var syfw = '', pljg = '', plcs = '', jgdw = '', bm = '';
                if (responseTxt.Result.OUTPUT.ZXPC !== null) {
                    $.each(responseTxt.Result.OUTPUT.ZXPC.ITEM, function (pcnum, pcitem) {
                        if (pcitem.MC == yz.ZXPC) {
                            syfw = pcitem.SYFW;//适用范围
                            pljg = pcitem.PLJG;//频率间隔
                            plcs = pcitem.PLCS;//频率次数
                            jgdw = pcitem.JGDW;//间隔单位
                            bm = pcitem.BM//频次ID
                            return false;
                        }
                    });
                }
                if ((editOrCopy == "copy" && gyzxid !== "" && yfid !== "" && gytjid !== "") || (editOrCopy == undefined)) {
                    doctorActiveMX.push({
                        yzfl: yz.YZQX == "0" ? "长期医嘱" : "临时医嘱",
                        yzlb: item.ZLLB,
                        name: item.YZNR,
                        ybbl: item.ZY,
                        ybmc: null,
                        yymd: item.YYMD,
                        yyly: item.YYLY,
                        shbj: shbj,
                        sfjj: yz.JJBZ == "0" || yz.JJBZ == "2" ? "no" : "yes",
                        kssj: Ms == null ? utils.todayNow() : yz_kssj,  // 如果是新开，时间为当前时间
                        gytj: yz.YF,
                        cjff: "",
                        cjffID: "",
                        cjks: "",
                        zxks: "",
                        zxpl: yz.ZXPC,
                        sjfa: yz.ZXSJFA,
                        dl: item.DCYL,
                        gyzx: yz.ZXKS,
                        fyyf: item.ZXKS,
                        zxxz: item.ZXXZ,
                        yszt: item.YSZT,
                        ID: "", //药自身ID 
                        ybID: item.XGID, //一并给药ID
                        xmID: item.ZLXMID,        // 医嘱JSON本身的ymID
                        ts: item.TS,
                        zl: yz.YZQX == "0" ? "" : item.ZGYL, //只有临嘱才有总量
                        jyxm: "",
                        jcxm: "",
                        sqfx: "",
                        ct: "no",
                        dataIndex: yiZhuList.length - 1,
                        cjksID: "",
                        gyzxID: gyzxid,
                        zxksID: "",
                        yfID: yfid,
                        gytjID: gytjid,
                        //ds: yz.YSZT == null ? "" : yz.YSZT.replace("滴/分钟", ""),  // 当是药品的时候，外层数组内的医生嘱托就为滴速的值
                        ds:yz.YSZT==null ? "":parseInt(yz.YSZT),  // 当是药品的时候，外层数组内的医生嘱
                        sfxmID: item.SFXMID,      // 医嘱JSON本身的项目ID
                        MS: Ms,                    //（新开：传空；修改：传0）
                        YZNR: yz.YZNR,
                        YZZT: yz.YZZT,
                        editID: yz.ID,
                        editListID: item.ID,
                        jlxs: item.JLXS,
                        flsx: item.FLSX,
                        zybz: item.ZYBZ,
                        bm: bm,
                        bwm: item.BWM,//本位码
                        syfw: syfw,//适用范围
                        pljg: pljg,//频率间隔
                        plcs: plcs,//频率次数
                        jgdw: jgdw//间隔单位
                    });
                } else {
                    gqYz = "cantEdit";
                }
            });
            // 如果是检验 读取LIST
        } else if (yz.ZLLB == "C") {
            // 提取采集方法ID
            if (responseTxt.Result.OUTPUT.CJFF !== null) {
                $.each(responseTxt.Result.OUTPUT.CJFF.ITEM, function (nn, item) {
                    if (item.MC == yz.YF) {
                        cjffid = item.ID;
                        return false;
                    }
                });
            }
            // 提取采集科室ID
            if (responseTxt.Result.OUTPUT.ZXKS !== null) {
                $.each(responseTxt.Result.OUTPUT.ZXKS.ITEM, function (nn, item) {
                    if (item.MC == yz.ZXKS) {
                        cjksid = item.ID;
                        return false;
                    }
                });
            }
            // 提取执行科室ID
            if (responseTxt.Result.OUTPUT.ZXKS !== null) {
                $.each(responseTxt.Result.OUTPUT.ZXKS.ITEM, function (nn, item) {
                    if (item.MC == yz.ITEMLIST.ITEM[0].ZXKS) {
                        zxksid = item.ID;
                        return false;
                    }
                });
            }
            // 提取检验项目
            $.each(yz.ITEMLIST.ITEM, function (nn, item) {
                editJyxm.push({
                    jyxmmc: item.YZNR,
                    bbbw: item.BBBW,
                    jyxmID: item.ZLXMID,
                    czlx: item.CZLX,
                    sgbh: item.SGBM,
                    ybbl: item.ZY, // 医保比例
                    ybmc: null,    // 医保名称
                });
            });

            if ((editOrCopy == "copy" && cjffid !== "" && cjksid !== "" && zxksid !== "") || (editOrCopy == undefined)) {
                doctorActiveMX.push({
                    yzfl: yz.YZQX == "0" ? "长期医嘱" : "临时医嘱",
                    yzlb: yz.ZLLB,
                    name: "标本：" + editJyxm[0].bbbw + " | " + editJyxm[0].jyxmmc + "等" + editJyxm.length + "个项目",
                    //ybbl:yz.ZY,
                    //ybmc:null,
                    sfjj: yz.JJBZ == "0" || yz.JJBZ == "2" ? "no" : "yes",
                    kssj: Ms == null ? utils.todayNow() : yz_kssj,  // 如果是新开，时间为当前时间
                    gytj: "",
                    cjff: yz.YF,
                    cjffID: cjffid,
                    cjks: yz.ZXKS,                    // 采集科室在外面
                    zxks: yz.ITEMLIST.ITEM[0].ZXKS,   // 执行科室在里面
                    zxpl: yz.ZXPC,
                    sjfa: "",
                    dl: yz.DCYL == null ? "" : yz.DCYL,
                    gyzx: "",
                    fyyf: "",
                    zxxz: "正常",
                    yszt: yz.YSZT,
                    ID: "", //药自身ID 
                    ybID: "", //一并给药ID
                    xmID: yz.ZLXMID,        // 医嘱JSON本身的ymID
                    ts: yz.TS,
                    zl: yz.YZQX == "0" ? "" : yz.ZGYL, //只有临嘱才有总量
                    jyxm: editJyxm,
                    jcxm: "",
                    sqfx: yzfzSQFX(),
                    ct: "no",
                    dataIndex: yiZhuList.length - 1,
                    cjksID: cjksid,
                    gyzxID: "",
                    zxksID: zxksid,
                    yfID: "",
                    gytjID: "",
                    ds: "",
                    sfxmID: "",               // 医嘱JSON本身的项目ID
                    MS: Ms,                    //（新开：传空；修改：传0）
                    YZNR: yz.YZNR,
                    YZZT: yz.YZZT,
                    editID: yz.ID,
                    editListID: yz.ID
                });
            } else {
                gqYz = "cantEdit";
            }
            // 如果是检查
        } else if (yz.ZLLB == "D") {
            // 提取检查部位
            if (yz.ITEMLIST !== null) {
                $.each(yz.ITEMLIST.ITEM, function (nn, item) {
                    // 检查部位可选检查方法
                    var jcbwff = "";
                    if (responseTxt.Result.OUTPUT.JCBW instanceof Array) {
                        $.each(responseTxt.Result.OUTPUT.JCBW, function (jci, jcbw) {
                            if (item.ZLXMID == jcbw.ZLXMID) {
                                $.each(jcbw.ITEM, function (nnn, fcbwitem) {
                                    if (fcbwitem.BW == item.BBBW) {
                                        jcbwff = fcbwitem.FF;
                                        return false;
                                    }
                                });
                                return false;
                            }
                        });
                    } else {
                        $.each(responseTxt.Result.OUTPUT.JCBW.ITEM, function (nnn, fcbwitem) {
                            if (fcbwitem.BW == item.BBBW) {
                                jcbwff = fcbwitem.FF;
                                return false;
                            }
                        });
                    }
                    yzfzJcxm.push({
                        jcxmmc: item.BBBW,
                        jcxmff: item.JCFF,
                        jcxmffStr: jcbwff,
                        jcxmDanDuo: utils.charpipei(jcbwff, item.JCFF)
                    });
                });
            }
            // 提取执行科室ID
            if (responseTxt.Result.OUTPUT.ZXKS !== null) {
                $.each(responseTxt.Result.OUTPUT.ZXKS.ITEM, function (zxksi, zxksitem) {
                    if (zxksitem.MC == yz.ZXKS) {
                        zxksid = zxksitem.ID;
                        return false;
                    }
                });
            }
            if ((editOrCopy == "copy" && zxksid !== "") || (editOrCopy == undefined)) {
                doctorActiveMX.push({
                    yzfl: yz.YZQX == "0" ? "长期医嘱" : "临时医嘱",
                    yzlb: yz.ZLLB,
                    name: yz.YZNR,
                    ybbl: yz.ZY,
                    ybmc: null,
                    sfjj: yz.JJBZ == "0" || yz.JJBZ == "2" ? "no" : "yes",
                    kssj: Ms == null ? utils.todayNow() : yz_kssj,  // 如果是新开，时间为当前时间
                    gytj: "",
                    cjff: "",
                    cjffID: "",
                    cjks: "",
                    zxks: yz.ZXKS,
                    zxpl: yz.ZXPC,
                    sjfa: "",
                    dl: yz.DCYL == null ? "" : yz.DCYL,
                    gyzx: "",
                    fyyf: "",
                    zxxz: yz.ZXXZ,
                    yszt: yz.YSZT,
                    ID: "", //药自身ID 
                    ybID: "", //一并给药ID
                    xmID: yz.ZLXMID,        // 医嘱JSON本身的ymID
                    ts: yz.TS,
                    zl: yz.YZQX == "0" ? "" : yz.ZGYL, //只有临嘱才有总量
                    jyxm: "",
                    jcxm: yzfzJcxm,
                    sqfx: yzfzSQFX(),
                    ct: "no",
                    dataIndex: yiZhuList.length - 1,
                    cjksID: "",
                    gyzxID: "",
                    zxksID: zxksid,
                    yfID: "",
                    gytjID: "",
                    ds: "",
                    sfxmID: "",      // 医嘱JSON本身的项目ID
                    MS: Ms,                    //（新开：传空；修改：传0）
                    YZNR: yz.YZNR,
                    YZZT: yz.YZZT,
                    editID: yz.ID,
                    //editListID:item.ID
                });
            } else {
                gqYz = "cantEdit";
            }
            // 其它类
        } else {
            // 提取执行科室ID
            if (responseTxt.Result.OUTPUT.ZXKS !== null) {
                $.each(responseTxt.Result.OUTPUT.ZXKS.ITEM, function (zxksi, zxksitem) {
                    if(zxksitem.MC == '无执行叮嘱'){
                        zxksid = '10';
                        return false;
                    }
                    if (zxksitem.MC == yz.ZXKS) {
                        zxksid = zxksitem.ID;
                        return false;
                    }
                });
            }
            if ((editOrCopy == "copy" && zxksid !== "") || (editOrCopy == undefined)) {
                doctorActiveMX.push({
                    yzfl: yz.YZQX == "0" ? "长期医嘱" : "临时医嘱",
                    yzlb: yz.ZLLB,
                    name: yz.YZNR,
                    ybbl: yz.ZY,
                    ybmc: null,
                    sfjj: yz.JJBZ == "0" || yz.JJBZ == "2" ? "no" : "yes",
                    kssj: Ms == null ? utils.todayNow() : yz_kssj,  // 如果是新开，时间为当前时间
                    gytj: "",
                    cjff: "",
                    cjffID: "",
                    cjks: "",
                    zxks: yz.ZXKS,
                    zxpl: yz.ZXPC,
                    sjfa: "",
                    dl: yz.DCYL == null ? "" : yz.DCYL,
                    gyzx: "",
                    fyyf: "",
                    zxxz: "正常",
                    yszt: yz.YSZT,
                    ID: "", //药自身ID 
                    ybID: "", //一并给药ID
                    xmID: yz.ZLXMID,        // 医嘱JSON本身的ymID
                    ts: yz.TS,
                    zl: yz.YZQX == "0" ? "" : yz.ZGYL, //只有临嘱才有总量
                    jyxm: "",
                    jcxm: "",
                    sqfx: "",
                    ct: "no",
                    dataIndex: yiZhuList.length - 1,
                    cjksID: "",
                    gyzxID: "",
                    zxksID: zxksid,
                    yfID: "",
                    gytjID: "",
                    ds: "",
                    sfxmID: "",      // 医嘱JSON本身的项目ID
                    MS: Ms,                    //（新开：传空；修改：传0）
                    YZNR: yz.YZNR,
                    YZZT: yz.YZZT,
                    editID: yz.ID
                });
            } else {
                gqYz = "cantEdit";
            }
        }
        return gqYz;
    }

    // 编辑医嘱
    var hammeryzButtonEdit = $("#yzButtonEdit").hammer();
    hammeryzButtonEdit.on("tap", function () {
        if (!$(this).hasClass("noEdit")) {
            // 判断是否有抗生素权限
            var ren_KSS = $("#userInfobox > font").attr("data-jb");
            var ren_CFZW = $("#userInfobox > font").attr("data-pr");
            var yao_KSS = $("#CQATable tr.active > td").eq(2).find("p").eq(0).attr("data-kss");
            var yao_CFZW;
            var permissions = 'yes';
            if (yao_KSS !== undefined) {
                $("#CQATable tr.active > td").eq(2).children("p").each(function (i, v) {
                    yao_KSS = $(v).attr("data-kss");
                    yao_CFZW = $(v).attr("data-cfzw");
                    // 判断是否够权限			
                    if (ren_CFZW < yao_CFZW || ren_CFZW == yao_CFZW || yao_CFZW == 0) {
                        // 抗生素是否需审核
                        if (ren_KSS == 0 && (yao_KSS == 1 || yao_KSS == 2 || yao_KSS == 3)) {
                            utils.showHide("抗生素用药等级不够。");
                            permissions = 'no';
                            return false;
                        }/*else if((yao_KSS==2 && ren_KSS==1) || (yao_KSS==3 && (ren_KSS==1 || ren_KSS==2))){
							//需要审核	这个放在其它地方处理了							
						}else{
							//不需要审核
						}*/
                    } else {
                        utils.showHide("处方职务用药等级不够。");
                        permissions = 'no';
                        return false;
                    }
                });
            }
            if (permissions == 'no') return false;

            // 准备传入值
            var qx = $("#qxSelect .XuanZhong").attr("data-text");
            var xx = $("#flSelect .XuanZhong").attr("data-text");
            var yzID = $("#CQATable tr.active").attr("id");
            var patiID = $("#slzyID").attr("data-patiid");
            var pageID = $("#slzyID").attr("data-pageid");
            var baby = $("#slzyID").attr("data-baby");
            var ksID = $("#slzyID").attr("data-ksid");
            var ysID = $("#userInfobox font").attr("data-userid");

            editLoad();
            function editLoad() {
                $("#LoadedTip").show();
                $.ajax({
                    url: serviceChoose + '/DC_Advice_NewLists',
                    type: "post",
                    data: JSON.stringify({
                        "IN":
                        {
                            "QX": qx,
                            "XX": xx,
                            "ID": yzID,
                            "PATIID": patiID,
                            "PAGEID": pageID,
                            "BABY": baby == "yes" ? 1 : 0,
                            "KSID": ksID,
                            "YSID": ysID,
                            "JM": null,          //简码，用于关键字查询
                            "STARTPAGE": "0",
                            "PAGECOUNT": "1",
                            "ITEMCOUNT": "50",
                            "ZD": utils.getZdId()
                        }
                    }),
                    timeout: utils.timeoutSec(),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success: function (responseTxt) {
                        if (responseTxt.Result.ERROR) {
                            $("#LoadedTip").hide();
                            utils.showHide(responseTxt.Result.ERROR.MSG);
                        } else {
                            //console.log(responseTxt);
                            yiZhuList.push(responseTxt);
                            // 显示该显示的
                            $("#yzxdTwoJi").hide();
                            $("#yzxdFather").show();                                                               //居中宽度透明底层
                            //$("#yzxdBox").addClass('animated').addClass('bounceInRight').show();                   //下达块
                            $("#yzxdBox").show()
                            $("#yzxdBiaoTi").hide();
                            $("#yzdbcBiaoTi").show();
                            $("#yzxdDaiBaoCun").show();
                            $("#yzxdCL").hide();
                            $("#yzxdOneJi").hide();
                            $("#dbcButtonQX").show();
                            $("#dbcButtonBC").show();
                            $("#newOd-ButtonYBZJ").addClass("buttonNoEdit");                                       //待保存追加按钮
                            $("#newOd-TextYBZJ").addClass("textNoEdit");                                           //待保存追加按钮
                            $("#newOd-newOdButton").addClass("buttonNoEdit");                                      //待保存新开按钮
                            $("#yzxdDaiBaoCun .yzDBCButtonBox .buttonText:first").addClass("textNoEdit");          //待保存新开按钮
                            $("#newOd-ButtonDell").addClass("buttonNoEdit");                                       //待保存删除按钮
                            $("#yzxdDaiBaoCun .yzDBCButtonBox .buttonText").eq(2).addClass("textNoEdit");          //待保存删除按钮

                            // 提取返回过来要编辑的医嘱数据
                            MXtiQu(responseTxt, responseTxt.Result.OUTPUT.YZLIST.YZ[0]);

                            //console.log(doctorActiveMX);
                            // 追加一个药品ID
                            appendYpid();
                            daiBaoCunUpdate();
                        }
                        $("#LoadedTip").hide();
                    },
                    complete: function (XMLHttpRequest, status) {
                        utils.errorAjax(status, editLoad, []);
                    }
                });
            }
        }
    });

    // 停用医嘱  
    var hammeryzButtonTZhi = $("#yzButtonTZhi").hammer();
    hammeryzButtonTZhi.on("tap", function () {
        if (!$(this).hasClass("noEdit")) {
            if ($("#CQATable").find(".active").length > 0) {
                $("#timeControlWrapF").show();
                var now = utils.todayNow();
                dateTime.dateTimeScroll(now, "timeControlWrapKJ", yzTingZhi);
            } else {
                utils.showHide("请选择医嘱");
            }
        }
    });
    function yzTingZhi() {
        var yzID = $("#CQATable tr.active").attr("id");
        var tzYS = $("#userInfobox font").text();
        $("#LoadedTip").show();
        $.ajax({
            url: serviceChoose + "/DC_Advice_Stop",
            type: "post",
            timeout: utils.timeoutSec(),
            dataType: "json",
            type: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                "IN": {
                    "YZID": yzID,
                    "TZSJ": $("#dateTime > p").text(),
                    "TZYS": JSON.parse(localStorage.userInfo).Result.XM
                }
            }),
            success: function (responseTxt) {
                if (responseTxt.Result.ERROR) {
                    $("#LoadedTip").hide();
                    utils.showHide(responseTxt.Result.ERROR.MSG);
                } else {
                    utils.showHide("停用成功");
                    docActListLoad("yes", 0); // 刷新当前病人的医嘱列表
                    // 关闭编辑状态
                    $("#yzButtonBox > div").hide();
                    $("#yzButtonEditOne").text("编辑").show();
                    $("#timeControlWrapF").hide();
                    $("#LoadedTip").hide();
                }
            },
            complete: function (XMLHttpRequest, status) {
                utils.errorAjax(status, yzTingZhi, []);
            }
        });
    }

    // 删除医嘱
    var hammeryzButtonDell = $("#yzButtonDell").hammer();
    hammeryzButtonDell.on("tap", function () {
        if (!$(this).hasClass("noEdit")) {
            var yzID = $("#CQATable tr.active").attr("id");

            utils.alertPrompt("您是否确认删除该医嘱？", "gantan", "qdqx");
            utils.myconfirm(okDelete, cancelDelete);

            function okDelete() {
                $("#promptQDQX").hide();
                $("#LoadedTip").show();
                $.ajax({
                    url: serviceChoose + "/DC_Advice_Delete",
                    type: "POST",
                    timeout: utils.timeoutSec(),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        "IN": {
                            "YZID": yzID,
                            "SXG": "1"
                        }
                    }),
                    success: function (responseTxt) {
                        $("#LoadedTip").hide();
                        if (responseTxt.Result.ERROR) {
                            utils.showHide(responseTxt.Result.ERROR.MSG);
                        } else {
                            utils.showHide("删除成功");
                            //docActListLoad("yes",0); // 刷新当前病人的医嘱列表
                            var trActive = $("#CQATable tr.active");//删除成功就移除医嘱
                            if (!trActive.find('td').eq(0).text()) {
                                trActive.remove();
                            } else {
                                if (!trActive.next().find('td').eq(0).text()) {
                                    var timeNeed = trActive.find('td').eq(0).text();
                                    trActive.next().find('td').eq(0).text(timeNeed);
                                    trActive.remove();
                                } else {
                                    trActive.remove();
                                }

                            }
                            // 关闭编辑状态
                            $("#yzButtonBox > div").hide();
                            $("#yzButtonEditOne").text("编辑").show();
                        }
                    },
                    complete: function (XMLHttpRequest, status) {
                        utils.errorAjax(status, okDelete, []);
                    }
                });
            }

            function cancelDelete() {
                $("#promptQDQX").hide();
            }
        }
    });

    // 作废医嘱
    var hammeryzButtonZuoFei = $("#yzButtonZFei").hammer();
    hammeryzButtonZuoFei.on("tap", function () {
        if (!$(this).hasClass("noEdit")) {
            var yzID = $("#CQATable tr.active").attr("id");
            var ysID = $("#userInfobox font").attr("data-userid");
            var ysName = $("#userInfobox font").text();

            utils.alertPrompt("您是否确认作废该医嘱？", "gantan", "qdqx");
            utils.myconfirm(okDelete, cancelDelete);

            function okDelete() {
                $("#promptQDQX").hide();
                $("#LoadedTip").show();
                $.ajax({
                    url: serviceChoose + "/DC_Advice_Invalid",
                    type: "post",
                    timeout: utils.timeoutSec(),
                    dataType: "json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        "IN": {
                            "YZID": yzID,
                            "UID": ysID,
                            "CZY": ysName,
                            "ZT": 0
                        }
                    }),
                    success: function (responseTxt) {
                        $("#LoadedTip").hide();
                        if (responseTxt.Result.ERROR) {
                            utils.showHide(responseTxt.Result.ERROR.MSG);
                        } else {
                            utils.showHide("作废成功");
                            docActListLoad("yes", 0); // 刷新当前病人的医嘱列表
                        }
                    },
                    complete: function (XMLHttpRequest, status) {
                        utils.errorAjax(status, okDelete, []);
                    }
                });
            }

            function cancelDelete() {
                $("#promptQDQX").hide();
            }
        }
    });
    //新开首页搜索键盘
    $("#searchTextDIV").hide();
    var hammerSearch = $("#searchText").hammer();
    hammerSearch.on("tap", function () {
        var Ylocation;
        Ylocation = document.getElementById("searchText").offsetLeft;
        //$("#sskeyboardbox").css({'marginLeft': 400+Ylocation+'px',});
        $("#sskeyboardbox").toggle();
        var left = document.querySelector('#yzxdBox').offsetLeft + 410;
        $("#sskeyboardbox").css('left', left);
        //判断来自移动端或者safari浏览器 ||
		if(localStorage.platform == '2' || localStorage.platform == '1' || /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent)){
			 $('#searchText').attr("disabled","disabled");
            $("#searchTextDIV").css({"opacity":"0.1"});
            //安卓无需样式
            if(localStorage.platform == '2'){
                $("#searchTextDIV").hide();
            }else{
                $("#searchTextDIV").show();
                $("#searchText").css({"color":"#000","opacity":"1"});
                //解决IOS13兼容问题
                var hammerSearchDIV = $("#searchTextDIV").hammer();
                hammerSearchDIV.on("tap", function () {
                    $("#sskeyboardbox").toggle();
                })
            }
		}
    });
    var hammerEvery = $("#sskeyboardbox .every").hammer();  //键盘
    hammerEvery.on("tap", function () {
        utils.audioPlay();
        selectchar($(this));
    });
    //搜索函数
    function selectchar(everychar) {
        if ($("#searchText").val() == "按拼音简码检索") {
            $("#searchText").val("");
            var cont = everychar.html();
            //$("#searchText").text($("#searchText").text() + cont);
            $("#searchText").val($("#searchText").val() + cont);
        } else {
            var cont = everychar.html();
            //$("#searchText").text($("#searchText").text() + cont);
            $("#searchText").val($("#searchText").val() + cont);
        }
    }
    //回退
    var hammerclearlast = $("#clearlast").hammer();
    hammerclearlast.on("tap", function () {
        utils.audioPlay();
        //没有输入时显示
        if ($("#searchText").val() != "按拼音简码检索") {
            // var schar = $("#searchText").text();
            var schar = $("#searchText").val()
            s = schar.substring(0, schar.length - 1);
            //$("#searchText").text(s);
            $("#searchText").val(s);
            // if($("#yzxdButton").find(".item").text()!=="成套"){
            // 	// 刷新非成套 从第一页开始
            // 	dataLoad.loadXiangMuList(0,s).then(function(res){
            // 		fyCount=res.count;
            // 		yiZhuList.push(res);
            // 	});
            // }else{
            // 	// 刷新成套 从第一页开始
            // 	loadChengTaoList(0,s);
            // }
        }
        //if ($("#searchText").text() == "") {
        //    $("#searchText").html("按拼音简码检索");
        //}
        if ($("#searchText").val() == "") {
            $("#searchText").val("");
        }
    });
    //确认
    var hammerclickOk = $("#clickOk").hammer();
    hammerclickOk.on("tap", function () {
        utils.audioPlay();
        // $("#sskeyboardbox").hide();
        // 根据输入的筛选文字筛选项目
        var searchText = $("#searchText").val();
        if (searchText !== "按拼音简码检索" && searchText !== "") {
            if ($("#yzxdButton").find(".item").text() !== "成套") {
                // 刷新非成套 从第一页开始
                dataLoad.loadXiangMuList(0, searchText).then(function (res) {
                    fyCount = res.count;
                    yiZhuList.push(res);
                });
            } else {
                // 刷新成套 从第一页开始
                loadChengTaoList(0, searchText);
            }
        } else {
            if ($("#yzxdButton").find(".item").text() !== "成套") {
                // 刷新非成套 从第一页开始
                dataLoad.loadXiangMuList(0).then(function (res) {
                    fyCount = res.count;
                    yiZhuList.push(res);
                });
            } else {
                // 刷新成套 从第一页开始
                loadChengTaoList(0);
            }
        }
    });

    // 给药途径键盘
    var hammerEvery = $("#newSearchTable .every").hammer();
    hammerEvery.on("tap", function () {
        if (!$(this).hasClass('jingYongYiabc')) { //按钮是否禁用
            utils.audioPlay();
            inputData($(this));
            gytjchangeList();
        }
    });
    //输入显示在输入框
    function inputData(thisData) {
        if ($("#inputEglish").html() == "按拼音简码检索") {
            $("#inputEglish").html("");
            var cont = thisData.html();
            $("#inputEglish").text(cont);
        } else {
            var cont = thisData.html();
            $("#inputEglish").text($("#inputEglish").text() + cont);
        }
    }
    //给药途径搜索改变列表
    function gytjchangeList() {
        //当前输入框的值			
        var cont = $("#inputEglish").html();
        if (cont.length > 0 && cont != "按拼音简码检索") {      //不是输入首字母移除键盘禁用
            $("#newSearchTable .search-cont .every").removeClass('jingYongYiabc');
        } else {
            gytjkeyboardshow();
        }
        //获取列表的所有英文
        var allList = [];
        var diyige = [];
        if (cont != "按拼音简码检索") {
            for (var i = 0; i < $("#yzxdGYTJ .yzxdKJ li").length; i++) {
                allList[i] = $("#yzxdGYTJ .yzxdKJ li").eq(i).attr("data-pyjm");  //获取全部拼音			 	
                diyige[i] = $("#yzxdGYTJ .yzxdKJ li").eq(i).attr("data-pyjm")[0];  //获取首字母拼音

            };
            //判断列表英文与输入是否匹配			
            if (cont.length == 1) {        //首字母匹配
                for (var i = 0; i < diyige.length; i++) {
                    if (diyige[i] == cont) {
                        $("#yzxdGYTJ .yzxdKJ li").eq(i).css("display", "block");
                    } else {
                        $("#yzxdGYTJ .yzxdKJ li").eq(i).css("display", "none");
                    }
                };
            } else {
                for (var i = 0; i < allList.length; i++) {
                    if (allList[i].indexOf(cont) != -1) {                 //能匹配
                        if (allList[i].indexOf(cont) == 0) {  //为0 是首字母匹配
                            $("#yzxdGYTJ .yzxdKJ li").eq(i).css("display", "block");
                        } else {
                            $("#yzxdGYTJ .yzxdKJ li").eq(i).css("display", "none");
                        }
                    } else {
                        $("#yzxdGYTJ .yzxdKJ li").eq(i).css("display", "none");
                    }
                }
            }
        } else {
            $("#yzxdGYTJ .yzxdKJ li").css("display", "block");
        }
    }

    //回退清空一个
    var hammerClear = $("#backClear").hammer();
    hammerClear.on('tap', function () {
        if (!$(this).hasClass('jingYongYiabc')) {
            utils.audioPlay();
            clearLastOne();
            gytjchangeList();
        }
    });
    //清除函数
    function clearLastOne() {
        if ($("#inputEglish").html() != "按拼音简码检索") {
            var schar = $("#inputEglish").text();
            arr = schar.substring(0, schar.length - 1);
            $("#inputEglish").text(arr);
        }
        if ($("#inputEglish").text() == "") {
            $("#inputEglish").html("按拼音简码检索");
        }
    }
    //添加检验项目键盘及搜索
    var hammerEvery = $("#iyxmSearchTable .every").hammer();
    hammerEvery.on("tap", function () {
        if (!$(this).hasClass('jingYongYiabc')) {
            utils.audioPlay();
            inputEngl($(this));
            changeTheli();
        }

    });
    //输入显示在输入框
    function inputEngl(thisData) {
        if ($("#jyxmEglish").html() == "按拼音简码检索") {
            $("#jyxmEglish").html("");
            var cont = thisData.html();
            $("#jyxmEglish").text(cont);
        } else {
            var cont = thisData.html();
            $("#jyxmEglish").text($("#jyxmEglish").text() + cont);
        };
    }
    //检索函数
    function changeTheli() {
        //当前输入框的值			
        var cont = $("#jyxmEglish").html();
        if (cont.length > 0 && cont != "按拼音简码检索") {      //不是输入首字母移除键盘禁用
            $("#iyxmSearchTable .search-cont .every").removeClass('jingYongYiabc');
        } else {
            keyboardshowOrhiade();
        }
        //获取列表的所有英文
        var allList = new Array();
        var diyige = [];
        if (cont != "按拼音简码检索") {
            for (var i = 0; i < $("#yzxdJYXM .yzxdKJ li").length; i++) {
                allList[i] = $("#yzxdJYXM .yzxdKJ li").eq(i).attr("data-pyjm");  //获取全部拼音			 	
                diyige[i] = $("#yzxdJYXM .yzxdKJ li").eq(i).attr("data-pyjm")[0];  //获取首字母拼音

            };
            //判断列表英文与输入是否匹配			
            if (cont.length == 1) {        //首字母匹配
                for (var i = 0; i < diyige.length; i++) {
                    if (diyige[i] == cont) {
                        $("#yzxdJYXM .yzxdKJ li").eq(i).css("display", "block");
                    } else {
                        $("#yzxdJYXM .yzxdKJ li").eq(i).css("display", "none");
                    }
                };
            } else {
                for (var i = 0; i < allList.length; i++) {
                    if (allList[i].indexOf(cont) != -1) {                 //能匹配
                        if (allList[i].indexOf(cont) == 0) {  //如果为display:none  说明首字母不匹配
                            $("#yzxdJYXM .yzxdKJ li").eq(i).css("display", "block");
                        } else {
                            $("#yzxdJYXM .yzxdKJ li").eq(i).css("display", "none");
                        }
                    } else {
                        $("#yzxdJYXM .yzxdKJ li").eq(i).css("display", "none");
                    }
                }
            }
        } else {
            $("#yzxdJYXM .yzxdKJ li").css("display", "block");
        }
    }

    //回退清空一个
    var hammerClear = $("#jyxmClearOne").hammer();
    hammerClear.on('tap', function () {
        utils.audioPlay();
        jyxmClear();
        changeTheli();
    });
    //回退清空函数
    function jyxmClear() {
        if ($("#jyxmEglish").html() != "按拼音简码检索") {
            var schar = $("#jyxmEglish").text();
            arr = schar.substring(0, schar.length - 1);
            $("#jyxmEglish").text(arr);
        }
        if ($("#jyxmEglish").text() == "") {
            $("#jyxmEglish").html("按拼音简码检索");
        }
    }
    //成套全选
    var hammerQuan = $("#quanXuan").hammer();

    hammerQuan.on('tap', function () {
        quanXuan();
    });
    function quanXuan() {
        $("#yzxdTwoJiChengTao>ul>li").each(function () {
            // 如果选中 则不选中
            if ($("#quanXuan").text() == "全选") {
                if ($(this).find(".selt").hasClass("no")) {
                    $(this).find('.selt').attr("data-icon", "").removeClass("no").addClass("yes");
                    $(this).find('.selt').parent().find(".tbspan").show();
                }
            } else {
                if ($(this).find(".selt").hasClass("yes")) {
                    $(this).find('.selt').attr("data-icon", "").removeClass("yes").addClass("no");
                    $(this).parent().find(".tbspan").hide();
                }
            }
        });
        if ($("#quanXuan").text() == "全选") {
            $("#quanXuan").text("取消全选");
        } else {
            $("#quanXuan").text("全选");
        }
    }
    //检验项目键盘显示的控制
    function keyboardshowOrhiade() {
        var jilushu = [];
        if ($("#yzxdJYXM>.yzxdKJ li").length > parseInt($("#yzxdJYXM .yzxdKJ").height() / 45)) {
            var jianpan = $("#iyxmSearchTable .search-cont .every").text();
            $("#iyxmSearchTable .search-cont .every").addClass('jingYongYiabc');
            $("#jyxmEglish").show();
            $("#iyxmSearchTable").show();
            for (var i = 0; i < $("#yzxdJYXM>.yzxdKJ li").length; i++) {
                var firstChar = $("#yzxdJYXM>.yzxdKJ li").eq(i).attr("data-pyjm")[0];
                jilushu.push(firstChar);
                if (jianpan.indexOf(firstChar) != -1) {
                    $("#iyxmSearchTable .search-cont .every").eq(jianpan.indexOf(firstChar)).removeClass('jingYongYiabc');
                }
            }
            jilushu = [];
        } else {
            $("#jyxmEglish").hide();
            $("#iyxmSearchTable").hide();
        }
    }

    //给药途径键盘显示的控制
    function gytjkeyboardshow() {
        var jilushu = [];
        if ($("#yzxdGYTJ>.yzxdKJ li").length > parseInt($("#yzxdGYTJ .yzxdKJ").height() / 45)) {
            var jianpan = $("#newSearchTable .search-cont .every").text();
            $("#newSearchTable .search-cont .every").addClass('jingYongYiabc');
            $("#inputEglish").show();
            $("#newSearchTable").show();
            for (var i = 0; i < $("#yzxdGYTJ>.yzxdKJ li").length; i++) {
                var firstChar = $("#yzxdGYTJ>.yzxdKJ li").eq(i).attr("data-pyjm")[0];
                jilushu.push(firstChar);
                if (jianpan.indexOf(firstChar) != -1) {
                    $("#newSearchTable .search-cont .every").eq(jianpan.indexOf(firstChar)).removeClass('jingYongYiabc');
                }
            }
        } else {
            $("#inputEglish").hide();
            $("#newSearchTable").hide();
        }
    }

    //待保存医嘱box的点击事件 这个一定放最底部 最后注册的事件
	/*hammeryzxdBox=$("#yzxdBox").hammer();
	hammeryzxdBox.on('tap',function(){	
		debugger;
		$("#yzDaiBaoCun-Chang li").removeClass('active');
		$("#yzDaiBaoCun-Lin li").removeClass('active');
	});*/


    // //医嘱下达li
    // $("#yzxdYaoNR .eventQY").on("touchstart touchmove",function(){
    // 	utils.CpStart($(this));
    // });
    // $("#yzxdYaoNR .eventQY").on("touchend",function(){
    // 	utils.CpEnd($(this));
    // });

    //点击出现的计算器
    $(".countbox-botton").on("touchstart touchmove", function () {
        utils.CpStartback($(this));
    });
    $(".countbox-botton").on("touchend", function () {
        utils.CpEnd($(this));
    });
    return {
        docActListLoad: docActListLoad
    }

});

