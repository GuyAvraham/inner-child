import { SvgXml } from 'react-native-svg';

export function ChangeAgeVG() {
  const svgMarkup = `
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="20.4837" cy="20.4837" r="13.1982" transform="rotate(-81.9392 20.4837 20.4837)" fill="url(#paint0_linear_92_4093)" stroke="url(#paint1_linear_92_4093)"/>
    <path d="M16.3333 21.6667V22.25C16.3333 24.5053 18.124 26.3333 20.3333 26.3333M16.3333 21.6667L15 23M16.3333 21.6667L17.6667 23M23.6667 19L25 20.3333L26.3333 19M25 19.6667V19.0833C25 16.828 23.2093 15 21 15M19 17C19 18.1046 18.1046 19 17 19C15.8954 19 15 18.1046 15 17C15 15.8954 15.8954 15 17 15C18.1046 15 19 15.8954 19 17ZM27 25C27 26.1046 26.1046 27 25 27C23.8954 27 23 26.1046 23 25C23 23.8954 23.8954 23 25 23C26.1046 23 27 23.8954 27 25Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
    <defs>
    <linearGradient id="paint0_linear_92_4093" x1="20.7881" y1="6.78547" x2="20.7881" y2="34.1818" gradientUnits="userSpaceOnUse">
    <stop stop-color="#22AFFE"/>
    <stop offset="0.333333" stop-color="#3687FF"/>
    <stop offset="1" stop-color="#1166B4"/>
    </linearGradient>
    <linearGradient id="paint1_linear_92_4093" x1="20.7881" y1="6.78547" x2="20.7881" y2="34.1818" gradientUnits="userSpaceOnUse">
    <stop stop-color="#22AFFE"/>
    <stop offset="0.333333" stop-color="#3687FF"/>
    <stop offset="1" stop-color="#1166B4"/>
    </linearGradient>
    </defs>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}
