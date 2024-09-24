
let uppercase = false;
let lowercase = false;
let numbers = false;
let special = false;
let length;

function CheckPassword(){
    const password = document.getElementById('password').value;
    const result = zxcvbn(password);

    // Display the result score
    document.getElementById("result").innerHTML = "Password Strength: " + result.score + "/4";

    // Update the score description
    let scoreDescription = "";
    if (result.score == 0) {
        scoreDescription = "</br> too guessable: risky password.";
    } else if (result.score == 1) {
        scoreDescription = "</br> very guessable: protection from throttled online attacks.";
    } else if (result.score == 2) {
        scoreDescription = "</br> somewhat guessable: protection from unthrottled online attacks.";
    } else if (result.score == 3) {
        scoreDescription = "</br> safely unguessable: moderate protection from offline slow-hash scenario.";
    } else if (result.score == 4) {
        scoreDescription = "</br> very unguessable: strong protection from offline slow-hash scenario.";
    }
    document.getElementById("score").innerHTML = scoreDescription;
    
    //adjusting colour for background
    document.querySelector(".left-side").classList = "left-side score-" + result.score;

    // Adjust font size dynamically based on input width
    const inputWidth = document.getElementById('password').offsetWidth; // Width of the input element
    const fontSize = Math.min(2, 2 * inputWidth / document.getElementById('password').scrollWidth) + 'em'; // Adjust the multiplier as needed
    document.getElementById('password').style.fontSize = fontSize;
    
    //time to crack:
    const time = result.crack_times_display;
    updateTimeDisplay('online_throttling', time.online_throttling_100_per_hour);
    updateTimeDisplay('online_no_throttling', time.online_no_throttling_10_per_second);
    updateTimeDisplay('offline_slow_hashing', time.offline_slow_hashing_1e4_per_second);
    updateTimeDisplay('offline_fast_hashing', time.offline_fast_hashing_1e10_per_second);

    document.getElementById("time-section").style.display = "block";

    //suggestion if avaible:
    const suggestions = result.feedback.suggestions;
    let feedbackContent = "";

    if (suggestions.length > 0) {
        feedbackContent += "<ul>";
        suggestions.forEach(suggestion => {
            feedbackContent += "<li>" + suggestion + "</li>";
        });
        feedbackContent += "</ul>";
        document.getElementById("suggestions-section").style.display = "block";   
    } else {
        feedbackContent = "";
        document.getElementById("suggestions-section").style.display = "none";
    }

    document.getElementById("feedback").innerHTML = feedbackContent;
}

//checking time to crack
function updateTimeDisplay(elementId, time) {
    const element = document.getElementById(elementId);
    const isSecure = time.includes('centuries');
    const icon = isSecure ? '<i class="fas fa-check-circle" style="color: green;"></i> ' : '<i class="fas fa-exclamation-triangle" style="color: red;"></i> ';
    element.innerHTML = icon + time;
}

function Generate(){
        console.log('Generate button clicked');
        length = parseInt(document.getElementById('length').value);
        uppercase = document.getElementById('uppercase').checked;
        lowercase = document.getElementById('lowercase').checked;
        numbers = document.getElementById('digits').checked;
        special = document.getElementById('special').checked;
        console.log(length, uppercase, lowercase, numbers, special);

        let characterSet = '';
        let password = '';
        

        if(uppercase){
            characterSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if(lowercase){
            characterSet += 'abcdefghijklmnopqrstuvwxyz';
        }
        if(numbers){
            characterSet += '0123456789';
        }
        if(special){
            characterSet += '!@#$%^&*()_+';
        }

        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            password += characterSet[array[i] % characterSet.length];
        }

        document.getElementById("password").value = password;

        CheckPassword();
}
