function apiLoad() {
    return fetch("http://api.persik.by/v2/content/channels?device=web-by", {
        method: 'GET'
    }).then(data => data.json());
}

function loadGenres() {
    return fetch("http://api.persik.by/v2/categories/channel", {
        method: 'GET'
    }).then(data => data.json());
}

function loadTvshows(channelId) {
    const currentDate = moment().format('YYYY-MM-DD');
    return fetch("http://api.persik.by/v2/epg/tvshows".concat('?channels[]=', channelId, '&limit=50&from=', currentDate, '&to=', currentDate), {
        method: 'GET'
    }).then(data => data.json());
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

    //Store Id
    //const laodTvshowsHandler = fucntion() { loadTvshows(channel.channel_id);}

    card.addEventListener('click', () =>{
        loadTvshows(channel.channel_id).then(data => drawTvshows(data.tvshows.items));
    });

    return card;
}

function createCurrentTvshowCard(tvshow) {
    const card = document.createElement('div');
    card.classList.add('current-tvshow');

    const title = document.createElement('span');
    title.classList.add('tvshowtitle-cur');
    title.innerText = tvshow.title;
    //Выпадашка при наведении
    title.title = tvshow.title;

    const info = document.createElement('div');
    info.classList.add('tvshow-info');

    const startSpan = document.createElement('span');
    const startTime = moment.unix(tvshow.start).format('HH:mm');
    startSpan.innerText = startTime;

    const endSpan = document.createElement('span');
    const endTime = moment.unix(tvshow.stop).format('HH:mm');
    endSpan.innerText = endTime;

    const progress = document.createElement('div');
    progress.classList.add('progress');

    const progressLine = document.createElement('div');
    progressLine.classList.add('progress-line');
    progressLine.style.width = getProgress(tvshow.start, tvshow.stop) + "%";

    progress.appendChild(progressLine);

    info.appendChild(startSpan);
    info.appendChild(progress);
    info.appendChild(endSpan);

    card.appendChild(title);
    card.appendChild(info);

    return card;
}

function getProgress(start, stop) {
    const currentTime = moment().unix();
    return Math.round(((currentTime - start) / (stop - start)) * 100);
}

function drawTvshows(tvshows) {
    const tvshowsArea = document.getElementsByClassName('tvshows')[0];
    tvshowsArea.innerHTML = '';
    tvshows.forEach(element => {
        const tvshowCard = createTvshowCard(element);
        tvshowsArea.appendChild(tvshowCard);
    });

    const currentTvshow = document.getElementsByClassName('current-tvshow')[0];
    console.log(currentTvshow.getBoundingClientRect());
    if(currentTvshow) {
        //Event Loop
        setTimeout(() => {
            currentTvshow.scrollIntoView({behavior: 'smooth', block: 'center'})
        }, 0);
    }
}

function createTvshowCard(tvshow) {
    const currentTime = moment().unix();
    if(currentTime >= +tvshow.start && currentTime < tvshow.stop) {
        return createCurrentTvshowCard(tvshow);
    }
    return createSimpleTvshowCard(tvshow);
}

function createSimpleTvshowCard(tvshow) {
    const card = document.createElement('div');
    card.classList.add('simple-tvshow');

    const title = document.createElement('span');
    title.classList.add('tvshowtitle');
    title.innerText = tvshow.title;
    //Выпадашка при наведении
    title.title = tvshow.title;

    const time = document.createElement('span');
    time.classList.add('tvshowtime');
    const startTime = moment.unix(tvshow.start).format('HH:mm');
    const endTime = moment.unix(tvshow.stop).format('HH:mm');
    time.innerText = `${ startTime }-${ endTime }`;

    card.appendChild(title);
    card.appendChild(time);

    return card;
}

function drawChannel(items) {
    const channelsBlock = document.getElementsByClassName('channels-block')[0];
    channelsBlock.innerHTML = '';
    items.forEach(item => {
        const channelCard = createChannelsCard(item);
        channelsBlock.appendChild(channelCard);
    });
    loadTvshows(items[0].channel_id).then(data => drawTvshows(data.tvshows.items));
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