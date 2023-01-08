const selectWithCurrencies = document.querySelector("#currency")
const url = `https://mindicador.cl/api`

const getCurrencies = async () => {
    try {
        const req = await fetch(url)
        const data = await req.json()

        console.log(data)

        const filterCurrencies = ["dolar", "euro"]
        const currencyList = filterCurrencies.map((currency) => {
            return {
                code: data[currency].codigo,
                value: data[currency].valor,
            }
        })

        currencyList.forEach(currency => {
            const option = document.createElement("option")
            option.value = currency.value
            option.textContent = currency.code.charAt(0).toUpperCase() + currency.code.slice(1)
            selectWithCurrencies.appendChild(option)
        })
    } catch (e) {
        alert(e.message)
    }
}

const calcResult = (amountPesos, currencySelected) => {
    const resultFinal = amountPesos / currencySelected
    document.querySelector("#result").innerHTML = "Resultado: " + "$" + resultFinal.toFixed(2)
}

const drawChart = async (currency) => {
    try {
        const reqChart = await fetch(`${url}/${currency}`)
        const dataChart = await reqChart.json()
        console.log(dataChart)

        const serieToChart = dataChart.serie.slice(0, 10)
        console.log(serieToChart)

        const data = {
            labels: serieToChart.map(item => item.fecha.slice(0, 10)),
            datasets: [{
                label: currency,
                data: serieToChart.map(item => item.valor),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        };

        const config = {
            type: 'line',
            data: data,
        };

        let chartStatus = Chart.getChart("myChart");
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }

        const chartDOM = document.querySelector("#myChart")
        new Chart(chartDOM, config)

    } catch (e) {
        alert(e.message)
    }

}

document.querySelector("#convertir").addEventListener("click", () => {
    const amountPesos = document.querySelector("#pesos").value
    if (amountPesos === "") {
        alert("Debes ingresar una cantidad de pesos")
        return
    }
    const currencySelected = selectWithCurrencies.value
    const codeCurrencySelected = selectWithCurrencies.options[selectWithCurrencies.selectedIndex].text.toLowerCase()
    calcResult(amountPesos, currencySelected)
    drawChart(codeCurrencySelected)
})

getCurrencies()

