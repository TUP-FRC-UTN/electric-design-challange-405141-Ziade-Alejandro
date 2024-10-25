import {Component, inject} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ModuleType, Zone} from '../models/budget';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {CurrencyPipe} from '@angular/common';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe
  ],
  templateUrl: './budget-form.component.html',
  styleUrl: './budget-form.component.css',
})
export class BudgetFormComponent {
  /* ADDITIONAL DOCS:
    - https://angular.dev/guide/forms/typed-forms#formarray-dynamic-homogenous-collections
    - https://dev.to/chintanonweb/angular-reactive-forms-mastering-dynamic-form-validation-and-user-interaction-32pe
  */

  budgetForm!: FormGroup;
  moduleTypes: ModuleType[]=[];

  zones = Object.values(Zone);

  //services
  private formBuilder = inject(FormBuilder);
  // private http = inject(HttpClient)
  private router= inject(Router);

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.budgetForm = this.formBuilder.group({
      date: [new Date(), [Validators.required]],
      client:['',Validators.required],
      modules: this.formBuilder.array([],Validators.minLength(5))
    })
    this.loadModulesType()
    this.addModule()
  }

  get modules() {
    return this.budgetForm.get('modules') as FormArray;
  }

  addModule() {
    const moduleForm = this.formBuilder.group({
      ModuleType:['', Validators.required],
      zone:['',Validators.required]
    })
    this.modules.push(moduleForm);
  }

  loadModulesType() {
    this.http.get<ModuleType[]>('http://localhost:3000/api/module-types').subscribe(data=>{
      this.moduleTypes = data;
    })
  }

  validateDate(control:FormControl) {
    return new Date(control.value) <= new Date() ? null: {invalidDate:true}
  }

  onSubmit() {
    if (this.budgetForm.valid) {
      const budfetData = this.budgetForm.value
      this.http.post('http://localhost:3000/api/budgets', budfetData).subscribe(data=>{
        this.router.navigate(['/']);
      })
    }
  }
}
