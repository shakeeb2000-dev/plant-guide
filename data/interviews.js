/* =============================================================
   INTERVIEW SHEETS
   The questions to ask your boss, with a box under each one to
   type the answer into. Everything you type is saved on the
   device straight away.
   -------------------------------------------------------------
   Question types:
     text   one-line box
     long   big box for a few sentences
     steps  a repeating block, one per step of the job
   Every question id must be unique inside its sheet.
   ============================================================= */

window.PLANT_INTERVIEWS = [

  /* ===========================================================
     STARTUP
     =========================================================== */
  {
    id: "startup",
    icon: "\u25B6",
    title: "Startup \u2014 interview sheet",
    subtitle: "Fill this in with your boss, then send it to me",
    linked: "startup-plant",
    intro: "Ask \u201cwhat do you do first?\u201d then keep saying \u201cand then?\u201d until he runs out. " +
           "Write down the obvious stuff too \u2014 that is exactly what a new operator does not know.",
    sections: [
      {
        title: "The quick facts",
        questions: [
          { id: "jobname", label: "What do you call this job on site?", type: "text" },
          { id: "who", label: "Who does it? (job title)", type: "text" },
          { id: "signoff", label: "Who signs it off?", type: "text" },
          { id: "howlong", label: "How long does it take, cold start to feeding?", type: "text" },
          { id: "ppe", label: "What do you wear for it?", type: "text",
            hint: "Hard hat, glasses, hearing, boots, gloves, hi-vis, anything else" },
          { id: "firstthing", label: "What must be running before anything else starts?", type: "long" },
          { id: "never", label: "What must NEVER happen during a startup?", type: "long" },
          { id: "records", label: "What gets written down, and on which form?", type: "long" }
        ]
      },
      {
        title: "The steps, in order",
        hint: "One block per step. Tap \u201cAdd another step\u201d as many times as you need. " +
              "You do not have to fill in every box \u2014 the first one is the important one.",
        questions: [
          { id: "steps", label: "The steps", type: "steps" }
        ]
      },
      {
        title: "The order of starting",
        hint: "Startup is mostly about what order things go in.",
        questions: [
          { id: "order", label: "What order do the machines start in, and why that order?", type: "long" },
          { id: "wrongorder", label: "What happens if someone starts them in the wrong order?", type: "long" },
          { id: "boilerwait", label: "How long after the boiler goes on can you feed raw material?", type: "text" },
          { id: "warmup", label: "What has to warm up first, and to what temperature?", type: "long" },
          { id: "feedrate", label: "What feed rate do you start at, and when can you wind it up?", type: "long" }
        ]
      },
      {
        title: "What goes wrong at startup",
        questions: [
          { id: "common", label: "What is the most common startup problem?", type: "long" },
          { id: "checkfirst", label: "What do you check first when it happens?", type: "long" },
          { id: "nearmiss", label: "What has nearly hurt someone during a startup?", type: "long" },
          { id: "newmistake", label: "What mistake do new operators always make?", type: "long" },
          { id: "stoppoint", label: "When do you stop and call someone instead of pushing on?", type: "long" },
          { id: "numbers", label: "Who do you call, and what are the numbers?", type: "long" }
        ]
      },
      {
        title: "Checking my example steps",
        hint: "Open the Plant Startup page and read my 13 steps out to him. Note anything wrong here \u2014 " +
              "correcting is faster than writing from scratch.",
        questions: [
          { id: "corrections", label: "Which of my steps are wrong, and what should they say?", type: "long" },
          { id: "missing", label: "What steps am I missing completely?", type: "long" },
          { id: "delete", label: "Which of my steps do not apply to your plant?", type: "long" }
        ]
      }
    ]
  },

  /* ===========================================================
     SHUTDOWN
     =========================================================== */
  {
    id: "shutdown",
    icon: "\u25A0",
    title: "Shutdown \u2014 interview sheet",
    subtitle: "Do this one after the startup sheet",
    linked: "shutdown-plant",
    intro: "Shutdown is mostly about emptying things in the right order before they cool down.",
    sections: [
      {
        title: "The quick facts",
        questions: [
          { id: "jobname", label: "What do you call this job on site?", type: "text" },
          { id: "who", label: "Who does it? Who signs it off?", type: "text" },
          { id: "howlong", label: "How long does it take, last feed to plant dead?", type: "text" },
          { id: "ppe", label: "What do you wear for it?", type: "text" },
          { id: "neverleave", label: "What must never be left sitting in a stopped machine?", type: "long" },
          { id: "staysrunning", label: "What stays running after everything else stops, and for how long?", type: "long" },
          { id: "lockout", label: "What gets isolated and locked out overnight?", type: "long" },
          { id: "records", label: "What gets written down, and on which form?", type: "long" }
        ]
      },
      {
        title: "The steps, in order",
        hint: "One block per step, from stopping the feed to handing over.",
        questions: [
          { id: "steps", label: "The steps", type: "steps" }
        ]
      },
      {
        title: "Running it empty",
        questions: [
          { id: "emptyorder", label: "What order do you run empty, and what order do machines stop in?", type: "long" },
          { id: "setssolid", label: "What sets solid if you leave it? (tallow lines, pumps, filters)", type: "long" },
          { id: "burns", label: "What burns or smoulders if you leave it hot? (meal in the mill, silos)", type: "long" },
          { id: "cooling", label: "How long does the cooker need to cool, and does the agitator keep turning?", type: "long" },
          { id: "washdown", label: "What has to be washed down, and what must NOT get water on it?", type: "long" }
        ]
      },
      {
        title: "Different kinds of shutdown",
        hint: "Say what changes for each one, or write \u201csame\u201d.",
        questions: [
          { id: "endofshift", label: "Normal end of shift or end of run", type: "long" },
          { id: "weekend", label: "Weekend or long break", type: "long" },
          { id: "emergency", label: "Emergency stop", type: "long" },
          { id: "power", label: "Power failure", type: "long" },
          { id: "boilerfail", label: "Boiler failure mid-run", type: "long" },
          { id: "breakdown", label: "Breakdown, restarting the same day", type: "long" }
        ]
      },
      {
        title: "Checking my example steps",
        questions: [
          { id: "corrections", label: "Which of my 11 shutdown steps are wrong, and what should they say?", type: "long" },
          { id: "missing", label: "What am I missing?", type: "long" }
        ]
      }
    ]
  },

  /* ===========================================================
     PLANT FLOW AND EQUIPMENT
     =========================================================== */
  {
    id: "flow",
    icon: "\u{1F5FA}",
    title: "Plant flow \u2014 interview sheet",
    subtitle: "Fixing my guesses on the plant map",
    linked: null,
    intro: "Open the Plant Map next to this. Every machine with an orange ? on it is me guessing. " +
           "These are the answers that will make the map right.",
    sections: [
      {
        title: "The five big ones",
        questions: [
          { id: "cookerdryer", label: "Can any cooker feed any dryer, or are they paired up?", type: "long" },
          { id: "separators", label: "Do the 3 separators do different jobs, or the same thing three times?", type: "long" },
          { id: "contrashear", label: "Is the contra shear on the raw material side or the water side?", type: "long" },
          { id: "uco", label: "Do the UCO tanks take oil in, or do you make it? Does it go through the same gear?", type: "long" },
          { id: "shakermill", label: "Shaker then mill, or mill then shaker? Is there a return loop?", type: "long" }
        ]
      },
      {
        title: "The counts I am missing",
        questions: [
          { id: "bins", label: "How many bins, and what does each one hold?", type: "long" },
          { id: "mills", label: "How many mills?", type: "text" },
          { id: "shakers", label: "How many shakers?", type: "text" },
          { id: "odour", label: "Odour control \u2014 what have you got? (fans, scrubber, biofilter)", type: "long" },
          { id: "condenser", label: "Is there a condenser or cooling tower?", type: "long" },
          { id: "loadout", label: "The loadout end \u2014 weighbridge, bagging, bulk-out?", type: "long" },
          { id: "effluent", label: "Anything on the effluent side besides the DAF?", type: "long" },
          { id: "hydrolyser", label: "The hydrolyser \u2014 what goes in it and where does it sit?", type: "long" }
        ]
      },
      {
        title: "The real names on site",
        hint: "I want the labels on the map to match what is painted on the machine and what the operators say.",
        questions: [
          { id: "names-boilers", label: "The two boilers", type: "text" },
          { id: "names-cookers", label: "The two cookers", type: "text" },
          { id: "names-dryers", label: "The three dryers", type: "text" },
          { id: "names-decanters", label: "The two decanters", type: "text" },
          { id: "names-press", label: "The press", type: "text" },
          { id: "names-separators", label: "The three separators", type: "text" },
          { id: "names-silos", label: "The three silos", type: "text" },
          { id: "names-tanks", label: "The four tallow tanks and two UCO tanks", type: "text" },
          { id: "names-other", label: "Anything else, and what it is called", type: "long" }
        ]
      },
      {
        title: "How it joins up",
        questions: [
          { id: "rawin", label: "Raw material in \u2014 what does it go through before the cooker?", type: "long" },
          { id: "species", label: "When you run ovine, is it a set cooker and dryer or whatever is free?", type: "long" },
          { id: "fatside", label: "The fat side \u2014 what order, and into which tanks?", type: "long" },
          { id: "evaporator", label: "The evaporator \u2014 what goes in, where does the concentrate go?", type: "long" },
          { id: "mealside", label: "The meal side \u2014 dryer to finished product, in order", type: "long" },
          { id: "bypass", label: "What can be bypassed when something is down?", type: "long" },
          { id: "wrong", label: "Anything else on my map that is plain wrong?", type: "long" }
        ]
      }
    ]
  }

];

/* The boxes inside each repeating step block */
window.PLANT_STEP_FIELDS = [
  { k: "do",     label: "What you do",            type: "long" },
  { k: "check",  label: "How you know it worked",  type: "text" },
  { k: "danger", label: "What is dangerous here",  type: "text" },
  { k: "who",    label: "Who does it",             type: "text" },
  { k: "time",   label: "How long",                type: "text" }
];
