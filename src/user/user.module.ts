import { Module } from '@nestjs/common';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { Connection, createConnection } from './connection/connection';
import { MailService, mailService } from './mail/mail.service';
import { UserRepository } from './user-repository/user-repository';
import { MemberService } from './member/member.service';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [
    UserService,
    UserRepository,
    /// Custom provider
    // class provider
    {
      provide: Connection,
      useFactory: createConnection,
      inject: [ConfigService],
    },
    // value provider
    {
      provide: MailService,
      useValue: mailService,
    },
    // factory provider
    // {
    //   provide: UserRepository,
    //   useFactory: createUserRepository,
    //   inject: [Connection],
    // },
    // alias provider
    {
      provide: 'EMailService',
      useExisting: MailService,
    },
    MemberService,
  ],
})
export class UserModule {}
