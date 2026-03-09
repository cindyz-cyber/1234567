/*
  # 确保 Storage CORS 策略正确配置

  1. 说明
    - 确保所有存储桶的文件都配置了正确的 CORS 头
    - 允许跨域访问媒体文件（MP3/MP4）
    - 解决前台无法加载 Supabase Storage 资源的问题
  
  2. CORS 配置
    - Access-Control-Allow-Origin: * （允许所有域名）
    - Access-Control-Allow-Methods: GET, HEAD, OPTIONS
    - Access-Control-Allow-Headers: range, content-type
  
  3. 注意事项
    - Supabase Storage 的 CORS 主要在项目设置中配置
    - 此迁移仅用于文档记录和验证
    - 实际 CORS 配置需要在 Supabase Dashboard 完成
*/

-- 验证存储桶存在
DO $$
BEGIN
  -- 检查 audio-files 存储桶是否存在
  IF EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'audio-files'
  ) THEN
    RAISE NOTICE '✅ audio-files 存储桶已存在';
    RAISE NOTICE '📋 CORS 配置建议:';
    RAISE NOTICE '  - Access-Control-Allow-Origin: *';
    RAISE NOTICE '  - Access-Control-Allow-Methods: GET, HEAD, OPTIONS';
    RAISE NOTICE '  - Access-Control-Allow-Headers: range, content-type';
    RAISE NOTICE '';
    RAISE NOTICE '💡 配置方式:';
    RAISE NOTICE '  1. 访问 Supabase Dashboard';
    RAISE NOTICE '  2. 进入 Storage 设置';
    RAISE NOTICE '  3. 配置 audio-files 存储桶的 CORS 策略';
    RAISE NOTICE '';
    RAISE NOTICE '🔧 或使用 Supabase CLI:';
    RAISE NOTICE '  supabase storage update audio-files --cors-allowed-origins "*"';
  ELSE
    RAISE WARNING '⚠️ audio-files 存储桶不存在，请先创建';
  END IF;
END $$;

-- 确保公开访问策略存在
DO $$
BEGIN
  -- 检查是否已有公开读取策略
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Public read access for audio-files'
  ) THEN
    -- 如果不存在，创建公开读取策略
    EXECUTE 'CREATE POLICY "Public read access for audio-files" ON storage.objects FOR SELECT TO public USING (bucket_id = ''audio-files'')';
    RAISE NOTICE '✅ 已创建公开读取策略';
  ELSE
    RAISE NOTICE '✅ 公开读取策略已存在';
  END IF;
END $$;
