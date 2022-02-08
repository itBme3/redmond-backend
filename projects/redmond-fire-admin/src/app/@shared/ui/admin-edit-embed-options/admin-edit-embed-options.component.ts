import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { PdfViewerService } from 'projects/redmond-fire-library/src/lib/services/pdf-viewer.service';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';

export enum EmbedType {
  VIMEO = 'vimeo',
  PDF = 'pdf',
}

@Component({
  selector: 'app-admin-edit-embed-options',
  templateUrl: './admin-edit-embed-options.component.html',
  styleUrls: ['./admin-edit-embed-options.component.scss']
})
export class AdminEditEmbedOptionsComponent implements OnInit {

  EmbedType = EmbedType

  @ViewChild('vimeoPreview') vimeoElem;

  @Input() src: string = null;
  @Input() vimeoOptions: {
    autoplay?: boolean;
    muted?: boolean;
    controls?: boolean;
    background?: boolean;
    playsinline?: boolean;
    responsive?: true;
    dnt?: boolean; // prevent tracking
    loop?: boolean;
    color: '#ED4447';
    maxheight?: '90vh';
  } = {
    autoplay: false,
    controls: true,
    background: false,
    playsinline: true,
    dnt: false,
      muted: false,
      responsive: true,
    loop: true,
    color: '#ED4447',
    maxheight: '90vh',
  }

  editableOptions = {
    vimeo: Object.keys(this.vimeoOptions).filter(key => !['maxHeight', 'color', 'dnt', 'responsive'].includes(key)),
    pdf: []
  }


  constructor(private pdfViewer:PdfViewerService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  get embedType(): EmbedType {
    return this.src.split('.').pop().toLowerCase() === 'pdf' ? EmbedType.PDF :
      this.src.toLowerCase().includes('vimeo') && this.src.toLowerCase().includes('.com') ? EmbedType.VIMEO :
        this.src.toLowerCase().includes('.pdf') ? EmbedType.PDF :
          parseInt(this.src) > 10000 ? EmbedType.VIMEO : null;
  }

  updateOptions(key, value) {

    if (this.embedType === EmbedType.PDF)
      return this.setPdfEmbed();
    
    if (this.embedType === EmbedType.VIMEO)
      return this.setVimeoEmbed();
    
  }

  setPdfEmbed() {
    try {
      if (this.embedType !== EmbedType.PDF) return;
      return setTimeout$(() => { 
        this.pdfViewer.ready().then(() => {
          /* Invoke file preview */
          this.pdfViewer.previewFile(this.src, 'pdfPreviewDiv', {
            /* Pass the embed mode option here */
            embedMode: 'IN_LINE',
            viewerConfig: {}
          });
        });
      }, 500)
    } catch (errs) {
      console.error(errs)
    }
  }

  setVimeoEmbed() {
    console.log(this.src)
  } 

}
