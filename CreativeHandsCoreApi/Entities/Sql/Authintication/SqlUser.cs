namespace CreativeHandsCoreApi.Entities.Sql.Authintication
{
    public class SqlUser
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string FullName { get; set; }
        public bool IsAdmin { get; set; } = false;
    }
}
