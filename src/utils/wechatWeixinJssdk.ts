/**
 * 微信内置浏览器 JSSDK：拉取后端签名并 wx.config，供录音等接口使用。
 * 后端需实现 GET /api/wechat-config?url=当前页面 URL（不含 hash）
 */
import wx from 'weixin-js-sdk';

export interface WeChatJsConfigPayload {
  appId: string;
  /** 后端返回 number 或 string 均可 */
  timestamp: number | string;
  nonceStr: string;
  signature: string;
}

const WECHAT_CONFIG_PATH = '/api/wechat-config';

export function isWeChatInAppBrowser(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /micromessenger/i.test(navigator.userAgent || '');
}

export async function fetchWeChatJsConfig(): Promise<WeChatJsConfigPayload> {
  const pageUrl = encodeURIComponent(window.location.href.split('#')[0]);
  const res = await fetch(`${WECHAT_CONFIG_PATH}?url=${pageUrl}`, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`[wechat-config] ${res.status} ${text}`);
  }
  return res.json() as Promise<WeChatJsConfigPayload>;
}

/**
 * 请求 /api/wechat-config 并执行 wx.config，在 wx.ready 后 resolve。
 */
export function initWeChatJssdk(): Promise<void> {
  return fetchWeChatJsConfig().then(
    (data) =>
      new Promise<void>((resolve, reject) => {
        wx.config({
          debug: false,
          appId: data.appId,
          timestamp: data.timestamp as number,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['startRecord', 'stopRecord', 'translateVoice', 'onVoiceRecordEnd'],
        });

        wx.ready(() => {
          resolve();
        });

        wx.error((err: unknown) => {
          reject(err ?? new Error('wx.config error'));
        });
      })
  );
}

export { wx };
