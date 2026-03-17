define(["jquery", "hammer","jqueryhammer","utils"], function(jquery, hammer, jqueryhammer,utils) {
	
	function dateTimeScroll(a,divID,qd_callback){    //a:传入时间 如2016-08-31 12:04 divID:容器ID qd_callback:点击确定的回调函数
		
		// 根据功能调整控件位置
		$("#dateTime").show();
		$("#"+divID).append($("#dateTime"));
		// 如果是医嘱新开/编辑，由于容器过窄，故给timeTable设置为居中
		if(divID=="startTime"){
			$("#dateTime .timeTable").css("margin","auto").css("float","none");
		}else{
			$("#dateTime .timeTable").css("float","left");
		}

		// 初始化值
		//var a = "2016-08-31 12:04";
		var nian = a.split("-")[0];
		var yue = a.split(" ")[0].split("-")[1];
		var ri = a.split(" ")[0].split("-")[2];
		var shi = a.split(" ")[1].split(":")[0];
		var fen = a.split(" ")[1].split(":")[1];
		var day = new Date(nian,yue,0);          // 转换成日期格式
		var daycount = day.getDate();            // 月份的天数

		// 判断周几
		function getMyDay(date){
			var week; 
			if(date.getDay()==0) week="星期天";
			if(date.getDay()==1) week="星期一";
			if(date.getDay()==2) week="星期二";
			if(date.getDay()==3) week="星期三";
			if(date.getDay()==4) week="星期四";
			if(date.getDay()==5) week="星期五";
			if(date.getDay()==6) week="星期六";
			return week;
		}

		// 年
		$("#dateTime_n").empty("li");
		for(var i=parseInt(nian)-10; i<=parseInt(nian)+10; i++){
			$("#dateTime_n").append('<li>'+i+'</li>');
		}
		// 月
		$("#dateTime_y").empty("li");
		for(var yi=1; yi<=12; yi++){
			if(yi<10)
				$("#dateTime_y").append('<li>0'+yi+'</li>');
			else
				$("#dateTime_y").append('<li>'+yi+'</li>');
		}
		// 日
		$("#dateTime_r").empty("li");
		for(var rii=1; rii<=daycount; rii++){
			if(rii<10) rii="0"+rii;
			var week = getMyDay(new Date(nian+"-"+yue+"-"+rii));
			$("#dateTime_r").append('<li>'+rii+'（'+week+'）'+'</li>');
		}
		// 时
		$("#dateTime_s").empty("li");
		for(var si=0; si<=23; si++){
			if(si<10)
				$("#dateTime_s").append('<li>0'+si+'</li>');
			else
				$("#dateTime_s").append('<li>'+si+'</li>');
		}
		// 分
		$("#dateTime_f").empty("li");
		for(var fi=0; fi<=59; fi++){
			if(fi<10)
				$("#dateTime_f").append('<li>0'+fi+'</li>');
			else
				$("#dateTime_f").append('<li>'+fi+'</li>');
		}
		
		// 给每一个UL 都追加一对空的Li 防止滑动不到
		$("#dateTime .numberBox").append('<li></li>');
		$("#dateTime .numberBox").prepend('<li></li>');

		// 选中
		$("#dateTime_n").scrollTop(10*50);
		$("#dateTime_y").scrollTop((yue-1)*50);
		$("#dateTime_r").scrollTop((ri-1)*50);
		$("#dateTime_s").scrollTop((shi)*50);
		$("#dateTime_f").scrollTop((fen)*50);
		$("#dateTime > p").text(nian+"-"+yue+"-"+ri+" "+shi+":"+fen);

		// 根据滑动 选中对应的值
		var timeout = false; 
		var hdNian=nian,hdYue=yue,hdRi=ri,hdShi=shi,hdFen=fen;
		$("#dateTime .numberBox").scroll(function(){ 
			var thisUl = $(this);
			if (timeout){
				clearTimeout(timeout);
			} 
			timeout = setTimeout(function(){ 
				//console.log("滑动结束"+thisUl.scrollTop());
				var marginTop = thisUl.scrollTop();
				// 如果不是50的倍数
				if(!(marginTop % 50 == 0)){
					var stp;
					for(var i=1; i<=50; i++){
						if((marginTop+i)%50==0){
							stp = marginTop+i;
							break;
						}else if((marginTop-i)%50==0){
							stp = marginTop-i;
							break;
						}
					}
					thisUl.scrollTop(stp);
				}
				// 计算当前的滑动值
				var nowMarginTop = thisUl.scrollTop();
				if(thisUl.attr("id")=="dateTime_n"){
					hdNian=thisUl.find("li").eq((nowMarginTop/50)+1).text();
					updateWeek();
				}
				if(thisUl.attr("id")=="dateTime_y"){
					hdYue=thisUl.find("li").eq((nowMarginTop/50)+1).text();
					updateWeek();
				}
				if(thisUl.attr("id")=="dateTime_r") hdRi=thisUl.find("li").eq((nowMarginTop/50)+1).text();
				if(thisUl.attr("id")=="dateTime_s") hdShi=thisUl.find("li").eq((nowMarginTop/50)+1).text();
				if(thisUl.attr("id")=="dateTime_f") hdFen=thisUl.find("li").eq((nowMarginTop/50)+1).text();
				$("#dateTime > p").text(hdNian+"-"+hdYue+"-"+hdRi.split("（")[0]+" "+hdShi+":"+hdFen);
				// 如果是医嘱新开/编辑，P被隐藏，直接更新开始时间
				if(divID=="startTime"){
					$("#appDateTime").text(hdNian+"-"+hdYue+"-"+hdRi.split("（")[0]+" "+hdShi+":"+hdFen);
				}

			},100); 
		});
		
		// 更新日的周几
		function updateWeek(){
			$("#dateTime_r li").each(function(){
				if($(this).text()!==""){
					var liRi = $(this).text().split("（")[0];
					var LiNowWeek = getMyDay(new Date(hdNian+"-"+hdYue+"-"+liRi));
					$(this).text(liRi+"（"+LiNowWeek+"）");
				}
			});
		}

		// 点击确定
		if(qd_callback!==undefined){
			$("#dateTime .buttonDiv").show();
			$("#dateTime>p").show();
			// var hammerDateQd = $("#dateTime .qd").hammer();
			// hammerDateQd.on("tap",function(){
			// 	qd_callback();
            // });
            //清除监听的click事件,然后再绑定
            $("#dateTime .qd").off('click').on('click', function (event) {
				event.preventDefault();
				qd_callback();
				
				$('#phototimeControl').css('pointer-events', 'none');
			    setTimeout(function(){
			        $('#phototimeControl').css('pointer-events', 'auto');
			    }, 400);
			});
			
		}else{
			$("#dateTime .buttonDiv").hide();
			$("#dateTime>p").hide();
		}

		// 点击取消
		/*var hammerDateQx = $("#dateTime .qx").hammer();
		hammerDateQx.on("tap",function(){
			$("#timeControlWrapF").hide();
			$("#Parentphoto").hide();
			$('#phototimeControl').css('pointer-events', 'none');

		    setTimeout(function(){
		        $('#phototimeControl').css('pointer-events', 'auto');
		    }, 400);
		});*/
		$("#dateTime .qx").on('click',  function(event) {
			event.preventDefault();
			$("#timeControlWrapF").hide();
			$("#Parentphoto").hide();
			$('#phototimeControl').css('pointer-events', 'none');

		    setTimeout(function(){
		        $('#phototimeControl').css('pointer-events', 'auto');
		    }, 400);
		});

		/* 点击当前
		var hammerDateDq = $("#dateTime .dq").hammer();
		hammerDateDq.on("tap",function(){
			$("#dateTime > p").text(utils.todayNow());
		});*/
	}

	return{
		dateTimeScroll:dateTimeScroll
	}

});