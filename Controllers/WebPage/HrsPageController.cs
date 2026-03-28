using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace NewCostHjy.Controllers.WebPage {
    /// <summary>
    /// HRS页面视图控制器
    /// </summary>
    public class HrsPageController : Controller {
        
        /// <summary>
        /// 根据页面ID查看视图 - 临床人员问题查询
        /// </summary>
        /// <param name="pageid">页面ID</param>
        /// <param name="Operator">操作员</param>
        /// <param name="DeptName">科室名称</param>
        /// <param name="HospitalName">医院名称</param>
        /// <param name="token">认证Token</param>
        /// <returns></returns>
        [Route("unit/pageViewById")]
        public IActionResult PageViewById(string pageid, string Operator, string DeptName, string HospitalName, string token) {
            // 解析token获取用户信息
            var userInfo = ParseToken(token);
            
            ViewBag.PageId = pageid ?? "fd47766e-4781-4117-8750-a96beab304ee";
            ViewBag.Operator = Operator ?? "管理员";
            ViewBag.DeptName = DeptName ?? "消化内科病房";
            ViewBag.HospitalName = HospitalName ?? "中联医院信息系统（测试）";
            ViewBag.Token = token;
            ViewBag.UserInfo = userInfo;
            
            // 模拟问题查询数据
            ViewBag.IssueList = GetMockIssueList();
            
            return View("PageViewById");
        }
        
        /// <summary>
        /// 临床人员问题查询页面
        /// </summary>
        /// <returns></returns>
        [Route("unit/clinicalStaffQuery")]
        public IActionResult ClinicalStaffQuery() {
            ViewBag.Title = "临床人员问题查询";
            ViewBag.ProductName = "导航台标准版";
            ViewBag.CurrentTime = DateTime.Now.ToString("yyyyMMddHHmmss");
            
            // 模拟问题列表数据
            ViewBag.IssueList = GetMockIssueList();
            
            return View("ClinicalStaffQuery");
        }
        
        /// <summary>
        /// 解析JWT Token
        /// </summary>
        private dynamic ParseToken(string token) {
            try {
                if (string.IsNullOrEmpty(token)) {
                    return new {
                        Name = "测试用户",
                        UserName = "zltoken",
                        AccountID = Guid.NewGuid().ToString()
                    };
                }
                
                var parts = token.Split('.');
                if (parts.Length != 3) {
                    return null;
                }
                
                var payload = Base64UrlDecode(parts[1]);
                return JsonConvert.DeserializeObject(payload);
            }
            catch {
                return new {
                    Name = "测试用户",
                    UserName = "zltoken",
                    AccountID = Guid.NewGuid().ToString()
                };
            }
        }
        
        /// <summary>
        /// Base64 URL解码
        /// </summary>
        private string Base64UrlDecode(string input) {
            input = input.Replace('-', '+').Replace('_', '/');
            switch (input.Length % 4) {
                case 2: input += "=="; break;
                case 3: input += "="; break;
            }
            var bytes = Convert.FromBase64String(input);
            return System.Text.Encoding.UTF8.GetString(bytes);
        }
        
        /// <summary>
        /// 获取模拟问题列表数据
        /// </summary>
        private List<IssueItem> GetMockIssueList() {
            return new List<IssueItem> {
                new IssueItem {
                    Id = "20260328090915",
                    Content = "表或视图不存在，很可能是你不具备使用该部分数据的权限或该部分对象同义词缺失。",
                    Status = "待信息科处理",
                    CreateTime = "2026-03-28 09:09:15",
                    Creator = "管理员"
                },
                new IssueItem {
                    Id = "20260328090805",
                    Content = "5785678587578",
                    Status = "待信息科处理",
                    CreateTime = "2026-03-28 09:08:05",
                    Creator = "管理员"
                },
                new IssueItem {
                    Id = "20260328090740",
                    Content = "33333333",
                    Status = "待信息科处理",
                    CreateTime = "2026-03-28 09:07:40",
                    Creator = "管理员"
                },
                new IssueItem {
                    Id = "20260328090645",
                    Content = "禾。，，，，，",
                    Status = "待信息科处理",
                    CreateTime = "2026-03-28 09:06:45",
                    Creator = "管理员"
                },
                new IssueItem {
                    Id = "20260327153546",
                    Content = "测试录屏",
                    Status = "待信息科处理",
                    CreateTime = "2026-03-27 15:35:46",
                    Creator = "管理员"
                },
                new IssueItem {
                    Id = "20260327153509",
                    Content = "截图1535",
                    Status = "待信息科处理",
                    CreateTime = "2026-03-27 15:35:09",
                    Creator = "管理员"
                },
                new IssueItem {
                    Id = "20260327153440",
                    Content = "手要工加的hjy测试",
                    Status = "待信息科处理",
                    CreateTime = "2026-03-27 15:34:40",
                    Creator = "管理员"
                },
                new IssueItem {
                    Id = "20260327152334",
                    Content = "",
                    Status = "待信息科处理",
                    CreateTime = "2026-03-27 15:23:34",
                    Creator = "管理员"
                },
                new IssueItem {
                    Id = "20260327152320",
                    Content = "",
                    Status = "待信息科处理",
                    CreateTime = "2026-03-27 15:23:20",
                    Creator = "管理员"
                },
                new IssueItem {
                    Id = "20260327145615",
                    Content = "999966666",
                    Status = "待信息科处理",
                    CreateTime = "2026-03-27 14:56:15",
                    Creator = "管理员"
                }
            };
        }
    }
    
    /// <summary>
    /// 问题项模型
    /// </summary>
    public class IssueItem {
        public string Id { get; set; }
        public string Content { get; set; }
        public string Status { get; set; }
        public string CreateTime { get; set; }
        public string Creator { get; set; }
    }
}
