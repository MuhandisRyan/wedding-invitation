// ========================================
// WEDDING INVITATION SCRIPT
// Handles URL parameter extraction & personalization
// ========================================

(function() {
    'use strict';

    // Get recipient name from URL parameter ?to=
    function getRecipientName() {
        const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('to');
        
        if (!name || name.trim() === '') {
            return 'Guest';
        }
        
        // Decode URL encoding (handles spaces and special chars)
        const decodedName = decodeURIComponent(name.trim());
        
        // Capitalize each word
        return decodedName
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
    }

    // Update all name placeholders
    function updateInvitation() {
        const recipientName = getRecipientName();
        
        // Update video overlay names
        const videoNameEn = document.getElementById('videoNameEn');
        const videoNameAr = document.getElementById('videoNameAr');
        const cardNameText = document.getElementById('cardNameText');
        
        if (videoNameEn) {
            videoNameEn.textContent = `Dear ${recipientName}`;
        }
        
        if (videoNameAr) {
            // Arabic translation with name
            videoNameAr.textContent = recipientName === 'Guest' 
                ? 'عزيزي الضيف' 
                : `عزيزي ${recipientName}`;
        }
        
        if (cardNameText) {
            cardNameText.textContent = recipientName;
        }
        
        // Update page title
        document.title = `Wedding Invitation - ${recipientName}`;
    }

    // Ensure video plays on mobile (iOS workaround)
    function initVideo() {
        const video = document.getElementById('inviteVideo');
        
        if (video) {
            video.muted = true;
            video.playsInline = true;
            
            // Attempt autoplay
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Autoplay prevented, user interaction required');
                    
                    // Fallback: play on first touch/click
                    document.body.addEventListener('click', function playOnce() {
                        video.play();
                        document.body.removeEventListener('click', playOnce);
                    }, { once: true });
                });
            }
        }
    }

    // Initialize on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            updateInvitation();
            initVideo();
        });
    } else {
        updateInvitation();
        initVideo();
    }
})();