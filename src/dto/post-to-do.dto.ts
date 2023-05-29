import { IsInt, IsString, IsNotEmpty, IsDateString, IsEnum, IsArray, ValidateNested, Validate, IsBoolean, registerDecorator, isDateString, IsOptional } from 'class-validator';
import { Transform } from "class-transformer"
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
  description: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === undefined ? false : value)
  completed: boolean;
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

export class PostTodoDto {
  @IsInt()
  order_number: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  @IsDueDateValid() // Apply custom validation decorator
  due_date: string;

  @IsEnum(TodoStatus)
  status: TodoStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaskCheckpoint)
  checkpoints: TaskCheckpoint[];
}
