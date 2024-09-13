document.addEventListener('DOMContentLoaded', () => {
    const playPauseBtn = document.getElementById('play-pause');
    const backwardBtn = document.getElementById('backward');
    const forwardBtn = document.getElementById('forward');
    const trackTitle = document.getElementById('track-title');
    const seekBar = document.getElementById('seek-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const albumImg = document.getElementById('album-img');
    const playlistItems = document.querySelectorAll('#playlist li'); // Select all playlist items
    
    let currentTrackIndex = 0;
    let isPlaying = false;
    let audio = new Audio();
    
    const tracks = [
        { src: 'My Music\\Dalmanski - Kawaii X.mp3', title: 'Dalmanski - Kawaii X', image: 'My music pic\\Kawaii X pic.jpg' },
        { src: 'My Music\\Dalmanski - When.mp3', title: 'Dalmanski - When', image: 'My music pic\\When pic.jpg' },
        { src: 'My Music\\Dalmanski - Destiny.mp3', title: 'Dalmanski - Destiny', image: 'My music pic\\Destiny pic.jpg' }
    ];

    function loadTrack(index) {
        currentTrackIndex = index; // Update current track index
        audio.src = tracks[index].src;
        trackTitle.textContent = tracks[index].title;
        albumImg.src = tracks[index].image;
        seekBar.value = 0;
        currentTimeEl.textContent = '0:00';
        durationEl.textContent = '0:00';
        
        // Add animation class to trigger fade-in
        albumImg.classList.add('fade-in');
        
        // Remove animation class after animation completes
        setTimeout(() => {
            albumImg.classList.remove('fade-in');
        }, 300); // Adjust the delay to match your CSS animation duration
    }

    function playTrack() {
        audio.play();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }

    function pauseTrack() {
        audio.pause();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
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

    // Add event listeners to the playlist items
    playlistItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            loadTrack(index);
            playTrack(); // Automatically play the track when clicked
        });
    });

    playPauseBtn.addEventListener('click', playPause);
    backwardBtn.addEventListener('click', backward);
    forwardBtn.addEventListener('click', forward);

    audio.addEventListener('timeupdate', () => {
        seekBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    });

    seekBar.addEventListener('input', () => {
        audio.currentTime = (seekBar.value / 100) * audio.duration;
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Load the first track initially
    loadTrack(currentTrackIndex);
});
