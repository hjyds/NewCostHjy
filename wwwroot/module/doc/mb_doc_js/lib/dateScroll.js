define(["jquery", "hammer","jqueryhammer","utils"], function(jquery, hammer, jqueryhammer,utils) {
	
	function dateScroll(a,divID){    //a:传入日期 如2016-08-31 divID:容器ID 
		debugger;
		$("#"+divID).empty("#dateScroll");
		// 根据功能调整控件位置
		var dateDiv = '<tr><td><div class="numberBox_F"><div class="active"></div><ul class="numberBox" id="dateScroll_n"></ul></div></td><td><div class="numberBox_F"><div class="active"></div><ul class="numberBox" id="dateScroll_y"></ul></div></td><td><div class="numberBox_F" style="width: 125px;"><div class="active"></div><ul class="numberBox" id="dateScroll_r"></ul></div></td><tr>';
		var buttonDiv = '<table class="buttonDiv" style="margin:0px;"><tr><td><div class="qd">确定</div></td><td><div class="dq">今天</div></td><td><div class="qx">取消</div></td></tr></table>';
		var boxDiv = '<div class="dataTimeBox" style="display:block;" id="dateScroll"><p style="background: #fff;color: #267AA8;"></p><table class="dataTable"><tr><td>年</td><td>月</td><td>日</td><tr>'+dateDiv+'</table>'+buttonDiv+'</div>';
		$("#"+divID).append(boxDiv);
		$("#dateScroll .buttonDiv").show();
		$("#dateScroll>p").show();
		$("#dateScroll .dq").removeClass('jy');//今天 移除上次的禁用
		// 初始化值
		var nian = a.split("-")[0];
		var yue = a.split(" ")[0].split("-")[1];
		var ri = a.split(" ")[0].split("-")[2];
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
		var ruyuanN=$("#zhenLiao .zlylCard .dh").attr("data-rysj").split("-")[0];
		var cuyuanN=$("#zhenLiao .zlylCard .dh").attr("data-cysj")=="null"?utils.todayNow().split(" ")[0].split("-")[0] : $("#zhenLiao .zlylCard .dh").attr("data-cysj").split("-")[0];
		$("#dateScroll_n").empty("li");
		for(var i=parseInt(ruyuanN); i<=parseInt(cuyuanN); i++){
			$("#dateScroll_n").append('<li>'+i+'</li>');
		}
		// 月
		$("#dateScroll_y").empty("li");
		for(var yi=1; yi<=12; yi++){
			if(yi<10)
				$("#dateScroll_y").append('<li>0'+yi+'</li>');
			else
				$("#dateScroll_y").append('<li>'+yi+'</li>');
		}
		
		// 日
		$("#dateScroll_r").empty("li");
		for(var rii=1; rii<=31; rii++){
			if(rii<10) rii="0"+rii;
			var week = getMyDay(new Date(nian+"-"+yue+"-"+rii));
			$("#dateScroll_r").append('<li>'+rii+'（'+week+'）'+'</li>');
		}
		$("#dateScroll_r li").each(function(){
			if(parseInt($(this).text())>daycount && $(this).text()!=="") $(this).hide();
			else $(this).show();
		});
		
		
		// 给每一个UL 都追加一对空的Li 防止滑动不到
		$("#dateScroll .numberBox").append('<li></li>');
		$("#dateScroll .numberBox").prepend('<li></li>');

		// 选中
		$("#dateScroll_n").scrollTop(10*50);
		$("#dateScroll_y").scrollTop((yue-1)*50);
		$("#dateScroll_r").scrollTop((ri-1)*50);
		$("#dateScroll > p").text(nian+"-"+yue+"-"+ri);

		// 根据滑动 选中对应的值
		var timeout = false; 
		var hdNian=nian,hdYue=yue,hdRi=ri;
		// 标记滚动切换开关 默认可滚动
		var scrollSwitch="on";
		$("#dateScroll .numberBox").scroll(function(){ 
			if(scrollSwitch=="on"){
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
					if(thisUl.attr("id")=="dateScroll_n"){
						hdNian=thisUl.find("li").eq((nowMarginTop/50)+1).text();
						// 更新日
						var dayYY = new Date(hdNian,hdYue,0);             // 转换成日期格式
						var dayYYcount = dayYY.getDate();				  // 月份的天数
						$("#dateScroll_r li").each(function(){
							if(parseInt($(this).text())>dayYYcount && $(this).text()!=="") $(this).hide();
							else $(this).show();
						});
						updateWeek();
					}else if(thisUl.attr("id")=="dateScroll_y"){
						hdYue=thisUl.find("li").eq((nowMarginTop/50)+1).text();
						// 更新日
						var dayY = new Date(hdNian,hdYue,0);          // 转换成日期格式
						var dayYcount = dayY.getDate();				  // 月份的天数
						$("#dateScroll_r li").each(function(){
							if(parseInt($(this).text())>dayYcount && $(this).text()!=="") $(this).hide();
							else $(this).show();
						});
						updateWeek();
					}else if(thisUl.attr("id")=="dateScroll_r") hdRi=thisUl.find("li").eq((nowMarginTop/50)+1).text();
					$("#dateScroll > p").text(hdNian+"-"+hdYue+"-"+hdRi.split("（")[0]);
					//debugger;
					// 如果选择的值大于出院时间 或 小于入院时间
					var rysjDate=new Date($("#zhenLiao .zlylCard .dh").attr("data-rysj"));
					var cysj = $("#zhenLiao .zlylCard .dh").attr("data-cysj")=="null"?utils.todayNow().split(" ")[0] : $("#zhenLiao .zlylCard .dh").attr("data-cysj");
					var cysjDate=new Date(cysj);
					var nowSJ=new Date($("#dateScroll > p").text());
					
					if(nowSJ<rysjDate){
						// 标记不能滚动
						scrollSwitch="off";
						var nowNN = $("#zhenLiao .zlylCard .dh").attr("data-rysj").split("-")[0];
						var nowYY = $("#zhenLiao .zlylCard .dh").attr("data-rysj").split("-")[1];
						var nowRR = $("#zhenLiao .zlylCard .dh").attr("data-rysj").split("-")[2];
						hdNian=nowNN,hdYue=nowYY,hdRi=nowRR;
						// 选中
						$("#dateScroll_n").scrollTop(0);
						$("#dateScroll_y").scrollTop((nowYY-1)*50);
						$("#dateScroll_r").scrollTop((nowRR-1)*50);
						$("#dateScroll > p").text(nowNN+"-"+nowYY+"-"+nowRR);
						setTimeout(function(){
							scrollSwitch="on";
						}, 1000);   
					}else if(nowSJ>cysjDate){
						// 标记不能滚动
						scrollSwitch="off";
						var nowNN = cysj.split("-")[0];
						var nowYY = cysj.split("-")[1];
						var nowRR = cysj.split("-")[2];
						hdNian=nowNN,hdYue=nowYY,hdRi=nowRR;
						// 选中
						$("#dateScroll_n").scrollTop($("#dateScroll_n li").length*50);
						$("#dateScroll_y").scrollTop((nowYY-1)*50);
						$("#dateScroll_r").scrollTop((nowRR-1)*50);
						$("#dateScroll > p").text(nowNN+"-"+nowYY+"-"+nowRR);
						setTimeout(function(){
							scrollSwitch="on";
						}, 1000);  
						$("#dateScroll .dq").addClass('jy');
					} 
				},100);
			}
		});

		// 更新日的周几
		function updateWeek(){
			$("#dateScroll_r li").each(function(){
				if($(this).text()!==""){
					var liRi = $(this).text().split("（")[0];
					var LiNowWeek = getMyDay(new Date(hdNian+"-"+hdYue+"-"+liRi));
					$(this).text(liRi+"（"+LiNowWeek+"）");
				}
			});
		}

		// 点击取消
		var hammerDateQx = $("#dateScroll .qx").hammer();
		hammerDateQx.on("tap",function(){
			$("#zhenLiao .timeBox").hide();
		});

		// 点击今天  
		var hammerDateDq = $("#dateScroll .dq").hammer();
		hammerDateDq.on("tap",function(){
			if(!$(this).hasClass('jy')){
				// 标记不能滚动
				scrollSwitch="off";
				var nowDate = utils.todayNow().split(" ")[0];
				var nowN = nowDate.split("-")[0];
				var nowY = nowDate.split("-")[1];
				var nowR = nowDate.split("-")[2];
				hdNian=nowN,hdYue=nowY,hdRi=nowR;
				// 选中
				$("#dateScroll_n").scrollTop(10*50);
				$("#dateScroll_y").scrollTop((nowY-1)*50);
				$("#dateScroll_r").scrollTop((nowR-1)*50);
				$("#dateScroll > p").text(nowN+"-"+nowY+"-"+nowR);
				setTimeout(function(){
					scrollSwitch="on";
				}, 1000);  
			} 
		});
	}

	return{
		dateScroll:dateScroll
	}

});