## Model Architecture

As of this writing, the most dominant architecture for language-based foundation models is the transformer architecture (Vaswani et al., 2017), which is based on the attention mechanism. It addresses many limitations of the previous architectures, which contributed to its popularity. However, the transformer architecture has its own limitations. This section analyzes the transformer architecture and its alternatives. Because it goes into the technical details of different architectures, it can be technically dense. If you find any part too deep in the weeds, feel free to skip it.

### Transformer Architecture

To understand the transformer, let's look at the problem it was created to solve. The transformer architecture was popularized on the heels of the success of the seq2seq (sequence-to-sequence) architecture. At the time of its introduction in 2014, seq2seq provided significant improvement on then-challenging tasks: machine translation and summarization. In 2016, Google incorporated seq2seq into Google Translate, an update that they claimed to have given them the "largest improvements to date for machine translation quality". This generated a lot of interest in seq2seq, making it the go-to architecture for tasks involving sequences of text.

At a high level, seq2seq contains an encoder that processes inputs and a decoder that generates outputs. Both inputs and outputs are sequences of tokens, hence the name. Seq2seq uses RNNs (recurrent neural networks) as its encoder and decoder. In its most basic form, the encoder processes the input tokens sequentially, outputting the final hidden state that represents the input. The decoder then generates output tokens sequentially, conditioned on both the final hidden state of the input and the previously generated token. A visualization of the seq2seq architecture is shown in the top half of Figure 2-4.

*Figure 2-4. Seq2seq architecture versus transformer architecture. For the transformer architecture, the arrows show the tokens that the decoder attends to when generating each output token.*

There are two problems with seq2seq that Vaswani et al. (2017) addresses. First, the vanilla seq2seq decoder generates output tokens using only the final hidden state of the input. Intuitively, this is like generating answers about a book using the book summary. This limits the quality of the generated outputs. Second, the RNN encoder and decoder mean that both input processing and output generation are done sequentially, making it slow for long sequences. If an input is 200 tokens long, seq2seq has to wait for each input token to finish processing before moving on to the next.[^6]

The transformer architecture addresses both problems with the attention mechanism. The attention mechanism allows the model to weigh the importance of different input tokens when generating each output token. This is like generating answers by referencing any page in the book. A simplified visualization of the transformer architecture is shown in the bottom half of Figure 2-4.

> While the attention mechanism is often associated with the transformer model, it was introduced three years before the transformer paper. The attention mechanism can also be used with other architectures. Google used the attention mechanism with their seq2seq architecture in 2016 for their GNMT (Google Neural Machine Translation) model. However, it wasn't until the transformer paper showed that the attention mechanism could be used without RNNs that it took off.[^7]

The transformer architecture dispenses with RNNs entirely. With transformers, the input tokens can be processed in parallel, significantly speeding up input processing. While the transformer removes the sequential input bottleneck, transformer-based autoregressive language models still have the sequential output bottleneck.

Inference for transformer-based language models, therefore, consists of two steps:

**Prefill**
The model processes the input tokens in parallel. This step creates the intermediate state necessary to generate the first output token. This intermediate state includes the key and value vectors for all input tokens.

**Decode**
The model generates one output token at a time.

As explored later in Chapter 9, the parallelizable nature of prefilling and the sequential aspect of decoding both motivate many optimization techniques to make language model inference cheaper and faster.

#### Attention Mechanism

At the heart of the transformer architecture is the attention mechanism. Understanding this mechanism is necessary to understand how transformer models work. Under the hood, the attention mechanism leverages key, value, and query vectors:

The query vector (Q) represents the current state of the decoder at each decoding step. Using the same book summary example, this query vector can be thought of as the person looking for information to create a summary.

Each key vector (K) represents a previous token. If each previous token is a page in the book, each key vector is like the page number. Note that at a given decoding step, previous tokens include both input tokens and previously generated tokens.

Each value vector (V) represents the actual value of a previous token, as learned by the model. Each value vector is like the page's content.

The attention mechanism computes how much attention to give an input token by performing a dot product between the query vector and its key vector. A high score means that the model will use more of that page's content (its value vector) when generating the book's summary. A visualization of the attention mechanism with the key, value, and query vectors is shown in Figure 2-5. In this visualization, the query vector is seeking information from the previous tokens How, are, you, ?, ¿ to generate the next token.

*Figure 2-5. An example of the attention mechanism in action next to its high-level visualization from the famous transformer paper, "Attention Is All You Need" (Vaswani et al., 2017).*

Because each previous token has a corresponding key and value vector, the longer the sequence, the more key and value vectors need to be computed and stored. This is one reason why it's so hard to extend context length for transformer models. How to efficiently compute and store key and value vectors comes up again in Chapters 7 and 9.

Let's look into how the attention function works. Given an input x, the key, value, and query vectors are computed by applying key, value, and query matrices to the input. Let WK, WV, and WQ be the key, value, and query matrices. The key, value, and query vectors are computed as follows:

```
K = xWK
V = xWV
Q = xWQ
```

The query, key, and value matrices have dimensions corresponding to the model's hidden dimension. For example, in Llama 2-7B (Touvron et al., 2023), the model's hidden dimension size is 4096, meaning that each of these matrices has a 4096 × 4096 dimension. Each resulting K, V, Q vector has the dimension of 4096.[^8]

The attention mechanism is almost always multi-headed. Multiple heads allow the model to attend to different groups of previous tokens simultaneously. With multi-headed attention, the query, key, and value vectors are split into smaller vectors, each corresponding to an attention head. In the case of Llama 2-7B, because it has 32 attention heads, each K, V, and Q vector will be split into 32 vectors of the dimension 128. This is because 4096 / 32 = 128.

```
Attention(Q,K,V) = softmax(QK^T / √d_k)V
```

The outputs of all attention heads are then concatenated. An output projection matrix is used to apply another transformation to this concatenated output before it's fed to the model's next computation step. The output projection matrix has the same dimension as the model's hidden dimension.

#### Transformer Block

Now that we've discussed how attention works, let's see how it's used in a model. A transformer architecture is composed of multiple transformer blocks. The exact content of the block varies between models, but, in general, each transformer block contains the attention module and the MLP (multi-layer perceptron) module:

**Attention module**
Each attention module consists of four weight matrices: query, key, value, and output projection.

**MLP module**
An MLP module consists of linear layers separated by nonlinear activation functions. Each linear layer is a weight matrix that is used for linear transformations, whereas an activation function allows the linear layers to learn nonlinear patterns. A linear layer is also called a feedforward layer.

Common nonlinear functions are ReLU, Rectified Linear Unit (Agarap, 2018), and GELU (Hendrycks and Gimpel, 2016), which was used by GPT-2 and GPT-3, respectively. Activation functions are very simple.[^9] For example, all ReLU does is convert negative values to 0. Mathematically, it's written as:

```
ReLU(x) = max(0, x)
```

The number of transformer blocks in a transformer model is often referred to as that model's number of layers. A transformer-based language model is also outfitted with a module before and after all the transformer blocks:

**An embedding module before the transformer blocks**
This module consists of the embedding matrix and the positional embedding matrix, which convert tokens and their positions into embedding vectors, respectively. Naively, the number of position indices determines the model's maximum context length. For example, if a model keeps track of 2,048 positions, its maximum context length is 2,048. However, there are techniques that increase a model's context length without increasing the number of position indices.

**An output layer after the transformer blocks**
This module maps the model's output vectors into token probabilities used to sample model outputs (discussed in "Sampling" on page 88). This module typically consists of one matrix, which is also called the unembedding layer. Some people refer to the output layer as the model head, as it's the model's last layer before output generation.

*Figure 2-6. A visualization of the weight composition of a transformer model.*

The size of a transformer model is determined by the dimensions of its building blocks. Some of the key values are:

- The model's dimension determines the sizes of the key, query, value, and output projection matrices in the transformer block.
- The number of transformer blocks.
- The dimension of the feedforward layer.
- The vocabulary size.

Larger dimension values result in larger model sizes. Table 2-4 shows these dimension values for different Llama 2 (Touvron et al., 2023) and Llama 3 (Dubey et al., 2024) models. Note that while the increased context length impacts the model's memory footprint, it doesn't impact the model's total number of parameters.

**Table 2-4. The dimension values of different Llama models.**

| Model | # transformer blocks | Model dim | Feedforward dim | Vocab size | Context length |
|---|---|---|---|---|---|
| Llama 2-7B | 32 | 4,096 | 11,008 | 32K | 4K |
| Llama 2-13B | 40 | 5,120 | 13,824 | 32K | 4K |
| Llama 2-70B | 80 | 8,192 | 22,016 | 32K | 4K |
| Llama 3-7B | 32 | 4,096 | 14,336 | 128K | 128K |
| Llama 3-70B | 80 | 8,192 | 28,672 | 128K | 128K |
| Llama 3-405B | 126 | 16,384 | 53,248 | 128K | 128K |

### Other Model Architectures

While the transformer model dominates the landscape, it's not the only architecture. Since AlexNet revived the interest in deep learning in 2012, many architectures have gone in and out of fashion. Seq2seq was in the limelight for four years (2014–2018). GANs (generative adversarial networks) captured the collective imagination a bit longer (2014–2019). Compared to architectures that came before it, the transformer is sticky. It's been around since 2017.[^10] How long until something better comes along?

Developing a new architecture to outperform transformers isn't easy.[^11] The transformer has been heavily optimized since 2017. A new architecture that aims to replace the transformer will have to perform at the scale that people care about, on the hardware that people care about.[^12]

However, there's hope. While transformer-based models are dominating, as of this writing, several alternative architectures are gaining traction.

One popular model is RWKV (Peng et al., 2023), an RNN-based model that can be parallelized for training. Due to its RNN nature, in theory, it doesn't have the same context length limitation that transformer-based models have. However, in practice, having no context length limitation doesn't guarantee good performance with long context.

Modeling long sequences remains a core challenge in developing LLMs. An architecture that has shown a lot of promise in long-range memory is SSMs (state space models) (Gu et al., 2021a). Since the architecture's introduction in 2021, multiple techniques have been introduced to make the architecture more efficient, better at long sequence processing, and scalable to larger model sizes. Here are a few of these techniques, to illustrate the evolution of a new architecture:

- **S4**, introduced in "Efficiently Modeling Long Sequences with Structured State Spaces" (Gu et al., 2021b), was developed to make SSMs more efficient.

- **H3**, introduced in "Hungry Hungry Hippos: Towards Language Modeling with State Space Models" (Fu et al., 2022), incorporates a mechanism that allows the model to recall early tokens and compare tokens across sequences. This mechanism's purpose is akin to that of the attention mechanism in the transformer architecture, but it is more efficient.

- **Mamba**, introduced in "Mamba: Linear-Time Sequence Modeling with Selective State Spaces" (Gu and Dao, 2023), scales SSMs to three billion parameters. On language modeling, Mamba-3B outperforms transformers of the same size and matches transformers twice its size. The authors also show that Mamba's inference computation scales linearly with sequence length (compared to quadratic scaling for transformers). Its performance shows improvement on real data up to million-length sequences.

- **Jamba**, introduced in "Jamba: A Hybrid Transformer–Mamba Language Model" (Lieber et al., 2024), interleaves blocks of transformer and Mamba layers to scale up SSMs even further. The authors released a mixture-of-experts model with 52B total available parameters (12B active parameters) designed to fit in a single 80 GB GPU. Jamba shows strong performance on standard language model benchmarks and long-context evaluations for up to a context length of 256K tokens. It also has a small memory footprint compared to vanilla transformers.

*Figure 2-7. A visualization of the transformer, Mamba, and Jamba layers. Image adapted from "Jamba: A Hybrid Transformer–Mamba Language Model" (Lieber et al., 2024).*

While it's challenging to develop an architecture that outperforms the transformer, given its many limitations, there are a lot of incentives to do so. If another architecture does indeed overtake the transformer, some of the model adaptation techniques discussed in this book might change. However, just as the shift from ML engineering to AI engineering has kept many things unchanged, changing the underlying model architecture won't alter the fundamental approaches.

### Model Size

Much of AI progress in recent years can be attributed to increased model size. It's hard to talk about foundation models without talking about their number of parameters. The number of parameters is usually appended at the end of a model name. For example, Llama-13B refers to the version of Llama, a model family developed by Meta, with 13 billion parameters.

In general, increasing a model's parameters increases its capacity to learn, resulting in better models. Given two models of the same model family, the one with 13 billion parameters is likely to perform much better than the one with 7 billion parameters.

> As the community better understands how to train large models, newer-generation models tend to outperform older-generation models of the same size. For example, Llama 3-8B (2024) outperforms even Llama 2-70B (2023) on the MMLU benchmark.

The number of parameters helps us estimate the compute resources needed to train and run this model. For example, if a model has 7 billion parameters, and each parameter is stored using 2 bytes (16 bits), then we can calculate that the GPU memory needed to do inference using this model will be at least 14 billion bytes (14 GB).[^13]

The number of parameters can be misleading if the model is sparse. A sparse model has a large percentage of zero-value parameters. A 7B-parameter model that is 90% sparse only has 700 million non-zero parameters. Sparsity allows for more efficient data storage and computation. This means that a large sparse model can require less compute than a small dense model.

A type of sparse model that has gained popularity in recent years is mixture-of-experts (MoE) (Shazeer et al., 2017). An MoE model is divided into different groups of parameters, and each group is an expert. Only a subset of the experts is active for (used to) process each token.

For example, Mixtral 8x7B is a mixture of eight experts, each expert with seven billion parameters. If no two experts share any parameter, it should have 8 × 7 billion = 56 billion parameters. However, due to some parameters being shared, it has only 46.7 billion parameters.

At each layer, for each token, only two experts are active. This means that only 12.9 billion parameters are active for each token. While this model has 46.7 billion parameters, its cost and speed are the same as a 12.9-billion-parameter model.

A larger model can also underperform a smaller model if it's not trained on enough data. Imagine a 13B-param model trained on a dataset consisting of a single sentence: "I like pineapples." This model will perform much worse than a much smaller model trained on more data.

When discussing model size, it's important to consider the size of the data it was trained on. For most models, dataset sizes are measured by the number of training samples. For example, Google's Flamingo (Alayrac et al., 2022) was trained using four datasets—one of them has 1.8 billion (image, text) pairs and one has 312 million (image, text) pairs.

For language models, a training sample can be a sentence, a Wikipedia page, a chat conversation, or a book. A book is worth a lot more than a sentence, so the number of training samples is no longer a good metric to measure dataset sizes. A better measurement is the number of tokens in the dataset.

The number of tokens isn't a perfect measurement either, as different models can have different tokenization processes, resulting in the same dataset having different numbers of tokens for different models. Why not just use the number of words or the number of letters? Because a token is the unit that a model operates on, knowing the number of tokens in a dataset helps us measure how much a model can potentially learn from that data.

As of this writing, LLMs are trained using datasets in the order of trillions of tokens. Meta used increasingly larger datasets to train their Llama models:

- 1.4 trillion tokens for Llama 1
- 2 trillion tokens for Llama 2
- 15 trillion tokens for Llama 3

Together's open source dataset RedPajama-v2 has 30 trillion tokens. This is equivalent to 450 million books[^14] or 5,400 times the size of Wikipedia. However, since RedPajama-v2 consists of indiscriminate content, the amount of high-quality data is much lower.

The number of tokens in a model's dataset isn't the same as its number of training tokens. The number of training tokens measures the tokens that the model is trained on. If a dataset contains 1 trillion tokens and a model is trained on that dataset for two epochs—an epoch is a pass through the dataset—the number of training tokens is 2 trillion.[^15] See Table 2-5 for examples of the number of training tokens for models with different numbers of parameters.

**Table 2-5. Examples of the number of training tokens for models with different numbers of parameters. Source: "Training Compute-Optimal Large Language Models" (DeepMind, 2022).**

| Model | Size (# parameters) | Training tokens |
|---|---|---|
| LaMDA (Thoppilan et al., 2022) | 137 billion | 168 billion |
| GPT-3 (Brown et al., 2020) | 175 billion | 300 billion |
| Jurassic (Lieber et al., 2021) | 178 billion | 300 billion |
| Gopher (Rae et al., 2021) | 280 billion | 300 billion |
| MT-NLG 530B (Smith et al., 2022) | 530 billion | 270 billion |
| Chinchilla | 70 billion | 1.4 trillion |

> While this section focuses on the scale of data, quantity isn't the only thing that matters. Data quality and data diversity matter, too. Quantity, quality, and diversity are the three golden goals for training data. They are discussed further in Chapter 8.

Pre-training large models requires compute. One way to measure the amount of compute needed is by considering the number of machines, e.g., GPUs, CPUs, and TPUs. However, different machines have very different capacities and costs. An NVIDIA A10 GPU is different from an NVIDIA H100 GPU and an Intel Core Ultra Processor.

A more standardized unit for a model's compute requirement is FLOP, or floating point operation. FLOP measures the number of floating point operations performed for a certain task. Google's largest PaLM-2 model, for example, was trained using 10^22 FLOPs (Chowdhery et al., 2022). GPT-3-175B was trained using 3.14 × 10^23 FLOPs (Brown et al., 2020).

The plural form of FLOP, FLOPs, is often confused with FLOP/s, floating point operations per second. FLOPs measure the compute requirement for a task, whereas FLOP/s measures a machine's peak performance. For example, an NVIDIA H100 NVL GPU can deliver a maximum of 60 TeraFLOP/s: 6 × 10^13 FLOPs a second or 5.2 × 10^18 FLOPs a day.[^16]

> Be alert for confusing notations. FLOP/s is often written as FLOPS, which looks similar to FLOPs. To avoid this confusion, some companies, including OpenAI, use FLOP/s-day in place of FLOPs to measure compute requirements:
>
> 1 FLOP/s-day = 60 × 60 × 24 = 86,400 FLOPs
>
> This book uses FLOPs for counting floating point operations and FLOP/s for FLOPs per second.

Assume that you have 256 H100s. If you can use them at their maximum capacity and make no training mistakes, it'd take you (3.14 × 10^23) / (256 × 5.2 × 10^18) = ~236 days, or approximately 7.8 months, to train GPT-3-175B.

However, it's unlikely you can use your machines at their peak capacity all the time. Utilization measures how much of the maximum compute capacity you can use. What's considered good utilization depends on the model, the workload, and the hardware. Generally, if you can get half the advertised performance, 50% utilization, you're doing okay. Anything above 70% utilization is considered great. Don't let this rule stop you from getting even higher utilization. Chapter 9 discusses hardware metrics and utilization in more detail.

At 70% utilization and $2/h for one H100,[^17] training GPT-3-175B would cost over $4 million:

```
$2/H100/hour × 256 H100 × 24 hours × 256 days / 0.7 = $4,142,811.43
```

In summary, three numbers signal a model's scale:

- **Number of parameters**, which is a proxy for the model's learning capacity.
- **Number of tokens a model was trained on**, which is a proxy for how much a model learned.
- **Number of FLOPs**, which is a proxy for the training cost.

---

## Footnotes

[^6]: RNNs are especially prone to vanishing and exploding gradients due to their recursive structure. Gradients must be propagated through many steps, and if they are small, repeated multiplication causes them to shrink toward zero, making it difficult for the model to learn. Conversely, if the gradients are large, they grow exponentially with each step, leading to instability in the learning process.

[^7]: Bahdanau et al., "Neural Machine Translation by Jointly Learning to Align and Translate".

[^8]: Because input tokens are processed in batch, the actual input vector has the shape N × T × 4096, where N is the batch size and T is the sequence length. Similarly, each resulting K, V, Q vector has the dimension of N × T × 4096.

[^9]: Why do simple activation functions work for complex models like LLMs? There was a time when the research community raced to come up with sophisticated activation functions. However, it turned out that fancier activation functions didn't work better. The model just needs a nonlinear function to break the linearity from the feedforward layers. Simpler functions that are faster to compute are better, as the more sophisticated ones take up too much training compute and memory.

[^10]: Fun fact: Ilya Sutskever, an OpenAI co-founder, is the first author on the seq2seq paper and the second author on the AlexNet paper.

[^11]: Ilya Sutskever has an interesting argument about why it's so hard to develop new neural network architectures to outperform existing ones. In his argument, neural networks are great at simulating many computer programs. Gradient descent, a technique to train neural networks, is in fact a search algorithm to search through all the programs that a neural network can simulate to find the best one for its target task. This means that new architectures can potentially be simulated by existing ones too. For new architectures to outperform existing ones, these new architectures have to be able to simulate programs that existing architectures cannot. For more information, watch Sutskever's talk at the Simons Institute at Berkeley (2023).

[^12]: The transformer was originally designed by Google to run fast on Tensor Processing Units (TPUs), and was only later optimized on GPUs.

[^13]: The actual memory needed is higher. Chapter 7 discusses how to calculate a model's memory usage.

[^14]: Assuming a book contains around 50,000 words or 67,000 tokens.

[^15]: As of this writing, large models are typically pre-trained on only one epoch of data.

[^16]: FLOP/s count is measured in FP32. Floating point formats is discussed in Chapter 7.

[^17]: As of this writing, cloud providers are offering H100s for around $2 to $5 per hour. As compute is getting rapidly cheaper, this number will get much lower.
