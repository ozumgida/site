function doIletisim($m) {
  let a = article();
  let i = img("/static/img/pages/iletisim.jpg", COMPANY.name);
  i.style.objectPosition = "center";
  a.append(h2("İletişim"), i,
    address(COMPANY.address),
    lnk("https://maps.app.goo.gl/4mFyGQx7jfX2S2vh7", "Haritada Gör", true), br(),
    lnk("tel:" + COMPANY.phone.replace(/ /g, ""), COMPANY.phone),
    lnk("mailto:" + COMPANY.email, COMPANY.email), br());
  $m.append(a);
  return a;
}

function doSiteHaritasi($m) {
  let a = article();
  let i = img("/static/img/pages/site-haritasi.jpg", "Site Haritası");
  i.style.objectPosition = "bottom";
  a.append(h2("Site Haritası"), i, br(),
    lnk("/index.html", "Anasayfa"),
    lnk("/urunlerimiz.html", "Ürünlerimiz"),
    lnk("/hakkimizda.html", "Hakkımızda"),
    lnk("/lezzetimizin-hikayesi.html", "Lezzetimizin Hikayesi"),
    lnk("/satis-sozlesmesi.html", "Mesafeli Satış Sözleşmesi"),
    lnk("/kvkk.html", "KVKK Aydınlatma Metni"),
    lnk("/iletisim.html", "İletişim"), br());
  $m.append(a);
  return a;
}

function mi(t, u) {
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

  rmv('#loading');

  let $nav = document.createElement("nav");
  let $menu = document.createElement("menu");
  let m = li("");
  m.append(img("/static/img/menu.png", "Menü"));
  m.dataset.open = "false";
  m.style.cursor = "pointer";
  m.style.paddingBottom = 0;
  m.addEventListener("click", function () {
    let items = this.parentElement.querySelectorAll("li");
    if (this.dataset.open == "true") {
      this.dataset.open = "false";
      this.firstElementChild.src = "/static/img/menu.png";
      items.forEach(function (i) { i.className = "close" });
    }
    else {
      this.dataset.open = "true";
      this.firstElementChild.src = "/static/img/close.png";
      items.forEach(function (i) { i.className = "" });
    }
    this.className = "";
  });

  let m1 = mi("Hakımızda", "/hakkimizda.html");
  let m2 = mi("Ürünlerimiz", "/urunlerimiz.html");
  let m3 = mi("Lezzetimizin Hikayesi", "/lezzetimizin-hikayesi.html");
  let m4 = mi("İletişim", "/iletisim.html");
  if (IS_MOBILE) {
    $menu.append(m);
    m1.className = m2.className = m3.className = m4.className = "close";

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
  $f.append(imgWithBtn("/static/img/pages/footer.jpg", SITE.footSloganBtn, SITE.footSloganLnk, [SITE.footImgSloganStart, SITE.footImgSloganEnd]));

  let $w = lnkimg("tel:" + COMPANY.phone, "/static/img/whatsapp.png", "whatsapp");
  $w.addEventListener("click", function () {
    let phone = COMPANY.phone;
    let message = "Merhaba";
    if (IS_MOBILE) { window.open(`https://wa.me/${phone}?text=${message}`, "_blank"); }
    else { window.open(`https://web.whatsapp.com/send?phone=${phone}&text=${message}`, "_blank"); }
  });

  let $social = div();
  $social.className = "social";
  $social.append(lnkimg(COMPANY.instagram, "/static/img/instagram.png", "instagram"),
    lnkimg(COMPANY.facebook, "/static/img/facebook.png", "facebook"),
    lnkimg(COMPANY.youtube, "/static/img/linkedin.png", "linkedin"),
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
