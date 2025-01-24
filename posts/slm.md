

# A Comprehensive Survey of Small Language Models in the Era of Large Language Models: Techniques, Enhancements, Applications, Collaboration with LLMs, and Trustworthiness

By Fali Wang, Suhang Wang

Abstract: Large language models (LLMs) perform excellently in a variety of tasks but face challenges with time and computational costs due to their large parameter sizes and high computational demands. Therefore, small language models (SLMs), with their advantages such as low latency, cost-effectiveness, and ease of customization, are becoming increasingly popular for use in resource-limited environments and for acquiring domain-specific knowledge. We conducted a detailed survey on the technologies, enhancement methods, applications, collaborations with LLMs, and reliability of small language models. We also explored future research directions and have published a list of related models and articles on GitHub: https://github.com/FairyFali/SLMs-Survey. 

Link of the survey: https://arxiv.org/abs/2411.03350

## Paper Overview

![paper-overview](./overview_structure.png)

Figure 1 Paper Overview

## Challenges of LLMs

Neural language models (LMs) have significantly enhanced NLP, evolving from BERT's pre-training and fine-tuning paradigm to T5's pre-training with prompts, and finally to GPT-3's context learning. Models such as ChatGPT and Llama demonstrate "emergent abilities" when scaled up to large datasets and model sizes, advancing NLP applications in fields like programming, recommendation systems, and medical Q&A.

Despite the excellent performance of LLMs in complex tasks, their substantial parameter sizes and computational demands limit their deployment locally or confine them to cloud-based calls. This presents several challenges:

1. The high GPU memory usage and computational costs of LLMs typically mean they can only be deployed via cloud APIs, requiring users to upload data for queries, which can lead to data leaks and privacy issues, especially in sensitive areas like healthcare, finance, and e-commerce.
2. Using cloud-based LLMs on mobile devices faces issues of cloud latency, while direct deployment is impractical due to the high parameter and cache demands exceeding the capabilities of standard devices.
3. The vast number of parameters in LLMs can cause inference delays ranging from a few seconds to several minutes, making them unsuitable for real-time applications.
4. LLMs perform poorly in specialized fields like healthcare and law, requiring costly fine-tuning to improve performance.
5. Although general-purpose LLMs are powerful, many applications and tasks require only specific functionalities and knowledge, making the deployment of LLMs potentially wasteful and less effective than specialized small models.



## Advantages of SLMs

Recently, small language models (SLMs) have demonstrated performance comparable to LLMs while offering advantages in efficiency, cost, flexibility, and customization. Due to their fewer parameters, SLMs save significant computational resources during pre-training and inference, reduce memory and storage needs, and are particularly suitable for resource-limited environments and low-power devices. Therefore, SLMs are increasingly gaining attention as alternatives to LLMs. As shown in Figure 2, the download frequency of SLMs in the Hugging Face community now exceeds that of larger models, and Figure 3 illustrates the growing popularity of SLMs versions over time.

![downloads](./downloads.png)

Figure 2 Download Statistics Last Month in Hugging Face for LLMs with Various Model Sizes, obtained on October 7, 2024.

![timeline](./timeline.png)

Figure 3 A timeline of existing small language models.

## Definition of SLMs

Typically, language models with emergent abilities are classified as LLMs. However, there is no unified definition for SLMs. Some studies suggest that SLMs have fewer than 1 billion parameters and are usually equipped with about 6GB of memory on mobile devices; while others believe that SLMs can have up to 10 billion parameters, but these models typically lack emergent capabilities. Considering the application of SLMs in resource-constrained environments and for specific tasks, we propose a generalized definition: the parameter range of SLMs should be between the minimum size that can demonstrate emergent abilities for specific tasks and the maximum size that is manageable under resource constraints. This definition aims to integrate different perspectives and consider factors related to mobile computing and capability thresholds.

## SLMs Enhancement

In the era of large language models, the enhancement methods for SLMs differ, including training SLMs from scratch, supervised fine-tuning (SFT) to ensure SLMs follow instructions, advanced knowledge distillation and quantization techniques, as well as techniques frequently used in LLMs to boost the performance of SLMs for specific applications. We provide detailed descriptions of some representative methods, including model architectures with parameter sharing (discussed in sub-section 3.1 on training from scratch), optimizing preferences from human feedback (covered in the supervised fine-tuning sub-section 3.2), data quality in knowledge distillation (section 3.3), distribution consistency during the distillation process (section 3.4), post-training quantization and quantization-aware training techniques (section 3.5), and enhancing SLMs with RAG and MoE methods (section 3.6). The future direction of this chapter explores model architectures that can improve performance while reducing computational demands, such as Mamba.

## SLMs Applications

Due to their ability to enhance privacy and lower memory requirements, many NLP tasks have begun adopting SLMs, utilizing specialized techniques to improve their performance in specific tasks (see Section 4.1), such as question answering, code, recommendation systems, and automation tasks on mobile devices. Representative applications include automating tasks on mobile devices where SLMs act as intelligent proxies to invoke necessary APIs, or automatically complete given operational commands based on smartphone UI page (see Sub-section 4.1.5).

Moreover, deploying SLMs typically requires consideration of memory and runtime efficiency, which are crucial for resource-constrained edge devices, especially smartphones (see Section 4.2). Memory efficiency is primarily manifested in the storage occupation of SLMs and their caches, and we have investigated methods to compress both the SLMs and their caches (see Sub-section 4.2.1). Runtime efficiency involves the size of SLM parameters and switching costs, such as transitions between RAM memory and GPU memory (see Sub-section 4.2.2), prompting us to explore strategies to reduce MoE switching times and decrease the latency of distributed SLMs.

Future research directions include using LoRA to provide personalized services to different users, identifying inherent knowledge within SLMs, and determining the minimal data necessary for effective fine-tuning (for more on future directions, see Section 8).



## Existing SLMs

We have summarized current representative small language models (see Figure 3), which include models applicable to both general and specific domains with fewer than 7 billion parameters. This paper details the acquisition methods, used datasets, and evaluation tasks for these small language models, and discusses strategies for obtaining SLMs through techniques such as compression, fine-tuning, or training from scratch. Through statistical analysis of various techniques, we have identified commonly used techniques for acquiring general-purpose SLMs, including GQA, Gated FFN, SiLU activation functions, RMS regularization, deep and thin model architectures, and optimization of embeddings (see Section 5.1). Domain-specific SLMs, such as those for science, healthcare, and law, are typically obtained through directive fine-tuning of supervised domain data generated by larger models or by continual training on domain data (see Section 5.2). Future research directions will include the development of specialized small language models in critical areas such as law, finance, education, telecommunications, and transportation.



## SLMs Help LLMs

Due to their high runtime efficiency and similar behavioral patterns to LLMs, SLMs can act as proxies to rapidly acquire prior knowledge for LLMs, thereby enhancing their functionality. This includes reducing inference latency, fine-tuning time, improving noise filtering in retrieval processes, enhancing suboptimal zero-shot performance, reducing copyright infringement risks, and optimizing evaluation difficulties.

In section 6, we explore the following five aspects:
(i) **SLMs Aid LLMs in Reliable Generation**: For instance, employing SLMs to assess the confidence of LLMs' outputs, or to explore hallucination scores based on the internal states of LLMs. For detailed methods on reliable generation, enhancing the inferencing capabilities of LLMs, improving LLMs' Retrieval-Augmented Generation (RAG), and mitigating copyright and privacy issues in LLM outputs, please refer to the full paper.
(ii) **SLMs Assist in Extracting LLM Prompts**: Adversarial methods utilize SLMs to reversely extract prompts from outputs.
(iii) **SLMs Support in LLM Fine-Tuning**: Differences in fine-tuning parameters of SLMs can simulate the evolution of LLM parameters, thereby enabling efficient fine-tuning of LLMs. 
(iv) **SLMs Support LLM Performance on Specific Tasks**: Customized SLMs may outperform LLMs in certain specific tasks but may underperform in hard samples; hence, collaboration between SLMs and LLMs can achieve superior performance in specific tasks.
(v) **SLMs Evaluate LLMs**: After fine-tuning, SLMs can serve as evaluators to assess the more format-free content generated by LLMs.

Future directions include using SLMs as proxies to explore more behaviors of LLMs, such as optimizing prompts, assessing missing knowledge, and evaluating data quality. For more information, see the future work discussed in Chapter 8 of the original text. 



## Trustworthiness of SLMs

![Trustworthiness Classification](trustworthy_SLM.png)
Figure 4 Trustworthiness Classification

Language models have become an indispensable part of our daily lives, and our dependency on them is continually increasing. However, they present certain risks due to limitations in privacy, fairness, and other trust dimensions. Consequently, many studies are dedicated to assessing the trustworthiness of language models. Although current research primarily focuses on LLMs, in Section 7, we turn our attention to models with 7 billion parameters or fewer and examine five key trust scenarios: **robustness, privacy, reliability, security, and fairness**, as detailed in Figure 4. In terms of robustness, we discuss both adversarial robustness and out-of-distribution robustness; for security, we primarily analyze misinformation and toxicity issues; in the realm of reliability, our main concerns are hallucination and sycophancy. However, most existing research concentrates on models with at least 7 billion parameters, leaving a gap in the comprehensive analysis of the trustworthiness of SLMs. Therefore, systematically assessing the trustworthiness of SLMs and understanding their performance across various applications is an important direction for future research.

## Conclusion

As the demand for SLMs grows, current research literature covers various aspects of SLMs, including training techniques optimized for specific applications such as quantization-aware training and selective architectural component selection. Although the performance of SLMs is recognized, potential credibility issues, such as the risks of hallucination and privacy breaches, still need attention. There is currently a lack of comprehensive surveys thoroughly exploring these aspects of SLMs in the era of LLMs. This paper aims to provide an in-depth survey, analyzing various aspects of SLMs during the LLMs era and their future development. For more details, see our full paper.

























