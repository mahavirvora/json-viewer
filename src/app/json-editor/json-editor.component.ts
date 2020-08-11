import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-json-editor',
  templateUrl: 'json-editor.component.html',
  styleUrls: ['json-editor.component.css'],
})

export class JsonEditorComponent implements OnInit {
  jsonSource = '';
  jsonTarget = '';
  jsonURL: any;
  @ViewChild('modalRef') modalRef: ElementRef;
  modalContent: string;
  modalTitle: string;

  alertTitle = {
    alert: 'Alert',
    success: 'Success',
    error: 'Error',
  }

  alertMessages = {
    errorcontent: 'JSON object not found in left editor.',
    fileLoadError: 'Exception when trying to parse json',
    downloadError: "This field can't be left empty.",
    loadJsonError: "Please enter URL.",
    validJson: "Valid JSON data.",
    invalidJson: "Invalid JSON data.",
    emptyData: "JSON editor is empty!."
  }


  constructor(
    public config: NgbModalConfig,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void { }

  handleError(title, message) {
    this.modalTitle = title;
    this.modalContent = message;
    this.modalService.open(this.modalRef, { centered: true });
  }

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
      else {
        this.handleError(this.alertTitle.error, this.alertMessages.errorcontent);
      }
    } catch (e) {
      this.handleError(this.alertTitle.error, this.alertMessages.errorcontent);
    }
  }

  beautifyJSON() {
    try {
      this.jsonTarget = JSON.stringify(JSON.parse(this.jsonSource), null, '    ');
    } catch (e) {
      this.handleError(this.alertTitle.error, this.alertMessages.errorcontent);
    }
  }

  loadJSON() {
    try {
      return this.http.get(this.jsonURL)
        .subscribe((data: any) => {
          this.jsonSource = JSON.stringify(data);
        });
    } catch (e) {
      this.handleError(this.alertTitle.error, this.alertMessages.loadJsonError);
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
        } catch (e) {
          this.handleError(this.alertTitle.error, this.alertMessages.fileLoadError);
        }
      };
    })(f);
    reader.readAsText(f);
  }

  validate() {
    try {
      if (this.jsonSource.length > 0) {
        JSON.parse(this.jsonSource);
        this.handleError(this.alertTitle.success, this.alertMessages.validJson);
      }
      else {
        this.handleError(this.alertTitle.error, this.alertMessages.emptyData);
      }
    } catch (e) {
      this.handleError(this.alertTitle.error, this.alertMessages.invalidJson);
    }
  }


  jsonViewer() {
    this.jsonTarget = this.jsonSource;
  }

  clear() {
    this.jsonSource = '';
    this.jsonTarget = '';
  }

  downloadFile() {
    if (this.jsonTarget.length < 1) {
      this.handleError(this.alertTitle.error, this.alertMessages.downloadError);
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
