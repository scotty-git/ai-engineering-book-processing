## Ranking Models with Comparative Evaluation

Often, you evaluate models not because you care about their scores, but because you want to know which model is the best for you. What you want is a ranking of these models. You can rank models using either pointwise evaluation or comparative evaluation.

With pointwise evaluation, you evaluate each model independently,[^22] then rank them by their scores. For example, if you want to find out which dancer is the best, you evaluate each dancer individually, give them a score, then pick the dancer with the highest score.

With comparative evaluation, you evaluate models against each other and compute a ranking from comparison results. For the same dancing contest, you can ask all candidates to dance side-by-side and ask the judges which candidate's dancing they like the most, and pick the dancer preferred by most judges.

For responses whose quality is subjective, comparative evaluation is typically easier to do than pointwise evaluation. For example, it's easier to tell which song of the two songs is better than to give each song a concrete score.

In AI, comparative evaluation was first used in 2021 by Anthropic to rank different models. It also powers the popular LMSYS's Chatbot Arena leaderboard that ranks models using scores computed from pairwise model comparisons from the community.

Many model providers use comparative evaluation to evaluate their models in production. Figure 3-10 shows an example of ChatGPT asking its users to compare two outputs side by side. These outputs could be generated by different models, or by the same model with different sampling variables.

*Figure 3-10. ChatGPT occasionally asks users to compare two outputs side by side.*

For each request, two or more models are selected to respond. An evaluator, which can be human or AI, picks the winner. Many developers allow for ties to avoid a winner being picked at random when drafts are equally good or bad.

A very important thing to keep in mind is that not all questions should be answered by preference. Many questions should be answered by correctness instead. Imagine asking the model "Is there a link between cell phone radiation and brain tumors?" and the model presents two options, "Yes" and "No", for you to choose from. Preference-based voting can lead to wrong signals that, if used to train your model, can result in misaligned behaviors.

Asking users to pick can also cause user frustration. Imagine asking the model a math question because you don't know the answer, and the model gives you two different answers and asks you to pick the one you prefer. If you had known the right answer, you wouldn't have asked the model in the first place.

When collecting comparative feedback from users, one challenge is to determine what questions can be determined by preference voting and what shouldn't be. Preference-based voting only works if the voters are knowledgeable in the subject. This approach generally works in applications where AI serves as an intern or assistant, helping users speed up tasks they know how to do—and not where users ask AI to perform tasks they themselves don't know how to do.

Comparative evaluation shouldn't be confused with A/B testing. In A/B testing, a user sees the output from one candidate model at a time. In comparative evaluation, a user sees outputs from multiple models at the same time.

Each comparison is called a match. This process results in a series of comparisons, as shown in Table 3-5.

**Table 3-5. Examples of a history of pairwise model comparisons.**

| Match # | Model A | Model B | Winner |
|---|---|---|---|
| 1 | Model 1 | Model 2 | Model 1 |
| 2 | Model 3 | Model 10 | Model 10 |
| 3 | Model 7 | Model 4 | Model 4 |
| ... | ... | ... | ... |

The probability that model A is preferred over model B is the win rate of A over B. We can compute this win rate by looking at all matches between A and B and calculating the percentage in which A wins.

If there are only two models, ranking them is straightforward. The model that wins more often ranks higher. The more models there are, the more challenging ranking becomes. Let's say that we have five models with the empirical win rates between model pairs, as shown in Table 3-6. It's not obvious, from looking at the data, how these five models should be ranked.

**Table 3-6. Example win rates of five models. The A >> B column denotes the event that A is preferred to B.**

| Model pair # | Model A | Model B | # matches | A >> B |
|---|---|---|---|---|
| 1 | Model 1 | Model 2 | 1000 | 90% |
| 2 | Model 1 | Model 3 | 1000 | 40% |
| 3 | Model 1 | Model 4 | 1000 | 15% |
| 4 | Model 1 | Model 5 | 1000 | 10% |
| 5 | Model 2 | Model 3 | 1000 | 60% |
| 6 | Model 2 | Model 4 | 1000 | 80% |
| 7 | Model 2 | Model 5 | 1000 | 80% |
| 8 | Model 3 | Model 4 | 1000 | 70% |
| 9 | Model 3 | Model 5 | 1000 | 10% |
| 10 | Model 4 | Model 5 | 1000 | 20% |

Given comparative signals, a rating algorithm is then used to compute a ranking of models. Typically, this algorithm first computes a score for each model from the comparative signals and then ranks models by their scores.

Comparative evaluation is new in AI but has been around for almost a century in other industries. It's especially popular in sports and video games. Many rating algorithms developed for these other domains can be adapted to evaluating AI models, such as Elo, Bradley–Terry, and TrueSkill. LMSYS's Chatbot Arena originally used Elo to compute models' ranking but later switched to the Bradley–Terry algorithm because they found Elo sensitive to the order of evaluators and prompts.[^23]

A ranking is correct if, for any model pair, the higher-ranked model is more likely to win in a match against the lower-ranked model. If model A ranks higher than model B, users should prefer model A to model B more than half the time.

Through this lens, model ranking is a predictive problem. We compute a ranking from historical match outcomes and use it to predict future match outcomes. Different ranking algorithms can produce different rankings, and there's no ground truth for what the correct ranking is. The quality of a ranking is determined by how good it is in predicting future match outcomes. My analysis of Chatbot Arena's ranking shows that the produced ranking is good, at least for model pairs with sufficient matches. See the book's GitHub repo for the analysis.

## Challenges of Comparative Evaluation

With pointwise evaluation, the heavy-lifting part of the process is in designing the benchmark and metrics to gather the right signals. Computing scores to rank models is easy. With comparative evaluation, both signal gathering and model ranking are challenging. This section goes over the three common challenges of comparative evaluation.

### Scalability bottlenecks

Comparative evaluation is data-intensive. The number of model pairs to compare grows quadratically with the number of models. In January 2024, LMSYS evaluated 57 models using 244,000 comparisons. Even though this sounds like a lot of comparisons, this averages only 153 comparisons per model pair (57 models correspond to 1,596 model pairs). This is a small number, considering the wide range of tasks we want a foundation model to do.

Fortunately, we don't always need direct comparisons between two models to determine which one is better. Ranking algorithms typically assume transitivity. If model A ranks higher than B, and B ranks higher than C, then with transitivity, you can infer that A ranks higher than C. This means that if the algorithm is certain that A is better than B and B is better than C, it doesn't need to compare A against C to know that A is better.

However, it's unclear if this transitivity assumption holds for AI models. Many papers that analyze Elo for AI evaluation cite transitivity assumption as a limitation (Boubdir et al.; Balduzzi et al.; and Munos et al.). They argued that human preference is not necessarily transitive. In addition, non-transitivity can happen because different model pairs are evaluated by different evaluators and on different prompts.

There's also the challenge of evaluating new models. With independent evaluation, only the new model needs to be evaluated. With comparative evaluation, the new model has to be evaluated against existing models, which can change the ranking of existing models.

This also makes it hard to evaluate private models. Imagine you've built a model for your company, using internal data. You want to compare this model with public models to decide whether it would be more beneficial to use a public one. If you want to use comparative evaluation for your model, you'll likely have to collect your own comparative signals and create your own leaderboard or pay one of those public leaderboards to run private evaluation for you.

The scaling bottleneck can be mitigated with better matching algorithms. So far, we've assumed that models are selected randomly for each match, so all model pairs appear in approximately the same number of matches. However, not all model pairs need to be equally compared. Once we're confident about the outcome of a model pair, we can stop matching them against each other. An efficient matching algorithm should sample matches that reduce the most uncertainty in the overall ranking.

### Lack of standardization and quality control

One way to collect comparative signals is to crowdsource comparisons to the community the way LMSYS Chatbot Arena does. Anyone can go to the website, enter a prompt, get back two responses from two anonymous models, and vote for the better one. Only after voting is done are the model names revealed.

The benefit of this approach is that it captures a wide range of signals and is relatively difficult to game.[^24] However, the downside is that it's hard to enforce standardization and quality control.

First, anyone with internet access can use any prompt to evaluate these models, and there's no standard on what should constitute a better response. It might be a lot to expect volunteers to fact-check the responses, so they might unknowingly prefer responses that sound better but are factually incorrect.

Some people might prefer polite and moderate responses, while others might prefer responses without a filter. This is both good and bad. It's good because it helps capture human preference in the wild. It's bad because human preference in the wild might not be appropriate for all use cases. For example, if a user asks a model to tell an inappropriate joke and a model refuses, the user might downvote it. However, as an application developer, you might prefer that the model refuses. Some users might even maliciously pick the toxic responses as the preferred ones, polluting the ranking.

Second, crowdsourcing comparisons require users to evaluate models outside of their working environments. Without real-world grounding, test prompts might not reflect how these models are being used in the real world. People might just use the first prompts that come to mind and are unlikely to use sophisticated prompting techniques.

Among 33,000 prompts published by LMSYS Chatbot Arena in 2023, 180 of them are "hello" and "hi", which account for 0.55% of the data, and this doesn't yet count variations like "hello!", "hello.", "hola", "hey", and so on. There are many brainteasers. The question "X has 3 sisters, each has a brother. How many brothers does X have?" was asked 44 times.

Simple prompts are easy to respond to, making it hard to differentiate models' performance. Evaluating models using too many simple prompts can pollute the ranking.

If a public leaderboard doesn't support sophisticated context construction, such as augmenting the context with relevant documents retrieved from your internal databases, its ranking won't reflect how well a model might work for your RAG system. The ability to generate good responses is different from the ability to retrieve the most relevant documents.

One potential way to enforce standardization is to limit users to a set of predetermined prompts. However, this might impact the leaderboard's ability to capture diverse use cases. LMSYS instead lets users use any prompts but then filter out hard prompts using their internal model and rank models using only these hard prompts.

Another way is to use only evaluators that we can trust. We can train evaluators on the criteria to compare two responses or train them to use practical prompts and sophisticated prompting techniques. This is the approach that Scale uses with their private comparative leaderboard. The downside of this approach is that it's expensive and it can severely reduce the number of comparisons we can get.

Another option is to incorporate comparative evaluation into your products and let users evaluate models during their workflows. For example, for the code generation task, you can suggest users two code snippets inside the user's code editor and let them pick the better one. Many chat applications are already doing this. However, as mentioned previously, the user might not know which code snippet is better, since they're not the expert.

On top of that, users might not read both options and just randomly click on one. This can introduce a lot of noise to the results. However, the signals from the small percentage of users who vote correctly can sometimes be sufficient to help determine which model is better.

Some teams prefer AI to human evaluators. AI might not be as good as trained human experts but it might be more reliable than random internet users.

### From comparative performance to absolute performance

For many applications, we don't necessarily need the best possible models. We need a model that is good enough. Comparative evaluation tells us which model is better. It doesn't tell us how good a model is or whether this model is good enough for our use case. Let's say we obtained the ranking that model B is better than model A. Any of the following scenarios could be valid:

- Model B is good, but model A is bad.
- Both model A and model B are bad.
- Both model A and model B are good.

You need other forms of evaluation to determine which scenario is true.

Imagine that we're using model A for customer support, and model A can resolve 70% of all the tickets. Consider model B, which wins against A 51% of the time. It's unclear how this 51% win rate will be converted to the number of requests model B can resolve. Several people have told me that in their experience, a 1% change in the win rate can induce a huge performance boost in some applications but just a minimal boost in other applications.

When deciding to swap out A for B, human preference isn't everything. We also care about other factors like cost. Not knowing what performance boost to expect makes it hard to do the cost–benefit analysis. If model B costs twice as much as A, comparative evaluation isn't sufficient to help us determine if the performance boost from B will be worth the added cost.

## The Future of Comparative Evaluation

Given so many limitations of comparative evaluation, you might wonder if there's a future to it. There are many benefits to comparative evaluation. First, as discussed in "Post-Training" on page 78, people have found that it's easier to compare two outputs than to give each output a concrete score. As models become stronger, surpassing human performance, it might become impossible for human evaluators to give model responses concrete scores. However, human evaluators might still be able to detect the difference, and comparative evaluation might remain the only option. For example, the Llama 2 paper shared that when the model ventures into the kind of writing beyond the ability of the best human annotators, humans can still provide valuable feedback when comparing two answers (Touvron et al., 2023).

Second, comparative evaluation aims to capture the quality we care about: human preference. It reduces the pressure to have to constantly create more benchmarks to catch up with AI's ever-expanding capabilities. Unlike benchmarks that become useless when model performance achieves perfect scores, comparative evaluations will never get saturated as long as newer, stronger models are introduced.

Comparative evaluation is relatively hard to game, as there's no easy way to cheat, like training your model on reference data. For this reason, many trust the results of public comparative leaderboards more than any other public leaderboards.

Comparative evaluation can give us discriminating signals about models that can't be obtained otherwise. For offline evaluation, it can be a great addition to evaluation benchmarks. For online evaluation, it can be complementary to A/B testing.

## Summary

The stronger AI models become, the higher the potential for catastrophic failures, which makes evaluation even more important. At the same time, evaluating open-ended, powerful models is challenging. These challenges make many teams turn toward human evaluation. Having humans in the loop for sanity checks is always helpful, and in many cases, human evaluation is essential. However, this chapter focused on different approaches to automatic evaluation.

This chapter starts with a discussion on why foundation models are harder to evaluate than traditional ML models. While many new evaluation techniques are being developed, investments in evaluation still lag behind investments in model and application development.

Since many foundation models have a language model component, we zoomed into language modeling metrics, including perplexity and cross entropy. Many people I've talked to find these metrics confusing, so I included a section on how to interpret these metrics and leverage them in evaluation and data processing.

This chapter then shifted the focus to the different approaches to evaluate open-ended responses, including functional correctness, similarity scores, and AI as a judge. The first two evaluation approaches are exact, while AI as a judge evaluation is subjective.

Unlike exact evaluation, subjective metrics are highly dependent on the judge. Their scores need to be interpreted in the context of what judges are being used. Scores aimed to measure the same quality by different AI judges might not be comparable. AI judges, like all AI applications, should be iterated upon, meaning their judgments change. This makes them unreliable as benchmarks to track an application's changes over time. While promising, AI judges should be supplemented with exact evaluation, human evaluation, or both.

When evaluating models, you can evaluate each model independently, and then rank them by their scores. Alternatively, you can rank them using comparative signals: which of the two models is better? Comparative evaluation is common in sports, especially chess, and is gaining traction in AI evaluation. Both comparative evaluation and the post-training alignment process need preference signals, which are expensive to collect. This motivated the development of preference models: specialized AI judges that predict which response users prefer.

While language modeling metrics and hand-designed similarity measurements have existed for some time, AI as a judge and comparative evaluation have only gained adoption with the emergence of foundation models. Many teams are figuring out how to incorporate them into their evaluation pipelines. Figuring out how to build a reliable evaluation pipeline to evaluate open-ended applications is the topic of the next chapter.

## Footnotes

[^22]: Independent evaluation means that the evaluation of one model doesn't depend on the evaluation of other models.

[^23]: Even though Chatbot Arena stopped using the Elo rating algorithm, its developers, for a while, continued referring to their model ratings "Elo scores". They scaled the resulting Bradley-Terry scores to make them look like Elo scores. The scaling is fairly complicated. Each score is multiplied by 400 (the scale used in Elo) and added to 1,000 (the initial Elo score). Then this score is rescaled so that the model Llama-13b has a score of 800.

[^24]: As Chatbot Arena becomes more popular, attempts to game it have become more common. While no one has admitted to me that they tried to game the ranking, several model developers have told me that they're convinced their competitors try to game it.
