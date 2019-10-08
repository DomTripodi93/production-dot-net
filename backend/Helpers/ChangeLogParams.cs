namespace BackEnd.Helpers
{
    public class ChangeLogParams
    {
        private const int MaxPageSize = 20;
        public int PageNumber { get; set; } = 1;
        private int pageSize = 5;
        public int PageSize
        {
            get {return pageSize = 5;}
            set { pageSize = (value > MaxPageSize) ? MaxPageSize : value;}
        }
    }
}