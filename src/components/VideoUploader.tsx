import { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function VideoUploader() {
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadVideo = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);
      setUploadedUrl(null);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('请选择一个视频文件');
      }

      const file = event.target.files[0];

      // 检查文件大小（100MB 限制）
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('文件太大！请选择小于 100MB 的视频');
      }

      // 检查文件类型
      if (!file.type.startsWith('video/')) {
        throw new Error('请选择视频文件');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `backgrounds/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('videos')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        throw uploadError;
      }

      // 获取公共 URL
      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      setUploadedUrl(publicUrl);

      console.log('✅ 视频上传成功！');
      console.log('📍 URL:', publicUrl);
      console.log('📋 复制这个 URL 并在代码中使用');

    } catch (error: any) {
      console.error('上传失败:', error);
      setError(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
        <h1 className="text-3xl font-bold text-white mb-2">视频上传工具</h1>
        <p className="text-white/70 mb-8">上传您的背景视频到 Supabase Storage</p>

        <div className="space-y-6">
          {/* 上传区域 */}
          <div className="border-2 border-dashed border-white/30 rounded-xl p-12 text-center hover:border-white/50 transition-colors">
            <input
              type="file"
              accept="video/*"
              onChange={uploadVideo}
              disabled={uploading}
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {uploading ? (
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-white animate-spin" />
              ) : (
                <Upload className="w-16 h-16 mx-auto mb-4 text-white" />
              )}
              <p className="text-xl text-white font-semibold mb-2">
                {uploading ? '上传中...' : '点击选择视频文件'}
              </p>
              <p className="text-white/60 text-sm">
                支持 MP4, WebM, MOV 格式，最大 100MB
              </p>
            </label>
          </div>

          {/* 错误信息 */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-200 font-semibold">上传失败</p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* 成功信息 */}
          {uploadedUrl && (
            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-green-200 font-semibold">上传成功！</p>
                  <p className="text-green-300 text-sm mt-1">视频已上传到 Supabase Storage</p>
                </div>
              </div>

              <div className="bg-black/30 rounded p-3 mt-3">
                <p className="text-white/60 text-xs mb-2">视频 URL（点击复制）：</p>
                <input
                  type="text"
                  value={uploadedUrl}
                  readOnly
                  onClick={(e) => {
                    e.currentTarget.select();
                    navigator.clipboard.writeText(uploadedUrl);
                  }}
                  className="w-full bg-transparent text-white text-sm font-mono border border-white/20 rounded px-3 py-2 cursor-pointer hover:border-white/40 transition-colors"
                />
              </div>

              <div className="mt-4 text-white/80 text-sm">
                <p className="font-semibold mb-2">下一步：在代码中使用这个 URL</p>
                <pre className="bg-black/30 rounded p-3 overflow-x-auto text-xs">
{`<video src="${uploadedUrl}" />`}
                </pre>
              </div>
            </div>
          )}

          {/* 说明 */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4">
            <p className="text-blue-200 text-sm">
              💡 <strong>提示：</strong>上传后，视频将存储在 Supabase 云端，您可以在任何地方使用这个 URL。
              不需要将大文件放在项目代码中。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
