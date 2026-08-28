import { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Music, 
  Volume2,
  Square,
  Heart, 
  Languages, 
  ZoomIn, 
  ZoomOut 
} from 'lucide-react';
import { hymnTunePlayer } from '../utils/hymnTunePlayer';
import './hymnPage.css';

export default function HymnDetail({
  hymn,
  onBack,
  isFavorite = false,
  onToggleFavorite = () => {},
  language = 'ENG',
  onToggleLanguage = () => {},
  onNextHymn = null,
  onPrevHymn = null
}) {
    const [fontSize, setFontSize] = useState(17);
    const [isPlayingTune, setIsPlayingTune] = useState(false);

    // Stop hymn tune on unmount or hymn change
    useEffect(() => {
        return () => {
            hymnTunePlayer.stop();
        };
    }, [hymn.id]);

    const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 28));
    const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 13));

    const handleToggleTune = () => {
        if (isPlayingTune) {
            hymnTunePlayer.stop();
            setIsPlayingTune(false);
        } else {
            setIsPlayingTune(true);
            hymnTunePlayer.play(hymn.id, () => {
                setIsPlayingTune(false);
            });
        }
    };

    const handleBackWithStop = () => {
        hymnTunePlayer.stop();
        setIsPlayingTune(false);
        onBack();
    };

    const isYoruba = language === 'YOR';
    const activeTitle = (isYoruba && hymn.titleYoruba) ? hymn.titleYoruba : hymn.title;

    const activeSections = isYoruba
        ? (hymn.sectionsYoruba && hymn.sectionsYoruba.length > 0
            ? hymn.sectionsYoruba
            : hymn.versesYoruba || [])
        : (hymn.sections && hymn.sections.length > 0
            ? hymn.sections
            : hymn.verses || []);

    return (
        <div className="hymn-detail-container">
        {/* Header */}
        <header className="detail-header">
            <div className="detail-header-top">
                <button className="icon-btn" onClick={handleBackWithStop} aria-label="Go back">
                    <ChevronLeft size={28} />
                </button>
                
                <div className="top-right-actions">
                    <button 
                        className={`icon-btn tune-btn ${isPlayingTune ? 'tune-playing' : ''}`} 
                        onClick={handleToggleTune}
                        aria-label={isPlayingTune ? "Stop Hymn Tune" : "Play Hymn Tune"}
                        title={isPlayingTune ? "Stop Hymn Tune" : "Play Hymn Tune"}
                    >
                        {isPlayingTune ? <Volume2 size={22} /> : <Music size={22} />}
                    </button>

                    <button className="lang-btn" onClick={onToggleLanguage} aria-label="Change Language">
                        <Languages size={18} />
                        <span>{language}</span>
                    </button>
                </div>
            </div>

            <div className="detail-header-center">
                {hymn.code && <span className="meter-badge">{hymn.code}</span>}
                <h1 className="detail-hymn-number">LSH {hymn.id}</h1>
                <h2 className="detail-hymn-title">{activeTitle}</h2>
            </div>

            {/* Live Playing Tune Banner */}
            {isPlayingTune && (
                <div className="tune-status-bar">
                    <div className="equalizer-bars" aria-hidden="true">
                        <span className="bar bar-1"></span>
                        <span className="bar bar-2"></span>
                        <span className="bar bar-3"></span>
                    </div>
                    <span className="tune-status-text">Playing Hymn Tune</span>
                    <button 
                        className="stop-tune-mini-btn" 
                        onClick={handleToggleTune}
                        aria-label="Stop playback"
                    >
                        <Square size={13} fill="currentColor" />
                    </button>
                </div>
            )}

            <div className="detail-header-bottom">
                <div className="font-controls-group">
                    <button className="font-step-btn" onClick={decreaseFontSize} aria-label="Decrease font size">
                        <ZoomOut size={17} />
                    </button>
                    <div className="font-divider" />
                    <button className="font-step-btn" onClick={increaseFontSize} aria-label="Increase font size">
                        <ZoomIn size={17} />
                    </button>
                </div>

                <button 
                    className={`icon-btn favorite-toggle-btn ${isFavorite ? 'active-fav' : ''}`} 
                    onClick={() => onToggleFavorite(hymn.id)} 
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                >
                    <Heart size={21} fill={isFavorite ? '#ffffff' : 'none'} color="#ffffff" />
                </button>
            </div>
        </header>

        {/* Lyrics Content with Verse Cards & Chorus Badges */}
        <main className="detail-body">
            <div className="lyrics-content" style={{ fontSize: `${fontSize}px` }}>
            {activeSections && activeSections.length > 0 ? (
                activeSections.map((sec, idx) => {
                    const isObj = typeof sec === 'object' && sec !== null;
                    const isChorus = isObj && sec.type === 'chorus';
                    const label = isChorus ? 'CHORUS' : `VERSE ${isObj && sec.number ? sec.number : idx + 1}`;
                    const text = isObj ? sec.text : sec;

                    return (
                        <div key={idx} className={`verse-card ${isChorus ? 'chorus-card' : ''}`}>
                            <div className={`verse-badge ${isChorus ? 'chorus-badge' : ''}`}>{label}</div>
                            <p className={`verse-text ${isChorus ? 'chorus-text' : ''}`}>{text}</p>
                        </div>
                    );
                })
            ) : (
                <div className="verse-card">
                    <div className="verse-badge">VERSE 1</div>
                    <p className="verse-text">No lyrics available for this hymn.</p>
                </div>
            )}
            </div>

            {/* Bottom Footer Navigation Between Hymns */}
            {(onPrevHymn || onNextHymn) && (
                <nav className="hymn-footer-nav" aria-label="Hymn navigation">
                    <button 
                        className="hymn-nav-arrow-btn" 
                        onClick={onPrevHymn} 
                        disabled={!onPrevHymn}
                        aria-label="Previous Hymn"
                    >
                        <ChevronLeft size={18} />
                        <span>Prev</span>
                    </button>

                    <span className="hymn-nav-center-pill">LSH {hymn.id}</span>

                    <button 
                        className="hymn-nav-arrow-btn" 
                        onClick={onNextHymn} 
                        disabled={!onNextHymn}
                        aria-label="Next Hymn"
                    >
                        <span>Next</span>
                        <ChevronRight size={18} />
                    </button>
                </nav>
            )}
        </main>
        </div>
    );
}