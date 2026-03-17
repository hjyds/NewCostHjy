define(["jquery", "hammer","jqueryhammer","utils"], function(jquery, hammer, jqueryhammer,utils) {
	function video(){	
		$("#videoRapDiv").show(); //录音总div	
		$("#videoDiv").css("max-height",$(window).height()-50);  //设置最大高度
		$("#videoDiv").css("margin-top",($(window).height()-$("#videoDiv").outerHeight())/2);  //居中
		$("#videoDiv").css("margin-left",($(window).width()-$("#videoDiv").outerWidth())/2);
		$("#zhuzhidianji").css("display","block");  //遮罩显示
		donghua($("#videoDiv"),1);//1 显示  2 消失		
		$("#videoLi li input").css("width",$("#videoLi li").width()-107);  //input的长度		
		$("#videoLi li").parent().find('input').attr("disabled",true);//文本框不可编辑
		$("#videoLi li").find('.videoTime').css("display","block");
		$("#videoLi li").find(".shiting ").css("display","block");  //播放
		$("#videoLi li").find(".finish ").css("display","none");   //完成
		$("#videoLi li").find('.fs1').css("display","none");	
		$("#videoLi li").removeClass('active');
		
		//遮罩点击
       $("#zhuzhidianji").unbind();
       var zhuzhidianjihammer=$("#zhuzhidianji").hammer();
       zhuzhidianjihammer.on('tap', function(event) {
            $("#zhuzhidianji").hide();
          	$("#videoRapDiv").hide();
          	$("#videoRapDiv >div").hide();
        });
		//点击添加
		var newVideohammer= $("#newVideo").hammer();
		newVideohammer.on('tap', function(event) {
			donghua($("#videoDiv"),0);
			$("#videoLi li").removeClass('active');
			$("#videoLi li").find('.videoTime').css("display","block");  //时间
			$("#videoLi li").find(".shiting ").css("display","block");  //播放
			$("#videoLi li").find('.fs1').css("display","none"); //图标
			//录音内容 层出现
			$("#videojiemian").css("max-height",$(window).height()-50);
			$("#videojiemian").css("margin-top",($(window).height()-$("#videojiemian").outerHeight())/2);
			$("#videojiemian").css("margin-left",($(window).width()-$("#videojiemian").outerWidth())/2);
			donghua($("#videojiemian"),1);
		});

		//li 左划删除事件
		$("#videoLi li").unbind();
		var videoLihammer=$("#videoLi li").hammer();
		videoLihammer.on('swipeleft', function() {
			$("#videoLi li").find('.videoTime').css("display","block");
			$("#videoLi li").find('.fs1').css("display","none");	
			$("#videoLi li").find('.finish').css("display","none");	 //完成
			$("#videoLi li").removeClass('active');
			$("#videoLi li").removeClass('edit');
			$("#videoLi li").find('input').attr("disabled",true);//文本框不可编辑
			$(this).addClass('active');
			$(this).find(".videoTime").css("display","none");
			$(this).find(".shiting ").css("display","none");
			$(this).find('.fs1').css("display","block");	
			console.log("swipeleft");
		});		
		//li点击事件
		$("#videoLi li").on('tap', function() {
			if($(this).hasClass('edit')&&$(this).find('.fs1').css("display")=="block"){
				$(this).find('input')[0].focus();

			}else{
				$("#videoLi li").removeClass('edit');
				$("#videoLi li").find('input').attr("disabled",true);//文本框不可编辑
				$("#videoLi li").find('.videoTime').css("display","block");
				$("#videoLi li").find(".shiting ").css("display","block");  //播放
				$("#videoLi li").find('.fs1').css("display","none");
				$("#videoLi li").find('.finish').css("display","none");	 //完成
				$("#videoLi li").removeClass('active');
				$(this).addClass('active');	
				console.log("tap li");
			}
		});
		//编辑按钮事件注册
		$("#videoLi li .edit").on('touchstart', function() {
			$(this).parent().parent().find('input').removeAttr("disabled");
			$(this).parent().parent().find('input')[0].focus();
			$(this).parent().parent("li").addClass('edit');
			$(this).parent().find('.edit').hide();
			$(this).parent().find('.finish').show();
			console.log("tap edit");
			event.stopPropagation();    //  阻止事件冒泡
     		event.preventDefault();     //  阻止默认行为 ( 表单提交 )
		});
		//完成 
		$("#videoLi li .finish").on('touchstart', function() {
			$(this).parent().parent().removeClass('edit');
			$(this).parent().parent().find('input').attr("disabled",true);//文本框不可编辑
			$(this).parent().parent().find('input').find("input")[0].blur();  //失去焦点
			$(this).parent().parent().find('.videoTime').css("display","block");
			$(this).parent().parent().find(".shiting ").css("display","block");  //播放
			$(this).parent().parent().find('.fs1').css("display","none");
			$(this).parent().parent().find('.finish').css("display","none");	 //完成
			console.log("tap finish");
			event.stopPropagation();    //  阻止事件冒泡
     		event.preventDefault();     //  阻止默认行为 ( 表单提交 )
		});
		//关闭按钮
		var delthisVideohammer=$("#delthisVideo").hammer();
		delthisVideohammer.on('tap', function(event) {
			donghua($("#videoDiv"),0);
			$("#zhuzhidianji").css("display","none");
		});
		//删除按钮事件注册
		var dellVideoLihammer=$("#videoLi li .dele").hammer();
		dellVideoLihammer.on('tap', function(event) {
			$(this).parent().parent().remove();
			console.log("dele");
		});
		//录音界面 关闭按钮
		var videojiemianhammer=$("#videojiemian .colevideo").hammer();
		videojiemianhammer.on('tap', function(event) {	
			donghua($("#videojiemian"),0);
			donghua($("#videoDiv"),1);
		});
		//录音界面 完成按钮
		var videoCompletehammer=$("#videoComplete").hammer();
		videoCompletehammer.on('tap', function(event) {
			videoComplete();
			
		});
		//完成录音
		function videoComplete(){
			$("#videojiemian").css("display","none");
			$("#zhuzhidianji").css("display","none");			
			var d = new Date();  //
			var vYear = d.getFullYear()
			var vMon = d.getMonth() + 1
			if(vMon<10){
				vMon="0"+vMon;
			}
			var vDay = d.getDate();
			if(vDay<10){
				vDay="0"+vDay;
			}
			var h = d.getHours(); 
			var m = d.getMinutes(); 
			$("#videoLi").append('<li><input type="text" value="我的录音" /><div class="videoTime"><span>00:03</span><span>'+vYear+"-"+vMon+"-"+vDay+" "+h+":"+m+'</span></div><span class="fs1 dele" aria-hidden="true" data-icon=""></span><span class="fs1 edit" aria-hidden="true" data-icon=""></span></li>');
			$("#videoDiv").css("max-height",$(window).height()-50);  //设置最大高度
			$("#videoDiv").css("margin-top",($(window).height()-$("#videoDiv").outerHeight())/2);  //居中
			$("#videoDiv").css("margin-left",($(window).width()-$("#videoDiv").outerWidth())/2);
			$("#videoDiv").css("display","block");   // 
			$("#zhuzhidianji").css("display","block");  //遮罩显示
			$("#videoLi li input").css("width",$("#videoLi li").width()-107);  //input的长度		
			$("#videoLi li").parent().find('input').attr("disabled",true);//文本框不可编辑
			$("#videoDiv").removeClass('animated fadeOutUp');
		}
		//控制动画
		function donghua(thisId,nooryes){
			if(nooryes==1){
				thisId.removeClass('animated fadeOutUp');
				thisId.addClass('animated fadeInUp');
				thisId.css("display","block");
			}else{
				thisId.removeClass('animated fadeInUp');
				thisId.addClass('animated fadeOutUp');
				setTimeout(function(){ 
    				thisId.css("display","none");			
    			}, 550);
			}
				
		}

	}
	return {
        video:video
    };
})