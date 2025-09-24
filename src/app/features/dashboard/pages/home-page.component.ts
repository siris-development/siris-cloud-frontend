import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantInfoComponent } from '../../../shared/components/tenant-info/tenant-info.component';
import { AuthService } from '@/features/auth';

@Component({
  selector: 'app-home',
  imports: [CommonModule, TenantInfoComponent],
  templateUrl: './home-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  authService = inject(AuthService);
}
