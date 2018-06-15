var locker = require('./locker');
// locker.unlock(function(){});
locker.lock(function(err) {
    if(err) throw err;
    // ...
    locker.unlock(function(){});
});