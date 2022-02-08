import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {  FormBuilder } from '@angular/forms';
import { flattenArray } from 'projects/redmond-fire-library/src/lib/services/funcs';
import {  FormFieldConditionalObj, FormStudioDoc, FORM_FIELD_CONDITION_OPERATORS } from 'projects/redmond-fire-library/src/lib/constants/contact-form';

@Component({
  selector: 'app-form-studio-conditional-input',
  templateUrl: './form-studio-conditional-input.component.html',
  styleUrls: ['./form-studio-conditional-input.component.scss']
})
export class FormStudioConditionalInputComponent implements OnInit {

  @Input() conditions: FormFieldConditionalObj[]
  @Input() formDoc: FormStudioDoc
  @Output() public updated = new EventEmitter<FormFieldConditionalObj[] | null>()

  conditionOperators = FORM_FIELD_CONDITION_OPERATORS
  
  constructor(private fb:FormBuilder) { }

  ngOnInit(): void {
    // this.formArr = this.fb.array([]);
    // this.formArr.valueChanges.subscribe(formValue => {
    //   this.formValue = formValue
    // });
    // this.conditions.forEach(condition => this.addCondition(condition))
  }

  get currentFields() {
    if (!!!this.formDoc?.formType) return [];
    if (this.formDoc.formType !== 'stepper')
      return Array.isArray(this.formDoc.fields) ? this.formDoc.fields : [];
    if (!!!this.formDoc?.stepper?.steps || !Array.isArray(this.formDoc.stepper.steps) || this.formDoc.stepper.steps.length === 0)
      return [];
    return flattenArray(this.formDoc.stepper.steps.map(step => !!!step?.fields?.map ? [] : step.fields))
  }



  addCondition(data: {conditionObj?: FormFieldConditionalObj | null, parentIndex?: number }) {
    const { key = null, operator = 'contains', value = null, or = null } = !!data?.conditionObj ? data.conditionObj : {};
    const { parentIndex = null } = data;
    if (!Array.isArray(this.conditions)) this.conditions = [];
    const isNested = typeof parentIndex === 'number'
    const newCondition: FormFieldConditionalObj = {
      key,
      operator,
      value, 
      or: isNested ? null : []
    };
    if (!isNested) {
      this.conditions.push(newCondition);
    } else {
      if (!Array.isArray(this.conditions[parentIndex].or))
        this.conditions[parentIndex].or = [];
      this.conditions[parentIndex].or.push(newCondition);
    }
    return this.updated.emit(this.conditions)
  }

}
