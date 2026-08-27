# TatkalEase

An independent hackathon prototype for a mock Tatkal-style train booking flow.

TatkalEase is **not affiliated with IRCTC or Indian Railways**. It uses mock trains, passengers, payment states, and order data only.



How "auto train-select" works — explanation for your narration

Since there's no train-picker screen, here's a clean, honest way to describe the logic (say this in your video, and optionally as a one-line comment/tooltip in the app):

The concept: For a given From/To/Date/Class combination, TatkalEase auto-selects the most relevant train on that route — rather than making the user compare a list under time pressure — using a simple priority order:

Direct route match — only trains that run From → To directly (no layovers) are considered
Earliest departure after a chosen time window — since Tatkal is about next-day urgency, it defaults to the earliest available direct train
Highest general seat availability in the requested class — among the direct, earliest options, pick the one most likely to actually have Tatkal seats open (in the mock, this is just a pre-set "flagship" train per route)

Why this is a legitimate design choice, not a shortcut: most travelers in a genuine Tatkal-rush scenario don't want to compare 5 trains under a 30-second clock — they want a good option fast. Auto-select removes a decision point that adds friction without adding much value in an emergency-booking context.

One sentence to say explicitly in your video: "To keep the flow fast under real Tatkal time pressure, we auto-select the best direct train for the route rather than asking the user to compare options — in a full version, this would pull live availability from IRCTC's inventory instead of our mock data."