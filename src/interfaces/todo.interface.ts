export interface Todo {
    order_number?: number;
    title: string;
    description?: string;
    due_date?: Date | string;
    status?: string;
    checkpoints?: TaskCheckpoint[];
  }
  
  export interface TaskCheckpoint {
    index?: any;
    description: string;
    complete?: boolean;
  }