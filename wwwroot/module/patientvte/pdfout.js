(function () { 
    $(function () { 
        $("#pid").val(101);
        $("#pvid").val(1);           
    });  
})(window, $);

var _dataAll = [];//获取出来的数据
function GetDataByPid() {
    let dataPar = {
        lngPatiID: zlnvl($("#pid").val()),
        lngVisitID: zlnvl($("#pvid").val())
    }; 
    let url = `/api/BaseApi/PDFGetPrintList?para=` + JSON.stringify(dataPar);
    var result = zlGet(url);
    result = JSON.parse(result.Data);
    _dataAll = result.data; 
    let users = _dataAll; 
    let html = '<table class="table-bordered"><tr><th>baby</th><th>file_name</th><th>file_type</th><th>id</th><th>rec_status</th><th>type</th></tr>';
    users.forEach(user => {
        html += `<tr><td>${user.baby}</td><td>${user.file_name}</td><td>${user.file_type}</td><td>${user.id}</td><td>${user.rec_status}</td><td>${user.type}</td></tr>`;
    });
    html += '</table>'; 
    document.getElementById('pdfout').innerHTML = html; 
}
 
function SetDataToPdf() {
    let dataPar = {
        id: 1,
        lngPatiID: zlnvl($("#pid").val()),
        lngVisitID: zlnvl($("#pvid").val())
    };
    debugger;
    _dataAll.forEach(function (item) {
        dataPar.id = item.id;
        let url = `/api/BaseApi/PDFPrintDocument?para=` + JSON.stringify(dataPar);
        var result = zlGet(url); 
    }); 
}   