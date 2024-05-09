import { scrypt, randomBytes } from 'node:crypto'
import { createInterface } from 'node:readline';

const rl = createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.stdoutMuted = true;

rl.question('Password: ', function(password) {
	const salt = randomBytes(16).toString('hex')
	rl.close();

	scrypt(password, salt, 64, (err, derivedKey) => {
		if(err) {
			exit("Can't create password")
		}
		console.log(`\n${salt}:${derivedKey.toString('hex')}`)
	})
});

rl._writeToOutput = function _writeToOutput(stringToWrite) {
	if (rl.stdoutMuted) {
		rl.output.write("*");
	} else {
		rl.output.write(stringToWrite);
	}
};

