import { Component, Input, OnInit } from '@angular/core';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { PageDoc } from 'projects/redmond-fire-library/src/lib/models/docs'

@Component({
  selector: 'app-admin-site-page-single-simple',
  templateUrl: './admin-site-page-single-simple.component.html',
  styleUrls: ['./admin-site-page-single-simple.component.scss']
})
export class AdminSitePageSingleSimpleComponent implements OnInit {

  @Input() doc: PageDoc;
  keys = {
    post: ['title', 'handle','category', 'excerpt', 'author'],
    team: ['name', 'bio', 'jobTitle', 'linkedIn'],
  }

  public redirectsExpanded:boolean = false;

  constructor(private db: DbService) { }

  ngOnInit(): void {
  }


  updatingDoc(e) {
    console.log({ e })
  }

}
