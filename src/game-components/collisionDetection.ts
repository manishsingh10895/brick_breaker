import Game from "./game";
import Ball from "./ball";
import { GameObject } from "../infra/gameObject";
import { COPYFILE_FICLONE_FORCE } from "constants";
import Utils from "./utils";
import { Collsion } from "../infra/collision";

/**
 * Detects a collision between ball and a game object
 * @param ball ball game object
 * @param gameObject Any other game object
 */
export function detectBallCollision(ball: Ball, gameObject: GameObject): Collsion {
    return detectRectRectCollision(ball, gameObject);
}

/**
 * Detects collision between two game objects 
 * in rectangular shape
 * 
 * @param rect1 first rectable game object
 * @param rect2 second rectable game object 
 */
export function detectRectRectCollision(rect1: GameObject, rect2: GameObject): Collsion {

    if (!rect1.center) {
        rect1.center = Utils.getCenter(rect1);
    }

    if (!rect2.center) {
        rect2.center = Utils.getCenter(rect2);
    }

    let dx = rect1.center.x - rect2.center.x; //488 - 578 = 90
    let dy = rect1.center.y - rect2.center.y; // 580 - 583 = 3

    let dw = (rect1.width + rect2.width) / 2; // (150 + 32) / 2 = 91
    let dh = (rect1.height + rect2.height) / 2; // (20 + 32) / 2 = 26

    let crossWidth = dw * dy;
    let crossHeight = dw * dx;

    if (Math.abs(dx) <= dw && Math.abs(dy) <= dh) {

        let direction: any;


        if (crossWidth > crossHeight) {
            console.log("if");
            direction = (crossWidth > (-crossHeight)) ? 'bottom' : 'left';
        } else {
            console.log("else");
            direction = (crossWidth > -(crossHeight)) ? 'right' : 'top';
        }


        if (!direction) {
            console.log(dw, dh);
            console.log(dx, dy, crossWidth, crossHeight);
            debugger;
        }

        return {
            collided: true,
            side: direction
        }
    }


    return {
        collided: false
    }
}