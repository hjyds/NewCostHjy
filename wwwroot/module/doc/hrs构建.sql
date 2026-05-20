Create Or Replace Procedure Zl_Hrssvr_Cedit(Json_In Clob) As
  --功能：诊疗项目管理
  j_Input Pljson;
  j_Json  Pljson;

  n_功能 Number(3); --1-新增,2-修改，3-删除

  n_记录id           诊疗项目目录.Id%Type;
  n_分类id           诊疗项目目录.Id%Type;
  v_类别             诊疗项目目录.类别%Type;
  v_编码             诊疗项目目录.编码%Type;
  v_名称             诊疗项目目录.名称%Type;
  v_名称拼音         诊疗项目别名.简码%Type;
  v_名称五笔         诊疗项目别名.简码%Type;
  v_别名             诊疗项目目录.名称%Type;
  v_别名拼音         诊疗项目别名.简码%Type;
  v_别名五笔         诊疗项目别名.简码%Type;
  v_操作类型         诊疗项目目录.操作类型%Type;
  n_执行频率         诊疗项目目录.执行频率%Type;
  n_单独应用         诊疗项目目录.单独应用%Type;
  n_计算方式         诊疗项目目录.计算方式%Type;
  v_计算单位         诊疗项目目录.计算单位%Type;
  n_适用性别         诊疗项目目录.适用性别%Type;
  n_执行安排         诊疗项目目录.执行安排%Type;
  n_服务对象         诊疗项目目录.服务对象%Type;
  n_组合项目         诊疗项目目录.组合项目%Type;
  v_标本部位         诊疗项目目录.标本部位%Type;
  n_手术操作id       疾病诊断对照.疾病id%Type;
  n_执行科室         诊疗项目目录.执行科室%Type;
  n_门诊执行         诊疗执行科室.执行科室id%Type;
  n_住院执行         诊疗执行科室.执行科室id%Type;
  v_定向执行         Varchar2(2000);
  n_参考目录id       诊疗项目目录.参考目录id%Type;
  v_应用范围         Number := 0;
  n_录入限量         诊疗项目目录.录入限量%Type;
  v_限量范围         Number := 0;
  n_执行标记         诊疗项目目录.执行标记%Type;
  n_执行分类         诊疗项目目录.执行分类%Type;
  v_站点             诊疗项目目录.站点%Type;
  v_项目频率         Varchar2(2000);
  n_计算规则         诊疗项目目录.计算规则%Type;
  v_使用科室         Varchar2(4000);
  v_使用科室应用范围 Number := 0;
  v_First            Number := 1;
  n_计算系数         诊疗项目目录.计算系数%Type;
  v_输血检验对照     Varchar2(4000);
  v_诊疗频率编码     Varchar2(4000);
  v_原始id           诊疗项目目录.Id%Type;
  v_试管编码         诊疗项目目录.试管编码%Type;
  n_适用体检         诊疗项目目录.适用体检%Type;
  v_给药大类         诊疗项目目录.给药大类%Type;
  d_启用时间         诊疗项目目录.启用时间%Type;
  v_指标互认         诊疗项目目录.指标互认%Type;
  v_手术操作ids      Varchar2(4000);
  n_按规则计费       诊疗项目目录.按规则计费%Type;
  v_量表学科         诊疗项目目录.量表学科%Type;

  v_机器名     Varchar2(3000);
  v_操作员信息 Varchar2(3000);
  v_用户名     Varchar2(300);

Begin

  --记录入参信息
  --Select Log_Info_Ex From Zlloginfo Where Call_Name = 'HJY_HRS_PRO';
  Zltools.Zlloginfo_Insert(Log_Level_In => Null, Server_In => Null, User_Name_In => Null, Session_Id_In => Null,
                           Ip_In => Null, Station_In => Null, Process_Id_In => Null, Process_Name_In => Null,
                           Category_Name_In => Null, Component_Name_In => Null, Module_Name_In => Null,
                           Function_Name_In => Null, Call_Name_In => 'HJY_HRS_PRO', Stage_In => Null,
                           Log_Info_In => Null, Log_Info_Ex_In => Json_In);

  Select Sys_Context('USERENV', 'HOST') Into v_机器名 From Dual;

  --解析入参信息
  j_Input  := Pljson(Json_In);
  j_Json   := j_Input;
  n_功能   := j_Json.Get_Number('功能');
  n_记录id := j_Json.Get_Number('记录id');

  v_操作员信息 := j_Json.Get_String('UserName') || '|' || j_Json.Get_String('AccountName') || '|' ||
             j_Json.Get_String('staff_id');
  v_用户名     := j_Json.Get_String('AccountName');

  If 3 = n_功能 Then
    --删除诊疗项目
    Select a.名称, a.编码 Into v_名称, v_编码 From 诊疗项目目录 A Where a.Id = n_记录id;
    Zl_诊疗项目_Delete(n_记录id);
    For R In (Select Max(b.报告项目id) 所见项目id, Count(1) As 记录数
              From 诊疗项目目录 A, 检验报告项目 B
              Where a.Id = b.诊疗项目id And a.Id = n_记录id) Loop
      If 1 = r.记录数 Then
        Zl_所见项目_Delete(r.所见项目id);
      End If;
    End Loop;
    Zl_Zlauditlog_Insert(v_用户名, v_机器名, 3, 100, '1054', '删除项目', '编码:' || v_编码 || ',名称:' || v_名称, v_操作员信息);
    Return;
  End If;

  v_类别         := j_Json.Get_String('诊疗类别');
  n_分类id       := j_Json.Get_Number('分类id');
  v_编码         := j_Json.Get_String('编码');
  v_名称         := j_Json.Get_String('名称');
  v_名称拼音     := j_Json.Get_String('简码');
  v_名称五笔     := j_Json.Get_String('简码五笔');
  v_别名         := j_Json.Get_String('别名');
  v_别名拼音     := j_Json.Get_String('别名简码');
  v_别名五笔     := j_Json.Get_String('别名简码五笔');
  v_操作类型     := j_Json.Get_String('操作类型');
  n_执行频率     := j_Json.Get_Number('执行频率');
  n_单独应用     := j_Json.Get_Number('单独应用');
  n_计算方式     := j_Json.Get_Number('计算方式');
  v_计算单位     := j_Json.Get_String('计算单位');
  n_适用性别     := j_Json.Get_Number('适用性别');
  n_执行安排     := j_Json.Get_Number('执行安排');
  n_执行分类     := j_Json.Get_Number('执行分类');
  n_按规则计费   := j_Json.Get_Number('按规则计费');
  n_执行标记     := j_Json.Get_Number('执行标记');
  n_计算规则     := j_Json.Get_Number('计算规则');
  n_服务对象     := j_Json.Get_Number('服务对象');
  n_组合项目     := j_Json.Get_Number('组合项目');
  v_标本部位     := j_Json.Get_String('标本部位');
  n_参考目录id   := j_Json.Get_Number('参考项目id');
  v_站点         := j_Json.Get_String('站点');
  n_执行科室     := j_Json.Get_Number('执行科室');
  n_门诊执行     := j_Json.Get_Number('门诊执行科室id');
  n_住院执行     := j_Json.Get_Number('住院执行科室id');
  v_使用科室     := j_Json.Get_String('使用科室');
  v_指标互认     := j_Json.Get_String('指标互认');
  v_定向执行     := j_Json.Get_String('定向执行');
  v_手术操作ids  := j_Json.Get_String('手术操作ids');
  v_输血检验对照 := j_Json.Get_String('输血检验对照');
  n_适用体检     := j_Json.Get_Number('适用体检');
  n_录入限量     := j_Json.Get_Number('录入限量');
  d_启用时间     := To_Date(j_Json.Get_String('启用时间'), 'yyyy-mm-dd hh24:mi:ss');
  v_诊疗频率编码 := j_Json.Get_String('诊疗频率编码');
  n_计算系数     := j_Json.Get_Number('计算系数');
  v_给药大类     := j_Json.Get_String('给药大类');
  v_项目频率     := j_Json.Get_String('项目频率');

  If 1 = n_功能 Then
    --新增诊疗项目
    Select 诊疗项目目录_Id.Nextval Into n_记录id From Dual;
    Zl_诊疗项目_Insert(v_类别, n_分类id, n_记录id, v_编码, v_名称, v_名称拼音, v_名称五笔, v_别名, v_别名拼音, v_别名五笔, v_操作类型, n_执行频率, n_单独应用,
                   n_计算方式, v_计算单位, n_适用性别, n_执行安排, n_服务对象, n_组合项目, v_标本部位, n_手术操作id, n_执行科室, n_门诊执行, n_住院执行, v_定向执行,
                   n_参考目录id, v_应用范围, n_录入限量, v_限量范围, n_执行标记, n_执行分类, v_站点, v_项目频率, n_计算规则, v_使用科室, v_使用科室应用范围, v_First,
                   n_计算系数, v_输血检验对照, v_诊疗频率编码, v_原始id, v_试管编码, n_适用体检, v_给药大类, d_启用时间, v_指标互认, v_手术操作ids, n_按规则计费,
                   v_量表学科);
    Zl_诊疗项目属性_Delete(n_记录id);
    Zl_Zlauditlog_Insert(v_用户名, v_机器名, 1, 100, '1054', '增加/复制增加项目', '增加项目,项目编码:' || v_编码 || ',项目名称:' || v_名称, v_操作员信息);
  End If;

  If 2 = n_功能 Then
    --修改诊疗项目
    Zl_诊疗项目_Update(v_类别, n_分类id, n_记录id, v_编码, v_名称, v_名称拼音, v_名称五笔, v_别名, v_别名拼音, v_别名五笔, v_操作类型, n_执行频率, n_单独应用,
                   n_计算方式, v_计算单位, n_适用性别, n_执行安排, n_服务对象, n_组合项目, v_标本部位, n_手术操作id, n_执行科室, n_门诊执行, n_住院执行, v_定向执行,
                   n_参考目录id, 0, v_应用范围, n_录入限量, v_限量范围, n_执行标记, n_执行分类, v_站点, v_项目频率, n_计算规则, v_使用科室, v_使用科室应用范围,
                   v_First, n_计算系数, v_输血检验对照, v_诊疗频率编码, v_试管编码, n_适用体检, v_给药大类, 0, d_启用时间, v_指标互认, v_手术操作ids, n_按规则计费,
                   v_量表学科);
    Zl_诊疗项目属性_Delete(n_记录id);
    Zl_Zlauditlog_Insert(v_用户名, v_机器名, 2, 100, '1054', '修改项目', '项目名称:' || v_名称 || ',修改的有:需要执行安排:由【未勾选】修改为【勾选】;',
                         v_操作员信息);
  End If;

Exception
  When Others Then
    zl_ErrorCenter(SQLCode, SQLErrM);
End Zl_Hrssvr_Cedit;
/