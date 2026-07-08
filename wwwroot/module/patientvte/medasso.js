
/**
 * 
 * 医共体弹出网页js
 * 
 * 
 */
(function () {
    var _token = "";
    var _druglist = [];
    var _outdata = null;
    $(function () {
        $('body').on('click', "#btn_submit", function (e) {
            SendMsgToZLHIS("submit");
        }); 

        $('body').on('click', "#btn_close", function (e) {
            SendMsgToZLHIS("close");
        });       
    });

    const SendMsgToZLHIS = (type) => {
        var obj = {}
        MA_AioSendDataToVb(type, obj);
        SendToCEF(type, obj);
    };

    const MA_AioSendDataToVb = (type, obj) => {
        let command = {
            MsgType: "aio",
            Action: "postmessage",
            Pars: {
                    type: type,
                    content: obj
                }
            }
            try {
                window?.aioExtend(command);
            } catch (err) {
                return;
            }
        };  

    const SendToCEF = (type, obj) => {
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
