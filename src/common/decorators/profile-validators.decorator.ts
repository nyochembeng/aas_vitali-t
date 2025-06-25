import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

interface ConceivedDateObject {
  conceivedDate: Date;
}

export function IsDateNotInFuture(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsDateNotInFuture',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date)) return false;
          return value <= new Date();
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} cannot be in the future`;
        },
      },
    });
  };
}

export function IsValidAge(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidAge',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date)) return false;
          const age = new Date().getFullYear() - value.getFullYear();
          return age >= 13 && age <= 120;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must correspond to an age between 13 and 120 years`;
        },
      },
    });
  };
}

export function IsValidConceivedDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidConceivedDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!(value instanceof Date)) return false;
          const nineMonthsAgo = new Date();
          nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);
          return value >= nineMonthsAgo;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be within the last 9 months`;
        },
      },
    });
  };
}

export function IsValidDueDate(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsValidDueDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true; // Due date is optional
          if (!(value instanceof Date)) return false;
          const today = new Date();
          if (value < today) return false;

          const conceivedDate = (args.object as ConceivedDateObject)
            .conceivedDate;
          if (!conceivedDate) return true; // No conceived date to validate against
          const weeksDiff =
            (value.getTime() - conceivedDate.getTime()) /
            (1000 * 60 * 60 * 24 * 7);
          return weeksDiff >= 37 && weeksDiff <= 42;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be 37–42 weeks from conceived date and not in the past`;
        },
      },
    });
  };
}
