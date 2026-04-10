using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace NewCostHjy.Controllers
{
    /// <summary>
    /// 第三方首页控制器
    /// </summary>
    public class SafthridhomeController : Controller
    {
        /// <summary>
        /// 第三方首页入口 - 护理信息相关页面
        /// </summary>
        /// <remarks>
        /// 该方法通过GET请求接收以下查询参数：
        /// - Pid：病人ID
        /// - Pvid：主页ID
        /// - Baby：婴儿序号
        /// - openMode：打开模式：1：嵌入，2：弹窗 用于判断是否加载水印
        /// - PriEncryMode：控制基础信息脱敏：1 脱敏
        /// - 医院名称：医院名称
        /// - 科室名称：科室名称
        /// - 用户名：用户名
        /// - 操作员：操作员
        /// - 站点名称：站点名称
        /// - Token：认证串
        /// - Type：类型：
        ///   1：体温单；
        ///   2：护理记录；
        ///   3：评分评估（病人id、主页id）；
        ///   4：血糖；
        ///   5：出入量；
        ///   6：集中打印（主要用于病案集中打印调用）
        /// </remarks>
        /// <returns></returns>
        public IActionResult ThridIndex()
        {
            // 获取所有查询参数
            var Pid = Request.Query["Pid"].ToString();
            var Pvid = Request.Query["Pvid"].ToString();
            var Baby = Request.Query["Baby"].ToString();
            var openMode = Request.Query["openMode"].ToString();
            var PriEncryMode = Request.Query["PriEncryMode"].ToString();
            var hospitalName = Request.Query["医院名称"].ToString();
            var deptName = Request.Query["科室名称"].ToString();
            var userName = Request.Query["用户名"].ToString();
            var operatorName = Request.Query["操作员"].ToString();
            var stationName = Request.Query["站点名称"].ToString();
            var Token = Request.Query["Token"].ToString();
            var Type = Request.Query["Type"].ToString();
            
            // 将所有参数传递到视图
            ViewBag.Pid = Pid;
            ViewBag.Pvid = Pvid;
            ViewBag.Baby = Baby;
            ViewBag.openMode = openMode;
            ViewBag.PriEncryMode = PriEncryMode;
            ViewBag.HospitalName = hospitalName ?? "中联医院信息系统（测试）";
            ViewBag.DeptName = deptName ?? "门诊内科";
            ViewBag.UserName = userName ?? "ZLHIS";
            ViewBag.Operator = operatorName ?? "张永康";
            ViewBag.StationName = stationName;
            ViewBag.Token = Token;
            ViewBag.Type = Type;
            
            return View();
        }
        

    }
}