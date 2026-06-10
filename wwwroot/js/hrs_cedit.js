
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
    _操作类型标签: null,
    _检查部位加载: ""
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
    _界面控件._诊疗频率 = $("#" + mapGuid._诊疗频率);//弃用但是可能其它三方程序有可能会用
    _界面控件._执行分类 = $("#" + mapGuid._执行分类);
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
    _界面控件._给药大类 = $("#" + mapGuid._给药大类);
    _界面控件._手术项目标准编码 = $("#" + mapGuid._手术项目标准编码);
    _界面控件._输血检验对照 = $("#" + mapGuid._输血检验对照);

    _界面控件._其它分类说明 = $("#" + mapGuid._其它分类说明);
    _界面控件._其它毫升 = $("#" + mapGuid._其它毫升);
    _界面控件._其它尿量 = $("#" + mapGuid._其它尿量);
    _界面控件._其它脱敏 = $("#" + mapGuid._其它脱敏);
    _界面控件._其它源液 = $("#" + mapGuid._其它源液);
    _界面控件._其它量表学科 = $("#" + mapGuid._其它量表学科);
    _界面控件._其它管码 = $("#" + mapGuid._其它管码);
    _界面控件._其它出院日期 = $("#" + mapGuid._其它出院日期);
    _界面控件._计算系数 = $("#" + mapGuid._计算系数);
    _界面控件._评估方式 = $("#" + mapGuid._评估方式);
    _界面控件._输液类型 = $("#" + mapGuid._输液类型);

    _界面控件._适用性别.val(0);
    _界面控件._诊疗类别.val("C");//默认检验   
    fun诊疗类别切换("C");
    fun修改项目数据加载();

    _界面控件._项目分类.val(_界面控件._参数._分类id);
    if (1 == _界面控件._参数._编辑状态 || 3 == _界面控件._参数._编辑状态) {
        let tempVal = GetSimpleNodeVal("", "b12bf15a-eebb-44cb-813e-9f43dffe5593", "827358ad-99bc-447a-969f-fb2343103671", "a99c0fb8-e887-431e-9817-c5b3f16bdf02", "21ec4abc-26aa-42b4-9071-077c245aea1a");
        $("#" + mapGuid._编码).val(IncStr(tempVal));//编码 
        if (3 == _界面控件._参数._编辑状态) {
            $("#" + mapGuid._名称).val("");
            $("#" + mapGuid._简码).val("");
            $("#" + mapGuid._简码五笔).val("");
            $("#" + mapGuid._别名).val("");
            $("#" + mapGuid._别名简码).val("");
            $("#" + mapGuid._别名简码五笔).val("");
        }
    } 
}

const mapGuid = { 
    _其它分类说明: "bde17ccf-199f-4f29-858e-eab74ddedc3e",
    _其它毫升: "0b45eb53-1a67-4d88-80e6-a81e56852c86",
    _其它尿量: "8596d18e-0a07-47ce-b25e-c3f88d5a5afb",
    _其它脱敏: "8c4187c4-185a-4f51-8df2-7acde08aef26",
    _其它源液: "f42be17e-0b17-462f-af22-0680464a615a",
    _其它量表学科: "cae106a0-d552-44fd-b9b6-f872f2420c14",
    _其它管码: "701a4da1-c20a-4d98-93f1-40ef745b9335",
    _其它出院日期: "769b9617-63a3-498a-a354-2ee17b7ebe91",
    _计算系数: "c5df1613-266b-4cd3-8abc-f2f42e295472",
    _评估方式: "ac027ca7-60a9-4ced-8ba5-f4f856aefa67",
    _输液类型: "0caf7c4c-3efb-4526-88de-5f9d3536347a",

    //---表格列
    _皮试文字: "3d0171bd-4fd7-4b64-80cb-f43a33a09527",
    _皮试标注: "a188691a-60d2-484c-a9bd-e30bc6d5bfaf",
    _皮试过敏: "0c9fa8c0-4d8c-4822-9fb1-bfedd827331a",
    _频率选择: "c154a78c-5722-4696-90c0-66097ba1c696",
    _频率编码: "25cbc712-008a-4c4e-a4dd-563bd2d165af",

    _手术项目标准编码: "071cf29f-506f-409d-9ae3-79d537a63ed4",
    _输血检验对照: "d0ca14e4-bfeb-4e08-8dde-d9cdf897db3d",
    _号别名称: "1721357e-cfb3-46f8-bd35-3d93240feb4f", _给药大类: "1721357e-cfb3-46f8-bd35-3d93240feb4f",// 复用 给药大类
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
    _定向执行科室: "1737e69e-e661-47af-a510-7a3132427e98",
    _住院执行科室: "afc02460-afe5-4a8d-ab93-425c3b849370",
    _门诊执行科室: "e72ea1e2-775a-4c68-9f12-aeba6ceb6903",
    _启用时间: "4a9194cb-3fd4-4014-8229-300566a6ff02",
    _诊疗频率: "a3dc8991-6bff-4e0c-8e6b-3a650d995208", _执行分类: "a3dc8991-6bff-4e0c-8e6b-3a650d995208",// 执行分类 和 频率编码 复用
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
    _标本部位: "963031a0-d203-43a1-bc0d-97d0c30afbd6",

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
    _输液类型选项: "4a50c7d5-0578-401e-9663-a6afd319d3d8",
    _煎法执行分类: "94029567-b1a9-478f-9ff5-0dad498c5644",
    _检验操作类型: "4f1b2382-ca2e-4bd6-a6ec-02955c362e57",
    _计算方式选项: "c7236b25-e205-4a22-add5-611e6c0e728d",
    _给药执行分类: "5364509e-29ad-4c65-bea7-d36b0c3edbbd",
    _服法执行分类: "9a0436be-6542-4185-8b6d-805691745c25",
    _护理操作类型: "a9760bad-1d10-4ede-a1e9-7c5cbe5a6642",
    _执行频率一: "cbc9fc2a-e2f0-4c60-b3fa-86c46cdb9897",
    _执行科室性质选项: "ae0d5b81-cdc9-48af-bdd9-b9cc309c6ed3",
    _病理类别选项: "8edef8d7-5748-4aa1-a287-608eda941dc0",
    _诊疗频率选项: "ad532426-9c04-4f99-b354-9513a35c3dba",
    _给药大类选项: "6f1d77b6-a562-4a6e-874b-045f41dfba3d",
    _输血途径执行分类: "7ecd2e1b-d7af-4f6f-9b62-0c70be7ce8f2",
    _采血管选项: "e3a95f51-bcad-4426-95d3-7336c45179e9",
    _量表学科选项: "ce0efebc-02f1-4132-88d7-b8b884c313b2",

    _视图区域: {
        _指定开单执行科室: "com_i8wtppmisw",
        _检验相关: "com_7rndcmrftzv",
        _检查相关: "com_0957jpk314wc",
        _手术相关: "com_uz4wkcfgj9",
        _皮试标注: "com_i3l3u0fd60e",
        _可选频率: "com_hn2gant7sd",
        _其它相关: "com_bzd3rlwp77b"
    },
    _数据: {
        d执行标记: "c6315708-1b68-4768-9de4-44c16a417a04",
        d执行分类: "070a8189-3640-42a9-885c-014d4d5cc4b0"
    }
}

function fun修改项目数据加载() {
    if (2 == _界面控件._参数._编辑状态 || 3 == _界面控件._参数._编辑状态) {
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
        _界面控件._检验标本.val(obj[mapGuid._标本部位]);
        _界面控件._计算系数.val(obj["a0261188-c6e2-4801-be86-d734cddcda0d"]);
        _界面控件._其它毫升.val(obj["a0261188-c6e2-4801-be86-d734cddcda0d"]);
        fun操作类型切换(_界面控件._操作类型.val());
        fun执行频率切换();
        _界面控件._计算方式.val(obj[mapGuid._计算方式]);
        const type = _界面控件._诊疗类别.val();
        const oper = _界面控件._操作类型.val();
        if (type == "E" && oper == "1") { 
            if (parseInt(obj[mapGuid._数据.d执行标记] || 0) == 2) {
                _界面控件._其它脱敏.val(1);
            }
            if (parseInt(obj[mapGuid._数据.d执行分类] || 0) == 5) {
                _界面控件._其它源液.val(1);
            }
        }
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
    let type = _界面控件._诊疗类别.val();
    if (_界面控件._执行频率.val() == "0" && type != "C") {
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
function fun执行分类切换() {
    const type = _界面控件._诊疗类别.val();
    const oper = _界面控件._操作类型.val();
    const exep = _界面控件._执行分类.val();
    if (exep == "1" && type == "E" && oper == "2") {
        fun加载编码项目(_界面控件._输液类型, mapGuid._输液类型选项);
        fun设置控件可见性(mapGuid._输液类型, true);
    } else {
        fun设置控件可见性(mapGuid._输液类型, false);
    }
}

function fun计算方式切换() {
    const type = _界面控件._诊疗类别.val();
    const oper = _界面控件._操作类型.val();
    const exef = _界面控件._计算方式.val();
    if (exef == "2" && type == "E" && oper == "3") {
        fun设置控件可见性(mapGuid._计算系数, true);
    } else {
        fun设置控件可见性(mapGuid._计算系数, false);
    }
}


function fun操作类型切换(oper) {
    let type = _界面控件._诊疗类别.val();
    fun加载编码项目(_界面控件._计算方式, mapGuid._计算方式选项);

    if (type == "D" && oper == "病理") {
        fun设置控件可见性(mapGuid._号别名称, true);
        $("[data-owner-id='" + mapGuid._号别名称 + "'] .record-label").text("号别名称");
    } else {
        fun设置控件可见性(mapGuid._号别名称, false);
    }

    if (type == "H") {
        if (oper == "0") {
            fun设置控件可编辑(_界面控件._执行频率, true);
        } else {
            fun设置控件可编辑(_界面控件._执行频率, false);
            _界面控件._执行频率.val("2");
        }
    } else if (type == "E" && oper == "1") {
        fun显示页卡(mapGuid._t皮试结果);
        fun设置视图区域可见性(mapGuid._视图区域._检查相关, false);
        fun设置视图区域可见性(mapGuid._视图区域._其它相关, true); 

        fun设置控件可见性(mapGuid._其它分类说明, false);
        fun设置控件可见性(mapGuid._其它毫升, false);
        fun设置控件可见性(mapGuid._其它尿量, false);
        fun设置控件可见性(mapGuid._其它脱敏, true);
        fun设置控件可见性(mapGuid._其它源液, true);
        fun设置控件可见性(mapGuid._其它量表学科, false);
        fun设置控件可见性(mapGuid._其它管码, false);
        fun设置控件可见性(mapGuid._其它出院日期, false);
        fun设置控件可见性(mapGuid._计算系数, false);
        fun设置控件可见性(mapGuid._评估方式, false);
        fun设置控件可见性(mapGuid._输液类型, false);
        fun设置控件可见性(mapGuid._其它毫升, false);
        fun设置控件可见性(mapGuid._其它量表学科, false);
        fun设置控件可见性(mapGuid._评估方式, false);
        fun设置控件可见性(mapGuid._计算系数, false);

    } else if (type == "E" && oper == "5") {
        //特殊治疗
        fun设置控件可编辑(_界面控件._计算方式, true);
        fun显示页卡(mapGuid._t频率设置);
    } else if (type == "E" && oper == "7") {//配血方法
        _界面控件._执行频率.val("1");
        fun设置控件可编辑(_界面控件._执行频率, false);
        _界面控件._计算方式.val("3");
        fun设置控件可编辑(_界面控件._计算方式, false);
        fun设置视图区域可见性(mapGuid._视图区域._检查相关, false);
    } else if (type == "E" && oper == "8") {//输血途径
        _界面控件._执行频率.val("1");
        fun设置控件可编辑(_界面控件._执行频率, false);
        _界面控件._计算方式.val("3");
        fun设置控件可编辑(_界面控件._计算方式, false);
        fun设置控件可见性(mapGuid._计算规则, true);
        fun设置控件可见性(mapGuid._执行分类, true);//复用为给药的执行分类
        fun加载编码项目(_界面控件._执行分类, mapGuid._输血途径执行分类);
        $("[data-owner-id='" + mapGuid._执行分类 + "'] .record-label").text("执行分类");
        fun设置视图区域可见性(mapGuid._视图区域._检查相关, false);
    } else if (type == "E" && oper == "9") {//输血采集
        _界面控件._执行频率.val("1");
        fun设置控件可编辑(_界面控件._执行频率, false);
        _界面控件._计算方式.val("3");
        fun设置控件可编辑(_界面控件._计算方式, false);
        fun设置视图区域可见性(mapGuid._视图区域._其它相关, true);
        fun设置视图区域可见性(mapGuid._视图区域._检查相关, false);
        fun设置控件可见性(mapGuid._其它分类说明, true);
        fun设置控件可见性(mapGuid._其它管码, true);
        fun加载编码项目(_界面控件._其它管码, mapGuid._采血管选项);
    } else if (type == "E" && (oper == "10" || oper == "11")) {
        //VTE评分表
        fun设置视图区域可见性(mapGuid._视图区域._检查相关, false);
        _界面控件._执行频率.val("1");
        fun设置控件可编辑(_界面控件._执行频率, false);
        _界面控件._计算方式.val("3");
        fun设置控件可编辑(_界面控件._计算方式, false);
    } else if (type == "E" && oper == "12") {
        //量表评估
        _界面控件._执行频率.val("0");
        fun设置控件可编辑(_界面控件._执行频率, false);
        _界面控件._计算方式.val("3");
        fun设置控件可编辑(_界面控件._计算方式, false);
        fun设置视图区域可见性(mapGuid._视图区域._其它相关, true);
        fun设置视图区域可见性(mapGuid._视图区域._检查相关, false);

        fun设置控件可见性(mapGuid._其它分类说明, false);
        fun设置控件可见性(mapGuid._其它毫升, false);
        fun设置控件可见性(mapGuid._其它尿量, false);
        fun设置控件可见性(mapGuid._其它脱敏, false);
        fun设置控件可见性(mapGuid._其它源液, false);
        fun设置控件可见性(mapGuid._其它量表学科, false);
        fun设置控件可见性(mapGuid._其它管码, false);
        fun设置控件可见性(mapGuid._其它出院日期, false);
        fun设置控件可见性(mapGuid._计算系数, false);
        fun设置控件可见性(mapGuid._评估方式, false);
        fun设置控件可见性(mapGuid._输液类型, false);
        fun设置控件可见性(mapGuid._其它毫升, false);
        fun加载编码项目(_界面控件._其它量表学科, mapGuid._量表学科选项);
        fun设置控件可见性(mapGuid._其它量表学科, true);
        fun设置控件可见性(mapGuid._评估方式, true);
        fun设置控件可见性(mapGuid._计算系数, true);
    }

    if (type == "E" && (oper == "2" || oper == "3" || oper == "4")) {

        _界面控件._执行频率.val("0");
        fun设置控件可编辑(_界面控件._执行频率, false);
        _界面控件._计算方式.val("3");
        fun设置控件可编辑(_界面控件._计算方式, false);

        fun设置控件可见性(mapGuid._单独应用, true);

        fun设置控件可见性(mapGuid._计算规则, true);
        fun设置视图区域可见性(mapGuid._视图区域._其它相关, true);
        fun设置视图区域可见性(mapGuid._视图区域._检查相关, false);
        fun设置控件可见性(mapGuid._其它分类说明, true);
        fun设置控件可见性(mapGuid._其它毫升, false);
        fun设置控件可见性(mapGuid._其它尿量, false);
        fun设置控件可见性(mapGuid._其它脱敏, false);
        fun设置控件可见性(mapGuid._其它源液, false);
        fun设置控件可见性(mapGuid._其它量表学科, false);
        fun设置控件可见性(mapGuid._其它管码, false);
        fun设置控件可见性(mapGuid._其它出院日期, false);
        fun设置控件可见性(mapGuid._计算系数, false);
        fun设置控件可见性(mapGuid._评估方式, false);
        fun设置控件可见性(mapGuid._输液类型, false);
        fun设置控件可见性(mapGuid._其它毫升, false);

        if (oper == "2") {
            fun设置控件可见性(mapGuid._给药大类, true);
            $("[data-owner-id='" + mapGuid._给药大类 + "'] .record-label").text("给药大类");
            fun加载编码项目(_界面控件._给药大类, mapGuid._给药大类选项);
        }

        let exepty = oper == "2" ? mapGuid._给药执行分类 : mapGuid._服法执行分类;
        if (oper == "3") {
            exepty = mapGuid._煎法执行分类;
            fun加载编码项目(_界面控件._计算方式, mapGuid._煎法计算方式);
            fun设置控件可编辑(_界面控件._计算方式, true);
        }

        fun设置控件可见性(mapGuid._执行分类, true);//复用为给药的执行分类
        fun加载编码项目(_界面控件._执行分类, exepty);
        $("[data-owner-id='" + mapGuid._执行分类 + "'] .record-label").text("执行分类");

    }
}

function fun界面页卡切换(tab) {
    if (0 == 1) {
        if (_界面控件._执行科室性质.length == 0) {
            _界面控件._执行科室性质 = $("#" + mapGuid._执行科室性质);
            fun加载编码项目(_界面控件._执行科室性质, mapGuid._执行科室性质选项);
        }
        _界面控件._执行科室性质 = $("#" + mapGuid._执行科室性质);
        if (_界面控件._执行科室性质.attr("data-option-code-list") != _界面控件._编码选项[mapGuid._执行科室性质选项]) {
            fun加载编码项目(_界面控件._执行科室性质, mapGuid._执行科室性质选项);
        }
    }

    if ($(tab.currentTarget).text() == "检查部位") {
        let oper = _界面控件._操作类型.val();
        let isrule = parseInt(_界面控件._按规则计费.val() || 0);
        let itemid = parseInt(_界面控件._参数._诊疗项目id || 0);
        let ckey = itemid + "_" + oper + "_" + isrule;
        if (_界面控件._检查部位加载 != ckey) {
            _界面控件._检查部位加载 = ckey;
            //fun检查部位区域渲染();
            fun获取检查部位列表(itemid, oper, isrule);
        }
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

        temp = $("[data-id='com_i12efkffikm']")[0]?.firstElementChild?.data;
        if (temp) {
            //检查项目的部位列表
            parData.检查部位列表 = fun获取选择的检查部位(temp);
            if (parData.检查部位列表.length > 0) {
                parData.标本部位 = parData.检查部位列表.map(v => v._部位).filter(Boolean).join(',').slice(0, 60);
            }
        }

    } else if (parData.诊疗类别 == "F") {
        parData.手术操作ids = _界面控件._手术项目标准编码.val();
        parData.计算规则 = null;
        parData.组合项目 = 0;
        parData.录入限量 = 0;
        parData.执行标记 = 0;
        parData.执行分类 = 0;
        parData.按规则计费 = 0;
        parData.计算方式 = 3;
        parData.执行频率 = 1;
    } else if (parData.诊疗类别 == "G") {
        parData.计算规则 = null;
        parData.组合项目 = 0;
        parData.录入限量 = 0;
        parData.执行标记 = 0;
        parData.执行分类 = 0;
        parData.按规则计费 = 0;
        parData.计算方式 = 3;
        parData.执行频率 = 1;
    }

    if ("K" == parData.诊疗类别) {
        parData.计算系数 = parseInt(_界面控件._其它毫升.val() || 0);
    }

    if (parData.诊疗类别 === "E" && parData.操作类型 === "1") {
        const defaultVal = "阳性(+);阴性(-)";
        parData.标本部位 = "";
        if (parData.功能 === 2) {
            parData.标本部位 = _界面控件._参数._项目数据[mapGuid._标本部位] || defaultVal;
        }
        const el = $(`[data-id="${mapGuid._视图区域._皮试标注}"]`)[0];
        const result = el?.firstElementChild && fun生成皮试结果(el.firstElementChild.data);
        if (result) parData.标本部位 = result;
        if (!parData.标本部位) parData.标本部位 = defaultVal;

        parData.执行标记 = parseInt(_界面控件._其它脱敏.val() || 0) == 1 ? 2 : 0;
        parData.执行分类 = parseInt(_界面控件._其它源液.val() || 0) == 1 ? 5 : 0;
    } 
    if (parData.诊疗类别 == "F" || parData.诊疗类别 == "K") {
        parData.输血检验对照 = (_界面控件._输血检验对照.val() || "").replace(",", "|");
    }

    if (parData.诊疗类别 == "L" || parData.诊疗类别 == "I" || parData.诊疗类别 == "H") {
        parData.诊疗频率编码 = _界面控件._诊疗频率.val();
    }

    if (parData.诊疗类别 == "E" && (parData.操作类型 == "2" || parData.操作类型 == "3" || parData.操作类型 == "4")) {
        parData.标本部位 = _界面控件._其它分类说明.val();
        if (parData.操作类型 == "2") {
            parData.给药大类 = _界面控件._给药大类.val();
        }
        parData.执行分类 = parseInt(_界面控件._执行分类.val() || 0);
        parData.执行标记 = parseInt(_界面控件._执行分类._界面控件._输液类型 || 0);
        parData.计算方式 = parseInt(_界面控件._计算方式.val() || 0);
        parData.计算系数 = parseInt(_界面控件._计算方式.val() == "2" ? _界面控件._计算系数.val() || 0 : 0);
        parData.计算规则 = parseInt(_界面控件._计算规则.val() || 0);
    }
     
    parData.项目频率 = "";
    if (parData.执行频率 == 0 && parData.诊疗类别 != "C") {
        const el = $(`[data-id="${mapGuid._视图区域._可选频率}"]`)[0];
        const result = el?.firstElementChild && fun生成项目频率结果(el.firstElementChild.data);
        if (result) parData.项目频率 = result; 
    }

    //有可能没有切换，要把原值取出来，可以通过 First_In 这个参数来控件
    //执行科室
    let isSel执行科室 = false;
    parData.执行科室 = 1;    
    temp = $("[data-id='com_jg4irjgrwg']")[0]?.firstElementChild?.GetCurrentData();
    if (temp) {
        isSel执行科室 = true;
        //进了这个分支，说明切换了页卡，渲染了的
        _界面控件._执行科室性质 = $("#" + mapGuid._执行科室性质);
        parData.执行科室 = parseInt(_界面控件._执行科室性质.val() || 0);
    }
    //门认住院执行科室
    if (parData.执行科室 == 4) {
        temp = $("[data-id='com_px2g4a4q2e']")[0]?.firstElementChild?.GetCurrentData();
        if (temp) {
            parData.门诊执行科室id = parseInt(temp["e72ea1e2-775a-4c68-9f12-aeba6ceb6903"] || 0);
            parData.住院执行科室id = parseInt(temp["afc02460-afe5-4a8d-ab93-425c3b849370"] || 0);

            parData.门诊执行科室id = parData.门诊执行科室id == 0 ? null : parData.门诊执行科室id;
            parData.住院执行科室id = parData.住院执行科室id == 0 ? null : parData.住院执行科室id;
        }
        const el = $(`[data-id="${mapGuid._视图区域._指定开单执行科室}"]`)[0];
        const result = el?.firstElementChild && fun获取指定开单执行科室(el.firstElementChild.data);
        if (result) parData.定向执行 = result;  
    }

    if ((parData.诊疗类别 == "G" || parData.诊疗类别 == "F") && parData.执行科室 == 0) {
        parData.执行科室 = 1;
    }

    //如果没有切换执行科室，且功能是修改，那么取原值
    if (!isSel执行科室 && parData.功能 == 2) {
        parData.执行科室 = parseInt(_界面控件._参数._项目数据[mapGuid._执行科室性质] || 0);

        parData.门诊执行科室id = parseInt(_界面控件._参数._项目数据[mapGuid._门诊执行科室] || 0);
        parData.住院执行科室id = parseInt(_界面控件._参数._项目数据[mapGuid._住院执行科室] || 0);
        parData.门诊执行科室id = parData.门诊执行科室id == 0 ? null : parData.门诊执行科室id;
        parData.住院执行科室id = parData.住院执行科室id == 0 ? null : parData.住院执行科室id;

        parData.定向执行 = _界面控件._参数._项目数据[mapGuid._定向执行科室];
    }


    parData = { "Json_In": JSON.stringify(parData) }
    return parData;
}

function fun获取指定开单执行科室(dataArray) {
    const KEY1 = "f0e438ad-4123-4fbf-bbfe-3597eba04a89";
    const KEY2 = "80daff58-9c19-4d76-9d4d-ed5860cd1b09";
    return dataArray 
        .filter(item => {
            const val = item[KEY2];
            return val != null && String(val).trim() !== '';
        }) 
        .map(item => { 
            const value1 = item[KEY1] ?? '';
            const numList = value1.split(',');
            const fixNum = item[KEY2];
            return numList.map(n => `${n}^${fixNum}`).join('|');
        })
        .join('|');
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

    fun设置控件可见性(mapGuid._按规则计费, !bln检验);
    fun设置控件可见性(mapGuid._床旁术中, !bln检验);

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
    fun设置控件可见性(mapGuid._诊疗频率, false);

    fun加载编码项目(_界面控件._计算规则, mapGuid._计算规则选项);
    fun加载编码项目(_界面控件._号别名称, mapGuid._病理类别选项);

    fun设置视图区域可见性(mapGuid._视图区域._检验相关, false);
    fun设置视图区域可见性(mapGuid._视图区域._检查相关, false);
    fun设置视图区域可见性(mapGuid._视图区域._手术相关, false);
    fun设置视图区域可见性(mapGuid._视图区域._其它相关, false);

    $("[data-owner-id='" + mapGuid._诊疗频率 + "'] .record-label").text("诊疗频率");

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

            fun设置视图区域可见性(mapGuid._视图区域._检查相关, true);

            fun设置控件可见性(mapGuid._按规则计费, false);
            fun设置控件可见性(mapGuid._床旁术中, false);
            break;
        case "F":
            _界面控件._执行频率.val("1");
            fun设置控件可编辑(_界面控件._执行频率, false);
            _界面控件._计算方式.val("3");
            fun设置控件可编辑(_界面控件._计算方式, false);
            _界面控件._计算单位.val("次");
            fun设置控件可见性(mapGuid._单独应用, true);
            fun设置控件可编辑(_界面控件._单独应用, true);
            fun加载编码项目(_界面控件._操作类型, mapGuid._手术操作类型);
            _界面控件._操作类型标签.text("手术规模");
            fun设置视图区域可见性(mapGuid._视图区域._手术相关, true);
            fun设置控件可见性(mapGuid._手术项目标准编码, true);
            break;
        case "G":
            _界面控件._执行频率.val("1");
            fun设置控件可编辑(_界面控件._执行频率, false);
            _界面控件._计算方式.val("3");
            fun设置控件可编辑(_界面控件._计算方式, false);
            _界面控件._计算单位.val("次");
            fun设置控件可见性(mapGuid._单独应用, true);
            fun设置控件可编辑(_界面控件._单独应用, true);

            fun加载编码项目(_界面控件._操作类型, mapGuid._麻醉操作类型);
            _界面控件._操作类型标签.text("麻醉类型");
            break;
        case "H":
            _界面控件._执行频率.val("0");
            fun设置控件可编辑(_界面控件._执行频率, true);
            _界面控件._计算方式.val("2");
            fun设置控件可编辑(_界面控件._计算方式, false);

            fun设置控件可见性(mapGuid._诊疗频率, true);
            fun加载编码项目(_界面控件._诊疗频率, mapGuid._诊疗频率选项);

            fun加载编码项目(_界面控件._操作类型, mapGuid._护理操作类型);
            _界面控件._操作类型标签.text("项目类型");
            break;
        case "I":
            fun设置控件可见性(mapGuid._诊疗频率, true);
            fun加载编码项目(_界面控件._诊疗频率, mapGuid._诊疗频率选项);
            fun设置控件可见性(mapGuid._操作类型, false);
            break;
        case "K":

            _界面控件._执行频率.val("1");
            fun设置控件可编辑(_界面控件._执行频率, false);
            _界面控件._计算方式.val("1");
            fun设置控件可编辑(_界面控件._计算方式, true);
            _界面控件._计算单位.val("次");
            _界面控件._服务对象.val("1,2");
            _界面控件._执行科室性质.val("1");

            fun设置控件可见性(mapGuid._单独应用, true);
            fun设置控件可编辑(_界面控件._单独应用, true);

            fun设置控件可见性(mapGuid._操作类型, false);
            fun设置视图区域可见性(mapGuid._视图区域._手术相关, true);
            fun设置视图区域可见性(mapGuid._视图区域._其它相关, true);
            fun设置控件可见性(mapGuid._手术项目标准编码, false);

            fun设置控件可见性(mapGuid._其它分类说明, false);
            fun设置控件可见性(mapGuid._其它毫升, false);
            fun设置控件可见性(mapGuid._其它尿量, false);
            fun设置控件可见性(mapGuid._其它脱敏, false);
            fun设置控件可见性(mapGuid._其它源液, false);
            fun设置控件可见性(mapGuid._其它量表学科, false);
            fun设置控件可见性(mapGuid._其它管码, false);
            fun设置控件可见性(mapGuid._其它出院日期, false);
            fun设置控件可见性(mapGuid._计算系数, false);
            fun设置控件可见性(mapGuid._评估方式, false);
            fun设置控件可见性(mapGuid._输液类型, false);
            fun设置控件可见性(mapGuid._其它毫升, true);

            break;
        case "L":
            fun设置控件可见性(mapGuid._诊疗频率, true);
            fun加载编码项目(_界面控件._诊疗频率, mapGuid._诊疗频率选项);
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
    $(page).off('click.switchCard')
        .on('click.switchCard', '.switch_card .nav-link[data-toggle="tab"]', function (e) {
            fun界面页卡切换(e);
        });
}

/**
 * 页面载入完成事件处理
 * @param {PageContent} pageContent
*/
page.onLoaded = (pageContent) => {
    let urlPar = new URLSearchParams(location.search);
    let class_id = parseInt(urlPar.get("class_id") || 0);
    let item_id = parseInt(urlPar.get("item_id") || 0);
    let editsta = parseInt(urlPar.get("editsta") || 0);//编辑状态 1-新增，2-修改，3-复制新增
    _界面控件._参数._诊疗项目id = item_id;
    _界面控件._参数._分类id = class_id;
    _界面控件._参数._编辑状态 = editsta;
    debugger
    fun控件对象映射();
    
    $("#" + mapGuid._诊疗类别).on("change", function () {
        fun诊疗类别切换($(this).val());
    });
    $("#" + mapGuid._操作类型).on("change", function () {
        fun操作类型切换($(this).val());
    });

    $("#" + mapGuid._执行频率).on("change", function () {
        fun执行频率切换();
    });

    $("#" + mapGuid._名称).on("change", function () {
        debugger
        //项目名称
        $("#" + mapGuid._简码).val(GetPyCode($(this).val()));
        $("#" + mapGuid._简码五笔).val(GetWbCode($(this).val()));
    });

    $("#" + mapGuid._别名).on("change", function () {
        //项目别名
        $("#" + mapGuid._别名简码).val(GetPyCode($(this).val()));
        $("#" + mapGuid._别名简码五笔).val(GetWbCode($(this).val()));
    });

    $("#" + mapGuid._执行分类).on("change", function () {
        fun执行分类切换();
    });

    $("#" + mapGuid._计算方式).on("change", function () {
        fun计算方式切换();
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
 
function fun生成项目频率结果(data) {
    return data
        .filter(item => { 
            return item[mapGuid._频率选择] === "1" && (item[mapGuid._频率编码] || "") != "";
        })
        .map(item => item[mapGuid._频率编码])
        .join('|');
}

function fun生成皮试结果(data) {    
    function getPishiStr(tag) {
        return data
            .filter(item => {
                // 1. 三个节点的值都不能为空
                const text = item[mapGuid._皮试文字] || '';
                const mark = item[mapGuid._皮试标注] || '';
                const allergy = item[mapGuid._皮试过敏] || '';
                 
                if (!text.trim() || !mark.trim() || !allergy.trim()) {
                    return false;
                } 
                return allergy === tag;
            })
            .map(item => `${item[mapGuid._皮试文字]}(${item[mapGuid._皮试标注]})`)
            .join(',');
    }     
    const str0 = getPishiStr("0");
    const str1 = getPishiStr("1");     
    const finalResult = `${str1};${str0}`;
    return finalResult
}

function fun获取检查部位列表(itemid, oper, isrule) {
    let params = {
        "resTypeId": "c854b215-23ac-46fb-9110-330f713c9400",
        "viewId": "e459b32a-b09a-4a49-94d7-1129ae5d219d",
        "row": 0,
        "source": "资源类型",
        "matching": [
            {
                "relId": "ef65c48b-495c-4f25-8bda-43d72967ee14",
                "compare": "=",
                "val": oper //操作类型
            },
            {
                "relId": "db4955c4-9c2f-4d1f-a8a0-f2bf75f5c934",
                "compare": "=",
                "val": isrule //是否规则 0/1
            },
            {
                "relId": "29e924a6-5292-4ff7-95f7-710c4949eb6a",
                "compare": "=",
                "val": itemid //项目ID
            }
        ]
    }
    const result = HrsServer.Post(
        "/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId",
        JSON.stringify(params)
    );
    $('div[data-id="com_i12efkffikm"]')[0].firstElementChild.data = result.Data;
    return result.Data;
}

function fun检查部位区域渲染() {
    let viewId = "e459b32a-b09a-4a49-94d7-1129ae5d219d";
    let reslt = HrsServer.Get("/api/FormalResourceView/GetResourceViewDataForSetUp?resViewId=" + viewId + "&source=资源类型");
    if (!reslt.Success) {
        layer.alert(reslt.Msg, { icon: 0 });
        return;
    }
    $('div[data-id="com_i12efkffikm"] zl-qmlist')[0].View = reslt.Data;
}

window.fun检查部位区域连动参数 = function () {
    let oper = _界面控件._操作类型.val();
    let isrule = parseInt(_界面控件._按规则计费.val() || 0);
    let itemid = parseInt(_界面控件._参数._诊疗项目id || 0);
    return [oper, isrule, itemid];
}

function fun获取选择的检查部位(data) {       
    // 字段映射
    const keyMap = {
        "cee6f427-f315-43d1-aa4f-33e366f7900f": "_选择",
        "b2473c6f-5c45-42b1-bdb3-4afa15c44103": "_部位",
        "30031a9c-15a1-48ea-90cf-0b70546a2043": "_方法",
    };

    // 判断是否为空
    const isEmpty = (val) => {
        return val === null || val === undefined || val.trim() === '';
    };

    // 完整处理逻辑
    const result = data
        .map(item => {
            const newItem = {};
            Object.keys(keyMap).forEach(oldKey => {
                newItem[keyMap[oldKey]] = item[oldKey];
            });
            return newItem;
        })
        // 1. 只保留选择=1的数据
        .filter(item => item._选择 === "1")
        // 2. 排除部位/方法为空的数据
        .filter(item => !isEmpty(item._部位) && !isEmpty(item._方法))
        // 3. 方法按;分割，并转成 {方法名称:xxx}
        .map(item => {
            const methodList = item._方法
                .split(';')
                .map(m => m.trim())
                .filter(m => m)
                .map(name => ({ "方法名称": name }));

            return {
                _部位: item._部位,
                _方法: methodList
            };
        });

    return result;
}