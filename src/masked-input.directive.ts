import { Directive, 
         ElementRef, 
         forwardRef, 
         Input, 
         Inject, 
         NgModule, 
         OnChanges, 
         Provider, 
         Renderer, 
         SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, 
         ControlValueAccessor } from '@angular/forms';
import { createTextMaskInputElement } from 'text-mask-core/dist/textMaskCore';

export const MaskedInputValueAccessor: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MaskedInputDirective),
  multi: true
}

@Directive({
  host: {
    '(input)': 'onInput($event.target.value)',
    '(blur)': 'onTouched()'
  },
  selector: '[maskedInput]',
  providers: [MaskedInputValueAccessor]
})
export class MaskedInputDirective implements ControlValueAccessor, OnChanges {
  private textMaskInputElement: any;
  private inputElement: HTMLInputElement;
  // Stores the last value for comparison
  private lastValue: any

  @Input('maskedInput')
  textMaskConfig = {
    mask: [],
    guide: true,
    placeholderChar: '_',
    pipe: undefined,
    keepCharPositions: false,
  }

  onTouched = () => {}
  onChange = (_: any) => {}

  constructor(@Inject(Renderer) 
              private renderer: Renderer, 
              @Inject(ElementRef) 
              private element: ElementRef) 
  {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setupMask(true)
    if (this.textMaskInputElement !== undefined) {
      this.textMaskInputElement.update(this.inputElement.value)
    }
  }

  writeValue(value: any) {
    this.setupMask();
    // set the initial value for cases where the mask is disabled
    const normalizedValue = value == null ? '' : value
    this.renderer.setElementProperty(this.inputElement, 'value', normalizedValue)

    if (this.textMaskInputElement !== undefined) {
      this.textMaskInputElement.update(value)
    }
  }

  registerOnChange(fn: (value: any) => any): void { 
    this.onChange = fn;
  }

  registerOnTouched(fn: () => any): void { 
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.renderer.setElementProperty(this.element.nativeElement, 'disabled', isDisabled)
  }
  
  onInput(value) {
    this.setupMask()

    if (this.textMaskInputElement !== undefined) {
      this.textMaskInputElement.update(value)
      
      // get the updated value
      value = this.inputElement.value

      // check against the last value to prevent firing ngModelChange despite no changes
      if (this.lastValue !== value) {
        this.lastValue = value
        this.onChange(value)
      }
    }
  }

  private setupMask(create = false) {
    if (!this.inputElement) {
      if (this.element.nativeElement.tagName === 'INPUT') {
        // `textMask` directive is used directly on an input element
        this.inputElement = this.element.nativeElement
      } else {
        // `textMask` directive is used on an abstracted input element, `md-input-container`, etc
        this.inputElement = this.element.nativeElement.getElementsByTagName('INPUT')[0]
      }
    }
    
    if (this.inputElement && create) {
      this.textMaskInputElement = createTextMaskInputElement(
        Object.assign({inputElement: this.inputElement}, this.textMaskConfig)
      )
    }
  }
}

@NgModule({
  declarations: [MaskedInputDirective],
  exports: [MaskedInputDirective]
})
export class MaskedInputModule 
{
}

export { conformToMask } from 'text-mask-core/dist/textMaskCore'
