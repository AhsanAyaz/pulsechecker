import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  client: SupabaseClient;
  constructor() { 
    this.client = createClient("https://gflvvytymdmrbjpmymhb.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmbHZ2eXR5bWRtcmJqcG15bWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAyNTIwMjIsImV4cCI6MTk5NTgyODAyMn0.1m-3IhFB-87AKk_-UIPzB0O1URgBwl78oKu8sNe8aFU");
    this.getData();
  }

  async getData() {
    const { data } = await this.client.from("Session").select();
    console.log({data})
  }

  async signInWithGoogle() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
    })
    return {data, error}
  }

  async signInWithGitHub() {
    const { data, error } = await this.client.auth.signInWithOAuth({
      provider: 'github',
    })
    return {data, error}
  }
}
