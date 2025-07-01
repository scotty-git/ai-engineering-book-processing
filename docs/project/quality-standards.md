# Quality Standards for AI Engineering Book Processing

## Overview

This document defines the quality standards, formatting requirements, and validation criteria for processing AI Engineering book chapters.

## Formatting Standards

### Heading Hierarchy
- **H1**: Chapter title only (one per chapter)
- **H2**: Major sections (e.g., "The Rise of AI Engineering")
- **H3**: Subsections (micro-task level, e.g., "From Language Models to Large Language Models")
- **H4**: Sub-subsections (grouped with parent H3, e.g., "Language models", "Self-supervision")

### Heading Format Examples
```markdown
# Introduction to Building AI Applications with Foundation Models

## The Rise of AI Engineering

### From Language Models to Large Language Models

#### Language models
```

### Paragraph Formatting
- **Double line breaks** between paragraphs
- **Single line breaks** within paragraphs only for line length management
- **No extra spacing** at beginning or end of sections
- **Consistent indentation** for nested content

### List Formatting
- **Unordered lists**: Use `-` (dash) for bullets
- **Ordered lists**: Use `1.`, `2.`, etc. with periods
- **Nested lists**: Proper indentation (2 spaces per level)
- **List spacing**: Single line break between list items

#### Examples
```markdown
- First bullet point
- Second bullet point
  - Nested bullet
  - Another nested bullet

1. First numbered item
2. Second numbered item
3. Third numbered item
```

### Table Formatting
- **Proper Markdown syntax** with pipes and headers
- **Aligned columns** for readability
- **Header row** with separator line
- **Consistent spacing** within cells

#### Example
```markdown
| Input (context) | Output (next token) |
|---|---|
| `<BOS>` | I |
| `<BOS>`, I | love |
| `<BOS>`, I, love | street |
```

### Code and Technical Elements
- **Inline code**: Use single backticks `like this`
- **Code blocks**: Use triple backticks with language specification when possible
- **Technical terms**: Use backticks for specific technical terms, APIs, file names
- **Emphasis**: Use `**bold**` for important terms, `*italic*` for emphasis

### Footnotes
- **Markdown syntax**: Use `[^n]` format (e.g., `[^1]`, `[^2]`)
- **Placement**: All footnotes at the end of the chapter
- **Sequential numbering**: Maintain original footnote numbers
- **Format**: `[^n]: Footnote content here.`

#### Example
```markdown
This is text with a footnote.[^1]

[^1]: This is the footnote content.
```

### Special Elements

#### Blockquotes and Callouts
- **Use blockquotes** for special notes, callouts, and sidebar content
- **Format**: Use `>` for blockquote lines
- **Bold headers** for callout titles

#### Example
```markdown
> **Why do language models use token as their unit instead of word or character?**
> 
> There are three main reasons:
> 
> 1. Compared to characters, tokens allow the model to break words...
```

#### Figure References
- **Italicized placeholders** for missing images
- **Consistent format**: `*Figure X-Y. Caption text.*`
- **Preserve numbering** from original text

#### Example
```markdown
*Figure 1-1. An example of how GPT-4 tokenizes a phrase.*
```

## Content Preservation Standards

### Technical Accuracy
- **Preserve all technical terms** exactly as written
- **Maintain numerical data** and statistics accurately
- **Keep references and citations** intact
- **Preserve code examples** with exact formatting

### Completeness
- **No content omission** - all original text must be included
- **Maintain context** - ensure logical flow between sections
- **Preserve relationships** - keep connections between concepts clear
- **Include all tables and data** with proper formatting

### Reference Integrity
- **Chapter references**: Maintain references to other chapters
- **Page references**: Note when page references exist (may need updating)
- **Figure references**: Keep all figure callouts even if images are missing
- **Footnote references**: Ensure all footnote markers have corresponding footnotes

## Text Cleaning Standards

### PDF Artifact Removal
- **Page numbers**: Remove lines like "X | Chapter Y: Title" and "Section Name | Page#"
- **Broken hyphens**: Fix words split with "‐" character (e.g., "prin‐ciples" → "principles")
- **Extra spacing**: Remove excessive blank lines and normalize spacing
- **Formatting remnants**: Remove PDF conversion artifacts

### Text Flow Restoration
- **Paragraph integrity**: Ensure paragraphs flow naturally
- **Sentence completion**: Fix sentences broken across lines
- **Proper spacing**: Consistent paragraph and section breaks
- **Word rejoining**: Fix words artificially split by PDF conversion

## Validation Criteria

### Structure Validation
- [ ] Proper heading hierarchy (no skipped levels)
- [ ] Consistent heading format and capitalization
- [ ] Logical section organization
- [ ] Proper nesting of subsections

### Content Validation
- [ ] All original content preserved
- [ ] Technical terms and data accurate
- [ ] Tables formatted correctly
- [ ] Lists properly structured
- [ ] Code blocks formatted appropriately

### Formatting Validation
- [ ] Consistent Markdown syntax throughout
- [ ] Proper paragraph spacing (double line breaks)
- [ ] Correct list formatting
- [ ] Appropriate use of emphasis and code formatting
- [ ] Footnotes properly formatted and placed

### Readability Validation
- [ ] Clear, professional presentation
- [ ] Logical flow between sections
- [ ] Consistent formatting patterns
- [ ] No distracting artifacts or errors

## Quality Checkpoints

### During Processing
- **After each micro-task**: Validate formatting and content preservation
- **Every 5 tasks**: Review consistency across completed sections
- **Before final assembly**: Comprehensive review of entire chapter

### Final Review Checklist
- [ ] Complete content coverage (all source lines processed)
- [ ] Consistent formatting throughout
- [ ] All footnotes collected and properly formatted
- [ ] Figure references maintained
- [ ] Tables properly formatted
- [ ] Heading hierarchy correct
- [ ] No PDF artifacts remaining
- [ ] Professional readability

## Common Issues and Solutions

### Broken Words
- **Problem**: Words split with hyphens (e.g., "prin‐ciples")
- **Solution**: Search for "‐" character and rejoin words

### Footnote Chaos
- **Problem**: Footnote markers scattered, content displaced
- **Solution**: Collect all footnotes, place at chapter end with proper syntax

### Table Formatting
- **Problem**: Tables with poor alignment or missing structure
- **Solution**: Rebuild using proper Markdown table syntax

### Inconsistent Spacing
- **Problem**: Irregular paragraph breaks and spacing
- **Solution**: Apply standard double line breaks between paragraphs

## Examples of Quality Output

### Good Heading Structure
```markdown
# Chapter Title

## Major Section

### Subsection

Content here with proper spacing.

Another paragraph with double line break above.

### Another Subsection

More content here.

## Another Major Section
```

### Good Table Format
```markdown
**Table 1-1. Training samples from the sentence "I love street food." for language modeling.**

| Input (context) | Output (next token) |
|---|---|
| `<BOS>` | I |
| `<BOS>`, I | love |
| `<BOS>`, I, love | street |
```

### Good Callout Format
```markdown
> **Note:** This book uses the term foundation models to refer to both large language models and large multimodal models.
```

---
*Quality Standards Version*: 1.0
*Last Updated*: Handoff documentation complete
*Application*: All chapter processing tasks
