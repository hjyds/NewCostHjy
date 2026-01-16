var _f2f = "0";//0-普通随访 1-面对面
var _token = "5fc3610b-a9c7-4e37-aa40-1ffe5d2745cc";//认证
var _urlPicUp = `https://cqapi.cfkfz.com:28009/admin/storage/create`;//图片上传地址
var _urlPicF2F = `https://cqapi.cfkfz.com:28009/admin/storage/createImg`;//面对面随访图片地址
var _urlDel= "https://cqapi.cfkfz.com:28009/admin/follow/delete?id=115420"



/**
 * 生成指定范围的随机整数
 * @param {any} min
 * @param {any} max
 * @returns
 */
function myFunction(min, max) {
    // 生成随机数
    let a = Math.floor(Math.random() * (max - min + 1)) + min;
    return a;
}
function GetRandomTimeStrF2F(mon, dayNum) {
    let strTime = "";// "2024-" + mon + "-0" + myFunction(1, 8) + " " + myFunction(10, 17) + ":" + myFunction(10, 59) + ":" + myFunction(10, 59);
     
    if (parseInt(dayNum) < 10) {
        dayNum = "0" + parseInt(dayNum);
    }
    if (parseInt(mon) < 10) {
        mon = "0" + parseInt(mon);
    }
    strTime = "2025-" + mon + "-" + dayNum + " " + myFunction(10, 17) + ":" + myFunction(10, 59) + ":" + myFunction(10, 59);
    return strTime;     
}

/**
 * 生成随机的日期字符串
 * @param {string} mon  月份
 * @returns
 */
function GetRandomTimeStr(mon) {
    let strTime = "";// "2024-" + mon + "-0" + myFunction(1, 8) + " " + myFunction(10, 17) + ":" + myFunction(10, 59) + ":" + myFunction(10, 59);


    let dayNum = myFunction(1, 17)
    if (dayNum < 10) {
        dayNum = "0" + dayNum;
    }
    strTime = "2024-" + mon + "-" + dayNum + " " + myFunction(10, 17) + ":" + myFunction(10, 59) + ":" + myFunction(10, 59);
    return strTime;


    let day1 = "2024-" + mon + "-01";
    let day2 = "2024-" + mon + "-28";
    let day3 = window.GetTimeAToB(day1, day2)
    strTime = day3 + " " + myFunction(10, 17) + ":" + myFunction(10, 59) + ":" + myFunction(10, 59);
    return strTime;
}
function DataToday1() {
    let objData = {
        "storageList": [],
        "userId": 89367,
        "followType": 1,
        "hasMobility": 1,
        "rehabilitationNum": "",
        "doctorName": [
            "何先佳"
        ],
        "weight": "",
        "appetite": "",
        "mobility": "",
        "hasHospitalized": 0,
        "hospitalizedString": "",
        "hasVaccinate": 0,
        "vaccinateString": "",
        "hasSmoking": 1,
        "smokingString": "",
        "hasOccupation": 0,
        "occupationString": "",
        "demand": "坚持户外活动，自我调节，控制情绪，正确对待生活。",
        "suggest": "高蛋白饮食，居家康复。",
        "siteId": "",
        "createTime": "2024-06-21 16:20:20",
        "address": "来苏镇五根松村",
        "hasWeight": 0,
        "hasAppetite": 0,
        "hasSleeping": 0,
        "hasRehabilitation": 0,
        "hasSelfEvaluation": 1,
        "hasSatisfaction": 1,
        "rehabilitationString": "进行胸廓放松训练，咳嗽训练等。",
        "psychologyString": "",
        "homeRehabilitationString": "",
        "hasPsychology": 0,
        "hasHomeRehabilitation": 0
    }
}
/**
 * 添加随访记录
 * @param {any} userCode  可以手机号，可以身证号，可以编号
 * @returns
 */
function AddPhoneBillOnePatiByUserCode(userCode) {
    let objPat = null;
    let retData = zlGetLS(`https://cqapi.cfkfz.com:28009/admin/user/formsList?modelAndIdCard=` + userCode);
    if (retData) {
        if (retData.errno == 0) {
            if (retData.data.list.length > 0) {
                objPat = retData.data.list[0];
            }
        }
    }
    if (objPat == null) return

    let docList = ["龙注伊", "毛西瑞"];
    let homeRehabilitationStringLst = [
        "缩唇呼吸，腹式呼吸，深吸慢呼，慢走，练八段锦。",
        "进行胸廓放松训练，咳嗽训练等。",
        "避免粉尘暴露，预防感冒，冬春季节及时接种流感疫苗。"
    ];
    let psychologyStringLst = [
        "坚持户外活动，自我调节，控制情绪，正确对待生活。",
        "正视病情，多参加集团活动，听听音乐，多与人沟通。",
        "建立良好的生活习惯，保持规律的作息时间,健康的饮食习惯和适当的运动。"];
    let suggestLst = [
        "高蛋白饮食，居家康复。",
        "服用富含维生素和微量元素的食物，多吃新鲜蔬菜和水果。",
        "选择健脾开胃、清肺补肺、有营养易吸收的饮食物。"];

   
    let objPatTemp = GetPostDataMod();
    let strPat = JSON.stringify(objPatTemp);
    let oneData = JSON.parse(strPat);     
    oneData.rehabilitationNum = objPat.rehabilitationNum;
    oneData.userId = objPat.id;

    const startDate = '2025-07-06T00:00:00';
    const endDate = '2025-07-25T23:59:59';

    const randomDate = getRandomDate(startDate, endDate);
    const formattedDate = formatDate(randomDate); 
    oneData.createTime = formattedDate;
    let lngIndx = myFunction(0, 2);//三个选项的，随机取一个
    oneData.homeRehabilitationString = homeRehabilitationStringLst[lngIndx];
    oneData.psychologyString = psychologyStringLst[lngIndx];
    oneData.suggest = suggestLst[lngIndx];
    lngIndx = myFunction(0, 1);//两个选项的，随机取一个
    oneData.doctorName[0] = docList[lngIndx];
    oneData.hasSelfEvaluation = myFunction(0, 1);
    oneData.hasSatisfaction = 0;
    oneData.hasAppetite = (0 == myFunction(0, 1)) ? 0 : 2;
    oneData.hasSleeping = (0 == myFunction(0, 1)) ? 0 : 2;
    oneData.hasRehabilitation = myFunction(0, 1);

    let lst = zlPostLS(`https://cqapi.cfkfz.com:28009/admin/follow/add`, JSON.stringify(oneData));

    return lst;
}

function getRandomDate(start, end) {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const randomTime = new Date(startDate + Math.random() * (endDate - startDate));
    return randomTime;
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function DocFunText() {
    debugger

    ////for (var i = 0; i < 20; i++) {
    ////    myFunction(0, 2);
    ////}

    //return
    //出错了删掉的情况
    if (0 === 1) {
        let datas = zlGetLS(`https://cqapi.cfkfz.com:28009/admin/follow/list?page=4&limit=500&startTime=2025-02-01+00:00:00&endTime=2025-03-04+23:59:59&followType=`);
        debugger
        //zlPostLS('https://cqapi.cfkfz.com:28009/admin/follow/delete?id=118094', '118094');

        datas.data.list.forEach(function (item) {
            zlPostLS('https://cqapi.cfkfz.com:28009/admin/follow/delete?id=' + item.id, item.id);

        });
        return
    }

    //let objData = GetPatiIdInfoList();
    let docList = ["何先佳", "龙注伊", "毛西瑞"];
    docList = ["龙注伊", "毛西瑞"];//医生发生了变化
    let homeRehabilitationStringLst = [
        "缩唇呼吸，腹式呼吸，深吸慢呼，慢走，练八段锦。",
        "进行胸廓放松训练，咳嗽训练等。",
        "避免粉尘暴露，预防感冒，冬春季节及时接种流感疫苗。"
    ];

    let psychologyStringLst = [
        "坚持户外活动，自我调节，控制情绪，正确对待生活。",
        "正视病情，多参加集团活动，听听音乐，多与人沟通。",
        "建立良好的生活习惯，保持规律的作息时间,健康的饮食习惯和适当的运动。"];

    let suggestLst = [
        "高蛋白饮食，居家康复。",
        "服用富含维生素和微量元素的食物，多吃新鲜蔬菜和水果。",
        "选择健脾开胃、清肺补肺、有营养易吸收的饮食物。"];

    var lstId = GetPatiIdInfoList(); //获取 病人id和身份证号的列表

    let lstAdr = GetPatiNoAdrList();

    let objPat = GetPostDataMod();
    let strPat = JSON.stringify(objPat);


    lstAdr.forEach(function (item) {
        lstId.forEach(function (t) {
            if (t.no == item.no) {
                item.id = t.id;
            }
        });
    })
     
    const startDate = '2025-11-03T00:00:00';
    const endDate = '2025-11-24T23:59:59';

     
    let lstPost = [];

    for (var i = 0; i < lstAdr.length; i++) {

        let oneData = JSON.parse(strPat);
         
       

        oneData.userId = lstAdr[i].id;//病人id替换        
        oneData.address = lstAdr[i].address;//地址
        let mon_num = $("#fl_mon_num").val()
        //oneData.createTime = GetRandomTimeStr(mon_num); //11 月份  // window.GetTimeAToB('2024-03-01','2024-03-31') // 获取随机时间

        const randomDate = getRandomDate(startDate, endDate);
        const formattedDate = formatDate(randomDate);
        console.log(formattedDate); // 输出格式化后的随机日期
        oneData.createTime = formattedDate;


        let lngIndx = myFunction(0, 2);//三个选项的，随机取一个
        oneData.homeRehabilitationString = homeRehabilitationStringLst[lngIndx];
        oneData.psychologyString = psychologyStringLst[lngIndx];
        oneData.suggest = suggestLst[lngIndx];

        lngIndx = myFunction(0, 1);//两个选项的，随机取一个
        oneData.doctorName[0] = docList[lngIndx];


        oneData.hasSelfEvaluation = myFunction(0, 1);
        oneData.hasSatisfaction = 0;// myFunction(0, 1);// 患者对于肺康复工作站的满意度     0-好        1-一般        2-差
        oneData.hasAppetite = (0 == myFunction(0, 1)) ? 0 : 2;
        oneData.hasSleeping = (0 == myFunction(0, 1)) ? 0 : 2;
        oneData.hasRehabilitation = myFunction(0, 1);

        lstPost.push(oneData);

        //if ("510229193210305978" === lstAdr[i].no) {
        //    debugger
        //    try {
        //        zlPostLS(`https://cqapi.cfkfz.com:28009/admin/follow/add`, JSON.stringify(oneData));
        //    } catch (e) {
        //        debugger
        //    }
        //} 
    }
    debugger
    let testPar = {
        "storageList": [],
        "userId": 89367,
        "followType": 1,
        "hasMobility": 1,
        "rehabilitationNum": "",
        "doctorName": [
            "龙注伊"
        ],
        "weight": "",
        "appetite": "",
        "mobility": "",
        "hasHospitalized": 0,
        "hospitalizedString": "",
        "hasVaccinate": 0,
        "vaccinateString": "",
        "hasSmoking": 0,
        "smokingString": "",
        "hasOccupation": 0,
        "occupationString": "",
        "demand": "无",
        "suggest": "高蛋白饮食",
        "siteId": "",
        "createTime": "2024-06-21 17:18:08",
        "address": "来苏镇五根松村",
        "hasWeight": 0,
        "hasAppetite": 0,
        "hasSleeping": 0,
        "hasRehabilitation": 1,
        "hasSelfEvaluation": 1,
        "hasSatisfaction": 0,
        "rehabilitationString": "",
        "psychologyString": "正视病情，多参加集团活动，听听音乐，多与人沟通。",
        "homeRehabilitationString": "缩唇呼吸，腹式呼吸，深吸慢呼，慢走，练八段锦。",
        "hasPsychology": 1,
        "hasHomeRehabilitation": 1
    }
    //zlPostLS(`https://cqapi.cfkfz.com:28009/admin/follow/add`, JSON.stringify(testPar));

    debugger
    lstPost.forEach(function (item) {
        try {
            zlPostLS(`https://cqapi.cfkfz.com:28009/admin/follow/add`, JSON.stringify(item));
        } catch (e) {
            debugger
        }
    });
    let listOutData = [];
    lstPost.forEach(function (item) {
        listOutData.push({
            "docname": item.doctorName[0],
            "userId": item.userId,
            "createTime": item.createTime

        })
    });

    console.table(listOutData)
}
/**
 * 尘肺康健接口调用API服务POST方封装
 * @param {any} url
 * @param {any} postData
 * @param {any} rooturl
 * @param {any} timeout
 * @param {any} token
 * @param {any} successCallBack
 * @param {any} errorCallBack
 * @returns
 */
function zlPostLS(url, postData, rooturl = "", timeout = 0, token = "", successCallBack, errorCallBack) {
    if (typeof successCallBack === "function") showLoading();//异步时可以显示出来

    var result = { Success: false, Code: "", Data: undefined, Msg: "" };

    $.ajax({
        url: rooturl + url,
        type: "post",
        async: (typeof successCallBack === "function") ? true : false,//有回调时使用异步，否则同步
        timeout: zlval(timeout),//超时
        contentType: "application/json",
        data: postData,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Access-Token", _token);
        },
        success: function (res, status, xhr) {             
            result = res;//原样返回
            if (res.Success) {
                if (typeof successCallBack == "function") {
                    closeLoading();
                    successCallBack(result);
                }
            } else {//返回失败也当成错误
                if (typeof errorCallBack == "function") {
                    closeLoading();
                    errorCallBack(result);
                }
            }
        },
        error: function (xhr, status, error) {
            debugger
            result = GetWebApiErrorResult(xhr, status);
            if (typeof errorCallBack == "function") {
                closeLoading();
                errorCallBack(result);
            }
        },
    });

    if (successCallBack == undefined) return result;
}

/**
 * 尘肺康健接口调用API服务Get方封装
 * @param {any} url
 * @param {any} postData
 * @param {any} rooturl
 * @param {any} timeout
 * @param {any} token
 * @param {any} successCallBack
 * @param {any} errorCallBack
 * @returns
 */
function zlGetLS(url, postData, rooturl = "", timeout = 0, token = "", successCallBack, errorCallBack) {
    if (typeof successCallBack === "function") showLoading();//异步时可以显示出来

    var result = { Success: false, Code: "", Data: undefined, Msg: "" };

    $.ajax({
        url: rooturl + url,
        type: "get",
        async: (typeof successCallBack === "function") ? true : false,//有回调时使用异步，否则同步
        timeout: zlval(timeout),//超时
        contentType: "application/json",
        data: postData,
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Access-Token", _token);
        },
        success: function (res, status, xhr) { 
            result = res; 
            if (res.Success) {
                if (typeof successCallBack == "function") {
                    closeLoading();
                    successCallBack(result);
                }
            } else {//返回失败也当成错误
                if (typeof errorCallBack == "function") {
                    closeLoading();
                    errorCallBack(result);
                }
            }
        },
        error: function (xhr, status, error) {
            debugger
            result = GetWebApiErrorResult(xhr, status);
            if (typeof errorCallBack == "function") {
                closeLoading();
                errorCallBack(result);
            }
        },
    });

    if (successCallBack == undefined) return result;
}

function zlGetMyWeb(url, postData, rooturl = "", timeout = 0, token = "", successCallBack, errorCallBack) {
    if (typeof successCallBack === "function") showLoading();//异步时可以显示出来

    var result = { Success: false, Code: "", Data: undefined, Msg: "" };

    $.ajax({
        url: rooturl + url,
        type: "get",
        async: (typeof successCallBack === "function") ? true : false,//有回调时使用异步，否则同步
        timeout: zlval(timeout),//超时
        contentType: "application/json",
        data: postData, 
        success: function (res, status, xhr) { 
            result = res;//服务端转换为了{Success,Code,Data,Msg}格式
            if (res.Success) {
                if (typeof successCallBack == "function") {
                    closeLoading();
                    successCallBack(result);
                }
            } else {//返回失败也当成错误
                if (typeof errorCallBack == "function") {
                    closeLoading();
                    errorCallBack(result);
                }
            }
        },
        error: function (xhr, status, error) {
            debugger
            result = GetWebApiErrorResult(xhr, status);
            if (typeof errorCallBack == "function") {
                closeLoading();
                errorCallBack(result);
            }
        },
    });

    if (successCallBack == undefined) return result;
}

var S = +new Date, k = 0;
function Muid() {
    return "vc-upload-" + S + "-" + ++k
}

function PicUpdata(name_in, url_in) {

    let patLst = GetPatiIdInfoList();
    let url = `https://cqapi.cfkfz.com:28009/admin/familyDoctor/create`;
    debugger
    let objPic = {
        "name": "唐珍富.jpg",
        "uid": Muid(),//"vc-upload-1702040759828-10",//????这个是什么  vc-upload-1702040759828-12
        "url": "https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/biirm4gc7ff01azm0znq.jpg"
    }
    objPic.name = name_in;
    objPic.url = url_in;
    let objPat = 0;
    let picName = objPic.name.split(".")[0];
    let arrTxt = picName.split("_");
    let strName = arrTxt[1];
    let strTime =  "2025-" + arrTxt[2] + "-" + arrTxt[3];//这个年份经常需要修改
    patLst.forEach(function (item) {
        if (item.realname == strName) {
            objPat = item;
        }
    });

    if (objPat === 0) {
        //layer.alert('未找到病人', { icon: 0 });
        console.log("未找到病人");
        return;
    }
     
    
    let objTmp = {
        "title": "尘肺家医签约",
        "siteId": 201,
        "userId": 74823,
        "rehabilitationNum": null,
        "summary": "重点人群管理",
        "meetingDate": "2023-04-10",
        "participants": [

        ],
        "storageList": [
            "{\"name\":\"唐珍富.jpg\",\"uid\":\"vc-upload-1702040759828-10\",\"url\":\"https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/biirm4gc7ff01azm0znq.jpg\"}"
        ]
    }

    objTmp.storageList = []
    objTmp.storageList.push(JSON.stringify(objPic));
    objTmp.userId = objPat.id;
    objTmp.siteId = objPat.siteId;
    objTmp.meetingDate = strTime;

    console.log(JSON.stringify(objTmp));

    return objTmp;
}
function ClsFileDom() {
    document.getElementById('fileupload').outerHTML = document.getElementById('fileupload').outerHTML
}
/**
 * 上传照片
 * @param {any} formData
 */
function postDataPic(formData) {

    let urlTemp =  _urlPicUp;
    let typeMod = $("#pic_type").attr("data-type");
    if ("1" == typeMod) {
        urlTemp = _urlPicF2F;
    }

    $.ajax({
        url: urlTemp,
        type: "post",
        data: formData,
        processData: false,
        contentType: false,
        dataType: "text",
        beforeSend: (xhr) => {
            xhr.setRequestHeader("Access-Token", _token);
            xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
        },
        success: function (data) {
            debugger
            let objData = JSON.parse(data);
            if (objData?.errno === 0) {
                if (objData.data.name) {
                    let jtmp = PicUpdata(objData.data.name, objData.data.url);
                    if (jtmp) {
                        zlPostLS(`https://cqapi.cfkfz.com:28009/admin/familyDoctor/create`, JSON.stringify(jtmp));
                        layer.alert('成功', { icon: 0 });
                        ClsFileDom();
                    }
                }
            }
            
        },
        error: function (err) {
            debugger
        }
    });
}
 
 