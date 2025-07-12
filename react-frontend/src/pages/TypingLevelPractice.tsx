import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface TypingLevel {
  level: number;
  title: string;
  content: string;
}

interface KeyboardKey {
  label: string;
  color: string;
  wide?: boolean;
  extraWide?: boolean;
}

// Keyboard layout and color coding
const keyboardRows: KeyboardKey[][] = [
  [
    { label: '`', color: '#b2ebf2' }, { label: '1', color: '#b2ebf2' }, { label: '2', color: '#b2ebf2' }, { label: '3', color: '#b2ebf2' }, { label: '4', color: '#b2ebf2' }, { label: '5', color: '#ffe082' }, { label: '6', color: '#ffe082' }, { label: '7', color: '#ffccbc' }, { label: '8', color: '#ffccbc' }, { label: '9', color: '#b39ddb' }, { label: '0', color: '#b39ddb' }, { label: '-', color: '#b2ebf2' }, { label: '=', color: '#b2ebf2' }, { label: 'delete', color: '#80deea', wide: true }
  ],
  [
    { label: 'tab', color: '#80deea', wide: true }, { label: 'Q', color: '#b2ebf2' }, { label: 'W', color: '#b2ebf2' }, { label: 'E', color: '#ffe082' }, { label: 'R', color: '#ffe082' }, { label: 'T', color: '#ffe082' }, { label: 'Y', color: '#ffccbc' }, { label: 'U', color: '#ffccbc' }, { label: 'I', color: '#b39ddb' }, { label: 'O', color: '#b39ddb' }, { label: 'P', color: '#b2ebf2' }, { label: '[', color: '#b2ebf2' }, { label: ']', color: '#b2ebf2' }, { label: '\\', color: '#80deea', wide: true }
  ],
  [
    { label: 'caps lock', color: '#80deea', wide: true }, { label: 'A', color: '#b2ebf2' }, { label: 'S', color: '#b2ebf2' }, { label: 'D', color: '#ffe082' }, { label: 'F', color: '#ffe082' }, { label: 'G', color: '#ffe082' }, { label: 'H', color: '#ffccbc' }, { label: 'J', color: '#ffccbc' }, { label: 'K', color: '#b39ddb' }, { label: 'L', color: '#b39ddb' }, { label: ';', color: '#b2ebf2' }, { label: "'", color: '#b2ebf2' }, { label: '', color: '#b2ebf2' }, { label: 'enter', color: '#80deea', wide: true }
  ],
  [
    { label: 'shift', color: '#80deea', wide: true }, { label: 'Z', color: '#b2ebf2' }, { label: 'X', color: '#b2ebf2' }, { label: 'C', color: '#ffe082' }, { label: 'V', color: '#ffe082' }, { label: 'B', color: '#ffe082' }, { label: 'N', color: '#ffccbc' }, { label: 'M', color: '#ffccbc' }, { label: ',', color: '#b39ddb' }, { label: '.', color: '#b39ddb' }, { label: '/', color: '#b2ebf2' }, { label: 'shift', color: '#80deea', wide: true }
  ],
  [
    { label: 'space', color: '#a5d6a7', wide: true, extraWide: true }
  ]
];

const keyStyleBase: React.CSSProperties = {
  padding: '18px 22px',
  borderRadius: 8,
  background: '#f3f3f3',
  border: '1.5px solid #bbb',
  fontSize: 22,
  minWidth: 40,
  textAlign: 'center',
  boxShadow: '0 2px 8px #0001',
  userSelect: 'none',
  margin: 4,
  display: 'inline-block',
  transition: 'background 0.2s, box-shadow 0.2s',
};

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const TypingLevelPractice: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const level: TypingLevel = location.state?.level;
  const [userInput, setUserInput] = useState(level?.content || '');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(60); // 1 min default
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const editableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isRunning, timeLeft]);

  useEffect(() => {
    if (level) setUserInput(level.content);
    setTimeLeft(60);
    setIsRunning(false);
    setStartTime(null);
  }, [level]);

  if (!level) {
    return <div style={{ padding: 32 }}>No level data found.</div>;
  }

  // Highlight logic for contentEditable
  const getHighlightedHTML = () => {
    const chars = level.content.split('');
    const typed = userInput.split('');
    return chars.map((c, i) => {
      let style = '';
      if (typed[i] === undefined) {
        style = 'color:#aaa;';
      } else if (typed[i] === c) {
        style = 'background:#c8e6c9;color:#222;';
      } else {
        style = 'background:#ffcdd2;color:#b71c1c;';
      }
      // Use &nbsp; for spaces
      const char = c === ' ' ? '&nbsp;' : c;
      return `<span style="${style}white-space:${c === ' ' ? 'pre' : 'normal'};font-size:24px;">${char}</span>`;
    }).join('');
  };

  // Handle user typing in contentEditable
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    if (!isRunning) return;
    let value = e.currentTarget.innerText;
    // Prevent adding/removing chars: always keep length same as passage
    if (value.length > level.content.length) value = value.slice(0, level.content.length);
    if (value.length < level.content.length) value = value.padEnd(level.content.length, ' ');
    setUserInput(value);
  };

  // Control handlers
  const handleStart = () => {
    setIsRunning(true);
    setStartTime(Date.now());
    setUserInput(level.content);
    setTimeLeft(60);
    setTimeout(() => editableRef.current?.focus(), 100);
  };
  const handlePause = () => setIsRunning(false);
  const handleResume = () => setIsRunning(true);
  const handleRestart = () => {
    setUserInput(level.content);
    setIsRunning(false);
    setTimeLeft(60);
    setStartTime(null);
    setTimeout(() => editableRef.current?.focus(), 100);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', padding: '0', margin: 0 }}>
      <div style={{ maxWidth: 1100, margin: '32px auto', background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px #0002', padding: 40, minHeight: 540, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Timer and Progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 26, color: '#1976d2', letterSpacing: 1 }}>⏰ {formatTime(timeLeft)}</div>
          <div style={{ width: 220, height: 12, background: '#e3e3e3', borderRadius: 8, overflow: 'hidden', marginLeft: 16 }}>
            <div style={{ width: `${(timeLeft / 60) * 100}%`, height: '100%', background: '#1976d2', transition: 'width 0.3s' }} />
          </div>
        </div>
        {/* ContentEditable Typing Area */}
        <div style={{ position: 'relative', width: '100%', marginBottom: 32 }}>
          <div
            ref={editableRef}
            contentEditable={isRunning}
            suppressContentEditableWarning
            spellCheck={false}
            tabIndex={0}
            style={{
              width: '100%',
              minHeight: 110,
              fontSize: 24,
              padding: 18,
              borderRadius: 12,
              border: '2px solid #b0bec5',
              background: 'transparent',
              color: '#222',
              fontWeight: 500,
              boxShadow: '0 2px 8px #0001',
              outline: isRunning ? '2px solid #1976d2' : 'none',
              cursor: isRunning ? 'text' : 'not-allowed',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              zIndex: 3,
              transition: 'border 0.2s',
            }}
            dangerouslySetInnerHTML={{ __html: getHighlightedHTML() }}
            onInput={handleInput}
            onPaste={e => e.preventDefault()}
            onDrop={e => e.preventDefault()}
          />
        </div>
        {/* Virtual Keyboard */}
        <div style={{ width: '100%', background: '#f8f8fa', borderRadius: 14, boxShadow: '0 2px 8px #0001', padding: 18, marginBottom: 28, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 10, color: '#1976d2', letterSpacing: 1 }}>Virtual Keyboard</div>
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 4, marginBottom: 4
          }}>
            {keyboardRows.map((row, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 2 }}>
                {row.map((key, j) => (
                  <kbd
                    key={key.label + j}
                    style={{
                      ...keyStyleBase,
                      background: key.color,
                      minWidth: key.extraWide ? 340 : key.wide ? 90 : 44,
                      width: key.extraWide ? 340 : key.wide ? 90 : 44,
                      fontWeight: key.label === 'space' ? 700 : 500,
                      fontSize: key.label.length > 2 ? 16 : 22,
                      textTransform: key.label.length === 1 ? 'uppercase' : 'none',
                      boxShadow: '0 2px 8px #0001',
                    }}
                  >
                    {key.label}
                  </kbd>
                ))}
              </div>
            ))}
          </div>
        </div>
        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginBottom: 8, width: '100%' }}>
          <button onClick={() => navigate(-1)} style={btnStyleBack}>
            &larr; Back
          </button>
          {!isRunning && <button onClick={handleStart} style={btnStylePrimary}>Start</button>}
          {isRunning && <button onClick={handlePause} style={btnStylePrimary}>Pause</button>}
          {!isRunning && startTime && <button onClick={handleResume} style={btnStylePrimary}>Resume</button>}
          {(isRunning || (!isRunning && startTime)) && <button onClick={handleRestart} style={btnStyleSecondary}>Restart</button>}
        </div>
      </div>
    </div>
  );
};

const btnStylePrimary: React.CSSProperties = {
  padding: '12px 32px',
  borderRadius: 8,
  background: 'linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)',
  color: '#fff',
  border: 'none',
  fontWeight: 700,
  fontSize: 18,
  cursor: 'pointer',
  boxShadow: '0 2px 8px #0001',
  transition: 'background 0.2s',
};
const btnStyleSecondary: React.CSSProperties = {
  padding: '12px 32px',
  borderRadius: 8,
  background: 'linear-gradient(90deg, #b0bec5 60%, #90caf9 100%)',
  color: '#222',
  border: 'none',
  fontWeight: 700,
  fontSize: 18,
  cursor: 'pointer',
  boxShadow: '0 2px 8px #0001',
  transition: 'background 0.2s',
};
const btnStyleBack: React.CSSProperties = {
  padding: '12px 32px',
  borderRadius: 8,
  background: '#fff',
  color: '#1976d2',
  border: '2px solid #1976d2',
  fontWeight: 700,
  fontSize: 18,
  cursor: 'pointer',
  boxShadow: '0 2px 8px #0001',
  transition: 'background 0.2s',
};

export default TypingLevelPractice; 