using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace NewCostHjy.Common
{
    public class HttpRequest
    {
        public static List<ActionInfo> ActionInfos { get; set; }

        private static readonly HttpClient _httpClient = new HttpClient(new HttpClientHandler
        {
            AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate | DecompressionMethods.Brotli
        })
        {
            //httpTimeOut 
            Timeout = TimeSpan.FromMilliseconds(10*1000)
        };


        private static string GetErrorMessage(string responseContent)
        {
            string errMessage = responseContent;
            if (!string.IsNullOrWhiteSpace(errMessage))
            {
                try
                {
                    JObject jobj = JObject.Parse(errMessage);
                    if (jobj["Msg"] != null)
                    {
                        errMessage = jobj["Msg"].ToString();
                    } else if (jobj["Message"] != null)
                    {
                        errMessage = jobj["Message"].ToString();
                    }
                } catch
                {
                    // ignore parse error
                }
            }
            return errMessage;
        }

        public static void GetActionInfos()
        {
            try
            {
                ActionInfos = new List<ActionInfo>();
                XmlDocument xmlOut = new XmlDocument();
                xmlOut.Load("ZLINDSServices.xml");
                XmlNodeList infosXML = xmlOut.SelectNodes("/doc/members/member");
                foreach (XmlElement element in infosXML)
                {
                    string memberName = element.GetAttribute("name");
                    if (memberName.StartsWith("M:"))
                    {
                        string[] arrInfo = memberName.Split(".");
                        if (arrInfo.Length > 3)
                        {
                            string controllerName = "";
                            string methodName = "";
                            if (arrInfo[2].Contains("Controller"))
                            {
                                controllerName = arrInfo[2][..^"Controller".Length];
                                methodName = arrInfo[3].Split("(")[0];
                            } else if (arrInfo.Length > 4)
                            {
                                controllerName = arrInfo[3][..^"Controller".Length];
                                methodName = arrInfo[4].Split("(")[0];
                            }
                            if (!string.IsNullOrEmpty(methodName))
                            {
                                var summaryNode = element.SelectSingleNode("summary") as XmlElement;
                                if (summaryNode != null)
                                {
                                    string chnName = summaryNode.InnerText.Trim().Replace(" ", "").Replace("\r", "").Replace("\n", "").Replace("   ", "");
                                    if (!string.IsNullOrEmpty(chnName))
                                    {
                                        ActionInfos.Add(new ActionInfo
                                        {
                                            ControllerName = controllerName,
                                            MethodName = methodName,
                                            MethodChnName = chnName
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            } catch
            {
                // 忽略错误
            }
        }

        public static string GetRequestAction(string requestUrl)
        {
            try
            {
                string[] parts = requestUrl.Trim('/').Split('/');
                string controllerName = parts.Length > 1 ? parts[1] : "";
                string methodName = parts.Length > 2 ? parts[2] : "";

                if (requestUrl.Contains("/PASS/"))
                {
                    controllerName = parts.Length > 3 ? parts[3] : "";
                    methodName = parts.Length > 4 ? parts[4] : "";
                }

                var actionInfo = ActionInfos.FirstOrDefault(a =>
                    a.ControllerName.Equals(controllerName, StringComparison.OrdinalIgnoreCase) &&
                    a.MethodName.Equals(methodName, StringComparison.OrdinalIgnoreCase));
                return actionInfo?.MethodChnName ?? "";
            } catch
            {
                return "";
            }
        }

        /// <summary>
        /// 获取请求客户端的真实ID，主要是兼容支持Nginx代理环境
        /// </summary>
        /// <param name="httpContext">已明确的HTTP对象</param>
        /// <returns></returns>
        private static string GetClientRealIP(HttpContext httpContext = null)
        {
            string requestIP = "";

            if (httpContext == null)
            {
                //IHttpContextAccessor accessor = DIServicesCollection.Instance.GetService(typeof(IHttpContextAccessor)) as IHttpContextAccessor;
                //httpContext = accessor.HttpContext;
            }

            if (httpContext != null)
            {
                //从HTTP请求头中获取：
                //X-Forwarded-For：原始请求客户端IP,代理服务器1IP,代理服务器2IP,...(不包含最后一个代理服务器IP)
                //X-Real-IP：原始请求客户端IP
                //REMOTE-HOST：原始请求客户端主机名，失败返回客户端IP
                //ZL-Client-IP：中联产品客户端发起服务调用时传递的原始请求客户端IP
                requestIP = httpContext.Request.Headers["ZL-Client-IP"].FirstOrDefault();
                if (!string.IsNullOrEmpty(requestIP)) requestIP = requestIP.Split(",")[0];

                if (string.IsNullOrEmpty(requestIP))
                {
                    requestIP = httpContext.Request.Headers["AIO-Client-IP"].FirstOrDefault();
                }
                if (string.IsNullOrEmpty(requestIP))
                {
                    requestIP = httpContext.Request.Headers["X-Real-IP"].FirstOrDefault();//StringValues
                }
                if (string.IsNullOrEmpty(requestIP))
                {
                    requestIP = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
                    if (!string.IsNullOrEmpty(requestIP)) requestIP = requestIP.Split(",")[0];
                }
                //常规获取方式
                if (string.IsNullOrEmpty(requestIP))
                {
                    requestIP = httpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
                }
            }
            //处理等保测试 乱码ip超长导致生成日志文件名超长，系统无法直接删除
            if (requestIP.Length > 50) requestIP = requestIP.Substring(0, 50);

            return requestIP;
        }

        private static HttpRequestMessage CreateHttpRequest(HttpMethod method, string url, string body, AuthType authType, string secret, bool transferIP = false)
        {
            var request = new HttpRequestMessage(method, url);
            if (!string.IsNullOrEmpty(body))
            {
                request.Content = new StringContent(body, Encoding.UTF8, "application/json");
            }
            if (transferIP)
            {
                // 添加自定义头部
                string requestIP = GetClientRealIP();
                request.Headers.Add("ZL-Client-IP", requestIP);
            }
            if (authType == AuthType.Basic)
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Basic", secret);
            } else if (authType == AuthType.Oauth)
            {
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", secret);
            }
            request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("gzip"));
            request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("deflate"));
            request.Headers.AcceptEncoding.Add(new StringWithQualityHeaderValue("br"));
            return request;
        }

        public static string RequestDataSync(
            string url,
            string postData,
            AuthType authType,
            string secret = "",
            bool promptError = true,
            bool transferIP = false)
        {
            // 使用 GetAwaiter().GetResult() 避免 AggregateException 包裹
            return RequestData(url, postData, authType, secret, promptError, transferIP)
                .GetAwaiter()
                .GetResult();
        }

        public static async Task<string> RequestData(string url, string postData, AuthType authType, string secret = "", bool promptError = true, bool transferIP = false)
        {
            string result = string.Empty;
            DateTime beginTime = DateTime.Now;
            try
            {
                using (var request = CreateHttpRequest(HttpMethod.Post, url, postData, authType, secret, transferIP))
                {
                    using (var response = await _httpClient.SendAsync(request))
                    {
                        result = await response.Content.ReadAsStringAsync();

                        //LoggerHelper.Trace($"外部访问耗时：{(DateTime.Now - beginTime).TotalMilliseconds} ms\r\n\t位置：{GetCallerName(2)}, 方法：POST\r\n\t地址：{url}\r\n\t入参：{postData}\r\n\t出参：{result}");

                        if (!response.IsSuccessStatusCode && promptError)
                        {
                            throw new Exception(GetErrorMessage(result));
                        }
                        return result;
                    }
                }
            } catch (TaskCanceledException ex)
            {
                string msg = "请求超时（可能是服务端响应过慢或服务连接失败）";
                //LoggerHelper.Error(
                //    $"外部访问超时：\r\n\t位置：{GetCallerName(2)}, 方法：POST\r\n\t" +
                //    $"地址：{url}\r\n\t入参：{postData}\r\n\t错误：{msg}", ex);
                string newMsg = $"{msg}\r\n\t调用外部服务：{url}";
                if (promptError) throw new TimeoutException(newMsg, ex);
                return "errorText:" + msg;
            } catch (Exception ex)
            {
                //LoggerHelper.Error($"外部访问错误：\r\n\t位置：{GetCallerName(2)}, 方法：POST\r\n\t地址：{url}\r\n\t入参：{postData}\r\n\t错误：{ex.Message}", ex);
                if (promptError) throw;
                return "errorText:" + ex.Message;
            }
        }

        public static string HttpGetSync(string url, AuthType authType, string secret = "", bool promptError = true, bool transferIP = false)
        {
            // 使用 GetAwaiter().GetResult() 避免 AggregateException 包裹
            return HttpGet(url, authType, secret, promptError, transferIP)
                .GetAwaiter()
                .GetResult();
        }

        public static async Task<string> HttpGet(string url, AuthType authType, string secret = "", bool promptError = true, bool transferIP = false)
        {
            string result = string.Empty;
            DateTime beginTime = DateTime.Now;
            try
            {
                using (var request = CreateHttpRequest(HttpMethod.Get, url, null, authType, secret, transferIP))
                {
                    using (var response = await _httpClient.SendAsync(request))
                    {
                        result = await response.Content.ReadAsStringAsync();
                        //LoggerHelper.Trace($"外部访问耗时：{(DateTime.Now - beginTime).TotalMilliseconds} ms\r\n\t位置：{GetCallerName(2)}, 方法：Get\r\n\t地址：{url}\r\n\t出参：{result}");
                        if (!response.IsSuccessStatusCode && promptError)
                        {
                            throw new Exception(GetErrorMessage(result));
                        }
                        return result;
                    }
                }
            } catch (TaskCanceledException ex)
            {
                string msg = "请求超时（可能是服务端响应过慢或服务连接失败）";
                //LoggerHelper.Error(
                //    $"外部访问超时：\r\n\t位置：{GetCallerName(2)}, 方法：Get\r\n\t" +
                //    $"地址：{url}\r\n\t错误：{msg}", ex);
                string newMsg = $"{msg}\r\n\t调用外部服务：{url}";
                if (promptError) throw new TimeoutException(newMsg, ex);
                return "errorText:" + msg;
            } catch (Exception ex)
            {
                //LoggerHelper.Error($"外部访问错误：\r\n\t位置：{GetCallerName(2)}, 方法：GET\r\n\t地址：{url}\r\n\t错误：{ex.Message}", ex);
                if (promptError) throw;
                return "errorText:" + ex.Message;
            }
        }

        public static string GetCallerName(int upLevel = 3)
        {
            try
            {
                var callerMethod = new StackFrame(upLevel, false)?.GetMethod();
                return callerMethod != null ? $"{callerMethod.DeclaringType.FullName}.{callerMethod.Name}" : "";
            } catch (Exception ex)
            {
                return ex.Message;
            }
        }
    }

    public class ActionInfo
    {
        public string ControllerName { get; set; }
        public string MethodName { get; set; }
        public string MethodChnName { get; set; }
    }
    public enum AuthType
    {
        None,
        Basic,
        Oauth
    }
}
