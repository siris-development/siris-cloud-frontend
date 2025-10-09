import { Component, inject } from '@angular/core';
import { EmailTemplateService, EmailTemplateData } from '../services/email-template.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-email-template-example',
  template: `
    <div class="email-preview">
      <h2>Vista Previa de Email de Confirmación</h2>
      
      <div class="controls">
        <button (click)="generateFullTemplate()">Plantilla Completa</button>
        <button (click)="generateSimpleTemplate()">Plantilla Simple</button>
        <button (click)="generateTextTemplate()">Versión Texto</button>
      </div>

      <div class="preview-container">
        <iframe 
          [srcdoc]="emailHtml" 
          width="100%" 
          height="600px"
          frameborder="0">
        </iframe>
      </div>

      @if(emailText) {
        <div class="text-preview">
          <h3>Versión Texto:</h3>
          <pre>{{emailText}}</pre>
        </div>
      }
    </div>
  `,
  styles: [`
    .email-preview {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }
    
    .controls {
      margin: 20px 0;
      display: flex;
      gap: 10px;
    }
    
    .controls button {
      padding: 10px 20px;
      background-color: #667eea;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .controls button:hover {
      background-color: #5a67d8;
    }
    
    .preview-container {
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      margin: 20px 0;
    }
    
    .text-preview {
      margin-top: 20px;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px;
    }
    
    .text-preview pre {
      white-space: pre-wrap;
      font-family: monospace;
      font-size: 14px;
      line-height: 1.4;
    }
  `]
})
export class EmailTemplateExampleComponent {
  private emailTemplateService = inject(EmailTemplateService);
  
  emailHtml = '';
  emailText = '';

  // Datos de ejemplo para la plantilla
  private exampleData: EmailTemplateData = {
    userName: 'Diego Boos',
    userEmail: 'diego-boos@hotmail.com',
    confirmationLink: 'https://siriscloud.com/auth/confirm-email?token=abc123&email=diego-boos@hotmail.com',
    verificationCode: '907857',
    currentDate: new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    websiteUrl: 'https://siriscloud.com',
    supportUrl: 'https://siriscloud.com/support',
    privacyUrl: 'https://siriscloud.com/privacy',
    termsUrl: 'https://siriscloud.com/terms'
  };

  ngOnInit() {
    // Generar plantilla completa por defecto
    this.generateFullTemplate();
  }

  generateFullTemplate() {
    // Validar datos antes de generar
    const validation = this.emailTemplateService.validateEmailData(this.exampleData);
    
    if (!validation.isValid) {
      console.error('Datos faltantes:', validation.missingFields);
      return;
    }

    this.emailHtml = this.emailTemplateService.generateConfirmationEmail(
      this.exampleData, 
      false // Plantilla completa
    );
  }

  generateSimpleTemplate() {
    this.emailHtml = this.emailTemplateService.generateConfirmationEmail(
      this.exampleData, 
      true // Plantilla simple
    );
  }

  generateTextTemplate() {
    this.emailText = this.emailTemplateService.generateConfirmationEmailText(this.exampleData);
  }

  // Método para usar en el servicio de autenticación
  generateEmailForUser(userEmail: string, userName: string, confirmationToken: string) {
    const emailData: EmailTemplateData = {
      userName,
      userEmail,
      confirmationLink: `https://siriscloud.com/auth/two-factor-confirmation?token=${confirmationToken}&email=${encodeURIComponent(userEmail)}`,
      verificationCode: this.generateVerificationCode(),
      currentDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    return {
      html: this.emailTemplateService.generateConfirmationEmail(emailData),
      text: this.emailTemplateService.generateConfirmationEmailText(emailData)
    };
  }

  private generateVerificationCode(): string {
    // Generar código de 6 dígitos
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}

// Ejemplo de uso en el AuthService
export class AuthServiceEmailExample {
  private emailTemplateService = inject(EmailTemplateService);

  async sendConfirmationEmail(userEmail: string, userName: string, confirmationToken: string) {
    const emailData: EmailTemplateData = {
      userName,
      userEmail,
      confirmationLink: `${environment.baseUrl}/auth/two-factor-confirmation?token=${confirmationToken}&email=${encodeURIComponent(userEmail)}`,
      verificationCode: this.generateVerificationCode(),
      currentDate: new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const emailContent = {
      html: this.emailTemplateService.generateConfirmationEmail(emailData),
      text: this.emailTemplateService.generateConfirmationEmailText(emailData)
    };

    // Aquí enviarías el email usando tu servicio de email (SendGrid, AWS SES, etc.)
    // await this.emailService.send({
    //   to: userEmail,
    //   subject: 'Confirmar tu Email - Siris Cloud',
    //   html: emailContent.html,
    //   text: emailContent.text
    // });

    console.log('Email generado:', emailContent);
    return emailContent;
  }

  private generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
