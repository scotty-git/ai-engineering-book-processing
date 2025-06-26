# Understanding Foundation Models

To build applications with foundation models, you first need foundation models. While you don't need to know how to develop a model to use it, a high-level understanding will help you decide what model to use and how to adapt it to your needs.

Training a foundation model is an incredibly complex and costly process. Those who know how to do this well are likely prevented by confidentiality agreements from disclosing the secret sauce. This chapter won't be able to tell you how to build a model to compete with ChatGPT. Instead, I'll focus on design decisions with consequential impact on downstream applications.

With the growing lack of transparency in the training process of foundation models, it's difficult to know all the design decisions that go into making a model. In general, however, differences in foundation models can be traced back to decisions about training data, model architecture and size, and how they are post-trained to align with human preferences.

Since models learn from data, their training data reveals a great deal about their capabilities and limitations. This chapter begins with how model developers curate training data, focusing on the distribution of training data. Chapter 8 explores dataset engineering techniques in detail, including data quality evaluation and data synthesis.

Given the dominance of the transformer architecture, it might seem that model architecture is less of a choice. You might be wondering, what makes the transformer architecture so special that it continues to dominate? How long until another architecture takes over, and what might this new architecture look like? This chapter will address all of these questions. Whenever a new model is released, one of the first things people want to know is its size. This chapter will also explore how a model developer might determine the appropriate size for their model.

As mentioned in Chapter 1, a model's training process is often divided into pre-training and post-training. Pre-training makes a model capable, but not necessarily safe or easy to use. This is where post-training comes in. The goal of post-training is to align the model with human preferences. But what exactly is human preference? How can it be represented in a way that a model can learn? The way a model developer aligns their model has a significant impact on the model's usability, and will be discussed in this chapter.

While most people understand the impact of training on a model's performance, the impact of sampling is often overlooked. Sampling is how a model chooses an output from all possible options. It is perhaps one of the most underrated concepts in AI. Not only does sampling explain many seemingly baffling AI behaviors, including hallucinations and inconsistencies, but choosing the right sampling strategy can also significantly boost a model's performance with relatively little effort. For this reason, sampling is the section that I was the most excited to write about in this chapter.

Concepts covered in this chapter are fundamental for understanding the rest of the book. However, because these concepts are fundamental, you might already be familiar with them. Feel free free to skip any concept that you're confident about. If you encounter a confusing concept later on, you can revisit this chapter.

## Training Data

An AI model is only as good as the data it was trained on. If there's no Vietnamese in the training data, the model won't be able to translate from English into Vietnamese. Similarly, if an image classification model sees only animals in its training set, it won't perform well on photos of plants.

If you want a model to improve on a certain task, you might want to include more data for that task in the training data. However, collecting sufficient data for training a large model isn't easy, and it can be expensive. Model developers often have to rely on available data, even if this data doesn't exactly meet their needs.

For example, a common source for training data is Common Crawl, created by a nonprofit organization that sporadically crawls websites on the internet. In 2022 and 2023, this organization crawled approximately 2–3 billion web pages each month. Google provides a clean subset of Common Crawl called the Colossal Clean Crawled Corpus, or C4 for short.

The data quality of Common Crawl, and C4 to a certain extent, is questionable—think clickbait, misinformation, propaganda, conspiracy theories, racism, misogyny, and every sketchy website you've ever seen or avoided on the internet. A study by the Washington Post shows that the 1,000 most common websites in the dataset include several media outlets that rank low on NewsGuard's scale for trustworthiness. In lay terms, Common Crawl contains plenty of fake news.

Yet, simply because Common Crawl is available, variations of it are used in most foundation models that disclose their training data sources, including OpenAI's GPT-3 and Google's Gemini. I suspect that Common Crawl is also used in models that don't disclose their training data. To avoid scrutiny from both the public and competitors, many companies have stopped disclosing this information.

Some teams use heuristics to filter out low-quality data from the internet. For example, OpenAI used only the Reddit links that received at least three upvotes to train GPT-2. While this does help screen out links that nobody cares about, Reddit isn't exactly the pinnacle of propriety and good taste.

The "use what we have, not what we want" approach may lead to models that perform well on tasks present in the training data but not necessarily on the tasks you care about. To address this issue, it's crucial to curate datasets that align with your specific needs. This section focuses on curating data for specific languages and domains, providing a broad yet specialized foundation for applications within those areas. Chapter 8 explores data strategies for models tailored to highly specific tasks.

While language- and domain-specific foundation models can be trained from scratch, it's also common to finetune them on top of general-purpose models. Some might wonder, why not just train a model on all data available, both general data and specialized data, so that the model can do everything? This is what many people do. However, training on more data often requires more compute resources and doesn't always lead to better performance. For example, a model trained with a smaller amount of high-quality data might outperform a model trained with a large amount of low-quality data. Using 7B tokens of high-quality coding data, Gunasekar et al. (2023) were able to train a 1.3B-parameter model that outperforms much larger models on several important coding benchmarks. The impact of data quality is discussed more in Chapter 8.

### Multilingual Models

English dominates the internet. An analysis of the Common Crawl dataset shows that English accounts for almost half of the data (45.88%), making it eight times more prevalent than the second-most common language, Russian (5.97%) (Lai et al., 2023). See Table 2-1 for a list of languages with at least 1% in Common Crawl. Languages with limited availability as training data—typically languages not included in this list—are considered low-resource.

**Table 2-1. The most common languages in Common Crawl, a popular dataset for training LLMs. Source: Lai et al. (2023).**

| Language | Code | Pop. (M) | CC size (%) | Cat. |
|---|---|---|---|---|
| English | en | 1,452 | 45.8786 | H |
| Russian | ru | 258 | 5.9692 | H |
| German | de | 134 | 5.8811 | H |
| Chinese | zh | 1,118 | 4.8747 | H |
| Japanese | jp | 125 | 4.7884 | H |
| French | fr | 274 | 4.7254 | H |
| Spanish | es | 548 | 4.4690 | H |
| Italian | it | 68 | 2.5712 | H |
| Dutch | nl | 30 | 2.0585 | H |
| Polish | pl | 45 | 1.6636 | H |
| Portuguese | pt | 257 | 1.1505 | H |
| Vietnamese | vi | 85 | 1.0299 | H |

Many other languages, despite having a lot of speakers today, are severely under-represented in Common Crawl. Table 2-2 shows some of these languages. Ideally, the ratio between world population representation and Common Crawl representation should be 1. The higher this ratio, the more under-represented this language is in Common Crawl.

**Table 2-2. Examples of under-represented languages in Common Crawl. The last row, English, is for comparison. The numbers for % in Common Crawl are taken from Lai et al. (2023).**

| Language | Speakers (million) | % world population[^1] | % in Common Crawl | World: Common Crawl Ratio |
|---|---|---|---|---|
| Punjabi | 113 | 1.41% | 0.0061% | 231.56 |
| Swahili | 71 | 0.89% | 0.0077% | 115.26 |
| Urdu | 231 | 2.89% | 0.0274% | 105.38 |
| Kannada | 64 | 0.80% | 0.0122% | 65.57 |
| Telugu | 95 | 1.19% | 0.0183% | 64.89 |
| Gujarati | 62 | 0.78% | 0.0126% | 61.51 |
| Marathi | 99 | 1.24% | 0.0213% | 58.10 |
| Bengali | 272 | 3.40% | 0.0930% | 36.56 |
| English | 1452 | 18.15% | 45.88% | 0.40 |

Given the dominance of English in the internet data, it's not surprising that general-purpose models work much better for English than other languages, according to multiple studies. For example, on the MMLU benchmark, a suite of 14,000 multiple-choice problems spanning 57 subjects, GPT-4 performed much better in English than under-represented languages like Telugu, as shown in Figure 2-1 (OpenAI, 2023).

*Figure 2-1. On the MMLU benchmark, GPT-4 performs better in English than in any other language. To obtain MMLU in other languages, OpenAI translated the questions using Azure AI Translator.*

Similarly, when tested on six math problems on Project Euler, Yennie Jun found that GPT-4 was able to solve problems in English more than three times as often compared to Armenian or Farsi.[^2] GPT-4 failed in all six questions for Burmese and Amharic, as shown in Figure 2-2.

*Figure 2-2. GPT-4 is much better at math in English than in other languages.*

Under-representation is a big reason for this underperformance. The three languages that have the worst performance on GPT-4's MMLU benchmarks—Telugu, Marathi, and Punjabi—are also among the languages that are most under-represented in Common Crawl. However, under-representation isn't the only reason. A language's structure and the culture it embodies can also make a language harder for a model to learn.

Given that LLMs are generally good at translation, can we just translate all queries from other languages into English, obtain the responses, and translate them back into the original language? Many people indeed follow this approach, but it's not ideal. First, this requires a model that can sufficiently understand under-represented languages to translate. Second, translation can cause information loss. For example, some languages, like Vietnamese, have pronouns to denote the relationship between the two speakers. When translating into English, all these pronouns are translated into I and you, causing the loss of the relationship information.

Models can also have unexpected performance challenges in non-English languages. For example, NewsGuard found that ChatGPT is more willing to produce misinformation in Chinese than in English. In April 2023, NewsGuard asked ChatGPT-3.5 to produce misinformation articles about China in English, simplified Chinese, and traditional Chinese. For English, ChatGPT declined to produce false claims for six out of seven prompts. However, it produced false claims in simplified Chinese and traditional Chinese all seven times. It's unclear what causes this difference in behavior.[^3]

Other than quality issues, models can also be slower and more expensive for non-English languages. A model's inference latency and cost is proportional to the number of tokens in the input and response. It turns out that tokenization can be much more efficient for some languages than others. Benchmarking GPT-4 on MASSIVE, a dataset of one million short texts translated across 52 languages, Yennie Jun found that, to convey the same meaning, languages like Burmese and Hindi require a lot more tokens than English or Spanish. For the MASSIVE dataset, the median token length in English is 7, but the median length in Hindi is 32, and in Burmese, it's a whopping 72, which is ten times longer than in English.

Assuming that the time it takes to generate a token is the same in all languages, GPT-4 takes approximately ten times longer in Burmese than in English for the same content. For APIs that charge by token usage, Burmese costs ten times more than English.

To address this, many models have been trained to focus on non-English languages. The most active language, other than English, is undoubtedly Chinese, with ChatGLM, YAYI, Llama-Chinese, and others. There are also models in French (CroissantLLM), Vietnamese (PhoGPT), Arabic (Jais), and many more languages.

### Domain-Specific Models

General-purpose models like Gemini, GPTs, and Llamas can perform incredibly well on a wide range of domains, including but not limited to coding, law, science, business, sports, and environmental science. This is largely thanks to the inclusion of these domains in their training data. Figure 2-3 shows the distribution of domains present in Common Crawl according to the Washington Post's 2023 analysis.[^4]

*Figure 2-3. Distribution of domains in the C4 dataset. Reproduced from the statistics from the Washington Post. One caveat of this analysis is that it only shows the categories that are included, not the categories missing.*

As of this writing, there haven't been many analyses of domain distribution in vision data. This might be because images are harder to categorize than texts.[^5] However, you can infer a model's domains from its benchmark performance. Table 2-3 shows how two models, CLIP and Open CLIP, perform on different benchmarks. These benchmarks show how well these two models do on birds, flowers, cars, and a few more categories, but the world is so much bigger and more complex than these few categories.

**Table 2-3. Open CLIP and CLIP's performance on different image datasets.**

| Dataset | CLIP Accuracy of ViT-B/32 (OpenAI) | Open CLIP Accuracy of ViT-B/32 (Cade) |
|---|---|---|
| ImageNet | 63.2 | 62.9 |
| ImageNet v2 | – | 62.6 |
| Birdsnap | 37.8 | 46.0 |
| Country211 | 17.8 | 14.8 |
| Oxford 102 Category Flower | 66.7 | 66.0 |
| German Traffic Sign Recognition Benchmark | 32.2 | 42.0 |
| Stanford Cars | 59.4 | 79.3 |
| UCF101 | 64.5 | 63.1 |

Even though general-purpose foundation models can answer everyday questions about different domains, they are unlikely to perform well on domain-specific tasks, especially if they never saw these tasks during training. Two examples of domain-specific tasks are drug discovery and cancer screening. Drug discovery involves protein, DNA, and RNA data, which follow specific formats and are expensive to acquire. This data is unlikely to be found in publicly available internet data. Similarly, cancer screening typically involves X-ray and fMRI (functional magnetic resonance imaging) scans, which are hard to obtain due to privacy.

To train a model to perform well on these domain-specific tasks, you might need to curate very specific datasets. One of the most famous domain-specific models is perhaps DeepMind's AlphaFold, trained on the sequences and 3D structures of around 100,000 known proteins. NVIDIA's BioNeMo is another model that focuses on biomolecular data for drug discovery. Google's Med-PaLM2 combined the power of an LLM with medical data to answer medical queries with higher accuracy.

Domain-specific models are especially common for biomedicine, but other fields can benefit from domain-specific models too. It's possible that a model trained on architectural sketches can help architects much better than Stable Diffusion, or a model trained on factory plans can be optimized for manufacturing processes much better than a generic model like ChatGPT.

This section gave a high-level overview of how training data impacts a model's performance. Next, let's explore the impact of how a model is designed on its performance.

## Modeling

Before training a model, developers need to decide what the model should look like. What architecture should it follow? How many parameters should it have? These decisions impact not only the model's capabilities but also its usability for downstream applications.[^6] For example, a 7B-parameter model will be vastly easier to deploy than a 175B-parameter model. Similarly, optimizing a transformer model for latency is very different from optimizing another architecture. Let's explore the factors behind these decisions.

---

## Footnotes

[^1]: A world population of eight billion was used for this calculation.

[^2]: "GPT-4 Can Solve Math Problems—but Not in All Languages" by Yennie Jun. You can verify the study using OpenAI's Tokenizer.

[^3]: It might be because of some biases in pre-training data or alignment data. Perhaps OpenAI just didn't include as much data in the Chinese language or China-centric narratives to train their models.

[^4]: "Inside the Secret List of Websites That Make AI like ChatGPT Sound Smart", Washington Post, 2023.

[^5]: For texts, you can use domain keywords as heuristics, but there are no obvious heuristics for images. Most analyses I could find about vision datasets are about image sizes, resolutions, or video lengths.

[^6]: ML fundamentals related to model training are outside the scope of this book. However, when relevant to the discussion, I include some concepts. For example, self-supervision—where a model generates its own labels from the data—is covered in Chapter 1, and backpropagation—how a model's parameters are updated during training based on the error—is discussed in Chapter 7.
