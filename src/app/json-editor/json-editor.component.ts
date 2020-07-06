import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-json-editor',
  templateUrl: 'json-editor.component.html',
  styleUrls: ['json-editor.component.css']
})
export class JsonEditorComponent implements OnInit {

  public JSON_Source = "";
  public JSON_Target = "";
  private modalService: NgbModal;
  providers: [NgbModalConfig, NgbModal, FormsModule]
  
  constructor(config: NgbModalConfig) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  Minify() {
  this.JSON_Target = JSON.stringify(JSON.parse(this.JSON_Source));
  }
  
  open(LoadURL) {
    this.modalService.open(URL);
  }

  ngOnInit(): void {
  }
  
}
