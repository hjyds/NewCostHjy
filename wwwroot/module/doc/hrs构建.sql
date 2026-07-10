Create Or Replace Procedure Zl_Hrssvr_Cedit(Json_In Clob) As
  --功能：诊疗项目目录数据的增删改
  --              诊疗项目的收费对照数据编辑

  j_Input    Pljson;
  j_Json     Pljson;
  j_Json_Tmp Pljson;
  Jl_List    Pljson_List;
  Jl_Pacs    Pljson_List;
  j_Way      Pljson;
  n_Count    Number(3);

  n_功能 Number(3); --1-新增,2-修改，3-删除，4-停用，5-启用，6-采集方式设置
  --                        7-调整诊疗项目(计价性质)（按规则计费的方案处理）
  --                        8-诊疗收费对照，通用设置    
  --                        9-按范围删除收费对照
  --                        10-删除一行收费对照
  --                        11-插入一行收费对照  
  --                        12-新放射诊疗项目对照编辑一行

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
  v_检查部位   Varchar2(300);
  v_检查方法   Varchar2(300);
  v_上级方法   Varchar2(300);

  d_停用时间 Date;
  v_停用原因 Varchar2(300);
  v_启用原因 Varchar2(300);

  v_Jtemp Varchar2(4000);

  n_收费项目id 诊疗收费关系.收费项目id%Type;
  n_收费数量   诊疗收费关系.收费数量 %Type;
  n_固有对照   诊疗收费关系.固有对照%Type;
  n_按规格适配 诊疗收费关系.按规格适配%Type;
  n_从属项目   诊疗收费关系.从属项目%Type;
  n_收费方式   诊疗收费关系.收费方式%Type;
  n_方案id     诊疗收费关系.方案id%Type;
  n_病人来源   诊疗收费关系.病人来源%Type; --固定值0/1/2
  n_适用科室id 诊疗收费关系.适用科室id%Type;
  n_费用性质   诊疗收费关系.费用性质%Type;
  n_部位加收   诊疗收费关系.部位加收%Type;
  n_规则id     Number(18);
  n_计价性质   Number(3);

  v_Error Varchar2(255);
  Err_Custom Exception;

  --新放射收费对照(单行数据的，改，删，增)
  Procedure p_收费对照_放射 As
    v_分组名称 Varchar2(600);
    n_指定总量 放射收费关系.指定总量%Type;
    n_费用性质 放射收费关系.费用性质%Type;
    n_删除行   Number(3);
  Begin
    n_收费项目id := j_Json.Get_Number('old_收费项目id');
    If n_收费项目id > 0 Then
      n_费用性质 := j_Json.Get_Number('old_费用性质');
      v_检查部位 := j_Json.Get_String('old_检查部位');
      v_检查方法 := j_Json.Get_String('old_检查方法');
      Delete 放射收费关系 R
      Where r.诊疗项目id = n_记录id And r.收费项目id = n_收费项目id And Nvl(r.费用性质, 0) = n_费用性质 And
            Nvl(r.检查部位, 'NONE') = Nvl(v_检查部位, 'NONE') And Nvl(r.检查方法, 'NONE') = Nvl(v_检查方法, 'NONE');
    End If;
  
    n_收费项目id := j_Json.Get_Number('收费项目id');
    n_费用性质   := j_Json.Get_Number('费用性质');
    v_检查部位   := j_Json.Get_String('检查部位');
    v_检查方法   := j_Json.Get_String('检查方法');
  
    n_删除行 := j_Json.Get_Number('删除行');
  
    If n_删除行 = 1 Then
      Delete 放射收费关系 R
      Where r.诊疗项目id = n_记录id And r.收费项目id = n_收费项目id And Nvl(r.费用性质, 0) = n_费用性质 And
            Nvl(r.检查部位, 'NONE') = Nvl(v_检查部位, 'NONE') And Nvl(r.检查方法, 'NONE') = Nvl(v_检查方法, 'NONE');
      Return;
    End If;
  
    If Nvl(n_收费数量, 0) = 0 Then
      n_收费数量 := 1;
    End If;
  
    n_收费数量 := j_Json.Get_Number('收费数量');
    n_指定总量 := j_Json.Get_Number('指定总量');
    v_分组名称 := j_Json.Get_String('分组名称');
    n_收费方式 := j_Json.Get_Number('收费方式');
  
    Insert Into 放射收费关系
      (诊疗项目id, 收费项目id, 费用性质, 收费数量, 分组名称, 检查部位, 检查方法, 指定总量, 收费方式)
    Values
      (n_记录id, n_收费项目id, n_费用性质, n_收费数量, v_分组名称, v_检查部位, v_检查方法, n_指定总量, n_收费方式);
  
  End;

  Procedure p_收费对照_通用 As
    v_Type     Varchar2(20);
    v_科室ids  Varchar2(4000);
    n_对照方式 Number(3); --1-通用，2-部位，3-加收
  
    n_部位 Number(1) := 0;
    n_加收 Number(1) := 0; --床旁术中加收
    n_来源 Number(1) := 0;
  Begin
  
    n_病人来源   := j_Json.Get_Number('病人来源');
    n_对照方式   := j_Json.Get_Number('对照方式');
    v_科室ids    := j_Json.Get_String('科室ids');
    n_适用科室id := j_Json.Get_Number('科室id');
    n_收费项目id := j_Json.Get_Number('收费项目id');
    v_检查部位   := j_Json.Get_String('检查部位');
    v_检查方法   := j_Json.Get_String('检查方法');
  
    n_来源 := n_病人来源;
    If n_对照方式 = 2 Then
      n_部位 := 1;
    Elsif n_对照方式 = 3 Then
      n_加收 := 1;
    End If;
  
    Select a.类别, a.执行标记 Into v_类别, n_执行标记 From 诊疗项目目录 A Where a.Id = n_记录id;
  
    If Not (v_类别 = 'D' And n_执行标记 = 1) And n_加收 = 1 Then
      v_Error := '只有检查类项目才可以设置床旁或术中加收费用。';
      Raise Err_Custom;
    End If;
  
    If v_类别 <> 'D' And n_部位 = 1 Then
      v_Error := '只有检查类项目才可以设置部位方法费用。';
      Raise Err_Custom;
    End If;
  
    If 9 = n_功能 Then
      Delete 诊疗收费关系 R
      Where r.诊疗项目id = n_记录id And (0 = n_来源 And Nvl(r.适用科室id, 0) = 0 And Nvl(r.病人来源, 0) = 0 And
            (r.检查部位 Is Null And 0 = n_部位 Or r.检查部位 Is Not Null And 1 = n_部位) And
            (Nvl(r.费用性质, 0) = 0 And 0 = n_加收 Or r.费用性质 = 1 And 1 = n_加收) Or
            1 = n_来源 And Nvl(r.适用科室id, 0) = n_适用科室id And Nvl(r.病人来源, 0) = 1 And
            (r.检查部位 Is Null And 0 = n_部位 Or r.检查部位 Is Not Null And 1 = n_部位) And
            (Nvl(r.费用性质, 0) = 0 And 0 = n_加收 Or r.费用性质 = 1 And 1 = n_加收) Or
            2 = n_来源 And Nvl(r.适用科室id, 0) = n_适用科室id And Nvl(r.病人来源, 0) = 2 And
            (r.检查部位 Is Null And 0 = n_部位 Or r.检查部位 Is Not Null And 1 = n_部位) And
            (Nvl(r.费用性质, 0) = 0 And 0 = n_加收 Or r.费用性质 = 1 And 1 = n_加收));
      Return;
    End If;
  
    If 10 = n_功能 Then
      Delete 诊疗收费关系 R
      Where r.诊疗项目id = n_记录id And r.收费项目id = n_收费项目id And
            (0 = n_来源 And Nvl(r.适用科室id, 0) = 0 And Nvl(r.病人来源, 0) = 0 And
            (r.检查部位 Is Null And 0 = n_部位 Or r.检查部位 Is Not Null And 1 = n_部位) And
            (Nvl(r.费用性质, 0) = 0 And 0 = n_加收 Or r.费用性质 = 1 And 1 = n_加收) Or
            1 = n_来源 And Nvl(r.适用科室id, 0) = n_适用科室id And Nvl(r.病人来源, 0) = 1 And
            (r.检查部位 Is Null And 0 = n_部位 Or r.检查部位 Is Not Null And 1 = n_部位) And
            (Nvl(r.费用性质, 0) = 0 And 0 = n_加收 Or r.费用性质 = 1 And 1 = n_加收) Or
            2 = n_来源 And Nvl(r.适用科室id, 0) = n_适用科室id And Nvl(r.病人来源, 0) = 2 And
            (r.检查部位 Is Null And 0 = n_部位 Or r.检查部位 Is Not Null And 1 = n_部位) And
            (Nvl(r.费用性质, 0) = 0 And 0 = n_加收 Or r.费用性质 = 1 And 1 = n_加收));
      Return;
    End If;
  
    If 11 = n_功能 Then
      n_收费项目id := j_Json.Get_Number('old_收费项目id');
      If Nvl(n_收费项目id, 0) > 0 Then
        n_来源       := j_Json.Get_Number('old_病人来源');
        n_适用科室id := j_Json.Get_Number('old_科室id');
        v_检查部位   := j_Json.Get_String('old_检查部位');
        v_检查方法   := j_Json.Get_String('old_检查方法');
      
        --如果传旧的对照，则先删除
        Delete 诊疗收费关系 R
        Where r.诊疗项目id = n_记录id And r.收费项目id = n_收费项目id And Nvl(r.病人来源, 0) = n_来源 And Nvl(r.适用科室id, 0) = n_适用科室id And
              Nvl(r.费用性质, 0) = n_加收 And Nvl(r.检查部位, 'NONE') = Nvl(v_检查部位, 'NONE') And
              Nvl(r.检查方法, 'NONE') = Nvl(v_检查方法, 'NONE');
      
        --将值还回去
        n_来源 := n_病人来源;
      
        n_适用科室id := j_Json.Get_Number('科室id');
      End If;
    
      n_收费项目id := j_Json.Get_Number('收费项目id');
      n_收费数量   := j_Json.Get_Number('收费数量');
      n_固有对照   := j_Json.Get_Number('固有对照');
      n_按规格适配 := j_Json.Get_Number('按规格适配');
      n_从属项目   := j_Json.Get_Number('从属项目');
      n_收费方式   := j_Json.Get_Number('收费方式');
      n_方案id     := j_Json.Get_Number('方案id');
      n_适用科室id := j_Json.Get_Number('科室id');
    
      If Nvl(n_收费数量, 0) = 0 Then
        n_收费数量 := 1;
      End If;
    
      Select 类别 Into v_Type From 收费项目目录 Where ID = n_收费项目id;
    
      If Not (v_Type = '4' And n_收费方式 = 1 And n_按规格适配 = 1) Then
        n_按规格适配 := Null;
      End If;
    
      -- 收费方式=8 且方案id>0 才保留方案ID
      If Not (n_收费方式 = 8 And n_方案id > 0) Then
        n_方案id := Null;
      End If;
    
      n_费用性质 := 0;
      v_检查部位 := Null;
      v_检查方法 := Null;
      n_部位加收 := Null;
    
      If n_加收 = 1 Then
        n_费用性质   := 1;
        v_检查部位   := Null;
        v_检查方法   := Null;
        n_部位加收   := Null;
        n_按规格适配 := Null;
        n_方案id     := Null;
      End If;
    
      If n_部位 = 1 Then
        n_费用性质   := 0;
        v_检查部位   := j_Json.Get_String('检查部位');
        v_检查方法   := j_Json.Get_String('检查方法');
        n_部位加收   := j_Json.Get_Number('部位加收');
        n_按规格适配 := Null;
        n_方案id     := Null;
        If n_收费方式 Not In (0, 2, 9) Then
          n_收费方式 := 0;
        End If;
      
      End If;
    
      -- 最终插入
      Insert Into 诊疗收费关系
        (诊疗项目id, 收费项目id, 收费数量, 固有对照, 按规格适配, 从属项目, 费用性质, 检查部位, 检查方法, 收费方式, 适用科室id, 病人来源, 部位加收, 方案id)
      Values
        (n_记录id, n_收费项目id, n_收费数量, n_固有对照, n_按规格适配, n_从属项目, n_费用性质, v_检查部位, v_检查方法, n_收费方式, n_适用科室id, n_病人来源, n_部位加收,
         n_方案id);
    
      Return;
    End If;
  
    Delete 诊疗收费关系 R
    Where r.诊疗项目id = n_记录id And (0 = n_来源 And Nvl(r.适用科室id, 0) = 0 And Nvl(r.病人来源, 0) = 0 And
          (r.检查部位 Is Null And 0 = n_部位 Or r.检查部位 Is Not Null And 1 = n_部位) And
          (Nvl(r.费用性质, 0) = 0 And 0 = n_加收 Or r.费用性质 = 1 And 1 = n_加收) Or
          1 = n_来源 And Nvl(r.适用科室id, 0) > 0 And Nvl(r.病人来源, 0) = 1 And
          (r.检查部位 Is Null And 0 = n_部位 Or r.检查部位 Is Not Null And 1 = n_部位) And
          (Nvl(r.费用性质, 0) = 0 And 0 = n_加收 Or r.费用性质 = 1 And 1 = n_加收) Or
          2 = n_来源 And Nvl(r.适用科室id, 0) > 0 And Nvl(r.病人来源, 0) = 2 And
          (r.检查部位 Is Null And 0 = n_部位 Or r.检查部位 Is Not Null And 1 = n_部位) And
          (Nvl(r.费用性质, 0) = 0 And 0 = n_加收 Or r.费用性质 = 1 And 1 = n_加收));
  
    Jl_List := j_Json.Get_Pljson_List('对照列表');
    n_Count := Jl_List.Count;
  
    For I In 1 .. n_Count Loop
    
      j_Json_Tmp := Pljson();
      j_Json_Tmp := Pljson(Jl_List.Get(I));
    
      n_收费项目id := j_Json_Tmp.Get_Number('收费项目id');
      n_收费数量   := j_Json_Tmp.Get_Number('收费数量');
      n_固有对照   := j_Json_Tmp.Get_Number('固有对照');
      n_按规格适配 := j_Json_Tmp.Get_Number('按规格适配');
      n_从属项目   := j_Json_Tmp.Get_Number('从属项目');
      n_收费方式   := j_Json_Tmp.Get_Number('收费方式');
      n_方案id     := j_Json_Tmp.Get_Number('方案id');
    
      If Nvl(n_收费数量, 0) = 0 Then
        n_收费数量 := 1;
      End If;
    
      Select 类别 Into v_Type From 收费项目目录 Where ID = n_收费项目id;
    
      If Not (v_Type = '4' And n_收费方式 = 1 And n_按规格适配 = 1) Then
        n_按规格适配 := Null;
      End If;
    
      -- 收费方式=8 且方案id>0 才保留方案ID
      If Not (n_收费方式 = 8 And n_方案id > 0) Then
        n_方案id := Null;
      End If;
    
      n_适用科室id := Null;
      n_费用性质   := 0;
      v_检查部位   := Null;
      v_检查方法   := Null;
      n_部位加收   := Null;
    
      If n_加收 = 1 Then
        n_费用性质   := 1;
        v_检查部位   := Null;
        v_检查方法   := Null;
        n_部位加收   := Null;
        n_按规格适配 := Null;
        n_方案id     := Null;
      End If;
    
      If n_部位 = 1 Then
        n_费用性质   := 0;
        v_检查部位   := j_Json_Tmp.Get_String('检查部位');
        v_检查方法   := j_Json_Tmp.Get_String('检查方法');
        n_部位加收   := j_Json_Tmp.Get_Number('部位加收');
        n_按规格适配 := Null;
        n_方案id     := Null;
        If n_收费方式 Not In (0, 2, 9) Then
          n_收费方式 := 0;
        End If;
      
      End If;
    
      If v_科室ids Is Null Then
        -- 最终插入
        Insert Into 诊疗收费关系
          (诊疗项目id, 收费项目id, 收费数量, 固有对照, 按规格适配, 从属项目, 费用性质, 检查部位, 检查方法, 收费方式, 适用科室id, 病人来源, 部位加收, 方案id)
        Values
          (n_记录id, n_收费项目id, n_收费数量, n_固有对照, n_按规格适配, n_从属项目, n_费用性质, v_检查部位, v_检查方法, n_收费方式, n_适用科室id, n_病人来源, n_部位加收,
           n_方案id);
      Else
        For r_科室 In (Select /*+cardinality(j,10) */
                      Column_Value As 科室id
                     From Table(f_Str2list(v_科室ids)) J) Loop
          n_适用科室id := To_Number(r_科室.科室id);
          Insert Into 诊疗收费关系
            (诊疗项目id, 收费项目id, 收费数量, 固有对照, 按规格适配, 从属项目, 费用性质, 检查部位, 检查方法, 收费方式, 适用科室id, 病人来源, 部位加收, 方案id)
          Values
            (n_记录id, n_收费项目id, n_收费数量, n_固有对照, n_按规格适配, n_从属项目, n_费用性质, v_检查部位, v_检查方法, n_收费方式, n_适用科室id, n_病人来源,
             n_部位加收, n_方案id);
        End Loop;
      End If;
    End Loop;
  End;

Begin

  --记录入参信息
  --Select Log_Info_Ex From Zlloginfo Where Call_Name = 'HJY_HRS_PRO';
  -- Zltools.Zlloginfo_Insert(Log_Level_In => Null, Server_In => Null, User_Name_In => Null, Session_Id_In => Null,
  --                          Ip_In => Null, Station_In => Null, Process_Id_In => Null, Process_Name_In => Null,
  --                         Category_Name_In => Null, Component_Name_In => Null, Module_Name_In => Null,
  --                        Function_Name_In => Null, Call_Name_In => 'HJY_HRS_PRO', Stage_In => Null,
  --                         Log_Info_In => Null, Log_Info_Ex_In => Json_In);

  Select Sys_Context('USERENV', 'HOST') Into v_机器名 From Dual;

  --解析入参信息
  j_Input  := Pljson(Json_In);
  j_Json   := j_Input;
  n_功能   := j_Json.Get_Number('功能');
  n_记录id := j_Json.Get_Number('记录id');

  If 7 = n_功能 Then
    n_按规则计费 := j_Json.Get_Number('按规则计费');
    n_规则id     := j_Json.Get_Number('规则id');
  
    n_计价性质 := j_Json.Get_Number('计价性质');
  
    If n_按规则计费 = 1 Then
      n_计价性质 := 0;
    
      If n_规则id > 0 Then
        Zl_收费规则适用_Update(n_记录id, n_规则id);
      Else
        Delete 收费规则适用 Where 诊疗项目id = n_记录id;
      End If;
    
    End If;
  
    Update 诊疗项目目录 Set 计价性质 = n_计价性质 Where ID = n_记录id;
  
    Return;
  End If;

  If 8 = n_功能 Or 9 = n_功能 Or 10 = n_功能 Or 11 = n_功能 Then
    p_收费对照_通用;
    Return;
  End If;

  If 12 = n_功能 Then
    p_收费对照_放射;
    Return;
  End If;

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

  If 4 = n_功能 Then
    --停用
    d_停用时间 := To_Date(j_Json.Get_String('停用时间'), 'yyyy-mm-dd hh24:mi:ss');
    v_停用原因 := j_Json.Get_String('停用原因');
    v_名称     := j_Json.Get_String('名称');
    Zl_诊疗项目_Stop(n_记录id, v_停用原因, d_停用时间);
    Zl_Zlauditlog_Insert(v_用户名, v_机器名, 2, 100, '1054', '启用/停用', '停用项目：名称' || v_名称, v_操作员信息);
    Return;
  End If;

  If 5 = n_功能 Then
    --启用
    v_启用原因 := j_Json.Get_String('启用原因');
    Zl_诊疗项目_Reuse(n_记录id, v_启用原因);
    v_名称 := j_Json.Get_String('名称');
    Zl_Zlauditlog_Insert(v_用户名, v_机器名, 2, 100, '1054', '启用/停用', '启用项目：名称' || v_名称, v_操作员信息);
    Return;
  End If;

  If 6 = n_功能 Then
    --检验采集方式设置
    Zl_用法用量_Update(n_记录id, Null, 0, 0, j_Json.Get_String('采集方式'), j_Json.Get_Number('应用范围类型'),
                   j_Json.Get_String('应用范围'));
    Zl_Zlauditlog_Insert(v_用户名, v_机器名, 2, 100, '1054', '采集方式', '采集方式修改改_项目ID=' || n_记录id, v_操作员信息);
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

  If v_类别 = 'D' Then
    n_Count := 0;
    If j_Json.Exist('检查部位列表') Then
      Jl_List := j_Json.Get_Pljson_List('检查部位列表');
      n_Count := Jl_List.Count;
    End If;
    If n_Count > 0 Then
      If n_按规则计费 = 1 Then
        Zl_放射项目部位_Update(n_记录id);
      Else
        Update 诊疗项目部位 Set ID = -id, 方法 = '-' || 方法 Where 项目id = n_记录id;
      End If;
      For I In 1 .. n_Count Loop
        j_Json_Tmp := Pljson();
        j_Json_Tmp := Pljson(Jl_List.Get(I));
        v_检查部位 := j_Json_Tmp.Get_String('_部位');
      
        If 1 = n_按规则计费 Then
          Select Max(Zl_Fun_检查方法解析(a.方法)) As 数组串
          Into v_Jtemp
          From 放射检查部位 A
          Where a.类型 = v_操作类型 And a.名称 = v_检查部位;
        Else
          Select Max(Zl_Fun_检查方法解析(a.方法)) As 数组串
          Into v_Jtemp
          From 诊疗检查部位 A
          Where a.类型 = v_操作类型 And a.名称 = v_检查部位;
        End If;
      
        If v_Jtemp Is Not Null Then
          Jl_Pacs := Pljson_List(v_Jtemp);
          For K In 1 .. Jl_Pacs.Count Loop
          
            j_Way := Pljson();
            j_Way := Pljson(Jl_Pacs.Get(K));
          
            v_检查方法 := j_Way.Get_String('方法名称');
            v_上级方法 := j_Way.Get_String('上级方法');
            If n_按规则计费 = 1 Then
              Zl_放射项目部位_Insert(n_记录id, v_操作类型, v_检查部位, v_检查方法, Null, v_上级方法, K);
            Else
              Zl_诊疗项目部位_Insert(n_记录id, v_操作类型, v_检查部位, v_检查方法, Null, v_上级方法, K);
            End If;
          End Loop;
        End If;
      End Loop;
      If n_按规则计费 = 1 Then
        Zl_放射项目部位_Delete(n_记录id, 1);
      Else
        Zl_诊疗项目部位_Delete(n_记录id, 1);
      End If;
    End If;
  End If;

Exception
  When Err_Custom Then
    Raise_Application_Error(-20101, '[ZLSOFT]' || v_Error || '[ZLSOFT]');
  When Others Then
    zl_ErrorCenter(SQLCode, SQLErrM);
End Zl_Hrssvr_Cedit;
/

Create Or Replace Function Zl_Fun_检查方法解析
(
  方法_In   Varchar2,
  功能_In   Number := Null,
  项目id_In Number := Null,
  部位_In   Varchar2 := Null
) Return Varchar2 Is
  --功能：解析检查的方法串
  --入参：
  --     功能_In    null/0-缺省为空，即解析，方法串，
  --                1-表示构建选择值，
  --                2-表示构建当前项目的已选方法串
  --返回：json数组
  --   序号         N 1
  --   上级方法     C 1  
  --   方法名称     C 1
  --   共选         N 1 是否共选，0/1 1表示是共选
  --   是否造影     N 1 是否造影，0/1 1表示有造影
  --   是否勾选     N 1 表示当前项目是不中选择了
  v_方法串   Varchar2(4000);
  v_上级方法 Varchar2(4000);
  n_共选     Number(1);
  n_是否造影 Number(1);
  v_Jtmp     Varchar2(2000);
  v_方法名称 Varchar2(2000);

  v_方法名称上级temp Varchar2(2000);

  n_子方法序号 Number(3);
  n_序号       Number(3) := 0;
  n_是否勾选   Number(3);

  n_Have   Number(3);
  v_Result Varchar2(32767);

  Procedure Get_检查部位显示(Strjlst_In Varchar2) As
    Jl_List    Pljson_List;
    j_Json_Tmp Pljson;
  
    n_Count Pls_Integer;
    I       Pls_Integer;
  
    v_上级方法 Varchar2(200);
    v_方法名称 Varchar2(200);
    n_共选     Number;
    n_是否勾选 Number;
    v_连接符   Varchar2(100) := ' ';
  
    v_Prefix Varchar2(10);
    v_Item   Varchar2(500);
  
    Type t_Str_Tab Is Table Of Varchar2(32767) Index By Pls_Integer;
    l_Result_Tab   t_Str_Tab;
    n_Result_Count Pls_Integer := 0;
  
    Type t_Group_Map Is Table Of Varchar2(32767) Index By Varchar2(200);
    l_Group_Map t_Group_Map;
  
    Type t_Group_Pos Is Table Of Pls_Integer Index By Varchar2(200);
    l_Group_Pos t_Group_Pos;
  
  Begin
    Jl_List := Pljson_List(Strjlst_In);
  
    n_Count := Jl_List.Count;
  
    For I In 1 .. n_Count Loop
      j_Json_Tmp := Pljson(Jl_List.Get(I));
    
      v_上级方法 := Nvl(j_Json_Tmp.Get_String('上级方法'), '');
      v_方法名称 := Nvl(j_Json_Tmp.Get_String('方法名称'), '');
      n_共选     := Nvl(j_Json_Tmp.Get_Number('共选'), 0);
      n_是否勾选 := Nvl(j_Json_Tmp.Get_Number('是否勾选'), 0);
    
      If n_共选 = 1 Then
        If n_是否勾选 = 1 Then
          v_Prefix := '■';
        Else
          v_Prefix := '□';
        End If;
      Else
        If n_是否勾选 = 1 Then
          v_Prefix := '●';
        Else
          v_Prefix := '○';
        End If;
      End If;
    
      v_Item := v_Prefix || v_方法名称;
    
      If Trim(v_上级方法) Is Null Then
        n_Result_Count := n_Result_Count + 1;
        l_Result_Tab(n_Result_Count) := v_Item;
      Else
        If Not l_Group_Pos.Exists(v_上级方法) Then
          n_Result_Count := n_Result_Count + 1;
          l_Group_Pos(v_上级方法) := n_Result_Count;
          l_Group_Map(v_上级方法) := v_Item;
        Else
          l_Group_Map(v_上级方法) := l_Group_Map(v_上级方法) || v_连接符 || v_Item;
        End If;
      
        l_Result_Tab(l_Group_Pos(v_上级方法)) := '<' || l_Group_Map(v_上级方法) || '>';
      End If;
    End Loop;
  
    v_Result := '';
    For I In 1 .. n_Result_Count Loop
      If I = 1 Then
        v_Result := l_Result_Tab(I);
      Else
        v_Result := v_Result || v_连接符 || l_Result_Tab(I);
      End If;
    End Loop;
  
    --    Dbms_Output.Put_Line(v_Result);
  End;

Begin

  If 功能_In = 2 Then
    For R In (Select b.方法
              From 诊疗项目部位 B
              Where b.项目id = 项目id_In And b.部位 = 部位_In And b.默认 = 1
              Order By b.序号) Loop
      v_Jtmp := v_Jtmp || ',' || r.方法;
    End Loop;
    Return Substr(v_Jtmp, 2);
  End If;

  v_方法串 := 方法_In;
  v_方法串 := Replace(v_方法串, Chr(9), ';' || Chr(9));

  For r_One In (Select /*+cardinality(j,10) */
                 Column_Value As 方法
                From Table(f_Str2list(v_方法串, ';')) J) Loop
  
    n_子方法序号 := 0;
    v_上级方法   := Null;
  
    If r_One.方法 Is Not Null Then
      For r_Sub In (Select /*+cardinality(j,10) */
                     Column_Value As 方法
                    From Table(f_Str2list(r_One.方法, ',')) J) Loop
        If r_Sub.方法 Is Not Null Then
          n_是否造影 := 0;
          v_方法名称 := r_Sub.方法;
          If Instr(r_Sub.方法, Chr(9)) > 0 Then
            n_共选     := 1;
            v_方法名称 := Replace(r_Sub.方法, Chr(9), '');
          Else
            n_共选 := 0;
          End If;
        
          If Substr(v_方法名称, 1, 1) = '1' Then
            n_是否造影 := 1;
            v_方法名称 := Replace('__' || v_方法名称, '__1', '');
          Else
            v_方法名称 := Replace('__' || v_方法名称, '__0', '');
          End If;
        
          If n_子方法序号 > 0 Then
            v_上级方法 := v_方法名称上级temp;
          End If;
        
          If n_子方法序号 = 0 Then
            v_方法名称上级temp := v_方法名称;
          End If;
          n_子方法序号 := n_子方法序号 + 1;
        
          n_序号 := n_序号 + 1;
        
          If v_上级方法 Is Not Null Then
            n_共选 := 1;
          End If;
        
          n_是否勾选 := 0;
          If 功能_In = 1 Then
            Select Count(1)
            Into n_Have
            From 诊疗项目部位 B
            Where b.项目id = 项目id_In And b.部位 = 部位_In And b.默认 = 1 And b.方法 = v_方法名称;
            If n_Have > 0 Then
              n_是否勾选 := 1;
            End If;
          End If;
        
          v_Jtmp := v_Jtmp || ',{"序号":' || n_序号 || ',"上级方法":"' || v_上级方法 || '","方法名称":"' || v_方法名称 || '","共选":' || n_共选 ||
                    ',"是否造影":' || n_是否造影 || ',"是否勾选":' || n_是否勾选 || '}';
        
        End If;
      End Loop;
    End If;
  End Loop;

  If v_Jtmp Is Null Then
    Return Null;
  End If;

  If 功能_In = 1 Then
    Get_检查部位显示('[' || Substr(v_Jtmp, 2) || ']');
    Return v_Result;
  End If;

  Return '[' || Substr(v_Jtmp, 2) || ']';
Exception
  When Others Then
    zl_ErrorCenter(SQLCode, SQLErrM);
End Zl_Fun_检查方法解析;
/
Create Or Replace Function Zlgetnextid
(
  Table_Name Varchar2,
  Col_Name   Varchar2 := Null,
  Quantity   Number := Null
) Return Varchar2 Is
  Functionresult Varchar2(4000);
  v_Parin        Varchar2(3000);

  --入参：Json_In:格式 
  --input 
  --  table_name    C  1 表名 
  --  col_name      C  1 字段名  序列名称不一定是ID，例如记录ID 
  --  quantity      N  0 所需序列的个数，如果只取一个该参不传或都传0 

Begin

  v_Parin := '{"input":{"table_name":"' || Table_Name || '","col_name":"' || Col_Name || '","quantity":' ||
             Nvl(Quantity, 0) || '}}';

  Zl_Exsesvr_Getnextid(v_Parin, Functionresult);
  Return(Functionresult);
End Zlgetnextid;
/