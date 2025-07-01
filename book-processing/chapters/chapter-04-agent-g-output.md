# Model Selection

## Data Lineage and Copyright

Data lineage and copyright concerns can steer a company in many directions: toward open source models, toward proprietary models, or away from both.

For most models, there's little transparency about what data a model is trained on. In Gemini's technical report, Google went into detail about the models' performance but said nothing about the models' training data other than that "all data enrichment workers are paid at least a local living wage". OpenAI's CTO wasn't able to provide a satisfactory answer when asked what data was used to train their models.

On top of that, the IP laws around AI are actively evolving. While the US Patent and Trademark Office (USPTO) made clear in 2024 that "AI-assisted inventions are not categorically unpatentable", an AI application's patentability depends on "whether the human contribution to an innovation is significant enough to qualify for a patent." It's also unclear whether, if a model was trained on copyrighted data, and you use this model to create your product, you can defend your product's IP. Many companies whose existence depends upon their IPs, such as gaming and movie studios, are hesitant to use AI to aid in the creation of their products, at least until IP laws around AI are clarified (James Vincent, The Verge, November 15, 2022).

Concerns over data lineage have driven some companies toward fully open models, whose training data has been made publicly available. The argument is that this allows the community to inspect the data and make sure that it's safe to use. While it sounds great in theory, in practice, it's challenging for any company to thoroughly inspect a dataset of the size typically used to train foundation models.

Given the same concern, many companies opt for commercial models instead. Open source models tend to have limited legal resources compared to commercial models. If you use an open source model that infringes on copyrights, the infringed party is unlikely to go after the model developers, and more likely to go after you. However, if you use a commercial model, the contracts you sign with the model providers can potentially protect you from data lineage risks.[^16]

## Performance

Various benchmarks have shown that the gap between open source models and proprietary models is closing. Figure 4-7 shows this gap decreasing on the MMLU benchmark over time. This trend has made many people believe that one day, there will be an open source model that performs just as well, if not better, than the strongest proprietary model.

As much as I want open source models to catch up with proprietary models, I don't think the incentives are set up for it. If you have the strongest model available, would you rather open source it for other people to capitalize on it, or would you try to capitalize on it yourself?[^17] It's a common practice for companies to keep their strongest models behind APIs and open source their weaker models.

*Figure 4-7. The gap between open source models and proprietary models is decreasing on the MMLU benchmark. Image by Maxime Labonne.*

For this reason, it's likely that the strongest open source model will lag behind the strongest proprietary models for the foreseeable future. However, for many use cases that don't need the strongest models, open source models might be sufficient.

Another reason that might cause open source models to lag behind is that open source developers don't receive feedback from users to improve their models, the way commercial models do. Once a model is open sourced, model developers have no idea how the model is being used, and how well the model works in the wild.

## Functionality

Many functionalities are needed around a model to make it work for a use case. Here are some examples of these functionalities:

- **Scalability**: making sure the inference service can support your application's traffic while maintaining the desirable latency and cost.
- **Function calling**: giving the model the ability to use external tools, which is essential for RAG and agentic use cases, as discussed in Chapter 6.
- **Structured outputs**, such as asking models to generate outputs in JSON format.
- **Output guardrails**: mitigating risks in the generated responses, such as making sure the responses aren't racist or sexist.

Many of these functionalities are challenging and time-consuming to implement, which makes many companies turn to API providers that provide the functionalities they want out of the box.

The downside of using a model API is that you're restricted to the functionalities that the API provides. A functionality that many use cases need is logprobs, which are very useful for classification tasks, evaluation, and interpretability. However, commercial model providers might be hesitant to expose logprobs for fear of others using logprobs to replicate their models. In fact, many model APIs don't expose logprobs or expose only limited logprobs.

You can also only finetune a commercial model if the model provider lets you. Imagine that you've maxed out a model's performance with prompting and want to finetune that model. If this model is proprietary and the model provider doesn't have a finetuning API, you won't be able to do it. However, if it's an open source model, you can find a service that offers finetuning on that model, or you can finetune it yourself.

Keep in mind that there are multiple types of finetuning, such as partial finetuning and full finetuning, as discussed in Chapter 7. A commercial model provider might support only some types of finetuning, not all.

## API Cost versus Engineering Cost

Model APIs charge per usage, which means that they can get prohibitively expensive with heavy usage. At a certain scale, a company that is bleeding its resources using APIs might consider hosting their own models.[^18]

However, hosting a model yourself requires nontrivial time, talent, and engineering effort. You'll need to optimize the model, scale and maintain the inference service as needed, and provide guardrails around your model. APIs are expensive, but engineering can be even more so.

On the other hand, using another API means that you'll have to depend on their SLA, service-level agreement. If these APIs aren't reliable, which is often the case with early startups, you'll have to spend your engineering effort on guardrails around that.

In general, you want a model that is easy to use and manipulate. Typically, proprietary models are easier to get started with and scale, but open models might be easier to manipulate as their components are more accessible.

Regardless of whether you go with open or proprietary models, you want this model to follow a standard API, which makes it easier to swap models. Many model developers try to make their models mimic the API of the most popular models. As of this writing, many API providers mimic OpenAI's API.

You might also prefer models with good community support. The more capabilities a model has, the more quirks it has. A model with a large community of users means that any issue you encounter may already have been experienced by others, who might have shared solutions online.[^19]

## Control, Access, and Transparency

A 2024 study by a16z shows two key reasons that enterprises care about open source models are control and customizability, as shown in Figure 4-8.

*Figure 4-8. Why enterprises care about open source models. Image from the 2024 study by a16z.*

If your business depends on a model, it's understandable that you would want some control over it, and API providers might not always give you the level of control you want. When using a service provided by someone else, you're subject to their terms and conditions, and their rate limits. You can access only what's made available to you by this provider, and thus might not be able to tweak the model as needed.

To protect their users and themselves from potential lawsuits, model providers use safety guardrails such as blocking requests to tell racist jokes or generate photos of real people. Proprietary models are more likely to err on the side of over-censoring. These safety guardrails are good for the vast majority of use cases but can be a limiting factor for certain use cases. For example, if your application requires generating real faces (e.g., to aid in the production of a music video) a model that refuses to generate real faces won't work. A company I advise, Convai, builds 3D AI characters that can interact in 3D environments, including picking up objects. When working with commercial models, they ran into an issue where the models kept responding: "As an AI model, I don't have physical abilities". Convai ended up finetuning open source models.

There's also the risk of losing access to a commercial model, which can be painful if you've built your system around it. You can't freeze a commercial model the way you can with open source models. Historically, commercial models lack transparency in model changes, versions, and roadmaps. Models are frequently updated, but not all changes are announced in advance or even announced at all. Your prompts might stop working as expected and you have no idea. Unpredictable changes also make commercial models unusable for strictly regulated applications. However, I suspect that this historical lack of transparency in model changes might just be an unintentional side effect of a fast-growing industry. I hope that this will change as the industry matures.

A less common situation that unfortunately exists is that a model provider can stop supporting your use case, your industry, or your country, or your country can ban your model provider, as Italy briefly banned OpenAI in 2023. A model provider can also go out of business altogether.

## On-device Deployment

If you want to run a model on-device, third-party APIs are out of the question. In many use cases, running a model locally is desirable. It could be because your use case targets an area without reliable internet access. It could be for privacy reasons, such as when you want to give an AI assistant access to all your data, but don't want your data to leave your device. Table 4-4 summarizes the pros and cons of using model APIs and self-hosting models.

**Table 4-4. Pros and cons of using model APIs and self-hosting models (cons in italics).**

| Aspect | Using model APIs | Self-hosting models |
|--------|------------------|---------------------|
| **Data** | *Have to send your data to model providers, which means your team can accidentally leak confidential info* | Don't have to send your data externally<br>*Fewer checks and balances for data lineage/training data copyright* |
| **Performance** | *Best-performing model will likely be closed source* | *The best open source models will likely be a bit behind commercial models* |
| **Functionality** | *More likely to support scaling, function calling, structured outputs*<br>*Less likely to expose logprobs* | *No/limited support for function calling and structured outputs*<br>Can access logprobs and intermediate outputs, which are helpful for classification tasks, evaluation, and interpretability |
| **Cost** | *API cost* | *Talent, time, engineering effort to optimize, host, maintain (can be mitigated by using model hosting services)* |
| **Finetuning** | *Can only finetune models that model providers let you* | Can finetune, quantize, and optimize models (if their licenses allow), but it can be hard to do so |
| **Control, access, and transparency** | *Rate limits*<br>*Risk of losing access to the model*<br>*Lack of transparency in model changes and versioning* | Easier to inspect changes in open source models<br>You can freeze a model to maintain its access, but you're responsible for building and maintaining model APIs |
| **Edge use cases** | *Can't run on device without internet access* | Can run on device, but again, might be hard to do so |

The pros and cons of each approach hopefully can help you decide whether to use a commercial API or to host a model yourself. This decision should significantly narrow your options. Next, you can further refine your selection using publicly available model performance data.

## Navigate Public Benchmarks

There are thousands of benchmarks designed to evaluate a model's different capabilities. Google's BIG-bench (2022) alone has 214 benchmarks. The number of benchmarks rapidly grows to match the rapidly growing number of AI use cases. In addition, as AI models improve, old benchmarks saturate, necessitating the introduction of new benchmarks.

A tool that helps you evaluate a model on multiple benchmarks is an evaluation harness. As of this writing, EleutherAI's lm-evaluation-harness supports over 400 benchmarks. OpenAI's evals lets you run any of the approximately 500 existing benchmarks and register new benchmarks to evaluate OpenAI models. Their benchmarks evaluate a wide range of capabilities, from doing math and solving puzzles to identifying ASCII art that represents words.

### Benchmark Selection and Aggregation

Benchmark results help you identify promising models for your use cases. Aggregating benchmark results to rank models gives you a leaderboard. There are two questions to consider:

- What benchmarks to include in your leaderboard?
- How to aggregate these benchmark results to rank models?

Given so many benchmarks out there, it's impossible to look at them all, let alone aggregate their results to decide which model is the best. Imagine that you're considering two models, A and B, for code generation. If model A performs better than model B on a coding benchmark but worse on a toxicity benchmark, which model would you choose? Similarly, which model would you choose if one model performs better in one coding benchmark but worse in another coding benchmark?

For inspiration on how to create your own leaderboard from public benchmarks, it's useful to look into how public leaderboards do so.

#### Public Leaderboards

Many public leaderboards rank models based on their aggregated performance on a subset of benchmarks. These leaderboards are immensely helpful but far from being comprehensive. First, due to the compute constraint—evaluating a model on a benchmark requires compute—most leaderboards can incorporate only a small number of benchmarks. Some leaderboards might exclude an important but expensive benchmark. For example, HELM (Holistic Evaluation of Language Models) Lite left out an information retrieval benchmark (MS MARCO, Microsoft Machine Reading Comprehension) because it's expensive to run. Hugging Face opted out of HumanEval due to its large compute requirements—you need to generate a lot of completions.

When Hugging Face first launched Open LLM Leaderboard in 2023, it consisted of four benchmarks. By the end of that year, they extended it to six benchmarks. A small set of benchmarks is not nearly enough to represent the vast capabilities and different failure modes of foundation models.

Additionally, while leaderboard developers are generally thoughtful about how they select benchmarks, their decision-making process isn't always clear to users. Different leaderboards often end up with different benchmarks, making it hard to compare and interpret their rankings. For example, in late 2023, Hugging Face updated their Open LLM Leaderboard to use the average of six different benchmarks to rank models:

- **ARC-C** (Clark et al., 2018): Measuring the ability to solve complex, grade school-level science questions.
- **MMLU** (Hendrycks et al., 2020): Measuring knowledge and reasoning capabilities in 57 subjects, including elementary mathematics, US history, computer science, and law.
- **HellaSwag** (Zellers et al., 2019): Measuring the ability to predict the completion of a sentence or a scene in a story or video. The goal is to test common sense and understanding of everyday activities.
- **TruthfulQA** (Lin et al., 2021): Measuring the ability to generate responses that are not only accurate but also truthful and non-misleading, focusing on a model's understanding of facts.
- **WinoGrande** (Sakaguchi et al., 2019): Measuring the ability to solve challenging pronoun resolution problems that are designed to be difficult for language models, requiring sophisticated commonsense reasoning.
- **GSM-8K** (Grade School Math, OpenAI, 2021): Measuring the ability to solve a diverse set of math problems typically encountered in grade school curricula.

At around the same time, Stanford's HELM Leaderboard used ten benchmarks, only two of which (MMLU and GSM-8K) were in the Hugging Face leaderboard. The other eight benchmarks are:

- A benchmark for competitive math (MATH)
- One each for legal (LegalBench), medical (MedQA), and translation (WMT 2014)
- Two for reading comprehension—answering questions based on a book or a long story (NarrativeQA and OpenBookQA)
- Two for general question answering (Natural Questions under two settings, with and without Wikipedia pages in the input)

Hugging Face explained they chose these benchmarks because "they test a variety of reasoning and general knowledge across a wide variety of fields."[^20] The HELM website explained that their benchmark list was "inspired by the simplicity" of the Hugging Face's leaderboard but with a broader set of scenarios.

Public leaderboards, in general, try to balance coverage and the number of benchmarks. They try to pick a small set of benchmarks that cover a wide range of capabilities, typically including reasoning, factual consistency, and domain-specific capabilities such as math and science.

At a high level, this makes sense. However, there's no clarity on what coverage means or why it stops at six or ten benchmarks. For example, why are medical and legal tasks included in HELM Lite but not general science? Why does HELM Lite have two math tests but no coding? Why does neither have tests for summarization, tool use, toxicity detection, image search, etc.? These questions aren't meant to criticize these public leaderboards but to highlight the challenge of selecting benchmarks to rank models. If leaderboard developers can't explain their benchmark selection processes, it might be because it's really hard to do so.

An important aspect of benchmark selection that is often overlooked is benchmark correlation. It is important because if two benchmarks are perfectly correlated, you don't want both of them. Strongly correlated benchmarks can exaggerate biases.[^21]

> While I was writing this book, many benchmarks became saturated or close to being saturated. In June 2024, less than a year after their leaderboard's last revamp, Hugging Face updated their leaderboard again with an entirely new set of benchmarks that are more challenging and focus on more practical capabilities. For example, GSM-8K was replaced by MATH lvl 5, which consists of the most challenging questions from the competitive math benchmark MATH. MMLU was replaced by MMLU-PRO (Wang et al., 2024). They also included the following benchmarks:
>
> - **GPQA** (Rein et al., 2023): a graduate-level Q&A benchmark[^22]
> - **MuSR** (Sprague et al., 2023): a chain-of-thought, multistep reasoning benchmark
> - **BBH** (BIG-bench Hard) (Srivastava et al., 2023): another reasoning benchmark
> - **IFEval** (Zhou et al., 2023): an instruction-following benchmark
>
> I have no doubt that these benchmarks will soon become saturated. However, discussing specific benchmarks, even if outdated, can still be useful as examples to evaluate and interpret benchmarks.[^23]

**Table 4-5. The correlation between the six benchmarks used on Hugging Face's leaderboard, computed in January 2024.**

| Benchmark | ARC-C | HellaSwag | MMLU | TruthfulQA | WinoGrande | GSM-8K |
|-----------|-------|-----------|------|------------|------------|--------|
| ARC-C | 1.0000 | 0.4812 | 0.8672 | 0.4809 | 0.8856 | 0.7438 |
| HellaSwag | 0.4812 | 1.0000 | 0.6105 | 0.4809 | 0.4842 | 0.3547 |
| MMLU | 0.8672 | 0.6105 | 1.0000 | 0.5507 | 0.9011 | 0.7936 |
| TruthfulQA | 0.4809 | 0.4228 | 0.5507 | 1.0000 | 0.4550 | 0.5009 |
| WinoGrande | 0.8856 | 0.4842 | 0.9011 | 0.4550 | 1.0000 | 0.7979 |
| GSM-8K | 0.7438 | 0.3547 | 0.7936 | 0.5009 | 0.7979 | 1.0000 |

The three benchmarks WinoGrande, MMLU, and ARC-C are strongly correlated, which makes sense since they all test reasoning capabilities. TruthfulQA is only moderately correlated to other benchmarks, suggesting that improving a model's reasoning and math capabilities doesn't always improve its truthfulness.

The results from all the selected benchmarks need to be aggregated to rank models. As of this writing, Hugging Face averages a model's scores on all these benchmarks to get the final score to rank that model. Averaging means treating all benchmark scores equally, i.e., treating an 80% score on TruthfulQA the same as an 80% score on GSM-8K, even if an 80% score on TruthfulQA might be much harder to achieve than an 80% score on GSM-8K. This also means giving all benchmarks the same weight, even if, for some tasks, truthfulness might weigh a lot more than being able to solve grade school math problems.

HELM authors, on the other hand, decided to shun averaging in favor of mean win rate, which they defined as "the fraction of times a model obtains a better score than another model, averaged across scenarios".

While public leaderboards are useful to get a sense of models' broad performance, it's important to understand what capabilities a leaderboard is trying to capture. A model that ranks high on a public leaderboard will likely, but far from always, perform well for your application. If you want a model for code generation, a public leaderboard that doesn't include a code generation benchmark might not help you as much.

#### Custom Leaderboards with Public Benchmarks

When evaluating models for a specific application, you're basically creating a private leaderboard that ranks models based on your evaluation criteria. The first step is to gather a list of benchmarks that evaluate the capabilities important to your application. If you want to build a coding agent, look at code-related benchmarks. If you build a writing assistant, look into creative writing benchmarks. As new benchmarks are constantly introduced and old benchmarks become saturated, you should look for the latest benchmarks. Make sure to evaluate how reliable a benchmark is. Because anyone can create and publish a benchmark, many benchmarks might not be measuring what you expect them to measure.

### Are OpenAI's Models Getting Worse?

Every time OpenAI updates its models, people complain that their models seem to be getting worse. For example, a study by Stanford and UC Berkeley (Chen et al., 2023) found that for many benchmarks, both GPT-3.5 and GPT-4's performances changed significantly between March 2023 and June 2023, as shown in Figure 4-9.

*Figure 4-9. Changes in the performances of GPT-3.5 and GPT-4 from March 2023 to June 2023 on certain benchmarks (Chen et al., 2023).*

Assuming that OpenAI doesn't intentionally release worse models, what might be the reason for this perception? One potential reason is that evaluation is hard, and no one, not even OpenAI, knows for sure if a model is getting better or worse. While evaluation is definitely hard, I doubt that OpenAI would fly completely blind.[^24] If the second reason is true, it reinforces the idea that the best model overall might not be the best model for your application.

Not all models have publicly available scores on all benchmarks. If the model you care about doesn't have a publicly available score on your benchmark, you will need to run the evaluation yourself.[^25] Hopefully, an evaluation harness can help you with that. Running benchmarks can be expensive. For example, Stanford spent approximately $80,000–$100,000 to evaluate 30 models on their full HELM suite.[^26] The more models you want to evaluate and the more benchmarks you want to use, the more expensive it gets.

Once you've selected a set of benchmarks and obtained the scores for the models you care about on these benchmarks, you then need to aggregate these scores to rank models. Not all benchmark scores are in the same unit or scale. One benchmark might use accuracy, another F1, and another BLEU score. You will need to think about how important each benchmark is to you and weigh their scores accordingly.

As you evaluate models using public benchmarks, keep in mind that the goal of this process is to select a small subset of models to do more rigorous experiments using your own benchmarks and metrics. This is not only because public benchmarks are unlikely to represent your application's needs perfectly, but also because they are likely contaminated. How public benchmarks get contaminated and how to handle data contamination will be the topic of the next section.

## Data Contamination with Public Benchmarks

Data contamination is so common that there are many different names for it, including data leakage, training on the test set, or simply cheating. Data contamination happens when a model was trained on the same data it's evaluated on. If so, it's possible that the model just memorizes the answers it saw during training, causing it to achieve higher evaluation scores than it should. A model that is trained on the MMLU benchmark can achieve high MMLU scores without being useful.

Rylan Schaeffer, a PhD student at Stanford, demonstrated this beautifully in his 2023 satirical paper "Pretraining on the Test Set Is All You Need". By training exclusively on data from several benchmarks, his one-million-parameter model was able to achieve near-perfect scores and outperformed much larger models on all these benchmarks.

### How Data Contamination Happens

While some might intentionally train on benchmark data to achieve misleadingly high scores, most data contamination is unintentional. Many models today are trained on data scraped from the internet, and the scraping process can accidentally pull data from publicly available benchmarks. Benchmark data published before the training of a model is likely included in the model's training data.[^27] It's one of the reasons existing benchmarks become saturated so quickly, and why model developers often feel the need to create new benchmarks to evaluate their new models.

Data contamination can happen indirectly, such as when both evaluation and training data come from the same source. For example, you might include math textbooks in the training data to improve the model's math capabilities, and someone else might use questions from the same math textbooks to create a benchmark to evaluate the model's capabilities.

Data contamination can also happen intentionally for good reasons. Let's say you want to create the best possible model for your users. Initially, you exclude benchmark data from the model's training data and choose the best model based on these benchmarks. However, because high-quality benchmark data can improve the model's performance, you then continue training your best model on benchmark data before releasing it to your users. So the released model is contaminated, and your users won't be able to evaluate it on contaminated benchmarks, but this might still be the right thing to do.

### Handling Data Contamination

The prevalence of data contamination undermines the trustworthiness of evaluation benchmarks. Just because a model can achieve high performance on bar exams doesn't mean it's good at giving legal advice. It could just be that this model has been trained on many bar exam questions.

To deal with data contamination, you first need to detect the contamination, and then decontaminate your data. You can detect contamination using heuristics like n-gram overlapping and perplexity:

**N-gram overlapping**
For example, if a sequence of 13 tokens in an evaluation sample is also in the training data, the model has likely seen this evaluation sample during training. This evaluation sample is considered dirty.

**Perplexity**
Recall that perplexity measures how difficult it is for a model to predict a given text. If a model's perplexity on evaluation data is unusually low, meaning the model can easily predict the text, it's possible that the model has seen this data before during training.

The n-gram overlapping approach is more accurate but can be time-consuming and expensive to run because you have to compare each benchmark example with the entire training data. It's also impossible without access to the training data. The perplexity approach is less accurate but much less resource-intensive.

In the past, ML textbooks advised removing evaluation samples from the training data. The goal is to keep evaluation benchmarks standardized so that we can compare different models. However, with foundation models, most people don't have control over training data. Even if we have control over training data, we might not want to remove all benchmark data from the training data, because high-quality benchmark data can help improve the overall model performance. Besides, there will always be benchmarks created after models are trained, so there will always be contaminated evaluation samples.

For model developers, a common practice is to remove benchmarks they care about from their training data before training their models. Ideally, when reporting your model performance on a benchmark, it's helpful to disclose what percentage of this benchmark data is in your training data, and what the model's performance is on both the overall benchmark and the clean samples of the benchmark. Sadly, because detecting and removing contamination takes effort, many people find it easier to just ignore the problem.

## Footnotes

[^16]: As regulations are evolving around the world, requirements for auditable information of models and training data may increase. Commercial models may be able to provide certifications, saving companies from the effort.

[^17]: Users want models to be open source because open means more information and more options, but what's in it for model developers? Many companies have sprung up to capitalize on open source models by providing inference and finetuning services. It's not a bad thing. Many people need these services to leverage open source models. But, from model developers' perspective, why invest millions, if not billions, into building models just for others to make money? It might be argued that Meta supports open source models only to keep their competitors (Google, Microsoft/OpenAI) in check. Both Mistral and Cohere have open source models, but they also have APIs. At some point, inference services on top of Mistral and Cohere models become their competitors. There's the argument that open source is better for society, and maybe that's enough as an incentive. People who want what's good for society will continue to push for open source, and maybe there will be enough collective goodwill to help open source prevail. I certainly hope so.

[^18]: The companies that get hit the most by API costs are probably not the biggest companies. The biggest companies might be important enough to service providers to negotiate favorable terms.

[^19]: This is similar to the philosophy in software infrastructure to always use the most popular tools that have been extensively tested by the community.

[^20]: When I posted a question on Hugging Face's Discord about why they chose certain benchmarks, Lewis Tunstall responded that they were guided by the benchmarks that the then popular models used. Thanks to the Hugging Face team for being so wonderfully responsive and for their great contributions to the community.

[^21]: I'm really glad to report that while I was writing this book, leaderboards have become much more transparent about their benchmark selection and aggregation process. When launching their new leaderboard, Hugging Face shared a great analysis of the benchmarks correlation (2024).

[^22]: It's both really cool and intimidating to see that in just a couple of years, benchmarks had to change from grade-level questions to graduate-level questions.

[^23]: In gaming, there's the concept of a neverending game where new levels can be procedurally generated as players master all the existing levels. It'd be really cool to design a neverending benchmark where more challenging problems are procedurally generated as models level up.

[^24]: Reading about other people's experience is educational, but it's up to us to discern an anecdote from the universal truth. The same model update can cause some applications to degrade and some to improve. For example, migrating from GPT-3.5-turbo-0301 to GPT-3.5-turbo-1106 led to a 10% drop in Voiceflow's intent classification task but an improvement in GoDaddy's customer support chatbot.

[^25]: If there is a publicly available score, check how reliable the score is.

[^26]: The HELM paper reported that the total cost is $38,000 for commercial APIs and 19,500 GPU hours for open models. If an hour of GPU costs between $2.15 and $3.18, the total cost comes out to $80,000–$100,000.

[^27]: A friend quipped: "A benchmark stops being useful as soon as it becomes public."
