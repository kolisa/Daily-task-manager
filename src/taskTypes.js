/**
 * taskTypes.js
 * All task-type constants and pure helper utilities.
 * Extracted so they can be imported independently (e.g. in tests).
 */

import {
  Code,
  Bug,
  Wrench,
  BookOpen,
  Users,
  Target,
  FileText,
  CheckCircle2,
  Play,
  Briefcase,
  Coffee,
} from 'lucide-react';

// ─── Task types ──────────────────────────────────────────────────────────────
export const TASK_TYPES = [
  { value: 'feature',       label: 'Feature',       icon: Code,          color: 'blue'   },
  { value: 'bug',           label: 'Bug Fix',        icon: Bug,           color: 'red'    },
  { value: 'support',       label: 'Support',        icon: Wrench,        color: 'green'  },
  { value: 'learning',      label: 'Learning',       icon: BookOpen,      color: 'purple' },
  { value: 'standup',       label: 'Standup',        icon: Users,         color: 'amber',  group: 'meetings' },
  { value: 'meeting',       label: 'Meeting',        icon: Users,         color: 'orange', group: 'meetings' },
  { value: 'analysis',      label: 'Analysis',       icon: Target,        color: 'indigo' },
  { value: 'documentation', label: 'Documentation',  icon: FileText,      color: 'teal'   },
  { value: 'testing',       label: 'Testing',        icon: CheckCircle2,  color: 'cyan'   },
  { value: 'demo',          label: 'Demo',           icon: Play,          color: 'pink'   },
];

/** Returns true for meeting/standup types that should be auto-completed when past. */
export const isMeetingType = (type) => ['standup', 'meeting'].includes(type);

/** Find a task type definition; falls back to the first entry (feature) for unknowns. */
export const getTaskTypeInfo = (typeValue) =>
  TASK_TYPES.find((t) => t.value === typeValue) ?? TASK_TYPES[0];

// ─── Task sizes ──────────────────────────────────────────────────────────────
export const TASK_SIZES = [
  { value: 'xs',  label: 'XS (< 1h)',       hours: 0.5  },
  { value: 's',   label: 'S (1-2h)',         hours: 1.5  },
  { value: 'm',   label: 'M (2-4h)',         hours: 3    },
  { value: 'l',   label: 'L (4-8h)',         hours: 6    },
  { value: 'xl',  label: 'XL (1-2 days)',    hours: 12   },
  { value: 'xxl', label: 'XXL (2+ days)',    hours: 16   },
];

/** Find a task size definition; falls back to 'm' (index 2) for unknowns. */
export const getTaskSizeInfo = (sizeValue) =>
  TASK_SIZES.find((s) => s.value === sizeValue) ?? TASK_SIZES[2];

// Complexity points for task sizes (story points style)
export const SIZE_POINTS = { xs: 1, s: 2, m: 3, l: 5, xl: 8, xxl: 13 };

// ─── Priorities ──────────────────────────────────────────────────────────────
export const PRIORITY_LEVELS = [
  { value: 'high',   label: 'High Priority',   color: 'red',    icon: '🔴' },
  { value: 'medium', label: 'Medium Priority',  color: 'yellow', icon: '🟡' },
  { value: 'low',    label: 'Low Priority',     color: 'green',  icon: '🟢' },
];

export const PRIORITY_MULTIPLIERS = { high: 1.5, medium: 1.0, low: 0.75 };

// ─── Quality ratings ─────────────────────────────────────────────────────────
export const QUALITY_RATINGS = [
  { value: 'excellent', label: 'Excellent - First try, no rework', score: 5 },
  { value: 'good',      label: 'Good - Minor revisions',          score: 4 },
  { value: 'average',   label: 'Average - Some rework needed',    score: 3 },
  { value: 'poor',      label: 'Poor - Significant rework',       score: 2 },
  { value: 'unrated',   label: 'Not yet rated',                   score: 0 },
];

// ─── Recurrence ──────────────────────────────────────────────────────────────
export const RECURRENCE_PATTERNS = [
  { value: 'none',      label: 'No Recurrence'                         },
  { value: 'daily',     label: 'Daily (Every day)'                     },
  { value: 'weekdays',  label: 'Weekdays (Mon-Fri)'                    },
  { value: 'custom',    label: 'Custom Days (Select specific days)'    },
  { value: 'weekly',    label: 'Weekly (Same day each week)'           },
  { value: 'biweekly',  label: 'Bi-weekly (Every 2 weeks)'            },
  { value: 'monthly',   label: 'Monthly (Same day each month)'        },
];

export const DAYS_OF_WEEK = [
  { value: 1, label: 'Mon', full: 'Monday'    },
  { value: 2, label: 'Tue', full: 'Tuesday'   },
  { value: 3, label: 'Wed', full: 'Wednesday' },
  { value: 4, label: 'Thu', full: 'Thursday'  },
  { value: 5, label: 'Fri', full: 'Friday'    },
  { value: 6, label: 'Sat', full: 'Saturday'  },
  { value: 0, label: 'Sun', full: 'Sunday'    },
];

// ─── Meeting templates ───────────────────────────────────────────────────────
export const MEETING_TEMPLATES = [
  { label: 'Quick Standup (15 min)',    duration: 0.25, time: '09:00', autoComplete: true,  durationMinutes: 15,  type: 'standup' },
  { label: 'Standard Standup (30 min)', duration: 0.5,  time: '09:30', autoComplete: true,  durationMinutes: 30,  type: 'standup' },
  { label: 'Team Sync (15 min)',        duration: 0.25, time: '14:00', autoComplete: true,  durationMinutes: 15,  type: 'standup' },
  { label: 'Team Sync (30 min)',        duration: 0.5,  time: '14:30', autoComplete: true,  durationMinutes: 30,  type: 'standup' },
  { label: 'Sprint Planning',           duration: 2,    time: '10:00', autoComplete: false, durationMinutes: 120, type: 'meeting' },
  { label: 'Sprint Review',             duration: 1,    time: '15:00', autoComplete: false, durationMinutes: 60,  type: 'meeting' },
  { label: 'Sprint Retrospective',      duration: 1,    time: '16:00', autoComplete: false, durationMinutes: 60,  type: 'meeting' },
  { label: 'Points Confirmation',       duration: 1,    time: '11:00', autoComplete: false, durationMinutes: 60,  type: 'meeting' },
  { label: 'Tech Review',               duration: 1,    time: '13:00', autoComplete: false, durationMinutes: 60,  type: 'meeting' },
  { label: '1-on-1 (30 min)',           duration: 0.5,  time: '16:30', autoComplete: true,  durationMinutes: 30,  type: 'meeting' },
];

// ─── Organisations (defaults) ─────────────────────────────────────────────────
export const DEFAULT_ORGANIZATIONS = [
  { value: 'webafrica',   label: 'Web Africa',                          icon: Briefcase, color: 'blue',    type: 'work'     },
  { value: 'lexisnexis',  label: 'LexisNexis',                          icon: Briefcase, color: 'indigo',  type: 'work'     },
  { value: 'tut',         label: 'TUT (Tshwane University of Technology)', icon: Briefcase, color: 'cyan',  type: 'work'     },
  { value: 'personal-dev',label: 'Personal Development',                icon: BookOpen,  color: 'green',   type: 'personal' },
  { value: 'bhukuveni',   label: 'Bhukuveni',                           icon: Coffee,    color: 'purple',  type: 'personal' },
  { value: 'khoi',        label: 'Khoi',                                icon: Coffee,    color: 'pink',    type: 'personal' },
  { value: 'nowmail',     label: 'Nowmail',                             icon: Coffee,    color: 'emerald', type: 'personal' },
];
