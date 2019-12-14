'use strict';

Array.prototype.findIndexM = function (value) {
    for (var i = 0; i < this.length; i++) {
        if (this[i].handle === value) {
            return i;
        }
    }
    return false;
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
