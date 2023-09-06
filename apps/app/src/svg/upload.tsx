import { SvgXml } from 'react-native-svg';

export function UploadSVG() {
  const svgMarkup = `
    <svg width="83" height="84" viewBox="0 0 83 84" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M41.3202 83.7914C63.8492 83.7914 82.1115 65.1233 82.1115 42.0936C82.1115 19.0639 63.8492 0.395752 41.3202 0.395752C18.7911 0.395752 0.528793 19.0639 0.528793 42.0936C0.528793 65.1233 18.7911 83.7914 41.3202 83.7914Z" fill="url(#paint0_linear_54_2481)"/>
    <path d="M26.5899 51.1578V54.7837C26.5899 55.7453 26.9719 56.6676 27.6519 57.3476C28.3318 58.0275 29.2541 58.4096 30.2158 58.4096H51.9711C52.9328 58.4096 53.8551 58.0275 54.535 57.3476C55.215 56.6676 55.597 55.7453 55.597 54.7837V51.1578M32.0287 36.6542L41.0934 27.5894M41.0934 27.5894L50.1582 36.6542M41.0934 27.5894V49.3448" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <defs>
    <linearGradient id="paint0_linear_54_2481" x1="42.2266" y1="0.395752" x2="42.2266" y2="83.7914" gradientUnits="userSpaceOnUse">
    <stop stop-color="#22AFFE"/>
    <stop offset="0.333333" stop-color="#3687FF"/>
    <stop offset="1" stop-color="#1166B4"/>
    </linearGradient>
    </defs>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}
