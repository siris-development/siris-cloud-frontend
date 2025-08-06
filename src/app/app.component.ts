import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [CommonModule, RouterOutlet],
})
export class AppComponent implements OnInit {
  title = 'angular-user-management'
  session: any;

  constructor() {}

  ngOnInit() {}
}