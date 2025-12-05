using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using NewCostHjy.Models;
using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace  NewCostHjy.Common {
    public class InitCISHostedService : IHostedService
    {
        private readonly ICISComponentService _cisComponentService;
        private readonly ILogger _logger;

        /// <summary>
        /// 重启动定时器
        /// </summary>
        private Timer _restartTimer;

        /// <summary>
        /// 日志存放路径
        /// </summary>
        private readonly string dir = System.AppDomain.CurrentDomain.BaseDirectory + "logs";

        /// <summary>
        /// PDF存放路径
        /// </summary>
        private readonly string _pdfPath = System.AppDomain.CurrentDomain.BaseDirectory + "PDF";

        /// <summary>
        /// 配置信息
        /// </summary>
        private readonly ConfigInfo _configInfo;

        public InitCISHostedService(ICISComponentService cisComponentService, ILogger<InitCISHostedService> logger, IOptions<ConfigInfo> configInfo)
        {
            _cisComponentService = cisComponentService;
            _logger = logger;
            _configInfo = configInfo.Value;

        }
        public Task StartAsync(CancellationToken cancellationToken)
        {
            // 检查文件夹是否存在
            string strFilePath = System.AppDomain.CurrentDomain.BaseDirectory + "PDF\\EMR";
            if (!System.IO.Directory.Exists(strFilePath))
            {
                System.IO.Directory.CreateDirectory(strFilePath);
            }
            strFilePath = System.AppDomain.CurrentDomain.BaseDirectory + "PDF\\Report";
            if (!System.IO.Directory.Exists(strFilePath))
            {
                System.IO.Directory.CreateDirectory(strFilePath);
            }
            strFilePath = System.AppDomain.CurrentDomain.BaseDirectory + "PDF\\R3K";
            if (!System.IO.Directory.Exists(strFilePath))
            {
                System.IO.Directory.CreateDirectory(strFilePath);
            }
            _logger.LogInformation("启动服务时初始化CIS组件");
            _cisComponentService.InitPrint();
            _logger.LogInformation("启动服务时初始化CIS组件完成");
            // 设置定时任务
            //_delTimer = new Timer(DeleteOldFiles, null, TimeSpan.Zero, TimeSpan.FromDays(_configInfo.LogDays));
            // 删除遗留文件
            new Task(DeleteOldFiles).Start();

            // 设置重启定时任务
            _restartTimer = new Timer(Restart, null, TimeSpan.Zero, TimeSpan.FromSeconds(1));

            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogInformation("停止服务时释放CIS组件");
            _cisComponentService.ReleaseObject();
            _logger.LogInformation("停止服务时释放CIS组件完成");
            // 停止定时任务
            _restartTimer?.Change(Timeout.Infinite, 0);
            return Task.CompletedTask;
        }

        /// <summary>
        /// 删除文件夹中nDays天以前的文件
        /// </summary>
        /// <param name="dir"></param>
        /// <param name="days"></param>
        private void DeleteOldFiles()
        {
            try
            {
                if (!Directory.Exists(dir) || _configInfo.LogDays < 1) return;
                _logger.LogInformation("启动服务时清空历史文件（日志和PDF）开始");
                var now = DateTime.Now;
                string infoPath = dir + "\\LogInfo";
                string errorPath = dir + "\\LogError";
                string emrPath = _pdfPath + "\\EMR";
                string r3kPath = _pdfPath + "\\R3K";
                string reportPath = _pdfPath + "\\Report";
                foreach (var f in Directory.GetFileSystemEntries(infoPath).Where(f => File.Exists(f)))
                {
                    var t = File.GetCreationTime(f);

                    var elapsedTicks = now.Ticks - t.Ticks;
                    var elapsedSpan = new TimeSpan(elapsedTicks);

                    if (elapsedSpan.TotalDays > _configInfo.LogDays) File.Delete(f);
                }
                foreach (var f in Directory.GetFileSystemEntries(errorPath).Where(f => File.Exists(f)))
                {
                    var t = File.GetCreationTime(f);

                    var elapsedTicks = now.Ticks - t.Ticks;
                    var elapsedSpan = new TimeSpan(elapsedTicks);

                    if (elapsedSpan.TotalDays > _configInfo.LogDays) File.Delete(f);
                }
                foreach (var f in Directory.GetFileSystemEntries(emrPath).Where(f => File.Exists(f)))
                {
                    var t = File.GetCreationTime(f);

                    var elapsedTicks = now.Ticks - t.Ticks;
                    var elapsedSpan = new TimeSpan(elapsedTicks);

                    if (elapsedSpan.TotalDays > _configInfo.PdfDays) File.Delete(f);
                }
                foreach (var f in Directory.GetFileSystemEntries(r3kPath).Where(f => File.Exists(f)))
                {
                    var t = File.GetCreationTime(f);

                    var elapsedTicks = now.Ticks - t.Ticks;
                    var elapsedSpan = new TimeSpan(elapsedTicks);

                    if (elapsedSpan.TotalDays > _configInfo.PdfDays) File.Delete(f);
                }
                foreach (var f in Directory.GetFileSystemEntries(reportPath).Where(f => File.Exists(f)))
                {
                    var t = File.GetCreationTime(f);

                    var elapsedTicks = now.Ticks - t.Ticks;
                    var elapsedSpan = new TimeSpan(elapsedTicks);

                    if (elapsedSpan.TotalDays > _configInfo.PdfDays) File.Delete(f);
                }
                _logger.LogInformation("启动服务时清空历史文件（日志和PDF）结束");
            }
            catch (Exception)
            {
                // ignored
            }
        }

        /// <summary>
        /// 定时任务（重启程序）
        /// </summary>
        /// <param name="dir"></param>
        /// <param name="days"></param>
        private void Restart(object state)
        {
            try
            {
                string dateTime = DateTime.Now.ToString("HH:mm:ss");
                if (dateTime != _configInfo.RestartTime) return;
                // 通过命令行重启程序
                Process.Start("restart.bat");
                // 退出进程
                Environment.Exit(0);
            }
            catch (Exception ex)
            {
                _logger.LogError("重启程序发生异常：" + ex.Message);
            }
        }
    }
}
