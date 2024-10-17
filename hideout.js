const button = document.getElementById("submit-data")
const inputText = document.getElementById("input-area")
const addDataButton = document.getElementById("add-data")

const munincipatilitySearch = async () => {
    let i = 0
    const URL = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"

    const res = await fetch(URL)
    const JSONfile = await res.json()
    let munincipitalities = JSONfile.variables[1].valueTexts
    let textFromInput = inputText.value
    let input = JSONfile.variables[1].values[0]
    munincipitalities.forEach(index => {
        if (textFromInput.toUpperCase() == index.toUpperCase()){
            input = JSONfile.variables[1].values[i]
        }
        i++
    })

    let jsonQuery = {
        "query": [
            {
                "code": "Vuosi",
                "selection": {
                    "filter": "item",
                    "values": [
                        "2000", "2001", "2002", "2003", "2004", "2005", 
                        "2006", "2007", "2008", "2009", "2010", "2011", 
                        "2012", "2013", "2014", "2015", "2016", "2017", 
                        "2018", "2019", "2020", "2021"
                    ]
                }
            },
            { 
                "code": "Alue",
                "selection": {                
                    "filter": "item",                
                    "values": [ input ]            
                }
            },
            {            
                "code": "Tiedot",            
                "selection": {                
                    "filter": "item",                
                    "values": [ "vaesto" ]            
                }
            }
        ],
        "response": {        
            "format": "json-stat2"    
        }
    }
    return jsonQuery
}

const getData = async () => {
    let jsonQuery = await munincipatilitySearch()
    const URL = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"

    const res = await fetch(URL, {
        method: "POST",
        headers: {"content-type": "application/json"},
        body: JSON.stringify(jsonQuery)
    })

    if(!res.ok) {
        return;
    }
    const data = await res.json()

    return data
}

const buildData = async () => {
    
        const data = await getData()
    
        const labels = Object.values(data.dimension.Vuosi.category.label)
        const values = data.value
    
        const charData = {
            labels: labels,
            datasets: [{
                name: inputText.value + " population",
                values: values
            }]
        }
        const chart = new frappe.Chart("#chart", {
                title: inputText.value + " population",
                data: charData,
                type: "line",
                height: 450,
                colors: ["#eb5146"],
                axisOptions: {
                    xIsSeries: true
                }
        })

        button.addEventListener("click", async function() {
            const data = await getData()
        
            const labels = Object.values(data.dimension.Vuosi.category.label)
            const values = data.value
        
            const charData = {
                labels: labels,
                datasets: [{
                    name: inputText.value + " population",
                    values: values
                }]
            }
            const chart = new frappe.Chart("#chart", {
                    title: inputText.value + " population",
                    data: charData,
                    type: "line",
                    height: 450,
                    colors: ["#eb5146"]
            })

            addDataButton.addEventListener("click", function() {
                let helper = 0
                let calculation = 0
                let labelPrediction = parseInt(charData.labels.slice(-1)[0]) + 1
                for(let i = 0; i < charData.datasets[0].values.length - 1; i++){
                    calculation = charData.datasets[0].values[i+1] - charData.datasets[0].values[i]
                    helper = helper + calculation
                }
                helper = charData.datasets[0].values.slice(-1)[0]+helper/(charData.datasets[0].values.length - 1)
    
                chart.addDataPoint(labelPrediction, [parseInt(helper)])
                charData.labels.push(labelPrediction.toString())
                charData.datasets[0].values.push(helper)
            
            })
        })

        addDataButton.addEventListener("click", function() {
            let helper = 0
            let calculation = 0
            let labelPrediction = parseInt(charData.labels.slice(-1)[0]) + 1
            for(let i = 0; i < charData.datasets[0].values.length - 1; i++){
                calculation = charData.datasets[0].values[i+1] - charData.datasets[0].values[i]
                helper = helper + calculation
            }
            helper = charData.datasets[0].values.slice(-1)[0]+helper/(charData.datasets[0].values.length - 1)

            chart.addDataPoint(labelPrediction, [parseInt(helper)])
            charData.labels.push(labelPrediction.toString())
            charData.datasets[0].values.push(helper)
        
        })
}
buildData()