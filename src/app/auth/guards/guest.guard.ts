import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/* export const GuestGuard: CanActivateFn = () => {
  const router = inject(Router);
  if (!supabase.session) {
    return true;
  } else {
    router.navigate(['/dashboard']);
    return false;
  }
};  */