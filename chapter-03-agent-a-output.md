# Chapter 3: Evaluation Methodology

The more AI is used, the more opportunity there is for catastrophic failure. We've already seen many failures in the short time that foundation models have been around. A man committed suicide after being encouraged by a chatbot. Lawyers submitted false evidence hallucinated by AI. Air Canada was ordered to pay damages when its AI chatbot gave a passenger false information. Without a way to quality control AI outputs, the risk of AI might outweigh its benefits for many applications.

As teams rush to adopt AI, many quickly realize that the biggest hurdle to bringing AI applications to reality is evaluation. For some applications, figuring out evaluation can take up the majority of the development effort.[^1]

Due to the importance and complexity of evaluation, this book has two chapters on it. This chapter covers different evaluation methods used to evaluate open-ended models, how these methods work, and their limitations. The next chapter focuses on how to use these methods to select models for your application and build an evaluation pipeline to evaluate your application.

While I discuss evaluation in its own chapters, evaluation has to be considered in the context of a whole system, not in isolation. Evaluation aims to mitigate risks and uncover opportunities. To mitigate risks, you first need to identify the places where your system is likely to fail and design your evaluation around them. Often, this may require redesigning your system to enhance visibility into its failures. Without a clear understanding of where your system fails, no amount of evaluation metrics or tools can make the system robust.

Before diving into evaluation methods, it's important to acknowledge the challenges of evaluating foundation models. Because evaluation is difficult, many people settle for word of mouth[^2] (e.g., someone says that the model X is good) or eyeballing the results.[^3] This creates even more risk and slows application iteration. Instead, we need to invest in systematic evaluation to make the results more reliable.

Since many foundation models have a language model component, this chapter will provide a quick overview of the metrics used to evaluate language models, including cross entropy and perplexity. These metrics are essential for guiding the training and finetuning of language models and are frequently used in many evaluation methods.

Evaluating foundation models is especially challenging because they are open-ended, and I'll cover best practices for how to tackle these. Using human evaluators remains a necessary option for many applications. However, given how slow and expensive human annotations can be, the goal is to automate the process. This book focuses on automatic evaluation, which includes both exact and subjective evaluation.

The rising star of subjective evaluation is AI as a judge—the approach of using AI to evaluate AI responses. It's subjective because the score depends on what model and prompt the AI judge uses. While this approach is gaining rapid traction in the industry, it also invites intense opposition from those who believe that AI isn't trustworthy enough for this important task. I'm especially excited to go deeper into this discussion, and I hope you will be, too.

## Challenges of Evaluating Foundation Models

Evaluating ML models has always been difficult. With the introduction of foundation models, evaluation has become even more so. There are multiple reasons why evaluating foundation models is more challenging than evaluating traditional ML models.

First, the more intelligent AI models become, the harder it is to evaluate them. Most people can tell if a first grader's math solution is wrong. Few can do the same for a PhD-level math solution.[^4] It's easy to tell if a book summary is bad if it's gibberish, but a lot harder if the summary is coherent. To validate the quality of a summary, you might need to read the book first. This brings us to a corollary: evaluation can be so much more time-consuming for sophisticated tasks. You can no longer evaluate a response based on how it sounds. You'll also need to fact-check, reason, and even incorporate domain expertise.

Second, the open-ended nature of foundation models undermines the traditional approach of evaluating a model against ground truths. With traditional ML, most tasks are close-ended. For example, a classification model can only output among the expected categories. To evaluate a classification model, you can evaluate its outputs against the expected outputs. If the expected output is category X but the model's output is category Y, the model is wrong. However, for an open-ended task, for a given input, there are so many possible correct responses. It's impossible to curate a comprehensive list of correct outputs to compare against.

Third, most foundation models are treated as black boxes, either because model providers choose not to expose models' details, or because application developers lack the expertise to understand them. Details such as the model architecture, training data, and the training process can reveal a lot about a model's strengths and weaknesses. Without those details, you can evaluate only a model by observing its outputs.

At the same time, publicly available evaluation benchmarks have proven to be inadequate for evaluating foundation models. Ideally, evaluation benchmarks should capture the full range of model capabilities. As AI progresses, benchmarks need to evolve to catch up. A benchmark becomes saturated for a model once the model achieves the perfect score. With foundation models, benchmarks are becoming saturated fast. The benchmark GLUE (General Language Understanding Evaluation) came out in 2018 and became saturated in just a year, necessitating the introduction of SuperGLUE in 2019. Similarly, NaturalInstructions (2021) was replaced by Super-NaturalInstructions (2022). MMLU (2020), a strong benchmark that many early foundation models relied on, was largely replaced by MMLU-Pro (2024).

Last but not least, the scope of evaluation has expanded for general-purpose models. With task-specific models, evaluation involves measuring a model's performance on its trained task. However, with general-purpose models, evaluation is not only about assessing a model's performance on known tasks but also about discovering new tasks that the model can do, and these might include tasks that extend beyond human capabilities. Evaluation takes on the added responsibility of exploring the potential and limitations of AI.

The good news is that the new challenges of evaluation have prompted many new methods and benchmarks. *Figure 3-1* shows that the number of published papers on LLM evaluation grew exponentially every month in the first half of 2023, from 2 papers a month to almost 35 papers a month.

*Figure 3-1. The trend of LLMs evaluation papers over time. Image from Chang et al. (2023).*

In my own analysis of the top 1,000 AI-related repositories on GitHub, as ranked by the number of stars, I found over 50 repositories dedicated to evaluation (as of May 2024).[^5] When plotting the number of evaluation repositories by their creation date, the growth curve looks exponential, as shown in *Figure 3-2*.

The bad news is that despite the increased interest in evaluation, it lags behind in terms of interest in the rest of the AI engineering pipeline. Balduzzi et al. from DeepMind noted in their paper that "developing evaluations has received little systematic attention compared to developing algorithms." According to the paper, experiment results are almost exclusively used to improve algorithms and are rarely used to improve evaluation. Recognizing the lack of investments in evaluation, Anthropic called on policymakers to increase government funding and grants both for developing new evaluation methodologies and analyzing the robustness of existing evaluations.

*Figure 3-2. Number of open source evaluation repositories among the 1,000 most popular AI repositories on GitHub.*

To further demonstrate how the investment in evaluation lags behind other areas in the AI space, the number of tools for evaluation is small compared to the number of tools for modeling and training and AI orchestration, as shown in *Figure 3-3*.

Inadequate investment leads to inadequate infrastructure, making it hard for people to carry out systematic evaluations. When asked how they are evaluating their AI applications, many people told me that they just eyeballed the results. Many have a small set of go-to prompts that they use to evaluate models. The process of curating these prompts is ad hoc, usually based on the curator's personal experience instead of based on the application's needs. You might be able to get away with this ad hoc approach when getting a project off the ground, but it won't be sufficient for application iteration. This book focuses on a systematic approach to evaluation.

*Figure 3-3. According to data sourced from my list of the 1,000 most popular AI repositories on GitHub, evaluation lags behind other aspects of AI engineering in terms of open source tools.*

## Understanding Language Modeling Metrics

Foundation models evolved out of language models. Many foundation models still have language models as their main components. For these models, the performance of the language model component tends to be well correlated to the foundation model's performance on downstream applications (Liu et al., 2023). Therefore, a rough understanding of language modeling metrics can be quite helpful in understanding downstream performance.[^6]

As discussed in Chapter 1, language modeling has been around for decades, popularized by Claude Shannon in his 1951 paper "Prediction and Entropy of Printed English". The metrics used to guide the development of language models haven't changed much since then. Most autoregressive language models are trained using cross entropy or its relative, perplexity. When reading papers and model reports, you might also come across bits-per-character (BPC) and bits-per-byte (BPB); both are variations of cross entropy.

All four metrics—cross entropy, perplexity, BPC, and BPB—are closely related. If you know the value of one, you can compute the other three, given the necessary information. While I refer to them as language modeling metrics, they can be used for any model that generates sequences of tokens, including non-text tokens.

Recall that a language model encodes statistical information (how likely a token is to appear in a given context) about languages. Statistically, given the context "I like drinking __", the next word is more likely to be "tea" than "charcoal". The more statistical information that a model can capture, the better it is at predicting the next token.

In ML lingo, a language model learns the distribution of its training data. The better this model learns, the better it is at predicting what comes next in the training data, and the lower its training cross entropy. As with any ML model, you care about its performance not just on the training data but also on your production data. In general, the closer your data is to a model's training data, the better the model can perform on your data.

Compared to the rest of the book, this section is math-heavy. If you find it confusing, feel free to skip the math part and focus on the discussion of how to interpret these metrics. Even if you're not training or finetuning language models, understanding these metrics can help with evaluating which models to use for your application. These metrics can occasionally be used for certain evaluation and data deduplication techniques, as discussed throughout this book.

### Entropy

Entropy measures how much information, on average, a token carries. The higher the entropy, the more information each token carries, and the more bits are needed to represent a token.[^7]

Let's use a simple example to illustrate this. Imagine you want to create a language to describe positions within a square, as shown in *Figure 3-4*. If your language has only two tokens, shown as (a) in *Figure 3-4*, each token can tell you whether the position is upper or lower. Since there are only two tokens, one bit is sufficient to represent them. The entropy of this language is, therefore, 1.

*Figure 3-4. Two languages describe positions within a square. Compared to the language on the left (a), the tokens on the right (b) carry more information, but they need more bits to represent them.*

If your language has four tokens, shown as (b) in *Figure 3-4*, each token can give you a more specific position: upper-left, upper-right, lower-left, or lower-right. However, since there are now four tokens, you need two bits to represent them. The entropy of this language is 2. This language has higher entropy, since each token carries more information, but each token requires more bits to represent.

Intuitively, entropy measures how difficult it is to predict what comes next in a language. The lower a language's entropy (the less information a token of a language carries), the more predictable that language. In our previous example, the language with only two tokens is easier to predict than the language with four (you have to predict among only two possible tokens compared to four). This is similar to how, if you can perfectly predict what I will say next, what I say carries no new information.

### Cross Entropy

When you train a language model on a dataset, your goal is to get the model to learn the distribution of this training data. In other words, your goal is to get the model to predict what comes next in the training data. A language model's cross entropy on a dataset measures how difficult it is for the language model to predict what comes next in this dataset.

A model's cross entropy on the training data depends on two qualities:

- The training data's predictability, measured by the training data's entropy
- How the distribution captured by the language model diverges from the true distribution of the training data

Entropy and cross entropy share the same mathematical notation, H. Let P be the true distribution of the training data, and Q be the distribution learned by the language model. Accordingly, the following is true:

- The training data's entropy is, therefore, H(P).
- The divergence of Q with respect to P can be measured using the Kullback–Leibler (KL) divergence, which is mathematically represented as DKL(P||Q).

The model's cross entropy with respect to the training data is therefore:

H(P,Q)=H(P)+DKL(P||Q).

Cross entropy isn't symmetric. The cross entropy of Q with respect to P—H(P, Q)—is different from the cross entropy of P with respect to Q—H(Q, P).

A language model is trained to minimize its cross entropy with respect to the training data. If the language model learns perfectly from its training data, the model's cross entropy will be exactly the same as the entropy of the training data. The KL divergence of Q with respect to P will then be 0. You can think of a model's cross entropy as its approximation of the entropy of its training data.

### Bits-per-Character and Bits-per-Byte

One unit of entropy and cross entropy is bits. If the cross entropy of a language model is 6 bits, this language model needs 6 bits to represent each token.

Since different models have different tokenization methods—for example, one model uses words as tokens and another uses characters as tokens—the number of bits per token isn't comparable across models. Some use the number of bits-per-character (BPC) instead. If the number of bits per token is 6 and on average, each token consists of 2 characters, the BPC is 6/2 = 3.

One complication with BPC arises from different character encoding schemes. For example, with ASCII, each character is encoded using 7 bits, but with UTF-8, a character can be encoded using anywhere between 8 and 32 bits. A more standardized metric would be bits-per-byte (BPB), the number of bits a language model needs to represent one byte of the original training data. If the BPC is 3 and each character is 7 bits, or ⅞ of a byte, then the BPB is 3 / (⅞) = 3.43.

Cross entropy tells us how efficient a language model will be at compressing text. If the BPB of a language model is 3.43, meaning it can represent each original byte (8 bits) using 3.43 bits, this language model can compress the original training text to less than half the text's original size.

### Perplexity

Perplexity is the exponential of entropy and cross entropy. Perplexity is often shortened to PPL. Given a dataset with the true distribution P, its perplexity is defined as:

PPL(P)= 2^H(P)

The perplexity of a language model (with the learned distribution Q) on this dataset is defined as:

PPL(P,Q)= 2^H(P,Q)

If cross entropy measures how difficult it is for a model to predict the next token, perplexity measures the amount of uncertainty it has when predicting the next token. Higher uncertainty means there are more possible options for the next token.

Consider a language model trained to encode the 4 position tokens, as in *Figure 3-4* (b), perfectly. The cross entropy of this language model is 2 bits. If this language model tries to predict a position in the square, it has to choose among 2^2 = 4 possible options. Thus, this language model has a perplexity of 4.

So far, I've been using bit as the unit for entropy and cross entropy. Each bit can represent 2 unique values, hence the base of 2 in the preceding perplexity equation. Popular ML frameworks, including TensorFlow and PyTorch, use nat (natural log) as the unit for entropy and cross entropy. Nat uses the base of e, the base of natural logarithm.[^8] If you use nat as the unit, perplexity is the exponential of e:

PPL(P,Q)=e^H(P,Q)

Due to the confusion around bit and nat, many people report perplexity, instead of cross entropy, when reporting their language models' performance.

### Perplexity Interpretation and Use Cases

As discussed, cross entropy, perplexity, BPC, and BPB are variations of language models' predictive accuracy measurements. The more accurately a model can predict a text, the lower these metrics are. In this book, I'll use perplexity as the default language modeling metric. Remember that the more uncertainty the model has in predicting what comes next in a given dataset, the higher the perplexity.

What's considered a good value for perplexity depends on the data itself and how exactly perplexity is computed, such as how many previous tokens a model has access to. Here are some general rules:

**More structured data gives lower expected perplexity**

More structured data is more predictable. For example, HTML code is more predictable than everyday text. If you see an opening HTML tag like `<div>`, you can predict that there should be a closing tag, `</div>`, nearby. Therefore, the expected perplexity of a model on HTML code should be lower than the expected perplexity of a model on everyday text.

**The bigger the vocabulary, the higher the perplexity**

Intuitively, the more possible tokens there are, the harder it is for the model to predict the next token. For example, a model's perplexity on a children's book will likely be lower than the same model's perplexity on War and Peace. For the same dataset, say in English, character-based perplexity (predicting the next character) will be lower than word-based perplexity (predicting the next word), because the number of possible characters is smaller than the number of possible words.

**The longer the context length, the lower the perplexity**

The more context a model has, the less uncertainty it will have in predicting the next token. In 1951, Claude Shannon evaluated his model's cross entropy by using it to predict the next token conditioned on up to 10 previous tokens. As of this writing, a model's perplexity can typically be computed and conditioned on between 500 and 10,000 previous tokens, and possibly more, upperbounded by the model's maximum context length.

For reference, it's not uncommon to see perplexity values as low as 3 or even lower. If all tokens in a hypothetical language have an equal chance of happening, a perplexity of 3 means that this model has a 1 in 3 chance of predicting the next token correctly. Given that a model's vocabulary is in the order of 10,000s and 100,000s, these odds are incredible.

Other than guiding the training of language models, perplexity is useful in many parts of an AI engineering workflow. First, perplexity is a good proxy for a model's capabilities. If a model's bad at predicting the next token, its performance on downstream tasks will also likely be bad. OpenAI's GPT-2 report shows that larger models, which are also more powerful models, consistently give lower perplexity on a range of datasets, as shown in Table 3-1. Sadly, following the trend of companies being increasingly more secretive about their models, many have stopped reporting their models' perplexity.

**Table 3-1. Larger GPT-2 models consistently give lower perplexity on different datasets. Source: OpenAI, 2018.**

| Model | LAMBADA (PPL) | LAMBADA (ACC) | CBT-CN (ACC) | CBT-NE (ACC) | WikiText2 (PPL) | PTB (PPL) | enwiki8 (BPB) | text8 (BPC) | WikiText103 (PBL) | IBW (PPL) |
|-------|---------------|---------------|--------------|--------------|-----------------|-----------|---------------|-------------|-------------------|-----------|
| SOTA  | 99.8          | 59.23         | 85.7         | 82.3         | 39.14           | 46.54     | 0.99          | 1.08        | 18.3              | 21.8      |
| 117M  | 35.13         | 45.99         | 87.65        | 83.4         | 29.41           | 65.85     | 1.16          | 1.17        | 37.50             | 75.20     |
| 345M  | 15.60         | 55.48         | 92.35        | 87.1         | 22.76           | 47.33     | 1.01          | 1.06        | 26.37             | 55.72     |
| 762M  | 10.87         | 60.12         | 93.45        | 88.0         | 19.93           | 40.31     | 0.97          | 1.02        | 22.05             | 44.575    |
| 1542M | 8.63          | 63.24         | 93.30        | 89.05        | 18.34           | 35.76     | 0.93          | 0.98        | 17.48             | 42.16     |

> Perplexity might not be a great proxy to evaluate models that have been post-trained using techniques like SFT and RLHF.[^9] Post-training is about teaching models how to complete tasks. As a model gets better at completing tasks, it might get worse at predicting the next tokens. A language model's perplexity typically increases after post-training. Some people say that post-training collapses entropy. Similarly, quantization—a technique that reduces a model's numerical precision and, with it, its memory footprint—can also change a model's perplexity in unexpected ways.[^10]

Recall that the perplexity of a model with respect to a text measures how difficult it is for this model to predict this text. For a given model, perplexity is the lowest for texts that the model has seen and memorized during training. Therefore, perplexity can be used to detect whether a text was in a model's training data. This is useful for detecting data contamination—if a model's perplexity on a benchmark's data is low, this benchmark was likely included in the model's training data, making the model's performance on this benchmark less trustworthy. This can also be used for deduplication of training data: e.g., add new data to the existing training dataset only if the perplexity of the new data is high.

Perplexity is the highest for unpredictable texts, such as texts expressing unusual ideas (like "my dog teaches quantum physics in his free time") or gibberish (like "home cat go eye"). Therefore, perplexity can be used to detect abnormal texts.

Perplexity and its related metrics help us understand the performance of the underlying language model, which is a proxy for understanding the model's performance on downstream tasks. The rest of the chapter discusses how to measure a model's performance on downstream tasks directly.

### How to Use a Language Model to Compute a Text's Perplexity

A model's perplexity with respect to a text measures how difficult it is for the model to predict that text. Given a language model X, and a sequence of tokens x₁, x₂, ..., xₙ, X's perplexity for this sequence is:

P(x₁, x₂, ..., xₙ)^(-1/n) = (P^(-1)(x₁, x₂, ..., xₙ))^(1/n) = (∏ᵢ₌₁ⁿ P^(-1)(xᵢ|x₁, ..., xᵢ₋₁))^(1/n)

where P(xᵢ|x₁, ..., xᵢ₋₁) denotes the probability that X assigns to the token xᵢ given the previous tokens x₁, ..., xᵢ₋₁.

To compute perplexity, you need access to the probabilities (or logprobs) the language model assigns to each next token. Unfortunately, not all commercial models expose their models' logprobs, as discussed in Chapter 2.

## Footnotes

[^1]: In December 2023, Greg Brockman, an OpenAI cofounder, tweeted that "evals are surprisingly often all you need."

[^2]: A 2023 study by a16z showed that 6 out of 70 decision makers evaluated models by word of mouth.

[^3]: Also known as vibe check.

[^4]: When OpenAI's GPT-o1 came out in September 2024, the Fields medalist Terrence Tao compared the experience of working with this model to working with "a mediocre, but not completely incompetent, graduate student." He speculated that it may only take one or two further iterations until AI reaches the level of a "competent graduate student." In response to his assessment, many people joked that if we're already at the point where we need the brightest human minds to evaluate AI models, we'll have no one qualified to evaluate future models.

[^5]: I searched for all repositories with at least 500 stars using the keywords "LLM", "GPT", "generative", and "transformer". I also crowdsourced for missing repositories through my website https://huyenchip.com.

[^6]: While there's a strong correlation, language modeling performance doesn't fully explain downstream performance. This is an active area of research.

[^7]: As discussed in Chapter 1, a token can be a character, a word, or part of a word. When Claude Shannon introduced entropy in 1951, the tokens he worked with were characters. Here's entropy in his own words: "The entropy is a statistical parameter which measures, in a certain sense, how much information is produced on the average for each letter of a text in the language. If the language is translated into binary digits (0 or 1) in the most efficient way, the entropy is the average number of binary digits required per letter of the original language."

[^8]: One reason many people might prefer natural log over log base 2 is because natural log has certain properties that makes its math easier. For example, the derivative of natural log ln(x) is 1/x.

[^9]: If you're unsure what SFT (supervised finetuning) and RLHF (reinforcement learning from human feedback) mean, revisit Chapter 2.

[^10]: Quantization is discussed in Chapter 7.
