export interface SkillDemo {
  brain: string;
  skill: string;
  prompt: string;
  generic: string;
  enhanced: {
    response: string;
    atoms: string[];
    confidence: string;
    nextSkills: string[];
  };
}

const DEMOS: Record<string, SkillDemo[]> = {
  // ─── Steve Jobs ───────────────────────────────────────────
  "steve-jobs:advise": [
    {
      brain: "steve-jobs",
      skill: "advise",
      prompt: "Should I add more features or strip my product down to its essence?",
      generic:
        "It depends on your market and users. Adding features can increase value for power users, while simplifying can improve onboarding. Consider doing user research to find the right balance. Both approaches have trade-offs you should weigh carefully.",
      enhanced: {
        response:
          'Jobs would tell you this isn\'t even a real question. Strip it down. His core belief was that focus means saying no to a thousand things \u2014 when he returned to Apple in 1997, he killed 70% of the product line. "People think focus means saying yes to the thing you\'ve got to focus on. It means saying no to the hundred other good ideas." If you\'re asking whether to add features, you already have too many.',
        atoms: [
          "Focus Means Saying No",
          "Simplicity Is the Ultimate Sophistication",
          "The 1997 Product Line Massacre",
          "Taste Is the Difference Between Craft and Commodity",
        ],
        confidence: "0.96",
        nextSkills: ["/debate", "/coach"],
      },
    },
  ],
  "steve-jobs:debate": [
    {
      brain: "steve-jobs",
      skill: "debate",
      prompt: "Is design more important than engineering?",
      generic:
        "Both design and engineering are important. Good products need strong engineering foundations and thoughtful design. The best teams find a balance between the two. It really comes down to your product type and target audience.",
      enhanced: {
        response:
          "You want Jobs to argue against design? Fine \u2014 he\u2019d steel-man engineering harder than you\u2019d expect. He spent years at NeXT building one of the most over-engineered machines ever made. He understood that without deep technical craft, design becomes decoration. BUT \u2014 and here\u2019s where he\u2019d pivot \u2014 engineering without taste produces technically impressive things nobody wants. The Macintosh team wasn\u2019t great because they were the best engineers. They were great because Jobs forced them to care about things engineers usually ignore: the feel of a keyboard, the sound of a startup chime, the inside of the case nobody would see.",
        atoms: [
          "Own the Whole Widget",
          "Technology Alone Is Not Enough",
          "A-Players Only",
          "The NeXT Years: Over-Engineering as Education",
        ],
        confidence: "0.91",
        nextSkills: ["/teach", "/connect"],
      },
    },
  ],
  "steve-jobs:predict": [
    {
      brain: "steve-jobs",
      skill: "predict",
      prompt: "What happens to product design as AI generates interfaces on the fly?",
      generic:
        "AI-generated interfaces could change how we think about design. Products might become more personalized and adaptive. Designers may shift from creating static layouts to defining systems and rules. It's an evolving space with many possibilities.",
      enhanced: {
        response:
          "Jobs would trace three cascading effects. First-order: generative interfaces commoditize visual design \u2014 anyone can produce something that looks polished. Second-order: taste becomes the only remaining moat, because AI can generate a million options but can\u2019t choose between them. The ability to say no becomes exponentially more valuable. Third-order: the companies that win are the ones that own the full stack of the experience \u2014 the hardware, the software, and the taste layer that connects them. This is the \"own the whole widget\" thesis playing out at the AI level.",
        atoms: [
          "Taste Is the Difference Between Craft and Commodity",
          "Own the Whole Widget",
          "Focus Means Saying No",
          "Start With the Customer Experience",
          "Copying Is the Deepest Form of Misunderstanding",
        ],
        confidence: "0.88",
        nextSkills: ["/debate", "/advise"],
      },
    },
  ],

  // ─── Scott Belsky ─────────────────────────────────────────
  "scott-belsky:advise": [
    {
      brain: "scott-belsky",
      skill: "advise",
      prompt: "Should I raise my Series A or stay bootstrapped?",
      generic:
        "It depends on your situation. Consider factors like your runway, growth rate, market opportunity, and personal goals. Both paths have trade-offs. Raising can accelerate growth but dilutes ownership. Bootstrapping preserves control but may limit speed.",
      enhanced: {
        response:
          'Belsky would push you toward staying small. His core thesis is "revenue per employee" as the new status metric \u2014 he believes resourcefulness outperforms resources, and AI-native tools let small teams scale ambition without proportionate headcount. He\u2019d ask: are you raising because you need the money, or because you think you\u2019re supposed to? The messy middle of building is where the real work happens, and adding capital often adds complexity, not clarity.',
        atoms: [
          "Resourcefulness Is Muscle; Resources Are Carbs",
          "Small Teams With AI > Large Teams Without",
          "The Messy Middle Is Where Everything Real Happens",
          "Seat-Based Pricing Is Already Dead",
        ],
        confidence: "0.95",
        nextSkills: ["/debate", "/coach"],
      },
    },
  ],
  "scott-belsky:predict": [
    {
      brain: "scott-belsky",
      skill: "predict",
      prompt: "What happens to SaaS if AI agents do most of the work?",
      generic:
        "AI agents could significantly impact SaaS businesses. We might see changes in pricing models, reduced need for certain features, and new types of software emerging. Companies should start thinking about how to adapt their products for an AI-first world.",
      enhanced: {
        response:
          "Belsky sees three orders of effect. First: seat-based pricing collapses \u2014 if an agent does the work of five people, nobody\u2019s paying per-seat. Second: the interface layer becomes the entire product. When AI agents handle execution, the only thing humans control is the interface that directs them \u2014 whoever owns that control surface owns the value. Third: intermediaries that exist only to coordinate human effort get disintermediated entirely. The companies that survive are the ones building for the agentic layer, not the human-operator layer.",
        atoms: [
          "Seat-Based Pricing Is Already Dead",
          "Interface Controls Value",
          "Intermediaries Were Always Overvalued",
          "The Prompt Era Is Ending; The Controls Era Begins",
          "Agency Beats Optimization",
        ],
        confidence: "0.93",
        nextSkills: ["/connect", "/debate"],
      },
    },
  ],
  "scott-belsky:connect": [
    {
      brain: "scott-belsky",
      skill: "connect",
      prompt: "Connect originality to organizational structure.",
      generic:
        "Originality and organizational structure are related in interesting ways. Flat organizations tend to foster more creativity, while hierarchical structures can sometimes stifle innovation. Finding the right structure for your team's creative goals is important.",
      enhanced: {
        response:
          "Here\u2019s the bridge Belsky draws: originality requires craft, and craft requires small teams with taste. But organizations naturally grow, and growth naturally kills taste \u2014 because taste can\u2019t be delegated through process. So the organizational structure that protects originality is one that stays deliberately small, hires unpopular people (the ones with strong convictions, not consensus-builders), and treats volatility as a feature of creative health. The org chart IS the creative strategy.",
        atoms: [
          "Taste Is the Ultimate Human Moat",
          "Craft Survives Abundance",
          "Your Best Hires Are the Unpopular People",
          "Peace Is Overrated in Organizations",
        ],
        confidence: "0.90",
        nextSkills: ["/evolve", "/advise"],
      },
    },
  ],

  // ─── Paul Graham ──────────────────────────────────────────
  "paul-graham:teach": [
    {
      brain: "paul-graham",
      skill: "teach",
      prompt: "What makes a good startup idea?",
      generic:
        "A good startup idea solves a real problem for a defined audience. Look for pain points in your own life, validate with potential customers, and make sure the market is large enough. Timing and execution matter as much as the idea itself.",
      enhanced: {
        response:
          "Graham would teach this by inverting it. Don\u2019t start with the idea \u2014 start with the problem. The best startup ideas come from noticing things that are broken in your own life, not from brainstorming sessions. He calls the tendency to avoid unglamorous problems \"schlep blindness\" \u2014 the reason Stripe was available to be built in 2010 was that every programmer knew online payments were painful, but nobody wanted to deal with banks and compliance. The formula: something a few people love beats something many people kind of like. If your idea doesn\u2019t have at least a few fanatical early users, it\u2019s probably too broad.",
        atoms: [
          "Make Something People Want",
          "The Best Startup Ideas Come From Noticing Problems",
          "Schlep Blindness Is the Biggest Missed Opportunity",
          "Do Things That Don\u2019t Scale",
        ],
        confidence: "0.97",
        nextSkills: ["/advise", "/debate"],
      },
    },
  ],
  "paul-graham:advise": [
    {
      brain: "paul-graham",
      skill: "advise",
      prompt: "Should I drop out of college to work on my startup?",
      generic:
        "This is a big decision with long-term implications. Consider your financial situation, the strength of your idea, and whether you have a support system. Many successful founders have college degrees, but some didn't. There's no one-size-fits-all answer.",
      enhanced: {
        response:
          "Graham\u2019s position is nuanced but leans toward: college is overrated for ambitious people, but dropping out is a bad default. His framework: are you dropping out because you have something so compelling you can\u2019t stop working on it, or because college feels boring? The first is a signal. The second is procrastination wearing ambition\u2019s clothes. He\u2019d also push back on the premise \u2014 the best founders he funded at YC often started while still in school. Don\u2019t make it binary. The real question is: do you have users yet?",
        atoms: [
          "College Is Overrated for Ambitious People",
          "Determination Matters More Than Intelligence",
          "Startups = Growth",
          "Keep Your Identity Small",
        ],
        confidence: "0.92",
        nextSkills: ["/coach", "/debate"],
      },
    },
  ],
  "paul-graham:debate": [
    {
      brain: "paul-graham",
      skill: "debate",
      prompt:
        "Is it better to build something a lot of people kind of want, or something a few people really want?",
      generic:
        "Both approaches can work. A broad product can capture more market share, while a niche product can build strong loyalty. The right choice depends on your resources, market dynamics, and long-term vision. Many successful companies have used either strategy.",
      enhanced: {
        response:
          "Graham would demolish the first option. A lot of people kind of wanting something is the most dangerous place in startups \u2014 it feels like validation but produces no urgency. Nobody switches tools for \"kind of.\" The few-people-love-it path is superior because love creates word-of-mouth, word-of-mouth creates organic growth, and organic growth is the only growth that compounds. BUT \u2014 the steel-man for broad: if you\u2019re building infrastructure (payments, auth, hosting), mild want from millions IS the business. Graham would concede that Stripe didn\u2019t need anyone to love it \u2014 they just needed everyone to slightly prefer it.",
        atoms: [
          "Make Something People Want",
          "Startups = Growth",
          "Do Things That Don\u2019t Scale",
          "Big Companies Are Almost Always Bad at Innovation",
        ],
        confidence: "0.94",
        nextSkills: ["/advise", "/predict"],
      },
    },
  ],

  // ─── Peter Attia ──────────────────────────────────────────
  "peter-attia:advise": [
    {
      brain: "peter-attia",
      skill: "advise",
      prompt: "I'm 55, overweight, and sedentary. What's my first move?",
      generic:
        "Start with small changes like walking 30 minutes a day and reducing processed food intake. Consult with your doctor before beginning any exercise program. Focus on building sustainable habits rather than dramatic changes. Consider working with a nutritionist.",
      enhanced: {
        response:
          "Attia would reject the conventional \u201cstart slow\u201d advice. His framework prioritizes by mortality impact, not comfort. Step one: get blood work done now \u2014 fasting glucose, insulin, ApoB, Lp(a). You need to know if any of the Four Horsemen (cardiovascular disease, cancer, neurodegeneration, metabolic dysfunction) are already progressing. Step two: start Zone 2 cardio immediately, 3-4 hours per week. Not HIIT \u2014 Zone 2. This is the single highest-leverage intervention for your VO2 max, which is the strongest predictor of all-cause mortality. Step three: strength training, focused on maintaining muscle mass. Muscle is a longevity organ, not a vanity metric.",
        atoms: [
          "Exercise Is the Most Potent Longevity Drug",
          "VO2 Max Is a Mortality Metric",
          "Muscle Is a Longevity Organ",
          "The Four Horsemen Are Preventable",
          "Zone 2 Training Is More Important Than HIIT",
        ],
        confidence: "0.96",
        nextSkills: ["/teach", "/coach"],
      },
    },
  ],
  "peter-attia:teach": [
    {
      brain: "peter-attia",
      skill: "teach",
      prompt: "Explain the Four Horsemen and why they matter.",
      generic:
        "The 'Four Horsemen' typically refers to major health conditions that affect longevity. These include heart disease, cancer, diabetes, and neurodegenerative diseases. Understanding your risk factors for each can help you take preventive measures and live a longer, healthier life.",
      enhanced: {
        response:
          "Attia\u2019s Four Horsemen are cardiovascular disease, cancer, neurodegenerative disease, and metabolic dysfunction. These aren\u2019t just leading causes of death \u2014 they\u2019re the causes of slow death. His key insight: Medicine 2.0 waits until you have the disease, then treats it. Medicine 3.0 (his framework) treats these as decades-long processes that begin in your 30s and 40s, long before symptoms appear. Every one of them is driven by modifiable risk factors. Metabolic health is foundational \u2014 insulin resistance accelerates all four. The reason this matters: by the time you\u2019re diagnosed with any of these, you\u2019ve lost 10-20 years of intervention opportunity.",
        atoms: [
          "Medicine 3.0 Replaces Reactive With Proactive",
          "The Four Horsemen Are Preventable",
          "Metabolic Health Is Foundational to Everything",
          "Risk Stratification Enables Precision",
        ],
        confidence: "0.97",
        nextSkills: ["/advise", "/predict"],
      },
    },
  ],
  "peter-attia:coach": [
    {
      brain: "peter-attia",
      skill: "coach",
      prompt: "I'm 40 and want to start optimizing for longevity. What should I be asking myself?",
      generic:
        "Good questions to ask yourself include: What are my current health metrics? Am I getting enough sleep and exercise? What does my diet look like? Do I have a family history of any diseases? It's also worth thinking about your stress levels and mental health.",
      enhanced: {
        response:
          "Attia wouldn\u2019t give you a plan \u2014 he\u2019d ask you these questions: What do you want to be doing physically at 80? Can you pick up your grandkids? Hike? Get off the floor unassisted? Now work backwards \u2014 what does your body need to be capable of in 20 years to get there? Have you measured your VO2 max? Do you know your ApoB level? Have you ever done a DEXA scan to know your actual body composition? Are you sleeping 7-8 hours, or are you telling yourself 6 is fine? And the question he says most people avoid: are you emotionally resilient enough to sustain decades of disciplined effort, or will you burn out in 6 months?",
        atoms: [
          "Longevity Gains Require Decades of Compound Effort",
          "Emotional Resilience Is Core, Not Ancillary",
          "VO2 Max Is a Mortality Metric",
          "Sleep Is Non-Negotiable",
        ],
        confidence: "0.93",
        nextSkills: ["/advise", "/teach"],
      },
    },
  ],

  // ─── John Green ───────────────────────────────────────────
  "john-green:teach": [
    {
      brain: "john-green",
      skill: "teach",
      prompt: "Explain why John believes hope is a discipline, not a feeling.",
      generic:
        "Many thinkers argue that hope is something we practice rather than just experience. It's about choosing to believe things can get better, even when evidence is mixed. This perspective can help during difficult times by framing hope as an active choice rather than a passive emotion.",
      enhanced: {
        response:
          "Green\u2019s argument is specific: feelings are unreliable. You wake up hopeless on Tuesday, hopeful on Wednesday \u2014 nothing changed except your neurochemistry. So if hope depends on feeling, it collapses the first time reality gets hard. His reframe: hope is a discipline like exercise. You practice it by paying attention to evidence of progress \u2014 declining child mortality, expanding literacy, the polio vaccine. You practice it by imagining others complexly instead of flattening them into enemies. He\u2019s not naive about this. He lives with OCD and depression. The discipline is precisely that it doesn\u2019t require feeling hopeful. You do it anyway.",
        atoms: [
          "Hope Is a Discipline, Not a Feeling",
          "The World Is Simultaneously Getting Better and Worse",
          "Mental Illness Is Not a Gift",
          "Paying Attention Is a Radical Act",
        ],
        confidence: "0.95",
        nextSkills: ["/debate", "/connect"],
      },
    },
  ],
  "john-green:connect": [
    {
      brain: "john-green",
      skill: "connect",
      prompt: "Connect attention to storytelling to mental health.",
      generic:
        "Attention, storytelling, and mental health are interconnected in various ways. Stories can help us process experiences and emotions. Paying attention to narratives can improve empathy and emotional well-being. There's growing research on using narrative therapy for mental health.",
      enhanced: {
        response:
          "Here\u2019s the bridge Green would draw: attention is the foundation. When you pay real attention to something \u2014 a sunset, a stranger, a fact about syphilis in Viennese composers \u2014 you\u2019re practicing the muscle that stories require. Stories then become empathy technology: they force you to inhabit someone else\u2019s consciousness, which is the only reliable treatment for the delusion that you\u2019re alone in your suffering. And that\u2019s the mental health connection \u2014 Green argues that community built through shared vulnerability (not shared triumph) is what actually heals. His own experience: writing about his OCD didn\u2019t cure it, but the attention readers paid to that writing created a community that made it bearable.",
        atoms: [
          "Attention Is the Most Fundamental Human Act",
          "Stories Are Empathy Technology",
          "Community Is Built Through Shared Vulnerability",
          "Mental Illness Is Not a Gift",
          "Imagining Others Complexly Is a Moral Imperative",
        ],
        confidence: "0.91",
        nextSkills: ["/teach", "/evolve"],
      },
    },
  ],
  "john-green:surprise": [
    {
      brain: "john-green",
      skill: "surprise",
      prompt: "Show me something unexpected.",
      generic:
        "Here's an interesting fact: the world has made enormous progress in reducing extreme poverty over the past few decades. Global literacy rates have also improved significantly. These positive trends are often overlooked in media coverage.",
      enhanced: {
        response:
          "Green rates the five-star scale itself. Not restaurants or movies \u2014 the rating system as a human invention. His take: the five-star scale reveals more about the reviewer than the reviewed. We think we\u2019re rating quality, but we\u2019re actually rating the gap between expectation and experience. A three-star review of a sunset says nothing about the sunset and everything about what you thought a sunset owed you. This is classic Green: taking something mundane and using it to surface a truth about how humans construct meaning. The ordinary is where meaning actually lives.",
        atoms: [
          "The Five-Star Scale Reveals More Than It Rates",
          "The Ordinary Is Where Meaning Actually Lives",
          "Attention Is the Most Fundamental Human Act",
        ],
        confidence: "0.89",
        nextSkills: ["/teach", "/connect"],
      },
    },
  ],

  // ─── Sun Tzu ──────────────────────────────────────────────
  "sun-tzu:advise": [
    {
      brain: "sun-tzu",
      skill: "advise",
      prompt: "Should I compete head-on with a larger rival or find an indirect approach?",
      generic:
        "It depends on your resources and market position. Competing head-on can work if you have a strong differentiator, but indirect approaches can help you avoid costly battles. Consider your strengths and find a strategy that plays to them. There are pros and cons to both approaches.",
      enhanced: {
        response:
          "Sun Tzu would not even entertain the first option. \"The supreme art of war is to subdue the enemy without fighting.\" Meeting a larger rival head-on is the worst possible strategy \u2014 it\u2019s siege warfare, the bottom of his hierarchy of victory. Instead: attack their strategy, not their army. Find the axis where you have asymmetric advantage \u2014 speed against their size, focus against their sprawl, information against their bureaucracy \u2014 and concentrate everything there. Be like water: formless, adaptive, flowing around the obstacle rather than crashing into it.",
        atoms: [
          "Subdue the Enemy Without Fighting",
          "Attack the Strategy, Not the Army",
          "Be Like Water",
          "Asymmetric Leverage",
          "The Hierarchy of Victory",
        ],
        confidence: "0.97",
        nextSkills: ["/debate", "/predict"],
      },
    },
  ],
  "sun-tzu:debate": [
    {
      brain: "sun-tzu",
      skill: "debate",
      prompt: "Is it always better to avoid direct confrontation?",
      generic:
        "Not necessarily. While avoiding confrontation can preserve resources, sometimes direct action is needed to establish dominance or protect critical interests. The best approach depends on the specific situation, your resources, and what's at stake.",
      enhanced: {
        response:
          "You want Sun Tzu to argue FOR direct confrontation? He can. His own text says: when you outnumber the enemy ten to one, surround them. Five to one, attack. Two to one, divide them. The preference for indirect warfare is conditional, not absolute. When the terrain is right, your forces are superior, and the enemy is exposed \u2014 strike decisively and fast. \"Speed is the essence of war.\" The danger is not confrontation itself but prolonged confrontation. Sun Tzu\u2019s deepest conviction: \"No nation has ever benefited from protracted war.\" Hit hard, win fast, go home. The sin is not fighting \u2014 it\u2019s fighting slowly.",
        atoms: [
          "Speed Is the Essence of War",
          "Prolonged Warfare Is Always a Mistake",
          "Every Battle Is Won Before It Is Fought",
          "Strength Is Often Weakness",
        ],
        confidence: "0.93",
        nextSkills: ["/advise", "/teach"],
      },
    },
  ],
  "sun-tzu:predict": [
    {
      brain: "sun-tzu",
      skill: "predict",
      prompt: "What happens when AI gives every competitor perfect information simultaneously?",
      generic:
        "If all competitors have access to the same AI-driven intelligence, competitive advantages may shift from information access to execution speed and creativity. Companies would need to find new ways to differentiate. The playing field could become more level in some ways.",
      enhanced: {
        response:
          "Sun Tzu would trace three cascading effects. First-order: if everyone has perfect information, intelligence \u2014 his most prized weapon \u2014 is neutralized. \"What enables the wise sovereign to strike and conquer is foreknowledge,\" but foreknowledge shared is foreknowledge destroyed. Second-order: deception becomes the only remaining advantage. If your enemy sees everything, the winning move is to make them see what isn\u2019t there. Multiple simultaneous feints, manufactured signals, compounding confusion. Third-order: speed collapses the decision loop entirely. When information is symmetric, the victor is whoever acts first \u2014 temporal compression becomes the supreme strategic principle. OODA loop before the term existed.",
        atoms: [
          "Intelligence Is More Valuable Than Weapons",
          "All Warfare Is Based on Deception",
          "Deception Layering",
          "Temporal Compression",
          "Chaos Is a Choice, Not an Accident",
        ],
        confidence: "0.90",
        nextSkills: ["/debate", "/connect"],
      },
    },
  ],
};

export function getDemo(
  brain: string,
  skill: string,
): SkillDemo | null {
  const demos = DEMOS[`${brain}:${skill}`];
  return demos?.[0] ?? null;
}

export function getDefaultDemo(): SkillDemo {
  return DEMOS["steve-jobs:advise"]![0]!;
}

export function hasDemo(brain: string, skill: string): boolean {
  return `${brain}:${skill}` in DEMOS;
}

/** All demos as a flat serializable record for the client */
export function getAllDemos(): Record<string, SkillDemo> {
  const flat: Record<string, SkillDemo> = {};
  for (const [key, demos] of Object.entries(DEMOS)) {
    flat[key] = demos[0]!;
  }
  return flat;
}
