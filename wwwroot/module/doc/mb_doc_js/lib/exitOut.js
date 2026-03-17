define(["jquery", "hammer","jqueryhammer","utils","photo","video"], function(jquery, hammer, jqueryhammer,utils,photo,video) {

	//注销 
	hammeroutLoginBox = $("#outLoginBox").hammer();
	hammeroutLoginBox.on('tap', function(ev) {
		back();
	});

	function back(){

		utils.alertPrompt("您是否确认注销？","gantan","qdqx");
		utils.myconfirm(okExitOut, cancelExitOut);

		function okExitOut(){
			$("#promptQDQX").hide();
			$("#loginBox").show();
			$("#mainNavMin ul li").removeClass("jinyong active");
			$("#password").val("");
			$(".threeIframe").remove();            // 清空第三方iframe
			photo.closePhoto();
			// 判断录音状态
			video.closeAudio();
			window.loged = false;
			window.enterFlagd = null;
			$("#pageContral").hide();//体温的导航按钮
			$("#RecordPAge").hide(); //体温单的护理记录 导航
			$("#pageListhoose").hide();//体温单list
			$("#huiLpages").hide();//护理记录
			$("#mainNavMin .AssUrl").remove();   //三方系统
			$("#mainNavMin .AssUrltype").remove(); 
		}
		function cancelExitOut(){
			$("#promptQDQX").hide();
		}
	
	}

});