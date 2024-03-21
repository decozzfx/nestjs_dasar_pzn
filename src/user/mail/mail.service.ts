import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  send() {
    return 'Mail sent';
  }
}

export const mailService = new MailService();
