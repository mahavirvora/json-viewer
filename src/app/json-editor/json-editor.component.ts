import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-json-editor',
  templateUrl: 'json-editor.component.html',
  styleUrls: ['json-editor.component.css'],
  providers: [NgbModalConfig, NgbModal, FormsModule]
})
export class JsonEditorComponent implements OnInit {

  public JSON_Source = "";
  public JSON_Target = "";

  constructor() { }

  Minify() {
    this.JSON_Target = JSON.stringify(JSON.parse(this.JSON_Source));
  }

  ngOnInit(): void {

  }

}
