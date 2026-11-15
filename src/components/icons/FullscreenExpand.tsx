const FullscreenExpand = ({ width = 16, height = 16, ...rest }: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={width} height={height} {...rest}>
    <path
      d="M15 3h6v6m0-6-7 7M9 21H3v-6m0 6 7-7"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FullscreenExpand;
