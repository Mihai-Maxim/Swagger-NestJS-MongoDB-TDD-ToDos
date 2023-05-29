import { Controller, Post, Body } from '@nestjs/common';
import { PostTodoDto } from "../dto/post-to-do.dto"
@Controller('/api/todos')

export class TodosController {
    @Post()
    postTodo(@Body() postTodoDto: PostTodoDto): string {
        console.log(postTodoDto)
        return 'works';
    }
}
