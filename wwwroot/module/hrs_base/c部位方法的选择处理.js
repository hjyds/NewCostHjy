function getJcbwDisplay(list, separator = "，") {
    if (!Array.isArray(list) || list.length === 0) {
        return "";
    }

    const topItems = [];
    const childGroups = Object.create(null);

    function getPrefix(gongXuan, checked) {
        if (Number(gongXuan) === 1) {
            return Number(checked) === 1 ? "■" : "□";
        }
        return Number(checked) === 1 ? "●" : "○";
    }

    for (const item of list) {
        const parentName = (item["上级方法"] || "").trim();
        const methodName = (item["方法名称"] || "").trim();
        const prefix = getPrefix(item["共选"], item["是否勾选"]);
        const text = prefix + methodName;

        if (!parentName) {
            topItems.push({
                methodName,
                text
            });
        } else {
            if (!childGroups[parentName]) {
                childGroups[parentName] = [];
            }
            childGroups[parentName].push(text);
        }
    }

    const result = [];

    for (const top of topItems) {
        result.push(top.text);

        if (childGroups[top.methodName] && childGroups[top.methodName].length > 0) {
            result.push("<" + childGroups[top.methodName].join(separator) + ">");
        }
    }

    return result.join(separator);
}

默认
默认
普通数字

"f507aee1-c755-4a97-9acd-782ae74ce572"

var data部位列表 = {}

var params = {
    "resTypeId": "fee813e7-2cae-42b9-b6a0-cb3a5fed12b0",
    "viewId": "2da7db4b-bfa8-4fec-874d-476d80687c3b",
    "row": 0,
    "source": "资源类型",
    "matching": [
        {
            "relId": "f4d07424-d8dc-4449-9beb-214bb85c42d7",
            "compare": "=",
            "val": outData入参.操作类型
        },
        {
            "relId": "35bd7f8f-b51b-45da-a531-9c1eb6925c97",
            "compare": "=",
            "val": outData入参.按规则计费
        }
    ]
}



const result = HrsServer.Post(
    "/api/FormalResourceDetailRel/GetResourceDetailRelByResTypeIdAndViewId",
    JSON.stringify(params)
);
debugger
var lstData = result.Data;

const keynameMap = [
    { id: "分组", name: "a3c5e6ae-a793-4d68-9334-84a041be400c" },
    { id: "部位", name: "182e7750-7d4f-487c-a9f9-81031b466443" },
    { id: "方法", name: "564764bd-f7ed-4480-947b-3604903aa09c" },
    { id: "备注", name: "d988d6e0-e3cf-4869-8f8d-f5bed8a95e25" }
];

const newData = lstData.map(row => {
    const obj = {};

    keynameMap.forEach(({ id, name }) => {
        let value = row[name];

        if (id === "方法" && typeof value === "string" && value.trim()) {
            try {
                value = JSON.parse(value);
            } catch (e) {
                console.error("方法 字段 JSON 解析失败：", value);
            }
        }

        obj[id] = value;
    });

    return obj;
});

data部位列表 = newData;

return data部位列表;


//////////////////////////////////////



(function (win, $) {
    function escapeHtml(str) {
        return String(str == null ? "" : str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function getRowBizKey(item) {
        return $.trim(item["分组"] || "") + "||" + $.trim(item["部位"] || "");
    }

    function groupRows(list) {
        var groups = [];
        var groupMap = {};

        (list || []).forEach(function (item, index) {
            var groupName = $.trim(item["分组"] || "");
            if (!groupMap[groupName]) {
                groupMap[groupName] = {
                    groupName: groupName,
                    rows: []
                };
                groups.push(groupMap[groupName]);
            }

            groupMap[groupName].rows.push({
                data: item,
                rowId: "row_" + index,
                bizKey: getRowBizKey(item)
            });
        });

        return groups;
    }

    function buildMethodHtml(methodList, rowId) {
        var sorted = (methodList || []).slice().sort(function (a, b) {
            return Number(a["序号"] || 0) - Number(b["序号"] || 0);
        });

        var parents = [];
        var childMap = {};
        var parentNameMap = {};

        sorted.forEach(function (item) {
            var parentName = $.trim(item["上级方法"] || "");
            var methodName = $.trim(item["方法名称"] || "");

            if (!parentName) {
                parents.push(item);
                parentNameMap[methodName] = true;
            } else {
                if (!childMap[parentName]) {
                    childMap[parentName] = [];
                }
                childMap[parentName].push(item);
            }
        });

        function renderItem(item, level, parentItem) {
            var methodName = $.trim(item["方法名称"] || "");
            var parentName = $.trim(item["上级方法"] || "");
            var isCheckbox = Number(item["共选"]) === 1;
            var inputType = isCheckbox ? "checkbox" : "radio";
            var inputName = "";

            if (isCheckbox) {
                inputName = "chk_" + rowId + "_" + item["序号"];
            } else {
                inputName = level === 1
                    ? "top_radio_" + rowId
                    : "child_radio_" + rowId + "_" + (parentItem ? parentItem["序号"] : parentName);
            }

            return [
                '<div class="method-row level-' + level + '">',
                '<label class="method-label">',
                '<input type="' + inputType + '"',
                ' name="' + escapeHtml(inputName) + '"',
                ' value="' + escapeHtml(methodName) + '"',
                ' data-row-id="' + escapeHtml(rowId) + '"',
                ' data-xh="' + escapeHtml(item["序号"]) + '"',
                ' data-parent="' + escapeHtml(parentName) + '"',
                ' data-level="' + level + '"',
                ' data-multi="' + escapeHtml(item["共选"]) + '"',
                ' data-contrast="' + escapeHtml(item["是否造影"]) + '">',
                '<span class="method-text">' + escapeHtml(methodName) + '</span>',
                Number(item["是否造影"]) === 1
                    ? '<span class="method-tag">造影</span>'
                    : '',
                '</label>',
                '</div>'
            ].join("");
        }

        var html = [];

        parents.forEach(function (parent) {
            html.push(renderItem(parent, 1, null));

            var children = childMap[$.trim(parent["方法名称"] || "")] || [];
            children.sort(function (a, b) {
                return Number(a["序号"] || 0) - Number(b["序号"] || 0);
            });

            children.forEach(function (child) {
                html.push(renderItem(child, 2, parent));
            });
        });

        sorted.forEach(function (item) {
            var parentName = $.trim(item["上级方法"] || "");
            if (parentName && !parentNameMap[parentName]) {
                html.push(renderItem(item, 1, null));
            }
        });

        return html.join("");
    }

    function buildTableHtml(list) {
        var groups = groupRows(list);
        var html = [
            '<div id="methodTableBox" class="method-table-wrap">',
            '<style>',
            '.method-table-wrap{padding:12px;max-height:520px;overflow:auto;}',
            '.method-table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:14px;}',
            '.method-table th,.method-table td{border:1px solid #e6e6e6;padding:10px;vertical-align:top;word-break:break-all;}',
            '.method-table th{background:#f8f8f8;text-align:center;font-weight:600;}',
            '.group-cell{width:90px;text-align:center;background:#fafafa;}',
            '.part-cell{width:180px;}',
            '.remark-cell{width:160px;color:#666;}',
            '.part-label{display:flex;align-items:center;cursor:pointer;}',
            '.part-label input{margin-right:8px;}',
            '.method-row{padding:4px 0;}',
            '.method-row.level-2{padding-left:24px;}',
            '.method-label{display:flex;align-items:center;cursor:pointer;}',
            '.method-label input{margin-right:8px;}',
            '.method-text{display:inline-block;}',
            '.method-tag{display:inline-block;margin-left:12px;color:#f56c6c;font-size:12px;border:1px solid #f56c6c;padding:0 6px;border-radius:10px;line-height:18px;}',
            '</style>',
            '<table class="method-table">',
            '<thead>',
            '<tr>',
            '<th style="width:90px;">分组</th>',
            '<th style="width:180px;">部位</th>',
            '<th>方法</th>',
            '<th style="width:160px;">备注</th>',
            '</tr>',
            '</thead>',
            '<tbody>'
        ];

        groups.forEach(function (group) {
            group.rows.forEach(function (row, rowIndex) {
                var item = row.data;

                html.push("<tr>");

                if (rowIndex === 0) {
                    html.push(
                        '<td class="group-cell" rowspan="' + group.rows.length + '">' +
                        escapeHtml(group.groupName) +
                        '</td>'
                    );
                }

                html.push(
                    '<td class="part-cell">' +
                    '<label class="part-label">' +
                    '<input type="checkbox" class="js-part-check"' +
                    ' data-row-id="' + escapeHtml(row.rowId) + '"' +
                    ' data-biz-key="' + escapeHtml(row.bizKey) + '"' +
                    ' data-group="' + escapeHtml(item["分组"] || "") + '"' +
                    ' data-part="' + escapeHtml(item["部位"] || "") + '"' +
                    ' data-remark="' + escapeHtml(item["备注"] || "") + '">' +
                    '<span>' + escapeHtml(item["部位"] || "") + '</span>' +
                    '</label>' +
                    '</td>'
                );

                html.push(
                    '<td class="method-cell">' +
                    buildMethodHtml(item["方法"], row.rowId) +
                    '</td>'
                );

                html.push(
                    '<td class="remark-cell">' + escapeHtml(item["备注"] || "") + '</td>'
                );

                html.push("</tr>");
            });
        });

        html.push(
            '</tbody>',
            '</table>',
            '</div>'
        );

        return html.join("");
    }

    function bindMethodRelation(layero) {
        var $box = $(layero).find("#methodTableBox");

        function getPartCheck(rowId) {
            return $box.find('.js-part-check[data-row-id="' + rowId + '"]');
        }

        function getMethodInputs(rowId) {
            return $box.find('input[data-row-id="' + rowId + '"]');
        }

        function getParentInput(rowId, parentName) {
            return $box.find('input[data-row-id="' + rowId + '"][data-level="1"]').filter(function () {
                return $(this).val() === parentName;
            });
        }

        function getChildInputs(rowId, parentName) {
            return $box.find('input[data-row-id="' + rowId + '"][data-level="2"]').filter(function () {
                return ($(this).attr("data-parent") || "") === parentName;
            });
        }

        function syncPartCheck(rowId) {
            var hasCheckedMethod = getMethodInputs(rowId).filter(":checked").length > 0;
            getPartCheck(rowId).prop("checked", hasCheckedMethod);
        }

        $box.on("change", ".js-part-check", function () {
            var $part = $(this);
            var rowId = $part.attr("data-row-id");

            if (!$part.prop("checked")) {
                getMethodInputs(rowId).prop("checked", false);
            }
        });

        $box.on("change", 'input[data-level="1"]', function () {
            var $parent = $(this);
            var rowId = $parent.attr("data-row-id");
            var parentName = $parent.val();
            var checked = $parent.prop("checked");
            var type = ($parent.attr("type") || "").toLowerCase();

            if (checked) {
                getPartCheck(rowId).prop("checked", true);
            } else {
                getChildInputs(rowId, parentName).prop("checked", false);
            }

            if (checked && type === "radio") {
                $box.find('input[data-row-id="' + rowId + '"][data-level="1"]').not($parent).each(function () {
                    var otherParentName = $(this).val();
                    getChildInputs(rowId, otherParentName).prop("checked", false);
                });
            }

            syncPartCheck(rowId);
        });

        $box.on("change", 'input[data-level="2"]', function () {
            var $child = $(this);
            var rowId = $child.attr("data-row-id");
            var parentName = $child.attr("data-parent") || "";
            var checked = $child.prop("checked");

            if (checked) {
                getPartCheck(rowId).prop("checked", true);
            }

            if (parentName) {
                var $parent = getParentInput(rowId, parentName);
                if ($parent.length) {
                    if (checked) {
                        $parent.prop("checked", true);
                    } else {
                        var hasCheckedChild = getChildInputs(rowId, parentName).filter(":checked").length > 0;
                        if (!hasCheckedChild) {
                            $parent.prop("checked", false);
                        }
                    }
                }
            }

            syncPartCheck(rowId);
        });
    }

    win.openMethodLayer = function (list) {
        layer.open({
            type: 1,
            title: "选择部位方法",
            area: ["960px", "620px"],
            shadeClose: false,
            content: buildTableHtml(list),
            btn: ["确定", "清空", "取消"],
            success: function (layero) {
                bindMethodRelation(layero);
            },
            yes: function (index, layero) {
                var result = [];

                $(layero).find(".js-part-check:checked").each(function () {
                    var $part = $(this);
                    var rowId = $part.attr("data-row-id");
                    var methods = [];

                    $(layero).find('input[data-row-id="' + rowId + '"]:checked').each(function () {
                        methods.push({
                            序号: $(this).data("xh"),
                            上级方法: $(this).data("parent"),
                            方法名称: $(this).val(),
                            共选: $(this).data("multi"),
                            是否造影: $(this).data("contrast")
                        });
                    });

                    result.push({
                        分组: $part.data("group"),
                        部位: $part.data("part"),
                        方法: methods,
                        备注: $part.data("remark")
                    });
                });

                console.log(result);
                layer.close(index);
            },
            btn2: function (index, layero) {
                $(layero).find("#methodTableBox input").prop("checked", false);
                return false;
            }
        });
    };
})(window, jQuery);
debugger
var tempdata = outData部位列表;
var tempdataSel = outData已选信息;
openMethodLayer(tempdata);