/* Site behaviour: theme, nav, reveals, WhatsApp forms, fare estimator.
   All business data comes from window.SITE_CONFIG (assets/js/config.js). */
(function () {
  "use strict";
  var C = window.SITE_CONFIG || {};
  var B = C.business || {};
  var doc = document;
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };
  var inr = function (n) { return "₹" + Math.round(n).toLocaleString("en-IN"); };
  var fleet = (C.fleet || []).filter(function (v) { return v.enabled !== false; });
  var dests = C.destinations || [];

  function waLink(text) {
    return "https://wa.me/" + (B.whatsapp || "") + (text ? "?text=" + encodeURIComponent(text) : "");
  }
  function openWA(text) {
    var w = window.open(waLink(text), "_blank", "noopener");
    if (!w) location.href = waLink(text);
  }

  /* ---- theme ---- */
  var tBtn = $(".theme-toggle");
  if (tBtn) {
    var isDark = function () {
      var t = doc.documentElement.getAttribute("data-theme");
      return t ? t === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    };
    var sync = function () { tBtn.setAttribute("aria-pressed", String(isDark())); };
    sync();
    tBtn.addEventListener("click", function () {
      var next = isDark() ? "light" : "dark";
      doc.documentElement.setAttribute("data-theme", next);
      try { localStorage.setItem("theme", next); } catch (e) {}
      sync();
    });
  }

  /* ---- mobile nav ---- */
  var nBtn = $(".nav-toggle"), nav = $("#site-nav");
  if (nBtn && nav) {
    nBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      nBtn.setAttribute("aria-expanded", String(open));
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) { nav.classList.remove("is-open"); nBtn.setAttribute("aria-expanded", "false"); nBtn.focus(); }
    });
  }

  /* ---- bind contact details from config ---- */
  $$("[data-cfg]").forEach(function (el) {
    var v = el.getAttribute("data-cfg").split(".").reduce(function (o, k) { return o ? o[k] : ""; }, C);
    if (v) el.textContent = v;
  });
  $$("a[data-tel]").forEach(function (a) { a.href = "tel:" + B.phone; });
  $$("a[data-mail]").forEach(function (a) { a.href = "mailto:" + B.email; });
  $$("a[data-wa]").forEach(function (a) { a.href = waLink(a.getAttribute("data-wa") || ("Hi " + B.name + ", I'd like a quote for a tempo traveller.")); });
  if (C.ratesAreSample) $$(".js-sample-note").forEach(function (el) { el.hidden = false; });
  $$(".js-year").forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---- rate tables ---- */
  $$("[data-rates]").forEach(function (tb) {
    var v = fleet.filter(function (f) { return f.id === tb.getAttribute("data-rates"); })[0];
    if (!v) return;
    tb.innerHTML = v.seats.map(function (s) {
      var r = v.ratePerKm[s];
      return "<tr><td>" + s + " seater</td><td>" + (r ? inr(r) + "/km" : "On request") + "</td><td>" + inr((r || 0) * (C.pricing.minKmPerDay || 0)) + "</td></tr>";
    }).join("");
  });
  $$(".js-min-km").forEach(function (el) { el.textContent = C.pricing.minKmPerDay; });
  $$(".js-bata").forEach(function (el) { el.textContent = inr(C.pricing.driverBata); });

  /* ---- hero route picker ---- */
  var picker = $(".js-picker");
  if (picker) picker.addEventListener("submit", function (e) {
    e.preventDefault();
    var d = picker.elements.dest.value, g = picker.elements.group.value;
    openWA("Hi " + B.name + ", I'd like a quote for a trip from Bangalore to " + (d || "(destination)") + " for " + (g || "(group size)") + " people. Please share options.");
  });

  /* ---- enquiry form → WhatsApp ---- */
  $$(".js-enquiry").forEach(function (f) {
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!f.reportValidity()) return;
      var v = function (n) { return (f.elements[n] && f.elements[n].value.trim()) || "-"; };
      var msg = [
        "Hi " + B.name + ", I'd like a quote.",
        "Name: " + v("name"),
        "Travel date: " + v("date"),
        "Days: " + v("days"),
        "Pickup: " + v("pickup"),
        "Destination: " + v("destination"),
        "Group size: " + v("group"),
        "Vehicle: " + v("vehicle"),
        v("notes") !== "-" ? "Notes: " + v("notes") : ""
      ].filter(Boolean).join("\n");
      openWA(msg);
    });
  });

  /* ---- populate vehicle / destination selects ---- */
  function vehicleOptions(sel, withAny) {
    if (withAny) sel.add(new Option("Not sure, please suggest", "Not sure"));
    fleet.forEach(function (v) {
      var g = doc.createElement("optgroup"); g.label = v.name;
      v.seats.forEach(function (s) { g.appendChild(new Option(v.short + " · " + s + " seater", v.id + ":" + s)); });
      sel.appendChild(g);
    });
  }
  function destOptions(sel, withOther) {
    dests.forEach(function (d) { sel.add(new Option(d.name + (d.sub ? " (" + d.sub + ")" : ""), d.id)); });
    if (withOther) sel.add(new Option("Other / custom route", "other"));
  }
  $$("select[data-fill='vehicles']").forEach(function (s) { vehicleOptions(s, true); });
  $$("select[data-fill='dests']").forEach(function (s) { destOptions(s, true); });
  // Enquiry form needs readable values, not ids
  $$(".js-enquiry select").forEach(function (s) {
    Array.prototype.forEach.call(s.options, function (o) { if (o.value && o.value !== "other" && o.value !== "Not sure") o.value = o.text; });
  });
  $$(".js-enquiry select[name='destination'] option[value='other']").forEach(function (o) { o.value = o.text; });
  $$("select[data-preset]").forEach(function (s) {
    var p = s.getAttribute("data-preset");
    var hit = Array.prototype.filter.call(s.options, function (o) { return o.value === p || o.value.indexOf(p + ":") === 0 || o.text.indexOf(p) === 0; })[0];
    if (hit) s.value = hit.value;
  });

  /* ---- fare estimator ---- */
  $$(".js-estimator").forEach(function (root) {
    var vSel = $("[name='vehicle']", root), dSel = $("[name='dest']", root), days = $("[name='days']", root), kmIn = $("[name='km']", root), kmRow = $(".js-km-row", root);
    vehicleOptions(vSel, false); destOptions(dSel, true);
    if (vSel.getAttribute("data-preset")) { var pv = vSel.getAttribute("data-preset"); var o = Array.prototype.filter.call(vSel.options, function (x) { return x.value === pv || x.value.indexOf(pv + ":") === 0; })[0]; if (o) vSel.value = o.value; }
    if (dSel.getAttribute("data-preset")) dSel.value = dSel.getAttribute("data-preset");
    var out = {
      total: $(".js-total", root), km: $(".js-bill-km", root), rate: $(".js-rate", root), base: $(".js-base", root), bata: $(".js-bata-total", root), wa: $(".js-est-wa", root)
    };
    function dest() { return dests.filter(function (d) { return d.id === dSel.value; })[0]; }
    function suggestDays() {
      var d = dest(); if (!d) return;
      var m = /(\d+)D/.exec(d.trip); if (m) days.value = m[1];
    }
    function calc() {
      var parts = vSel.value.split(":"), v = fleet.filter(function (f) { return f.id === parts[0]; })[0];
      var seats = +parts[1], rate = v ? v.ratePerKm[seats] || 0 : 0;
      var d = dest(), n = Math.max(1, Math.min(30, +days.value || 1));
      kmRow.hidden = !!d;
      var oneWay = d ? d.km : (+kmIn.value || 0);
      var bill = Math.max(oneWay * 2, (C.pricing.minKmPerDay || 0) * n);
      var base = bill * rate, bata = (C.pricing.driverBata || 0) * n;
      out.total.textContent = inr(base + bata);
      out.km.textContent = bill.toLocaleString("en-IN") + " km";
      out.rate.textContent = inr(rate) + "/km";
      out.base.textContent = inr(base);
      out.bata.textContent = inr(bata) + " (" + n + (n > 1 ? " days)" : " day)");
      out.wa.href = waLink("Hi " + B.name + ", I used your fare estimator: " + (v ? v.short + " " + seats + " seater" : "") + ", " + (d ? "Bangalore to " + d.name : oneWay + " km one way") + ", " + n + " days. Indicative fare " + inr(base + bata) + ". Please confirm the final quote.");
    }
    dSel.addEventListener("change", function () { suggestDays(); calc(); });
    [vSel, days, kmIn].forEach(function (el) { el.addEventListener("input", calc); });
    if (!days.value) suggestDays();
    calc();
  });

  /* ---- share ---- */
  $$(".js-share-native").forEach(function (b) {
    if (!navigator.share) { b.hidden = true; return; }
    b.hidden = false;
    b.addEventListener("click", function () { navigator.share({ title: doc.title, url: location.href }).catch(function () {}); });
  });
  $$(".js-copy").forEach(function (b) {
    b.addEventListener("click", function () {
      var done = function () { var t = b.textContent; b.textContent = "Link copied"; setTimeout(function () { b.textContent = t; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(done); else done();
    });
  });

  /* ---- scroll reveal ---- */
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rev = $$(".reveal");
  if (reduce || !("IntersectionObserver" in window)) rev.forEach(function (el) { el.classList.add("is-in"); });
  else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    rev.forEach(function (el) { io.observe(el); });
  }
})();
