function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }).then(response => response.json()).then(data => {
        if (data.success) alert("تم إنشاء الحساب بنجاح!");
        else alert(data.message);
    });
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    }).then(response => response.json()).then(data => {
        if (data.success) {
            document.getElementById('auth').style.display = 'none';
            document.getElementById('content').style.display = 'block';
            document.getElementById('user-name').innerText = data.username;
            loadTexts();
        } else {
            alert(data.message);
        }
    });
}

function saveText() {
    const text = document.getElementById('text').value;
    fetch('/save-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
    }).then(response => response.json()).then(data => {
        if (data.success) loadTexts();
    });
}

function loadTexts() {
    fetch('/texts').then(response => response.json()).then(data => {
        const savedTexts = document.getElementById('saved-texts');
        savedTexts.innerHTML = '';
        data.forEach(text => {
            const div = document.createElement('div');
            div.textContent = text;
            savedTexts.appendChild(div);
        });
    });
}

function logout() {
    fetch('/logout').then(() => {
        document.getElementById('auth').style.display = 'block';
        document.getElementById('content').style.display = 'none';
    });
}
