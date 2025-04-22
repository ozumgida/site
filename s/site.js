function getData(data) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', '/data/' + data + '.json', false);
    xhr.send();

    if (xhr.status === 200) {
        let r = JSON.parse(xhr.responseText);
        return r[data];
    } else {
        console.error('Error fetching ' + data + '.json : ', xhr.statusText);
        return null;
    }
}

function link(href, text) {
    let item = document.createElement('a');
    item.href = href;
    item.textContent = text;
    return item;
}

function img(src, text) {
    let item = document.createElement('img');
    item.src = src;
    item.alt = item.title = text;
    return item;
}

function em(text) {
    let item = document.createElement('em');
    item.textContent = text;
    return item;
}

function li(text) {
    let item = document.createElement('li');
    item.textContent = text;
    return item;
}

function h2(text) {
    let item = document.createElement('h2');
    item.textContent = text;
    return item;
}

function h3(text) {
    let item = document.createElement('h3');
    item.textContent = text;
    return item;
}

function p(text) {
    let item = document.createElement('p');
    item.textContent = text;
    return item;
}

function address(lines) {
    let address = document.createElement('address');
    lines.forEach(line => {
        address.innerHTML += line + "<br/>";
    });

    return address;
}

function br() {
    return document.createElement('br');
}

function btn(text) {
    let btn = document.createElement('button');
    btn.textContent = text;
    return btn;
}

function doHeader($body) {
    let $header = document.createElement('header');

    let $logo = img("/logo.jpg", COMPANY.slogan);
    $logo.addEventListener("click", function () { window.location.href = 'index.html' + window.location.search; });

    $header.append($logo);
    $body.insertBefore($header, $body.firstChild);

    (async function () {
        let metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        metaDesc.content = COMPANY.description;
        document.head.append(metaDesc);
    })();

    document.getElementById('loading').remove();

    let $nav = document.createElement('nav');
    let $menu = document.createElement('menu');
    let $about = li('Hakımızda');
    $about.addEventListener("click", function () { window.location.href = '/hakkimizda.html' + window.location.search; });
    if (window.location.href.includes('hakkimizda.html')) {
        $about.style.textDecoration = 'underline';
        $about.style.fontWeight = 'bold';
    }

    let $products = li('Ürünlerimiz');
    $products.addEventListener("click", function () { window.location.href = '/urunlerimiz.html' + window.location.search; });
    if (window.location.href.includes('urunlerimiz.html')) {
        $products.style.textDecoration = 'underline';
        $products.style.fontWeight = 'bold';
    }

    let $story = li('Lezzetimizin Hikayesi');
    $story.addEventListener("click", function () { window.location.href = '/lezzetimizin-hikayesi.html' + window.location.search; });
    if (window.location.href.includes('lezzetimizin-hikayesi.html')) {
        $story.style.textDecoration = 'underline';
        $story.style.fontWeight = 'bold';
    }

    $menu.append($about);
    $menu.append($products);
    $menu.append($story);
    $nav.append($menu);

    $body.append($nav);

    return $header;
}

function doFooter($body) {
    let $footer = document.createElement('footer');
    $footer.append(address(COMPANY.address));
    $footer.append(link('tel:' + COMPANY.phone.replace(/ /g, ''), COMPANY.phone));
    $footer.append(link('mailto:' + COMPANY.email, COMPANY.email));
    $footer.append(br());
    $footer.append(em(COMPANY.legalName));
    $footer.append(em(COMPANY.taxOffice + ' vergi dairesi '));
    $footer.append(em(COMPANY.taxNumber + ' numaralı mükellef'));
    $footer.append(br());
    $footer.append(em(COMPANY.bankName));
    $footer.append(em(COMPANY.iban));
    $body.append($footer);
    return $footer;
}

function showBasket($basket, $btnShowBasket) {
    $btnShowBasket.dataset.active = 'true';
    $btnShowBasket.innerHTML = 'Sepeti Gizle';
    $basket.style.height = "fit-content";
}

function hideBasket($basket, $btnShowBasket) {
    $btnShowBasket.dataset.active = 'false';
    $btnShowBasket.innerHTML = 'Sepeti Göster';
    $basket.style.height = IS_MOBILE ? "180px" : "130px";
}

function doBasket($body, $footer) {
    let $basket = document.createElement('div');
    $basket.id = 'basket';
    $basket.append(p(COMPANY.basketWarning));

    let $btnShowBasket = btn('Sepeti Göster');
    $btnShowBasket.id = 'btnShowBasket';
    $btnShowBasket.addEventListener("click", function () {
        if ($btnShowBasket.dataset.active === 'true') {
            hideBasket($basket, $btnShowBasket);
        }
        else {
            showBasket($basket, $btnShowBasket);
        }
    });
    $basket.append($btnShowBasket);

    hideBasket($basket, $btnShowBasket);

    let $items = document.createElement('ul');
    $basket.append($items);

    let $totalPrice = p('KDV Dahil Toplam : 0 TL');
    $totalPrice.id = 'totalPrice';
    $basket.appendChild($totalPrice);

    let $btnOrderFromWhatsapp = btn("Whatsapp'dan Siparişini İlet");
    $btnOrderFromWhatsapp.id = 'btnOrderFromWhatsapp';
    $btnOrderFromWhatsapp.addEventListener("click", function () {
        let phone = COMPANY.phone;
        let message = "Merhaba,\n\n";
        let $products = $basket.querySelectorAll('li');
        $products.forEach(function ($product) {
            let productName = $product.querySelector('h2').textContent;
            let quantity = $product.querySelector('em').textContent;
            message += `${quantity} ${productName}\n`;
        });
        message += "\nSatın almak istiyorum.";

        let encodedMessage = encodeURIComponent(message);
        if (IS_MOBILE) {
            window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
        } else {
            window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encodedMessage}`, '_blank');
        }
    });
    $basket.appendChild($btnOrderFromWhatsapp);

    $body.insertBefore($basket, $footer);
}

function insertAfter(referenceNode, newNode) {
    referenceNode.insertAdjacentElement('afterend', newNode);
}

function addToBasket(product, quantity = 1) {
    let $basket = document.getElementById('basket');
    let $btnShowBasket = document.getElementById('btnShowBasket');
    showBasket($basket, $btnShowBasket);

    let existingProduct = Array.from($basket.querySelectorAll('li')).find(item => item.dataset.id === product.dataset.id);
    if (existingProduct) {
        let $quantity = existingProduct.querySelector('em');
        let $price = existingProduct.querySelector('strong');
        let unitPrice = parseFloat(existingProduct.dataset.price);

        let quantity = parseInt($quantity.textContent);
        $quantity.textContent = `${++quantity} Adet`;
        $price.textContent = formatPrice(unitPrice * quantity);

        updateTotal();
        return;
    }

    product.querySelector("button").remove();
    product.querySelector("p").remove();

    let $deleteButton = btn("x");
    $deleteButton.classList.add("btnDelete");
    $deleteButton.addEventListener("click", function () {
        product.remove();
        updateTotal();
    });

    insertAfter(product.querySelector("img"), $deleteButton);

    let $h2 = product.querySelector('h2');
    let $price = product.querySelector('strong');
    $price.textContent = formatPrice(product.dataset.price);

    let unitPrice = parseFloat(product.dataset.price);

    let $quantity = em(quantity + " Adet");

    let $minusButton = btn("-");
    let $plusButton = btn("+");

    $minusButton.addEventListener("click", function () {
        let quantity = parseInt($quantity.textContent);
        if (quantity > 1) {
            $quantity.textContent = `${--quantity} Adet`;
            $price.textContent = formatPrice(unitPrice * quantity);
            updateTotal();
        }
    });

    $plusButton.addEventListener("click", function () {
        let quantity = parseInt($quantity.textContent);
        $quantity.textContent = `${++quantity} Adet`;
        $price.textContent = formatPrice(unitPrice * quantity);
        updateTotal();
    });

    insertAfter($h2, $plusButton);
    insertAfter($h2, $quantity);
    insertAfter($h2, $minusButton);

    $basket.querySelector("ul").appendChild(product);

    updateTotal();
}

function doProduct(product, isLinked = true) {
    let $product = document.createElement('li');
    $product.dataset.id = product.id;
    $product.dataset.price = product.price;
    $product.dataset.url = product.urlName;

    let $img = img('', product.name);
    $img.src = '/organik-urunler/' + product.urlName + '.jpg';
    $product.append($img);

    let $name = h2(product.name);
    $product.append($name);

    if (isLinked) {
        let fnClick = function () {
            window.location.href = '/organik-urunler/' + product.urlName + '.html' + window.location.search;
        };
        $img.addEventListener('click', fnClick);
        $name.addEventListener('click', fnClick);
    }

    let $price = document.createElement('strong');
    $price.textContent = `${product.price} TL (KDV Dahil)`;
    $product.append($price);

    $product.append(p(product.shortDesc));

    let $btn = btn('Sepete Ekle');
    $btn.className = 'btnAddToBasket';
    $btn.addEventListener("click", function () {
        addToBasket(this.parentElement.cloneNode(true));
    });
    $product.append($btn);

    return $product;
}

function doProducts($body, isRandom = true) {
    let $products = document.createElement('ol');
    $products.id = 'products';

    let items = PRODUCTS;
    if (isRandom) {
        items = PRODUCTS.sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    items.forEach(product => {
        let $product = doProduct(product);
        $products.append($product);
    });

    $body.append($products);
}

function doAbout($main) {
    let $article = document.createElement('article');

    COMPANY.about.forEach(item => {
        let $title = h2(item.title);
        $article.append($title);
        $article.append(p(item.content.join(' ')));
    });

    $main.append($article);

    return $article;
}

function formatPrice(price) {
    return price.toLocaleString("tr-TR") + " TL";
}

function updateTotal() {
    let $totalPrice = document.getElementById('totalPrice');
    let $basket = document.getElementById('basket');
    let $products = $basket.querySelectorAll('li');

    let total = 0;
    let queryParams = [];
    $products.forEach(function ($product) {
        let productId = $product.dataset.id;
        let quantity = $product.querySelector('em').textContent.split(' ')[0];
        queryParams.push(`${productId}=${quantity}`);

        let priceText = $product.querySelector('strong').textContent;
        let price = parseFloat(priceText.replace(/\D/g, ''));
        total += price;
    });
    $totalPrice.textContent = "KDV Dahil Toplam : " + formatPrice(total);

    let queryString = queryParams.join('&');
    history.replaceState(null, '', `?${queryString}`);
}

var PRODUCTS = [];
var COMPANY = [];
var IS_MOBILE = /Mobi|Android/i.test(navigator.userAgent);
document.addEventListener('DOMContentLoaded', function () {
    COMPANY = getData("company");
    PRODUCTS = getData("products");

    let $body = document.querySelector('body');
    let $header = doHeader($body);
    let $main = document.createElement('main');
    $main.append(h3(COMPANY.slogan));
    $body.append($main);
    let $footer = doFooter($body);
    let $basket = doBasket($body, $footer);

    if (window.location.href.includes('lezzetimizin-hikayesi.html')) {

        let story = getData("erzincan").story;

        let $article = document.createElement('article');
        let $title = h2('Lezzetimizin Hikayesi');
        $article.append($title);

        let $img = img('/img/erzincan.jpg', 'Erzincan Yaylalarının Lezzeti');
        $article.append($img);

        story.forEach(item => {
            let $storyTitle = h2(item.title);
            $article.append($storyTitle);
            let $storyContent = p(item.content.join(' '));
            $storyContent.style.textAlign = 'justify';
            $article.append($storyContent);
        });

        $main.append($article);
    }

    if (window.location.href.includes('hakkimizda.html')) {
        doAbout($main);
    }

    if (window.location.href.includes('/organik-urunler/')) {

        let productName = window.location.href.split('/').pop().split('.')[0];
        let product = PRODUCTS.find(p => p.urlName === productName);
        if (product) {
            let $article = document.createElement('article');
            $article.classList.add('prd');

            let $product = doProduct(product, false);
            $article.append($product);

            let $longDesc = p(product.longDesc.join(' '));
            $longDesc.style.textAlign = 'justify';
            $article.append($longDesc);

            $main.append($article);
        } else {
            console.error('Product not found: ' + productName);
        }
    }

    if (window.location.href.includes('urunlerimiz.html')) {
        let $products = doProducts($main, false);
    }
    else {
        let $products = doProducts($main);
    }

    setTimeout(function () {
        let queryString = window.location.search;
        let params = new URLSearchParams(queryString);
        for (let [key, value] of params.entries()) {
            let quantity = parseInt(value);
            let product = PRODUCTS.find(p => p.id === key);
            if (product) { addToBasket(doProduct(product), quantity); }
        }
    }, 987);
});
