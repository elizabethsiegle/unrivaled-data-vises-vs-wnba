## AI Eng SF meetup: Rise of Background Agents
- [ ] 👋🌊  
- [ ] Demo 🧪
- [ ] Sports analyst agent x dashboards📊
    - Structured 🏀 datasets
    - Boring (+reliable) infra
- [ ] ~~Data Pipelines~~ knowledge engine
    - ~~ingest + store~~ ground + synthesize
    - Serve🍦:
        - dashboards read structured data
        - agent queries stats

- [ ] Cron vs Agents🕵️‍♀️
![alt text](cronjobtweet.png)

|  | **Cron** | **Agents** |
| :--- | :--- | :--- |
| Nature    | Deterministic (scheduled) | !-deterministic (autonomous)
| **Logic** | Executes a fixed set of instructions at a specific time. | Reasons through a goal and selects tools to achieve it. |
| **Resilience** | Brittle; 😩 if DOM changes or down API is down. | Self-healing |
| **Cost** | Negligible; uses standard server resources. | Variable; involves LLM tokens and inference compute. |
| **Analogy** | ⏰ | 👩‍🍳 |

- [ ] cron = trigger, scraper = "worker"
- [ ] 2026 Prediction: Agent harnesses replace benchmarks
    - Benchmarks are saturated. No longer can we truly distinguish between a "good" and "great" model. Tough to measure meaningful progress.
    - Real proof = agents doing multi-day tasks on real infra
    - DO droplets, cron jobs = perfect harness playground

- [ ] Where GPUs fit
    - Batch embeddings for players + games
    - Summarization jobs on large datasets
    - Fine-tuning small sports models
    - Burst GPU compute without running a $$$ box 24/7

- [ ] What's Next 🚀
    - cron trigger agent
    - Multimodal (📹 analysis)
    - Predictive Betting/Analytics
    - GitHub: [elizabethsiegle/unrivaled-data-vises-vs-wnba](https://github.com/elizabethsiegle/unrivaled-data-vises-vs-wnba)
    - Twitter: [@lizziepika](twitter.com/lizziepika)
    - [DigitalOcean SF events](https://luma.com/digitalocean)

