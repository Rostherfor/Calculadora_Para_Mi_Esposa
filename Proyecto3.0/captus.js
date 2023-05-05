import {
    setCustomProperty,
    incrementCustomProperty,
    getCustomProperty
} from "./updateCustomProperty.js";

const SPEED = 0.09;
const CAPTUS_INTERVAL_MIN = 500;
const CAPTUS_INTERVAL_MAX = 2000;
const worldElem = document.querySelector('[data-world]');

let nextCaptusTime;

export function setupCaptus() {
    nextCaptusTime = CAPTUS_INTERVAL_MIN;
    document.querySelectorAll('[data-captus]').forEach(captus => {
        captus.remove()
    })
}

export function updateCaptus(delta, speedScale) {

    document.querySelectorAll('[data-captus]').forEach(captus => {
        incrementCustomProperty(captus, "--left", delta * speedScale * SPEED * -1);
        if(getCustomProperty(captus, "--left") <= -100) captus.remove();
    })

    if(nextCaptusTime <= 0) {
        createCaptus();
        nextCaptusTime = randomNumberBetween(CAPTUS_INTERVAL_MIN, CAPTUS_INTERVAL_MAX) / speedScale;
    }
    
    nextCaptusTime -= delta;

}

export function getCaptusRects() {
    return [...document.querySelectorAll('[data-captus]')].map(captus => {
        return captus.getBoundingClientRect();
    })
}

function createCaptus() {
    const captus = document.createElement('img');
    captus.dataset.captus = true;
    captus.src = "media/cactus.png";
    captus.classList.add('captus');
    setCustomProperty(captus, "--left", 500);
    worldElem.append(captus);
}

function randomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}