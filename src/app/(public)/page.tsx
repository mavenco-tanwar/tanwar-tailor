import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Gallery from "@/components/sections/Gallery";


export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Services />
      {/* <Gallery /> */}
    </main>
  );
}
