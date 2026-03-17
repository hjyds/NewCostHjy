define(["jquery","hammer","jqueryhammer"], function(jquery, hammer, jqueryhammer){

    function useTime(monthTime, monthTimePre, monthTimeNext, dayTime, dayTimePre, dayTimeNext, hoursTime, hoursTimePre, hoursTimeNext, minutesTime, minutesTimePre, minutesTimeNext, weekTime, weekTimePre, weekTimeNext,monthAdd,monthSub,dayAdd,daySub,hoursAdd,hoursSub,minutesAdd,minutesSub,fullTime) {
        var date = new Date();
        var The_Year, The_Day, The_Month, The_Hours, The_Minutes, week;
        The_Year = date.getFullYear();
        The_Month = date.getMonth() + 1;
        The_Day = date.getDate();
        The_Hours = date.getHours();
        The_Minutes = date.getMinutes();
        var today = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        week = today[date.getDay()];


        //闰年判定
        function RunNian()
        {
            if ((The_Year%400==0) || ((The_Year%4==0) && (The_Year%100!=0)))
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
        function  monthSides() {
            var monthPre,monthNext;
            if (The_Month == 12) {
                monthPre = 11;
                monthNext = 1
            } else if (The_Month == 1) {
                monthPre = 12;
                monthNext = 2
            } else {
                monthPre = The_Month - 1;
                monthNext = The_Month + 1;
            }
            return {"monthPre":monthPre,"monthNext":monthNext}
        }
        //两端日期
        function  daySides() {
            var dayPre,dayNext;
            var monthDay=Countday(The_Month);
                monthDayPre=Countday(monthSides().monthPre);
            if (The_Day == monthDay) {
                dayPre = monthDay-1;
                dayNext = 1
            } else if (The_Day == 1) {
                dayPre = monthDayPre;
                dayNext = 2
            } else {
                dayPre = The_Day - 1;
                dayNext = The_Day + 1;
            }
            return {"dayPre":dayPre,"dayNext":dayNext}
        }
        //两端小时
        function  hoursSides() {
            var hoursPre,hoursNext;
            if (The_Hours == 24) {
                hoursPre = 23;
                hoursNext = 1
            } else if (The_Hours == 1) {
                hoursPre = 24;
                hoursNext = 2
            } else {
                hoursPre = The_Hours - 1;
                hoursNext = The_Hours + 1;
            }
            return {"hoursPre":hoursPre,"hoursNext":hoursNext}
        }
        //两端分钟
        function  minutesSides() {
            var minutesPre,minutesNext;
            if (The_Minutes == 60) {
                minutesPre = 59;
                minutesNext = 1
            } else if (The_Minutes == 1) {
                minutesPre = 60;
                minutesNext = 2
            } else {
                minutesPre = The_Minutes - 1;
                minutesNext = The_Minutes + 1;
            }
            return {"minutesPre":minutesPre,"minutesNext":minutesNext}
        }

        //计算下个月
        function nextmonth()
        {

            if (The_Month==12) {
                The_Year = The_Year + 1;
                The_Month=1;
                $(monthTime).html(The_Month);
            } else{
                The_Month=The_Month+1;
                $(monthTime).html(The_Month);
            }
            effectDay();
            $(monthTimePre).html(monthSides().monthPre);
            $(monthTimeNext).html(monthSides().monthNext);

            weekThree(weekTime,weekTimePre,weekTimeNext);
            chooseday();
           console.log(The_Month,The_Day)
        }

        //计算上个月
        function prevmonth()
        {

            if (The_Month==1) {
                The_Year = The_Year - 1;
                The_Month=12;
                $(monthTime).html(The_Month);

            }else{
                The_Month=The_Month-1;
                $(monthTime).html(The_Month);
                }

            effectDay();


            $(monthTimePre).html(monthSides().monthPre);
            $(monthTimeNext).html(monthSides().monthNext);

            weekThree(weekTime,weekTimePre,weekTimeNext);
            chooseday();

        }

        //计算后一天
        function nextday()
        {
            var monthDay=Countday(The_Month);
            if (The_Day==monthDay) {
                nextmonth();  //调用month函数
                The_Day=1;
                $(dayTime).html(The_Day);
            } else{
                The_Day=The_Day+1;
                $(dayTime).html(The_Day);
            }
            var dayPre=daySides().dayPre,
                dayNext=daySides().dayNext;

            $(dayTimePre).html(dayPre);
            $(dayTimeNext).html(dayNext);

            weekThree(weekTime,weekTimePre,weekTimeNext);
            chooseday();
        }

        //计算前一天
        function prevday()
        {
            if (The_Day==1) {
                prevmonth();      //调用month函数
                The_Day= Countday(The_Month);
                $(dayTime).html(The_Day);
            }else{
                The_Day=The_Day - 1;
                $(dayTime).html(The_Day);
            }

            var dayPre=daySides().dayPre,
                dayNext=daySides().dayNext;

            $(dayTimePre).html(dayPre);
            $(dayTimeNext).html(dayNext);

            weekThree(weekTime,weekTimePre,weekTimeNext);
            chooseday();
        }

        //前一小时
        function prevhours()
        {
            if (The_Hours==1) {
                prevday();      //调用day函数
                The_Hours= 24;
                $(hoursTime).html(The_Hours);
            }else{
                The_Hours=The_Hours - 1;
                $(hoursTime).html(The_Hours);
            }
            $(hoursTimePre).html(hoursSides().hoursPre);
            $(hoursTimeNext).html(hoursSides().hoursNext);

            weekThree(weekTime,weekTimePre,weekTimeNext);
            chooseday();

        }

        //后一小时
        function nexthours()
        {
            if (The_Hours==24) {
                nextday();
                The_Hours=1;
                $(hoursTime).html(The_Hours);
            } else{
                The_Hours=The_Hours+1;
                $(hoursTime).html(The_Hours);
            }
            $(hoursTimePre).html(hoursSides().hoursPre);
            $(hoursTimeNext).html(hoursSides().hoursNext);

            weekThree(weekTime,weekTimePre,weekTimeNext);
            chooseday();

        }

        //前一分钟
        function prevminutes()
        {
            if (The_Minutes==1) {
                prevhours();      //调用hours函数
                The_Minutes= 60;
                $(minutesTime).html(The_Minutes);
            }else{
                The_Minutes=The_Minutes - 1;
                $(minutesTime).html(The_Minutes);
            }
            $(minutesTimePre).html(minutesSides().minutesPre);
            $(minutesTimeNext).html(minutesSides().minutesNext);

            weekThree(weekTime,weekTimePre,weekTimeNext);
            chooseday();

        }


        //后一分钟
        function nextminutes()
        {
            if (The_Minutes==60) {
                nexthours();
                The_Minutes=1;
                $(minutesTime).html(The_Minutes);
            } else{
                The_Minutes=The_Minutes+1;
                $(minutesTime).html(The_Minutes);
            }
            $(minutesTimePre).html(minutesSides().minutesPre);
            $(minutesTimeNext).html(minutesSides().minutesNext);

            weekThree(weekTime,weekTimePre,weekTimeNext);
            chooseday();

        }

        //计算当前月有多少天
        function Countday(theMonth){
            var Month_Day;
            switch (theMonth)
            {
                case 1 : Month_Day = 31; break;
                case 2 :
                    if (RunNian(The_Year))
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
        function weekDay(theDay){
            var monthChange=The_Month-1;
            var dt = new Date(The_Year,monthChange,theDay);
            var weekDay = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
            return(weekDay[dt.getDay()]);
        }

        //判断是今天还是星期
        function  week_today(theDay,weekID){
            var yearToday = date.getFullYear();
            var monthToday = date.getMonth() + 1;
            var dayToday = date.getDate();
            if(yearToday==The_Year&&monthToday==The_Month&&dayToday==theDay){
                w="今天";
                $(weekID).css("background","#408382")
            }else {
                w = weekDay(theDay);
                $(weekID).css("background","#9d9d9d")
            }
            return w;
        }

        //获取week，weekPre,weekNext
        function weekThree(weekID,weekPreID,weekNextID){
            var day=daySides(),
                dayPre=day.dayPre,
                dayNext=day.dayNext;
            var week=week_today(The_Day,weekID),
                weekPre=week_today(dayPre,""),
                weekNext=week_today(dayNext,"");
            $(weekID).html(week);
            $(weekPreID).html(weekNext);
            $(weekNextID).html(weekPre);
        }
        //获取当前选中日期和时间
        function chooseday()
        {
            Y = The_Year + '-';
            M = (The_Month < 10 ? '0'+(The_Month) : The_Month) + '-';
            D = (The_Day < 10 ? '0'+ The_Day : The_Day) + ' ';
            h = (The_Hours  < 10 ? '0'+ The_Hours  : The_Hours )+ ':';
            m = The_Minutes  < 10 ? '0'+ The_Minutes  : The_Minutes ;
            week_today(The_Day,weekTime);
            $(fullTime).val(Y+M+D+h+m+"（"+w+"）");

        }
        //变动月份时，天数也会改变
        function effectDay(){
            var monthDay=Countday(The_Month);

            if(The_Day>monthDay){
                The_Day=monthDay;
                $(dayTime).html(The_Day);
                var dayPre=daySides().dayPre,
                    dayNext=daySides().dayNext;
                $(dayTimePre).html(dayPre);
                $(dayTimeNext).html(dayNext);
            }else{
                var dayPreB=daySides().dayPre,
                    dayNextB=daySides().dayNext;
                $(dayTimePre).html(dayPreB);
                $(dayTimeNext).html(dayNextB);
            }
        }

        //前一月
        hammeroutBox = $(monthSub).hammer();
        hammeroutBox.on('tap', function (ev) {
            prevmonth();

        });
        //下一月
        hammeroutBox = $(monthAdd).hammer();
        hammeroutBox.on('tap', function (ev) {
            nextmonth();

        });
        //前一天
        hammeroutBox = $(daySub).hammer();
        hammeroutBox.on('tap', function (ev) {
            prevday();

        });
        //后一天
        hammeroutBox = $(dayAdd).hammer();
        hammeroutBox.on('tap', function (ev) {
           nextday();

        });

        //前一小时
        hammeroutBox = $(hoursAdd).hammer();
        hammeroutBox.on('tap', function (ev) {
           nexthours();

        });
        //后一小时
        hammeroutBox = $(hoursSub).hammer();
        hammeroutBox.on('tap', function (ev) {
            prevhours();

        });
        //前一分钟
        hammeroutBox = $(minutesSub).hammer();
        hammeroutBox.on('tap', function (ev) {
            prevminutes();

        });
        //后一分钟
        hammeroutBox = $(minutesAdd).hammer();
        hammeroutBox.on('tap', function (ev) {
            nextminutes()

        });

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
    }

    return {useTime:useTime}




})
