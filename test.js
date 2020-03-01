$.fn.extend({
    check: function() {
        console.log('1111')
        return this.each(function() {
            this.checked = true;
        });
    },
    uncheck: function() {
        return this.each(function() {
            this.checked = false;
        });
    }
});
