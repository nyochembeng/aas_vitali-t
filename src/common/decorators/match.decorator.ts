import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'match',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const constraints = args.constraints as string[];
          if (constraints.length > 0) {
            const [relatedPropertyName] = constraints;
            const relatedValue: unknown = (args.object as Record<string, any>)[
              relatedPropertyName
            ];
            return value === relatedValue;
          } else {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must match ${args.constraints[0]}`;
        },
      },
    });
  };
}
