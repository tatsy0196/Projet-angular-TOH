import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';
import { WeaponDetailComponent } from './weapon-detail/weapon-detail.component';
import {WeaponsComponent} from "./weapons/weapons.component";
const routes: Routes = [
  { path: 'heroes', component: HeroesComponent },
  { path: 'weapons', component: WeaponsComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'heroDetail/:id', component: HeroDetailComponent },
  { path: 'WeaponDetail/:id', component: WeaponDetailComponent },

];
@NgModule({
  imports: [RouterModule.forRoot(routes)],

  exports: [RouterModule]
})
export class AppRoutingModule { }
