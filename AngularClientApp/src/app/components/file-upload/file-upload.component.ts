import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css'],
})
export class FileUploadComponent {
  @Input() fileId: string='';
  files: FileList | null = null; // or `FileList` if you know it's always assigned

  filename: string = 'aaa';

  onChange(files: FileList) {
    this.files = files;
    this.filename = files[0].name; // Update filename to the name of the first file
  }
}

