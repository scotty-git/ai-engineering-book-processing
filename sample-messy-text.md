# Sample Messy Book Text

Please paste your messy PDF-converted text below this line. Include the first several pages/chapters so I can see:
- How chapters are named and structured
- What kind of formatting issues we're dealing with
- Any patterns I can use to identify chapter boundaries

---

Table of Contents
Introduction to Building AI Applications with Foundation Models. Preface. xi
The Rise of AI Engineering
From Language Models to Large Language Models
From Large Language Models to Foundation Models
From Foundation Models to AI Engineering
Foundation Model Use Cases
Coding
Image and Video Production
Writing
Education
Conversational Bots
Information Aggregation
Data Organization
Workflow Automation
Planning AI Applications
Use Case Evaluation
Setting Expectations
Milestone Planning
Maintenance
The AI Engineering Stack
Three Layers of the AI Stack
AI Engineering Versus ML Engineering
AI Engineering Versus Full-Stack Engineering
Summary
Understanding Foundation Models.
Training Data
Multilingual Models
Domain-Specific Models
Modeling
Model Architecture
Model Size
Post-Training
Supervised Finetuning
Preference Finetuning
Sampling
Sampling Fundamentals
Sampling Strategies
Test Time Compute
Structured Outputs
The Probabilistic Nature of AI
Summary
Evaluation Methodology.
Challenges of Evaluating Foundation Models
Understanding Language Modeling Metrics
Entropy
Cross Entropy
Bits-per-Character and Bits-per-Byte
Perplexity
Perplexity Interpretation and Use Cases
Exact Evaluation
Functional Correctness
Similarity Measurements Against Reference Data
Introduction to Embedding
AI as a Judge
Why AI as a Judge?
How to Use AI as a Judge
Limitations of AI as a Judge
What Models Can Act as Judges?
Ranking Models with Comparative Evaluation
Challenges of Comparative Evaluation
The Future of Comparative Evaluation
Summary
Evaluate AI Systems.
Evaluation Criteria
Domain-Specific Capability
Generation Capability
Instruction-Following Capability
Cost and Latency
Model Selection
Model Selection Workflow
Model Build Versus Buy
Navigate Public Benchmarks
Design Your Evaluation Pipeline
Step 1. Evaluate All Components in a System
Step 2. Create an Evaluation Guideline
Step 3. Define Evaluation Methods and Data
Summary
Prompt Engineering.
Introduction to Prompting
In-Context Learning: Zero-Shot and Few-Shot
System Prompt and User Prompt
Context Length and Context Efficiency
Prompt Engineering Best Practices
Write Clear and Explicit Instructions
Provide Sufficient Context
Break Complex Tasks into Simpler Subtasks
Give the Model Time to Think
Iterate on Your Prompts
Evaluate Prompt Engineering Tools
Organize and Version Prompts
Defensive Prompt Engineering
Proprietary Prompts and Reverse Prompt Engineering
Jailbreaking and Prompt Injection
Information Extraction
Defenses Against Prompt Attacks
Summary
RAG and Agents.
RAG
RAG Architecture
Retrieval Algorithms
Retrieval Optimization
RAG Beyond Texts
Agents
Agent Overview
Tools
Planning
Agent Failure Modes and Evaluation
Memory
Summary
Finetuning.
Finetuning Overview
When to Finetune
Reasons to Finetune
Reasons Not to Finetune
Finetuning and RAG
Memory Bottlenecks
Backpropagation and Trainable Parameters
Memory Math
Numerical Representations
Quantization
Finetuning Techniques
Parameter-Efficient Finetuning
Model Merging and Multi-Task Finetuning
Finetuning Tactics
Summary
Dataset Engineering.
Data Curation
Data Quality
Data Coverage
Data Quantity
Data Acquisition and Annotation
Data Augmentation and Synthesis
Why Data Synthesis
Traditional Data Synthesis Techniques
AI-Powered Data Synthesis
Model Distillation
Data Processing
Inspect Data
Deduplicate Data
Clean and Filter Data
- Format Data
Summary
Inference Optimization.
Understanding Inference Optimization
Inference Overview
Inference Performance Metrics
AI Accelerators
Inference Optimization
Model Optimization
Inference Service Optimization
Summary
AI Engineering Architecture and User Feedback.
AI Engineering Architecture
Step 1. Enhance Context
Step 2. Put in Guardrails
Step 3. Add Model Router and Gateway
Step 4. Reduce Latency with Caches
Step 5. Add Agent Patterns
Monitoring and Observability
AI Pipeline Orchestration
User Feedback
Extracting Conversational Feedback
Feedback Design
Feedback Limitations
Summary
Epilogue.
Index.
1 An author of the AlexNet paper, Ilya Sutskever, went on to cofound OpenAI, turning this lesson into reality
with GPT models.
2 Even my small project in 2017, which used a language model to evaluate translation quality, concluded that
we needed “a better language model.”
Preface
When ChatGPT came out, like many of my colleagues, I was disoriented. What sur‐
prised me wasn’t the model’s size or capabilities. For over a decade, the AI commu‐
nity has known that scaling up a model improves it. In 2012, the AlexNet authors
noted in their landmark paper that: “All of our experiments suggest that our results
can be improved simply by waiting for faster GPUs and bigger datasets to become
available.”^1 , 2
What surprised me was the sheer number of applications this capability boost
unlocked. I thought a small increase in model quality metrics might result in a mod‐
est increase in applications. Instead, it resulted in an explosion of new possibilities.
Not only have these new AI capabilities increased the demand for AI applications,
but they have also lowered the entry barrier for developers. It’s become so easy to get
started with building AI applications. It’s even possible to build an application
without writing a single line of code. This shift has transformed AI from a specialized
discipline into a powerful development tool everyone can use.
Even though AI adoption today seems new, it’s built upon techniques that have been
around for a while. Papers about language modeling came out as early as the 1950s.
Retrieval-augmented generation (RAG) applications are built upon retrieval technol‐
ogy that has powered search and recommender systems since long before the term
RAG was coined. The best practices for deploying traditional machine learning appli‐
cations—systematic experimentation, rigorous evaluation, relentless optimization for
faster and cheaper models—are still the best practices for working with foundation
model-based applications.
xi
The familiarity and ease of use of many AI engineering techniques can mislead peo‐
ple into thinking there is nothing new to AI engineering. But while many principles
for building AI applications remain the same, the scale and improved capabilities of
AI models introduce opportunities and challenges that require new solutions.
This book covers the end-to-end process of adapting foundation models to solve real-
world problems, encompassing tried-and-true techniques from other engineering
fields and techniques emerging with foundation models.
I set out to write the book because I wanted to learn, and I did learn a lot. I learned
from the projects I worked on, the papers I read, and the people I interviewed.
During the process of writing this book, I used notes from over 100 conversations
and interviews, including researchers from major AI labs (OpenAI, Google,
Anthropic, ...), framework developers (NVIDIA, Meta, Hugging Face, Anyscale,
LangChain, LlamaIndex, ...), executives and heads of AI/data at companies of differ‐
ent sizes, product managers, community researchers, and independent application
developers (see “Acknowledgments” on page xx).
I especially learned from early readers who tested my assumptions, introduced me to
different perspectives, and exposed me to new problems and approaches. Some sec‐
tions of the book have also received thousands of comments from the community
after being shared on my blog, many giving me new perspectives or confirming a
hypothesis.
I hope that this learning process will continue for me now that the book is in your
hands, as you have experiences and perspectives that are unique to you. Please
feel free to share any feedback you might have for this book with me via X, LinkedIn,
or email at hi@huyenchip.com.
What This Book Is About
This book provides a framework for adapting foundation models, which include both
large language models (LLMs) and large multimodal models (LMMs), to specific
applications.
There are many different ways to build an application. This book outlines various
solutions and also raises questions you can ask to evaluate the best solution for your
needs. Some of the many questions that this book can help you answer are:
Should I build this AI application?
How do I evaluate my application? Can I use AI to evaluate AI outputs?
What causes hallucinations? How do I detect and mitigate hallucinations?
What are the best practices for prompt engineering?
Why does RAG work? What are the strategies for doing RAG?
xii | Preface
3 Teaching a course on how to use TensorFlow in 2017 taught me a painful lesson about how quickly tools and
tutorials become outdated.
What’s an agent? How do I build and evaluate an agent?
When to finetune a model? When not to finetune a model?
How much data do I need? How do I validate the quality of my data?
How do I make my model faster, cheaper, and secure?
How do I create a feedback loop to improve my application continually?
The book will also help you navigate the overwhelming AI landscape: types of mod‐
els, evaluation benchmarks, and a seemingly infinite number of use cases and appli‐
cation patterns.
The content in this book is illustrated using case studies, many of which I worked on,
backed by ample references and extensively reviewed by experts from a wide range of
backgrounds. Although the book took two years to write, it draws from my experi‐
ence working with language models and ML systems from the last decade.
Like my previous O’Reilly book, Designing Machine Learning Systems (DMLS), this
book focuses on the fundamentals of AI engineering instead of any specific tool or
API. Tools become outdated quickly, but fundamentals should last longer.^3
Reading AI Engineering (AIE) with Designing
Machine Learning Systems (DMLS)
AIE can be a companion to DMLS. DMLS focuses on building applications on top of
traditional ML models, which involves more tabular data annotations, feature engi‐
neering, and model training. AIE focuses on building applications on top of founda‐
tion models, which involves more prompt engineering, context construction, and
parameter-efficient finetuning. Both books are self-contained and modular, so you
can read either book independently.
Since foundation models are ML models, some concepts are relevant to working with
both. If a topic is relevant to AIE but has been discussed extensively in DMLS, it’ll still
be covered in this book, but to a lesser extent, with pointers to relevant resources.
Note that many topics are covered in DMLS but not in AIE, and vice versa. The first
chapter of this book also covers the differences between traditional ML engineering
and AI engineering. A real-world system often involves both traditional ML models
and foundation models, so knowledge about working with both is often necessary.

Preface | xiii
Determining whether something will last, however, is often challenging. I relied on
three criteria. First, for a problem, I determined whether it results from the funda‐
mental limitations of how AI works or if it’ll go away with better models. If a problem
is fundamental, I’ll analyze its challenges and solutions to address each challenge. I’m
a fan of the start-simple approach, so for many problems, I’ll start from the simplest
solution and then progress with more complex solutions to address rising challenges.
Second, I consulted an extensive network of researchers and engineers, who are
smarter than I am, about what they think are the most important problems and
solutions.
Occasionally, I also relied on Lindy’s Law, which infers that the future life expectancy
of a technology is proportional to its current age. So if something has been around for
a while, I assume that it’ll continue existing for a while longer.
In this book, however, I occasionally included a concept that I believe to be tempo‐
rary because it’s immediately useful for some application developers or because it
illustrates an interesting problem-solving approach.
What This Book Is Not
This book isn’t a tutorial. While it mentions specific tools and includes pseudocode
snippets to illustrate certain concepts, it doesn’t teach you how to use a tool. Instead,
it offers a framework for selecting tools. It includes many discussions on the trade-
offs between different solutions and the questions you should ask when evaluating a
solution. When you want to use a tool, it’s usually easy to find tutorials for it online.
AI chatbots are also pretty good at helping you get started with popular tools.
This book isn’t an ML theory book. It doesn’t explain what a neural network is or
how to build and train a model from scratch. While it explains many theoretical con‐
cepts immediately relevant to the discussion, the book is a practical book that focuses
on helping you build successful AI applications to solve real-world problems.
While it’s possible to build foundation model-based applications without ML exper‐
tise, a basic understanding of ML and statistics can help you build better applications
and save you from unnecessary suffering. You can read this book without any prior
ML background. However, you will be more effective while building AI applications
if you know the following concepts:
Probabilistic concepts such as sampling, determinism, and distribution.
ML concepts such as supervision, self-supervision, log-likelihood, gradient
descent, backpropagation, loss function, and hyperparameter tuning.
xiv | Preface

