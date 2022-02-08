import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml'
})
export class StripHtmlPipe implements PipeTransform {

  transform(value: string, ...args): string {
    return value.replace(/(<([^>]+)>)/gi, '').replace(/&nbsp;/g, '');
  }

}
