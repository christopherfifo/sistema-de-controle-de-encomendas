"use client";

import Navbar from "./components/navbar";
import Hero from "./components/hero";
import About from "./components/about";
import Footer from "./components/footer";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />

      <Hero />

      <About />

      <Footer />
    </main>
  );
}
