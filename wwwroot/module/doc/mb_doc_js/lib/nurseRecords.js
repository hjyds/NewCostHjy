define(["jquery", "hammer", "jqueryhammer", "utils"], function (jquery, hammer, jqueryhammer, utils) {

    function nurseHis() {
        var serviceChoose = utils.urlFunction();
		// 判断是否开了第三方接口localStorage.getItem("zlsofMdocs-install-blUrl")
		if(localStorage.ruleRecordSheetStatus!="0"||localStorage.ruleRecordSheetStatusLocation!=""){
			//$("#LoadedTip").show();	            嘉禾的检查ifame不用动态加容器支持滚动条
			var url = localStorage.ruleRecordSheetStatusLocation1;
			//var url = "https://segmentfault.com/q/1010000004463038";
			var bodyWidth = $(window).width();
			var bodyHeight = $(window).height();
			var threeW = bodyWidth-80;
			var threeH = bodyHeight-40;
			$("body").append('<div class="threeIframe" id="threeBl"><iframe class="threefre" style="width:'+threeW+'px; height:'+threeH+'px;" src="'+url+'"></iframe></div>');
			//utils.iframeAddBox('.threefre');		嘉禾的检查ifame不用动态加容器支持滚动条
			// $("body").append('<div class="threeIframe" id="threeBl"><iframe class="threefre" style="width:'+threeW+'px; height:'+threeH+'px;" src="bingli/home.html"></iframe></div>');
         //try{
           //     RecordInterface.playThrid(url)
            //} catch (e) {
              //  console.log(e)
                //window.open(url)
            //}
		}else{
			$("#mainNavMinTwo5").show();
        var PatientID,DeptID;//整体护理 转换后的病人信息
        var huli=0;
        var patIID= $("#slzyID").attr("data-patiid");   //病人ID
        var pageID= $("#slzyID").attr("data-pageid");  //主页ID
        var ksidID= $("#slzyID").attr("data-ksid"); //科室ID
        var cookieHeader=utils.usecookie();
        if($("#slzyID").attr("data-baby")=="yes"){
           var baby=1;
         }else{
            baby=0;
        };  
        var UID=$("#userInfobox>font").attr("data-userid");
        //var UID = '320';
        var ajaxnum=0;       
        $("#mainNavMinTwo5 li").remove();//清空列表
        $("#PDFdivWrapHL>.pdf").remove();//清空pdf容器  不能影响XML容器
        var allnurseIP="";
        var allnursePORT="";
		//}
        

        //护理记录列表
        hlrecordList();
        function hlrecordList(){
            //体征图 护理记录 护理病历
            $("#LoadedTip").show();
            $.ajax({
                //获取体温单、护理记录单、护理病历列表
                url: serviceChoose + "/DC_TendFile_List",
                type: 'POST',
                timeout: utils.timeoutSec(),
                data: JSON.stringify({
                        "IN": {
                            "PATIID": patIID,
                            "PAGEID": pageID,
                            "BABY": baby,    //是否baby
                            "FL": "全部",
                            "QX": "全部"
                        }
                    
                }),
                dataType: 'json', 
                headers: {
                    'Content-Type': 'application/json'
                },
                complete: function (XMLHttpRequest, textStatus) {  
                    utils.errorAjax(textStatus,hlrecordList,[]);
                }
            }).then(function(responseTxt){

                if(responseTxt.Result.ERROR){
                    if(responseTxt.Result.ERROR.MSG){
                        utils.showHide(responseTxt.Result.ERROR.MSG);
                    }else{
                        utils.showHide(responseTxt.Result.ERROR);
                    }
                    $("#LoadedTip").hide();
                    huquzthl(0);//调用整体护理列表 0表示体征图等没有暑假
                }else{
                    if(responseTxt.Result.OUTPUT.ITEMLIST){ 
                        huquzthl(1);                     
                        var ITEM = responseTxt.Result.OUTPUT.ITEMLIST.ITEM;
                        
                        //加载前要先清空内容
                        $("#temperature li").remove();
                        $("#nurseRecords li").remove();
                        $("#nurseHis li").remove();
                        //pdf清空
                        $("#PDFdivWrapBL > .pdf").remove();
                        ITEM = utils.makeArry(ITEM);
                        huli=ITEM.length;
                        $.each(ITEM, function (index, element) {

                            var LX = element.LX,
                                KSSJ = element.KSSJ,
                                KSSJsplit = KSSJ.split(" "),
                                KSSJTime = KSSJsplit[0];         //只获取年月日

                            switch (LX) {
                                case "-1":                  //病人体征图
                                    var temperatureLi = "<li class='temperatureLi' id='temperatureLi-" + element.ID + "'data-lx='"+LX+"' data-ys='"+element.YS+"'data-dq='"+element.YS+"' data-id='"+element.ID+"'  data-kssj='"+element.KSSJ+"'><span>" + element.MC + "</span><p>" + element.CJR + " " + KSSJTime + " </p></li>";
                                    $("#temperature").append(temperatureLi);
                                    $("#dianQianday .dianQianday").text(element.YS);//显示页数
                                    //$("#pageContral").show();  //页数控制出现
                                    //同步增加对应PDF
                                    if ($('#temperaturePDF-' + element.ID).length == 0) {
                                        PDFdiv = "<div class='PDFdiv pdf' id='temperature-" + element.ID + "'></div>";
                                        $("#PDFdivWrapHL").append(PDFdiv);
                                    }
                                    //twbys=element.YS;
                                    break;
                                case "0" || "1":
                                    var nurseRecordsLi = "<li class='nurseRecordsLi' id='nurseRecordsLi-" + element.ID + "'data-lx='"+LX+"' data-ys='"+element.YS+"'data-dq='"+element.YS+"' data-id='"+element.ID+"' data-kssj='"+element.KSSJ+"'><span>" + element.MC + "</span><p>" + element.CJR + " " + KSSJTime + " </p></li>";
                                    $("#nurseRecords").append(nurseRecordsLi);
                                    //同步增加对应PDF
                                    if ($('#nurseRecordsPDF-' + element.ID).length == 0) {
                                        PDFdiv = "<div class='PDFdiv pdf' id='bingLiPDF-" + element.ID + "'></div>";
                                        $("#PDFdivWrapHL").append(PDFdiv);
                                    }
                                    break;
                                case "9":
                                    var nurseHisLi = "<li class='nurseHisLi' id='nurseHisLi-" + element.ID + "'data-lx='"+LX+"' data-ys='"+element.YS+"'data-dq='"+element.YS+"' data-id='"+element.ID+"' data-kssj='"+element.KSSJ+"'><span>" + element.MC + "</span><p>" + element.CJR + " " + KSSJTime + " </p></li>";
                                    $("#nurseHis").append(nurseHisLi);
                                    //同步增加对应PDF
                                    if ($('#nurseHisPDF-' + element.ID).length == 0) {
                                        PDFdiv = "<div class='PDFdiv pdf' id='bingLiPDF-" + element.ID + "'></div>";
                                        $("#PDFdivWrapHL").append(PDFdiv);
                                    }
                                    break;
                            }
                        });

                        //计算页面列表的高度
                        // $("#pageListhoose").css("max-height",$(window).height()-90);//体温单
                        // $("#huiLpages").css("max-height",$(window).height()-90); //除体温单以外的 护理记录单
                        // 计算容器的高度
                        $("#PDFdivWrapHL>.pdf").height($(window).height()-67);  
                        //显示条数  li点击事件注册
                        $("#mainNavMinTwo5 ul li").unbind();
                        if($("#temperature li").length==0){  //体征图
                            $("#mainNavMinTwo5 .btBox").eq(0).hide();//病人体征图
                        }else{
                            $("#mainNavMinTwo5 .btBox").eq(0).show();
                            $("#mainNavMinTwo5 .btBox").eq(0).html('<span class="fs1" aria-hidden="true" data-icon=""></span>体征图（'+$("#temperature li").length+'）');   
                            var temperaturehammer=$("#temperature li").hammer();
                            temperaturehammer.on('tap', function(event) {
                                leiroghuoqu($(this));                           
                            });
                        }
                        //护理记录单
                        if($("#nurseRecords li").length==0){  
                            $("#mainNavMinTwo5 .btBox").eq(1).hide();

                        }else{
                            $("#mainNavMinTwo5 .btBox").eq(1).show();
                            $("#mainNavMinTwo5 .btBox").eq(1).html('<span class="fs1" aria-hidden="true" data-icon=""></span>护理记录（'+$("#nurseRecords li").length+'）');
                            var nurseRecordshammer=$("#nurseRecords li").hammer();
                            nurseRecordshammer.on('tap', function(event) {
                                otherPaper($(this));                           
                            });
                        }
                        //护理病历 
                        if($("#nurseHis li").length==0){  
                            $("#mainNavMinTwo5 .btBox").eq(2).hide();

                        }else{
                            $("#mainNavMinTwo5 .btBox").eq(2).show();
                            $("#mainNavMinTwo5 .btBox").eq(2).html('<span class="fs1" aria-hidden="true" data-icon=""></span>护理病历（'+$("#nurseHis li").length+'）');
                            var nurseHishammer=$("#nurseHis li").hammer();
                            nurseHishammer.on('tap', function(event) {
                                otherPaper($(this));                          
                            });
                        }
                        //加上隐藏标志 让列表隐藏
                        $("#temperature").addClass('hideLI').hide();
                        $("#nurseRecords").addClass('hideLI').hide();
                        $("#nurseHis").addClass('hideLI').hide();  
                        //默认数据加载
                        defaultData();
                        // //默认数据加载
                        // if($("#temperature li").length>0){
                        //     leiroghuoqu($("#temperature li:first")); //有体温记录单  
                        //     $("#temperature").removeClass('hideLI');//移除当前的隐藏标志
                        //     $("#temperature li").show();
                        //     $("#mainNavMinTwo5 .btBox").eq(0).find("span").remove() ;
                        //     $("#mainNavMinTwo5 .btBox").eq(0).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');                         
                        // }else if($("#nurseRecords li").length>0){  
                        //     otherPaper($("#nurseRecords li:first"));
                        //     $("#nurseRecords").removeClass('hideLI');//移除当前的隐藏标志
                        //     $("#nurseRecords li").show();
                        //     $("#mainNavMinTwo5 .btBox").eq(1).find("span").remove() ;
                        //     $("#mainNavMinTwo5 .btBox").eq(1).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
                        // }else if($("#nurseHis li").length>0){
                        //     otherPaper($("#nurseHis li:first"));
                        //     $("#nurseHis").removeClass('hideLI');//移除当前的隐藏标志
                        //     $("#nurseHis li").show();
                        //     $("#mainNavMinTwo5 .btBox").eq(2).find("span").attr("data-icon","")
                        //     //$("#mainNavMinTwo5 .btBox").eq(2).prepend('<span class="fs1" aria-hidden="true" data-icon=""></span>');
                        // };
                    }else{
                        huquzthl(0);
                        //utils.showHide("没有护理记录");
                        $("#LoadedTip").hide();
                    };
                  
                        
                }
            })
        }
	    }
		//获取整体护理列表
        function huquzthl(yes){ //1表示只加载列表  0 表示需要默认加载第一条数据
             //取出整体护理数据
            var nurseData=JSON.parse(localStorage.getItem("zlsoft-wholeNurse"));
            if(nurseData.IP!=null&&nurseData.PORT!=null){//端口和地址存在
                allnurseIP=nurseData.IP;
                allnursePORT=nurseData.PORT;
                //整体护理列表
                if (nurseData.HLPG=="1"||nurseData.HLPF=="1"||nurseData.HLJH=="1"||nurseData.JKXJ=="1") {
                    var bqID=$("#qhbrLeft .ksUlOne>li>ul>.active").attr("data-bqid");//滨区ID
                    if (!bqID) { //没有病区id 就用kisID
                        bqID=$("#qhbrLeft .ksUlOne > li >.ksNameSel").attr("data-bqid"); 
                    }
                    utils.changePateID(patIID,bqID,pageID,baby).then(function(res){
                        if(res=="no"){//病人id没有转换
                            $("#mainNavMinTwo5 .btBox").eq(3).hide();
                            $("#mainNavMinTwo5 .btBox").eq(4).hide();
                            $("#mainNavMinTwo5 .btBox").eq(5).hide();
                            $("#mainNavMinTwo5 .btBox").eq(6).hide();
                            return false;
                        }else{
                            if(res.Flag==1&&res.Output.Data.length>0){
                                PatientID=res.Output.Data[0].PatientID;
                                DeptID=res.Output.Data[0].DeptID;
                                //护理评估
                                if (nurseData.HLPG=="1") {
                                    var tempData = {
                                        "Params": {
                                            "IsSys":1,"PatientID":PatientID,"DepartmentID":DeptID
                                        },
                                        "Page":{"PageNum":1,"PageSize":25}
                                    }
                                    hlpgfun(0,tempData,yes);
                                }else{
                                    ajaxnum=ajaxnum+1;
                                    $("#mainNavMinTwo5 .btBox").eq(3).hide();
                                    if (ajaxnum==4) { 
                                        $("#LoadedTip").hide();
                                        if (yes==0) {
                                            $("#mainNavMinTwo5 .btBox").eq(0).hide();
                                            $("#mainNavMinTwo5 .btBox").eq(1).hide();
                                            $("#mainNavMinTwo5 .btBox").eq(2).hide();
                                            defaultData()
                                        }
                                    }
                                }
                                //护理评分
                                if(nurseData.HLPF=="1"){
                                    var hlpf={
                                            "Params":{"PatientID":PatientID}
                                        };
                                    hlpffun(0,hlpf,yes);
                                    
                                }else{
                                    ajaxnum=ajaxnum+1;
                                    $("#mainNavMinTwo5 .btBox").eq(4).hide();
                                    if (ajaxnum==4) { 
                                        $("#LoadedTip").hide();
                                        if (yes==0) {
                                            $("#mainNavMinTwo5 .btBox").eq(0).hide();
                                            $("#mainNavMinTwo5 .btBox").eq(1).hide();
                                            $("#mainNavMinTwo5 .btBox").eq(2).hide();
                                            defaultData()
                                        }
                                    }
                                }
                                //护理计划
                                if(nurseData.HLJH=="1"){
                                    var hljh={
                                            "Params":{"PatientID":PatientID},   
                                        };
                                    hljhfun(0,hljh,yes);
                                    
                                }else{
                                    ajaxnum=ajaxnum+1;
                                    $("#mainNavMinTwo5 .btBox").eq(5).hide();
                                    if (ajaxnum==4) { 
                                        $("#LoadedTip").hide();
                                        if (yes==0) {
                                            $("#mainNavMinTwo5 .btBox").eq(0).hide();
                                            $("#mainNavMinTwo5 .btBox").eq(1).hide();
                                            $("#mainNavMinTwo5 .btBox").eq(2).hide();
                                            defaultData()
                                        }
                                    }
                                    
                                }
                                //健康宣教    
                                if(nurseData.JKXJ=="1"){
                                    var jcxj={
                                        "Params":{
                                            "IsSys":1,"PatientID":PatientID,"DepartmentID":DeptID},
                                            "Page":{"PageNum":1,"PageSize":25}
                                    }  
                                    jkxjfun(0,jcxj,yes);
                                }else{
                                    ajaxnum=ajaxnum+1;
                                    $("#mainNavMinTwo5 .btBox").eq(6).hide();
                                    if (ajaxnum==4) { 
                                        $("#LoadedTip").hide();
                                        if (yes==0) {
                                            $("#mainNavMinTwo5 .btBox").eq(0).hide();
                                            $("#mainNavMinTwo5 .btBox").eq(1).hide();
                                            $("#mainNavMinTwo5 .btBox").eq(2).hide();
                                            defaultData()
                                        }
                                    }
                                }
                                //加上隐藏标志 让列表隐藏 
                                $("#nurseAssess").addClass('hideLI').hide();
                                $("#nurseScore").addClass('hideLI').hide();
                                $("#nursePlan").addClass('hideLI').hide();
                                $("#nurseHealth").addClass('hideLI').hide();
                            }
                        }
                            
                    });
                }else{
                    $("#mainNavMinTwo5 .btBox").eq(3).hide();
                    $("#mainNavMinTwo5 .btBox").eq(4).hide();
                    $("#mainNavMinTwo5 .btBox").eq(5).hide();
                    $("#mainNavMinTwo5 .btBox").eq(6).hide();
                }
            }else{
                $("#mainNavMinTwo5 .btBox").eq(3).hide();
                $("#mainNavMinTwo5 .btBox").eq(4).hide();
                $("#mainNavMinTwo5 .btBox").eq(5).hide();
                $("#mainNavMinTwo5 .btBox").eq(6).hide();
            }
        }
        //护理评估
        function hlpgfun(first,tempData,yes){//yes是否默认加载
            $("#LoadedTip").show();
            $.ajax({
                //url:"http://61.128.195.29:7021/Services/nurse/Evaluation/Pages",
                url:"http://"+allnurseIP+":"+allnursePORT+"/Services/nurse/Evaluation/Pages",
                data:JSON.stringify(tempData),
                type: "post",
                beforeSend: function(request) {
                    request.setRequestHeader("hip_cookie", cookieHeader);
                },
                timeout:utils.timeoutSec(),//timeout:10,
                dataType: "json",
                contentType: "application/json",
            }).always(function(responseTxt,status, xhr){
                ajaxnum=ajaxnum+1;
                if(status=="success"){
                    if(responseTxt.Flag==1){  
                        if(responseTxt.Output.Data.DataList.length>0){
                            var idChara;
                            $.each(responseTxt.Output.Data.DataList, function (index, element) {
                                KSSJTime = element.CreateDate.split(" ")[0], //只获取年月日
                                idChara=specialChara(element.ID);       
                                $("#nurseAssess").append('<li id="'+idChara+'"  data-patientID="'+element.PatientID+'" data-reportFormID="'+element.ReportFormID+'" data-formid="'+element.FormID+'" data-versioncode="'+element.VersionCode+'" data-createuser="'+element.CreateUser+' "data-name="'+element.Name+'"><span>' + element.Name + '</span><p>' + element.CreateUser + ' ' + KSSJTime + ' </p></li>')
                                PDFdiv = "<div class='PDFdiv pdf' id='bingLiPDF-" + idChara + "'><div id='zthl-"+idChara+"' class='zheZhao'></div></div>";
                                $("#PDFdivWrapHL").append(PDFdiv);
                            });

                            // 计算容器的高度
                            $("#PDFdivWrapHL>.pdf").height($(window).height()-67);
                            $("#mainNavMinTwo5 .btBox").eq(3).show();
                            $("#mainNavMinTwo5 .btBox").eq(3).html('<span class="fs1" aria-hidden="true" data-icon=""></span>护理评估（'+responseTxt.Output.Data.DataList.length+'）');//添加展开列表
                            console.log("护理评估");
                        }else{
                            $("#mainNavMinTwo5 .btBox").eq(3).hide();
                        }
                        //注册护理的点击事件
                        $("#nurseAssess li").unbind();
                        var nurseAssesshammer=$("#nurseAssess li").hammer();
                        nurseAssesshammer.on('tap', function(event) {
                            hlpgcontent($(this));
                        });
                    }else{
                        $("#mainNavMinTwo5 .btBox").eq(3).hide(); 
                    }
                    
                }else if(status=="error"){
                    if (first==0) { //只调用一次
                        $.when(utils.nurseCookie()).done(function(){
                            hlpgfun(1,tempData);
                        })
                    }else{
                       $("#mainNavMinTwo5 .btBox").eq(3).hide(); 
                    }
                }
                if (ajaxnum==4) { 
                    $("#LoadedTip").hide();
                    if (yes==0) {
                        $("#mainNavMinTwo5 .btBox").eq(0).hide();
                        $("#mainNavMinTwo5 .btBox").eq(1).hide();
                        $("#mainNavMinTwo5 .btBox").eq(2).hide();
                        defaultData()
                    }
                }
            })
        }
        //护理评分
        function hlpffun(first,hlpf,yes){
            $("#LoadedTip").show();
            $.ajax({
                //url:"http://61.128.195.29:7021/Services/nurse/PatientCareMark/List",
                url:"http://"+allnurseIP+":"+allnursePORT+"/Services/nurse/PatientCareMark/List",
                data:JSON.stringify(hlpf),
                type: "post",
                beforeSend: function(request) {
                    request.setRequestHeader("hip_cookie", cookieHeader);
                },
                timeout:utils.timeoutSec(),//timeout:10,
                dataType: "json",
                contentType: "application/json",
            }).always(function(responseTxt,status, xhr){
                ajaxnum=ajaxnum+1;
                if (ajaxnum==4) { 
                    $("#LoadedTip").hide();
                    if (yes==0) {
                        $("#mainNavMinTwo5 .btBox").eq(0).hide();
                        $("#mainNavMinTwo5 .btBox").eq(1).hide();
                        $("#mainNavMinTwo5 .btBox").eq(2).hide();
                        defaultData()
                    }
                }
                if(status=="success"){
                    if(responseTxt.Flag==1){  
                       if(responseTxt.Output.Data.length>0){
                            $("#mainNavMinTwo5 .btBox").eq(4).show();
                            $("#mainNavMinTwo5 .btBox").eq(4).html('<span class="fs1" aria-hidden="true" data-icon=""></span>护理评分（'+responseTxt.Output.Data.length+'）');//添加展开列表
                            var idChara;
                            $.each(responseTxt.Output.Data, function (index, element) {
                                KSSJTime = element.CreatedDate.split(" ")[0], //只获取年月日 
                                idChara=specialChara(element.ID);      
                                $("#nurseScore").append('<li id="'+idChara+'" data-patientID="'+element.PatientID+'" data-reportFormID="'+element.RelatedReportID+'" data-formname="'+element.FormName+'" data-precautionid="'+element.PrecautionID+'" data-createduser="'+element.CreatedUser+'" data-marktabid="'+element.MarkTabID+'" data-questionid="'+element.QuestionID+'"><span>' + element.FormName + '</span><p>' + element.CreatedUser + ' ' + KSSJTime + ' </p></li>')
                                PDFdiv = "<div class='PDFdiv pdf' id='bingLiPDF-" + idChara + "'><div id='zthl-"+idChara+"' class='zheZhao'></div></div>";
                                $("#PDFdivWrapHL").append(PDFdiv);
                            })

                             // 计算容器的高度
                            $("#PDFdivWrapHL>.pdf").height($(window).height()-67);
                            //注册护理的点击事件
                            $("#nurseScore li").unbind();
                            var nurseScorehammer=$("#nurseScore li").hammer();
                            nurseScorehammer.on('tap', function(event) {
                                scoreContent($(this));
                            });
                            console.log("护理评分");
                        }else{
                            $("#mainNavMinTwo5 .btBox").eq(4).hide();
                        }
                    }else{
                        $("#mainNavMinTwo5 .btBox").eq(4).hide();
                    }
                }else if(status=="error"){
                    if (first==0) { //只调用一次
                        $.when(utils.nurseCookie()).done(function(){
                            hlpffun(1,hlpf);
                        })
                    }else{
                       $("#mainNavMinTwo5 .btBox").eq(4).hide(); 
                    }
                }
            })
        }
        //护理计划
        function hljhfun(first,hljh,yes){
            $("#LoadedTip").show();
            $.ajax({
                //url:"http://61.128.195.29:7021/Services/nurse/PatientNursingPlan/GetPlans",
                url:"http://"+allnurseIP+":"+allnursePORT+"/Services/nurse/PatientNursingPlan/GetPlans",
                data:JSON.stringify(hljh),
                type: "post",
                beforeSend: function(request) {
                    request.setRequestHeader("hip_cookie", cookieHeader);
                },
                timeout:utils.timeoutSec(),//timeout:10,
                dataType: "json",
                contentType: "application/json",
            }).always(function(responseTxt,status, xhr){
                ajaxnum=ajaxnum+1;
                if (ajaxnum==4) { 
                    $("#LoadedTip").hide();
                    if (yes==0) {
                        $("#mainNavMinTwo5 .btBox").eq(0).hide();
                        $("#mainNavMinTwo5 .btBox").eq(1).hide();
                        $("#mainNavMinTwo5 .btBox").eq(2).hide();
                        defaultData()
                    }
                }
                if(status=="success"){
                    if(responseTxt.Flag==1){  
                       if(responseTxt.Output.Data.length>0){
                            $("#mainNavMinTwo5 .btBox").eq(5).show();
                            $("#mainNavMinTwo5 .btBox").eq(5).html('<span class="fs1" aria-hidden="true" data-icon=""></span>护理计划（'+responseTxt.Output.Data.length+'）');//添加展开列表
                            var idChara;
                            $.each(responseTxt.Output.Data, function (index, element) {
                                KSSJTime = element.CreatedTime.split(" ")[0], //只获取年月日
                                idChara=specialChara(element.SchemeID);     
                                $("#nursePlan").append('<li id="'+idChara+'" data-schemeid="'+element.SchemeID+'"><span>' + element.Name + '</span><p>' + element.CreatedUser + ' ' + KSSJTime + ' </p></li>')
                                
                                PDFdiv = "<div class='PDFdiv pdf' id='bingLiPDF-" + idChara + "'><div id='zthl-"+idChara+"' class='zheZhao'></div></div>";
                                $("#PDFdivWrapHL").append(PDFdiv);
                            })

                            // 计算容器的高度
                            $("#PDFdivWrapHL>.pdf").height($(window).height()-67);
                            //注册护理的点击事件
                            $("#nursePlan li").unbind();
                            var nursePlanhammer=$("#nursePlan li").hammer();
                            nursePlanhammer.on('tap', function(event) {
                                planContent($(this));
                            });
                            console.log("护理评估");
                        }else{
                            $("#mainNavMinTwo5 .btBox").eq(5).hide();
                        }
                    }else{

                    }
                }else if(status=="error"){
                    if (first==0) { //只调用一次
                        $.when(utils.nurseCookie()).done(function(){
                            hljhfun(1,hljh);
                        })
                    }else{
                       $("#mainNavMinTwo5 .btBox").eq(5).hide(); 
                    }
                }
            })
        }
        //健康宣教
        function jkxjfun(first,jcxj,yes){ 
            $("#LoadedTip").show();
            $.ajax({
                url:"http://"+allnurseIP+":"+allnursePORT+"/Services/nurse/Education/Pages",
                data:JSON.stringify(jcxj),
                type: "post",
                beforeSend: function(request) {
                    request.setRequestHeader("hip_cookie", cookieHeader);
                },
                timeout:utils.timeoutSec(),//timeout:10,
                dataType: "json",
                contentType: "application/json",
            }).always(function(responseTxt,status, xhr){
                ajaxnum=ajaxnum+1;
                if (ajaxnum==4) { 
                    $("#LoadedTip").hide();
                    if (yes==0) {
                        $("#mainNavMinTwo5 .btBox").eq(0).hide();
                        $("#mainNavMinTwo5 .btBox").eq(1).hide();
                        $("#mainNavMinTwo5 .btBox").eq(2).hide();
                        defaultData()
                    }
                }
                if(status=="success"){
                    if(responseTxt.Flag==1){  
                        if(responseTxt.Output.Data.DataList.length>0){
                            $("#mainNavMinTwo5 .btBox").eq(6).show();
                            $("#mainNavMinTwo5 .btBox").eq(6).html('<span class="fs1" aria-hidden="true" data-icon=""></span>健康宣教（'+responseTxt.Output.Data.DataList.length+'）');//添加展开列表
                            var idChara, KSSJTime;
                            $.each(responseTxt.Output.Data.DataList, function (index, element) {
                                if(element.CreateDate){
                                    KSSJTime = element.CreateDate.split(" ")[0];//只获取年月日
                                }else{
                                    KSSJTime = element.Children[0].CreateDate.split(" ")[0];
                                    element = element.Children[0];
                                }
                                idChara=specialChara(element.ID);        
                                $("#nurseHealth").append('<li id="'+idChara+'" data-patientID="'+element.PatientID+'" data-reportFormID="'+element.ReportFormID+'" data-formid="'+element.FormID+'" data-formcompare="'+element.FormCompare+'" data-versioncode="'+element.VersionCode+'" data-createuser="'+element.CreateUser+'"><span>' + element.Name + '</span><p>' + element.CreateUser + ' ' + KSSJTime + ' </p></li>')
                                PDFdiv = "<div class='PDFdiv pdf' id='bingLiPDF-" + idChara + "'><div id='zthl-"+idChara+"' class='zheZhao'></div></div>";//创建对应的容器
                                $("#PDFdivWrapHL").append(PDFdiv);
                            })

                             // 计算容器的高度
                            $("#PDFdivWrapHL>.pdf").height($(window).height()-67);
                            $("#nurseHealth li").unbind();
                            var nurseHealthhammer=$("#nurseHealth li").hammer();
                            nurseHealthhammer.on('tap', function(event) {
                                healthContent($(this));
                            });
                            console.log("健康宣教");
                        }else{
                            $("#mainNavMinTwo5 .btBox").eq(6).hide();
                        }
                    }else{
                        $("#mainNavMinTwo5 .btBox").eq(6).hide();
                    }
                }else if(status=="error"){
                    if (first==0) { //只调用一次
                        $.when(utils.nurseCookie()).done(function(){
                            jkxjfun(1,jcxj);
                        })
                    }else{
                       $("#mainNavMinTwo5 .btBox").eq(6).hide(); 
                    }
                }
            })
        }
        //列表展开关闭
        $("#mainNavMinTwo5 .btBox").unbind();
        var binglibtBox=$("#mainNavMinTwo5 .btBox").hammer();
        binglibtBox.on('tap', function(event) {
            var xx=$(this).index();
            openThislist($(this),xx);
        });
        //判断默认加载数据
        function defaultData(){
            // 计算容器的高度
            $("#PDFdivWrapHL>.pdf").height($(window).height()-67);
            var whichbt,thisli;
            for(i=0;i<=$("#mainNavMinTwo5 .btBox").length;i++){
                if($("#mainNavMinTwo5 .btBox").eq(i).is(':visible')&&$("#mainNavMinTwo5 .btBox").eq(i).next().children("li").length>0){
                    whichbt=$("#mainNavMinTwo5 .btBox").eq(i).text();
                    whichbt=whichbt.split("（")[0];
                    thisli=$("#mainNavMinTwo5 .btBox").eq(i).next().children("li").eq(0);
                    break;
                }
            }
            switch (whichbt) {
                case "体征图":
                    leiroghuoqu($("#temperature li:first")); //有体温记录单  
                    $("#temperature").removeClass('hideLI');//移除当前的隐藏标志
                    $("#temperature").show();
                    $("#mainNavMinTwo5 .btBox").eq(0).find("span").attr("data-icon","")
                break;
                case "护理记录": 
                    otherPaper($("#nurseRecords li:first"));
                    $("#nurseRecords").removeClass('hideLI');//移除当前的隐藏标志
                    $("#nurseRecords").show();
                    $("#mainNavMinTwo5 .btBox").eq(1).find("span").attr("data-icon","")
                break;
                case "护理病历":
                    otherPaper($("#nurseHis li:first"));
                    $("#nurseHis").removeClass('hideLI');//移除当前的隐藏标志
                    $("#nurseHis").show();
                    $("#mainNavMinTwo5 .btBox").eq(2).find("span").attr("data-icon","")
                break;
                case "护理评估": 
                    hlpgcontent($("#nurseAssess li:first"))
                    $("#nurseAssess").removeClass('hideLI');//移除当前的隐藏标志
                    $("#nurseAssess").show();
                    $("#mainNavMinTwo5 .btBox").eq(3).find("span").attr("data-icon","")
                break;
                case "护理评分":
                    scoreContent($("#nurseScore li:first"))
                    $("#nurseScore").removeClass('hideLI');//移除当前的隐藏标志
                    $("#nurseScore").show();
                    $("#mainNavMinTwo5 .btBox").eq(4).find("span").attr("data-icon","") 
                break;
                case "护理计划": 
                    planContent($("#nursePlan li:first"))
                    $("#nursePlan").removeClass('hideLI');//移除当前的隐藏标志
                    $("#nursePlan").show();
                    $("#mainNavMinTwo5 .btBox").eq(5).find("span").attr("data-icon","")
                break;
                case "健康宣教": 
                    healthContent($("#nurseHealth li:first"))
                    $("#nurseHealth").removeClass('hideLI');//移除当前的隐藏标志
                    $("#nurseHealth").show();
                    $("#mainNavMinTwo5 .btBox").eq(6).find("span").attr("data-icon","")
                break;  
            } 
        }

        //获取护理评估内容
        function hlpgcontent(thisli){
            var formId=thisli.attr("data-formid");
            var reportFormID=thisli.attr("data-reportFormID");
            var PatientID=thisli.attr("data-patientID");
            var id=thisli.attr("id");
            liclick(thisli,id);
            if($("#bingLiPDF-"+id).find('iframe').length==0){
                var name=thisli.attr("data-name");
                var versioncode=thisli.attr("data-versioncode");
                var CJR=thisli.attr("data-createuser");
                // 计算iframe的宽高
                var heightbox=$(window).height()-67;
                $("#PDFdivWrapHL>.PDFdiv").hide();
                $("#bingLiPDF-"+id).show();     //当前pdf容器
                if(reportFormID){
					var src="http://"+allnurseIP+":"+allnursePORT+"/mobile/mobile.html?model=assessment-detail&formatId="+formId+"&id="+id+"&MC="+name+"&VersionCode="+versioncode+"&CJR="+CJR+"&UserID="+UID;
                    //var src="http://"+allnurseIP+":"+allnursePORT+"/mobile/mobile.html?model=print-report&formatId="+formId+"&id="+id+"&MC="+name+"&VersionCode="+versioncode+"&CJR="+CJR+"&UserID="+UID+"&DYID="+DeptID+"&ReportFormID="+reportFormID+"&formWhere=health"+"&PatientID="+PatientID;
                }else{
                    src='';
                }
                //var src="http://"+allnurseIP+":"+allnursePORT+"/mobile/mobile.html?model=assessment-detail&formatId="+formId+"&id="+id+"&MC="+name+"&VersionCode="+versioncode+"&CJR="+CJR+"&UserID="+UID;
                $("#bingLiPDF-"+id).append('<iframe src="'+src+'" class="row-fluid"  id="hliframe'+id+'" height="100%" width="100%" style="border:none"></iframe>')

                document.getElementById("hliframe"+id).onload=function(){
                    $("#zthl-"+id).hide();
                    // 加载完成后获取高度
                    var gaoDu = document.getElementById("hliframe"+id).contentWindow.document.body.offsetHeight;
                    // 设置遮罩层和iframe的高度
                    $("#zthl-"+id).css("height",gaoDu);
                    console.log($("#dom-"+id));
                    $("#hliframe"+id).css("height",gaoDu);
                    // 放大缩小初始化
                    utils.CSHpanzoom("bingLiPDF-"+id);
                }
            }
        }

        //获取护理评分内容
        function scoreContent(thisli){
            var id=thisli.attr("id");
            var reportFormID=thisli.attr("data-reportFormID");
            var PatientID=thisli.attr("data-patientID");
            liclick(thisli,id);
            if($("#bingLiPDF-"+id).find('iframe').length==0){
                var formName=thisli.attr("data-formname");
                var precautionID=thisli.attr("data-precautionid");
                var CJR=thisli.attr("data-createuser");
                var formatid=thisli.attr("data-marktabid");
                var questionID=thisli.attr("data-questionid");
                // 计算iframe的宽高
                var heightbox=$(window).height()-67;
                $("#PDFdivWrapHL>.PDFdiv").hide();
                $("#bingLiPDF-"+id).show();     //当前pdf容器

                if(reportFormID){
					var src="http://"+allnurseIP+":"+allnursePORT+"/mobile/mobile.html?model=grade-edit&id="+id+"&mc="+formName+"&PrecautionID="+precautionID+"&CJR="+CJR+"&QuestionID="+questionID+"&formatid="+formatid+"&UserID="+UID;
                    //var src="http://"+allnurseIP+":"+allnursePORT+"/mobile/mobile.html?model=print-report&id="+id+"&mc="+formName+"&PrecautionID="+precautionID+"&CJR="+CJR+"&QuestionID="+questionID+"&formatid="+formatid+"&UserID="+UID+"&ReportFormID="+reportFormID+"&formWhere=grade"+"&PatientID="+PatientID;
                }else{
                    src='';
                }
                $("#bingLiPDF-"+id).append('<iframe src="'+src+'" id="hliframe'+id+'" height="100%" width="100%" style="border:none"></iframe>')

                document.getElementById("hliframe"+id).onload=function(){
                    $("#zthl-"+id).hide();
                    // 加载完成后获取高度
                    var gaoDu = document.getElementById("hliframe"+id).contentWindow.document.body.offsetHeight;
                    // 设置遮罩层和iframe的高度
                    $("#zthl-"+id).css("height",gaoDu);
                    console.log($("#dom-"+id));
                    $("#hliframe"+id).css("height",gaoDu);
                    // 放大缩小初始化
                    utils.CSHpanzoom("bingLiPDF-"+id);
                }
            }
        }

        //获取护理计划内容
        function planContent(thisli){
            var id=thisli.attr("data-schemeid");
            liclick(thisli,id);
            if($("#bingLiPDF-"+id).find('iframe').length==0){
                // 计算iframe的宽高
                var heightbox=$(window).height()-67;
                $("#PDFdivWrapHL>.PDFdiv").hide();
                $("#bingLiPDF-"+id).show();     //当前pdf容器
                var src="http://"+allnurseIP+":"+allnursePORT+"/mobile/mobile.html?model=plan-detail&SchemeID="+id+"&PatientID="+PatientID+"&isAPIParams=1"+"&UserID="+UID;
                $("#bingLiPDF-"+id).append('<iframe src="'+src+'" id="hliframe'+id+'" height="100%" width="100%" style="border:none"></iframe>')

                document.getElementById("hliframe"+id).onload=function(){
                    $("#zthl-"+id).hide();
                    // 加载完成后获取高度
                    var gaoDu = document.getElementById("hliframe"+id).contentWindow.document.body.offsetHeight;
                    // 设置遮罩层和iframe的高度
                    $("#zthl-"+id).css("height",gaoDu);
                    console.log($("#dom-"+id));
                    $("#hliframe"+id).css("height",gaoDu);
                    // 放大缩小初始化
                    utils.CSHpanzoom("bingLiPDF-"+id);
                }
            }
        }

        //获取健康宣教 内容
        function healthContent(thisli){
            var formId=thisli.attr("data-formid");
            var reportFormID=thisli.attr("data-reportFormID");
            var PatientID=thisli.attr("data-patientID");
            var id=thisli.attr("id");
            liclick(thisli,id);
            if($("#bingLiPDF-"+id).find('iframe').length==0){
                var formCompare=thisli.attr("data-formcompare");
                var versioncode=thisli.attr("data-versioncode");
                var CJR=thisli.attr("data-createuser");
                // 计算iframe的宽高
                var heightbox=$(window).height()-67;
                $("#PDFdivWrapHL>.PDFdiv").hide();
                $("#bingLiPDF-"+id).show();     //当前pdf容器
                if(reportFormID){
					var src="http://"+allnurseIP+":"+allnursePORT+"/mobile/mobile.html?model=health-detail&type=EDIT&formatId="+formId+"&id="+id+"&BDDZ="+formCompare+"&VersionCode="+versioncode+"&CJR="+CJR+"&DYID="+DeptID+"&UserID="+UID;
                    //var src="http://"+allnurseIP+":"+allnursePORT+"/mobile/mobile.html?model=health-detail&type=EDIT&formatId="+formId+"&id="+id+"&BDDZ="+formCompare+"&VersionCode="+versioncode+"&CJR="+CJR+"&DYID="+DeptID+"&UserID="+UID+"&ReportFormID="+reportFormID+"&formWhere=health"+"&PatientID="+PatientID;
                }else{
                    src='';
                }
                //var src="http://"+allnurseIP+":"+allnursePORT+"/mobile/mobile.html?model=health-detail&type=EDIT&formatId="+formId+"&id="+id+"&BDDZ="+formCompare+"&VersionCode="+versioncode+"&CJR="+CJR+"&DYID="+DeptID+"&UserID="+UID;
                $("#bingLiPDF-"+id).append('<iframe src="'+src+'" id="hliframe'+id+'" height="100%" width="100%" style="border:none"></iframe>')

                document.getElementById("hliframe"+id).onload=function(){
                    $("#zthl-"+id).hide();
                    // 加载完成后获取高度
                    var gaoDu = document.getElementById("hliframe"+id).contentWindow.document.body.offsetHeight;
                    // 设置遮罩层和iframe的高度
                    $("#zthl-"+id).css("height",gaoDu);
                    console.log($("#dom-"+id));
                    $("#hliframe"+id).css("height",gaoDu);
                    // 放大缩小初始化
                    utils.CSHpanzoom("bingLiPDF-"+id);
                }
            }
        }
        //列表展开搜索
        function openThislist(thisbt ,who){
            if(thisbt.next().find('li').length>0){
                if(thisbt.next().hasClass('hideLI')){
                    thisbt.find('span').attr("data-icon","");
                    thisbt.next().show();
                    thisbt.next().removeClass('hideLI');
                }else{
                    thisbt.find('span').attr("data-icon","");;
                    thisbt.next().hide()
                    thisbt.next().addClass('hideLI');
                }
            }
        }
        //整体护理 列表点击公共函数
        function liclick(thisli,id){
            $("#RecordPAge").hide();//护理记录导航
            $("#pageContral").hide();//体温单导航
            $("#mainNavMinTwo5 ul li").removeClass("XuanZhong");
            thisli.addClass("XuanZhong");
            $("#pageContral").hide();   //体温单 导航 隐藏            
            $("#huLi2").html(thisli.parent().prev().text().split("（")[0]+" | ");//头部显示值 
            $("#huLi3").html(thisli.children("span").text());
            $("#PDFdivWrapHL>.PDFdiv").hide();
            $("#bingLiPDF-"+id).show();     //当前pdf容器

        }

        //体温单周数控制所有按钮注册点击事件
        $("#leftNemone>div").unbind();
        var choosezhou=$("#leftNemone>div").hammer();
        choosezhou.on('tap',  function(event) {   
            if (!$(this).hasClass('jy')) {
                gaibiand($(this).index());
            }  
        });
        $("#tw-zheZhaoDIV").unbind();
        var hammerJiLu = $("#tw-zheZhaoDIV").hammer();
        hammerJiLu.on('tap', function (ev) {
            $("#pageListhoose").hide();//体温单
            $("#tw-zheZhaoDIV").hide();
        });
		utils.stopScroll(".zheZhaoDIV",".PDFdiv");
        //总页数点击事件注册
        $("#thisPageTotal").unbind();
        var thisPageTotalhammer=$("#thisPageTotal").hammer();
        thisPageTotalhammer.on('tap', function(event) {
            $("#pageListhoose").toggle();
            $("#tw-zheZhaoDIV").toggle(); 
            document.getElementById($("#thisPageTotal").text()).scrollIntoView(); //刷新列表页面                     
        });

        //护理记录上下页点击
        $("#RecordPAge >.leftNem > .buttonZhou").unbind();
        var RecordPAge=$("#RecordPAge >.leftNem > .buttonZhou").hammer();
        RecordPAge.on('tap',  function(event) { 
            if($(this).index() ==0){
                recordGB(1);
            }else{
                recordGB(2); 
            }  
        });
        //记录单页数切换
        $("#RecordPAge >.centerthis").unbind();
        var RecordPAgeLI=$("#RecordPAge >.centerthis").hammer();
        RecordPAgeLI.on('tap',  function(event) { 
            $("#huiLpages").toggle();
            $("#jl-zheZhaoDIV").toggle(); 
            document.getElementById($(this).text()).scrollIntoView(); //刷新列表页面   
        });

        //护理记录 遮罩层点击事件
        $("#jl-zheZhaoDIV").unbind();
        var hammerJiLuHL = $("#jl-zheZhaoDIV").hammer();
        hammerJiLuHL.on('tap', function (ev) {
            $("#huiLpages").hide();
            $("#jl-zheZhaoDIV").hide();
        });
        //获取体温单内容
        function leiroghuoqu(thisdata){
            $("#pageContral").show();   //体温单 导航
            $("#RecordPAge").hide(); //护理记录导航
            $("#mainNavMinTwo5 ul li").removeClass("XuanZhong");
            thisdata.addClass("XuanZhong");          
            $("#huLi2").html(thisdata.parent().prev().text().split("（")[0]+" | ");//头部显示值
            $("#huLi3").html(thisdata.children("span").text());
            var ys=thisdata.attr("data-ys");  //获取页数
            var dq=thisdata.attr("data-dq");  //获取当前页数
            var fileID=thisdata.attr("data-id");   //获取文件ID
            var pdfBox="temperature-"+fileID;  //体温表容器
            $("#PDFdivWrapHL>.PDFdiv").hide();
            $("#"+pdfBox).show();     //当前pdf容器

            $("#pageListhoose li").remove(); //清空列表  防止重复
            for (var i = 1; i <= ys; i++) {   //根据页数初始化页数列表
                var list12="<li id='"+i+"'>"+i+"</li>";
                $("#pageListhoose").append(list12);
            };
            if ($("#pageListhoose li").length<4) {
                switch($("#pageListhoose li").length){
                    case 1:
                        $("#leftNemone >div").eq(1).addClass('jy');
                        $("#leftNemone >div").eq(2).addClass('jy');
                        $("#leftNemone >div").eq(3).addClass('jy');
                    break;
                    case 2:
                        $("#leftNemone >div").eq(1).removeClass('jy');
                        $("#leftNemone >div").eq(2).addClass('jy');
                        $("#leftNemone >div").eq(3).addClass('jy');
                    break;
                    case 3:
                        $("#leftNemone >div").eq(1).removeClass('jy');
                        $("#leftNemone >div").eq(2).removeClass('jy');
                        $("#leftNemone >div").eq(3).addClass('jy');
                    break;
                }
            }else{
                $("#leftNemone >div").removeClass('jy');
            }
            if(ys==dq&&ys>1){
                $("#leftNemone >div").eq(4).removeClass('jy');
                $("#leftNemone >div").eq(6).addClass('jy');
            }else if(dq==1&&ys>1){
                $("#leftNemone >div").eq(4).addClass('jy');
                $("#leftNemone >div").eq(6).removeClass('jy');
            }else if(ys==dq&&ys==1){
                $("#leftNemone >div").eq(4).addClass('jy');
                $("#leftNemone >div").eq(6).addClass('jy');
            }else{
                $("#leftNemone >div").eq(4).removeClass('jy');
                $("#leftNemone >div").eq(6).removeClass('jy');
            }
            //控制列表页
            pageliLong("#pageListhoose",$("#pageListhoose li").length)
            $("#pageListhoose li").unbind();
            var pageListhoosehammer=$("#pageListhoose li").hammer();
            pageListhoosehammer.on('tap', function (ev) { 
                $("#pageListhoose li").removeClass('active');                      
                $(this).addClass('active');              //点击时添加选中                                  
                contChange($(this).text(),1);
                setTimeout(function(){
                    $("#pageListhoose").toggle();         //列表消失
                    $("#tw-zheZhaoDIV").toggle();  //遮罩层消失
                }, 500);
            }); 
            $("#thisPageTotal").text(dq); //默认当前页数
            $("#pageListhoose li").eq(dq-1).addClass('active');
            
            //判断是否已经加载
            if(!$("#"+pdfBox).find('img').length>0){
                //获取参数
                var lx=thisdata.attr("data-lx");
                var kssj=thisdata.attr("data-kssj");
                $("#LoadedTip").show();
                //获取体温单内容
                $.ajax({
                    url: serviceChoose + "/DC_Templature_Data",
                    type: 'POST',
                    timeout: utils.timeoutSec(),
                    data: JSON.stringify({
                            "IN": {
                                "PATIID": patIID,
                                "PAGEID": pageID,
                                "BABY": baby,
                                "FILE": fileID,                      //文件ID
                                "YH": ys,                        //需要查看的页号，第几页  //护理记录单时需要特殊处理
                                "KSID": ksidID,                     //当前的科室ID
                                "LX": lx,                         //列表接口返回的类型值
                                "KSSJ": kssj,
                                "JSSJ": null
                            }
                        
                    }),
                    dataType: 'json',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success:function(responseTxt, statusTxt) {
                        console.log(responseTxt);
                        if(responseTxt.Result.ERROR){
                            if(responseTxt.Result.ERROR.MSG){
                                utils.showHide(responseTxt.Result.ERROR.MSG);
                            }else{
                                utils.showHide(responseTxt.Result.ERROR);
                            }
                            $("#LoadedTip").hide();
                        }else{
							//debugger; 
							var imgUrl=".."+responseTxt.Result.FILE;
							var imgNo=responseTxt.Result.FILE.split("/")[responseTxt.Result.FILE.split("/").length-1];
							var imgCount=responseTxt.Result.PageCount;
							for(var i=1; i<=parseInt(imgCount); i++){
                                $("#"+pdfBox).append('<img id="testImg" src="'+imgUrl+'/'+imgNo+'_'+i+'.Jpeg?'+new Date().getTime()+'"/>');
							}

                            document.getElementById('testImg').onload=function(){
                                $("#LoadedTip").hide();
                            }

							// 放大缩小初始化
                            utils.CSHpanzoom(pdfBox);

                            /*var pdfUrl=serviceChoose.replace("/ClinicalService.asmx","")+responseTxt.Result.FILE;
                            console.log(pdfUrl);
							var pdfWidth=responseTxt.Result.PrinterPage.split(";")[0];
                            // 解析PDF
                            PDFJS.getDocument(pdfUrl).then(function (pdf) {           //PDF路径
                                var totalPages = pdf.numPages;
                                utils.showAllPage(1, totalPages, pdf, pdfBox, pdfWidth);
                            });
                            // 放大缩小初始化
                            utils.CSHpanzoom(pdfBox);*/
                        };
                        //$("#LoadedTip").hide();

                    },
                    complete: function (XMLHttpRequest, textStatus) {  
                        utils.errorAjax(textStatus,leiroghuoqu,[thisdata]);
                    }

                });
            }
        }
        //根据内容控制页数列表长度
        function pageliLong(ulid,lang){
            var avail=window.screen.availHeight;
            var ulLength=36*parseInt(lang)+126;
            if (ulLength<avail) {
                $(ulid).css('bottom', 'auto');
            }else{
                $(ulid).css('bottom', '50px');
            }
        }
        //获取除体温单以外的内容
        function otherPaper(thisdata,ys){
            $("#mainNavMinTwo5 ul li").removeClass("XuanZhong");
            thisdata.addClass("XuanZhong");
            $("#pageContral").hide();   //体温单 导航 隐藏            
            $("#huLi2").html(thisdata.parent().prev().text().split("（")[0]+" | ");//头部显示值
            $("#huLi3").html(thisdata.children("span").text());           
            var thefile=thisdata.attr("data-id");
            var pdfBox="bingLiPDF-"+thefile;  //除体温表以外表容器
            $("#PDFdivWrapHL>.PDFdiv").hide();
            $("#"+pdfBox).show();     //当前pdf容器
            var ys=thisdata.attr("data-ys"); //获取页数
            //是否有多页
            if(ys>1){
                var dq=thisdata.attr("data-dq");  //获取当前页数
                $("#RecordPAge").show();//护理记录导航
                $("#huiLpages li").remove(); //清空列表  防止重复
                for (var i = 1; i <= ys; i++) {   //根据页数初始化页数列表
                    var list12="<li id='"+i+"'>"+i+"</li>";
                    $("#huiLpages").append(list12);
                };
                //控制列表页
                pageliLong('#huiLpages',$("#huiLpages li").length)
                $("#huiLpages li").unbind();
                var pageListhoosehammer=$("#huiLpages li").hammer();  //事件注册必须在列表已经添加完成时
                pageListhoosehammer.on('tap', function (ev) { 
                    $("#huiLpages li").removeClass('active');                      
                    $(this).addClass('active');              //点击时添加选中                                  
                    contChange($(this).text(),2);
                    setTimeout(function(){
                        $("#huiLpages").toggle();         //列表消失
                        $("#jl-zheZhaoDIV").toggle();  //遮罩层消失
                    }, 500);
                }); 
                $("#RecordPAge .centerthis").text(dq); //默认当前页数
                $("#huiLpages li").eq(dq-1).addClass('active');
            }else{
                $("#RecordPAge").hide();
            }
            //判断是否已经加载
            if(!$("#"+pdfBox).find('img').length>0){
                if (ys>1) {
                    thisdata.attr('data-dq', ys);//创建当前页数
                }
                //获取参数
                // var theys=thisdata.attr("data-ys");//页数不传
                var thelx=thisdata.attr("data-lx");
                var thekssj=thisdata.attr("data-kssj"); 
                // utils.showHide("接口调试");           
                $("#LoadedTip").show();
                $.ajax({
                    url: serviceChoose + "/DC_Templature_Data",
                    type: 'POST',
                    timeout: utils.timeoutSec(),
                    data: JSON.stringify({
                            "IN": {
                                "PATIID": patIID,
                                "PAGEID": pageID,
                                "BABY": baby,
                                "FILE": thefile,                      //文件ID
                                "YH": ys,                        //需要查看的页号，第几页  //护理记录单时需要特殊处理
                                "KSID": ksidID,                     //当前的科室ID
                                "LX": thelx,                         //列表接口返回的类型值
                                "KSSJ": thekssj,
                                "JSSJ": null
                            }
                        
                    }),
                    dataType: 'json',  
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    success:function(responseTxt, statusTxt) {
                        //console.log(responseTxt);
                        if(responseTxt.Result.ERROR){
                            if(responseTxt.Result.ERROR.MSG){
                                utils.showHide(responseTxt.Result.ERROR.MSG);
                            }else{
                                utils.showHide(responseTxt.Result.ERROR);
                            }
                            $("#LoadedTip").hide()
                        }else{
                            var imgUrl=".."+responseTxt.Result.FILE;
                            var imgNo=responseTxt.Result.FILE.split("/")[responseTxt.Result.FILE.split("/").length-1];
                            var imgCount=responseTxt.Result.PageCount;
                            for(var i=1; i<=parseInt(imgCount); i++){
                                $("#"+pdfBox).append('<img src="'+imgUrl+'/'+imgNo+'_'+i+'.Jpeg?'+new Date().getTime()+'"/>');
                            }
                            utils.CSHpanzoom(pdfBox);
                        };
                        $("#LoadedTip").hide(); 

                    },
                    complete: function (XMLHttpRequest, textStatus) {  
                        utils.errorAjax(textStatus,otherPaper,[thisdata]);
                    }

                });
            }
        }
        //体温单前七个按钮判断
        function gaibiand(theindex){
            var Nowdata=$("#mainNavMinTwo5 ul .XuanZhong");
            //var nowpage=Nowdata.attr('data-dq');
            var ys=Nowdata.attr('data-ys');
            switch(theindex){
                case 0:
                    contChange(1,1);
                    break;
                case 1:
                    contChange(2,1);
                    break;
                case 2:
                    contChange(3,1);
                    break;
                case 3:
                    contChange(4,1);
                    break;
                case 4:
                    if($("#thisPageTotal").text()==1){
                        utils.showHide("这已经是第一周了");

                    }else{
                        var lastpage=$("#thisPageTotal").text()-1;
                        contChange(lastpage,1);
                    };                    
                    break;
                case 5:
                    contChange(ys,1);
                    break;
                case 6:
                    if($("#thisPageTotal").text()==ys){
                        utils.showHide("这是已经最后一周了");
                    }else{
                        var nextpage=parseInt($("#thisPageTotal").text())+1;
                        contChange(nextpage,1);
                    }
            };


        }

        //护理记录 上下页切换
        function recordGB(theindex){
            var Nowdata=$("#mainNavMinTwo5 ul .XuanZhong");
            var nowpage=Nowdata.attr('data-dq');
            var allpage=Nowdata.attr('data-ys');
            switch(theindex){
                case 1:
                    if(nowpage==1){
                        utils.showHide("这已经是第一页了");
                    }else{
                        var lastpage=nowpage-1;
                        $("#RecordPAge").attr('data-dq',lastpage);
                        contChange(lastpage,2);
                    };
                    break;
                case 2:
                    if(nowpage==allpage){
                        utils.showHide("这是已经最后一页了");
                    }else{
                        var nextpage=parseInt(nowpage) +1;
                         $("#RecordPAge").attr('data-dq',nextpage)
                        contChange(nextpage,2);
                    }
                    break;
            };

        }
        //点击页数按钮 周数 切换体温表内容1    或者护理记录单 2 
        function contChange(page,tw){
            var xzdata=$("#mainNavMinTwo5 ul .XuanZhong");
            var ys=xzdata.attr('data-ys');
            var act=xzdata.attr("id");
            var fileID=act.split("-")[1];
            var thelx=xzdata.attr("data-lx");
            var thekssj=xzdata.attr("data-kssj"); 
            xzdata.attr('data-dq',page);
            $("#LoadedTip").show();
            if(tw==1){//体温单
                $("#thisPageTotal").text(page); //改变总页数 显示为当前页面
                $("#pageListhoose li").removeClass('active');                      
                $("#"+page).addClass('active');  //添加选中
                var pdfBox="temperature-"+fileID;
                $("#"+pdfBox).find('img').remove();  //移除上一次添加的体温单
                if(ys==page&&ys>1){
                    $("#leftNemone >div").eq(4).removeClass('jy');
                    $("#leftNemone >div").eq(6).addClass('jy');
                }else if(page==1&&ys>1){
                    $("#leftNemone >div").eq(4).addClass('jy');
                    $("#leftNemone >div").eq(6).removeClass('jy');
                }else if(ys==page&&ys==1){
                    $("#leftNemone >div").eq(4).addClass('jy');
                    $("#leftNemone >div").eq(6).addClass('jy');
                }else{
                    $("#leftNemone >div").eq(4).removeClass('jy');
                    $("#leftNemone >div").eq(6).removeClass('jy');
                }
            }else{
                fileID=act.split("-")[1];
                var pdfBox="bingLiPDF-"+fileID;
                $("#"+pdfBox).find('img').remove();  //移除上一次添加的体温单
                $("#RecordPAge .centerthis").text(page); //默认当前页数
            }

            $("#PDFdivWrapHL>.PDFdiv").hide();
            $("#"+pdfBox).show();     //当前pdf容器     
            $.ajax({
                //获取体温单内容
                url: serviceChoose + "/DC_Templature_Data",
                type: 'POST',
                timeout: utils.timeoutSec(),
                data: JSON.stringify({
                        "IN": {
                            "PATIID": patIID,
                            "PAGEID": pageID,
                            "BABY": baby,
                            "FILE": fileID,                      //文件ID
                            "YH": page,                        //需要查看的页号，第几页  //护理记录单时需要特殊处理
                            "KSID": ksidID,                     //当前的科室ID
                            "LX": thelx,                         //列表接口返回的类型值
                            "KSSJ": thekssj,
                            "JSSJ": null
                        }
                    
                }),
                dataType: 'json',        
                headers: {
                    'Content-Type': 'application/json'
                },
                success:function(responseTxt, statusTxt) {
                    //console.log(responseTxt);
                    if(responseTxt.Result.ERROR){
                        if(responseTxt.Result.ERROR.MSG){
                            utils.showHide(responseTxt.Result.ERROR.MSG);
                        }else{
                            utils.showHide(responseTxt.Result.ERROR);
                        }
                        $("#LoadedTip").hide()
                    }else{
                        /*var pdfUrl=serviceChoose.replace("/ClinicalService.asmx","")+responseTxt.Result.FILE;
						var pdfWidth=responseTxt.Result.PrinterPage.split(";")[0];
                        // 解析PDF
                        PDFJS.getDocument(pdfUrl).then(function (pdf) {           //PDF路径
                            var totalPages = pdf.numPages;
                            utils.showAllPage(1, totalPages, pdf, pdfBox, pdfWidth);
                        });*/
						var imgUrl=".."+responseTxt.Result.FILE;
						var imgNo=responseTxt.Result.FILE.split("/")[responseTxt.Result.FILE.split("/").length-1];
						var imgCount=responseTxt.Result.PageCount;
						for(var i=1; i<=parseInt(imgCount); i++){
                            $("#"+pdfBox).append('<img src="'+imgUrl+'/'+imgNo+'_'+i+'.Jpeg?'+new Date().getTime()+'"/>');
						}
                        // 放大缩小初始化
                        utils.CSHpanzoom(pdfBox);
                    };
                    $("#LoadedTip").hide();
                },
                complete: function (XMLHttpRequest, textStatus) {  
                    utils.errorAjax(textStatus,contChange,[page]);
                }
            });

        }
        function specialChara(chara){
            return chara.replace(/\./g,"-")
        }

    }

    return{
        nurseHis: nurseHis
    }

});
