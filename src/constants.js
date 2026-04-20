export const COLORS = [
  { name: 'Red',    hex: '#c51111' },
  { name: 'Blue',   hex: '#132ed2' },
  { name: 'Green',  hex: '#117f2d' },
  { name: 'Purple', hex: '#6b2fbb' },
  { name: 'Yellow', hex: '#f5f557' },
  { name: 'Orange', hex: '#f07d0c' },
  { name: 'Pink',   hex: '#ee54bb' },
  { name: 'Black',  hex: '#3f474e' },
  { name: 'White',  hex: '#d6e0f0' },
  { name: 'Cyan',   hex: '#38fedc' },
  { name: 'Lime',   hex: '#50ef39' },
  { name: 'Maroon', hex: '#6b2a3a' },
  { name: 'Rose',   hex: '#ec7578' },
  { name: 'Banana', hex: '#f5dc75' },
  { name: 'Coral',  hex: '#ef7d7d' },
  { name: 'Tan',    hex: '#928776' },
];

export const ROLES = ['Crewmate', 'Imposter', 'Engineer', 'Scientist', 'Guardian Angel'];

// Role restricts speed options (stretch feature)
export const ROLE_SPEEDS = {
  Crewmate:       ['0.5x', '1x', '1.5x', '2x', '2.5x'],
  Imposter:       ['1x', '1.5x', '2x', '2.5x'],
  Engineer:       ['0.5x', '1x', '1.5x'],
  Scientist:      ['0.5x', '1x'],
  'Guardian Angel': ['1x', '1.5x', '2x', '2.5x'],
};

export const ALL_SPEEDS = ['0.5x', '1x', '1.5x', '2x', '2.5x'];

// Suspicion level derived from role + color (for detail page flavor)
export function getSuspicionLevel(role, color) {
  let base = 0;
  if (role === 'Imposter') base += 80;
  else if (role === 'Crewmate') base += 10;
  else if (role === 'Engineer') base += 30;
  else if (role === 'Scientist') base += 20;
  else if (role === 'Guardian Angel') base += 5;

  const hotColors = ['Red', 'Orange', 'Black'];
  if (hotColors.includes(color)) base += 15;

  return Math.min(base, 100);
}

export function getCrewStrength(crewmates) {
  if (!crewmates.length) return 0;
  const speedScore = { '0.5x': 1, '1x': 2, '1.5x': 3, '2x': 4, '2.5x': 5 };
  const avg = crewmates.reduce((sum, c) => sum + (speedScore[c.speed] || 2), 0) / crewmates.length;
  return Math.round((avg / 5) * 100);
}
