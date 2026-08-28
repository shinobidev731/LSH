import { BookOpen, Layers, Clock, Heart, Settings, ChevronRight, X } from 'lucide-react';
import logoImg from '../assets/LSH_logo.png';
import './menuDrawer.css';

export default function MenuDrawer({ isOpen, onClose, onSelectTab }) {
  const menuItems = [
    { label: 'INDEX', value: 'Index', icon: BookOpen, description: 'All hymns by number' },
    { label: 'CATEGORY', value: 'Categories', icon: Layers, description: 'Hymns sorted by theme' },
    { label: 'RECENT', value: 'Recents', icon: Clock, description: 'Recently viewed hymns' },
    { label: 'FAVORITES', value: 'Favorites', icon: Heart, description: 'Your saved favorite hymns' },
    { label: 'SETTINGS', value: 'Settings', icon: Settings, description: 'Themes, language & contact' },
  ];

  const handleItemClick = (item) => {
    if (item.value) {
      onSelectTab(item.value);
    }
    onClose();
  };

  return (
    <div
      className={`menu-overlay ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className="menu-drawer"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="menu-header">
          <div className="menu-header-top">
            <div className="menu-logo-container">
              <img src={logoImg} alt="Living Stone Hymns Logo" className="menu-logo" />
            </div>
            <button className="menu-close-btn" onClick={onClose} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
          <h2 className="menu-title">LIVING STONE HYMNS</h2>
          <span className="menu-version">v0.0.0.1</span>
        </div>

        <div className="menu-body">
          <nav className="menu-nav">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="menu-nav-wrapper">
                  <button
                    className="menu-nav-item-btn"
                    onClick={() => handleItemClick(item)}
                  >
                    <div className="menu-item-left">
                      <div className="menu-icon-box">
                        <Icon size={18} />
                      </div>
                      <div className="menu-text-group">
                        <span className="menu-item-label">{item.label}</span>
                        <span className="menu-item-desc">{item.description}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className="menu-chevron" />
                  </button>
                  {idx < menuItems.length - 1 && <div className="menu-divider" />}
                </div>
              );
            })}
          </nav>

          <footer className="menu-footer">
            <div className="footer-divider-line" />
            <p className="powered-by">Powered By:</p>
            <p className="copyright-text">COTLIST Media copyright @2026</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
