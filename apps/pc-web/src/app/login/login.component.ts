import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'pulsechecker-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  router = inject(Router);
  supabase = inject(SupabaseService);

  async signInWithGoogle(): Promise<void> {
    const {data: user} = await this.supabase.signInWithGoogle();
    console.log(user);
    if (user) {
      this.router.navigate(['/']); // Navigate to the desired route after successful login
    }
  }

  async signInWithGitHub(): Promise<void> {
    const {data: user} = await this.supabase.signInWithGitHub();
    console.log(user);
    if (user) {
      this.router.navigate(['/']); // Navigate to the desired route after successful login
    }
  }
}
