using MarketCoreGeneral.Models.Authintication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace MarketCoreGeneral.Models.Video
{
    public class VideoModel
    {
        public VideoModel() { }
        
        public int Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }       
    }
}