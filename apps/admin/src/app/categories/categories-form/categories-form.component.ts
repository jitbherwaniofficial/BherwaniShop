import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@grafficocreation/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
  selector: 'admin-categories-form',
  templateUrl: './categories-form.component.html',
  styles: [],
})
export class CategoriesFormComponent implements OnInit {
  form: FormGroup;
  isSubmitted = false;
  editMode = false;
  currentCategoryId : string;

  constructor(
    private formBuilder: FormBuilder,
    private location: Location,
    private categoriesService: CategoriesService,
    private messageService: MessageService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      icon: ['', Validators.required],
      color:['#fff'],
    });

    this._checkEditMode();
  }
  onSubmit() {
    this.isSubmitted = true;
    if (this.form.invalid) {
      return;
    }
    const category: Category = {
      id : this.currentCategoryId,
      name: this.form.controls.name.value,
      icon: this.form.controls.icon.value,
      color: this.form.controls.color.value,
    };

    if (this.editMode) {
      this._updateCategory(category)
    }else {
      this._addCategory(category)
    }
  }

  onCancel(){
    this.location.back();
  }
    

  private _addCategory(category:Category){
    this.categoriesService.createCategories(category).subscribe(
      (category:Category) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Category ${category.name} is Created`,
        });
        timer(1000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Category is not Created',
        });
      }
    );
  }

  private _updateCategory(category:Category){
    this.categoriesService.updateCategory(category).subscribe(
      (category:Category) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Category ${category.name} is Updated`,
        });
        timer(1000)
          .toPromise()
          .then(() => {
            this.location.back();
          });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Category is not Created',
        });
      }
    );
  }

  private _checkEditMode() {
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.editMode = true;
        this.currentCategoryId = params.id;
        this.categoriesService.getCategory(params.id).subscribe(category=>{
          this.form.controls.name.setValue(category.name);
          this.form.controls.icon.setValue(category.icon);
          this.form.controls.color.setValue(category.color);
        })
      }
    })
  }
}
