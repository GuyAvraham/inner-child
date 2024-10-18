import type { SVGProps } from 'react';

export default function SelectedSVG(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" viewBox="0 0 16 16" {...props}>
      <mask id="a" width={14} height={14} x={1} y={1} fill="#000" maskUnits="userSpaceOnUse">
        <path fill="#fff" d="M1 1h14v14H1z" />
        <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z" />
        <path d="m6 8 1.333 1.333L10 6.667" />
      </mask>
      <path fill="#1877F2" fillOpacity={0.6} d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12Z" />
      <path fill="#1877F2" fillOpacity={0.8} d="m6 8 1.333 1.333L10 6.667" />
      <path
        fill="#fff"
        fillOpacity={0.8}
        d="M6.566 7.434a.8.8 0 0 0-1.132 1.132l1.132-1.132Zm.767 1.9-.565.565a.8.8 0 0 0 1.131 0l-.566-.566Zm3.233-2.102a.8.8 0 0 0-1.132-1.131l1.132 1.131ZM13.2 8A5.2 5.2 0 0 1 8 13.2v1.6A6.8 6.8 0 0 0 14.8 8h-1.6ZM8 13.2A5.2 5.2 0 0 1 2.8 8H1.2A6.8 6.8 0 0 0 8 14.8v-1.6ZM2.8 8A5.2 5.2 0 0 1 8 2.8V1.2A6.8 6.8 0 0 0 1.2 8h1.6ZM8 2.8A5.2 5.2 0 0 1 13.2 8h1.6A6.8 6.8 0 0 0 8 1.2v1.6ZM5.434 8.566l1.334 1.333 1.131-1.131-1.333-1.334-1.132 1.132ZM7.9 9.899l2.667-2.667-1.132-1.131-2.666 2.667 1.131 1.131Z"
        mask="url(#a)"
      />
      <path fill="#1877F2" d="m6 8 1.333 1.333L10 6.667" />
      <path
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeOpacity={0.8}
        d="m6 8 1.333 1.333L10 6.667"
      />
    </svg>
  );
}
