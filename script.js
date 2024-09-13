document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.getElementById('play-pause');
    const backwardBtn = document.getElementById('backward');
    const forwardBtn = document.getElementById('forward');
    const trackTitle = document.getElementById('track-title');
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
    let pulseInterval;

    const tracks = [
        { src: 'Other music\\Kiyaaaa - あちこち (feat.ROSE) MV.mp3', title: 'Kiyaaaa - あちこち (feat.ROSE) MV', image: 'Other music\\Kiya~.png', bpm: 128 },
        { src: 'My Music\\Dalmanski - Kawaii X.mp3', title: 'Dalmanski - Kawaii X', image: 'My music pic\\Kawaii X pic.jpg', bpm: 93 },
        { src: 'My Music\\Dalmanski - When.mp3', title: 'Dalmanski - When', image: 'My music pic\\When pic.jpg', bpm: 77 },
        { src: 'My Music\\Dalmanski - Destiny.mp3', title: 'Dalmanski - Destiny', image: 'My music pic\\Destiny pic.jpg', bpm: 124 }    
    ];

    function setPulseSize() {
        const containerRect = container.getBoundingClientRect();
        pulse.style.width = `${containerRect.width}px`;
        pulse.style.height = `${containerRect.height}px`;
    }

    function loadTrack(index) {
        currentTrackIndex = index; // Update current track index
        audio.src = tracks[index].src;
        trackTitle.textContent = tracks[index].title + " (BPM: " + tracks[index].bpm + ")";
        albumImg.src = tracks[index].image;
        bgImg.src = tracks[index].image;
        seekBar.value = 0;
        currentTimeEl.textContent = '0:00';
        durationEl.textContent = '0:00';
        stopPulseEffect();
        setPulseSize();
    }

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
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            loadTrack(currentTrackIndex);
            playTrack(); 
        }
    }

    function forward() {
        if (currentTrackIndex < tracks.length - 1) {
            currentTrackIndex++;
            loadTrack(currentTrackIndex);
            playTrack(); 
        }
    }

    function calculatePulseInterval(bpm) {
        return 60000 / bpm; // Interval in milliseconds
    }

    function startPulseEffect() {
        const bpm = tracks[currentTrackIndex].bpm;
        const pulseIntervalTime = calculatePulseInterval(bpm);
        pulse.style.animation = `pulse-animation ${pulseIntervalTime}ms infinite`;
        container.style.animation = `container-pulse ${pulseIntervalTime}ms infinite`;
    }

    function stopPulseEffect() {
        pulse.style.animation = 'none'; 
        container.style.animation = 'none';
    }

    function updatePlaylist() {
        playlistContainer.innerHTML = ''; // Clear existing playlist items
        tracks.forEach((track, index) => {
            const li = document.createElement('li');
            li.textContent = track.title;
            li.addEventListener('click', () => {
                loadTrack(index);
                playTrack();
            });
            playlistContainer.appendChild(li);
        });
    }

    // Initial playlist setup
    updatePlaylist();

    playPauseBtn.addEventListener('click', playPause);
    backwardBtn.addEventListener('click', backward);
    forwardBtn.addEventListener('click', forward);

    audio.addEventListener('timeupdate', () => {
        seekBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    });

    audio.addEventListener('ended', () => {
        stopPulseEffect(); 
        seekBar.value = 0; 
        currentTimeEl.textContent = '0:00'; 
        durationEl.textContent = '0:00'; 
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Change button to play
        isPlaying = false; 
    });

    seekBar.addEventListener('input', () => {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Load the first track initially without starting the pulse effect
    loadTrack(currentTrackIndex);
});
