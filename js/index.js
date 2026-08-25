import Player from "./player.js";
const player = new Player();
player.mount();

const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function setTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} mode`);
  themeToggle.querySelector('span').textContent = `${isDark ? 'Light' : 'Dark'} mode`;
  themeToggle.querySelector('i').className = `fas fa-${isDark ? 'sun' : 'moon'}`;
}

setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
themeToggle.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', nextTheme);
  setTheme(nextTheme);
});

const copyEmailButton = document.getElementById('copy-email');
const emailAddress = document.getElementById('email-address');
const copyEmailStatus = document.getElementById('copy-email-status');

async function copyEmailAddress() {
  const email = emailAddress.textContent.trim();

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(email);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = email;
      textArea.setAttribute('readonly', '');
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      const copied = document.execCommand('copy');
      textArea.remove();
      if (!copied) throw new Error('Copy command failed');
    }

    copyEmailStatus.textContent = 'Email copied';
    copyEmailButton.setAttribute('aria-label', 'Email address copied');
  } catch (error) {
    copyEmailStatus.textContent = 'Unable to copy email';
    console.error('Unable to copy email address:', error);
  }
}

copyEmailButton.addEventListener('click', copyEmailAddress);

// Random Bird Image Carousel
async function initRandomBirdCarousel() {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();
    const images = data.items.filter(item => item.endsWith('.jpeg'));
    
    if (images.length === 0) return;
    
    const imageElement = document.getElementById('randomBirdImage');
    const birdNameElement = document.getElementById('birdName');
    if (!imageElement) return;
    
    const imageBaseUrl = './birds/';
    let currentIndex = 0;
    
    function getRandomImage() {
      currentIndex = Math.floor(Math.random() * images.length);
      return images[currentIndex];
    }

    function getBirdName(filename) {
      const name = filename.replace(/\.jpeg$/i, '').replace(/_/g, ' ');
      return name.toLowerCase().replace(/(^|[\s-])([a-z])/g, (match, separator, letter) =>
        separator + letter.toUpperCase()
      );
    }

    function setImage(filename) {
      const birdName = getBirdName(filename);
      imageElement.src = imageBaseUrl + filename;
      imageElement.alt = birdName;
      if (birdNameElement) birdNameElement.textContent = birdName;
    }
    
    function changeImage() {
      const nextImage = getRandomImage();
      
      // Fade out
      imageElement.classList.remove('fade-in');
      imageElement.classList.add('fade-out');
      
      setTimeout(() => {
        // Change the image
        setImage(nextImage);
        
        // Fade in
        imageElement.classList.remove('fade-out');
        imageElement.classList.add('fade-in');
      }, 500); // Wait for fade out to complete (0.5 seconds)
    }
    
    // Set initial random image
    setImage(getRandomImage());
    imageElement.classList.add('fade-in');
    
    // Change image every 6 seconds
    setInterval(changeImage, 6000);
  } catch (error) {
    console.error('Error loading random bird carousel:', error);
  }
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRandomBirdCarousel);
} else {
  initRandomBirdCarousel();
}