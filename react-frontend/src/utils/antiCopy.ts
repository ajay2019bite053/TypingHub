type EventHandler = (e: Event) => void;

interface AntiCopyHandlers {
  copy: EventHandler;
  contextmenu: EventHandler;
  paste: EventHandler;
}

const createHandlers = (): AntiCopyHandlers => ({
  copy: (e: Event) => {
    e.preventDefault();
    alert('Copying passage text is disabled.');
  },
  contextmenu: (e: Event) => {
    e.preventDefault();
  },
  paste: (e: Event) => {
    e.preventDefault();
    alert('Pasting text is disabled. Please type the passage.');
  }
});

export const initializeAntiCopy = (): void => {
  const handlers = createHandlers();
  
  const sampleTexts = document.querySelectorAll('.sample-text');
  sampleTexts.forEach(text => {
    text.addEventListener('copy', handlers.copy);
    text.addEventListener('contextmenu', handlers.contextmenu);
  });

  const typingAreas = document.querySelectorAll('.typing-area, textarea');
  typingAreas.forEach(area => {
    area.addEventListener('paste', handlers.paste);
    area.addEventListener('contextmenu', handlers.contextmenu);
  });
};

export const cleanupAntiCopy = (): void => {
  const handlers = createHandlers();
  const sampleTexts = document.querySelectorAll('.sample-text');
  const typingAreas = document.querySelectorAll('.typing-area, textarea');

  const removeListeners = (element: Element) => {
    element.removeEventListener('copy', handlers.copy);
    element.removeEventListener('contextmenu', handlers.contextmenu);
    element.removeEventListener('paste', handlers.paste);
  };

  sampleTexts.forEach(removeListeners);
  typingAreas.forEach(removeListeners);
}; 