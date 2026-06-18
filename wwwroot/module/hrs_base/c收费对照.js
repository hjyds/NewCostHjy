
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
    // 解析URL参数并挂载到 window.par_in
    let urlPar = new URLSearchParams(location.search);
    window.par_in = {
        source: parseInt(urlPar.get("source") || 0),
        fitemid: parseInt(urlPar.get("fitemid") || 0),
        citemid: parseInt(urlPar.get("citemid") || 0),
        deptid: parseInt(urlPar.get("deptid") || 0),
        is_part: parseInt(urlPar.get("is_part") || 0),
        is_add: parseInt(urlPar.get("is_add") || 0),
        part: urlPar.get("part") || "",
        way: urlPar.get("way") || ""
    };

    $("#af4d9439-9a73-4885-92f1-fc2f4842676c")[0].option_value(window.Get部位下拉列表(window.par_in.citemid));

    $("#7b3eb36f-ebba-4c55-a1dd-1e06d09eb735")[0].option_value(window.Get方法下拉列表(window.par_in.citemid, window.par_in.part));
    
    $("#0b721e28-6e09-475f-8bbc-fe22b69e9888")[0].option_value(window.Get适用科室下拉列表(window.par_in.source));

    fun修改项目数据加载();
}

function fun修改项目数据加载() {
    const obj = window.GetFaceData(window.par_in.citemid, window.par_in.source, window.par_in.fitemid, window.par_in.deptid, window.par_in.is_part, window.par_in.is_add, window.par_in.part, window.par_in.way);
    for (let key in obj) {
        try {
            $("#" + key).val(obj[key]);
        } catch (err) {
            // 捕获错误
            console.log("错误信息：", err.message);
        } finally {
            // 无论成败都执行
            console.log("执行完毕");
        }
    }
}

window.GetFaceData = function (citemid, source, fitemid, deptid, is_part, is_add, part, way) {
    const matchConfig = [
        { relId: "e1b1b984-0c39-4a72-8097-96a0608dac71", val: citemid },
        { relId: "335d5454-d4f9-48d8-abfe-b81eb345b8d1", val: source },
        { relId: "4e433a2d-ec2f-49ba-8559-19839826d933", val: fitemid },
        { relId: "d8cb87bd-8047-426e-b830-e6e638051240", val: deptid },
        { relId: "a5c61484-1a59-4e3d-bd7a-b728aa39bb59", val: is_part },
        { relId: "24153211-0e00-4030-bbd2-c230c04fd2bf", val: is_add },
        { relId: "d4702ba6-bf38-47e3-8289-d8bccb0c2ab7", val: part },
        { relId: "df5ce499-1a2b-45c4-ac1c-6011d17b0f94", val: way }
    ];
    const matching = matchConfig.map(item => ({
        relId: item.relId,
        compare: "=",
        val: String(item.val)
    }));

    var params = {
        "resTypeId": "fb5397de-5690-42f0-ab22-0208425129a8",
        "viewId": "e994c49b-e8c4-46c4-90bf-8c8562f0d0b2",
        "row": 0,
        "source": "资源类型",
        "matching": matching
    };

    const result = HrsServer.Post(
        "/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId",
        JSON.stringify(params)
    );
    return result.Data[0];
}

window.Get部位下拉列表 = function (citemid) {
    var params = {
        "resTypeId": "c79cda20-a925-45e7-a97f-3741793b9f8c",
        "viewId": "4cdc11f2-57a4-48d5-a668-122d2b40f572",
        "row": 0,
        "source": "资源类型",
        "matching": [
            {
                "relId": "25f0a33e-b9d7-4d40-97a1-64e2c4d6f464",
                "compare": "=",
                "val": citemid
            }
        ]
    }
    const result = HrsServer.Post(
        "/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId",
        JSON.stringify(params)
    );
    return result.Data;
}

window.Get方法下拉列表 = function (citemid, part) {
    var params = {
        "resTypeId": "a0ed0155-1057-4488-933e-0768e1cbe2ba",
        "viewId": "95aced2c-fe52-4cb9-b0e5-554112f1e5d3",
        "row": 0,
        "source": "资源类型",
        "matching": [
            {
                "relId": "12c088eb-e5d4-4d00-8fc7-83b1e1d82aa9",
                "compare": "=",
                "val": citemid
            },
            {
                "relId": "5cc56d3b-3a03-49d9-ae61-54e346611685",
                "compare": "=",
                "val": part
            }
        ]
    }
    const result = HrsServer.Post(
        "/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId",
        JSON.stringify(params)
    );
    return result.Data;
}

window.Get适用科室下拉列表 = function (source) {
    if (0 == source) {
        return [];
    }
    var params = {
        "resTypeId": "b1765cb4-95ee-4cd9-9936-13e13dc6f223",
        "viewId": "30eae7cc-7ca7-4752-a1e5-441b015ea92f",
        "row": 0,
        "source": "资源类型",
        "matching": [
            {
                "relId": "c3a58f99-aed7-4bc2-9334-790b770b0c26",
                "compare": "=",
                "val": source
            }
        ]
    }
    const result = HrsServer.Post(
        "/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId",
        JSON.stringify(params)
    );
    return result.Data;
}