/**
 * Page shown to a user who's been sent a 401 HTTP response.
 * @group Next.js Pages
 */
export default function UnauthorizedPage() {
  // add shadcn layout
  return (
      <div>
        <h1>Unauthorized Access</h1>
        <p>You are not authorized to access this page.</p>
      </div>
  );
};