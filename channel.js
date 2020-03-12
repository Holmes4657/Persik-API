function apiLoad() {
    return fetch("http://api.persik.by/v2/content/channels?device=web-by", {
        method: 'GET'
    }).then(data => data.json())
}

function loadGenres() {
    return fetch("http://api.persik.by/v2/categories/channel", {
        method: 'GET'
    }).then(data => data.json())
}

let channels = [];

function drawGenres(genres) {
    const dropdown = document.getElementById("dropdown");
    dropdown.addEventListener('change', onGenreChange);
    dropdown.innerHTML = ' ';
    genres.forEach(item => {
        const option = createOption(item);
        dropdown.appendChild(option);
    });
}

function createOption(genre) {
    const option = document.createElement('option');
    option.innerText = genre.name;
    option.value = genre.id;
    return option;
}

apiLoad().then(data => {
    channels = data.channels;
    drawChannel(channels);
})

loadGenres().then(data => {
    const allGenre = {
        id: 0,
        name: "Все жанры"
    };
    data.unshift(allGenre);
    drawGenres(data);
});

const showlist = document.getElementsByClassName('channels-block')[0];

function createChannelsCard(channel) {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = channel.logo;

    const name = document.createElement('span');
    name.innerText = channel.name;

    card.appendChild(img);
    card.appendChild(name);
    return card;
}

function drawChannel(items) {
    const channelsBlock = document.getElementsByClassName('channels-block')[0];
    channelsBlock.innerHTML = '';
    items.forEach(item => {
        const channelCard = createChannelsCard(item);
        channelsBlock.appendChild(channelCard);
    })
}

function onGenreChange(event) {
    const id = +event.target.value;
    let filteredChannels;
    if(id !== 0) {
        filteredChannels = channels.filter(ch => ch.genres.includes(id));
    } else {
        filteredChannels = channels;
    }

    drawChannel(filteredChannels);
}

apiLoad().then(data => console.log(data.channels[0]));