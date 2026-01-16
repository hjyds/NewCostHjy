using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Text; 

namespace NewCostHjy.BLL
{
    /// <summary>
    /// 验证相关与VB6窗体通相关的类,发送消息等,必须发布后用管理员身份运行方可生效 
    /// </summary>
    public partial class MsgSdToVBFrm 
    {
        // Windows API 导入
        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        public static extern IntPtr FindWindow(string lpClassName, string lpWindowName); 

        [DllImport("User32.dll")]
        public static extern int SendMessage(IntPtr hwnd, int msg, int wParam, ref COPYDATASTRUCT lParam);
 

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

        // 委托定义
        public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

        // 结构体定义
        public struct COPYDATASTRUCT
        {
            public IntPtr dwData;
            public int cbData;
            public string lpData;
        }

        // 消息常量
        public const int WM_USER = 0x0400;
        public const int WM_MYMESSAGE = WM_USER + 1;
        public const int WM_COPYDATA = 0x004A;
        public const int WM_SETTEXT = 0x000C;

        public IntPtr GetWindowHandle(string key)
        {
            try
            {
                List<IntPtr> intPtrs = FindWindowsByKeyword(key);
                return intPtrs[0];
            } catch (Exception)
            {
                return IntPtr.Zero;
            }
         
            //IntPtr hWnd = intPtrs[0];
            //long decimalValue = hWnd.ToInt64();
            //return decimalValue;
        }

        public void SendCustomMessageByPtr(IntPtr hWnd)
        {
            try
            {


                string msg = "IsClosed";
                byte[] sarr = Encoding.Default.GetBytes(msg);
                COPYDATASTRUCT cds;
                cds.dwData = IntPtr.Zero;                                   //可以是任意值
                cds.cbData = sarr.Length;                               //指定lpData内存区域的字节数
                cds.lpData = msg;  //发送给目标窗口所在进程的数据
                SendMessage(hWnd, WM_MYMESSAGE, 0, ref cds);

                //SendMessage(hWnd, WM_MYMESSAGE, IntPtr.Zero, IntPtr.Zero);
            } catch (Exception)
            {


            }
        }

        //public void SendCustomMessageForTitleFrm(string key)
        //{
        //    List<IntPtr> intPtrs = FindWindowsByKeyword(key);

        //    if (intPtrs.Count == 0)
        //    {
        //        //Console.WriteLine("未找到VB6窗体，请确保VB6程序正在运行");
        //        return;
        //    }
        //    IntPtr hWnd = intPtrs[0];
        //    IntPtr result = SendMessage(hWnd, WM_MYMESSAGE, IntPtr.Zero, IntPtr.Zero);
        //}
        /// <summary>
        /// 约定好消息结构，ID,窗体句柄,消息内容,用户名,人员ID,创建时间,机器名
        /// </summary>
        //public void SendCustomMessage()
        //{
        //    IntPtr hWnd = FindWindow(null, "HJY_住院医生站");

        //    long decimalValue = hWnd.ToInt64();//用这个转换可以直接得到十进制数值和VB6中的句柄值一致

        //    if (hWnd == IntPtr.Zero)
        //    {
        //        //Console.WriteLine("未找到VB6窗体，请确保VB6程序正在运行");
        //        return;
        //    }

        //    IntPtr result = SendMessage(hWnd, WM_MYMESSAGE, IntPtr.Zero, IntPtr.Zero);
        //    //Console.WriteLine($"自定义消息发送结果: {result}");
        //}


        /// <summary>
        /// 根据标题关键字查找窗口句柄
        /// </summary>
        /// <param name="keyword">标题关键字</param>
        /// <param name="caseSensitive">是否区分大小写</param>
        /// <returns>匹配的窗口句柄列表</returns>
        public List<IntPtr> FindWindowsByKeyword(string keyword, bool caseSensitive = false)
        {
            List<IntPtr> result = new List<IntPtr>();
            string searchText = caseSensitive ? keyword : keyword.ToLower();

            EnumWindows((hWnd, lParam) =>
            {
                StringBuilder title = new StringBuilder(256);
                int length = GetWindowText(hWnd, title, title.Capacity);
                if (length > 0)
                {
                    string windowTitle = title.ToString();
                    if (caseSensitive)
                    {
                        if (windowTitle.Contains(keyword))
                        {
                            result.Add(hWnd);
                        }
                    } else
                    {
                        if (windowTitle.ToLower().Contains(searchText))
                        {
                            result.Add(hWnd);
                        }
                    }
                }
                return true; // 继续枚举
            }, IntPtr.Zero);
            return result;
        }


        /// <summary>
        /// 命令行方法打开执行命令
        /// </summary>
        /// <param name="command"></param>
        private void ExecuteCommand(string command)
        {
            //Process process = new Process();
            //process.StartInfo.FileName = command;
            //process.StartInfo.UseShellExecute = true;
            //process.StartInfo.CreateNoWindow = false;
            //process.Start();

            //ProcessStartInfo startInfo = new ProcessStartInfo
            //{
            //    FileName = command,
            //    UseShellExecute = true,
            //    CreateNoWindow = false
            //};

            //try
            //{
            //    Process.Start(startInfo);
            //} catch (Exception ex)
            //{
            //    Console.WriteLine($"执行失败: {ex.Message}");
            //}



            Process process = new Process();
            process.StartInfo.FileName = "cmd.exe"; // Windows命令行
            process.StartInfo.Arguments = $"/c {command}";
            process.StartInfo.RedirectStandardOutput = false;
            process.StartInfo.UseShellExecute = false;
            process.StartInfo.CreateNoWindow = true;

            process.Start();
            //string output = process.StandardOutput.ReadToEnd();
            //process.WaitForExit();

        }


        public void OpenZlhis()
        {
            string cmdStr = @"c:\appsoft\zlhis+.exe USER=zlhis PASS=aqa SERVER=ORCL PROGRAM=1261 病人ID=101 主页ID=1 SINGLEPATI=1 ISEMBED=1 ZLHISCRUSTCALL=1";
            ExecuteCommand(cmdStr);
        }


        //public static void SendSimpleText()
        //{
        //    IntPtr hWnd = FindWindow(null, "VB6消息接收器");
        //    if (hWnd == IntPtr.Zero)
        //    {
        //        Console.WriteLine("未找到VB6窗体，请确保VB6程序正在运行");
        //        return;
        //    }

        //    Console.Write("请输入要设置的文本: ");
        //    string text = Console.ReadLine();

        //    IntPtr result = SendMessage(hWnd, WM_SETTEXT, IntPtr.Zero, text);
        //    Console.WriteLine($"简单文本发送结果: {result}");
        //}
    }
}
