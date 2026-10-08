# Plant equipment list

First pass, from memory. We'll tidy it up as you confirm things.
This list becomes the machine icons on the plant map, and one page per machine.

## Count so far

| # | Equipment | How many | Notes |
|---|---|---|---|
| 1 | Boilers | 2 | one big, one small |
| 2 | Cookers | 2 | |
| 3 | Dryers | 3 | |
| 4 | Decanters | 2 | |
| 5 | Press | 1 | |
| 6 | Separators | 3 | |
| 7 | Contra shear | 1 | |
| 8 | Evaporator system | 1 | |
| 9 | Silos | 3 | only 2 in use at the moment |
| 10 | Tallow tanks | 4 | |
| 11 | UCO tanks | 2 | |
| 12 | DAF | 1 | |
| 13 | Bins | to confirm | |
| 14 | Millings | to confirm | |
| 15 | Shakers | to confirm | |

That's around 27 machines plus the bins, mills and shakers. A very manageable
map — it will fit on one screen without being a spaghetti mess.

## Still to confirm

- [ ] How many bins, and what each one holds
- [ ] How many mills
- [ ] How many shakers
- [ ] Is there an odour control system? (extraction fans, scrubber, biofilter)
- [ ] Condenser / cooling tower?
- [ ] Anything on the loadout side — weighbridge, bagging, bulk-out
- [ ] Effluent side beyond the DAF — screens, sumps, balance tank

## What each machine is called on site

I need the real names so the labels match what's painted on them and what the
operators say. For example: `Cooker 1` and `Cooker 2`, or `Big Boiler` and
`Small Boiler`, or asset numbers.

| Equipment | What it's called on site |
|---|---|
| Boiler (big) | |
| Boiler (small) | |
| Cooker 1 | |
| Cooker 2 | |
| Dryer 1 | |
| Dryer 2 | |
| Dryer 3 | |
| Decanter 1 | |
| Decanter 2 | |
| Press | |
| Separator 1 | |
| Separator 2 | |
| Separator 3 | |
| Contra shear | |
| Evaporator | |
| Silo 1 | |
| Silo 2 | |
| Silo 3 (idle) | |
| Tallow tank 1-4 | |
| UCO tank 1-2 | |
| DAF | |

## How it all joins up — the important bit

The map is only useful if the arrows are right. These are the questions that matter:

1. **Raw material in:** where does it land first, and what does it go through before
   the cooker? (bin, contra shear, mill, shaker?)

2. **Cookers to dryers:** 2 cookers feeding 3 dryers. Can any cooker feed any dryer,
   or are they paired up? Does everything go cooker → dryer, or do some batches skip one?

3. **Which units do which species?** When you run ovine, is it a set cooker and dryer,
   or whatever's free?

4. **The fat side:** what order does the fat go through — press, decanters, separators,
   polishing, then which tanks? Which of the 3 separators does what?

5. **UCO:** do you receive used cooking oil, or produce it? Does it get processed
   through the same gear, or just stored and sold?

6. **Evaporator:** what goes into it, and where does the concentrate go? Back into the
   meal, or out as a separate product?

7. **Contra shear:** is it on the raw material side or the wastewater side feeding the DAF?

8. **Meal side:** dryer → shakers → mills → silos, or a different order?

9. **Anything that can be bypassed** when it's down?

---

# The map is now built — here is what I assumed

Open **Plant Map** in the app. Every machine with an orange **?** on it, and every
dashed arrow, is me guessing. Specifically:

| What I assumed | Right or wrong? |
|---|---|
| Ovine: pit → pre-shredder → metal detector → Cooker 1 → Decanter 1 | |
| Decanter solids → Dryer 1, fat + water → separators | |
| Mixed: pit → pre-shredder → metal detector → Cooker 2 → Press | |
| Press cake → Dryer 2 **or** Dryer 3 | |
| Both lines: dryer → bin → **shaker → mill → back to shaker** → finished storage | |
| Ovine finished meal → bagging. MBM finished meal → silos | |
| All 3 separators are shared between both lines | |
| Separators → inside storage tank → the 4 outside tallow tanks | |
| Contra shear is on the **water** side, screening effluent before the DAF | |
| Evaporator takes stickwater from the separators | |
| Evaporator concentrate goes **back into a dryer** | |
| Big boiler feeds the cookers, small boiler feeds Dryer 1 and the evaporator | |
| UCO tanks — **nothing connected**, because I do not know where they fit | |

## The one thing I changed on purpose

You described the meal end two different ways: *shaker → mill* for the ovine line, and
*mill → shaker* for the MBM line. I've drawn both the same way — **shaker first**, with
the oversize going to the mill and then back to the shaker, and the fines going on to
storage. That's the normal arrangement, but tell me if your plant really does run them
the other way round.

## Also left off the map for now

The biofilter and odour control, because you said to leave it. Say the word and I'll add
it, along with the condenser and the loadout end.

---

# Update — Blood Plant screen, 7 Oct 2026

Built from your photo of the `ATP - Blood_Plant` screen. The Blood Plant used to be
a single empty box on the map. It is now a full area with 30 machines in it.

## The big find

**The Blood Plant feeds the same three dryers as the meal.** The screen was showing
*"Blood To Dryer 2-3 Selected"*, and Dryers 1, 2 and 3 are drawn on it with their own
temperatures and amps. So at any moment a dryer could be taking press cake or blood.

That matters for three things, and all three need your boss's answer:

1. **Startup and shutdown order** — does the blood side start before or after the meal side?
2. **Species separation** — if blood and meal share a dryer, how is that handled on a
   changeover? Does the dryer get run empty between them?
3. **Fault finding** — "Dryer 1 exit temperature low" could now be a blood problem or a
   meal problem.

- [ ] Confirm Dryer 1, 2 and 3 on the Blood Plant screen are the same three machines as
      on the main dryer screen
- [ ] Is a dryer ever running blood and meal at the same time, or strictly one or the other?
- [ ] What happens on the changeover between them?

## What I read off the screen

| Tag | What I have called it | Confident? |
|---|---|---|
| BT1 | Blood Tank 1, level 3492, steam heated | Yes |
| BT1RP | BT1 recirculation pump | Guess — drawn as a loop back to the tank |
| BT1G | BT1 gate | Guess — do not know what it lets out |
| BT1SCW | BT1 screw conveyor | Guess — do not know where it discharges |
| BDFP | Blood Decanter Feed Pump | Yes |
| BFM / BPT | Flow 3003 and pressure 154 on that line | Yes |
| DFSOV | Decanter Feed Shut Off Valve, temperature 752 | Valve yes, number needs units |
| Alfa | Alfa Blood Decanter | Yes |
| BLM101 | Decanter outfeed screw | Yes |
| BLM102 | Blood meal bin, with BLM103 and BLM104 under it | Fairly confident |
| BLM105–BLM108 | The conveyor cascade | Order is a guess |
| BSV107 | Diverter on BLM107 | Yes |
| M267 | Transfer conveyor | Yes |
| V266 | Diverter valve — **was in alarm: "V266 Fail To Close"** | Yes |
| M266F / M266R | Reversible conveyor, forward and reverse | Yes |
| M268, M269 | Into Dryer 1 | Yes |
| M283, M281 | Into Dryer 2 | Yes |
| M293, M292 | Into Dryer 3 | Yes |
| M270, M271, M280 | Motors at the dryer ends | Guess — I called them blowers |
| SSOV, SPV | Steam shut off and pressure valves | Yes |
| FTWSOV, FTWSV | Flush water valves, part of the CIP Flush | Yes |

## Readings on the screen at the time

| | Temperature | Amps |
|---|---|---|
| Dryer 1 | 117 °C | 91 |
| Dryer 2 | 121 °C | 79 |
| Dryer 3 | 200 °C | 73 |

Dryer 3 at 200 °C is a long way off the other two and off the main dryer screen, which
showed 102–111 °C. Is that a different reading point, or does the blood side genuinely
run hotter?

## Two other things this screen settled

- **The steam pressures are in kPa.** The boiler header read 540 kPa here, so the 520 and
  500 on your main menu are kPa too. I have put the units on the boiler pages.
- **M258 and M259 are Cooker 2 drives, not dryer infeed screws.** The dryer feed motors on
  the blood side are all in the M266–M293 range, so the duplicate I flagged earlier is
  resolved. But that leaves the **real numbers of the three meal-side dryer infeed screws
  unknown** — please read them off the Dryer Infeed screen.

## Still to ask about the Blood Plant

- [ ] What is the order of the BLM conveyor cascade, BLM105 through BLM108?
- [ ] What does BT1G let out, and where does BT1SCW discharge to?
- [ ] Is the 752 on the DFSOV temperature box really 75.2 °C?
- [ ] What are M270, M271 and M280 actually driving?
- [ ] What does the CIP Flush do, step by step, and how often is it run?
- [ ] What is the "Check Boiler Low Pressure" limit set to, and what do you do when it shows?
- [ ] Was "V266 Fail To Close" a live fault, or does it sit there all the time?
- [ ] What is the finished product off the blood side, and where does it go?

---

# Update — Dryer Infeed and Dryer Outfeed screens, 7 Oct 2026

These two screens were the most useful yet. They threw out a lot of my guesses and
joined the whole middle of the plant together properly.

## The shape of it, now that I can see it

```
Plant 1 solids ──► M180 ─► M181 ─► M182 ─► V182 ──┐
Plant 2 cake   ──► M264 ─► M265 ─────────► V265 ──┼─► M267 ─► V266 ─► M266F/M266R
Blood meal     ──► BLM108 ────────────────────────┘                        │
                                                                           │
                                          ┌────────────────┬───────────────┤
                                       M268                M283          M293
                                        │                    │             │
                                       M269                  │             │
                                        ▼                    ▼             ▼
                                     Dryer 1              Dryer 2       Dryer 3
                                        │                    │             │
                                      M274                 M284          M294
                                      M276                   │            M295
                                      M278                   │             │
                                    V301A/B              V302A/B       V303A/B
                                      M301                 M302          M303
                                        └──────── M311 / M321 ───────────┘
                                                  │            │
                                               V312          V324
                                             M312 (Line 1)  M322 (Line 2)
                                             M323                 │
                                             Bag Out         to the silos?
```

## The one big thing this settled

**M267 is the single choke point of the entire plant.** Line 1, Line 2 and the blood
plant all land on that one conveyor. If M267 stops, nothing reaches any dryer, from any
of the three sources. That deserves its own line in the shutdown and fault procedures.

Right after it, **M266 running forward or reverse is what picks the dryer.**

## How the dryers get chosen

The buttons across the top of the Dryer Infeed screen:

| | Can be sent to |
|---|---|
| **Line 1** | Dryer 1 **or** Dryer 2. One at a time only. |
| **Line 2** | Dryer 1, 2 or 3 — or two at once (1+2, 1+3, 2+3) |

When you took the photo: Line 1 → Dryer 1. Line 2 → Dryer 2 and 3.

- [ ] Why can Line 1 only ever use one dryer, while Line 2 can use two?
- [ ] Why is Dryer 3 never offered to Line 1?
- [ ] If Line 1 and Line 2 both want Dryer 1, what stops them clashing?

## Dryer 3's 200 °C — answered

It is a **chamber** reading, and the **exit** was only 109 °C at the same moment, right in
line with the other two. So it is not a runaway. But its chamber still reads ~80 °C hotter
than Dryers 1 and 2, which sat near 120 °C.

- [ ] Is Dryer 3's chamber genuinely that much hotter, or is that sensor reading wrong?

## Live readings off the two screens

| | Chamber | Exit | Amps |
|---|---|---|---|
| Dryer 1 | 118 °C | 119 °C | 88–89 |
| Dryer 2 | 121–122 °C | 112 °C | 81 |
| Dryer 3 | 200 °C | 109 °C | 75 |

Dryer 1's exit (119) reading higher than its chamber (118) looks odd too — worth a glance.

## Guesses I have now thrown out

| I used to say | Actually |
|---|---|
| M253, M254, M256 were the dryer infeed | Not on the screen at all. Replaced with M180–M182 and M264–M265. |
| M265 was a Dryer 1 outfeed screw | It is on the **infeed** side, carrying Line 2. |
| M271 was a Dryer 2 outfeed screw | It is the Dryer 1 **fan** motor. |
| M273, M279, M281 were outfeed screws | M281 is the Dryer 2 fan. The other two are not on the screen. |
| VN52 and VN57 were diverter valves | Not there. The real ones are V301A/B, V302A/B, V303A/B, V312 and V324. |
| M266–M293 belonged to the Blood Plant | They are the shared Dryer Infeed run. Moved. |

## Fan and drive motors, now identified

| | Fan | Drive |
|---|---|---|
| Dryer 1 | M271 | M270 |
| Dryer 2 | M281 | M280 |
| Dryer 3 | M292 | not labelled on the screen |

- [ ] What is Dryer 3's drive motor number?

## Product split — confirmed

The outfeed screen labels **M312 as "Line 1"** and **M322 as "Line 2"**, and the Line 1 side
ends at a point marked **"Bag Out"**. That confirms what you told me: ovine gets bagged.

- [ ] Where exactly does M322 (Line 2) land — the shaker, the mill, or straight into a silo?
- [ ] Is there a magnet or metal detector before the bagger?

## Still to ask about these two areas

- [ ] On V301A/B, V302A/B and V303A/B — what does A do and what does B do?
- [ ] Which dryers feed M311, and which feed M321?
- [ ] The "Dryer 2 Infeed Time 444" on M283 — is that seconds? What is it for?
- [ ] Three valve alarms were showing at once: V182 Fail To Open, V265 Fail To Close,
      V266 Fail To Close. Are they real faults, or do they sit there all the time?
- [ ] The Dryer Infeed screen has its own Auto Start and Auto Stop. Does the operator
      normally use those, or start each conveyor by hand?
- [ ] Boiler header was 560 kPa here, 540 kPa on the blood screen. What is the low
      pressure limit that triggers "Check Boiler Low Pressure"?
- [ ] The Ovine Vertical Screw — I have it as M190–M193 from a blurry photo, but the
      Line 1 conveyors are M180–M182, so my numbers are probably wrong. What is painted
      on it?

---

# Update — Liquid Phase and Trade Waste Tanks screens, 7 Oct 2026

## Liquid Phase — I was wrong about the decanters

**There are three decanters, not two.**

| Decanter | Make | Where |
|---|---|---|
| Plant 1 | Gtech | The ovine side |
| Plant 2 | Gtech | Tag M201, with back drive M201BD |
| Plant 2 | Alfa | A separate machine again |

I had been treating "the Alfa" and "the Plant 2 decanter" as one thing. They are two
different machines, both on Plant 2.

- [ ] Do the Plant 2 Gtech and the Plant 2 Alfa run together, or one at a time?
- [ ] What does each one do differently?

## How the liquid side actually runs

```
Twin Screw Press ─► P262 ─► catch tank ─► WV262 ─┐
                                                 ├─► TALLOW BUFFER TANK (80 °C, steam SV200)
Cooker 2 ────────► M261 ─► catch tank ─► WV261 ─┘            │
                                                        PV200 / WV200
                                                             │
                                                            P200
                                                   ┌─────────┴─────────┐
                                              PV205/WV205           PV201
                                                   │                   │
                                            ALFA — PLANT 2      GTECH — PLANT 2
                                              │        │               │
                                            M205   PSW205 ─► Trade Waste
                                          (solids)                   M202 (solids)
                                                                     M257 (screen)
                                                                     WV201 ─► P257 ─► LQ 3 Tank 2

GTECH — PLANT 1 ─► M178 ─► M179 ─► M176 (screen) ─► WV177 ─► P177 ─► LQ 3 Tank 1
   (S175 HL/LL)   └─► P175 ─► ?
```

### Other Liquid Phase corrections

- **M169 is not a buffer tank.** I had it on the Plant 1 cooker page as a tank. It is drawn
  at the end of the Plant 1 Gtech decanter, so it belongs here. What it drives is still unclear.
- **The Plant 1 outfeed screws are M178 and M179.** I had M174 from the cooker screen.
  Either M174 is a third screw or one of my readings is wrong.
- **Both tallow feed tanks are labelled "LQ 3".** I have numbered them 1 and 2 myself.

### Things to walk down here

- [ ] Do P262 and M261 push **into** the buffer tank, or pull **out** of it? The screen does
      not show arrows and I have guessed "into".
- [ ] What are the two small tanks between P262/M261 and the WV valves? Tag numbers?
- [ ] What is PO205 pumping — into the Alfa, or out of the Gtech side?
- [ ] Where does P175 discharge to? I have guessed the M257 screen.
- [ ] What is LV200 for — a drain, or level control?
- [ ] What are M257 and M176 really? I have called them screens because of the shape.
- [ ] Where does Hot Flush Water tie in?
- [ ] What are the two LQ 3 tanks called on site?
- [ ] The Plant 2 Gtech back drive trip (M201BD) was showing. Real, or always there?

## Trade Waste — the chemicals are now named

| Pump | Chemical |
|---|---|
| DP1 | Acid, into Tank 1 |
| DP2 | Coagulant |
| DP3 | Polymer |
| DP4 | Caustic |
| DP7 | Hydrogen peroxide, up at V2 |
| DP8 | Hydrogen peroxide, into the DAF line |

I previously had DP5 as peroxide. DP5 is not on this screen; DP7 and DP8 are the peroxide
pumps. DP2 I had as unknown — it is the coagulant.

### The flow

```
Contra Shear waste water ─► TANK 1 (SM1 mixer, DP1 acid, RC1)
                              │
                             P3 ─► V1 ─► FT1 (flow 20)
                              │
                 DP2 coag, DP3 polymer, DP4 caustic, DP8 H2O2 all dose in
                              │
                            ► DAF ─► P4 ─► V2 (+ DP7 H2O2) ─┬─► TANK 3 (level 3016, SV3)
                                                             └─► TANK 4 (level 362, SV4)
                                                                   │            │
                                                                  P5           P6
                                                                  V7           V8
                                                                   └─── OUT ───┘
                                                    FT2 = 13 · TT3 = 394 · PH3 = 6.55
```

### Two things this settled for good

- **The contra shear is on the water side.** The inlet is literally labelled "Waste Water
  From Contra Shear". That question is now closed.
- **There is only one DAF on this screen.** I had drawn two. If there is a second, it will
  be behind the "Daff" button.

### The numbers that matter most

The three readings on the bottom line — flow 13, temperature 394 (probably 39.4 °C) and
pH 6.55 — are what actually leaves your site. Those are almost certainly the numbers your
trade waste licence is written around.

- [ ] What are the licence limits for flow, temperature and pH at that point?
- [ ] What does the operator do when one drifts out of range?

### Still to ask about Trade Waste

- [ ] PH2 reads 0.06, which cannot be a pH. What is it?
- [ ] What are SM1 and RC1?
- [ ] Are Tanks 3 and 4 filled one at a time? Tank 3 was at 3016 and Tank 4 at 362.
- [ ] What are the level units on Tanks 3 and 4?
- [ ] What are SV3 and SV4 — vents?

## Two more screens I now know exist

The Trade Waste screen has its own buttons for them:

- [ ] **Daff** — probably has the saturators, the sludge tank and the blood transfer pump
- [ ] **Contra Shear** — the screening detail

Please photograph both. The sludge/blood tank matters because it is what feeds BT1 over in
the blood plant, and right now that link is a guess.

---

# Update — Tank Farm and Contra Shear Room screens, 7 Oct 2026

## The UCO question is answered

I have been asking about this since the first version. The tank farm screen shows it:

| Tank | Capacity | Level at the time |
|---|---|---|
| **I.C.O. RECEIVAL TANK** | 26 T | 0.7 T |
| **I.C.O. DESPATCH TANK** | 46 T | 34.7 T |

So they are not a matched pair of storage tanks. One takes oil **in**, the other sends
oil **out**. Note the screen says **I.C.O.**, not UCO — I had the name wrong too.

- [ ] What does I.C.O. stand for on site?
- [ ] Where does the receival oil come from, and does it get processed through your gear
      or just stored and resold?
- [ ] Is the despatch tank filled from the tallow tanks, or only from receival?

## The tank farm

```
Tallow Transfer Tank 2 ─► PV1 ─► PV2 ─► P150 ─► FM1 ─► V2 ─┬─► TALLOW TANK 1  (82 T)
                                                            └─► V3 ─┬─► TALLOW TANK 2
            AV1 / AV2 / PV3 / PV4 cross-connect                     └─► I.C.O. DESPATCH (46 T)

Tallow Transfer Tank 1 ─► PV5 ─► PV6 ─► P151 ─► FM2 ─► V1 ─┬─► TALLOW TANK 4  (82 T)
                                                            ├─► TALLOW TANK 5  (44 T)
                                                            └─► I.C.O. RECEIVAL (26 T)
```

Each transfer tank has its own pump and its own flow meter, and each line fills **one
selected tank at a time**. When you took the photo it was "Tank 1 Selected" on the top
line and "Tank 4 Selected" on the bottom.

### Things I noticed

- **There is no Tank 3.** The tanks are numbered 1, 2, 4 and 5. Was there a Tank 3 once?
- **Levels look like tonnes**, since the capacities on the buttons are in T.
- Tank 4 was at 81.2 of 82 T — nearly full. Tank 5 was empty.
- Tallow Tank 2 has no capacity shown on the screen.

### To ask

- [ ] Is there a Tank 3, and if not, why the gap in the numbering?
- [ ] What is Tallow Tank 2's capacity?
- [ ] What do AV1, AV2, PV3 and PV4 do? I have guessed they let either transfer tank feed
      either pump.
- [ ] Which tanks hold which grade or species? This is the page that will matter most for
      not downgrading a whole tank.
- [ ] How is a road tanker actually loaded, and from which tanks?
- [ ] Does each tank have its own heating, and what temperature is it held at?

## Contra Shear Room — now its own area on the map

```
MAIN PIT (Pump 1, Pump 2, level sensor)
    │
    ▼
CONTRA SHEAR  ──► screenings out to ??
    │
    ▼
COLLECTION TANK (CTLT = 361)
    │
 CP1M102 / CP1M103
    │
    ▼
TANK 1, Trade Waste Plant
```

This completes the water path. Everything on site drains to the Main Pit, gets lifted to
the contra shear, screened, and pumped over to Tank 1.

### The one that matters

- [ ] **Where do the screenings go?** The contra shear takes solids out of the water and
      the screen does not show where they end up. If they go back into the raw material,
      that affects species separation and needs to be in the procedures. If they go to a
      bin, that is a different answer. This is the most important open question on this
      screen.

### Also to ask

- [ ] Are Pump 1 and Pump 2 duty/standby, or do both run together?
- [ ] Do those pumps have tag numbers? The screen just calls them Pump 1 and Pump2.
- [ ] What are the two "?" marks on the contra shear unit? Even the HMI does not label them.
- [ ] What are the units on CTLT (361)?
- [ ] Are CP1M102 and CP1M103 duty/standby too?
- [ ] What happens if the Main Pit fills faster than the pumps can clear it?

## Where the map is now

| | |
|---|---|
| Areas | 18 |
| Machines | 227 |
| Connections | 221 |
| Still marked as my guess | 26 |

There is a checker now: `node tools/check-map.js` validates every arrow, every machine id
and every area link, so a typo cannot quietly break the drawing.

## The one screen still missing

- [ ] **Daff** — reachable from the Trade Waste Tanks screen. Probably holds the saturators
      and the sludge/blood tank. That tank is what feeds BT1 in the blood plant, and right
      now that connection is the last guess in the whole water path.

After that, the only area without a screen is **Silos & Milling**.

---

# Update — your UCO correction, and the Bins / Mills screens

## Correction: UCO, and it is a separate system

You told me two things I had wrong:

1. The tanks are **UCO**, not ICO. I misread the screen.
2. **The UCO side does not connect to anything inside the plant.**

How it actually works:

```
UCO tanker in ──► UCO 6 (receival, 26 T)
                      │  once it reaches temperature
                      ▼
                  UCO 3 (despatch, 46 T) ──► despatch tanker out
```

I had wrongly drawn the tallow transfer lines feeding into both UCO tanks. Those arrows are
gone. The UCO tanks now sit on the map as their own little loop, which is what they are.

- [ ] What temperature does UCO 6 have to reach before you transfer it?
- [ ] Is that transfer automatic on temperature, or does the operator start it?
- [ ] Why does it need heating before transfer — is it just to make it pump?
- [ ] Are UCO 6 and UCO 3 the names used on site, and is there a UCO 1, 2, 4, 5?

## The big find: there are SIX bins, and each one is a species

This is the answer to how segregation actually works on your plant.

| Bin | Name on the screen | Level at the time |
|---|---|---|
| Bin No.1 | **BOVINE-1** | 46.7 % |
| Bin No.2 | **OVINE-2** | 54.9 % |
| Bin No.3 | **BUFFER-3** | 34.8 % |
| Bin No.4 | **CHICKEN-4** | 0.1 % |
| Bin No.5 | **WOOL-5** | — |
| Bin No.6 | **WOOL-6** | — |

And the dryer outfeed page on that same older system shows, for each dryer, **which bin,
which line, and which species**. When you took the photos:

| Dryer | State | Feeding | Species |
|---|---|---|---|
| Dryer 1 | Standby | Bin 1 in Line 1 | **BEEF NOW** |
| Dryer 2 | Not running | Bin 4 in Line 2 | **POULTRY NOW** |
| Dryer 3 | Running | Bin 4 in Line 2 | **POULTRY NOW** |

Bin 1 is BOVINE and Dryer 1 said BEEF. Bin 4 is CHICKEN and Dryers 2 and 3 said POULTRY.
It lines up exactly.

**So the species changeover is really a bin changeover.** I have rewritten the changeover
procedure around that, with a new step for switching the dryer outfeed to the right bin,
and a warning that M267 and M266 are shared by every line including the blood meal.

- [ ] Please check that new step with your boss — it is the most important page in the book.

### Questions on the bins

- [ ] **What is WOOL?** Two bins are named WOOL-5 and WOOL-6 and you have not mentioned
      that product before. What is it, and why two bins?
- [ ] **What is BUFFER-3 for?** It is named after a job, not a species.
- [ ] Chicken is in there as a species. Is poultry a regular run?
- [ ] Each dryer has an "Auto Stop to bin" and a "Quick Stop to bin". What is the
      difference, and when do you use each?
- [ ] What are the bin level units, and at what level do you have to stop feeding?

## Shakers and mills — counts confirmed

- **3 shakers** (Shaker 1, 2, 3)
- **4 mills** (Mill 1, 2, 3, 4)

Readings at the time: Mill 1 = 0 A, Mill 2 = 34 A, Mill 3 = 0 A, **Mill 4 = 70 A**.
So two mills were stopped and Mill 4 was working twice as hard as Mill 2.

The screen also showed three bins feeding three different shakers at once:
Bin 4 → Shaker 3, Bin 3 → Shaker 1, Bin 1 → Shakers 1 and 2, and "Going to Silo No.1".

- [ ] What is a normal amp range for a mill, and what is too high?
- [ ] Which shaker pairs with which mill, or can any feed any?
- [ ] Is it shaker then mill, or mill then shaker? Still not settled.
- [ ] Why were two mills stopped — normal, or were they down?

## There are TWO control systems

This is worth writing down because it matters for training.

| | Newer system | Older system |
|---|---|---|
| Look | FactoryTalk, colourful | Grey and green, flat |
| Covers | Receival, cookers, dryers, liquid phase, tanks, trade waste, blood | Dryer outfeed to bins, milling, load-out |
| Menu | Main page with plant areas | DRYERS / MILLING / LOAD-OUT |
| Noted | — | Dated 2023, at 192.168.1.233 |

An operator has to use both. A new starter needs telling that outright.

- [ ] Are both systems on the same control room PC, or different screens?
- [ ] Which one is the "master" if they disagree?

## What I could not read

The middle of the SilosExitToMills screen is a dense web of conveyors with M numbers too
small to read in the photo. I have drawn the bins, shakers, mills and silos, with routing
blocks standing in for the conveyor network.

- [ ] A closer photo of just the middle of that screen and I can put every conveyor in.

## The last screen missing

- [ ] **LOAD-OUT** — one of the three buttons on the older system's menu.
- [ ] **Daff** — on the trade waste side, for the saturators and the sludge/blood tank.

After those two, every area has a screen behind it.

---

# Update — ShakersToSilos and LOAD-OUT screens, plus your corrections

## Your two corrections, now in the app

**1. Only MBM goes into a silo.** Ovine and bovine go straight to bagging and never see a
silo. The map now splits the product after the mills: MBM to the silos, ovine and bovine
to bagging.

**2. Chicken is no longer run.** Bin 4 is marked out of use.

> **Something worth raising with your boss.** The screens still say **CHICKEN-4**,
> **POULTRY NOW** on two dryers, and the load-out screen was showing
> *"21.0 Tonnes of POULTRY"*. If chicken has not been run for a while, those are stale
> labels sitting on live screens. That is exactly how a species mix-up happens — an
> operator trusts the word on the screen. Either the labels should be changed, or every
> operator needs telling that they are leftovers.

- [ ] Was that load-out photo old, or does the screen genuinely still say POULTRY?
- [ ] Has Bin 4 been reused for something else?
- [ ] **Which of the six bins holds the MBM?** None of them is named MBM, and that is now
      the biggest gap in the meal path.

## Settled at last: shaker, then mill, then silo

The screen is called **ShakersToSilos** and it is laid out shakers at the top, mills in the
middle, silos at the bottom. So the order is:

```
BIN ─► SHAKER ─► MILL ─► (MBM) SILO ─► container
                      └─► (ovine / bovine) BAGGING
```

That question has been open since the very first version. Closed.

## The silos

| Silo | Level | Note |
|---|---|---|
| Silo 1 | 51.0 % | |
| Silo 2 | 44.3 % | |
| Silo 3 | 82.4 %, later 92.4 % | **Feed stops at 90 %, restarts below 90 %** |

All three are in use. I had been told earlier only two were, so either that changed or I
misheard.

That 90 % cut-out on Silo 3 is the kind of thing a new operator would otherwise find out
the hard way. It is now on the Silo 3 page.

- [ ] Do Silos 1 and 2 have the same automatic cut-out, or only Silo 3?
- [ ] What are the silo capacities in tonnes?

## Mills, second reading

| | First photo | Second photo |
|---|---|---|
| Mill 1 | 0 A | 0 A |
| Mill 2 | 34 A | 29 A |
| Mill 3 | 0 A | 0 A |
| Mill 4 | 70 A | 80 A |

Mills 1 and 3 were stopped **both** times, and Mill 4 is doing roughly twice the work of
Mill 2.

- [ ] Are Mills 1 and 3 spares, on standby, or out of service?
- [ ] Is Mill 4 meant to carry that much more than Mill 2?
- [ ] What is a normal amp range, and what is too high?

## The LOAD-OUT screen — and a new procedure

This was the last missing screen on the older system. It shows:

- A silo selected (Silo 3 at the time) with **Start silo outfeed**, **Auto Stop** and
  **Quick Stop**
- A container selected (Container 2) and the tonnes going in (21.0 T)
- A picture of a tipper and a forklift at the loading point
- **An eight-point container inspection checklist, ticked off on the screen**

That checklist is the most useful thing you have sent me, because it is already in use.
I have written it up as a new procedure: **Support jobs → Container Load-Out**, twelve
steps, built around your eight checks plus the silo and sealing steps either side.

The checks as best I could read them:

1. Correct container selected
2. Correct seal provided
3. Container checked for seal/damage — reject if damaged
4. Floor condition checked — reject if not sound
5. Inspect for foreign bodies, remove them, check again
6. Container swept out
7. Container labelled with the silo and product
8. (one more I could not read)

- [ ] **Read those eight off the screen and correct my wording.** This is the page closest
      to being approvable as it stands.
- [ ] What is check number 8?
- [ ] What is the difference between Auto Stop and Quick Stop on the silo outfeed?
- [ ] What does the red warning about the finish-down conveyor say?
- [ ] Is there a magnet or metal detector before the container or the bagger?
- [ ] Is the tonnage from a weighbridge or from load cells on the silo?

## Where the map is now

| | |
|---|---|
| Areas | 18 |
| Machines | 248 |
| Connections | 246 |
| Still marked as my guess | 29 |
| Procedures | 9 |

## What is left

- [ ] **Daff** screen — the saturators and the sludge/blood tank. Last guess in the water path.
- [ ] A closer photo of the **middle of the milling screen**, for the conveyor numbers.
- [ ] Is there a screen for the **bagging** line, or is it manual?

Every area now has at least one real screen behind it except bagging.
