let thenable = {
    then: function(resolve, reject) {
        resolve(2)
    }
}
Promise.resolve(thenable).then((v => {
    console.log(v)
}));





