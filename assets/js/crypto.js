/* ============================================================
 *  crypto.js —— 极简浏览器端加解密工具
 *  用途：个人简历的浏览器端加密。
 *  说明：用 Web Crypto API（AES-GCM）+ SHA-256 派生密钥，
 *        全程在本地浏览器完成，密码和明文都不上传、不落盘。
 *        这是“真加密”——拿到密文的人没有密码就解不开。
 * ============================================================ */
(function () {
  'use strict';

  function bytesToHex(bytes) {
    var out = '';
    for (var i = 0; i < bytes.length; i++) { var h = bytes[i].toString(16); if (h.length === 1) h = '0' + h; out += h; }
    return out;
  }
  function hexToBytes(hex) {
    var out = new Uint8Array(hex.length / 2);
    for (var i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
    return out;
  }
  function b64ToBytes(b64) {
    var bin = atob(b64);
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  function bytesToB64(bytes) {
    var bin = '';
    for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  window.sha256hex = async function (text) {
    var data = new TextEncoder().encode(text);
    var digest = await crypto.subtle.digest('SHA-256', data);
    return bytesToHex(new Uint8Array(digest));
  };

  /* 加密：返回 "ivB64:ctB64" 字符串 */
  window.aesEncrypt = async function (plainText, hexKey) {
    var keyBytes = hexToBytes(hexKey);
    var key = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['encrypt']);
    var iv = crypto.getRandomValues(new Uint8Array(12));
    var ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, key, new TextEncoder().encode(plainText));
    return bytesToB64(iv) + ':' + bytesToB64(new Uint8Array(ct));
  };

  /* 解密：入参同加密返回的 "ivB64:ctB64"；失败返回 null */
  window.aesDecrypt = async function (cipher, hexKey) {
    try {
      var parts = cipher.split(':');
      if (parts.length !== 2) return null;
      var key = await crypto.subtle.importKey('raw', hexToBytes(hexKey), { name: 'AES-GCM' }, false, ['decrypt']);
      var pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64ToBytes(parts[0]) }, key, b64ToBytes(parts[1]));
      return new Uint8Array(pt);
    } catch (e) { return null; }
  };
})();
