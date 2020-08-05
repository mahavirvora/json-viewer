import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { error } from '@angular/compiler/src/util';

@Component({
  selector: 'app-json-editor',
  templateUrl: 'json-editor.component.html',
  styleUrls: ['json-editor.component.css'],
})
export class JsonEditorComponent implements OnInit {
  jsonSource = '';
  jsonTarget = '';
  body: any;
  isValid: boolean;
  formatting: { color: string; 'background-color': string; };
  message: any;
  jsonURL: any;

  constructor(
    public config: NgbModalConfig,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }


  ngOnInit(): void { }

  open(content) {
    this.modalService.open(content, { centered: true });
  }

  selectedSpace(event: any) {
    if (this.jsonSource) {
      const tabSpace = Number(event.target.value) || 4;
      this.jsonTarget = JSON.stringify(JSON.parse(this.jsonSource), null, tabSpace);
    }
  }

  minifyJSON() {
    try {
      if (this.jsonSource) {
        this.jsonTarget = JSON.stringify(JSON.parse(this.jsonSource));
      }
      else{
        this.handleError(error);
      }
    } catch (e) {
      this.handleError(e);
    }
  }

  beautifyJSON() {
    try {
      this.jsonTarget = JSON.stringify(JSON.parse(this.jsonSource), null, '    ');
    } catch (e) {
      this.handleError(e);
    }
  }

  handleError(error) {
    alert('JSON is not well formated.');
    console.log(error);
  }

  loadData() {
    this.body.appendChild(document.createTextNode(JSON.stringify(this.jsonSource, null, 4)));
  }

  loadJSON() {
    try {
      return this.http.get(this.jsonURL)
        .subscribe((data: any) => {
          this.jsonSource = JSON.stringify(data);
        });
    } catch (e) {
      alert('Please Enter URL.');
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
          this.jsonSource = JSON.parse(resSTR);
          this.jsonSource = JSON.stringify(JSON.parse(resSTR), null, '    ');
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
    this.jsonSource = JSON.stringify(this.message);
    try {
      this.message = JSON.parse(this.jsonSource);
    } catch (e) {
      this.isValid = false;
      this.formatting = { color: 'red', 'background-color': '#f2dede' };
    }
    this.message = JSON.parse(this.jsonSource);
    this.isValid = true;
    this.formatting = { color: 'green', 'background-color': '#d0e9c6' };
  }

  jsonViewer() {
    this.jsonTarget = this.jsonSource;
  }

  downloadFile() {
    if (this.jsonTarget.length < 1) {
      window.alert("This field cant be left empty");
      return true;
    }
    else {
      var json = document.createElement('a');
      json.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(this.jsonTarget));
      json.setAttribute('download', 'download.json');
      json.click();
    }
  }

} 
