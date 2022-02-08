import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { setTimeout$ } from 'projects/redmond-fire-library/src/lib/services/funcs';
import { PostService } from 'projects/redmond-fire-library/src/lib/services/post.service';
import { Subscription } from 'rxjs';
import * as InlineEditor from 'projects/redmond-fire-library/src/lib/assets/ckeditors/inline-editor/build/ckeditor.js';
import { tap } from 'rxjs/operators';
import { PageService } from 'projects/redmond-fire/src/app/services/page.service';
import { UiService } from 'projects/redmond-fire-library/src/lib/services/ui.service';

@Component({
  selector: 'app-page-post',
  templateUrl: './page-post.component.html',
  styleUrls: ['./page-post.component.scss']
})
export class PagePostComponent implements OnInit, OnDestroy {

  handle:string = null;
  doc: any = 'loading';
    public Editor = InlineEditor.Editor;

  animationName
  nextPost:any
  prevPost:any
  subscriptions: Subscription[] = []
  category: string

  constructor(private uiService: UiService, public router: Router, private route: ActivatedRoute, private postService: PostService, private pageService: PageService) {
    
  }


  ngOnInit(): void {

    this.uiService.setHasOverlayNav(false);


    this.route.data.subscribe(data => {
      this.doc = null;
      const { handle = null } = data;
      this.handle = handle;
      if (!!!handle?.length) return null;
      this.subscriptions.push(this.pageService.getPageDoc({ handle, collection: 'posts' })
        .pipe(tap(doc => {
          this.doc = doc;
          if (!!!this.doc?.docId) return this.router.navigateByUrl('/');
          this.postService.initPost(doc);
          this.category = this.doc.category;
          return doc;
        })).subscribe())
    });
    

    this.animationName = 'animate-backOutLeft'
    
    this.postService.nextPrevPosts.subscribe(obj => {
      this.nextPost = !!obj?.next ? obj.next : null;
      this.prevPost = !!obj?.prev ? obj.prev : null;
    });
    

  }

  navigateNextPrevPost(handle) {
    this.doc = 'loading'
    setTimeout$(() => {
      
      return this.router.navigateByUrl('/' + this.category + '/' + handle)
        .catch(err => console.error(err.message))
    }, 0)
  }

  
  ngOnDestroy(): void {
    this.subscriptions.forEach(s => !!s?.unsubscribe ? s.unsubscribe() : '')
  }

}
