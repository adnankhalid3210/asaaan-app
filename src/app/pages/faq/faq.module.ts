import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FaqComponent } from './faq.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';


export const routes = [
  { path: '', component: FaqComponent, pathMatch: 'full' }
];


@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class FaqModule { }
