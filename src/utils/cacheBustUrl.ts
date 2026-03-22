/** 为静态资源 URL 追加单次会话内稳定的缓存破坏参数（避免组件重渲染时不断换 URL） */
export function withCacheBust(url: string, token: number): string {
  const sep = url.includes('?') ? '&' : '?';
  return `${url}${sep}v=${token}`;
}
