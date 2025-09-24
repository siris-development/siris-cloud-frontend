/* import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetabaseService {

  constructor() { }

  generateEmbedUrl(dashboardId: number, params: Record<string, any> = {}): string {
    const metabaseSecretKey = environment.METABASE_SECRET_KEY;
    const metabaseSiteUrl = environment.METABASE_SITE_URL;

    if (!metabaseSecretKey || !metabaseSiteUrl) {
      throw new Error('Metabase configuration is missing');
    }

    const payload = {
      resource: { dashboard: dashboardId },
      params: params,
      exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
    };

    const token = jwt.sign(payload, metabaseSecretKey);
    
    return `${metabaseSiteUrl}/embed/dashboard/${token}#bordered=true&titled=true`;
  }
}
 */