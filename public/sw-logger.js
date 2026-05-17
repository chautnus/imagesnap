// public/sw-logger.js - File độc lập chuyên biệt xử lý Log lỗi cho Service Worker (v1.10.21)
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

  // 4. Trích xuất toàn bộ vết tích
  getTrace: function() {
    return self._swTrace;
  },

  // 5. Ghi nhận bản ghi lỗi siêu nhẹ vào IndexedDB (Tầng 1 Fallback)
  writeErrorToIDB: function(sid, errMessage) {
    return new Promise((resolve) => {
      const DB_NAME = 'imagesnap-pwa-db';
      const STORE_NAME = 'shares';
      const DB_VERSION = 2; // Giữ nguyên DB Version 2, tuyệt đối an toàn!

      const request = indexedDB.open(DB_NAME, DB_VERSION);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        try {
          const transaction = db.transaction(STORE_NAME, 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          // Ghi bản ghi sự cố cực nhẹ (KHÔNG CÓ ẢNH)
          const errorPayload = {
            is_error: true,
            error_message: errMessage,
            sw_logs: self._swTrace,
            timestamp: Date.now()
          };
          
          const putReq = store.put(errorPayload, sid);
          
          putReq.onsuccess = () => {
            // Đợi transaction hoàn tất
          };
          
          transaction.oncomplete = () => {
            db.close();
            resolve(true);
          };
          
          transaction.onerror = () => {
            db.close();
            resolve(false);
          };
        } catch (e) {
          db.close();
          resolve(false);
        }
      };
      
      request.onerror = () => resolve(false);
    });
  }
};
