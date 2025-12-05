using NewCostHjy.Models;

namespace NewCostHjy.Common {
    public interface IRequestQueueService
    {
        /// <summary>
        /// 判断字典是否存在
        /// </summary>
        /// <param name="strKey"></param>
        /// <returns></returns>
        bool IsListDicExist(string strKey);

        /// <summary>
        /// 通过key值获取字典的值，并删除字典
        /// </summary>
        /// <param name="strKey"></param>
        /// <returns></returns>
        string GetListDicValue(string strKey);

        /// <summary>
        /// 添加入参到队列
        /// </summary>
        /// <param name="requestQueue"></param>
        void AddRequestQueueToQueue(RequestQueue requestQueue);

        /// <summary>
        /// 执行队列
        /// </summary>
        void ExecuteQueue();
    }
}
