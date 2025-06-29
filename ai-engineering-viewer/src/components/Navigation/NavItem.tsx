import React from 'react';
import styles from './NavItem.module.css';

interface SectionTOC {
  title: string;
  level: number;
  id: string;
  children: SectionTOC[];
}

interface NavItemProps {
  section: SectionTOC;
  chapterId: string;
  currentSection?: string;
  onSectionSelect: (sectionId: string) => void;
  depth: number;
  children?: React.ReactNode;
}

export const NavItem: React.FC<NavItemProps> = ({
  section,
  chapterId,
  currentSection,
  onSectionSelect,
  depth,
  children
}) => {
  const isCurrentSection = currentSection === section.title;
  const hasChildren = section.children && section.children.length > 0;

  const handleClick = () => {
    // Since all section IDs are the same in metadata, pass the title instead
    onSectionSelect(section.title);
  };

  const getDepthClass = () => {
    switch (depth) {
      case 0:
        return styles.depth0;
      case 1:
        return styles.depth1;
      case 2:
        return styles.depth2;
      default:
        return styles.depth3;
    }
  };

  const getLevelClass = () => {
    switch (section.level) {
      case 1:
        return styles.level1;
      case 2:
        return styles.level2;
      case 3:
        return styles.level3;
      case 4:
        return styles.level4;
      default:
        return styles.level4;
    }
  };

  return (
    <div className={`${styles.navItem} customized-content`}>
      <button
        className={`${styles.navButton} ${getDepthClass()} ${getLevelClass()} customized-content ${
          isCurrentSection ? styles.current : ''
        }`}
        onClick={handleClick}
        title={section.title}
      >
        <span className={`${styles.navTitle} customized-content`}>
          {section.title}
        </span>
        {hasChildren && (
          <span className={`${styles.childrenIndicator} customized-content`}>
            ({section.children.length})
          </span>
        )}
      </button>
      {children}
    </div>
  );
};
