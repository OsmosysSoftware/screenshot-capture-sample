import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  authorize(candidateId: string, baseImage: string): Observable<any> {
    const url = `${this.baseUrl}/authorize`;
    const body = { candidateId, baseImage };
    return this.http.post(url, body);
  }

  capture(candidateId: string, candidateImage: string, laptopScreenshot: string): Observable<any> {
    const timestamp = new Date().toISOString();
    const url = `${this.baseUrl}/capture`;
    const body = { candidateId, timestamp, candidateImage, laptopScreenshot };
    return this.http.post(url, body);
  }
}
