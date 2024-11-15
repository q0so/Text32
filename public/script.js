document.getElementById('link-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const url = document.getElementById('url').value;
    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url }),
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('result').innerText = `Generated Code: ${data.code}`;
        } else {
            document.getElementById('result').innerText = 'Error generating code.';
        }
    } catch (error) {
        console.error(error);
    }
});

document.getElementById('lookup-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const code = document.getElementById('code').value;
    try {
        const response = await fetch(`/lookup/${code}`);

        if (response.ok) {
            const data = await response.json();
            document.getElementById('lookup-result').innerText = `Original URL: ${data.url}`;
        } else {
            document.getElementById('lookup-result').innerText = 'Code not found.';
        }
    } catch (error) {
        console.error(error);
    }
});
