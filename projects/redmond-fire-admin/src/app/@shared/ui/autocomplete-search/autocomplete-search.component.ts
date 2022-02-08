import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DbQueryObject, DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete-search',
  templateUrl: './autocomplete-search.component.html',
  styleUrls: ['./autocomplete-search.component.scss'],
  inputs: ['data']
})
export class AutocompleteSearchComponent implements OnInit {

  @Input() data: {
    field: string;
    type: string;
    selectedValue?: string | null;
    items?: any[];
    path?: string;
    search?: string;
    query?: Function | DbQueryObject;
    selected?: any[];
    canCreate?: boolean;
    selectMultiple?: boolean;
    fieldClasses?: string;
  }

  @Output() selectionChanged = new EventEmitter<any>()
  @Output() createNew = new EventEmitter<any>()  

  docs: any[] | 'loading' = 'loading'
  filteredOptions: Observable<any[]>;
  values: any[]
  selectedValues: any[];
  openPanel: boolean = false;
 
  constructor( private db: DbService  ) { }

  ngOnInit() {

    const { search = '', query = {}, selected = [], selectMultiple = true } = this.data;
    this.data = {...this.data, search, query, selected, selectMultiple }
    
    if (this.data.path) {
      return this.db.collection$(this.data.path, this.data.query)
        .pipe(take(1)).toPromise()
        .then(docs => {
          this.docs = docs;
          this.values = docs.map(d => d[this.data.field])
          this.selectedValues = this.data.selected.map(d => d[this.data.field])
          if(this.docs === 'loading') return
          this.filteredOptions = of(this.docs)
          return this.docs
        })
    } else if(!!this.data.items){
        this.docs = this.data.items;
        this.values = this.docs.map(d => d[this.data.field])
        this.selectedValues = this.data.selected.map(d => d[this.data.field])
        this.filteredOptions = of(this.docs)
        return this.docs
    }
  }

  filterFunc(value) {
    const filterValue = value.toLowerCase();
    if(this.docs === 'loading') return false
    return this.filteredOptions = of(this.docs
      .filter((doc: any) => !this.selectedValues.includes(doc[this.data.field]))
      .filter((doc: any) => (filterValue === '' || !!!filterValue || doc[this.data.field].toLowerCase().includes(filterValue)))
    );
  }

  emitSelection(selectedOption) {
    if (!!!this.data.selected) this.data.selected = [];
    this.data.selected = !!this.data.selectMultiple ? [...this.data.selected, selectedOption] : [selectedOption]
    this.selectedValues = this.data.selected.map( d => d[ this.data.field ] )
    this.selectionChanged.emit(this.data.selected)
    // inputElem.value = '';
    // inputElem.blur();
  }
  
  emitCreateNew(inputElem: HTMLInputElement) {
    this.createNew.emit(`${inputElem.value}`);
    inputElem.value = ''
    inputElem.blur()
  }
  
}
