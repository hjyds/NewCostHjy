/**
 * 
 * 关于图片上传后的随访单录入
 * 
 * 
 */
(function () {

    /**
     * 格式化日期为date输入框所需的格式 (YYYY-MM-DD)
     * @param {Date} date - 日期对象
     * @returns {string} 格式化后的日期字符串
     */
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    /**
     * 初始化Bootstrap Table
     */
    function initBootstrapTable() {
        $('#tab_api_list').bootstrapTable({
            pagination: true,
            pageSize: 10,
            pageList: [10, 25, 50, 100],
            search: true,
            showColumns: true,
            showRefresh: true,
            showToggle: true,
            locale: 'zh-CN',
            columns: [{
                field: 'select',
                title: '选择',
                checkbox: true,
                align: 'center',
                valign: 'middle'
            }, {
                field: 'id',
                title: 'ID',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'realname',
                title: '姓名',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'userCode',
                title: '用户编号',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'idCardNum',
                title: '身份证号',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'mobile',
                title: '联系电话',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'siteName',
                title: '站点名称',
                align: 'center',
                valign: 'middle'
            }, {
                field: 'followType',
                title: '随访类型',
                align: 'center',
                valign: 'middle',
                formatter: function(value) {
                    return value === 1 ? '电话随访' : '其他';
                }
            }, {
                field: 'followTime',
                title: '随访时间',
                align: 'center',
                valign: 'middle',
                sortable: true
            }, {
                field: 'createTime',
                title: '创建时间',
                align: 'center',
                valign: 'middle',
                sortable: true
            }]
        });
    }

    /**
     * 渲染随访记录到Bootstrap Table
     * @param {Array} records - 随访记录数组
     */
    function renderFollowRecordsToTable(records) {
        if (!records || records.length === 0) {
            $('#tab_api_list').bootstrapTable('load', []);
            return;
        }

        $('#tab_api_list').bootstrapTable('load', records);
    }

    /**
     * 查询指定日期范围内的随访记录
     * @param {string} startDate - 开始日期 (YYYY-MM-DD)
     * @param {string} endDate - 结束日期 (YYYY-MM-DD)
     * @param {number} page - 页码，默认第1页
     * @param {number} limit - 每页数量，默认1000条
     * @returns {Promise} - 返回包含记录的Promise
     */
    function queryFollowRecordsByDateRange(startDate, endDate, page = 1, limit = 1000) {
        return new Promise(function (resolve, reject) {
            const url = `https://cqapi.cfkfz.com:28009/admin/follow/list?page=${page}&limit=${limit}&startTime=${startDate}+00:00:00&endTime=${endDate}+23:59:59&followType=`;
            let datas = zlGetLS(url);
            
            if (datas && datas.data && datas.data.list) {
                resolve(datas.data.list);
            } else {
                reject(new Error('查询数据失败'));
            }
        });
    }

    /**
     * 删除选中的随访记录
     * @returns {Promise} - 返回删除结果的Promise
     */
    function deleteSelectedFollowRecords() {
        return new Promise(function (resolve, reject) {
            const selections = $('#tab_api_list').bootstrapTable('getSelections');
            if (selections.length === 0) {
                reject(new Error('请选择要删除的记录'));
                return;
            }

            const deletePromises = [];
            selections.forEach(function (record) {
                const id = record.id;
                deletePromises.push(
                    new Promise(function (resolve) {
                        zlPostLS('https://cqapi.cfkfz.com:28009/admin/follow/delete?id=' + id, id);
                        resolve(id);
                    })
                );
            });

            Promise.all(deletePromises).then(function (deletedIds) {
                resolve(deletedIds);
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    /**
     * 删除指定日期范围内的所有随访记录
     * @param {string} startDate - 开始日期 (YYYY-MM-DD)
     * @param {string} endDate - 结束日期 (YYYY-MM-DD)
     * @returns {Promise} - 返回删除结果的Promise
     */
    function deleteAllFollowRecords(startDate, endDate) {
        return new Promise(function (resolve, reject) {
            // 先获取总记录数
            const countUrl = `https://cqapi.cfkfz.com:28009/admin/follow/list?page=1&limit=1&startTime=${startDate}+00:00:00&endTime=${endDate}+23:59:59&followType=`;
            let countData = zlGetLS(countUrl);
            
            if (!countData || !countData.data || !countData.data.total) {
                reject(new Error('无法获取记录总数'));
                return;
            }
            
            const totalRecords = countData.data.total;
            const pages = Math.ceil(totalRecords / 1000);
            const deletePromises = [];
            
            // 循环获取所有页数据并删除
            for (let page = 1; page <= pages; page++) {
                deletePromises.push(
                    new Promise(function (resolvePage) {
                        const url = `https://cqapi.cfkfz.com:28009/admin/follow/list?page=${page}&limit=1000&startTime=${startDate}+00:00:00&endTime=${endDate}+23:59:59&followType=`;
                        let datas = zlGetLS(url);
                        
                        if (datas && datas.data && datas.data.list) {
                            const ids = datas.data.list.map(item => item.id);
                            const deleteIdPromises = ids.map(id => 
                                new Promise(function (resolveId) {
                                    zlPostLS('https://cqapi.cfkfz.com:28009/admin/follow/delete?id=' + id, id);
                                    resolveId(id);
                                })
                            );
                            
                            Promise.all(deleteIdPromises).then(resolvePage);
                        } else {
                            resolvePage();
                        }
                    })
                );
            }
            
            Promise.all(deletePromises).then(function (results) {
                const deletedIds = [].concat(...results);
                resolve(deletedIds);
            }).catch(reject);
        });
    }

    $(function () {
        // 初始化Bootstrap Table
        initBootstrapTable();

        $("#parin").on("click", function () {               
            OutPutPDF();
        });
        $("#brandPic").on("change", function () {
            if (this.files.length <= 0) {
                return false;
            }
            _f2f = "1";
            let type = $("#pic_type").attr("data-type");
            let userCode = "";
            let lstName = [];
            if (type == "1") {
                 
                let patList = GetPatiIdInfoList();
                for (let i = 0; i < this.files.length; i++) {
                    var pic1 = this.files[i];
                    let pname = pic1.name.split('-')[0];
                    let ptimes = pic1.name.split('-')[1].split('.');
                    userCode = "";
                    let objPat = patList.filter(function (t) { return t.realname === pname; });
                    if (objPat.length > 0) {
                        userCode = objPat[0].userCode;
                        objPat[0].mon = ptimes[0];
                        objPat[0].dayNum = ptimes[1];

                        UpPICFUN(pic1, objPat[0]);
                    }

                    if (1 == 0) {
                        userCode = pname;
                        let objData = AddPhoneBillOnePatiByUserCode(userCode);
                    }
                }
                return false;
            }

            if (1 == 1) {
                var formData = new FormData();
                formData.append("file", pic1);
                formData.append("scene", "");
                postDataPic(formData);
            }

        });

        // 确定按钮点击事件
        $("#submitDateRange").on("click", function (e) {
            e.preventDefault();

            const startDate = document.getElementById('startDate').value.trim();
            const endDate = document.getElementById('endDate').value.trim();

            // 日期范围校验
            if (!startDate || !endDate) {
                layer.alert('请选择开始日期和结束日期', { icon: 2 });
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end <= start) {
                layer.alert('结束日期必须大于开始日期', { icon: 2 });
                return;
            }

            debugger
            DocFunText();
        });

        // 开始日期改变时自动调整结束日期
        document.getElementById('startDate').addEventListener('change', function () {
            const startDate = new Date(this.value);
            const endDateInput = document.getElementById('endDate');
            const currentEndDate = new Date(endDateInput.value);

            // 设置结束日期的最小值为开始日期
            endDateInput.min = formatDateForInput(startDate);

            // 如果结束日期小于等于开始日期，自动设置结束日期为开始日期+1天
            if (currentEndDate <= startDate) {
                startDate.setDate(startDate.getDate() + 1);
                endDateInput.value = formatDateForInput(startDate);
            }
        });

        // 结束日期改变时进行校验
        document.getElementById('endDate').addEventListener('change', function () {
            const startDate = new Date(document.getElementById('startDate').value);
            const endDate = new Date(this.value);

            if (endDate <= startDate) {
                layer.alert('结束日期必须大于开始日期', { icon: 2 });
                this.value = '';
            }
        });

        // 显示删除的随访记录按钮点击事件
        document.getElementById('showDeleteRecordsBtn').addEventListener('click', function () {
            const startDate = document.getElementById('startDate').value.trim();
            const endDate = document.getElementById('endDate').value.trim();

            if (!startDate || !endDate) {
                layer.alert('请选择开始日期和结束日期', { icon: 2 });
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end <= start) {
                layer.alert('结束日期必须大于开始日期', { icon: 2 });
                return;
            }

            // 显示加载
            layer.load(2);

            // 查询数据
            queryFollowRecordsByDateRange(startDate, endDate, 1, 1000)
                .then(function (records) {
                    layer.closeAll('loading');
                    
                    // 渲染到表格
                    renderFollowRecordsToTable(records);
                    
                    if (records.length === 0) {
                        layer.msg('该日期范围内没有数据', { icon: 0 });
                        return;
                    }

                    layer.msg(`共找到 ${records.length} 条记录`, { icon: 1 });
                })
                .catch(function (error) {
                    layer.closeAll('loading');
                    layer.alert('查询数据失败：' + error.message, { icon: 2 });
                });
        });

        // 删除选中记录按钮点击事件
        document.getElementById('deleteSelectedBtn').addEventListener('click', function () {
            const selections = $('#tab_api_list').bootstrapTable('getSelections');
            
            if (selections.length === 0) {
                layer.alert('请先选择要删除的记录', { icon: 2 });
                return;
            }

            layer.confirm(`确定要删除选中的 ${selections.length} 条记录吗？此操作不可恢复！`, {
                btn: ['确定删除', '取消'],
                icon: 3,
                title: '确认删除'
            }, function (index) {
                layer.close(index);
                layer.load(2);

                deleteSelectedFollowRecords()
                    .then(function (deletedIds) {
                        layer.closeAll('loading');
                        layer.msg(`成功删除 ${deletedIds.length} 条记录`, { icon: 1, time: 2000 });
                        
                        // 清空表格
                        $('#tab_api_list').bootstrapTable('load', []);
                    })
                    .catch(function (error) {
                        layer.closeAll('loading');
                        layer.alert('删除失败：' + error.message, { icon: 2 });
                    });
            });
        });

        // 删除全部记录按钮点击事件
        document.getElementById('deleteAllBtn').addEventListener('click', function () {
            const startDate = document.getElementById('startDate').value.trim();
            const endDate = document.getElementById('endDate').value.trim();

            if (!startDate || !endDate) {
                layer.alert('请选择开始日期和结束日期', { icon: 2 });
                return;
            }

            const start = new Date(startDate);
            const end = new Date(endDate);

            if (end <= start) {
                layer.alert('结束日期必须大于开始日期', { icon: 2 });
                return;
            }

            layer.confirm(`确定要删除该日期范围内的所有随访记录吗？此操作不可恢复！`, {
                btn: ['确定删除', '取消'],
                icon: 3,
                title: '确认删除全部记录'
            }, function (index) {
                layer.close(index);
                layer.load(2);

                deleteAllFollowRecords(startDate, endDate)
                    .then(function (deletedIds) {
                        layer.closeAll('loading');
                        layer.msg(`成功删除 ${deletedIds.length} 条记录`, { icon: 1, time: 2000 });
                        $('#tab_api_list').bootstrapTable('load', []);
                    })
                    .catch(function (error) {
                        layer.closeAll('loading');
                        layer.alert('删除失败：' + error.message, { icon: 2 });
                    });
            });
        });

        // 设置默认日期为今天
        const today = new Date();
        const formattedToday = formatDateForInput(today);
        document.getElementById('startDate').value = formattedToday;

        // 设置结束日期默认为开始日期之后的一天
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedTomorrow = formatDateForInput(tomorrow);
        document.getElementById('endDate').value = formattedTomorrow;

        // 设置结束日期的最小值为今天
        document.getElementById('endDate').min = formattedToday;
    });

    // 暴露函数到全局
    window.queryFollowRecordsByDateRange = queryFollowRecordsByDateRange;
    window.renderFollowRecordsToTable = renderFollowRecordsToTable;
    window.deleteSelectedFollowRecords = deleteSelectedFollowRecords;
})();
