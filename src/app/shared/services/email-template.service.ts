import { Injectable } from '@angular/core';

export interface EmailTemplateData {
  userName: string;
  userEmail: string;
  confirmationLink: string;
  verificationCode: string;
  currentDate: string;
  websiteUrl?: string;
  supportUrl?: string;
  privacyUrl?: string;
  termsUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailTemplateService {

  private readonly defaultUrls = {
    websiteUrl: 'https://siriscloud.com',
    supportUrl: 'https://siriscloud.com/support',
    privacyUrl: 'https://siriscloud.com/privacy',
    termsUrl: 'https://siriscloud.com/terms'
  };

  /**
   * Genera el HTML de la plantilla de confirmación de email
   */
  generateConfirmationEmail(data: EmailTemplateData, useSimpleTemplate: boolean = false): string {
    const template = useSimpleTemplate ? this.getSimpleTemplate() : this.getFullTemplate();
    return this.replaceTemplateVariables(template, { ...this.defaultUrls, ...data });
  }

  /**
   * Genera el texto plano de la plantilla de confirmación
   */
  generateConfirmationEmailText(data: EmailTemplateData): string {
    const textTemplate = `
        Confirmar tu Email - Siris Cloud

        Hola ${data.userName},

        Gracias por registrarte en Siris Cloud. Para completar tu registro, confirma tu dirección de correo electrónico.

        Haz clic en este enlace para confirmar:
        ${data.confirmationLink}

        O usa este código de verificación:
        ${data.verificationCode}

        Este enlace es válido por 24 horas.

        ¿Qué sigue después?
        - Completar la configuración de tu empresa
        - Acceder al dashboard principal
        - Configurar tus integraciones
        - Invitar a tu equipo

        Si tienes alguna pregunta, contacta a nuestro equipo de soporte.

        Siris Cloud - Plataforma de Gestión Empresarial
        Enviado a ${data.userEmail} el ${data.currentDate}

        Si no creaste una cuenta en Siris Cloud, puedes ignorar este email de forma segura.
    `.trim();

    return textTemplate;
  }

  /**
   * Valida que todos los datos requeridos estén presentes
   */
  validateEmailData(data: EmailTemplateData): { isValid: boolean; missingFields: string[] } {
    const requiredFields = ['userName', 'userEmail', 'confirmationLink', 'verificationCode', 'currentDate'];
    const missingFields: string[] = [];

    requiredFields.forEach(field => {
      if (!data[field as keyof EmailTemplateData]) {
        missingFields.push(field);
      }
    });

    return {
      isValid: missingFields.length === 0,
      missingFields
    };
  }

  /**
   * Obtiene la plantilla HTML completa
   */
  private getFullTemplate(): string {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmar tu Email - Siris Cloud</title>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
                    background-color: #f8fafc;
                    line-height: 1.6;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    padding: 40px 30px;
                    text-align: center;
                }
                .logo {
                    width: 60px;
                    height: 60px;
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 24px;
                    font-weight: bold;
                    color: white;
                }
                .header h1 {
                    color: white;
                    margin: 0;
                    font-size: 28px;
                    font-weight: 700;
                }
                .header p {
                    color: rgba(255, 255, 255, 0.9);
                    margin: 10px 0 0;
                    font-size: 16px;
                }
                .content {
                    padding: 40px 30px;
                }
                .greeting {
                    font-size: 18px;
                    color: #1f2937;
                    margin-bottom: 20px;
                }
                .message {
                    font-size: 16px;
                    color: #4b5563;
                    margin-bottom: 30px;
                    line-height: 1.7;
                }
                .cta-container {
                    text-align: center;
                    margin: 40px 0;
                }
                .cta-button {
                    display: inline-block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    text-decoration: none;
                    padding: 16px 32px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 16px;
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    box-shadow: 0 4px 14px 0 rgba(102, 126, 234, 0.4);
                }
                .alternative {
                    margin-top: 30px;
                    padding: 20px;
                    background-color: #f9fafb;
                    border-radius: 8px;
                    border-left: 4px solid #667eea;
                }
                .alternative h3 {
                    color: #374151;
                    margin: 0 0 10px;
                    font-size: 16px;
                    font-weight: 600;
                }
                .code {
                    font-family: 'Courier New', monospace;
                    font-size: 24px;
                    font-weight: bold;
                    color: #667eea;
                    letter-spacing: 2px;
                    background-color: #ffffff;
                    padding: 12px 20px;
                    border-radius: 6px;
                    border: 2px solid #e5e7eb;
                    display: inline-block;
                    margin: 10px 0;
                }
                .security-note {
                    background-color: #fef3c7;
                    border: 1px solid #f59e0b;
                    border-radius: 8px;
                    padding: 16px;
                    margin: 30px 0;
                }
                .security-note h4 {
                    color: #92400e;
                    margin: 0 0 8px;
                    font-size: 14px;
                    font-weight: 600;
                }
                .security-note p {
                    color: #92400e;
                    margin: 0;
                    font-size: 14px;
                }
                .footer {
                    background-color: #f9fafb;
                    padding: 30px;
                    text-align: center;
                    border-top: 1px solid #e5e7eb;
                }
                .footer p {
                    color: #6b7280;
                    font-size: 14px;
                    margin: 0 0 10px;
                }
                .footer a {
                    color: #667eea;
                    text-decoration: none;
                }
                @media (max-width: 600px) {
                    .container {
                        margin: 0;
                        border-radius: 0;
                    }
                    .header, .content, .footer {
                        padding: 30px 20px;
                    }
                    .header h1 {
                        font-size: 24px;
                    }
                    .cta-button {
                        padding: 14px 28px;
                        font-size: 15px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">SC</div>
                    <h1>¡Bienvenido a Siris Cloud!</h1>
                    <p>Confirma tu dirección de correo electrónico</p>
                </div>

                <div class="content">
                    <div class="greeting">Hola {{userName}},</div>

                    <div class="message">
                        Gracias por registrarte en Siris Cloud. Para completar tu registro y acceder a todas las funcionalidades de nuestra plataforma, necesitamos verificar tu dirección de correo electrónico.
                    </div>

                    <div class="cta-container">
                        <a href="{{confirmationLink}}" class="cta-button">Confirmar mi Email</a>
                    </div>

                    <div class="alternative">
                        <h3>¿No puedes hacer clic en el botón?</h3>
                        <p>Copia y pega este enlace en tu navegador:</p>
                        <p style="word-break: break-all; color: #667eea; font-size: 14px;">{{confirmationLink}}</p>
                        
                        <h3>O usa este código de verificación:</h3>
                        <div class="code">{{verificationCode}}</div>
                        <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">
                            Ingresa este código en la página de confirmación para verificar tu email.
                        </p>
                    </div>

                    <div class="security-note">
                        <h4>🔒 Información de Seguridad</h4>
                        <p>Este enlace es válido por 24 horas. Si no confirmas tu email en este tiempo, deberás solicitar un nuevo enlace de confirmación.</p>
                    </div>

                    <div class="message">
                        <strong>¿Qué sigue después?</strong><br>
                        Una vez confirmado tu email, podrás:
                        <ul style="color: #4b5563; margin: 10px 0;">
                            <li>Completar la configuración de tu empresa</li>
                            <li>Acceder al dashboard principal</li>
                            <li>Configurar tus integraciones</li>
                            <li>Invitar a tu equipo</li>
                        </ul>
                    </div>

                    <div class="message">
                        Si tienes alguna pregunta o necesitas ayuda, no dudes en contactar a nuestro equipo de soporte.
                    </div>
                </div>

                <div class="footer">
                    <p><strong>Siris Cloud</strong> - Plataforma de Gestión Empresarial</p>
                    <p>Este email fue enviado a {{userEmail}} el {{currentDate}}</p>
                    
                    <div style="margin-top: 20px;">
                        <a href="{{websiteUrl}}">Sitio Web</a> | 
                        <a href="{{supportUrl}}">Soporte</a> | 
                        <a href="{{privacyUrl}}">Privacidad</a> | 
                        <a href="{{termsUrl}}">Términos</a>
                    </div>

                    <p style="margin-top: 20px; font-size: 12px; color: #9ca3af;">
                        Si no creaste una cuenta en Siris Cloud, puedes ignorar este email de forma segura.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `.trim();
  }

  /**
   * Obtiene la plantilla HTML simple
   */
  private getSimpleTemplate(): string {
    return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Confirmar Email - Siris Cloud</title>
            <style>
                body {
                    margin: 0;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    line-height: 1.6;
                }
                .email-container {
                    max-width: 500px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 8px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    padding-bottom: 20px;
                    border-bottom: 2px solid #667eea;
                }
                .logo {
                    font-size: 32px;
                    font-weight: bold;
                    color: #667eea;
                    margin-bottom: 10px;
                }
                .title {
                    color: #333;
                    font-size: 24px;
                    margin: 0;
                }
                .content {
                    color: #555;
                    font-size: 16px;
                    margin-bottom: 30px;
                }
                .cta-button {
                    display: inline-block;
                    background-color: #667eea;
                    color: white;
                    text-decoration: none;
                    padding: 15px 30px;
                    border-radius: 5px;
                    font-weight: bold;
                    text-align: center;
                    margin: 20px 0;
                }
                .verification-code {
                    background-color: #f8f9fa;
                    border: 2px solid #667eea;
                    border-radius: 5px;
                    padding: 15px;
                    text-align: center;
                    margin: 20px 0;
                    font-family: monospace;
                    font-size: 24px;
                    font-weight: bold;
                    color: #667eea;
                    letter-spacing: 3px;
                }
                .footer {
                    margin-top: 30px;
                    padding-top: 20px;
                    border-top: 1px solid #eee;
                    font-size: 14px;
                    color: #888;
                    text-align: center;
                }
                .warning {
                    background-color: #fff3cd;
                    border: 1px solid #ffeaa7;
                    border-radius: 5px;
                    padding: 15px;
                    margin: 20px 0;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <div class="logo">Siris Cloud</div>
                    <h1 class="title">Confirmar tu Email</h1>
                </div>

                <div class="content">
                    <p>Hola <strong>{{userName}}</strong>,</p>
                    
                    <p>Gracias por registrarte en Siris Cloud. Para completar tu registro, confirma tu dirección de correo electrónico haciendo clic en el botón de abajo:</p>

                    <div style="text-align: center;">
                        <a href="{{confirmationLink}}" class="cta-button">Confirmar Email</a>
                    </div>

                    <p>O copia y pega este enlace en tu navegador:</p>
                    <p style="word-break: break-all; color: #667eea; font-size: 14px;">{{confirmationLink}}</p>

                    <div class="verification-code">{{verificationCode}}</div>
                    <p style="text-align: center; font-size: 14px; color: #666;">Código de verificación alternativo</p>

                    <div class="warning">
                        <strong>Importante:</strong> Este enlace expira en 24 horas. Si no confirmas tu email en este tiempo, deberás solicitar un nuevo enlace.
                    </div>

                    <p>Una vez confirmado tu email, podrás acceder a todas las funcionalidades de Siris Cloud.</p>

                    <p>Si no creaste una cuenta en Siris Cloud, puedes ignorar este email de forma segura.</p>
                </div>

                <div class="footer">
                    <p><strong>Siris Cloud</strong></p>
                    <p>Enviado a {{userEmail}} el {{currentDate}}</p>
                    <p>
                        <a href="{{websiteUrl}}" style="color: #667eea;">Sitio Web</a> | 
                        <a href="{{supportUrl}}" style="color: #667eea;">Soporte</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
    `.trim();
  }

  /**
   * Reemplaza las variables en la plantilla
   */
  private replaceTemplateVariables(template: string, data: EmailTemplateData): string {
    let result = template;
    
    Object.entries(data).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), value || '');
    });

    return result;
  }
}

