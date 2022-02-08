import { Pipe, PipeTransform } from '@angular/core';
import * as funcs from 'projects/redmond-fire-library/src/lib/services/funcs';



@Pipe({
  name: 'formatString'
})
export class FormatStringPipe implements PipeTransform {

  constructor( ) {}
  
  transform(value: string, type: 'handle' | 'camel' | 'fromCamel' | 'fromHandle' | 'fromPathHandle' | 'capitalize'): string {
    switch (type) {
      case 'handle': return funcs.handleize(value);
      case 'camel': return funcs.camelcase(value);
      case 'fromCamel': return (() => funcs.fromCamelCase(value))();
      case 'fromHandle': return value.split('-').join(' ');
      case 'fromPathHandle': return value.split('_').join(' ');
      case 'capitalize': return funcs.capitalize(value);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
  }

}
