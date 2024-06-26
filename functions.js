document.addEventListener('DOMContentLoaded', () => {
    const optionInput = document.getElementById('optionInput');
    const addOptionBtn = document.getElementById('addOptionBtn');
    const optionsList = document.getElementById('optionsList');
    const winningOption = document.getElementById('winningOption');
    const googleDirectionsBtn = document.getElementById('googleDirectionsBtn');
    const appleDirectionsBtn = document.getElementById('appleDirectionsBtn');

    const options = [];

    addOptionBtn.addEventListener('click', () => {
        const optionText = optionInput.value.trim();
        if (optionText !== '') {
            const option = {
                text: optionText,
                votes: 0
            };
            options.push(option);
            optionInput.value = '';
            renderOptions();
        }
    });

    function renderOptions() {
        optionsList.innerHTML = '';
        options.forEach((option, index) => {
            const li = document.createElement('li');
            li.textContent = `${option.text} - Votes: ${option.votes}`;
            const voteBtn = document.createElement('button');
            voteBtn.textContent = 'Vote';
            voteBtn.addEventListener('click', () => {
                options[index].votes += 1;
                renderOptions();
                displayWinningOption();
            });
            li.appendChild(voteBtn);
            optionsList.appendChild(li);
        });
    }

    function displayWinningOption() {
        if (options.length === 0) {
            winningOption.textContent = 'No options available';
        } else {
            const winningOptionObj = options.reduce((max, option) => (option.votes > max.votes ? option : max), options[0]);
            winningOption.textContent = `${winningOptionObj.text} - Votes: ${winningOptionObj.votes}`;
        }
    }

    googleDirectionsBtn.addEventListener('click', () => {
        if (options.length === 0) {
            alert('No options available');
            return;
        }
        const winningOptionObj = options.reduce((max, option) => (option.votes > max.votes ? option : max), options[0]);
        const query = encodeURIComponent(winningOptionObj.text);
        const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
        window.open(url, '_blank');
    });

    appleDirectionsBtn.addEventListener('click', () => {
        if (options.length === 0) {
            alert('No options available');
            return;
        }
        const winningOptionObj = options.reduce((max, option) => (option.votes > max.votes ? option : max), options[0]);
        const query = encodeURIComponent(winningOptionObj.text);
        const url = `http://maps.apple.com/?q=${query}`;
        window.open(url, '_blank');
    });

    renderOptions();
});