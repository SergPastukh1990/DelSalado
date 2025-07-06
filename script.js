document.addEventListener('DOMContentLoaded', () => {
    const presentation = document.getElementById('presentation');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const dotPagination = document.getElementById('dot-pagination');

    let currentSlide = 0;
    let isWheeling = false;
    const totalSlides = slides.length;

    function animateCounter(el) {
        const to = parseInt(el.dataset.to, 10);
        const from = parseInt(el.dataset.from, 10);
        const duration = 1500; // ms
        let start = null;

        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            el.textContent = Math.floor(progress * (to - from) + from);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    function createDots() {
        for (let i = 0; i < totalSlides; i++) {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.dataset.index = i;
            li.appendChild(button);
            dotPagination.appendChild(li);
            
            button.addEventListener('click', () => {
                showSlide(i);
            });
        }
    }

    function updateDots(index) {
        const dots = dotPagination.querySelectorAll('li');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    function updateProgressBar(index) {
        const progress = ((index) / (totalSlides - 1)) * 100;
        document.documentElement.style.setProperty('--prog', `${progress}%`);
    }
    
    function showSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        
        slides.forEach((slide) => {
            slide.classList.remove('active');
        });

        slides[index].classList.add('active');
        
        currentSlide = index;

        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === totalSlides - 1;

        updateDots(index);
        updateProgressBar(index);
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    // Throttle function for wheel event
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    const handleWheel = throttle((e) => {
        if (e.deltaY > 0) {
            nextSlide();
        } else {
            prevSlide();
        }
    }, 800);
    
    // Intersection Observer for animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        });
    }, { threshold: 0.5 });

    slides.forEach(slide => {
        observer.observe(slide);
    });

    // Event Listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
        }
    });

    presentation.addEventListener('wheel', handleWheel);

    // Initialization
    createDots();
    showSlide(0);
}); 