import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'objectKeys'
})
export class ObjectKeysPipe implements PipeTransform {

  transform(obj: any) {
    let keys = Object.keys(obj);
      
    if (!!keys && Array.isArray(keys) && keys.length > 0) return keys;
    if (!!!obj[0]) return [];
    let done = false;
    keys = [];
    for (let i = 0; i < 9999; i++) {
      
      if (!!obj[i]) keys.push(`${i}`);
      if (!!!obj[i]) done = true;
      if (!!done) return keys;
      
    }
    return keys
      

  }

}
