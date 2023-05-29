import { Todo } from "./todo.interface";

export interface CustomRequest extends Request {
    params: any;
    orderNumber: number;
    todo: Todo; // Adjust the type of 'todo' according to your Todo type
}