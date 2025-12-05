using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models; 
using System.Collections.Generic; 

namespace NewCostHjy.Controllers {
    /// <summary>
    /// 通用的三方测试服务方法控制器其中返回值都是原样返回不经过ActionFilter处理，不用会去包装CODE SUCCESS 等结点
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CalculateController : BaseController {

        /// <summary>
        /// DIP相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("CalculateDIPResult")]
        public IActionResult CalculateDIPResult([FromBody] DRGPARIN parIn)
        {
            //入参
            //{"ExecType":0,"PatiId":180,"PageId":1,"Scene":1,"PatiAge":9490,"PatiWeight":0,"IsNewborn":"0","PatiDischargeDate":"","SaveSign":"0","AppScen":"1","DiagInfos":[{"DiagCode":"T42.303","DiagName":"慢性支气管炎急性发作","SNO":1}],"OperationInfos":[{"OperationCode":"02.0601","OperationName":"胸腺修补术","SNO":1,"OperationTime":"2024-08-20 15:23:00"}]}
            List<DIPRsOut> lst = new List<DIPRsOut>();
            lst.Add(new DIPRsOut()); 
            return Json(lst);
        }

        /// <summary>
        /// DRG相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("CalculateDRGResultByHis")]
        public IActionResult CalculateDRGResultByHis([FromBody] DRGPARIN parIn)
        {
            //入参：
            //{"ExecType":0,"PatiId":101,"PageId":1,"Scene":1,"PatiAge":26645,"PatiWeight":0,"IsNewborn":"0","PatiDischargeDate":"","SaveSign":"0","AppScen":"1","DiagInfos":[{"DiagCode":"N15.901","DiagName":"肾感染","SNO":1},{"DiagCode":"A01.201","DiagName":"乙型副伤寒","SNO":2}],"OperationInfos":[]}
            DRGDataAttributes temp = new DRGDataAttributes();
            temp.otherGroupInfo = new DrgOtherGroupInfo();
            return Json(temp);
        }

    }



}
