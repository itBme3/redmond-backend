import { Component, OnInit } from '@angular/core';
import {ParseClasses} from 'projects/redmond-fire-library/src/lib/services/parse-class-names'
import { ScreenBreakpoint } from 'projects/redmond-fire-library/src/lib/models/responsive';


@Component({
  selector: 'app-test-parse-classes',
  templateUrl: './test-parse-classes.component.html',
  styleUrls: ['./test-parse-classes.component.scss']
})
export class TestParseClassesComponent implements OnInit {

  classString = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  parseClasses = new ParseClasses()
  val = null
  responsive: ScreenBreakpoint = ScreenBreakpoint.DEFAULT
  defaultClassName:string = 'grid-cols-2'
  defaultClassNamespace:string = 'grid-cols'

  constructor() { }

  ngOnInit(): void {
  }

}
