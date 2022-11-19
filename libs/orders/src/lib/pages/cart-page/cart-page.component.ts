import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemDetailed, OrdersService } from '@grafficocreation/orders';
import { Subject, takeUntil } from 'rxjs';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'orders-cart-page',
  templateUrl: './cart-page.component.html',
  styles: [
  ]
})
export class CartPageComponent implements OnInit, OnDestroy {

  cartItemsDetailed: CartItemDetailed[] =[];
  cartCount = 0;
  endSubs$: Subject<any> = new Subject();

  constructor(
    private router: Router,
    private cartService: CartService,
    private orderService: OrdersService
  ) { }

  ngOnDestroy(): void {
    this.endSubs$.next(void 0);
    this.endSubs$.complete();
  }

  ngOnInit(): void {
    this._getCartDetails()
  }

  backToShop(){
    this.router.navigate(['products']);
  }

  deleteCartItem(cartItem:CartItemDetailed){
    this.cartService.deleteCartItem(cartItem.product.id)
  }

  private _getCartDetails(){
    this.cartService.cart$.pipe(takeUntil(this.endSubs$)).subscribe(resCart =>{
      this.cartItemsDetailed = [];
      this.cartCount = resCart?.items.length ?? 0;
      resCart.items.forEach(cartItem => {
        this.orderService.getProduct(cartItem.productId).subscribe(resProduct =>{
          this.cartItemsDetailed.push({
            product:resProduct,
            quantity:cartItem.quantity
          })
        })        
      })
    })
  }

  updateCartItemQuantity(event, cartItem: CartItemDetailed){
    this.cartService.setCartItem({
      productId:cartItem.product.id,
      quantity:event.value
    }, true)
  }

}
