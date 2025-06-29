import React from 'react';

interface HeadingSection {
  content: string;
  level: number;
  raw_html: string;
}
import styles from './HeadingRenderer.module.css';

interface HeadingRendererProps {
  section: HeadingSection;
}

export const HeadingRenderer: React.FC<HeadingRendererProps> = ({ section }) => {
  const level = section.level || 1;
  const content = section.content || '';
  const id = section.id || '';

  const getHeadingClass = () => {
    switch (level) {
      case 1:
        return styles.h1;
      case 2:
        return styles.h2;
      case 3:
        return styles.h3;
      case 4:
        return styles.h4;
      case 5:
        return styles.h5;
      case 6:
        return styles.h6;
      default:
        return styles.h6; // Default to h6 for levels > 6
    }
  };

  const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;

  return (
    <HeadingTag
      id={id}
      className={`${styles.heading} ${getHeadingClass()} customized-content`}
      data-level={level}
    >
      {content}
      {id && (
        <a
          href={`#${id}`}
          className={styles.anchor}
          aria-label="Link to this heading"
          title="Link to this heading"
        >
          #
        </a>
      )}
    </HeadingTag>
  );
};
