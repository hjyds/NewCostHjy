

(function (win, $) {
    function escapeHtml(str) {
        return String(str == null ? "" : str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    function norm(v) {
        return $.trim(v == null ? "" : String(v));
    }

    function getRowBizKey(item) {
        return norm(item["分组"]) + "||" + norm(item["部位"]);
    }

    function groupRows(list) {
        var groups = [];
        var groupMap = {};

        (list || []).forEach(function (item, index) {
            var groupName = norm(item["分组"]);
            if (!groupMap[groupName]) {
                groupMap[groupName] = { groupName: groupName, rows: [] };
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
            var parentName = norm(item["上级方法"]);
            var methodName = norm(item["方法名称"]);

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
            var methodName = norm(item["方法名称"]);
            var parentName = norm(item["上级方法"]);
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
                Number(item["是否造影"]) === 1 ? '<span class="method-tag">造影</span>' : '',
                '</label>',
                '</div>'
            ].join("");
        }

        var html = [];

        parents.forEach(function (parent) {
            html.push(renderItem(parent, 1, null));

            var children = childMap[norm(parent["方法名称"])] || [];
            children.sort(function (a, b) {
                return Number(a["序号"] || 0) - Number(b["序号"] || 0);
            });

            children.forEach(function (child) {
                html.push(renderItem(child, 2, parent));
            });
        });

        sorted.forEach(function (item) {
            var parentName = norm(item["上级方法"]);
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
            '.part-label input{margin - right:8px;}',
            '.method-row{padding:4px 0;}',
            '.method-row.level-2{padding - left:24px;}',
            '.method-label{display:flex;align-items:center;cursor:pointer;}',
            '.method-label input{margin - right:8px;}',
            '.method-tag{display:inline-block;margin-left:12px;color:#f56c6c;font-size:12px;border:1px solid #f56c6c;padding:0 6px;border-radius:10px;line-height:18px;}',
            '</style>',
            '<table class="method-table">',
            '<thead><tr><th style="width:90px;">分组</th><th style="width:180px;">部位</th><th>方法</th><th style="width:160px;">备注</th></tr></thead>',
            '<tbody>'
        ];

        groups.forEach(function (group) {
            group.rows.forEach(function (row, rowIndex) {
                var item = row.data;

                html.push("<tr>");

                if (rowIndex === 0) {
                    html.push('<td class="group-cell" rowspan="' + group.rows.length + '">' + escapeHtml(group.groupName) + '</td>');
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

                html.push('<td class="method-cell">' + buildMethodHtml(item["方法"], row.rowId) + '</td>');
                html.push('<td class="remark-cell">' + escapeHtml(item["备注"] || "") + '</td>');
                html.push("</tr>");
            });
        });

        html.push('</tbody></table></div>');
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
                return norm($(this).attr("data-parent")) === norm(parentName);
            });
        }

        function syncPartCheck(rowId) {
            var hasCheckedMethod = getMethodInputs(rowId).filter(":checked").length > 0;
            if (hasCheckedMethod) {
                getPartCheck(rowId).prop("checked", true);
            }
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
                    getChildInputs(rowId, $(this).val()).prop("checked", false);
                });
            }
        });

        $box.on("change", 'input[data-level="2"]', function () {
            var $child = $(this);
            var rowId = $child.attr("data-row-id");
            var parentName = norm($child.attr("data-parent"));
            var checked = $child.prop("checked");

            if (checked) {
                getPartCheck(rowId).prop("checked", true);
            }

            if (parentName) {
                var $parent = getParentInput(rowId, parentName);
                if ($parent.length) {
                    if (checked) {
                        $parent.prop("checked", true);
                    } else if (getChildInputs(rowId, parentName).filter(":checked").length === 0) {
                        $parent.prop("checked", false);
                    }
                }
            }
        });
    }

    function applyDefaultChecked(layero, checkedList) {
        var $box = $(layero).find("#methodTableBox");
        var list = checkedList || [];

        list.forEach(function (item) {
            var partName = norm(item["部位"]);
            var methodName = norm(item["方法"]);
            var parentName = norm(item["上级方法"]);

            var $part = $box.find(".js-part-check").filter(function () {
                return norm($(this).data("part")) === partName;
            }).first();

            if (!$part.length) {
                return;
            }

            if (!methodName) {
                $part.prop("checked", true);
                return;
            }

            var rowId = $part.attr("data-row-id");

            var $method = $box.find('input[data-row-id="' + rowId + '"][data-level]').filter(function () {
                return norm($(this).val()) === methodName &&
                    norm($(this).attr("data-parent")) === parentName;
            }).first();

            if (!$method.length) {
                return;
            }

            $part.prop("checked", true);
            $method.prop("checked", true);

            if (Number($method.attr("data-level")) === 2) {
                var $parent = $box.find('input[data-row-id="' + rowId + '"][data-level="1"]').filter(function () {
                    return norm($(this).val()) === parentName;
                }).first();

                if ($parent.length) {
                    $parent.prop("checked", true);
                }
            }
        });
    }
    win.openMethodLayer = function (list, checkedList) {
        layer.open({
            type: 1,
            title: "选择部位方法",
            area: ["960px", "620px"],
            shadeClose: false,
            content: buildTableHtml(list),
            btn: ["确定", "清空", "取消"],
            success: function (layero) {
                bindMethodRelation(layero);
                applyDefaultChecked(layero, checkedList);
            },
            yes: function (index, layero) {
                var result = [];

                $(layero).find(".js-part-check:checked").each(function () {
                    var $part = $(this);
                    var rowId = $part.attr("data-row-id");
                    var methods = [];

                    $(layero).find('input[data-row-id="' + rowId + '"]:checked').each(function () {
                        methods.push({
                            方法: $(this).val(),
                            上级方法: $(this).data("parent") || null,
                            部位: $part.data("part")
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
openMethodLayer(tempdata, tempdataSel);


const data = [
    { "序号": 1, "上级方法": "", "方法名称": "平扫", "共选": 0, "是否造影": 0, "是否勾选": 0 },
    { "序号": 2, "上级方法": "", "方法名称": "CT重建", "共选": 1, "是否造影": 0, "是否勾选": 0 },
    { "序号": 3, "上级方法": "", "方法名称": "增强扫描", "共选": 1, "是否造影": 0, "是否勾选": 1 },
    { "序号": 4, "上级方法": "增强扫描", "方法名称": "平扫加增强", "共选": 1, "是否造影": 0, "是否勾选": 0 },
    { "序号": 5, "上级方法": "增强扫描", "方法名称": "水平位", "共选": 1, "是否造影": 0, "是否勾选": 1 },
    { "序号": 6, "上级方法": "", "方法名称": "薄层扫描", "共选": 1, "是否造影": 0, "是否勾选": 1 },
    { "序号": 7, "上级方法": "薄层扫描", "方法名称": "水平位", "共选": 1, "是否造影": 0, "是否勾选": 1 }
];

// select a.分组, a.编码, a.名称, a.方法, a.备注, a.项目id
//     , Zl_Fun_检查方法解析(a.方法, 1, a.项目id, a.名称) as 方法显示
//     , Zl_Fun_检查方法解析(a.方法, 2, a.项目id, a.名称) as 已选方法
// from(select  distinct a.分组, a.编码, a.名称, a.方法, a.备注, null 选择, a.项目id
// from(Select  a.分组, a.编码, a.名称, a.方法, a.备注, Decode(a.名称, b.部位, 1, 0) As 选择, b.项目id
// From 诊疗检查部位 A, 诊疗项目部位 B
// Where a.方法 Is Not Null And a.类型 = 'CT'   And  b.默认 = 1
// And a.名称 = b.部位(+) And a.类型 = b.类型(+) And 183799 = b.项目id(+) and 0 = 0
// union all
// Select    a.分组, a.编码, a.名称, a.方法, a.备注, Decode(a.名称, b.部位, 1, 0) As 选择, b.项目id
// From 放射检查部位 a, 放射项目部位 b
// Where a.方法 Is Not Null And a.类型 = 'CT'  And  b.默认 = 1
// And a.名称 = b.部位(+) And a.类型 = b.类型(+) And 183799 = b.项目id(+) and 1 = 0) a) a
// order by a.分组, a.编码, a.名称


// alter table 放射项目部位 add 序号 NUMBER(3);
// Zl_放射项目部位_Insert

// alter table 诊疗项目部位 add 序号 NUMBER(3);
// Zl_诊疗项目部位_Insert
