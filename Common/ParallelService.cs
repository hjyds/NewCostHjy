using Microsoft.AspNetCore.Mvc.ApiExplorer;
using NewCostHjy.BLL;
using NewCostHjy.Models;
using OnePaperModel;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace NewCostHjy.Common {
    public class ParallelService {

        public async Task<string> DLUrlBatMain(List<JTYSQYJPG> lstIn)
        {
            ImageDownloader downloader = new ImageDownloader();
            // 示例用法

            foreach (JTYSQYJPG item in lstIn)
            {


                string imageUrl = "https://picsum.photos/800/600"; // 示例图片URL
                string savePath = @"C:\Downloads\downloaded_image.jpg"; // 保存路径

                imageUrl=item.url;
                savePath = @"D:\Download\pic_temp\" + item.name;

                // 异步下载（推荐）
                bool success = await downloader.DownloadImageAsync(imageUrl, savePath);
            }
            //if (success)
            //{
            //    Console.WriteLine("下载完成！");
            //} else
            //{
            //    Console.WriteLine("下载失败！");
            //}
            return "1";
        }

        public void DLUrlBatMainOut(List<JTYSQYJPG> lstIn)
        {
            _ = DLUrlBatMain(lstIn);
        }


        // 异步并行版本
        public async Task<List<TraceDrugItem>> GetLargDataParallelAsync(List<TraceDrugItem> lst)
        {
            FunTestCom funTestCom = new FunTestCom();
            var tasks = new List<Task<TraceDrugItem>>();

            // 创建并行任务集合
            foreach (var item in lst)
            {
                tasks.Add(Task.Run(() => funTestCom.GetLargDataOne(item)));
            }

            // 等待所有任务完成
            var results = await Task.WhenAll(tasks);

            return new List<TraceDrugItem>(results);
        }

        // 同步并行版本
        public List<TraceDrugItem> GetLargDataParallel(List<TraceDrugItem> lst)
        {
            var results = new System.Collections.Concurrent.ConcurrentBag<TraceDrugItem>();

            FunTestCom funTestCom = new FunTestCom();

            Parallel.ForEach(lst, item =>
            {
                var processed = funTestCom.GetLargDataOne(item);
                results.Add(processed);
            });

            return new List<TraceDrugItem>(results);
        }

        public static async Task MainHjy()
        {
            // 并行处理数据
            var data = new ConcurrentBag<string>();
            Parallel.For(0, 10, i => data.Add(ProcessItem(i)));

            // 异步任务组合
            var taskA = Task.Run(() => LongOperation("A"));
            var taskB = Task.Run(() => LongOperation("B"));
            await Task.WhenAll(taskA, taskB);

            Console.WriteLine($"Results: {string.Join(",", data)}");
        }

        static string ProcessItem(int id) => $"Item_{id}";
        static string LongOperation(string name) => $"Done_{name}";


        public static async Task MainHjy2()
        {
            // 1. 并行任务执行
            var results = new ConcurrentDictionary<int, string>();
            Parallel.For(0, 10, i => {
                results[i] = ProcessData(i);
            });

            // 2. 异步任务组合
            var task1 = Task.Run(() => FetchApiData("api/users"));
            var task2 = Task.Run(() => ReadDatabase());

            try
            {
                await Task.WhenAll(task1, task2);
                Console.WriteLine($"API结果:{task1.Result} | DB结果:{task2.Result}");
            } catch (AggregateException ex)
            {
                Console.WriteLine($"错误:{ex.Flatten().Message}");
            }

            // 3. 带取消的任务
            var cts = new CancellationTokenSource();
            var longTask = Task.Run(() => LongRunningOperation(cts.Token), cts.Token);
            await Task.Delay(1000);
            cts.Cancel();
        }

        static string ProcessData(int id) => $"processed_{id}";
        static string FetchApiData(string url) => "api_response";
        static string ReadDatabase() => "db_records";
        static void LongRunningOperation(CancellationToken token)
        {
            while (!token.IsCancellationRequested)
            {
                Thread.Sleep(100);
            }
        }

    }
}
