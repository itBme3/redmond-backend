import { Component, Input, OnInit, Output,EventEmitter, ViewChild, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'projects/redmond-fire-library/src/lib/services/user.service';
import { AngularFireFunctions } from '@angular/fire/functions';
import { take } from 'rxjs/operators';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';



@Component({
  selector: 'app-contact-forms',
  templateUrl: './contact-forms.component.html',
  styleUrls: ['./contact-forms.component.scss']
})
export class ContactFormsComponent implements OnInit {

  @Input() formKey: 'jobs' | 'subcontractors' | 'general' = 'general'
  @Input() jobs: { title: string, content: string }[];

  @Output() submitted = new EventEmitter<{ formKey: string; data: any }>();

  form: FormGroup
  successfulSubmit: boolean = false;
  submitMessage: string = null;
  formsData:any = {
    general: {
      orderedKeys: ['simpleName', 'email', 'phone', 'message'],
      simpleName: {
        label: 'Name',
        inputType: 'simpleName',
        fb: ['', [Validators.required]]
      },
      email: {
        label: 'Email?',
        inputType: 'email',
        fb: ['', [Validators.required, Validators.email]]
      },
      phone: {
        label: 'Phone number?',
        inputType: 'tel',
        fb: ['', []],
      },
      message: {
        label: `Anything else you'd like us to know?`,
        inputType: 'textarea',
        fb: ['', [Validators.required]],
      },
      successMessage: '<h1 class="font-bold mb-3">Message received.</h1><p class="tracking-wide">Someone from our team will be reaching out shortly.</p>',
      sending: {
        from: 'operations@redmondconstruction.com',
        templateId: ''
      }
    },
    jobs: {
      orderedKeys: ['firstName', 'lastName', 'jobTitle', 'email', 'phone', 'industryExperience', 'message'],
      firstName: {
        label: 'First',
        inputType: 'name',
        fb: ['', [Validators.required]]
      },
      lastName: {
        label: 'Last',
        inputType: 'name',
        fb: ['', [Validators.required]]
      },
      jobTitle: {
        label: 'Position you\'re inquiring about?',
        inputType: 'select',
        options: null,
        fb: [null, [Validators.required]]
      },
      email: {
        label: 'Email?',
        inputType: 'email',
        fb: ['', [Validators.required, Validators.email]]
      },
      phone: {
        label: 'Phone number?',
        inputType: 'tel',
        fb: ['', [Validators.required]],
      },
      industryExperience: {
        label: 'Industry experience?',
        description: 'Years & areas of expertise',
        inputType: 'textarea',
        fb: ['', [Validators.required]],
      },
      message: {
        label: `Anything else you'd like us to know?`,
        inputType: 'textarea',
        fb: ['', []],
      },
      successMessage: '<h1 class="font-bold mb-3">Almost done.</h1><p class="tracking-wide">Please, check your inbox for an email from hiring@redmondconstruction.com, to confirm your details and attach your resume.</p>',
      sending: {
        from: 'hiring@redmondconstruction.com',
        templateId: ''
      }
    },
    subcontractors: {
      orderedKeys: ['company', 'website', 'firstName', 'lastName', 'phone', 'email'],
      company: {
        label: 'Company Name',
        inputType: 'text',
        fb: ['', [Validators.required]],
      },
      website: {
        label: 'Company Website',
        inputType: 'text',
        fb: ['', [Validators.required]],
      },
      firstName: {
        label: 'Contact First Name',
        inputType: 'name',
        fb: ['', [Validators.required]]
      },
      lastName: {
        label: 'Last Name',
        inputType: 'name',
        fb: ['', [Validators.required]]
      },
      phone: {
        label: 'Contact Phone Number',
        inputType: 'tel',
        fb: ['', [Validators.required]],
      },
      email: {
        label: 'Contact Email',
        inputType: 'email',
        fb: ['', [Validators.required, Validators.email]]
      },
      successMessage: '<h1 class="font-bold mb-3">Almost done.</h1><p class="tracking-wide">Check your inbox for an email from operations@redmondconstruction.com, and <strong>reply with requested information</strong>.</p>',
      sending: {
        from: 'operations@redmondconstruction.com',
        templateId: ''
      }
    }
  }


  loading: boolean;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  triggerResize() {
      // Wait for changes to be applied, then trigger textarea resize.
      this._ngZone.onStable.pipe(take(1))
          .subscribe(() => this.autosize.resizeToFitContent(true));
    }

  constructor(private fb: FormBuilder, private userService: UserService, private cloudFunctions: AngularFireFunctions, private _ngZone: NgZone) { }

  ngOnInit() {
    if (this.formKey === 'jobs')
      this.formsData.jobs.jobTitle.options = this.jobs.map(job => { return { value: job.title, label: job.title } });
    this.form = this.fb.group(this.formsData[this.formKey].orderedKeys.reduce((acc, key) => {
      acc[key] = this.formsData[this.formKey][key].fb;
      return acc
    }, {}));
  }

  get formData() {
    return !!this.formsData && !!this.formsData[this.formKey] ? this.formsData[this.formKey] : null;
  }
  get firstName() {
    if (!!!this.formData || !this.formData.hasOwnProperty('firstName'))
      return null;
    return this.form.get('firstName')
  }
  get lastName() {
    if (!!!this.formData || !this.formData.hasOwnProperty('lastName'))
      return null;
    return this.form.get('lastName')
  }
  get jobTitle() {
    if (!!!this.formData || !this.formData.hasOwnProperty('jobTitle'))
      return null;
    return this.form.get('jobTitle')
  }
  get email() {
    if (!!!this.formData || !this.formData.hasOwnProperty('email'))
      return null;
    return this.form.get('email')
  }
  get phone() {
    if (!!!this.formData || !this.formData.hasOwnProperty('phone'))
      return null;
    return this.form.get('phone')
  }
  get industryExperience() {
    if (!!!this.formData || !this.formData.hasOwnProperty('industryExperience'))
      return null;
    return this.form.get('industryExperience')
  }
  get message() {
    if (!!!this.formData || !this.formData.hasOwnProperty('message'))
      return null;
    return this.form.get('message')
  }
  get company() {
    if (!!!this.formData || !this.formData.hasOwnProperty('company'))
      return null;
    return this.form.get('company')
  }
  get website() {
    if (!!!this.formData || !this.formData.hasOwnProperty('website'))
      return null;
    return this.form.get('website')
  }
  get password() {
    if (!!!this.formData || !this.formData.hasOwnProperty('password'))
      return null;
    return this.form.get('password');
  }
  get passwordConfirm() {
    if (!!!this.formData || !this.formData.hasOwnProperty('passwordConfirm'))
      return null;
    return this.form.get('passwordConfirm');
  }


  async onSubmit() {
    this.loading = true;
    try {
      const ipAddress = await this.userService.getIpAddress().then(res => res.ip)
      const value = this.form.value;
      const call = this.cloudFunctions.httpsCallable('callable');
      const submissionResponse = await call({ params: { submission: { ...value }, fields: this.formData.orderedKeys, ipAddress, form: this.formKey }, action: 'formSubmission' })
        .pipe(take(1)).toPromise().catch(err => {
          console.error(err.message);
          return { ERROR: 'issue sending' }
        });
      if (submissionResponse.hasOwnProperty('ERROR')) {
        this.submitMessage = `<h3 class="font-bold text-rcc-red text-center">${submissionResponse.ERROR}</h3>`;
        return this.successfulSubmit = false;
      }
      this.successfulSubmit = submissionResponse === true;
      if (submissionResponse === true) this.submitted.emit({ formKey: this.formKey, data: this.form.value });
      this.submitMessage = !!this.successfulSubmit ? this.formsData[this.formKey].successMessage : '<h3 class="font-bold text-rcc-red text-center">Error sending.</h3>';
    } catch (err) {
      console.error(err.message)
    } finally {
      this.loading = false;
    }
  }

  resetForm() {
    this.loading = false;
    this.submitMessage = null;
    this.successfulSubmit = null;
  }


}
