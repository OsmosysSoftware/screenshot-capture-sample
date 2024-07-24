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

  async requestScreenCapture(): Promise<MediaStream> {
    this.screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true
    });
    console.log('Screen capture started');
    return this.screenStream;
  }

  getScreenStream(): MediaStream | null {
    return this.screenStream;
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
    this.screenStream = null;
    await this.requestScreenCapture();
  }
}
