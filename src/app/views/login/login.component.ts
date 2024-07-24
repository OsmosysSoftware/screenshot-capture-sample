import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { Observable, Subject } from 'rxjs';
import { WebcamImage } from 'ngx-webcam';
import { Router } from '@angular/router';
import { ScreenCaptureService } from '../../screen-capture.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  userId = '';
  capturedImageData!: WebcamImage;
  trigger: Subject<void> = new Subject<void>();
  loading = false;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private screenCaptureService: ScreenCaptureService
  ) {}

  async captureImage(): Promise<void> {
    try {
      await this.screenCaptureService.requestScreenCapture();
      this.trigger.next();
    } catch (error) {
      console.error('Screen capture request failed:', error);
    }
  }

  onImageCapture(webcamImage: WebcamImage): void {
    this.capturedImageData = webcamImage;
    this.registerUser();
  }

  registerUser() {
    if (!this.capturedImageData) {
      alert('Enable Webcam to capture image');
      console.error('Please capture an image before registering.');
      return;
    }

    this.loading = true;

    this.apiService
      .authorize(this.userId, this.capturedImageData.imageAsBase64)
      .subscribe(
        (response) => {
          console.log('Authorization successful:');
          localStorage.setItem('user', this.userId);
          this.router.navigate(['questions']);
        },
        (error) => {
          console.error('Authorization failed:', error);
          alert('Authorization failed. Try Again');
        }
      )
      .add(() => {
        this.loading = false;
      });
  }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  onUserIdInput(): void {
    this.userId = this.userId.toUpperCase();
  }
}
