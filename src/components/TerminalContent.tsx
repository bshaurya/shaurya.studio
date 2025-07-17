import React, { useState, useEffect, useRef, useCallback } from 'react';
import SnakeGame from './SnakeGame';
import { useTypingSound } from '../hooks/useTypingSound';

interface FileSystem {
  [key: string]: {
    type: 'directory' | 'file';
    content?: React.ReactNode;
    children?: FileSystem;
  };
}

interface Theme {
  name: string;
  bg: string;
  text: string;
  cursor: string;
  command: string;
}

const themes: Theme[] = [
  { name: 'default', bg: 'hsl(var(--terminal-bg))', text: 'hsl(var(--terminal-text))', cursor: 'hsl(var(--terminal-cursor))', command: 'hsl(var(--terminal-command))' },
  { name: 'matrix', bg: '#000000', text: '#00ff00', cursor: '#00ff00', command: '#00ff00' },
  { name: 'retro', bg: '#1a1a2e', text: '#eee', cursor: '#ff6b6b', command: '#4ecdc4' },
  { name: 'ocean', bg: '#0f3460', text: '#e94560', cursor: '#f5f5f5', command: '#16213e' }
];

const EnhancedTerminalContent = () => {
  const [showCursor, setShowCursor] = useState(true);
  const [currentPath, setCurrentPath] = useState('~');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentCommand, setCurrentCommand] = useState('');
  const [output, setOutput] = useState<React.ReactNode[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [showGame, setShowGame] = useState(false);
  const [currentTheme, setCurrentTheme] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [pendingCommand, setPendingCommand] = useState<string | null>(null);
  const { playTypingSound } = useTypingSound();

  const availableCommands = ['ls', 'cd', 'cat', 'pwd', 'clear', 'help', 'history', 'tree', 'whoami', 'date', 'echo', 'snake', 'theme', 'matrix', 'cowsay', 'figlet', 'joke', 'weather'];

  const fileSystem: FileSystem = {
    '~': {
      type: 'directory',
      children: {
        'life': {
          type: 'directory',
          children: {
            'about': { type: 'file' },
            'hobbies': { type: 'file' },
            'past': { type: 'file' },
            'now': { type: 'file' },
            'future': { type: 'file' }
          }
        },
        'find_my': { type: 'file' }
      }
    }
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (inputRef.current && !isMobile) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [output]);

  useEffect(() => {
    if (pendingCommand) {
      setTimeout(() => {
        executeCommand(pendingCommand);
        setPendingCommand(null);
      }, 50);
    }
  }, [currentPath, pendingCommand]);

  const updateSuggestions = useCallback((input: string) => {
    if (!input.trim()) {
      setSuggestions([]);
      return;
    }
    
    const matches = availableCommands.filter(cmd => 
      cmd.toLowerCase().startsWith(input.toLowerCase())
    );
    setSuggestions(matches.slice(0, 5));
    setSelectedSuggestion(0);
  }, []);

  useEffect(() => {
    updateSuggestions(currentCommand);
  }, [currentCommand, updateSuggestions]);

  const getCurrentDirectory = () => {
    const pathParts = currentPath === '~' ? ['~'] : currentPath.split('/');
    let current = fileSystem;
    for (const part of pathParts) {
      if (current[part] && current[part].children) {
        current = current[part].children!;
      }
    }
    return current;
  };

  const smartNavigate = (name: string, isButton = false) => {
    if (name === 'life') {
      executeCommand('cd life');
      setPendingCommand('ls');
    } else if (name === 'find_my') {
      if (currentPath !== '~') {
        executeCommand('cd ..');
        setPendingCommand('cat find_my');
      } else {
        executeCommand('cat find_my');
      }
    } else {
      if (currentPath !== '~/life') {
        executeCommand('cd life');
        setPendingCommand(`cat ${name}`);
      } else {
        executeCommand(`cat ${name}`);
      }
    }
  };

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    const [command, ...args] = trimmedCmd.split(' ');
    const fullCommand = `${currentPath}$ ${trimmedCmd}`;
    
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);
    
    let newOutput: React.ReactNode[] = [];
    
    switch (command) {
      case 'help':
        newOutput = [
          <div key="help" className="space-y-1 text-sm">
            <div className="text-terminal-cursor font-medium">Available commands:</div>
            <div className="grid grid-cols-2 gap-2 ml-2">
              <div>ls - list directory contents</div>
              <div>cd - change directory</div>
              <div>cat - display file contents</div>
              <div>pwd - show current directory</div>
              <div>clear - clear terminal</div>
              <div>help - show this help</div>
              <div>history - show command history</div>
              <div>tree - show directory tree</div>
              <div>whoami - display user info</div>
              <div>date - show current date/time</div>
              <div>echo - display text</div>
              <div>snake - play snake game</div>
              <div>theme - change color theme</div>
              <div>matrix - matrix effect</div>
              <div>cowsay - ascii cow</div>
              <div>figlet - ascii art text</div>
              <div>joke - random joke</div>
              <div>weather - show weather</div>
            </div>
          </div>
        ];
        break;

      case 'history':
        newOutput = [
          <div key="history" className="space-y-1 text-sm">
            {commandHistory.map((cmd, i) => (
              <div key={i}>{i + 1}: {cmd}</div>
            ))}
          </div>
        ];
        break;

      case 'tree':
        newOutput = [
          <div key="tree" className="font-mono text-sm">
            <div>~</div>
            <div>├── life/</div>
            <div>│   ├── about</div>
            <div>│   ├── hobbies</div>
            <div>│   ├── past</div>
            <div>│   ├── now</div>
            <div>│   └── future</div>
            <div>└── find_my</div>
          </div>
        ];
        break;

      case 'whoami':
        newOutput = [
          <div key="whoami" className="text-sm">
            <div className="text-terminal-cursor">shaurya bisht</div>
            <div>student, dev, researcher, human</div>
            <div>currently exploring the intersection of tech and human flourishing</div>
          </div>
        ];
        break;

      case 'date':
        newOutput = [
          <div key="date" className="text-sm">
            {new Date().toLocaleString()}
          </div>
        ];
        break;

      case 'echo':
        newOutput = [
          <div key="echo" className="text-sm">
            {args.join(' ') || ''}
          </div>
        ];
        break;

      case 'snake':
        setShowGame(true);
        return;

      case 'theme':
        const nextTheme = (currentTheme + 1) % themes.length;
        setCurrentTheme(nextTheme);
        newOutput = [
          <div key="theme" className="text-sm">
            Theme changed to: {themes[nextTheme].name}
          </div>
        ];
        break;

      case 'matrix':
        newOutput = [
          <div key="matrix" className="text-green-500 font-mono text-xs leading-tight">
            <div>01001000 01100101 01101100 01101100 01101111</div>
            <div>01010111 01101111 01110010 01101100 01100100</div>
            <div className="text-terminal-cursor mt-2">Wake up, Neo...</div>
          </div>
        ];
        break;

      case 'cowsay':
        const message = args.join(' ') || 'Hello!';
        newOutput = [
          <div key="cowsay" className="font-mono text-xs">
            <div> {'-'.repeat(message.length + 2)}</div>
            <div>{'< ' + message + ' >'}</div>
            <div> {'-'.repeat(message.length + 2)}</div>
            <div>        \   ^__^</div>
            <div>         \  (oo)\_______</div>
            <div>            (__)\       )\/\</div>
            <div>                ||----w |</div>
            <div>                ||     ||</div>
          </div>
        ];
        break;

      case 'figlet':
        const text = args.join(' ') || 'HELLO';
        newOutput = [
          <div key="figlet" className="font-mono text-xs">
            <div>██╗  ██╗███████╗██╗     ██╗      ██████╗ </div>
            <div>██║  ██║██╔════╝██║     ██║     ██╔═══██╗</div>
            <div>███████║█████╗  ██║     ██║     ██║   ██║</div>
            <div>██╔══██║██╔══╝  ██║     ██║     ██║   ██║</div>
            <div>██║  ██║███████╗███████╗███████╗╚██████╔╝</div>
            <div>╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝ ╚═════╝ </div>
          </div>
        ];
        break;

      case 'joke':
        const jokes = [
          "Why do programmers prefer dark mode? Because light attracts bugs!",
          "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
          "Why do Java developers wear glasses? Because they can't C#!",
          "There are only 10 types of people: those who understand binary and those who don't."
        ];
        newOutput = [
          <div key="joke" className="text-sm">
            {jokes[Math.floor(Math.random() * jokes.length)]}
          </div>
        ];
        break;

      case 'weather':
        newOutput = [
          <div key="weather" className="text-sm">
            <div className="text-terminal-cursor">Current Weather:</div>
            <div>🌤️ Partly cloudy, 72°F</div>
            <div>Perfect coding weather!</div>
          </div>
        ];
        break;

      case 'ls':
        const currentDir = getCurrentDirectory();
        const items = Object.keys(currentDir).map(name => {
          const item = currentDir[name];
          return (
            <button
              key={name}
              onClick={() => smartNavigate(name, true)}
              className="text-terminal-cursor hover:underline mr-4 transition-all duration-200 hover:scale-105"
            >
              {item.type === 'directory' ? `${name}/` : name}
            </button>
          );
        });
        newOutput = [<div key="ls" className="flex flex-wrap gap-2">{items}</div>];
        break;
        
      case 'cd':
        const target = args[0];
        if (!target) {
          newOutput = [<div key="cd-error">cd: missing argument</div>];
        } else if (target === '..') {
          if (currentPath !== '~') {
            const pathParts = currentPath.split('/');
            pathParts.pop();
            const newPath = pathParts.length === 1 ? '~' : pathParts.join('/');
            setCurrentPath(newPath);
          }
        } else {
          const currentDir = getCurrentDirectory();
          if (currentDir[target] && currentDir[target].type === 'directory') {
            const newPath = currentPath === '~' ? `~/${target}` : `${currentPath}/${target}`;
            setCurrentPath(newPath);
            setTimeout(() => {}, 0);
          } else {
            newOutput = [<div key="cd-error">cd: {target}: No such directory</div>];
          }
        }
        break;
        
      case 'cat':
        const fileName = args[0];
        if (!fileName) {
          newOutput = [<div key="cat-error">cat: missing argument</div>];
        } else {
          const content = getFileContent(fileName);
          if (content) {
            newOutput = [content];
          } else {
            newOutput = [<div key="cat-error">cat: {fileName}: No such file</div>];
          }
        }
        break;
        
      case 'clear':
        setOutput([]);
        setCommandHistory([]);
        return;
        
      case 'pwd':
        newOutput = [<div key="pwd">{currentPath}</div>];
        break;
        
      default:
        if (trimmedCmd) {
          newOutput = [<div key="unknown">bash: {command}: command not found. Type 'help' for available commands.</div>];
        }
    }
    
    if (isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setOutput(prev => [...prev, 
          <div key={`cmd-${Date.now()}`} className="mb-2 animate-fade-in">
            <div className="text-terminal-text/70">{fullCommand}</div>
            {newOutput.length > 0 && <div className="mt-1">{newOutput}</div>}
          </div>
        ]);
        setIsLoading(false);
      }, 300);
    } else {
      setOutput(prev => [...prev, 
        <div key={`cmd-${Date.now()}`} className="mb-2 animate-fade-in">
          <div className="text-terminal-text/70">{fullCommand}</div>
          {newOutput.length > 0 && <div className="mt-1">{newOutput}</div>}
        </div>
      ]);
    }
  };

  const getFileContent = (fileName: string) => {
    if (fileName === 'find_my') {
      return (
        <div key="find_my" className="space-y-2 text-sm animate-fade-in">
          <div className="text-terminal-cursor font-medium">ways to reach me:</div>
          <a href="https://github.com/bshaurya" target="_blank" rel="noopener noreferrer" 
             className="block hover:text-terminal-cursor transition-colors duration-200">
            → github.com/bshaurya
          </a>
          <a href="https://linkedin.com/in/sbisht314" target="_blank" rel="noopener noreferrer"
             className="block hover:text-terminal-cursor transition-colors duration-200">
            → linkedin.com/in/sbisht314
          </a>
          <a href="mailto:bishtshaurya314@gmail.com"
             className="block hover:text-terminal-cursor transition-colors duration-200">
            → bishtshaurya314@gmail.com
          </a>
          <div className="text-terminal-text/60 mt-3">always down to chat about anything interesting!</div>
        </div>
      );
    }
    
    if (currentPath === '~/life' || ['about', 'hobbies', 'past', 'now', 'future'].includes(fileName)) {
      switch (fileName) {
        case 'about':
          return (
            <div key="about" className="space-y-2 text-sm animate-fade-in">
              <div className="text-terminal-cursor font-medium">who i am:</div>
              <p>born and raised in northern virginia, currently a student at 
                <a href="https://tjhsst.fcps.edu" target="_blank" rel="noopener noreferrer" 
                   className="text-terminal-cursor hover:underline mx-1">
                  tjhsst
                </a>
                exploring math and computation while figuring out how to make meaningful positive impact.
              </p>
            </div>
          );
        case 'hobbies':
          return (
            <div key="hobbies" className="space-y-2 text-sm animate-fade-in">
              <div className="text-terminal-cursor font-medium">things i love doing:</div>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>building at hackathons</li>
                <li>playing and watching cricket</li>
                <li>cooking, eating, and discovering new foods</li>
              </ul>
            </div>
          );
        case 'past':
          return (
            <div key="past" className="space-y-2 text-sm animate-fade-in">
              <div className="text-terminal-cursor font-medium">things i've done:</div>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>competed in chess for 9 years, reaching (inter)national youth levels</li>
                <li>built pieces of software that attracted investment and recognition</li>
                <li>created a low-cost emg glove with friends to help people with hand motor impairments, inspired to help a friend</li>
                <li>researched computational approaches to human flourishing alongside industry professionals</li>
              </ul>
            </div>
          );
        case 'now':
          return (
            <div key="now" className="space-y-2 text-sm animate-fade-in">
              <div className="text-terminal-cursor font-medium">things i do:</div>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>co-directing 
                  <a href="https://hacktj.org" target="_blank" rel="noopener noreferrer"
                     className="text-terminal-cursor hover:underline mx-1">
                    hacktj
                  </a>
                  - the world's largest high school hackathon with ~500 students
                </li>
                <li>junior captain of tj's 
                  <a href="https://activities.tjhsst.edu/ict" target="_blank" rel="noopener noreferrer"
                     className="text-terminal-cursor hover:underline mx-1">
                    computer team
                  </a>
                </li>
                <li>researching in computational approaches to sleep and human flourishing</li>
                <li>shipping software projects</li>
                <li>observing and understanding the fast-moving tech era, startup ecosystem, and learning from founders</li>
              </ul>
            </div>
          );
        case 'future':
          return (
            <div key="future" className="space-y-2 text-sm animate-fade-in">
              <div className="text-terminal-cursor font-medium">things i want to do</div>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>answer "how can humans sleep optimally?"</li>
                <li>watch more sunsets and sunrises</li>
                <li>understand what matters to people and why</li>
              </ul>
            </div>
          );
      }
    }
    
    return null;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    playTypingSound();
    
    if (e.key === 'Enter') {
      if (suggestions.length > 0 && selectedSuggestion >= 0) {
        setCurrentCommand(suggestions[selectedSuggestion]);
        setSuggestions([]);
        return;
      }
      executeCommand(currentCommand);
      setCurrentCommand('');
      setSuggestions([]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestion(Math.max(0, selectedSuggestion - 1));
      } else if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestion(Math.min(suggestions.length - 1, selectedSuggestion + 1));
      } else if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentCommand('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentCommand(commandHistory[newIndex]);
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setCurrentCommand(suggestions[selectedSuggestion]);
        setSuggestions([]);
      }
    }
  };

  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  if (showGame) {
    return <SnakeGame onExit={() => setShowGame(false)} />;
  }

  const theme = themes[currentTheme];

  return (
    <div 
      ref={terminalRef}
      className="font-mono text-sm leading-relaxed h-96 overflow-y-auto cursor-text terminal-scrollbar relative"
      onClick={handleTerminalClick}
      style={{ 
        color: theme.text 
      }}
    >
      {isLoading && (
        <div className="absolute top-2 right-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-terminal-cursor"></div>
        </div>
      )}
      
      <div className="mb-4">
        <div className="text-terminal-text/70 mb-2">~/shaurya</div>
        <div className="text-terminal-text/70 mb-2">~$ ls</div>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => smartNavigate('life', true)}
            className={`text-terminal-cursor hover:underline transition-all duration-200 hover:scale-105 ${isMobile ? 'text-lg py-2 px-1' : ''}`}
          >
            life/
          </button>
          <button
            onClick={() => smartNavigate('find_my', true)}
            className={`text-terminal-cursor hover:underline transition-all duration-200 hover:scale-105 ${isMobile ? 'text-lg py-2 px-1' : ''}`}
          >
            find_my
          </button>

        </div>
      </div>
      
      {output}
      
      <div className="flex items-center relative">
        <span className="text-terminal-text/50">{currentPath}$ </span>
        <input
          ref={inputRef}
          type="text"
          value={currentCommand}
          onChange={(e) => setCurrentCommand(e.target.value)}
          onKeyDown={handleKeyPress}
          className={`bg-transparent border-none outline-none flex-1 ml-1 ${isMobile ? 'text-lg' : ''}`}
          style={{ color: theme.text }}
          autoFocus={!isMobile}
        />
        <span 
          className={`inline-block w-2 h-4 ml-1 transition-opacity duration-75 ${
            showCursor ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundColor: theme.cursor }}
        />
      </div>
      
      {suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 mb-1 bg-terminal-bg border border-terminal-cursor/30 rounded p-2 z-10">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion}
              className={`px-2 py-1 cursor-pointer ${
                index === selectedSuggestion ? 'bg-terminal-cursor/20' : ''
              }`}
              onClick={() => {
                setCurrentCommand(suggestion);
                setSuggestions([]);
              }}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
      
      {isMobile && (
        <div className="fixed bottom-4 right-4 flex gap-2">
          <button
            onClick={() => executeCommand('clear')}
            className="bg-terminal-cursor/20 text-terminal-cursor px-3 py-2 rounded text-sm"
          >
            Clear
          </button>
          <button
            onClick={() => executeCommand('help')}
            className="bg-terminal-cursor/20 text-terminal-cursor px-3 py-2 rounded text-sm"
          >
            Help
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedTerminalContent;
