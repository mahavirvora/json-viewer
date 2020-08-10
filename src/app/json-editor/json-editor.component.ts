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
  body: any;
  isValid: boolean;
  formatting: { color: string; 'background-color': string; };
  message: any;
  jsonURL: any;
  @ViewChild('errormessage') errormessage: ElementRef;
  content: string;
  title: string;
  errorcontent: string;
  tree: any;

  alertMessages = {
    errorcontent: 'JSON object not found or well formated in left editor.',
    fileLoadError: 'Exception when trying to parse json',
    downloadError: "This field can't be left empty.",
    loadJsonError: "Please Enter URL.",
  }
  rootNode: any;
  sourceJSONObj: any;

  constructor(
    public config: NgbModalConfig,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.title = 'Error';
  }

  ngOnInit(): void { }

  handleError(message) {
    this.errorcontent = message;
    this.modalService.open(this.errormessage, { centered: true });
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
        this.handleError(this.alertMessages.errorcontent);
      }
    } catch (e) {
      this.handleError(this.alertMessages.errorcontent);
    }
  }

  beautifyJSON() {
    try {
      this.jsonTarget = JSON.stringify(JSON.parse(this.jsonSource), null, '    ');
    } catch (e) {
      this.handleError(this.alertMessages.errorcontent);
    }
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
      this.handleError(this.alertMessages.loadJsonError);
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
          this.handleError(this.alertMessages.fileLoadError);
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

  clear() {
    this.jsonSource = '';
    this.jsonTarget = '';
  }

  downloadFile() {
    if (this.jsonTarget.length < 1) {
      this.handleError(this.alertMessages.downloadError);
      return true;
    }
    else {
      var json = document.createElement('a');
      json.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(this.jsonTarget));
      json.setAttribute('download', 'download.json');
      json.click();
    }
  }

  jsonViewer() {
    this.jsonTarget = JSON.stringify(JSON.parse(this.jsonSource), null, '    ');

    return {
      parse: function (json_str) {
        var temp;

        try {
          temp = JSON.parse(json_str);
        } catch (e) {
          alert(e);
        }

        this.tree.loadData(temp);
      }
    };
  }
  expand() {
    this.tree.expand();
  }
  collapse() {
    this.tree.collapse();
  }

  Tree(jsonObj) {
    this.rootNode = null;
    this.sourceJSONObj = jsonObj;
    this.loadData(jsonObj);


    Tree(jsonObj); prototype = {

      constructor: this.Tree,

      loadData(jsonObj: any) {
        this.sourceJSONObj = jsonObj;

        this.rootNode = new Node(null, jsonObj, 'last');
        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(this.rootNode.el);
      },

      expand(filterFunc: any): void {
        if (this.rootNode.isComplex) {
          if (typeof filterFunc == 'function') {
            this.rootNode.childNodes.forEach(function (item, i) {
              if (item.isComplex && filterFunc(item)) {
                item.expand();
              }
            });
          } else {
            this.rootNode.expand('recursive');
          }
        }
      },

      collapse(): void {
        if (typeof this.rootNode.collapse === 'function') {
          this.rootNode.collapse('recursive');
        }
      }
    }
    return() => {
      (jsonObj) => {
        return new this.Tree(jsonObj);
      }
    }
  }

}
