using Microsoft.AspNetCore.Mvc;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using System.Collections.Generic;

namespace NewCostHjy.Controllers
{
    /// <summary>
    /// 产科医学（妇幼）服务接口
    /// </summary>
    [Route("api/[controller]/[action]")]
    [Route("[controller]")]
    [ApiController]
    public class MaternityMedicalController : BaseController
    {
        /// <summary>
        /// 获取门诊医嘱默认健康分类（透传代理）
        /// </summary>
        /// <param name="parIn">入参模型，原样转发给后端</param>
        [HttpPost]
        public IActionResult GetOutpAdviceDefaultHealthCategory([FromBody] MaternityHealthCategoryIn parIn)
        {

            //////'医疗类别：92593f9c-2449-46f1-9892-dd9455833842  --医嘱标记项目
            //////'  普通门诊：a6eb5541-c697-4565-b0d2-98d5f5f2aee9
            //////'  生育门诊：1f01f478-e223-41db-80e0-e4a951f802c7
            //////'生育类别：be492670-1aad-45c2-a3cc-d727896bc83b  --就诊情况项目
            //////'  产前检查：3b8cbb6e-9bc2-4066-8977-bae4390f5fc6
            //////'  产后检查：2f8ff218-43c3-46fa-9e86-af875038cea9 
            List<MaternityAdviceOut> maternities = new List<MaternityAdviceOut>();
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();

            foreach (var item in parIn.AdviceList)
            {
                item.HealthCategoryId = "";
                foreach (var fee in item.FeeDetails)
                {
                    if (zlhisInterfaceDAL.Is生育类别包(fee.ChargesId))//收费项目目录.省级医保名称='生育' 表示要确定缺省值
                    {
                        item.HealthCategoryId = "1f01f478-e223-41db-80e0-e4a951f802c7";
                        break;
                    }
                }
                if (item.HealthCategoryId != "")
                {
                    maternities.Add(new MaternityAdviceOut
                    {
                        AdviceId = item.AdviceId,
                        HealthCategoryId = item.HealthCategoryId
                    });
                }
            }
            return Json(maternities);
        }
    }
}
