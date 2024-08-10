import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { IVideo } from '../Model/IVideo';
import { IUploadFilesRespone } from '../Model/Responses/IUploadFilesResponse';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  private getVideosUrl = environment.baseApiUrl + "api/video/Videos";
  private addVideoUrl = environment.baseApiUrl + "api/video/SaveVideo";
  constructor(private http: HttpClient) { }

  getVideos(searchParam: IVideo): Observable<IVideo[]> {
    //let request = JSON.stringify(searchParam);
    return this.http.post<IVideo[]>(this.getVideosUrl, searchParam);
  }

  saveVideo(fileToUpload: File, videoData: IVideo): Observable<IUploadFilesRespone> {

    const fd = new FormData();
    fd.append(fileToUpload.name, fileToUpload, fileToUpload.name);
    fd.append("name", videoData.Name.toString());
    fd.append("title", videoData.Title.toString());
    fd.append("description", videoData.Description.toString());

    return this.http.post<IUploadFilesRespone>(this.addVideoUrl, fd);
  }
}
