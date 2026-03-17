define(["jquery","hammer","jqueryhammer"], function(jquery, hammer, jqueryhammer){

    var date = new Date();
    The_Year = date.getFullYear();
    The_Month = date.getMonth() + 1;
    The_Day = date.getDate();
    The_Hours = date.getHours() ;
    The_Minutes = date.getMinutes();
    var today = ['周日','周一','周二','周三','周四','周五','周六'];
    week=today[date.getDay()];
    var w;

    //闰年判定
    function RunNian(theYear)
    {
        if ((theYear%400==0) || ((theYear%4==0) && (theYear%100!=0)))
            return true;
        else
            return false;
    }
    //计算上一年
    //function prevyear(add_Year,add_Month)
    //{
    //	The_Year=add_Year-1;
    //	$("#yearTime").html(The_Year);
    //	week_today();
    //	$("#weekTime").html(w);
    //	chooseday()
    //}
    ////计算下一年
    //function nextyear(sub_Year,sub_Month)
    //{
    //	The_Year=sub_Year+1;
    //	$("#yearTime").html(The_Year);
    //	week_today();
    //	$("#weekTime").html(w);
    //	chooseday()
    //}

    //两端月份
    function  monthSides(theMonth) {
        var monthPre,monthNext;
        if (theMonth == 12) {
            monthPre = 11;
            monthNext = 1
        } else if (theMonth == 1) {
            monthPre = 12;
            monthNext = 2
        } else {
            monthPre = theMonth - 1;
            monthNext = theMonth + 1;
        }
        return {"monthPre":monthPre,"monthNext":monthNext}
    }
    //两端日期
    function  daySides(theYear,theMonth,theDay) {
        var dayPre,dayNext;
        var monthDay=Countday(theYear,theMonth),
            monthDayPre=Countday(theYear,monthSides(theMonth).monthPre);
        if (theDay == monthDay) {
            dayPre = monthDay-1;
            dayNext = 1
        } else if (theDay == 1) {
            dayPre = monthDayPre;
            dayNext = 2
        } else {
            dayPre = theDay - 1;
            dayNext = theDay + 1;
        }
        return {"dayPre":dayPre,"dayNext":dayNext}
    }
    //两端小时
    function  hoursSides(theHours) {
        var hoursPre,hoursNext;
        if (theHours == 24) {
            hoursPre = 23;
            hoursNext = 1
        } else if (theHours == 1) {
            hoursPre = 24;
            hoursNext = 2
        } else {
            hoursPre = theHours - 1;
            hoursNext = theHours + 1;
        }
        return {"hoursPre":hoursPre,"hoursNext":hoursNext}
    }
    //两端分钟
    function  minutesSides(theMinutes) {
        var minutesPre,minutesNext;
        if (theMinutes == 60) {
            minutesPre = 59;
            minutesNext = 1
        } else if (theMinutes == 1) {
            minutesPre = 60;
            minutesNext = 2
        } else {
            minutesPre = theMinutes - 1;
            minutesNext = theMinutes + 1;
        }
        return {"minutesPre":minutesPre,"minutesNext":minutesNext}
    }

    //计算下个月
    function nextmonth(monthID,monthPreID,monthNextID,weekID,weekPreID,weekNextID,add_Year,add_Month,add_Day,add_Hours,add_minutes)
    {

        if (add_Month==12) {
            add_Year = add_Year + 1;
            add_Month=1;
            monthID.html(add_Month);
        } else{
            add_Month=add_Month+1;
            monthID.html(add_Month);
        }
        monthPreID.html(monthSides(add_Month).monthPre);
        monthNextID.html(monthSides(add_Month).monthNext);

        weekThree(add_Year,add_Month,add_Day,weekID,weekPreID,weekNextID);
        //week_today(add_Year,add_Month,add_Day);
        //$("#weekTime").html(w);
        chooseday(add_Year,add_Month,add_Day,add_Hours,add_minutes);
        return{
            theMonth:add_Month,
            theYear:add_Year
        }
    }

    //计算上个月
    function prevmonth(monthID,monthPreID,monthNextID,weekID,weekPreID,weekNextID,sub_Year,sub_Month,sub_Day,sub_Hours,sub_Minutes)
    {
        if (sub_Month==1) {
            sub_Year = sub_Year - 1;
            sub_Month=12;
            monthID.html(sub_Month);

        }else{
            sub_Month=sub_Month-1;
            monthID.html(sub_Month);
        }
        monthPreID.html(monthSides(sub_Month).monthPre);
        monthNextID.html(monthSides(sub_Month).monthNext);

        weekThree(sub_Year,sub_Month,sub_Day,weekID,weekPreID,weekNextID);
        //week_today(sub_Year,sub_Month,sub_Day);
        //$("#weekTime").html(w);
        chooseday(sub_Year,sub_Month,sub_Day,sub_Hours,sub_Minutes);
        return{
            theMonth:sub_Month,
            theYear:sub_Year
        }
    }

    //计算后一天
    function nextday(monthID,monthPreID,monthNextID,dayID,dayPreID,dayNextID,weekID,weekPreID,weekNextID,add_Year,add_Month,add_Day,add_Hours,add_minutes)
    {
        var monthDay=Countday(add_Year,add_Month);
        var theMonth=add_Month,theYear =add_Year,theDay;
        if (add_Day==monthDay) {
            var data=nextmonth(monthID,monthPreID,monthNextID,weekID,weekPreID,weekNextID,add_Year,add_Month,add_Day,add_Hours,add_minutes);  //调用month函数
            theMonth=data.theMonth;
            theYear=data.theYear;
            theDay=1;
            dayID.html(theDay);
        } else{
            theDay=add_Day+1;
            dayID.html(theDay);
        }
        var dayPre=daySides(theYear,theMonth,theDay).dayPre,
            dayNext=daySides(theYear,theMonth,theDay).dayNext;

        dayPreID.html(dayPre);
        dayNextID.html(dayNext);
        weekThree(theYear,theMonth,theDay,weekID,weekPreID,weekNextID);
        chooseday(theYear,theMonth,theDay,add_Hours,add_minutes);
        return{
        theYear:theYear,
        theMonth:theMonth,
        theDay:theDay
        };
    }

    //计算前一天
    function prevday(monthID,monthPreID,monthNextID,dayID,dayPreID,dayNextID,weekID,weekPreID,weekNextID,sub_Year,sub_Month,sub_Day,sub_Hours,sub_Minutes)
    {
        var theMonth=sub_Month,theDay;
        if (sub_Day==1) {
            //data=prevmonth(monthID,monthPreID,monthNextID,weekID,weekPreID,weekNextID,sub_Year,sub_Month,sub_Day,sub_Hours,sub_Minutes);      //调用month函数
            //theMonth=data.theMonth;
            theDay= Countday(sub_Year,theMonth);
            dayID.html(theDay);
        }else{
            theDay=sub_Day - 1;
            dayID.html(theDay);
        }

        var dayPre=daySides(sub_Year,theMonth, theDay).dayPre,
            dayNext=daySides(sub_Year,theMonth, theDay).dayNext;

            dayPreID.html(dayPre);
            dayNextID.html(dayNext);

        weekThree(sub_Year,theMonth, theDay,weekID,weekPreID,weekNextID);

        chooseday(sub_Year,theMonth, theDay,sub_Hours,sub_Minutes);
        return{
            theMonth:theMonth,
            theDay:theDay
        }
    }

    //前一小时
    function prevhours(monthID,monthPreID,monthNextID,dayID,dayPreID,dayNextID,hoursID,hoursPreID,hoursNextID,weekID,weekPreID,weekNextID,sub_Year,sub_Month,sub_Day,sub_Hours,sub_Minutes)
    {
        var theHours,theDay=sub_Day;
        if (sub_Hours==1) {
            //data=prevday(monthID,monthPreID,monthNextID,dayID,dayPreID,dayNextID,weekID,weekPreID,weekNextID,sub_Year,sub_Month,sub_Day);      //调用day函数
            //theDay=data.theDay;
            theHours= 24;
            hoursID.html(theHours);
        }else{
            theHours=sub_Hours - 1;
            hoursID.html(theHours);
        }
        hoursPreID.html(hoursSides(theHours).hoursPre);
        hoursNextID.html(hoursSides(theHours).hoursNext);
        weekThree(sub_Year,sub_Month,theDay,weekID,weekPreID,weekNextID);
        //week_today(sub_Year,sub_Month,theDay);
        //$("#weekTime").html(w);
        chooseday(sub_Year,sub_Month,theDay,theHours,sub_Minutes);
        return{
            theHours:theHours,
            theDay:theDay
        }
    }

    //后一小时
    function nexthours(monthID,monthPreID,monthNextID,dayID,dayPreID,dayNextID,hoursID,hoursPreID,hoursNextID,weekID,weekPreID,weekNextID,add_Year,add_Month,add_Day,add_Hours,add_minutes)
    {
        var theHours,theDay=add_Day;
        if (add_Hours==24) {
            data=nextday(monthID,monthPreID,monthNextID,dayID,dayPreID,dayNextID,weekID,weekPreID,weekNextID,add_Year,add_Month,add_Day);
            theDay=data.theDay;
            theHours=1;
            hoursID.html(theHours);
        } else{
            theHours=add_Hours+1;
            hoursID.html(theHours);
        }
        hoursPreID.html(hoursSides(theHours).hoursPre);
        hoursNextID.html(hoursSides(theHours).hoursNext);

        weekThree(add_Year,add_Month,theDay,weekID,weekPreID,weekNextID);
        //week_today(add_Year,add_Month,theDay);
        //$("#weekTime").html(w);
        chooseday(add_Year,add_Month,theDay,theHours,add_minutes);
        return{
            theHours:theHours,
            theDay:theDay
        }
    }

    //前一分钟
    function prevminutes(monthID,monthPreID,monthNextID,dayID,dayPreID,dayNextID,hoursID,hoursPreID,hoursNextID,minutesID,minutesPreID,minutesNextID,weekID,weekPreID,weekNextID,sub_Year,sub_Month,sub_Day,sub_Hours,sub_Minutes)
    {
        var theMinutes,theHours=sub_Hours;
        if (sub_Minutes==1) {
            //data=prevhours(monthID,monthPreID,monthNextID,dayID,dayPreID,dayNextID,hoursID,hoursPreID,hoursNextID,weekID,weekPreID,weekNextID,sub_Year,sub_Month,sub_Day,sub_Hours);      //调用hours函数
            //theHours=data.theHours;
            theMinutes= 60;
            minutesID.html(theMinutes);
        }else{
            theMinutes=sub_Minutes - 1;
            minutesID.html(theMinutes);
        }
        minutesPreID.html(minutesSides(theMinutes).minutesPre);
        minutesNextID.html(minutesSides(theMinutes).minutesNext);
        weekThree(sub_Year,sub_Month,sub_Day,weekID,weekPreID,weekNextID);
        //week_today(sub_Year,sub_Month,sub_Day);
        //$("#weekTime").html(w);
        chooseday(sub_Year,sub_Month,sub_Day,theHours,theMinutes);
        return{
            theMinutes:theMinutes,
            theHours:theHours
        }
    }


    //后一分钟
    function nextminutes(monthID,monthPreID,monthNextID,dayID,dayPreID,dayNextID,hoursID,hoursPreID,hoursNextID,minutesID,minutesPreID,minutesNextID,weekID,weekPreID,weekNextID,add_Year,add_Month,add_Day,add_Hours,add_Minutes)
    {
        var theMinutes,theHours=add_Hours;
        if (add_Minutes==60) {
            data=nexthours(monthID,monthPreID,monthNextID,dayID,dayPreID,dayNextID,hoursID,hoursPreID,hoursNextID,weekID,weekPreID,weekNextID,add_Year,add_Month,add_Day,add_Hours);
            theHours=data.theHours;
            theMinutes=1;
            minutesID.html(theMinutes);
        } else{
            theMinutes=add_Minutes+1;
            minutesID.html(theMinutes);
        }
        minutesPreID.html(minutesSides(theMinutes).minutesPre);
        minutesNextID.html(minutesSides(theMinutes).minutesNext);

        weekThree(add_Year,add_Month,add_Day,weekID,weekPreID,weekNextID);
        //week_today(add_Year,add_Month,add_Day);
        //$("#weekTime").html(w);
        chooseday(add_Year,add_Month,add_Day,theHours,theMinutes);
        return{
            theMinutes:theMinutes,
            theHours:theHours
        }
    }

    //计算当前月有多少天
    function Countday(TheYear,TheMonth){
        var Month_Day;
        switch (TheMonth)
        {
            case 1 : Month_Day = 31; break;
            case 2 :
                if (RunNian(TheYear))
                    Month_Day = 29;
                else
                    Month_Day = 28;
                break;
            case 3 : Month_Day = 31; break;
            case 4 : Month_Day = 30; break;
            case 5 : Month_Day = 31; break;
            case 6 : Month_Day = 30; break;
            case 7 : Month_Day = 31; break;
            case 8 : Month_Day = 31; break;
            case 9 : Month_Day = 30; break;
            case 10 :Month_Day = 31; break;
            case 11 :Month_Day = 30; break;
            case 12 :Month_Day = 31; break;
        }
        return Month_Day;
    }

    //当前日期的星期确定
    function weekDay(theYear,theMonth,theDay){
        var monthChange=theMonth-1;
        var dt = new Date(theYear,monthChange,theDay);
        var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        return(weekDay[dt.getDay()]);
    }

    //判断是今天还是星期
    function  week_today(theYear,theMonth,theDay,weekID){
        var yearToday = date.getFullYear();
        var monthToday = date.getMonth() + 1;
        var dayToday = date.getDate();
        if(yearToday==theYear&&monthToday==theMonth&&dayToday==theDay){
            w="今天";
            $(weekID).css("background","#408382")
        }else {
            w = weekDay(theYear,theMonth,theDay);
            $(weekID).css("background","#9d9d9d")
        }
        return w;
    }

    //获取week，weekPre,weekNext
    function weekThree(theYear,theMonth,theDay,weekID,weekPreID,weekNextID){
        var day=daySides(theYear,theMonth, theDay),
            dayPre=day.dayPre,
            dayNext=day.dayNext;
        var week=week_today(theYear,theMonth, theDay,weekID),
            weekPre=week_today(theYear,theMonth,dayPre,""),
            weekNext=week_today(theYear,theMonth,dayNext,"");
        $(weekID).html(week);
        $(weekNextID).html(weekNext);
        $(weekPreID).html(weekPre);
    }
    //获取当前选中日期和时间
    function chooseday(theYear,theMonth,theDay,theHours,theMinutes)
    {
        Y = theYear + '-';
        M = (theMonth < 10 ? '0'+(theMonth) : theMonth) + '-';
        D = (theDay < 10 ? '0'+ theDay : theDay) + ' ';
        h = (theHours  < 10 ? '0'+ theHours  : theHours )+ ':';
        m = theMinutes  < 10 ? '0'+ theMinutes  : theMinutes ;
        week_today(theYear,theMonth,theDay);
        $("#timeStart").val(Y+M+D+h+m+"（"+w+"）");

    }

    return{
        nextmonth:nextmonth,
        prevmonth:prevmonth,
        nextday:nextday,
        prevday:prevday,
        weekDay:weekDay,
        prevhours:prevhours,
        nexthours:nexthours,
        prevminutes:prevminutes,
        nextminutes:nextminutes,
        Countday:Countday,
        chooseday:chooseday,
        monthSides:monthSides,
        minutesSides:minutesSides,
        daySides:daySides,
        hoursSizes:hoursSides,
        weekThree:weekThree
    }

});
