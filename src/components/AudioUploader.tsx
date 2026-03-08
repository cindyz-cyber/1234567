import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Upload, Loader2, Check, AlertCircle } from 'lucide-react';

interface AudioUploaderProps {
  onUploadComplete: (url: string) => void;
  currentUrl?: string;
}

export default function AudioUploader({ onUploadComplete, currentUrl }: AudioUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess(false);
    setProgress(0);

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'mp3') {
      setError('仅支持 .mp3 格式的音频文件');
      return;
    }

    const maxSize = 100 * 1024 * 1024;
    if (file.size > maxSize) {
      setError(`文件大小超过限制（最大 100MB），当前文件: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      return;
    }

    setUploading(true);

    try {
      const fileName = `bg-music-${Date.now()}.mp3`;
      const filePath = `background-music/${fileName}`;

      console.log('🎵 开始上传音频文件:', {
        fileName,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        fileType: file.type
      });

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          setProgress(percentComplete);
          console.log(`📊 上传进度: ${percentComplete}%`);
        }
      });

      const uploadPromise = new Promise<string>((resolve, reject) => {
        xhr.addEventListener('load', async () => {
          if (xhr.status === 200) {
            console.log('✅ 文件上传成功，获取公开 URL...');

            const { data } = supabase.storage
              .from('audio-files')
              .getPublicUrl(filePath);

            if (data?.publicUrl) {
              console.log('✅ 获取公开 URL 成功:', data.publicUrl);
              resolve(data.publicUrl);
            } else {
              reject(new Error('无法获取文件公开 URL'));
            }
          } else {
            reject(new Error(`上传失败: HTTP ${xhr.status}`));
          }
        });

        xhr.addEventListener('error', () => {
          reject(new Error('网络错误，上传失败'));
        });

        xhr.addEventListener('abort', () => {
          reject(new Error('上传已取消'));
        });
      });

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error('❌ Supabase 上传错误:', uploadError);
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('audio-files')
        .getPublicUrl(filePath);

      if (!data?.publicUrl) {
        throw new Error('无法获取文件公开 URL');
      }

      const publicUrl = data.publicUrl;
      console.log('✅ 音频文件上传成功:', publicUrl);

      setProgress(100);
      setSuccess(true);
      onUploadComplete(publicUrl);

      setTimeout(() => {
        setSuccess(false);
        setProgress(0);
      }, 3000);

    } catch (err: any) {
      console.error('❌ 上传失败:', err);
      setError(err.message || '上传失败，请重试');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,audio/mpeg"
        onChange={handleFileSelect}
        className="hidden"
      />

      <button
        type="button"
        onClick={triggerFileSelect}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            上传中... {progress}%
          </>
        ) : success ? (
          <>
            <Check className="w-5 h-5" />
            上传成功
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" />
            选择 MP3 文件上传
          </>
        )}
      </button>

      {uploading && (
        <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {uploading && (
        <div className="text-center">
          <p className="text-xs text-blue-300">
            正在上传大文件，请耐心等待... {progress}%
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/20 border border-red-400/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-200">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-2 p-3 bg-green-500/20 border border-green-400/30 rounded-lg">
          <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-200">文件上传成功，URL 已自动填充</p>
        </div>
      )}

      <div className="p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg">
        <p className="text-xs text-blue-200">
          <strong>格式要求：</strong>仅支持 .mp3 格式，最大 100MB，推荐 192kbps 高品质音频
        </p>
      </div>

      {currentUrl && (
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-xs text-white/60 mb-1">当前音频 URL:</p>
          <p className="text-xs text-white/80 break-all font-mono">{currentUrl}</p>
        </div>
      )}
    </div>
  );
}
