/**
 * taskTypes.test.js
 *
 * Tests for all task-type constants and helper functions exported from
 * src/taskTypes.js.  Run with:
 *   npm test
 */

import { describe, it, expect } from 'vitest';
import {
  TASK_TYPES,
  TASK_SIZES,
  SIZE_POINTS,
  PRIORITY_LEVELS,
  PRIORITY_MULTIPLIERS,
  QUALITY_RATINGS,
  RECURRENCE_PATTERNS,
  DAYS_OF_WEEK,
  MEETING_TEMPLATES,
  DEFAULT_ORGANIZATIONS,
  isMeetingType,
  getTaskTypeInfo,
  getTaskSizeInfo,
} from '../taskTypes.js';

// ─────────────────────────────────────────────────────────────────────────────
// TASK_TYPES
// ─────────────────────────────────────────────────────────────────────────────
describe('TASK_TYPES', () => {
  it('contains exactly 10 task types', () => {
    expect(TASK_TYPES).toHaveLength(10);
  });

  it('every entry has a non-empty value, label, icon and color', () => {
    TASK_TYPES.forEach((type) => {
      expect(type.value, `${type.value} – missing value`).toBeTruthy();
      expect(type.label, `${type.value} – missing label`).toBeTruthy();
      expect(type.icon,  `${type.value} – missing icon`).toBeTruthy();
      expect(type.color, `${type.value} – missing color`).toBeTruthy();
    });
  });

  it('all type values are unique', () => {
    const values = TASK_TYPES.map((t) => t.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it('includes expected type values', () => {
    const values = TASK_TYPES.map((t) => t.value);
    ['feature', 'bug', 'support', 'learning', 'standup', 'meeting',
      'analysis', 'documentation', 'testing', 'demo'
    ].forEach((v) => expect(values).toContain(v));
  });

  it('standup and meeting are in the "meetings" group', () => {
    const meetingTypes = TASK_TYPES.filter((t) => t.group === 'meetings');
    expect(meetingTypes.map((t) => t.value)).toEqual(
      expect.arrayContaining(['standup', 'meeting']),
    );
    expect(meetingTypes).toHaveLength(2);
  });

  it('non-meeting types do NOT have a group property', () => {
    TASK_TYPES
      .filter((t) => !['standup', 'meeting'].includes(t.value))
      .forEach((t) => expect(t.group).toBeUndefined());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isMeetingType
// ─────────────────────────────────────────────────────────────────────────────
describe('isMeetingType()', () => {
  it.each(['standup', 'meeting'])('returns true for "%s"', (type) => {
    expect(isMeetingType(type)).toBe(true);
  });

  it.each(['feature', 'bug', 'support', 'learning', 'analysis',
    'documentation', 'testing', 'demo'])(
    'returns false for "%s"',
    (type) => {
      expect(isMeetingType(type)).toBe(false);
    },
  );

  it('returns false for unknown/empty strings', () => {
    expect(isMeetingType('')).toBe(false);
    expect(isMeetingType('foo')).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getTaskTypeInfo
// ─────────────────────────────────────────────────────────────────────────────
describe('getTaskTypeInfo()', () => {
  it('returns the correct type object for a known value', () => {
    const info = getTaskTypeInfo('bug');
    expect(info.value).toBe('bug');
    expect(info.label).toBe('Bug Fix');
    expect(info.color).toBe('red');
  });

  it('returns standup type with amber color', () => {
    const info = getTaskTypeInfo('standup');
    expect(info.color).toBe('amber');
    expect(info.group).toBe('meetings');
  });

  it('falls back to the first type (feature) for an unknown value', () => {
    const info = getTaskTypeInfo('nonexistent');
    expect(info.value).toBe('feature');
  });

  it('falls back to feature for undefined/null', () => {
    expect(getTaskTypeInfo(undefined).value).toBe('feature');
    expect(getTaskTypeInfo(null).value).toBe('feature');
  });

  it('returns a unique entry for every defined type value', () => {
    TASK_TYPES.forEach((type) => {
      const result = getTaskTypeInfo(type.value);
      expect(result).toEqual(type);
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TASK_SIZES
// ─────────────────────────────────────────────────────────────────────────────
describe('TASK_SIZES', () => {
  it('contains exactly 6 size options', () => {
    expect(TASK_SIZES).toHaveLength(6);
  });

  it('every entry has a value, label, and positive hours', () => {
    TASK_SIZES.forEach((size) => {
      expect(size.value).toBeTruthy();
      expect(size.label).toBeTruthy();
      expect(size.hours).toBeGreaterThan(0);
    });
  });

  it('sizes are strictly increasing by estimated hours', () => {
    for (let i = 1; i < TASK_SIZES.length; i++) {
      expect(TASK_SIZES[i].hours).toBeGreaterThan(TASK_SIZES[i - 1].hours);
    }
  });

  it('includes expected size values', () => {
    const values = TASK_SIZES.map((s) => s.value);
    ['xs', 's', 'm', 'l', 'xl', 'xxl'].forEach((v) =>
      expect(values).toContain(v),
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getTaskSizeInfo
// ─────────────────────────────────────────────────────────────────────────────
describe('getTaskSizeInfo()', () => {
  it('returns the correct size object for a known value', () => {
    const info = getTaskSizeInfo('xl');
    expect(info.value).toBe('xl');
    expect(info.hours).toBe(12);
  });

  it('falls back to "m" for an unknown size', () => {
    expect(getTaskSizeInfo('???').value).toBe('m');
  });

  it('falls back to "m" for undefined', () => {
    expect(getTaskSizeInfo(undefined).value).toBe('m');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// SIZE_POINTS
// ─────────────────────────────────────────────────────────────────────────────
describe('SIZE_POINTS', () => {
  it('has an entry for every task size', () => {
    TASK_SIZES.forEach((size) => {
      expect(SIZE_POINTS[size.value]).toBeDefined();
    });
  });

  it('uses Fibonacci-style story points', () => {
    expect(SIZE_POINTS).toMatchObject({ xs: 1, s: 2, m: 3, l: 5, xl: 8, xxl: 13 });
  });

  it('points are strictly increasing with task size', () => {
    const ordered = ['xs', 's', 'm', 'l', 'xl', 'xxl'].map((k) => SIZE_POINTS[k]);
    for (let i = 1; i < ordered.length; i++) {
      expect(ordered[i]).toBeGreaterThan(ordered[i - 1]);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY_LEVELS
// ─────────────────────────────────────────────────────────────────────────────
describe('PRIORITY_LEVELS', () => {
  it('contains exactly 3 priorities', () => {
    expect(PRIORITY_LEVELS).toHaveLength(3);
  });

  it('every entry has value, label, color and icon', () => {
    PRIORITY_LEVELS.forEach((p) => {
      expect(p.value).toBeTruthy();
      expect(p.label).toBeTruthy();
      expect(p.color).toBeTruthy();
      expect(p.icon).toBeTruthy();
    });
  });

  it('includes high, medium, and low', () => {
    const values = PRIORITY_LEVELS.map((p) => p.value);
    ['high', 'medium', 'low'].forEach((v) => expect(values).toContain(v));
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PRIORITY_MULTIPLIERS
// ─────────────────────────────────────────────────────────────────────────────
describe('PRIORITY_MULTIPLIERS', () => {
  it('high > medium > low', () => {
    expect(PRIORITY_MULTIPLIERS.high).toBeGreaterThan(PRIORITY_MULTIPLIERS.medium);
    expect(PRIORITY_MULTIPLIERS.medium).toBeGreaterThan(PRIORITY_MULTIPLIERS.low);
  });

  it('medium multiplier is exactly 1.0', () => {
    expect(PRIORITY_MULTIPLIERS.medium).toBe(1.0);
  });

  it('all multipliers are positive', () => {
    Object.values(PRIORITY_MULTIPLIERS).forEach((m) =>
      expect(m).toBeGreaterThan(0),
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// QUALITY_RATINGS
// ─────────────────────────────────────────────────────────────────────────────
describe('QUALITY_RATINGS', () => {
  it('contains exactly 5 ratings', () => {
    expect(QUALITY_RATINGS).toHaveLength(5);
  });

  it('includes "unrated" with score 0', () => {
    const unrated = QUALITY_RATINGS.find((r) => r.value === 'unrated');
    expect(unrated).toBeDefined();
    expect(unrated.score).toBe(0);
  });

  it('"excellent" has the highest score', () => {
    const maxScore = Math.max(...QUALITY_RATINGS.map((r) => r.score));
    const excellent = QUALITY_RATINGS.find((r) => r.value === 'excellent');
    expect(excellent.score).toBe(maxScore);
  });

  it('all scores are unique', () => {
    const scores = QUALITY_RATINGS.map((r) => r.score);
    expect(new Set(scores).size).toBe(scores.length);
  });

  it('every rating has a non-empty value and label', () => {
    QUALITY_RATINGS.forEach((r) => {
      expect(r.value).toBeTruthy();
      expect(r.label).toBeTruthy();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RECURRENCE_PATTERNS
// ─────────────────────────────────────────────────────────────────────────────
describe('RECURRENCE_PATTERNS', () => {
  it('contains exactly 7 patterns', () => {
    expect(RECURRENCE_PATTERNS).toHaveLength(7);
  });

  it('first pattern is "none"', () => {
    expect(RECURRENCE_PATTERNS[0].value).toBe('none');
  });

  it('includes daily, weekdays, custom, weekly, biweekly and monthly', () => {
    const values = RECURRENCE_PATTERNS.map((p) => p.value);
    ['daily', 'weekdays', 'custom', 'weekly', 'biweekly', 'monthly'].forEach((v) =>
      expect(values).toContain(v),
    );
  });

  it('every pattern has a non-empty value and label', () => {
    RECURRENCE_PATTERNS.forEach((p) => {
      expect(p.value).toBeTruthy();
      expect(p.label).toBeTruthy();
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DAYS_OF_WEEK
// ─────────────────────────────────────────────────────────────────────────────
describe('DAYS_OF_WEEK', () => {
  it('contains exactly 7 days', () => {
    expect(DAYS_OF_WEEK).toHaveLength(7);
  });

  it('weekday values (0-6) are all present', () => {
    const values = DAYS_OF_WEEK.map((d) => d.value);
    [0, 1, 2, 3, 4, 5, 6].forEach((v) => expect(values).toContain(v));
  });

  it('every day has a label and full name', () => {
    DAYS_OF_WEEK.forEach((d) => {
      expect(d.label).toBeTruthy();
      expect(d.full).toBeTruthy();
    });
  });

  it('Sunday has value 0 (matching JS Date.getDay())', () => {
    const sunday = DAYS_OF_WEEK.find((d) => d.full === 'Sunday');
    expect(sunday?.value).toBe(0);
  });

  it('Mon–Fri are values 1–5 (weekdays)', () => {
    const weekdays = DAYS_OF_WEEK.filter((d) => d.value >= 1 && d.value <= 5);
    expect(weekdays).toHaveLength(5);
    weekdays.forEach((d) =>
      expect(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']).toContain(d.full),
    );
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MEETING_TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────
describe('MEETING_TEMPLATES', () => {
  it('contains exactly 10 templates', () => {
    expect(MEETING_TEMPLATES).toHaveLength(10);
  });

  it('every template has label, duration, time, durationMinutes and type', () => {
    MEETING_TEMPLATES.forEach((t) => {
      expect(t.label).toBeTruthy();
      expect(t.duration).toBeGreaterThan(0);
      expect(t.time).toMatch(/^\d{2}:\d{2}$/);
      expect(t.durationMinutes).toBeGreaterThan(0);
      expect(['standup', 'meeting']).toContain(t.type);
    });
  });

  it('durationMinutes matches duration * 60 for all templates', () => {
    MEETING_TEMPLATES.forEach((t) => {
      expect(t.durationMinutes).toBeCloseTo(t.duration * 60, 1);
    });
  });

  it('all standup templates have autoComplete: true', () => {
    MEETING_TEMPLATES
      .filter((t) => t.type === 'standup')
      .forEach((t) => expect(t.autoComplete).toBe(true));
  });

  it('type is always recognized by isMeetingType()', () => {
    MEETING_TEMPLATES.forEach((t) =>
      expect(isMeetingType(t.type)).toBe(true),
    );
  });

  it('contains at least one standup and one meeting template', () => {
    expect(MEETING_TEMPLATES.some((t) => t.type === 'standup')).toBe(true);
    expect(MEETING_TEMPLATES.some((t) => t.type === 'meeting')).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT_ORGANIZATIONS
// ─────────────────────────────────────────────────────────────────────────────
describe('DEFAULT_ORGANIZATIONS', () => {
  it('contains at least 5 organisations', () => {
    expect(DEFAULT_ORGANIZATIONS.length).toBeGreaterThanOrEqual(5);
  });

  it('every organisation has value, label, icon, color and type', () => {
    DEFAULT_ORGANIZATIONS.forEach((org) => {
      expect(org.value).toBeTruthy();
      expect(org.label).toBeTruthy();
      expect(org.icon).toBeTruthy();
      expect(org.color).toBeTruthy();
      expect(['work', 'personal']).toContain(org.type);
    });
  });

  it('all values are unique', () => {
    const values = DEFAULT_ORGANIZATIONS.map((o) => o.value);
    expect(new Set(values).size).toBe(values.length);
  });

  it('includes at least one "work" and one "personal" organisation', () => {
    expect(DEFAULT_ORGANIZATIONS.some((o) => o.type === 'work')).toBe(true);
    expect(DEFAULT_ORGANIZATIONS.some((o) => o.type === 'personal')).toBe(true);
  });
});
