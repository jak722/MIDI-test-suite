const JZZ = require('jzz');
const prompts = require('prompts');

async function main() {
  const jzz = JZZ();

  // Get all available MIDI outputs
  const outputs = jzz.info().outputs;
  if (outputs.length === 0) {
    console.error('No MIDI output devices found!');
    process.exit(1);
  }

  // Ask the user to select MIDI output
  const outputResponse = await prompts({
    type: 'select',
    name: 'output',
    message: 'Select MIDI output device:',
    choices: outputs.map(dev => ({ title: dev.name, value: dev.name }))
  });

  const out = jzz.openMidiOut(outputResponse.output);

  // Ask user for LED test parameters
  const response = await prompts([
    {
      type: 'number',
      name: 'channel',
      message: 'Enter MIDI channel (1-16):',
      initial: 1,
      min: 1,
      max: 16
    },
    {
      type: 'number',
      name: 'minNote',
      message: 'Enter minimum note number:',
      initial: 36,
      min: 0,
      max: 127
    },
    {
      type: 'number',
      name: 'maxNote',
      message: 'Enter maximum note number:',
      initial: 96,
      min: 0,
      max: 127
    },
    {
      type: 'number',
      name: 'duration',
      message: 'Enter LED ON time (ms):',
      initial: 300,
      min: 50,
      max: 5000
    }
  ]);



  const { channel, minNote, maxNote, duration } = response;

  console.log(`Running LED test on channel ${channel}, notes ${minNote}-${maxNote}, duration ${duration}ms`);

  for (let note = minNote; note <= maxNote; note++) {
    console.log(`Flashing note: ${note}`);
    out.noteOn(channel-1, note, 127);       // LED ON
    await new Promise(r => setTimeout(r, duration));
    out.noteOn(channel-1, note, 0);         // LED OFF
  }

  console.log('LED test complete!');
}

main();
