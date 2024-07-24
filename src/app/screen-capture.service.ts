import { Injectable } from '@angular/core';

interface ImageCapture {
  new (track: MediaStreamTrack): ImageCapture;
  grabFrame(): Promise<ImageBitmap>;
  takePhoto(): Promise<Blob>;
}

declare var ImageCapture: {
  prototype: ImageCapture;
  new(track: MediaStreamTrack): ImageCapture;
};

@Injectable({
  providedIn: 'root'
})
export class ScreenCaptureService {
  private screenStream: MediaStream | null = null;
  private displaySurface: string | null = null;

  async requestScreenCapture(): Promise<MediaStream> {
    try {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: 'monitor'
        }
      });
      this.updateDisplaySurface();
      console.log('Screen capture started');
      if (this.displaySurface !== 'monitor') {
        console.error('Only entire screen sharing is allowed.');
        this.screenStream.getTracks().forEach(track => track.stop());
        this.screenStream = null;
        throw new Error('Only entire screen sharing is allowed.');
      }
      return this.screenStream;
    } catch (error) {
      console.error('Screen capture request failed:', error);
      throw error;
    }
  }

  getScreenStream(): MediaStream | null {
    return this.screenStream;
  }

  getDisplaySurface(): string | null {
    return this.displaySurface;
  }

  async captureScreenshot(): Promise<string> {
    if (!this.screenStream) {
      console.warn('Screen stream is not available.');
      throw new Error('Screen stream is not available.');
    }
    const videoTrack = this.screenStream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(videoTrack);
    try {
      const bitmap = await imageCapture.grabFrame();
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const context = canvas.getContext('2d');
      context?.drawImage(bitmap, 0, 0);
      return canvas.toDataURL('image/png').replace('data:image/png;base64,', '');
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      throw error;
    }
  }

  async reinitializeScreenCapture(): Promise<void> {
    await this.requestScreenCapture();
  }

  private updateDisplaySurface(): void {
    if (this.screenStream) {
      const videoTrack = this.screenStream.getVideoTracks()[0];
      const settings = videoTrack.getSettings();
      this.displaySurface = (settings as any).displaySurface || null;
      console.log('Display surface:', this.displaySurface);
    }
  }
}
