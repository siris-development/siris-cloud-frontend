import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ErrorToastComponent } from './shared/components/error-toast/error-toast.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, RouterOutlet, ErrorToastComponent],
})
export class AppComponent implements OnInit {
  title = 'angular-user-management'
  session: any;

  constructor() {}

  ngOnInit() {}
}