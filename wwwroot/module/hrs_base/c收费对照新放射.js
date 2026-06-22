
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


const mapGuid = { 
    _部位: "5890d062-1fe8-4cab-9a12-2048af19d7ef",
    _方法: "21b9001d-ff45-4a71-aa9a-53d289bcecd4",
    //数据相关
    d_分组名称: "96ce97f6-24a1-45e8-9716-c65548e6ae4a",
    d_诊疗项目id: "0f70ddde-bb77-4717-b103-7759da07633e",
    d_收费项目id: "1748123e-45cc-43c3-b3b3-b9c974481935",
    d_收费数量: "1890fe5a-9d1a-4542-a36b-aa80dc6e678e",
    d_指定总量: "4265bf2d-03e9-4979-b9bf-61670be036c0", 
    d_收费方式: "a2ca77a9-8a06-4653-8a96-8abfa6990387", 
    d_费用性质: "4e84e65c-f56a-4e30-945f-73f1459b1006"     
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
    // 解析URL参数并挂载到 window.par_in
    let urlPar = new URLSearchParams(location.search);

    window.par_in = {
        fitemid: parseInt(urlPar.get("fitemid") || 0),
        citemid: parseInt(urlPar.get("citemid") || 0),  
        fpro: parseInt(urlPar.get("fpro") || 0),
        edit: parseInt(urlPar.get("edit") || 0),
        part: urlPar.get("part") || "",
        way: urlPar.get("way") || ""
    };
    if (window.par_in.citemid == 0) {
        return;
    }
    const obj = window.GetFaceData(window.par_in.citemid, window.par_in.fitemid, window.par_in.fpro, window.par_in.part, window.par_in.way);
    window.par_in.basedata = obj;
    fun修改项目数据加载(obj); 
}
 
function fun修改项目数据加载(obj) {
    for (let key in obj) {
        try {
            $("#" + key).val(obj[key]);
        } catch (err) {
            // 捕获错误
            console.log("收费对照错误信息：", err.message);
        } finally {
            // 无论成败都执行
            //console.log("收费对照执行完毕");
        }
    }
}

window.GetFaceData = function (citemid, fitemid, fpro, part, way) { 
    var params = {
        "resTypeId": "d3a42057-6e2f-4e0c-92eb-b97ebf1ef100",
        "viewId": "4a5c1bb9-fab8-46ec-8395-e13c32f873d9",
        "row": 0,
        "source": "资源类型",
        "matching": [
            {
                "relId": "d3efed88-5489-4e7e-a6b8-c3cb25518959",
                "compare": "=",
                "val": citemid
            },
            {
                "relId": "ebac3cd3-64c3-49f6-a86a-e5f6fdc0edbf",
                "compare": "=",
                "val": fitemid
            },
            {
                "relId": "15169e1c-5103-4179-9e40-0cd89a7a3f40",
                "compare": "=",
                "val": fpro
            },
            {
                "relId": "49390ad2-1d4e-476c-a7c9-aa458884901b",
                "compare": "=",
                "val": part
            },
            {
                "relId": "5030381f-7160-4882-af7b-56c7d6242485",
                "compare": "=",
                "val": way
            }
        ]
    }
    const result = HrsServer.Post(
        "/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId",
        JSON.stringify(params)
    );
    return result.Data[0];
}
 

window.GetEditDataToSave = function () {
    debugger

    let editData = $("[data-id='com_5dw48qyvz2']")[0]?.firstElementChild?.data;
    let oldData = window.par_in.basedata;
    var parData = {};

    parData.功能 = 12;
    parData.记录id = oldData[mapGuid.d_诊疗项目id];

    parData.收费项目id = parseInt(editData[mapGuid.d_收费项目id] || 0);
    parData.收费数量 = parseFloat(editData[mapGuid.d_收费数量] || 0);
    parData.收费方式 = parseInt(editData[mapGuid.d_收费方式] || 0);   
    parData.费用性质 = parseInt(editData[mapGuid.d_费用性质] || 0);   
    parData.检查部位 = editData[mapGuid._部位 + "_Name"];
    parData.检查方法 = editData[mapGuid._方法 + "_Name"];
    parData.指定总量 = parseInt(editData[mapGuid.d_指定总量] || 0);
    parData.分组名称 = editData[mapGuid.d_分组名称];
    parData.按规则计费 = 1;
    if (window.par_in.edit == 2) {
        //修改行
        parData.old_收费项目id = parseInt(oldData[mapGuid.d_收费项目id] || 0);  
        parData.old_费用性质 = parseInt(oldData[mapGuid.d_费用性质] || 0);   
        parData.old_检查部位 = oldData[mapGuid._部位];
        parData.old_检查方法 = oldData[mapGuid._方法];
    }

    parData = { "Json_In": JSON.stringify(parData) };
    
    return parData;
 
}