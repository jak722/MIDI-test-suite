const JZZ = require('jzz');

const midi = JZZ();
const info = midi.info();

console.log('Inputs:');
info.inputs.forEach((p, i) => console.log(`[${i}] ${p.name}`));

console.log('\nOutputs:');
info.outputs.forEach((p, i) => console.log(`[${i}] ${p.name}`));
