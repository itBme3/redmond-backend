import { sandboxOf } from 'angular-playground';
import { DbService } from 'projects/redmond-fire-library/src/lib/services/db.service';
import { SharedModule } from 'projects/redmond-fire-admin/src/app/@shared/shared.module';
import { AdminReorderingCollectionComponent } from './admin-reordering-collection.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { SiteContentService } from '../../../services/site-content.service';


class SiteContentMockService {
  sends = 0;
  allOrderedProjects$:Observable<any[]> = of([
    {
      "order": 0,
      "docPath": "admin/projects/collection/6kpWHkET3NGdhwNJPlar",
      "title": "Verilife Rosemont"
    },
    {
      "order": 1,
      "docPath": "admin/projects/collection/FyGXu6sqp7P6MFPA72lS",
      "title": "Verilife River North"
    },
    {
      "order": 2,
      "docPath": "admin/projects/collection/bJERTiRYDTncZdmxHYPw",
      "title": "Pinterest"
    },
    {
      "order": 3,
      "docPath": "admin/projects/collection/E8JddPWTaUcxo8tL9Xcu",
      "title": "G2"
    },
    {
      "order": 4,
      "docPath": "admin/projects/collection/B8reemXwomGIJe5xBHDz",
      "title": "175 W Jackson"
    },
    {
      "order": 5,
      "docPath": "admin/projects/collection/tLmko2gZq8Xs76wluEt7",
      "title": "Billtrust"
    },
    {
      "order": 6,
      "docPath": "admin/projects/collection/vUAuOgtQ5Qp6hm2LVD03",
      "title": "Verilife Arlington Heights"
    },
    {
      "order": 7,
      "docPath": "admin/projects/collection/IrsIuuvtx2wsywEfi7Uv",
      "title": "PerkSpot"
    },
    {
      "order": 8,
      "docPath": "admin/projects/collection/Cep6LotM5Q3CMl3E4GIc",
      "title": "Litera "
    },
    {
      "order": 9,
      "docPath": "admin/projects/collection/t50QFGzIj8jCtQ1ol83l",
      "title": "Help At Home"
    },
    {
      "order": 10,
      "docPath": "admin/projects/collection/LnTAnwmFwW5ogLPMrvrp",
      "title": "Intermatic"
    },
    {
      "order": 11,
      "docPath": "admin/projects/collection/Um25cFijxB1m3fasres4",
      "title": "WellCare"
    },
    {
      "order": 12,
      "docPath": "admin/projects/collection/YEYF3hoGL3g2GAoOey2a",
      "title": "CardConnect"
    },
    {
      "order": 13,
      "docPath": "admin/projects/collection/LhuBd5MW4EUiiY6RkxEB",
      "title": "Codeverse Chicago "
    },
    {
      "order": 14,
      "docPath": "admin/projects/collection/5wK9Bxcc0XVwrBLhblLG",
      "title": "Fermilab"
    },
    {
      "order": 15,
      "docPath": "admin/projects/collection/jdTWbA9oeLKtvtVYZwWG",
      "title": "Oak Wealth Advisors"
    },
    {
      "order": 16,
      "docPath": "admin/projects/collection/iO8ynS3m1JQhd1B5LOlt",
      "title": "Servcorp on Lake"
    },
    {
      "order": 17,
      "docPath": "admin/projects/collection/YmYj8rZfdun3uOcrfeA4",
      "title": "Hanmi Bank"
    },
    {
      "order": 18,
      "docPath": "admin/projects/collection/facMKvKTGa86lzLkXsm8",
      "title": "ParkerGale"
    },
    {
      "order": 19,
      "docPath": "admin/projects/collection/FF7DtqGlJhahjN1usmUy",
      "title": "Servcorp on Wacker"
    },
    {
      "order": 20,
      "docPath": "admin/projects/collection/HM04eW5SC6dA85pJBOV1",
      "title": "Jellyvision"
    },
    {
      "order": 21,
      "docPath": "admin/projects/collection/Qudu2DmWjeDRZcsLT05Y",
      "title": "The Onion"
    },
    {
      "order": 22,
      "docPath": "admin/projects/collection/2Vdij7wuPYMpCGP4Qt0S",
      "title": "Industrious"
    },
    {
      "order": 23,
      "docPath": "admin/projects/collection/1NDKrLzSXbwt1dTrcjqt",
      "title": "Codeverse Wilmette"
    },
    {
      "order": 24,
      "docPath": "admin/projects/collection/3jhMmo7bYElrw8oIQKPd",
      "title": "ABC Supply"
    },
    {
      "order": 25,
      "docPath": "admin/projects/collection/zD3dn4lCHy6X2Ot9rYsi",
      "title": "Codeverse Naperville"
    },
    {
      "order": 26,
      "docPath": "admin/projects/collection/qcW1qOsh2mDzJEmkNE5g",
      "title": "205 W. Randolph"
    }
  ].map(d => { return { ...d, docId: d.docPath.split('/').pop() } }));
}

class DbMockService {
  
  updateAt(docPath, doc) {
    console.log('updated: ', docPath)
  }

}

export default sandboxOf(AdminReorderingCollectionComponent, {
   imports: [SharedModule, BrowserAnimationsModule],
  providers: [
    {
      provide: SiteContentService,
      useClass: SiteContentMockService
    },
    {
      provide: DbService,
      useClass: DbMockService
    }
  ]
}).add('default', {
  template: `
    <div class="w-screen h-screen bg-cyan">
    <button mat-raised-button class="bg-yellow text-black"
      (click)="reorderingProjects.opened = !reorderingProjects.opened">toggle</button>
      <app-admin-reordering-collection #reorderingProjects></app-admin-reordering-collection>
    </div>
    `,
  context: {
    opened: false,
    }
  });
