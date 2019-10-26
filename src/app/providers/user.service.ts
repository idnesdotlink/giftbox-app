import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class User {
  isLoggedIn = new BehaviorSubject<boolean>(false);
}
