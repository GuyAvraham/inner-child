import { SvgXml } from 'react-native-svg';

export function RefreshChatSVG() {
  const svgMarkup = `
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 11.5C19.7554 9.74017 18.9391 8.10961 17.6766 6.85945C16.4142 5.60928 14.7758 4.80887 13.0137 4.5815C11.2516 4.35414 9.46362 4.71243 7.9252 5.6012C6.38678 6.48996 5.18325 7.85989 4.5 9.49995M4 5.49995V9.49995H8M4 13.5C4.24456 15.2597 5.06093 16.8903 6.32336 18.1405C7.58579 19.3906 9.22424 20.191 10.9863 20.4184C12.7484 20.6458 14.5364 20.2875 16.0748 19.3987C17.6132 18.5099 18.8168 17.14 19.5 15.5M20 19.5V15.5H16" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}
