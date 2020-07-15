import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var require: any
const FileSaver = require('file-saver');
@Component({
  selector: 'app-json-editor',
  templateUrl: 'json-editor.component.html',
  styleUrls: ['json-editor.component.css'],
  providers: [NgbModalConfig, NgbModal, FormsModule]
})
export class JsonEditorComponent implements OnInit {

  public JSON_Source = "";
  public JSON_Target = "";

  body: any;
  fileinput: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content) {
    this.modalService.open(content, { centered: true });
  }
  minifyJSON() {
    try {
      this.JSON_Target = JSON.stringify(JSON.parse(this.JSON_Source));
    } catch (e) {
      this.handleError(e);
    }
  }
  beautifyJSON() {
    try {
      this.JSON_Target = JSON.stringify(JSON.parse(this.JSON_Source), null, "    ");
    } catch (e) {
      this.handleError(e);
    }
  }
  handleError(error: any) {
    console.log(error);
  }
  loadData() {
    this.body.appendChild(document.createTextNode(JSON.stringify(this.JSON_Source, null, 4)));
  }
  onFileLoad($event = 'any'){
    this.fileinput.nativeElement.value = JSON.parse(localStorage.getItem(this.JSON_Source));
  }

  ngOnInit(): void { }

}