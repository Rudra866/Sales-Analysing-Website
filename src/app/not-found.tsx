/**
 * Page shown to a user who's been sent a 404 HTTP response.
 * @group Next.js Pages
 */
export default function NotFoundPage() {
  // add shadcn layout, make beautiful
  return (
      <div className={"flex flex-col items-center my-3"}>
        <h1>Page not found</h1>
        <p>There is no page matching this link.</p>
      </div>
  );
};