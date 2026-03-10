/**
 * 旧链接拦截页面 - 物理阻断
 *
 * 用于拦截所有 /share/journey 旧路径
 * 确保无论哪个部署版本都无法访问旧页面
 */

export default function BlockedPage() {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <div className="text-center px-8">
        {/* 警告图标 */}
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* 标题 */}
        <h1 className="text-3xl font-bold text-red-500 mb-4">
          此链接已永久失效
        </h1>

        {/* 说明 */}
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          您访问的页面已废弃，请联系管理员获取最新入口
        </p>

        {/* 提示信息 */}
        <div className="inline-block bg-gray-900 border border-gray-700 rounded-lg px-6 py-4 text-left">
          <p className="text-gray-400 text-sm mb-2">
            <span className="text-red-400 font-semibold">原因：</span>
          </p>
          <ul className="text-gray-500 text-sm space-y-1 list-disc list-inside">
            <li>该路径已被系统禁用</li>
            <li>请使用新的 Flow 引流系统</li>
            <li>访问 <code className="text-blue-400">/flow/*</code> 获取新体验</li>
          </ul>
        </div>

        {/* 技术说明 */}
        <div className="mt-8 text-xs text-gray-600">
          <p>错误代码: DEPRECATED_PATH_BLOCKED</p>
          <p className="mt-1">
            拦截时间: {new Date().toLocaleString('zh-CN', {
              timeZone: 'Asia/Shanghai',
              hour12: false
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
