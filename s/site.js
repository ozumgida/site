var PRODUCTS;
var COMPANY;
var SITE;
var BASKET = [];

var IS_MOBILE = /Mobi|Android/i.test(navigator.userAgent) && window.innerWidth < 768;
var IS_HOME = window.location.pathname == "/" || window.location.pathname.includes("/index.html");

function doProductInner($p, product, isLinked) {
    let $img = img("", product.name);
    $img.src = "/organik-urunler/" + product.url + ".jpg";
    $p.append($img);

    let $name = h2(product.name);
    $img.dataset.url = $name.dataset.url = product.url;
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
}

function doProduct(product, isLinked = true) {
    let $p = document.createElement("li");
    $p.dataset.id = product.id;

    doProductInner($p, product, isLinked);

    let $btn = btn("Sepete Ekle");
    $btn.className = "btnAddToBasket";
    $btn.addEventListener("click", fnAddToBasket);
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
    SITE = getData("site");

    let $body = document.body;
    doHeader($body);

    let $m = document.createElement("main");
    if (IS_HOME) {
        let part = imgWithBtn("/img/kahvaltilik-1.jpg", SITE.headSloganBtn, SITE.headSloganLnk, [SITE.headImgSloganStart, SITE.headImgSloganEnd]);
        if (IS_MOBILE) { part.style.marginTop = "-135px"; }
        else { part.style.marginTop = "-55px"; }
        $body.append(part);
    }
    else { $m.append(h3(COMPANY.slogan)); }

    $body.append($m);
    doBasket($body, doFooter($body));

    if (window.location.href.includes("/hakkimizda.html")) { doAbout($m); }
    if (window.location.href.includes("/iletisim.html")) { doIletisim($m); }
    if (window.location.href.includes("/site-haritasi.html")) { doSiteHaritasi($m); }
    if (window.location.href.includes("/kvkk.html")) { doKVKK($m); }
    if (window.location.href.includes("/satis-sozlesmesi.html")) { doSozlesme($m); }
    if (window.location.href.includes("/lezzetimizin-hikayesi.html")) { doLezzetimizinHikayesi($m); }

    if (window.location.href.includes("/organik-urunler/")) {
        let pun = window.location.href.split("/").pop().split(".")[0];
        let product = PRODUCTS.find(p => p.url === pun);
        if (product) {
            document.title = product.name + " | " + COMPANY.name;
            let a = article();
            a.className = "prd";
            a.append(doProduct(product, false), p(product.longDesc.join(" "), true));
            $m.append(a);
        } else { console.error("Product not found: " + pun); }
    }

    if (window.location.href.includes("/urunlerimiz.html")) { document.title = "Ürünlerimiz | " + COMPANY.name; doProducts($m, false); }
    else { doProducts($m); }

    setTimeout(function () {
        let prms = new URLSearchParams(window.location.search);
        for (let [key, value] of prms.entries()) {
            let product = PRODUCTS.find(p => p.id === key);
            if (product) { addToBasket(key, parseInt(value)); }
        }
    }, 987);
});

function changeBtnAddToBasket(parent, display) {
    let btn = parent.querySelector(".btnAddToBasket");
    if (btn) {
        btn.style.display = display;
        rmAfter(btn);
    }
    return btn;
}

function basketAdder(prevElem, prdId) {
    let existing = BASKET.find(p => p.id == prdId);

    let $q = em(existing.quantity + " Adet");

    let mbs = existing.quantity > 1 ? "minus" : "delete";
    let mbs2 = existing.quantity > 1 ? "çıkart" : "sil";
    let $mb = img("/img/" + mbs + ".png", mbs2);
    $mb.addEventListener("click", function () {
        if (existing.quantity > 1) { decreaseBasket(prdId, existing.quantity); }
        else {
            changeBtnAddToBasket($mb.parentElement, "inline-block");
            removeFromBasket(prdId);
        }
    });

    let $pb = img("/img/plus.png", "ekle");
    $mb.className = $pb.className = "bskbtn";
    $pb.addEventListener("click", function () { addToBasket(prdId); });

    insertAfter(prevElem, $pb);
    insertAfter(prevElem, $q);
    insertAfter(prevElem, $mb);
}

function fnAddToBasket() {
    this.style.display = "none";
    let x = p("Sepete Eklendi");
    x.style.marginBottom = "5px";
    insertAfter(this, x);

    let prdId = this.parentElement.dataset.id;
    addToBasket(prdId);
    basketAdder(x, prdId);
}

function addToBasket(prdId, quantity) {
    let db = PRODUCTS.find(p => p.id == prdId);
    if (quantity == undefined) { quantity = 1; }

    let existing = BASKET.find(p => p.id == db.id);
    if (existing) { BASKET = BASKET.map(p => p.id === existing.id ? { ...p, quantity: existing.quantity + 1 } : p); }
    else { BASKET.push({ id: db.id, name: db.name, url: db.url, price: db.price, quantity: quantity }); }

    refreshBasket();
}

function decreaseBasket(prdId, quantity) {
    BASKET = BASKET.map(p => p.id === prdId ? { ...p, quantity: quantity - 1 } : p);
    refreshBasket();
}

function removeFromBasket(prdId) {
    BASKET = BASKET.filter(p => p.id !== prdId);
    refreshBasket();

    let productInList = document.querySelector("#products li[data-id='" + prdId + "']");
    if (productInList) { changeBtnAddToBasket(productInList, "inline-block"); }

    let productBig = document.querySelector(".prd > li[data-id='" + prdId + "']");
    if (productBig) { changeBtnAddToBasket(productBig, "inline-block"); }
}

function refreshBasket() {
    let total = 0;
    let qp = [];
    BASKET.forEach(function (p) {
        qp.push(`${p.id}=${p.quantity}`);
        total += p.quantity * p.price;
    });
    history.replaceState(null, "", `?${qp.join("&")}`);

    let $bi = document.getElementById("basketInfo");
    if (BASKET.length > 0) {
        $bi.querySelector("div").textContent = BASKET.reduce((sum, item) => sum + item.quantity, 0);
        $bi.style.visibility = "visible";
    } else {
        $bi.querySelector("div").textContent = "";
        $bi.style.visibility = "hidden";
    }

    let $ul = document.querySelector("#basket ul");
    $ul.innerHTML = "";
    rmAfter($ul);

    if (BASKET.length > 0) {
        let $b = document.querySelector("#basket");
        let $pTotal = p("");
        $pTotal.id = "pTotal";
        $pTotal.textContent = "Ürün Tutarı : " + formatPrice(total) + " (KDV Dahil)";
        $b.appendChild($pTotal);

        let $cargo = p("Kargo Ücreti: 150 TL");
        $b.appendChild($cargo);

        let $total = p("");
        $total.id = "total";
        $total.textContent = "Genel Toplam : " + formatPrice(total + 150);
        $b.appendChild($total);

        let $bw = btn("Whatsapp'dan Siparişini İlet");
        $bw.id = "btnOrderFromWhatsapp";
        $bw.addEventListener("click", function () {
            let phone = COMPANY.phone;
            let message = "Merhaba,\n\n";
            BASKET.forEach(function (p) { message += `${p.quantity} ${p.name}\n`; });
            message += "\nSatın almak istiyorum.";

            let encoded = encodeURIComponent(message);
            if (IS_MOBILE) { window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank"); }
            else { window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${encoded}`, "_blank"); }
        });
        $b.appendChild($bw);

        BASKET.forEach(function (p) {
            let $li = li();
            let $db = img("/img/delete.png", "sil");
            $db.className = "btnDelete";
            $db.addEventListener("click", function () { removeFromBasket(p.id); });
            $li.append($db);

            doProductInner($li, p, true);
            basketAdder($li.lastElementChild, p.id);

            $ul.append($li);

            let productInList = document.querySelector("#products li[data-id='" + p.id + "']");
            if (productInList) { basketAdder(changeBtnAddToBasket(productInList, "none"), p.id); }

            let productBig = document.querySelector(".prd > li[data-id='" + p.id + "']");
            if (productBig) { basketAdder(changeBtnAddToBasket(productBig, "none"), p.id); }
        });
    }

    showBasket();
}

function doBasket($body, $f) {
    let bi = div();
    bi.id = "basketInfo";
    bi.append(div(), img("/img/basket.png", "Sepet"));
    bi.addEventListener("click", function () {
        window.location.href = "#basket";
        showBasket();
    });
    $body.append(bi);

    let $b = div();
    $b.id = "basket";
    $b.append(p(SITE.basketWarning));

    let $bs = btn("Sepeti Göster");
    $bs.id = "btnShowBasket";
    $bs.addEventListener("click", function () {
        if ($bs.dataset.active === "true") { hideBasket(); }
        else { showBasket(); }
    });
    $b.append($bs);
    $b.append(document.createElement("ul"));

    $body.insertBefore($b, $f);
    hideBasket();
}

function showBasket() {
    let p = document.getElementById("basket");
    let b = document.getElementById("btnShowBasket");
    b.dataset.active = "true";
    b.innerHTML = "Sepeti Gizle";
    p.style.height = "fit-content";
}

function hideBasket() {
    let p = document.getElementById("basket");
    let b = document.getElementById("btnShowBasket");
    b.dataset.active = "false";
    b.innerHTML = "Sepeti Göster";
    p.style.height = IS_MOBILE ? "230px" : "160px";
}

function formatPrice(price) { return price.toLocaleString("tr-TR") + " TL"; }

function fpc() { window.location.href = "/organik-urunler/" + this.dataset.url + ".html" + window.location.search; };


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
    $f.append(imgWithBtn("/img/kahvaltilik-2.jpg", SITE.footSloganBtn, SITE.footSloganLnk, [SITE.footImgSloganStart, SITE.footImgSloganEnd]));

    let $w = lnkimg("tel:" + COMPANY.phone, "/img/whatsapp.png", "whatsapp");
    $w.addEventListener("click", function () {
        let phone = COMPANY.phone;
        let message = "Merhaba";
        if (IS_MOBILE) { window.open(`https://wa.me/${phone}?text=${message}`, "_blank"); }
        else { window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${message}`, "_blank"); }
    });

    let $social = div();
    $social.className = "social";
    $social.append(lnkimg(COMPANY.instagram, "/img/instagram.png", "instagram"),
        lnkimg(COMPANY.facebook, "/img/facebook.png", "facebook"),
        lnkimg(COMPANY.youtube, "/img/linkedin.png", "linkedin"),
        $w);

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

function imgWithBtn(s, t, u, l) {
    let i = img(s, COMPANY.slogan);
    let ld = div();
    let b = btn(t);
    b.addEventListener("click", function () { window.location.href = u + window.location.search; });
    ld.append(em(l[0]), em(l[1]), b);
    let d = div();
    d.className = "bigImg";
    d.append(i, ld);
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

function btni(s, t) {
    let x = document.createElement("button");
    x.append(img(s, t));
    return x;
}

function rmv(i) { rmv2(document.querySelector(i)); }
function rmv2(e) { if (e) { e.remove(); } }
function rmAfter(e) {
    if (!e) { return; }
    let removing = [];
    let sib = e.nextSibling;
    while (sib) {
        removing.push(sib);
        sib = sib.nextSibling;
    }
    removing.forEach(el => el.remove());
}

function insertAfter(r, n) { r.insertAdjacentElement("afterend", n); }