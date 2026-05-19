
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
    _编码选项: null,
    _分类说明: null,
    _诊疗类别: null,
    _操作类型: null,
    _操作类型标签: null
};

function fun控件对象映射() {
    _界面控件._编码选项 = GetSimpleNodeVal("", "c506961a-4b99-42c7-9f9d-ca37bd7e74d3", "c8214828-726b-48b9-8a13-b8dc274cd205", "", 1);
    _界面控件._编码选项 = _界面控件._编码选项[0];
    _界面控件._操作类型 = $("#" + mapGuid._操作类型);
    _界面控件._诊疗类别 = $("#" + mapGuid._诊疗类别);
    _界面控件._操作类型标签 = $("[data-owner-id='" + mapGuid._操作类型 + "'] .record-label")
    _界面控件._分类说明 = $("#" + mapGuid._分类说明);
    _界面控件._执行频率 = $("#" + mapGuid._执行频率);
    _界面控件._计算方式 = $("#" + mapGuid._计算方式);
    _界面控件._计算单位 = $("#" + mapGuid._计算单位);
    _界面控件._服务对象 = $("#" + mapGuid._服务对象);
    _界面控件._执行科室性质 = $("#" + mapGuid._执行科室性质);
    _界面控件._录入限量 = $("#" + mapGuid._录入限量);
    _界面控件._录入限量应用于 = $("#" + mapGuid._录入限量应用于);
    _界面控件._项目分类 = $("#" + mapGuid._项目分类);
    _界面控件._检验标本 = $("#" + mapGuid._检验标本);
    _界面控件._诊疗频率 = $("#" + mapGuid._诊疗频率);
    _界面控件._名称 = $("#" + mapGuid._名称);
    _界面控件._编码 = $("#" + mapGuid._编码);
    _界面控件._简码 = $("#" + mapGuid._简码);
    _界面控件._简码五笔 = $("#" + mapGuid._简码五笔);
    _界面控件._别名 = $("#" + mapGuid._别名);
    _界面控件._别名简码 = $("#" + mapGuid._别名简码);
    _界面控件._别名简码五笔 = $("#" + mapGuid._别名简码五笔);
    _界面控件._适用性别 = $("#" + mapGuid._适用性别);
    _界面控件._站点 = $("#" + mapGuid._站点);
    _界面控件._参考项目 = $("#" + mapGuid._参考项目);
    _界面控件._使用科室 = $("#" + mapGuid._使用科室);
    _界面控件._启用时间 = $("#" + mapGuid._启用时间);
    _界面控件._检验标本 = $("#" + mapGuid._检验标本);
    _界面控件._指标互认 = $("#" + mapGuid._指标互认);
    _界面控件._英文缩写 = $("#" + mapGuid._英文缩写);
    _界面控件._执行安排 = $("#" + mapGuid._执行安排);
    _界面控件._单独应用 = $("#" + mapGuid._单独应用);
    _界面控件._计算规则 = $("#" + mapGuid._计算规则);
    _界面控件._手术标准编码 = $("#" + mapGuid._手术标准编码);
    _界面控件._按规则计费 = $("#" + mapGuid._按规则计费);
    _界面控件._床旁术中 = $("#" + mapGuid._床旁术中);
    _界面控件._号别名称 = $("#" + mapGuid._号别名称);
    _界面控件._适用性别 = 0;
    _界面控件._诊疗类别.val("C");//默认检验   
    fun诊疗类别切换("C");
    fun修改项目数据加载();
}

const mapGuid = {
    _号别名称: "1721357e-cfb3-46f8-bd35-3d93240feb4f",
    _手术标准编码: "89cf63ac-5288-4f30-a267-87e0349cb9fc",
    _按规则计费: "d7af641d-5fa2-413a-994c-a4ed616609e8",
    _床旁术中: "21f87ebe-af8c-483c-9587-bfd0be12b24a",
    _计算规则: "a2c78150-b747-4c0e-b382-cdff0ef5498b",
    _名称: "0a42e1c7-07b6-4b18-ae76-60fedbb4b1e8",
    _编码: "2c638d4a-e078-47cb-bfee-4b764f7b3c9f",
    _简码: "2421d2d6-e87c-4f0d-8a30-baffdd6ad799",
    _简码五笔: "d2ef7bf5-a070-4719-bf94-50177ce9a89a",
    _别名: "5e17e549-558f-4078-9108-40b006ccd0ec",
    _别名简码: "796b73ef-3b86-4b67-a556-e74b0fc56038",
    _别名简码五笔: "75aa43e4-59bd-4b5b-aca9-cd16a6941051",
    _适用性别: "b72fddc9-1c15-4508-8308-8377fada9aed",
    _站点: "5db43104-d881-468d-b5f9-2cc49579622b",
    _参考项目: "9cb058be-aa95-4a08-8bdd-cd3cd2c1bd2d",
    _使用科室: "3f220b4b-6124-470f-bae6-ea099417d916",
    _启用时间: "4a9194cb-3fd4-4014-8229-300566a6ff02",
    _诊疗频率: "a3dc8991-6bff-4e0c-8e6b-3a650d995208",
    _检验标本: "e8922a7f-2b0a-448f-96cc-59cb72b8c5fc",
    _项目分类: "1262bf6d-ba20-43ae-8177-2bcf4e81f493",
    _录入限量: "1e507659-dc89-477f-83c4-741b5a7cdfef",
    _录入限量应用于: "e5aad92c-1d11-4dce-9873-d300125fc28f",
    _执行科室性质: "0adfc2b1-32ea-4db4-89a9-712e0c72a08b",//_执行科室性质
    _服务对象: "d3b1eab4-1932-4001-bb7e-832197c158b9",//服务对象
    _计算单位: "acbdda8e-4486-420d-a5cf-8adfd85265d4",//计算单位
    _执行频率: "6b83fe8f-8d9c-435e-9b5e-ff0ba6e24eb4",//执行频率
    _计算方式: "3fb77845-6f7b-46dc-b3b5-c49bfd72f399",//计算方式
    _诊疗类别: "19ee0d31-e1a6-444d-afd6-2e86cad96092",//诊疗类别
    _操作类型: "c8b2f6a5-a05d-4c0e-9d00-29a4a43edd70",//操作类型
    _分类说明: "bde17ccf-199f-4f29-858e-eab74ddedc3e",//分类说明
    _检验标本: "e8922a7f-2b0a-448f-96cc-59cb72b8c5fc",
    _指标互认: "d0949832-8924-42e4-83cd-45914c7cd7c2",
    _英文缩写: "02c6af90-6c19-40bf-941e-057cc7dc435d",
    _执行安排: "86f80c6d-5383-4b4b-8d0a-4ab6b767e19f",
    _单独应用: "54e90833-ab1d-4975-9b23-04326dc1c88e",

    _页卡: "a1ae4553-3636-4255-a371-711b196832c1",
    _t项目属性: 0, _t执行科室: 1, _t检查部位: 2, _t皮试结果: 3, _t频率设置: 4, _t项目组合: 5, _t附加属性: 6,
    _手术操作类型: "2ff9ab26-b488-452d-a0b1-4988b1613758",
    _治疗操作类型: "5629f974-765a-44fa-b26d-cfe799cc4fb8",
    _其他操作类型: "398278f4-361d-4151-a746-bfbb81e6d78c",
    _量表评估方式: "ad96096b-2794-4df1-88c8-62fa9a67bfd0",
    _执行频率三: "41d59f55-9ff7-49e3-ab9b-27223e5bdf0c",
    _计算规则选项: "81ee1eb8-5c9c-4a3e-92ca-2d2708a9fe76",
    _麻醉操作类型: "b72993c8-a43c-4cb6-8f8a-a96068c3b8fe",
    _煎法计算方式: "8f65e85a-2802-4b01-a71d-fe334809f6c1",
    _检查操作类型: "ffc0cb9f-16f6-4d73-a548-6128bb147f71",
    _执行频率二: "600911a5-fd08-4b58-9042-dc780c56f10e",
    _输液类型: "4a50c7d5-0578-401e-9663-a6afd319d3d8",
    _煎法执行分类: "94029567-b1a9-478f-9ff5-0dad498c5644",
    _检验操作类型: "4f1b2382-ca2e-4bd6-a6ec-02955c362e57",
    _计算方式选项: "c7236b25-e205-4a22-add5-611e6c0e728d",
    _给药执行分类: "5364509e-29ad-4c65-bea7-d36b0c3edbbd",
    _服法执行分类: "9a0436be-6542-4185-8b6d-805691745c25",
    _护理操作类型: "a9760bad-1d10-4ede-a1e9-7c5cbe5a6642",
    _执行频率一: "cbc9fc2a-e2f0-4c60-b3fa-86c46cdb9897",
    _执行科室性质选项: "ae0d5b81-cdc9-48af-bdd9-b9cc309c6ed3",
    _病理类别选项: "8edef8d7-5748-4aa1-a287-608eda941dc0",
    _视图区域: {
        _检验相关: "com_7rndcmrftzv",
        _检查相关: "com_0957jpk314wc",
        _手术相关: "com_uz4wkcfgj9",
        _其它相关: "com_bzd3rlwp77b"
    }
}

function fun修改项目数据加载() {
    if (2 == _界面控件._参数._编辑状态) {
        _界面控件._参数._项目数据 = GetSimpleNodeVal(_界面控件._参数._诊疗项目id, "c1f32ce8-42f1-4519-a6f6-95332ea75516", "8d3a7de9-100a-4dc5-a7a0-b3a9680baf31", "1679487d-8564-45cc-a221-6f2461e19719", 1);
        _界面控件._参数._项目数据 = _界面控件._参数._项目数据[0];

        const obj = _界面控件._参数._项目数据;

        fun诊疗类别切换(obj[mapGuid._诊疗类别]);

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
        _界面控件._操作类型.val(obj["845eb27c-e7b7-473f-8759-8c1aab2dd732"]);
        _界面控件._检验标本.val(obj["963031a0-d203-43a1-bc0d-97d0c30afbd6"]);
        fun操作类型切换(_界面控件._操作类型.val());
        fun执行频率切换();
    }
}

function fun设置视图区域可见性(keyid, isShow) {
    if (isShow) {
        $(`[data-id='${keyid}']`).show();
    } else {
        $(`[data-id='${keyid}']`).hide();
    }
}

function fun设置控件可见性(keyid, isShow) {
    if (isShow) {
        $(`[data-owner-id='${keyid}']`).show();
    } else {
        $(`[data-owner-id='${keyid}']`).hide();
    }
}

function fun设置控件可编辑(obj控件, isEdit) {
    if (isEdit) {
        obj控件.attr("disabled", false);
    } else {
        obj控件.attr("disabled", true);
    }
}

function fun加载编码项目(obj控件, keyid) {
    obj控件.attr("data-option-code-list", _界面控件._编码选项[keyid]);
    obj控件.val(_界面控件._编码选项[keyid].split('|')[0]);//赋缺省值
}

function fun显示页卡(index, bln隐藏) {
    if (bln隐藏) {
        $(`#${mapGuid._页卡} .nav-item .nav-link`).eq(index).hide();
    } else {
        $(`#${mapGuid._页卡} .nav-item .nav-link`).eq(index).show();
    }

}

function fun选中页卡(index) {
    $(`#${mapGuid._页卡} .nav-item .nav-link`).eq(index).show();
    $(`#${mapGuid._页卡} .nav-link`).eq(index).addClass('active');
    $(`#${mapGuid._页卡} .tab-pane`).eq(index).addClass('active show');
}

function fun初始执行频率(type) {
    if (type == "C" || type == "D") {
        fun加载编码项目(_界面控件._执行频率, mapGuid._执行频率一);
    } else if (type == "H") {
        fun加载编码项目(_界面控件._执行频率, mapGuid._执行频率二);
    } else {
        fun加载编码项目(_界面控件._执行频率, mapGuid._执行频率三);
    }
}

function fun执行频率切换() {
    if (_界面控件._执行频率.val() == "0" && _界面控件._诊疗类别.val() != "C") {
        fun显示页卡(mapGuid._t频率设置);
    } else {
        fun显示页卡(mapGuid._t频率设置, true);
    }
    if (_界面控件._执行频率.val() == "0") {
        fun设置控件可见性(mapGuid._计算规则, true);
    } else {
        fun设置控件可见性(mapGuid._计算规则, false);
    }
}

function fun操作类型切换(oper) {
    let type = _界面控件._诊疗类别.val();
    fun加载编码项目(_界面控件._计算方式, mapGuid._计算方式选项);

    if (type == "D" && oper == "病理") {
        fun设置控件可见性(mapGuid._号别名称, true);
    } else {
        fun设置控件可见性(mapGuid._号别名称, false);
    }

}
function fun界面页卡切换(tab) {
    if (_界面控件._执行科室性质.length == 0) {
        console.log("第一次加载");
        _界面控件._执行科室性质 = $("#" + mapGuid._执行科室性质);
        fun加载编码项目(_界面控件._执行科室性质, mapGuid._执行科室性质选项);
    }
    _界面控件._执行科室性质 = $("#" + mapGuid._执行科室性质);
    if (_界面控件._执行科室性质.attr("data-option-code-list") != _界面控件._编码选项[mapGuid._执行科室性质选项]) {
        fun加载编码项目(_界面控件._执行科室性质, mapGuid._执行科室性质选项);
    }
}

window.GetCitemSaveJsonPar = function () {
    debugger
    var parData = {}, temp = null, objItem = null;
    let urlPar = new URLSearchParams(location.search);
    let editsta = urlPar.get("editsta");
    parData.功能 = 1;//1-新增，2-修改
    if (editsta) {
        parData.功能 = Number(editsta);
        if (2 == parData.功能) {
            parData.记录id = Number(urlPar.get("item_id"));
        }
    }
    let userInfo = JSON.parse(sessionStorage.UserLoginInfo);
    parData.UserName = userInfo.account_extend.UserName;
    parData.AccountName = userInfo.account_extend.AccountName;
    parData.staff_id = userInfo.staff_id;
    parData.分类id = parseInt(_界面控件._项目分类.val() || 0);
    parData.诊疗类别 = _界面控件._诊疗类别.val();
    parData.名称 = _界面控件._名称.val();
    parData.编码 = _界面控件._编码.val();
    parData.简码 = _界面控件._简码.val();
    parData.简码五笔 = _界面控件._简码五笔.val();
    parData.别名 = _界面控件._别名.val();
    parData.别名简码 = _界面控件._别名简码.val();
    parData.别名简码五笔 = _界面控件._别名简码五笔.val();
    parData.适用性别 = parseInt(_界面控件._适用性别.val() || 0);

    temp = _界面控件._服务对象.val();
    parData.适用体检 = 0;
    if (temp.includes(3)) {
        parData.适用体检 = 1;
        parData.服务对象 = 4;
    }
    if (temp.includes(2) && temp.includes(1)) {
        parData.服务对象 = 3;
    } else if (temp.includes(2)) {
        parData.服务对象 = 2;
    } else if (temp.includes(1)) {
        parData.服务对象 = 1;
    }

    parData.站点 = _界面控件._站点.val();

    parData.参考项目id = parseInt(_界面控件._参考项目.val() || 0);
    parData.参考项目id = parData.参考项目id == 0 ? null : parData.参考项目id;

    parData.使用科室 = _界面控件._使用科室.val();
    parData.启用时间 = _界面控件._启用时间.val();

    parData.执行安排 = parseInt(_界面控件._执行安排.val() || 0);
    parData.单独应用 = parseInt(_界面控件._单独应用.val() || 0);
    parData.计算单位 = _界面控件._计算单位.val();//计算单位
    parData.执行频率 = parseInt(_界面控件._执行频率.val() || 0);
    parData.计算方式 = parseInt(_界面控件._计算方式.val() || 0);
    parData.计算规则 = parseInt(_界面控件._计算规则.val() || 0);
    parData.操作类型 = _界面控件._操作类型.val();

    if (parData.诊疗类别 == "C") {
        parData.标本部位 = _界面控件._检验标本.val(); //默认标本        
        parData.英文缩写 = _界面控件._英文缩写.val(); //英文缩写
        parData.指标互认 = _界面控件._指标互认.val(); //指标互认          
        parData.组合项目 = 1;
        parData.计算方式 = 3;
    } else if (parData.诊疗类别 == "D") {
        parData.手术操作ids = _界面控件._手术标准编码.val();
        parData.按规则计费 = parseInt(_界面控件._按规则计费.val() || 0);
        if (parData.服务对象 == 2 || parData.服务对象 == 3) {
            parData.执行标记 = parseInt(_界面控件._床旁术中.val() || 0);
        } else {
            parData.执行标记 = 0;
        }
        parData.计算方式 = 3; parData.执行分类 = 0;
        if (parData.操作类型 == "病理") {
            parData.执行分类 = parseInt(_界面控件._号别名称.val() || 0);
        }
    }

    //执行科室
    parData.执行科室 = 1;
    if (_界面控件._执行科室性质) {
        parData.执行科室 = parseInt(_界面控件._执行科室性质.val() || 0);
    }

    //门认住院执行科室
    if (parData.执行科室 == 4) {
        temp = $("[data-id='com_3tg2waf0ofp']")[0].firstElementChild.GetCurrentData();
        if (temp) {
            parData.门诊执行科室id = Number(temp["fa0620eb-4d35-49cb-a11a-5522a773b78b"] || 0);
            parData.住院执行科室id = Number(temp["837bc97c-97b0-416b-898a-3bd204f114f2"] || 0);

            parData.门诊执行科室id = parData.门诊执行科室id == 0 ? null : parData.门诊执行科室id;
            parData.住院执行科室id = parData.住院执行科室id == 0 ? null : parData.住院执行科室id;
        }
        temp = localStorage.getItem("citem_exe_depts");
        if (temp) {
            temp = JSON.parse(temp);
            if (temp.length > 0) {
                //指定开单执行科室
                parData.定向执行 = generateFullString(temp);
            }
        }
    }

    parData = { "Json_In": JSON.stringify(parData) }
    return parData;
}

function fun编辑项目检查检验(bln检验) {

    _界面控件._执行频率.val("1");
    fun设置控件可编辑(_界面控件._执行频率, true);
    _界面控件._计算方式.val("3");
    fun设置控件可编辑(_界面控件._计算方式, false);
    _界面控件._计算单位.val("次");
    _界面控件._服务对象.val("1,2");
    _界面控件._执行科室性质.val("1");

    fun加载编码项目(_界面控件._操作类型, bln检验 ? mapGuid._检验操作类型 : mapGuid._检查操作类型);
    _界面控件._操作类型标签.text(bln检验 ? "检验类型" : "检查类型");

    fun设置控件可编辑(_界面控件._录入限量, false);
    fun设置控件可编辑(_界面控件._录入限量应用于, false);

    fun设置视图区域可见性(mapGuid._视图区域._检验相关, bln检验);
    fun设置视图区域可见性(mapGuid._视图区域._检查相关, !bln检验);
    fun设置视图区域可见性(mapGuid._视图区域._手术相关, false);
    fun设置视图区域可见性(mapGuid._视图区域._其它相关, false);

    fun设置控件可见性(mapGuid._诊疗频率, false);
    fun设置控件可见性(mapGuid._单独应用, !bln检验);

    fun执行频率切换();
}

window.fun诊疗类别切换 = function (type) {
    const tabList = $(`#${mapGuid._页卡} .nav-item .nav-link`);
    tabList.hide();
    tabList.removeClass("active");
    $(`#${mapGuid._页卡} .tab-pane`).removeClass('active show');

    fun选中页卡(mapGuid._t项目属性);

    if (type == "D") {
        fun显示页卡(mapGuid._t项目属性);
        fun显示页卡(mapGuid._t执行科室);
        fun显示页卡(mapGuid._t检查部位);
        fun显示页卡(mapGuid._t项目组合);
    } else if (type == "E") {
        fun显示页卡(mapGuid._t项目属性);
        fun显示页卡(mapGuid._t执行科室);
        fun显示页卡(mapGuid._t项目组合);
    } else if (type == "M" || type == "Z") {
        fun显示页卡(mapGuid._t项目属性);
        fun显示页卡(mapGuid._t执行科室);
        fun显示页卡(mapGuid._t频率设置);
    } else {
        fun显示页卡(mapGuid._t项目属性);
        fun显示页卡(mapGuid._t执行科室);
    }

    fun初始执行频率(type);

    fun设置控件可见性(mapGuid._操作类型, true);
    fun设置控件可见性(mapGuid._号别名称, false);

    fun加载编码项目(_界面控件._计算规则, mapGuid._计算规则选项);
    fun加载编码项目(_界面控件._号别名称, mapGuid._病理类别选项);

    //操作类型控件处理
    switch (type) {
        case "C":
            fun编辑项目检查检验(true);
            break;
        case "D":
            fun编辑项目检查检验(false);
            break;
        case "E":
            fun加载编码项目(_界面控件._操作类型, mapGuid._治疗操作类型);
            _界面控件._操作类型标签.text("处置性质");
            fun设置控件可编辑(_界面控件._录入限量, true);
            fun设置控件可编辑(_界面控件._录入限量应用于, true);
            break;
        case "F":
            fun加载编码项目(_界面控件._操作类型, mapGuid._手术操作类型);
            _界面控件._操作类型标签.text("手术规模");
            break;
        case "G":
            fun加载编码项目(_界面控件._操作类型, mapGuid._麻醉操作类型);
            _界面控件._操作类型标签.text("麻醉类型");
            break;
        case "H":
            fun加载编码项目(_界面控件._操作类型, mapGuid._护理操作类型);
            _界面控件._操作类型标签.text("项目类型");
            break;
        case "I":
            fun设置控件可见性(mapGuid._操作类型, false);
            break;
        case "K":
            fun设置控件可见性(mapGuid._操作类型, false);
            break;
        case "L":
            fun设置控件可见性(mapGuid._操作类型, false);
            break;
        case "M":
            fun设置控件可见性(mapGuid._操作类型, false);
            break;
        case "Z":
            fun加载编码项目(_界面控件._操作类型, mapGuid._其他操作类型);
            _界面控件._操作类型标签.text("特殊标志");
            break;
        default:
            break;
    }
}
/**
 * 组件加载完成事件处理
 * @param {PageContent} pageContent
*/
page.onComponentLoaded = (pageContent) => {
    //增加样式
    const style = document.createElement('style');
    style.textContent = `
   .view-table-table-name:not(#b31c7464-0045-49d5-b412-833c2a9c96a6 .view-table-table-name) {
      display: none !important;
    }`;
    // .lay_draggable-component-wrapper:not(#) {border:1px solid #ccc} 
    document.head.appendChild(style);
}

/**
 * 页面载入完成事件处理
 * @param {PageContent} pageContent
*/
page.onLoaded = (pageContent) => {
    let urlPar = new URLSearchParams(location.search);
    let class_id = parseInt(urlPar.get("class_id") || 0);
    let item_id = parseInt(urlPar.get("item_id") || 0);
    let editsta = parseInt(urlPar.get("editsta") || 0);//编辑状态 1-新增，2-修改
    _界面控件._参数._诊疗项目id = item_id;
    _界面控件._参数._分类id = class_id;
    _界面控件._参数._编辑状态 = editsta;
    debugger
    fun控件对象映射();
    _界面控件._项目分类.val(class_id);
    if (1 == _界面控件._参数._编辑状态) {
        let tempVal = GetSimpleNodeVal("", "b12bf15a-eebb-44cb-813e-9f43dffe5593", "827358ad-99bc-447a-969f-fb2343103671", "a99c0fb8-e887-431e-9817-c5b3f16bdf02", "21ec4abc-26aa-42b4-9071-077c245aea1a");
        $("#" + mapGuid._编码).val(IncStr(tempVal));//编码 
    }
    $("#" + mapGuid._诊疗类别).on("change", function () {
        fun诊疗类别切换($(this).val());
    });
    $("#" + mapGuid._操作类型).on("change", function () {
        fun操作类型切换($(this).val());
    });

    $("#" + mapGuid._执行频率).on("change", function () {
        fun执行频率切换();
    });

    $("#" + mapGuid._页卡).on("change", function () {
        fun界面页卡切换($(this).val());
    });

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