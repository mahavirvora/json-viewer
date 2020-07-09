import { Component, OnInit } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

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
  selectedSpace: string = '';
  arrBirds: string[];

  constructor(config: NgbModalConfig, private modalService: NgbModal, private httpService: HttpClient) {
    // customize default values of modals used by this component tree
    config.backdrop = 'static';
    config.keyboard = false;
  }

  open(content) {
    this.modalService.open(content, { centered: true });
  }

  Minify() {
    this.JSON_Target = JSON.stringify(JSON.parse(this.JSON_Source));
  }

  // spaceSelector() {
  //   this.selectedSpace.controller('langCtrl', function ($scope) {
  //     const selectKey = $scope.selected;
  //     switch (selectKey) {
  //       case '2':
  //         alert('2');
  //         break;
  //       case '3':
  //         alert('3');
  //         break;
  //       case '4':
  //         alert('4');
  //         break;
  //       default:
  //         alert('1');
  //     }
  //   }
  // };

  oneTab() {
    this.JSON_Target = JSON.stringify(this.JSON_Source, null, 1);
  };
  twoTab() {
    this.JSON_Target = JSON.stringify(this.JSON_Source, null, 2);
  };
  threeTab() {
    this.JSON_Target = JSON.stringify(this.JSON_Source, null, 3);
  };
  fourTab() {
    this.JSON_Target = JSON.stringify(this.JSON_Source, null, 4);
  };

  loadData() {
    this.body.innerHTML = "";
    this.body.appendChild(document.createTextNode(JSON.stringify(this.JSON_Source, null, 4)));
  }

  ngOnInit(): void {
    this.httpService.get('./assets/birds.json').subscribe(
      data => {
        this.arrBirds = data as string[];	 // FILL THE ARRAY WITH DATA.
        //  console.log(this.arrBirds[1]);
      },
      (err: HttpErrorResponse) => {
        console.log(err.message);
      }
    );
  }

}
