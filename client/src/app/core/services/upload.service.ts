import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  uploadProgress = 0;

  constructor() {}

  public setUploadPercent(event: HttpEvent<any>): void {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        break;
      default:
        this.uploadProgress = 0;
    }
  }

  public getUploadProgress(): number {
    return this.uploadProgress;
  }
}
