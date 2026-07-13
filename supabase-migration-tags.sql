-- =====================================================
-- MIGRATION: Normalized tags (TourTag + tour_tags M2M)
-- Additive & idempotent. Run AFTER supabase-migration-packages.sql
-- (it backfills from the tours.tags JSON cache added there).
-- =====================================================

-- Tag definitions
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tour <-> Tag many-to-many
CREATE TABLE IF NOT EXISTS tour_tags (
  tour_id INTEGER NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (tour_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_tour_tags_tour ON tour_tags(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_tags_tag ON tour_tags(tag_id);

-- RLS (matches project convention)
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_tags ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable all for anon on tags" ON tags;
CREATE POLICY "Enable all for anon on tags" ON tags FOR ALL TO anon USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "Enable all for anon on tour_tags" ON tour_tags;
CREATE POLICY "Enable all for anon on tour_tags" ON tour_tags FOR ALL TO anon USING (true) WITH CHECK (true);

-- Backfill from the tours.tags JSON cache (only array-shaped values).
INSERT INTO tags (name, slug)
SELECT DISTINCT trim(elem), lower(regexp_replace(trim(elem), '[^a-zA-Z0-9]+', '-', 'g'))
FROM tours t
CROSS JOIN LATERAL jsonb_array_elements_text(t.tags::jsonb) AS elem
WHERE t.tags IS NOT NULL AND t.tags LIKE '[%' AND trim(elem) <> ''
ON CONFLICT (name) DO NOTHING;

INSERT INTO tour_tags (tour_id, tag_id)
SELECT t.id, tg.id
FROM tours t
CROSS JOIN LATERAL jsonb_array_elements_text(t.tags::jsonb) AS elem
JOIN tags tg ON tg.name = trim(elem)
WHERE t.tags IS NOT NULL AND t.tags LIKE '[%'
ON CONFLICT (tour_id, tag_id) DO NOTHING;
