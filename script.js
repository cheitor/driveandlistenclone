const toggle = document.getElementById('toggle');
const mute = document.getElementById('mute');
const locations = document.getElementById('locations');
const speed = document.getElementById('speed');

var currentCityIndex;
var currentCity;
var currentVideoIndex;
var currentVideo;

const data =[
    {
        city: 'Downhill Mountain Bike',
        videos:[
            'n_7gkhSjSjY',
            'LkMBvntR1cM',
            'WdtkaLxc464'
        ]
    },
    {
        city: 'Car Racing',
        videos:[
            'W4T3BMCO6OU',
            'zVE1TcuXLBw',
            'P7IDspHR_bQ'
        ]
    },
    {
        city: 'Skyline Luge',
        videos:[
            'Axz6PWfOQbo',
            '3lsV3JV5aAU',
            'dXZO0qnhrPo'
        ]
    }
];

const availableSpeeds = [0.5, 1, 1.5, 2];
function onLoad(){
    //category
    currentCityIndex = randomNumber(data.length);
    currentCity = data[currentCityIndex];

    //videos
    currentVideoIndex = randomNumber(currentCity.videos.length);
    currentVideo = currentCity.videos[currentVideoIndex];

    data.forEach((el, idx) => {
        var locationElement = document.createElement('li');
        locationElement.innerText = el.city;
        locationElement.id = idx;
        locationElement.addEventListener('click', (e) => {
            currentCityIndex = Number(e.target.id);
            currentCity = data[currentCityIndex];
            currentVideoIndex = randomNumber(currentCity.videos.length);
            currentVideo = currentCity.videos[currentVideoIndex];
            player.loadVideoById({videoId: currentVideo}) //start to play one video from the category chosen by the user
        })

        locations.append(locationElement);
    })

    availableSpeeds.forEach((el) => {
        var speedEl = document.createElement('p');
        speedEl.id = el;
        speedEl.innerText = el + 'x';
        speedEl.addEventListener('click', (e) => {
            player.setPlaybackRate(Number(e.target.id))
        })
        speed.append(speedEl);
    })
    highlight();
}

onLoad();

function highlight(){
    locations.childNodes.forEach((el, idx) => {
        el.classList.remove('active');
        if (idx == currentCityIndex){
            el.classList.add('active');
        }
    })
}

function randomNumber(max){
    return Math.floor(Math.random() * (max))
}

mute.addEventListener('click', () =>{
    if(player.isMuted()){
        player.unMute();
        mute.innerText = 'ON';
    }else{
        player.mute();
        mute.innerText = 'OFF'
    }
})

toggle.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('hidden');
})

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: window.innerHeight *1.2,
    width: window.innerHeight *1.2 * (16/9),
    videoId: currentVideo,
    playerVars: {
      'playsinline': 1,
      'controls': 0,
      'mute': 0,
      'showInfo': 0,
      'enablejsapi': 1,
      'disablekb': 1,
      'modestbranding': 1,
      'origin': window.location.origin,
      'widget_referrer': window.location.href
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
function onPlayerStateChange(event) {
  if(event.data == YT.PlayerState.ENDED){ //to play the next video when the current is finished
    if(currentVideoIndex < currentCity.videos.length){
        currentVideoIndex++;
    }else{
        currentVideoIndex = 0;
    }

    currentVideo = currentCity.videos[currentVideoIndex]
    player.loadVideoById({videoId: currentVideo});
    highlight();
  }  
}