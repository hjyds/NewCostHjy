
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
 * 根据资源ID、视图ID、条件查询并获取指定字段的值
 * @param {any} conditionValue - 条件匹配值
 * @param {number|string} resTypeId - 资源ID
 * @param {number|string} viewId - 视图ID
 * @param {number|string} conditionId - 条件字段ID
 * @param {number|string} targetId - 要取值的字段ID，当传值为1时，返回对象数组
 * @returns {any|null} 返回目标字段值，查询失败返回 null
 */
function GetSimpleNodeVal(conditionValue, resTypeId, viewId, conditionId, targetId) {
    try {
        // 1. 构造请求参数
        let params = {
            resTypeId: resTypeId,
            viewId: viewId,
            matching: [
                {
                    relId: conditionId,
                    compare: "=",
                    val: conditionValue
                }
            ]
        };
        if ("" == conditionId) {
            params.matching = [];
        }
        // 2. 调用后台接口（HR系统通用请求）
        const result = HrsServer.Post(
            "/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId",
            JSON.stringify(params)
        );

        // 3. 校验接口返回数据
        if (!result || !result.Data || !Array.isArray(result.Data) || result.Data.length === 0) {
            console.warn("GetSimpleNodeVal：未查询到匹配的数据");
            return null;
        }
        if (targetId == 1) {
            return result.Data;
        }
        // 4. 取第一条数据并返回目标字段值
        const firstItem = result.Data[0];
        return firstItem[targetId];

    } catch (error) {
        // 捕获异常，避免页面崩溃
        console.error("GetSimpleNodeVal 执行异常：", error);
        return null;
    }
}

const mapGuid = {
    _应用于: "092669d5-8053-4916-9cb9-e8c785b123cc",
    _采集方式: "b5d170c1-f0b6-4a95-af26-466b0ca7ed19",
    _医生嘱托: "2414d9a0-28bf-46c6-870c-3b54bfc60f77"
};

window._界面控件 = { 
    _参数: {
        _诊疗项目id: null 
    },
    _编码选项: { } 
};

function fun加载编码项目(obj控件, keyid) {
    obj控件.attr("data-option-code-list", _界面控件._编码选项[keyid]);
    obj控件.val(_界面控件._编码选项[keyid].split('|')[0]);//赋缺省值
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
    let urlPar = new URLSearchParams(location.search); 
    let item_id = parseInt(urlPar.get("item_id") || 0); 
    if (0 == item_id) return

    _界面控件._参数._诊疗项目id = item_id;
    let val应用于选项目下拉值 = GetSimpleNodeVal(item_id,
        "d3821d39-807b-4ea7-add9-1e0657f70b73",
        "87d18d49-2e2f-4b7d-b212-1b78b32e7965",
        "12cc7b56-ef80-4f02-b9ff-e2a1461d9ec6",
        "4b9216de-6074-4509-a9e7-ab7a875d3286");

    _界面控件._编码选项[mapGuid._应用于] = val应用于选项目下拉值;
    fun加载编码项目($("#" + mapGuid._应用于), mapGuid._应用于); 

}

window.GetCitemSaveJsonPar = function () {    
    var parData = {}, temp = null, objItem = null;
    parData.功能 = 6;//检验项目设置采集方式
    parData.记录id = _界面控件._参数._诊疗项目id;
    let userInfo = JSON.parse(sessionStorage.UserLoginInfo);
    parData.UserName = userInfo.account_extend.UserName;
    parData.AccountName = userInfo.account_extend.AccountName;
    parData.staff_id = userInfo.staff_id;
    temp = $("[data-id='com_xdk11z3j62f']")[0]?.firstElementChild?.data;
    if (temp && temp.length > 0) {
        parData.采集方式 = convertNodeData(temp);
    } else {
        parData.采集方式 = "";
    }
    parData.应用范围 = $("#" + mapGuid._应用于).val();
    if ($("#" + mapGuid._应用于).find('input').eq(0).prop('checked')) {
        parData.应用范围类型 = 0;
    } else if ($("#" + mapGuid._应用于).find('input').eq(1).prop('checked')) {
        parData.应用范围类型 = 1;
    } else {
        parData.应用范围类型 = 2;
    }
    parData = { "Json_In": JSON.stringify(parData) }
    return parData;
}

/**
 * 多行节点数据转换
 * @param {Array} sourceList - 入参：多行原始数组（每一项都是一个对象）
 * @returns {Array} 出参：转换后的数组（采集方式为空的已自动排除）
 */
function convertNodeData(sourceList) {
    // 入参为空直接返回空字符串
    if (!Array.isArray(sourceList)) return "";

    // UUID 与中文字段映射
    const keyMap = {
        "2414d9a0-28bf-46c6-870c-3b54bfc60f77": "医生嘱托",
        "b5d170c1-f0b6-4a95-af26-466b0ca7ed19": "采集方式"
    };

    const filteredList = sourceList.map(item => {
        const data = item || {};
        const result = {};
        // 字段映射转换
        for (const [uuid, fieldName] of Object.entries(keyMap)) {
            result[fieldName] = data[uuid] || "";
        }
        return result;
    }).filter(item => {
        // 核心：只保留 采集方式 有值的行
        return !!item["采集方式"];
    });

    const strArr = filteredList.map(obj => {
        return `${obj["采集方式"]}^^^^${obj["医生嘱托"]}^`;
    });
    return strArr.join("|");
}
