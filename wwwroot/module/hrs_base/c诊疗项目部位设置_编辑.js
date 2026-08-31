
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
        _操作类型: null,
        _编码: null,
        _编辑状态: null,
        _项目数据: null
    }
};

const mapGuid = {
    _编码: "01a056f1-bcdb-7aa4-a607-7348440af698",
    _名称: "01a056f1-bcdb-76ed-b203-7534528363ba",
    _备注: "01a056f1-bcdc-7ea9-bc21-b9ce9b982f26",
    _方法列表: "01a056f1-bcf0-740d-b2f2-87980a7f020b",
    _分组: "01a056f1-bcdc-770e-a7a9-4cb42dbf7684"
};

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
    let urlPar = new URLSearchParams(location.search);
    let oper_type = urlPar.get("oper_type") || "";
    let code = urlPar.get("code") || "";
    let editsta = parseInt(urlPar.get("editsta") || 0);//编辑状态 1-新增，2-修改 
    _界面控件._参数._操作类型 = oper_type;
    _界面控件._参数._编码 = code;
    _界面控件._参数._编辑状态 = editsta;
    fun获取项目数据();
    if (editsta > 0) {
        debugger;
    }
}

function fun获取项目数据() {
    //检查项目
    var params = {
        "resTypeId": "bdcf3958-f526-407e-a7ef-b84c22379ceb",
        "viewId": "fef1b735-4a0e-4914-999f-c643d5d164b8",
        "row": 0,
        "source": "资源类型",
        "matching": [{
            "relId": "01a056f1-bcf1-7cd9-9f84-7cc530c2b94d",
            "compare": "=",
            "val": _界面控件._参数._编码
        },
        {
            "relId": "01a056f1-bcf1-7655-8a5a-d4814a492884",
            "compare": "=",
            "val": _界面控件._参数._操作类型
        }],
        "skip": 0,
        "take": 1
    }

    const result = HrsServer.Post("/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId", JSON.stringify(params));
    _界面控件._参数._项目数据 = result.Data;

    if (_界面控件._参数._编辑状态 == 2 || _界面控件._参数._项目数据.length > 0) {
        $(`div[data-id="com_mdz51la6z4"] zl-container`)[0].firstChild.data = _界面控件._参数._项目数据;
        let 方法列表 = _界面控件._参数._项目数据[0][mapGuid._方法列表];
        if (方法列表 && 方法列表.length > 0) {
            方法列表 = JSON.parse(方法列表);
            $(`div[data-id="com_fjfqtqcqt6"] zl-container`)[0].firstChild.data = convertMethodToResource(方法列表);
        }
    }

    if (_界面控件._参数._编辑状态 == 1) {
        $("#" + mapGuid._编码).val(nextCode());
        $("#" + mapGuid._名称).val("");
        $("#" + mapGuid._备注).val("");
    }
}


function nextCode() {
    //获取最大的下一个编码
    let parin = {
        "resTypeId": "c67bfbe7-c55f-41ea-87f8-372d46c46579",
        "viewId": "bea2b699-64ab-498c-ba55-8593b777a58a",
        "row": 0,
        "source": "资源类型",
        "matching": [
            {
                "relId": "01a05695-a598-77ca-a866-245813020362",
                "compare": "=",
                "val": _界面控件._参数._操作类型
            },
            {
                "relId": "01a05695-a598-7616-9169-19c564fe6105",
                "compare": "=",
                "val": "0"
            }
        ]
    };
    let ret = HrsServer.Post("/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId", JSON.stringify(parin));
    let dataOut = ret.Data[0];

    let 已编码 = parseInt(dataOut["01a05695-a597-7165-bc4f-53368ead9ea3"]), 长度 = parseInt(dataOut["01a05695-a598-7552-837c-cfb3174b227d"]);
    if (长度 == 0) {
        return "0001";
    }
    return String(已编码 + 1).padStart(长度, '0');
}

/**
 * 数据对象转换：方法信息对象数组 -> 资源配置明细对象数组
 *
 * 结点对照（源字段 -> 目标GUID字段）：
 *   上级方法  -> 01a0474d-7122-7f29-add9-4fa947c9bbca
 *   共选      -> 01a0474d-7125-7815-9605-62063873f1a2
 *   是否造影  -> 01a0474d-7125-70a1-b314-e70f50bb765e
 *   方法名称  -> 01a0474d-7124-7f1b-aa63-109beb32a581
 *
 * @param {Array}  sourceList 已知对象数组，如 [{序号,上级方法,方法名称,共选,是否造影,是否勾选}] 
 * @returns {Array}           目标对象数组
 */
function convertMethodToResource(sourceList) {
    var FIELD_MAP = {
        "上级方法": "01a0474d-7122-7f29-add9-4fa947c9bbca",
        "共选": "01a0474d-7125-7815-9605-62063873f1a2",
        "是否造影": "01a0474d-7125-70a1-b314-e70f50bb765e",
        "方法名称": "01a0474d-7124-7f1b-aa63-109beb32a581"
    };

    return (sourceList || []).map(function (item) {
        var target = {
            "resource_detail_id": guid(),   // 每行新生成 GUID
            "resource_view_id": "d4102976-0a76-4b2b-99d5-6f3850e701c8",
            "resource_type_id": "d3a5a519-e909-49e7-b169-73f699f81aac",
            "resource_source_type": "bde66990-68c9-4674-80ba-7605e46aa239",
            "detail_name": "",
            "is_edit": true
        };

        // 结点字段：按对照表从源对象取值填充
        $.each(FIELD_MAP, function (srcField, guidKey) {
            target[guidKey] = (item[srcField] !== undefined && item[srcField] !== null)
                ? item[srcField] : null;
        });

        return target;
    });
}


_界面控件.fun获取方法串 = function (sourceList) {
    var FIELD_MAP = {
        "01a0474d-7122-7f29-add9-4fa947c9bbca": "上级方法",
        "01a0474d-7125-7815-9605-62063873f1a2": "共选",
        "01a0474d-7125-70a1-b314-e70f50bb765e": "是否造影",
        "01a0474d-7124-7f1b-aa63-109beb32a581": "方法名称"
    };
    let arr = (sourceList || []).map(function (item) {
        var target = {};
        // 结点字段：按对照表从源对象取值填充
        $.each(FIELD_MAP, function (srcField, guidKey) {
            target[guidKey] = (item[srcField] !== undefined && item[srcField] !== null)
                ? item[srcField] : null;
        });

        if (!target.共选) {
            target.共选 = 0;
        }

        if (!target.是否造影) {
            target.是否造影 = 0;
        }

        target.共选 = parseInt(target.共选);
        target.是否造影 = parseInt(target.是否造影);

        return target;
    });


    /////////////////////////////////////////

    var map = {}, roots = [], i, item, p;

    // 第一遍：上级方法为空 -> 根结点，并建立名称索引
    for (i = 0; i < arr.length; i++) {
        item = arr[i];
        if (!item.上级方法) {
            item.子方法 = [];            // 根结点初始化子方法数组
            roots.push(item);
            map[item.方法名称] = item;   // 名称 -> 根结点
        }
    }

    // 第二遍：上级方法非空 -> 直接挂到对应根下（不会再往下挂）
    for (i = 0; i < arr.length; i++) {
        item = arr[i];
        if (item.上级方法) {
            p = map[item.上级方法];
            if (p) {
                item.共选 = 1;           // 子方法共选固定为 1
                p.子方法.push(item);     // 扩展为子结点
            }
        }
    }
    var tree = roots;
    ///////////////////////////////////
    var parts = [];
    var j, root, sub;
    for (i = 0; i < tree.length; i++) {
        root = tree[i];
        parts.push((root.共选 == 0 ? ';' : '\t') + root.是否造影 + root.方法名称);          // 根方法：; + 造影 + 名称
        for (j = 0; j < root.子方法.length; j++) {
            sub = root.子方法[j];
            parts.push(',' + sub.是否造影 + sub.方法名称);        // 子方法：, + 造影 + 名称
        }
    }

    _界面控件._参数._方法信息 = tree;

    return parts.join('');
}

_界面控件.fun获取医共体方法列表 = function (tree) {
    var parts = [];
    var i, j, root, sub;
    for (i = 0; i < tree.length; i++) {
        root = tree[i];

        parts.push(
            {
                "superior_code": "",
                "superior_name": "",
                "method_code": root.方法名称,
                "method_name": root.方法名称,
                "mutex_method": (root.共选 == 0 ? 1 : 0),
                "use_contrast_medium": root.是否造影
            })

        for (j = 0; j < root.子方法.length; j++) {
            sub = root.子方法[j];

            parts.push(
                {
                    "superior_code": root.方法名称,
                    "superior_name": root.方法名称,
                    "method_code": sub.方法名称,
                    "method_name": sub.方法名称,
                    "mutex_method": 0,
                    "use_contrast_medium": sub.是否造影
                })
        }
    }
    return parts;
}


window.GetPartSaveJsonPar = function () {
    debugger;
    let parData = {}
    let 部位属性 = $(`div[data-id="com_mdz51la6z4"] zl-container`)[0].firstChild.data;
    let 方法列表 = $(`div[data-id="com_fjfqtqcqt6"] zl-container`)[0].firstChild.data;
    parData.功能 = _界面控件._参数._编辑状态;
    parData.操作 = _界面控件._参数._编辑状态;//           N 1 功能，1: 增加; 2: 修改; 3: 删除
    parData.类型 = _界面控件._参数._操作类型;//              C 1 检查部位类型，如：超声
    parData.原编码 = 部位属性[mapGuid._编码];//              C 1 原部位编码（新增 / 修改时必传）
    parData.新编码 = 部位属性[mapGuid._编码];//               C 1 新部位编码（新增 / 修改时必传；删除时传待删除的编码）
    parData.名称 = 部位属性[mapGuid._名称];//               C 1 部位名称（新增 / 修改时必传）
    parData.分组 = 部位属性["01a056f1-bcdc-770e-a7a9-4cb42dbf7684"];//            C 1 部位分组，如：膀胱经
    parData.备注 = 部位属性[mapGuid._备注];//                C 1 备注说明
    parData.方法 = _界面控件.fun获取方法串(方法列表);//                C 1 检查方法串，如：; 0常规
    parData.适用性别 = parseInt(部位属性["01a056f1-bce7-738b-9e00-f254f6314441"] || 0);//            N 1 适用性别   
    parData.是否新放射 = 0;

    if (parData.操作 == 2) {
        parData.原编码 = _界面控件._参数._编码;
    }

    parData = { "Json_In": JSON.stringify(parData) }
    return parData;
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

window.GetSyncData = function (proPar) {
    //获取医共体平台接口参数仅是参数组织，只有保存成功后才会真正调用医共体平台接口    
    const paramsData = funhrsBaseParam();
    if (paramsData == null) return

    let temp = JSON.parse(proPar.Json_In);
    let serviceCode = "X_MD_0025";
    if (temp.功能 == 2) serviceCode = "X_MD_0026";

    if (!temp.新编码) return

    let bData = temp;

    bData = {
        "study_type_code": temp.类型,
        "study_type_name": temp.类型,
        "part_code": temp.新编码,
        "part_name": temp.名称,
        "part_group_code": temp.分组,
        "part_group_name": temp.分组,
        "part_method": _界面控件.fun获取医共体方法列表(_界面控件._参数._方法信息),
        "state": 1
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