
/**
 * 
 * 集采药品替换的相关测试js
 * 
 * 
 */
(function () {
    var _token = "";
    var _druglist = [];
    var _outdata = null;
    $(function () {
        $('body').on('click', "#btn_cpdmrep", function (e) {
            CpdmRepDrug()
        });

        $('body').on('click', ".sys_tag", function (e) {
            CpdmDrugLoad()
        });

    });

    function CpdmDrugLoad() {
        const data = JSON.parse(_mvcData.data);
        _druglist = data.Data.DrugInfos;
        if ($("#drug_info").length == 0) {
            $("#btn_cpdmrep").after(`<div class="row" id="drug_info">111</div>`);
        }
        let html = "";
        _druglist.forEach(function (item) {
            html += `<div class="drug_row" data-drugid=${ item.DrugId } data-adviceid=${ item.AdviceId }>
            <span>${ item.DrugName }</span>
            <span>${ item.Specification }</span>
            <span>${ item.Unit}</span><span style="padding-left:20px;">请输入要替换的药品ID</span>
            <input type="text" class="rep_id" value="${ item.DrugId }" autocomplete="off" /><div>`
        });
        $("#drug_info").html(html);
    }

    /**
     * 药品替换
     */
    function CpdmRepDrug() {
        const data = JSON.parse(_mvcData.data);
        const lstdrug = data.Data.DrugInfos;
        let dataMsg = {
            "system": "ZLCPDM",
            "content": [
                {
                    "command": "替换医嘱",
                    "adviceId": 1,
                    "oldDrugName": "注射用头孢曲松钠",
                    "oldBaseCode": 86904141000946,
                    "oldDrugId": 221,
                    "replaceDrugName": "注射用头孢唑林钠",
                    "replaceBaseCode": 86902690000745,
                    "replaceDrugId": 214
                }
            ]
        }
        let objTemp = {
            "command": "替换医嘱",
            "adviceId": 1,
            "oldDrugName": "注射用头孢曲松钠",
            "oldBaseCode": 86904141000946,
            "oldDrugId": 221,
            "replaceDrugName": "注射用头孢唑林钠",
            "replaceBaseCode": 86902690000745,
            "replaceDrugId": 214
        }
        let haveData = 0;
        let content = [];
        let objLst = $(".drug_row");
        for (let j = 0; j < objLst.length; j++) {
            var curData = objLst.eq(j);
            let adviceId = curData.attr("data-adviceid");
            let oldDrugId = curData.attr("data-drugid");
            let replaceDrugId = curData.find('.rep_id').val();
            if (zlval(replaceDrugId) > 0) {
                let jtemp = JSON.parse(JSON.stringify(objTemp))
                jtemp.adviceId = adviceId;
                jtemp.oldDrugId = oldDrugId;
                jtemp.replaceDrugId = replaceDrugId;
                content.push(jtemp);
                haveData = 1;
            }
        }
        if (0 == haveData) {
            layer.alert("请输入要替换的药品id")
            return;
        }
        dataMsg.content = content;
        _outdata = dataMsg;

        try {
            //AIO方式
            AioSendDataToVb(dataMsg);
        } catch (e) { }


        try {
            //CEFAPI方式
            CEFAPI.trigger(JSON.stringify(dataMsg), "");
        } catch (e) { }

        try {
            //MiniblinkAPI
            window.location.href = 'zlsoft:ok_cpdm';
        } catch (e) { }
    }

    /**
     * 用于获取返回数据
     */
    window.GetCpdmDataZLHISCall = function () {
        return JSON.stringify(_outdata);
    }

})(window, $);
