document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    const reviewsSlider = document.querySelector('.reviews-slider');
    if (reviewsSlider) {
        const track = reviewsSlider.querySelector('.reviews-track');
        const viewport = reviewsSlider.querySelector('.reviews-viewport');
        const dots = reviewsSlider.querySelector('.reviews-dots');
        const cards = Array.from(track.children);
        let index = 0;
        let maxIndex = 0;
        let gap = 18;
        let offsetX = 0;
        let isDragging = false;
        let dragStartX = 0;
        let dragStartOffset = 0;
        let cardStep = 0;
        let maxOffset = 0;
        let timer = null;

        const getPerView = function() {
            if (window.matchMedia('(max-width: 480px)').matches) return 1;
            if (window.matchMedia('(max-width: 768px)').matches) return 2;
            return 4;
        };

        const readGap = function() {
            const g = window.getComputedStyle(track).gap;
            const value = parseFloat(g);
            return Number.isFinite(value) ? value : 18;
        };

        const translateTo = function(targetIndex) {
            index = Math.max(0, Math.min(maxIndex, targetIndex));
            const cardWidth = cards[0] ? cards[0].getBoundingClientRect().width : 0;
            cardStep = cardWidth + gap;
            offsetX = cardStep * index;
            track.style.transform = `translateX(${-offsetX}px)`;

            const dotEls = dots ? dots.querySelectorAll('.reviews-dot') : [];
            dotEls.forEach(function(el, i) {
                el.classList.toggle('is-active', i === index);
            });
        };

        const renderDots = function() {
            if (!dots) return;
            dots.innerHTML = '';
            for (let i = 0; i <= maxIndex; i++) {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = `reviews-dot${i === index ? ' is-active' : ''}`;
                btn.setAttribute('aria-label', `Slide ${i + 1}`);
                btn.addEventListener('click', function() {
                    translateTo(i);
                    restart();
                });
                dots.appendChild(btn);
            }
        };

        const layout = function() {
            gap = readGap();
            const perView = getPerView();
            maxIndex = Math.max(0, cards.length - perView);
            const cardWidth = cards[0] ? cards[0].getBoundingClientRect().width : 0;
            cardStep = cardWidth + gap;
            maxOffset = cardStep * maxIndex;
            if (index > maxIndex) index = maxIndex;
            renderDots();
            translateTo(index);
            viewport.style.overflowX = 'hidden';
        };

        const next = function() {
            if (maxIndex <= 0) return;
            translateTo(index >= maxIndex ? 0 : index + 1);
        };

        const start = function() {
            if (timer || maxIndex <= 0) return;
            timer = window.setInterval(next, 4500);
        };

        const stop = function() {
            if (!timer) return;
            window.clearInterval(timer);
            timer = null;
        };

        const restart = function() {
            stop();
            start();
        };

        const clampOffset = function(value) {
            return Math.max(0, Math.min(maxOffset, value));
        };

        const setOffset = function(value) {
            offsetX = clampOffset(value);
            track.style.transform = `translateX(${-offsetX}px)`;
        };

        const snapToNearest = function() {
            if (!cardStep) return;
            const nextIndex = Math.round(offsetX / cardStep);
            translateTo(nextIndex);
        };

        viewport.addEventListener('pointerdown', function(e) {
            if (e.button !== undefined && e.button !== 0) return;
            if (!cards.length) return;

            isDragging = true;
            dragStartX = e.clientX;
            dragStartOffset = offsetX;
            viewport.classList.add('is-dragging');
            track.style.transition = 'none';
            stop();
            viewport.setPointerCapture(e.pointerId);
        });

        viewport.addEventListener('pointermove', function(e) {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            setOffset(dragStartOffset - dx);
        });

        const endDrag = function(e) {
            if (!isDragging) return;
            isDragging = false;
            viewport.classList.remove('is-dragging');
            track.style.transition = '';
            snapToNearest();
            start();
            try {
                viewport.releasePointerCapture(e.pointerId);
            } catch {}
        };

        viewport.addEventListener('pointerup', endDrag);
        viewport.addEventListener('pointercancel', endDrag);
        viewport.addEventListener('lostpointercapture', function() {
            if (!isDragging) return;
            isDragging = false;
            viewport.classList.remove('is-dragging');
            track.style.transition = '';
            snapToNearest();
            start();
        });

        reviewsSlider.addEventListener('mouseenter', stop);
        reviewsSlider.addEventListener('mouseleave', start);
        reviewsSlider.addEventListener('focusin', stop);
        reviewsSlider.addEventListener('focusout', start);
        window.addEventListener('resize', function() {
            layout();
            restart();
        });

        requestAnimationFrame(function() {
            layout();
            start();
        });
    }

    const bookingForm = document.getElementById('bookingForm');
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const pickupLocation = document.getElementById('pickupLocation').value;
        const pickupDate = document.getElementById('pickupDate').value;
        const pickupTime = document.getElementById('pickupTime').value;
        const returnDate = document.getElementById('returnDate').value;
        const returnTime = document.getElementById('returnTime').value;
        const driverAge = document.getElementById('driverAge').value;
        
        const whatsappNumber = '212635225668';
        const message = `Bonjour, je voudrais louer une voiture chez Ironclad Rentals:
- Lieu de prise: ${pickupLocation}
- Date de prise: ${pickupDate} à ${pickupTime}
- Date de retour: ${returnDate} à ${returnTime}
- Age du conducteur: ${driverAge} ans`;
        
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    window.bookVehicle = function(vehicleName) {
        const whatsappNumber = '212635225668';
        const message = `Bonjour, je voudrais louer un ${vehicleName} chez Ironclad Rentals`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const pickupLocationField = document.getElementById('pickupLocationField');
    const differentDropoff = document.getElementById('differentDropoff');
    const dropoffLocationWrapper = document.getElementById('dropoffLocationWrapper');
    const dropoffLocation = document.getElementById('dropoffLocation');

    differentDropoff.addEventListener('change', function() {
        const showDropoff = this.checked;
        dropoffLocationWrapper.hidden = !showDropoff;
        dropoffLocationWrapper.setAttribute('aria-hidden', String(!showDropoff));
        pickupLocationField.classList.toggle('booking-field--full', !showDropoff);

        if (!showDropoff) {
            dropoffLocation.value = '';
        }
    });

    const currentYear = new Date().getFullYear();
    document.querySelector('.footer-bottom p').textContent = `© ${currentYear} Ironclad Rentals. All rights reserved.`;
});
