import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-confirm-email-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './confirm-email-page.component.html',
})
export class ConfirmEmailPageComponent {
  private route = inject(ActivatedRoute);

  error: string | null = null;
  errorCode: string | null = null;
  errorDescription: string | null = null;

  constructor() {
    this.route.queryParamMap.subscribe(params => {
      this.error = params.get('error');
      this.errorCode = params.get('error_code');
      this.errorDescription = params.get('error_description');
    });
  }
}
