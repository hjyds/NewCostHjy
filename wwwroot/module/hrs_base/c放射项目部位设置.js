
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

window.GetPartMethodUrl = function (type) {
    //获取新增或者修改的地址，1-新增，2-修改
    let item_id, class_id, pageid, url, editsta;

    pageid = "a9ecf6f6-5434-4baf-8e41-1b98bba75f63";  //放射项目部位设置_编辑 页面
    item_id = $(`div[data-id="com_1m6qmiyh5ab"] zl-container zl-qmlist`)[0]?.GetCurrentData()?.resource_detail_id || "";
    class_id = $(`div[data-id="com_5o36ycn67lj"] zl-container zl-qmlist`)[0]?.GetCurrentData()?.detail_name || "";
    editsta = type;
    url = `pageViewById?pageid=${pageid}&editsta=${editsta}&oper_type=${class_id}&code=${item_id}`;
    return url;
}

function funhrsBaseParam() {
    //获取医共体参数
    let _input = {
        "resTypeId": "d52ad143-b5e9-4a99-8f62-0774b8e067c2",
        "viewId": "c4dc7a5c-b609-47b6-85ad-379fbba2f7b3",
        "row": 0,
        "source": "资源类型",
        "matching": []
    };
    let _output = HrsServer.Post("/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId", JSON.stringify(_input));
    let paramsData = _output.Data[0]["019fcaa6-e01e-7a00-93ca-0e7e765d180f"]; //参数值
    let params = JSON.parse(paramsData);
    let hrsBaseParam = params.HrsBase;
    if (hrsBaseParam.isStart == "0") {
        //未启用接口直接退出
        hrsBaseParam = null;
        return hrsBaseParam;
    }
    if (hrsBaseParam.apiUrl == "") {
        alert("医共体平台接口地址未设置，不能同步！");
        hrsBaseParam = null;
        return hrsBaseParam;
    }
    if (hrsBaseParam.appId == "") {
        alert("医共体平台接口地址未设置，不能同步！");
        hrsBaseParam = null;
        return hrsBaseParam;
    }
    if (hrsBaseParam.secretKey == "") {
        alert("医共体平台密钥未设置，不能同步！");
        hrsBaseParam = null;
        return hrsBaseParam;
    }
    if (hrsBaseParam.platformPublicKey == "") {
        alert("医共体平台公钥未设置，不能同步！");
        hrsBaseParam = null;
        return hrsBaseParam;
    }
    if (hrsBaseParam.clientSM2PublicKey == "") {
        alert("医共体客户端公钥未设置，不能同步！");
        hrsBaseParam = null;
        return hrsBaseParam;
    }
    if (hrsBaseParam.clientSM2PrivateKey == "") {
        alert("医共体客户端私钥未设置，不能同步！");
        hrsBaseParam = null;
        return hrsBaseParam;
    }
    return hrsBaseParam;
}

window.GetSyncData = function () {
    //获取医共体平台接口参数仅是参数组织，只有保存成功后才会真正调用医共体平台接口    
    const paramsData = funhrsBaseParam();
    if (paramsData == null) return

    let temp = $(`div[data-id="com_1m6qmiyh5ab"] zl-container zl-qmlist`)[0]?.GetCurrentData();
    let serviceCode = "X_MD_0026";

    let bData = temp;
    debugger
    bData = {
        "study_type_code": temp["01a04716-8736-7e9e-bdc2-c4ab60da1865"],//检查类型编码
        "study_type_name": temp["01a04716-8736-7e9e-bdc2-c4ab60da1865"],//检查类型名称
        "part_code": temp["01a04716-8733-730e-9b91-2d95a09ee055"],//部位编码
        "part_name": temp["01a04716-8734-7af4-9e7b-794b8731a1f8"],//部位名称
        "part_group_code": temp["01a04716-8732-73bb-8bb2-84db3710f1e2"],//分组名称
        "part_group_name": temp["01a04716-8732-73bb-8bb2-84db3710f1e2"],//分组名称
        "part_method": [],
        "state": -1
    };

    //组织自定义后台服务的入参
    let input = {
        "url": paramsData.apiUrl,
        "appId": paramsData.appId,
        "appSecret": paramsData.secretKey,
        "platformPublicKey": paramsData.platformPublicKey,
        "clientSM2PublicKey": paramsData.clientSM2PublicKey,
        "clientSM2PrivateKey": paramsData.clientSM2PrivateKey,
        "serviceCode": serviceCode,
        "data": bData
    }
    return input;
}

window.DeletePartData = function () {
    let curData = $(`div[data-id="com_1m6qmiyh5ab"] zl-container zl-qmlist`)[0]?.GetCurrentData()
    debugger
    var parData = {}
    parData.功能 = 3;
    parData.操作 = 3;
    parData.类型 = curData["01a04716-8736-7e9e-bdc2-c4ab60da1865"];
    parData.原编码 = curData["01a04716-8733-730e-9b91-2d95a09ee055"];
    parData.是否新放射 = 1;
    parData = { "Json_In": JSON.stringify(parData) }
    fun删除部位过程(parData);

    var data = GetSyncData()
    if (data) {
        fun医共体基础数据服务(data)
    }
}

function fun删除部位过程(data) {
    var datapar = {
        "name": "Zl_Hrssvr_Partedit",
        "circleid": "ee467177-2400-4e1b-b29f-52a6e4793659",
        "inargs": data
    }
    let url = `/api/DBOperation/Procedure`
    let strPar = JSON.stringify(datapar)
    var ret1 = HrsServer.Post(url, strPar)
}

function fun医共体基础数据服务(data) {
    //医共体平台API服务基础数据同步执行
    var datapar = {
        "inargs": data,
        "hcsid": "e6c2a658-aadf-4c38-933f-51055167efc3",
        "circleid": "ee467177-2400-4e1b-b29f-52a6e4793659",
        "内部服务": "c1cf2b83-c8f6-4be5-b4e5-c73edca0789e"
    }
    let url = `/res/HCS/Execute`
    let strPar = JSON.stringify(datapar)
    //用JS代码方式调用API服务
    var ret1 = HrsServer.Post(url, strPar)
}