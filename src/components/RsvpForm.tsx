"use client";

import { useEffect, useState, type FormEvent } from "react";
import { event } from "@/lib/event";
import { submitRsvp, type RsvpPayload } from "@/lib/rsvp";

type Status = "idle" | "submitting" | "exiting" | "done";
type Tone = "page" | "onImage";

const fieldByTone: Record<Tone, string> = {
  page:
    "mt-2 w-full border-0 border-b border-[var(--line)] bg-transparent px-0 py-3 text-lg text-[var(--ink)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--ink-soft)]/50 focus:border-[var(--amber)] focus:shadow-[0_1px_0_0_var(--amber)]",
  onImage:
    "mt-2 w-full border-0 border-b border-white/30 bg-transparent px-0 py-3 text-lg text-[#f7f1e6] outline-none transition-[border-color,box-shadow] placeholder:text-white/40 focus:border-[var(--amber)] focus:shadow-[0_1px_0_0_var(--amber)]",
};

export function RsvpForm({ tone = "page" }: { tone?: Tone }) {
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [partySize, setPartySize] = useState(1);
  const [message, setMessage] = useState("");
  const [bloomKey, setBloomKey] = useState(0);
  const fieldClass = fieldByTone[tone];
  const onImage = tone === "onImage";

  useEffect(() => {
    if (status !== "exiting") return;
    const t = window.setTimeout(() => setStatus("done"), 380);
    return () => window.clearTimeout(t);
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const payload: RsvpPayload = {
      name: name.trim(),
      attending,
      partySize: attending === "yes" ? partySize : 0,
      message: message.trim(),
    };

    await submitRsvp(payload);
    setStatus("exiting");
  }

  function chooseAttend(value: "yes" | "no") {
    setAttending(value);
    setBloomKey((k) => k + 1);
  }

  if (status === "done") {
    return (
      <section id="rsvp" aria-live="polite" className="animate-confirm-in pt-2">
        <p
          className={`font-display text-3xl font-medium tracking-tight sm:text-4xl ${
            onImage ? "text-[#f7f1e6]" : "text-[var(--moss)]"
          }`}
        >
          {event.copy.confirmation}
        </p>
        <p
          className={`mt-3 text-base ${
            onImage ? "text-white/70" : "text-[var(--ink-soft)]"
          }`}
        >
          {name}
          {attending === "yes"
            ? ` — see you there${partySize > 1 ? ` (party of ${partySize})` : ""}.`
            : " — we'll miss you."}
        </p>
      </section>
    );
  }

  return (
    <section
      id="rsvp"
      className={`pt-2 ${status === "exiting" ? "animate-form-out" : ""}`}
    >
      <h2
        className={`stagger-item font-display text-3xl font-medium tracking-tight sm:text-4xl ${
          onImage ? "text-[#f7f1e6]" : "text-[var(--ink)]"
        }`}
      >
        {event.copy.rsvpPrompt}
      </h2>

      <form onSubmit={onSubmit} className="mt-8 space-y-7">
        <label
          className={`stagger-item block text-xs font-medium uppercase tracking-[0.18em] ${
            onImage ? "text-white/65" : "text-[var(--ink-soft)]"
          }`}
        >
          Name(s)
          <input
            name="name"
            required
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={fieldClass}
            placeholder="Your name(s)"
          />
        </label>

        <fieldset className="stagger-item">
          <legend
            className={`text-xs font-medium uppercase tracking-[0.18em] ${
              onImage ? "text-white/65" : "text-[var(--ink-soft)]"
            }`}
          >
            Attending
          </legend>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <AttendButton
              key={attending === "yes" ? `yes-${bloomKey}` : "yes"}
              active={attending === "yes"}
              onClick={() => chooseAttend("yes")}
              label="Yes"
              onImage={onImage}
              bloom={attending === "yes"}
            />
            <AttendButton
              key={attending === "no" ? `no-${bloomKey}` : "no"}
              active={attending === "no"}
              onClick={() => chooseAttend("no")}
              label="No"
              onImage={onImage}
              bloom={attending === "no"}
            />
          </div>
        </fieldset>

        <label
          className={`stagger-item party-size-in block text-xs font-medium uppercase tracking-[0.18em] ${
            onImage ? "text-white/65" : "text-[var(--ink-soft)]"
          }`}
        >
          Party size
          <input
            name="partySize"
            type="number"
            min={1}
            max={20}
            required={attending === "yes"}
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className={`${fieldClass} max-w-[8rem] text-center`}
          />
        </label>

        <label
          className={`stagger-item block text-xs font-medium uppercase tracking-[0.18em] ${
            onImage ? "text-white/65" : "text-[var(--ink-soft)]"
          }`}
        >
          Message for the parents
          <textarea
            name="message"
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`${fieldClass} resize-none`}
            placeholder="Optional note"
          />
        </label>

        <button
          type="submit"
          disabled={status === "submitting" || status === "exiting"}
          className={`stagger-item w-full px-6 py-4 text-sm font-medium uppercase tracking-[0.2em] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 ${
            onImage
              ? "bg-[#f7f1e6] text-[var(--ink)] hover:bg-white"
              : "bg-[var(--moss)] text-[#f4efe4] hover:bg-[var(--ink)]"
          }`}
        >
          {status === "submitting" ? "Sending…" : "Send RSVP"}
        </button>
      </form>
    </section>
  );
}

function AttendButton({
  active,
  onClick,
  label,
  onImage,
  bloom,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  onImage: boolean;
  bloom: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`py-4 text-lg font-medium tracking-wide transition-[color,background-color,opacity] duration-300 ${
        bloom && active ? "attend-bloom" : ""
      } ${
        active
          ? "bg-[rgba(196,122,58,0.62)] text-[#fff8ef] backdrop-blur-[2px]"
          : onImage
            ? "bg-transparent text-white/55 ring-1 ring-white/25 hover:text-[#f7f1e6]"
            : "bg-transparent text-[var(--ink-soft)] ring-1 ring-[var(--line)] hover:text-[var(--ink)]"
      }`}
    >
      {label}
    </button>
  );
}
