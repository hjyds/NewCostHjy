
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



}

/**
 * 医疗人员规则引擎（三段式：语法校验 → 生成表达式串 → 求值）
 *
 * 用法：
 *   var r = RuleEngine.build(conditions);
 *   if (!r.valid) { console.log(r.errors); return; }
 *   console.log(r.expression);              // 逻辑表达式串
 *   console.log(r.evaluate(personA));        // true / false
 */
var RuleEngine = (function ($) {

    /* ===================== 常量定义 ===================== */
    var OPS_ALLOWED = ['=', '!=', '∈', '∉'];
    var CONN_ALLOWED = ['AND', 'OR'];
    var OP_NAME_MAP = { '=': '=', '!=': '!=', '∈': 'IN', '∉': 'NOT IN' };

    /* ===================== 比较符实现 ===================== */
    var OP_MAP = {
        '=': function (actual, expected) {
            return String(actual == null ? '' : actual) === String(expected == null ? '' : expected);
        },
        '!=': function (actual, expected) {
            return String(actual == null ? '' : actual) !== String(expected == null ? '' : expected);
        },
        '∈': function (actual, list) {
            var v = String(actual == null ? '' : actual);
            return list.some(function (x) { return x === v; });
        },
        '∉': function (actual, list) {
            var v = String(actual == null ? '' : actual);
            return list.every(function (x) { return x !== v; });
        }
    };

    var PRECEDENCE = { 'AND': 2, 'OR': 1 };

    /* ===================== 工具函数 ===================== */
    function splitList(s) {
        return String(s == null ? '' : s)
            .split(/[,，]/)
            .map(function (x) { return x.trim(); })
            .filter(function (x) { return x.length > 0; });
    }

    /** 把字符串值转成表达式中的字面量 */
    function literal(v) {
        return "'" + String(v == null ? '' : v).replace(/'/g, "\\'") + "'";
    }

    /* ===================== ① 语法校验 ===================== */
    function validate(conditions) {
        var errors = [];

        if (!$.isArray(conditions) || conditions.length === 0) {
            errors.push('条件列表为空或不是数组');
            return { valid: false, errors: errors };
        }

        // 按 order 排序，便于按物理顺序检查括号
        var sorted = conditions
            .map(function (c, i) { return $.extend({ __idx: i + 1 }, c); })
            .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });

        // 1) 单条字段校验
        var seenOrders = {};
        sorted.forEach(function (c) {
            var tag = '第' + (c.__idx) + '条（order=' + c.order + '）';

            if (c.field == null || String(c.field).trim() === '') {
                errors.push(tag + '：条件名称为空');
            }
            if (!c.op || OPS_ALLOWED.indexOf(c.op) === -1) {
                errors.push(tag + '：比较符 [' + c.op + '] 非法，允许 ' + OPS_ALLOWED.join(' / '));
            }
            if (c.value == null || String(c.value).trim() === '') {
                errors.push(tag + '：条件值为空');
            }
            if (c.connector && CONN_ALLOWED.indexOf(String(c.connector).toUpperCase()) === -1) {
                errors.push(tag + '：关系符 [' + c.connector + '] 非法，允许 AND / OR');
            }
            // ∈ / ∉ 必须能拆出至少一项
            if ((c.op === '∈' || c.op === '∉') && splitList(c.value).length === 0) {
                errors.push(tag + '：使用 ' + c.op + ' 时，条件值必须至少有一项（逗号分隔）');
            }
            // order 重复
            if (seenOrders[c.order]) {
                errors.push(tag + '：序号 ' + c.order + ' 重复');
            }
            seenOrders[c.order] = true;
        });

        // 2) 括号配对：从左到右扫，遇到左括号入栈，右括号必须能弹到左括号
        var stack = [];
        sorted.forEach(function (c) {
            var tag = '第' + c.__idx + '条（order=' + c.order + '）';
            var lp = String(c.leftParen || '');
            var rp = String(c.rightParen || '');
            for (var i = 0; i < lp.length; i++) {
                if (lp[i] === '(') stack.push(tag);
                else errors.push(tag + '：左括号列出现非法字符 [' + lp[i] + ']');
            }
            for (var j = 0; j < rp.length; j++) {
                if (rp[j] === ')') {
                    if (!stack.length) errors.push(tag + '：右括号没有匹配的左括号');
                    else stack.pop();
                } else {
                    errors.push(tag + '：右括号列出现非法字符 [' + rp[j] + ']');
                }
            }
        });
        if (stack.length) {
            errors.push('还有 ' + stack.length + ' 个左括号未闭合，最近未闭合位置：' + stack.join('；'));
        }

        return errors.length
            ? { valid: false, errors: errors }
            : { valid: true, sorted: sorted };
    }

    /* ===================== ② 生成逻辑表达式串 ===================== */
    function toExpression(sorted) {
        return sorted.map(function (c) {
            var cond;
            if (c.op === '∈' || c.op === '∉') {
                var items = splitList(c.value).map(literal).join(', ');
                cond = c.field + ' ' + OP_NAME_MAP[c.op] + ' (' + items + ')';
            } else {
                cond = c.field + ' ' + c.op + ' ' + literal(c.value);
            }
            // 嵌入括号
            var seg = (c.leftParen || '') + cond + (c.rightParen || '');
            // 连接符放在下一段前面：把当前的 connector 粘在本段末尾，等价于下一段开头
            return seg + (c.connector ? ' ' + String(c.connector).toUpperCase() + ' ' : '');
        }).join('');
    }

    /* ===================== ③ 逆波兰求值（保留上一版） ===================== */
    function toRPN(sorted) {
        var output = [], stack = [];
        sorted.forEach(function (cond) {
            var lp = String(cond.leftParen || '');
            for (var i = 0; i < lp.length; i++) if (lp[i] === '(') stack.push('(');

            output.push({ type: 'cond', data: cond });

            var rp = String(cond.rightParen || '');
            for (var j = 0; j < rp.length; j++) {
                if (rp[j] === ')') {
                    while (stack.length && stack[stack.length - 1] !== '(') {
                        output.push({ type: 'op', value: stack.pop() });
                    }
                    stack.pop(); // 弹掉 '('
                }
            }

            var conn = (cond.connector || '').toUpperCase();
            if (conn) {
                while (stack.length
                    && stack[stack.length - 1] !== '('
                    && PRECEDENCE[stack[stack.length - 1]] >= PRECEDENCE[conn]) {
                    output.push({ type: 'op', value: stack.pop() });
                }
                stack.push(conn);
            }
        });
        while (stack.length) output.push({ type: 'op', value: stack.pop() });
        return output;
    }

    function evalCond(cond, person) {
        var actual = person[cond.field];
        if (cond.op === '∈' || cond.op === '∉') {
            return OP_MAP[cond.op](actual, splitList(cond.value));
        }
        return OP_MAP[cond.op](actual, cond.value);
    }

    function makeEvaluator(sorted) {
        var rpn = toRPN(sorted);
        return function (person) {
            var st = [];
            rpn.forEach(function (node) {
                if (node.type === 'cond') {
                    st.push(evalCond(node.data, person));
                } else {
                    var r = st.pop(), l = st.pop();
                    st.push(node.value === 'AND' ? (l && r) : (l || r));
                }
            });
            return !!st[0];
        };
    }

    /* ===================== 统一入口 ===================== */
    function build(conditions) {
        var v = validate(conditions);
        if (!v.valid) return { valid: false, errors: v.errors };

        var expression = toExpression(v.sorted);
        var evaluate = makeEvaluator(v.sorted);
        return {
            valid: true,
            expression: expression,     // 生成的逻辑表达式串
            evaluate: evaluate          // 可直接调用的求值函数
        };
    }

    return {
        build: build,
        validate: validate,
        toExpression: toExpression
    };

})(jQuery);



window.GetMapNodeKey = function () {
    return {
        "01a159d4-732b-7079-bc6d-3163104c4a56": "leftParen",   // 左括号  (
        "01a159d4-732b-7d06-9905-2d9f049b54e0": "field",       // 字段名
        "01a159d4-732c-7c9c-8aef-009f7c6af40c": "op",          // 操作符   
        "01a159d4-732c-7999-b929-881a39dc147e": "value",       // 取值
        "01a159d4-732d-7799-91c3-fdf063e6e881": "rightParen",  // 右括号  )
        "01a159d4-732d-7af0-8d36-5928d6b68427": "connector",   // 连接符  AND / OR
        "01a159d4-732a-7ea9-b27f-715dbfbccb69": "order"        // 排序号
    };
}

window.ExeRuleCheck = function () {
    debugger
    function transformConditionNodes(jsonArr) {
        const renamed = renameKeysDeep(jsonArr, NODE_NAME_MAP);

        // 每个节点只保留我们关心的 7 个字段（如还有业务扩展字段，请在白名单里加）
        const WHITELIST = ["leftParen", "field", "op", "value", "rightParen", "connector", "order"];

        return renamed
            .map(n => {
                const clean = {};
                WHITELIST.forEach(k => {
                    if (n[k] !== undefined && n[k] !== null && n[k] !== "") {
                        clean[k] = n[k];
                    }
                });
                // order 转数字，便于排序
                if (clean.order !== undefined) clean.order = Number(clean.order);
                return clean;
            })
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    }

    function renameKeysDeep(node, map) {
        if (Array.isArray(node)) {
            return node.map(item => renameKeysDeep(item, map));
        }
        if (node !== null && typeof node === "object") {
            const out = {};
            for (const key of Object.keys(node)) {
                const newKey = map[key] || key;          // 命中映射就替换，否则保留原 key
                out[newKey] = renameKeysDeep(node[key], map);
            }
            return out;
        }
        return node;                                  // 原始值直接返回
    }
    const NODE_NAME_MAP = window.GetMapNodeKey();
    let dataTab = $("[data-id='com_zifo7baneyi']")[0]?.firstElementChild?.data;
    var conditions = transformConditionNodes(dataTab);

    var lstErr = RuleEngine.validate(conditions).errors;

    if (lstErr && lstErr.length > 0) {
        layer.alert(lstErr.join('<br>'), { icon: 0 });
        return;
    }

    var r = RuleEngine.build(conditions);

    if (!r.valid) {
        console.error('语法错误：', r.errors);
    } else {
        layer.alert('校验通过，表达式：\n' + r.expression, { icon: 0 });
    }
}