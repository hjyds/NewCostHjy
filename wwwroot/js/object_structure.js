
    /**打开表达式编辑窗 */
    function OpenExpEditor(data) {

        let code = data.BzSceneRow.编码;
        let 病人对象 = {}, 操作员对象 = {}, 医嘱对象 = {};
        GetTreeListData(code);

        /**获取左侧树表需要的数据 */
        function GetTreeListData(code) { 
            let ret = zlGet("/api/BzScene/GetBzSceneObjectInfo?bzSceneCode=" + code);
            if (ret.Success && ret.Data) {
                if (ret.Data.病人对象) {
                    病人对象 = eval("(" + ret.Data.病人对象 + ")");
                }
                if (ret.Data.操作员对象) {
                    操作员对象 = eval("(" + ret.Data.操作员对象 + ")");
                }
                if (ret.Data.医嘱对象) {
                    医嘱对象 = eval("(" + ret.Data.医嘱对象 + ")");
                }
            }
        }

         /**
         * 将一个json对象的结构解析出来
         * @param {any} pId 父级
         * @param {any} name 当前对点名
         * @param {any} path 路径
         * @param {any} objJson 对象本身
         * @param {any} listData 解析后的列表对象
         */
        function GetJsonKeyList(pId, name, path, objJson, listData) {
            let par = {
                "name": name,//结点名
                "id": "t_" + name,
                "pId": pId,
                "note": name,
                "controlName": name,
                "isParent": true,
                "open": true,
                "itemId": name,
                "nodetype": "path",
                "nodes": []
            }
            if (pId != null) {

                listData.forEach(function (pitem) {
                    if (pitem.id === pId) {
                        pitem.nodes.push(par);
                    }
                });

            } else {
                listData.push(par);
            }

            let valType = "";
            for (var item in objJson) {
                valType = typeof (objJson[item]);
                if (valType === "string" || valType === "number") {
                    par = {
                        "name": item,
                        "id": "t_" + item,
                        "pId": "t_" + name,
                        "note": item,
                        "controlName": item,
                        "iconSkin": valType === "string" ? "icon_txt" : "icon_num",
                        "path": path,
                        "nodetype": "property",
                        "description": {
                            "value": objJson[item],
                            "type": valType
                        }                        
                    }
                    let blnFd = false;
                    listData.forEach(function (pitem) {
                        if (pitem.id === "t_" + name) {
                            pitem.nodes.push(par);
                            blnFd = true;
                        } 
                    });

                    if (!blnFd) {
                        listData.forEach(function (ppitem) {
                            ppitem?.nodes?.forEach(function (pitem) {
                                if (pitem.id === "t_" + name) {
                                    pitem.nodes.push(par);
                                    blnFd = true;
                                }
                            });                            
                        });
                    }

                } else {
                    if (objJson[item].length > 0) {
                        //数组的处理暂时不显示
                    } else {
                        GetJsonKeyList("t_" + name, item, name + "." + item, objJson[item], listData);
                    }
                }
            }
        }
        var dataTrees = [];
         
        GetJsonKeyList(null, "病人对象", "病人对象", 病人对象, dataTrees);

      
        GetJsonKeyList(null, "操作员对象", "操作员对象", 操作员对象, dataTrees);

       
        GetJsonKeyList(null, "医嘱对象", "医嘱对象", 医嘱对象, dataTrees);

        sessionStorage.JsonModelStr = JSON.stringify(dataTrees);

        layer.open({
            type: 2,
            title: '<i class="fa fa-file" aria-hidden="true" style="font-size:1rem;margin-right: 0.3rem;color:rgb(99 120 168);"></i>编辑表达式',
            shade: 0.3,
            btn: ['确定', '取消'],
            area: ['90%', "90%"], //宽高
            content: "/lib/zlExpressEditor/ExpressEditor.html",
            resize: false,
            //窗体加载成功后执行
            success: function (layero, index) {
                let applyFormName = layero.find('iframe')[0]['name'];
                var iframeWin = window[applyFormName];
                iframeWin.InitPage(data);
            },
            yes: function (index, layero) {
                //获取子窗体
                var iframeWin = window[layero.find('iframe')[0]['name']];
                var result = iframeWin.SaveData();
                if (!result) {
                    return;
                }
                if (result.isOk) {
                    layer.msg('保存成功!', { icon: 1 });
                    layer.close(index);//刷新界面
                    RefreshBzCfg();

                    if (type === 0) {
                        outdataid = result.dataout_id;
                    }

                    _allBzSceneConfig.forEach(function (t, i) {
                        if (t.检查配置ID === outdataid) {
                            $("#TabChkConfig").bootstrapTable('scrollTo', { unit: 'rows', value: i });
                            $("#TabChkConfig").find("tbody tr").eq(i).find("td").eq(0).click();
                        }
                    })


                }   
            },
            end: function () {
                $("body").css("overflow", "auto");
            }
        });
    }