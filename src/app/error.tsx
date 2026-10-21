"use client";

import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="section--dark status-page">
      <div className="container status-page__inner">
        <h1 className="h2">Something went wrong</h1>
        <p className="lead">An unexpected error occurred. You can try again.</p>
        <div>
          <button type="button" className="btn" onClick={() => retry()}>
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
