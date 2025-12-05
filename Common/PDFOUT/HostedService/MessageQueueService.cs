using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace  NewCostHjy.Common {
    public class MessageQueueService : BackgroundService
    {
        /// <summary>
        /// CIS调用服务
        /// </summary>
        private readonly ICISComponentService _cISComponentService;

        /// <summary>
        /// 消息队列服务
        /// </summary>
        private readonly IRequestQueueService _requestQueueService;

        private readonly ILogger _logger;

        public MessageQueueService(ICISComponentService cISComponentService, IRequestQueueService requestQueueService, ILogger<MessageQueueService> logger)
        {
            _cISComponentService = cISComponentService;
            _requestQueueService = requestQueueService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _requestQueueService.ExecuteQueue();
                    // 等待时间间隔
                    await Task.Delay(500, stoppingToken); // 每秒处理一次
                }
                catch(TaskCanceledException)
                {
                    _logger.LogInformation("关闭消息队列服务。");
                }
                catch (Exception ex)
                {
                    _logger.LogError("处理消息队列时发生异常：" + ex.Message);
                }
            }
        }
    }
}
