import React from 'react';

// Helper to normalize url to proper href
export const formatHref = (url: string): string => {
  if (!url) return '#';
  if (
    url.startsWith('www.') || 
    (/^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/i.test(url) && 
      !url.startsWith('http://') && 
      !url.startsWith('https://') && 
      !url.startsWith('/') && 
      !url.startsWith('#') && 
      !url.startsWith('mailto:'))
  ) {
    return `https://${url}`;
  }
  return url;
};

// Helper to render text with clickable links (supporting markdown [label](url), raw URLs, and www. links)
export const renderTextWithLinks = (text: string) => {
  if (!text) return null;
  const regex = /\[([^\]]+)\]\(((?:https?:\/\/|www\.)[^\s)]+|[^\s)]+)\)|((?:https?:\/\/|www\.)[^\s<]+[^\s<.,:;\"')\]!?])/g;
  const elements: (string | React.JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }
    const label = match[1];
    const mdUrl = match[2];
    const rawUrl = match[3];
    const url = mdUrl || rawUrl;
    const href = formatHref(url);
    const display = label || rawUrl;
    elements.push(
      <a
        key={`link-${match.index}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        className="text-[#188ab2] underline hover:text-[#0f6f8f] font-extrabold cursor-pointer break-all"
      >
        {display}
      </a>
    );
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length > 0 ? elements : text;
};
