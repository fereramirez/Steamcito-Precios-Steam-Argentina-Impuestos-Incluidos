// Función para detectar cambios en el DOM así se dispara la función cada vez que Steam carga productos de forma asíncrona.
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
const observer = new MutationObserver(function(mutations, observer) {
    getAppPrices();
});

observer.observe(document, {
  subtree: true,
  attributes: true
});

const attributeName = "data-original-price";
const taxes = {
    tax1 : {
        name : "IVA Servicios Digitales",
        percentage : 0.21,
        moreInfo: "https://www.afip.gob.ar/iva/servicios-digitales/obligados.asp"
    },
    tax2 : {
        name : "Impuesto PAIS",
        percentage : 0.8,
        moreInfo: "https://www.afip.gob.ar/impuesto-pais/caracteristicas/definicion.asp"
    },
    tax3 : {
        name : "Retención de Impuesto a las ganancias",
        percentage : 0.35,
        moreInfo: "https://www.afip.gob.ar/impuesto-pais/caracteristicas/definicion.asp"
    }
};

// Averiguar como sacar todos los percentages
const totalTaxes = 1.64;


function getAppPrices(){
    // Get all current non-converted prices
    let prices = document.querySelectorAll(`.discount_final_price:not([${attributeName}]), .game_area_dlc_price:not([${attributeName}]), .game_purchase_price:not([${attributeName}])`);
    prices.forEach(price => setArgentinaPrice(price));
}

function setArgentinaPrice(price){
    // Verificar si el producto realmente tiene un precio.
    if(price.innerText.includes("ARS$")){
        let positionArs = price.innerText.lastIndexOf("ARS$ ") + 5;
        let baseNumericPrice = convertStringToNumber(price,positionArs);
        price.dataset.originalPrice = baseNumericPrice;
        price.dataset.argentinaPrice = (baseNumericPrice * totalTaxes).toFixed(2);
        displayAppPrices(price);
    }
    else{
        price.dataset.originalPrice = "none";
    }
}

function convertStringToNumber(price,positionArs){
    return parseFloat(price.innerText.slice(positionArs).replace(".","").replace(",","."));
}

function convertNumberToString(price){
    return `ARS$ ${price}`.replace('.',',');
}

function displayAppPrices(price){
    let priceToDisplay = convertNumberToString(price.dataset.argentinaPrice);

    if(price.classList.contains('game_purchase_price')){
        let newElement = `<div class="game_purchase_price price" data-original-price="none">${priceToDisplay}</div>`;
        price.insertAdjacentHTML('afterend',newElement);
    } else if(price.classList.contains('discount_final_price')){
        let newElement = `<div class="discount_final_price price" data-original-price="none">${priceToDisplay}</div>`;
        price.insertAdjacentHTML('afterend',newElement);    
    }
}



