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
  tabSpace = 4;
  modalContent: string;
  modalTitle: string;
  alertTitle = {
    alert: 'Alert',
    success: 'Success',
    error: 'Error',
  };
  alertMessages = {
    errorcontent: 'JSON object not found in left editor.',
    fileLoadError: 'Exception when trying to parse json',
    downloadError: 'This field can\'t be left empty.',
    loadJsonError: 'Please enter URL.',
    validJson: 'Valid JSON data.',
    invalidJson: 'Invalid JSON data.',
    emptyData: 'JSON editor is empty!.'
  };
  @ViewChild('modalRef') modalRef: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    public config: NgbModalConfig,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void { }

  handleError(title: string, message: string) {
    this.modalTitle = title;
    this.modalContent = message;
    this.modalService.open(this.modalRef, { centered: true });
  }

  setJsonTarget() {
    if (this.jsonSource) {
      this.jsonTarget = JSON.stringify(JSON.parse(this.jsonSource), null, this.tabSpace);
    }
  }

  open(content) {
    this.modalService.open(content, { centered: true });
  }

  selectedSpace(event: any) {
    this.tabSpace = Number(event.target.value) || 4;
    this.setJsonTarget();
  }

  minifyJSON() {
    try {
      if (this.jsonSource) {
        this.jsonTarget = JSON.stringify(JSON.parse(this.jsonSource));
      }
    } catch (e) {
      const message = e.message || this.alertMessages.errorcontent;
      this.handleError(this.alertTitle.error, message);
    }
  }

  beautifyJSON() {
    try {
      this.setJsonTarget();
    } catch (e) {
      const message = e.message || this.alertMessages.errorcontent;
      this.handleError(this.alertTitle.error, message);
    }
  }

  loadJSON() {
    this.http.get(this.jsonURL)
      .subscribe((data: any) => {
        this.jsonSource = JSON.stringify(data);
        this.modalService.dismissAll();
      }, (e) => {
        this.modalService.dismissAll();
        const message = e.message || this.alertMessages.loadJsonError;
        this.handleError(this.alertTitle.error, message);
      });
  }

  onFileLoad(event) {
    const file = event.target.files[0];
    console.log('load');
    if (file) {
      console.log('call');
      const reader = new FileReader();
      reader.onload = ((theFile) => {
        this.fileInput.nativeElement.value = '';
        return (data: any) => {
          try {
            this.jsonSource = data.target.result;
          } catch (e) {
            const message = e.message || this.alertMessages.fileLoadError;
            this.handleError(this.alertTitle.error, message);
          }
        };
      })(file);
      reader.readAsText(file);
    }
  }

  validate() {
    try {
      if (this.jsonSource.length > 0) {
        JSON.parse(this.jsonSource);
        this.handleError(this.alertTitle.success, this.alertMessages.validJson);
      } else {
        this.handleError(this.alertTitle.error, this.alertMessages.emptyData);
      }
    } catch (e) {
      const message = e.message || this.alertMessages.invalidJson;
      this.handleError(this.alertTitle.error, message);
    }
  }

  clear() {
    this.jsonSource = '';
    this.jsonTarget = '';
    this.fileInput.nativeElement.value = '';
  }

  downloadFile() {
    if (this.jsonTarget.length > 0) {
      const json = document.createElement('a');
      json.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(this.jsonTarget));
      json.setAttribute('download', 'download.json');
      json.click();
    } else {
      this.handleError(this.alertTitle.error, this.alertMessages.downloadError);
    }
  }
}
