import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';

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
  isValid: boolean;
  formatting: { color: string; 'background-color': string; };
  message: any;
  jsonURL: any;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }
  open(content) {
    this.modalService.open(content, { centered: true });
  }

  selectedSpace(event: any) {
    this.JSON_Target = JSON.stringify(JSON.parse(this.JSON_Source), undefined, Number(event.target.value));
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

  loadJSON() {
    try {
      return this.http.get(this.jsonURL)
        .subscribe((data: any) => {
          this.JSON_Source = JSON.stringify(data);
        });
    } catch (e) {
      alert("Please Enter URL.");
    }
  }

  onFileLoad(event) {
    const f = event.target.files[0];
    const reader = new FileReader();

    reader.onload = ((theFile) => {
      return (e) => {
        try {
          const json = JSON.parse(e.target.result);
          const resSTR = JSON.stringify(json);
          this.JSON_Source = JSON.parse(resSTR);
          this.JSON_Source = JSON.stringify(JSON.parse(resSTR), null, "    ");
        } catch (ex) {
          alert('exception when trying to parse json = ' + ex);
        }
      };
    })(f);
    reader.readAsText(f);
  }

  validate() {
    this.formatting = { color: 'green', 'background-color': '#d0e9c6' };
    this.isValid = true;
    this.JSON_Source = JSON.stringify(this.message);
    return (e) => {
      try {
        this.message = JSON.parse(this.JSON_Source);
      } catch (e) {
        this.isValid = false;
        this.formatting = { color: 'red', 'background-color': '#f2dede' };
      }
      this.message = JSON.parse(this.JSON_Source);
      this.isValid = true;
      this.formatting = { color: 'green', 'background-color': '#d0e9c6' };
    }
  }

  ngOnInit(): void { }

}