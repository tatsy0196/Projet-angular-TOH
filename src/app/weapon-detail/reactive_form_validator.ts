import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn
{ return (control: AbstractControl): ValidationErrors | null => {
  const forbidden = nameRe.test(control.value);
  return forbidden ?
    {forbiddenName: {value: control.value}} : null;
};
}

export function checkStatsIsOKValidator(): ValidatorFn
{ return (control: AbstractControl): ValidationErrors | null => {
  const attaque = control.get('attaque')?.value || 0;
  const esquive = control.get('esquive')?.value || 0;
  const pv = control.get('pv')?.value || 0;
  const degats = control.get('degats')?.value || 0;

  const sum = attaque + esquive + pv + degats;

  const isValid = sum === 0;

  return isValid ? null : { invalidSum: true };
};
}
