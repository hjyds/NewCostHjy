/*****
 * http://localhost:5888/module/LsFollow/index.html        本地接口网页
 * https://cq.cfkfz.com:28008/#/user/login?redirect=%2F    尘肺网站主页  帐号密码  longzhuyi  789lzY123@
 * 
 * 
 * 
 */

(function () {

    var systemName = "尘肺康复网站";

    $(function () {

        _token = localStorage.lsfollow_token;
        $("#token_input").val(localStorage.lsfollow_token);

        //将认证串缓存正来，便于后续使用
        $("body").on("click", "#token_input_btn", function () {
            _token = $("#token_input").val();
            localStorage.lsfollow_token = _token;
            let data = zlGetLS(`https://cqapi.cfkfz.com:28009/admin/prescription/getTableHeadCount`)          
            if (data.errno === 0) {
                layer.alert(`成功！`, {
                    icon: 0,
                    title: systemName
                });
                return
            }
            layer.alert(`失败！`, {
                icon: 0,
                title: systemName
            });
        });

        //电话随访记录添加按钮事件
        $("body").on("click", "#addfollowbillbytelephone", function () {

            layer.confirm("请确认<h3>认证</h3><h3>月份</h3><h3>随访时间</h3><h3>随访医生</h3>，确实要继续吗？", {
                icon: 3, title: systemName
            }, function (index, layero) {
                layer.close(index);     
                LayerFrmForPhone();
            });
        });
         
 
        $("body").on("click", "#fun_test_btn", function () {
            let dataVal = { name: "123" }

            //debugger
            //var result = zlPost(`/api/BaseApi/HjyLsFollow`, JSON.stringify(dataVal), '');

            TestCommFun();

        });

        $("body").on("click", "#GetFollowList", function () {
            let data = zlGet(`/api/BaseApi/GetErrUpFollowList`)
            if (data.Data[0]) {

            }
        });

        $("body").on("click", "#get_wformsList", function () {

            //https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=10&startTime=2024-05-31+00:00:00&endTime=2024-08-01+23:59:59
            let txtVal = $("#com_par_in").val(); 
            debugger
            let data = zlGetLS(txtVal);
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
            var result = zlPost(`/api/BaseApi/InsertFollowListByInPar`, data, ''); 

        });

        //

        $("#addfollowbill_in").val("{}");
        $("body").on("click", "#get_formsList", function () {
         
        
            let url = `https://cqapi.cfkfz.com:28009/admin/user/formsList?page=10&limit=200&siteId=201&survive=0`;


            let data = zlGetLS(url);
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
            var result = zlPost(`/api/BaseApi/InsertPatiLsByInPar`, data, ''); 
          


            $("#com_par_out").val(data);
        
        });

        $("body").on("click", "#delfollowbill", function () {

            let txtVal = $("#com_par_in").val(); 
            let data = zlPostLS('https://cqapi.cfkfz.com:28009/admin/follow/delete?id=' + txtVal, txtVal);
            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
            $("#com_par_out").val(data);
        });

        $("body").on("click", "#pic_type", function () {
            let strCpt = "上传家庭医生签约文件";
            let type = $("#pic_type").attr("data-type");

            if (type == "1") {
                type = "0";
            } else {
                type = "1";
                strCpt = "面对面随访";
            }
            $("#pic_type").attr("data-type", type);
            $("#pic_type").html(strCpt)
        });


        $("body").on("click", "#addfollowbill", function () {

            let txtVal = $("#addfollowbill_in").val();
            let oneData = JSON.parse(txtVal);
            let data = zlPostLS(`https://cqapi.cfkfz.com:28009/admin/follow/add`, JSON.stringify(oneData));

            if (typeof data === 'object') {
                data = JSON.stringify(data);
            }
            $("#addfollowbill_out").val(data);
        });

        $("#brandPic").on("change", function () {
            if (this.files.length <= 0) {
                return false;
            }

            let type = $("#pic_type").attr("data-type");

            if (type == "1") {
                 
            } else {

                for (let i = 0; i < this.files.length; i++) {
                    var pic1 = this.files[i];
                    var formData = new FormData();
                    formData.append("file", pic1);
                    postDataPic(formData);
                }                               
            }
        });

        InitTab();
    });

    function LayerFrmForPhone() {
        let html = `<div id="divLayerFrmForPhone">电话随访记录添加面板</div>`;
        let dataList = [];
        layer.open({
            type: 1,
            title: '电话随访记录添加',
            area: ['600px', '400px'],
            btn: ["确定", "取消"],
            content: html,
            success: function (layero, index) {
                debugger
                //AddPhoneBillOnePatiByUserCode('510229196512276651')
                dataList = GetPatiIdInfoList(1); //获取病人id和身份证号的列表（如果是查询方式取出来年龄和性别没有）
                
            },
            yes: function (index, layero) {
                debugger
                layer.close(index)
                //这点可以读取 dataList 变量的值
                
                return;
                layer.close(index)
                let lstAdr = GetPatiNoAdrList();
                for (var i = 0; i < lstAdr.length; i++) {
                    AddPhoneBillOnePatiByUserCode(lstAdr[i].no);
                }
            }
        });
    }

    /**
     * 获取家庭医生签约照相关服务
     * @returns
     */
    function GetPicUrlList() {
        var data = null;
        var lstData = [];
        var parList = [];
        var strOne = "";
        var insData = [];
        for (var i = 1; i < 11; i++) {
            let url = `https://cqapi.cfkfz.com:28009/admin/familyDoctor/list?page=${i}&limit=40&siteId=201`;
            data = zlGetLS(url)

            if (data?.data?.list?.length>0) {
                lstData = data.data.list;
                

                lstData.forEach(function (item) {
                    strOne = item.storageList;
                    let arrItem = JSON.parse(strOne);
                    strOne = arrItem[0];
                    parList.push(JSON.parse(strOne));
                    let objOne = JSON.parse(strOne);
                    item.pic_name = objOne.name;
                    item.pic_uid = objOne.uid;
                    item.pic_url = objOne.url;
                    insData.push(item)
                }); 
            }
        }
        debugger
        //将数据插入到后台
        var ret = zlPost(`/ZlVteInterface/InsertDocContractSign`, JSON.stringify(insData)); 
        
        //var ret = zlPost(`/ZlVteInterface/DLUrlBatMainOut`, JSON.stringify(parList));     
        return
        let formData = {
            "name": "55_金治万_06_10.jpg",
            "uid": "vc-upload-1735916817434-53",
            "url": "https://prsstorage-1258926361.cos.ap-chongqing.myqcloud.com/bg45x8jjw9dx1qfc4fs8.jpg"
        }
        //下载图片
        var ret = zlPost(`/ZlVteInterface/DLUrlBatMainOut`, JSON.stringify([formData]));      
    }

    function TestCommFun() {
        debugger
        //GetPicUrlList()
        //ExeUpdFollowList()
        //let url = `https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=9999&userInfo=&doctorName=%E9%BE%99%E6%B3%A8%E4%BC%8A&startTime=2023-01-01+00:00:00&endTime=2023-12-31+23:59:59&followType=`;
         let url = `https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=9999&userInfo=&doctorName=&startTime=2023-01-01+00:00:00&endTime=2023-12-31+23:59:59&followType=`;
         //let data = zlGetLS(url)
      //  var result = zlPost(`/api/BaseApi/HjyLsFollow`, JSON.stringify(data), '');
        DocFunText();
        //var result = zlPost(`/api/BaseApi/InSertFollowPati`, JSON.stringify(patList), '');
        var objData = {}
        //postDataPic(objData);
        //let lstFollow = GetUpdFollowListPar();
        //let url = `https://cqapi.cfkfz.com:28009/admin/follow/update`;
        //lstFollow.forEach(function (item) {            
        //    zlPostLS(url, JSON.stringify(item));
        //});
        //alert('成功执行完成。。。。。。');
    }


    /**初始化api列表 */
    function InitTab() {
        $("#tab_api_list").bootstrapTable({
            columns: [
                {
                    field: '序号', title: '序号'
                },
                {
                    field: '名称', title: '名称'
                },
                {
                    field: '说明', title: '说明'
                },
                {
                    field: '检查项', title: '检查项'
                },
                {
                    field: '结果类型', title: '结果类型',
                    formatter: function (value, row, index) {
                        if (value == "1") {
                            return "禁止";
                        } else {
                            return "提醒";
                        }
                    }
                },
                {
                    field: '系统内置', title: '系统内置',
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "是";
                        } else {
                            return "否";
                        }
                    }
                },
                {
                    field: '是否启用', title: '是否启用',
                    formatter: function (value, row, index) {
                        if (value == 1) {
                            return "在用";
                        } else {
                            return "停用";
                        }
                    }
                }
            ],
            data: [],
            height: "100%",
            showColumns: false,
            showColumnsSearch: true,
            clickToSelect: true,
            showRefresh: false,
            //search: true,
            sortable: true,
            undefinedText: " ",//定义默认undefined 文本，默认:'-'
            sortName: 'collectiontime',
            paginationDetailHAlign: ' hidden',//去掉分页信息,这里注意hidden前面有个空格，样式加上.hidden{display:none;}
            //默认排序倒叙
            sortOrder: 'asc', //desc  asc
            multipleSelectRow: false,
            visibleSearch: false,
            //classes: "table table-bordered table-striped table-sm", // 设置table-sm样式
            theadClasses: "thead-color",//这里设置表头样式
            onPostBody: function () {
                //BindTabChkConfigBar();
            },
            //rowStyle: BzSceneConfigRowSet,
            onClickRow: function (row, $element, index) {
                //$("#TabChkConfig .table-active").removeClass("table-active");//去除之前选中的行
                //$($element).addClass("table-active");//标记当前选中行
                //_curBzSceneConfigRow = row;
                //TxtExpInfo(row);
            }
        })

    }

})(window, $);