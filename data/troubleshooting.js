/* =============================================================
   TROUBLESHOOTING  —  "something has gone wrong, what do I do"
   -------------------------------------------------------------
   HOW IT WORKS
   Each fault has a set of "nodes". The app always starts at the
   node called "start".
     - A node with "q" asks a question and offers buttons.
       Each button has a "next" which is the id of the next node.
     - A node with "fix" is the end of the road: it shows the
       steps to fix it and when to escalate.
   To add a question, copy a node, give it a new id, and point a
   button's "next" at it.
   ============================================================= */

window.PLANT_FAULTS = [

  /* ---------------------------------------------------------- */
  {
    id: "cooker-temp",
    area: "Cooker",
    icon: "\u{1F321}",
    title: "Cooker will not reach or hold temperature",
    symptom: "Cook temperature sits below target, or keeps dropping away",
    status: "draft",
    nodes: {
      start: {
        q: "Is the steam pressure at the cooker normal?",
        hint: "Look at the gauge on the cooker steam line, not just the boiler house gauge.",
        options: [
          { label: "No — pressure is low", next: "lowsteam" },
          { label: "Yes — pressure is normal", next: "pressure-ok" }
        ]
      },
      lowsteam: {
        q: "Is the boiler itself holding pressure?",
        hint: "Check the boiler house gauge and whether the burner is firing.",
        options: [
          { label: "No — boiler is struggling", next: "fix-boiler" },
          { label: "Yes — boiler is fine, so it is lost between boiler and cooker", next: "fix-steamline" }
        ]
      },
      "pressure-ok": {
        q: "Is the condensate trap passing properly?",
        hint: "A trap that is blocked or stuck open is the most common cause. Feel the line each side of the trap — a big temperature difference usually means it is blocked.",
        options: [
          { label: "Trap looks blocked or cold", next: "fix-trap" },
          { label: "Trap seems fine", next: "feed-check" }
        ]
      },
      "feed-check": {
        q: "Are you feeding more raw material than normal, or is it wetter than usual?",
        hint: "Too much feed, or very wet feed, pulls the temperature straight down.",
        options: [
          { label: "Yes — feed is high or very wet", next: "fix-feed" },
          { label: "No — feed is normal", next: "fix-escalate" }
        ]
      },
      "fix-boiler": {
        fix: {
          title: "Steam supply problem at the boiler",
          steps: [
            "Tell the boiler attendant straight away.",
            "Cut the feed rate right back so the cooker does not fall further behind.",
            "Check the boiler water level and that the burner is firing.",
            "Check nothing else on site has suddenly started using a lot of steam.",
            "Hold the feed low until the pressure is back and steady."
          ],
          escalate: "If pressure does not recover in 15 minutes, stop feeding and call the supervisor. Do not keep feeding into a cooker that cannot cook."
        }
      },
      "fix-steamline": {
        fix: {
          title: "Steam is being lost between the boiler and the cooker",
          steps: [
            "Walk the steam line and look and listen for leaks.",
            "Check the main steam valve is fully open, not part open.",
            "Check the pressure reducing valve setting has not drifted.",
            "Check the line strainer for blockage.",
            "Check for a closed or half-closed isolation valve left from maintenance."
          ],
          escalate: "Call maintenance for any leak you can hear or see. Do not try to tighten a hot steam fitting yourself."
        }
      },
      "fix-trap": {
        fix: {
          title: "Blocked or failed condensate trap",
          steps: [
            "Lower the feed rate to protect the cook.",
            "Open the trap bypass if there is one, so condensate can get away.",
            "Log the trap number and raise a job for maintenance.",
            "Watch the temperature — it should start climbing once condensate clears.",
            "Check the condensate return tank is not full and backing up."
          ],
          escalate: "If the temperature still will not climb with the bypass open, stop feeding and call maintenance."
        }
      },
      "fix-feed": {
        fix: {
          title: "Overfeeding or very wet raw material",
          steps: [
            "Cut the feed rate back by about a third and wait ten minutes.",
            "Let the temperature recover to target before increasing again.",
            "If the material is very wet, blend it with drier material if you can.",
            "Tell intake so they can check what is being tipped.",
            "Write the feed rate change in the log."
          ],
          escalate: "If temperature still will not recover at low feed, treat it as a steam or trap problem and go back to the start of this check."
        }
      },
      "fix-escalate": {
        fix: {
          title: "Not an obvious cause — escalate",
          steps: [
            "Reduce feed to protect the batch.",
            "Write down the temperature, steam pressure, feed rate and time.",
            "Call the supervisor and maintenance.",
            "Hold the batch — do not send under-cooked product forward."
          ],
          escalate: "Under-cooked product must not go to the product bin. Hold it and label it clearly until the supervisor decides."
        }
      }
    }
  },

  /* ---------------------------------------------------------- */
  {
    id: "meal-wet",
    area: "Press / Meal",
    icon: "\u{1F4A7}",
    title: "Meal moisture too high / cake too wet",
    symptom: "Press cake is soft and smeary, or the moisture test comes back over spec",
    status: "draft",
    nodes: {
      start: {
        q: "Did the cooker reach its finish temperature for this batch?",
        hint: "Check the batch record, not your memory.",
        options: [
          { label: "No — cook was short or cool", next: "fix-cook" },
          { label: "Yes — cook was on spec", next: "press-check" }
        ]
      },
      "press-check": {
        q: "Are the press screens clean, or are they blinded over?",
        hint: "Blinded screens mean the liquid cannot get out, so it stays in the cake.",
        options: [
          { label: "Screens look blinded or dirty", next: "fix-screens" },
          { label: "Screens are clean", next: "choke-check" }
        ]
      },
      "choke-check": {
        q: "Is the press choke or cone set where it normally sits?",
        hint: "If it has been opened up, the cake comes out wetter and you lose fat.",
        options: [
          { label: "No — it has been changed", next: "fix-choke" },
          { label: "Yes — same as normal", next: "wear-check" }
        ]
      },
      "wear-check": {
        q: "How is the press worm and liner wear?",
        hint: "Worn flights stop building pressure, so the cake never gets squeezed properly.",
        options: [
          { label: "Looks worn", next: "fix-wear" },
          { label: "Looks fine", next: "fix-escalate" }
        ]
      },
      "fix-cook": {
        fix: {
          title: "The cook was not finished properly",
          steps: [
            "Hold this product separately and label it clearly.",
            "Do not blend it into good product to hide it.",
            "Put the next batch back on the correct recipe and hold time.",
            "Check why the cook was short — temperature, time or feed rate.",
            "Report the batch to the supervisor for a decision on reprocessing."
          ],
          escalate: "A short cook is a food safety and sterilisation issue. The supervisor must decide what happens to the batch."
        }
      },
      "fix-screens": {
        fix: {
          title: "Blinded press screens",
          steps: [
            "Stop the press, isolate, lock out and prove it dead.",
            "Open up and clean the screens properly.",
            "Check for torn or distorted screens and replace them if needed.",
            "Refit, remove the lockout, restart empty and check the current.",
            "Re-test the cake moisture after 15 minutes of normal running."
          ],
          escalate: "If screens blind again within a shift, the cook or the feed is wrong. Raise it with the supervisor."
        }
      },
      "fix-choke": {
        fix: {
          title: "Press choke setting has drifted",
          steps: [
            "Bring the choke back to the setting on the standard sheet.",
            "Move it a small amount at a time and wait for the cake to respond.",
            "Watch the press current so you do not overload the drive.",
            "Re-test the cake moisture.",
            "Write down the setting you ended on."
          ],
          escalate: "If the current goes over the normal range before the cake dries out, stop and call maintenance."
        }
      },
      "fix-wear": {
        fix: {
          title: "Worn press worm or liners",
          steps: [
            "Record the current, the cake condition and the moisture results.",
            "Raise a maintenance job with those numbers attached.",
            "Run at a reduced rate so the press has more time per tonne.",
            "Plan the change at the next shutdown, not mid-run if you can avoid it."
          ],
          escalate: "Agree the plan with the supervisor. Running a badly worn press costs you fat in the meal every hour."
        }
      },
      "fix-escalate": {
        fix: {
          title: "No obvious cause — escalate",
          steps: [
            "Hold the affected product and label it.",
            "Record cook temperature, hold time, press current, choke setting and moisture results.",
            "Call the supervisor and maintenance with those numbers."
          ],
          escalate: "Do not keep producing out-of-spec meal while you work it out. Slow down or stop."
        }
      }
    }
  },

  /* ---------------------------------------------------------- */
  {
    id: "tallow-quality",
    area: "Tallow",
    icon: "\u{1F7E4}",
    title: "Tallow is dark, cloudy or high in FFA",
    symptom: "Colour is off grade, fat looks cloudy, or the free fatty acid test is too high",
    status: "draft",
    nodes: {
      start: {
        q: "Which is the problem?",
        options: [
          { label: "Dark colour", next: "dark" },
          { label: "Cloudy or full of fines", next: "cloudy" },
          { label: "High free fatty acid", next: "ffa" }
        ]
      },
      dark: {
        q: "Has anything been running hotter than normal, or sitting hot for a long time?",
        hint: "Heat plus time is what darkens tallow. Check tank temperatures and how long the fat has been held.",
        options: [
          { label: "Yes — too hot or held too long", next: "fix-heat" },
          { label: "No — temperatures are normal", next: "fix-dark-other" }
        ]
      },
      cloudy: {
        q: "Is there water in the tallow?",
        hint: "Drain a sample from the tank bottom and look for a water layer.",
        options: [
          { label: "Yes — water present", next: "fix-water" },
          { label: "No — it is solids and fines", next: "fix-fines" }
        ]
      },
      ffa: {
        q: "How old is the raw material coming in?",
        hint: "FFA mostly comes in with the raw material. Old, warm raw material gives high FFA no matter how well you run.",
        options: [
          { label: "Old or warm on arrival", next: "fix-raw" },
          { label: "Fresh and cool", next: "fix-ffa-process" }
        ]
      },
      "fix-heat": {
        fix: {
          title: "Too much heat, or held too long",
          steps: [
            "Bring the tank and line temperatures back to the standard settings.",
            "Do not hold finished tallow hot any longer than you have to — move it out.",
            "Check for a stuck-open heating valve or a failed temperature controller.",
            "Check trace heating is not set far above what it needs.",
            "Re-test the colour on the next batch."
          ],
          escalate: "If a controller or valve is faulty, raise a maintenance job the same shift."
        }
      },
      "fix-dark-other": {
        fix: {
          title: "Dark colour with normal temperatures",
          steps: [
            "Check whether the raw material itself was dark or heavily blood-stained.",
            "Check if fines are carrying over and scorching on hot surfaces.",
            "Check the polisher or filter is actually working.",
            "Keep this tank separate so it does not downgrade good product.",
            "Send a sample to the lab and record which tank it came from."
          ],
          escalate: "Tell the supervisor before the tank is blended or sold, so it can be graded correctly."
        }
      },
      "fix-water": {
        fix: {
          title: "Water in the tallow",
          steps: [
            "Put on the face shield. Drain the tank bottom until clean fat shows.",
            "Send the drained water to effluent, not to a product tank.",
            "Find where the water is getting in — a leaking heating coil is the usual cause.",
            "Check the condenser or washdown water is not finding its way into the fat.",
            "Re-test for moisture once settled."
          ],
          escalate: "A leaking internal heating coil needs maintenance and the tank taken out of service. Do not keep heating it."
        }
      },
      "fix-fines": {
        fix: {
          title: "Fines carrying through into the tallow",
          steps: [
            "Check the decanter or centrifuge is discharging solids properly.",
            "Check the polisher or filter for a bypass, a split element or a blinded screen.",
            "Slow the feed rate so the separator has more time to work.",
            "Check the settling tank has not filled with sludge.",
            "Re-test the impurities once it is running clean."
          ],
          escalate: "If the separator is vibrating or discharging unevenly, stop it and call maintenance."
        }
      },
      "fix-raw": {
        fix: {
          title: "High FFA coming in with the raw material",
          steps: [
            "Record the supplier, the time and the condition of the load.",
            "Tell intake and the supervisor so they can talk to the supplier.",
            "Process old material sooner rather than letting it sit.",
            "Keep this fat separate so it can be sold at the grade it actually meets.",
            "Push to shorten the time between delivery and cooking."
          ],
          escalate: "Repeat bad loads from one supplier is a commercial issue. Give the supervisor the records."
        }
      },
      "fix-ffa-process": {
        fix: {
          title: "FFA rising inside the plant",
          steps: [
            "Look for material sitting warm anywhere — bins, chutes, a part-full cooker, a dead leg in a line.",
            "Shorten holding times through the plant.",
            "Check nothing from yesterday is still sitting in a tank or line.",
            "Make sure washdown is removing build-up, not just wetting it.",
            "Re-test after the next clean run."
          ],
          escalate: "If FFA keeps climbing with fresh raw material and short holding times, get the lab and supervisor involved."
        }
      }
    }
  },

  /* ---------------------------------------------------------- */
  {
    id: "mill-trip",
    area: "Mill / Conveyors",
    icon: "\u26A1",
    title: "Hammer mill or conveyor keeps tripping",
    symptom: "Motor overload trips, machine stops, or it will not restart",
    status: "draft",
    nodes: {
      start: {
        q: "STOP FIRST. Is the machine isolated, locked out and proven dead before anyone looks inside?",
        hint: "Nothing else on this page happens until this is done. People lose hands to machines that restart on their own.",
        options: [
          { label: "Yes — isolated, locked, tagged and proven dead", next: "cause" },
          { label: "Not yet", next: "fix-lockout" }
        ]
      },
      cause: {
        q: "Is the machine blocked or choked with product?",
        options: [
          { label: "Yes — it is packed full", next: "fix-block" },
          { label: "No — it looks clear", next: "mech" }
        ]
      },
      mech: {
        q: "Does anything look or feel mechanically wrong — bearings, belts, hammers, screens, the screw?",
        options: [
          { label: "Yes — something is damaged or loose", next: "fix-mech" },
          { label: "No — it all looks normal", next: "elec" }
        ]
      },
      elec: {
        q: "Does it trip straight away on start, even with nothing in it?",
        hint: "An empty machine that still trips is usually electrical, not a blockage.",
        options: [
          { label: "Yes — trips empty", next: "fix-elec" },
          { label: "No — only trips under load", next: "fix-load" }
        ]
      },
      "fix-lockout": {
        fix: {
          title: "Isolate and lock out first",
          steps: [
            "Press the local stop.",
            "Turn the isolator off and padlock it with your own lock.",
            "Fit a danger tag with your name, the date and the reason.",
            "Try to start the machine from the control room to prove it is dead.",
            "Only then open a guard or inspection door."
          ],
          escalate: "If you do not have a lock and tag, or you are not trained on lockout, stop and get your supervisor."
        }
      },
      "fix-block": {
        fix: {
          title: "Blocked machine",
          steps: [
            "With the lockout on, clear the blockage with a tool, never with your hands.",
            "Look at what blocked it — a bone, metal, a lump of cake, or just too much feed.",
            "Check the magnet and metal detector upstream if you found metal.",
            "Check the screen is the right size and not torn.",
            "Remove the lockout, restart empty, listen, then feed slowly and evenly."
          ],
          escalate: "If it blocks again in the same shift, stop and get maintenance to look at the feed arrangement."
        }
      },
      "fix-mech": {
        fix: {
          title: "Mechanical damage",
          steps: [
            "Leave the lockout on.",
            "Write down exactly what you found and take a photo if you can.",
            "Raise a maintenance job and mark the machine out of service.",
            "Tell the supervisor so the run can be re-planned.",
            "Do not run it to get through the shift."
          ],
          escalate: "Worn hammers, loose bolts or hot bearings can break up at speed. Keep it off until maintenance clears it."
        }
      },
      "fix-elec": {
        fix: {
          title: "Trips with no load — electrical",
          steps: [
            "Leave the lockout on and do not keep resetting it.",
            "Note the overload setting and what the fault display says.",
            "Call an electrician.",
            "Check whether anything was recently worked on in that panel."
          ],
          escalate: "Repeated resetting of a tripping starter can start a fire. Electrician only."
        }
      },
      "fix-load": {
        fix: {
          title: "Trips only when it is working",
          steps: [
            "Reduce the feed rate and feed evenly instead of in surges.",
            "Check the screen size and the material size coming in.",
            "Check the drive belts for slipping or a glazed look.",
            "Compare the running current with the normal figure on the standard sheet.",
            "If it still trips at low feed, treat it as mechanical and get maintenance."
          ],
          escalate: "Do not wind the overload setting up to stop it tripping. That is how motors burn out."
        }
      }
    }
  },

  /* ---------------------------------------------------------- */
  {
    id: "odour-complaint",
    area: "Odour",
    icon: "\u{1F443}",
    title: "Strong smell, or a neighbour complaint",
    symptom: "Smell noticed on the boundary, or someone has rung in to complain",
    status: "draft",
    nodes: {
      start: {
        q: "Is the odour control system running right now — fans, scrubber and biofilter?",
        options: [
          { label: "No — something is stopped", next: "fix-notrunning" },
          { label: "Yes — it is all running", next: "building" }
        ]
      },
      building: {
        q: "Are any big doors, hatches or inspection covers open?",
        hint: "An open roller door undoes the whole extraction system in seconds.",
        options: [
          { label: "Yes", next: "fix-doors" },
          { label: "No — everything is shut", next: "condenser" }
        ]
      },
      condenser: {
        q: "Is the condenser working properly — cooling water flowing, no vapour out the vent?",
        options: [
          { label: "No — vapour is getting out", next: "fix-condenser" },
          { label: "Yes — condenser is fine", next: "sources" }
        ]
      },
      sources: {
        q: "Check the other usual sources — old raw material, a full effluent sump, uncovered bins, spilled product.",
        options: [
          { label: "Found something", next: "fix-source" },
          { label: "Nothing found", next: "fix-escalate" }
        ]
      },
      "fix-notrunning": {
        fix: {
          title: "Odour control is not running",
          steps: [
            "Stop cooking. This is the one thing you do not run without.",
            "Start whatever has stopped, if it is safe and you are trained to.",
            "If it will not start, call maintenance and the supervisor immediately.",
            "Record the exact time it stopped and the time it came back.",
            "Expect to have to report this — write everything down as you go."
          ],
          escalate: "Treat this as a reportable event. The supervisor decides on notifying the regulator, not the operator."
        }
      },
      "fix-doors": {
        fix: {
          title: "Open doors letting the smell out",
          steps: [
            "Shut the doors and hatches now.",
            "Check the building pulls the doors shut again, which means extraction is working.",
            "Tell the team and the forklift drivers to keep doors shut.",
            "If a door has to stay open for work, get the supervisor to agree it first.",
            "Record what was open and for how long."
          ],
          escalate: "If a door will not close or a seal is damaged, raise a job the same day."
        }
      },
      "fix-condenser": {
        fix: {
          title: "Condenser not holding the vapour",
          steps: [
            "Cut the cooker feed back straight away to reduce the vapour load.",
            "Check the cooling water pump, flow and the cooling tower fan.",
            "Check the water in and out temperatures against normal.",
            "Check the condenser for fouling or a blocked tube bundle.",
            "Hold the feed low until the vent is clear again."
          ],
          escalate: "If the vapour does not clear, stop cooking and call maintenance and the supervisor."
        }
      },
      "fix-source": {
        fix: {
          title: "A specific smell source found",
          steps: [
            "Deal with it now: process old material, cover the bin, clean the spill, or pump down the sump.",
            "Hose the area down and make sure the drains run clear.",
            "Write down what it was and when you fixed it.",
            "Tell the supervisor so it can be stopped from happening again."
          ],
          escalate: "If it keeps coming back from the same place, it needs a permanent fix, not a daily clean-up."
        }
      },
      "fix-escalate": {
        fix: {
          title: "Smell with no obvious cause",
          steps: [
            "Note the time, the wind direction and exactly where you could smell it.",
            "Walk the boundary and mark the strongest point.",
            "Reduce the cooking rate while you investigate.",
            "Call the supervisor with your notes.",
            "If a member of the public has complained, record their details and the time, and pass them straight to the supervisor."
          ],
          escalate: "Every complaint must go to the supervisor the same shift, with the time, wind direction and what the plant was doing."
        }
      }
    }
  },

  /* ---------------------------------------------------------- */
  {
    id: "steam-low",
    area: "Boiler / Steam",
    icon: "\u{1F4A6}",
    title: "Steam pressure low across the plant",
    symptom: "Pressure down everywhere, cookers falling behind, boiler struggling",
    status: "draft",
    nodes: {
      start: {
        q: "Is the boiler firing?",
        options: [
          { label: "No — burner is off or locked out", next: "fix-burner" },
          { label: "Yes — it is firing hard but losing ground", next: "demand" }
        ]
      },
      demand: {
        q: "Has the steam demand suddenly gone up?",
        hint: "Several cookers starting together, a big washdown, or trace heating all coming on at once.",
        options: [
          { label: "Yes", next: "fix-demand" },
          { label: "No", next: "water" }
        ]
      },
      water: {
        q: "Is the boiler water level and feedwater normal?",
        options: [
          { label: "No — level is low or swinging", next: "fix-water" },
          { label: "Yes — level is steady", next: "fix-leak" }
        ]
      },
      "fix-burner": {
        fix: {
          title: "Boiler not firing",
          steps: [
            "Call the boiler attendant. Do not try to reset a boiler lockout unless you are the trained attendant.",
            "Cut all cooker feed back and stop raw intake.",
            "Note what the boiler fault display says.",
            "Keep odour control and the condenser running.",
            "Prepare for a controlled shutdown if it will not come back."
          ],
          escalate: "A boiler lockout is for the trained boiler attendant only. Never bypass a boiler safety device."
        }
      },
      "fix-demand": {
        fix: {
          title: "Too much demand at once",
          steps: [
            "Stage the load — do not start everything together.",
            "Hold off washdown and non-urgent trace heating until pressure recovers.",
            "Bring cookers up one at a time.",
            "Agree a starting order with the supervisor so it does not happen again."
          ],
          escalate: "If the plant simply cannot make enough steam for the planned run rate, that is a planning issue for the supervisor."
        }
      },
      "fix-water": {
        fix: {
          title: "Water level or feedwater problem",
          steps: [
            "Boiler attendant takes over from here.",
            "Check the feedwater tank level and temperature.",
            "Check the feedwater pump is running and not cavitating.",
            "Check for a stuck level control or a dirty sight glass.",
            "Reduce steam demand while it is sorted out."
          ],
          escalate: "Low water in a boiler is dangerous. If the level cannot be confirmed, the boiler must be shut down to the boiler procedure."
        }
      },
      "fix-leak": {
        fix: {
          title: "Steam is being lost somewhere",
          steps: [
            "Walk the steam lines and listen for leaks, including outside and in roof spaces.",
            "Check for traps blowing through, which dumps live steam.",
            "Check for a valve left open to a line that is not in use.",
            "Check the condensate return — a lot of flash steam there means a passing trap.",
            "Raise jobs for everything you find and keep the list."
          ],
          escalate: "Report any leak you can hear from a walkway straight away. Never approach a visible steam jet."
        }
      }
    }
  },

  /* ---------------------------------------------------------- */
  {
    id: "foreign-body",
    area: "Quality",
    icon: "\u{1F50E}",
    title: "Metal or foreign object found in product",
    symptom: "Metal detector alarm, magnet find, or something found in a bag or bin",
    status: "draft",
    nodes: {
      start: {
        q: "Has the affected product already left the site?",
        options: [
          { label: "No — it is still here", next: "onsite" },
          { label: "Yes — it has been dispatched", next: "fix-dispatched" },
          { label: "Not sure", next: "fix-dispatched" }
        ]
      },
      onsite: {
        q: "Can you tell which batch or time period it affects?",
        options: [
          { label: "Yes", next: "fix-hold-known" },
          { label: "No", next: "fix-hold-wide" }
        ]
      },
      "fix-hold-known": {
        fix: {
          title: "Hold the known batch",
          steps: [
            "Stop the line at that point.",
            "Put the batch on hold with a clear HOLD label, and move it away from good stock.",
            "Keep the object you found. Bag it, label it, do not throw it out.",
            "Write down the time, the machine, the batch and who found it.",
            "Find where it came from before restarting — check magnets, screens, broken machine parts and recent maintenance.",
            "Count the tools and parts from any recent job in that area."
          ],
          escalate: "The supervisor and quality decide whether the batch is released, reworked or dumped. Not the operator."
        }
      },
      "fix-hold-wide": {
        fix: {
          title: "Cannot pin the batch down — hold wide",
          steps: [
            "Hold everything made since the last good check. When in doubt, hold more, not less.",
            "Label it all HOLD and separate it from good stock.",
            "Keep the object, bagged and labelled.",
            "Check the machines upstream for missing or broken parts.",
            "Call the supervisor and quality now."
          ],
          escalate: "Widening a hold is cheap. A customer finding metal is not. Always hold wide when you are unsure."
        }
      },
      "fix-dispatched": {
        fix: {
          title: "Product may already have gone out",
          steps: [
            "Tell the supervisor and the quality manager immediately. This is urgent.",
            "Find the dispatch records: which customer, which batch, when it left.",
            "Keep the object and every record you have.",
            "Hold all remaining stock from the same batches.",
            "Do not contact the customer yourself — that is the manager's job."
          ],
          escalate: "This may become a recall. Management handles customer contact and any notification. Your job is accurate records, fast."
        }
      }
    }
  }

];
