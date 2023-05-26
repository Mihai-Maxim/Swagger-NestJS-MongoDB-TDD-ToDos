# Project

Create a simple ToDoS API that supports all the CRUD operations.

The API does not require any authentication.

Build it with NestJS and MongoDB.

ToDos should include: 
 *  Order number
 *  Title
 *  Description (optional)
 *  Due date
 *  Creation date
 *  Last update date
 *  Status (in_backlog, in_progress, blocked, completed)
 *  Chekpoints (each checkpoint should have description and is_completed = true | false)

## Example: 
```json
{
  "title": "My first ToDo",
  "description": "Learn some TDD",
  "due_date": "2023-05-28T07:01:00.070Z",
  "status": "in_progress",
  "checkpoints": [
    {
      "description": "Write integration tests",
      "is_complete": true
    },
    {
      "description": "Write the code",
      "is_complete": false
    }
  ]
}
```

# Tasks

1. Define the interface for your API using Swagger.
2. Write integration tests for the endpoints defined in your API.
3. Make each test pass by implementing the logic behind the endpoint. Use a real database hosted on your local machine.
4. Once the test passes improve the codebase before you go to the next test and implementation.
