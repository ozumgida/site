function getData(data) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/" + data + ".json", false);
    xhr.send();

    if (xhr.status === 200) {
        let r = JSON.parse(xhr.responseText);
        return r[data];
    } else {
        console.error("Error fetching " + data + ".json : ", xhr.statusText);
        return null;
    }
}

function lnk(href, text) {
    let item = document.createElement("a");
    item.href = href;
    item.textContent = text;
    return item;
}

function img(src, text) {
    let item = document.createElement("img");
    item.src = src;
    item.alt = item.title = text;
    return item;
}

function em(text) {
    let item = document.createElement("em");
    item.textContent = text;
    return item;
}

function div() {
    return document.createElement("div");
}

function li(text) {
    let item = document.createElement("li");
    item.textContent = text;
    return item;
}

function h2(text) {
    let item = document.createElement("h2");
    item.textContent = text;
    return item;
}

function h3(text) {
    let item = document.createElement("h3");
    item.textContent = text;
    return item;
}

function p(text, isJustify = false) {
    let item = document.createElement("p");
    item.textContent = text;
    if (isJustify) {
        item.style.textAlign = "justify";
    }
    return item;
}

function article() {
    let item = document.createElement("article");
    return item;
}

function address(lines) {
    let address = document.createElement("address");
    lines.forEach(line => {
        address.innerHTML += line + "<br/>";
    });

    return address;
}

function br() { return document.createElement("br"); }

function btn(text) {
    let btn = document.createElement("button");
    btn.textContent = text;
    return btn;
}

function rmv(id) { rmv2(document.querySelector(id)); }
function rmv2(element) { if (element) { element.remove(); } }
function rmv3(elements) { elements.forEach(function (e) { e.remove(); }); }

function menuItem(name, url) {
    let $item = li(name);
    $item.dataset.url = url;
    $item.addEventListener("click", function () { window.location.href = $item.dataset.url + window.location.search; });
    if (window.location.href.includes($item.dataset.url)) {
        $item.style.textDecoration = "underline";
        $item.style.fontWeight = "bold";
    }
    return $item;
}

function doHeader($body) {
    let $header = document.createElement("header");

    let $logo = img("/logo.jpg", COMPANY.slogan);
    $logo.className = "logo";
    $logo.addEventListener("click", function () { window.location.href = "/index.html" + window.location.search; });
    $header.append($logo);
    $body.insertBefore($header, $body.firstChild);

    updateHtmlDesc(COMPANY.description);
    rmv('#loading');

    let $nav = document.createElement("nav");
    let $menu = document.createElement("menu");
    $menu.append(
        //menuItem("☰", "#"),
        menuItem("Hakımızda", "/hakkimizda.html"),
        menuItem("Ürünlerimiz", "/urunlerimiz.html"),
        menuItem("Lezzetimizin Hikayesi", "/lezzetimizin-hikayesi.html"));
    $nav.append($menu);

    $body.append($nav);

    return $header;
}

function imgWithBtn(src, btnText, url) {
    if (url === undefined) { url = "/urunlerimiz.html"; }

    let $img = img(src, COMPANY.slogan);
    let $btn = btn(btnText);
    $btn.addEventListener("click", function () {
        window.location.href = url + window.location.search;
    });
    let $div = div();
    $div.className = "bigImg";
    $div.append($img, $btn);
    return $div;
}


function doFooter($body) {
    let $footer = document.createElement("footer");
    let part = imgWithBtn("/img/kahvaltilik-2.jpg", "Ürünlerimizi Görün");
    $footer.append(part);

    $footer.append(address(COMPANY.address),
        lnk("tel:" + COMPANY.phone.replace(/ /g, ""), COMPANY.phone), lnk("mailto:" + COMPANY.email, COMPANY.email),
        br());


    const currentYear = new Date().getFullYear();
    $footer.append(p(COMPANY.name + " © " + currentYear));
    let $logo = img("/logo.jpg", COMPANY.slogan);
    $logo.className = "logo";
    $footer.append($logo);


    $body.append($footer);
    return $footer;
}

function showBasket(basket, btnShow) {
    btnShow.dataset.active = "true";
    btnShow.innerHTML = "Sepeti Gizle";
    basket.style.height = "fit-content";
}

function hideBasket(basket, btnShow) {
    btnShow.dataset.active = "false";
    btnShow.innerHTML = "Sepeti Göster";
    basket.style.height = IS_MOBILE ? "230px" : "160px";
}

function doBasket($body, $footer) {
    let $basket = document.createElement("div");
    $basket.id = "basket";
    $basket.append(p(COMPANY.basketWarning));

    let $btnShowBasket = btn("Sepeti Göster");
    $btnShowBasket.id = "btnShowBasket";
    $btnShowBasket.addEventListener("click", function () {
        if ($btnShowBasket.dataset.active === "true") { hideBasket($basket, $btnShowBasket); }
        else { showBasket($basket, $btnShowBasket); }
    });
    $basket.append($btnShowBasket);

    hideBasket($basket, $btnShowBasket);

    $basket.append(document.createElement("ul"));

    let $totalPrice = p("Ürün Tutarı: 0 TL");
    $totalPrice.id = "totalPrice";
    $basket.appendChild($totalPrice);

    let $cargo = p("Kargo Ücreti: 150 TL");
    $basket.appendChild($cargo);

    let $total = p("Genel Toplam: 150 TL");
    $total.id = "total";
    $basket.appendChild($total);

    let $btnOrderFromWhatsapp = btn("Whatsapp'dan Siparişini İlet");
    $btnOrderFromWhatsapp.id = "btnOrderFromWhatsapp";
    $btnOrderFromWhatsapp.addEventListener("click", function () {
        let phone = COMPANY.phone;
        let message = "Merhaba,\n\n";
        let $products = $basket.querySelectorAll("li");
        $products.forEach(function ($product) {
            let productName = $product.querySelector("h2").textContent;
            let quantity = $product.querySelector("em").textContent;
            message += `${quantity} ${productName}\n`;
        });
        message += "\nSatın almak istiyorum.";

        let encodedMessage = encodeURIComponent(message);
        if (IS_MOBILE) { window.open(`https://wa.me/${phone}?text=${encodedMessage}`, "_blank"); }
        else { window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`, "_blank"); }
    });
    $basket.appendChild($btnOrderFromWhatsapp);

    $body.insertBefore($basket, $footer);
}

function insertAfter(referenceNode, newNode) {
    referenceNode.insertAdjacentElement("afterend", newNode);
}

function basketAdder(previousElement, prdId, price, quantity) {
    let priceKey = `#basket li[data-id="${prdId}"] strong`;

    let unitPrice = parseFloat(price);
    let $quantity = em(quantity + " Adet");

    let $minusButton = btn("⚊");
    $minusButton.style.visibility = "hidden";
    let $plusButton = btn("+");

    $minusButton.addEventListener("click", function () {
        let quantity = parseInt($quantity.textContent);
        if (quantity > 1) {
            $quantity.textContent = `${--quantity} Adet`;
            let $price = document.querySelector(priceKey);
            $price.textContent = formatPrice(unitPrice * quantity);
            updateTotal();
        }

        if (quantity <= 1) {
            this.style.visibility = "hidden";
        }
    });

    $plusButton.addEventListener("click", function () {
        let quantity = parseInt($quantity.textContent);
        $quantity.textContent = `${++quantity} Adet`;
        let $price = document.querySelector(priceKey);
        $price.textContent = formatPrice(unitPrice * quantity);
        updateTotal();
        $minusButton.style.visibility = "visible";
    });

    insertAfter(previousElement, $plusButton);
    insertAfter(previousElement, $quantity);
    insertAfter(previousElement, $minusButton);
}

function addToBasket(product, quantity = 1) {
    let $basket = document.getElementById("basket");
    let $btnShowBasket = document.getElementById("btnShowBasket");
    showBasket($basket, $btnShowBasket);

    let existingProduct = Array.from($basket.querySelectorAll("li")).find(item => item.dataset.id === product.dataset.id);
    if (existingProduct) {
        let $quantity = existingProduct.querySelector("em");
        let $price = existingProduct.querySelector("strong");
        let unitPrice = parseFloat(existingProduct.dataset.price);

        let quantity = parseInt($quantity.textContent);
        $quantity.textContent = `${++quantity} Adet`;
        $price.textContent = formatPrice(unitPrice * quantity);

        updateTotal();
        return;
    }

    rmv2(product.querySelector("button"));
    rmv3(product.querySelectorAll("p"));

    let $deleteButton = btn("🞨");
    $deleteButton.classList.add("btnDelete");
    $deleteButton.addEventListener("click", function () {
        rmv2(product);
        updateTotal();
    });

    let $img = product.querySelector("img");
    insertAfter($img, $deleteButton);

    let $h2 = product.querySelector("h2");
    $h2.removeEventListener("click", fnClick);
    let $price = product.querySelector("strong");
    $price.textContent = formatPrice(product.dataset.price);

    basketAdder($h2, product.dataset.id, product.dataset.price, quantity);

    $basket.querySelector("ul").appendChild(product);

    updateTotal();
}

function updateHtmlDesc(htmlDesc) {
    (async function () {
        let existingMetaDesc = document.querySelector('meta[name="description"]');
        if (existingMetaDesc) {
            existingMetaDesc.content = htmlDesc;
        } else {
            let metaDesc = document.createElement("meta");
            metaDesc.name = "description";
            metaDesc.content = htmlDesc;
            document.head.append(metaDesc);
        }
    })();
}

let fnClick = function () {
    window.location.href = "/organik-urunler/" + this.dataset.url + ".html" + window.location.search;
};

function doProduct(product, isLinked = true) {
    let $product = document.createElement("li");
    $product.dataset.id = product.id;
    $product.dataset.price = product.price;
    $product.dataset.url = product.urlName;

    let $img = img("", product.name);
    $img.src = "/organik-urunler/" + product.urlName + ".jpg";
    $img.dataset.url = product.urlName;
    $product.append($img);

    let $name = h2(product.name);
    $name.dataset.url = product.urlName;
    $product.append($name);

    let $price = document.createElement("strong");
    $price.textContent = `${product.price} TL (KDV Dahil)`;
    $product.append($price);

    if (isLinked) {
        $img.addEventListener("click", fnClick);
        $name.addEventListener("click", fnClick);
        $product.append(p(product.shortDesc));
    }
    else {
        updateHtmlDesc(product.metaDesc);
        rmv("main h3");
    }

    let $btn = btn("Sepete Ekle");
    $btn.className = "btnAddToBasket";
    $btn.addEventListener("click", function () {
        this.style.visibility = "hidden";
        insertAfter(this, p("Sepete Eklendi"));
        addToBasket(this.parentElement.cloneNode(true));
        this.remove();
    });
    $product.append($btn);

    return $product;
}

function doProducts($body, isRandom = true) {
    let $products = document.createElement("ul");
    $products.id = "products";

    let items = PRODUCTS;
    if (isRandom) {
        items = PRODUCTS.sort(() => 0.5 - Math.random()).slice(0, 3);
    }

    items.forEach(product => { $products.append(doProduct(product)); });
    $body.append($products);
}

function doAbout($main) {
    let $article = article();

    COMPANY.about.forEach(item => {
        $article.append(h2(item.title));
        $article.append(p(item.content.join(" ")));
    });

    $main.append($article);

    return $article;
}

function formatPrice(price) { return price.toLocaleString("tr-TR") + " TL"; }

function updateTotal() {
    let $totalPrice = document.getElementById("totalPrice");
    let $total = document.getElementById("total");
    let $basket = document.getElementById("basket");
    let $products = $basket.querySelectorAll("li");

    let total = 0;
    let queryParams = [];
    $products.forEach(function ($product) {
        let productId = $product.dataset.id;
        let quantity = $product.querySelector("em").textContent.split(" ")[0];
        queryParams.push(`${productId}=${quantity}`);

        let priceText = $product.querySelector("strong").textContent;
        let price = parseFloat(priceText.replace(/\D/g, ""));
        total += price;
    });

    $totalPrice.textContent = "Ürün Tutarı : " + formatPrice(total) + " (KDV Dahil)";
    total += 150;
    $total.textContent = "Genel Toplam : " + formatPrice(total);

    let queryString = queryParams.join("&");
    history.replaceState(null, "", `?${queryString}`);
}

var PRODUCTS = [];
var COMPANY = [];
var IS_MOBILE = /Mobi|Android/i.test(navigator.userAgent);
document.addEventListener("DOMContentLoaded", function () {
    COMPANY = getData("company");
    PRODUCTS = getData("products");

    let $body = document.body;
    let $header = doHeader($body);

    if (window.location.pathname == "/" || window.location.pathname.includes("/index.html")) {
        let part = imgWithBtn("/img/kahvaltilik-1.jpg", "Ürünlerimizi Görün");
        if (IS_MOBILE) {
            part.style.marginTop = "-125px";
        }
        else {
            part.style.marginTop = "-50px";
        }
        $body.append(part);
    }

    let $main = document.createElement("main");
    $main.append(h3(COMPANY.slogan));
    $body.append($main);
    let $footer = doFooter($body);
    let $basket = doBasket($body, $footer);

    if (window.location.href.includes("lezzetimizin-hikayesi.html")) {
        let story = getData("erzincan").story;

        let $article = article();
        $article.append(h2("Lezzetimizin Hikayesi"));
        $article.append(img("/img/erzincan.jpg", "Erzincan Yaylalarının Lezzeti"));

        story.forEach(item => {
            $article.append(h2(item.title));
            $article.append(p(item.content.join(" "), true));
        });

        $main.append($article);
    }

    if (window.location.href.includes("hakkimizda.html")) { doAbout($main); }

    if (window.location.href.includes("/organik-urunler/")) {
        let productName = window.location.href.split("/").pop().split(".")[0];
        let product = PRODUCTS.find(p => p.urlName === productName);
        if (product) {
            let $article = article();
            $article.classList.add("prd");
            $article.append(doProduct(product, false));
            $article.append(p(product.longDesc.join(" "), true));

            $main.append($article);
        } else {
            console.error("Product not found: " + productName);
        }
    }

    if (window.location.href.includes("urunlerimiz.html")) { doProducts($main, false); }
    else { doProducts($main); }

    setTimeout(function () {
        let queryString = window.location.search;
        let params = new URLSearchParams(queryString);
        for (let [key, value] of params.entries()) {
            let product = PRODUCTS.find(p => p.id === key);
            if (product) { addToBasket(doProduct(product), parseInt(value)); }
        }
    }, 987);
});
