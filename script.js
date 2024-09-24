document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.getElementById('play-pause');
    const backwardBtn = document.getElementById('backward');
    const forwardBtn = document.getElementById('forward');
    const shuffleBtn = document.getElementById('shuffle');
    const loopBtn = document.getElementById('loop');
    const trackTitle = document.getElementById('track-title');
    const bpmId = document.getElementById('bpm-id');
    const seekBar = document.getElementById('seek-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const albumImg = document.getElementById('album-img');
    const bgImg = document.getElementById('bg-img');
    const pulse = document.getElementById('pulse');
    const playlistContainer = document.getElementById('playlist');
    const container = document.querySelector('.container');

    let currentTrackIndex = 0;
    let isPlaying = false;
    let audio = new Audio();
    let isShuffle = false;
    let isLoop = false;

    const tracks = [
        { 
            album: 'Other music', albumPfP: 'pictures\\cd.jpg',
            tracks: [
                { src: 'Other music\\Essencen - SAGES.mp3', title: 'Essencen - SAGES', image: 'Other music\\Sages.png', bpm: 130 },
                { src: 'Other music\\Vindu - Shadow Warrior (lofi beats  chillhop  japan).mp3', title: 'Vindu - Shadow Warrior', image: 'Other music\\Vindu.png', bpm: 45 },
                { src: 'Other music\\Kiyaaaa - あちこち (feat.ROSE) MV.mp3', title: 'Kiyaaaa - あちこち (feat.ROSE)', image: 'Other music\\Kiya~.png', bpm: 128 },
                { src: 'Other music\\刀醬 - 5_20AM.mp3', title: '刀醬 - 5:20AM', image: 'Other music\\5_20.png', bpm: 125 }
            ]
        },
        { 
            album: 'My music', albumPfP: 'pictures\\cd.jpg',
            tracks: [
                { src: 'My Music\\Dalmanski - Kawaii X.mp3', title: 'Dalmanski - Kawaii X', image: 'My music pic\\Kawaii X pic.jpg', bpm: 93 },
                { src: 'My Music\\Dalmanski - When.mp3', title: 'Dalmanski - When', image: 'My music pic\\When pic.jpg', bpm: 77 },
                { src: 'My Music\\Dalmanski - Destiny.mp3', title: 'Dalmanski - Destiny', image: 'My music pic\\Destiny pic.jpg', bpm: 124 }
            ]
        },
        { 
            album: 'Nightcore', albumPfP: 'pictures\\cd.jpg',
            tracks: [
                { src: 'Other music\\Nightcore - Mockingbird (Lyrics).mp3', title: 'Nightcore - Mockingbird', image: 'Other music\\Mocking bird.png', bpm: 103 },
            ]
        }
    ];

    let currentAlbum = tracks[0];

    function loadTrack(index) {
        currentTrackIndex = index;
        const track = currentAlbum.tracks[index];
        audio.src = track.src;
        trackTitle.textContent = track.title;
        bpmId.textContent = "BPM: " + track.bpm;
        albumImg.src = track.image;
        albumImg.style.animation = 'none'; albumImg.offsetHeight; albumImg.style.animation = 'fade-in 1s linear';
        bgImg.src = track.image;
        seekBar.value = 0;
        currentTimeEl.textContent = '0:00';
        durationEl.textContent = '0:00';
        stopPulseEffect();
        setPulseSize();
    }

    function updatePlaylist() {
        playlistContainer.innerHTML = '';
        currentAlbum.tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.addEventListener('click', () => {
                loadTrack(index);
                playTrack();
            });
            playlistContainer.appendChild(li);
        });
    }

    const albumContainer = document.querySelector('.album-content');

    function displayAlbums() {
        albumContainer.innerHTML = '';
        tracks.forEach(albumData => {
            const albumDiv = document.createElement('div');
            albumDiv.classList.add('album');
            const albumImg = document.createElement('img');
            albumImg.src = albumData.albumPfP;
            albumImg.alt = albumData.album;
            const albumTitle = document.createElement('div');
            albumTitle.classList.add('album-title');
            albumTitle.textContent = albumData.album;
            albumDiv.appendChild(albumImg);
            albumDiv.appendChild(albumTitle);
            albumContainer.appendChild(albumDiv);
            albumDiv.addEventListener('click', () => {
                currentAlbum = albumData;
                updatePlaylist();
            });
        });
    }

    displayAlbums();
    
    function playTrack() {
        audio.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        startPulseEffect();
    }

    function pauseTrack() {
        audio.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        stopPulseEffect();
    }

    function playPause() {
        if (isPlaying) {
            pauseTrack();
        } else {
            playTrack();
        }
    }

    function backward() {
        if (isShuffle) {
            playShuffle();
        } else {
            currentTrackIndex = (currentTrackIndex > 0) ? currentTrackIndex - 1 : currentAlbum.tracks.length - 1;
            loadTrack(currentTrackIndex);
            playTrack();
        }
    }

    function forward() {
        if (isShuffle) {
            playShuffle();
        } else {
            currentTrackIndex = (currentTrackIndex < currentAlbum.tracks.length - 1) ? currentTrackIndex + 1 : 0;
            loadTrack(currentTrackIndex);
            playTrack();
        }
    }

    function calculatePulseInterval(bpm) {
        return 60000 / bpm;
    }

    function setPulseSize() {
        const containerRect = container.getBoundingClientRect();
        pulse.style.width = `${containerRect.width}px`;
        pulse.style.height = `${containerRect.height}px`;
    }    

    function startPulseEffect() {
        const bpm = currentAlbum.tracks[currentTrackIndex].bpm;
        const pulseIntervalTime = calculatePulseInterval(bpm);
        pulse.style.animation = `pulse-animation ${pulseIntervalTime}ms infinite`;
        container.style.animation = `container-pulse ${pulseIntervalTime}ms infinite`;
        bgImg.style.animation = 'none'; bgImg.offsetHeight; bgImg.style.animation = `moveBg 3s infinite ease-in-out, fade-in 1s linear, bg-pulse ${pulseIntervalTime}ms infinite`;
    }

    function stopPulseEffect() {
        pulse.style.animation = 'none'; 
        container.style.animation = 'none';
        bgImg.style.animation = 'none';
    }

    function playShuffle() {
        let randomIndex;
        do {
            randomIndex = Math.floor(Math.random() * currentAlbum.tracks.length);
        } while (randomIndex === currentTrackIndex);
        loadTrack(randomIndex);
        playTrack();
    }

    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });

    loopBtn.addEventListener('click', () => {
        isLoop = !isLoop;
        loopBtn.classList.toggle('active', isLoop);
    });

    // Load the playlist for the current album ('Other music')
    updatePlaylist();
    loadTrack(currentTrackIndex); // Load the first track when page is ready

    playPauseBtn.addEventListener('click', playPause);
    backwardBtn.addEventListener('click', backward);
    forwardBtn.addEventListener('click', forward);

    function updateSeekBar() {
        if (audio.duration && !isNaN(audio.duration)) {
            const value = (audio.currentTime / audio.duration) * 100;
            seekBar.value = value;
            seekBar.style.background = `linear-gradient(to right, white ${value}%, black ${value}%)`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
            durationEl.textContent = formatTime(audio.duration);
        } else {
            // Reset to default values if duration is invalid
            seekBar.value = 0;
            seekBar.style.background = 'linear-gradient(to right, white 0%, black 0%)';
            currentTimeEl.textContent = '0:00';
            durationEl.textContent = '0:00';
        }
    }

    audio.addEventListener('timeupdate', updateSeekBar);
    audio.addEventListener('loadeddata', updateSeekBar); 
    audio.addEventListener('loadedmetadata', updateSeekBar); 

    audio.addEventListener('ended', () => {
        stopPulseEffect();
        seekBar.value = 0;
        currentTimeEl.textContent = '0:00';
        durationEl.textContent = '0:00';
        if (isShuffle) {
            playShuffle();
        } else if (isLoop) {
            loadTrack(currentTrackIndex);
            playTrack();
        } else {
            forward();
        }
    });

    seekBar.addEventListener('input', () => {
        if (audio.duration && !isNaN(audio.duration)) {
            const value = seekBar.value;
            seekBar.style.background = `linear-gradient(to right, white ${value}%, black ${value}%)`;
            audio.currentTime = (value / 100) * audio.duration;
        }
    });

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === Infinity) {
            return '0:00';
        }
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    window.addEventListener('resize', setPulseSize);

    // Ensure the seek bar resets on load
    seekBar.value = 0;
    seekBar.style.background = 'linear-gradient(to right, white 0%, black 0%)';
});
