import { Component, OnDestroy, OnInit } from '@angular/core';
import { WebcamImage } from 'ngx-webcam';
import { Subject, Observable, Subscription, interval, tap } from 'rxjs';
import { ApiService } from '../../api.service';
import { ScreenCaptureService } from '../../screen-capture.service';

const CAPTURE_FREQUENCY_IN_MILLISECONDS = 1000;
const RANDOM_INTERVAL = false;

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.scss'],
})
export class QuestionsComponent implements OnDestroy, OnInit {
  constructor(
    private apiService: ApiService,
    private screenCaptureService: ScreenCaptureService
  ) {}

  ngOnInit(): void {
    this.initializeScreenCapture();
  }

  ngOnDestroy(): void {
    this.stopCapture();
  }

  timestamp = new Date().toISOString();
  questionData = [
    {
      questionId: 1,
      question: 'What is the capital of India?',
      options: [
        { label: 'New Delhi', value: 'New Delhi' },
        { label: 'Mumbai', value: 'Mumbai' },
        { label: 'Kolkata', value: 'Kolkata' },
        { label: 'Chennai', value: 'Chennai' },
      ],
    },
    {
      questionId: 2,
      question: 'Which planet is known as the Red Planet?',
      options: [
        { label: 'Mars', value: 'Mars' },
        { label: 'Jupiter', value: 'Jupiter' },
        { label: 'Venus', value: 'Venus' },
        { label: 'Saturn', value: 'Saturn' },
      ],
    },
    {
      questionId: 3,
      question: 'What is the largest mammal?',
      options: [
        { label: 'Blue Whale', value: 'Blue Whale' },
        { label: 'Elephant', value: 'Elephant' },
        { label: 'Giraffe', value: 'Giraffe' },
        { label: 'Hippopotamus', value: 'Hippopotamus' },
      ],
    },
    {
      questionId: 4,
      question: "Who wrote 'Romeo and Juliet'?",
      options: [
        { label: 'William Shakespeare', value: 'William Shakespeare' },
        { label: 'Jane Austen', value: 'Jane Austen' },
        { label: 'Charles Dickens', value: 'Charles Dickens' },
        { label: 'Leo Tolstoy', value: 'Leo Tolstoy' },
      ],
    },
    {
      questionId: 5,
      question: 'What is the currency of Japan?',
      options: [
        { label: 'Yen', value: 'Yen' },
        { label: 'Won', value: 'Won' },
        { label: 'Ringgit', value: 'Ringgit' },
        { label: 'Baht', value: 'Baht' },
      ],
    },
    {
      questionId: 6,
      question: "Which element has the chemical symbol 'O'?",
      options: [
        { label: 'Oxygen', value: 'Oxygen' },
        { label: 'Gold', value: 'Gold' },
        { label: 'Silver', value: 'Silver' },
        { label: 'Carbon', value: 'Carbon' },
      ],
    },
    {
      questionId: 7,
      question: 'Who painted the Mona Lisa?',
      options: [
        { label: 'Leonardo da Vinci', value: 'Leonardo da Vinci' },
        { label: 'Vincent van Gogh', value: 'Vincent van Gogh' },
        { label: 'Pablo Picasso', value: 'Pablo Picasso' },
        { label: 'Claude Monet', value: 'Claude Monet' },
      ],
    },
    {
      questionId: 8,
      question: 'What is the capital of Australia?',
      options: [
        { label: 'Canberra', value: 'Canberra' },
        { label: 'Sydney', value: 'Sydney' },
        { label: 'Melbourne', value: 'Melbourne' },
        { label: 'Brisbane', value: 'Brisbane' },
      ],
    },
    {
      questionId: 9,
      question:
        'Which programming language is known for its simplicity and readability?',
      options: [
        { label: 'Python', value: 'Python' },
        { label: 'Java', value: 'Java' },
        { label: 'C++', value: 'C++' },
        { label: 'JavaScript', value: 'JavaScript' },
      ],
    },
    {
      questionId: 10,
      question: 'Who developed the theory of relativity?',
      options: [
        { label: 'Albert Einstein', value: 'Albert Einstein' },
        { label: 'Isaac Newton', value: 'Isaac Newton' },
        { label: 'Galileo Galilei', value: 'Galileo Galilei' },
        { label: 'Stephen Hawking', value: 'Stephen Hawking' },
      ],
    },
    {
      questionId: 11,
      question: "What is the world's largest ocean?",
      options: [
        { label: 'Pacific Ocean', value: 'Pacific Ocean' },
        { label: 'Atlantic Ocean', value: 'Atlantic Ocean' },
        { label: 'Indian Ocean', value: 'Indian Ocean' },
        { label: 'Southern Ocean', value: 'Southern Ocean' },
      ],
    },
    {
      questionId: 12,
      question: "Who wrote 'To Kill a Mockingbird'?",
      options: [
        { label: 'Harper Lee', value: 'Harper Lee' },
        { label: 'J.K. Rowling', value: 'J.K. Rowling' },
        { label: 'George Orwell', value: 'George Orwell' },
        { label: 'Ernest Hemingway', value: 'Ernest Hemingway' },
      ],
    },
    {
      questionId: 13,
      question: 'Which country is known as the Land of the Rising Sun?',
      options: [
        { label: 'Japan', value: 'Japan' },
        { label: 'China', value: 'China' },
        { label: 'South Korea', value: 'South Korea' },
        { label: 'Vietnam', value: 'Vietnam' },
      ],
    },
    {
      questionId: 14,
      question: 'What is the currency of Brazil?',
      options: [
        { label: 'Brazilian Real', value: 'Brazilian Real' },
        { label: 'Peso', value: 'Peso' },
        { label: 'Dollar', value: 'Dollar' },
        { label: 'Euro', value: 'Euro' },
      ],
    },
    {
      questionId: 15,
      question: 'Who founded Microsoft?',
      options: [
        { label: 'Bill Gates', value: 'Bill Gates' },
        { label: 'Steve Jobs', value: 'Steve Jobs' },
        { label: 'Mark Zuckerberg', value: 'Mark Zuckerberg' },
        { label: 'Larry Page', value: 'Larry Page' },
      ],
    },
  ];
  selectedOptions: { [questionId: number]: string } = {};
  captureSubscription: Subscription | undefined;

  userId = localStorage.getItem('user') || '';
  capturedImageData!: WebcamImage;
  capturedScreenshot!: string;
  trigger: Subject<void> = new Subject<void>();

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  triggerSnapshot(): void {
    this.trigger.next();
  }

  onImageCapture(webcamImage: WebcamImage): void {
    this.capturedImageData = webcamImage;
    this.captureScreenShot();
  }

  async captureScreenShot() {
    try {
      this.capturedScreenshot = await this.screenCaptureService.captureScreenshot();
      this.sendCaptureData();
    } catch (error) {
      console.error('Screenshot capture failed:', error);
      this.pauseCapture();
      await this.reinitializeScreenCapture();
    }
  }

  sendCaptureData() {
    if (!this.capturedImageData) {
      alert('Enable Webcam to capture image');
      console.error('Please capture an image before registering.');
      return;
    }
    if (!this.capturedScreenshot) {
      alert('Screenshot could not be captured');
      console.error('Please capture an image before registering.');
      return;
    }
    this.timestamp = new Date().toISOString();
    this.apiService
      .capture(
        this.userId,
        this.capturedImageData.imageAsBase64,
        this.capturedScreenshot,
        this.timestamp
      )
      .subscribe(
        (response) => {
          console.log('Authorization successful:');
        },
        (error) => {
          console.error('Authorization failed:', error);
          alert('Authorization failed. Try Again');
        }
      );
  }

  async initializeScreenCapture(): Promise<void> {
    try {
      await this.screenCaptureService.getScreenStream();
      const displaySurface = this.screenCaptureService.getDisplaySurface();
      if (displaySurface !== 'monitor') {
        throw new Error('User did not share the entire screen. Reinitializing...');
      }
      console.log('User is sharing:', displaySurface);
      this.resumeCapture();
    } catch (error) {
      console.error(error);
      alert('Please select the entire screen to proceed.');
      setTimeout(() => this.initializeScreenCapture(), 5000); // Retry after 5 seconds
    }
  }

  async reinitializeScreenCapture(): Promise<void> {
    try {
      await this.screenCaptureService.reinitializeScreenCapture();
      const displaySurface = this.screenCaptureService.getDisplaySurface();
      if (displaySurface !== 'monitor') {
        throw new Error('User did not share the entire screen. Reinitializing...');
      }
      console.log('User is sharing:', displaySurface);
      this.resumeCapture();
    } catch (error) {
      console.error(error);
      alert('Please select the entire screen to proceed.');
      this.reinitializeScreenCapture();
    }
  }

  startCapture(): void {
    this.stopCapture();

    this.timestamp = new Date().toISOString();
    const intervalValue = this.getInterval();
    console.log('intervalValue', intervalValue);

    this.captureSubscription = interval(intervalValue).subscribe(async () => {
      try {
        this.triggerSnapshot();
      } catch (error) {
        console.error('Error during screenshot capture:', error);
        this.pauseCapture();
        await this.reinitializeScreenCapture();
      }
    });
  }

  stopCapture(): void {
    if (this.captureSubscription) {
      this.captureSubscription.unsubscribe();
    }
  }

  pauseCapture(): void {
    this.stopCapture();
  }

  resumeCapture(): void {
    this.startCapture();
  }

  getInterval() {
    if (!RANDOM_INTERVAL) return CAPTURE_FREQUENCY_IN_MILLISECONDS;

    const randomInterval = Math.floor(Math.random() * 60) + 1;
    return randomInterval * 1000;
  }
}
