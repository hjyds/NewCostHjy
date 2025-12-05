using FluentFTP.Helpers;
using NewCostHjy.DAL;
using NewCostHjy.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;

namespace NewCostHjy.Common {
    public class FunTestCom
    {

        public string G_StrTemp { get; set; }

        private Random random = new Random();

        /// <summary>
        /// 读文件示例
        /// </summary>
        /// <param name="filePath"></param>
        public void TestReadFile(string filePath)
        {
            string[] lines = File.ReadAllLines(filePath);
            foreach (string line in lines)
            {
                // 处理每行数据
                string[] arr = line.Split(" ");

            }
        }

        /// <summary>
        /// 加密字符串 (与VB6兼容)（FTP相关）
        /// </summary>
        /// <param name="text">原文</param>
        /// <param name="key">密钥</param>
        /// <returns>加密后的字符串</returns>
        public string EncryptString(string text, string key)
        {
            if (string.IsNullOrEmpty(text) || string.IsNullOrEmpty(key))
                return string.Empty;

            StringBuilder result = new StringBuilder();
            int keyLength = key.Length;

            // 生成随机起始字符
            char randomChar = (char)('A' + random.Next(0, 26));

            // 生成基准字符
            int baseChar = 'A' + random.Next(0, 26);

            // 添加基准字符
            result.Append((char)baseChar);

            // 加密过程
            for (int i = 0; i < text.Length; i++)
            {
                int keyPos = i % keyLength;
                int asciiValue = (int)text[i];
                asciiValue = asciiValue ^ (int)key[keyPos] ^ baseChar;
                result.Append((char)asciiValue);
            }

            // 添加随机结束字符
            result.Append(randomChar);

            return result.ToString();
        }

        /// <summary>
        /// 解密字符串 (与VB6兼容)（FTP相关）
        /// </summary>
        /// <param name="encryptedText">加密文本</param>
        /// <param name="key">密钥</param>
        /// <returns>解密后的字符串</returns>
        public string DecryptString(string encryptedText, string key)
        { 
            // 验证输入长度
            if (string.IsNullOrEmpty(encryptedText) || encryptedText.Length < 3 || string.IsNullOrEmpty(key))
                return string.Empty;

            StringBuilder result = new StringBuilder();
            int keyLength = key.Length;

            // 提取各部分
            int baseChar = (int)encryptedText[0];
            string encryptedContent = encryptedText.Substring(1, encryptedText.Length - 2);

            // 解密过程
            for (int i = 0; i < encryptedContent.Length; i++)
            {
                int keyPos = i % keyLength;
                int asciiValue = (int)encryptedContent[i];
                asciiValue = asciiValue ^ (int)key[keyPos] ^ baseChar;
                result.Append((char)asciiValue);
            }
            return result.ToString();
        }         

        /// <summary>
        /// 读文件示例
        /// </summary>
        public void TestWriteFile()
        {

            ///////////////////////////////////////////////////////////////////
            string filePath = @"C:\Users\Administrator\Documents\Tencent Files\469843828\FileRecv\win10TestOutDoctor2024_03_04.Log";
            string[] lines = File.ReadAllLines(filePath);
            string[] lines_Temp = File.ReadAllLines(filePath);
            string outFile = @"C:\Users\Administrator\Documents\Tencent Files\469843828\FileRecv\parlog.txt";
            StreamWriter sw = new StreamWriter(outFile);

            decimal tmpValPre = 0, tmpVal = 0, tmpDiff = 0;

            for (int i = 0; i < lines.Length; i++)
            {

                string[] arr = lines[i].Split(" ");
                if (arr[0].IsNumeric())
                {
                    tmpVal = decimal.Parse(arr[0]);
                    tmpDiff = tmpVal - tmpValPre;
                } else
                {
                    tmpValPre = 0;
                }
                tmpValPre = tmpVal;

                sw.WriteLine(tmpDiff.ToString());
            }

            sw.Close();
            ///////////////////////////////////////////////////////////////////
        }

        public bool FileTxtHaveKeyVal(string filePath, string keyVal)
        {
            bool result = false;
            string[] lines = File.ReadAllLines(filePath);
            for (int i = 0; i < lines.Length; i++)
            {
                string strLinVal = lines[i];
                //byte[] gbkByte = Encoding.Default.GetBytes(strLinVal);



                //Encoding ansiEd = Encoding.GetEncoding(CultureInfo.CurrentCulture.TextInfo.ANSICodePage);


                //byte[] utf8Byte = Encoding.Convert(Encoding.ASCII, Encoding.UTF8, gbkByte);

                //string utf8Str= Encoding.UTF8.GetString(ansiEd.GetBytes(strLinVal));
                //Console.WriteLine(utf8Str);

                //string ansiString = strLinVal;

                //// 将ANSI字符串转换为字节数组
                //byte[] ansiBytes = Encoding.Default.GetBytes(ansiString);

                //// 将字节数组转换为UTF-8编码的字符串
                //string utf8String = Encoding.UTF8.GetString(ansiBytes);

                if (strLinVal.IndexOf(keyVal) > -1)
                {
                    //Console.WriteLine(strLinVal);
                    string[] lstTemp = strLinVal.Split("gobjPlugIn.");
                    lstTemp = lstTemp[1].Split("(");
                    string strFun = lstTemp[0];
                    Console.WriteLine(strFun);

                    if (G_StrTemp.IndexOf("," + strFun + ",") == -1)
                    {
                        G_StrTemp += strFun + ",";



                    }
                    result = true;
                }

            }

            //FileStream aFile = new FileStream(filePath, FileMode.Open);
            //StreamReader sr = new StreamReader(aFile,   Encoding.UTF8);
            //string FileContent = sr.ReadToEnd();
            //aFile.Close();
            ////ProcessData Pd = new ProcessData();
            ////Pd.ProceData(FileContent);

            return result;
        }
        public void ReadFileFold()
        {
            G_StrTemp = ",";
            Console.WriteLine("----------");
            string dir = @"D:\dllcode\code\35140\temp";

            List<string> lstStr = new List<string>();
            Director(dir, lstStr);

            List<string> lstStrTag = new List<string>();
            foreach (string item in lstStr)
            {
                if (FileTxtHaveKeyVal(item, "gobjPlugIn."))
                {
                    lstStrTag.Add(item);
                }
            }
            Console.WriteLine(G_StrTemp);
        }


        public void Director(string dir, List<string> lstStr)
        {
            DirectoryInfo d = new DirectoryInfo(dir);
            FileSystemInfo[] fileSystemInfos = d.GetFileSystemInfos();
            foreach (FileSystemInfo fsi in fileSystemInfos)
            {
                if (fsi is DirectoryInfo)
                {
                    Director(fsi.FullName, lstStr);
                } else
                {
                    //Console.WriteLine(fsi.FullName);
                    string strTmp = fsi.FullName;
                    if (strTmp.IndexOf(".cls") > -1 || strTmp.IndexOf(".frm") > -1 || strTmp.IndexOf(".bas") > -1)
                    {
                        lstStr.Add(strTmp);
                    }
                }
            }
        }

        public void GetSQLMODList(string filePath)
        {
            List<SQLLOGMOD> sqllist = new List<SQLLOGMOD>();

            void ParseOneRow(Dictionary<int, string> keyValuePairs)
            {
                if (keyValuePairs.Count > 0)
                {
                    string strAll = "";
                    string strTime = "";
                    string sqlEnd = "[EDNSQLSPL]";
                    SQLLOGMOD oneSQL = new SQLLOGMOD();
                    foreach (var item in keyValuePairs)
                    {
                        string strTmp = item.Value;

                        strTmp = item.Value;

                        if (strTime == "")
                        {
                            if (strTmp != "")
                            {
                                strTime = strTmp.Split(":")[0];
                            }
                        }

                        if (strTmp.IndexOf("Expend:") > -1)
                        {
                            strAll = strAll + sqlEnd + strTmp;
                            oneSQL.耗时信息 = strTmp;
                            oneSQL.耗时数值 = Convert.ToDecimal(strTmp.Split("Expend:")[1]) * 100;
                        } else
                        {
                            strAll = strAll + " " + strTmp;
                        }

                        if (strTmp.IndexOf("Application:") > -1)
                        {
                            oneSQL.标题信息 = strTmp;
                            oneSQL.Module_Name = strTmp.Split(@"Application:")[1];
                        }
                    }

                    string[] arr = strAll.Split("]SQL:");
                    string sql = arr[1];
                    sql = sql.Split(sqlEnd)[0];
                    oneSQL.查询语句 = sql;
                    sqllist.Add(oneSQL);
                }
            }

            void TestWriteFile(string filePath)
            {
                //string filePath = @"C:\Appsoft\SQL_ZLHIS_20240305.log";

                string[] lines = File.ReadAllLines(filePath);
                Dictionary<int, string> keyValuePairs = new Dictionary<int, string>();
                for (int i = 0; i < lines.Length; i++)
                {
                    string strLinVal = lines[i];
                    if (string.IsNullOrEmpty(strLinVal))
                    {
                        //得到一个元素
                        ParseOneRow(keyValuePairs);
                        keyValuePairs = new Dictionary<int, string>();
                    }
                    keyValuePairs.Add(i, strLinVal);
                }
            }

            //解析文件
            TestWriteFile(filePath);

            string funName = filePath.Split('.')[0];
            string[] arrStr = funName.Split(@"\");
            funName = arrStr[arrStr.Length - 1];

            ZlhisInterfaceDAL zlhisInterfaceDAL = new ZlhisInterfaceDAL();
            int int序号 = 0;
            foreach (var item in sqllist)
            {
                int序号++;
                item.查询语句 = item.查询语句.Trim();

                if (item.查询语句.Length > 100)
                {
                    item.Function_Name = item.查询语句.Substring(0, 100);
                } else
                {
                    item.Function_Name = item.查询语句;
                }

                zlhisInterfaceDAL.ZLhisLogInsert(int序号, "", item.标题信息, item.查询语句, Convert.ToInt32(item.耗时数值 * 100), funName, item.Module_Name, item.Function_Name);
            }

        }


        public void GetOneRowInfo(TraceDrugItem rs, double dblTotal, out double dblNum, out string strUnit, out double dblTraceNum, out string strTraceUnit)
        {
            // 定义变量
            double dbl数量 = dblTotal;
            double dbl原始数量 = dbl数量;
            double dbl换算数量 = dbl原始数量;
            double dbl分零系数 = Convert.ToDouble(rs.溯源码分零系数);
            string str数量单位 = rs.计算单位 ?? "";
            string str溯源单位 = "";
            double dbl追溯码数量;

            try
            {
                if (dbl分零系数 > 0)
                {
                    if (dbl原始数量 % dbl分零系数 == 0)
                    {
                        // 能整除时
                        dbl追溯码数量 = Math.Floor(dbl原始数量 / dbl分零系数);
                    } else
                    {
                        // 不能整除时
                        // 注意：这里原JavaScript代码有误，应该是dbl原始数量 / dbl分零系数再加1，而不是Math.floor(dbl分零系数) + 1
                        dbl追溯码数量 = Math.Floor(dbl原始数量 / dbl分零系数) + 1;
                    }
                } else
                {
                    int 包装类型 = Convert.ToInt32(rs.溯源码包装);
                    if (包装类型 == 1)
                    {
                        dbl换算数量 = dbl原始数量;
                    } else if (包装类型 == 2)
                    {
                        // 注意：原JavaScript代码中的dbl换算数量 || 0;是无效的，这里已移除
                        dbl换算数量 = dbl原始数量; // 如果住院包装不存在或为空，这里可能还需要进一步处理
                        str数量单位 = rs.住院单位 ?? "";
                    } else if (包装类型 == 3)
                    {
                        dbl换算数量 = dbl原始数量 / Convert.ToDouble(rs.门诊包装);
                        str数量单位 = rs.门诊单位 ?? "";
                    } else
                    {
                        dbl换算数量 = dbl原始数量 / Convert.ToDouble(rs.药库包装);
                        str数量单位 = rs.药库单位 ?? "";
                    }

                    // 计算要录入的追溯码数量 如果按追溯码包装换算的数量有小数 则追溯码数量要加1
                    if (dbl换算数量 == Math.Floor(dbl换算数量))
                    {
                        dbl追溯码数量 = dbl换算数量;
                    } else
                    {
                        dbl追溯码数量 = Math.Floor(dbl换算数量) + 1;
                    }
                }
                str溯源单位 = str数量单位;
                if (!string.IsNullOrEmpty(rs.溯源码包装单位))
                {
                    str溯源单位 = rs.溯源码包装单位;
                }

                // 输出结果
                dblNum = dbl换算数量; // 分零的情况下，这个就是原始数量（注意：这里的逻辑可能需要根据实际需求调整）
                strUnit = str数量单位;
                dblTraceNum = dbl追溯码数量;
                strTraceUnit = str溯源单位;
            } catch (Exception error)
            {
                // 错误处理，可以根据需要记录日志或抛出错误
                Console.WriteLine("Error in GetOneRowInfo: " + error.Message);
                throw; // 重新抛出异常，或者根据需要设置默认值给输出参数
            }
        }

        public void VbFunCVMain()
        {
            // 示例调用
            TraceDrugItem rs = new TraceDrugItem
            {
                溯源码分零系数 = 10,
                计算单位 = "个",
                溯源码包装 = "2",
                住院包装 = "10",
                住院单位 = "盒",
                门诊包装 = "",
                门诊单位 = "",
                药库包装 = "",
                药库单位 = "",
                溯源码包装单位 = "瓶"
            };

            double dblTotal = 55;
            double dblNum;
            string strUnit;
            double dblTraceNum;
            string strTraceUnit;

            GetOneRowInfo(rs, dblTotal, out dblNum, out strUnit, out dblTraceNum, out strTraceUnit);

            Console.WriteLine("dblNum: " + dblNum);
            Console.WriteLine("strUnit: " + strUnit);
            Console.WriteLine("dblTraceNum: " + dblTraceNum);
            Console.WriteLine("strTraceUnit: " + strTraceUnit);
        }

        //将以代码改为任务并行
        public List<TraceDrugItem> GetLargData(List<TraceDrugItem> lst)
        {
            List<TraceDrugItem> lstOut = new List<TraceDrugItem>();
            foreach (var item in lst)
            {
                TraceDrugItem temp = GetLargDataOne(item);
                lstOut.Add(temp);
            }
            return lstOut;
        }


        public TraceDrugItem GetLargDataOne(TraceDrugItem rs)
        {
            return rs;
        }

        /// <summary>
        /// 处理Unicode转义序列（如\u738b）
        /// </summary>
        public string ConvertUnicodeToChinese(string input)
        {
            if (string.IsNullOrEmpty(input))
                return input;

            System.Text.RegularExpressions.MatchCollection matches =
                System.Text.RegularExpressions.Regex.Matches(input, @"\\u([0-9a-fA-F]{4})");

            if (matches.Count == 0)
                return input;

            StringBuilder result = new StringBuilder();
            int lastIndex = 0;

            foreach (System.Text.RegularExpressions.Match match in matches)
            {
                result.Append(input.Substring(lastIndex, match.Index - lastIndex));

                string hex = match.Groups[1].Value;
                int code = Convert.ToInt32(hex, 16);
                result.Append((char)code);

                lastIndex = match.Index + match.Length;
            }

            result.Append(input.Substring(lastIndex));
            return result.ToString();
        }


        public string TestJsonCISRule(byte bytFunc)
        {
            string strJson = "";
            string testJson = "";
            switch (bytFunc)
            {
                case 1:
                    strJson = "{\"cdss_in\":{\"patient_info\":{\"pid\": \"5066404\",\"visit_id\": \"1\",\"visit_no\": \"314929\",\"name\": \"王琳琳\",\"age\": \"31岁\",\"gender\": \"女\",\"marital_status\": \"已婚\",\"operator_id\": \"489b7bba-31cd-4f59-8fef-c12f0570db61\",\"operator\": \"郑志鹏\",\"enc_type\": \"2\",\"scene\": \"1\"},\"main_info\": [{\"key\": \"168\",\"name\": \"注射用苄星青霉素\",\"type\": \"药品项目\",\"condition_info\":[{\"value_group\":[{\"skey\": \"给药途径\",\"sname\": \"2203\"},{\"skey\": \"给药频率\",\"sname\": \"1\"},{\"skey\": \"单次用量\",\"sname\": \"1\"},{\"skey\": \"总量\",\"sname\": \"1\"},{\"skey\": \"开嘱人\",\"sname\": \"郑志鹏\"}]},{\"key\": \"2203\",\"name\": \"肌内注射\",\"type\": \"给药途径\"}]}}";
                    testJson = "{\"接口json_in\":\"" + strJson + "\"}";
                    break;

                case 2:
                    strJson = "{" + Environment.NewLine +
                             "\"businss\":\"F8E7C2918A6C4060B29FE5D3FD66135A\"," + Environment.NewLine +
                             "\"inquiry\":[{" + Environment.NewLine +
                             "    \"observ_item_id\":\"F0E3D17C3CDE4FBF89FF020372D0A1EF\"," + Environment.NewLine +
                             "    \"item_name\":\"过敏体质\"," + Environment.NewLine +
                             "    \"item_code\":\"\"," + Environment.NewLine +
                             "    \"observ_item_values\":[{" + Environment.NewLine +
                             "        \"item_detail_id\":\"A43FD7C4166A470E9CD266FC9AC9D0B3\"," + Environment.NewLine +
                             "        \"disp_name\":\"是\"," + Environment.NewLine +
                             "        \"default_sign\":\"1\"" + Environment.NewLine +
                             "        }, {" + Environment.NewLine +
                             "        \"item_detail_id\":\"56E11442BA374FA8B7DF2FECE895AA13\"," + Environment.NewLine +
                             "        \"disp_name\":\"否\"," + Environment.NewLine +
                             "        \"default_sign\":\"0\"" + Environment.NewLine +
                             "        }]" + Environment.NewLine +
                             "    }, {";

                    strJson = strJson + Environment.NewLine +
                             "\"observ_item_id\":\"F14CEA53C2B646A399FD0DD491BAF0FE\"," + Environment.NewLine +
                             "\"item_name\":\"妊娠周期\"," + Environment.NewLine +
                             "\"item_code\":\"\"," + Environment.NewLine +
                             "\"observ_item_values\":[{" + Environment.NewLine +
                             "    \"item_detail_id\":\"77F1DF1C24884576BFBCCBDA39DA3D9F\"," + Environment.NewLine +
                             "    \"disp_name\":\"妊娠早期\"," + Environment.NewLine +
                             "    \"default_sign\":\"0\"" + Environment.NewLine +
                             "    }, {" + Environment.NewLine +
                             "    \"item_detail_id\":\"14345A4091194C4FAD518BDB029B1325\"," + Environment.NewLine +
                             "    \"disp_name\":\"妊娠中期\"," + Environment.NewLine +
                             "    \"default_sign\":\"0\"" + Environment.NewLine +
                             "    }, {" + Environment.NewLine +
                             "    \"item_detail_id\":\"8A64280BC22D432CB28346EA653E58F8\"," + Environment.NewLine +
                             "    \"disp_name\":\"妊娠晚期\"," + Environment.NewLine +
                             "    \"default_sign\":\"0\"" + Environment.NewLine +
                             "    }]" + Environment.NewLine +
                             "}]," + Environment.NewLine +
                             "\"";

                    strJson = strJson + Environment.NewLine +
                             "\"messages\":[{" + Environment.NewLine +
                             "    \"business_name\":\"药品禁忌\"," + Environment.NewLine +
                             "    \"return_info\":\"病人【王琳琳】使用药品【苄星青霉素注射剂】，禁止【肌肉注射】\"," + Environment.NewLine +
                             "    \"key\":\"2\"," + Environment.NewLine +
                             "    \"name\":\"苄星青霉素注射剂\"," + Environment.NewLine +
                             "    \"rule_name\":\"给药禁忌\"," + Environment.NewLine +
                             "    \"taboo_level\":\"警告\"" + Environment.NewLine +
                             "    }]" + Environment.NewLine +
                             "}";
                    testJson = "\"out\":" + strJson;
                    break;

                case 3:
                    //干预数据
                    strJson = "{\"businss\":\"DA32302FD74541B98DC4F3F992E5B206\",\"messages\":[{\"business_name\":\"药品禁忌\",\"return_info\":\"病人【王琳琳】就诊号【314929】，因【哺乳期禁止使用】【注射用苄星青霉素】\",\"key\":\"168\",\"name\":\"注射用苄星青霉素\",\"rule_name\":\"哺乳期禁止使用\",\"taboo_level\":\"禁止\",\"class_id\":\"46dfdfbd-fdab-429a-877c-a4dee02752e7\",\"detail_id\":\"b94b6533-d96e-4836-a386-825273461144\"}]}";
                    testJson = strJson.Replace("\"", "\\\"");
                    break;

                case 4:
                    //问诊数据
                    strJson = "{\"cdss_in\":{\"patient_info\":{\"pid\": \"4613704\",\"visit_id\": \"1\",\"visit_no\": \"303740\",\"name\": \"滕凤敏\",\"age\": \"71岁\",\"birthday\": \"1948-03-12\",\"gender\": \"女\",\"marital_status\": \"已婚\",\"operator_id\": \"489b7bba-31cd-4f59-8fef-c12f0570db61\",\"operator\": \"郑志鹏\",\"enc_type\": \"2\"},\"main_info\": [{\"key\": \"168\",\"name\": \"注射用苄星青霉素\",\"type\": \"药品项目\",\"condition_info\":[{\"value_group\":[{\"skey\": \"给药途径\",\"sname\": \"144511\"},{\"skey\": \"给药频率\",\"sname\": \"1\"},{\"skey\": \"单次用量\",\"sname\": \"1\"},{\"skey\": \"总量\",\"sname\": \"1\"},{\"skey\": \"开嘱人\",\"sname\": \"郑志鹏\"}]},{\"key\": \"144511\",\"name\": \"肌肉注射\",\"type\": \"给药途径\"}]}}";
                    strJson = strJson.Replace("\"", "\\\"");
                    testJson = "{\"接口json_in\":\"" + strJson + "\"}";
                    break;

                case 5:
                    //问诊加载数据
                    strJson = "{\"businss\":\"97CEF2E3E5894591A4EB1BA3A215146E\",\"inquiry\":" + Environment.NewLine +
                             "[{\"observ_item_id\":\"F0E3D17C3CDE4FBF89FF020372D0A1EF\",\"item_name\":\"过敏体质\",\"item_code\":\"\",\"observ_item_values\":" + Environment.NewLine +
                             "[{\"item_detail_id\":\"A43FD7C4166A470E9CD266FC9AC9D0B3\",\"disp_name\":\"是\",\"default_sign\":\"1\"}," + Environment.NewLine +
                             "{\"item_detail_id\":\"56E11442BA374FA8B7DF2FECE895AA13\",\"disp_name\":\"否\",\"default_sign\":\"0\"}]}," + Environment.NewLine +
                             "{\"observ_item_id\":\"9EF6C13B62094E698E481868C703E634\",\"item_name\":\"妊娠状态\",\"item_code\":\"\",\"observ_item_values\":" + Environment.NewLine +
                             "[{\"item_detail_id\":\"427EAB8923FF49258FC935E74BAACAE7\",\"disp_name\":\"是\",\"default_sign\":\"1\"}," + Environment.NewLine +
                             "{\"item_detail_id\":\"CA018CB5A6914896AA4FC4D1C137164F\",\"disp_name\":\"否\",\"default_sign\":\"0\"}]},";

                    strJson = strJson + "{\"observ_item_id\":\"4BA5C77FE9D9408389A9BE085E30E99A\",\"item_name\":\"肝功能不全\",\"item_code\":\"\"," + Environment.NewLine +
                             "\"observ_item_values\":[{\"item_detail_id\":\"C532D50ACF6C4DDC8D20A0039B87C2FD\",\"disp_name\":\"是\",\"default_sign\":\"1\"}," + Environment.NewLine +
                             "{\"item_detail_id\":\"1D958F80177546F0BC06619AEDCF00A6\",\"disp_name\":\"否\",\"default_sign\":\"0\"}]}," + Environment.NewLine +
                             "{\"observ_item_id\":\"1640B9E956AD4372BC353DE709455B45\",\"item_name\":\"肾功能不全\"," + Environment.NewLine +
                             "\"item_code\":\"\",\"observ_item_values\":[{\"item_detail_id\":\"9EE1C7FC4EB84B28A829CC1B9654A4F1\",\"disp_name\":\"是\",\"default_sign\":\"1\"}," + Environment.NewLine +
                             "{\"item_detail_id\":\"562F75B5A00849B5A5A92C0144CD49BC\",\"disp_name\":\"否\",\"default_sign\":\"0\"}]}],\"messages\":[{\"business_name\":\"药品禁忌\",\"return_info\":\"病人【滕凤敏】就诊号【303740】，因【哺乳期禁止使用】【注射用苄星青霉素】\"," + Environment.NewLine +
                     "\"key\":\"168\",\"name\":\"注射用苄星青霉素\",\"rule_name\":\"哺乳期禁止使用\",\"taboo_level\":\"禁止\"," + Environment.NewLine +
                     "\"class_id\":\"46dfdfbd-fdab-429a-877c-a4dee02752e7\",\"detail_id\":\"b94b6533-d96e-4836-a386-825273461144\"}," + Environment.NewLine +
                     "{\"business_name\":\"药品禁忌\",\"return_info\":\"病人【滕凤敏】就诊号【303740】使用药品【注射用苄星青霉素】，慎用【肌肉注射】\"," + Environment.NewLine +
                     "\"key\":\"168\",\"name\":\"注射用苄星青霉素\",\"rule_name\":\"给药禁忌\",\"taboo_level\":\"警告\"," + Environment.NewLine +
                     "\"class_id\":\"46dfdfbd-fdab-429a-877c-a4dee02752e7\",\"detail_id\":\"72be25bb-0a1e-4aed-ab0f-ce181d87a694\"}]}";

                    testJson = strJson;
                    break;
            }

            return testJson;
        }

    }

}

