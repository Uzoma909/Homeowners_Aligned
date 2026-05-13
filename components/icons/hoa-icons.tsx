"use client";

import { SVGProps } from "react";


/**
 * Icon set based on [7000 FREE UI ICONS] by [CRISTIAN MUNOZ]
 * Licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
 * Icons have been modified: colors adapted to Onque design system (currentColor + #7c3aed accents)
 */

// ============================================================
// Main color #1E293B
// BASE WRAPPER
// All icons: viewBox 0 0 24 24, strokeWidth 1.75, round caps
// currentColor = primary shape, #7c3aed = accent element
// ============================================================

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 18, children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.75"
      {...props}
    >
      {children}
    </svg>
  );
}

// ============================================================
// DASHBOARD — Four command panels, top-right has live sparkline
// ============================================================
export function DashboardIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Top-right tall panel — blue accent */}
      <path d="M15.73 2C14.14 2 13.5 2.6 13.5 4.1V10.9C13.5 12.4 14.14 13 15.73 13H19.77C21.36 13 22 12.4 22 10.9V4.1C22 2.6 21.36 2 19.77 2" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom-right small panel */}
      <path d="M22 19.9V18.1C22 16.6 21.36 16 19.77 16H15.73C14.14 16 13.5 16.6 13.5 18.1V19.9C13.5 21.4 14.14 22 15.73 22H19.77C21.36 22 22 21.4 22 19.9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom-left tall panel */}
      <path d="M4.23 22C2.64 22 2 21.4 2 19.9V13.1C2 11.6 2.64 11 4.23 11H8.27C9.86 11 10.5 11.6 10.5 13.1V19.9C10.5 21.4 9.86 22 8.27 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Top-left small panel */}
      <path d="M10.5 4.1V5.9C10.5 7.4 9.86 8 8.27 8H4.23C2.64 8 2 7.4 2 5.9V4.1C2 2.6 2.64 2 4.23 2H8.27C9.86 2 10.5 2.6 10.5 4.1Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CONTACTS — Person silhouette with blue "add contact" ring
// ============================================================
export function ContactsIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Blue plus */}
      <path d="M18.5 19.5H14.5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16.5 21.5V17.5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Person body */}
      <path d="M11.99 21.8101C10.17 21.8101 8.36004 21.3501 6.98004 20.4301C4.56004 18.8101 4.56004 16.1701 6.98004 14.5601C9.73004 12.7201 14.24 12.7201 16.99 14.5601" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Person head */}
      <path d="M15.6801 3.96C16.1601 4.67 16.4401 5.52 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CALENDAR — Calendar frame with blue highlighted event
// ============================================================
export function CalendarIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Peg handles */}
      <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Header line */}
      <path d="M3.5 9.08997H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Blue checkmark circle */}
      <path d="M22 19C22 19.75 21.79 20.46 21.42 21.06C20.73 22.22 19.46 23 18 23C16.99 23 16.07 22.63 15.37 22C15.06 21.74 14.79 21.42 14.58 21.06C14.21 20.46 14 19.75 14 19C14 16.79 15.79 15 18 15C19.2 15 20.27 15.53 21 16.36C21.62 17.07 22 17.99 22 19Z" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Blue checkmark */}
      <path d="M16.4399 19L17.4299 19.99L19.5599 18.02" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Calendar body */}
      <path d="M3 13.1V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5V16.36C20.27 15.53 19.2 15 18 15C15.79 15 14 16.79 14 19C14 19.75 14.21 20.46 14.58 21.06C14.79 21.42 15.06 21.74 15.37 22H8C4.5 22 3 20 3 17" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Date dots */}
      <path d="M11.9955 13.7H12.0045" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.29431 13.7H8.30329" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.29431 16.7H8.30329" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// DISPATCH — Signal tower with blue broadcast arcs
// ============================================================
export function DispatchIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Outer arc + center line */}
      <path d="M12 12L3.32999 7.01996C2.48999 8.48996 2 10.19 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 9.94997 21.38 8.03996 20.32 6.45996" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Top arc */}
      <path d="M6 4C7.67 2.75 9.75 2 12 2C13.88 2 15.63 2.52001 17.13 3.42001" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Inner circle — blue accent */}
      <path d="M6.82999 8.95999C6.29999 9.84999 6 10.89 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6C11.09 6 10.22 6.20001 9.45001 6.57001" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// ROUTES — Two pins with a blue dotted path between them
// ============================================================
export function RoutesIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Start pin (top-left) */}
      <path d="M6.94003 9.42C6.12003 10.2 4.83003 10.19 4.01003 9.42C2.89003 8.35 1.60002 6.63 2.07002 4.6C2.87002 1.14 8.08003 1.14 8.87003 4.6C8.99003 5.09 9.00002 5.55001 8.94002 6.00001" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* End pin (bottom-right) — blue accent */}
      <path d="M15.07 16.6C15.87 13.14 21.11 13.14 21.91 16.6C22.38 18.63 21.09 20.35 19.96 21.42C19.14 22.2 17.84 22.19 17.02 21.42C15.89 20.35 14.6 18.63 15.07 16.6Z" stroke="#7c3aed" strokeWidth="1.5" />
      {/* Route path */}
      <path d="M11.9999 5H14.6799C16.5299 5 17.3899 7.29 15.9999 8.51L8.00995 15.5C6.61995 16.71 7.47994 19 9.31994 19H11.9999" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Start pin dot */}
      <path d="M5.48622 5.5H5.49777" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* End pin dot — blue accent */}
      <path d="M18.4862 17.5H18.4978" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// KNOCK & TRACK — Door with blue knock motion lines
// ============================================================
export function KnockTrackIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Door frame */}
      <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" stroke="currentColor" />
      <path d="M2 21h20" stroke="currentColor" />
      {/* Door handle */}
      <circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none" />
      {/* Blue knock motion arcs */}
      <path d="M8 9a2.5 2.5 0 0 1 0 3.5" stroke="#7c3aed" />
      <path d="M6 7.5a5 5 0 0 0 0 6.5" stroke="#7c3aed" strokeOpacity="0.45" />
    </Icon>
  );
}

// ============================================================
// TASKS — Clipboard checklist with blue completion check
// ============================================================
export function TasksIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* List lines */}
      <path d="M11 19.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 12.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 12.5H16.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 5.5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Top checkmark — blue accent */}
      <path d="M3 5.5L4 6.5L7 3.5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Middle checkmark */}
      <path d="M3 12.5L4 13.5L7 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bottom checkmark */}
      <path d="M3 19.5L4 20.5L7 17.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// TEAM — Two overlapping person silhouettes
// ============================================================
export function TeamIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Back person (blue) */}
      <circle cx="14.5" cy="7" r="3" stroke="#7c3aed" />
      <path d="M8.5 21c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="#7c3aed" />
      {/* Front person (currentColor) */}
      <circle cx="9.5" cy="7" r="3.5" stroke="currentColor" />
      <path d="M2.5 21c0-3.866 3.134-7 7-7s7 3.134 7 7" stroke="currentColor" />
    </Icon>
  );
}

// ============================================================
// ESTIMATES — Document with folded corner, blue pencil stroke
// ============================================================
export function EstimatesIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Right tab — blue accent */}
      <path d="M22 6V8.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2C19.11 2.01 20.11 2.45 20.83 3.17C21.55 3.9 22 4.9 22 6Z" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Line items */}
      <path d="M9 13.01H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 9.01001H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Receipt body with zigzag bottom */}
      <path d="M2 11V21C2 21.83 2.94 22.3 3.6 21.8L5.31 20.52C5.71 20.22 6.27 20.26 6.63 20.62L8.29 22.29C8.68 22.68 9.32 22.68 9.71 22.29L11.39 20.61C11.74 20.26 12.3 20.22 12.69 20.52L14.4 21.8C15.06 22.29 16 21.82 16 21V4C16 2.9 16.9 2 18 2H7H6C3 2 2 3.79 2 6V7" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bullet dots */}
      <path d="M5.99561 13H6.00459" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.99548 9H6.00447" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// MESSAGE HUB — Chat bubble with blue broadcast signal
// ============================================================
export function MessageHubIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Back chat bubble — blue accent (renders behind) */}
      <path d="M21.98 6.79001C21.98 3.60001 20.38 2 17.19 2H10.79C7.86004 2 6.27004 3.35001 6.04004 6.04001C6.28004 6.01001 6.53004 6 6.79004 6H13.19C16.38 6 17.98 7.60001 17.98 10.79V14.79C17.98 15.05 17.97 15.3 17.94 15.54C20.63 15.31 21.98 13.73 21.98 10.79" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Front chat bubble */}
      <path d="M2 10.79C2 7.86001 3.35001 6.27001 6.04001 6.04001C6.28001 6.01001 6.53001 6 6.79001 6H13.19C16.38 6 17.98 7.60001 17.98 10.79V14.79C17.98 15.05 17.97 15.3 17.94 15.54C17.71 18.24 16.12 19.58 13.19 19.58H12.79C12.54 19.58 12.3 19.7 12.15 19.9L10.95 21.5C10.42 22.21 9.56 22.21 9.03 21.5L7.82999 19.9C7.69999 19.73 7.41 19.58 7.19 19.58H6.79001C3.60001 19.58 2 18.79 2 14.79" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Typing dots */}
      <path d="M13.4955 13.25H13.5045" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.9955 13.25H10.0045" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.4955 13.25H6.5045" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// FINANCIALS — Line chart with blue accent on peak point
// ============================================================
export function FinancialsIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* X-axis line */}
      <path d="M17.97 22H22" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Y-axis + frame */}
      <path d="M2 2V19C2 20.66 3.34 22 5 22H13.98" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Top-right tick */}
      <path d="M19.99 8.17999L21 7" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Chart trend line — blue accent */}
      <path d="M5 17L9.59 11.64C10.35 10.76 11.7 10.7 12.52 11.53L13.47 12.48C14.29 13.3 15.64 13.25 16.4 12.37L17.55 11.02" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// SERVICES — Wrench with blue sparkle at tip
// ============================================================
export function ServicesIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* 3D box — top half */}
      <path d="M18.6699 18.67L20.8899 17.56V14.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.2199 9.78L11.9999 10.89" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9999 10.89L9.77986 9.78" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9999 10.89V13.67" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.8899 6.44L18.6699 7.55" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.8899 6.44L18.6699 5.33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.8899 6.44V9.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.2199 3.11L11.9999 2L9.77986 3.11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* 3D box — bottom half — blue accent */}
      <path d="M3.10986 6.44L5.32986 5.33" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.10986 6.44L5.32986 7.55" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.10986 6.44V9.22" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9999 22L9.77986 20.89" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9999 22L14.2199 20.89" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9999 22V19.22" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.32986 18.67L3.10986 17.56V14.78" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// MARKETING — Megaphone with blue signal dots
// ============================================================
export function MarketingIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Left circle */}
      <path d="M14 16C14 17.77 13.23 19.37 12 20.46C10.94 21.42 9.54 22 8 22C4.69 22 2 19.31 2 16C2 13.24 3.88 10.9 6.42 10.21C7.11 11.95 8.59 13.29 10.42 13.79C10.92 13.93 11.45 14 12 14C12.55 14 13.08 13.93 13.58 13.79C13.85 14.47 14 15.22 14 16Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right circle */}
      <path d="M22 16C22 19.31 19.31 22 16 22C14.46 22 13.06 21.42 12 20.46C13.23 19.37 14 17.77 14 16C14 15.22 13.85 14.47 13.58 13.79C15.41 13.29 16.89 11.95 17.58 10.21C20.12 10.9 22 13.24 22 16Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Top circle — blue accent (last = renders on top) */}
      <path d="M7.52 4.01C8.62 2.78 10.22 2 12 2C15.31 2 18 4.69 18 8C18 8.78 17.85 9.53 17.58 10.21C16.89 11.95 15.41 13.29 13.58 13.79C13.08 13.93 12.55 14 12 14C11.45 14 10.92 13.93 10.42 13.79C8.59 13.29 7.11 11.95 6.42 10.21C6.15 9.53 6 8.78 6 8" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// SETTINGS — Gear with blue center accent
// ============================================================
export function SettingsIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Center circle — blue accent */}
      <path d="M15 12C15 10.34 13.66 9 12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C12.41 15 12.81 14.92 13.17 14.76" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Gear body — right half */}
      <path d="M6.87988 20.5799L7.96988 21.2099C8.75988 21.6799 9.77988 21.3999 10.2499 20.6099L10.3599 20.4199C11.2599 18.8499 12.7399 18.8499 13.6499 20.4199L13.7599 20.6099C14.2299 21.3999 15.2499 21.6799 16.0399 21.2099L17.7699 20.2199C18.6799 19.6999 18.9899 18.5299 18.4699 17.6299C17.5599 16.0599 18.2999 14.7799 20.1099 14.7799C21.1499 14.7799 22.0099 13.9299 22.0099 12.8799V11.1199C22.0099 10.0799 21.1599 9.21995 20.1099 9.21995C19.0999 9.21995 18.4199 8.81995 18.1799 8.18995C17.9899 7.69995 18.0699 7.05995 18.4699 6.36995C18.9899 5.45995 18.6799 4.29995 17.7699 3.77995L16.9599 3.31995" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Gear body — left half */}
      <path d="M13.64 3.58006C12.74 5.15006 11.26 5.15006 10.35 3.58006L10.24 3.39006C9.78 2.60006 8.76 2.32006 7.97 2.79006L6.24 3.78006C5.33 4.30006 5.02 5.47006 5.54 6.38006C6.45 7.94006 5.71 9.22006 3.9 9.22006C2.86 9.22006 2 10.0701 2 11.1201V12.8801C2 13.9201 2.85 14.7801 3.9 14.7801C5.71 14.7801 6.45 16.0601 5.54 17.6301" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// BILLING — Credit card with blue shield check
// ============================================================
export function BillingIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Magnetic strip — blue accent */}
      <path d="M2 8.5H22" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Card number lines */}
      <path d="M6 16.5H8" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5 16.5H14.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Card body */}
      <path d="M22 14.99V16.11C22 19.62 21.11 20.5 17.56 20.5H6.44C2.89 20.5 2 19.62 2 16.11V7.89C2 4.38 2.89 3.5 6.44 3.5H17.55C21.11 3.5 22 4.38 22 7.89V10.98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// DOOR KNOCK VARIANT (alternate for Knock & Track)
// ============================================================
export function DoorKnockIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16H4z" stroke="currentColor" />
      <path d="M2 21h20" stroke="currentColor" />
      <circle cx="14.5" cy="12" r="1" fill="currentColor" stroke="none" />
      <path d="M8.5 9a3 3 0 0 1 0 4.5" stroke="#7c3aed" />
      <path d="M6.5 7.5a5.5 5.5 0 0 0 0 7.5" stroke="#7c3aed" strokeOpacity="0.4" />
    </Icon>
  );
}

// ============================================================
// MOON / SUN helpers (for dark mode toggle — same style)
// ============================================================
export function MoonIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z" stroke="currentColor" />
      <circle cx="17" cy="6" r="1" fill="#7c3aed" stroke="none" />
      <circle cx="19" cy="9" r="0.7" fill="#7c3aed" stroke="none" />
    </Icon>
  );
}

export function SunIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M19.07 4.93l-1.77 1.77M6.7 17.3l-1.77 1.77" stroke="#7c3aed" strokeWidth="1.5" />
    </Icon>
  );
}

// ============================================================
// TIMESHEETS — Clock with blue calendar grid accent
// ============================================================
export function TimesheetIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Shield body */}
      <path d="M3.41016 11.3701V14.5501C3.41016 15.7301 4.19017 17.2801 5.14017 17.9901L9.44016 21.2001C10.8502 22.2601 13.1701 22.2601 14.5801 21.2001L18.8802 17.9901C19.8302 17.2801 20.6101 15.7301 20.6101 14.5501V7.12006C20.6101 5.89006 19.6701 4.53006 18.5201 4.10006L13.5302 2.23006C12.7002 1.92006 11.3402 1.92006 10.5102 2.23006L5.52014 4.10006C4.37014 4.53006 3.43015 5.89006 3.43015 7.12006" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Blue clock circle */}
      <path d="M16 11.5C16 9.29 14.21 7.5 12 7.5C9.79 7.5 8 9.29 8 11.5C8 13.71 9.79 15.5 12 15.5C12.71 15.5 13.37 15.32 13.95 14.99" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Blue clock hands */}
      <path d="M12.25 10.25V11.18C12.25 11.53 12.07 11.86 11.76 12.04L11 12.5" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// PROFILE — Person in a circle with a small status dot
// ============================================================
export function ProfileIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" />
      <circle cx="12" cy="9" r="3" stroke="currentColor" />
      <path d="M6 19.5a6 6 0 0 1 12 0" stroke="currentColor" />
      <circle cx="17.5" cy="7" r="2" fill="#7c3aed" stroke="none" />
    </Icon>
  );
}

// ============================================================
// NOTIFICATION BELL
// ============================================================
export function NotificationBellIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Bell body */}
      <path d="M18.0201 11.8V8.91003C18.0201 5.61003 15.3201 2.91003 12.0201 2.91003C8.71009 2.91003 6.02009 5.60003 6.02009 8.91003V11.8C6.02009 12.41 5.76009 13.34 5.45009 13.86L4.30009 15.77C3.59009 16.95 4.08009 18.26 5.38009 18.7C9.69009 20.14 14.3401 20.14 18.6501 18.7C19.8601 18.3 20.3901 16.87 19.7301 15.77" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" />
      {/* Bell top */}
      <path d="M13.8699 3.19994C13.5599 3.10994 13.2399 3.03994 12.9099 2.99994C11.9499 2.87994 11.0299 2.94994 10.1699 3.19994C10.4599 2.45994 11.1799 1.93994 12.0199 1.93994C12.8599 1.93994 13.5799 2.45994 13.8699 3.19994Z" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bell clapper */}
      <path d="M15.02 19.0601C15.02 20.7101 13.67 22.0601 12.02 22.0601C11.2 22.0601 10.44 21.7201 9.90002 21.1801C9.36002 20.6401 9.02002 19.8801 9.02002 19.0601" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" />
    </Icon>
  );
}

// ============================================================
// MONEY — Dollar sign in rounded square
// ============================================================
export function MoneyIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Dollar S curve — blue accent */}
      <path d="M8.66992 14.33C8.66992 15.62 9.65992 16.66 10.8899 16.66H13.3999C14.4699 16.66 15.3399 15.75 15.3399 14.63C15.3399 13.41 14.8099 12.98 14.0199 12.7L9.98992 11.3C9.19992 11.02 8.66992 10.59 8.66992 9.36997C8.66992 8.24997 9.53992 7.33997 10.6099 7.33997H13.1199C14.3499 7.33997 15.3399 8.37997 15.3399 9.66997" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6V18" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Rounded square */}
      <path d="M2 9C2 4 4 2 9 2H15C20 2 22 4 22 9V15C22 20 20 22 15 22H9C4 22 2 20 2 15V13.03" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CLIPBOARD — Clipboard with text lines
// ============================================================
export function ClipboardIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M8 12.2H15" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 16.2H12.38" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Clip — blue accent */}
      <path d="M10.96 2H10C9 2 8 2 8 4C8 6 9 6 10 6H14C16 6 16 5 16 4C16 2 15 2 14 2" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 10C3 5.44002 4.67 4.20002 8 4.02002" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 4.02002C19.33 4.20002 21 5.43002 21 10V16C21 20 20 22 15 22H9C4 22 3 20 3 16V13.91" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// EDIT — Pencil editing
// ============================================================
export function EditIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M13.2601 3.59997L5.0501 12.29C4.7401 12.62 4.4401 13.27 4.3801 13.72L4.0101 16.96C3.8801 18.13 4.7201 18.93 5.8801 18.73L9.1001 18.18C9.5501 18.1 10.1801 17.77 10.4901 17.43L18.7001 8.73997C20.1201 7.23997 20.7601 5.52997 18.5501 3.43997C16.3501 1.36997 14.6801 2.09997 13.2601 3.59997Z" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Edit highlight — blue accent */}
      <path d="M11.8899 5.05005C12.3199 7.81005 14.5599 9.92005 17.3399 10.2" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 22H21" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// DOCUMENT — File with folded corner
// ============================================================
export function DocumentIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12 13H13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 13H9.45" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 17H11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 9C2 4 4 2 9 2H14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V12.98" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Folded corner — blue accent */}
      <path d="M18 10C15 10 14 9 14 6V2L22 10" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CAMERA — Camera with lens
// ============================================================
export function CameraIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M2.77017 18.25C2.89017 20.31 4.00017 22 6.76017 22H17.2402C20.0002 22 21.1002 20.31 21.2302 18.25L21.7502 9.99C21.8902 7.83 20.1702 6 18.0002 6C17.3902 6 16.8302 5.65 16.5502 5.11L15.8302 3.66C15.3702 2.75 14.1702 2 13.1502 2H10.8602C9.83017 2 8.63017 2.75 8.17017 3.66L7.45017 5.11C7.17017 5.65 6.61017 6 6.00017 6C3.83017 6 2.11017 7.83 2.25017 9.99L2.51017 14.06" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.5002 8H13.5002" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Lens — blue accent */}
      <path d="M12.0002 18C13.7902 18 15.2502 16.54 15.2502 14.75C15.2502 12.96 13.7902 11.5 12.0002 11.5C10.2102 11.5 8.75018 12.96 8.75018 14.75C8.75018 16.54 10.2102 18 12.0002 18Z" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// IMAGE — Image/gallery with landscape
// ============================================================
export function ImageIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M2 12.99V15C2 20 4 22 9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sun circle — blue accent */}
      <path d="M11 8C11 9.1 10.1 10 9 10C7.9 10 7 9.1 7 8C7 6.9 7.9 6 9 6" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Landscape line */}
      <path d="M2.67001 18.9501L7.60001 15.6401C8.39001 15.1101 9.53001 15.1701 10.24 15.7801L10.57 16.0701C11.35 16.7401 12.61 16.7401 13.39 16.0701L17.55 12.5001C18.33 11.8301 19.59 11.8301 20.37 12.5001L22 13.9001" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// MAP PIN — Location marker
// ============================================================
export function MapPinIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Pin dot — blue accent */}
      <path d="M15.12 10.3099C15.12 12.0299 13.73 13.4299 12 13.4299C10.27 13.4299 8.88 12.0399 8.88 10.3099C8.88 8.57994 10.28 7.18994 12 7.18994C12.34 7.18994 12.67 7.23994 12.97 7.33994" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Pin body */}
      <path d="M5.97996 4.29994C10.35 0.189939 18.82 1.59994 20.38 8.50994C21.53 13.5899 18.37 17.8899 15.6 20.5499C13.59 22.4899 10.41 22.4899 8.38996 20.5499C5.62996 17.8799 2.45996 13.5799 3.61996 8.49994" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// MESSAGE TEXT — Chat bubble with text lines
// ============================================================
export function MessageTextIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M22 8C22 4 20 2 16 2H8C4 2 2 4 2 8V21C2 21.55 2.45 22 3 22H16C20 22 22 20 22 16V12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Text lines — blue accent */}
      <path d="M15 9.5H17" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 9.5H12" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 14.5H14" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// MAIL — Email envelope
// ============================================================
export function MailIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M22 12.98V15.5C22 19 20 20.5 17 20.5H7" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 8.5C2 5 4 3.5 7 3.5H17C20 3.5 22 5 22 8.5" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Envelope flap — blue accent */}
      <path d="M17 9L13.87 11.5C12.84 12.32 11.15 12.32 10.12 11.5L7 9" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 16.5H8" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12.5H5" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// PHONE — Phone handset
// ============================================================
export function PhoneIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M9.39 6.01C9.57 6.26 9.7 6.49 9.79 6.71C9.88 6.92 9.93 7.13 9.93 7.32C9.93 7.56 9.86 7.8 9.72 8.03C9.59 8.26 9.4 8.5 9.16 8.74L8.4 9.53C8.29 9.64 8.24 9.77 8.24 9.93C8.24 10.01 8.25 10.08 8.27 10.16C8.3 10.24 8.33 10.3 8.35 10.36C8.53 10.69 8.84 11.12 9.28 11.64C9.73 12.16 10.21 12.69 10.73 13.22C11.27 13.75 11.79 14.24 12.32 14.69C12.84 15.13 13.27 15.43 13.61 15.61C13.66 15.63 13.72 15.66 13.79 15.69C13.87 15.72 13.95 15.73 14.04 15.73C14.21 15.73 14.34 15.67 14.45 15.56L15.21 14.81C15.46 14.56 15.7 14.37 15.93 14.25C16.16 14.11 16.39 14.04 16.64 14.04C16.83 14.04 17.03 14.08 17.25 14.17C17.47 14.26 17.7 14.39 17.95 14.56L21.26 16.91C21.52 17.09 21.7 17.3 21.81 17.55C21.91 17.8 21.97 18.05 21.97 18.33C21.97 18.69 21.89 19.06 21.72 19.42C21.55 19.78 21.33 20.12 21.04 20.44C20.55 20.98 20.01 21.37 19.4 21.62C18.8 21.87 18.15 22 17.45 22C16.43 22 15.34 21.76 14.19 21.27C13.04 20.78 11.89 20.12 10.75 19.29C9.6 18.45 8.51 17.52 7.47 16.49C6.44 15.45 5.51 14.36 4.68 13.22C3.86 12.08 3.2 10.94 2.72 9.81C2.24 8.67 2 7.58 2 6.54C2 5.86 2.12 5.21 2.36 4.61C2.6 4 2.98 3.44 3.51 2.94C4.15 2.31 4.85 2 5.59 2C5.87 2 6.15 2.06 6.4 2.18C6.66 2.3 6.89 2.48 7.07 2.74" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// TRUCK — Delivery truck
// ============================================================
export function TruckIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M11.9998 14H12.9998C14.0998 14 14.9998 13.1 14.9998 12V2H5.99976C4.49976 2 3.18977 2.82999 2.50977 4.04999" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 17C2 18.66 3.34 20 5 20H6C6 18.9 6.9 18 8 18C9.1 18 10 18.9 10 20H14C14 18.9 14.9 18 16 18C17.1 18 18 18.9 18 20H19C20.66 20 22 18.66 22 17V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L18.58 6.01001C18.22 5.39001 17.56 5 16.84 5H15V12C15 13.1 14.1 14 13 14H12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Wheels */}
      <path d="M8 22C9.10457 22 10 21.1046 10 20C10 18.8954 9.10457 18 8 18C6.89543 18 6 18.8954 6 20C6 21.1046 6.89543 22 8 22Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 22C17.1046 22 18 21.1046 18 20C18 18.8954 17.1046 18 16 18C14.8954 18 14 18.8954 14 20C14 21.1046 14.8954 22 16 22Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 12V14H19C18.45 14 18 13.55 18 13V10C18 9.45 18.45 9 19 9H20.29L22 12Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 8H8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 11H6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 14H4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// STAR — Rating/review star
// ============================================================
export function StarIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M20.1 8.61001C22.14 8.95001 22.62 10.43 21.15 11.89L18.67 14.37C18.25 14.79 18.02 15.6 18.15 16.18L18.86 19.25C19.42 21.68 18.13 22.62 15.98 21.35L12.99 19.58C12.45 19.26 11.56 19.26 11.01 19.58L8.02003 21.35C5.88003 22.62 4.58003 21.67 5.14003 19.25L5.85003 16.18C5.98003 15.6 5.75003 14.79 5.33003 14.37L2.85003 11.89C1.39003 10.43 1.86003 8.95001 3.90003 8.61001L7.09003 8.08001C7.62003 7.99001 8.26003 7.52002 8.50003 7.03001L10.26 3.51001C11.21 1.60001 12.77 1.60001 13.73 3.51001L15.49 7.03001C15.59 7.24001 15.77 7.45001 15.98 7.62001" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CLOCK — Time/clock face
// ============================================================
export function ClockIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Clock hands — blue accent */}
      <path d="M15.7099 15.18L12.6099 13.33C12.0699 13.01 11.6299 12.24 11.6299 11.61V7.51001" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Clock circle */}
      <path d="M4 6C2.75 7.67 2 9.75 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C10.57 2 9.2 2.3 7.97 2.85" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// BRIEFCASE — Work bag with clasp
// ============================================================
export function BriefcaseIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M21.37 14L21.71 10.43C21.97 7.99 21.27 6 17 6H7.00001C2.73001 6 2.03001 7.99 2.30001 10.43L3.05001 18.43C3.26001 20.39 3.98001 22 8.00001 22H16C20.02 22 20.74 20.39 20.95 18.43" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 6V5.2C8 3.43 8 2 11.2 2H12.8C16 2 16 3.43 16 5.2V6" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Clasp — blue accent */}
      <path d="M14 13V14C14 14.01 14 14.01 14 14.02C14 15.11 13.99 16 12 16C10.02 16 10 15.12 10 14.03V13C10 12 10 12 11 12H13C14 12 14 12 14 13Z" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.65 11C19.34 12.68 16.7 13.68 14 14.02" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.62 11.27C4.87 12.81 7.41 13.74 10 14.03" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// SAVE — Bookmark/save
// ============================================================
export function SaveIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M22 9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H15C20 22 22 20 22 15V12.97" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7 4.98994V2.43994" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bookmark — blue accent */}
      <path d="M17 2.43994V12.4199C17 14.3899 15.59 15.1599 13.86 14.1199L12.54 13.3299C12.24 13.1499 11.76 13.1499 11.46 13.3299L10.14 14.1199C8.41 15.1499 7 14.3899 7 12.4199V8.99994" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CALCULATOR — Calculator with buttons
// ============================================================
export function CalculatorIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M3 12.97V15C3 20 5 22 10 22H14C19 22 21 20 21 15V9C21 4 19 2 14 2H10C5 2 3 4 3 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Display — blue accent */}
      <path d="M16.5 7.57996V8.57996C16.5 9.39996 15.83 10.08 15 10.08H9C8.18 10.08 7.5 9.40996 7.5 8.57996V7.57996C7.5 6.75996 8.17 6.07996 9 6.07996H15C15.83 6.07996 16.5 6.74996 16.5 7.57996Z" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Button dots */}
      <path d="M8.13612 14H8.14767" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9952 14H12.0068" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.8543 14H15.8659" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.13612 17.5H8.14767" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9952 17.5H12.0068" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.8543 17.5H15.8659" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// NAV ARROW — Navigation/directions arrow
// ============================================================
export function NavArrowIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M2 13.05V15C2 20 4 22 9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Arrow — blue accent */}
      <path d="M17.35 9.05004L15.01 16.59C14.45 18.38 11.94 18.41 11.35 16.63L10.65 14.56C10.46 13.99 10.01 13.53 9.43997 13.35L7.35997 12.65C5.58997 12.06 5.61997 9.53004 7.40997 8.99004L14.95 6.64003C16.43 6.19003 17.82 7.58004 17.35 9.05004Z" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// SHIELD — Filled shield (security/protection)
// ============================================================
export function ShieldIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M20.4098 6.95994V9.79994L7.39984 19.3399L4.76984 17.3699C4.11984 16.8799 3.58984 15.8299 3.58984 15.0199V6.95994C3.58984 5.83994 4.44984 4.59994 5.49984 4.20994L10.9698 2.15994C11.5398 1.94994 12.4598 1.94994 13.0298 2.15994L18.4998 4.20994C19.5498 4.59994 20.4098 5.83994 20.4098 6.95994Z" fill="currentColor" opacity="0.78" />
      <path d="M20.4098 11.1699V15.0199C20.4098 15.8299 19.8798 16.8799 19.2298 17.3699L13.7598 21.4599C13.2798 21.8199 12.6398 21.9999 11.9998 21.9999C11.3598 21.9999 10.7198 21.8199 10.2398 21.4599L8.31982 20.0299L20.4098 11.1699Z" fill="currentColor" />
    </Icon>
  );
}

// ============================================================
// INCOMING MONEY — Dollar with incoming arrow
// ============================================================
export function IncomingMoneyIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.17999 10.16 8.48999 10.96 8.48999H12.84C13.76 8.48999 14.51 9.26999 14.51 10.24" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Arrow — blue accent */}
      <path d="M17 3V7H21" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 2L17 7" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 2C6.48 2 2 6.48 2 12C2 15.94 4.28001 19.35 7.60001 20.98" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 12C22 17.52 17.52 22 12 22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CHECK SQUARE — Checkmark in rounded square
// ============================================================
export function CheckSquareIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M2 12.96V15C2 20 4 22 9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Checkmark — blue accent */}
      <path d="M15 10.38L16.12 9.25" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.87988 12L10.6199 14.75L13.1699 12.21" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// TROPHY — Award/leaderboard
// ============================================================
export function TrophyIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12.1499 16.5V18.6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.1499 22H17.1499V21C17.1499 19.9 16.2499 19 15.1499 19H9.1499C8.0499 19 7.1499 19.9 7.1499 21V22Z" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" />
      <path d="M6.1499 22H18.1499" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Cup — blue accent */}
      <path d="M8.51 15.07C6.41 13.86 5 11.6 5 9V6C5 3.79 6.79 2 9 2H15C17.21 2 19 3.79 19 6V9C19 12.82 15.95 15.92 12.15 16C12.1 16 12 16 12 16" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.47004 11.6501C4.72004 11.4101 4.06004 10.9701 3.54004 10.4501C2.64004 9.4501 2.04004 8.2501 2.04004 6.8501C2.04004 5.4501 3.14004 4.3501 4.54004 4.3501H5.19004C4.99004 4.8101 4.89004 5.3201 4.89004 5.8501V8.8501C4.89004 9.8501 5.10004 10.7901 5.47004 11.6501Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.53 11.6501C19.28 11.4101 19.94 10.9701 20.46 10.4501C21.36 9.4501 21.96 8.2501 21.96 6.8501C21.96 5.4501 20.86 4.3501 19.46 4.3501H18.81C19.01 4.8101 19.11 5.3201 19.11 5.8501V8.8501C19.11 9.8501 18.9 10.7901 18.53 11.6501Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// FLAG — Flag marker
// ============================================================
export function FlagIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M6.44995 2V22" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Flag body — blue accent */}
      <path d="M15.05 7.5C18.35 8.9 18.35 11.3 15.25 12.9L6.94995 17" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.94995 4L11.54 5.98" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// FILTER SEARCH — Funnel with magnifying glass
// ============================================================
export function FilterSearchIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M5.33008 2H18.67C19.78 2 20.6901 2.90999 20.6901 4.01999V6.23999C20.6901 7.04999 20.1801 8.06 19.6801 8.56" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.3201 19.0699C14.3201 19.6799 13.92 20.4799 13.41 20.7899L12.0001 21.7C10.6901 22.51 8.87006 21.5999 8.87006 19.9799V14.6299C8.87006 13.9199 8.47006 13.0099 8.06006 12.5099L4.22003 8.46994C3.71003 7.95994 3.31006 7.05995 3.31006 6.44995" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Search circle — blue accent */}
      <path d="M16.0701 16.5201C17.8374 16.5201 19.2701 15.0874 19.2701 13.3201C19.2701 11.5528 17.8374 10.1201 16.0701 10.1201C14.3028 10.1201 12.8701 11.5528 12.8701 13.3201C12.8701 15.0874 14.3028 16.5201 16.0701 16.5201Z" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19.8701 17.1201L18.8701 16.1201" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// LAYER — Stacked layers
// ============================================================
export function LayerIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Top layer — blue accent */}
      <path d="M18.9198 5.54001C20.6198 6.29001 20.6198 7.53001 18.9198 8.28001L13.0198 10.9C12.3498 11.2 11.2498 11.2 10.5798 10.9L4.67979 8.28001C2.97979 7.53001 2.97979 6.29001 4.67979 5.54001L10.5798 2.92001C11.2498 2.62001 12.3498 2.62001 13.0198 2.92001L14.9398 3.77001" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 11C3 11.84 3.63 12.81 4.4 13.15L11.19 16.17C11.71 16.4 12.3 16.4 12.81 16.17L19.6 13.15C20.37 12.81 21 11.84 21 11" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 16C3 16.93 3.55 17.77 4.4 18.15L11.19 21.17C11.71 21.4 12.3 21.4 12.81 21.17L19.6 18.15C20.45 17.77 21 16.93 21 16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// SINGLE USER — Person profile
// ============================================================
export function SingleUserIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M15.02 3.01001C14.18 2.37001 13.14 2 12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.5899 22C20.5899 18.13 16.7399 15 11.9999 15C7.25991 15 3.40991 18.13 3.40991 22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// SEARCH USER — Person with magnifying glass
// ============================================================
export function SearchUserIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M15.02 3.01001C14.18 2.37001 13.14 2 12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Search circle — blue accent */}
      <path d="M18.2 21.4C19.9673 21.4 21.4 19.9673 21.4 18.2C21.4 16.4327 19.9673 15 18.2 15C16.4327 15 15 16.4327 15 18.2C15 19.9673 16.4327 21.4 18.2 21.4Z" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 22L21 21" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// EDIT USER — Person with edit pencil
// ============================================================
export function EditUserIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M15.02 3.01001C14.18 2.37001 13.14 2 12 2C9.24 2 7 4.24 7 7C7 9.76 9.24 12 12 12C14.76 12 17 9.76 17 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Pencil — blue accent */}
      <path d="M19.2101 15.74L15.67 19.2801C15.53 19.4201 15.4 19.68 15.37 19.87L15.18 21.22C15.11 21.71 15.45 22.05 15.94 21.98L17.29 21.79C17.48 21.76 17.75 21.63 17.88 21.49L21.42 17.95C22.03 17.34 22.32 16.63 21.42 15.73C20.53 14.84 19.8201 15.13 19.2101 15.74Z" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.7002 16.25C19.0002 17.33 19.8402 18.17 20.9202 18.47" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.40991 22C3.40991 18.13 7.25994 15 11.9999 15C13.0399 15 14.0399 15.15 14.9699 15.43" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// MULTI USER — Multiple people
// ============================================================
export function MultiUserIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12.6801 3.96C13.1601 4.67 13.4401 5.52 13.4401 6.44C13.4301 8.84 11.5401 10.79 9.16006 10.87C9.06006 10.86 8.94006 10.86 8.83006 10.87C6.45006 10.79 4.56006 8.84 4.56006 6.44C4.56006 3.99 6.54006 2 9.00006 2" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Secondary user — blue accent */}
      <path d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.15997 14.56C1.73997 16.18 1.73997 18.82 4.15997 20.43C6.90997 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.91997 12.73 4.15997 14.56Z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.34 20C19.06 19.85 19.74 19.56 20.3 19.13C21.86 17.96 21.86 16.03 20.3 14.86C19.75 14.44 19.08 14.16 18.37 14" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// TRASH — Delete/remove
// ============================================================
export function TrashIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Lid */}
      <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.2099 21.9999H8.7899C5.9999 21.9999 5.9099 20.7799 5.7999 19.2099L5.1499 9.13989" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.8502 9.13989L18.2002 19.2099" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.3301 16.5H13.6601" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.8198 12.5H14.4998" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.5 12.5H10.33" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// LINK — Chain link
// ============================================================
export function LinkIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M14.99 17.5H16.5C19.52 17.5 22 15.03 22 12C22 8.98 19.53 6.5 16.5 6.5H14.99" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.37 10.01C2.13 10.63 2 11.3 2 12C2 15.02 4.47 17.5 7.5 17.5H9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9.00005 6.5H7.50005C6.67005 6.5 5.89005 6.68 5.18005 7.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Center bar — blue accent */}
      <path d="M8 12H16" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// FAVORITE CHART — Chart with star
// ============================================================
export function FavoriteChartIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M22 13V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22H13" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Chart line — blue accent */}
      <path d="M7.33008 14.49L9.71008 11.4C10.0501 10.96 10.6801 10.88 11.1201 11.22L12.9501 12.66C13.3901 13 14.0201 12.92 14.3601 12.49L16.6701 9.51001" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Star */}
      <path d="M20.55 16.9799C20.25 16.9299 19.89 16.6599 19.75 16.3799L19.47 15.8099C18.93 14.7199 18.05 14.7199 17.52 15.8099L17.24 16.3799C17.1 16.6599 16.75 16.9199 16.44 16.9799L16.06 17.0399C14.92 17.2299 14.65 18.0699 15.47 18.8999L15.82 19.2499C16.05 19.4899 16.1799 19.9499 16.1099 20.2699L16.06 20.4799C15.75 21.8599 16.48 22.3899 17.68 21.6699L17.94 21.5199C18.25 21.3399 18.75 21.3399 19.06 21.5199L19.32 21.6699C20.53 22.3999 21.26 21.8599 20.94 20.4799L20.89 20.2699" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// STATUS UP — Bar chart trending up
// ============================================================
export function StatusUpIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M6.87988 18.15V16.08" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M12 18.15V14.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M17.1201 18.1501V11.9301" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      {/* Trend arrow — blue accent */}
      <path d="M17.1199 5.84998L16.6599 6.38998C14.1099 9.36998 10.6899 11.48 6.87988 12.43" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M14.1899 5.84998H17.1199V8.76998" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 12.97V15C2 20 4 22 9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CIRCLE GRAPH — Pie/donut chart
// ============================================================
export function CircleGraphIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Main segment — blue accent */}
      <path d="M16.28 2.96006C13 2.00006 12 3.08006 12 5.68006V8.56006C12 11.0001 13 12.0001 15 12.0001H18.32C20.92 12.0001 22 11.0001 21.04 7.72006C20.82 6.98006 20.46 6.27006 20 5.63006" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2.12005 14.43C1.31005 9.39001 4.65005 4.95001 9.26005 4.01001" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 14.7C19.07 19.33 14.63 22.69 9.58 21.87C7.35 21.52 5.37 20.31 4 18.61" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// SORT ARROW — Up/down sort arrows
// ============================================================
export function SortArrowIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Down arrow */}
      <path d="M13.55 17.28L17.27 21L20.99 17.28" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.27 10.01V21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.27 3V5.98999" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Up arrow — blue accent */}
      <path d="M10.45 6.71997L6.72998 3L3.01001 6.71997" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.72998 3V14.09" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.72998 21V18.03" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// REFRESH — Circular refresh arrows
// ============================================================
export function RefreshIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M18.01 19.99C16.34 21.25 14.25 22 12 22C6.48 22 3.11 16.44 3.11 16.44M3.11 16.44H7.63M3.11 16.44V21.44M22 12C22 13.82 21.51 15.53 20.66 17M6.03 3.97C7.69 2.73 9.75 2 12 2C18.67 2 22 7.56 22 7.56M22 7.56V2.56M22 7.56H17.56M2 12C2 10.18 2.48 8.47 3.33 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// GIFT — Gift box with ribbon
// ============================================================
export function GiftIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M3.97 18C3.97 21 4.97 22 7.97 22H15.97C18.97 22 19.97 21 19.97 18V10H3.97V13.84" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M21.5 7V8C21.5 9.1 20.97 10 19.5 10H4.5C2.97 10 2.5 9.1 2.5 8V7C2.5 5.9 2.97 5 4.5 5H19.5C20.97 5 21.5 5.9 21.5 7Z" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Bows — blue accent */}
      <path d="M11.64 4.99994H6.12C5.78 4.62994 5.79 4.05994 6.15 3.69994L7.57 2.27994C7.94 1.90994 8.55 1.90994 8.92 2.27994L11.64 4.99994Z" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.87 4.99994H12.35L15.07 2.27994C15.44 1.90994 16.05 1.90994 16.42 2.27994L17.84 3.69994C18.2 4.05994 18.21 4.62994 17.87 4.99994Z" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.94 10V15.14C8.94 15.94 9.82 16.41 10.49 15.98L11.43 15.36C11.77 15.14 12.2 15.14 12.53 15.36L13.42 15.96C14.08 16.4 14.97 15.93 14.97 15.13V10H8.94Z" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// UPLOAD — File upload with arrow
// ============================================================
export function UploadIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Upload arrow — blue accent */}
      <path d="M9 13.65V11L11 13" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 17V16" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11L7 13" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 9C2 4 4 2 9 2H14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V12.98" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 10C15 10 14 9 14 6V2L22 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// DOWNLOAD — File download with arrow
// ============================================================
export function DownloadIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Download arrow — blue accent */}
      <path d="M9 14.35V17L11 15" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 11V12" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 17L7 15" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M2 9C2 4 4 2 9 2H14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 10V15C22 20 20 22 15 22H9C4 22 2 20 2 15V12.98" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 10C15 10 14 9 14 6V2L22 10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// PEN — Writing pen
// ============================================================
export function PenIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Pen tip — blue accent */}
      <path d="M19.7901 7.27L16.7601 4.24C15.6101 3.09 14.0401 3.15 13.2701 4.38L11.5801 7.05L16.9801 12.45L19.6501 10.76C20.8001 10.03 20.8701 8.35 19.7901 7.27Z" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Paper/body */}
      <path d="M7.64999 6.81C5.45999 6.68 4.68999 7.35 4.44999 9.44L3.46999 17.76C3.25999 19.51 4.52999 20.77 6.26999 20.56L14.59 19.58C16.68 19.33 17.44 18.57 17.22 16.38L16.99 12.45" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Stroke line */}
      <path d="M4.60986 19.42L7.63986 16.38" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CALENDAR 2 — Plain calendar (no checkmark, for progress trackers)
// ============================================================
export function Calendar2Icon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M8 2V5" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 2V5" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      {/* Header line — blue accent */}
      <path d="M3.5 9.08997H20.5" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 13.01V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.6947 13.7H15.7037" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15.6947 16.7H15.7037" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9956 13.7H12.0046" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9956 16.7H12.0046" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.29431 13.7H8.30329" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.29431 16.7H8.30329" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// PLUS — Add/create
// ============================================================
export function PlusIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12 18V6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 12H18" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 12H11.66" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// TRIANGLE ALERT — Warning triangle with exclamation
// ============================================================
export function TriangleAlertIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Exclamation — blue accent */}
      <path d="M12 9V14" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Triangle */}
      <path d="M20.2399 14L21.2999 15.9C22.9799 18.93 21.5199 21.41 18.0599 21.41H11.9999H5.93993C2.46993 21.41 1.01993 18.93 2.69993 15.9L5.81993 10.28L8.75993 5.00003C10.5399 1.79003 13.4599 1.79003 15.2399 5.00003L18.1799 10.29" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dot */}
      <path d="M11.9946 17H12.0036" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// TRIANGLE ALERT AMBER — Warning triangle, fully amber (no purple)
// ============================================================
export function TriangleAlertAmberIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12 9V14" stroke="#d97706" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20.2399 14L21.2999 15.9C22.9799 18.93 21.5199 21.41 18.0599 21.41H11.9999H5.93993C2.46993 21.41 1.01993 18.93 2.69993 15.9L5.81993 10.28L8.75993 5.00003C10.5399 1.79003 13.4599 1.79003 15.2399 5.00003L18.1799 10.29" stroke="#d97706" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.9946 17H12.0036" stroke="#d97706" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CIRCLE ALERT — Circle with exclamation mark
// ============================================================
export function CircleAlertIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Exclamation — blue accent */}
      <path d="M12 8V13" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Circle */}
      <path d="M4 6C2.75 7.67 2 9.75 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C10.57 2 9.2 2.3 7.97 2.85" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Dot */}
      <path d="M11.9946 16H12.0036" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// CIRCLE CHECK — Circle with checkmark
// ============================================================
export function CircleCheckIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Circle */}
      <path d="M4 6C2.75 7.67 2 9.75 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2C10.57 2 9.2 2.3 7.97 2.85" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Checkmark — blue accent */}
      <path d="M15 10.38L16.12 9.25" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.87988 12L10.6199 14.75L13.1699 12.21" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// MAP — Folded map with grid lines
// ============================================================
export function MapIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Map body */}
      <path d="M4.27004 5.48998L3.30004 6.04998C2.75004 6.36998 2.29004 7.14998 2.29004 7.78998V17.52C2.29004 19.42 3.64004 20.2 5.28004 19.26L7.63004 17.92C8.14004 17.63 8.99004 17.6 9.52004 17.87L14.77 20.5C15.3 20.76 16.15 20.74 16.66 20.45L20.99 17.97C21.54 17.65 22 16.87 22 16.23V6.48998C22 4.58998 20.65 3.80998 19.01 4.74998L16.66 6.08998C16.15 6.37998 15.3 6.40998 14.77 6.13998L9.52004 3.51998C8.99004 3.25998 8.14004 3.27998 7.63004 3.56998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Left fold line — blue accent */}
      <path d="M8.56006 4V17" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Right fold line */}
      <path d="M15.73 6.62V20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Icon>
  );
}

// ============================================================
// EXPORT LINK — Box with outgoing arrow (send portal/share)
// ============================================================
export function ExportLinkIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Arrow — blue accent */}
      <path d="M13 11L21.2 2.79999" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 6.8V2H17.2" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Box */}
      <path d="M2 12.99V15C2 20 4 22 9 22H15C20 22 22 20 22 15V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 2H9C4 2 2 4 2 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Icon>
  );
}

// ============================================================
// MONEY SEND — Dollar with outgoing arrow
// ============================================================
// ============================================================
// VIEW ARROW — Tilted arrow pointing northeast (open/view item)
// ============================================================
export function ViewArrowIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M3.07005 16.3C1.62005 19.05 4.55005 22.04 7.33005 20.65L10.57 19.03C11.47 18.58 12.53 18.58 13.43 19.03L16.67 20.65C19.45 22.04 22.37 19.05 20.93 16.3L14.83 4.71C13.63 2.43 10.37 2.43 9.17005 4.71L5.50005 11.68" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" transform="rotate(45 12 12)"/>
    </Icon>
  );
}

export function MoneySendIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M9.5 13.75C9.5 14.72 10.25 15.5 11.17 15.5H13.05C13.85 15.5 14.5 14.82 14.5 13.97C14.5 13.06 14.1 12.73 13.51 12.52L10.5 11.47C9.91 11.26 9.51001 10.94 9.51001 10.02C9.51001 9.17999 10.16 8.48999 10.96 8.48999H12.84C13.76 8.48999 14.51 9.26999 14.51 10.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 7.5V16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2C6.48 2 2 6.48 2 12C2 15.94 4.28001 19.35 7.60001 20.98" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 12C22 17.52 17.52 22 12 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Arrow — blue accent */}
      <path d="M22 6V2H18" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17 7L22 2" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Icon>
  );
}

// ============================================================
// RECURRING — Cycle arrows for recurring items
// ============================================================
export function RecurringIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Top arrow — blue accent */}
      <path d="M17.4199 5.15997C19.0799 5.15997 20.4199 6.49997 20.4199 8.15997V11.48" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3.57996 5.15997H12.99" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6.73996 2L3.57996 5.15997L6.73996 8.32001" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Bottom arrow */}
      <path d="M20.42 18.84H6.57996C4.91996 18.84 3.57996 17.5 3.57996 15.84V12.52" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M17.26 22L20.42 18.84L17.26 15.68" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
    </Icon>
  );
}

// ============================================================
// WALLET — Wallet with card slot
// ============================================================
export function WalletIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      {/* Wallet body */}
      <path d="M2.5 14.07V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12.2798 2.17006C13.5198 1.70006 14.8498 2.62009 14.8498 3.95009V7.75008" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2.5 12.4099V7.83997C2.5 6.64997 3.23 5.58992 4.34 5.16992L8.31 3.66992" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      {/* Card slot — blue accent */}
      <path d="M22.5598 13.9699V16.03C22.5598 16.58 22.1198 17.0299 21.5598 17.0499H19.5998C18.5198 17.0499 17.5298 16.2599 17.4398 15.1799C17.3798 14.5499 17.6198 13.9599 18.0398 13.5499C18.4098 13.1699 18.9198 12.95 19.4798 12.95H21.5598C22.1198 12.97 22.5598 13.4199 22.5598 13.9699Z" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 12H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Icon>
  );
}

// ============================================================
// COIN — Stacked coin for earnings
// ============================================================
export function CoinIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12 22C15.59 22 18.5 19.47 18.5 16.35V12.65C18.5 15.77 15.59 18 12 18C8.41 18 5.5 15.77 5.5 12.65V16.35C5.5 18.06 6.37 19.59 7.75 20.62" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 7.65C18.5 8.56 18.25 9.4 17.81 10.12C16.74 11.88 14.54 13 12 13C9.46 13 7.26 11.88 6.19 10.12C5.75 9.4 5.5 8.56 5.5 7.65C5.5 6.09 6.22999 4.68 7.39999 3.66C8.57999 2.63 10.2 2 12 2C13.8 2 15.42 2.63 16.6 3.65C17.77 4.68 18.5 6.09 18.5 7.65Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M18.5 7.65V12.65C18.5 15.77 15.59 18 12 18C8.41 18 5.5 15.77 5.5 12.65V7.65C5.5 4.53 8.41 2 12 2C13.8 2 15.42 2.63 16.6 3.65C17.77 4.68 18.5 6.09 18.5 7.65Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </Icon>
  );
}

// ============================================================
// RECEIVED — Incoming request/received arrow
// ============================================================
export function ReceivedIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M16.59 5.91L19 3.5" stroke="#7c3aed" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 17.5L13.38 9.12" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 7.22998V17.5H15.27" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 22H20.5" stroke="currentColor" strokeWidth="1.75" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

// ============================================================
// MICROPHONE — Voice recording
// ============================================================
// ============================================================
// CHEVRON RIGHT — Navigation arrow
// ============================================================
export function ChevronRightIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M12.9 7.93994L15.52 10.5599C16.29 11.3299 16.29 12.5899 15.52 13.3599L9 19.8699" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 4.04004L10.04 5.08004" stroke="#7c3aed" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
}

export function MicrophoneIcon({ size = 18, ...props }: IconProps) {
  return (
    <Icon size={size} {...props}>
      <path d="M7.99963 10.02V11.5C7.99963 13.71 9.78963 15.5 11.9996 15.5C14.2096 15.5 15.9996 13.71 15.9996 11.5V6C15.9996 3.79 14.2096 2 11.9996 2C9.78963 2 7.99963 3.79 7.99963 6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Outer arc — blue accent */}
      <path d="M4.34961 9.6499V11.3499C4.34961 15.5699 7.77961 18.9999 11.9996 18.9999C16.2196 18.9999 19.6496 15.5699 19.6496 11.3499V9.6499" stroke="#7c3aed" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Sound lines */}
      <path d="M10.6096 6.43012C11.5096 6.10012 12.4896 6.10012 13.3896 6.43012" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.1996 8.55007C11.7296 8.41007 12.2796 8.41007 12.8096 8.55007" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {/* Stem */}
      <path d="M11.9996 19V22" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </Icon>
  );
} 
export function WarningIcon({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="12" y1="9" x2="12" y2="13" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.5" fill="#7c3aed" stroke="#7c3aed" strokeWidth="1" />
    </svg>
  );
}