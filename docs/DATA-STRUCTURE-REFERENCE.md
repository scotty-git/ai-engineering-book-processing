# Data Structure Reference - Complete Schemas

## 📁 File Organization

### **Directory Structure**
```
extracted-content/
├── images/                    # All 162 extracted images
│   ├── aien_0101.png         # Chapter 1, Figure 1
│   ├── aien_0102.png         # Chapter 1, Figure 2
│   ├── ...
│   ├── aien_1021.png         # Chapter 10, Figure 21
│   └── css_titlepage_footer_ebook.png  # Title page image
├── chapters/
│   ├── raw-html/             # Original HTML preservation
│   │   ├── ch01.html         # Raw chapter HTML
│   │   ├── ch02.html
│   │   └── ... (ch01-ch10)
│   ├── structured/           # Processed JSON data
│   │   ├── ch01.json         # Structured chapter data
│   │   ├── ch02.json
│   │   └── ... (ch01-ch10)
│   └── metadata/
│       └── book-metadata.json # Complete book metadata
├── assets/
│   └── image-manifest.json   # Image catalog and metadata
└── extraction-report.json    # Processing log and statistics
```

### **File Naming Conventions**
- **Images**: `aien_CCNN.png` (CC=chapter, NN=figure number)
- **Chapters**: `ch01.html` (raw), `ch01.json` (structured)
- **Metadata**: Descriptive names with `.json` extension

## 📋 JSON Schema Definitions

### **Chapter Structure (`ch01.json`)**
```json
{
  "id": "ch01",
  "title": "Chapter 1. Introduction to Building AI Applications with Foundation Models",
  "sections": [
    {
      "type": "heading|paragraph|figure|table|code|list|definition_list|aside|callout|chapter_title",
      "content": "...",
      "level": 1,
      "id": "unique-identifier",
      "raw_html": "<original-html>",
      "section_type": "sect1|sect2|sect3|sect4"
    }
  ],
  "metadata": {
    "word_count": 15234,
    "reading_time_minutes": 76,
    "extraction_date": "2025-06-27T14:44:39.123456"
  },
  "content_summary": {
    "figures": 16,
    "tables": 6,
    "code_blocks": 2,
    "headings": 37,
    "images": 16
  },
  "cross_references": {
    "internal_links": [...],
    "figure_references": [...],
    "table_references": [...],
    "section_references": [...],
    "external_links": [...],
    "bidirectional_refs": {}
  }
}
```

### **Content Type Schemas**

#### **Heading Element**
```json
{
  "type": "heading",
  "level": 1,
  "content": "The Rise of AI Engineering",
  "id": "heading-12345",
  "raw_html": "<h1 id=\"heading-12345\">The Rise of AI Engineering</h1>",
  "section_type": "sect1"
}
```

#### **Figure Element**
```json
{
  "type": "figure",
  "id": "ch01_figure_1_1730130814919858",
  "image": "aien_0101.png",
  "alt": "A close up of a sign Description automatically generated",
  "image_src_original": "assets/aien_0101.png",
  "caption": {
    "label": "Figure 1-1.",
    "text": "An example of how GPT-4 tokenizes a phrase."
  },
  "raw_html": "<figure>...</figure>"
}
```

#### **Table Element**
```json
{
  "type": "table",
  "id": "table-identifier",
  "caption": {
    "label": "Table 1-1.",
    "text": "Training samples from different domains"
  },
  "headers": ["Column 1", "Column 2", "Column 3"],
  "rows": [
    ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"],
    ["Row 2 Col 1", "Row 2 Col 2", "Row 2 Col 3"]
  ],
  "row_count": 2,
  "column_count": 3,
  "raw_html": "<table>...</table>"
}
```

#### **Code Block Element**
```json
{
  "type": "code",
  "content": "import torch\nfrom transformers import GPT2LMHeadModel",
  "language": "python",
  "data_type": "programlisting",
  "line_count": 2,
  "raw_html": "<pre>...</pre>"
}
```

#### **Paragraph Element**
```json
{
  "type": "paragraph",
  "content": "Foundation models are large-scale AI models...",
  "raw_html": "<p>Foundation models are large-scale AI models...</p>",
  "contains_links": true,
  "contains_emphasis": false
}
```

#### **List Element**
```json
{
  "type": "list",
  "list_type": "ordered|unordered",
  "items": [
    "First item text",
    "Second item text",
    "Third item text"
  ],
  "raw_html": "<ul>...</ul>"
}
```

#### **Definition List Element**
```json
{
  "type": "definition_list",
  "definitions": [
    {
      "term": "Foundation Model",
      "definition": "A large-scale AI model trained on diverse data"
    },
    {
      "term": "Fine-tuning",
      "definition": "The process of adapting a pre-trained model"
    }
  ],
  "raw_html": "<dl>...</dl>"
}
```

#### **Aside Element**
```json
{
  "type": "aside",
  "content": "This is a sidebar or note content",
  "data_type": "sidebar",
  "raw_html": "<aside>...</aside>"
}
```

#### **Callout Element**
```json
{
  "type": "callout",
  "callout_type": "note|tip|warning|caution|important",
  "content": "Note",
  "raw_html": "<h6>Note</h6>"
}
```

#### **Chapter Title Element**
```json
{
  "type": "chapter_title",
  "content": "Chapter 1. Introduction to Building AI Applications with Foundation Models",
  "id": "chapter-title",
  "raw_html": "<h1>Chapter 1. Introduction to...</h1>"
}
```

### **Cross-References Structure**
```json
{
  "cross_references": {
    "internal_links": [
      {
        "target": "section-id",
        "text": "Link text",
        "context": "Surrounding text context..."
      }
    ],
    "figure_references": [
      {
        "reference": "Figure 1-1",
        "figure_id": "1-1",
        "position": 1234
      }
    ],
    "table_references": [
      {
        "reference": "Table 2-3",
        "table_id": "2-3",
        "position": 5678
      }
    ],
    "section_references": [],
    "external_links": [
      {
        "url": "https://example.com",
        "text": "External link text",
        "context": "Context around the link..."
      }
    ],
    "bidirectional_refs": {}
  }
}
```

## 📚 Book Metadata (`book-metadata.json`)

### **Complete Structure**
```json
{
  "title": "AI Engineering",
  "extraction_date": "2025-06-27T14:44:39.123456",
  "total_chapters": 10,
  "table_of_contents": [
    {
      "id": "ch01",
      "title": "Chapter 1. Introduction to Building AI Applications with Foundation Models",
      "file": "ch01.html",
      "word_count": 15234,
      "reading_time": 76,
      "content_summary": {
        "figures": 16,
        "tables": 6,
        "code_blocks": 2,
        "headings": 37
      },
      "sections": [
        {
          "title": "The Rise of AI Engineering",
          "level": 1,
          "id": "heading-12345",
          "children": [
            {
              "title": "From Language Models to Large Language Models",
              "level": 2,
              "id": "heading-67890",
              "children": [
                {
                  "title": "Language models",
                  "level": 3,
                  "id": "heading-11111",
                  "children": []
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "global_cross_references": {
    "figures": {},
    "tables": {},
    "chapters": {}
  },
  "search_index": {
    "chapters": {},
    "figures": {},
    "tables": {}
  },
  "statistics": {
    "total_word_count": 157371,
    "total_reading_time": 783,
    "total_figures": 161,
    "total_tables": 48,
    "total_code_blocks": 54
  }
}
```

### **Hierarchical TOC Structure**
The `sections` array in each chapter contains a hierarchical tree:
- **Root sections**: H1 level headings (main topics)
- **Children**: Nested subsections with proper parent-child relationships
- **Recursive nesting**: Unlimited depth support
- **Level consistency**: H1 → H2 → H3 → H4 progression

## 🖼️ Image Manifest (`image-manifest.json`)

### **Structure**
```json
{
  "total_images": 162,
  "extraction_date": "2025-06-27T14:44:39.123456",
  "images": {
    "aien_0101.png": {
      "original_path": "assets/aien_0101.png",
      "size_bytes": 45678,
      "size_kb": 44.6,
      "extracted_path": "/path/to/extracted-content/images/aien_0101.png",
      "chapter": 1
    },
    "aien_0102.png": {
      "original_path": "assets/aien_0102.png",
      "size_bytes": 67890,
      "size_kb": 66.3,
      "extracted_path": "/path/to/extracted-content/images/aien_0102.png",
      "chapter": 1
    }
  }
}
```

## 📊 Extraction Report (`extraction-report.json`)

### **Structure**
```json
{
  "extraction_date": "2025-06-27T14:44:39.123456",
  "epub_source": "/path/to/epub-source/AI Engineering (2).epub",
  "output_directory": "/path/to/extracted-content",
  "statistics": {
    "chapters_processed": 10,
    "images_extracted": 162,
    "figures_found": 161,
    "tables_found": 48,
    "code_blocks_found": 54,
    "cross_refs_found": 0,
    "errors": []
  },
  "directory_structure": {
    "root": {
      "directories": ["images", "chapters", "assets"],
      "files": 1,
      "file_list": ["extraction-report.json"]
    },
    "images": {
      "directories": [],
      "files": 162,
      "file_list": ["aien_0101.png", "aien_0102.png", "..."]
    }
  },
  "validation_summary": {
    "total_errors": 0,
    "extraction_successful": true
  }
}
```

## 🔧 Data Access Patterns

### **Loading Chapter Data**
```javascript
// React/JavaScript example
const chapterData = await fetch('/extracted-content/chapters/structured/ch01.json')
  .then(response => response.json());

// Access sections
chapterData.sections.forEach(section => {
  if (section.type === 'figure') {
    const imagePath = `/extracted-content/images/${section.image}`;
    // Render figure with image
  }
});
```

### **Building Navigation**
```javascript
// Load book metadata for navigation
const bookMetadata = await fetch('/extracted-content/chapters/metadata/book-metadata.json')
  .then(response => response.json());

// Build hierarchical navigation
bookMetadata.table_of_contents.forEach(chapter => {
  chapter.sections.forEach(section => {
    // Recursive navigation building
    buildNavItem(section);
  });
});
```

### **Image Resolution**
```javascript
// Get image metadata
const imageManifest = await fetch('/extracted-content/assets/image-manifest.json')
  .then(response => response.json());

// Resolve image path
const imageInfo = imageManifest.images['aien_0101.png'];
const imagePath = `/extracted-content/images/aien_0101.png`;
```

## 🎯 Integration Guidelines

### **React Component Props**
- **Chapter data**: Pass entire chapter JSON as prop
- **Image paths**: Use relative paths from public directory
- **Navigation**: Use hierarchical TOC structure
- **Cross-references**: Leverage reference data for linking

### **Performance Considerations**
- **Lazy loading**: Load chapters on demand
- **Image optimization**: Consider responsive images
- **Search indexing**: Use pre-generated cross-reference data
- **Caching**: Cache chapter data for navigation performance

This data structure provides complete flexibility for building any type of viewer interface while maintaining perfect fidelity to the original content.
