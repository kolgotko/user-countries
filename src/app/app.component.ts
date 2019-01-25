import { Component, OnInit, OnDestroy } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  title = 'user-countries';
  menu = [
    { link: '/', label: 'user countries' },
    { link: '/editor/users', label: 'users editor' },
    { link: '/editor/countries', label: 'countries editor' },
  ];

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}

}
