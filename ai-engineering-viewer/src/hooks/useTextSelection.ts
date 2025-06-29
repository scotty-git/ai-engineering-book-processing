import { useEffect, useCallback } from 'react';
import { useNotes } from '../contexts/NotesContext';
import type { TextRange } from '../contexts/NotesContext';

/**
 * Hook for managing text selection and converting it to note-compatible format
 */
export function useTextSelection(chapterId: string) {
  const { setSelectedText } = useNotes();

  // Convert DOM Selection to our TextRange format
  const selectionToTextRange = useCallback((selection: Selection): TextRange | null => {
    if (!selection.rangeCount) return null;
    
    const range = selection.getRangeAt(0);
    const startContainer = range.startContainer;
    const endContainer = range.endContainer;
    
    // Find the closest element with an ID or create a selector
    const getElementSelector = (node: Node): string => {
      let element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as Element;

      // Try to find an element with an ID first
      while (element && !element.id) {
        element = element.parentElement;
      }

      if (element?.id) {
        return `#${element.id}`;
      }

      // Fallback: find the content area and use a more reliable selector
      element = node.nodeType === Node.TEXT_NODE ? node.parentElement : node as Element;

      // Look for the TextHighlighter container
      const textHighlighter = element?.closest('[data-content-area="true"]');
      if (textHighlighter && element) {
        // Create a path from the text highlighter to this element
        const path: string[] = [];
        let current = element;

        while (current && current !== textHighlighter) {
          const siblings = Array.from(current.parentElement?.children || []);
          const index = siblings.indexOf(current);
          path.unshift(`${current.tagName.toLowerCase()}:nth-child(${index + 1})`);
          current = current.parentElement;
        }

        if (path.length > 0) {
          return `[data-content-area="true"] ${path.join(' > ')}`;
        }
      }

      // Ultimate fallback
      if (element) {
        const tagName = element.tagName.toLowerCase();
        return tagName;
      }

      return '[data-content-area="true"]';
    };

    return {
      startOffset: range.startOffset,
      endOffset: range.endOffset,
      startContainer: getElementSelector(startContainer),
      endContainer: getElementSelector(endContainer),
    };
  }, []);

  // Handle text selection
  const handleSelectionChange = useCallback(() => {
    const selection = window.getSelection();
    
    if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) {
      setSelectedText(null);
      return;
    }

    const selectedText = selection.toString().trim();
    
    // Only process selections that are meaningful (more than just whitespace)
    if (selectedText.length < 3) {
      setSelectedText(null);
      return;
    }

    // Check if selection is within the content area (not in sidebar or UI elements)
    const range = selection.getRangeAt(0);
    const container = range.commonAncestorContainer;
    const contentElement = container.nodeType === Node.TEXT_NODE 
      ? container.parentElement 
      : container as Element;
    
    // Look for content area markers
    const isInContent = contentElement?.closest('[data-content-area="true"]') || 
                       contentElement?.closest('.chapter-content') ||
                       contentElement?.closest('main');
    
    if (!isInContent) {
      setSelectedText(null);
      return;
    }

    const textRange = selectionToTextRange(selection);
    
    if (textRange) {
      setSelectedText({
        text: selectedText,
        range: textRange,
        chapterId,
      });
    }
  }, [chapterId, setSelectedText, selectionToTextRange]);

  // Set up selection event listeners
  useEffect(() => {
    // Use mouseup instead of selectionchange for better performance
    // and to avoid firing on programmatic selections
    const handleMouseUp = (e: MouseEvent) => {
      // Don't process clicks on navigation elements or UI controls
      const target = e.target as HTMLElement;
      if (
        target.closest('aside') ||
        target.closest('nav') ||
        target.closest('header') ||
        target.closest('[role="button"]') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[class*="sidebar"]') ||
        target.closest('[class*="customization"]') ||
        target.closest('[class*="notes"]') ||
        target.closest('[class*="popup"]') ||
        target.closest('[class*="toggle"]') ||
        target.closest('[class*="panel"]')
      ) {
        return;
      }

      // Small delay to ensure selection is complete
      setTimeout(handleSelectionChange, 10);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      // Handle keyboard selections (Shift + arrow keys, etc.)
      if (e.shiftKey || e.key === 'ArrowLeft' || e.key === 'ArrowRight' ||
          e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        setTimeout(handleSelectionChange, 10);
      }
    };

    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleSelectionChange]);

  // Function to restore a text range selection (for editing existing notes)
  const restoreSelection = useCallback((textRange: TextRange, text: string): boolean => {
    try {
      const startElement = document.querySelector(textRange.startContainer);
      const endElement = document.querySelector(textRange.endContainer);
      
      if (!startElement || !endElement) {
        return false;
      }

      // Find text nodes within the elements
      const findTextNode = (element: Element, offset: number): { node: Text; offset: number } | null => {
        const walker = document.createTreeWalker(
          element,
          NodeFilter.SHOW_TEXT,
          null
        );

        let currentOffset = 0;
        let node: Text | null = null;

        while (node = walker.nextNode() as Text) {
          const nodeLength = node.textContent?.length || 0;
          if (currentOffset + nodeLength >= offset) {
            return { node, offset: offset - currentOffset };
          }
          currentOffset += nodeLength;
        }

        return null;
      };

      const startTextNode = findTextNode(startElement, textRange.startOffset);
      const endTextNode = findTextNode(endElement, textRange.endOffset);

      if (!startTextNode || !endTextNode) {
        return false;
      }

      const range = document.createRange();
      range.setStart(startTextNode.node, startTextNode.offset);
      range.setEnd(endTextNode.node, endTextNode.offset);

      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
        return true;
      }
    } catch (error) {
      console.warn('Failed to restore text selection:', error);
    }
    
    return false;
  }, []);

  // Clear current selection
  const clearSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
    }
    setSelectedText(null);
  }, [setSelectedText]);

  return {
    restoreSelection,
    clearSelection,
  };
}
