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
  cntline: any;
  lineCount: number;
  obj_rownr: any;
  tmp_arr: any;
  cntline_old: number;
  tmpstr: string;
  obj: any;
  i: number;


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

  // Show line numbers in textarea ///////////

  keyup(obj, e) {
		if (e.keyCode >= 33 && e.keyCode <= 40) 
			this.selectionchanged(obj);
	}

	selectionchanged(obj) {
		var substr = obj.value.substring(0, obj.selectionStart).split('\n');
		var row = substr.length;
		var col = substr[substr.length - 1].length;
		var tmpstr = '(' + row.toString() + ',' + col.toString() + ')';
		
		if (obj.selectionStart != obj.selectionEnd) {
			substr = obj.value.substring(obj.selectionStart, obj.selectionEnd).split('\n');
			row += substr.length - 1;
			col = substr[substr.length - 1].length;
			tmpstr += ' - (' + row.toString() + ',' + col.toString() + ')';
		}
		obj.parentElement.getElementsByTagName('input')[0].value = tmpstr;
	}

	input_changed(obj_txt) {
		this.obj_rownr = obj_txt.parentElement.parentElement.getElementsByTagName('textarea')[0];
		this.cntline = this.count_lines(obj_txt.value);
		if (this.cntline == 0) this.cntline = 1;
		this.tmp_arr = this.obj_rownr.value.split('\n');
		this.cntline_old = parseInt(this.tmp_arr[this.tmp_arr.length - 1], 10);
		
		if (this.cntline != this.cntline_old) {
			this.obj_rownr.cols = this.cntline.toString().length; 
			this.populate_rownr(this.obj_rownr, this.cntline);
			this.scroll_changed(obj_txt);
		}
		this.selectionchanged(obj_txt);
	}

	scroll_changed(obj_txt) {
		this.obj_rownr = obj_txt.parentElement.parentElement.getElementsByTagName('textarea')[0];
		this.scrollsync(obj_txt, this.obj_rownr);
	}

	scrollsync(obj1, obj2) {
		
		obj2.scrollTop = obj1.scrollTop;
	}

	populate_rownr(obj, cntline) {
		this.tmpstr = '';
		for (this.i = 1; this.i <= cntline; this.i++) {
			this.tmpstr = this.tmpstr + this.i.toString() + '\n';
		}
		obj.value = this.tmpstr;
	}

	count_lines(lined) {
		if (lined == '') {
			return 0;
		}
		return lined.split('\n').length + 0;
	}

}
