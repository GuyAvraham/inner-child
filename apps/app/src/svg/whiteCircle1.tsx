import { SvgXml } from 'react-native-svg';

export function WhiteCircle1SVG() {
  const svgMarkup = `
    <svg width="135" height="135" viewBox="0 0 135 135" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_b_54_2480)">
    <circle cx="67.0935" cy="67.9064" r="67.0791" fill="url(#paint0_radial_54_2480)" fill-opacity="0.55"/>
    <circle cx="67.0935" cy="67.9064" r="66.5791" stroke="url(#paint1_linear_54_2480)" stroke-opacity="0.55"/>
    </g>
    <defs>
    <filter id="filter0_b_54_2480" x="-9.98567" y="-9.17273" width="154.158" height="154.158" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feGaussianBlur in="BackgroundImageFix" stdDeviation="5"/>
    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_54_2480"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_54_2480" result="shape"/>
    </filter>
    <radialGradient id="paint0_radial_54_2480" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(67.0935 67.9064) rotate(90) scale(67.0791)">
    <stop stop-color="white" stop-opacity="0"/>
    <stop offset="1" stop-color="white" stop-opacity="0.35"/>
    </radialGradient>
    <linearGradient id="paint1_linear_54_2480" x1="67.0935" y1="0.827271" x2="67.0935" y2="134.986" gradientUnits="userSpaceOnUse">
    <stop stop-color="#BABBC2"/>
    <stop offset="1" stop-color="white" stop-opacity="0.15"/>
    </linearGradient>
    </defs>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} className="absolute" />;
}
