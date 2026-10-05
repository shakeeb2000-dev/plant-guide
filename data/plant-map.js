/* =============================================================
   PLANT MAP
   The machines, where they sit on the map, and what flows where.
   -------------------------------------------------------------
   FIRST DRAFT — built from your equipment list and your description
   of the two lines. Anything marked  guess: true  is me filling in a
   gap, so check those first.

   To move a machine: change its x and y. x goes left to right,
   y goes top to bottom. The canvas is 1640 wide and 1000 tall.
   To change an arrow: edit the edges list at the bottom.
   ============================================================= */

window.PLANT_MAP = {

  canvas: { width: 1640, height: 880 },

  /* Colours and labels for each part of the plant */
  lines: {
    ovine:   { label: "Ovine line",      fill: "#e7f5ee", stroke: "#1f6f4a", text: "#17563a" },
    mbm:     { label: "MBM / mixed line", fill: "#e8eefc", stroke: "#1d4ed8", text: "#1e3a8a" },
    tallow:  { label: "Tallow (shared)",  fill: "#fff6e6", stroke: "#b45309", text: "#7c4a02" },
    utility: { label: "Services",         fill: "#eef1f0", stroke: "#5a6b63", text: "#16211c" }
  },

  streams: {
    solids: { label: "Raw material / solids", color: "#1f6f4a" },
    meal:   { label: "Meal",                  color: "#166534" },
    tallow: { label: "Tallow / fat",          color: "#b45309" },
    water:  { label: "Water / effluent",      color: "#1d4ed8" },
    steam:  { label: "Steam",                 color: "#b3261e" }
  },

  /* ---------------------------------------------------------- */
  nodes: [

    /* ---------- OVINE LINE ---------- */
    { id: "pit-ovine", label: "Ovine Pit", type: "pit", line: "ovine", x: 80, y: 120,
      whatItDoes: "Where ovine raw material is tipped. Kept separate from everything else.",
      faults: ["foreign-body"] },

    { id: "shred-1", label: "Pre-shredder 1", type: "shredder", line: "ovine", x: 225, y: 120,
      whatItDoes: "Breaks the ovine raw material down to an even size so it cooks evenly.",
      faults: ["mill-trip"] },

    { id: "md-1", label: "Metal Detector 1", type: "metaldetector", line: "ovine", x: 370, y: 120,
      whatItDoes: "Catches metal before it reaches the cooker.",
      faults: ["foreign-body"] },

    { id: "cooker-1", label: "Cooker 1", type: "cooker", line: "ovine", x: 515, y: 120,
      whatItDoes: "Cooks ovine material only. This is the sterilisation step.",
      faults: ["cooker-temp", "steam-low"] },

    { id: "decanter-1", label: "Decanter 1", type: "decanter", line: "ovine", x: 660, y: 120,
      whatItDoes: "Splits the cooked ovine material: solids go on to the dryer, fat and water go to the separators.",
      faults: ["tallow-quality"] },

    { id: "dryer-1", label: "Dryer 1", type: "dryer", line: "ovine", x: 815, y: 120,
      whatItDoes: "Dries the ovine solids down to the moisture the meal spec needs.",
      faults: ["meal-wet"] },

    { id: "bin-1", label: "Bin — Ovine Dried", type: "bin", line: "ovine", x: 955, y: 120, guess: true,
      whatItDoes: "Holds dried ovine solids before screening and milling.", faults: [] },

    { id: "shaker-1", label: "Shaker 1", type: "shaker", line: "ovine", x: 1090, y: 120,
      whatItDoes: "Screens the meal. Fines go on to the finished bin, oversize goes to the mill.",
      faults: [] },

    { id: "mill-1", label: "Mill 1", type: "mill", line: "ovine", x: 1225, y: 120,
      whatItDoes: "Grinds the oversize down and returns it to the shaker.",
      faults: ["mill-trip"] },

    { id: "bin-meal-1", label: "Bin — Ovine Meal", type: "bin", line: "ovine", x: 1365, y: 120, guess: true,
      whatItDoes: "Finished ovine meal, waiting to be bagged.", faults: [] },

    { id: "bagging", label: "Bagging Area", type: "bagging", line: "ovine", x: 1510, y: 120,
      whatItDoes: "Bags and labels the finished ovine meal.",
      faults: ["foreign-body"] },

    /* ---------- MBM / MIXED LINE ---------- */
    { id: "pit-mixed", label: "Mixed Pit", type: "pit", line: "mbm", x: 80, y: 660,
      whatItDoes: "Everything that is not ovine: beef, bones, pork, mixed material.",
      faults: ["foreign-body"] },

    { id: "shred-2", label: "Pre-shredder 2", type: "shredder", line: "mbm", x: 225, y: 660,
      whatItDoes: "Breaks the mixed raw material down to an even size.",
      faults: ["mill-trip"] },

    { id: "md-2", label: "Metal Detector 2", type: "metaldetector", line: "mbm", x: 370, y: 660,
      whatItDoes: "Catches metal before it reaches Cooker 2.",
      faults: ["foreign-body"] },

    { id: "cooker-2", label: "Cooker 2", type: "cooker", line: "mbm", x: 515, y: 660,
      whatItDoes: "Cooks the mixed and MBM material.",
      faults: ["cooker-temp", "steam-low"] },

    { id: "press-1", label: "Press", type: "press", line: "mbm", x: 660, y: 660,
      whatItDoes: "Squeezes the fat out of the cooked material. Cake goes to the dryers, tallow to the separators.",
      faults: ["meal-wet", "tallow-quality"] },

    { id: "dryer-2", label: "Dryer 2", type: "dryer", line: "mbm", x: 815, y: 600,
      whatItDoes: "Dries the press cake. Either Dryer 2 or Dryer 3 is used.",
      faults: ["meal-wet"] },

    { id: "dryer-3", label: "Dryer 3", type: "dryer", line: "mbm", x: 815, y: 725,
      whatItDoes: "Dries the press cake. Either Dryer 2 or Dryer 3 is used.",
      faults: ["meal-wet"] },

    { id: "bin-2", label: "Bin — MBM Dried", type: "bin", line: "mbm", x: 955, y: 660, guess: true,
      whatItDoes: "Holds dried MBM solids before screening and milling.", faults: [] },

    { id: "shaker-2", label: "Shaker 2", type: "shaker", line: "mbm", x: 1090, y: 660,
      whatItDoes: "Screens the MBM meal. Fines go to the silos, oversize goes to the mill.",
      faults: [] },

    { id: "mill-2", label: "Mill 2", type: "mill", line: "mbm", x: 1225, y: 660,
      whatItDoes: "Grinds the oversize and returns it to the shaker.",
      faults: ["mill-trip"] },

    { id: "silo-1", label: "Silo 1", type: "silo", line: "mbm", x: 1380, y: 565,
      whatItDoes: "Finished MBM meal storage.", faults: [] },

    { id: "silo-2", label: "Silo 2", type: "silo", line: "mbm", x: 1380, y: 660,
      whatItDoes: "Finished MBM meal storage.", faults: [] },

    { id: "silo-3", label: "Silo 3 (idle)", type: "silo", line: "mbm", x: 1380, y: 755,
      status: "Not in use at the moment",
      whatItDoes: "Third silo, currently out of service.", faults: [] },

    /* ---------- TALLOW, SHARED ---------- */
    { id: "sep-1", label: "Separator 1", type: "separator", line: "tallow", x: 865, y: 300,
      whatItDoes: "Polishes the fat. Normally only one or two separators run at a time.",
      faults: ["tallow-quality"] },

    { id: "sep-2", label: "Separator 2", type: "separator", line: "tallow", x: 865, y: 395,
      whatItDoes: "Polishes the fat. Normally only one or two separators run at a time.",
      faults: ["tallow-quality"] },

    { id: "sep-3", label: "Separator 3", type: "separator", line: "tallow", x: 865, y: 490,
      whatItDoes: "Polishes the fat. Normally only one or two separators run at a time.",
      faults: ["tallow-quality"] },

    { id: "tank-inside", label: "Inside Storage Tank", type: "tank", line: "tallow", x: 1020, y: 395,
      whatItDoes: "First stop for finished tallow before it is pumped to the outside tanks.",
      faults: ["tallow-quality"] },

    { id: "tallow-tank-1", label: "Tallow Tank 1", type: "tank", line: "tallow", x: 1175, y: 330,
      whatItDoes: "Outside tallow storage, ready for loadout.", faults: ["tallow-quality"] },
    { id: "tallow-tank-2", label: "Tallow Tank 2", type: "tank", line: "tallow", x: 1295, y: 330,
      whatItDoes: "Outside tallow storage, ready for loadout.", faults: ["tallow-quality"] },
    { id: "tallow-tank-3", label: "Tallow Tank 3", type: "tank", line: "tallow", x: 1175, y: 450,
      whatItDoes: "Outside tallow storage, ready for loadout.", faults: ["tallow-quality"] },
    { id: "tallow-tank-4", label: "Tallow Tank 4", type: "tank", line: "tallow", x: 1295, y: 450,
      whatItDoes: "Outside tallow storage, ready for loadout.", faults: ["tallow-quality"] },

    { id: "uco-tank-1", label: "UCO Tank 1", type: "tank", line: "tallow", x: 1455, y: 330, guess: true,
      whatItDoes: "Used cooking oil storage. I do not know yet how this connects — nothing is drawn to it on purpose.",
      faults: [] },
    { id: "uco-tank-2", label: "UCO Tank 2", type: "tank", line: "tallow", x: 1455, y: 450, guess: true,
      whatItDoes: "Used cooking oil storage. I do not know yet how this connects.",
      faults: [] },

    /* ---------- SERVICES ---------- */
    { id: "boiler-big", label: "Boiler (Big)", type: "boiler", line: "utility", x: 200, y: 330,
      whatItDoes: "Main steam supply for the cookers and dryers.",
      faults: ["steam-low"] },

    { id: "boiler-small", label: "Boiler (Small)", type: "boiler", line: "utility", x: 325, y: 330,
      whatItDoes: "Second, smaller boiler. Backup or light load.",
      faults: ["steam-low"] },

    { id: "evaporator", label: "Evaporator", type: "evaporator", line: "utility", x: 450, y: 330, guess: true,
      whatItDoes: "Boils the water out of the stickwater. I have guessed that the thick concentrate goes back into a dryer.",
      faults: [] },

    { id: "contrashear", label: "Contra Shear", type: "contrashear", line: "utility", x: 575, y: 330, guess: true,
      whatItDoes: "I have put this on the water side, screening solids out of the effluent before the DAF. Tell me if it is actually on the raw material side.",
      faults: [] },

    { id: "daf", label: "DAF", type: "daf", line: "utility", x: 700, y: 330,
      whatItDoes: "Cleans the waste water before it leaves site.",
      faults: [] }
  ],

  /* ---------------------------------------------------------- */
  edges: [

    /* ovine line */
    { from: "pit-ovine", to: "shred-1", stream: "solids" },
    { from: "shred-1", to: "md-1", stream: "solids" },
    { from: "md-1", to: "cooker-1", stream: "solids" },
    { from: "cooker-1", to: "decanter-1", stream: "solids" },
    { from: "decanter-1", to: "dryer-1", stream: "solids", label: "solids" },
    { from: "dryer-1", to: "bin-1", stream: "meal" },
    { from: "bin-1", to: "shaker-1", stream: "meal" },
    { from: "shaker-1", to: "mill-1", stream: "meal", label: "oversize" },
    { from: "mill-1", to: "shaker-1", stream: "meal", dashed: true, label: "back to screen" },
    { from: "shaker-1", to: "bin-meal-1", stream: "meal", label: "fines" },
    { from: "bin-meal-1", to: "bagging", stream: "meal" },

    /* mixed / MBM line */
    { from: "pit-mixed", to: "shred-2", stream: "solids" },
    { from: "shred-2", to: "md-2", stream: "solids" },
    { from: "md-2", to: "cooker-2", stream: "solids" },
    { from: "cooker-2", to: "press-1", stream: "solids" },
    { from: "press-1", to: "dryer-2", stream: "solids", label: "cake" },
    { from: "press-1", to: "dryer-3", stream: "solids", label: "cake" },
    { from: "dryer-2", to: "bin-2", stream: "meal" },
    { from: "dryer-3", to: "bin-2", stream: "meal" },
    { from: "bin-2", to: "shaker-2", stream: "meal" },
    { from: "shaker-2", to: "mill-2", stream: "meal", label: "oversize" },
    { from: "mill-2", to: "shaker-2", stream: "meal", dashed: true, label: "back to screen" },
    { from: "shaker-2", to: "silo-1", stream: "meal", label: "fines" },
    { from: "shaker-2", to: "silo-2", stream: "meal" },
    { from: "shaker-2", to: "silo-3", stream: "meal", dashed: true },

    /* tallow */
    { from: "decanter-1", to: "sep-1", stream: "tallow", label: "fat + water" },
    { from: "decanter-1", to: "sep-2", stream: "tallow", dashed: true },
    { from: "press-1", to: "sep-2", stream: "tallow", label: "tallow" },
    { from: "press-1", to: "sep-3", stream: "tallow", dashed: true },
    { from: "sep-1", to: "tank-inside", stream: "tallow" },
    { from: "sep-2", to: "tank-inside", stream: "tallow" },
    { from: "sep-3", to: "tank-inside", stream: "tallow" },
    { from: "tank-inside", to: "tallow-tank-1", stream: "tallow" },
    { from: "tank-inside", to: "tallow-tank-2", stream: "tallow" },
    { from: "tank-inside", to: "tallow-tank-3", stream: "tallow" },
    { from: "tank-inside", to: "tallow-tank-4", stream: "tallow" },

    /* water side — all guessed */
    { from: "sep-3", to: "evaporator", stream: "water", dashed: true, label: "stickwater" },
    { from: "evaporator", to: "dryer-2", stream: "water", dashed: true, label: "concentrate?" },
    { from: "evaporator", to: "contrashear", stream: "water", dashed: true },
    { from: "contrashear", to: "daf", stream: "water" },

    /* steam — hidden until you turn it on */
    { from: "boiler-big", to: "cooker-1", stream: "steam" },
    { from: "boiler-big", to: "cooker-2", stream: "steam" },
    { from: "boiler-big", to: "dryer-2", stream: "steam" },
    { from: "boiler-small", to: "dryer-1", stream: "steam" },
    { from: "boiler-small", to: "evaporator", stream: "steam" }
  ]
};
