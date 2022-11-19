import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { AccordionModule } from 'primeng/accordion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './shared/nav/nav.component';
import { UiModule } from '@grafficocreation/ui';
import { HttpClientModule } from '@angular/common/http';
import { OrdersModule } from '@grafficocreation/orders';
import { ProductsModule } from '@grafficocreation/products';
import { MessagesComponent } from './shared/messages/messages.component';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { UsersModule } from '@grafficocreation/users';


@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    MessagesComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: HomePageComponent },
    ]),
    AccordionModule,
    BrowserAnimationsModule,
    UiModule,
    HttpClientModule,
    OrdersModule,
    ProductsModule,
    ToastModule,
    UsersModule
  ],
  providers: [MessageService],
  bootstrap: [AppComponent],
  exports: [
    MessagesComponent
  ],
})
export class AppModule {}
