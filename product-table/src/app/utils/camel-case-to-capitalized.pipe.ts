import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'camelCaseToCapitalized',
  standalone: true
})
export class CamelCaseToCapitalizedPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    return value.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); });
  }

}
