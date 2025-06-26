#!/usr/bin/env python3
"""
Script to assemble Chapter 2 from all agent outputs
"""

def read_file(filename):
    """Read file content"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Warning: {filename} not found")
        return ""

def write_file(filename, content):
    """Write content to file"""
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    print("Assembling Chapter 2 from agent outputs...")
    
    # Read agent outputs
    agent_a = read_file('chapter-02-agent-a-output.md')
    agent_b = read_file('chapter-02-agent-b-output.md')
    agent_c = read_file('chapter-02-agent-c-output.md')
    agent_d = read_file('chapter-02-agent-d-output.md')
    
    # Extract content from each agent (remove duplicate headers)
    # Agent A: Keep full content (has chapter title)
    content_a = agent_a
    
    # Agent B: Remove the first line (## Model Architecture) as it's already in A
    content_b = '\n'.join(agent_b.split('\n')[1:]) if agent_b else ""
    
    # Agent C: Remove the first line (chapter header)
    lines_c = agent_c.split('\n') if agent_c else []
    content_c = '\n'.join(lines_c[2:]) if len(lines_c) > 2 else ""
    
    # Agent D: Remove the first line (chapter header)  
    lines_d = agent_d.split('\n') if agent_d else []
    content_d = '\n'.join(lines_d[2:]) if len(lines_d) > 2 else ""
    
    # Combine all content
    final_content = content_a
    
    if content_b:
        final_content += "\n\n" + content_b
    
    if content_c:
        final_content += "\n\n" + content_c
        
    if content_d:
        final_content += "\n\n" + content_d
    
    # Collect and consolidate footnotes
    footnotes = []
    
    # Extract footnotes from each section
    for content in [agent_a, agent_b, agent_c, agent_d]:
        if content and '[^' in content:
            lines = content.split('\n')
            for line in lines:
                if line.strip().startswith('[^') and ']:' in line:
                    footnotes.append(line.strip())
    
    # Remove duplicate footnotes and sort
    unique_footnotes = list(set(footnotes))
    unique_footnotes.sort(key=lambda x: int(x.split('^')[1].split(']')[0]) if x.split('^')[1].split(']')[0].isdigit() else 999)
    
    # Add footnotes section if we have any
    if unique_footnotes:
        final_content += "\n\n---\n\n## Footnotes\n\n"
        for footnote in unique_footnotes:
            final_content += footnote + "\n\n"
    
    # Write final chapter
    write_file('chapter-02-understanding-foundation-models.md', final_content)
    
    print("✅ Chapter 2 assembly complete!")
    print(f"📄 Final file: chapter-02-understanding-foundation-models.md")
    print(f"📊 Total length: {len(final_content.split())} words")
    print(f"📝 Footnotes collected: {len(unique_footnotes)}")

if __name__ == "__main__":
    main()
