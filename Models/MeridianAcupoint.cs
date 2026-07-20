using System.Collections.Generic;

namespace NewCostHjy.Models
{
    public class MeridianAcupoint
    {
        /// <summary>
        /// 总
        /// </summary>
        public string chapterCode { get; set; }
        /// <summary>
        /// 名称
        /// </summary>
        public string chapterName { get; set; }

        public List<MeridianAcupointItem> children { get; set; }
    }


    public class ChildrenItem
    {
        /// <summary>
        /// 
        /// </summary>
        public string pointCode { get; set; }
        /// <summary>
        /// 中府
        /// </summary>
        public string pointName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string pinyin { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string stdCode { get; set; }
        /// <summary>
        /// 在前胸部，横平第1肋间隙，锁骨下窝外侧，前正中线旁开6寸。注1：先确定云门(LU2).中府即在云门(LU2)下1寸。注2：横平内侧的库房(ST14)、彧中(KI26)、华盖(CV20)，穴略呈一弧形分布，其弧度与第1肋间隙弧度相应。
        /// </summary>
        public string location { get; set; }
         
    }

    public class MeridianAcupointItem
    {
        /// <summary>
        /// 
        /// </summary>
        public string chapterCode { get; set; }
        /// <summary>
        /// 手太阴肺经穴
        /// </summary>
        public string chapterName { get; set; }
        /// <summary>
        /// 手太阴肺经
        /// </summary>
        public string meridianName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public List<ChildrenItem> children { get; set; }
    }


    public class ChildrenItemTable
    {

        /// <summary>
        /// 上级编码
        /// </summary>
        public string PCode { get; set; }

        /// <summary>
        /// 编码 chapterCode  pointCode
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// 名称  chapterName，pointName
        /// </summary>
        public string Name { get; set; }

        public string MeridianName { get; set; }

        /// <summary>
        /// 编码  ，
        /// </summary>
        public string pointCode { get; set; } 
        /// <summary>
        /// 名称，
        /// </summary>
        public string pointName { get; set; } 
        /// <summary>
        /// 
        /// </summary>
        public string pinyin { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string stdCode { get; set; }
        /// <summary>
        /// 在前胸部，横平第1肋间隙，锁骨下窝外侧，前正中线旁开6寸。注1：先确定云门(LU2).中府即在云门(LU2)下1寸。注2：横平内侧的库房(ST14)、彧中(KI26)、华盖(CV20)，穴略呈一弧形分布，其弧度与第1肋间隙弧度相应。
        /// </summary>
        public string location { get; set; }

    }

}
