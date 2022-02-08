import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  footerLinks = [
    {
      title: 'COVID19 Safety Practices',
      text: 'Learn More'
    },
    {
      title: 'Get In Touch',
      text: '312.643.5018'
    },
    {
      title: 'Corporate Office',
      text: '319 W Ontario, Suite'
    },
  ]

  constructor() { }

  ngOnInit(): void {
  }


}
