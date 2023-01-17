import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import * as moment from 'moment';

import { IonSlides } from '@ionic/angular';
import { ViewChild } from '@angular/core';

import {
  DeviceMotion,
  DeviceMotionAccelerationData,
} from '@ionic-native/device-motion/ngx';

import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('slides', { static: false }) slides: IonSlides;
  watch: any;

  user: any = null;
  menu: number = 0;

  imageCharacter: any;
  imageCoordinates: any;
  pathImageCharacter: string = '';

  loading: any;

  constructor(
    private authService: AuthService,
    private deviceMotion: DeviceMotion,
    private loadingController: LoadingController
  ) {} // end of constructor

  ngOnInit(): void {
    this.showLoading('');
    this.authService.user$.subscribe((user: any) => {
      this.loading.dismiss();
      if (user) {
        this.user = user;
      } else {
        // this.router.navigate(['/login']);
      }
    });
  }

  ngAfterViewInit(): void {
    this.watch = this.deviceMotion
      .watchAcceleration({ frequency: 400 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.handleAcceleration(acceleration);
      });
  }

  ngOnDestroy() {
    this.watch.unsubscribe();
  }

  handleAcceleration(acceleration: DeviceMotionAccelerationData) {
    if(this.imageCharacter != undefined) {
      this.imageCharacter = document.getElementById('img-juego');
      this.imageCoordinates = this.imageCharacter.getBoundingClientRect();
      this.imageCharacter.style.left = (this.imageCoordinates.left + acceleration.x)+"px";
      this.imageCharacter.style.top = (this.imageCoordinates.top + acceleration.y)+"px";
    }
  }

  logoutUser() {
    this.authService.signOut();
  } // end of logoutUser

  // [1-DC | 2-MARVEL | 3-JUEGO]
  async chooseMenu(view: number) {
    await this.showLoading('');
    setTimeout(() => {
      this.menu = view;
      this.loading.dismiss();
    }, 1000);
  }

  async chooseCharacter(character: string) {
    this.pathImageCharacter = `../../assets/${character}.png`;
    this.chooseMenu(3);
    setTimeout(() => {
      this.imageCharacter = document.getElementById('img-juego');
      this.imageCoordinates = this.imageCharacter.getBoundingClientRect();
      // this.imageCoordinates.top;
      // this.imageCoordinates.bottom;
      // this.imageCoordinates.left;
      // this.imageCoordinates.right;
      // this.imageCharacter.style.left = (this.imageCoordinates.left + 200)+"px";
      // console.log(this.imageCharacter.style.left);
      // console.log(this.imageCharacter.style.top);
    }, 1250);
  }

  convertDateToUnix(photo: any) {
    const initialDate = photo.hour;
    const splitDate = initialDate.split(' ');
    const date = splitDate[0].split('-');
    const time = splitDate[1].split(':');
    const dd = date[0];
    const mm = date[1] - 1;
    const yyyy = date[2];
    const hh = time[0];
    const min = time[1];
    const ss = time[2];
    const dateDate = new Date(yyyy, mm, dd, hh, min, ss);

    return dateDate.getTime();
  } // end of convertDateToUnix

  async showLoading(message: string) {
    try {
      this.loading = await this.loadingController.create({
        message: message,
        spinner: 'crescent',
        showBackdrop: true,
      });
      this.loading.present();
    } catch (error) {
      console.log(error.message);
    }
  }
}
