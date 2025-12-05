using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;

namespace NewCostHjy.App_Start {
    public class ActionFilter : ActionFilterAttribute {
        private readonly string sessionKey = "_thisWebApiOnActionMonitorLog_";
         
        /// <summary>
        /// api执行完毕
        /// </summary>
        /// <param name="actionContext"></param>
        public override void OnActionExecuted(ActionExecutedContext actionContext) {
            base.OnActionExecuted(actionContext);
             
        }

        /// <summary>
        /// 数据返回前，统一返回格式
        /// </summary>
        /// <param name="context"></param>
        public override void OnResultExecuting(ResultExecutingContext context) {
            base.OnResultExecuting(context);
            if (context.HttpContext.Request.Path.Value.Contains("/bh/")) {
                return;
            }

            //if (context.HttpContext.Request.ContentType.IndexOf("text/plain") > -1)
            //{
            //    using (var reader = new StreamReader(context.HttpContext.Request.Body))
            //    {
            //        var body = reader.ReadToEndAsync();
            //        // 你可以将解析后的文本存储在HttpContext的某个位置，例如Items集合中
            //        context.HttpContext.Items["RequestBody"] = body;
            //        // 如果你打算在后续中间件或控制器中再次读取请求体，你需要重置请求体流的位置
            //        //context.HttpContext.Request.Body.Position = 0;
            //    }
            //}

            if (context.Result is JsonResult) {
                var objectResult = context.Result as JsonResult;
                if (objectResult.Value == null) {
                    context.Result = new ObjectResult(new { Code = 404, Msg = "无效返回值", Success = false });
                } else if (objectResult.StatusCode == 401) {
                    dynamic retValue = JsonConvert.DeserializeObject(JsonConvert.SerializeObject(objectResult.Value));
                    if (retValue.Success != null && retValue.Msg != null) {
                        context.Result = new ObjectResult(new { Code = 401, Success = false, Msg = "访问请求要求身份验证！" + retValue.Msg, Data = retValue });
                    }
                } else {

                    string apiName = context.HttpContext.Request.Path.Value.ToUpper();
                    if (apiName == "/LOGIN/GETTOKENTOZLHIS"
                        || apiName == "/AIOINTERFACE/USERAUTH") {
                        //有些是小写的特殊处理
                        context.Result = new ObjectResult(new { code = 200, success = true, msg = "", data = objectResult.Value });
                        return;
                    } else if (apiName == "/MRHOMEMANAGEMENT/GETPAGERECODEINFO"
                        || apiName == "/REPORT/GETPATIENTREPORTLIST"
                        || apiName == "/REPORT/ISCANWRITE"
                        || apiName == "/REPORT/WRITEIDENTIFY"
                        || apiName == "/API/INTERFACEPROCESS/GETSTATICRULE"
                        || apiName == "/API/THIRDINTERFACE/INTFCSAVEREQUESTOTHERS"
                        || apiName == "/API/THIRDINTERFACE/STDDSERVICE_SYNC"
                        || apiName == "/API/BASEAPI/GETCHECKDATA"
                        || apiName == "/API/BASEAPI/GETCHECKDATABYOUT"
                        || apiName == "/API/BASEAPI/HISRULECHECKAPI"
                        || apiName.IndexOf("API/BASEAPI/GETTHIRDP")>-1
                        || apiName.IndexOf("API/THIRDINTERFACE/") > -1
                        || apiName.IndexOf("DRUGCORRECT/") > -1
                        || apiName.IndexOf("INFORMEDCONSENT/") > -1
                        || apiName.IndexOf("/API/ZLHISINTERFACE/CHECKNEWBILL") > -1
                        || apiName.IndexOf("/API/INTERFACEPROCESS/") > -1

                        ) {
                        //有些接口原样反回
                        return;
                    } else {
                        context.Result = new ObjectResult(new { Code = 200, Success = true, Msg = "", Data = objectResult.Value });
                    }
                }
            } else if (context.Result is ObjectResult) {
                var objectResult = context.Result as ObjectResult;
                context.Result = new ObjectResult(new { Code = 200, Success = true, Msg = "", Data = objectResult.Value });

            } else if (context.Result is EmptyResult) {
                context.Result = new ObjectResult(new { Code = 404, Msg = "未找到资源", Success = false });
            } else if (context.Result is ContentResult) {
                return;
            }
        } 
    }
}