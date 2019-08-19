import { Pos } from "./pos";

export interface GameObject {
    toDelete?: boolean;
    position: Pos;
    width: number;
    height: number;

    draw: (ctx: CanvasRenderingContext2D) => void;
    update: (dt: number) => void;

}