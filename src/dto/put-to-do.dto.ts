import { IsInt, IsString, IsNotEmpty, IsDateString, IsEnum, IsArray, ValidateNested, Validate, IsBoolean, registerDecorator, isDateString, IsOptional, isNotEmpty } from 'class-validator';
import { Transform } from "class-transformer"
import { Type } from 'class-transformer';

enum TodoStatus {
  InBacklog = 'in_backlog',
  InProgress = 'in_progress',
  Blocked = 'blocked',
}

class TaskCheckpoint {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean = false;
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

export class PutTodoDto {
  @IsInt()
  @IsNotEmpty()
  order_number: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsDateString()
  @IsDueDateValid()
  @IsNotEmpty()
  due_date: string;

  @IsEnum(TodoStatus)
  @IsNotEmpty()
  status: TodoStatus

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => TaskCheckpoint)
  checkpoints: TaskCheckpoint[];
}
