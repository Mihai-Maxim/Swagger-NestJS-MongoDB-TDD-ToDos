import * as mongoose from 'mongoose';

export const TodoSchema = new mongoose.Schema(
    {
      order_number: Number,
      title: String,
      description: String,
      due_date: Date,
      status: String,
      creation_date: { type: Date, default: Date.now },
      last_update_date: { type: Date, default: Date.now },
      checkpoints: [
        {
          description: String,
          completed: { type: Boolean, default: false },
        },
      ],
    },
  );
  
  // Define pre-save middleware
TodoSchema.pre('save', function (next) {
    this.last_update_date = new Date(); // Update last_update_date field
    next();
});