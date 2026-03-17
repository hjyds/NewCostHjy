define(["jquery", "hammer","jqueryhammer","utils"], function(jquery, hammer, jqueryhammer,utils) {

	// 保存成套项目
	function doctorAdviceCT(){

		var ctObject = [];

		// 判断是否有选中项目
		if($("#yzxdTwoJiChengTao li").find(".yes").length > 0 && $("#yzxdTwoJiChengTao li").find(".yes").length == $("#yzxdTwoJiChengTao li").find(".yesJC").length){
			
			$("#yzxdTwoJi").hide();     // 医嘱下达二级隐藏
			$("#yzxdBiaoTi").hide();    // 医嘱下达顶部标题隐藏
			$("#yzxdDaiBaoCun").show(); // 待保存块显示
			$("#yzdbcBiaoTi").show();   // 待保存块顶部显示
			$("#yzdbcBiaoTi").find(".buttonTop").show();  // 待保存块里面的标题按钮显示

			$.ajax({
				url: "json/completeSetYaoPin.json",
				async: false,
				type: "get",
				data: {},
				dataType: "json",
				success: function(responseTxt){
					for(var li=0; li<$("#yzxdTwoJiChengTao").find(".selt").length; li++){

						// 已选 第一级
						if($("#yzxdTwoJiChengTao li .selt").eq(li).hasClass("yes")){
					
							for(var xmi=0; xmi<responseTxt.CTDETAIL.ITEMLIST.ITEM.length; xmi++){
							
								if(responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].ZLXMID==$("#yzxdTwoJiChengTao li .selt").eq(li).parent().attr("data-xmid")){
									
									ctObject.push({
									yzfl:$("#yzxdTwoJiChengTao li .selt").eq(li).parent().attr("data-lb")==0 ? "长期医嘱" : "临时医嘱", //所属分类 长嘱/临嘱
									name:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].MC,
									sfjj:"no",
									kssj:utils.todayNow(),//获取当前时间
									gytj:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB ==5 || responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB ==6 ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].GYTJ : "",
									cjff:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB =="C" ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].GYTJ : "",
									cjks:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB =="C" ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].GYKSMC : "",
									zxks:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB ==5 || responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB ==6 ? "" : responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].ZXKSMC,  
									zxpl:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].ZXPC,
									sjfa:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].SJFA,
									dl:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].DL,
									gyzx:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB ==5 || responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB ==6 ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].GYKSMC : "",  
									fyyf:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB ==5 || responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB ==6 ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].ZXKSMC : "",
									zxxz:"正常",
									yszt:"",
									ID:"", //药自身ID
									ybID:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB ==5 || responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].LB ==6 ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].XGXH : "", //一并给药ID
									xmID:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].ZLXMID,// 医嘱JSON本身的ID
									ts:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].TS,
									zl:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmi].ZL
		 							});
									break;
								}

							}/*for*/

							// 循环第二级 一并追加的药
							if($("#yzxdTwoJiChengTao li .selt").eq(li).parent().find("li").length> 0){
								for(var towi=0; towi < $("#yzxdTwoJiChengTao li .selt").eq(li).parent().find("li").length; towi++ ){
									for(var xmti=0; xmti < responseTxt.CTDETAIL.ITEMLIST.ITEM.length; xmti++){
										if(responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].ZLXMID == $("#yzxdTwoJiChengTao li .selt").eq(li).parent().find("li").eq(towi).attr("data-xmid")){
											ctObject.push({
												yzfl:$("#yzxdTwoJiChengTao li .selt").eq(li).parent().find("li").eq(towi).attr("data-lb")==0 ? "长期医嘱" : "临时医嘱", //所属分类 长嘱/临嘱
												name:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].MC,
												sfjj:"no",
												kssj:"",//一并追加的药没有开始时间，以父医嘱时间为准
												gytj:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB ==5 || responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB ==6 ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].GYTJ : "",
												cjff:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB =="C" ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].GYTJ : "",
												cjks:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB =="C" ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].GYKSMC : "",
												zxks:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB ==5 || responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB ==6 ? "" : responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].ZXKSMC,  
												zxpl:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].ZXPC,
												sjfa:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].SJFA,
												dl:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].DL,
												gyzx:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB ==5 || responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB ==6 ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].GYKSMC : "",  
												fyyf:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB ==5 || responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB ==6 ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].ZXKSMC : "",
												zxxz:"正常",
												yszt:"",
												ID:"", //药自身ID
												ybID:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB ==5 || responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].LB ==6 ? responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].XGXH : "", //一并给药ID
												xmID:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].ZLXMID,// 医嘱JSON本身的ID
												ts:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].TS,
												zl:responseTxt.CTDETAIL.ITEMLIST.ITEM[xmti].ZL
		 									});
											break;
										}
									}
								}
							}
						
						}

					}
				}
					
				
			});

		}else{
			utils.showHide("有无效医嘱");
		}

		return ctObject;
		
	}

	return{
		doctorAdviceCT:doctorAdviceCT
	}

});