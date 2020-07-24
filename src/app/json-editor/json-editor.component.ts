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
  body: any;

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
    alert("JSON is not well formated.");
    console.log(error);
  }

  loadData() {
    this.body.appendChild(document.createTextNode(JSON.stringify(this.JSON_Source, null, 4)));
  }

  selectedSpace(event: any) {
    this.JSON_Target = JSON.stringify(JSON.parse(this.JSON_Source), undefined ,Number(event.target.value));
  }

  ngOnInit(): void { }

}
