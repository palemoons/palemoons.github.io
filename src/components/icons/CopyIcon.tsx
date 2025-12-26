const CopyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width ?? 16}
    height={props.height ?? 16}
    viewBox="0 0 1024 1024"
    {...props}
  >
    <path
      fill="currentColor"
      d="m778.24 289.513-369.594 369.57-139.613-139.59a34.91 34.91 0 1 0-49.338 49.339l164.282 164.305a34.77 34.77 0 0 0 49.338 0l394.263-394.286a34.91 34.91 0 1 0-49.338-49.338"
    />
  </svg>
);

export default CopyIcon;
