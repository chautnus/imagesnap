# ADR Index

| id | summary | tags | status | file |
|---|---|---|---|---|
| ADR-001 | Google OAuth2 Authorization Code Flow với server-side refresh_token | auth, security, database, api | accepted | [ADR-001-google-oauth-refresh-token.md](ADR-001-google-oauth-refresh-token.md) |
| ADR-002 | Sửa thông tin Product record bằng cách tái dùng updateRowBySearch() có sẵn, thay vì append-with-flag hoặc endpoint riêng biệt. | data, sheets, edit, api | accepted | [ADR-002-updaterowbysearch-mirror-category.md](ADR-002-updaterowbysearch-mirror-category.md) |
| ADR-003 | Extension chuyển sang response_type=code, tái dùng exchange-code/refresh-token của PWA; vượt rào cản cookie cross-origin bằng chrome.cookies API thay vì nới SameSite hay tạo token type mới. | auth, extension, google-oauth, security, chrome-cookies | accepted | [ADR-003-extension-oauth-code-flow-chrome-cookies.md](ADR-003-extension-oauth-code-flow-chrome-cookies.md) |
