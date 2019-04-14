import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HowItWorksComponent } from './how-it-works.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

export const routes = [
  { path: '', component: HowItWorksComponent, pathMatch: 'full'  }
];
@NgModule({
  declarations: [HowItWorksComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule   
  ]
})
export class HowItWorksModule { }
