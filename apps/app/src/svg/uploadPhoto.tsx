import { SvgXml } from 'react-native-svg';

export function UploadPhotoSVG() {
  const svgMarkup = `
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 8H15.51M12.5 20H7.5C6.70435 20 5.94129 19.6839 5.37868 19.1213C4.81607 18.5587 4.5 17.7956 4.5 17V7C4.5 6.20435 4.81607 5.44129 5.37868 4.87868C5.94129 4.31607 6.70435 4 7.5 4H17.5C18.2956 4 19.0587 4.31607 19.6213 4.87868C20.1839 5.44129 20.5 6.20435 20.5 7V12M4.5 15L8.5 11C9.428 10.107 10.572 10.107 11.5 11L15.5 15M14.5 14L15.5 13C16.117 12.407 16.828 12.207 17.509 12.402M19.5 22V16M19.5 16L22.5 19M19.5 16L16.5 19" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}
