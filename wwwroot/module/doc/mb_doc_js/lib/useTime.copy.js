define(["jquery","hammer","jqueryhammer","controlTime"], function(jquery, hammer, jqueryhammer,controlTime){

    function useTime(monthTime, monthTimePre, monthTimeNext, dayTime, dayTimePre, dayTimeNext, hoursTIme, hoursTImePre, hoursTImeNext, minutesTime, minutesTimePre, minutesTimeNext, weekTime, weekTimePre, weekTimeNext) {
        var date = new Date();
        var The_Year, The_Day, The_Month, The_Hours, The_Minutes, week;
        The_Year = date.getFullYear();
        The_Month = date.getMonth() + 1;
        The_Day = date.getDate();
        The_Hours = date.getHours();
        The_Minutes = date.getMinutes();
        var today = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
        week = today[date.getDay()];
        //前一月
        hammeroutBox = $("#monthSub").hammer();
        hammeroutBox.on('tap', function (ev) {
            data = controlTime.prevmonth(monthTime, monthTimePre, monthTimeNext, weekTime, weekTimePre, weekTimeNext, The_Year, The_Month, The_Day, The_Hours, The_Minutes);
            The_Year = data.theYear;
            The_Month = data.theMonth;
        });
        //下一月
        hammeroutBox = $("#monthAdd").hammer();
        hammeroutBox.on('tap', function (ev) {
            data = controlTime.nextmonth(monthTime, monthTimePre, monthTimeNext, weekTime, weekTimePre, weekTimeNext, The_Year, The_Month, The_Day, The_Hours, The_Minutes);
            The_Year = data.theYear;
            The_Month = data.theMonth;
        });
        //前一天
        hammeroutBox = $("#daySub").hammer();
        hammeroutBox.on('tap', function (ev) {
            data = controlTime.prevday(monthTime, monthTimePre, monthTimeNext, dayTime, dayTimePre, dayTimeNext, weekTime, weekTimePre, weekTimeNext, The_Year, The_Month, The_Day, The_Hours, The_Minutes);
            The_Day = data.theDay;
            The_Month = data.theMonth;
        });
        //后一天
        hammeroutBox = $("#dayAdd").hammer();
        hammeroutBox.on('tap', function (ev) {
            data = controlTime.nextday(monthTime, monthTimePre, monthTimeNext, dayTime, dayTimePre, dayTimeNext, weekTime, weekTimePre, weekTimeNext, The_Year, The_Month, The_Day, The_Hours, The_Minutes);
            The_Day = data.theDay;
            The_Month = data.theMonth;
        });

        //前一小时
        hammeroutBox = $("#hoursAdd").hammer();
        hammeroutBox.on('tap', function (ev) {
            data = controlTime.nexthours(monthTime, monthTimePre, monthTimeNext, dayTime, dayTimePre, dayTimeNext, hoursTIme, hoursTImePre, hoursTImeNext, weekTime, weekTimePre, weekTimeNext, The_Year, The_Month, The_Day, The_Hours, The_Minutes);
            The_Hours = data.theHours;
            The_Day = data.theDay;
        });
        //后一小时
        hammeroutBox = $("#hoursSub").hammer();
        hammeroutBox.on('tap', function (ev) {
            data = controlTime.prevhours(monthTime, monthTimePre, monthTimeNext, dayTime, dayTimePre, dayTimeNext, hoursTIme, hoursTImePre, hoursTImeNext, weekTime, weekTimePre, weekTimeNext, The_Year, The_Month, The_Day, The_Hours, The_Minutes);
            The_Hours = data.theHours;
            The_Day = data.theDay;
        });
        //前一分钟
        hammeroutBox = $("#minutesSub").hammer();
        hammeroutBox.on('tap', function (ev) {
            data = controlTime.prevminutes(monthTime, monthTimePre, monthTimeNext, dayTime, dayTimePre, dayTimeNext, hoursTIme, hoursTImePre, hoursTImeNext, minutesTime, minutesTimePre, minutesTimeNext, weekTime, weekTimePre, weekTimeNext, The_Year, The_Month, The_Day, The_Hours, The_Minutes);
            The_Hours = data.theHours;
            The_Minutes = data.theMinutes;
        });
        //后一分钟
        hammeroutBox = $("#minutesAdd").hammer();
        hammeroutBox.on('tap', function (ev) {
            data = controlTime.nextminutes(monthTime, monthTimePre, monthTimeNext, dayTime, dayTimePre, dayTimeNext, hoursTIme, hoursTImePre, hoursTImeNext, minutesTime, minutesTimePre, minutesTimeNext, weekTime, weekTimePre, weekTimeNext, The_Year, The_Month, The_Day, The_Hours, The_Minutes)
            The_Hours = data.theHours;
            The_Minutes = data.theMinutes;
        });
    }

    return {useTime:useTime}




})