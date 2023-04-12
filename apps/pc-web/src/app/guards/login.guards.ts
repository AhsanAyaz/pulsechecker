import { inject } from "@angular/core";
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { SupabaseService } from "../services/supabase.service";

export const canActivateLogin: CanActivateFn =
    async () => {
      const supabase = inject(SupabaseService);
      const router = inject(Router);
      const {data } =  await supabase.client.auth.getUser();
      const { user } = data;
      if (!user) {
        router.navigate(['/login'])
        return false;
      }
      supabase.user = user;
      return true;
    };

