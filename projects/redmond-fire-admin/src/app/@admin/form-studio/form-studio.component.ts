import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { defaultStudioFormField, DEFAULT_STUDIO_FORM_BASIC, DEFAULT_STUDIO_FORM_STEPPER, FormStudioDoc, FORM_STUDIO_FIELD_OPTIONS, STUDIO_FORM_INITIAL_VALUES } from 'projects/redmond-fire-library/src/lib/constants/contact-form';
import { Subscription } from 'rxjs';
import { DbSearchInputData } from '../../@shared/ui/db-search/db-search.component';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs';

@Component({
  selector: 'app-form-studio',
  templateUrl: './form-studio.component.html',
  styleUrls: ['./form-studio.component.scss']
})
export class FormStudioComponent implements OnInit {

  @Input() formDoc: FormStudioDoc;
  @ViewChild('searchFieldsInput') searchFieldsInput
  formGroups: {[key:number]: FormGroup} = {};
  formValue:any
  loadingForm: boolean;
  defaultInitialValues = STUDIO_FORM_INITIAL_VALUES;
  valueSubscriptions: {[key:number]: Subscription} = {};

  removeable = ['conditional', 'icon', 'excerpt', 'initialValue']

  fieldTypes = {
    input: ['input', 'label', 'key', 'email', 'label', 'key'],
    textarea: ['textarea'],
    checkbox: ['required', 'options.stacked', 'options.inline', 'editable'],
    select: ['orientation'],
    wysiwyg: ['title', 'excerpt', 'content']
  }

  globalFields: {
    field: ['label', 'key', 'required', 'initialValue', 'icon', 'options.stacked', 'options.inline'],
    step: ['label', 'key', 'orientation', 'editable']
  }

  matFields = [ 'input','textarea','checkbox', 'select']

  addingField: boolean = false;

  editingField: string | null = null;
  editingStep: string | null = null;
  editingSection: 'success' | 'admin' | 'form' = 'form'

  fieldOptions = FORM_STUDIO_FIELD_OPTIONS

  search: string = ''
funcs = FUNCS
  
  constructor(private fb: FormBuilder) {
    this.matFields = [...this.fieldTypes.input, ...this.fieldTypes.select]
  }

  ngOnInit(): void {
    this.buildForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.formDoc.firstChange) return;
    this.buildForm();
  }

  formObject(fields) {
    if (!Array.isArray(fields) || fields.length === 0) return null;
    const formObj: { [key: string]: any } = {};
    fields.forEach((formField) => {
      const initialValue = formField.initialValue !== undefined ? formField.initialValue : this.defaultInitialValues[formField.fieldType];
      const fieldValidations = [];
      if (formField.required && ['checkbox'].includes(formField.fieldType)) fieldValidations.push(Validators.required);
      if (formField.fieldType === 'email') fieldValidations.push(Validators.email);
      if (typeof formField.fieldOptions === 'object' && !Array.isArray(formField.fieldOptions) && Object.keys(formField.fieldOptions).length > 0)
        ['min', 'max', 'minLength', 'maxLength'].forEach(key => {
          if (typeof formField?.fieldOptions[key] === 'number') {
            fieldValidations.push(
              key === 'min' ? Validators.min(formField.fieldOptions[key])
                : key === 'max' ? Validators.max(formField.fieldOptions[key])
                  : key === 'maxLength' ? Validators.maxLength(formField.fieldOptions[key])
                    : Validators.minLength(formField.fieldOptions[key])
            )
          }
        });
      formObj[formField.key] = fieldValidations.length > 0 ? [initialValue, fieldValidations] : initialValue
    });
    return formObj
  }
  
  buildForm() {
    this.loadingForm = true;
    const formObj: any = {
      title: this.formDoc.title,
      excerpt: this.formDoc.excerpt,
      fieldType: !!this.formDoc.formType ? this.formDoc.formType : 'basic',
      inquireType: !!this.formDoc.inquireType ? this.formDoc.inquireType : 'general',
      'success.message': !!this.formDoc.success.message ? this.formDoc.success.message : null,
      'success.redirect': !!this.formDoc.success.redirect ? this.formDoc.success.redirect : null,
      'submissions.phone.to': this.funcs.objectValue('submissions.phone.to', this.formDoc),
      'submissions.email.to': this.funcs.objectValue('submissions.email.to', this.formDoc),
      'submissions.email.bcc': this.funcs.objectValue('submissions.email.bcc', this.formDoc),
      'submissions.email.subject': this.funcs.objectValue('submissions.email.subject', this.formDoc),
    };
    FUNCS.setTimeout$(() => {
      if (this.formDoc.formType !== 'stepper') {
        let fieldObjs = this.formObject(this.formDoc.fields);
        fieldObjs = !!fieldObjs && fieldObjs !== {} ? [fieldObjs] : [];
        this.formGroups[0] = this.fb.group({
          ...formObj,
          fields: this.fb.array([fieldObjs])
        })
        this.valueSubscriptions[0] = this.formGroups[0].valueChanges.subscribe(formValue => {
          this.formValue[0] = formValue;
        });
      }
      if (this.formDoc.formType === 'stepper') {
        if (!!!this.formDoc?.stepper)
          this.formDoc.stepper = DEFAULT_STUDIO_FORM_STEPPER.stepper;
        if (!!!this.formDoc?.stepper?.steps?.length || this.formDoc?.stepper?.steps?.length === 0)
          this.formDoc.stepper.steps = DEFAULT_STUDIO_FORM_STEPPER.stepper.steps;
        for (let i = 0; i < this.formDoc.stepper.steps.length; i++) {
          const fields = this.formObject(!!this.formDoc?.stepper?.steps[i]?.fields ? this.formDoc.stepper.steps[i].fields : DEFAULT_STUDIO_FORM_BASIC.fields[0]);
          if (!!this.valueSubscriptions[i] && this.valueSubscriptions[i]?.unsubscribe)
             this.valueSubscriptions[i].unsubscribe();
          this.formGroups[i] = this.fb.group({
              fields: this.fb.array(!!fields ? [fields] : []),
              label: this.formDoc.stepper.steps[i].key,
              key: this.formDoc.stepper.steps[i].key,
              editable: !!this.formDoc.stepper.steps[i].key || this.formDoc.stepper.steps[i].key === undefined,
            });
            this.valueSubscriptions[i] = this.formGroups[i].valueChanges.subscribe(formValue => {
              this.formValue[i] = formValue;
            });
        }
      }
      this.loadingForm = false;
    }, 0);
  }

  startAddingFields() {
    this.addingField = true
    FUNCS.setTimeout$(() => {
      this.searchFieldsInput.nativeElement.select()
    }, 50)
  }

  addField(fieldType, stepIndex: number | null = null) {
    const newField = defaultStudioFormField(`${fieldType}`, this.formDoc);
    if (typeof stepIndex !== 'number') {
      this.formDoc.fields.push(newField);
    } else {
      this.formDoc.stepper.steps[stepIndex].fields.push(newField)
    }
    this.addingField = false
    this.buildForm();
  }

  getFieldsForms(indx) {
    const fieldsForms = this.formGroups[indx].get('fields') as FormArray;
      return fieldsForms
  }

}


/*
---------------------------------------
COMPONENT: FORM COLLECTION
---------------------------------------
*/

@Component({
  selector: 'form-studio-collection',
  templateUrl: './form-studio-collection.component.html',
  styles: [``]
})
export class FormStudioCollectionComponent implements OnInit {
  
  searchData: DbSearchInputData = {
    path: 'forms',
    query: { orderBy: 'updatedAt,des', limit: 6 }
  }
  displayData = {
    layout: 'list',
    titleField: 'title',
    textFields: ['excerpt', 'handle'],
    showStatus: false,
    showTags: false
  }

  constructor() { }
  
  ngOnInit() {

  }

}