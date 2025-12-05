using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace NewCostHjy.Controllers.WebPage {
    /// <summary>
    /// 传染病相关
    /// </summary>
    public class FeedBackBillController :  Controller {
        public IActionResult Regist(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }

        public IActionResult Dispose(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }

        public IActionResult Index(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }



        public IActionResult Selector(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }


        /// <summary>
        /// 面对面随访
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public IActionResult FaceToFaceFollowUp(string data) {
            dynamic objTmp = new { data };
            ViewBag.BaseData = objTmp;
            return View();
        }

    }
}
