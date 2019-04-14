import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeaturePakageComponent } from './feature-pakage/feature-pakage.component';
// import {MatCheckboxModule} from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

export const routes = [
  { path: '', component: FeaturePakageComponent, pathMatch: 'full'  }
];


@NgModule({
  declarations: [FeaturePakageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule   

    // MatCheckboxModule
  ]
})
export class FeaturedModule { }
