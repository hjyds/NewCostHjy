(function () {
    var _token = "";
    $(function () {
        $("#inputarea").html(`<span id="RefleshIF">点我刷新加载IFrame</span><span id="new_advice">医嘱编辑</span>`);
        $('body').on('click', "#RefleshIF", function (e) {
            
            Reflesh()
        });

        $('body').on('click', "#new_advice", function (e) {
            NewAdvice()
        });

        $('header').hide();//把头部隐藏掉
        $("#svr_info").val('http://192.168.56.1:5000')
        $("#type").val(2);
        $("#user").val('ZLHIS')
        $("#pid").val(101)
        $("#pvid").val(1)
        $("#prid").val(1)
        $("#token").val(localStorage.tech_token);
        $('footer').html(`<h6 class="url_txt" id="str_url1"></h6><h6 class="url_txt" id="str_url"></h6>
    
                    `);
    });

    //医嘱清单界面
    function Reflesh() {
        _token = zlnvl($("#token").val());
        localStorage.tech_token = _token;
        let dataPar = {
            type: 1,
            user: zlnvl($("#user").val()),                      
            sitesn: zlnvl($("#sitesn").val()),
            pid: zlnvl($("#pid").val()),
            pvid: zlnvl($("#pvid").val()),
            prid: zlnvl($("#prid").val()),
            zlinds_alone_page: 1,
            token: zlnvl($("#token").val())
        };


        let curFrame = $('.eleAdviceThirdPage').find('iframe');
        if (curFrame.attr("src")) {
            curFrame[0].contentWindow.postMessage({
                "type": "Refresh",
                "func": "DockAdviceRefresh",
                "data": dataPar
            }, "*");
            return;
        }

        let url = "https://www.json.cn";
        url = zlnvl($("#svr_info").val()) + "/InHospital/station/index.html?data=" + JSON.stringify(dataPar);
        $("#str_url1").html(url);
        url = encodeURI(url)
        console.log(url);
        let $curFrame = $('.eleAdviceThirdPage').find('iframe');
        $curFrame.attr("src", url); 
        $("#str_url").html(url);
    }

    //医嘱编辑界面
    function NewAdvice() {
        let dataPar = {
            type: $("#type").val(),
            user: zlnvl($("#user").val()),
            sitesn: zlnvl($("#sitesn").val()),
            pid: zlnvl($("#pid").val()),
            pvid: zlnvl($("#pvid").val()),
            prid: zlnvl($("#prid").val()),
            token: zlnvl($("#token").val())
        };
        let url = "https://www.json.cn";
        url = zlnvl($("#svr_info").val()) + "/Login?data=" + JSON.stringify(dataPar);
        $("#str_url1").html(url);
        url = encodeURI(url)       
        $("#reflesh").show();
        $("#str_url").html(url);
        console.log(url);
        let page = window.open(url, "123123", 'width=' + (window.screen.availWidth) + ',height=' + (window.screen.availHeight) + ',top=0,left=0,toolbar=no,titlebar=no,menubar=0,scrollbars=yes, resizable=yes,location=0,status=0,depended =yes,maximize=true');
        setTimeout(function () {
            page.document.title = "医嘱编辑-测试弹出窗口胡俊勇";//修改标题
        }, 900);
    }   

})(window, $);
