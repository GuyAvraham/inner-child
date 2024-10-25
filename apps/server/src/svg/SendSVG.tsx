import type { SVGProps } from 'react';

export default function SendSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="8 8 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M26.3334 9.66663L17.1667 18.8333" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M26.3334 9.66663L20.5001 26.3333L17.1667 18.8333L9.66675 15.5L26.3334 9.66663Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
