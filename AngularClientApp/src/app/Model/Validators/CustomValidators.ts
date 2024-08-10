import { AbstractControl, FormArray, FormGroup, ValidatorFn } from "@angular/forms";

export class CustomValidator {
  // Number only validation
  static numeric(control: AbstractControl) {
    let val = control.value;

    if (val === null || val === '') return null;
    if (!val.toString().match(/^[0-9]+(\.?[0-9]+)?$/)) return { 'invalidNumber': true };

    return null;
  }


  static MinOneImage(array: FormArray) {    
    //console.log("number of images:" + array.value.length);
    if (array.value.length == 0) return { 'no-images': true };
    return null;
  }

  static MinOneCategory(array: FormArray) {
    //console.log("number of cats:" + array.value.length);
    if (array.value.length == 0) return { 'no-categories': true };
    return null;
  }
  static MinOneVariation(array: FormArray) {
    //console.log("number of cats:" + array.value.length);
    if (array.value.length == 0) return { 'no-variations': true };
    return null;
  }
}

