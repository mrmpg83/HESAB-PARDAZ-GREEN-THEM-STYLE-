  function openDrawer(){
    document.getElementById('mdrawer').classList.add('open');
    document.getElementById('mbackdrop').classList.add('open');
    document.body.style.overflow='hidden';
  }
  function closeDrawer(){
    document.getElementById('mdrawer').classList.remove('open');
    document.getElementById('mbackdrop').classList.remove('open');
    document.body.style.overflow='';
  }
  document.querySelectorAll('.mobile-drawer a').forEach(function(a){
    a.addEventListener('click', closeDrawer);
  });
  /* ---------- دکمه بازگشت به بالا ---------- */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener(
      'scroll',
      function () {
        if (window.scrollY > 480) {
          backToTop.classList.add('show');
        } else {
          backToTop.classList.remove('show');
        }
      },
      { passive: true }
    );
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  // استاد جان از این بخش به پایین برای قسمت و صفحه انتخاب آیتم هست
  document.addEventListener('DOMContentLoaded', function () {

  var DATA = {
    bazargani: {
      label: "بازرگانی",
      desc: "فروشگاه‌ها و کسب‌وکارهای خرید و فروش کالا",
      base: 40000000,
      baseLabel: "پلن پایه بازرگانی",
      items: [
        {id:'inv', name:'مدیریت انبار و موجودی کالا', desc:'ثبت و پیگیری موجودی به تفکیک کالا', price:10000000},
        {id:'barcode', name:'اتصال بارکد خوان', desc:'ثبت فروش با اسکن بارکد', price:8000000},
        {id:'excel', name:'خروجی و ورودی اکسل', desc:'خروجی گزارش‌ها و ورود دسته‌جمعی اطلاعات', price:6000000},
        {id:'bank', name:'همگام‌سازی بانکی', desc:'اتصال خودکار حساب بانکی', price:15000000},
        {id:'site', name:'اتصال به سایت فروشگاهی', desc:'سینک لحظه‌ای فروش و موجودی با سایت', price:25000000},
        {id:'branch', name:'مدیریت چند شعبه و چند انبار', desc:'برای فروشگاه‌های با چند شعبه', price:20000000},
        {id:'report', name:'گزارش‌های پیشرفته و سفارشی', desc:'گزارش‌گیری تحلیلی اختصاصی', price:12000000}
      ]
    },
    towlidi: {
      label: "تولیدی",
      desc: "کارگاه‌ها و شرکت‌های تولیدی و صنعتی",
      base: 60000000,
      baseLabel: "پلن پایه تولیدی",
      items: [
        {id:'bom', name:'مدیریت مواد اولیه و فرمول تولید', desc:'تعریف اقلام مصرفی هر محصول (BOM)', price:18000000},
        {id:'cost', name:'محاسبه بهای تمام‌شده تولید', desc:'محاسبه خودکار هزینه هر واحد محصول', price:15000000},
        {id:'line', name:'مدیریت خط تولید', desc:'پیگیری مراحل تولید تا محصول نهایی', price:20000000},
        {id:'barcode', name:'اتصال بارکد خوان', desc:'ثبت ورود و خروج مواد با اسکن', price:8000000},
        {id:'bank', name:'همگام‌سازی بانکی', desc:'اتصال خودکار حساب بانکی', price:15000000},
        {id:'report', name:'گزارش‌های پیشرفته و سفارشی', desc:'گزارش‌گیری تحلیلی اختصاصی', price:12000000}
      ]
    },
    khadamati: {
      label: "خدماتی",
      desc: "شرکت‌های خدماتی، مشاوره‌ای و پروژه‌محور",
      base: 30000000,
      baseLabel: "پلن پایه خدماتی",
      items: [
        {id:'contract', name:'مدیریت قراردادها', desc:'ثبت و پیگیری قراردادهای مشتریان', price:10000000},
        {id:'invoice', name:'صدور فاکتور خدماتی', desc:'فاکتور اختصاصی برای خدمات', price:5000000},
        {id:'project', name:'مدیریت پروژه و ساعت کاری', desc:'ثبت ساعت کار تیم روی هر پروژه', price:12000000},
        {id:'bank', name:'همگام‌سازی بانکی', desc:'اتصال خودکار حساب بانکی', price:15000000},
        {id:'booking', name:'اتصال به سایت رزرو آنلاین', desc:'سینک نوبت‌ها و پرداخت‌های آنلاین', price:18000000},
        {id:'report', name:'گزارش‌های پیشرفته و سفارشی', desc:'گزارش‌گیری تحلیلی اختصاصی', price:12000000}
      ]
    }
  };

  var currentCat = 'bazargani';

  // selections persist independently per category, so switching category never clears them
  var state = {
    bazargani: { base:false, items:new Set() },
    towlidi:   { base:false, items:new Set() },
    khadamati: { base:false, items:new Set() }
  };

  var faDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  function toFa(num){
    return num.toLocaleString('en-US').replace(/[0-9]/g, function(d){ return faDigits[d]; });
  }

  var catListEl = document.getElementById('catList');
  var itemsListEl = document.getElementById('itemsList');
  var itemsTitleEl = document.getElementById('itemsTitle');
  var baseBadgeEl = document.getElementById('baseBadge');
  var summaryListEl = document.getElementById('summaryList');
  var totalPriceEl = document.getElementById('totalPrice');

  function catSelectionCount(key){
    return state[key].items.size + (state[key].base ? 1 : 0);
  }

  function renderCategories(){
    var html = '';
    Object.keys(DATA).forEach(function(key){
      var cat = DATA[key];
      var count = catSelectionCount(key);
      html += '<button type="button" class="cat-btn' + (key === currentCat ? ' active' : '') + '" data-cat="' + key + '">' +
        '<b>' + cat.label + (count > 0 ? ' <span class="cat-count">' + toFa(count) + ' مورد</span>' : '') + '</b>' +
        '<span>' + cat.desc + '</span></button>';
    });
    catListEl.innerHTML = html;
    Array.prototype.forEach.call(catListEl.querySelectorAll('.cat-btn'), function(btn){
      btn.addEventListener('click', function(){
        currentCat = btn.getAttribute('data-cat');
        renderCategories();
        renderItems();
      });
    });
  }

  function renderItems(){
    var cat = DATA[currentCat];
    var st = state[currentCat];
    itemsTitleEl.textContent = 'امکانات ' + cat.label;
    baseBadgeEl.textContent = 'پایه: ' + toFa(cat.base) + ' تومان';

    var html = '<div class="item-row base-row' + (st.base ? ' checked' : '') + '" data-base="1">' +
      '<div class="left"><div class="chk">' + (st.base ? '✓' : '') + '</div>' +
      '<div><div class="name">' + cat.baseLabel + '</div><div class="desc">پیش‌نیاز استفاده از امکانات این دسته</div></div></div>' +
      '<div class="price">' + toFa(cat.base) + ' ت</div></div>';

    cat.items.forEach(function(it){
      var isOn = st.items.has(it.id);
      html += '<div class="item-row' + (isOn ? ' checked' : '') + '" data-id="' + it.id + '">' +
        '<div class="left"><div class="chk">' + (isOn ? '✓' : '') + '</div>' +
        '<div><div class="name">' + it.name + '</div><div class="desc">' + it.desc + '</div></div></div>' +
        '<div class="price">‎+' + toFa(it.price) + ' ت</div></div>';
    });
    itemsListEl.innerHTML = html;

    var baseRow = itemsListEl.querySelector('.base-row');
    baseRow.addEventListener('click', function(){
      state[currentCat].base = !state[currentCat].base;
      renderCategories();
      renderItems();
      renderSummary();
    });

    Array.prototype.forEach.call(itemsListEl.querySelectorAll('.item-row[data-id]'), function(row){
      row.addEventListener('click', function(){
        var id = row.getAttribute('data-id');
        var items = state[currentCat].items;
        if (items.has(id)) items.delete(id); else items.add(id);
        renderCategories();
        renderItems();
        renderSummary();
      });
    });
  }

  function renderSummary(){
    var total = 0;
    var html = '';
    var anySelection = false;

    Object.keys(DATA).forEach(function(key){
      var cat = DATA[key];
      var st = state[key];
      if (!st.base && st.items.size === 0) return;
      anySelection = true;
      html += '<div class="sum-group-title">' + cat.label + '</div>';
      if (st.base){
        total += cat.base;
        html += '<div class="sum-line base"><span>' + cat.baseLabel + '</span><span>' + toFa(cat.base) + ' ت</span></div>';
      }
      cat.items.forEach(function(it){
        if (!st.items.has(it.id)) return;
        total += it.price;
        html += '<div class="sum-line"><span>' + it.name + '</span><span>+' + toFa(it.price) + ' ت</span></div>';
      });
    });

    if (!anySelection){
      html = '<div class="sum-empty">هنوز چیزی انتخاب نشده — از هر دسته که خواستید امکانات را تیک بزنید</div>';
    }

    summaryListEl.innerHTML = html;
    totalPriceEl.textContent = toFa(total) + ' تومان';
  }

  renderCategories();
  renderItems();
  renderSummary();

});
// لاگین
function showTab(name) {
  const isLogin = name === 'login';
  document.getElementById('loginBox').classList.toggle('hidden', !isLogin);
  document.getElementById('registerBox').classList.toggle('hidden', isLogin);
  document.getElementById('tabLogin').classList.toggle('is-active', isLogin);
  document.getElementById('tabRegister').classList.toggle('is-active', !isLogin);
  document.getElementById('brandCopy').innerHTML = isLogin
    ? '<h1>دفتر حساب‌هایتان، همیشه در دسترس.</h1><p>وارد شوید تا سوابق مالی، فاکتورها و دفتر کل کسب‌وکارتان را همان‌جا که ترکش کرده بودید ادامه دهید.</p>'
    : '<h1>یک دفتر کل تازه برای کسب‌وکارتان باز کنید.</h1><p>در چند دقیقه ثبت‌نام کنید و مدیریت حساب‌ها، فاکتورها و گزارش‌های مالی را شروع کنید.</p>';
}
document.addEventListener('DOMContentLoaded', function () {
 
  var params = new URLSearchParams(window.location.search);
  var repName = params.get('rep') || 'نزدیک‌ترین نماینده';
  document.getElementById('repName').textContent = repName;
 
  var form = document.getElementById('repForm');
  var successCard = document.getElementById('successCard');
  var successSummary = document.getElementById('successSummary');
  var repNameSuccess = document.getElementById('repNameSuccess');
  var editBtn = document.getElementById('editBtn');
 
  var phonePattern = /^0?9\d{9}$/;
 
  function setInvalid(fieldEl, isInvalid){
    if (isInvalid) fieldEl.classList.add('invalid');
    else fieldEl.classList.remove('invalid');
  }
 
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
 
    var firstName = document.getElementById('firstName');
    var lastName = document.getElementById('lastName');
    var businessName = document.getElementById('businessName');
    var phone = document.getElementById('phone');
    var address = document.getElementById('address');
    var version = document.getElementById('version');
 
    [
      [firstName, firstName.value.trim().length > 0],
      [lastName, lastName.value.trim().length > 0],
      [businessName, businessName.value.trim().length > 0],
      [phone, phonePattern.test(phone.value.trim().replace(/\s/g, ''))],
      [address, address.value.trim().length > 0],
      [version, version.value !== '']
    ].forEach(function (pair) {
      var el = pair[0];
      var ok = pair[1];
      var fieldEl = el.closest('.field');
      setInvalid(fieldEl, !ok);
      if (!ok) valid = false;
    });
 
    if (!valid) return;
 
    repNameSuccess.textContent = repName;
    successSummary.innerHTML =
      '<div><span>نام و نام خانوادگی</span><span>' + firstName.value.trim() + ' ' + lastName.value.trim() + '</span></div>' +
      '<div><span>نام کسب‌وکار</span><span>' + businessName.value.trim() + '</span></div>' +
      '<div><span>شماره تماس</span><span dir="ltr">' + phone.value.trim() + '</span></div>' +
      '<div><span>نسخه موردنیاز</span><span>' + version.value + '</span></div>';
 
    form.classList.add('hidden');
    successCard.classList.add('show');
    form.submit();  // <-- این خط رو اضافه کنید
  });
 
  editBtn.addEventListener('click', function () {
    successCard.classList.remove('show');
    form.classList.remove('hidden');
  });
 
});