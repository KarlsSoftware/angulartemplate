import { Component, inject } from '@angular/core';
import { WeatherforecastService } from '../weatherforecast.service';

@Component({
  selector: 'app-landing',
  imports: [],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
 title = 'angular-app';
  weatherForecasts: any[] = [];

  weatherForecastService = inject(WeatherforecastService);

  constructor() {
    this.weatherForecastService.get().subscribe((weatherForecasts) => {
      this.weatherForecasts = weatherForecasts;
    });
  }
}
