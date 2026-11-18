declare module 'bootstrap/js/src/carousel.js' {
  export default class Carousel {
    touchTimeout?: ReturnType<typeof setTimeout>;
    constructor(
      element: Element,
      config?: { interval?: number; ride?: boolean; pause?: 'hover' | false; touch?: boolean },
    );
    cycle(): void;
    pause(): void;
    dispose(): void;
  }
}
