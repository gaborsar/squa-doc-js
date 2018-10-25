export default function isMobile() {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}
