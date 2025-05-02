var PRODUCTS = [];
var COMPANY = [];
var IS_MOBILE = /Mobi|Android/i.test(navigator.userAgent);
var IS_HOME = window.location.pathname == "/" || window.location.pathname.includes("/index.html");

function doProduct(product, isLinked = true) {
    let $p = document.createElement("li");
    $p.dataset.id = product.id;
    $p.dataset.price = product.price;
    $p.dataset.url = product.urlName;

    let $img = img("", product.name);
    $img.src = "/organik-urunler/" + product.urlName + ".jpg";
    $img.dataset.url = product.urlName;
    $p.append($img);

    let $name = h2(product.name);
    $name.dataset.url = product.urlName;
    $p.append($name);

    let $price = document.createElement("strong");
    $price.textContent = `${product.price} TL (KDV Dahil)`;
    $p.append($price);

    if (isLinked) {
        $img.addEventListener("click", fpc);
        $name.addEventListener("click", fpc);
        $p.append(p(product.shortDesc));
    }
    else {
        updateHtmlDesc(product.metaDesc);
        rmv("main h3");
    }

    let $btn = btn("Sepete Ekle");
    $btn.className = "btnAddToBasket";
    $btn.addEventListener("click", function () {
        this.style.display = "none";
        let x = p("Sepete Eklendi");
        insertAfter(this, x);

        let basketQuantity = 1;

        let existing = document.querySelector(`#basket li[data-id="${product.id}"]`);
        if (existing) {
            basketQuantity = parseInt(existing.querySelector("em").textContent.split(" ")[0]) + 1;
        }

        //basketAdder(x, product.id, product.price, basketQuantity);

        addToBasket(this.parentElement.cloneNode(true), basketQuantity);
        this.remove();
    });
    $p.append($btn, br(), br());

    return $p;
}

function doProducts($body, isRandom = true) {
    let $p = document.createElement("ul");
    $p.id = "products";
    let items = PRODUCTS;
    if (isRandom) { items = PRODUCTS.sort(() => 0.5 - Math.random()).slice(0, 3); }
    items.forEach(product => { $p.append(doProduct(product)); });
    $body.append($p);
}

function doAbout($main) {
    document.title = "Hakkımızda | " + COMPANY.name;
    let a = article();
    a.append(h2("Hakkımızda"), img("/img/hakkimizda.jpg", COMPANY.name));
    COMPANY.about.forEach(item => { a.append(h2(item.title), p(item.content.join(" "))); });
    $main.append(a);
    return a;
}

function doIletisim($main) {
    document.title = "İletişim | " + COMPANY.name;
    let a = article();
    let i = img("/img/iletisim.jpg", COMPANY.name);
    i.style.objectPosition = "center";
    a.append(h2("İletişim"), i,
        address(COMPANY.address),
        lnk("https://maps.app.goo.gl/4mFyGQx7jfX2S2vh7", "Haritada Gör", true), br(),
        lnk("tel:" + COMPANY.phone.replace(/ /g, ""), COMPANY.phone),
        lnk("mailto:" + COMPANY.email, COMPANY.email), br());
    $main.append(a);
    return a;
}

function doSiteHaritasi($main) {
    document.title = "Site Haritası | " + COMPANY.name;
    let a = article();
    let i = img("/img/site-haritasi.jpg", "Site Haritası");
    i.style.objectPosition = "bottom";
    a.append(h2("Site Haritası"), i, br(),
        lnk("/index.html", "Anasayfa"),
        lnk("/urunlerimiz.html", "Ürünlerimiz"),
        lnk("/hakkimizda.html", "Hakkımızda"),
        lnk("/lezzetimizin-hikayesi.html", "Lezzetimizin Hikayesi"),        
        lnk("/satis-sozlesmesi.html", "Mesafeli Satış Sözleşmesi"),
        lnk("/kvkk.html", "KVKK Aydınlatma Metni"),
        lnk("/iletisim.html", "İletişim"), br());
    $main.append(a);
    return a;
}

function doKVKK($main) {
    document.title = "Kişisel verilerinizin korunması hakkında | " + COMPANY.name;
    let parts = getData("kvkk").parts;
    let a = article();
    let i = img("/img/kvkk.jpg", "Kişisel verilerinizi koruyoruz");
    i.style.objectPosition = "center";
    a.append(h2("KVKK Aydınlatma Metni"), i);
    parts.forEach(item => { a.append(h2(item.title), p(item.content, true)); });
    $main.append(a);
    return a;
}

function doSozlesme($main) {
    document.title = "Mesafeli satış sözleşmesi hakkında | " + COMPANY.name;
    let parts = getData("sozlesme").parts;
    let a = article();
    let i = img("/img/sozlesme.jpg", "Mesafeli Satış Sözleşmesi");
    if (IS_MOBILE) { i.style.objectPosition = "left"; }
    else { i.style.objectPosition = "top"; }
    a.append(h2("Mesafeli Satış Sözleşmesi"), i);
    parts.forEach(item => { a.append(h2(item.title), p(item.content, true)); });
    $main.append(a);
    return a;
}

function doLezzetimizinHikayesi($main) {
    document.title = "Lezzetimizin Hikayesi | " + COMPANY.name;
    let story = getData("erzincan").story;
    let a = article();
    a.append(h2("Lezzetimizin Hikayesi"), img("/img/lezzetimizin-hikayesi.jpg", "Erzincan Yaylalarının Lezzeti"));
    story.forEach(item => { a.append(h2(item.title), p(item.content.join(" "), true)); });
    $main.append(a);
    return a;
}

document.addEventListener("DOMContentLoaded", function () {
    COMPANY = getData("company");
    PRODUCTS = getData("products");

    let $body = document.body;
    doHeader($body);

    if (IS_HOME) {
        let part = imgWithBtn("/img/kahvaltilik-1.jpg", "Ürünlerimizi Görün");
        if (IS_MOBILE) { part.style.marginTop = "-125px"; }
        else { part.style.marginTop = "-50px"; }
        $body.append(part);
    }

    let $main = document.createElement("main");
    $main.append(h3(COMPANY.slogan));
    $body.append($main);
    doBasket($body, doFooter($body));

    if (window.location.href.includes("/hakkimizda.html")) { doAbout($main); }
    if (window.location.href.includes("/iletisim.html")) { doIletisim($main); }
    if (window.location.href.includes("/site-haritasi.html")) { doSiteHaritasi($main); }
    if (window.location.href.includes("/kvkk.html")) { doKVKK($main); }
    if (window.location.href.includes("/satis-sozlesmesi.html")) { doSozlesme($main); }
    if (window.location.href.includes("lezzetimizin-hikayesi.html")) { doLezzetimizinHikayesi($main); }

    if (window.location.href.includes("/organik-urunler/")) {
        let pun = window.location.href.split("/").pop().split(".")[0];
        let product = PRODUCTS.find(p => p.urlName === pun);
        if (product) {
            document.title = product.name + " | " + COMPANY.name;
            let a = article();
            a.className = "prd";
            a.append(doProduct(product, false), p(product.longDesc.join(" "), true));
            $main.append(a);
        } else { console.error("Product not found: " + pun); }
    }

    if (window.location.href.includes("/urunlerimiz.html")) { document.title = "Ürünlerimiz | " + COMPANY.name; doProducts($main, false); }
    else { doProducts($main); }

    setTimeout(function () {
        let prms = new URLSearchParams(window.location.search);
        for (let [key, value] of prms.entries()) {
            let product = PRODUCTS.find(p => p.id === key);
            if (product) { addToBasket(doProduct(product), parseInt(value)); }
        }
    }, 987);

    setTimeout(function () {
        let preloadImages = ["/img/kahvaltilik-1.jpg", "/img/kahvaltilik-2.jpg", "/img/hakkimizda.jpg", "/img/iletisim.jpg", "/img/lezzetimizin-hikayesi.jpg"];
        PRODUCTS.forEach(product => { preloadImages.push(`/organik-urunler/${product.urlName}.jpg`); });
        preloadImages.forEach(src => { let img = new Image(); img.src = src; });
    }, 3456);
});

//sync count on every product place
//load basket adder if item is in basket

function basketAdder(prevElem, prdId, price, quantity) {
    let priceKey = `#basket li[data-id="${prdId}"] strong`;
    let unitPrice = parseFloat(price);
    let $quantity = em(quantity + " Adet");

    let $mb = btn("⚊");
    $mb.className = "bskbtn";
    $mb.style.visibility = "hidden";
    let $pb = btn("+");
    $pb.className = "bskbtn";

    $mb.addEventListener("click", function () {
        let quantity = parseInt($quantity.textContent);
        if (quantity > 1) {
            $quantity.textContent = `${--quantity} Adet`;
            let $price = document.querySelector(priceKey);
            $price.textContent = formatPrice(unitPrice * quantity);
            updateTotal();
        }

        if (quantity <= 1) { this.style.visibility = "hidden"; }
    });

    $pb.addEventListener("click", function () {
        let quantity = parseInt($quantity.textContent);
        $quantity.textContent = `${++quantity} Adet`;
        let $price = document.querySelector(priceKey);
        $price.textContent = formatPrice(unitPrice * quantity);
        updateTotal();
        $mb.style.visibility = "visible";
    });

    insertAfter(prevElem, $pb);
    insertAfter(prevElem, $quantity);
    insertAfter(prevElem, $mb);
}

function addToBasket(product, quantity = 1) {
    let $basket = document.getElementById("basket");
    showBasket($basket, document.getElementById("btnShowBasket"));

    let existing = Array.from($basket.querySelectorAll("li")).find(item => item.dataset.id === product.dataset.id);
    if (existing) {
        let $quantity = existing.querySelector("em");
        let $price = existing.querySelector("strong");
        let unitPrice = parseFloat(existing.dataset.price);
        let quantity = parseInt($quantity.textContent);
        $quantity.textContent = `${++quantity} Adet`;
        $price.textContent = formatPrice(unitPrice * quantity);
        updateTotal();
        return;
    }

    let elementsToRemove = [];
    let sibling = product.querySelector("strong").nextSibling;
    while (sibling) {
        elementsToRemove.push(sibling);
        sibling = sibling.nextSibling;
    }
    elementsToRemove.forEach(el => el.remove());

    let $db = btn("X");
    $db.classList.add("btnDelete");
    $db.addEventListener("click", function () { rmv2(product); updateTotal(); });

    insertAfter(product.querySelector("img"), $db);

    let $h2 = product.querySelector("h2");
    $h2.removeEventListener("click", fpc);
    let $price = product.querySelector("strong");
    $price.textContent = formatPrice(product.dataset.price);

    basketAdder($h2, product.dataset.id, product.dataset.price, quantity);

    $basket.querySelector("ul").appendChild(product);
    updateTotal();
}

function doBasket($body, $f) {
    let bi = div();
    bi.id = "basketInfo";
    bi.append(div(), img("/img/basket.png", "Sepet"));
    bi.addEventListener("click", function () {
        window.location.href = "#basket";
        showBasket(document.getElementById("basket"), document.getElementById("btnShowBasket"));
    });
    $body.append(bi);

    let $b = div();
    $b.id = "basket";
    $b.append(p(COMPANY.basketWarning));

    let $bs = btn("Sepeti Göster");
    $bs.id = "btnShowBasket";
    $bs.addEventListener("click", function () {
        if ($bs.dataset.active === "true") { hideBasket($b, $bs); }
        else { showBasket($b, $bs); }
    });
    $b.append($bs);
    hideBasket($b, $bs);

    $b.append(document.createElement("ul"));
    let $pTotal = p("Ürün Tutarı: 0 TL");
    $pTotal.id = "pTotal";
    $b.appendChild($pTotal);

    let $cargo = p("Kargo Ücreti: 150 TL");
    $b.appendChild($cargo);

    let $total = p("Genel Toplam: 150 TL");
    $total.id = "total";
    $b.appendChild($total);

    let $bw = btn("Whatsapp'dan Siparişini İlet");
    $bw.id = "btnOrderFromWhatsapp";
    $bw.addEventListener("click", function () {
        let phone = COMPANY.phone;
        let message = "Merhaba,\n\n";
        let ps = $b.querySelectorAll("li");
        ps.forEach(function (p) { message += `${p.querySelector("em").textContent} ${p.querySelector("h2").textContent}\n`; });
        message += "\nSatın almak istiyorum.";

        let encoded = encodeURIComponent(message);
        if (IS_MOBILE) { window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank"); }
        else { window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`, "_blank"); }
    });
    $b.appendChild($bw);

    $body.insertBefore($b, $f);
}

function showBasket(p, b) {
    b.dataset.active = "true";
    b.innerHTML = "Sepeti Gizle";
    p.style.height = "fit-content";
}

function hideBasket(p, b) {
    b.dataset.active = "false";
    b.innerHTML = "Sepeti Göster";
    p.style.height = IS_MOBILE ? "230px" : "160px";
}

function updateTotal() {
    let $pTotal = document.getElementById("pTotal");
    let $total = document.getElementById("total");
    let $basket = document.getElementById("basket");
    let $products = $basket.querySelectorAll("li");

    let total = 0;
    let count = 0;
    let queryParams = [];
    $products.forEach(function ($p) {
        let quantity = $p.querySelector("em").textContent.split(" ")[0];
        queryParams.push(`${$p.dataset.id}=${quantity}`);
        total += parseFloat($p.querySelector("strong").textContent.replace(/\D/g, ""));
        count++;
    });

    $pTotal.textContent = "Ürün Tutarı : " + formatPrice(total) + " (KDV Dahil)";
    total += 150;
    $total.textContent = "Genel Toplam : " + formatPrice(total);

    history.replaceState(null, "", `?${queryParams.join("&")}`);

    let $basketInfo = document.getElementById("basketInfo");
    if (count > 0) {
        $basketInfo.querySelector("div").textContent = count;
        $basketInfo.style.visibility = "visible";
    } else {
        $basketInfo.querySelector("div").textContent = "";
        $basketInfo.style.visibility = "hidden";
    }
}

function formatPrice(price) { return price.toLocaleString("tr-TR") + " TL"; }

let fpc = function () { window.location.href = "/organik-urunler/" + this.dataset.url + ".html" + window.location.search; };


function menuItem(t, u) {
    let x = li(t);
    x.dataset.url = u;
    x.addEventListener("click", function () { window.location.href = x.dataset.url + window.location.search; });
    if (window.location.href.includes(x.dataset.url)) {
        x.style.textDecoration = "underline";
        x.style.fontWeight = "bold";
    }
    return x;
}

function doHeader($body) {
    let $header = document.createElement("header");
    let $logo = getLogo();
    $logo.addEventListener("click", function () { window.location.href = "/index.html" + window.location.search; });
    $header.append($logo);
    $body.insertBefore($header, $body.firstChild);

    updateHtmlDesc(COMPANY.description);
    rmv('#loading');

    let $nav = document.createElement("nav");
    let $menu = document.createElement("menu");
    let m = li("");
    m.append(img("/img/menu.png", "Menü"));
    m.dataset.open = "false";
    m.style.cursor = "pointer";
    m.style.paddingBottom = 0;
    m.addEventListener("click", function () {
        let items = this.parentElement.querySelectorAll("li");
        if (this.dataset.open == "true") {
            this.dataset.open = "false";
            this.firstElementChild.src = "/img/menu.png";
            items.forEach(function (i) { i.className = "close" });
        }
        else {
            this.dataset.open = "true";
            this.firstElementChild.src = "/img/close.png";
            items.forEach(function (i) { i.className = "" });
        }
        this.className = "";
    });

    let m1 = menuItem("Hakımızda", "/hakkimizda.html");
    let m2 = menuItem("Ürünlerimiz", "/urunlerimiz.html");
    let m3 = menuItem("Lezzetimizin Hikayesi", "/lezzetimizin-hikayesi.html");
    let m4 = menuItem("İletişim", "/iletisim.html");
    if (IS_MOBILE) {
        $menu.append(m);
        m1.className = "close";
        m2.className = "close";
        m3.className = "close";
        m4.className = "close";

        if (IS_HOME) {
            $nav.style.height = "133px";
        }
    }

    $menu.append(m1, m2, m3, m4);
    $nav.append($menu);
    $body.append($nav);
    return $header;
}

function doFooter($body) {
    let $f = document.createElement("footer");
    $f.append(imgWithBtn("/img/kahvaltilik-2.jpg", "Ürünlerimizi Görün"));

    let $social = div();
    $social.className = "social";
    $social.append(lnkimg(COMPANY.instagram, "/img/instagram.png", "instagram"),
        lnkimg(COMPANY.facebook, "/img/facebook.png", "facebook"),
        lnkimg(COMPANY.youtube, "/img/linkedin.png", "linkedin"));

    $f.append(
        br(), br(), $social, br(), br(),
        lnk("mailto:" + COMPANY.email, COMPANY.email), p(COMPANY.name + " © " + new Date().getFullYear()), br(),
        lnk("/satis-sozlesmesi.html", "Uzaktan Satış Sözleşmesi"),
        lnk("/kvkk.html", "KVKK Aydınlatma Metni"),
        lnk("/site-haritasi.html", "Site Haritası"), getLogo());

    $body.append($f);
    return $f;
}

function getLogo() {
    let l = img("/logo.jpg", COMPANY.slogan);
    l.className = "logo";
    return l;
}

function updateHtmlDesc(htmlDesc) {
    (async function () {
        let x = document.querySelector('meta[name="description"]');
        if (x) { x.content = htmlDesc; }
        else {
            let m = document.createElement("meta");
            m.name = "description";
            m.content = htmlDesc;
            document.head.append(m);
        }
    })();
}

function getData(d) {
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "/data/" + d + ".json", false);
    xhr.send();

    if (xhr.status === 200) {
        let r = JSON.parse(xhr.responseText);
        return r[d];
    } else {
        console.error("Error fetching " + d + ".json : ", xhr.statusText);
        return null;
    }
}

function lnk(h, t, b = false) {
    let x = document.createElement("a");
    x.href = h;
    x.textContent = t;
    if (b) { x.target = "_blank"; }
    return x;
}

function img(s, t) {
    let x = document.createElement("img");
    x.src = s;
    x.alt = x.title = t;
    return x;
}

function lnkimg(h, s, t) {
    let x = document.createElement("a");
    x.href = h;
    x.target = "_blank";
    let i = img(s, t);
    x.append(i);
    return x;
}

function imgWithBtn(s, t, u) {
    if (u === undefined) { u = "/urunlerimiz.html"; }
    let i = img(s, COMPANY.slogan);
    let b = btn(t);
    b.addEventListener("click", function () { window.location.href = u + window.location.search; });
    let d = div();
    d.className = "bigImg";
    d.append(i, b);
    return d;
}

function em(t) {
    let x = document.createElement("em");
    x.textContent = t;
    return x;
}

function div() { return document.createElement("div"); }

function li(t) {
    let x = document.createElement("li");
    x.textContent = t;
    return x;
}

function h2(t) {
    let x = document.createElement("h2");
    x.textContent = t;
    return x;
}

function h3(t) {
    let x = document.createElement("h3");
    x.textContent = t;
    return x;
}

function p(t, j = false) {
    let x = document.createElement("p");
    x.textContent = t;
    if (j) { x.style.textAlign = "justify"; }
    return x;
}

function article() { return document.createElement("article"); }

function address(ls) {
    let x = document.createElement("address");
    ls.forEach(l => { x.innerHTML += l + "<br/>"; });
    return x;
}

function br() { return document.createElement("br"); }

function btn(t) {
    let x = document.createElement("button");
    x.textContent = t;
    return x;
}

function rmv(i) { rmv2(document.querySelector(i)); }
function rmv2(e) { if (e) { e.remove(); } }

function insertAfter(r, n) { r.insertAdjacentElement("afterend", n); }