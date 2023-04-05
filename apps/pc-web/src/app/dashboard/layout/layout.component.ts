import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SupabaseService } from '../../services/supabase.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'pulsechecker-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  supabase = inject(SupabaseService)
  router = inject(Router);
  userService = inject(UserService);
  ngOnInit() {
    this.createUserIfRequired();
  }

  async createUserIfRequired() {
    const {data: {user}} = await this.supabase.client.auth.getUser()
    if (!user) {
      return;
    }
    this.userService.getOrCreateIfNecessary(user).subscribe(user => {
      console.log('user created', user);
    });
  }

  async logOut() {
    await this.supabase.client.auth.signOut();
    this.router.navigate(['/login'])
  }
}
