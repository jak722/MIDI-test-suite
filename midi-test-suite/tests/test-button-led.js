const JZZ = require('jzz');
const prompts = require('prompts');

async function main() {
  try {
    const jzz = JZZ();

    const inputs = jzz.info().inputs;
    const outputs = jzz.info().outputs;

    if (inputs.length === 0 || outputs.length === 0) {
      console.error('No MIDI devices found!');
      process.exit(1);
    }

    const inputResponse = await prompts({
      type: 'select',
      name: 'input',
      message: 'Select MIDI input device:',
      choices: inputs.map(dev => ({ title: dev.name, value: dev.name }))
    });

    const outputResponse = await prompts({
      type: 'select',
      name: 'output',
      message: 'Select MIDI output device:',
      choices: outputs.map(dev => ({ title: dev.name, value: dev.name }))
    });

    const input = jzz.openMidiIn(inputResponse.input);
    const output = jzz.openMidiOut(outputResponse.output);

    console.log(`Listening on "${inputResponse.input}" and controlling LEDs on "${outputResponse.output}"...`);

    process.on('uncaughtException', err => {
      console.warn('Caught exception:', err.message);
    });

    input.connect(msg => {
      console.log('MIDI Input →', msg.toString());

      if (msg.isNoteOn()) {
        const note = msg.getNote();
        const channel = msg.getChannel();
        console.log(`Button pressed (Note On) → Note: ${note}, Channel: ${channel}`);
        output.noteOn(channel, note, 127); // LED on
        setTimeout(() => output.noteOn(channel, note, 0), 300); // LED off after 300ms
      }

      if (msg.isControlChange()) {
        const controller = msg.getController();
        const channel = msg.getChannel();
        console.log(`Button pressed (CC) → Controller: ${controller}, Channel: ${channel}`);
        output.controlChange(channel, controller, 127); // LED on
        setTimeout(() => output.controlChange(channel, controller, 0), 300); // LED off
      }
    });

  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

main();
