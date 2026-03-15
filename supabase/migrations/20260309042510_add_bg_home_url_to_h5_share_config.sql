/*
  # 为 h5_share_config 添加首页背景字段

  1. 新增字段
    - `bg_home_url` (text, nullable)
      - 用于存储首页专属背景 URL
      - 支持 JPG/MP4 格式
      - 为空时降级到 bg_video_url

  2. 说明
    - 首页是引流页的入口，需要独立的视觉配置
    - 支持图片（JPG）和视频（MP4）背景
    - 兼容旧数据（字段可为空）
*/

-- 添加首页背景字段
ALTER TABLE h5_share_config 
ADD COLUMN IF NOT EXISTS bg_home_url text;

-- 添加字段描述
COMMENT ON COLUMN h5_share_config.bg_home_url IS '首页专属背景 URL（支持 JPG/MP4）';
