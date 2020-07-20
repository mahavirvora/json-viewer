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
  json: any;
  html: string;

  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
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

  Process() {
    // this.json = $id(this.JSON_Source).value;
    // try {
    //   if (json == "") json = "\"\"";
    //   this.json = eval("[" + json + "]");
    //   // html = ProcessObject(obj[0], 0, 0, false, false, false);
    //   $id(this.JSON_Target).innerHTML = " ";
    //   this.JSON_Source = "{\n  \"id\": \"0001\",\n  \"type\": \"donut\",\n  \"name\": \"Cake\",\n  \"ppu\": 0.55,\n  \"batters\":\n    {\n      \"batter\":\n        [\n          { \"id\": \"1001\", \"type\": \"Regular\" },\n          { \"id\": \"1002\", \"type\": \"Chocolate\" },\n          { \"id\": \"1003\", \"type\": \"Blueberry\" },\n          { \"id\": \"1004\", \"type\": \"Devil's Food\" }\n        ]\n    },\n  \"topping\":\n    [\n      { \"id\": \"5001\", \"type\": \"None\" },\n      { \"id\": \"5002\", \"type\": \"Glazed\" },\n      { \"id\": \"5005\", \"type\": \"Sugar\" },\n      { \"id\": \"5007\", \"type\": \"Powdered Sugar\" },\n      { \"id\": \"5006\", \"type\": \"Chocolate with Sprinkles\" },\n      { \"id\": \"5003\", \"type\": \"Chocolate\" },\n      { \"id\": \"5004\", \"type\": \"Maple\" }\n    ]\n}";
    //   this.JSON_Target = JSON.parse(this.JSON_Source);
    // } catch (e) {
    //   alert("JSON is not well formated:\n" + e.message);
    //   $id(this.JSON_Target).innerHTML = "";
    // }
  }

  ngOnInit(): void { }

}