/**
 * 医保管控相关 js
 */
(function () {
    $(function () {
        $("body").on("click", "#btn_submit", function () {
            sendMsgToZLHIS("submit");
        });

        $("body").on("click", "#btn_close", function () {
            sendMsgToZLHIS("close");
        });
    });

    const sendMsgToZLHIS = (type) => {
        var obj = {};
        sendToAio(type, obj);
        sendToCEF(type, obj);
    };

    const sendToAio = (type, obj) => {
        let command = {
            MsgType: "aio",
            Action: "postmessage",
            Pars: {
                type: type,
                content: obj
            }
        };

        try {
            window?.aioExtend(command);
        } catch (err) {
            return;
        }
    };

    const sendToCEF = (type, obj) => {
        var dataObj = {
            content: obj,
            type: type,
            Opportunity: type == "submit" ? "ZLhisCallSave_ByCef" : "ZLhisCallClose_ByCef"
        };

        try {
            if (typeof CEFAPI != "undefined") {
                CEFAPI?.trigger(JSON.stringify(dataObj), "");
            }
        } catch (err) {
            return;
        }
    };
})(window, $);
