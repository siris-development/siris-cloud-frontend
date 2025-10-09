import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-whatsapp-page',
  imports: [RouterModule],
  templateUrl: './whatsapp-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WhatsAppPageComponent { }
