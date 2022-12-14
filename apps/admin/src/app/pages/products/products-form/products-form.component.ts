import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Product, ProductsService } from '@grafficocreation/products';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
  selector: 'admin-products-form',
  templateUrl: './products-form.component.html',
  styles: [],
})
export class ProductsFormComponent implements OnInit, OnDestroy {
  editMode = false;
  form: FormGroup;
  isSubmitted = false;
  categories = [];
  imageDisplay: string | ArrayBuffer;
  currentProductId : string;
  endsubs$: Subject<any> = new Subject();
  
  constructor(
    private formBuilder: FormBuilder,
    private categoriesService: CategoriesService,
    private productsService : ProductsService,
    private messageService: MessageService,
    private location : Location,
    private route : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this._initForm();
    this._getCategories();
    this._checkEditMode();
  }

  ngOnDestroy() {
    this.endsubs$.next(void 0);
    this.endsubs$.complete();
  }

  private _initForm() {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      brand: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      countInStock: ['', Validators.required],
      description: ['', Validators.required],
      richDescription: [''],
      image: ['', Validators.required],
      isFeatured: [false],
    });
  }

  private _updateProduct(productFormData : FormData){
    this.productsService.updateProduct(productFormData,this.currentProductId ).pipe(takeUntil(this.endsubs$)).subscribe(
      (product:Product) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Product ${product.name} is Updated`,
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
          detail: 'Product is not Created',
        });
      }
    );
  }

  private _checkEditMode(){
    this.route.params.subscribe((params)=>{
      if(params.id){
        this.editMode = true;
        this.currentProductId = params.id;
        this.productsService.getProduct(params.id).pipe(takeUntil(this.endsubs$)).subscribe(product=>{
          this.form.controls.name.setValue(product.name);
          this.form.controls.category.setValue(product.category.id);
          this.form.controls.brand.setValue(product.brand);
          this.form.controls.price.setValue(product.price);
          this.form.controls.countInStock.setValue(product.countInStock);
          this.form.controls.isFeatured.setValue(product.isFeatured);
          this.form.controls.description.setValue(product.description);
          this.form.controls.richDescription.setValue(product.richDescription);
          this.form.controls.image.setValidators([]);
          this.form.controls.image.updateValueAndValidity();
          this.imageDisplay = product.image;
        })
      }
    })
  }

  onSubmit(){
    this.isSubmitted = true;
    if(this.form.invalid)
    return;

    const productFormData = new FormData();

    Object.keys(this.form.controls).map((key)=>{
      console.log(key);
      console.log(this.form.controls[key].value);
      productFormData.append(key,this.form.controls[key].value)
    })

    if (this.editMode) {
      this._updateProduct(productFormData)
    }else {
      this._addProduct(productFormData); 
    }

     
  }



  onCancel(){}

  onImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.imageDisplay = fileReader.result;
      };
      fileReader.readAsDataURL(file);
    }
  }

  private _getCategories() {
    this.categoriesService.getCategories().pipe(takeUntil(this.endsubs$)).subscribe((categories) => {
      this.categories = categories;
    });
  }

  private _addProduct(productData:FormData){
    this.productsService.createProduct(productData).pipe(takeUntil(this.endsubs$)).subscribe(
      (product:Product) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Product ${product.name} is Created`,
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
          detail: 'Product is not Created',
        });
      }
    );
  }
}
