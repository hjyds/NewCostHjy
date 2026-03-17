// 上传、删除、选择备忘都需要判断当前状态
// 【需要判断当前状态】
define([
	"jquery", 
	"utils",
	"layer"
], function(
	jquery,
	utils,
	layer
){
	var recordName;						//当前选择、创建的备忘录名
	var audioName;						//当前录音名称（与壳通讯和文件读取用）
	var recordStatus = 0;				//录音状态【0为为无状态，1为正在录音,2为暂停录音，3为录音完成，4为正在播放，5为暂停播放，6为播放完成】
	var isOnline = false;				//当前是在线还是本地【默认本地】
	var newRecord = {};					//新录音
	var patient = {};					//病人信息
	var docInfo = {};					//医生信息
	var ftpInfo = {};					//ftp服务器信息
	var localAudio = [];				//缓存的本地列表
	var onlineAudio = [];				//缓存的在线列表
	var platform;						//平台信息

	var deleteIndex;					//上传完成后本地删除对应的索引

	var service;
	var audioURL;

	var countMsg = false;

	// 将时间转换为标准时间 2017-03-09 10:36 || type(1)时为217-03-09
	var dateFilter = function(date,type){
		var toDecimal = function(input){
			input = (input<10) ? ('0' + input) : input;
			return input;
		}
		if(type==1){
			return '' + date.getFullYear()+ '-' + toDecimal(date.getMonth() + 1) + '-' + toDecimal(date.getDate());
		}else{
			return '' + date.getFullYear()+ '-' + toDecimal(date.getMonth() + 1) + '-' + toDecimal(date.getDate()) + ' ' + toDecimal(date.getHours()) + ':' + toDecimal(date.getMinutes()) + ':' + toDecimal(date.getSeconds());
		}
	}
	// 序列化请求体
	var param = function(obj){
		var arr = [],str;
		for(var p in obj){
			str = p+'='+obj[p];
			arr.push(str);
		}
		str = arr.join('&');
		return str;
	}
	// 简易ajax POST封装
	var $ajax = function(url,postObj,callback){
		var xhr = new XMLHttpRequest();
		xhr.open('POST',url,true);
		xhr.responseType = 'JSON';
		xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
		xhr.send(param(postObj));
		xhr.onreadystatechange = function(){
    		if(xhr.readyState === 4 && xhr.status === 200){
        		callback(xhr.response); 
			}else{
				console.log(xhr);
			}
		}
	}
	// 将一个返回结果转换为数组
	var toArray = function(input){
		if(typeof(input)=='object'&&!Array.isArray(input)){
			var arr = [];
			arr.push(input);
			return arr;
		}else{
			return input;
		}
	}
	/*关闭录音界面*/
	var closeAudio = function(){
		var oldClass = document.querySelector('.audio').className;
		if(recordStatus==1||recordStatus==2&&countMsg){
			layer.msg('录音已切换到后台');
			countMsg = false;
		}
		document.querySelector('.audio').className = oldClass + ' slideOutLeft';
	}
	// 判断录音描述是否为空
	function isNull(val){
		if((val=='')||(val=='请输入录音描述')){
			return true;
		}else{
			return false;
		}
	}
	document.querySelector('.closeAudio').addEventListener('click',function(){
		closeAudio();
	},false);
	/*创建新备忘*/
	var createRecord = function(){
		layer.prompt({tite:'请输入录音名'},function(value){
			// 重置录音状态
			audioName = '';
			recordStatus = 0;
			layer.closeAll();
			newRecord = {};
			recordName = value;
			countMsg = true;
			document.querySelector('.startRecord').innerHTML = '开始录音';
			document.querySelectorAll('.play-pause')[1].innerHTML = '试听';
			// 显示录音界面
			var buttons = document.querySelector('.record').querySelectorAll('button');
			for (var i = 0; i < buttons.length; i++) {
				if(!i||i==1){
					buttons[i].className = buttons[i].className.replace(' disabled','');
				}else{
					buttons[i].className = buttons[i].className + ' disabled';
				}
			}
			document.querySelector('.input-box').innerHTML = '';
			document.querySelector('.currentAudio').innerHTML = recordName;
			document.querySelector('.doned').style.display = 'none';
			document.querySelector('.isRecord').style.display = 'block';
			document.querySelector('.audio-detail').style.display = 'block';
			document.querySelector('.uploadAudio,btn-danger').style.display = 'block';
		});
	}
	/*保存备忘录【本地】*/
	var saveMemo = function(callback){
		var val = document.querySelector('.input-box').innerHTML.replace(/(^\s*)|(\s*$)/g,'');
		var LX,audio;
		var exsit = null;
		for (var i = 0; i < localAudio.length; i++) {
			if(localAudio[i].name==recordName){
				exsit = i;
			}
		}
		if(exsit!==null){
			localAudio[exsit].describe = val;
			localStorage.localAudio = JSON.stringify(localAudio);
		}else{
			if(isNull(val)&&!audioName){
				// layer.alert('备忘录的文本和录音至少存在一项');
				return;
			}else if(val&&!audioName){
				LX = 1;
				var audio = {patientID:patient.PATIID, name: recordName,time: null,date: dateFilter(new Date()),describe: val,audioName: audioName,LX: LX, platform:platform}
			}else if(!val&&audioName){
				LX = 3;
				var audio = {patientID:patient.PATIID, name: recordName,time: newRecord.time,date: dateFilter(new Date()),describe: null,audioName: audioName,LX: LX, platform:platform}
			}else if(val&&audioName){
				LX = 0;
				var audio = {patientID:patient.PATIID, name: recordName,time: newRecord.time,date: dateFilter(new Date()),describe: val,audioName: audioName,LX: LX, platform:platform}
			}
			localAudio.push(audio);
			localStorage.localAudio = JSON.stringify(localAudio);
			if(!isOnline){
				renderList(localAudio); 
			}
		}
		if(callback) callback();
	}
	/*本地、在线录音切换*/
	document.querySelectorAll('.isOnline')[0].addEventListener('click',function(){
		if(this.className.match('active')){
			return;
		}else{
			isOnline = false;
			this.className = this.className + ' active';
			document.querySelectorAll('.isOnline')[1].className = document.querySelectorAll('.isOnline')[1].className.replace(' active','');
			renderList(localAudio);
			$('.uploadAudio').show();
			var val = document.querySelector('.input-box').innerHTML.replace(/(^\s*)|(\s*$)/g,'');
			if(recordStatus==0&&!isNull(val)){
				saveMemo();
			}
			$('.audio-detail').hide();
		}
	},false);
	document.querySelectorAll('.isOnline')[1].addEventListener('click',function(){
		if(this.className.match('active')){
			return;
		}else{
			isOnline = true;
			this.className = this.className + ' active';
			document.querySelectorAll('.isOnline')[0].className = document.querySelectorAll('.isOnline')[0].className.replace(' active','');
			renderList(onlineAudio);
			$('.uploadAudio').hide();
			var val = document.querySelector('.input-box').innerHTML.replace(/(^\s*)|(\s*$)/g,'');
			if(recordStatus==0&&!isNull(val)){
				saveMemo();
			}
			$('.audio-detail').hide();
		}
	},false);
	/*添加新录音*/
	document.querySelector('.addAudio').addEventListener('click',function(){
		switch (recordStatus){
			case 0:case 3:case 6:
				createRecord();
				break;
			case 1:
				layer.confirm('当前录音未保存，是否保存',function(){
					recordStatus = 3;
					shell.stopRecord(0);
					// 创建新录音
				},function(){
					recordStatus = 0;
					shell.stopRecord(1);
					createRecord();
				});
				break;
			case 2:
				recordStatus = 3;
				shell.stopRecord(0);
				// 创建新录音
				break;	
			case 4:
				layer.confirm('是否停止当前播放',function(){
					recordStatus = 6;
					shell.stopPlay();
					createRecord();
				},function(){
					layer.closeAll();
					// nothing
				});
				break;
			case 5:
				recordStatus = 6;
				shell.stopPlay();
				createRecord();
				break;
		}
	},false);
	/*开始、暂停录音*/
	document.querySelector('.startRecord').addEventListener('click',function(){
		if(this.className.match('disabled')) return;
		if(recordStatus!=1&&recordStatus!=2){
			recordStatus = 1;
			this.innerHTML = '暂停录音';
			this.style.backgroundColor = '#d9534f';
			this.style.borderColor = '#d9534f';
			document.querySelectorAll('.isPlay')[1].src = '../home/img/playing.gif';
			audioName = recordName + '_' + patient.PATIID + '_' + patient.BABY + '_' + docInfo.USER + '_' + dateFilter((new Date()),1);
			shell.startRecord(audioName);
		}
		else if(recordStatus==1){
			recordStatus = 2;
			this.innerHTML = '继续录音';
			this.style.backgroundColor = '';
			this.style.borderColor = '';
			document.querySelectorAll('.isPlay')[1].src = '../home/img/unplay.gif';
			shell.pauseRecord();
		}
		else if(recordStatus==2){
			recordStatus = 1;
			this.innerHTML = '暂停录音';
			this.style.backgroundColor = '#d9534f';
			this.style.borderColor = '#d9534f';
			document.querySelectorAll('.isPlay')[1].src = '../home/img/playing.gif';
		}
	},false);
	/*停止录音*/
	document.querySelector('.stopRecord').addEventListener('click',function(){
		if(this.className.match('disabled')) return;
		shell.stopRecord(0);
	},false);
	/*播放、暂停录音*/
	var play_pause = document.querySelectorAll('.play-pause');
	play_pause[0].addEventListener('click',function(){
		if(play_pause[0].className.match('disabled')) return;
		// 开始播放录音
		if(recordStatus==4){
			recordStatus = 5;
			play_pause[0].innerHTML = '播放';
			play_pause[0].style.backgroundColor = '';
			play_pause[0].style.borderColor = '';
			document.querySelectorAll('.isPlay')[0].src = '../home/img/unplay.gif';
			shell.pauseAudio();
		}else if(recordStatus==5){
			recordStatus = 4;
			play_pause[0].innerHTML = '暂停';
			play_pause[0].style.backgroundColor = '#d9534f';
			play_pause[0].style.borderColor = '#d9534f';
			document.querySelectorAll('.isPlay')[0].src = '../home/img/playing.gif';
			shell.replayAudio();
		}else{
			recordStatus=4;
			play_pause[0].innerHTML = '暂停';
			play_pause[0].style.backgroundColor = '#d9534f';
			play_pause[0].style.borderColor = '#d9534f';
			document.querySelectorAll('.isPlay')[0].src = '../home/img/playing.gif';
			shell.playAudio(audioName);
		}
	});
	play_pause[1].addEventListener('click',function(){
		if(play_pause[1].className.match('disabled')) return;
		// 开始播放录音
		if(recordStatus==4){
			recordStatus = 5;
			play_pause[1].innerHTML = '播放';
			play_pause[1].style.backgroundColor = '';
			play_pause[1].style.borderColor = '';
			document.querySelectorAll('.isPlay')[1].src = '../home/img/unplay.gif';
			shell.pauseAudio();
		}else if(recordStatus==5){
			recordStatus = 4;
			play_pause[1].innerHTML = '暂停';
			play_pause[1].style.backgroundColor = '#d9534f';
			play_pause[1].style.borderColor = '#d9534f';
			document.querySelectorAll('.isPlay')[1].src = '../home/img/playing.gif';
			shell.replayAudio();
		}else{
			recordStatus=4;
			play_pause[1].innerHTML = '暂停';
			play_pause[1].style.backgroundColor = '#d9534f';
			play_pause[1].style.borderColor = '#d9534f';
			document.querySelectorAll('.isPlay')[1].src = '../home/img/playing.gif';
			shell.playAudio(audioName);
		}
	});
	document.querySelector('.online-play-pause').addEventListener('click',function(){
		if(this.innerHTML=='播放'||this.innerHTML=='重播'){
			document.querySelector('#audioPlayer').currentTime = 0;
			document.querySelector('#audioPlayer').play();
			this.innerHTML = '暂停';
			recordStatus = 4;
		}else{
			if(document.querySelector('#audioPlayer').paused){
				document.querySelector('#audioPlayer').play();
				this.innerHTML = '暂停';
				recordStatus = 4;
			}else{
				document.querySelector('#audioPlayer').pause();
				this.innerHTML = '继续';
				recordStatus = 5;
			}
		}
	},false);
	document.querySelector('#audioPlayer').addEventListener('ended',function(){
		document.querySelector('.online-play-pause').innerHTML = '重播';
	},false);
	/*停止播放【录音界面和播放界面通用】*/
	var stop_play = document.querySelectorAll('.stop-play');
	stop_play[0].onclick = function(){
		shell.stopPlay();
		for (var i = 0; i < play_pause.length; i++) {
			play_pause[0].innerHTML = '播放';
			play_pause[0].style.backgroundColor = '';
			play_pause[0].style.borderColor = '';
			document.querySelectorAll('.isPlay')[1].src = '../home/img/unplay.gif';
			recordStatus = 6;
		}
	}
	stop_play[1].onclick = function(){
		shell.stopPlay();
		for (var i = 0; i < play_pause.length; i++) {
			play_pause[1].innerHTML = '播放';
			play_pause[1].style.backgroundColor = '';
			play_pause[1].style.borderColor = '';
			document.querySelectorAll('.isPlay')[1].src = '../home/img/unplay.gif';
			recordStatus = 6;
		}
	}
	document.querySelector('.online-stop-play').addEventListener('click',function(){
		document.querySelector('#audioPlayer').pause();
		document.querySelector('.online-play-pause').innerHTML = '播放';
		recordStatus = 6;
	},false);
	var deleteAudio_button = document.querySelector('.deleteAudio');
	// 删除录音
	deleteAudio_button.onclick = function(){
		if(recordStatus==1||recordStatus==2){
			layer.confirm('当前录音未保存，是否放弃？',function(){
				shell.stopRecord(1);
				recordStatus = 0;
			},function(){
				layer.closeAll();
				return;
			});
		}else if(recordStatus==4||recordStatus==5){
			shell.stopPlay();
			recordStatus = 0;
		}
		layer.confirm('您确定删除', {
		  	btn: ['确定','取消'] //按钮
		}, function(){
			// 判断是删除【本地录音、线上录音】
			if(isOnline){
				deleteFileOnline();
			}else{
				// 先删除缓存
				for (var i = 0; i < localAudio.length; i++) {
					if(localAudio[i].name==recordName){
						if(localAudio[i].audioName){
							var audioName = localAudio[0].audioName;
							shell.deleteRecord(audioName);
						}
						localAudio.splice(i,1);
						break;
					}
				}
				localStorage.localAudio = JSON.stringify(localAudio);
				renderList(localAudio);
				document.querySelector('.doned').style.display = 'none';
				document.querySelector('.isRecord').style.display = 'none';
				document.querySelector('.audio-detail').style.display = 'none';
				document.querySelector('.addAudio').className = document.querySelector('.addAudio').className.replace(' disabled','');
				layer.closeAll();
			}
		}, function(){
			layer.closeAll();
			return;
		});
	}
	// 上传录音
	document.querySelector('.uploadAudio').onclick = function(){
		if(recordStatus==1||recordStatus==2){
			layer.confirm('当前录音未保存，是否放弃？',function(){
				shell.stopRecord(1);
				recordStatus = 0;
			},function(){
				layer.closeAll();
				return;
			});
		}
		else if(recordStatus==4||recordStatus==5){
			shell.stopPlay();
			recordStatus = 0;
		}
		if(document.querySelector('.isRecord').style.display=='block'){
			// 录音界面[先停止录音]
			if(recordStatus==1||recordStatus==2){
				shell.stopRecord(0);
			}else if(recordStatus==4||recordStatus==5){
				shell.stopPlay();
			}
			var describe = document.querySelector('.input-box').innerHTML.replace(/(^\s*)|(\s*$)/g,'');
			if(isNull(describe)){
				layer.confirm('您确定不输入录音描述',function(){
					layer.closeAll();
					upload(describe,audioName);
				},function(){
					layer.closeAll();
					return;
				})
			}else{
				upload(describe,audioName);
			}
		}else{
			// 本地播放界面
			for (var i = 0; i < localAudio.length; i++) {
				if(localAudio[i].name==recordName){
					describe = localAudio[i].describe;
					audioName = localAudio[i].audioName;
					deleteIndex = i;
					break;
				}
			}
			upload(describe,audioName);
		}
		function upload(describe,audio){
			if(!describe&&!audio){
				layer.alert('备忘录的文本和录音至少存在一项');
				return;
			}else if(describe&&!audio){
				var LX = 1;
			}else if(!describe&&audio){
				var LX = 3;
			}else if(describe&&audio){
				var LX = 0;
			}
			layer.open({
			  type: 3,
			  icon: 1,
			  shade: [0.3,'#fff'],
			  content: '<p style="position: absolute;top: 50px;width: 100px;left: -30px;">正在上传录音，请勿做其它操作</p>',
			}); 
			var url = service + '/Regin';
			var ML = "/"+patient.PATIID+"/"+docInfo.USER+"/"+ dateFilter((new Date()),1)+"/";
			var postObj = {
				strXML: JSON.stringify({
					'IN': {
						"SYS": "001",
					    "FUNC": "DocServer_Upload",
					    "MC": recordName,                        										//文件名称
					    "FILE": audio,
					    "NR": describe,                             									//文本信息
					    "ML": ML,	//目录，前后都需要加斜杠
					    "PATIID": patient.PATIID,
					    "PAGEID": patient.PAGEID,
					    "BABY": patient.BABY,
					    "LX": LX,       //0.默认（既有语音又有文本）//1.文本 （只有文本信息）//3.音频 （只有音频信息）
					    "PT": platform
					}
				})
			}			
			$ajax(url,postObj,function(res){
				var res = JSON.parse(res);
				if(res.result.ERROR){
					layer.alert(res.result.ERROR);
					return;
				}else{
					if(LX==3||LX==0){
						shell.uploadAudio(audioName,ML);
					}else{
						layer.closeAll();
						layer.alert('上传成功');
						deteltLocalRecord(deleteIndex);
						// 重新获取在线录音列表
						getOnlineAudios();
					}
				}
			});
		}
	}
	// 本地删除当前记录
	var deteltLocalRecord = function(deleteIndex){
		localAudio.splice(deleteIndex,1);
		localStorage.localAudio = JSON.stringify(localAudio);
		renderList(localAudio);
		layer.msg('录音已上传，请到在线列表查看');
	}
	// 选中一条录音时
	document.querySelector('.audio-list').onclick = function(e){
		if(e.target.nodeName=='LI'||e.target.nodeName=='SPAN'){
			var index = e.target.getAttribute('data-Index')?e.target.getAttribute('data-Index'):e.target.parentNode.getAttribute('data-Index');
			if(index==undefined) return;
		}
		var val = document.querySelector('.input-box').innerHTML.replace(/(^\s*)|(\s*$)/g,'');
		if(recordStatus==1||recordStatus==2){
			layer.confirm('当前录音未保存，是否放弃？',function(){
				shell.stopRecord(1);
				recordStatus = 0;
			},function(){
				layer.closeAll();
				return;
			});
		}else if(recordStatus==4||recordStatus==5){
			document.querySelector('#audioPlayer').paused = true;
			shell.stopPlay();
			recordStatus = 0;
		}else if(recordStatus==0&&!isNull(val)){
			saveMemo();
		}
		recordStatus = 0;
		shell.stopPlay();
		for (var i = 0; i < play_pause.length; i++) {
			play_pause[i].innerHTML = '播放';
			play_pause[i].style = '';
		}
		var audio_list = document.querySelector('.audio-list').querySelectorAll('li');
		for (var i = 0; i < audio_list.length; i++) {
			audio_list[i].className = '';
		}
		document.querySelector('.audio-list').querySelectorAll('li')[index].className = 'active';
		document.querySelector('.audio-detail').style.display = 'block';
		document.querySelector('.doned').style.display = 'block';
		document.querySelector('.isRecord').style.display = 'none';
		if(isOnline){
			recordName = onlineAudio[index].name;
			document.querySelector('.uploadAudio').style.display = 'none';
			document.querySelector('.currentAudio').innerHTML = onlineAudio[index].name;
			// 判断是否有录音
			if(onlineAudio[index].path&&onlineAudio[index].audioName){
				var type = onlineAudio[index].platform=='ios'?'.mp3':'.wav';
				document.querySelector('.no-audio').style.display = 'none';
				document.querySelectorAll('.audioOperation')[0].style.display = 'none';
				document.querySelector('#audioPlayer').src = audioURL+onlineAudio[index].path+onlineAudio[index].audioName+type;
				document.querySelector('.audioPlayer').style.display = 'block';
				document.querySelector('.online-play-pause').innerHTML = '播放';
			}else{
				document.querySelector('.audioPlayer').style.display = 'none';
				document.querySelectorAll('.audioOperation')[0].style.display = 'none';
				document.querySelector('.no-audio').style.display = 'block';
			}
			// 判断是否有文本备忘
			if(onlineAudio[index].describe){
				document.querySelector('.show-text').innerHTML = onlineAudio[index].describe;
			}else{
				document.querySelector('.show-text').innerHTML = '该备忘无文本记录';
			}
		}else{
			document.querySelector('.uploadAudio').style.display = 'block';
			recordName = document.querySelector('.currentAudio').innerHTML = localAudio[index].name;
			document.querySelector('.createTime').innerHTML = localAudio[index].date;
			// 判断是否有录音
			if(localAudio[index].audioName){
				document.querySelector('.no-audio').style.display = 'none';
				document.querySelector('.audioPlayer').style.display = 'none';
				document.querySelectorAll('.audioOperation')[0].style.display = 'block';
				document.querySelectorAll('.play-pause').innerHTML = '播放';
				audioName = localAudio[index].audioName;
			}else{
				document.querySelector('.no-audio').style.display = 'none';
				document.querySelector('.audioPlayer').style.display = 'none';
				document.querySelector('.no-audio').style.display = 'block';
				document.querySelectorAll('.audioOperation')[0].style.display = 'none';
			}
			// 判断是否有文本备忘
			if(localAudio[index].describe){
				document.querySelector('.show-text').innerHTML = localAudio[index].describe;
			}else{
				document.querySelector('.show-text').innerHTML = '该备忘无文本记录';
			}
		}
	}
	// 返回病人列表时
	$('#mainNavMin li').on('click',function(){
		closeAudio();
		layer.msg('')
	});


	document.querySelector('.qieHuanBox').addEventListener('click',function(){
		if(recordStatus==1||recordStatus==2){
			layer.confirm('当前录音未保存，是否放弃？',function(){
				shell.stopRecord(1);
				recordStatus = 0;
				layer.closeAll();
				closeAudio();
			},function(){
				layer.closeAll();
				return;
			})
		}else if(recordStatus==4||recordStatus==5){
			shell.stopPlay();
			recordStatus = 0;
			document.querySelector('#audioPlayer').paused = true;
			closeAudio();
		}
	},true);

	/*获取本地录音列表*/
	var getLocalAudio = function(){
		if(localStorage.localAudio){
			localAudio = [];
			var arr = JSON.parse(localStorage.localAudio);
			for (var i = 0; i < arr.length; i++) {
				if(arr[i].patientID==patient.PATIID){
					localAudio.push(arr[i]);
				}
			}
		}
	}
	/*获取服务器端的录音列表*/
	var getOnlineAudios = function(callback){
		var arr = [];
        var url = service + '/DocServer_Filter';
		var postObj = {
			strXML: JSON.stringify({
				"IN": {
				 	"SYS": "001",
			        "FUNC": "DocServer_Filter",
			        "PATIID": patient.PATIID,
			        "PAGEID": patient.PAGEID,
			        "BABY": patient.BABY,
			        "CZY": docInfo.XM
				}
			})
		}
		$ajax(url,postObj,function(res){
			var res = JSON.parse(res);
			if(res.result){
				if(res.result.ERROR){
					layer.alert(res.result.ERROR);
				}else{
					onlineAudio = [];
					if(!res.result.FILELIST) return;
					var arr = toArray(res.result.FILELIST.FILE);
					for (var i = 0; i < arr.length; i++) {
						var audio = {date:arr[i].RQ.replace(/\//img,'-'), describe:arr[i].NR, name:arr[i].MC, time:null, path:arr[i].ML, LX:arr[i].LX, audioName:arr[i].FILE, platform:arr[i].PT};
						onlineAudio.push(audio);
					}
					if(callback) callback(onlineAudio);
				}
			}
		});
	}
	/*删除在线录音*/
	var deleteFileOnline = function(){
		var onlineIndex;
		for (var i = 0; i < onlineAudio.length; i++) {
			if(onlineAudio[i].name==recordName){
				onlineIndex = i;
				break;
			}
		}
		var url = service + '/Regin';
		var postObj = {
			strXML: JSON.stringify({
				'IN': {
					"SYS": "001",
			        "FUNC": "DocServer_Delete",
					"LX": onlineAudio[onlineIndex].LX,    //0.默认（既有语音又有文本）
						        				//1.文本 （只有文本信息）
						        				//3.音频 （只有音频信息）
			       	"PLATFORM": platform,   //平台信息：android或ios
			       	"MC": onlineAudio[onlineIndex].name,            	//备忘录名称
			       	"FILE": onlineAudio[onlineIndex].audioName?onlineAudio[onlineIndex].audioName:null,			//录音文件名
			        "ML": onlineAudio[onlineIndex].path?onlineAudio[onlineIndex].path:null             //目录
				}
			})
		}
		$ajax(url,postObj,function(res){
			var res = JSON.parse(res);
			if(res.result.ERROR){
				layer.alert(res.result.ERROR.MSG);
			}else{
				layer.alert('删除成功');
				// 重新获取在线列表并显示
				getOnlineAudios(function(arr){
					$('.audio-detail').hide();
					renderList(arr);
				})
			}
		});
	}
	/*渲染录音列表*/
	var renderList = function(arr){
		document.querySelector('.audio-list').innerHTML = '';
		for (var i = 0; i < arr.length; i++) {
			var span = document.createElement('span');
			span.innerHTML = arr[i].date;
			var li = document.createElement('li');
			li.innerHTML = arr[i].name;
			li.setAttribute('data-Index',i);
			li.appendChild(span);
			document.querySelector('.audio-list').appendChild(li);
		}
	}
	var video = function(){
		// 获取当前病人和当前医生信息、FTP服务器信息
		ftpInfo = JSON.parse(localStorage.ftpInfo);
		patient = JSON.parse(localStorage.currentPatient);
		docInfo = JSON.parse(localStorage.userInfo).Result;
		service = utils.urlFunction();
		audioURL = service.replace(/\/ClinicalService.asmx/,'') + '/Audio/';
		// 判断平台信息
		if(localStorage.platform==1){
			platform = 'ios';
		}else if(localStorage.platform==2){
			platform = 'android';
		}else{
			platform = 'PC';
		}
		if(recordStatus==1||recordStatus==2){
			
		}else{
			$('.audio-detail').hide();
		}
		judgeIOS();
		// 显示录音列表
		if(document.querySelector('.audio').className.match('bounceInLeft')){

		}else{
			document.querySelector('.audio').className = document.querySelector('.audio').className + ' bounceInLeft';
		}
		document.querySelector('.audio').className = document.querySelector('.audio').className.replace(/ slideOutLeft/img,'');
		// 默认显示本地列表
		$('.isOnline').eq(0).addClass('active');
		$('.isOnline').eq(1).removeClass('active');
		isOnline = false;
		getLocalAudio();
		renderList(localAudio);

		getOnlineAudios();
	}
	// 壳供我调用
	function judgeIOS(){
		if(platform=='ios'){
			shell = {
					// 开始录音
					startRecord: function(fileName){
						recordStart(fileName);
					},
					// 暂停录音
					pauseRecord: function(){
						recordPause();
					},
					// 继续录音
					reRecord: function(){
						recordRestart();
					},
					// 停止录音【0正常保存、1放弃保存】
					stopRecord: function(type){
						recordStatus = 0;
						document.querySelector('#audioPlayer').pause();
						document.querySelector('.online-play-pause').innerHTML = '播放';
						if(!type){
							document.querySelectorAll('.isPlay')[1].src = '../home/img/unplay.gif';
							layer.open({
							  type: 3,
							  icon: 1,
							  shade: [0.3,'#fff'],
							  content: '<p style="position: absolute;top: 50px;width: 100px;left: -30px;">正在保存录音</p>',
							});
						}
						recordStop(type);
					},
					// 删除录音
					deleteRecord: function(fileName){
						deleteFile(fileName);
					},
					// 播放录音
					playAudio: function(fileName){
						play(fileName);
					},
					// 暂停播放
					pauseAudio: function(){
						pausePlay();
					},
					// 继续播放录音
					replayAudio: function(){
						rePlay();
					},
					// 停止播放录音
					stopPlay: function(){
						recordStatus = 0;
						document.querySelector('#audioPlayer').pause();
						document.querySelector('.online-play-pause').innerHTML = '播放';
						for (var i = 0; i < play_pause.length; i++) {
							play_pause[i].innerHTML = '播放';
							play_pause[i].style = '';
						}
						stopPlay();
					},
					// 上传录音
					uploadAudio: function(audioName,ML){
						recordUpload(ftpInfo.IP,ftpInfo.PORT,ftpInfo.ULUSER,ftpInfo.ULPASS,audioName,ML);
					}
			}
		}else{
			shell = {
				// 开始录音
				startRecord: function(fileName){
					RecordInterface.recordStart(fileName);
				},
				// 暂停录音
				pauseRecord: function(){
					RecordInterface.recordPause();
				},
				// 继续录音
				reRecord: function(){
					RecordInterface.recordRestart();
				},
				// 停止录音【0正常保存、1放弃保存】
				stopRecord: function(type){
					recordStatus = 0;
					if(!type){
						document.querySelectorAll('.isPlay')[1].src = '../home/img/unplay.gif';
						layer.open({
						  type: 3,
						  icon: 1,
						  shade: [0.3,'#fff'],
						  content: '<p style="position: absolute;top: 50px;width: 100px;left: -30px;">正在保存录音</p>',
						});
					}
					RecordInterface.recordStop(type);
				},
				// 删除录音
				deleteRecord: function(fileName){
					RecordInterface.deleteFile(fileName);
				},
				// 播放录音
				playAudio: function(fileName){
					RecordInterface.play(fileName);
				},
				// 暂停播放
				pauseAudio: function(){
					RecordInterface.pausePlay();
				},
				// 继续播放录音
				replayAudio: function(){
					RecordInterface.rePlay();
				},
				// 停止播放录音
				stopPlay: function(){
					recordStatus = 0;
					for (var i = 0; i < play_pause.length; i++) {
						play_pause[i].innerHTML = '播放';
						play_pause[i].style = '';
					}
					RecordInterface.stopPlay();
				},
				// 上传录音
				uploadAudio: function(audioName,ML){
					RecordInterface.recordUpload(ftpInfo.IP,ftpInfo.PORT,ftpInfo.ULUSER,ftpInfo.ULPASS,audioName,ML);
				}
			}
		}
	}
	// 已下供壳调用
	window.audio = {
		// 录音结果
		recordResult: function(res,time){
			recordStatus = 3;
			layer.closeAll();
			if(res){
				document.querySelector('.startRecord').innerHTML = '开始录音';
				document.querySelector('.startRecord').style.backgroundColor = '#d9534f';
				document.querySelector('.startRecord').style.borderColor = '#d9534f';
				document.querySelectorAll('.isPlay')[1].src = '../home/img/playing.gif';
				document.querySelector('.addAudio').className = document.querySelector('.addAudio').className.replace(' .disabled','');
				var record_btn = document.querySelector('.record').querySelectorAll('button');
				for (var i = 0; i < record_btn.length; i++) {
					if(!i||i==1){
						record_btn[i].style='';
						record_btn[i].className = record_btn[i].className + ' disabled';
					}else{
						record_btn[i].className = record_btn[i].className.replace(' disabled','');
					}
				}
				// 更新本地缓存中的录音列表，【如果左侧为本地列表一并更新DOM】
				newRecord = {
					time: time,
				}
				saveMemo();
			}else{
				layer.alert('未知错误，请重试');
				// 重置录音状态【存在潜在bug，失败后录音文件消失，只能重新录音】
				var record_btn = document.querySelector('.record').querySelectorAll('button');
				for (var i = 0; i < record_btn.length; i++) {
					if(!i){
						record_btn[i].className = record_btn[i].className.replace(' disabled','');
					}else{
						record_btn[i].className = record_btn[i].className + ' disabled';
					}
				}
			}
		},
		// 播放完成
		playResult: function(res){
			recordStatus = 6;
			for (var i = 0; i < play_pause.length; i++) {
				play_pause[i].innerHTML = '播放';
				play_pause[i].style = '';
			}
		},
		// 上传结果
		uploadResult: function(res){
			// [1成功，0失败]
			if(res){
				layer.closeAll();
				layer.alert('上传成功');
				$('.audio-detail').hide();
				deteltLocalRecord(deleteIndex);
				// 更新在线列表
				getOnlineAudios();
			}else{
				layer.closeAll();
				layer.alert('上传失败，请重试');
			}
		}
	}
	return{
		video:video,
		closeAudio: closeAudio,
	}
});
