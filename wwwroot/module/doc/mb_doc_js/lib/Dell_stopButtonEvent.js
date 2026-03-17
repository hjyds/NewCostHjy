define(["jquery", "hammer","jqueryhammer","utils","useTime"], function(jquery, hammer, jqueryhammer,utils,useTime) {
/*
    hammeroutTimeBox = $("#yzButtonTZhi").hammer();
    hammeroutSureBtn=$("#timeSureBtn").hammer();
    hammeroutCancelBtn=$("#timeCancelBtn").hammer();





    hammeroutTimeBox.on('tap', function(ev) {
        if($("#CQATable tr.active").length!==0) {

            $("#timeControlWrap").show();
            $(".tmc").show();  //透明底层
            //1函数变量赋值
            monthTime = $("#S-monthTime");
            monthTimePre = $("#S-monthTimePre");
            monthTimeNext = $("#S-monthTimeNext");
            dayTime = $("#S-dayTime");
            dayTimePre = $("#S-dayTimePre");
            dayTimeNext = $("#S-dayTimeNext");
            hoursTime = $("#S-hoursTime");
            hoursTimePre = $("#S-hoursTimePre");
            hoursTimeNext = $("#S-hoursTimeNext");
            minutesTime = $("#S-minutesTime");
            minutesTimePre = $("#S-minutesTimePre");
            minutesTimeNext = $("#S-minutesTimeNext");
            weekTime = $("#S-weekTime");
            weekTimePre = $("#S-weekTimePre");
            weekTimeNext = $("#S-weekTimeNext");
            monthAdd=$("#S-monthAdd");
            monthSub=$("#S-monthSub");
            dayAdd = $("#S-dayAdd");
            daySub = $("#S-daySub");
            hoursAdd = $("#S-hoursAdd");
            hoursSub = $("#S-hoursSub");
            minutesAdd = $("#S-minutesAdd");
            minutesSub = $("#S-minutesSub");
            fullTime=$("#S-fullTime");

            //2控件时间初始化
            //2.1 获取当前时间
            myDate=new Date();
            The_Year = myDate.getFullYear();
            The_Month = myDate.getMonth() + 1;
            The_Day = myDate.getDate();
            The_Hours = myDate.getHours() ;
            The_Minutes = myDate.getMinutes();
            var today = ['周日','周一','周二','周三','周四','周五','周六'];
            week=today[myDate.getDay()];
            //2.2 当前时间部分内容显示
            $(monthTime).html(The_Month);
            $(dayTime).html(The_Day);
            $(weekTime).html("今天");
            $(hoursTime).html(The_Hours);
            $(minutesTime).html(The_Minutes);
            //2.3顶部时间显示部分内容显示
            Y = myDate.getFullYear() + '-';
            M = (myDate.getMonth()+1 < 10 ? '0'+(myDate.getMonth()+1) : myDate.getMonth()+1) + '-';
            D = (myDate.getDate() < 10 ? '0'+ myDate.getDate() : myDate.getDate()) + ' ';
            h = (myDate.getHours()  < 10 ? '0'+ myDate.getHours()  : myDate.getHours() )+ ':';
            m = myDate.getMinutes() < 10 ? '0'+ myDate.getMinutes() : myDate.getMinutes();
            $(fullTime).val(Y+M+D+h+m+"（今天）");
            //2.4 函数引用，获取前后日期时间

            weekThree=useTime.useTime().weekThree(weekTime,weekTimePre,weekTimeNext);
            monthSides = useTime.useTime().monthSides();
            daySides = useTime.useTime().daySides();
            hoursSides = useTime.useTime().hoursSizes();
            minutesSides = useTime.useTime().minutesSides();

            //2.5 前后时间部分内容显示

            $(monthTimePre).html(monthSides.monthPre);
            $(monthTimeNext).html(monthSides.monthNext);
            $(dayTimePre).html(daySides.dayPre);
            $(dayTimeNext).html(daySides.dayNext);
            $(hoursTimePre).html(hoursSides.hoursPre);
            $(hoursTimeNext).html(hoursSides.hoursNext);
            $(minutesTimePre).html(minutesSides.minutesPre);
            $(minutesTimeNext).html(minutesSides.minutesNext);

            //3 时间控件函数引用，注意传参
            useTime.useTime(monthTime, monthTimePre, monthTimeNext, dayTime, dayTimePre, dayTimeNext, hoursTime, hoursTimePre, hoursTimeNext, minutesTime, minutesTimePre, minutesTimeNext, weekTime, weekTimePre, weekTimeNext,monthAdd,monthSub,dayAdd,daySub,hoursAdd,hoursSub,minutesAdd,minutesSub,fullTime);
        }else {
            utils.showHide("请选择医嘱")
        }
    });

    hammeroutSureBtn.on('tap',function(){
        $("#timeControlWrap").hide();
        $(".tmc").hide();  //透明底层
    });

    hammeroutCancelBtn.on('tap',function(){
        $("#timeControlWrap").hide();
        $(".tmc").hide();  //透明底层
    })
*/

});