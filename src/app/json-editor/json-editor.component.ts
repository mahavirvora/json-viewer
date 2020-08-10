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

  alertMessages = {
    errorcontent: 'JSON object not found in left editor.',
    fileLoadError: 'Exception when trying to parse json',
    downloadError: "This field can't be left empty.",
    loadJsonError: "Please Enter URL.",
  }


  constructor(
    public config: NgbModalConfig,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
    this.title = 'Error';
  }

  ngOnInit(): void { 
    var input = document.getElementsByClassName("lined");
      
      this.LNPrefix(input);
      input.addEventListener("input", this.LNPrefix.bind(this, input));
  }

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

  jsonViewer() {
    this.jsonTarget = this.jsonSource;
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

  LNPrefix(ta) {
    var p = ta.parentElement,
      lineCount = ta.value.split(/\r?\n/).length + 0;
    ta.style.cssText = "width:90%;resize:none;line-height: normal !important;";
    p.classList.add("LN_area");
    p.style.cssText = "overflow:hidden;height:250px;";

    function appendLineNum(sb, line) {
      var n = document.createElement("div");
      n.innerText = line;
      n.classList.add("LN_n");
      n.style.cssText = "text-align:right;padding-right:.1rem;";
      sb.appendChild(n);
    }

    var toDelete = document.getElementsByClassName("LN_sb")[0];
    if (toDelete)
      p.removeChild(toDelete);

    var sidebar = document.createElement("div");
    sidebar.classList.add("LN_sb");
    sidebar.style.cssText = "display:inline-block;float:left;width:auto;";
    p.insertBefore(sidebar, ta);

    for (var l = 0; l < lineCount; l++)
      appendLineNum(document.getElementsByClassName("LN_sb")[0], l + 1);

    input.addEventListener("scroll", function (e) {
      var style = this.parentElement.children[0].style,
        o = style.margin - this.scrollBottom;
      style.marginTop = String(o) + "px";
      this.parentElement.style.overflow = "hidden";
    });
  }

}
