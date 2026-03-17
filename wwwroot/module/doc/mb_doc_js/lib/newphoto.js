define([
    "jquery",
    "utils",
    "layer",
    "dateTime",
    "hammer",
    "jqueryhammer"
], function (
    jquery,
    utils,
    layer,
    dateTime,
    hammer,
    jqueryhammer
) {
        layer.config({
            path: './js/plugins/layer/'
        });

        var currentPatient;
        var serviceChoose;
        var ksName, first, sceond, third;
        var imgURL = serviceChoose;
        // 获取照片列表所需的参数
        var getPicObj = {
            type: '',							//相册编码，全院传1，科室传2、个人传3
            albumName: '',						//分组(相册)名称
            KSID: '',							//如果是获取“科室”的相册信息，则传当前分组对应的科室ID
            //如果是获取“个人”的相册信息，则传当前操作员选择的科室ID
            userID: '',     					//当前操作员ID,
            myKS: ''
        }
        // 返回的数据格式化为数组
        var toArray = function (obj) {
            if (!Array.isArray(obj)) {
                var arr = [];
                arr.push(obj);
                return arr;
            } else {
                return obj;
            }
        }
        // 判断当前相册类别
        var albumType = function () {
            var list = $('.photo-nav');
            for (var i = 0; i < list.length; i++) {
                if ($(list[i]).hasClass('active')) return i;
            }
        }

        // 左侧相册列表渲染函数
        var leftNav = function (type, arr) {
            $('#AlbumList').empty();
            switch (type) {
                // 渲染科室列表
                case 0:
                    for (var i = 0; i < arr.length; i++) {
                        var str = '<li class="album-left-nav">' + arr[i].MC + '<p class="hide"><span class="edit">编辑</span><span class="dranger">删除</span></p></li>';
                        var li = $(str);
                        $(li).data('data', arr[i]);
                        $(li).attr('grade', '0');
                        $('#AlbumList').append(li);
                    }
                    break;
                // 渲染一级菜单
                case 1:
                    var secondMenu = [];
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].split(',')[2]) {
                            secondMenu.push(arr[i]);
                            continue;
                        }
                        var str = '<li class="album-left-nav">' + arr[i].split(',')[1] + '<p class="hide"><span class="edit">编辑</span><span class="dranger">删除</span></p></li>';
                        var li = $(str);
                        $(li).data('data', arr[i]);
                        $(li).attr('grade', '1');
                        $('#AlbumList').append(li);
                    }
                    localStorage.secondMenu = JSON.stringify(secondMenu);
                    break;
                // 渲染二级菜单
                case 2:
                    for (var i = 0; i < arr.length; i++) {
                        var str = '<li class="album-left-nav">' + arr[i].split(',')[1] + '<p class="hide"><span class="edit">编辑</span><span class="dranger">删除</span></p></li>';
                        var li = $(str);
                        $(li).data('data', arr[i]);
                        $(li).attr('grade', '2');
                        $('#AlbumList').append(li);
                    }
                    break;
                // 三级菜单
                case 3:
                    for (var i = 0; i < arr.length; i++) {
                        var str = '<li class="album-left-nav">' + arr[i].split(',')[1] + '<p class="hide"><span class="edit">编辑</span><span class="dranger">删除</span></p></li>';
                        var li = $(str);
                        $(li).data('data', arr[i]);
                        $(li).attr('grade', '3');
                        $('#AlbumList').append(li);
                    }
                    break;
            }
            clickLeftNav();
        }

        // $('.addPhoto').on('click', function(){
        // 	document.querySelector('.takePhoto').click();
        // });


        // 开始函数
        var photo = function () {
            currentPatient = JSON.parse(localStorage.currentPatient);
            serviceChoose = utils.urlFunction();
            imgURL = serviceChoose;//加载图片接口地址
            getPicObj.userID = JSON.parse(localStorage.userInfo).Result.UID
            // 获取当前人员的科室
            var str = JSON.parse(localStorage.userInfo).Result.KS;
            var ksArr = str.split(',');
            for (var i = 0; i < ksArr.length; i++) {
                if (ksArr[i].split(';')[2] == 1) {
                    getPicObj.myKS = ksArr[i].split(';')[0];
                    break;
                }
            }
            $('#photo').removeClass('slideOutLeft').addClass('bounceInLeft');
            //$('#photo').removeClass('slideOutLeft').show();
            // 默认获取患者相册列表
            $("#LoadedTip").show();
            $($('.photo-nav')[0]).trigger('click');
            $(".search-box > input").val("");
            timeFormt();

        }
        function timeFormt() {
            //初始化搜索时间
            var today = utils.todayNow();
            var endtime = today.replace(/\-/g, "/");
            $(".photo-data").eq(1).text(endtime);
            var nowdate = new Date();
            nowdate.setMonth(nowdate.getMonth() - 1);
            var y = nowdate.getFullYear();
            var m = nowdate.getMonth() + 1;
            var d = nowdate.getDate();
            var starttime = y + '/' + m + '/' + d + " " + today.split(" ")[1];
            $(".photo-data").eq(0).text(starttime);
        }
        var start = "";
        $(".photo-data").each(function (index, el) {
            $(el).on('click', function (event) {
                $("#phototimeControl").show();
                $("#Parentphoto").show();
                start = index;
                if (start === 1) {
                    $("#phototimeControl").css('left', '160px');
                } else {
                    $("#phototimeControl").css('left', '0px');
                }
                var starttext = $(".photo-data").eq(index).text();
                starttext = starttext.replace(/\//g, "-");
                dateTime.dateTimeScroll(starttext, "phototimeControl", phototimeChange);
            });
        });
        function phototimeChange() {
            $("#Parentphoto").hide();
            var changtime = $("#phototimeControl .dataTimeBox p").text();
            changtime = changtime.replace(/\-/g, "/");
            $(".photo-data").eq(start).text(changtime);
        };

        $('.photo-nav').each(function (index, item) {
            $(item).on('click', function () {
                $(".result-box").hide();
                //$('.fast-search').hide();
                $('.normal-search').show();
                $(".search-box > input").val("");
                getPicObj.type = index;
                getPicObj.albumName = null;
                localStorage.getPicObj = JSON.stringify(getPicObj);
                $(item).addClass('active').siblings('.photo-nav').removeClass('active');
                $('.imgList').hide();
                if (index != 2) {
                    $('#addAlbum').show();
                } else {
                    $('#addAlbum').hide();
                }
                getAlbumList(index + 1, function () {
                    // other things
                });
            });
        });

        // 获取相册列表【1为病人、2为全院、3为科室、4为个人】
        function getAlbumList(type, callback) {
            $('#AlbumList').removeClass('active');
            $('#nav-title').hide();
            switch (type) {
                case 1:
                    var postObj = {
                        "IN": {
                            "PATIID": currentPatient.PATIID,
                            "PAGEID": currentPatient.PAGEID,
                            "BABY": currentPatient.BABY
                        }

                    }
                    ajaxGetAlbumList("/PMS_PHOTO_GetPatientGroup", postObj, function (res) {
                        $("#LoadedTip").hide();
                        if (res.Result.ERROR) {
                            //layer.alert(res.Result.ERROR);
                            layererror(res.Result.ERROR);
                        } else {
                            if (res.Result.OUTPUT && !$.isEmptyObject(res.Result.OUTPUT)) {
                                var arr = toArray(res.Result.OUTPUT.FZ.R);
                            } else {
                                var arr = [];
                            }
                            // 保存一级菜单
                            localStorage.firstMenu = JSON.stringify(arr);
                            leftNav(1, arr);
                        }
                        if (callback) callback();
                    });
                    break;
                case 2:
                    $("#LoadedTip").show();
                    ajaxGetAlbumList("/PMS_PHOTO_GetGolbalGroup", {}, function (res) {
                        $("#LoadedTip").hide();
                        if (res.Result.ERROR) {
                            //layer.alert(res.Result.ERROR);
                            layererror(res.Result.ERROR);
                        } else {
                            if (res.Result.OUTPUT.YS.FZ && res.Result.OUTPUT.YS.FZ.R.length) {
                                var arr = toArray(res.Result.OUTPUT.YS.FZ.R);
                            } else {
                                var arr = [];
                            }
                            // 保存一级菜单
                            localStorage.firstMenu = JSON.stringify(arr);
                            leftNav(1, arr);
                        }
                        if (callback) callback();
                    });
                    break;
                case 3:
                    $("#LoadedTip").show();
                    ajaxGetAlbumList("/PMS_PHOTO_GetDeptGroup", {}, function (res, callback) {
                        $("#LoadedTip").hide();
                        if (res.Result.ERROR) {
                            //layer.alert(res.Result.ERROR);
                            layererror(res.Result.ERROR);
                        } else {
                            if (res.Result.OUTPUT.KS.length) {
                                var arr = res.Result.OUTPUT.KS;
                            } else {
                                var arr = [];
                            }
                            // 保存科室列表
                            localStorage.ksList = JSON.stringify(arr);
                            leftNav(0, arr);
                        }
                        if (callback) callback();
                    });
                    break;
                case 4:
                    $("#LoadedTip").show();
                    ajaxGetAlbumList("/PMS_PHOTO_GetPrivateGroup", {}, function (res) {
                        $("#LoadedTip").hide();
                        if (res.Result.ERROR) {
                            //layer.alert(res.Result.ERROR);
                            layererror(res.Result.ERROR);
                        } else {
                            if (res.Result.OUTPUT.YS.FZ && res.Result.OUTPUT.YS.FZ.R.length) {
                                var arr = toArray(res.Result.OUTPUT.YS.FZ.R);
                            } else {
                                var arr = [];
                            }
                            // 保存一级菜单
                            localStorage.firstMenu = JSON.stringify(arr);
                            leftNav(1, arr);
                        }
                        if (callback) callback();
                    });
                    break;
            }
        }

        // 获取相册列表的ajax
        function ajaxGetAlbumList(fun, postObj, callback) {
            $.ajax({
                url: serviceChoose + fun,
                type: 'POST',
                data: JSON.stringify(postObj),
                dataType: 'JSON',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.userInfo).access_token
                },
                success: function (res) {
                    callback(res);
                }
            });
        }
        /*
        点击左侧导航时
        */
        function clickLeftNav() {
            $('.album-left-nav').on('click', function () {
                var data = $(this).data('data');
                var _self = $(this);
                // 先判断是否为科室
                // attr('grade')表示当前列表可返回的等级[0为科室，1为一级菜单，2为二级菜单]
                if (_self.attr('grade') == '0') {
                    ksName = _self.text().replace('编辑删除', '');
                    $('#nav-title span').text(ksName);
                    $('#nav-title').attr('grade', 0);
                    $('#nav-title').show();
                    $('#AlbumList').addClass('active');
                    if (data.ITEM.YS.FZ) {
                        var arr = toArray(data.ITEM.YS.FZ.R);
                    } else {
                        var arr = [];
                    }
                    localStorage.firstMenu = JSON.stringify(arr);
                    leftNav(1, arr);
                    // 缓存getPicObj
                    getPicObj.KSID = data.ID;
                    localStorage.getPicObj = JSON.stringify(getPicObj);
                    $('#addAlbum').show();
                    return;
                }
                // 如果为一级菜单
                else if (_self.attr('grade') == '1') {
                    first = _self.text().replace('编辑删除', '');
                    $('#nav-title span').text(first);
                    $('#nav-title').attr('grade', '1');
                    $('#nav-title').show();
                    $('#AlbumList').addClass('active');
                    // 还需判断是否在科室下
                    if (getPicObj.type != 2) {
                        getPicObj.KSID = '';
                    }
                    getPicObj.albumName = first;
                    // 读取该菜单的子菜单【并判断是否为患者条件下】
                    var thisChildren = [];
                    if (!getPicObj.type) {
                        $('#addAlbum').hide();
                    } else {
                        var currentAlbumID = data.split(',')[0];
                        if (localStorage.secondMenu) {
                            var children = JSON.parse(localStorage.secondMenu);
                        } else {
                            var children = [];
                        }
                        children.forEach(function (item) {
                            if (item.split(',')[2] == currentAlbumID) {
                                thisChildren.push(item);
                            }
                        });
                    }
                    localStorage.secondMenuNow = JSON.stringify(thisChildren);
                    leftNav(2, thisChildren);
                }
                // 如果为二级菜单
                else if (_self.attr('grade') == '2') {
                    second = _self.text().replace('编辑删除', '');
                    $('#nav-title span').text(second);
                    $('#nav-title').attr('grade', '2');
                    $('#nav-title').show();
                    $('#AlbumList').addClass('active');
                    // 还需判断是否在科室下
                    if (getPicObj.type != 2) {
                        getPicObj.KSID = '';
                    }
                    getPicObj.albumName = second;
                    // 读取该菜单的子菜单【并判断是否为患者条件下】
                    var thisChildren = [];
                    var currentAlbumID = data.split(',')[0];
                    if (localStorage.secondMenu) {
                        var children = JSON.parse(localStorage.secondMenu);
                    } else {
                        var children = [];
                    }
                    children.forEach(function (item) {
                        if (item.split(',')[2] == currentAlbumID) {
                            thisChildren.push(item);
                        }
                    });
                    localStorage.thirdMenu = JSON.stringify(thisChildren);
                    leftNav(3, thisChildren);
                }
                // 如果为三级菜单
                else if (_self.attr('grade') == '3') {
                    third = _self.text().replace('编辑删除', '');
                    $('#nav-title span').text(third);
                    $('#nav-title').attr('grade', '3');
                    $('#nav-title').show();
                    $('#AlbumList').addClass('active');
                    if (getPicObj.type != 2) {
                        getPicObj.KSID = '';
                    }
                    getPicObj.albumName = third;
                    $('#addAlbum').hide();
                    $('#AlbumList').empty();
                    // _self.addClass('active').siblings('li').removeClass('active');
                }
                // 右侧显示当前目录可能存在的照片
                localStorage.getPicObj = JSON.stringify(getPicObj);
                ajaxGetPicList();
            });
        }
        // 获取图片列表【患者和后面三个有所区别】,患者为true
        function ajaxGetPicList(callback) {
            var url = serviceChoose;
            if ($($('.photo-nav')[0]).hasClass('active')) {
                var type = true;
            } else {
                var type = false;
            }
            if (type) {
                url += "/PMG_PHOTO_GetListByPATI";
                var postObj = JSON.stringify({
                    "IN": {
                        "FZ": getPicObj.albumName,                         //分组名称
                        "PATIID": currentPatient.PATIID,                //患者分组需要传病人id
                        "PAGEID": currentPatient.PAGEID,                //患者分组需要传主页id
                        "BABY": currentPatient.BABY,                    //患者分组需要传婴儿标识
                        "KJM": null,                                   //快捷码，目前传null
                        "CS": "S:600/400"                              //格式？需讨论
                    }
                });
            }
            else {
                url += "/PMG_PHOTO_GetListByGROUP";
                var postObj = JSON.stringify({
                    "IN": {
                        "XC": getPicObj.type,                        	//相册编码，全院传1，科室传2、个人传3
                        "FZ": getPicObj.albumName,                   	//分组名称
                        "KSID": getPicObj.KSID,                      	//如果是获取“科室”的相册信息，则传当前分组对应的科室ID
                        //如果是获取“个人”的相册信息，则传当前操作员选择的科室ID
                        "YSID": getPicObj.userID,                		//当前操作员ID
                        "KJM": null,                            //快捷码，目前传null
                        "CS": "S:600/400"
                    }
                });
            }
            $.ajax({
                url: url,
                type: "post",
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.userInfo).access_token
                },
                data: postObj,
                success: function (res) {
                    if (res.Result.ERROR) {
                        //layer.alert(res.Result.ERROR);
                        layererror(res.Result.ERROR.MSG);
                    } else {
                        $('#imgList').empty();
                        if (res.Result.OUTPUT.LIST) {
                            var picList = toArray(res.Result.OUTPUT.LIST.ITEM);
                            for (var i = 0; i < picList.length; i++) {
                                if (picList[i].SLTLJ == null) {
                                    createSLU(picList[i].ID, i);
                                }
                                var str = '<div class="col-xs-4 img-box"><img src="' + picList[i].SLTLJ + '" alt=""><p>' + picList[i].SCR + '<small>' + picList[i].SJ + '</small></p></div>';
                                var img = $(str);
                                img.data(picList[i]);
                                $('#imgList').append(img);
                            }
                        }
                        $('.imgList').show();
                        clickImgBox();
                        if (callback) callback(res);
                    }
                }
            });
            // 生成缩略图
            var createSLU = function (id, i) {
                $.ajax({
                    url: serviceChoose + "/PMS_PHOTO_GetThumbnail",
                    type: "post",
                    dataType: 'json',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        'IN': {
                            "ID": id,
                            "MS": "S",
                            "CS": null,
                            "CC": "600/400"
                        }
                    }),
                    success: function (res) {
                        if (res.Result.ERROR) {
                            layer.alert('缩略图获取失败');
                        } else {
                            $('.img-box').eq(i).find('img').attr('src', res.Result.OUTPUT.LIST.FILE.PATH);
                        }
                    }
                })
            }
        }
        takePhoto();
        // 上传照片
        function takePhoto() {
            //下面用于图片上传预览功能
            var img, status = true;
            document.querySelector('.takePhoto').addEventListener('change', function () {
                if (!status) return;
                status = false;
                lrz(this.files[0]).then(function (results) {
                    var Img = results.base64;
                    ImgPreview(results.base64, results.base64.length * 0.8);
                    img = {
                        base64: results.base64,
                        size: results.base64.length, // 校验用，防止未完整接收
                        describe: document.querySelector('.imgDescribe').value,
                        KJM: document.querySelector('.img-kjm').value,
                        FZ: getPicObj.albumName,
                        XC: getPicObj.type,
                        KSID: getPicObj.KSID ? getPicObj.KSID : ''
                    };
                    status = true;
                })
            }, false);
            // 图片预览
            function ImgPreview(src, size) {
                $('.addPhoto').hide();
                var oldImg = document.querySelector('#ImgPreview').querySelector('img');
                if (oldImg) {
                    oldImg.parentNode.removeChild(oldImg);
                }
                // var img = new Image();
                var img = $('<img />');
                size = (size / 1024).toFixed(2) + 'KB';
                // img.onload = function () {
                // 	$('.imgDescribe').before(img);
                //     // document.querySelector('#ImgPreview').appendChild(img);
                // };
                img[0].onload = function () {
                    $('.preview-operation').before(img);
                }
                img.attr('src', src);
                // img.src = src;
                document.querySelector('#ImgPreview').style.display = 'block';
            }
            // 取消图片上传
            document.querySelector('.cancelUploadImg').addEventListener('click', function () {
                cleanFile();
                var previewImg = document.querySelector('#ImgPreview').querySelector('img');
                previewImg.parentNode.removeChild(previewImg);
                document.querySelector('#ImgPreview').style.display = 'none';
                document.querySelector('.img-kjm').value = "";
                document.querySelector('.imgDescribe').value = "";
                $('.addPhoto').show();
            }, false);
            // 确定图片上传
            document.querySelector('.uploadImgButton').addEventListener('click', function () {
                img.describe = document.querySelector('.imgDescribe').value;
                img.KJM = document.querySelector('.img-kjm').value;
                /*var str = img.describe;
                if(str.length){
                    var doneArr = [];
                    var arr = str.split('，');
                    for (var i = 0; i < arr.length; i++) {
                        if(arr[i].length>4){
                            layer.alert('输入标签有误，<br /> 每个标签长度不超过4个字符，多个标签以<b style="color:red;">中文逗号<b>分隔(空格算一个字符)')
                            return;
                        }
                        if(!$.trim(arr[i]).length){
                            continue;
                        }
                        doneArr.push(arr[i]);
                    }
                    img.describe = doneArr.join('，');
                }*/
                var str = img.KJM;
                if (str.length) {
                    var doneArr = [];
                    var arr = str.split('，');
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i].length > 4) {
                            layer.alert('输入标签有误，<br /> 每个标签长度不超过4个字符，多个标签以<b style="color:red;">中文逗号<b>分隔(空格算一个字符)')
                            return;
                        }
                        if (!$.trim(arr[i]).length) {
                            continue;
                        }
                        doneArr.push(arr[i]);
                    }
                    img.KJM = doneArr.join('，');
                }



                uploadImg(img, function (res) {
                    // 成功了，重新读取当前列表
                    $('#ImgPreview').hide();
                    ajaxGetPicList();
                });
            }, false);
            // 清除file的内容
            function cleanFile() {
                // var file = document.querySelector('.takePhoto');
                $('.addPhoto')[0].reset();
            }
            // 图片上传
            function uploadImg(img, callback) {
                var t = new Date();
                var fileName = '' + t.getFullYear() + addTen((t.getMonth() + 1)) + addTen(t.getDate()) + addTen(t.getHours()) + addTen(t.getMinutes()) + addTen(t.getSeconds()) + localStorage.user;
                // 当取得的值小于10时，前面补0
                function addTen(val) {
                    if (val < 10) {
                        return '0' + val;
                    } else {
                        return '' + val;
                    }
                }
                if (!img.XC) {
                    var postObj = {
                        'fileName': fileName,
                        'fileType': '',
                        'fileSize': img.size,
                        'MD5': '',
                        'XL': 1,
                        'SM': encodeURI(img.describe),				//照片描述
                        'KJM': encodeURI(img.KJM),
                        'PATIID': currentPatient.PATIID,
                        'PAGEID': currentPatient.PAGEID,
                        'BABY': currentPatient.BABY,
                        'FZ': encodeURI(img.FZ),						//所属分组名称
                        'XC': img.XC,						//相册性质，0-患者相册; 1-全院相册；2-科室相册；3-个人相册
                        'KSID': '',					//科室ID，科室相册时传入
                        'imgBase64': img.base64    //图片base64编码
                    }
                } else {
                    var postObj = {
                        'fileName': fileName,
                        'fileType': '',
                        'fileSize': img.size,
                        'MD5': '',
                        'XL': 1,
                        'SM': encodeURI(img.describe),				//照片描述
                        'KJM': encodeURI(img.KJM),
                        'PATIID': '',
                        'PAGEID': '',
                        'BABY': '',
                        'FZ': encodeURI(img.FZ),						//所属分组名称
                        'XC': img.XC,						//相册性质，0-患者相册; 1-全院相册；2-科室相册；3-个人相册
                        'KSID': img.KSID,					//科室ID，科室相册时传入
                        'imgBase64': img.base64            //图片base64编码
                    }
                }
                $.ajax({
                    url: imgURL + '/PMS_PHOTO_UPLOAD',
                    type: 'POST',
                    dataType: 'json',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + JSON.parse(localStorage.userInfo).access_token
                    },
                    data: JSON.stringify(postObj),
                    beforeSend: function () {
                        $("#LoadedTip").show();
                    },
                    success: function (res) {
                        $("#LoadedTip").hide();
                        cleanFile();
                        if (res.Result.ERROR) {
                            //layer.alert(res.Result.ERROR);
                            layererror(res.Result.ERROR);
                        } else {
                            $('.addPhoto').show();
                            delete res.Result.OUTPUT.DELLIST;//删除不必要的节点，上传只需保存MD5节点
                            callback(res);
                        }
                        document.querySelector('.img-kjm').value = "";
                        document.querySelector('.imgDescribe').value = "";
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $("#LoadedTip").hide();
                        layer.alert(errorThrown.message);
                    }
                });
            }
        }

        // 相册名称检查
        var checkAblumNum = function (defaultName) {
            layer.prompt({
                formType: 0,
                value: defaultName || '',
                title: '请输入相册名'
            }, function (value) {
                // 先检查当前目录是否有重名
                var arr = [];
                $('.album-left-nav').each(function (index, item) {
                    arr.push($(item).text().replace('编辑删除', ''));
                });
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i] == value) {
                        layer.closeAll();
                        layer.confirm('相册已存在！', {
                            btn: ['打开相册', '重新输入']
                        }, function () {
                            // 打开相册
                            $('.album-left-nav').eq(i).trigger('click');
                            layer.closeAll();
                        }, function () {
                            checkAblumNum();
                        });
                        return;
                    }
                }
                layer.closeAll();
                // 提交添加的相册
                ajaxAddAblum(value, function (res) {
                    // 重新获取列表
                    var type = getPicObj.type + 1;
                    getAlbumList(type, function () {
                        // 暂时不管
                    });
                });
            });
        }


        // 点击添加相册
        document.querySelector('#addAlbum').addEventListener('click', function () {
            var defaultName = currentPatient.NAME + '-' + currentPatient.HospitalNum + '-' + currentPatient.HospitalCount;
            checkAblumNum(defaultName);
        }, false);

        // 添加相册【患者不能添加子相册】
        function ajaxAddAblum(value, callback) {
            // 这里需要判断一下是否需要科室ID
            if (!getPicObj.type) {
                var postObj = JSON.stringify({
                    "IN": {
                        "XC": getPicObj.type,                           	//相册编号：患者传0，全院传1，科室传2、个人传3
                        "ID": null,
                        "FZ": value,                                    	//分组名称
                        "PFZ": null, 										//父分组名称，如自身为父分组则传null
                        "KSID": null,										//科室ID，创建科室分组和个人分组时传入
                        "PATIID": currentPatient.PATIID,                	//病人id，创建患者分组时传入
                        "PAGEID": currentPatient.PAGEID,                	//主页id，创建患者分组时传入
                        "BABY": currentPatient.BABY,                    	//婴儿，创建患者分组时传入
                        "KJM": null,                                    	//快捷码，目前传null
                        "LX": "1"                                       	//需讨论，待定
                    }
                })

            }
            else if (getPicObj.type == 1) {
                var postObj = JSON.stringify({
                    "IN": {
                        "XC": getPicObj.type,                           	//相册编号：患者传0，全院传1，科室传2、个人传3
                        "ID": null,
                        "FZ": value,                                    	//分组名称
                        "PFZ": getPicObj.type != 0 ? getPicObj.albumName : null, //父分组名称，如自身为父分组则传null
                        "KSID": null,										//科室ID，创建科室分组和个人分组时传入
                        "PATIID": null,                						//病人id，创建患者分组时传入
                        "PAGEID": null,                						//主页id，创建患者分组时传入
                        "BABY": null,                    					//婴儿，创建患者分组时传入
                        "KJM": null,                                    	//快捷码，目前传null
                        "LX": "1"                                       	//需讨论，待定
                    }
                })

            }
            else {
                var postObj = JSON.stringify({
                    "IN": {
                        "XC": getPicObj.type,                           	//相册编号：患者传0，全院传1，科室传2、个人传3
                        "ID": null,
                        "FZ": value,                                    	//分组名称
                        "PFZ": getPicObj.type != 0 ? getPicObj.albumName : null, //父分组名称，如自身为父分组则传null
                        "KSID": getPicObj.KSID ? getPicObj.KSID : getPicObj.myKS,//科室ID，创建科室分组和个人分组时传入
                        "PATIID": null,                						//病人id，创建患者分组时传入
                        "PAGEID": null,                						//主页id，创建患者分组时传入
                        "BABY": null,                    					//婴儿，创建患者分组时传入
                        "KJM": null,                                    	//快捷码，目前传null
                        "LX": "1"                                       	//需讨论，待定
                    }
                })

            }
            $.ajax({
                url: serviceChoose + "/PMS_PHOTO_SetGROUP",
                type: 'POST',
                data: postObj,
                dataType: 'JSON',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + JSON.parse(localStorage.userInfo).access_token
                },
                beforeSend: function () {
                    $("#LoadedTip").show();
                },
                success: function (res) {
                    // var res = JSON.parse(res);
                    $("#LoadedTip").hide();
                    if (res.Result.ERROR) {
                        //layer.alert(res.Result.ERROR.MSG);
                        layererror(res.Result.ERROR)
                    } else {
                        callback(res);
                    }
                }
            })
        }
        // 模拟点击一级导航
        function triggerFirst(id) {
            var arr = $('.album-left-nav');
            for (var i = 0; i < arr.length; i++) {
                if ($(arr[i]).data('data').id == id) {
                    $(arr[i]).trigger('click');
                    return
                }
            }
        }
        // 点击缩略图查看大图
        var loadingImg = new Image();
        //loadingImg.src = imgURL + "/home/img/loading-black.gif";
        loadingImg.src = "img/loading-black.gif";
        function clickImgBox() {
            $('.img-box').on('click', function () {
                if (JSON.parse(localStorage.userInfo).Result.XM == $(this).data().SCR) {
                    $('.removeImg').show();
                } else {
                    $('.removeImg').hide();
                }
                // 缓存当前图片信息
                $('#bigImg').empty();
                $('#imgView').show();
                localStorage.dataImg = JSON.stringify($(this).data());
                $('#bigImg').append(loadingImg);
                var IMGURL = $(this).data().LJ;
                var img = new Image();
                img.src = IMGURL;
                img.onload = function () {
                    $('#bigImg img').remove();
                    $('#bigImg').append(img);
                }
            });
        }

        // 点击x关闭大图
        $('.closeImg').on('click', function () {
            $('#imgView').hide();
        });


        // 删除当前图片
        document.querySelector('.removeImg').addEventListener('click', function () {
            var imgInfo = JSON.parse(localStorage.dataImg);
			if(!imgInfo.SLTLJ){imgInfo.SLTLJ = '';}
            $.ajax({
                url: serviceChoose + '/PMS_PHOTO_DelPhoto',
                type: 'POST',
                //data: postObj,
                dataType: 'JSON',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    "IN": {
                        "MD5": imgInfo.ZP,
						"LJ":imgInfo.LJ,
						"SLTLJ":imgInfo.SLTLJ,
						"ID":imgInfo.ID
                    }
                }),
                beforeSend: function () {
                    $('#LoadedTip').show();
                },
                success: function (res) {
                    $('#LoadedTip').hide();
                    if (res.Result.ERROR) {
                        //layer.alert(res.Result.ERROR.MSG);
                        layererror(res.Result.ERROR);
                    } else {
                        layer.tips('删除成功');
                        // 重新加载当前图片列表
                        ajaxGetPicList();
                        if ($(".normal-search").is(':hidden')) {
                            var searchval = $(".search-box > input").val();
                            if (searchval) {
                                searchGetPicList(searchval);
                            } else {
                                layer.alert('请输入搜索内容');
                            }
                        }
                        $('#imgView').hide();
                    }
                }
            });
        });
        // 返回上级菜单
        $('.backFirst').on('click', function () {
            var grade = $('#nav-title').attr('grade');
            switch (grade) {
                case '0':
                    var arr = JSON.parse(localStorage.ksList);
                    leftNav(0, arr);
                    $('#AlbumList').removeClass('active');
                    $('#nav-title').hide();
                    $('.imgList').hide();
                    $('#addAlbum').hide();
                    break;
                case '1':
                    var arr = JSON.parse(localStorage.firstMenu);
                    leftNav(1, arr);
                    if (getPicObj.type == 2) {
                        $('#nav-title span').text(ksName);
                        $('#nav-title').attr('grade', 0);
                        $('.imgList').hide();
                        $('#addAlbum').show();
                    } else {
                        $('#AlbumList').removeClass('active');
                        $('#nav-title').hide();
                        $('.imgList').hide();
                        $('#addAlbum').show();
                    }
                    break;
                case '2':
                    var arr = JSON.parse(localStorage.secondMenuNow);
                    leftNav(2, arr);
                    $('#nav-title span').text(first);
                    $('#nav-title').attr('grade', 1);
                    $('#addAlbum').show();
                    getPicObj.albumName = first;
                    localStorage.getPicObj = JSON.stringify(getPicObj);
                    ajaxGetPicList();
                    break;
                case '3':
                    var arr = JSON.parse(localStorage.thirdMenu);
                    leftNav(3, arr);
                    $('#nav-title span').text(second);
                    $('#nav-title').attr('grade', 2);
                    $('#addAlbum').show();
                    getPicObj.albumName = second;
                    localStorage.getPicObj = JSON.stringify(getPicObj);
                    ajaxGetPicList();
                    break;
            }
        });

        // 6.29 添加快速查找
        $('.fast-search-btn').on('click', function () {
            $('.normal-search').hide();
            //$('.fast-search').show();
            $(".search-box >input").val("");
            $('.result-box').empty();
        });

        $('.searchImg').on('click', function () {
            var searchval = $(".search-box > input").val();
            if (searchval) {
                searchGetPicList(searchval);
            } else {
                layer.alert('请输入搜索内容');
            }

        });
        // 获取图片列表【患者和后面三个有所区别】,患者为true
        function searchGetPicList(kjm) {
            var kssj = $(".photo-data").eq(0).text();
            var jssj = $(".photo-data").eq(1).text();
            $("#LoadedTip").show();
            $.ajax({
                url: serviceChoose + "/PMG_PHOTO_GETLIST",
                type: "post",
                data: JSON.stringify({
                    "IN": {
                        "KSSJ": kssj,                  //开始时间
                        "JSSJ": jssj,	               //结束时间
                        "KJM": encodeURI(kjm)                                   //快捷码
                    }
                }),
                dataType: "json",
                headers: {
                    'Content-Type': 'application/json'
                },
                success: function (res) {
                    $("#LoadedTip").hide();
                    if (res.Result.ERROR) {
                        //layer.alert(res.Result.ERROR);
                        layererror(res.Result.ERROR);
                    } else {
                        $('.result-box').empty();
                        $('.normal-search').hide();
                        $('.result-box').show();
                        $(".row button").removeClass("active");
                        if (res.Result.OUTPUT.LIST) {
                            var picList = toArray(res.Result.OUTPUT.LIST.ITEM);
                            for (var i = 0; i < picList.length; i++) {
                                if (picList[i].SLTLJ == null) {
                                    createSLU(picList[i].ID, i);
                                }
                                var fz = picList[i].FZ;
                                fz = fz.replace(/\,/g, "/");
                                var str = '<div class="col-xs-3 img-box"><img src="' + picList[i].SLTLJ + '" alt=""><p>分组：' + fz + '</p><p>' + picList[i].SCR + '<small>' + picList[i].SJ + '</small></p></div>';
                                var img = $(str);
                                img.data(picList[i]);
                                $('.result-box').append(img);
                            }
                        }

                        clickImgBox();
                        //if(callback) callback(res);
                    }
                }
            });
        }
        //获取数据失败
        function layererror(text) {
            if (typeof (text) == "string") {
                layer.alert(text);
            } else if (typeof (text.MSG) == "string") {
                layer.alert(text.MSG);
            } else {
                utils.showHide(text);
            }

        }
        // 关闭相册
        var closeAlbum = function () {
            $('#photo').addClass('slideOutLeft');
        }
        $('.closeAlbum').on('click', function () {
            closeAlbum()
        });
        return {
            photo: photo,
            closePhoto: closeAlbum
        }
    });
