import React, { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useCustomization } from '../../contexts/CustomizationContext';

interface FigureSection {
  content: string;
  raw_html: string;
}
import styles from './FigureRenderer.module.css';

interface FigureRendererProps {
  section: FigureSection;
}

export const FigureRenderer: React.FC<FigureRendererProps> = ({ section }) => {
  const { settings } = useCustomization();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '50px 0px'
  });

  // Don't render if figures are hidden
  if (settings.visualEffects.showFigures === false) {
    return null;
  }

  const imagePath = `/extracted-content/images/${section.image}`;
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
    console.error(`Failed to load image: ${imagePath}`);
  };

  return (
    <figure
      ref={ref}
      className={`${styles.figure} customized-content`}
      id={section.id}
    >
      <div className={styles.imageContainer}>
        {inView && !imageError ? (
          <img
            src={imagePath}
            alt={section.alt}
            className={`${styles.image} ${imageLoaded ? styles.loaded : styles.loading}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        ) : imageError ? (
          <div className={styles.errorPlaceholder}>
            <div className={styles.errorIcon}>📷</div>
            <div className={styles.errorText}>
              Image failed to load
              <br />
              <small>{section.image}</small>
            </div>
          </div>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderIcon}>📷</div>
            <div className={styles.placeholderText}>Loading image...</div>
          </div>
        )}
      </div>
      
      {section.caption && (
        <figcaption className={styles.caption}>
          {section.caption.label && (
            <span className={styles.captionLabel}>
              {section.caption.label}
            </span>
          )}
          {section.caption.text && (
            <span className={styles.captionText}>
              {section.caption.text}
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
};
