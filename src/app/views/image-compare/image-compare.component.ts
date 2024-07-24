import { Component } from '@angular/core';
import * as XLSX from 'xlsx';

interface ImageComparison {
  baseImage: string;
  webcamImage: string;
  similarity: number;
  facesDetected: number;
  objectsDetected: string;
  highlightedImage: string;
  reasons: string;
  faceMatch: string;
  faceMatchReason: string;
}

@Component({
  selector: 'app-image-compare',
  templateUrl: './image-compare.component.html',
  styleUrls: ['./image-compare.component.scss']
})
export class ImageCompareComponent {
  images: ImageComparison[] = [];
  basePath: string = 'server/images/';  // Adjust this to match your Angular static file serving path

  onUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e: any) => {
      const binaryStr = e.target.result;
      const wb = XLSX.read(binaryStr, { type: 'binary' });

      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

      // Clear the existing images array
      this.images = [];

      // Skip the header row and parse the data
      for (let i = 1; i < data.length; i++) {
        const row = data[i] as any;
        console.log(row[5])
        this.images.push({
          baseImage: this.getRelativePath(row[0]),
          webcamImage: this.getRelativePath(row[1]),
          similarity: parseFloat(row[2]),
          facesDetected: parseFloat(row[3]),
          objectsDetected: row[4],
          reasons: row[5].split('|'),
          highlightedImage: this.getRelativePath(row[6]),
          faceMatch: this.getRelativePath(row[7]),
          faceMatchReason: this.getRelativePath(row[8]),
        });
      }
    };

    reader.readAsBinaryString(file);
  }

  getRelativePath(fullPath: string): string {
    return fullPath.replace('/home/vikas/work/osmosys/screenshot-capture-sample/server/', 'http://localhost:3000/');
  }

  getSimilarityColor(similarity: number): string {
    if (similarity >= 90) {
      return 'green';
    } else if (similarity >= 80) {
      return 'orange';
    } else {
      return 'red';
    }
  }
}
