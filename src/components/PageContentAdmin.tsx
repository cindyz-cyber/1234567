import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Save, RefreshCw, Search, Edit2 } from 'lucide-react';

interface ContentItem {
  id: string;
  scene_token: string;
  page_name: string;
  content_key: string;
  content_value: string;
  description: string;
  updated_at: string;
}

interface PageGroup {
  [key: string]: ContentItem[];
}

export default function PageContentAdmin() {
  const [sceneToken, setSceneToken] = useState('default');
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [editedContents, setEditedContents] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadContents();
  }, [sceneToken]);

  const loadContents = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('page_content_config')
        .select('*')
        .eq('scene_token', sceneToken)
        .order('page_name')
        .order('content_key');

      if (error) throw error;

      setContents(data || []);

      const edited: { [key: string]: string } = {};
      data?.forEach(item => {
        edited[item.id] = item.content_value;
      });
      setEditedContents(edited);

      console.log(`✅ 加载了 ${data?.length || 0} 条文案配置`);
    } catch (error) {
      console.error('❌ 加载文案配置失败:', error);
      showMessage('error', '加载失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = contents.map(item => ({
        id: item.id,
        content_value: editedContents[item.id] || item.content_value,
        updated_at: new Date().toISOString()
      }));

      for (const update of updates) {
        const { error } = await supabase
          .from('page_content_config')
          .update({
            content_value: update.content_value,
            updated_at: update.updated_at
          })
          .eq('id', update.id);

        if (error) throw error;
      }

      showMessage('success', `✅ 成功保存 ${updates.length} 条文案配置`);
      await loadContents();
    } catch (error) {
      console.error('❌ 保存失败:', error);
      showMessage('error', '保存失败，请重试');
    } finally {
      setIsSaving(false);
    }
  };

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const groupedContents = contents.reduce((acc: PageGroup, item) => {
    if (!acc[item.page_name]) {
      acc[item.page_name] = [];
    }
    acc[item.page_name].push(item);
    return acc;
  }, {});

  const filteredGroups = Object.keys(groupedContents).reduce((acc: PageGroup, pageName) => {
    const filtered = groupedContents[pageName].filter(item =>
      item.content_key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content_value.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filtered.length > 0) {
      acc[pageName] = filtered;
    }
    return acc;
  }, {});

  const pageNameMap: { [key: string]: string } = {
    home: '首页',
    naming: '起名页',
    emotion: '情绪扫描',
    journal: '日记页',
    answer: '答案之书',
    card: '能量卡片'
  };

  return (
    <div className="page-content-admin">
      <div className="admin-header">
        <div>
          <h1 className="admin-title">
            <Edit2 size={28} />
            页面文案配置
          </h1>
          <p className="admin-subtitle">动态配置引流页面的所有文字内容</p>
        </div>
      </div>

      <div className="controls-bar">
        <div className="scene-selector">
          <label>场景标识:</label>
          <input
            type="text"
            value={sceneToken}
            onChange={(e) => setSceneToken(e.target.value)}
            placeholder="例如: default, 1234test"
            className="scene-input"
          />
        </div>

        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜索文案..."
            className="search-input"
          />
        </div>

        <div className="action-buttons">
          <button
            onClick={loadContents}
            disabled={isLoading}
            className="btn-secondary"
          >
            <RefreshCw size={18} className={isLoading ? 'spinning' : ''} />
            刷新
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="btn-primary"
          >
            <Save size={18} />
            {isSaving ? '保存中...' : '保存所有修改'}
          </button>
        </div>
      </div>

      {message && (
        <div className={`message-banner ${message.type}`}>
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className="loading-state">
          <div className="spinner" />
          <p>加载中...</p>
        </div>
      ) : (
        <div className="content-groups">
          {Object.keys(filteredGroups).length === 0 ? (
            <div className="empty-state">
              <p>未找到匹配的文案配置</p>
              <button onClick={loadContents} className="btn-secondary">
                重新加载
              </button>
            </div>
          ) : (
            Object.keys(filteredGroups).map(pageName => (
              <div key={pageName} className="page-group">
                <h2 className="page-group-title">
                  {pageNameMap[pageName] || pageName}
                  <span className="item-count">
                    {filteredGroups[pageName].length} 项
                  </span>
                </h2>
                <div className="content-grid">
                  {filteredGroups[pageName].map(item => (
                    <div key={item.id} className="content-item">
                      <div className="content-header">
                        <label className="content-label">
                          {item.description || item.content_key}
                        </label>
                        <code className="content-key">{item.content_key}</code>
                      </div>
                      <textarea
                        value={editedContents[item.id] || ''}
                        onChange={(e) => setEditedContents({
                          ...editedContents,
                          [item.id]: e.target.value
                        })}
                        className="content-textarea"
                        rows={3}
                        placeholder="输入文案内容..."
                      />
                      <div className="content-footer">
                        <span className="char-count">
                          {(editedContents[item.id] || '').length} 字符
                        </span>
                        <span className="updated-time">
                          更新于 {new Date(item.updated_at).toLocaleString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <style>{`
        .page-content-admin {
          padding: 32px;
          max-width: 1400px;
          margin: 0 auto;
          background: linear-gradient(180deg, #0a0e27 0%, #1a1a2e 100%);
          min-height: 100vh;
        }

        .admin-header {
          margin-bottom: 32px;
          padding-bottom: 24px;
          border-bottom: 1px solid rgba(247, 231, 206, 0.15);
        }

        .admin-title {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 32px;
          font-weight: 300;
          color: #F7E7CE;
          letter-spacing: 0.1em;
          margin-bottom: 8px;
        }

        .admin-subtitle {
          font-size: 16px;
          color: rgba(247, 231, 206, 0.6);
          letter-spacing: 0.05em;
          margin-left: 44px;
        }

        .controls-bar {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
          align-items: center;
        }

        .scene-selector {
          display: flex;
          align-items: center;
          gap: 12px;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid rgba(247, 231, 206, 0.15);
        }

        .scene-selector label {
          color: #F7E7CE;
          font-size: 14px;
          letter-spacing: 0.05em;
        }

        .scene-input {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(247, 231, 206, 0.2);
          border-radius: 8px;
          padding: 8px 16px;
          color: #F7E7CE;
          font-size: 14px;
          min-width: 200px;
        }

        .scene-input:focus {
          outline: none;
          border-color: #EBC862;
          background: rgba(255, 255, 255, 0.12);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px 20px;
          border-radius: 12px;
          border: 1px solid rgba(247, 231, 206, 0.15);
          flex: 1;
          max-width: 400px;
        }

        .search-box svg {
          color: rgba(247, 231, 206, 0.5);
        }

        .search-input {
          background: transparent;
          border: none;
          color: #F7E7CE;
          font-size: 14px;
          flex: 1;
          outline: none;
        }

        .search-input::placeholder {
          color: rgba(247, 231, 206, 0.4);
        }

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-left: auto;
        }

        .btn-primary, .btn-secondary {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 1px solid;
        }

        .btn-primary {
          background: linear-gradient(135deg, rgba(235, 200, 98, 0.2), rgba(247, 231, 206, 0.15));
          border-color: rgba(235, 200, 98, 0.4);
          color: #EBC862;
        }

        .btn-primary:hover:not(:disabled) {
          background: linear-gradient(135deg, rgba(235, 200, 98, 0.3), rgba(247, 231, 206, 0.25));
          border-color: #EBC862;
          box-shadow: 0 4px 20px rgba(235, 200, 98, 0.3);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(247, 231, 206, 0.2);
          color: rgba(247, 231, 206, 0.8);
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(247, 231, 206, 0.3);
        }

        .btn-primary:disabled, .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .message-banner {
          padding: 16px 24px;
          border-radius: 12px;
          margin-bottom: 24px;
          font-size: 14px;
          letter-spacing: 0.05em;
          animation: slideDown 0.3s ease;
        }

        .message-banner.success {
          background: rgba(76, 175, 80, 0.15);
          border: 1px solid rgba(76, 175, 80, 0.3);
          color: #81C784;
        }

        .message-banner.error {
          background: rgba(244, 67, 54, 0.15);
          border: 1px solid rgba(244, 67, 54, 0.3);
          color: #E57373;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loading-state, .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          color: rgba(247, 231, 206, 0.6);
          font-size: 16px;
          letter-spacing: 0.1em;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(247, 231, 206, 0.2);
          border-top-color: #EBC862;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        .spinning {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .content-groups {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .page-group {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(247, 231, 206, 0.1);
          border-radius: 16px;
          padding: 24px;
        }

        .page-group-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 22px;
          font-weight: 300;
          color: #F7E7CE;
          letter-spacing: 0.15em;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(247, 231, 206, 0.1);
        }

        .item-count {
          font-size: 14px;
          color: rgba(247, 231, 206, 0.5);
          font-weight: 400;
        }

        .content-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 20px;
        }

        @media (max-width: 900px) {
          .content-grid {
            grid-template-columns: 1fr;
          }
        }

        .content-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(247, 231, 206, 0.15);
          border-radius: 12px;
          padding: 16px;
          transition: all 0.3s ease;
        }

        .content-item:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(247, 231, 206, 0.25);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .content-header {
          display: flex;
          align-items: start;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 12px;
        }

        .content-label {
          font-size: 14px;
          color: #F7E7CE;
          letter-spacing: 0.05em;
          font-weight: 400;
          flex: 1;
        }

        .content-key {
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 11px;
          color: rgba(235, 200, 98, 0.7);
          background: rgba(235, 200, 98, 0.1);
          padding: 4px 8px;
          border-radius: 4px;
          border: 1px solid rgba(235, 200, 98, 0.2);
        }

        .content-textarea {
          width: 100%;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(247, 231, 206, 0.2);
          border-radius: 8px;
          padding: 12px;
          color: rgba(255, 255, 255, 0.95);
          font-size: 14px;
          line-height: 1.6;
          letter-spacing: 0.02em;
          resize: vertical;
          font-family: inherit;
          transition: all 0.3s ease;
        }

        .content-textarea:focus {
          outline: none;
          border-color: #EBC862;
          background: rgba(0, 0, 0, 0.4);
          box-shadow: 0 0 0 3px rgba(235, 200, 98, 0.1);
        }

        .content-textarea::placeholder {
          color: rgba(247, 231, 206, 0.3);
        }

        .content-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 8px;
          font-size: 11px;
          color: rgba(247, 231, 206, 0.4);
        }

        .char-count {
          font-weight: 500;
        }

        .updated-time {
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
