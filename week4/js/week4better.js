const addDataButton = document.getElementById("submit-data")
const addDataText = document.getElementById("input-show")
const divContainer = document.getElementById("show-container")

addDataButton.addEventListener("click", async function() {
        let textFromData = ""
        let fetchURL = "https://api.tvmaze.com/search/shows?q="
        textFromData = addDataText.value
        const response = await fetch(fetchURL+textFromData)
        const JSONfile = await response.json()
        let movieDetails = JSONfile[0].show
        
        let div1 = document.createElement('div')
        let div2 = document.createElement('div')
        let img = document.createElement('img')
        let h1 = document.createElement('h1')
        let p = document.createElement('p')

        div1.classList.add("show-data")
        div2.classList.add("show-info")

        img.src = movieDetails.image.medium
        div1.appendChild(img)

        h1.append(movieDetails.name)
        p.innerHTML = movieDetails.summary
        div2.appendChild(h1)
        div2.appendChild(p)
        div1.appendChild(div2)


        divContainer.appendChild(div1)


})
addDataText.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault()
        document.getElementById('submit-data').click()
}
})