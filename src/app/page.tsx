import Image from "next/image";
import { FallingLeaves } from "@/components/FallingLeaves";
import { MapPanel } from "@/components/MapPanel";
import { PumpkinPatch } from "@/components/PumpkinPatch";
import { Reveal } from "@/components/Reveal";
import { RsvpForm } from "@/components/RsvpForm";
import { event } from "@/lib/event";

export default function Home() {
  return (
    <div className="relative min-h-dvh lg:grid lg:grid-cols-[minmax(0,38fr)_minmax(0,62fr)]">
      {/* Hero + RSVP overlay — swap image at public/images/hero.* */}
      <aside className="relative order-1 flex min-h-[78vh] flex-col justify-center overflow-hidden lg:order-2 lg:sticky lg:top-0 lg:h-dvh lg:min-h-dvh">
        <Image
          src={event.images.hero}
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 62vw"
          className="animate-hero-in object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[rgba(28,22,16,0.42)]"
        />
        <div aria-hidden className="animate-shimmer pointer-events-none absolute inset-0" />
        <FallingLeaves />

        <div className="relative z-10 px-6 py-10 pb-28 sm:px-10 lg:px-12 lg:pb-32 xl:px-16">
          <div className="mx-auto w-full max-w-md">
            <RsvpForm tone="onImage" />
          </div>
        </div>
      </aside>

      {/* Details — slightly narrower than the image panel */}
      <div className="panel-ombre relative order-2 flex min-h-dvh flex-col px-6 py-10 pb-36 sm:px-10 lg:order-1 lg:px-12 lg:py-14 lg:pb-40 xl:px-16">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
          <Reveal>
            <header>
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-[var(--amber-deep)]">
                {event.title}
              </p>
              <h1 className="font-display mt-4 text-5xl font-medium leading-[1.05] tracking-tight text-[var(--ink)] sm:text-6xl">
                {event.parents}
              </h1>
              <p className="mt-4 max-w-md text-lg font-light leading-relaxed text-[var(--ink-soft)]">
                {event.headline}. {event.copy.supporting}
              </p>
            </header>
          </Reveal>

          <section className="mt-10 space-y-5">
            <Reveal delayMs={80}>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                  When
                </p>
                <p className="font-display mt-2 text-2xl text-[var(--ink)]">
                  {event.date}
                </p>
                <p className="mt-1 text-[var(--ink-soft)]">{event.time}</p>
              </div>
            </Reveal>

            <Reveal delayMs={140}>
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                  Where
                </p>
                <p className="font-display mt-2 text-2xl text-[var(--ink)]">
                  {event.location.name}
                </p>
                <p className="mt-1 text-[var(--ink-soft)]">{event.location.address}</p>
              </div>
            </Reveal>

            <Reveal delayMs={200}>
              <MapPanel />
            </Reveal>
          </section>

          <Reveal className="mt-auto pt-14" delayMs={120}>
            <footer className="text-sm text-[var(--ink-soft)]">
              <p>{event.copy.footer}</p>
              <p className="mt-2">
                <a
                  href={event.registryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-expand"
                >
                  View the registry
                </a>
              </p>
            </footer>
          </Reveal>
        </div>
      </div>

      <PumpkinPatch />
    </div>
  );
}
