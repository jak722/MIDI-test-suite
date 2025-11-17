// listen.mjs
import { WebMidi } from "webmidi";

WebMidi.enable({ sysex: true }).then(() => {
  const input = WebMidi.getInputByName("Traktor Kontrol S2 MK3");
  if (!input) {
    console.error("Input not found. Available inputs:", WebMidi.inputs.map(i=>i.name));
    return;
  }

  input.addListener("noteon", "all", e => console.log("noteon:", e.note.number, "velocity:", e.velocity, "channel:", e.channel));
  input.addListener("noteoff", "all", e => console.log("noteoff:", e.note.number));
  input.addListener("controlchange", "all", e => console.log("cc:", e.controller.number, "value:", e.value));
  input.addListener("sysex", "all", e => console.log("sysex:", e.data));

  console.log("Listening - press buttons on controller...");
}).catch(err => console.error("enable error", err));
