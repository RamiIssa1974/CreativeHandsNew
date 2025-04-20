using MarketCoreGeneral.Models.Authintication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CreativeHandsCoreApi.Infrastructure.Entities.Video
{
    public class SqlVideo
    {       
        public int Id { get; set; }
        public string Name { get; set; }
        public string Extension { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }       
    }
}