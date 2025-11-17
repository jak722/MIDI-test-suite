// echo.mjs
import { WebMidi } from "webmidi";

WebMidi.enable({ sysex: true }).then(() => {
  const input = WebMidi.getInputByName("Traktor Kontrol S2 MK3");
  const output = WebMidi.getOutputByName("Traktor Kontrol S2 MK3");
  if (!input || !output) {
    console.error("Ports not found. Inputs:", WebMidi.inputs.map(i=>i.name), "Outputs:", WebMidi.outputs.map(o=>o.name));
    return;
  }

  input.addListener("midimessage", "all", e => {
    // e.data is Uint8Array of raw bytes; re-send the same bytes
    output.send([...(e.data)]);
    console.log("Echoed:", [...e.data]);
  });

  console.log("Echoing incoming messages back to the controller.");
}).catch(console.error);
