import { Component } from '@angular/core';
import { TopbarComponent } from '../../../shared/topbar/topbar.component';
import { SidebarComponent } from '../../../shared/sidebar/sidebar.component';
import { FooterComponent } from '../../../shared/footer/footer.component';

@Component({
  selector: 'app-main-page',
  imports: [TopbarComponent, SidebarComponent, FooterComponent],
  standalone: true,
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
