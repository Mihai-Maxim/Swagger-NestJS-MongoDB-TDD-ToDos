module.exports = {
  async up(db, client) {
    await db.createCollection('todos-test');

    await db.collection('todos-test').createIndex({ order_number: 1 });

    await db.collection('todos-test').insertOne({
      order_number: 0,
      title: 'string',
      description: 'string',
      creation_date: new Date().toISOString(),
      last_update_date: new Date().toISOString(),
      due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
      status: 'in_backlog',
      checkpoints: [
        {
          description: 'string',
          is_complete: true
        }
      ]
    });
  },

  async down(db, client) {
    await db.collection('todos-test').drop();
  }
};
