import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'products-categories-banner',
  templateUrl: './categories-banner.component.html',
  styles: [
  ]
})
export class CategoriesBannerComponent implements OnInit,OnDestroy {

  categories: Category[]= [];
  endSubs$ : Subject<any> = new Subject();

  constructor(private CategoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.CategoriesService.getCategories().pipe(takeUntil(this.endSubs$)).subscribe(categories => {
      this.categories = categories;
    })
  }

  ngOnDestroy(){
    this.endSubs$.next(void 0);
    this.endSubs$.complete()
  }

}
