import React from 'react';
import { useCustomization } from '../../contexts/CustomizationContext';

interface ParagraphSection {
  content: string;
  raw_html: string;
}
import styles from './ParagraphRenderer.module.css';

interface ParagraphRendererProps {
  section: ParagraphSection;
}

export const ParagraphRenderer: React.FC<ParagraphRendererProps> = ({ section }) => {
  const { settings } = useCustomization();

  // Process HTML content
  let htmlContent = section.raw_html;

  // Filter footnotes if disabled
  if (settings.visualEffects.showFootnotes === false) {
    // Remove footnote links (sup elements with links)
    htmlContent = htmlContent.replace(/<sup[^>]*>.*?<\/sup>/gi, '');
  }

  // Make all links open in new tabs
  htmlContent = htmlContent.replace(
    /<a\s+([^>]*?)href\s*=\s*["']([^"']+)["']([^>]*?)>/gi,
    (match, beforeHref, href, afterHref) => {
      // Skip if it's an internal anchor link (starts with #)
      if (href.startsWith('#')) {
        return match;
      }

      // Check if target and rel attributes already exist
      const hasTarget = /target\s*=/i.test(beforeHref + afterHref);
      const hasRel = /rel\s*=/i.test(beforeHref + afterHref);

      let attributes = beforeHref + afterHref;
      if (!hasTarget) {
        attributes += ' target="_blank"';
      }
      if (!hasRel) {
        attributes += ' rel="noopener noreferrer"';
      }

      return `<a ${attributes} href="${href}">`;
    }
  );

  return (
    <div
      className={`${styles.paragraph} customized-content ${
        section.contains_links ? styles.hasLinks : ''
      } ${
        section.contains_emphasis ? styles.hasEmphasis : ''
      }`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};
