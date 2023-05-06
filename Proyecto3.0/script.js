import { updateGround, setupGround } from "./ground.js";
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js";
import { updateCaptus, setupCaptus, getCaptusRects } from "./captus.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector('[data-world');
const scoreElem = document.querySelector('[data-score');
const startScreenElem = document.querySelector('[data-start-screen');
const gameOverSound = document.querySelector('#game-over-sound');

setPixelToWorldScale();
window.addEventListener('resize', setPixelToWorldScale);
document.addEventListener('click', handleStart, {once: true})

let lastTime;
let speedScale;
let score;

function update(time) {
    if(lastTime == null) {
        lastTime = time;
        window.requestAnimationFrame(update);
        return
    }

    const delta = time - lastTime;

    updateGround(delta, speedScale);
    updateDino(delta, speedScale);
    updateCaptus(delta, speedScale);
    updateSpeedScale(speedScale);
    updateScore(speedScale);

    if(checkLose()) return handleLose();

    lastTime = time;
    window.requestAnimationFrame(update)
}

function checkLose() {
    const dinoRect = getDinoRect();

    return getCaptusRects().some(rect => isCollision(rect, dinoRect))
}

function isCollision(rect1, rect2) {
    return (
        rect1.left < rect2.right &&
        rect1.top < rect2.bottom &&
        rect1.right > rect2.left &&
        rect1.bottom > rect2.top
    )
}

function updateSpeedScale(delta) {
    speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
    score += delta * 0.01;
    scoreElem.textContent = `Score: ${Math.floor(score)}`;
}

function handleStart() {
    lastTime = null;
    speedScale = 1;
    score = 0;
    setupGround();
    setupDino();
    setupCaptus();
    startScreenElem.classList.add("hide");
    window.requestAnimationFrame(update)
}

function handleLose() {
    setDinoLose();
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    setTimeout(() => {
        document.addEventListener('click', handleStart, {once: true});
        startScreenElem.classList.remove("hide");
    }, 100)
}

function setPixelToWorldScale() {
    let worldTopixelScale;
    if(window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
        worldTopixelScale = window.innerWidth / WORLD_WIDTH;
    } else {
        worldTopixelScale = window.innerHeight / WORLD_HEIGHT;
    }

    worldElem.style.width = `${WORLD_WIDTH * worldTopixelScale}px`;
    worldElem.style.height = `${WORLD_HEIGHT * worldTopixelScale}px`;

}