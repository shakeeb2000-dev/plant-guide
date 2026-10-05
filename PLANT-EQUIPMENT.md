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
