/*
  # 添加 background-music 文件夹上传策略

  1. 说明
    - 允许公开上传音频文件到 background-music 文件夹
    - 支持管理后台直接上传大型背景音乐文件
  
  2. 修改内容
    - 创建新的 INSERT 策略，允许上传到 background-music 文件夹
    - 保持现有的 guidance 文件夹策略不变
  
  3. 安全说明
    - 使用简化的公开上传模式
    - 生产环境建议添加认证限制
*/

-- 允许上传到 background-music 文件夹
CREATE POLICY "Allow uploads to background-music folder"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'audio-files' AND
  (storage.foldername(name))[1] = 'background-music'
);

-- 验证策略创建
DO $$
BEGIN
  RAISE NOTICE '✅ background-music 文件夹上传策略已创建';
  RAISE NOTICE '📁 支持的文件夹: guidance, background-music';
END $$;
