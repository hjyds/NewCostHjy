
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

window._界面控件 = {
    _参数: {
        _诊疗项目id: null,
        _分类id: null,
        _编辑状态: null,
        _项目数据: null
    },
    _编码选项: {
        _收费方式采集: "0|0-正常收取,1|1-检验试管费用,2|2-一次发送只收取一次,3|3-当天只收取一次,4|4-当天未执行收取一次,5|5-当天只收取一次,排斥其他项目,6|6-当天未执行收取一次,排斥其他项目,7|7-每天首次不收取,8|8-按收费方案收取,9|9-自定义,31|31-当天只收取一次(相同部位)",
        _收费方式: "0|0-正常收取,2|2-一次发送只收取一次,3|3-当天只收取一次,4|4-当天未执行收取一次,5|5-当天只收取一次,排斥其他项目,6|6-当天未执行收取一次,排斥其他项目,7|7-每天首次不收取,8|8-按收费方案收取,9|9-自定义,31|31-当天只收取一次(相同部位)",
        _收费方式部位: "0|0-正常收取,2|2-一次发送只收取一次,9|9-自定义"
    },    
    _分类说明: null,
    _诊疗类别: null,
    _操作类型: null,
    _操作类型标签: null,
    _检查部位加载: ""
}

const mapGuid = {
    _收费方式: "118e7842-94d5-4649-94f9-386fd2360deb",
    _规格适配: "5f2c3a63-83dc-4f80-8618-aa9d5acb0056",
    _部位加收: "1af43e21-c3cc-4dd4-92af-e94febe13e02",
    _类别: "af5b0373-0360-4afd-841e-fad7a71cda0b_592e7eae-554a-45b5-8530-bd50f6a25123",
    _病人来源: "ad662a41-fd1a-4ad6-833b-e01fd53f3823",
    _适用科室: "0b721e28-6e09-475f-8bbc-fe22b69e9888",
    _方法: "7b3eb36f-ebba-4c55-a1dd-1e06d09eb735",
    _部位: "af4d9439-9a73-4885-92f1-fc2f4842676c",
    _从项: "72c6b9cb-a219-4300-927d-3dbe5921763d",
    _收费方式: "118e7842-94d5-4649-94f9-386fd2360deb",
    _方案: "7692f539-af94-4bfc-92ae-a692d51000ea",

    //数据相关
    d_诊疗项目id: "955b461a-dc4e-4873-a7e6-b4fe97d5492a",
    d_收费项目id: "304e52aa-b74d-4aec-a395-85118d8f04a0",
    d_收费数量: "3b20f973-7876-4d82-93fc-885f8bfbb3ab",
    d_固有对照: "bfa73749-1261-416d-b1ce-3966ac4c1ace",
    d_按规格适配: "5f2c3a63-83dc-4f80-8618-aa9d5acb0056",
    d_从属项目: "72c6b9cb-a219-4300-927d-3dbe5921763d",
    d_收费方式: "118e7842-94d5-4649-94f9-386fd2360deb",
    d_方案id: "7692f539-af94-4bfc-92ae-a692d51000ea",

    d_操作类型: "4b3f520f-ce36-4f6e-a3f5-1bf2c92c0d7f",
    d_服务对象: "8b5a4ace-6ba6-4bd2-bf1b-e9334fa635ae",
    d_执行标记: "9e22ffeb-53b0-4670-92a9-5b46f7c18d0e",
    d_诊疗类别: "c714b922-e9f0-4a7f-813b-2c9773c86051"
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
        source: parseInt(urlPar.get("source") || 0),
        fitemid: parseInt(urlPar.get("fitemid") || 0),
        citemid: parseInt(urlPar.get("citemid") || 0),
        deptid: parseInt(urlPar.get("deptid") || 0),
        is_part: parseInt(urlPar.get("is_part") || 0),
        is_add: parseInt(urlPar.get("is_add") || 0),
        edit: parseInt(urlPar.get("edit") || 0),
        part: urlPar.get("part") || "",
        way: urlPar.get("way") || ""
    };
    if (window.par_in.citemid == 0) {
        return;
    }
    const obj = window.GetFaceData(window.par_in.citemid, window.par_in.source, window.par_in.fitemid, window.par_in.deptid, window.par_in.is_part, window.par_in.is_add, window.par_in.part, window.par_in.way);

    window.par_in.basedata = obj;

    if ("D" == obj[mapGuid.d_诊疗类别] && window.par_in.is_part == 1 && window.par_in.is_add == 0) {
        $("#" + mapGuid._部位)[0].option_value(window.Get部位下拉列表(window.par_in.citemid));
        $("#" + mapGuid._方法)[0].option_value(window.Get方法下拉列表(window.par_in.citemid, window.par_in.part));
    }

    if ("E" == obj[mapGuid.d_诊疗类别] && obj[mapGuid.d_操作类型] == "6") {
        fun加载编码项目($("#" + mapGuid._收费方式), "_收费方式采集");
    } else if (window.par_in.is_part == 1) {
        fun加载编码项目($("#" + mapGuid._收费方式), "_收费方式部位");
    } else if (window.par_in.is_add == 0) {
        fun加载编码项目($("#" + mapGuid._收费方式), "_收费方式");
    }

    $("#" + mapGuid._适用科室)[0].option_value(window.Get适用科室下拉列表(window.par_in.source));

    fun修改项目数据加载(obj);

    fun设置界面控件显示状态();

    //事件注册
    $("#" + mapGuid._部位).on("change", function () {
        //根据部位的选择，动态更新方法的选项
        $("#" + mapGuid._方法)[0].option_value(window.Get方法下拉列表(window.par_in.citemid, $("#" + mapGuid._部位).val()));
    });

    $("#" + mapGuid._病人来源).on("change", function () {
        //根据病人来源的选择，动态更新适用科室的选项
        $("#" + mapGuid._适用科室)[0].option_value(window.Get适用科室下拉列表(parseInt($("#" + mapGuid._病人来源).val() || 0)));
    });
}

function fun设置界面控件显示状态() {
    const obj = window.par_in.basedata;
    let isShow = false;
    if ("D" == obj[mapGuid.d_诊疗类别] && window.par_in.is_part == 1 && window.par_in.is_add == 0) {
        isShow = true
    }

    fun设置控件可见性(mapGuid._类别, isShow);
    fun设置控件可见性(mapGuid._部位, isShow);
    fun设置控件可见性(mapGuid._方法, isShow);

    fun设置控件可见性(mapGuid._规格适配, ("E" == obj[mapGuid.d_诊疗类别] && obj[mapGuid.d_操作类型] == "6"));

    fun设置控件可见性(mapGuid._部位加收, 1 == window.par_in.is_part);

    if (window.par_in.is_add == 1) {
        isShow = false;
        fun设置控件可见性(mapGuid._从项, isShow);
        fun设置控件可见性(mapGuid._收费方式, isShow);
        fun设置控件可见性(mapGuid._方案, isShow);
    }
}

function fun加载编码项目(obj控件, keyid) {
    obj控件.attr("data-option-code-list", _界面控件._编码选项[keyid]);
    obj控件.val(_界面控件._编码选项[keyid].split('|')[0]);//赋缺省值
}

function fun设置控件可见性(keyid, isShow) {
    if (isShow) {
        $(`[data-owner-id='${keyid}']`).show();
    } else {
        $(`[data-owner-id='${keyid}']`).hide();
    }
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

window.GetEditDataToSave = function () {
    debugger

    let editData = $("[data-id='com_zkz5b7mqvrg']")[0]?.firstElementChild?.data;
    let oldData = window.par_in.basedata;
    var parData = {};

    parData.功能 = 11;
    parData.记录id = oldData[mapGuid.d_诊疗项目id];

    parData.收费项目id = parseInt(editData[mapGuid.d_收费项目id] || 0);
    parData.收费数量 = parseInt(editData[mapGuid.d_收费数量] || 0);
    parData.固有对照 = parseInt(editData[mapGuid.d_固有对照] || 0);
    parData.按规格适配 = parseInt(editData[mapGuid.d_按规格适配] || 0);
    parData.从属项目 = parseInt(editData[mapGuid.d_从属项目] || 0);
    parData.收费方式 = parseInt(editData[mapGuid.d_收费方式] || 0);
    parData.方案id = parseInt(editData[mapGuid.d_方案id] || 0);
    parData.病人来源 = parseInt(editData[mapGuid._病人来源] || 0);
    parData.科室id = parseInt(editData[mapGuid._适用科室] || 0);
    parData.检查部位 = editData[mapGuid._部位];
    parData.检查方法 = editData[mapGuid._方法];

    parData.对照方式 = 1;
    if (window.par_in.is_part) {
        parData.对照方式 = 2;
    }
    if (window.par_in.is_add) {
        parData.对照方式 = 3;
    }

    if (window.par_in.edit == 2) {
        //修改行
        parData.old_收费项目id = parseInt(oldData[mapGuid.d_收费项目id] || 0);        
        parData.old_病人来源 = parseInt(oldData[mapGuid._病人来源] || 0);
        parData.old_科室id = parseInt(oldData[mapGuid._适用科室] || 0);
        parData.old_检查部位 = oldData[mapGuid._部位];
        parData.old_检查方法 = oldData[mapGuid._方法];
    }

    parData = { "Json_In": JSON.stringify(parData) };
    
    return parData;
 
}