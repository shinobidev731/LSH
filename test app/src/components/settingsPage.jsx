import { useState } from 'react';
import { 
  ChevronLeft, 
  Sun, 
  Moon, 
  Smartphone, 
  Mail, 
  Info, 
  Church, 
  Sparkles, 
  RotateCcw, 
  Check 
} from 'lucide-react';
import './settingsPage.css';

export default function SettingsPage({
  onBack = () => {},
  theme = 'system',
  onThemeChange = () => {},
  language = 'ENG',
  onLanguageChange = () => {}
}) {
  const [resetMessage, setResetMessage] = useState('');

  const themeOptions = [
    {
      id: 'system',
      title: 'System Default',
      subtitle: 'Matches your device color scheme automatically',
      icon: Smartphone
    },
    {
      id: 'light',
      title: 'Light Mode',
      subtitle: 'Crisp white & church red aesthetic',
      icon: Sun
    },
    {
      id: 'dark',
      title: 'Dark Mode',
      subtitle: 'Comfortable contrast for low-light worship',
      icon: Moon
    }
  ];

  const languageOptions = [
    {
      id: 'ENG',
      title: 'English',
      nativeTitle: 'English (ENG)',
      flag: '🇬🇧',
      desc: 'Display titles and hymn lyrics in English'
    },
    {
      id: 'YOR',
      title: 'Yoruba',
      nativeTitle: 'Èdè Yorùbá (YOR)',
      flag: '🇳🇬',
      desc: 'Orin ati awon eya orin ni ede Yoruba'
    }
  ];

  const handleReset = () => {
    onThemeChange('system');
    onLanguageChange('ENG');
    setResetMessage('Preferences reset to default!');
    setTimeout(() => setResetMessage(''), 3000);
  };

  return (
    <div className="settings-container">
      {/* Header */}
      <header className="hymn-header">
        <div className="header-top sub-header-top">
          <button className="back-btn" onClick={onBack} aria-label="Go back">
            <ChevronLeft size={28} />
          </button>
          <h1 className="sub-header-title">SETTINGS</h1>
          <div className="header-spacer" />
        </div>
      </header>

      <main className="settings-body">
        {resetMessage && (
          <div className="settings-toast-banner">
            <Check size={16} />
            <span>{resetMessage}</span>
          </div>
        )}

        {/* Theme Settings Section */}
        <section className="settings-section">
          <div className="section-header-row">
            <span className="section-badge">DISPLAY</span>
            <h2 className="section-title">Theme & Appearance</h2>
          </div>

          <div className="options-card-group">
            {themeOptions.map((opt, idx) => {
              const Icon = opt.icon;
              const isSelected = theme === opt.id;
              return (
                <div key={opt.id} className="option-row-wrapper">
                  <button
                    className={`setting-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onThemeChange(opt.id)}
                    type="button"
                  >
                    <div className="option-left">
                      <div className={`option-icon-box ${isSelected ? 'active-icon' : ''}`}>
                        <Icon size={19} />
                      </div>
                      <div className="option-text-group">
                        <span className="option-main-title">{opt.title}</span>
                        <span className="option-sub-title">{opt.subtitle}</span>
                      </div>
                    </div>
                    <div className={`custom-radio ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <div className="radio-dot" />}
                    </div>
                  </button>
                  {idx < themeOptions.length - 1 && <div className="item-divider" />}
                </div>
              );
            })}
          </div>
        </section>

        <div className="section-separator-line" />

        {/* Language Settings Section */}
        <section className="settings-section">
          <div className="section-header-row">
            <span className="section-badge">LANGUAGE</span>
            <h2 className="section-title">Preferred Language</h2>
          </div>

          <div className="options-card-group">
            {languageOptions.map((lang, idx) => {
              const isSelected = language === lang.id;
              return (
                <div key={lang.id} className="option-row-wrapper">
                  <button
                    className={`setting-option-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onLanguageChange(lang.id)}
                    type="button"
                  >
                    <div className="option-left">
                      <div className="option-flag-box">
                        <span>{lang.flag}</span>
                      </div>
                      <div className="option-text-group">
                        <span className="option-main-title">{lang.nativeTitle}</span>
                        <span className="option-sub-title">{lang.desc}</span>
                      </div>
                    </div>
                    <div className={`custom-radio ${isSelected ? 'checked' : ''}`}>
                      {isSelected && <div className="radio-dot" />}
                    </div>
                  </button>
                  {idx < languageOptions.length - 1 && <div className="item-divider" />}
                </div>
              );
            })}
          </div>
        </section>

        <div className="section-separator-line" />

        {/* Contact & Church Info Section */}
        <section className="settings-section">
          <div className="section-header-row">
            <span className="section-badge">ABOUT & SUPPORT</span>
            <h2 className="section-title">Church & Media Contact</h2>
          </div>

          <div className="info-card-group">
            <div className="info-row">
              <div className="info-icon-box">
                <Church size={18} />
              </div>
              <div className="info-text-group">
                <span className="info-label">Church Organization</span>
                <span className="info-value">The Church of the Living Stone Int'l</span>
              </div>
            </div>

            <div className="item-divider" />

            <div className="info-row">
              <div className="info-icon-box">
                <Sparkles size={18} />
              </div>
              <div className="info-text-group">
                <span className="info-label">Media & Publication</span>
                <span className="info-value">COTLIST Media</span>
              </div>
            </div>

            <div className="item-divider" />

            <div className="info-row">
              <div className="info-icon-box">
                <Info size={18} />
              </div>
              <div className="info-text-group">
                <span className="info-label">App Version</span>
                <span className="info-value">v0.0.0.1 (Living Stone Hymns)</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="action-buttons-group">
            <a
              href="mailto:cotlistmedia@gmail.com?subject=Living%20Stone%20Hymns%20Feedback"
              className="action-btn primary-action"
            >
              <Mail size={18} />
              <span>Email COTLIST Media Support</span>
            </a>

            <button
              className="action-btn secondary-action"
              onClick={handleReset}
              type="button"
            >
              <RotateCcw size={16} />
              <span>Reset Default Settings</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
