namespace NewCostHjy.Models
{
    /// <summary>
    /// 医保管控对接，入参
    /// </summary>
    public class MedicalReviewApplyRequest
    {
        /// <summary>
        /// 病人ID
        /// </summary>
        public long PatientId { get; set; }

        /// <summary>
        /// 主页ID
        /// </summary>
        public long HomepageId { get; set; }

        /// <summary>
        /// 处理说明
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// 申请人ID
        /// </summary>
        public long ApplicantId { get; set; }

        /// <summary>
        /// 申请人
        /// </summary>
        public string Applicant { get; set; }
    }

    /// <summary>
    /// 医保管控对接，出参
    /// </summary>
    public class MedicalReviewApplyResponse
    {
        /// <summary>
        /// 申请记录ID
        /// </summary>
        public string RecordId { get; set; }
    }

    /// <summary>
    /// 撤销审核
    /// </summary>
    public class MedicalReviewCancelRequest
    {
        /// <summary>医保审核记录ID。</summary>
        public string ReviewId { get; set; }

        /// <summary>患者主键ID。</summary>
        public long PatientId { get; set; }

        /// <summary>病案主页ID。</summary>
        public long HomepageId { get; set; }

        /// <summary>撤销原因，必填。</summary>
        public string Description { get; set; }

        /// <summary>撤销操作员ID。</summary>
        public long? CancelerId { get; set; }

        /// <summary>撤销操作员姓名。</summary>
        public string Canceler { get; set; }
    }

}
