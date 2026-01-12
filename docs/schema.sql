-- Database Schema for BioBalance

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_weight DECIMAL(5,2),
    target_weight DECIMAL(5,2),
    fitness_level TEXT DEFAULT 'beginner' -- 'beginner', 'intermediate', 'advanced'
);

-- Medical History (Anamnesis)
CREATE TABLE IF NOT EXISTS medical_history (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    has_hypertension BOOLEAN DEFAULT FALSE,
    has_diabetes BOOLEAN DEFAULT FALSE,
    has_joint_injuries BOOLEAN DEFAULT FALSE,
    has_allergies BOOLEAN DEFAULT FALSE,
    allergies_detail TEXT,
    other_conditions TEXT,
    risk_profile TEXT DEFAULT 'low', -- 'low', 'medium', 'high' based on business logic
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Weight Tracking
CREATE TABLE IF NOT EXISTS weight_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) NOT NULL,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Emotional Diary
CREATE TABLE IF NOT EXISTS emotional_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    mood TEXT NOT NULL, -- 'happy', 'neutral', 'sad', 'stressed', etc.
    note TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Nutrition Logs
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    calories INTEGER NOT NULL,
    protein INTEGER,
    carbs INTEGER,
    fat INTEGER,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Meal Planner
CREATE TABLE IF NOT EXISTS meal_plans (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0-6 (Sun-Sat)
    meal_type TEXT NOT NULL, -- 'breakfast', 'lunch', 'dinner', 'snack'
    meal_description TEXT NOT NULL,
    estimated_calories INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Relationships
-- users.id (1) <-> (1) medical_history.user_id
-- users.id (1) <-> (N) weight_logs.user_id
-- users.id (1) <-> (N) emotional_logs.user_id
-- users.id (1) <-> (N) nutrition_logs.user_id
-- users.id (1) <-> (N) meal_plans.user_id
