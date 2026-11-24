import type { SVGProps } from 'react';

const paths = {
  folder: (
    <>
      <path d="M1.5 12.5v-9h4.2l1.4 1.8h7.4v7.2z" />
      <path d="M1.5 6.3h13" />
    </>
  ),
  'folder-open': (
    <>
      <path d="M1.5 12.5v-9h4.2l1.4 1.8h5.4v2" />
      <path d="M2.6 12.5 4.6 7.3h11l-2 5.2z" />
    </>
  ),
  home: (
    <>
      <path d="M1.8 7.8 8 2.4l6.2 5.4" />
      <path d="M3.6 7.6v5.9h8.8V7.6" />
      <path d="M6.6 13.5V9.8h2.8v3.7" />
    </>
  ),
  file: (
    <>
      <path d="M3.5 1.8h5.6l3.4 3.3v9.1h-9z" />
      <path d="M9.1 1.8v3.3h3.4" />
    </>
  ),
  user: (
    <>
      <circle cx="8" cy="5.4" r="2.7" />
      <path d="M2.8 14c0-2.9 2.3-4.6 5.2-4.6s5.2 1.7 5.2 4.6" />
    </>
  ),
  branch: (
    <>
      <circle cx="4.5" cy="3.6" r="1.8" />
      <circle cx="4.5" cy="12.4" r="1.8" />
      <circle cx="11.5" cy="5.6" r="1.8" />
      <path d="M4.5 5.4v5.2M4.6 10.6c0-2.4 2-3.2 4.3-3.6" />
    </>
  ),
  package: (
    <>
      <path d="M8 1.8 14.2 5v6L8 14.2 1.8 11V5z" />
      <path d="M1.8 5 8 8.2 14.2 5M8 8.2v6" />
    </>
  ),
  question: (
    <>
      <circle cx="8" cy="8" r="6.3" />
      <path d="M6.1 6.2c0-1.1.9-2 2-2s1.9.8 1.9 1.9c0 1.6-1.9 1.5-1.9 3.1" />
      <path d="M8.05 12.1h.01" />
    </>
  ),
  moon: <path d="M13.2 10.4A5.8 5.8 0 0 1 5.8 2.9a5.9 5.9 0 1 0 7.4 7.5z" />,
  utensils: (
    <>
      <path d="M4 1.8v4.6M6.2 1.8v4.6M5.1 6.4v7.8M3 1.8c0 2.6 0 3.6 2.1 4.6 2.1-1 2.1-2 2.1-4.6" />
      <path d="M11.8 1.8c-1.4 1.2-1.9 3-1.4 5.2h2.8c.5-2.2 0-4-1.4-5.2zM11.8 7v7.2" />
    </>
  ),
  pot: (
    <>
      <path d="M2.4 6.6h11.2v4.1a2.4 2.4 0 0 1-2.4 2.4H4.8a2.4 2.4 0 0 1-2.4-2.4z" />
      <path d="M1 6.6h14M5.4 4.4c0-1 1-1.3 1-2.3M8 4.4c0-1 1-1.3 1-2.3M10.6 4.4c0-1 1-1.3 1-2.3" />
    </>
  ),
  book: (
    <>
      <path d="M2.2 2.4h4.1c1 0 1.7.6 1.7 1.5v9.7c0-.8-.7-1.4-1.7-1.4H2.2z" />
      <path d="M13.8 2.4H9.7C8.7 2.4 8 3 8 3.9v9.7c0-.8.7-1.4 1.7-1.4h4.1z" />
    </>
  ),
  terminal: (
    <>
      <path d="M1.8 2.6h12.4v10.8H1.8z" />
      <path d="M4.4 6.1 6.6 8l-2.2 1.9M8.4 10h3.2" />
    </>
  ),
  mail: (
    <>
      <path d="M1.8 3.4h12.4v9.2H1.8z" />
      <path d="m1.8 4 6.2 4.6L14.2 4" />
    </>
  ),
  arrow: <path d="M2.5 8h11M9.5 4.2 13.5 8l-4 3.8" />,
  external: (
    <>
      <path d="M9.4 2.6h4v4" />
      <path d="M13.4 2.6 7.6 8.4" />
      <path d="M11.6 9.6v3.8H2.6V4.4h3.8" />
    </>
  ),
  copy: (
    <>
      <path d="M5.6 5.6h8v8h-8z" />
      <path d="M2.4 10.4V2.4h8v1.6" />
    </>
  ),
  search: (
    <>
      <circle cx="7.1" cy="7.1" r="4.6" />
      <path d="m10.5 10.5 3.2 3.2" />
    </>
  ),
  close: <path d="M3.6 3.6 12.4 12.4M12.4 3.6 3.6 12.4" />,
  check: <path d="m2.8 8.4 3.4 3.4 7-7.6" />,
  clock: (
    <>
      <circle cx="8" cy="8" r="6.2" />
      <path d="M8 4.4V8l2.6 1.6" />
    </>
  ),
  tag: (
    <>
      <path d="M8.2 1.8H14v5.8l-6.4 6.4-5.8-5.8z" />
      <circle cx="11.1" cy="4.9" r="1" />
    </>
  ),
  star: <path d="m8 2 1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.8 4.2 13.8l.7-4.3-3.1-3 4.3-.6z" />,
} as const;

export type IconName = keyof typeof paths;

export const iconNames = Object.keys(paths) as IconName[];

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName | (string & {});
  size?: number;
}

export function Icon({ name, size = 14, ...rest }: IconProps) {
  const shape = paths[name as IconName];
  if (!shape) return null;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {shape}
    </svg>
  );
}
