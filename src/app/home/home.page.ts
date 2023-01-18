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

import { Platform } from '@ionic/angular';

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
    private loadingController: LoadingController,
    private platform: Platform
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
      .watchAcceleration({ frequency: 10 })
      .subscribe((acceleration: DeviceMotionAccelerationData) => {
        this.handleAcceleration(acceleration);
      });
  }

  ngOnDestroy() {
    this.watch.unsubscribe();
  }

  imageWidth: any;
  imageHeight: any;
  screenWidth: any;
  screenHeight: any;
  left: any;
  top: any;
  scale: number = 0.5;
  handleAcceleration(acceleration: DeviceMotionAccelerationData) {
    if (this.imageCharacter != undefined) {
      this.imageWidth = this.imageCharacter.offsetWidth;
      this.imageHeight = this.imageCharacter.offsetHeight;
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.left = this.imageCharacter.offsetLeft;
      this.top = this.imageCharacter.offsetTop;
      if (
        this.left + this.imageWidth > this.screenWidth + this.imageWidth / 2 ||
        this.left < 0 + this.imageWidth / 2
      ) {
        //Si llega al borde izquierdo o derecho
        console.log('image reached left or right bounds');
      } else {
        this.imageCharacter.style.left =
          this.left + acceleration.x * this.scale + 'px';
      }

      if (
        this.top + this.imageHeight >
          this.screenHeight + this.imageHeight / 2 ||
        this.top < 0 + this.imageHeight / 2
      ) {
        //Si llega al borde arriba o abajo
        console.log('image reached top or bottom bounds');
      } else {
        this.imageCharacter.style.top =
          this.top + acceleration.y * this.scale + 'px';
      }
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
      if (view == 0) {
        this.imageCharacter = undefined;
      }
      this.loading.dismiss();
    }, 1000);
  }

  contador = 10;
  async chooseCharacter(character: string) {
    this.pathImageCharacter = `../../assets/${character}.png`;
    this.chooseMenu(3);
    setTimeout(() => {
      this.imageCharacter = document.getElementById('img-juego');
      // this.imageCoordinates = this.imageCharacter.getBoundingClientRect();
      // setInterval(() => {
      //   this.imageWidth = this.imageCharacter.offsetWidth;
      //   this.imageHeight = this.imageCharacter.offsetHeight;
      //   this.screenWidth = window.innerWidth;
      //   this.screenHeight = window.innerHeight;
      //   this.left = this.imageCharacter.offsetLeft;
      //   this.top = this.imageCharacter.offsetTop;
      //   console.log('Left: ', this.left);
      //   console.log('Top: ', this.top);
      //   if (
      //     this.left + this.imageWidth >
      //       this.screenWidth + this.imageWidth / 2 ||
      //     this.left < 0 + this.imageWidth / 2
      //   ) {
      //     //Si llega al borde izquierdo o derecho
      //     console.log('image reached left or right bounds');
      //   } else {
      //     this.imageCharacter.style.left = this.left + this.contador + 'px';
      //   }

      //   if (
      //     this.top + this.imageHeight >
      //       this.screenHeight + this.imageHeight / 2 ||
      //     this.top < 0 + this.imageHeight / 2
      //   ) {
      //     //Si llega al borde arriba o abajo
      //     console.log('image reached top or bottom bounds');
      //   } else {
      //     this.imageCharacter.style.top = this.top + this.contador + 'px';
      //   }
      // }, 500);
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
