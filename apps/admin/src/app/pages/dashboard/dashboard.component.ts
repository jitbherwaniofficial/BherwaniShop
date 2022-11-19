import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@grafficocreation/orders';
import { ProductsService } from '@grafficocreation/products';
import { UsersService } from '@grafficocreation/users';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  statistics = [];
  endsubs$ : Subject<any> = new Subject();
  constructor(
    private userService:UsersService,
    private productService:ProductsService,
    private ordersService : OrdersService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.ordersService.getOrdersCount(),
      this.productService.getProductsCount(),
      this.userService.getUsersCount(),
      this.ordersService.getTotalSales()
    ]).pipe(takeUntil(this.endsubs$)).subscribe((values)=>{
      this.statistics = values;
    })
  }

  ngOnDestroy(): void {
    this.endsubs$.next(void 0)
    this.endsubs$.complete();
    
  }
}
