import { Component, OnInit } from '@angular/core';
import { IVideo } from '../../Model/IVideo';
import { VideosService } from '../../services/videos.service';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css']
})
export class VideosComponent implements OnInit {
  isLoading: boolean = false;
  videos: IVideo[] = [];
  constructor(private videoService: VideosService) { }

  ngOnInit() {

    this.isLoading = true;
    let serchParam: IVideo = { Id: -1, Name: "", Description: "", Title: "" };
    this.videoService.getVideos(serchParam).subscribe(res => {
      this.videos = res;
      this.isLoading = false;
    })
  }

}
