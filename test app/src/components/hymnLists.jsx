import { useState, useRef } from 'react';
import './hymnLists.css';
import { hymnData } from '../data/hymnData';
import { 
    Menu, 
    Search, 
    Languages, 
    ChevronLeft, 
    Trash2, 
    HeartOff, 
    Clock, 
    SearchX, 
    Layers 
    } from 'lucide-react';
    import MenuDrawer from './menuDrawer';

    function HymnLists({
    onSelectHymn = () => {},
    favoriteIds = [],
    recentHymnIds = [],
    onClearFavorites = () => {},
    onClearRecents = () => {},
    language = 'ENG',
    onToggleLanguage = () => {},
    onOpenSettings = () => {}
    }) {
    const [activeTab, setActiveTab] = useState('Index');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const searchInputRef = useRef(null);
    const tabs = ['Index', 'Categories', 'Recents'];

    const getActiveList = () => {
        if (selectedCategory) {
        return (hymnData.Index || []).filter(
            (hymn) =>
            hymn.categoryId === selectedCategory.id ||
            hymn.category === selectedCategory.title
        );
        }
        if (activeTab === 'Categories') {
        return hymnData.Categories || [];
        }
        if (activeTab === 'Favorites') {
        return (hymnData.Index || []).filter((hymn) => favoriteIds.includes(hymn.id));
        }
        if (activeTab === 'Recents') {
        return recentHymnIds
            .map((id) => (hymnData.Index || []).find((h) => h.id === id))
            .filter(Boolean);
        }
        return hymnData.Index || [];
    };

    const normalizeText = (text) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ẹ/g, 'e')
      .replace(/ọ/g, 'o')
      .replace(/ṣ/g, 's')
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const currentList = getActiveList();
  const isYoruba = language === 'YOR';
  const cleanQuery = normalizeText(searchQuery);

  const filteredList = currentList.filter((item) => {
    if (!cleanQuery) return true;
    const idMatch = item.id && item.id.toString().includes(searchQuery.trim());
    const titleMatch = item.title && normalizeText(item.title).includes(cleanQuery);
    const yorubaTitleMatch = item.titleYoruba && normalizeText(item.titleYoruba).includes(cleanQuery);
    return idMatch || titleMatch || yorubaTitleMatch;
  });

    const handleCardClick = (item) => {
        if (activeTab === 'Categories' && !selectedCategory) {
        setSelectedCategory(item);
        setSearchQuery('');
        } else {
        onSelectHymn(item);
        }
    };

    const handleBackToMain = () => {
        if (selectedCategory) {
        setSelectedCategory(null);
        } else if (activeTab === 'Favorites') {
        setActiveTab('Index');
        }
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    const handleToggleSearch = () => {
        if (!isSearchOpen) {
        setIsSearchOpen(true);
        setTimeout(() => {
            if (searchInputRef.current) {
            searchInputRef.current.focus();
            }
        }, 50);
        } else if (!searchQuery) {
        setIsSearchOpen(false);
        }
    };

    const isSubPage = Boolean(selectedCategory || activeTab === 'Favorites');
    const subPageTitle = selectedCategory ? selectedCategory.title : 'FAVORITES';

    const renderEmptyState = () => {
        if (searchQuery.trim()) {
        return (
            <div className="empty-state-card">
            <SearchX size={40} className="empty-icon" />
            <p className="empty-title">No matching hymns</p>
            <p className="empty-subtitle">Check your spelling or search by hymn number</p>
            </div>
        );
        }
        if (selectedCategory) {
        return (
            <div className="empty-state-card">
            <Layers size={40} className="empty-icon" />
            <p className="empty-title">No hymns in this category</p>
            </div>
        );
        }
        if (activeTab === 'Favorites') {
        return (
            <div className="empty-state-card">
            <HeartOff size={40} className="empty-icon" />
            <p className="empty-title">No favorite hymns yet</p>
            <p className="empty-subtitle">Tap the heart icon on any hymn to save it here</p>
            </div>
        );
        }
        if (activeTab === 'Recents') {
        return (
            <div className="empty-state-card">
            <Clock size={40} className="empty-icon" />
            <p className="empty-title">no recent hymns</p>
            <p className="empty-subtitle">Hymns you open will automatically appear here</p>
            </div>
        );
        }
        return (
        <div className="empty-state-card">
            <p className="empty-title">No hymns available</p>
        </div>
        );
    };

    return (
        <div className='hymn-container'>
        <MenuDrawer
            isOpen={isMenuOpen}
            onClose={() => setIsMenuOpen(false)}
            onSelectTab={(tab) => {
            setSelectedCategory(null);
            setSearchQuery('');
            setIsSearchOpen(false);
            if (tab === 'Settings') {
                onOpenSettings();
            } else if (tabs.includes(tab) || tab === 'Favorites') {
                setActiveTab(tab);
            }
            }}
        />

        <header className='hymn-header'>
            {isSubPage ? (
            <div className='header-top sub-header-top'>
                <button
                className='back-btn'
                onClick={handleBackToMain}
                aria-label='Go back'
                >
                <ChevronLeft size={28} />
                </button>
                <h1 className='sub-header-title'>{subPageTitle}</h1>

                <div className={`search-toggle-box ${isSearchOpen || searchQuery ? 'expanded' : ''}`}>
                <button
                    type="button"
                    className="search-trigger-btn"
                    onClick={handleToggleSearch}
                    aria-label="Toggle search input"
                >
                    <Search size={20} />
                </button>
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={
                    selectedCategory
                        ? `search in ${selectedCategory.title.toLowerCase()}`
                        : 'search favorites'
                    }
                    className='search-input-compact'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => {
                    if (!searchQuery.trim()) {
                        setIsSearchOpen(false);
                    }
                    }}
                />
                </div>
            </div>
            ) : (
            <div className='header-top'>
                <button
                aria-label='open menu'
                className='menu-btn'
                onClick={() => setIsMenuOpen(true)}
                >
                <Menu size={24} />
                </button>

                <div className={`search-toggle-box ${isSearchOpen || searchQuery ? 'expanded' : ''}`}>
                <button
                    type="button"
                    className="search-trigger-btn"
                    onClick={handleToggleSearch}
                    aria-label="Toggle search input"
                >
                    <Search size={20} />
                </button>
                <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="search hymn # or title"
                    className='search-input-compact'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    onBlur={() => {
                    if (!searchQuery.trim()) {
                        setIsSearchOpen(false);
                    }
                    }}
                />
                </div>
            </div>
            )}

            {!isSubPage && (
            <nav className='tab-bar'>
                {tabs.map((tab) => (
                <button
                    key={tab}
                    className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => {
                    setActiveTab(tab);
                    setSelectedCategory(null);
                    setSearchQuery('');
                    setIsSearchOpen(false);
                    }}
                >
                    {tab}
                </button>
                ))}
            </nav>
            )}
        </header>

        <main className='hymn-list tab-transition' key={selectedCategory ? selectedCategory.id : activeTab}>
            {filteredList.length > 0 ? (
            <>
                {filteredList.map((item) => {
                const displayTitle = (isYoruba && item.titleYoruba) ? item.titleYoruba : item.title;
                const isCategoryCard = activeTab === 'Categories' && !selectedCategory;

                if (isCategoryCard) {
                    const categoryHymns = (hymnData.Index || []).filter(
                    (h) => h.categoryId === item.id || h.category === item.title
                    );
                    const ids = categoryHymns.map((h) => h.id).sort((a, b) => a - b);
                    let rangeLabel = item.range ? `hymns ${item.range}` : '';
                    if (!rangeLabel) {
                    if (ids.length === 1) {
                        rangeLabel = `hymn ${ids[0]}`;
                    } else if (ids.length > 1) {
                        rangeLabel = `hymns ${ids[0]}-${ids[ids.length - 1]}`;
                    } else {
                        rangeLabel = '0 hymns';
                    }
                    }

                    return (
                    <div
                        key={item.id}
                        className="hymn-card category-card"
                        onClick={() => handleCardClick(item)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleCardClick(item);
                        }
                        }}
                    >
                        <span className='hymn-title'>{displayTitle}</span>
                        <span className='category-range-text'>{rangeLabel}</span>
                    </div>
                    );
                }

                return (
                    <div
                    key={item.id}
                    className="hymn-card"
                    onClick={() => handleCardClick(item)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                        handleCardClick(item);
                        }
                    }}
                    >
                    <div className="hymn-number">{item.id}</div>
                    <span className='hymn-title'>{displayTitle}</span>
                    </div>
                );
                })}

                {/* Clear Action Links */}
                {!selectedCategory && activeTab === 'Favorites' && favoriteIds.length > 0 && (
                <div className='clear-action-container'>
                    <button
                    className='clear-action-btn'
                    onClick={onClearFavorites}
                    >
                    <Trash2 size={16} />
                    <span>Clear favorites</span>
                    </button>
                </div>
                )}

                {!selectedCategory && activeTab === 'Recents' && recentHymnIds.length > 0 && (
                <div className='clear-action-container'>
                    <button
                    className='clear-action-btn'
                    onClick={onClearRecents}
                    >
                    <Trash2 size={16} />
                    <span>Clear recent hymns</span>
                    </button>
                </div>
                )}
            </>
            ) : (
            renderEmptyState()
            )}
        </main>

        <button
            className='fab'
            onClick={onToggleLanguage}
            aria-label={`Current language is ${language}. Tap to toggle between English and Yoruba`}
        >
            <Languages size={22} />
            <span className='fab-lang-badge'>{language}</span>
        </button>
        </div>
    );
    }

    export default HymnLists;