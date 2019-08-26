import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { IntroPage } from "./intro";

const routes: Routes = [
  {
    path: "",
    component: IntroPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IntroPageRoutingModule {}
