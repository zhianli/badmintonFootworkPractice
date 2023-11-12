document.getElementById('start-button').addEventListener('click', startPractice);

function startPractice() {
    let duration = parseInt(document.getElementById('duration').value) * 1000; // Convert to milliseconds
    const interval = parseInt(document.getElementById('interval').value); // 1000ms 
    const totalRandomNumbers = duration / interval; // 60 seconds, 2000ms (60 / 2 = 30)

    const countdownElement = document.getElementById('countdown'); // countdown at the bottom of the page
    const outputElement = document.getElementById('output'); // output the number in the list

    function updateCountdown(remaining) {
        const minutes = Math.floor(remaining / 60000);
        const seconds = Math.floor((remaining % 60000) / 1000);
        const milliseconds = remaining % 1000;
        countdownElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(3, '0')}`;
    }

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

    function generateRandomNumbers() {
        const randomNumbers = [];
        for (let i = 0; i < totalRandomNumbers; i++) {
            randomNumbers.push(Math.floor(Math.random() * decideTrainingMethod()) + 1); // random numbers: 1, 2, 3, 4, 5, 6
        }
        return randomNumbers;
    }

    const randomNumbers = generateRandomNumbers(); // [2, 4, 1, 4, 5, 1, 6]
    let currentIndex = 0;

    updateCountdown(duration);

    const intervalId = setInterval(() => {
        if (currentIndex < totalRandomNumbers) {
            const randomNumber = randomNumbers[currentIndex];
            highlightLocation(randomNumber); // calls the function to mark location red base on number
            outputElement.textContent = `Current Number: ${randomNumber}`;
            currentIndex++;
        } else {
            clearInterval(intervalId);
            countdownElement.textContent = 'Practice Complete';
            outputElement.textContent = '';
        }
        duration -= interval;
        updateCountdown(duration);
    }, interval);
}

function highlightLocation(randomNumber) {
    const location = document.getElementById(`location${randomNumber}`); // the number that will mark red
    const highlightInterval = parseInt(document.getElementById('interval').value) / 2 ;
    location.style.backgroundColor = 'red';

    setTimeout(() => {
        location.style.backgroundColor = 'transparent';
    }, highlightInterval); // Remove the highlight after a half the interval
}

