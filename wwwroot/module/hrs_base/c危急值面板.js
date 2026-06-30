
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


// 查询参数
let theParts = {
    开始日期: null,
    结束日期: null,
    天数: null
}

const 界面图形 = [
    {
        "名称": "全院30日内新增危急值",
        "类型": 1,
        "对象": null,
        "资源": "e779dd98-d9d7-4b44-a17f-46a24bd353fb",
        "视图": "c729ba55-e8d4-4ef6-8722-bccfabe953b8",
        "params": {
            "开始日期": "513834bc-71dd-4ad2-ad6d-dda85ecce678",
            "天数": "8e17fabc-c030-4939-8a76-ab3ef07dca92"
        }
    },
    {
        "名称": "全院30日内危急值平均确认时长",
        "类型": 1,
        "对象": null,
        "资源": "a8fc48f4-ff45-4ec0-bfb9-19daadaf8728",
        "视图": "d5e4f15d-e491-46eb-97d2-0f0e4d65b030",
        "params": {
            "开始日期": "f5981b74-f7b6-4215-8569-d4ed15f89854",
            "天数": "b0f5b69e-b3d8-48f7-9832-cc77c5f72542"
        }
    },
    {
        "名称": "全院30日内前十危急值确认人",
        "类型": 1,
        "对象": null,
        "资源": "ea10783c-8347-4b5b-b2d1-2356f3d9621e",
        "视图": "b87fe3e3-48de-4963-988c-20f8c3c4773d",
        "params": {
            "开始日期": "6fef5044-ddf9-44c9-bd23-22f9c869ea5d",
            "天数": "b4b2c596-0bc2-4048-8c85-26b1b965a14c"
        }
    },
    {
        "名称": "各科室平均处理时长_列表1",
        "类型": 1,
        "对象": null,
        "资源": "ffcb3c11-5956-4a62-87cc-42292b05986c",
        "视图": "d176e0b3-dcf2-45bb-a1b5-62ce2646c727",
        "params": {
            "开始日期": "530293a1-c6e4-4fdd-af29-fbd12499b291",
            "结束日期": "3dc6fb3f-496d-4ad7-9f4c-09c16715ee18"
        }
    },
    {
        "名称": "全院30日内前十危急值项目",
        "类型": 1,
        "对象": null,
        "资源": "afb34927-4ec0-40a6-bc16-11dcea9ffd7d",
        "视图": "dd2e55e3-b23a-4a6f-8fbc-b1795669abe3",
        "params": {
            "开始日期": "5ed47698-e452-4455-8ef8-5248a00e8e51",
            "结束日期": "652379ff-be72-4991-8011-77f41642a6d8"
        }
    },
    {
        "名称": "全院30日内前十危急值科室",
        "类型": 1,
        "对象": null,
        "资源": "d0f2f994-66ca-4152-9a7c-556d6f011ad7",
        "视图": "ebdf8c34-1f82-45f2-a140-5515cd555958",
        "params": {
            "开始日期": "7add00d2-1ad3-4e1e-9a89-da7f74bcce68",
            "结束日期": "bc297b03-583e-4900-8855-485b6689b63a"
        }
    }
]

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
    theParts.开始日期 = document.getElementById('d0c00753-b2b1-446a-ae5a-d3518eecff24');
    theParts.结束日期 = document.getElementById('6eb1c72c-2ec7-460c-8803-40a8ca7362e7');

    界面图形.forEach(item => {
        if (item["类型"] == 0) {
            item["对象"] = pageContent.GetComponents(item["名称"])[0].component.firstChild;
        }
        else {
            item["对象"] = pageContent.GetComponents(item["名称"])[0].component;
        }
    });

    theParts.开始日期.onchange = function () {
        ViewChangeShow();
    };

    theParts.结束日期.onchange = function () {
        ViewChangeShow();
    };

    ViewChangeShow();
}

//重新加载界面显示
window.ViewChangeShow = function () {
    var qpar = {};
    qpar.begin_time = theParts.开始日期.value;
    qpar.end_time = theParts.结束日期.value;
    qpar.fullDays = 0;
    GetTimeDays(qpar);
    if (qpar.fullDays == 0) return;

    theParts.天数 = {};
    theParts.天数.value = qpar.fullDays;

    let input = { "resTypeId": "xxx", "viewId": "xxx", "row": 0, "source": "资源类型", "matching": [] };

    //循环界面对象取数据
    for (let i = 0; i < 界面图形.length; i++) {
        let theItem = 界面图形[i];
        input["resTypeId"] = theItem["资源"];
        input["viewId"] = theItem["视图"];

        input["matching"] = [];
        let keys = Object.keys(theItem.params);
        keys.forEach((key, index) => {
            let item = {
                relId: theItem.params[key],
                compare: "=",
                val: theParts[key].value,
            }
            input["matching"].push(item);
        })
        let ret = HrsServer.Post("/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId", JSON.stringify(input));
        if (ret.Success) {
            theItem["对象"].data = ret.Data;
        }
    }
}

//计算日期之间的天数
function GetTimeDays(data) {
    const beginTs = new Date(data.begin_time).getTime();
    const endTs = new Date(data.end_time).getTime();
    const oneDayMs = 24 * 60 * 60 * 1000;
    // 先校验：结束时间必须大于开始时间
    if (endTs <= beginTs) {
        console.error("校验失败：结束时间不能小于等于开始时间");
    } else {
        const diffMs = endTs - beginTs;
        const fullDays = Math.floor(diffMs / oneDayMs);
        const floatDays = diffMs / oneDayMs;
        data.fullDays = fullDays;
    }
}