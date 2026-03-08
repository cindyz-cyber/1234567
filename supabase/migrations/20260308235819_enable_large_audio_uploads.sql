/*
  # 启用大文件音频上传支持

  1. 说明
    - 移除 audio-files bucket 的文件大小限制
    - 允许上传最大 100MB 的音频文件
    - 支持 192kbps 高品质长音频（30分钟约 43MB）
  
  2. 修改内容
    - 更新 storage.buckets 表，设置 file_size_limit 为 104857600 (100MB)
    - 确保现有的 RLS 策略不受影响
  
  3. 技术要点
    - Supabase Storage 默认文件大小限制为 50MB
    - 对于背景音乐场景，需要支持更大的文件
    - 192kbps MP3 格式：1分钟约 1.44MB，30分钟约 43MB
*/

-- 更新 audio-files bucket 配置，允许最大 100MB 文件
UPDATE storage.buckets
SET file_size_limit = 104857600
WHERE id = 'audio-files';

-- 验证配置
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM storage.buckets 
    WHERE id = 'audio-files' 
    AND file_size_limit >= 104857600
  ) THEN
    RAISE NOTICE '✅ audio-files bucket 已配置为支持最大 100MB 文件上传';
  ELSE
    RAISE WARNING '⚠️ audio-files bucket 配置可能未生效';
  END IF;
END $$;
