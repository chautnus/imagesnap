import { useState, useEffect } from 'react';

type Lang = 'en' | 'vi';

const translations: Record<string, Record<Lang, string>> = {
  setup: {
    en: 'Setup',
    vi: 'Cài đặt'
  },
  connectWithGoogle: {
    en: 'Connect with Google',
    vi: 'Kết nối với Google'
  },
  capture: {
    en: 'Capture',
    vi: 'Chụp ảnh'
  },
  data: {
    en: 'Data',
    vi: 'Dữ liệu'
  },
  settings: {
    en: 'Settings',
    vi: 'Cài đặt'
  },
  addCategory: {
    en: 'Add Category',
    vi: 'Thêm danh mục'
  },
  categoryNameEn: {
    en: 'Category Name (EN)',
    vi: 'Tên danh mục (Tiếng Anh)'
  },
  categoryNameVi: {
    en: 'Category Name (VI)',
    vi: 'Tên danh mục (Tiếng Việt)'
  },
  save: {
    en: 'Save',
    vi: 'Lưu'
  },
  cancel: {
    en: 'Cancel',
    vi: 'Hủy'
  },
  productName: {
    en: 'Product Name',
    vi: 'Tên sản phẩm'
  },
  price: {
    en: 'Price',
    vi: 'Giá'
  },
  required: {
    en: 'Required',
    vi: 'Bắt buộc'
  },
  syncing: {
    en: 'Syncing...',
    vi: 'Đang đồng bộ...'
  },
  productSaved: {
    en: 'Product saved successfully!',
    vi: 'Đã lưu sản phẩm thành công!'
  },
  loginAsAdmin: {
    en: 'Login as Admin',
    vi: 'Đăng nhập Admin'
  },
  username: {
    en: 'Username',
    vi: 'Tên đăng nhập'
  },
  password: {
    en: 'Password',
    vi: 'Mật khẩu'
  },
  login: {
    en: 'Login',
    vi: 'Đăng nhập'
  },
  setupWizardTitle: {
    en: 'Welcome to ProductSnap',
    vi: 'Chào mừng bạn đến với ProductSnap'
  },
  setupWizardDesc: {
    en: 'Let\'s connect your Google account to host your data.',
    vi: 'Hãy kết nối tài khoản Google của bạn để lưu trữ dữ liệu.'
  },
  tags: {
    en: 'Tags',
    vi: 'Thẻ'
  },
  author: {
    en: 'Author',
    vi: 'Tác giả'
  },
  searchPlaceholder: {
    en: 'Search by name, tags, or author...',
    vi: 'Tìm theo tên, thẻ hoặc tác giả...'
  },
  advancedSearch: {
    en: 'Advanced Search',
    vi: 'Tìm kiếm nâng cao'
  },
  dateFrom: {
    en: 'Date From',
    vi: 'Từ ngày'
  },
  dateTo: {
    en: 'Date To',
    vi: 'Đến ngày'
  },
  bulkImport: {
    en: 'Bulk URL Import',
    vi: 'Nhập URL hàng loạt'
  },
  pasteUrls: {
    en: 'Paste image URLs (one per line)',
    vi: 'Dán link ảnh (mỗi dòng một link)'
  },
  import: {
    en: 'Import',
    vi: 'Nhập'
  },
  snapFromBrowser: {
    en: 'Snap from Browser',
    vi: 'Lấy từ trình duyệt'
  },
  snapFromBrowserDesc: {
    en: 'Extract category & images from active tab',
    vi: 'Lấy dữ liệu & ảnh từ tab đang xem'
  },
  noActiveTab: {
    en: 'No active tab found. Use within an extension context.',
    vi: 'Không tìm thấy tab khả dụng. Vui lòng dùng trong Extension.'
  },
  noImagesFound: {
    en: 'No images found on page.',
    vi: 'Không tìm thấy ảnh trên trang.'
  }
};

export const useI18n = () => {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('ps_lang') as Lang) || 'vi');

  const t = (key: string) => {
    return translations[key]?.[lang] || key;
  };

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'vi' : 'en';
    setLang(newLang);
    localStorage.setItem('ps_lang', newLang);
  };

  return { lang, t, toggleLang };
};
