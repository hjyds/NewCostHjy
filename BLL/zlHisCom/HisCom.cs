using Microsoft.Win32;
using System.Diagnostics;
using System;
using System.Runtime.InteropServices;
using ZLSoft.Plugins.Interface;

namespace NewCostHjy.BLL.zlHisCom {
    public class HisCom : ICOM, IWritLog {
        private ZLHISHelper zlhisHelper;
        public HisCom()
        {
            zlhisHelper = new ZLHISHelper();
        }

        public string CallCOM(string action, string msg)
        {
            //置顶COM exe
            TopThisWindow("zlOnePaperHelper");
            string result = zlhisHelper.ExecFunc(action, msg);
            return result?.ToString();
        }

        public bool ReLoadCOM(string msg)
        {
            return true;
        }

        public static string GetRegistryValue(string path, string paramName)
        {
            string value = string.Empty;
            RegistryKey root = Registry.CurrentUser;
            RegistryKey rk = root.OpenSubKey(path);
            if (rk != null)
            {
                value = (string)rk.GetValue(paramName, null);
            }
            return value;
        }

        /// <summary>
        /// 运行进程
        /// </summary>
        /// <param name="process">直接写文件路径</param>
        /// <param name="argument">参数</param>
        public static void Run(string process, string argument = null)
        {
            try
            {
                if (string.IsNullOrEmpty(argument))
                    Process.Start(process);
                else
                    Process.Start(process, argument);
            } catch (Exception ex)
            {
                Console.WriteLine(process + " " + argument);
                Console.WriteLine(ex);
            }
        }

        public string InitCOM(string initPar)
        {
            //初始化用户连接
            string result = zlhisHelper.UserLogin(initPar);
            string machineName = Environment.MachineName;
            return result;
            //return JsonConvert.SerializeObject(new { result = result ? "1" : "0", checkplugin = strPlugIn, checkinsure = strInsure, checkreg = strReg, checkbespeak = strBespeak, machine = machineName });
        }

        /// <summary>
        /// 置顶当前进程
        /// </summary>
        private void TopThisWindow(string processName)
        {
            try
            {
                //找到指定的进程
                bool hasFound = false;
                Process processInfo = null;
                foreach (Process process in Process.GetProcesses())
                {
                    if (process.ProcessName == processName)
                    {
                        processInfo = process;
                        hasFound = true;
                        break;
                    }
                }
                if (!hasFound)
                {
                    return;
                }

                //移动到最前
                //if(processInfo.MainWindowHandle!=IntPtr.Zero) SwitchToThisWindow(processInfo.MainWindowHandle, true);
                if (processInfo.MainWindowHandle != IntPtr.Zero) SetWindowPos(processInfo.MainWindowHandle, -1, 0, 0, 0, 0, 1 | 2);
                if (processInfo.MainWindowHandle != IntPtr.Zero) SetWindowPos(processInfo.MainWindowHandle, -2, 0, 0, 0, 0, 1 | 2);
            } catch
            {
            }
        }
        [DllImport("user32.dll")]
        private static extern bool SetWindowPos(IntPtr hWnd, int hWndlnsertAfter, int X, int Y, int cx, int cy, uint Flags);

        public Log Logger { get; set; }
    }
}
