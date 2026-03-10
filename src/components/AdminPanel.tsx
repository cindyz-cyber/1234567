import { useState, useEffect } from 'react';
import { Upload, Trash2, Play, Pause, CheckCircle, Circle, Database, FileText } from 'lucide-react';
import { supabase } from '../lib/supabase';
import KnowledgeBaseSeeder from './KnowledgeBaseSeeder';
import PageContentAdmin from './PageContentAdmin';
import { playAudioFromZero } from '../utils/audioManager';

interface AudioFile {
  id: string;
  file_name: string;
  file_path: string;
  file_type: string;
  duration: number;
  is_active: boolean;
  uploaded_at: string;
  description: string | null;
}

export default function AdminPanel() {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [activeView, setActiveView] = useState<'audio' | 'knowledge' | 'content'>('audio');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{ message: string; onConfirm: () => void } | null>(null);

  useEffect(() => {
    loadAudioFiles();
  }, []);

  const loadAudioFiles = async () => {
    const { data, error } = await supabase
      .from('audio_files')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (error) {
      console.error('Error loading audio files:', error);
      return;
    }

    setAudioFiles(data || []);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // 支持音频格式 + MP4 视频格式（可包含音频）
    const audioFiles = Array.from(files).filter(file =>
      file.type.startsWith('audio/') ||
      file.type === 'video/mp4' ||
      file.name.toLowerCase().endsWith('.mp3') ||
      file.name.toLowerCase().endsWith('.wav') ||
      file.name.toLowerCase().endsWith('.ogg') ||
      file.name.toLowerCase().endsWith('.m4a') ||
      file.name.toLowerCase().endsWith('.mp4')
    );

    if (audioFiles.length === 0) {
      setToast({ message: '请选择音频文件（MP3、WAV、OGG、M4A、MP4格式）', type: 'warning' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      let successCount = 0;
      let failCount = 0;
      const totalFiles = audioFiles.length;

      for (let i = 0; i < audioFiles.length; i++) {
        const file = audioFiles[i];
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `guidance/${fileName}`;

          console.group(`📤 分片上传 - ${file.name}`);
          console.log('📊 文件大小:', (file.size / 1024 / 1024).toFixed(2), 'MB');
          console.log('🔢 总文件数:', totalFiles, '当前:', i + 1);

          const CHUNK_SIZE = 5 * 1024 * 1024;
          const isLargeFile = file.size > CHUNK_SIZE;

          if (isLargeFile) {
            console.log('🚀 启用分片上传模式 (Chunk Size: 5MB)');
            const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

            for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
              const start = chunkIndex * CHUNK_SIZE;
              const end = Math.min(start + CHUNK_SIZE, file.size);
              const chunk = file.slice(start, end);

              const chunkProgress = (chunkIndex + 1) / totalChunks;
              const fileProgress = (i + chunkProgress) / totalFiles;
              setUploadProgress(Math.round(fileProgress * 100));

              console.log(`📦 上传分片 ${chunkIndex + 1}/${totalChunks} (${Math.round(chunkProgress * 100)}%)`);

              if (chunkIndex === 0) {
                const { error: uploadError } = await supabase.storage
                  .from('audio-files')
                  .upload(filePath, chunk, {
                    cacheControl: '3600',
                    upsert: false
                  });

                if (uploadError) throw uploadError;
              } else {
                const { error: updateError } = await supabase.storage
                  .from('audio-files')
                  .update(filePath, chunk, {
                    cacheControl: '3600',
                    upsert: true
                  });

                if (updateError) throw updateError;
              }
            }
            console.log('✅ 分片上传完成');
          } else {
            console.log('📤 使用标准上传模式');
            const { error: uploadError } = await supabase.storage
              .from('audio-files')
              .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
              });

            if (uploadError) {
              console.error('Upload error:', uploadError);
              throw uploadError;
            }

            const fileProgress = (i + 1) / totalFiles;
            setUploadProgress(Math.round(fileProgress * 100));
          }

          console.groupEnd();

          const audio = new Audio();
          audio.src = URL.createObjectURL(file);

          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Audio metadata loading timeout'));
            }, 10000);

            audio.onloadedmetadata = async () => {
              clearTimeout(timeout);
              try {
                const duration = Math.round(audio.duration);
                console.log('Audio duration:', duration, 'for file:', file.name);

                const { data, error: dbError } = await supabase
                  .from('audio_files')
                  .insert({
                    file_name: file.name,
                    file_path: filePath,
                    file_type: 'guidance',
                    duration: duration,
                    is_active: true,
                    description: null
                  })
                  .select();

                if (dbError) {
                  console.error('Database insert error:', dbError);
                  throw dbError;
                }

                console.log('Successfully inserted into database:', data);
                successCount++;
                URL.revokeObjectURL(audio.src);
                resolve(null);
              } catch (err) {
                console.error('Error in metadata handler:', err);
                URL.revokeObjectURL(audio.src);
                reject(err);
              }
            };

            audio.onerror = (err) => {
              clearTimeout(timeout);
              console.error('Audio loading error:', err);
              URL.revokeObjectURL(audio.src);
              reject(err);
            };
          });
        } catch (error) {
          console.error('Upload error for file:', file.name, error);
          failCount++;
        }
      }

      await loadAudioFiles();
      setUploadProgress(100);

      if (failCount === 0) {
        setToast({ message: `成功上传 ${successCount} 个音频文件！`, type: 'success' });
      } else {
        setToast({ message: `上传完成：成功 ${successCount} 个，失败 ${failCount} 个`, type: 'warning' });
      }
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setToast({ message: '上传失败，请重试', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setUploading(false);
      setUploadProgress(0);
      event.target.value = '';
    }
  };

  const toggleActive = async (file: AudioFile) => {
    const { error } = await supabase
      .from('audio_files')
      .update({ is_active: !file.is_active })
      .eq('id', file.id);

    if (error) {
      console.error('Error updating:', error);
      return;
    }

    await loadAudioFiles();
  };

  const deleteFile = async (file: AudioFile) => {
    setConfirmDialog({
      message: `确定要删除"${file.file_name}"吗？此操作无法撤销。`,
      onConfirm: async () => {
        const { error: storageError } = await supabase.storage
          .from('audio-files')
          .remove([file.file_path]);

        if (storageError) {
          console.error('Storage delete error:', storageError);
        }

        const { error: dbError } = await supabase
          .from('audio_files')
          .delete()
          .eq('id', file.id);

        if (dbError) {
          console.error('Database delete error:', dbError);
          setToast({ message: '删除失败，请重试', type: 'error' });
          setTimeout(() => setToast(null), 3000);
          return;
        }

        await loadAudioFiles();
        setToast({ message: '删除成功', type: 'success' });
        setTimeout(() => setToast(null), 3000);
        setConfirmDialog(null);
      }
    });
  };

  const playAudio = async (file: AudioFile) => {
    if (audioElement) {
      audioElement.pause();
      setAudioElement(null);
    }

    if (playingId === file.id) {
      setPlayingId(null);
      return;
    }

    const { data } = await supabase.storage
      .from('audio-files')
      .getPublicUrl(file.file_path);

    const audio = new Audio(data.publicUrl);
    audio.onended = () => {
      setPlayingId(null);
      setAudioElement(null);
    };

    setAudioElement(audio);
    setPlayingId(file.id);

    // 🔥 使用双重强制归零播放器
    playAudioFromZero(audio).catch(err => {
      console.error('播放失败:', err);
      setPlayingId(null);
      setAudioElement(null);
    });
  };

  if (activeView === 'knowledge') {
    return (
      <div>
        <div className="fixed top-8 left-8 z-50 flex gap-3">
          <button
            onClick={() => setActiveView('audio')}
            className="px-6 py-3 rounded-lg transition-all flex items-center gap-2"
            style={{
              background: 'rgba(235, 200, 98, 0.2)',
              border: '1px solid rgba(235, 200, 98, 0.5)',
              color: '#EBC862',
              letterSpacing: '0.2em'
            }}
          >
            <Upload size={20} />
            音频管理
          </button>
          <button
            onClick={() => setActiveView('content')}
            className="px-6 py-3 rounded-lg transition-all flex items-center gap-2"
            style={{
              background: 'rgba(235, 200, 98, 0.2)',
              border: '1px solid rgba(235, 200, 98, 0.5)',
              color: '#EBC862',
              letterSpacing: '0.2em'
            }}
          >
            <FileText size={20} />
            文案配置
          </button>
        </div>
        <KnowledgeBaseSeeder />
      </div>
    );
  }

  if (activeView === 'content') {
    return (
      <div>
        <div className="fixed top-8 left-8 z-50 flex gap-3">
          <button
            onClick={() => setActiveView('audio')}
            className="px-6 py-3 rounded-lg transition-all flex items-center gap-2"
            style={{
              background: 'rgba(235, 200, 98, 0.2)',
              border: '1px solid rgba(235, 200, 98, 0.5)',
              color: '#EBC862',
              letterSpacing: '0.2em'
            }}
          >
            <Upload size={20} />
            音频管理
          </button>
          <button
            onClick={() => setActiveView('knowledge')}
            className="px-6 py-3 rounded-lg transition-all flex items-center gap-2"
            style={{
              background: 'rgba(235, 200, 98, 0.2)',
              border: '1px solid rgba(235, 200, 98, 0.5)',
              color: '#EBC862',
              letterSpacing: '0.2em'
            }}
          >
            <Database size={20} />
            知识库录入
          </button>
        </div>
        <PageContentAdmin />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light mb-2">音频管理后台</h1>
            <p className="text-slate-400">上传和管理35秒引导音频</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setActiveView('knowledge')}
              className="px-6 py-3 rounded-lg transition-all flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/50 hover:from-amber-500/30 hover:to-yellow-500/30"
            >
              <Database size={20} />
              知识库录入
            </button>
            <button
              onClick={() => setActiveView('content')}
              className="px-6 py-3 rounded-lg transition-all flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-2 border-blue-500/50 hover:from-blue-500/30 hover:to-cyan-500/30"
            >
              <FileText size={20} />
              页面文案配置
            </button>
          </div>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-slate-700">
          <label className="block">
            <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border-2 border-amber-500/50 rounded-xl cursor-pointer hover:from-amber-500/30 hover:to-yellow-500/30 transition-all">
              <Upload size={24} className="text-amber-400" />
              <span className="text-lg font-medium">
                {uploading ? '批量上传中...' : '点击批量上传音频文件'}
              </span>
            </div>
            <input
              type="file"
              accept="audio/*,video/mp4,.mp3,.wav,.ogg,.m4a,.mp4"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>

          {uploading && uploadProgress > 0 && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-slate-300 mb-2">
                <span>上传进度</span>
                <span className="font-semibold text-amber-400">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-slate-400 mt-2 text-center">
                大文件自动启用分片上传模式（5MB/片）
              </p>
            </div>
          )}

          <p className="text-sm text-slate-400 mt-3 text-center">
            支持批量上传（可选择多个文件），格式：MP3、WAV、OGG、M4A、MP4
          </p>
          <p className="text-xs text-green-400 mt-1 text-center font-medium">
            ✨ 已支持 192kbps 高品质长音频（最大 100MB），自动分片上传 + 流式播放
          </p>
        </div>

        <div className="space-y-4">
          {audioFiles.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p>暂无音频文件，请上传第一个音频</p>
            </div>
          ) : (
            audioFiles.map((file) => (
              <div
                key={file.id}
                className={`bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border transition-all ${
                  file.is_active
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-medium">{file.file_name}</h3>
                      {file.is_active && (
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                          已启用
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>时长: {file.duration}秒</span>
                      <span>上传于: {new Date(file.uploaded_at).toLocaleString('zh-CN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => playAudio(file)}
                      className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      title={playingId === file.id ? '暂停' : '播放'}
                    >
                      {playingId === file.id ? (
                        <Pause size={20} />
                      ) : (
                        <Play size={20} />
                      )}
                    </button>

                    <button
                      onClick={() => toggleActive(file)}
                      className="p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                      title={file.is_active ? '禁用音频' : '启用音频'}
                    >
                      {file.is_active ? (
                        <CheckCircle size={20} className="text-green-400" />
                      ) : (
                        <Circle size={20} className="text-slate-500" />
                      )}
                    </button>

                    <button
                      onClick={() => deleteFile(file)}
                      className="p-3 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                      title="删除"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {toast && (
        <div
          className="fixed top-8 right-8 z-50 px-6 py-4 rounded-xl shadow-2xl animate-slide-in-right"
          style={{
            background: toast.type === 'success'
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95))'
              : toast.type === 'error'
              ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))'
              : 'linear-gradient(135deg, rgba(251, 191, 36, 0.95), rgba(245, 158, 11, 0.95))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            maxWidth: '400px'
          }}
        >
          <div className="flex items-center gap-3">
            <div className="text-2xl">
              {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : '⚠️'}
            </div>
            <p className="text-white font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-slate-700">
            <div className="p-6">
              <h3 className="text-xl font-medium mb-4 text-white">确认操作</h3>
              <p className="text-slate-300 mb-6">{confirmDialog.message}</p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmDialog(null)}
                  className="px-6 py-2.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={confirmDialog.onConfirm}
                  className="px-6 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  确定删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
