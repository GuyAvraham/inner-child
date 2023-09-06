import { SvgXml } from 'react-native-svg';

export function ReplacePhotoSVG() {
  const svgMarkup = `
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.5 11V8C21.5 7.46957 21.2893 6.96086 20.9142 6.58579C20.5391 6.21071 20.0304 6 19.5 6H13.5M13.5 6L16.5 9M13.5 6L16.5 3M3.5 13V16C3.5 16.5304 3.71071 17.0391 4.08579 17.4142C4.46086 17.7893 4.96957 18 5.5 18H11.5M11.5 18L8.5 15M11.5 18L8.5 21M4.5 3H8.5C9.05228 3 9.5 3.44772 9.5 4V8C9.5 8.55228 9.05228 9 8.5 9H4.5C3.94772 9 3.5 8.55228 3.5 8V4C3.5 3.44772 3.94772 3 4.5 3ZM16.5 15H20.5C21.0523 15 21.5 15.4477 21.5 16V20C21.5 20.5523 21.0523 21 20.5 21H16.5C15.9477 21 15.5 20.5523 15.5 20V16C15.5 15.4477 15.9477 15 16.5 15Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}
