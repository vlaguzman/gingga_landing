import Link from "next/link";

export default function NotFound() {
  return (
    <main className="section--dark status-page">
      <div className="container status-page__inner">
        <h1 className="h2">Page not found</h1>
        <p className="lead">The page you are looking for does not exist or has moved.</p>
        <div>
          <Link className="btn" href="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
