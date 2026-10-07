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
        { id: "m169", tag: "M169", label: "Buffer Tank", type: "tank", guess: true,
          note: "M numbers are motors, so M169 is probably the pump or stirrer on a small tank " +
                "that sits before the decanter feed. Confirm what it drives." },
        { id: "dec1-feed", label: "Decanter Infeed Feed Pump", type: "pump",
          values: [{ k: "Feed speed", v: "shown in RPM on the screen" }] },
        { id: "dec1", tag: "PLANT 1", label: "Plant 1 Decanter", type: "decanter",
          values: [
            { k: "Bowl", v: "3443 RPM" },
            { k: "Scroll", v: "2442 RPM" },
            { k: "Torque", v: "42 \u2013 45 bar" },
            { k: "Temperature", v: "48.2 \u00B0C" }
          ] },
        { id: "m174", tag: "M174", label: "Decanter Outfeed Screw", type: "screw" },
        { id: "ovine-screw", tag: "M190 \u2013 M193", label: "Ovine Vertical Screw", type: "screw" },
        { id: "p175", tag: "P175", label: "Liquid Pump", type: "pump" },
        { id: "m176", tag: "M176", label: "Vibrating Screen", type: "shaker" },
        { id: "wv177", tag: "WV177", label: "Transfer Valve", type: "valve",
          note: "Has a high level switch (177 HL)." },
        { id: "p177", tag: "P177", label: "Tallow Transfer Pump", type: "pump" }
      ],
      edges: [
        { from: "cooker1", to: "c1-outpump", stream: "raw", label: "cooked" },
        { from: "c1-outpump", to: "m169", stream: "raw" },
        { from: "m169", to: "dec1-feed", stream: "raw" },
        { from: "dec1-feed", to: "dec1", stream: "raw" },
        { from: "dec1", to: "m174", stream: "meal", label: "solids" },
        { from: "m174", to: "ovine-screw", stream: "meal" },
        { from: "dec1", to: "p175", stream: "tallow", label: "liquid" },
        { from: "p175", to: "m176", stream: "tallow" },
        { from: "m176", to: "wv177", stream: "tallow" },
        { from: "wv177", to: "p177", stream: "tallow" }
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
          note: "M258 and M259 also show up on my Dryer Infeed page. One of the two is wrong \u2014 " +
                "check where these motors really are." },
        { id: "tsp", tag: "M262", label: "Twin Screw Press", type: "press",
          values: [
            { k: "Drive", v: "45 Hz" },
            { k: "Second drive", v: "24 Hz" },
            { k: "Load", v: "44 %" }
          ] },
        { id: "m263", tag: "M263", label: "Meal Infeed Screw", type: "screw" },
        { id: "m264", tag: "M264", label: "Meal Outfeed Screw", type: "screw" },
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
      summary: "The routing area. Both plants feed in here and the operator picks which " +
               "dryers to use \u2014 Line 1 can take Dryer 1 or 2, Line 2 can take Dryer 1, 2 or 3, " +
               "or two at once.",
      note: "The screen was showing \u201CDryer 2 & 3 Selected\u201D. The dryers are a shared pool, " +
            "not fixed to a plant.",
      to: ["dryers"],
      nodes: [
        { id: "di-m253", tag: "M253", label: "Outfeed Screw", type: "screw" },
        { id: "di-m254", tag: "M254", label: "Vertical Screw", type: "screw" },
        { id: "di-m256", tag: "M256", label: "Distribution Screw", type: "screw", guess: true },
        { id: "di-m258", tag: "M258", label: "Dryer 1 Infeed Screw", type: "screw", guess: true,
          note: "M258 also shows up on my Plant 2 Cooker page. One of the two is wrong." },
        { id: "di-m259", tag: "M259", label: "Dryer 2 Infeed Screw", type: "screw", guess: true,
          note: "M259 also shows up on my Plant 2 Cooker page. One of the two is wrong." },
        { id: "di-m260", tag: "M260", label: "Dryer 3 Infeed Screw", type: "screw", guess: true }
      ],
      edges: [
        { from: "di-m253", to: "di-m254", stream: "meal" },
        { from: "di-m254", to: "di-m256", stream: "meal" },
        { from: "di-m256", to: "di-m258", stream: "meal" },
        { from: "di-m256", to: "di-m259", stream: "meal" },
        { from: "di-m256", to: "di-m260", stream: "meal" }
      ]
    },

    /* ======================================================= */
    {
      id: "dryers",
      title: "Dryers",
      plant: "shared",
      icon: "dryer",
      summary: "Three dryers, shared between both plants. Each has its own steam valve, " +
               "chamber and exit temperatures, and amps.",
      note: "These numbers came straight off your screens. They are what \u201Cnormal\u201D looks like.",
      to: ["dryer-outfeed", "waste-heat"],
      nodes: [
        { id: "dryer1", tag: "Dryer 1", label: "Dryer 1", type: "dryer",
          values: [
            { k: "Amps", v: "76 \u2013 93 A" },
            { k: "Exit temp", v: "95.5 \u2013 97 \u00B0C" },
            { k: "Chamber temp", v: "108 \u2013 110.6 \u00B0C" },
            { k: "Steam", v: "100 % steam valve, press to toggle" }
          ],
          alarms: ["Dryer 1 Exit Temperature Low"] },
        { id: "dryer2", tag: "Dryer 2", label: "Dryer 2", type: "dryer",
          values: [
            { k: "Amps", v: "82 \u2013 83 A" },
            { k: "Exit temp", v: "99 \u2013 104 \u00B0C" },
            { k: "Chamber temp", v: "111 \u2013 113.1 \u00B0C" }
          ] },
        { id: "dryer3", tag: "Dryer 3", label: "Dryer 3", type: "dryer",
          values: [
            { k: "Amps", v: "86 \u2013 97 A" },
            { k: "Exit temp", v: "96.9 \u2013 105 \u00B0C" },
            { k: "Chamber temp", v: "102 \u2013 111 \u00B0C" }
          ] }
      ],
      edges: []
    },

    /* ======================================================= */
    {
      id: "dryer-outfeed",
      title: "Dryer Outfeed",
      plant: "shared",
      icon: "screw",
      summary: "Dried meal off the three dryers, through the diverter valves and the screw " +
               "network, on its way to the silos and milling.",
      note: "A lot of screws on this screen. I have put in the main ones \u2014 tell me which " +
            "others matter.",
      to: ["silos-milling"],
      nodes: [
        { id: "do-m265", tag: "M265", label: "Dryer 1 Outfeed Screw", type: "screw" },
        { id: "do-m271", tag: "M271", label: "Dryer 2 Outfeed Screw", type: "screw" },
        { id: "do-m273", tag: "M273", label: "Dryer 3 Outfeed Screw", type: "screw" },
        { id: "do-m279", tag: "M279", label: "Collecting Screw", type: "screw" },
        { id: "do-m281", tag: "M281", label: "Collecting Screw", type: "screw" },
        { id: "do-vn52", tag: "VN52", label: "Diverter Valve", type: "valve",
          alarms: ["VN52 Fail To Close"] },
        { id: "do-vn57", tag: "VN57", label: "Diverter Valve", type: "valve",
          alarms: ["VN57 Fail To Close"] },
        { id: "do-m301", tag: "M301", label: "Transfer Screw", type: "screw" },
        { id: "do-m311", tag: "M311", label: "Transfer Screw", type: "screw" },
        { id: "do-fan", label: "Ventilation Fan", type: "fan",
          note: "Toggled from the Dryer Outfeed screen." }
      ],
      edges: [
        { from: "do-m265", to: "do-m279", stream: "meal" },
        { from: "do-m271", to: "do-m279", stream: "meal" },
        { from: "do-m273", to: "do-m281", stream: "meal" },
        { from: "do-m279", to: "do-vn52", stream: "meal" },
        { from: "do-vn52", to: "do-m301", stream: "meal" },
        { from: "do-m281", to: "do-vn57", stream: "meal" },
        { from: "do-vn57", to: "do-m311", stream: "meal" }
      ]
    },

    /* ======================================================= */
    {
      id: "liquid-phase",
      title: "Liquid Phase",
      plant: "shared",
      icon: "decanter",
      summary: "Where all the liquid from both plants collects. Buffer tank, the Alfa and " +
               "Plant 2 decanters, screens, and the tallow feed tanks. Water goes off to " +
               "Trade Waste.",
      note: "This is the area I am least sure about. The plumbing here is my reading of the " +
            "screen \u2014 please go through it with me.",
      to: ["separators", "trade-waste"],
      nodes: [
        { id: "lp-buffer", label: "Tallow Buffer Tank", type: "tank",
          values: [{ k: "Temperature", v: "76.8 \u00B0C" }, { k: "Level", v: "1.9" }] },
        { id: "lp-p200", tag: "P200", label: "Product Pump", type: "pump" },
        { id: "lp-alfa", label: "Alfa Decanter", type: "decanter" },
        { id: "lp-dec2", tag: "PLANT 2 / M201", label: "Plant 2 Decanter", type: "decanter",
          alarms: ["Back Drive Tripped (M201BD)"] },
        { id: "lp-screen", label: "Vibrating Screen", type: "shaker", guess: true },
        { id: "lp-p257", tag: "P257", label: "Transfer Pump", type: "pump" },
        { id: "lp-lq3a", tag: "LQ 3", label: "Tallow Feed Tank A", type: "tank" },
        { id: "lp-lq3b", tag: "LQ 3", label: "Tallow Feed Tank B", type: "tank" },
        { id: "lp-t1", label: "Plant 1 Liquid Phase Tank", type: "tank" },
        { id: "lp-t2", label: "Plant 2 Liquid Phase Tank", type: "tank" },
        { id: "lp-psw205", tag: "PSW205", label: "Stick Water to Trade Waste", type: "pump" }
      ],
      edges: [
        { from: "lp-buffer", to: "lp-p200", stream: "tallow" },
        { from: "lp-p200", to: "lp-alfa", stream: "tallow" },
        { from: "lp-alfa", to: "lp-dec2", stream: "tallow", dashed: true },
        { from: "lp-dec2", to: "lp-screen", stream: "tallow" },
        { from: "lp-screen", to: "lp-p257", stream: "tallow" },
        { from: "lp-p257", to: "lp-lq3b", stream: "tallow" },
        { from: "lp-lq3a", to: "lp-t1", stream: "tallow" },
        { from: "lp-lq3b", to: "lp-t2", stream: "tallow" },
        { from: "lp-dec2", to: "lp-psw205", stream: "water", label: "stick water" }
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
          values: [{ k: "Level", v: "2.5 %" }, { k: "Temperature", v: "56.6 \u00B0C" }] },
        { id: "tt2", label: "Tallow Transfer Tank 2", type: "tank",
          values: [{ k: "Level", v: "41.5 %" }, { k: "Temperature", v: "59.0 \u00B0C" }] },
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
      summary: "The outside tank farm and tanker loadout.",
      note: "I still do not know how the UCO tanks connect, so nothing is drawn to them.",
      to: [],
      nodes: [
        { id: "tf1", label: "Tallow Tank 1", type: "tank" },
        { id: "tf2", label: "Tallow Tank 2", type: "tank" },
        { id: "tf3", label: "Tallow Tank 3", type: "tank" },
        { id: "tf4", label: "Tallow Tank 4", type: "tank" },
        { id: "uco1", label: "UCO Tank 1", type: "tank", guess: true },
        { id: "uco2", label: "UCO Tank 2", type: "tank", guess: true },
        { id: "tf-load", label: "Tanker Loadout", type: "pump", guess: true }
      ],
      edges: [
        { from: "tf1", to: "tf-load", stream: "tallow" },
        { from: "tf2", to: "tf-load", stream: "tallow" },
        { from: "tf3", to: "tf-load", stream: "tallow" },
        { from: "tf4", to: "tf-load", stream: "tallow" }
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
      id: "trade-waste",
      title: "Trade Waste Plant",
      plant: "services",
      icon: "daf",
      summary: "Effluent treatment. The Contra Shear screens the solids out first, then the " +
               "water is dosed with chemicals and goes through two DAF units before it " +
               "leaves site. Sludge and blood go to the Blood Plant.",
      to: ["blood-plant"],
      nodes: [
        { id: "tw-cs", label: "Contra Shear", type: "contrashear",
          note: "Screens solids out of the effluent before Tank 1. On the water side, not the raw side." },
        { id: "tw-t1", label: "Tank 1", type: "tank",
          values: [{ k: "pH", v: "5.65" }, { k: "Temperature", v: "36.4 \u00B0C" }] },
        { id: "tw-dp1", tag: "DP1", label: "Acid Dosing", type: "dosingpump" },
        { id: "tw-dp2", tag: "DP2", label: "Dosing Pump 2", type: "dosingpump", guess: true },
        { id: "tw-dp3", tag: "DP3", label: "Polymer Dosing", type: "dosingpump" },
        { id: "tw-dp4", tag: "DP4", label: "Caustic Dosing", type: "dosingpump" },
        { id: "tw-dp5", tag: "DP5", label: "Peroxide Dosing", type: "dosingpump" },
        { id: "tw-p3", tag: "P3", label: "Transfer Pump", type: "pump",
          values: [{ k: "Speed", v: "21 Hz" }] },
        { id: "tw-sat1", label: "Saturator 1", type: "saturator",
          values: [{ k: "Cycle on delay", v: "81 secs" }] },
        { id: "tw-sat2", label: "Saturator 2", type: "saturator",
          values: [{ k: "Cycle on delay", v: "81 secs" }] },
        { id: "tw-daf1", label: "DAF 1", type: "daf",
          values: [{ k: "pH after dosing", v: "6.48" }] },
        { id: "tw-daf2", label: "DAF 2", type: "daf" },
        { id: "tw-t3", label: "Tank 3", type: "tank" },
        { id: "tw-t4", label: "Tank 4", type: "tank" },
        { id: "tw-t5", label: "Tank 5", type: "tank", note: "Sludge and blood." },
        { id: "tw-p2", tag: "P2", label: "Blood Transfer Pump", type: "pump" },
        { id: "tw-hot", label: "Hot Water Recovery", type: "valve", guess: true },
        { id: "tw-sewer", label: "To Sewer", type: "valve" }
      ],
      edges: [
        { from: "tw-cs", to: "tw-t1", stream: "water" },
        { from: "tw-t1", to: "tw-p3", stream: "water" },
        { from: "tw-dp1", to: "tw-p3", stream: "water", dashed: true },
        { from: "tw-dp2", to: "tw-p3", stream: "water", dashed: true },
        { from: "tw-dp3", to: "tw-p3", stream: "water", dashed: true },
        { from: "tw-dp4", to: "tw-p3", stream: "water", dashed: true },
        { from: "tw-dp5", to: "tw-p3", stream: "water", dashed: true },
        { from: "tw-p3", to: "tw-daf1", stream: "water" },
        { from: "tw-p3", to: "tw-daf2", stream: "water" },
        { from: "tw-sat1", to: "tw-daf1", stream: "water", dashed: true, label: "air" },
        { from: "tw-sat2", to: "tw-daf2", stream: "water", dashed: true, label: "air" },
        { from: "tw-daf1", to: "tw-t3", stream: "water" },
        { from: "tw-daf2", to: "tw-t4", stream: "water" },
        { from: "tw-daf1", to: "tw-t5", stream: "water", dashed: true, label: "sludge" },
        { from: "tw-daf2", to: "tw-t5", stream: "water", dashed: true },
        { from: "tw-t5", to: "tw-p2", stream: "water" },
        { from: "tw-t3", to: "tw-sewer", stream: "water" },
        { from: "tw-t4", to: "tw-sewer", stream: "water" },
        { from: "tw-t3", to: "tw-hot", stream: "water", dashed: true }
      ]
    },

    /* ======================================================= */
    {
      id: "blood-plant",
      title: "Blood Plant",
      plant: "services",
      icon: "bloodplant",
      summary: "Processes the blood and sludge from the Trade Waste plant.",
      note: "This tile was showing red on your menu screen. I do not know yet whether that " +
            "means stopped or in alarm, or what the plant actually produces.",
      to: [],
      nodes: [
        { id: "bp1", label: "Blood Plant", type: "bloodplant", guess: true }
      ],
      edges: []
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
      nodes: [
        { id: "boiler1", label: "Boiler No.1", type: "boiler",
          values: [{ k: "Steam pressure", v: "520" }] },
        { id: "boiler2", label: "Boiler No.2", type: "boiler",
          values: [{ k: "Steam pressure", v: "500" }] }
      ],
      edges: []
    },

    /* ======================================================= */
    {
      id: "silos-milling",
      title: "Silos & Milling",
      plant: "shared",
      icon: "silo",
      pending: true,
      summary: "Finished meal screening, milling and storage.",
      note: "Waiting on your photos of this area. Everything here is a placeholder from what " +
            "you told me earlier.",
      to: ["meal-bagging"],
      nodes: [
        { id: "sm-shaker", label: "Shaker", type: "shaker", guess: true,
          note: "How many shakers? Still to confirm." },
        { id: "sm-mill", label: "Mill", type: "mill", guess: true,
          note: "How many mills? Still to confirm." },
        { id: "sm-silo1", label: "Silo 1", type: "silo" },
        { id: "sm-silo2", label: "Silo 2", type: "silo" },
        { id: "sm-silo3", label: "Silo 3 (idle)", type: "silo",
          note: "Not in use at the moment." }
      ],
      edges: [
        { from: "sm-shaker", to: "sm-mill", stream: "meal", label: "oversize" },
        { from: "sm-mill", to: "sm-shaker", stream: "meal", dashed: true, back: true,
          label: "back to screen" },
        { from: "sm-shaker", to: "sm-silo1", stream: "meal", label: "fines" },
        { from: "sm-shaker", to: "sm-silo2", stream: "meal" },
        { from: "sm-shaker", to: "sm-silo3", stream: "meal", dashed: true }
      ]
    },

    /* ======================================================= */
    {
      id: "meal-bagging",
      title: "Meal Bagging",
      plant: "shared",
      icon: "bagging",
      pending: true,
      summary: "Bagging and bulk loadout of the finished meal.",
      note: "No photo of this screen yet.",
      to: [],
      nodes: [
        { id: "mb-mag", label: "Magnet / Metal Check", type: "metaldetector", guess: true },
        { id: "mb-bag", label: "Bagging Line", type: "bagging", guess: true }
      ],
      edges: [
        { from: "mb-mag", to: "mb-bag", stream: "meal" }
      ]
    }

  ]
};
