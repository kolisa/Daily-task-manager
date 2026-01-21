import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, TrendingUp, Play, Pause, Square, Clock, Bell, AlertCircle, Code, Bug, Wrench, Briefcase, Coffee, BookOpen, Target, Award, TrendingDown, Zap, Users, Edit2, Save, X, FileText } from 'lucide-react';

const TASK_TYPES = [
  { value: 'feature', label: 'Feature', icon: Code, color: 'blue' },
  { value: 'bug', label: 'Bug Fix', icon: Bug, color: 'red' },
  { value: 'support', label: 'Support', icon: Wrench, color: 'green' },
  { value: 'learning', label: 'Learning', icon: BookOpen, color: 'purple' },
  { value: 'standup', label: 'Standup', icon: Users, color: 'amber', group: 'meetings' },
  { value: 'meeting', label: 'Meeting', icon: Users, color: 'orange', group: 'meetings' },
  { value: 'analysis', label: 'Analysis', icon: Target, color: 'indigo' },
  { value: 'documentation', label: 'Documentation', icon: FileText, color: 'teal' }
];

// Helper to check if task type is a meeting/standup
const isMeetingType = (type) => ['standup', 'meeting'].includes(type);

const TASK_SIZES = [
  { value: 'xs', label: 'XS (< 1h)', hours: 0.5 },
  { value: 's', label: 'S (1-2h)', hours: 1.5 },
  { value: 'm', label: 'M (2-4h)', hours: 3 },
  { value: 'l', label: 'L (4-8h)', hours: 6 },
  { value: 'xl', label: 'XL (1-2 days)', hours: 12 },
  { value: 'xxl', label: 'XXL (2+ days)', hours: 16 }
];

const QUALITY_RATINGS = [
  { value: 'excellent', label: 'Excellent - First try, no rework', score: 5 },
  { value: 'good', label: 'Good - Minor revisions', score: 4 },
  { value: 'average', label: 'Average - Some rework needed', score: 3 },
  { value: 'poor', label: 'Poor - Significant rework', score: 2 },
  { value: 'unrated', label: 'Not yet rated', score: 0 }
];

// Complexity points for task sizes (story points style)
const SIZE_POINTS = {
  xs: 1,
  s: 2,
  m: 3,
  l: 5,
  xl: 8,
  xxl: 13
};

// Priority multipliers
const PRIORITY_MULTIPLIERS = {
  high: 1.5,
  medium: 1.0,
  low: 0.75
};

// Break types for logging time away
const BREAK_TYPES = [
  { value: 'lunch', label: '🍽️ Lunch', duration: 60, color: 'orange' },
  { value: 'coffee', label: '☕ Coffee Break', duration: 15, color: 'amber' },
  { value: 'bio', label: '🚻 Bio Break', duration: 5, color: 'blue' },
  { value: 'walk', label: '🚶 Short Walk', duration: 15, color: 'green' },
  { value: 'errand', label: '🏃 Quick Errand', duration: 30, color: 'purple' },
  { value: 'personal', label: '📱 Personal Call', duration: 10, color: 'pink' },
  { value: 'other', label: '⏸️ Other', duration: 15, color: 'gray' }
];

const DEFAULT_ORGANIZATIONS = [
  { value: 'webafrica', label: 'Web Africa', icon: Briefcase, color: 'blue', type: 'work' },
  { value: 'lexisnexis', label: 'LexisNexis', icon: Briefcase, color: 'indigo', type: 'work' },
  { value: 'tut', label: 'TUT (Tshwane University of Technology)', icon: Briefcase, color: 'cyan', type: 'work' },
  { value: 'bhukuveni', label: 'Bhukuveni', icon: Coffee, color: 'purple', type: 'personal' },
  { value: 'khoi', label: 'Khoi', icon: Coffee, color: 'pink', type: 'personal' },
  { value: 'nowmail', label: 'Nowmail', icon: Coffee, color: 'emerald', type: 'personal' }
];

const MEETING_TEMPLATES = [
  { label: 'Quick Standup (15 min)', duration: 0.25, time: '09:00', autoComplete: true, durationMinutes: 15, type: 'standup' },
  { label: 'Standard Standup (30 min)', duration: 0.5, time: '09:30', autoComplete: true, durationMinutes: 30, type: 'standup' },
  { label: 'Team Sync (15 min)', duration: 0.25, time: '14:00', autoComplete: true, durationMinutes: 15, type: 'standup' },
  { label: 'Team Sync (30 min)', duration: 0.5, time: '14:30', autoComplete: true, durationMinutes: 30, type: 'standup' },
  { label: 'Sprint Planning', duration: 2, time: '10:00', autoComplete: false, durationMinutes: 120, type: 'meeting' },
  { label: 'Sprint Review', duration: 1, time: '15:00', autoComplete: false, durationMinutes: 60, type: 'meeting' },
  { label: 'Sprint Retrospective', duration: 1, time: '16:00', autoComplete: false, durationMinutes: 60, type: 'meeting' },
  { label: 'Points Confirmation', duration: 1, time: '11:00', autoComplete: false, durationMinutes: 60, type: 'meeting' },
  { label: 'Tech Review', duration: 1, time: '13:00', autoComplete: false, durationMinutes: 60, type: 'meeting' },
  { label: '1-on-1 (30 min)', duration: 0.5, time: '16:30', autoComplete: true, durationMinutes: 30, type: 'meeting' }
];

const PRIORITY_LEVELS = [
  { value: 'high', label: 'High Priority', color: 'red', icon: '🔴' },
  { value: 'medium', label: 'Medium Priority', color: 'yellow', icon: '🟡' },
  { value: 'low', label: 'Low Priority', color: 'green', icon: '🟢' }
];

const DEFAULT_TAGS = [
  { value: 'urgent', label: 'Urgent', color: 'red' },
  { value: 'blocked', label: 'Blocked', color: 'orange' },
  { value: 'review-needed', label: 'Review Needed', color: 'blue' },
  { value: 'client-facing', label: 'Client Facing', color: 'purple' },
  { value: 'technical-debt', label: 'Technical Debt', color: 'gray' },
  { value: 'documentation', label: 'Documentation', color: 'green' }
];

const RECURRENCE_PATTERNS = [
  { value: 'none', label: 'No Recurrence' },
  { value: 'daily', label: 'Daily (Every day)' },
  { value: 'weekdays', label: 'Weekdays (Mon-Fri)' },
  { value: 'custom', label: 'Custom Days (Select specific days)' },
  { value: 'weekly', label: 'Weekly (Same day each week)' },
  { value: 'biweekly', label: 'Bi-weekly (Every 2 weeks)' },
  { value: 'monthly', label: 'Monthly (Same day each month)' }
];

const DAYS_OF_WEEK = [
  { value: 1, label: 'Mon', full: 'Monday' },
  { value: 2, label: 'Tue', full: 'Tuesday' },
  { value: 3, label: 'Wed', full: 'Wednesday' },
  { value: 4, label: 'Thu', full: 'Thursday' },
  { value: 5, label: 'Fri', full: 'Friday' },
  { value: 6, label: 'Sat', full: 'Saturday' },
  { value: 0, label: 'Sun', full: 'Sunday' }
];

const KEYBOARD_SHORTCUTS = [
  { key: 'n', description: 'New task', action: 'new_task' },
  { key: '/', description: 'Search tasks', action: 'search' },
  { key: 't', description: 'Toggle Today view', action: 'today_view' },
  { key: 'p', description: 'Toggle Pomodoro timer', action: 'pomodoro' },
  { key: 'd', description: 'Toggle dark mode', action: 'dark_mode' },
  { key: 'a', description: 'Show analytics', action: 'analytics' },
  { key: 'w', description: 'Work summary', action: 'work_summary' },
  { key: '?', description: 'Show shortcuts', action: 'help' },
  { key: 'Escape', description: 'Close modal/Cancel', action: 'escape' }
];

const POMODORO_SETTINGS = {
  focus: 25, // 25 minutes focus
  shortBreak: 5, // 5 minutes short break
  longBreak: 15, // 15 minutes long break
  sessionsBeforeLongBreak: 4
};

export default function DailyTaskManager() {
  const [tasks, setTasks] = useState([]);
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [organizations, setOrganizations] = useState(DEFAULT_ORGANIZATIONS);
  const [availableTags, setAvailableTags] = useState(DEFAULT_TAGS);
  const [newTask, setNewTask] = useState('');
  const [newTaskType, setNewTaskType] = useState('feature');
  const [newTaskSize, setNewTaskSize] = useState('m');
  const [newTaskOrg, setNewTaskOrg] = useState('webafrica');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskTags, setNewTaskTags] = useState([]);
  const [newTaskRecurrence, setNewTaskRecurrence] = useState('none');
  const [newTaskCustomDays, setNewTaskCustomDays] = useState([1, 2, 3, 4, 5]); // Default: weekdays
  const [newTaskAutoComplete, setNewTaskAutoComplete] = useState(false);
  const [newTaskDuration, setNewTaskDuration] = useState(30); // Default 30 minutes
  const [filter, setFilter] = useState('all');
  const [orgFilter, setOrgFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [morningReminderTime, setMorningReminderTime] = useState('09:00');
  const [showProductivity, setShowProductivity] = useState(false);
  const [selectedTaskForRating, setSelectedTaskForRating] = useState(null);
  const [showStorageManager, setShowStorageManager] = useState(false);
  const [showChangelog, setShowChangelog] = useState(false);
  const [showOrgManager, setShowOrgManager] = useState(false);
  const [showMeetingTemplates, setShowMeetingTemplates] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [changelogFormat, setChangelogFormat] = useState('standup');
  const [changelogDateRange, setChangelogDateRange] = useState('week');
  const [storageInfo, setStorageInfo] = useState({ used: 0, limit: 5000000, percentage: 0 });
  const [editingOrg, setEditingOrg] = useState(null);
  const [newOrgData, setNewOrgData] = useState({ label: '', type: 'work', color: 'blue' });
  const [newTagData, setNewTagData] = useState({ label: '', color: 'blue' });
  const [weeklyCleanupEnabled, setWeeklyCleanupEnabled] = useState(true);
  const [lastCleanupDate, setLastCleanupDate] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showTodayView, setShowTodayView] = useState(false);
  const [showPomodoro, setShowPomodoro] = useState(false);
  const [pomodoroMode, setPomodoroMode] = useState('focus'); // focus, shortBreak, longBreak
  const [pomodoroTime, setPomodoroTime] = useState(POMODORO_SETTINGS.focus * 60);
  const [pomodoroRunning, setPomodoroRunning] = useState(false);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);
  const [activePomodoroTask, setActivePomodoroTask] = useState(null);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [editingTaskNotes, setEditingTaskNotes] = useState(null);
  const [showBreakMenu, setShowBreakMenu] = useState(false);
  const [activeBreak, setActiveBreak] = useState(null); // { type, startedAt }
  const [todayBreaks, setTodayBreaks] = useState([]); // Array of completed breaks
  const timerRef = useRef(null);
  const notificationCheckRef = useRef(null);
  const pomodoroTimerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Calculate storage usage
  const calculateStorageUsage = (currentTasks = tasks, currentArchived = archivedTasks) => {
    // Calculate size of all localStorage items used by the app
    let totalSize = 0;
    const keys = ['dailyTasks', 'archivedTasks', 'customOrganizations', 'customTags', 'darkMode', 'morningReminderTime', 'weeklyCleanupEnabled', 'lastCleanupDate'];
    
    keys.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += new Blob([item]).size;
      }
    });

    const tasksSize = new Blob([JSON.stringify(currentTasks)]).size;
    const archivedSize = new Blob([JSON.stringify(currentArchived)]).size;
    const limit = 5000000; // 5MB conservative estimate
    const percentage = (totalSize / limit) * 100;

    return {
      used: totalSize,
      limit: limit,
      percentage: percentage,
      tasksSize: tasksSize,
      archivedSize: archivedSize,
      taskCount: currentTasks.length,
      archivedCount: currentArchived.length
    };
  };

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('dailyTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const savedArchivedTasks = localStorage.getItem('archivedTasks');
    if (savedArchivedTasks) {
      setArchivedTasks(JSON.parse(savedArchivedTasks));
    }

    const savedOrganizations = localStorage.getItem('customOrganizations');
    if (savedOrganizations) {
      const parsed = JSON.parse(savedOrganizations);
      // Restore icon components (can't be serialized to localStorage)
      const withIcons = parsed.map(org => ({
        ...org,
        icon: org.type === 'work' ? Briefcase : Coffee
      }));
      setOrganizations(withIcons);
    }

    const savedTags = localStorage.getItem('customTags');
    if (savedTags) {
      setAvailableTags(JSON.parse(savedTags));
    }

    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      setDarkMode(JSON.parse(savedDarkMode));
    }

    const savedReminderTime = localStorage.getItem('morningReminderTime');
    if (savedReminderTime) {
      setMorningReminderTime(savedReminderTime);
    }

    const savedWeeklyCleanup = localStorage.getItem('weeklyCleanupEnabled');
    if (savedWeeklyCleanup !== null) {
      setWeeklyCleanupEnabled(JSON.parse(savedWeeklyCleanup));
    }

    const savedLastCleanup = localStorage.getItem('lastCleanupDate');
    if (savedLastCleanup) {
      setLastCleanupDate(savedLastCleanup);
    }

    // Load today's breaks
    const savedBreaks = localStorage.getItem('todayBreaks');
    if (savedBreaks) {
      const breaks = JSON.parse(savedBreaks);
      // Only load breaks from today
      const today = new Date().toDateString();
      const todayOnlyBreaks = breaks.filter(b => new Date(b.startedAt).toDateString() === today);
      setTodayBreaks(todayOnlyBreaks);
    }

    // Load active break if any
    const savedActiveBreak = localStorage.getItem('activeBreak');
    if (savedActiveBreak) {
      setActiveBreak(JSON.parse(savedActiveBreak));
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    // Auto-archive old completed tasks on load
    autoArchiveOldTasks();

    // Check for weekly cleanup
    checkWeeklyCleanup();
    
    // Check for recurring tasks
    checkRecurringTasks();

    // Calculate initial storage usage
    setTimeout(() => {
      setStorageInfo(calculateStorageUsage());
    }, 100);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Save tags to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customTags', JSON.stringify(availableTags));
  }, [availableTags]);

  // Save weekly cleanup setting
  useEffect(() => {
    localStorage.setItem('weeklyCleanupEnabled', JSON.stringify(weeklyCleanupEnabled));
  }, [weeklyCleanupEnabled]);

  // Save last cleanup date
  useEffect(() => {
    if (lastCleanupDate) {
      localStorage.setItem('lastCleanupDate', lastCleanupDate);
    }
  }, [lastCleanupDate]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
        if (e.key === 'Escape') {
          e.target.blur(); // Close input on Escape
        }
        return;
      }

      switch(e.key) {
        case 'n':
          e.preventDefault();
          document.querySelector('input[placeholder*="accomplish"]')?.focus();
          break;
        case '/':
          e.preventDefault();
          setSearchQuery('');
          setTimeout(() => searchInputRef.current?.focus(), 100);
          break;
        case 't':
          e.preventDefault();
          setShowTodayView(!showTodayView);
          break;
        case 'p':
          e.preventDefault();
          setShowPomodoro(!showPomodoro);
          break;
        case 'd':
          e.preventDefault();
          setDarkMode(!darkMode);
          break;
        case 'a':
          e.preventDefault();
          setShowProductivity(true);
          break;
        case 'w':
          e.preventDefault();
          setShowChangelog(true);
          break;
        case '?':
          e.preventDefault();
          setShowKeyboardShortcuts(true);
          break;
        case 'Escape':
          e.preventDefault();
          // Close any open modals
          setShowKeyboardShortcuts(false);
          setShowPomodoro(false);
          setShowChangelog(false);
          setShowStorageManager(false);
          setShowOrgManager(false);
          setShowTagManager(false);
          setShowMeetingTemplates(false);
          setEditingTaskNotes(null);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showTodayView, showPomodoro, darkMode]);

  // Save organizations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('customOrganizations', JSON.stringify(organizations));
    // Recalculate storage after save
    setTimeout(() => setStorageInfo(calculateStorageUsage()), 50);
  }, [organizations]);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
    // Recalculate storage after save
    setTimeout(() => setStorageInfo(calculateStorageUsage(tasks, archivedTasks)), 50);
  }, [tasks]);

  // Save archived tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
    // Recalculate storage after save
    setTimeout(() => setStorageInfo(calculateStorageUsage(tasks, archivedTasks)), 50);
  }, [archivedTasks]);

  // Save reminder time
  useEffect(() => {
    localStorage.setItem('morningReminderTime', morningReminderTime);
  }, [morningReminderTime]);

  // Update current time every second for active timers
  // This keeps running even when tab is inactive - timer accuracy maintained via timestamps
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Force timer update when tab becomes visible again
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab is now visible - force immediate update
        setCurrentTime(Date.now());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Check for reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      if (!notificationsEnabled) return;

      const now = new Date();
      
      // Check for morning reminder
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const lastReminderDate = localStorage.getItem('lastMorningReminder');
      const todayDate = now.toDateString();

      if (currentTime === morningReminderTime && lastReminderDate !== todayDate) {
        showNotification(
          '🌅 Good Morning!',
          'Time to plan your day! Add your tasks for today.',
          'morning'
        );
        localStorage.setItem('lastMorningReminder', todayDate);
      }

      // Check for stale tasks (open for 2+ days)
      tasks.forEach(task => {
        if (!task.completed) {
          const taskAge = now - new Date(task.createdAt);
          const daysSinceCreated = taskAge / (1000 * 60 * 60 * 24);
          
          if (daysSinceCreated >= 2) {
            const lastStaleReminder = localStorage.getItem(`staleReminder_${task.id}`);
            const hoursSinceLastReminder = lastStaleReminder 
              ? (now - new Date(lastStaleReminder)) / (1000 * 60 * 60)
              : Infinity;

            // Remind once per day about stale tasks
            if (hoursSinceLastReminder >= 24 || !lastStaleReminder) {
              showNotification(
                '⚠️ Stale Task Alert',
                `"${task.text}" has been open for ${Math.floor(daysSinceCreated)} days. Time to close it or break it down?`,
                'stale',
                task.id
              );
              localStorage.setItem(`staleReminder_${task.id}`, now.toISOString());
            }
          }
        }
      });

      // Auto-start scheduled meetings when their time arrives
      tasks.forEach(task => {
        // Only for incomplete tasks with scheduled time
        if (!task.completed && task.scheduledTime && !task.isTimerRunning) {
          const [schedHours, schedMins] = task.scheduledTime.split(':').map(Number);
          const currentHours = now.getHours();
          const currentMins = now.getMinutes();
          
          // Check if we're at or past the scheduled time (within same minute)
          const isScheduledTime = currentHours === schedHours && currentMins === schedMins;
          
          // Check if we haven't already auto-started this task today
          const lastAutoStart = localStorage.getItem(`autoStart_${task.id}`);
          const todayDate = now.toDateString();
          const alreadyStartedToday = lastAutoStart === todayDate;
          
          if (isScheduledTime && !alreadyStartedToday) {
            // Auto-start the timer!
            setTasks(prevTasks => prevTasks.map(t => 
              t.id === task.id 
                ? { ...t, isTimerRunning: true, timerStartedAt: new Date().toISOString() }
                : t
            ));
            
            // Mark as auto-started today
            localStorage.setItem(`autoStart_${task.id}`, todayDate);
            
            // Show notification
            const taskTypeInfo = getTaskTypeInfo(task.type);
            showNotification(
              `⏱️ ${taskTypeInfo.label} Started`,
              `"${task.text}" timer started automatically at ${task.scheduledTime}`,
              'meeting',
              task.id
            );
          }
        }
      });

      // Auto-complete tasks that have been running for their specified duration
      tasks.forEach(task => {
        if (task.isTimerRunning && task.autoComplete && task.durationMinutes && task.timerStartedAt) {
          const startedAt = new Date(task.timerStartedAt);
          const elapsedMinutes = (now - startedAt) / (1000 * 60);
          
          // Check if we haven't already auto-completed this task today
          const lastAutoComplete = localStorage.getItem(`autoComplete_${task.id}`);
          const todayDate = now.toDateString();
          const alreadyCompletedToday = lastAutoComplete === todayDate;
          
          if (elapsedMinutes >= task.durationMinutes && !alreadyCompletedToday && !task.completed) {
            // Calculate actual time spent
            const actualTimeSpent = task.durationMinutes * 60; // Convert to seconds
            
            // Auto-complete the task!
            setTasks(prevTasks => prevTasks.map(t => 
              t.id === task.id 
                ? { 
                    ...t, 
                    isTimerRunning: false, 
                    completed: true,
                    completedAt: new Date().toISOString(),
                    timeSpent: (t.timeSpent || 0) + actualTimeSpent,
                    sessions: [...(t.sessions || []), {
                      startedAt: t.timerStartedAt,
                      endedAt: new Date().toISOString(),
                      duration: actualTimeSpent
                    }]
                  }
                : t
            ));
            
            // Mark as auto-completed today
            localStorage.setItem(`autoComplete_${task.id}`, todayDate);
            
            // Show notification
            const taskTypeInfo = getTaskTypeInfo(task.type);
            showNotification(
              `✅ ${taskTypeInfo.label} Completed`,
              `"${task.text}" was automatically completed after ${task.durationMinutes} minutes`,
              'completed',
              task.id
            );
          }
        }
      });
    };

    notificationCheckRef.current = setInterval(checkReminders, 60000); // Check every minute
    checkReminders(); // Check immediately on mount

    return () => {
      if (notificationCheckRef.current) {
        clearInterval(notificationCheckRef.current);
      }
    };
  }, [notificationsEnabled, morningReminderTime, tasks]);

  const showNotification = (title, body, type, taskId = null) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: type + (taskId || ''),
        requireInteraction: type === 'stale'
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      
      if (permission === 'granted') {
        showNotification(
          '✅ Notifications Enabled!',
          'You\'ll receive morning reminders and alerts for stale tasks.',
          'setup'
        );
      }
    }
  };

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      const sizeData = TASK_SIZES.find(s => s.value === newTaskSize);
      const task = {
        id: Date.now(),
        text: newTask.trim(),
        type: newTaskType,
        size: newTaskSize,
        organization: newTaskOrg,
        priority: newTaskPriority,
        tags: [...newTaskTags],
        notes: '',
        estimatedHours: sizeData.hours,
        scheduledTime: newTaskTime || null,
        recurrence: newTaskRecurrence,
        customDays: newTaskRecurrence === 'custom' ? [...newTaskCustomDays] : null,
        lastRecurrence: newTaskRecurrence !== 'none' ? new Date().toISOString() : null,
        completed: false,
        qualityRating: 'unrated',
        createdAt: new Date().toISOString(),
        completedAt: null,
        timeSpent: 0,
        isTimerRunning: false,
        timerStartedAt: null,
        sessions: [],
        autoComplete: newTaskAutoComplete,
        durationMinutes: newTaskAutoComplete ? newTaskDuration : null
      };
      setTasks([task, ...tasks]);
      setNewTask('');
      setNewTaskSize('m');
      setNewTaskTime('');
      setNewTaskPriority('medium');
      setNewTaskTags([]);
      setNewTaskRecurrence('none');
      setNewTaskCustomDays([1, 2, 3, 4, 5]);
      setNewTaskAutoComplete(false);
      setNewTaskDuration(30);
    }
  };

  const addMeetingFromTemplate = (template) => {
    const task = {
      id: Date.now(),
      text: template.label,
      type: template.type || 'meeting',
      size: 'xs',
      organization: newTaskOrg,
      priority: 'medium',
      tags: [],
      notes: '',
      estimatedHours: template.duration,
      scheduledTime: template.time,
      recurrence: 'none',
      customDays: null,
      lastRecurrence: null,
      completed: false,
      qualityRating: 'unrated',
      createdAt: new Date().toISOString(),
      completedAt: null,
      timeSpent: 0,
      isTimerRunning: false,
      timerStartedAt: null,
      sessions: [],
      autoComplete: template.autoComplete || false,
      durationMinutes: template.durationMinutes || 30
    };
    setTasks([task, ...tasks]);
    setShowMeetingTemplates(false);
  };

  // Recurring Tasks Functions
  const checkRecurringTasks = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    tasks.forEach(task => {
      if (task.recurrence === 'none' || !task.lastRecurrence) return;

      const lastRecur = new Date(task.lastRecurrence);
      const daysSince = Math.floor((now - lastRecur) / (1000 * 60 * 60 * 24));

      let shouldRecur = false;

      switch(task.recurrence) {
        case 'daily':
          shouldRecur = daysSince >= 1;
          break;
        case 'weekdays':
          const dayOfWeek = now.getDay();
          shouldRecur = daysSince >= 1 && dayOfWeek >= 1 && dayOfWeek <= 5; // Mon-Fri
          break;
        case 'custom':
          const currentDay = now.getDay();
          shouldRecur = daysSince >= 1 && task.customDays && task.customDays.includes(currentDay);
          break;
        case 'weekly':
          shouldRecur = daysSince >= 7;
          break;
        case 'biweekly':
          shouldRecur = daysSince >= 14;
          break;
        case 'monthly':
          shouldRecur = daysSince >= 30;
          break;
      }

      if (shouldRecur) {
        createRecurringTask(task);
      }
    });
  };

  const createRecurringTask = (originalTask) => {
    const newTask = {
      ...originalTask,
      id: Date.now() + Math.random(), // Ensure unique ID
      completed: false,
      qualityRating: 'unrated',
      createdAt: new Date().toISOString(),
      completedAt: null,
      timeSpent: 0,
      isTimerRunning: false,
      timerStartedAt: null,
      sessions: [],
      lastRecurrence: new Date().toISOString()
    };

    setTasks(prevTasks => {
      // Update original task's lastRecurrence
      const updated = prevTasks.map(t => 
        t.id === originalTask.id 
          ? { ...t, lastRecurrence: new Date().toISOString() }
          : t
      );
      // Add new recurring instance
      return [newTask, ...updated];
    });
  };

  // Tag Management Functions
  const addTag = () => {
    if (newTagData.label.trim()) {
      const newTag = {
        value: newTagData.label.toLowerCase().replace(/\s+/g, '-'),
        label: newTagData.label.trim(),
        color: newTagData.color
      };
      setAvailableTags([...availableTags, newTag]);
      setNewTagData({ label: '', color: 'blue' });
    }
  };

  const deleteTag = (value) => {
    if (confirm(`Delete tag "${availableTags.find(t => t.value === value)?.label}"?`)) {
      setAvailableTags(availableTags.filter(tag => tag.value !== value));
      // Remove tag from all tasks
      setTasks(tasks.map(task => ({
        ...task,
        tags: task.tags.filter(t => t !== value)
      })));
    }
  };

  const toggleTaskTag = (tag) => {
    if (newTaskTags.includes(tag)) {
      setNewTaskTags(newTaskTags.filter(t => t !== tag));
    } else {
      setNewTaskTags([...newTaskTags, tag]);
    }
  };

  // Organization Management Functions
  const addOrganization = () => {
    if (newOrgData.label.trim()) {
      const newOrg = {
        value: newOrgData.label.toLowerCase().replace(/\s+/g, ''),
        label: newOrgData.label.trim(),
        icon: newOrgData.type === 'work' ? Briefcase : Coffee,
        color: newOrgData.color,
        type: newOrgData.type
      };
      setOrganizations([...organizations, newOrg]);
      setNewOrgData({ label: '', type: 'work', color: 'blue' });
    }
  };

  const updateOrganization = (oldValue, updates) => {
    setOrganizations(organizations.map(org =>
      org.value === oldValue ? { ...org, ...updates } : org
    ));
    setEditingOrg(null);
  };

  const deleteOrganization = (value) => {
    if (confirm(`Delete organization "${organizations.find(o => o.value === value)?.label}"? Tasks will remain but show as unassigned.`)) {
      setOrganizations(organizations.filter(org => org.value !== value));
    }
  };

  const resetOrganizations = () => {
    if (confirm('Reset to default organizations? Your custom organizations will be removed.')) {
      setOrganizations(DEFAULT_ORGANIZATIONS);
    }
  };

  const rateTaskQuality = (taskId, rating) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, qualityRating: rating } : task
    ));
    setSelectedTaskForRating(null);
  };

  // Storage Management Functions
  const autoArchiveOldTasks = () => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
    
    const tasksToArchive = tasks.filter(task => {
      if (!task.completed) return false;
      const completedDate = new Date(task.completedAt || task.createdAt);
      return completedDate < sevenDaysAgo;
    });

    if (tasksToArchive.length > 0) {
      setArchivedTasks([...archivedTasks, ...tasksToArchive]);
      setTasks(tasks.filter(task => !tasksToArchive.find(t => t.id === task.id)));
    }
  };

  const manualArchiveCompleted = () => {
    const completedTasks = tasks.filter(t => t.completed);
    if (completedTasks.length > 0) {
      setArchivedTasks([...archivedTasks, ...completedTasks]);
      setTasks(tasks.filter(t => !t.completed));
    }
  };

  const exportData = () => {
    const data = {
      tasks: tasks,
      archivedTasks: archivedTasks,
      exportDate: new Date().toISOString(),
      version: '2.0'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.tasks) setTasks(data.tasks);
          if (data.archivedTasks) setArchivedTasks(data.archivedTasks);
          alert('Data imported successfully!');
        } catch (error) {
          alert('Error importing data. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const clearArchivedTasks = () => {
    if (confirm(`This will permanently delete ${archivedTasks.length} archived tasks. Continue?`)) {
      setArchivedTasks([]);
      localStorage.removeItem('archivedTasks');
    }
  };

  const clearOldArchivedTasks = (daysOld) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const filtered = archivedTasks.filter(task => {
      const taskDate = new Date(task.completedAt || task.createdAt);
      return taskDate >= cutoffDate;
    });
    
    const removed = archivedTasks.length - filtered.length;
    if (removed > 0) {
      setArchivedTasks(filtered);
      alert(`Removed ${removed} tasks older than ${daysOld} days from archive.`);
    } else {
      alert('No tasks older than the specified period found.');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Changelog/Summary Generation Functions
  const getTasksForChangelog = (dateRange) => {
    const now = new Date();
    let startDate;

    switch(dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'yesterday':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return tasks.filter(t => {
          if (!t.completed || !t.completedAt) return false;
          const completedDate = new Date(t.completedAt);
          return completedDate >= startDate && completedDate < endDate;
        });
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - now.getDay()); // Sunday
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'last-week':
        const lastSunday = new Date(now);
        lastSunday.setDate(now.getDate() - now.getDay() - 7);
        lastSunday.setHours(0, 0, 0, 0);
        const thisSunday = new Date(now);
        thisSunday.setDate(now.getDate() - now.getDay());
        thisSunday.setHours(0, 0, 0, 0);
        return tasks.filter(t => {
          if (!t.completed || !t.completedAt) return false;
          const completedDate = new Date(t.completedAt);
          return completedDate >= lastSunday && completedDate < thisSunday;
        });
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }

    return tasks.filter(t => {
      if (!t.completed || !t.completedAt) return false;
      const completedDate = new Date(t.completedAt);
      return completedDate >= startDate;
    });
  };

  const generateChangelog = (format, dateRange) => {
    const changelogTasks = getTasksForChangelog(dateRange);
    const dateRangeLabel = {
      'today': 'Today',
      'yesterday': 'Yesterday',
      'week': 'This Week',
      'last-week': 'Last Week',
      'month': 'This Month'
    }[dateRange] || 'This Week';

    // Group by organization
    const tasksByOrg = {};
    changelogTasks.forEach(task => {
      const org = task.organization || 'unassigned';
      if (!tasksByOrg[org]) tasksByOrg[org] = [];
      tasksByOrg[org].push(task);
    });

    const totalTime = changelogTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);

    switch(format) {
      case 'standup':
        return generateStandupFormat(tasksByOrg, dateRangeLabel, totalTime);
      case 'markdown':
        return generateMarkdownFormat(tasksByOrg, dateRangeLabel, totalTime);
      case 'jira':
        return generateJiraFormat(tasksByOrg, dateRangeLabel, totalTime);
      case 'email':
        return generateEmailFormat(tasksByOrg, dateRangeLabel, totalTime);
      case 'detailed':
        return generateDetailedFormat(tasksByOrg, dateRangeLabel, totalTime);
      default:
        return generateStandupFormat(tasksByOrg, dateRangeLabel, totalTime);
    }
  };

  const generateStandupFormat = (tasksByOrg, dateRange, totalTime) => {
    let output = `📊 Daily Standup - ${dateRange}\n`;
    output += `⏱️ Total Time: ${formatTime(totalTime)}\n\n`;

    Object.keys(tasksByOrg).forEach(orgKey => {
      const orgInfo = getOrgInfo(orgKey);
      const orgTasks = tasksByOrg[orgKey];
      
      output += `${orgInfo.label}:\n`;
      orgTasks.forEach(task => {
        const typeIcon = {
          'feature': '✨',
          'bug': '🐛',
          'support': '🔧',
          'learning': '📚'
        }[task.type] || '•';
        
        output += `  ${typeIcon} ${task.text} (${formatTime(getElapsedTime(task))})\n`;
      });
      output += '\n';
    });

    return output.trim();
  };

  const generateMarkdownFormat = (tasksByOrg, dateRange, totalTime) => {
    let output = `# Work Summary - ${dateRange}\n\n`;
    output += `**Total Time:** ${formatTime(totalTime)}\n\n`;

    Object.keys(tasksByOrg).forEach(orgKey => {
      const orgInfo = getOrgInfo(orgKey);
      const orgTasks = tasksByOrg[orgKey];
      const orgTime = orgTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);
      
      output += `## ${orgInfo.label} (${formatTime(orgTime)})\n\n`;
      
      orgTasks.forEach(task => {
        const typeLabel = TASK_TYPES.find(t => t.value === task.type)?.label || 'Task';
        output += `- **${task.text}**\n`;
        output += `  - Type: ${typeLabel}\n`;
        output += `  - Time: ${formatTime(getElapsedTime(task))}\n`;
        if (task.qualityRating && task.qualityRating !== 'unrated') {
          const rating = QUALITY_RATINGS.find(r => r.value === task.qualityRating);
          output += `  - Quality: ${rating?.label.split(' -')[0] || 'N/A'}\n`;
        }
        output += '\n';
      });
    });

    return output.trim();
  };

  const generateJiraFormat = (tasksByOrg, dateRange, totalTime) => {
    let output = `h2. Work Log - ${dateRange}\n\n`;
    output += `*Total Time:* ${formatTime(totalTime)}\n\n`;

    Object.keys(tasksByOrg).forEach(orgKey => {
      const orgInfo = getOrgInfo(orgKey);
      const orgTasks = tasksByOrg[orgKey];
      
      output += `h3. ${orgInfo.label}\n\n`;
      
      orgTasks.forEach(task => {
        const typeIcon = {
          'feature': '(+)',
          'bug': '(x)',
          'support': '(!)',
          'learning': '(i)'
        }[task.type] || '*';
        
        output += `* ${typeIcon} ${task.text} - ${formatTime(getElapsedTime(task))}\n`;
      });
      output += '\n';
    });

    return output.trim();
  };

  const generateEmailFormat = (tasksByOrg, dateRange, totalTime) => {
    let output = `Subject: Work Summary - ${dateRange}\n\n`;
    output += `Hi Team,\n\nHere's my work summary for ${dateRange.toLowerCase()}:\n\n`;
    output += `Total Hours: ${formatTime(totalTime)}\n\n`;

    Object.keys(tasksByOrg).forEach(orgKey => {
      const orgInfo = getOrgInfo(orgKey);
      const orgTasks = tasksByOrg[orgKey];
      const orgTime = orgTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);
      
      output += `${orgInfo.label} (${formatTime(orgTime)}):\n`;
      
      orgTasks.forEach(task => {
        output += `  • ${task.text}\n`;
      });
      output += '\n';
    });

    output += 'Best regards';

    return output.trim();
  };

  const generateDetailedFormat = (tasksByOrg, dateRange, totalTime) => {
    let output = `DETAILED WORK REPORT - ${dateRange}\n`;
    output += `${'='.repeat(60)}\n\n`;
    output += `Summary:\n`;
    output += `  Total Time: ${formatTime(totalTime)}\n`;
    
    const allTasks = Object.values(tasksByOrg).flat();
    const byType = {
      feature: allTasks.filter(t => t.type === 'feature').length,
      bug: allTasks.filter(t => t.type === 'bug').length,
      support: allTasks.filter(t => t.type === 'support').length,
      learning: allTasks.filter(t => t.type === 'learning').length
    };
    
    output += `  Features: ${byType.feature} | Bugs: ${byType.bug} | Support: ${byType.support} | Learning: ${byType.learning}\n`;
    output += `  Total Tasks: ${allTasks.length}\n\n`;

    Object.keys(tasksByOrg).forEach(orgKey => {
      const orgInfo = getOrgInfo(orgKey);
      const orgTasks = tasksByOrg[orgKey];
      const orgTime = orgTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);
      
      output += `${orgInfo.label.toUpperCase()}\n`;
      output += `${'-'.repeat(60)}\n`;
      output += `Time Spent: ${formatTime(orgTime)}\n`;
      output += `Tasks Completed: ${orgTasks.length}\n\n`;
      
      orgTasks.forEach((task, index) => {
        const typeLabel = TASK_TYPES.find(t => t.value === task.type)?.label || 'Task';
        const sizeLabel = TASK_SIZES.find(s => s.value === task.size)?.label || 'N/A';
        const actualTime = getElapsedTime(task);
        const estimatedHours = task.estimatedHours || 0;
        const variance = estimatedHours > 0 
          ? ((actualTime / 3600 - estimatedHours) / estimatedHours * 100).toFixed(0) 
          : 'N/A';
        
        output += `${index + 1}. ${task.text}\n`;
        output += `   Type: ${typeLabel} | Size: ${sizeLabel}\n`;
        output += `   Time: ${formatTime(actualTime)}`;
        if (estimatedHours > 0) {
          output += ` (Est: ${estimatedHours}h, Variance: ${variance}%)`;
        }
        output += '\n';
        
        if (task.qualityRating && task.qualityRating !== 'unrated') {
          const rating = QUALITY_RATINGS.find(r => r.value === task.qualityRating);
          output += `   Quality: ${rating?.label || 'N/A'}\n`;
        }
        output += '\n';
      });
      output += '\n';
    });

    return output.trim();
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Copied to clipboard!');
    }).catch(() => {
      alert('❌ Failed to copy. Please copy manually.');
    });
  };

  // Weekly Cleanup Functions
  const checkWeeklyCleanup = () => {
    if (!weeklyCleanupEnabled) return;

    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday

    // Check if it's Monday (1) or Sunday (0) - configurable
    const isCleanupDay = dayOfWeek === 1; // Monday

    if (!isCleanupDay) return;

    // Check if we've already cleaned up this week
    if (lastCleanupDate) {
      const lastCleanup = new Date(lastCleanupDate);
      const daysSinceCleanup = Math.floor((now - lastCleanup) / (1000 * 60 * 60 * 24));
      
      if (daysSinceCleanup < 7) {
        return; // Already cleaned up this week
      }
    }

    // Perform weekly cleanup
    performWeeklyCleanup();
  };

  const performWeeklyCleanup = () => {
    const completedTasks = tasks.filter(t => t.completed);
    
    if (completedTasks.length > 0) {
      // Archive all completed tasks
      setArchivedTasks([...archivedTasks, ...completedTasks]);
      setTasks(tasks.filter(t => !t.completed));
      
      // Update last cleanup date
      setLastCleanupDate(new Date().toISOString());
      
      // Notify user
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🧹 Weekly Cleanup Complete', {
          body: `Archived ${completedTasks.length} completed task${completedTasks.length !== 1 ? 's' : ''} from last week. Fresh start for this week!`,
          icon: '🧹'
        });
      }
    }
  };

  const manualWeeklyCleanup = () => {
    const completedTasks = tasks.filter(t => t.completed);
    
    if (completedTasks.length === 0) {
      alert('No completed tasks to clean up!');
      return;
    }

    if (confirm(`Archive ${completedTasks.length} completed task${completedTasks.length !== 1 ? 's' : ''} to start fresh this week?`)) {
      performWeeklyCleanup();
      alert(`✅ Cleaned up ${completedTasks.length} tasks! Fresh start for the week.`);
    }
  };

  // Pomodoro Functions
  const handlePomodoroComplete = () => {
    setPomodoroRunning(false);
    
    if (pomodoroMode === 'focus') {
      const newSessions = pomodoroSessions + 1;
      setPomodoroSessions(newSessions);
      
      // Notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🍅 Pomodoro Complete!', {
          body: `Focus session ${newSessions} complete! Time for a break.`,
          icon: '🍅'
        });
      }
      
      // Decide break type
      if (newSessions % POMODORO_SETTINGS.sessionsBeforeLongBreak === 0) {
        setPomodoroMode('longBreak');
        setPomodoroTime(POMODORO_SETTINGS.longBreak * 60);
      } else {
        setPomodoroMode('shortBreak');
        setPomodoroTime(POMODORO_SETTINGS.shortBreak * 60);
      }
    } else {
      // Break complete
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🍅 Break Complete!', {
          body: 'Ready for another focus session?',
          icon: '🍅'
        });
      }
      setPomodoroMode('focus');
      setPomodoroTime(POMODORO_SETTINGS.focus * 60);
    }
  };

  const startPomodoro = (taskId = null) => {
    setActivePomodoroTask(taskId);
    setPomodoroRunning(true);
    
    // Start timer on task if provided
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task && !task.isTimerRunning) {
        startTimer(taskId);
      }
    }
  };

  const pausePomodoro = () => {
    setPomodoroRunning(false);
  };

  const resetPomodoro = () => {
    setPomodoroRunning(false);
    setPomodoroMode('focus');
    setPomodoroTime(POMODORO_SETTINGS.focus * 60);
    setActivePomodoroTask(null);
  };

  const skipPomodoroPhase = () => {
    handlePomodoroComplete();
  };

  // Task Notes Functions
  const updateTaskNotes = (taskId, notes) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, notes: notes } : task
    ));
    setEditingTaskNotes(null);
  };

  const formatPomodoroTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pomodoro timer useEffect - MUST be after handlePomodoroComplete is defined
  useEffect(() => {
    if (pomodoroRunning && pomodoroTime > 0) {
      pomodoroTimerRef.current = setInterval(() => {
        setPomodoroTime(prev => {
          if (prev <= 1) {
            handlePomodoroComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (pomodoroTimerRef.current) {
        clearInterval(pomodoroTimerRef.current);
      }
    }

    return () => {
      if (pomodoroTimerRef.current) {
        clearInterval(pomodoroTimerRef.current);
      }
    };
  }, [pomodoroRunning, pomodoroTime]);

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startTimer = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          isTimerRunning: true,
          timerStartedAt: Date.now()
        };
      }
      return task;
    }));
  };

  const pauseTimer = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id && task.isTimerRunning) {
        const sessionDuration = Math.floor((Date.now() - task.timerStartedAt) / 1000);
        return {
          ...task,
          isTimerRunning: false,
          timeSpent: task.timeSpent + sessionDuration,
          timerStartedAt: null,
          sessions: [...task.sessions, {
            start: task.timerStartedAt,
            end: Date.now(),
            duration: sessionDuration
          }]
        };
      }
      return task;
    }));
  };

  const stopTimer = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        if (task.isTimerRunning) {
          const sessionDuration = Math.floor((Date.now() - task.timerStartedAt) / 1000);
          return {
            ...task,
            isTimerRunning: false,
            timeSpent: task.timeSpent + sessionDuration,
            timerStartedAt: null,
            completed: true,
            completedAt: new Date().toISOString(),
            sessions: [...task.sessions, {
              start: task.timerStartedAt,
              end: Date.now(),
              duration: sessionDuration
            }]
          };
        } else {
          return { 
            ...task, 
            completed: true,
            completedAt: new Date().toISOString()
          };
        }
      }
      return task;
    }));
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    } else if (mins > 0) {
      return `${mins}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Break management functions
  const startBreak = (breakType) => {
    const breakInfo = BREAK_TYPES.find(b => b.value === breakType);
    const newBreak = {
      type: breakType,
      label: breakInfo?.label || breakType,
      startedAt: Date.now(),
      expectedDuration: breakInfo?.duration || 15
    };
    setActiveBreak(newBreak);
    localStorage.setItem('activeBreak', JSON.stringify(newBreak));
    setShowBreakMenu(false);
  };

  const endBreak = () => {
    if (activeBreak) {
      const duration = Math.floor((Date.now() - activeBreak.startedAt) / 1000);
      const completedBreak = {
        ...activeBreak,
        endedAt: Date.now(),
        duration: duration
      };
      const updatedBreaks = [...todayBreaks, completedBreak];
      setTodayBreaks(updatedBreaks);
      localStorage.setItem('todayBreaks', JSON.stringify(updatedBreaks));
      setActiveBreak(null);
      localStorage.removeItem('activeBreak');
    }
  };

  const cancelBreak = () => {
    setActiveBreak(null);
    localStorage.removeItem('activeBreak');
  };

  const getTotalBreakTime = () => {
    let total = todayBreaks.reduce((sum, b) => sum + (b.duration || 0), 0);
    // Add current break time if active
    if (activeBreak) {
      total += Math.floor((currentTime - activeBreak.startedAt) / 1000);
    }
    return total;
  };

  const getActiveBreakDuration = () => {
    if (!activeBreak) return 0;
    return Math.floor((currentTime - activeBreak.startedAt) / 1000);
  };

  const getElapsedTime = (task) => {
    let totalSeconds = task.timeSpent;
    if (task.isTimerRunning && task.timerStartedAt) {
      const currentSession = Math.floor((currentTime - task.timerStartedAt) / 1000);
      totalSeconds += currentSession;
    }
    return totalSeconds;
  };

  const getTaskAge = (task) => {
    const now = new Date();
    const created = new Date(task.createdAt);
    const ageInDays = (now - created) / (1000 * 60 * 60 * 24);
    return ageInDays;
  };

  const isTaskStale = (task) => {
    return !task.completed && getTaskAge(task) >= 2;
  };

  const getTimeComparison = (task) => {
    const actualHours = getElapsedTime(task) / 3600;
    const estimatedHours = task.estimatedHours || 0;
    const percentageUsed = estimatedHours > 0 ? (actualHours / estimatedHours) * 100 : 0;
    return {
      actual: actualHours,
      estimated: estimatedHours,
      percentage: percentageUsed,
      overBudget: actualHours > estimatedHours
    };
  };

  const getTaskTypeInfo = (typeValue) => {
    return TASK_TYPES.find(t => t.value === typeValue) || TASK_TYPES[0];
  };

  const getTaskSizeInfo = (sizeValue) => {
    return TASK_SIZES.find(s => s.value === sizeValue) || TASK_SIZES[2];
  };

  const getOrgInfo = (orgValue) => {
    return organizations.find(o => o.value === orgValue) || organizations[0];
  };

  const getTypeButtonClasses = (typeColor, isSelected) => {
    const baseClasses = 'p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1';
    
    if (isSelected) {
      const colorClasses = {
        blue: 'border-blue-500 bg-blue-50 text-blue-700',
        red: 'border-red-500 bg-red-50 text-red-700',
        green: 'border-green-500 bg-green-50 text-green-700',
        purple: 'border-purple-500 bg-purple-50 text-purple-700',
        orange: 'border-orange-500 bg-orange-50 text-orange-700',
        amber: 'border-amber-500 bg-amber-50 text-amber-700',
        indigo: 'border-indigo-500 bg-indigo-50 text-indigo-700',
        teal: 'border-teal-500 bg-teal-50 text-teal-700'
      };
      return `${baseClasses} ${colorClasses[typeColor] || colorClasses.blue}`;
    }
    
    return `${baseClasses} border-gray-200 hover:border-gray-300 text-gray-600`;
  };

  const getTypeBadgeClasses = (typeColor) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-700',
      red: 'bg-red-100 text-red-700',
      green: 'bg-green-100 text-green-700',
      purple: 'bg-purple-100 text-purple-700',
      orange: 'bg-orange-100 text-orange-700',
      amber: 'bg-amber-100 text-amber-700',
      indigo: 'bg-indigo-100 text-indigo-700',
      teal: 'bg-teal-100 text-teal-700'
    };
    return `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClasses[typeColor] || colorClasses.blue}`;
  };

  const getOrgBadgeClasses = (orgColor) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      indigo: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      cyan: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      purple: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      pink: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
      emerald: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
      orange: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      green: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      red: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };
    return `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${colorClasses[orgColor] || colorClasses.blue}`;
  };

  const getPriorityBadgeClasses = (priority) => {
    const classes = {
      high: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 border border-red-300 dark:border-red-700',
      medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700',
      low: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 border border-green-300 dark:border-green-700'
    };
    return `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${classes[priority] || classes.medium}`;
  };

  const getTagBadgeClasses = (tagColor) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700',
      red: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700',
      orange: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:border-orange-700',
      purple: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700',
      green: 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700',
      gray: 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
    };
    return `inline-flex items-center px-2 py-0.5 rounded text-xs border ${colors[tagColor] || colors.blue}`;
  };

  // Productivity calculations
  const getTasksForPeriod = (period) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    // Include both active and archived tasks in metrics
    const allTasks = [...tasks, ...archivedTasks];

    return allTasks.filter(task => {
      const createdDate = new Date(task.createdAt);
      if (period === 'today') {
        return createdDate >= startOfToday;
      } else if (period === 'week') {
        return createdDate >= startOfWeek;
      }
      return true;
    });
  };

  const calculateProductivityMetrics = (period) => {
    const periodTasks = getTasksForPeriod(period);
    const completedTasks = periodTasks.filter(t => t.completed);
    const workTasks = periodTasks.filter(t => {
      const org = organizations.find(o => o.value === t.organization);
      return org && org.type === 'work';
    });
    const completedWorkTasks = workTasks.filter(t => t.completed);

    // Time calculations
    const totalTime = periodTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);
    const workTime = workTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);
    const learningTasks = periodTasks.filter(t => t.type === 'learning');
    const learningTime = learningTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);

    // Meeting time calculations
    const meetingTasks = periodTasks.filter(t => isMeetingType(t.type));
    const meetingTime = meetingTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);
    const meetingRatio = totalTime > 0 ? (meetingTime / totalTime) * 100 : 0;
    const meetingEfficiency = meetingRatio <= 25 ? 100 : Math.max(0, 100 - ((meetingRatio - 25) * 4));

    // Quality metrics
    const ratedTasks = completedTasks.filter(t => t.qualityRating !== 'unrated');
    const avgQualityScore = ratedTasks.length > 0
      ? ratedTasks.reduce((sum, t) => {
          const rating = QUALITY_RATINGS.find(r => r.value === t.qualityRating);
          return sum + (rating?.score || 0);
        }, 0) / ratedTasks.length
      : 0;

    // Estimation accuracy
    const tasksWithEstimates = completedTasks.filter(t => t.estimatedHours > 0);
    const estimationAccuracy = tasksWithEstimates.length > 0
      ? tasksWithEstimates.reduce((sum, t) => {
          const actualHours = getElapsedTime(t) / 3600;
          const variance = Math.abs(actualHours - t.estimatedHours) / t.estimatedHours;
          return sum + (1 - Math.min(variance, 1));
        }, 0) / tasksWithEstimates.length * 100
      : 0;

    // Task type breakdown
    const featureTasks = periodTasks.filter(t => t.type === 'feature');
    const bugTasks = periodTasks.filter(t => t.type === 'bug');
    const supportTasks = periodTasks.filter(t => t.type === 'support');

    // Bug ratio (quality indicator)
    const codeProductionTasks = featureTasks.length + bugTasks.length;
    const bugRatio = codeProductionTasks > 0 
      ? (bugTasks.length / codeProductionTasks) * 100 
      : 0;

    // Focus score (longer uninterrupted sessions = better focus)
    const allSessions = completedTasks.flatMap(t => t.sessions || []);
    const avgSessionLength = allSessions.length > 0
      ? allSessions.reduce((sum, s) => sum + s.duration, 0) / allSessions.length
      : 0;
    const focusScore = Math.min((avgSessionLength / 1800) * 100, 100); // 30min = 100%

    // Deep work bonus (sessions > 2 hours)
    const deepWorkSessions = allSessions.filter(s => s.duration >= 7200);
    const deepWorkTime = deepWorkSessions.reduce((sum, s) => sum + s.duration, 0);
    const deepWorkBonus = Math.min((deepWorkTime / 3600) * 10, 20); // Up to 20 bonus points for 2+ hours deep work

    // Context switching penalty (many short sessions across different tasks)
    const taskSessionCounts = completedTasks.map(t => (t.sessions || []).length);
    const avgSessionsPerTask = taskSessionCounts.length > 0 
      ? taskSessionCounts.reduce((a, b) => a + b, 0) / taskSessionCounts.length 
      : 0;
    const contextSwitchPenalty = avgSessionsPerTask > 3 ? Math.min((avgSessionsPerTask - 3) * 5, 15) : 0;

    // === COMPLEXITY-WEIGHTED METRICS ===
    const getTaskPoints = (task) => {
      const sizePoints = SIZE_POINTS[task.size] || SIZE_POINTS.m;
      const priorityMultiplier = PRIORITY_MULTIPLIERS[task.priority] || 1;
      return sizePoints * priorityMultiplier;
    };

    const totalPoints = periodTasks.reduce((sum, t) => sum + getTaskPoints(t), 0);
    const completedPoints = completedTasks.reduce((sum, t) => sum + getTaskPoints(t), 0);
    const weightedCompletionRate = totalPoints > 0 ? (completedPoints / totalPoints) * 100 : 0;

    // Velocity (points per day)
    const daysInPeriod = period === 'today' ? 1 : 7;
    const velocity = completedPoints / daysInPeriod;

    // === STREAK TRACKING ===
    const calculateStreaks = () => {
      const allTasksWithDates = [...tasks, ...archivedTasks];
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Daily completion streak
      let completionStreak = 0;
      let checkDate = new Date(today);
      
      for (let i = 0; i < 30; i++) { // Check last 30 days
        const dayStart = new Date(checkDate);
        const dayEnd = new Date(checkDate);
        dayEnd.setDate(dayEnd.getDate() + 1);
        
        const dayTasks = allTasksWithDates.filter(t => {
          const created = new Date(t.createdAt);
          return created >= dayStart && created < dayEnd;
        });
        
        const dayCompleted = dayTasks.filter(t => t.completed);
        
        if (dayTasks.length > 0 && dayCompleted.length === dayTasks.length) {
          completionStreak++;
        } else if (dayTasks.length > 0) {
          break;
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
      }

      // Learning streak (consecutive days with learning time)
      let learningStreak = 0;
      checkDate = new Date(today);
      
      for (let i = 0; i < 30; i++) {
        const dayStart = new Date(checkDate);
        const dayEnd = new Date(checkDate);
        dayEnd.setDate(dayEnd.getDate() + 1);
        
        const dayLearning = allTasksWithDates.filter(t => {
          const created = new Date(t.createdAt);
          return t.type === 'learning' && created >= dayStart && created < dayEnd && getElapsedTime(t) > 0;
        });
        
        if (dayLearning.length > 0) {
          learningStreak++;
        } else {
          break;
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
      }

      // Zero-bug streak (days without creating bug tasks)
      let zeroBugStreak = 0;
      checkDate = new Date(today);
      
      for (let i = 0; i < 30; i++) {
        const dayStart = new Date(checkDate);
        const dayEnd = new Date(checkDate);
        dayEnd.setDate(dayEnd.getDate() + 1);
        
        const dayBugs = allTasksWithDates.filter(t => {
          const created = new Date(t.createdAt);
          return t.type === 'bug' && created >= dayStart && created < dayEnd;
        });
        
        if (dayBugs.length === 0) {
          zeroBugStreak++;
        } else {
          break;
        }
        
        checkDate.setDate(checkDate.getDate() - 1);
      }

      return { completionStreak, learningStreak, zeroBugStreak };
    };

    const streaks = calculateStreaks();

    // === CONSISTENCY SCORE ===
    const calculateConsistency = () => {
      if (period !== 'week') return 100;
      
      const dailyPoints = [];
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      for (let i = 0; i < 7; i++) {
        const dayStart = new Date(weekStart);
        dayStart.setDate(dayStart.getDate() + i);
        const dayEnd = new Date(dayStart);
        dayEnd.setDate(dayEnd.getDate() + 1);
        
        const dayCompleted = completedTasks.filter(t => {
          const completedAt = t.completedAt ? new Date(t.completedAt) : null;
          return completedAt && completedAt >= dayStart && completedAt < dayEnd;
        });
        
        const dayPoints = dayCompleted.reduce((sum, t) => sum + getTaskPoints(t), 0);
        dailyPoints.push(dayPoints);
      }
      
      const avgDaily = dailyPoints.reduce((a, b) => a + b, 0) / 7;
      if (avgDaily === 0) return 100;
      
      const variance = dailyPoints.reduce((sum, p) => sum + Math.pow(p - avgDaily, 2), 0) / 7;
      const stdDev = Math.sqrt(variance);
      const coefficientOfVariation = (stdDev / avgDaily) * 100;
      
      // Lower variation = higher consistency
      return Math.max(0, 100 - coefficientOfVariation);
    };

    const consistencyScore = calculateConsistency();

    // === FIRST-TIME COMPLETION RATE ===
    const firstTimeCompletions = completedTasks.filter(t => !t.reopenedCount || t.reopenedCount === 0);
    const firstTimeRate = completedTasks.length > 0 
      ? (firstTimeCompletions.length / completedTasks.length) * 100 
      : 100;

    return {
      totalTasks: periodTasks.length,
      completedTasks: completedTasks.length,
      completionRate: periodTasks.length > 0 ? (completedTasks.length / periodTasks.length) * 100 : 0,
      totalTime,
      workTime,
      learningTime,
      meetingTime,
      meetingRatio,
      meetingEfficiency,
      workHoursTarget: period === 'week' ? 42 * 3600 : 8.4 * 3600,
      workHoursProgress: period === 'week' ? (workTime / (42 * 3600)) * 100 : (workTime / (8.4 * 3600)) * 100,
      avgQualityScore,
      qualityRating: avgQualityScore >= 4.5 ? 'excellent' : avgQualityScore >= 3.5 ? 'good' : avgQualityScore >= 2.5 ? 'average' : 'needs-improvement',
      estimationAccuracy,
      bugRatio,
      focusScore,
      deepWorkBonus,
      contextSwitchPenalty,
      ratedTasksCount: ratedTasks.length,
      unratedTasksCount: completedTasks.length - ratedTasks.length,
      taskTypeBreakdown: {
        feature: featureTasks.length,
        bug: bugTasks.length,
        support: supportTasks.length,
        learning: learningTasks.length,
        meeting: meetingTasks.length
      },
      completedWorkTasks: completedWorkTasks.length,
      // New complexity-weighted metrics
      totalPoints,
      completedPoints,
      weightedCompletionRate,
      velocity,
      // Streaks
      streaks,
      // Consistency
      consistencyScore,
      // First-time completion
      firstTimeRate,
      // Enhanced productivity score
      productivityScore: calculateProductivityScore({
        completionRate: periodTasks.length > 0 ? (completedTasks.length / periodTasks.length) * 100 : 0,
        weightedCompletionRate,
        avgQualityScore,
        estimationAccuracy,
        bugRatio,
        focusScore,
        deepWorkBonus,
        contextSwitchPenalty,
        meetingEfficiency,
        consistencyScore,
        firstTimeRate,
        streaks
      })
    };
  };

  const calculateProductivityScore = ({ 
    completionRate, 
    weightedCompletionRate, 
    avgQualityScore, 
    estimationAccuracy, 
    bugRatio, 
    focusScore,
    deepWorkBonus,
    contextSwitchPenalty,
    meetingEfficiency,
    consistencyScore,
    firstTimeRate,
    streaks
  }) => {
    // Enhanced weighted scoring with new metrics
    const weights = {
      weightedCompletion: 0.20,  // Complexity-weighted task completion
      quality: 0.20,             // Quality rating
      estimation: 0.12,          // Estimation accuracy
      bugRatio: 0.10,            // Code quality (fewer bugs)
      focus: 0.10,               // Focus/session length
      meetingEfficiency: 0.08,   // Meeting time management
      consistency: 0.10,         // Daily consistency
      firstTime: 0.10            // First-time completion rate
    };

    const scores = {
      weightedCompletion: weightedCompletionRate || completionRate,
      quality: (avgQualityScore / 5) * 100,
      estimation: estimationAccuracy,
      bugRatio: Math.max(0, 100 - (bugRatio * 2)),
      focus: focusScore,
      meetingEfficiency: meetingEfficiency || 100,
      consistency: consistencyScore || 100,
      firstTime: firstTimeRate || 100
    };

    let totalScore = Object.keys(weights).reduce((sum, key) => {
      return sum + (scores[key] * weights[key]);
    }, 0);

    // Apply bonuses and penalties
    totalScore += (deepWorkBonus || 0);           // Up to +20 for deep work
    totalScore -= (contextSwitchPenalty || 0);    // Up to -15 for context switching

    // Streak bonuses (up to +15 total)
    if (streaks) {
      if (streaks.completionStreak >= 5) totalScore += 5;
      else if (streaks.completionStreak >= 3) totalScore += 3;
      
      if (streaks.learningStreak >= 5) totalScore += 5;
      else if (streaks.learningStreak >= 3) totalScore += 3;
      
      if (streaks.zeroBugStreak >= 7) totalScore += 5;
      else if (streaks.zeroBugStreak >= 3) totalScore += 3;
    }

    return Math.min(100, Math.max(0, Math.round(totalScore)));
  };

  // Get productivity grade based on score
  const getProductivityGrade = (score) => {
    if (score >= 90) return { grade: 'A+', color: 'text-green-600', bgColor: 'bg-green-100', label: 'Outstanding' };
    if (score >= 80) return { grade: 'A', color: 'text-green-500', bgColor: 'bg-green-50', label: 'Excellent' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-500', bgColor: 'bg-blue-50', label: 'Good' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-500', bgColor: 'bg-yellow-50', label: 'Average' };
    if (score >= 50) return { grade: 'D', color: 'text-orange-500', bgColor: 'bg-orange-50', label: 'Needs Improvement' };
    return { grade: 'F', color: 'text-red-500', bgColor: 'bg-red-50', label: 'Poor' };
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    // Filter by completion status
    if (filter === 'active' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;
    
    // Filter by organization
    if (orgFilter !== 'all' && task.organization !== orgFilter) return false;
    
    // Filter by priority
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    
    // Filter by tag
    if (tagFilter !== 'all' && (!task.tags || !task.tags.includes(tagFilter))) return false;
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchesText = task.text.toLowerCase().includes(query);
      const matchesNotes = task.notes?.toLowerCase().includes(query);
      const matchesOrg = getOrgInfo(task.organization).label.toLowerCase().includes(query);
      const matchesType = getTaskTypeInfo(task.type).label.toLowerCase().includes(query);
      
      if (!matchesText && !matchesNotes && !matchesOrg && !matchesType) return false;
    }
    
    // Filter by today view
    if (showTodayView) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const taskDate = new Date(task.createdAt);
      taskDate.setHours(0, 0, 0, 0);
      
      const isCreatedToday = taskDate.getTime() === today.getTime();
      const hasScheduledTime = task.scheduledTime !== null;
      const isIncomplete = !task.completed;
      const wasCompletedToday = task.completedAt && new Date(task.completedAt).setHours(0,0,0,0) === today.getTime();
      
      // Show: tasks created today, tasks with scheduled time, incomplete tasks, or tasks completed today
      if (!isCreatedToday && !hasScheduledTime && !isIncomplete && !wasCompletedToday) return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort by priority first (high > medium > low)
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    const aPriority = priorityOrder[a.priority || 'medium'];
    const bPriority = priorityOrder[b.priority || 'medium'];
    if (aPriority !== bPriority) return bPriority - aPriority;
    
    // Then by creation date (newest first)
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Calculate today's tasks and time
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayTasks = tasks.filter(t => {
    const taskDate = new Date(t.createdAt);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate.getTime() === todayStart.getTime() || (t.scheduledTime && !t.completed);
  });
  const todayTimeSpent = todayTasks.reduce((total, task) => total + getElapsedTime(task), 0);

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    stale: tasks.filter(t => isTaskStale(t)).length,
    completionRate: tasks.length > 0 
      ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
      : 0,
    totalTimeSpent: tasks.reduce((total, task) => total + getElapsedTime(task), 0),
    todayTimeSpent
  };

  // Daily and weekly productivity metrics
  const dailyMetrics = calculateProductivityMetrics('today');
  const weeklyMetrics = calculateProductivityMetrics('week');

  // Stats per organization
  const orgStats = organizations.map(org => {
    const orgTasks = tasks.filter(t => t.organization === org.value);
    const orgCompleted = orgTasks.filter(t => t.completed).length;
    const orgActive = orgTasks.filter(t => !t.completed).length;
    const orgStale = orgTasks.filter(t => isTaskStale(t)).length;
    const orgTime = orgTasks.reduce((total, task) => total + getElapsedTime(task), 0);
    
    return {
      org: org.value,
      label: org.label,
      color: org.color,
      icon: org.icon,
      type: org.type,
      total: orgTasks.length,
      completed: orgCompleted,
      active: orgActive,
      stale: orgStale,
      timeSpent: orgTime,
      completionRate: orgTasks.length > 0 ? Math.round((orgCompleted / orgTasks.length) * 100) : 0
    };
  });

  return (
    <div className={`min-h-screen p-4 transition-colors ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Kholisa Mjobo - Daily Task Manager
            </h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Senior Software Engineer • Stay focused. Stay productive.
          </p>
          
          {/* View Toggle */}
          <div className="mt-4 flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setShowProductivity(false)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                !showProductivity
                  ? 'bg-blue-600 text-white'
                  : darkMode 
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Tasks View
            </button>
            <button
              onClick={() => setShowProductivity(true)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                showProductivity
                  ? 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Target className="w-4 h-4" />
              Productivity Analytics
            </button>
            <button
              onClick={() => setShowChangelog(true)}
              className="px-6 py-2 rounded-lg font-medium transition-colors bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
            >
              📋 Work Summary
            </button>
            <button
              onClick={() => {
                setStorageInfo(calculateStorageUsage());
                setShowStorageManager(true);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                storageInfo.percentage > 80 
                  ? 'bg-orange-600 text-white animate-pulse' 
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              💾 Storage {storageInfo.percentage > 0 && `(${Math.round(storageInfo.percentage)}%)`}
            </button>
          </div>

          {/* Phase 2 Features Row */}
          <div className="mt-3 flex justify-center gap-2 flex-wrap">
            <button
              onClick={() => setShowTodayView(!showTodayView)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                showTodayView
                  ? 'bg-purple-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title="Focus on today's tasks (T)"
            >
              📅 Today View - {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </button>
            <button
              onClick={() => setShowPomodoro(!showPomodoro)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                showPomodoro
                  ? 'bg-red-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title="Pomodoro timer (P)"
            >
              🍅 Pomodoro
            </button>
            {/* Break/Away Button */}
            <div className="relative">
              {activeBreak ? (
                <button
                  onClick={endBreak}
                  className="px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 bg-yellow-500 text-white animate-pulse"
                  title="Click to end break"
                >
                  {BREAK_TYPES.find(b => b.value === activeBreak.type)?.label || '⏸️ On Break'} - {formatTime(getActiveBreakDuration())}
                </button>
              ) : (
                <button
                  onClick={() => setShowBreakMenu(!showBreakMenu)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    showBreakMenu
                      ? 'bg-yellow-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  title="Log a break"
                >
                  ☕ Break {getTotalBreakTime() > 0 && `(${formatTime(getTotalBreakTime())})`}
                </button>
              )}
              
              {/* Break Menu Dropdown */}
              {showBreakMenu && !activeBreak && (
                <div className={`absolute top-full left-0 mt-2 w-56 rounded-lg shadow-lg z-50 ${darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                  <div className={`px-3 py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Start a Break</div>
                    {getTotalBreakTime() > 0 && (
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Today's total: {formatTime(getTotalBreakTime())}
                      </div>
                    )}
                  </div>
                  <div className="py-1">
                    {BREAK_TYPES.map(breakType => (
                      <button
                        key={breakType.value}
                        onClick={() => startBreak(breakType.value)}
                        className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'text-gray-700'}`}
                      >
                        <span className="mr-2">{breakType.label}</span>
                        <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>~{breakType.duration}min</span>
                      </button>
                    ))}
                  </div>
                  {todayBreaks.length > 0 && (
                    <div className={`px-3 py-2 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Today's Breaks</div>
                      <div className="max-h-32 overflow-y-auto">
                        {todayBreaks.map((b, i) => (
                          <div key={i} className={`text-xs py-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {b.label} - {formatTime(b.duration)} at {new Date(b.startedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button
              onClick={() => setShowKeyboardShortcuts(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
              title="Keyboard shortcuts (?)"
            >
              ⌨️ Shortcuts
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-4 max-w-2xl mx-auto">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search tasks... (Press / to focus)"
                className={`w-full px-4 py-3 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${
                    darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  ✕ Clear
                </button>
              )}
            </div>
            {searchQuery && (
              <div className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Found {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''} matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>

        {/* Notification Settings */}
        <div className={`rounded-lg shadow-md p-4 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${notificationsEnabled ? 'text-green-600' : darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <div>
                <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Smart Reminders & Automation
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {notificationsEnabled ? 'Notifications enabled' : 'Get reminded to add tasks and close stale ones'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {notificationsEnabled && (
                <div className="flex items-center gap-2">
                  <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Morning reminder:
                  </label>
                  <input
                    type="time"
                    value={morningReminderTime}
                    onChange={(e) => setMorningReminderTime(e.target.value)}
                    className={`px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                    }`}
                  />
                </div>
              )}
              <button
                onClick={requestNotificationPermission}
                disabled={notificationsEnabled}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  notificationsEnabled
                    ? 'bg-green-100 text-green-700 cursor-not-allowed dark:bg-green-900 dark:text-green-200'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {notificationsEnabled ? '✓ Enabled' : 'Enable Reminders'}
              </button>
            </div>
          </div>

          {/* Weekly Cleanup Setting */}
          <div className={`mt-4 pt-4 ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="text-2xl">🧹</div>
                <div>
                  <div className="font-semibold text-gray-800">Weekly Cleanup</div>
                  <div className="text-sm text-gray-600">
                    Automatically archive completed tasks every Monday
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {lastCleanupDate && (
                  <div className="text-xs text-gray-500">
                    Last: {new Date(lastCleanupDate).toLocaleDateString()}
                  </div>
                )}
                <button
                  onClick={manualWeeklyCleanup}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                >
                  Clean Up Now
                </button>
                <button
                  onClick={() => setWeeklyCleanupEnabled(!weeklyCleanupEnabled)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    weeklyCleanupEnabled
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {weeklyCleanupEnabled ? '✓ Auto-Cleanup ON' : 'Auto-Cleanup OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {showProductivity ? (
          // PRODUCTIVITY DASHBOARD VIEW
          <div className="space-y-6">
            {/* Productivity Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Today's Productivity */}
              <div className={`rounded-lg shadow-lg p-6 border ${darkMode ? 'bg-gray-800 border-blue-700' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>Today's Productivity</h2>
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="text-center mb-6">
                  <div className={`text-6xl font-bold mb-2 ${getProductivityGrade(dailyMetrics.productivityScore).color}`}>
                    {dailyMetrics.productivityScore}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overall Score</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getProductivityGrade(dailyMetrics.productivityScore).bgColor} ${getProductivityGrade(dailyMetrics.productivityScore).color}`}>
                    {getProductivityGrade(dailyMetrics.productivityScore).grade} - {getProductivityGrade(dailyMetrics.productivityScore).label}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Completed</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{dailyMetrics.completedTasks} / {dailyMetrics.totalTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Points Earned</span>
                    <span className="font-semibold text-blue-600">{dailyMetrics.completedPoints} / {dailyMetrics.totalPoints} pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Work Hours</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatTime(dailyMetrics.workTime)} / ~8.4h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Meeting Time</span>
                    <span className={`font-semibold ${dailyMetrics.meetingRatio > 25 ? 'text-orange-600' : 'text-green-600'}`}>
                      {formatTime(dailyMetrics.meetingTime)} ({dailyMetrics.meetingRatio.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Learning Time</span>
                    <span className="font-semibold text-purple-600">{formatTime(dailyMetrics.learningTime)}</span>
                  </div>
                </div>
              </div>

              {/* This Week's Productivity */}
              <div className={`rounded-lg shadow-lg p-6 border ${darkMode ? 'bg-gray-800 border-purple-700' : 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200'}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>This Week's Productivity</h2>
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                
                <div className="text-center mb-6">
                  <div className={`text-6xl font-bold mb-2 ${getProductivityGrade(weeklyMetrics.productivityScore).color}`}>
                    {weeklyMetrics.productivityScore}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overall Score</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getProductivityGrade(weeklyMetrics.productivityScore).bgColor} ${getProductivityGrade(weeklyMetrics.productivityScore).color}`}>
                    {getProductivityGrade(weeklyMetrics.productivityScore).grade} - {getProductivityGrade(weeklyMetrics.productivityScore).label}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tasks Completed</span>
                    <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{weeklyMetrics.completedTasks} / {weeklyMetrics.totalTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Points Earned</span>
                    <span className="font-semibold text-purple-600">{weeklyMetrics.completedPoints} / {weeklyMetrics.totalPoints} pts</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Velocity</span>
                    <span className="font-semibold text-indigo-600">{weeklyMetrics.velocity.toFixed(1)} pts/day</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Work Hours (42h target)</span>
                      <span className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{formatTime(weeklyMetrics.workTime)} / 42h</span>
                    </div>
                    <div className={`w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                      <div 
                        className={`h-2 rounded-full transition-all ${
                          weeklyMetrics.workHoursProgress >= 100 ? 'bg-green-600' :
                          weeklyMetrics.workHoursProgress >= 80 ? 'bg-blue-600' :
                          'bg-orange-600'
                        }`}
                        style={{ width: `${Math.min(weeklyMetrics.workHoursProgress, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overall Time Statistics */}
            <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Clock className="w-5 h-5 text-purple-600" />
                Time Overview
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {formatTime(stats.totalTimeSpent)}
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>All-Time Total</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>All tracked time</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {formatTime(weeklyMetrics.totalTime)}
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>This Week</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Weekly total</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {formatTime(dailyMetrics.totalTime)}
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Today</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Current day</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
                  <div className={`text-3xl font-bold mb-1 ${weeklyMetrics.workHoursProgress >= 100 ? 'text-green-600' : 'text-indigo-600'}`}>
                    {weeklyMetrics.workHoursProgress.toFixed(0)}%
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Weekly Target</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>42h goal progress</div>
                </div>
              </div>
            </div>

            {/* Streaks & Consistency */}
            <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                🔥 Streaks & Consistency
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {weeklyMetrics.streaks?.completionStreak || 0}
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Day Streak</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>All tasks done</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {weeklyMetrics.streaks?.learningStreak || 0}
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Learning Streak</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Days learning</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {weeklyMetrics.streaks?.zeroBugStreak || 0}
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Zero-Bug Days</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>No bugs created</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {weeklyMetrics.consistencyScore?.toFixed(0) || 0}%
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Consistency</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Daily balance</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-teal-50'}`}>
                  <div className="text-3xl font-bold text-teal-600 mb-1">
                    {weeklyMetrics.firstTimeRate?.toFixed(0) || 0}%
                  </div>
                  <div className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>First-Time Done</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>No reopens</div>
                </div>
              </div>
            </div>

            {/* Quality Metrics */}
            <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Award className="w-5 h-5 text-yellow-600" />
                Software Engineering Quality Metrics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* Estimation Accuracy */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {weeklyMetrics.estimationAccuracy.toFixed(0)}%
                  </div>
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Estimation Accuracy</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    How well you estimate task duration
                  </div>
                  <div className={`mt-2 w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${weeklyMetrics.estimationAccuracy}%` }}
                    ></div>
                  </div>
                </div>

                {/* Bug Ratio */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {weeklyMetrics.bugRatio.toFixed(0)}%
                  </div>
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Bug Ratio</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Bugs vs Features (lower is better)
                  </div>
                  <div className={`inline-block px-2 py-1 rounded-full text-xs font-semibold mt-2 ${
                    weeklyMetrics.bugRatio < 20 ? 'bg-green-100 text-green-800' :
                    weeklyMetrics.bugRatio < 40 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {weeklyMetrics.bugRatio < 20 ? 'Excellent' :
                     weeklyMetrics.bugRatio < 40 ? 'Good' : 'High'}
                  </div>
                </div>

                {/* Focus Score */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-1">
                    {weeklyMetrics.focusScore.toFixed(0)}%
                  </div>
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Focus Score</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Avg session length (30min = 100%)
                  </div>
                  <div className={`mt-2 w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${weeklyMetrics.focusScore}%` }}
                    ></div>
                  </div>
                </div>

                {/* Meeting Efficiency */}
                <div className="text-center">
                  <div className={`text-3xl font-bold mb-1 ${weeklyMetrics.meetingEfficiency >= 80 ? 'text-green-600' : weeklyMetrics.meetingEfficiency >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {weeklyMetrics.meetingEfficiency.toFixed(0)}%
                  </div>
                  <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Meeting Efficiency</div>
                  <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                    Meetings ≤25% of time = 100%
                  </div>
                  <div className={`mt-2 w-full rounded-full h-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div 
                      className={`h-2 rounded-full transition-all ${weeklyMetrics.meetingEfficiency >= 80 ? 'bg-green-600' : weeklyMetrics.meetingEfficiency >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                      style={{ width: `${weeklyMetrics.meetingEfficiency}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Bonuses & Penalties */}
              <div className={`mt-6 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Score Modifiers</div>
                <div className="flex flex-wrap gap-3">
                  {weeklyMetrics.deepWorkBonus > 0 && (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      +{weeklyMetrics.deepWorkBonus.toFixed(0)} Deep Work Bonus
                    </span>
                  )}
                  {weeklyMetrics.contextSwitchPenalty > 0 && (
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                      -{weeklyMetrics.contextSwitchPenalty.toFixed(0)} Context Switch Penalty
                    </span>
                  )}
                  {weeklyMetrics.streaks?.completionStreak >= 3 && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                      +{weeklyMetrics.streaks.completionStreak >= 5 ? 5 : 3} Completion Streak
                    </span>
                  )}
                  {weeklyMetrics.streaks?.learningStreak >= 3 && (
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                      +{weeklyMetrics.streaks.learningStreak >= 5 ? 5 : 3} Learning Streak
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Task Type Breakdown */}
            <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>This Week's Task Distribution</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                  <Code className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyMetrics.taskTypeBreakdown.feature}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Features</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-red-50'}`}>
                  <Bug className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {weeklyMetrics.taskTypeBreakdown.bug}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Bugs</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-green-50'}`}>
                  <Wrench className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {weeklyMetrics.taskTypeBreakdown.support}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Support</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-purple-50'}`}>
                  <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {weeklyMetrics.taskTypeBreakdown.learning}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Learning</div>
                </div>
                
                <div className={`text-center p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-orange-50'}`}>
                  <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {weeklyMetrics.taskTypeBreakdown.meeting}
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Meetings</div>
                </div>
              </div>
            </div>

            {/* Quality Rating Reminder */}
            {weeklyMetrics.unratedTasksCount > 0 && (
              <div className={`border rounded-lg p-4 ${darkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <div className={`font-semibold ${darkMode ? 'text-orange-300' : 'text-orange-900'}`}>Rate Your Completed Tasks</div>
                    <div className={`text-sm ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                      You have {weeklyMetrics.unratedTasksCount} completed tasks without quality ratings. 
                      Rating helps improve accuracy of productivity metrics.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Insights & Recommendations */}
            <div className={`rounded-lg shadow-md p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <TrendingUp className="w-5 h-5 text-green-600" />
                Insights & Recommendations
              </h3>
              
              <div className="space-y-3">
                {weeklyMetrics.workHoursProgress < 80 && (
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'}`}>
                    <div className={`font-medium ${darkMode ? 'text-yellow-300' : 'text-yellow-900'}`}>⏰ Behind on Weekly Hours</div>
                    <div className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                      You're at {weeklyMetrics.workHoursProgress.toFixed(0)}% of your 42-hour weekly target. 
                      Consider focusing more time on work tasks.
                    </div>
                  </div>
                )}
                
                {weeklyMetrics.learningTime < 3600 && (
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-purple-900/30 border-purple-700' : 'bg-purple-50 border-purple-200'}`}>
                    <div className={`font-medium ${darkMode ? 'text-purple-300' : 'text-purple-900'}`}>📚 Low Learning Time</div>
                    <div className={`text-sm ${darkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                      Only {formatTime(weeklyMetrics.learningTime)} spent on upskilling this week. 
                      Senior engineers should invest 2-4 hours weekly in learning.
                    </div>
                  </div>
                )}
                
                {weeklyMetrics.bugRatio > 30 && (
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200'}`}>
                    <div className={`font-medium ${darkMode ? 'text-red-300' : 'text-red-900'}`}>🐛 High Bug Ratio</div>
                    <div className={`text-sm ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                      {weeklyMetrics.bugRatio.toFixed(0)}% of your tasks are bug fixes. 
                      Consider code reviews, testing, or refactoring to improve code quality.
                    </div>
                  </div>
                )}
                
                {weeklyMetrics.meetingRatio > 30 && (
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-orange-900/30 border-orange-700' : 'bg-orange-50 border-orange-200'}`}>
                    <div className={`font-medium ${darkMode ? 'text-orange-300' : 'text-orange-900'}`}>📅 High Meeting Time</div>
                    <div className={`text-sm ${darkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                      {weeklyMetrics.meetingRatio.toFixed(0)}% of your time is in meetings. 
                      Consider declining non-essential meetings or batching them together.
                    </div>
                  </div>
                )}
                
                {weeklyMetrics.estimationAccuracy < 60 && (
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-blue-900/30 border-blue-700' : 'bg-blue-50 border-blue-200'}`}>
                    <div className={`font-medium ${darkMode ? 'text-blue-300' : 'text-blue-900'}`}>📊 Estimation Needs Improvement</div>
                    <div className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                      Your estimation accuracy is {weeklyMetrics.estimationAccuracy.toFixed(0)}%. 
                      Review completed tasks to understand estimation patterns.
                    </div>
                  </div>
                )}
                
                {weeklyMetrics.focusScore < 50 && (
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-indigo-900/30 border-indigo-700' : 'bg-indigo-50 border-indigo-200'}`}>
                    <div className={`font-medium ${darkMode ? 'text-indigo-300' : 'text-indigo-900'}`}>🎯 Improve Focus</div>
                    <div className={`text-sm ${darkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
                      Your work sessions are frequently interrupted. 
                      Try time-blocking or "deep work" sessions of 90+ minutes.
                    </div>
                  </div>
                )}

                {weeklyMetrics.contextSwitchPenalty > 5 && (
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-pink-900/30 border-pink-700' : 'bg-pink-50 border-pink-200'}`}>
                    <div className={`font-medium ${darkMode ? 'text-pink-300' : 'text-pink-900'}`}>🔄 Context Switching</div>
                    <div className={`text-sm ${darkMode ? 'text-pink-400' : 'text-pink-700'}`}>
                      You're switching between tasks frequently. Try to complete one task before starting another.
                    </div>
                  </div>
                )}

                {weeklyMetrics.productivityScore >= 80 && 
                 weeklyMetrics.workHoursProgress >= 80 && 
                 weeklyMetrics.learningTime >= 3600 && (
                  <div className={`p-3 rounded-lg border ${darkMode ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200'}`}>
                    <div className={`font-medium ${darkMode ? 'text-green-300' : 'text-green-900'}`}>🌟 Excellent Performance!</div>
                    <div className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      You're hitting all your targets: high productivity score, on track for 42h work week, 
                      and investing in learning. Keep up the great work!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // REGULAR TASKS VIEW
          <div className="space-y-6">

        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className={`rounded-lg p-4 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Tasks</div>
            <div className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{stats.total}</div>
          </div>
          <div className={`rounded-lg p-4 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active</div>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          </div>
          <div className={`rounded-lg p-4 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Completed</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className={`rounded-lg p-4 shadow-md ${stats.stale > 0 ? 'ring-2 ring-orange-400' : ''} ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-sm mb-1 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <AlertCircle className="w-3 h-3" />
              Stale (2+ days)
            </div>
            <div className={`text-2xl font-bold ${stats.stale > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
              {stats.stale}
            </div>
          </div>
          <div className={`rounded-lg p-4 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-sm mb-1 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Clock className="w-3 h-3" />
              Today's Time
            </div>
            <div className="text-2xl font-bold text-purple-600">{formatTime(stats.todayTimeSpent)}</div>
          </div>
          <div className={`rounded-lg p-4 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className={`text-sm mb-1 flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <Coffee className="w-3 h-3" />
              Breaks Today
            </div>
            <div className={`text-2xl font-bold ${activeBreak ? 'text-yellow-500 animate-pulse' : 'text-orange-500'}`}>
              {formatTime(getTotalBreakTime())}
            </div>
          </div>
        </div>

        {/* Currently Working On - In Progress Tasks */}
        {tasks.some(t => !t.completed && (t.isTimerRunning || t.timeSpent > 0)) && (
          <div className={`rounded-lg shadow-lg mb-6 border-2 ${
            darkMode 
              ? 'bg-gradient-to-r from-blue-900 to-purple-900 border-blue-500' 
              : 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-400'
          }`}>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <h3 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    📋 Currently Working On
                  </h3>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
                }`}>
                  {tasks.filter(t => !t.completed && (t.isTimerRunning || t.timeSpent > 0)).length} In Progress
                </div>
              </div>
              
              <div className="space-y-3">
                {tasks
                  .filter(t => !t.completed && (t.isTimerRunning || t.timeSpent > 0))
                  .sort((a, b) => {
                    // Sort: Active timers first, then by time spent (most recent work)
                    if (a.isTimerRunning && !b.isTimerRunning) return -1;
                    if (!a.isTimerRunning && b.isTimerRunning) return 1;
                    return b.timeSpent - a.timeSpent;
                  })
                  .map((task, index) => {
                    const typeInfo = getTaskTypeInfo(task.type);
                    const TypeIcon = typeInfo.icon;
                    const orgInfo = getOrgInfo(task.organization);
                    const elapsedTime = task.isTimerRunning ? getElapsedTime(task) : 0;
                    const hours = Math.floor(elapsedTime / 3600);
                    const mins = Math.floor((elapsedTime % 3600) / 60);
                    const secs = elapsedTime % 60;
                    
                    return (
                      <div 
                        key={task.id}
                        className={`p-4 rounded-lg border-l-4 ${
                          task.isTimerRunning
                            ? darkMode 
                              ? 'bg-gray-800/80 border-green-500' 
                              : 'bg-white border-green-400'
                            : darkMode
                              ? 'bg-gray-800/80 border-orange-500'
                              : 'bg-white border-orange-400'
                        } ${index > 0 ? 'mt-3' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <TypeIcon className="w-5 h-5 text-blue-600" />
                              <span className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {task.text}
                              </span>
                              {task.isTimerRunning && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold">
                                  <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                                  ACTIVE
                                </span>
                              )}
                              {!task.isTimerRunning && (
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  darkMode ? 'bg-orange-900 text-orange-200' : 'bg-orange-100 text-orange-700'
                                }`}>
                                  IN PROGRESS
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm">
                              <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Briefcase className="w-4 h-4" />
                                {orgInfo.label}
                              </span>
                              <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                {typeInfo.icon && <TypeIcon className="w-4 h-4" />}
                                {typeInfo.label}
                              </span>
                              <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                <Clock className="w-4 h-4" />
                                Total: {(task.timeSpent / 3600).toFixed(1)}h
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            {task.isTimerRunning ? (
                              <>
                                <div className="text-3xl font-bold font-mono text-green-600">
                                  {hours > 0 && `${hours}:`}{String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => pauseTimer(task.id)}
                                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition-colors"
                                  >
                                    ⏸ Pause
                                  </button>
                                  <button
                                    onClick={() => stopTimer(task.id)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                                  >
                                    ✓ Complete
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                  Paused
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startTimer(task.id)}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-colors"
                                  >
                                    ▶ Resume
                                  </button>
                                  <button
                                    onClick={() => stopTimer(task.id)}
                                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                                  >
                                    ✓ Complete
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
              
              <div className={`mt-3 text-sm flex items-center justify-between ${darkMode ? 'text-blue-200' : 'text-blue-800'}`}>
                <span>💡 All timers continue running even when you switch tabs or apps!</span>
                {tasks.filter(t => !t.completed && (t.isTimerRunning || t.timeSpent > 0)).length > 1 && (
                  <span className="font-semibold">
                    {tasks.filter(t => t.isTimerRunning).length} active • {tasks.filter(t => !t.completed && t.timeSpent > 0 && !t.isTimerRunning).length} paused
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar */}
        <div className="bg-white rounded-lg p-4 shadow-md mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Progress
            </div>
            <div className="text-sm font-bold text-indigo-600">{stats.completionRate}%</div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className={`rounded-lg shadow-md p-6 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Add New Task
            </h3>
            <button
              onClick={() => setShowOrgManager(true)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              <Edit2 className="w-4 h-4" />
              Manage Organizations
            </button>
          </div>

          <form onSubmit={addTask} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What do you need to accomplish today?"
                className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'border-gray-300'
                }`}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Task
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Organization Selector */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Organization/Project
                </label>
                <select
                  value={newTaskOrg}
                  onChange={(e) => setNewTaskOrg(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                >
                  <optgroup label="Work Organizations">
                    {organizations.filter(o => o.type === 'work').map(org => (
                      <option key={org.value} value={org.value}>
                        {org.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Personal Projects">
                    {organizations.filter(o => o.type === 'personal').map(org => (
                      <option key={org.value} value={org.value}>
                        {org.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Task Type Selector */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Task Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TASK_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setNewTaskType(type.value)}
                        className={getTypeButtonClasses(type.color, newTaskType === type.value)}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs font-medium truncate">{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Task Size Selector */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Estimated Size
                </label>
                <select
                  value={newTaskSize}
                  onChange={(e) => setNewTaskSize(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                >
                  {TASK_SIZES.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Scheduled Time (for meetings) */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Scheduled Time (optional - for meetings)
                </label>
                <input
                  type="time"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                />
                {newTaskTime && (
                  <div className={`mt-2 text-xs flex items-center gap-1 ${
                    darkMode ? 'text-green-400' : 'text-green-700'
                  }`}>
                    <span>⏱️</span>
                    <span>Timer will auto-start at {newTaskTime}</span>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => setShowMeetingTemplates(true)}
                className="mt-6 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Meeting Templates
              </button>
            </div>

            {/* Auto-Complete Settings (shown when scheduled time is set) */}
            {newTaskTime && (
              <div className={`p-4 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-blue-50 border-blue-200'}`}>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newTaskAutoComplete}
                      onChange={(e) => setNewTaskAutoComplete(e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      🔄 Auto-complete after duration
                    </span>
                  </label>
                  {newTaskAutoComplete && (
                    <div className="flex items-center gap-2">
                      <label className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Duration:</label>
                      <select
                        value={newTaskDuration}
                        onChange={(e) => setNewTaskDuration(Number(e.target.value))}
                        className={`px-3 py-1 border rounded-lg text-sm ${
                          darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                        }`}
                      >
                        <option value={15}>15 min</option>
                        <option value={30}>30 min</option>
                        <option value={45}>45 min</option>
                        <option value={60}>1 hour</option>
                        <option value={90}>1.5 hours</option>
                        <option value={120}>2 hours</option>
                      </select>
                    </div>
                  )}
                </div>
                {newTaskAutoComplete && (
                  <p className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    ✨ Task will start at {newTaskTime} and automatically complete after {newTaskDuration} minutes
                  </p>
                )}
              </div>
            )}

            {/* Priority, Tags, and Recurrence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Priority Selector */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Priority Level
                </label>
                <div className="flex gap-2">
                  {PRIORITY_LEVELS.map(priority => (
                    <button
                      key={priority.value}
                      type="button"
                      onClick={() => setNewTaskPriority(priority.value)}
                      className={`flex-1 px-3 py-2 rounded-lg border-2 transition-all text-sm font-medium ${
                        newTaskPriority === priority.value
                          ? priority.value === 'high' ? 'border-red-500 bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-200' :
                            priority.value === 'medium' ? 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' :
                            'border-green-500 bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : darkMode ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {priority.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags Multi-Select */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tags (select multiple)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTagManager(true)}
                    className={`text-xs px-2 py-1 rounded ${
                      darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    Manage
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableTags.slice(0, 4).map(tag => (
                    <label
                      key={tag.value}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border cursor-pointer transition-all text-xs ${
                        newTaskTags.includes(tag.value)
                          ? `border-${tag.color}-500 bg-${tag.color}-50 text-${tag.color}-700 dark:bg-${tag.color}-900 dark:text-${tag.color}-200`
                          : darkMode ? 'border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newTaskTags.includes(tag.value)}
                        onChange={() => toggleTaskTag(tag.value)}
                        className="w-3 h-3"
                      />
                      {tag.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Recurrence Selector */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Recurrence
                </label>
                <select
                  value={newTaskRecurrence}
                  onChange={(e) => setNewTaskRecurrence(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
                  }`}
                >
                  {RECURRENCE_PATTERNS.map(pattern => (
                    <option key={pattern.value} value={pattern.value}>
                      {pattern.label}
                    </option>
                  ))}
                </select>
                
                {/* Custom Days Selector - Shows when Custom is selected */}
                {newTaskRecurrence === 'custom' && (
                  <div className="mt-3">
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Select Days
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {DAYS_OF_WEEK.map(day => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => {
                            if (newTaskCustomDays.includes(day.value)) {
                              setNewTaskCustomDays(newTaskCustomDays.filter(d => d !== day.value));
                            } else {
                              setNewTaskCustomDays([...newTaskCustomDays, day.value].sort());
                            }
                          }}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            newTaskCustomDays.includes(day.value)
                              ? 'bg-blue-600 text-white'
                              : darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {day.label}
                        </button>
                      ))}
                    </div>
                    {newTaskCustomDays.length === 0 && (
                      <p className="text-sm text-red-500 mt-2">⚠️ Please select at least one day</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className={`rounded-lg shadow-md mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`flex ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                filter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                filter === 'active'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                filter === 'completed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>

        {/* Priority and Tag Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Priority Filter */}
          <div className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Filter by Priority
            </label>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            >
              <option value="all">All Priorities</option>
              {PRIORITY_LEVELS.map(p => (
                <option key={p.value} value={p.value}>
                  {p.icon} {p.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tag Filter */}
          <div className={`rounded-lg shadow-md p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Filter by Tag
            </label>
            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'border-gray-300'
              }`}
            >
              <option value="all">All Tags</option>
              {availableTags.map(tag => (
                <option key={tag.value} value={tag.value}>
                  {tag.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Standups & Meetings Section */}
        {filteredTasks.filter(t => isMeetingType(t.type) && !t.completed).length > 0 && (
          <div className={`rounded-lg shadow-md overflow-hidden mb-6 ${darkMode ? 'bg-gray-800 border-2 border-orange-600' : 'bg-white border-2 border-orange-300'}`}>
            <div className={`px-4 py-3 ${darkMode ? 'bg-orange-900/30 border-b border-orange-700' : 'bg-orange-50 border-b border-orange-200'}`}>
              <div className="flex items-center justify-between">
                <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  <Users className="w-5 h-5 text-orange-500" />
                  📅 Standups & Meetings
                </h3>
                <div className={`px-2 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'}`}>
                  {filteredTasks.filter(t => isMeetingType(t.type) && !t.completed).length} scheduled
                </div>
              </div>
            </div>
            <div className={darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}>
              {filteredTasks
                .filter(t => isMeetingType(t.type) && !t.completed)
                .sort((a, b) => {
                  // Sort by scheduled time first
                  if (a.scheduledTime && b.scheduledTime) {
                    return a.scheduledTime.localeCompare(b.scheduledTime);
                  }
                  if (a.scheduledTime) return -1;
                  if (b.scheduledTime) return 1;
                  return 0;
                })
                .map((task) => {
                  const elapsedTime = getElapsedTime(task);
                  const typeInfo = getTaskTypeInfo(task.type);
                  const TypeIcon = typeInfo.icon;
                  const orgInfo = getOrgInfo(task.organization);

                  return (
                    <div
                      key={task.id}
                      className={`p-4 transition-colors group ${
                        darkMode ? 'hover:bg-gray-750' : 'hover:bg-orange-50/50'
                      } ${
                        task.isTimerRunning
                          ? 'border-l-4 border-green-500 bg-green-50/50 dark:bg-green-900/20'
                          : task.timeSpent > 0
                            ? 'border-l-4 border-orange-500'
                            : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleTask(task.id)}
                          className={`flex-shrink-0 ${darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'}`}
                        >
                          <Circle className="w-6 h-6" />
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {task.type === 'standup' ? '🧍' : '👥'} {task.text}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                              task.type === 'standup' 
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200'
                                : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                            }`}>
                              <TypeIcon className="w-3 h-3" />
                              {typeInfo.label}
                            </span>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {orgInfo.label}
                            </span>
                            {task.scheduledTime && (
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                                task.isTimerRunning
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 animate-pulse'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                              }`}>
                                ⏰ {task.scheduledTime}
                                {task.autoComplete && task.durationMinutes && ` (${task.durationMinutes}min)`}
                              </span>
                            )}
                            {task.isTimerRunning && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                🔴 LIVE - {formatTime(elapsedTime)}
                              </span>
                            )}
                            {!task.isTimerRunning && task.timeSpent > 0 && (
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                ⏱️ {formatTime(task.timeSpent)}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Timer Controls */}
                        <div className="flex items-center gap-1">
                          {!task.isTimerRunning ? (
                            <button
                              onClick={() => startTimer(task.id)}
                              className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                              title="Start Timer"
                            >
                              <Play className="w-5 h-5" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => pauseTimer(task.id)}
                                className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900 rounded-lg transition-colors"
                                title="Pause Timer"
                              >
                                <Pause className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => stopTimer(task.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                                title="Complete"
                              >
                                <Square className="w-5 h-5" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className={`flex-shrink-0 p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                              darkMode ? 'text-gray-500 hover:text-red-400 hover:bg-gray-700' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                            }`}
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Task List (excluding meetings/standups, completed, and in-progress tasks) */}
        <div className={`rounded-lg shadow-md overflow-hidden mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`px-4 py-3 ${darkMode ? 'bg-gray-700 border-b border-gray-600' : 'bg-gray-50 border-b border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                📋 Tasks
              </h3>
              <div className={`px-2 py-1 rounded-full text-xs font-bold ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
                {filteredTasks.filter(t => !isMeetingType(t.type) && !t.completed && !t.isTimerRunning && !t.timeSpent && !t.timerStartedAt && (!t.sessions || t.sessions.length === 0)).length} pending
              </div>
            </div>
          </div>
          {filteredTasks.filter(t => !isMeetingType(t.type) && !t.completed && !t.isTimerRunning && !t.timeSpent && !t.timerStartedAt && (!t.sessions || t.sessions.length === 0)).length === 0 ? (
            <div className={`p-12 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {filter === 'all' && 'No tasks yet. Add your first task above!'}
              {filter === 'active' && 'No pending tasks. Great job! 🎉'}
              {filter === 'completed' && 'No completed tasks yet. Keep going!'}
            </div>
          ) : (
            <div className={darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}>
              {filteredTasks.filter(t => !isMeetingType(t.type) && !t.completed && !t.isTimerRunning && !t.timeSpent && !t.timerStartedAt && (!t.sessions || t.sessions.length === 0)).map((task) => {
                const elapsedTime = getElapsedTime(task);
                const taskAge = getTaskAge(task);
                const isStale = isTaskStale(task);
                const timeComparison = getTimeComparison(task);
                const typeInfo = getTaskTypeInfo(task.type);
                const sizeInfo = getTaskSizeInfo(task.size);
                const TypeIcon = typeInfo.icon;

                return (
                  <div
                    key={task.id}
                    className={`p-4 transition-colors group ${
                      darkMode ? 'hover:bg-gray-750' : 'hover:bg-gray-50'
                    } ${
                      task.completed 
                        ? ''
                        : task.isTimerRunning
                          ? 'border-l-4 border-green-500'
                          : task.timeSpent > 0
                            ? 'border-l-4 border-orange-500'
                            : 'border-l-4 border-gray-300'
                    } ${
                      isStale && !task.completed ? (darkMode ? 'bg-orange-900/20 border-l-4 border-orange-600' : 'bg-orange-50 border-l-4 border-orange-400') : ''
                    }`}
                  >
                    {/* Stale Task Warning */}
                    {isStale && (
                      <div className={`mb-3 flex items-center gap-2 text-sm font-medium ${
                        darkMode ? 'text-orange-400' : 'text-orange-700'
                      }`}>
                        <AlertCircle className="w-4 h-4" />
                        <span>Open for {Math.floor(taskAge)} days - Consider breaking down or closing</span>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className={`flex-shrink-0 transition-colors mt-1 ${
                          darkMode ? 'text-gray-500 hover:text-blue-400' : 'text-gray-400 hover:text-blue-600'
                        }`}
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                        ) : (
                          <Circle className="w-6 h-6" />
                        )}
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        {/* Task Title and Badges */}
                        <div className="flex items-start gap-2 mb-2 flex-wrap">
                          <span
                            className={`text-lg ${
                              task.completed
                                ? darkMode ? 'line-through text-gray-500' : 'line-through text-gray-400'
                                : darkMode ? 'text-white' : 'text-gray-800'
                            }`}
                          >
                            {task.text}
                          </span>
                          {/* Status Badge: In Progress or Not Started */}
                          {!task.completed && (
                            <>
                              {(task.isTimerRunning || task.timeSpent > 0) ? (
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                                  task.isTimerRunning
                                    ? 'bg-green-100 text-green-800 border border-green-300'
                                    : darkMode
                                      ? 'bg-orange-900 text-orange-200 border border-orange-700'
                                      : 'bg-orange-100 text-orange-700 border border-orange-300'
                                }`}>
                                  {task.isTimerRunning ? (
                                    <>
                                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                                      ACTIVE
                                    </>
                                  ) : (
                                    <>IN PROGRESS</>
                                  )}
                                </span>
                              ) : (
                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                  darkMode
                                    ? 'bg-gray-700 text-gray-300 border border-gray-600'
                                    : 'bg-gray-100 text-gray-600 border border-gray-300'
                                }`}>
                                  NOT STARTED
                                </span>
                              )}
                            </>
                          )}
                        </div>

                        {/* Badges Row */}
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {/* Organization Badge */}
                          {task.organization && (
                            <span className={getOrgBadgeClasses(getOrgInfo(task.organization).color)}>
                              {(() => {
                                const OrgIcon = getOrgInfo(task.organization).icon;
                                return <OrgIcon className="w-3 h-3" />;
                              })()}
                              {getOrgInfo(task.organization).label}
                            </span>
                          )}
                          
                          {/* Type Badge */}
                          <span className={getTypeBadgeClasses(typeInfo.color)}>
                            <TypeIcon className="w-3 h-3" />
                            {typeInfo.label}
                          </span>
                          
                          {/* Size Badge */}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {sizeInfo.label.split(' ')[0]}
                          </span>

                          {/* Priority Badge */}
                          {task.priority && (
                            <span className={getPriorityBadgeClasses(task.priority)}>
                              {PRIORITY_LEVELS.find(p => p.value === task.priority)?.icon}
                              {PRIORITY_LEVELS.find(p => p.value === task.priority)?.label.split(' ')[0]}
                            </span>
                          )}

                          {/* Tag Badges */}
                          {task.tags && task.tags.length > 0 && (
                            <>
                              {task.tags.slice(0, 2).map(tagValue => {
                                const tag = availableTags.find(t => t.value === tagValue);
                                if (!tag) return null;
                                return (
                                  <span key={tagValue} className={getTagBadgeClasses(tag.color)}>
                                    {tag.label}
                                  </span>
                                );
                              })}
                              {task.tags.length > 2 && (
                                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  +{task.tags.length - 2} more
                                </span>
                              )}
                            </>
                          )}

                          {/* Recurrence Indicator */}
                          {task.recurrence && task.recurrence !== 'none' && (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                              darkMode ? 'bg-blue-900 text-blue-200 border border-blue-700' : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              🔄 {task.recurrence === 'custom' && task.customDays
                                ? `Custom (${task.customDays.map(d => DAYS_OF_WEEK.find(day => day.value === d)?.label).join(', ')})`
                                : RECURRENCE_PATTERNS.find(r => r.value === task.recurrence)?.label.split(' (')[0]
                              }
                            </span>
                          )}
                        </div>
                        
                        {/* Time Info */}
                        <div className="space-y-1">
                          {/* Current Timer */}
                          <div className="flex items-center gap-2">
                            <Clock className={`w-4 h-4 ${task.isTimerRunning ? 'text-green-600' : 'text-gray-400'}`} />
                            <span className={`text-sm font-mono ${
                              task.isTimerRunning ? 'text-green-600 font-semibold' : 'text-gray-600'
                            }`}>
                              {formatTime(elapsedTime)}
                            </span>
                            {task.isTimerRunning && (
                              <span className="inline-block w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                            )}
                            {task.scheduledTime && !task.completed && (
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                                darkMode 
                                  ? 'bg-orange-900 text-orange-200 border border-orange-700'
                                  : 'bg-orange-100 text-orange-700'
                              }`} title="Timer will auto-start at this time">
                                📅 {task.scheduledTime} ⏱️
                              </span>
                            )}
                            {task.scheduledTime && task.completed && (
                              <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${
                                darkMode 
                                  ? 'bg-gray-700 text-gray-400'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                📅 {task.scheduledTime}
                              </span>
                            )}
                          </div>

                          {/* Estimated vs Actual */}
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-gray-500">
                              Est: {sizeInfo.hours}h
                            </span>
                            <span className="text-gray-400">|</span>
                            <span className={`font-medium ${
                              timeComparison.overBudget ? 'text-red-600' : 'text-gray-600'
                            }`}>
                              Actual: {timeComparison.actual.toFixed(1)}h
                            </span>
                            {timeComparison.estimated > 0 && (
                              <>
                                <span className="text-gray-400">|</span>
                                <span className={`font-medium ${
                                  timeComparison.percentage > 100 ? 'text-red-600' : 
                                  timeComparison.percentage > 80 ? 'text-orange-600' : 
                                  'text-green-600'
                                }`}>
                                  {timeComparison.percentage.toFixed(0)}%
                                </span>
                              </>
                            )}
                          </div>

                          {/* Progress Bar for Time Budget */}
                          {timeComparison.estimated > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full transition-all ${
                                  timeComparison.percentage > 100 ? 'bg-red-500' :
                                  timeComparison.percentage > 80 ? 'bg-orange-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(timeComparison.percentage, 100)}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Timer Controls */}
                      {!task.completed && (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!task.isTimerRunning ? (
                            <>
                              <button
                                onClick={() => startTimer(task.id)}
                                className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors"
                                title="Start Timer"
                              >
                                <Play className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => startPomodoro(task.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                                title="Start Pomodoro with this task"
                              >
                                🍅
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => pauseTimer(task.id)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900 rounded-lg transition-colors"
                              title="Pause Timer"
                            >
                              <Pause className="w-5 h-5" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => stopTimer(task.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                            title="Complete Task"
                          >
                            <Square className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {/* Notes Button */}
                      <button
                        onClick={() => setEditingTaskNotes(task.id)}
                        className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                          task.notes 
                            ? darkMode ? 'text-blue-400 hover:bg-blue-900' : 'text-blue-600 hover:bg-blue-50'
                            : darkMode ? 'text-gray-500 hover:bg-gray-700' : 'text-gray-400 hover:bg-gray-50'
                        }`}
                        title={task.notes ? 'Edit notes' : 'Add notes'}
                      >
                        📝
                      </button>

                      {/* Quality Rating Button */}
                      {task.completed && (
                        <button
                          onClick={() => setSelectedTaskForRating(task.id)}
                          className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                            task.qualityRating === 'unrated'
                              ? 'text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900 animate-pulse'
                              : 'text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900'
                          }`}
                          title={task.qualityRating === 'unrated' ? 'Rate Quality' : 'Update Rating'}
                        >
                          <Award className="w-5 h-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className={`flex-shrink-0 transition-colors opacity-0 group-hover:opacity-100 ${
                          darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                        }`}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Task Notes Display */}
                    {task.notes && editingTaskNotes !== task.id && (
                      <div className={`mt-3 p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-200'
                      }`}>
                        <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          📝 Notes:
                        </div>
                        <div className={`text-sm whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {task.notes}
                        </div>
                      </div>
                    )}

                    {/* Task Notes Editor */}
                    {editingTaskNotes === task.id && (
                      <div className={`mt-3 p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700 border-2 border-blue-500' : 'bg-blue-50 border-2 border-blue-400'
                      }`}>
                        <div className={`text-xs font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          📝 Task Notes:
                        </div>
                        <textarea
                          defaultValue={task.notes || ''}
                          placeholder="Add context, links, debugging notes, etc..."
                          className={`w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'border-gray-300'
                          }`}
                          rows={4}
                          onKeyDown={(e) => {
                            if (e.key === 'Escape') {
                              setEditingTaskNotes(null);
                            }
                            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                              updateTaskNotes(task.id, e.target.value);
                            }
                          }}
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              const textarea = e.target.parentElement.previousElementSibling;
                              updateTaskNotes(task.id, textarea.value);
                            }}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingTaskNotes(null)}
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              darkMode ? 'bg-gray-600 hover:bg-gray-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                        <div className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Press Cmd/Ctrl + Enter to save, Esc to cancel
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Organization Filter */}
        <div className={`rounded-lg shadow-md mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`p-4 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
            <h3 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Filter by Organization/Project
            </h3>
            
            <div className="space-y-3">
              {/* All Organizations */}
              <button
                onClick={() => setOrgFilter('all')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                  orgFilter === 'all'
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'hover:bg-gray-50 text-gray-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>All Organizations</span>
                  <span className="text-sm text-gray-500">{stats.total} tasks</span>
                </div>
              </button>

              {/* Work Organizations */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                  Work Organizations
                </div>
                <div className="space-y-1">
                  {orgStats.filter(o => o.type === 'work').map(org => {
                    const OrgIcon = org.icon;
                    return (
                      <button
                        key={org.org}
                        onClick={() => setOrgFilter(org.org)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          orgFilter === org.org
                            ? 'bg-blue-50 text-blue-900 font-semibold border-l-4 border-blue-600'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <OrgIcon className="w-4 h-4" />
                            <span>{org.label}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500">{org.active} active</span>
                            <span className="text-green-600">{org.completed} done</span>
                            {org.stale > 0 && (
                              <span className="text-orange-600 font-semibold">{org.stale} stale</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Personal Projects */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
                  Personal Projects (Spare Time)
                </div>
                <div className="space-y-1">
                  {orgStats.filter(o => o.type === 'personal').map(org => {
                    const OrgIcon = org.icon;
                    return (
                      <button
                        key={org.org}
                        onClick={() => setOrgFilter(org.org)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          orgFilter === org.org
                            ? 'bg-purple-50 text-purple-900 font-semibold border-l-4 border-purple-600'
                            : 'hover:bg-gray-50 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <OrgIcon className="w-4 h-4" />
                            <span>{org.label}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-gray-500">{org.active} active</span>
                            <span className="text-green-600">{org.completed} done</span>
                            {org.stale > 0 && (
                              <span className="text-orange-600 font-semibold">{org.stale} stale</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Clear Completed Button */}
        {stats.completed > 0 && (
          <div className="text-center">
            <button
              onClick={clearCompleted}
              className={`font-medium transition-colors ${
                darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-600 hover:text-red-600'
              }`}
            >
              Clear {stats.completed} completed task{stats.completed !== 1 ? 's' : ''}
            </button>
          </div>
        )}

        {/* Completed Tasks Section - Above Organization Overview */}
        {/* Only show completed tasks that were actually started (timeSpent > 0) */}
        {tasks.filter(t => t.completed && t.timeSpent > 0).length > 0 && (
          <div className={`rounded-lg shadow-md p-6 mt-8 mb-6 ${darkMode ? 'bg-gray-800 border-2 border-green-700' : 'bg-white border-2 border-green-200'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                Completed Tasks
              </h3>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
              }`}>
                {tasks.filter(t => t.completed && t.timeSpent > 0).length} Completed
              </div>
            </div>
            
            <div className={`space-y-2 max-h-96 overflow-y-auto ${darkMode ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'}`}>
              {tasks
                .filter(t => t.completed && t.timeSpent > 0)
                .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
                .map(task => {
                  const typeInfo = getTaskTypeInfo(task.type);
                  const TypeIcon = typeInfo.icon;
                  const orgInfo = getOrgInfo(task.organization);
                  
                  return (
                    <div key={task.id} className="py-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium ${darkMode ? 'text-gray-400 line-through' : 'text-gray-500 line-through'}`}>
                            {task.text}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm">
                            <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              <TypeIcon className="w-3 h-3" />
                              {typeInfo.label}
                            </span>
                            <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                              <Briefcase className="w-3 h-3" />
                              {orgInfo.label}
                            </span>
                            {task.timeSpent > 0 && (
                              <span className={`flex items-center gap-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                <Clock className="w-3 h-3" />
                                {(task.timeSpent / 3600).toFixed(1)}h
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className={`flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                            darkMode ? 'text-gray-500 hover:text-red-400' : 'text-gray-400 hover:text-red-600'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            
            <div className="mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}">
              <button
                onClick={clearCompleted}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  darkMode 
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                🗑️ Clear All {stats.completed} Completed Task{stats.completed !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        )}

        {/* Organization Overview - At Bottom */}
        <div className={`rounded-lg shadow-md p-6 mt-8 mb-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Briefcase className="w-5 h-5" />
            Organization Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Work Organizations */}
            <div>
              <div className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Work Organizations
              </div>
              <div className="space-y-3">
                {orgStats.filter(o => o.type === 'work').map(org => (
                  <div key={org.org} className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-blue-900/30' : 'bg-blue-50'
                  }`}>
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {org.label}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {org.active} active • {org.completed} completed
                        {org.stale > 0 && <span className="text-orange-600 font-semibold"> • {org.stale} stale</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Time</div>
                      <div className="font-semibold text-blue-600">{formatTime(org.timeSpent)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Projects */}
            <div>
              <div className={`text-sm font-semibold uppercase tracking-wider mb-3 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Personal Projects (Spare Time)
              </div>
              <div className="space-y-3">
                {orgStats.filter(o => o.type === 'personal').map(org => (
                  <div key={org.org} className={`flex items-center justify-between p-3 rounded-lg ${
                    darkMode ? 'bg-purple-900/30' : 'bg-purple-50'
                  }`}>
                    <div>
                      <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {org.label}
                      </div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {org.active} active • {org.completed} completed
                        {org.stale > 0 && <span className="text-orange-600 font-semibold"> • {org.stale} stale</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>Time</div>
                      <div className="font-semibold text-purple-600">{formatTime(org.timeSpent)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
          </div>
        )}

        {/* Quality Rating Modal */}
        {selectedTaskForRating && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Rate Task Quality</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Task:</p>
                <p className="font-medium text-gray-800">{tasks.find(t => t.id === selectedTaskForRating)?.text}</p>
              </div>

              <div className="space-y-2 mb-6">
                {QUALITY_RATINGS.filter(r => r.value !== 'unrated').map(rating => (
                  <button
                    key={rating.value}
                    onClick={() => rateTaskQuality(selectedTaskForRating, rating.value)}
                    className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                      rating.score >= 4 ? 'border-green-300 hover:bg-green-50' :
                      rating.score >= 3 ? 'border-blue-300 hover:bg-blue-50' :
                      'border-orange-300 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{rating.label.split(' -')[0]}</div>
                        <div className="text-sm text-gray-600">{rating.label.split(' - ')[1]}</div>
                      </div>
                      <div className="text-2xl font-bold text-gray-400">{rating.score}/5</div>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={() => setSelectedTaskForRating(null)}
                className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Meeting Templates Modal */}
        {showMeetingTemplates && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg shadow-xl max-w-2xl w-full p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  📅 Meeting Templates
                </h3>
                <button
                  onClick={() => setShowMeetingTemplates(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  ✕
                </button>
              </div>

              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Quick add common meetings to your schedule. Selected organization: <strong className={darkMode ? 'text-white' : ''}>{getOrgInfo(newTaskOrg).label}</strong>
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MEETING_TEMPLATES.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => addMeetingFromTemplate(template)}
                    className={`p-4 border-2 rounded-lg transition-all text-left ${
                      darkMode 
                        ? 'border-gray-600 hover:border-orange-500 hover:bg-gray-700'
                        : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {template.label}
                      </div>
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <div>🕐 {template.time}</div>
                      <div>⏱️ {template.duration}h duration</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className={`mt-4 rounded-lg p-3 text-sm ${
                darkMode 
                  ? 'bg-blue-900 border border-blue-700 text-blue-200'
                  : 'bg-blue-50 border border-blue-200 text-blue-900'
              }`}>
                <strong>💡 Tip:</strong> Meetings are tracked separately in analytics. They count toward your work hours but are highlighted as meetings.
              </div>
            </div>
          </div>
        )}

        {/* Organization Manager Modal */}
        {showOrgManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 my-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">🏢 Manage Organizations</h3>
                <button
                  onClick={() => setShowOrgManager(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Add New Organization */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Add New Organization</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={newOrgData.label}
                    onChange={(e) => setNewOrgData({...newOrgData, label: e.target.value})}
                    placeholder="Organization name"
                    className="md:col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <select
                    value={newOrgData.type}
                    onChange={(e) => setNewOrgData({...newOrgData, type: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                  </select>
                  <select
                    value={newOrgData.color}
                    onChange={(e) => setNewOrgData({...newOrgData, color: e.target.value})}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="blue">Blue</option>
                    <option value="indigo">Indigo</option>
                    <option value="cyan">Cyan</option>
                    <option value="purple">Purple</option>
                    <option value="pink">Pink</option>
                    <option value="emerald">Emerald</option>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                    <option value="red">Red</option>
                    <option value="yellow">Yellow</option>
                  </select>
                </div>
                <button
                  onClick={addOrganization}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Organization
                </button>
              </div>

              {/* Existing Organizations */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800">Your Organizations</h4>
                  <button
                    onClick={resetOrganizations}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    Reset to Defaults
                  </button>
                </div>

                <div className="space-y-2">
                  {organizations.map(org => (
                    <div key={org.value} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {React.createElement(org.icon, { className: "w-5 h-5 text-gray-600" })}
                        <div>
                          <div className="font-medium text-gray-900">{org.label}</div>
                          <div className="text-sm text-gray-600">
                            {org.type === 'work' ? 'Work' : 'Personal'} • {org.color}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={getOrgBadgeClasses(org.color)}>
                          Preview
                        </span>
                        <button
                          onClick={() => deleteOrganization(org.value)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-900">
                  <strong>⚠️ Note:</strong> Deleting an organization won't delete your tasks. 
                  Tasks from deleted organizations will show as "unassigned" in reports.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tag Manager Modal */}
        {showTagManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className={`rounded-lg shadow-xl max-w-3xl w-full p-6 my-8 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  🏷️ Manage Tags
                </h3>
                <button
                  onClick={() => setShowTagManager(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  ✕
                </button>
              </div>

              {/* Add New Tag */}
              <div className={`rounded-lg p-4 mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Add New Tag
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newTagData.label}
                    onChange={(e) => setNewTagData({...newTagData, label: e.target.value})}
                    placeholder="Tag name (e.g., High Priority)"
                    className={`md:col-span-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white placeholder-gray-400' : 'border-gray-300'
                    }`}
                  />
                  <select
                    value={newTagData.color}
                    onChange={(e) => setNewTagData({...newTagData, color: e.target.value})}
                    className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-600 border-gray-500 text-white' : 'border-gray-300'
                    }`}
                  >
                    <option value="blue">Blue</option>
                    <option value="red">Red</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Purple</option>
                    <option value="green">Green</option>
                    <option value="gray">Gray</option>
                  </select>
                </div>
                <button
                  onClick={addTag}
                  className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Tag
                </button>
              </div>

              {/* Existing Tags */}
              <div>
                <h4 className={`font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  Your Tags
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableTags.map(tag => (
                    <div 
                      key={tag.value} 
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-${tag.color}-500`}></div>
                        <span className={darkMode ? 'text-white' : 'text-gray-900'}>
                          {tag.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={getTagBadgeClasses(tag.color)}>
                          Preview
                        </span>
                        <button
                          onClick={() => deleteTag(tag.value)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`mt-6 rounded-lg p-4 ${
                darkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                  <strong>💡 Pro Tip:</strong> Tags help you categorize tasks across organizations. 
                  Use "Urgent" for time-sensitive work, "Blocked" for tasks waiting on others, 
                  "Review Needed" for code reviews, etc.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Changelog/Work Summary Modal */}
        {showChangelog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full p-6 my-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">📋 Work Summary & Changelog</h3>
                <button
                  onClick={() => setShowChangelog(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Format and Date Range Selectors */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                  <select
                    value={changelogFormat}
                    onChange={(e) => setChangelogFormat(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="standup">Daily Standup (Simple)</option>
                    <option value="markdown">Markdown</option>
                    <option value="jira">JIRA Format</option>
                    <option value="email">Email Format</option>
                    <option value="detailed">Detailed Report</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <select
                    value={changelogDateRange}
                    onChange={(e) => setChangelogDateRange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">This Week</option>
                    <option value="last-week">Last Week</option>
                    <option value="month">This Month</option>
                  </select>
                </div>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {getTasksForChangelog(changelogDateRange).length}
                  </div>
                  <div className="text-sm text-gray-600">Tasks Completed</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {formatTime(getTasksForChangelog(changelogDateRange).reduce((sum, t) => sum + getElapsedTime(t), 0))}
                  </div>
                  <div className="text-sm text-gray-600">Total Time</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {new Set(getTasksForChangelog(changelogDateRange).map(t => t.organization)).size}
                  </div>
                  <div className="text-sm text-gray-600">Organizations</div>
                </div>
              </div>

              {/* Generated Changelog Preview */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-800">Preview</h4>
                  <button
                    onClick={() => copyToClipboard(generateChangelog(changelogFormat, changelogDateRange))}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    📋 Copy to Clipboard
                  </button>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {generateChangelog(changelogFormat, changelogDateRange) || 'No completed tasks in this period.'}
                </div>
              </div>

              {/* Format Descriptions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Format Guide</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <div><strong>Daily Standup:</strong> Quick summary for team standup meetings</div>
                  <div><strong>Markdown:</strong> Formatted for GitHub, Notion, or documentation</div>
                  <div><strong>JIRA:</strong> JIRA-compatible markup for issue updates</div>
                  <div><strong>Email:</strong> Professional email format for manager updates</div>
                  <div><strong>Detailed Report:</strong> Comprehensive report with metrics and estimates</div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="text-sm text-yellow-900">
                  <strong>💡 Tip:</strong> Completed tasks are kept visible for 7 days before auto-archiving. 
                  Generate your weekly summary on Friday to capture all your work!
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pomodoro Timer Widget */}
        {showPomodoro && (
          <div className="fixed bottom-6 right-6 z-40">
            <div className={`rounded-lg shadow-2xl p-6 w-80 ${
              darkMode ? 'bg-gray-800 border-2 border-gray-700' : 'bg-white border-2 border-gray-200'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`font-bold text-lg flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  🍅 Pomodoro
                </h3>
                <button
                  onClick={() => setShowPomodoro(false)}
                  className={`text-sm ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  ✕
                </button>
              </div>

              {/* Mode Badge */}
              <div className="mb-4 text-center">
                <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  pomodoroMode === 'focus' 
                    ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                    : pomodoroMode === 'shortBreak'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                      : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {pomodoroMode === 'focus' ? '🎯 Focus Time' : 
                   pomodoroMode === 'shortBreak' ? '☕ Short Break' : 
                   '🌟 Long Break'}
                </span>
              </div>

              {/* Timer Display */}
              <div className={`text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <div className="text-5xl font-bold font-mono">
                  {formatPomodoroTime(pomodoroTime)}
                </div>
                <div className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Session {pomodoroSessions + 1} • {POMODORO_SETTINGS.focus} min focus
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => pomodoroRunning ? pausePomodoro() : startPomodoro()}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    pomodoroRunning
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {pomodoroRunning ? '⏸ Pause' : '▶ Start'}
                </button>
                <button
                  onClick={resetPomodoro}
                  className="px-4 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                >
                  ↻ Reset
                </button>
                <button
                  onClick={skipPomodoroPhase}
                  className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                  title="Skip to next phase"
                >
                  ⏭
                </button>
              </div>

              {/* Active Task */}
              {activePomodoroTask && (
                <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                  <div className={`text-xs font-semibold mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Working on:
                  </div>
                  <div className={`text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    {tasks.find(t => t.id === activePomodoroTask)?.text}
                  </div>
                </div>
              )}

              {/* Settings */}
              <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div>Focus: {POMODORO_SETTINGS.focus} min</div>
                  <div>Short break: {POMODORO_SETTINGS.shortBreak} min</div>
                  <div>Long break: {POMODORO_SETTINGS.longBreak} min</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Modal */}
        {showKeyboardShortcuts && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg shadow-xl max-w-2xl w-full p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  ⌨️ Keyboard Shortcuts
                </h3>
                <button
                  onClick={() => setShowKeyboardShortcuts(false)}
                  className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-50'
                    }`}
                  >
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {shortcut.description}
                    </span>
                    <kbd className={`px-3 py-1 rounded font-mono text-sm font-semibold ${
                      darkMode 
                        ? 'bg-gray-600 text-white border border-gray-500'
                        : 'bg-white text-gray-800 border border-gray-300 shadow-sm'
                    }`}>
                      {shortcut.key}
                    </kbd>
                  </div>
                ))}
              </div>

              <div className={`mt-6 p-4 rounded-lg ${
                darkMode ? 'bg-blue-900 border border-blue-700' : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-900'}`}>
                  <strong>💡 Pro Tip:</strong> These shortcuts work when you're not typing in an input field. 
                  Press <kbd className="px-2 py-1 bg-blue-100 dark:bg-blue-800 rounded text-xs font-mono">Esc</kbd> to close any modal or cancel input.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Storage Manager Modal */}
        {showStorageManager && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 my-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Storage Manager</h3>
                <button
                  onClick={() => setShowStorageManager(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Storage Usage */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Storage Usage</span>
                  <span className="text-sm text-gray-600">
                    {formatBytes(storageInfo.used)} / {formatBytes(storageInfo.limit)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all ${
                      storageInfo.percentage > 80 ? 'bg-red-600' :
                      storageInfo.percentage > 60 ? 'bg-orange-600' :
                      'bg-green-600'
                    }`}
                    style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
                  ></div>
                </div>
                <div className="text-center mt-2">
                  <span className={`text-2xl font-bold ${
                    storageInfo.percentage > 80 ? 'text-red-600' :
                    storageInfo.percentage > 60 ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {Math.round(storageInfo.percentage)}%
                  </span>
                </div>
              </div>

              {/* Storage Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-3">Storage Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active Tasks ({storageInfo.taskCount})</span>
                    <span className="font-medium">{formatBytes(storageInfo.tasksSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Archived Tasks ({storageInfo.archivedCount})</span>
                    <span className="font-medium">{formatBytes(storageInfo.archivedSize)}</span>
                  </div>
                </div>
              </div>

              {/* Warning if space is low */}
              {storageInfo.percentage > 80 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-red-900 mb-1">Storage Almost Full!</div>
                      <div className="text-sm text-red-700">
                        You're using {Math.round(storageInfo.percentage)}% of available storage. 
                        Consider exporting your data and clearing old tasks.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Data Management</h4>
                  
                  {/* Export Data */}
                  <button
                    onClick={exportData}
                    className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors mb-2 flex items-center justify-center gap-2"
                  >
                    📥 Export All Data (Backup)
                  </button>
                  <p className="text-xs text-gray-600 mb-4">
                    Downloads a JSON file with all your tasks and archived data. Keep this as a backup!
                  </p>

                  {/* Import Data */}
                  <label className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors cursor-pointer flex items-center justify-center gap-2">
                    📤 Import Data (Restore)
                    <input
                      type="file"
                      accept=".json"
                      onChange={importData}
                      className="hidden"
                    />
                  </label>
                  <p className="text-xs text-gray-600 mb-4 mt-2">
                    Restore from a previously exported backup file.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Cleanup Options</h4>
                  
                  {/* Archive Completed */}
                  <button
                    onClick={manualArchiveCompleted}
                    className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors mb-2"
                  >
                    📦 Archive All Completed Tasks
                  </button>
                  <p className="text-xs text-gray-600 mb-4">
                    Moves completed tasks to archive. They're still saved but won't appear in main view.
                  </p>

                  {/* Clear Old Archived */}
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => clearOldArchivedTasks(90)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      Clear Archive (90+ days)
                    </button>
                    <button
                      onClick={() => clearOldArchivedTasks(180)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      Clear Archive (180+ days)
                    </button>
                  </div>
                  <p className="text-xs text-gray-600 mb-4">
                    Permanently delete old archived tasks. Use after exporting!
                  </p>

                  {/* Clear All Archive */}
                  <button
                    onClick={clearArchivedTasks}
                    className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    🗑️ Clear All Archived Tasks ({archivedTasks.length})
                  </button>
                  <p className="text-xs text-gray-600 mt-2">
                    Permanently deletes all archived tasks. Make sure to export first!
                  </p>
                </div>
              </div>

              {/* Auto-archive info */}
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-sm text-blue-900">
                  <strong>💡 Auto-Archive:</strong> Completed tasks older than 7 days are automatically 
                  moved to archive to save space. This keeps your recent work visible for weekly summaries 
                  while managing storage efficiently. Archive is included in productivity metrics but hidden from main view.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}