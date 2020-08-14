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
  code_input: string;
  load_button: HTMLElement;
  NodeBoolean: string;
  NodeNumber: string;
  NodeString: string;
  NodeNull: string;
  NodeObject: string;
  NodeArray: string;

  constructor(
    public config: NgbModalConfig,
    private modalService: NgbModal,
    private http: HttpClient
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
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

  // JSON Viewer //////

    jsonTreeViewer(jsonTree){
    var treeWrapper = document.getElementById("tree");
    var tree = jsonTree.create({}, treeWrapper);
    function expand() {
      tree.expand();
    }
    function collapse() {
      tree.collapse();
    }

    /* Load json form */

    this.code_input = this.jsonSource;
    this.load_button = document.getElementById('load_code_button');

    function load(e) {
      this.jsonTreeViewer.parse(this.jsonSource.value);
      this.jsonSource.value = '';
    }
    this.load_button.addEventListener('click', load, false);

    return {
      parse: function (json_str) {
        var temp;

        try {
          temp = JSON.parse(json_str);
        } catch (e) {
          alert(e);
        }

        tree.loadData(temp);
      }
    }
  }
  
  jsonTree() {

    console.log(this.jsonTreeViewer);

    var utils = {

      getClass: function (val) {
        return Object.prototype.toString.call(val);
      },

      getType: function (val) {
        if (val === null) {
          return 'null';
        }

        switch (typeof val) {
          case 'number':
            return 'number';

          case 'string':
            return 'string';

          case 'boolean':
            return 'boolean';
        }

        switch (utils.getClass(val)) {
          case '[object Array]':
            return 'array';

          case '[object Object]':
            return 'object';
        }

        throw new Error('Bad type: ' + utils.getClass(val));
      },

      forEachNode: function (obj, func) {
        var type = utils.getType(obj),
          isLast;

        switch (type) {
          case 'array':
            isLast = obj.length - 1;

            obj.forEach(function (item, i) {
              func(i, item, i === isLast);
            });

            break;

          case 'object':
            var keys = Object.keys(obj).sort();

            isLast = keys.length - 1;

            keys.forEach(function (item, i) {
              func(item, obj[item], i === isLast);
            });

            break;
        }

      },

      inherits: (function () {
        var F = function () { };

        return function (Child, Parent) {
          F.prototype = Parent.prototype;
          Child.prototype = new F();
          Child.prototype.constructor = Child;
        };
      })(),

      isValidRoot: function (jsonObj) {
        switch (utils.getType(jsonObj)) {
          case 'object':
          case 'array':
            return true;
          default:
            return false;
        }
      },

      extend: function (targetObj, sourceObj) {
        for (var prop in sourceObj) {
          if (sourceObj.hasOwnProperty(prop)) {
            targetObj[prop] = sourceObj[prop];
          }
        }
      }
    };

    function Node(label, val, isLast) {
      var nodeType = utils.getType(val);

      if (nodeType in Node.CONSTRUCTORS) {
        return new Node.CONSTRUCTORS[nodeType](label, val, isLast);
      } else {
        throw new Error('Bad type: ' + utils.getClass(val));
      }
    }

    Node.CONSTRUCTORS = {
      'boolean': NodeBoolean,
      'number': NodeNumber,
      'string': NodeString,
      'null': NodeNull,
      'object': NodeObject,
      'array': NodeArray
    };

    function _NodeSimple(label, val, isLast) {
      if (this.constructor === _NodeSimple) {
        throw new Error('This is abstract class');
      }

      var self = this,
        el = document.createElement('li'),
        labelEl,
        template = function (label, val) {
          var str = '\
                    <span class="jsontree_label-wrapper">\
                        <span class="jsontree_label">"' +
            label +
            '"</span> : \
                    </span>\
                    <span class="jsontree_value-wrapper">\
                        <span class="jsontree_value jsontree_value_' + self.type + '">' +
            val +
            '</span>' +
            (!isLast ? ',' : '') +
            '</span>';

          return str;
        };

      self.label = label;
      self.isComplex = false;

      el.classList.add('jsontree_node');
      el.innerHTML = template(label, val);

      self.el = el;

      labelEl = el.querySelector('.jsontree_label');

      labelEl.addEventListener('click', function (e) {
        if (e.altKey) {
          self.toggleMarked();
          return;
        }

        if (e.shiftKey) {
          document.getSelection().removeAllRanges();
          alert(self.getJSONPath());
          return;
        }
      }, false);
    }

    function NodeBoolean(label, val, isLast) {
      this.type = "boolean";

      _NodeSimple.call(this, label, val, isLast);
    }
    utils.inherits(NodeBoolean, _NodeSimple);

    function NodeNumber(label, val, isLast) {
      this.type = "number";

      _NodeSimple.call(this, label, val, isLast);
    }
    utils.inherits(NodeNumber, _NodeSimple);

    function NodeString(label, val, isLast) {
      this.type = "string";

      _NodeSimple.call(this, label, '"' + val + '"', isLast);
    }
    utils.inherits(NodeString, _NodeSimple);

    function NodeNull(label, val, isLast) {
      this.type = "null";

      _NodeSimple.call(this, label, val, isLast);
    }
    utils.inherits(NodeNull, _NodeSimple);

    function _NodeComplex(label, val, isLast) {
      if (this.constructor === _NodeComplex) {
        throw new Error('This is abstract class');
      }

      var self = this,
        el = document.createElement('li'),
        template = function (label, sym) {
          var comma = (!isLast) ? ',' : '',
            str = '\
                        <div class="jsontree_value-wrapper">\
                            <div class="jsontree_value jsontree_value_' + self.type + '">\
                                <b>' + sym[0] + '</b>\
                                <span class="jsontree_show-more">&hellip;</span>\
                                <ul class="jsontree_child-nodes"></ul>\
                                <b>' + sym[1] + '</b>' +
              '</div>' + comma +
              '</div>';

          if (label !== null) {
            str = '\
                        <span class="jsontree_label-wrapper">\
                            <span class="jsontree_label">' +
              '<span class="jsontree_expand-button"></span>' +
              '"' + label +
              '"</span> : \
                        </span>' + str;
          }

          return str;
        },
        childNodesUl,
        labelEl,
        moreContentEl,
        childNodes = [];

      self.label = label;
      self.isComplex = true;

      el.classList.add('jsontree_node');
      el.classList.add('jsontree_node_complex');
      el.innerHTML = template(label, self.sym);

      childNodesUl = el.querySelector('.jsontree_child-nodes');

      if (label !== null) {
        labelEl = el.querySelector('.jsontree_label');
        moreContentEl = el.querySelector('.jsontree_show-more');

        labelEl.addEventListener('click', function (e) {
          if (e.altKey) {
            self.toggleMarked();
            return;
          }

          if (e.shiftKey) {
            document.getSelection().removeAllRanges();
            alert(self.getJSONPath());
            return;
          }

          self.toggle(e.ctrlKey || e.metaKey);
        }, false);

        moreContentEl.addEventListener('click', function (e) {
          self.toggle(e.ctrlKey || e.metaKey);
        }, false);

        self.isRoot = false;
      } else {
        self.isRoot = true;
        self.parent = null;

        el.classList.add('jsontree_node_expanded');
      }

      self.el = el;
      self.childNodes = childNodes;
      self.childNodesUl = childNodesUl;

      utils.forEachNode(val, function (label, node, isLast) {
        self.addChild(new (Node(label, node, isLast)));
      });

      self.isEmpty = !Boolean(childNodes.length);
      if (self.isEmpty) {
        el.classList.add('jsontree_node_empty');
      }
    }

    utils.inherits(_NodeComplex, _NodeSimple);

    utils.extend(_NodeComplex.prototype, {
      constructor: _NodeComplex,

      addChild: function (child) {
        this.childNodes.push(child);
        this.childNodesUl.appendChild(child.el);
        child.parent = this;
      },

      expand: function (isRecursive) {
        if (this.isEmpty) {
          return;
        }

        if (!this.isRoot) {
          this.el.classList.add('jsontree_node_expanded');
        }

        if (isRecursive) {
          this.childNodes.forEach(function (item, i) {
            if (item.isComplex) {
              item.expand(isRecursive);
            }
          });
        }
      },

      collapse: function (isRecursive) {
        if (this.isEmpty) {
          return;
        }

        if (!this.isRoot) {
          this.el.classList.remove('jsontree_node_expanded');
        }

        if (isRecursive) {
          this.childNodes.forEach(function (item, i) {
            if (item.isComplex) {
              item.collapse(isRecursive);
            }
          });
        }
      },

      toggle: function (isRecursive) {
        if (this.isEmpty) {
          return;
        }

        this.el.classList.toggle('jsontree_node_expanded');

        if (isRecursive) {
          var isExpanded = this.el.classList.contains('jsontree_node_expanded');

          this.childNodes.forEach(function (item, i) {
            if (item.isComplex) {
              item[isExpanded ? 'expand' : 'collapse'](isRecursive);
            }
          });
        }
      },

      findChildren: function (matcher, handler, isRecursive) {
        if (this.isEmpty) {
          return;
        }

        this.childNodes.forEach(function (item, i) {
          if (matcher(item)) {
            handler(item);
          }

          if (item.isComplex && isRecursive) {
            item.findChildren(matcher, handler, isRecursive);
          }
        });
      }
    });

    function NodeObject(label, val, isLast) {
      this.sym = ['{', '}'];
      this.type = "object";

      _NodeComplex.call(this, label, val, isLast);
    }
    utils.inherits(NodeObject, _NodeComplex);

    function NodeArray(label, val, isLast) {
      this.sym = ['[', ']'];
      this.type = "array";

      _NodeComplex.call(this, label, val, isLast);
    }
    utils.inherits(NodeArray, _NodeComplex);

    function Tree(jsonObj, domEl) {
      this.wrapper = document.createElement('ul');
      this.wrapper.className = 'jsontree_tree clearfix';

      this.rootNode = null;

      this.sourceJSONObj = jsonObj;

      this.loadData(jsonObj);
      this.appendTo(domEl);
    }

    Tree.prototype = {
      constructor: Tree,

      loadData: function (jsonObj) {
        if (!utils.isValidRoot(jsonObj)) {
          alert('The root should be an object or an array');
          return;
        }

        this.sourceJSONObj = jsonObj;

        this.rootNode = new (Node(null, jsonObj, 'last'));
        this.wrapper.innerHTML = '';
        this.wrapper.appendChild(this.rootNode.el);
      },

      appendTo: function (domEl) {
        domEl.appendChild(this.wrapper);
      },

      expand: function (filterFunc) {
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

      collapse: function () {
        if (typeof this.rootNode.collapse === 'function') {
          this.rootNode.collapse('recursive');
        }
      },
    };

    return {
      create: function (jsonObj, domEl) {
        return new Tree(jsonObj, domEl);
      }
    };
  }




}
