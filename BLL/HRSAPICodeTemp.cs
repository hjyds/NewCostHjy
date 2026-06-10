//using System;
//using System.Text;
//using System.Xml;
//using System.Linq;
//using System.Text.Json.Nodes;
//using System.Collections.Generic;
//using System.Threading.Tasks;
//using HCSRunTimeLibrary;
//namespace FlowRunCode
//{
//    public class Fb4cef34c6d9248b3a3cd6b64224b1f3a : IFlowRun
//    {
//        public string FlowId => "b4cef34c-6d92-48b3-a3cd-6b64224b1f3a";
//        public ServiceSettingBase ServiceSetting { get; set; } = new FunctionServiceSetting();
//        public Fb4cef34c6d9248b3a3cd6b64224b1f3a()
//        {
//        }
//        public async Task<FlowFeedBackInfo> Call(string bodyNode, Dictionary<string, object> parameter)
//        {
//            FlowContext context = new FlowContext(FlowId, bodyNode, parameter);
//            FlowFeedBackInfo feedBackInfo = new FlowFeedBackInfo();
//            try
//            {
//                await fba424146bd0e4aa0b0eda888ac282bbc(context);
//                feedBackInfo.ReturnMsg = context.ReturnMsg;
//            } catch (Exception ex)
//            {
//                feedBackInfo.ReturnMsg = ex.Message;
//                feedBackInfo.IsError = true;
//            }
//            feedBackInfo.Parameter = parameter;

//            return feedBackInfo;
//        }
//        private async Task fba424146bd0e4aa0b0eda888ac282bbc(FlowContext context)
//        {
//            await this.fb57f94d63fb74d6585c823b284d9ec2f(context);
//        }
//        private async Task fb57f94d63fb74d6585c823b284d9ec2f(FlowContext context)
//        {
//            string sql = @"
//    select 
//        地址类别 as ""AddressType"",
//        省 as ""Province"",省编码 as ""Province_Id"",
//        市 as ""City"",市编码 as ""City_Id"",
//        县 as ""County"",县编码 as ""County_Id"",
//        乡镇 as ""Town"",镇编码 as ""Town_Id"",
//        其他 as ""Street""
//    from 病人地址信息 where 病人ID=:patiId
//";
//            context["sql"] = sql;
//            context["patiId"] = context.Body["病人ID"].ToString();
//            await this.fc73fe6077c514ad3a88bcaf8d34cd8fc(context);
//        }
//        private async Task fc73fe6077c514ad3a88bcaf8d34cd8fc(FlowContext context)
//        {
//            string xsql = Encoding.UTF8.GetString(Convert.FromBase64String("Q0pRSElTOlBhdGlJbmZvKAogICAgc2VsZWN0IGEu55eF5Lq6aWQsCiAgICAgICAgYS7pl6jor4rlj7cgYXMgIlBhdGlJbmZvX091dHBhdGllbnROdW0iLCBhLuS9j+mZouWPtyBhcyAiUGF0aUluZm9fSW5wYXRpZW50TnVtIiwKICAgICAgICBhLuWnk+WQjSBhcyAiUGF0aUluZm9fUGF0aU5hbWUiLGEu5oCn5YirIGFzICJQYXRpSW5mb19QYXRpU2V4IixhLui6q+S7veivgeWPtyBhcyAiUGF0aUluZm9fSWRDYXJkTnVtIixhLuWFtuS7luivgeS7tiBhcyAiUGF0aUluZm9fQ2VydE5vT3RoZXIiLAogICAgICAgIGEu5Zu957GNIGFzICJQYXRpSW5mb19Db3VudHJ5IixhLuawkeaXjyBhcyAiUGF0aUluZm9fTmF0aW9uIixhLuiBjOS4miBhcyAiUGF0aUluZm9fT2NjdXBhdGlvbiIsYS7ouqvku70gYXMgIlBhdGlJbmZvX0NhcGFjaXR5IiwKICAgICAgICBhLueXheS6uuexu+WeiyBhcyAiUGF0aUluZm9fUGF0aVR5cGUiLGEu5a2m5Y6GIGFzICJQYXRpSW5mb19FZHVjYXRpb24iLGEu5ama5ae754q25Ya1IGFzICJQYXRpSW5mb19NYXJyaWFnZSIsCiAgICAgICAgYS7ljLvkv53lj7cgYXMgIlBhdGlJbmZvX0luc3VyYW5jZU51bSIsbnZsKGMu6LS55YirLGEu6LS55YirKSBhcyAiUGF0aUluZm9fRmVlQ2F0ZWdvcnkiLGEu5Yy755aX5LuY5qy+5pa55byPIGFzICJQYXRpSW5mb19QYXlNb2RlIiwKICAgICAgICBhLuWMuuWfnyBhcyAiUGF0aUluZm9fUmVnaW9uIixhLuexjei0ryBhcyAiUGF0aUluZm9fT3JpZ2luQWRkcmVzcyIsYS7lh7rnlJ/lnLDngrkgYXMgIlBhdGlJbmZvX0JpcnRoQWRkcmVzcyIsCiAgICAgICAgYS7lrrbluq3lnLDlnYAgYXMgIlBhdGlJbmZvX0hvbWVBZGRyZXNzIixhLuWutuW6reeUteivnSBhcyAiUGF0aUluZm9fSG9tZVBob25lTnVtIixhLuWutuW6reWcsOWdgOmCrue8liBhcyAiUGF0aUluZm9fSG9tZVBvc3RDb2RlIiwKICAgICAgICBhLuaIt+WPo+WcsOWdgCBhcyAiUGF0aUluZm9fUmVnQWRkcmVzcyIsYS7miLflj6PlnLDlnYDpgq7nvJYgYXMgIlBhdGlJbmZvX0hvdXNQb3N0Q29kZSIsYS7miYvmnLrlj7cgYXMgIlBhdGlJbmZvX1Bob25lTnVtYmVyIiwKICAgICAgICBhLuiBlOezu+S6uuWnk+WQjSBhcyAiUGF0aUluZm9fQ29udGFjdE5hbWUiLGEu6IGU57O75Lq655S16K+dIGFzICJQYXRpSW5mb19Db250YWN0UGhvbmUiLGEu6IGU57O75Lq66Lqr5Lu96K+B5Y+3IGFzICJQYXRpSW5mb19Db250YWN0SWRDYXJkIixhLuiBlOezu+S6uuWFs+ezuyBhcyAiUGF0aUluZm9fQ29udGFjdFJlbGEiLGEu6IGU57O75Lq65Zyw5Z2AIGFzICJQYXRpSW5mb19Db250YWN0QWRkcmVzcyIsCiAgICAgICAgYS7lt6XkvZzljZXkvY0gYXMgIlBhdGlJbmZvX1dvcmtVbml0IixhLuWQiOWQjOWNleS9jUlEIGFzICJQYXRpSW5mb19Xb3JrVW5pdF9JZCIsYS7ljZXkvY3nlLXor50gYXMgIlBhdGlJbmZvX1VuaXRQaG9uZSIsCiAgICAgICAgYS7ljZXkvY3pgq7nvJYgYXMgIlBhdGlJbmZvX1VuaXRQb3N0Q29kZSIsYS7ljZXkvY3lvIDmiLfooYwgYXMgIlBhdGlJbmZvX1VuaXRBY2NvdW50QmFuayIsYS7ljZXkvY3luJDlj7cgYXMgIlBhdGlJbmZvX1VuaXRBY2NvdW50TnVtYmVyIiwKICAgICAgICBhLuebkeaKpOS6uiBhcyAiUGF0aUluZm9fR3VhcmRpYW4iLAogICAgICAgIHRvX2NoYXIoYS7lh7rnlJ/ml6XmnJ8sJ1lZWVktTU0tREQnKSBhcyAiUGF0aUluZm9fQmlydGhEYXRlIix0b19jaGFyKGEu5Ye655Sf5pel5pyfLCdISDI0Ok1JJykgYXMgIlBhdGlJbmZvX0JpcnRoVGltZSIsCiAgICAgICAgY2FzZSB3aGVuIHJlZ2V4cF9saWtlKGEu5bm06b6ELCdb5bKB5pyI5aSpXSQnKSB0aGVuIHN1YnN0cihhLuW5tOm+hCwxLGxlbmd0aChhLuW5tOm+hCktMSkgZWxzZSBhLuW5tOm+hCBlbmQgYXMgIlBhdGlJbmZvX0FnZVZhbHVlIiwKICAgICAgICBjYXNlIHdoZW4gcmVnZXhwX2xpa2UoYS7lubTpvoQsJ1vlsoHmnIjlpKldJCcpIHRoZW4gc3Vic3RyKGEu5bm06b6ELGxlbmd0aChhLuW5tOm+hCkpIHdoZW4gcmVnZXhwX2xpa2UoYS7lubTpvoQsJ15bMC05XSskJykgdGhlbiAn5bKBJyBlbHNlIG51bGwgZW5kIGFzICJQYXRpSW5mb19BZ2VVbml0IiwKICAgICAgICBiLui6q+S7veivgeWPt+eKtuaAgSBhcyAiUGF0aUluZm9fSWRDYXJkU3RhdHVzIixiLuiBlOezu+S6uumZhOWKoOS/oeaBryBhcyAiUGF0aUluZm9fQ29udGFjdFJlbWFya3MiLGIu6KGA5Z6LIGFzICJQYXRpSW5mb19CbG9vZFR5cGUiLAogICAgICAgIGIuUkggYXMgIlBhdGlJbmZvX1JIIixiLuWMu+WtpuitpuekuiBhcyAiUGF0aUluZm9fTWVkaWNhbFdhcm5pbmciLGIu5YW25LuW5Yy75a2m6K2m56S6IGFzICJQYXRpSW5mb19PdGhlck1lZGljYWxXYXJuaW5nIiwKICAgICAgICBjLuWkh+azqCBhcyAiUGF0aVBhZ2VJbmZvX1JlbWFya3MiCiAgICBmcm9tIOeXheS6uuS/oeaBryBhLCgKICAgICAgICBzZWxlY3Qg55eF5Lq6aWQsCiAgICAgICAgICAgIG1heChkZWNvZGUo5L+h5oGv5ZCNLCfouqvku73or4Hlj7fnirbmgIEnLOS/oeaBr+WAvCxudWxsKSkgYXMg6Lqr5Lu96K+B5Y+354q25oCBLAogICAgICAgICAgICBtYXgoZGVjb2RlKOS/oeaBr+WQjSwn6IGU57O75Lq66ZmE5Yqg5L+h5oGvJyzkv6Hmga/lgLwsbnVsbCkpIGFzIOiBlOezu+S6uumZhOWKoOS/oeaBrywKICAgICAgICAgICAgbWF4KGRlY29kZSjkv6Hmga/lkI0sJ+ihgOWeiycs5L+h5oGv5YC8LG51bGwpKSBhcyDooYDlnossCiAgICAgICAgICAgIG1heChkZWNvZGUo5L+h5oGv5ZCNLCdSSCcs5L+h5oGv5YC8LG51bGwpKSBhcyBSSCwKICAgICAgICAgICAgbWF4KGRlY29kZSjkv6Hmga/lkI0sJ+WMu+Wtpuitpuekuics5L+h5oGv5YC8LG51bGwpKSBhcyDljLvlraborabnpLosCiAgICAgICAgICAgIG1heChkZWNvZGUo5L+h5oGv5ZCNLCflhbbku5bljLvlraborabnpLonLOS/oeaBr+WAvCxudWxsKSkgYXMg5YW25LuW5Yy75a2m6K2m56S6ICAKICAgICAgICBmcm9tIOeXheS6uuS/oeaBr+S7juihqCAKICAgICAgICB3aGVyZSDnl4XkurppZD06cGF0aUlkIAogICAgICAgICAgICBhbmQg5L+h5oGv5ZCNIGluICgn6Lqr5Lu96K+B5Y+354q25oCBJywn6IGU57O75Lq66ZmE5Yqg5L+h5oGvJywn6KGA5Z6LJywnUkgnLCfljLvlraborabnpLonLCflhbbku5bljLvlraborabnpLonKQogICAgICAgIGdyb3VwIGJ5IOeXheS6umlkKSBiLOeXheahiOS4u+mhtSBjCiAgICB3aGVyZSBhLueXheS6umlkPTpwYXRpSWQgYW5kIGEu55eF5Lq6aWQ9Yi7nl4XkurppZCgrKSBhbmQgYS7nl4XkurppZD1jLueXheS6umlkKCspIGFuZCBhLuS4u+mhtWlkPWMu5Li76aG1aWQoKykKKQpjaGlsZChDSlFISVM6UGF0aUFkZHJlc3MoCiAgICBzZWxlY3QgCiAgICAgICAg5Zyw5Z2A57G75YirIGFzICJBZGRyZXNzVHlwZSIsCiAgICAgICAg55yBIGFzICJQcm92aW5jZSIs55yB57yW56CBIGFzICJQcm92aW5jZV9JZCIsCiAgICAgICAg5biCIGFzICJDaXR5IizluILnvJbnoIEgYXMgIkNpdHlfSWQiLAogICAgICAgIOWOvyBhcyAiQ291bnR5Iizljr/nvJbnoIEgYXMgIkNvdW50eV9JZCIsCiAgICAgICAg5Lmh6ZWHIGFzICJUb3duIizplYfnvJbnoIEgYXMgIlRvd25fSWQiLAogICAgICAgIOWFtuS7liBhcyAiU3RyZWV0IgogICAgZnJvbSDnl4XkurrlnLDlnYDkv6Hmga8gd2hlcmUg55eF5Lq6SUQ9QFBhdGlJbmZvLueXheS6uklECikpCmNoaWxkKENKUUhJUzpQYXRpQWxsZXJnaWMoCiAgICBzZWxlY3QgCiAgICAgICAg6L+H5pWP6I2v54mpSUQgYXMgIkFsbGVyZ2ljRHJ1Z0lkIizov4fmlY/oja/niakgYXMgIkFsbGVyZ2ljRHJ1Z05hbWUiLOi/h+aVj+WPjeW6lCBhcyAiQWxsZXJnaWNSZWFjdGlvbiIKICAgIGZyb20g55eF5Lq66L+H5pWP6I2v54mpIHdoZXJlIOeXheS6uklEPUBQYXRpSW5mby7nl4XkurpJRAopKQpjaGlsZChDSlFISVM6UGF0aUltbXVuZSgKICAgIHNlbGVjdCAKICAgICAgICB0b19jaGFyKOaOpeenjeaXtumXtCwnWVlZWS1NTS1ERCBISDI0Ok1JOlNTJykgYXMgIlZhY2NpbmF0ZVRpbWUiLOaOpeenjeWQjeensCBhcyAiVmFjY2luYXRlTmFtZSIKICAgIGZyb20g55eF5Lq65YWN55ar6K6w5b2VIHdoZXJlIOeXheS6uklEPUBQYXRpSW5mby7nl4XkurpJRAopKQpjaGlsZChDSlFISVM6UGF0aUNlcnRpZmljYXRlcygKICAgIHNlbGVjdCAKICAgICAgICDljaHnsbvliKtJRCBhcyAiQ2VydFR5cGUiLOWNoeWPtyBhcyAiQ2VydE51bWJlciIKICAgIGZyb20g55eF5Lq65Yy755aX5Y2h5L+h5oGvIHdoZXJlIOeXheS6uklEPUBQYXRpSW5mby7nl4XkurpJRAopKQpjaGlsZChDSlFISVM6UGF0aUV4cGVuZCgKICAgIHNlbGVjdCDkv6Hmga/lkI0gYXMgIkluZm9OYW1lIizkv6Hmga/lgLwgYXMgIkluZm9WYWx1ZSIgCiAgICBmcm9tIOeXheS6uuS/oeaBr+S7juihqCB3aGVyZSDnl4XkurpJRD1AUGF0aUluZm8u55eF5Lq6SUQgCiAgICAgICAgYW5kIOS/oeaBr+WQjSBub3QgaW4gKCfouqvku73or4Hlj7fnirbmgIEnLCfogZTns7vkurrpmYTliqDkv6Hmga8nLCfooYDlnosnLCdSSCcsJ+WMu+WtpuitpuekuicsJ+WFtuS7luWMu+WtpuitpuekuicpCiAgICAgICAgYW5kIOS/oeaBr+WQjSBub3QgbGlrZSAn6IGU57O75Lq6JScKKSk="));
//            if (string.IsNullOrEmpty(xsql))
//                throw new Exception("[XSQL]xsql为空");
//            JsonArray paramNodes = new JsonArray();
//            JsonObject p1 = new JsonObject()
//            {
//                ["name"] = ":patiId",
//                ["value"] = context.Body["病人ID"].ToString(),
//                ["datatype"] = "数字"
//            };
//            paramNodes.Add(p1);
//            var value = await CCQTLibrary.XSqlEngine.Execute(xsql, false, paramNodes);
//            context.SetParamValue("xData", value);
//            await this.fd08cdea9af62456680a907effffd546d(context);
//        }
//        private async Task fd08cdea9af62456680a907effffd546d(FlowContext context)
//        {
//            JsonNode forData = context.GetParamValue("xData") as JsonNode;
//            if (forData == null)
//            {
//                throw new Exception("循环变量类型应该是JsonNode");
//            }
//            JsonArray datas = forData["xData"] as JsonArray;
//            if (datas == null)
//            {
//                throw new Exception("[xData]过滤结果类型应该是JsonArray");
//            }
//            JsonArray reust = new JsonArray();
//            for (int i = 0; i < datas.Count; i++)
//            {
//                var item = datas[i];
//                FlowContext contextnew = context.Clone();
//                contextnew.SetParamValue("item", item);

//                await this.fee2817a83eff40f08d1e4985eea47130(contextnew);

//                if (contextnew.IsBreak)
//                {
//                    break;
//                }

//                JsonObject j = new JsonObject();
//                j["index"] = i;
//                if (contextnew.ReturnMsg == null)
//                {
//                    j["msg"] = null;
//                } else if (contextnew.ReturnMsg is JsonNode jnode)
//                {
//                    j["msg"] = jnode;
//                } else
//                {
//                    j["msg"] = contextnew.ReturnMsg.ToString();
//                }
//                reust.Add(j);
//            }
//            context.SetParamValue("result", reust);
//            await this.fd2d18a166625436aba9c13886803d2ee(context);
//        }
//        private async Task fee2817a83eff40f08d1e4985eea47130(FlowContext context)
//        {
//            await this.feed44aedcbf44afba46a7ca5423a35d8(context);
//        }
//        private async Task feed44aedcbf44afba46a7ca5423a35d8(FlowContext context)
//        {
//            bool v = Convert.ToBoolean(expeed44aedcbf44afba46a7ca5423a35d8(context));
//            if (v)
//            {
//                await this.fce4e078d30ff451281b2201962ab7ad0(context);
//            } else
//            {
//                await this.fed97b396de154804a51142cfda717681(context);
//            }
//        }
//        private async Task fce4e078d30ff451281b2201962ab7ad0(FlowContext context)
//        {
//            context["home"] = item["Province"].ToString() + item["City"].ToString() + item["County"].ToString() + item["Town"].ToString() + item["Street"].ToString();
//            await this.fd3bab763236144728fbdf257c1aa67ec(context);
//        }
//        private async Task fd3bab763236144728fbdf257c1aa67ec(FlowContext context)
//        {
//            context.ReturnMsg = context.GetParamValue("home");
//            context.IsBreak = true;
//        }
//        private async Task fed97b396de154804a51142cfda717681(FlowContext context)
//        {
//        }
//        private object expeed44aedcbf44afba46a7ca5423a35d8(FlowContext context)
//        {
//            return item["AddressType"].GetValue<int>() == 3;
//        }
//        private async Task fd2d18a166625436aba9c13886803d2ee(FlowContext context)
//        {
//            context.ReturnMsg = context.GetParamValue("result");
//            context.IsBreak = true;
//        }
//    }
//}