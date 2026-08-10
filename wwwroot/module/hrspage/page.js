function sendMsgToVb(action) {
    if (action === 'confirm') {
        layer.msg('确定按钮被点击', { icon: 1 });
        console.log('sendMsgToVb: confirm');
    } else if (action === 'cancel') {
        layer.msg('取消按钮被点击', { icon: 2 });
        console.log('sendMsgToVb: cancel');
    }
    const data = {
        SourceSystem: "HRS",
        Func: "关闭界面"
    };

    AioSendDataToVb(data);
}

$(document).ready(function() {
    $('#issueTable').bootstrapTable({
        pagination: true,
        pageSize: 10,
        pageList: [10, 25, 50, 100],
        search: true,
        showColumns: true,
        showExport: true,
        sortable: true
    });
});

function refreshData() {
    layer.msg('正在刷新数据...', { icon: 16, time: 1000 });
    setTimeout(function() {
        location.reload();
    }, 1000);
}

function exportData() {
    layer.msg('正在导出数据...', { icon: 16, time: 2000 });
    $('#issueTable').tableExport({
        type: 'excel',
        escape: false
    });
}

function showTokenInfo() {
    var token = $('#tokenValue').val();
    if (token) {
        layer.open({
            type: 1,
            title: 'Token信息',
            area: ['600px', '300px'],
            content: '<div style="padding: 20px;"><pre style="white-space: pre-wrap; word-wrap: break-word;">' + token + '</pre></div>'
        });
    } else {
        layer.msg('Token信息为空', { icon: 2 });
    }
}

function AioSendDataToVb(dataIn) {
    let command = {
        MsgType: "aio",
        Action: "postmessage",
        Pars: dataIn
    }
    try {
        window.aioExtend(command);
    } catch (err) {
        return;
    }
    
}

var appsetings =

{
    "platformBase": {  //平台地址基本信息
        "apiUrl": "http://192.168.31.226:13100/instance/publish/rmip/HIPMessageServer", //平台api地址
        "appId": "4edd87c8-890a-478f-b615-06af6c5538e0",                                //应用id
        "secretKey": "BzRsoJGGxptFHDOg/338u3ULT+KddqZyqaZ1IRIhChV5CaKDmzMpFhHWYGyvaGfw" //应用密钥
    },
    "regionImageBiz": { //影像业务配置
        "enable": 1,    //是否启用影像业务 0/1
        "allowedPACSItems": "22,134,33,134"  //检查诊疗项目id逗号拼串，不能为空
    },
    "transferBiz": {                //转诊业务配置
        "enable": 1,                //是否启用转诊业务 0/1
        "receiveMode": {            //接收模式配置
            "centralReceive": 1,    //集中接收模式 0/1
            "windowReceive": 1      //窗口接收模式 0/1
        }
    },
    "regionEmrBrowser": {           //区域电子病历浏览器配置
        "enable": 1                 //是否启用区域电子病历浏览器 0/1
    }
}


/**在当前脚本中需要遵循以下调用规范
 *
 * 关于对象的访问说明：
 *     1.脚本中可使用page对象进行页面元素访问；
 *     2.脚本中使用“ _组件名称 ” 前缀可直接操作指定组件的属性或方法，如 _列表1.Name;
 *     3.如需要根据视图的展现名称访问组件，可使用page.pageContent.GetComponents方法查询组件；
 *     4.page.pageContent.ComponentList包含了界面组件的所有实例对象
 * 关于事件的说明：
 *     1.page提供了onComponentLoaded事件和onLoaded事件供自定义扩展使用；
 *     2.page.onComponentLoaded 在页面内所有组件完成初始化后触发
 *     3.page.onLoaded 在所有组件加载和页面内容载入完成后触发
 *
 */

// 查询参数
let theParts = {
    医保病人: null,
    时间范围: null,
    开始日期: null,
    结束日期: null,
    时间类型: null,
    页卡对象: null
}

const 界面图形 = [
    {
        "名称": "科室资源消耗",
        "类型": 0,
        "对象": null,
        "资源": "efc09263-e5d1-4373-b522-23403ef05e73",
        "视图": "ec031538-9463-46e6-8cbc-c53951937a18",
        "params": {
            "开始日期": "65dc88e6-bda7-49a9-87c3-b0e86c203f46",
            "结束日期": "bfd6f17c-d8fb-4640-b776-acdbb5534cc9",
            "是否医保": "a1b4aa6b-0691-4c11-9879-3b2c5780b455",
            "时间类型": "28449438-b617-420d-9d2f-7e23863c8a66"
        }
    },
    {
        "名称": "次均权重结余",
        "类型": 0,
        "对象": null,
        "资源": "efc09263-e5d1-4373-b522-23403ef05e73",
        "视图": "3e193e6a-296a-4649-87ba-294e7abdb4a6",
        "params": {
            "开始日期": "65dc88e6-bda7-49a9-87c3-b0e86c203f46",
            "结束日期": "bfd6f17c-d8fb-4640-b776-acdbb5534cc9",
            "是否医保": "a1b4aa6b-0691-4c11-9879-3b2c5780b455",
            "时间类型": "28449438-b617-420d-9d2f-7e23863c8a66"
        }
    },
    {
        "名称": "消耗指数偏高警示科室",
        "类型": 1,
        "对象": null,
        "资源": "efc09263-e5d1-4373-b522-23403ef05e73",
        "视图": "22e2e093-428a-4f2b-bd1a-ca48908e9548",
        "params": {
            "开始日期": "65dc88e6-bda7-49a9-87c3-b0e86c203f46",
            "结束日期": "bfd6f17c-d8fb-4640-b776-acdbb5534cc9",
            "是否医保": "a1b4aa6b-0691-4c11-9879-3b2c5780b455",
            "时间类型": "28449438-b617-420d-9d2f-7e23863c8a66"
        }
    },
    {
        "名称": "科室分析列表",
        "类型": 1,
        "对象": null,
        "资源": "efc09263-e5d1-4373-b522-23403ef05e73",
        "视图": "a5a2d89f-68ba-466e-ad6a-02387a892fe1",
        "params": {
            "开始日期": "65dc88e6-bda7-49a9-87c3-b0e86c203f46",
            "结束日期": "bfd6f17c-d8fb-4640-b776-acdbb5534cc9",
            "是否医保": "a1b4aa6b-0691-4c11-9879-3b2c5780b455",
            "时间类型": "28449438-b617-420d-9d2f-7e23863c8a66"
        }
    },
    {
        "名称": "医生分析列表",
        "类型": 1,
        "对象": null,
        "资源": "def6c840-dad3-4a09-8810-a7cfdb83b5e9",
        "视图": "c124c39a-4e1c-418e-b4c2-c99a9c724b66",
        "params": {
            "开始日期": "782af4da-6a9e-417e-8803-e9bdbe4a0e1c",
            "结束日期": "7d9db2bc-4019-4c24-b8a6-1fe7e7bb8e32",
            "是否医保": "93601721-dd46-4b06-85cb-95edd7194f55",
            "时间类型": "00cd0c56-6b77-4ed1-8ebf-518c4dd73adf"
        }
    },
    {
        "名称": "科室次均权重结余分析列表",
        "类型": 1,
        "对象": null,
        "资源": "efc09263-e5d1-4373-b522-23403ef05e73",
        "视图": "8921a909-00b9-46bf-9eb8-5f007114d03d",
        "params": {
            "开始日期": "65dc88e6-bda7-49a9-87c3-b0e86c203f46",
            "结束日期": "bfd6f17c-d8fb-4640-b776-acdbb5534cc9",
            "是否医保": "a1b4aa6b-0691-4c11-9879-3b2c5780b455",
            "时间类型": "28449438-b617-420d-9d2f-7e23863c8a66"
        }
    }
]


/**
 * 组件加载完成事件处理
 * @param {PageContent} pageContent
*/
page.onComponentLoaded = (pageContent) => {

}

/**
 * 页面载入完成事件处理
 * @param {PageContent} pageContent
*/
page.onLoaded = (pageContent) => {
    debugger
    theParts.是否医保 = document.getElementById('93aa82ae-b5f8-4d4c-b133-a838068014b7');
    theParts.时间范围 = document.getElementById('046f7fa7-cdfc-448c-8b04-50c8c8bf813f');
    theParts.开始日期 = document.getElementById('ba856d59-6f63-47e2-ac7d-fd5207d720f3');
    theParts.结束日期 = document.getElementById('b58deeea-a224-42fb-a1d3-34c24ddd0496');
    theParts.时间类型 = document.getElementById('74dc04ce-0721-4735-ba64-96ff3eaee37b');

    界面图形.forEach(item => {
        if (item["类型"] == 0) {
            item["对象"] = pageContent.GetComponents(item["名称"])[0].component.firstChild;
        }
        else {
            item["对象"] = pageContent.GetComponents(item["名称"])[0].component;
        }
    });

    if (theParts.时间范围 == null) return;
    //参数变更事件
    theParts.时间范围.onchange = function () {
        let 当前日期 = HrsDate.当前日期;
        if (theParts.时间范围.value == "本年") {
            theParts.开始日期.value = 当前日期.substr(0, 4)
            theParts.结束日期.value = 当前日期;
        }
        else if (theParts.时间范围.value == "半年") {
            theParts.开始日期.value = 当前日期.substr(0, 4)
            theParts.结束日期.value = 当前日期.substr(0, 4) + "-6-30"
        }
        else if (theParts.时间范围.value == "本季") {
            theParts.开始日期.value = getCurrentQuarterFirstDay()
            theParts.结束日期.value = 当前日期;
        }
        else if (theParts.时间范围.value == "本月") {
            theParts.开始日期.value = 当前日期.substr(0, 7)
            theParts.结束日期.value = 当前日期;
        }
        ViewChange();
    };
    theParts.开始日期.onchange = function () {
        if (isValidDateTime(theParts.开始日期.value)) {
            ViewChange();
        }
    };
    theParts.结束日期.onchange = function () {
        if (isValidDateTime(theParts.结束日期.value)) {
            ViewChange();
        }
    };
    theParts.是否医保.onchange = function () {
        ViewChange();
    };
    theParts.时间类型.onchange = function () {
        ViewChange();
    };

    // 页面数据初始化
    SetParam();
    ViewChange();
}


function isValidDateTime(dateTimeStr) {
    // 创建日期对象
    const date = new Date(dateTimeStr);

    // 验证日期有效性且字符串与日期解析结果一致
    return !isNaN(date.getTime()) &&
        date.toISOString().slice(0, dateTimeStr.length) === dateTimeStr;
}

function getCurrentQuarterFirstDay() {
    // 获取当前日期
    const today = new Date();
    // 获取当前月份（0-11）
    const currentMonth = today.getMonth();

    // 计算当前季度的起始月份（0, 3, 6, 9）
    let quarterStartMonth;
    if (currentMonth < 3) {
        quarterStartMonth = 0; // 第一季度 (1-3月)
    } else if (currentMonth < 6) {
        quarterStartMonth = 3; // 第二季度 (4-6月)
    } else if (currentMonth < 9) {
        quarterStartMonth = 6; // 第三季度 (7-9月)
    } else {
        quarterStartMonth = 9; // 第四季度 (10-12月)
    }

    // 创建季度第一天的日期对象（年、季度起始月、1日）
    const firstDayOfQuarter = new Date(
        today.getFullYear(),
        quarterStartMonth,
        1
    );

    return firstDayOfQuarter;
}

// 查询参数改变后，触发该方法
function ViewChange() {
    debugger
    //设置界面各参数的公共联动
    localStorage.setItem('开始日期', theParts.开始日期.value);
    localStorage.setItem('结束日期', theParts.结束日期.value);
    localStorage.setItem('是否医保', theParts.是否医保.value);
    localStorage.setItem('时间范围', theParts.时间范围.value);
    localStorage.setItem('时间类型', theParts.时间类型.value);

    let input = {
        "resTypeId": "b3766938-51ff-4dbd-8299-0d575d0a17c6", "viewId": "43eb69d5-ec4b-4b3b-9081-ad25a9fcf8ea", "row": 0, "source": "资源类型",
        "matching": [
            // { "relId": "8e468d0f-46c3-4e00-a787-abdc0009bc47", "compare": "=", "val": theParts.医保病人.value },
        ]
    };

    //循环界面对象取数据
    for (let i = 0; i < 界面图形.length; i++) {
        let theItem = 界面图形[i];
        input["resTypeId"] = theItem["资源"];
        input["viewId"] = theItem["视图"];

        input["matching"] = [];
        let keys = Object.keys(theItem.params);
        keys.forEach((key, index) => {
            let item = {
                relId: theItem.params[key],
                compare: "=",
                val: theParts[key].value,
            }
            input["matching"].push(item);
        })
        let ret = HrsServer.Post("/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId", JSON.stringify(input));
        if (ret.Success) {
            theItem["对象"].data = ret.Data;
        }
    }
}

//初始化筛选条件
function SetParam() {
    if (localStorage.getItem('开始日期') != "" && localStorage.getItem('开始日期') != null && localStorage.getItem('开始日期') != undefined) {
        theParts.开始日期.value = localStorage.getItem('开始日期');
        theParts.结束日期.value = localStorage.getItem('结束日期');
        theParts.是否医保.value = localStorage.getItem('是否医保');
        theParts.时间范围.value = localStorage.getItem('时间范围');
        theParts.时间类型.value = localStorage.getItem('时间类型');
    }
}

function get查找(keyword) {
    var data = HrsServer.Get("/api/DirectoryTree/GetCircleTreeViewAndData");
    var lstRes = data.Data.Data;
    const result = lstRes.filter(item => item.detail_name.includes(keyword));

    let res = result.map(item => {
        return {
            id: item.resource_detail_id,
            "名称": item.detail_name
        }
    })
    console.log(res);
}

/**
 * 查找视图
 * @param {any} strRName    资源名称
 * @param {any} strVName    视图名称
 */
function get查找视图(strRName, strVName) {
    var data = HrsServer.Get("/api/DirectoryTree/GetCircleTreeViewAndData");
    var lstRes = data.Data.Data;
    var result = lstRes;
    if (strRName) {
        result = lstRes.filter(item => item.detail_name.includes(strRName));
    }
    if (result.length > 0) {
        result.map(item => {
            let res_id = item.resource_detail_id;
            let vlst = GetAllViewByResId(res_id);

            let vOutlst = vlst.filter(t => t.detail_name.includes(strVName));

            if (vOutlst.length > 0) {
                console.log({
                    id: item.resource_detail_id,
                    "名称": item.detail_name
                });
            }

        })
    }
}

function GetAllViewByResId(res_id) {

    var params = {
        "resTypeId": "c8dc4683-4733-965b-1a34-c0851c336843",
        "viewId": "f2520851-9884-4386-a073-12e83f0959d3",
        "row": 0,
        "source": "资源类型",
        "matching": [
            {
                "relId": "dfa5a35e-e439-021e-b067-a810969ad86b",
                "compare": "=",
                "val": res_id
            }
        ]
    }

    const result = HrsServer.Post(
        "/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId",
        JSON.stringify(params)
    );
    debugger
    return result.Data;
}