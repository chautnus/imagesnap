"use client";

import React, { useState, useEffect } from 'react';
import { StaffLogin } from '@web/components/StaffLogin';
import { useI18n } from '@shared/lib/i18n';
import { establishSession } from '@shared/lib/google-auth';

export default function StaffPage() {
  const { t } = useI18n();

  const handleStaffLogin = async (credentials: { username: string, masterSpreadsheetId: string, user: any }) => {
    // Save to local storage for use in Dashboard
    localStorage.setItem('ps_staff_token', credentials.user.password);
    localStorage.setItem('ps_staff_email', `${credentials.username}@staff.imagesnap`);
    localStorage.setItem('ps_sheet_id', credentials.masterSpreadsheetId);
    localStorage.setItem('ps_is_staff', 'true');
    
    // Establish secure session cookie for the dashboard
    await establishSession(
      credentials.user.password, 
      `${credentials.username}@staff.imagesnap`, 
      true
    );

    // Redirect to dashboard
    window.location.href = '/dashboard';
  };

  return (
    <div className="bg-bg min-h-screen">
      <StaffLogin 
        onLogin={handleStaffLogin} 
        onBack={() => window.location.href = '/'} 
        t={t} 
      />
    </div>
  );
}
