import nodemailer, { Transporter } from "nodemailer";

export interface EmailInfo {
  from: { name: string; email: string };
  to: string[];
  subject: string;
  text: string;
  html: string;
}

export class EmailService {
  private _transporter!: Transporter;
  constructor() {}
  public initialize() {
    this._transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  public async sendMail(info: EmailInfo) {
    const { from, to, subject, text, html } = info;
    return this._transporter.sendMail({
      from: `${from.name} <${from.email}>`,
      to: to.join(", "),
      subject: subject,
      text: text,
      html: html,
    });
  }

  public getEmailTemplate = (body: string) => {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  
    <html xmlns="http://www.w3.org/1999/xhtml">
    
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset</title>
      </head>
    
      <body>
        <div>
          ${body}
        </div>
      </body>
    
    </html>`;
  };
}

export const emailService = new EmailService();
