import React from 'react';
import { useCustomization } from '../../contexts/CustomizationContext';

interface ContentSection {
  type: string;
  content?: string;
  raw_html: string;
}

interface ContentRendererProps {
  section: ContentSection;
  chapterId: string;
}
import { ParagraphRenderer } from './ParagraphRenderer';
import { HeadingRenderer } from './HeadingRenderer';
import { FigureRenderer } from './FigureRenderer';
import styles from './ContentRenderer.module.css';

export const ContentRenderer: React.FC<ContentRendererProps> = ({ section, chapterId }) => {
  const { settings } = useCustomization();

  // Helper function to process HTML and make links open in new tabs
  const processLinksInHTML = (htmlContent: string): string => {
    return htmlContent.replace(
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
  };

  const renderContent = (section: ContentSection) => {
    // Content filtering based on settings
    switch (section.type) {
      case 'paragraph':
        return <ParagraphRenderer section={section} />;

      case 'heading':
        return <HeadingRenderer section={section} />;

      case 'figure':
        if (settings.visualEffects.showFigures === false) return null;
        return <FigureRenderer section={section} />;

      case 'chapter_title':
        return <HeadingRenderer section={{ ...section, level: 1 }} />;

      case 'table':
        if (settings.visualEffects.showTables === false) return null;
        return (
          <div
            className={styles.fallback}
            dangerouslySetInnerHTML={{ __html: processLinksInHTML(section.raw_html) }}
            data-content-type={section.type}
          />
        );

      case 'code':
        if (settings.visualEffects.showCodeBlocks === false) return null;
        return (
          <div
            className={styles.fallback}
            dangerouslySetInnerHTML={{ __html: processLinksInHTML(section.raw_html) }}
            data-content-type={section.type}
          />
        );

      // For other types, fall back to raw HTML
      case 'list':
      case 'definition_list':
      case 'aside':
      case 'callout':
      default:
        return (
          <div
            className={styles.fallback}
            dangerouslySetInnerHTML={{ __html: processLinksInHTML(section.raw_html) }}
            data-content-type={section.type}
          />
        );
    }
  };

  return (
    <div
      className={`${styles.contentSection} customized-content`}
      data-section-type={section.type}
    >
      {renderContent(section)}
    </div>
  );
};
