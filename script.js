let intervalId; // Declare intervalId outside the startPractice function so it's accessible globally
let intervalTimer; // Declare intervalTimer outside the startMillisecondCountdown function so it's accessible globally
let secondCountdownInterval;// Declare secondCountdownInterval outside the startCountdownEverySecond function so it's accessible globally
let isPracticeRunning = false; // Variable to track the state of practice
let currentRepetition = 0; // Track current repetition number
let totalRepetitions = 1; // Total number of repetitions
let isResting = false; // Track if currently in rest period

document.getElementById('start-stop-button').addEventListener('click', togglePractice);

// Training method dropdown event listeners
const dropdown = document.querySelector('.dropdown');
const dropdownContent = document.querySelector('.dropdown-content');

document.querySelectorAll('.dropdown-content a').forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const value = this.getAttribute('data-value');
        const text = this.textContent;
        document.getElementById('trainingMethod').value = value;
        document.getElementById('training-method-button').textContent = `Training: ${text} \u25bc`;
        
        // Hide dropdown after selection
        dropdownContent.style.display = 'none';
        // Reset after a short delay so hover can work again
        setTimeout(() => {
            dropdownContent.style.display = '';
        }, 100);
    });
});

function togglePractice() {
    if (isPracticeRunning || isResting) {
        stopPractice();
        stopMillisecondCountdown();
        stopCountdownEverySecond();
        currentRepetition = 0;
        isResting = false;
    } else {
        totalRepetitions = parseInt(document.getElementById('repetitions').value);
        currentRepetition = 1;
        startRepetitionCycle();
    }
}

function startRepetitionCycle() {
    if (currentRepetition <= totalRepetitions) {
        // Update display to show current repetition
        document.getElementById('set-info').textContent = `Set ${currentRepetition} of ${totalRepetitions}`;
        document.getElementById('status-message').textContent = 'Training in Progress';
        document.getElementById('countdown').textContent = '';
        
        // Start the practice session
        startPractice();
        startMillisecondCountdown();
        startCountdownEverySecond();
    } else {
        // All repetitions complete
        document.getElementById('set-info').textContent = '';
        document.getElementById('countdown').textContent = '🎉 All Sets Complete! 🎉';
        document.getElementById('status-message').textContent = 'Great work!';
        document.getElementById('start-stop-button').textContent = 'Start';
        currentRepetition = 0;
    }
}

function startPractice() {
    let duration = parseInt(document.getElementById('duration').value) * 1000; // Convert to milliseconds
    const interval = parseFloat(document.getElementById('interval').value) * 1000; // Convert seconds to milliseconds 
    const totalRandomNumbers = duration / interval; // 60 seconds, 2000ms (60 / 2 = 30)

    const countdownElement = document.getElementById('countdown'); // countdown at the bottom of the page

    document.getElementById('start-stop-button').textContent = 'Stop';
    isPracticeRunning = true;

    // function to set the corners with location numbers
    function decideTrainingMethod() {
        var optionValue = document.getElementById('trainingMethod').value;
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
        const highlightInterval = parseFloat(document.getElementById('interval').value) * 1000 / 2 ; // set the highlight period for half the interval (convert to ms)
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
            currentIndex++;
        } else {
            clearInterval(intervalId);
            countdownElement.textContent = 'Practice Complete';
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
    resetLocations(); // Add a function to reset highlighted locations

    // Update button text and state
    document.getElementById('start-stop-button').textContent = 'Start';
    resetFootworkLocation();
    isPracticeRunning = false;
}

function startMillisecondCountdown() {
    var duration = parseInt(document.getElementById("duration").value);
    var initialIntervalValue = parseFloat(document.getElementById("interval").value) * 1000; // Convert seconds to milliseconds
    var repeatCountdown = Math.floor(duration * 1000 / initialIntervalValue); // convert duration to milliseconds and divide by interval

    // Function to format time as s.mmm
    function formatTime(ms) {
        var seconds = Math.floor(ms / 1000);
        var milliseconds = ms % 1000;
        return (
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
                    document.getElementById("interval-time").textContent = "00.000";
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
                // Check if there are more repetitions
                if (currentRepetition < totalRepetitions) {
                    startRestPeriod();
                } else {
                    document.getElementById('set-info').textContent = '';
                    countdownElement.textContent = '🎉 All Sets Complete! 🎉';
                    document.getElementById('status-message').textContent = 'Great work!';
                    stopPractice();
                }
            }
        }, 1000);
    }
    startCountdown();
}

function startRestPeriod() {
    // Stop the current practice
    stopPractice();
    stopMillisecondCountdown();
    
    isResting = true;
    const restDuration = parseInt(document.getElementById('rest').value);
    let restRemaining = restDuration;
    
    // Update display elements
    document.getElementById('set-info').textContent = `Rest Period`;
    document.getElementById('status-message').textContent = `Next: Set ${currentRepetition + 1} of ${totalRepetitions}`;
    
    // Update rest countdown every second
    const restInterval = setInterval(() => {
        if (restRemaining > 0 && isResting) {
            document.getElementById('countdown').textContent = `${restRemaining}s`;
            restRemaining--;
        } else {
            clearInterval(restInterval);
            if (isResting) {
                isResting = false;
                currentRepetition++;
                startRepetitionCycle();
            }
        }
    }, 1000);
    
    // Also store the interval so it can be cleared if stopped
    secondCountdownInterval = restInterval;
}

function stopCountdownEverySecond() {
    document.getElementById('set-info').textContent = "";
    document.getElementById('countdown').textContent = "";
    document.getElementById('status-message').textContent = "";
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