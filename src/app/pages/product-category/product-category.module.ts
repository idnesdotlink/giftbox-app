import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";

import { ProductCategoryPage } from "./product-category";
import { ProductCategoryFilterPage } from "../product-category-filter/product-category-filter";
import { ProductCategoryPageRoutingModule } from "./product-category-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductCategoryPageRoutingModule,
  ],
  declarations: [ProductCategoryPage, ProductCategoryFilterPage],
  entryComponents: [ProductCategoryFilterPage],
})
export class ProductCategoryModule {}
