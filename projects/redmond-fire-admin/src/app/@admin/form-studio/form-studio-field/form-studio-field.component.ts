import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as FUNCS from 'projects/redmond-fire-library/src/lib/services/funcs';
import { FormStudioField, FormStudioFieldPhone } from 'projects/redmond-fire-library/src/lib/constants/contact-form';


@Component({
  selector: 'app-form-studio-field',
  templateUrl: './form-studio-field.component.html',
  styleUrls: ['./form-studio-field.component.scss'],
  animations: [
    trigger('animatedList', [
        transition( '* => *', [ 
              query( ':enter', [
                style( { opacity: 0, transform: 'scale(.7) translateY(100%)' } ),
                stagger( 13, [
                      animate( '.4s cubic-bezier(0, 1.01, 0, 1)', style( { opacity: 1, transform: 'scale(1) translateY(0)' } ) )
                ] )
              ], { optional: true } )
        ] )
    ])]
})
export class FormStudioFieldComponent implements OnInit {

  @Input() fieldObj: FormStudioField;
  @Input() editing: boolean = false
  @Output() public editingChange = new EventEmitter<boolean>()
  fieldForm: FormGroup
  conditionalArr: FormArray
  funcs = FUNCS;
  builderFields: {
      key: string;
      fieldType:  string;
      label: string;
      initialValue: string | FormStudioFieldPhone | number | boolean;
    }[];

  @Output() updated = new EventEmitter<FormStudioFieldComponent>()
  loadingForm: boolean = true;
  formSubscription: Subscription;
  formValue: any;

  removableFields = ['options.min', 'options.max', 'options.minLength', 'options.maxLength'];
  textInputFields = ['input', 'name', 'email', 'phoneNumber', 'firstName', 'lastName']


  constructor(private fb: FormBuilder, private elemRef: ElementRef) { }

  ngOnInit(): void {
    this.builderFields = [
          { key: 'required', label: 'Required', fieldType: 'checkbox', initialValue: true },
          { key: 'label', label: 'Label', fieldType: 'input', initialValue: '' },
          // { key: 'key', label: 'Key', fieldType: 'input', initialValue: '' },
          { key: 'initialValue', label: 'Initial Value', fieldType: this.fieldObj.fieldType,
            initialValue: ['checkbox', 'slider'].includes(this.fieldObj.fieldType) ? false
              : ['email', 'phone', 'input', 'textarea', 'email', 'name', 'firstName', 'lastName'].includes(this.fieldObj.fieldType) ? '' : null
          },
          { key: 'options.stacked', label: 'Stacked', fieldType: 'checkbox', initialValue: false },
          { key: 'options.inline', label: 'Inline', fieldType: 'checkbox', initialValue: false },
          { key: 'conditional', label: 'Conditional', fieldType: 'conditional', initialValue: null },
          { key: 'options.min', label: 'Min (num)', fieldType: 'number', initialValue: null },
          { key: 'options.max', label: 'Max (num)', fieldType: 'number', initialValue: null },
          { key: 'options.minLength', label: 'Min (char)', fieldType: 'number', initialValue: null },
          { key: 'options.maxLength', label: 'Max (char)', fieldType: 'number', initialValue: null },
      ]
    this.buildForm()
  }

  buildForm() {
    this.loadingForm = true;
    const formObject = {} 
    this.builderFields.forEach(field => {
      const currentVal = this.funcs.objectValue(field.key, this.fieldObj);
      formObject[field.key] = currentVal !== undefined ? currentVal : null;
    })
    this.fieldForm = this.fb.group(formObject);
    const newFieldObj: FormStudioField = {
      fieldType: this.fieldObj.fieldType,
      key: this.fieldObj.key,
      label: this.fieldObj.label,
      required: this.fieldObj.required,
      options: {}
    }
    this.formSubscription = this.fieldForm.valueChanges.subscribe(formValue => {
      this.formValue = formValue;
      for (const key in formValue)
        key.includes('.') ? this.funcs.setObjectValue(key, formValue[key] === undefined ? null : formValue[key], this.fieldObj)
          : this.fieldObj[key] = formValue[key] === undefined ? null : formValue[key];
    })
    FUNCS.setTimeout$(() => this.loadingForm = false, 500);
  }

  scrollTo(elem) {
    FUNCS.setTimeout$(() => {
      this.funcs.scrollTo({ elem });
    }, 400);
  }



}