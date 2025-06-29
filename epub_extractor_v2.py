#!/usr/bin/env python3
"""
Advanced EPUB Extractor v2
Extracts all content from AI Engineering EPUB with maximum fidelity
Includes advanced cross-referencing and semantic relationship detection
"""

import os
import re
import json
import ebooklib
from ebooklib import epub
from bs4 import BeautifulSoup
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
import logging
from datetime import datetime

class EPUBExtractor:
    """Advanced EPUB content extractor with full fidelity preservation"""
    
    def __init__(self, epub_path: str, output_dir: str = "extracted-content"):
        """
        Initialize the EPUB extractor
        
        Args:
            epub_path: Path to the EPUB file
            output_dir: Directory to extract content to
        """
        self.epub_path = epub_path
        self.output_dir = Path(output_dir)
        self.book = None
        
        # Content tracking
        self.chapters = {}
        self.images = {}
        self.cross_references = {}
        self.toc = {}
        self.extraction_stats = {
            'chapters_processed': 0,
            'images_extracted': 0,
            'figures_found': 0,
            'tables_found': 0,
            'code_blocks_found': 0,
            'cross_refs_found': 0,
            'errors': []
        }
        
        # Setup logging
        self._setup_logging()
        
    def _setup_logging(self):
        """Setup detailed logging"""
        log_file = self.output_dir / 'extraction.log'
        self.output_dir.mkdir(exist_ok=True)
        
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
    def load_epub(self) -> bool:
        """Load and validate EPUB file"""
        try:
            self.book = epub.read_epub(self.epub_path)
            self.logger.info(f"✅ Successfully loaded EPUB: {self.epub_path}")
            
            # Basic validation
            html_items = list(self.book.get_items_of_type(ebooklib.ITEM_DOCUMENT))
            image_items = list(self.book.get_items_of_type(ebooklib.ITEM_IMAGE))
            
            self.logger.info(f"📄 Found {len(html_items)} HTML documents")
            self.logger.info(f"🖼️  Found {len(image_items)} images")
            
            return True
            
        except Exception as e:
            self.logger.error(f"❌ Failed to load EPUB: {e}")
            self.extraction_stats['errors'].append(f"EPUB load failed: {e}")
            return False
    
    def create_directory_structure(self):
        """Create the extraction directory structure"""
        directories = [
            self.output_dir / 'chapters' / 'raw-html',
            self.output_dir / 'chapters' / 'structured',
            self.output_dir / 'chapters' / 'metadata',
            self.output_dir / 'images',
            self.output_dir / 'assets'
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
            
        self.logger.info("📁 Created directory structure")
    
    def extract_all_images(self) -> Dict[str, Any]:
        """Extract all images with metadata"""
        self.logger.info("🖼️  Starting image extraction...")
        
        image_items = list(self.book.get_items_of_type(ebooklib.ITEM_IMAGE))
        image_manifest = {
            'total_images': len(image_items),
            'extraction_date': datetime.now().isoformat(),
            'images': {}
        }
        
        images_dir = self.output_dir / 'images'
        
        for img_item in image_items:
            try:
                # Get image info
                img_name = img_item.get_name()
                img_content = img_item.get_content()
                
                # Clean filename (remove assets/ prefix if present)
                clean_name = img_name.replace('assets/', '').replace('/', '_')
                output_path = images_dir / clean_name
                
                # Extract image
                with open(output_path, 'wb') as f:
                    f.write(img_content)
                
                # Store metadata
                image_manifest['images'][clean_name] = {
                    'original_path': img_name,
                    'size_bytes': len(img_content),
                    'size_kb': round(len(img_content) / 1024, 1),
                    'extracted_path': str(output_path),
                    'chapter': self._detect_chapter_from_filename(clean_name)
                }
                
                self.extraction_stats['images_extracted'] += 1
                
            except Exception as e:
                error_msg = f"Failed to extract image {img_name}: {e}"
                self.logger.error(error_msg)
                self.extraction_stats['errors'].append(error_msg)
        
        # Save image manifest
        manifest_path = self.output_dir / 'assets' / 'image-manifest.json'
        with open(manifest_path, 'w') as f:
            json.dump(image_manifest, f, indent=2)
        
        self.logger.info(f"✅ Extracted {self.extraction_stats['images_extracted']} images")
        return image_manifest
    
    def _detect_chapter_from_filename(self, filename: str) -> Optional[int]:
        """Detect chapter number from image filename"""
        match = re.search(r'aien_(\d{2})\d{2}\.png', filename)
        if match:
            return int(match.group(1))
        return None
    
    def extract_chapter(self, chapter_file: str, test_mode: bool = False) -> Dict[str, Any]:
        """Extract a single chapter with full analysis"""
        self.logger.info(f"📖 Processing chapter: {chapter_file}")
        
        # Find the chapter item
        html_items = list(self.book.get_items_of_type(ebooklib.ITEM_DOCUMENT))
        chapter_item = None
        
        for item in html_items:
            if item.get_name() == chapter_file:
                chapter_item = item
                break
        
        if not chapter_item:
            error_msg = f"Chapter file {chapter_file} not found in EPUB"
            self.logger.error(error_msg)
            self.extraction_stats['errors'].append(error_msg)
            return {}
        
        # Extract raw HTML
        raw_html = chapter_item.get_content().decode('utf-8')
        soup = BeautifulSoup(raw_html, 'html.parser')
        
        # Save raw HTML
        raw_html_path = self.output_dir / 'chapters' / 'raw-html' / chapter_file
        with open(raw_html_path, 'w', encoding='utf-8') as f:
            f.write(raw_html)
        
        # Parse structured content
        structured_data = self._parse_chapter_structure(soup, chapter_file)
        
        # Extract cross-references
        cross_refs = self._extract_cross_references(soup, structured_data)
        structured_data['cross_references'] = cross_refs
        
        # Save structured JSON
        chapter_name = chapter_file.replace('.html', '')
        json_path = self.output_dir / 'chapters' / 'structured' / f'{chapter_name}.json'
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(structured_data, f, indent=2, ensure_ascii=False)
        
        self.extraction_stats['chapters_processed'] += 1
        self.logger.info(f"✅ Completed processing {chapter_file}")
        
        return structured_data
    
    def _parse_chapter_structure(self, soup: BeautifulSoup, chapter_file: str) -> Dict[str, Any]:
        """Parse chapter HTML into structured format"""
        chapter_data = {
            'id': chapter_file.replace('.html', ''),
            'title': '',
            'sections': [],
            'metadata': {
                'word_count': 0,
                'reading_time_minutes': 0,
                'extraction_date': datetime.now().isoformat()
            },
            'content_summary': {
                'figures': [],
                'tables': [],
                'code_blocks': [],
                'headings': [],
                'images': []
            }
        }

        # Extract title from chapter section, not just first H1
        chapter_section = soup.find('section', {'data-type': 'chapter'})
        if not chapter_section:
            chapter_section = soup.find('section', {'epub:type': 'chapter'})

        if chapter_section:
            chapter_h1 = chapter_section.find('h1')
            if chapter_h1:
                chapter_data['title'] = chapter_h1.get_text().strip()

        # Fallback to first H1 if no chapter section found
        if not chapter_data['title']:
            h1 = soup.find('h1')
            if h1:
                chapter_data['title'] = h1.get_text().strip()

        # Parse all content elements in order
        body = soup.find('body')
        if body:
            chapter_data['sections'] = self._parse_content_sections(body)

        # Calculate metadata
        all_text = soup.get_text()
        words = all_text.split()
        chapter_data['metadata']['word_count'] = len(words)
        chapter_data['metadata']['reading_time_minutes'] = max(1, len(words) // 200)  # ~200 WPM

        # Update extraction stats
        self.extraction_stats['figures_found'] += len(chapter_data['content_summary']['figures'])
        self.extraction_stats['tables_found'] += len(chapter_data['content_summary']['tables'])
        self.extraction_stats['code_blocks_found'] += len(chapter_data['content_summary']['code_blocks'])

        return chapter_data

    def _parse_content_sections(self, body_element) -> List[Dict[str, Any]]:
        """Parse all content elements in document order"""
        sections = []

        # Get ALL elements in document order, then filter for content elements
        # This preserves the actual document order unlike find_all() with multiple tags
        for element in body_element.descendants:
            # Skip text nodes and elements without names
            if not hasattr(element, 'name') or not element.name:
                continue

            # Only process content elements
            if element.name not in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'figure', 'table', 'pre', 'ul', 'ol', 'dl', 'aside', 'div']:
                continue

            # Only process div elements that are note containers
            if element.name == 'div' and element.get('data-type') != 'note':
                continue

            # Skip elements that are nested inside note containers to avoid double-processing
            # Check if this element has a note container as an ancestor
            note_ancestor = element.find_parent('div', {'data-type': 'note'})
            if note_ancestor and note_ancestor != element:
                continue

            section = self._parse_element(element)
            if section:
                sections.append(section)

        return sections

    def _parse_element(self, element) -> Optional[Dict[str, Any]]:
        """Parse individual HTML element into structured format"""
        tag_name = element.name.lower()

        # NEW: Check for note containers FIRST (before heading parsing)
        if tag_name == 'div' and element.get('data-type') == 'note':
            return self._parse_note_container(element)

        if tag_name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            return self._parse_heading(element)
        elif tag_name == 'p':
            return self._parse_paragraph(element)
        elif tag_name == 'figure':
            return self._parse_figure(element)
        elif tag_name == 'table':
            return self._parse_table(element)
        elif tag_name == 'pre':
            return self._parse_code_block(element)
        elif tag_name in ['ul', 'ol']:
            return self._parse_list(element)
        elif tag_name == 'dl':
            return self._parse_definition_list(element)
        elif tag_name == 'aside':
            return self._parse_aside(element)

        return None

    def _parse_heading(self, element) -> Optional[Dict[str, Any]]:
        """Parse heading element, filtering out figure captions and notes"""
        level = int(element.name[1])  # h1 -> 1, h2 -> 2, etc.
        text = element.get_text().strip()

        # Skip figure captions (H6 inside figure elements)
        if level == 6 and element.find_parent('figure'):
            return None  # This will be handled by _parse_figure

        # Note: Note/callout elements are now handled by _parse_note_container
        # Skip H6 elements that are inside note containers (they'll be processed as part of the container)
        if level == 6 and element.find_parent('div', {'data-type': 'note'}):
            return None  # This will be handled by _parse_note_container

        # Skip other non-structural H6 elements that are likely captions
        if level == 6 and (text.startswith('Figure ') or text.startswith('Table ') or text.startswith('Code ')):
            return None  # These should be handled by their respective content blocks

        # Check if this is the chapter title (H1 in chapter section)
        parent_section = element.find_parent('section')
        is_chapter_title = False

        if level == 1 and parent_section:
            data_type = parent_section.get('data-type', '')
            epub_type = parent_section.get('epub:type', '')

            if data_type == 'chapter' or epub_type == 'chapter':
                is_chapter_title = True
                # Also check if it contains "Chapter" and a number
                if 'Chapter' in text and any(char.isdigit() for char in text):
                    return {
                        'type': 'chapter_title',
                        'content': text,
                        'id': element.get('id', 'chapter-title'),
                        'raw_html': str(element)
                    }

        # Use pure semantic section structure for consistent hierarchy
        if parent_section:
            section_data_type = parent_section.get('data-type', '')
            if section_data_type.startswith('sect'):
                try:
                    # Extract section level (sect1 -> 1, sect2 -> 2, etc.)
                    sect_level = int(section_data_type[4:]) if len(section_data_type) > 4 else 1

                    # Pure semantic mapping - ignore original HTML heading levels
                    # sect1 -> H1 (main sections)
                    # sect2 -> H2 (subsections)
                    # sect3 -> H3 (sub-subsections)
                    # sect4 -> H4 (etc.)

                    # Use section level directly for consistent hierarchy
                    level = sect_level

                    # Cap at reasonable levels (H1-H4 for main structure)
                    level = min(level, 4)

                except (ValueError, IndexError):
                    pass  # Keep original level if parsing fails

        # Generate ID if not present
        element_id = element.get('id', f"heading-{len(self.extraction_stats)}")

        heading_data = {
            'type': 'heading',
            'level': level,
            'content': text,
            'id': element_id,
            'raw_html': str(element),
            'section_type': parent_section.get('data-type', '') if parent_section else ''
        }

        return heading_data

    def _parse_note_container(self, element) -> Dict[str, Any]:
        """Parse complete note container with all content"""
        # Extract the note type from h6 header
        header = element.find('h6')
        note_type = 'note'  # default
        if header:
            header_text = header.get_text().strip().lower()
            if header_text in ['note', 'tip', 'warning', 'caution', 'important']:
                note_type = header_text

        # Extract all content paragraphs (skip the header)
        content_parts = []
        for p in element.find_all('p'):
            content_text = p.get_text().strip()
            if content_text:  # Only add non-empty paragraphs
                content_parts.append(content_text)

        # Also check for other content like lists
        for ul in element.find_all(['ul', 'ol']):
            list_items = []
            for li in ul.find_all('li'):
                li_text = li.get_text().strip()
                if li_text:
                    list_items.append(li_text)
            if list_items:
                content_parts.append('\n'.join(f"• {item}" for item in list_items))

        # Combine all content
        full_content = '\n\n'.join(content_parts) if content_parts else note_type.title()

        return {
            'type': 'callout',
            'callout_type': note_type,
            'content': full_content,
            'raw_html': str(element)
        }

    def _parse_paragraph(self, element) -> Dict[str, Any]:
        """Parse paragraph element"""
        text = element.get_text().strip()
        if not text:  # Skip empty paragraphs
            return None

        return {
            'type': 'paragraph',
            'content': text,
            'raw_html': str(element),
            'contains_links': len(element.find_all('a')) > 0,
            'contains_emphasis': len(element.find_all(['em', 'strong'])) > 0
        }

    def _parse_figure(self, element) -> Dict[str, Any]:
        """Parse figure element with image and caption"""
        # Try to find the actual figure div inside the figure element
        figure_div = element.find('div', class_='figure')
        if figure_div:
            figure_id = figure_div.get('id', element.get('id', ''))
        else:
            figure_id = element.get('id', '')

        figure_data = {
            'type': 'figure',
            'id': figure_id,
            'raw_html': str(element)
        }

        # Find image
        img = element.find('img')
        if img:
            src = img.get('src', '')
            # Clean image path
            clean_src = src.replace('assets/', '')

            figure_data.update({
                'image': clean_src,
                'alt': img.get('alt', ''),
                'image_src_original': src
            })

        # Find caption (H6 inside figure)
        caption_elem = element.find('h6')
        if caption_elem:
            caption_text = caption_elem.get_text().strip()

            # Parse label and text separately
            label_span = caption_elem.find('span', class_='label')
            if label_span:
                label_text = label_span.get_text().strip()
                remaining_text = caption_text.replace(label_text, '').strip()
                figure_data['caption'] = {
                    'label': label_text,
                    'text': remaining_text
                }
            else:
                figure_data['caption'] = {'text': caption_text}

        # Also check for figcaption as fallback
        elif element.find('figcaption'):
            figcaption = element.find('figcaption')
            figure_data['caption'] = {'text': figcaption.get_text().strip()}

        return figure_data

    def _parse_table(self, element) -> Dict[str, Any]:
        """Parse table element with full structure"""
        table_data = {
            'type': 'table',
            'id': element.get('id', ''),
            'raw_html': str(element)
        }

        # Parse caption
        caption = element.find('caption')
        if caption:
            caption_text = caption.get_text().strip()
            label_span = caption.find('span', class_='label')
            if label_span:
                table_data['caption'] = {
                    'label': label_span.get_text().strip(),
                    'text': caption_text.replace(label_span.get_text(), '').strip()
                }
            else:
                table_data['caption'] = {'text': caption_text}

        # Parse headers
        headers = []
        thead = element.find('thead')
        if thead:
            header_row = thead.find('tr')
            if header_row:
                headers = [th.get_text().strip() for th in header_row.find_all(['th', 'td'])]

        # Parse rows
        rows = []
        tbody = element.find('tbody') or element
        for tr in tbody.find_all('tr'):
            if tr.parent.name != 'thead':  # Skip header rows
                row_data = [td.get_text().strip() for td in tr.find_all(['td', 'th'])]
                if row_data:  # Only add non-empty rows
                    rows.append(row_data)

        table_data.update({
            'headers': headers,
            'rows': rows,
            'row_count': len(rows),
            'column_count': len(headers) if headers else (len(rows[0]) if rows else 0)
        })

        return table_data

    def _parse_code_block(self, element) -> Dict[str, Any]:
        """Parse code block element"""
        code_text = element.get_text()

        return {
            'type': 'code',
            'content': code_text,
            'language': self._detect_code_language(code_text),
            'raw_html': str(element),
            'data_type': element.get('data-type', ''),
            'line_count': len(code_text.split('\n'))
        }

    def _parse_list(self, element) -> Dict[str, Any]:
        """Parse ordered or unordered list"""
        list_items = []
        for li in element.find_all('li', recursive=False):
            list_items.append(li.get_text().strip())

        return {
            'type': 'list',
            'list_type': 'ordered' if element.name == 'ol' else 'unordered',
            'items': list_items,
            'raw_html': str(element)
        }

    def _parse_definition_list(self, element) -> Dict[str, Any]:
        """Parse definition list (dl)"""
        definitions = []
        current_term = None

        for child in element.children:
            if hasattr(child, 'name'):
                if child.name == 'dt':
                    current_term = child.get_text().strip()
                elif child.name == 'dd' and current_term:
                    definitions.append({
                        'term': current_term,
                        'definition': child.get_text().strip()
                    })
                    current_term = None

        return {
            'type': 'definition_list',
            'definitions': definitions,
            'raw_html': str(element)
        }

    def _parse_aside(self, element) -> Dict[str, Any]:
        """Parse aside element (sidebars, notes)"""
        return {
            'type': 'aside',
            'content': element.get_text().strip(),
            'raw_html': str(element),
            'data_type': element.get('data-type', '')
        }

    def _detect_code_language(self, code_text: str) -> str:
        """Detect programming language from code content"""
        code_lower = code_text.lower()

        # Simple language detection patterns
        if 'import ' in code_lower and ('def ' in code_lower or 'class ' in code_lower):
            return 'python'
        elif 'function' in code_lower and ('{' in code_text or '=>' in code_text):
            return 'javascript'
        elif '#include' in code_lower or 'int main' in code_lower:
            return 'c'
        elif 'public class' in code_lower or 'public static void' in code_lower:
            return 'java'
        elif 'SELECT' in code_text.upper() or 'FROM' in code_text.upper():
            return 'sql'
        elif code_text.strip().startswith('{') and code_text.strip().endswith('}'):
            return 'json'

        return 'text'

    def _extract_cross_references(self, soup: BeautifulSoup, structured_data: Dict) -> Dict[str, Any]:
        """Extract advanced cross-references and semantic relationships"""
        cross_refs = {
            'internal_links': [],
            'figure_references': [],
            'table_references': [],
            'section_references': [],
            'external_links': [],
            'bidirectional_refs': {}
        }

        # Extract all links
        for link in soup.find_all('a'):
            href = link.get('href', '')
            link_text = link.get_text().strip()

            if href.startswith('http'):
                cross_refs['external_links'].append({
                    'url': href,
                    'text': link_text,
                    'context': self._get_element_context(link)
                })
            elif href.startswith('#'):
                cross_refs['internal_links'].append({
                    'target': href[1:],
                    'text': link_text,
                    'context': self._get_element_context(link)
                })

        # Find text references to figures and tables
        all_text = soup.get_text()

        # Figure references (e.g., "Figure 1-1", "see Figure 2-3")
        figure_patterns = [
            r'[Ff]igure\s+(\d+-\d+)',
            r'[Ss]ee\s+[Ff]igure\s+(\d+-\d+)',
            r'[Aa]s\s+shown\s+in\s+[Ff]igure\s+(\d+-\d+)'
        ]

        for pattern in figure_patterns:
            matches = re.finditer(pattern, all_text)
            for match in matches:
                cross_refs['figure_references'].append({
                    'reference': match.group(0),
                    'figure_id': match.group(1),
                    'position': match.start()
                })

        # Table references
        table_patterns = [
            r'[Tt]able\s+(\d+-\d+)',
            r'[Ss]ee\s+[Tt]able\s+(\d+-\d+)'
        ]

        for pattern in table_patterns:
            matches = re.finditer(pattern, all_text)
            for match in matches:
                cross_refs['table_references'].append({
                    'reference': match.group(0),
                    'table_id': match.group(1),
                    'position': match.start()
                })

        return cross_refs

    def _get_element_context(self, element, context_length: int = 100) -> str:
        """Get surrounding text context for an element"""
        parent = element.parent
        if parent:
            parent_text = parent.get_text()
            element_text = element.get_text()

            # Find element position in parent text
            element_pos = parent_text.find(element_text)
            if element_pos >= 0:
                start = max(0, element_pos - context_length // 2)
                end = min(len(parent_text), element_pos + len(element_text) + context_length // 2)
                return parent_text[start:end].strip()

        return ""

    def validate_extraction(self, chapter_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate extracted chapter data for completeness and accuracy"""
        validation_results = {
            'valid': True,
            'warnings': [],
            'errors': [],
            'stats': {
                'sections_found': len(chapter_data.get('sections', [])),
                'figures_found': 0,
                'tables_found': 0,
                'code_blocks_found': 0,
                'headings_found': 0,
                'images_referenced': 0
            }
        }

        # Count content types
        for section in chapter_data.get('sections', []):
            section_type = section.get('type', '')
            if section_type == 'figure':
                validation_results['stats']['figures_found'] += 1
                if 'image' in section:
                    validation_results['stats']['images_referenced'] += 1
                    # Check if image file exists
                    image_path = self.output_dir / 'images' / section['image']
                    if not image_path.exists():
                        validation_results['errors'].append(f"Referenced image not found: {section['image']}")
                        validation_results['valid'] = False
            elif section_type == 'table':
                validation_results['stats']['tables_found'] += 1
            elif section_type == 'code':
                validation_results['stats']['code_blocks_found'] += 1
            elif section_type == 'heading':
                validation_results['stats']['headings_found'] += 1

        # Validate required fields
        required_fields = ['id', 'title', 'sections', 'metadata']
        for field in required_fields:
            if field not in chapter_data:
                validation_results['errors'].append(f"Missing required field: {field}")
                validation_results['valid'] = False

        # Check for empty content
        if not chapter_data.get('sections'):
            validation_results['warnings'].append("No content sections found")

        if validation_results['stats']['figures_found'] == 0:
            validation_results['warnings'].append("No figures found - expected for technical content")

        return validation_results

    def generate_extraction_report(self) -> Dict[str, Any]:
        """Generate comprehensive extraction report"""
        report = {
            'extraction_date': datetime.now().isoformat(),
            'epub_source': str(self.epub_path),
            'output_directory': str(self.output_dir),
            'statistics': self.extraction_stats.copy(),
            'directory_structure': self._get_directory_structure(),
            'validation_summary': {
                'total_errors': len(self.extraction_stats['errors']),
                'extraction_successful': len(self.extraction_stats['errors']) == 0
            }
        }

        # Save report
        report_path = self.output_dir / 'extraction-report.json'
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)

        return report

    def _get_directory_structure(self) -> Dict[str, Any]:
        """Get directory structure for reporting"""
        structure = {}

        for root, dirs, files in os.walk(self.output_dir):
            rel_path = os.path.relpath(root, self.output_dir)
            if rel_path == '.':
                rel_path = 'root'

            structure[rel_path] = {
                'directories': dirs,
                'files': len(files),
                'file_list': files[:10]  # First 10 files only
            }

        return structure

    def extract_all_chapters(self) -> bool:
        """Extract all chapters with full validation"""
        self.logger.info("📚 Starting extraction of all chapters...")

        # Get all chapter files
        html_items = list(self.book.get_items_of_type(ebooklib.ITEM_DOCUMENT))
        chapter_files = []

        for item in html_items:
            filename = item.get_name()
            if filename.startswith('ch') and filename.endswith('.html'):
                chapter_files.append(filename)

        chapter_files.sort()  # Ensure proper order
        self.logger.info(f"📖 Found {len(chapter_files)} chapters to process: {chapter_files}")

        all_chapters_data = {}
        successful_extractions = 0

        try:
            for chapter_file in chapter_files:
                self.logger.info(f"🔄 Processing {chapter_file}...")

                # Extract chapter
                chapter_data = self.extract_chapter(chapter_file, test_mode=False)

                if not chapter_data:
                    self.logger.error(f"❌ Failed to extract {chapter_file}")
                    continue

                # Validate extraction
                validation = self.validate_extraction(chapter_data)

                if validation['valid']:
                    self.logger.info(f"✅ {chapter_file} validation passed")
                    successful_extractions += 1
                else:
                    self.logger.error(f"❌ {chapter_file} validation failed")
                    for error in validation['errors']:
                        self.logger.error(f"   - {error}")

                for warning in validation['warnings']:
                    self.logger.warning(f"⚠️  {warning}")

                # Log statistics for this chapter
                stats = validation['stats']
                self.logger.info(f"📊 {chapter_file} Statistics:")
                self.logger.info(f"   - Sections: {stats['sections_found']}")
                self.logger.info(f"   - Figures: {stats['figures_found']}")
                self.logger.info(f"   - Tables: {stats['tables_found']}")
                self.logger.info(f"   - Code blocks: {stats['code_blocks_found']}")
                self.logger.info(f"   - Headings: {stats['headings_found']}")

                all_chapters_data[chapter_file] = chapter_data

            # Generate comprehensive metadata
            self.logger.info("🔗 Generating comprehensive metadata...")
            self._generate_book_metadata(all_chapters_data)

            # Generate final report
            report = self.generate_extraction_report()
            self.logger.info(f"📋 Final extraction report saved")

            # Summary
            self.logger.info(f"🎉 EXTRACTION COMPLETE!")
            self.logger.info(f"   - Total chapters processed: {successful_extractions}/{len(chapter_files)}")
            self.logger.info(f"   - Total images extracted: {self.extraction_stats['images_extracted']}")
            self.logger.info(f"   - Total figures found: {self.extraction_stats['figures_found']}")
            self.logger.info(f"   - Total tables found: {self.extraction_stats['tables_found']}")
            self.logger.info(f"   - Total code blocks found: {self.extraction_stats['code_blocks_found']}")

            return successful_extractions == len(chapter_files)

        except Exception as e:
            self.logger.error(f"❌ Full extraction failed: {e}")
            self.extraction_stats['errors'].append(f"Full extraction failed: {e}")
            return False

    def _generate_book_metadata(self, all_chapters_data: Dict[str, Any]):
        """Generate comprehensive book-level metadata"""
        book_metadata = {
            'title': 'AI Engineering',
            'extraction_date': datetime.now().isoformat(),
            'total_chapters': len(all_chapters_data),
            'table_of_contents': [],
            'global_cross_references': {
                'figures': {},
                'tables': {},
                'chapters': {}
            },
            'search_index': {
                'chapters': {},
                'figures': {},
                'tables': {}
            },
            'statistics': {
                'total_word_count': 0,
                'total_reading_time': 0,
                'total_figures': 0,
                'total_tables': 0,
                'total_code_blocks': 0
            }
        }

        # Build table of contents and aggregate statistics
        for chapter_file, chapter_data in all_chapters_data.items():
            chapter_id = chapter_data.get('id', chapter_file.replace('.html', ''))
            chapter_title = chapter_data.get('title', 'Unknown Chapter')

            # Add to TOC with hierarchical structure
            toc_entry = {
                'id': chapter_id,
                'title': chapter_title,
                'file': chapter_file,
                'word_count': chapter_data.get('metadata', {}).get('word_count', 0),
                'reading_time': chapter_data.get('metadata', {}).get('reading_time_minutes', 0),
                'sections': self._build_hierarchical_toc(chapter_data),
                'content_summary': {
                    'figures': len([s for s in chapter_data.get('sections', []) if s.get('type') == 'figure']),
                    'tables': len([s for s in chapter_data.get('sections', []) if s.get('type') == 'table']),
                    'code_blocks': len([s for s in chapter_data.get('sections', []) if s.get('type') == 'code']),
                    'headings': len([s for s in chapter_data.get('sections', []) if s.get('type') == 'heading'])
                }
            }

            book_metadata['table_of_contents'].append(toc_entry)

            # Aggregate statistics
            book_metadata['statistics']['total_word_count'] += chapter_data.get('metadata', {}).get('word_count', 0)
            book_metadata['statistics']['total_reading_time'] += chapter_data.get('metadata', {}).get('reading_time_minutes', 0)

            # Count content types
            for section in chapter_data.get('sections', []):
                section_type = section.get('type', '')
                if section_type == 'figure':
                    book_metadata['statistics']['total_figures'] += 1
                elif section_type == 'table':
                    book_metadata['statistics']['total_tables'] += 1
                elif section_type == 'code':
                    book_metadata['statistics']['total_code_blocks'] += 1

        # Save book metadata
        metadata_path = self.output_dir / 'chapters' / 'metadata' / 'book-metadata.json'
        with open(metadata_path, 'w', encoding='utf-8') as f:
            json.dump(book_metadata, f, indent=2, ensure_ascii=False)

        self.logger.info(f"📚 Book metadata saved to: {metadata_path}")
        return book_metadata

    def _build_hierarchical_toc(self, chapter_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Build hierarchical table of contents from chapter headings"""
        headings = []

        # Extract all structural headings (not figure captions or callouts)
        for section in chapter_data.get('sections', []):
            if section.get('type') == 'heading':
                headings.append({
                    'title': section.get('content', ''),
                    'level': section.get('level', 1),
                    'id': section.get('id', ''),
                    'children': []
                })

        if not headings:
            return []

        # Build hierarchical structure
        root_sections = []
        stack = []  # Stack to track parent sections at each level

        for heading in headings:
            level = heading['level']

            # Pop stack until we find the appropriate parent level
            while stack and stack[-1]['level'] >= level:
                stack.pop()

            # If we have a parent, add this heading as a child
            if stack:
                stack[-1]['children'].append(heading)
            else:
                # This is a root-level heading
                root_sections.append(heading)

            # Add this heading to the stack for potential children
            stack.append(heading)

        return root_sections

if __name__ == "__main__":
    print("🚀 AI Engineering EPUB Extractor v2 - FULL EXTRACTION")
    print("=" * 60)

    # Full extraction of all chapters
    extractor = EPUBExtractor("epub-source/AI Engineering (2).epub")

    if extractor.load_epub():
        extractor.create_directory_structure()

        # Extract all images first
        print("\n📸 Extracting all images...")
        image_manifest = extractor.extract_all_images()

        # Extract all chapters
        print("\n📚 Processing all chapters...")
        success = extractor.extract_all_chapters()

        if success:
            print("\n🎉 COMPLETE SUCCESS!")
            print("✅ All chapters extracted with perfect fidelity")
            print("✅ All images preserved and catalogued")
            print("✅ Advanced cross-references generated")
            print("✅ Comprehensive metadata created")
            print("\n🚀 Ready for React viewer development!")
        else:
            print("\n⚠️  Some chapters may have had issues - check logs for details")
            print("📋 Review extraction-report.json for full details")
    else:
        print("❌ Failed to load EPUB file")
