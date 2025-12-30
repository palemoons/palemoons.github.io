import SITE_CONFIG from "./site.config";

export default function NotFound() {
  return (
    <div className="container flex grow flex-col justify-center text-center">
      <title>{`404 | ${SITE_CONFIG.title}`}</title>
      <div className="mb-4 text-4xl font-semibold">Oops!</div>
      <div>This page could not be found.</div>
    </div>
  );
}
