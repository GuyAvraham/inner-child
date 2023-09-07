import { SvgXml } from 'react-native-svg';

export function SendMessageSVG() {
  const svgMarkup = `
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="36" height="36" rx="4" fill="#4285F4"/>
    <path d="M26.3334 9.66663L17.1667 18.8333" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M26.3334 9.66663L20.5001 26.3333L17.1667 18.8333L9.66675 15.5L26.3334 9.66663Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}
