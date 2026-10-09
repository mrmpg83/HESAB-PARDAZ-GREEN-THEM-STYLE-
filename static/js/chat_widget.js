// پنل چت شناور (پاپ‌آپ) - منطق باز/بسته کردن، بارگذاری پیام‌ها و ارسال پیام
(function () {
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    }

    const csrftoken = getCookie('csrftoken');

    async function apiFetch(url, options = {}) {
        options.headers = Object.assign({
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        }, options.headers || {});
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('درخواست ناموفق بود: ' + response.status);
        }
        return response.json();
    }

    function renderMessages(container, messages) {
        container.innerHTML = '';
        if (messages.length === 0) {
            const empty = document.createElement('p');
            empty.textContent = 'هنوز پیامی وجود ندارد.';
            container.appendChild(empty);
            return;
        }
        messages.forEach((m) => {
            const item = document.createElement('div');
            item.className = 'chat-message ' + (m.is_mine ? 'from-me' : 'from-other');
            const sender = document.createElement('strong');
            sender.textContent = m.is_mine ? 'شما' : m.sender;
            const text = document.createElement('p');
            text.textContent = m.text;
            const time = document.createElement('small');
            time.textContent = m.created_at;
            item.appendChild(sender);
            item.appendChild(text);
            item.appendChild(time);
            container.appendChild(item);
        });
        container.scrollTop = container.scrollHeight;
    }

    document.addEventListener('DOMContentLoaded', function () {
        const widget = document.getElementById('chat-widget');
        if (!widget) return;

        const toggleBtn = document.getElementById('chat-widget-toggle');
        const closeBtn = document.getElementById('chat-widget-close');
        const panel = document.getElementById('chat-widget-panel');
        if (!panel) return; // کاربر مهمان است، پنل وجود ندارد

        let pollTimer = null;
        const isStaff = widget.dataset.staff === 'true';

        function openPanel() {
            panel.classList.add('open');
            if (isStaff) {
                loadConversationList();
            } else {
                loadUserMessages();
            }
            pollTimer = setInterval(() => {
                if (isStaff) {
                    const detail = document.getElementById('chat-widget-admin-detail');
                    if (detail && detail.dataset.currentId) {
                        loadAdminMessages(detail.dataset.currentId);
                    } else {
                        loadConversationList();
                    }
                } else {
                    loadUserMessages();
                }
            }, 5000);
        }

        function closePanel() {
            panel.classList.remove('open');
            if (pollTimer) clearInterval(pollTimer);
        }

        toggleBtn.addEventListener('click', function () {
            if (panel.classList.contains('open')) {
                closePanel();
            } else {
                openPanel();
            }
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', closePanel);
        }

        // ---------------- کاربر عادی ----------------
        async function loadUserMessages() {
            const box = document.getElementById('chat-widget-messages');
            if (!box) return;
            try {
                const data = await apiFetch('/chat/api/messages/');
                renderMessages(box, data.messages);
            } catch (e) {
                console.error(e);
            }
        }

        const userForm = document.getElementById('chat-widget-user-form');
        if (userForm) {
            userForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const textarea = document.getElementById('chat-widget-user-text');
                const text = textarea.value.trim();
                if (!text) return;
                try {
                    await apiFetch('/chat/api/messages/send/', {
                        method: 'POST',
                        body: JSON.stringify({ text }),
                    });
                    textarea.value = '';
                    loadUserMessages();
                } catch (e) {
                    console.error(e);
                }
            });
        }

        // ---------------- ادمین ----------------
        async function loadConversationList() {
            const listContainer = document.getElementById('chat-widget-conversations');
            if (!listContainer) return;
            document.getElementById('chat-widget-admin-list').style.display = 'block';
            document.getElementById('chat-widget-admin-detail').style.display = 'none';
            document.getElementById('chat-widget-admin-detail').dataset.currentId = '';

            try {
                const data = await apiFetch('/chat/api/conversations/');
                listContainer.innerHTML = '';
                if (data.conversations.length === 0) {
                    listContainer.innerHTML = '<li>هنوز هیچ گفتگویی وجود ندارد.</li>';
                    return;
                }
                data.conversations.forEach((c) => {
                    const li = document.createElement('li');
                    li.className = 'chat-widget-conversation-item';
                    li.textContent = c.username + ' - ' + (c.last_message || '(بدون پیام)');
                    if (c.unread_count > 0) {
                        const badge = document.createElement('span');
                        badge.className = 'chat-widget-badge';
                        badge.textContent = ' (' + c.unread_count + ' جدید)';
                        li.appendChild(badge);
                    }
                    li.addEventListener('click', () => openConversation(c.id, c.username));
                    listContainer.appendChild(li);
                });
            } catch (e) {
                console.error(e);
            }
        }

        function openConversation(id, username) {
            const detail = document.getElementById('chat-widget-admin-detail');
            document.getElementById('chat-widget-admin-list').style.display = 'none';
            detail.style.display = 'block';
            detail.dataset.currentId = id;
            document.getElementById('chat-widget-admin-username').textContent = username;
            loadAdminMessages(id);
        }

        async function loadAdminMessages(id) {
            const box = document.getElementById('chat-widget-messages');
            if (!box) return;
            try {
                const data = await apiFetch('/chat/api/conversations/' + id + '/');
                renderMessages(box, data.messages);
            } catch (e) {
                console.error(e);
            }
        }

        const backBtn = document.getElementById('chat-widget-back');
        if (backBtn) {
            backBtn.addEventListener('click', loadConversationList);
        }

        const adminForm = document.getElementById('chat-widget-admin-form');
        if (adminForm) {
            adminForm.addEventListener('submit', async function (e) {
                e.preventDefault();
                const detail = document.getElementById('chat-widget-admin-detail');
                const id = detail.dataset.currentId;
                if (!id) return;
                const textarea = document.getElementById('chat-widget-admin-text');
                const text = textarea.value.trim();
                if (!text) return;
                try {
                    await apiFetch('/chat/api/conversations/' + id + '/send/', {
                        method: 'POST',
                        body: JSON.stringify({ text }),
                    });
                    textarea.value = '';
                    loadAdminMessages(id);
                } catch (e) {
                    console.error(e);
                }
            });
        }
    });
})();
