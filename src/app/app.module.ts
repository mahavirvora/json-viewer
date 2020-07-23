import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppComponent } from 'src/app/app.component';
import { JsonEditorComponent } from 'src/app/json-editor/json-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    JsonEditorComponent
  ],
  imports: [
    BrowserModule, FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
