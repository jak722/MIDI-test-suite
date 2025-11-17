// list-ports.mjs
import { WebMidi } from "webmidi";

WebMidi.enable().then(() => {
  console.log("INPUTS:");
  WebMidi.inputs.forEach((i, idx) => console.log(idx, i.name));
  console.log("\nOUTPUTS:");
  WebMidi.outputs.forEach((o, idx) => console.log(idx, o.name));
  WebMidi.disable();
}).catch(err => {
  console.error("WebMidi enable failed:", err);
});
