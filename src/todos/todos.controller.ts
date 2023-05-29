import { Controller, Post, Body, HttpException, HttpStatus  } from '@nestjs/common';
import { PostTodoDto } from "../dto/post-to-do.dto"
import { TodosService } from './todos.service'
@Controller('/api/todos')

export class TodosController {
    constructor(private readonly todosService: TodosService) {}

    @Post()
    async postTodo(@Body() postTodoDto: PostTodoDto): Promise<any> {
        try {
            const createdTodo = await this.todosService.createTodo(postTodoDto);
            return createdTodo;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
