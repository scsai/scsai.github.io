# LLM Quantization

**What is a Large Language Model (LLM)?**

Large Language Models (LLMs) are advanced machine learning models trained on vast amounts of text data to understand and generate human-like language. These models, such as GPT-4 and Claude, are built on architectures like the Transformer, which enables them to process context efficiently across large text sequences. LLMs excel in tasks such as text generation, question answering, summarization, and translation. However, their training also inadvertently absorbs sensitive information or biases, raising ethical and legal concerns about their use.

----------

**What is Machine Unlearning?**

Machine unlearning refers to the process of selectively removing specific knowledge or data patterns from a trained model without retraining it entirely. This is often necessary to comply with privacy regulations like GDPR's "Right to be Forgotten" or to address ethical issues involving biases or harmful content. Unlearning aims to ensure that the model "forgets" specific knowledge while maintaining its utility on other tasks. Techniques for unlearning include methods like *Gradient Ascent (GA)* and *Negative Preference Optimization (NPO)*.

Unlearning is particularly challenging for LLMs due to their complex structure and large parameter space. Ensuring the complete removal of specific information while preserving the model's overall functionality often involves fine-grained updates, small learning rates, and utility constraints.

----------

**What is Quantization?**

Quantization is a compression technique that reduces the precision of a model's weights and activations, typically represented as floating-point numbers, to lower bit-width formats such as 8-bit or 4-bit integers. This technique significantly reduces the model's size and inference latency, making it suitable for deployment on edge devices with limited computational resources.

Quantization can be applied during or after training:
-   *Post-Training Quantization (PTQ)*: Quantization is performed after the model is fully trained, with optional calibration to minimize accuracy loss.
-   *Quantization-Aware Training (QAT)*: The model is trained with quantization effects simulated during training to improve performance post-quantization.

Consider a group or block of weights $w$. The linear operation in its original form can be expressed as:

$$
y = wx
$$

In the quantized version, this is represented as:

$$
y = Q(w)x
$$

where $Q(\cdot)$ is the quantization function. Specifically, the quantization function is defined as:

$$
Q(w) = \Delta \cdot \text{Round}\left(\frac{w}{\Delta}\right)
$$

Here, the quantization scale factor $\Delta$ is determined as:

$$
\Delta = \frac{\max(|w|)}{2^{N-1}}
$$

where:
- $N$ is the number of quantization bits.
- $\Delta$ is the quantization step size, calculated based on the absolute maximum value of $w$.

This formulation ensures that the weights are scaled and rounded to discrete levels within the range defined by the quantization precision $N$.



### 4-bit Quantization Can Render Existing Machine Unlearning Techniques Ineffective!

![Figure 1](posts/blog1/figure1.png "Figure 1")

When using machine unlearning to remove specific knowledge—such as copyrighted or private content—from large language models (LLMs), one might assume the process is effective. However, we discovered that applying 4-bit quantization to a "forgotten" model can partially or fully recover the knowledge it was supposed to forget.

![Figure 2](posts/blog1/figure2.png "Figure 2")

Specifically, we examined six unlearning methods—combining *Gradient Ascent (GA)* or *Negative Preference Optimization (NPO)* with either Gradient Descent on Retain data (GDR) or KL divergence minimization (KLR). The methods included *GA, GA_GDR, GA_KLR, NPO, NPO_GDR, and NPO_KLR*. While these methods performed reasonably well in the full-precision setting, they failed catastrophically after 4-bit quantization. Specifically, in the full-precision model, only **21%** of the forgotten knowledge was retained on average. However, after quantization, this retention rate skyrocketed to **83%**, meaning the knowledge was largely recovered.

----------

#### Impact of Quantization Precision

![Figure 3](posts/blog1/figure3.png "Figure 3")

Furthermore, Our experiments revealed that the precision level of quantization has a significant effect. For example, 8-bit quantization had a much smaller impact on unlearning, with results close to the full-precision model. In contrast, 4-bit quantization caused severe degradation in unlearning performance. These findings were consistent across benchmark datasets like **NEWS** (BBC news articles) and **BOOKS** (Harry Potter series).

----------

#### Impact of Quantization Techniques

Using advanced 4-bit quantization methods like _GPTQ_ and _AWQ_, we observed similar patterns of knowledge recovery. Despite efforts to optimize parameters, the use of generic calibration datasets—rather than datasets tailored to the forgotten content—contributed to this issue. These generic datasets failed to account for the specific dynamics of the unlearning process, allowing the knowledge to be recovered.

----------

### Root Cause and Our Proposed Solution

The root cause lies in the small weight changes made during unlearning, constrained by small learning rates and utility preservation goals. These subtle changes are easily overridden during quantization, as weights from the original and forgotten models map to the same discrete values.

![Figure 4](posts/blog1/figure4.png "Figure 4")

To address this, we developed the **SURE framework (Saliency-Based Unlearning with a Large Learning Rate)**. This framework constructs module-level saliency maps to guide the unlearning process, focusing on components most related to the forgotten data while minimizing disruption to other functionalities. By using larger learning rates selectively, SURE prevents knowledge recovery after quantization. Specifically, we compute a saliency score $s_i$ for each module by aggregating the gradients of the forgetting loss with respect to $\theta_i$:

$$
s_i = \|\nabla_{\theta_i} \mathcal{L}_{\text{forget}}(\theta; D_{\text{forget}})\|_{\theta=\theta_o},
$$

where $\|\cdot\|$ denotes an appropriate norm (e.g., the Frobenius norm for matrices) that summarizes the gradient magnitudes for module $i$. 

We then apply a hard thresholding operation to obtain the module-level saliency map $m_M$:

$$
m_M[i] = 
\begin{cases} 
1, & \text{if } s_i \geq \gamma, \\
0, & \text{otherwise},
\end{cases}
$$

where $\gamma > 0$ is a threshold value. Hence, those modules with $m_M[i] > 0$ are treated as salient modules to be updated, and those with $m_M[i] = 0$ are intact modules.

Based on the module-level saliency map $m_M$, we explicitly express the unlearned model parameters $\theta_u$ as:

$$
\theta_u = \theta_o + m_M \odot \Delta\theta,
$$

where $\Delta\theta$ represents the parameter updates computed during unlearning, and $m_M \odot \Delta\theta$ denotes the module-wise multiplication of the saliency mask $m_M$ with the updates $\Delta\theta$. The mask $m_M[i]$ is applied to all parameters associated with module $i$. This formulation implies that during unlearning, we update only the salient modules identified by the module-level saliency map, leaving the rest of the network unchanged.

Experiments validated SURE's effectiveness, achieving comparable unlearning performance and utility preservation to existing methods on full-precision models. 

-----
**Paper:** [https://arxiv.org/pdf/2410.16454](https://arxiv.org/pdf/2410.16454)

**GitHub Repository:** [https://github.com/zzwjames/FailureLLMUnlearning](https://github.com/zzwjames/FailureLLMUnlearning)