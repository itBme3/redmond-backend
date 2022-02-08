import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DbService } from './db.service';
import { strip_Html } from './funcs';
import { map, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(private title: Title, private meta: Meta, private router: Router, private db: DbService) { }

  generateTags({ title = '', description = '', image = '' }) {
    const _title = `${title.toLowerCase().indexOf('redmond') === 0 ? '' : 'Redmond: '}${title}`;
    this.title.setTitle(_title);
    this.meta.updateTag({ name: 'og:url', content: `https://redomondconstruction.com${this.router.url}` })
    this.meta.updateTag({ name: 'og:title', content: _title })
    this.meta.updateTag({ name: 'og:description', content: description })
    this.meta.updateTag({ name: 'og:image', content: image })
    this.meta.updateTag({ name: 'twitter:card', content: 'summary' })
  }

  setMetaTags({ doc = null, collectionDoc = null, image = null }) {
    const title = !!doc?.title?.length ?
      doc.title :
      !!doc?.name?.length ?
        doc.name :
        collectionDoc?.title?.length ?
          collectionDoc.title :
          'Redmond Construction';
    const description = !!doc?.description?.length ?
      doc.description :
      !!doc?.excerpt?.length ?
        doc.excerpt :
        !!collectionDoc?.description?.length ?
          collectionDoc.description :
          typeof doc?.content === 'string' && !!doc?.content?.length ?
            `${strip_Html(doc.content).substr(0, 200).trim()}...` :
            'Building on relationships.';
    return this.generateTags({ title, description, image: this.getImage({ doc, image }) })
  }

  getImage({ doc, image }):string {
    const defaultImage = '/assets/media/redmond-favicon.png';
    if (!!image?.length) return image;
    const _image = !!doc?.image || !!doc?.images?.length ?
        !!doc?.image ?
          doc.image :
          doc.images[0] :
          doc?.blocks?.length && ['carousel', 'card'].includes(doc.blocks[0]?.blockType)?
          doc.blocks[0]?.blockType === 'carousel' && !!doc?.blocks[0]?.slides[0] && !!doc?.blocks[0]?.slides[0]?.image ?
            doc.blocks[0].slides[0].image :
          doc.blocks[0]?.blockType === 'card' && !!doc?.blocks[0]?.image ?
            doc?.blocks[0].image :
          null :
        null;
      if (!!!_image) return defaultImage;
    return !!!_image?.thumbs && !!!_image?.src ?
      _image :
      !!_image?.thumbs ?
        !!_image?.thumbs['1080'] ?
          _image.thumbs['1080'] :
        !!_image?.thumbs['1500'] ?
            _image.thumbs['1500'] :
          _image.src :
        _image.src;
  }

}
