// ===== NAVIGATION =====
function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  const titles = {dashboard:'داشبورد',customers:'مشتریان نرم‌افزار',agents:'نمایندگان',modules:'نرم‌افزارهای مورد نیاز',pricing:'تعیین قیمت نسخه‌ها',education:'دوره حسابداری',blog:'مدیریت وبلاگ',settings:'تنظیمات'};
  document.getElementById('pageTitle').textContent = titles[id] || id;
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if(el) el.classList.add('active');
  else {
    document.querySelectorAll('.nav-item').forEach(n => {
      if(n.textContent.trim().includes(titles[id])) n.classList.add('active');
    });
  }
}

// ===== MODALS =====
function openAddModal() { document.getElementById('addModal').classList.add('open'); }
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
document.querySelectorAll('.modal-overlay').forEach(m => m.addEventListener('click', function(e){ if(e.target === this) this.classList.remove('open'); }));

// ===== TOAST =====
function showToast(msg) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ===== PRICING =====
function savePricing(planName) {
  showToast('قیمت نسخه ' + planName + ' ذخیره شد');
}

// ===== CHARTS =====
const chartDefaults = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, tooltip: { backgroundColor:'#1A2236', titleColor:'#E8EDF5', bodyColor:'#9AAAC7', borderColor:'#232E48', borderWidth:1, rtl:true, textDirection:'rtl' }},
  scales: { x: { ticks:{color:'#5A6A8A',font:{size:10}}, grid:{color:'rgba(255,255,255,0.03)'}, border:{display:false} }, y: { ticks:{color:'#5A6A8A',font:{size:10}}, grid:{color:'rgba(255,255,255,0.03)'}, border:{display:false} } }
};
const months = ['مهر','آبان','آذر','دی','بهمن','اسفند'];

// Line Chart (Dashboard) — sales of each version by month
new Chart(document.getElementById('lineChart'), {
  type: 'line',
  data: { labels: months, datasets:[
    { label:'پایه', data:[38,42,45,50,48,55], borderColor:'#4F8EF7', backgroundColor:'rgba(79,142,247,.08)', tension:.4, fill:true, pointRadius:3 },
    { label:'حرفه‌ای', data:[22,26,28,30,33,36], borderColor:'#7B5CF0', backgroundColor:'rgba(123,92,240,.08)', tension:.4, fill:true, pointRadius:3 },
    { label:'سازمانی', data:[8,9,10,12,13,15], borderColor:'#2ECC9A', backgroundColor:'rgba(46,204,154,.08)', tension:.4, fill:true, pointRadius:3 }
  ]},
  options: { ...chartDefaults, plugins:{ ...chartDefaults.plugins, legend:{ display:true, labels:{color:'#9AAAC7',font:{size:11}} } } }
});

// Donut Chart (Dashboard) — version distribution
new Chart(document.getElementById('donutChart'), {
  type: 'doughnut',
  data: { labels:['پایه','حرفه‌ای','سازمانی'], datasets:[{ data:[45,35,20], backgroundColor:['#4F8EF7','#7B5CF0','#2ECC9A'], borderWidth:0 }]},
  options: { responsive:true, maintainAspectRatio:false, cutout:'70%', plugins:{ legend:{ display:false }, tooltip: chartDefaults.plugins.tooltip } }
});

// Customer Growth Chart (Customers page)
new Chart(document.getElementById('customerChart'), {
  type: 'bar',
  data: { labels: months, datasets:[{ data:[2650,2810,2960,3120,3290,3450], backgroundColor:'rgba(79,142,247,.35)', hoverBackgroundColor:'#4F8EF7', borderRadius:6 }]},
  options: { ...chartDefaults }
});

// ===== BLOG =====
function openModalBlog(id) { document.getElementById(id).classList.add('open'); }

const blogData = [
  {title:'آموزش صدور فاکتور در حساب‌پرداز', cat:'آموزش', author:'تیم حساب‌پرداز', read:'۵ دقیقه', summary:'در این مقاله مراحل صدور فاکتور فروش و خرید در نرم‌افزار حساب‌پرداز را یاد می‌گیرید.'},
  {title:'۵ اشتباه رایج در حسابداری فروشگاهی', cat:'نکات حسابداری', author:'سارا رضایی', read:'۳ دقیقه', summary:'با این نکات از رایج‌ترین اشتباهات حسابداری فروشگاهی دوری کنید.'},
  {title:'تفاوت نسخه پایه و حرفه‌ای حساب‌پرداز', cat:'آموزش', author:'تیم حساب‌پرداز', read:'۷ دقیقه', summary:''},
  {title:'راهنمای شروع کار با ماژول انبارداری', cat:'راهنما', author:'نیلوفر احمدی', read:'۴ دقیقه', summary:''},
  {title:'راهنمای مالیات سالانه با حساب‌پرداز — پیش‌نویس', cat:'آموزش', author:'تیم حساب‌پرداز', read:'', summary:''}
];

function openEditBlog(idx) {
  const d = blogData[idx];
  document.getElementById('blogModalTitle').textContent = 'ویرایش مقاله';
  document.getElementById('blogTitleInput').value = d.title;
  document.getElementById('blogAuthorInput').value = d.author;
  document.getElementById('blogReadInput').value = d.read;
  document.getElementById('blogSummaryInput').value = d.summary;
  document.getElementById('blogEditor').innerHTML = '<p>' + d.title + '</p>';
  openModal('blogWriteModal');
}
function deleteBlogRow(btn) {
  if(confirm('این مقاله حذف شود؟')) { btn.closest('tr').remove(); showToast('مقاله حذف شد'); }
}
function saveBlogDraft() { closeModal('blogWriteModal'); showToast('پیش‌نویس ذخیره شد'); }
function publishBlog() {
  const title = document.getElementById('blogTitleInput').value || 'مقاله جدید';
  const author = document.getElementById('blogAuthorInput').value || 'تیم حساب‌پرداز';
  const tbody = document.getElementById('blogTableBody');
  const tr = document.createElement('tr');
  tr.innerHTML = `<td><div style="font-weight:600;max-width:260px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${title}</div><div style="font-size:10px;color:var(--muted);margin-top:2px">همین الان</div></td><td><span class="badge b-shipped">عمومی</span></td><td>${author}</td><td>امروز</td><td>۰</td><td><span class="badge b-active">منتشرشده</span></td><td style="display:flex;gap:6px;padding:10px 0"><button class="btn btn-ghost btn-sm"><i class="fa-solid fa-pen"></i>ویرایش</button><button class="btn btn-danger btn-sm" onclick="deleteBlogRow(this)"><i class="fa-solid fa-trash"></i></button></td>`;
  tbody.prepend(tr);
  closeModal('blogWriteModal');
  showToast('مقاله منتشر شد ✓');
}
function formatText(cmd) { document.getElementById('blogEditor').focus(); document.execCommand(cmd, false, null); }