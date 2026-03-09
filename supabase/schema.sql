-- =============================================
-- FRANCA ACADEMY - SUPABASE SCHEMA
-- =============================================
-- Cole este SQL no Supabase SQL Editor e execute.
-- Ordem: tabelas → RLS → triggers → seed data
-- =============================================

-- =============================================
-- 1. TABELAS
-- =============================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Courses
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  slug TEXT UNIQUE NOT NULL,
  kiwify_product_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Modules (sections within a course)
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES public.modules ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT,
  video_id TEXT,
  duration_seconds INTEGER,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Purchases
CREATE TABLE IF NOT EXISTS public.user_purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  course_id UUID REFERENCES public.courses ON DELETE CASCADE NOT NULL,
  kiwify_order_id TEXT,
  purchased_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);

-- Lesson Progress
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons ON DELETE CASCADE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  progress_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- =============================================
-- 2. INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_modules_course_id ON public.modules(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_user_id ON public.user_purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_user_purchases_course_id ON public.user_purchases(course_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_id ON public.lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson_id ON public.lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_courses_kiwify_product_id ON public.courses(kiwify_product_id);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);

-- =============================================
-- 3. ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Courses (all authenticated users can view active courses)
CREATE POLICY "Authenticated users can view active courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (is_active = TRUE);

-- Modules (all authenticated users can view)
CREATE POLICY "Authenticated users can view modules"
  ON public.modules FOR SELECT
  TO authenticated
  USING (TRUE);

-- Lessons (all authenticated users can view)
CREATE POLICY "Authenticated users can view lessons"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (TRUE);

-- User Purchases (users can view own)
CREATE POLICY "Users can view own purchases"
  ON public.user_purchases FOR SELECT
  USING (auth.uid() = user_id);

-- Lesson Progress
CREATE POLICY "Users can view own progress"
  ON public.lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON public.lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON public.lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- Admin helper function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Admin CRUD policies: Courses
CREATE POLICY "Admins can view all courses" ON public.courses FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update courses" ON public.courses FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete courses" ON public.courses FOR DELETE TO authenticated USING (public.is_admin());

-- Admin CRUD policies: Modules
CREATE POLICY "Admins can insert modules" ON public.modules FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update modules" ON public.modules FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete modules" ON public.modules FOR DELETE TO authenticated USING (public.is_admin());

-- Admin CRUD policies: Lessons
CREATE POLICY "Admins can insert lessons" ON public.lessons FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update lessons" ON public.lessons FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete lessons" ON public.lessons FOR DELETE TO authenticated USING (public.is_admin());

-- =============================================
-- 4. TRIGGERS
-- =============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists, then create
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_courses_updated_at ON public.courses;
CREATE TRIGGER set_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_lesson_progress_updated_at ON public.lesson_progress;
CREATE TRIGGER set_lesson_progress_updated_at
  BEFORE UPDATE ON public.lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Services (serviços + consultoria)
CREATE TABLE IF NOT EXISTS public.services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('servico', 'consultoria')),
  title TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Briefcase',
  whatsapp_message TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_type ON public.services(type);

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view active services"
  ON public.services FOR SELECT TO authenticated USING (is_active = TRUE);

CREATE POLICY "Admins can view all services" ON public.services FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can insert services" ON public.services FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update services" ON public.services FOR UPDATE TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete services" ON public.services FOR DELETE TO authenticated USING (public.is_admin());

DROP TRIGGER IF EXISTS set_services_updated_at ON public.services;
CREATE TRIGGER set_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Lesson Favorites
CREATE TABLE IF NOT EXISTS public.lesson_favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  lesson_id UUID REFERENCES public.lessons ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_lesson_favorites_user_id ON public.lesson_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_favorites_lesson_id ON public.lesson_favorites(lesson_id);

ALTER TABLE public.lesson_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
  ON public.lesson_favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON public.lesson_favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON public.lesson_favorites FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================
-- 5. SEED DATA (Exemplo)
-- =============================================
-- Descomente e ajuste para inserir seu curso.
-- O kiwify_product_id deve ser o ID do seu produto na Kiwify.

/*
-- Curso exemplo
INSERT INTO public.courses (title, description, slug, kiwify_product_id, thumbnail_url) VALUES
(
  'Curso Completo de Assessoria',
  'Aprenda tudo sobre assessoria contábil do zero ao avançado com a Franca Assessoria.',
  'curso-assessoria-completo',
  'SEU_KIWIFY_PRODUCT_ID_AQUI',
  NULL
);

-- Módulos do curso (ajuste o course_id)
-- Pegue o ID do curso inserido acima e substitua abaixo:

-- INSERT INTO public.modules (course_id, title, description, order_index) VALUES
-- ('COURSE_UUID_AQUI', 'Módulo 1 - Introdução', 'Bem-vindo ao curso', 1),
-- ('COURSE_UUID_AQUI', 'Módulo 2 - Fundamentos', 'Conceitos básicos', 2),
-- ('COURSE_UUID_AQUI', 'Módulo 3 - Prática', 'Mãos à obra', 3);

-- Aulas dos módulos (ajuste o module_id):

-- INSERT INTO public.lessons (module_id, title, description, video_id, duration_seconds, order_index) VALUES
-- ('MODULE_UUID_AQUI', 'Aula 1 - Boas-vindas', 'Conheça o curso', 'BUNNY_VIDEO_ID', 300, 1),
-- ('MODULE_UUID_AQUI', 'Aula 2 - Primeiros passos', 'Como começar', 'BUNNY_VIDEO_ID', 600, 2);
*/
