import { isBlank } from './utils';

export interface Validation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: string | RegExp;
  descError?: string;
}

export class Validators {

  static get(validation: Validation): (name: string, value: any) => string[] {
    const result = (name: string, value: any) => Validators.validate(name, value, validation);
    return result;
  }

  static validate(name: string, value: any, validation: Validation): string[] {
    const temp: string[] = [];
    if (!validation) {
      return temp;
    }
    const length: number = !isBlank(value) ? value.toString().length : 0;

    if (validation.required && isBlank(value)) {
      temp.push(!validation.descError ? `${name} es obligatorio.` : validation.descError);
    }
    if (validation.minLength && length < validation.minLength) {
      temp.push(!validation.descError ? `${name} debe tener al menos ${validation.minLength} caracteres de largo. Tiene ${length}.` : validation.descError);
    }
    if (validation.maxLength && length > validation.maxLength) {
      temp.push(!validation.descError ? `${name} no puede tener más de ${validation.maxLength} caracteres. Tiene ${length}.` : validation.descError);
    }
    if (validation.pattern && value) {
      const patternResult = Validators.patternValidate(name, value, validation.pattern, validation.descError);
      if (patternResult) {
        temp.push(patternResult);
      }
    }
    return temp;
  }

  static patternValidate(name: string, value: any, pattern: string | RegExp, descError?: string): string {
    let regex: RegExp;
    let regexStr: string;
    if (typeof pattern === 'string') {
      regexStr = pattern;
      regex = new RegExp(regexStr);
    } else {
      regexStr = pattern.toString();
      regex = pattern;
    }
    return regex.test(value) ? null : (!descError ? `${name} debe cumplir el patrón: ${regexStr}.` : descError);
  }

}
