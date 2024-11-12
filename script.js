document.getElementById("loginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "تم تسجيل الدخول بنجاح") {
            document.getElementById("noteSection").style.display = "block";
            document.getElementById("savedNotes").innerText = "نصوصك المحفوظة: " + data.notes.join(", ");
        }
    });
});

document.getElementById("signupForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;

    fetch("/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    }).then(response => response.text())
    .then(data => alert(data));
});

document.getElementById("saveNote").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const note = document.getElementById("note").value;

    fetch("/save-note", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, note })
    }).then(response => response.text())
    .then(data => alert(data));
});
