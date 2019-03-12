import fs from 'fs';

export default class Log {
  constructor(logging) {
    this.logging = logging;
    this.log();
  }

  async log() {
    const date = new Date();
    const time = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
    if (this.logging) {
      const logdir = `${__dirname}/logs`;
      // Defines log filename and message timing
      const day = date.getDate()<10 ? `0${date.getDate()}`:date.getDate();
      const month = date.getMonth()<9 ? `0${date.getMonth()+1}`:date.getMonth()+1;
      const year = date.getFullYear();
      let file = `${year}${month+1}${day}.morm.log`;

      try {
        // Checks if log dir exists and is writable, or creates / grants access to it
        if (!fs.existsSync(logdir)) fs.mkdirSync(logdir);
        if (!fs.accessSync(logdir)) fs.chmodSync(logdir,644);
        const logStream = await fs.createWriteStream(`${logdir}/${file}`,{flags:'a'});
        process.stdout.write = process.stderr.write = logStream.write.bind(logStream);
      } catch(e) {
        console.log("Error while creating log directory.");
        console.log(e.message);
      }
    }
  }

  // Writing raw sql queries
  w(message) {
    const date = new Date();
    const time = `[${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
    process.stdout.write(`${time} ${message}\n`);
  }

  // Writing error logs
  e(message) {
    // TODO
  }
}
