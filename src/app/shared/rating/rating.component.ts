import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent {
  @Input() ratingsCount: number;
  @Input() ratingsValue: number;
  @Input() direction: string;
  avg: number;
  stars: Array<string>;
  constructor() { 
    console.log(this.ratingsCount, this.ratingsValue)
  }

  ngDoCheck() {
    if (this.ratingsCount && this.ratingsValue && !this.avg) {
      this.calculateAvgValue();
    }
  }

  rate(value) {

  }

  calculateAvgValue() {
    this.avg = this.ratingsValue / this.ratingsCount;
  //  console.log
    switch (true) {
      // case this.avg > 0 && this.avg < 1: {
      //   this.stars = ['star_half', 'star_border', 'star_border', 'star_border', 'star_border'];
      //   break;
      // }
      case this.avg >= 0 && this.avg < 1: {
        this.stars = ['star', 'star_border', 'star_border', 'star_border', 'star_border'];
        break;
      }
      // case this.avg > 20 && this.avg < 40: {
      //   this.stars = ['star', 'star_half', 'star_border', 'star_border', 'star_border'];
      //   break;
      // }
      case this.avg > 1 && this.avg < 2: {
        this.stars = ['star', 'star', 'star_border', 'star_border', 'star_border'];
        break;
      }
      // case this.avg > 40 && this.avg < 60: {
      //   this.stars = ['star', 'star', 'star_half', 'star_border', 'star_border'];
      //   break;
      // }
      case this.avg > 2 && this.avg < 3: {
        this.stars = ['star', 'star', 'star', 'star_border', 'star_border'];
        break;
      }
      // case this.avg > 60 && this.avg < 80: {
      //   this.stars = ['star', 'star', 'star', 'star_half', 'star_border'];
      //   break;
      // }
      case this.avg > 3 && this.avg < 4: {
        this.stars = ['star', 'star', 'star', 'star', 'star_border'];
        break;
      }
      // case this.avg > 80 && this.avg < 100: {
      //   this.stars = ['star', 'star', 'star', 'star', 'star_half'];
      //   break;
      // }
      case this.avg > 4 && this.avg <= 5: {
        this.stars = ['star', 'star', 'star', 'star', 'star'];
        break;
      }
      default: {
        this.stars = ['star_border', 'star_border', 'star_border', 'star_border', 'star_border'];
        break;
      }
    }
  }
}
