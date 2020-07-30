import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from 'src/app/app.component';
import { JsonEditorComponent } from 'src/app/json-editor/json-editor.component';


@NgModule({
  declarations: [
    AppComponent,
    JsonEditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
