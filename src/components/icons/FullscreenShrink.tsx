const FullscreenShrink = ({ width = 16, height = 16, ...rest }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} {...rest}>
    <path
      d="M21 9h-6V3m0 6 6-6M3 15h6v6m0-6-6 6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FullscreenShrink;
