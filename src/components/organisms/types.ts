export interface OrganismRenderer {
  init: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, speed: number) => void;
}
