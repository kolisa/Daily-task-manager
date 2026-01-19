# Daily Task Manager

A clean, modern task management application to boost your productivity. Track your daily tasks, mark them as complete, and monitor your progress.

# Daily Task Manager for Senior Software Engineers

A comprehensive productivity system for Senior Software Engineers and Technical Leads. Track tasks across multiple organizations, measure your engineering quality, monitor your 42-hour work week, invest in upskilling, and get actionable insights on your productivity.

## Perfect For

- **Multiple Organizations**: Track tasks for Web Africa, LexisNexis, and other clients
- **Personal Projects**: Manage spare-time projects like Bhukuveni, Khoi, and Nowmail
- **Quality Engineering**: Measure work quality using software engineering standards
- **Weekly Planning**: Monitor your 42-hour work week target
- **Continuous Learning**: Track upskilling through online courses and mentorship
- **Data-Driven Improvement**: Get insights based on your actual performance

## Features

### ✅ Core Task Management
- Add and manage daily tasks with detailed categorization
- 🏢 **Multi-Organization Support**: Track tasks for multiple work organizations
- 💼 **Personal Project Tracking**: Separate work from personal spare-time projects
- 📊 **Per-Organization Statistics**: See time spent and progress for each organization
- 🏷️ **Task Types**: Feature Development, Bug Fixes, Support/Small Tasks, **Learning/Upskilling**
- 📏 **Size Estimation**: From XS (< 1h) to XXL (2+ days)
- ⏱️ **Advanced Time Tracking** with start/pause/stop controls

### 📈 Productivity Analytics
- **Two Views**: Tasks View and Productivity Analytics Dashboard
- **Daily Productivity Score**: Overall performance rating based on multiple factors
- **Weekly Productivity Score**: Track your 42-hour work week progress
- **Real-time Statistics**: Comprehensive metrics updated live

### 🎯 Software Engineering Quality Metrics
- **Estimation Accuracy**: How well you estimate task duration (%)
- **Bug Ratio**: Bugs vs Features (lower is better - quality indicator)
- **Focus Score**: Average uninterrupted work session length
- **Quality Ratings**: Rate completed tasks (Excellent/Good/Average/Poor)
- **Average Quality Score**: Overall quality across all rated tasks
- **Work Hours Tracking**: Monitor progress toward 42-hour weekly target

### 📚 Learning & Upskilling
- **Learning Task Type**: Dedicated category for upskilling activities
- **Learning Time Tracking**: See how much time you invest in growth
- **Weekly Learning Goals**: System recommends 2-4 hours weekly
- Track online courses, mentorship programs, technical reading

### 🔔 Smart Reminders
- Morning reminders to plan your day (customizable time)
- Automatic alerts for stale tasks (open 2+ days)
- Reminder to rate completed tasks for better analytics

### 💡 AI-Powered Insights
- Automatic recommendations based on your performance
- Identify patterns (underestimating, high bug ratio, low focus)
- Personalized tips to improve productivity
- Celebration when you're excelling!

### 💾 Smart Storage Management
- **Real-time Storage Monitoring**: See usage percentage in header
- **Auto-Archive**: Completed tasks older than 7 days automatically archived
- **Manual Archive**: Move completed tasks to archive anytime
- **Export/Import**: Full data backup and restore
- **Selective Cleanup**: Delete old archived tasks (90/180+ days)
- **Storage Breakdown**: See space used by active vs archived tasks
- **Warning System**: Alert when approaching 80% storage limit

LocalStorage typically has 5-10MB limit per domain. The app tracks your usage and provides tools to manage space efficiently.

### 📋 Work Summary & Changelog
- **Multiple Formats**: Standup, Markdown, JIRA, Email, Detailed Report
- **Flexible Date Ranges**: Today, Yesterday, This Week, Last Week, This Month
- **One-Click Copy**: Copy formatted summary to clipboard
- **Grouped by Organization**: Tasks organized by Web Africa, LexisNexis, etc.
- **Time Tracking**: Shows time spent per task and organization
- **7-Day Visibility**: Completed tasks visible for a week before archiving

Perfect for daily standups, weekly status reports, manager updates, and sprint retrospectives!

### 🎨 Additional Features
- 📊 Task type breakdown visualization
- ⚠️ **Stale Task Detection** - Highlights tasks open for 2+ days
- 🎯 Filter tasks by status AND organization
- 💾 Automatic saving to browser localStorage
- 📱 Fully responsive design
- ⏰ Live timer updates with visual indicators

## Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Recommended)

1. Install Vercel CLI globally:
```bash
npm install -g vercel
```

2. Navigate to your project directory:
```bash
cd /path/to/daily-task-manager
```

3. Install dependencies:
```bash
npm install
```

4. Deploy to Vercel:
```bash
vercel
```

5. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **daily-task-manager** (or your choice)
   - Directory? **./** (press Enter)
   - Override settings? **N**

6. Your app will be deployed! Vercel will provide you with a URL.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub, GitLab, or Bitbucket

2. Go to [vercel.com](https://vercel.com) and sign in

3. Click "Add New Project"

4. Import your repository

5. Vercel will auto-detect it's a Vite project

6. Click "Deploy"

That's it! Your task manager will be live in seconds.

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **LocalStorage** - Data persistence

## Features Explained

### Multi-Organization Management 🏢

**Work Organizations:**
- **Web Africa** - Your primary work organization
- **LexisNexis** - Secondary work organization
- Track tasks, time, and completion rates separately for each

**Personal Projects (Spare Time):**
- **Bhukuveni** - Your personal project worked on in spare time
- **Khoi** - Another personal project
- **Nowmail** - Your third personal project

Each organization/project has:
- Independent task lists
- Separate time tracking
- Individual completion statistics
- Stale task monitoring

**Organization Overview Dashboard:**
- See all organizations at a glance
- Compare time spent across work vs personal projects
- Identify which organizations have stale tasks
- Track completion rates per organization

**Organization Filtering:**
- Click any organization to see only its tasks
- "All Organizations" shows everything
- Visual separation between work and personal projects
- Live statistics update as you filter

### Task Categories 🏷️
Tailored for Senior Software Engineers and Technical Leads:
- **Feature Development** (🔧) - New features, enhancements, architecture work
- **Bug Fix** (🐛) - Bug tickets, hotfixes, technical debt
- **Support/Small Task** (🔨) - Code reviews, small changes, support tickets
- **Learning/Upskilling** (📚) - Online courses, mentorship programs, technical reading, conferences

**Why Learning Matters:**
As a senior engineer, continuous learning is crucial. The system tracks your learning time and recommends 2-4 hours weekly for upskilling. This includes:
- Online courses (Udemy, Coursera, Pluralsight)
- Mentorship programs (participating as mentor or mentee)
- Technical books and documentation
- Conference talks and workshops
- Experimenting with new technologies

### Productivity Analytics Dashboard 📊

Switch to the **Productivity Analytics** view to see comprehensive metrics:

**Daily Productivity Score** (0-100)
- Overall performance rating for today
- Combines completion rate, quality, estimation accuracy, bug ratio, and focus
- Green (80+) = Excellent, Yellow (60-79) = Good, Orange (<60) = Needs Improvement

**Weekly Productivity Score** (0-100)
- Same scoring system across the full week
- Tracks progress toward 42-hour work week target
- Shows work hours with visual progress bar

**What the Score Measures:**
- **Completion Rate** (25%): Tasks completed vs. started
- **Quality Score** (30%): Average quality rating of completed work
- **Estimation Accuracy** (20%): How close actual time is to estimates
- **Bug Ratio** (15%): Lower bug ratio = higher quality code
- **Focus Score** (10%): Length of uninterrupted work sessions

### Software Engineering Quality Metrics 🎯

**1. Estimation Accuracy (Target: 70%+)**
- Measures how well you estimate task duration
- Calculated from actual time vs estimated time
- < 60%: Review patterns, you might be consistently under/overestimating
- 70-85%: Good estimation skills
- 85%+: Excellent estimation accuracy

**2. Bug Ratio (Target: < 20%)**
- Percentage of bug fixes vs total code production tasks
- Quality indicator: high bug ratio suggests code quality issues
- < 20%: Excellent code quality
- 20-40%: Normal range, but watch for trends
- > 40%: Consider code reviews, testing, refactoring

**3. Focus Score (Target: 60%+)**
- Based on average work session length before interruption
- 30-minute uninterrupted session = 100% focus score
- < 50%: Frequent interruptions, try time-blocking
- 50-75%: Good focus with some interruptions
- 75%+: Excellent deep work capability

**4. Quality Ratings (Target: 4.0+ average)**
Rate each completed task:
- **Excellent (5.0)**: First try, no rework needed, exceeded expectations
- **Good (4.0)**: Minor revisions, met expectations
- **Average (3.0)**: Some rework required, met minimum standards
- **Poor (2.0)**: Significant rework, fell short of expectations

**Why Rate Tasks:**
Quality ratings enable accurate productivity scoring and help identify:
- Which types of tasks you excel at
- When you produce best quality work
- Areas needing improvement
- Impact of interruptions on quality

### 42-Hour Work Week Tracking ⏰

**Why 42 Hours?**
- Standard professional work week for senior engineers
- Balances productivity with sustainable pace
- Excludes learning time (tracked separately)
- Includes all work organizations combined

**Weekly Progress Bar:**
- Green (100%+): Hit your target!
- Blue (80-99%): On track
- Orange (<80%): Behind schedule

**Tips for Meeting Target:**
- Plan your week on Monday morning
- Use time blocking for focused work
- Track time for all work activities
- Review progress mid-week to adjust

### Learning Time Investment 📚

**Recommended: 2-4 hours weekly**

Why Senior Engineers Need Learning Time:
- Technology evolves rapidly
- Leadership requires soft skills development
- Staying competitive in the market
- Teaching others reinforces your knowledge
- Exploring new paradigms and patterns

**What Counts as Learning:**
✅ Online courses and tutorials
✅ Reading technical books/documentation
✅ Attending conferences or webinars
✅ Mentorship programs (as mentor or mentee)
✅ Experimenting with new frameworks
✅ Writing technical blog posts
✅ Contributing to open source

❌ Regular work tasks (even if you learn)
❌ Meetings (unless explicitly training)
❌ Code reviews (that's work, not learning)

### AI-Powered Insights 💡

The system analyzes your data and provides personalized recommendations:

**Behind on Weekly Hours**
- Triggered when < 80% of 42-hour target
- Suggests focusing more time on work tasks

**Low Learning Time**
- Triggered when < 1 hour learning this week
- Reminds you to invest in growth

**High Bug Ratio**
- Triggered when bug ratio > 30%
- Suggests code reviews, testing, refactoring

**Poor Estimation**
- Triggered when estimation accuracy < 60%
- Recommends reviewing completed tasks

**Low Focus Score**
- Triggered when focus score < 50%
- Suggests time-blocking or deep work sessions

**Excellent Performance**
- Celebrates when all metrics are green
- Reinforces positive habits

### Task Sizing 📏
Estimate effort upfront with 6 size options:
- **XS** (< 1h) - Quick fixes, simple code reviews
- **S** (1-2h) - Small bug fixes, minor changes
- **M** (2-4h) - Medium features, complex reviews
- **L** (4-8h) - Large features, refactoring
- **XL** (1-2 days) - Multi-day features, system design
- **XXL** (2+ days) - Epic-level work, major initiatives

### Smart Reminders 🔔
Enable browser notifications for:
- **Morning Reminders**: Get reminded to add your daily tasks
  - Set your preferred time (default: 9:00 AM)
  - Never forget to plan your day
- **Stale Task Alerts**: Automatic notifications for tasks open 2+ days
  - Helps prevent tasks from lingering too long
  - Encourages breaking down large tasks or closing blockers
  - Reminds once per day per stale task

### Time Tracking ⏱️
Each task has built-in time tracking with estimation comparison:
- **Start Timer** (▶️ Play button): Begin tracking time on a task
  - Only one timer can run at a time - starting a new timer automatically pauses others
  - Timer displays live updates with a green pulsing indicator
- **Pause Timer** (⏸️ Pause button): Temporarily stop the timer
  - Your accumulated time is saved
  - Resume anytime by clicking Start again
- **Stop & Complete** (⏹️ Stop button): Stop timer and mark task as complete
  - Automatically marks the task as done
  - Final time is saved with the task

### Estimated vs Actual Time 📈
Visual tracking of time budget:
- **Green Progress** (< 80%): On track
- **Orange Progress** (80-100%): Approaching estimate
- **Red Progress** (> 100%): Over budget
- Real-time percentage display
- Helps improve future estimations

### Stale Task Detection ⚠️
Tasks open for 2+ days are automatically flagged:
- Orange highlight on task card
- Age display (e.g., "Open for 3 days")
- Suggestion to break down or close
- Counter in stats dashboard

### Statistics Dashboard
- **Total Tasks**: All tasks in your list
- **Active**: Tasks that need to be completed
- **Completed**: Tasks you've finished
- **Stale**: Tasks open for 2+ days (highlighted in orange)
- **Total Time**: Combined time spent across all tasks
- **Progress Bar**: Visual completion percentage

### Filters
- **All**: View all tasks
- **Active**: Only incomplete tasks
- **Completed**: Only finished tasks

## Setting Up Reminders

1. **Enable Notifications**
   - Click "Enable Reminders" button in the notification panel
   - Allow browser notifications when prompted
   
2. **Set Morning Reminder Time**
   - Default is 9:00 AM
   - Click the time picker to change
   - You'll be reminded to add tasks every morning

3. **Automatic Stale Task Alerts**
   - No setup needed - works automatically
   - Tasks open for 2+ days trigger daily reminders
   - Helps you stay on top of blockers

**Note**: Notifications only work when the browser is open. For best results, keep the app tab open or pinned.

## Data Persistence

Your tasks and all tracking data are automatically saved to your browser's localStorage. This includes:
- Task names, types, and sizes
- Completion status
- Time spent on each task (total and sessions)
- Estimated time vs actual comparison
- Timer sessions and history
- Morning reminder preferences
- Stale task notification history
- All statistics

Everything persists even after closing the browser, as long as you don't clear your browser data.

## Best Practices for Senior Engineers

### Multi-Organization Workflow

**Morning Routine:**
1. Enable morning reminder (9:00 AM default)
2. When reminded, plan tasks for each organization:
   - Add Web Africa tasks (work priorities)
   - Add LexisNexis tasks (client deliverables)
   - Add personal project tasks if you have spare time planned

**During Work Hours:**
1. Filter by work organization (Web Africa or LexisNexis)
2. Start timer on current task
3. Focus on one organization at a time
4. Use time tracking to stay within estimates

**Evening/Spare Time:**
1. Switch filter to personal projects (Bhukuveni, Khoi, or Nowmail)
2. Work on personal tasks without mixing with work
3. Track time separately to understand your spare time investment

**Weekly Review:**
1. Check Organization Overview to see time distribution
2. Identify stale tasks across all organizations
3. Review completion rates per organization
4. Adjust estimates based on actual time data

### Task Planning
- **Morning Routine**: Enable morning reminders to plan your day at the start
- **Size Appropriately**: Break XXL tasks into smaller chunks for better tracking
- **Categorize Wisely**: Use Bug/Feature/Support categories to identify patterns

### Time Management
- **Single Task Focus**: The app allows only one active timer - embrace it
- **Realistic Estimates**: Start conservative, adjust based on historical data
- **Track Everything**: Include meetings, code reviews, and design time

### Dealing with Stale Tasks
When you get a 2-day alert:
1. **Is it blocked?** Document the blocker and follow up
2. **Too large?** Break it into smaller tasks
3. **Not a priority?** Archive or delete it
4. **Almost done?** Commit to finishing today

### Using Time Comparison
- **Green (< 80%)**: Great! You estimated well
- **Orange (80-100%)**: Close estimate, maybe add buffer next time
- **Red (> 100%)**: Analyze why - complexity underestimated? Interruptions? Scope creep?

Use this data to improve future estimations and sprint planning.

## Usage Examples

### Example 1: Starting Your Work Day
```
1. Open task manager
2. Click "Web Africa" in organization filter
3. Add task: "Review pull request for authentication module"
   - Type: Support/Small Task
   - Size: S (1-2h)
4. Add task: "Implement password reset feature"
   - Type: Feature Development
   - Size: L (4-8h)
5. Start timer on PR review task
```

### Example 2: Switching to Client Work
```
1. Finish Web Africa task (click Stop & Complete)
2. Click "LexisNexis" in organization filter
3. Add task: "Fix search results pagination bug"
   - Type: Bug Fix
   - Size: M (2-4h)
4. Start timer on bug fix
```

### Example 3: Evening Personal Project Work
```
1. Click "Bhukuveni" in organization filter
2. Add task: "Add offline support to PWA"
   - Type: Feature Development
   - Size: XL (1-2 days)
3. Start timer, work for a few hours
4. Pause timer when done for the day
5. Resume tomorrow in spare time
```

### Example 4: Handling Stale Tasks
```
When you get a stale task notification:
1. Open organization filter for that task's org
2. Review the task that's been open 2+ days
3. Decide:
   - Break it into smaller tasks? (Create new XS/S/M tasks)
   - Blocked? Add note and set reminder
   - Not important? Delete it
   - Almost done? Commit to finishing today
```

### Example 5: Weekly Review
```
1. Filter to "All Organizations"
2. Check Organization Overview:
   - Web Africa: 40h this week (12 tasks completed)
   - LexisNexis: 20h this week (8 tasks completed)
   - Bhukuveni: 5h this week (2 tasks completed)
3. Identify patterns:
   - Are you underestimating bugs?
   - Which organization has most stale tasks?
   - Are personal projects getting enough time?
```

## Customization

Want to track different organizations? Easy!

Edit the `ORGANIZATIONS` array in `src/DailyTaskManager.jsx`:

```javascript
const ORGANIZATIONS = [
  { value: 'yourcompany', label: 'Your Company', icon: Briefcase, color: 'blue', type: 'work' },
  { value: 'client1', label: 'Client 1', icon: Briefcase, color: 'indigo', type: 'work' },
  { value: 'sideproject', label: 'Side Project', icon: Coffee, color: 'purple', type: 'personal' },
];
```

## Storage Management 💾

LocalStorage has a limit of 5-10MB per domain. This app includes smart storage management to prevent data loss.

## Work Summary & Changelog 📋

Generate professional work summaries in multiple formats - perfect for standups, status reports, and manager updates!

### How It Works

**7-Day Visibility Window:**
- Completed tasks visible for 7 days
- Auto-archived after 7 days (not deleted!)
- Generate summaries anytime within the week
- Perfect for weekly retrospectives

**Access:**
Click the **📋 Work Summary** button in the header

### Available Formats

**1. Daily Standup (Simple)**
```
📊 Daily Standup - This Week
⏱️ Total Time: 28h 15m 30s

Web Africa:
  ✨ Implement password reset feature (6h 30m)
  🐛 Fix authentication timeout bug (2h 15m)
  🔧 Code review for API changes (1h 45m)

LexisNexis:
  ✨ Add search pagination (4h 20m)
  🐛 Fix memory leak in parser (3h 10m)

Bhukuveni:
  📚 Complete React course module 4 (2h 30m)
```

**Use Case:** Daily standup meetings, quick team updates

**2. Markdown Format**
```markdown
# Work Summary - This Week

**Total Time:** 28h 15m 30s

## Web Africa (10h 30m)

- **Implement password reset feature**
  - Type: Feature Development
  - Time: 6h 30m
  - Quality: Excellent

- **Fix authentication timeout bug**
  - Type: Bug Fix
  - Time: 2h 15m
  - Quality: Good
```

**Use Case:** GitHub updates, Notion documentation, technical wikis

**3. JIRA Format**
```
h2. Work Log - This Week

*Total Time:* 28h 15m 30s

h3. Web Africa

* (+) Implement password reset feature - 6h 30m
* (x) Fix authentication timeout bug - 2h 15m
* (!) Code review for API changes - 1h 45m
```

**Use Case:** JIRA ticket updates, Confluence pages, issue tracking

**4. Email Format**
```
Subject: Work Summary - This Week

Hi Team,

Here's my work summary for this week:

Total Hours: 28h 15m 30s

Web Africa (10h 30m):
  • Implement password reset feature
  • Fix authentication timeout bug
  • Code review for API changes

LexisNexis (8h 45m):
  • Add search pagination
  • Fix memory leak in parser

Best regards
```

**Use Case:** Weekly manager updates, client reports, email summaries

**5. Detailed Report**
```
DETAILED WORK REPORT - This Week
============================================================

Summary:
  Total Time: 28h 15m 30s
  Features: 5 | Bugs: 3 | Support: 4 | Learning: 2
  Total Tasks: 14

WEB AFRICA
------------------------------------------------------------
Time Spent: 10h 30m
Tasks Completed: 6

1. Implement password reset feature
   Type: Feature Development | Size: L (4-8h)
   Time: 6h 30m (Est: 6h, Variance: +8%)
   Quality: Excellent - First try, no rework

2. Fix authentication timeout bug
   Type: Bug Fix | Size: S (1-2h)
   Time: 2h 15m (Est: 1.5h, Variance: +50%)
   Quality: Good - Minor revisions
```

**Use Case:** Sprint retrospectives, performance reviews, detailed analysis

### Date Range Options

- **Today**: Tasks completed today
- **Yesterday**: Tasks completed yesterday (for next-day standup)
- **This Week**: Sunday to now
- **Last Week**: Previous Sunday to Saturday
- **This Month**: Current month to date

### One-Click Copy

All formats have a **📋 Copy to Clipboard** button:
1. Select format and date range
2. Preview appears instantly
3. Click copy button
4. Paste anywhere (Slack, email, JIRA, etc.)

### Example Workflows

**Daily Standup (Every Morning):**
```
1. Open app
2. Click "📋 Work Summary"
3. Select "Daily Standup" format
4. Select "Yesterday" date range
5. Copy and paste into Slack standup channel
```

**Weekly Status Report (Friday EOD):**
```
1. Click "📋 Work Summary"
2. Select "Email" format
3. Select "This Week" date range
4. Copy and paste into email to manager
5. Hits send feeling accomplished!
```

**Sprint Retrospective (End of Sprint):**
```
1. Click "📋 Work Summary"
2. Select "Detailed Report" format
3. Select "Last Week" or "This Month"
4. Copy for retrospective discussion
5. Review estimation accuracy
6. Identify improvement areas
```

**Client Status Update (Weekly):**
```
1. Click "📋 Work Summary"
2. Select "Markdown" format
3. Select "This Week" date range
4. Filter shows only LexisNexis tasks
5. Professional update ready!
```

### Smart Features

**Grouped by Organization:**
- Tasks automatically grouped
- Time totals per organization
- Easy to see work distribution

**Time Tracking Included:**
- Actual time spent per task
- Total time per organization
- Overall time for period

**Quality Indicators:**
- Shows quality ratings (if rated)
- Estimation variance shown
- Task type distribution

**Visual Summary Cards:**
- Total tasks completed
- Total time spent
- Number of organizations

### Pro Tips

**Best Time to Generate:**
- **Daily Standup**: Generate in the morning for yesterday
- **Weekly Report**: Generate Friday afternoon for the week
- **Month-End**: Generate on last day of month

**For Maximum Impact:**
- Rate task quality before generating (better reports)
- Use consistent task descriptions (better readability)
- Generate right before archiving (capture everything)

**Format Selection Guide:**
- **Standup**: Quick verbal update needed
- **Markdown**: Technical documentation
- **JIRA**: Updating tickets/issues
- **Email**: Formal communication
- **Detailed**: Performance review, analysis

## Storage Management 💾

### How Storage Works

**What's Stored:**
- Active tasks (visible in main view)
- Archived tasks (completed, older than 30 days)
- All task metadata (time tracking, quality ratings, sessions)
- Organization assignments
- User preferences

**Storage Limits:**
- Conservative estimate: 5MB
- Typical task: ~500 bytes
- Can store ~10,000 tasks before issues
- App monitors usage in real-time

### Auto-Archive Feature

**Automatic Process:**
- Runs when app loads
- Completed tasks older than 7 days → moved to archive
- Archive is hidden from main view
- Archive IS included in productivity metrics
- Saves space without losing data

**Why 7 Days?**
- Perfect for weekly status reports
- Capture full week of work
- Generate Friday summary before archiving
- Balance between visibility and storage

**Benefits:**
- Main task list stays fast and responsive
- Historical data preserved for analytics
- Automatic space management
- No manual intervention needed

### Storage Manager Tools

Click the **💾 Storage** button (pulses orange when >80% full) to access:

**1. Storage Monitor**
- Real-time usage percentage
- Visual progress bar (green/orange/red)
- Breakdown: Active vs Archived tasks
- File size per category

**2. Export/Import Data**
- **Export**: Download JSON backup of everything
  - All active tasks
  - All archived tasks
  - Metadata and settings
  - Use before any cleanup operation!
- **Import**: Restore from backup file
  - Merges with existing data
  - Preserves all task details

**3. Archive Management**
- **Archive All Completed**: Manual archive of done tasks
- **Clear Archive (90+ days)**: Delete tasks older than 90 days
- **Clear Archive (180+ days)**: Delete tasks older than 180 days
- **Clear All Archive**: Delete entire archive (use with caution!)

### Best Practices

**Weekly Maintenance:**
```
1. Check storage usage (should be <60%)
2. If >60%: Export backup first
3. Archive completed tasks manually
4. Review old archived tasks
5. Clear archive (90+ days) if needed
```

**Before Deleting Anything:**
```
1. ALWAYS export data first!
2. Store backup file safely (Google Drive, etc.)
3. Verify backup downloaded successfully
4. Then proceed with cleanup
```

**If Storage Hits 80%:**
```
1. Export backup immediately
2. Archive all completed tasks
3. Clear old archived tasks (90+ days)
4. Should free up 40-60% space
```

**If Storage Hits 95%:**
```
1. CRITICAL: Export backup NOW
2. Clear archive (90+ days)
3. Consider clearing archive (30+ days)
4. Contact support if issues persist
```

### Storage Usage Examples

**Light User** (50 tasks/month):
- Monthly: ~25KB
- Yearly: ~300KB
- Safe for 15+ years

**Heavy User** (200 tasks/month):
- Monthly: ~100KB
- Yearly: ~1.2MB
- Need cleanup after 3-4 years

**Power User** (500 tasks/month):
- Monthly: ~250KB
- Yearly: ~3MB
- Need cleanup annually

### Data Portability

**Export Format:**
Standard JSON file containing:
```json
{
  "tasks": [...],
  "archivedTasks": [...],
  "exportDate": "2026-01-19",
  "version": "2.0"
}
```

**Use Cases:**
- Transfer between devices
- Long-term archival
- Data analysis in Excel/Python
- Backup before browser reset
- Migration to future versions

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

Free to use for personal and commercial projects.
