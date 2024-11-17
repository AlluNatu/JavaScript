window.onload = function () {
    const textVariable = document.getElementById("textVariable");

    function textWOWCOOL() {
        let word = "HELLO WORLD";
        let text = "";
        let delay = 100;  // Delay in milliseconds between letters
        let j = 0;  // Outer loop for word's letters
        
        function animateLetter() {
            if (j >= word.length) return;  // Stop if finished with the word

            let currentChar = word[j];
            let i = 65;  // ASCII code for 'A'

            function findAndDisplay() {
                let char = String.fromCharCode(i);
                textVariable.textContent = text + char;
                
                if (char === currentChar) {
                    text += char;
                    j++;
                    setTimeout(animateLetter, delay);  // Move to the next letter in the word
                } else if (i < 90) {
                    i++;
                    setTimeout(findAndDisplay, delay / 3);  // Speed for each ASCII increment
                }
            }

            findAndDisplay();
        }

        animateLetter();
    }

    textWOWCOOL();
};
