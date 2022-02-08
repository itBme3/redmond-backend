import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-collection-filter',
  templateUrl: './collection-filter.component.html',
  styleUrls: ['./collection-filter.component.scss']
})
export class CollectionFilterComponent implements OnInit {

  @Input() selectedValue: string = null;
  @Input() filterLabel: string = null;
  @Input() options: { label: string; handle: string | null, selected?: boolean }[];
  @Input() placeholder: string = null
  
  @Output() selectionChanged = new EventEmitter();
  

  constructor() { }

  ngOnInit(): void {

  }

  changeSelected(val:any) {
    this.selectedValue = val;
    this.selectionChanged.emit(val);
  }

}
