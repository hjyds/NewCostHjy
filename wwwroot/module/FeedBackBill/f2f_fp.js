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
     * 删除指定日期范围内的随访记录
     * @param {string} startDate - 开始日期 (YYYY-MM-DD)
     * @param {string} endDate - 结束日期 (YYYY-MM-DD)
     * @param {number} page - 页码，默认第1页
     * @param {number} limit - 每页数量，默认1000条
     */
    function deleteFollowRecordsByDateRange(startDate, endDate, page = 1, limit = 1000) {
        const url = `https://cqapi.cfkfz.com:28009/admin/follow/list?page=${page}&limit=${limit}&startTime=${startDate}+00:00:00&endTime=${endDate}+23:59:59&followType=`;
        let datas = zlGetLS(url);
        debugger
        
        datas.data.list.forEach(function (item) {
            zlPostLS('https://cqapi.cfkfz.com:28009/admin/follow/delete?id=' + item.id, item.id);
        });
        
        layer.msg('删除操作已完成', { icon: 1, time: 2000 });
    }

    $(function () {
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

        // 删除电话随访信息按钮点击事件
        document.getElementById('deleteFollowRecordsBtn').addEventListener('click', function () {
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

            layer.confirm('确定要删除该日期范围内的电话随访信息吗？此操作不可恢复！', {
                btn: ['确定删除', '取消'],
                icon: 3,
                title: '确认删除'
            }, function (index) {
                layer.close(index);
                deleteFollowRecordsByDateRange(startDate, endDate, 1, 1000);
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

    // 删除随访记录（供调试使用）
    function deleteFollowRecords() {
        // 示例：删除2025年2月1日至2025年3月4日的随访记录
        deleteFollowRecordsByDateRange('2025-02-01', '2025-03-04', 4, 500);
    }

    window.deleteFollowRecordsByDateRange = deleteFollowRecordsByDateRange;
    window.deleteFollowRecords = deleteFollowRecords;
})();
