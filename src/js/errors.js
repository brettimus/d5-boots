module.exports = {
    xValueError: xValueError,
    yValueError: yValueError,
};

function xValueError() {
    var message = "I don't know how to access the data's x-values. "+
                    "Configure my getter with <sample code>.";
    throw new Error(message);
}

function yValueError() {
    var message = "I don't know how to access the data's y-values. "+
                    "Configure my getter with <sample code>.";
    throw new Error(message);
}