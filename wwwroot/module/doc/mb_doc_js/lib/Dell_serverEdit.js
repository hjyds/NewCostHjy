define(["jquery", "hammer", "jqueryhammer", "utils"], function (jquery, hammer, jqueryhammer, utils) {

    //1出现
    var hammertime = new Hammer(document.getElementById("loginBox"));
    hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammertime.on("swipedown", function () {
        //读数据
        if (localStorage.length > 0) {
            for (var i = 0; i < localStorage.length; i++) {
                //调用key方法获取localStorage中数据对应的键名  
                //如这里键名是从test1开始递增到testN的，那么localStorage.key(0)对应test1  

                var getKeyAll = localStorage.key(i);
                //通过键名获取值  
                var getvalue = localStorage.getItem(getKeyAll);
                //var n=0;

                if (getKeyAll.indexOf("zlSoft_docWorkStion_") != -1) {
                    var getKey = getKeyAll.replace('zlSoft_docWorkStion_', "");

                    var eachi = 0;
                    //n++;

                    for (j = 0; j < $("#dataURL-items .dataURL-item").length; j++) {

                        if ($("#dataURL-items .dataURL-item").eq(j).find(".dataURL-name").text() == getKey) {
                            break;
                        } else if ($("#dataURL-items .dataURL-item").eq(j).find(".dataURL-url").text() == getvalue) {
                            break;
                        };
                        eachi++;
                    }
                    if (eachi == $("#dataURL-items .dataURL-item").length) {
                        if (getKey == "user" || getKey == "userID" || getKey == "serviceChoose") {
                            $("#dataURL-items").append('');
                        } else {
                            $("#dataURL-items").append('<div class="dataURL-item dataURL-itemTop"> <div class="dataURL-right"> <div class="dataURL-nameInput" ><span class="dataURL-name">' + getKey + '</span><span  class="dataURL-url">' + getvalue + '</span></div> </div> <div class="dataURL-left"><span class="dataURL-delete">一</span></div></div>');
                            if (getvalue == localStorage.getItem("zlSoft_docWorkStion_serviceChoose")) {
                                $("#dataURL-items .dataURL-item").eq(eachi).append('<span class=" dataURL-choose" style="display:block">&#10004</span>');
                            }
                        }
                    }

                    //删除事件
                    var hammeroutdataURLdelete = $("#dataURL-items .dataURL-delete").hammer();
                    hammeroutdataURLdelete.on("tap", function (event) {
                        event.stopPropagation();    //  阻止事件冒泡
                        event.preventDefault();   //  阻止默认行为 ( 表单提交 )
                        clickDelet($(this));
                    });
                    //选择事件
                    var hammerDaUrlItem = $("#dataURL-items .dataURL-item").hammer();
                    hammerDaUrlItem.on("tap", function () {
                        event.stopPropagation();    //  阻止事件冒泡
                        event.preventDefault();     //  阻止默认行为 ( 表单提交 )
                        itemSelect($(this));
                    });
                    //滑动事件
                    var hammerDaUrlDelte = $("#dataURL-items .dataURL-itemTop").hammer();
                    hammerDaUrlDelte.on("press", function () {
                        dataURLedit($(this));
                    });
                }
            }
        }
        $("#dataURL").show();
        $("#dataURL").removeClass("slideOutUp").addClass("slideInDown");
    });

    // 选中ITEM
    function itemSelect(thisData) {
        $("#dataURL-items").find(".dataURL-choose").remove();
        thisData.append('<span class=" dataURL-choose" style="display:block">&#10004</span>');
        $(".dataURL-left").css("display", "none");
        var thisURL = thisData.find(".dataURL-url").html();
        localStorage.setItem("zlSoft_docWorkStion_serviceChoose", thisURL);
    }

    //滑动出现删除
    function dataURLedit(thisDelete) {
        $(".dataURL-left").css("display", "none");
        thisDelete.find(".dataURL-choose").css("display", "none");
        thisDelete.find(".dataURL-left").css("display", "inline-block");
    }

    //点击删除
    function clickDelet(clickdata) {
        clickdata.parent().parent().remove();
        var deleteItem = 'zlSoft_docWorkStion_' + clickdata.parent().parent().find(".dataURL-name").text()
        if (localStorage.getItem(deleteItem) != null) {
            localStorage.removeItem(deleteItem);
            if (clickdata.find(".dataURL-choose") && $(".dataURL-right").length > 0) {
                for (var i = 0; i < localStorage.length; i++) {
                    var getKey = localStorage.key(i);
                    if (getKey.indexOf("zlSoft_docWorkStion_") != -1) {
                        defaultURL = localStorage.getItem(getKey);
                        $("#dataURL-items .dataURL-item").eq(0).append('<span class=" dataURL-choose" style="display:block">&#10004</span>');
                        localStorage.setItem("zlSoft_docWorkStion_serviceChoose", defaultURL);
                    }
                }
            }
            if ($(".dataURL-right").length == 0) {
                localStorage.removeItem("zlSoft_docWorkStion_serviceChoose");
            }
        }
    }

    //消失
    var hammerup = new Hammer(document.getElementById("dataURL"));
    hammerup.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
    hammerup.on("swipeup", function () {
        $("#dataURL").removeClass("slideInDown").addClass("slideOutUp");
    });

    //新增获得焦点
    $("#dataname input").focus(function () {
        if ($(this).val() == "新增名称") {
            $(this).val("");
        }
    });
    $("#urlname input").focus(function () {
        if ($(this).val() == "新增地址") {
            $(this).val("")
        }
    });

    //input 失去焦点时
    $("#dataname input").blur(function () {
        if ($(this).val() == "") {
            var title = $(this).prev().html();
            $(this).val("新增" + title)
        } else {
            $(this).val()
        }
    });
    $("#urlname input").blur(function () {
        if ($(this).val() == "") {
            var title = $(this).prev().html();
            $(this).val("新增" + title)
        } else {
            $(this).val()
        }
    });

    //写入数据
    hammeradd = $("#addnew").hammer();
    hammeradd.on("tap", function () {
        var urlName = $("#dataname input").val();
        var urlData = "http://" + $("#urlname input").val() + "/ClinicalService.asmx";

        //判断为空
        if ($("#dataname input").val() == "新增名称" || $("#urlname input").val() == "新增地址" || $("#urlname input").val() == "") {
            utils.showHide("请输入");
        } else {
            // 判断重复
            var eachi = 0;
            for (i = 0; i < $("#dataURL-items .dataURL-item").length; i++) {

                if ($("#dataURL-items .dataURL-item").eq(i).find(".dataURL-name").text() == urlName) {
                    utils.showHide("名称或地址重复");
                    break;
                } else if ($("#dataURL-items .dataURL-item").eq(i).find(".dataURL-url").text() == urlData) {
                    utils.showHide("名称或地址重复");
                    break;
                }
                eachi++;
            }
            // 不重复则验证地址
            if (eachi == $("#dataURL-items .dataURL-item").length) {

                $("#LoadedTip").show();
                $.ajax({
                    url: urlData + "/GetSysDate",
                    type: "get",
                    dataType: "json",
                    success: function (responseTxt) {
                        if ($(".dataURL-right").length == 0) {
                            localStorage.setItem("zlSoft_docWorkStion_serviceChoose", urlData);
                            $("#dataURL-items").append('<div class="dataURL-item dataURL-itemTop"> <div class="dataURL-right"> <div class="dataURL-nameInput" ><span class="dataURL-name">' + urlName + '</span><span  class="dataURL-url">' + urlData + '</span></div> </div><span class=" dataURL-choose" style="display: block">&#10004</span> <div class="dataURL-left"><span class="dataURL-delete">一</span></div></div>');
                        } else {
                            $("#dataURL-items").append('<div class="dataURL-item dataURL-itemTop"> <div class="dataURL-right"> <div class="dataURL-nameInput" ><span class="dataURL-name">' + urlName + '</span><span  class="dataURL-url">' + urlData + '</span></div> </div><div class="dataURL-left"><span class="dataURL-delete">一</span></div></div>');
                        }
                        localStorage.setItem('zlSoft_docWorkStion_' + urlName, urlData);
                        $("#dataname input").val("新增名称");
                        $("#urlname input").val("新增地址");
                        //注册删除事件
                        var hammeroutdataURLdeleteadd = $("#dataURL-items .dataURL-delete").hammer();
                        hammeroutdataURLdeleteadd.on("tap", function () {
                            event.stopPropagation();    //  阻止事件冒泡
                            event.preventDefault();     //  阻止默认行为 ( 表单提交 )
                            clickDelet($(this));
                        });
                        var hammerAddUrl = $("#dataURL-items .dataURL-item").hammer();
                        hammerAddUrl.on("tap", function () {
                            event.stopPropagation();    //  阻止事件冒泡
                            event.preventDefault();     //  阻止默认行为 ( 表单提交 )
                            itemSelect($(this));
                        });
                        var hammerDaUrlDelteadd = $("#dataURL-items .dataURL-itemTop").hammer();
                        hammerDaUrlDelteadd.on("press", function () {
                            dataURLedit($(this));
                        });
                        $("#LoadedTip").hide();
                    },
                    error: function () {
                        $("#LoadedTip").hide();
                        utils.showHide("URL地址错误");
                    }
                });
            }
        }
    });


});