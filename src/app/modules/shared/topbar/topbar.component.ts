import { Component } from '@angular/core';
import { AuthService } from '../../login/services/auth.service';
import { ConfirmDialogService } from '../confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css',
})
export class TopbarComponent {
  
  constructor(
    private authService: AuthService,
    private confirmDialogService: ConfirmDialogService
  ) {}

  logout(): void {
    this.confirmDialogService.confirmLogout().subscribe(confirmed => {
      if (confirmed) {
        this.authService.logout();
      }
    });
  }
}
