/* =============================================================
   PROCEDURES  —  startup, shutdown, each line, support jobs
   -------------------------------------------------------------
   HOW TO EDIT
   Every procedure is one block between { and }.
   Change the words inside the quote marks. Keep the commas.
   status: "draft"    -> shows the orange "needs sign-off" badge
   status: "approved" -> shows the green "signed off" badge
   ============================================================= */

window.PLANT_INFO = {
  name: "Rendering Plant Guide",
  site: "Site name goes here",
  revision: "Rev 0 — draft, nothing approved yet"
};

window.PLANT_PROCEDURES = [

  /* ===========================================================
     1. WHOLE PLANT STARTUP
     =========================================================== */
  {
    id: "startup-plant",
    category: "startup",
    icon: "\u25B6",
    title: "Plant Startup — start to finish",
    subtitle: "Cold start, empty plant, beginning of shift",
    status: "draft",
    duration: "About 90 minutes",
    who: "Plant Operator with Shift Supervisor",
    summary: "The full order of starting the plant from cold. Golden rule: smell control and steam first, then start machines from the discharge end backwards, and only put raw material in last.",
    ppe: ["Hard hat", "Safety glasses", "Hearing protection", "Steel cap boots", "Cut-resistant gloves", "Hi-vis"],
    warnings: [
      { type: "danger", title: "Steam and hot surfaces", text: "Cooker shells, tallow lines and steam valves can burn through clothing. Never open a cooker door while there is pressure in the vessel." },
      { type: "warn", title: "Never start a machine you cannot see", text: "Walk the line first. Make sure nobody is inside a cooker, under a conveyor, or working on a guard." }
    ],
    steps: [
      {
        title: "Read the handover and the log book",
        detail: "Find out what happened on the last shift. Any machine left broken, any job half finished, any lockout still on.",
        who: "Operator",
        time: "5 min",
        checks: ["Shift log read and signed", "Any open maintenance work orders noted", "Raw material in the bin checked for species and condition"]
      },
      {
        title: "Check all lockouts and tags are cleared",
        detail: "Every padlock and danger tag must be removed by the person who put it on. Never cut off somebody else's lock.",
        who: "Operator + Supervisor",
        time: "10 min",
        warning: "If a danger tag is still on a machine, the plant does not start. Find the person named on the tag.",
        checks: ["Lockout board clear", "No danger tags left on starters", "Maintenance signed off as finished"]
      },
      {
        title: "Walk the whole plant",
        detail: "Walk the line from raw intake all the way to bagging. Look for missing guards, open inspection hatches, tools left behind, oil or water on the floor, and people working.",
        who: "Operator",
        time: "15 min",
        checks: ["All guards fitted and bolted", "All inspection doors shut", "Walkways clear", "Emergency stops reset and not pressed in", "Fire exits clear"]
      },
      {
        title: "Start the boiler and build steam",
        detail: "Bring the boiler up and let the pressure build to the normal working pressure. Do not rush it.",
        who: "Boiler Attendant",
        time: "30 min",
        checks: ["Water level normal in the sight glass", "Blowdown done", "Steam pressure at working pressure", "Steam header drains open then closed once clear"]
      },
      {
        title: "Start cooling water and the condenser",
        detail: "Cooling water and the condenser must run before any cooker gets steam, or vapour and smell will push out through the plant.",
        who: "Operator",
        time: "5 min",
        checks: ["Cooling tower fan running", "Cooling water pump running and flow confirmed", "Condenser water in and out temperatures normal"]
      },
      {
        title: "Start odour control — before anything else hot",
        detail: "Start the extraction fans, scrubber and biofilter first. This is what keeps the smell inside the building and off the neighbours.",
        who: "Operator",
        time: "5 min",
        warning: "If odour control is not running, the plant does not start cooking. This is usually a licence condition.",
        checks: ["Extraction fan running", "Scrubber pump running and chemical dosing on", "Biofilter irrigation on and bed damp", "Building under slight negative pressure (doors pull shut)"]
      },
      {
        title: "Start the effluent and wastewater system",
        detail: "Sump pumps, screens and the DAF plant need to be running before water starts flowing from the process.",
        who: "Operator",
        time: "5 min",
        checks: ["Sump pumps on auto", "Screens clear", "DAF running, chemicals dosing", "Balance tank has room"]
      },
      {
        title: "Warm the tallow tanks and trace heating",
        detail: "Tallow sets like candle wax when it cools. Warm the tanks, lines and pumps so tallow can move when it arrives.",
        who: "Operator",
        time: "20 min (can run at the same time as the boiler warming)",
        checks: ["Tank heating coils on", "Line trace heating on", "Tank temperatures climbing to target", "Tallow pumps free to turn"]
      },
      {
        title: "Start the machines from the END of the line, backwards",
        detail: "Start bagging first, then the mill, then the meal conveyors, then the press, then the cooker discharge. Working backwards means nothing ever gets fed into a stopped machine.",
        who: "Operator",
        time: "10 min",
        warning: "Sound the start warning horn and check nobody is near the equipment before each start.",
        checks: ["Bagging/bulk-out ready and empty", "Hammer mill running, no odd noise", "Meal conveyors and elevators running empty", "Press running empty", "Cooker discharge screw running"]
      },
      {
        title: "Start the cooker empty, then admit steam slowly",
        detail: "Get the agitator turning before any steam goes in. Then open the steam valve a little at a time and let the shell warm evenly.",
        who: "Operator",
        time: "10 min",
        warning: "Opening steam fast onto a cold, still cooker can shock the shell and bend the shaft.",
        checks: ["Agitator turning freely, normal current", "Steam admitted slowly", "Condensate trap passing", "Vapour going to the condenser, not the room"]
      },
      {
        title: "Start raw intake and the pre-breaker",
        detail: "Start the intake conveyor and the grinder or pre-breaker empty, let them settle, then you are ready to feed.",
        who: "Operator",
        time: "5 min",
        checks: ["Intake conveyor running", "Pre-breaker running empty, normal current", "Magnet or metal detector in place and working"]
      },
      {
        title: "Start feeding slowly and ramp up",
        detail: "Feed at a low rate first. Watch the cooker temperature and the motor currents. Only increase the feed once the cooker is holding its temperature.",
        who: "Operator",
        time: "20 min",
        checks: ["Feed rate low to start", "Cooker holding target temperature", "Motor currents steady", "No smell escaping the building"]
      },
      {
        title: "Record the start-up readings",
        detail: "Write down the time, temperatures, pressures and who started the plant. This is your proof if anything is questioned later.",
        who: "Operator",
        time: "5 min",
        checks: ["Start time logged", "Steam pressure logged", "Cooker temperature logged", "Species being run logged", "Log signed"]
      }
    ]
  },

  /* ===========================================================
     2. WHOLE PLANT SHUTDOWN
     =========================================================== */
  {
    id: "shutdown-plant",
    category: "shutdown",
    icon: "\u25A0",
    title: "Plant Shutdown — start to finish",
    subtitle: "Normal end-of-run shutdown, plant left clean and empty",
    status: "draft",
    duration: "About 2 to 3 hours",
    who: "Plant Operator with Shift Supervisor",
    summary: "The full order of shutting down. Golden rule: stop the raw material first, then run every machine empty from the feed end forwards, and keep the smell control running until the plant is cold and clear.",
    ppe: ["Hard hat", "Safety glasses", "Hearing protection", "Steel cap boots", "Gloves", "Hi-vis", "Face shield for washdown"],
    warnings: [
      { type: "danger", title: "Never leave product in a stopped machine", text: "Meal left in a hot mill or cooker can char or even catch fire, and cooled tallow sets solid in the lines." },
      { type: "warn", title: "Keep the agitator turning while the cooker cools", text: "A hot cooker left still can bow the shaft and jam the agitator." }
    ],
    steps: [
      {
        title: "Stop feeding raw material",
        detail: "Close the raw bin gate and stop loading. Tell the intake driver and the kill floor that you are shutting down.",
        who: "Operator",
        time: "5 min",
        checks: ["Raw bin gate shut", "No more deliveries coming", "Intake area told"]
      },
      {
        title: "Run the intake and pre-breaker empty",
        detail: "Let the intake conveyor and grinder keep running until you can see and hear that they are empty, then stop them.",
        who: "Operator",
        time: "10 min",
        checks: ["Intake conveyor visually empty", "Pre-breaker current back to no-load", "Hopper and chutes clear"]
      },
      {
        title: "Finish the batch in the cooker",
        detail: "Keep cooking the last load until it reaches the normal finish temperature and moisture. Do not short-cut this just to get home.",
        who: "Operator",
        time: "30-45 min",
        warning: "Under-cooked product cannot be sold and may fail the sterilisation record. Finish the batch properly.",
        checks: ["Finish temperature reached and held for the required time", "Moisture sample taken and in range", "Batch record completed"]
      },
      {
        title: "Discharge the cooker and empty the press",
        detail: "Discharge the cooker, run the press until the cake stops coming, then run it empty for a few minutes.",
        who: "Operator",
        time: "20 min",
        checks: ["Cooker empty, discharge screw clear", "Press cake stopped", "Press current back to no-load", "Tallow drained from the press pan"]
      },
      {
        title: "Run the meal line empty — mill, conveyors, bagging",
        detail: "Keep the hammer mill, elevators and bagging running until nothing more comes through, then stop them in feed-to-discharge order.",
        who: "Operator",
        time: "15 min",
        warning: "Meal sitting in a hot, stopped mill is a fire risk. Always run it empty.",
        checks: ["Mill empty and current at no-load", "Elevators and conveyors empty", "Bagging or bulk-out finished and recorded", "Mill cooled before stopping"]
      },
      {
        title: "Shut the steam off the cooker, keep it turning",
        detail: "Close the steam valve. Leave the agitator turning while the shell cools down. Open the condensate drains.",
        who: "Operator",
        time: "30 min of cooling",
        checks: ["Steam valve shut and locked if required", "Agitator still turning", "Condensate drained", "Shell temperature falling"]
      },
      {
        title: "Clear the tallow lines so they do not set",
        detail: "Pump the tallow through to the storage tank, then flush or circulate the lines. Leave trace heating on if the plant restarts soon.",
        who: "Operator",
        time: "20 min",
        warning: "Tallow left in a cold line turns solid and can take a whole shift to melt out.",
        checks: ["Tallow pumped to storage", "Lines flushed or circulating", "Polisher/decanter emptied and flushed", "Trace heating set correctly for the break"]
      },
      {
        title: "Keep odour control running",
        detail: "The plant still steams and smells while it cools. Leave the extraction, scrubber and biofilter running until everything is cold and clear.",
        who: "Operator",
        time: "Until plant is cold",
        checks: ["Extraction fan still running", "Scrubber still dosing", "No visible vapour leaving the building", "Biofilter irrigation left on auto"]
      },
      {
        title: "Washdown and clean",
        detail: "Wash the floors, chutes, hoppers and the press area. Clear the screens. Do not blast water into motors or control panels.",
        who: "Cleaning crew",
        time: "45 min",
        warning: "Lock out and tag any machine before anyone reaches inside it to clean.",
        checks: ["Floors and drains clear", "Chutes and hoppers clean", "Screens and sumps cleared", "Panels and motors not hosed", "Cleaning record signed"]
      },
      {
        title: "Isolate, lock out and set the boiler to standby",
        detail: "Isolate the machines that need it, fit locks and tags, and put the boiler into standby or shut it down to the boiler procedure.",
        who: "Operator + Boiler Attendant",
        time: "20 min",
        checks: ["Required isolations in place with locks and tags", "Lockout board updated", "Boiler in standby per boiler procedure", "Effluent plant left running on auto"]
      },
      {
        title: "Final walk around and handover",
        detail: "Walk the plant one last time. Look for leaks, hot spots, running water and anything left out of place. Then fill in the log and hand over.",
        who: "Operator + Supervisor",
        time: "15 min",
        checks: ["No leaks or hot spots", "No water running", "Lights and doors as required", "Shift log filled in and signed", "Problems for the next shift written down"]
      }
    ]
  },

  /* ===========================================================
     3. LINE — RAW MATERIAL INTAKE
     =========================================================== */
  {
    id: "line-intake",
    category: "line",
    icon: "\u{1F69B}",
    title: "Raw Material Intake Line",
    subtitle: "Receiving, weighing, species check, pre-breaking",
    status: "draft",
    duration: "Runs all shift",
    who: "Intake Operator",
    summary: "How raw material comes in, gets checked and recorded, and gets broken down ready for the cooker. This is where species separation is either done right or gone wrong.",
    ppe: ["Hard hat", "Safety glasses", "Steel cap boots", "Cut-resistant gloves", "Waterproof apron", "Hi-vis"],
    warnings: [
      { type: "danger", title: "Keep clear of the pre-breaker", text: "Never reach into the hopper or clear a blockage without isolating and locking out the machine first." },
      { type: "warn", title: "Species mix-up cannot be undone", text: "Once ruminant and non-ruminant material are mixed, the whole batch is affected. Check before tipping, not after." }
    ],
    steps: [
      {
        title: "Check the load before it tips",
        detail: "Check the docket, the species, the supplier and the condition of the material. Reject anything that should not be there.",
        who: "Intake Operator",
        checks: ["Docket matches the load", "Species confirmed and recorded", "No banned or foreign material", "Condition acceptable, not badly spoiled"]
      },
      {
        title: "Weigh in and record",
        detail: "Weigh the truck in and out and record the net weight against the supplier and species.",
        who: "Intake Operator",
        checks: ["Gross and tare weights recorded", "Species recorded against the weight", "Docket filed or scanned"]
      },
      {
        title: "Tip into the correct bin",
        detail: "Each species group has its own bin or run. Tip into the right one and never on top of a different species.",
        who: "Driver + Intake Operator",
        warning: "If the wrong bin is used, stop and tell the supervisor straight away. Do not keep going and hope.",
        checks: ["Correct bin for the species", "Bin has room", "Tipping area clear of people"]
      },
      {
        title: "Run the intake conveyor at a steady rate",
        detail: "Feed evenly. A surge jams the pre-breaker and a gap lets the cooker lose temperature.",
        who: "Intake Operator",
        checks: ["Feed rate steady", "No bridging in the hopper", "Conveyor current steady"]
      },
      {
        title: "Check the magnet and metal detection",
        detail: "Clean the magnet and confirm the metal detector or trap is working. Metal is the main killer of pre-breakers and mills.",
        who: "Intake Operator",
        checks: ["Magnet cleaned this shift", "Metal detector tested and result logged", "Any metal found recorded and shown to the supervisor"]
      },
      {
        title: "Pre-break to the right size",
        detail: "Material should come out in even pieces at the size the cooker needs. Big lumps cook unevenly and leave wet centres.",
        who: "Intake Operator",
        checks: ["Piece size even and on spec", "Pre-breaker current normal", "No unusual knocking or vibration"]
      },
      {
        title: "Keep the area clean through the shift",
        detail: "Hose down spills as you go. A dirty intake area is the biggest smell and pest problem on site.",
        who: "Intake Operator",
        checks: ["Spills cleaned up", "Drains running clear", "Doors kept shut to hold the smell in", "Bin lids or covers in place"]
      }
    ]
  },

  /* ===========================================================
     4. LINE — OVINE
     =========================================================== */
  {
    id: "line-ovine",
    category: "line",
    icon: "\u{1F411}",
    title: "Ovine Line (lamb and goat)",
    subtitle: "Cooking and separation for ovine meal",
    status: "draft",
    duration: "Runs all shift",
    who: "Cooker Operator",
    summary: "How the ovine run is set up, cooked and kept separate from other species so the meal can be sold as ovine.",
    ppe: ["Hard hat", "Safety glasses", "Hearing protection", "Steel cap boots", "Heat-resistant gloves", "Hi-vis"],
    warnings: [
      { type: "danger", title: "Hot vessel and hot product", text: "Cooker discharge and press cake are hot enough to cause serious burns. Use the heat gloves and stand clear of the chute." },
      { type: "warn", title: "Separation is the whole point", text: "An ovine run must start with a clean, empty line. If in doubt, flush and run to waste rather than risk the batch." }
    ],
    steps: [
      {
        title: "Confirm the line is clean and empty before you start",
        detail: "The last run must be fully out of the cooker, press, conveyors and mill before ovine goes in.",
        who: "Operator + Supervisor",
        warning: "Do not start an ovine run on top of leftover material from another species.",
        checks: ["Cooker empty and inspected", "Press and conveyors empty", "Mill and bagging line clear", "Changeover record signed"]
      },
      {
        title: "Set the cooker recipe for ovine",
        detail: "Select the ovine recipe or set the temperature, time and feed rate to the ovine numbers.",
        who: "Operator",
        checks: ["Correct recipe selected", "Target temperature set", "Target cook time set", "Feed rate set"]
      },
      {
        title: "Feed and hold the cook temperature",
        detail: "Feed steadily and keep the temperature on target for the full required time. This is the sterilisation step.",
        who: "Operator",
        checks: ["Temperature on target", "Hold time achieved", "Chart or data log recording", "Feed steady, no surges"]
      },
      {
        title: "Watch the vapour and condenser",
        detail: "Vapour should all go to the condenser. If you can smell cooking in the building, the vapour path has a problem.",
        who: "Operator",
        checks: ["Vapour line clear", "Condenser temperatures normal", "No vapour escaping into the room"]
      },
      {
        title: "Discharge and press",
        detail: "Discharge the cooked material to the press. Watch the cake for wetness and the tallow for cleanliness.",
        who: "Operator",
        checks: ["Cake coming out even and firm", "Press current steady", "Tallow flowing clean, not full of fines"]
      },
      {
        title: "Take samples and label them ovine",
        detail: "Take the required samples, label them clearly as ovine with the date, time and batch.",
        who: "Operator",
        checks: ["Sample taken at the set frequency", "Label shows species, date, time, batch", "Sample stored correctly"]
      },
      {
        title: "Mill, store and bag as ovine",
        detail: "Send the meal to the ovine bin or bags only. Mark everything clearly.",
        who: "Operator",
        checks: ["Correct bin or bags used", "All labels say ovine", "Batch number recorded", "Quantity recorded"]
      },
      {
        title: "Record the run",
        detail: "Write down start and finish times, tonnes in, tonnes out, temperatures and anything odd that happened.",
        who: "Operator",
        checks: ["Run sheet complete", "Any deviation written down and reported", "Supervisor signed"]
      }
    ]
  },

  /* ===========================================================
     5. LINE — MBM
     =========================================================== */
  {
    id: "line-mbm",
    category: "line",
    icon: "\u{1F9B4}",
    title: "MBM Line (meat and bone meal)",
    subtitle: "Pressing, milling, screening and bagging",
    status: "draft",
    duration: "Runs all shift",
    who: "Mill Operator",
    summary: "How cooked material becomes finished meat and bone meal: press out the fat, mill it, screen it, cool it and pack it to spec.",
    ppe: ["Hard hat", "Safety glasses", "Hearing protection", "Dust mask", "Steel cap boots", "Gloves", "Hi-vis"],
    warnings: [
      { type: "danger", title: "Dust and fire", text: "Meal dust burns. No hot work, no smoking, and never leave meal sitting in a hot stopped mill." },
      { type: "warn", title: "Never clear a mill or screw by hand while it can start", text: "Isolate, lock out, tag out, and prove it is dead first." }
    ],
    steps: [
      {
        title: "Check the press before the material arrives",
        detail: "Check the screens, the worm and the drive. A worn press means wet cake and lost fat.",
        who: "Operator",
        checks: ["Press screens clean and not blinded", "Worm and liners in good condition", "Drive and gearbox oil level OK", "No leaks under the press"]
      },
      {
        title: "Press to the target fat and moisture",
        detail: "Adjust the cone or choke so the cake comes out at the right dryness. Too loose and you lose fat into the meal.",
        who: "Operator",
        checks: ["Cake firm, breaks cleanly", "Press current in normal range", "Tallow flow steady", "Fat in cake within spec"]
      },
      {
        title: "Mill the cake to the required particle size",
        detail: "Feed the hammer mill evenly. Check the screen size matches the product spec.",
        who: "Operator",
        checks: ["Correct mill screen fitted", "Feed even, no surging", "Mill current steady", "No knocking or heavy vibration"]
      },
      {
        title: "Screen and remove oversize",
        detail: "Oversize goes back for re-milling. Make sure the return is working and not just building up.",
        who: "Operator",
        checks: ["Screen deck clear and not torn", "Oversize returning, not piling up", "Particle size check done and logged"]
      },
      {
        title: "Cool the meal before storage",
        detail: "Hot meal in a silo can self-heat. Get it down to the storage temperature before it goes in.",
        who: "Operator",
        warning: "Never put hot meal straight into a closed silo. It can smoulder.",
        checks: ["Cooler running", "Meal temperature at or below target before storage", "Silo temperature probes normal"]
      },
      {
        title: "Final magnet and metal check",
        detail: "Last chance to catch metal before the product goes to the customer. Clean the magnet and log it.",
        who: "Operator",
        checks: ["Magnet cleaned and logged", "Metal detector tested and logged", "Any find reported"]
      },
      {
        title: "Sample, test and record",
        detail: "Take the batch samples for protein, fat, moisture and ash. Hold the retention sample.",
        who: "Operator + Lab",
        checks: ["Samples taken and labelled", "Results within spec or held", "Retention sample stored", "Batch record complete"]
      },
      {
        title: "Bag or bulk out and label",
        detail: "Pack to the right weight, stitch or seal properly, and label with product, batch and date.",
        who: "Operator",
        checks: ["Bag weight checked on scales", "Seals good, no leaking bags", "Labels correct and readable", "Pallets wrapped and stored off the floor", "Stock record updated"]
      }
    ]
  },

  /* ===========================================================
     6. LINE — TALLOW
     =========================================================== */
  {
    id: "line-tallow",
    category: "line",
    icon: "\u{1F6E2}",
    title: "Tallow Line",
    subtitle: "Separation, polishing, storage and loadout",
    status: "draft",
    duration: "Runs all shift",
    who: "Tallow Operator",
    summary: "How the fat is separated from the solids, cleaned up to grade, stored warm and loaded out. Tallow quality is mostly about heat, time and keeping the fines out.",
    ppe: ["Hard hat", "Safety glasses or face shield", "Heat-resistant gloves", "Steel cap boots", "Apron", "Hi-vis"],
    warnings: [
      { type: "danger", title: "Hot liquid fat", text: "Hot tallow splashes and sticks to skin. Face shield and gloves whenever you open a sight glass, filter or sample point." },
      { type: "warn", title: "Water and hot fat do not mix", text: "Water into hot tallow boils instantly and throws fat out of the vessel. Drain water out before heating." }
    ],
    steps: [
      {
        title: "Warm the tanks, lines and pumps first",
        detail: "Everything must be warm before tallow moves, or it sets and blocks.",
        who: "Operator",
        checks: ["Tank temperature at target", "Line trace heating on", "Pump turns freely", "Filters warm"]
      },
      {
        title: "Drain water from the tank bottom",
        detail: "Water and sludge settle at the bottom. Drain it off before heating hard or pumping out.",
        who: "Operator",
        warning: "Stand clear of the drain point and wear the face shield.",
        checks: ["Bottom drain run until clean fat shows", "Water sent to effluent, not to the product tank", "Drain valve shut properly"]
      },
      {
        title: "Run the separation step",
        detail: "Send press tallow through the decanter, centrifuge or settling tank to drop out the solids.",
        who: "Operator",
        checks: ["Feed rate steady", "Solids discharging normally", "No unusual vibration", "Bowl or scroll current normal"]
      },
      {
        title: "Polish to grade",
        detail: "Polish or filter the tallow to hit the grade you are selling. Watch the colour and the clarity.",
        who: "Operator",
        checks: ["Filter or polisher running at normal pressure", "Fat clear, not cloudy", "Colour on grade", "Fines content acceptable"]
      },
      {
        title: "Test the quality",
        detail: "Check free fatty acid, moisture, impurities and colour against the grade you are selling.",
        who: "Operator + Lab",
        checks: ["FFA tested and in range", "Moisture and impurities tested", "Colour checked", "Result logged against the tank"]
      },
      {
        title: "Transfer to the right storage tank",
        detail: "Different grades and species go to different tanks. Line up the valves and check you are pumping into the tank you think you are.",
        who: "Operator",
        warning: "Pumping into the wrong tank downgrades a whole tank of product. Check the valve line-up twice.",
        checks: ["Valve line-up checked", "Destination tank has room", "Tank heating on", "Transfer volume recorded"]
      },
      {
        title: "Load out to the tanker",
        detail: "Check the tanker is clean and suitable, agree the grade with the driver, load and record.",
        who: "Operator + Driver",
        checks: ["Tanker cleaning certificate seen", "Grade agreed and on the docket", "Sample taken and retained", "Weights recorded", "Hoses drained and capped"]
      },
      {
        title: "Flush and leave the line ready",
        detail: "Clear the lines, leave the heating set right, and note the tank levels for the next shift.",
        who: "Operator",
        checks: ["Lines clear", "Trace heating set", "Tank levels recorded", "Log signed"]
      }
    ]
  },

  /* ===========================================================
     7. SUPPORT — SPECIES CHANGEOVER
     =========================================================== */
  {
    id: "support-changeover",
    category: "support",
    icon: "\u{1F504}",
    title: "Species Changeover and Segregation",
    subtitle: "Switching between ovine, beef, mixed and pork runs",
    status: "draft",
    duration: "45 to 90 minutes",
    who: "Supervisor signs off every changeover",
    summary: "How to switch the plant from one species to another without cross-contaminating. This page protects your customer approvals, so it must be followed exactly and signed.",
    ppe: ["Hard hat", "Safety glasses", "Hearing protection", "Steel cap boots", "Gloves", "Hi-vis"],
    warnings: [
      { type: "danger", title: "Lock out before cleaning inside anything", text: "Every machine opened for inspection or cleaning must be isolated, locked, tagged and proven dead." },
      { type: "warn", title: "No sign-off, no changeover", text: "The new run does not start until the supervisor has inspected and signed the changeover record." }
    ],
    steps: [
      {
        title: "Plan the changeover before the end of the run",
        detail: "Decide the order of species for the day so you do the fewest changeovers. Tell everyone on the line.",
        who: "Supervisor",
        checks: ["Run order planned and posted", "Team briefed", "Labels and bags for the next species ready"]
      },
      {
        title: "Run the current species completely out",
        detail: "Empty the cooker, press, conveyors, mill, cooler and bagging line. Empty means empty, not nearly empty.",
        who: "Operator",
        checks: ["Cooker empty", "Press empty", "Conveyors and elevators empty", "Mill and cooler empty", "Bagging line empty and cleared"]
      },
      {
        title: "Open up and inspect",
        detail: "Isolate, lock out, then open the inspection doors and look inside. Scrape out anything left in corners, dead spots and screw ends.",
        who: "Operator + Maintenance",
        warning: "Dead spots in screws and chutes are where leftover product hides. Check them every time.",
        checks: ["Isolations in place and proven", "All inspection doors opened", "Dead spots scraped clean", "Visual inspection recorded"]
      },
      {
        title: "Clean down",
        detail: "Clean to the standard set for this changeover: dry clean, wet clean, or flush to waste, depending on which species you are switching between.",
        who: "Cleaning crew",
        checks: ["Correct cleaning level used for this changeover", "Tools used are dedicated or cleaned", "Cleaning chemicals as specified", "Clean completed and recorded"]
      },
      {
        title: "Flush the first material to waste if required",
        detail: "For the strictest changeovers, the first amount through goes to a separate bin, not into the new product.",
        who: "Operator",
        checks: ["Flush quantity agreed", "Flush material sent to the correct destination", "Flush recorded"]
      },
      {
        title: "Change over the labels, bins and paperwork",
        detail: "Swap the bin signs, bag labels, run sheets and sampling labels to the new species before the first product is made.",
        who: "Operator",
        checks: ["Bin and tank signs changed", "Old labels removed from the area", "New run sheet started", "Correct recipe selected"]
      },
      {
        title: "Supervisor inspects and signs",
        detail: "The supervisor walks the line, checks the clean, checks the labels, then signs the changeover record. Only then does the new run start.",
        who: "Supervisor",
        checks: ["Line inspected", "Labels and recipe confirmed", "Changeover record signed with date and time", "Clearance given to start"]
      }
    ]
  },

  /* ===========================================================
     8. SUPPORT — ODOUR CONTROL
     =========================================================== */
  {
    id: "support-odour",
    category: "support",
    icon: "\u{1F4A8}",
    title: "Odour Control and Condenser",
    subtitle: "Extraction, scrubber, biofilter, vapour handling",
    status: "draft",
    duration: "Runs whenever the plant runs",
    who: "Operator",
    summary: "How the smell is captured and treated. This is usually a licence condition, so it runs first, stops last, and every check gets written down.",
    ppe: ["Hard hat", "Safety glasses", "Steel cap boots", "Gloves", "Chemical splash gear when dosing"],
    warnings: [
      { type: "danger", title: "Scrubber chemicals", text: "Dosing chemicals can burn skin and eyes. Full splash protection, and never mix chemicals in the same container." },
      { type: "warn", title: "No odour control, no cooking", text: "If the treatment system is down, stop cooking and tell the supervisor. A complaint can cost the licence." }
    ],
    steps: [
      {
        title: "Start the extraction fans first",
        detail: "Fans on before anything hot or smelly starts. The building should sit under slight negative pressure so smell is pulled in, not pushed out.",
        who: "Operator",
        checks: ["Fan running and current normal", "Dampers set correctly", "Doors pull shut on their own", "Roller doors kept closed"]
      },
      {
        title: "Start the scrubber and dosing",
        detail: "Start the recirculation pump and confirm the chemical dosing is actually feeding, not just switched on.",
        who: "Operator",
        checks: ["Recirculation pump running", "Chemical level in the day tank OK", "Dosing pump stroking", "pH or ORP reading in range"]
      },
      {
        title: "Check the biofilter bed",
        detail: "The bed must be damp, not dry and not flooded. Dry bed means dead bugs and no treatment.",
        who: "Operator",
        checks: ["Irrigation running on its cycle", "Bed damp and evenly wet", "No channels or dry patches", "Pressure drop across the bed normal"]
      },
      {
        title: "Check the condenser is doing its job",
        detail: "Most of the smell comes from cooker vapour. If the condenser is weak, smell goes everywhere.",
        who: "Operator",
        checks: ["Cooling water flow normal", "Water in and out temperatures normal", "No vapour blowing out of the vent", "Condensate draining freely to effluent"]
      },
      {
        title: "Do the sniff round",
        detail: "Walk the boundary and smell. Note the wind direction. Write down what you find, even when it is fine.",
        who: "Operator",
        checks: ["Boundary walk done", "Wind direction noted", "Any smell recorded with the time and place", "Supervisor told if there is anything strong"]
      },
      {
        title: "Keep it running after shutdown",
        detail: "Leave extraction and treatment running until the plant is cold and there is no steam or smell left.",
        who: "Operator",
        checks: ["Treatment still running during cool-down", "Plant confirmed cold and clear before stopping fans", "Stop time recorded"]
      }
    ]
  }

];
