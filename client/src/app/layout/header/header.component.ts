import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatProgressBar } from '@angular/material/progress-bar';
import { BusyService } from '../../core/services/busy.service';
import { CartService } from '../../core/services/cart.service';
import { AccountService } from '../../core/services/account.service';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatButtonModule, 
    MatIconModule, 
    MatBadgeModule, 
    RouterLink, 
    RouterLinkActive,
    MatProgressBar,
    MatMenu,
    MatDivider,
    MatMenuItem,
    MatMenuTrigger
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  constructor(
    public busyService: BusyService,
    public cartService: CartService,
    public accountService: AccountService,
    private router: Router
  ) {}

  logout() {
    this.accountService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl("/");
        this.accountService.currentUser.set(null);
      }
    })
  }
}
