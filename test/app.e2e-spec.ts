import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.init();
  });

  const valid_date1 = new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString()
  const mocks = {
    post: {
      m0: {
        order_number: 0,
        title: 'New Todo 1',
        description: 'This is a new todo',
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        checkpoints: [
          {
            description: "Write integration tests",
            completed: true
          },
          {
            description: "Write the code",
            completed: false
          }
        ]
      },
      m1: {
        title: 'this is the second toDo',
        description: 'interesting description',
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'blocked',
        checkpoints: [
          {
            description: "Write the code",
            completed: false
          }
        ]
      },
      m2: {
        order_number: 0,
        title: "I am at the start now",
        description: "new year new todo",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: "in_progress",
        checkpoints: [
          {
            description: "Write integration tests",
            completed: true
          }
        ]
      },
      m3: {
        order_number: 2,
        title: "I hope you're inserting me right",
        description: "wuzz happenin",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: "in_progress"
      },
      m4: {
        description: "the title left",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: "in_progress"
      },
      m5: {
        title: "I'll build my own todo, with blackjack, and *******"
      },
      m6: {
        title: {
          message: "bon giorno"
        },
        welcometovegas: "^ ^",
        description: 420,
        due_date: "now"
      },
      m7: {
        title: "normal todo",
        description: "so far so good",
        due_date: new Date(new Date().getTime() - 8 * 60 * 60 * 1000).toISOString(),
        status: "in_progress"
      },
      m8: {
        title: "all checkpoints should contain a description",
        checkpoints: [
          {
            description: "this thing ain't right",
            completed: false,
          },
          {
            completed: false,
          }
        ]
      },
      m9_checkpoints_after: {
        checkpoints: [
          {
            description: "first one",
            completed: false
          },
          {
            description: "second_one",
            completed: false
          }
        ]
      },
      m9: {
        title: "checkpoints can be created with only the description",
        checkpoints: [
          {
            description: "first one"
          },
          {
            description: "second_one"
          }
        ]
      },
      m10: {
        title: "checkpoints should respect the specified format",
        checkpoints: [
          {
            description: {
              random: 2
            },
          }
        ]
      },
      m11: {
        title: "checkpoints should respect the specified format",
        checkpoints: [
          {
            description: "heelo",
            completed: "200"
          }
        ]
      },
      m12: {
        title: 'hey hey hey',
        description: "you can't create a task with the completed status",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        checkpoints: [
          {
            description: "Write the code",
            completed: false
          }
        ]
      },
      m13: {
        order_number: 2,
        title: 'let me insert this bad boy at a specific location',
        description: "it better be working",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        checkpoints: [
          {
            description: "Write the code",
            completed: false
          }
        ]
      },
      m14: {
        order_number: 0,
        title: 'i hope that the order_numbers are really updated',
        description: "desc_1",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        checkpoints: [
          {
            description: "Write the code",
            completed: false
          }
        ]
      },
      m15: {
        order_number: 0,
        title: 'if not then everything i did was a lie',
        description: "desc_2",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        checkpoints: [
          {
            description: "believe in tdd",
            completed: false
          }
        ]
      },
      m16: {
        order_number: 0,
        title: 'and tdd is not my thing',
        description: "desc_2",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        checkpoints: [
          {
            description: "scotty doesn't know",
            completed: true
          }
        ]
      },

      m17: {
        order_number: 4,
        title: 'that order number is kinda big',
        description: "make sure it's available ^ ^",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        checkpoints: [
          {
            description: "scotty doesn't know",
            completed: false
          }
        ]
      }
    },
    put: {
      m0: {
        order_number: 0,
        title: 'i hope that the order_numbers are really updated',
        description: "desc_1",
        due_date: valid_date1,
        status: 'in_progress',
        checkpoints: [
          {
            description: "Write the code",
            completed: false
          }
        ]
      },
      m1: {
        order_number: 1,
        title: 'if not then everything i did was a lie',
        description: "desc_2",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        checkpoints: [
          {
            description: "believe in tdd",
            completed: false
          }
        ]
      },
      m2: {
        order_number: 0,
        title: 'it should update put.m0',
        description: "updated desc",
        due_date: valid_date1,
        status: 'completed',
        checkpoints: [
          {
            description: "do something",
            completed: true
          }
        ]
      },
      m3: {
        // missing order_number
        title: 'blah blah blahg',
        description: "updated desc",
        due_date: valid_date1,
        status: 'completed',
      },
      m4: {
        // missing status
        order_number: 0,
        title: 'should fail',
        checkpoints: [
          {
            description: "eat healthy",
            completed: true
          }
        ]
      },
      m5: {
        // you can't use index in checkpoints for put
        order_number: 0,
        title: 'it should update put.m0',
        description: "updated desc",
        due_date: valid_date1,
        status: 'completed',
        checkpoints: [
          {
            description: "do something",
            completed: true,
          },
          {
            description: "no index please",
            completed: true,
            index: 1
          }
        ]
      },
      m6: {
        order_number: 0,
        title: 'due_date cannot be in the past',
        description: "updated desc",
        due_date: new Date(new Date().getTime() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        checkpoints: [
          {
            description: "do something",
            completed: true,
          },
          {
            description: "no index please",
            completed: true,
          }
        ]
      }
    },
    patch: {
      m0: {
        order_number: 0,
        title: 'i hope that the order_numbers are really updated',
        description: "desc_1",
        due_date: valid_date1,
        status: 'in_progress',
        checkpoints: [
          {
            description: "Write the code",
            completed: false
          }
        ]
      },
      m1: {
        order_number: 1,
        title: 'if not then everything i did was a lie',
        description: "desc_2",
        due_date: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        checkpoints: [
          {
            description: "believe in tdd",
            completed: false
          }
        ]
      },
      m2: {
        order_number: 0,
        title: 'should partially update',
        status: 'completed',
        checkpoints: [
          {
            description: "do something",
            completed: true
          }
        ]
      },
      m3: {
        order_number: 0,
        title: 'this task has a lot of todos',
        description: "it sure does",
        due_date: valid_date1,
        status: 'in_progress',
        checkpoints: [
          {
            description: "Write the code",
            completed: false
          },
          {
            description: "Do something better",
            completed: true,
          },
          {
            desciption: "hey hey hey",
            completed: false,
          }
        ]
      },
      m4: {
        checkpoints: [
          {
            index: 2,
            desciption: "This is a real checkpoint",
            completed: true,
          },
          {
            index: 0,
            description: "go for a walk",
          }
        ]
      },
      m3_checkpoints: [
        {
          description: "go for a walk",
          completed: false
        },
        {
          description: "Do something better",
          completed: true,
        },
        {
          desciption: "This is a real checkpoint",
          completed: true,
        }
      ],
      m5: {
        checkpoints: [
          {
            index: 2,
          },
          {
            index: 0,
          }
        ]
      },
      m3_checkpoints_delete: [
        {
          description: "Do something better",
          completed: true,
        }
      ],
      m6: {
        checkpoints: [
          {
            index: 999,
          },
          {
            index: -199,
          }
        ]
      },
      m7: {
        order_number: 0,
        due_date: new Date(new Date().getTime() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
        checkpoints: [
          {
            description: "Write the code",
            completed: false
          }
        ]
      }

    },
    delete: {
      m0: {
        order_number: 0,
        title: 'Todo 0',
        description: 'first to do',
        due_date: new Date(new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString()),
        status: 'in_progress',
        checkpoints: [
          {
            description: "Write integration tests",
            completed: true
          },
          {
            description: "Write the code",
            completed: false
          }
        ]
      },
      m1: {
        order_number: 1,
        title: 'Todo 1',
        description: 'second to do',
        due_date: new Date(new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString()),
        status: 'in_progress',
        checkpoints: [
          {
            description: "Write the code",
            completed: false
          }
        ]
      },
      m2: {
        order_number: 2,
        title: 'Todo 2',
        description: 'third to do',
        due_date: new Date(new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString()),
        status: 'in_progress',
        checkpoints: [
          {
            description: "Write integration tests",
            completed: true
          },
        ]
      }
    }
  }
  const postMe = async (my_mock) => {
    const response = await request(app.getHttpServer())
      .get("/api/todos")
      .send(my_mock)
  }

  describe.only('POST /api/todos', () => {
    it("should post a ToDo at the begining", async () => {
      const my_mock = mocks.post.m0
      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(201)      

      const body = response.body
      expect(body.order_number).toBe(0)
      expect(typeof body.creation_date).toBe("string")
      expect(typeof body.last_update_date).toBe("string")
      expect(body.title).toBe(my_mock.title)
      expect(body.description).toBe(my_mock.description)
      expect(body.status).toBe(my_mock.status)
      expect(body.due_date).toBe(my_mock.due_date)
      expect(body.checkpoints).toEqual(my_mock.checkpoints)
      expect(body.id).not.toBeDefined()
    })

    it("should post a ToDo without specifying an order number", async () => {
      const my_mock = mocks.post.m1
      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(201)

      const body = response.body

      expect(typeof body.creation_date).toBe("string")
      expect(typeof body.last_update_date).toBe("string")
      expect(body.title).toBe(my_mock.title)
      expect(body.description).toBe(my_mock.description)
      expect(body.status).toBe(my_mock.status)
      expect(body.checkpoints).toEqual(my_mock.checkpoints)
      
    })

    it("should post a ToDo at the begining even though a todo already exists at that location", async () => {
      const my_mock = mocks.post.m2
      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(201)

      const body = response.body
      expect(body.order_number).toBe(0)
      expect(typeof body.creation_date).toBe("string")
      expect(typeof body.last_update_date).toBe("string")
      expect(body.title).toBe(my_mock.title)
      expect(body.description).toBe(my_mock.description)
      expect(body.status).toBe(my_mock.status)
      expect(body.checkpoints).toEqual(my_mock.checkpoints)
    })

    it("shoud correctly increment the order_numbers after different insert operations", async () => {
      const my_mock = mocks.post.m3
      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(201)

      const body = response.body
      expect(body.order_number).toBe(2)
      expect(typeof body.creation_date).toBe("string")
      expect(typeof body.last_update_date).toBe("string")
      expect(body.title).toBe(my_mock.title)
      expect(body.description).toBe(my_mock.description)
      expect(body.status).toBe(my_mock.status)
      expect(body.checkpoints).toEqual([])
    })

    it("should return 400 if todo does not have a title", async () => {
      const my_mock = mocks.post.m4
      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(400)
    })

    it("should create a todo with only the title", async () => {
      const my_mock = mocks.post.m5
      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(201)
        
      const body = response.body

      expect(body.creation_date).toBeDefined()
      expect(body.last_update_date).toBeDefined()
      expect(body.title).toBe(my_mock.title)
      expect(body.status).toBeDefined()
      expect(body.checkpoints).toEqual([])
    })

    it("should return 400 if todo contains bogus data", async () => {
      const my_mock = mocks.post.m6
      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(400)

    })

    it("should return 400 if due_date < today", async () => {
      const my_mock = mocks.post.m7
      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(400)
    })

    it("should return 400 if checkpoints do not contain a description", async () => {
      const my_mock = mocks.post.m8
      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(400)
    })

    it("should be able to create checkpoints with only the description available", async () => {
      const my_mock = mocks.post.m9
      const checkpoints_after = mocks.post.m9_checkpoints_after.checkpoints
      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(201)

      const body = response.body
      expect(body.checkpoints).toEqual(checkpoints_after)
    })

    it("should return 400 if checkpoints contain non string description", async () => {
      const my_mock = mocks.post.m10

      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(400)

    })

    it("should return 400 if checkpoints contain non boolean completed", async () => {
      const my_mock = mocks.post.m11

      const response = await request(app.getHttpServer())
        .post("/api/todos")
        .send(my_mock)
        .expect(400)

    })

  });
  
  describe('GET /api/todos', () => {
    it("should return all the todos", async () => {
  
      const my_mock_1 = mocks.post.m0
      const my_mock_2 = mocks.post.m2
      
      await postMe(my_mock_1)
      await postMe(my_mock_2)


      const response = await request(app.getHttpServer())
        .get('/api/todos')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(2);

      const first = response.body[0]

      expect(first.due_date).toBe(my_mock_2.due_date)

      expect(first.order_number).toBe(0)

      expect(first.title).toBe(my_mock_2.title)

      expect(first.description).toBe(my_mock_2.description)

      expect(first.status).toBe(my_mock_2.status)

      expect(first.checkpoints).toEqual(my_mock_2.checkpoints)

      expect(first.id).not.toBeDefined()

      const second = response.body[1]

      expect(second.due_date).toBe(my_mock_1.due_date)

      expect(second.order_number).toBe(0)

      expect(second.title).toBe(my_mock_1.title)

      expect(second.description).toBe(my_mock_1.description)

      expect(second.status).toBe(my_mock_1.status)

      expect(second.checkpoints).toEqual(my_mock_1.checkpoints)

      expect(second.id).not.toBeDefined()

    })
  });
  
  describe('GET /api/todos/{order_number}', () => {
    it("should be able to return a todo at a specific index", async () => {
      const my_mock = mocks.post.m13
      await postMe(my_mock)

      const response = await request(app.getHttpServer())
        .get('/api/todos/2')
        .expect(200);

      const body = response.body
      expect(body.order_number).toBe(2)
      expect(typeof body.creation_date).toBe("string")
      expect(typeof body.last_update_date).toBe("string")
      expect(body.title).toBe(my_mock.title)
      expect(body.description).toBe(my_mock.description)
      expect(body.status).toBe(my_mock.status)
      expect(body.checkpoints).toEqual(my_mock.checkpoints)
      expect(body.id).not.toBeDefined()

    })

    it("should return 404 if the order_number is not found (too big)", async () => {
      const response = await request(app.getHttpServer())
      .get('/api/todos/9999999')
      .expect(404);
    })

    it("should return 400 if the order_number is not >= 0", async () => {
      const response = await request(app.getHttpServer())
      .get('/api/todos/-99')
      .expect(400);
    })

    it("should return 400 if the order_number is not a number", async () => {
      const response = await request(app.getHttpServer())
      .get('/api/todos/wuzz_happenin')
      .expect(400);
    })

    it("should maintain the correct order numbers after multiple post operations", async () => {
      const my_mock_1 = mocks.post.m14
      const my_mock_2 = mocks.post.m15
      const my_mock_3 = mocks.post.m16

      await postMe(my_mock_1)
      await postMe(my_mock_2)
      await postMe(my_mock_3)

      const response_1 = await request(app.getHttpServer())
        .get('/api/todos/0')
        .expect(200);
      
      const body_1 = response_1.body

      expect(body_1.order_number).toBe(0)
      expect(body_1.creation_date).toBe("string")
      expect(typeof body_1.last_update_date).toBe("string")
      expect(body_1.title).toBe(my_mock_3.title)
      expect(body_1.description).toBe(my_mock_3.description)
      expect(body_1.status).toBe(my_mock_3.status)
      expect(body_1.checkpoints).toEqual(my_mock_3.checkpoints)
      expect(body_1.id).not.toBeDefined()

      const response_3 = await request(app)
        .get('/api/todos/2')
        .expect(200);
      
      const body_3 = response_3.body

      expect(body_3.order_number).toBe(2)
      expect(body_3.creation_date).toBe("string")
      expect(typeof body_3.last_update_date).toBe("string")
      expect(body_3.title).toBe(my_mock_1.title)
      expect(body_3.description).toBe(my_mock_1.description)
      expect(body_3.status).toBe(my_mock_1.status)
      expect(body_3.checkpoints).toEqual(my_mock_1.checkpoints)
      expect(body_3.id).not.toBeDefined()

    })
  });
  
  describe('PUT /api/todos/{order_number}', () => {
    it("should only modify an existing toDo and not add a new one", async () => {
      const my_mock_1 = mocks.put.m0
      const my_mock_2 = mocks.put.m1
      const my_mock_3 = mocks.put.m2

      await postMe(my_mock_1)

      await postMe(my_mock_2)

      const response = await request(app.getHttpServer())
        .put('/api/todos/0')
        .send(my_mock_3)
        .expect(200);


      const body = response.body
      expect(body.order_number).toBe(0)
      expect(typeof body.creation_date).toBe("string")
      expect(typeof body.last_update_date).toBe("string")
      expect(body.title).toBe(my_mock_3.title)
      expect(body.description).toBe(my_mock_3.description)
      expect(body.due_date).toBe(valid_date1)
      expect(body.status).toBe(my_mock_3.status)
      expect(body.checkpoints).toEqual(my_mock_3.checkpoints)
      expect(body.id).not.toBeDefined()


      // now check if it really happened

      const td0 = await request(app.getHttpServer())
        .get("/api/todos/0")

      const td0_body = td0.body

      expect(td0_body.order_number).toBe(0)
      expect(typeof td0_body.creation_date).toBe("string")
      expect(typeof td0_body.last_update_date).toBe("string")
      expect(td0_body.title).toBe(my_mock_3.title)
      expect(td0_body.description).toBe(my_mock_3.description)
      expect(td0_body.status).toBe(my_mock_3.status)
      expect(td0_body.due_date).toBe(valid_date1)
      expect(td0_body.checkpoints).toEqual(my_mock_3.checkpoints)
      expect(td0_body.id).not.toBeDefined()


      // now check if my_mock_2 maintained its order number

      const td1 = await request(app.getHttpServer())
        .get("/api/todos/1")

      const td1_body = td1.body

      expect(td1_body.order_number).toBe(1)
      expect(typeof td1_body.creation_date).toBe("string")
      expect(typeof td1_body.last_update_date).toBe("string")
      expect(td1_body.title).toBe(my_mock_2.title)
      expect(td1_body.description).toBe(my_mock_2.description)
      expect(td1_body.status).toBe(my_mock_2.status)
      expect(td1_body.due_date).toBe(my_mock_2.due_date)
      expect(td1_body.checkpoints).toEqual(my_mock_2.checkpoints)
      expect(td1_body.id).not.toBeDefined()

    })

    it("should return 400 if not all required toDo data is present (order_number, title, due_date, status)", async () => {
      const my_mock_0 = mocks.put.m3
      const my_mock_1 = mocks.put.m4

      await request(app.getHttpServer())
        .put('/api/todos/0')
        .send(my_mock_0)
        .expect(400);

      await request(app.getHttpServer())
        .put('/api/todos/0')
        .send(my_mock_1)
        .expect(400);
    })

    it("shoud return 400 if order number is invalid", async () => {
      const my_mock_0 = mocks.put.m0

      await request(app.getHttpServer())
        .put('/api/todos/-99')
        .send(my_mock_0)
        .expect(400);

      await request(app.getHttpServer())
        .put('/api/todos/abcd')
        .send(my_mock_0)
        .expect(400);
    })

    it("should return 404 if order_number is not found", async () => {
      const my_mock_0 = mocks.put.m0

      await request(app.getHttpServer())
        .put('/api/todos/99999999')
        .send(my_mock_0)
        .expect(404);

    })

    it("should be able to interchange order_numbers", async () => {
      const my_mock_0 = mocks.put.m0

      const aux = my_mock_0.order_number

      const my_mock_1 = mocks.put.m1

      await postMe(my_mock_0)

      await postMe(my_mock_1)

      my_mock_0.order_number = my_mock_1.order_number

      await request(app.getHttpServer())
        .put('/api/todos/0')
        .send(my_mock_0)
        .expect(200);

      my_mock_0.order_number = aux

      const r1 = await request(app.getHttpServer())
        .get('/api/todos/0')
        .expect(200)

      const r2 = await request(app.getHttpServer())
        .get('/api/todos/1')
        .expect(200)

      const r1_body = r1.body

      expect(r1_body.order_number).toBe(my_mock_1.order_number)
      expect(typeof r1_body.creation_date).toBe("string")
      expect(typeof r1_body.last_update_date).toBe("string")
      expect(r1_body.title).toBe(my_mock_0.title)
      expect(r1_body.description).toBe(my_mock_0.description)
      expect(r1_body.status).toBe(my_mock_0.status)
      expect(r1_body.due_date).toBe(my_mock_0.due_date)
      expect(r1_body.checkpoints).toEqual(my_mock_0.checkpoints)
      expect(r1_body.id).not.toBeDefined()

      const r2_body = r2.body

      expect(r2_body.order_number).toBe(aux)
      expect(typeof r2_body.creation_date).toBe("string")
      expect(typeof r2_body.last_update_date).toBe("string")
      expect(r2_body.title).toBe(my_mock_1.title)
      expect(r2_body.description).toBe(my_mock_1.description)
      expect(r2_body.status).toBe(my_mock_1.status)
      expect(r2_body.due_date).toBe(my_mock_1.due_date)
      expect(r2_body.checkpoints).toEqual(my_mock_1.checkpoints)
      expect(r2_body.id).not.toBeDefined()
    })

    it("should return 400 if it finds the index update field in checkpoints", async () => {
      const my_mock_0 = mocks.put.m5

      await request(app.getHttpServer())
        .put('/api/todos/0')
        .send(my_mock_0)
        .expect(400);

    })

    it("should return 400 if due_date is in the past", async () => {
      const my_mock = mocks.put.m6
       const response = await request(app.getHttpServer())
        .put('/api/todos/0')
        .send(my_mock)
        .expect(400);
    })

  });
  
  describe('PATCH /api/todos/{order_number}', () => {
    it("should only modify an existing toDo and not add a new one", async () => {
      const my_mock_1 = mocks.patch.m0
      const my_mock_2 = mocks.patch.m1
      const my_mock_3 = mocks.patch.m2

      await postMe(my_mock_1)

      await postMe(my_mock_2)

      const response = await request(app.getHttpServer())
        .patch('/api/todos/0')
        .send(my_mock_3)
        .expect(200);


      const body = response.body
      expect(body.order_number).toBe(0)
      expect(typeof body.creation_date).toBe("string")
      expect(typeof body.last_update_date).toBe("string")
      expect(body.title).toBe(my_mock_3.title)
      expect(body.description).toBe(my_mock_1.description)
      expect(body.due_date).toBe(my_mock_1.due_date)
      expect(body.status).toBe(my_mock_3.status)
      expect(body.checkpoints).toEqual(my_mock_3.checkpoints)
      expect(body.id).not.toBeDefined()


      // now check if it really happened

      const td0 = await request(app.getHttpServer())
        .get("/api/todos/0")

      const td0_body = td0.body

      expect(td0_body.order_number).toBe(0)
      expect(typeof td0_body.creation_date).toBe("string")
      expect(typeof td0_body.last_update_date).toBe("string")
      expect(td0_body.title).toBe(my_mock_3.title)
      expect(td0_body.description).toBe(my_mock_1.description)
      expect(td0_body.status).toBe(my_mock_3.status)
      expect(td0_body.due_date).toBe(my_mock_1.due_date)
      expect(td0_body.checkpoints).toEqual(my_mock_3.checkpoints)
      expect(td0_body.id).not.toBeDefined()


      // now check if my_mock_2 maintained its order number

      const td1 = await request(app.getHttpServer())
        .get("/api/todos/1")

      const td1_body = td1.body

      expect(td1_body.order_number).toBe(1)
      expect(typeof td1_body.creation_date).toBe("string")
      expect(typeof td1_body.last_update_date).toBe("string")
      expect(td1_body.title).toBe(my_mock_2.title)
      expect(td1_body.description).toBe(my_mock_2.description)
      expect(td1_body.status).toBe(my_mock_2.status)
      expect(td1_body.due_date).toBe(my_mock_2.due_date)
      expect(td1_body.checkpoints).toEqual(my_mock_2.checkpoints)
      expect(td1_body.id).not.toBeDefined()

    })

    it("shoud return 400 if order number is invalid", async () => {
      const my_mock_0 = mocks.patch.m0

      await request(app.getHttpServer())
        .patch('/api/todos/-99')
        .send(my_mock_0)
        .expect(400);

      await request(app.getHttpServer())
        .patch('/api/todos/abcd')
        .send(my_mock_0)
        .expect(400);
    })

    it("should return 404 if order_number is not found", async () => {
      const my_mock_0 = mocks.patch.m0

      await request(app.getHttpServer())
        .patch('/api/todos/99999999')
        .send(my_mock_0)
        .expect(404);

    })

    it("should be able to interchange order_numbers", async () => {
      const my_mock_0 = mocks.patch.m0

      const aux = my_mock_0.order_number

      const my_mock_1 = mocks.patch.m1

      await postMe(my_mock_0)

      await postMe(my_mock_1)

      my_mock_0.order_number = my_mock_1.order_number

      await request(app.getHttpServer())
        .patch('/api/todos/0')
        .send(my_mock_0)
        .expect(200);

      const r1 = await request(app.getHttpServer())
        .get('/api/todos/0')
        .expect(200)

      const r2 = await request(app.getHttpServer())
        .get('/api/todos/1')
        .expect(200)

      const r1_body = r1.body

      expect(r1_body.order_number).toBe(my_mock_1.order_number)
      expect(typeof r1_body.creation_date).toBe("string")
      expect(typeof r1_body.last_update_date).toBe("string")
      expect(r1_body.title).toBe(my_mock_0.title)
      expect(r1_body.description).toBe(my_mock_0.description)
      expect(r1_body.status).toBe(my_mock_0.status)
      expect(r1_body.due_date).toBe(my_mock_0.due_date)
      expect(r1_body.checkpoints).toEqual(my_mock_0.checkpoints)
      expect(r1_body.id).not.toBeDefined()

      const r2_body = r2.body

      expect(r2_body.order_number).toBe(aux)
      expect(typeof r2_body.creation_date).toBe("string")
      expect(typeof r2_body.last_update_date).toBe("string")
      expect(r2_body.title).toBe(my_mock_1.title)
      expect(r2_body.description).toBe(my_mock_1.description)
      expect(r2_body.status).toBe(my_mock_1.status)
      expect(r2_body.due_date).toBe(my_mock_1.due_date)
      expect(r2_body.checkpoints).toEqual(my_mock_1.checkpoints)
      expect(r2_body.id).not.toBeDefined()
    })

    it("should be able to support updating only certain checkpoints based on index", async () => {
      const my_mock_1 = mocks.patch.m3
      const my_mock_2 = mocks.patch.m4
      const result_checkpoints = mocks.patch.m3_checkpoints

      await postMe(my_mock_1)

      await request(app.getHttpServer())
        .patch('/api/todos/0')
        .send(my_mock_2)
        .expect(200);
      
      const r1 = await request(app.getHttpServer())
        .get('/api/todos/0')
        .expect(200)

      expect(r1.body.checkpoints).toEqual(result_checkpoints)

    })

    it("should be able to delete checkpoints if only the index is provided", async () => {
      const my_mock_1 = mocks.patch.m3
      const my_mock_2 = mocks.patch.m5
      const result_checkpoints = mocks.patch.m3_checkpoints_delete

      await postMe(my_mock_1)

      await request(app.getHttpServer())
        .patch('/api/todos/0')
        .send(my_mock_2)
        .expect(200);
      
      const r1 = await request(app.getHttpServer())
        .get('/api/todos/0')
        .expect(200)

      expect(r1.body.checkpoints).toEqual(result_checkpoints)

    })

    it("should return 400 if checkpoints index is not valid", async () => {

      const my_mock_1 = mocks.patch.m3
      const my_mock_2 = mocks.patch.m6

      await postMe(my_mock_1)

      await request(app.getHttpServer())
        .patch('/api/todos/0')
        .send(my_mock_2)
        .expect(400);
    })

    it("should return 400 if due_date is in the past", async () => {
      const my_mock = mocks.patch.m7
       const response = await request(app.getHttpServer())
        .patch('/api/todos/0')
        .send(my_mock)
        .expect(400);
    })
  });
  
  describe('DELETE /api/todos/{order_number}', () => {
    it('should delete a todo and update the order numbers', async () => {

      const my_mock_1 = mocks.delete.m0

      const my_mock_2 = mocks.delete.m1

      const my_mock_3 = mocks.delete.m2
  
      await postMe(my_mock_1)
      await postMe(my_mock_2)
      await postMe(my_mock_3)
  
      await request(app.getHttpServer())
        .delete(`/api/todos/1`)
        .expect(204);
  
      const response = await request(app.getHttpServer())
        .get('/api/todos')
        .expect(200);
  
      const todos = response.body;
  
      expect(todos[0].order_number).toBe(0);
      expect(todos[1].order_number).toBe(1);

      expect(todos[1].description).toBe(my_mock_3.description)
      expect(todos[1].due_date).toBe(my_mock_3.due_date)
      expect(todos[1].checkpoints).toEqual(my_mock_3.checkpoints)
    });

    it("should return 400 if order_number is not valid", async () => {

      await request(app.getHttpServer())
        .delete('/api/todos/-12321312')
        .expect(400);

      await request(app.getHttpServer())
        .delete('/api/todos/abcd')
        .expect(400);

    })

    it("should return 404 if order_number is not found", async () => {

      await request(app.getHttpServer())
        .delete('/api/todos/99999999')
        .expect(404);

    })

  });



});
