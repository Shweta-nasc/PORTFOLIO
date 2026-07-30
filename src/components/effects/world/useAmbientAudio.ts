"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { seasonAt } from "./season-config";
import { clamp } from "./terrain-noise";

/* -------------------------------------------------------------------------- */
/*  Audio Manager                                                             */
/*                                                                            */
/*  Reactive, scroll-driven ambience built entirely with the Web Audio API —  */
/*  no audio files to download or license. Layers:                            */
/*    • wind  — filtered brown-ish noise, present everywhere, louder in       */
/*              monsoon & winter                                              */
/*    • rain  — brighter band-passed noise, faded in by the monsoon weight    */
/*    • thunder — occasional low noise-burst during storms                    */
/*                                                                            */
/*  Muted by default and only started on an explicit user gesture (autoplay   */
/*  policy + accessibility). To add real music (piano / guitar / violin), drop*/
/*  files in /public/audio and crossfade them here keyed on season — the gain */
/*  plumbing below is the same pattern.                                       */
/* -------------------------------------------------------------------------- */

interface AudioGraph {
  ctx: AudioContext;
  master: GainNode;
  windGain: GainNode;
  rainGain: GainNode;
  sources: AudioScheduledSourceNode[];
  noise: AudioBuffer;
}

function makeNoiseBuffer(ctx: AudioContext, seconds = 3): AudioBuffer {
  const len = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i += 1) {
    // Brown-ish noise (integrated white) for a soft, natural texture.
    const white = Math.random() * 2 - 1;
    last = (last + 0.02 * white) / 1.02;
    data[i] = last * 3.2;
  }
  return buf;
}

function buildGraph(ctx: AudioContext): AudioGraph {
  const noise = makeNoiseBuffer(ctx);
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Wind: looping noise → gentle low-pass, slowly wandering cutoff.
  const windSrc = ctx.createBufferSource();
  windSrc.buffer = noise;
  windSrc.loop = true;
  const windFilter = ctx.createBiquadFilter();
  windFilter.type = "lowpass";
  windFilter.frequency.value = 480;
  const windGain = ctx.createGain();
  windGain.gain.value = 0.25;
  windSrc.connect(windFilter).connect(windGain).connect(master);
  windSrc.start();

  // Rain: brighter band-passed noise, off until monsoon.
  const rainSrc = ctx.createBufferSource();
  rainSrc.buffer = noise;
  rainSrc.loop = true;
  const rainFilter = ctx.createBiquadFilter();
  rainFilter.type = "bandpass";
  rainFilter.frequency.value = 2600;
  rainFilter.Q.value = 0.6;
  const rainGain = ctx.createGain();
  rainGain.gain.value = 0;
  rainSrc.connect(rainFilter).connect(rainGain).connect(master);
  rainSrc.start();

  return { ctx, master, windGain, rainGain, sources: [windSrc, rainSrc], noise };
}

function triggerThunder(g: AudioGraph) {
  const { ctx, noise, master } = g;
  const src = ctx.createBufferSource();
  src.buffer = noise;
  const lp = ctx.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(420, ctx.currentTime);
  lp.frequency.exponentialRampToValueAtTime(70, ctx.currentTime + 1.4);
  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, ctx.currentTime);
  env.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 0.08);
  env.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.8);
  src.connect(lp).connect(env).connect(master);
  src.start();
  src.stop(ctx.currentTime + 2);
}

export function useAmbientAudio() {
  const [enabled, setEnabled] = useState(false);
  const graphRef = useRef<AudioGraph | null>(null);
  const rafRef = useRef(0);

  const toggle = useCallback(() => setEnabled((e) => !e), []);

  useEffect(() => {
    if (!enabled) return;

    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return;

    const graph = buildGraph(new Ctor());
    graphRef.current = graph;
    void graph.ctx.resume();
    // Fade the mix in.
    graph.master.gain.setTargetAtTime(0.5, graph.ctx.currentTime, 0.6);

    let nextThunder = graph.ctx.currentTime + 6;

    const loop = () => {
      const g = graphRef.current;
      if (!g) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
      const s = seasonAt(p);
      const now = g.ctx.currentTime;
      // Wind swells with storm & winter; rain follows the monsoon weight.
      g.windGain.gain.setTargetAtTime(0.16 + s.storm * 0.32 + s.snow * 0.12, now, 0.5);
      g.rainGain.gain.setTargetAtTime(s.rain * 0.4, now, 0.5);
      if (s.storm > 0.55 && now > nextThunder) {
        triggerThunder(g);
        nextThunder = now + 7 + Math.random() * 12;
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      const g = graphRef.current;
      graphRef.current = null;
      if (!g) return;
      // Fade out, then release the context.
      g.master.gain.setTargetAtTime(0, g.ctx.currentTime, 0.25);
      window.setTimeout(() => {
        g.sources.forEach((s) => {
          try {
            s.stop();
          } catch {
            /* already stopped */
          }
        });
        void g.ctx.close();
      }, 500);
    };
  }, [enabled]);

  return { enabled, toggle };
}
