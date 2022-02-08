import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Component, NgModule } from '@angular/core';
import { PlaygroundModule } from 'angular-playground';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from 'projects/redmond-fire/src/app/@shared/shared.module';

PlaygroundModule
  .configure({
    selector: 'app-root',
    overlay: false,
    modules: [],
  });

@Component({
  selector: 'playground-app',
  template: '<playground-root></playground-root>'
})
export class AppComponent {}

@NgModule({
  imports: [
    BrowserModule,
    PlaygroundModule,
    SharedModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
