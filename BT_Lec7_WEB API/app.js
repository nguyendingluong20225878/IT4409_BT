/* app.js - Phiên bản có comment tiếng Việt và nâng cấp UX
   - Thêm thông báo success
   - Hỗ trợ đóng modal bằng ESC, nút đóng, backdrop
   - Nút xóa tìm kiếm
   - Giữ nguyên logic CRUD dùng async/await và localStorage */

// Bao bọc toàn bộ code trong một IIFE để tránh ô nhiễm global
(function () {
  const PAGE_SIZE = 5;
  let state = {
    users: [],
    filter: '',
    page: 1,
  };

  // Các phần tử DOM chính (có comment tiếng Việt)
  const els = {
    tbody: document.querySelector('#usersTable tbody'),
    search: document.getElementById('searchInput'),
    clearSearch: document.getElementById('clearSearch'),
    prev: document.getElementById('prevPage'),
    next: document.getElementById('nextPage'),
    pageInfo: document.getElementById('pageInfo'),
    createBtn: document.getElementById('createBtn'),
    modal: document.getElementById('modal'),
    modalClose: document.getElementById('modalClose'),
    modalTitle: document.getElementById('modalTitle'),
    userForm: document.getElementById('userForm'),
    userId: document.getElementById('userId'),
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    cancelBtn: document.getElementById('cancelBtn'),
    error: document.getElementById('error'),
    success: document.getElementById('success'),
  };

  // Hiển thị lỗi (alert) - có animation cơ bản
  function showError(message, ms = 4000){
    if(!els.error) return;
    els.error.textContent = message;
    els.error.classList.add('visible');
    els.error.classList.add('alert');
    els.error.classList.add('error');
    setTimeout(()=> els.error.classList.remove('visible'), ms);
  }

  // Hiển thị thông báo thành công
  function showSuccess(message, ms = 2500){
    if(!els.success) return;
    els.success.textContent = message;
    els.success.classList.add('visible');
    els.success.classList.add('alert');
    els.success.classList.add('success');
    setTimeout(()=> els.success.classList.remove('visible'), ms);
  }

  // Giả lập độ trễ mạng để UX mượt hơn
  function delay(ms=200){
    return new Promise(res => setTimeout(res, ms));
  }

  // API giả (sử dụng localStorage làm "server")
  const api = {
    async getAll(){
      try{
        const stored = localStorage.getItem('users');
        if(stored){
          await delay(80);
          return JSON.parse(stored);
        }
        const res = await fetch('users.json');
        if(!res.ok) throw new Error('Không tải được users.json');
        const data = await res.json();
        localStorage.setItem('users', JSON.stringify(data));
        return data;
      }catch(err){
        throw err;
      }
    },
    async create(user){
      try{
        await delay(160);
        const users = await this.getAll();
        const maxId = users.reduce((m,u)=> Math.max(m,u.id),0);
        user.id = maxId + 1;
        users.unshift(user);
        localStorage.setItem('users', JSON.stringify(users));
        return user;
      }catch(err){ throw err; }
    },
    async update(id, changes){
      try{
        await delay(160);
        const users = await this.getAll();
        const idx = users.findIndex(u=>u.id === id);
        if(idx === -1) throw new Error('Không tìm thấy user');
        users[idx] = {...users[idx], ...changes};
        localStorage.setItem('users', JSON.stringify(users));
        return users[idx];
      }catch(err){ throw err; }
    },
    async delete(id){
      try{
        await delay(120);
        const users = await this.getAll();
        const idx = users.findIndex(u=>u.id === id);
        if(idx === -1) throw new Error('Không tìm thấy user');
        users.splice(idx,1);
        localStorage.setItem('users', JSON.stringify(users));
        return true;
      }catch(err){ throw err; }
    }
  };

  // Hàm lọc theo state.filter
  function applyFilter(users){
    const q = state.filter.trim().toLowerCase();
    if(!q) return users;
    return users.filter(u => u.name.toLowerCase().includes(q));
  }

  // Tránh XSS
  function escapeHtml(s){
    return String(s||'').replace(/[&<>\"']/g,c=>({ '&':'&amp;','<':'&lt;','>':'&gt;', '"':'&quot;',"'":'&#39;' }[c]));
  }

  // Render bảng theo state (filter + pagination)
  function render(){
    const filtered = applyFilter(state.users);
    const total = filtered.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if(state.page > pages) state.page = pages;
    const start = (state.page -1) * PAGE_SIZE;
    const pageItems = filtered.slice(start, start + PAGE_SIZE);

    els.tbody.innerHTML = '';
    for(const u of pageItems){
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${escapeHtml(u.name)}</td>
        <td>${escapeHtml(u.email)}</td>
        <td>${escapeHtml(u.phone)}</td>
        <td class="actions">
          <button class="edit" data-id="${u.id}">Sửa</button>
          <button class="delete" data-id="${u.id}">Xóa</button>
        </td>
      `;
      els.tbody.appendChild(tr);
    }

    els.pageInfo.textContent = `Trang ${state.page} / ${pages} — ${total} mục`;
    els.prev.disabled = state.page <= 1;
    els.next.disabled = state.page >= pages;
  }

  // Tải dữ liệu rồi render
  async function loadAndRender(){
    try{
      state.users = await api.getAll();
      state.page = 1;
      render();
    }catch(err){
      showError('Lỗi tải dữ liệu: ' + err.message);
    }
  }

  // Modal: mở modal cho create
  function openModalForCreate(){
    els.modalTitle.textContent = 'Thêm người dùng';
    els.userId.value = '';
    els.name.value = '';
    els.email.value = '';
    els.phone.value = '';
    els.modal.classList.remove('hidden');
    els.modal.setAttribute('aria-hidden','false');
    // focus vào input đầu tiên
    setTimeout(()=> els.name.focus(), 80);
  }

  // Modal: mở modal cho edit
  function openModalForEdit(id){
    const u = state.users.find(x=> x.id === id);
    if(!u){ showError('Người dùng không tồn tại'); return; }
    els.modalTitle.textContent = 'Sửa người dùng';
    els.userId.value = u.id;
    els.name.value = u.name;
    els.email.value = u.email;
    els.phone.value = u.phone;
    els.modal.classList.remove('hidden');
    els.modal.setAttribute('aria-hidden','false');
    setTimeout(()=> els.name.focus(), 80);
  }

  // Đóng modal
  function closeModal(){
    els.modal.classList.add('hidden');
    els.modal.setAttribute('aria-hidden','true');
  }

  // Xử lý sự kiện
  // Tìm kiếm (live)
  els.search.addEventListener('input', (e)=>{
    state.filter = e.target.value;
    state.page = 1;
    render();
  });

  // Nút xóa tìm kiếm
  if(els.clearSearch){
    els.clearSearch.addEventListener('click', ()=>{
      els.search.value = '';
      state.filter = '';
      state.page = 1;
      render();
    });
  }

  // Phân trang
  els.prev.addEventListener('click', ()=>{ state.page = Math.max(1, state.page-1); render(); });
  els.next.addEventListener('click', ()=>{ state.page++; render(); });

  // Event delegation cho Edit / Delete
  els.tbody.addEventListener('click', async (e)=>{
    const id = Number(e.target.dataset.id);
    if(!id) return;
    if(e.target.classList.contains('edit')){
      openModalForEdit(id);
    } else if(e.target.classList.contains('delete')){
      const ok = confirm('Bạn muốn xóa người dùng này?');
      if(!ok) return;
      try{
        await api.delete(id);
        state.users = state.users.filter(u=>u.id !== id);
        render();
        showSuccess('Xóa thành công');
      }catch(err){
        showError('Xóa thất bại: ' + err.message);
      }
    }
  });

  // Mở modal thêm
  els.createBtn.addEventListener('click', ()=> openModalForCreate());

  // Nút đóng modal (Cancel + X)
  if(els.cancelBtn) els.cancelBtn.addEventListener('click', ()=> closeModal());
  if(els.modalClose) els.modalClose.addEventListener('click', ()=> closeModal());

  // Đóng modal khi click backdrop
  els.modal.addEventListener('click', (e)=>{
    if(e.target === els.modal) closeModal();
  });

  // Đóng modal bằng phím ESC
  document.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){
      if(!els.modal.classList.contains('hidden')) closeModal();
    }
  });

  // Submit form (Create / Update)
  els.userForm.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const idVal = els.userId.value ? Number(els.userId.value) : null;
    const payload = {
      name: els.name.value.trim(),
      email: els.email.value.trim(),
      phone: els.phone.value.trim(),
    };
    if(!payload.name || !payload.email || !payload.phone){
      showError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try{
      if(idVal){
        const updated = await api.update(idVal, payload);
        state.users = state.users.map(u => u.id === idVal ? updated : u);
        closeModal();
        render();
        showSuccess('Cập nhật thành công');
      } else {
        const created = await api.create(payload);
        state.users.unshift(created);
        closeModal();
        state.page = 1;
        render();
        showSuccess('Tạo mới thành công');
      }
    }catch(err){
      showError('Lưu thất bại: ' + err.message);
    }
  });

  // Khởi tạo
  (async function init(){
    try{
      await loadAndRender();
    }catch(err){
      showError('Lỗi khởi tạo: ' + err.message);
    }
  })();

})();