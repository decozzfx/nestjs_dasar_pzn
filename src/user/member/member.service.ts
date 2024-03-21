import { Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Connection } from '../connection/connection';
import { MailService } from '../mail/mail.service';

@Injectable()
export class MemberService {
  constructor(private moduleRef: ModuleRef) {}

  getConnection(): string {
    const connection = this.moduleRef.get(Connection);
    console.info('getname from member service');
    return connection.getName();
  }

  sendEmail() {
    const emailService = this.moduleRef.get(MailService);
    console.info('send from member service');
    emailService.send();
  }
}
