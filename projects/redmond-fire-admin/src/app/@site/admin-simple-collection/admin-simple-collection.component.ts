import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SimpleCollectionType } from 'projects/redmond-fire-library/src/lib/models/collections';
import { ADMIN_COLORS } from 'projects/redmond-fire-library/src/lib/constants/admin-pages';
import { animatedList } from 'projects/redmond-fire-library/src/lib/constants/animations';
import {  Subscription } from 'rxjs';
import { SiteContentService } from '../../services/site-content.service';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';

@Component({
  selector: 'app-admin-simple-collection',
  templateUrl: './admin-simple-collection.component.html',
  styleUrls: ['./admin-simple-collection.component.scss'],
   animations: animatedList
})
export class AdminSimpleCollectionComponent implements OnInit, OnDestroy {
  
  doc: { [key: string]: any }
  subscriptions: Subscription[] = [];
  listKey = 'links'
  collectionKeys = {
    navigation: ['title', 'link'],
    footer: ['title', 'links:text,link' ],
    hiring: ['title', 'content'],
  }
  
  collection: SimpleCollectionType
  adminColors = ADMIN_COLORS
  expanded: number = null
  removing:number = null

  drop(event: CdkDragDrop<any[]>, params: { [key: string]: any } = {}) {
    const { parentIndex, parentKey } = params;
    moveItemInArray(
      event.container.data,
      event.previousIndex,
      event.currentIndex);
    if (!!parentKey && typeof parentIndex === 'number') {
      this.doc[this.listKey][parentIndex][parentKey] = event.container.data;
    } else {
      this.doc[this.listKey] = event.container.data;
    }
    this.updateDoc(this.doc)
  }
  
  constructor(private route:ActivatedRoute, private siteContent: SiteContentService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.route.data.subscribe(data => {
      const { doc = null, listKey = this.listKey, collection = null} = data;
      this.doc = !!!listKey ? doc : {
        ...doc,
        [listKey]: doc[listKey].map((x, i) => {return {...x, tempId: `${i}${i}${i}`}})
      };
      this.listKey = listKey;
      this.collection = collection
    }));
  }

  updateValue(value, params) {
    const { itemIndex = null, parentIndex = null, parentKey = null, key = null } = params;
    if (!!!parentKey) {
      this.doc[this.listKey][itemIndex][key] = value;
    } else if (!!parentKey && typeof parentIndex === 'number') {
      this.doc[this.listKey][parentIndex][parentKey][itemIndex][key] = value;
    } else {
      return;
    }
    this.updateDoc();
  }

  updateDoc(doc = this.doc) {
    setTimeout$(() => {
      this.doc = doc;
      const _doc = JSON.parse(JSON.stringify(doc));
      _doc[this.listKey].forEach(x => delete x.tempId)
      this.siteContent.updateDoc(doc);
    }, 0)
  }

  removeItem(indx, params: { [key: string]: any } = {}) {
    const { parentIndex = null, parentKey = null } = params;
    if (!!parentKey && typeof parentIndex === 'number') {
      this.doc[this.listKey][parentIndex][parentKey].splice(indx, 1);
    } else if (!!!parentKey && !!this.doc[this.listKey] && !!this.doc[this.listKey][indx]) {
      this.doc[this.listKey].splice(indx, 1);
    } else {
      return;
    }
    this.updateDoc(this.doc)
  }

  getConnectedList(): any[] {
    return this.doc[this.listKey].map((x, index) => `${x.id}`);
  }

  addItem(params: { [key: string]: any }) {
    const { parentKey = null, parentIndex = null } = params;
    console.log(params)
    const newItems = {
      navigation: {
        title: '',
        link: null,
      },
      footer: {
        title: '',
        links: [
          { text: '', link: null }
        ],
      },
      hiring: {
        title: '',
        content: null,
      }
    }
    const newItem = !!parentKey ? newItems[this.collection][parentKey][0] : newItems[this.collection];
    if (!!!newItem) return;
    if (!!parentKey) {
      if (!Array.isArray(this.doc[this.listKey][parentIndex][parentKey]))
        this.doc[this.listKey][parentIndex][parentKey] = [];
      return this.doc[this.listKey][parentIndex][parentKey].push(newItem);
    }
    if (!Array.isArray(this.doc[this.listKey]))
      this.doc[this.listKey] = [];
    this.doc[this.listKey].push(newItem);
    setTimeout$(() => {
      this.expanded = this.doc[this.listKey].length - 1
    }, 250)
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe( ) : '')
  }



}
