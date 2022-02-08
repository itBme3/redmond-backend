import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CollectionType } from 'projects/redmond-fire-library/src/lib/models/collections';
import { MediaDoc, PageDoc_Project, PageDoc_Post, PageDoc_Team } from 'projects/redmond-fire-library/src/lib/models/docs';

@Component({
  selector: 'app-page-single', 
  templateUrl: './page-single.component.html',
  styleUrls: ['./page-single.component.scss']
})
export class PageSingleComponent implements OnInit {

  doc$: MediaDoc | PageDoc_Project | PageDoc_Team | PageDoc_Post
  collection: CollectionType

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.collection = this.route.snapshot.data['collection'];
    this.doc$ = this.route.snapshot.data['doc$'];
  }

}
