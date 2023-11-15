import { SvgXml } from 'react-native-svg';

export function LogoSVG() {
  const svgMarkup = `
    <svg width="46" height="55" viewBox="0 0 46 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <g filter="url(#filter0_i_295_2558)">
    <path d="M25.9576 0.00278602C17.862 -0.131908 10.4078 4.62727 7.0678 12.1252C5.87337 14.8191 5.25403 17.6926 5.25403 20.6558V22.362C5.0992 23.0579 4.50198 23.7538 3.88264 24.3824L3.13059 25.1007C1.7592 26.4252 1.11775 27.0763 0.918673 27.3232C0.520528 27.7946 0.277217 28.2661 0.122383 28.7375C-0.386358 30.3089 0.830196 31.0722 1.22834 31.3416C1.60437 31.566 2.02463 31.7905 2.51125 32.015C2.88728 32.1946 3.30754 32.3742 3.68357 32.5538C3.72781 32.5763 3.79417 32.5987 3.8384 32.6212C4.14807 34.7089 5.32039 42.6109 5.34251 42.6783C5.49734 44.0028 5.93972 45.013 6.66966 45.6865C7.95257 46.8763 9.67787 46.8313 11.0714 46.7864C12.111 46.764 12.9957 46.764 13.9469 46.764C14.0132 47.5946 14.0796 48.8293 14.1459 49.9069C14.2344 51.0967 14.3008 52.3313 14.3671 53.2742C14.3892 53.7905 14.6547 54.262 15.0528 54.5987C15.3625 54.8456 15.7606 54.9803 16.1367 54.9803C16.2473 54.9803 16.38 54.9579 16.4906 54.9354L39.06 50.5296C40.2765 50.2826 41.2198 49.0314 41.2198 47.7742V43.5987C41.2198 38.6824 42.2594 33.7211 44.3386 28.8722C45.4888 26.1783 46.0418 23.2824 45.9975 20.2967C45.7985 9.07217 36.9729 0.182378 25.9576 0.00278602Z" fill="#76C3F9"/>
    </g>
    <g filter="url(#filter1_i_295_2558)">
    <path d="M9.83379 14.6686C12.5638 8.52875 18.6566 4.63161 25.2738 4.74191C34.2774 4.88897 41.4911 12.1685 41.6539 21.3599C41.69 23.8048 41.238 26.1762 40.2979 28.3821C38.5984 32.3528 37.7487 36.4154 37.7487 40.4412V43.8604L38.0331 50.7467L16.4687 54.9999L15.8001 48.3642C15.7458 47.5921 15.6916 46.581 15.6193 45.6068C15.565 44.7244 15.5108 43.7133 15.4565 43.0332C14.6791 43.0332 13.9559 43.0332 13.1062 43.0516C11.9672 43.0883 10.557 43.1251 9.50835 42.1508C8.91173 41.5993 8.55014 40.7721 8.42358 39.6875C8.4055 39.6324 7.44728 33.1616 7.19417 31.452C7.15801 31.4337 7.10377 31.4153 7.06761 31.3969C6.76026 31.2498 6.41674 31.1028 6.10939 30.9557C5.71164 30.7719 5.36813 30.588 5.06077 30.4042C4.73534 30.1836 3.74096 29.5586 4.1568 28.2718C4.28335 27.8858 4.48223 27.4997 4.80766 27.1137C4.97038 26.9115 5.49468 26.3784 6.61562 25.2938L7.23033 24.7056C7.73655 24.1909 8.2247 23.621 8.35126 23.0511V21.654C8.35126 19.2275 8.85749 16.8745 9.83379 14.6686Z" fill="#406AC0"/>
    </g>
    <g filter="url(#filter2_i_295_2558)">
    <path d="M12.8647 17.4278C14.9624 12.708 19.6441 9.71226 24.7286 9.79704C31.647 9.91009 37.19 15.506 37.315 22.5715C37.3428 24.451 36.9955 26.2739 36.2731 27.9696C34.9672 31.0219 34.3143 34.1449 34.3143 37.2396V39.868L34.9508 51.3465L18.2556 54.6643L17.4491 43.3301C17.4074 42.7366 17.3658 41.9594 17.3102 41.2104C17.2685 40.5322 17.2268 39.7549 17.1852 39.2321H17.1849C16.5876 39.2321 16.032 39.2321 15.3792 39.2462C14.504 39.2745 13.4204 39.3027 12.6146 38.5538C12.1562 38.1299 11.8783 37.494 11.7811 36.6602C11.7672 36.6178 11.0309 31.6437 10.8364 30.3295C10.8086 30.3154 10.767 30.3012 10.7392 30.2871C10.503 30.1741 10.2391 30.061 10.0029 29.948C9.69725 29.8067 9.4333 29.6653 9.19713 29.524C8.94707 29.3545 8.183 28.874 8.50252 27.8848C8.59977 27.5881 8.75258 27.2913 9.00264 26.9946C9.12767 26.8391 9.53055 26.4293 10.3919 25.5956L10.8642 25.1434C11.2532 24.7477 11.6283 24.3097 11.7255 23.8716V22.7976C11.7255 20.9323 12.1145 19.1236 12.8647 17.4278Z" fill="#1C316B"/>
    </g>
    <defs>
    <filter id="filter0_i_295_2558" x="0" y="0" width="46" height="58.9803" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="14.5"/>
    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.24 0"/>
    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_295_2558"/>
    </filter>
    <filter id="filter1_i_295_2558" x="4.05676" y="4.73962" width="37.5991" height="54.2604" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="9.5"/>
    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.61 0"/>
    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_295_2558"/>
    </filter>
    <filter id="filter2_i_295_2558" x="8.42566" y="9.79529" width="28.8909" height="48.869" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
    <feFlood flood-opacity="0" result="BackgroundImageFix"/>
    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
    <feOffset dy="4"/>
    <feGaussianBlur stdDeviation="45.5"/>
    <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
    <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.47 0"/>
    <feBlend mode="normal" in2="shape" result="effect1_innerShadow_295_2558"/>
    </filter>
    </defs>
    </svg>
  `;

  return <SvgXml xml={svgMarkup} />;
}
