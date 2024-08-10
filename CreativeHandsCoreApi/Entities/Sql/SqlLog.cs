namespace CreativeHandsCoreApi.Entities.Sql
{
    public class SqlLog
    {
        public int Id { get; set; }
        public string CreatedDate { get; set; }
        public string Method { get; set; }
        public string? HttpStatus { get; set; }
        public int? ErrorCodeId { get; set; }
        public string? ErrorCode { get; set; }
        public string Message { get; set; }
        public string? RequestData { get; set; }
    }
}
