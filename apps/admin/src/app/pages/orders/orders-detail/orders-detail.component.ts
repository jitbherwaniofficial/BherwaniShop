import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService, ORDER_STATUS } from '@grafficocreation/orders';
import { MessageService } from 'primeng/api';
import { pipe, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'admin-orders-detail',
  templateUrl: './orders-detail.component.html',
  styles: [],
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
  order : Order;
  orderStatuses = [];
  selectedStatus :any;
  endsubs$: Subject<any> = new Subject();

  constructor(private ordersService: OrdersService, private route: ActivatedRoute, private messageService: MessageService) {}
  ngOnDestroy(): void {
    this.endsubs$.next(void 0);
    this.endsubs$.complete();
  }

  ngOnInit(): void {
    this._mapOrderStatus();
    this._getOrder();
  }

  private _mapOrderStatus(){
    this.orderStatuses = Object.keys(ORDER_STATUS).map(key=>{
      return {
        id: key,
        name : ORDER_STATUS[key].label
      }
    })
  }

  onStatusChange(event){
    this.ordersService.updateOrder({status:event.value},this.order.id).pipe(takeUntil(this.endsubs$)).subscribe(()=>{
      this.messageService.add({
        severity:'success',
        summary:'Success',
        detail:'Order is Updated'
      })
      
    }, () =>{
      this.messageService.add({
        severity:'error',
        summary:'Error',
        detail: 'Order is not updated!'
      })
    })
    
  }

  private _getOrder(){
    this.route.params.subscribe(params =>{
      if(params.id){
        this.ordersService.getOrder(params.id).pipe(takeUntil(this.endsubs$)).subscribe(order  =>{
          this.order = order;
          this.selectedStatus = order.status;
        })
      }
    })
  }
}
