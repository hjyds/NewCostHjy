using Newtonsoft.Json;
using System;
using ZLSoft.Plugins.Interface;

namespace NewCostHjy.BLL.zlHisCom {
    public class ZLHISHelper {
        //如果动态创建不起这里不会出错，但后面调用方法会出错
        public static object progDynamic = null;
        private static string msgInit = "";
        private bool redoFunc = false;

        ~ZLHISHelper()
        {
            //释放COM对象
            //if (progDynamic != null)
            //{
            //    try
            //    {
            //        Marshal.ReleaseComObject(progDynamic);
            //        progDynamic = null;
            //    } catch (Exception ex)
            //    {
            //        //记录错误日志
            //        FileOperate.SaveStringToFile(ex.Message + "\r\n" + ex.StackTrace + "\r\n", GetLogPath());
            //    }
            //}
        }

        /// <summary>
        /// 重新动态创建部件并登录初始化
        /// </summary>
        /// <returns></returns>
        private bool ReInitHelper(Exception ex)
        {
            string result = "";

            //RPC 服务器不可用。 (0x800706BA)
            if (ex.Message.ToUpper().Contains("800706BA") && msgInit != "")
            {
                try
                {
                    result = UserLogin(msgInit);
                } catch { }
            }

            bool temp = false;

            return temp;
        }

        /// <summary>
        /// 当前客户端用户登录连接
        /// </summary>
        /// <param name="msg">{ip:"",port:"",sid:"",user:"",pwd:""}</param>
        /// <returns></returns>
        public string UserLogin(string msg)
        {
            msgInit = msg;
            try
            {
                //重新登录杀掉原进程重新创建
                System.Diagnostics.Process[] exes = System.Diagnostics.Process.GetProcessesByName("zlOnePaperHelper");
                try
                {
                    if (exes.Length > 0) exes[0].Kill();
                } catch (Exception ex)
                {
                    //记录错误日志：有时会出现"拒绝访问。"错误，但进程还是杀死了。
                    FileOperate.SaveStringToFile(ex.Message + "\r\n" + ex.StackTrace + "\r\n", GetLogPath());
                } finally
                {
                    progDynamic = Activator.CreateInstance(Type.GetTypeFromProgID("zlOnePaperHelper.clsHelper"));
                }

                dynamic msgJson = JsonConvert.DeserializeObject(msg);
                object[] pars = { msgJson.ip, msgJson.port, msgJson.sid, msgJson.user, msgJson.pwd };
                string result = (string)progDynamic.GetType().InvokeMember("UserLogin", System.Reflection.BindingFlags.InvokeMethod, null, progDynamic, pars);
                return result;
            } catch (Exception ex)
            {
                //如果DLL中发生运行时错误，动态创建对象的方法后续仍然可以正常执行(和VB不一样，不会引起上层崩溃)

                //记录错误日志
                FileOperate.SaveStringToFile(ex.Message + "\r\n" + ex.StackTrace + "\r\n", GetLogPath());

                if (ex.Message.ToUpper().Contains("800706BF") && !redoFunc)
                {
                    //检索 COM 类工厂中 CLSID 为 {CCAD5E9C-E3C7-4040-B0B2-97BB56A37BB4} 的组件失败，原因是出现以下错误: 800706bf 远程过程调用失败且未执行。 (异常来自 HRESULT:0x800706BF)。
                    //动态重新创建COM部件失败，再试一次
                    redoFunc = true;
                    return UserLogin(msg);
                } else
                {
                    redoFunc = false;
                    msgInit = "";
                    return "";
                }
            }
        }



        /// <summary>
        /// 获取是否启用插件
        /// </summary>
        /// <returns>返回插件功能名称，格式参见ZLHIS文档</returns>
        public string CheckPlugIn()
        {
            try
            {
                string result = (string)progDynamic.GetType().InvokeMember("CheckPlugIn", System.Reflection.BindingFlags.InvokeMethod, null, progDynamic, null);
                return result;
            } catch (Exception ex)
            {
                //记录错误日志
                FileOperate.SaveStringToFile(ex.Message + "\r\n" + ex.StackTrace + "\r\n", GetLogPath());

                if (ReInitHelper(ex) && !redoFunc)
                {
                    redoFunc = true;
                    return CheckPlugIn();
                } else
                {
                    redoFunc = false;
                    return "";
                }
            }
        }


        /// <summary>
        /// 检查医保部件是否启用
        /// </summary>
        /// <returns>/returns>
        public string CheckInsure()
        {
            try
            {
                string result = (string)progDynamic.GetType().InvokeMember("CheckInsure", System.Reflection.BindingFlags.InvokeMethod, null, progDynamic, null);
                return result;
            } catch (Exception ex)
            {
                //记录错误日志
                FileOperate.SaveStringToFile(ex.Message + "\r\n" + ex.StackTrace + "\r\n", GetLogPath());

                if (ReInitHelper(ex) && !redoFunc)
                {
                    redoFunc = true;
                    return CheckInsure();
                } else
                {
                    redoFunc = false;
                    return "";
                }
            }
        }
        /// <summary>
        /// 检查挂号功能是否启用
        /// </summary>
        /// <returns>/returns>
        public string CheckReg()
        {
            try
            {
                string result = (string)progDynamic.GetType().InvokeMember("CheckReg", System.Reflection.BindingFlags.InvokeMethod, null, progDynamic, null);
                return result;
            } catch (Exception ex)
            {
                //记录错误日志
                FileOperate.SaveStringToFile(ex.Message + "\r\n" + ex.StackTrace + "\r\n", GetLogPath());

                if (ReInitHelper(ex) && !redoFunc)
                {
                    redoFunc = true;
                    return CheckReg();
                } else
                {
                    redoFunc = false;
                    return "";
                }
            }
        }

        /// <summary>
        /// 检查预约挂号功能是否启用
        /// </summary>
        /// <returns>/returns>
        public string CheckBespeak()
        {
            try
            {
                string result = (string)progDynamic.GetType().InvokeMember("CheckBespeak", System.Reflection.BindingFlags.InvokeMethod, null, progDynamic, null);
                return result;
            } catch (Exception ex)
            {
                //记录错误日志
                FileOperate.SaveStringToFile(ex.Message + "\r\n" + ex.StackTrace + "\r\n", GetLogPath());

                if (ReInitHelper(ex) && !redoFunc)
                {
                    redoFunc = true;
                    return CheckBespeak();
                } else
                {
                    redoFunc = false;
                    return "";
                }
            }
        }



        /// <summary>
        /// 通用服务调用
        /// </summary>
        /// <param name="action">调用功能</param>
        /// <param name="msg">调用入参</param>
        /// <returns></returns>
        public string ExecFunc(string action, string msg)
        {
            try
            {
                object[] pars = { action, msg };
                string result = (string)progDynamic.GetType().InvokeMember("ExecFunc", System.Reflection.BindingFlags.InvokeMethod, null, progDynamic, pars);
                return result;
            } catch (Exception ex)
            {
                //记录错误日志
                FileOperate.SaveStringToFile(ex.Message + "\r\n" + ex.StackTrace + "\r\n", GetLogPath());

                if (ReInitHelper(ex) && !redoFunc)
                {
                    redoFunc = true;
                    return ExecFunc(action, msg);
                } else
                {
                    redoFunc = false;
                    return "";
                }
            }
        }

        private string GetLogPath()
        {
            return AppDomain.CurrentDomain.BaseDirectory + "\\log-data\\com-" + DateTime.Now.ToString("yyyy-MM-dd") + ".log";
        }
    }
}
