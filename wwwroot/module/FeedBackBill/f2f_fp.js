/**
 * 
 * 关于图片上传后的随访单录入
 * 
 * 
 */
(function () {
    $(function () {
        $("#parin").on("click", function () {               
            OutPutPDF();
        });
        $("#brandPic").on("change", function () {
            if (this.files.length <= 0) {
                return false;
            }
            _f2f = "1";
            let type = $("#pic_type").attr("data-type");
            let userCode = "";
            let lstName = [];
            if (type == "1") {
                 
                let patList = GetPatiIdInfoList();
                for (let i = 0; i < this.files.length; i++) {
                    var pic1 = this.files[i];
                    let pname = pic1.name.split('-')[0];
                    let ptimes = pic1.name.split('-')[1].split('.');
                    userCode = "";
                    let objPat = patList.filter(function (t) { return t.realname === pname; });
                    if (objPat.length > 0) {
                        userCode = objPat[0].userCode;
                        objPat[0].mon = ptimes[0];
                        objPat[0].dayNum = ptimes[1];

                        UpPICFUN(pic1, objPat[0]);
                    }

                    if (1 == 0) {
                        debugger
                        UpPICFUN(pic1, patList[0]);
                    }

                     
                    function UpPICFUN(pic1, pt) {
                        var formData = new FormData();
                        formData.append("file", pic1);
                        postDataPicF2F(formData, pt);
                    }
                }
            } 
        });
    });

    /**
 * 上传照片
 * @param {any} formData
 */
    function postDataPicF2F(formData,objPt) {
         
        let urlTemp = _urlPicF2F; 

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
                 
                let objData = JSON.parse(data);
                if (objData?.errno === 0) {
                    if (objData.data.name) {
                        if (0 == 1) {
                            let patList = GetPatiIdInfoList();
                            patList.forEach(function (t) {
                                t.mon = 1;
                                t.dayNum = 19;
                                F2F_get_follow(1, t, objData);
                            });
                        } else {
                            F2F_get_follow(1, objPt, objData);
                        }
                        

                        //let jtmp = PicUpdata(objData.data.name, objData.data.url);
                        //if (jtmp) {
                        //    zlPostLS(`https://cqapi.cfkfz.com:28009/admin/familyDoctor/create`, JSON.stringify(jtmp));
                        //    layer.alert('成功', { icon: 0 });
                        //    ClsFileDom();
                        //}
                    }
                }

            },
            error: function (err) {
                 
            }
        });
    }

    function F2F_get_follow(type, patInfo, picInfo) {
        let objData = null;

        //GET请求             https://cqapi.cfkfz.com:28009/admin/user/formsList?modelAndIdCard=5002010123
        //      返回值
        objData = {
            "errno": 0,
            "data": {
                "total": 1,
                "pages": 1,
                "limit": 1,
                "page": 1,
                "list": [
                    {
                        "accomplishStatus": 3,
                        "complication": "6",
                        "followCount": 35,
                        "gender": "男",
                        "addTime": "2021-03-25 10:23",
                        "siteName": "重庆市永川区来苏镇尘肺病康复站",
                        "userCode": "5002010123",
                        "diagnosisResult": "煤工尘肺一期",
                        "doctorName": "何先佳",
                        "xStages": 1,
                        "evaluateCount": 52,
                        "otherDisease": "",
                        "complicationString": "慢性阻塞性肺疾病",
                        "rehabilitationLastTime": "2024-03-08 09:15:14",
                        "id": 77603,
                        "relationeShip": null,
                        "mobile": "15808068511",
                        "updateTime": "2024-03-11 11:31",
                        "avatar": "",
                        "userId": 77603,
                        "realname": "蒋中树",
                        "relativePhone": null,
                        "rehabilitationNum": 24,
                        "idCardNum": "510229195305246535",
                        "tenantId": 1,
                        "siteId": 201,
                        "diseaseOriginal": "",
                        "age": 71
                    }
                ]
            },
            "errmsg": "成功"
        };

        //上传图请求 POST     https://cqapi.cfkfz.com:28009/admin/storage/createImg
        //      返回值
        objData = {
            "errno": 0,
            "data": {
                "id": 71313,
                "key": "uk9z2tfciipye6rujvba.jpg",
                "name": "蒋中树-12.12.jpg",
                "type": "image/jpeg",
                "size": 1906274,
                "url": "https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/uk9z2tfciipye6rujvba.jpg",
                "addTime": "2024-12-24 12:03:21",
                "updateTime": "2024-12-24 12:03:21",
                "deleted": null
            },
            "errmsg": "成功"
        };

        //新增请求  POST      https://cqapi.cfkfz.com:28009/admin/follow/add
        // 入参
        objData = {
            "hasMobility": 0,
            "hasAppetite": 0,
            "mobility": "",// "第4项-4.患者近期步行及活动能力情况",
            "siteName": "重庆市永川区来苏镇尘肺病康复站",
            "userCode": "5002010123",
            "storageList": [
                "{\"name\":\"蒋中树-12.12.jpg\",\"key\":\"uk9z2tfciipye6rujvba.jpg\",\"url\":\"https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/uk9z2tfciipye6rujvba.jpg\"}"
            ],
            "doctorName": [
                "龙注伊"
            ],
            "smokingString": "",//"第7项-7.近期有无吸烟？",
            "id": 148793,
            "hasSleeping": 0,
            "hasSelfEvaluation": 0,
            "address": "来苏镇尘肺康复站",//"随访地址*请输入随访址",
            "hasOccupation": 0,
            "followType": 2,
            "diagnoseResult": "煤工尘肺  一期",
            "mobile": "15808068511",
            "hasRehabilitation": 1,
            "hasHospitalized": 0,
            "updateTime": "2024-02-23 10:34:50",
            "suggest": "下文随机",//"第11项，对于患者营养及药物使用方面的建议：",
            "homeRehabilitationString": "下文随机",//"第13项，对于患者居家康复方面的建议指导",
            "userId": 77603,
            "hasSmoking": 0,
            "demand": "无",//"第10项-10.患者对于肺康复工作站的建议及其他康复需求。",
            "hasHomeRehabilitation": 1,
            "realname": "蒋中树",
            "hasWeight": 0,
            "followTime": "2024年02月23日",
            "rehabilitationNum": 24,
            "hospitalizedString": "",//"第5项-5.近期有无再次急性加重住院？",
            "hasSatisfaction": 0,
            "createTime": "2024-12-24 12:02:58",
            "hasPsychology": 1,
            "tenantId": 1,
            "idCardNum": "510229195305246535",
            "psychologyString": "下文随机",//"第12项-12.对于患者心理康复方面的建议指导",
            "rehabilitationString": "",//"第9项-9.患者近期有无坚持居家康复",
            "hasVaccinate": 0,
            "vaccinateString": "",//"第6项-6.近期有无吸氧及疫苗注射？",
            "occupationString": "",//"第8项-8.有无参加职业劳动？",
            "index": 4,
            "weight": "",
            "appetite": "",
            "siteId": 201
        };

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

        //简化版的 简洁点的入参
        objData = {
            //"id": 268904,
            "userId": 77603,
            //"rehabilitationNum": 24,
            "doctorName": [
                "龙注伊"
            ],
            "hasWeight": 0,
            "hasAppetite": "2",
            "hasSleeping": 2,
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
            "suggest": "选择健脾开胃、清肺补肺、有营养易吸收的饮食物。",
            "createTime": "2024-01-02 15:48:26",
            "updateTime": "2024-12-24 22:28:10",
            "siteId": 201,
            "deleted": null,
            "hasRehabilitation": 1,
            "rehabilitationString": "",
            "hasSelfEvaluation": 0,
            "hasSatisfaction": 0,
            "hasPsychology": 1,
            "psychologyString": "建立良好的生活习惯，保持规律的作息时间,健康的饮食习惯和适当的运动。",
            "hasHomeRehabilitation": 1,
            "homeRehabilitationString": "避免粉尘暴露，预防感冒，冬春季节及时接种流感疫苗。",
            "tenantId": 1,
            "storageList": [
                "{\"name\":\"蒋中树-12.12.jpg\",\"key\":\"uk9z2tfciipye6rujvba.jpg\",\"url\":\"https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/uk9z2tfciipye6rujvba.jpg\"}"
            ],
            "followType": 2,
            "hasMobility": 0,
            "address": "来苏镇尘肺康复站"
        }
   
        objData.createTime = GetRandomTimeStrF2F(patInfo.mon, patInfo.dayNum)
        objData.updateTime = "";//为空的时候就是当前系统时间

        let lngIndx = myFunction(0, 2);//三个选项的，随机取一个
        objData.homeRehabilitationString = homeRehabilitationStringLst[lngIndx];
        objData.psychologyString = psychologyStringLst[lngIndx];
        objData.suggest = suggestLst[lngIndx];

        lngIndx = myFunction(0, 1);//三个选项的，随机取一个
        objData.doctorName[0] = docList[lngIndx];
        objData.hasSelfEvaluation = myFunction(0, 1);
        objData.hasSatisfaction = 0;// myFunction(0, 1);// 患者对于肺康复工作站的满意度     0-好        1-一般        2-差
        objData.hasAppetite = (0 == myFunction(0, 1)) ? 0 : 2;
        objData.hasSleeping = (0 == myFunction(0, 1)) ? 0 : 2;
        objData.hasRehabilitation = myFunction(0, 1);
        
        
         
        if (type == 1) {
            objData.userId = patInfo.id;
            objData.storageList[0] = JSON.stringify({ name: picInfo.data.name, key: picInfo.data.key, url: picInfo.data.url });
            //return objData;
        }
        let jtmp = JSON.parse(JSON.stringify(objData));
        let out = zlPostLS(`https://cqapi.cfkfz.com:28009/admin/follow/add`, JSON.stringify(jtmp));
        console.log(out);
        return
        // 返回
        objData = {
            "errno": 0,
            "data": {
                "id": 267553,
                "userId": 77603,
                "rehabilitationNum": 24,
                "doctorName": [
                    "龙注伊"
                ],
                "hasWeight": 0,
                "hasAppetite": "0",
                "hasSleeping": 0,
                "mobility": "第4项",
                "hasHospitalized": 0,
                "hospitalizedString": "第5项",
                "hasVaccinate": 1,
                "vaccinateString": "第6项",
                "hasSmoking": 0,
                "smokingString": "第7项",
                "hasOccupation": 0,
                "occupationString": "第8项",
                "demand": "第10项",
                "suggest": "第11项",
                "createTime": "2024-12-24 12:02:58",
                "updateTime": "2024-12-24 12:05:18",
                "siteId": 201,
                "deleted": null,
                "hasRehabilitation": 1,
                "rehabilitationString": "第9项",
                "hasSelfEvaluation": 0,
                "hasSatisfaction": 0,
                "hasPsychology": 1,
                "psychologyString": "第12项",
                "hasHomeRehabilitation": 1,
                "homeRehabilitationString": "第13项",
                "tenantId": 1,
                "storageList": [
                    "{\"name\":\"蒋中树-12.12.jpg\",\"key\":\"uk9z2tfciipye6rujvba.jpg\",\"url\":\"https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/uk9z2tfciipye6rujvba.jpg\"}"
                ],
                "followType": 2,
                "hasMobility": 0,
                "address": "随访地址"
            },
            "errmsg": "成功"
        };

        //删除请求  POST      https://cqapi.cfkfz.com:28009/admin/follow/update
        // 入参
        objData = {
            "id": 267553,
            "deleted": 1
        };

        // 返回
        objData = {
            "errno": 0,
            "data": {
                "id": 267553,
                "userId": null,
                "rehabilitationNum": null,
                "doctorName": null,
                "hasWeight": null,
                "hasAppetite": null,
                "hasSleeping": null,
                "mobility": null,
                "hasHospitalized": null,
                "hospitalizedString": null,
                "hasVaccinate": null,
                "vaccinateString": null,
                "hasSmoking": null,
                "smokingString": null,
                "hasOccupation": null,
                "occupationString": null,
                "demand": null,
                "suggest": null,
                "createTime": null,
                "updateTime": "2024-12-24 12:13:21",
                "siteId": null,
                "deleted": 1,
                "hasRehabilitation": null,
                "rehabilitationString": null,
                "hasSelfEvaluation": null,
                "hasSatisfaction": null,
                "hasPsychology": null,
                "psychologyString": null,
                "hasHomeRehabilitation": null,
                "homeRehabilitationString": null,
                "tenantId": null,
                "storageList": null,
                "followType": null,
                "hasMobility": null,
                "address": null
            },
            "errmsg": "成功"
        };

    }

    /**
     * 
     * 简洁入参方法
     * 
     */
    function GetPatiIdInfoListExFun() {
        //简洁点的入参
        let objData = {
            //"id": 268904,
            "userId": 77603,
            //"rehabilitationNum": 24,
            "doctorName": [
                "龙注伊"
            ],
            "hasWeight": 0,
            "hasAppetite": "2",
            "hasSleeping": 2,
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
            "suggest": "选择健脾开胃、清肺补肺、有营养易吸收的饮食物。",
            "createTime": "2024-01-02 15:48:26",
            "updateTime": "2024-12-24 22:28:10",
            "siteId": 201,
            "deleted": null,
            "hasRehabilitation": 1,
            "rehabilitationString": "",
            "hasSelfEvaluation": 0,
            "hasSatisfaction": 0,
            "hasPsychology": 1,
            "psychologyString": "建立良好的生活习惯，保持规律的作息时间,健康的饮食习惯和适当的运动。",
            "hasHomeRehabilitation": 1,
            "homeRehabilitationString": "避免粉尘暴露，预防感冒，冬春季节及时接种流感疫苗。",
            "tenantId": 1,
            "storageList": [
                "{\"name\":\"蒋中树-12.12.jpg\",\"key\":\"uk9z2tfciipye6rujvba.jpg\",\"url\":\"https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/uk9z2tfciipye6rujvba.jpg\"}"
            ],
            "followType": 2,
            "hasMobility": 0,
            "address": "来苏镇尘肺康复站"
        }
        zlPostLS(`https://cqapi.cfkfz.com:28009/admin/follow/add`, JSON.stringify(objData));
    }

    function DocFunTextF2F() { 

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

        let lstPost = [];

        for (var i = 0; i < lstAdr.length; i++) {

            let oneData = JSON.parse(strPat);
             
            oneData.userId = lstAdr[i].id;//病人id替换        
            oneData.address = lstAdr[i].address;//地址
            let mon_num = $("#fl_mon_num").val()
            oneData.createTime = GetRandomTimeStr(mon_num); //11 月份  // window.GetTimeAToB('2024-03-01','2024-03-31') // 获取随机时间

            let lngIndx = myFunction(0, 2);//三个选项的，随机取一个
            oneData.homeRehabilitationString = homeRehabilitationStringLst[lngIndx];
            oneData.psychologyString = psychologyStringLst[lngIndx];
            oneData.suggest = suggestLst[lngIndx];

            lngIndx = myFunction(0, 2);//三个选项的，随机取一个
            oneData.doctorName[0] = docList[lngIndx];


            oneData.hasSelfEvaluation = myFunction(0, 1);
            oneData.hasSatisfaction = 0;// myFunction(0, 1);// 患者对于肺康复工作站的满意度     0-好        1-一般        2-差
            oneData.hasAppetite = (0 == myFunction(0, 1)) ? 0 : 2;
            oneData.hasSleeping = (0 == myFunction(0, 1)) ? 0 : 2;
            oneData.hasRehabilitation = myFunction(0, 1);

            lstPost.push(oneData); 
        } 
    }


    function DelF2FPats() {

        let strNames = "胡世成,覃泽富,马光华,李功勇,许明国,张瑞禄,康忠贵,唐廷学,荣开华,蒋四云,巫绪才,唐珍富,唐新万,陈利荣,范祖洪,刘先江,谭先银,黄礼明,姜吉彬,李培松,骆光树,黎京伟,谢邦富,邹庆力";

        let lstTemp = [];
        lstTemp = strNames.split(',')
        lstTemp.forEach(function (name) {
             
            let userCode = encodeURI(name);

            let strUrl = `https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=200&userInfo=` + userCode + `&startTime=2024-01-01+00:00:00&endTime=2024-01-31+23:59:59&followType=2`;


            //https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=10&startTime=2024-05-31+00:00:00&endTime=2024-08-01+23:59:59

            let data = zlGetLS(strUrl);

            if (data) {
                debugger
                data.data.list.forEach(function (item) {
                   // let strUrl = `https://cqapi.cfkfz.com:28009/admin/follow/delete?id=` + item.id;
                    
                    zlPostLS(`https://cqapi.cfkfz.com:28009/admin/follow/update`, JSON.stringify({
                        "id": item.id,
                        "deleted": 1
                    }));
                });
            }

        });

    }

    function DelTelPPats() {      
         

            let strUrl = ""
        strUrl = `https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=999&userInfo=&startTime=2024-11-01+00:00:00&endTime=2024-12-01+23:59:59&followType=1`
             

            let data = zlGetLS(strUrl);

            if (data) {
                debugger
                console.log(data.data.list?.length);
                data.data.list.forEach(function (item) {
                    // let strUrl = `https://cqapi.cfkfz.com:28009/admin/follow/delete?id=` + item.id;

                    zlPostLS(`https://cqapi.cfkfz.com:28009/admin/follow/update`, JSON.stringify({
                        "id": item.id,
                        "deleted": 1
                    }));
                });
            }

       

    }

    function DelF2FPatsByName() {

        let strNames = "胡世成,覃泽富,马光华,李功勇,许明国,张瑞禄,康忠贵,唐廷学,荣开华,蒋四云,巫绪才,唐珍富,唐新万,陈利荣,范祖洪,刘先江,谭先银,黄礼明,姜吉彬,李培松,骆光树,黎京伟,谢邦富,邹庆力";

        let lstTemp = [];
        lstTemp = strNames.split(',')
        lstTemp.forEach(function (name) {

            let userCode = encodeURI(name);

            let strUrl = `https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=200&userInfo=` + userCode + `&startTime=2024-01-01+00:00:00&endTime=2024-01-31+23:59:59&followType=2`;
            strUrl = `https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=999&userInfo=` + userCode + `&startTime=2024-11-01+00:00:00&endTime=2025-01-01+23:59:59&followType=1`

            //https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=10&startTime=2024-05-31+00:00:00&endTime=2024-08-01+23:59:59

            let data = zlGetLS(strUrl);

            if (data) {
                debugger
                data.data.list.forEach(function (item) {
                    // let strUrl = `https://cqapi.cfkfz.com:28009/admin/follow/delete?id=` + item.id;

                    zlPostLS(`https://cqapi.cfkfz.com:28009/admin/follow/update`, JSON.stringify({
                        "id": item.id,
                        "deleted": 1
                    }));
                });
            }

        });

    }


    function OutPutPDF() {

        let lstData = [{ "lngPatiID": 1, "lngVisitID": 1, "id": "R3K12965" },
            { "lngPatiID": 1, "lngVisitID": 1, "id": "R3K12964" },
            { "lngPatiID": 718, "lngVisitID": 1, "id": "R3K13118" },
            { "lngPatiID": 718, "lngVisitID": 1, "id": "R3K13119" },
            { "lngPatiID": 5203, "lngVisitID": 1, "id": "R3K1321" },
            { "lngPatiID": 5878, "lngVisitID": 1, "id": "R3K7543" },
            { "lngPatiID": 5878, "lngVisitID": 1, "id": "R3K7544" },
            { "lngPatiID": 6173, "lngVisitID": 1, "id": "R3K3153" },
            { "lngPatiID": 6403, "lngVisitID": 1, "id": "R3K544" },
            { "lngPatiID": 6406, "lngVisitID": 1, "id": "R3K628" },
            { "lngPatiID": 6415, "lngVisitID": 1, "id": "R3K627" },
            { "lngPatiID": 6453, "lngVisitID": 1, "id": "R3K737" },
            { "lngPatiID": 6464, "lngVisitID": 1, "id": "R3K227" },
            { "lngPatiID": 6475, "lngVisitID": 1, "id": "R3K1394" },
            { "lngPatiID": 6480, "lngVisitID": 1, "id": "R3K615" },
            { "lngPatiID": 6498, "lngVisitID": 1, "id": "R3K674" },
            { "lngPatiID": 6502, "lngVisitID": 1, "id": "R3K1429" },
            { "lngPatiID": 6520, "lngVisitID": 1, "id": "R3K890" },
            { "lngPatiID": 6542, "lngVisitID": 1, "id": "R3K587" },
            { "lngPatiID": 6559, "lngVisitID": 1, "id": "R3K2049" },
            { "lngPatiID": 6572, "lngVisitID": 1, "id": "R3K648" },
            { "lngPatiID": 6572, "lngVisitID": 1, "id": "R3K647" },
            { "lngPatiID": 6577, "lngVisitID": 1, "id": "R3K646" },
            { "lngPatiID": 6585, "lngVisitID": 1, "id": "R3K1125" },
            { "lngPatiID": 6633, "lngVisitID": 1, "id": "R3K1114" },
            { "lngPatiID": 6687, "lngVisitID": 1, "id": "R3K583" },
            { "lngPatiID": 6695, "lngVisitID": 1, "id": "R3K621" },
            { "lngPatiID": 6695, "lngVisitID": 1, "id": "R3K620" },
            { "lngPatiID": 6695, "lngVisitID": 1, "id": "R3K618" },
            { "lngPatiID": 6697, "lngVisitID": 1, "id": "R3K592" },
            { "lngPatiID": 6705, "lngVisitID": 1, "id": "R3K593" },
            { "lngPatiID": 6715, "lngVisitID": 1, "id": "R3K1100" },
            { "lngPatiID": 6720, "lngVisitID": 1, "id": "R3K1953" },
            { "lngPatiID": 6757, "lngVisitID": 1, "id": "R3K998" },
            { "lngPatiID": 6774, "lngVisitID": 1, "id": "R3K742" },
            { "lngPatiID": 6815, "lngVisitID": 1, "id": "R3K741" },
            { "lngPatiID": 6821, "lngVisitID": 1, "id": "R3K738" },
            { "lngPatiID": 6823, "lngVisitID": 1, "id": "R3K743" },
            { "lngPatiID": 6842, "lngVisitID": 1, "id": "R3K693" },
            { "lngPatiID": 6874, "lngVisitID": 1, "id": "R3K581" },
            { "lngPatiID": 6907, "lngVisitID": 1, "id": "R3K726" },
            { "lngPatiID": 6913, "lngVisitID": 1, "id": "R3K1399" },
            { "lngPatiID": 7065, "lngVisitID": 1, "id": "R3K931" },
            { "lngPatiID": 7187, "lngVisitID": 1, "id": "R3K633" },
            { "lngPatiID": 7211, "lngVisitID": 1, "id": "R3K1698" },
            { "lngPatiID": 7243, "lngVisitID": 1, "id": "R3K643" },
            { "lngPatiID": 7287, "lngVisitID": 1, "id": "R3K902" },
            { "lngPatiID": 7402, "lngVisitID": 1, "id": "R3K932" },
            { "lngPatiID": 7543, "lngVisitID": 1, "id": "R3K953" },
            { "lngPatiID": 7616, "lngVisitID": 1, "id": "R3K933" },
            { "lngPatiID": 7626, "lngVisitID": 1, "id": "R3K764" },
            { "lngPatiID": 7700, "lngVisitID": 1, "id": "R3K996" },
            { "lngPatiID": 7996, "lngVisitID": 1, "id": "R3K728" },
            { "lngPatiID": 8014, "lngVisitID": 1, "id": "R3K732" },
            { "lngPatiID": 8169, "lngVisitID": 1, "id": "R3K1094" },
            { "lngPatiID": 8179, "lngVisitID": 1, "id": "R3K1076" },
            { "lngPatiID": 8276, "lngVisitID": 1, "id": "R3K730" },
            { "lngPatiID": 8329, "lngVisitID": 1, "id": "R3K1103" },
            { "lngPatiID": 8431, "lngVisitID": 1, "id": "R3K1126" },
            { "lngPatiID": 8434, "lngVisitID": 1, "id": "R3K2937" },
            { "lngPatiID": 8434, "lngVisitID": 1, "id": "R3K752" },
            { "lngPatiID": 8434, "lngVisitID": 1, "id": "R3K2319" },
            { "lngPatiID": 8458, "lngVisitID": 1, "id": "R3K745" },
            { "lngPatiID": 8495, "lngVisitID": 1, "id": "R3K814" },
            { "lngPatiID": 8595, "lngVisitID": 1, "id": "R3K3418" },
            { "lngPatiID": 8633, "lngVisitID": 1, "id": "R3K1932" },
            { "lngPatiID": 8794, "lngVisitID": 1, "id": "R3K986" },
            { "lngPatiID": 9062, "lngVisitID": 1, "id": "R3K958" },
            { "lngPatiID": 9073, "lngVisitID": 1, "id": "R3K1078" },
            { "lngPatiID": 9073, "lngVisitID": 1, "id": "R3K1079" },
            { "lngPatiID": 9217, "lngVisitID": 1, "id": "R3K969" },
            { "lngPatiID": 9217, "lngVisitID": 1, "id": "R3K1123" },
            { "lngPatiID": 9356, "lngVisitID": 1, "id": "R3K4152" },
            { "lngPatiID": 9642, "lngVisitID": 1, "id": "R3K987" },
            { "lngPatiID": 9669, "lngVisitID": 1, "id": "R3K930" },
            { "lngPatiID": 9879, "lngVisitID": 1, "id": "R3K985" },
            { "lngPatiID": 10104, "lngVisitID": 1, "id": "R3K1239" },
            { "lngPatiID": 10121, "lngVisitID": 1, "id": "R3K2382" },
            { "lngPatiID": 10157, "lngVisitID": 1, "id": "R3K934" },
            { "lngPatiID": 10374, "lngVisitID": 1, "id": "R3K4066" },
            { "lngPatiID": 10487, "lngVisitID": 1, "id": "R3K1342" },
            { "lngPatiID": 10687, "lngVisitID": 1, "id": "R3K1406" },
            { "lngPatiID": 10754, "lngVisitID": 1, "id": "R3K1205" },
            { "lngPatiID": 11375, "lngVisitID": 1, "id": "R3K2068" },
            { "lngPatiID": 11481, "lngVisitID": 1, "id": "R3K4586" },
            { "lngPatiID": 11512, "lngVisitID": 2, "id": "R3K7026" },
            { "lngPatiID": 11546, "lngVisitID": 1, "id": "R3K6874" },
            { "lngPatiID": 11596, "lngVisitID": 2, "id": "R3K3631" },
            { "lngPatiID": 11598, "lngVisitID": 1, "id": "R3K3625" },
            { "lngPatiID": 11631, "lngVisitID": 1, "id": "R3K5801" },
            { "lngPatiID": 11637, "lngVisitID": 1, "id": "R3K1214" },
            { "lngPatiID": 11652, "lngVisitID": 1, "id": "R3K3729" },
            { "lngPatiID": 11674, "lngVisitID": 1, "id": "R3K1085" },
            { "lngPatiID": 11711, "lngVisitID": 1, "id": "R3K8153" },
            { "lngPatiID": 11719, "lngVisitID": 1, "id": "R3K3860" },
            { "lngPatiID": 11763, "lngVisitID": 1, "id": "R3K5066" },
            { "lngPatiID": 12083, "lngVisitID": 1, "id": "R3K1127" },
            { "lngPatiID": 12321, "lngVisitID": 1, "id": "R3K1721" },
            { "lngPatiID": 12519, "lngVisitID": 1, "id": "R3K1088" },
            { "lngPatiID": 13022, "lngVisitID": 2, "id": "R3K1442" },
            { "lngPatiID": 13109, "lngVisitID": 1, "id": "R3K1424" },
            { "lngPatiID": 13300, "lngVisitID": 1, "id": "R3K12655" },
            { "lngPatiID": 13586, "lngVisitID": 1, "id": "R3K1128" },
            { "lngPatiID": 14235, "lngVisitID": 1, "id": "R3K3275" },
            { "lngPatiID": 14289, "lngVisitID": 1, "id": "R3K1729" },
            { "lngPatiID": 14302, "lngVisitID": 1, "id": "R3K6178" },
            { "lngPatiID": 14365, "lngVisitID": 1, "id": "R3K3273" },
            { "lngPatiID": 14385, "lngVisitID": 1, "id": "R3K2654" },
            { "lngPatiID": 14470, "lngVisitID": 1, "id": "R3K7223" },
            { "lngPatiID": 14656, "lngVisitID": 1, "id": "R3K1243" },
            { "lngPatiID": 14668, "lngVisitID": 1, "id": "R3K1397" },
            { "lngPatiID": 14858, "lngVisitID": 1, "id": "R3K1310" },
            { "lngPatiID": 14868, "lngVisitID": 1, "id": "R3K8243" },
            { "lngPatiID": 14887, "lngVisitID": 1, "id": "R3K3931" },
            { "lngPatiID": 15640, "lngVisitID": 1, "id": "R3K1612" },
            { "lngPatiID": 15702, "lngVisitID": 1, "id": "R3K2789" },
            { "lngPatiID": 15713, "lngVisitID": 1, "id": "R3K8627" },
            { "lngPatiID": 15764, "lngVisitID": 1, "id": "R3K1245" },
            { "lngPatiID": 15781, "lngVisitID": 1, "id": "R3K1717" },
            { "lngPatiID": 16070, "lngVisitID": 1, "id": "R3K5320" },
            { "lngPatiID": 16095, "lngVisitID": 1, "id": "R3K4913" },
            { "lngPatiID": 16182, "lngVisitID": 1, "id": "R3K1338" },
            { "lngPatiID": 16608, "lngVisitID": 1, "id": "R3K1244" },
            { "lngPatiID": 16621, "lngVisitID": 1, "id": "R3K1247" },
            { "lngPatiID": 16714, "lngVisitID": 1, "id": "R3K5056" },
            { "lngPatiID": 16774, "lngVisitID": 1, "id": "R3K4081" },
            { "lngPatiID": 16845, "lngVisitID": 1, "id": "R3K2739" },
            { "lngPatiID": 16853, "lngVisitID": 1, "id": "R3K1731" },
            { "lngPatiID": 16888, "lngVisitID": 1, "id": "R3K3388" },
            { "lngPatiID": 16905, "lngVisitID": 2, "id": "R3K6659" },
            { "lngPatiID": 16911, "lngVisitID": 1, "id": "R3K1814" },
            { "lngPatiID": 16922, "lngVisitID": 1, "id": "R3K1724" },
            { "lngPatiID": 16983, "lngVisitID": 1, "id": "R3K2481" },
            { "lngPatiID": 17206, "lngVisitID": 1, "id": "R3K2388" },
            { "lngPatiID": 17551, "lngVisitID": 1, "id": "R3K6432" },
            { "lngPatiID": 17562, "lngVisitID": 1, "id": "R3K2904" },
            { "lngPatiID": 18174, "lngVisitID": 2, "id": "R3K3277" },
            { "lngPatiID": 18322, "lngVisitID": 1, "id": "R3K3033" },
            { "lngPatiID": 18375, "lngVisitID": 1, "id": "R3K8593" },
            { "lngPatiID": 18422, "lngVisitID": 1, "id": "R3K7667" },
            { "lngPatiID": 18820, "lngVisitID": 1, "id": "R3K1392" },
            { "lngPatiID": 18840, "lngVisitID": 1, "id": "R3K1400" },
            { "lngPatiID": 19252, "lngVisitID": 2, "id": "R3K3023" },
            { "lngPatiID": 19308, "lngVisitID": 1, "id": "R3K6785" },
            { "lngPatiID": 19360, "lngVisitID": 1, "id": "R3K1452" },
            { "lngPatiID": 19639, "lngVisitID": 1, "id": "R3K1398" },
            { "lngPatiID": 19645, "lngVisitID": 1, "id": "R3K6478" },
            { "lngPatiID": 19878, "lngVisitID": 1, "id": "R3K1422" },
            { "lngPatiID": 20018, "lngVisitID": 1, "id": "R3K2783" },
            { "lngPatiID": 20799, "lngVisitID": 1, "id": "R3K5121" },
            { "lngPatiID": 20821, "lngVisitID": 1, "id": "R3K2504" },
            { "lngPatiID": 21253, "lngVisitID": 1, "id": "R3K2144" },
            { "lngPatiID": 21305, "lngVisitID": 1, "id": "R3K2058" },
            { "lngPatiID": 21474, "lngVisitID": 1, "id": "R3K4971" },
            { "lngPatiID": 21582, "lngVisitID": 1, "id": "R3K3021" },
            { "lngPatiID": 21870, "lngVisitID": 1, "id": "R3K3390" },
            { "lngPatiID": 21958, "lngVisitID": 1, "id": "R3K1693" },
            { "lngPatiID": 22204, "lngVisitID": 1, "id": "R3K1604" },
            { "lngPatiID": 22293, "lngVisitID": 1, "id": "R3K4400" },
            { "lngPatiID": 22690, "lngVisitID": 1, "id": "R3K4705" },
            { "lngPatiID": 22779, "lngVisitID": 1, "id": "R3K6661" },
            { "lngPatiID": 23259, "lngVisitID": 1, "id": "R3K8026" },
            { "lngPatiID": 23262, "lngVisitID": 1, "id": "R3K3967" },
            { "lngPatiID": 23325, "lngVisitID": 1, "id": "R3K7408" },
            { "lngPatiID": 23436, "lngVisitID": 1, "id": "R3K7879" },
            { "lngPatiID": 23471, "lngVisitID": 1, "id": "R3K3456" },
            { "lngPatiID": 23750, "lngVisitID": 1, "id": "R3K8149" },
            { "lngPatiID": 23754, "lngVisitID": 2, "id": "R3K8519" },
            { "lngPatiID": 23779, "lngVisitID": 1, "id": "R3K12923" },
            { "lngPatiID": 23808, "lngVisitID": 1, "id": "R3K2307" },
            { "lngPatiID": 23898, "lngVisitID": 1, "id": "R3K4405" },
            { "lngPatiID": 23898, "lngVisitID": 1, "id": "R3K4408" },
            { "lngPatiID": 23927, "lngVisitID": 1, "id": "R3K3137" },
            { "lngPatiID": 23927, "lngVisitID": 1, "id": "R3K4145" },
            { "lngPatiID": 24443, "lngVisitID": 1, "id": "R3K5100" },
            { "lngPatiID": 24615, "lngVisitID": 1, "id": "R3K6725" },
            { "lngPatiID": 24886, "lngVisitID": 2, "id": "R3K6429" },
            { "lngPatiID": 25490, "lngVisitID": 1, "id": "R3K7124" },
            { "lngPatiID": 25702, "lngVisitID": 1, "id": "R3K1826" },
            { "lngPatiID": 25732, "lngVisitID": 1, "id": "R3K6814" },
            { "lngPatiID": 25735, "lngVisitID": 1, "id": "R3K7424" },
            { "lngPatiID": 25755, "lngVisitID": 1, "id": "R3K7002" },
            { "lngPatiID": 25770, "lngVisitID": 1, "id": "R3K7130" },
            { "lngPatiID": 25872, "lngVisitID": 1, "id": "R3K3912" },
            { "lngPatiID": 26127, "lngVisitID": 1, "id": "R3K1896" },
            { "lngPatiID": 26135, "lngVisitID": 1, "id": "R3K6254" },
            { "lngPatiID": 26463, "lngVisitID": 1, "id": "R3K2311" },
            { "lngPatiID": 26513, "lngVisitID": 1, "id": "R3K3605" },
            { "lngPatiID": 26594, "lngVisitID": 1, "id": "R3K1834" },
            { "lngPatiID": 26876, "lngVisitID": 1, "id": "R3K2031" },
            { "lngPatiID": 27034, "lngVisitID": 1, "id": "R3K8543" },
            { "lngPatiID": 27034, "lngVisitID": 1, "id": "R3K9133" },
            { "lngPatiID": 27143, "lngVisitID": 1, "id": "R3K7778" },
            { "lngPatiID": 27369, "lngVisitID": 1, "id": "R3K5357" },
            { "lngPatiID": 27707, "lngVisitID": 1, "id": "R3K2067" },
            { "lngPatiID": 27975, "lngVisitID": 1, "id": "R3K2303" },
            { "lngPatiID": 28003, "lngVisitID": 1, "id": "R3K4698" },
            { "lngPatiID": 28064, "lngVisitID": 1, "id": "R3K4062" },
            { "lngPatiID": 28209, "lngVisitID": 1, "id": "R3K3397" },
            { "lngPatiID": 28291, "lngVisitID": 1, "id": "R3K2496" },
            { "lngPatiID": 28391, "lngVisitID": 1, "id": "R3K6397" },
            { "lngPatiID": 29049, "lngVisitID": 1, "id": "R3K2044" },
            { "lngPatiID": 29369, "lngVisitID": 1, "id": "R3K3959" },
            { "lngPatiID": 29383, "lngVisitID": 1, "id": "R3K2315" },
            { "lngPatiID": 29500, "lngVisitID": 1, "id": "R3K3574" },
            { "lngPatiID": 29532, "lngVisitID": 2, "id": "R3K4108" },
            { "lngPatiID": 29548, "lngVisitID": 1, "id": "R3K3839" },
            { "lngPatiID": 29774, "lngVisitID": 1, "id": "R3K4089" },
            { "lngPatiID": 29823, "lngVisitID": 1, "id": "R3K7237" },
            { "lngPatiID": 30431, "lngVisitID": 1, "id": "R3K2066" },
            { "lngPatiID": 30492, "lngVisitID": 1, "id": "R3K2027" },
            { "lngPatiID": 30602, "lngVisitID": 1, "id": "R3K8462" },
            { "lngPatiID": 30642, "lngVisitID": 1, "id": "R3K2075" },
            { "lngPatiID": 30659, "lngVisitID": 1, "id": "R3K5711" },
            { "lngPatiID": 30685, "lngVisitID": 1, "id": "R3K4830" },
            { "lngPatiID": 30688, "lngVisitID": 1, "id": "R3K4759" },
            { "lngPatiID": 30796, "lngVisitID": 1, "id": "R3K4721" },
            { "lngPatiID": 30841, "lngVisitID": 2, "id": "R3K4287" },
            { "lngPatiID": 31019, "lngVisitID": 1, "id": "R3K7908" },
            { "lngPatiID": 31334, "lngVisitID": 1, "id": "R3K7572" },
            { "lngPatiID": 31553, "lngVisitID": 1, "id": "R3K3022" },
            { "lngPatiID": 32653, "lngVisitID": 1, "id": "R3K2063" },
            { "lngPatiID": 33163, "lngVisitID": 1, "id": "R3K2095" },
            { "lngPatiID": 33663, "lngVisitID": 1, "id": "R3K3962" },
            { "lngPatiID": 33967, "lngVisitID": 1, "id": "R3K2273" },
            { "lngPatiID": 34519, "lngVisitID": 1, "id": "R3K2137" },
            { "lngPatiID": 34935, "lngVisitID": 1, "id": "R3K7198" },
            { "lngPatiID": 35111, "lngVisitID": 1, "id": "R3K2308" },
            { "lngPatiID": 35217, "lngVisitID": 1, "id": "R3K2281" },
            { "lngPatiID": 35250, "lngVisitID": 1, "id": "R3K4249" },
            { "lngPatiID": 36077, "lngVisitID": 1, "id": "R3K6328" },
            { "lngPatiID": 36266, "lngVisitID": 1, "id": "R3K2309" },
            { "lngPatiID": 36801, "lngVisitID": 1, "id": "R3K2386" },
            { "lngPatiID": 37023, "lngVisitID": 1, "id": "R3K2468" },
            { "lngPatiID": 37348, "lngVisitID": 1, "id": "R3K6664" },
            { "lngPatiID": 37627, "lngVisitID": 2, "id": "R3K6128" },
            { "lngPatiID": 37731, "lngVisitID": 1, "id": "R3K3742" },
            { "lngPatiID": 39175, "lngVisitID": 1, "id": "R3K6656" },
            { "lngPatiID": 39218, "lngVisitID": 1, "id": "R3K5008" },
            { "lngPatiID": 40113, "lngVisitID": 2, "id": "R3K5780" },
            { "lngPatiID": 41312, "lngVisitID": 1, "id": "R3K8581" },
            { "lngPatiID": 41641, "lngVisitID": 1, "id": "R3K2506" },
            { "lngPatiID": 41838, "lngVisitID": 1, "id": "R3K3055" },
            { "lngPatiID": 41838, "lngVisitID": 4, "id": "R3K8145" },
            { "lngPatiID": 41878, "lngVisitID": 1, "id": "R3K2664" },
            { "lngPatiID": 42065, "lngVisitID": 1, "id": "R3K2579" },
            { "lngPatiID": 42234, "lngVisitID": 1, "id": "R3K2706" },
            { "lngPatiID": 42450, "lngVisitID": 1, "id": "R3K7983" },
            { "lngPatiID": 42571, "lngVisitID": 1, "id": "R3K4924" },
            { "lngPatiID": 42814, "lngVisitID": 1, "id": "R3K7028" },
            { "lngPatiID": 42814, "lngVisitID": 1, "id": "R3K7027" },
            { "lngPatiID": 43078, "lngVisitID": 1, "id": "R3K7419" },
            { "lngPatiID": 43249, "lngVisitID": 1, "id": "R3K5029" },
            { "lngPatiID": 43537, "lngVisitID": 1, "id": "R3K2801" },
            { "lngPatiID": 44045, "lngVisitID": 1, "id": "R3K7152" },
            { "lngPatiID": 44117, "lngVisitID": 1, "id": "R3K7213" },
            { "lngPatiID": 44118, "lngVisitID": 1, "id": "R3K3018" },
            { "lngPatiID": 44165, "lngVisitID": 1, "id": "R3K2653" },
            { "lngPatiID": 44179, "lngVisitID": 1, "id": "R3K5105" },
            { "lngPatiID": 44292, "lngVisitID": 1, "id": "R3K6912" },
            { "lngPatiID": 45264, "lngVisitID": 1, "id": "R3K7878" },
            { "lngPatiID": 46666, "lngVisitID": 1, "id": "R3K2862" },
            { "lngPatiID": 46750, "lngVisitID": 1, "id": "R3K2735" },
            { "lngPatiID": 46899, "lngVisitID": 1, "id": "R3K3373" },
            { "lngPatiID": 47277, "lngVisitID": 1, "id": "R3K2785" },
            { "lngPatiID": 47770, "lngVisitID": 2, "id": "R3K5701" },
            { "lngPatiID": 47849, "lngVisitID": 1, "id": "R3K8093" },
            { "lngPatiID": 47920, "lngVisitID": 1, "id": "R3K2869" },
            { "lngPatiID": 48811, "lngVisitID": 1, "id": "R3K8147" },
            { "lngPatiID": 48869, "lngVisitID": 1, "id": "R3K3963" },
            { "lngPatiID": 49080, "lngVisitID": 1, "id": "R3K3060" },
            { "lngPatiID": 49187, "lngVisitID": 1, "id": "R3K5807" },
            { "lngPatiID": 49347, "lngVisitID": 1, "id": "R3K3124" },
            { "lngPatiID": 49590, "lngVisitID": 1, "id": "R3K7921" },
            { "lngPatiID": 49779, "lngVisitID": 1, "id": "R3K3040" },
            { "lngPatiID": 50033, "lngVisitID": 1, "id": "R3K3818" },
            { "lngPatiID": 50381, "lngVisitID": 1, "id": "R3K4572" },
            { "lngPatiID": 50951, "lngVisitID": 1, "id": "R3K3050" },
            { "lngPatiID": 51014, "lngVisitID": 1, "id": "R3K3630" },
            { "lngPatiID": 51222, "lngVisitID": 1, "id": "R3K7536" },
            { "lngPatiID": 51292, "lngVisitID": 1, "id": "R3K4706" },
            { "lngPatiID": 51752, "lngVisitID": 1, "id": "R3K3138" },
            { "lngPatiID": 51810, "lngVisitID": 1, "id": "R3K3141" },
            { "lngPatiID": 52013, "lngVisitID": 2, "id": "R3K7579" },
            { "lngPatiID": 52176, "lngVisitID": 1, "id": "R3K3127" },
            { "lngPatiID": 52177, "lngVisitID": 2, "id": "R3K5794" },
            { "lngPatiID": 52469, "lngVisitID": 1, "id": "R3K5713" },
            { "lngPatiID": 53191, "lngVisitID": 1, "id": "R3K3280" },
            { "lngPatiID": 53649, "lngVisitID": 1, "id": "R3K7652" },
            { "lngPatiID": 53746, "lngVisitID": 1, "id": "R3K3377" },
            { "lngPatiID": 53911, "lngVisitID": 1, "id": "R3K4411" },
            { "lngPatiID": 54501, "lngVisitID": 1, "id": "R3K3363" },
            { "lngPatiID": 54501, "lngVisitID": 1, "id": "R3K3966" },
            { "lngPatiID": 55020, "lngVisitID": 1, "id": "R3K3389" },
            { "lngPatiID": 55362, "lngVisitID": 1, "id": "R3K4654" },
            { "lngPatiID": 55405, "lngVisitID": 2, "id": "R3K7693" },
            { "lngPatiID": 55453, "lngVisitID": 1, "id": "R3K4942" },
            { "lngPatiID": 55589, "lngVisitID": 1, "id": "R3K3420" },
            { "lngPatiID": 55877, "lngVisitID": 1, "id": "R3K6078" },
            { "lngPatiID": 56550, "lngVisitID": 1, "id": "R3K3391" },
            { "lngPatiID": 56828, "lngVisitID": 1, "id": "R3K3392" },
            { "lngPatiID": 56874, "lngVisitID": 1, "id": "R3K4099" },
            { "lngPatiID": 57072, "lngVisitID": 1, "id": "R3K3395" },
            { "lngPatiID": 57295, "lngVisitID": 1, "id": "R3K4109" },
            { "lngPatiID": 58135, "lngVisitID": 1, "id": "R3K3469" },
            { "lngPatiID": 58258, "lngVisitID": 1, "id": "R3K3462" },
            { "lngPatiID": 58259, "lngVisitID": 1, "id": "R3K3441" },
            { "lngPatiID": 58705, "lngVisitID": 1, "id": "R3K3767" },
            { "lngPatiID": 58785, "lngVisitID": 1, "id": "R3K3589" },
            { "lngPatiID": 58785, "lngVisitID": 1, "id": "R3K3588" },
            { "lngPatiID": 58937, "lngVisitID": 1, "id": "R3K3632" },
            { "lngPatiID": 60263, "lngVisitID": 1, "id": "R3K3641" },
            { "lngPatiID": 60282, "lngVisitID": 1, "id": "R3K7783" },
            { "lngPatiID": 61082, "lngVisitID": 1, "id": "R3K3721" },
            { "lngPatiID": 61084, "lngVisitID": 1, "id": "R3K8628" },
            { "lngPatiID": 61550, "lngVisitID": 2, "id": "R3K6662" },
            { "lngPatiID": 61728, "lngVisitID": 1, "id": "R3K6156" },
            { "lngPatiID": 61918, "lngVisitID": 1, "id": "R3K3820" },
            { "lngPatiID": 62377, "lngVisitID": 1, "id": "R3K4722" },
            { "lngPatiID": 62407, "lngVisitID": 1, "id": "R3K4571" },
            { "lngPatiID": 62543, "lngVisitID": 1, "id": "R3K4935" },
            { "lngPatiID": 62920, "lngVisitID": 1, "id": "R3K3859" },
            { "lngPatiID": 63116, "lngVisitID": 1, "id": "R3K5033" },
            { "lngPatiID": 63289, "lngVisitID": 1, "id": "R3K7984" },
            { "lngPatiID": 63315, "lngVisitID": 1, "id": "R3K7444" },
            { "lngPatiID": 63315, "lngVisitID": 1, "id": "R3K7443" },
            { "lngPatiID": 63511, "lngVisitID": 1, "id": "R3K4825" },
            { "lngPatiID": 63996, "lngVisitID": 1, "id": "R3K6297" },
            { "lngPatiID": 64181, "lngVisitID": 1, "id": "R3K3841" },
            { "lngPatiID": 64597, "lngVisitID": 1, "id": "R3K3858" },
            { "lngPatiID": 65150, "lngVisitID": 1, "id": "R3K5137" },
            { "lngPatiID": 65571, "lngVisitID": 1, "id": "R3K4063" },
            { "lngPatiID": 65743, "lngVisitID": 1, "id": "R3K3960" },
            { "lngPatiID": 66055, "lngVisitID": 1, "id": "R3K4138" },
            { "lngPatiID": 66251, "lngVisitID": 1, "id": "R3K4844" },
            { "lngPatiID": 66325, "lngVisitID": 1, "id": "R3K8265" },
            { "lngPatiID": 66337, "lngVisitID": 1, "id": "R3K4064" },
            { "lngPatiID": 66351, "lngVisitID": 1, "id": "R3K5467" },
            { "lngPatiID": 66373, "lngVisitID": 1, "id": "R3K4263" },
            { "lngPatiID": 66496, "lngVisitID": 1, "id": "R3K4261" },
            { "lngPatiID": 66729, "lngVisitID": 2, "id": "R3K5989" },
            { "lngPatiID": 66748, "lngVisitID": 1, "id": "R3K4054" },
            { "lngPatiID": 67369, "lngVisitID": 1, "id": "R3K4887" },
            { "lngPatiID": 67913, "lngVisitID": 2, "id": "R3K4663" },
            { "lngPatiID": 67998, "lngVisitID": 1, "id": "R3K4889" },
            { "lngPatiID": 67998, "lngVisitID": 1, "id": "R3K4890" },
            { "lngPatiID": 68576, "lngVisitID": 1, "id": "R3K8990" },
            { "lngPatiID": 69169, "lngVisitID": 1, "id": "R3K6734" },
            { "lngPatiID": 69202, "lngVisitID": 1, "id": "R3K4149" },
            { "lngPatiID": 69487, "lngVisitID": 1, "id": "R3K8401" },
            { "lngPatiID": 69586, "lngVisitID": 1, "id": "R3K5042" },
            { "lngPatiID": 69799, "lngVisitID": 1, "id": "R3K8277" },
            { "lngPatiID": 69805, "lngVisitID": 1, "id": "R3K4348" },
            { "lngPatiID": 70112, "lngVisitID": 1, "id": "R3K4958" },
            { "lngPatiID": 70830, "lngVisitID": 1, "id": "R3K4311" },
            { "lngPatiID": 70892, "lngVisitID": 1, "id": "R3K5014" },
            { "lngPatiID": 72447, "lngVisitID": 1, "id": "R3K5031" },
            { "lngPatiID": 73309, "lngVisitID": 1, "id": "R3K4409" },
            { "lngPatiID": 73423, "lngVisitID": 1, "id": "R3K8993" },
            { "lngPatiID": 73425, "lngVisitID": 1, "id": "R3K5718" },
            { "lngPatiID": 73689, "lngVisitID": 1, "id": "R3K5195" },
            { "lngPatiID": 74903, "lngVisitID": 1, "id": "R3K4486" },
            { "lngPatiID": 74994, "lngVisitID": 1, "id": "R3K8384" },
            { "lngPatiID": 75073, "lngVisitID": 1, "id": "R3K4570" },
            { "lngPatiID": 75189, "lngVisitID": 1, "id": "R3K4565" },
            { "lngPatiID": 76428, "lngVisitID": 1, "id": "R3K4637" },
            { "lngPatiID": 76473, "lngVisitID": 1, "id": "R3K5012" },
            { "lngPatiID": 76529, "lngVisitID": 1, "id": "R3K5270" },
            { "lngPatiID": 77352, "lngVisitID": 1, "id": "R3K8233" },
            { "lngPatiID": 77410, "lngVisitID": 1, "id": "R3K6284" },
            { "lngPatiID": 77495, "lngVisitID": 1, "id": "R3K4634" },
            { "lngPatiID": 77663, "lngVisitID": 1, "id": "R3K7003" },
            { "lngPatiID": 78367, "lngVisitID": 1, "id": "R3K4720" },
            { "lngPatiID": 78519, "lngVisitID": 1, "id": "R3K4831" },
            { "lngPatiID": 78596, "lngVisitID": 1, "id": "R3K4699" },
            { "lngPatiID": 78905, "lngVisitID": 1, "id": "R3K7920" },
            { "lngPatiID": 79334, "lngVisitID": 1, "id": "R3K4767" },
            { "lngPatiID": 79406, "lngVisitID": 1, "id": "R3K4871" },
            { "lngPatiID": 79699, "lngVisitID": 1, "id": "R3K5003" },
            { "lngPatiID": 79867, "lngVisitID": 1, "id": "R3K6624" },
            { "lngPatiID": 79878, "lngVisitID": 1, "id": "R3K4784" },
            { "lngPatiID": 80834, "lngVisitID": 1, "id": "R3K4843" },
            { "lngPatiID": 81421, "lngVisitID": 1, "id": "R3K5256" },
            { "lngPatiID": 81627, "lngVisitID": 1, "id": "R3K10813" },
            { "lngPatiID": 81756, "lngVisitID": 1, "id": "R3K4950" },
            { "lngPatiID": 81806, "lngVisitID": 1, "id": "R3K4906" },
            { "lngPatiID": 82073, "lngVisitID": 1, "id": "R3K5051" },
            { "lngPatiID": 82897, "lngVisitID": 1, "id": "R3K5862" },
            { "lngPatiID": 82908, "lngVisitID": 1, "id": "R3K4946" },
            { "lngPatiID": 82921, "lngVisitID": 1, "id": "R3K5037" },
            { "lngPatiID": 84108, "lngVisitID": 1, "id": "R3K5093" },
            { "lngPatiID": 84204, "lngVisitID": 1, "id": "R3K4996" },
            { "lngPatiID": 84256, "lngVisitID": 1, "id": "R3K5001" },
            { "lngPatiID": 84441, "lngVisitID": 1, "id": "R3K5376" },
            { "lngPatiID": 84635, "lngVisitID": 1, "id": "R3K5081" },
            { "lngPatiID": 84678, "lngVisitID": 1, "id": "R3K5347" },
            { "lngPatiID": 84782, "lngVisitID": 1, "id": "R3K5069" },
            { "lngPatiID": 85210, "lngVisitID": 1, "id": "R3K5117" },
            { "lngPatiID": 86576, "lngVisitID": 2, "id": "R3K8383" },
            { "lngPatiID": 86715, "lngVisitID": 1, "id": "R3K5255" },
            { "lngPatiID": 86976, "lngVisitID": 1, "id": "R3K6461" },
            { "lngPatiID": 87091, "lngVisitID": 1, "id": "R3K5637" },
            { "lngPatiID": 87341, "lngVisitID": 1, "id": "R3K5308" },
            { "lngPatiID": 87847, "lngVisitID": 1, "id": "R3K5363" },
            { "lngPatiID": 88452, "lngVisitID": 1, "id": "R3K5562" },
            { "lngPatiID": 88452, "lngVisitID": 1, "id": "R3K5561" },
            { "lngPatiID": 88528, "lngVisitID": 1, "id": "R3K6072" },
            { "lngPatiID": 89639, "lngVisitID": 1, "id": "R3K5664" },
            { "lngPatiID": 89655, "lngVisitID": 1, "id": "R3K6084" },
            { "lngPatiID": 90007, "lngVisitID": 1, "id": "R3K6848" },
            { "lngPatiID": 90627, "lngVisitID": 1, "id": "R3K6094" },
            { "lngPatiID": 90706, "lngVisitID": 1, "id": "R3K5821" },
            { "lngPatiID": 91134, "lngVisitID": 1, "id": "R3K8662" },
            { "lngPatiID": 91337, "lngVisitID": 1, "id": "R3K7226" },
            { "lngPatiID": 91340, "lngVisitID": 1, "id": "R3K6640" },
            { "lngPatiID": 91452, "lngVisitID": 1, "id": "R3K6092" },
            { "lngPatiID": 91564, "lngVisitID": 1, "id": "R3K6841" },
            { "lngPatiID": 91999, "lngVisitID": 1, "id": "R3K5706" },
            { "lngPatiID": 92120, "lngVisitID": 1, "id": "R3K5715" },
            { "lngPatiID": 92267, "lngVisitID": 1, "id": "R3K6479" },
            { "lngPatiID": 92564, "lngVisitID": 1, "id": "R3K5823" },
            { "lngPatiID": 93524, "lngVisitID": 1, "id": "R3K7231" },
            { "lngPatiID": 94351, "lngVisitID": 1, "id": "R3K5988" },
            { "lngPatiID": 94590, "lngVisitID": 1, "id": "R3K5966" },
            { "lngPatiID": 95647, "lngVisitID": 1, "id": "R3K9136" },
            { "lngPatiID": 95734, "lngVisitID": 1, "id": "R3K9064" },
            { "lngPatiID": 96761, "lngVisitID": 1, "id": "R3K6061" },
            { "lngPatiID": 96761, "lngVisitID": 1, "id": "R3K6408" },
            { "lngPatiID": 98036, "lngVisitID": 1, "id": "R3K6258" },
            { "lngPatiID": 98329, "lngVisitID": 1, "id": "R3K6164" },
            { "lngPatiID": 98433, "lngVisitID": 1, "id": "R3K6148" },
            { "lngPatiID": 99269, "lngVisitID": 1, "id": "R3K7001" },
            { "lngPatiID": 99432, "lngVisitID": 1, "id": "R3K6185" },
            { "lngPatiID": 100158, "lngVisitID": 1, "id": "R3K7022" },
            { "lngPatiID": 100219, "lngVisitID": 1, "id": "R3K6384" },
            { "lngPatiID": 100536, "lngVisitID": 1, "id": "R3K6628" },
            { "lngPatiID": 101173, "lngVisitID": 1, "id": "R3K6410" },
            { "lngPatiID": 101303, "lngVisitID": 1, "id": "R3K6386" },
            { "lngPatiID": 101529, "lngVisitID": 1, "id": "R3K6383" },
            { "lngPatiID": 101543, "lngVisitID": 1, "id": "R3K6290" },
            { "lngPatiID": 101726, "lngVisitID": 1, "id": "R3K6361" },
            { "lngPatiID": 101920, "lngVisitID": 1, "id": "R3K7689" },
            { "lngPatiID": 103067, "lngVisitID": 1, "id": "R3K6414" },
            { "lngPatiID": 103503, "lngVisitID": 1, "id": "R3K6447" },
            { "lngPatiID": 103568, "lngVisitID": 1, "id": "R3K6767" },
            { "lngPatiID": 103568, "lngVisitID": 1, "id": "R3K6735" },
            { "lngPatiID": 103811, "lngVisitID": 1, "id": "R3K6630" },
            { "lngPatiID": 104189, "lngVisitID": 1, "id": "R3K6750" },
            { "lngPatiID": 104233, "lngVisitID": 1, "id": "R3K8826" },
            { "lngPatiID": 104369, "lngVisitID": 1, "id": "R3K6660" },
            { "lngPatiID": 105486, "lngVisitID": 1, "id": "R3K6916" },
            { "lngPatiID": 106212, "lngVisitID": 1, "id": "R3K7531" },
            { "lngPatiID": 107179, "lngVisitID": 1, "id": "R3K8709" },
            { "lngPatiID": 107293, "lngVisitID": 1, "id": "R3K7201" },
            { "lngPatiID": 108758, "lngVisitID": 1, "id": "R3K6907" },
            { "lngPatiID": 108780, "lngVisitID": 1, "id": "R3K9086" },
            { "lngPatiID": 109147, "lngVisitID": 1, "id": "R3K7161" },
            { "lngPatiID": 109658, "lngVisitID": 1, "id": "R3K6876" },
            { "lngPatiID": 109805, "lngVisitID": 1, "id": "R3K6908" },
            { "lngPatiID": 109992, "lngVisitID": 1, "id": "R3K8678" },
            { "lngPatiID": 110299, "lngVisitID": 1, "id": "R3K6911" },
            { "lngPatiID": 110372, "lngVisitID": 1, "id": "R3K7110" },
            { "lngPatiID": 110803, "lngVisitID": 1, "id": "R3K7964" },
            { "lngPatiID": 110803, "lngVisitID": 1, "id": "R3K7441" },
            { "lngPatiID": 111854, "lngVisitID": 1, "id": "R3K7029" },
            { "lngPatiID": 112632, "lngVisitID": 1, "id": "R3K8438" },
            { "lngPatiID": 114434, "lngVisitID": 1, "id": "R3K7197" },
            { "lngPatiID": 114463, "lngVisitID": 1, "id": "R3K7242" },
            { "lngPatiID": 114784, "lngVisitID": 1, "id": "R3K7225" },
            { "lngPatiID": 114808, "lngVisitID": 1, "id": "R3K7258" },
            { "lngPatiID": 115737, "lngVisitID": 1, "id": "R3K8817" },
            { "lngPatiID": 116023, "lngVisitID": 1, "id": "R3K7770" },
            { "lngPatiID": 116122, "lngVisitID": 1, "id": "R3K8126" },
            { "lngPatiID": 117108, "lngVisitID": 1, "id": "R3K8355" },
            { "lngPatiID": 117710, "lngVisitID": 1, "id": "R3K9139" },
            { "lngPatiID": 117958, "lngVisitID": 1, "id": "R3K8142" },
            { "lngPatiID": 118007, "lngVisitID": 1, "id": "R3K9141" },
            { "lngPatiID": 119214, "lngVisitID": 1, "id": "R3K9146" },
            { "lngPatiID": 119214, "lngVisitID": 1, "id": "R3K9147" },
            { "lngPatiID": 119900, "lngVisitID": 1, "id": "R3K7833" },
            { "lngPatiID": 120466, "lngVisitID": 1, "id": "R3K8285" },
            { "lngPatiID": 120987, "lngVisitID": 1, "id": "R3K12713" },
            { "lngPatiID": 122323, "lngVisitID": 1, "id": "R3K7831" },
            { "lngPatiID": 122567, "lngVisitID": 1, "id": "R3K7965" },
            { "lngPatiID": 122630, "lngVisitID": 1, "id": "R3K8442" },
            { "lngPatiID": 124382, "lngVisitID": 1, "id": "R3K7946" },
            { "lngPatiID": 124398, "lngVisitID": 1, "id": "R3K7937" },
            { "lngPatiID": 124436, "lngVisitID": 1, "id": "R3K7968" },
            { "lngPatiID": 124875, "lngVisitID": 1, "id": "R3K8134" },
            { "lngPatiID": 124885, "lngVisitID": 1, "id": "R3K8664" },
            { "lngPatiID": 125267, "lngVisitID": 1, "id": "R3K8521" },
            { "lngPatiID": 125468, "lngVisitID": 1, "id": "R3K8595" },
            { "lngPatiID": 125658, "lngVisitID": 1, "id": "R3K8161" },
            { "lngPatiID": 125768, "lngVisitID": 1, "id": "R3K9091" },
            { "lngPatiID": 125768, "lngVisitID": 1, "id": "R3K9087" },
            { "lngPatiID": 125768, "lngVisitID": 1, "id": "R3K9092" },
            { "lngPatiID": 125948, "lngVisitID": 1, "id": "R3K9137" },
            { "lngPatiID": 125955, "lngVisitID": 1, "id": "R3K9145" },
            { "lngPatiID": 126235, "lngVisitID": 1, "id": "R3K8146" },
            { "lngPatiID": 126559, "lngVisitID": 1, "id": "R3K8278" },
            { "lngPatiID": 126609, "lngVisitID": 1, "id": "R3K8230" },
            { "lngPatiID": 127510, "lngVisitID": 1, "id": "R3K8838" },
            { "lngPatiID": 127927, "lngVisitID": 1, "id": "R3K8682" },
            { "lngPatiID": 128536, "lngVisitID": 1, "id": "R3K8345" },
            { "lngPatiID": 129016, "lngVisitID": 1, "id": "R3K8356" },
            { "lngPatiID": 129742, "lngVisitID": 1, "id": "R3K8382" },
            { "lngPatiID": 129887, "lngVisitID": 1, "id": "R3K8370" },
            { "lngPatiID": 130219, "lngVisitID": 1, "id": "R3K8488" },
            { "lngPatiID": 131286, "lngVisitID": 1, "id": "R3K9144" },
            { "lngPatiID": 131399, "lngVisitID": 1, "id": "R3K8637" },
            { "lngPatiID": 131778, "lngVisitID": 1, "id": "R3K8499" },
            { "lngPatiID": 131846, "lngVisitID": 1, "id": "R3K8518" },
            { "lngPatiID": 131887, "lngVisitID": 1, "id": "R3K9135" },
            { "lngPatiID": 133370, "lngVisitID": 1, "id": "R3K8657" },
            { "lngPatiID": 134085, "lngVisitID": 1, "id": "R3K9056" },
            { "lngPatiID": 134424, "lngVisitID": 1, "id": "R3K8696" },
            { "lngPatiID": 134432, "lngVisitID": 1, "id": "R3K8702" },
            { "lngPatiID": 134815, "lngVisitID": 1, "id": "R3K8967" },
            { "lngPatiID": 134829, "lngVisitID": 1, "id": "R3K9140" },
            { "lngPatiID": 134944, "lngVisitID": 1, "id": "R3K8998" },
            { "lngPatiID": 134987, "lngVisitID": 1, "id": "R3K9113" },
            { "lngPatiID": 135006, "lngVisitID": 1, "id": "R3K9143" },
            { "lngPatiID": 135695, "lngVisitID": 1, "id": "R3K8995" },
            { "lngPatiID": 136149, "lngVisitID": 1, "id": "R3K9001" },
            { "lngPatiID": 136441, "lngVisitID": 1, "id": "R3K8852" },
            { "lngPatiID": 136631, "lngVisitID": 1, "id": "R3K8987" },
            { "lngPatiID": 136671, "lngVisitID": 1, "id": "R3K9142" },
            { "lngPatiID": 137236, "lngVisitID": 1, "id": "R3K9069" },
            { "lngPatiID": 137616, "lngVisitID": 1, "id": "R3K9138" },
            { "lngPatiID": 149720, "lngVisitID": 1, "id": "R3K10880" },
            { "lngPatiID": 149720, "lngVisitID": 1, "id": "R3K10877" },
            { "lngPatiID": 159115, "lngVisitID": 1, "id": "R3K12915" },
            { "lngPatiID": 159115, "lngVisitID": 1, "id": "R3K12917" },
            { "lngPatiID": 159115, "lngVisitID": 1, "id": "R3K12916" },
            { "lngPatiID": 159278, "lngVisitID": 1, "id": "R3K10807" },
            { "lngPatiID": 159424, "lngVisitID": 1, "id": "R3K12897" },
            { "lngPatiID": 159424, "lngVisitID": 1, "id": "R3K12976" },
            { "lngPatiID": 159424, "lngVisitID": 1, "id": "R3K12830" },
            { "lngPatiID": 159424, "lngVisitID": 1, "id": "R3K12901" },
            { "lngPatiID": 159424, "lngVisitID": 1, "id": "R3K12792" },
            { "lngPatiID": 159424, "lngVisitID": 1, "id": "R3K12832" },
            { "lngPatiID": 159424, "lngVisitID": 1, "id": "R3K12831" },
            { "lngPatiID": 159424, "lngVisitID": 1, "id": "R3K12899" },
            { "lngPatiID": 159424, "lngVisitID": 1, "id": "R3K12975" },
            { "lngPatiID": 159741, "lngVisitID": 1, "id": "R3K12979" },
            { "lngPatiID": 159741, "lngVisitID": 1, "id": "R3K12938" },
            { "lngPatiID": 188526, "lngVisitID": 1, "id": "R3K13155" },
            { "lngPatiID": 188526, "lngVisitID": 1, "id": "R3K13154" }
        ]

        lstData.forEach(function (item) {
            let strUrl = "http://192.168.56.1:8059/api/cis/PrintDocument?para=" + JSON.stringify(item);

            let data = zlGet(`/api/BaseApi/PDFPrintDocument?para=` + JSON.stringify(item));

            //let data = zlGetMyWeb(strUrl);
        });
        

    }

})(window, $);

////执行结果，3月份的  罗安泽 没有这个人
////图片文件的后缀名，改成 jpg
////2-3-4-5-6-7-8-10-11-12  剩1月了