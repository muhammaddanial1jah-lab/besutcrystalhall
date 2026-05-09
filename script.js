// ANDROID DETECTION FOR VIDEO FRAME ALIGNMENT
if (/Android/i.test(navigator.userAgent)) {
    document.documentElement.classList.add('is-android');
}

// splash screen & navigation
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('open-btn');
    const panelLeft = document.getElementById('panel-left');
    const panelRight = document.getElementById('panel-right');
    const splashScreen = document.getElementById('splash-screen');
    const mainContent = document.getElementById('main-content');
    const bottomNav = document.getElementById('bottom-nav');
    const bgMusic = document.getElementById('bg-music');

    // OPENING ANIMATION
    openBtn.addEventListener('click', () => {
        openBtn.classList.add('pop-out');
        
        // Play background music
        if (bgMusic) {
            bgMusic.play().catch(error => {
                console.log("Audio autoplay prevented:", error);
            });
        }

        setTimeout(() => {
            panelLeft.classList.add('slide-left');
            panelRight.classList.add('slide-right');
        }, 300);

        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainContent.classList.remove('opacity-0');
            bottomNav.classList.remove('translate-y-20', 'opacity-0');

            // Auto scroll down slowly after text animations finish (3 seconds delay)
            setTimeout(() => {
                startAutoScroll(mainContent);
            }, 3000);
            
        }, 1500);
    });

    // Continuous auto-scroll using setInterval (more reliable)
    function startAutoScroll(container) {
        // Force disable smooth scrolling so scrollTop works frame by frame
        container.style.scrollBehavior = 'auto';
        container.classList.remove('scroll-smooth');

        let scrollInterval = setInterval(() => {
            container.scrollTop += 1; // scroll 1px every 25ms = ~40px/sec

            // Stop when reached bottom
            if (container.scrollTop >= container.scrollHeight - container.clientHeight - 5) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
        }, 25);

        // Stop auto-scroll when user interacts
        function stopAutoScroll() {
            if (scrollInterval) {
                clearInterval(scrollInterval);
                scrollInterval = null;
            }
            container.removeEventListener('touchstart', stopAutoScroll);
            container.removeEventListener('wheel', stopAutoScroll);
            container.removeEventListener('mousedown', stopAutoScroll);
        }

        container.addEventListener('touchstart', stopAutoScroll, { once: true });
        container.addEventListener('wheel', stopAutoScroll, { once: true });
        container.addEventListener('mousedown', stopAutoScroll, { once: true });
    }

    // COUNTDOWN LOGIC
    // Event date: 10 Mei 2026, 3:30 PM MYT
    const countdownDate = new Date('2026-05-10T15:30:00').getTime(); 
    const daysEl = document.getElementById('cd-days');
    const hoursEl = document.getElementById('cd-hours');
    const minsEl = document.getElementById('cd-mins');
    const secsEl = document.getElementById('cd-secs');

    setInterval(() => {
        const now = new Date().getTime();
        const dist = countdownDate - now;

        if (dist > 0 && daysEl) {
            daysEl.innerText = Math.floor(dist / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            hoursEl.innerText = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            minsEl.innerText = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            secsEl.innerText = Math.floor((dist % (1000 * 60)) / 1000).toString().padStart(2, '0');
        }
    }, 1000);

    // POPUPS TOGGLE
    const popups = ['rsvpPopup', 'phonePopup', 'calendarPopup', 'giftPopup', 'locationPopup', 'paymentPopup'];
    
    window.togglePopup = (popupId) => {
        popups.forEach(id => {
            const el = document.getElementById(id);
            if (!el) return;
            
            if (id === popupId) {
                if (el.classList.contains('hidden')) {
                    el.classList.remove('hidden');
                    el.classList.add('fade-in-up');
                } else {
                    el.classList.add('hidden');
                    el.classList.remove('fade-in-up');
                }
            } else {
                el.classList.add('hidden');
                el.classList.remove('fade-in-up');
            }
        });
    };

    // IMAGE ZOOM MODAL LOGIC
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModalBtn = document.getElementById('close-modal');
    const zoomableImages = document.querySelectorAll('.zoomable-image');

    const openModal = (src) => {
        modalImage.src = src;
        imageModal.classList.remove('hidden');
        imageModal.classList.add('flex');
        
        // Slight delay for animation to trigger
        setTimeout(() => {
            imageModal.classList.remove('opacity-0');
            modalImage.classList.remove('scale-95');
            modalImage.classList.add('scale-100');
        }, 10);
    };

    const closeModal = () => {
        imageModal.classList.add('opacity-0');
        modalImage.classList.remove('scale-100');
        modalImage.classList.add('scale-95');
        
        setTimeout(() => {
            imageModal.classList.add('hidden');
            imageModal.classList.remove('flex');
            modalImage.src = '';
        }, 300);
    };

    zoomableImages.forEach(img => {
        img.addEventListener('click', () => {
            openModal(img.src);
        });
    });

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeModal();
            }
        });
    }

});

// COPY TO CLIPBOARD Helper
function copyText(text, btnId) {
    navigator.clipboard.writeText(text);
    const badge = document.getElementById('copy-badge-' + btnId);
    if(badge) {
        badge.classList.remove('hidden');
        setTimeout(() => { badge.classList.add('hidden'); }, 2000);
    }
}

// CALENDAR FUNCTIONS
window.addToGoogleCalendar = () => {
    const title = encodeURIComponent('Majlis Kesyukuran & Jamuan Raya');
    const details = encodeURIComponent('Turut mengundang Dato/Datin/Tuan/Puan/Cik/Encik ke majlis kami.');
    const dates = '20260510T073000Z/20260510T103000Z'; // 3.30 PM - 6.30 PM MYT (UTC+8)
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}`;
    window.open(url, '_blank');
};

window.addToAppleCalendar = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Kad Jemputan//EN
BEGIN:VEVENT
DTSTART:20260510T073000Z
DTEND:20260510T103000Z
SUMMARY:Majlis Kesyukuran & Jamuan Raya
DESCRIPTION:Turut mengundang Dato/Datin/Tuan/Puan/Cik/Encik ke majlis kami.
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'majlis-kesyukuran.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
