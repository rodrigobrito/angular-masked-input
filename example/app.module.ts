import {NgModule}      from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule, ReactiveFormsModule} from '@angular/forms'
import {MaskedInputModule} from '../src/masked-input.directive'
import AppComponent from './app.component'

@NgModule({
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, MaskedInputModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}