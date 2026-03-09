-- =============================================
-- FRANCA ACADEMY - SEED: NO CONTROLE DO TRÁFEGO
-- =============================================
-- Execute DEPOIS do schema.sql
-- =============================================

-- 1. Curso
INSERT INTO public.courses (id, title, description, slug, kiwify_product_id, thumbnail_url)
VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'No Controle do Tráfego',
  'O protocolo que te dá clareza sobre onde seu dinheiro está indo — e o poder pra saber cobrar resultado de verdade, sem ser enrolado por agências ou gestores de tráfego.',
  'no-controle-do-trafego',
  '5ca81d50-1814-11f1-8d5c-1dd38c4378ae',
  NULL
);

-- 2. Módulos
INSERT INTO public.modules (id, course_id, title, description, order_index) VALUES
('a0000001-0000-0000-0000-000000000001', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Como o algoritmo funciona — e como jogar a favor dele', 'Antes de cobrar resultado, você precisa entender as regras do jogo. Aqui você aprende os princípios básicos do tráfego pago: como as plataformas decidem para quem mostrar seu anúncio e como usar isso a seu favor.', 1),
('a0000001-0000-0000-0000-000000000002', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'As métricas que realmente importam para o seu negócio', 'Chega de se perder em dashboards cheios de número que não dizem nada. Você vai aprender quais indicadores olhar de acordo com o seu modelo de negócio — e como saber se o resultado está bom ou ruim, sem achismo.', 2),
('a0000001-0000-0000-0000-000000000003', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Como acessar suas campanhas e verificar o que está sendo feito', 'A agência diz que está trabalhando. Mas como você sabe que é verdade? Aqui você aprende o passo a passo simples para acessar o gerenciador, verificar atualizações e conferir se as edições prometidas realmente aconteceram.', 3),
('a0000001-0000-0000-0000-000000000004', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Como criar uma rotina de gestão e parar de delegar no escuro', 'Delegar não é largar. É acompanhar. Você vai montar uma rotina simples de gestão para ter controle real sobre quem você contratou — saber o que perguntar, quando cobrar e como identificar se a equipe está entregando.', 4);

-- =============================================
-- 3. AULAS (placeholder — ajuste conforme seus vídeos reais)
-- =============================================
-- IMPORTANTE: Substitua 'BUNNY_VIDEO_ID' pelo ID real
-- de cada vídeo após upload no Bunny Stream.
--
-- Para adicionar/remover aulas, basta editar abaixo.
-- O order_index define a ordem dentro do módulo.
-- =============================================

-- Módulo 1: Como o algoritmo funciona
INSERT INTO public.lessons (module_id, title, description, video_id, duration_seconds, order_index) VALUES
('a0000001-0000-0000-0000-000000000001', 'Boas-vindas ao curso', 'Apresentação do curso e o que você vai aprender', 'BUNNY_VIDEO_ID', NULL, 1),
('a0000001-0000-0000-0000-000000000001', 'O que é tráfego pago (sem tecniquês)', 'Entendendo o conceito de forma simples e direta', 'BUNNY_VIDEO_ID', NULL, 2),
('a0000001-0000-0000-0000-000000000001', 'Como o algoritmo decide pra quem mostrar seu anúncio', 'Leilão, público e relevância — as regras do jogo', 'BUNNY_VIDEO_ID', NULL, 3),
('a0000001-0000-0000-0000-000000000001', 'Como usar o algoritmo a seu favor', 'O que fazer (e o que não fazer) pra ter melhores resultados', 'BUNNY_VIDEO_ID', NULL, 4);

-- Módulo 2: As métricas que realmente importam
INSERT INTO public.lessons (module_id, title, description, video_id, duration_seconds, order_index) VALUES
('a0000001-0000-0000-0000-000000000002', 'O problema dos relatórios que não dizem nada', 'Por que dashboards cheios de métricas confundem mais do que ajudam', 'BUNNY_VIDEO_ID', NULL, 1),
('a0000001-0000-0000-0000-000000000002', 'As 5 métricas que todo empresário precisa conhecer', 'CPA, ROAS, CTR, CPM e Conversão — explicados de forma simples', 'BUNNY_VIDEO_ID', NULL, 2),
('a0000001-0000-0000-0000-000000000002', 'Como saber se o resultado está bom ou ruim', 'Benchmarks práticos por tipo de negócio', 'BUNNY_VIDEO_ID', NULL, 3),
('a0000001-0000-0000-0000-000000000002', 'Sinais de alerta: quando o dinheiro está sendo desperdiçado', 'Red flags que indicam problema na operação', 'BUNNY_VIDEO_ID', NULL, 4);

-- Módulo 3: Como acessar e verificar suas campanhas
INSERT INTO public.lessons (module_id, title, description, video_id, duration_seconds, order_index) VALUES
('a0000001-0000-0000-0000-000000000003', 'Acessando o Gerenciador de Anúncios (Meta)', 'Passo a passo para entrar e navegar no gerenciador', 'BUNNY_VIDEO_ID', NULL, 1),
('a0000001-0000-0000-0000-000000000003', 'Acessando o Google Ads', 'Como verificar suas campanhas no Google', 'BUNNY_VIDEO_ID', NULL, 2),
('a0000001-0000-0000-0000-000000000003', 'O que conferir: edições, orçamento e status', 'Checklist do que verificar toda semana', 'BUNNY_VIDEO_ID', NULL, 3),
('a0000001-0000-0000-0000-000000000003', 'Como identificar se a agência está realmente trabalhando', 'O que uma operação ativa parece vs. uma abandonada', 'BUNNY_VIDEO_ID', NULL, 4);

-- Módulo 4: Rotina de gestão
INSERT INTO public.lessons (module_id, title, description, video_id, duration_seconds, order_index) VALUES
('a0000001-0000-0000-0000-000000000004', 'Delegar não é largar: a mentalidade certa', 'Como pensar sobre a relação com quem você contrata', 'BUNNY_VIDEO_ID', NULL, 1),
('a0000001-0000-0000-0000-000000000004', 'Montando sua rotina semanal de acompanhamento', 'O que olhar, quando olhar e com que frequência', 'BUNNY_VIDEO_ID', NULL, 2),
('a0000001-0000-0000-0000-000000000004', 'As perguntas certas pra fazer ao seu gestor', 'Roteiro prático de perguntas que revelam a verdade', 'BUNNY_VIDEO_ID', NULL, 3),
('a0000001-0000-0000-0000-000000000004', 'Quando trocar de gestor/agência', 'Sinais claros de que é hora de mudar', 'BUNNY_VIDEO_ID', NULL, 4);

-- =============================================
-- PRÓXIMOS PASSOS:
-- 1. Execute este SQL no Supabase SQL Editor
-- 2. Depois de subir os vídeos no Bunny Stream,
--    atualize cada aula com o video_id real:
--
--    UPDATE public.lessons
--    SET video_id = 'id-real-do-bunny',
--        duration_seconds = 600
--    WHERE title = 'Nome da Aula';
-- =============================================
