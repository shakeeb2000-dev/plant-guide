/* =============================================================
   MACHINE ICONS
   One hand-drawn icon per type of machine, used on the plant map
   and on each machine's own page.
   Each icon is drawn inside a 24 x 24 box and uses the line colour
   it is given, so the same icon works at any size and any colour.
   ============================================================= */

window.MACHINE_ICONS = {

  /* raw material pit / tipping pit */
  pit:
    '<path d="M2.5 6.5h19l-2.8 10.2a1.2 1.2 0 0 1-1.2.9H6.5a1.2 1.2 0 0 1-1.2-.9L2.5 6.5Z"/>' +
    '<path d="M1.5 6.5h21"/>' +
    '<path d="M8.5 9.8h7M9.8 12.8h4.4"/>' +
    '<path d="M10 17.6v2.4h4v-2.4"/>',

  /* pre-shredder / pre-breaker */
  shredder:
    '<rect x="2.8" y="4.2" width="18.4" height="8.4" rx="1.6"/>' +
    '<circle cx="8.6" cy="8.4" r="2.3"/>' +
    '<circle cx="15.4" cy="8.4" r="2.3"/>' +
    '<path d="M8.6 6.1v4.6M6.3 8.4h4.6M15.4 6.1v4.6M13.1 8.4h4.6"/>' +
    '<path d="M12 13.6v3.2"/>' +
    '<path d="M10.2 15.2 12 17l1.8-1.8"/>' +
    '<path d="M6.5 19.8h11"/>',

  /* metal detector over a belt */
  metaldetector:
    '<path d="M4.4 19.2V10a7.6 7.6 0 0 1 15.2 0v9.2"/>' +
    '<path d="M7.6 19.2v-9.2a4.4 4.4 0 0 1 8.8 0v9.2"/>' +
    '<circle cx="12" cy="12.4" r="1.5"/>' +
    '<path d="M1.6 19.2h20.8"/>' +
    '<path d="M4 21.4h16"/>',

  /* cooker — jacketed vessel with an agitator */
  cooker:
    '<rect x="2.4" y="7.6" width="19.2" height="9.6" rx="4.8"/>' +
    '<rect x="4.6" y="9.6" width="14.8" height="5.6" rx="2.8"/>' +
    '<path d="M4.6 12.4h14.8"/>' +
    '<path d="M7.4 10.2v4.4M10.4 10.2v4.4M13.4 10.2v4.4M16.4 10.2v4.4"/>' +
    '<path d="M8 6.4c.9-.7.2-1.8 1.1-2.5M12 6.1c.9-.7.2-1.8 1.1-2.5M16 6.4c.9-.7.2-1.8 1.1-2.5"/>' +
    '<path d="M6 19.4h12"/>',

  /* decanter — horizontal bowl, solids one way, liquid the other */
  decanter:
    '<path d="M2.6 8.4h11.6l5.8 3.6-5.8 3.6H2.6a.6.6 0 0 1-.6-.6V9a.6.6 0 0 1 .6-.6Z"/>' +
    '<path d="M4.6 9.6 7.4 14.4M8 9.6l2.8 4.8M11.4 9.6l2.8 4.8"/>' +
    '<path d="M20.4 12h2.2"/>' +
    '<path d="M21 10.8 22.6 12 21 13.2"/>' +
    '<path d="M7 16.2v2.2M11 16.2v2.2"/>' +
    '<path d="M4.4 5.6a5 5 0 0 1 8 0"/>' +
    '<path d="M12.4 5.6 11 4.6M12.4 5.6l-1.6.9"/>',

  /* screw press */
  press:
    '<path d="M2.6 8.2h11.8l4.6 3.8-4.6 3.8H2.6a.6.6 0 0 1-.6-.6V8.8a.6.6 0 0 1 .6-.6Z"/>' +
    '<path d="M4.4 9.4 7.2 14.6M7.8 9.4l2.8 5.2M11.2 9.4l2.8 5.2"/>' +
    '<path d="M19.4 12h3"/>' +
    '<path d="M20.6 10.8 22.4 12l-1.8 1.2"/>' +
    '<path d="M5 16.4v2.2M8.4 16.4v2.8M11.8 16.4v2.2M15 16.4v2.8"/>' +
    '<path d="M3.5 21.2h13"/>',

  /* disc separator / centrifuge */
  separator:
    '<path d="M12 2.4v3"/>' +
    '<path d="M6.2 9.6c0-2.1 2.6-3.8 5.8-3.8s5.8 1.7 5.8 3.8-2.6 4.2-5.8 4.2-5.8-2.1-5.8-4.2Z"/>' +
    '<path d="M8.4 8.4h7.2M9.6 10.6h4.8"/>' +
    '<path d="M9.4 13.6v3.2h5.2v-3.2"/>' +
    '<rect x="6.8" y="16.8" width="10.4" height="3.2" rx="1.2"/>' +
    '<path d="M17.6 4.6a3.4 3.4 0 0 1 1.6 2.8"/>' +
    '<path d="M19.2 7.4 18 6.2M19.2 7.4l1.2-1"/>',

  /* dryer — drum with hot air in and vapour out */
  dryer:
    '<rect x="3.4" y="8" width="17.2" height="8.8" rx="4.4"/>' +
    '<path d="M3.4 12.4h17.2"/>' +
    '<path d="M7 9.6v5.6M11 9.6v5.6M15 9.6v5.6M18.4 9.6v5.6"/>' +
    '<path d="M0.8 12.4h2.4"/>' +
    '<path d="M1.8 11.2 3.2 12.4 1.8 13.6"/>' +
    '<path d="M16 6.2c.9-.7.2-1.8 1.1-2.5M19 6.2c.9-.7.2-1.8 1.1-2.5"/>' +
    '<path d="M6.6 18.6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0"/>' +
    '<path d="M14.4 18.6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0"/>',

  /* storage bin / hopper */
  bin:
    '<path d="M3 7.4h18l-2.6 10.4H5.6L3 7.4Z"/>' +
    '<path d="M1.8 7.4h20.4"/>' +
    '<path d="M6.6 10.6h10.8"/>' +
    '<path d="M9.6 17.8v2.8h4.8v-2.8"/>' +
    '<path d="M12 20.6v1.4"/>',

  /* vibrating shaker screen */
  shaker:
    '<path d="M3 10.6 19.4 7.2"/>' +
    '<path d="M3.9 14.2 20.3 10.8"/>' +
    '<path d="M3 10.6l.9 3.6M19.4 7.2l.9 3.6"/>' +
    '<path d="M7.4 15.8v2.4M11 15.1v2.4M14.6 14.4v2.4"/>' +
    '<path d="M4.4 20.4h15.2"/>' +
    '<path d="M21.2 5.4a2.6 2.6 0 0 1 0 4"/>' +
    '<path d="M1.6 12.4a2.6 2.6 0 0 1 0-4"/>',

  /* hammer mill */
  mill:
    '<circle cx="12" cy="12.4" r="6.4"/>' +
    '<circle cx="12" cy="12.4" r="1.4"/>' +
    '<path d="M12 11 14.6 8.4M12 13.8 9.4 16.4M10.6 12.4 8 9.8M13.4 12.4 16 15"/>' +
    '<path d="M12 2.2v3.8"/>' +
    '<path d="M10.2 3.6 12 2.2l1.8 1.4"/>' +
    '<path d="M12 18.8v2.8"/>' +
    '<path d="M9.4 21.6h5.2"/>',

  /* silo */
  silo:
    '<path d="M5.4 9c0-3.1 2.9-5.2 6.6-5.2S18.6 5.9 18.6 9"/>' +
    '<path d="M5.4 9v6l6.6 4 6.6-4V9"/>' +
    '<path d="M5.4 9h13.2"/>' +
    '<path d="M12 3.8V2"/>' +
    '<path d="M9.6 19.4 8.6 21.8M14.4 19.4l1 2.4"/>' +
    '<path d="M12 19v2.8"/>',

  /* vertical storage tank */
  tank:
    '<rect x="4.8" y="4.6" width="14.4" height="14.6" rx="1.8"/>' +
    '<path d="M4.8 7.8h14.4"/>' +
    '<path d="M4.8 13.4c2 0 2.6-1.1 4.8-1.1s2.8 1.1 4.8 1.1 2.6-1.1 4.8-1.1"/>' +
    '<path d="M7.8 19.2v2.4M16.2 19.2v2.4"/>' +
    '<path d="M11 2.4h2"/>' +
    '<path d="M12 2.4v2.2"/>',

  /* boiler */
  boiler:
    '<rect x="5.4" y="6.4" width="13.2" height="12.4" rx="2"/>' +
    '<path d="M15 6.4V2.6h3.4v3.8"/>' +
    '<path d="M12 16.2c-1.4 0-2.4-1-2.4-2.2 0-1.8 2.4-2.8 2.4-4.8 0 2 2.4 3 2.4 4.8 0 1.2-1 2.2-2.4 2.2Z"/>' +
    '<circle cx="8" cy="9" r="1.2"/>' +
    '<path d="M8 18.8v2.6M16 18.8v2.6"/>',

  /* evaporator column */
  evaporator:
    '<rect x="7" y="6.2" width="10" height="13" rx="2.2"/>' +
    '<path d="M9.6 8.4v8.6M12 8.4v8.6M14.4 8.4v8.6"/>' +
    '<path d="M7 8.4h10"/>' +
    '<path d="M9 4.6c.8-.9 1.6-.9 2.4 0M13 4.6c.8-.9 1.6-.9 2.4 0"/>' +
    '<path d="M4.4 11.2H7M17 15.4h2.6"/>' +
    '<path d="M8.6 19.2v2.4M15.4 19.2v2.4"/>',

  /* contra shear — rotating drum screen on the water side */
  contrashear:
    '<rect x="3.2" y="7.8" width="17.6" height="8.4" rx="4.2"/>' +
    '<circle cx="7.6" cy="10.6" r=".75"/><circle cx="11" cy="10.6" r=".75"/>' +
    '<circle cx="14.4" cy="10.6" r=".75"/><circle cx="17.4" cy="10.6" r=".75"/>' +
    '<circle cx="9.2" cy="13.6" r=".75"/><circle cx="12.6" cy="13.6" r=".75"/>' +
    '<circle cx="16" cy="13.6" r=".75"/>' +
    '<path d="M0.8 12h2.4"/>' +
    '<path d="M1.8 10.8 3.2 12 1.8 13.2"/>' +
    '<path d="M20.8 12h2.4"/>' +
    '<path d="M6.5 18v2M10 18v2.6M13.5 18v2M17 18v2.6"/>',

  /* DAF — dissolved air flotation */
  daf:
    '<rect x="3" y="7" width="18" height="11.4" rx="1.6"/>' +
    '<path d="M3 10.6h18"/>' +
    '<path d="M5.6 8.8h5.4"/>' +
    '<circle cx="7" cy="14.4" r=".9"/><circle cx="10.4" cy="16" r=".7"/>' +
    '<circle cx="13.4" cy="14" r=".9"/><circle cx="16.6" cy="15.6" r=".7"/>' +
    '<path d="M0.8 13h2.2M21 13h2.2"/>' +
    '<path d="M6 18.4v2.6M18 18.4v2.6"/>',

  /* bagging / packing */
  bagging:
    '<path d="M9.4 2.4h5.2l-.8 4h-3.6l-.8-4Z"/>' +
    '<path d="M6.8 8.4h10.4v10.8a1.8 1.8 0 0 1-1.8 1.8H8.6a1.8 1.8 0 0 1-1.8-1.8V8.4Z"/>' +
    '<path d="M6.8 11.2h10.4"/>' +
    '<path d="M9.8 14.6h4.4M9.8 17h4.4"/>' +
    '<path d="M4.4 21.6h15.2"/>',

  /* ---- added after seeing the control room screens ---- */

  /* screw conveyor */
  screw:
    '<rect x="2" y="9" width="20" height="6.6" rx="3.2"/>' +
    '<path d="M4.6 9.5 7.1 15.1M8.1 9.5l2.5 5.6M11.6 9.5l2.5 5.6M15.1 9.5l2.5 5.6M18.6 9.5l1.9 4.4"/>' +
    '<path d="M12 4.8v3.6"/>' +
    '<path d="M10.5 7 12 8.5l1.5-1.5"/>' +
    '<path d="M19.4 15.8v3"/>' +
    '<path d="M4.6 18.8h3.2M14.6 18.8h3.2"/>',

  /* bin discharger / live bottom bin */
  binfeeder:
    '<path d="M3.8 4h16.4l-2.2 8.2H6L3.8 4Z"/>' +
    '<path d="M2.6 4h18.8"/>' +
    '<path d="M8 6.8h8"/>' +
    '<rect x="5" y="12.6" width="14" height="5.2" rx="2.6"/>' +
    '<path d="M7.2 13.2 9.2 17.2M10.2 13.2l2 4M13.2 13.2l2 4M16.2 13.2l1.8 3.6"/>' +
    '<path d="M12 18v2.6"/>',

  /* pump with its motor */
  pump:
    '<circle cx="10.4" cy="11.4" r="5.4"/>' +
    '<circle cx="10.4" cy="11.4" r="1.4"/>' +
    '<path d="M10.4 6V3.2M5 11.4H2.2"/>' +
    '<rect x="16" y="8.6" width="5.8" height="5.8" rx="1.4"/>' +
    '<path d="M15.8 11.4h.2"/>' +
    '<rect x="5.4" y="17.6" width="13.2" height="2.6" rx="1"/>',

  /* extraction fan */
  fan:
    '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="2.6"/>' +
    '<circle cx="12" cy="12" r="1.6"/>' +
    '<path d="M12 10.4c0-2.7 1.5-4.3 3.5-3.6 1.4.5 1.3 2.5-.7 3.5"/>' +
    '<path d="M13.4 12.9c2.4 1.2 2.9 3.2 1.2 4.4-1.2.9-2.8-.4-2.9-2.6"/>' +
    '<path d="M10.5 12.9c-2.4 1.2-4 .2-3.6-1.8.2-1.4 2.3-1.8 3.7 0"/>',

  /* air-cooled condenser */
  condenser:
    '<rect x="2.6" y="10.2" width="18.8" height="7.8" rx="1.6"/>' +
    '<path d="M6 10.2v7.8M9.4 10.2v7.8M12.8 10.2v7.8M16.2 10.2v7.8"/>' +
    '<circle cx="7.6" cy="6.2" r="2.8"/>' +
    '<circle cx="16.4" cy="6.2" r="2.8"/>' +
    '<path d="M7.6 3.4v5.6M4.8 6.2h5.6M16.4 3.4v5.6M13.6 6.2h5.6"/>' +
    '<path d="M5 18v2.4M19 18v2.4"/>',

  /* biofilter bed with irrigation sprays */
  biofilter:
    '<rect x="2.6" y="9.6" width="18.8" height="8.8" rx="1.8"/>' +
    '<path d="M4.6 12.6h14.8M4.6 15.4h14.8"/>' +
    '<path d="M12 2.8v3.6M6 6.4h12"/>' +
    '<path d="M7.6 6.4 6.6 8.8M12 6.4v2.4M16.4 6.4l1 2.4"/>' +
    '<path d="M1 14h1.6M21.4 14H23"/>' +
    '<path d="M4.4 18.4v2.2M19.6 18.4v2.2"/>',

  /* saturator — pressure vessel with air in water */
  saturator:
    '<path d="M7 7.2a5 2.6 0 0 1 10 0v8.8a5 2.6 0 0 1-10 0V7.2Z"/>' +
    '<path d="M7 7.2a5 2.6 0 0 0 10 0"/>' +
    '<circle cx="10.4" cy="12.2" r=".8"/><circle cx="13.6" cy="14" r=".8"/>' +
    '<circle cx="12" cy="10.2" r=".8"/>' +
    '<path d="M12 2.6v2.2"/>' +
    '<path d="M9.6 19.4v2.2M14.4 19.4v2.2"/>',

  /* chemical dosing pump and drum */
  dosingpump:
    '<path d="M5.4 9.4h8.8v8.8a1.8 1.8 0 0 1-1.8 1.8H7.2a1.8 1.8 0 0 1-1.8-1.8V9.4Z"/>' +
    '<path d="M5.4 12h8.8"/>' +
    '<circle cx="18" cy="6.6" r="2.6"/>' +
    '<path d="M18 9.2v3M18 4V2.4"/>' +
    '<path d="M9.8 9.4V6.6h5.6"/>' +
    '<path d="M3.6 20.6h13"/>',

  /* blood plant */
  bloodplant:
    '<rect x="4.6" y="6" width="14.8" height="13.4" rx="2"/>' +
    '<path d="M4.6 9h14.8"/>' +
    '<path d="M12 11.4c-1.6 2-2.6 3-2.6 4.3a2.6 2.6 0 0 0 5.2 0c0-1.3-1-2.3-2.6-4.3Z"/>' +
    '<path d="M8 6V3.4h8V6"/>' +
    '<path d="M7 19.4v2.2M17 19.4v2.2"/>',

  /* valve */
  valve:
    '<path d="M4 7.4 12 12 4 16.6V7.4Z"/>' +
    '<path d="M20 7.4 12 12l8 4.6V7.4Z"/>' +
    '<path d="M12 12V6.6"/>' +
    '<rect x="9.4" y="3" width="5.2" height="3.6" rx="1"/>' +
    '<path d="M1.6 12H4M20 12h2.4"/>',

  /* fallback */
  generic:
    '<rect x="4" y="5" width="16" height="14" rx="2"/>' +
    '<path d="M7.4 9.2h9.2M7.4 12.4h9.2M7.4 15.6h5.6"/>'
};
