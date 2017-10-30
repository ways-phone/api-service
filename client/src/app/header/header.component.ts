import { Component, OnInit } from '@angular/core';
import { logout } from '../../utils/authentication';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private router: Router) {}

  logout(): void {
    logout();
    this.router.navigate(['./login']);
  }

  ngOnInit() {}
}
