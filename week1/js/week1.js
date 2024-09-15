function initializeCode() {
    const funnyButton = document.getElementById("my-button");
    const helloworlds = document.getElementById("Hello-world")
    const buttonAddtoList = document.getElementById("add-data")

        funnyButton.addEventListener("click", function() {
            console.log("Hello world");
            if (helloworlds.textContent === "Moi maailma"){
                helloworlds.textContent = "Hello world"
            }
            else {
            helloworlds.textContent = "Moi maailma"
        }
    })

    buttonAddtoList.addEventListener("click", function() {
        const listOfFirst = document.getElementById("my-list")

        let textoADd = document.createElement("Li");

        textoADd.innerText = document.getElementById("text-area").value;

        listOfFirst.appendChild(textoADd)
    })

}