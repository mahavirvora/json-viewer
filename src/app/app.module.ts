import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from 'src/app/app.component';
import { JsonEditorComponent } from 'src/app/json-editor/json-editor.component';
@NgModule({
  declarations: [
    AppComponent,
    JsonEditorComponent
  ],
  imports: [
    BrowserModule, FormsModule, NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
