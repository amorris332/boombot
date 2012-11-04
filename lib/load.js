var fs = require('fs')
/**/// Public: Parses config.json settings
/**///
/**/// Args
/**/// filepath - optional filepath value for debugging etc
/**///
/**/// Returns
/**/// configuration - return parsed JSON object
exports.ParseConfig = function(version, filepath) {
  try {
    console.log('*******Loading Configuration*******')
    filepath = (filepath === undefined) ? 'config.json' : filepath;
    config = JSON.parse(fs.readFileSync(filepath, 'ascii'))
    console.log('*******Configuration Loaded********')
    console.log('***********************************')
    console.log('**********BOOMBOT '+version+'***********')
    console.log('***********************************')
    console.log('*******Initializing Systems********')
    return config
  } catch(err) {
    console.log(err)
    console.log('[ ERROR ] : Error loading config.json. Check that your config file exists and is valid JSON.')
    process.exit(33)
  }
}
/**/// Public: loads the blacklist store
/**///
/**/// Returns
/**/// blacklist - parsed blacklist object
exports.LoadBlacklist = function() {
  try {
    console.log('*********Loading blacklist*********')
    blacklist = JSON.parse(fs.readFileSync('./models/store/blacklist.json', 'ascii'))
    console.log('*********Blacklist Loaded**********')
    console.log(blacklist)
    return blacklist
  } catch(err) {
    console.log(err)
    console.log('[ ERROR ] : Error loading blacklist.json. Check that your blacklist file exists and is valid JSON or empty brackets.')
    process.exit(33)
  }
}
/**/// Public: Loads all the command files from each location
/**///
/**/// Returns
/**/// return - fills commands array from all command sources
exports.LoadCommands = function(commands) {
  /**/// Private: loads core scripts from lib/core
  /**///
  /**/// Returns
  /**/// return - for each command in the base_controls array we will build the commands array
  console.log('*******Loading Core Scripts********')
  var base_controls = require('../lib/core/base_controls')
  for (i = 0; i < base_controls.length; i++) {
    console.log('Loading: ' + base_controls[i].trigger)
    commands.push(base_controls[i])
  }
  /**/// Private: loads queue scripts from lib/core
  /**///
  /**/// Returns
  /**/// return - for each command in the queue_controls array we will build the commands array
  console.log('*******Loading Queue Scripts********')
  var queue_controls = require('../lib/core/queue_controls')
  for (i = 0; i < queue_controls.length; i++) {
    console.log('Loading: ' + queue_controls[i].trigger)
    commands.push(queue_controls[i])
  }
  /**/// Private: loads scripts from optional scripts folder
  /**///
  /**/// Returns
  /**/// return - for each file in the scripts folder we will build the commands array
  try {
    var filenames = fs.readdirSync('./scripts')
    console.log('*****Loading Optional Scripts******')
    for (i = 0; i < filenames.length; i++) {
      if (filenames[i] != '.DS_Store') {
        console.log('Loading: ' + filenames[i])
        var command = require('../scripts/' + filenames[i])
        commands.push({'trigger': command.trigger, 'listed': command.listed, 'script': command.script})
      }
    }
  } catch(err) {
    console.log(err)
    console.log('[ ERROR ] : Error loading script(s). Please fix or remove the failed script(s) shown above')
  }
  return commands
}