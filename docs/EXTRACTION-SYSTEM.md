# EPUB Extraction System - Technical Documentation

## 🔧 System Overview

The `epub_extractor_v2.py` system provides comprehensive EPUB content extraction with perfect fidelity preservation, advanced hierarchy processing, and complete validation. Built for the AI Engineering book project to create structured data for a custom React viewer.

## 🚨 Critical Fixes Applied

### **Document Order Preservation Fix**
**Issue**: Callouts and notes were appearing at the top of chapters instead of their correct positions within the content flow.

**Root Cause**: The original extraction used `find_all(['h1', 'h2', 'p', 'div', ...])` which processes all elements of one type before moving to the next type, breaking document order.

**Solution**: Switched to iterating through `body_element.descendants` with filtering to maintain true document order:
```python
# OLD (broken order)
for element in body_element.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'figure', 'table', 'pre', 'ul', 'ol', 'dl', 'aside', 'div']):

# NEW (preserves order)
for element in body_element.descendants:
    if hasattr(element, 'name') and element.name in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'figure', 'table', 'pre', 'ul', 'ol', 'dl', 'aside', 'div']:
```

**Result**: Notes and callouts now appear in their correct positions within the reading flow.

## 📋 Core Architecture

### **EPUBExtractor Class**
```python
class EPUBExtractor:
    def __init__(self, epub_path: str, output_dir: str = "extracted-content")
```

**Key Attributes:**
- `self.book` - Loaded EPUB object (ebooklib)
- `self.chapters` - Processed chapter data dictionary
- `self.images` - Image metadata and references
- `self.cross_references` - Advanced relationship data
- `self.extraction_stats` - Comprehensive processing statistics

### **Processing Pipeline**
1. **EPUB Loading & Validation** (`load_epub()`)
2. **Directory Structure Creation** (`create_directory_structure()`)
3. **Image Extraction** (`extract_all_images()`)
4. **Chapter Processing** (`extract_all_chapters()`)
5. **Metadata Generation** (`_generate_book_metadata()`)
6. **Validation & Reporting** (`validate_extraction()`)

## 🔍 Method Documentation

### **Core Processing Methods**

#### **`load_epub() -> bool`**
```python
def load_epub(self) -> bool:
    """Load and validate EPUB file"""
```
- Loads EPUB using `ebooklib.epub.read_epub()`
- Validates HTML documents and image inventory
- Sets up logging and error tracking
- Returns success/failure status

#### **`extract_all_images() -> Dict[str, Any]`**
```python
def extract_all_images(self) -> Dict[str, Any]:
    """Extract all images with metadata"""
```
- Processes all 162 images from EPUB
- Cleans filenames (removes `assets/` prefix)
- Generates comprehensive image manifest
- Detects chapter association from filename patterns
- **Output**: `extracted-content/images/` + `assets/image-manifest.json`

#### **`extract_chapter(chapter_file: str) -> Dict[str, Any]`**
```python
def extract_chapter(self, chapter_file: str, test_mode: bool = False) -> Dict[str, Any]:
    """Extract a single chapter with full analysis"""
```
- Saves raw HTML to `chapters/raw-html/`
- Parses structured content using BeautifulSoup
- Extracts cross-references and relationships
- Saves structured JSON to `chapters/structured/`
- **Dual output**: Raw HTML + structured JSON

### **Content Parsing Methods**

#### **`_parse_chapter_structure(soup, chapter_file) -> Dict[str, Any]`**
```python
def _parse_chapter_structure(self, soup: BeautifulSoup, chapter_file: str) -> Dict[str, Any]:
    """Parse chapter HTML into structured format"""
```
**Output Structure:**
```json
{
  "id": "ch01",
  "title": "Chapter 1. Introduction to...",
  "sections": [...],
  "metadata": {
    "word_count": 15234,
    "reading_time_minutes": 76,
    "extraction_date": "2025-06-27T14:44:39"
  },
  "content_summary": {
    "figures": 16,
    "tables": 6,
    "code_blocks": 2,
    "headings": 37
  }
}
```

#### **`_parse_element(element) -> Optional[Dict[str, Any]]`**
```python
def _parse_element(self, element) -> Optional[Dict[str, Any]]:
    """Parse individual HTML element into structured format"""
```
**Supported Elements:**
- `h1-h6` → `_parse_heading()` (with semantic hierarchy)
- `p` → `_parse_paragraph()`
- `figure` → `_parse_figure()`
- `table` → `_parse_table()`
- `pre` → `_parse_code_block()`
- `ul/ol` → `_parse_list()`
- `dl` → `_parse_definition_list()`
- `aside` → `_parse_aside()`

### **Semantic Hierarchy Processing**

#### **`_parse_heading(element) -> Optional[Dict[str, Any]]`**
```python
def _parse_heading(self, element) -> Optional[Dict[str, Any]]:
    """Parse heading element, filtering out figure captions and notes"""
```

**Critical Logic - Semantic Section Mapping:**
```python
# Use pure semantic section structure for consistent hierarchy
if parent_section:
    section_data_type = parent_section.get('data-type', '')
    if section_data_type.startswith('sect'):
        sect_level = int(section_data_type[4:])  # sect1 -> 1, sect2 -> 2
        
        # Pure semantic mapping - ignore original HTML heading levels
        # sect1 -> H1 (main sections)
        # sect2 -> H2 (subsections)  
        # sect3 -> H3 (sub-subsections)
        level = sect_level
```

**Special Handling:**
- **Chapter titles**: H1 in `data-type="chapter"` → separate `chapter_title` type
- **Figure captions**: H6 inside `<figure>` → handled by `_parse_figure()`
- **Callouts**: H6 with "Note", "Tip", "Warning" → `callout` type
- **Structural headings**: Use semantic section level, not original HTML level

### **Content Type Processors**

#### **`_parse_figure(element) -> Dict[str, Any]`**
```python
def _parse_figure(self, element) -> Dict[str, Any]:
    """Parse figure element with image and caption"""
```
**Output Structure:**
```json
{
  "type": "figure",
  "id": "ch01_figure_1_1730130814919858",
  "image": "aien_0101.png",
  "alt": "A close up of a sign Description automatically generated",
  "caption": {
    "label": "Figure 1-1.",
    "text": "An example of how GPT-4 tokenizes a phrase."
  },
  "raw_html": "<figure>...</figure>"
}
```

#### **`_parse_table(element) -> Dict[str, Any]`**
```python
def _parse_table(self, element) -> Dict[str, Any]:
    """Parse table element with full structure"""
```
**Features:**
- Caption extraction with label parsing
- Header row identification
- Complete row/column data preservation
- Metadata (row_count, column_count)
- Raw HTML preservation

#### **`_parse_code_block(element) -> Dict[str, Any]`**
```python
def _parse_code_block(self, element) -> Dict[str, Any]:
    """Parse code block element"""
```
**Features:**
- Language detection (`_detect_code_language()`)
- Line count calculation
- Content preservation with formatting
- Data type attribute capture

### **Advanced Features**

#### **`_extract_cross_references(soup, structured_data) -> Dict[str, Any]`**
```python
def _extract_cross_references(self, soup: BeautifulSoup, structured_data: Dict) -> Dict[str, Any]:
    """Extract advanced cross-references and semantic relationships"""
```
**Detection Patterns:**
- **Figure references**: `[Ff]igure\s+(\d+-\d+)`, `[Ss]ee\s+[Ff]igure\s+(\d+-\d+)`
- **Table references**: `[Tt]able\s+(\d+-\d+)`, `[Ss]ee\s+[Tt]able\s+(\d+-\d+)`
- **Internal links**: `href="#..."` with context extraction
- **External links**: `href="http..."` with full URL capture

#### **`_build_hierarchical_toc(chapter_data) -> List[Dict[str, Any]]`**
```python
def _build_hierarchical_toc(self, chapter_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Build hierarchical table of contents from chapter headings"""
```
**Algorithm:**
- Extracts structural headings (excludes figure captions, callouts)
- Builds parent-child relationships using level hierarchy
- Creates nested structure with `children` arrays
- Maintains proper nesting order

## 🔧 Usage Instructions

### **Basic Extraction**
```python
# Initialize extractor
extractor = EPUBExtractor("epub-source/AI Engineering (2).epub")

# Load and validate EPUB
if extractor.load_epub():
    # Create output structure
    extractor.create_directory_structure()
    
    # Extract all content
    extractor.extract_all_images()
    success = extractor.extract_all_chapters()
    
    if success:
        print("✅ Extraction complete!")
```

### **Single Chapter Testing**
```python
# Test single chapter
chapter_data = extractor.extract_chapter("ch01.html", test_mode=True)
validation = extractor.validate_extraction(chapter_data)
```

### **Custom Output Directory**
```python
extractor = EPUBExtractor("source.epub", "custom-output-dir")
```

## 📊 Validation System

### **`validate_extraction(chapter_data) -> Dict[str, Any]`**
```python
def validate_extraction(self, chapter_data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate extracted chapter data for completeness and accuracy"""
```

**Validation Checks:**
- **Required fields**: id, title, sections, metadata
- **Image references**: All referenced images exist on disk
- **Content counts**: Figures, tables, code blocks, headings
- **Structure integrity**: Proper section nesting
- **Data completeness**: No empty critical fields

**Output:**
```json
{
  "valid": true,
  "warnings": ["No figures found - expected for technical content"],
  "errors": [],
  "stats": {
    "sections_found": 374,
    "figures_found": 16,
    "tables_found": 6,
    "code_blocks_found": 2,
    "headings_found": 37,
    "images_referenced": 16
  }
}
```

## 🚀 Extension Points

### **Adding New Content Types**
1. Add new case to `_parse_element()`
2. Implement `_parse_new_type()` method
3. Update validation in `validate_extraction()`
4. Add to content summary statistics

### **Custom Cross-Reference Detection**
1. Extend patterns in `_extract_cross_references()`
2. Add new reference types to output structure
3. Update validation for new reference types

### **Output Format Customization**
1. Modify `_parse_chapter_structure()` output format
2. Update validation schema accordingly
3. Ensure backward compatibility with existing data

## 🔍 Debugging & Troubleshooting

### **Logging System**
- **File**: `extracted-content/extraction.log`
- **Console**: Real-time progress and errors
- **Levels**: INFO (progress), WARNING (issues), ERROR (failures)

### **Common Issues**
- **Missing images**: Check `image-manifest.json` for extraction status
- **Hierarchy problems**: Verify section `data-type` attributes in source HTML
- **Validation failures**: Check `extraction-report.json` for detailed error analysis

### **Performance Monitoring**
- **Memory usage**: Large EPUB files may require memory optimization
- **Processing time**: ~30 seconds for full 10-chapter extraction
- **Output size**: ~4MB structured JSON + 30MB images

## 📈 Performance Characteristics

### **Processing Metrics**
- **Full extraction time**: ~30 seconds for complete book
- **Memory usage**: ~200MB peak during processing
- **Output size**: 4MB structured JSON + 30MB images
- **Success rate**: 100% (10/10 chapters, 162/162 images)

### **Scalability Considerations**
- **Single-threaded**: Sequential chapter processing for data consistency
- **Memory efficient**: Processes one chapter at a time
- **Disk I/O optimized**: Batch image extraction, streaming JSON writes
- **Error resilient**: Continues processing if individual elements fail

## 🔧 Dependencies

### **Required Python Packages**
```python
ebooklib>=0.18      # EPUB file processing
beautifulsoup4>=4.12 # HTML parsing and manipulation
pathlib             # File system operations (built-in)
json                # JSON serialization (built-in)
logging             # Comprehensive logging (built-in)
datetime            # Timestamp generation (built-in)
re                  # Regular expressions for cross-references (built-in)
os                  # File system operations (built-in)
```

### **Installation**
```bash
pip install ebooklib beautifulsoup4
```

## 🎯 Design Principles

### **Fidelity First**
- **Dual format preservation**: Raw HTML + structured JSON
- **Zero data loss**: Every element captured and validated
- **Original structure respect**: Semantic hierarchy over visual hierarchy

### **Extensibility**
- **Modular parsing**: Each content type has dedicated processor
- **Configurable output**: Easy to modify data structures
- **Validation framework**: Comprehensive checking with detailed reporting

### **Production Ready**
- **Error handling**: Graceful degradation with detailed logging
- **Performance monitoring**: Statistics and timing for optimization
- **Comprehensive testing**: Validation at every processing stage

The extraction system is production-ready with comprehensive error handling, validation, and extensibility for future enhancements.
