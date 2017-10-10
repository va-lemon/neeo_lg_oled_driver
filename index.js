'use strict';

//const brainIp = process.env.BRAINIP;
const brainIp = 'neeo-hostname.local'; // Update this with your NEEO Brain's hostname

const neeoapi = require('neeo-sdk');
const controller = require('./controller');

console.log('NEEO - LG OLED TV Driver');
console.log('---------------------------------------------');

// first we set the device info, used to identify it on the Brain
const lgIPDriver = neeoapi.buildDevice('OLED TV IP')
  .setManufacturer('LG')
  .addAdditionalSearchToken('tv')
  .addAdditionalSearchToken('oled')
  .setType('TV')

  // Then we add the capabilities of the device

  .addButton({ name: 'input hdmi1', label: 'INPUT HDMI 1' })
  .addButton({ name: 'input hdmi2', label: 'INPUT HDMI 2' })
  .addButton({ name: 'input hdmi3', label: 'INPUT HDMI 3' })
  .addButton({ name: 'input hdmi4', label: 'INPUT HDMI 4' })
  .addButton({ name: 'input avav1', label: 'INPUT AV' })
  .addButton({ name: 'input dtv', label: 'INPUT ANTENNA' })
  .addButton({ name: 'NETFLIX' })
  .addButton({ name: 'AMAZON' })
  .addButton({ name: 'PICTURE MODE' })
  .addButton({ name: 'EXIT' })
  .addButton({ name: 'SETTINGS' })
  .addButton({ name: 'INPUTS' })
  .addButton({ name: '3D' })
  .addButton({ name: 'LIVE TV' })
  .addButton({ name: 'ASPECT RATIO' })
  .addButton({ name: 'USER GUIDE' })
  .addButton({ name: 'SCREEN OFF' })
  .addButtonGroup('Power')
  .addButtonGroup('volume')
  .addButtonGroup('Menu and Back')
  .addButtonGroup('Controlpad')
  .addButtonGroup('Channel Zapper')
  .addButtonGroup('Numpad')
  .addButtonGroup('Transport')
  .addButtonGroup('Transport Search')

  //HINT: the next four lines are just to demonstrate how to manually add buttons, you could also use .addButtonGroup('Color Buttons')
/*
  .addButton({ name: 'FUNCTION RED' })
  .addButton({ name: 'FUNCTION GREEN' })
  .addButton({ name: 'FUNCTION YELLOW' })
  .addButton({ name: 'FUNCTION BLUE' })
*/
  .addButtonHander(controller.onButtonPressed);

function startLgOledDriver(brain) {
  console.log('NEEO - Start LG OLED Driver');
  neeoapi.startServer({
    brain,
    port: 6338,
    name: 'lg-oled-driver',
    devices: [lgIPDriver]
  })
  .then(() => {
    console.log('# READY! use the NEEO app to search for "LG OLED TV".');
  })
  .catch((error) => {
    //if there was any error, print message out to console
    console.error('ERROR!', error.message);
    process.exit(1);
  });
}

if (brainIp) {
  console.log('- use NEEO Brain IP from env variable', brainIp);
  startLgOledDriver(brainIp);
} else {
  console.log('- discover one NEEO Brain...');
  neeoapi.discoverOneBrain()
    .then((brain) => {
      console.log('- Brain discovered:', brain.name);
      sstartLgOledDriver(brain);
    });
}

