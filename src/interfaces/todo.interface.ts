export interface Todo {
    order_number?: number;
    title: string;
    description?: string;
    due_date?: Date;
    status?: string;
    checkpoints?: TaskCheckpoint[];
  }
  
  export interface TaskCheckpoint {
    description: string;
    is_complete?: boolean;
  }