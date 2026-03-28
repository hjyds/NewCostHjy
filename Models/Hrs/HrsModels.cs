using System;
using System.Collections.Generic;

namespace NewCostHjy.Models.Hrs {
    public class SaveResDetailRequest {
        public SaveContent save_content { get; set; }
        public string 内部参数 { get; set; }
    }

    public class SaveContent {
        public int save_sign { get; set; }
        public string source { get; set; }
        public string resource_view_id { get; set; }
        public string resource_type_id { get; set; }
        public Dictionary<string, object> properties { get; set; }
    }

    public class SaveResDetailResponse {
        public bool Success { get; set; }
        public string Msg { get; set; }
        public SaveResDetailData Data { get; set; }
        public int Code { get; set; }
    }

    public class SaveResDetailData {
        public int save_sign { get; set; }
        public string source { get; set; }
        public string resource_view_id { get; set; }
        public string resource_type_id { get; set; }
        public string creator_id { get; set; }
        public string creator_name { get; set; }
        public string resource_detail_id { get; set; }
        public List<PropFile> prop_files { get; set; }
    }

    public class PropFile {
        public int SaveSign { get; set; }
        public object VersionPolicy { get; set; }
        public int PolicyValue { get; set; }
        public string id { get; set; }
        public string file_type_id { get; set; }
        public string source_type { get; set; }
        public string source_data_id { get; set; }
        public string file_name { get; set; }
        public string file_path { get; set; }
        public DateTime create_time { get; set; }
        public string creator_name { get; set; }
        public string creator_id { get; set; }
        public DateTime record_time { get; set; }
        public string storage_location_id { get; set; }
        public string uds_code { get; set; }
    }

    public class SaveFileResponse {
        public bool Success { get; set; }
        public string Msg { get; set; }
        public SaveFileData Data { get; set; }
        public int Code { get; set; }
    }

    public class SaveFileData {
        public string fileId { get; set; }
        public string storageTag { get; set; }
        public string storageId { get; set; }
        public string fullPath { get; set; }
        public string state { get; set; }
        public string remoteServer { get; set; }
        public string accessMapDir { get; set; }
        public string url { get; set; }
    }

    public class BugCommitRequest {
        public string bug_id { get; set; }
        public string bug_title { get; set; }
        public string bug_description { get; set; }
        public string bug_type { get; set; }
        public string priority { get; set; }
        public string status { get; set; }
        public string assignee { get; set; }
        public List<string> attachments { get; set; }
        public DateTime create_time { get; set; }
        public string creator { get; set; }
    }

    public class UploadFileRequest {
        public string file_name { get; set; }
        public string file_path { get; set; }
        public string file_type { get; set; }
        public byte[] file_data { get; set; }
    }

    public class GetHrsTokenRequest {
        public string circleid { get; set; }
        public string 内部服务 { get; set; }
        public string hcsid { get; set; }
        public InArgs inargs { get; set; }
    }

    public class InArgs {
        public string user { get; set; }
        public string pwd { get; set; }
    }

    public class GetHrsTokenResponse {
        public bool Success { get; set; }
        public TokenData Data { get; set; }
    }

    public class TokenData {
        public string token { get; set; }
    }
}
