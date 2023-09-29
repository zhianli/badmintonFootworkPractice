document.getElementById('start-button').addEventListener('click', startPractice);

function startPractice() {
    const duration = parseInt(document.getElementById('duration').value) * 1000; // Convert to milliseconds
    const interval = parseInt(document.getElementById('interval').value);
    const totalRandomNumbers = duration / interval;

    const countdownElement = document.getElementById('countdown');
    const outputElement = document.getElementById('output');

    function updateCountdown(remaining) {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const milliseconds = remaining % 1000;
        countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
    }

    function generateRandomNumbers() {
        const randomNumbers = [];
        for (let i = 0; i < totalRandomNumbers; i++) {
            randomNumbers.push(Math.floor(Math.random() * 6) + 1);
        }
        return randomNumbers;
    }

    const randomNumbers = generateRandomNumbers();
    let currentIndex = 0;
    let countdown = duration;

    updateCountdown(countdown);

    const intervalId = setInterval(() => {
        if (currentIndex < totalRandomNumbers) {
            const randomNumber = randomNumbers[currentIndex];
            highlightLocation(randomNumber);
            outputElement.textContent = `Current Number: ${randomNumber}`;
            currentIndex++;
        } else {
            clearInterval(intervalId);
            countdownElement.textContent = 'Practice Complete';
            outputElement.textContent = '';
        }
        countdown -= interval;
        updateCountdown(countdown);
    }, interval);
}

function highlightLocation(randomNumber) {
    const location = document.getElementById(`location${randomNumber}`);
    const highlightInterval = parseInt(document.getElementById('interval').value) / 2 ;
    location.style.backgroundColor = 'red';

    setTimeout(() => {
        location.style.backgroundColor = 'transparent';
    }, highlightInterval); // Remove the highlight after a half the interval
}

