import { SwiperOptions } from "swiper";

export enum CarouselDirection {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical'
}

export enum CarouselEffect {
  SLIDE = 'slide',
  FADE = 'fade',
  CUBE = 'cube',
  COVERFLOW = 'coverflow',
  FLIP = 'flip'
}



export const DEFAULT_SWIPER_OPTIONS:SwiperOptions = {
  slidesPerView: 1,
  spaceBetween: 12,
  keyboard: true,
  navigation: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    type: 'bullets',
    renderBullet: function (index, className) {
      return '<span class="' + className + '"></span>';
    }
  },
  grabCursor: false,
  loop: true,
  preloadImages: false,
  centeredSlides: true,
  lazy: false,
  autoplay: { delay: 6000, pauseOnMouseEnter: true },
  speed: 470,
  effect: "slide",
}

export const DEFAULT_SWIPER_THUMBS_OPTIONS: SwiperOptions = {
      height: 60,  keyboard: true,
      slidesPerView: 'auto', 
      centeredSlides: true
}