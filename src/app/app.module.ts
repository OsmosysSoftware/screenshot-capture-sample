import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestionsComponent } from './views/questions/questions.component';
import { LoginComponent } from './views/login/login.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { HttpClientModule } from '@angular/common/http';
import {WebcamModule} from 'ngx-webcam';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ImageCompareComponent } from './views/image-compare/image-compare.component';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { ImageModule } from 'primeng/image';
@NgModule({
  declarations: [
    AppComponent,
    QuestionsComponent,
    LoginComponent,
    ImageCompareComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    HttpClientModule,
    RadioButtonModule,
    WebcamModule,
    FileUploadModule,
    TableModule,
    ImageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
