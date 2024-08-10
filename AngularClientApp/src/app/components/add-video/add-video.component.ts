import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { IVideo } from '../../Model/IVideo';
import { AuthService } from '../../services/auth.service';
import { VideosService } from '../../services/videos.service';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.css']
})
export class AddVideoComponent implements OnInit {
  isLoading: boolean = false;
  videoId: number = -1;
  video: IVideo | null = null;
  errorMessage = 'OK';
  fileToUpload: File | null = null;;
  selectedfileName: string = "please select a file";
  videoForm: FormGroup = new FormGroup({});

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn;
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin;
  }


  get videosId() {
    return this.videoForm.get('Id');
  }
  get videosName() {
    return this.videoForm.get('Name');
  }
  get videosTitle() {
    return this.videoForm.get('Title');
  }

  get videosDescription() {
    return this.videoForm.get('Description');
  }

  constructor(private route: ActivatedRoute,
    private videoServices: VideosService,
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    if (!(this.isLoggedIn && this.isAdmin)) {
      this.router.navigateByUrl(this.authService.redirectUrl || '/');
    }
    this.videoForm = this.getEmptyForm();
    this.route.params.subscribe(params => {
      this.videoId = params['id'];
      let request: IVideo = { Id: this.videoId, Name: "", Title: "", Description: "" };
      if (this.videoId != null) {
        this.videoServices.getVideos(request).subscribe({
          next: videos => {
            this.video = videos.find(pr => pr.Id == this.videoId) || null;
            if (this.video) {
              this.videoForm = this.getFormFromVideo(this.video);
            }
            else {
              this.videoForm = this.getEmptyForm();
            }
          },
          error: err => this.errorMessage = err
        });
      }
      else {
        this.videoForm = this.getEmptyForm();
      }
    });
  }


  getEmptyForm() {
    return this.fb.group({
      Id: [{ value: 0, disabled: true }],
      Name: ["", [Validators.required, Validators.minLength(3)]],
      Title: "",
      Description: "",
    });
  }

  getFormFromVideo(video: IVideo) {
    var formGroup = this.fb.group({
      Id: [{ value: video.Id, disabled: true }],
      Name: [video.Name, [Validators.required, Validators.minLength(3)]],
      Title: video.Title,
      Description: video.Description,
    });

    return formGroup;
  }
  onSelectFile(files: FileList) {
    this.selectedfileName = files[0].name;
    this.fileToUpload = files[0];
    this.videoForm.controls['Name'].setValue(files[0].name);
  }
  saveVideo() {
    this.isLoading = true;
  
    // Ensure fileToUpload is not null
    if (!this.fileToUpload) {
      this.errorMessage = 'No file selected';
      this.isLoading = false;
      return;
    }
  
    let request: IVideo = {
      Id: this.videosId?.value ?? 0,
      Name: this.videosName?.value ?? '',
      Title: this.videosTitle?.value ?? '',
      Description: this.videosDescription?.value ?? '',
    };
  
    this.videoServices.saveVideo(this.fileToUpload, request).subscribe(
      res => {
        this.isLoading = false;
        this.router.navigateByUrl('/video/' + res.VideoId);
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Failed to save video';
      }
    );
  }
  
}
