---
title: How to build an AI assistant for your documentation
description: How is everyone building an AI assistant for their documentation?  I spent several nights after work making my own AI assistant. This is a summary of everything I have learnt.
date: 08-02-2023
draft: false
---

I've seen a lot of announcements recently for something peculiarly similar - an AI powered assistant that can answer questions about a product, library, framework, website or blog - you name it and it can provide answers about it.

I was curious. How were these AI assistants being built? Everyone knows about ChatGPT. But when I tried asking ChatGPT very specific questions about these products or libraries the response that I received didn’t match up. Intriguingly, these custom built assistants could respond with answers that included recent knowledge - things that had changed well after ChatGPT’s training cutoff date in 2021.

So I did what any sane person would do and spent several nights after work making my own AI assistant. This is a summary of everything I have learnt.

If you’re just interested in the final code, you can find it [right here](https://github.com/mikeesto/ai-assistant-docs-example/blob/main/example.py).

### It starts with a clever prompt

Most of the time when you ask ChatGPT a question, it draws its response from its vast knowledge of possibly everything that was publicly available on the internet at the time the model was trained. However, it turns out that through a clever prompt we can ask ChatGPT to instead only draw its answer from a body of text that we provide. You can easily try this yourself through the ChatGPT interface.

```markdown
Answer the question as truthfully as possible using the source text, and if the answer is not contained within the source text, say "I don't know".

Question: Which mountain did I climb on Monday?

Source text: On Monday I climbed Mount Yari. On Tuesday I rested. On Wednesday I travelled by train to Hiroshima.
```

```markdown
You climbed Mount Yari on Monday
```

By using this prompt technique we can leverage ChatGPT’s language prowess without relying on its (at times dated) knowledge base. I wanted to try the same prompt but programmatically with Python. Interestingly, ChatGPT doesn’t have a public API at the time of writing. All the AI assistants we see being announced are instead using GPT-3. It’s perhaps a slight simplification - but we can think of ChatGPT as being built on top of GPT-3, and fine tuned heavily with conversational text. Hence why it is a better fit for chatting. OpenAI has several iterations of GPT-3. The most advanced publicly released model is called _text-davinci-003_, and it’s this one that I am going to be using to create my AI assistant.

After pip installing the openai package, I ended up with a small Python script.

```python
import openai

openai.api_key = "XXXX"

response = openai.Completion.create(prompt="""Answer the question as truthfully as possible using the source text, and if the answer is not contained within the source text, say "I don't know".
Question: Which mountain did I climb on Monday?
Source text: On Monday I climbed Mount Yari. On Tuesday I rested. On Wednesday I travelled by train to Hiroshima.""",
model="text-davinci-003"
)

print(response["choices"][0]["text"])

# Answer: I climbed Mount Yari on Monday.
```

Great! This returns a very similar response aside from the I/You difference which can perhaps be attributed to ChatGTP’s superior conversational skills.

I then used Python to read a text file. It’s a draft article I’ve been working on. Perhaps I could ask GPT-3 some questions about what I have been writing.

```markdown
This model's maximum context length is 4097 tokens, however you requested 17748 tokens.
```

Building an AI assistant wasn’t going to be as easy as I thought.

### The context window

GPT-3 has a limit on the context that it can handle. This is something that seems to significantly increase with each generation of GPT. GPT-4 is expected to at least double the current context window. For now, however, the maximum request limit is 4000 tokens. A token is approximately 4 characters. If we do some rough back of the napkin maths: 1000 tokens is ~750 words, and 4000 tokens therefore equates to a max input of ~3000 words.

Three thousand words is nothing to sneeze at. But what happens if want to ask questions about a source text that exceeds it. There’s been a number of clever solutions developed to get around the context window limitation. What I have learnt is that everyone’s approach is slightly different. Often the approach taken is highly influenced by the kind of source text being worked with (e.g. a book vs API documentation vs research papers). However, in most cases we can say that the process generally consists of three steps:

1. Divide the source text into chunks (parts)
2. Calculate which chunks are likely to contain the answer to the user’s question
3. Only send these specific chunks, along with the question, to GPT-3 as a prompt. This way the request token limit is not exceeded.

As a small aside — a completely alternative approach is to _fine-tune_ GPT-3 so that the model itself learns new things. This is however quite expensive and it would need to be done every time the source text changes. So I personally haven’t seen too many examples of this.

### Chunking

Chunking is the process of splitting the source text into parts. For our purposes, there isn’t necessarily a one-size-fits-all approach. The most rudimentary method would be to simply split the source text into blocks, of say, 1024 characters. However, the disadvantage of such a rudimentary approach is that it’s likely to split words in the middle.

```python
text = "This is a sample text to illustrate the point."

# Split the text into chunks of 10 characters

['This is a', ' sample te', 'xt to ill', 'ustrate th', 'e point.']
```

This means that we lose the meaning of the text, which for reasons we are about to explore soon is not ideal. Instead, what I decided to do was to use the NLTK library, and in particular the sentence tokeniser method, to break the source text into sentences. This way each chunk contains complete sentences and the meaning of the text is better preserved.

```python
import nltk

def chunk_text(text, chunk_size=1024):
    sentences = nltk.sent_tokenize(text)
    chunks = []
    chunk = ""
    for sentence in sentences:
        if len(chunk + " " + sentence) <= chunk_size:
            chunk = chunk + " " + sentence
        else:
            chunks.append(chunk)
            chunk = sentence
    chunks.append(chunk)
    return chunks
```

To reiterate - how you go about chunking the text is going to be highly dependent on what it is. For a research paper, you may consider chunking on paragraphs or sections. For poem/lyrics, you may want to chunk on each stanza.

### Semantic search and embeddings

At this stage we have a list containing the chunked source text. We now need to decide which chunks are likely to contain the answer to the user’s question. What we might be tempted to do is a form of keyword-based search. If the question asked is:

_What are some good movies about time travel?_

We could find the chunks with the most frequent occurrences of the words _movies_, _time_ and _travel_. However, this is unlikely to give us the desired response because the user isn’t interested in travel movies in the broad sense, they are only specifically interested in _time travel_ movies.

Alternatively, it’s also possible that the user could ask a question that can be answered by the source text but they use a synonym in the question that doesn’t appear in the source text. For example, if the user asks:

_What are some of the shortcomings of Python as a programming language?_

Our source text may contain a very detailed section on the limitations of Python, but the word shortcomings is no where to be found.

So what we need instead of a keyword-based search is semantic search. We want to find chunks of the source text that match the meaning of what the user has asked. In order to do semantic search we first need to create an embedding for each chunk. An embedding is a numerical representation of words.

Imagine for a moment that we have a big box full of words. We want to give each word a number that tells us what it means and how it relates to other words. To do this, we can use a neural networked-based language model that has learnt how to map words to numerical representations. Then, whenever we want to know if two words are related, we can compare their numbers to know if they are similar or not.

To get a bit more technical - the chunked source text can be represented in a multi-dimensional vector space. We can calculate distances between the vectors to find the closest matches. We need to use a language model that can calculate the embeddings of text. There’s a few different options here but OpenAI itself has a popular model for this purpose called _text-embedding-ada-002_. It lets us send a string of text (up to ~8,000 words) and it turns it into a list of 1,536 floating point numbers.

```python
import openai
from time import sleep

def get_embeddings(chunked_text):
  embeddings = []
  count = 0
  for chunk in chunked_text:
    count += 1
    embeddings.append(openai.Embedding.create(
        model="text-embedding-ada-002", input=chunk)["data"][0]["embedding"])
    if count % 30 == 0:
      sleep(60)

  return embeddings
```

You might have noticed the use of the sleep function here. I’ve included it because the API enforces a rate limit which is quite stringent if you’re not on a paid plan.

This what the embeddings look like for one chunk.

```python
[-0.012661292217671871, -0.005988267716020346, -0.006203093566000462, 0.0012268563732504845, 0.018662987276911736, 0.02103949710726738, ...1530 more items]
```

The distance between two embeddings represents how semantically similar the text is to each other. This distance can be calculated using cosine similarity.

```python
import numpy as np

def cosine_similarity(a, b):
    dot_product = np.dot(a, b)
    norm_a = np.linalg.norm(a)
    norm_b = np.linalg.norm(b)
    return dot_product / (norm_a * norm_b)
```

This is computationally intensive task, particularly if working with a lot of vectors. To be honest, the above function is probably just fine for our purposes. But, in the spirit of over engineering our AI assistant - we can use a library called Faiss written by the smart folks at Facebook (Meta) Research which specialises in comparing vectors. It uses an indexing structure to reduce the number of vectors that need to be compared, and also implements a number of different algorithms depending on the dimensionality of the data.

```python
import faiss
import pickle
import numpy as np

index = faiss.IndexFlatL2(len(embeddings[0]))
index.add(np.array(embeddings))
pickle.dump(index, open('index.pickle', 'wb'))
```

I’m also taking advantage of Python’s pickle function as a quick way of storing the index to a file. The process of creating the embeddings can be slow and it also has a small associated cost, so it makes sense to store the embeddings somewhere if you’re planning on working again with the source text.

### What would you like to know?

The final part to our AI assistant is the main loop. We ask the user to enter a question. Then, we get the embeddings for that question. Having obtained the question’s embeddings, we can now search for the most similar chunks. The faiss search method allows us to pass in the question’s embeddings and also the number of similar chunks to return. In the code below I am asking for the indices of the 4 closest chunks which will be sorted by increasing distance to the question's embeddings.

We construct the prompt with the relevant source text, send it to GPT-3 for completion and then print out its response.

```python
import openai
import numpy as np

while True:
  question = input("Please ask your question: ")

  question_embedding = openai.Embedding.create(
    model="text-embedding-ada-002", input=question)
    ["data"][0]["embedding"]
  _, indices = embeddings.search(np.array([question_embedding]), 4)

  relevant_text = []

  for i in indices[0]:
	  if i == -1:
	    break
    relevant_text.append(chunked_text[i])

  relevant_text = "\n".join(relevant_text)

  answer = openai.Completion.create(
    prompt=f"""Answer the question as truthfully as possible using the source text, and if the answer is not contained within the source text, say "I don't know".
    Question: {question}
    Source text: {relevant_text}""",
  model="text-davinci-003"
  )

  print(answer["choices"][0]["text"].strip())
```

The example code in full can be found [here](https://github.com/mikeesto/ai-assistant-docs-example/blob/main/example.py).

### Pricing

The OpenAI API is not free so I encourage you to check out their [pricing page](ttps://openai.com/api/pricing/). When you sign up you receive a complimentary $18 worth of credit to begin with. Completions are significantly more expensive than calculating embeddings. I spent roughly $1.40 in the process of writing this article. The free credits are certainly enough to dip your toes in without handing over your credit card.

### Shout outs

There’s a few things I would like to acknowledge as they helped solidify my understanding while working on this and perhaps they can do similarly for you.

- [Build a GitHub support bot with GPT3, LangChain, and Python by Pete Hunt](https://dagster.io/blog/chatgpt-langchain#to-fine-tune-or-not-to-fine-tune).
- [LangChain](https://langchain.readthedocs.io/en/latest/index.html). This was actually one of the first things I looked at as I had seen plenty praise for it. Personally, I found that it abstracted too much of what was going on for my liking. But, it is a cool library and I found the source code to be very readable.
- [How to implement Q&A against your documentation with GPT3, embeddings and Datasette by Simon Willison](https://simonwillison.net/2023/Jan/13/semantic-search-answers/).
