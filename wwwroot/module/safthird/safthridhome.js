// 护理信息系统页面逻辑
$(document).ready(function() {
    // 获取URL参数
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }
    
    // 初始化页面
    function initPage() {
        // 获取Type参数
        var type = getUrlParameter('Type');
        
        // 根据Type参数设置页面标题和描述
        var pageTitle = "护理信息页面";
        var typeDescription = "未知类型";
        var typeFunction = "";
        
        switch (type) {
            case "1":
                pageTitle = "体温单";
                typeDescription = "体温单记录";
                typeFunction = "<div class=\"alert alert-info\"><h5>体温单功能</h5><p>在此区域可以查看和记录患者的体温数据。</p></div>";
                break;
            case "2":
                pageTitle = "护理记录";
                typeDescription = "护理记录管理";
                typeFunction = "<div class=\"alert alert-info\"><h5>护理记录功能</h5><p>在此区域可以查看和记录患者的护理信息。</p></div>";
                break;
            case "3":
                pageTitle = "评分评估";
                typeDescription = "病人评分评估（病人id、主页id）";
                typeFunction = "<div class=\"alert alert-info\"><h5>评分评估功能</h5><p>在此区域可以对患者进行评分评估。</p></div>";
                break;
            case "4":
                pageTitle = "血糖管理";
                typeDescription = "血糖监测记录";
                typeFunction = "<div class=\"alert alert-info\"><h5>血糖管理功能</h5><p>在此区域可以查看和记录患者的血糖数据。</p></div>";
                break;
            case "5":
                pageTitle = "出入量记录";
                typeDescription = "患者出入量管理";
                typeFunction = "<div class=\"alert alert-info\"><h5>出入量记录功能</h5><p>在此区域可以记录患者的出入量数据。</p></div>";
                break;
            case "6":
                pageTitle = "集中打印";
                typeDescription = "护理文档集中打印";
                typeFunction = "<div class=\"alert alert-info\"><h5>集中打印功能</h5><p>在此区域可以集中打印护理文档。</p></div>";
                break;
            default:
                typeFunction = "<div class=\"alert alert-warning\"><h5>未知类型</h5><p>请检查Type参数是否正确。</p></div>";
                break;
        }
        
        // 更新页面标题和描述
        document.title = pageTitle + " - 护理信息系统";
        $('.card-title').text(pageTitle);
        $('.card-text').text(typeDescription);
        
        // 更新功能区域
        $('#function-area').html(typeFunction);
        
        // 填充参数表格
        fillParameterTable();
    }
    
    // 填充参数表格
    function fillParameterTable() {
        var parameters = [
            { name: "患者ID (Pid)", value: getUrlParameter('Pid') },
            { name: "患者就诊ID (Pvid)", value: getUrlParameter('Pvid') },
            { name: "婴儿标志 (Baby)", value: getUrlParameter('Baby') },
            { name: "打开模式 (openMode)", value: getUrlParameter('openMode') },
            { name: "加密模式 (PriEncryMode)", value: getUrlParameter('PriEncryMode') },
            { name: "医院名称", value: getUrlParameter('医院名称') },
            { name: "科室名称", value: getUrlParameter('科室名称') },
            { name: "用户名", value: getUrlParameter('用户名') },
            { name: "操作员", value: getUrlParameter('操作员') },
            { name: "站点名称", value: getUrlParameter('站点名称') },
            { name: "Token", value: getUrlParameter('Token') },
            { name: "类型 (Type)", value: getUrlParameter('Type') }
        ];
        
        var tableBody = $('#parameter-table tbody');
        tableBody.empty();
        
        parameters.forEach(function(param) {
            var row = '<tr><td>' + param.name + '</td><td>' + (param.value || '') + '</td></tr>';
            tableBody.append(row);
        });
    }
    
    // 初始化页面
    initPage();
});