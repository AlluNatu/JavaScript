// HELP I GOT
//https://jsnoteclub.com/blog/how-to-iterate-table-rows-in-javascript/
//https://stackoverflow.com/questions/32748771/color-table-row-based-on-column-value

async function webReload(){
    const tblBody = document.getElementById("tbody")
    const URLlink2 = "https://statfin.stat.fi/PxWeb/sq/5e288b40-f8c8-4f1e-b3b0-61b86ce5c065" 
    const URLlink1 = "https://statfin.stat.fi/PxWeb/sq/4e244893-7761-4c4f-8e55-7a8d41d86eff"
    const response1 = await fetch(URLlink1)
    const JSONfile1 = await response1.json()
    const response2 = await fetch(URLlink2)
    const JSONfile2 = await response2.json()

    const munincipality = JSONfile1.dataset.dimension.Alue.category.label
    const value = JSONfile1.dataset.value
    let munincipalityValues = Object.values(munincipality)
    let populationvalues = Object.values(value)
    const employment = JSONfile2.dataset.value
    let employmentValues = Object.values(employment)
    
    munincipalityValues.forEach((element, i) => {
        let tr = document.createElement("tr")
        let td1 = document.createElement("td")
        let td2 = document.createElement("td")
        let td3 = document.createElement("td")
        let td4 = document.createElement("td")
        td1.innerText = element
        td2.innerText = populationvalues[i]
        td3.innerText = employmentValues[i]
        let percent = parseFloat((employmentValues[i]/populationvalues[i])*100).toFixed(2)
        td4.innerText = percent
        tr.appendChild(td1)
        tr.append(td2)
        tr.append(td3)
        tr.append(td4)
        tblBody.appendChild(tr)

    
    });
    checkerForColor()


    async function checkerForColor(){
        var rows = tblBody.querySelectorAll('tr')
        rows.forEach(row =>{
            let cell = row.querySelectorAll('td')
            if (Number(cell[3].textContent) > 45){
                row.classList.add('Over')
            }

            if (Number(cell[3].textContent) < 25){
                row.classList.add('Under')
            }
        })

    }

}
window.onload = webReload