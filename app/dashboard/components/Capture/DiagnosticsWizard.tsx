"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Play, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface DiagnosticsWizardProps {
  shareId: string;
  hasFatalError: boolean;
  onIngestComplete: (data: { images: string[]; title?: string; text?: string; url?: string }) => void;
  onClose: () => void;
}

export const DiagnosticsWizard: React.FC<DiagnosticsWizardProps> = ({
  shareId,
  hasFatalError,
  onIngestComplete,
  onClose
}) => {
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [rawRecord, setRawRecord] = useState<any>(null);
  const [blobUrls, setBlobUrls] = useState<string[]>([]);
  
  const createdUrlsRef = useRef<string[]>([]);

  // Dọn dẹp tất cả các Blob URL tạm thời khi component bị unmount (Audit Stage 2)
  useEffect(() => {
    return () => {
      if (createdUrlsRef.current.length > 0) {
        createdUrlsRef.current.forEach(url => {
          try { URL.revokeObjectURL(url); } catch (e) {}
        });
        createdUrlsRef.current = [];
      }
    };
  }, []);

  // Trạng thái các bước chẩn đoán
  const [step1Status, setStep1Status] = useState<'idle' | 'success' | 'fail'>('idle');
  const [step2Status, setStep2Status] = useState<'idle' | 'success' | 'fail'>('idle');
  const [step3Status, setStep3Status] = useState<'idle' | 'success' | 'fail'>('idle');
  
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  const addLocalLog = (msg: string) => {
    const time = new Date().toISOString().split('T')[1].split('Z')[0];
    setLogs(prev => [...prev, `[${time}] ${msg}`]);
  };

  // BƯỚC 1: Kết nối & Lấy dữ liệu thô từ IndexedDB (shares v2)
  const runStep1 = async () => {
    setLoading(true);
    addLocalLog("--- BẮT ĐẦU CÔNG ĐOẠN 1: Đọc Database IndexedDB ---");
    addLocalLog(`Khóa ID truy cập: ${shareId}`);
    
    const DB_NAME = 'imagesnap-pwa-db';
    const STORE_NAME = 'shares';
    const DB_VERSION = 2; // Giữ nguyên DB v2
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    
    request.onerror = () => {
      setStep1Status('fail');
      setErrorDetails("Lỗi mở IndexedDB. Quyền lưu trữ bị từ chối.");
      addLocalLog("[THẤT BẠI] Không thể kết nối IndexedDB.");
      setLoading(false);
    };
    
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      try {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const getReq = store.get(shareId);
        
        getReq.onsuccess = () => {
          const record = getReq.result;
          if (record) {
            setRawRecord(record);
            setStep1Status('success');
            addLocalLog("[OK] Đọc bản ghi thành công.");
            
            if (record.is_error) {
              setStep1Status('fail');
              setErrorDetails(`Phát hiện bản ghi lỗi từ SW: ${record.error_message}`);
              addLocalLog(`[SW ERROR REPORT] ${record.error_message}`);
              if (record.sw_logs && Array.isArray(record.sw_logs)) {
                addLocalLog("--- Nhật ký chi tiết của SW nhận được từ DB: ---");
                record.sw_logs.forEach((swLog: string) => addLocalLog(`[SW] ${swLog}`));
              }
            } else {
              addLocalLog(`[METADATA] File ảnh gốc: ${record.images?.length || 0} file`);
              addLocalLog(`[METADATA] Tiêu đề: "${record.title || 'Trống'}"`);
              addLocalLog(`[METADATA] URL đính kèm: "${record.url || 'Trống'}"`);
              
              if (record.sw_logs && Array.isArray(record.sw_logs)) {
                addLocalLog("--- Hành trình của SW (Đọc từ DB): ---");
                record.sw_logs.forEach((swLog: string) => addLocalLog(`[SW] ${swLog}`));
              }
              setStep(2); // Cho phép chuyển sang công đoạn 2
            }
          } else {
            setStep1Status('fail');
            setErrorDetails("Không tìm thấy dữ liệu ảnh tương ứng với Share ID này trong Database.");
            addLocalLog("[THẤT BẠI] Bản ghi trống hoặc đã bị dọn dẹp.");
          }
          db.close();
          setLoading(false);
        };
        
        getReq.onerror = () => {
          setStep1Status('fail');
          setErrorDetails("Truy vấn bảng 'shares' thất bại.");
          addLocalLog("[THẤT BẠI] Lỗi transaction.");
          db.close();
          setLoading(false);
        };
      } catch (e: any) {
        setStep1Status('fail');
        setErrorDetails(`DB Error: ${e.message || e}`);
        addLocalLog(`[CRASH] Lỗi biệt lệ: ${e.message}`);
        db.close();
        setLoading(false);
      }
    };
  };

  // BƯỚC 2: Giải mã Blob thành URL hình ảnh vật lý
  const runStep2 = async () => {
    if (!rawRecord || !rawRecord.images) {
      addLocalLog("[LỖI] Thiếu dữ liệu thô để giải mã.");
      return;
    }
    
    setLoading(true);
    addLocalLog("--- BẮT ĐẦU CÔNG ĐOẠN 2: Giải mã Ảnh (Blob URL Conversion) ---");
    
    try {
      const urls: string[] = [];
      rawRecord.images.forEach((blob: Blob, idx: number) => {
        addLocalLog(`Giải mã ảnh ${idx + 1}: ${blob.type || 'image/jpeg'}, dung lượng: ${blob.size} bytes`);
        const url = URL.createObjectURL(blob);
        urls.push(url);
        createdUrlsRef.current.push(url); // Lưu vào ref để dọn dẹp khi unmount (Audit Stage 2)
        addLocalLog(`Sinh URL thành công: ${url}`);
      });
      
      setBlobUrls(urls);
      setStep2Status('success');
      addLocalLog(`[OK] Đã giải mã thành công ${urls.length} ảnh thu nhỏ!`);
      setStep(3); // Cho phép chuyển sang công đoạn 3
    } catch (e: any) {
      setStep2Status('fail');
      setErrorDetails(`Lỗi giải mã ảnh: ${e.message || e}`);
      addLocalLog(`[CRASH] Giải mã thất bại: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // BƯỚC 3: Điền vào Form & Hoàn tất
  const runStep3 = () => {
    addLocalLog("--- BẮT ĐẦU CÔNG ĐOẠN 3: Áp dụng Dữ liệu vào Form ---");
    setLoading(true);
    
    try {
      onIngestComplete({
        images: blobUrls,
        title: rawRecord.title,
        text: rawRecord.text,
        url: rawRecord.url
      });
      
      setStep3Status('success');
      addLocalLog("[OK] Đã chuyển dữ liệu vào Form nhập sản phẩm.");
      addLocalLog("--- QUY TRÌNH CHẨN ĐOÁN TỰ ĐỘNG HOÀN TẤT THÀNH CÔNG! ---");
      
      // Tự động xóa khỏi localStorage khi thành công
      localStorage.removeItem('imagesnap_pending_share_id');
      localStorage.removeItem('imagesnap_pending_fatal_error');
    } catch (e: any) {
      setStep3Status('fail');
      addLocalLog(`[LỖI] Không thể điền dữ liệu: ${e.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Dọn dẹp bản ghi hỏng/lỗi khỏi IDB
  const handlePurge = () => {
    const DB_NAME = 'imagesnap-pwa-db';
    const STORE_NAME = 'shares';
    const DB_VERSION = 2;
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event: any) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = (event: any) => {
      const db = event.target.result;
      try {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        store.delete(shareId);
        addLocalLog("[OK] Đã dọn dẹp bản ghi rác khỏi DB.");
        transaction.oncomplete = () => db.close();
      } catch (e) { db.close(); }
    };
    
    localStorage.removeItem('imagesnap_pending_share_id');
    localStorage.removeItem('imagesnap_pending_fatal_error');
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg border border-accent/20 bg-card/90 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 border-b border-line flex items-center justify-between bg-accent/5">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase text-accent tracking-widest">Share Diagnostic Wizard</span>
            <span className="text-xs text-white/50">Mã phiên: {shareId.substring(0, 10)}...</span>
          </div>
          {hasFatalError && (
            <span className="text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider">
              SW CRASH
            </span>
          )}
        </div>

        {/* Wizard Progress Grid */}
        <div className="p-4 grid grid-cols-3 gap-2 border-b border-line bg-black/20 text-center text-[10px] font-black uppercase">
          <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${step1Status === 'success' ? 'border-accent/40 bg-accent/5 text-accent' : step1Status === 'fail' ? 'border-red-500/40 bg-red-500/5 text-red-400' : 'border-line text-white/30'}`}>
            <span>BƯỚC 1</span>
            <span className="text-[8px] font-medium text-white/40">Đọc DB</span>
          </div>
          <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${step2Status === 'success' ? 'border-accent/40 bg-accent/5 text-accent' : step2Status === 'fail' ? 'border-red-500/40 bg-red-500/5 text-red-400' : 'border-line text-white/30'}`}>
            <span>BƯỚC 2</span>
            <span className="text-[8px] font-medium text-white/40">Giải mã Blob</span>
          </div>
          <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${step3Status === 'success' ? 'border-accent/40 bg-accent/5 text-accent' : step3Status === 'fail' ? 'border-red-500/40 bg-red-500/5 text-red-400' : 'border-line text-white/30'}`}>
            <span>BƯỚC 3</span>
            <span className="text-[8px] font-medium text-white/40">Ghi Form</span>
          </div>
        </div>

        {/* Diagnostic Output Logs Terminal */}
        <div className="flex-1 p-4 overflow-y-auto bg-black/40 font-mono text-[9px] text-white/70 space-y-1.5 min-h-[150px] max-h-[300px]">
          {logs.length === 0 ? (
            <div className="text-white/30 text-center py-8">
              Bảng log trống. Vui lòng bấm "Thực hiện" bên dưới để chẩn đoán.
            </div>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className={log.includes('[OK]') ? 'text-accent' : log.includes('[SW]') ? 'text-blue-400' : log.includes('[THẤT BẠI]') || log.includes('[CRASH]') || log.includes('ERR:') ? 'text-red-400' : ''}>
                {log}
              </div>
            ))
          )}
        </div>

        {/* Thumbnail Preview Area */}
        {blobUrls.length > 0 && (
          <div className="p-4 border-t border-line bg-black/10">
            <span className="text-[9px] font-black uppercase tracking-wider text-white/40 block mb-2">Ảnh được khôi phục thành công:</span>
            <div className="flex gap-2 overflow-x-auto">
              {blobUrls.map((url, idx) => (
                <img key={idx} src={url} className="w-16 h-16 object-cover rounded-xl border border-line bg-card" alt="Decoded preview" />
              ))}
            </div>
          </div>
        )}

        {/* Lỗi cảnh báo chi tiết */}
        {errorDetails && (
          <div className="p-4 border-t border-red-500/20 bg-red-500/5 text-red-400 text-[10px] flex items-start gap-2">
            <XCircle size={14} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold uppercase text-[8px] tracking-wider block text-red-500">Phát hiện sự cố:</span>
              <p className="leading-relaxed text-white/80">{errorDetails}</p>
            </div>
          </div>
        )}

        {/* Actions Button Panel */}
        <div className="p-4 border-t border-line bg-card flex justify-between gap-2">
          <button 
            onClick={() => {
              handlePurge();
              onClose();
            }} 
            className="px-4 py-2 border border-line hover:bg-white/5 rounded-2xl text-[9px] font-black uppercase text-white/40 hover:text-white transition-all"
          >
            Đóng & Dọn DB
          </button>
          
          <div className="flex gap-2">
            {step === 1 && (
              <button 
                onClick={runStep1}
                disabled={loading}
                className="px-6 py-2 bg-accent text-black hover:opacity-90 disabled:opacity-50 rounded-2xl text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg shadow-accent/15 transition-all"
              >
                {loading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
                Chạy khâu 1
              </button>
            )}
            
            {step === 2 && step1Status === 'success' && (
              <button 
                onClick={runStep2}
                disabled={loading}
                className="px-6 py-2 bg-accent text-black hover:opacity-90 disabled:opacity-50 rounded-2xl text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg shadow-accent/15 transition-all"
              >
                {loading ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} />}
                Chạy khâu 2
              </button>
            )}

            {step === 3 && step2Status === 'success' && (
              <button 
                onClick={runStep3}
                disabled={loading}
                className="px-6 py-2 bg-accent text-black hover:opacity-90 disabled:opacity-50 rounded-2xl text-[9px] font-black uppercase flex items-center gap-1.5 shadow-lg shadow-accent/15 transition-all"
              >
                {loading ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle2 size={10} />}
                Chạy khâu 3 (Nhận ảnh)
              </button>
            )}
            
            {step3Status === 'success' && (
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-accent text-black hover:opacity-90 rounded-2xl text-[9px] font-black uppercase transition-all"
              >
                Hoàn tất
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
