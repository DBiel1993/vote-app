document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'http://localhost:3000'; // Ensure this matches your backend server's URL

    const sessionIdInput = document.getElementById('sessionIdInput');
    const createSessionBtn = document.getElementById('createSessionBtn');
    const joinSessionBtn = document.getElementById('joinSessionBtn');
    const optionInput = document.getElementById('optionInput');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const optionsList = document.getElementById('optionsList');
    const winningOption = document.getElementById('winningOption');
    const googleDirectionsBtn = document.getElementById('googleDirectionsBtn');
    const appleDirectionsBtn = document.getElementById('appleDirectionsBtn');
    const inputSection = document.querySelector('.input-section');

    let currentSessionId = null;

    createSessionBtn.addEventListener('click', async () => {
        const response = await fetch(`${apiUrl}/session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        currentSessionId = data.sessionId;
        console.log(`Session created: ${currentSessionId}`);
        alert(`Session created. Your session ID is ${currentSessionId}`);
        inputSection.style.display = 'block';
        fetchOptions();
    });

    joinSessionBtn.addEventListener('click', () => {
        currentSessionId = sessionIdInput.value.trim();
        if (currentSessionId === '') {
            alert('Please enter a valid session ID or create a new session.');
            return;
        }
        console.log(`Joined session: ${currentSessionId}`);
        inputSection.style.display = 'block';
        fetchOptions();
    });

    async function fetchOptions() {
        try {
            console.log(`Fetching options for session ID: ${currentSessionId}`);
            const response = await fetch(`${apiUrl}/options/${currentSessionId}`);
            if (!response.ok) {
                throw new Error(`Error fetching options: ${response.statusText}`);
            }
            const options = await response.json();
            if (!Array.isArray(options)) {
                throw new Error('Invalid data format: expected an array');
            }
            console.log('Options:', options);
            renderOptions(options);
            displayWinningOption(options);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch options. Please check the console for details.');
        }
    }

    addOptionBtn.addEventListener('click', async () => {
        const optionText = optionInput.value.trim();
        if (optionText !== '') {
            try {
                const response = await fetch(`${apiUrl}/options/${currentSessionId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: optionText })
                });
                if (!response.ok) {
                    throw new Error(`Error adding option: ${response.statusText}`);
                }
                const newOption = await response.json();
                console.log('New option added:', newOption);
                optionInput.value = '';
                fetchOptions();
            } catch (error) {
                console.error(error);
                alert('Failed to add option. Please check the console for details.');
            }
        }
    });

    function renderOptions(options) {
        optionsList.innerHTML = '';
        options.forEach(option => {
            const li = document.createElement('li');
            li.textContent = `${option.text} - Votes: ${option.votes}`;
            const voteBtn = document.createElement('button');
            voteBtn.textContent = 'Vote';
            voteBtn.addEventListener('click', async () => {
                try {
                    const response = await fetch(`${apiUrl}/vote/${currentSessionId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ id: option.id })
                    });
                    if (!response.ok) {
                        throw new Error(`Error voting: ${response.statusText}`);
                    }
                    fetchOptions();
                } catch (error) {
                    console.error(error);
                    alert('Failed to vote. Please check the console for details.');
                }
            });
            li.appendChild(voteBtn);
            optionsList.appendChild(li);
        });
    }

    function displayWinningOption(options) {
        if (options.length === 0) {
            winningOption.textContent = 'No options available';
        } else {
            const winningOptionObj = options.reduce((max, option) => (option.votes > max.votes ? option : max), options[0]);
            winningOption.textContent = `${winningOptionObj.text} - Votes: ${winningOptionObj.votes}`;
        }
    }

    googleDirectionsBtn.addEventListener('click', () => {
        if (optionsList.children.length === 0) {
            alert('No options available');
            return;
        }
        const winningOptionText = winningOption.textContent.split(' - Votes: ')[0];
        const query = encodeURIComponent(winningOptionText);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, '_blank');
    });

    appleDirectionsBtn.addEventListener('click', () => {
        if (optionsList.children.length === 0) {
            alert('No options available');
            return;
        }
        const winningOptionText = winningOption.textContent.split(' - Votes: ')[0];
        const query = encodeURIComponent(winningOptionText);
        const url = `http://maps.apple.com/?q=${query}`;
        window.open(url, '_blank');
    });
});