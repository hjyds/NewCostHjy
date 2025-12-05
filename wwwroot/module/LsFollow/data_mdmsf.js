////https://cqapi.cfkfz.com:28009/admin/storage/createImg
var createImg_out = {
    "errno": 0,
    "data": {
        "id": 71153,
        "key": "wawdhl7kd536vpr15o3z.jpg",
        "name": "周成禄_hjy.jpg",
        "type": "image/jpeg",
        "size": 2031120,
        "url": "https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/wawdhl7kd536vpr15o3z.jpg",
        "addTime": "2024-12-23 19:03:01",
        "updateTime": "2024-12-23 19:03:01",
        "deleted": null
    },
    "errmsg": "成功"
};

createImg_out = {
    "errno": 0,
    "data": {
        "id": 71195,
        "key": "4ub8nhvyhjbl0fcfg7uo.jpg",
        "name": "周成禄_hjy.jpg",
        "type": "image/jpeg",
        "size": 2031120,
        "url": "https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/4ub8nhvyhjbl0fcfg7uo.jpg",
        "addTime": "2024-12-23 21:26:08",
        "updateTime": "2024-12-23 21:26:08",
        "deleted": null
    },
    "errmsg": "成功"
}

////https://cqapi.cfkfz.com:28009/admin/user/formsList?modelAndIdCard=5002010123
///GET
var userCodeData = {
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
}

////https://cqapi.cfkfz.com:28009/admin/follow/add
var add_par = {
    "hasMobility": 0,
    "hasAppetite": 0,
    "mobility": "",
    "siteName": "重庆市永川区来苏镇尘肺病康复站",
    "userCode": "5002010123",
    "storageList": [
        "{\"name\":\"周成禄_hjy.jpg\",\"key\":\"4ub8nhvyhjbl0fcfg7uo.jpg\",\"url\":\"https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/4ub8nhvyhjbl0fcfg7uo.jpg\"}"
    ],
    "doctorName": [
        "龙注伊"
    ],
    "smokingString": "",
    "id": 148793,
    "hasSleeping": 0,
    "hasSelfEvaluation": 0,
    "address": "11111",
    "hasOccupation": 0,
    "followType": 2,
    "diagnoseResult": "煤工尘肺  一期",
    "mobile": "15808068511",
    "hasRehabilitation": 1,
    "hasHospitalized": 0,
    "updateTime": "2024-02-23 10:34:50",
    "suggest": "1",
    "homeRehabilitationString": "1234",
    "userId": 77603,
    "hasSmoking": 0,
    "demand": "1",
    "hasHomeRehabilitation": 1,
    "realname": "蒋中树",
    "hasWeight": 0,
    "followTime": "2024年02月23日",
    "rehabilitationNum": 24,
    "hospitalizedString": "",
    "hasSatisfaction": 0,
    "createTime": "2024-12-23 21:25:48",
    "hasPsychology": 1,
    "tenantId": 1,
    "idCardNum": "510229195305246535",
    "psychologyString": "341234",
    "rehabilitationString": "1",
    "hasVaccinate": 0,
    "vaccinateString": "",
    "occupationString": "",
    "index": 1,
    "weight": "",
    "appetite": "",
    "siteId": 201
}

var out_put = {
    "errno": 0,
    "data": {
        "id": 267065,
        "userId": 77603,
        "rehabilitationNum": 24,
        "doctorName": [
            "龙注伊"
        ],
        "hasWeight": 0,
        "hasAppetite": "0",
        "hasSleeping": 0,
        "mobility": "",
        "hasHospitalized": 0,
        "hospitalizedString": "",
        "hasVaccinate": 0,
        "vaccinateString": "",
        "hasSmoking": 0,
        "smokingString": "",
        "hasOccupation": 0,
        "occupationString": "",
        "demand": "1",
        "suggest": "1",
        "createTime": "2024-12-23 21:25:48",
        "updateTime": "2024-12-23 21:27:58",
        "siteId": 201,
        "deleted": null,
        "hasRehabilitation": 1,
        "rehabilitationString": "1",
        "hasSelfEvaluation": 0,
        "hasSatisfaction": 0,
        "hasPsychology": 1,
        "psychologyString": "341234",
        "hasHomeRehabilitation": 1,
        "homeRehabilitationString": "1234",
        "tenantId": 1,
        "storageList": [
            "{\"name\":\"周成禄_hjy.jpg\",\"key\":\"4ub8nhvyhjbl0fcfg7uo.jpg\",\"url\":\"https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/4ub8nhvyhjbl0fcfg7uo.jpg\"}"
        ],
        "followType": 2,
        "hasMobility": 0,
        "address": "11111"
    },
    "errmsg": "成功"
}

////https://cqapi.cfkfz.com:28009/admin/follow/update
var update_par = {
    "id": 235251,
    "userId": 77512,
    "rehabilitationNum": null,
    "doctorName": [
        "龙注伊"
    ],
    "mobility": "",
    "hasHospitalized": 0,
    "followType": 2,
    "hasMobility": 1,
    "hospitalizedString": "",
    "hasVaccinate": 0,
    "vaccinateString": "",
    "hasSmoking": 0,
    "smokingString": "",
    "hasOccupation": 0,
    "hasPsychology": 1,
    "psychologyString": "身心放松",
    "hasHomeRehabilitation": 1,
    "homeRehabilitationString": "慢走",
    "occupationString": "",
    "demand": "建议发放止咳化痰药物",
    "suggest": "接痉平喘治疗",
    "hasWeight": 0,
    "address": "来苏镇尘肺康复站",
    "hasAppetite": 2,
    "hasSleeping": 2,
    "hasRehabilitation": 0,
    "hasSelfEvaluation": 1,
    "hasSatisfaction": 1,
    "rehabilitationString": null,
    "storageList": [
        "{\"name\":\"周成禄.jpg\",\"key\":\"jnqxh5zcxcynsxftx5oy.jpg\",\"url\":\"https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/jnqxh5zcxcynsxftx5oy.jpg\"}",
        "{\"name\":\"周成禄_hjy.jpg\",\"key\":\"wawdhl7kd536vpr15o3z.jpg\",\"url\":\"https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/wawdhl7kd536vpr15o3z.jpg\"}"
    ]
}

var delete_par = {
    "id": 267065,
    "deleted": 1
}



