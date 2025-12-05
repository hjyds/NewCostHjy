using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models; 
using System.Collections.Generic; 

namespace NewCostHjy.Controllers {
    /// <summary>
    /// DRG,DIP相关
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class DataSetController : BaseController {
        /// <summary>
        /// 获取TOKEN
        /// </summary>
        /// <param name="UserId"></param>
        /// <param name="CreateToken"></param>
        /// <returns></returns>
        [HttpGet("GetUserRole")]
        public IActionResult GetUserRole(string UserId, string CreateToken)
        {
            //http://192.168.56.1:5888/api/DataSet/GetUserRole?UserId=281&CreateToken=1

            //{
            //    "Code": 200,
            //    "Success": true,
            //    "Msg": "",
            //        "Data": {
            //        "UserRole": 8,
            //        "QueryUrl": "/pages/pagemanegement/RunningPage_6d3525a1-caf1-4e4d-9212-ff3a82730686.html",
            //        "Token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJUCI6IjE5Mi4xNjguMzMuNTYiLCJDaGluZXNlTmFtZSI6IueuoeeQhuWRmCIsIk5hbWUiOiJaTEhJUyIsIlVzZXJOYW1lIjoiWkxISVMiLCJQYXNzd29yZCI6IjA0RDdCMDdENjg4MjY4RkQ3OURDOTMzREQ3QjMyOTk1OTkwOUFFM0YxQUYzNzU0RDA4QTIzNTQ3MDk0RUZCRUE1QkNERUI2RDM5RjY0M0IxRDEwNkU2NEU1NzRFOUE1NDA0QkMxMDQ1M0ZDMTM0NkIyM0RDRUFEQjM5MkUyMUMzOTUxM0QyNkQ4NUExNTgwMTJENDNBMzEwODlFQzY0NDI2NDMxRUY4NjJCMjQwOTgxQ0Q3N0QyRUQ5NUMwQzFGMTYxRjgyRjI2OTRCOTk5RDIwRDQwODRBNiIsImV4cCI6MTc0MzYwMjgxOCwiaXNzIjoiemxzb2Z0IiwiYXVkIjoiWkxESVAifQ.UsCWtV43LwEWltdzI9q43RrHJIf8_RS-AYtdlZFuoHs"
            //        }
            //}
            dynamic temp = new { Token = "hjy_test_hehehe" };
            return Json(temp);
        }

        /// <summary>
        /// 中联DRG_异常病例列表
        /// </summary>
        /// <param name="dept_id"></param>
        /// <param name="start_date"></param>
        /// <param name="end_date"></param>
        /// <returns>返回数组</returns>
        [HttpGet("QueryUnusualCasePatis")]
        public IActionResult QueryUnusualCasePatis(string dept_id, string start_date, string end_date)
        {
            //"http://192.168.56.1:5888/api/DataSet/QueryUnusualCasePatis?dept_id=36&start_date=&end_date="
            List<string> lst = new List<string>();
            return Json(lst);
        }

        /// <summary>
        /// DRG相关
        /// </summary>
        /// <param name="pid"></param>
        /// <param name="pvid"></param>
        /// <returns></returns>
        [HttpGet("GeneratePatiDataSet")]
        public IActionResult GeneratePatiDataSet(string pid, string pvid)
        {
            //http://192.168.56.1:5888/api/DataSet/GeneratePatiDataSet?pid=101&pvid=1            
            return Json(1);
        }

    }
}
