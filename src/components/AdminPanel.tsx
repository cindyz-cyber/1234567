import { useState, useEffect } from 'react';
import { Upload, Trash2, Play, Pause, CheckCircle, Circle } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

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

    const audioFiles = Array.from(files).filter(file => file.type.startsWith('audio/'));

    if (audioFiles.length === 0) {
      alert('请上传音频文件');
      return;
    }

    setUploading(true);

    try {
      let successCount = 0;
      let failCount = 0;

      for (const file of audioFiles) {
        try {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `guidance/${fileName}`;

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

          const audio = new Audio();
          audio.src = URL.createObjectURL(file);

          await new Promise((resolve, reject) => {
            audio.onloadedmetadata = async () => {
              try {
                const duration = Math.round(audio.duration);

                const { error: dbError } = await supabase
                  .from('audio_files')
                  .insert({
                    file_name: file.name,
                    file_path: filePath,
                    file_type: 'guidance',
                    duration: duration,
                    is_active: true,
                    description: null
                  });

                if (dbError) {
                  console.error('Database error:', dbError);
                  throw dbError;
                }

                successCount++;
                resolve(null);
              } catch (err) {
                reject(err);
              }
            };
            audio.onerror = reject;
          });
        } catch (error) {
          console.error('Upload error for file:', file.name, error);
          failCount++;
        }
      }

      await loadAudioFiles();

      if (failCount === 0) {
        alert(`成功上传 ${successCount} 个音频文件！`);
      } else {
        alert(`上传完成：成功 ${successCount} 个，失败 ${failCount} 个`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('上传失败，请重试');
    } finally {
      setUploading(false);
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
    if (!confirm('确定要删除这个音频文件吗？')) return;

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
      return;
    }

    await loadAudioFiles();
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
    audio.play();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-light mb-2">音频管理后台</h1>
          <p className="text-slate-400">上传和管理35秒引导音频</p>
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
              accept="audio/*"
              multiple
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          <p className="text-sm text-slate-400 mt-3 text-center">
            支持批量上传（可选择多个文件），格式：MP3, WAV, OGG，建议时长35秒-1分钟
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
    </div>
  );
}
