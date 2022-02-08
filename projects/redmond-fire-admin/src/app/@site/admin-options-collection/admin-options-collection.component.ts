import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminCollectionService } from 'projects/redmond-fire-library/src/lib/services/admin-collections.service';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-options-collection',
  templateUrl: './admin-options-collection.component.html',
  styleUrls: ['./admin-options-collection.component.scss']
})
export class AdminOptionsCollectionComponent implements OnInit {

  subscriptions: Subscription[] = []
  optionsCollection
  optionsDoc$
  updateSubject = new Subject()
  constructor(private route: ActivatedRoute, private collectionService: AdminCollectionService ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.updateSubject.pipe(
      debounceTime(500),
      map(async ({ val, key, optionIndex }) =>
        await this.updateValue({val, key, optionIndex, debounce: false}))
    ).subscribe());
    this.subscriptions.push(this.route.data.subscribe(data => {
      const { optionsCollection } = data;

      this.optionsDoc$ = this.collectionService.optionsCollections[optionsCollection]

    }))
  }

  async updateValue(data: {val:any, key:string, optionIndex, debounce:boolean}) {
    // const {val, key, debounce = false} = data
    // if (!!debounce && !!val?.length)
    //   return this.updateSubject.next(({ val, key }));
    // this.block[key] = val;
    // try {
    //   this.block[key] = val;
    //   return this.updated.emit(this.block)
    //   // return await this.db.updateAt(this.doc.docPath, { blocks: this.blocks })
    //   //   .then(res => {
    //   //     this.updateBlocks.emit(this.blocks)
    //   //     return res
    //   //   })
    //   //   .catch(err => { throw new Error(err.message) })
    // } catch (errs) {
    //   console.error(errs.message)
    // }
  }

}


