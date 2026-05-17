// public/sw-logger.js - File độc lập chuyên biệt xử lý Log cho Service Worker
self._swTrace = [];

self.swLog = {
  // 1. Khởi tạo phiên log mới
  start: function() {
    self._swTrace = ['SW_START'];
    console.log("[SW_LOGGER] Diagnostics Session Started");
  },

  // 2. Ghi nhận một cột mốc
  step: function(name) {
    var timestamp = new Date().toISOString().split('T')[1].split('Z')[0];
    var logItem = `[${timestamp}] ${name}`;
    self._swTrace.push(logItem);
    console.log(`[SW_LOGGER_STEP] ${logItem}`);
  },

  // 3. Ghi nhận lỗi chí mạng
  error: function(errMessage) {
    var timestamp = new Date().toISOString().split('T')[1].split('Z')[0];
    var errItem = `[${timestamp}] ERR:${errMessage}`;
    self._swTrace.push(errItem);
    console.error(`[SW_LOGGER_ERROR] ${errItem}`);
  },

  // 4. Sinh URL chuyển hướng chứa đầy đủ dấu vết để Main Thread thu hoạch
  makeRedirectUrl: function(basePath, params) {
    var url = basePath + "?";
    var queryParts = [];
    
    // Đính kèm các tham số gốc (ví dụ: share_id)
    for (var key in params) {
      if (params[key] !== undefined && params[key] !== null) {
        queryParts.push(key + "=" + encodeURIComponent(params[key]));
      }
    }
    
    // Đính kèm chuỗi trace lịch sử đã mã hóa
    var traceString = self._swTrace.join(' > ');
    queryParts.push("sw_trace=" + encodeURIComponent(traceString));
    
    return url + queryParts.join('&');
  }
};
