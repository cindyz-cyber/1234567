/*
  # 扩展 H5 分享配置表 - 全页面动态背景控制系统

  1. 新增字段
    - `bg_naming_url` (text) - 起名页面专属背景（视频/图片）
    - `bg_emotion_url` (text) - 情绪选择页面专属背景
    - `bg_journal_url` (text) - 觉察日记书写页专属背景
    - `bg_transition_url` (text) - GoldenTransition 过渡页专属背景
    - `bg_answer_book_url` (text) - 答案之书结果页全屏背景
    - `card_inner_bg_url` (text) - 答案之书结果卡片内部底图背景（html2canvas 截图区域）

  2. 设计理念
    - 完全动态化：管理员可在后台控制每个页面的独立视觉
    - 零代码变更：前端完全从数据库读取，无需修改代码即可换背景
    - 卡片级控制：支持对分享卡片内部背景的精细控制
    - 多媒体支持：所有字段均支持视频或图片 URL

  3. 兼容性
    - 所有字段默认为 NULL，不影响现有配置
    - 前端将实现降级逻辑（如未配置则使用默认背景）
*/

DO $$
BEGIN
  -- 添加起名页面背景字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'h5_share_config' AND column_name = 'bg_naming_url'
  ) THEN
    ALTER TABLE h5_share_config ADD COLUMN bg_naming_url text;
  END IF;

  -- 添加情绪选择页面背景字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'h5_share_config' AND column_name = 'bg_emotion_url'
  ) THEN
    ALTER TABLE h5_share_config ADD COLUMN bg_emotion_url text;
  END IF;

  -- 添加觉察日记书写页背景字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'h5_share_config' AND column_name = 'bg_journal_url'
  ) THEN
    ALTER TABLE h5_share_config ADD COLUMN bg_journal_url text;
  END IF;

  -- 添加过渡页背景字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'h5_share_config' AND column_name = 'bg_transition_url'
  ) THEN
    ALTER TABLE h5_share_config ADD COLUMN bg_transition_url text;
  END IF;

  -- 添加答案之书结果页全屏背景字段
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'h5_share_config' AND column_name = 'bg_answer_book_url'
  ) THEN
    ALTER TABLE h5_share_config ADD COLUMN bg_answer_book_url text;
  END IF;

  -- 添加答案之书卡片内部背景字段（核心需求）
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'h5_share_config' AND column_name = 'card_inner_bg_url'
  ) THEN
    ALTER TABLE h5_share_config ADD COLUMN card_inner_bg_url text;
  END IF;
END $$;
