import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('POST /api/todos', () => {

  });
  
  describe('GET /api/todos', () => {
  
  });
  
  describe('GET /api/todos/{order_number}', () => {
  
  });
  
  describe('PUT /api/todos/{order_number}', () => {
  
  });
  
  describe('PATCH /api/todos/{order_number}', () => {
  
  });
  
  describe('DELETE /api/todos/{order_number}', () => {
   
  });

});
