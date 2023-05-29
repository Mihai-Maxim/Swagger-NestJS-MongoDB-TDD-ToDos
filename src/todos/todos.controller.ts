import { Controller, Post, Body } from '@nestjs/common';
import { PostTodoDto } from "../dto/post-to-do.dto"
import { TodosService } from './todos.service'
@Controller('/api/todos')

export class TodosController {
    constructor(private readonly todosService: TodosService) {}
    
    @Post()
    async postTodo(@Body() postTodoDto: PostTodoDto): Promise<any> {
        const createdTodo = await this.todosService.createTodo(postTodoDto);
        return createdTodo;
    }
}
