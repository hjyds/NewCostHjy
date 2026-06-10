
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

window.fun刷新诊疗明细列表 = function () {
    let input = {
        "resTypeId": "eb6a31b5-0f08-41ca-8725-8c16a9389e71",
        "viewId": "a56fbe4b-3aa5-494b-a6d9-ae0e1710b3ec",
        "row": 0,
        "source": "资源类型",
        "matching": [
            {
                "relId": "2e8f2ab5-4b46-4533-b78e-a84a409472da",
                "compare": "=",
                "val": $("[data-id='com_gyd68y2nnt']")[0].firstElementChild.GetCurrentData()["resource_detail_id"]
            }
        ]
    }
    let ret = HrsServer.Post("/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId", JSON.stringify(input));
    $("[data-id='com_gs502rf700d']")[0].firstElementChild.data = ret.Data;
    return ""
}

const _功能按钮 = {
    "新增": 1,
    "复制新增": 2,
    "修改": 3,
    "删除": 4,
    "收费对照": 5,
    "采集方式": 6,
    "启用": 7,
    "停用": 8
}
 
/**
 * 
 * @param {any} dataRow 当前行
 * @param {any} type    按钮类型 1-新增， 6-采集对照
 */
window.fun菜单按钮禁用 = function (dataRow, type) {
    let bln禁止 = true;

    if (type > 1) {
        const tableRow = $(`div[data-id="com_gs502rf700d"] zl-container zl-qmlist`)[0]?.GetCurrentData();
        const item_id = tableRow?.resource_detail_id || "0";
        if (parseInt(item_id || 0) > 0) {
            bln禁止 = false;
        }
    }
    switch (type) {
        case _功能按钮.新增://必须选中分类，才能新增项目
            const class_id = $(`div[data-id="com_gyd68y2nnt"] zl-container zl-treelist`)[0]?.GetCurrentData()?.resource_detail_id;
            if (parseInt(class_id || 0) > 0) {
                bln禁止 = false;
            }
            break;
        case _功能按钮.复制新增:  
            break;
        case _功能按钮.修改://要选中明细行，才能修改            
            break;
        case _功能按钮.删除:
            break;
        case _功能按钮.收费对照:
            break;
        case _功能按钮.采集方式:
            bln禁止 = true;
            if (dataRow) {
                if (dataRow["06359a87-9df0-4d20-b34b-c812d23594c1"] == "C") {
                    bln禁止 = false;
                }
            }
            break;
        case _功能按钮.启用:
            break;
        case _功能按钮.停用:
            break;        
        default:
            break;
    }    
    return bln禁止;
}

window.fun菜单按钮执行条件 = function (dataRow, type) {
    return true;
}

window.fun获取打开页面地址 = function (dataRow, type) {
    debugger 
    let item_id = 0, class_id = 0, pageid = "", url = "", editsta;

    pageid = "a0107b04-1846-4933-8cb9-f8d3b0bb3890";  //通用编辑页面
    class_id = $(`div[data-id="com_gyd68y2nnt"] zl-container zl-treelist`)[0]?.GetCurrentData()?.resource_detail_id;            
    item_id = $(`div[data-id="com_gs502rf700d"] zl-container zl-qmlist`)[0]?.GetCurrentData()?.resource_detail_id;
    editsta = 1;

    if (_功能按钮.复制新增 == type) editsta = 3;

    url = `pageViewById?pageid=${pageid}&editsta=${editsta}&class_id=${class_id}&item_id=${item_id}`; 

    if (type == _功能按钮.采集方式) {
        if (dataRow) {
            if (dataRow["06359a87-9df0-4d20-b34b-c812d23594c1"] == "C") {
                item_id = parseInt(dataRow["resource_detail_id"] || 0);//诊疗项目ID
            }
        }
        pageid = "da50550f-e0c3-4309-ada6-58eace3d16b8"; //采集方式设置页面
        url = "pageViewById?pageid=" + pageid + "&item_id=" + item_id;
    } else if (type == 22) {
        //检查单价替换设置管理
        pageid = "d693ad2b-672a-4381-9953-2d458162f17b";
        url = "pageViewById?pageid=" + pageid + "&item_id=" + item_id;
    }    
    return url;
}

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

}
