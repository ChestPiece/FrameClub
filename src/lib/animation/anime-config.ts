"use client";

import {
  animate,
  createTimeline,
  spring,
  stagger,
  utils,
  eases,
} from "animejs";

// `spring` is the v4 name; keep `createSpring` as alias for primitives that already imported it.
export const createSpring = spring;
export { animate, createTimeline, spring, stagger, utils, eases };

import { REDUCED_MOTION_QUERY } from "./button-motion";

export function animeReady(): boolean {
  if (typeof window === "undefined") return false;
  return !window.matchMedia(REDUCED_MOTION_QUERY).matches;
}
