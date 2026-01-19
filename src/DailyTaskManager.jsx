import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Circle, Trash2, Plus, TrendingUp, Play, Pause, Square, Clock, Bell, AlertCircle, Code, Bug, Wrench, Briefcase, Coffee, BookOpen, Target, Award, TrendingDown, Zap } from 'lucide-react';

const TASK_TYPES = [
  { value: 'feature', label: 'Feature Development', icon: Code, color: 'blue' },
  { value: 'bug', label: 'Bug Fix', icon: Bug, color: 'red' },
  { value: 'support', label: 'Support/Small Task', icon: Wrench, color: 'green' },
  { value: 'learning', label: 'Learning/Upskilling', icon: BookOpen, color: 'purple' }
];

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

const ORGANIZATIONS = [
  { value: 'webafrica', label: 'Web Africa', icon: Briefcase, color: 'blue', type: 'work' },
  { value: 'lexisnexis', label: 'LexisNexis', icon: Briefcase, color: 'indigo', type: 'work' },
  { value: 'bhukuveni', label: 'Bhukuveni', icon: Coffee, color: 'purple', type: 'personal' },
  { value: 'khoi', label: 'Khoi', icon: Coffee, color: 'pink', type: 'personal' },
  { value: 'nowmail', label: 'Nowmail', icon: Coffee, color: 'emerald', type: 'personal' }
];

export default function DailyTaskManager() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskType, setNewTaskType] = useState('feature');
  const [newTaskSize, setNewTaskSize] = useState('m');
  const [newTaskOrg, setNewTaskOrg] = useState('webafrica');
  const [filter, setFilter] = useState('all');
  const [orgFilter, setOrgFilter] = useState('all'); // Filter by organization
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [morningReminderTime, setMorningReminderTime] = useState('09:00');
  const [showProductivity, setShowProductivity] = useState(false);
  const [selectedTaskForRating, setSelectedTaskForRating] = useState(null);
  const timerRef = useRef(null);
  const notificationCheckRef = useRef(null);

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('dailyTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }

    const savedReminderTime = localStorage.getItem('morningReminderTime');
    if (savedReminderTime) {
      setMorningReminderTime(savedReminderTime);
    }

    // Check notification permission
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Save reminder time
  useEffect(() => {
    localStorage.setItem('morningReminderTime', morningReminderTime);
  }, [morningReminderTime]);

  // Update current time every second for active timers
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
        estimatedHours: sizeData.hours,
        completed: false,
        qualityRating: 'unrated',
        createdAt: new Date().toISOString(),
        completedAt: null,
        timeSpent: 0,
        isTimerRunning: false,
        timerStartedAt: null,
        sessions: []
      };
      setTasks([task, ...tasks]);
      setNewTask('');
      setNewTaskSize('m');
    }
  };

  const rateTaskQuality = (taskId, rating) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, qualityRating: rating } : task
    ));
    setSelectedTaskForRating(null);
  };

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
      } else {
        // Pause any other running timers
        if (task.isTimerRunning) {
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
      }
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
    return ORGANIZATIONS.find(o => o.value === orgValue) || ORGANIZATIONS[0];
  };

  const getTypeButtonClasses = (typeColor, isSelected) => {
    const baseClasses = 'p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1';
    
    if (isSelected) {
      const colorClasses = {
        blue: 'border-blue-500 bg-blue-50 text-blue-700',
        red: 'border-red-500 bg-red-50 text-red-700',
        green: 'border-green-500 bg-green-50 text-green-700',
        purple: 'border-purple-500 bg-purple-50 text-purple-700'
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
      purple: 'bg-purple-100 text-purple-700'
    };
    return `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colorClasses[typeColor] || colorClasses.blue}`;
  };

  const getOrgBadgeClasses = (orgColor) => {
    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      purple: 'bg-purple-100 text-purple-800',
      pink: 'bg-pink-100 text-pink-800',
      emerald: 'bg-emerald-100 text-emerald-800'
    };
    return `inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${colorClasses[orgColor] || colorClasses.blue}`;
  };

  // Productivity calculations
  const getTasksForPeriod = (period) => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    return tasks.filter(task => {
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
      const org = ORGANIZATIONS.find(o => o.value === t.organization);
      return org && org.type === 'work';
    });
    const completedWorkTasks = workTasks.filter(t => t.completed);

    // Time calculations
    const totalTime = periodTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);
    const workTime = workTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);
    const learningTasks = periodTasks.filter(t => t.type === 'learning');
    const learningTime = learningTasks.reduce((sum, t) => sum + getElapsedTime(t), 0);

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

    return {
      totalTasks: periodTasks.length,
      completedTasks: completedTasks.length,
      completionRate: periodTasks.length > 0 ? (completedTasks.length / periodTasks.length) * 100 : 0,
      totalTime,
      workTime,
      learningTime,
      workHoursTarget: period === 'week' ? 42 * 3600 : 8.4 * 3600, // 42h week, ~8.4h day
      workHoursProgress: period === 'week' ? (workTime / (42 * 3600)) * 100 : (workTime / (8.4 * 3600)) * 100,
      avgQualityScore,
      qualityRating: avgQualityScore >= 4.5 ? 'excellent' : avgQualityScore >= 3.5 ? 'good' : avgQualityScore >= 2.5 ? 'average' : 'needs-improvement',
      estimationAccuracy,
      bugRatio,
      focusScore,
      ratedTasksCount: ratedTasks.length,
      unratedTasksCount: completedTasks.length - ratedTasks.length,
      taskTypeBreakdown: {
        feature: featureTasks.length,
        bug: bugTasks.length,
        support: supportTasks.length,
        learning: learningTasks.length
      },
      completedWorkTasks: completedWorkTasks.length,
      productivityScore: calculateProductivityScore({
        completionRate: periodTasks.length > 0 ? (completedTasks.length / periodTasks.length) * 100 : 0,
        avgQualityScore,
        estimationAccuracy,
        bugRatio,
        focusScore
      })
    };
  };

  const calculateProductivityScore = ({ completionRate, avgQualityScore, estimationAccuracy, bugRatio, focusScore }) => {
    // Weighted scoring
    const weights = {
      completion: 0.25,
      quality: 0.30,
      estimation: 0.20,
      bugRatio: 0.15,
      focus: 0.10
    };

    const scores = {
      completion: completionRate,
      quality: (avgQualityScore / 5) * 100,
      estimation: estimationAccuracy,
      bugRatio: Math.max(0, 100 - (bugRatio * 2)), // Lower bug ratio = higher score
      focus: focusScore
    };

    const totalScore = Object.keys(weights).reduce((sum, key) => {
      return sum + (scores[key] * weights[key]);
    }, 0);

    return Math.round(totalScore);
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
    
    return true;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    stale: tasks.filter(t => isTaskStale(t)).length,
    completionRate: tasks.length > 0 
      ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)
      : 0,
    totalTimeSpent: tasks.reduce((total, task) => total + getElapsedTime(task), 0)
  };

  // Daily and weekly productivity metrics
  const dailyMetrics = calculateProductivityMetrics('today');
  const weeklyMetrics = calculateProductivityMetrics('week');

  // Stats per organization
  const orgStats = ORGANIZATIONS.map(org => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 pt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Daily Task Manager</h1>
          <p className="text-gray-600">Stay focused. Stay productive.</p>
          
          {/* View Toggle */}
          <div className="mt-4 flex justify-center gap-2">
            <button
              onClick={() => setShowProductivity(false)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                !showProductivity
                  ? 'bg-blue-600 text-white'
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
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Target className="w-4 h-4" />
              Productivity Analytics
            </button>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Bell className={`w-5 h-5 ${notificationsEnabled ? 'text-green-600' : 'text-gray-400'}`} />
              <div>
                <div className="font-semibold text-gray-800">Smart Reminders</div>
                <div className="text-sm text-gray-600">
                  {notificationsEnabled ? 'Notifications enabled' : 'Get reminded to add tasks and close stale ones'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              {notificationsEnabled && (
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Morning reminder:</label>
                  <input
                    type="time"
                    value={morningReminderTime}
                    onChange={(e) => setMorningReminderTime(e.target.value)}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}
              <button
                onClick={requestNotificationPermission}
                disabled={notificationsEnabled}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  notificationsEnabled
                    ? 'bg-green-100 text-green-700 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {notificationsEnabled ? '✓ Enabled' : 'Enable Reminders'}
              </button>
            </div>
          </div>
        </div>

        {showProductivity ? (
          // PRODUCTIVITY DASHBOARD VIEW
          <div className="space-y-6">
            {/* Productivity Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Today's Productivity */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Today's Productivity</h2>
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-blue-600 mb-2">
                    {dailyMetrics.productivityScore}
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                    dailyMetrics.productivityScore >= 80 ? 'bg-green-100 text-green-800' :
                    dailyMetrics.productivityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {dailyMetrics.productivityScore >= 80 ? 'Excellent' :
                     dailyMetrics.productivityScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tasks Completed</span>
                    <span className="font-semibold text-gray-800">{dailyMetrics.completedTasks} / {dailyMetrics.totalTasks}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Work Hours</span>
                    <span className="font-semibold text-gray-800">{formatTime(dailyMetrics.workTime)} / ~8.4h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Learning Time</span>
                    <span className="font-semibold text-purple-600">{formatTime(dailyMetrics.learningTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quality Score</span>
                    <span className="font-semibold text-gray-800">{dailyMetrics.avgQualityScore.toFixed(1)} / 5.0</span>
                  </div>
                </div>
              </div>

              {/* This Week's Productivity */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-lg p-6 border border-purple-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-800">This Week's Productivity</h2>
                  <Award className="w-6 h-6 text-purple-600" />
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-6xl font-bold text-purple-600 mb-2">
                    {weeklyMetrics.productivityScore}
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${
                    weeklyMetrics.productivityScore >= 80 ? 'bg-green-100 text-green-800' :
                    weeklyMetrics.productivityScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {weeklyMetrics.productivityScore >= 80 ? 'Excellent' :
                     weeklyMetrics.productivityScore >= 60 ? 'Good' : 'Needs Improvement'}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tasks Completed</span>
                    <span className="font-semibold text-gray-800">{weeklyMetrics.completedTasks} / {weeklyMetrics.totalTasks}</span>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-600">Work Hours (42h target)</span>
                      <span className="font-semibold text-gray-800">{formatTime(weeklyMetrics.workTime)} / 42h</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Learning Time</span>
                    <span className="font-semibold text-purple-600">{formatTime(weeklyMetrics.learningTime)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Quality Score</span>
                    <span className="font-semibold text-gray-800">{weeklyMetrics.avgQualityScore.toFixed(1)} / 5.0</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Metrics */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-600" />
                Software Engineering Quality Metrics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Estimation Accuracy */}
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {weeklyMetrics.estimationAccuracy.toFixed(0)}%
                  </div>
                  <div className="text-sm font-medium text-gray-700 mb-2">Estimation Accuracy</div>
                  <div className="text-xs text-gray-600">
                    How well you estimate task duration
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
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
                  <div className="text-sm font-medium text-gray-700 mb-2">Bug Ratio</div>
                  <div className="text-xs text-gray-600">
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
                  <div className="text-sm font-medium text-gray-700 mb-2">Focus Score</div>
                  <div className="text-xs text-gray-600">
                    Average uninterrupted work session length
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all"
                      style={{ width: `${weeklyMetrics.focusScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Task Type Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">This Week's Task Distribution</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Code className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">
                    {weeklyMetrics.taskTypeBreakdown.feature}
                  </div>
                  <div className="text-sm text-gray-600">Features</div>
                </div>
                
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Bug className="w-8 h-8 text-red-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-red-600">
                    {weeklyMetrics.taskTypeBreakdown.bug}
                  </div>
                  <div className="text-sm text-gray-600">Bugs</div>
                </div>
                
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Wrench className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {weeklyMetrics.taskTypeBreakdown.support}
                  </div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">
                    {weeklyMetrics.taskTypeBreakdown.learning}
                  </div>
                  <div className="text-sm text-gray-600">Learning</div>
                </div>
              </div>
            </div>

            {/* Quality Rating Reminder */}
            {weeklyMetrics.unratedTasksCount > 0 && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-orange-900">Rate Your Completed Tasks</div>
                    <div className="text-sm text-orange-700">
                      You have {weeklyMetrics.unratedTasksCount} completed tasks without quality ratings. 
                      Rating helps improve accuracy of productivity metrics.
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Insights & Recommendations */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Insights & Recommendations
              </h3>
              
              <div className="space-y-3">
                {weeklyMetrics.workHoursProgress < 80 && (
                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="font-medium text-yellow-900">⏰ Behind on Weekly Hours</div>
                    <div className="text-sm text-yellow-700">
                      You're at {weeklyMetrics.workHoursProgress.toFixed(0)}% of your 42-hour weekly target. 
                      Consider focusing more time on work tasks.
                    </div>
                  </div>
                )}
                
                {weeklyMetrics.learningTime < 3600 && (
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="font-medium text-purple-900">📚 Low Learning Time</div>
                    <div className="text-sm text-purple-700">
                      Only {formatTime(weeklyMetrics.learningTime)} spent on upskilling this week. 
                      Senior engineers should invest 2-4 hours weekly in learning.
                    </div>
                  </div>
                )}
                
                {weeklyMetrics.bugRatio > 30 && (
                  <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="font-medium text-red-900">🐛 High Bug Ratio</div>
                    <div className="text-sm text-red-700">
                      {weeklyMetrics.bugRatio.toFixed(0)}% of your tasks are bug fixes. 
                      Consider code reviews, testing, or refactoring to improve code quality.
                    </div>
                  </div>
                )}
                
                {weeklyMetrics.estimationAccuracy < 60 && (
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="font-medium text-blue-900">📊 Estimation Needs Improvement</div>
                    <div className="text-sm text-blue-700">
                      Your estimation accuracy is {weeklyMetrics.estimationAccuracy.toFixed(0)}%. 
                      Review completed tasks to understand estimation patterns.
                    </div>
                  </div>
                )}
                
                {weeklyMetrics.focusScore < 50 && (
                  <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="font-medium text-indigo-900">🎯 Improve Focus</div>
                    <div className="text-sm text-indigo-700">
                      Your work sessions are frequently interrupted. 
                      Try time-blocking or "deep work" sessions of 90+ minutes.
                    </div>
                  </div>
                )}

                {weeklyMetrics.productivityScore >= 80 && 
                 weeklyMetrics.workHoursProgress >= 80 && 
                 weeklyMetrics.learningTime >= 3600 && (
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="font-medium text-green-900">🌟 Excellent Performance!</div>
                    <div className="text-sm text-green-700">
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-sm text-gray-600 mb-1">Total Tasks</div>
            <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-sm text-gray-600 mb-1">Active</div>
            <div className="text-2xl font-bold text-blue-600">{stats.active}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-sm text-gray-600 mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          </div>
          <div className={`bg-white rounded-lg p-4 shadow-md ${stats.stale > 0 ? 'ring-2 ring-orange-400' : ''}`}>
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Stale (2+ days)
            </div>
            <div className={`text-2xl font-bold ${stats.stale > 0 ? 'text-orange-600' : 'text-gray-400'}`}>
              {stats.stale}
            </div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <div className="text-sm text-gray-600 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Total Time
            </div>
            <div className="text-2xl font-bold text-purple-600">{formatTime(stats.totalTimeSpent)}</div>
          </div>
        </div>

        {/* Organization Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Organization Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Work Organizations */}
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Work Organizations
              </div>
              <div className="space-y-3">
                {orgStats.filter(o => o.type === 'work').map(org => (
                  <div key={org.org} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{org.label}</div>
                      <div className="text-sm text-gray-600">
                        {org.active} active • {org.completed} completed
                        {org.stale > 0 && <span className="text-orange-600 font-semibold"> • {org.stale} stale</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Time</div>
                      <div className="font-semibold text-blue-700">{formatTime(org.timeSpent)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Personal Projects */}
            <div>
              <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Personal Projects (Spare Time)
              </div>
              <div className="space-y-3">
                {orgStats.filter(o => o.type === 'personal').map(org => (
                  <div key={org.org} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{org.label}</div>
                      <div className="text-sm text-gray-600">
                        {org.active} active • {org.completed} completed
                        {org.stale > 0 && <span className="text-orange-600 font-semibold"> • {org.stale} stale</span>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Time</div>
                      <div className="font-semibold text-purple-700">{formatTime(org.timeSpent)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

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
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <form onSubmit={addTask} className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="What do you need to accomplish today?"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Organization/Project</label>
                <select
                  value={newTaskOrg}
                  onChange={(e) => setNewTaskOrg(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <optgroup label="Work Organizations">
                    {ORGANIZATIONS.filter(o => o.type === 'work').map(org => (
                      <option key={org.value} value={org.value}>
                        {org.label}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Personal Projects">
                    {ORGANIZATIONS.filter(o => o.type === 'personal').map(org => (
                      <option key={org.value} value={org.value}>
                        {org.label}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Task Type Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Task Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {TASK_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setNewTaskType(type.value)}
                        className={getTypeButtonClasses(type.color, newTaskType === type.value)}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-xs font-medium">{type.label.split(' ')[0]}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Task Size Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Size</label>
                <select
                  value={newTaskSize}
                  onChange={(e) => setNewTaskSize(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {TASK_SIZES.map(size => (
                    <option key={size.value} value={size.value}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-4">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                filter === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                filter === 'active'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                filter === 'completed'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </div>
        </div>

        {/* Organization Filter */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Filter by Organization/Project</h3>
            
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

        {/* Task List */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {filter === 'all' && 'No tasks yet. Add your first task above!'}
              {filter === 'active' && 'No active tasks. Great job! 🎉'}
              {filter === 'completed' && 'No completed tasks yet. Keep going!'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredTasks.map((task) => {
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
                    className={`p-4 hover:bg-gray-50 transition-colors group ${
                      isStale ? 'bg-orange-50 border-l-4 border-orange-400' : ''
                    }`}
                  >
                    {/* Stale Task Warning */}
                    {isStale && (
                      <div className="mb-3 flex items-center gap-2 text-orange-700 text-sm font-medium">
                        <AlertCircle className="w-4 h-4" />
                        <span>Open for {Math.floor(taskAge)} days - Consider breaking down or closing</span>
                      </div>
                    )}

                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-blue-600 transition-colors mt-1"
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
                                ? 'line-through text-gray-400'
                                : 'text-gray-800'
                            }`}
                          >
                            {task.text}
                          </span>
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
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {sizeInfo.label.split(' ')[0]}
                          </span>
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
                            <button
                              onClick={() => startTimer(task.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Start Timer"
                            >
                              <Play className="w-5 h-5" />
                            </button>
                          ) : (
                            <button
                              onClick={() => pauseTimer(task.id)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Pause Timer"
                            >
                              <Pause className="w-5 h-5" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => stopTimer(task.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Complete Task"
                          >
                            <Square className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {/* Quality Rating Button */}
                      {task.completed && (
                        <button
                          onClick={() => setSelectedTaskForRating(task.id)}
                          className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                            task.qualityRating === 'unrated'
                              ? 'text-orange-600 hover:bg-orange-50 animate-pulse'
                              : 'text-yellow-600 hover:bg-yellow-50'
                          }`}
                          title={task.qualityRating === 'unrated' ? 'Rate Quality' : 'Update Rating'}
                        >
                          <Award className="w-5 h-5" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Clear Completed Button */}
        {stats.completed > 0 && (
          <div className="text-center">
            <button
              onClick={clearCompleted}
              className="text-gray-600 hover:text-red-600 font-medium transition-colors"
            >
              Clear {stats.completed} completed task{stats.completed !== 1 ? 's' : ''}
            </button>
          </div>
        )}
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
      </div>
    </div>
  );
}
