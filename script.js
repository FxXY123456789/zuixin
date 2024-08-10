let startTime = 0;
let pauseTime = 0;
let totalTime = 0;
let timerOn = false;
let isPaused = false;
let timerInterval;
let segmentCount = 0; // 用于记录分段数量
let lastSegmentTime = 0; // 上一个分段的时间

const timerDisplay = document.getElementById('timerDisplay');
const logContainer = document.getElementById('log');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const segmentButton = document.getElementById('segmentButton');
const exportButton = document.getElementById('exportButton');

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseResumeTimer);
segmentButton.addEventListener('click', segmentTimer);
exportButton.addEventListener('click', exportData);

function startTimer() {
    if (!timerOn) {
        startTime = Date.now() - totalTime * 1000;
        timerOn = true;
        isPaused = false;
        updateTimer();
    }
}

function pauseResumeTimer() {
    if (timerOn) {
        if (!isPaused) {
            // 暂停计时
            clearInterval(timerInterval);
            pauseTime = Date.now();
            isPaused = true;
            pauseButton.classList.add('red');
        } else {
            // 恢复计时
            const pauseDuration = Date.now() - pauseTime;
            startTime += pauseDuration;
            isPaused = false;
            pauseButton.classList.remove('red');
            updateTimer();
        }
    }
}

function updateTimer() {
    if (timerOn && !isPaused) {
        timerInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            totalTime = (elapsedTime / 1000).toFixed(2);
            timerDisplay.textContent = `${totalTime} 秒`;
        }, 10);
    }
}

function segmentTimer() {
    if (timerOn && !isPaused) {
        segmentCount++;
        const currentTime = (Date.now() - startTime) / 1000;
        const segmentTime = (currentTime - lastSegmentTime).toFixed(2);
        lastSegmentTime = currentTime;

        const segmentEntry = document.createElement('div');
        segmentEntry.textContent = `#${segmentCount} 分段时间: ${segmentTime} 秒`;
        segmentEntry.classList.add('segment');
        logContainer.insertBefore(segmentEntry, logContainer.firstChild);
    }
}

function exportData() {
    let data = '';
    const segments = logContainer.querySelectorAll('.segment');
    segments.forEach(segment => {
        const segmentText = segment.textContent.replace(' 分段时间: ', ',');
        data += `${segmentText}\n`;
    });

    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'stopwatch_data.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
}
