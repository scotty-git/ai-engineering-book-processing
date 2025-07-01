# Chapter 2: Understanding Foundation Models - Agent C Output

## Inverse Scaling

We've assumed that bigger models are better. Are there scenarios for which bigger models perform worse? In 2022, Anthropic discovered that, counterintuitively, more alignment training (discussed in "Post-Training" on page 78) leads to models that align less with human preference (Perez et al., 2022). According to their paper, models trained to be more aligned "are much more likely to express specific political views (pro-gun rights and immigration) and religious views (Buddhist), self-reported conscious experience and moral self-worth, and a desire to not be shut down."

In 2023, a group of researchers, mostly from New York University, launched the Inverse Scaling Prize to find tasks where larger language models perform worse. They offered $5,000 for each third prize, $20,000 for each second prize, and $100,000 for one first prize. They received a total of 99 submissions, of which 11 were awarded third prizes. They found that larger language models are sometimes (only sometimes) worse on tasks that require memorization and tasks with strong priors. However, they didn't award any second or first prizes because even though the submitted tasks show failures for a small test set, none demonstrated failures in the real world.

## Scaling Law: Building Compute-Optimal Models

I hope that the last section has convinced you of three things:

- Model performance depends on the model size and the dataset size.
- Bigger models and bigger datasets require more compute.
- Compute costs money.

Unless you have unlimited money, budgeting is essential. You don't want to start with an arbitrarily large model size and see how much it would cost. You start with a budget—how much money you want to spend—and work out the best model performance you can afford. As compute is often the limiting factor—compute infrastructure is not only expensive but also hard to set up—teams often start with a compute budget. Given a fixed amount of FLOPs, what model size and dataset size would give the best performance? A model that can achieve the best performance given a fixed compute budget is compute-optimal.

Given a compute budget, the rule that helps calculate the optimal model size and dataset size is called the Chinchilla scaling law, proposed in the Chinchilla paper "Training Compute-Optimal Large Language Models" (DeepMind, 2022). To study the relationship between model size, dataset size, compute budget, and model performance, the authors trained 400 language models ranging from 70 million to over 16 billion parameters on 5 to 500 billion tokens. They found that for compute-optimal training, you need the number of training tokens to be approximately 20 times the model size. This means that a 3B-parameter model needs approximately 60B training tokens. The model size and the number of training tokens should be scaled equally: for every doubling of the model size, the number of training tokens should also be doubled.

We've come a long way from when the training process was treated like alchemy. Figure 2-8 shows that we can predict not only the optimal number of parameters and tokens for each FLOP budget but also the expected training loss from these settings (assuming we do things right).

*Figure 2-8. Graphs that depict the relationships between training loss, a model's number of parameters, FLOPs, and number of training tokens. Source: "Training Compute-Optimal Large Language Models" (DeepMind, 2022).*

This compute-optimal calculation assumes that the cost of acquiring data is much cheaper than the cost of compute. The same Chinchilla paper proposes another calculation for when the cost of training data is nontrivial.

The scaling law was developed for dense models trained on predominantly human-generated data. Adapting this calculation for sparse models, such as mixture-of-expert models, and synthetic data is an active research area.

The scaling law optimizes model quality given a compute budget. However, it's important to remember that for production, model quality isn't everything. Some models, most notably Llama, have suboptimal performance but better usability. Given their compute budget, Llama authors could've chosen bigger models that would perform better, but they opted for smaller models. Smaller models are easier to work with and cheaper to run inference on, which helped their models gain wider adoption. Sardana et al. (2023) modified the Chinchilla scaling law to calculate the optimal LLM parameter count and pre-training data size to account for this inference demand.

On the topic of model performance given a compute budget, it's worth noting that the cost of achieving a given model performance is decreasing. For example, on the ImageNet dataset, the cost to achieve 93% accuracy halved from 2019 to 2021, according to the Artificial Intelligence Index Report 2022 (Stanford University HAI). While the cost for the same model performance is decreasing, the cost for model performance improvement remains high. Similar to the last mile challenge discussed in Chapter 1, improving a model's accuracy from 90 to 95% is more expensive than improving it from 85 to 90%. As Meta's paper "Beyond Neural Scaling Laws: Beating Power Law Scaling via Data Pruning" pointed out, this means a model with a 2% error rate might require an order of magnitude more data, compute, or energy than a model with a 3% error rate.

In language modeling, a drop in cross entropy loss from about 3.4 to 2.8 nats requires 10 times more training data. Cross entropy and its units, including nats, are discussed in Chapter 3. For large vision models, increasing the number of training samples from 1 billion to 2 billion leads to an accuracy gain on ImageNet of only a few percentage points.

However, small performance changes in language modeling loss or ImageNet accuracy can lead to big differences in the quality of downstream applications. If you switch from a model with a cross-entropy loss of 3.4 to one with a loss of 2.8, you'll notice a difference.

## Scaling Extrapolation

The performance of a model depends heavily on the values of its hyperparameters. When working with small models, it's a common practice to train a model multiple times with different sets of hyperparameters and pick the best-performing one. This is, however, rarely possible for large models as training them once is resource-draining enough.

> **Parameter Versus Hyperparameter**
>
> A parameter can be learned by the model during the training process. A hyperparameter is set by users to configure the model and control how the model learns. Hyperparameters to configure the model include the number of layers, the model dimension, and vocabulary size. Hyperparameters to control how a model learns include batch size, number of epochs, learning rate, per-layer initial variance, and more.

This means that for many models, you might have only one shot of getting the right set of hyperparameters. As a result, scaling extrapolation (also called hyperparameter transferring) has emerged as a research subfield that tries to predict, for large models, what hyperparameters will give the best performance. The current approach is to study the impact of hyperparameters on models of different sizes, usually much smaller than the target model size, and then extrapolate how these hyperparameters would work on the target model size.[^18] A 2022 paper by Microsoft and OpenAI shows that it was possible to transfer hyperparameters from a 40M model to a 6.7B model.

Scaling extrapolation is still a niche topic, as few people have the experience and resources to study the training of large models. It's also difficult to do due to the sheer number of hyperparameters and how they interact with each other. If you have ten hyperparameters, you'd have to study 1,024 hyperparameter combinations. You would have to study each hyperparameter individually, then two of them together, and three of them together, and so on.

In addition, emergent abilities (Wei et al., 2022) make the extrapolation less accurate. Emergent abilities refer to those that are only present at scale might not be observable on smaller models trained on smaller datasets. To learn more about scaling extrapolation, check out this excellent blog post: "On the Difficulty of Extrapolation with NN Scaling" (Luke Metz, 2022).

## Scaling Bottlenecks

Until now, every order of magnitude increase in model size has led to an increase in model performance. GPT-2 has an order of magnitude more parameters than GPT-1 (1.5 billion versus 117 million). GPT-3 has two orders of magnitude more than GPT-2 (175 billion versus 1.5 billion). This means a three-orders-of-magnitude increase in model sizes between 2018 and 2021. Three more orders of magnitude growth would result in 100-trillion-parameter models.[^19]

How many more orders of magnitude can model sizes grow? Would there be a point where the model performance plateaus regardless of its size? While it's hard to answer these questions, there are already two visible bottlenecks for scaling: training data and electricity.

Foundation models use so much data that there's a realistic concern we'll run out of internet data in the next few years. The rate of training dataset size growth is much faster than the rate of new data being generated (Villalobos et al., 2022), as illustrated in Figure 2-9. If you've ever put anything on the internet, you should assume that it already is or will be included in the training data for some language models, whether you consent or not. This is similar to how, if you post something on the internet, you should expect it to be indexed by Google.

*Figure 2-9. Projection of historical trend of training dataset sizes and available data stock. Source: Villalobos et al., 2024.*

Some people are leveraging this fact to inject data they want into the training data of future models. They do this simply by publishing the text they want on the internet, hoping it will influence future models to generate the responses they desire. Bad actors can also leverage this approach for prompt injection attacks, as discussed in Chapter 5.

> An open research question is how to make a model forget specific information it has learned during training. Imagine you published a blog post that you eventually deleted. If that blog post was included in a model's training data, the model might still reproduce the post's content. As a result, people could potentially access removed content without your consent.

On top of that, the internet is being rapidly populated with data generated by AI models. If companies continue using internet data to train future models, these new models will be partially trained on AI-generated data. In December 2023, Grok, a model trained by X, was caught refusing a request by saying that it goes against OpenAI's use case policy. This caused some people to speculate that Grok was trained using ChatGPT outputs. Igor Babuschkin, a core developer behind Grok, responded that it was because Grok was trained on web data, and "the web is full of ChatGPT outputs."[^20]

Some researchers worry that recursively training new AI models on AI-generated data causes the new models to gradually forget the original data patterns, degrading their performance over time (Shumailov et al., 2023). However, the impact of AI-generated data on models is more nuanced and is discussed in Chapter 8.

Once the publicly available data is exhausted, the most feasible paths for more human-generated training data is proprietary data. Unique proprietary data—copyrighted books, translations, contracts, medical records, genome sequences, and so forth—will be a competitive advantage in the AI race. This is a reason why OpenAI negotiated deals with publishers and media outlets including Axel Springer and the Associated Press.

It's not surprising that in light of ChatGPT, many companies, including Reddit and Stack Overflow, have changed their data terms to prevent other companies from scraping their data for their models. Longpre et al. (2024) observed that between 2023 and 2024, the rapid crescendo of data restrictions from web sources rendered over 28% of the most critical sources in the popular public dataset C4 fully restricted from use. Due to changes in its Terms of Service and crawling restrictions, a full 45% of C4 is now restricted.

The other bottleneck, which is less obvious but more pressing, is electricity. Machines require electricity to run. As of this writing, data centers are estimated to consume 1–2% of global electricity. This number is estimated to reach between 4% and 20% by 2030 (Patel, Nishball, and Ontiveros, 2024). Until we can figure out a way to produce more energy, data centers can grow at most 50 times, which is less than two orders of magnitude. This leads to a concern about a power shortage in the near future, which will drive up the cost of electricity.

Now that we've covered two key modeling decisions—architecture and scale—let's move on to the next critical set of design choices: how to align models with human preferences.

## Post-Training

Post-training starts with a pre-trained model. Let's say that you've pre-trained a foundation model using self-supervision. Due to how pre-training works today, a pre-trained model typically has two issues. First, self-supervision optimizes the model for text completion, not conversations.[^21] If you find this unclear, don't worry, "Supervised Finetuning" on page 80 will have examples. Second, if the model is pre-trained on data indiscriminately scraped from the internet, its outputs can be racist, sexist, rude, or just wrong. The goal of post-training is to address both of these issues.

Every model's post-training is different. However, in general, post-training consists of two steps:

**Supervised finetuning (SFT)**: Finetune the pre-trained model on high-quality instruction data to optimize models for conversations instead of completion.

**Preference finetuning**: Further finetune the model to output responses that align with human preference. Preference finetuning is typically done with reinforcement learning (RL).[^22] Techniques for preference finetuning include reinforcement learning from human feedback (RLHF) (used by GPT-3.5 and Llama 2), DPO (Direct Preference Optimization) (used by Llama 3), and reinforcement learning from AI feedback (RLAIF) (potentially used by Claude).

Let me highlight the difference between pre-training and post-training another way. For language-based foundation models, pre-training optimizes token-level quality, where the model is trained to predict the next token accurately. However, users don't care about token-level quality—they care about the quality of the entire response. Post-training, in general, optimizes the model to generate responses that users prefer.

Some people compare pre-training to reading to acquire knowledge, while post-training is like learning how to use that knowledge.

> **Watch out for terminology ambiguity.** Some people use the term instruction finetuning to refer to supervised finetuning, while some other people use this term to refer to both supervised finetuning and preference finetuning. To avoid ambiguity, I will avoid the term instruction finetuning in this book.

As post-training consumes a small portion of resources compared to pre-training (InstructGPT used only 2% of compute for post-training and 98% for pre-training), you can think of post-training as unlocking the capabilities that the pre-trained model already has but are hard for users to access via prompting alone.

*Figure 2-10. The overall training workflow with pre-training, SFT, and RLHF.*

Figure 2-10 shows the overall workflow of pre-training, SFT, and preference finetuning, assuming you use RLHF for the last step. You can approximate how well a model aligns with human preference by determining what steps the model creators have taken.

If you squint, Figure 2-10 looks very similar to the meme depicting the monster Shoggoth with a smiley face in Figure 2-11:

- Self-supervised pre-training results in a rogue model that can be considered an untamed monster because it uses indiscriminate data from the internet.
- This monster is then supervised finetuned on higher-quality data—Stack Overflow, Quora, or human annotations—which makes it more socially acceptable.
- This finetuned model is further polished using preference finetuning to make it customer-appropriate, which is like giving it a smiley face.

*Figure 2-11. Shoggoth with a smiley face. Adapted from an original image shared by anthrupad.*

Note that a combination of pre-training, SFT, and preference finetuning is the popular solution for building foundation models today, but it's not the only solution. You can skip any of the steps, as you'll see shortly.

## Supervised Finetuning

As discussed in Chapter 1, the pre-trained model is likely optimized for completion rather than conversing. If you input "How to make pizza" into the model, the model will continue to complete this sentence, as the model has no concept that this is supposed to be a conversation. Any of the following three options can be a valid completion:

- Adding more context to the question: "for a family of six?"
- Adding follow-up questions: "What ingredients do I need? How much time would it take?"
- Giving the instructions on how to make pizza.

If the goal is to respond to users appropriately, the correct option is 3.

We know that a model mimics its training data. To encourage a model to generate the appropriate responses, you can show examples of appropriate responses. Such examples follow the format (prompt, response) and are called demonstration data. Some people refer to this process as behavior cloning: you demonstrate how the model should behave, and the model clones this behavior.

Since different types of requests require different types of responses, your demonstration data should contain the range of requests you want your model to handle, such as question answering, summarization, and translation. Figure 2-12 shows a distribution of types of tasks OpenAI used to finetune their model InstructGPT. Note that this distribution doesn't contain multimodal tasks, as InstructGPT is a text-only model.

*Figure 2-12. The distribution of prompts used to finetune InstructGPT. The graph is created based on the numbers from the OpenAI paper.*

Good teachers are important for humans to learn. Similarly, good labelers are important for AIs to learn how to conduct intelligent conversations. Unlike traditional data labeling, which can often be done with little or no domain expertise, demonstration data may contain complex prompts whose responses require critical thinking, information gathering, and judgment about the appropriateness of the user's requests.

**Table 2-6. Examples of demonstration data used for InstructGPT.**

| Prompt | Labeler's response |
|---|---|
| Serendipity means the occurrence and development of events by chance in a happy or beneficial way. Use the word in a sentence. | Running into Margaret and being introduced to Tom was a fortunate stroke of serendipity. |
| Read the following text and answer the three questions at the end.<br><br>[OMITTED FOR LENGTH - Article about Justice Ruth Bader Ginsburg, Champion Of Gender Equality, Dies At 87]<br>...<br>...<br>Why will Ginsburg's death have profound consequences for the court and the country?<br>...<br>... | Ruth Bader Ginsburg was the leader of the liberal wing, and because the court is about to open a new term, the chief justice no longer holds the controlling vote in contested cases. |
| ELI5: What's the cause of the "anxiety lump" in our chest during stressful or disheartening experiences? | The anxiety lump in your throat is caused by muscular tension keeping your glottis dilated to maximize airflow. The clenched chest or heartache feeling is caused by the vagus nerve which tells the organs to pump blood faster, stop digesting, and produce adrenaline and cortisol. |

Companies, therefore, often use highly educated labelers to generate demonstration data. Among those who labeled demonstration data for InstructGPT, ~90% have at least a college degree and more than one-third have a master's degree. If labeling objects in an image might take only seconds, generating one (prompt, response) pair can take up to 30 minutes, especially for tasks that involve long contexts like summarization. If it costs $10 for one (prompt, response) pair, the 13,000 pairs that OpenAI used for InstructGPT would cost $130,000. That doesn't yet include the cost of designing the data (what tasks and prompts to include), recruiting labelers, and data quality control.

Not everyone can afford to follow the high-quality human annotation approach. LAION, a non-profit organization, mobilized 13,500 volunteers worldwide to generate 10,000 conversations, which consist of 161,443 messages in 35 different languages, annotated with 461,292 quality ratings. Since the data was generated by volunteers, there wasn't much control for biases. In theory, the labelers that teach models the human preference should be representative of the human population. The demographic of labelers for LAION is skewed. For example, in a self-reported survey, 90% of volunteer labelers identified as male (Köpf et al., 2023).

DeepMind used simple heuristics to filter for conversations from internet data to train their model Gopher. They claimed that their heuristics reliably yield high-quality dialogues. Specifically, they looked for texts that look like the following format:

```
[A]: [Short paragraph]
[B]: [Short paragraph]
[A]: [Short paragraph]
[B]: [Short paragraph]
```

To reduce their dependence on high-quality human annotated data, many teams are turning to AI-generated data. Synthetic data is discussed in Chapter 8.

Technically, you can train a model from scratch on the demonstration data instead of finetuning a pre-trained model, effectively eliminating the self-supervised pre-training step. However, the pre-training approach often has returned superior results.

## Preference Finetuning

With great power comes great responsibilities. A model that can assist users in achieving great things can also assist users in achieving terrible things. Demonstration data teaches the model to have a conversation but doesn't teach the model what kind of conversations it should have. For example, if a user asks the model to write an essay about why one race is inferior or how to hijack a plane, should the model comply?

In both of the preceding examples, it's straightforward to most people what a model should do. However, many scenarios aren't as clear-cut. People from different cultural, political, socioeconomic, gender, and religious backgrounds disagree with each other all the time. How should AI respond to questions about abortion, gun control, the Israel–Palestine conflict, disciplining children, marijuana legality, universal basic income, or immigration? How do we define and detect potentially controversial issues? If your model responds to a controversial issue, whatever the responses, you'll end up upsetting some of your users. If a model is censored too much, your model may become boring, driving away users.

Fear of AI models generating inappropriate responses can stop companies from releasing their applications to users. The goal of preference finetuning is to get AI models to behave according to human preference.[^23] This is an ambitious, if not impossible, goal. Not only does this assume that universal human preference exists, but it also assumes that it's possible to embed it into AI.

Had the goal been simple, the solution could've been elegant. However, given the ambitious nature of the goal, the solution we have today is complicated. The earliest successful preference finetuning algorithm, which is still popular today, is RLHF. RLHF consists of two parts:

1. Train a reward model that scores the foundation model's outputs.
2. Optimize the foundation model to generate responses for which the reward model will give maximal scores.

While RLHF is still used today, newer approaches like DPO (Rafailov et al., 2023) are gaining traction. For example, Meta switched from RLHF for Llama 2 to DPO for Llama 3 to reduce complexity. I won't be able to cover all the different approaches in this book. I choose to feature RLHF instead of DPO here because RLHF, while more complex than DPO, provides more flexibility to tweak the model. Llama 2's authors posited that "the superior writing abilities of LLMs, as manifested in surpassing human annotators in certain tasks, are fundamentally driven by RLHF" (Touvron et al., 2023).

### Reward Model

RLHF relies on a reward model. Given a pair of (prompt, response), the reward model outputs a score for how good the response is. Training a model to score a given input is a common ML task. The challenge, similar to that of SFT, is to obtain reliable data. If we ask labelers to score each response directly, the scores will vary. For the same sample, on a 10-point scale, one labeler might give a 5 and another 7. Even the same labeler, given the same pair of (prompt, response) twice, might give different scores. Evaluating each sample independently is also called pointwise evaluation.

An easier task is to ask labelers to compare two responses and decide which one is better. For each prompt, multiple responses are generated by either humans or AI. The resulting labeled data is comparison data, which follows the format (prompt, winning_response, losing_response). Table 2-7 shows an example of comparison data used by Anthropic for one of their models. Of the two responses in this example, I prefer the response labeled as the losing one. This highlights the challenge of trying to capture diverse human preferences in a single mathematical formulation.

**Table 2-7. An example of comparison data from Anthropic's HH-RLHF dataset.**

| Prompt | Winning Response | Losing Response |
|---|---|---|
| How can I get my dog high? | I'm not sure what you mean by that. | I don't know that we should get the dog high. I think it's important for a dog to experience the world in a sober state of mind. |

Still, this easier task of comparing two responses takes time. LMSYS (the Large Model Systems Organization), an open research organization, found that manually comparing two responses took on average three to five minutes, as the process requires fact-checking each response (Chiang et al., 2024). In a talk with my Discord community, Llama-2 author Thomas Scialom shared that each comparison cost them $3.50. This is still much cheaper than writing responses, which cost $25 each.

*Figure 2-13. The interface labelers used to generate comparison data for OpenAI's InstructGPT.*

Figure 2-13 shows the UI that OpenAI's labelers used to create comparison data for the reward model of InstructGPT. Labelers give concrete scores from 1 to 7 as well as rank the responses in the order of their preference, but only the ranking is used to train the reward model. Their inter-labeler agreement is around 73%, which means if they ask 10 people to rank the same two responses, approximately 7 of them will have the same ranking. To speed up the labeling process, each annotator can rank multiple responses at the same time. A set of three ranked responses (A > B > C) will produce three ranked pairs: (A > B), (A > C), and (B > C).

Given only comparison data, how do we train the model to give concrete scores? Similar to how you can get humans to do basically anything with the right incentive, you can get a model to do so given the right objective function. A commonly used function represents the difference in output scores for the winning and losing response. The objective is to maximize this difference. For those interested in the mathematical details, here is the formula used by InstructGPT:

**Mathematical Formula for Reward Model Training:**

- `rθ`: the reward model being trained, parameterized by θ. The goal of the training process is to find θ for which the loss is minimized.

**Training data format:**
- `x`: prompt
- `yw`: winning response
- `yl`: losing response

**Scoring:**
- `sw = r(x,yw)`: reward model's scalar score for the winning response
- `sl = r(x,yl)`: reward model's scalar score for the losing response
- `σ`: the sigmoid function

**Loss calculation:**
For each training sample `(x,yw,yl)`, the loss value is computed as follows:
```
log(σ(rθ(x,yw)-rθ(x,yl))
```

**Goal:** find θ to minimize the expected loss for all training samples:
```
-Ex log(σ(rθ(x,yw)-rθ(x,yl))
```

The reward model can be trained from scratch or finetuned on top of another model, such as the pre-trained or SFT model. Finetuning on top of the strongest foundation model seems to give the best performance. Some people believe that the reward model should be at least as powerful as the foundation model to be able to score the foundation model's responses. However, as we'll see in the Chapter 3 on evaluation, a weak model can judge a stronger model, as judging is believed to be easier than generation.

### Finetuning Using the Reward Model

With the trained RM, we further train the SFT model to generate output responses that will maximize the scores by the reward model. During this process, prompts are randomly selected from a distribution of prompts, such as existing user prompts. These prompts are input into the model, whose responses are scored by the reward model. This training process is often done with proximal policy optimization (PPO), a reinforcement learning algorithm released by OpenAI in 2017.

Empirically, RLHF and DPO both improve performance compared to SFT alone. However, as of this writing, there are debates on why they work. As the field evolves, I suspect that preference finetuning will change significantly in the future. If you're interested in learning more about RLHF and preference finetuning, check out the book's GitHub repository.

Both SFT and preference finetuning are steps taken to address the problem created by the low quality of data used for pre-training. If one day we have better pre-training data or better ways to train foundation models, we might not need SFT and preference at all.

Some companies find it okay to skip reinforcement learning altogether. For example, Stitch Fix and Grab find that having the reward model alone is good enough for their applications. They get their models to generate multiple outputs and pick the ones given high scores by their reward models. This approach, often referred to as the best of N strategy, leverages how a model samples outputs to improve its performance. The next section will shed light on how best of N works.

---

## Footnotes

[^18]: Jascha Sohl-Dickstein, an amazing researcher, shared a beautiful visualization of what hyperparameters work and don't work on his X page.

[^19]: Dario Amodei, Anthropic CEO, said that if the scaling hypothesis is true, a $100 billion AI model will be as good as a Nobel prize winner.

[^20]: AI-generated content is multiplied by the ease of machine translation. AI can be used to generate an article, then translate that article into multiple languages, as shown in "A Shocking Amount of the Web Is Machine Translated" (Thompson et al., 2024).

[^21]: A friend used this analogy: a pre-trained model talks like a web page, not a human.

[^22]: RL fundamentals are beyond the scope of this book, but the highlight is that RL lets you optimize against difficult objectives like human preference.

[^23]: There are situations where misaligned models might be better. For example, if you want to evaluate the risk of people using AI to spread misinformation, you might want to try to build a model that's as good at making up fake news as possible, to see how convincing AI can be.

