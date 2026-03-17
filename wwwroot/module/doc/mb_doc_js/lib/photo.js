// 与录音 图标布局不同  名字编辑框长度会改变
define(["jquery", "hammer","jqueryhammer","utils"], function(jquery, hammer, jqueryhammer,utils) {
	function photo(){
		var winh=$(window).height();
		var winw=$(window).width();
		$("#photoRapDiv").show(); //相册总div
		$("#photoDiv").css("max-height",winh-50);  //设置最大高度
		$("#photoDiv").css("margin-top",(winh-$("#photoDiv").outerHeight())/2);  //居中
		$("#photoDiv").css("margin-left",(winw-$("#photoDiv").outerWidth())/2);
		$("#photoRapDiv").show(); //相册总div
		donghua($("#photoDiv"),1);  //相册主页
		$("#zhuzhidianji").css("display","block");  //遮罩显示
		$("#nav_li li").removeClass('selected');//清除上一次选择的相册权限
		$("#nav_li li:first").addClass('selected');//默认选中患者
		$("#menu_con .tag li").removeClass('selected');//清除上一次选择的相册名
		$("#menu_con .tag .name").css("width",winw/2-102); //名字框的长度恢复100%
		$("#menu_con .tag .name").attr("disabled",true);//文本框不可编辑 
		$("#menu_con .tag").find(".finish ").css("display","none");   //完成
		$("#menu_con .tag").find('.iconCont').css("display","none");
		// 相册名列表追加
		
		// $("#menu_con .tag").append('<ul class="huanZhe"><li><input value="我的相册11" type="text" class="name"><div class="iconCont"><span class="finish" aria-hidden="true" data-icon=""></span><span class="fs1 edit" aria-hidden="true" data-icon=""></span><span class="fs1 dele" aria-hidden="true" data-icon=""></span></div></li></ul>')
		$("#menu_con .tag").append('<ul class="quanYuan"><li><input value="我的相册21" type="text" class="name"><div class="iconCont"><span class="finish" aria-hidden="true" data-icon=""></span><span class="fs1 edit" aria-hidden="true" data-icon=""></span><span class="fs1 dele" aria-hidden="true" data-icon=""></span></div></li></ul>')
		$("#menu_con .tag").append('<ul class="Keshi"><li><input value="我的相册31" type="text" class="name"><div class="iconCont"><span class="finish" aria-hidden="true" data-icon=""></span><span class="fs1 edit" aria-hidden="true" data-icon=""></span><span class="fs1 dele" aria-hidden="true" data-icon=""></span></div></li></ul>')
		$("#menu_con .tag").append('<ul class="personal"><li><input value="我的相册41" type="text" class="name"><div class="iconCont"><span class="finish" aria-hidden="true" data-icon=""></span><span class="fs1 edit" aria-hidden="true" data-icon=""></span><span class="fs1 dele" aria-hidden="true" data-icon=""></span></div></li></ul>')
		$("#menu_con .tag").find('.quanYuan').hide();
		$("#menu_con .tag").find('.Keshi').hide();
		$("#menu_con .tag").find('.personal').hide();
       //遮罩点击
       $("#zhuzhidianji").unbind();
       var zhuzhidianjihammer=$("#zhuzhidianji").hammer();
       zhuzhidianjihammer.on('tap', function(event) {
            $("#zhuzhidianji").hide();
            $("#photoRapDiv").hide();
            $("#photoRapDiv >div").hide();
           
       });
		//相册属性 选择
		var navlihammer=$("#nav_li li").hammer();
		navlihammer.on('tap', function(event) {
			quanxian($(this))
		});
		//关闭
		var closePhotohammer=$("#photoDiv .title .fs1").hammer();
		closePhotohammer.on('tap', function(event) {
			donghua($("#photoDiv"),0);   //相册主页
			$("#zhuzhidianji").hide(); //遮罩显示
		});
		//相册名字编辑
		$("#menu_con .tag .iconCont .edit").on('touchstart', function(event) {
			event.stopPropagation();    //  阻止事件冒泡
     		event.preventDefault();     //  阻止默认行为 ( 表单提交 )
			$(this).parent().parent("li").addClass('edit');
			$(this).parent().parent("li").find("input").removeAttr("disabled");//文本框可编辑 
			$(this).parent().parent("li").find("input")[0].focus();  //获取焦点
			$(this).parent().find('.finish').show();
			$(this).parent().find('.edit').hide();
			$(this).hide();
			console.log("edit")
		});
		//相册名字完成
		$("#menu_con .tag .iconCont .finish").on('touchstart', function(event) {
			event.stopPropagation();    //  阻止事件冒泡
     		event.preventDefault();     //  阻止默认行为 ( 表单提交 )
     		$(this).parent().parent("li").find("input").attr("disabled",true);//文本框不可编辑
			$(this).parent().parent("li").find("input")[0].blur();  //失去焦点
			$(this).parent().parent("li").removeClass('edit');
			$(this).parent().parent().find('.iconCont').hide();
			$(this).hide();
			console.log("finish")
		});

		//相册名字删除
		var deleTagLihammer=$("#menu_con .tag .iconCont .dele").hammer();
		deleTagLihammer.on('tap', function(event) {
			$(this).parent().parent("li").remove();
		});

		//相册名字点击事件
		var tagLihammer=$("#menu_con .tag li").hammer();
		tagLihammer.on('tap', function(event) {
			if(!($(this).find('.iconCont').css("display")=="block"&&$(this).hasClass('edit'))){
				albumCount($(this));
			}
			console.log("li")
		});

		//相册名字左划事件
		var presstagLihammer=$("#menu_con .tag li").hammer();
		presstagLihammer.on('swipeleft', function(event) {
			$("#menu_con .tag li").removeClass('selected');
			$("#menu_con .tag li").find('.iconCont').hide();  //编辑隐藏
			$("#menu_con .tag li").find("input").attr("disabled",true);//文本框不可编辑
			$("#menu_con .tag li").removeClass('edit');//移除编辑
			$(this).addClass('selected');       //当前
			$(this).find('.iconCont').show();
			$(this).find('.fs1').show();
			$(this).find('.finish').hide();

		});	
		//添加
		var addButtonhammer=$("#menu_con .addButton").hammer();
		addButtonhammer.on('tap', function(event) {
			addnew();
		});
		//添加页面返回
		var addBackhammer=$("#addnewAlbumTitel .fs1").hammer();
		addBackhammer.on('tap', function(event) {
			donghua($("#addnewAlbum"),0); // 添加页面
			donghua($("#photoDiv"),1);  //相册主页 
		});
		//添加页面 保存 并返回
		$("#addnewAlbum .buttn").unbind();
		var buttnhammer=$("#addnewAlbum .buttn").hammer();
		buttnhammer.on('tap', function(event) {
			addSave();
		});
		//选择照片的权限
		function quanxian(thisli){
			$("#nav_li li").removeClass('selected');//选中
			thisli.addClass("selected");
			$("#menu_con .tag ul").hide();	
			switch(thisli.index()){
				case 0 :
					$("#menu_con .tag").find('.huanZhe').show();
				break;
				case 1 :
					$("#menu_con .tag").find('.quanYuan').show();
				break;
				case 2 :
					$("#menu_con .tag").find('.Keshi').show();
				break;
				case 3 :
					$("#menu_con .tag").find('.personal').show();
				break;
			}
		}

		//添加函数
		function addnew(){
			$("#addnewAlbum .count input").val("分组名称");
			for (var i = 0; i < $("#nav_li li").length; i++) {//相册属性
				if($("#nav_li li").eq(i).hasClass('selected')){
					$("#addnewAlbumTitel>span>span").text($("#nav_li li").eq(i).text());
				}
			}			
			donghua($("#photoDiv"),0); 
			$("#addnewAlbum").css("max-height",winh-50);  //设置最大高度
			$("#addnewAlbum").css("margin-top",(winh-$("#addnewAlbum").outerHeight())/2);  //居中
			$("#addnewAlbum").css("margin-left",(winw-$("#addnewAlbum").outerWidth())/2);
			donghua($("#addnewAlbum"),1);  // 添加页面
			//焦点控制 在ios上会影响会影响键盘关闭清空
			// $("#addnewAlbum .count input").focus(function(event) {
			// 	$("#addnewAlbum .count input").val("");
			// });
			// $("#addnewAlbum .count input").blur(function(event) {
			// 	$("#addnewAlbum .count input").val("分组名称");
			// });
		}

		//保存
		function addSave(){
			if($("#addnewAlbum .count input").val()==""||$("#addnewAlbum .count input").val()=="分组名称"){
				utils.showHide("请输入相册名");
			}else{
				donghua($("#addnewAlbum"),0);// 添加页面
				donghua($("#photoDiv"),1); //相册主页
				var shux=$("#addnewAlbumTitel>span>span").text();
				switch (shux){ 
				case "患者" :
					$("#menu_con .tag .huanZhe").append('<li><input value='+$("#addnewAlbum .count input").val()+' type="text" class="name"><div class="iconCont"><span class="finish" aria-hidden="true" data-icon=""></span><span class="fs1 edit" aria-hidden="true" data-icon=""></span><span class="fs1 dele" aria-hidden="true" data-icon=""></span></div></li>');
					break; 
				case "全院":
					$("#menu_con .tag .quanYuan").append('<li><input value='+$("#addnewAlbum .count input").val()+' type="text" class="name"><div class="iconCont"><span class="finish" aria-hidden="true" data-icon=""></span><span class="fs1 edit" aria-hidden="true" data-icon=""></span><span class="fs1 dele" aria-hidden="true" data-icon=""></span></div></li>'); 
					break;
				case "科室" :
					$("#menu_con .tag .Keshi").append('<li><input value='+$("#addnewAlbum .count input").val()+' type="text" class="name"><div class="iconCont"><span class="finish" aria-hidden="true" data-icon=""></span><span class="fs1 edit" aria-hidden="true" data-icon=""></span><span class="fs1 dele" aria-hidden="true" data-icon=""></span></div></li>');  
					break; 
				case "个人" :
					$("#menu_con .tag .personal").append('<li><input value='+$("#addnewAlbum .count input").val()+' type="text" class="name"><div class="iconCont"><span class="finish" aria-hidden="true" data-icon=""></span><span class="fs1 edit" aria-hidden="true" data-icon=""></span><span class="fs1 dele" aria-hidden="true" data-icon=""></span></div></li>'); 
					break;  
				}
				//列表 点击
				var tagLihammer=$("#menu_con .tag li").hammer();
				tagLihammer.on('tap', function(event) {
					if(!($(this).find('.iconCont').css("display")=="block"&&$(this).hasClass('edit'))){
						albumCount($(this));
					}
					console.log("li")
				});

				//相册名字左划事件
				var presstagLihammer=$("#menu_con .tag li").hammer();
				presstagLihammer.on('swipeleft', function(event) {
					$("#menu_con .tag li").removeClass('selected');
					$("#menu_con .tag li").find('.iconCont').hide();  //编辑隐藏
					$("#menu_con .tag li").find("input").attr("disabled",true);//文本框不可编辑
					$("#menu_con .tag li").removeClass('edit');//移除编辑
					$(this).addClass('selected');       //当前
					$(this).find('.iconCont').show();
					$(this).find('.fs1').show();
					$(this).find('.finish').hide();

				});

				//相册名字 编辑
				$("#menu_con .tag .iconCont .edit").on('touchstart', function(event) {
					event.stopPropagation();    //  阻止事件冒泡
		     		event.preventDefault();     //  阻止默认行为 ( 表单提交 )
					$(this).parent().parent("li").addClass('edit');
					$(this).parent().parent("li").find("input").removeAttr("disabled");//文本框可编辑 
					$(this).parent().parent("li").find("input")[0].focus();  //获取焦点
					$(this).parent().find('.finish').show();
					$(this).parent().find('.edit').hide();
					$(this).hide();
					console.log("edit")
				});
				//相册名字 完成
				$("#menu_con .tag .iconCont .finish").on('touchstart', function(event) {
					event.stopPropagation();    //  阻止事件冒泡
		     		event.preventDefault();     //  阻止默认行为 ( 表单提交 )
		     		$(this).parent().parent("li").find("input").attr("disabled",true);//文本框不可编辑
					$(this).parent().parent("li").find("input")[0].blur();  //失去焦点
					$(this).parent().parent("li").removeClass('edit');
					$(this).parent().parent().find('.iconCont').hide();
					$(this).hide();
					console.log("finish")
				});
				//相册名字 删除
				var deleTagLihammer=$("#menu_con .tag .iconCont .dele").hammer();
				deleTagLihammer.on('tap', function(event) {
					$(this).parent().parent("li").remove();
				});
			}
			 
		}
		//相册类容
		function albumCount(thisli){
			//相册属性
			for (var i = 0; i < $("#nav_li li").length; i++) {//相册属性
				if($("#nav_li li").eq(i).hasClass('selected')){
					var shuxing=($("#nav_li li").eq(i).text());
				}
			}
			$("#menu_con .tag li").removeClass('selected');
			$("#menu_con .tag li").find('.iconCont').hide(); //编辑隐藏
			$("#menu_con .tag li").removeClass('edit');//移除编辑
			$("#menu_con .tag li").find('.finish').hide();//完成
			thisli.addClass('selected');
			$("#albumphotoname .name").text("|  "+shuxing+" > "+thisli.find("input").val());//相册名
			$("#photourl li").find('.fs1').hide();  //图片选中图标
			$("#photourl li").find('.fs1').removeClass('active'); //图片选中
			$("#albumphotoname").show(); //标题
			$("#addnewPhoto").show();  //新加
			$("#deitphoto").hide();  //删除头部			 
			$("#deleteThePhoto").hide();//删除
			donghua($("#photoDiv"),0);
			//计算居中  显示的宽度根据图片张数计算 
			if($("#photourl li").length>24){   
				$("#albumphoto").css("max-height",winh-80);  //设置最大高度
				$("#albumphoto").css("width",winw-80);  //设置最大高度
				donghua($("#albumphoto"),1);   // 添加页面
				$("#photourl li").css("width","12.5%");
				$("#photourl").css("max-height",$("#albumphoto").outerHeight()-96);
				$("#albumphoto").css("margin-top",(winh-$("#albumphoto").outerHeight())/2);  //居中
				$("#albumphoto").css("margin-left",(winw-$("#albumphoto").outerWidth())/2);
			}else{
				$("#albumphoto").css("max-height",winh-80);  //设置最大高度				
				donghua($("#albumphoto"),1);   // 添加页面
				$("#photourl").css("max-height",$("#albumphoto").outerHeight()-96);
				$("#albumphoto").css("margin-top",(winh-$("#albumphoto").outerHeight())/2);  //居中
				$("#albumphoto").css("margin-left",(winw-$("#albumphoto").outerWidth())/2);
			}

		}
		//相册类容 返回
		var albumbackhammer=$("#albumphoto .title .fs1").hammer();
		albumbackhammer.on('tap', function(event) {
			donghua($("#albumphoto"),0);  // 添加页面
			donghua($("#photoDiv"),1);
		});
		//fsl 选中事件注册
		$("#photourl li .fs1").unbind();
		var chosefs1hammer=$("#photourl li .fs1").hammer();
		chosefs1hammer.on('tap', function(event) {
			event.stopPropagation();    //  阻止事件冒泡
			event.preventDefault();     //  阻止默认行为 ( 表单提交 )
			if($(this).hasClass('active')){
				$(this).removeClass('active');	
				$("#deitphoto .chose span").text(parseInt($("#deitphoto .chose span").text())-1);
				$("#deitphoto .all").text("全选");
			}else{
				$(this).addClass('active');	
				$("#deitphoto .chose span").text(parseInt($("#deitphoto .chose span").text())+1);
			}
				
		});
		//图片点击放大
		var photourlhammer=$("#photourl li img").hammer();
		$("#photourl li img").on('tap', function(event) {
			event.stopPropagation();    //  阻止事件冒泡
			event.preventDefault();     //  阻止默认行为 ( 表单提交 )
			photomax($(this))
			console.log('tap');
		});
		//设置图图片的高度
		function photomax(thisimg){		
			$("#photobeforebox").show();
			if($("#photobeforeImg").height()>=winh){
				$("#photobeforebox .photobefore").css("height",winh);  //设置最大高度
				if($("#photobeforeImg").width()>=winw){
					$("#photobeforebox .photobefore").css("width",winw);  //设置高度
				}else{
					$("#photobeforebox .photobefore").css("width",$("#photobeforeImg").width());  //设置高度
					$("#photobeforebox .photobefore").css("margin-left",(winw-$("#photobeforeImg").width())/2);
				}
			}else{
				$("#photobeforebox .photobefore").css("height",$("#photobeforeImg").height());  //设置高度
				$("#photobeforebox .photobefore").css("margin-top",(winh-$("#photobeforeImg").height())/2);  //居中
				if($("#photobeforebox .photobefore img").width()>=winw){
					$("#photobeforebox .photobefore").css("width",winw);  //设置高度
				}else{
					$("#photobeforebox .photobefore").css("width",$("#photobeforeImg").width());  //设置高度
					$("#photobeforebox .photobefore").css("margin-left",(winw-$("#photobeforeImg").width())/2);
				}
			}
			// 放大缩小初始化
			utils.CSHpanzoom("photobeforeImg");
		}
		//图片关闭
		var mskeClaosehammer=$("#photobeforebox .mskeClaose").hammer();
		mskeClaosehammer.on('tap', function(event) {
			$("#photobeforebox").hide();
		});
		//图片长按
		var photourlhammer=$("#photourl li").hammer();
		photourlhammer.on('press', function(event) {
			$("#photourl li").find('.fs1').show();
			$(this).find('.fs1').addClass('active');
			$("#albumphotoname").hide();
			$("#deitphoto").show();
			$("#deitphoto .chose span").text(1);
			$("#deitphoto .all").text('全选');
			$("#addnewPhoto").hide();
			$("#deleteThePhoto").show();
			console.log('press');
		});
		//全选 事件注册 deitphoto
		$("#deitphoto .all").unbind();
		var choseThishammer=$("#deitphoto .all").hammer();
		choseThishammer.on('tap', function(event) {
			if($("#deitphoto .all").text()=="全选"){
				$("#photourl li .fs1").addClass('active');
				$("#deitphoto .all").text("全不选");
				$("#deitphoto .chose span").text($("#photourl li").length);
			}else{
				$("#photourl li .fs1").removeClass('active');
				$("#deitphoto .all").text("全选");
				$("#deitphoto .chose span").text(0);
			}
		});
		//取消 faild
		var faildhammer=$("#deitphoto .faild").hammer();
		faildhammer.on('tap', function(event) {
			$("#photourl li").find('.fs1').hide();
			$("#photourl li").find('.fs1').removeClass('active');
			$("#albumphotoname").show();
			$("#deitphoto").hide();
			$("#addnewPhoto").show();
			$("#deleteThePhoto").hide();		
		});
		//删除 deleteThePhoto
		var deleteThePhotohammer=$("#deleteThePhoto").hammer();
		deleteThePhotohammer.on('tap', function(event) {
			for (var i = 0; i < $("#photourl li").length; i++) {
				if($("#photourl li").eq(i).find(".fs1").hasClass('active')){
					$("#photourl li").eq(i).hide();
				}
			}    
		});
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
		//下面用于图片上传预览功能
		$("#doc").bind("change",function setImagePreview() {
	        var docObj = document.getElementById("doc");
	        var dd = document.getElementById("ddImgdiv");
	        dd.innerHTML = "";
	        var fileList = docObj.files;
	        for (var i = 0; i < fileList.length; i++) {            
	            dd.innerHTML += "<div style='float:left; margin:2px' > <img id='img" + i + "'  /> </div>";
	            var imgObjPreview = document.getElementById("img"+i); 
	            if (docObj.files && docObj.files[i]) {
	                //火狐下，直接设img属性
	                imgObjPreview.style.display = 'block';
	                imgObjPreview.style.width = '50px';
	                imgObjPreview.style.height = '50px';
	                //imgObjPreview.src = docObj.files[0].getAsDataURL();
	                //火狐7以上版本不能用上面的getAsDataURL()方式获取，需要一下方式
	                imgObjPreview.src = window.URL.createObjectURL(docObj.files[i]);
	            } else {
	                //IE下，使用滤镜
	                docObj.select();
	                var imgSrc = document.selection.createRange().text;
	                alert(imgSrc)
	                var localImagId = document.getElementById("img" + i);
	                //必须设置初始大小
	                localImagId.style.width = "50px";
	                localImagId.style.height = "50px";
	                //图片异常的捕捉，防止用户修改后缀来伪造图片
	                try {
	                    localImagId.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale)";
	                    localImagId.filters.item("DXImageTransform.Microsoft.AlphaImageLoader").src = imgSrc;
	                }
	                catch (e) {
	                    alert("您上传的图片格式不正确，请重新选择!");
	                    return false;
	                }
	                imgObjPreview.style.display = 'none';
	                document.selection.empty();
	            }
	        }  
	        return true;		  
    	});
	}
	return {
        photo:photo
    };
})