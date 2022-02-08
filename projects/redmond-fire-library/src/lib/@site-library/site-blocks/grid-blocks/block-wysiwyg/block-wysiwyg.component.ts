import { Component, Input, OnInit } from '@angular/core';
import * as InlineEditor from 'projects/redmond-fire-library/src/lib/assets/ckeditors/inline-editor/build/ckeditor.js';

@Component({
  selector: 'app-block-wysiwyg',
  templateUrl: './block-wysiwyg.component.html',
  styleUrls: ['./block-wysiwyg.component.scss']
})
export class BlockWysiwygComponent implements OnInit {

  public Editor = InlineEditor.Editor;
  @Input() data: string;
  @Input() hidden: boolean = false;
  
  constructor() { }

  ngOnInit(): void {
  }

}
