import { HttpClient } from '@angular/common/http';
import { inject, Injectable  } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherforecastService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiURL + '/weatherforecast';

  public get(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
