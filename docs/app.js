(function () {
  "use strict";

  var DATA = window.SANDBOX_DATA;
  if (!DATA || !Array.isArray(DATA.products)) return;
  var products = DATA.products;

  var FREE_TYPES = {
    recurring: { label: "周期性免费", tone: "mint" },
    credit: { label: "一次性额度", tone: "blue" },
    promo: { label: "推广期免费", tone: "lime" },
    anonymous: { label: "免注册试用", tone: "amber" },
    always: { label: "永久免费", tone: "coral" }
  };

  var CATEGORIES = {
    agent: { label: "Agent 沙箱" },
    dev: { label: "开发环境" },
    vm: { label: "永久 VM" }
  };

  var CARD = {
    no: { label: "无需绑卡", className: "card-no" },
    optional: { label: "可不绑卡", className: "card-optional" },
    yes: { label: "需绑卡验证", className: "card-yes" }
  };

  var FILTERS = {
    all: function () { return true; },
    "no-card": function (p) { return p.card === "no"; },
    "no-signup": function (p) { return p.freeType === "anonymous"; },
    recurring: function (p) { return p.freeType === "recurring" || p.freeType === "always"; },
    credit: function (p) { return p.freeType === "credit"; },
    promo: function (p) { return p.freeType === "promo"; },
    agent: function (p) { return p.category === "agent"; },
    dev: function (p) { return p.category === "dev"; },
    vm: function (p) { return p.category === "vm"; }
  };

  var state = {
    query: "",
    filter: "all",
    sort: "rank",
    expanded: new Set()
  };

  var searchInput = document.getElementById("search");
  var sortSelect = document.getElementById("sort");
  var tableBody = document.getElementById("table-body");
  var mobileList = document.getElementById("mobile-list");
  var tableShell = document.getElementById("table-shell");
  var emptyState = document.getElementById("empty");
  var resultCount = document.getElementById("result-count");

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  function toneOf(p) {
    return FREE_TYPES[p.freeType].tone;
  }

  function typeBadge(p) {
    var type = FREE_TYPES[p.freeType];
    return '<span class="type-badge tone-' + type.tone + '"><i></i>' + type.label + "</span>";
  }

  function cardBadge(p) {
    var card = CARD[p.card];
    return '<span class="card-badge ' + card.className + '">' + card.label + "</span>";
  }

  function scoreBars(label, value) {
    var fullLabel = label === "上手" ? "上手便捷" : "免费力度";
    var bars = "";
    for (var i = 0; i < 5; i++) {
      bars += '<i class="bar' + (i < value ? " filled" : "") + '"></i>';
    }
    return '<div class="score-row">' +
      '<span class="score-label">' + label + "</span>" +
      '<span class="score-bars" role="img" aria-label="' + fullLabel + " " + value + '/5" title="' + fullLabel + " " + value + '/5">' + bars + "</span>" +
      "</div>";
  }

  function detailHTML(p) {
    var links = p.links.map(function (link) {
      return '<a class="link-pill" href="' + escapeHTML(link.url) + '" target="_blank" rel="noopener">' +
        escapeHTML(link.label) + ' <span>↗</span></a>';
    }).join("");

    var caveats = p.caveats.map(function (item) {
      return "<li>" + escapeHTML(item) + "</li>";
    }).join("");

    var quickstart = p.quickstart ? (
      '<div class="quickstart">' +
        '<span class="quickstart-label">QUICKSTART</span>' +
        '<div class="code-chip">' +
          "<code>" + escapeHTML(p.quickstart) + "</code>" +
          '<button class="copy-btn" type="button" data-copy="' + escapeHTML(p.quickstart) + '">复制</button>' +
        "</div>" +
      "</div>"
    ) : "";

    return '<div class="detail">' +
      '<div class="detail-head">' +
        "<div>" +
          '<p class="detail-tagline">' + escapeHTML(p.tagline) + "</p>" +
          '<div class="detail-meta">' + typeBadge(p) + cardBadge(p) +
            '<span class="verified">' + CATEGORIES[p.category].label + " · 核实于 " + escapeHTML(p.verified) + "</span>" +
          "</div>" +
        "</div>" +
        quickstart +
      "</div>" +
      '<div class="detail-grid">' +
        '<div class="detail-item"><span class="detail-label">免费额度</span><p>' + escapeHTML(p.freeQuota) + "。" + escapeHTML(p.quotaNote) + "</p></div>" +
        '<div class="detail-item"><span class="detail-label">启动速度</span><p>' + escapeHTML(p.speed) + "</p></div>" +
        '<div class="detail-item"><span class="detail-label">生命周期</span><p>' + escapeHTML(p.session) + "</p></div>" +
        '<div class="detail-item"><span class="detail-label">持久化</span><p>' + escapeHTML(p.persistence) + "</p></div>" +
        '<div class="detail-item"><span class="detail-label">API / CLI</span><p>' + escapeHTML(p.api) + "</p></div>" +
        '<div class="detail-item"><span class="detail-label">适合场景</span><p>' + escapeHTML(p.bestFor) + "</p></div>" +
      "</div>" +
      '<div class="caveat-block">' +
        '<span class="detail-label">注意</span>' +
        '<ul class="caveat-list">' + caveats + "</ul>" +
      "</div>" +
      '<div class="detail-links">' + links + "</div>" +
    "</div>";
  }

  function toggleButton(p, open, controls) {
    return '<button class="toggle" type="button" data-toggle="' + p.id + '" data-name="' + escapeHTML(p.name) + '" ' +
      'aria-expanded="' + open + '" aria-controls="' + controls + '" ' +
      'aria-label="' + (open ? "收起 " : "展开 ") + escapeHTML(p.name) + ' 详情">' +
      '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v12M2 8h12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>' +
    "</button>";
  }

  function tableRow(p) {
    var open = state.expanded.has(p.id);
    var tone = toneOf(p);
    return '<tr class="product-row' + (open ? " is-open" : "") + '" data-id="' + p.id + '">' +
      "<td>" +
        '<div class="product-inner">' +
          '<span class="monogram tone-' + tone + '">' + escapeHTML(p.initials) + "</span>" +
          '<div class="product-text">' +
            '<span class="product-name">' + escapeHTML(p.name) + "</span>" +
            '<span class="product-tagline" title="' + escapeHTML(p.tagline) + '">' + escapeHTML(p.tagline) + "</span>" +
          "</div>" +
        "</div>" +
      "</td>" +
      "<td>" + typeBadge(p) + "</td>" +
      "<td><div class=\"quota-main\">" + escapeHTML(p.freeQuota) + "</div><div class=\"quota-note\">" + escapeHTML(p.quotaNote) + "</div></td>" +
      "<td><div class=\"spec-main\">" + escapeHTML(p.specs) + "</div><div class=\"spec-note\">" + escapeHTML(p.specsNote) + "</div></td>" +
      "<td><div class=\"signup-main\">" + escapeHTML(p.signup) + "</div>" + cardBadge(p) + "</td>" +
      '<td class="score-cell">' + scoreBars("上手", p.ease) + scoreBars("免费", p.freeScore) + "</td>" +
      '<td class="toggle-cell">' + toggleButton(p, open, "detail-" + p.id + "-desktop") + "</td>" +
    "</tr>" +
    '<tr class="detail-row" id="detail-' + p.id + '-desktop"' + (open ? "" : " hidden") + ">" +
      '<td colspan="7">' + detailHTML(p) + "</td>" +
    "</tr>";
  }

  function mobileCard(p) {
    var open = state.expanded.has(p.id);
    var tone = toneOf(p);
    return '<article class="m-card" data-id="' + p.id + '">' +
      '<div class="m-head">' +
        '<span class="monogram tone-' + tone + '">' + escapeHTML(p.initials) + "</span>" +
        "<div>" +
          '<div class="m-name">' + escapeHTML(p.name) + "</div>" +
          '<div class="m-tagline">' + escapeHTML(p.tagline) + "</div>" +
        "</div>" +
        toggleButton(p, open, "detail-" + p.id + "-mobile") +
      "</div>" +
      '<div class="m-badges">' + typeBadge(p) + cardBadge(p) + "</div>" +
      '<div class="m-grid">' +
        '<div class="m-field"><div class="m-field-label">免费额度</div><div class="m-field-value">' + escapeHTML(p.freeQuota) + '<br><span class="quota-note">' + escapeHTML(p.quotaNote) + "</span></div></div>" +
        '<div class="m-field"><div class="m-field-label">单机配置</div><div class="m-field-value">' + escapeHTML(p.specs) + '<br><span class="quota-note">' + escapeHTML(p.specsNote) + "</span></div></div>" +
        '<div class="m-field"><div class="m-field-label">注册门槛</div><div class="m-field-value">' + escapeHTML(p.signup) + "</div></div>" +
        '<div class="m-field"><div class="m-field-label">上手 / 免费</div><div class="m-field-value">' + scoreBars("上手", p.ease) + scoreBars("免费", p.freeScore) + "</div></div>" +
      "</div>" +
      '<div class="m-detail" id="detail-' + p.id + '-mobile"' + (open ? "" : " hidden") + ">" + detailHTML(p) + "</div>" +
    "</article>";
  }

  function getFiltered() {
    var query = state.query.trim().toLowerCase();
    var list = products.filter(function (p) {
      return FILTERS[state.filter](p);
    });

    if (query) {
      list = list.filter(function (p) {
        var haystack = [
          p.name,
          p.tagline,
          p.freeQuota,
          p.quotaNote,
          p.specs,
          p.specsNote,
          p.signup,
          p.bestFor,
          p.api,
          p.session,
          p.persistence,
          p.speed,
          (p.caveats || []).join(" "),
          CATEGORIES[p.category].label,
          FREE_TYPES[p.freeType].label,
          CARD[p.card].label
        ].join(" ").toLowerCase();
        return haystack.indexOf(query) !== -1;
      });
    }

    var sorted = list.slice();
    if (state.sort === "free") {
      sorted.sort(function (a, b) { return b.freeScore - a.freeScore || a.rank - b.rank; });
    } else if (state.sort === "ease") {
      sorted.sort(function (a, b) { return b.ease - a.ease || a.rank - b.rank; });
    } else if (state.sort === "name") {
      sorted.sort(function (a, b) { return a.name.localeCompare(b.name, "en"); });
    } else {
      sorted.sort(function (a, b) { return a.rank - b.rank; });
    }
    return sorted;
  }

  function render() {
    var list = getFiltered();
    tableBody.innerHTML = list.map(tableRow).join("");
    mobileList.innerHTML = list.map(mobileCard).join("");

    resultCount.textContent = "显示 " + list.length + " / " + products.length;
    var hasResults = list.length > 0;
    tableShell.hidden = !hasResults;
    mobileList.hidden = !hasResults;
    emptyState.hidden = hasResults;
  }

  function updateDates() {
    var updated = DATA.updated || "";
    if (!updated) return;
    var short = updated.slice(5).replace("-", ".");
    var fulls = document.querySelectorAll('[data-updated="full"]');
    for (var i = 0; i < fulls.length; i++) fulls[i].textContent = updated;
    var shorts = document.querySelectorAll('[data-updated="short"]');
    for (var j = 0; j < shorts.length; j++) shorts[j].textContent = short;
  }

  function updateCounts() {
    var counts = {
      all: products.length,
      "no-card": products.filter(FILTERS["no-card"]).length,
      "no-signup": products.filter(FILTERS["no-signup"]).length,
      recurring: products.filter(FILTERS.recurring).length,
      credit: products.filter(FILTERS.credit).length,
      promo: products.filter(FILTERS.promo).length,
      agent: products.filter(FILTERS.agent).length,
      dev: products.filter(FILTERS.dev).length,
      vm: products.filter(FILTERS.vm).length
    };

    Object.keys(counts).forEach(function (key) {
      var el = document.querySelector('[data-count="' + key + '"]');
      if (el) el.textContent = counts[key];
    });

    var total = document.querySelectorAll('[data-stat="total"]');
    for (var i = 0; i < total.length; i++) total[i].textContent = products.length;

    var noCard = document.querySelectorAll('[data-stat="no-card"]');
    for (var j = 0; j < noCard.length; j++) noCard[j].textContent = counts["no-card"];

    var typeCount = new Set(products.map(function (p) { return p.freeType; })).size;
    var types = document.querySelectorAll('[data-stat="types"]');
    for (var k = 0; k < types.length; k++) types[k].textContent = typeCount;

    var typeCounters = document.querySelectorAll("[data-type-count]");
    for (var m = 0; m < typeCounters.length; m++) {
      var type = typeCounters[m].getAttribute("data-type-count");
      typeCounters[m].textContent = products.filter(function (p) { return p.freeType === type; }).length;
    }
  }

  function setFilter(filter) {
    state.filter = filter;
    var chips = document.querySelectorAll(".chip");
    for (var i = 0; i < chips.length; i++) {
      var active = chips[i].getAttribute("data-filter") === filter;
      chips[i].classList.toggle("is-active", active);
      chips[i].setAttribute("aria-pressed", String(active));
    }
  }

  function toggleDetail(id) {
    var open = !state.expanded.has(id);
    if (open) {
      state.expanded.add(id);
    } else {
      state.expanded.delete(id);
    }

    var row = document.querySelector('.product-row[data-id="' + id + '"]');
    var desktopDetail = document.getElementById("detail-" + id + "-desktop");
    var mobileDetail = document.getElementById("detail-" + id + "-mobile");
    var toggles = document.querySelectorAll('[data-toggle="' + id + '"]');

    if (row) row.classList.toggle("is-open", open);
    if (desktopDetail) desktopDetail.hidden = !open;
    if (mobileDetail) mobileDetail.hidden = !open;

    for (var i = 0; i < toggles.length; i++) {
      toggles[i].setAttribute("aria-expanded", String(open));
      toggles[i].setAttribute(
        "aria-label",
        (open ? "收起 " : "展开 ") + (toggles[i].getAttribute("data-name") || "产品") + " 详情"
      );
    }
  }

  function copyText(button) {
    var text = button.getAttribute("data-copy") || "";
    function done() {
      button.textContent = "已复制";
      button.classList.add("copied");
      window.setTimeout(function () {
        button.textContent = "复制";
        button.classList.remove("copied");
      }, 1400);
    }
    function fallback() {
      var area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      try {
        document.execCommand("copy");
        done();
      } catch (e) {}
      document.body.removeChild(area);
    }

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done).catch(fallback);
    } else {
      fallback();
    }
  }

  searchInput.addEventListener("input", function (event) {
    state.query = event.target.value;
    render();
  });

  sortSelect.addEventListener("change", function (event) {
    state.sort = event.target.value;
    render();
  });

  document.querySelector(".chips").addEventListener("click", function (event) {
    var chip = event.target.closest(".chip");
    if (!chip) return;
    setFilter(chip.getAttribute("data-filter"));
    render();
  });

  document.addEventListener("click", function (event) {
    var toggle = event.target.closest("[data-toggle]");
    if (toggle) {
      toggleDetail(toggle.getAttribute("data-toggle"));
      return;
    }

    var copy = event.target.closest("[data-copy]");
    if (copy) {
      copyText(copy);
    }
  });

  var focusButtons = document.querySelectorAll("[data-focus]");
  for (var f = 0; f < focusButtons.length; f++) {
    focusButtons[f].addEventListener("click", function (event) {
      var id = event.currentTarget.getAttribute("data-focus");
      var product = products.filter(function (p) { return p.id === id; })[0];
      if (!product) return;
      state.query = product.name;
      searchInput.value = product.name;
      setFilter("all");
      state.expanded.add(id);
      render();
      document.getElementById("list").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  var themeButton = document.getElementById("theme-toggle");
  var themeColorMeta = document.querySelector('meta[name="theme-color"]');
  function syncThemeLabel() {
    var root = document.documentElement;
    var explicit = root.getAttribute("data-theme");
    var isLight = explicit === "light" ||
      (!explicit && window.matchMedia("(prefers-color-scheme: light)").matches);
    themeButton.setAttribute("aria-label", isLight ? "切换到深色" : "切换到浅色");
    if (themeColorMeta) {
      themeColorMeta.setAttribute("content", isLight ? "#f3f1e9" : "#07090b");
    }
  }

  themeButton.addEventListener("click", function () {
    var root = document.documentElement;
    var explicit = root.getAttribute("data-theme");
    var isLight = explicit === "light" ||
      (!explicit && window.matchMedia("(prefers-color-scheme: light)").matches);
    var next = isLight ? "dark" : "light";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("sandbox-theme", next);
    } catch (e) {}
    syncThemeLabel();
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
    var tag = document.activeElement && document.activeElement.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    event.preventDefault();
    searchInput.focus();
  });

  updateDates();
  updateCounts();
  render();
  syncThemeLabel();
})();
