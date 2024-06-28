class Currency {
    constructor(code, name) {
        this.code = code;
        this.name = name;
    }
}

class CurrencyConverter {
    constructor(apiUrl, currencies=[]) {
        this.apiUrl=apiUrl,
        this.currencies=currencies
    }

    async getCurrencies() {
        const response=await fetch(this.apiUrl + "/currencies")

        const datos=await response.json()
        console.log(datos)
        for (let currencies in datos){
            console.log(datos[currencies])
            const newCurrency=new Currency(currencies, datos[currencies])
            this.currencies.push(newCurrency)
        }
        console.log(this.currencies)
        
        
    }

    async convertCurrency(amount, fromCurrency, toCurrency) {
        try {
            if(toCurrency.code == fromCurrency.code) {
                console.log("SON IGUALES")
                console.log(typeof(amount))
                
                return parseInt(amount)
            }
    
            const datos=await fetch(this.apiUrl + `/latest?amount=${amount}&from=${fromCurrency.code}&to=${toCurrency.code}`)
            if (!datos.ok) {
                throw new Error(`Error al realizar la solicitud`);
            }
            
            const montoFinal= await datos.json()
    
            console.log(montoFinal.rates[toCurrency.code])
            return montoFinal.rates[toCurrency.code]
        } catch (error) {
            console.log(error)
            return null
        }
        
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById("conversion-form");
    const resultDiv = document.getElementById("result");
    const fromCurrencySelect = document.getElementById("from-currency");
    const toCurrencySelect = document.getElementById("to-currency");

    const converter = new CurrencyConverter("https://api.frankfurter.app");

    await converter.getCurrencies();
    populateCurrencies(fromCurrencySelect, converter.currencies);
    populateCurrencies(toCurrencySelect, converter.currencies);

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const amount = document.getElementById("amount").value;
        const fromCurrency = converter.currencies.find(
            (currency) => currency.code === fromCurrencySelect.value
        );
        const toCurrency = converter.currencies.find(
            (currency) => currency.code === toCurrencySelect.value
        );

        const convertedAmount = await converter.convertCurrency(
            amount,
            fromCurrency,
            toCurrency
        );
        if (convertedAmount !== null && !isNaN(convertedAmount)) {
            resultDiv.textContent = `${amount} ${
                fromCurrency.code
            } son ${convertedAmount.toFixed(2)} ${toCurrency.code}`;
        } else {
            resultDiv.textContent = "Error al realizar la conversión.";
        }
    });

    function populateCurrencies(selectElement, currencies) {
        if (currencies) {
            currencies.forEach((currency) => {
                const option = document.createElement("option");
                option.value = currency.code;
                option.textContent = `${currency.code} - ${currency.name}`;
                selectElement.appendChild(option);
            });
        }
    }
});
