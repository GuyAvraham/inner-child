import { SvgXml } from 'react-native-svg';

export function WhiteCircle2SVG() {
  const svgMarkup = `
    <svg width="182" height="182" viewBox="0 0 182 182" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_b_54_2479)">
    <circle cx="91.0935" cy="90.9065" r="90.6475" fill="url(#paint0_radial_54_2479)" fill-opacity="0.55"/>
    </g>
    <defs>
    <filter id="filter0_b_54_2479" x="-9.55394" y="-9.74103" width="201.295" height="201.295" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feGaussianBlur in="BackgroundImageFix" stdDeviation="5"/>
    <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_54_2479"/>
    <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_54_2479" result="shape"/>
    </filter>
    <radialGradient id="paint0_radial_54_2479" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(91.0935 90.9065) rotate(90) scale(90.6475)">
    <stop stop-color="white" stop-opacity="0"/>
    <stop offset="1" stop-color="white" stop-opacity="0.35"/>
    </radialGradient>
    </defs>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} className="absolute" />;
}
