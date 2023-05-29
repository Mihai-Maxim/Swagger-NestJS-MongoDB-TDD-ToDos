import * as mongoose from 'mongoose';

export const TodoSchema = new mongoose.Schema({
  order_number: Number,
  title: String,
  description: String,
  due_date: Date,
  status: String,
  checkpoints: [
    {
      description: String,
      is_complete: { type: Boolean, default: false },
    },
  ],
});