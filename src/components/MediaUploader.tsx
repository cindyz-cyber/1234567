import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, CheckCircle, AlertCircle, X } from 'lucide-react';

interface MediaUploaderProps {
  label: string;
  currentValue?: string;
  onUploadComplete: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  folder?: string;
}

export default function MediaUploader({
  label,
  currentValue,
  onUploadComplete,
  accept = '.jpg,.jpeg,.png,.mp4,.webm',
  maxSizeMB = 100,
  folder = 'background-music'
}: MediaUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentValue || null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // 验证文件大小
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setError(`文件大小不能超过 ${maxSizeMB}MB`);
      return;
    }

    // 验证文件类型
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedTypes = accept.split(',').map(t => t.trim().replace('.', ''));

    if (!fileExtension || !allowedTypes.includes(fileExtension)) {
      setError(`仅支持以下格式: ${accept}`);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      // 生成唯一文件名
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}_${randomStr}.${fileExtension}`;
      const filePath = `${folder}/${fileName}`;

      console.log('📤 开始上传:', {
        fileName,
        filePath,
        size: (file.size / (1024 * 1024)).toFixed(2) + 'MB',
        type: file.type
      });

      // 模拟进度（实际上传不支持实时进度）
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // 上传到 Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      clearInterval(progressInterval);

      if (uploadError) {
        throw uploadError;
      }

      setProgress(100);

      // 获取公开 URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(filePath);

      console.log('✅ 上传成功:', publicUrl);

      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);

      // 重置进度条
      setTimeout(() => {
        setProgress(0);
      }, 1000);

    } catch (err: any) {
      console.error('❌ 上传失败:', err);
      setError(err.message || '上传失败，请重试');
      setProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    onUploadComplete('');
    setError(null);
  };

  const isVideo = previewUrl?.match(/\.(mp4|webm|ogg|mov)$/i);
  const isImage = previewUrl?.match(/\.(jpg|jpeg|png|webp|gif)$/i);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-white/80">
        {label}
      </label>

      {/* 上传按钮 */}
      <div className="flex items-center gap-3">
        <label
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-dashed
            transition-all duration-200 cursor-pointer
            ${uploading
              ? 'bg-white/5 border-white/20 cursor-not-allowed'
              : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-amber-400'
            }
          `}
        >
          <Upload className="w-5 h-5 text-amber-400" />
          <span className="text-white text-sm font-medium">
            {uploading ? '上传中...' : '选择文件上传'}
          </span>
          <input
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>

        {previewUrl && (
          <button
            onClick={handleClear}
            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
            title="清除文件"
          >
            <X className="w-5 h-5 text-red-400" />
          </button>
        )}
      </div>

      {/* 进度条 */}
      {uploading && progress > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>上传进度</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* 错误提示 */}
      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* 当前值显示 */}
      {previewUrl && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-green-400">
            <CheckCircle className="w-4 h-4" />
            <span>当前值</span>
          </div>

          {/* 预览 */}
          {isVideo && (
            <div className="relative w-full aspect-video bg-black/50 rounded-lg overflow-hidden">
              <video
                src={previewUrl}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white flex items-center gap-1">
                <span>🎬</span>
                <span>视频</span>
              </div>
            </div>
          )}

          {isImage && (
            <div className="relative w-full aspect-video bg-black/50 rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="预览"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-xs text-white flex items-center gap-1">
                <span>🖼️</span>
                <span>图片</span>
              </div>
            </div>
          )}

          {/* URL 显示 */}
          <div className="p-3 bg-white/5 border border-white/20 rounded-lg">
            <p className="text-xs text-white/60 break-all font-mono">
              {previewUrl}
            </p>
          </div>
        </div>
      )}

      {/* 提示信息 */}
      <p className="text-xs text-white/40">
        支持格式: {accept} | 最大 {maxSizeMB}MB
      </p>
    </div>
  );
}
