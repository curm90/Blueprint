# Fitness Tracker MVP Roadmap

## Project Overview

A progressive overload fitness tracking application that helps users optimize their workouts through intelligent weight and rep adjustments based on performance feedback.

## Core Value Proposition

- **Smart Progression**: Automatic weight/rep adjustments based on user feedback
- **Simple Tracking**: Easy 3-option difficulty rating system
- **Progress Visualization**: Clear metrics showing strength gains over time
- **Minimal Friction**: Quick logging with sensible defaults

## MVP Feature Breakdown

### 1. Home Page & Exercise Management

#### Empty State
- **Landing Page**: Clean welcome screen for new users
- **Primary CTA**: "Add Your First Exercise" button
- **Optional**: Brief explanation of how the app works

#### Exercise Dashboard
- **Exercise Cards**: Grid layout showing user's exercises
- **Card Content**:
  - Exercise name
  - Current weight target
  - Rep range (e.g., "8-12 reps")
  - "Log Session" button
- **Add Exercise**: Floating action button or header button

### 2. Exercise Tracking System

#### Session Logging Modal
- **Exercise Details**: Name, current target (weight × reps)
- **Difficulty Selection**: 3 radio buttons
  - 🟢 **Too Easy**: "Increase weight next time"
  - 🟡 **Just Right**: "Keep the same weight next time"  
  - 🔴 **Too Hard**: "Decrease weight next time"
- **Optional Notes**: Text area for additional context
- **Save Button**: Submit and close modal

#### Progressive Overload Algorithm
```javascript
// Basic algorithm logic
const adjustWeight = (feedback, consecutiveCount, currentWeight, increment = 2.5) => {
  if (feedback === 'easy' && consecutiveCount >= 2) {
    return currentWeight + increment
  }
  if (feedback === 'hard' && consecutiveCount >= 2) {
    return Math.max(currentWeight - increment, 0)
  }
  return currentWeight // No change for 'perfect' or insufficient data
}
```

### 3. Exercise Creation Form

#### Form Fields
- **Exercise Name**: Text input (required)
- **Starting Weight**: Number input with unit selector (kg/lbs)
- **Rep Range**: Min/Max rep inputs (e.g., 8-12)
- **Weight Increment**: How much to increase/decrease (default 2.5kg)
- **Exercise Type**: Dropdown (compound/isolation) - for future features

#### Validation
- Exercise name uniqueness
- Logical rep ranges (min < max)
- Positive weight values

### 4. Progress Tracking Page

#### Key Metrics Cards
- **Current Stats**: Latest weight for each exercise
- **Starting Point**: Initial weight when exercise was created
- **Progress Percentage**: ((current - starting) / starting) × 100
- **Session History**: Last 5-10 workout logs per exercise
- **Streak Tracking**: Consecutive sessions, best streaks

#### Data Visualization
- **Simple Charts**: Weight progression over time per exercise
- **Summary Stats**: Total sessions, total weight lifted, etc.
- **Recent Activity**: Timeline of last week's workouts

## Technical Architecture

### Frontend Stack
- **Framework**: React 18 with TypeScript
- **Routing**: TanStack Router (already configured)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Forms**: TanStack Form + Zod validation
- **State Management**: TanStack Query for server state + Zustand for client state

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM (already configured)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase subscriptions for live updates

### Database Schema

```sql
-- Users table (managed by Supabase Auth)
-- exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  current_weight DECIMAL(5,2) NOT NULL,
  starting_weight DECIMAL(5,2) NOT NULL,
  min_reps INTEGER NOT NULL,
  max_reps INTEGER NOT NULL,
  weight_increment DECIMAL(4,2) DEFAULT 2.5,
  unit TEXT DEFAULT 'kg' CHECK (unit IN ('kg', 'lbs')),
  exercise_type TEXT DEFAULT 'compound',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- workout_sessions table
CREATE TABLE workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  weight_used DECIMAL(5,2) NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'right', 'hard')),
  reps_completed INTEGER,
  notes TEXT,
  logged_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_workout_sessions_exercise_id ON workout_sessions(exercise_id);
CREATE INDEX idx_workout_sessions_logged_at ON workout_sessions(logged_at);
```

## Implementation Phases

### Phase 1: Core UI & Local Storage (Week 1-2)
- [x] Exercise card components
- [x] Add exercise form
- [x] Session logging modal (already done)
- [x] Local storage persistence
- [x] Basic routing between pages

### Phase 2: Database Integration (Week 3)
- [x] Test sb locally with sqlite
- [x] Drizzle schema implementation
- [x] CRUD operations for exercises
- [x] Session logging to database
- [ ] Error handling & loading states

### Phase 3: Progressive Overload Logic (Week 4)
- [x] Algorithm implementation
- [x] Consecutive feedback tracking
- [x] Weight adjustment automation
- [ ] Testing with various scenarios

### Phase 4: Progress Tracking (Week 5)
- [x] Progress page layout
- [x] Metrics calculations
- [x] Simple charts/visualizations
- [ ] Historical data queries
- [ ] Replace local sqlite db with prod db
 
### Phase 5: Polish & UX (Week 6)
- [ ] Loading states & skeletons
- [ ] Error boundaries
- [ ] Form validation improvements
- [ ] Mobile responsiveness
- [ ] Performance optimizations

## Stretch Goals (Post-MVP)

### 1. Workout Templates
- **Template Creation**: Group multiple exercises into workouts
- **Workout Scheduling**: Calendar integration for planned sessions
- **Template Library**: Share/discover popular workout routines

### 2. User Authentication & Social
- **Supabase Auth**: Email/password, social logins
- **User Profiles**: Basic profile with fitness goals
- **Social Features**: 
  - Share workout completions
  - Follow friends' progress
  - Leaderboards for PRs

### 3. AI-Powered Features
- **Weekly Summaries**: Monday morning recap of previous week
  - Total weight lifted
  - PRs achieved
  - Consistency metrics
  - Suggested focus areas
- **Smart Recommendations**: Exercise suggestions based on current routine
- **Form Analysis**: Integration with video analysis for form feedback

### 4. Advanced Analytics
- **Detailed Charts**: Volume progression, strength curves
- **Body Part Analysis**: Balance tracking across muscle groups
- **Plateau Detection**: Identify when progress stalls
- **Periodization**: Built-in deload week suggestions

### 5. Equipment & Gym Integration
- **Equipment Tracking**: Available weights, machines
- **Gym Check-ins**: Location-based workout tracking
- **Equipment Alternatives**: Suggest substitutions based on availability

## Technology Recommendations

### Why Supabase?
- **Familiar PostgreSQL**: Works perfectly with Drizzle ORM
- **Built-in Auth**: Reduces complexity for user management
- **Real-time**: Live updates for shared workouts/social features
- **Edge Functions**: For complex algorithms and AI integration
- **Free Tier**: Generous limits for MVP testing

### Alternative Considerations
- **PlanetScale**: If you prefer pure MySQL with vitess
- **Neon**: Serverless PostgreSQL with branching
- **Railway**: Simple deployment with built-in PostgreSQL

## Data Storage Strategy

### MVP Approach
1. **Local Storage**: Build all UI components first
2. **Seed Data**: Create realistic mock exercises and sessions
3. **Progressive Enhancement**: Add database layer without breaking UI
4. **Migration Tools**: Easy import from localStorage to database

### Production Considerations
- **Offline Support**: Service worker for offline session logging
- **Data Export**: Allow users to export their data
- **Backup Strategy**: Automated backups and point-in-time recovery
- **GDPR Compliance**: Data deletion and export capabilities

## Success Metrics

### User Engagement
- **Daily Active Users**: Consistent workout logging
- **Session Completion Rate**: How often users finish logging workouts
- **Retention**: 7-day and 30-day user return rates

### Feature Adoption
- **Exercise Creation**: Average exercises per user
- **Session Frequency**: Workouts logged per week
- **Progress Views**: How often users check their progress

### Product Validation
- **Weight Progression**: Are users actually getting stronger?
- **Algorithm Effectiveness**: Feedback on automatic adjustments
- **User Satisfaction**: In-app feedback and ratings

## Next Steps

1. **Complete Current UI**: Finish exercise cards and forms with mock data
2. **Set up Supabase**: Create project and configure authentication
3. **Implement Database Schema**: Use Drizzle to create tables
4. **Build API Layer**: CRUD operations with proper error handling
5. **Add Progressive Overload**: Implement the core algorithm
6. **Create Progress Page**: Basic metrics and visualizations
7. **User Testing**: Get feedback from 5-10 real users
8. **Iterate**: Refine based on user feedback before adding stretch goals

---

*This roadmap prioritizes building a solid, useful MVP that solves the core problem of progressive overload tracking. Focus on nailing the fundamentals before adding complex features.*