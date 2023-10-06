import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { wgs84togcj02 } from '../utils/gps-utils';
import MapboxLanguage from '@mapbox/mapbox-gl-language';
import { ApiService } from '../services/api.service';
import { FormControl, FormGroup } from '@angular/forms';
import addMonths from 'date-fns/addMonths';
import endOfToday from 'date-fns/endOfToday';
import getUnixTime from 'date-fns/getUnixTime'

import * as polyline from '@mapbox/polyline';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('map', {static: true, read: ElementRef}) mapContainer: any;

  private map: any;

  mapType = 'mapbox://styles/mapbox/streets-v12';

  source: any;

  aggSource: any;

  paint: any = {
    'line-color': '#f00',
    'line-width': 2,
    'line-blur': 2,
    'line-opacity': 0.8
  }

  loadNumber = 50;

  layerId: string = '';

  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string, private apiService: ApiService) {

  }

  ngOnInit(): void {
    // this.initMap();
    const today = endOfToday();
    const start = addMonths(today, -1);
    this.range.get('start')?.setValue(start);
    this.range.get('end')?.setValue(today);
    this.load();
    // this.loadRoutes();
  }

  load() {
    this.source = null;
    const start = getUnixTime(this.range.get('start')?.value as Date);
    const end = getUnixTime(this.range.get('end')?.value as Date);
    const payload = {
      start, end, count: this.loadNumber
    }
    this.apiService.loadTracks(payload).subscribe((resp: any) => {
      const features = resp.filter((r: any) => !!r.map?.summary_polyline && r.type === 'Ride').map((r: any) => {
        const coord = polyline.decode(r.map.summary_polyline);
        return {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: coord.map((p: any) => [p[1], p[0]])
          }
        }
      });
      const agg = features.map((f: any) => {
        return {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: f.geometry.coordinates[0]
          }
        }
      });
      this.aggSource = {
        type: 'FeatureCollection',
        features: agg
      }
      this.layerId = getUnixTime(new Date()) + '';
      this.source = {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features
        }
      };
      // this.map.fire(new Event('loaded'));
      this.map.triggerRepaint();
      this.onRender();
    })
  }

  update() {
    this.paint = JSON.parse(JSON.stringify(this.paint));
  }

  onMapCreate(instance: any) {
    this.map = instance;
    const language = new MapboxLanguage({defaultLanguage: 'zh-Hans'});
    this.map.addControl(language);
  }

  onRender() {
    const features = this.map.querySourceFeatures('start', {
      layers: ['clusters']
    });
    if (features && features.length) {
      const sorted = features.sort((a: any, b: any) => {
        return (b.properties?.point_count || 0) - (a.properties?.point_count || 0);
      });
      const target = sorted[0];
      this.map.setCenter(target.geometry.coordinates)
    }
  }

  private drawRoutes(routes: any[]) {
    const features = routes.map(route => {
      return {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: route.map((p: any) => [p.lng, p.lat])
        }
      }
    });
    this.source = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features
      }
    };
  }

  private loadRoutes() {
    this.http.get(`${this.baseUrl}api/gpx`).subscribe((result: any) => {
      console.log(result)
      this.drawRoutes(result);
    })
  }

  private converLocation(routes: any[]) {
    return routes.map(tracks => tracks.map((t: any) => wgs84togcj02(t.lng, t.lat)));
  }
}

