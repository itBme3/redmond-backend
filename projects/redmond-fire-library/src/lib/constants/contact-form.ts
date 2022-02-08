import { capitalize, flattenArray, randomInt } from "../services/funcs";


export interface FormStudioDoc {
      title: string;
      formType : 'basic' | 'stepper';
      inquireType?: 'general' | 'scheduling' | null;
      fields?: FormStudioField[];
      stepper?: FormStudioStepper;
      excerpt?: string;
      success: {
            redirect?: string;
            message?: string;
      },
      submissions: {
            phone?: {
                  to: string[]
            },
            email?: {
                  subject: string;
                  bcc: string[];
                  to: string
            },
      }
}



export interface FormStudioField {
      fieldType: FormStudioFieldType;
      required: boolean;
      key: string;
      initialValue?: string | FormStudioFieldPhone | number | boolean;
      label?: string;
      icon?: string;
      conditional?: FormFieldConditionalObj[];
      inputOptions?: string[] | {
            value: any;
            label: string;
            icon?: string;
      }[];
      options?: {
            stack?: boolean;
            inline?: boolean;
            min?: number;
            max?: number;
            minLength?: number;
            maxLength?: number;
      }
}

export type FormStudioFieldType = 'input' | 'textarea' | 'checkbox' | 'number' | 'phoneNumber' | 'name' | 'email' | 'select' | 'radio' | 'date' | 'content';

export interface FormFieldConditionalObj {
      key: string;
      operator: FormFieldConditionOperator;
      value: string | number;
      or?: FormFieldConditionalObj[];
}

export type FormFieldConditionOperator = '==' | 'contains' | 'does not contain' | '!=' | '>' | '>=' | '<' | '<=' | 'char count >' | 'char count <';
export const FORM_FIELD_CONDITION_OPERATORS: FormFieldConditionOperator[] = ['==', 'contains', 'does not contain', '!=', '>', '>=', '<', '<=', 'char count >', 'char count <']

export type FormStudioFieldPhone = [string /*areacode*/, string /* line */]

export interface FormStudioStepper {
      steps?: FormStudioFieldStep[];
      orientation?: 'horizontal' | 'vertical';
      isLinear?: boolean;
}

export interface FormStudioFieldStep {
      fields: FormStudioField[];
      label: string;
      key: string;
      editable?: boolean;
}

export const DEFAULT_STUDIO_FORM_BASIC:FormStudioDoc = {
      title: 'New Form',
      success: {},
      submissions: {},
      formType: 'basic',
      inquireType: 'general',
      fields: [
            {
                  fieldType: 'input',
                  key: 'firstName',
                  label: 'First Name',
                  required: true,
                  conditional: []
            },
            {
                  fieldType: 'email',
                  key: 'email',
                  label: 'Email',
                  required: false,
                  icon: 'gIcon,email-o',
                  conditional: []
            },
            {
                  fieldType: 'textarea',
                  key: 'message',
                  label: 'Message',
                  required: true,
                  icon: 'gIcon,messages1',
                  conditional: []
            }
            
      ]
}



export const STUDIO_FORM_INITIAL_VALUES = {
      input: '',
      textarea: '',
      checkbox: false,
      number: null,
      phoneNumber: {area: '', line: ''},
      email: '',
      select: null,
      radio: null,
      date: null,
      content: ''
}


export const defaultStudioFormField = (fieldType, formDoc) => {
      const keys = (() => {
            if (!!!formDoc || (!!!formDoc.fields && !!!formDoc.stepper?.steps)) return [];
            return formDoc.formType !== 'stepper' ? formDoc.fields.map(f => f.key) : flattenArray(formDoc.stepper.steps.map(s => [s.key, ...s.fields.map(f => f.key)] ))
      })();
      const labels = (() => {
            if (!!!formDoc || (!!!formDoc.fields && !!!formDoc.stepper?.steps)) return [];
            return formDoc.formType !== 'stepper' ? formDoc.fields.map(f => f.label) : flattenArray(formDoc.stepper.steps.map(s => [s.label, ...s.fields.map(f => f.label)] ))
      })();
      const getUnique = (field: 'key' | 'label', _val: any) => {
            let val = field === 'key' ? `f-${randomInt(10000000, 99999999)}` : capitalize(!!_val ? _val : fieldType).split('-').join(' ').split('_').join(' ');
            const searchAgainst = field === 'key' ? keys : labels;
            if (!searchAgainst.includes(val)) return val;
            let done = false;
            for (let i = 0; i < 999; i++) {
                  if (!!done) return val;
                  const newStrng = field === 'key' ? `f-${randomInt(10000000, 99999999)}` : `${val} (${i})`;
                  if (!searchAgainst.includes(newStrng)) {
                        done = true;
                        return newStrng
                  }
            }
            return val
      }
      return {
            fieldType,
            label: getUnique('label', fieldType),
            key: getUnique('key', fieldType),
            required: false,
            conditional: [],
            initialValue: STUDIO_FORM_INITIAL_VALUES[fieldType] === undefined ? null : STUDIO_FORM_INITIAL_VALUES[fieldType],
            options: {},
            inputOptions: ['select', 'radio'].includes(fieldType) ?
                  [ { label: 'First', value: 1}, { label: 'Second', value: 2 }]
                  : null
      }
}




export const DEFAULT_STUDIO_FORM_STEPPER: FormStudioDoc = {
      ...DEFAULT_STUDIO_FORM_BASIC,
      formType: 'stepper',
      stepper: {
            steps: [
                  {
                        label: 'First Step',
                        key: 'first-step',
                        fields: [
                              ...DEFAULT_STUDIO_FORM_BASIC.fields,
                              {
                                    fieldType: 'input',
                                    key: 'first-question',
                                    label: 'First Question',
                                    required: false,
                              }
                        ]
                  },
                  {
                        label: 'Second Step',
                        key: 'second-step',
                        fields: [
                              {
                                    fieldType: 'checkbox',
                                    key: 'second-question',
                                    label: 'Second Question',
                                    required: true,
                              }
                        ]
                  }
            ]
      }
}

delete DEFAULT_STUDIO_FORM_STEPPER.fields;

export const FORM_STUDIO_FIELD_OPTIONS = {
	input: { 
		label: 'Single Line Input',
		color: 'light-blue',
		icon: 'gIcon,input'
	},
	textarea: { 
		label: 'Multiple Line Input',
		color: 'cyan',
		icon: 'gIcon,input'
	},
	email: { 
		label: 'Email',
		color: 'blue',
		icon: 'gIcon,email-o'
	},
	phoneNumber: { 
		label: 'Phone Number',
		color: 'blue',
		icon: 'gIcon,phone'
	},
	checkbox: { 
		label: 'Checkbox',
		color: 'red',
		icon: 'gIcon,checkbox'
	},
	radio: { 
		label: 'Radio Select',
		color: 'purple',
		icon: 'gIcon,radio-buttons'
	},
	select: { 
		label: 'Dropdown Select',
		color: 'purple',
		icon: 'gIcon,radio-buttons'
	},
	file: { 
		label: 'File Upload',
		color: 'orange',
		icon: 'gIcon,file-upload'
	},
	content: { 
		label: 'Content',
		color: 'light-red',
		icon: 'gIcon,content'
	},
	name: { 
		label: 'Name',
		color: 'green',
		icon: 'gIcon,identity'
	}

}

