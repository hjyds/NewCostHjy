using Microsoft.AspNetCore.Mvc;
using NewCostHjy.Models;
using System.Collections.Generic;

namespace NewCostHjy.Controllers {
    [Route("api/[controller]")]
    [ApiController]
    public class LabitemCollectionController : BaseController {
        /// <summary>
        /// 临生免接口strURL = gstrWebLis & "/api/LabitemCollection/GetMLabitem_CollectionToHISItem_id?hisitem_id=" & lngItemID
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetMLabitem_CollectionToHISItem_id")]
        public IActionResult GetMLabitem_CollectionToHISItem_id(string hisitem_id, string serviceobject)
        {
            var result = new { result = 1 };

            List<SpecTestLisColl> list = new List<SpecTestLisColl>();

            return Json(list);
        }
    }
}
