/* eslint-disable no-alert */

import leftPad from './left-pad';

const clockElem = document.querySelector('.pomodoro-clock');
const clockDisplayElem = clockElem.querySelector('.pomodoro-clock__display');
const clockToggleButtonElem = clockElem.querySelector('.pomodoro-clock__toggle-button');
const clockResetButtonElem = clockElem.querySelector('.pomodoro-clock__reset-button');
const clockSettingsElem = clockElem.querySelector('.settings');
const workDurationElem = clockSettingsElem.querySelector('#work-duration');

let startTime = workDurationElem.value * 60;
let time = startTime;
let ticking = false;
let tickIntervalID;

init();

function init() {
	// Remove no-js classes.
	clockElem.classList.remove('pomodoro-clock--no-js');

	renderTime();

	// Add event listeners.
	clockToggleButtonElem.addEventListener('click', toggle);
	clockResetButtonElem.addEventListener('click', reset);
	clockSettingsElem.addEventListener('submit', handleSettingsFormSubmit);
	workDurationElem.addEventListener('change', handleWorkDurationChange);
}

function renderTime() {
	// m:ss
	const timeString = `${Math.floor(time / 60)}:${leftPad(time % 60, 2, 0)}`;

	clockDisplayElem.innerHTML = timeString;
}

function start() {
	clockToggleButtonElem.innerHTML = 'Pause';
	ticking = true;
	tick();
	tickIntervalID = window.setInterval(tick, 1000);
}

function pause() {
	clockToggleButtonElem.innerHTML = 'Start';
	ticking = false;
	window.clearInterval(tickIntervalID);
}

function reset() {
	pause();
	time = startTime;
	renderTime();
}

function end() {
	reset();
	alert(`${startTime / 60} minutes elapsed!`);
}

function tick() {
	time -= 1;

	renderTime();

	if (time <= 0) {
		end();
	}
}

function toggle() {
	if (ticking) {
		pause();
	} else {
		start();
	}
}

function handleSettingsFormSubmit(e) {
	e.preventDefault();
}

function handleWorkDurationChange() {
	startTime = workDurationElem.value * 60;
	reset();
}
