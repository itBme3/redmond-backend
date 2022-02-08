import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { CKEditorComponent } from '@ckeditor/ckeditor5-angular';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import * as InlineEditor from 'projects/redmond-fire-library/src/lib/assets/ckeditors/inline-editor/build/ckeditor.js';
import { DEFAULT_WYSIWYG_EDITOR_CONFIG, DEFAULT_TOOLBARS } from 'projects/redmond-fire-library/src/lib/constants/wysiwyg-settings';


@Component({
  selector: 'app-wysiwyg-editor',
  templateUrl: './wysiwyg-editor.component.html',
  styleUrls: ['./wysiwyg-editor.component.scss']
})
export class WysiwygEditorComponent implements OnInit {

  @Input() data: string;
  @Input() config: {[key:string]: any};
  @Input() toolbar: any[] | 'simple' | null = null;
  @Input() doc: { docPath: string;[key: string]: any; }
  @Input() readOnly: boolean = false;
  @Output() changed = new EventEmitter<any>()
  
  @ViewChild( 'editor' ) editorElem: CKEditorComponent;
  originalData: string;

  changeSubject = new Subject()

  public getEditor() {
      return this.editorElem.editorInstance;
  }
  
  defaultConfig

  subscriptions: Subscription[] = [];

  focused: boolean = false
  editor: any = null
  
  public Editor = InlineEditor.Editor;
  
  constructor(private elemRef: ElementRef) { }

  ngOnInit(): void {

    
    if (this.toolbar !== null) {
      DEFAULT_WYSIWYG_EDITOR_CONFIG.toolbar = !!this.toolbar?.length ? this.toolbar : this.toolbar === 'simple' ? DEFAULT_TOOLBARS.simple :  DEFAULT_TOOLBARS.toolbar
    }
    this.config = { ...DEFAULT_WYSIWYG_EDITOR_CONFIG, toolbar: this.readOnly ? [] :  DEFAULT_WYSIWYG_EDITOR_CONFIG.toolbar };
    this.subscriptions.push(this.changeSubject.pipe(
      debounceTime(300),
      map(() => {
        if (this.originalData !== this.data) return;
        this.originalData = this.data;
        this.changed.emit(this.data)
      })).subscribe()
    );
    this.originalData = `${this.data}`
  }

  onReady(editor) {
    this.editor = editor;
  }

  editorChanged(change) {
    this.data = change.editor.getData();
    if (change.event.name === 'blur' && this.data !== this.originalData) {
      this.originalData = this.data;
      if (this.elemRef.nativeElement.classList.contains('editor-focused'))
        this.elemRef.nativeElement.classList.remove('editor-focused')
      this.changed.emit(change.editor.getData())
    }
    if (change.event.name === 'focus') {
      const editableElem = change.editor.ui.getEditableElementsNames();
      if (this.elemRef.nativeElement.classList.contains('editor-focused')) return;
      return this.elemRef.nativeElement.classList.add('editor-focused')
    }
    if (this.data === this.originalData) return;
    this.changeSubject.next();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s.unsubscribe ? s.unsubscribe() : '')
  }

}
