import {Component, inject} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {CurrencyPipe, KeyValuePipe} from '@angular/common';
import {ModuleType, Zone} from '../models/budget';


@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CurrencyPipe,
    KeyValuePipe
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
  moduleTypes: ModuleType[] = []; // Aquí se cargará la lista de tipos de módulos desde el JSON Server
  zones = Object.values(Zone); // Enum convertido en array para el select

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.budgetForm = this.fb.group({
      client: ['', Validators.required],
      date: ['', [Validators.required, this.maxDateValidator]],
      modules: this.fb.array([], Validators.minLength(5)), // Se asegura que haya al menos 5 módulos
    });

    // Aquí llamarías a la API para cargar `moduleTypes`
  }

  get modules(): FormArray {
    return this.budgetForm.get('modules') as FormArray;
  }

  // Método para añadir un módulo
  addModule() {
    const moduleForm = this.fb.group({
      moduleType: ['', Validators.required],
      zone: ['', Validators.required],
      price: [{ value: 0, disabled: true }],
      slots: [{ value: 0, disabled: true }]
    });

    moduleForm.get('moduleType')?.valueChanges.subscribe((moduleId) => {
      if (moduleId !== null) {
        const selectedModule = this.moduleTypes.find(mod => mod.id === +moduleId);
        if (selectedModule) {
          moduleForm.patchValue({
            price: selectedModule.price,
            slots: selectedModule.slots
          });
        }
      }
    });

    this.modules.push(moduleForm);
  }

  // Método para remover un módulo
  removeModule(index: number) {
    this.modules.removeAt(index);
  }

  // Validador personalizado para la fecha
  maxDateValidator(control: AbstractControl) {
    const today = new Date();
    const selectedDate = new Date(control.value);
    return selectedDate > today ? { maxDate: true } : null;
  }

  onSubmit() {

  }
}
