--关于系统交互消息记录表的脚本
--字段说明：消息编码
--              S001--切换病人
--              S002--关闭列表
--              S003--打开列表
Create table 系统交互消息记录(
  id number(18),
  人员ID number(18),
  用户名 VARCHAR2(20),       
  窗体句柄 number(18),
  消息编码 VARCHAR2(20),
  消息内容 VARCHAR2(1000),
  病人ID number(18),
  就诊ID number(18),
  机器名 VARCHAR2(50),
  创建时间   date
) tablespace ZL9BASEITEM;

CREATE SEQUENCE 系统交互消息记录_ID START WITH 1;    

Alter Table 系统交互消息记录 Add Constraint 系统交互消息记录_PK Primary Key(ID) Using Index Tablespace zl9Indexhis;
create index 系统交互消息记录_IX_窗体句柄 on 系统交互消息记录 (窗体句柄) Tablespace zl9Indexhis; 
create index 系统交互消息记录_IX_人员ID on 系统交互消息记录 (人员ID) Tablespace zl9Indexhis; 

Create Or Replace Procedure Zl_系统交互消息记录_Delete(Id_In 系统交互消息记录.Id%Type) As
Begin
  Delete 系统交互消息记录 Where ID = Id_In;
Exception
  When Others Then
    zl_ErrorCenter(SQLCode, SQLErrM);
End Zl_系统交互消息记录_Delete;
/