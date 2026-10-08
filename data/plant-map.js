/* =============================================================
   PLANT MAP  —  rebuilt from the control room screens
   -------------------------------------------------------------
   Structure matches your FactoryTalk screens: the plant is a
   set of AREAS, and each area has its own flow diagram inside it.

   You do NOT place machines by hand. The app works out the
   layout from the edges, so to change the drawing you just
   change which machine feeds which.

   node:  { id, tag, label, type, values[], alarms[], note, guess }
   edge:  { from, to, stream, label, dashed, back }
          back: true  = a return loop, keeps the layout tidy

   Anything marked  guess: true  is me filling a gap.
   ============================================================= */

window.PLANT_INFO = {
  name: "Australian Tallow Producers",
  site: "Plant 1 (Ovine) and Plant 2 (Mixed / MBM)",
  revision: "Rev 1 \u2014 built from control room screens, not yet signed off"
};

window.PLANT_MAP = {

  plants: {
    p1:       { label: "Plant 1 \u2014 Ovine",      fill: "#e7f5ee", stroke: "#1f6f4a", text: "#17563a" },
    p2:       { label: "Plant 2 \u2014 Mixed / MBM", fill: "#e8eefc", stroke: "#1d4ed8", text: "#1e3a8a" },
    shared:   { label: "Shared",                     fill: "#fff6e6", stroke: "#b45309", text: "#7c4a02" },
    services: { label: "Services",                   fill: "#eef1f0", stroke: "#5a6b63", text: "#16211c" }
  },

  streams: {
    raw:    { label: "Raw material",      color: "#1f6f4a" },
    meal:   { label: "Meal",              color: "#166534" },
    tallow: { label: "Tallow / liquid",   color: "#b45309" },
    blood:  { label: "Blood",             color: "#9f1239" },
    water:  { label: "Water / effluent",  color: "#1d4ed8" },
    vapour: { label: "Vapour / air",      color: "#7c3aed" },
    steam:  { label: "Steam",             color: "#b3261e" }
  },

  areas: [

    /* ======================================================= */
    {
      id: "p1-raw",
      title: "Plant 1 \u2014 Raw Material Receival",
      plant: "p1",
      icon: "pit",
      summary: "Trucks tip ovine raw material straight into the Plant 1 pit. Three screws " +
               "working in the pit (motors M141, M142 and M143) push it out onto a long " +
               "cascade of screw conveyors, through metal detection and a screen, then on " +
               "to Cooker 1.",
      note: "The order of the screw cascade after the pit is my guess and needs a walk-down. " +
            "The screen also shows hopper levels at four points along the cascade (1, 452, " +
            "1375 and 546 when the photo was taken) \u2014 I do not know yet which hoppers those are.",
      to: ["p1-cook"],
      nodes: [
        { id: "p1-pit", label: "Plant 1 Receival Pit", type: "pit",
          note: "Trucks tip straight in here. Ovine only. This is the very first point of Plant 1." },
        { id: "m141", tag: "M141", label: "Pit Screw 1", type: "screw",
          note: "One of the three screws working in the Plant 1 pit." },
        { id: "m142", tag: "M142", label: "Pit Screw 2", type: "screw",
          note: "One of the three screws working in the Plant 1 pit." },
        { id: "m143", tag: "M143", label: "Pit Screw 3", type: "screw",
          note: "One of the three screws working in the Plant 1 pit." },
        { id: "m145", tag: "M145", label: "Screw Conveyor", type: "screw" },
        { id: "m146", tag: "M146", label: "Screw Conveyor", type: "screw" },
        { id: "m148", tag: "M148", label: "Screw Conveyor", type: "screw" },
        { id: "p1-md", label: "Metal Detector", type: "metaldetector",
          alarms: ["Metal Detected"] },
        { id: "m150", tag: "M150", label: "Screw Conveyor", type: "screw" },
        { id: "m151", tag: "M151", label: "Screw Conveyor", type: "screw" },
        { id: "s152", tag: "S152", label: "Screen", type: "shaker" },
        { id: "m153", tag: "M153", label: "Screen Discharge Screw", type: "screw" },
        { id: "m155", tag: "M155", label: "Screw Conveyor", type: "screw" },
        { id: "m157", tag: "M157", label: "Screw Conveyor", type: "screw" },
        { id: "m159", tag: "M159", label: "Screw Conveyor", type: "screw" },
        { id: "m161", tag: "M161", label: "Screw Conveyor", type: "screw" },
        { id: "m162", tag: "M162", label: "Cooker 1 Infeed Screw", type: "screw" }
      ],
      edges: [
        { from: "p1-pit", to: "m141", stream: "raw" },
        { from: "p1-pit", to: "m142", stream: "raw" },
        { from: "p1-pit", to: "m143", stream: "raw" },
        { from: "m141", to: "m145", stream: "raw" },
        { from: "m142", to: "m145", stream: "raw" },
        { from: "m143", to: "m145", stream: "raw" },
        { from: "m145", to: "m146", stream: "raw" },
        { from: "m146", to: "m148", stream: "raw" },
        { from: "m148", to: "p1-md", stream: "raw" },
        { from: "p1-md", to: "m150", stream: "raw" },
        { from: "m150", to: "m151", stream: "raw" },
        { from: "m151", to: "s152", stream: "raw" },
        { from: "s152", to: "m153", stream: "raw" },
        { from: "m153", to: "m155", stream: "raw" },
        { from: "m155", to: "m157", stream: "raw" },
        { from: "m157", to: "m159", stream: "raw" },
        { from: "m159", to: "m161", stream: "raw" },
        { from: "m161", to: "m162", stream: "raw" }
      ]
    },

    /* ======================================================= */
    {
      id: "p1-cook",
      title: "Plant 1 \u2014 Cooker Area",
      plant: "p1",
      icon: "cooker",
      summary: "Cooker 1 is ovine only. Cooked material goes to the Plant 1 decanter, " +
               "which splits it: solids up the Ovine Vertical Screw to the dryers, " +
               "liquid across to the tallow feed tank.",
      to: ["dryer-infeed", "liquid-phase"],
      nodes: [
        { id: "cooker1", tag: "Cooker 1 / M164", label: "Cooker 1", type: "cooker",
          note: "Ovine only. Jacket steam, shaft steam and live steam valves.",
          values: [{ k: "Steam", v: "Jacket, shaft and live" }] },
        { id: "c1-outpump", label: "Cooker 1 Outfeed Pump", type: "pump" },
        { id: "dec1-feed", label: "Decanter Infeed Feed Pump", type: "pump",
          values: [{ k: "Feed speed", v: "shown in RPM on the screen" }] },
        { id: "dec1", tag: "PLANT 1", label: "Plant 1 Decanter", type: "decanter",
          values: [
            { k: "Bowl", v: "3443 RPM" },
            { k: "Scroll", v: "2442 RPM" },
            { k: "Torque", v: "42 \u2013 45 bar" },
            { k: "Temperature", v: "48.2 \u00B0C" }
          ],
          note: "The same machine appears on the Liquid Phase screen labelled as the Plant 1 " +
                "Gtech decanter. These readings came off the cooker screen; the liquid side of " +
                "it is drawn in the Liquid Phase area." },
        { id: "m174", tag: "M174", label: "Decanter Outfeed Screw", type: "screw",
          note: "Read off the cooker screen. The Liquid Phase screen shows the Plant 1 outfeed " +
                "screws as M178 and M179, so either M174 is a third screw or one of my " +
                "readings is wrong. Worth a look." },
        { id: "ovine-screw", tag: "M190 \u2013 M193", label: "Ovine Vertical Screw", type: "screw",
          guess: true,
          note: "I read these numbers off a blurry photo. The Dryer Infeed screen shows the " +
                "Line 1 conveyors as M180, M181 and M182, so M190 to M193 may well be wrong. " +
                "Please check what is painted on this screw. Whatever its number, it hands " +
                "over to M180 in the Dryer Infeed area." },
      ],
      edges: [
        { from: "cooker1", to: "c1-outpump", stream: "raw", label: "cooked" },
        { from: "c1-outpump", to: "dec1-feed", stream: "raw" },
        { from: "dec1-feed", to: "dec1", stream: "raw" },
        { from: "dec1", to: "m174", stream: "meal", label: "solids" },
        { from: "m174", to: "ovine-screw", stream: "meal" }
      ]
    },

    /* ======================================================= */
    {
      id: "p2-raw",
      title: "Plant 2 \u2014 Raw Material Receival",
      plant: "p2",
      icon: "pit",
      summary: "Trucks tip everything that is not ovine straight into the Plant 2 pit. Same " +
               "shape as Plant 1: three screws working in the pit, a cascade of screw " +
               "conveyors and metal detection, then on to Cooker 2.",
      note: "The pit screw and cascade numbers were read off a blurry photo, so check them. " +
            "The order of the cascade needs a walk-down too. Hopper levels on the screen " +
            "read 8, 437 and 1442.",
      to: ["p2-cook"],
      nodes: [
        { id: "p2-pit", label: "Plant 2 Receival Pit", type: "pit",
          note: "Trucks tip straight in here. Everything that is not ovine. This is the very " +
                "first point of Plant 2." },
        { id: "m223", tag: "M223", label: "Pit Screw 1", type: "screw",
          note: "One of the three screws working in the Plant 2 pit." },
        { id: "m224", tag: "M224", label: "Pit Screw 2", type: "screw",
          note: "One of the three screws working in the Plant 2 pit." },
        { id: "m225", tag: "M225", label: "Pit Screw 3", type: "screw",
          note: "One of the three screws working in the Plant 2 pit." },
        { id: "m227", tag: "M227", label: "Screw Conveyor", type: "screw" },
        { id: "m229", tag: "M229", label: "Screw Conveyor", type: "screw" },
        { id: "p2-md", label: "Metal Detector", type: "metaldetector",
          alarms: ["Metal Detected"] },
        { id: "m230", tag: "M230", label: "Screw Conveyor", type: "screw" },
        { id: "m231", tag: "M231", label: "Screw Conveyor", type: "screw" },
        { id: "m232", tag: "M232", label: "Screw Conveyor", type: "screw" },
        { id: "m233", tag: "M233", label: "Screw Conveyor", type: "screw" },
        { id: "m234", tag: "M234", label: "Screw Conveyor", type: "screw" },
        { id: "m235", tag: "M235", label: "Cooker 2 Infeed Screw", type: "screw",
          values: [{ k: "Infeed speed", v: "Hi 28 %, Lo 14 %" }] }
      ],
      edges: [
        { from: "p2-pit", to: "m223", stream: "raw" },
        { from: "p2-pit", to: "m224", stream: "raw" },
        { from: "p2-pit", to: "m225", stream: "raw" },
        { from: "m223", to: "m227", stream: "raw" },
        { from: "m224", to: "m227", stream: "raw" },
        { from: "m225", to: "m227", stream: "raw" },
        { from: "m227", to: "m229", stream: "raw" },
        { from: "m229", to: "p2-md", stream: "raw" },
        { from: "p2-md", to: "m230", stream: "raw" },
        { from: "m230", to: "m231", stream: "raw" },
        { from: "m231", to: "m232", stream: "raw" },
        { from: "m232", to: "m233", stream: "raw" },
        { from: "m233", to: "m234", stream: "raw" },
        { from: "m234", to: "m235", stream: "raw" }
      ]
    },

    /* ======================================================= */
    {
      id: "p2-cook",
      title: "Plant 2 \u2014 Cooker Area",
      plant: "p2",
      icon: "press",
      summary: "Cooker 2 feeds the Twin Screw Press. Press cake goes out on the meal screws " +
               "to the dryers, and the liquid goes to the Liquid Phase area.",
      to: ["dryer-infeed", "liquid-phase"],
      nodes: [
        { id: "cooker2", tag: "Cooker 2 / M255", label: "Cooker 2", type: "cooker",
          note: "Jacket steam, shaft steam and live steam valves.",
          values: [
            { k: "Temperature", v: "96.1 \u00B0C" },
            { k: "Amps", v: "13.8 A" },
            { k: "Drive", v: "46 Hz" }
          ] },
        { id: "m258", tag: "M258 / M259", label: "Cooker 2 Drives", type: "screw", guess: true,
          note: "I had these two numbers on the Dryer Infeed page as well. The Blood Plant " +
                "screen showed the dryer feed motors are in the M266 to M293 range, so I have " +
                "settled M258 and M259 here on Cooker 2. Still worth a quick check." },
        { id: "tsp", tag: "M262", label: "Twin Screw Press", type: "press",
          values: [
            { k: "Drive", v: "45 Hz" },
            { k: "Second drive", v: "24 Hz" },
            { k: "Load", v: "44 %" }
          ] },
        { id: "m263", tag: "M263", label: "Meal Infeed Screw", type: "screw" },
        { id: "m264", tag: "M264", label: "Meal Outfeed Screw", type: "screw",
          note: "Confirmed on the Dryer Infeed screen: this is the long conveyor that carries " +
                "Plant 2 press cake all the way across to the dryer infeed as \u201CLine 2\u201D." },
        { id: "p261", tag: "P261", label: "Liquid Pump", type: "pump" },
        { id: "p262", tag: "P262", label: "Liquid Pump", type: "pump" }
      ],
      edges: [
        { from: "cooker2", to: "m258", stream: "raw" },
        { from: "m258", to: "tsp", stream: "raw", label: "cooked" },
        { from: "tsp", to: "m263", stream: "meal", label: "cake" },
        { from: "m263", to: "m264", stream: "meal" },
        { from: "tsp", to: "p261", stream: "tallow", label: "liquid" },
        { from: "p261", to: "p262", stream: "tallow" }
      ]
    },

    /* ======================================================= */
    {
      id: "dryer-infeed",
      title: "Dryer Infeed",
      plant: "shared",
      icon: "screw",
      summary: "The junction of the whole plant. Line 1 comes in on M180, Line 2 comes in " +
               "on M264, and the blood plant comes in on BLM108. All three land on M267, " +
               "which drops through V266 onto the reversible M266 conveyor. M266 running " +
               "forward or in reverse is what decides which dryer gets fed.",
      note: "Read off the Dryer_InfeedControl screen on 7 Oct 2026. It has its own Auto Start " +
            "and Auto Stop, and was reading \u201CDRYER INFEED RUNNING\u201D. Two valve alarms " +
            "were up at the time: \u201CV182 Fail To Open\u201D and \u201CV265 Fail To Close\u201D, " +
            "plus \u201CV266 Fail To Close\u201D. Worth finding out whether those three sit there " +
            "all the time or were real.",
      to: ["dryers"],
      nodes: [
        /* ---- how the operator picks the dryers ---- */
        { id: "di-select", label: "Dryer Selection", type: "valve",
          values: [
            { k: "Line 1 can pick", v: "Dryer 1 or Dryer 2" },
            { k: "Line 2 can pick", v: "Dryer 1, 2 or 3, or a pair" },
            { k: "Line 2 pairs", v: "1 and 2, 1 and 3, or 2 and 3" },
            { k: "Set when photographed", v: "Line 1 \u2192 Dryer 1. Line 2 \u2192 Dryer 2 and 3." }
          ],
          note: "Not a machine \u2014 this is the block of buttons at the top of the screen. " +
                "Note that Line 1 can only ever take ONE dryer, while Line 2 can take two at " +
                "once. Worth asking why." },

        /* ---- Line 1 in ---- */
        { id: "di-m180", tag: "M180", label: "Line 1 Meal Conveyor", type: "screw",
          note: "The long conveyor bringing ovine meal across from Plant 1." },
        { id: "di-m181", tag: "M181", label: "Line 1 Meal Conveyor", type: "screw" },
        { id: "di-m182", tag: "M182", label: "Line 1 Meal Conveyor", type: "screw" },
        { id: "di-v182", tag: "V182", label: "Line 1 Diverter Valve", type: "valve",
          alarms: ["V182 Fail To Open"],
          note: "This alarm was showing when you took the photo." },

        /* ---- Line 2 in ---- */
        { id: "di-m264", tag: "M264", label: "Line 2 Meal Conveyor", type: "screw",
          note: "The long conveyor bringing press cake across from the Plant 2 Twin Screw " +
                "Press. On the screen the arrows run right to left." },
        { id: "di-m265", tag: "M265", label: "Line 2 Meal Conveyor", type: "screw",
          note: "I had this one down as a Dryer 1 outfeed screw before. It is not \u2014 it is " +
                "on the infeed side." },
        { id: "di-v265", tag: "V265", label: "Line 2 Diverter Valve", type: "valve",
          alarms: ["V265 Fail To Close"] },

        /* ---- the common run ---- */
        { id: "di-m267", tag: "M267", label: "Collecting Conveyor", type: "screw",
          note: "Everything meets here: Line 1, Line 2 and the blood meal off BLM108. If this " +
                "one stops, nothing gets to any dryer." },
        { id: "di-v266", tag: "V266", label: "Drop Valve", type: "valve",
          alarms: ["V266 Fail To Close"] },
        { id: "di-m266", tag: "M266F / M266R", label: "Reversible Distribution Conveyor",
          type: "screw",
          values: [
            { k: "M266F", v: "runs forward" },
            { k: "M266R", v: "runs in reverse" }
          ],
          note: "This is the machine that chooses the dryer. Forward sends the meal one way " +
                "along the run, reverse sends it the other." },

        /* ---- into each dryer ---- */
        { id: "di-m268", tag: "M268", label: "Dryer 1 Feed Conveyor", type: "screw" },
        { id: "di-m269", tag: "M269", label: "Dryer 1 Infeed Conveyor", type: "screw" },
        { id: "di-m283", tag: "M283", label: "Dryer 2 Infeed Conveyor", type: "screw",
          values: [{ k: "Dryer 2 infeed time", v: "444 (units not shown)" }],
          note: "The screen shows an infeed time against this one. Probably seconds, but ask." },
        { id: "di-m293", tag: "M293", label: "Dryer 3 Infeed Conveyor", type: "screw" }
      ],
      edges: [
        { from: "di-m180", to: "di-m181", stream: "meal" },
        { from: "di-m181", to: "di-m182", stream: "meal" },
        { from: "di-m182", to: "di-v182", stream: "meal" },
        { from: "di-v182", to: "di-m267", stream: "meal", label: "Line 1" },

        { from: "di-m264", to: "di-m265", stream: "meal" },
        { from: "di-m265", to: "di-v265", stream: "meal" },
        { from: "di-v265", to: "di-m267", stream: "meal", label: "Line 2" },

        { from: "di-m267", to: "di-v266", stream: "meal" },
        { from: "di-v266", to: "di-m266", stream: "meal" },

        { from: "di-select", to: "di-m266", stream: "meal", dashed: true, label: "picks the dryer" },

        { from: "di-m266", to: "di-m268", stream: "meal" },
        { from: "di-m268", to: "di-m269", stream: "meal" },
        { from: "di-m266", to: "di-m283", stream: "meal" },
        { from: "di-m266", to: "di-m293", stream: "meal" }
      ]
    },

    /* ======================================================= */
    {
      id: "dryers",
      title: "Dryers",
      plant: "shared",
      icon: "dryer",
      summary: "Three dryers, shared between both plants \u2014 and, it turns out, shared with " +
               "the Blood Plant as well. Each has its own steam valve, chamber and exit " +
               "temperatures, and amps.",
      note: "These numbers came straight off your screens, so they are what \u201Cnormal\u201D " +
            "looks like. All three dryers are fed from one shared run, and the blood plant " +
            "feeds that same run, so a dryer can be drying meal or blood. That matters a lot " +
            "for startup, shutdown and species separation. One thing now settled: Dryer 3's " +
            "200 \u00B0C is a CHAMBER reading \u2014 its exit was only 109 \u00B0C at the same " +
            "moment, in line with the other two.",
      to: ["dryer-outfeed", "waste-heat"],
      nodes: [
        { id: "dryer1", tag: "Dryer 1", label: "Dryer 1", type: "dryer",
          values: [
            { k: "Chamber temp", v: "108 \u2013 118 \u00B0C" },
            { k: "Exit temp", v: "95.5 \u2013 119 \u00B0C" },
            { k: "Amps", v: "76 \u2013 93 A" },
            { k: "Fan motor", v: "M271" },
            { k: "Drive motor", v: "M270" },
            { k: "Steam", v: "100 % steam valve, press to toggle" }
          ],
          alarms: ["Dryer 1 Exit Temperature Low"],
          note: "Fed by M269. Discharges to M274. Can be picked by Line 1 or Line 2. The older " +
                "control system also tracks what species it is drying and which bin it is " +
                "filling \u2014 it read \u201CBin 1 in Line 1, BEEF NOW\u201D when you took " +
                "the photo, and had its own Auto Stop and Quick Stop to bin." },
        { id: "dryer2", tag: "Dryer 2", label: "Dryer 2", type: "dryer",
          values: [
            { k: "Chamber temp", v: "111 \u2013 122 \u00B0C" },
            { k: "Exit temp", v: "99 \u2013 112 \u00B0C" },
            { k: "Amps", v: "79 \u2013 83 A" },
            { k: "Fan motor", v: "M281" },
            { k: "Drive motor", v: "M280" }
          ],
          note: "Fed by M283. Discharges to M284. Can be picked by Line 1 or Line 2. Read " +
                "\u201CBin 4 in Line 2, POULTRY NOW\u201D on the older system, and was NOT " +
                "RUNNING at that moment." },
        { id: "dryer3", tag: "Dryer 3", label: "Dryer 3", type: "dryer",
          values: [
            { k: "Chamber temp", v: "102 \u2013 200 \u00B0C" },
            { k: "Exit temp", v: "96.9 \u2013 109 \u00B0C" },
            { k: "Amps", v: "73 \u2013 97 A" },
            { k: "Fan motor", v: "M292" }
          ],
          note: "Fed by M293. Discharges to M294. Line 2 only \u2014 the selection buttons do " +
                "not offer Dryer 3 to Line 1, which is worth asking about. Its chamber was " +
                "reading 200 \u00B0C while the other two sat near 120 \u00B0C, yet the exit " +
                "temperature was normal. Ask whether that is genuine or a duff sensor." }
      ],
      edges: []
    },

    /* ======================================================= */
    {
      id: "dryer-outfeed",
      title: "Dryer Outfeed",
      plant: "shared",
      icon: "screw",
      summary: "Dried meal out of the three dryers. Each dryer has its own chain of screws " +
               "down to a pair of A/B diverter valves, then everything collects on M321 and " +
               "M311. At the end the two product lines split again: M312 carries Line 1 and " +
               "M322 carries Line 2.",
      note: "Rebuilt from the Dryer_OutFeedControl screen on 7 Oct 2026, which threw out most " +
            "of my earlier guesses here. The A and B valves (V301A/B, V302A/B, V303A/B) are " +
            "clearly a two-way choice on each dryer's discharge, but I do not know what each " +
            "way means. I also cannot tell exactly how M301, M302 and M303 share M321 and " +
            "M311. SPECIES: the older control system has its own \u201CDryer Outfeed To " +
            "Bin\u201D page which shows, per dryer, which BIN and which LINE it is feeding " +
            "and what species is running. When photographed it read \u201CBin 1 in Line 1, " +
            "BEEF NOW\u201D for Dryer 1 and \u201CBin 4 in Line 2, POULTRY NOW\u201D for " +
            "Dryers 2 and 3. Each dryer also has its own Auto Stop and Quick Stop to bin.",
      to: ["silos-milling", "meal-bagging"],
      nodes: [
        /* ---- Dryer 1 out ---- */
        { id: "do-m274", tag: "M274", label: "Dryer 1 Outfeed Screw", type: "screw",
          note: "Takes the meal straight off the Dryer 1 exit, where the 119 \u00B0C exit " +
                "temperature is read." },
        { id: "do-m276", tag: "M276", label: "Inclined Conveyor", type: "screw",
          note: "The long sloped conveyor on the screen, lifting Dryer 1's meal up to the " +
                "same level as the others." },
        { id: "do-m278", tag: "M278", label: "Transfer Screw", type: "screw" },
        { id: "do-v301", tag: "V301A / V301B", label: "Dryer 1 Diverter Valves", type: "valve",
          note: "A two-way choice. What A and B each mean is still to confirm." },
        { id: "do-m301", tag: "M301", label: "Dryer 1 Collecting Screw", type: "screw" },

        /* ---- Dryer 2 out ---- */
        { id: "do-m284", tag: "M284", label: "Dryer 2 Outfeed Screw", type: "screw",
          note: "Dryer 2 exit read 112 \u00B0C." },
        { id: "do-v302", tag: "V302A / V302B", label: "Dryer 2 Diverter Valves", type: "valve" },
        { id: "do-m302", tag: "M302", label: "Dryer 2 Collecting Screw", type: "screw" },

        /* ---- Dryer 3 out ---- */
        { id: "do-m294", tag: "M294", label: "Dryer 3 Outfeed Screw", type: "screw",
          note: "Dryer 3 exit read 109 \u00B0C, even though its chamber was showing 200 \u00B0C." },
        { id: "do-m295", tag: "M295", label: "Transfer Screw", type: "screw" },
        { id: "do-v303", tag: "V303A / V303B", label: "Dryer 3 Diverter Valves", type: "valve" },
        { id: "do-m303", tag: "M303", label: "Dryer 3 Collecting Screw", type: "screw" },

        /* ---- the two long collectors ---- */
        { id: "do-m321", tag: "M321", label: "Collecting Conveyor", type: "screw" },
        { id: "do-m311", tag: "M311", label: "Collecting Conveyor", type: "screw",
          note: "M321 and M311 are the two long conveyors across the bottom of the screen. " +
                "Which dryers feed which of the two is the bit I am least sure about." },

        /* ---- the product split ---- */
        { id: "do-v312", tag: "V312", label: "Line 1 Diverter Valve", type: "valve" },
        { id: "do-m312", tag: "M312", label: "Line 1 Product Conveyor", type: "screw",
          note: "Labelled \u201CLine 1\u201D on the screen. This is the ovine product." },
        { id: "do-m323", tag: "M323", label: "Line 1 Product Conveyor", type: "screw" },
        { id: "do-bagout", label: "Bag Out", type: "bagging",
          note: "Labelled \u201CBag Out\u201D on the screen, at the end of the Line 1 side. " +
                "This backs up what you told me earlier: ovine meal gets bagged." },
        { id: "do-v324", tag: "V324", label: "Line 2 Diverter Valve", type: "valve" },
        { id: "do-m322", tag: "M322", label: "Line 2 Product Conveyor", type: "screw",
          note: "Labelled \u201CLine 2\u201D on the screen. This should be the MBM going to " +
                "the silos, but the screen stops here \u2014 please confirm where it lands." }
      ],
      edges: [
        { from: "do-m274", to: "do-m276", stream: "meal" },
        { from: "do-m276", to: "do-m278", stream: "meal" },
        { from: "do-m278", to: "do-v301", stream: "meal" },
        { from: "do-v301", to: "do-m301", stream: "meal" },

        { from: "do-m284", to: "do-v302", stream: "meal" },
        { from: "do-v302", to: "do-m302", stream: "meal" },

        { from: "do-m294", to: "do-m295", stream: "meal" },
        { from: "do-m295", to: "do-v303", stream: "meal" },
        { from: "do-v303", to: "do-m303", stream: "meal" },

        { from: "do-m301", to: "do-m311", stream: "meal" },
        { from: "do-m302", to: "do-m311", stream: "meal", dashed: true },
        { from: "do-m302", to: "do-m321", stream: "meal", dashed: true },
        { from: "do-m303", to: "do-m321", stream: "meal", dashed: true },

        { from: "do-m311", to: "do-v312", stream: "meal" },
        { from: "do-m321", to: "do-v324", stream: "meal" },

        { from: "do-v312", to: "do-m312", stream: "meal", label: "Line 1" },
        { from: "do-m312", to: "do-m323", stream: "meal" },
        { from: "do-m323", to: "do-bagout", stream: "meal" },

        { from: "do-v324", to: "do-m322", stream: "meal", label: "Line 2" }
      ]
    },

    /* ======================================================= */
    {
      id: "liquid-phase",
      title: "Liquid Phase",
      plant: "shared",
      icon: "decanter",
      summary: "Where all the liquid from both plants collects. Liquid off the Twin Screw " +
               "Press and off Cooker 2 lands in the Tallow Buffer Tank, which is steam " +
               "heated. P200 then pushes it out to the decanters. There are THREE decanters " +
               "here: a Gtech on Plant 1, and both a Gtech and an Alfa on Plant 2. Cleaned " +
               "tallow goes to the two Tallow Feed Tanks (LQ 3), and the stick water goes " +
               "off to Trade Waste on PSW205.",
      note: "Rebuilt from the Liquid_Phase screen on 7 Oct 2026. The big correction is the " +
            "decanter count \u2014 I had two, there are three, and the Alfa and the Gtech on " +
            "Plant 2 are separate machines. What I still cannot tell from the screen is the " +
            "flow direction at the top (whether P262 and M261 push INTO the buffer tank or " +
            "draw out of it) and exactly what PO205 and P175 are pumping. Those two are the " +
            "main things to walk down.",
      to: ["separators", "trade-waste"],
      nodes: [
        /* ---- liquid coming in from Plant 2 ---- */
        { id: "lp-p262", tag: "P262", label: "Press Liquid Pump", type: "pump",
          note: "The screen labels this line \u201CTwin Screw Press\u201D, so this is the " +
                "liquid coming off the press in Plant 2." },
        { id: "lp-ct262", label: "Press Liquid Catch Tank", type: "tank", guess: true,
          note: "A small tank drawn between P262 and WV262. I do not know its tag." },
        { id: "lp-wv262", tag: "WV262", label: "Press Liquid Valve", type: "valve" },
        { id: "lp-m261", tag: "M261", label: "Cooker 2 Liquid Pump", type: "pump",
          note: "The screen labels this line \u201CCooker 2\u201D." },
        { id: "lp-ct261", label: "Cooker 2 Liquid Catch Tank", type: "tank", guess: true },
        { id: "lp-wv261", tag: "WV261", label: "Cooker 2 Liquid Valve", type: "valve" },

        /* ---- the buffer tank and its services ---- */
        { id: "lp-buffer", label: "Tallow Buffer Tank", type: "tank",
          values: [
            { k: "Temperature", v: "80 \u00B0C (76.8 \u00B0C on an earlier photo)" },
            { k: "Level", v: "1.9 on an earlier photo" }
          ],
          note: "Everything liquid passes through here. Steam heated, so it has to be warm " +
                "before anything will pump." },
        { id: "lp-sv200", tag: "SV200", label: "Steam Valve", type: "valve",
          note: "Drawn under the \u201CSteam\u201D label at the bottom of the buffer tank." },
        { id: "lp-lv200", tag: "LV200", label: "Buffer Tank Valve", type: "valve", guess: true,
          note: "Sits next to SV200. I do not know what it does \u2014 possibly the tank " +
                "drain or a level control." },
        { id: "lp-hotflush", label: "Hot Flush Water", type: "valve",
          note: "Labelled in blue at the top right of the screen. Used for washing the lines " +
                "through. Where exactly it ties in is not clear." },

        /* ---- out of the buffer tank ---- */
        { id: "lp-pv200", tag: "PV200", label: "Product Valve", type: "valve" },
        { id: "lp-wv200", tag: "WV200", label: "Water Valve", type: "valve" },
        { id: "lp-p200", tag: "P200", label: "Product Pump", type: "pump",
          note: "The main pump of this area. Feeds whichever decanter is lined up." },

        /* ---- Plant 2 Alfa decanter ---- */
        { id: "lp-pv205", tag: "PV205", label: "Alfa Feed Valve", type: "valve" },
        { id: "lp-wv205", tag: "WV205", label: "Alfa Water Valve", type: "valve" },
        { id: "lp-alfa2", label: "Alfa Decanter \u2014 Plant 2", type: "decanter",
          note: "The screen labels this one \u201CAlfa\u201D on top and \u201CPLANT 2\u201D on " +
                "the body. It is a different machine from the Gtech on Plant 2." },
        { id: "lp-po205", tag: "PO205", label: "Alfa Feed Pump", type: "pump", guess: true,
          note: "Drawn just left of the Alfa with an arrow into it. I have assumed it feeds " +
                "the Alfa, but it could be pumping out of the Gtech side instead. Confirm." },
        { id: "lp-m205", tag: "M205", label: "Alfa Outfeed Screw", type: "screw" },
        { id: "lp-psw205", tag: "PSW205", label: "Stick Water Pump", type: "pump",
          note: "Clearly marked on the screen with an arrow to \u201CTrade Waste\u201D." },

        /* ---- Plant 2 Gtech decanter ---- */
        { id: "lp-pv201", tag: "PV201", label: "Gtech Feed Valve", type: "valve" },
        { id: "lp-gtech2", tag: "M201", label: "Gtech Decanter \u2014 Plant 2", type: "decanter",
          alarms: ["Back Drive Tripped (M201BD)"],
          note: "Labelled \u201CGtech\u201D on top and \u201CPLANT 2\u201D on the body. The " +
                "back drive trip alarm was showing when you took the photo." },
        { id: "lp-m201bd", tag: "M201BD", label: "Gtech Back Drive", type: "pump",
          note: "The back drive on the Plant 2 Gtech. This is what the trip alarm refers to." },
        { id: "lp-m202", tag: "M202", label: "Gtech Outfeed Screw", type: "screw" },
        { id: "lp-m257", tag: "M257", label: "Liquid Phase Screen", type: "shaker",
          note: "The cone-shaped unit under the Plant 2 Gtech. I have called it a screen " +
                "because of the shape, but confirm what it actually is." },
        { id: "lp-wv201", tag: "WV201", label: "Transfer Valve", type: "valve" },
        { id: "lp-p257", tag: "P257", label: "Transfer Pump", type: "pump" },

        /* ---- Plant 1 Gtech decanter ---- */
        { id: "lp-m169", tag: "M169", label: "Plant 1 Decanter Feed", type: "pump", guess: true,
          note: "Drawn at the left-hand end of the Plant 1 Gtech. I previously had M169 down " +
                "as a buffer tank on the cooker page, which now looks wrong \u2014 it belongs " +
                "here. What it drives still needs confirming." },
        { id: "lp-gtech1", label: "Gtech Decanter \u2014 Plant 1", type: "decanter",
          values: [{ k: "Level switches", v: "S175 HL and S175 LL" }],
          note: "Labelled \u201CGtech\u201D on top and \u201CPLANT 1\u201D on the body. This is " +
                "the ovine decanter, and it is the same machine as the Plant 1 Decanter on the " +
                "Plant 1 Cooker Area page \u2014 it just appears on both screens, the cooker " +
                "one for its speeds and torque, this one for where the liquid goes." },
        { id: "lp-p175", tag: "P175", label: "Plant 1 Liquid Pump", type: "pump", guess: true,
          note: "Drawn above the Plant 1 decanter with its line running right. I have drawn " +
                "it joining the M257 screen, but that is a guess." },
        { id: "lp-m178", tag: "M178", label: "Plant 1 Outfeed Screw", type: "screw" },
        { id: "lp-m179", tag: "M179", label: "Plant 1 Outfeed Screw", type: "screw" },
        { id: "lp-m176", tag: "M176", label: "Plant 1 Liquid Phase Screen", type: "shaker",
          note: "The cone unit at the bottom of the screen, the Plant 1 equivalent of M257." },
        { id: "lp-wv177", tag: "WV177", label: "Transfer Valve", type: "valve",
          values: [{ k: "High level switch", v: "S177 HL" }] },
        { id: "lp-p177", tag: "P177", label: "Tallow Transfer Pump", type: "pump" },

        /* ---- the two feed tanks ---- */
        { id: "lp-lq3a", tag: "LQ 3", label: "Tallow Feed Tank 1", type: "tank" },
        { id: "lp-lq3b", tag: "LQ 3", label: "Tallow Feed Tank 2", type: "tank",
          note: "Both tanks carry the same LQ 3 label on the screen, so I have numbered them " +
                "1 and 2 myself. What are they called on site?" }
      ],
      edges: [
        /* in from Plant 2 */
        { from: "lp-p262", to: "lp-ct262", stream: "tallow", label: "press liquid" },
        { from: "lp-ct262", to: "lp-wv262", stream: "tallow" },
        { from: "lp-wv262", to: "lp-buffer", stream: "tallow" },
        { from: "lp-m261", to: "lp-ct261", stream: "tallow", label: "cooker liquid" },
        { from: "lp-ct261", to: "lp-wv261", stream: "tallow" },
        { from: "lp-wv261", to: "lp-buffer", stream: "tallow" },

        /* services */
        { from: "lp-sv200", to: "lp-buffer", stream: "steam", label: "heating" },
        { from: "lp-lv200", to: "lp-buffer", stream: "tallow", dashed: true },
        { from: "lp-hotflush", to: "lp-buffer", stream: "water", dashed: true, label: "flush" },

        /* out of the buffer */
        { from: "lp-buffer", to: "lp-pv200", stream: "tallow" },
        { from: "lp-pv200", to: "lp-p200", stream: "tallow" },
        { from: "lp-wv200", to: "lp-p200", stream: "water", dashed: true },

        /* to the Alfa */
        { from: "lp-p200", to: "lp-pv205", stream: "tallow" },
        { from: "lp-pv205", to: "lp-alfa2", stream: "tallow" },
        { from: "lp-wv205", to: "lp-alfa2", stream: "water", dashed: true },
        { from: "lp-po205", to: "lp-alfa2", stream: "tallow", dashed: true },
        { from: "lp-alfa2", to: "lp-m205", stream: "meal", label: "solids" },
        { from: "lp-alfa2", to: "lp-psw205", stream: "water", label: "stick water" },

        /* to the Plant 2 Gtech */
        { from: "lp-p200", to: "lp-pv201", stream: "tallow" },
        { from: "lp-pv201", to: "lp-gtech2", stream: "tallow" },
        { from: "lp-gtech2", to: "lp-m201bd", stream: "tallow", dashed: true, label: "back drive" },
        { from: "lp-gtech2", to: "lp-m202", stream: "meal", label: "solids" },
        { from: "lp-gtech2", to: "lp-m257", stream: "tallow" },
        { from: "lp-m257", to: "lp-wv201", stream: "tallow" },
        { from: "lp-wv201", to: "lp-p257", stream: "tallow" },
        { from: "lp-p257", to: "lp-lq3b", stream: "tallow" },

        /* the Plant 1 side */
        { from: "lp-m169", to: "lp-gtech1", stream: "tallow" },
        { from: "lp-gtech1", to: "lp-m178", stream: "meal", label: "solids" },
        { from: "lp-m178", to: "lp-m179", stream: "meal" },
        { from: "lp-m179", to: "lp-m176", stream: "tallow" },
        { from: "lp-gtech1", to: "lp-p175", stream: "tallow", label: "liquid" },
        { from: "lp-p175", to: "lp-m257", stream: "tallow", dashed: true },
        { from: "lp-m176", to: "lp-wv177", stream: "tallow" },
        { from: "lp-wv177", to: "lp-p177", stream: "tallow" },
        { from: "lp-p177", to: "lp-lq3a", stream: "tallow" }
      ]
    },

    /* ======================================================= */
    {
      id: "separators",
      title: "Separators & Tallow Transfer",
      plant: "shared",
      icon: "separator",
      summary: "Three separators polish the tallow, fed from the two Liquid Phase tanks. " +
               "Finished tallow goes to the two Tallow Transfer Tanks. Stick water goes to " +
               "the evaporators.",
      to: ["tallow-farm", "waste-heat"],
      nodes: [
        { id: "sep-lp102", tag: "LP102", label: "Separator Feed Pump", type: "pump" },
        { id: "sep-lp104", tag: "LP104", label: "Separator Feed Pump", type: "pump" },
        { id: "sep-lp106", tag: "LP106", label: "Separator Feed Pump", type: "pump" },
        { id: "sep1", label: "Separator 1", type: "separator",
          values: [{ k: "Shown on screen", v: "kW and amps" }] },
        { id: "sep2", label: "Separator 2", type: "separator" },
        { id: "sep3", label: "Separator 3", type: "separator" },
        { id: "sep-lp108", tag: "LP108", label: "Tallow Transfer Pump", type: "pump" },
        { id: "sep-lp110", tag: "LP110", label: "Tallow Transfer Pump", type: "pump" },
        { id: "tt1", label: "Tallow Transfer Tank 1", type: "tank",
          values: [{ k: "Level", v: "2.5 %" }, { k: "Temperature", v: "56.6 \u00B0C" }],
          note: "Also on the Tank Farm screen, where it has its own pump P151 and flow meter " +
                "FM2 feeding the bottom row of tanks." },
        { id: "tt2", label: "Tallow Transfer Tank 2", type: "tank",
          values: [{ k: "Level", v: "41.5 %" }, { k: "Temperature", v: "59.0 \u00B0C" }],
          note: "Also on the Tank Farm screen, where it has its own pump P150 and flow meter " +
                "FM1 feeding the top row of tanks." },
        { id: "sep-sw", label: "Stick Water Out", type: "valve" }
      ],
      edges: [
        { from: "sep-lp102", to: "sep1", stream: "tallow" },
        { from: "sep-lp104", to: "sep2", stream: "tallow" },
        { from: "sep-lp106", to: "sep3", stream: "tallow" },
        { from: "sep1", to: "sep-lp108", stream: "tallow" },
        { from: "sep2", to: "sep-lp108", stream: "tallow" },
        { from: "sep3", to: "sep-lp110", stream: "tallow" },
        { from: "sep-lp108", to: "tt1", stream: "tallow" },
        { from: "sep-lp110", to: "tt2", stream: "tallow" },
        { from: "sep1", to: "sep-sw", stream: "water", dashed: true },
        { from: "sep2", to: "sep-sw", stream: "water", dashed: true },
        { from: "sep3", to: "sep-sw", stream: "water", dashed: true }
      ]
    },

    /* ======================================================= */
    {
      id: "tallow-farm",
      title: "Tallow Farm",
      plant: "shared",
      icon: "tank",
      summary: "The outside tank farm. The two Tallow Transfer Tanks each have their own " +
               "pump and flow meter: P150/FM1 fills the top row, P151/FM2 fills the bottom " +
               "row. The operator picks one destination tank per row. Alongside the four " +
               "tallow tanks there are two I.C.O. tanks, one for receival and one for " +
               "despatch.",
      note: "Rebuilt from the Tank_Farm screen on 7 Oct 2026, then corrected by you. The two " +
            "oil tanks are UCO (used cooking oil), not ICO \u2014 I misread the screen. " +
            "Importantly the UCO side does NOT connect to the rendering process at all: oil " +
            "is received into UCO 6, and once it reaches temperature it is transferred to " +
            "UCO 3, which is what the despatch tanker loads from. Treat it as a separate " +
            "little system sitting in the same tank farm. Note also the tallow tanks are " +
            "numbered 1, 2, 4 and 5 \u2014 there is no Tank 3 on this screen.",
      to: [],
      nodes: [
        /* ---- the two transfer tanks and their pumps ---- */
        { id: "tf-tt2", label: "Tallow Transfer Tank 2", type: "tank",
          note: "Same machine as Tallow Transfer Tank 2 on the Separators page. It feeds the " +
                "top row of the farm." },
        { id: "tf-pv1", tag: "PV1", label: "Transfer Valve", type: "valve" },
        { id: "tf-pv2", tag: "PV2", label: "Transfer Valve", type: "valve" },
        { id: "tf-p150", tag: "P150", label: "Top Line Transfer Pump", type: "pump" },
        { id: "tf-fm1", tag: "FM1", label: "Top Line Flow Meter", type: "valve",
          note: "A measurement, not a machine. This is how the transfer quantity is recorded." },

        { id: "tf-tt1", label: "Tallow Transfer Tank 1", type: "tank",
          note: "Same machine as Tallow Transfer Tank 1 on the Separators page. It feeds the " +
                "bottom row of the farm." },
        { id: "tf-pv5", tag: "PV5", label: "Transfer Valve", type: "valve" },
        { id: "tf-pv6", tag: "PV6", label: "Transfer Valve", type: "valve" },
        { id: "tf-p151", tag: "P151", label: "Bottom Line Transfer Pump", type: "pump" },
        { id: "tf-fm2", tag: "FM2", label: "Bottom Line Flow Meter", type: "valve" },

        { id: "tf-cross", tag: "AV1 / AV2 / PV3 / PV4", label: "Cross-connect Valves",
          type: "valve", guess: true,
          note: "Four valves drawn between the two transfer tanks. I have assumed they let " +
                "either tank feed either pump, which is the usual reason for that " +
                "arrangement, but the screen does not say so. Please confirm." },

        /* ---- top row destinations ---- */
        { id: "tf-v2", tag: "V2", label: "Top Line Valve", type: "valve" },
        { id: "tf-t1", label: "Tallow Tank 1", type: "tank",
          values: [{ k: "Capacity", v: "82 T" }, { k: "Level when photographed", v: "62.2" },
                   { k: "State", v: "Tank 1 Selected" }] },
        { id: "tf-v3", tag: "V3", label: "Top Line Valve", type: "valve" },
        { id: "tf-t2", label: "Tallow Tank 2", type: "tank",
          values: [{ k: "Level when photographed", v: "16.9" }],
          note: "The capacity is not shown against this one on the screen." },
        { id: "tf-uco3", label: "UCO 3 \u2014 Despatch Tank", type: "tank",
          values: [{ k: "Capacity", v: "46 T" }, { k: "Level when photographed", v: "34.7 T" }],
          note: "Filled from UCO 6 once the oil has reached temperature. This is the tank " +
                "the despatch tanker loads from. Nothing from the rendering process goes " +
                "into it." },

        /* ---- bottom row destinations ---- */
        { id: "tf-v1", tag: "V1", label: "Bottom Line Valve", type: "valve" },
        { id: "tf-t4", label: "Tallow Tank 4", type: "tank",
          values: [{ k: "Capacity", v: "82 T" }, { k: "Level when photographed", v: "81.2" },
                   { k: "State", v: "Tank 4 Selected" }],
          note: "Was nearly full when you took the photo." },
        { id: "tf-t5", label: "Tallow Tank 5", type: "tank",
          values: [{ k: "Capacity", v: "44 T" }, { k: "Level when photographed", v: "0.0 T" }],
          note: "Empty at the time." },
        { id: "tf-uco6", label: "UCO 6 \u2014 Receival Tank", type: "tank",
          values: [{ k: "Capacity", v: "26 T" }, { k: "Level when photographed", v: "0.7 T" }],
          note: "Used cooking oil is received into this tank. Once it reaches temperature it " +
                "is transferred across to UCO 3 for despatch. Nearly empty at the time." },
        { id: "tf-uco-transfer", label: "UCO 6 to UCO 3 Transfer", type: "pump", guess: true,
          note: "The transfer happens on temperature, so there is a pump and probably a " +
                "temperature setpoint behind it. What temperature, and is the transfer manual " +
                "or automatic?" },

        /* ---- in and out of site ---- */
        { id: "tf-tanker-in", label: "UCO Tanker Receival", type: "pump", guess: true,
          note: "Where the used cooking oil arrives. Not drawn on the screen." },
        { id: "tf-tanker-out", label: "Tanker Loadout", type: "pump", guess: true,
          note: "Not drawn on this screen. How is a tanker actually loaded, and from which " +
                "tanks?" }
      ],
      edges: [
        { from: "tf-tt2", to: "tf-pv1", stream: "tallow" },
        { from: "tf-pv1", to: "tf-pv2", stream: "tallow" },
        { from: "tf-pv2", to: "tf-p150", stream: "tallow" },
        { from: "tf-p150", to: "tf-fm1", stream: "tallow" },
        { from: "tf-fm1", to: "tf-v2", stream: "tallow" },
        { from: "tf-v2", to: "tf-t1", stream: "tallow" },
        { from: "tf-v2", to: "tf-v3", stream: "tallow" },
        { from: "tf-v3", to: "tf-t2", stream: "tallow" },

        { from: "tf-tt1", to: "tf-pv5", stream: "tallow" },
        { from: "tf-pv5", to: "tf-pv6", stream: "tallow" },
        { from: "tf-pv6", to: "tf-p151", stream: "tallow" },
        { from: "tf-p151", to: "tf-fm2", stream: "tallow" },
        { from: "tf-fm2", to: "tf-v1", stream: "tallow" },
        { from: "tf-v1", to: "tf-t4", stream: "tallow" },
        { from: "tf-v1", to: "tf-t5", stream: "tallow" },

        { from: "tf-tt2", to: "tf-cross", stream: "tallow", dashed: true },
        { from: "tf-tt1", to: "tf-cross", stream: "tallow", dashed: true },

        /* the UCO side is its own little system — nothing from the
           rendering process feeds into it */
        { from: "tf-tanker-in", to: "tf-uco6", stream: "tallow", label: "UCO in" },
        { from: "tf-uco6", to: "tf-uco-transfer", stream: "tallow", label: "at temperature" },
        { from: "tf-uco-transfer", to: "tf-uco3", stream: "tallow" },
        { from: "tf-uco3", to: "tf-tanker-out", stream: "tallow", label: "UCO out" },

        { from: "tf-t1", to: "tf-tanker-out", stream: "tallow", dashed: true },
        { from: "tf-t2", to: "tf-tanker-out", stream: "tallow", dashed: true },
        { from: "tf-t4", to: "tf-tanker-out", stream: "tallow", dashed: true },
        { from: "tf-t5", to: "tf-tanker-out", stream: "tallow", dashed: true }
      ]
    },

    /* ======================================================= */
    {
      id: "waste-heat",
      title: "Waste Heat",
      plant: "services",
      icon: "condenser",
      summary: "The vapour side. Dryer vapour goes through the air condensers and the two " +
               "evaporators, then the water cooling condenser. The whole thing runs under " +
               "slight suction, and what will not condense goes to the bio filters.",
      note: "Runs on pressure control \u2014 the screen was reading \u2212103 Pa.",
      to: ["bio-filters", "trade-waste"],
      nodes: [
        { id: "wh-d1ac", label: "Dryer 1 Air Condenser", type: "condenser",
          note: "Bank of fans (M60x)." },
        { id: "wh-d3ac", label: "Dryer 3 Air Condenser", type: "condenser" },
        { id: "wh-alfaevap", label: "Alfa Evaporator", type: "evaporator" },
        { id: "wh-alfaac", label: "Alfa Evap 1 Air Condenser", type: "condenser" },
        { id: "wh-atpevap", label: "ATP Evaporator", type: "evaporator" },
        { id: "wh-wcc", label: "Water Cooling Condenser", type: "condenser" },
        { id: "wh-gate", label: "Diverter Gate", type: "valve",
          alarms: ["Gate Failed To Close"] },
        { id: "wh-fan", label: "Extraction Fan", type: "fan",
          values: [
            { k: "Pressure", v: "\u2212103 Pa" },
            { k: "Slow mode enable", v: "4 Pa" },
            { k: "Differential set point", v: "3 Pa" }
          ] }
      ],
      edges: [
        { from: "wh-d1ac", to: "wh-wcc", stream: "vapour" },
        { from: "wh-d3ac", to: "wh-wcc", stream: "vapour" },
        { from: "wh-alfaevap", to: "wh-alfaac", stream: "vapour" },
        { from: "wh-alfaac", to: "wh-wcc", stream: "vapour" },
        { from: "wh-atpevap", to: "wh-wcc", stream: "vapour", dashed: true },
        { from: "wh-wcc", to: "wh-gate", stream: "vapour" },
        { from: "wh-gate", to: "wh-fan", stream: "vapour" }
      ]
    },

    /* ======================================================= */
    {
      id: "bio-filters",
      title: "Bio Filters",
      plant: "services",
      icon: "biofilter",
      summary: "Where the smell is treated. Two big variable speed fans pull from the " +
               "cookers and dryers through the filter beds, and the beds are kept damp by " +
               "sprays on a timer.",
      note: "A third bio filter shows on the Waste Heat screen \u2014 confirm how many you run.",
      to: [],
      nodes: [
        { id: "bf-spray", label: "Irrigation Sprays", type: "valve",
          values: [
            { k: "Spray times", v: "06:00, 09:00, 11:00, 14:00, 16:00" },
            { k: "Spray length", v: "set per filter, in minutes" }
          ] },
        { id: "bf1", label: "Bio Filter 1", type: "biofilter",
          values: [
            { k: "Amps", v: "149 A" },
            { k: "Fan speed", v: "1160 RPM, 40 Hz" },
            { k: "Temperature", v: "29.9 \u00B0C" },
            { k: "Pressure", v: "1383 Pa" }
          ] },
        { id: "bf2", label: "Bio Filter 2", type: "biofilter",
          values: [
            { k: "Amps", v: "160 A" },
            { k: "Fan speed", v: "1160 RPM, 40 Hz" },
            { k: "Temperature", v: "22.2 \u00B0C" },
            { k: "Pressure", v: "1331 Pa" }
          ] },
        { id: "bf3", label: "Bio Filter 3", type: "biofilter", guess: true }
      ],
      edges: [
        { from: "bf-spray", to: "bf1", stream: "water", dashed: true },
        { from: "bf-spray", to: "bf2", stream: "water", dashed: true },
        { from: "bf-spray", to: "bf3", stream: "water", dashed: true }
      ]
    },

    /* ======================================================= */
    {
      id: "contra-shear",
      title: "Contra Shear Room",
      plant: "services",
      icon: "contrashear",
      summary: "Where all the plant's waste water starts. Everything drains to the Main Pit, " +
               "two submersible pumps lift it up to the Contra Shear, and the screened water " +
               "drops into a collection tank. CP1M102 and CP1M103 then pump it across to " +
               "Tank 1 at the Trade Waste Plant.",
      note: "Read off the Contra-Shear screen on 7 Oct 2026. The screen itself has two " +
            "unlabelled \u201C?\u201D marks on the contra shear unit, so even the HMI does " +
            "not name those parts. I also do not know where the screenings go once the " +
            "contra shear has taken them out of the water \u2014 that is the main question " +
            "here.",
      to: ["trade-waste"],
      nodes: [
        { id: "cs-pit", label: "Main Pit", type: "pit",
          note: "The low point of the site. All the washdown and process water ends up here." },
        { id: "cs-pump1", label: "Pit Pump 1", type: "pump",
          note: "Submersible, sitting in the pit. Labelled just \u201CPump 1\u201D on the " +
                "screen, with no tag number." },
        { id: "cs-pump2", label: "Pit Pump 2", type: "pump",
          note: "Labelled \u201CPump2\u201D on the screen. Is it a duty/standby pair with " +
                "Pump 1, or do they both run?" },
        { id: "cs-level", label: "Pit Level Sensor", type: "valve", guess: true,
          note: "Drawn on the edge of the pit. I have assumed it is what starts and stops " +
                "the pumps." },
        { id: "cs-unit", label: "Contra Shear", type: "contrashear",
          note: "The rotating drum screen. This is the machine that takes the solids out of " +
                "the water before any chemical treatment." },
        { id: "cs-tank", label: "Contra Shear Collection Tank", type: "tank",
          values: [{ k: "Level (CTLT)", v: "361" }],
          note: "Sits under the contra shear and catches the screened water." },
        { id: "cs-cp1m102", tag: "CP1M102", label: "Transfer Pump", type: "pump" },
        { id: "cs-cp1m103", tag: "CP1M103", label: "Transfer Pump", type: "pump",
          note: "The screen marks the line out of these two \u201CTo Tank 1 Trade Waste " +
                "Plant\u201D, so this is the hand-over point." },
        { id: "cs-screenings", label: "Screenings Out", type: "bin", guess: true,
          note: "Nothing on the screen shows where the solids taken out by the contra shear " +
                "go. A bin? Back into the raw material? Please find out \u2014 if they go " +
                "back into the process that matters for species separation." }
      ],
      edges: [
        { from: "cs-level", to: "cs-pit", stream: "water", dashed: true },
        { from: "cs-pit", to: "cs-pump1", stream: "water" },
        { from: "cs-pit", to: "cs-pump2", stream: "water" },
        { from: "cs-pump1", to: "cs-unit", stream: "water" },
        { from: "cs-pump2", to: "cs-unit", stream: "water" },
        { from: "cs-unit", to: "cs-tank", stream: "water", label: "screened water" },
        { from: "cs-unit", to: "cs-screenings", stream: "meal", dashed: true, label: "solids" },
        { from: "cs-tank", to: "cs-cp1m102", stream: "water" },
        { from: "cs-tank", to: "cs-cp1m103", stream: "water" }
      ]
    },

    /* ======================================================= */
    {
      id: "trade-waste",
      title: "Trade Waste Plant",
      plant: "services",
      icon: "daf",
      summary: "Effluent treatment. Waste water comes off the Contra Shear into Tank 1, " +
               "where acid is dosed and a mixer keeps it stirred. P3 then pushes it through " +
               "the coagulant, polymer and caustic dosing points into the DAF. Treated water " +
               "goes up to Tanks 3 and 4, then out through P5 and P6 with the flow, " +
               "temperature and pH all measured on the way.",
      note: "Rebuilt from the TRADE WASTE TANKS screen on 7 Oct 2026. Two corrections: there " +
            "is only ONE DAF on this screen, not two, and the chemicals are now named \u2014 " +
            "DP1 acid, DP2 coagulant, DP3 polymer, DP4 caustic, DP7 and DP8 hydrogen " +
            "peroxide. The Contra Shear behind its own button is now drawn as its own area. " +
            "The one screen still missing is \u201CDaff\u201D, which is probably where the " +
            "saturators and the sludge/blood tank live \u2014 please photograph it.",
      to: ["blood-plant"],
      nodes: [
        /* ---- Tank 1 and acid dosing ---- */
        { id: "tw-t1", label: "Tank 1", type: "tank",
          values: [
            { k: "pH", v: "5.65 on an earlier photo" },
            { k: "Temperature", v: "36.4 \u00B0C on an earlier photo" }
          ],
          note: "The balance tank. Everything arrives here first, pumped over from the Contra " +
                "Shear Room by CP1M102 and CP1M103." },
        { id: "tw-sm1", tag: "SM1", label: "Tank 1 Mixer", type: "pump", guess: true,
          note: "Drawn on the side of Tank 1. I have assumed it is the mixer or agitator." },
        { id: "tw-rc1", tag: "RC1", label: "Tank 1 Recirculation", type: "pump", guess: true,
          note: "Sits at the bottom of Tank 1 next to P3. Purpose not clear." },
        { id: "tw-dp1", tag: "DP1", label: "Acid Dosing Pump", type: "dosingpump",
          note: "Marked \u201CAcid Pump\u201D on the screen. Doses into Tank 1." },

        /* ---- out of Tank 1, through the dosing ---- */
        { id: "tw-p3", tag: "P3", label: "DAF Feed Pump", type: "pump",
          values: [{ k: "Speed", v: "21 Hz on an earlier photo" }] },
        { id: "tw-v1", tag: "V1", label: "Feed Valve", type: "valve" },
        { id: "tw-ft1", tag: "FT1", label: "Feed Flow Meter", type: "valve",
          values: [{ k: "Flow", v: "20" }],
          note: "Not a machine, a measurement. Units not shown on the screen." },
        { id: "tw-dp2", tag: "DP2", label: "Coagulant Dosing Pump", type: "dosingpump",
          note: "Marked \u201CCoag\u201D on the screen. I had this one as unknown before." },
        { id: "tw-dp3", tag: "DP3", label: "Polymer Dosing Pump", type: "dosingpump",
          note: "Marked \u201CPolymar\u201D on the screen \u2014 polymer." },
        { id: "tw-dp4", tag: "DP4", label: "Caustic Dosing Pump", type: "dosingpump" },
        { id: "tw-ph2", tag: "PH2", label: "pH After Dosing", type: "valve",
          values: [{ k: "Reading", v: "0.06 \u2014 units unclear" }],
          note: "This reads 0.06, which cannot be a pH. Either it is a dosing rate or the " +
                "scaling is out. Worth asking, because the operator needs to know what good " +
                "looks like here." },

        /* ---- the DAF ---- */
        { id: "tw-daf", label: "DAF", type: "daf",
          values: [{ k: "pH after dosing", v: "6.48 on an earlier photo" }],
          note: "Only one DAF is drawn on this screen. I previously had two \u2014 if there " +
                "really are two, the second is probably on the Daff screen." },
        { id: "tw-dp8", tag: "DP8", label: "Peroxide Dosing Pump", type: "dosingpump",
          note: "Marked \u201CH2O2 Pump\u201D. Doses into the DAF line from below." },
        { id: "tw-p4", tag: "P4", label: "DAF Outlet Pump", type: "pump" },
        { id: "tw-dp7", tag: "DP7", label: "Peroxide Dosing Pump", type: "dosingpump",
          note: "The second \u201CH2O2 Pump\u201D, dosing up near V2." },
        { id: "tw-v2", tag: "V2", label: "Tank Selection Valve", type: "valve",
          note: "Sits above the DAF outlet and decides whether the water goes to Tank 3 or " +
                "Tank 4." },

        /* ---- the two holding tanks ---- */
        { id: "tw-t3", label: "Tank 3", type: "tank",
          values: [{ k: "Level", v: "3016" }, { k: "Vent valve", v: "SV3" }] },
        { id: "tw-t4", label: "Tank 4", type: "tank",
          values: [{ k: "Level", v: "362" }, { k: "Vent valve", v: "SV4" }],
          note: "Tank 3 was nearly full and Tank 4 nearly empty when you took the photo, so " +
                "they are probably filled and emptied one at a time. Confirm how that works." },

        /* ---- out of site ---- */
        { id: "tw-p5", tag: "P5", label: "Tank 3 Discharge Pump", type: "pump" },
        { id: "tw-v7", tag: "V7", label: "Tank 3 Discharge Valve", type: "valve" },
        { id: "tw-p6", tag: "P6", label: "Tank 4 Discharge Pump", type: "pump" },
        { id: "tw-v8", tag: "V8", label: "Tank 4 Discharge Valve", type: "valve" },
        { id: "tw-outfall", label: "Final Discharge", type: "valve",
          values: [
            { k: "Flow (FT2)", v: "13" },
            { k: "Temperature (TT3)", v: "394 as shown \u2014 probably 39.4 \u00B0C" },
            { k: "pH (PH3)", v: "6.55" }
          ],
          note: "The bottom line of the screen, heading off to the left. These three readings " +
                "are what leaves the site, so they are almost certainly the numbers your " +
                "licence is written around. Find out the limits." },

        /* ---- not on this screen, kept from before ---- */
        { id: "tw-t5", label: "Tank 5 \u2014 sludge and blood", type: "tank", guess: true,
          note: "Not on the Trade Waste Tanks screen. I noted it from an earlier photo, and " +
                "the blood plant has to get its blood from somewhere, so I have left it in. " +
                "Probably on the Daff screen." },
        { id: "tw-p2", tag: "P2", label: "Blood Transfer Pump", type: "pump", guess: true,
          note: "Same as Tank 5 \u2014 not on this screen. This is what feeds BT1 over in the " +
                "blood plant." }
      ],
      edges: [
        { from: "tw-dp1", to: "tw-t1", stream: "water", dashed: true, label: "acid" },
        { from: "tw-sm1", to: "tw-t1", stream: "water", dashed: true },
        { from: "tw-t1", to: "tw-rc1", stream: "water", dashed: true },
        { from: "tw-t1", to: "tw-p3", stream: "water" },
        { from: "tw-p3", to: "tw-v1", stream: "water" },
        { from: "tw-v1", to: "tw-ft1", stream: "water" },
        { from: "tw-ft1", to: "tw-daf", stream: "water" },
        { from: "tw-dp2", to: "tw-daf", stream: "water", dashed: true, label: "coagulant" },
        { from: "tw-dp3", to: "tw-daf", stream: "water", dashed: true, label: "polymer" },
        { from: "tw-dp4", to: "tw-daf", stream: "water", dashed: true, label: "caustic" },
        { from: "tw-ph2", to: "tw-daf", stream: "water", dashed: true },
        { from: "tw-dp8", to: "tw-daf", stream: "water", dashed: true, label: "peroxide" },
        { from: "tw-daf", to: "tw-p4", stream: "water" },
        { from: "tw-p4", to: "tw-v2", stream: "water" },
        { from: "tw-dp7", to: "tw-v2", stream: "water", dashed: true, label: "peroxide" },
        { from: "tw-v2", to: "tw-t3", stream: "water" },
        { from: "tw-v2", to: "tw-t4", stream: "water" },
        { from: "tw-t3", to: "tw-p5", stream: "water" },
        { from: "tw-p5", to: "tw-v7", stream: "water" },
        { from: "tw-v7", to: "tw-outfall", stream: "water" },
        { from: "tw-t4", to: "tw-p6", stream: "water" },
        { from: "tw-p6", to: "tw-v8", stream: "water" },
        { from: "tw-v8", to: "tw-outfall", stream: "water" },
        { from: "tw-daf", to: "tw-t5", stream: "water", dashed: true, label: "sludge" },
        { from: "tw-t5", to: "tw-p2", stream: "blood" }
      ]
    },

    /* ======================================================= */
    {
      id: "blood-plant",
      title: "Blood Plant",
      plant: "services",
      icon: "bloodplant",
      summary: "Blood collects in Blood Tank BT1, where steam keeps it warm. The Blood " +
               "Decanter Feed Pump sends it to the Alfa Blood Decanter, which splits it. " +
               "The solids go out on the BLM conveyor cascade and join the Dryer Infeed run, " +
               "so blood meal ends up in the same three dryers the meal uses. There is a CIP " +
               "flush with its own flush water valves for cleaning.",
      note: "Read off the Blood_Plant screen on 7 Oct 2026. The screen was showing " +
            "\u201CBlood To Dryer 2-3 Selected\u201D, \u201CCheck Boiler Low Pressure\u201D " +
            "and an active alarm \u201CV266 Fail To Close\u201D. What I am least sure of is the " +
            "order of the BLM conveyor cascade (BLM105 to BLM108) and what BT1G and BT1SCW " +
            "actually do \u2014 those need a walk-down. The M266 to M293 conveyors shown on the " +
            "right of that screen are not part of the blood plant; they are the shared Dryer " +
            "Infeed run, so they live in that area now.",
      to: ["dryer-infeed"],
      nodes: [
        /* ---- the blood tank and its services ---- */
        { id: "bp-bt1", tag: "BT1", label: "Blood Tank 1", type: "tank",
          note: "Tall tank on the right of the screen. Steam heated through BTSOV, with " +
                "flush water available for the CIP clean. The blood arriving here comes from " +
                "the Trade Waste plant, pumped over by P2 off Tank 5.",
          values: [{ k: "Level", v: "3492 (as shown on the screen)" }] },
        { id: "bp-bt1rp", tag: "BT1RP", label: "BT1 Recirculation Pump", type: "pump",
          note: "Sits on the right of BT1. I have drawn it as a recirculation loop back into " +
                "the tank, which is the usual arrangement for keeping blood moving so it does " +
                "not settle. Confirm that is what it does.",
          guess: true },
        { id: "bp-btsov", tag: "BTSOV", label: "Blood Tank Steam Valve", type: "valve",
          note: "Keeps the blood in BT1 warm." },
        { id: "bp-bt1g", tag: "BT1G", label: "BT1 Gate", type: "valve", guess: true,
          note: "Drawn at the bottom of BT1 next to BT1SCW. I do not know what it lets out \u2014 " +
                "settled solids, or the tank drain for the CIP flush. Needs a walk-down." },
        { id: "bp-bt1scw", tag: "BT1SCW", label: "BT1 Screw Conveyor", type: "screw", guess: true,
          note: "Sits under BT1G. Where it discharges to is not clear on the screen." },
        { id: "bp-ssov", tag: "SSOV", label: "Steam Shut Off Valve", type: "valve" },
        { id: "bp-spv", tag: "SPV", label: "Steam Pressure Valve", type: "valve",
          note: "The steam supply to the blood plant comes in here." },
        { id: "bp-ftwsov", tag: "FTWSOV", label: "Flush Water Shut Off Valve", type: "valve" },
        { id: "bp-ftwsv", tag: "FTWSV", label: "Flush Water Valve", type: "valve",
          note: "Part of the CIP Flush, which has its own button on the screen." },

        /* ---- feed to the decanter ---- */
        { id: "bp-bdfp", tag: "BDFP", label: "Blood Decanter Feed Pump", type: "pump",
          values: [
            { k: "Flow (BFM)", v: "3003" },
            { k: "Pressure (BPT)", v: "154" }
          ],
          note: "BFM is the flow meter and BPT the pressure transmitter on this line." },
        { id: "bp-dfsov", tag: "DFSOV", label: "Decanter Feed Shut Off Valve", type: "valve",
          values: [{ k: "Temperature", v: "752 as shown \u2014 probably 75.2 \u00B0C" }],
          note: "The red TEMPERATURE box sits under this valve. 752 with no decimal point is " +
                "almost certainly 75.2 \u00B0C, but please confirm the units." },
        { id: "bp-decanter", label: "Alfa Blood Decanter", type: "decanter",
          note: "Horizontal decanter with its own drive. Splits the blood into solids for the " +
                "dryers and liquid." },

        /* ---- solids out of the decanter ---- */
        { id: "bp-blm101", tag: "BLM101", label: "Decanter Outfeed Screw", type: "screw" },
        { id: "bp-blm102", tag: "BLM102", label: "Blood Meal Bin", type: "bin",
          note: "The yellow-labelled box under BLM101, with BLM103 and BLM104 working " +
                "underneath it." },
        { id: "bp-blm103", tag: "BLM103", label: "Bin Discharge Screw 1", type: "screw" },
        { id: "bp-blm104", tag: "BLM104", label: "Bin Discharge Screw 2", type: "screw" },
        { id: "bp-blm105", tag: "BLM105", label: "Blood Meal Conveyor", type: "screw",
          note: "This is the one carrying the \u201CBlood To Dryer 2-3 Selected\u201D note on " +
                "the screen, so the dryer choice is made around here." },
        { id: "bp-blm106", tag: "BLM106", label: "Blood Meal Conveyor", type: "screw" },
        { id: "bp-blm107", tag: "BLM107", label: "Blood Meal Conveyor", type: "screw" },
        { id: "bp-bsv107", tag: "BSV107", label: "Diverter Valve", type: "valve" },
        { id: "bp-blm108", tag: "BLM108", label: "Blood Meal Conveyor", type: "screw",
          note: "This is where the blood plant hands over. BLM108 discharges onto M267 in the " +
                "Dryer Infeed area, the same conveyor Line 1 and Line 2 feed." }
      ],
      edges: [
        /* services into the tank */
        { from: "bp-spv", to: "bp-ssov", stream: "steam" },
        { from: "bp-ssov", to: "bp-btsov", stream: "steam" },
        { from: "bp-btsov", to: "bp-bt1", stream: "steam", label: "heating" },
        { from: "bp-ftwsov", to: "bp-ftwsv", stream: "water" },
        { from: "bp-ftwsv", to: "bp-bt1", stream: "water", dashed: true, label: "CIP flush" },

        /* tank round to the decanter */
        { from: "bp-bt1", to: "bp-bt1rp", stream: "blood" },
        { from: "bp-bt1rp", to: "bp-bt1", stream: "blood", dashed: true, back: true,
          label: "recirculate" },
        { from: "bp-bt1", to: "bp-bt1g", stream: "blood", dashed: true },
        { from: "bp-bt1g", to: "bp-bt1scw", stream: "blood", dashed: true },
        { from: "bp-bt1", to: "bp-bdfp", stream: "blood" },
        { from: "bp-bdfp", to: "bp-dfsov", stream: "blood" },
        { from: "bp-dfsov", to: "bp-decanter", stream: "blood" },

        /* solids out */
        { from: "bp-decanter", to: "bp-blm101", stream: "meal", label: "solids" },
        { from: "bp-blm101", to: "bp-blm102", stream: "meal" },
        { from: "bp-blm102", to: "bp-blm103", stream: "meal" },
        { from: "bp-blm102", to: "bp-blm104", stream: "meal" },
        { from: "bp-blm103", to: "bp-blm105", stream: "meal" },
        { from: "bp-blm104", to: "bp-blm105", stream: "meal" },
        { from: "bp-blm105", to: "bp-blm106", stream: "meal" },
        { from: "bp-blm106", to: "bp-blm107", stream: "meal" },
        { from: "bp-blm107", to: "bp-bsv107", stream: "meal" },
        { from: "bp-bsv107", to: "bp-blm108", stream: "meal" }
      ]
    },

    /* ======================================================= */
    {
      id: "boilers",
      title: "Boilers & Steam",
      plant: "services",
      icon: "boiler",
      summary: "Two boilers supply steam to both cookers, the three dryers and the " +
               "evaporators. The two pressures sit on the main menu screen.",
      to: [],
      note: "The Blood Plant screen shows its steam header in kPa, so the two numbers on the " +
            "main menu are almost certainly kPa as well. That screen also carries a " +
            "\u201CCheck Boiler Low Pressure\u201D warning, so there is a low pressure limit " +
            "somewhere \u2014 worth finding out what it is set to.",
      nodes: [
        { id: "boiler1", label: "Boiler No.1", type: "boiler",
          values: [{ k: "Steam pressure", v: "520 kPa" }] },
        { id: "boiler2", label: "Boiler No.2", type: "boiler",
          values: [{ k: "Steam pressure", v: "500 kPa" }] },
        { id: "steam-header", label: "Steam Header", type: "valve", guess: true,
          values: [{ k: "Seen at the blood plant", v: "540 kPa" }],
          note: "Both boilers feed one header that supplies the cookers, the dryers, the " +
                "evaporators and the blood plant. Drawn from what the screens imply, not from " +
                "a screen of its own." }
      ],
      edges: [
        { from: "boiler1", to: "steam-header", stream: "steam" },
        { from: "boiler2", to: "steam-header", stream: "steam" }
      ]
    },

    /* ======================================================= */
    {
      id: "silos-milling",
      title: "Bins, Shakers & Mills",
      plant: "shared",
      icon: "silo",
      summary: "Dried meal lands in one of six bins, and each bin is a species. From the bins " +
               "it goes to the three shakers, then the four mills. After milling the product " +
               "splits by species: MBM goes into the silos, while ovine and bovine go " +
               "straight to bagging and never see a silo.",
      note: "Built from the SilosExitToMills and ShakersToSilos screens, then corrected by " +
            "you. Two things now settled. First the ORDER: the screen is literally called " +
            "ShakersToSilos and runs shakers at the top, mills in the middle, silos at the " +
            "bottom \u2014 so it is bin, then shaker, then mill, then silo. That question is " +
            "closed. Second, only MBM is stored in the silos; ovine and bovine go direct to " +
            "bagging. This all runs on a SECOND, older control system with its own " +
            "DRYERS / MILLING / LOAD-OUT menu, dated 2023 at 192.168.1.233. The conveyor M " +
            "numbers on those screens were too small to read, so routing blocks stand in for " +
            "them. What I still do not know is which of the six bins holds the MBM.",
      to: ["meal-bagging"],
      nodes: [
        /* ---- the six species bins ---- */
        { id: "sm-bin1", tag: "BIN No.1", label: "BOVINE-1", type: "bin",
          values: [{ k: "Level", v: "46.7 %" }],
          note: "The beef bin. The dryer outfeed screen was showing \u201CBEEF NOW\u201D " +
                "against Dryer 1, feeding Bin 1 on Line 1." },
        { id: "sm-bin2", tag: "BIN No.2", label: "OVINE-2", type: "bin",
          values: [{ k: "Level", v: "54.9 %" }],
          note: "The ovine bin \u2014 the Plant 1 product." },
        { id: "sm-bin3", tag: "BIN No.3", label: "BUFFER-3", type: "bin",
          values: [{ k: "Level", v: "34.8 %" }],
          note: "Named BUFFER rather than a species, so this is probably the spare or " +
                "overflow bin. What is it actually used for?" },
        { id: "sm-bin4", tag: "BIN No.4", label: "CHICKEN-4 (not used)", type: "bin",
          values: [{ k: "Level", v: "0.1 % \u2014 effectively empty" },
                   { k: "Status", v: "No longer used \u2014 chicken is not processed now" }],
          note: "You have told me chicken is no longer run, so this bin is out of use even " +
                "though the screens still say CHICKEN and POULTRY in several places. Those " +
                "labels are left over. Worth asking whether the bin has been reused for " +
                "something else, or whether the screens should be relabelled \u2014 a stale " +
                "species label on a live screen is exactly the kind of thing that causes a " +
                "mix-up." },
        { id: "sm-bin5", tag: "BIN No.5", label: "WOOL-5", type: "bin",
          note: "Labelled WOOL. I do not know what that product is \u2014 please explain, " +
                "because it is not something you have mentioned before." },
        { id: "sm-bin6", tag: "BIN No.6", label: "WOOL-6", type: "bin",
          note: "The second WOOL bin. Why two?" },

        /* ---- routing ---- */
        { id: "sm-route", label: "Bin Discharge Routing", type: "valve", guess: true,
          values: [
            { k: "Seen on the screen", v: "Bin 4 \u2192 Shaker 3" },
            { k: "", v: "Bin 3 \u2192 Shaker 1" },
            { k: "", v: "Bin 1 \u2192 Shakers 1 and 2" },
            { k: "Also showing", v: "\u201CGoing to Silo No.1\u201D" }
          ],
          note: "Not one machine \u2014 this stands for the conveyor network under the bins. " +
                "The screen showed three different bins feeding three different shakers at " +
                "the same time, so any bin can clearly reach any shaker. The actual conveyors " +
                "need a closer photo." },

        /* ---- three shakers ---- */
        { id: "sm-shaker1", label: "Shaker 1", type: "shaker" },
        { id: "sm-shaker2", label: "Shaker 2", type: "shaker" },
        { id: "sm-shaker3", label: "Shaker 3", type: "shaker" },

        /* ---- four mills ---- */
        { id: "sm-millroute", label: "Mill Feed Routing", type: "valve", guess: true,
          note: "Same again \u2014 the conveyors between the shakers and the mills." },
        { id: "sm-mill1", label: "Mill 1", type: "mill",
          values: [{ k: "Amps", v: "0 A \u2014 stopped on both photos" }],
          note: "Stopped both times I have seen the screen. Is it a spare, or out of service?" },
        { id: "sm-mill2", label: "Mill 2", type: "mill",
          values: [{ k: "Amps", v: "29 \u2013 34 A \u2014 running" }] },
        { id: "sm-mill3", label: "Mill 3", type: "mill",
          values: [{ k: "Amps", v: "0 A \u2014 stopped on both photos" }],
          note: "Stopped both times. Spare, or out of service?" },
        { id: "sm-mill4", label: "Mill 4", type: "mill",
          values: [{ k: "Amps", v: "70 \u2013 80 A \u2014 running hard" }],
          note: "On two different photos Mill 4 read 70 A and 80 A while Mill 2 sat on " +
                "29 \u2013 34 A, and Mills 1 and 3 were stopped both times. So Mill 4 looks " +
                "like the workhorse. What is the normal range, and what is too high?" },

        /* ---- silos ---- */
        /* ---- after the mills the product splits by species ---- */
        { id: "sm-productroute", label: "Product Routing \u2014 Silo or Bagging", type: "valve",
          guess: true,
          values: [
            { k: "MBM", v: "to the silos" },
            { k: "Ovine and bovine", v: "straight to bagging, no silo" }
          ],
          note: "This is the split you corrected me on. Only MBM is stored in a silo; ovine " +
                "and bovine go direct to bagging. The conveyors that actually do the " +
                "switching are in the unreadable middle of the milling screen, so this block " +
                "stands in for them. How is the choice made \u2014 a diverter valve, or a " +
                "different conveyor route?" },

        /* ---- three silos, MBM only ---- */
        { id: "sm-silo1", label: "Silo 1", type: "silo",
          values: [{ k: "Level", v: "51.0 %" }],
          note: "MBM only." },
        { id: "sm-silo2", label: "Silo 2", type: "silo",
          values: [{ k: "Level", v: "44.3 %" }],
          note: "MBM only." },
        { id: "sm-silo3", label: "Silo 3", type: "silo",
          values: [
            { k: "Level", v: "82.4 %, and 92.4 % on the load-out screen" },
            { k: "Automatic cut-out", v: "feed stops at 90 %, restarts below 90 %" }
          ],
          note: "The ShakersToSilos screen carries a note in red: \u201CFeed to Silo No.3 " +
                "will stop at 90 % and restart below 90 %\u201D. So Silo 3 fills itself and " +
                "holds off automatically. All three silos are in use \u2014 I had been told " +
                "earlier that only two were, so that has changed or I misheard." }
      ],
      edges: [
        { from: "sm-bin1", to: "sm-route", stream: "meal" },
        { from: "sm-bin2", to: "sm-route", stream: "meal" },
        { from: "sm-bin3", to: "sm-route", stream: "meal" },
        { from: "sm-bin4", to: "sm-route", stream: "meal" },
        { from: "sm-bin5", to: "sm-route", stream: "meal" },
        { from: "sm-bin6", to: "sm-route", stream: "meal" },

        { from: "sm-route", to: "sm-shaker1", stream: "meal" },
        { from: "sm-route", to: "sm-shaker2", stream: "meal" },
        { from: "sm-route", to: "sm-shaker3", stream: "meal" },

        { from: "sm-shaker1", to: "sm-millroute", stream: "meal" },
        { from: "sm-shaker2", to: "sm-millroute", stream: "meal" },
        { from: "sm-shaker3", to: "sm-millroute", stream: "meal" },

        { from: "sm-millroute", to: "sm-mill1", stream: "meal" },
        { from: "sm-millroute", to: "sm-mill2", stream: "meal" },
        { from: "sm-millroute", to: "sm-mill3", stream: "meal" },
        { from: "sm-millroute", to: "sm-mill4", stream: "meal" },

        { from: "sm-mill1", to: "sm-productroute", stream: "meal" },
        { from: "sm-mill2", to: "sm-productroute", stream: "meal" },
        { from: "sm-mill3", to: "sm-productroute", stream: "meal" },
        { from: "sm-mill4", to: "sm-productroute", stream: "meal" },

        { from: "sm-productroute", to: "sm-silo1", stream: "meal", label: "MBM" },
        { from: "sm-productroute", to: "sm-silo2", stream: "meal" },
        { from: "sm-productroute", to: "sm-silo3", stream: "meal" }
      ]
    },

    /* ======================================================= */
    {
      id: "meal-bagging",
      title: "Load-Out & Bagging",
      plant: "shared",
      icon: "bagging",
      summary: "Two ways product leaves the site. MBM comes out of a silo into a shipping " +
               "container, with the operator working through a container inspection " +
               "checklist on screen before loading starts. Ovine and bovine skip the silos " +
               "and go straight to bagging.",
      note: "Built from the LOAD-OUT screen on the older control system. The operator picks " +
            "a silo and a container, and the screen shows the tonnes and the product being " +
            "loaded, with Start, Auto Stop and Quick Stop buttons for the silo outfeed. The " +
            "screen was reading \u201CSilo 3: load-out to a container\u201D, Container 2 " +
            "selected, 21.0 tonnes. Note the product said POULTRY, which you have told me is " +
            "no longer run, so either that photo is old or the label is stale. There is an " +
            "eight-point container check built into the screen \u2014 I have written it up as " +
            "its own procedure under Support jobs.",
      to: [],
      nodes: [
        { id: "mb-silo-sel", label: "Silo Selection", type: "valve",
          values: [
            { k: "When photographed", v: "Silo 3 selected" },
            { k: "Controls", v: "Start silo outfeed, Auto Stop, Quick Stop" }
          ],
          note: "The operator chooses which silo empties. What is the difference between " +
                "Auto Stop and Quick Stop?" },
        { id: "mb-silo-out", label: "Silo Outfeed", type: "screw",
          note: "Carries the MBM from the selected silo down to the container." },
        { id: "mb-container-sel", label: "Container Selection", type: "valve",
          values: [
            { k: "When photographed", v: "Container 2 selected" },
            { k: "Load shown", v: "21.0 tonnes" }
          ],
          note: "The screen also had a red warning about a finish-down conveyor not being in " +
                "use. I could not read it properly \u2014 what does that message say?" },
        { id: "mb-check", label: "Container Inspection Checklist", type: "metaldetector",
          values: [{ k: "Checks", v: "8, each signed off on screen" }],
          note: "Eight checks the operator ticks off on the screen before loading: correct " +
                "container, correct seal, seal damage, floor condition, foreign bodies, swept " +
                "out, labelling, and one more I could not read. Written up as the Container " +
                "Load-Out procedure." },
        { id: "mb-container", label: "Shipping Container", type: "bagging",
          note: "Loaded by tipper truck and forklift, going by the picture on the screen." },
        { id: "mb-bag", label: "Bagging Line", type: "bagging", guess: true,
          note: "Where ovine and bovine go instead of a silo. Not on any screen I have seen " +
                "yet \u2014 is bagging controlled from a panel, or is it all manual?" },
        { id: "mb-mag", label: "Magnet / Metal Check", type: "metaldetector", guess: true,
          note: "Is there a magnet or metal detector before the bagger or the container? " +
                "Normally this is the last chance to catch metal before it reaches a customer." },
        { id: "mb-weigh", label: "Weighbridge", type: "valve", guess: true,
          note: "The screen shows tonnes against the load, so something is weighing it. Is " +
                "that a weighbridge, or load cells on the silo?" }
      ],
      edges: [
        { from: "mb-silo-sel", to: "mb-silo-out", stream: "meal" },
        { from: "mb-check", to: "mb-container-sel", stream: "meal", dashed: true,
          label: "must pass first" },
        { from: "mb-container-sel", to: "mb-container", stream: "meal" },
        { from: "mb-silo-out", to: "mb-mag", stream: "meal", dashed: true },
        { from: "mb-mag", to: "mb-container", stream: "meal", label: "MBM" },
        { from: "mb-mag", to: "mb-bag", stream: "meal", label: "ovine / bovine" },
        { from: "mb-container", to: "mb-weigh", stream: "meal", dashed: true },
        { from: "mb-bag", to: "mb-weigh", stream: "meal", dashed: true }
      ]
    }

  ]
};
