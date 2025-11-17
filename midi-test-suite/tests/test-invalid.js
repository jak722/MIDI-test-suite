

const JZZ = require('jzz');
const prompts = require('prompts');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  const jzz = JZZ();
  const outputs = jzz.info().outputs;

  if (outputs.length === 0) {
    console.error('No MIDI output devices found!');
    process.exit(1);
  }

  // Prompt user to select device correctly
  const response = await prompts({
    type: 'select',
    name: 'output',
    message: 'Select MIDI output device for the invalid test:',
    choices: outputs.map(dev => ({ title: dev.name, value: dev.name }))
  });

  const OUTPUT_NAME = response.output;
  const out = jzz.openMidiOut(OUTPUT_NAME);

  console.log(`Sending invalid MIDI messages to "${OUTPUT_NAME}"...`);

  const invalidMessages = [
  	[0x90],
    [0x90, 60],          
    [0xFF, 0x00, 0x00],  
    [0x90, 60, 127, 99], 
    [0xF0, 0x01, 0x02],  
    [0x12, 0x45, 0x01],
    [0xFF, 0x12, 0x34],
    [0x00, 0x45, 0x67],
    [0x90, 60, 127, 99],
	[0xB0, 10, 64, 1, 2],
	[0xF0, 0x01, 0x02],
	[0xF0, 0x01, 0x02, 0xF7, 0x99],
	[0x12, 0x45, 0x01]
  ];

  for (const msg of invalidMessages) {
    for (let i = 0; i < 20; i++) {
      console.log('Sending invalid message:', msg);
      out.send(msg);
      await delay(10);

}
  }

  console.log('All invalid messages sent!');
}

main();
/*
const JZZ = require('jzz');
const OUTPUT_NAME = 'Traktor Kontrol S2 MK3';
const out = JZZ().openMidiOut(OUTPUT_NAME);

console.log('Sending invalid MIDI...');

out.send([0x90, 60]);         // missing velocity
out.send([0xFF, 0x00, 0x00]); // invalid status
out.send([0x12, 0x99, 0x45]); // random invalid bytes

console.log('Sent. Check device behavior.');
 */