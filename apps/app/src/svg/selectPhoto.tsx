import { SvgXml } from 'react-native-svg';

export function SelectPhotoSVG() {
  const svgMarkup = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 8H15.01M12 20H7C6.20435 20 5.44129 19.6839 4.87868 19.1213C4.31607 18.5587 4 17.7956 4 17V7C4 6.20435 4.31607 5.44129 4.87868 4.87868C5.44129 4.31607 6.20435 4 7 4H17C17.7956 4 18.5587 4.31607 19.1213 4.87868C19.6839 5.44129 20 6.20435 20 7V12M4 15L8 11C8.928 10.107 10.072 10.107 11 11L15 15M14 14L15 13C15.617 12.407 16.328 12.207 17.009 12.402M16 19H22M19 16V22" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}
