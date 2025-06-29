import React from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  title: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  title, 
  message, 
  onRetry 
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>⚠️</div>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button 
          className={styles.retryButton}
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  );
};
