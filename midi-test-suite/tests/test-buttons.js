const JZZ = require('jzz');
const prompts = require('prompts');

async function main() {
  const jzz = JZZ();

  // Get all available MIDI input devices
  const inputs = jzz.info().inputs;
  if (inputs.length === 0) {
    console.error('No MIDI input devices found!');
    process.exit(1);
  }

  // Prompt the user to select a MIDI input device
  const response = await prompts({
    type: 'select',
    name: 'input',
    message: 'Select MIDI input device to test buttons:',
    choices: inputs.map(dev => ({ title: dev.name, value: dev.name }))
  });

  const INPUT_NAME = response.input;
  const input = jzz.openMidiIn(INPUT_NAME);

  console.log(`Listening for button presses on "${INPUT_NAME}"... Press Ctrl+C to exit.`);

  // Listen for all MIDI messages
  input.connect(msg => {
    console.log('MIDI Message →', msg.toString());

    // Optionally, filter Note On messages (buttons)
    if (msg.toString().startsWith('Note On')) {
      const note = msg.getNote();
      const velocity = msg.getVelocity();
      const channel = msg.getChannel();
      console.log(`Button pressed → Note: ${note}, Velocity: ${velocity}, Channel: ${channel}`);
    }

    // Optionally, filter CC messages (faders/knobs)
    if (msg.toString().startsWith('CC')) {
      const controller = msg.getController();
      const value = msg.getValue();
      const channel = msg.getChannel();
      console.log(`Fader/Knob → CC: ${controller}, Value: ${value}`);
    }
  });
}

main();



/*const JZZ = require('jzz');
const INPUT_NAME = 'Traktor Kontrol S2 MK3';

JZZ().openMidiIn(INPUT_NAME).connect(msg => {
  console.log('Button Press →', msg.toString());
});
*/