/*
* 费用基础服务
*
* 模块：通用弹窗
*
* 作者：
*
* 说明：
*
* 创建时间：2024-09-29
*
* 版权：重庆中联信息产业有限责任公司
*/
(function () {

    var g_PromptData;
    //提示对象

    //#region 跨域处理
    window.addEventListener("message", function (event) {
        //event.origin --发送者的源
        //event.source --发送者的window对象
        //event.data --数据{"act":"initdata","par":{}}
        if (event.data && event.data.Act && (event.data.Sys == "zlCost" || event.data.Sys == "ZLHIS")) {
            switch (event.data.ActCode) {
                //初始化
                case "R0016":
                    //LoadPrompt
                    //获取传入值
                    var para = event.data.Content;
                    LoadPrompt(para);
                    break;
            }
        }
    });

    if (window.aioExtend) {
        window.aioExtend.onPostMessage = (dataStr) => {
            let data = JSON.parse(dataStr);
            if (data && data.Act && (data.Sys == "zlCost" || data.Sys == "ZLHIS")) {
                switch (data.ActCode) {
                    //初始化
                    case "R0016":
                        //LoadPrompt
                        //获取传入值
                        var para = data.Content;
                        LoadPrompt(para);
                        break;
                }
            }
        }
    }
    //#endregion

    $(function () {

        var _lock = false;
        $("#confirmBtn").click(function () {
            if (_lock)
                return;
            _lock = true;

            try {
                GetPromptResult(function (promptData) {
                    console.log(promptData);
                    ClosePage(false, promptData);
                });
            } finally {
                _lock = false;
            }

        });

        $("#cancelBtn").click(function () {
            ClosePage(true);
        });

        SendMessage("OpenedLayer", "S0027", "");
        if (window.aioExtend) {
            SendMessageAIO("OpenedLayer", "S0027", "");
        }
    });

    //----------------------------私有方法-----------------------------------
    function LoadPrompt(data) {
        if (IsNullOrEmpty(data) || IsNullOrEmpty(data.PromptData) || data.PromptData.length == 0) {
            //发送关闭消息
            return;
        }

        g_PromptData = data.PromptData;
        let content = GenerateModalContent(g_PromptData);
        let $modalContent = $("#modalContent");
        $modalContent.html(content);
        $("#modalContainer").css("display", "block");

        AddOptionChangeEvent();
    }

    /**
     * 组装整体内容
     * @param {any} data
     */
    function GenerateModalContent(data) {
        //先显示，再根据条件隐藏
        $("#confirmBtn").show();

        let content = '';
        //按提示类型排序
        data.sort((a, b) => Number(a.PromptTypeCode) - Number(b.PromptTypeCode));
        // 遍历每个提示类型
        for (let promptType of data) {
            //按提示等级排序
            promptType.PromptList.sort((a, b) => Number(a.Level) - Number(b.Level));

            content += `
                <div class="section">
                    <div class="section-title">
                        <i class="fas ${promptType.PromptTypeCode === Const.PromptType.InsuranceRegulation ? 'fa-pills' : 'fa-money-check-alt'}"></i>
                        ${promptType.PromptType}（${promptType.PromptList.length}项）
                    </div>`;

            //遍历每个提示项
            for (let prompt of promptType.PromptList) {
                let levelStyle = GetLevelStyle(prompt.Level);
                let condition = ParseConditions(prompt.Content);
                let bedNumber = GenerateBedNumber(prompt.PatBed);
                if (prompt.Level == Const.PromptLevel.Prohibit) {
                    $("#confirmBtn").hide();
                }

                content += `
                    <div class="alert-item ${levelStyle.class}">
                        <div class="alert-icon">
                            <i class="fas ${levelStyle.icon}"></i>
                        </div>
                        <div class="alert-content">
                            <div class="alert-title"><span>${levelStyle.title}${prompt.ItemName}</span>${bedNumber}</div>`;

                if (condition.Condition.length > 0) {
                    //前标语
                    content += `
                            <div class="medication-conditions">
                                <div class="condition-title">${condition.Tittle}</div>
                                <ul class="condition-list">`;

                    condition.Condition.forEach(condition => {
                        content += `<li class="condition-item">${condition}</li>`;
                    }
                    );

                    content += `</ul></div>`;
                    //后标语
                    content += `
                            <div class="medication-conditions">
                                <div class="condition-title">${condition.Less}</div>`;
                } else {
                    let promptContent = prompt.Content;
                    if (promptContent == "无" || promptContent == "-") {
                        promptContent = "";
                    }
                    content += `<div class="alert-desc">${promptContent}</div>`;
                }

                // 生成结果选项
                content += GenerateResultOptions(prompt.Result);

                content += `</div></div>`;
            }
            content += `</div>`;
        }
        return content;
    }

    /**
     * 等级样式
     * @param {any} level
     * @returns
     */
    function GetLevelStyle(level) {
        switch (level) {
            case Const.PromptLevel.Remind:
                return {
                    class: "warning",
                    icon: "fa-exclamation-circle",
                    title: "提示："
                };
            case Const.PromptLevel.Prohibit:
                return {
                    class: "danger",
                    icon: "fa-ban",
                    title: "禁止："
                };
            case Const.PromptLevel.Marks:
                return {
                    class: "medication-item",
                    icon: "fa-file-medical-alt",
                    title: ""//标记不额外加标题
                };
            default:
                return {
                    class: "warning",
                    icon: "fa-info-circle",
                    title: "提示："
                };
        }
    }

    // 解析Content中的条件列表（支持<li>标签）
    function ParseConditions(content) {
        let result;
        // 检查是否包含<li>标签
        let conditions = [];
        if (content.includes('<li>')) {
            // 提取<li>标签内容
            const liMatches = content.match(/<li>(.*?)<\/li>/g);
            if (liMatches) {
                conditions = liMatches.map(li => li.replace(/<\/?li>/g, '').trim());
            }
            //获取<Li>标签前面的内容
            let firstLiIndex = content.indexOf('<li>');
            let title = content.substring(0, firstLiIndex);
            //获取<Li>标签后面的内容
            let lessLiIndex = content.lastIndexOf('</li>');
            let less = content.substring(lessLiIndex + 5);

            result = {
                "Tittle": title,
                "Condition": conditions,
                "Less": less
            }
        } else {
            result = {
                "Tittle": content,
                "Condition": [],
                "Less": ""
            }
        }
        return result;
    }

    /**
     * 显示床号
     * @param {any} patBed
     * @returns
     */
    function GenerateBedNumber(patBed) {
        if (!IsNullOrEmpty(patBed)) {
            return `<div class="bed-number">
                    <i class="fas fa-bed"></i>
                    ${patBed}床
                </div>`;
        }
        return '';
    }

    /**
     * 扁平化处理嵌套的结果选项，保持原有显示效果
     * @param {any} result 标记结果
     * @param {any} parentId 父项ID
     * @returns
     */
    function GenerateResultOptions(result, parentId = undefined, parentCode = undefined) {
        let html = '';

        if (!result || result.length === 0)
            return html;

        // 首先处理第一层级的结果
        result.forEach(item => {
            let conditionalClass = parentId ? 'conditional-result' : '';
            let displayStyle = parentId ? 'style="display: none;"' : '';

            html += `<div class="result-section ${conditionalClass}" id="${item.ResultId}" data-parent="${parentId}" data-parentcode="${parentCode}" ${displayStyle}>`;
            html += `<div class="result-title">${item.ResultDesc}</div>`;

            if (item.ResultTypeCode === Const.ControlType.Radio) {
                html += `<div class="radio-group">`;

                item.ResultValue.forEach((value, index) => {
                    html += `
                            <div class="radio-option">
                                <input type="radio" id="option-${item.ResultId}-${value.Code}" name="option-${item.ResultId}" value="${value.Code}">
                                <label for="option-${item.ResultId}-${value.Code}">${value.Name}</label>
                            </div>
                        `;
                }
                );

                html += `</div>`;
            } else if (item.ResultTypeCode === Const.ControlType.CheckBox) {
                html += `<div class="checkbox-group">`;

                item.ResultValue.forEach((value, index) => {
                    html += `
                            <div class="checkbox-option">
                                <input type="checkbox" id="option-${item.ResultId}-${value.Code}" name="option-${item.ResultId}" value="${value.Code}">
                                <label for="option-${item.ResultId}-${value.Code}">${value.Name}</label>
                            </div>
                        `;
                }
                );

                html += `</div>`;
            } else if (item.ResultTypeCode === Const.ControlType.Text) {
                let value = zlnvl(item.ResultValue);
                html += `<textarea class="text-input" id="option-${item.ResultId}" placeholder="${value}"></textarea>`;
            }

            html += `</div>`;
        }
        );

        // 然后处理嵌套的结果（保持扁平化显示）
        result.forEach(item => {
            if (item.ResultValue && Array.isArray(item.ResultValue)) {
                item.ResultValue.forEach(value => {
                    if (value.Result && value.Result.length > 0) {
                        // 为嵌套结果添加条件显示类
                        let nestedHtml = GenerateResultOptions(value.Result, item.ResultId, value.Code).replace(/result-section/g, 'result-section conditional-result');
                        html += nestedHtml;
                    }
                }
                );
            }
        }
        );

        return html;
    }

    function AddOptionChangeEvent() {
        // 查找所有单选按钮
        let radioGroups = document.querySelectorAll('.radio-group');

        radioGroups.forEach(group => {
            let radios = group.querySelectorAll('input[type="radio"]');

            radios.forEach(radio => {
                radio.addEventListener('change', function () {
                    triggerChangeEvent(this);
                });
            }
            );
        }
        );

        // 查找所有多选框
        let checkboxGroups = document.querySelectorAll('.checkbox-group');

        checkboxGroups.forEach(group => {
            let checkboxes = group.querySelectorAll('input[type="checkbox"]');

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', function () {
                    triggerCheckboxChangeEvent(this);
                });
            }
            );
        }
        );

        // 查找所有多选框
        const textGroups = document.querySelectorAll('.text-input');

        textGroups.forEach(group => {
            group.addEventListener('change', function () {
                triggerTextChangeEvent(this);
            });
        }
        );

        // 触发单选按钮change事件处理函数
        function triggerChangeEvent(radio) {
            let resultId = radio.name.replace('option-', '');
            let value = radio.value;
            // 查找所有条件结果
            let conditionalResults = document.querySelectorAll(`.conditional-result[data-parent="${resultId}"]`);

            conditionalResults.forEach(conditional => {
                if (value == conditional.dataset["parentcode"]) {
                    conditional.style.display = 'block';
                } else {
                    conditional.style.display = 'none';
                    resetNestedOptions(conditional);
                }
            }
            );
        }

        // 触发多选框change事件处理函数
        function triggerCheckboxChangeEvent(checkbox) {
            let resultId = checkbox.name.replace('option-', '');
            let value = checkbox.value;
            let isChecked = checkbox.checked;

            // 查找所有条件结果
            const conditionalResults = document.querySelectorAll(`.conditional-result[data-parent="${resultId}"]`);

            conditionalResults.forEach(conditional => {
                // 检查是否依赖当前结果
                if (value == conditional.dataset["parentcode"]) {
                    conditional.style.display = isChecked ? 'block' : 'none';
                    if (!isChecked) {
                        resetNestedOptions(conditional);
                    }
                }
            }
            );
        }

        function triggerTextChangeEvent(inputText) {
            let resultId = inputText.id.replace('option-', '');
            let value = inputText.value;

            // 查找所有条件结果
            const conditionalResults = document.querySelectorAll(`.conditional-result[data-parent="${resultId}"]`);

            conditionalResults.forEach(conditional => {
                conditional.style.display = IsNullOrEmpty(value) ? 'none' : 'block';
                if (IsNullOrEmpty(value)) {
                    resetNestedOptions(conditional);
                }
            }
            );
        }

        // 重置嵌套选项
        function resetNestedOptions(element) {
            // 重置单选按钮
            const childRadios = element.querySelectorAll('input[type="radio"]');
            childRadios.forEach(childRadio => {
                if (childRadio.checked) {
                    childRadio.checked = false;
                    triggerChangeEvent(childRadio);
                    //强制触发
                }
            }
            );

            // 重置多选框
            const childCheckboxes = element.querySelectorAll('input[type="checkbox"]');
            childCheckboxes.forEach(childCheckbox => {
                if (childCheckbox.checked) {
                    childCheckbox.checked = false;
                    triggerCheckboxChangeEvent(childCheckbox);
                    //强制触发
                }
            }
            );

            // 重置文本输入框
            const childTextareas = element.querySelectorAll('textarea');
            childTextareas.forEach(childTextarea => {
                childTextarea.value = '';
                triggerTextChangeEvent(childTextarea);
                //强制触发
            }
            );
        }
    }

    /**
     * 获取选项结果
     * @param {any} sucessCall 成功回调
     * @returns
     */
    function GetPromptResult(sucessCall) {
        let promptData = JSON.parse(JSON.stringify(g_PromptData));

        let cancel = false;
        for (let promptType of promptData) {
            for (let prompt of promptType.PromptList) {
                if (prompt.Result && Array.isArray(prompt.Result)) {
                    for (let item of prompt.Result) {
                        item.ResultValue = GetReusltValue(item, function () {
                            cancel = true;
                        });
                        if (cancel)
                            return;
                    }
                }
            }
        }
        if (cancel)
            return;
        sucessCall(promptData);
    }
    ;
    function GetReusltValue(result, cancelCall) {
        let resultValues = [];

        if (result.ResultTypeCode == Const.ControlType.Radio) {
            for (let item of result.ResultValue) {
                if ($(`#option-${result.ResultId}-${item.Code}`).is(":checked")) {
                    //嵌套获取子项
                    if (item.Result && item.Result.length > 0) {
                        for (let opt of item.Result) {
                            opt.ResultValue = GetReusltValue(opt, function () {
                                cancelCall();
                                return;
                            });
                        }
                        ;
                    }
                    resultValues.push(item);
                }
            }
            ;
        } else if (result.ResultTypeCode == Const.ControlType.CheckBox) {
            for (let item of result.ResultValue) {
                if ($(`#option-${result.ResultId}-${item.Code}`).is(":checked")) {
                    //嵌套获取子项
                    if (item.Result && item.Result.length > 0) {
                        for (let opt of item.Result) {
                            opt.ResultValue = GetReusltValue(opt, function () {
                                cancelCall();
                                return;
                            });
                        }
                    }
                    resultValues.push(item);
                }
            }
        } else if (result.ResultTypeCode == Const.ControlType.Text) {
            return $(`#option-${result.ResultId}`).val();
        }

        if (resultValues.length == 0) {
            layer.msg("请选择一项");
            scrollToElement(`#${result.ResultId}`);
            cancelCall();
            return;
        }
        return resultValues;
    }
    /**
     * 通知调用方关闭页面
     * @param {any} cancel
     */
    function ClosePage(cancel, promptData) {
        let content = {
            Cancel: cancel,
            PromptData: cancel ? null : promptData
        }
        SendMessage("CloseLayer", "S0026", content);
        if (window.aioExtend) {
            SendMessageAIO("CloseLayer", "S0026", content);
        }
    }
}
)(window, $);
