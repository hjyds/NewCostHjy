
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
    _名称: "0a42e1c7-07b6-4b18-ae76-60fedbb4b1e8",
    _编码: "2c638d4a-e078-47cb-bfee-4b764f7b3c9f",
    _简码: "2421d2d6-e87c-4f0d-8a30-baffdd6ad799",
    _简码五笔: "d2ef7bf5-a070-4719-bf94-50177ce9a89a",
    _别名: "5e17e549-558f-4078-9108-40b006ccd0ec",
    _别名简码: "796b73ef-3b86-4b67-a556-e74b0fc56038",
    _别名简码五笔: "75aa43e4-59bd-4b5b-aca9-cd16a6941051"
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
    $("#" + mapGuid._名称).on("change", function () {
        //项目名称
        $("#" + mapGuid._简码).val(GetPyCode($(this).val()));
        $("#" + mapGuid._简码五笔).val(GetWbCode($(this).val()));
    });

    $("#" + mapGuid._别名).on("change", function () {
        //项目别名
        $("#" + mapGuid._别名简码).val(GetPyCode($(this).val()));
        $("#" + mapGuid._别名简码五笔).val(GetWbCode($(this).val()));
    });

    Get缺省编码();
    SetTabTo免煎(); 
}

/**
 * 将面页定位到免煎剂
 *  
 */
function SetTabTo免煎() {
    let data = $("[data-id='com_m9ex15zms58']")[0]?.firstElementChild?.data
    if (data) {
        //对应资源  形态 字段，
        if (data["019fb330-8fd7-7d93-a818-74a75b14ef12"] == 2) {
            const tabs = document.querySelectorAll('.nav-tabs .nav-link');
            for (let tab of tabs) {
                if (tab.textContent.trim() === '免煎剂') {
                    tab.click();
                    break;
                }
            }
        }
    }
}

/**
 * 字符串自动加1
 * 数字按十进制进位，字母A-Z按26进制进位
 * @param {string} strVal 原始字符串
 * @returns {string} 加1后字符串
 */
function IncStr(strVal) {
    let intAdd = 0;
    let intUp = 0;
    let strValue = "";
    let strValueOne = "";

    // 统一转大写
    strVal = strVal.toUpperCase();

    for (let i = strVal.length; i >= 1; i--) {
        intAdd = i === strVal.length ? 1 : 0;
        strValueOne = strVal.substring(i - 1, i);

        if (!isNaN(Number(strValueOne))) {
            // 数字位
            if (Number(strValueOne) + intAdd + intUp < 10) {
                strValue = String.fromCharCode(strValueOne.charCodeAt(0) + intAdd + intUp) + strValue;
                intUp = 0;
            } else {
                strValue = "0" + strValue;
                intUp = 1;
            }
        } else {
            // 字母位 A-Z
            if (strValueOne.charCodeAt(0) + intAdd + intUp <= "Z".charCodeAt(0)) {
                strValue = String.fromCharCode(strValueOne.charCodeAt(0) + intAdd + intUp) + strValue;
                intUp = 0;
            } else {
                strValue = "A" + strValue;
                intUp = 1;
            }
        }
    }

    // 最高位仍有进位
    if (intUp === 1) {
        strValue = !isNaN(Number(strValueOne)) ? "1" + strValue : "A" + strValue;
    }

    return strValue;
}

/**
 * 如果是新增状态，获取缺省编码
 * @returns
 */
function Get缺省编码() {
    let urlPar = new URLSearchParams(location.search);
    let tempId = parseInt(urlPar.get("citem_id") || 0);
    if (tempId > 0) return tempId

    //获取缺省编码
    let lng分类id = parseInt(urlPar.get("ctype_id") || 0);

    let tempVal = GetSimpleNodeVal(lng分类id,
        "d9a8b34b-445f-47e5-89f9-90663a49d92f",
        "f2ea9379-af8c-4f91-85a7-ca48bdc0a4ca",
        "7b32f2e2-fc3a-4d57-9823-4e893d7d9437",
        "0f6baa1f-2e02-431d-a474-964a57f5b4c3");

    $("#019fb5a2-5930-7205-a616-6519fce89c8e").val(IncStr(tempVal));//编码 

}

//拼音简码
window.GetPyCode = function (str) {
    return GetSimpleNodeVal(str, "bebd4263-bfd5-4a5e-a204-16aee4c7e238", "244c7616-07c2-43c6-9390-523a764a17de", "50f1915c-86a3-4509-9f7b-93c0d714b422", "1a4a428b-693b-4490-b508-34281bdd019f");
}

//五笔简码
window.GetWbCode = function (str) {
    return GetSimpleNodeVal(str, "bafe79e3-fff8-4468-97dc-ba708b45b798", "e13d89bc-f50c-4973-ae25-321bea7d5de0", "bca2f71a-3899-4386-be31-36607ce93488", "8be505d7-e4db-4e39-b21b-1fdc6e67f63f");
}

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

/**
 * 获取保存前的参数值
 * @returns
 */
window.GetEditDataToSave = function () {
    let parData = {
        "功能": 1,                 // Number: 1-新增, 2-修改, 3-删除
        "记录id": 0,               // Number: 新增可传0，修改传已有ID
        "分类id": 123,             // Number
        "编码": "CF001",           // String
        "名称": "中药协定处方A",    // String
        "简码": "ZYXDCF",          // String
        "简码五笔": "XXXX",        // String
        "别名": "协定方A",         // String
        "别名简码": "XDF",         // String
        "别名简码五笔": "XXXX",    // String
        "说明": "处方说明",        // String
        "频次": "bid",             // String
        "煎法id": 1001,           // Number
        "用法id": 2001,           // Number
        "疗程": "7",             // String 字符型，纯数字
        "参考目录id": null,          // Number
        "配方组成": "", // String 特殊格式：以"|"分隔的配方组成，每条记录按"药名ID^规格ID^单味用量^煎服脚注"组织
        "站点": "",            // String
        "配方类型": "1",          // String
        "是否保密": 0,            // Number
        "是否修正": 0,            // Number
        "药房": "3001",           // String 字符型，纯数字
        "人员id": 90001,          // Number --为空时为公开配方 非空时为个人私有配方
        "UserName": "张三",        // String
        "AccountName": "zhangsan", // String
        "staff_id": 90001         // Number
    };
    let d编码 = $("[data-id='com_lefjclxwm4s']")[0]?.firstElementChild?.data;
    parData.记录id = parseInt(d编码["019fb312-6784-763c-bbb5-11ba871cd288"] || 0);
    parData.分类id = parseInt(d编码["019fb5a2-5930-7b2a-9266-4236a571fc41"] || 0);
    parData.说明 = d编码["019fb5a2-5930-7eed-96cf-68ba7f7e4ac4"] || "";
    parData.编码 = d编码["019fb5a2-5930-7205-a616-6519fce89c8e"] || "";

    let d名称 = $("[data-id='com_iyng65u59c']")[0]?.firstElementChild?.data;

    parData.名称 = d名称["0a42e1c7-07b6-4b18-ae76-60fedbb4b1e8"] || "";
    parData.简码 = d名称["2421d2d6-e87c-4f0d-8a30-baffdd6ad799"] || "";
    parData.简码五笔 = d名称["d2ef7bf5-a070-4719-bf94-50177ce9a89a"] || "";
    parData.别名 = d名称["5e17e549-558f-4078-9108-40b006ccd0ec"] || "";
    parData.别名简码 = d名称["796b73ef-3b86-4b67-a556-e74b0fc56038"] || "";
    parData.别名简码五笔 = d名称["75aa43e4-59bd-4b5b-aca9-cd16a6941051"] || "";

    let d适用 = $("[data-id='com_m9ex15zms58']")[0]?.firstElementChild?.data;

    parData.药房 = d适用["019fb312-6784-7b98-bb2b-79bdf35acba5"] || "";
    parData.适用科室 = d适用["019fb312-6784-7d6c-9a1c-fa06bacae85d"] || "";//科室ID，拼串
    parData.适用人员 = d适用["019fb312-6784-7292-b03e-2b81592de7d9"] || "";//人员ID，拼串，只会有一个人员ID
    parData.适用范围 = d适用["019fb312-6784-7507-9ea7-a17138cd9126"] || "";//"个人" "科室" "全院"
    parData.服务对象 = d适用["019fb312-6784-790e-8a97-351771073645"] || "";//"1,2" 对应的服务对象这个字段
    parData.人员id = null;//对应的人员ID这个字段，适用范围为个人时才有值
    parData.UserName = null;
    parData.AccountName = null;
    parData.staff_id = null;

    let d用法 = $("[data-id='com_sv3v1mek4wc']")[0]?.firstElementChild?.data;

    parData.频次 = d用法["b77883fb-e4cc-43e5-8a40-e66fba05c417"] || "";
    parData.煎法id = parseInt(d用法["d544b9f7-6a46-48f3-a902-88c7288d29af"] || 0);
    parData.用法id = parseInt(d用法["710af26f-2ee9-401f-8837-3b2480e2f037"] || 0);
    parData.疗程 = d用法["6861f3a3-3cf9-4c27-b8c8-c83c25b853dc"] || "";
    parData.疗程 = parData.疗程 + "";//转成字符型

    let d页卡 = $("[data-id='com_s04qoupssx'] .nav-link.active").text().trim();

    let d药品 = null;
    let lst药品 = [];
    let key诊疗id = "", key规格id = "";//因为是两个表格，所以不一样
    if (d页卡 == "饮片") {
        parData.配方类型 = "1";
        d药品 = $("[data-id='com_lrocdwcdp']")[0]?.firstElementChild?.data;
        key诊疗id = "f9be283d-6220-4f4b-88a0-081771615875_019fb2b7-949f-704b-a09d-332b19467cc6";
        key规格id = "019fb2bb-33d7-74e2-8a4f-f0ab9de95f7c";
    } else {
        parData.配方类型 = "2";
        d药品 = $("[data-id='com_tshm1japmb']")[0]?.firstElementChild?.data;
        key诊疗id = "f7e6f51d-8379-4fb4-841d-b338ffc6b2ed_019fb2b9-0232-7bc2-b4ad-0774f6ba4d62";
        key规格id = "019fb2bb-33d7-7b8b-a302-402fc91aa6ae";
    }

    d药品.forEach(function (item) {
        lst药品.push({
            药名ID: parseInt(item[key诊疗id] || 0),
            规格ID: parseInt(item[key规格id] || 0),
            单次用量: parseFloat(item["019fb218-b247-7ee0-9bf8-d5a8bdbdf3a8"] || 0),
            医生嘱托: item["019fb218-b247-7eeb-b8a8-0049819bad0c"] || ""
        })
    });

    parData.配方组成 = buildRecipeComposition(lst药品);

    let urlPar = new URLSearchParams(location.search);
    let tempId = parseInt(urlPar.get("citem_id") || 0);

    if (tempId > 0) {
        parData.功能 = 2;
    } else {
        parData.功能 = 1;
    }

    debugger

    parData = { "Json_In": JSON.stringify(parData) };
    return parData;
}

/**
 * 配方组成数据结构转换
 */
function buildRecipeComposition(recipeList) {
    // 基础参数校验：非数组/空数组直接返回null
    if (!Array.isArray(recipeList) || recipeList.length === 0) return null;

    const parts = [];

    for (const item of recipeList) {
        // 单个药品项必须是对象，否则跳过
        if (!item || typeof item !== 'object') continue;

        // 取值并转为数字，空/undefined会转为NaN
        const drugNameId = Number(item.药名ID);
        const specId = Number(item.规格ID);
        const dosage = Number(item.单次用量);
        // 嘱托允许为空，无需数字校验
        const instruction = item.医生嘱托 ?? "";

        // 核心校验：药名ID、规格ID、单次用量必须大于0
        if (isNaN(drugNameId) || drugNameId <= 0) continue;
        if (isNaN(specId) || specId <= 0) continue;
        if (isNaN(dosage) || dosage <= 0) continue;

        // 拼接字段，ID用量还原原始字符串（不转数字，避免丢失原始格式）
        const seg = `${item.药名ID}^${item.规格ID}^${item.单次用量}^${instruction}`;
        parts.push(seg);
    }

    // 无合法药品返回null，有则用|拼接
    return parts.length > 0 ? parts.join("|") : null;
}