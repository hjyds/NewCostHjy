using System.Collections.Generic;
using System.ComponentModel;

namespace NewCostHjy.Models
{
    /// <summary>
    /// 门诊医嘱默认健康分类 入参
    /// </summary>
    public class MaternityHealthCategoryIn
    {
        /// <summary>
        /// 病人ID
        /// </summary>
        [DisplayName("病人ID")]
        public int PatId { get; set; }

        /// <summary>
        /// 产科分类ID
        /// </summary>
        [DisplayName("产科分类ID")]
        public string MaternityCategoryId { get; set; }

        /// <summary>
        /// 医嘱列表
        /// </summary>
        [DisplayName("医嘱列表")]
        public List<MaternityAdviceIn> AdviceList { get; set; }
    }

    /// <summary>
    /// 产科医嘱
    /// </summary>
    public class MaternityAdviceIn
    {
        /// <summary>
        /// 医嘱ID
        /// </summary>
        [DisplayName("医嘱ID")]
        public string AdviceId { get; set; }

        /// <summary>
        /// 返回的结果
        /// </summary>
        public string HealthCategoryId { get; set; }        

        /// <summary>
        /// 费用明细
        /// </summary>
        [DisplayName("费用明细")]
        public List<MaternityFeeDetailIn> FeeDetails { get; set; }
    }

    public class MaternityAdviceOut
    {
        /// <summary>
        /// 医嘱ID
        /// </summary>
        [DisplayName("医嘱ID")]
        public string AdviceId { get; set; }

        /// <summary>
        /// 返回的结果
        /// </summary>
        public string HealthCategoryId { get; set; }
          
    }

    /// <summary>
    /// 产科费用明细
    /// </summary>
    public class MaternityFeeDetailIn
    {
        /// <summary>
        /// 收费项目ID
        /// </summary>
        [DisplayName("收费项目ID")]
        public int ChargesId { get; set; }

        /// <summary>
        /// 数量
        /// </summary>
        [DisplayName("数量")]
        public int Quantity { get; set; }
    }

    public class BaseCostAudKeyIn
    {
        /// <summary>
        /// 
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PassWord { get; set; }
    }

    /// <summary>
    /// 费用基础服务的Toke模型（费用基础服务，生育医疗服务）
    /// </summary>
    public class BaseCostAudKey
    {
        /// <summary>
        /// 
        /// </summary>
        public string PersonId { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string PersonCode { get; set; }
        /// <summary>
        /// 管理员
        /// </summary>
        public string PersonName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int DeptId { get; set; }
        /// <summary>
        /// 眼科病房
        /// </summary>
        public string DeptName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public int IsAdmin { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string UserName { get; set; }
        /// <summary>
        /// 
        /// </summary>
        public string AudKey { get; set; }
    }

}
