const inputText = localStorage.getItem('MEOW')
console.log(inputText)

const munincipatilitySearch = async (factor) => {
    
    let i = 0
    const URL = "https://statfin.stat.fi/PxWeb/api/v1/en/StatFin/synt/statfin_synt_pxt_12dy.px"

    const res = await fetch(URL)
    const JSONfile = await res.json()
    let munincipitalities = JSONfile.variables[1].valueTexts
    let input = JSONfile.variables[1].values[0]
    munincipitalities.forEach(index => {
        if (inputText.toUpperCase() == index.toUpperCase()){
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
                    "values": [factor]            
                }
            }
        ],
        "response": {        
            "format": "json-stat2"    
        }
    }
    return jsonQuery
}

const getDataBirth = async () => {
    let factor = "vm01"
    let jsonQuery = await munincipatilitySearch(factor)
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

const getDataDeath = async () => {
    let factor = "vm11"
    let jsonQuery = await munincipatilitySearch(factor)
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
    
        const dataBirth= await getDataBirth()
        const dataDeath = await getDataDeath()
    
        const labels = Object.values(dataBirth.dimension.Vuosi.category.label)
        const deaths = dataDeath.value
        const births = dataBirth.value
    
        const charData = {
            labels: labels,
            datasets: [{
                name: "Birth rate",
                values: births
            },
            {
                name: "Death rate",
                values: deaths
            }
        ]
        }
        const chart = new frappe.Chart("#chart", {
                title: inputText + " population",
                data: charData,
                type: "bar",
                height: 450,
                colors: ["#63d0ff", '#363636'],
                axisOptions: {
                    xIsSeries: true
                }
        })
    }

buildData()