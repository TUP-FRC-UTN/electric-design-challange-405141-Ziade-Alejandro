import { Routes } from '@angular/router';
import {BudgetListComponent} from './budget-list/budget-list.component';
import {BudgetFormComponent} from './budget-form/budget-form.component';
import {BudgetViewComponent} from './budget-view/budget-view.component';

export const routes: Routes = [
  {
    path: '',component:BudgetListComponent
  },
  // {
  //   path: 'form',loadComponent:()=> import('./budget-form/budget-form.component').then(m=>m.BudgetFormComponent),
  // },
  {
  path:'form',component:BudgetFormComponent
  },
  {
    path: 'preview:id',loadComponent:() => import('./budget-view/budget-view.component').then(m=>m.BudgetViewComponent)
  },
  {
    path: '**',component:BudgetListComponent
  }
];
