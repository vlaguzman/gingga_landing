import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./LoginForm";
import "./login.css";

export const metadata: Metadata = {
  title: "Sign in · GINGGA",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="login">
      <div className="login__card">
        <Link className="login__logo" href="/" aria-label="GINGGA home">
          <Image src="/assets/logo.png" alt="GINGGA" width={1797} height={307} priority />
        </Link>
        <h1>Sign in to your workspace</h1>
        <p className="login__lead">Pick up your conversations and pipeline where you left off.</p>
        <LoginForm />
        <p className="login__foot">
          New to GINGGA? <Link href="/#services">See how it works</Link>
        </p>
      </div>
    </main>
  );
}
