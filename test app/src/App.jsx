import { useState, useEffect } from "react";
import SplashScreen from './components/splashScreen';
import HymnLists from './components/hymnLists';
import HymnDetail from './components/hymnPage';
import SettingsPage from './components/settingsPage';
import { hymnData } from './data/hymnData';
import './App.css';

function App() {
    const [loading, setLoading] = useState(true);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [selectedHymn, setSelectedHymn] = useState(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const [favoriteIds, setFavoriteIds] = useState(() => {
        try {
            const saved = localStorage.getItem('lsh_favorite_ids');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [recentHymnIds, setRecentHymnIds] = useState(() => {
        try {
            const saved = localStorage.getItem('lsh_recent_ids');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [theme, setTheme] = useState(() => {
        try {
            return localStorage.getItem('lsh_theme') || 'system';
        } catch {
            return 'system';
        }
    });

    const [language, setLanguage] = useState(() => {
        try {
            return localStorage.getItem('lsh_language') || 'ENG';
        } catch {
            return 'ENG';
        }
    });

    // Theme effect
    useEffect(() => {
        const applyTheme = () => {
            let activeTheme = theme;
            if (theme === 'system') {
                const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                activeTheme = systemPrefersDark ? 'dark' : 'light';
            }
            if (activeTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        };

        applyTheme();

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme();
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setIsFadingOut(true), 1800);
        const unmountTimer = setTimeout(() => setLoading(false), 2400);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(unmountTimer);
        };
    }, []);

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        try {
            localStorage.setItem('lsh_theme', newTheme);
        } catch (e) {
            console.error(e);
        }
    };

    const handleLanguageChange = (newLang) => {
        setLanguage(newLang);
        try {
            localStorage.setItem('lsh_language', newLang);
        } catch (e) {
            console.error(e);
        }
    };

    const handleToggleLanguage = () => {
        setLanguage((prev) => {
            const next = prev === 'ENG' ? 'YOR' : 'ENG';
            try {
                localStorage.setItem('lsh_language', next);
            } catch (e) {
                console.error(e);
            }
            return next;
        });
    };

    const handleSelectHymn = (hymn) => {
        if (hymn && hymn.id) {
            setRecentHymnIds((prev) => {
                const next = [hymn.id, ...prev.filter((id) => id !== hymn.id)].slice(0, 30);
                try {
                    localStorage.setItem('lsh_recent_ids', JSON.stringify(next));
                } catch (e) {
                    console.error(e);
                }
                return next;
            });
        }
        setSelectedHymn(hymn);
    };

    const handleBack = () => {
        setSelectedHymn(null);
    };

    const handleToggleFavorite = (hymnId) => {
        setFavoriteIds((prev) => {
            const next = prev.includes(hymnId)
                ? prev.filter((id) => id !== hymnId)
                : [...prev, hymnId];
            try {
                localStorage.setItem('lsh_favorite_ids', JSON.stringify(next));
            } catch (e) {
                console.error(e);
            }
            return next;
        });
    };

    const handleClearFavorites = () => {
        setFavoriteIds([]);
        try {
            localStorage.removeItem('lsh_favorite_ids');
        } catch (e) {
            console.error(e);
        }
    };

    const handleClearRecents = () => {
        setRecentHymnIds([]);
        try {
            localStorage.removeItem('lsh_recent_ids');
        } catch (e) {
            console.error(e);
        }
    };

    // Current hymn navigation indices
    const allHymns = hymnData.Index || [];
    const currentIndex = selectedHymn
        ? allHymns.findIndex((h) => h.id === selectedHymn.id)
        : -1;
    const prevHymn = currentIndex > 0 ? allHymns[currentIndex - 1] : null;
    const nextHymn = (currentIndex >= 0 && currentIndex < allHymns.length - 1)
        ? allHymns[currentIndex + 1]
        : null;

    return (
        <div className="app-root">
            {loading && <SplashScreen isFadingOut={isFadingOut} />}

            {isSettingsOpen ? (
                <SettingsPage
                    onBack={() => setIsSettingsOpen(false)}
                    theme={theme}
                    onThemeChange={handleThemeChange}
                    language={language}
                    onLanguageChange={handleLanguageChange}
                />
            ) : selectedHymn ? (
                <HymnDetail
                    hymn={selectedHymn}
                    onBack={handleBack}
                    isFavorite={favoriteIds.includes(selectedHymn.id)}
                    onToggleFavorite={handleToggleFavorite}
                    language={language}
                    onToggleLanguage={handleToggleLanguage}
                    onPrevHymn={prevHymn ? () => handleSelectHymn(prevHymn) : null}
                    onNextHymn={nextHymn ? () => handleSelectHymn(nextHymn) : null}
                />
            ) : (
                <HymnLists
                    onSelectHymn={handleSelectHymn}
                    favoriteIds={favoriteIds}
                    recentHymnIds={recentHymnIds}
                    onClearFavorites={handleClearFavorites}
                    onClearRecents={handleClearRecents}
                    language={language}
                    onToggleLanguage={handleToggleLanguage}
                    onOpenSettings={() => setIsSettingsOpen(true)}
                />
            )}
        </div>
    );
}

export default App;
