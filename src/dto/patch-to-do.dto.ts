import { IsInt, IsString, IsNotEmpty, IsDateString, IsEnum, IsArray, ValidateNested, Validate, IsBoolean, registerDecorator, isDateString, IsOptional, IsNumber, ValidationOptions, ValidationArguments } from 'class-validator';

import { Type } from 'class-transformer';

enum TodoStatus {
  InBacklog = 'in_backlog',
  InProgress = 'in_progress',
  Blocked = 'blocked',
  Completed = 'completed',
}

class TaskCheckpoint {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  completed: boolean

  @IsNumber()
  @IsOptional()
  index: number
}

function IsDueDateValid(validationOptions?: any) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsDueDateValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!isDateString(value)) return false
          const currentDate = new Date().toISOString();
          const selectedDate = new Date(value).toISOString();
          return selectedDate >= currentDate;
        },
        defaultMessage() {
          return 'due date must not be earlier than today.';
        },
      },
    });
  };
}

export class PatchTodoDto {
  @IsInt()
  @IsOptional()
  order_number: number;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsDueDateValid()
  @IsOptional()
  due_date: string;

  @IsEnum(TodoStatus)
  @IsOptional()
  status: TodoStatus

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TaskCheckpoint)
  checkpoints: TaskCheckpoint[];
}
