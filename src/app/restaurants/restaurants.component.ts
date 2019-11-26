import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations'

import { FormBuilder, FormGroup, FormControl } from '@angular/forms'

import { Restaurant } from './restaurant/restaurant.model'
import { RestaurantsService } from './restaurants.service'

import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/debounceTime'
import 'rxjs/add/operator/distinctUntilChanged'
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/from'
import { Observable } from 'rxjs/Observable'

@Component({
  selector: 'mt-restaurants',
  templateUrl: './restaurants.component.html',
  animations: [
    trigger('toggleSearch', [
      state('hidden', style({
        opacity: 0,
        "max-height": "0px"
      })),
      state('visible', style({
        opacity: 1,
        "max-height": "70px",
        "margin-top": "20px"
      })),
      transition('hidden => visible', animate('250ms 0s ease-in')),
      transition('visible => hidden', animate('250ms 0s ease-out'))
    ])
  ]
})
export class RestaurantsComponent implements OnInit {

  searchBarState = 'hidden'

  formGroup: FormGroup
  searchControl: FormControl = this.formBuilder.control('')

  restaurants: Restaurant[]

  constructor(private formBuilder: FormBuilder, private restaurantsService: RestaurantsService) { }

  ngOnInit() {

    this.searchControl.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .switchMap(searchTerm => this.restaurantsService.restaurants(searchTerm)
        .catch(error => Observable.from([])))
      .subscribe(restaurants => this.restaurants = restaurants)

    this.restaurantsService.restaurants().subscribe(
      restaurants => this.restaurants = restaurants)
    this.initForm()
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      search: this.searchControl
    })
  }

  toggleSearch() {
    this.searchBarState = this.searchBarState === 'hidden' ? 'visible' : 'hidden'
  }

}
