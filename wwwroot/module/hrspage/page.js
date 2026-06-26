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