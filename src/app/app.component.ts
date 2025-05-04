import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {SpinnerComponent} from "./theme/shared/components/spinner/spinner.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    imports: [
        RouterOutlet,
        SpinnerComponent
    ],
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'D-ZORIA';
}