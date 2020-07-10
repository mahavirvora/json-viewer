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
  arrBirds: string[];

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

  Minify() {
    this.JSON_Target = JSON.stringify(JSON.parse(this.JSON_Source));
  }

  loadData() {
    this.body.appendChild(document.createTextNode(JSON.stringify(this.JSON_Source, null, 4)));
  }

  ngOnInit(): void {

  }

}
