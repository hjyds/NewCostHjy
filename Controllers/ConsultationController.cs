using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers {

    /// <summary>
    /// 会诊系统
    /// </summary>
    [Route("[controller]")]
    [ApiController]
    public class ConsultationController : BaseController {
        
        /// <summary>
        /// 会诊系统执行完成或者撤消
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("CompleteOrFallback")]
        public IActionResult CompleteOrFallback([FromBody] dynamic parIn) {
     
            return Json(parIn);
        }


        /// <summary>
        /// 获取远程会诊的会诊申请管理页面
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("GetRemoteConsultationManageUrl")]
        public IActionResult GetRemoteConsultationManageUrl([FromBody] dynamic parIn)
        {
            //入参
            //{
            //  "sitesn":1,//站点
            //  "deptCode":2,//部门编码
            //  "userCode":3//人员编码
            //}
            //出参
            //{"code":200,"success":true,"msg":"","data":{
            //  "isok": true,
            //  "msg": "",
            //  "data": {
            //      "ranage_url": "https://xxx.com/xxx"
            //          }
            //}}
            // 模拟业务获取地址逻辑
            string consultUrl = "https://docs.qq.com/smartsheet/DR1NnWFZsa0FNWW1v?friendUin=S3mM%252BkSRLdKFxmbfeIjGFw%253D%253D&ADUIN=469843828&ADSESSION=1784854742&ADTAG=CLIENT.QQ.5705_.0&ADPUBNO=27370&jumpuin=469843828&tab=2y4e8s&viewId=v2ykqe";

            var result = new
            {
                code = 200,
                success = true,
                msg = "",
                data = new
                {
                    isok = true,
                    msg = "获取远程会诊管理地址成功",
                    data = new
                    {
                        ranage_url = consultUrl
                    }
                }
            };
            //注意，返回值要在 ActionFilter.cs中去特殊处理
            return Json(result);
        }
    }
}
