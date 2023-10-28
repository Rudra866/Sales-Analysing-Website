/**
 * Page shown to a user who's been restricted from an area of the site.
 * @constructor
 */
export default function Unauthorized() {
  // add shadcn layout
  return (
      <div>
        <h1>Unauthorized Access</h1>
        <p>You are not authorized to access this page.</p>
      </div>
  );
};