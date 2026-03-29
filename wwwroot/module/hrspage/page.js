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
