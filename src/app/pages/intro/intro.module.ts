import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";

import { IntroPage } from "./intro";
import { IntroPageRoutingModule } from "./intro-routing.module";

@NgModule({
  imports: [CommonModule, IonicModule, IntroPageRoutingModule],
  declarations: [IntroPage],
  entryComponents: [IntroPage],
})
export class IntroModule {}
