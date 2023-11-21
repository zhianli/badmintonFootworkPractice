let intervalId; // Declare intervalId outside the startPractice function so it's accessible globally
let intervalTimer; // Declare intervalTimer outside the startMillisecondCountdown function so it's accessible globally
let secondCountdownInterval;// Declare secondCountdownInterval outside the startCountdownEverySecond function so it's accessible globally
let isPracticeRunning = false; // Variable to track the state of practic

document.getElementById('start-stop-button').addEventListener('click', togglePractice); 

function togglePractice() {
    if (isPracticeRunning) {
        stopPractice();
        stopMillisecondCountdown();
        stopCountdownEverySecond();
    } else {
        startPractice();
        startMillisecondCountdown();
        startCountdownEverySecond();
    }
}

function startPractice() {
    let duration = parseInt(document.getElementById('duration').value) * 1000; // Convert to milliseconds
    const interval = parseInt(document.getElementById('interval').value); // 1000ms 
    const totalRandomNumbers = duration / interval; // 60 seconds, 2000ms (60 / 2 = 30)

    const countdownElement = document.getElementById('countdown'); // countdown at the bottom of the page
    const outputElement = document.getElementById('output'); // output the number in the list

    document.getElementById('start-stop-button').textContent = 'Stop';
    isPracticeRunning = true;

    // function to set the corners with location numbers
    function decideTrainingMethod() {
        var trainingMethod = document.querySelector('input[name="trainingMethod"]:checked');
        var optionValue = trainingMethod.value;
        var randomNumberRange; // decide the range of random number e.g., 2, 4, 6

        // Call different functions based on the selected option
        switch (optionValue) {
            case 'fullCourt':
                document.querySelector('.footwork.frontLeft').setAttribute('id', 'location1');
                document.querySelector('.footwork.frontRight').setAttribute('id', 'location2');
                document.querySelector('.footwork.middleLeft').setAttribute('id', 'location3');
                document.querySelector('.footwork.middleRight').setAttribute('id', 'location4');
                document.querySelector('.footwork.backLeft').setAttribute('id', 'location5');
                document.querySelector('.footwork.backRight').setAttribute('id', 'location6');
                randomNumberRange = 6;
                break;
            case 'fourCorners':
                document.querySelector('.footwork.frontLeft').setAttribute('id', 'location1');
                document.querySelector('.footwork.frontRight').setAttribute('id', 'location2');
                document.querySelector('.footwork.backLeft').setAttribute('id', 'location3');
                document.querySelector('.footwork.backRight').setAttribute('id', 'location4');
                randomNumberRange = 4;
                break;
            case 'leftCourt':
                document.querySelector('.footwork.frontLeft').setAttribute('id', 'location1');
                document.querySelector('.footwork.backLeft').setAttribute('id', 'location2');
                randomNumberRange = 2;
                break;
            case 'rightCourt':
                document.querySelector('.footwork.frontRight').setAttribute('id', 'location1');
                document.querySelector('.footwork.backRight').setAttribute('id', 'location2');
                randomNumberRange = 2;
                break;
            default:
                randomNumberRange = 0;
        }
        return randomNumberRange; // return the random number range
    }

    // function to highlight a location red for half the interval
    function highlightLocation(randomNumber) {
        const location = document.getElementById(`location${randomNumber}`); // the number that will mark red
        const highlightInterval = parseInt(document.getElementById('interval').value) / 2 ; // set the highlight period for half the interval
        location.style.backgroundColor = 'red';

        setTimeout(() => {
            location.style.backgroundColor = 'transparent';
        }, highlightInterval); // Remove the highlight after a half the interval
    }

    // function to generate a list of random numbers
    function generateRandomNumbers() {
        const randomNumbers = [];
        for (let i = 0; i < totalRandomNumbers; i++) {
            randomNumbers.push(Math.floor(Math.random() * decideTrainingMethod()) + 1); // decideTrainingMethod function returns random number range: 6, 4, 2
        }
        return randomNumbers;
    }

    const randomNumbers = generateRandomNumbers(); // [2, 4, 1, 4, 5, 1, 6] or [1, 4, 2, 4, 3, 1] or [1, 1, 2, 1, 2]
    let currentIndex = 0;

    intervalId = setInterval(() => {
        if (currentIndex < totalRandomNumbers) {
            const randomNumber = randomNumbers[currentIndex];
            highlightLocation(randomNumber);
            outputElement.textContent = `Current Number: ${randomNumber}`;
            currentIndex++;
        } else {
            clearInterval(intervalId);
            countdownElement.textContent = 'Practice Complete';
            outputElement.textContent = '';
            document.getElementById('start-stop-button').textContent = 'Start';
            isPracticeRunning = false;
            resetFootworkLocation();
        }
    }, interval);
}

function stopPractice() {

    // Reset all highlighted locations to transparent
    function resetLocations() {
        for (let i = 1; i <= 6; i++) {
            const location = document.getElementById(`location${i}`);
            
            // Check if the element exists before updating its style
            if (location) {
                location.style.backgroundColor = 'transparent';
            }
        }
    }

    // Clear the interval using the intervalId
    clearInterval(intervalId);
    document.getElementById('countdown').textContent = 'Practice Stopped';
    document.getElementById('output').textContent = '';
    resetLocations(); // Add a function to reset highlighted locations

    // Update button text and state
    document.getElementById('start-stop-button').textContent = 'Start';
    resetFootworkLocation();
    isPracticeRunning = false;
}

function startMillisecondCountdown() {
    var duration = parseInt(document.getElementById("duration").value);
    var initialIntervalValue = parseInt(document.getElementById("interval").value);
    var repeatCountdown = Math.floor(duration * 1000 / initialIntervalValue); // convert duration to milliseconds and divide by interval

    // Function to format time as mm:ss:mmm
    function formatTime(ms) {
        var minutes = Math.floor(ms / (60 * 1000));
        var seconds = Math.floor((ms % (60 * 1000)) / 1000);
        var milliseconds = ms % 1000;
        return (
            (minutes < 10 ? "0" : "") + minutes + ":" +
            (seconds < 10 ? "0" : "") + seconds + "." +
            (milliseconds < 10 ? "00" : milliseconds < 100 ? "0" : "") + milliseconds
        );
    }

    // Function to start the interval countdown
    function startIntervalCountdown(repeatCountdown) {
        if (repeatCountdown > 0) {
            var intervalValue = initialIntervalValue; // reset intervalValue to its original value
            intervalTimer = setInterval(function () {
                intervalValue -= 10; // Subtract 10 milliseconds
                document.getElementById("interval-time").textContent = formatTime(intervalValue);

                if (intervalValue <= 0) {
                    clearInterval(intervalTimer);
                    document.getElementById("interval-time").textContent = "00:00.000";
                    startIntervalCountdown(repeatCountdown - 1); // trigger the next interval
                }
            }, 10);
        }
    }

    // Start the interval countdown
    startIntervalCountdown(repeatCountdown);
}

function stopMillisecondCountdown() {
    document.getElementById("interval-time").textContent = "";
    clearInterval(intervalTimer);
}


function startCountdownEverySecond() {
    const countdownElement = document.getElementById('countdown');
    let duration = parseInt(document.getElementById('duration').value) * 1000; // Convert to milliseconds
        
    // Function to update the countdown display
    function updateCountdownDisplay(remaining) {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const milliseconds = remaining % 1000;
        countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
    }

    function startCountdown() {
        secondCountdownInterval = setInterval(() => {
            if (duration > 0) {
                updateCountdownDisplay(duration);
                duration -= 1000; // Subtract 1000 milliseconds (1 second)
            } else {
                clearInterval(secondCountdownInterval);
                countdownElement.textContent = 'Practice Complete';
            }
        }, 1000);
    }
    startCountdown();
}

function stopCountdownEverySecond() {
    document.getElementById('countdown').textContent = "";
    clearInterval(secondCountdownInterval);
}

// remove the location IDs added to footwork class
function resetFootworkLocation() {
    // Get all elements with the "footwork" class
    const footworkElements = document.querySelectorAll('.footwork');

    footworkElements.forEach((element) => {
        // Remove the desired ID (e.g., 'location1')
        element.removeAttribute('id');
    });
}