import Game from "./game";
import Ball from "./ball";
import { GameObject } from "./infra/gameObject";
import { COPYFILE_FICLONE_FORCE } from "constants";

/**
 * Detects a collision between ball and a game object
 * @param ball ball game object
 * @param gameObject Any other game object
 */
export function detectCollision(ball: Ball, gameObject: GameObject): {
    collided: boolean,
    side?: 'top' | 'bottom' | 'left' | 'right'
} {

    let bottomOfBall = ball.position.y + ball.size;
    let topOfBall = ball.position.y;
    let leftOfBall = ball.position.x;
    let rightOfBall = ball.position.x + ball.size;

    let topOfObject = gameObject.position.y - 2;
    let leftSideOfObject = gameObject.position.x - 2;
    let rightSideOfObject = gameObject.position.x + gameObject.width + 2;
    let bottomOfObject = gameObject.position.y + gameObject.height + 2;

    if (
        bottomOfBall >= topOfObject &&
        topOfBall <= bottomOfObject &&
        ball.position.x + ball.size >= leftSideOfObject &&
        ball.position.x <= rightSideOfObject
    ) {
        // debugger;

        let d1 = Math.abs(bottomOfBall - bottomOfObject);

        // if (bottomOfBall >= topOfObject) {
        //     return {
        //         collided: true,
        //         side: 'top'
        //     }
        // }

        // if (topOfBall <= bottomOfBall) {
        //     return {
        //         collided: true,
        //         side: 'bottom'
        //     }
        // }

        // if (leftOfBall >= leftSideOfObject) {
        //     return {
        //         collided: true,
        //         side: "left"
        //     }
        // }

        // if (rightOfBall <= rightSideOfObject) {
        //     return {
        //         collided: true,
        //         side: "right"
        //     }
        // }

        return {
            collided: true
        }
    } else {
        return {
            collided: false
        }
    }

}