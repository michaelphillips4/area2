import Player from "./player.js";
const player = new Player();
player.mount();

// Random Bird Image Carousel
async function initRandomBirdCarousel() {
  try {
    const response = await fetch('./data.json');
    const data = await response.json();
    const images = data.items.filter(item => item.endsWith('.jpeg'));
    
    if (images.length === 0) return;
    
    const imageElement = document.getElementById('randomBirdImage');
    if (!imageElement) return;
    
    const imageBaseUrl = 'https://main.d29q1pyma87412.amplifyapp.com/images/';
    let currentIndex = 0;
    
    function getRandomImage() {
      currentIndex = Math.floor(Math.random() * images.length);
      return images[currentIndex];
    }
    
    function changeImage() {
      const nextImage = getRandomImage();
      
      // Fade out
      imageElement.classList.remove('fade-in');
      imageElement.classList.add('fade-out');
      
      setTimeout(() => {
        // Change the image
        imageElement.src = imageBaseUrl + nextImage;
        
        // Fade in
        imageElement.classList.remove('fade-out');
        imageElement.classList.add('fade-in');
      }, 500); // Wait for fade out to complete (0.5 seconds)
    }
    
    // Set initial random image
    imageElement.src = imageBaseUrl + getRandomImage();
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