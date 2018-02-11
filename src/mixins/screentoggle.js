export const ScreenToggle = {
    methods: {
        toggleFullscreen() {
            if (navigator.userAgent.indexOf('Firefox') > -1)
            // Firefox handling
            if (document.mozFullScreen) {
                document.mozCancelFullScreen();
                this.setFullscreen(false);
            }
            else {
                document.documentElement.mozRequestFullScreen();
                this.setFullscreen(true);
            }
        else if (navigator.userAgent.indexOf('Chrome') > -1)
            // Chrome handling
            if (document.webkitFullscreenElement) {
                document.webkitExitFullscreen();
                this.setFullscreen(false);
            }
            else {
                document.body.webkitRequestFullScreen();
                this.setFullscreen(true);
            }
        else
            // Unsupported browsers
            this.addDebugMessage('Unsupported browser');
        }
    }
};