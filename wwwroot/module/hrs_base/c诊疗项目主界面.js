
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
 * 处理文本对象出现undefined/null/""
 * @param {any} txt
 * @param {any} defaultVal
 * @returns
 */
window.zlnvl = function (txt, defaultVal) {
    if (typeof (defaultVal) == "undefined") defaultVal = "";

    if (txt == undefined) {
        return defaultVal;
    } else if (txt == null) {
        return defaultVal;
    } else if (txt === "") {//0==""，false==""
        return defaultVal;
    } else {
        return txt.toString();
    }
}

window.zlval = function (txt) {
    if (txt == undefined) {
        return 0;
    } else if (txt == null) {
        return 0;
    } else if (txt == "") {
        return 0;
    } else if (txt == NaN) {
        return 0;
    }

    var newVal;
    if (txt.toString().indexOf(".") > 0)
        newVal = parseFloat(txt);
    else
        newVal = parseInt(txt);

    if (newVal == NaN) {
        return 0;
    } else {
        return newVal;
    }
}

window.fun刷新诊疗明细列表 = function () {
    let input = {
        "resTypeId": "eb6a31b5-0f08-41ca-8725-8c16a9389e71",
        "viewId": "a56fbe4b-3aa5-494b-a6d9-ae0e1710b3ec",
        "row": 0,
        "source": "资源类型",
        "matching": [
            {
                "relId": "2e8f2ab5-4b46-4533-b78e-a84a409472da",
                "compare": "=",
                "val": $("[data-id='com_gyd68y2nnt']")[0].firstElementChild.GetCurrentData()["resource_detail_id"]
            }
        ]
    }
    let ret = HrsServer.Post("/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId", JSON.stringify(input));
    $("[data-id='com_gs502rf700d']")[0].firstElementChild.data = ret.Data;
    return ""
}

const _功能按钮 = {
    "新增": 1,
    "复制新增": 2,
    "修改": 3,
    "删除": 4,
    "收费对照": 5,
    "采集方式": 6,
    "启用": 7,
    "停用": 8
}

/**
 * 功能：成套方案管理类
 */
class SchemeManager {
    constructor() {
        this.itemField = {
            "ID": "e76a5f1c-828c-4fff-9068-0da320b22bc0" //ID        
        };

        this.adviceField = {
            "执行科室": "9ab3ee43-8bcb-4c31-a01e-7784cc30a511",
            "按规则计费": "5d88aa51-5363-4ecc-a698-985043e42242",
            "天数": "27bdfea7-6215-451e-8d2f-079731a1213c",
            "时间方案": "16346269-ff05-4707-9372-eaa8c5b93adb",
            "单次用量": "62399f46-47ad-4577-9a2e-f86e29f82ab9",
            "类别": "c6576ea4-eb7b-4130-9cc8-72cc7c4fc6a7",
            "诊疗项目ID": "6da21476-167d-49df-8a35-6216bb29b593",
            "名称": "f715ef94-a1b6-4129-9170-608dff24d890",
            "ID": "cfbec4cf-4404-41aa-9a8c-dfa378f52869",
            "撤档时间": "9a1ea8f0-b339-492d-adcf-b0c0e4d5bb11",
            "期效": "a966f21b-10eb-44ae-8529-fdae3dbde3ae",
            "总量单位": "d3e2e0ee-3ed7-48aa-9c72-057cdc49b16b",
            "成套ID_IN": "9ea45598-fae2-4e62-9bf9-dcf5781d98a4",
            "执行标记": "ba1c97b0-f579-46d5-bfe6-bc49235915e0",
            "标本部位": "f5935b74-80bc-4b02-b381-bd76cb1a6fd2",
            "医生嘱托": "68ad9aab-9546-4d71-8cb9-389e757e084f",
            "序号": "cbe98574-1259-44a3-9a2d-d80760b38cd0",
            "总给予量": "03bb15ab-3556-489d-985d-36d2a77439ce",
            "相关序号": "aadb689f-4afb-4ec3-beb5-f0b263e7de5d",
            "计算单位": "890ecc06-8e6f-4591-834e-da68726fa580",
            "收费细目ID": "f3f34daf-1f14-4764-9e06-efbb5764b89f",
            "医嘱内容": "337b437c-f287-4195-887c-4b85fc986b9c",
            "内容": "d9792c2d-20e5-492f-9d8d-021f2f7643c0",
            "是否保密": "57851e06-5cbc-45a4-9628-38ecb43bfa65",
            "执行性质": "1ec0c886-42a7-4e8e-9a57-869355d02089",
            "检查方法": "1b14b0d3-ba49-4556-8890-d1e9ebfc440a",
            "执行频次": "da8f739a-2b41-4faa-9ac1-10e846624a37",
            //虚拟属性
            "期效名称": "d80e7d2f-9784-4c41-a610-1cc5eb83e291",
            "用法": "eb952511-cdfa-4e10-b509-d0d86139769b",
            "执行性质名称": "f2f983fe-94c2-4d0e-b6c2-035ef1d471f3"
        };
        //当前选中成套方案ID
        this.SchemeId = 0;
    }

    //事件处理
    InitEvent() {
        let self = this;
        debugger;
        //选中方案分类
        $('body').on('click', `div[data-id="${_成套分类.Id}"] tbody tr`, function () {
            let classId = zlnvl($(this).attr("data-uniqueid"));  //"*********123"
            classId = zlval(classId.replace(/\*/g, ''));  //返回数字部分 
            self.LoadSchemeItem(classId);
        });

        //选中方案项目
        $('body').on('click', `div[data-id="${_成套明细.Id}"] tbody tr`, function () {
            let schemeId = zlval($(this).attr("data-uniqueid"));
            self.LoadSchemeAdvice(schemeId);
        });
    }

    //加载成套方案项目
    LoadSchemeItem(classId) {
        let dataIn = {
            "resTypeId": "d98b913b-8f61-4d96-bdda-41ad362b36ed",  //SQL_诊疗项目目录_成套明细
            "viewId": "f5029d06-0d34-4efc-8245-b93f45fc80c5", //SQL_诊疗项目目录_成套明细_列表
            "row": 0,
            "source": "资源类型",
            "matching": [
                {
                    "relId": "11e44c31-70dd-40ca-b2a8-15afe30d06ff", //分类ID_IN
                    "compare": "=",
                    "val": classId
                }
            ]
        };
        let dataOut = HrsServer.Post("/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId", JSON.stringify(dataIn));
        let schemeItems = dataOut.Data;
        _成套明细.LoadData(schemeItems);
        _成套组合.LoadData([]);
        debugger;
        //根据选中行加载成套方案内容
        setTimeout(() => {
            let row = _成套明细.GetCurrentData();
            let schemeId = 0;
            if (row) schemeId = zlval(row[this.itemField["ID"]]);
            if (schemeId > 0) {
                this.LoadSchemeAdvice(schemeId);
            }
            else {
                this.SchemeId = 0;
                _成套组合.LoadData([]);
            }
        }, 500);

    }
    //加载成套方案内容
    LoadSchemeAdvice(schemeId) {
        debugger;
        this.SchemeId = schemeId;
        let dataIn = {
            "resTypeId": "a0b93495-50a8-4bd0-b89a-2b4bbe5c3925",  //SQL_诊疗项目组合
            "viewId": "6ce9df13-53ca-45d6-875e-7caa41382aff", //SQL_诊疗项目组合_列表
            "row": 0,
            "source": "资源类型",
            "matching": [
                {
                    "relId": "9ea45598-fae2-4e62-9bf9-dcf5781d98a4", //成套ID_IN
                    "compare": "=",
                    "val": schemeId
                }
            ]
        };
        let dataOut = HrsServer.Post("/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId", JSON.stringify(dataIn));
        let adviceList = dataOut.Data;

        //医嘱数据深加工
        let field = this.adviceField;
        let prevRow, row;
        for (var i = 0; i < adviceList.length; i++) {
            row = adviceList[i];
            row[field["期效名称"]] = row[field["期效"]] == 0 ? "长期" : "临时";
            //内容
            if (row[field["类别"]] == "7" && zlval(row[field["是否保密"]]) == 1) {
                row[field["内容"]] = "***";
            } else {
                if (zlnvl(row[field["医嘱内容"]]) != "") {
                    row[field["内容"]] = zlnvl(row[field["医嘱内容"]]);
                } else { }
                row[field["内容"]] = zlnvl(row[field["名称"]]);
            }
        }

        //隐藏行处理
        for (var i = 1; i < adviceList.length; i++) {
            row = adviceList[i];
            prevRow = adviceList[i - 1];
            //给药途径
            if (row[field["类别"]] == "E" && zlval(row[field["相关序号"]]) == 0 && zlval(prevRow[field["相关序号"]]) == zlval(row[field["序号"]]) && "56".includes(prevRow[field["类别"]])) {
                row[field["ID"]] = -1;//-1标识删除行
                //显示给药途径
                for (var j = i - 1; j > 0; j--) {
                    let currRow = adviceList[j];
                    if (zlval(currRow[field["相关序号"]]) == row[field["序号"]]) {
                        currRow[field["用法"]] = row[field["内容"]];
                        //显示成药的执行性质
                        if (currRow[field["执行性质"]] == 5 && row[field["执行性质"]] != 5) {
                            currRow[field["执行性质名称"]] = currRow[field["执行标记"]] == 2 ? "不取药" : "自备药";
                        } else if (currRow[field["执行性质"]] != 5 && row[field["执行性质"]] == 5) {
                            currRow[field["执行性质名称"]] = "离院带药";
                        } else {
                            currRow[field["执行性质名称"]] = currRow[field["执行标记"]] == 1 ? "自取药" : "正常";
                        }
                    }
                    else {
                        break;
                    }
                }
            }
            //输血途径

            //中药配方和检验组合

            //检查组合

            //手术项目
        }
        //删除隐藏行
        adviceList = adviceList.filter(row => row[field["ID"]] != -1);
        _成套组合.LoadData(adviceList);
    }
}
window.mobjSchemeManager = new SchemeManager();

/**
 * 
 * @param {any} dataRow 当前行
 * @param {any} type    按钮类型 1-新增， 6-采集对照
 */
window.fun菜单按钮禁用 = function (dataRow, type) {
    let bln禁止 = true;

    if (type > 1) {
        const tableRow = $(`div[data-id="com_gs502rf700d"] zl-container zl-qmlist`)[0]?.GetCurrentData();
        const item_id = tableRow?.resource_detail_id || "0";
        if (parseInt(item_id || 0) > 0) {
            bln禁止 = false;
        }
    }
    switch (type) {
        case _功能按钮.新增://必须选中分类，才能新增项目
            const class_id = $(`div[data-id="com_gyd68y2nnt"] zl-container zl-treelist`)[0]?.GetCurrentData()?.resource_detail_id;
            if (parseInt(class_id || 0) > 0) {
                bln禁止 = false;
            }
            break;
        case _功能按钮.复制新增:
            break;
        case _功能按钮.修改://要选中明细行，才能修改            
            break;
        case _功能按钮.删除:
            break;
        case _功能按钮.收费对照:
            break;
        case _功能按钮.采集方式:
            bln禁止 = true;
            if (dataRow) {
                if (dataRow["06359a87-9df0-4d20-b34b-c812d23594c1"] == "C") {
                    bln禁止 = false;
                }
            }
            break;
        case _功能按钮.启用:
            break;
        case _功能按钮.停用:
            break;
        default:
            break;
    }
    return bln禁止;
}

window.fun菜单按钮执行条件 = function (dataRow, type) {
    return true;
}

window.fun获取打开页面地址 = function (dataRow, type) {
    debugger
    let item_id = 0, class_id = 0, pageid = "", url = "", editsta;

    pageid = "a0107b04-1846-4933-8cb9-f8d3b0bb3890";  //通用编辑页面
    class_id = $(`div[data-id="com_gyd68y2nnt"] zl-container zl-treelist`)[0]?.GetCurrentData()?.resource_detail_id;
    item_id = $(`div[data-id="com_gs502rf700d"] zl-container zl-qmlist`)[0]?.GetCurrentData()?.resource_detail_id;
    editsta = 1;

    if (_功能按钮.复制新增 == type) editsta = 3;

    url = `pageViewById?pageid=${pageid}&editsta=${editsta}&class_id=${class_id}&item_id=${item_id}`;

    if (type == _功能按钮.采集方式) {
        if (dataRow) {
            if (dataRow["06359a87-9df0-4d20-b34b-c812d23594c1"] == "C") {
                item_id = parseInt(dataRow["resource_detail_id"] || 0);//诊疗项目ID
            }
        }
        pageid = "da50550f-e0c3-4309-ada6-58eace3d16b8"; //采集方式设置页面
        url = "pageViewById?pageid=" + pageid + "&item_id=" + item_id;
    } else if (type == 22) {
        //检查单价替换设置管理
        pageid = "d693ad2b-672a-4381-9953-2d458162f17b";
        url = "pageViewById?pageid=" + pageid + "&item_id=" + item_id;
    } else if (type == 51) {
        pageid = "bacb354c-b541-4ecf-9de2-7e2e3516f4b7";
        url = "pageViewById?pageid=" + pageid + "&item_id=" + item_id + "&text=选择类型";
    } else if (type == 52) {
        var citem_to_charge_fee = localStorage.getItem("citem_to_charge_fee");
        localStorage.removeItem("citem_to_charge_fee");//清除缓存 
        var source = 0;
        var is_part = 0;
        var is_add = 0;
        var 对照方式 = "";
        if (citem_to_charge_fee) {
            citem_to_charge_fee = JSON.parse(citem_to_charge_fee);
            对照方式 = citem_to_charge_fee?.普通对照 || "";
        }
        if ("" == 对照方式) {
            return "";
        }

        if (citem_to_charge_fee.检查部位 == "1") {
            is_part = 1;
            is_add = 0;
        }

        if (citem_to_charge_fee.床旁或术中加收 == "1") {
            is_part = 0;
            is_add = 1;
        }

        if (is_add == 1) {
            pageid = "c24a88a2-f80b-42fd-98c1-7ab1b983fb32";//床旁或术中加收
        } else if (is_part == 1) {
            pageid = "ad6d5137-3e34-4309-836d-78339e831581";//部位方法
        } else {
            pageid = "f1c6ee87-5399-4494-9395-0524d6aacf5c";//一般通用
        }
        if (citem_to_charge_fee.按规则计费 == "1") {
            pageid = "bbcbfa69-32b8-4414-9e19-fed84231147f";//新放射
        }
        // {
        //     "对照方式": "门诊科室",
        //     "门诊科室": "1484335",
        //     "住院科室": "1484315",
        //     "检查部位": "1",
        //     "床旁或术中加收": "1"
        // }

        url = `pageViewById?pageid=${pageid}&item_id=${item_id}&source=${source}&is_part=${is_part}&is_add=${is_add}`;
    }

    return url;
}
window.CanOpen收费对照 = function () {
    var citem_to_charge_fee = localStorage.getItem("citem_to_charge_fee");
    var 对照方式 = "";
    if (citem_to_charge_fee) {
        citem_to_charge_fee = JSON.parse(citem_to_charge_fee);
        对照方式 = citem_to_charge_fee?.普通对照 || "";
    }
    if ("" == 对照方式) {
        return false;
    }
    return true;
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
    debugger;
    window.mobjSchemeManager = new SchemeManager();
    //声明事件
    mobjSchemeManager.InitEvent();

    //  _成套明细.component.$dxTable.option("onRowClick", (e) => {
    //         //   const component = e.component;
    //         //   const rowData = e.data;
    //         //   const currentSelectedRowKeys = component.getSelectedRowKeys();
    //         //   // 检查当前行是否已被选中
    //         //   const isRowSelected = currentSelectedRowKeys.includes(rowData.resource_detail_id);

    //         //   // 切换当前行的选中状态
    //         //   if (isRowSelected) {
    //         //       component.deselectRows(rowData.resource_detail_id); // 取消选中
    //         //   } else {
    //         //       component.selectRows(rowData.resource_detail_id, true); // 选中行（true表示不清除现有选择）[7](@ref)
    //         //   }
    //         //   fun(e);
    //         alert(11);
    //     })

}

