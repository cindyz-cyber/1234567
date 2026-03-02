/*
  # 创建Kin能量中心表

  1. New Tables
    - `kin_energy_centers` (Kin能量中心表)
      - `id` (uuid, primary key)
      - `kin` (int) - Kin编号 (1-260)
      - `center_name` (text) - 能量中心名称 (心轮/喉轮/松果体)
      - `percentage` (int) - 能量百分比 (0-100)
      - `mode` (text) - 运作模式
      - `description` (text) - 详细描述
      - `icon` (text) - 图标
      - `traits` (text) - 特质
      - `weaknesses` (text) - 弱点
      - `created_at` (timestamptz)

  2. Indexes
    - Index on kin for fast lookup
    - Composite index on (kin, center_name) for unique constraint

  3. Security
    - Enable RLS
    - Public read/write access (for data seeding)
*/

CREATE TABLE IF NOT EXISTS kin_energy_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kin int NOT NULL CHECK (kin >= 1 AND kin <= 260),
  center_name text NOT NULL CHECK (center_name IN ('心轮', '喉轮', '松果体')),
  percentage int NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  mode text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text DEFAULT '⭐',
  traits text,
  weaknesses text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_energy_centers_kin ON kin_energy_centers(kin);
CREATE UNIQUE INDEX IF NOT EXISTS idx_energy_centers_kin_center ON kin_energy_centers(kin, center_name);

ALTER TABLE kin_energy_centers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read energy centers"
  ON kin_energy_centers FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can insert energy centers"
  ON kin_energy_centers FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Public can update energy centers"
  ON kin_energy_centers FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public can delete energy centers"
  ON kin_energy_centers FOR DELETE
  TO public
  USING (true);
