import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import * as httpMoch from 'node-mocks-http';
import { UserService } from './user.service';
describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should can say hello', async () => {
    const response = await controller.sayHello('eko');
    expect(response).toBe('Hello eko!');
  });

  it('should can get view', async () => {
    const response = httpMoch.createResponse();
    controller.viewHello('eko', response);

    expect(response._getRenderView()).toBe('index.html');
    expect(response._getRenderData()).toEqual({
      title: 'Template Engine',
      name: 'eko',
    });
  });
});
