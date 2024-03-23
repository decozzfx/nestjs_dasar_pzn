import {
  Controller,
  Post,
  Get,
  Query,
  Param,
  HttpCode,
  Header,
  HttpRedirectResponse,
  Redirect,
  Res,
  Req,
  Inject,
  Body,
  HttpException,
  ParseIntPipe,
  UsePipes,
  UseInterceptors,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UserService } from './user.service';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';
import { UserRepository } from '../user-repository/user-repository';
import { MemberService } from '../member/member.service';
import { User } from '@prisma/client';
import {
  LoginUserRequest,
  loginUserRequestValidation,
} from '../model/login.model';
import { ValidationPipe } from 'src/validation/validation.pipe';
import { TimeInterceptor } from 'src/time/time.interceptor';
import { Auth } from 'src/auth/auth.decorator';
import { Roles } from 'src/role/roles.decorator';

@Controller('/api/users')
export class UserController {
  constructor(
    private service: UserService,
    private connection: Connection,
    private mailService: MailService,
    private userRepository: UserRepository,
    @Inject('EMailService') private EmailService: MailService,
    private memberService: MemberService,
  ) {}

  @Get('/current')
  @Roles(['admin'])
  @UseInterceptors(TimeInterceptor)
  current(@Auth() user: User): Record<string, any> {
    return {
      data: `Hello ${user.first_name} ${user.last_name}`,
    };
  }

  @UsePipes(new ValidationPipe(loginUserRequestValidation))
  @Post('/login')
  @Header('Content-Type', 'application/json')
  @UseInterceptors(TimeInterceptor)
  login(@Query('name') name: string, @Body() request: LoginUserRequest) {
    return {
      data: `Hello ${request.username}`,
    };
  }

  @Get('/connection')
  async getConnection(): Promise<string> {
    console.info(this.EmailService.send());
    console.info(this.mailService.send());

    console.info(this.memberService.getConnection());
    this.memberService.sendEmail();

    return this.connection.getName();
  }

  @Get('/hello')
  // @UseFilters(ValidationFilter)
  async sayHello(@Query('name') name: string): Promise<string> {
    return this.service.sayHello(name);
  }

  @Get('/view/hello')
  viewHello(@Query('name') name: string, @Res() response: Response) {
    response.render('index.html', { title: 'Template Engine', name });
  }

  @Get('/set-cookies')
  setCookies(@Query('name') name: string, @Res() response: Response) {
    response.cookie('name', name);
    response.status(200).send('Success!, Cookie is set');
  }

  @Get('/get-cookies')
  getCookies(@Req() request: Request) {
    return request.cookies['name'];
  }

  @Get('/sample-response')
  @Header('Content-Type', 'application/json')
  @HttpCode(200)
  sampleResponse(): Record<string, string> {
    return { data: 'sample response Hello World' };
  }

  @Get('/redirect')
  @Redirect()
  redirect(): HttpRedirectResponse {
    return { url: '/api/users/sample-response', statusCode: 301 };
  }

  @Post()
  post(): string {
    return 'POST';
  }

  @Get('/sample')
  get(): string {
    return 'GET Users Sample';
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): string {
    return `GET User ${id}`;
  }

  @Get('/query/:id')
  async getByParamId(
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
  ): Promise<string> {
    return `Hello ${firstName} ${lastName}`;
  }

  @Post('/create')
  async create(
    @Body() body: { firstName: string; lastName: string },
  ): Promise<User> {
    const { firstName, lastName } = body;
    if (!firstName) {
      throw new HttpException(
        {
          code: 400,
          errors: 'fistName is required',
        },
        400,
      );
    }
    return this.userRepository.save(firstName, lastName);
  }
}
