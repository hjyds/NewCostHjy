using Microsoft.AspNetCore.Mvc;
using NewCostHjy.BLL;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using System;
using System.Collections.Generic; 

namespace NewCostHjy.Controllers {

    /// <summary>
    /// 通用的三方测试服务方法控制器其中返回值都是原样返回不经过ActionFilter处理，不用会去包装CODE SUCCESS 等结点
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class CalculateController : BaseController {

        /// <summary>
        /// 获医生站句柄
        /// </summary>
        /// <returns></returns>
        [HttpGet("GetWindhwd")]
        public IActionResult GetWindhwd()
        {
            MsgSdToVBFrm msgSdToVBFrm = new MsgSdToVBFrm();
            IntPtr hWnd = msgSdToVBFrm.GetWindowHandle("-住院医生工作站");
            long outval = hWnd.ToInt64();
            return Json(outval);
        }
        /// <summary>
        /// 左侧列表显示或者隐藏
        /// </summary>
        /// <param name="hwd"></param>
        /// <returns></returns>
        [HttpGet("SendAreaShow")]
        public IActionResult SendAreaShow(long hwd)
        {
            MsgSdToVBFrm msgSdToVBFrm = new MsgSdToVBFrm();
            IntPtr hWnd = msgSdToVBFrm.GetWindowHandle("-住院医生工作站");
            SysMessageRecord parIn = new SysMessageRecord();
            parIn.PersonId = 281;
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            parIn.WindowHandle = hWnd.ToInt64();
            parIn.MessageCode = "S002";
            zlhisInterfaceDAL.AddSysMessageRecord(parIn); 
            msgSdToVBFrm.SendCustomMessageByPtr(hWnd);
            return Json(1);
        }

        [HttpGet("OpenZlhis")]

        public IActionResult OpenZlhis()
        {
            MsgSdToVBFrm msgSdToVBFrm = new MsgSdToVBFrm();
            msgSdToVBFrm.OpenZlhis();
            return Json(1);
        }

        /// <summary>
        /// 切换病人
        /// </summary>
        /// <param name="hwd">句柄</param>
        /// <param name="pid">病人id</param>
        /// <param name="pvid">主页id</param>
        /// <returns></returns>
        [HttpGet("SelectPat")]

        public IActionResult SelectPat(long hwd, long pid, long pvid)
        {
            MsgSdToVBFrm msgSdToVBFrm = new MsgSdToVBFrm();
            IntPtr hWnd = msgSdToVBFrm.GetWindowHandle("-住院医生工作站");
            SysMessageRecord parIn = new SysMessageRecord();
            parIn.PersonId = 281;
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            parIn.WindowHandle = hWnd.ToInt64();
            parIn.MessageCode = "S001";
            parIn.PatientId = pid;
            parIn.VisitId = pvid;
            zlhisInterfaceDAL.AddSysMessageRecord(parIn); 
            msgSdToVBFrm.SendCustomMessageByPtr(hWnd);
            return Json(1);
        }

        /// <summary>
        /// 根据科室获取病人列表
        /// </summary>
        /// <param name="deptid"></param>
        /// <returns></returns>
        [HttpGet("GetPatList")]
        public IActionResult GetPatList(long deptid)
        {
            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            var outData = zlhisInterfaceDAL.GetPatListByDeptId(deptid);
            return Json(outData);
        }

        /// <summary>
        /// 发送消息
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("SendCustomMessage")]
        public IActionResult SendCustomMessage([FromBody] SysMessageRecord parIn)
        {          
            MsgSdToVBFrm msgSdToVBFrm = new MsgSdToVBFrm();
            IntPtr hWnd = msgSdToVBFrm.GetWindowHandle("-住院医生工作站");
            if (parIn.PersonId > 0)
            {
                ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
                parIn.WindowHandle = hWnd.ToInt64();
                zlhisInterfaceDAL.AddSysMessageRecord(parIn);
            }
            if(hWnd == IntPtr.Zero)
            {
                return Json(0);
            }
            msgSdToVBFrm.SendCustomMessageByPtr(hWnd);
            return Json(1);
        }

        /// <summary>
        /// DIP相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("CalculateDIPResult")]
        public IActionResult CalculateDIPResult([FromBody] DRGPARIN parIn)
        {
            //入参
            //{"ExecType":0,"PatiId":180,"PageId":1,"Scene":1,"PatiAge":9490,"PatiWeight":0,"IsNewborn":"0","PatiDischargeDate":"","SaveSign":"0","AppScen":"1","DiagInfos":[{"DiagCode":"T42.303","DiagName":"慢性支气管炎急性发作","SNO":1}],"OperationInfos":[{"OperationCode":"02.0601","OperationName":"胸腺修补术","SNO":1,"OperationTime":"2024-08-20 15:23:00"}]}
            List<DIPRsOut> lst = new List<DIPRsOut>();
            lst.Add(new DIPRsOut()); 
            return Json(lst);
        }

        /// <summary>
        /// DRG相关
        /// </summary>
        /// <param name="parIn"></param>
        /// <returns></returns>
        [HttpPost("CalculateDRGResultByHis")]
        public IActionResult CalculateDRGResultByHis([FromBody] DRGPARIN parIn)
        {
            //入参：
            //{"ExecType":0,"PatiId":101,"PageId":1,"Scene":1,"PatiAge":26645,"PatiWeight":0,"IsNewborn":"0","PatiDischargeDate":"","SaveSign":"0","AppScen":"1","DiagInfos":[{"DiagCode":"N15.901","DiagName":"肾感染","SNO":1},{"DiagCode":"A01.201","DiagName":"乙型副伤寒","SNO":2}],"OperationInfos":[]}
            DRGDataAttributes temp = new DRGDataAttributes();
            temp.otherGroupInfo = new DrgOtherGroupInfo();
            return Json(temp);
        }

    }



}
