import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="mt-32 pt-12 pb-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-sm text-muted max-w-7xl mx-auto px-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white/10 rounded-md flex items-center justify-center">
            <ImageIcon size={14} className="text-white" />
          </div>
          <span className="font-black italic text-white">ImageSnap_</span>
        </div>
        <div className="text-[10px] text-muted max-w-xs leading-relaxed uppercase tracking-widest font-bold">
          Auto-organize team photos and web assets directly in Google Drive.
        </div>
      </div>
      
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-6 font-bold uppercase tracking-widest text-[10px]">
        <div className="flex flex-col gap-4">
          <div className="text-white mb-2">Alternatives</div>
          <Link to="/alternatives/companycam-alternative" className="hover:text-accent transition-colors">CompanyCam</Link>
          <Link to="/alternatives/pics-io-alternative" className="hover:text-accent transition-colors">Pics.io</Link>
          <Link to="/alternatives/google-photos-vs-imagesnap" className="hover:text-accent transition-colors">Google Photos</Link>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-white mb-2">Tools</div>
          <Link to="/tools/exif-viewer" className="hover:text-accent transition-colors">EXIF Viewer</Link>
          <Link to="/tools/bulk-photo-renamer" className="hover:text-accent transition-colors">Photo Renamer</Link>
          <Link to="/tools/drive-folder-generator" className="hover:text-accent transition-colors">Folder Generator</Link>
        </div>
        <div className="flex flex-col gap-4">
          <div className="text-white mb-2">Legal</div>
          <Link to="/privacy" className="hover:text-accent transition-colors">Privacy Policy</Link>
          <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
          <a href="mailto:loch7444@gmail.com" className="hover:text-accent transition-colors">Contact</a>
        </div>
      </div>
      
      <div className="flex flex-col items-end gap-2">
        <div className="font-mono text-[10px] opacity-30">© 2026 IMAGESNAP CLOUD. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-4">
           {/* Social links placeholder */}
        </div>
      </div>
    </footer>
  );
};
