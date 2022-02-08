import { Component, OnInit } from '@angular/core';
import { SiteNavigationService } from 'projects/redmond-fire-library/src/lib/services/site-navigation.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  // footerLinks = [
  //   {
  //     title: 'COVID19 Safety Practices',
  //     text: 'Learn More',
  //     link: 'https://firebasestorage.googleapis.com/v0/b/redmond-fire.appspot.com/o/public%2F1630677526013_COVID%20PROTOCOL%202021.pdf?alt=media&token=be3c423d-ca47-410f-9214-9ae6c11076cd',
  //     blank: true
  //   },
  //   {
  //     title: 'Get In Touch',
  //     text: '312.643.5018'
  //   },
  //   {
  //     title: 'Corporate Office',
  //     text: '319 W Ontario Suite 1 Chicago, IL 60654'
  //   },
  // ]
  footerLinks

  constructor(private siteNav: SiteNavigationService) { }

  async ngOnInit() {
    await this.siteNav.initSiteNavAndFooter();
    this.footerLinks = this.siteNav.footer.items;
  }


}
