// 音乐播放控制
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;

// 预加载音乐
bgMusic.load();

// 监听音频加载状态
bgMusic.addEventListener('loadeddata', () => {
    console.log('Music file loaded and ready to play');
    tryAutoplay();
});

// 尝试自动播放音乐
async function tryAutoplay() {
    try {
        // 设置音量渐入效果
        bgMusic.volume = 0;
        await bgMusic.play();
        isMusicPlaying = true;
        musicToggle.style.animation = 'rotate 3s linear infinite';
        
        // 音量渐入效果
        let volume = 0;
        const fadeIn = setInterval(() => {
            if (volume < 1) {
                volume += 0.1;
                bgMusic.volume = volume;
            } else {
                clearInterval(fadeIn);
            }
        }, 100);
    } catch (err) {
        console.log('Auto-play was prevented. Please click the music button to play.');
        // 如果自动播放失败，添加点击事件监听
        document.addEventListener('click', () => {
            if (!isMusicPlaying) {
                tryAutoplay();
            }
        }, { once: true });
    }
}

// 点击播放按钮控制
musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
        bgMusic.pause();
        musicToggle.style.animation = 'none';
    } else {
        bgMusic.play();
        musicToggle.style.animation = 'rotate 3s linear infinite';
    }
    isMusicPlaying = !isMusicPlaying;
});

// 每日情话
const loveQuotes = [
    "Meeting you was the best thing that ever happened to me.",
    "Every moment with you is a blessing.",
    "You are my today and all of my tomorrows.",
    "In your eyes, I found my home.",
    "With you, every day feels like a beautiful adventure.",
    "You make my heart smile.",
    "Distance means so little when someone means so much.",
    "You are my favorite hello and my hardest goodbye.",
    "Life is beautiful because of you.",
    "You are the reason I believe in love."
];

function updateDailyQuote() {
    const quoteElement = document.getElementById('loveQuote');
    const randomIndex = Math.floor(Math.random() * loveQuotes.length);
    quoteElement.textContent = loveQuotes[randomIndex];
}

// 每天更新一次情话
updateDailyQuote();
setInterval(updateDailyQuote, 24 * 60 * 60 * 1000);

// 恋爱计时器功能
const startDate = new Date('2024-07-31').getTime();

function updateTimer() {
    const now = new Date().getTime();
    const distance = now - startDate;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days;
    document.getElementById('hours').textContent = hours;
    document.getElementById('minutes').textContent = minutes;
    document.getElementById('seconds').textContent = seconds;
}

// 每秒更新一次计时器
setInterval(updateTimer, 1000);
updateTimer();

// 鼠标移动爱心效果
let mouseX = 0;
let mouseY = 0;
let heartInterval;

function createMovingHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = (mouseX - 8) + 'px';
    heart.style.top = (mouseY - 8) + 'px';
    heart.style.animationDuration = '0.8s';
    heart.style.opacity = '0.7';
    heart.style.width = '16px';
    heart.style.height = '16px';
    document.querySelector('.floating-hearts').appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 800);
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!heartInterval) {
        heartInterval = setInterval(createMovingHeart, 50);
    }
});

// 鼠标停止移动2秒后停止创建爱心
document.addEventListener('mousemove', () => {
    clearTimeout(window.moveTimeout);
    window.moveTimeout = setTimeout(() => {
        clearInterval(heartInterval);
        heartInterval = null;
    }, 2000);
});

// 爱心爆炸特效
function createExplosionHeart(x, y, angle, distance) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.style.left = x + 'px';
    heart.style.top = y + 'px';
    heart.style.opacity = '0.8';
    
    const animation = heart.animate([
        {
            transform: 'translate(0, 0) scale(1)',
            opacity: 0.8
        },
        {
            transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
            opacity: 0
        }
    ], {
        duration: 1000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    });
    
    document.querySelector('.floating-hearts').appendChild(heart);
    
    animation.onfinish = () => heart.remove();
}

// 点击时创建爱心爆炸效果
document.addEventListener('click', (e) => {
    const numHearts = 12;
    for (let i = 0; i < numHearts; i++) {
        const angle = (i * 2 * Math.PI) / numHearts;
        createExplosionHeart(e.clientX, e.clientY, angle, 100);
    }
});
function createHeartExplosion(x, y) {
    const numberOfHearts = 12;
    const distance = 100;
    
    for (let i = 0; i < numberOfHearts; i++) {
        const angle = (i / numberOfHearts) * Math.PI * 2;
        createExplosionHeart(x, y, angle, distance);
    }
}

// 添加点击事件监听器
document.addEventListener('click', (e) => {
    createHeartExplosion(e.clientX, e.clientY);
});

// 照片轮播功能
class Carousel {
    constructor() {
        this.gallery = document.querySelector('.photo-gallery');
        this.items = document.querySelectorAll('.photo-item');
        this.currentIndex = 0;
        this.isAnimating = false;
        
        this.setupGallery();
        this.setupControls();
        this.startAutoPlay();
    }

    setupGallery() {
        this.gallery.style.position = 'relative';
        this.gallery.style.overflow = 'hidden';
        
        this.items.forEach((item, index) => {
            item.style.position = 'absolute';
            item.style.width = '100%';
            item.style.transition = 'transform 0.5s ease';
            item.style.transform = `translateX(${index * 100}%)`;
        });
    }

    setupControls() {
        const controls = document.createElement('div');
        controls.className = 'carousel-controls';
        
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '❮';
        prevBtn.className = 'carousel-btn prev';
        prevBtn.onclick = () => this.slide('prev');

        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = '❯';
        nextBtn.className = 'carousel-btn next';
        nextBtn.onclick = () => this.slide('next');

        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);
        this.gallery.appendChild(controls);
    }

    slide(direction) {
        if (this.isAnimating) return;
        this.isAnimating = true;

        const offset = direction === 'next' ? -1 : 1;
        const items = Array.from(this.items);
        
        this.currentIndex = (this.currentIndex + offset + items.length) % items.length;

        items.forEach((item, index) => {
            const position = (index - this.currentIndex + items.length) % items.length;
            item.style.transform = `translateX(${position * 100}%)`;
        });

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    startAutoPlay() {
        setInterval(() => {
            this.slide('next');
        }, 5000);
    }
}

// 留言板功能
class MessageBoard {
    constructor() {
        this.messages = JSON.parse(localStorage.getItem('messages')) || [];
        this.messageForm = document.querySelector('.message-form');
        this.messagesContainer = document.getElementById('messages');
        
        this.setupEventListeners();
        this.renderMessages();
    }

    setupEventListeners() {
        this.messageForm.querySelector('button').addEventListener('click', (e) => {
            e.preventDefault();
            this.submitMessage();
        });
    }

    submitMessage() {
        const textarea = this.messageForm.querySelector('textarea');
        const content = textarea.value.trim();
        
        if (!content) return;

        const message = {
            id: Date.now(),
            content,
            date: new Date().toLocaleString()
        };

        this.messages.unshift(message);
        localStorage.setItem('messages', JSON.stringify(this.messages));
        
        this.renderMessages();
        textarea.value = '';
        this.showSuccessAnimation();
    }

    renderMessages() {
        this.messagesContainer.innerHTML = this.messages.map(msg => `
            <div class="message-item" data-id="${msg.id}">
                <p>${msg.content}</p>
                <small>${msg.date}</small>
                <button class="delete-btn" onclick="messageBoard.deleteMessage(${msg.id})">Delete</button>
            </div>
        `).join('');
    }

    deleteMessage(id) {
        this.messages = this.messages.filter(msg => msg.id !== id);
        localStorage.setItem('messages', JSON.stringify(this.messages));
        this.renderMessages();
    }

    showSuccessAnimation() {
        const success = document.createElement('div');
        success.className = 'success-animation';
        success.textContent = 'Message sent successfully!';
        document.body.appendChild(success);

        setTimeout(() => {
            success.remove();
        }, 2000);
    }
}

// 折叠功能
function toggleList(listId) {
    const list = document.getElementById(listId);
    list.style.maxHeight = list.style.maxHeight ? null : list.scrollHeight + "px";
}

// 初始化功能
document.addEventListener('DOMContentLoaded', () => {
    // 初始化视差效果
    const scene = document.getElementById('scene');
    const parallaxInstance = new Parallax(scene, {
        relativeInput: true,
        hoverOnly: false,
        calibrationThreshold: 100,
        calibrationDelay: 500,
        supportDelay: 500,
        calibrateX: true,
        calibrateY: true,
        invertX: false,
        invertY: false,
        limitX: false,
        limitY: false,
        scalarX: 2.0,
        scalarY: 2.0,
        frictionX: 0.1,
        frictionY: 0.1,
        originX: 0.5,
        originY: 0.5
    });

    new Carousel();
    window.messageBoard = new MessageBoard();

    // 点击特效
    document.addEventListener('click', (e) => {
        createHeartExplosion(e.clientX, e.clientY);
    });

    // 电影列表折叠功能
    const movieTitle = document.querySelector('.clickable-title');
    const moviesContainer = document.querySelector('.movies-container');
    let isExpanded = true; // 默认展开状态

    function toggleMovieList() {
        isExpanded = !isExpanded;
        moviesContainer.style.display = isExpanded ? 'block' : 'none';
        movieTitle.textContent = `Movies We Watched Together ${isExpanded ? '▼' : '▶'}`;
    }

    movieTitle.addEventListener('click', toggleMovieList);
});