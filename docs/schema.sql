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
    fitness_level TEXT DEFAULT 'beginner', -- 'beginner', 'intermediate', 'advanced'
    points INTEGER DEFAULT 0,
    team_name TEXT,
    is_premium BOOLEAN DEFAULT FALSE
);


-- Badges (Achievements)
CREATE TABLE IF NOT EXISTS badges (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,
    color TEXT
);

-- User Badges Mapping
CREATE TABLE IF NOT EXISTS user_badges (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    badge_id INTEGER REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, badge_id)
);

-- Insert Initial Badges
INSERT INTO badges (name, description, icon, color) VALUES 
('Mente Clara', 'Registra tu primer estado de ánimo', 'Star', 'text-blue-400'),
('Equilibrio Interior', 'Completa 3 registros emocionales', 'Heart', 'text-purple-400'),
('Cazador de Macros', 'Analiza tu primera comida con IA', 'Zap', 'text-cyan-400'),
('Persistencia', 'Registra tu peso por 2 semanas consecutivas', 'Trophy', 'text-yellow-400'),
('Sueño Reparador', 'Registraste tu primer descanso de calidad.', 'Moon', 'text-blue-400')
ON CONFLICT (name) DO NOTHING;

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

CREATE TABLE IF NOT EXISTS sleep_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    hours FLOAT NOT NULL,
    quality INTEGER CHECK (quality >= 1 AND quality <= 5),
    recorded_at DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, recorded_at)
);


-- Flash Challenges
CREATE TABLE IF NOT EXISTS flash_challenges (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    points INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Challenges Tracking
CREATE TABLE IF NOT EXISTS user_challenges (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    challenge_id INTEGER REFERENCES flash_challenges(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, challenge_id)
);

-- Insert initial flash challenges
INSERT INTO flash_challenges (title, description, points, duration_minutes) VALUES 
('Hidratación Express', 'Bebe 500ml de agua ahora mismo.', 50, 60),
('Pausa Activa', 'Realiza 10 sentadillas para activar tu metabolismo.', 75, 30),
('Zen en un Minuto', 'Cierra los ojos y respira profundamente por 60 segundos.', 40, 15),
('Postura de Acero', 'Mantén tu espalda recta mientras trabajas por los próximos 15 minutos.', 60, 45)
ON CONFLICT DO NOTHING;

-- Relationships
-- users.id (1) <-> (1) medical_history.user_id
-- users.id (1) <-> (N) weight_logs.user_id
-- users.id (1) <-> (N) emotional_logs.user_id
-- users.id (1) <-> (N) nutrition_logs.user_id
-- users.id (1) <-> (N) meal_plans.user_id
-- users.id (1) <-> (N) user_challenges.user_id
